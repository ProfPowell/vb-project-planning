/**
 * <work-item> — General-purpose work unit card
 *
 * The engineering sibling of <user-story>. Represents tasks, bugs,
 * chores, spikes, and features — work that may or may not map to
 * a user story. Can live in kanban-board, gantt-chart, story-map,
 * or standalone.
 *
 * Content slots:
 * @slot title       - Work item heading (e.g., <h3>)
 * @slot description - Work item description (e.g., <p>)
 * @slot checklist   - Subtasks or checklist (e.g., <ul>)
 * @slot notes       - Additional notes (e.g., <p>)
 *
 * State/config attributes:
 * @attr {string}  item-id   - Unique identifier (e.g., "PROJ-42")
 * @attr {enum}    type      - task | bug | chore | spike | feature
 * @attr {enum}    priority  - critical | high | medium | low
 * @attr {enum}    status    - backlog | to-do | in-progress | review | done | blocked
 * @attr {string}  estimate  - Effort estimate (points, hours, t-shirt size)
 * @attr {string}  assignee  - Assignee name
 * @attr {string}  story-ids - Comma-separated linked story IDs
 * @attr {string}  detail    - full | compact | minimal
 * @attr {boolean} compact   - Alias for detail="compact"
 * @attr {string}  src       - URL to JSON data (fetched once per value)
 *
 * @fires work-item:ready        - Once, after the first render (after the src data renders when src is set)
 * @fires work-item:status       - When updateStatus() is called
 * @fires work-item:priority     - When updatePriority() is called
 * @fires work-item:upgraded     - Once, after first connect
 * @fires work-item:data-changed - After .data assignment, detail: { data, source: 'property' }
 *
 * @example
 * <work-item
 *   item-id="PROJ-42"
 *   type="task"
 *   status="in-progress"
 *   priority="high"
 *   assignee="Sarah Chen"
 *   estimate="5"
 *   story-ids="PROJ-101,PROJ-102">
 *   <h3 slot="title">Implement search API</h3>
 *   <p slot="description">Build the /search endpoint with filters.</p>
 *   <ul slot="checklist">
 *     <li>Schema design</li>
 *     <li>Endpoint implementation</li>
 *     <li>Tests</li>
 *   </ul>
 * </work-item>
 */

import { styles } from './styles.js';
import { registerComponent } from '../../lib/bundle-registry.js';
import {
  esc, initials, hashColor, lucideSvg, UXShadowElement,
  PRIORITIES, STATUSES as BASE_STATUSES, lookup, fillSlot, splitList, detailLevel, markEmptySections,
} from '../_ux-base.js';

/* ── Type icons (Lucide SVG fragments) ─────────────── */

const TYPE_ICONS = {
  task:    '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="m9 12 2 2 4-4"/>',
  bug:     '<path d="m8 2 1.88 1.88"/><path d="M14.12 3.88 16 2"/><path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"/><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"/><path d="M12 20v-9"/><path d="M6.53 9C4.6 8.8 3 7.1 3 5"/><path d="M6 13H2"/><path d="M3 21c0-2.1 1.7-3.9 3.8-4"/><path d="M20.97 5c0 2.1-1.6 3.8-3.5 4"/><path d="M22 13h-4"/><path d="M17.2 17c2.1.1 3.8 1.9 3.8 4"/>',
  chore:   '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z"/>',
  spike:   '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
  feature: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
};

/* ── Static lookups ────────────────────────────────── */

const STATUSES = Object.freeze({
  ...BASE_STATUSES,
  blocked: { label: 'Blocked', color: '#dc2626', bg: 'rgba(220, 38, 38, 0.1)' },
});

/* ── Component ─────────────────────────────────────── */

class WorkItem extends UXShadowElement {
  static readyEvent = 'work-item:ready';

  static get observedAttributes() {
    return [
      'item-id', 'type', 'priority', 'status',
      'estimate', 'assignee', 'story-ids', 'detail', 'compact', 'src',
    ];
  }

  /* ── Lifecycle (see UXShadowElement) ──────────── */

  _setup() {
    if (this.itemId && !this.id) this.id = this.itemId;
  }

  _readyDetail() {
    return {
      itemId: this.itemId,
      title: this.itemTitle,
      type: this.itemType,
      priority: this.priority,
      status: this.status,
    };
  }

  /* ── Getters ───────────────────────────────────── */

  get itemId()    { return this.getAttribute('item-id') || ''; }
  get itemTitle() { return this._slotText('title'); }
  get itemType()  { return this.getAttribute('type') || 'task'; }
  get priority()  { return this.getAttribute('priority') || 'medium'; }
  get status()    { return this.getAttribute('status') || 'backlog'; }
  get estimate()  { return this.getAttribute('estimate') || ''; }
  get assignee()  { return this.getAttribute('assignee') || ''; }

  get storyIds() { return splitList(this.getAttribute('story-ids')); }

  get _detailLevel() { return detailLevel(this); }

  get _minimalLabel() {
    return this.itemTitle || this.itemId || 'Work item';
  }

  /* ── Public API ────────────────────────────────── */

  updateStatus(newStatus) {
    if (Object.hasOwn(STATUSES, newStatus)) {
      this.setAttribute('status', newStatus);
      this.dispatchEvent(new CustomEvent('work-item:status', {
        detail: { status: newStatus, itemId: this.itemId },
        bubbles: true, composed: true,
      }));
    }
  }

  updatePriority(newPriority) {
    if (Object.hasOwn(PRIORITIES, newPriority)) {
      this.setAttribute('priority', newPriority);
      this.dispatchEvent(new CustomEvent('work-item:priority', {
        detail: { priority: newPriority, itemId: this.itemId },
        bubbles: true, composed: true,
      }));
    }
  }

