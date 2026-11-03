/**
 * <empathy-map> — Four-quadrant empathy map web component
 *
 * Visualises Says / Thinks / Does / Feels quadrants with optional
 * flip-to-edit interaction and JSON loading.
 *
 * Data sources:
 *   1. `src` attribute — URL to a JSON file
 *   2. `.quadrants` property — set programmatically
 *   3. Slotted content — `<ul slot="says">`, etc.
 *
 * JSON schema:
 *   {
 *     "title": "...",
 *     "persona": "...",
 *     "personaId": "...",
 *     "summary": "...",
 *     "quadrants": {
 *       "says":   ["item1", "item2"],
 *       "thinks": ["item1", "item2"],
 *       "does":   ["item1", "item2"],
 *       "feels":  ["frustrated", "curious"]
 *     },
 *     "goals": ["goal1"],
 *     "painPoints": ["pain1"]
 *   }
 *
 * Title and summary are content: `<h2 slot="title">`, `<p slot="summary">`
 * (or the `title` / `summary` JSON fields, which create those children).
 * Once a quadrant has been edited, it renders from the edited items; its
 * slotted light-DOM content is no longer projected.
 *
 * @fires empathy-map:ready        - Once, after the first render (after the src data renders when src is set), detail: { title, persona }
 * @fires empathy-map:update       - After an edit is committed (Done / Escape / closeQuadrant()), detail: { quadrant, items }
 * @fires empathy-map:upgraded     - Once, after first connect
 * @fires empathy-map:data-changed - After .data assignment, detail: { data, source: 'property' }
 */

import { styles } from './styles.js';
import { registerComponent } from '../../lib/bundle-registry.js';
import { viewTransitionSwap } from '../../lib/vb-view-transition.js';
import {
  esc, QUADRANT_META, emotionMeta, isEmotion, lucideSvg, UX_ICONS, UXShadowElement, fillSlot, slottedChild,
} from '../_ux-base.js';

const QUADRANT_KEYS = ['says', 'thinks', 'does', 'feels'];

class EmpathyMap extends UXShadowElement {
  static readyEvent = 'empathy-map:ready';

  static get observedAttributes() {
    return ['persona', 'persona-id', 'src', 'editable', 'compact'];
  }

  /** @type {Object<string, string[]>|null} */
  __quadrants = null;
  /** @type {string[]|null} */
  __goals = null;
  /** @type {string[]|null} */
  __painPoints = null;
  /** @type {Set<string>} quadrants whose editor is open */
  _editingQuadrants = new Set();
  /** @type {Set<string>} quadrants edited at least once (render from data, not the slot) */
  _editedQuadrants = new Set();

  /* ── Properties ─────────────────────────────────── */

  /** @returns {Object<string, string[]>|null} */
  get quadrants() { return this.__quadrants; }

  /** @param {Object<string, string[]>|null} data */
  set quadrants(data) {
    this.__quadrants = data;
    if (this._isSetUp) this._render();
  }

  /** @returns {string[]|null} */
  get goals() { return this.__goals; }

  /** @param {string[]|null} data */
  set goals(data) {
    this.__goals = data;
    if (this._isSetUp) this._render();
  }

  /** @returns {string[]|null} */
  get painPoints() { return this.__painPoints; }

  /** @param {string[]|null} data */
  set painPoints(data) {
    this.__painPoints = data;
    if (this._isSetUp) this._render();
  }

  /**
   * Attribute value, else the text of a same-named light-DOM child (e.g.
   * `<span slot="persona">`, read as data; it is not projected).
   * @param {string} attr
   */
  _resolve(attr) {
    return this.getAttribute(attr) || this._slotCache.get(attr) || '';
  }

  _readyDetail() {
    return { title: this._slotText('title') || 'Empathy Map', persona: this._resolve('persona') };
  }

  // ── Data API (HTML-first / JS-first dual contract) ──────────────

  /**
   * Read the empathy map as a plain data object combining state and
   * slotted content. Mirrors what a consumer would assign to .data.
   */
  get data() {
    const titleEl = slottedChild(this, 'title');
    const summaryEl = slottedChild(this, 'summary');
    return {
      persona: this.getAttribute('persona') || undefined,
      personaId: this.getAttribute('persona-id') || undefined,
      title: titleEl?.textContent?.trim() || undefined,
      summary: summaryEl?.textContent?.trim() || undefined,
      quadrants: this.__quadrants || undefined,
      goals: this.__goals || undefined,
      painPoints: this.__painPoints || undefined,
    };
  }

  /**
   * Set state attributes, slotted content, and quadrant/goals/pain-point
   * arrays from a plain object in one call. Idempotent for repeat calls.
   * Emits empathy-map:data-changed { data, source: 'property' }.
   */
  set data(value) {
    this._setData(value);
  }

