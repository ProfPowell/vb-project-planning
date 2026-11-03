/**
 * user-journey — data API (property setter) contract.
 *
 * Split out of the former phase5c-planning-data-api.spec.js (ported from
 * vanilla-breeze core). Navigates to this pack's demo page, where the live
 * HTML-first component upgrades.
 */

import { test, expect } from '@playwright/test';

test('user-journey: .data setter populates phases + slots', async ({ page }) => {
  await page.goto('demos/user-journey-basic/');
  await page.waitForFunction(() => document.querySelector('user-journey[data-upgraded]'));

  const result = await page.evaluate(() => {
    const uj = document.querySelector('user-journey');
    const fired = [];
    uj.addEventListener('user-journey:data-changed', (e) => fired.push(e.detail.source));
    uj.data = {
      persona: 'Sam',
      title: 'Sign-up Journey',
      phases: [
        { name: 'Discover', steps: ['Sees ad'] },
        { name: 'Sign up',  steps: ['Enters email', 'Verifies'] },
      ],
    };
    return { fired, gettable: uj.data.phases?.length, persona: uj.data.persona };
  });

  expect(result.fired).toEqual(['property']);
  expect(result.gettable).toBe(2);
  expect(result.persona).toBe('Sam');
});
