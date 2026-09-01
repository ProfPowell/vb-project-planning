/**
 * review-surface — HTML-first upgrade, pin API, events, mode toggle
 *
 * Verifies the annotation overlay contract: the element upgrades around
 * its slotted content and reflects `pin-count`; `addPin` / `resolvePin`
 * / `unresolvePin` / `removePin` render pins and fire the documented
 * events with `{ pin }` / `{ pin, changes }`; `show-resolved` toggles
 * resolved-pin visibility; the `.pins` setter emits `pins-changed`;
 * clicking a pin opens its popover and fires `:select`; the toolbar's
 * Annotate button toggles `data-annotating` and fires `:mode`.
 *
 * The live, HTML-first `<review-surface editable adapter="local">`
 * upgrades on this pack's demo page. Playwright gives each test a fresh
 * browser context, so the local adapter (localStorage) starts empty.
 */

import { test, expect } from '@playwright/test';

const demoPage = 'demos/review-surface-basic/';

test.describe('review-surface', () => {

  test('HTML-first upgrade wraps slotted content, reflects pin-count and renders the toolbar', async ({ page }) => {
    await page.goto(demoPage);
    // pin-count is stamped by the first _render(), which runs after the
    // adapter's async load — so it doubles as the "rendered" marker.
    await page.waitForSelector('review-surface[data-upgraded][pin-count]');

    const state = await page.evaluate(() => {
      const rs = document.querySelector('review-surface');
      const root = rs.shadowRoot;
      return {
        pinCount: rs.getAttribute('pin-count'),
        pinsProp: rs.pins,
        adapterType: rs.adapter?.constructor?.name,
        slottedFigure: root.querySelector('slot:not([name])').assignedElements()[0]?.tagName,
        overlay: {
          role: root.querySelector('.rs-overlay')?.getAttribute('role'),
          aria: root.querySelector('.rs-overlay')?.getAttribute('aria-label'),
          pins: root.querySelectorAll('.rs-pin').length,
        },
        toolbar: {
          role: root.querySelector('.rs-toolbar')?.getAttribute('role'),
          aria: root.querySelector('.rs-toolbar')?.getAttribute('aria-label'),
          pressed: root.querySelector('[data-action="toggle-mode"]')?.getAttribute('aria-pressed'),
          count: root.querySelector('.rs-toolbar__count')?.textContent,
        },
        live: root.querySelector('.rs-live')?.getAttribute('aria-live'),
        annotating: rs.hasAttribute('data-annotating'),
      };
    });

    expect(state.pinCount).toBe('0');
    expect(state.pinsProp).toEqual([]);
    expect(state.adapterType).toBe('LocalStorageAdapter');
    expect(state.slottedFigure).toBe('FIGURE');
    expect(state.overlay).toEqual({ role: 'img', aria: 'Review annotation surface', pins: 0 });
    expect(state.toolbar).toEqual({ role: 'toolbar', aria: 'Review tools', pressed: 'false', count: '0 pins' });
    expect(state.live).toBe('polite');
    expect(state.annotating).toBe(false);
  });

  test('addPin() renders a pin, fires :add, announces, and persists via the local adapter', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector('review-surface[data-upgraded][pin-count]');

    const result = await page.evaluate(async () => {
      const rs = document.querySelector('review-surface');
      const events = [];
      rs.addEventListener('review-surface:add', (e) => events.push(e.detail));

      // x is out of range → clamped to 100; author falls back to the attribute.
      const pin = await rs.addPin({ x: 140, y: 18.5, text: 'Header alignment is off' });
      const root = rs.shadowRoot;
      const btn = root.querySelector('.rs-pin');
      const stored = JSON.parse(localStorage.getItem('vb:reviews:demo-review-basic'));

      return {
        pin: { x: pin.x, y: pin.y, text: pin.text, author: pin.author, resolved: pin.resolved, replies: pin.replies, hasId: typeof pin.id === 'string' && pin.id.length > 0 },
        eventPinId: events.map(d => d.pin.id),
        returnedId: pin.id,
        pinCount: rs.getAttribute('pin-count'),
        pinsLength: rs.pins.length,
        button: {
          count: root.querySelectorAll('.rs-pin').length,
          id: btn.dataset.pinId,
          aria: btn.getAttribute('aria-label'),
          expanded: btn.getAttribute('aria-expanded'),
          haspopup: btn.getAttribute('aria-haspopup'),
          number: btn.querySelector('.rs-pin__number').textContent,
          left: btn.style.left,
          top: btn.style.top,
        },
        toolbarCount: root.querySelector('.rs-toolbar__count').textContent,
        live: root.querySelector('.rs-live').textContent,
        storedIds: stored?.data?.map(p => p.id),
      };
    });

    expect(result.pin).toEqual({ x: 100, y: 18.5, text: 'Header alignment is off', author: 'Sarah Chen', resolved: false, replies: [], hasId: true });
    expect(result.eventPinId).toEqual([result.returnedId]);
    expect(result.pinCount).toBe('1');
    expect(result.pinsLength).toBe(1);
    expect(result.button).toEqual({
      count: 1,
      id: result.returnedId,
      aria: 'Pin 1: Header alignment is off',
      expanded: 'false',
      haspopup: 'dialog',
      number: '1',
      left: '100%',
      top: '18.5%',
    });
    expect(result.toolbarCount).toBe('1 pin');
    expect(result.live).toBe('Pin 1 added');
    expect(result.storedIds).toEqual([result.returnedId]);
  });

  test('resolvePin() hides the pin until show-resolved; unresolvePin() fires :update; removePin() fires :remove', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector('review-surface[data-upgraded][pin-count]');

    const result = await page.evaluate(async () => {
      const rs = document.querySelector('review-surface');
      const root = rs.shadowRoot;
      // detail.pin is the live pin object (later mutated by unresolvePin),
      // so snapshot the fields we care about at dispatch time.
      const events = [];
      for (const name of ['resolve', 'update', 'remove']) {
        rs.addEventListener(`review-surface:${name}`, (e) => events.push({
          name,
          pin: { id: e.detail.pin.id, resolved: e.detail.pin.resolved, resolvedBy: e.detail.pin.resolvedBy },
          changes: e.detail.changes ? { ...e.detail.changes } : undefined,
        }));
      }

      const a = await rs.addPin({ x: 10, y: 10, text: 'A' });
      const b = await rs.addPin({ x: 20, y: 20, text: 'B' });

      await rs.resolvePin(a.id);
      const afterResolve = {
        pinCount: rs.getAttribute('pin-count'),
        visibleIds: [...root.querySelectorAll('.rs-pin')].map(el => el.dataset.pinId),
        live: root.querySelector('.rs-live').textContent,
      };

      // Attribute reactivity: show-resolved re-renders with resolved pins.
      rs.setAttribute('show-resolved', '');
      const afterShow = {
        pinCount: rs.getAttribute('pin-count'),
        pins: [...root.querySelectorAll('.rs-pin')].map(el => [el.dataset.pinId, el.hasAttribute('data-resolved')]),
      };

      await rs.unresolvePin(a.id);
      const afterUnresolve = [...root.querySelectorAll('.rs-pin')].map(el => [el.dataset.pinId, el.hasAttribute('data-resolved')]);

      await rs.removePin(b.id);
      await rs.removePin('no-such-pin'); // must be a silent no-op
      const afterRemove = {
        pinCount: rs.getAttribute('pin-count'),
        ids: rs.pins.map(p => p.id),
        stored: JSON.parse(localStorage.getItem('vb:reviews:demo-review-basic'))?.data?.map(p => p.id),
      };

      return {
        ids: { a: a.id, b: b.id },
        events: events.map(e => ({
          name: e.name,
          pinId: e.pin.id,
          resolved: e.pin.resolved,
          resolvedBy: e.pin.resolvedBy,
          changes: e.changes ? Object.keys(e.changes).sort() : undefined,
        })),
        afterResolve, afterShow, afterUnresolve, afterRemove,
      };
    });

    const { a, b } = result.ids;

    expect(result.afterResolve).toEqual({ pinCount: '1', visibleIds: [b], live: 'Pin resolved' });
    expect(result.afterShow).toEqual({ pinCount: '2', pins: [[a, true], [b, false]] });
    expect(result.afterUnresolve).toEqual([[a, false], [b, false]]);
    expect(result.afterRemove).toEqual({ pinCount: '1', ids: [a], stored: [a] });

    expect(result.events).toEqual([
      { name: 'resolve', pinId: a, resolved: true, resolvedBy: 'Sarah Chen', changes: undefined },
      { name: 'update', pinId: a, resolved: false, resolvedBy: null, changes: ['resolved', 'resolvedAt', 'resolvedBy'] },
      { name: 'remove', pinId: b, resolved: false, resolvedBy: null, changes: undefined },
    ]);
  });

  test('.pins setter emits pins-changed, orders pins by createdAt; clicking a pin opens the popover and fires :select', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector('review-surface[data-upgraded][pin-count]');

    const rendered = await page.evaluate(() => {
      const rs = document.querySelector('review-surface');
      window.__rsEvents = [];
      rs.addEventListener('review-surface:pins-changed', (e) => window.__rsEvents.push({ name: 'pins-changed', source: e.detail.source, count: e.detail.pins.length }));
      rs.addEventListener('review-surface:select', (e) => window.__rsEvents.push({ name: 'select', id: e.detail.pin.id }));

      // Deliberately out of chronological order in the array.
      rs.pins = [
        { id: 'later', x: 60, y: 40, text: 'Second comment', author: 'Tom Rivera', createdAt: '2026-04-06T15:00:00Z', replies: [{ id: 'r1', text: 'Fixed in v2', author: 'Sarah Chen' }] },
        { id: 'earlier', x: 30, y: 30, text: 'First comment', author: 'Sarah Chen', createdAt: '2026-04-06T14:00:00Z' },
      ];

      return {
        pinCount: rs.getAttribute('pin-count'),
        order: [...rs.shadowRoot.querySelectorAll('.rs-pin')].map(el => [el.dataset.pinId, el.querySelector('.rs-pin__number').textContent]),
        popoverBefore: !!rs.shadowRoot.querySelector('.rs-popover'),
      };
    });

    expect(rendered.pinCount).toBe('2');
    expect(rendered.order).toEqual([['earlier', '1'], ['later', '2']]);
    expect(rendered.popoverBefore).toBe(false);

    // Real click on the second pin (Playwright pierces the shadow root).
    await page.locator('review-surface .rs-pin[data-pin-id="later"]').click();

    const popover = await page.evaluate(() => {
      const rs = document.querySelector('review-surface');
      const root = rs.shadowRoot;
      const pop = root.querySelector('.rs-popover');
      return {
        events: window.__rsEvents,
        activePinExpanded: root.querySelector('.rs-pin[data-pin-id="later"]').getAttribute('aria-expanded'),
        activeAttr: root.querySelector('.rs-pin[data-pin-id="later"]').hasAttribute('data-active'),
        role: pop?.getAttribute('role'),
        labelledBy: pop?.getAttribute('aria-labelledby'),
        title: pop?.querySelector('.rs-popover__title')?.textContent.trim(),
        author: pop?.querySelector('.rs-comment__author')?.textContent,
        text: pop?.querySelector('.rs-comment__text')?.textContent,
        replies: [...(pop?.querySelectorAll('.rs-reply .rs-comment__text') ?? [])].map(el => el.textContent),
        actions: [...(pop?.querySelectorAll('[data-action]') ?? [])].map(el => el.dataset.action),
      };
    });

    expect(popover.events).toEqual([
      { name: 'pins-changed', source: 'property', count: 2 },
      { name: 'select', id: 'later' },
    ]);
    expect(popover.activePinExpanded).toBe('true');
    expect(popover.activeAttr).toBe(true);
    expect(popover.role).toBe('dialog');
    expect(popover.labelledBy).toBe('rs-popover-title-later');
    expect(popover.title).toBe('Pin 2');
    expect(popover.author).toBe('Tom Rivera');
    expect(popover.text).toBe('Second comment');
    expect(popover.replies).toEqual(['Fixed in v2']);
    // editable + unresolved → resolve/delete/close + reply submit
    expect(popover.actions).toEqual(['resolve', 'delete', 'close', 'reply']);

    // Close via the popover's close button.
    await page.locator('review-surface .rs-popover [data-action="close"]').click();
    await expect(page.locator('review-surface .rs-popover')).toHaveCount(0);
  });

  test('Annotate toolbar button toggles data-annotating and fires :mode', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector('review-surface[data-upgraded][pin-count]');

    await page.evaluate(() => {
      window.__modes = [];
      document.querySelector('review-surface').addEventListener('review-surface:mode', (e) => window.__modes.push(e.detail.mode));
    });

    const toggle = page.locator('review-surface [data-action="toggle-mode"]');
    await toggle.click();
    await expect(page.locator('review-surface[data-annotating]')).toHaveCount(1);
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');

    await toggle.click();
    await expect(page.locator('review-surface[data-annotating]')).toHaveCount(0);
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');

    expect(await page.evaluate(() => window.__modes)).toEqual(['annotate', 'view']);
  });

  test('exportPins() returns a detached clone; importPins() replaces the set', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector('review-surface[data-upgraded][pin-count]');

    const result = await page.evaluate(async () => {
      const rs = document.querySelector('review-surface');
      await rs.addPin({ x: 5, y: 5, text: 'Original' });

      const exported = rs.exportPins();
      exported[0].text = 'MUTATED';
      const untouched = rs.pins[0].text;

      rs.importPins([
        { id: 'i-1', x: 1, y: 1, text: 'Imported one', createdAt: '2026-01-01T00:00:00Z' },
        { id: 'i-2', x: 2, y: 2, text: 'Imported two', createdAt: '2026-01-02T00:00:00Z' },
      ]);

      return {
        exportedLength: exported.length,
        untouched,
        pinCount: rs.getAttribute('pin-count'),
        ids: [...rs.shadowRoot.querySelectorAll('.rs-pin')].map(el => el.dataset.pinId),
        toolbarCount: rs.shadowRoot.querySelector('.rs-toolbar__count').textContent,
      };
    });

    expect(result.exportedLength).toBe(1);
    expect(result.untouched).toBe('Original');
    expect(result.pinCount).toBe('2');
    expect(result.ids).toEqual(['i-1', 'i-2']);
    expect(result.toolbarCount).toBe('2 pins');
  });
});
