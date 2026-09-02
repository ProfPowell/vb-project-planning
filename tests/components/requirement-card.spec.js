/**
 * requirement-card — HTML-first upgrade, priority/conflict state, activation
 *
 * Covers the contract documented in
 * src/web-components/requirement-card/api.json: `data-priority` drives the
 * default pill text + `:state(priority-*)`, `data-conflict` is reflected by
 * `.hasConflict`, optional slots toggle `:state(has-<slot>)` via slotchange,
 * and `requirement-card:click` fires (with `{ priority, hasConflict,
 * originalEvent }`) only when the card is interactive — wrapped in an
 * `<a>`/`<button>` or given a `tabindex`. The element extends VBElement, so
 * it also dispatches `requirement-card:upgraded` after first connect.
 *
 * The live, HTML-first `<requirement-card>` upgrades on this pack's demo page.
 */

import { test, expect } from '@playwright/test';

const demoPage = 'demos/requirement-card-basic/';

/**
 * Page-side helper source: CustomStateSet selector with the legacy
 * `:--name` fallback that VBElement.setState() also uses.
 */
const hasStateFn = `(el, name) => {
  try { return el.matches(':state(' + name + ')'); }
  catch { return el.matches(':--' + name); }
}`;

test.describe('requirement-card', () => {

  test('HTML-first upgrade renders default pill and exposes priority / slot state', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector('requirement-card[data-upgraded]');

    const state = await page.evaluate((hasStateSrc) => {
      const hasState = eval(hasStateSrc);
      const cards = [...document.querySelectorAll('requirement-card')];
      const describe = (el) => ({
        upgraded: el.hasAttribute('data-upgraded'),
        priority: el.priority,
        hasConflict: el.hasConflict,
        pill: el.shadowRoot.querySelector('[data-priority-default]')?.textContent,
        nameAssigned: el.shadowRoot.querySelector('slot[name="name"]').assignedElements().length,
        states: {
          critical: hasState(el, 'priority-critical'),
          important: hasState(el, 'priority-important'),
          notRelevant: hasState(el, 'priority-not-relevant'),
          hasBadge: hasState(el, 'has-badge'),
          hasRationale: hasState(el, 'has-rationale'),
          hasConflicts: hasState(el, 'has-conflicts'),
          interactive: hasState(el, 'interactive'),
        },
      });
      return cards.map(describe);
    }, hasStateFn);

    expect(state).toHaveLength(3);

    // Performance — critical, rationale, no conflict, not interactive
    expect(state[0].upgraded).toBe(true);
    expect(state[0].priority).toBe('critical');
    expect(state[0].hasConflict).toBe(false);
    expect(state[0].pill).toBe('Critical');
    expect(state[0].nameAssigned).toBe(1);
    expect(state[0].states).toEqual({
      critical: true, important: false, notRelevant: false,
      hasBadge: true, hasRationale: true, hasConflicts: false,
      interactive: false,
    });

    // Internationalization — not-relevant, no rationale
    expect(state[1].priority).toBe('not-relevant');
    expect(state[1].pill).toBe('Not relevant');
    expect(state[1].states.notRelevant).toBe(true);
    expect(state[1].states.hasRationale).toBe(false);
    expect(state[1].states.interactive).toBe(false);

    // Security — important + conflict, wrapped in <a href> → interactive
    expect(state[2].priority).toBe('important');
    expect(state[2].hasConflict).toBe(true);
    expect(state[2].pill).toBe('Important');
    expect(state[2].states.important).toBe(true);
    expect(state[2].states.hasConflicts).toBe(true);
    expect(state[2].states.interactive).toBe(true);
  });

  test('.priority / data-priority and .hasConflict stay in sync with rendering', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector('requirement-card[data-upgraded]');

    const result = await page.evaluate((hasStateSrc) => {
      const hasState = eval(hasStateSrc);
      const el = document.querySelector('requirement-card');
      const pill = () => el.shadowRoot.querySelector('[data-priority-default]').textContent;

      // Property setter → attribute + pill + state
      el.priority = 'acceptable';
      const viaProp = {
        attr: el.getAttribute('data-priority'),
        pill: pill(),
        acceptable: hasState(el, 'priority-acceptable'),
        critical: hasState(el, 'priority-critical'),
      };

      // Setter normalizes case
      el.priority = 'IMPORTANT';
      const normalized = { attr: el.getAttribute('data-priority'), pill: pill() };

      // Attribute path → same sync
      el.setAttribute('data-priority', 'not-relevant');
      const viaAttr = {
        priority: el.priority,
        pill: pill(),
        notRelevant: hasState(el, 'priority-not-relevant'),
        important: hasState(el, 'priority-important'),
      };

      // Invalid value clears the attribute and the pill
      el.priority = 'urgent';
      const invalid = {
        hasAttr: el.hasAttribute('data-priority'),
        priority: el.priority,
        pill: pill(),
        anyState: ['critical', 'important', 'acceptable', 'not-relevant']
          .some(p => hasState(el, `priority-${p}`)),
      };

      // hasConflict reflects to data-conflict
      el.hasConflict = true;
      const conflictOn = el.hasAttribute('data-conflict');
      el.hasConflict = false;
      const conflictOff = el.hasAttribute('data-conflict');
      el.setAttribute('data-conflict', '');
      const conflictViaAttr = el.hasConflict;

      return { viaProp, normalized, viaAttr, invalid, conflictOn, conflictOff, conflictViaAttr };
    }, hasStateFn);

    expect(result.viaProp).toEqual({ attr: 'acceptable', pill: 'Acceptable', acceptable: true, critical: false });
    expect(result.normalized).toEqual({ attr: 'important', pill: 'Important' });
    expect(result.viaAttr).toEqual({ priority: 'not-relevant', pill: 'Not relevant', notRelevant: true, important: false });
    expect(result.invalid).toEqual({ hasAttr: false, priority: '', pill: '', anyState: false });
    expect(result.conflictOn).toBe(true);
    expect(result.conflictOff).toBe(false);
    expect(result.conflictViaAttr).toBe(true);
  });

  test('slotchange toggles has-<slot> state when content is added / removed', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector('requirement-card[data-upgraded]');

    // Second card has no rationale / conflicts / custom pill
    await page.evaluate(() => {
      const el = document.querySelectorAll('requirement-card')[1];
      el.id = 'i18n-card';
      const p = document.createElement('p');
      p.slot = 'rationale';
      p.textContent = 'Only shipping in one locale this year.';
      el.appendChild(p);
      const pill = document.createElement('span');
      pill.slot = 'priority-pill';
      pill.textContent = 'Deferred';
      el.appendChild(pill);
    });
    await page.waitForFunction((hasStateSrc) => {
      const hasState = eval(hasStateSrc);
      const el = document.getElementById('i18n-card');
      return hasState(el, 'has-rationale') && hasState(el, 'has-priority-pill');
    }, hasStateFn);

    await page.evaluate(() => {
      document.getElementById('i18n-card').querySelector('[slot="rationale"]').remove();
    });
    await page.waitForFunction((hasStateSrc) => {
      const hasState = eval(hasStateSrc);
      return !hasState(document.getElementById('i18n-card'), 'has-rationale');
    }, hasStateFn);

    // Custom pill slot still occupied; default pill text is still computed
    const pillState = await page.evaluate((hasStateSrc) => {
      const hasState = eval(hasStateSrc);
      const el = document.getElementById('i18n-card');
      return {
        hasPill: hasState(el, 'has-priority-pill'),
        assignedPill: el.shadowRoot.querySelector('slot[name="priority-pill"]').assignedElements()[0]?.textContent,
      };
    }, hasStateFn);
    expect(pillState.hasPill).toBe(true);
    expect(pillState.assignedPill).toBe('Deferred');
  });

  test('requirement-card:click fires only when interactive, with documented detail', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector('requirement-card[data-upgraded]');

    // A fresh card with tabindex="0" is directly focusable + activatable.
    await page.evaluate(() => {
      window.__rcEvents = [];
      document.addEventListener('requirement-card:click', (e) => {
        window.__rcEvents.push({
          target: e.target.id,
          priority: e.detail.priority,
          hasConflict: e.detail.hasConflict,
          originalType: e.detail.originalEvent?.type,
          bubbles: e.bubbles,
        });
      });

      const el = document.createElement('requirement-card');
      el.id = 'focusable-card';
      el.setAttribute('data-priority', 'critical');
      el.setAttribute('data-conflict', '');
      el.setAttribute('tabindex', '0');
      el.innerHTML = '<span slot="name">Availability</span>';
      document.body.appendChild(el);

      // The first demo card is not interactive (no tabindex, no <a>/<button>)
      document.querySelector('requirement-card').id = 'static-card';
    });
    await page.waitForSelector('#focusable-card[data-upgraded]');

    const interactive = await page.evaluate((hasStateSrc) => {
      const hasState = eval(hasStateSrc);
      return hasState(document.getElementById('focusable-card'), 'interactive');
    }, hasStateFn);
    expect(interactive).toBe(true);

    // Mouse activation
    await page.click('#focusable-card');
    // Keyboard activation (Enter and Space)
    await page.focus('#focusable-card');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Space');
    // Non-interactive card: click must NOT emit
    await page.click('#static-card');

    const events = await page.evaluate(() => window.__rcEvents);
    expect(events).toEqual([
      { target: 'focusable-card', priority: 'critical', hasConflict: true, originalType: 'click', bubbles: true },
      { target: 'focusable-card', priority: 'critical', hasConflict: true, originalType: 'keydown', bubbles: true },
      { target: 'focusable-card', priority: 'critical', hasConflict: true, originalType: 'keydown', bubbles: true },
    ]);

    // Removing tabindex makes the card inert again; priority null when unset
    const afterRemove = await page.evaluate((hasStateSrc) => {
      const hasState = eval(hasStateSrc);
      const el = document.getElementById('focusable-card');
      el.removeAttribute('tabindex');
      const inert = !hasState(el, 'interactive');
      el.click();
      return { inert, count: window.__rcEvents.length };
    }, hasStateFn);
    expect(afterRemove).toEqual({ inert: true, count: 3 });
  });

  // Regression guard: #syncSlot must not count a slot's FALLBACK content as
  // slotted content (`assignedNodes({ flatten: true })` does), otherwise
  // `has-priority-pill` is always on and the default pill is hidden.
  test('default priority pill is visible when no priority-pill is slotted', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector('requirement-card[data-upgraded]');

    const result = await page.evaluate((hasStateSrc) => {
      const hasState = eval(hasStateSrc);
      const el = document.querySelector('requirement-card');
      const pill = el.shadowRoot.querySelector('[data-priority-default]');
      return {
        slotted: el.querySelector('[slot="priority-pill"]') !== null,
        hasPillState: hasState(el, 'has-priority-pill'),
        pillText: pill.textContent,
        pillDisplay: getComputedStyle(pill).display,
      };
    }, hasStateFn);

    expect(result.slotted).toBe(false);
    expect(result.hasPillState).toBe(false);
    expect(result.pillText).toBe('Critical');
    expect(result.pillDisplay).not.toBe('none');
  });

  test('requirement-card:upgraded fires once after first connect', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector('requirement-card[data-upgraded]');

    const result = await page.evaluate(() => new Promise(resolve => {
      let count = 0;
      document.addEventListener('requirement-card:upgraded', (e) => {
        if (e.target.id === 'late-card') count += 1;
      });
      const el = document.createElement('requirement-card');
      el.id = 'late-card';
      el.setAttribute('data-priority', 'acceptable');
      el.innerHTML = '<span slot="name">Maintainability</span>';
      document.body.appendChild(el);
      // VBElement dispatches :upgraded in a microtask after setup()
      setTimeout(() => resolve({
        count,
        upgraded: el.hasAttribute('data-upgraded'),
        pill: el.shadowRoot.querySelector('[data-priority-default]').textContent,
      }), 50);
    }));

    expect(result.count).toBe(1);
    expect(result.upgraded).toBe(true);
    expect(result.pill).toBe('Acceptable');
  });
});
