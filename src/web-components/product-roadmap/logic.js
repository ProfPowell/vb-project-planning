/**
 * roadmap: Interactive themes × quarters product roadmap
 *
 * Renders a horizontal time axis (quarters or months) with one
 * swimlane per <section data-lane>. Each <article data-start data-end>
 * inside a lane becomes an absolutely-positioned bar spanning its
 * date range.
 *
 * Distinct from <gantt-chart>: roadmap is theme-centric (initiatives
 * in lanes, status as enum, no dependency arrows). Gantt is task-
 * scheduling. Use roadmap for quarterly product roadmaps; gantt for
 * project plans.
 *
 * Dates are calendar days in local time (src/lib/dates.js). Every end
 * date — the host's `end` and each initiative's `data-end` — is
 * INCLUSIVE: an initiative with data-start == data-end covers one day.
 *
 * @attr {string} start         - First date in the range (ISO 8601 or "YYYY-Qn"; required)
 * @attr {string} end           - Last date in the range (ISO 8601 or "YYYY-Qn"; required, inclusive)
 * @attr {string} view          - "quarter" (default) or "month" axis granularity
 * @attr {boolean} editable     - Wires pointer drag-to-reschedule / resize / lane move, and keyboard editing
 * @attr {boolean} today-marker - Render a vertical line at today's date if it falls in range
 *
 * Children:
 *   <section data-lane="...">                — one swimlane row
 *     <article data-start="..." data-end="..." data-status="..."> — one initiative bar
 *       <h3>Title</h3>
 *       <p>Optional description (visible in detail / tooltip)</p>
 *     </article>
 *   </section>
 *
 * Interaction (bars are role="button", focusable):
 *   click / Enter / Space          → product-roadmap:select
 *   editable, drag body            → product-roadmap:reschedule (snaps to the nearest period)
 *   editable, drag right edge      → product-roadmap:resize
 *   editable, drag onto other lane → product-roadmap:move
 *   editable, ←/→                  → move one period (reschedule)
 *   editable, Shift+←/→            → end date one period earlier/later (resize)
 *   editable, Alt+↑/↓              → move to the previous/next lane (move)
 *
 * @fires product-roadmap:select     - { initiative, lane, start, end, status }
 * @fires product-roadmap:reschedule - { initiative, lane, start, end }
 * @fires product-roadmap:resize     - { initiative, lane, start, end }
 * @fires product-roadmap:move       - { initiative, fromLane, toLane, start, end }
 */

import { registerComponent } from '../../lib/bundle-registry.js';
import { VBElement } from '../../lib/vb-element.js';
import {
  parseISODate, toISODate, addDays, addMonths, daysBetween,
  startOfMonth, startOfQuarter, formatDate,
} from '../../lib/dates.js';

/** Pointer travel (px) before a press becomes a drag. Below it, it's a click. */
const DRAG_THRESHOLD = 4;

const STATUS_LABELS = {
  planned: 'Planned',
  'in-progress': 'In progress',
  'at-risk': 'At risk',
  shipped: 'Shipped',
  blocked: 'Blocked',
};

/** @param {string} s */
function statusLabel(s) {
  return STATUS_LABELS[s] || (s.charAt(0).toUpperCase() + s.slice(1)).replace(/-/g, ' ');
}

let instanceCounter = 0;

class Roadmap extends VBElement {
  static get observedAttributes() {
    return ['start', 'end', 'view', 'editable', 'today-marker'];
  }

  #uid = `rm-${++instanceCounter}`;

