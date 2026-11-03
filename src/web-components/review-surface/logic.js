/**
 * <review-surface> — Pin-based annotation overlay for design review
 *
 * Wraps any content and adds a transparent overlay for placing
 * review comment pins. Supports pluggable persistence adapters.
 *
 * Data sources:
 *   1. `src` attribute — URL to a JSON file
 *   2. `.pins` property — set programmatically
 *   3. Adapter — loaded via `adapter` attribute or `.adapter` property
 *
 * JSON schema:
 *   {
 *     "pins": [
 *       {
 *         "id": "...",
 *         "x": 42.5,
 *         "y": 67.3,
 *         "text": "Fix alignment",
 *         "author": "Sarah",
 *         "createdAt": "2026-04-06T14:30:00Z",
 *         "resolved": false,
 *         "replies": [{ "id": "...", "text": "...", "author": "...", "createdAt": "..." }]
 *       }
 *     ]
 *   }
 *
 * @typedef {object} PinReply
 * @property {string} id
 * @property {string} text
 * @property {string} [author]
 * @property {string} [createdAt]
 *
 * @typedef {object} Pin
 * @property {string} id
 * @property {number} x
 * @property {number} y
 * @property {string} text
 * @property {string} [author]
 * @property {string} [createdAt]
 * @property {boolean} [resolved]
 * @property {PinReply[]} [replies]
 */

import { styles } from './styles.js';
import { registerComponent } from '../../lib/bundle-registry.js';
import { esc, initials, hashColor, lucideSvg, UX_ICONS } from '../_ux-base.js';
import { VBStore } from '../../lib/vb-store.js';
import { copyText } from '../../utils/copy-init.js';

/* ── Adapters ──────────────────────────────────────── */

class MemoryAdapter {
  #pins = new Map();

  async load() {
    return [...this.#pins.values()];
  }

  async save(pin) {
    if (!pin.id) pin.id = crypto.randomUUID();
    this.#pins.set(pin.id, pin);
    return pin;
  }

  /**
   * Merge `changes` into the stored pin. Upserts: a pin this adapter has
   * never seen (loaded via `src` or `.pins`) is stored from `pin` (or just
   * its id) plus the changes, so resolving / replying always works.
   * @param {string} id
   * @param {object} changes
   * @param {object} [pin] the component's full copy of the pin
   */
  async update(id, changes, pin) {
    const stored = this.#pins.get(id) ?? { ...(pin ?? {}), id };
    Object.assign(stored, changes);
    this.#pins.set(id, stored);
    return stored;
  }

  async remove(id) {
    this.#pins.delete(id);
  }
}

class LocalStorageAdapter {
  #key;

  constructor(key = 'default') {
    this.#key = key;
  }

  async #read() {
    const pins = await VBStore.get('reviews', this.#key);
    return Array.isArray(pins) ? pins : [];
  }

  async #write(pins) {
    await VBStore.set('reviews', this.#key, pins);
  }

  async load() {
    return this.#read();
  }

  async save(pin) {
    if (!pin.id) pin.id = crypto.randomUUID();
    const pins = await this.#read();
    pins.push(pin);
    await this.#write(pins);
    return pin;
  }

  /**
   * Merge `changes` into the stored pin; upserts like MemoryAdapter.update.
   * @param {string} id
   * @param {object} changes
   * @param {object} [pin]
   */
  async update(id, changes, pin) {
    const pins = await this.#read();
    let idx = pins.findIndex(p => p.id === id);
    if (idx === -1) idx = pins.push({ ...(pin ?? {}), id }) - 1;
    Object.assign(pins[idx], changes);
    await this.#write(pins);
    return pins[idx];
  }

  async remove(id) {
    const pins = (await this.#read()).filter(p => p.id !== id);
    await this.#write(pins);
  }
}

class RestAdapter {
  #endpoint;

  constructor(endpoint) {
    if (!endpoint) throw new Error('RestAdapter requires an endpoint URL');
    this.#endpoint = endpoint.replace(/\/$/, '');
  }