  /**
   * Apply an empathy-map record (from .data or src). Title / summary create
   * slotted children only when none are authored.
   * @param {Record<string, any>} data
   */
  _applyData(data) {
    if (data.persona)   this.setAttribute('persona',    String(data.persona));
    if (data.personaId) this.setAttribute('persona-id', String(data.personaId));
    fillSlot(this, 'title', data.title, { tag: 'h2' });
    fillSlot(this, 'summary', data.summary);
    if (data.quadrants  != null) this.__quadrants  = data.quadrants;
    if (data.goals      != null) this.__goals      = data.goals;
    if (data.painPoints != null) this.__painPoints = data.painPoints;
  }

  /* ── Public API ────────────────────────────────── */

  /**
   * Open a quadrant for editing.
   * @param {string} name - Quadrant key: says|thinks|does|feels
   */
  editQuadrant(name) {
    if (!QUADRANT_KEYS.includes(name)) return;
    if (!this.hasAttribute('editable')) return;
    this._openEdit(name);
  }

  /**
   * Close a quadrant edit and save. No-op (and no update event) unless the
   * quadrant's editor is open.
   * @param {string} name - Quadrant key: says|thinks|does|feels
   */
  closeQuadrant(name) {
    if (!QUADRANT_KEYS.includes(name)) return;
    this._closeEdit(name);
  }

  /* ── JSON loading states ───────────────────────── */

  _renderLoading() {
    /** @type {ShadowRoot} */ (this.shadowRoot).innerHTML = `<style>${styles}</style>` +
      `<div class="state-msg">Loading\u2026</div>`;
  }

  /** @param {Error} err */
  _renderError(err) {
    /** @type {ShadowRoot} */ (this.shadowRoot).innerHTML = `<style>${styles}</style>` +
      `<div class="state-msg state-msg--error">Could not load empathy map: ${esc(err.message)}</div>`;
  }

  /* ── Render ────────────────────────────────────── */

  _render() {
    const persona   = this._resolve('persona')    || '';
    const personaId = this._resolve('persona-id') || '';
    const compact   = this.hasAttribute('compact');
    const editable  = this.hasAttribute('editable');
    const hasSummary = !!slottedChild(this, 'summary') || this._slotCache.has('summary');

    const hasGoals = this.__goals?.length || slottedChild(this, 'goals');
    const hasPains = this.__painPoints?.length || slottedChild(this, 'pain-points');

    const html = `<style>${styles}</style>
      <article class="empathy-map${compact ? ' empathy-map--compact' : ''}">

        <header class="empathy-map__header">
          <div class="empathy-map__header-top">
            <div class="empathy-map__chips">
              <span class="chip chip--type">Empathy Map</span>
            </div>
            ${persona ? `
              <div class="empathy-map__persona">
                ${personaId
                  ? `<a class="persona-ref" href="#${esc(personaId)}">${lucideSvg(UX_ICONS.user)} ${esc(persona)}</a>`
                  : `<span class="persona-ref">${lucideSvg(UX_ICONS.user)} ${esc(persona)}</span>`}
              </div>` : ''}
          </div>
          <div class="empathy-map__title-wrap">
            <slot name="title"><h2 class="empathy-map__title">Empathy Map</h2></slot>
          </div>
          ${hasSummary ? `<div class="empathy-map__summary-wrap"><slot name="summary"></slot></div>` : ''}
        </header>

        <div class="empathy-map__grid">
          ${QUADRANT_KEYS.map(key => this._renderQuadrant(key, editable)).join('')}
        </div>

        ${hasGoals || hasPains ? `
          <footer class="empathy-map__footer">
            ${this._renderSummaryRow('goals', lucideSvg(UX_ICONS.target), 'Goals')}
            ${this._renderSummaryRow('pain-points', lucideSvg(UX_ICONS.alertTriangle), 'Pain Points')}
          </footer>
        ` : ''}

      </article>`;

    /* Pin view-transition-name on the host so the browser crossfades the
       light-DOM snapshot (which includes shadow paint) on data/theme
       swaps. Skip on the first render — nothing to fade from. */
    const swap = () => {
      if (!this.shadowRoot) return;
      // An open editor's unsaved text (and focus) survives the re-render.
      const drafts = this.#captureDrafts();
      this.shadowRoot.innerHTML = html;
      if (editable) {
        this._bindEditListeners();
        this.#restoreDrafts(drafts);
      }
    };
    if (this.shadowRoot?.querySelector('article')) {
      viewTransitionSwap(this, swap, 'em-vt');
    } else {
      swap();
    }
  }

