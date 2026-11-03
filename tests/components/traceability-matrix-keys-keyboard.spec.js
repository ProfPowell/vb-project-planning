/**
 * traceability-matrix — 0.2.2 regressions.
 *
 * - Columns match on story-id / item-id (not only DOM id), so the doc's
 *   `rows="work-item" cols="user-story" link-attr="story-ids"` works;
 *   `match-attr` picks one specific attribute.
 * - Rows / columns without an id can still be highlighted.
 * - Chain highlight is keyboard operable (button per cell, Enter/Space).
 * - Removing the matrix clears data-state-highlighted from page sources.
 */

import { test, expect } from '@playwright/test';

const demoPage = 'demos/traceability-matrix-basic/';
const tableSel = 'traceability-matrix > data-table > table';

/** Append a fixture + matrix; resolves with the ready detail. */
function mountScript({ fixture, attrs }) {
  return new Promise((resolve) => {
    const host = document.createElement('section');
    host.id = 'fixture';
    host.innerHTML = fixture;
    document.body.appendChild(host);
    const tm = document.createElement('traceability-matrix');
    tm.id = 'tm-under-test';
    for (const [k, v] of Object.entries(attrs)) tm.setAttribute(k, v);
    tm.addEventListener('traceability-matrix:ready', (e) => resolve(e.detail), { once: true });
    document.body.appendChild(tm);
  });
}

test.describe('traceability-matrix (0.2.2 fixes)', () => {

  test('work-item × user-story links via story-id even when the story has a different DOM id', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector(tableSel);

    const detail = await page.evaluate(mountScript, {
      fixture: `
        <user-story id="card-a" story-id="US-1" detail="minimal"><h3 slot="title">Login</h3></user-story>
        <user-story story-id="US-2" detail="minimal"><h3 slot="title">Export</h3></user-story>
        <work-item item-id="WI-1" story-ids="US-1,US-2" detail="minimal"><h3 slot="title">Auth API</h3></work-item>
        <work-item item-id="WI-2" story-ids="US-2" detail="minimal"><h3 slot="title">CSV</h3></work-item>`,
      attrs: { rows: '#fixture work-item', cols: '#fixture user-story', 'link-attr': 'story-ids' },
    });
    expect(detail).toEqual({ rowCount: 2, colCount: 2, linkCount: 3 });

    const grid = await page.evaluate(() =>
      [...document.querySelectorAll('#tm-under-test tbody tr')].map(tr =>
        [...tr.querySelectorAll('td')].map(td => (td.hasAttribute('data-linked') ? 1 : 0))));
    expect(grid).toEqual([[1, 1], [0, 1]]);
  });

  test('match-attr selects the column attribute to match against', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector(tableSel);
    const detail = await page.evaluate(mountScript, {
      fixture: `
        <div class="req" data-req="R1" id="x1">Req one</div>
        <div class="req" data-req="R2" id="x2">Req two</div>
        <div class="test" data-covers="R2">Test A</div>`,
      attrs: { rows: '#fixture .test', cols: '#fixture .req', 'link-attr': 'data-covers', 'match-attr': 'data-req' },
    });
    expect(detail.linkCount).toBe(1);
  });

  test('rows and columns without ids are highlighted; keyboard Enter/Space toggles; aria-pressed reflects state', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector(tableSel);
    await page.evaluate(mountScript, {
      fixture: `
        <div class="col" data-key="A">Column A</div>
        <div class="col" data-key="B">Column B</div>
        <div class="row" data-refs="B">Row one</div>
        <div class="row" data-refs="A">Row two</div>`,
      attrs: { rows: '#fixture .row', cols: '#fixture .col', 'link-attr': 'data-refs', 'match-attr': 'data-key' },
    });

    const btn = page.getByRole('button', { name: 'Row one × Column B: linked' });
    await expect(btn).toHaveCount(1);
    await btn.focus();
    await page.keyboard.press('Enter');

    const lit = () => page.evaluate(() => ({
      page: [...document.querySelectorAll('#fixture [data-state-highlighted]')].map(el => el.textContent.trim()),
      pressed: [...document.querySelectorAll('#tm-under-test [aria-pressed="true"]')].map(b => b.getAttribute('aria-label')),
    }));
    expect(await lit()).toEqual({ page: ['Column B', 'Row one'], pressed: ['Row one × Column B: linked'] });

    await page.keyboard.press('Space');
    expect(await lit()).toEqual({ page: [], pressed: [] });

    // Row header button highlights just the row source.
    await page.getByRole('button', { name: 'Highlight Row two' }).press('Enter');
    expect((await lit()).page).toEqual(['Row two']);
  });

  test('removing the matrix clears highlight from page source elements', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector(tableSel);

    const result = await page.evaluate(() => {
      const tm = document.querySelector('traceability-matrix');
      tm.querySelector('tr[data-row-id="s-3"] td[data-col-id="p-jordan"] button').click();
      const before = [...document.querySelectorAll('[data-state-highlighted]')].filter(el => !tm.contains(el)).map(el => el.id).sort();
      tm.remove();
      const after = [...document.querySelectorAll('[data-state-highlighted]')].map(el => el.id);
      return { before, after };
    });
    expect(result.before).toEqual(['p-jordan', 's-3']);
    expect(result.after).toEqual([]);
  });
});

