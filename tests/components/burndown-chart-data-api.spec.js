/**
 * burndown-chart — Data API
 *
 * Verifies the HTML-first contract: <template> rows are parsed into an
 * `Actual` series, the `Ideal` series is computed from start/end/total
 * (with the `weekends` attribute controlling slope), scope-change deltas
 * render as an annotation list, and `burndown-chart:ready` fires with the
 * documented detail shape.
 *
 * The element composes Vanilla Breeze's <chart-wc>; these specs assert on
 * the payload the burndown element hands to chart-wc (its `data-values`
 * attribute) rather than chart-wc's own rendering. Navigates to this
 * pack's demo page where the live, HTML-first `<burndown-chart>` upgrades.
 */

import { test, expect } from '@playwright/test';

const demoPage = 'demos/burndown-chart-basic/';

test.describe('burndown-chart — data API', () => {

  test('HTML-first upgrade parses template rows and renders a chart-wc with Actual + Ideal series', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector('burndown-chart[data-upgraded]');
    // chart-wc is defined by the vendored charts add-on; wait for it to upgrade too.
    await page.waitForSelector('burndown-chart chart-wc[data-upgraded]');

    const state = await page.evaluate(() => {
      const el = document.querySelector('burndown-chart');
      const chart = el.querySelector(':scope > chart-wc');
      const payload = JSON.parse(chart.getAttribute('data-values'));
      const byName = Object.fromEntries(payload.map((s) => [s.name, s.values]));
      return {
        label: el.querySelector(':scope > header.bdc-label')?.textContent,
        templateKept: !!el.querySelector(':scope > template'),
        chartType: chart.getAttribute('data-type'),
        labelY: chart.getAttribute('data-label-y'),
        chartRendered: chart.children.length > 0,
        names: payload.map((s) => s.name),
        actualDays: Object.keys(byName.Actual),
        idealDays: Object.keys(byName.Ideal),
        actualFirst: byName.Actual['2026-05-04'],
        actualLast: byName.Actual['2026-05-15'],
        idealFirst: byName.Ideal['2026-05-04'],
        idealLast: byName.Ideal['2026-05-15'],
        idealDay2: byName.Ideal['2026-05-05'],
        scopeNotes: el.querySelectorAll(':scope > aside.bdc-scope-changes').length,
      };
    });

    expect(state.label).toBe('Sprint 14');
    expect(state.templateKept).toBe(true);
    expect(state.chartType).toBe('line');
    expect(state.labelY).toBe('points');           // default unit
    expect(state.chartRendered).toBe(true);
    expect(state.names).toEqual(['Actual', 'Ideal']);

    // Actual series carries only the authored sample days (10 rows, no weekend rows).
    expect(state.actualDays).toHaveLength(10);
    expect(state.actualDays).not.toContain('2026-05-09');
    expect(state.actualFirst).toBe(42);
    expect(state.actualLast).toBe(0);

    // Ideal series spans every calendar day in the sprint (May 4–15 inclusive = 12 days)
    // and burns 42 points linearly over 11 steps when weekends are included.
    expect(state.idealDays).toHaveLength(12);
    expect(state.idealDays[0]).toBe('2026-05-04');
    expect(state.idealDays[11]).toBe('2026-05-15');
    expect(state.idealFirst).toBe(42);
    expect(state.idealDay2).toBeCloseTo(42 - 42 / 11, 10);
    expect(state.idealLast).toBeCloseTo(0, 10);

    // First demo chart has no ±delta cells, so no scope-change annotations.
    expect(state.scopeNotes).toBe(0);
  });

  test('weekends="exclude" holds the ideal line flat over Sat/Sun and renders scope-change notes', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector('burndown-chart[data-upgraded]');

    // Second demo chart: total=30, weekends="exclude", two scope-change rows.
    const state = await page.evaluate(() => {
      const el = document.querySelectorAll('burndown-chart')[1];
      const chart = el.querySelector(':scope > chart-wc');
      const payload = JSON.parse(chart.getAttribute('data-values'));
      const ideal = payload.find((s) => s.name === 'Ideal').values;
      const notes = el.querySelector(':scope > aside.bdc-scope-changes');
      return {
        label: el.querySelector(':scope > header.bdc-label')?.textContent,
        fri: ideal['2026-05-08'],
        sat: ideal['2026-05-09'],
        sun: ideal['2026-05-10'],
        mon: ideal['2026-05-11'],
        first: ideal['2026-05-04'],
        last: ideal['2026-05-15'],
        notesHeading: notes?.querySelector('h4')?.textContent,
        noteItems: [...(notes?.querySelectorAll('li') ?? [])].map((li) => ({
          date: li.querySelector('time')?.getAttribute('datetime'),
          text: li.querySelector('strong')?.textContent,
        })),
      };
    });

    expect(state.label).toBe('Sprint 15');
    expect(state.first).toBe(30);
    expect(state.last).toBeCloseTo(0, 10);

    // 10 working days → 9 steps of 30/9. Friday is the 5th working day (4 steps in).
    const stepped = 30 - (30 / 9) * 4;
    expect(state.fri).toBeCloseTo(stepped, 10);
    expect(state.sat).toBeCloseTo(stepped, 10);   // weekend: held flat
    expect(state.sun).toBeCloseTo(stepped, 10);
    expect(state.mon).toBeCloseTo(30 - (30 / 9) * 5, 10);

    expect(state.notesHeading).toBe('Scope changes');
    expect(state.noteItems).toEqual([
      { date: '2026-05-07', text: '+5 points' },
      { date: '2026-05-13', text: '-2 points' },
    ]);
  });

  test('fires burndown-chart:ready with { dayCount, total, scopeChanges }', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector('burndown-chart[data-upgraded]');

    // The demo charts fire :ready before a listener can attach, so create a
    // fresh element, listen, then connect it.
    const detail = await page.evaluate(() => new Promise((resolve) => {
      const el = document.createElement('burndown-chart');
      el.setAttribute('start', '2026-06-01');
      el.setAttribute('end', '2026-06-05');
      el.setAttribute('total', '20');
      el.setAttribute('unit', 'items');
      el.innerHTML = `<template>
        <tr><td>2026-06-01</td><td>20</td></tr>
        <tr><td>2026-06-02</td><td>16</td><td>+3</td></tr>
        <tr><td>2026-06-03</td><td>12</td></tr>
        <tr><td>2026-06-04</td><td>bad-number</td></tr>
        <tr><td>2026-06-05</td><td>4</td><td>-1</td></tr>
      </template>`;
      el.addEventListener('burndown-chart:ready', (e) => {
        resolve({
          detail: e.detail,
          bubbles: e.bubbles,
          upgradedAtFire: el.hasAttribute('data-upgraded'),
          labelY: el.querySelector(':scope > chart-wc')?.getAttribute('data-label-y'),
          actualDays: Object.keys(JSON.parse(el.querySelector(':scope > chart-wc').getAttribute('data-values'))[0].values),
          noteTexts: [...el.querySelectorAll(':scope > aside.bdc-scope-changes strong')].map((s) => s.textContent),
        });
      });
      document.body.appendChild(el);
    }));

    expect(detail.detail).toEqual({ dayCount: 5, total: 20, scopeChanges: 2 });
    expect(detail.bubbles).toBe(true);
    expect(detail.upgradedAtFire).toBe(true);    // dispatched in a microtask after setup
    expect(detail.labelY).toBe('items');         // unit attribute flows to the chart axis
    expect(detail.actualDays).toEqual(['2026-06-01', '2026-06-02', '2026-06-03', '2026-06-05']); // non-numeric row skipped
    expect(detail.noteTexts).toEqual(['+3 items', '-1 items']);
  });

  test('re-reads attributes on reconnect (label / unit / weekends drive a fresh render)', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector('burndown-chart[data-upgraded]');

    const result = await page.evaluate(() => {
      const el = document.querySelector('burndown-chart');
      const readSeries = () => {
        const chart = el.querySelector(':scope > chart-wc');
        return JSON.parse(chart.getAttribute('data-values')).find((s) => s.name === 'Ideal').values;
      };
      const before = readSeries();

      el.setAttribute('label', 'Sprint 14 (revised)');
      el.setAttribute('unit', 'hours');
      el.setAttribute('weekends', 'exclude');

      // VBElement clears data-upgraded on disconnect and re-runs setup() on
      // connect, so a remove + re-insert is the documented re-render path.
      const parent = el.parentElement;
      const next = el.nextSibling;
      el.remove();
      const upgradedAfterRemove = el.hasAttribute('data-upgraded');
      parent.insertBefore(el, next);

      const after = readSeries();
      return {
        upgradedAfterRemove,
        upgradedAfterInsert: el.hasAttribute('data-upgraded'),
        label: el.querySelector(':scope > header.bdc-label')?.textContent,
        labelCount: el.querySelectorAll(':scope > header.bdc-label').length,
        chartCount: el.querySelectorAll(':scope > chart-wc').length,
        labelY: el.querySelector(':scope > chart-wc').getAttribute('data-label-y'),
        beforeSat: before['2026-05-09'],
        beforeFri: before['2026-05-08'],
        afterSat: after['2026-05-09'],
        afterFri: after['2026-05-08'],
      };
    });

    expect(result.upgradedAfterRemove).toBe(false);
    expect(result.upgradedAfterInsert).toBe(true);
    expect(result.label).toBe('Sprint 14 (revised)');
    expect(result.labelCount).toBe(1);     // old render is wiped, not duplicated
    expect(result.chartCount).toBe(1);
    expect(result.labelY).toBe('hours');
    expect(result.beforeSat).toBeLessThan(result.beforeFri);   // include: keeps burning through Saturday
    expect(result.afterSat).toBeCloseTo(result.afterFri, 10);  // exclude: flat over the weekend
  });

  test('refuses to upgrade without start / end / total', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector('burndown-chart[data-upgraded]');

    const warnings = [];
    page.on('console', (msg) => { if (msg.type() === 'warning') warnings.push(msg.text()); });

    const result = await page.evaluate(() => {
      const missingTotal = document.createElement('burndown-chart');
      missingTotal.setAttribute('start', '2026-06-01');
      missingTotal.setAttribute('end', '2026-06-05');
      document.body.appendChild(missingTotal);

      const reversed = document.createElement('burndown-chart');
      reversed.setAttribute('start', '2026-06-05');
      reversed.setAttribute('end', '2026-06-01');
      reversed.setAttribute('total', '10');
      document.body.appendChild(reversed);

      return {
        missingTotalUpgraded: missingTotal.hasAttribute('data-upgraded'),
        missingTotalChart: !!missingTotal.querySelector('chart-wc'),
        reversedUpgraded: reversed.hasAttribute('data-upgraded'),
        reversedChart: !!reversed.querySelector('chart-wc'),
      };
    });

    expect(result.missingTotalUpgraded).toBe(false);
    expect(result.missingTotalChart).toBe(false);
    expect(result.reversedUpgraded).toBe(false);
    expect(result.reversedChart).toBe(false);
    expect(warnings.some((w) => w.includes('burndown-chart: requires start, end, and total'))).toBe(true);
    expect(warnings.some((w) => w.includes('burndown-chart: start/end dates invalid'))).toBe(true);
  });
});
