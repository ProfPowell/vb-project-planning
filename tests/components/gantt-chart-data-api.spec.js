/**
 * gantt-chart — Data API
 *
 * Verifies the .tasks property accepts ISO date strings, replaces the
 * chart contents, and emits a tagged event.
 *
 * Ported from vanilla-breeze core; navigates to this pack's demo page
 * where the live, HTML-first `<gantt-chart>` upgrades.
 */

import { test, expect } from '@playwright/test';

const demoPage = 'demos/gantt-chart-basic/';

test.describe('gantt-chart — data API', () => {

  test('exposes .tasks after HTML-first parse', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector('gantt-chart[data-upgraded]');

    const initial = await page.evaluate(() => {
      const g = document.querySelector('gantt-chart');
      return {
        count: g.tasks.length,
        firstHasName: !!g.tasks[0]?.name,
        firstHasRange: typeof g.tasks[0]?.start === 'number' && typeof g.tasks[0]?.end === 'number',
      };
    });

    expect(initial.count).toBeGreaterThan(0);
    expect(initial.firstHasName).toBe(true);
    expect(initial.firstHasRange).toBe(true);
  });

  test('.tasks setter replaces tasks and re-renders bars', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector('gantt-chart[data-upgraded]');

    const result = await page.evaluate(() => {
      const g = document.querySelector('gantt-chart');
      const fired = [];
      g.addEventListener('gantt-chart:tasks-changed', (e) => {
        fired.push({ source: e.detail.source, count: e.detail.tasks.length });
      });

      g.tasks = [
        { id: 'X1', name: 'Spike',   start: '2026-04-01', end: '2026-04-05' },
        { id: 'X2', name: 'Build',   start: '2026-04-05', end: '2026-04-15', progress: 0.4 },
        { id: 'X3', name: 'Release', start: '2026-04-16', end: '2026-04-16', milestone: true },
      ];

      const taskEls = [...g.querySelectorAll('.gc-task-list, .gc-bars')];
      return {
        fired,
        taskCount: g.tasks.length,
        taskNames: g.tasks.map(t => t.name),
        renderedSomething: taskEls.length > 0,
      };
    });

    expect(result.fired).toEqual([{ source: 'property', count: 3 }]);
    expect(result.taskCount).toBe(3);
    expect(result.taskNames).toEqual(['Spike', 'Build', 'Release']);
    expect(result.renderedSomething).toBe(true);
  });

  // Regression: dependency arrows were emitting SVG path `d` coordinates with a
  // `%` unit (invalid — path data is unitless), so no arrow rendered. They now
  // map percentage-x / pixel-y through a non-uniform viewBox with plain numbers.
  test('draws valid dependency-arrow paths (no % units in path data)', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector('gantt-chart[data-upgraded]');

    const arrows = await page.evaluate(() => {
      const svg = document.querySelector('gantt-chart svg.gc-deps');
      const paths = [...(svg?.querySelectorAll('path.gc-dep-line') || [])];
      let valid = 0;
      for (const p of paths) { try { if (p.getTotalLength() > 0) valid++; } catch { /* invalid path */ } }
      return {
        viewBox: svg?.getAttribute('viewBox') ?? null,
        count: paths.length,
        withPercent: paths.filter((p) => (p.getAttribute('d') || '').includes('%')).length,
        geometricallyValid: valid,
      };
    });

    expect(arrows.count).toBeGreaterThan(0);          // the demo has dependencies
    expect(arrows.withPercent).toBe(0);               // no `%` in any path `d`
    expect(arrows.geometricallyValid).toBe(arrows.count); // every path is a real curve
    expect(arrows.viewBox).toMatch(/^0 0 100 \d+$/);  // non-uniform viewBox in place
  });
});
