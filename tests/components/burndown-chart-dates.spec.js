/**
 * burndown-chart — calendar-day axis, text-only scope notes, live attributes
 *
 * 0.2.2 regressions: days were built by adding 86 400 000 ms, so across a
 * DST change a label repeated and the last day (and its sample) dropped;
 * scope-change notes were built with innerHTML from template text and the
 * `unit` attribute; attribute changes on a live element did nothing.
 */

import { test, expect } from '@playwright/test';

test.use({ timezoneId: 'America/Los_Angeles' });

const demoPage = 'demos/burndown-chart-basic/';

function series(el) {
  const chart = el.querySelector(':scope > chart-wc');
  return Object.fromEntries(JSON.parse(chart.getAttribute('data-values')).map((s) => [s.name, s.values]));
}

test.describe('burndown-chart — dates and safety', () => {

  test('a sprint across the US DST change has every day exactly once', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector('burndown-chart[data-upgraded]');

    const state = await page.evaluate((seriesSrc) => {
      const series = new Function(`return (${seriesSrc})`)();
      const el = document.createElement('burndown-chart');
      el.setAttribute('start', '2026-10-30');
      el.setAttribute('end', '2026-11-06');
      el.setAttribute('total', '16');
      el.innerHTML = `<template>
        <tr><td>2026-10-30</td><td>16</td></tr>
        <tr><td>2026-11-01</td><td>12</td></tr>
        <tr><td>2026-11-06</td><td>0</td></tr>
      </template>`;
      document.body.appendChild(el);
      const s = series(el);
      return { idealDays: Object.keys(s.Ideal), actual: s.Actual, tz: Intl.DateTimeFormat().resolvedOptions().timeZone };
    }, series.toString());

    expect(state.tz).toBe('America/Los_Angeles');
    expect(state.idealDays).toEqual([
      '2026-10-30', '2026-10-31', '2026-11-01', '2026-11-02',
      '2026-11-03', '2026-11-04', '2026-11-05', '2026-11-06',
    ]);
    expect(state.actual).toEqual({ '2026-10-30': 16, '2026-11-01': 12, '2026-11-06': 0 });
  });

  test('template cells and the unit attribute render as text, never markup', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector('burndown-chart[data-upgraded]');

    const state = await page.evaluate(() => {
      window.__pwned = 0;
      const el = document.createElement('burndown-chart');
      el.setAttribute('start', '2026-06-01');
      el.setAttribute('end', '2026-06-05');
      el.setAttribute('total', '10');
      el.setAttribute('unit', '<b onmouseover="window.__pwned=2">pts</b>');
      el.innerHTML = `<template>
        <tr><td>2026-06-02</td><td>8</td><td>+2</td></tr>
        <tr><td>&lt;img src=x onerror="window.__pwned=1"&gt;</td><td>5</td><td>-1</td></tr>
      </template>`;
      document.body.appendChild(el);
      const aside = el.querySelector('aside.bdc-scope-changes');
      return {
        injected: aside.querySelectorAll('img, b').length,
        items: [...aside.querySelectorAll('li')].map((li) => li.textContent),
      };
    });
    await page.waitForTimeout(50);   // give an onerror handler time to run

    expect(state.injected).toBe(0);
    expect(await page.evaluate(() => window.__pwned)).toBe(0);
    expect(state.items).toEqual([
      '2026-06-02: +2 <b onmouseover="window.__pwned=2">pts</b>',
      '<img src=x onerror="window.__pwned=1">: -1 <b onmouseover="window.__pwned=2">pts</b>',
    ]);
  });

  test('changing start / end / total / unit / label on a live element re-renders', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector('burndown-chart[data-upgraded]');

    const state = await page.evaluate((seriesSrc) => {
      const series = new Function(`return (${seriesSrc})`)();
      const el = document.querySelector('burndown-chart');
      el.setAttribute('total', '84');
      const afterTotal = series(el).Ideal['2026-05-04'];
      el.setAttribute('end', '2026-05-08');
      const afterEnd = Object.keys(series(el).Ideal);
      el.setAttribute('unit', 'hours');
      el.setAttribute('label', 'Renamed');
      return {
        afterTotal,
        afterEnd,
        labelY: el.querySelector(':scope > chart-wc').getAttribute('data-label-y'),
        labels: [...el.querySelectorAll(':scope > header.bdc-label')].map((h) => h.textContent),
        charts: el.querySelectorAll(':scope > chart-wc').length,
      };
    }, series.toString());

    expect(state.afterTotal).toBe(84);
    expect(state.afterEnd).toEqual(['2026-05-04', '2026-05-05', '2026-05-06', '2026-05-07', '2026-05-08']);
    expect(state.labelY).toBe('hours');
    expect(state.labels).toEqual(['Renamed']);
    expect(state.charts).toBe(1);
  });

  test('a refused upgrade retries when the missing attribute arrives; invalid config clears the chart', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector('burndown-chart[data-upgraded]');

    const state = await page.evaluate(() => {
      const el = document.createElement('burndown-chart');
      el.setAttribute('start', '2026-06-01');
      el.setAttribute('end', '2026-06-05');
      document.body.appendChild(el);
      const before = el.hasAttribute('data-upgraded');
      el.setAttribute('total', '10');
      const after = el.hasAttribute('data-upgraded');
      const chartAfter = !!el.querySelector('chart-wc');
      el.setAttribute('end', '2026-05-01');   // before start → invalid
      return { before, after, chartAfter, chartWhenInvalid: !!el.querySelector('chart-wc') };
    });
    expect(state).toEqual({ before: false, after: true, chartAfter: true, chartWhenInvalid: false });
  });
});
