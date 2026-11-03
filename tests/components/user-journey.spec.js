/**
 * user-journey — data API (property setter) contract.
 *
 * Split out of the former phase5c-planning-data-api.spec.js (ported from
 * vanilla-breeze core). Navigates to this pack's demo page, where the live
 * HTML-first component upgrades.
 */

import { test, expect } from '@playwright/test';
import { openUpgradePage, recordedEvents, moveElement } from './helpers/upgrade-page.js';

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

test.describe('user-journey — src, lifecycle and regressions', () => {
  const EVENTS = ['user-journey:ready', 'user-journey:upgraded'];
  const record = {
    title: 'Checkout journey',
    persona: 'Sam',
    phases: [
      { name: 'Browse', emotion: 'curious', actions: ['Scrolls'] },
      { name: 'Pay', emotion: 'frustrated', painPoints: ['Card declined'] },
    ],
  };
  const XSS = '"><img src=x onerror="window.__xss=1">';

  test('src fetches exactly once and user-journey:ready fires once, after the data renders', async ({ page }) => {
    const { requests } = await openUpgradePage(page, {
      events: EVENTS,
      fixtures: { 'journey.json': record },
      body: '<user-journey id="j1" src="journey.json"></user-journey>',
    });
    await page.waitForFunction(() => window.__events.some(e => e.type === 'user-journey:ready'));
    await page.waitForTimeout(100);

    expect(requests['journey.json']).toBe(1);
    expect(await recordedEvents(page, 'user-journey:ready')).toEqual([{
      type: 'user-journey:ready', id: 'j1',
      detail: { title: 'Checkout journey', persona: 'Sam', phaseCount: 2 },
    }]);
    expect(await recordedEvents(page, 'user-journey:upgraded')).toHaveLength(1);
  });

  test('moving the element does not refetch, re-render, or re-fire user-journey:ready', async ({ page }) => {
    const { requests } = await openUpgradePage(page, {
      events: EVENTS,
      fixtures: { 'journey.json': record },
      body: '<user-journey id="j1" src="journey.json"></user-journey>',
    });
    await page.waitForFunction(() => window.__events.some(e => e.type === 'user-journey:ready'));

    const moved = await moveElement(page, '#j1');
    expect(moved).toEqual({ connected: true, sameNode: true, sameHtml: true, upgraded: true });
    expect(requests['journey.json']).toBe(1);
    expect(await recordedEvents(page, 'user-journey:ready')).toHaveLength(1);
  });

  test('ids and emotions from src JSON are rendered as text, never markup', async ({ page }) => {
    await openUpgradePage(page, {
      events: EVENTS,
      fixtures: {
        'evil.json': {
          persona: 'Mallory',
          personaId: XSS,
          phases: [
            { name: 'One', emotion: XSS, storyIds: [XSS] },
            { name: 'Two', emotion: '__proto__' },
          ],
        },
      },
      body: `<user-journey id="j1" src="evil.json" story-ids='${XSS.replace(/'/g, '&#39;')}'></user-journey>`,
    });
    await page.waitForFunction(() => window.__events.some(e => e.type === 'user-journey:ready'));

    const state = await page.evaluate(() => {
      const sr = document.getElementById('j1').shadowRoot;
      return {
        xss: window.__xss ?? null,
        imgs: sr.querySelectorAll('img').length,
        personaHref: sr.querySelector('.persona-ref')?.getAttribute('href'),
        storyHrefs: [...sr.querySelectorAll('.chip--story')].map(a => a.getAttribute('href')),
        emotion: sr.querySelector('.phase-head')?.getAttribute('data-emotion'),
        dots: sr.querySelectorAll('.dot').length,
      };
    });
    const href = `#${encodeURIComponent(XSS)}`;
    expect(state.xss).toBeNull();
    expect(state.imgs).toBe(0);
    expect(state.personaHref).toBe(href);
    expect(state.storyHrefs).toEqual([href, href]);
    expect(state.emotion).toBe(XSS);
    // Unknown / prototype-named emotions fall back to neutral instead of throwing
    expect(state.dots).toBe(2);
  });

  test('phase table is labelled with the slotted journey title', async ({ page }) => {
    await openUpgradePage(page, {
      events: EVENTS,
      fixtures: { 'journey.json': record },
      body: '<user-journey id="j1" src="journey.json"></user-journey>',
    });
    await page.waitForFunction(() => window.__events.some(e => e.type === 'user-journey:ready'));
    const label = await page.evaluate(() =>
      document.getElementById('j1').shadowRoot.querySelector('table').getAttribute('aria-label'));
    expect(label).toBe('Checkout journey — phase breakdown');
  });
});