  async load() {
    const res = await fetch(this.#endpoint);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : data.pins || [];
  }

  async save(pin) {
    const res = await fetch(this.#endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pin),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  async update(id, changes) {
    const res = await fetch(`${this.#endpoint}/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(changes),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  async remove(id) {
    const res = await fetch(`${this.#endpoint}/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  }
}

/* ── Component ─────────────────────────────────────── */

/**
 * Clamp a pin coordinate to a 0–100 percentage. Non-numeric input → 0.
 * @param {unknown} v
 * @returns {number}
 */
const pct = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : 0;
};

class ReviewSurface extends HTMLElement {
  static get observedAttributes() {
    return ['src', 'editable', 'adapter', 'endpoint', 'storage-key', 'author', 'compact', 'show-resolved'];
  }

  /** True after the first connect (adapter resolved, initial load started). */
  #initialized = false;
  /** True once the initial data (src / adapter / .pins) has settled. */
  #loaded = false;
  #readyFired = false;
  /** Set when `.pins` is assigned; stops the first connect reloading from the adapter. */
  #pinsAssigned = false;
  /** Bumped by every load and every `.pins` / importPins() so stale async loads are dropped. */
  #loadSeq = 0;

  /** @type {HTMLElement} */ #overlay;
  /** @type {HTMLElement} */ #popoverHost;
  /** @type {HTMLElement} */ #toolbarHost;
  /** @type {HTMLElement} */ #status;
  /** @type {HTMLElement} */ #live;

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });

    /* The skeleton is built once. _render() only refills the overlay,
       popover and toolbar hosts, so the live region persists and focus
       can be restored to the equivalent control after a re-render. */
    root.innerHTML = `<style>${styles}</style>
      <div class="rs-status state-msg" hidden></div>
      <div class="rs-container">
        <slot></slot>
        <div class="rs-overlay" role="group" aria-label="Review pins"></div>
        <div class="rs-popover-host" style="display:contents"></div>
      </div>
      <div class="rs-toolbar-host" style="display:contents"></div>
      <div class="rs-live" role="status" aria-live="polite" aria-atomic="true"></div>`;

    const q = (/** @type {string} */ sel) => /** @type {HTMLElement} */ (root.querySelector(sel));
    this.#status = q('.rs-status');
    this.#overlay = q('.rs-overlay');
    this.#popoverHost = q('.rs-popover-host');
    this.#toolbarHost = q('.rs-toolbar-host');
    this.#live = q('.rs-live');

    /* Delegated once — nodes inside the hosts are replaced on render. */
    root.addEventListener('click', (e) => this.#onClick(e));
    root.addEventListener('keydown', (e) => this.#onKeydown(/** @type {KeyboardEvent} */ (e)));

    /** @type {import('./logic.js').Pin[]} */
    this.__pins = [];
    /** @type {MemoryAdapter|LocalStorageAdapter|RestAdapter|null} */
    this.__adapter = null;
    /** @type {string|null} */
    this._activePin = null;
    /** @type {boolean} */
    this._annotating = false;
  }

  /* ── Properties ─────────────────────────────────── */

  /** @returns {Object[]} */
  get pins() { return this.__pins; }

  /**
   * Replace the pin list and re-render. Idempotent — assigning the
   * same array reference is a no-op. May be assigned before the element
   * is connected: the first connect then keeps these pins instead of
   * loading from the adapter. Emits review-surface:pins-changed with
   * `source: 'property'`.
   * @param {Object[]} data
   */
  set pins(data) {
    const next = Array.isArray(data) ? data : [];
    if (this.__pins === next) return;
    this.__pins = /** @type {any} */ (next);
    this.#pinsAssigned = true;
    this.#loadSeq++;
    this.#loaded = true;
    if (this.#initialized) this._render();
    this.dispatchEvent(new CustomEvent('review-surface:pins-changed', {
      detail: { pins: next, source: 'property' },
      bubbles: true, composed: true,
    }));
  }

  /** @returns {MemoryAdapter|LocalStorageAdapter|RestAdapter|null} */
  get adapter() { return this.__adapter; }

  /**
   * Set a persistence adapter. Before connect it is simply kept (the
   * first connect loads from it unless `.pins` was assigned); once
   * connected, pins are reloaded from it.
   * @param {Object} adapterInstance
   */
  set adapter(adapterInstance) {
    this.__adapter = /** @type {any} */ (adapterInstance);
    if (this.#initialized && this.isConnected) this._loadFromAdapter();
  }

  /* ── Lifecycle ─────────────────────────────────── */

  connectedCallback() {
    this.setAttribute('data-upgraded', '');

    /* Reconnect (e.g. the element was moved): keep pins and adapter. */
    if (this.#initialized) {
      this._render();
      return;
    }
    this.#initialized = true;
    if (!this.__adapter) this.#resolveAdapter();

    this.dispatchEvent(new CustomEvent('review-surface:upgraded', { bubbles: true, composed: true }));

    if (this.#pinsAssigned) {
      this.#loaded = true;
      this._render();
    } else if (this.hasAttribute('src')) {
      this._loadSrc(this.getAttribute('src'));
    } else {
      this._loadFromAdapter();
    }
  }

  disconnectedCallback() {
    this.removeAttribute('data-upgraded');
    this.removeAttribute('data-annotating');
    this._annotating = false;
  }

  attributeChangedCallback(name) {
    if (!this.#initialized || !this.isConnected) return;
    if (name === 'src') {
      this._loadSrc(this.getAttribute('src'));
    } else if (name === 'adapter' || name === 'endpoint' || name === 'storage-key') {
      this.#resolveAdapter();
      this._loadFromAdapter();
    } else {
      this._render();
    }
  }

  /* ── Adapter resolution ────────────────────────── */

  #resolveAdapter() {
    /* If a custom adapter was set via property, keep it */
    if (this.__adapter && !(this.__adapter instanceof MemoryAdapter) &&
        !(this.__adapter instanceof LocalStorageAdapter) &&
        !(this.__adapter instanceof RestAdapter)) {
      return;
    }

    const type = this.getAttribute('adapter') || 'memory';
    switch (type) {
      case 'local':
        this.__adapter = new LocalStorageAdapter(this.getAttribute('storage-key') || 'default');
        break;
      case 'rest':
        try {
          this.__adapter = new RestAdapter(this.getAttribute('endpoint') ?? '');
        } catch {
          this.__adapter = new MemoryAdapter();
        }
        break;
      default:
        this.__adapter = new MemoryAdapter();
    }
  }

  /* ── Data loading ──────────────────────────────── */

  async _loadSrc(src) {
    if (!src) return;
    const seq = ++this.#loadSeq;
    this.#showStatus('Loading…');
    try {
      const res = await fetch(src);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (seq !== this.#loadSeq) return;
      this.__pins = Array.isArray(data) ? data : data.pins || [];
      this.#loaded = true;
      this._render();
    } catch (err) {
      if (seq !== this.#loadSeq) return;
      const msg = err instanceof Error ? err.message : String(err);
      this.#showStatus(`Could not load pins: ${msg}`, true);
    }
  }

  async _loadFromAdapter() {
    if (!this.__adapter) return;
    const seq = ++this.#loadSeq;
    let pins;
    try {
      pins = await this.__adapter.load();
    } catch {
      pins = [];
    }
    if (seq !== this.#loadSeq) return;
    this.__pins = Array.isArray(pins) ? pins : [];
    this.#loaded = true;
    this._render();
  }

  /**
   * @param {string} message
   * @param {boolean} [error]
   */
  #showStatus(message, error = false) {
    this.#status.textContent = message;
    this.#status.classList.toggle('state-msg--error', error);
    this.#status.hidden = false;
  }

  /* ── Public API ────────────────────────────────── */

  /**
   * Add a pin programmatically.
   * @param {{ x: number, y: number, text: string, author?: string }} pinData
   * @returns {Promise<Object>}
   */
  async addPin(pinData) {
    const pin = {
      id: crypto.randomUUID(),
      x: pct(pinData.x),
      y: pct(pinData.y),
      text: pinData.text || '',
      author: pinData.author || this.getAttribute('author') || 'Anonymous',
      createdAt: new Date().toISOString(),
      resolved: false,
      resolvedBy: null,
      resolvedAt: null,
      replies: [],
    };

    if (this.__adapter) {
      await this.__adapter.save(pin);
    }
    this.__pins.push(pin);
    this._render();
    this.#announce(`Pin ${this.#visiblePins().length} added`);

    this.dispatchEvent(new CustomEvent('review-surface:add', {
      bubbles: true, composed: true,
      detail: { pin },
    }));

    return pin;
  }

  /**
   * Remove a pin by ID.
   * @param {string} id
   */
  async removePin(id) {
    const pin = this.__pins.find(p => p.id === id);
    if (!pin) return;

    if (this.__adapter) {
      await this.__adapter.remove(id);
    }
    this.__pins = this.__pins.filter(p => p.id !== id);
    if (this._activePin === id) this._activePin = null;
    this._render();
    this.#announce('Pin removed');

    this.dispatchEvent(new CustomEvent('review-surface:remove', {
      bubbles: true, composed: true,
      detail: { pin },
    }));
  }

  /**
   * Mark a pin as resolved.
   * @param {string} id
   */
  async resolvePin(id) {
    const pin = this.__pins.find(p => p.id === id);
    if (!pin) return;

    const changes = {
      resolved: true,
      resolvedBy: this.getAttribute('author') || 'Anonymous',
      resolvedAt: new Date().toISOString(),
    };

    if (this.__adapter) {
      await this.__adapter.update(id, changes, pin);
    }
    Object.assign(pin, changes);
    this._render();
    this.#announce('Pin resolved');

    this.dispatchEvent(new CustomEvent('review-surface:resolve', {
      bubbles: true, composed: true,
      detail: { pin },
    }));
  }

  /**
   * Re-open a resolved pin.
   * @param {string} id
   */
  async unresolvePin(id) {
    const pin = this.__pins.find(p => p.id === id);
    if (!pin) return;

    const changes = { resolved: false, resolvedBy: null, resolvedAt: null };

    if (this.__adapter) {
      await this.__adapter.update(id, changes, pin);
    }
    Object.assign(pin, changes);
    this._render();
    this.#announce('Pin re-opened');

    this.dispatchEvent(new CustomEvent('review-surface:update', {
      bubbles: true, composed: true,
      detail: { pin, changes },
    }));
  }

  /**
   * Export all pins as a plain array.
   * @returns {Object[]}
   */
  exportPins() {
    return structuredClone(this.__pins);
  }

  /**
   * Import pins from an array (replaces current).
   * @param {Object[]} data
   */
  importPins(data) {
    this.__pins = Array.isArray(data) ? structuredClone(data) : [];
    this.#loadSeq++;
    this.#loaded = true;
    this._activePin = null;
    this._render();
  }

  /* ── Render ────────────────────────────────────── */

  #visiblePins() {
    const showResolved = this.hasAttribute('show-resolved');
    return this.__pins
      .filter(p => showResolved || !p.resolved)
      .sort((a, b) => new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime());
  }

  _render() {
    const editable = this.hasAttribute('editable');
    const visible = this.#visiblePins();
    const activePin = this._activePin ? this.__pins.find(p => p.id === this._activePin) : null;
    if (this._activePin && !activePin) this._activePin = null;

    this.setAttribute('pin-count', String(visible.length));

    const focus = this.#captureFocus();

    this.#status.hidden = true;
    this.#overlay.innerHTML = visible.map((pin, i) => this._renderPin(pin, i + 1)).join('');
    this.#popoverHost.innerHTML = activePin ? this._renderPopover(activePin, editable) : '';
    this.#toolbarHost.innerHTML = editable ? this._renderToolbar(visible.length) : '';

    this.#restoreFocus(focus);

    if (this.#loaded && !this.#readyFired) {
      this.#readyFired = true;
      this.dispatchEvent(new CustomEvent('review-surface:ready', {
        bubbles: true, composed: true,
        detail: { pinCount: visible.length },
      }));
    }
  }

  /* ── Focus preservation ────────────────────────── */

  /**
   * Describe the focused shadow control so the equivalent node can be
   * re-focused after its host is re-rendered.
   * @returns {{ selector: string, value?: string, inPopover: boolean } | null}
   */
  #captureFocus() {
    const el = /** @type {HTMLElement | null} */ (this.shadowRoot?.activeElement ?? null);
    if (!el) return null;
    const inPopover = !!el.closest('.rs-popover');
    let selector = '';
    if (el.classList.contains('rs-pin')) selector = `.rs-pin[data-pin-id="${CSS.escape(el.dataset.pinId ?? '')}"]`;
    else if (el.dataset.action) selector = `[data-action="${CSS.escape(el.dataset.action)}"]`;
    else if (el.classList.contains('rs-input__field')) selector = '.rs-input__field';
    else if (el.classList.contains('rs-popover')) selector = '.rs-popover';
    const value = el instanceof HTMLTextAreaElement ? el.value : undefined;
    return { selector, value, inPopover };
  }

  /** @param {{ selector: string, value?: string, inPopover: boolean } | null} focus */
  #restoreFocus(focus) {
    if (!focus) return;
    const root = /** @type {ShadowRoot} */ (this.shadowRoot);
    let target = focus.selector ? /** @type {HTMLElement | null} */ (root.querySelector(focus.selector)) : null;
    if (target instanceof HTMLTextAreaElement && focus.value !== undefined) target.value = focus.value;
    /* The control is gone (e.g. Resolve swapped for Re-open): stay in the
       popover if it is still open, else fall back to the active pin. */
    if (!target && focus.inPopover) target = root.querySelector('.rs-popover');
    if (!target) target = this.#pinButton(this._activePin) ?? root.querySelector('[data-action="toggle-mode"]');
    target?.focus();
  }

  /** @param {string|null|undefined} id */
  #pinButton(id) {
    if (!id) return null;
    return /** @type {HTMLElement | null} */ (this.shadowRoot?.querySelector(`.rs-pin[data-pin-id="${CSS.escape(id)}"]`) ?? null);
  }

  /**
   * Open a pin's popover and move focus into it.
   * @param {string} id
   */
  #openPin(id) {
    this._activePin = id;
    this._render();
    /** @type {HTMLElement | null} */ (this.shadowRoot?.querySelector('.rs-popover') ?? null)?.focus();
    this.dispatchEvent(new CustomEvent('review-surface:select', {
      bubbles: true, composed: true,
      detail: { pin: this.__pins.find(p => p.id === id) },
    }));
  }

  /** Close the popover and return focus to its pin. */
  #closePin() {
    const id = this._activePin;
    this._activePin = null;
    this._render();
    this.#pinButton(id)?.focus();
  }

  /* ── Pin marker ────────────────────────────────── */

  _renderPin(pin, number) {
    const preview = pin.text ? String(pin.text).slice(0, 50) : 'Empty pin';
    return `<button type="button" class="rs-pin"
      data-pin-id="${esc(pin.id)}"
      ${pin.resolved ? 'data-resolved' : ''}
      ${this._activePin === pin.id ? 'data-active' : ''}
      style="left:${pct(pin.x)}%;top:${pct(pin.y)}%"
      aria-label="Pin ${number}: ${esc(preview)}"
      aria-expanded="${this._activePin === pin.id}"
      aria-haspopup="dialog">
      <span class="rs-pin__number">${number}</span>
    </button>`;
  }

  /* ── Popover ───────────────────────────────────── */

  _renderPopover(pin, editable) {
    const number = this.#visiblePins().findIndex(p => p.id === pin.id) + 1;
    const label = number > 0 ? `Pin ${number}` : 'Pin';

    return `<div class="rs-popover" data-open tabindex="-1"
      style="left:${Math.min(pct(pin.x), 70)}%;top:${pct(pin.y)}%"
      role="dialog"
      aria-labelledby="rs-popover-title-${esc(pin.id)}">

      <div class="rs-popover__header">
        <span class="rs-popover__title" id="rs-popover-title-${esc(pin.id)}">
          ${label}
          ${pin.resolved ? `<span class="rs-resolved-badge">${lucideSvg(UX_ICONS.checkCircle)} Resolved</span>` : ''}
        </span>
        <div class="rs-popover__actions">
          ${editable && !pin.resolved ? `
            <button type="button" class="rs-popover__btn rs-popover__btn--resolve" data-action="resolve" data-pin-id="${esc(pin.id)}"
              aria-label="Resolve pin" title="Resolve">${lucideSvg(UX_ICONS.checkCircle)}</button>` : ''}
          ${editable && pin.resolved ? `
            <button type="button" class="rs-popover__btn" data-action="unresolve" data-pin-id="${esc(pin.id)}"
              aria-label="Re-open pin" title="Re-open">${lucideSvg(UX_ICONS.messageCircle)}</button>` : ''}
          ${editable ? `
            <button type="button" class="rs-popover__btn rs-popover__btn--delete" data-action="delete" data-pin-id="${esc(pin.id)}"
              aria-label="Delete pin" title="Delete">${lucideSvg(UX_ICONS.x)}</button>` : ''}
          <button type="button" class="rs-popover__btn" data-action="close"
            aria-label="Close">${lucideSvg(UX_ICONS.x)}</button>
        </div>
      </div>

      <div class="rs-comment">
        <div class="rs-comment__meta">
          <span class="rs-comment__avatar" style="background:${hashColor(pin.author || 'Anonymous')}">${esc(initials(pin.author || 'Anonymous'))}</span>
          <span class="rs-comment__author">${esc(pin.author || 'Anonymous')}</span>
          <span class="rs-comment__time">${esc(this.#formatTime(pin.createdAt))}</span>
        </div>
        <div class="rs-comment__text">${esc(pin.text)}</div>
      </div>

      ${pin.replies?.length ? `
        <div class="rs-replies">
          ${pin.replies.map(reply => `
            <div class="rs-reply">
              <div class="rs-comment__meta">
                <span class="rs-comment__avatar" style="background:${hashColor(reply.author || 'Anonymous')}">${esc(initials(reply.author || 'Anonymous'))}</span>
                <span class="rs-comment__author">${esc(reply.author || 'Anonymous')}</span>
                <span class="rs-comment__time">${esc(this.#formatTime(reply.createdAt))}</span>
              </div>
              <div class="rs-comment__text">${esc(reply.text)}</div>
            </div>
          `).join('')}
        </div>` : ''}

      ${editable ? `
        <div class="rs-input">
          <textarea class="rs-input__field" placeholder="Reply…" rows="1"
            aria-label="Reply to ${label.toLowerCase()}"></textarea>
          <button type="button" class="rs-input__submit" data-action="reply" data-pin-id="${esc(pin.id)}"
            aria-label="Send reply">${lucideSvg(UX_ICONS.send)}</button>
        </div>` : ''}

    </div>`;
  }

  /* ── Toolbar ───────────────────────────────────── */

  _renderToolbar(count) {
    return `<div class="rs-toolbar" role="toolbar" aria-label="Review tools">
      <button type="button" class="rs-toolbar__btn" data-action="toggle-mode"
        aria-pressed="${this._annotating}"
        title="Toggle annotate mode">
        ${lucideSvg(UX_ICONS.mapPin)} Annotate
      </button>
      <button type="button" class="rs-toolbar__btn" data-action="export"
        title="Export pins as JSON">
        ${lucideSvg(UX_ICONS.download)} Export
      </button>
      <output class="rs-toolbar__count">${count} pin${count !== 1 ? 's' : ''}</output>
    </div>`;
  }

  /* ── Event handling (delegated on the shadow root) ── */

  /** @param {Event} e */
  #onClick(e) {
    const target = e.target;
    if (!(target instanceof Element)) return;

    /* Pin clicks — toggle popover */
    const pinBtn = /** @type {HTMLElement | null} */ (target.closest('.rs-pin'));
    if (pinBtn) {
      e.stopPropagation();
      const id = pinBtn.dataset.pinId ?? null;
      if (this._activePin === id) this.#closePin();
      else if (id) this.#openPin(id);
      return;
    }

    /* Popover / toolbar actions */
    const actionBtn = /** @type {HTMLElement | null} */ (target.closest('[data-action]'));
    if (actionBtn) {
      e.stopPropagation();
      const pinId = actionBtn.dataset.pinId;
      switch (actionBtn.dataset.action) {
        case 'close':
          this.#closePin();
          break;
        case 'resolve':
          if (pinId) this.resolvePin(pinId);
          break;
        case 'unresolve':
          if (pinId) this.unresolvePin(pinId);
          break;
        case 'delete':
          if (pinId) this.removePin(pinId);
          break;
        case 'toggle-mode':
          this.#setAnnotating(!this._annotating);
          break;
        case 'export':
          this.#exportToClipboard();
          break;
        case 'reply':
          if (pinId) this.#submitReply(pinId);
          break;
      }
      return;
    }

    /* Overlay click — place new pin in annotate mode */
    if (target === this.#overlay && this._annotating && this.hasAttribute('editable')) {
      const me = /** @type {MouseEvent} */ (e);
      const rect = this.#overlay.getBoundingClientRect();
      const x = ((me.clientX - rect.left) / rect.width) * 100;
      const y = ((me.clientY - rect.top) / rect.height) * 100;
      this.#promptNewPin(x, y);
    }
  }

