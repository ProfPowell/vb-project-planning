/**
 * Components that render their own headings must fit the page outline, and
 * requirement-card must meet WCAG AA contrast. Found by a whole-site axe
 * audit after the 0.3.0 merges (src/lib/headings.js).
 */
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const summarize = (violations) => violations.map((v) =>
  `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);

const OUTLINE_PAGES = [
  ['demos/ux-planning-connected/', 'user-story'],   // compact stories under an <h2>
  ['demos/story-map-basic/', 'story-map'],          // activities under the page <h1>
  ['demos/burndown-chart-basic/', 'burndown-chart'], // "Scope changes" heading
];

for (const [path, tag] of OUTLINE_PAGES) {
  test(`${tag} headings never skip a level on ${path}`, async ({ page }) => {
    await page.goto(path, { waitUntil: 'networkidle' });
    await page.waitForSelector(`${tag}[data-upgraded]`);
    const { violations } = await new AxeBuilder({ page }).withRules(['heading-order']).analyze();
    expect(summarize(violations)).toEqual([]);
  });
}

test('heading-level overrides the outline level on user-story, story-map and burndown-chart', async ({ page }) => {
  await page.goto('demos/ux-planning-connected/', { waitUntil: 'networkidle' });
  const story = page.locator('user-story[detail="compact"], user-story[compact]').first();
  await story.evaluate((el) => el.setAttribute('heading-level', '5'));
  const levels = await story.evaluate((el) =>
    [...new Set([...el.shadowRoot.querySelectorAll('.section-title')].map((h) => h.localName))]);
  expect(levels.every((l) => l === 'h5')).toBe(true);

  await page.goto('demos/story-map-basic/', { waitUntil: 'networkidle' });
  await page.waitForSelector('story-map[data-upgraded]');
  const map = await page.evaluate(() => {
    const el = document.querySelector('story-map');
    el.setAttribute('heading-level', '4');
    return [...new Set([...el.querySelectorAll('.sm-activity-heading')].map((h) => h.localName))];
  });
  expect(map).toEqual(['h4']);

  await page.goto('demos/burndown-chart-basic/', { waitUntil: 'networkidle' });
  await page.waitForSelector('burndown-chart[data-upgraded]');
  const burn = await page.evaluate(() => {
    const el = [...document.querySelectorAll('burndown-chart')].find((b) => b.querySelector('.bdc-scope-heading'));
    el.setAttribute('heading-level', '5');
    return el.querySelector('.bdc-scope-heading')?.localName;
  });
  expect(burn).toBe('h5');
});

for (const mode of ['light', 'dark']) {
  test(`requirement-card meets AA contrast (${mode})`, async ({ page }) => {
    await page.goto('demos/requirement-card-basic/', { waitUntil: 'networkidle' });
    await page.evaluate((m) => { document.documentElement.dataset.mode = m; }, mode);
    await page.waitForTimeout(100);
    const { violations } = await new AxeBuilder({ page })
      .include('requirement-card')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(summarize(violations)).toEqual([]);
  });
}
