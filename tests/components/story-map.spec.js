/**
 * story-map — data API (property setter) contract.
 *
 * Split out of the former phase5c-planning-data-api.spec.js (ported from
 * vanilla-breeze core). Navigates to this pack's demo page, where the live
 * HTML-first component upgrades.
 */

import { test, expect } from '@playwright/test';

test('story-map: .activities setter rebuilds activity columns + stories', async ({ page }) => {
  await page.goto('demos/story-map-basic/');
  await page.waitForFunction(() => document.querySelector('story-map[data-upgraded]'));

  // In this pack the .activities setter wraps its rebuild in a View
  // Transition (viewTransitionSwap) when already upgraded, so the actual
  // re-setup() — which builds the `[data-activity-column]` shell — lands on
  // the next rendering opportunity rather than synchronously. The
  // activities-changed event still fires synchronously; stash it on window
  // so it survives the async boundary, then wait for the columns to render.
  await page.evaluate(() => {
    const sm = document.querySelector('story-map');
    window.__smFired = [];
    sm.addEventListener('story-map:activities-changed', (e) => {
      window.__smFired.push({ source: e.detail.source, count: e.detail.activities.length });
    });
    sm.activities = [
      { id: 'plan', label: 'Plan', stories: [{ id: 'p1', title: 'Spike research' }] },
      { id: 'build', label: 'Build', stories: [{ id: 'b1', title: 'Endpoint' }, { id: 'b2', title: 'UI' }] },
    ];
  });

  await page.waitForFunction(() => {
    const cols = document.querySelectorAll('story-map [data-activity-column]');
    return cols.length === 2
      && cols[0].getAttribute('data-activity-column') === 'plan';
  });

  const result = await page.evaluate(() => {
    const sm = document.querySelector('story-map');
    return {
      fired: window.__smFired,
      cols: [...sm.querySelectorAll('[data-activity-column]')].map(s => s.getAttribute('data-activity-column')),
      storyCount: sm.querySelectorAll('[draggable="true"]').length,
    };
  });

  expect(result.fired).toEqual([{ source: 'property', count: 2 }]);
  expect(result.cols).toEqual(['plan', 'build']);
  expect(result.storyCount).toBe(3);
});
