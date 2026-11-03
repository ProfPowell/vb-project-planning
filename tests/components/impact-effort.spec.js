/**
 * impact-effort — data API (property setter) contract.
 *
 * Split out of the former phase5c-planning-data-api.spec.js (ported from
 * vanilla-breeze core). Navigates to this pack's demo page, where the live
 * HTML-first component upgrades.
 */

import { test, expect } from '@playwright/test';

test('impact-effort: .items setter routes into quadrant surfaces with diff preservation', async ({ page }) => {
  await page.goto('demos/impact-effort-basic/');
  await page.waitForFunction(() => document.querySelector('impact-effort[data-upgraded]'));

  const result = await page.evaluate(() => {
    const ie = document.querySelector('impact-effort');
    const fired = [];
    ie.addEventListener('impact-effort:items-changed', (e) => {
      fired.push({ source: e.detail.source, count: e.detail.items.length });
    });

    ie.items = [
      { id: 'a', quadrant: 'quick-wins', text: 'Add dark mode' },
      { id: 'b', quadrant: 'big-bets',   text: 'Rebuild auth' },
      { id: 'c', quadrant: 'fill-ins',   text: 'Tweak copy' },
    ];

    const before = new Map();
    for (const el of ie.querySelectorAll('[data-id]')) before.set(el.getAttribute('data-id'), el);

    // Re-assign: move 'a' to big-bets, drop 'c', add 'd'.
    ie.items = [
      { id: 'a', quadrant: 'big-bets', text: 'Add dark mode' },
      { id: 'b', quadrant: 'big-bets', text: 'Rebuild auth' },
      { id: 'd', quadrant: 'money-pit', text: 'Pet project' },
    ];

    return {
      fired,
      preservedA: ie.querySelector('[data-id="a"]') === before.get('a'),
      preservedB: ie.querySelector('[data-id="b"]') === before.get('b'),
      droppedC: !ie.querySelector('[data-id="c"]'),
      addedD: !!ie.querySelector('[data-id="d"]'),
      aQuadrant: ie.querySelector('[data-id="a"]')?.closest('[data-quadrant-zone]')?.getAttribute('data-quadrant-zone'),
    };
  });

  expect(result.fired.length).toBe(2);
  expect(result.preservedA).toBe(true);
  expect(result.preservedB).toBe(true);
  expect(result.droppedC).toBe(true);
  expect(result.addedD).toBe(true);
  expect(result.aQuadrant).toBe('big-bets');
});