  /* ── Render quadrant ───────────────────────────── */

  _renderQuadrant(key, editable) {
    const meta = QUADRANT_META[key];
    const items = this.__quadrants?.[key];
    const isEditing = this._editingQuadrants.has(key);

    const frontContent = (items && items.length) || this._editedQuadrants.has(key)
      ? this._quadrantItemsHtml(key)
      : `<slot name="${key}"><p class="placeholder">Add ${meta.label.toLowerCase()} items\u2026</p></slot>`;

    const textareaValue = this.#editorSeed(key);

    return `
      <section class="quadrant quadrant--${key}"${isEditing ? ' data-editing' : ''}>
        <div class="quadrant__inner">
          <div class="quadrant__header">
            <div class="quadrant__icon" aria-hidden="true">${lucideSvg(meta.icon)}</div>
            <h3 class="quadrant__label">${meta.label}</h3>
            ${editable ? `<button class="quadrant__edit-btn" data-quadrant="${key}"
              aria-label="Edit ${meta.label}" title="Edit ${meta.label}">${lucideSvg(UX_ICONS.pencil)}</button>` : ''}
          </div>
          <div class="quadrant__faces">
            <div class="quadrant__face quadrant__face--front"${isEditing ? ' inert' : ''}>
              <div class="quadrant__content">
                ${frontContent}
              </div>
            </div>
            ${editable ? `
              <div class="quadrant__face quadrant__face--back"${isEditing ? '' : ' inert'}>
                <textarea class="quadrant__editor" data-quadrant="${key}"
                  placeholder="One item per line\u2026"
                  aria-label="Edit ${meta.label} items">${esc(textareaValue)}</textarea>
                <button class="quadrant__done-btn" data-quadrant="${key}"
                  aria-label="Done editing ${meta.label}">${lucideSvg(UX_ICONS.check)} Done</button>
              </div>
            ` : ''}
          </div>
        </div>
      </section>`;
  }

  /**
   * Front-face markup for a quadrant rendered from data (no slot).
   * @param {string} key
   */
  _quadrantItemsHtml(key) {
    const items = this.__quadrants?.[key] || [];
    if (!items.length) {
      return `<p class="placeholder">Add ${QUADRANT_META[key].label.toLowerCase()} items\u2026</p>`;
    }
    return key === 'feels'
      ? items.map(item => this._renderEmotion(item)).join('')
      : items.map(item => `<p>${esc(item)}</p>`).join('');
  }

  /* ── Render emotion tag ────────────────────────── */

  _renderEmotion(item) {
    if (isEmotion(item)) {
      const meta = emotionMeta(item);
      return `<span class="emotion-tag" style="--ec:${meta.color}"><span role="img" aria-label="${esc(item)}">${meta.emoji}</span> ${esc(item)}</span>`;
    }
    return `<p>${esc(item)}</p>`;
  }

  /* ── Render summary row ────────────────────────── */

  _renderSummaryRow(slotName, icon, label) {
    const dataKey = slotName === 'pain-points' ? 'painPoints' : slotName;
    const items = dataKey === 'painPoints' ? this.__painPoints : this.__goals;

    const content = items?.length
      ? items.map(item => `<p>${esc(item)}</p>`).join('')
      : `<slot name="${slotName}"><p class="placeholder">No ${label.toLowerCase()} specified.</p></slot>`;

    return `
      <div class="summary-row">
        <span class="summary-row__icon" aria-hidden="true">${icon}</span>
        <div class="summary-row__body">
          <div class="summary-row__label">${label}</div>
          <div class="summary-row__content">${content}</div>
        </div>
      </div>`;
  }

  /* ── Edit interaction ──────────────────────────── */

  _bindEditListeners() {
    const root = this.shadowRoot;
    if (!root) return;

    root.querySelectorAll('.quadrant__edit-btn').forEach((/** @type {Element} */ btn) => {
      btn.addEventListener('click', () => {
        const q = /** @type {HTMLElement} */ (btn).dataset.quadrant;
        if (q) this._openEdit(q);
      });
    });

    root.querySelectorAll('.quadrant__done-btn').forEach((/** @type {Element} */ btn) => {
      btn.addEventListener('click', () => {
        const q = /** @type {HTMLElement} */ (btn).dataset.quadrant;
        if (q) this._closeEdit(q);
      });
    });

    root.querySelectorAll('.quadrant__editor').forEach((/** @type {Element} */ rawTextarea) => {
      const textarea = /** @type {HTMLTextAreaElement} */ (rawTextarea);
      textarea.addEventListener('keydown', (/** @type {Event} */ e) => {
        const ke = /** @type {KeyboardEvent} */ (e);
        if (ke.key === 'Escape') {
          ke.preventDefault();
          const q = textarea.dataset.quadrant;
          if (q) this._closeEdit(q);
        }
      });
    });
  }

