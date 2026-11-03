/**
 * Shared utilities for the pack's planning web components.
 *
 * - Helpers (`esc`, `initials`, `hashColor`, `lucideSvg`, `UX_ICONS`,
 *   `QUADRANT_META`, `EMOTION_META`) are used by user-persona, user-story,
 *   user-journey, empathy-map, work-item, adr-wc, impact-effort, story-map
 *   and review-surface.
 * - `UXShadowElement` is the Shadow DOM base class for the six record cards
 *   (user-persona, user-story, user-journey, empathy-map, work-item, adr-wc).
 *   It owns the one-time setup / reconnect guard, the single-fetch `src`
 *   loader, the once-only `<tag>:ready` event (plus, for user-persona,
 *   user-story and user-journey, its deprecated un-namespaced alias) and the
 *   `<tag>:upgraded` event.
 *   Light DOM components (impact-effort, story-map, kanban-board, …) extend
 *   VBElement from src/lib/vb-element.js instead.
 */

import { stringHash } from '../lib/hash.js';
import { SrcLoader } from '../lib/src-loader.js';

import { esc } from '../lib/escape.js';

export { esc };

/**
 * Extract up to 2 initials from a name.
 * @param {string} name
 * @returns {string}
 */
export function initials(name) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Generate a deterministic avatar background colour from a name string.
 * The hue varies with the name; OKLCH lightness is fixed low enough that
 * white initials on it meet WCAG AA (>= 4.5:1) at every hue.
 * @param {string} name
 * @returns {string} oklch() colour string
 */
export function hashColor(name) {
  const hash = stringHash(name);
  const hue = ((hash % 360) + 360) % 360;
  return `oklch(48% 0.13 ${hue})`;
}

/* ── ARIA role detection (user-persona's legacy `role` attribute) ── */

/** WAI-ARIA 1.2 roles plus the Graphics ARIA roles (DPUB `doc-*` roles are matched by prefix). */
const ARIA_ROLES = new Set([
  'alert', 'alertdialog', 'application', 'article', 'banner', 'blockquote', 'button', 'caption',
  'cell', 'checkbox', 'code', 'columnheader', 'combobox', 'comment', 'complementary', 'contentinfo',
  'definition', 'deletion', 'dialog', 'directory', 'document', 'emphasis', 'feed', 'figure', 'form',
  'generic', 'grid', 'gridcell', 'group', 'heading', 'img', 'image', 'insertion', 'link', 'list',
  'listbox', 'listitem', 'log', 'main', 'mark', 'marquee', 'math', 'menu', 'menubar', 'menuitem',
  'menuitemcheckbox', 'menuitemradio', 'meter', 'navigation', 'none', 'note', 'option', 'paragraph',
  'presentation', 'progressbar', 'radio', 'radiogroup', 'region', 'row', 'rowgroup', 'rowheader',
  'scrollbar', 'search', 'searchbox', 'separator', 'slider', 'spinbutton', 'status', 'strong',
  'subscript', 'suggestion', 'superscript', 'switch', 'tab', 'table', 'tablist', 'tabpanel', 'term',
  'textbox', 'time', 'timer', 'toolbar', 'tooltip', 'tree', 'treegrid', 'treeitem',
  'graphics-document', 'graphics-object', 'graphics-symbol',
]);

/**
 * Whether a `role` attribute value is a valid ARIA role list: every
 * whitespace-separated token is a known ARIA role. "Product Manager" is not;
 * "region" is.
 * @param {string | null | undefined} value
 * @returns {boolean}
 */
export function isAriaRole(value) {
  const tokens = String(value ?? '').trim().toLowerCase().split(/\s+/).filter(Boolean);
  return tokens.length > 0 && tokens.every((t) => ARIA_ROLES.has(t) || t.startsWith('doc-'));
}

/**
 * Job title of a `<user-persona>` element, upgraded or not: its `job-title`
 * attribute, else a legacy `role` attribute that is not an ARIA role (0.2.x
 * markup such as `<user-persona role="Product Manager">`). '' when neither.
 * @param {Element} persona
 * @returns {string}
 */
