/**
 * <gantt-chart> — HTML-first project schedule visualization
 *
 * Progressively enhances a semantic <table> with <time>, <progress>,
 * and <data> elements into an interactive Gantt timeline.
 *
 * Without JS: renders as a readable data table with progress bars.
 * With JS: visual timeline with bars, groups, milestones, and today line.
 *
 * Data sources, in order of precedence: the `.tasks` property, the `src`
 * JSON URL, then the child <table>. Dates are calendar days in local time
 * (src/lib/dates.js), so `2026-04-01` shows as Apr 1 in every time zone.
 *
 * Progress (`.tasks` and `src` JSON): a value greater than 1 is a
 * percentage (0–100); a value from 0 to 1 is a fraction. A table's
 * <progress> is read as value / max. `.tasks` reads back as a fraction.
 *
 * @attr {string} title - Chart heading
 * @attr {string} src - URL to JSON task data
 * @attr {string} view - Timeline granularity: auto|day|week|month|quarter
 * @attr {boolean} show-today - Show vertical today marker
 * @attr {boolean} show-progress - Show progress fill in bars
 * @attr {boolean} show-dependencies - Draw dependency arrows
 * @attr {boolean} compact - Reduced spacing variant
 *
 * Child <tr> attributes:
 * @attr {string} data-task-id - Unique task identifier
 * @attr {string} data-group - Swim lane group
 * @attr {string} data-depends - Comma-separated dependency task IDs
 * @attr {string} data-status - not-started|in-progress|done|blocked
 * @attr {string} data-assignee - Assignee name
 * @attr {boolean} data-milestone - Render as diamond instead of bar
 * @attr {string} data-color - Custom bar color
 * @attr {string} data-story-ids - Comma-separated linked user-story IDs
 * @attr {string} data-item-ids - Comma-separated linked work-item IDs
 *
 * @fires gantt-chart:ready - After the first render of a table or src load
 * @fires gantt-chart:task-click - Task bar or milestone activated (click, Enter, Space)
 * @fires gantt-chart:tasks-changed - After `.tasks` assignment or a src load
 */

import { registerComponent } from '../../lib/bundle-registry.js';
import { VBElement } from '../../lib/vb-element.js';
import { viewTransitionSwap } from '../../lib/vb-view-transition.js';
import {
  parseISODate, toISODate, addDays, addMonths, daysBetween,
  startOfDay, startOfMonth, startOfQuarter, formatDate,
} from '../../lib/dates.js';

/* ── Date helpers (calendar days) ── */

/** @param {number} rangeDays */
function pickFormatter(rangeDays) {
  if (rangeDays <= 90) {
    return (d) => formatDate(d, { month: 'short', day: 'numeric' });
  }
  if (rangeDays <= 365) {
    return (d) => formatDate(d, { month: 'short', year: '2-digit' });
  }
  return (d) => formatDate(d, { year: 'numeric' });
}

/** @param {number} rangeDays */
function resolveView(rangeDays) {
  if (rangeDays <= 21) return 'day';
  if (rangeDays <= 90) return 'week';
  if (rangeDays <= 365) return 'month';
  return 'quarter';
}

const STEP_DAYS = { day: 1, week: 7, month: 30, quarter: 91 };

/** Long-form date for labels, e.g. "Apr 1, 2026". @param {number} ts */
function longDate(ts) {
  return formatDate(new Date(ts), { year: 'numeric', month: 'short', day: 'numeric' });
}

const STATUS_LABELS = {
  'not-started': 'Not started',
  'in-progress': 'In progress',
  done: 'Done',
  blocked: 'Blocked',
};

/** @param {string} s */
function statusLabel(s) {
  return STATUS_LABELS[s] || (s.charAt(0).toUpperCase() + s.slice(1)).replace(/-/g, ' ');
}

/** Split "a, b" or pass arrays through. @param {unknown} v @returns {string[]} */
function idList(v) {
  if (Array.isArray(v)) return v.map(String);
  if (v == null || v === '') return [];
  return String(v).split(',').map((s) => s.trim()).filter(Boolean);
}

/**
 * One progress convention everywhere: > 1 is a percentage, 0–1 a fraction.
 * Returns a fraction clamped to [0, 1].
 * @param {unknown} v
 */
