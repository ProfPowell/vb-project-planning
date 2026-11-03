/**
 * Automated accessibility audit (axe-core) of the interactive components
 * on their demo pages: WCAG 2.0/2.1/2.2 A + AA and axe best practices,
 * scoped to the component element, expecting zero violations.
 *
 * Plus behaviour checks for the 0.3.0 a11y fixes that axe alone can't see:
 * drag-surface list semantics after moves, VB's relocated live region still
 * announcing, kanban heading levels / unique region names with two boards.
 */

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

/** component tag → demo pages that show it */
const DEMOS = {
  'kanban-board': ['kanban-board-basic', 'kanban-board-generic', 'kanban-board-wip', 'kanban-retrospective'],
  'story-map': ['story-map-basic'],
  'impact-effort': ['impact-effort-basic'],
  'quadrant-grid': ['quadrant-grid-basic', 'quadrant-grid-stakeholders', 'quadrant-grid-swot'],
  'traceability-matrix': ['traceability-matrix-basic'],
  'risk-register': ['risk-register-basic'],
  'review-surface': ['review-surface-basic', 'review-surface-empathy'],
  'iron-triangle': ['iron-triangle-basic'],
  'quality-target': ['quality-target-basic'],
  'capacity-plan': ['capacity-plan-basic'],
  'product-roadmap': ['product-roadmap-basic', 'product-roadmap-editable'],
  'gantt-chart': ['gantt-chart-basic'],
};

