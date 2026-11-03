/**
 * traceability-matrix: 2D cross-reference grid for planning artifacts
 *
 * Auto-discovers row and column source elements from the page and
 * renders a <data-table> with checkmark intersections wherever a row
 * element's `link-attr` references a column element's identifier. Surfaces
 * the canonical Requirements Traceability Matrix (RTM) shape:
 * rows × columns at-a-glance, with empty rows/columns flagged as
 * orphans.
 *
 * Composes <data-table> for sortable / filterable / heatmap-able
 * presentation. Adds two things <data-table> can't:
 *   1. Auto-discovery — build the intersection table from selectors
 *      (rows="user-story" cols="user-persona" link-attr="persona-id")
 *      instead of forcing the author to hand-build every cell.
 *   2. Chain highlight — activating a cell (click, or Enter/Space on the
 *      cell's button) toggles `data-state-highlighted` on the row AND
 *      column source elements page-wide, so authors can see the
 *      connection in surrounding components (cards, timelines, etc.).
 *      The highlight is cleared when the matrix is removed.
 *
 * Keyboard (WAI-ARIA APG grid pattern): the table gets role="grid" and is
 * a single Tab stop with a roving tabindex. Arrow keys move between cells,
 * including the sortable column headers <data-table> provides; Home / End
 * go to the first / last cell of the row, Ctrl+Home / Ctrl+End to the
 * first / last cell of the grid. In a cell, focus goes to its button, so
 * Enter / Space still toggle the highlight (aria-pressed) and, on a column
 * header, sort. role="grid" (rather than a plain table) is what makes
 * screen readers pass the arrow keys through instead of using them for
 * browse-mode reading; native <tr>/<th>/<td> map to row / columnheader /
 * rowheader / gridcell, which axe and the APG accept.
 *
 * Column identifiers: by default a column element is matched by its
 * `id`, `story-id` (<user-story>) or `item-id` (<work-item>), so
 * `rows="work-item" cols="user-story" link-attr="story-ids"` works even
 * before (or without) the stories setting their DOM id. Set `match-attr`
 * to match on one specific attribute instead.
 *
 * Cell semantics:
 *   ✓        — row's link-attr references this column's identifier
 *   (empty)  — no link
 *
 * `link-attr` values are split on comma so attributes like
 * `<work-item story-ids="s-1,s-2,s-3">` work without extra config.
 *
 * Labels: each source element's display label is, in order:
 *   1. `data-matrix-label` attribute (author override)
 *   2. element id
 *   3. element textContent (trimmed, first line)
 *
 * @attr {string} rows         - CSS selector for row source elements
 * @attr {string} cols         - CSS selector for column source elements
 * @attr {string} link-attr    - Attribute on the row element whose value(s) reference column identifiers
 * @attr {string} match-attr   - Attribute on column elements to match against (default: id, story-id, item-id)
 * @attr {string} label        - Optional heading shown above the table
 * @attr {string} row-label    - Header cell text for the row axis (default: "")
 * @attr {string} cell-mark    - Glyph shown in linked cells (default: "✓")
 * @attr {boolean} flag-orphans - When set, marks empty rows/cols with `data-orphan` for CSS targeting
 *
 * @fires traceability-matrix:ready     - { rowCount, colCount, linkCount }
 * @fires traceability-matrix:highlight - { rowEl, colEl, on } when a cell toggles
 */

import { registerComponent } from '../../lib/bundle-registry.js';
import { VBElement } from '../../lib/vb-element.js';

/** Column identity attributes tried, in order, when `match-attr` is unset. */
const DEFAULT_MATCH_ATTRS = ['id', 'story-id', 'item-id'];

class TraceabilityMatrix extends VBElement {
  setup() {
    const rowsSel = this.getAttribute('rows');
    const colsSel = this.getAttribute('cols');
    const linkAttr = this.getAttribute('link-attr');
    if (!rowsSel || !colsSel || !linkAttr) {
      console.warn('traceability-matrix: requires rows, cols, and link-attr attributes');
      return false;
    }

    /* Defer one microtask so any sibling components (e.g. user-persona)
       have finished assigning ids and slot content before we read them. */
    queueMicrotask(() => {
      if (this.isConnected) this.#build(rowsSel, colsSel, linkAttr);
    });
    return true;
  }

