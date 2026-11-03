/**
 * story-map: Horizontal user story map with activity columns
 *
 * Light DOM component that creates a horizontal story map with activity
 * columns, each containing a <drag-surface> for cross-column drag-and-drop.
 *
 * @attr {string} src - URL to JSON data
 * @attr {string} title - Optional heading displayed above the map
 * @attr {number} heading-level - Level (1–6) of the map's top heading: the
 *   title if set, else the activity headings. Default: one below the nearest
 *   preceding heading on the page, so the outline never skips a level.
 * @attr {boolean} compact - Reduced spacing variant
 *
 * Children use:
 * @attr {string} data-activity - Activity column identifier (on <section>)
 * @attr {string} data-activity-label - Display label for the column header (on <section>)
 * @attr {string} data-journey-phase - Optional link to a user-journey phase (on <section>)
 *
 * @fires story-map:reorder - Item reordered within a column
 * @fires story-map:transfer - Item moved between columns
 * @fires story-map:ready - Once after the first render (with src: after the JSON renders)
 * @fires story-map:activities-changed - { activities, source: 'property' } after .activities is set
 * @fires story-map:upgraded - Each time the map connects and upgrades
 *
 * @example
 * <story-map>
 *   <section data-activity="discovery" data-activity-label="Discovery">
 *     <article draggable="true" data-id="PROJ-1">Interview users</article>
 *   </section>
 * </story-map>
 */

import { registerComponent } from '../../lib/bundle-registry.js';
import { VBElement } from '../../lib/vb-element.js';
import { viewTransitionSwap } from '../../lib/vb-view-transition.js';
import {
  SrcLoader, announce, createLiveRegion, createStoryCard, itemLabel, syncPlaceholder, titleCase, watchSurfaceSemantics,
  boardHeadingLevels, retagHeading,
} from '../../lib/board-surface.js';

/**
 * @typedef {{ id: string, label: string, journeyPhase: string | null }} ActivityMeta
 */

class StoryMap extends VBElement {
  static get observedAttributes() { return ['src', 'compact', 'title', 'heading-level']; }

  static #instanceCount = 0;

  /** @type {HTMLDivElement | null} */
  #scroll = null;
  /** @type {HTMLDivElement | null} */
  #columnsEl = null;
  /** @type {Record<string, HTMLElement>} */
  #surfaces = {};
  /** @type {HTMLDivElement | null} */
  #liveRegion = null;
  /** @type {HTMLElement | null} */
  #titleEl = null;
  /** @type {string} */
  #groupId = '';
  /** @type {ActivityMeta[]} */
  #activities = [];
  /** Last story records assigned via `.activities` / src, keyed by data-id. */
  /** @type {Map<string, Record<string, any>>} */
  #records = new Map();
  /** Shell built (survives disconnect so a moved map keeps its stories). */
  #built = false;
  /** Listeners attached for the current connection. */
  #wired = false;
  #readyFired = false;
  #loader = new SrcLoader();
  /** Stops the drag-surface semantics observer (see board-surface.js). */
  #stopSemantics = () => {};