  /** @param {KeyboardEvent} e */
  #onKeydown(e) {
    const target = e.target;

    /* Reply input — Enter to submit (Shift+Enter for newline) */
    if (e.key === 'Enter' && !e.shiftKey && target instanceof Element && target.matches('.rs-input__field')) {
      e.preventDefault();
      const pinId = /** @type {HTMLElement | null} */ (this.shadowRoot?.querySelector('[data-action="reply"]') ?? null)?.dataset.pinId;
      if (pinId) this.#submitReply(pinId);
      return;
    }

    /* Escape — close the popover (focus back to its pin), else exit annotate mode */
    if (e.key === 'Escape') {
      if (this._activePin) {
        e.stopPropagation();
        this.#closePin();
      } else if (this._annotating) {
        e.stopPropagation();
        this.#setAnnotating(false);
      }
    }
  }

  /** @param {boolean} on */
  #setAnnotating(on) {
    this._annotating = on;
    this.toggleAttribute('data-annotating', on);
    this._render();
    this.dispatchEvent(new CustomEvent('review-surface:mode', {
      bubbles: true, composed: true,
      detail: { mode: on ? 'annotate' : 'view' },
    }));
  }

  /* ── Internal helpers ──────────────────────────── */

  async #promptNewPin(x, y) {
    const author = this.getAttribute('author') || 'Anonymous';
    const pin = await this.addPin({ x, y, text: '', author });

