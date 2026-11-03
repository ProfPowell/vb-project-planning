/**
 * impact-effort — lifecycle: src loading, reconnect, .items getter
 * freshness, label/text, authored-card seeding, announcements.
 */

import { test, expect } from '@playwright/test';

const demoPage = 'demos/impact-effort-basic/';

async function routeJson(page, glob, body) {
  const hits = { count: 0 };
  await page.route(glob, async (route) => {
    hits.count += 1;
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body) });
  });
  return hits;
}

function moveCard(ie, id, toQuadrant) {
  const item = ie.querySelector(`[data-id="${id}"]`);
  const fromSurface = item.closest('drag-surface');
  const toSurface = ie.querySelector(`[data-quadrant-zone="${toQuadrant}"] drag-surface`);
  toSurface.appendChild(item);
  toSurface.dispatchEvent(new CustomEvent('drag-surface:transfer', {
    bubbles: true,
    detail: { item, itemId: id, fromSurface, toSurface, newIndex: 0 },
  }));
}

test.describe('impact-effort — lifecycle', () => {

  test('src mode: one request; ready fires once, after the swap, with the loaded counts', async ({ page }) => {
    const hits = await routeJson(page, '**/fixtures/ie.json', [
      { id: 'a', quadrant: 'quick-wins', label: 'Dark mode' },
      { id: 'b', quadrant: 'big-bets', label: 'Rebuild auth' },
      { id: 'c', quadrant: 'big-bets', storyId: 'US-9', persona: 'Admin', action: 'audit logins' },
    ]);
    await page.goto(demoPage);
    await page.waitForSelector('impact-effort[data-upgraded]');

    await page.evaluate(() => {
      window.__ready = [];
      const ie = document.createElement('impact-effort');
      ie.id = 'src-ie';
      ie.addEventListener('impact-effort:ready', (e) => {
        window.__ready.push({ ...e.detail.quadrantCounts, dom: ie.querySelectorAll('[draggable="true"]').length });
      });
      ie.setAttribute('src', '/fixtures/ie.json');
      document.body.appendChild(ie);
    });
    await page.waitForFunction(() => window.__ready.length > 0);
    await page.waitForTimeout(400);

    const state = await page.evaluate(() => {
      const ie = document.getElementById('src-ie');
      const story = ie.querySelector('user-story');
      return {
        ready: window.__ready,
        text: ie.querySelector('[data-id="a"]').textContent,
        action: story.querySelector(':scope > [slot="action"]')?.textContent,
        personaAttr: story.hasAttribute('persona'),
        items: ie.items.map((it) => `${it.id}:${it.quadrant}`),
      };
    });
    expect(hits.count).toBe(1);
    expect(state.ready).toEqual([{ 'quick-wins': 1, 'big-bets': 2, 'fill-ins': 0, 'money-pit': 0, dom: 3 }]);
    expect(state.text).toBe('Dark mode');
    expect(state.action).toBe('audit logins');
    expect(state.personaAttr).toBe(false);
    expect(state.items).toEqual(['a:quick-wins', 'b:big-bets', 'c:big-bets']);
  });

  test('.items getter reflects drags after assignment and accepts label or text', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector('impact-effort[data-upgraded]');
    const state = await page.evaluate((moveSrc) => {
      const moveCard = new Function(`return (${moveSrc})`)();
      const ie = document.querySelector('impact-effort');
      ie.items = [
        { id: 'a', quadrant: 'quick-wins', label: 'Add dark mode', owner: 'kim' },
        { id: 'b', quadrant: 'big-bets', text: 'Rebuild auth' },
      ];
      const labels = [...ie.querySelectorAll('.ie-card')].map((el) => el.textContent);
      moveCard(ie, 'a', 'money-pit');
      return { labels, items: ie.items, attr: ie.querySelector('[data-id="a"]').dataset.quadrant };
    }, moveCard.toString());
    expect(state.labels).toEqual(['Add dark mode', 'Rebuild auth']);
    expect(state.items).toEqual([
      { id: 'b', quadrant: 'big-bets', text: 'Rebuild auth' },
      { id: 'a', quadrant: 'money-pit', label: 'Add dark mode', owner: 'kim' },
    ]);
    expect(state.attr).toBe('money-pit');
  });

  test('authored cards are seeded: assigning an existing id moves the card instead of duplicating it', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector('impact-effort[data-upgraded]');
    const state = await page.evaluate(() => {
      const ie = document.querySelector('impact-effort');
      const node = ie.querySelector('[data-id="PROJ-201"]');
      const before = ie.items;
      ie.items = [{ id: 'PROJ-201', quadrant: 'big-bets' }, { id: 'new', quadrant: 'fill-ins', label: 'New' }];
      return {
        before: before.find((it) => it.id === 'PROJ-201'),
        copies: ie.querySelectorAll('[data-id="PROJ-201"]').length,
        same: ie.querySelector('[data-id="PROJ-201"]') === node,
        zone: node.closest('[data-quadrant-zone]').dataset.quadrantZone,
        total: ie.querySelectorAll('[draggable="true"]').length,
      };
    });
    expect(state.before).toEqual({ id: 'PROJ-201', quadrant: 'quick-wins', label: 'add CSV export to reports' });
    expect(state.copies).toBe(1);
    expect(state.same).toBe(true);
    expect(state.zone).toBe('big-bets');
    expect(state.total).toBe(2);
  });

  test('reconnect keeps cards and a single title/wrapper/live region; listeners do not stack', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector('impact-effort[data-upgraded]');
    const state = await page.evaluate((moveSrc) => {
      const moveCard = new Function(`return (${moveSrc})`)();
      const ie = document.querySelector('impact-effort');
      ie.setAttribute('title', 'Roadmap triage');
      const snap = () => ({
        cards: ie.querySelectorAll('[draggable="true"]').length,
        titles: ie.querySelectorAll('.ie-title').length,
        wrappers: ie.querySelectorAll('.ie-wrapper').length,
        live: ie.querySelectorAll('.ie-live-region').length,
      });
      const before = snap();
      const host = document.createElement('div');
      document.body.appendChild(host);
      host.appendChild(ie);
      ie.setup();
      const after = snap();
      let moves = 0;
      ie.addEventListener('impact-effort:move', () => { moves += 1; });
      moveCard(ie, 'PROJ-201', 'big-bets');
      return { before, after, moves };
    }, moveCard.toString());
    expect(state.before).toEqual({ cards: 6, titles: 1, wrappers: 1, live: 1 });
    expect(state.after).toEqual(state.before);
    expect(state.moves).toBe(1);
  });

  test('announces the card text, not its id', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector('impact-effort[data-upgraded]');
    await page.evaluate((moveSrc) => {
      const moveCard = new Function(`return (${moveSrc})`)();
      const ie = document.querySelector('impact-effort');
      const card = document.createElement('article');
      card.setAttribute('data-quadrant', 'fill-ins');
      card.textContent = 'Tidy the backlog';
      const fresh = document.createElement('impact-effort');
      fresh.appendChild(card);
      document.body.appendChild(fresh);
      moveCard(fresh, card.dataset.id, 'money-pit');
      moveCard(ie, 'PROJ-201', 'big-bets');
    }, moveCard.toString());
    await page.waitForFunction(() => [...document.querySelectorAll('.ie-live-region')].every((r) => r.textContent));
    const texts = await page.evaluate(() => [...document.querySelectorAll('.ie-live-region')].map((r) => r.textContent));
    expect(texts).toEqual(['Moved add CSV export to reports to Big Bets', 'Moved Tidy the backlog to Money Pit']);
  });
});
