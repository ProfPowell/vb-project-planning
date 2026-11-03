/**
 * burndown-chart: Sprint burndown plot
 *
 * Thin composing preset that wraps <chart-wc type="line"> with two
 * series: an `Actual` series from the author's daily remaining counts
 * and an `Ideal` series the component computes from start/end/total.
 *
 * Replaces the boilerplate of hand-computing the ideal trend line and
 * formatting two parallel data series. Authors supply only the daily
 * actuals (and optional scope-change deltas) — the ideal slope is
 * mechanical.
 *
 * Data source: a <template> child whose <tr> rows are
 *   <tr><td>YYYY-MM-DD</td><td>remaining</td></tr>
 *   <tr><td>YYYY-MM-DD</td><td>remaining</td><td>±N</td></tr>
 * The optional 3rd cell is a scope-change delta on that day; the
 * component renders an inline annotation note (no chart marker primitive
 * exists in chart-wc yet, so we surface scope changes via a captioned
 * list under the chart).
 *
 * @attr {string} start    - Sprint start date (ISO 8601, required)
 * @attr {string} end      - Sprint end date (ISO 8601, required, inclusive)
 * @attr {number} total    - Total points/items at sprint start (required)
 * @attr {string} unit     - Display unit, default "points"
 * @attr {string} label    - Optional heading text (e.g., "Sprint 14")
 * @attr {string} weekends - "include" (default) or "exclude" from ideal slope
 *
 * All six attributes are observed: changing any of them on a live element
 * re-renders the chart in place. Dates are calendar days in local time
 * (see src/lib/dates.js), so the day axis is stable across DST changes.
 *
 * @fires burndown-chart:ready - { dayCount, total, scopeChanges }
 */

import { registerComponent } from '../../lib/bundle-registry.js';
import { VBElement } from '../../lib/vb-element.js';
import { parseISODate, toISODate, enumerateDays } from '../../lib/dates.js';
import { headingLevelFor } from '../../lib/headings.js';

class BurndownChart extends VBElement {
  static get observedAttributes() {
    return ['start', 'end', 'total', 'unit', 'label', 'weekends', 'heading-level'];
  }

  /** True between connectedCallback and disconnectedCallback. */
  #live = false;

  connectedCallback() {
    this.#live = true;
    super.connectedCallback();
  }

  disconnectedCallback() {
    this.#live = false;
    super.disconnectedCallback();
  }

