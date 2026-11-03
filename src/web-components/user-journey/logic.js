/**
 * <user-journey> — User journey map web component
 *
 * Visualises a multi-phase user journey with an SVG emotion curve
 * and a structured phase-breakdown grid table.
 *
 * Data sources:
 *   1. `src` attribute — URL to a JSON file containing phase data
 *   2. `.phases` property — set programmatically
 *
 * JSON schema:
 *   {
 *     "title": "...",
 *     "persona": "...",
 *     "personaId": "...",
 *     "summary": "...",
 *     "phases": [
 *       {
 *         "name": "Awareness",
 *         "emotion": "curious",
 *         "storyIds": ["PROJ-142"],
 *         "actions":       ["Searches for solutions"],
 *         "thoughts":      ["There must be a better way"],
 *         "touchpoints":   ["Google", "Hacker News"],
 *         "painPoints":    ["Too many options to compare"],
 *         "opportunities": ["Clear landing page"]
 *       }
 *     ]
 *   }
 *
 * Title and summary are content: `<h2 slot="title">`, `<p slot="summary">`
 * (or the `title` / `summary` JSON fields, which create those children).
 *
 * @fires journey-ready               - Once, after the first render (after the src data renders when src is set), detail: { title, persona, phaseCount }
 * @fires user-journey:upgraded       - Once, after first connect
 * @fires user-journey:data-changed   - After .data assignment, detail: { data, source: 'property' }
 * @fires user-journey:phases-changed - After .phases assignment, detail: { phases, source: 'property' }
 */

import { styles } from './styles.js';
import { registerComponent } from '../../lib/bundle-registry.js';
import { viewTransitionSwap } from '../../lib/vb-view-transition.js';
import {
  esc, emotionMeta, lucideSvg, UX_ICONS, UXShadowElement, fillSlot, slottedChild, splitList, asList, fragmentHref,
} from '../_ux-base.js';

const ROWS = [
  { key: 'actions',       label: 'Actions'       },
  { key: 'thoughts',      label: 'Thoughts'      },
  { key: 'touchpoints',   label: 'Touchpoints'   },
  { key: 'painPoints',    label: 'Pain Points'   },
  { key: 'opportunities', label: 'Opportunities' },
];

class UserJourney extends UXShadowElement {
  static readyEvent = 'journey-ready';

  static get observedAttributes() {
    return ['src', 'persona', 'persona-id', 'story-ids', 'compact'];
  }

  /** @type {Array<Record<string, any>> | null} */
  __phases = null;

  /** @returns {Array|null} */
  get phases() { return this.__phases; }

  /**
   * Replace the phase list. Idempotent (skip on same array reference).
   * Emits user-journey:phases-changed { phases, source: 'property' }.
   * @param {Array|null} data
   */
  set phases(data) {
    if (this.__phases === data) return;
    this.__phases = data;
    if (this._isSetUp) this._render();
    this.dispatchEvent(new CustomEvent('user-journey:phases-changed', {
      detail: { phases: data, source: 'property' },
      bubbles: true, composed: true,
    }));
  }

  /**
   * Read the journey as a plain data object combining state, slotted
   * content, and the phase array. Mirrors what a consumer would assign
   * to .data.
   */
  get data() {
    return {
      persona: this.getAttribute('persona') || undefined,
      personaId: this.getAttribute('persona-id') || undefined,
      title: slottedChild(this, 'title')?.textContent?.trim() || undefined,
      summary: slottedChild(this, 'summary')?.textContent?.trim() || undefined,
      phases: this.__phases || undefined,
    };
  }

  /**
   * Set state attributes, slotted content, and phases in one assignment.
   * Emits user-journey:data-changed { data, source: 'property' }.
   */
  set data(value) {
    this._setData(value);
  }

  /**
   * Apply a journey record (from .data or src). Title / summary create
   * slotted children only when none are authored.
   * @param {Record<string, any>} data
   */
  _applyData(data) {
    if (data.persona)   this.setAttribute('persona',    String(data.persona));
    if (data.personaId) this.setAttribute('persona-id', String(data.personaId));
    fillSlot(this, 'title', data.title, { tag: 'h2' });
    fillSlot(this, 'summary', data.summary);
    if (data.phases != null) this.__phases = data.phases;
  }