  setup() {
    if (!this.#readConfig()) return false;

    /* The source lanes stay in the host (hidden) and are re-read on each
       render, so author edits to data-start/data-end are picked up and a
       reconnect re-renders from the same source of truth. */
    const lanes = [...this.querySelectorAll(':scope > section[data-lane]')];
    if (!lanes.length) {
      console.warn('product-roadmap: no <section data-lane> children found');
      return false;
    }
    this.#sourceLanes = lanes;

    /* Delegated once per connection; listen() removes them on disconnect. */
    this.listen(this, 'click', this.#onClick);
    this.listen(this, 'keydown', this.#onKeyDown);
    this.listen(this, 'pointerdown', this.#onPointerDown);
    this.listen(this, 'pointermove', this.#onPointerMove);
    this.listen(this, 'pointerup', this.#onPointerUp);
    this.listen(this, 'pointercancel', this.#onPointerCancel);

    this.#render();
    return true;
  }

  teardown() {
    this.#dragInfo = null;
  }

  /** Parse start/end/view/editable from attributes. Returns false when invalid. */
  #readConfig() {
    const startAttr = this.getAttribute('start');
    const endAttr   = this.getAttribute('end');
    if (!startAttr || !endAttr) {
      console.warn('product-roadmap: start and end attributes required');
      return false;
    }
    const start = Roadmap.#parseDate(startAttr, 'start');
    const end   = Roadmap.#parseDate(endAttr,   'end');
    if (!start || !end || end < start) {
      console.warn('product-roadmap: invalid start/end', startAttr, endAttr);
      return false;
    }
    this.#start = start;
    this.#endExcl = addDays(end, 1);
    this.#totalDays = daysBetween(start, this.#endExcl);
    this.#view = (this.getAttribute('view') === 'month') ? 'month' : 'quarter';
    this.#editable = this.hasAttribute('editable');
    return true;
  }

  attributeChangedCallback(_name, oldValue, newValue) {
    if (oldValue === newValue) return;
    if (!this.isConnected || !this.hasAttribute('data-upgraded')) return;
    if (this.#readConfig()) this.#render();
  }

  get #periodMonths() { return this.#view === 'month' ? 1 : 3; }

  #render() {
    /* Remember which initiative had focus so keyboard edits keep it. */
    const focused = /** @type {HTMLElement | null} */ (this.querySelector('.rm-bar:focus'));
    const refocus = focused ? this.#initiativeFor.get(focused) : null;

    [...this.children].forEach((c) => {
      if (!this.#sourceLanes.includes(c)) c.remove();
    });
    this.#sourceLanes.forEach((lane) => { /** @type {HTMLElement} */ (lane).hidden = true; });
    this.#initiativeFor = new WeakMap();

    const wrapper = document.createElement('div');
    wrapper.className = 'rm-wrapper';

    wrapper.appendChild(this.#buildAxis());

    const lanesEl = document.createElement('div');
    lanesEl.className = 'rm-lanes';

    /** @type {HTMLElement | null} */
    let refocusBar = null;
    for (const sourceLane of this.#sourceLanes) {
      const laneName = sourceLane.getAttribute('data-lane') || '';
      const laneEl = document.createElement('section');
      laneEl.className = 'rm-lane';
      laneEl.dataset.lane = laneName;

      const laneLabel = document.createElement('header');
      laneLabel.className = 'rm-lane-label';
      laneLabel.textContent = laneName;
      laneEl.appendChild(laneLabel);

      const track = document.createElement('div');
      track.className = 'rm-track';
      track.dataset.lane = laneName;

      const initiatives = [...sourceLane.querySelectorAll(':scope > article[data-start][data-end]')];
      for (const init of initiatives) {
        const bar = this.#buildBar(init, laneName);
        if (!bar) continue;
        track.appendChild(bar);
        if (init === refocus) refocusBar = bar;
      }

      laneEl.appendChild(track);
      lanesEl.appendChild(laneEl);
    }

    wrapper.appendChild(lanesEl);

    if (this.hasAttribute('today-marker') && this.#start && this.#endExcl) {
      const today = parseISODate(new Date());
      if (today >= this.#start && today < this.#endExcl) {
        const marker = document.createElement('div');
        marker.className = 'rm-today';
        marker.style.setProperty('--rm-x', this.#fractionFor(today).toFixed(4));
        marker.title = `Today: ${toISODate(today)}`;
        lanesEl.appendChild(marker);
      }
    }

    if (this.#editable) {
      const help = document.createElement('p');
      help.id = `${this.#uid}-help`;
      help.className = 'rm-sr-only';
      const unit = this.#view === 'month' ? 'month' : 'quarter';
      help.textContent = `Arrow keys move by one ${unit}. Shift plus arrow keys change the end date. Alt plus up or down arrow moves to another lane.`;
      wrapper.appendChild(help);
    }

    const live = document.createElement('div');
    live.className = 'rm-sr-only';
    live.setAttribute('role', 'status');
    live.setAttribute('aria-live', 'polite');
    wrapper.appendChild(live);
    this.#liveRegion = live;

    this.appendChild(wrapper);
    if (refocusBar) refocusBar.focus();
  }

  #buildAxis() {
    const axis = document.createElement('header');
    axis.className = 'rm-axis';
    for (const tick of this.#enumerateTicks()) {
      const cell = document.createElement('div');
      cell.className = 'rm-tick';
      cell.style.setProperty('--rm-x', tick.startFraction.toFixed(4));
      cell.style.setProperty('--rm-w', (tick.endFraction - tick.startFraction).toFixed(4));
      cell.textContent = tick.label;
      axis.appendChild(cell);
    }
    return axis;
  }

  /**
   * @param {Element} initiative
   * @param {string} laneName
   */
  #buildBar(initiative, laneName) {
    const start = Roadmap.#parseDate(initiative.getAttribute('data-start'), 'start');
    const end   = Roadmap.#parseDate(initiative.getAttribute('data-end'),   'end');
    if (!start || !end || end < start || !this.#start || !this.#endExcl) return null;

    /* End is inclusive: geometry runs to the start of the following day.
       Clip to the visible range. */
    const endExcl = addDays(end, 1);
    const clipStart = start < this.#start ? this.#start : start;
    const clipEnd   = endExcl > this.#endExcl ? this.#endExcl : endExcl;
    if (clipStart >= clipEnd) return null;

    const x = this.#fractionFor(clipStart);
    const w = this.#fractionFor(clipEnd) - x;

    const bar = document.createElement('article');
    bar.className = 'rm-bar';
    bar.style.setProperty('--rm-x', x.toFixed(4));
    bar.style.setProperty('--rm-w', w.toFixed(4));
    bar.dataset.lane = laneName;
    bar.dataset.start = toISODate(start);
    bar.dataset.end = toISODate(end);
    const status = /** @type {HTMLElement} */ (initiative).dataset.status || '';
    if (status) bar.dataset.status = status;
    if (initiative.id) bar.dataset.sourceId = initiative.id;
    bar.tabIndex = 0;
    bar.setAttribute('role', 'button');
    this.#initiativeFor.set(bar, initiative);

    const title = initiative.querySelector('h1, h2, h3, h4, h5, h6');
    const heading = document.createElement('span');
    heading.className = 'rm-bar-title';
    heading.textContent = title ? title.textContent.trim() : (initiative.textContent || '').trim().split('\n')[0];
    bar.appendChild(heading);

    /* Status is shown as text as well as colour. */
    if (status) {
      const badge = document.createElement('span');
      badge.className = 'rm-bar-status';
      badge.textContent = statusLabel(status);
      bar.appendChild(badge);
    }

    bar.setAttribute('aria-label',
      `${heading.textContent} — ${formatDate(start)} to ${formatDate(end)} in ${laneName}` +
      (status ? `, status: ${statusLabel(status).toLowerCase()}` : ''));

    if (this.#editable) {
      bar.setAttribute('aria-describedby', `${this.#uid}-help`);
      /* Pointer-only affordance; the keyboard equivalent is Shift+Arrow
         on the bar itself, so the handle is hidden from assistive tech. */
      const handle = document.createElement('span');
      handle.className = 'rm-bar-handle';
      handle.setAttribute('aria-hidden', 'true');
      handle.title = 'Drag to change the end date';
      bar.appendChild(handle);
    }

    return bar;
  }

  /* --- selection --- */

  /** @param {HTMLElement} bar */
  #select(bar) {
    const initiative = this.#initiativeFor.get(bar);
    if (!initiative) return;
    this.dispatchEvent(new CustomEvent('product-roadmap:select', {
      bubbles: true,
      detail: {
        initiative,
        lane: bar.dataset.lane,
        start: bar.dataset.start,
        end: bar.dataset.end,
        status: bar.dataset.status || null,
      },
    }));
  }

  /** @param {Event} e */
  #barFromEvent(e) {
    const t = /** @type {Element} */ (e.target);
    const bar = /** @type {HTMLElement | null} */ (t?.closest?.('.rm-bar'));
    return bar && this.contains(bar) ? bar : null;
  }

  #onClick = (e) => {
    const bar = this.#barFromEvent(e);
    if (!bar) return;
    if (this.#suppressClick) return;
    this.#select(bar);
  };

  #onKeyDown = (e) => {
    const ke = /** @type {KeyboardEvent} */ (e);
    const bar = this.#barFromEvent(ke);
    if (!bar || ke.target !== bar) return;

    if (ke.key === 'Enter' || ke.key === ' ') {
      ke.preventDefault();
      this.#select(bar);
      return;
    }
    if (!this.#editable) return;

    const initiative = this.#initiativeFor.get(bar);
    if (!initiative) return;
    const p = this.#periodMonths;

    if (ke.altKey && (ke.key === 'ArrowUp' || ke.key === 'ArrowDown')) {
      ke.preventDefault();
      const names = this.#sourceLanes.map((l) => l.getAttribute('data-lane') || '');
      const idx = names.indexOf(bar.dataset.lane || '');
      const next = names[idx + (ke.key === 'ArrowUp' ? -1 : 1)];
      if (idx === -1 || next === undefined) return;
      this.#commit(initiative, bar.dataset.lane || '', next, null, null, 'move');
      return;
    }

    if (ke.key !== 'ArrowLeft' && ke.key !== 'ArrowRight') return;
    ke.preventDefault();
    const dir = ke.key === 'ArrowLeft' ? -1 : 1;
    const start = parseISODate(bar.dataset.start);
    const endExcl = addDays(parseISODate(bar.dataset.end), 1);

    if (ke.shiftKey) {
      /* Resize: move the end by one period, keep at least one day. */
      if (dir > 0 && endExcl >= this.#endExcl) return;
      const nextEndExcl = addMonths(endExcl, dir * p);
      if (nextEndExcl <= start) return;
      this.#commit(initiative, bar.dataset.lane || '', null, start, addDays(nextEndExcl, -1), 'resize');
    } else {
      /* Move: shift both ends by one period; stop at the range edges. */
      if (dir < 0 && start <= this.#start) return;
      if (dir > 0 && endExcl >= this.#endExcl) return;
      const nextStart = addMonths(start, dir * p);
      const nextEndExcl = addMonths(endExcl, dir * p);
      this.#commit(initiative, bar.dataset.lane || '', null, nextStart, addDays(nextEndExcl, -1), 'reschedule');
    }
  };

  /* --- pointer drag (time axis + cross-lane) --- */

  #onPointerDown = (e) => {
    const pe = /** @type {PointerEvent} */ (e);
    if (!this.#editable || pe.button !== 0) return;
    const bar = this.#barFromEvent(pe);
    if (!bar) return;
    const track = bar.parentElement;
    if (!track) return;
    const isHandle = /** @type {Element} */ (pe.target).classList?.contains('rm-bar-handle');
    this.#dragInfo = {
      kind: isHandle ? 'resize' : 'move',
      pointerId: pe.pointerId,
      bar,
      trackRect: track.getBoundingClientRect(),
      startX: pe.clientX,
      startY: pe.clientY,
      startFraction: parseFloat(bar.style.getPropertyValue('--rm-x')) || 0,
      widthFraction: parseFloat(bar.style.getPropertyValue('--rm-w')) || 0,
      moved: false,
      targetLane: bar.dataset.lane || '',
    };
  };

  #onPointerMove = (e) => {
    const pe = /** @type {PointerEvent} */ (e);
    const info = this.#dragInfo;
    if (!info || pe.pointerId !== info.pointerId) return;
    const dx = pe.clientX - info.startX;
    const dy = pe.clientY - info.startY;

    if (!info.moved) {
      if (Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD) return;
      info.moved = true;
      info.bar.setAttribute('data-dragging', '');
      try { info.bar.setPointerCapture(pe.pointerId); } catch { /* synthetic pointer */ }
    }

    const dxFraction = dx / info.trackRect.width;
    if (info.kind === 'move') {
      const newStart = Math.max(0, Math.min(1 - info.widthFraction, info.startFraction + dxFraction));
      info.bar.style.setProperty('--rm-x', newStart.toFixed(4));

      /* Lane under the pointer (by vertical position over the tracks). */
      let target = info.bar.dataset.lane || '';
      for (const track of /** @type {NodeListOf<HTMLElement>} */ (this.querySelectorAll('.rm-track'))) {
        const r = track.getBoundingClientRect();
        if (pe.clientY >= r.top && pe.clientY <= r.bottom) { target = track.dataset.lane || ''; }
        track.toggleAttribute('data-drop-target', false);
      }
      info.targetLane = target;
      if (target !== info.bar.dataset.lane) {
        this.querySelector(`.rm-track[data-lane="${CSS.escape(target)}"]`)?.setAttribute('data-drop-target', '');
      }
    } else {
      const newWidth = Math.max(0.01, Math.min(1 - info.startFraction, info.widthFraction + dxFraction));
      info.bar.style.setProperty('--rm-w', newWidth.toFixed(4));
    }
  };

  #onPointerUp = (e) => {
    const pe = /** @type {PointerEvent} */ (e);
    const info = this.#dragInfo;
    if (!info || pe.pointerId !== info.pointerId) return;
    this.#dragInfo = null;
    if (!info.moved) return;   // a plain press: let the click select

    /* The click that follows a drag must not also select. */
    this.#suppressClick = true;
    setTimeout(() => { this.#suppressClick = false; }, 0);

    const initiative = this.#initiativeFor.get(info.bar);
    if (!initiative) return;
    const xFrac = parseFloat(info.bar.style.getPropertyValue('--rm-x')) || 0;
    const wFrac = parseFloat(info.bar.style.getPropertyValue('--rm-w')) || 0;

    let start = parseISODate(info.bar.dataset.start);
    let endExcl = addDays(parseISODate(info.bar.dataset.end), 1);
    if (info.kind === 'move') {
      start = this.#snapToBoundary(this.#dateForFraction(xFrac));
      endExcl = this.#snapToBoundary(this.#dateForFraction(xFrac + wFrac));
    } else {
      endExcl = this.#snapToBoundary(this.#dateForFraction(xFrac + wFrac));
    }
    /* Never collapse a bar below one period. */
    if (endExcl <= start) endExcl = addMonths(start, this.#periodMonths);

    const fromLane = info.bar.dataset.lane || '';
    const toLane = info.kind === 'move' && info.targetLane !== fromLane ? info.targetLane : null;
    this.#commit(initiative, fromLane, toLane, start, addDays(endExcl, -1), info.kind === 'move' ? 'reschedule' : 'resize');
  };

  #onPointerCancel = (e) => {
    const pe = /** @type {PointerEvent} */ (e);
    if (!this.#dragInfo || pe.pointerId !== this.#dragInfo.pointerId) return;
    this.#dragInfo = null;
    this.#render();   // discard the uncommitted visual offset
  };

  /**
   * Apply a date and/or lane change to the source <article>, fire the
   * matching events, and re-render. Unchanged values fire nothing.
   * @param {Element} initiative
   * @param {string} fromLane
   * @param {string | null} toLane - new lane, or null to stay
   * @param {Date | null} start - new start, or null to keep
   * @param {Date | null} end - new inclusive end, or null to keep
   * @param {'reschedule' | 'resize' | 'move'} dateEvent - event to fire if the dates changed
   */
  #commit(initiative, fromLane, toLane, start, end, dateEvent) {
    const oldStart = toISODate(Roadmap.#parseDate(initiative.getAttribute('data-start'), 'start'));
    const oldEnd = toISODate(Roadmap.#parseDate(initiative.getAttribute('data-end'), 'end'));
    const newStart = start ? toISODate(start) : oldStart;
    const newEnd = end ? toISODate(end) : oldEnd;
    const datesChanged = newStart !== oldStart || newEnd !== oldEnd;
    const targetLane = toLane !== null && toLane !== fromLane
      ? this.#sourceLanes.find((l) => l.getAttribute('data-lane') === toLane)
      : null;
    const laneChanged = !!targetLane;

    if (datesChanged) {
      initiative.setAttribute('data-start', newStart);
      initiative.setAttribute('data-end', newEnd);
    }
    if (targetLane) targetLane.appendChild(initiative);

    this.#render();
    if (!datesChanged && !laneChanged) return;

    const lane = laneChanged ? toLane : fromLane;
    const title = initiative.querySelector('h1, h2, h3, h4, h5, h6')?.textContent?.trim() || 'Initiative';
    this.#announce(`${title}: ${formatDate(parseISODate(newStart))} to ${formatDate(parseISODate(newEnd))} in ${lane}`);

    if (datesChanged && dateEvent !== 'move') {
      this.dispatchEvent(new CustomEvent(`product-roadmap:${dateEvent}`, {
        bubbles: true,
        detail: { initiative, lane, start: newStart, end: newEnd },
      }));
    }
    if (laneChanged) {
      this.dispatchEvent(new CustomEvent('product-roadmap:move', {
        bubbles: true,
        detail: { initiative, fromLane, toLane, start: newStart, end: newEnd },
      }));
    }
  }

  /** @param {string} msg */
  #announce(msg) {
    if (this.#liveRegion) this.#liveRegion.textContent = msg;
  }

  /* --- date math (calendar days, DST-safe) --- */

  /** @param {Date} date */
  #fractionFor(date) {
    if (!this.#start || !this.#totalDays) return 0;
    return Math.max(0, Math.min(1, daysBetween(this.#start, date) / this.#totalDays));
  }

  /** @param {number} frac */
  #dateForFraction(frac) {
    return addDays(this.#start ?? new Date(), Math.round(frac * this.#totalDays));
  }

  /** @param {Date} date */
  #periodStart(date) {
    return this.#view === 'month' ? startOfMonth(date) : startOfQuarter(date);
  }

  /** Round to the nearest period boundary (quarter or month start). @param {Date} date */
  #snapToBoundary(date) {
    const a = this.#periodStart(date);
    const b = addMonths(a, this.#periodMonths);
    return daysBetween(a, date) <= daysBetween(date, b) ? a : b;
  }

  #enumerateTicks() {
    const ticks = [];
    const start = this.#start;
    const end = this.#endExcl;
    if (!start || !end) return ticks;
    const p = this.#periodMonths;
    for (let cursor = this.#periodStart(start); cursor < end; cursor = addMonths(cursor, p)) {
      const next = addMonths(cursor, p);
      const startFraction = this.#fractionFor(cursor < start ? start : cursor);
      const endFraction   = this.#fractionFor(next > end ? end : next);
      const label = this.#view === 'quarter'
        ? `Q${Math.floor(cursor.getMonth() / 3) + 1} ${cursor.getFullYear()}`
        : `${cursor.toLocaleString(undefined, { month: 'short' })} ${cursor.getFullYear()}`;
      ticks.push({ startFraction, endFraction, label });
    }
    return ticks;
  }

  /** Parse "2026-Q3" or an ISO date. `kind` decides how "YYYY-Qn"
      resolves: 'start' → first day of the quarter; 'end' → last day.
      @param {string | null} value @param {'start' | 'end'} kind */
  static #parseDate(value, kind) {
    if (!value) return null;
    const q = String(value).trim().match(/^(\d{4})-Q([1-4])$/i);
    if (q) {
      const year = Number(q[1]);
      const monthStart = (Number(q[2]) - 1) * 3;
      return kind === 'end' ? new Date(year, monthStart + 3, 0) : new Date(year, monthStart, 1);
    }
    return parseISODate(value);
  }

  /** @type {Date | null} */
  #start = null;
  /** @type {Date | null} first day AFTER the visible range */
  #endExcl = null;
  #totalDays = 0;
  /** @type {"quarter" | "month"} */
  #view = 'quarter';
  #editable = false;
  #suppressClick = false;
  /** @type {Element[]} */
  #sourceLanes = [];
  /** @type {WeakMap<HTMLElement, Element>} rendered bar → source <article> */
  #initiativeFor = new WeakMap();
  /** @type {HTMLElement | null} */
  #liveRegion = null;
  /** @type {{ kind: 'move' | 'resize', pointerId: number, bar: HTMLElement, trackRect: DOMRect, startX: number, startY: number, startFraction: number, widthFraction: number, moved: boolean, targetLane: string } | null} */
  #dragInfo = null;
}

registerComponent('product-roadmap', Roadmap);

export { Roadmap };
