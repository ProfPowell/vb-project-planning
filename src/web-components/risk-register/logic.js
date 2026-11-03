/**
 * risk-register: Composing preset for the table + quadrant pattern
 *
 * Reads risk rows from a <template> child (or src URL) and renders both
 * a sortable <data-table> with a computed Severity column AND a
 * <quadrant-grid> mapping each risk to a labelled dot at
 * (likelihood, impact). The two views stay in sync from one source.
 *
 * The pairing recurs as a single tool, justifying a wrapper instead of
 * a recipe. Most of the code is glue; both children do the work.
 *
 * Row shape (from <template>'s <tr> cells, in order):
 *   1. Title           — short risk identifier
 *   2. Likelihood      — integer 1..5
 *   3. Impact          — integer 1..5
 *   4. Owner           — optional, free text
 *   5. Mitigation      — optional, free text
 *   <tr data-id="..."> on the row provides a stable id; falls back to
 *   the title.
 *
 * Severity = likelihood × impact is computed here and written into the
 * Severity cell (text + data-sort-value) so <data-table> sorts and
 * heat-maps it. It deliberately does NOT use data-rollup="product": that
 * multiplies every numeric-looking cell in the row ("2FA rollout",
 * "3 vendor quotes"). A row missing either score has an empty severity.
 *
 * Quadrant placement: scores 1..SCALE map to 0..1 via (v - 1) / (SCALE - 1),
 * so 1 sits on the low edge and SCALE on the high edge. A score is "high"
 * only when it is above the midpoint (> 3 on the 1–5 scale); the midpoint
 * itself (3) counts as low and is drawn on the centre line. Each dot gets
 * an explicit data-quadrant so <quadrant-grid> doesn't apply its own
 * "midpoint belongs to the higher quadrant" rule.
 *
 * @attr {string} src   - URL to JSON: [{ id, title, likelihood, impact, owner, mitigation }]
 * @attr {string} label - Optional heading shown above the table
 *
 * @fires risk-register:ready  - { count } after first render
 * @fires risk-register:change - { row, field, value } on inline edit
 */

import { registerComponent } from '../../lib/bundle-registry.js';
import { VBElement } from '../../lib/vb-element.js';
import { esc } from '../../lib/escape.js';

const SCALE = 5;
/** Scores strictly above this are in the high half of an axis. */
const MIDPOINT = (SCALE + 1) / 2;

/**
 * Normalize a likelihood/impact score to an integer 1..SCALE, or 0 when
 * missing / not a number.
 * @param {unknown} v
 * @returns {number}
 */
function score(v) {
  const n = parseInt(String(v ?? ''), 10);
  if (!Number.isFinite(n) || n < 1) return 0;
  return Math.min(SCALE, n);
}

/**
 * Map a 1..SCALE score to a 0..1 coordinate.
 * @param {number} v
 */
const toUnit = (v) => (v - 1) / (SCALE - 1);

/**
 * Quadrant index (Q1=top-right, Q2=top-left, Q3=bottom-left,
 * Q4=bottom-right) for a likelihood (x) / impact (y) pair.
 * @param {number} likelihood
 * @param {number} impact
 */
function quadrantFor(likelihood, impact) {
  const right = likelihood > MIDPOINT;
  const top = impact > MIDPOINT;
  if (top) return right ? 0 : 1;
  return right ? 3 : 2;
}

class RiskRegister extends VBElement {
  setup() {
    const tmpl = this.querySelector(':scope > template');
    let rows = tmpl ? RiskRegister.#parseTemplate(tmpl) : [];

    if (this.hasAttribute('src')) {
      this.#loadFromSrc(this.getAttribute('src'));
      return;
    }
    this.#render(rows);
  }