test.describe('traceability-matrix keyboard grid (0.3.0)', () => {
  /** Accessible name of the focused element (button label or header text). */
  const focused = (page) => page.evaluate(() => {
    const el = document.activeElement;
    return el.getAttribute('aria-label') || el.textContent.trim();
  });

  test('role="grid" with a single Tab stop and a name', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector(`${tableSel}[role="grid"]`);
    const state = await page.evaluate(() => {
      const table = document.querySelector('traceability-matrix table');
      const labelledBy = document.getElementById(table.getAttribute('aria-labelledby'));
      return {
        role: table.getAttribute('role'),
        name: labelledBy?.textContent,
        stops: table.querySelectorAll('[tabindex="0"]').length,
        roving: table.querySelectorAll('[tabindex="-1"]').length,
        // No cell button or sortable header escapes the roving tabindex.
        loose: [...table.querySelectorAll('button, th[data-sort]')].filter(el => !el.hasAttribute('tabindex')).length,
      };
    });
    // 1 header row + 4 story rows, 1 label column + 3 persona columns.
    expect(state).toEqual({ role: 'grid', name: 'Story → Persona', stops: 1, roving: 5 * 4 - 1, loose: 0 });
    await expect(page.getByRole('grid', { name: 'Story → Persona' })).toHaveCount(1);
  });

  test('Tab enters once; arrows, Home/End and Ctrl+Home/End move; Tab leaves', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector(`${tableSel}[role="grid"]`);
    // Put focus just before the matrix, then Tab in.
    await page.evaluate(() => {
      const before = document.createElement('button');
      before.id = 'before';
      before.textContent = 'before';
      document.querySelector('traceability-matrix').before(before);
      before.focus();
    });
    await page.keyboard.press('Tab');
    expect(await focused(page)).toBe('Story'); // first cell: the corner header

    await page.keyboard.press('ArrowDown');
    expect(await focused(page)).toBe('Highlight Weekly digest');
    await page.keyboard.press('ArrowRight');
    expect(await focused(page)).toBe('Weekly digest × Sarah Chen: linked');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowDown');
    expect(await focused(page)).toBe('Sprint retro × Alex Rivera: linked');
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('ArrowUp');
    expect(await focused(page)).toBe('Alex Rivera'); // sortable column header
    await page.keyboard.press('ArrowUp'); // clamps at the edge
    expect(await focused(page)).toBe('Alex Rivera');

    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('End');
    expect(await focused(page)).toBe('Weekly digest × Jordan Park: not linked');
    await page.keyboard.press('Home');
    expect(await focused(page)).toBe('Highlight Weekly digest');
    await page.keyboard.press('Control+End');
    expect(await focused(page)).toBe('Login redirect × Jordan Park: not linked');
    await page.keyboard.press('Control+Home');
    expect(await focused(page)).toBe('Story');

    // Only the current cell is a Tab stop; Space still toggles the highlight.
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Space');
    await expect(page.getByRole('button', { name: 'Weekly digest × Sarah Chen: linked' })).toHaveAttribute('aria-pressed', 'true');
    expect(await page.evaluate(() => document.querySelectorAll('traceability-matrix [tabindex="0"]').length)).toBe(1);

    // Shift+Tab leaves the grid in one step; Tab comes back to the same cell.
    await page.keyboard.press('Shift+Tab');
    expect(await page.evaluate(() => document.activeElement.id)).toBe('before');
    await page.keyboard.press('Tab');
    expect(await focused(page)).toBe('Weekly digest × Sarah Chen: linked');
  });

  test('clicking a cell makes it the Tab stop', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector(`${tableSel}[role="grid"]`);
    await page.getByRole('button', { name: 'Layout review × Jordan Park: linked' }).click();
    const stops = await page.evaluate(() => [...document.querySelectorAll('traceability-matrix [tabindex="0"]')].map(el => el.getAttribute('aria-label')));
    expect(stops).toEqual(['Layout review × Jordan Park: linked']);
  });
});
