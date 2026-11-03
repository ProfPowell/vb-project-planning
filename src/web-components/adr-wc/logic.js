/**
 * <adr-wc> — Architectural Decision Record card (MADR format)
 *
 * Renders an ADR with status badge, context, decision, consequences,
 * and chain-linking to other ADRs via supersedes / superseded-by.
 * Part of the UX Planning Pack.
 *
 * Content slots (headings and dates are content, not config):
 * @slot title         - Decision heading (e.g., <h2>)
 * @slot date          - Decision date (e.g., <time datetime="...">)
 * @slot context       - Why the decision was needed
 * @slot decision      - What was decided
 * @slot consequences  - Outcomes (positive and negative)
 *
 * State/config attributes:
 * @attr {string}  adr-id        - ADR identifier (e.g., "ADR-001"), auto-sets HTML id
 * @attr {enum}    status        - proposed | accepted | deprecated | superseded
 * @attr {string}  supersedes    - Comma-separated ADR IDs this supersedes
 * @attr {string}  superseded-by - Comma-separated ADR IDs that supersede this
 * @attr {string}  detail        - full | compact | minimal
 * @attr {boolean} compact       - Alias for detail="compact"
 * @attr {string}  src           - URL to JSON data (fetched once per value)
 *
 * @fires adr-wc:ready        - Once, after the first render (after the src data renders when src is set), detail: { adrId, title, status }
 * @fires adr-wc:upgraded     - Once, after first connect
 * @fires adr-wc:data-changed - After .data assignment, detail: { data, source: 'property' }
 *
 * @example
 * <adr-wc adr-id="ADR-001" status="accepted">
 *   <h2 slot="title">Use PostgreSQL for persistence</h2>
 *   <time slot="date" datetime="2026-01-15">January 15, 2026</time>
 *   <p slot="context">We need a relational database for complex queries.</p>
 *   <p slot="decision">Use PostgreSQL 16 with pgvector extension.</p>
 *   <ul slot="consequences">
 *     <li>Good: mature ecosystem, strong SQL support</li>
 *     <li>Bad: operational overhead vs managed NoSQL</li>
 *   </ul>
 * </adr-wc>
 */

import { styles } from './styles.js';
import { registerComponent } from '../../lib/bundle-registry.js';
import { parseISODate, formatDate } from '../../lib/dates.js';
import {
  esc, lucideSvg, UXShadowElement, lookup, fillSlot, slottedChild, splitList, detailLevel, markEmptySections,
} from '../_ux-base.js';

/* ── Status metadata ──────────────────────────────── */