function normalizeProgress(v) {
  const n = Number(v);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.min(1, n > 1 ? n / 100 : n);
}

/**
 * Normalize author/property/JSON task records. Start/end become
 * local-midnight timestamps; tasks without a valid start are dropped.
 * @param {Array<any>} list
 */
function normalizeTasks(list) {
  const out = [];
  (list || []).forEach((t, i) => {
    const start = parseISODate(t?.start);
    if (!start) return;
    const end = parseISODate(t.end) ?? start;
    out.push({
      id: t.id != null && t.id !== '' ? String(t.id) : `gc-task-${i}`,
      name: t.name ?? `Task ${i + 1}`,
      start: start.getTime(),
      end: Math.max(end.getTime(), start.getTime()),
      progress: normalizeProgress(t.progress),
      group: t.group || null,
      depends: idList(t.depends),
      status: t.status || null,
      assignee: t.assignee || null,
      milestone: !!t.milestone,
      color: t.color || null,
      storyIds: idList(t.storyIds),
      itemIds: idList(t.itemIds),
    });
  });
  return out;
}

let instanceCounter = 0;

/* ── Component ─────────────────────────────────────── */

class GanttChart extends VBElement {
  static get observedAttributes() {
    return ['src', 'title', 'view', 'show-today', 'show-progress', 'show-dependencies', 'compact'];
  }

  #uid = `gc-${++instanceCounter}`;
  /** @type {HTMLDivElement|null} */
  #container = null;
  /** @type {HTMLDivElement|null} */
  #liveRegion = null;
  /** @type {HTMLElement|null} */
  #titleEl = null;
  /** @type {Array<any>} */
  #tasks = [];
  /**
   * Where #tasks came from. 'table' re-parses the author's <table> on each
   * connect; 'property' and 'src' keep #tasks and generate the SR table.
   * @type {'table' | 'property' | 'src'}
   */
  #source = 'table';
  /** URL whose data is loaded (or loading) — guards against refetching. */
  #srcLoaded = /** @type {string|null} */ (null);
  #srcToken = 0;
  #internalAttr = false;
  /** Local-midnight Date of the first day in range. */
  #rangeStart = new Date(0);
  /** Calendar days spanned by the range (≥ 1). */
  #rangeDays = 1;

  constructor() {
    super();
    /* A `.tasks` set before the element was defined lands as an own
       property and would shadow the accessor: re-route it. */
    if (Object.prototype.hasOwnProperty.call(this, 'tasks')) {
      const value = /** @type {any} */ (this).tasks;
      delete (/** @type {any} */ (this)).tasks;
      this.tasks = value;
    }
  }

