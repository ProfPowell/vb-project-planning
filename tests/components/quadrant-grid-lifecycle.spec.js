/**
 * quadrant-grid — lifecycle and regressions: reconnect, visual DOM order,
 * pinned children in read-only mode, drag re-clustering, roles, scale
 * label escaping, two instances.
 */

import { test, expect } from '@playwright/test';

const basicDemo = 'demos/quadrant-grid-basic/';
const swotDemo = 'demos/quadrant-grid-swot/';
const stakeholdersDemo = 'demos/quadrant-grid-stakeholders/';

test.describe('quadrant-grid — lifecycle', () => {

  test('quadrants are in visual reading order (TL, TR, BL, BR) in the DOM', async ({ page }) => {
    await page.goto(swotDemo);
    await page.waitForSelector('quadrant-grid[data-upgraded]');
    const state = await page.evaluate(() => {
      const zones = [...document.querySelectorAll('quadrant-grid .qg-quadrant')];
      return {
        labels: zones.map((z) => z.querySelector('.qg-quadrant-label').textContent),
        // Visual order derived from layout: sort by top, then left.
        visual: [...zones]
          .sort((a, b) => {
            const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
            return Math.round(ra.top - rb.top) || ra.left - rb.left;
          })
          .map((z) => z.querySelector('.qg-quadrant-label').textContent),
      };
    });
    expect(state.labels).toEqual(['Strengths', 'Opportunities', 'Weaknesses', 'Threats']);
    expect(state.labels).toEqual(state.visual);
  });

  test('reconnect keeps children and does not add a second wrapper or live region', async ({ page }) => {
    await page.goto(basicDemo);
    await page.waitForSelector('quadrant-grid[data-upgraded]');
    const state = await page.evaluate(() => {
      const qg = document.querySelector('quadrant-grid');
      const snap = () => ({
        wrappers: qg.querySelectorAll('.qg-wrapper').length,
        live: qg.querySelectorAll('.qg-live-region').length,
        items: qg.querySelectorAll('[data-id]').length,
      });
      const before = snap();
      const host = document.createElement('div');
      document.body.appendChild(host);
      host.appendChild(qg);
      qg.setup();
      const after = snap();
      let moves = 0;
      qg.addEventListener('quadrant-grid:move', () => { moves += 1; });
      const from = qg.querySelector('.qg-quadrant[data-quadrant-zone="1"] drag-surface');
      const to = qg.querySelector('.qg-quadrant[data-quadrant-zone="0"] drag-surface');
      const item = from.querySelector('[data-id]');
      to.appendChild(item);
      to.dispatchEvent(new CustomEvent('drag-surface:transfer', {
        bubbles: true, detail: { item, itemId: item.dataset.id, fromSurface: from, toSurface: to, newIndex: 0 },
      }));
      return { before, after, moves };
    });
    expect(state.before.wrappers).toBe(1);
    expect(state.before.live).toBe(1);
    expect(state.before.items).toBeGreaterThan(0);
    expect(state.after).toEqual(state.before);
    expect(state.moves).toBe(1);
  });

  test('read-only pins: their <li> draws no chip and takes no space', async ({ page }) => {
    await page.goto(stakeholdersDemo);
    await page.waitForSelector('quadrant-grid[data-upgraded]');
    const state = await page.evaluate(() => {
      const lis = [...document.querySelectorAll('quadrant-grid .qg-items > li')]
        .filter((li) => li.querySelector('.qg-pinned'));
      return {
        count: lis.length,
        displays: [...new Set(lis.map((li) => getComputedStyle(li).display))],
        stillListItems: lis.every((li) => li.parentElement.localName === 'ul'),
      };
    });
    expect(state.count).toBeGreaterThan(0);
    expect(state.displays).toEqual(['contents']);
    expect(state.stillListItems).toBe(true);
  });

  test('clustered pins get a role with their tabindex', async ({ page }) => {
    await page.goto(stakeholdersDemo);
    await page.waitForSelector('quadrant-grid[data-upgraded]');
    const state = await page.evaluate(async () => {
      const qg = document.createElement('quadrant-grid');
      qg.innerHTML = `
        <span data-x="0.8" data-y="0.8" data-id="one">One</span>
        <span data-x="0.8" data-y="0.8" data-id="two">Two</span>`;
      document.body.appendChild(qg);
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      return [...qg.querySelectorAll('.qg-pinned')].map((p) => ({
        clustered: p.classList.contains('qg-clustered'), tabindex: p.getAttribute('tabindex'), role: p.getAttribute('role'),
      }));
    });
    expect(state).toEqual([
      { clustered: true, tabindex: '0', role: 'group' },
      { clustered: true, tabindex: '0', role: 'group' },
    ]);
  });

  test('dragging a pin to another quadrant drops its coordinates and re-clusters', async ({ page }) => {
    await page.goto(stakeholdersDemo);
    await page.waitForSelector('quadrant-grid[data-upgraded]');
    const state = await page.evaluate(async () => {
      const frames = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      const qg = document.createElement('quadrant-grid');
      qg.setAttribute('draggable', '');
      qg.innerHTML = `
        <span data-x="0.8" data-y="0.8" data-id="one">One</span>
        <span data-x="0.8" data-y="0.8" data-id="two">Two</span>
        <span data-x="0.2" data-y="0.2" data-id="three">Three</span>`;
      document.body.appendChild(qg);
      await frames();
      const clusteredBefore = [...qg.querySelectorAll('.qg-clustered')].map((p) => p.dataset.id);
      let detail;
      qg.addEventListener('quadrant-grid:move', (e) => { detail = e.detail; });
      const item = qg.querySelector('[data-id="two"]');
      const from = item.closest('drag-surface');
      const to = qg.querySelector('.qg-quadrant[data-quadrant-zone="2"] drag-surface');
      to.appendChild(item);
      to.dispatchEvent(new CustomEvent('drag-surface:transfer', {
        bubbles: true, detail: { item, itemId: 'two', fromSurface: from, toSurface: to, newIndex: 0 },
      }));
      await frames();
      return {
        clusteredBefore,
        clusteredAfter: [...qg.querySelectorAll('.qg-clustered')].map((p) => p.dataset.id),
        keys: Object.keys(detail).sort(),
        moved: {
          x: item.getAttribute('data-x'), y: item.getAttribute('data-y'),
          pinned: item.classList.contains('qg-pinned'),
          localX: item.style.getPropertyValue('--qg-local-x'),
          quadrant: item.getAttribute('data-quadrant'),
        },
      };
    });
    expect(state.clusteredBefore).toEqual(['one', 'two']);
    expect(state.clusteredAfter).toEqual([]);
    expect(state.keys).toEqual(['from', 'item', 'itemId', 'to']);
    expect(state.moved).toEqual({ x: null, y: null, pinned: false, localX: '', quadrant: '2' });
  });

  test('scale labels are text, not markup', async ({ page }) => {
    await page.goto(swotDemo);
    await page.waitForSelector('quadrant-grid[data-upgraded]');
    const state = await page.evaluate(() => {
      const qg = document.createElement('quadrant-grid');
      qg.setAttribute('x-low', '<img src=x onerror="window.__xss=1">');
      qg.setAttribute('y-high', '<b>High</b>');
      document.body.appendChild(qg);
      return {
        xLow: qg.querySelector('.qg-x-scale span').textContent,
        yHigh: qg.querySelector('.qg-y-scale span').textContent,
        imgs: qg.querySelectorAll('img, b').length,
      };
    });
    expect(state).toEqual({ xLow: '<img src=x onerror="window.__xss=1">', yHigh: '<b>High</b>', imgs: 0 });
  });

  test('two grids on one page have separate groups and live regions', async ({ page }) => {
    await page.goto(basicDemo);
    await page.waitForSelector('quadrant-grid[data-upgraded]');
    const state = await page.evaluate(() => {
      const second = document.createElement('quadrant-grid');
      second.setAttribute('draggable', '');
      second.innerHTML = '<span data-quadrant="0" data-id="z">Z</span>';
      document.body.appendChild(second);
      return [...document.querySelectorAll('quadrant-grid')].map((qg) => ({
        groups: [...new Set([...qg.querySelectorAll('drag-surface')].map((s) => s.getAttribute('group')))],
        live: qg.querySelectorAll('.qg-live-region').length,
      }));
    });
    expect(state).toHaveLength(2);
    expect(state[0].groups).toHaveLength(1);
    expect(state[1].groups).toHaveLength(1);
    expect(state[0].groups[0]).not.toBe(state[1].groups[0]);
    expect(state.map((s) => s.live)).toEqual([1, 1]);
  });
});