export function personaJobTitle(persona) {
  const title = persona.getAttribute('job-title')?.trim();
  if (title) return title;
  const legacy = persona.getAttribute('role')?.trim() || '';
  return legacy && !isAriaRole(legacy) ? legacy : '';
}

/**
 * Build a Lucide-style inline SVG string (24x24, stroke-based).
 * @param {string} inner - SVG child elements (path, circle, line, etc.)
 * @returns {string}
 */
export function lucideSvg(inner) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
}

/** Shared Lucide SVG fragments for reuse across UX components. */
export const UX_ICONS = {
  user:          '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  pencil:        '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>',
  check:         '<path d="M20 6 9 17l-5-5"/>',
  target:        '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  alertTriangle: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  messageCircle: '<path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"/>',
  lightbulb:     '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
  wrench:        '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z"/>',
  heart:         '<path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/>',
  mapPin:        '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
  checkCircle:   '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>',
  x:             '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  download:      '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
  send:          '<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/>',
};

/**
 * Empathy map quadrant metadata used by empathy-map.
 * Maps quadrant keys to label, Lucide SVG icon inner content, and accent color.
 */
export const QUADRANT_META = {
  says:   { label: 'Says',   icon: UX_ICONS.messageCircle, color: '#3b82f6' },
  thinks: { label: 'Thinks', icon: UX_ICONS.lightbulb,     color: '#8b5cf6' },
  does:   { label: 'Does',   icon: UX_ICONS.wrench,        color: '#f59e0b' },
  feels:  { label: 'Feels',  icon: UX_ICONS.heart,         color: '#ef4444' },
};

/**
 * Emotion metadata used by user-journey (and potentially other planning components).
 * Maps emotion names to emoji, normalized score (0–1), and color.
 */
export const EMOTION_META = {
  delighted:  { emoji: '😄', score: 0.95, color: '#16a34a' },
  satisfied:  { emoji: '😊', score: 0.80, color: '#22c55e' },
  hopeful:    { emoji: '🙂', score: 0.68, color: '#84cc16' },
  curious:    { emoji: '🤔', score: 0.55, color: '#eab308' },
  neutral:    { emoji: '😐', score: 0.50, color: '#94a3b8' },
  uncertain:  { emoji: '😕', score: 0.40, color: '#f97316' },
  confused:   { emoji: '😵', score: 0.30, color: '#fb923c' },
  frustrated: { emoji: '😤', score: 0.18, color: '#ef4444' },
  angry:      { emoji: '😠', score: 0.05, color: '#dc2626' },
};

/**
 * Look up emotion metadata by name. Own-property lookup only, so data such
 * as `"__proto__"` or `"constructor"` falls back to `neutral`.
 * @param {unknown} name
 * @returns {{ emoji: string, score: number, color: string }}
 */
export function emotionMeta(name) {
  const key = String(name ?? '').toLowerCase().trim();
  return Object.hasOwn(EMOTION_META, key) ? EMOTION_META[key] : EMOTION_META.neutral;
}

/**
 * Whether `name` is a known emotion (own property of EMOTION_META).
 * @param {unknown} name
 * @returns {boolean}
 */
export function isEmotion(name) {
  return Object.hasOwn(EMOTION_META, String(name ?? '').toLowerCase().trim());
}

/* ── Card status / priority vocabularies ─────────────────────────── */

/** Priority badges shared by user-story and work-item. */
export const PRIORITIES = Object.freeze({
  critical: { label: 'Critical', color: '#dc2626', bg: 'rgba(220, 38, 38, 0.1)' },
  high:     { label: 'High',     color: '#ea580c', bg: 'rgba(234, 88, 12, 0.1)' },
  medium:   { label: 'Medium',   color: '#ca8a04', bg: 'rgba(202, 138, 4, 0.1)' },
  low:      { label: 'Low',      color: '#16a34a', bg: 'rgba(22, 163, 74, 0.1)' },
});

