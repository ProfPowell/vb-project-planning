/**
 * kanban-board: Columnar drag-and-drop board
 *
 * Light DOM component that creates a board with user-defined columns,
 * each containing a <drag-surface> for cross-column drag-and-drop.
 * Works with any draggable content — user-story cards, articles, or
 * any element with draggable="true" and data-id.
 *
 * @attr {string} src - URL to JSON data for columns and items
 * @attr {string} title - Optional heading above the board
 * @attr {boolean} compact - Reduced spacing variant
 *
 * Children use:
 * @attr {string} data-column - Column identifier (on <section>)
 * @attr {string} data-column-label - Display label for the column header (on <section>)
 * @attr {number} data-wip - Optional WIP limit for the column (on <section>)
 * @attr {string} data-column-color - Optional color token for column tint (on <section>)
 *
 * @fires kanban-board:transfer - Item moved between columns
 * @fires kanban-board:reorder - Item reordered within a column
 * @fires kanban-board:ready - Once per element, after the first render (with src: after the JSON renders)
 * @fires kanban-board:wip-exceeded - Fired when a drop takes a column over its WIP limit
 * @fires kanban-board:items-changed - { items, source: 'api' | 'drag' | 'src' }
 * @fires kanban-board:upgraded - Each time the board connects and upgrades
 *
 * @example
 * <kanban-board>
 *   <section data-column="backlog" data-column-label="Backlog">
 *     <article draggable="true" data-id="task-1">Design review</article>
 *   </section>
 *   <section data-column="doing" data-column-label="In Progress" data-wip="3">
 *     <article draggable="true" data-id="task-2">API integration</article>
 *   </section>
 * </kanban-board>
 */

import { registerComponent } from '../../lib/bundle-registry.js';
import { VBElement } from '../../lib/vb-element.js';
import { VBCollection } from '../../lib/vb-collection.js';
import { viewTransitionSwap } from '../../lib/vb-view-transition.js';
import {
  SrcLoader, announce, createLiveRegion, createStoryCard, isStoryRecord, itemLabel, syncPlaceholder, titleCase,
} from '../../lib/board-surface.js';

class KanbanBoard extends VBCollection(VBElement) {
  static get observedAttributes() { return ['src', 'compact', 'title']; }
  static keyOf(item) { return item.id ?? item.storyId; }

  static #instanceCount = 0;

  /** @type {HTMLDivElement | null} */
  #columnsEl = null;
  /** @type {Record<string, HTMLElement>} */
  #surfaces = {};
  /** @type {Record<string, HTMLElement>} */
  #columnEls = {};
  /** @type {HTMLDivElement | null} */
  #liveRegion = null;
  /** @type {HTMLHeadingElement | null} */
  #titleEl = null;
  /** @type {string} */
  #groupId = '';
  /** @type {Array<{ id: string, label: string, wip: number | null, color: string | null }>} */
  #columns = [];
  /** @type {((item: any) => Element) | null} */
  #renderItem = null;
  /** Shell built (survives disconnect so a moved board keeps its cards). */
  #built = false;
  /** Listeners attached for the current connection. */
  #wired = false;
  #readyFired = false;
  #loader = new SrcLoader();

