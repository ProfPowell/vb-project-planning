/**
 * docs site accessibility — runs axe-core (WCAG 2.0/2.1/2.2 A + AA plus
 * best-practice rules) on every built page under docs/ and expects zero
 * violations in the site's OWN markup: layouts, includes, page chrome and the
 * page-authored structure of demo/showcase pages.
 *
 * The components themselves are deliberately out of scope here (they have their
 * own per-component a11y coverage), so their host elements are excluded:
 *   - the 20 planning components shipped by this package;
 *   - <chart-wc> (upstream vanilla-breeze): its SVG puts focusable points inside
 *     an aria-hidden subtree (aria-hidden-focus) — fix belongs upstream;
 *   - <browser-window> iframes (upstream @profpowell/browser-window): the iframe
 *     it renders in its shadow root has no title (frame-title) — fix belongs
 *     upstream. Excluding the frame also skips auditing demo pages a second time
 *     inside element pages; every demo is audited on its own below. Its 12px
 *     window-control buttons also fail target-size (same upstream package);
 *   - <drag-surface> (upstream vanilla-breeze): it forces role="list" over the
 *     authored role, appends a role="status" live region inside the list
 *     (aria-required-children) and gives <article> children role="listitem"
 *     (aria-allowed-role).
 *
 * Failures are reported grouped by rule, listing page + target for each node.
 */
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { globSync } from 'node:fs';

const MOUNT = '/vb-project-planning/';

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

/** This package's components — audited by their own specs, not this one. */
const COMPONENTS = [
  'adr-wc', 'burndown-chart', 'capacity-plan', 'empathy-map', 'gantt-chart', 'impact-effort',
  'iron-triangle', 'kanban-board', 'product-roadmap', 'quadrant-grid', 'quality-target',
  'requirement-card', 'review-surface', 'risk-register', 'story-map', 'traceability-matrix',
  'user-journey', 'user-persona', 'user-story', 'work-item',
];

/** Upstream issues tracked outside this repo (see header comment). */
const UPSTREAM = [
  'chart-wc',                                     // vanilla-breeze: aria-hidden-focus
  'drag-surface',                                 // vanilla-breeze: role=list + role=status child, listitem on <article>
  { fromShadowDom: ['browser-window', 'iframe'] }, // @profpowell/browser-window: frame-title
  { fromShadowDom: ['browser-window', '.browser-header'] }, // @profpowell/browser-window: 12px window-control buttons (target-size)
];

/**
 * Narrow, temporary allowances: [rule, page, predicate on the node target].
 * Unlabelled <code-block>s render role="region" named by their language
 * ("HTML"), so two on one page collide. Fix: give each a distinct label="…"
 * in the element doc page; then delete the entry.
 */
const ALLOW = [
  ...['burndown-chart', 'quadrant-grid', 'risk-register', 'traceability-matrix'].map((el) => [
    'landmark-unique', `${MOUNT}elements/${el}/`,
    (target) => JSON.stringify(target).includes('.code-container[role=\\"region\\"]'),
  ]),
];
const allowed = (rule, path, target) =>
  ALLOW.some(([r, p, match]) => r === rule && p === path && match(target));

/** Built pages, as mount-relative paths. */
const builtPages = () => globSync('docs/**/index.html')
  .map((p) => MOUNT + p.slice('docs/'.length, -'index.html'.length))
  .sort();

/**
 * Audit `pages` sequentially in one context; returns a report grouped by rule
 * ("rule (impact, n nodes): help" then one "page  target" line per node).
 */
async function audit(browser, baseURL, pages, { contextOptions = {}, rules } = {}) {
  const ctx = await browser.newContext(contextOptions);
  const origin = new URL(baseURL).origin;
  /** rule -> { impact, help, nodes: ["page  target"] } */
  const byRule = new Map();
  const page = await ctx.newPage();

  for (const path of pages) {
    await page.goto(new URL(path, origin).href, { waitUntil: 'networkidle' });
    await page.waitForTimeout(100);

    let builder = new AxeBuilder({ page }).withTags(TAGS);
    if (rules) builder = builder.withRules(rules);
    for (const sel of [...COMPONENTS, ...UPSTREAM]) builder = builder.exclude(sel);
    const { violations } = await builder.analyze();

    for (const v of violations) {
      const nodes = v.nodes.filter((n) => !allowed(v.id, path, n.target));
      if (!nodes.length) continue;
      if (!byRule.has(v.id)) byRule.set(v.id, { impact: v.impact, help: v.help, nodes: [] });
      for (const n of nodes) byRule.get(v.id).nodes.push(`${path}  ${JSON.stringify(n.target)}`);
    }
  }
  await ctx.close();

  return [...byRule].map(([id, { impact, help, nodes }]) =>
    `${id} (${impact}, ${nodes.length} nodes): ${help}\n    ${nodes.join('\n    ')}`);
}

test.describe('docs site accessibility', () => {
  test.setTimeout(600_000);

  test('every built page has zero axe violations in site markup', async ({ browser, baseURL }) => {
    const pages = builtPages();
    expect(pages.length).toBeGreaterThan(50);
    const report = await audit(browser, baseURL, pages);
    expect(report, `axe violations by rule:\n\n${report.join('\n\n')}`).toEqual([]);
  });

  // The site follows prefers-color-scheme (theme-boot sets data-mode="dark"),
  // so code-sample tokens and page CSS must also clear 4.5:1 in dark mode.
  test('colour contrast holds in dark mode', async ({ browser, baseURL }) => {
    const report = await audit(browser, baseURL, builtPages(), {
      contextOptions: { colorScheme: 'dark' },
      rules: ['color-contrast'],
    });
    expect(report, `dark-mode contrast violations:\n\n${report.join('\n\n')}`).toEqual([]);
  });
});
