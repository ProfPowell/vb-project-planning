/**
 * Accessibility audit (axe-core) for the record cards: user-persona,
 * user-story, user-journey, empathy-map, work-item and adr-wc.
 *
 * Runs the colour-contrast and ARIA-validity rules against every demo page
 * that shows one of these components, in the light and the dark theme,
 * scoped to the components themselves (the surrounding demo chrome is not
 * this pack's concern). Demo HTML comes from the committed docs/ build, so
 * older pages may still carry legacy markup such as
 * `<user-persona role="Product Manager">`; the components must repair that
 * at upgrade time and still pass.
 */

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const COMPONENTS = ['user-persona', 'user-story', 'user-journey', 'empathy-map', 'work-item', 'adr-wc'];
const RULES = ['color-contrast', 'aria-roles', 'aria-allowed-attr', 'aria-valid-attr-value'];

const PAGES = [
  'user-persona-basic', 'user-persona-compact', 'user-persona-mock', 'user-persona-stories',
  'user-story-basic', 'user-story-expand', 'user-story-variants',
  'user-journey-basic', 'user-journey-compact',
  'empathy-map-basic', 'empathy-map-editable',
  'work-item-basic',
  'adr-wc-basic',
  'ux-planning-connected', 'ux-planning-complete',
];

/** Short, readable summary of axe violations for the assertion message. */
function summarize(violations) {
  return violations.flatMap((v) => v.nodes.map((n) =>
    `${v.id}: ${n.target.join(' > ')} — ${(n.failureSummary || '').split('\n').slice(1).join(' ').trim()}`));
}

for (const mode of ['light', 'dark']) {
  test.describe(`record cards a11y (${mode})`, () => {
    for (const demo of PAGES) {
      test(`${demo}: no contrast / ARIA violations`, async ({ page }) => {
        await page.goto(`demos/${demo}/`);
        await page.evaluate((m) => { document.documentElement.dataset.mode = m; }, mode);
        const present = await page.evaluate((tags) => tags.filter((t) => document.querySelector(t)), COMPONENTS);
        expect(present.length, 'demo shows at least one record card').toBeGreaterThan(0);
        await page.waitForFunction((tags) =>
          tags.every((t) => [...document.querySelectorAll(t)].every((el) => el.hasAttribute('data-upgraded'))), present);
        // Let fonts, images and transitions settle so contrast is measured on final colours.
        await page.evaluate(() => document.fonts?.ready);
        await page.waitForTimeout(150);

        let builder = new AxeBuilder({ page }).withRules(RULES);
        for (const tag of present) builder = builder.include(tag);
        const { violations } = await builder.analyze();
        expect(summarize(violations)).toEqual([]);
      });
    }
  });
}