  attributeChangedCallback(_name, oldValue, newValue) {
    if (oldValue === newValue || !this.#live) return;
    if (this.hasAttribute('data-upgraded')) {
      /* Live re-render. If the new config is invalid, drop the stale chart
         rather than leave it showing the old range. */
      if (!this.#renderFromAttributes()) this.#clearRendered();
    } else {
      /* An earlier upgrade was refused (e.g. total missing): retry now. */
      super.connectedCallback();
    }
  }

  setup() {
    if (!this.#renderFromAttributes()) return false;
    const { dayCount, total, scopeChanges } = this.#lastRender;
    queueMicrotask(() => {
      this.dispatchEvent(new CustomEvent('burndown-chart:ready', {
        bubbles: true,
        detail: { dayCount, total, scopeChanges },
      }));
    });
    return true;
  }

  /** @type {{ dayCount: number, total: number, scopeChanges: number }} */
  #lastRender = { dayCount: 0, total: 0, scopeChanges: 0 };

  #clearRendered() {
    [...this.children].forEach((c) => { if (c.tagName !== 'TEMPLATE') c.remove(); });
  }

  /** Read attributes + template and render. Returns false when the config is invalid. */
  #renderFromAttributes() {
    const start = this.getAttribute('start');
    const end = this.getAttribute('end');
    const total = parseFloat(this.getAttribute('total') || '');

    if (!start || !end || !Number.isFinite(total)) {
      console.warn('burndown-chart: requires start, end, and total attributes');
      return false;
    }

    const startDate = parseISODate(start);
    const endDate = parseISODate(end);
    if (!startDate || !endDate || endDate < startDate) {
      console.warn('burndown-chart: start/end dates invalid', start, end);
      return false;
    }

    const includeWeekends = (this.getAttribute('weekends') || 'include') !== 'exclude';
    const unit = this.getAttribute('unit') || 'points';
    const label = this.getAttribute('label') || '';

    const tmpl = this.querySelector(':scope > template');
    const samples = tmpl ? BurndownChart.#parseTemplate(tmpl) : [];
    const scopeChanges = samples.filter((s) => s.delta !== 0);

    const dayLabels = enumerateDays(startDate, endDate);
    const ideal = BurndownChart.#idealSeries(dayLabels, total, includeWeekends);
    const actual = BurndownChart.#actualSeries(dayLabels, samples);

    this.#render({ label, unit, dayLabels, actual, ideal, scopeChanges });
    this.#lastRender = { dayCount: dayLabels.length, total, scopeChanges: scopeChanges.length };
    return true;
  }

  #render({ label, unit, dayLabels, actual, ideal, scopeChanges }) {
    this.#clearRendered();

    if (label) {
      const h = document.createElement('header');
      h.className = 'bdc-label';
      h.textContent = label;
      this.appendChild(h);
    }

    const chart = document.createElement('chart-wc');
    chart.setAttribute('data-type', 'line');
    chart.setAttribute('data-legend', '');
    chart.setAttribute('data-tooltip', '');
    chart.setAttribute('data-label-x', 'Day');
    chart.setAttribute('data-label-y', unit);

    const idealValues = {};
    const actualValues = {};
    dayLabels.forEach((d, i) => {
      idealValues[d] = ideal[i];
      if (actual[i] !== null) actualValues[d] = actual[i];
    });

    const payload = [
      { name: 'Actual', values: actualValues },
      { name: 'Ideal',  values: idealValues },
    ];
    chart.setAttribute('data-values', JSON.stringify(payload));
    this.appendChild(chart);

    if (scopeChanges.length) {
      const notes = document.createElement('aside');
      notes.className = 'bdc-scope-changes';
      const heading = document.createElement(`h${headingLevelFor(this, 'burndown-chart')}`);
      heading.className = 'bdc-scope-heading';
      heading.textContent = 'Scope changes';
      notes.appendChild(heading);
      const list = document.createElement('ul');
      for (const change of scopeChanges) {
        /* Built with textContent: template cells and the unit attribute are
           author data and must never be parsed as markup. */
        const li = document.createElement('li');
        const sign = change.delta > 0 ? '+' : '';
        const time = document.createElement('time');
        time.setAttribute('datetime', change.date);
        time.textContent = change.date;
        const strong = document.createElement('strong');
        strong.textContent = `${sign}${change.delta} ${unit}`;
        li.append(time, ': ', strong);
        list.appendChild(li);
      }
      notes.appendChild(list);
      this.appendChild(notes);
    }
  }

  static #parseTemplate(tmpl) {
    const out = [];
    const trs = tmpl.content.querySelectorAll('tr');
    for (const tr of trs) {
      const cells = [...tr.children];
      const raw = cells[0]?.textContent?.trim();
      const remaining = parseFloat(cells[1]?.textContent ?? '');
      const delta = parseFloat(cells[2]?.textContent ?? '0') || 0;
      if (!raw || !Number.isFinite(remaining)) continue;
      /* Normalise YYYY-MM-DD[Thh:mm…] to YYYY-MM-DD so samples key against
         the day axis. Anything else is kept verbatim (shown, never plotted);
         Date's lenient fallback parsing would invent dates from junk. */
      const parsed = /^\d{4}-\d{2}-\d{2}/.test(raw) ? parseISODate(raw) : null;
      const date = parsed ? toISODate(parsed) : raw;
      out.push({ date, remaining, delta });
    }
    return out;
  }

  static #idealSeries(dayLabels, total, includeWeekends) {
    const isWeekend = (label) => {
      const d = parseISODate(label);
      if (!d) return false;
      const w = d.getDay();
      return w === 0 || w === 6;
    };
    const workingIndices = dayLabels
      .map((d, i) => ({ d, i, weekend: isWeekend(d) }))
      .filter((entry) => includeWeekends || !entry.weekend);
    const decrement = workingIndices.length > 1 ? total / (workingIndices.length - 1) : 0;
    const out = new Array(dayLabels.length).fill(null);
    let lastIdeal = total;
    let workingSeen = 0;
    for (let i = 0; i < dayLabels.length; i++) {
      const isWeekendDay = isWeekend(dayLabels[i]);
      if (includeWeekends || !isWeekendDay) {
        out[i] = Math.max(0, total - decrement * workingSeen);
        workingSeen++;
        lastIdeal = out[i];
      } else {
        /* Weekend in exclude mode: hold previous ideal flat. */
        out[i] = lastIdeal;
      }
    }
    return out;
  }

  static #actualSeries(dayLabels, samples) {
    const byDate = new Map(samples.map((s) => [s.date, s.remaining]));
    return dayLabels.map((d) => (byDate.has(d) ? byDate.get(d) : null));
  }
}

registerComponent('burndown-chart', BurndownChart);

export { BurndownChart };
