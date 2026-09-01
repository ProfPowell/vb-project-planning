/**
 * product-roadmap — HTML-first contract
 *
 * Verifies lane/initiative auto-discovery from <section data-lane> +
 * <article data-start data-end>, "YYYY-Qn" date parsing (start → first
 * day, end → last day of the quarter), quarter/month axis ticks, the
 * `today-marker` and `editable` attributes, and the documented
 * `product-roadmap:select` / `product-roadmap:reschedule` events.
 *
 * Navigates to this pack's demo pages where the live, HTML-first
 * `<product-roadmap>` upgrades (basic = read-only, editable = drag wired).
 */

import { test, expect } from '@playwright/test';

const basicDemo = 'demos/product-roadmap-basic/';
const editableDemo = 'demos/product-roadmap-editable/';

test.describe('product-roadmap — HTML-first contract', () => {

  test('upgrades: discovers lanes + initiatives, resolves YYYY-Qn dates, builds quarter axis', async ({ page }) => {
    await page.goto(basicDemo);
    await page.waitForSelector('product-roadmap[data-upgraded]');

    const state = await page.evaluate(() => {
      const rm = document.querySelector('product-roadmap');
      const sourceLanes = [...rm.querySelectorAll(':scope > section[data-lane]')];
      const wrapper = rm.querySelector(':scope > .rm-wrapper');
      return {
        sourceLanesHidden: sourceLanes.every((l) => l.hidden),
        ticks: [...wrapper.querySelectorAll('.rm-axis .rm-tick')].map((t) => t.textContent),
        lanes: [...wrapper.querySelectorAll('.rm-lanes > .rm-lane')].map((l) => ({
          name: l.dataset.lane,
          label: l.querySelector('.rm-lane-label')?.textContent,
          bars: [...l.querySelectorAll('.rm-track > .rm-bar')].map((b) => ({
            title: b.querySelector('.rm-bar-title')?.textContent,
            start: b.dataset.start,
            end: b.dataset.end,
            status: b.dataset.status,
            x: b.style.getPropertyValue('--rm-x'),
            w: b.style.getPropertyValue('--rm-w'),
            aria: b.getAttribute('aria-label'),
            draggable: b.getAttribute('draggable'),
            hasHandle: !!b.querySelector('.rm-bar-handle'),
          })),
        })),
      };
    });

    expect(state.sourceLanesHidden).toBe(true);
    expect(state.ticks).toEqual(['Q3 2026', 'Q4 2026', 'Q1 2027', 'Q2 2027']);
    expect(state.lanes.map((l) => l.name)).toEqual(['Platform', 'Growth', 'Mobile']);
    expect(state.lanes.map((l) => l.label)).toEqual(['Platform', 'Growth', 'Mobile']);
    expect(state.lanes.map((l) => l.bars.length)).toEqual([2, 2, 2]);

    // "2026-Q3" → 2026-07-01 as a start; "2026-Q4" → 2026-12-31 as an end.
    const first = state.lanes[0].bars[0];
    expect(first.title).toBe('Multi-tenant database');
    expect(first.start).toBe('2026-07-01');
    expect(first.end).toBe('2026-12-31');
    expect(first.status).toBe('in-progress');
    expect(first.x).toBe('0.0000');
    expect(parseFloat(first.w)).toBeCloseTo(183 / 364, 3);   // Jul 1 → Dec 31 over a 364-day range
    expect(first.aria).toBe('Multi-tenant database — 2026-07-01 to 2026-12-31 in Platform');

    // A single-quarter initiative spans exactly a quarter of the axis.
    const push = state.lanes[2].bars[1];
    expect(push.title).toBe('Push notifications v2');
    expect(push.start).toBe('2026-07-01');
    expect(push.end).toBe('2026-09-30');
    expect(push.status).toBe('shipped');
    expect(push.x).toBe('0.0000');
    expect(push.w).toBe('0.2500');

    // Read-only: bars are not draggable and carry no resize handle.
    expect(state.lanes.flatMap((l) => l.bars).every((b) => b.draggable === null && !b.hasHandle)).toBe(true);
  });

  test('view="month" renders monthly ticks; bars are clipped to the visible range', async ({ page }) => {
    await page.goto(basicDemo);
    await page.waitForSelector('product-roadmap[data-upgraded]');

    const state = await page.evaluate(() => {
      const rm = document.createElement('product-roadmap');
      rm.setAttribute('start', '2026-01-01');
      rm.setAttribute('end', '2026-04-01');
      rm.setAttribute('view', 'month');
      rm.innerHTML = `
        <section data-lane="Core">
          <article data-start="2025-12-01" data-end="2026-02-01"><h3>Spills in from last year</h3></article>
          <article data-start="2026-03-01" data-end="2026-09-30" data-status="blocked"><h3>Runs past the range</h3></article>
          <article data-start="2026-06-01" data-end="2026-07-01"><h3>Entirely outside</h3></article>
        </section>`;
      document.body.appendChild(rm);

      return {
        upgraded: rm.hasAttribute('data-upgraded'),
        ticks: [...rm.querySelectorAll('.rm-axis .rm-tick')].map((t) => t.textContent),
        bars: [...rm.querySelectorAll('.rm-bar')].map((b) => ({
          title: b.querySelector('.rm-bar-title')?.textContent,
          start: b.dataset.start,
          end: b.dataset.end,
          status: b.dataset.status ?? null,
          x: parseFloat(b.style.getPropertyValue('--rm-x')),
          w: parseFloat(b.style.getPropertyValue('--rm-w')),
        })),
      };
    });

    expect(state.upgraded).toBe(true);
    expect(state.ticks).toEqual(['Jan 2026', 'Feb 2026', 'Mar 2026']);

    // The fully out-of-range initiative gets no bar at all.
    expect(state.bars.map((b) => b.title)).toEqual(['Spills in from last year', 'Runs past the range']);

    // Clipped bars keep their authored dates but their geometry is clamped to [0, 1].
    const [spill, runs] = state.bars;
    expect(spill.start).toBe('2025-12-01');
    expect(spill.end).toBe('2026-02-01');
    expect(spill.x).toBe(0);
    expect(spill.w).toBeCloseTo(31 / 90, 3);        // Jan 1 → Feb 1 over a 90-day range
    expect(runs.start).toBe('2026-03-01');
    expect(runs.end).toBe('2026-09-30');
    expect(runs.status).toBe('blocked');
    expect(runs.x).toBeCloseTo(59 / 90, 3);
    expect(runs.x + runs.w).toBeCloseTo(1, 3);
  });

  test('today-marker renders only when today falls inside the range', async ({ page }) => {
    await page.goto(basicDemo);
    await page.waitForSelector('product-roadmap[data-upgraded]');

    const state = await page.evaluate(() => {
      const year = new Date().getFullYear();
      const make = (start, end, marker) => {
        const rm = document.createElement('product-roadmap');
        rm.setAttribute('start', start);
        rm.setAttribute('end', end);
        if (marker) rm.setAttribute('today-marker', '');
        rm.innerHTML = `<section data-lane="L"><article data-start="${start}" data-end="${end}"><h3>Span</h3></article></section>`;
        document.body.appendChild(rm);
        const today = rm.querySelector('.rm-lanes > .rm-today');
        return {
          upgraded: rm.hasAttribute('data-upgraded'),
          hasMarker: !!today,
          x: today ? parseFloat(today.style.getPropertyValue('--rm-x')) : null,
          title: today?.title ?? null,
        };
      };
      return {
        inRange: make(`${year}-01-01`, `${year + 1}-12-31`, true),
        pastRange: make(`${year - 3}-01-01`, `${year - 2}-12-31`, true),
        noAttr: make(`${year}-01-01`, `${year + 1}-12-31`, false),
        isoToday: (() => {
          const d = new Date();
          return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        })(),
      };
    });

    expect(state.inRange.upgraded).toBe(true);
    expect(state.inRange.hasMarker).toBe(true);
    expect(state.inRange.x).toBeGreaterThan(0);
    expect(state.inRange.x).toBeLessThan(1);
    expect(state.inRange.title).toBe(`Today: ${state.isoToday}`);
    expect(state.pastRange.hasMarker).toBe(false);
    expect(state.noAttr.hasMarker).toBe(false);
  });

  test('bar click fires product-roadmap:select with { initiative, lane, start, end, status }', async ({ page }) => {
    await page.goto(basicDemo);
    await page.waitForSelector('product-roadmap[data-upgraded]');

    const result = await page.evaluate(() => {
      const rm = document.querySelector('product-roadmap');
      const fired = [];
      document.addEventListener('product-roadmap:select', (e) => {
        fired.push({
          bubbles: e.bubbles,
          keys: Object.keys(e.detail).sort(),
          initiativeIsSourceArticle: e.detail.initiative instanceof HTMLElement
            && e.detail.initiative.tagName === 'ARTICLE'
            && rm.querySelector(':scope > section[data-lane="Growth"]').contains(e.detail.initiative),
          initiativeTitle: e.detail.initiative.querySelector('h3')?.textContent,
          lane: e.detail.lane,
          start: e.detail.start,
          end: e.detail.end,
          status: e.detail.status,
        });
      });
      rm.querySelector('.rm-lane[data-lane="Growth"] .rm-bar').click();
      return fired;
    });

    expect(result).toHaveLength(1);
    expect(result[0].bubbles).toBe(true);
    expect(result[0].keys).toEqual(['end', 'initiative', 'lane', 'start', 'status']);
    expect(result[0].initiativeIsSourceArticle).toBe(true);
    expect(result[0].initiativeTitle).toBe('Onboarding rewrite');
    expect(result[0].lane).toBe('Growth');
    expect(result[0].start).toBe('2026-10-01');
    expect(result[0].end).toBe('2027-03-31');
    expect(result[0].status).toBe('planned');
  });

  test('editable: bars are draggable with a resize handle; pointer drag snaps to quarter and fires reschedule', async ({ page }) => {
    await page.goto(editableDemo);
    await page.waitForSelector('product-roadmap[data-upgraded]');

    const shape = await page.evaluate(() => {
      const bars = [...document.querySelectorAll('product-roadmap .rm-bar')];
      return {
        count: bars.length,
        allDraggable: bars.every((b) => b.getAttribute('draggable') === 'true'),
        allHaveHandle: bars.every((b) => b.querySelector('.rm-bar-handle')?.getAttribute('aria-label') === 'Resize end date'),
      };
    });
    expect(shape.count).toBe(3);
    expect(shape.allDraggable).toBe(true);
    expect(shape.allHaveHandle).toBe(true);

    // Capture events on the document before dragging.
    await page.evaluate(() => {
      window.__rmEvents = [];
      for (const name of ['product-roadmap:reschedule', 'product-roadmap:resize', 'product-roadmap:select']) {
        document.addEventListener(name, (e) => {
          window.__rmEvents.push({
            name,
            initiativeTitle: e.detail.initiative?.querySelector('h2, h3')?.textContent ?? null,
            lane: e.detail.lane,
            start: e.detail.start,
            end: e.detail.end,
          });
        });
      }
    });

    // Drag "Multi-tenant database" (Q3 2026 → Q4 2026) right by 30% of the
    // track. Start lands mid-October → snaps to 2026-10-01; end lands
    // mid-April → snaps to 2027-04-01.
    const bar = page.locator('product-roadmap .rm-lane[data-lane="Platform"] .rm-bar').first();
    const track = page.locator('product-roadmap .rm-lane[data-lane="Platform"] .rm-track');
    const barBox = await bar.boundingBox();
    const trackBox = await track.boundingBox();
    const startX = barBox.x + Math.min(40, barBox.width / 2);
    const y = barBox.y + barBox.height / 2;
    await page.mouse.move(startX, y);
    await page.mouse.down();
    await page.mouse.move(startX + trackBox.width * 0.15, y, { steps: 5 });
    await page.mouse.move(startX + trackBox.width * 0.3, y, { steps: 5 });
    await page.mouse.up();

    await page.waitForFunction(() => window.__rmEvents.length > 0);
    // Let the deferred #dragInfo reset run so a trailing click would be visible.
    await page.waitForTimeout(20);

    const result = await page.evaluate(() => {
      const rm = document.querySelector('product-roadmap');
      const bar = rm.querySelector('.rm-lane[data-lane="Platform"] .rm-bar');
      const source = rm.querySelector(':scope > section[data-lane="Platform"] > article');
      return {
        events: window.__rmEvents,
        barStart: bar.dataset.start,
        barEnd: bar.dataset.end,
        barX: bar.style.getPropertyValue('--rm-x'),
        sourceStart: source.getAttribute('data-start'),
        sourceEnd: source.getAttribute('data-end'),
      };
    });

    expect(result.events).toEqual([{
      name: 'product-roadmap:reschedule',
      initiativeTitle: 'Multi-tenant database',
      lane: 'Platform',
      start: '2026-10-01',
      end: '2027-04-01',
    }]);
    // Bar re-snaps to the grid and the author's <article> is updated in place.
    expect(result.barStart).toBe('2026-10-01');
    expect(result.barEnd).toBe('2027-04-01');
    expect(result.barX).toBe('0.2527');     // Oct 1 over a Jul 1 → Jun 30 (364-day) range
    expect(result.sourceStart).toBe('2026-10-01');
    expect(result.sourceEnd).toBe('2027-04-01');
  });

  // Suspected bug: src/web-components/product-roadmap/logic.js defines
  // attributeChangedCallback() (re-renders when connected) but never declares
  // `static observedAttributes`, so the browser never invokes it. Toggling
  // view="month" on a live element therefore leaves the quarter axis in place.
  test.fixme('view attribute change re-renders the axis on a live element', async ({ page }) => {
    await page.goto(basicDemo);
    await page.waitForSelector('product-roadmap[data-upgraded]');

    const ticks = await page.evaluate(() => {
      const rm = document.querySelector('product-roadmap');
      rm.setAttribute('view', 'month');
      return [...rm.querySelectorAll('.rm-axis .rm-tick')].map((t) => t.textContent);
    });

    expect(ticks[0]).toBe('Jul 2026');
    expect(ticks).toHaveLength(12);
  });
});
