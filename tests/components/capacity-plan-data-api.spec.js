/**
 * capacity-plan — Data API (ledger arithmetic + bindings)
 *
 * Exercises the ledger contract documented in api.json and the element
 * doc page:
 *   slack = capacityPoints (iron-triangle) − criticalSum (quality-target)
 *           − Σ slotted [data-capacity-cost]
 * Covers the HTML-first ledger render, the .featureSum override, the
 * edge-triggered capacity-plan:overdrawn event and :state(overdrawn),
 * live re-render on bound triangle / quality changes and on slotted
 * work-item mutations, proportional bar widths, and the unbounded (no
 * binding) path.
 *
 * The live, HTML-first `<capacity-plan>` upgrades on this pack's demo
 * page bound to `<iron-triangle id="shape">` (defaults → 4 points) and
 * `<quality-target id="quality">` (nothing critical → 0), with two
 * slotted work-items costing 3 + 2. The demo therefore opens overdrawn:
 * 4 − 0 − 5 = −1.
 */

import { test, expect } from '@playwright/test';

const demoPage = 'demos/capacity-plan-basic/';

async function gotoUpgraded(page) {
  await page.goto(demoPage);
  await page.waitForSelector('capacity-plan[data-upgraded]');
  await page.waitForSelector('iron-triangle[data-upgraded]');
  await page.waitForSelector('quality-target[data-upgraded]');
  // Install a serializable ledger snapshot helper for the page.evaluate blocks below.
  await page.evaluate(() => {
    window.__readLedger = (plan) => {
      const table = plan.querySelector(':scope > [data-capacity-table]');
      const row = name => table.querySelector(`[data-row="${name}"]`);
      const num = name => row(name).querySelector('dd.num').textContent;
      const width = name => row(name).querySelector('.bar-fill').style.getPropertyValue('--w');
      return {
        cells: { capacity: num('capacity'), quality: num('quality'), features: num('features'), slack: num('slack') },
        widths: { quality: width('quality'), features: width('features'), slack: width('slack') },
        slackState: row('slack').dataset.state,
        overdrawnState: plan.matches(':state(overdrawn)'),
        tableIsFirstChild: plan.firstElementChild === table,
      };
    };
  });
}

