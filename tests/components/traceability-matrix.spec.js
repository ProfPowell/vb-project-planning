/**
 * traceability-matrix — auto-discovery, orphan flags, chain highlight
 *
 * Verifies the RTM contract: `rows` / `cols` / `link-attr` selectors
 * discover page elements and render a <data-table> with ✓ intersections,
 * `flag-orphans` marks empty rows/columns, `traceability-matrix:ready`
 * carries { rowCount, colCount, linkCount }, `cell-mark` / `row-label` /
 * `data-matrix-label` drive the rendered text, and clicking a cell
 * toggles `data-state-highlighted` on the source elements page-wide
 * while firing `traceability-matrix:highlight`.
 *
 * The live, HTML-first `<traceability-matrix>` upgrades on this pack's
 * demo page (4 stories × 3 personas, one orphan story), so the spec
 * navigates there. Note that the element sets data-upgraded
 * synchronously but builds its table one microtask later, so tests wait
 * for the rendered <data-table>.
 */

import { test, expect } from '@playwright/test';

const demoPage = 'demos/traceability-matrix-basic/';
const tableSel = 'traceability-matrix > data-table > table';

test.describe('traceability-matrix', () => {

  test('HTML-first upgrade discovers rows/cols and renders linked cells + orphan flags', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector('traceability-matrix[data-upgraded]');
    await page.waitForSelector(tableSel);

    const state = await page.evaluate(() => {
      const tm = document.querySelector('traceability-matrix');
      const table = tm.querySelector('data-table > table');
      return {
        label: tm.querySelector(':scope > header.tm-label')?.textContent,
        headers: [...table.querySelectorAll('thead th')].map(th => ({
          text: th.textContent,
          colId: th.dataset.colId,
          orphan: th.hasAttribute('data-orphan'),
        })),
        rows: [...table.querySelectorAll('tbody tr')].map(tr => ({
          rowId: tr.dataset.rowId,
          label: tr.querySelector('th[scope="row"]').textContent,
          orphan: tr.hasAttribute('data-orphan'),
          cells: [...tr.querySelectorAll('td')].map(td => ({
            linked: td.hasAttribute('data-linked'),
            mark: td.textContent,
            sortValue: td.getAttribute('data-sort-value'),
            aria: td.getAttribute('aria-label'),
          })),
        })),
      };
    });

    expect(state.label).toBe('Story → Persona');
    expect(state.headers).toEqual([
      { text: 'Story', colId: undefined, orphan: false },
      { text: 'Sarah Chen', colId: 'p-sarah', orphan: false },
      { text: 'Alex Rivera', colId: 'p-alex', orphan: false },
      { text: 'Jordan Park', colId: 'p-jordan', orphan: false },
    ]);

    expect(state.rows.map(r => [r.rowId, r.label, r.orphan])).toEqual([
      ['s-1', 'Weekly digest', false],
      ['s-2', 'Sprint retro', false],
      ['s-3', 'Layout review', false],
      ['s-4', 'Login redirect', true],
    ]);

    const linkedGrid = state.rows.map(r => r.cells.map(c => (c.linked ? 1 : 0)));
    expect(linkedGrid).toEqual([
      [1, 0, 0],
      [0, 1, 0],
      [1, 0, 1], // comma-separated link-attr → two columns
      [0, 0, 0],
    ]);

    const linked = state.rows[0].cells[0];
    expect(linked).toEqual({ linked: true, mark: '✓', sortValue: '1', aria: 'linked' });
    const unlinked = state.rows[0].cells[1];
    expect(unlinked).toEqual({ linked: false, mark: '', sortValue: '0', aria: 'not linked' });
  });

  test('ready event carries counts; cell-mark / row-label / data-matrix-label drive rendering', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector(tableSel);

    const result = await page.evaluate(() => new Promise((resolve) => {
      // A persona with no data-matrix-label and no linking stories: the
      // header should fall back to its id and be flagged as an orphan.
      const extra = document.createElement('article');
      extra.className = 'card';
      extra.dataset.rowKind = 'persona';
      extra.id = 'p-new';
      extra.textContent = 'Unlabelled persona';
      document.body.appendChild(extra);

      const tm = document.createElement('traceability-matrix');
      tm.setAttribute('rows', '[data-row-kind="story"]');
      tm.setAttribute('cols', '[data-row-kind="persona"]');
      tm.setAttribute('link-attr', 'data-persona-id');
      tm.setAttribute('row-label', 'User story');
      tm.setAttribute('cell-mark', '●');
      tm.setAttribute('flag-orphans', '');
      tm.addEventListener('traceability-matrix:ready', (e) => {
        const table = tm.querySelector('data-table > table');
        resolve({
          detail: { ...e.detail },
          bubbles: e.bubbles,
          upgraded: tm.hasAttribute('data-upgraded'),
          hasLabel: !!tm.querySelector(':scope > header.tm-label'),
          corner: table.querySelector('thead th').textContent,
          headers: [...table.querySelectorAll('thead th')].slice(1).map(th => [th.textContent, th.hasAttribute('data-orphan')]),
          marks: [...new Set([...table.querySelectorAll('td[data-linked]')].map(td => td.textContent))],
        });
      });
      document.body.appendChild(tm);
    }));

    expect(result.detail).toEqual({ rowCount: 4, colCount: 4, linkCount: 4 });
    expect(result.bubbles).toBe(true);
    expect(result.upgraded).toBe(true);
    expect(result.hasLabel).toBe(false);
    expect(result.corner).toBe('User story');
    expect(result.headers).toEqual([
      ['Sarah Chen', false],
      ['Alex Rivera', false],
      ['Jordan Park', false],
      ['p-new', true],
    ]);
    expect(result.marks).toEqual(['●']);
  });

  test('clicking a cell toggles chain highlight on source elements and fires :highlight', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector(tableSel);

    const result = await page.evaluate(() => {
      const tm = document.querySelector('traceability-matrix');
      const fired = [];
      tm.addEventListener('traceability-matrix:highlight', (e) => {
        fired.push({ row: e.detail.rowEl?.id ?? null, col: e.detail.colEl?.id ?? null, on: e.detail.on });
      });

      const cell = (rowId, colId) => tm.querySelector(`tr[data-row-id="${rowId}"] td[data-col-id="${colId}"]`);
      const snapshot = () => ({
        matrix: [...tm.querySelectorAll('[data-state-highlighted]')].map(el =>
          el.tagName === 'TR'
            ? `tr:${el.dataset.rowId}`
            : `${el.tagName.toLowerCase()}:${el.closest('tr').dataset.rowId}/${el.dataset.colId ?? ''}`
        ),
        page: [...document.querySelectorAll('article.card[data-state-highlighted]')].map(el => el.id),
      });

      const s3j = cell('s-3', 'p-jordan');
      s3j.click();
      const afterFirst = snapshot();

      // Clicking a different cell moves the highlight (only one active).
      cell('s-2', 'p-alex').click();
      const afterSecond = snapshot();

      // Clicking the active cell again clears everything.
      cell('s-2', 'p-alex').click();
      const afterToggleOff = snapshot();

      // Row-label header cell highlights the row source only.
      tm.querySelector('tr[data-row-id="s-1"] th[scope="row"]').click();
      const afterRowHeader = snapshot();

      return { fired, afterFirst, afterSecond, afterToggleOff, afterRowHeader };
    });

    expect(result.afterFirst.matrix.sort()).toEqual(['td:s-3/p-jordan', 'tr:s-3']);
    expect(result.afterFirst.page.sort()).toEqual(['p-jordan', 's-3']);

    expect(result.afterSecond.matrix.sort()).toEqual(['td:s-2/p-alex', 'tr:s-2']);
    expect(result.afterSecond.page.sort()).toEqual(['p-alex', 's-2']);

    expect(result.afterToggleOff).toEqual({ matrix: [], page: [] });

    expect(result.afterRowHeader.matrix.sort()).toEqual(['th:s-1/', 'tr:s-1']);
    expect(result.afterRowHeader.page).toEqual(['s-1']);

    expect(result.fired).toEqual([
      { row: 's-3', col: 'p-jordan', on: true },
      { row: 's-2', col: 'p-alex', on: true },
      { row: 's-2', col: 'p-alex', on: false },
      { row: 's-1', col: null, on: true },
    ]);
  });

  test('missing config aborts upgrade; selectors matching nothing render the empty note', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector(tableSel);

    const result = await page.evaluate(() => new Promise((resolve) => {
      const bare = document.createElement('traceability-matrix');
      document.body.appendChild(bare);

      const empty = document.createElement('traceability-matrix');
      empty.setAttribute('rows', '.does-not-exist');
      empty.setAttribute('cols', '[data-row-kind="persona"]');
      empty.setAttribute('link-attr', 'data-persona-id');
      document.body.appendChild(empty);

      // #build runs one microtask after connect; a macrotask is enough.
      setTimeout(() => resolve({
        bareUpgraded: bare.hasAttribute('data-upgraded'),
        bareChildren: bare.children.length,
        emptyUpgraded: empty.hasAttribute('data-upgraded'),
        emptyNote: empty.querySelector(':scope > p.tm-empty')?.textContent,
        emptyHasTable: !!empty.querySelector('data-table'),
      }), 0);
    }));

    expect(result.bareUpgraded).toBe(false);
    expect(result.bareChildren).toBe(0);
    expect(result.emptyUpgraded).toBe(true);
    expect(result.emptyNote).toBe('No matching elements found for this matrix.');
    expect(result.emptyHasTable).toBe(false);
  });
});