  _openEdit(key) {
    const section = this.shadowRoot?.querySelector(`.quadrant--${key}`);
    if (!section) return;
    this._editingQuadrants.add(key);

    section.setAttribute('data-editing', '');

    const front = section.querySelector('.quadrant__face--front');
    const back  = section.querySelector('.quadrant__face--back');
    if (front) front.setAttribute('inert', '');
    if (back)  back.removeAttribute('inert');

    const textarea = /** @type {HTMLTextAreaElement | null} */ (section.querySelector('.quadrant__editor'));
    if (textarea) {
      textarea.value = this.#editorSeed(key);
      textarea.focus();
    }
  }

  /**
   * Text an editor opens with: the saved items, else (for a quadrant never
   * edited) its slotted light-DOM items, one per line.
   * @param {string} key
   * @returns {string}
   */
  #editorSeed(key) {
    const items = this.__quadrants?.[key];
    if (items?.length) return items.join('\n');
    if (this._editedQuadrants.has(key)) return '';
    /** @type {string[]} */
    const lines = [];
    for (const el of this.children) {
      if (el.getAttribute('slot') !== key) continue;
      const lis = el.querySelectorAll('li');
      if (lis.length) lis.forEach(li => lines.push(li.textContent?.trim() ?? ''));
      else lines.push(el.textContent?.trim() ?? '');
    }
    return lines.filter(Boolean).join('\n');
  }

  /**
   * Snapshot open editors (value, selection, focus) before the shadow
   * tree is replaced.
   * @returns {Map<string, { value: string, start: number, end: number, focused: boolean }>}
   */
  #captureDrafts() {
    const drafts = new Map();
    const root = this.shadowRoot;
    if (!root) return drafts;
    for (const key of this._editingQuadrants) {
      const ta = /** @type {HTMLTextAreaElement | null} */ (root.querySelector(`.quadrant__editor[data-quadrant="${key}"]`));
      if (!ta) continue;
      drafts.set(key, {
        value: ta.value, start: ta.selectionStart, end: ta.selectionEnd, focused: root.activeElement === ta,
      });
    }
    return drafts;
  }

  /** @param {Map<string, { value: string, start: number, end: number, focused: boolean }>} drafts */
  #restoreDrafts(drafts) {
    const root = this.shadowRoot;
    if (!root) return;
    for (const [key, d] of drafts) {
      const ta = /** @type {HTMLTextAreaElement | null} */ (root.querySelector(`.quadrant__editor[data-quadrant="${key}"]`));
      if (!ta) continue;
      ta.value = d.value;
      ta.setSelectionRange(d.start, d.end);
      if (d.focused) ta.focus();
    }
  }

  _closeEdit(key) {
    if (!this._editingQuadrants.has(key)) return;
    const section = this.shadowRoot?.querySelector(`.quadrant--${key}`);
    if (!section) return;

    const textarea = /** @type {HTMLTextAreaElement | null} */ (section.querySelector('.quadrant__editor'));
    if (textarea) {
      const items = textarea.value
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean);

      /* Ensure __quadrants object exists */
      if (!this.__quadrants) this.__quadrants = {};
      this.__quadrants[key] = items;
      /* From now on this quadrant renders from data, even when emptied,
         so later full renders don't resurrect the original slotted items. */
      this._editedQuadrants.add(key);

      const contentEl = section.querySelector('.quadrant__content');
      if (contentEl) contentEl.innerHTML = this._quadrantItemsHtml(key);
    }

    this._editingQuadrants.delete(key);
    section.removeAttribute('data-editing');

    const front = section.querySelector('.quadrant__face--front');
    const back  = section.querySelector('.quadrant__face--back');
    /* Move focus out of the face that is about to become inert, back to
       the quadrant's edit button, so it doesn't fall to <body>. */
    const active = this.shadowRoot?.activeElement;
    if (back && active && back.contains(active)) {
      /** @type {HTMLElement | null} */ (section.querySelector('.quadrant__edit-btn'))?.focus();
    }
    if (front) front.removeAttribute('inert');
    if (back)  back.setAttribute('inert', '');

    /* Dispatch update event */
    this.dispatchEvent(new CustomEvent('empathy-map:update', {
      bubbles: true,
      composed: true,
      detail: {
        quadrant: key,
        items: this.__quadrants?.[key] || [],
      },
    }));
  }
}

registerComponent('empathy-map', EmpathyMap);

export { EmpathyMap };
