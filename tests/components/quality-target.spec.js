/**
 * quality-target — critical-sum budgeting against iron-triangle capacity
 *
 * Exercises the arithmetic contract documented in api.json:
 *   criticalSum = Σ costWeights[ility] for every ility picked "critical"
 * checked against capacityPoints (bound triangle → data-capacity-points
 * → .capacityPoints property → Infinity). Covers the .vector /
 * .rationales setters, the edge-triggered over-budget / under-budget
 * events and :state(over-budget), checkValidity() with the rationale
 * minimums, data-cost-weights overrides + capacity fallback order, the
 * per-axis dialog gate (canSaveAxis), and the live iron-triangle binding.
 *
 * The live, HTML-first `<quality-target>` upgrades on this pack's demo
 * page bound to an `<iron-triangle id="shape">` whose defaults compute
 * 4 capacity points. Default cost weights: accessibility 3,
 * maintainability 2, performance 5, security 5.
 */

import { test, expect } from '@playwright/test';

const demoPage = 'demos/quality-target-basic/';

async function gotoUpgraded(page) {
  await page.goto(demoPage);
  await page.waitForSelector('quality-target[data-upgraded]');
  await page.waitForSelector('iron-triangle[data-upgraded]');
}

test.describe('quality-target', () => {

  test('HTML-first upgrade renders the radar with 11 axes and the bound capacity readout', async ({ page }) => {
    await gotoUpgraded(page);

    const state = await page.evaluate(() => {
      const qt = document.querySelector('quality-target');
      const svg = qt.querySelector(':scope > svg');
      return {
        axes: [...svg.querySelectorAll('.axis[data-ility]')].map(g => g.dataset.ility),
        axisLevels: svg.querySelectorAll('.axis[data-level]').length,
        svgLabel: svg.getAttribute('aria-label'),
        sum: svg.querySelector('.center .capacity-sum').textContent,
        denom: svg.querySelector('.center .capacity-denom').textContent,
        capacityPoints: qt.capacityPoints,
        criticalSum: qt.criticalSum,
        overBudget: qt.overBudget,
        overrunHidden: qt.querySelector('[data-quality-overrun]').hidden,
        errorsRole: qt.querySelector('[data-quality-errors]').getAttribute('role'),
        value: qt.value,
        triangleHash: document.getElementById('shape').hash,
        firstAxisLabel: svg.querySelector('.axis[data-ility="performance"]').getAttribute('aria-label'),
      };
    });

    expect(state.axes).toEqual([
      'performance', 'accessibility', 'security', 'reliability', 'maintainability',
      'observability', 'compatibility', 'scalability', 'portability',
      'internationalization', 'privacy',
    ]);
    expect(state.axisLevels).toBe(0);
    expect(state.svgLabel).toBe('Quality target. 0 critical of 11 ilities. Click any axis to edit.');
    expect(state.sum).toBe('0');
    expect(state.denom).toBe('of 4');
    expect(state.capacityPoints).toBe(4);
    expect(state.criticalSum).toBe(0);
    expect(state.overBudget).toBe(false);
    expect(state.overrunHidden).toBe(true);
    expect(state.errorsRole).toBe('alert');
    expect(state.value.capacityPoints).toBe(4);
    expect(state.value.capacitySource).toBe('formula');
    expect(state.value.ironTriangleHash).toBe(state.triangleHash);
    expect(state.value.costWeights.performance).toBe(5);
    expect(state.firstAxisLabel).toBe('Performance — unset · 5 pts. Activate to edit.');
  });

  test('.vector setter sums critical cost weights and edge-triggers over/under-budget', async ({ page }) => {
    await gotoUpgraded(page);

    const result = await page.evaluate(() => {
      const qt = document.querySelector('quality-target');
      const events = [];
      for (const name of ['quality-target:over-budget', 'quality-target:under-budget']) {
        qt.addEventListener(name, (e) => events.push({ name, detail: { ...e.detail } }));
      }
      const changes = [];
      qt.addEventListener('quality-target:change', (e) => changes.push({
        source: e.detail.source, criticalSum: e.detail.criticalSum, capacityPoints: e.detail.capacityPoints,
      }));
      const readout = () => {
        const overrun = qt.querySelector('[data-quality-overrun]');
        return {
          sum: qt.querySelector(':scope > svg .center .capacity-sum').textContent,
          over: qt.querySelector(':scope > svg .center').hasAttribute('data-over'),
          state: qt.matches(':state(over-budget)'),
          overrunHidden: overrun.hidden,
          // The prompt only matters while the overrun section is shown.
          prompt: overrun.hidden ? null : overrun.querySelector('[data-overrun-prompt]').textContent,
        };
      };

      // 3 (a11y) + 2 (maint) = 5 > 4 → over by 1
      qt.vector = { accessibility: 'critical', maintainability: 'critical', privacy: 'bogus-level' };
      const over = readout();
      const overVector = qt.vector;
      const levelsInSvg = [...qt.querySelectorAll(':scope > svg .axis[data-level]')]
        .map(g => [g.dataset.ility, g.dataset.level]);

      // Downgrade maint → 3 ≤ 4 → back under, slack 1. Merge semantics keep a11y.
      qt.vector = { maintainability: 'important' };
      const under = readout();

      // Same side of the line again → no extra edge event.
      qt.vector = { performance: 'acceptable' };

      return { events, changes, over, overVector, levelsInSvg, under, finalVector: qt.vector, criticalSum: qt.criticalSum };
    });

    expect(result.over).toEqual({ sum: '5', over: true, state: true, overrunHidden: false, prompt: "You're over budget by 1 points (5/4)." });
    expect(result.overVector).toEqual({ accessibility: 'critical', maintainability: 'critical' });
    expect(result.levelsInSvg).toEqual([['accessibility', 'critical'], ['maintainability', 'critical']]);
    expect(result.under).toEqual({ sum: '3', over: false, state: false, overrunHidden: true, prompt: null });
    expect(result.finalVector).toEqual({ accessibility: 'critical', maintainability: 'important', performance: 'acceptable' });
    expect(result.criticalSum).toBe(3);
    expect(result.events).toEqual([
      { name: 'quality-target:over-budget',  detail: { delta: 1, criticalSum: 5, capacityPoints: 4 } },
      { name: 'quality-target:under-budget', detail: { slack: 1, criticalSum: 3, capacityPoints: 4 } },
    ]);
    expect(result.changes).toEqual([
      { source: 'property', criticalSum: 5, capacityPoints: 4 },
      { source: 'property', criticalSum: 3, capacityPoints: 4 },
      { source: 'property', criticalSum: 3, capacityPoints: 4 },
    ]);
  });

  test('checkValidity() enforces per-critical rationale and overrun rationale minimums', async ({ page }) => {
    await gotoUpgraded(page);

    const result = await page.evaluate(() => {
      const qt = document.querySelector('quality-target');
      const errors = () => qt.querySelector('[data-quality-errors]').textContent;
      const steps = [];

      qt.vector = { accessibility: 'critical' };            // 3 ≤ 4, within budget
      steps.push({ step: 'no-rationale', valid: qt.checkValidity(), errors: errors(), state: qt.matches(':state(missing-rationale)') });

      qt.rationales = { accessibility: 'short' };
      steps.push({ step: 'short-rationale', valid: qt.checkValidity(), errors: errors() });

      qt.rationales = { accessibility: 'Screen-reader users are our core audience' };
      steps.push({ step: 'ok-rationale', valid: qt.checkValidity(), errors: errors(), state: qt.matches(':state(missing-rationale)') });

      qt.vector = { maintainability: 'critical' };           // 3 + 2 = 5 > 4
      qt.rationales = { maintainability: 'Long-lived codebase, many contributors' };
      steps.push({ step: 'over-no-overrun', valid: qt.checkValidity(), errors: errors() });

      qt.overrunRationale = 'Security mandate from legal, approved by CTO';
      steps.push({ step: 'over-with-overrun', valid: qt.checkValidity(), errors: errors(), textarea: qt.querySelector('[data-quality-overrun] textarea').value });

      return steps;
    });

    expect(result[0]).toEqual({
      step: 'no-rationale', valid: false, state: true,
      errors: 'Critical "accessibility" needs a rationale of at least 10 characters.',
    });
    expect(result[1].valid).toBe(false);
    expect(result[1].errors).toContain('Critical "accessibility"');
    expect(result[2]).toEqual({ step: 'ok-rationale', valid: true, errors: '', state: false });
    expect(result[3].valid).toBe(false);
    expect(result[3].errors).toBe('Over budget by 1 points (5/4); overrunRationale of at least 10 characters required.');
    expect(result[4]).toEqual({
      step: 'over-with-overrun', valid: true, errors: '',
      textarea: 'Security mandate from legal, approved by CTO',
    });
  });

  test('data-cost-weights overrides weights; capacity falls back attr → property → unbounded', async ({ page }) => {
    await gotoUpgraded(page);

    const result = await page.evaluate(() => {
      // Fresh, unbound element so the demo's triangle binding does not apply.
      const qt = document.createElement('quality-target');
      qt.setAttribute('data-capacity-points', '12');
      qt.setAttribute('data-cost-weights', '{"performance": 7, "privacy": "2.9", "bogus": 1}');
      document.body.append(qt);
      const upgraded = qt.hasAttribute('data-upgraded');
      const denom = () => qt.querySelector(':scope > svg .center .capacity-denom').textContent;

      qt.vector = { performance: 'critical', privacy: 'critical' };
      const withAttr = {
        upgraded,
        weights: { performance: qt.costWeights.performance, privacy: qt.costWeights.privacy, security: qt.costWeights.security },
        hasBogus: 'bogus' in qt.costWeights,
        criticalSum: qt.criticalSum,         // 7 + floor(2.9)=2 → 9
        capacityPoints: qt.capacityPoints,
        overBudget: qt.overBudget,
        denom: denom(),
        capacitySource: qt.value.capacitySource,
        hash: qt.value.ironTriangleHash,
        axisLabel: qt.querySelector(':scope > svg .axis[data-ility="performance"] > title').textContent,
      };

      // Attribute gone → property override wins.
      qt.removeAttribute('data-capacity-points');
      qt.capacityPoints = 8;
      const withProp = { capacityPoints: qt.capacityPoints, overBudget: qt.overBudget, denom: denom() };

      // Neither → unbounded.
      qt.capacityPoints = null;
      const unbounded = {
        finite: Number.isFinite(qt.capacityPoints),
        serialized: qt.value.capacityPoints,
        overBudget: qt.overBudget,
        denom: denom(),
        valid: qt.checkValidity(),
      };

      qt.remove();
      return { withAttr, withProp, unbounded };
    });

    expect(result.withAttr).toEqual({
      upgraded: true,
      weights: { performance: 7, privacy: 2, security: 5 },
      hasBogus: false,
      criticalSum: 9,
      capacityPoints: 12,
      overBudget: false,
      denom: 'of 12',
      capacitySource: 'manual',
      hash: null,
      axisLabel: 'Performance — Critical · 7 pts',
    });
    expect(result.withProp).toEqual({ capacityPoints: 8, overBudget: true, denom: 'of 8' });
    // Unbounded: never over budget; validity fails only on the missing critical rationales.
    expect(result.unbounded).toEqual({ finite: false, serialized: null, overBudget: false, denom: 'unbounded', valid: false });
  });

  test('axis dialog gates Critical on the rationale minimum, then commits with source "dialog"', async ({ page }) => {
    await gotoUpgraded(page);

    const result = await page.evaluate(() => {
      const qt = document.querySelector('quality-target');
      const changes = [];
      qt.addEventListener('quality-target:change', (e) => changes.push({ source: e.detail.source, field: e.detail.field, criticalSum: e.detail.criticalSum }));

      qt.openEditor('security');
      const dialog = qt.querySelector('dialog.quality-dialog--security');
      const form = dialog.querySelector('form');
      const err = dialog.querySelector('[data-dialog-error]');
      const wasOpen = dialog.open;

      // 1. No level picked.
      form.requestSubmit();
      const noLevel = { errHidden: err.hidden, errText: err.textContent, stillOpen: dialog.open };

      // 2. Critical with a too-short rationale.
      form.querySelector('input[name="level"][value="critical"]').checked = true;
      form.querySelector('textarea[name="rationale"]').value = 'because';
      form.requestSubmit();
      const tooShort = { errText: err.textContent, stillOpen: dialog.open, vector: qt.vector };

      // 3. Critical with an adequate rationale.
      form.querySelector('textarea[name="rationale"]').value = '  PCI scope — card data in flight  ';
      form.requestSubmit();
      const saved = {
        closed: !dialog.open,
        returnValue: dialog.returnValue,
        vector: qt.vector,
        rationales: qt.rationales,
        criticalSum: qt.criticalSum,
        overBudget: qt.overBudget,
        axisLevel: qt.querySelector(':scope > svg .axis[data-ility="security"]').dataset.level,
      };

      // 4. Reopen → dialog reflects state; downgrading drops the rationale.
      qt.openEditor('security');
      const reopened = {
        checked: form.querySelector('input[name="level"]:checked')?.value,
        rationale: form.querySelector('textarea[name="rationale"]').value,
        errHidden: err.hidden,
      };
      form.querySelector('input[name="level"][value="important"]').checked = true;
      form.requestSubmit();
      const downgraded = { vector: qt.vector, rationales: qt.rationales, criticalSum: qt.criticalSum };

      return { wasOpen, noLevel, tooShort, saved, reopened, downgraded, changes };
    });

    expect(result.wasOpen).toBe(true);
    expect(result.noLevel).toEqual({ errHidden: false, errText: 'Pick a priority level.', stillOpen: true });
    expect(result.tooShort).toEqual({ errText: 'Rationale must be at least 10 characters.', stillOpen: true, vector: {} });
    expect(result.saved).toEqual({
      closed: true, returnValue: 'save',
      vector: { security: 'critical' },
      rationales: { security: 'PCI scope — card data in flight' },
      criticalSum: 5, overBudget: true, axisLevel: 'critical',
    });
    expect(result.reopened).toEqual({ checked: 'critical', rationale: 'PCI scope — card data in flight', errHidden: true });
    expect(result.downgraded).toEqual({ vector: { security: 'important' }, rationales: {}, criticalSum: 0 });
    expect(result.changes).toEqual([
      { source: 'dialog', field: 'security', criticalSum: 5 },
      { source: 'dialog', field: 'security', criticalSum: 0 },
    ]);
  });

  test('bound iron-triangle changes re-publish with source "iron-triangle" and the new capacity', async ({ page }) => {
    await gotoUpgraded(page);

    const result = await page.evaluate(() => {
      const qt = document.querySelector('quality-target');
      const tri = document.getElementById('shape');
      const changes = [];
      qt.addEventListener('quality-target:change', (e) => changes.push({
        source: e.detail.source, capacityPoints: e.detail.capacityPoints, capacitySource: e.detail.capacitySource, hash: e.detail.ironTriangleHash,
      }));
      const budget = [];
      qt.addEventListener('quality-target:over-budget', (e) => budget.push(['over', { ...e.detail }]));
      qt.addEventListener('quality-target:under-budget', (e) => budget.push(['under', { ...e.detail }]));

      qt.vector = { performance: 'critical', security: 'critical' };   // 10 > 4 → over
      tri.setManual(20);                                               // 10 ≤ 20 → under
      const denom = qt.querySelector(':scope > svg .center .capacity-denom').textContent;

      return { changes, budget, denom, capacityPoints: qt.capacityPoints, triHash: tri.hash };
    });

    expect(result.capacityPoints).toBe(20);
    expect(result.denom).toBe('of 20');
    expect(result.changes).toEqual([
      { source: 'property',      capacityPoints: 4,  capacitySource: 'formula', hash: result.triHash },
      { source: 'iron-triangle', capacityPoints: 20, capacitySource: 'manual',  hash: result.triHash },
    ]);
    expect(result.budget).toEqual([
      ['over',  { delta: 6,  criticalSum: 10, capacityPoints: 4 }],
      ['under', { slack: 10, criticalSum: 10, capacityPoints: 20 }],
    ]);
  });
});
