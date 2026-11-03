/**
 * empathy-map — data API (property setter) contract.
 *
 * Split out of the former phase5c-planning-data-api.spec.js (ported from
 * vanilla-breeze core). Navigates to this pack's demo page, where the live
 * HTML-first component upgrades.
 */

import { test, expect } from '@playwright/test';

test('empathy-map: .data setter populates quadrants and slotted content', async ({ page }) => {
  await page.goto('demos/empathy-map-basic/');
  await page.waitForFunction(() => document.querySelector('empathy-map[data-upgraded]'));

  const result = await page.evaluate(() => {
    const em = document.querySelector('empathy-map');
    const fired = [];
    em.addEventListener('empathy-map:data-changed', (e) => {
      fired.push(e.detail.source);
    });
    em.data = {
      persona: 'Alex',
      quadrants: {
        says:   ['I need this'],
        thinks: ['Is it worth it?'],
        does:   ['Searches docs'],
        feels:  ['Hopeful'],
      },
      goals: ['Ship faster'],
      painPoints: ['Tooling friction'],
    };
    return {
      fired,
      persona: em.getAttribute('persona'),
      data: em.data,
    };
  });

  expect(result.fired).toEqual(['property']);
  expect(result.persona).toBe('Alex');
  expect(result.data.quadrants.says).toEqual(['I need this']);
  expect(result.data.goals).toEqual(['Ship faster']);
});