test.describe('capacity-plan — data API', () => {

  test('HTML-first upgrade renders the ledger from the bound triangle, quality target, and slotted costs', async ({ page }) => {
    await gotoUpgraded(page);

    const state = await page.evaluate(() => {
      const plan = document.querySelector('capacity-plan');
      return {
        ledger: window.__readLedger(plan),
        capacityPoints: plan.capacityPoints,
        qualitySum: plan.qualitySum,
        featureSum: plan.featureSum,
        slack: plan.slack,
        workItems: plan.querySelectorAll('work-item[data-capacity-cost]').length,
        dlLabel: plan.querySelector('dl.capacity-ledger').getAttribute('aria-label'),
      };
    });

    expect(state.capacityPoints).toBe(4);
    expect(state.qualitySum).toBe(0);
    expect(state.featureSum).toBe(5);
    expect(state.slack).toBe(-1);
    expect(state.workItems).toBe(2);
    expect(state.dlLabel).toBe('Capacity ledger');
    expect(state.ledger.cells).toEqual({ capacity: '4 pts', quality: '0 pts', features: '−5 pts', slack: '-1 pts' });
    // Over budget: chunks normalize against spend (5) so the bar overflows.
    expect(state.ledger.widths).toEqual({ quality: '0.0%', features: '100.0%', slack: '0.0%' });
    expect(state.ledger.slackState).toBe('over');
    expect(state.ledger.overdrawnState).toBe(true);
    expect(state.ledger.tableIsFirstChild).toBe(true);
  });

  test('.featureSum override recomputes slack and edge-triggers capacity-plan:overdrawn', async ({ page }) => {
    await gotoUpgraded(page);

    const result = await page.evaluate(() => {
      const read = window.__readLedger;
      const plan = document.querySelector('capacity-plan');
      const events = [];
      plan.addEventListener('capacity-plan:overdrawn', (e) => events.push({ source: e.detail.source, ledger: { ...e.detail.ledger } }));

      plan.featureSum = 2;                    // 4 − 0 − 2 = +2 → crosses back under
      const under = { ...read(plan), slack: plan.slack, featureSum: plan.featureSum };

      plan.featureSum = 1;                    // still under → no extra event
      plan.featureSum = 4;                    // exactly zero slack → still "under" (not < 0)
      const zero = { ...read(plan), slack: plan.slack };

      plan.featureSum = 'not a number';       // invalid → clears override → back to slotted 5
      const restored = { ...read(plan), slack: plan.slack, featureSum: plan.featureSum };

      return { events, under, zero, restored };
    });

    expect(result.under.slack).toBe(2);
    expect(result.under.featureSum).toBe(2);
    expect(result.under.cells).toEqual({ capacity: '4 pts', quality: '0 pts', features: '−2 pts', slack: '+2 pts' });
    expect(result.under.widths).toEqual({ quality: '0.0%', features: '50.0%', slack: '50.0%' });
    expect(result.under.slackState).toBe('under');
    expect(result.under.overdrawnState).toBe(false);

    expect(result.zero.slack).toBe(0);
    expect(result.zero.cells.slack).toBe('0 pts');
    expect(result.zero.slackState).toBe('under');

    expect(result.restored.slack).toBe(-1);
    expect(result.restored.featureSum).toBe(5);
    expect(result.restored.cells.slack).toBe('-1 pts');
    expect(result.restored.overdrawnState).toBe(true);

    // Exactly two edges: over→under (featureSum=2), under→over (override cleared).
    expect(result.events.map(e => e.source)).toEqual(['render', 'render']);
    expect(result.events[0].ledger).toEqual({ capacity: 4, quality: 0, features: 2, slack: 2 });
    expect(result.events[1].ledger).toEqual({ capacity: 4, quality: 0, features: 5, slack: -1 });
  });

  test('re-renders live when the bound iron-triangle or quality-target changes', async ({ page }) => {
    await gotoUpgraded(page);

    const result = await page.evaluate(() => {
      const read = window.__readLedger;
      const plan = document.querySelector('capacity-plan');
      const tri = document.getElementById('shape');
      const qt = document.getElementById('quality');
      const overdrawn = [];
      plan.addEventListener('capacity-plan:overdrawn', (e) => overdrawn.push(e.detail.ledger.slack));

      tri.setManual(20);                                              // 20 − 0 − 5 = 15
      const afterTriangle = { ...read(plan), capacityPoints: plan.capacityPoints, slack: plan.slack };

      qt.vector = { performance: 'critical', security: 'critical' }; // 20 − 10 − 5 = 5
      const afterQuality = { ...read(plan), qualitySum: plan.qualitySum, slack: plan.slack };

      tri.setFormula();                                               // 4 − 10 − 5 = −11
      const afterFormula = { ...read(plan), slack: plan.slack };

      return { overdrawn, afterTriangle, afterQuality, afterFormula };
    });

    expect(result.afterTriangle.capacityPoints).toBe(20);
    expect(result.afterTriangle.slack).toBe(15);
    expect(result.afterTriangle.cells).toEqual({ capacity: '20 pts', quality: '0 pts', features: '−5 pts', slack: '+15 pts' });
    expect(result.afterTriangle.widths).toEqual({ quality: '0.0%', features: '25.0%', slack: '75.0%' });

    expect(result.afterQuality.qualitySum).toBe(10);
    expect(result.afterQuality.slack).toBe(5);
    expect(result.afterQuality.cells).toEqual({ capacity: '20 pts', quality: '−10 pts', features: '−5 pts', slack: '+5 pts' });
    expect(result.afterQuality.widths).toEqual({ quality: '50.0%', features: '25.0%', slack: '25.0%' });
    expect(result.afterQuality.slackState).toBe('under');

    expect(result.afterFormula.slack).toBe(-11);
    expect(result.afterFormula.cells.slack).toBe('-11 pts');
    // Spend 15 > capacity 4 → normalize against spend.
    expect(result.afterFormula.widths).toEqual({ quality: '66.7%', features: '33.3%', slack: '0.0%' });
    expect(result.afterFormula.slackState).toBe('over');

    expect(result.overdrawn).toEqual([15, -11]);
  });

  test('slotted work-item mutations (add / cost change / remove) re-sum the feature spend', async ({ page }) => {
    await gotoUpgraded(page);

    await page.evaluate(() => {
      const plan = document.querySelector('capacity-plan');
      const extra = document.createElement('work-item');
      extra.setAttribute('data-capacity-cost', '7');
      extra.id = 'extra-item';
      plan.append(extra);
    });
    await page.waitForFunction(() => document.querySelector('capacity-plan [data-row="features"] dd.num').textContent === '−12 pts');

    await page.evaluate(() => {
      // Non-positive / non-numeric costs count as 0.
      document.getElementById('extra-item').setAttribute('data-capacity-cost', '-4');
    });
    await page.waitForFunction(() => document.querySelector('capacity-plan [data-row="features"] dd.num').textContent === '−5 pts');

    await page.evaluate(() => {
      document.getElementById('extra-item').setAttribute('data-capacity-cost', '1.5');
    });
    await page.waitForFunction(() => document.querySelector('capacity-plan [data-row="features"] dd.num').textContent === '−6.5 pts');

    await page.evaluate(() => document.getElementById('extra-item').remove());
    await page.waitForFunction(() => document.querySelector('capacity-plan [data-row="features"] dd.num').textContent === '−5 pts');

    const final = await page.evaluate(() => {
      const plan = document.querySelector('capacity-plan');
      return {
        featureSum: plan.featureSum,
        slack: plan.slack,
        // Only one ledger table ever exists — re-renders reuse it.
        tables: plan.querySelectorAll(':scope > [data-capacity-table]').length,
      };
    });
    expect(final).toEqual({ featureSum: 5, slack: -1, tables: 1 });
  });

  test('unbound plan reports ∞ capacity, scales bars against spend, and never goes overdrawn', async ({ page }) => {
    await gotoUpgraded(page);

    const result = await page.evaluate(() => {
      const read = window.__readLedger;
      const plan = document.createElement('capacity-plan');
      plan.innerHTML = `
        <work-item data-capacity-cost="3"></work-item>
        <work-item data-capacity-cost="4"></work-item>
        <work-item>no cost attribute</work-item>
      `;
      const events = [];
      plan.addEventListener('capacity-plan:overdrawn', (e) => events.push(e.detail));
      document.body.append(plan);
      const upgraded = plan.hasAttribute('data-upgraded');

      const unbound = {
        ...read(plan),
        capacityFinite: Number.isFinite(plan.capacityPoints),
        slackFinite: Number.isFinite(plan.slack),
        featureSum: plan.featureSum,
        qualitySum: plan.qualitySum,
      };

      // Binding to the demo's triangle after the fact (attribute change) picks up its 4 points.
      plan.setAttribute('data-bind-triangle', 'shape');
      const bound = { ...read(plan), capacityPoints: plan.capacityPoints, slack: plan.slack };

      // Empty plan with no spend at all → 100% slack.
      const empty = document.createElement('capacity-plan');
      document.body.append(empty);
      const emptyLedger = read(empty);

      plan.remove();
      empty.remove();
      return { upgraded, unbound, bound, empty: emptyLedger, events };
    });

    expect(result.upgraded).toBe(true);
    expect(result.unbound.capacityFinite).toBe(false);
    expect(result.unbound.slackFinite).toBe(false);
    expect(result.unbound.featureSum).toBe(7);
    expect(result.unbound.qualitySum).toBe(0);
    expect(result.unbound.cells).toEqual({ capacity: '∞', quality: '0 pts', features: '−7 pts', slack: '∞' });
    expect(result.unbound.widths).toEqual({ quality: '0.0%', features: '100.0%', slack: '0.0%' });
    expect(result.unbound.slackState).toBe('under');
    expect(result.unbound.overdrawnState).toBe(false);

    // Binding fires the edge into overdrawn: 4 − 0 − 7 = −3.
    expect(result.bound.capacityPoints).toBe(4);
    expect(result.bound.slack).toBe(-3);
    expect(result.bound.cells).toEqual({ capacity: '4 pts', quality: '0 pts', features: '−7 pts', slack: '-3 pts' });
    expect(result.bound.overdrawnState).toBe(true);

    expect(result.empty.cells).toEqual({ capacity: '∞', quality: '0 pts', features: '0 pts', slack: '∞' });
    expect(result.empty.widths).toEqual({ quality: '0.0%', features: '0.0%', slack: '100.0%' });

    expect(result.events.length).toBe(1);
    expect(result.events[0].source).toBe('render');
    expect(result.events[0].ledger.slack).toBe(-3);
  });
});