/** Readable one-line summary per violation for the failure message. */
const summarize = (violations) => violations.map((v) =>
  `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);

/**
 * Run the audit on `tag`. color-contrast runs as a separate pass that
 * excludes <user-story> and <work-item>: their priority / status badge
 * colours are being fixed in the record components (0.3.0, owned by the
 * records work in _ux-base PRIORITIES / STATUSES); drop the two excludes
 * once that lands. Every other rule still audits those cards.
 * @param {import('@playwright/test').Page} page
 * @param {string} tag
 */
async function audit(page, tag) {
  const main = await new AxeBuilder({ page })
    .include(tag)
    .withTags(TAGS)
    .disableRules(['color-contrast'])
    .analyze();
  const contrast = await new AxeBuilder({ page })
    .include(tag)
    .exclude('user-story')
    .exclude('work-item')
    .withRules(['color-contrast'])
    .analyze();
  return [...main.violations, ...contrast.violations];
}

/** Wait for the component to upgrade and finish its first render. */
async function ready(page, tag) {
  await page.waitForSelector(`${tag}[data-upgraded]`);
  // Board components fix drag-surface semantics in a MutationObserver,
  // and some components render in a microtask / frame after upgrade.
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
}

test.describe('axe: interactive components on their demo pages', () => {
  for (const [tag, demos] of Object.entries(DEMOS)) {
    for (const demo of demos) {
      test(`${tag} — ${demo}`, async ({ page }) => {
        await page.goto(`demos/${demo}/`);
        await ready(page, tag);
        expect(summarize(await audit(page, tag))).toEqual([]);
      });
    }
  }

  test('roadmap bars and quadrant pins keep text contrast in dark mode', async ({ page }) => {
    // Only the bars / pins whose colours this package sets; risk-register's
    // heat-map cells are <data-table> (VB) styling.
    for (const [demo, tag] of [
      ['product-roadmap-basic', 'product-roadmap .rm-bar'],
      ['quadrant-grid-stakeholders', 'quadrant-grid .qg-pinned'],
      ['risk-register-basic', 'risk-register .qg-pinned'],
    ]) {
      await page.goto(`demos/${demo}/`);
      await ready(page, tag.split(' ')[0]);
      await expect(page.locator(tag).first()).toBeVisible();
      await page.evaluate(() => {
        document.documentElement.setAttribute('data-mode', 'dark');
        document.documentElement.style.colorScheme = 'dark';
      });
      const { violations } = await new AxeBuilder({ page }).include(tag).withRules(['color-contrast']).analyze();
      expect(summarize(violations), demo).toEqual([]);
    }
  });
});

test.describe('drag-surface semantics (board-surface.js)', () => {
  test('surfaces are lists of listitems; VB\'s status region sits beside the list, not in it', async ({ page }) => {
    await page.goto('demos/kanban-board-basic/');
    await ready(page, 'kanban-board');

    const shape = await page.evaluate(() => [...document.querySelectorAll('kanban-board drag-surface')].map((s) => ({
      role: s.getAttribute('role'),
      statusInside: !!s.querySelector(':scope > [role="status"]'),
      statusBeside: s.nextElementSibling?.getAttribute('role') === 'status',
      items: [...s.querySelectorAll(':scope > [draggable="true"]')].every((c) => c.getAttribute('role') === 'listitem'),
    })));
    expect(shape.length).toBeGreaterThan(1);
    for (const s of shape) expect(s).toEqual({ role: 'list', statusInside: false, statusBeside: true, items: true });

  });

  test('VB\'s relocated status region still receives its keyboard-move announcements', async ({ page }) => {
    await page.goto('demos/kanban-board-generic/');
    await ready(page, 'kanban-board');
    const card = page.locator('kanban-board article[data-id="post-1"]');
    await card.focus();
    await page.keyboard.press('Enter');
    await expect(card).toHaveAttribute('aria-grabbed', 'true');
    await page.keyboard.press('ArrowRight');
    const result = await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => {
      const surface = document.querySelector('kanban-board article[data-id="post-1"]').parentElement;
      resolve({
        moved: surface.getAttribute('aria-label') !== 'Ideas items',
        statusInside: !!surface.querySelector(':scope > [role="status"]'),
        announced: surface.nextElementSibling?.getAttribute('role') === 'status' ? surface.nextElementSibling.textContent : null,
      });
    }))));
    expect(result.moved).toBe(true);
    expect(result.statusInside).toBe(false);
    expect(result.announced).toMatch(/^Moved to .+ items$/);
  });

  test('<article> cards: the surface becomes a group and no article carries role="listitem"', async ({ page }) => {
    await page.goto('demos/kanban-board-generic/');
    await ready(page, 'kanban-board');
    const state = await page.evaluate(() => ({
      surfaces: [...document.querySelectorAll('kanban-board drag-surface')].map((s) => s.getAttribute('role')),
      articleRoles: [...document.querySelectorAll('kanban-board article[draggable]')].map((a) => a.getAttribute('role')),
      focusable: [...document.querySelectorAll('kanban-board [draggable="true"]')].every((a) => a.tabIndex === 0),
    }));
    expect(new Set(state.surfaces)).toEqual(new Set(['group']));
    expect(state.articleRoles.every((r) => r === null)).toBe(true);
    expect(state.focusable).toBe(true);
  });

  test('cards added after upgrade (data API) get listitem + tabindex; an empty column is a group, not an empty list', async ({ page }) => {
    await page.goto('demos/kanban-board-basic/');
    await ready(page, 'kanban-board');
    await page.evaluate(() => {
      const board = document.querySelector('kanban-board');
      board.renderItem = (item) => {
        const el = document.createElement('div');
        el.className = 'kb-card';
        el.textContent = item.title;
        return el;
      };
      board.columns = [{ id: 'a', label: 'Alpha' }, { id: 'b', label: 'Beta' }];
      board.items = [{ id: 'n1', column: 'a', title: 'New one' }];
    });
    await ready(page, 'kanban-board');
    const card = page.locator('kanban-board [data-id="n1"]');
    await expect(card).toHaveAttribute('role', 'listitem');
    await expect(card).toHaveAttribute('tabindex', '0');
    await expect(page.locator('kanban-board drag-surface[aria-label="Beta items"]')).toHaveAttribute('role', 'group');
    expect(summarize(await audit(page, 'kanban-board'))).toEqual([]);
  });
});

test.describe('kanban-board headings and regions', () => {
  test('column headings follow the page outline; heading-level overrides; two boards get unique region names', async ({ page }) => {
    await page.goto('demos/kanban-retrospective/');
    await ready(page, 'kanban-board');
    // The demo has an <h1> and an untitled board: columns are <h2>.
    expect(await page.evaluate(() => [...new Set([...document.querySelectorAll('kanban-board .kb-column-heading')].map((h) => h.localName))]))
      .toEqual(['h2']);

    // A second, untitled board (columns again one below the page's last
    // heading, ignoring the first board's own) and a third with an explicit level.
    await page.evaluate(() => {
      const second = document.createElement('kanban-board');
      second.innerHTML = '<section data-column="x" data-column-label="X"><div draggable="true" data-id="x1">One</div></section>';
      document.body.append(second);
      const third = document.createElement('kanban-board');
      third.setAttribute('heading-level', '3');
      third.setAttribute('title', 'Explicit');
      third.innerHTML = '<section data-column="y" data-column-label="Y"><div draggable="true" data-id="y1">Two</div></section>';
      document.body.append(third);
    });
    await ready(page, 'kanban-board:nth-of-type(3)');
    const boards = await page.evaluate(() => [...document.querySelectorAll('kanban-board')].map((b) => ({
      title: b.querySelector(':scope > .kb-title')?.localName ?? null,
      columns: b.querySelector('.kb-column-heading')?.localName,
      region: b.querySelector('.kb-columns').getAttribute('aria-label'),
    })));
    expect(boards[1].columns).toBe('h2');
    expect(boards[2]).toEqual({ title: 'h3', columns: 'h4', region: 'Explicit' });
    expect(new Set(boards.map((b) => b.region)).size).toBe(3);

    // Changing heading-level retags the existing headings in place.
    await page.evaluate(() => document.querySelector('kanban-board').setAttribute('heading-level', '3'));
    expect(await page.evaluate(() => document.querySelector('kanban-board .kb-column-heading').localName)).toBe('h3');
    await page.evaluate(() => document.querySelector('kanban-board').removeAttribute('heading-level'));

    const { violations } = await new AxeBuilder({ page })
      .withRules(['heading-order', 'landmark-unique', 'page-has-heading-one'])
      .analyze();
    expect(summarize(violations)).toEqual([]);
  });
});
