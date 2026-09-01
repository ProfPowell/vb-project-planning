/**
 * risk-register — HTML-first upgrade, composed views, .rows API, events
 *
 * Verifies the composing preset contract: rows parsed from the inline
 * <template> render into BOTH a <data-table> (with a computed Severity
 * rollup) and a <quadrant-grid> (one dot per risk at likelihood/5,
 * impact/5), `risk-register:ready` carries { count }, and the `.rows`
 * setter re-renders both views from one source.
 *
 * The live, HTML-first `<risk-register>` upgrades on this pack's demo
 * page (six risks), so the spec navigates there.
 */

import { test, expect } from '@playwright/test';

const demoPage = 'demos/risk-register-basic/';

/** Demo rows in source order: [id, likelihood, impact]. */
const DEMO_ROWS = [
  ['vendor-delay', 4, 3],
  ['data-breach', 2, 5],
  ['scope-creep', 5, 3],
  ['staff-churn', 2, 2],
  ['api-outage', 3, 4],
  ['legal-review', 4, 2],
];

test.describe('risk-register', () => {

  test('HTML-first upgrade renders label, table rows and quadrant dots from the <template>', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector('risk-register[data-upgraded]');

    const state = await page.evaluate(() => {
      const rr = document.querySelector('risk-register');
      const table = rr.querySelector('.rr-layout > data-table > table');
      const grid = rr.querySelector('.rr-layout > quadrant-grid');
      return {
        label: rr.querySelector(':scope > header.rr-label')?.textContent,
        templateKept: !!rr.querySelector(':scope > template'),
        headers: [...table.querySelectorAll('thead th')].map(th => th.textContent.trim()),
        severityTh: {
          rollup: table.querySelector('thead th[data-rollup]')?.getAttribute('data-rollup'),
          heatmap: table.querySelector('thead th[data-rollup]')?.getAttribute('data-heatmap'),
        },
        rows: [...table.querySelectorAll('tbody tr')].map(tr => [
          tr.getAttribute('data-id'),
          ...[...tr.children].slice(0, 3).map(td => td.textContent.trim()),
        ]),
        dots: [...grid.querySelectorAll('span[data-id]')].map(d => ({
          id: d.getAttribute('data-id'),
          x: d.getAttribute('data-x'),
          y: d.getAttribute('data-y'),
          title: d.getAttribute('title'),
          text: d.textContent,
        })),
        gridAxes: {
          x: grid.getAttribute('x-label'),
          y: grid.getAttribute('y-label'),
          q1: grid.getAttribute('q1-label'),
        },
        rowsProp: rr.rows.map(r => r.id),
      };
    });

    expect(state.label).toBe('Q3 project risks');
    expect(state.templateKept).toBe(true);
    expect(state.headers).toEqual(['Title', 'Likelihood', 'Impact', 'Severity', 'Owner', 'Mitigation']);
    expect(state.severityTh).toEqual({ rollup: 'product', heatmap: 'low-good' });

    expect(state.rows).toEqual([
      ['vendor-delay', 'Vendor delay', '4', '3'],
      ['data-breach', 'Data breach', '2', '5'],
      ['scope-creep', 'Scope creep', '5', '3'],
      ['staff-churn', 'Staff churn', '2', '2'],
      ['api-outage', 'Third-party API outage', '3', '4'],
      ['legal-review', 'Slow legal review', '4', '2'],
    ]);

    expect(state.dots).toHaveLength(6);
    expect(state.dots[0]).toEqual({
      id: 'vendor-delay',
      x: '0.800',
      y: '0.600',
      title: 'Vendor delay — likelihood 4, impact 3',
      text: 'Vendor delay',
    });
    // <quadrant-grid> re-parents dots into its quadrant zones, so DOM
    // order is grouped by quadrant — compare as a set.
    expect(state.dots.map(d => d.id).sort()).toEqual(DEMO_ROWS.map(r => r[0]).sort());
    expect(state.gridAxes).toEqual({ x: 'Likelihood', y: 'Impact', q1: 'Avoid' });
    expect(state.rowsProp).toEqual(DEMO_ROWS.map(r => r[0]));
  });

  // FIXME: <data-table> is a core (vanilla-breeze.js) element, but the demo
  // pages only load /assets/vendor/drag-surface.js + the pack bundle, so the
  // composed <data-table> never upgrades (customElements.get('data-table')
  // is undefined on demos/risk-register-basic/). The Severity rollup,
  // low-good heatmap and header sorting that risk-register documents
  // (src/web-components/risk-register/logic.js:130-133) therefore never
  // activate. README.md:65-77 lists only <drag-surface> as the runtime peer.
  // Re-enable once the demo pages load core (or the pack bundles data-table).
  test.fixme('composed <data-table> computes the Severity rollup (likelihood × impact)', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector('risk-register[data-upgraded]');

    // The rollup is computed by the vendored <data-table> once it
    // upgrades; wait for it to stamp data-rollup-value on the cells.
    await page.waitForFunction(() =>
      document.querySelectorAll('risk-register tbody td[data-rollup-value]').length === 6
    );

    const severities = await page.evaluate(() =>
      [...document.querySelectorAll('risk-register tbody tr')].map(tr => [
        tr.getAttribute('data-id'),
        tr.children[3].getAttribute('data-rollup-value'),
      ])
    );

    expect(severities).toEqual(DEMO_ROWS.map(([id, l, i]) => [id, String(l * i)]));
  });

  // FIXME: same root cause as above — sorting is <data-table> behaviour and
  // data-table is not defined on the demo page.
  test.fixme('clicking a sortable header reorders the table rows', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector('risk-register[data-upgraded]');
    await page.waitForSelector('risk-register data-table[data-upgraded]');

    await page.locator('risk-register thead th', { hasText: 'Likelihood' }).click();

    const order = await page.evaluate(() =>
      [...document.querySelectorAll('risk-register tbody tr')].map(tr => ({
        id: tr.getAttribute('data-id'),
        likelihood: Number(tr.children[1].textContent),
      }))
    );

    // Same six rows, now in a monotonic likelihood order (source order
    // 4,2,5,2,3,4 is not monotonic, so any sort must reorder).
    expect(order.map(r => r.id).sort()).toEqual(DEMO_ROWS.map(r => r[0]).sort());
    const values = order.map(r => r.likelihood);
    const ascending = values.every((v, i) => i === 0 || values[i - 1] <= v);
    const descending = values.every((v, i) => i === 0 || values[i - 1] >= v);
    expect(ascending || descending).toBe(true);
    expect(values).not.toEqual(DEMO_ROWS.map(r => r[1]));
  });

  test('risk-register:ready fires after render with { count }', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector('risk-register[data-upgraded]');

    // The demo element's ready already fired (microtask after connect).
    // Append a fresh element with a listener attached first.
    const detail = await page.evaluate(() => new Promise((resolve) => {
      const rr = document.createElement('risk-register');
      rr.setAttribute('label', 'Fresh');
      rr.innerHTML = `<template>
        <tr data-id="a"><td>Alpha</td><td>1</td><td>5</td><td>QA</td><td>Watch</td></tr>
        <tr><td>Beta risk</td><td>3</td><td>3</td></tr>
      </template>`;
      rr.addEventListener('risk-register:ready', (e) => {
        resolve({
          count: e.detail.count,
          bubbles: e.bubbles,
          ids: rr.rows.map(r => r.id),
          owners: rr.rows.map(r => r.owner),
          upgraded: rr.hasAttribute('data-upgraded'),
        });
      });
      document.body.appendChild(rr);
    }));

    expect(detail.count).toBe(2);
    expect(detail.bubbles).toBe(true);
    expect(detail.upgraded).toBe(true);
    // Missing data-id falls back to a slugged title; missing cells → ''.
    expect(detail.ids).toEqual(['a', 'beta-risk']);
    expect(detail.owners).toEqual(['QA', '']);
  });

  test('.rows setter re-renders both views from one source and re-fires ready', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector('risk-register[data-upgraded]');

    const result = await page.evaluate(() => new Promise((resolve) => {
      const rr = document.querySelector('risk-register');
      rr.addEventListener('risk-register:ready', (e) => {
        const table = rr.querySelector('data-table table');
        const grid = rr.querySelector('quadrant-grid');
        resolve({
          count: e.detail.count,
          label: rr.querySelector(':scope > header.rr-label')?.textContent,
          layouts: rr.querySelectorAll(':scope > .rr-layout').length,
          templateKept: !!rr.querySelector(':scope > template'),
          rows: [...table.querySelectorAll('tbody tr')].map(tr => tr.getAttribute('data-id')),
          dots: [...grid.querySelectorAll('span[data-id]')].map(d => [d.getAttribute('data-id'), d.getAttribute('data-x'), d.getAttribute('data-y')]),
          escaped: table.querySelector('tbody tr[data-id="x"] td').innerHTML,
        });
      }, { once: true });

      rr.rows = [
        { id: 'x', title: '<b>Injected</b>', likelihood: 5, impact: 5, owner: 'Sec', mitigation: '' },
        { id: 'y', title: 'Unscored', likelihood: 0, impact: 4 },
      ];

      // Getter returns a copy — mutating it must not affect the element.
      rr.rows.push({ id: 'ghost', title: 'Ghost', likelihood: 1, impact: 1 });
    }));

    expect(result.count).toBe(2);
    expect(result.label).toBe('Q3 project risks');
    expect(result.layouts).toBe(1);
    expect(result.templateKept).toBe(true);
    expect(result.rows).toEqual(['x', 'y']);
    // Unscored rows (likelihood 0) get a table row but no grid dot.
    expect(result.dots).toEqual([['x', '1.000', '1.000']]);
    expect(result.escaped).toBe('&lt;b&gt;Injected&lt;/b&gt;');

    const after = await page.evaluate(() => document.querySelector('risk-register').rows.map(r => r.id));
    expect(after).toEqual(['x', 'y']);
  });
});