  teardown() {
    /* Don't leave page-wide highlight on source elements once the matrix
       that set it is gone. */
    this.#clearHighlight();
  }

  /**
   * Identifiers a column element answers to.
   * @param {Element} el
   * @returns {string[]}
   */
  #keysOf(el) {
    const matchAttr = this.getAttribute('match-attr');
    const attrs = matchAttr ? [matchAttr] : DEFAULT_MATCH_ATTRS;
    return attrs.map((a) => (el.getAttribute(a) || '').trim()).filter(Boolean);
  }

  #build(rowsSel, colsSel, linkAttr) {
    const rowEls = [...document.querySelectorAll(rowsSel)].filter((el) => el !== this && !this.contains(el));
    const colEls = [...document.querySelectorAll(colsSel)].filter((el) => el !== this && !this.contains(el));

    if (!rowEls.length || !colEls.length) {
      this.#renderEmpty();
      return;
    }

    const rowAxisLabel = this.getAttribute('row-label') || '';
    const cellMark = this.getAttribute('cell-mark') || '✓';
    const flagOrphans = this.hasAttribute('flag-orphans');
    const colKeys = colEls.map((el) => new Set(this.#keysOf(el)));

    /* Compute links eagerly so we can flag orphans + emit a count. */
    const linked = rowEls.map((rowEl) => {
      const refs = TraceabilityMatrix.#parseRefs(rowEl.getAttribute(linkAttr));
      return colKeys.map((keys) => refs.some((r) => keys.has(r)));
    });
    const rowHits = linked.map((cells) => cells.filter(Boolean).length);
    const colHits = colEls.map((_, j) => linked.filter((cells) => cells[j]).length);
    const linkCount = rowHits.reduce((a, b) => a + b, 0);

    /* Build the data-table markup: header row of column labels,
       one body row per row source. */
    const wrapper = document.createElement('data-table');
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    const corner = document.createElement('th');
    corner.setAttribute('data-sort', 'string');
    corner.textContent = rowAxisLabel;
    headerRow.appendChild(corner);

    const colLabels = colEls.map((el) => TraceabilityMatrix.#labelOf(el));
    colEls.forEach((colEl, j) => {
      const th = document.createElement('th');
      th.setAttribute('data-sort', 'number');
      th.textContent = colLabels[j];
      th.dataset.colId = colEl.id || this.#keysOf(colEl)[0] || '';
      th.dataset.colIndex = String(j);
      if (flagOrphans && !colHits[j]) th.dataset.orphan = '';
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    rowEls.forEach((rowEl, i) => {
      const tr = document.createElement('tr');
      tr.dataset.rowId = rowEl.id || '';
      tr.dataset.rowIndex = String(i);
      if (flagOrphans && !rowHits[i]) tr.dataset.orphan = '';

      const rowLabel = TraceabilityMatrix.#labelOf(rowEl);
      const labelCell = document.createElement('th');
      labelCell.scope = 'row';
      labelCell.appendChild(TraceabilityMatrix.#button(rowLabel, `Highlight ${rowLabel}`));
      tr.appendChild(labelCell);

      colEls.forEach((colEl, j) => {
        const td = document.createElement('td');
        const matched = linked[i][j];
        td.setAttribute('data-sort-value', matched ? '1' : '0');
        if (matched) td.dataset.linked = '';
        td.setAttribute('aria-label', matched ? 'linked' : 'not linked');
        td.dataset.colId = colEl.id || this.#keysOf(colEl)[0] || '';
        td.dataset.colIndex = String(j);
        td.appendChild(TraceabilityMatrix.#button(
          matched ? cellMark : '',
          `${rowLabel} × ${colLabels[j]}: ${matched ? 'linked' : 'not linked'}`,
        ));
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    wrapper.appendChild(table);

    this.#clearHighlight();
    [...this.children].forEach((c) => { if (c.tagName !== 'TEMPLATE') c.remove(); });

    const label = this.getAttribute('label');
    if (label) {
      const h = document.createElement('header');
      h.className = 'tm-label';
      h.textContent = label;
      this.appendChild(h);
    }
    this.appendChild(wrapper);

    table.setAttribute('role', 'grid');
    if (label) {
      const h = /** @type {HTMLElement} */ (this.querySelector(':scope > .tm-label'));
      h.id ||= `tm-label-${++TraceabilityMatrix.#seq}`;
      table.setAttribute('aria-labelledby', h.id);
    } else {
      table.setAttribute('aria-label', 'Traceability matrix');
    }
    this.#table = table;
    this.#syncRoving();
    this.listen(table, 'keydown', this.#onGridKey);
    this.listen(table, 'focusin', this.#onGridFocus);
    /* <data-table> makes each sortable header a Tab stop when it upgrades,
       which may happen after this build; fold them back into the grid. */
    this.listen(wrapper, 'data-table:upgraded', () => this.#syncRoving());

    /* Wire chain-highlight clicks via event delegation on the wrapper.
       Each cell holds a <button>, so Enter/Space activate it too. Source
       elements are keyed by position, so rows/cols without an id still
       highlight. */
    this.#rowEls = rowEls;
    this.#colEls = colEls;
    this.listen(wrapper, 'click', this.#onCellClick);

    queueMicrotask(() => {
      this.dispatchEvent(new CustomEvent('traceability-matrix:ready', {
        bubbles: true,
        detail: { rowCount: rowEls.length, colCount: colEls.length, linkCount },
      }));
    });
  }

  /**
   * @param {string} text visible text
   * @param {string} name accessible name
   */
  static #button(text, name) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tm-cell-btn';
    btn.textContent = text;
    btn.setAttribute('aria-label', name);
    btn.setAttribute('aria-pressed', 'false');
    return btn;
  }

  /* --- grid keyboard (roving tabindex) --- */

  /**
   * Focus targets as rows × columns: each cell's button, or the cell itself
   * for header cells (made focusable by <data-table> for sorting). Rows
   * hidden by <data-table> filtering / pagination are skipped.
   * @returns {HTMLElement[][]}
   */
  #gridRows() {
    const table = this.#table;
    if (!table) return [];
    return [...table.querySelectorAll(':scope > thead > tr, :scope > tbody > tr')]
      .filter((tr) => !(/** @type {HTMLElement} */ (tr).hidden) && !tr.hasAttribute('data-state-hidden'))
      .map((tr) => [...tr.children].map((cell) => /** @type {HTMLElement} */ (
        cell.querySelector(':scope > button') || cell)));
  }

  /**
   * Make exactly one target the grid's Tab stop: `active`, else the
   * previous stop if it is still in the grid, else the first cell.
   * @param {HTMLElement | null} [active]
   */
  #syncRoving(active = null) {
    const all = this.#gridRows().flat();
    const stop = this.#rovingStop;
    const current = (active && all.includes(active) && active)
      || (stop && all.includes(stop) && stop)
      || all[0];
    this.#rovingStop = current ?? null;
    for (const el of all) el.setAttribute('tabindex', el === current ? '0' : '-1');
  }

  /** Clicking or tabbing into a cell makes it the Tab stop. @param {FocusEvent} e */
  #onGridFocus = (e) => {
    const target = /** @type {HTMLElement} */ (e.target);
    if (this.#gridRows().flat().includes(target) && target !== this.#rovingStop) this.#syncRoving(target);
  };

  /** @param {KeyboardEvent} e */
  #onGridKey = (e) => {
    if (e.altKey || e.metaKey) return;
    const rows = this.#gridRows();
    let r = rows.findIndex((row) => row.includes(/** @type {HTMLElement} */ (e.target)));
    if (r < 0) return;
    let c = rows[r].indexOf(/** @type {HTMLElement} */ (e.target));
    const last = rows.length - 1;
    switch (e.key) {
      case 'ArrowRight': c += 1; break;
      case 'ArrowLeft': c -= 1; break;
      case 'ArrowDown': r += 1; break;
      case 'ArrowUp': r -= 1; break;
      case 'Home': if (e.ctrlKey) r = 0; c = 0; break;
      case 'End': if (e.ctrlKey) r = last; c = Infinity; break;
      default: return;
    }
    e.preventDefault();
    r = Math.max(0, Math.min(last, r));
    c = Math.max(0, Math.min(rows[r].length - 1, c));
    const next = rows[r][c];
    if (!next || next === e.target) return;
    this.#syncRoving(next);
    next.focus();
  };

  #onCellClick = (e) => {
    const cell = e.target.closest('td, th[scope="row"]');
    if (!cell) return;
    const tr = cell.closest('tr');
    if (!tr) return;
    const rowIdx = tr.dataset.rowIndex;
    const colIdx = cell.dataset.colIndex;
    const rowEl = rowIdx !== undefined ? this.#rowEls[Number(rowIdx)] ?? null : null;
    const colEl = colIdx !== undefined ? this.#colEls[Number(colIdx)] ?? null : null;

    /* Toggle: if this cell is already highlighted, clear; else
       set fresh highlight on row + col source elements. */
    const wasOn = cell.hasAttribute('data-state-highlighted');
    this.#clearHighlight();
    if (wasOn) {
      this.dispatchEvent(new CustomEvent('traceability-matrix:highlight', {
        bubbles: true, detail: { rowEl, colEl, on: false },
      }));
      return;
    }
    cell.setAttribute('data-state-highlighted', '');
    cell.querySelector('.tm-cell-btn')?.setAttribute('aria-pressed', 'true');
    /* Highlight the entire row in the matrix for visual scan. */
    tr.setAttribute('data-state-highlighted', '');
    for (const el of [rowEl, colEl]) {
      if (el && !this.#highlighted.includes(el)) {
        el.setAttribute('data-state-highlighted', '');
        this.#highlighted.push(el);
      }
    }

    this.dispatchEvent(new CustomEvent('traceability-matrix:highlight', {
      bubbles: true, detail: { rowEl, colEl, on: true },
    }));
  };

  #clearHighlight() {
    this.querySelectorAll('[data-state-highlighted]').forEach((el) => el.removeAttribute('data-state-highlighted'));
    this.querySelectorAll('.tm-cell-btn[aria-pressed="true"]').forEach((el) => el.setAttribute('aria-pressed', 'false'));
    for (const el of this.#highlighted) el.removeAttribute('data-state-highlighted');
    this.#highlighted = [];
  }

  #renderEmpty() {
    this.#clearHighlight();
    [...this.children].forEach((c) => { if (c.tagName !== 'TEMPLATE') c.remove(); });
    const note = document.createElement('p');
    note.className = 'tm-empty';
    note.textContent = 'No matching elements found for this matrix.';
    this.appendChild(note);
  }

  static #parseRefs(raw) {
    if (!raw) return [];
    return raw.split(',').map((s) => s.trim()).filter(Boolean);
  }

  static #labelOf(el) {
    return el.getAttribute('data-matrix-label')
      || el.id
      || (el.textContent || '').trim().split('\n')[0].slice(0, 60)
      || '(unnamed)';
  }

  static #seq = 0;
  /** @type {HTMLTableElement | null} */
  #table = null;
  /** The grid's single Tab stop. @type {HTMLElement | null} */
  #rovingStop = null;
  /** @type {Element[]} */
  #rowEls = [];
  /** @type {Element[]} */
  #colEls = [];
  /** Source elements this matrix highlighted (cleared on re-highlight and teardown). @type {Element[]} */
  #highlighted = [];
}

registerComponent('traceability-matrix', TraceabilityMatrix);

export { TraceabilityMatrix };