  setup() {
    this.listen(this, 'click', this.#onClick);
    this.listen(this, 'keydown', this.#onKeyDown);

    if (this.#source === 'table') {
      const table = this.querySelector(':scope > table');
      this.#tasks = table ? this.#parseTasks(table) : [];
    }
    this.#render();
    if (this.#tasks.length) this.#dispatchReady();

    /* src loads here as well as in attributeChangedCallback, so
       createElement + setAttribute('src') + append fetches (once). */
    const src = this.getAttribute('src');
    if (src && src !== this.#srcLoaded) this.#loadSrc(src);
    return true;
  }

  teardown() {
    this.#removeChrome();
    const table = this.querySelector(':scope > table.gc-sr-only');
    if (table && !table.hasAttribute('data-gc-generated')) table.classList.remove('gc-sr-only');
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue || this.#internalAttr) return;
    if (!this.isConnected || !this.hasAttribute('data-upgraded')) return;   // setup() reads them
    if (name === 'src') {
      if (newValue) this.#loadSrc(newValue);
      return;
    }
    viewTransitionSwap(this, () => this.#render(), 'gc-vt');
  }

  // ── Data API (HTML-first / JS-first dual contract) ──────────────

  /**
   * The current task list (normalized). start/end are local-midnight
   * timestamps; progress is a 0–1 fraction.
   */
  get tasks() { return this.#tasks; }

  /**
   * Replace the task set and re-render. start/end accept YYYY-MM-DD
   * strings, Dates or timestamps; progress accepts 0–1 or 0–100 (> 1).
   * The visually hidden table is regenerated from the new tasks.
   */
  set tasks(value) {
    this.#tasks = normalizeTasks(value);
    this.#source = 'property';
    if (this.hasAttribute('data-upgraded')) this.#render();
    this.dispatchEvent(new CustomEvent('gantt-chart:tasks-changed', {
      detail: { tasks: this.#tasks, source: 'property' },
      bubbles: true,
    }));
  }

  /* ── Table parsing ─────────────────────────────── */

  /** @param {Element} table */
  #parseTasks(table) {
    const rows = table.querySelectorAll('tbody tr');
    const raw = [];
    for (let i = 0; i < rows.length; i++) {
      const row = /** @type {HTMLTableRowElement} */ (rows[i]);
      const times = row.querySelectorAll('time[datetime]');
      if (times.length < 2 && !row.hasAttribute('data-milestone')) continue;
      const start = times[0]?.getAttribute('datetime');
      if (!start) continue;
      const progressEl = row.querySelector('progress');
      raw.push({
        id: row.dataset.taskId || `gc-task-${i}`,
        name: row.cells[0]?.textContent?.trim() || `Task ${i + 1}`,
        start,
        end: times.length > 1 ? times[1].getAttribute('datetime') : start,
        // <progress> is explicit about its scale, so convert to a fraction here.
        progress: progressEl ? progressEl.value / (progressEl.max || 1) : 0,
        group: row.dataset.group,
        depends: row.dataset.depends,
        status: row.dataset.status,
        assignee: row.dataset.assignee,
        milestone: row.hasAttribute('data-milestone'),
        color: row.dataset.color,
        storyIds: row.dataset.storyIds,
        itemIds: row.dataset.itemIds,
      });
    }
    return normalizeTasks(raw);
  }

  /* ── Render ────────────────────────────────────── */

  #removeChrome() {
    this.#titleEl?.remove(); this.#titleEl = null;
    this.#container?.remove(); this.#container = null;
    this.#liveRegion?.remove(); this.#liveRegion = null;
  }

  /** The SR table: the author's for 'table', otherwise generated from #tasks. */
  #syncTable() {
    if (this.#source === 'table') {
      return /** @type {HTMLTableElement|null} */ (this.querySelector(':scope > table'));
    }
    this.querySelectorAll(':scope > table').forEach((t) => t.remove());
    if (!this.#tasks.length) return null;
    const table = this.#buildTable();
    this.appendChild(table);
    return table;
  }

  #render() {
    this.#removeChrome();
    const table = this.#syncTable();
    if (!this.#tasks.length) return;

    const starts = this.#tasks.map((t) => t.start);
    const ends = this.#tasks.map((t) => t.end);
    this.#rangeStart = new Date(Math.min(...starts));
    this.#rangeDays = Math.max(1, daysBetween(this.#rangeStart, new Date(Math.max(...ends))));

    this.#build(table);
  }

  /** @param {number | Date} ts @returns {number} 0–100 */
  #pct(ts) {
    const d = typeof ts === 'number' ? new Date(ts) : ts;
    return (daysBetween(this.#rangeStart, d) / this.#rangeDays) * 100;
  }

  #dispatchReady() {
    this.dispatchEvent(new CustomEvent('gantt-chart:ready', {
      bubbles: true,
      detail: {
        taskCount: this.#tasks.length,
        dateRange: {
          start: toISODate(this.#rangeStart),
          end: toISODate(addDays(this.#rangeStart, this.#rangeDays)),
        },
      },
    }));
  }

  /** @param {HTMLTableElement | null} table */
  #build(table) {
    const title = this.getAttribute('title');
    const showToday = this.hasAttribute('show-today');
    const showProgress = this.hasAttribute('show-progress');
    const showDeps = this.hasAttribute('show-dependencies');
    const anchor = table && table.parentNode === this ? table : null;

    if (title) {
      this.#titleEl = document.createElement('h2');
      this.#titleEl.className = 'gc-title';
      this.#titleEl.textContent = title;
      this.insertBefore(this.#titleEl, anchor);
    }

    this.#container = document.createElement('div');
    this.#container.className = 'gc-container';
    this.#container.setAttribute('role', 'region');
    this.#container.setAttribute('aria-label', `Gantt chart${title ? ': ' + title : ''}`);

    const labels = this.#generateDateLabels();
    this.#container.appendChild(this.#buildTimelineHeader(labels));

    const body = document.createElement('div');
    body.className = 'gc-body';

    const taskList = document.createElement('div');
    taskList.className = 'gc-task-list';

    const barsPanel = document.createElement('div');
    barsPanel.className = 'gc-bars';
    barsPanel.appendChild(this.#buildGridLines(labels));

    const grouped = this.#groupTasks();
    for (const [groupName, groupTasks] of grouped) {
      if (grouped.size > 1 && groupName) {
        const groupHeader = document.createElement('div');
        groupHeader.className = 'gc-group-header';
        const label = document.createElement('span');
        label.className = 'gc-group-label';
        label.textContent = groupName;
        groupHeader.appendChild(label);
        taskList.appendChild(groupHeader);

        const spacer = document.createElement('div');
        spacer.className = 'gc-group-spacer';
        barsPanel.appendChild(spacer);
      }

      for (const task of groupTasks) {
        const taskRow = document.createElement('div');
        taskRow.className = 'gc-task-row';
        taskRow.setAttribute('data-task-id', task.id);

        const taskName = document.createElement('span');
        taskName.className = 'gc-task-name';
        taskName.textContent = task.name;
        taskRow.appendChild(taskName);

        // Status as visible text, so it is not conveyed by bar colour alone.
        if (task.status) {
          const status = document.createElement('span');
          status.className = 'gc-task-status';
          status.setAttribute('data-status', task.status);
          status.textContent = statusLabel(task.status);
          taskRow.appendChild(status);
        }

        const taskDates = document.createElement('span');
        taskDates.className = 'gc-task-dates';
        taskDates.textContent = task.milestone
          ? longDate(task.start)
          : `${longDate(task.start)} to ${longDate(task.end)}`;
        taskRow.appendChild(taskDates);

        taskList.appendChild(taskRow);

        const barRow = document.createElement('div');
        barRow.className = 'gc-bar-row';
        barRow.setAttribute('data-task-id', task.id);
        barRow.appendChild(task.milestone ? this.#buildMilestone(task) : this.#buildBar(task, showProgress));
        barsPanel.appendChild(barRow);
      }
    }

    if (showToday) {
      const todayLine = this.#buildTodayLine();
      if (todayLine) barsPanel.appendChild(todayLine);
    }

    body.appendChild(taskList);
    body.appendChild(barsPanel);
    this.#container.appendChild(body);
    this.insertBefore(this.#container, anchor);

    if (table) table.classList.add('gc-sr-only');

    this.#liveRegion = document.createElement('div');
    this.#liveRegion.className = 'gc-sr-only';
    this.#liveRegion.setAttribute('role', 'status');
    this.#liveRegion.setAttribute('aria-live', 'polite');
    this.#liveRegion.setAttribute('aria-atomic', 'true');
    this.appendChild(this.#liveRegion);

    if (showDeps) {
      // Measure after layout: row heights depend on compact/group spacers.
      requestAnimationFrame(() => {
        if (!barsPanel.isConnected) return;
        const svg = this.#buildDependencyArrows(barsPanel);
        if (svg) barsPanel.appendChild(svg);
      });
    }
  }

  /* ── Generated SR table (property / src data) ──── */

  #buildTable() {
    const table = document.createElement('table');
    table.setAttribute('data-gc-generated', '');
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    for (const label of ['Task', 'Start', 'End', 'Progress', 'Status']) {
      const th = document.createElement('th');
      th.scope = 'col';
      th.textContent = label;
      headerRow.appendChild(th);
    }
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    for (const task of this.#tasks) {
      const tr = document.createElement('tr');
      tr.dataset.taskId = task.id;
      const tdName = document.createElement('td');
      tdName.textContent = task.name;
      tr.appendChild(tdName);

      for (const ts of [task.start, task.end]) {
        const td = document.createElement('td');
        const time = document.createElement('time');
        time.setAttribute('datetime', toISODate(new Date(ts)));
        time.textContent = longDate(ts);
        td.appendChild(time);
        tr.appendChild(td);
      }

      const tdProgress = document.createElement('td');
      const progress = document.createElement('progress');
      const pct = Math.round(task.progress * 100);
      progress.max = 100;
      progress.value = pct;
      progress.textContent = `${pct}%`;
      tdProgress.appendChild(progress);
      tr.appendChild(tdProgress);

      const tdStatus = document.createElement('td');
      tdStatus.textContent = task.status ? statusLabel(task.status) : '';
      tr.appendChild(tdStatus);

      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    return table;
  }

  /* ── Timeline header ───────────────────────────── */

  /** @param {Array<{position: number, text: string}>} labels */
  #buildTimelineHeader(labels) {
    const header = document.createElement('div');
    header.className = 'gc-timeline-header';

    const spacer = document.createElement('div');
    spacer.className = 'gc-timeline-spacer';
    header.appendChild(spacer);

    const dates = document.createElement('div');
    dates.className = 'gc-timeline-dates';
    for (const { position, text } of labels) {
      const label = document.createElement('span');
      label.className = 'gc-date-label';
      label.style.left = `${position}%`;
      label.textContent = text;
      dates.appendChild(label);
    }

    header.appendChild(dates);
    return header;
  }

  /* ── Date labels ───────────────────────────────── */

  #generateDateLabels() {
    const viewAttr = this.getAttribute('view') || 'auto';
    const view = STEP_DAYS[viewAttr] ? viewAttr : resolveView(this.#rangeDays);
    const formatter = pickFormatter(this.#rangeDays);
    const rangeStart = this.#rangeStart;
    const rangeEnd = addDays(rangeStart, this.#rangeDays);
    const labels = [];

    /** @type {(d: Date) => Date} */
    let step;
    let cursor;
    if (view === 'week') {
      // First Monday on or after the range start.
      const dow = rangeStart.getDay();
      cursor = addDays(rangeStart, (8 - dow) % 7);
      step = (d) => addDays(d, 7);
    } else if (view === 'month') {
      cursor = startOfMonth(rangeStart);
      if (cursor < rangeStart) cursor = addMonths(cursor, 1);
      step = (d) => addMonths(d, 1);
    } else if (view === 'quarter') {
      // Day 1 is set before the month moves, so a Mar 31 start aligns to Apr 1.
      cursor = startOfQuarter(rangeStart);
      if (cursor < rangeStart) cursor = addMonths(cursor, 3);
      step = (d) => addMonths(d, 3);
    } else {
      cursor = startOfDay(rangeStart);
      step = (d) => addDays(d, 1);
    }

    // Label the range start if the first aligned tick is well past it.
    if (daysBetween(rangeStart, cursor) > STEP_DAYS[view] * 0.5) {
      labels.push({ position: 0, text: formatter(rangeStart) });
    }

    for (let d = cursor; d <= rangeEnd; d = step(d)) {
      const pct = this.#pct(d);
      if (pct >= 0 && pct <= 100) labels.push({ position: pct, text: formatter(d) });
    }
    return labels;
  }

  /* ── Grid lines ────────────────────────────────── */

  /** @param {Array<{position: number}>} labels */
  #buildGridLines(labels) {
    const container = document.createElement('div');
    container.className = 'gc-grid-lines';
    for (const { position } of labels) {
      if (position <= 0) continue;
      const line = document.createElement('div');
      line.className = 'gc-grid-line';
      line.style.left = `${position}%`;
      container.appendChild(line);
    }
    return container;
  }

  /* ── Group tasks ───────────────────────────────── */

  #groupTasks() {
    /** @type {Map<string, any[]>} */
    const groups = new Map();
    for (const task of this.#tasks) {
      const key = task.group || '';
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)?.push(task);
    }
    return groups;
  }

  /* ── Accessible name ───────────────────────────── */

  /** @param {any} task */
  #taskLabel(task) {
    const parts = [task.milestone
      ? `Milestone: ${task.name}, ${longDate(task.start)}`
      : `${task.name}: ${longDate(task.start)} to ${longDate(task.end)}`];
    if (task.status) parts.push(`status: ${statusLabel(task.status).toLowerCase()}`);
    if (!task.milestone && task.progress > 0) parts.push(`${Math.round(task.progress * 100)}% complete`);
    if (task.assignee) parts.push(`assigned to ${task.assignee}`);
    return parts.join(', ');
  }

  /* ── Build bar ─────────────────────────────────── */

  /** @param {any} task @param {boolean} showProgress */
  #buildBar(task, showProgress) {
    const leftPct = this.#pct(task.start);
    const widthPct = this.#pct(task.end) - leftPct;

    const bar = document.createElement('div');
    bar.className = 'gc-bar';
    bar.setAttribute('data-task-id', task.id);
    bar.setAttribute('role', 'button');
    bar.setAttribute('tabindex', '0');
    bar.setAttribute('aria-label', this.#taskLabel(task));

    bar.style.left = `${leftPct}%`;
    bar.style.width = `${Math.max(widthPct, 0.5)}%`;

    if (task.status) bar.setAttribute('data-status', task.status);
    if (task.color) bar.style.setProperty('--gc-bar-color', task.color);

    if (showProgress && task.progress > 0) {
      const fill = document.createElement('div');
      fill.className = 'gc-bar-fill';
      fill.style.width = `${Math.round(task.progress * 100)}%`;
      bar.appendChild(fill);
    }

    if (widthPct > 8) {
      const label = document.createElement('span');
      label.className = 'gc-bar-label';
      label.setAttribute('aria-hidden', 'true');
      label.textContent = task.name;
      bar.appendChild(label);
    }

    return bar;
  }

  /* ── Build milestone ───────────────────────────── */

  /** @param {any} task */
  #buildMilestone(task) {
    const diamond = document.createElement('div');
    diamond.className = 'gc-milestone';
    diamond.setAttribute('data-task-id', task.id);
    diamond.setAttribute('role', 'button');
    diamond.setAttribute('tabindex', '0');
    diamond.setAttribute('aria-label', this.#taskLabel(task));
    diamond.style.left = `${this.#pct(task.start)}%`;

    if (task.status) diamond.setAttribute('data-status', task.status);
    if (task.color) diamond.style.setProperty('--gc-bar-color', task.color);

    return diamond;
  }

  /* ── Today line ────────────────────────────────── */

  #buildTodayLine() {
    const now = new Date();
    const dayFraction = (now.getTime() - startOfDay(now).getTime()) / 86_400_000;
    const days = daysBetween(this.#rangeStart, now) + dayFraction;
    if (days < 0 || days > this.#rangeDays) return null;

    const line = document.createElement('div');
    line.className = 'gc-today-line';
    line.style.left = `${(days / this.#rangeDays) * 100}%`;

    const label = document.createElement('span');
    label.className = 'gc-today-label';
    label.textContent = 'Today';
    line.appendChild(label);

    return line;
  }

  /* ── Dependency arrows ─────────────────────────── */

  /** @param {HTMLElement} barsPanel */
  #buildDependencyArrows(barsPanel) {
    if (!this.#tasks.some((t) => t.depends.length > 0)) return null;

    /* Row centres are measured, not computed from a fixed row height, so
       compact mode and group spacers line up. */
    /** @type {Map<string, number>} */
    const centreY = new Map();
    for (const row of /** @type {NodeListOf<HTMLElement>} */ (barsPanel.querySelectorAll(':scope > .gc-bar-row'))) {
      centreY.set(row.dataset.taskId || '', row.offsetTop + row.offsetHeight / 2);
    }
    const height = Math.max(1, Math.round(barsPanel.scrollHeight));

    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('class', 'gc-deps');
    svg.setAttribute('aria-hidden', 'true');
    // x is a percentage (0–100, matching the bars' CSS `left: N%`) and y is in
    // pixels. A non-uniform viewBox maps both, so the path `d` can use plain
    // numbers — SVG path data does not accept `%` units. non-scaling-stroke
    // keeps the line/arrowhead uniform despite the x-axis stretch.
    svg.setAttribute('viewBox', `0 0 100 ${height}`);
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.style.width = '100%';
    svg.style.height = `${height}px`;

    // Per-instance marker id: url(#id) resolves document-wide, so a shared
    // id would point every chart at the first chart's marker.
    const markerId = `${this.#uid}-arrowhead`;
    const defs = document.createElementNS(ns, 'defs');
    const marker = document.createElementNS(ns, 'marker');
    marker.setAttribute('id', markerId);
    marker.setAttribute('markerWidth', '8');
    marker.setAttribute('markerHeight', '6');
    marker.setAttribute('refX', '8');
    marker.setAttribute('refY', '3');
    marker.setAttribute('orient', 'auto');
    const arrow = document.createElementNS(ns, 'polygon');
    arrow.setAttribute('points', '0 0, 8 3, 0 6');
    arrow.setAttribute('fill', 'var(--color-text-muted, #666666)');
    marker.appendChild(arrow);
    defs.appendChild(marker);
    svg.appendChild(defs);

    for (const task of this.#tasks) {
      for (const depId of task.depends) {
        const source = this.#tasks.find((t) => t.id === depId);
        if (!source) continue;
        const sourceY = centreY.get(source.id);
        const targetY = centreY.get(task.id);
        if (sourceY === undefined || targetY === undefined) continue;

        const sourceRight = this.#pct(source.end);
        const targetLeft = this.#pct(task.start);
        const midX = sourceRight + (targetLeft - sourceRight) / 2;

        const path = document.createElementNS(ns, 'path');
        path.setAttribute('d', `M ${sourceRight} ${sourceY} C ${midX} ${sourceY}, ${midX} ${targetY}, ${targetLeft} ${targetY}`);
        path.setAttribute('class', 'gc-dep-line');
        path.setAttribute('data-from', source.id);
        path.setAttribute('data-to', task.id);
        path.setAttribute('marker-end', `url(#${markerId})`);
        path.setAttribute('vector-effect', 'non-scaling-stroke');
        svg.appendChild(path);
      }
    }

    return svg;
  }

  /* ── Interaction (delegated once in setup) ─────── */

  /** @param {Event} e */
  #barFromEvent(e) {
    const t = /** @type {Element} */ (e.target);
    const bar = /** @type {HTMLElement | null} */ (t?.closest?.('.gc-bar, .gc-milestone'));
    return bar && this.#container?.contains(bar) ? bar : null;
  }

  #onClick = (e) => {
    const bar = this.#barFromEvent(e);
    if (!bar) return;
    const task = this.#tasks.find((t) => t.id === bar.dataset.taskId);
    if (!task) return;
    this.#announce(`Selected: ${task.name}`);
    this.dispatchEvent(new CustomEvent('gantt-chart:task-click', {
      bubbles: true,
      detail: { task },
    }));
  };

  #onKeyDown = (e) => {
    const ke = /** @type {KeyboardEvent} */ (e);
    if (ke.key !== 'Enter' && ke.key !== ' ') return;
    const bar = this.#barFromEvent(ke);
    if (!bar) return;
    ke.preventDefault();
    bar.click();
  };

  /* ── JSON loading ──────────────────────────────── */

  /** @param {string} url */
  async #loadSrc(url) {
    this.#srcLoaded = url;
    const token = ++this.#srcToken;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (token !== this.#srcToken) return;   // superseded by a newer src

      this.#tasks = normalizeTasks(data.tasks || []);
      this.#source = 'src';
      if (data.title && data.title !== this.getAttribute('title')) {
        this.#internalAttr = true;
        this.setAttribute('title', data.title);
        this.#internalAttr = false;
      }
      // Rendered synchronously so listeners of the events below see the new DOM.
      if (this.hasAttribute('data-upgraded')) {
        this.#render();
        this.#dispatchReady();
      }
      this.dispatchEvent(new CustomEvent('gantt-chart:tasks-changed', {
        detail: { tasks: this.#tasks, source: 'src' },
        bubbles: true,
      }));
    } catch (err) {
      if (token === this.#srcToken) this.#srcLoaded = null;   // allow a retry
      console.warn(`[gantt-chart] Failed to load src="${url}":`, err);
    }
  }

  /* ── Live region ───────────────────────────────── */

  /** @param {string} msg */
  #announce(msg) {
    if (!this.#liveRegion) return;
    this.#liveRegion.textContent = '';
    requestAnimationFrame(() => {
      if (this.#liveRegion) this.#liveRegion.textContent = msg;
    });
  }
}

registerComponent('gantt-chart', GanttChart);
export { GanttChart };