const STATUSES = {
  proposed:   { label: 'Proposed',   color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
  accepted:   { label: 'Accepted',   color: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)' },
  deprecated: { label: 'Deprecated', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  superseded: { label: 'Superseded', color: '#6b7280', bg: 'rgba(107, 114, 128, 0.1)' },
};

/* ── SVG icon fragments (Lucide) ──────────────────── */

const ICONS = {
  calendar:     '<rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>',
  context:      '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/>',
  decision:     '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>',
  consequences: '<path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>',
  arrowRight:   '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
};

/* ── Component ─────────────────────────────────────── */

class AdrWc extends UXShadowElement {
  static readyEvent = 'adr-wc:ready';

  static get observedAttributes() {
    return [
      'adr-id', 'status',
      'supersedes', 'superseded-by',
      'detail', 'compact', 'src',
    ];
  }

  /* ── Lifecycle (see UXShadowElement) ──────────── */

  _setup() {
    if (this.adrId && !this.id) this.id = this.adrId;
  }

  _readyDetail() {
    return { adrId: this.adrId, title: this.adrTitle, status: this.status };
  }

  /* ── Getters ───────────────────────────────────── */

  get adrId()  { return this.getAttribute('adr-id') || ''; }
  get status() { return this.getAttribute('status') || 'proposed'; }

  /** Read the title from the slotted heading's text content */
  get adrTitle() {
    return this._slotText('title');
  }

  /** Read the date from the slotted <time>'s datetime attribute or text */
  get adrDate() {
    const slotted = slottedChild(this, 'date');
    return slotted?.getAttribute('datetime') || this._slotText('date');
  }

  get supersedes() { return splitList(this.getAttribute('supersedes')); }

  get supersededBy() { return splitList(this.getAttribute('superseded-by')); }

  get _detailLevel() { return detailLevel(this); }

  get _minimalLabel() {
    return this.adrTitle || this.adrId || 'ADR';
  }

  /* ── Data API ──────────────────────────────────── */

  /**
   * Read the ADR as a plain data object. Mirrors what a consumer would
   * assign to .data — useful for diffing or persistence.
   */
  get data() {
    return {
      adrId: this.adrId || undefined,
      status: this.status,
      detail: this.getAttribute('detail') || undefined,
      supersedes: this.supersedes.length ? this.supersedes : undefined,
      supersededBy: this.supersededBy.length ? this.supersededBy : undefined,
      title: this.adrTitle || undefined,
      date: this.adrDate || undefined,
    };
  }

  /**
   * Set state attributes and slotted content from a plain object in one
   * call. Idempotent for repeat calls.
   */
  set data(value) {
    this._setData(value);
  }

  /**
   * Apply a data record to attributes + slotted children. Used by both
   * the .data setter and the src loader. Slotted children are created only
   * when absent (authored content wins).
   * @param {Record<string, unknown>} data
   */
  _applyData(data) {
    if (data.adrId != null) this.setAttribute('adr-id', String(data.adrId));
    if (data.status != null) this.setAttribute('status', String(data.status));
    if (data.detail != null) this.setAttribute('detail', String(data.detail));

    if (data.supersedes) {
      this.setAttribute('supersedes', Array.isArray(data.supersedes) ? data.supersedes.join(',') : String(data.supersedes));
    }
    if (data.supersededBy) {
      this.setAttribute('superseded-by', Array.isArray(data.supersededBy) ? data.supersededBy.join(',') : String(data.supersededBy));
    }

    fillSlot(this, 'title', data.title, { tag: 'h3' });
    if (data.date && !slottedChild(this, 'date')) {
      // A calendar date: YYYY-MM-DD is local midnight, so April 1 stays
      // April 1 west of UTC (new Date('2026-04-01') would show March 31).
      const raw = String(data.date);
      const day = parseISODate(raw);
      const t = document.createElement('time');
      t.slot = 'date';
      t.setAttribute('datetime', raw);
      t.textContent = day ? formatDate(day) : raw;
      this.appendChild(t);
    }
    fillSlot(this, 'context', data.context);
    fillSlot(this, 'decision', data.decision);
    fillSlot(this, 'consequences', data.consequences, { list: true });
  }

  /* ── JSON loading states ───────────────────────── */

  _renderLoading() {
    /** @type {ShadowRoot} */ (this.shadowRoot).innerHTML =
      `<style>${styles}</style><div class="state-msg">Loading\u2026</div>`;
  }

  /** @param {Error} err */
  _renderError(err) {
    /** @type {ShadowRoot} */ (this.shadowRoot).innerHTML = `<style>${styles}</style>` +
      `<div class="state-msg state-msg--error">Could not load: ${esc(err.message)}</div>`;
  }

  /* ── Render ────────────────────────────────────── */

  _render() {
    const root = /** @type {ShadowRoot} */ (this.shadowRoot);
    const statusInfo = lookup(STATUSES, this.status, 'proposed');
    const level = this._detailLevel;
    const ariaLabel = this.adrId ? `ADR: ${esc(this.adrId)}` : 'Architectural Decision Record';
    const hasDate = !!slottedChild(this, 'date') || this._slotCache.has('date');

    if (level === 'minimal') {
      root.innerHTML = `<style>${styles}</style>
        <article class="adr-card adr-card--minimal" role="article" aria-label="${ariaLabel}">
          <div class="adr-body">
            <div class="adr-meta">
              ${this.adrId ? `<span class="adr-id">${esc(this.adrId)}</span>` : ''}
              <span class="adr-status" style="color:${statusInfo.color};background:${statusInfo.bg}">${esc(statusInfo.label)}</span>
            </div>
            <div class="adr-title-wrap">
              <slot name="title"><span class="adr-title-fallback">${esc(this._minimalLabel)}</span></slot>
            </div>
          </div>
        </article>`;
      return;
    }

    root.innerHTML = `<style>${styles}</style>
      <article class="adr-card adr-card--${level}" role="article" aria-label="${ariaLabel}">

        <header class="adr-header">
          <div class="adr-meta">
            ${this.adrId ? `<span class="adr-id">${esc(this.adrId)}</span>` : ''}
            ${hasDate ? `<span class="adr-date-wrap">${lucideSvg(ICONS.calendar)} <slot name="date"></slot></span>` : ''}
          </div>
          <div class="adr-badges">
            <span class="adr-status" style="color:${statusInfo.color};background:${statusInfo.bg}">${esc(statusInfo.label)}</span>
          </div>
        </header>

        <div class="adr-body">
          <div class="adr-title-wrap">
            <slot name="title"><span class="adr-title-fallback">[Untitled ADR]</span></slot>
          </div>

          ${this.supersedes.length ? `
            <div class="adr-links">
              <span class="adr-links-label">Supersedes</span>
              ${this.supersedes.map(id =>
                `<a class="adr-link" href="#${esc(id)}">${lucideSvg(ICONS.arrowRight)} ${esc(id)}</a>`
              ).join('')}
            </div>` : ''}

          ${this.supersededBy.length ? `
            <div class="adr-links">
              <span class="adr-links-label">Superseded by</span>
              ${this.supersededBy.map(id =>
                `<a class="adr-link" href="#${esc(id)}">${lucideSvg(ICONS.arrowRight)} ${esc(id)}</a>`
              ).join('')}
            </div>` : ''}
        </div>

        <div class="adr-sections">
          <div class="adr-section">
            <div class="adr-section-header">
              <div class="adr-section-icon context">${lucideSvg(ICONS.context)}</div>
              <span class="adr-section-title">Context</span>
            </div>
            <div class="adr-section-content">
              <slot name="context"><em class="slot-fallback">No context provided.</em></slot>
            </div>
          </div>

          <div class="adr-section">
            <div class="adr-section-header">
              <div class="adr-section-icon decision">${lucideSvg(ICONS.decision)}</div>
              <span class="adr-section-title">Decision</span>
            </div>
            <div class="adr-section-content">
              <slot name="decision"><em class="slot-fallback">No decision recorded.</em></slot>
            </div>
          </div>

          <div class="adr-section">
            <div class="adr-section-header">
              <div class="adr-section-icon consequences">${lucideSvg(ICONS.consequences)}</div>
              <span class="adr-section-title">Consequences</span>
            </div>
            <div class="adr-section-content">
              <slot name="consequences"><em class="slot-fallback">No consequences documented.</em></slot>
            </div>
          </div>
        </div>

      </article>`;

    if (level === 'compact') markEmptySections(root, '.adr-section');
  }
}

registerComponent('adr-wc', AdrWc);

export { AdrWc };