  async #loadFromSrc(url) {
    try {
      const res = await fetch(url);
      const data = await res.json();
      this.#render(Array.isArray(data) ? data : []);
    } catch (e) {
      console.warn('risk-register: failed to load src', url, e);
      this.#render([]);
    }
  }

  static #parseTemplate(tmpl) {
    const rows = [];
    const trs = tmpl.content.querySelectorAll('tr');
    for (const tr of trs) {
      const cells = [...tr.children];
      const title = cells[0]?.textContent?.trim() || '';
      const id = tr.getAttribute('data-id') || title.toLowerCase().replace(/\s+/g, '-') || `risk-${rows.length}`;
      rows.push({
        id,
        title,
        likelihood: score(cells[1]?.textContent),
        impact:     score(cells[2]?.textContent),
        owner:      cells[3]?.textContent?.trim() || '',
        mitigation: cells[4]?.textContent?.trim() || '',
      });
    }
    return rows;
  }

  #render(rows) {
    this.#rows = rows.map((r) => ({
      ...r,
      likelihood: score(r?.likelihood),
      impact: score(r?.impact),
    }));
    rows = this.#rows;

    // Wipe prior children except the source <template> so re-renders work.
    [...this.children].forEach((c) => { if (c.tagName !== 'TEMPLATE') c.remove(); });

    const label = this.getAttribute('label');
    if (label) {
      const h = document.createElement('header');
      h.className = 'rr-label';
      h.textContent = label;
      this.appendChild(h);
    }

    const layout = document.createElement('div');
    layout.className = 'rr-layout';
    layout.appendChild(this.#buildTable(rows));
    layout.appendChild(this.#buildGrid(rows));
    this.appendChild(layout);

    queueMicrotask(() => {
      this.dispatchEvent(new CustomEvent('risk-register:ready', {
        bubbles: true,
        detail: { count: rows.length },
      }));
    });
  }

  #buildTable(rows) {
    const wrapper = document.createElement('data-table');
    const table = document.createElement('table');

    table.innerHTML = `
      <thead>
        <tr>
          <th data-sort="string">Title</th>
          <th data-sort="number">Likelihood</th>
          <th data-sort="number">Impact</th>
          <th data-sort="number" data-severity data-heatmap="low-good">Severity</th>
          <th data-sort="string">Owner</th>
          <th data-sort="string">Mitigation</th>
        </tr>
      </thead>
      <tbody>
        ${rows.map((r) => {
          const sev = r.likelihood && r.impact ? r.likelihood * r.impact : null;
          return `
          <tr data-id="${esc(r.id)}">
            <td>${esc(r.title)}</td>
            <td>${r.likelihood || ''}</td>
            <td>${r.impact || ''}</td>
            <td${sev === null ? '' : ` data-sort-value="${sev}"`}>${sev ?? ''}</td>
            <td>${esc(r.owner)}</td>
            <td>${esc(r.mitigation)}</td>
          </tr>`;
        }).join('')}
      </tbody>
    `;
    wrapper.appendChild(table);
    return wrapper;
  }

  #buildGrid(rows) {
    const grid = document.createElement('quadrant-grid');
    grid.setAttribute('x-label', 'Likelihood');
    grid.setAttribute('y-label', 'Impact');
    grid.setAttribute('x-low', 'Rare');
    grid.setAttribute('x-high', 'Likely');
    grid.setAttribute('y-low', 'Minor');
    grid.setAttribute('y-high', 'Severe');
    grid.setAttribute('q1-label', 'Avoid');
    grid.setAttribute('q2-label', 'Plan');
    grid.setAttribute('q3-label', 'Accept');
    grid.setAttribute('q4-label', 'Mitigate');

    for (const r of rows) {
      if (!r.likelihood || !r.impact) continue;
      const dot = document.createElement('span');
      dot.setAttribute('data-x', toUnit(r.likelihood).toFixed(3));
      dot.setAttribute('data-y', toUnit(r.impact).toFixed(3));
      dot.setAttribute('data-quadrant', String(quadrantFor(r.likelihood, r.impact)));
      dot.setAttribute('data-id', r.id);
      dot.setAttribute('title', `${r.title} — likelihood ${r.likelihood}, impact ${r.impact}, severity ${r.likelihood * r.impact}`);
      dot.textContent = r.title;
      grid.appendChild(dot);
    }
    return grid;
  }

  /** @type {Array<{id:string,title:string,likelihood:number,impact:number,owner:string,mitigation:string}>} */
  #rows = [];

  get rows() { return [...this.#rows]; }

  set rows(value) {
    this.#render(Array.isArray(value) ? value : []);
  }
}

registerComponent('risk-register', RiskRegister);

export { RiskRegister };
