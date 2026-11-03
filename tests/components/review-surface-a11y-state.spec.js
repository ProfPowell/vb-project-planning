/**
 * review-surface — 0.2.2 regressions: accessibility tree, keyboard focus,
 * reconnect / pre-append state, adapter upserts, live region, events.
 *
 * - Pins are real buttons in Chrome's accessibility tree (the overlay used
 *   to be role="img", which makes every child presentational).
 * - Opening a pin moves focus into its popover; Escape closes it and
 *   returns focus to the pin (re-renders used to drop focus to <body>).
 * - `.pins` assigned before append, a property-set adapter, and pins on a
 *   moved element all survive connect / reconnect.
 * - Resolve / Reply work on pins the adapter never created (src / .pins).
 * - Announcements land in one persistent live region.
 * - :upgraded and :ready fire once; pin coordinates are coerced to 0–100.
 */

import { test, expect } from '@playwright/test';

const demoPage = 'demos/review-surface-basic/';

async function ready(page) {
  await page.goto(demoPage);
  await page.waitForSelector('review-surface[data-upgraded][pin-count]');
}

test.describe('review-surface (0.2.2 fixes)', () => {

  test('pins are exposed as buttons in the accessibility tree', async ({ page }) => {
    await ready(page);
    await page.evaluate(() => {
      document.querySelector('review-surface').pins = [
        { id: 'a', x: 20, y: 20, text: 'Header alignment', createdAt: '2026-01-01T00:00:00Z' },
        { id: 'b', x: 60, y: 60, text: 'CTA colour', createdAt: '2026-01-02T00:00:00Z' },
      ];
    });

    const cdp = await page.context().newCDPSession(page);
    const { nodes } = await cdp.send('Accessibility.getFullAXTree');
    const buttons = nodes
      .filter(n => !n.ignored && n.role?.value === 'button')
      .map(n => n.name?.value)
      .filter(name => /^Pin \d/.test(name));
    expect(buttons).toEqual(['Pin 1: Header alignment', 'Pin 2: CTA colour']);

    const group = nodes.find(n => !n.ignored && n.role?.value === 'group' && n.name?.value === 'Review pins');
    expect(group).toBeTruthy();
    await expect(page.getByRole('button', { name: 'Pin 2: CTA colour' })).toBeVisible();
  });

  test('keyboard: Enter opens the popover with focus inside; Escape closes it and focus returns to the pin', async ({ page }) => {
    await ready(page);
    await page.evaluate(() => {
      document.querySelector('review-surface').pins = [
        { id: 'k1', x: 30, y: 30, text: 'Keyboard pin', createdAt: '2026-01-01T00:00:00Z' },
      ];
    });

    const pin = page.locator('review-surface .rs-pin[data-pin-id="k1"]');
    await pin.focus();
    await page.keyboard.press('Enter');

    await expect(page.locator('review-surface .rs-popover')).toHaveCount(1);
    const focusedOpen = await page.evaluate(() => {
      const ae = document.querySelector('review-surface').shadowRoot.activeElement;
      return ae?.className;
    });
    expect(focusedOpen).toContain('rs-popover');

    // Tab moves within the popover (focus is not lost to <body>).
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.activeElement?.tagName)).toBe('REVIEW-SURFACE');

    await page.keyboard.press('Escape');
    await expect(page.locator('review-surface .rs-popover')).toHaveCount(0);
    const focusedClosed = await page.evaluate(() => {
      const ae = document.querySelector('review-surface').shadowRoot.activeElement;
      return { pin: ae?.dataset?.pinId, expanded: ae?.getAttribute('aria-expanded'), docActive: document.activeElement?.tagName };
    });
    expect(focusedClosed).toEqual({ pin: 'k1', expanded: 'false', docActive: 'REVIEW-SURFACE' });

    // Clicking the close button also returns focus to the pin.
    await pin.click();
    await page.locator('review-surface .rs-popover [data-action="close"]').click();
    expect(await page.evaluate(() => document.querySelector('review-surface').shadowRoot.activeElement?.dataset?.pinId)).toBe('k1');
  });

  test('Resolve from the popover keeps focus inside the surface', async ({ page }) => {
    await ready(page);
    await page.evaluate(() => {
      const rs = document.querySelector('review-surface');
      rs.setAttribute('show-resolved', '');
      rs.pins = [{ id: 'f1', x: 30, y: 30, text: 'Focus pin', createdAt: '2026-01-01T00:00:00Z' }];
    });
    await page.locator('review-surface .rs-pin').click();
    await page.locator('review-surface [data-action="resolve"]').focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('review-surface [data-action="unresolve"]')).toHaveCount(1);
    expect(await page.evaluate(() => !!document.querySelector('review-surface').shadowRoot.activeElement?.closest('.rs-popover'))).toBe(true);
  });

  test('.pins assigned before append survives connect; pins and a property-set adapter survive a move', async ({ page }) => {
    await ready(page);
    const result = await page.evaluate(async () => {
      const LocalStorageAdapter = document.querySelector('review-surface').adapter.constructor;

      // 1. .pins before append (default memory adapter).
      const a = document.createElement('review-surface');
      a.pins = [{ id: 'pre', x: 10, y: 10, text: 'Before append' }];
      document.body.append(a);
      await new Promise(r => setTimeout(r, 50));
      const afterAppend = a.pins.map(p => p.id);

      // Move it: reconnect must not reload from the (empty) adapter.
      document.querySelector('main, body').prepend(a);
      await new Promise(r => setTimeout(r, 50));
      const afterMove = { ids: a.pins.map(p => p.id), rendered: a.shadowRoot.querySelectorAll('.rs-pin').length };

      // 2. Adapter set by property before append is kept.
      const custom = new LocalStorageAdapter('prop-adapter');
      const b = document.createElement('review-surface');
      b.adapter = custom;
      document.body.append(b);
      await new Promise(r => setTimeout(r, 50));
      const kept = b.adapter === custom;
      await b.addPin({ x: 5, y: 5, text: 'stored' });
      b.remove();
      document.body.append(b);
      await new Promise(r => setTimeout(r, 50));

      return {
        afterAppend, afterMove, kept,
        keptAfterMove: b.adapter === custom,
        bPins: b.pins.map(p => p.text),
        stored: JSON.parse(localStorage.getItem('vb:reviews:prop-adapter'))?.data?.map(p => p.text),
      };
    });

    expect(result.afterAppend).toEqual(['pre']);
    expect(result.afterMove).toEqual({ ids: ['pre'], rendered: 1 });
    expect(result.kept).toBe(true);
    expect(result.keptAfterMove).toBe(true);
    expect(result.bPins).toEqual(['stored']);
    expect(result.stored).toEqual(['stored']);
  });

  test('Resolve and Reply work on pins loaded via src (memory adapter) and via .pins (local adapter)', async ({ page }) => {
    await ready(page);
    const result = await page.evaluate(async () => {
      const json = JSON.stringify({ pins: [{ id: 'src-1', x: 40, y: 40, text: 'From src', createdAt: '2026-01-01T00:00:00Z' }] });
      const a = document.createElement('review-surface');
      a.setAttribute('editable', '');
      a.setAttribute('src', 'data:application/json,' + encodeURIComponent(json));
      const readyP = new Promise(r => a.addEventListener('review-surface:ready', r, { once: true }));
      document.body.append(a);
      await readyP;
      await a.resolvePin('src-1');
      const srcResolved = a.pins[0].resolved;

      // Local adapter (demo element) with pins it never saved.
      const rs = document.querySelector('review-surface');
      rs.pins = [{ id: 'prop-1', x: 50, y: 50, text: 'From property', createdAt: '2026-01-01T00:00:00Z' }];
      await rs.resolvePin('prop-1');
      await rs.unresolvePin('prop-1');
      const stored = JSON.parse(localStorage.getItem('vb:reviews:demo-review-basic'))?.data;
      return { srcResolved, propResolved: rs.pins[0].resolved, stored: stored?.map(p => [p.id, p.text, p.resolved]) };
    });
    expect(result.srcResolved).toBe(true);
    expect(result.propResolved).toBe(false);
    expect(result.stored).toEqual([['prop-1', 'From property', false]]);

    // Reply through the UI on the property-loaded pin.
    await page.locator('review-surface .rs-pin[data-pin-id="prop-1"]').first().click();
    const field = page.locator('review-surface .rs-input__field').first();
    await field.fill('Looks good now');
    await field.press('Enter');
    await expect(page.locator('review-surface .rs-reply .rs-comment__text').first()).toHaveText('Looks good now');
  });

  test('announcements persist in one live region across re-renders', async ({ page }) => {
    await ready(page);
    const result = await page.evaluate(async () => {
      const rs = document.querySelector('review-surface');
      const live = rs.shadowRoot.querySelector('.rs-live');
      const pin = await rs.addPin({ x: 10, y: 10, text: 'Announce me' });
      const afterAdd = live.textContent;
      rs.shadowRoot.querySelector(`.rs-pin[data-pin-id="${pin.id}"]`).click(); // re-render
      rs.setAttribute('compact', ''); // re-render
      return {
        afterAdd,
        afterRenders: rs.shadowRoot.querySelector('.rs-live').textContent,
        same: rs.shadowRoot.querySelector('.rs-live') === live,
        count: rs.shadowRoot.querySelectorAll('.rs-live').length,
      };
    });
    expect(result).toEqual({ afterAdd: 'Pin 1 added', afterRenders: 'Pin 1 added', same: true, count: 1 });
  });

  test(':upgraded and :ready fire once, not on every render', async ({ page }) => {
    await ready(page);
    const result = await page.evaluate(async () => {
      const counts = { ready: 0, upgraded: 0 };
      const el = document.createElement('review-surface');
      el.setAttribute('editable', '');
      el.addEventListener('review-surface:ready', () => counts.ready++);
      el.addEventListener('review-surface:upgraded', () => counts.upgraded++);
      document.body.append(el);
      await new Promise(r => setTimeout(r, 50));
      const pin = await el.addPin({ x: 1, y: 1, text: 'x' });
      el.shadowRoot.querySelector('.rs-pin').click();
      el.shadowRoot.querySelector('[data-action="toggle-mode"]').click();
      el.remove();
      document.body.append(el);
      await el.resolvePin(pin.id);
      return counts;
    });
    expect(result).toEqual({ ready: 1, upgraded: 1 });
  });

  test('pin coordinates are coerced to 0–100 before reaching inline styles', async ({ page }) => {
    await ready(page);
    const styles = await page.evaluate(() => {
      const rs = document.querySelector('review-surface');
      rs.pins = [
        { id: 'n1', x: '25', y: 75, createdAt: '2026-01-01T00:00:00Z' },
        { id: 'n2', x: '1;background:red', y: -20, createdAt: '2026-01-02T00:00:00Z' },
        { id: 'n3', x: 250, y: null, createdAt: '2026-01-03T00:00:00Z' },
      ];
      return [...rs.shadowRoot.querySelectorAll('.rs-pin')].map(b => b.getAttribute('style'));
    });
    expect(styles).toEqual(['left:25%;top:75%', 'left:0%;top:0%', 'left:100%;top:0%']);
  });
});
