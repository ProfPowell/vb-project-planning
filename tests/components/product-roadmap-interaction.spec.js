/**
 * product-roadmap — interaction, inclusive ends, keyboard, cross-lane move
 *
 * 0.2.2 regressions: a click in editable mode used to snap and rewrite the
 * dates (and never fired select); single-quarter bars collapsed to zero
 * width after a click; `data-end` was treated as exclusive; bars were not
 * focusable; cross-lane `move` could not trigger because pointerdown
 * suppressed native dragstart.
 */

import { test, expect } from '@playwright/test';

test.use({ timezoneId: 'America/Los_Angeles' });

const basicDemo = 'demos/product-roadmap-basic/';
const editableDemo = 'demos/product-roadmap-editable/';

/** Record roadmap events on window.__rmEvents. */
async function recordEvents(page) {
  await page.evaluate(() => {
    window.__rmEvents = [];
    for (const name of ['select', 'reschedule', 'resize', 'move']) {
      document.addEventListener(`product-roadmap:${name}`, (e) => {
        const { initiative, ...rest } = e.detail;
        window.__rmEvents.push({ name, title: initiative?.querySelector('h1, h2, h3')?.textContent ?? null, ...rest });
      });
    }
  });
}

/** Mount a roadmap built from `html` into the demo page and return nothing. */
async function mount(page, attrs, html) {
  await page.evaluate(({ attrs, html }) => {
    document.querySelectorAll('product-roadmap').forEach((r) => r.remove());
    const rm = document.createElement('product-roadmap');
    for (const [k, v] of Object.entries(attrs)) rm.setAttribute(k, v);
    rm.innerHTML = html;
    document.body.prepend(rm);
  }, { attrs, html });
}

