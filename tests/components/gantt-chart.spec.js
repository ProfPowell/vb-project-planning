/**
 * gantt-chart — dates, axis, dependency arrows, data sources, a11y
 *
 * 0.2.2 regressions: ISO dates parsed as UTC (Apr 1 shown as Mar 31 west
 * of UTC); quarter ticks a month late for a Mar 31 start; dependency
 * arrows assumed a 36px row (wrong with `compact` or group spacers); a
 * shared marker id broke arrowheads with two charts; `.tasks` lost on
 * reconnect; listeners stacked per assignment; `src` ignored when set
 * before connect; progress 0–1 vs 0–100; escaped text in aria-label;
 * role="img" on activatable bars.
 */

import { test, expect } from '@playwright/test';

test.use({ timezoneId: 'America/Los_Angeles' });

const demoPage = 'demos/gantt-chart-basic/';

/** Load the demo (for the bundle), then replace the body with `html`. */
async function mount(page, html) {
  await page.goto(demoPage);
  await page.waitForSelector('gantt-chart[data-upgraded]');
  await page.evaluate((h) => { document.body.innerHTML = h; }, html);
}

/** Wait two frames so rAF-drawn arrows and view transitions settle. */
async function frames(page) {
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
}

function row(id, name, start, end, extra = '', progress = 0) {
  return `<tr data-task-id="${id}" ${extra}>
    <td>${name}</td>
    <td><time datetime="${start}">${start}</time></td>
    <td><time datetime="${end}">${end}</time></td>
    <td><progress value="${progress}" max="100">${progress}%</progress></td>
  </tr>`;
}

function chart(attrs, rows) {
  return `<gantt-chart ${attrs}><table><thead><tr><th>Task</th><th>Start</th><th>End</th><th>Progress</th></tr></thead>
    <tbody>${rows.join('')}</tbody></table></gantt-chart>`;
}

