/**
 * story-map — lifecycle: src loading, reconnect, repeated .activities
 * assignment, announcements, getter round-trip, two instances.
 */

import { test, expect } from '@playwright/test';

const demoPage = 'demos/story-map-basic/';

const FIXTURE = {
  activities: [
    {
      id: 'find', label: 'Find a course', stories: [
        { id: 'S-1', persona: 'Student', action: 'search by topic', benefit: 'I find relevant courses', title: 'Topic search', priority: 'high' },
      ],
    },
    { id: 'enrol', label: 'Enrol', stories: [{ id: 'S-2', title: 'Pay by card' }] },
  ],
};

async function routeJson(page, glob, body, delayMs = 0) {
  const hits = { count: 0 };
  await page.route(glob, async (route) => {
    hits.count += 1;
    if (delayMs) await new Promise((r) => setTimeout(r, delayMs));
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body) });
  });
  return hits;
}

test.describe('story-map — lifecycle', () => {

  test('src mode: one request, ready once after render, stories use user-story slots', async ({ page }) => {
    const hits = await routeJson(page, '**/fixtures/map.json', FIXTURE);
    await page.goto(demoPage);
    await page.waitForSelector('story-map[data-upgraded]');

    await page.evaluate(() => {
      window.__ready = [];
      const map = document.createElement('story-map');
      map.id = 'src-map';
      map.addEventListener('story-map:ready', (e) => window.__ready.push(e.detail));
      map.setAttribute('src', '/fixtures/map.json');
      document.body.appendChild(map);
    });
    await page.waitForFunction(() => window.__ready.length > 0);
    await page.waitForTimeout(400);

    const state = await page.evaluate(() => {
      const map = document.getElementById('src-map');
      const story = map.querySelector('[data-id="S-1"]');
      return {
        ready: window.__ready,
        cols: [...map.querySelectorAll('[data-activity-column]')].map((c) => c.dataset.activityColumn),
        persona: story.querySelector(':scope > [slot="persona"]')?.textContent,
        action: story.querySelector(':scope > [slot="action"]')?.textContent,
        title: story.querySelector(':scope > [slot="title"]')?.textContent,
        attrs: ['persona', 'action', 'title'].filter((a) => story.hasAttribute(a)),
        detail: story.getAttribute('detail'),
        activities: map.activities,
      };
    });
    expect(hits.count).toBe(1);
    expect(state.ready).toEqual([{ activityCount: 2, storyCount: 2 }]);
    expect(state.cols).toEqual(['find', 'enrol']);
    expect(state.persona).toBe('Student');
    expect(state.action).toBe('search by topic');
    expect(state.title).toBe('Topic search');
    expect(state.attrs).toEqual([]);
    expect(state.detail).toBe('compact');
    // The getter round-trips the loaded records.
    expect(state.activities[0].stories[0]).toMatchObject({ id: 'S-1', persona: 'Student', title: 'Topic search' });
    expect(state.activities[1]).toMatchObject({ id: 'enrol', label: 'Enrol', stories: [{ id: 'S-2', title: 'Pay by card' }] });
  });

  test('reconnect keeps stories and a single title/scroll/live region; no refetch', async ({ page }) => {
    const hits = await routeJson(page, '**/fixtures/map.json', FIXTURE);
    await page.goto(demoPage);
    await page.waitForSelector('story-map[data-upgraded]');

    await page.evaluate(() => {
      window.__ready = 0;
      const map = document.createElement('story-map');
      map.id = 'src-map';
      map.setAttribute('title', 'Course journey');
      map.addEventListener('story-map:ready', () => { window.__ready += 1; });
      map.setAttribute('src', '/fixtures/map.json');
      document.body.appendChild(map);
      document.querySelector('story-map:not(#src-map)').setAttribute('title', 'Authored');
    });
    await page.waitForFunction(() => window.__ready === 1);

    const state = await page.evaluate(() => {
      const snap = (m) => ({
        stories: m.querySelectorAll('[draggable="true"]').length,
        titles: m.querySelectorAll('.sm-title').length,
        scrolls: m.querySelectorAll('.sm-scroll').length,
        live: m.querySelectorAll('.sm-live-region').length,
      });
      const maps = [...document.querySelectorAll('story-map')];
      const before = maps.map(snap);
      const host = document.createElement('div');
      document.body.appendChild(host);
      host.append(...maps);
      return { before, after: maps.map(snap) };
    });
    await page.waitForTimeout(300);
    expect(state.before[0]).toMatchObject({ titles: 1, scrolls: 1, live: 1 });
    expect(state.before[0].stories).toBeGreaterThan(0);
    expect(state.after).toEqual(state.before);
    expect(state.after[1]).toEqual({ stories: 2, titles: 1, scrolls: 1, live: 1 });
    expect(hits.count).toBe(1);
    expect(await page.evaluate(() => window.__ready)).toBe(1);
  });

  test('repeated .activities assignment does not stack listeners (transfer/reorder fire once)', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector('story-map[data-upgraded]');

    await page.evaluate(async () => {
      const map = document.querySelector('story-map');
      for (let i = 0; i < 3; i++) {
        map.activities = [
          { id: 'plan', label: 'Plan', stories: [{ id: `p${i}`, title: 'Spike research' }] },
          { id: 'build', label: 'Build', stories: [] },
        ];
      }
      map.setup();
    });
    await page.waitForFunction(() => document.querySelector('story-map [data-id="p2"]'));

    const result = await page.evaluate(() => {
      const map = document.querySelector('story-map');
      const counts = { transfer: 0, reorder: 0 };
      map.addEventListener('story-map:transfer', () => { counts.transfer += 1; });
      map.addEventListener('story-map:reorder', () => { counts.reorder += 1; });
      const surfaces = map.querySelectorAll('drag-surface');
      const item = map.querySelector('[data-id="p2"]');
      surfaces[1].appendChild(item);
      surfaces[1].dispatchEvent(new CustomEvent('drag-surface:transfer', {
        bubbles: true,
        detail: { item, itemId: 'p2', fromSurface: surfaces[0], toSurface: surfaces[1], newIndex: 0 },
      }));
      surfaces[1].dispatchEvent(new CustomEvent('drag-surface:reorder', {
        bubbles: true, detail: { itemId: 'p2', oldIndex: 0, newIndex: 0 },
      }));
      return {
        counts,
        scrolls: map.querySelectorAll('.sm-scroll').length,
        live: map.querySelectorAll('.sm-live-region').length,
        placeholder: !!surfaces[0].querySelector('.sm-empty'),
        badges: [...map.querySelectorAll('.sm-activity-count')].map((b) => b.textContent),
      };
    });
    expect(result).toEqual({ counts: { transfer: 1, reorder: 1 }, scrolls: 1, live: 1, placeholder: true, badges: ['0', '1'] });
  });

  test('announces story text and activity labels, not ids', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector('story-map[data-upgraded]');
    await page.evaluate(() => {
      const map = document.querySelector('story-map');
      const surfaces = map.querySelectorAll('drag-surface');
      const item = map.querySelector('[data-id="PROJ-101"]');
      surfaces[1].appendChild(item);
      surfaces[1].dispatchEvent(new CustomEvent('drag-surface:transfer', {
        bubbles: true,
        detail: { item, itemId: 'PROJ-101', fromSurface: surfaces[0], toSurface: surfaces[1], newIndex: 0 },
      }));
    });
    await page.waitForFunction(() => document.querySelector('story-map .sm-live-region')?.textContent);
    expect(await page.textContent('story-map .sm-live-region'))
      .toBe('interview 10 target users moved from Discovery to Design');
  });

  test('.activities getter reflects drags and round-trips authored user-stories', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector('story-map[data-upgraded]');
    const state = await page.evaluate(() => {
      const map = document.querySelector('story-map');
      const surfaces = map.querySelectorAll('drag-surface');
      const item = map.querySelector('[data-id="PROJ-101"]');
      surfaces[1].appendChild(item);
      const snapshot = map.activities;
      map.activities = snapshot;
      return { snapshot, design: snapshot[1].stories.map((s) => s.id) };
    });
    expect(state.design).toContain('PROJ-101');
    const story = state.snapshot[1].stories.find((s) => s.id === 'PROJ-101');
    expect(story).toMatchObject({ id: 'PROJ-101', storyId: 'PROJ-101', persona: 'Researcher', action: 'interview 10 target users' });
    await page.waitForFunction(() => document.querySelector('story-map [data-id="PROJ-101"] [slot="action"]'));
    expect(await page.textContent('story-map [data-id="PROJ-101"] [slot="action"]')).toBe('interview 10 target users');
  });

  test('two maps on one page have separate groups and live regions', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector('story-map[data-upgraded]');
    const state = await page.evaluate(() => {
      const second = document.createElement('story-map');
      second.innerHTML = '<section data-activity="a"><article data-id="x">X</article></section><section data-activity="b"></section>';
      document.body.appendChild(second);
      const maps = [...document.querySelectorAll('story-map')];
      return maps.map((m) => ({
        groups: [...new Set([...m.querySelectorAll('drag-surface')].map((s) => s.getAttribute('group')))],
        live: m.querySelectorAll('.sm-live-region').length,
      }));
    });
    expect(state[0].groups).toHaveLength(1);
    expect(state[1].groups).toHaveLength(1);
    expect(state[0].groups[0]).not.toBe(state[1].groups[0]);
    expect(state.map((s) => s.live)).toEqual([1, 1]);
  });
});