  setup() {
    if (!this.#groupId) this.#groupId = `sm-${++StoryMap.#instanceCount}`;

    if (!this.#built) {
      this.#built = true;
      const sections = /** @type {HTMLElement[]} */ ([
        ...this.querySelectorAll(':scope > section[data-activity]')
      ]);
      const parsed = sections.map(section => StoryMap.#parseSection(section));
      for (const section of sections) section.remove();

      this.#syncTitle();
      this.#scroll = document.createElement('div');
      this.#scroll.className = 'sm-scroll';
      this.#scroll.setAttribute('role', 'region');
      this.#scroll.setAttribute('tabindex', '0');
      this.#liveRegion = createLiveRegion('sm-live-region');
      this.#renderColumns(parsed.map(p => p.meta), parsed.map(p => p.children));
      this.append(this.#scroll, this.#liveRegion);
    }

    if (!this.#wired) {
      this.#wired = true;
      this.listen(this, 'drag-surface:reorder', this.#onReorder);
      this.listen(this, 'drag-surface:transfer', this.#onTransfer);
      this.#stopSemantics = watchSurfaceSemantics(this);
    }

    // Data mode: fetch once per src value; ready fires after it renders.
    const src = this.getAttribute('src');
    if (src) {
      if (src !== this.#loader.url) this._loadSrc(src);
      return;
    }

    if (!this.#readyFired) this.#dispatchReady();
  }

  teardown() {
    // Listeners are removed by VBElement. The title, columns and stories
    // stay in place so a map that is moved in the DOM keeps its content;
    // the next connect only re-attaches listeners.
    this.#wired = false;
    this.#stopSemantics();
  }

  /**
   * @param {HTMLElement} section
   * @returns {{ meta: ActivityMeta, children: HTMLElement[] }}
   */
  static #parseSection(section) {
    const id = section.getAttribute('data-activity') || '';
    const label = section.getAttribute('data-activity-label') || titleCase(id);
    const journeyPhase = section.getAttribute('data-journey-phase') || null;
    const children = /** @type {HTMLElement[]} */ ([...section.children]);
    return { meta: { id, label, journeyPhase }, children };
  }

  /**
   * Replace the columns inside the scroll container. `children[i]` are the
   * story cards for activity i (moved, not cloned).
   * @param {ActivityMeta[]} metas
   * @param {HTMLElement[][]} children
   */
  #renderColumns(metas, children) {
    this.#activities = metas;
    this.#surfaces = {};
    const columns = document.createElement('div');
    columns.className = 'sm-columns';

    metas.forEach((activity, i) => {
      const column = document.createElement('section');
      column.className = 'sm-column';
      column.setAttribute('data-activity-column', activity.id);

      const header = document.createElement('header');
      header.className = 'sm-activity-header';
      const heading = document.createElement(`h${this.#headingLevels().column}`);
      heading.className = 'sm-activity-heading';
      heading.textContent = activity.label;
      const countBadge = document.createElement('span');
      countBadge.className = 'sm-activity-count';
      heading.appendChild(countBadge);
      header.appendChild(heading);
      column.appendChild(header);

      const surface = document.createElement('drag-surface');
      surface.setAttribute('group', this.#groupId);
      surface.setAttribute('aria-label', `${activity.label} stories`);
      surface.setAttribute('data-layout', 'stack');
      surface.setAttribute('data-layout-gap', 'xs');
      for (const child of children[i] || []) surface.appendChild(child);

      column.appendChild(surface);
      columns.appendChild(column);
      this.#surfaces[activity.id] = surface;
      this.#updateCount(activity.id);
      syncPlaceholder(surface, 'sm-empty', 'No stories yet');
    });

    this.#columnsEl?.remove();
    this.#columnsEl = columns;
    this.#scroll?.appendChild(columns);
    this.#scroll?.setAttribute('aria-label', this.getAttribute('title') || 'Story map');
  }

  /** Create, update, or remove the optional heading from the title attribute. */
  #syncTitle() {
    const title = this.getAttribute('title');
    const levels = this.#headingLevels();
    if (title) {
      if (!this.#titleEl) {
        this.#titleEl = document.createElement(`h${levels.title}`);
        this.#titleEl.className = 'sm-title';
        this.prepend(this.#titleEl);
      }
      this.#titleEl = retagHeading(this.#titleEl, levels.title);
      this.#titleEl.textContent = title;
    } else if (this.#titleEl) {
      this.#titleEl.remove();
      this.#titleEl = null;
    }
    for (const h of this.querySelectorAll('.sm-activity-heading')) retagHeading(h, levels.column);
    this.#scroll?.setAttribute('aria-label', title || 'Story map');
  }

  /** @returns {{ title: number, column: number }} */
  #headingLevels() {
    return boardHeadingLevels(/** @type {HTMLElement} */ (/** @type {unknown} */ (this)), 'story-map');
  }

  #dispatchReady() {
    this.#readyFired = true;
    let storyCount = 0;
    for (const surface of Object.values(this.#surfaces)) {
      storyCount += surface.querySelectorAll(':scope > [draggable="true"]').length;
    }
    this.dispatchEvent(new CustomEvent('story-map:ready', {
      bubbles: true,
      detail: { activityCount: this.#activities.length, storyCount },
    }));
  }

  /** @param {Event} e */
  #onReorder = (e) => {
    const detail = /** @type {CustomEvent} */ (e).detail;
    const surface = /** @type {HTMLElement | null} */ (/** @type {HTMLElement} */ (e.target).closest('drag-surface'));
    const activityId = this.#findActivityForSurface(surface);
    if (!activityId) return;

    this.#updateCount(activityId);

    this.dispatchEvent(new CustomEvent('story-map:reorder', {
      bubbles: true,
      detail: {
        itemId: detail.itemId,
        activity: activityId,
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
    const fromActivity = this.#findActivityForSurface(fromSurface);
    const toActivity = this.#findActivityForSurface(toSurface);
    if (!fromActivity || !toActivity) return;

    this.#updateCount(fromActivity);
    this.#updateCount(toActivity);
    syncPlaceholder(toSurface, 'sm-empty', 'No stories yet');
    syncPlaceholder(fromSurface, 'sm-empty', 'No stories yet');

    announce(this.#liveRegion,
      `${itemLabel(detail.item)} moved from ${this.#activityLabel(fromActivity)} to ${this.#activityLabel(toActivity)}`);

    this.dispatchEvent(new CustomEvent('story-map:transfer', {
      bubbles: true,
      detail: {
        itemId: detail.itemId,
        fromActivity,
        toActivity,
        newIndex: detail.newIndex,
      },
    }));
  };

  // ── Data API (HTML-first / JS-first dual contract) ──────────────

  /**
   * Read the current activities + stories as a nested data array, in DOM
   * order (drags are reflected):
   *   `[{ id, label, journeyPhase?, stories: [{ id, ...record }] }]`.
   * A story assigned through `.activities` or `src` returns the record it
   * was given (so the getter round-trips through the setter); an authored
   * `<user-story>` returns its `.data`; any other card `{ id, title }`.
   */
  get activities() {
    return this.#activities.map(a => ({
      id: a.id,
      label: a.label,
      journeyPhase: a.journeyPhase || undefined,
      stories: [...(this.#surfaces[a.id]?.querySelectorAll(':scope > [draggable="true"]') || [])]
        .map(el => this.#storyRecord(/** @type {HTMLElement} */ (el))),
    }));
  }

  /**
   * Replace the entire story map. Accepts a nested tree:
   *   `[{ id, label?, journeyPhase?, stories: [{ id, title?, persona?, action?, benefit?, ... }] }]`
   * Stories render as `<user-story>` cards (persona/action/benefit/title
   * become slotted children) by default; override via `.renderStory`.
   *
   * Record-shaped: the columns are rebuilt on assignment (no per-story
   * node preservation). Assigning before the element upgrades is fine —
   * the tree is rendered on connect.
   *
   * Emits `story-map:activities-changed { activities, source: 'property' }`.
   */
  set activities(value) {
    const next = Array.isArray(value) ? value : [];
    this.#records.clear();
    /** @type {HTMLElement[][]} */
    const children = [];
    /** @type {ActivityMeta[]} */
    const metas = next.map(a => {
      const id = String(a.id ?? '');
      children.push((a.stories || []).map((/** @type {any} */ story) => this.#cardFromRecord(story, undefined)));
      return { id, label: a.label || titleCase(id), journeyPhase: a.journeyPhase || null };
    });

    if (!this.#built) {
      // Not upgraded yet: leave sections for setup() to parse.
      for (const section of this.querySelectorAll(':scope > section[data-activity]')) section.remove();
      metas.forEach((meta, i) => {
        const section = document.createElement('section');
        section.setAttribute('data-activity', meta.id);
        section.setAttribute('data-activity-label', meta.label);
        if (meta.journeyPhase) section.setAttribute('data-journey-phase', meta.journeyPhase);
        section.append(...children[i]);
        this.appendChild(section);
      });
    } else {
      viewTransitionSwap(this, () => this.#renderColumns(metas, children), 'sm-vt');
    }

    this.dispatchEvent(new CustomEvent('story-map:activities-changed', {
      detail: { activities: next, source: 'property' },
      bubbles: true,
    }));
  }

  /**
   * Build a draggable card for a story record and remember the record.
   * @param {Record<string, any>} story
   * @param {string | undefined} defaultDetail
   * @returns {HTMLElement}
   */
  #cardFromRecord(story, defaultDetail) {
    /** @type {Element | null} */
    let el = null;
    const self = /** @type {any} */ (this);
    if (typeof self.renderStory === 'function') {
      const out = self.renderStory(story);
      el = out instanceof Element ? out : null;
    }
    if (!el) el = createStoryCard(story, defaultDetail);
    const card = /** @type {HTMLElement} */ (el);
    if (!card.hasAttribute('draggable')) card.setAttribute('draggable', 'true');
    const id = story.id ?? story.storyId;
    if (id != null && !card.hasAttribute('data-id')) card.setAttribute('data-id', String(id));
    const key = card.getAttribute('data-id');
    if (key) this.#records.set(key, story);
    return card;
  }

  /**
   * @param {HTMLElement} el
   * @returns {Record<string, any>}
   */
  #storyRecord(el) {
    const id = el.getAttribute('data-id') || undefined;
    const known = id ? this.#records.get(id) : undefined;
    if (known) return { ...known, id: known.id ?? id };
    const data = /** @type {any} */ (el).data;
    if (el.localName === 'user-story' && data && typeof data === 'object') {
      /** @type {Record<string, any>} */
      const out = { id };
      for (const [k, v] of Object.entries(data)) if (v !== undefined) out[k] = v;
      return out;
    }
    return {
      id,
      storyId: el.getAttribute('story-id') || undefined,
      title: (el.querySelector('[slot="title"]')?.textContent || el.textContent || '').replace(/\s+/g, ' ').trim() || undefined,
    };
  }

  // ── Attribute changes ────────────────────────────────

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue || !this.#built) return;
    if (name === 'src' && newValue && newValue !== this.#loader.url) this._loadSrc(newValue);
    if (name === 'src' && !newValue) this.#loader.cancel();   // src removed: drop a pending load, keep the cards
    if (name === 'title' || name === 'heading-level') this.#syncTitle();
  }

  // ── JSON loading ────────────────────────────────────

  /**
   * Fetch `{ activities: [{ id, label?, journeyPhase?, stories: [...] }] }`
   * and replace the map with it. One request per src value; a newer src
   * aborts an older in-flight one. Once the data has rendered, fires
   * `story-map:activities-changed` (source 'src'), and `story-map:ready`
   * if it has not fired yet (ready is once per element).
   * @param {string} url
   */
  async _loadSrc(url) {
    if (!url) return;
    try {
      const result = await this.#loader.fetchJson(url);
      if (!result) return;
      const { data, isCurrent } = result;
      this.#records.clear();
      /** @type {HTMLElement[][]} */
      const children = [];
      /** @type {ActivityMeta[]} */
      const metas = (data.activities || []).map((/** @type {any} */ activity) => {
        const id = String(activity.id ?? '');
        children.push((activity.stories || []).map((/** @type {any} */ story) => this.#cardFromRecord(story, 'compact')));
        return { id, label: activity.label || titleCase(id), journeyPhase: activity.journeyPhase || null };
      });
      // viewTransitionSwap runs the swap synchronously when it can't animate.
      const tx = viewTransitionSwap(this, () => this.#renderColumns(metas, children), 'sm-vt');
      if (tx) await tx.updateCallbackDone;
      if (!isCurrent()) return;
      this.dispatchEvent(new CustomEvent('story-map:activities-changed', {
        detail: { activities: this.activities, source: 'src' },
        bubbles: true,
      }));
      if (!this.#readyFired) this.#dispatchReady();
    } catch (err) {
      console.warn(`[story-map] Failed to load src="${url}":`, err);
    }
  }

  // ── Helpers ──────────────────────────────────────────

  /**
   * Reverse-lookup: find the activity id that owns a given drag-surface.
   * @param {HTMLElement | null} surface
   * @returns {string | null}
   */
  #findActivityForSurface(surface) {
    if (!surface) return null;
    for (const [id, ref] of Object.entries(this.#surfaces)) {
      if (ref === surface) return id;
    }
    return null;
  }

  /** @param {string} activityId */
  #activityLabel(activityId) {
    return this.#activities.find(a => a.id === activityId)?.label || titleCase(activityId);
  }

  /**
   * Update the count badge in the column header for a given activity.
   * @param {string} activityId
   */
  #updateCount(activityId) {
    const surface = this.#surfaces[activityId];
    if (!surface) return;
    const count = surface.querySelectorAll(':scope > [draggable="true"]').length;
    const column = surface.closest('[data-activity-column]');
    const badge = column?.querySelector('.sm-activity-count');
    if (badge) badge.textContent = String(count);
  }
}

registerComponent('story-map', StoryMap);
export { StoryMap };
