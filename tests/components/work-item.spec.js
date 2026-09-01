/**
 * work-item — HTML-first upgrade, attribute reactivity, events, methods, .data
 *
 * Covers the contract documented in src/web-components/work-item/api.json:
 * badge rendering from type / priority / status / estimate, assignee avatar,
 * story-ids → link list, item-id → id auto-assignment, the `work-item:ready`
 * event, updateStatus() / updatePriority() with their `work-item:status` /
 * `work-item:priority` events, detail levels (full / compact / minimal), and
 * the `.data` getter/setter (+ `work-item:data-changed`).
 *
 * The live, HTML-first `<work-item>` upgrades on this pack's demo page.
 */

import { test, expect } from '@playwright/test';

const demoPage = 'demos/work-item-basic/';

test.describe('work-item', () => {

  test('HTML-first upgrade renders meta, badges, assignee, links; auto-sets id', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector('work-item[data-upgraded]');

    const state = await page.evaluate(() => {
      const items = [...document.querySelectorAll('work-item')];
      const el = items[0];
      const sr = el.shadowRoot;
      const text = (sel) => sr.querySelector(sel)?.textContent.replace(/\s+/g, ' ').trim() ?? null;
      return {
        upgradedCount: items.filter(i => i.hasAttribute('data-upgraded')).length,
        ids: items.map(i => i.id),
        ariaLabel: sr.querySelector('.wi-card')?.getAttribute('aria-label'),
        isFull: !!sr.querySelector('.wi-card--full'),
        itemId: text('.wi-id'),
        type: text('.wi-type'),
        typeData: sr.querySelector('.wi-type')?.getAttribute('data-type'),
        priority: text('.wi-priority'),
        status: text('.wi-status'),
        estimate: text('.wi-estimate'),
        assignee: text('.wi-assignee'),
        assigneeInitials: text('.wi-assignee__avatar'),
        links: [...sr.querySelectorAll('.wi-link')].map(a => a.getAttribute('href')),
        titleAssigned: sr.querySelector('slot[name="title"]').assignedElements().length,
        checklistAssigned: sr.querySelector('slot[name="checklist"]').assignedElements().length,
        data: el.data,
      };
    });

    expect(state.upgradedCount).toBe(4);
    expect(state.ids).toEqual(['PROJ-42', 'PROJ-43', 'PROJ-44', 'PROJ-45']);
    expect(state.ariaLabel).toBe('Work item: PROJ-42');
    expect(state.isFull).toBe(true);
    expect(state.itemId).toBe('PROJ-42');
    expect(state.type).toBe('task');
    expect(state.typeData).toBe('task');
    expect(state.priority).toBe('High');
    expect(state.status).toBe('In Progress');
    expect(state.estimate).toBe('5');
    expect(state.assignee).toBe('SC Sarah Chen');
    expect(state.assigneeInitials).toBe('SC');
    expect(state.links).toEqual(['#PROJ-101', '#PROJ-102']);
    expect(state.titleAssigned).toBe(1);
    expect(state.checklistAssigned).toBe(1);
    expect(state.data).toEqual({
      itemId: 'PROJ-42',
      type: 'task',
      priority: 'high',
      status: 'in-progress',
      estimate: '5',
      assignee: 'Sarah Chen',
      storyIds: ['PROJ-101', 'PROJ-102'],
      detail: undefined,
      title: 'Implement search API endpoint',
    });
  });

  test('updateStatus() / updatePriority() re-render and emit documented events', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector('work-item[data-upgraded]');

    const result = await page.evaluate(() => {
      const el = document.getElementById('PROJ-43');
      const sr = el.shadowRoot;
      const events = [];
      document.addEventListener('work-item:status', (e) => events.push({ type: e.type, ...e.detail }));
      document.addEventListener('work-item:priority', (e) => events.push({ type: e.type, ...e.detail }));

      el.updateStatus('blocked');
      el.updatePriority('low');
      const valid = {
        statusAttr: el.getAttribute('status'),
        priorityAttr: el.getAttribute('priority'),
        statusBadge: sr.querySelector('.wi-status')?.textContent.trim(),
        priorityBadge: sr.querySelector('.wi-priority')?.textContent.trim(),
      };

      // Unknown values are ignored: no attribute change, no event
      el.updateStatus('nope');
      el.updatePriority('p0');
      const invalid = {
        statusAttr: el.getAttribute('status'),
        priorityAttr: el.getAttribute('priority'),
      };

      return { events, valid, invalid };
    });

    expect(result.events).toEqual([
      { type: 'work-item:status', status: 'blocked', itemId: 'PROJ-43' },
      { type: 'work-item:priority', priority: 'low', itemId: 'PROJ-43' },
    ]);
    expect(result.valid).toEqual({
      statusAttr: 'blocked',
      priorityAttr: 'low',
      statusBadge: 'Blocked',
      priorityBadge: 'Low',
    });
    expect(result.invalid).toEqual({ statusAttr: 'blocked', priorityAttr: 'low' });
  });

  test('attribute changes re-render and re-fire work-item:ready with detail', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector('work-item[data-upgraded]');

    const result = await page.evaluate(() => {
      const el = document.getElementById('PROJ-44');
      const sr = el.shadowRoot;
      const ready = [];
      el.addEventListener('work-item:ready', (e) => ready.push(e.detail));

      el.setAttribute('type', 'bug');
      el.setAttribute('assignee', 'Priya Sharma');
      el.setAttribute('story-ids', 'PROJ-7, PROJ-8 ,PROJ-9');
      el.removeAttribute('estimate');

      return {
        ready,
        typeData: sr.querySelector('.wi-type')?.getAttribute('data-type'),
        assignee: sr.querySelector('.wi-assignee')?.textContent.replace(/\s+/g, ' ').trim(),
        storyIds: el.storyIds,
        links: [...sr.querySelectorAll('.wi-link')].map(a => a.getAttribute('href')),
        estimateGone: !sr.querySelector('.wi-estimate'),
      };
    });

    expect(result.ready).toHaveLength(4);
    expect(result.ready[3]).toEqual({
      itemId: 'PROJ-44',
      title: 'Upgrade Node to v22 LTS',
      type: 'bug',
      priority: 'low',
      status: 'backlog',
    });
    expect(result.typeData).toBe('bug');
    expect(result.assignee).toBe('PS Priya Sharma');
    // storyIds getter trims + drops empties
    expect(result.storyIds).toEqual(['PROJ-7', 'PROJ-8', 'PROJ-9']);
    expect(result.links).toEqual(['#PROJ-7', '#PROJ-8', '#PROJ-9']);
    expect(result.estimateGone).toBe(true);
  });

  test('detail levels: compact marks empty sections, minimal drops sections', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector('work-item[data-upgraded]');

    const result = await page.evaluate(() => {
      // PROJ-43 has description only (no checklist / notes)
      const el = document.getElementById('PROJ-43');
      const sr = el.shadowRoot;

      el.setAttribute('compact', '');
      const compact = {
        level: el._detailLevel,
        isCompact: !!sr.querySelector('.wi-card--compact'),
        sections: [...sr.querySelectorAll('.wi-section')].map(s => ({
          title: s.querySelector('.wi-section-title')?.textContent.trim(),
          empty: s.hasAttribute('data-empty'),
        })),
      };

      // Explicit detail wins over the compact alias
      el.setAttribute('detail', 'minimal');
      const minimal = {
        level: el._detailLevel,
        isMinimal: !!sr.querySelector('.wi-card--minimal'),
        tabindex: sr.querySelector('.wi-card')?.getAttribute('tabindex'),
        noSections: !sr.querySelector('.wi-sections'),
        itemId: sr.querySelector('.wi-id')?.textContent.trim(),
        titleAssigned: sr.querySelector('slot[name="title"]').assignedElements().length,
        minimalLabel: el._minimalLabel,
      };

      return { compact, minimal };
    });

    expect(result.compact.level).toBe('compact');
    expect(result.compact.isCompact).toBe(true);
    expect(result.compact.sections).toEqual([
      { title: 'Description', empty: false },
      { title: 'Checklist', empty: true },
      { title: 'Notes', empty: true },
    ]);
    expect(result.minimal.level).toBe('minimal');
    expect(result.minimal.isMinimal).toBe(true);
    expect(result.minimal.tabindex).toBe('0');
    expect(result.minimal.noSections).toBe(true);
    expect(result.minimal.itemId).toBe('PROJ-43');
    expect(result.minimal.titleAssigned).toBe(1);
    expect(result.minimal.minimalLabel).toBe('Fix login redirect on Safari');
  });

  test('.data setter applies attributes + slots and emits work-item:data-changed', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector('work-item[data-upgraded]');

    const result = await page.evaluate(() => {
      const el = document.createElement('work-item');
      document.body.appendChild(el);

      const fired = [];
      el.addEventListener('work-item:data-changed', (e) => {
        fired.push({ source: e.detail.source, itemId: e.detail.data.itemId });
      });

      el.data = {
        itemId: 'NEW-9',
        type: 'feature',
        priority: 'critical',
        status: 'review',
        estimate: 'M',
        assignee: 'Lee Park',
        storyIds: ['S-1', 'S-2'],
        title: 'Ship the thing',
        description: 'A description.',
        checklist: ['One', 'Two', 'Three'],
        notes: 'Some notes.',
      };

      const sr = el.shadowRoot;
      return {
        fired,
        attrs: {
          itemId: el.getAttribute('item-id'),
          type: el.getAttribute('type'),
          storyIds: el.getAttribute('story-ids'),
        },
        slots: {
          titleTag: el.querySelector('[slot="title"]')?.tagName,
          title: el.querySelector('[slot="title"]')?.textContent,
          description: el.querySelector('[slot="description"]')?.textContent,
          checklist: [...el.querySelectorAll('[slot="checklist"] li')].map(li => li.textContent),
          notes: el.querySelector('[slot="notes"]')?.textContent,
        },
        typeData: sr.querySelector('.wi-type')?.getAttribute('data-type'),
        priorityBadge: sr.querySelector('.wi-priority')?.textContent.trim(),
        statusBadge: sr.querySelector('.wi-status')?.textContent.trim(),
        estimate: sr.querySelector('.wi-estimate')?.textContent.trim(),
        links: [...sr.querySelectorAll('.wi-link')].map(a => a.getAttribute('href')),
        data: el.data,
      };
    });

    expect(result.fired).toEqual([{ source: 'property', itemId: 'NEW-9' }]);
    expect(result.attrs).toEqual({ itemId: 'NEW-9', type: 'feature', storyIds: 'S-1,S-2' });
    expect(result.slots).toEqual({
      titleTag: 'H3',
      title: 'Ship the thing',
      description: 'A description.',
      checklist: ['One', 'Two', 'Three'],
      notes: 'Some notes.',
    });
    expect(result.typeData).toBe('feature');
    expect(result.priorityBadge).toBe('Critical');
    expect(result.statusBadge).toBe('Review');
    expect(result.estimate).toBe('M');
    expect(result.links).toEqual(['#S-1', '#S-2']);
    expect(result.data).toEqual({
      itemId: 'NEW-9',
      type: 'feature',
      priority: 'critical',
      status: 'review',
      estimate: 'M',
      assignee: 'Lee Park',
      storyIds: ['S-1', 'S-2'],
      detail: undefined,
      title: 'Ship the thing',
    });
  });
});