/** Workflow statuses shared by user-story and work-item (work-item adds `blocked`). */
export const STATUSES = Object.freeze({
  backlog:       { label: 'Backlog',     color: '#6b7280', bg: 'rgba(107, 114, 128, 0.1)' },
  'to-do':       { label: 'To Do',       color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
  'in-progress': { label: 'In Progress', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
  review:        { label: 'Review',      color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  done:          { label: 'Done',        color: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)' },
});

/**
 * Own-property lookup in a vocabulary table, with a fallback key.
 * @template T
 * @param {Record<string, T>} table
 * @param {string} key
 * @param {string} fallback
 * @returns {T}
 */
export function lookup(table, key, fallback) {
  return Object.hasOwn(table, key) ? table[key] : table[fallback];
}

/* ── Small DOM / data helpers ────────────────────────────────────── */

/**
 * `href` value for an in-page fragment link to an element id, escaped for
 * an attribute position in an innerHTML template.
 * @param {unknown} id
 * @returns {string}
 */
export function fragmentHref(id) {
  return esc(`#${encodeURIComponent(String(id ?? ''))}`);
}

/**
 * Split a comma-separated attribute value into trimmed, non-empty parts.
 * @param {string | null} raw
 * @returns {string[]}
 */
export function splitList(raw) {
  return raw ? raw.split(',').map(s => s.trim()).filter(Boolean) : [];
}

/**
 * Normalise a data field to an array of strings: arrays are kept, a single
 * scalar becomes a one-item array, null/undefined/'' become [].
 * @param {unknown} value
 * @returns {string[]}
 */
export function asList(value) {
  if (Array.isArray(value)) return value.map(v => String(v ?? ''));
  if (value == null || value === '') return [];
  return [String(value)];
}

/**
 * The light-DOM child assigned to `slot`, if any (direct children only:
 * nothing deeper can be slotted).
 * @param {Element} host
 * @param {string} slot
 * @returns {Element | undefined}
 */
export function slottedChild(host, slot) {
  return [...host.children].find(c => c.getAttribute('slot') === slot);
}

/**
 * Create (or, with `replace`, update) the light-DOM child for a slot from a
 * data value. Arrays become a `<ul>` of `<li>`s; anything else becomes
 * `tag` with the value as text. Text is set with textContent, never parsed.
 *
 * @param {Element} host
 * @param {string} slot
 * @param {unknown} value
 * @param {{ tag?: string, list?: boolean, replace?: boolean }} [opts]
 *   tag: element for scalar values (default `p`); list: always render a
 *   list (wrapping a scalar); replace: update an existing child instead of
 *   leaving it alone.
 */
export function fillSlot(host, slot, value, { tag = 'p', list = false, replace = false } = {}) {
  if (value == null || value === '') return;
  const existing = slottedChild(host, slot);
  if (existing && !replace) return;
  const wantList = list || Array.isArray(value);
  const isList = (/** @type {Element} */ el) => el.tagName === 'UL' || el.tagName === 'OL';
  let el = existing;
  if (!el || wantList !== isList(el)) {
    const fresh = document.createElement(wantList ? 'ul' : tag);
    fresh.slot = slot;
    if (el) el.replaceWith(fresh); else host.appendChild(fresh);
    el = fresh;
  }
  if (wantList) {
    el.replaceChildren(...asList(value).map(item => {
      const li = document.createElement('li');
      li.textContent = item;
      return li;
    }));
  } else {
    el.textContent = String(value);
  }
}

/**
 * Read a slotted child back as data: list items as a string array, any
 * other element as its trimmed text. Returns undefined when absent/empty.
 * @param {Element} host
 * @param {string} slot
 * @returns {string | string[] | undefined}
 */
export function readSlot(host, slot) {
  const el = slottedChild(host, slot);
  if (!el) return undefined;
  if (el.tagName === 'UL' || el.tagName === 'OL') {
    const items = [...el.querySelectorAll('li')].map(li => li.textContent?.trim() ?? '').filter(Boolean);
    return items.length ? items : undefined;
  }
  return el.textContent?.trim() || undefined;
}

/**
 * Detail level from the `detail` / `compact` attributes.
 * @param {Element} host
 * @returns {string} full | compact | minimal
 */
export function detailLevel(host) {
  return host.getAttribute('detail') || (host.hasAttribute('compact') ? 'compact' : 'full');
}

/**
 * Mark every section whose first `<slot>` has no assigned nodes with
 * `data-empty` (compact cards hide those).
 * @param {ParentNode} root
 * @param {string} sectionSelector
 */
export function markEmptySections(root, sectionSelector) {
  for (const section of root.querySelectorAll(sectionSelector)) {
    const slot = section.querySelector('slot');
    if (slot && slot.assignedNodes().length === 0) section.setAttribute('data-empty', '');
  }
}

/* ── Base class for the Shadow DOM record cards ──────────────────── */

/**
 * Shadow DOM base for user-persona, user-story, user-journey, empathy-map,
 * work-item and adr-wc.
 *
 * Lifecycle contract:
 * - First connect runs `_setup()`, then either renders and fires the ready
 *   event, or (with `src`) fetches once and fires ready after the fetched
 *   data renders. Then `_connect()` runs, `data-upgraded` is set and
 *   `<tag>:upgraded` is dispatched in a microtask.
 * - Reconnects (e.g. a kanban drag moving the card) only run `_connect()`:
 *   no re-fetch, no re-render, no second ready event.
 * - Disconnect runs `_disconnect()` (stop observers). A pending fetch keeps
 *   going, so a card moved mid-load still fills in.
 * - Attribute changes before first setup are ignored (setup reads them).
 *   After setup, a `src` change refetches (aborting the earlier request and
 *   dropping its response, via SrcLoader); removing `src` aborts a pending
 *   fetch and renders the authored content (firing ready if it has not
 *   fired yet). Other changes call `_attributeEffects(name)` and then
 *   `_attributeChanged(name)`.
 * - A data record (`.data` or `src`) sets attributes without a render per
 *   attribute; once it is applied, `_attributeEffects(name)` runs for each
 *   attribute it changed, then the card renders once.
 *
 * Subclasses set `static readyEvent` and implement `_render()`,
 * `_readyDetail()` and, if they load JSON, `_applyData(data)`. Side effects
 * of an attribute (observers, …) belong in `_attributeEffects()`, not in
 * `_attributeChanged()`, so they also run when a data record sets it.
 */
export class UXShadowElement extends HTMLElement {
  /** Ready event name, e.g. `user-story:ready`. */
  static readyEvent = '';
  /**
   * Deprecated un-namespaced alias of the ready event (e.g. `story-ready`),
   * dispatched right after it with the same detail. 0.3.x only.
   */
  static legacyReadyEvent = '';

  /** Fallback text for slots whose light-DOM child was removed after setup. */
  _slotCache = new Map();

  #setUp = false;
  #readyFired = false;
  #loader = new SrcLoader();
  #quiet = 0;
  /** Attributes changed while quiet (a data record being applied). */
  /** @type {Set<string>} */
  #quietChanges = new Set();

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  /** True once first-connect setup has run. */
  get _isSetUp() { return this.#setUp; }

  connectedCallback() {
    if (this.#setUp) {
      this._connect();
      return;
    }
    this.#setUp = true;
    this._cacheSlotValues();
    this._setup();
    const src = this.getAttribute('src');
    if (src) {
      this._loadSrc(src);
    } else {
      this._render();
      this._fireReady();
    }
    this._connect();
    this.setAttribute('data-upgraded', '');
    queueMicrotask(() => {
      this.dispatchEvent(new CustomEvent(`${this.localName}:upgraded`, { bubbles: true }));
    });
  }

  disconnectedCallback() {
    this._disconnect();
  }

  /**
   * @param {string} name
   * @param {string | null} oldValue
   * @param {string | null} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (!this.#setUp || oldValue === newValue) return;
    if (this.#quiet) {
      if (name !== 'src') this.#quietChanges.add(name);
      return;
    }
    if (name === 'src') {
      this._loadSrc(newValue);
      return;
    }
    this._attributeEffects(name);
    this._attributeChanged(name);
  }

  /* ── Hooks (override as needed) ─────────────────── */

  /** One-time setup before the first render (e.g. id from story-id). */
  _setup() {}
  /** Every connect, after setup on the first: (re)attach observers. */
  _connect() {}
  /** Every disconnect: detach observers. */
  _disconnect() {}
  /**
   * Non-render side effects of an attribute change (e.g. re-pointing an
   * observer). Runs before `_attributeChanged()`, and also after a data
   * record that changed the attribute has been applied.
   * @param {string} _name
   */
  _attributeEffects(_name) {}
  /** @param {string} _name */
  _attributeChanged(_name) { this._render(); }
  /** Render the full shadow tree. */
  _render() {}
  /** @returns {object} detail for the ready event */
  _readyDetail() { return {}; }
  /** @param {Record<string, any>} _data apply a JSON record to attributes/slots/properties */
  _applyData(_data) {}
  /** Shown while `src` loads. Default: render what is already known. */
  _renderLoading() { this._render(); }
  /** @param {Error} err shown when `src` fails. Default: a console warning. */
  _renderError(err) {
    console.warn(`[${this.localName}] Failed to load src="${this.getAttribute('src')}":`, err);
  }

  /* ── Shared behaviour ───────────────────────────── */

  _cacheSlotValues() {
    for (const child of this.children) {
      const slot = child.getAttribute('slot');
      if (slot) this._slotCache.set(slot, child.textContent?.trim() ?? '');
    }
  }

  /**
   * Trimmed text of the slotted child for `slot`, else the cached value.
   * @param {string} slot
   * @returns {string}
   */
  _slotText(slot) {
    return slottedChild(this, slot)?.textContent?.trim() || this._slotCache.get(slot) || '';
  }

  /**
   * Run `fn` without attribute changes triggering re-renders (used while a
   * data record sets several attributes; the caller renders once after).
   * @param {() => void} fn
   */
  _quietly(fn) {
    this.#quiet++;
    try { fn(); } finally { this.#quiet--; }
    if (this.#quiet === 0 && this.#quietChanges.size) {
      const changed = [...this.#quietChanges];
      this.#quietChanges.clear();
      for (const name of changed) this._attributeEffects(name);
    }
  }

  /**
   * Apply a record assigned to `.data`, re-render, and emit
   * `<tag>:data-changed` { data, source: 'property' }.
   * @param {unknown} value
   */
  _setData(value) {
    if (!value || typeof value !== 'object') return;
    this._quietly(() => this._applyData(/** @type {Record<string, any>} */ (value)));
    this._cacheSlotValues();
    this._render();
    this.dispatchEvent(new CustomEvent(`${this.localName}:data-changed`, {
      detail: { data: /** @type {any} */ (this).data, source: 'property' },
      bubbles: true, composed: true,
    }));
  }

  /** Dispatch the ready event, at most once per element. */
  _fireReady() {
    if (this.#readyFired) return;
    const type = /** @type {typeof UXShadowElement} */ (this.constructor).readyEvent;
    if (!type) return;
    this.#readyFired = true;
    const legacy = /** @type {typeof UXShadowElement} */ (this.constructor).legacyReadyEvent;
    this._emit(type, this._readyDetail(), legacy);
  }

  /**
   * Dispatch a bubbling, composed CustomEvent and, when `legacyType` is
   * given, a deprecated alias of it right after with the same detail.
   * @param {string} type
   * @param {unknown} detail
   * @param {string} [legacyType]
   */
  _emit(type, detail, legacyType) {
    this.dispatchEvent(new CustomEvent(type, { detail, bubbles: true, composed: true }));
    if (legacyType) {
      this.dispatchEvent(new CustomEvent(legacyType, { detail, bubbles: true, composed: true }));
    }
  }

  /**
   * Fetch `url` as JSON and apply it. Each call supersedes the previous
   * one: the earlier request is aborted and its response, if it still
   * arrives, is ignored. A null/empty `url` (src removed) aborts any
   * pending request and renders the authored content instead.
   * @param {string | null} url
   */
  async _loadSrc(url) {
    if (!url) {
      this.#loader.cancel();
      this._render();
      this._fireReady();
      return;
    }
    this._renderLoading();
    let result;
    try {
      result = await this.#loader.fetchJson(url);
    } catch (err) {
      this._renderError(err instanceof Error ? err : new Error(String(err)));
      return;
    }
    if (!result) return;
    const { data } = result;
    this._quietly(() => this._applyData(data && typeof data === 'object' ? data : {}));
    this._cacheSlotValues();
    this._render();
    this._fireReady();
  }
}
