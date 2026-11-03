/**
 * risk-register — 0.2.2 regressions: severity and quadrant placement.
 *
 * - Severity is L × I only. It used to be <data-table>'s
 *   data-rollup="product", which multiplies every numeric-looking cell in
 *   the row, so "2FA rollout" doubled and "3 vendor quotes" tripled it.
 * - A row missing L or I has an empty severity (not 0 / NaN).
 * - Scores map to (v-1)/(SCALE-1); the midpoint (3) counts as low, so the
 *   doc's "Vendor delay 4,3" lands in Mitigate, not Avoid.
 */

import { test, expect } from '@playwright/test';

const demoPage = 'demos/risk-register-basic/';

async function mount(page, rowsHtml) {
  await page.goto(demoPage);
  await page.waitForSelector('risk-register[data-upgraded]');
  await page.evaluate((html) => new Promise((resolve) => {
    const rr = document.createElement('risk-register');
    rr.id = 'under-test';
    rr.innerHTML = `<template>${html}</template>`;
    rr.addEventListener('risk-register:ready', () => resolve(), { once: true });
    document.body.appendChild(rr);
  }), rowsHtml);
  // Let the vendored <data-table> upgrade (sorting, heatmap).
  await page.waitForSelector('#under-test data-table[data-upgraded]');
}

test.describe('risk-register (0.2.2 fixes)', () => {

  test('severity is likelihood × impact even when other cells contain numbers', async ({ page }) => {
    await mount(page, `
      <tr data-id="twofa"><td>2FA rollout</td><td>4</td><td>3</td><td>Sec</td><td>3 vendor quotes</td></tr>
      <tr data-id="v2"><td>Migrate to v2</td><td>2</td><td>5</td><td>2 engineers</td><td>Phase 1 of 4</td></tr>
      <tr data-id="nol"><td>Unscored 9</td><td></td><td>4</td><td></td><td></td></tr>
      <tr data-id="noi"><td>Half scored</td><td>3</td><td>n/a</td><td></td><td></td></tr>
    `);

    const cells = await page.evaluate(() =>
      [...document.querySelectorAll('#under-test tbody tr')].map(tr => [
        tr.getAttribute('data-id'),
        tr.children[3].textContent,
        tr.children[3].getAttribute('data-sort-value'),
      ])
    );
    expect(cells).toEqual([
      ['twofa', '12', '12'],
      ['v2', '10', '10'],
      ['nol', '', null],
      ['noi', '', null],
    ]);
  });

  test('sorting by Severity orders by L × I', async ({ page }) => {
    await mount(page, `
      <tr data-id="a"><td>2FA rollout</td><td>4</td><td>3</td><td></td><td>3 vendor quotes</td></tr>
      <tr data-id="b"><td>Big</td><td>5</td><td>5</td><td></td><td></td></tr>
      <tr data-id="c"><td>Small</td><td>1</td><td>2</td><td></td><td></td></tr>
    `);
    await page.locator('#under-test thead th', { hasText: 'Severity' }).click();
    const order = await page.evaluate(() =>
      [...document.querySelectorAll('#under-test tbody tr')].map(tr => Number(tr.children[3].textContent)));
    const asc = [2, 12, 25];
    expect([asc, [...asc].reverse()]).toContainEqual(order);
  });

  test('quadrant placement: (v-1)/(SCALE-1) and the midpoint counts as low', async ({ page }) => {
    await mount(page, `
      <tr data-id="vendor-delay"><td>Vendor delay</td><td>4</td><td>3</td></tr>
      <tr data-id="data-breach"><td>Data breach</td><td>2</td><td>5</td></tr>
      <tr data-id="mid"><td>Middling</td><td>3</td><td>3</td></tr>
      <tr data-id="worst"><td>Worst</td><td>5</td><td>5</td></tr>
      <tr data-id="least"><td>Least</td><td>1</td><td>1</td></tr>
    `);

    const dots = await page.evaluate(() => {
      const rr = document.querySelector('#under-test');
      const labels = ['Avoid', 'Plan', 'Accept', 'Mitigate'];
      const out = {};
      for (const d of rr.querySelectorAll('quadrant-grid span[data-id]')) {
        out[d.dataset.id] = { x: d.dataset.x, y: d.dataset.y, quadrant: labels[Number(d.dataset.quadrant)] };
      }
      return out;
    });

    expect(dots).toEqual({
      'vendor-delay': { x: '0.750', y: '0.500', quadrant: 'Mitigate' },
      'data-breach':  { x: '0.250', y: '1.000', quadrant: 'Plan' },
      mid:            { x: '0.500', y: '0.500', quadrant: 'Accept' },
      worst:          { x: '1.000', y: '1.000', quadrant: 'Avoid' },
      least:          { x: '0.000', y: '0.000', quadrant: 'Accept' },
    });
  });
});
