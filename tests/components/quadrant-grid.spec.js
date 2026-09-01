/**
 * quadrant-grid — HTML-first contract
 *
 * Verifies the generic 2x2 primitive that backs SWOT / stakeholder-map /
 * impact-effort recipes: axis + quadrant labels from attributes, child
 * routing by explicit `data-quadrant` or computed from `data-x`/`data-y`,
 * the `draggable` attribute composing <drag-surface> per quadrant, and the
 * documented `quadrant-grid:move` event.
 *
 * Drag gestures themselves belong to <drag-surface>; the move test drives
 * the component through the `drag-surface:transfer` event it listens for.
 * Navigates to this pack's demo pages where the live, HTML-first
 * `<quadrant-grid>` upgrades.
 */

import { test, expect } from '@playwright/test';

const basicDemo = 'demos/quadrant-grid-basic/';          // draggable, data-quadrant children
const swotDemo = 'demos/quadrant-grid-swot/';            // read-only, data-quadrant children
const stakeholdersDemo = 'demos/quadrant-grid-stakeholders/'; // read-only, data-x/data-y pins

test.describe('quadrant-grid — HTML-first contract', () => {

  test('upgrades read-only: labels from attributes, children routed by data-quadrant into <ul>/<li>', async ({ page }) => {
    await page.goto(swotDemo);
    await page.waitForSelector('quadrant-grid[data-upgraded]');

    const state = await page.evaluate(() => {
      const qg = document.querySelector('quadrant-grid');
      const wrapper = qg.querySelector(':scope > .qg-wrapper');
      return {
        region: wrapper.getAttribute('role'),
        regionLabel: wrapper.getAttribute('aria-label'),
        yLabel: wrapper.querySelector('.qg-y-label')?.textContent,
        xLabel: wrapper.querySelector('.qg-x-label')?.textContent,
        yScale: [...wrapper.querySelectorAll('.qg-y-scale span')].map((s) => s.textContent),
        xScale: [...wrapper.querySelectorAll('.qg-x-scale span')].map((s) => s.textContent),
        zones: [...wrapper.querySelectorAll('.qg-grid > .qg-quadrant')].map((s) => ({
          zone: s.dataset.quadrantZone,
          aria: s.getAttribute('aria-label'),
          label: s.querySelector(':scope > .qg-quadrant-label')?.textContent,
          hasSurface: !!s.querySelector('drag-surface'),
          items: [...s.querySelectorAll(':scope > ul.qg-items > li > p')].map((p) => ({
            text: p.textContent,
            id: p.dataset.id,
            draggable: p.getAttribute('draggable'),
          })),
        })),
        liveRegion: qg.querySelector(':scope > .qg-live-region')?.getAttribute('aria-live'),
        strayChildren: qg.querySelectorAll(':scope > p').length,
      };
    });

    expect(state.region).toBe('region');
    expect(state.regionLabel).toBe('Helpfulness × Origin quadrant grid');
    expect(state.yLabel).toBe('↑ Helpfulness');
    expect(state.xLabel).toBe('Origin →');
    expect(state.yScale).toEqual(['Helpful', 'Harmful']);   // high on top
    expect(state.xScale).toEqual(['Internal', 'External']);  // low on left
    expect(state.liveRegion).toBe('polite');
    expect(state.strayChildren).toBe(0);                     // every child was moved into a quadrant

    expect(state.zones.map((z) => z.zone)).toEqual(['0', '1', '2', '3']);
    expect(state.zones.map((z) => z.label)).toEqual(['Opportunities', 'Strengths', 'Weaknesses', 'Threats']);
    expect(state.zones.map((z) => z.aria)).toEqual(['Opportunities', 'Strengths', 'Weaknesses', 'Threats']);
    expect(state.zones.every((z) => !z.hasSurface)).toBe(true);

    // Routing preserves author order within a quadrant; ids are auto-assigned
    // by source index (qg-item-N) when the author omits data-id.
    expect(state.zones[2].items.map((i) => i.text)).toEqual(['Limited mobile support', 'Long onboarding flow']);
    expect(state.zones[2].items.map((i) => i.id)).toEqual(['qg-item-0', 'qg-item-1']);
    expect(state.zones[1].items.map((i) => i.id)).toEqual(['qg-item-2', 'qg-item-3']);
    expect(state.zones[0].items.map((i) => i.text)).toEqual(['Emerging AI integrations', 'Adjacent vertical markets']);
    expect(state.zones[3].items.map((i) => i.text)).toEqual(['Open-source competitors', 'Privacy-regulation shifts']);
    expect(state.zones.flatMap((z) => z.items).every((i) => i.draggable === null)).toBe(true);
  });

  test('draggable: composes one <drag-surface> per quadrant in a shared group and marks children draggable', async ({ page }) => {
    await page.goto(basicDemo);
    await page.waitForSelector('quadrant-grid[data-upgraded]');
    await page.waitForSelector('quadrant-grid drag-surface[data-upgraded]');

    const state = await page.evaluate(() => {
      const qg = document.querySelector('quadrant-grid');
      const zones = [...qg.querySelectorAll('.qg-grid > .qg-quadrant')].map((s) => {
        const surface = s.querySelector(':scope > drag-surface');
        return {
          zone: s.dataset.quadrantZone,
          label: s.querySelector(':scope > .qg-quadrant-label')?.textContent,
          group: surface?.getAttribute('group'),
          surfaceAria: surface?.getAttribute('aria-label'),
          layout: surface?.getAttribute('data-layout'),
          hasList: !!s.querySelector(':scope > ul.qg-items'),
          ids: [...(surface?.querySelectorAll(':scope > [data-id]') ?? [])].map((el) => el.dataset.id),
          draggable: [...(surface?.querySelectorAll(':scope > [data-id]') ?? [])].map((el) => el.getAttribute('draggable')),
        };
      });
      return { zones, groups: new Set(zones.map((z) => z.group)).size };
    });

    expect(state.zones.map((z) => z.label)).toEqual(['Big Bets', 'Quick Wins', 'Fill-Ins', 'Money Pit']);
    expect(state.zones.every((z) => z.group && /^qg-\d+$/.test(z.group))).toBe(true);
    expect(state.groups).toBe(1);   // all four surfaces share the instance group
    expect(state.zones.map((z) => z.surfaceAria)).toEqual(['Big Bets', 'Quick Wins', 'Fill-Ins', 'Money Pit']);
    expect(state.zones.every((z) => z.layout === 'stack' && !z.hasList)).toBe(true);

    expect(state.zones.map((z) => z.ids)).toEqual([['c'], ['a', 'b'], ['d'], ['e']]);
    expect(state.zones.flatMap((z) => z.draggable).every((d) => d === 'true')).toBe(true);
  });

  test('data-x / data-y children: quadrant computed from coordinates and pinned with section-local offsets', async ({ page }) => {
    await page.goto(stakeholdersDemo);
    await page.waitForSelector('quadrant-grid[data-upgraded]');

    const state = await page.evaluate(() => {
      const qg = document.querySelector('quadrant-grid');
      const pins = {};
      for (const s of qg.querySelectorAll('.qg-grid > .qg-quadrant')) {
        for (const el of s.querySelectorAll('.qg-pinned')) {
          pins[el.dataset.id] = {
            zone: s.dataset.quadrantZone,
            inList: el.parentElement?.tagName === 'LI',
            localX: parseFloat(el.style.getPropertyValue('--qg-local-x')),
            localY: parseFloat(el.style.getPropertyValue('--qg-local-y')),
            hue: el.style.getPropertyValue('--qg-pin-hue'),
          };
        }
      }
      return { pins, pinCount: qg.querySelectorAll('.qg-pinned').length };
    });

    expect(state.pinCount).toBe(6);
    expect(Object.fromEntries(Object.entries(state.pins).map(([id, p]) => [id, p.zone]))).toEqual({
      ceo: '0',      // (0.85, 0.9)  → top-right
      'vp-eng': '0', // (0.7, 0.65)
      board: '1',    // (0.2, 0.8)   → top-left
      vendor: '2',   // (0.15, 0.25) → bottom-left
      users: '3',    // (0.6, 0.35)  → bottom-right
      support: '3',  // (0.8, 0.4)
    });
    expect(Object.values(state.pins).every((p) => p.inList)).toBe(true);

    // Document coords are re-based to the owning half: Q1/Q4 shift x by 0.5, Q1/Q2 shift y by 0.5.
    expect(state.pins.ceo.localX).toBeCloseTo(0.7, 4);
    expect(state.pins.ceo.localY).toBeCloseTo(0.8, 4);
    expect(state.pins.board.localX).toBeCloseTo(0.4, 4);
    expect(state.pins.board.localY).toBeCloseTo(0.6, 4);
    expect(state.pins.vendor.localX).toBeCloseTo(0.3, 4);
    expect(state.pins.vendor.localY).toBeCloseTo(0.5, 4);
    expect(state.pins.users.localX).toBeCloseTo(0.2, 4);
    expect(state.pins.users.localY).toBeCloseTo(0.7, 4);
    expect(Object.values(state.pins).every((p) => /^\d+deg$/.test(p.hue))).toBe(true);
  });

  test('static quadrantFor(x, y) maps coordinates to Q1..Q4 (midpoint belongs to the higher quadrant)', async ({ page }) => {
    await page.goto(stakeholdersDemo);
    await page.waitForSelector('quadrant-grid[data-upgraded]');

    const result = await page.evaluate(() => {
      const QuadrantGrid = customElements.get('quadrant-grid');
      return {
        topRight: QuadrantGrid.quadrantFor(0.9, 0.9),
        topLeft: QuadrantGrid.quadrantFor(0.1, 0.9),
        bottomLeft: QuadrantGrid.quadrantFor(0.1, 0.1),
        bottomRight: QuadrantGrid.quadrantFor(0.9, 0.1),
        centre: QuadrantGrid.quadrantFor(0.5, 0.5),
        leftEdgeMid: QuadrantGrid.quadrantFor(0.49, 0.5),
        bottomEdgeMid: QuadrantGrid.quadrantFor(0.5, 0.49),
      };
    });

    expect(result).toEqual({
      topRight: 0,
      topLeft: 1,
      bottomLeft: 2,
      bottomRight: 3,
      centre: 0,
      leftEdgeMid: 1,
      bottomEdgeMid: 3,
    });
  });

  test('defaults: missing labels fall back to Q1..Q4 / Low / High; data-quadrant wins over data-x/data-y', async ({ page }) => {
    await page.goto(swotDemo);
    await page.waitForSelector('quadrant-grid[data-upgraded]');

    const state = await page.evaluate(() => {
      const qg = document.createElement('quadrant-grid');
      qg.innerHTML = `
        <span data-quadrant="3" data-x="0.1" data-y="0.9" data-id="explicit">Explicit beats coords</span>
        <span data-quadrant="9" data-id="out-of-range">Bad index</span>
        <span data-id="no-placement">Not captured</span>
        <span data-x="0.2" data-y="0.2" data-id="coords">Coords only</span>`;
      document.body.appendChild(qg);
      const zones = [...qg.querySelectorAll('.qg-grid > .qg-quadrant')];
      return {
        upgraded: qg.hasAttribute('data-upgraded'),
        regionLabel: qg.querySelector('.qg-wrapper')?.getAttribute('aria-label'),
        labels: zones.map((s) => s.querySelector('.qg-quadrant-label')?.textContent),
        xScale: [...qg.querySelectorAll('.qg-x-scale span')].map((s) => s.textContent),
        yScale: [...qg.querySelectorAll('.qg-y-scale span')].map((s) => s.textContent),
        placement: Object.fromEntries(zones.map((s) => [s.dataset.quadrantZone, [...s.querySelectorAll('[data-id]')].map((el) => el.dataset.id)])),
        explicitPinned: qg.querySelector('[data-id="explicit"]').classList.contains('qg-pinned'),
        explicitLocalX: qg.querySelector('[data-id="explicit"]').style.getPropertyValue('--qg-local-x'),
        uncapturedStillDirectChild: qg.querySelector(':scope > [data-id="no-placement"]') !== null,
      };
    });

    expect(state.upgraded).toBe(true);
    expect(state.regionLabel).toBe(' ×  quadrant grid');
    expect(state.labels).toEqual(['Q1', 'Q2', 'Q3', 'Q4']);
    expect(state.xScale).toEqual(['Low', 'High']);
    expect(state.yScale).toEqual(['High', 'Low']);

    expect(state.placement).toEqual({
      0: ['out-of-range'],   // invalid data-quadrant with no coords → Q1
      1: [],
      2: ['coords'],         // (0.2, 0.2) → bottom-left
      3: ['explicit'],       // data-quadrant="3" overrides (0.1, 0.9)
    });
    // Coordinates still pin the child, re-based within the explicit quadrant (Q4: x - 0.5).
    expect(state.explicitPinned).toBe(true);
    expect(parseFloat(state.explicitLocalX)).toBeCloseTo(-0.8, 4);
    // Children with neither data-quadrant nor coords are left where they were.
    expect(state.uncapturedStillDirectChild).toBe(true);
  });

  test('drag-surface:transfer between quadrants fires quadrant-grid:move { item, itemId, from, to } and updates data-quadrant', async ({ page }) => {
    await page.goto(basicDemo);
    await page.waitForSelector('quadrant-grid[data-upgraded]');
    await page.waitForSelector('quadrant-grid drag-surface[data-upgraded]');

    const result = await page.evaluate(() => {
      const qg = document.querySelector('quadrant-grid');
      const surfaceFor = (zone) => qg.querySelector(`.qg-quadrant[data-quadrant-zone="${zone}"] > drag-surface`);
      const fromSurface = surfaceFor(1);   // Quick Wins
      const toSurface = surfaceFor(0);     // Big Bets
      const item = qg.querySelector('[data-id="b"]');

      const fired = [];
      qg.addEventListener('quadrant-grid:move', (e) => {
        fired.push({
          bubbles: e.bubbles,
          keys: Object.keys(e.detail).sort(),
          sameItem: e.detail.item === item,
          itemId: e.detail.itemId,
          from: e.detail.from,
          to: e.detail.to,
        });
      });

      // Mirror what <drag-surface> does on a cross-surface drop: move the
      // node, then announce the transfer on the receiving surface.
      toSurface.appendChild(item);
      toSurface.dispatchEvent(new CustomEvent('drag-surface:transfer', {
        bubbles: true,
        detail: { item, itemId: item.dataset.id, fromSurface, toSurface, newIndex: 1, fromOrder: ['a'], toOrder: ['c', 'b'] },
      }));

      // A transfer from a surface the grid does not own is ignored.
      const foreign = document.createElement('drag-surface');
      document.body.appendChild(foreign);
      toSurface.dispatchEvent(new CustomEvent('drag-surface:transfer', {
        bubbles: true,
        detail: { item, itemId: 'b', fromSurface: foreign, toSurface },
      }));

      return {
        fired,
        itemQuadrantAttr: item.getAttribute('data-quadrant'),
        liveText: qg.querySelector(':scope > .qg-live-region')?.textContent,
        zone0Ids: [...surfaceFor(0).querySelectorAll(':scope > [data-id]')].map((el) => el.dataset.id),
        zone1Ids: [...surfaceFor(1).querySelectorAll(':scope > [data-id]')].map((el) => el.dataset.id),
      };
    });

    expect(result.fired).toEqual([{
      bubbles: true,
      keys: ['from', 'item', 'itemId', 'to'],
      sameItem: true,
      itemId: 'b',
      from: 1,
      to: 0,
    }]);
    expect(result.itemQuadrantAttr).toBe('0');
    expect(result.liveText).toBe('Moved Add 2FA to Big Bets');
    expect(result.zone0Ids).toEqual(['c', 'b']);
    expect(result.zone1Ids).toEqual(['a']);
  });
});
