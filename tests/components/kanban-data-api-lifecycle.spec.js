/**
 * kanban-board — lifecycle: src loading, reconnect, repeated setup,
 * announcements, .columns re-routing, two instances.
 *
 * Drags are driven through the `drag-surface:transfer` event the board
 * listens for (the gesture itself belongs to <drag-surface>).
 */

import { test, expect } from '@playwright/test';

const demoPage = 'demos/kanban-board-basic/';

const FIXTURE = {
  columns: [
    {
      id: 'todo', label: 'To Do', items: [
        { storyId: 'US-1', persona: 'Editor', action: 'schedule a post', benefit: 'it ships on time', title: 'Schedule posts', priority: 'high' },
        { id: 'plain-1', text: 'Plain card' },
      ],
    },
    { id: 'done', label: 'Done', wip: 2, items: [] },
  ],
};

/** Route `url` to a JSON body and count the requests it receives. */
async function routeJson(page, glob, body, delayMs = 0) {
  const hits = { count: 0 };
  await page.route(glob, async (route) => {
    hits.count += 1;
    if (delayMs) await new Promise((r) => setTimeout(r, delayMs));
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body) });
  });
  return hits;
}

test.describe('kanban-board — lifecycle', () => {

  test('src mode: one request, ready fires once after the data renders, stories get slotted content', async ({ page }) => {
    const hits = await routeJson(page, '**/fixtures/kanban.json', FIXTURE);
    await page.goto(demoPage);
    await page.waitForSelector('kanban-board[data-upgraded]');

    await page.evaluate(() => {
      window.__ready = [];
      const board = document.createElement('kanban-board');
      board.id = 'src-board';
      board.addEventListener('kanban-board:ready', (e) => {
        window.__ready.push({ ...e.detail, cards: board.querySelectorAll('[draggable="true"]').length });
      });
      board.setAttribute('src', '/fixtures/kanban.json');
      document.body.appendChild(board);
    });
    await page.waitForFunction(() => window.__ready.length > 0);
    await page.waitForTimeout(400);

    const state = await page.evaluate(() => {
      const board = document.getElementById('src-board');
      const story = board.querySelector('user-story');
      return {
        ready: window.__ready,
        columns: [...board.querySelectorAll('.kb-column')].map((c) => c.dataset.columnId),
        persona: story.querySelector(':scope > [slot="persona"]')?.textContent,
        action: story.querySelector(':scope > [slot="action"]')?.textContent,
        benefit: story.querySelector(':scope > [slot="benefit"]')?.textContent,
        title: story.querySelector(':scope > [slot="title"]')?.textContent,
        personaAttr: story.hasAttribute('persona'),
        storyId: story.getAttribute('story-id'),
        dataId: story.dataset.id,
        plain: board.querySelector('[data-id="plain-1"]')?.textContent,
        items: board.items.map((it) => it.id),
        shells: board.querySelectorAll(':scope > .kb-columns').length,
      };
    });

    expect(hits.count).toBe(1);
    expect(state.ready).toEqual([{ columnCount: 2, itemCount: 2, cards: 2 }]);
    expect(state.columns).toEqual(['todo', 'done']);
    expect(state.persona).toBe('Editor');
    expect(state.action).toBe('schedule a post');
    expect(state.benefit).toBe('it ships on time');
    expect(state.title).toBe('Schedule posts');
    expect(state.personaAttr).toBe(false);
    expect(state.storyId).toBe('US-1');
    expect(state.dataId).toBe('US-1');
    expect(state.plain).toBe('Plain card');
    expect(state.items).toEqual(['US-1', 'plain-1']);
    expect(state.shells).toBe(1);
  });

  test('src change: a stale response is ignored and each src is fetched once', async ({ page }) => {
    const slow = await routeJson(page, '**/fixtures/slow.json', { columns: [{ id: 'slow', items: [{ id: 's', text: 'Slow' }] }] }, 500);
    const fast = await routeJson(page, '**/fixtures/fast.json', { columns: [{ id: 'fast', items: [{ id: 'f', text: 'Fast' }] }] });
    await page.goto(demoPage);
    await page.waitForSelector('kanban-board[data-upgraded]');

    await page.evaluate(() => {
      window.__ready = 0;
      const board = document.createElement('kanban-board');
      board.id = 'src-board';
      board.addEventListener('kanban-board:ready', () => { window.__ready += 1; });
      board.setAttribute('src', '/fixtures/slow.json');
      document.body.appendChild(board);
      setTimeout(() => board.setAttribute('src', '/fixtures/fast.json'), 50);
    });
    await page.waitForTimeout(900);

    const state = await page.evaluate(() => ({
      ready: window.__ready,
      columns: [...document.querySelectorAll('#src-board .kb-column')].map((c) => c.dataset.columnId),
    }));
    expect(slow.count).toBe(1);
    expect(fast.count).toBe(1);
    expect(state.columns).toEqual(['fast']);
    expect(state.ready).toBe(1);
  });

  test('reconnect: moving the board keeps cards, does not duplicate title/shell/live region, and does not refetch', async ({ page }) => {
    const hits = await routeJson(page, '**/fixtures/kanban.json', FIXTURE);
    await page.goto(demoPage);
    await page.waitForSelector('kanban-board[data-upgraded]');

    await page.evaluate(() => {
      window.__ready = 0;
      const board = document.createElement('kanban-board');
      board.id = 'src-board';
      board.setAttribute('title', 'Data board');
      board.addEventListener('kanban-board:ready', () => { window.__ready += 1; });
      board.setAttribute('src', '/fixtures/kanban.json');
      document.body.appendChild(board);
    });
    await page.waitForFunction(() => window.__ready === 1);

    const state = await page.evaluate(() => {
      const snapshot = (board) => ({
        cards: board.querySelectorAll('[draggable="true"]').length,
        titles: board.querySelectorAll('.kb-title').length,
        shells: board.querySelectorAll(':scope > .kb-columns').length,
        live: board.querySelectorAll('.kb-live-region').length,
        upgraded: board.hasAttribute('data-upgraded'),
      });
      const authored = document.querySelector('kanban-board:not(#src-board)');
      const data = document.getElementById('src-board');
      const before = { authored: snapshot(authored), data: snapshot(data) };
      const host = document.createElement('div');
      document.body.appendChild(host);
      host.append(authored, data);
      return { before, after: { authored: snapshot(authored), data: snapshot(data) }, itemsAfter: authored.items.length };
    });
    await page.waitForTimeout(300);

    expect(state.before.authored.cards).toBeGreaterThan(0);
    expect(state.after).toEqual(state.before);
    expect(state.after.data).toEqual({ cards: 2, titles: 1, shells: 1, live: 1, upgraded: true });
    expect(state.itemsAfter).toBe(state.before.authored.cards);
    expect(hits.count).toBe(1);
    expect(await page.evaluate(() => window.__ready)).toBe(1);
  });

  test('listeners do not stack: after reconnect and a manual setup() call, a transfer fires once', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector('kanban-board[data-upgraded]');

    const result = await page.evaluate(() => {
      const board = document.querySelector('kanban-board');
      const parent = board.parentElement;
      board.remove();
      parent.appendChild(board);
      board.setup();
      board.setup();

      let transfers = 0;
      board.addEventListener('kanban-board:transfer', () => { transfers += 1; });
      const surfaces = board.querySelectorAll('drag-surface');
      const item = surfaces[0].querySelector('[draggable="true"]');
      surfaces[1].appendChild(item);
      surfaces[1].dispatchEvent(new CustomEvent('drag-surface:transfer', {
        bubbles: true,
        detail: { item, itemId: item.dataset.id, fromSurface: surfaces[0], toSurface: surfaces[1], newIndex: 0 },
      }));
      return { transfers, shells: board.querySelectorAll(':scope > .kb-columns').length };
    });
    expect(result).toEqual({ transfers: 1, shells: 1 });
  });

  test('announces the card text and column labels, not a generated id', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector('kanban-board[data-upgraded]');

    await page.evaluate(() => {
      const board = document.querySelector('kanban-board');
      const surfaces = board.querySelectorAll('drag-surface');
      const item = board.querySelector('[data-id="PROJ-201"]');
      surfaces[1].appendChild(item);
      surfaces[1].dispatchEvent(new CustomEvent('drag-surface:transfer', {
        bubbles: true,
        detail: { item, itemId: 'PROJ-201', fromSurface: surfaces[0], toSurface: surfaces[1], newIndex: 0 },
      }));

      // An authored card without data-id gets a generated one; the
      // announcement must still use its text.
      const plain = document.createElement('kanban-board');
      plain.id = 'plain';
      plain.innerHTML = `
        <section data-column="a" data-column-label="Alpha"><article>Write the spec</article></section>
        <section data-column="b" data-column-label="Beta"></section>`;
      document.body.appendChild(plain);
      const [from, to] = plain.querySelectorAll('drag-surface');
      const card = from.querySelector('article');
      to.appendChild(card);
      to.dispatchEvent(new CustomEvent('drag-surface:transfer', {
        bubbles: true,
        detail: { item: card, itemId: card.dataset.id, fromSurface: from, toSurface: to, newIndex: 0 },
      }));
    });
    await page.waitForFunction(() => document.querySelector('#plain .kb-live-region')?.textContent);

    const texts = await page.evaluate(() => [...document.querySelectorAll('.kb-live-region')].map((r) => r.textContent));
    expect(texts[0]).toBe('view all project timelines in one dashboard moved from Backlog to In Progress');
    expect(texts[1]).toBe('Write the spec moved from Alpha to Beta');
  });

  test('.columns setter re-routes existing cards instead of dropping them', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector('kanban-board[data-upgraded]');

    await page.evaluate(() => {
      const board = document.querySelector('kanban-board');
      window.__node = board.querySelector('[data-id="PROJ-201"]');
      window.__changed = [];
      board.addEventListener('kanban-board:items-changed', (e) => window.__changed.push(e.detail));
      // Keep backlog + done (renamed), drop in-progress + review.
      board.columns = [
        { id: 'done', label: 'Shipped' },
        { id: 'backlog', label: 'Later' },
      ];
    });
    await page.waitForFunction(() => document.querySelectorAll('kanban-board .kb-column').length === 2);

    const state = await page.evaluate(() => {
      const board = document.querySelector('kanban-board');
      const domIds = [...board.querySelectorAll('[draggable="true"]')].map((el) => el.dataset.id);
      return {
        labels: [...board.querySelectorAll('.kb-column h3')].map((h) => h.firstChild.textContent),
        domIds,
        itemIds: board.items.map((it) => it.id),
        sameNode: board.querySelector('[data-id="PROJ-201"]') === window.__node,
        counts: [...board.querySelectorAll('.kb-count')].map((c) => c.textContent),
        changed: window.__changed.map((d) => ({ source: d.source, n: d.items.length })),
      };
    });
    expect(state.labels).toEqual(['Shipped', 'Later']);
    expect(state.domIds).toEqual(['PROJ-190', 'PROJ-193', 'PROJ-201', 'PROJ-204', 'PROJ-207']);
    expect(state.itemIds).toEqual(state.domIds);
    expect(state.sameNode).toBe(true);
    expect(state.counts).toEqual(['2', '3']);
    expect(state.changed).toEqual([{ source: 'api', n: 5 }]);
  });

  test('JS-first: .columns set before connect gives every surface the board group', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector('kanban-board[data-upgraded]');
    const state = await page.evaluate(() => {
      const board = document.createElement('kanban-board');
      board.columns = [{ id: 'todo', label: 'To Do' }, { id: 'done', label: 'Done' }];
      document.body.appendChild(board);
      const groups = [...board.querySelectorAll('drag-surface')].map((s) => s.getAttribute('group'));
      const others = [...document.querySelectorAll('kanban-board')].filter((b) => b !== board)
        .flatMap((b) => [...b.querySelectorAll('drag-surface')].map((s) => s.getAttribute('group')));
      return { groups, others };
    });
    expect(state.groups).toHaveLength(2);
    expect(state.groups[0]).toBeTruthy();
    expect(state.groups[1]).toBe(state.groups[0]);
    expect(state.others).not.toContain(state.groups[0]);
  });

  test('two src boards on one page render independently', async ({ page }) => {
    const a = await routeJson(page, '**/fixtures/a.json', { columns: [{ id: 'x', items: [{ id: 'a1', text: 'A one' }] }, { id: 'y', items: [] }] });
    const b = await routeJson(page, '**/fixtures/b.json', { columns: [{ id: 'x', items: [{ id: 'b1', text: 'B one' }, { id: 'b2', text: 'B two' }] }] });
    await page.goto(demoPage);
    await page.waitForSelector('kanban-board[data-upgraded]');

    await page.evaluate(() => {
      window.__ready = {};
      for (const name of ['a', 'b']) {
        const board = document.createElement('kanban-board');
        board.id = `board-${name}`;
        board.addEventListener('kanban-board:ready', (e) => { window.__ready[name] = (window.__ready[name] || 0) + 1; });
        board.setAttribute('src', `/fixtures/${name}.json`);
        document.body.appendChild(board);
      }
    });
    await page.waitForFunction(() => window.__ready.a && window.__ready.b);
    await page.waitForTimeout(300);

    const state = await page.evaluate(() => {
      const read = (id) => {
        const board = document.getElementById(id);
        return {
          cards: [...board.querySelectorAll('[draggable="true"]')].map((el) => el.textContent),
          groups: [...new Set([...board.querySelectorAll('drag-surface')].map((s) => s.getAttribute('group')))],
          live: board.querySelectorAll('.kb-live-region').length,
        };
      };
      return { a: read('board-a'), b: read('board-b'), ready: window.__ready };
    });
    expect(a.count).toBe(1);
    expect(b.count).toBe(1);
    expect(state.ready).toEqual({ a: 1, b: 1 });
    expect(state.a.cards).toEqual(['A one']);
    expect(state.b.cards).toEqual(['B one', 'B two']);
    expect(state.a.groups).toHaveLength(1);
    expect(state.b.groups).toHaveLength(1);
    expect(state.a.groups[0]).not.toBe(state.b.groups[0]);
    expect(state.a.live).toBe(1);
    expect(state.b.live).toBe(1);
  });
});