  setup() {
    if (!this.#groupId) this.#groupId = `kb-${++KanbanBoard.#instanceCount}`;

    if (!this.#built) {
      this.#built = true;
      this.#buildFromSections();
    }

    if (!this.#wired) {
      this.#wired = true;
      this.listen(this, 'drag-surface:reorder', this.#onReorder);
      this.listen(this, 'drag-surface:transfer', this.#onTransfer);
    }

    // Data mode: fetch once per src value; ready fires after it renders.
    const src = this.getAttribute('src');
    if (src) {
      if (src !== this.#loader.url) this._loadSrc(src);
      return;
    }

    if (!this.#readyFired) this.#dispatchReady();
  }

  /**
   * First build: parse the authored `<section data-column>` children,
   * move their cards into drag-surfaces, and add the title + live region.
   */
  #buildFromSections() {
    const sections = /** @type {HTMLElement[]} */ ([
      ...this.querySelectorAll(':scope > section[data-column]')
    ]);
    const parsed = sections.map(section => this.#parseSection(section));
    for (const section of sections) section.remove();

    this.#syncTitle();

    this.#liveRegion = createLiveRegion('kb-live-region');
    this.#columns = parsed.map(p => p.meta);
    this.#columnsEl = this.#assembleShell(parsed.map(p => p.children));
    this.append(this.#columnsEl, this.#liveRegion);
    this._postRender();
    this.#seedFromDom();
  }

  /**
   * @param {HTMLElement} section
   * @returns {{ meta: { id: string, label: string, wip: number | null, color: string | null }, children: HTMLElement[] }}
   */
  #parseSection(section) {
    const id = section.getAttribute('data-column') || '';
    const label = section.getAttribute('data-column-label') || titleCase(id);
    const wipAttr = section.getAttribute('data-wip');
    const wip = wipAttr ? parseInt(wipAttr, 10) : null;
    const color = section.getAttribute('data-column-color') || null;
    const children = /** @type {HTMLElement[]} */ ([...section.children]);
    return { meta: { id, label, wip: wip !== null && isNaN(wip) ? null : wip, color }, children };
  }

  /** Create, update, or remove the optional heading from the title attribute. */
  #syncTitle() {
    const title = this.getAttribute('title');
    if (title) {
      if (!this.#titleEl) {
        this.#titleEl = document.createElement('h2');
        this.#titleEl.className = 'kb-title';
        this.prepend(this.#titleEl);
      }
      this.#titleEl.textContent = title;
    } else if (this.#titleEl) {
      this.#titleEl.remove();
      this.#titleEl = null;
    }
    this.#columnsEl?.setAttribute('aria-label', title || 'Kanban board');
  }

  #dispatchReady() {
    this.#readyFired = true;
    this.dispatchEvent(new CustomEvent('kanban-board:ready', {
      bubbles: true,
      detail: {
        columnCount: this.#columns.length,
        itemCount: this.items.length,
      },
    }));
  }

  /** @param {Event} e */
  #onReorder = (e) => {
    const detail = /** @type {CustomEvent} */ (e).detail;
    const surface = /** @type {HTMLElement | null} */ (/** @type {HTMLElement} */ (e.target).closest('drag-surface'));
    const columnId = this.#findColumnForSurface(surface);
    if (!columnId) return;

    this.#updateCount(columnId);
    this.#syncItemsFromDom('drag');

    this.dispatchEvent(new CustomEvent('kanban-board:reorder', {
      bubbles: true,
      detail: {
        itemId: detail.itemId,
        column: columnId,
        oldIndex: detail.oldIndex,
        newIndex: detail.newIndex,
      },
    }));
  };

  /** @param {Event} e */
  #onTransfer = (e) => {
    const detail = /** @type {CustomEvent} */ (e).detail;
    const fromSurface = detail.fromSurface;
    const toSurface = detail.toSurface;
    const fromColumn = this.#findColumnForSurface(fromSurface);
    const toColumn = this.#findColumnForSurface(toSurface);
    if (!fromColumn || !toColumn) return;

    if (detail.item) detail.item.setAttribute('data-column', toColumn);

    this.#updateCount(fromColumn);
    this.#updateCount(toColumn);
    syncPlaceholder(toSurface, 'kb-empty', 'No items');
    syncPlaceholder(fromSurface, 'kb-empty', 'No items');

    announce(this.#liveRegion,
      `${itemLabel(detail.item)} moved from ${this.#columnLabel(fromColumn)} to ${this.#columnLabel(toColumn)}`);

    this.#syncItemsFromDom('drag');

    this.dispatchEvent(new CustomEvent('kanban-board:transfer', {
      bubbles: true,
      detail: {
        itemId: detail.itemId,
        fromColumn,
        toColumn,
        newIndex: detail.newIndex,
        item: detail.item,
      },
    }));

    const toCount = toSurface.querySelectorAll(':scope > [draggable="true"]').length;
    const toColMeta = this.#columns.find(c => c.id === toColumn);
    if (toColMeta && toColMeta.wip != null && toCount > toColMeta.wip) {
      this.dispatchEvent(new CustomEvent('kanban-board:wip-exceeded', {
        bubbles: true,
        detail: {
          column: toColumn,
          limit: toColMeta.wip,
          count: toCount,
        },
      }));
    }
  };

  /**
   * Walk the rendered drag-surfaces and register each draggable child by
   * its data-id so VBCollection's diff treats them as managed nodes.
   */
  #seedFromDom() {
    /** @type {any[]} */
    const items = [];
    /** @type {Map<unknown, Element>} */
    const nodeMap = new Map();
    for (const [columnId, surface] of Object.entries(this.#surfaces)) {
      const draggables = surface.querySelectorAll(':scope > [draggable="true"]');
      for (const el of draggables) {
        const id = el.getAttribute('data-id');
        if (!id) continue;
        items.push({ id, column: columnId });
        nodeMap.set(id, el);
      }
    }
    this._seedCollection(items, nodeMap);
  }

  /**
   * Re-derive the internal items array from current DOM order (used after
   * a drag mutates the DOM directly). Preserves consumer-supplied fields
   * by carrying over each item's prior shape and just updating column.
   * Emits `kanban-board:items-changed` with the given source.
   *
   * @param {'drag' | 'api' | 'attribute'} source
   */
  #syncItemsFromDom(source) {
    /** @type {any[]} */
    const next = [];
    /** @type {Map<string, any>} */
    const previous = new Map();
    for (const it of this.items) {
      const k = String(it.id ?? it.storyId ?? '');
      if (k) previous.set(k, it);
    }
    for (const [columnId, surface] of Object.entries(this.#surfaces)) {
      const draggables = surface.querySelectorAll(':scope > [draggable="true"]');
      for (const el of draggables) {
        const id = el.getAttribute('data-id');
        if (!id) continue;
        const prior = previous.get(id);
        next.push(prior ? { ...prior, column: columnId } : { id, column: columnId });
      }
    }
    this._setItemsSilently(next);
    this._emit('items-changed', { items: next }, source);
  }

  teardown() {
    // Listeners are removed by VBElement. The built shell and every card
    // stay in place so a board that is moved in the DOM keeps its content;
    // the next connect only re-attaches listeners.
    this.#wired = false;
  }

  // ── Data API (HTML-first / JS-first dual contract) ──────────────

  /**
   * The current column definitions. After upgrade this reflects the parsed
   * `<section data-column>` children. Setting replaces all columns and
   * rebuilds the shell: existing cards whose `column` still exists are
   * moved (same DOM nodes) into the new columns; cards whose column is
   * gone are removed from the board and from `.items` (an
   * `items-changed` event with source `api` reports the drop).
   */
  get columns() {
    return this.#columns.map(c => ({
      id: c.id, label: c.label, wip: c.wip ?? undefined, color: c.color ?? undefined,
    }));
  }

  set columns(value) {
    const next = (value || []).map(c => ({
      id: c.id, label: c.label || titleCase(c.id),
      wip: c.wip ?? null, color: c.color ?? null,
    }));
    if (!this.#built) {
      // JS-first: columns assigned before the board connected.
      this.#built = true;
      this.#liveRegion = createLiveRegion('kb-live-region');
      this.appendChild(this.#liveRegion);
    }
    const oldShell = this.#columnsEl;
    // Build the new shell off-DOM and update internal refs synchronously
    // so a chained `.items = …` sees the new surfaces immediately.
    this.#columns = next;
    const newShell = this.#assembleShell();
    this.#columnsEl = newShell;
    this.#syncTitle();

    // Re-route existing cards into the new surfaces (node identity kept).
    const before = this.items;
    /** @type {any[]} */
    const kept = [];
    /** @type {Map<unknown, Element>} */
    const nodeMap = new Map();
    for (const it of before) {
      const key = KanbanBoard.keyOf(it);
      const el = this._nodeFor(key);
      const surface = this.#surfaces[it.column];
      if (!el) continue;
      if (surface) {
        surface.appendChild(el);
        kept.push(it);
        nodeMap.set(key, el);
      } else {
        el.remove();
      }
    }
    // Keep .items in the new column order (matching the DOM).
    const order = new Map(next.map((c, i) => [c.id, i]));
    kept.sort((a, b) => (order.get(a.column) ?? 0) - (order.get(b.column) ?? 0));
    this._seedCollection(kept, nodeMap);
    this._postRender();
    if (kept.length !== before.length) this._emit('items-changed', { items: kept }, 'api');

    const swap = () => {
      if (oldShell) oldShell.remove();
      this.#attachShell(newShell);
    };
    if (this.hasAttribute('data-upgraded') && oldShell) {
      viewTransitionSwap(this, swap, 'kb-vt');
    } else {
      swap();
    }
  }

  /**
   * Optional custom item renderer. When set, replaces the default
   * `<work-item>` factory used by the `.items` setter.
   */
  get renderItem() { return this.#renderItem; }
  set renderItem(fn) { this.#renderItem = typeof fn === 'function' ? fn : null; }

  /**
   * VBCollection hook: build a fresh element for a new key.
   * Default: a `<work-item>` with the item's fields applied via .data.
   * Always returns a draggable element with data-id set for drag-surface.
   */
  _renderItem(item) {
    let el;
    if (this.#renderItem) {
      const out = this.#renderItem(item);
      if (!(out instanceof Element)) {
        throw new Error('kanban-board: renderItem must return an Element');
      }
      el = out;
    } else {
      el = this.#defaultRenderItem(item);
    }
    if (!el.hasAttribute('draggable')) el.setAttribute('draggable', 'true');
    if (!el.hasAttribute('data-id')) el.setAttribute('data-id', String(KanbanBoard.keyOf(item)));
    return el;
  }

  /**
   * VBCollection hook: route this item to the drag-surface for its column.
   * @param {any} item
   * @param {any} _existing
   * @returns {any}
   */
  _containerFor(item, _existing) {
    const surface = this.#surfaces[item.column];
    if (!surface) {
      throw new Error(`kanban-board: no column "${item.column}" — set .columns first or include item.column matching an existing column id`);
    }
    // Remove the empty placeholder before inserting managed children.
    const placeholder = surface.querySelector(':scope > .kb-empty');
    if (placeholder) placeholder.remove();
    return surface;
  }

  /**
   * VBCollection hook: refresh count badges, WIP markers, and empty
   * placeholders after every diff.
   */
  _postRender() {
    for (const [id, surface] of Object.entries(this.#surfaces)) {
      this.#updateCount(id);
      syncPlaceholder(surface, 'kb-empty', 'No items');
    }
  }

  /**
   * Default renderer: build a `<work-item>` and apply item fields via .data.
   * Falls back to a plain `<article>` if work-item isn't registered.
   */
  #defaultRenderItem(item) {
    const tag = customElements.get('work-item') ? 'work-item' : 'article';
    const el = /** @type {any} */ (document.createElement(tag));
    if (tag === 'work-item') {
      // Map the kanban item shape to work-item's data shape.
      el.data = {
        itemId: item.id ?? item.storyId,
        type: item.type,
        priority: item.priority,
        status: item.status,
        estimate: item.estimate != null ? String(item.estimate) : undefined,
        assignee: item.assignee,
        title: item.title,
        description: item.description,
        checklist: item.checklist,
        notes: item.notes,
        detail: item.detail,
      };
    } else {
      el.className = 'kb-card';
      el.textContent = item.title || item.label || item.id;
    }
    return el;
  }

  /**
   * Build the kb-columns shell from the current `#columns` metas and
   * populate `#surfaces` / `#columnEls`. `children[i]` (optional) are the
   * authored cards for column i; they are moved into its drag-surface.
   * Returns the detached shell so the caller decides when to attach it
   * (sync, or inside a View Transition callback).
   *
   * @param {HTMLElement[][]} [children]
   * @returns {HTMLDivElement}
   */
  #assembleShell(children = []) {
    this.#surfaces = {};
    this.#columnEls = {};
    const shell = document.createElement('div');
    shell.className = 'kb-columns';
    shell.setAttribute('role', 'region');
    shell.setAttribute('aria-label', this.getAttribute('title') || 'Kanban board');

    let seq = 0;
    this.#columns.forEach((col, i) => {
      const column = document.createElement('section');
      column.className = 'kb-column';
      column.setAttribute('data-column-id', col.id);
      if (col.color) column.setAttribute('data-column-tint', col.color);

      const header = document.createElement('header');
      header.className = 'kb-column-header';
      const h3 = document.createElement('h3');
      h3.textContent = col.label;
      const countBadge = document.createElement('output');
      countBadge.className = 'kb-count';
      countBadge.textContent = '0';
      h3.appendChild(countBadge);
      if (col.wip != null) {
        const wipBadge = document.createElement('span');
        wipBadge.className = 'kb-wip';
        wipBadge.textContent = `/ ${col.wip}`;
        wipBadge.setAttribute('aria-label', `WIP limit ${col.wip}`);
        h3.appendChild(wipBadge);
      }
      header.appendChild(h3);
      column.appendChild(header);

      const surface = document.createElement('drag-surface');
      surface.setAttribute('group', this.#groupId);
      surface.setAttribute('aria-label', `${col.label} items`);
      surface.setAttribute('data-layout', 'stack');
      surface.setAttribute('data-layout-gap', 'xs');
      for (const child of children[i] || []) {
        if (!child.hasAttribute('draggable')) child.setAttribute('draggable', 'true');
        if (!child.hasAttribute('data-id')) child.dataset.id = `kb-item-${seq}`;
        seq += 1;
        surface.appendChild(child);
      }

      column.appendChild(surface);
      shell.appendChild(column);
      this.#surfaces[col.id] = surface;
      this.#columnEls[col.id] = column;
    });

    return shell;
  }

  // ── Attribute changes ────────────────────────────────

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue || !this.#built) return;
    if (name === 'src' && newValue && newValue !== this.#loader.url) this._loadSrc(newValue);
    if (name === 'src' && !newValue) this.#loader.cancel();   // src removed: drop a pending load, keep the cards
    if (name === 'title') this.#syncTitle();
  }

  // ── JSON loading ────────────────────────────────────

  /**
   * Fetch `{ columns: [{ id, label?, wip?, color?, items: [...] }] }` and
   * replace the board with it. One request per src value; a newer src
   * aborts an older in-flight one. Once the data has rendered, fires
   * `kanban-board:items-changed` (source 'src'), and `kanban-board:ready`
   * if it has not fired yet (ready is once per element).
   * @param {string} url
   */
  async _loadSrc(url) {
    if (!url) return;
    try {
      const result = await this.#loader.fetchJson(url);
      if (!result) return;
      const { data, isCurrent } = result;

      /** @type {HTMLElement[][]} */
      const children = [];
      const metas = (data.columns || []).map((/** @type {any} */ col) => {
        children.push((col.items || []).map((/** @type {any} */ item) => this.#cardFromJson(item)));
        const wip = col.wip != null ? parseInt(String(col.wip), 10) : null;
        return {
          id: String(col.id ?? ''),
          label: col.label || titleCase(String(col.id ?? '')),
          wip: wip !== null && isNaN(wip) ? null : wip,
          color: col.color || null,
        };
      });

      const render = () => {
        this.#columnsEl?.remove();
        this.#columns = metas;
        this.#columnsEl = this.#assembleShell(children);
        this.#attachShell(this.#columnsEl);
        this._postRender();
        this.#seedFromDom();
      };
      // viewTransitionSwap runs render synchronously when it can't animate.
      const tx = viewTransitionSwap(this, render, 'kb-vt');
      if (tx) await tx.updateCallbackDone;
      if (!isCurrent()) return;
      this._emit('items-changed', { items: this.items }, 'src');
      if (!this.#readyFired) this.#dispatchReady();
    } catch (err) {
      console.warn(`[kanban-board] Failed to load src="${url}":`, err);
    }
  }

  /**
   * JSON item → card element. Story-shaped records become a `<user-story>`
   * with slotted persona/action/benefit/title; anything else a plain card.
   * @param {Record<string, any>} item
   * @returns {HTMLElement}
   */
  #cardFromJson(item) {
    let el;
    if (isStoryRecord(item)) {
      el = createStoryCard(item, 'minimal');
    } else {
      el = document.createElement('article');
      el.className = 'kb-card';
      el.textContent = item.text || item.label || item.title || '';
    }
    el.setAttribute('draggable', 'true');
    const id = item.id || item.storyId;
    if (id) el.dataset.id = String(id);
    return el;
  }

  // ── Helpers ──────────────────────────────────────────

  /**
   * Insert the columns shell just before the live region (after the title).
   * @param {HTMLElement} shell
   */
  #attachShell(shell) {
    const region = this.#liveRegion;
    this.insertBefore(shell, region?.parentNode ? region : null);
  }

  /**
   * Reverse-lookup: find the column id that owns a given drag-surface.
   * @param {HTMLElement | null} surface
   * @returns {string | null}
   */
  #findColumnForSurface(surface) {
    if (!surface) return null;
    for (const [id, ref] of Object.entries(this.#surfaces)) {
      if (ref === surface) return id;
    }
    return null;
  }

  /**
   * Update the count badge and WIP state for a given column.
   * @param {string} columnId
   */
  #updateCount(columnId) {
    const surface = this.#surfaces[columnId];
    const columnEl = this.#columnEls[columnId];
    if (!surface || !columnEl) return;

    const count = surface.querySelectorAll(':scope > [draggable="true"]').length;
    const badge = columnEl.querySelector('.kb-count');
    if (badge) badge.textContent = String(count);

    // Update WIP state
    const colMeta = this.#columns.find(c => c.id === columnId);
    if (colMeta?.wip !== null && colMeta?.wip !== undefined) {
      if (count > colMeta.wip) {
        columnEl.setAttribute('data-wip-exceeded', '');
      } else {
        columnEl.removeAttribute('data-wip-exceeded');
      }
    }
  }

  /**
   * Get the display label for a column.
   * @param {string} columnId
   * @returns {string}
   */
  #columnLabel(columnId) {
    const col = this.#columns.find(c => c.id === columnId);
    return col?.label || titleCase(columnId);
  }
}

registerComponent('kanban-board', /** @type {any} */ (KanbanBoard));
export { KanbanBoard };