test.describe('gantt-chart', () => {

  test('ISO dates are local calendar days: Apr 1 stays Apr 1', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector('gantt-chart[data-upgraded]');

    const state = await page.evaluate(() => {
      const g = document.querySelector('gantt-chart');
      return {
        tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
        start: g.tasks[0].start,
        localApr1: new Date(2026, 3, 1).getTime(),
        dates: g.querySelector('.gc-task-row[data-task-id="research"] .gc-task-dates').textContent,
        label: g.querySelector('.gc-bar[data-task-id="research"]').getAttribute('aria-label'),
      };
    });
    expect(state.tz).toBe('America/Los_Angeles');
    expect(state.start).toBe(state.localApr1);
    expect(state.dates).toBe('Apr 1, 2026 to Apr 7, 2026');
    expect(state.label).toBe('User research: Apr 1, 2026 to Apr 7, 2026, status: done, 100% complete');
  });

  test('quarter ticks align to Apr 1 for a range starting Mar 31', async ({ page }) => {
    await mount(page, chart('view="quarter"', [
      row('a', 'A', '2026-03-31', '2026-06-30'),
      row('b', 'B', '2026-07-01', '2026-12-31'),
    ]));
    const labels = await page.evaluate(() =>
      [...document.querySelectorAll('.gc-date-label')].map((l) => ({ text: l.textContent, left: parseFloat(l.style.left) })));
    expect(labels.map((l) => l.text)).toEqual(['Apr 26', 'Jul 26', 'Oct 26']);
    // Mar 31 → Dec 31 is 275 days; Apr 1 is day 1, Jul 1 day 92, Oct 1 day 184.
    expect(labels[0].left).toBeCloseTo((1 / 275) * 100, 3);
    expect(labels[1].left).toBeCloseTo((92 / 275) * 100, 3);
    expect(labels[2].left).toBeCloseTo((184 / 275) * 100, 3);
  });

  for (const compact of [false, true]) {
    test(`dependency arrows meet row centres and bar edges (${compact ? 'compact, ' : ''}3 groups)`, async ({ page }) => {
      await mount(page, chart(`show-dependencies ${compact ? 'compact' : ''}`, [
        row('a', 'Alpha', '2026-04-01', '2026-04-08', 'data-group="One"'),
        row('b', 'Bravo', '2026-04-08', '2026-04-15', 'data-group="Two" data-depends="a"'),
        row('c', 'Charlie', '2026-04-15', '2026-04-22', 'data-group="Three" data-depends="b"'),
        row('d', 'Delta', '2026-04-22', '2026-04-29', 'data-group="Three" data-depends="a,c"'),
      ]));
      await page.waitForSelector('gantt-chart svg.gc-deps path', { state: 'attached' });

      const res = await page.evaluate(() => {
        const panel = document.querySelector('.gc-bars');
        const pr = panel.getBoundingClientRect();
        const centre = (id) => {
          const r = panel.querySelector(`.gc-bar[data-task-id="${id}"]`).getBoundingClientRect();
          return { y: r.top + r.height / 2 - pr.top, left: ((r.left - pr.left) / panel.clientWidth) * 100, right: ((r.right - pr.left) / panel.clientWidth) * 100 };
        };
        return [...document.querySelectorAll('svg.gc-deps path.gc-dep-line')].map((p) => {
          const n = p.getAttribute('d').match(/-?\d+(\.\d+)?/g).map(Number);
          const from = centre(p.dataset.from);
          const to = centre(p.dataset.to);
          return { from: p.dataset.from, to: p.dataset.to, x1: n[0], y1: n[1], x2: n[n.length - 2], y2: n[n.length - 1], fromC: from, toC: to };
        });
      });

      expect(res.map((r) => `${r.from}>${r.to}`).sort()).toEqual(['a>b', 'a>d', 'b>c', 'c>d']);
      for (const r of res) {
        expect(Math.abs(r.y1 - r.fromC.y)).toBeLessThan(1);
        expect(Math.abs(r.y2 - r.toC.y)).toBeLessThan(1);
        expect(Math.abs(r.x1 - r.fromC.right)).toBeLessThan(0.5);
        expect(Math.abs(r.x2 - r.toC.left)).toBeLessThan(0.5);
      }
    });
  }

  test('two charts each use their own arrowhead marker', async ({ page }) => {
    const rows = [row('a', 'A', '2026-04-01', '2026-04-05'), row('b', 'B', '2026-04-05', '2026-04-10', 'data-depends="a"')];
    await mount(page, chart('show-dependencies id="g1"', rows) + chart('show-dependencies id="g2"', rows));
    await page.waitForFunction(() => document.querySelectorAll('svg.gc-deps path').length === 2);

    const res = await page.evaluate(() => {
      const check = (g) => {
        const path = g.querySelector('path.gc-dep-line');
        const id = path.getAttribute('marker-end').match(/url\(#(.+)\)/)[1];
        const marker = document.getElementById(id);
        return { id, inOwnSvg: !!marker && path.ownerSVGElement.contains(marker), computed: getComputedStyle(path).markerEnd };
      };
      const g1 = document.getElementById('g1');
      const g2 = document.getElementById('g2');
      const before = [check(g1), check(g2)];
      g1.remove();
      return { before, after: check(g2) };
    });
    expect(res.before[0].id).not.toBe(res.before[1].id);
    expect(res.before.every((c) => c.inOwnSvg)).toBe(true);
    expect(res.before[1].computed).toContain(res.before[1].id);
    expect(res.after.inOwnSvg).toBe(true);
  });

  test('JS-first .tasks survive a reconnect; the SR table reflects them', async ({ page }) => {
    await mount(page, '<main></main>');
    const res = await page.evaluate(() => {
      const g = document.createElement('gantt-chart');
      document.querySelector('main').appendChild(g);
      const upgraded = g.hasAttribute('data-upgraded');
      g.tasks = [
        { id: 'T1', name: 'Design', start: '2026-04-01', end: '2026-04-15' },
        { id: 'T2', name: 'Build', start: '2026-04-10', end: '2026-04-25' },
      ];
      g.remove();
      document.body.appendChild(g);
      return {
        upgraded,
        count: g.tasks.length,
        bars: [...g.querySelectorAll('.gc-bar')].map((b) => b.dataset.taskId),
        containers: g.querySelectorAll('.gc-container').length,
        tableNames: [...g.querySelectorAll(':scope > table tbody tr td:first-child')].map((td) => td.textContent),
        tables: g.querySelectorAll(':scope > table').length,
      };
    });
    expect(res).toEqual({ upgraded: true, count: 2, bars: ['T1', 'T2'], containers: 1, tableNames: ['Design', 'Build'], tables: 1 });
  });

  test('HTML-first chart keeps assigned .tasks (not the old table) after a reconnect', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector('gantt-chart[data-upgraded]');
    const res = await page.evaluate(() => {
      const g = document.querySelector('gantt-chart');
      g.tasks = [{ id: 'N', name: 'New', start: '2026-06-01', end: '2026-06-05' }];
      const parent = g.parentElement;
      g.remove();
      parent.appendChild(g);
      return {
        names: g.tasks.map((t) => t.name),
        bars: g.querySelectorAll('.gc-bar, .gc-milestone').length,
        tableRows: [...g.querySelectorAll(':scope > table tbody tr')].map((tr) => tr.cells[0].textContent),
      };
    });
    expect(res).toEqual({ names: ['New'], bars: 1, tableRows: ['New'] });
  });

  test('repeated .tasks assignment: one delegated listener, one task-click per click', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector('gantt-chart[data-upgraded]');
    const clicks = await page.evaluate(() => {
      const g = document.querySelector('gantt-chart');
      const tasks = [{ id: 'X', name: 'X', start: '2026-04-01', end: '2026-04-09' }];
      for (let i = 0; i < 4; i++) g.tasks = tasks;
      let n = 0;
      g.addEventListener('gantt-chart:task-click', () => n++);
      g.querySelector('.gc-bar').click();
      return n;
    });
    expect(clicks).toBe(1);
  });

  test('src set before connect fetches exactly once; JSON progress is a percentage', async ({ page }) => {
    let requests = 0;
    await page.route('**/fixtures/gantt-tasks.json', (route) => {
      requests++;
      route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          title: 'From JSON',
          tasks: [
            { id: 'd', name: 'R&D spike', start: '2026-04-01', end: '2026-04-15', progress: 75, status: 'in-progress' },
            { id: 'l', name: 'Launch', start: '2026-05-01', end: '2026-05-01', milestone: true, depends: ['d'] },
          ],
        }),
      });
    });
    await mount(page, '<main></main>');

    const res = await page.evaluate(() => new Promise((resolve) => {
      const g = document.createElement('gantt-chart');
      g.setAttribute('show-progress', '');
      g.setAttribute('src', '/vb-project-planning/fixtures/gantt-tasks.json');
      g.addEventListener('gantt-chart:tasks-changed', (e) => {
        g.remove();
        document.body.appendChild(g);       // reconnect must not refetch
        const bar = g.querySelector('.gc-bar');
        resolve({
          source: e.detail.source,
          title: g.querySelector('.gc-title')?.textContent,
          progress: g.tasks[0].progress,
          fill: bar.querySelector('.gc-bar-fill').style.width,
          label: bar.getAttribute('aria-label'),
          milestone: g.querySelector('.gc-milestone').getAttribute('aria-label'),
        });
      }, { once: true });
      document.querySelector('main').appendChild(g);
    }));
    await page.waitForTimeout(100);

    expect(requests).toBe(1);
    expect(res.source).toBe('src');
    expect(res.title).toBe('From JSON');
    expect(res.progress).toBe(0.75);
    expect(res.fill).toBe('75%');
    expect(res.label).toBe('R&D spike: Apr 1, 2026 to Apr 15, 2026, status: in progress, 75% complete');
    expect(res.milestone).toBe('Milestone: Launch, May 1, 2026');
  });

  test('.tasks progress accepts a fraction or a percentage', async ({ page }) => {
    await mount(page, '<gantt-chart show-progress></gantt-chart>');
    const res = await page.evaluate(() => {
      const g = document.querySelector('gantt-chart');
      g.tasks = [
        { id: 'f', name: 'Fraction', start: '2026-04-01', end: '2026-04-10', progress: 0.4 },
        { id: 'p', name: 'Percent', start: '2026-04-01', end: '2026-04-10', progress: 40 },
        { id: 'o', name: 'Over', start: '2026-04-01', end: '2026-04-10', progress: 250 },
      ];
      return g.tasks.map((t) => [t.progress, g.querySelector(`.gc-bar[data-task-id="${t.id}"] .gc-bar-fill`).style.width]);
    });
    expect(res).toEqual([[0.4, '40%'], [0.4, '40%'], [1, '100%']]);
  });

  test('bars are buttons with status in the name; status is visible text; Enter activates', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector('gantt-chart[data-upgraded]');

    const bar = page.locator('gantt-chart .gc-bar[data-task-id="api"]');
    await expect(bar).toHaveAttribute('role', 'button');
    await expect(bar).toHaveAccessibleName('API development: Apr 10, 2026 to May 1, 2026, status: in progress, 40% complete');
    await expect(page.locator('gantt-chart .gc-task-row[data-task-id="api"] .gc-task-status')).toHaveText('In progress');
    await expect(page.locator('gantt-chart .gc-milestone')).toHaveAttribute('role', 'button');

    await page.evaluate(() => {
      window.__clicks = [];
      document.addEventListener('gantt-chart:task-click', (e) => window.__clicks.push(e.detail.task.id));
    });
    await bar.focus();
    await page.keyboard.press('Enter');
    await page.keyboard.press(' ');
    expect(await page.evaluate(() => window.__clicks)).toEqual(['api', 'api']);
  });

  test('attribute changes re-render once without duplicating chrome', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector('gantt-chart[data-upgraded]');
    await page.evaluate(() => {
      const g = document.querySelector('gantt-chart');
      g.setAttribute('compact', '');
      g.setAttribute('title', 'Renamed');
      g.setAttribute('view', 'month');
    });
    await frames(page);
    await page.waitForTimeout(400);    // view-transition crossfade
    const res = await page.evaluate(() => {
      const g = document.querySelector('gantt-chart');
      return {
        containers: g.querySelectorAll('.gc-container').length,
        titles: [...g.querySelectorAll('.gc-title')].map((t) => t.textContent),
        lives: g.querySelectorAll('[role="status"]').length,
        firstLabel: g.querySelector('.gc-date-label')?.textContent,
      };
    });
    expect(res).toEqual({ containers: 1, titles: ['Renamed'], lives: 1, firstLabel: 'Apr 1' });
  });
});