  /* ── Data API ──────────────────────────────────── */

  /**
   * Read the work item as a plain data object. Mirrors what a consumer
   * would assign to .data — useful for diffing, persistence, or echo.
   */
  get data() {
    return {
      itemId: this.itemId || undefined,
      type: this.itemType,
      priority: this.priority,
      status: this.status,
      estimate: this.estimate || undefined,
      assignee: this.assignee || undefined,
      storyIds: this.storyIds.length ? this.storyIds : undefined,
      detail: this.getAttribute('detail') || undefined,
      title: this.itemTitle || undefined,
    };
  }

  /**
   * Set state attributes and slotted content from a plain object in one call.
   * Replaces nine setAttribute calls + manual slotted-child creation.
   * Idempotent for repeat calls.
   */
  set data(value) {
    this._setData(value);
  }

  /**
   * Apply a data record to attributes + slotted children. Used by both the
   * .data setter and the src loader. Slotted children are created only when
   * absent (authored content wins). No render or event emit — caller decides.
   * @param {Record<string, unknown>} data
   */
  _applyData(data) {
    for (const [jsonKey, attr] of [
      ['itemId', 'item-id'], ['type', 'type'], ['priority', 'priority'],
      ['status', 'status'], ['estimate', 'estimate'], ['assignee', 'assignee'],
      ['detail', 'detail'],
    ]) {
      if (data[jsonKey] != null) this.setAttribute(attr, String(data[jsonKey]));
    }
    if (data.storyIds) {
      this.setAttribute('story-ids', Array.isArray(data.storyIds) ? data.storyIds.join(',') : String(data.storyIds));
    }

    fillSlot(this, 'title', data.title, { tag: 'h3' });
    fillSlot(this, 'description', data.description);
    fillSlot(this, 'notes', data.notes);
    fillSlot(this, 'checklist', data.checklist, { list: true });
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
    const priorityInfo = lookup(PRIORITIES, this.priority, 'medium');
    const statusInfo = lookup(STATUSES, this.status, 'backlog');
    const type = this.itemType;
    const typeIcon = lookup(TYPE_ICONS, type, 'task');
    const level = this._detailLevel;
    const ariaLabel = this.itemId ? `Work item: ${esc(this.itemId)}` : 'Work item';

    if (level === 'minimal') {
      root.innerHTML = `<style>${styles}</style>
        <article class="wi-card wi-card--minimal" role="article" aria-label="${ariaLabel}">
          <div class="wi-body">
            <div class="wi-meta">
              ${this.itemId ? `<span class="wi-id">${esc(this.itemId)}</span>` : ''}
              <span class="wi-type" data-type="${esc(type)}">${lucideSvg(typeIcon)} ${esc(type)}</span>
            </div>
            <div class="wi-title-wrap">
              <slot name="title"><span class="wi-title-fallback">${esc(this._minimalLabel)}</span></slot>
            </div>
          </div>
        </article>`;
      return;
    }


    root.innerHTML = `<style>${styles}</style>
      <article class="wi-card wi-card--${level}" role="article" aria-label="${ariaLabel}">

        <header class="wi-header">
          <div class="wi-meta">
            ${this.itemId ? `<span class="wi-id">${esc(this.itemId)}</span>` : ''}
            <span class="wi-type" data-type="${esc(type)}">${lucideSvg(typeIcon)} ${esc(type)}</span>
          </div>
          <div class="wi-badges">
            <span class="wi-priority" style="color:${priorityInfo.color};background:${priorityInfo.bg}">${esc(priorityInfo.label)}</span>
            <span class="wi-status" style="color:${statusInfo.color};background:${statusInfo.bg}">${esc(statusInfo.label)}</span>
            ${this.estimate ? `<span class="wi-estimate" title="Estimate">${esc(this.estimate)}</span>` : ''}
          </div>
        </header>

        <div class="wi-body">
          <div class="wi-title-wrap">
            <slot name="title"><span class="wi-title-fallback">[Untitled work item]</span></slot>
          </div>

          ${this.assignee ? `
            <div class="wi-assignee">
              <span class="wi-assignee__avatar" style="background:${hashColor(this.assignee)}">${esc(initials(this.assignee))}</span>
              ${esc(this.assignee)}
            </div>` : ''}

          ${this.storyIds.length ? `
            <div class="wi-links">
              ${this.storyIds.map(id =>
                `<a class="wi-link" href="#${esc(id)}">${lucideSvg('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 7h10"/><path d="M7 12h10"/><path d="M7 17h10"/>')} ${esc(id)}</a>`
              ).join('')}
            </div>` : ''}
        </div>

        <div class="wi-sections">
          <div class="wi-section">
            <div class="wi-section-header">
              <div class="wi-section-icon description">
                <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              <span class="wi-section-title">Description</span>
            </div>
            <div class="wi-section-content">
              <slot name="description"><em class="slot-fallback">No description.</em></slot>
            </div>
          </div>

          <div class="wi-section">
            <div class="wi-section-header">
              <div class="wi-section-icon checklist">
                <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
              </div>
              <span class="wi-section-title">Checklist</span>
            </div>
            <div class="wi-section-content">
              <slot name="checklist"><em class="slot-fallback">No checklist items.</em></slot>
            </div>
          </div>

          <div class="wi-section">
            <div class="wi-section-header">
              <div class="wi-section-icon notes">
                <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
              </div>
              <span class="wi-section-title">Notes</span>
            </div>
            <div class="wi-section-content">
              <slot name="notes"><em class="slot-fallback">No notes.</em></slot>
            </div>
          </div>
        </div>

      </article>`;

    if (level === 'compact') markEmptySections(root, '.wi-section');
  }
}

registerComponent('work-item', WorkItem);

export { WorkItem };
