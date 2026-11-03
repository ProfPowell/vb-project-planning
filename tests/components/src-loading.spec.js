/**
 * src loading across components (shared SrcLoader, src/lib/src-loader.js):
 * removing src mid-fetch, superseded requests being aborted, `.tasks` /
 * `.pins` taking precedence over a pending src, and the once-only ready
 * event.
 */

import { test, expect } from '@playwright/test';
import { openUpgradePage, recordedEvents } from './helpers/upgrade-page.js';

const CARDS = [
  { tag: 'work-item', ready: 'work-item:ready', body: '<h3 slot="title">Authored item</h3>', text: 'Authored item' },
  { tag: 'adr-wc', ready: 'adr-wc:ready', body: '<h3 slot="title">Authored ADR</h3>', text: 'Authored ADR' },
  { tag: 'empathy-map', ready: 'empathy-map:ready', body: '<h3 slot="title">Authored map</h3>', text: 'Authored map' },
  { tag: 'user-journey', ready: 'journey-ready', body: '<h3 slot="title">Authored journey</h3>', text: 'Authored journey' },
];

test.describe('src loading', () => {

  for (const card of CARDS) {
    test(`${card.tag}: removing src mid-fetch renders the authored content and fires ready once`, async ({ page }) => {
      await openUpgradePage(page, {
        events: [card.ready],
        fixtures: { 'slow.json': { json: { title: 'From JSON' }, delay: 800 } },
        body: `<${card.tag} id="c" src="slow.json">${card.body}</${card.tag}>`,
      });
      await page.waitForSelector('#c[data-upgraded]');
      expect(await page.evaluate(() => document.getElementById('c').shadowRoot.textContent)).toContain('Loading');

      await page.evaluate(() => document.getElementById('c').removeAttribute('src'));
      await page.waitForTimeout(1100);   // past the delayed response

      const state = await page.evaluate(() => {
        const el = document.getElementById('c');
        return {
          loading: el.shadowRoot.textContent.includes('Loading'),
          titleSlot: el.shadowRoot.querySelector('slot[name="title"]')?.assignedElements()[0]?.textContent,
        };
      });
      expect(state.loading).toBe(false);
      expect(state.titleSlot).toBe(card.text);
      expect(await recordedEvents(page, card.ready)).toHaveLength(1);
    });
  }

  test('user-story: a src record that sets persona-id tracks the persona role live', async ({ page }) => {
    await openUpgradePage(page, {
      events: ['story-ready'],
      fixtures: { 'story.json': { personaId: 'p1', action: 'export reports' } },
      body: `<user-persona id="p1" role="Designer"><h2 slot="name">Pat</h2></user-persona>
             <user-story id="s1" src="story.json"></user-story>`,
    });
    await page.waitForFunction(() => window.__events.some(e => e.type === 'story-ready'));
    const text = () => page.evaluate(() =>
      document.getElementById('s1').shadowRoot.querySelector('.persona-text').textContent.trim());
    expect(await text()).toBe('Designer');

    await page.evaluate(() => document.getElementById('p1').setAttribute('role', 'Engineer'));
    await expect.poll(text).toBe('Engineer');
  });

  test('user-story: a .data record that sets persona-id tracks the persona role live', async ({ page }) => {
    await openUpgradePage(page, {
      events: ['story-ready'],
      body: `<user-persona id="p1" role="Designer"><h2 slot="name">Pat</h2></user-persona>
             <user-story id="s1"><span slot="action">export reports</span></user-story>`,
    });
    await page.waitForSelector('#s1[data-upgraded]');
    await page.evaluate(() => { document.getElementById('s1').data = { personaId: 'p1' }; });
    await page.evaluate(() => document.getElementById('p1').setAttribute('role', 'Engineer'));
    await expect.poll(() => page.evaluate(() =>
      document.getElementById('s1').shadowRoot.querySelector('.persona-text').textContent.trim())).toBe('Engineer');
  });

  test('a superseded src request is aborted (cards, gantt-chart, review-surface)', async ({ page }) => {
    await openUpgradePage(page, {
      events: [],
      fixtures: {
        'a.json': { json: { tasks: [] }, delay: 600 },
        'b.json': { json: { tasks: [] } },
      },
      body: `<work-item id="w" src="a.json"></work-item>
             <gantt-chart id="g" src="a.json"></gantt-chart>
             <review-surface id="r" src="a.json"><p>Doc</p></review-surface>`,
    });
    for (const id of ['w', 'g', 'r']) await page.waitForSelector(`#${id}[data-upgraded]`, { state: 'attached' });
    const failed = [];
    page.on('requestfailed', (req) => { if (req.url().endsWith('/a.json')) failed.push(req.failure()?.errorText); });
    await page.evaluate(() => {
      for (const id of ['w', 'g', 'r']) document.getElementById(id).setAttribute('src', '__fixture__/b.json');
    });
    await page.waitForTimeout(900);
    expect(failed).toHaveLength(3);
  });

  test('gantt-chart: .tasks set before connect wins over the src attribute', async ({ page }) => {
    const { requests } = await openUpgradePage(page, {
      events: [],
      fixtures: { 'g.json': { tasks: [{ id: 'S', name: 'From src', start: '2026-01-01', end: '2026-01-05' }] } },
      body: '',
    });
    await page.waitForFunction(() => customElements.get('gantt-chart'));
    await page.evaluate(() => {
      const g = document.createElement('gantt-chart');
      g.id = 'g';
      g.setAttribute('src', '__fixture__/g.json');
      g.tasks = [{ id: 'P', name: 'From property', start: '2026-02-01', end: '2026-02-05' }];
      document.body.appendChild(g);
    });
    await page.waitForTimeout(400);
    expect(await page.evaluate(() => document.getElementById('g').tasks.map(t => t.name))).toEqual(['From property']);
    expect(requests['g.json']).toBe(0);
  });

  test('gantt-chart: .tasks assigned while src is loading is not clobbered by the response', async ({ page }) => {
    await openUpgradePage(page, {
      events: [],
      fixtures: { 'g.json': { json: { tasks: [{ id: 'S', name: 'From src', start: '2026-01-01', end: '2026-01-05' }] }, delay: 400 } },
      body: '<gantt-chart id="g" src="g.json"></gantt-chart>',
    });
    await page.waitForSelector('#g[data-upgraded]', { state: 'attached' });
    await page.evaluate(() => {
      document.getElementById('g').tasks = [{ id: 'P', name: 'From property', start: '2026-02-01', end: '2026-02-05' }];
    });
    await page.waitForTimeout(700);
    expect(await page.evaluate(() => document.getElementById('g').tasks.map(t => t.name))).toEqual(['From property']);
  });

  test('gantt-chart: ready fires once; a reconnect or a later src load does not re-fire it', async ({ page }) => {
    await openUpgradePage(page, {
      events: ['gantt-chart:ready', 'gantt-chart:tasks-changed'],
      fixtures: { 'g.json': { tasks: [{ id: 'S', name: 'From src', start: '2026-01-01', end: '2026-01-05' }] } },
      body: `<gantt-chart id="g"><table><tbody>
               <tr data-task-id="t1"><td>Task</td><td><time datetime="2026-03-01">Mar 1</time></td><td><time datetime="2026-03-09">Mar 9</time></td></tr>
             </tbody></table></gantt-chart>`,
    });
    await page.waitForSelector('#g[data-upgraded]');
    await page.evaluate(async () => {
      document.getElementById('elsewhere').append(document.getElementById('g'));
      await new Promise(r => setTimeout(r, 50));
    });
    await page.evaluate(() => document.getElementById('g').setAttribute('src', '__fixture__/g.json'));
    await page.waitForFunction(() => window.__events.some(e => e.type === 'gantt-chart:tasks-changed'));
    await page.waitForTimeout(100);
    expect(await recordedEvents(page, 'gantt-chart:ready')).toHaveLength(1);
    const changed = await recordedEvents(page, 'gantt-chart:tasks-changed');
    expect(changed.map(e => e.detail.source)).toEqual(['src']);
  });

  test('review-surface: removing src mid-fetch drops the response and clears the loading status', async ({ page }) => {
    await openUpgradePage(page, {
      events: ['review-surface:ready'],
      fixtures: { 'pins.json': { json: [{ id: 'x', x: 10, y: 10, text: 'From src' }], delay: 500 } },
      body: '<review-surface id="r" src="pins.json"><p>Doc</p></review-surface>',
    });
    await page.waitForSelector('#r[data-upgraded]');
    await page.evaluate(() => document.getElementById('r').removeAttribute('src'));
    await page.waitForTimeout(800);
    const state = await page.evaluate(() => {
      const r = document.getElementById('r');
      return { pins: r.pins.length, statusHidden: r.shadowRoot.querySelector('.rs-status').hidden };
    });
    expect(state).toEqual({ pins: 0, statusHidden: true });
    expect(await recordedEvents(page, 'review-surface:ready')).toHaveLength(1);
  });

  for (const board of [
    { tag: 'kanban-board', changed: 'items-changed', json: { columns: [{ id: 'a', items: [{ id: 'x', text: 'X' }] }] } },
    { tag: 'story-map', changed: 'activities-changed', json: { activities: [{ id: 'a', label: 'A', stories: [] }] } },
    { tag: 'impact-effort', changed: 'items-changed', json: [{ id: 'x', label: 'X', quadrant: 'quick-wins' }] },
  ]) {
    test(`${board.tag}: ready fires once; each src load reports ${board.changed} with source 'src'`, async ({ page }) => {
      const changed = `${board.tag}:${board.changed}`;
      await openUpgradePage(page, {
        events: [`${board.tag}:ready`, changed],
        fixtures: { 'one.json': board.json, 'two.json': board.json },
        body: `<${board.tag} id="b" src="one.json"></${board.tag}>`,
      });
      await page.waitForFunction((t) => window.__events.some(e => e.type === t), `${board.tag}:ready`);
      await page.evaluate(() => document.getElementById('b').setAttribute('src', '__fixture__/two.json'));
      await page.waitForFunction((t) => window.__events.filter(e => e.type === t && e.detail.source === 'src').length === 2, changed);
      await page.waitForTimeout(100);
      expect(await recordedEvents(page, `${board.tag}:ready`)).toHaveLength(1);
    });
  }
});
