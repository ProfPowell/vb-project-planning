/**
 * empathy-map — data API (property setter) contract.
 *
 * Split out of the former phase5c-planning-data-api.spec.js (ported from
 * vanilla-breeze core). Navigates to this pack's demo page, where the live
 * HTML-first component upgrades.
 */

import { test, expect } from '@playwright/test';
import { openUpgradePage, recordedEvents, moveElement } from './helpers/upgrade-page.js';

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

test.describe('empathy-map — src, lifecycle and regressions', () => {
  const EVENTS = ['empathy-map:ready', 'empathy-map:upgraded', 'empathy-map:update'];
  const record = {
    title: 'Researcher map', persona: 'Dana',
    quadrants: { says: ['Show me'], thinks: ['Hmm'], does: ['Tags clips'], feels: ['curious'] },
  };
  const slotted = `<empathy-map id="e1" editable>
      <ul slot="says"><li>Original one</li><li>Original two</li></ul>
    </empathy-map>`;

  test('src fetches exactly once and empathy-map:ready fires once, after the data renders', async ({ page }) => {
    const { requests } = await openUpgradePage(page, {
      events: EVENTS,
      fixtures: { 'map.json': record },
      body: '<empathy-map id="e1" src="map.json"></empathy-map>',
    });
    await page.waitForFunction(() => window.__events.some(e => e.type === 'empathy-map:ready'));
    await page.waitForTimeout(100);

    expect(requests['map.json']).toBe(1);
    expect(await recordedEvents(page, 'empathy-map:ready')).toEqual([{
      type: 'empathy-map:ready', id: 'e1', detail: { title: 'Researcher map', persona: 'Dana' },
    }]);
    expect(await recordedEvents(page, 'empathy-map:upgraded')).toHaveLength(1);
  });

  test('moving the element does not refetch, re-render, or re-fire ready', async ({ page }) => {
    const { requests } = await openUpgradePage(page, {
      events: EVENTS,
      fixtures: { 'map.json': record },
      body: '<empathy-map id="e1" src="map.json"></empathy-map>',
    });
    await page.waitForFunction(() => window.__events.some(e => e.type === 'empathy-map:ready'));

    const moved = await moveElement(page, '#e1');
    expect(moved).toEqual({ connected: true, sameNode: true, sameHtml: true, upgraded: true });
    expect(requests['map.json']).toBe(1);
    expect(await recordedEvents(page, 'empathy-map:ready')).toHaveLength(1);
  });

  test('an edited-then-cleared slotted quadrant stays cleared after a full re-render', async ({ page }) => {
    await openUpgradePage(page, { events: EVENTS, body: slotted });
    await page.waitForSelector('#e1[data-upgraded]');

    await page.evaluate(() => document.getElementById('e1').editQuadrant('says'));
    await page.locator('#e1 .quadrant--says .quadrant__editor').fill('');
    await page.locator('#e1 .quadrant--says .quadrant__done-btn').click();

    const read = () => page.evaluate(() => {
      const sr = document.getElementById('e1').shadowRoot;
      const content = sr.querySelector('.quadrant--says .quadrant__content');
      return {
        hasSlot: !!content.querySelector('slot'),
        text: content.textContent.trim(),
        data: document.getElementById('e1').quadrants?.says,
      };
    });
    expect(await read()).toEqual({ hasSlot: false, text: 'Add says items…', data: [] });

    // A full render (any attribute change) must not bring the slotted items back
    await page.evaluate(() => document.getElementById('e1').setAttribute('compact', ''));
    await page.waitForFunction(() =>
      document.getElementById('e1').shadowRoot.querySelector('.empathy-map--compact'));
    expect(await read()).toEqual({ hasSlot: false, text: 'Add says items…', data: [] });
  });

  test('a re-render while a quadrant editor is open keeps the unsaved text and focus', async ({ page }) => {
    await openUpgradePage(page, { events: EVENTS, body: slotted });
    await page.waitForSelector('#e1[data-upgraded]');

    await page.locator('#e1 .quadrant--says .quadrant__edit-btn').click();
    await page.locator('#e1 .quadrant--says .quadrant__editor').fill('Draft one\nDraft two');
    await page.evaluate(() => { document.getElementById('e1').goals = ['Ship it']; });
    await page.waitForFunction(() => document.getElementById('e1').shadowRoot.querySelector('.empathy-map__footer'));

    const state = await page.evaluate(() => {
      const sr = document.getElementById('e1').shadowRoot;
      return {
        value: sr.querySelector('.quadrant--says .quadrant__editor').value,
        editing: sr.querySelector('.quadrant--says').hasAttribute('data-editing'),
        focused: sr.activeElement?.className,
      };
    });
    expect(state).toEqual({ value: 'Draft one\nDraft two', editing: true, focused: 'quadrant__editor' });
  });

  test('a re-render with a slotted-only quadrant editor open keeps its items, and Done keeps them', async ({ page }) => {
    await openUpgradePage(page, { events: EVENTS, body: slotted });
    await page.waitForSelector('#e1[data-upgraded]');

    await page.evaluate(() => document.getElementById('e1').editQuadrant('says'));
    await page.evaluate(() => document.getElementById('e1').setAttribute('compact', ''));
    await page.waitForFunction(() => document.getElementById('e1').shadowRoot.querySelector('.empathy-map--compact'));
    expect(await page.locator('#e1 .quadrant--says .quadrant__editor').inputValue()).toBe('Original one\nOriginal two');

    await page.locator('#e1 .quadrant--says .quadrant__done-btn').click();
    expect(await page.evaluate(() => document.getElementById('e1').quadrants.says)).toEqual(['Original one', 'Original two']);
  });

  test('Done and Escape return focus to the quadrant edit button', async ({ page }) => {
    await openUpgradePage(page, { events: EVENTS, body: slotted });
    await page.waitForSelector('#e1[data-upgraded]');
    const activeClass = () => page.evaluate(() => {
      const a = document.getElementById('e1').shadowRoot.activeElement;
      return a ? `${a.className}|${a.dataset.quadrant}` : null;
    });

    await page.locator('#e1 .quadrant--says .quadrant__edit-btn').click();
    expect(await activeClass()).toBe('quadrant__editor|says');
    await page.locator('#e1 .quadrant--says .quadrant__done-btn').click();
    expect(await activeClass()).toBe('quadrant__edit-btn|says');

    await page.locator('#e1 .quadrant--thinks .quadrant__edit-btn').click();
    await page.keyboard.press('Escape');
    expect(await activeClass()).toBe('quadrant__edit-btn|thinks');
  });

  test('closeQuadrant() is a no-op unless the quadrant is being edited', async ({ page }) => {
    await openUpgradePage(page, {
      events: EVENTS,
      body: `${slotted}<empathy-map id="ro"></empathy-map>`,
    });
    await page.waitForSelector('#ro[data-upgraded]');

    await page.evaluate(() => {
      document.getElementById('e1').closeQuadrant('says');
      document.getElementById('ro').closeQuadrant('says');
      document.getElementById('ro').editQuadrant('says');
      document.getElementById('ro').closeQuadrant('says');
    });
    expect(await recordedEvents(page, 'empathy-map:update')).toEqual([]);

    await page.evaluate(() => {
      const el = document.getElementById('e1');
      el.editQuadrant('says');
      el.closeQuadrant('says');
    });
    const updates = await recordedEvents(page, 'empathy-map:update');
    expect(updates).toEqual([{
      type: 'empathy-map:update', id: 'e1',
      detail: { quadrant: 'says', items: ['Original one', 'Original two'] },
    }]);
  });

  test('each quadrant has a real heading', async ({ page }) => {
    await openUpgradePage(page, { events: EVENTS, body: slotted });
    await page.waitForSelector('#e1[data-upgraded]');
    const headings = await page.evaluate(() =>
      [...document.getElementById('e1').shadowRoot.querySelectorAll('.quadrant__label')]
        .map(h => `${h.tagName}:${h.textContent.trim()}`));
    expect(headings).toEqual(['H3:Says', 'H3:Thinks', 'H3:Does', 'H3:Feels']);
  });
});