  _readyDetail() {
    const phases = this.__phases;
    return {
      title: this._slotText('title'),
      persona: this._resolve('persona'),
      phaseCount: Array.isArray(phases) ? phases.length : 0,
    };
  }

  /**
   * Attribute value, else the text of a same-named light-DOM child (e.g.
   * `<span slot="persona">`, read as data; it is not projected).
   * @param {string} attr
   */
  _resolve(attr) {
    return this.getAttribute(attr) || this._slotCache.get(attr) || '';
  }

  /** Journey title: the slotted title's text, or the default heading. */
  #title() {
    return this._slotText('title') || 'User Journey';
  }

  /* ── JSON loading states ───────────────────── */

  _renderLoading() {
    /** @type {ShadowRoot} */ (this.shadowRoot).innerHTML = `<style>${styles}</style>` +
      `<div class="state-msg">Loading\u2026</div>`;
  }

  /** @param {Error} err */
  _renderError(err) {
    /** @type {ShadowRoot} */ (this.shadowRoot).innerHTML = `<style>${styles}</style>` +
      `<div class="state-msg state-msg--error">Could not load journey: ${esc(err.message)}</div>`;
  }

  /* ── Render ────────────────────────────────── */

  _render() {
    const persona   = this._resolve('persona')    || '';
    const personaId = this._resolve('persona-id') || '';
    const storyIds  = splitList(this.getAttribute('story-ids'));
    const compact   = this.hasAttribute('compact');
    const phases    = Array.isArray(this.__phases) ? this.__phases : null;
    const hasSummary = !!slottedChild(this, 'summary') || this._slotCache.has('summary');

    const html = `<style>${styles}</style>
      <article class="journey${compact ? ' journey--compact' : ''}">

        <header class="journey__header">
          <div class="journey__header-top">
            <div class="journey__chips">
              <span class="chip chip--type">Journey Map</span>
              ${storyIds.map(id =>
                `<a class="chip chip--story" href="${fragmentHref(id)}">${esc(this._label(id))}</a>`
              ).join('')}
            </div>
            ${persona ? `
              <div class="journey__persona">
                ${personaId
                  ? `<a class="persona-ref" href="${fragmentHref(personaId)}">${lucideSvg(UX_ICONS.user)} ${esc(persona)}</a>`
                  : `<span class="persona-ref">${lucideSvg(UX_ICONS.user)} ${esc(persona)}</span>`}
              </div>` : ''}
          </div>
          <div class="journey__title-wrap">
            <slot name="title"><h2 class="journey__title">User Journey</h2></slot>
          </div>
          ${hasSummary ? `<div class="journey__summary-wrap"><slot name="summary"></slot></div>` : ''}
        </header>

        ${phases && phases.length
          ? this._curve(phases) + this._grid(phases)
          : `<div class="journey__placeholder">
               <p>Add phase data via <code>src</code> (JSON) or set <code>.phases</code> programmatically.</p>
             </div>`
        }

      </article>`;

    /* Pin view-transition-name on the host so the browser crossfades the
       light-DOM snapshot (which includes the shadow paint) when the
       shadowRoot innerHTML swap replaces all content. Skip on the first
       render — there's nothing to fade from. */
    const root = /** @type {ShadowRoot} */ (this.shadowRoot);
    const swap = () => { root.innerHTML = html; };
    if (root.querySelector('article')) {
      viewTransitionSwap(this, swap, 'uj-vt');
    } else {
      swap();
    }
  }

  /* ── SVG curve ─────────────────────────────── */

  _curve(phases) {
    const W = 1000, H = 100, PX = 28, PY = 14;
    const uw = W - PX * 2, uh = H - PY * 2;
    const n  = phases.length;

    const toX = i  => PX + (n < 2 ? uw / 2 : (i / (n - 1)) * uw);
    const toY = ph => PY + (1 - emotionMeta(ph?.emotion).score) * uh;

    const pts = phases.map((ph, i) => ({ x: toX(i), y: toY(ph), ph }));

    let d = `M ${pts[0].x},${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i], cx = (a.x + b.x) / 2;
      d += ` C ${cx},${a.y} ${cx},${b.y} ${b.x},${b.y}`;
    }

    const uid = `uj-${Math.random().toString(36).slice(2, 8)}`;
    const last = pts.at(-1);

    return `
      <div class="journey__curve" aria-hidden="true">
        <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" class="curve-svg">
          <defs>
            <linearGradient id="${uid}" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stop-color="#6366f1" stop-opacity="0.22"/>
              <stop offset="100%" stop-color="#6366f1" stop-opacity="0"/>
            </linearGradient>
          </defs>
          <rect x="0"             y="0"          width="${W}" height="${H * 0.4}"  class="zone zone--pos"/>
          <rect x="0"             y="${H * 0.4}" width="${W}" height="${H * 0.2}"  class="zone zone--neu"/>
          <rect x="0"             y="${H * 0.6}" width="${W}" height="${H * 0.4}"  class="zone zone--neg"/>
          ${pts.map(({x}) => `<line x1="${x}" y1="0" x2="${x}" y2="${H}" class="vline"/>`).join('')}
          <path d="${d} L ${last.x},${H} L ${pts[0].x},${H} Z" fill="url(#${uid})"/>
          <path d="${d}" fill="none" class="curve-line"/>
          ${pts.map(({x, y, ph}) =>
            `<circle cx="${x}" cy="${y}" r="5" class="dot" style="fill:${emotionMeta(ph?.emotion).color}"/>`
          ).join('')}
        </svg>
      </div>`;
  }

  /* ── Phase grid ────────────────────────────── */

  _grid(phases) {
    const headCells = phases.map((ph, i) => {
      const m       = emotionMeta(ph?.emotion);
      const emotion = String(ph?.emotion || 'neutral');
      const stories = asList(ph?.storyIds);
      return `
        <th class="phase-head" data-emotion="${esc(emotion)}"
            style="--ec:${m.color}">
          <span class="ph-num">${i + 1}</span>
          <span class="ph-name">${esc(ph?.name || '')}</span>
          <span class="ph-emoji" title="${esc(emotion)}"><span role="img" aria-label="${esc(emotion)}">${m.emoji}</span></span>
          ${stories.length
            ? `<div class="ph-stories">${stories.map(id =>
                `<a class="chip chip--story" href="${fragmentHref(id)}">${esc(this._label(id))}</a>`
              ).join('')}</div>`
            : ''}
        </th>`;
    }).join('');

    const bodyRows = ROWS.map(({ key, label }) => {
      const cells = phases.map(ph => {
        const items = asList(ph?.[key]);
        if (!items.length) return `<td class="data-cell data-cell--empty">\u2014</td>`;
        return `<td class="data-cell data-cell--${key.toLowerCase()}">
          ${items.map(t => `<p>${esc(t)}</p>`).join('')}
        </td>`;
      }).join('');
      return `
        <tr class="grid-row grid-row--${key.toLowerCase()}">
          <th class="row-label">${label}</th>
          ${cells}
        </tr>`;
    }).join('');

    return `
      <div class="journey__grid-wrap">
        <table class="journey__grid"
               aria-label="${esc(this.#title())} \u2014 phase breakdown">
          <thead>
            <tr>
              <th class="corner">Stage</th>
              ${headCells}
            </tr>
          </thead>
          <tbody>${bodyRows}</tbody>
        </table>
      </div>`;
  }

  /* ── Helpers ───────────────────────────────── */

  /** @param {string} id */
  _label(id) {
    return String(id).replace(/^(activity|persona|journey|story|user)-/, '')
             .replace(/-/g, ' ')
             .replace(/\b\w/g, c => c.toUpperCase());
  }
}

registerComponent('user-journey', UserJourney);

export { UserJourney };
