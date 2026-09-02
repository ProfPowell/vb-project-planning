/**
 * iron-triangle — capacity formula, manual mode, revisions, drift hash
 *
 * Exercises the arithmetic contract documented in api.json:
 *   capacityPoints = ceil((sprintCount × sprintWeeks) × teamFTE × focusFactor)
 * plus the formula/manual mode flip (iron-triangle:mode), revise() with
 * its rationale minimum (iron-triangle:revise), the FNV-1a drift hash,
 * the over-deadline custom state, the per-vertex dialog round-trip, and
 * the cancelable center "Quality" target (iron-triangle:open-quality).
 *
 * The live, HTML-first `<iron-triangle>` upgrades on this pack's demo
 * page, so the spec navigates there. Demo defaults: sprintWeeks 2,
 * sprintCount 3, teamFTE 1, data-focus-factor 0.6 → 6wk × 1 × 0.6 = 3.6
 * → 4 points.
 */

import { test, expect } from '@playwright/test';

const demoPage = 'demos/iron-triangle-basic/';

async function gotoUpgraded(page) {
  await page.goto(demoPage);
  await page.waitForSelector('iron-triangle[data-upgraded]');
}

test.describe('iron-triangle', () => {

  test('HTML-first upgrade renders the SVG UI with the formula-derived capacity', async ({ page }) => {
    await gotoUpgraded(page);

    const state = await page.evaluate(() => {
      const tri = document.querySelector('iron-triangle');
      const svg = tri.querySelector(':scope > svg');
      const summary = axis => svg.querySelector(`.vertex[data-axis="${axis}"] .vertex-summary`).textContent;
      return {
        capacityPoints: tri.capacityPoints,
        capacitySource: tri.capacitySource,
        dataCapacityPoints: tri.dataset.capacityPoints,
        dataCapacitySource: tri.dataset.capacitySource,
        vertexAxes: [...svg.querySelectorAll('.vertex[data-axis]')].map(g => g.dataset.axis),
        centerNumber: svg.querySelector('.center .capacity').textContent,
        centerUnit: svg.querySelector('.center .capacity-unit').textContent,
        centerTitle: svg.querySelector('.center > title').textContent,
        timeSummary: summary('time'),
        costSummary: summary('cost'),
        scopeSummary: summary('scope'),
        isFormulaState: tri.matches(':state(formula)'),
        isManualState: tri.matches(':state(manual)'),
        isUnbudgeted: tri.matches(':state(unbudgeted)'),
        hashLength: tri.hash.length,
      };
    });

    expect(state.capacityPoints).toBe(4);
    expect(state.capacitySource).toBe('formula');
    expect(state.dataCapacityPoints).toBe('4');
    expect(state.dataCapacitySource).toBe('formula');
    expect(state.vertexAxes.sort()).toEqual(['cost', 'scope', 'time']);
    expect(state.centerNumber).toBe('4');
    expect(state.centerUnit).toBe('pts');
    expect(state.centerTitle).toBe('3 critical: perf, sec, a11y');
    expect(state.timeSummary).toBe('6 weeks (3 × 2wk)');
    expect(state.costSummary).toBe('1 FTE · solo');
    expect(state.scopeSummary).toBe('TBD');
    expect(state.isFormulaState).toBe(true);
    expect(state.isManualState).toBe(false);
    expect(state.isUnbudgeted).toBe(false);
    expect(state.hashLength).toBeGreaterThan(0);
  });

  test('.value setter, data-focus-factor and data-min-capacity recompute capacity and emit :change', async ({ page }) => {
    await gotoUpgraded(page);

    const result = await page.evaluate(() => {
      const tri = document.querySelector('iron-triangle');
      const changes = [];
      tri.addEventListener('iron-triangle:change', (e) => {
        changes.push({ source: e.detail.source, capacityPoints: e.detail.capacityPoints, capacitySource: e.detail.capacitySource });
      });

      // 5 sprints × 2wk = 10wk × 3 FTE × 0.6 = 18.0 → 18
      tri.value = { time: { sprintWeeks: 2, sprintCount: 5 }, cost: { teamFTE: 3 } };
      const afterValue = tri.capacityPoints;

      // 10wk × 3 × 1.0 = 30
      tri.setAttribute('data-focus-factor', '1');
      const afterFocus = tri.capacityPoints;

      // Floor: 30 < 50 → clamped up to the min.
      tri.setAttribute('data-min-capacity', '50');
      const afterMin = tri.capacityPoints;
      tri.removeAttribute('data-min-capacity');
      const afterMinRemoved = tri.capacityPoints;

      // Zero FTE → 0 points → unbudgeted state, and the floor does not lift 0.
      tri.value = { time: { sprintWeeks: 2, sprintCount: 5 }, cost: { teamFTE: 0 } };
      const zero = {
        capacityPoints: tri.capacityPoints,
        unbudgeted: tri.matches(':state(unbudgeted)'),
        centerNumber: tri.querySelector(':scope > svg .center .capacity').textContent,
      };

      return {
        changes,
        afterValue, afterFocus, afterMin, afterMinRemoved, zero,
        roundTrip: tri.value.time,
      };
    });

    expect(result.afterValue).toBe(18);
    expect(result.afterFocus).toBe(30);
    expect(result.afterMin).toBe(50);
    expect(result.afterMinRemoved).toBe(30);
    expect(result.zero).toEqual({ capacityPoints: 0, unbudgeted: true, centerNumber: '—' });
    expect(result.roundTrip).toEqual({ sprintWeeks: 2, sprintCount: 5 });
    expect(result.changes.map(c => c.source)).toEqual(['property', 'attribute', 'attribute', 'attribute', 'property']);
    expect(result.changes[0]).toEqual({ source: 'property', capacityPoints: 18, capacitySource: 'formula' });
    expect(result.changes[1]).toEqual({ source: 'attribute', capacityPoints: 30, capacitySource: 'formula' });
  });

  test('setManual() / setFormula() flip capacitySource, emit :mode once per flip, and leave the hash alone', async ({ page }) => {
    await gotoUpgraded(page);

    const result = await page.evaluate(() => {
      const tri = document.querySelector('iron-triangle');
      const modes = [];
      const changeSources = [];
      tri.addEventListener('iron-triangle:mode', (e) => modes.push({ ...e.detail }));
      tri.addEventListener('iron-triangle:change', (e) => changeSources.push(e.detail.source));
      const hashBefore = tri.hash;
      const unitText = () => tri.querySelector(':scope > svg .center .capacity-unit').textContent;

      tri.setManual(12);
      const manual = {
        capacityPoints: tri.capacityPoints,
        capacitySource: tri.capacitySource,
        dataSource: tri.dataset.capacitySource,
        unit: unitText(),
        manualState: tri.matches(':state(manual)'),
        formulaState: tri.matches(':state(formula)'),
        hashSame: tri.hash === hashBefore,
      };

      // Second setManual must not re-emit :mode; 0 clamps to the floor of 1.
      tri.setManual(0);
      const clamped = tri.capacityPoints;

      tri.setFormula();
      const formula = {
        capacityPoints: tri.capacityPoints,
        capacitySource: tri.capacitySource,
        unit: unitText(),
        manualState: tri.matches(':state(manual)'),
        formulaState: tri.matches(':state(formula)'),
      };

      return { modes, changeSources, manual, clamped, formula };
    });

    expect(result.manual).toEqual({
      capacityPoints: 12, capacitySource: 'manual', dataSource: 'manual',
      unit: 'pts (manual)', manualState: true, formulaState: false, hashSame: true,
    });
    expect(result.clamped).toBe(1);
    expect(result.formula).toEqual({
      capacityPoints: 4, capacitySource: 'formula', unit: 'pts',
      manualState: false, formulaState: true,
    });
    expect(result.modes).toEqual([
      { from: 'formula', to: 'manual' },
      { from: 'manual', to: 'formula' },
    ]);
    expect(result.changeSources).toEqual(['manual', 'manual', 'formula']);
  });

  test('revise() enforces a 10-char reason, logs the change, emits :revise, and moves the drift hash', async ({ page }) => {
    await gotoUpgraded(page);

    const result = await page.evaluate(() => {
      const tri = document.querySelector('iron-triangle');
      const revises = [];
      const changeSources = [];
      tri.addEventListener('iron-triangle:revise', (e) => revises.push({ ...e.detail }));
      tri.addEventListener('iron-triangle:change', (e) => changeSources.push(e.detail.source));
      const hashBefore = tri.hash;

      let shortReasonError = null;
      try { tri.revise('cost.teamFTE', 2, 'too short'); }
      catch (err) { shortReasonError = err.message; }
      const untouched = tri.capacityPoints;

      tri.revise('cost.teamFTE', 2, 'Hired a second engineer for the quarter');
      // 6wk × 2 FTE × 0.6 = 7.2 → 8
      const revised = tri.capacityPoints;

      // Revising capacityPoints routes through setManual().
      tri.revise('capacityPoints', 9, 'Velocity history says nine points');
      const log = tri.revisionLog;

      return {
        shortReasonError,
        untouched,
        revised,
        revises,
        changeSources,
        hashMoved: tri.hash !== hashBefore,
        logLength: log.length,
        logChange: log[0].changes[0],
        logHasTimestamp: typeof log[0].revisedAt === 'string' && !Number.isNaN(Date.parse(log[0].revisedAt)),
        afterCapacityRevise: { capacityPoints: tri.capacityPoints, capacitySource: tri.capacitySource },
        valueCarriesLog: tri.value.revisionLog.length,
      };
    });

    expect(result.shortReasonError).toMatch(/reason of at least 10 characters/);
    expect(result.untouched).toBe(4);
    expect(result.revised).toBe(8);
    expect(result.hashMoved).toBe(true);
    expect(result.logLength).toBe(2);
    expect(result.logHasTimestamp).toBe(true);
    expect(result.logChange).toEqual({
      field: 'cost.teamFTE', from: 1, to: 2, reason: 'Hired a second engineer for the quarter',
    });
    expect(result.revises).toEqual([
      { field: 'cost.teamFTE', from: 1, to: 2, reason: 'Hired a second engineer for the quarter' },
      { field: 'capacityPoints', from: 8, to: 9, reason: 'Velocity history says nine points' },
    ]);
    expect(result.afterCapacityRevise).toEqual({ capacityPoints: 9, capacitySource: 'manual' });
    // setManual() inside revise() emits its own :change before the :revise recompute.
    expect(result.changeSources).toEqual(['revise', 'manual', 'revise']);
    expect(result.valueCarriesLog).toBe(2);
  });

  test('over-deadline custom state tracks a past deadline in the Time section', async ({ page }) => {
    await gotoUpgraded(page);

    const result = await page.evaluate(() => {
      const tri = document.querySelector('iron-triangle');
      const initial = tri.matches(':state(over-deadline)');

      tri.value = { time: { sprintWeeks: 2, sprintCount: 3, deadline: '2000-01-01' } };
      const past = tri.matches(':state(over-deadline)');

      tri.value = { time: { sprintWeeks: 2, sprintCount: 3, deadline: '2999-01-01' } };
      const future = tri.matches(':state(over-deadline)');

      tri.value = { time: { sprintWeeks: 2, sprintCount: 3 } };
      const cleared = tri.matches(':state(over-deadline)');

      return { initial, past, future, cleared };
    });

    expect(result).toEqual({ initial: false, past: true, future: false, cleared: false });
  });

  test('vertex dialog round-trip: openEditor() → edit → submit recomputes with source "dialog"', async ({ page }) => {
    await gotoUpgraded(page);

    const result = await page.evaluate(() => {
      const tri = document.querySelector('iron-triangle');
      const changes = [];
      tri.addEventListener('iron-triangle:change', (e) => changes.push({ source: e.detail.source, field: e.detail.field, capacityPoints: e.detail.capacityPoints }));

      tri.openEditor('time');
      const dialog = tri.querySelector('dialog.iron-triangle-dialog--time');
      const wasOpen = !!dialog && dialog.open;
      const seeded = dialog.querySelector('[name="time.sprintCount"]').value;

      dialog.querySelector('[name="time.sprintCount"]').value = '4';
      dialog.querySelector('form').requestSubmit();

      return {
        wasOpen,
        seeded,
        closedAfterSave: !dialog.open,
        returnValue: dialog.returnValue,
        // 4 × 2wk = 8wk × 1 × 0.6 = 4.8 → 5
        capacityPoints: tri.capacityPoints,
        time: tri.value.time,
        timeSummary: tri.querySelector(':scope > svg .vertex[data-axis="time"] .vertex-summary').textContent,
        changes,
      };
    });

    expect(result.wasOpen).toBe(true);
    expect(result.seeded).toBe('3');
    expect(result.closedAfterSave).toBe(true);
    expect(result.returnValue).toBe('save');
    expect(result.capacityPoints).toBe(5);
    expect(result.time).toEqual({ sprintWeeks: 2, sprintCount: 4, hoursPerWeek: 40 });
    expect(result.timeSummary).toBe('8 weeks (4 × 2wk)');
    expect(result.changes).toEqual([{ source: 'dialog', field: 'time', capacityPoints: 5 }]);
  });

  test('center Quality target fires cancelable :open-quality with summary + capacity', async ({ page }) => {
    await gotoUpgraded(page);

    await page.evaluate(() => {
      window.__openQuality = [];
      document.addEventListener('iron-triangle:open-quality', (e) => {
        window.__openQuality.push({ cancelable: e.cancelable, detail: { ...e.detail } });
        // Prevent the data-quality-href navigation fallback.
        e.preventDefault();
      });
    });

    await page.locator('iron-triangle .center[data-target="quality"]').click();

    // Keyboard activation goes through the same path.
    await page.evaluate(() => {
      const center = document.querySelector('iron-triangle .center[data-target="quality"]');
      center.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    });

    const fired = await page.evaluate(() => window.__openQuality);
    expect(fired).toEqual([
      { cancelable: true, detail: { qualitySummary: '3 critical: perf, sec, a11y', capacityPoints: 4 } },
      { cancelable: true, detail: { qualitySummary: '3 critical: perf, sec, a11y', capacityPoints: 4 } },
    ]);
    // Still on the demo page — the href fallback was suppressed.
    expect(page.url()).toContain('demos/iron-triangle-basic/');
  });

  // ── Accessibility hooks ──────────────────────────────────────────

  test('capacity readout is a polite live <output> that tracks capacity and mode', async ({ page }) => {
    await gotoUpgraded(page);

    const result = await page.evaluate(() => {
      const tri = document.querySelector('iron-triangle');
      const out = tri.querySelector(':scope > .iron-triangle-status output[aria-live="polite"]');
      const initial = out?.textContent.trim();
      tri.setManual(20);
      const manual = out?.textContent.trim();
      tri.setFormula();
      const formula = out?.textContent.trim();
      return { present: !!out, initial, manual, formula };
    });

    expect(result.present).toBe(true);
    expect(result.initial).toMatch(/4 points/);
    expect(result.initial).toMatch(/formula/);
    expect(result.manual).toMatch(/20 points/);
    expect(result.manual).toMatch(/manual/);
    expect(result.formula).toMatch(/4 points/);
  });

  test('over-deadline shows the literal "Deadline has passed" warning text, not just a colour', async ({ page }) => {
    await gotoUpgraded(page);

    const warning = page.locator('iron-triangle > .iron-triangle-status [data-warning="over-deadline"]');
    await expect(warning).toBeHidden();

    await page.evaluate(() => {
      const tri = document.querySelector('iron-triangle');
      tri.value = { time: { sprintWeeks: 2, sprintCount: 3, deadline: '2000-01-01' } };
    });
    await expect(warning).toBeVisible();
    await expect(warning).toContainText('Deadline has passed');
    await expect(warning).toContainText('2000-01-01');
    // The live region announces it too.
    await expect(page.locator('iron-triangle output[aria-live="polite"]')).toContainText('Deadline has passed');

    await page.evaluate(() => {
      document.querySelector('iron-triangle').value = { time: { sprintWeeks: 2, sprintCount: 3 } };
    });
    await expect(warning).toBeHidden();
  });

  test('formula / manual switch is a real <button aria-pressed> that opens the manual-capacity dialog', async ({ page }) => {
    await gotoUpgraded(page);

    const toggle = page.locator('iron-triangle > .iron-triangle-status button.iron-triangle-mode');
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');

    await page.evaluate(() => {
      window.__modes = [];
      document.querySelector('iron-triangle').addEventListener('iron-triangle:mode', (e) => window.__modes.push(e.detail));
    });

    // Press → dialog opens prefilled with the current (formula) capacity.
    await toggle.click();
    const dialog = page.locator('iron-triangle > dialog.iron-triangle-dialog--capacity');
    await expect(dialog).toBeVisible();
    const input = dialog.locator('input[name="capacity.points"]');
    await expect(input).toHaveValue('4');
    await expect(dialog.locator('button[value="formula"]')).toBeHidden();

    await input.fill('20');
    await dialog.locator('button[type="submit"]').click();
    await expect(dialog).toBeHidden();
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');

    const afterManual = await page.evaluate(() => {
      const tri = document.querySelector('iron-triangle');
      return { source: tri.capacitySource, points: tri.capacityPoints, modes: window.__modes };
    });
    expect(afterManual).toEqual({ source: 'manual', points: 20, modes: [{ from: 'formula', to: 'manual' }] });

    // Pressed again → dialog offers "Use formula", which flips back.
    await toggle.click();
    await expect(dialog).toBeVisible();
    await expect(input).toHaveValue('20');
    await dialog.locator('button[value="formula"]').click();
    await expect(dialog).toBeHidden();
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');

    const afterFormula = await page.evaluate(() => {
      const tri = document.querySelector('iron-triangle');
      return { source: tri.capacitySource, points: tri.capacityPoints, modes: window.__modes.length };
    });
    expect(afterFormula).toEqual({ source: 'formula', points: 4, modes: 2 });
  });

  test('disabled / locked also disable the mode toggle', async ({ page }) => {
    await gotoUpgraded(page);
    const toggle = page.locator('iron-triangle button.iron-triangle-mode');
    await expect(toggle).toBeEnabled();
    await page.evaluate(() => document.querySelector('iron-triangle').setAttribute('locked', ''));
    await expect(toggle).toBeDisabled();
    await page.evaluate(() => document.querySelector('iron-triangle').removeAttribute('locked'));
    await expect(toggle).toBeEnabled();
  });
});
