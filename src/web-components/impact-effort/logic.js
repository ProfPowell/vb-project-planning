/**
 * impact-effort: 2x2 prioritization matrix with drag-and-drop
 *
 * Coordinates four <drag-surface> elements in a Quick Wins / Big Bets /
 * Fill-Ins / Money Pit grid. Items move between quadrants via native
 * drag-and-drop or keyboard reorder (provided by drag-surface).
 *
 * Light DOM component — does NOT import drag-surface; expects it to be
 * registered by the main bundle or pack entry.
 *
 * @attr {string} src - URL to JSON data for items
 * @attr {string} title - Optional heading above the matrix
 * @attr {boolean} compact - Reduced spacing variant
 *
 * Children use:
 * @attr {string} data-quadrant - Target quadrant: quick-wins | big-bets | fill-ins | money-pit
 * @attr {boolean} draggable="true" - Required for drag capability
 * @attr {string} data-id - Stable identifier for the item
 *
 * @fires impact-effort:move - When an item is dragged between quadrants
 * @fires impact-effort:ready - Once per element, after the first render (with src: after the loaded cards are in the DOM)
 * @fires impact-effort:items-changed - { items, source: 'property' | 'src' } after .items is set or src loads
 * @fires impact-effort:upgraded - Each time the matrix connects and upgrades
 */

import { registerComponent } from '../../lib/bundle-registry.js';
import { VBElement } from '../../lib/vb-element.js';
import { viewTransitionSwap } from '../../lib/vb-view-transition.js';
import { diffByKey } from '../../lib/diff-by-key.js';
import { SrcLoader, announce, createLiveRegion, createStoryCard, isStoryRecord, itemLabel, watchSurfaceSemantics } from '../../lib/board-surface.js';

class ImpactEffort extends VBElement {
  static QUADRANTS = ['quick-wins', 'big-bets', 'fill-ins', 'money-pit'];

  static LABELS = {
    'quick-wins': 'Quick Wins',
    'big-bets':   'Big Bets',
    'fill-ins':   'Fill-Ins',
    'money-pit':  'Money Pit',
  };

  static DESCRIPTIONS = {
    'quick-wins': 'High impact · Low effort',
    'big-bets':   'High impact · High effort',
    'fill-ins':   'Low impact · Low effort',
    'money-pit':  'Low impact · High effort',
  };

  static #instanceCount = 0;

  static get observedAttributes() {
    return ['src', 'compact', 'title'];
  }

  /** @type {Record<string, HTMLElement>} */
  #surfaces = {};
  /** @type {HTMLElement | null} */
  #liveRegion = null;
  /** @type {HTMLHeadingElement | null} */
  #titleEl = null;
  /** @type {string} */
  #groupId = '';
  /** Shell built (survives disconnect so a moved matrix keeps its cards). */
  #built = false;
  /** Listeners attached for the current connection. */
  #wired = false;
  #readyFired = false;
  #loader = new SrcLoader();
  /** Items assigned before upgrade, applied on first setup. */
  /** @type {any[] | null} */
  #pending = null;

  /** key → rendered card (authored, assigned, or loaded). */
  /** @type {Map<unknown, Element>} */
  #nodes = new Map();
  /** key → last record assigned via `.items` or `src`. */
  /** @type {Map<unknown, any>} */
  #records = new Map();

  /** Stops the drag-surface semantics observer (see board-surface.js). */
  #stopSemantics = () => {};

