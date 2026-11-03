/**
 * Interrupted view transitions must not surface as uncaught exceptions.
 *
 * Components re-render through src/lib/vb-view-transition.js. The browser
 * skips or aborts a transition when another one starts or the viewport
 * resizes mid-transition, which rejects the transition's promises. Before the
 * fix those rejections were unhandled ("Transition was skipped…" /
 * "Transition was aborted… Viewport size changed"), first seen on CI.
 */
import { test, expect } from '@playwright/test';

const CASES = [
  ['user-journey', 'demos/user-journey-basic/', (el) => el.toggleAttribute('compact')],
  ['empathy-map', 'demos/empathy-map-basic/', (el) => el.toggleAttribute('compact')],
  ['gantt-chart', 'demos/gantt-chart-basic/', (el) => el.toggleAttribute('compact')],
];

for (const [tag, path, mutate] of CASES) {
  test(`${tag}: back-to-back re-renders during viewport resizes raise no uncaught errors`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(path, { waitUntil: 'networkidle' });
    await page.waitForSelector(`${tag}[data-upgraded]`);
    for (let i = 0; i < 6; i++) {
      await page.evaluate(([t, fn]) => {
        const el = document.querySelector(t);
        // eslint-disable-next-line no-new-func
        new Function('el', `(${fn})(el)`)(el);
      }, [tag, mutate.toString()]);
      await page.setViewportSize({ width: i % 2 ? 1280 : 390, height: 800 });
      await page.waitForTimeout(120);
    }
    await page.waitForTimeout(400);
    expect(errors).toEqual([]);
  });
}