    /* Open the new pin's popover and focus the reply field for text entry */
    this._activePin = pin.id;
    this._render();
    /** @type {HTMLElement | null} */ (this.shadowRoot?.querySelector('.rs-input__field') ?? null)?.focus();
  }

  async #submitReply(pinId) {
    const field = /** @type {HTMLTextAreaElement | null} */ (this.shadowRoot?.querySelector('.rs-input__field') ?? null);
    if (!field) return;

    const text = field.value.trim();
    if (!text) return;

    const pin = this.__pins.find(p => p.id === pinId);
    if (!pin) return;

    const reply = {
      id: crypto.randomUUID(),
      text,
      author: this.getAttribute('author') || 'Anonymous',
      createdAt: new Date().toISOString(),
    };

    /* If pin has no text yet (just placed), promote first reply to pin text */
    const changes = pin.text
      ? { replies: [...(pin.replies ?? []), reply] }
      : { text };

    if (this.__adapter) {
      await this.__adapter.update(pinId, changes, pin);
    }
    Object.assign(pin, changes);
    if (!pin.replies) pin.replies = [];

    field.value = '';
    this._render();
    this.#announce('Reply added');
    /** @type {HTMLElement | null} */ (this.shadowRoot?.querySelector('.rs-input__field') ?? null)?.focus();

    this.dispatchEvent(new CustomEvent('review-surface:update', {
      bubbles: true, composed: true,
      detail: { pin, changes },
    }));
  }

  async #exportToClipboard() {
    const data = JSON.stringify(this.exportPins(), null, 2);
    const ok = await copyText(data, { announceMessage: 'Pins copied to clipboard' });
    if (ok) return;

    /* Fallback: download as file */
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'review-pins.json';
    a.click();
    URL.revokeObjectURL(url);
    this.#announce('Pins exported as file');
  }

  #formatTime(isoString) {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      if (Number.isNaN(date.getTime())) return '';
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);

      if (diffMins < 1) return 'just now';
      if (diffMins < 60) return `${diffMins}m ago`;

      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;

      const diffDays = Math.floor(diffHours / 24);
      if (diffDays < 7) return `${diffDays}d ago`;

      return date.toLocaleDateString();
    } catch {
      return '';
    }
  }

  /**
   * Write to the persistent live region (never re-rendered, so the
   * message survives the render that follows every change).
   * @param {string} message
   */
  #announce(message) {
    this.#live.textContent = message;
  }
}

registerComponent('review-surface', ReviewSurface);

export { ReviewSurface, MemoryAdapter, LocalStorageAdapter, RestAdapter };