  setup() {
    if (!this.#groupId) this.#groupId = `ie-${++ImpactEffort.#instanceCount}`;

    if (!this.#built) {
      this.#built = true;
      this.#build();
      if (this.#pending) {
        const pending = this.#pending;
        this.#pending = null;
        this.items = pending;
      }
    }

    if (!this.#wired) {
      this.#wired = true;
      this.listen(this, 'drag-surface:transfer', this.#onTransfer);
      this.#stopSemantics = watchSurfaceSemantics(this);
    }

    // Data mode: fetch once per src value; ready fires after it renders.
    const src = this.getAttribute('src');
    if (src) {
      if (src !== this.#loader.url) this.#loadFromSrc(src);
      return;
    }

    if (!this.#readyFired) this.#dispatchReady();
  }

  teardown() {
    // Listeners are removed by VBElement. The grid, title and cards stay
    // in place so a matrix that is moved in the DOM keeps its content;
    // the next connect only re-attaches listeners.
    this.#wired = false;
    this.#stopSemantics();
  }

  /** First build: wrapper, quadrants, live region; authored cards moved in. */
  #build() {
    // 1. Snapshot children that belong in quadrants
    const children = [...this.querySelectorAll(':scope > [data-quadrant], :scope > [draggable]')];

    // 2. Build wrapper: .ie-wrapper > .ie-y-label + column-div > .ie-grid + .ie-x-label
    const wrapper = document.createElement('div');
    wrapper.className = 'ie-wrapper';

    const yLabel = document.createElement('div');
    yLabel.className = 'ie-y-label';
    yLabel.setAttribute('aria-hidden', 'true');
    yLabel.textContent = 'Impact ↑';

    const column = document.createElement('div');
    column.style.cssText = 'display:flex;flex-direction:column;flex:1;min-width:0;';

    const grid = document.createElement('div');
    grid.className = 'ie-grid';
    grid.setAttribute('role', 'region');
    grid.setAttribute('aria-label', 'Impact-Effort prioritization matrix');

    const xLabel = document.createElement('div');
    xLabel.className = 'ie-x-label';
    xLabel.setAttribute('aria-hidden', 'true');
    xLabel.textContent = 'Effort →';

    // 3. Build quadrant sections
    for (const q of ImpactEffort.QUADRANTS) {
      const section = document.createElement('section');
      section.className = 'ie-quadrant';
      section.dataset.quadrantZone = q;
      section.setAttribute('aria-label', `${ImpactEffort.LABELS[q]}: ${ImpactEffort.DESCRIPTIONS[q]}`);

      const header = document.createElement('header');
      header.className = 'ie-quadrant-label';
      const desc = document.createElement('span');
      desc.className = 'ie-quadrant-desc';
      desc.textContent = ImpactEffort.DESCRIPTIONS[q];
      header.append(ImpactEffort.LABELS[q], document.createElement('br'), desc);

      const surface = document.createElement('drag-surface');
      surface.setAttribute('group', this.#groupId);
      surface.setAttribute('aria-label', ImpactEffort.LABELS[q]);
      surface.setAttribute('data-layout', 'stack');
      surface.setAttribute('data-layout-gap', 'xs');

      section.appendChild(header);
      section.appendChild(surface);
      grid.appendChild(section);

      this.#surfaces[q] = surface;
    }

    // 4. Distribute captured children into matching surfaces and register
    //    them so a later `.items` assignment diffs against them.
    children.forEach((c, i) => {
      const child = /** @type {HTMLElement} */ (c);
      const quadrant = this.#surfaces[child.getAttribute('data-quadrant') || ''] ? child.getAttribute('data-quadrant') : 'quick-wins';
      child.setAttribute('data-quadrant', /** @type {string} */ (quadrant));
      if (!child.hasAttribute('draggable')) child.setAttribute('draggable', 'true');
      if (!child.hasAttribute('data-id')) child.dataset.id = `ie-item-${i}`;
      this.#surfaces[/** @type {string} */ (quadrant)].appendChild(child);
      this.#nodes.set(child.dataset.id, child);
    });

    // 5. Assemble DOM
    this.#liveRegion = createLiveRegion('ie-live-region');
    this.#syncTitle();
    column.appendChild(grid);
    column.appendChild(xLabel);
    wrapper.appendChild(yLabel);
    wrapper.appendChild(column);
    this.append(wrapper, this.#liveRegion);
  }

  /** Create, update, or remove the optional heading from the title attribute. */
  #syncTitle() {
    const title = this.getAttribute('title');
    if (title) {
      if (!this.#titleEl) {
        this.#titleEl = document.createElement('h3');
        this.#titleEl.className = 'ie-title';
        this.prepend(this.#titleEl);
      }
      this.#titleEl.textContent = title;
    } else if (this.#titleEl) {
      this.#titleEl.remove();
      this.#titleEl = null;
    }
  }

  /** @param {Event} e */
  #onTransfer = (e) => {
    const { item, fromSurface, toSurface } = /** @type {CustomEvent} */ (e).detail;
    const fromQuadrant = this.#findQuadrantForSurface(fromSurface);
    const toQuadrant = this.#findQuadrantForSurface(toSurface);

    if (!fromQuadrant || !toQuadrant) return;

    // Update the item's quadrant attribute
    item.setAttribute('data-quadrant', toQuadrant);

    announce(this.#liveRegion, `Moved ${itemLabel(item)} to ${ImpactEffort.LABELS[toQuadrant]}`);

    this.dispatchEvent(new CustomEvent('impact-effort:move', {
      bubbles: true,
      detail: {
        itemId: item.dataset.id,
        from: fromQuadrant,
        to: toQuadrant,
        item,
      },
    }));
  };

  // ── Data API (HTML-first / JS-first dual contract) ──────────────

  /**
   * The matrix items in DOM order, reflecting drags. Each entry is the
   * record last assigned for that id (via `.items` or `src`) with its
   * current `quadrant`; authored cards read as `{ id, quadrant, label }`.
   * Assigning the result back to `.items` keeps every card in place.
   */
  get items() {
    const result = [];
    for (const [q, surface] of Object.entries(this.#surfaces)) {
      for (const el of surface.querySelectorAll(':scope > [draggable="true"]')) {
        const id = el.getAttribute('data-id') || undefined;
        const key = this.#keyForNode(el);
        const known = key !== undefined ? this.#records.get(key) : undefined;
        if (known) {
          result.push({ ...known, quadrant: q });
        } else {
          result.push({ id, quadrant: q, label: itemLabel(el) });
        }
      }
    }
    return result;
  }

  /**
   * Replace the matrix items and route each into its quadrant surface.
   * Each item: `{ id, quadrant, label }` (`text` is accepted as an alias of
   * `label`; story fields — persona, action, benefit, storyId — render a
   * `<user-story>` card). Runs a keyed diff by `id`, so cards whose id
   * persists (including authored ones) are moved, not recreated. Items
   * without an `id` are keyed by their label (the nth repeat of a label
   * keeps the nth such card), so they also survive drags and round-trips;
   * give items an `id` if their labels change. New ids
   * render as `<article class="ie-card">` by default; override via
   * `.renderItem`.
   *
   * Emits impact-effort:items-changed { items, source: 'property' }.
   */
  set items(value) {
    const next = Array.isArray(value) ? value : [];
    if (!this.#built) {
      this.#pending = next;
      return;
    }
    this.#applyItems(next);
    this.dispatchEvent(new CustomEvent('impact-effort:items-changed', {
      detail: { items: next, source: 'property' },
      bubbles: true,
    }));
  }

  /**
   * Diff keys for a list of items: the `id` when present; otherwise the
   * label (`label` or `text`), with a counter for repeats, so the nth
   * id-less item with a given label keeps the nth such card. The quadrant
   * is not part of the key, so a dragged id-less card survives an
   * `.items` round-trip.
   * @param {any[]} list
   * @returns {Map<any, unknown>}
   */
  static #keysFor(list) {
    /** @type {Map<string, number>} */
    const seen = new Map();
    /** @type {Map<any, unknown>} */
    const keys = new Map();
    for (const it of list) {
      if (it.id != null) { keys.set(it, it.id); continue; }
      const label = String(it.label ?? it.text ?? '');
      const n = seen.get(label) ?? 0;
      seen.set(label, n + 1);
      keys.set(it, n ? `label:${label}#${n}` : `label:${label}`);
    }
    return keys;
  }

  /** @param {Element} el */
  #keyForNode(el) {
    for (const [key, node] of this.#nodes) if (node === el) return key;
    return undefined;
  }

  /** @param {any[]} next */
  #applyItems(next) {
    const keys = ImpactEffort.#keysFor(next);
    diffByKey({
      newItems: next,
      nodes: this.#nodes,
      keyOf: (it) => keys.get(it),
      renderItem: (it) => this.#renderCard(it),
      containerFor: (it) => this.#surfaces[it.quadrant] || this.#surfaces['quick-wins'],
    });
    this.#records.clear();
    for (const it of next) {
      const key = keys.get(it);
      this.#records.set(key, it);
      const el = this.#nodes.get(key);
      el?.setAttribute('data-quadrant', this.#surfaces[it.quadrant] ? it.quadrant : 'quick-wins');
    }
  }

  /**
   * @param {any} it
   * @returns {Element}
   */
  #renderCard(it) {
    const self = /** @type {any} */ (this);
    let el;
    if (typeof self.renderItem === 'function') {
      const out = self.renderItem(it);
      if (out instanceof Element) el = out;
    }
    if (!el && isStoryRecord(it)) el = createStoryCard(it, 'minimal');
    if (!el) {
      el = document.createElement('article');
      el.className = 'ie-card';
      el.textContent = it.label ?? it.text ?? it.id ?? '';
    }
    if (!el.hasAttribute('draggable')) el.setAttribute('draggable', 'true');
    if (it.id != null && !el.hasAttribute('data-id')) el.setAttribute('data-id', String(it.id));
    return el;
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal === newVal || !this.#built) return;
    if (name === 'src' && newVal && newVal !== this.#loader.url) this.#loadFromSrc(newVal);
    if (name === 'src' && !newVal) this.#loader.cancel();   // src removed: drop a pending load, keep the cards
    if (name === 'title') this.#syncTitle();
  }

  // ── Data loading ──────────────────────────────────────────────────────────

  /**
   * Fetch an array of items (same shape as `.items`) and replace the
   * matrix with it. One request per src value; a newer src aborts an
   * older in-flight one. Once the cards are in the DOM (after the View
   * Transition's update callback) `impact-effort:items-changed` fires with
   * source 'src', and `impact-effort:ready` if it has not fired yet.
   * @param {string} url
   */
  async #loadFromSrc(url) {
    try {
      const result = await this.#loader.fetchJson(url);
      if (!result) return;
      const { data, isCurrent } = result;
      if (!Array.isArray(data)) return;
      const entries = data.map((entry, i) => ({ ...entry, id: entry.id ?? entry.storyId ?? `ie-item-${i}` }));

      // viewTransitionSwap runs the swap synchronously when it can't animate.
      const tx = viewTransitionSwap(this, () => this.#applyItems(entries), 'ie-vt');
      if (tx) await tx.updateCallbackDone;
      if (!isCurrent()) return;
      this.dispatchEvent(new CustomEvent('impact-effort:items-changed', {
        detail: { items: this.items, source: 'src' },
        bubbles: true,
      }));
      if (!this.#readyFired) this.#dispatchReady();
    } catch (err) {
      console.warn(`[impact-effort] Failed to load src="${url}":`, err);
    }
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  /** Reverse lookup: find which quadrant name owns a given drag-surface element */
  #findQuadrantForSurface(surface) {
    for (const [q, s] of Object.entries(this.#surfaces)) {
      if (s === surface) return q;
    }
    return null;
  }

  /** Dispatch the ready event with counts per quadrant */
  #dispatchReady() {
    this.#readyFired = true;
    const quadrantCounts = {};
    for (const q of ImpactEffort.QUADRANTS) {
      const surface = this.#surfaces[q];
      quadrantCounts[q] = surface
        ? surface.querySelectorAll(':scope > [draggable="true"]').length
        : 0;
    }
    this.dispatchEvent(new CustomEvent('impact-effort:ready', {
      bubbles: true,
      detail: { quadrantCounts },
    }));
  }
}

registerComponent('impact-effort', ImpactEffort);
export { ImpactEffort };
