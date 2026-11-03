/**
 * docs site integrity — crawls the built docs/ site the way a visitor would.
 *
 * Starting at the home page and following every same-site link, it fails on:
 *   - console errors, uncaught exceptions, and failed (4xx/5xx) requests;
 *   - internal links to missing pages and #anchors with no matching id;
 *   - built pages that nothing links to (orphans);
 *   - scripted components left undefined (a missing <script>), including
 *     inside demo iframes;
 *   - sideways scrolling at a 390px phone width;
 *   - stale links into vanilla-breeze.com paths that no longer exist.
 *
 * Pages are served by tests/serve-docs.mjs under /vb-project-planning/, with
 * the component bundle taken from dist/.
 */
import { test, expect } from '@playwright/test';
import { globSync } from 'node:fs';

const MOUNT = '/vb-project-planning/';

/** Elements that need a script. VB's layout tags (layout-*, site-tools, …) are CSS-only by design. */
const SCRIPTED = new Set([
  'adr-wc', 'burndown-chart', 'capacity-plan', 'empathy-map', 'gantt-chart', 'impact-effort',
  'iron-triangle', 'kanban-board', 'product-roadmap', 'quadrant-grid', 'quality-target',
  'requirement-card', 'review-surface', 'risk-register', 'story-map', 'traceability-matrix',
  'user-journey', 'user-persona', 'user-story', 'work-item',
  'drag-surface', 'data-table', 'form-field', 'chart-wc', 'icon-wc', 'browser-window',
  'code-block', 'page-toc', 'site-search', 'theme-picker',
]);

/** vanilla-breeze.com docs paths that no longer exist (the UX pack moved into this package). */
const DEAD_EXTERNAL = [/vanilla-breeze\.com\/docs\/packs\//];

test.describe('docs site', () => {
  test.setTimeout(240_000);

  test('every page loads cleanly and every link, anchor and page is reachable', async ({ browser, baseURL }) => {
    const ctx = await browser.newContext();
    const origin = new URL(baseURL).origin;
    const start = new URL(MOUNT, origin).href;
    const norm = (u) => { const x = new URL(u); x.hash = ''; x.search = ''; return x.href; };

    const queue = [start];
    const seen = new Set([norm(start)]);
    const problems = [];
    const ids = new Map();      // page -> Set(ids)
    const links = [];           // { from, href }

    while (queue.length) {
      const url = queue.shift();
      const page = await ctx.newPage();
      const where = url.replace(origin, '');
      page.on('console', (m) => { if (m.type() === 'error') problems.push(`${where} console: ${m.text().slice(0, 200)}`); });
      page.on('pageerror', (e) => problems.push(`${where} exception: ${e.message.slice(0, 200)}`));
      page.on('response', (r) => { if (r.status() >= 400) problems.push(`${where} ${r.status()} ${r.url().replace(origin, '')}`); });

      const resp = await page.goto(url, { waitUntil: 'networkidle' });
      if (!resp || resp.status() >= 400) problems.push(`${where} returned ${resp?.status()}`);
      await page.waitForTimeout(150);

      for (const frame of page.frames()) {
        const undef = await frame.evaluate((scripted) =>
          [...new Set([...document.querySelectorAll(':not(:defined)')].map((e) => e.localName))]
            .filter((t) => scripted.includes(t)), [...SCRIPTED]).catch(() => []);
        if (undef.length) problems.push(`${where}${frame === page.mainFrame() ? '' : ' (frame ' + frame.url().replace(origin, '') + ')'} undefined: ${undef.join(', ')}`);
      }

      const found = await page.evaluate(() => ({
        ids: [...document.querySelectorAll('[id]')].map((e) => e.id),
        hrefs: [...document.querySelectorAll('a[href]')].map((a) => a.href),
      }));
      ids.set(norm(url), new Set(found.ids));
      for (const href of found.hrefs) {
        if (DEAD_EXTERNAL.some((re) => re.test(href))) problems.push(`${where} links to removed page ${href}`);
        if (!href.startsWith(origin)) continue;
        const u = new URL(href);
        if (!u.pathname.startsWith(MOUNT)) { problems.push(`${where} link outside the site base: ${href}`); continue; }
        links.push({ from: where, href });
        const n = norm(href);
        if (!seen.has(n) && !/\.[a-z0-9]+$/i.test(u.pathname)) { seen.add(n); queue.push(n); }
      }
      await page.close();
    }

    // Link targets and anchors.
    const status = new Map();
    for (const { from, href } of links) {
      const n = norm(href);
      if (!status.has(n)) status.set(n, (await ctx.request.get(n)).status());
      if (status.get(n) >= 400) problems.push(`${from} broken link ${href.replace(origin, '')} (${status.get(n)})`);
      const hash = decodeURIComponent(new URL(href).hash.slice(1));
      if (hash && ids.has(n) && !ids.get(n).has(hash)) problems.push(`${from} missing anchor ${href.replace(origin, '')}`);
    }

    // Orphans: every built page must be reachable from the home page.
    const built = globSync('docs/**/index.html').map((p) => new URL(MOUNT + p.slice('docs/'.length, -'index.html'.length), origin).href);
    for (const p of built) if (!seen.has(p)) problems.push(`orphan page (nothing links to it): ${p.replace(origin, '')}`);

    await ctx.close();
    expect([...new Set(problems)]).toEqual([]);
  });

  test('no page scrolls sideways at a 390px phone width', async ({ browser, baseURL }) => {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const origin = new URL(baseURL).origin;
    const pages = globSync('docs/**/index.html').map((p) => MOUNT + p.slice('docs/'.length, -'index.html'.length));
    const overflowing = [];
    for (const path of pages) {
      const page = await ctx.newPage();
      await page.goto(new URL(path, origin).href, { waitUntil: 'networkidle' });
      const px = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (px > 2) overflowing.push(`${path} (${px}px)`);
      await page.close();
    }
    await ctx.close();
    expect(overflowing).toEqual([]);
  });
});