test.describe('product-roadmap — interaction', () => {

  test('editable: a plain click selects and does not reschedule', async ({ page }) => {
    await page.goto(editableDemo);
    await page.waitForSelector('product-roadmap[data-upgraded]');
    await recordEvents(page);

    const bar = page.locator('product-roadmap .rm-lane[data-lane="Growth"] .rm-bar');
    await bar.click();
    await page.waitForTimeout(20);

    const state = await page.evaluate(() => {
      const src = document.querySelector('product-roadmap > section[data-lane="Growth"] > article');
      return {
        events: window.__rmEvents,
        srcStart: src.getAttribute('data-start'),
        srcEnd: src.getAttribute('data-end'),
      };
    });
    expect(state.events).toEqual([{
      name: 'select', title: 'Onboarding rewrite', lane: 'Growth',
      start: '2026-10-01', end: '2027-03-31', status: 'planned',
    }]);
    // The author's data is untouched (still the quarter shorthand).
    expect(state.srcStart).toBe('2026-Q4');
    expect(state.srcEnd).toBe('2027-Q1');
  });

  test('editable: a single-quarter bar survives a click', async ({ page }) => {
    await page.goto(editableDemo);
    await page.waitForSelector('product-roadmap[data-upgraded]');
    await mount(page, { start: '2026-Q3', end: '2027-Q2', editable: '' },
      `<section data-lane="L"><article data-start="2026-Q3" data-end="2026-Q3" data-status="shipped"><h3>One quarter</h3></article></section>`);
    await recordEvents(page);

    const bar = page.locator('product-roadmap .rm-bar');
    await bar.click();
    await page.mouse.click(5, 5);       // click elsewhere, then on the bar again
    await bar.click();
    await page.waitForTimeout(20);

    const state = await page.evaluate(() => {
      const b = document.querySelector('product-roadmap .rm-bar');
      return {
        exists: !!b,
        start: b?.dataset.start,
        end: b?.dataset.end,
        w: parseFloat(b?.style.getPropertyValue('--rm-w') ?? '0'),
        names: window.__rmEvents.map((e) => e.name),
      };
    });
    expect(state.exists).toBe(true);
    expect(state.start).toBe('2026-07-01');
    expect(state.end).toBe('2026-09-30');
    expect(state.w).toBeCloseTo(92 / 365, 3);
    expect(state.names).toEqual(['select', 'select']);
  });

  test('end dates are inclusive: data-start == data-end renders a one-day bar', async ({ page }) => {
    await page.goto(basicDemo);
    await page.waitForSelector('product-roadmap[data-upgraded]');
    await mount(page, { start: '2026-01-01', end: '2026-01-31', view: 'month' },
      `<section data-lane="L">
         <article data-start="2026-01-10" data-end="2026-01-10"><h3>Launch day</h3></article>
         <article data-start="2026-01-01" data-end="2026-01-31"><h3>Whole month</h3></article>
       </section>`);

    const bars = await page.evaluate(() => [...document.querySelectorAll('product-roadmap .rm-bar')].map((b) => ({
      title: b.querySelector('.rm-bar-title').textContent,
      x: parseFloat(b.style.getPropertyValue('--rm-x')),
      w: parseFloat(b.style.getPropertyValue('--rm-w')),
    })));
    expect(bars.map((b) => b.title)).toEqual(['Launch day', 'Whole month']);
    expect(bars[0].x).toBeCloseTo(9 / 31, 3);
    expect(bars[0].w).toBeCloseTo(1 / 31, 3);
    expect(bars[1].x).toBe(0);
    expect(bars[1].w).toBe(1);
  });

  test('bars are focusable buttons whose name starts with the visible title and status; Enter and Space select', async ({ page }) => {
    await page.goto(basicDemo);
    await page.waitForSelector('product-roadmap[data-upgraded]');
    await recordEvents(page);

    const bar = page.locator('product-roadmap .rm-lane[data-lane="Mobile"] .rm-bar').first();
    await expect(bar).toHaveAttribute('role', 'button');
    await expect(bar).toHaveAttribute('tabindex', '0');
    await expect(bar).toHaveAccessibleName(/^iOS rewrite, At risk — /);
    await expect(bar.locator('.rm-bar-status')).toHaveText('At risk');

    await bar.focus();
    await page.keyboard.press('Enter');
    await page.keyboard.press(' ');
    const names = await page.evaluate(() => window.__rmEvents.map((e) => `${e.name}:${e.title}`));
    expect(names).toEqual(['select:iOS rewrite', 'select:iOS rewrite']);
  });

  test('editable keyboard: arrows reschedule, Shift+arrows resize, Alt+arrows change lane; focus is kept', async ({ page }) => {
    await page.goto(editableDemo);
    await page.waitForSelector('product-roadmap[data-upgraded]');
    await recordEvents(page);

    const bar = page.locator('product-roadmap .rm-lane[data-lane="Platform"] .rm-bar');
    await expect(bar).toHaveAttribute('aria-describedby', /-help$/);
    await bar.focus();
    await page.keyboard.press('ArrowRight');        // Q3–Q4 → Q4–Q1
    await page.keyboard.press('Shift+ArrowLeft');   // end one quarter earlier → Q4 only
    await page.keyboard.press('Alt+ArrowDown');     // Platform → Growth

    const state = await page.evaluate(() => {
      const rm = document.querySelector('product-roadmap');
      const active = document.activeElement;
      return {
        events: window.__rmEvents,
        focusedTitle: active?.classList.contains('rm-bar') ? active.querySelector('.rm-bar-title').textContent : null,
        focusedLane: active?.dataset?.lane,
        sourceLaneOfArticle: [...rm.querySelectorAll(':scope > section')].find((s) =>
          [...s.querySelectorAll('h2, h3')].some((h) => h.textContent === 'Multi-tenant database'))?.dataset.lane,
        live: rm.querySelector('[role="status"]')?.textContent,
      };
    });

    expect(state.events).toEqual([
      { name: 'reschedule', title: 'Multi-tenant database', lane: 'Platform', start: '2026-10-01', end: '2027-03-31' },
      { name: 'resize', title: 'Multi-tenant database', lane: 'Platform', start: '2026-10-01', end: '2026-12-31' },
      { name: 'move', title: 'Multi-tenant database', fromLane: 'Platform', toLane: 'Growth', start: '2026-10-01', end: '2026-12-31' },
    ]);
    expect(state.focusedTitle).toBe('Multi-tenant database');
    expect(state.focusedLane).toBe('Growth');
    expect(state.sourceLaneOfArticle).toBe('Growth');
    expect(state.live).toContain('Multi-tenant database');
  });

  test('editable pointer: dragging a bar onto another lane fires product-roadmap:move', async ({ page }) => {
    await page.goto(editableDemo);
    await page.waitForSelector('product-roadmap[data-upgraded]');
    await recordEvents(page);

    const bar = page.locator('product-roadmap .rm-lane[data-lane="Platform"] .rm-bar');
    const target = page.locator('product-roadmap .rm-track[data-lane="Mobile"]');
    const b = await bar.boundingBox();
    const t = await target.boundingBox();
    const x = b.x + 30;
    await page.mouse.move(x, b.y + b.height / 2);
    await page.mouse.down();
    await page.mouse.move(x, b.y + b.height / 2 + 20, { steps: 4 });
    await page.mouse.move(x, t.y + t.height / 2, { steps: 6 });
    await page.mouse.up();
    await page.waitForTimeout(20);

    const state = await page.evaluate(() => {
      const rm = document.querySelector('product-roadmap');
      return {
        events: window.__rmEvents,
        mobileTitles: [...rm.querySelectorAll('.rm-track[data-lane="Mobile"] .rm-bar-title')].map((s) => s.textContent),
        platformBars: rm.querySelectorAll('.rm-track[data-lane="Platform"] .rm-bar').length,
        sourceMobile: rm.querySelectorAll(':scope > section[data-lane="Mobile"] > article').length,
        dropMarkers: rm.querySelectorAll('[data-drop-target]').length,
      };
    });
    // Purely vertical drag: dates unchanged, so only `move` fires (no select).
    expect(state.events).toEqual([{
      name: 'move', title: 'Multi-tenant database', fromLane: 'Platform', toLane: 'Mobile',
      start: '2026-07-01', end: '2026-12-31',
    }]);
    expect(state.mobileTitles).toContain('Multi-tenant database');
    expect(state.platformBars).toBe(0);
    expect(state.sourceMobile).toBe(2);
    expect(state.dropMarkers).toBe(0);
  });

  test('editable pointer: dragging or resizing an initiative that runs past the range keeps its off-range part', async ({ page }) => {
    await page.goto(editableDemo);
    await page.waitForSelector('product-roadmap[data-upgraded]');
    await mount(page, { start: '2026-Q1', end: '2026-Q4', editable: '' },
      `<section data-lane="L">
         <article data-start="2025-10-01" data-end="2026-06-30"><h3>Early</h3></article>
         <article data-start="2026-07-01" data-end="2027-03-31"><h3>Late</h3></article>
       </section>`);
    await recordEvents(page);

    const track = await page.locator('product-roadmap .rm-track').first().boundingBox();
    const quarter = track.width / 4;
    const drag = async (locator, dx) => {
      const b = await locator.boundingBox();
      const x = b.x + Math.min(20, b.width / 2);
      const y = b.y + b.height / 2;
      await page.mouse.move(x, y);
      await page.mouse.down();
      await page.mouse.move(x + dx / 2, y, { steps: 4 });
      await page.mouse.move(x + dx, y, { steps: 4 });
      await page.mouse.up();
      await page.waitForTimeout(20);
    };

    // Move "Early" (starts a quarter before the range) right by one quarter.
    await drag(page.locator('product-roadmap .rm-bar', { hasText: 'Early' }), quarter);
    // Shrink "Late" (ends a quarter after the range) by one quarter from its handle.
    const handle = page.locator('product-roadmap .rm-bar', { hasText: 'Late' }).locator('.rm-bar-handle');
    const h = await handle.boundingBox();
    await page.mouse.move(h.x + h.width / 2, h.y + h.height / 2);
    await page.mouse.down();
    await page.mouse.move(h.x + h.width / 2 - quarter / 2, h.y + h.height / 2, { steps: 4 });
    await page.mouse.move(h.x + h.width / 2 - quarter, h.y + h.height / 2, { steps: 4 });
    await page.mouse.up();
    await page.waitForTimeout(20);

    const events = await page.evaluate(() => window.__rmEvents.map(({ name, title, start, end }) => ({ name, title, start, end })));
    expect(events).toEqual([
      { name: 'reschedule', title: 'Early', start: '2026-01-01', end: '2026-09-30' },
      { name: 'resize', title: 'Late', start: '2026-07-01', end: '2026-12-31' },
    ]);
  });

  test('reconnect re-renders once and does not stack listeners', async ({ page }) => {
    await page.goto(basicDemo);
    await page.waitForSelector('product-roadmap[data-upgraded]');
    await recordEvents(page);

    const state = await page.evaluate(() => {
      const rm = document.querySelector('product-roadmap');
      const parent = rm.parentElement;
      for (let i = 0; i < 3; i++) { rm.remove(); parent.appendChild(rm); }
      rm.querySelector('.rm-bar').click();
      return {
        wrappers: rm.querySelectorAll(':scope > .rm-wrapper').length,
        bars: rm.querySelectorAll('.rm-bar').length,
        selects: window.__rmEvents.filter((e) => e.name === 'select').length,
      };
    });
    expect(state.wrappers).toBe(1);
    expect(state.bars).toBe(6);
    expect(state.selects).toBe(1);
  });
});
