/**
 * user-story — HTML-first upgrade, attribute reactivity, events, methods, .data
 *
 * Covers the contract documented in src/web-components/user-story/api.json:
 * badge rendering from priority / status / points / epic, story-id → id
 * auto-assignment, the `story-ready` event, the updateStatus() /
 * updatePriority() methods and their `status-changed` / `priority-changed`
 * events, detail levels (full / compact / minimal), the `.data`
 * getter/setter (+ `user-story:data-changed`), persona-id → <user-persona>
 * role fallback for the "As a…" statement, and showDetail() for minimal cards.
 *
 * The live, HTML-first `<user-story>` upgrades on this pack's demo pages.
 */

import { test, expect } from '@playwright/test';

const basicDemo = 'demos/user-story-basic/';
const variantsDemo = 'demos/user-story-variants/';
const expandDemo = 'demos/user-story-expand/';

test.describe('user-story', () => {

  test('HTML-first upgrade renders badges + statement and auto-sets id', async ({ page }) => {
    await page.goto(basicDemo);
    await page.waitForSelector('user-story[data-upgraded]');

    const state = await page.evaluate(() => {
      const el = document.querySelector('user-story');
      const sr = el.shadowRoot;
      const text = (sel) => sr.querySelector(sel)?.textContent.replace(/\s+/g, ' ').trim() ?? null;
      return {
        id: el.id,
        ariaLabel: sr.querySelector('.story-card')?.getAttribute('aria-label'),
        level: sr.querySelector('.story-card--full') ? 'full' : null,
        storyId: text('.story-id'),
        epic: text('.epic-badge'),
        priority: text('.priority-badge'),
        status: text('.status-badge'),
        points: text('.points-badge'),
        keywords: [...sr.querySelectorAll('.keyword')].map(k => k.textContent.trim()),
        hasBenefit: !!sr.querySelector('.benefit-text'),
        personaAssigned: sr.querySelector('slot[name="persona"]').assignedElements().length,
        acAssigned: sr.querySelector('slot[name="acceptance-criteria"]').assignedElements().length,
        data: el.data,
      };
    });

    expect(state.id).toBe('PROJ-142');
    expect(state.ariaLabel).toBe('User story: PROJ-142');
    expect(state.level).toBe('full');
    expect(state.storyId).toBe('PROJ-142');
    expect(state.epic).toBe('Dashboard Redesign');
    expect(state.priority).toBe('High');
    expect(state.status).toBe('In Progress');
    expect(state.points).toBe('8');
    expect(state.keywords).toEqual(['As a', 'I want', 'so that']);
    expect(state.hasBenefit).toBe(true);
    expect(state.personaAssigned).toBe(1);
    expect(state.acAssigned).toBe(1);
    expect(state.data).toMatchObject({
      storyId: 'PROJ-142',
      priority: 'high',
      status: 'in-progress',
      points: '8',
      epic: 'Dashboard Redesign',
      persona: 'Product Manager',
      action: 'view all project timelines in a unified dashboard',
    });
    expect(state.data.personaId).toBeUndefined();
  });

  test('updateStatus() / updatePriority() re-render and emit documented events', async ({ page }) => {
    await page.goto(basicDemo);
    await page.waitForSelector('user-story[data-upgraded]');

    const result = await page.evaluate(() => {
      const el = document.querySelector('user-story');
      const sr = el.shadowRoot;
      const events = [];
      document.addEventListener('status-changed', (e) => events.push({ type: e.type, ...e.detail }));
      document.addEventListener('priority-changed', (e) => events.push({ type: e.type, ...e.detail }));

      el.updateStatus('done');
      el.updatePriority('critical');
      const valid = {
        statusAttr: el.getAttribute('status'),
        priorityAttr: el.getAttribute('priority'),
        statusBadge: sr.querySelector('.status-badge')?.textContent.trim(),
        priorityBadge: sr.querySelector('.priority-badge')?.textContent.trim(),
      };

      // Unknown values are ignored: no attribute change, no event
      el.updateStatus('bogus');
      el.updatePriority('urgent');
      const invalid = {
        statusAttr: el.getAttribute('status'),
        priorityAttr: el.getAttribute('priority'),
      };

      return { events, valid, invalid };
    });

    expect(result.events).toEqual([
      { type: 'status-changed', status: 'done', storyId: 'PROJ-142' },
      { type: 'priority-changed', priority: 'critical', storyId: 'PROJ-142' },
    ]);
    expect(result.valid).toEqual({
      statusAttr: 'done',
      priorityAttr: 'critical',
      statusBadge: 'Done',
      priorityBadge: 'Critical',
    });
    expect(result.invalid).toEqual({ statusAttr: 'done', priorityAttr: 'critical' });
  });

  test('attribute changes re-render and re-fire story-ready with detail', async ({ page }) => {
    await page.goto(basicDemo);
    await page.waitForSelector('user-story[data-upgraded]');

    const result = await page.evaluate(() => {
      const el = document.querySelector('user-story');
      const sr = el.shadowRoot;
      const ready = [];
      el.addEventListener('story-ready', (e) => ready.push(e.detail));

      el.setAttribute('points', '13');
      el.setAttribute('epic', 'Platform');
      el.removeAttribute('status');

      return {
        ready,
        points: sr.querySelector('.points-badge')?.textContent.trim(),
        epic: sr.querySelector('.epic-badge')?.textContent.trim(),
        // status getter defaults to backlog when the attribute is absent
        status: el.status,
        statusBadge: sr.querySelector('.status-badge')?.textContent.trim(),
      };
    });

    expect(result.ready).toHaveLength(3);
    expect(result.ready[2]).toEqual({
      id: 'PROJ-142',
      persona: 'Product Manager',
      action: 'view all project timelines in a unified dashboard',
      benefit: 'I can quickly identify bottlenecks and reallocate resources across teams',
      priority: 'high',
      status: 'backlog',
      points: '13',
    });
    expect(result.points).toBe('13');
    expect(result.epic).toBe('Platform');
    expect(result.status).toBe('backlog');
    expect(result.statusBadge).toBe('Backlog');
  });

  test('detail levels: minimal, compact (data-empty), and compact alias', async ({ page }) => {
    await page.goto(variantsDemo);
    await page.waitForSelector('user-story[data-upgraded]');

    const result = await page.evaluate(() => {
      const stories = [...document.querySelectorAll('user-story')];
      const minimal = stories[0];
      const compact = stories.find(s => s.getAttribute('detail') === 'compact');
      const full = stories.find(s => !s.hasAttribute('detail'));

      const minimalSr = minimal.shadowRoot;
      const compactSr = compact.shadowRoot;

      // Snapshot the minimal card BEFORE flipping it (re-render replaces
      // the shadow innerHTML, so queries must happen first).
      const minimalState = {
        isMinimal: !!minimalSr.querySelector('.story-card--minimal'),
        tabindex: minimalSr.querySelector('.story-card')?.getAttribute('tabindex'),
        storyId: minimalSr.querySelector('.story-id')?.textContent.trim(),
        // No title slot → truncated action as fallback label
        label: minimalSr.querySelector('.story-title-fallback')?.textContent.trim(),
        minimalLabel: minimal._minimalLabel,
        noSections: !minimalSr.querySelector('.story-sections'),
      };

      const compactEmpty = [...compactSr.querySelectorAll('.section')].map(s => ({
        title: s.querySelector('.section-title')?.textContent.trim(),
        empty: s.hasAttribute('data-empty'),
      }));

      // Flip the full card to the boolean `compact` alias
      full.setAttribute('compact', '');
      const aliasLevel = full._detailLevel;
      const aliasCard = !!full.shadowRoot.querySelector('.story-card--compact');

      // And the minimal card back to full
      minimal.setAttribute('detail', 'full');
      const minimalToFull = !!minimal.shadowRoot.querySelector('.story-card--full');

      return {
        minimal: minimalState,
        compactEmpty,
        aliasLevel,
        aliasCard,
        minimalToFull,
      };
    });

    expect(result.minimal.isMinimal).toBe(true);
    expect(result.minimal.tabindex).toBe('0');
    expect(result.minimal.storyId).toBe('PROJ-142');
    // Action is > 40 chars → sliced to 40 + ellipsis
    expect(result.minimal.minimalLabel).toBe('view all project timelines in one dashbo…');
    expect(result.minimal.label).toBe(result.minimal.minimalLabel);
    expect(result.minimal.noSections).toBe(true);
    // Compact card has acceptance-criteria only → tasks + notes marked empty
    expect(result.compactEmpty).toEqual([
      { title: 'Acceptance Criteria', empty: false },
      { title: 'Tasks', empty: true },
      { title: 'Notes', empty: true },
    ]);
    expect(result.aliasLevel).toBe('compact');
    expect(result.aliasCard).toBe(true);
    expect(result.minimalToFull).toBe(true);
  });

  test('.data setter applies attributes + slots and emits user-story:data-changed', async ({ page }) => {
    await page.goto(basicDemo);
    await page.waitForSelector('user-story[data-upgraded]');

    const result = await page.evaluate(() => {
      const el = document.createElement('user-story');
      document.body.appendChild(el);

      const fired = [];
      el.addEventListener('user-story:data-changed', (e) => {
        fired.push({ source: e.detail.source, storyId: e.detail.data.storyId });
      });

      el.data = {
        storyId: 'NEW-7',
        priority: 'low',
        status: 'review',
        points: '2',
        epic: 'Growth',
        persona: 'Analyst',
        action: 'export a CSV',
        benefit: 'I can share it',
        acceptanceCriteria: ['Has headers', 'UTF-8 encoded'],
        notes: 'Keep it simple.',
      };

      const sr = el.shadowRoot;
      return {
        fired,
        attrs: {
          storyId: el.getAttribute('story-id'),
          priority: el.getAttribute('priority'),
          status: el.getAttribute('status'),
          points: el.getAttribute('points'),
          epic: el.getAttribute('epic'),
        },
        slots: {
          persona: el.querySelector('[slot="persona"]')?.textContent,
          action: el.querySelector('[slot="action"]')?.textContent,
          benefit: el.querySelector('[slot="benefit"]')?.textContent,
          acItems: [...el.querySelectorAll('[slot="acceptance-criteria"] li')].map(li => li.textContent),
          notesTag: el.querySelector('[slot="notes"]')?.tagName,
        },
        // "Analyst" starts with a vowel → "As an"
        firstKeyword: sr.querySelector('.keyword')?.textContent.trim(),
        priorityBadge: sr.querySelector('.priority-badge')?.textContent.trim(),
        statusBadge: sr.querySelector('.status-badge')?.textContent.trim(),
        data: el.data,
      };
    });

    expect(result.fired).toEqual([{ source: 'property', storyId: 'NEW-7' }]);
    expect(result.attrs).toEqual({
      storyId: 'NEW-7', priority: 'low', status: 'review', points: '2', epic: 'Growth',
    });
    expect(result.slots).toEqual({
      persona: 'Analyst',
      action: 'export a CSV',
      benefit: 'I can share it',
      acItems: ['Has headers', 'UTF-8 encoded'],
      notesTag: 'P',
    });
    expect(result.firstKeyword).toBe('As an');
    expect(result.priorityBadge).toBe('Low');
    expect(result.statusBadge).toBe('Review');
    expect(result.data).toMatchObject({
      storyId: 'NEW-7', priority: 'low', status: 'review', persona: 'Analyst',
      action: 'export a CSV', benefit: 'I can share it',
    });
  });

  test('persona-id links to <user-persona> role and tracks role edits live', async ({ page }) => {
    await page.goto(basicDemo);
    await page.waitForSelector('user-story[data-upgraded]');

    const initial = await page.evaluate(() => {
      const persona = document.createElement('user-persona');
      persona.id = 'p-alex';
      persona.setAttribute('role', 'Engineering Lead');
      persona.innerHTML = '<h2 slot="name">Alex</h2>';
      document.body.appendChild(persona);

      const story = document.createElement('user-story');
      story.id = 'linked-story';
      story.setAttribute('persona-id', 'p-alex');
      story.innerHTML = '<span slot="action">see linked personas</span>';
      document.body.appendChild(story);

      const sr = story.shadowRoot;
      const link = sr.querySelector('.persona-text--link');
      return {
        persona: story.persona,
        personaId: story.personaId,
        href: link?.getAttribute('href'),
        fallbackText: link?.querySelector('slot[name="persona"] span')?.textContent.trim(),
        keyword: sr.querySelector('.keyword')?.textContent.trim(),
        dataPersonaId: story.data.personaId,
      };
    });

    expect(initial.persona).toBe('Engineering Lead');
    expect(initial.personaId).toBe('p-alex');
    expect(initial.href).toBe('#p-alex');
    expect(initial.fallbackText).toBe('Engineering Lead');
    expect(initial.keyword).toBe('As an');
    expect(initial.dataPersonaId).toBe('p-alex');

    // Editing the persona's role re-renders the story via MutationObserver
    await page.evaluate(() => {
      document.getElementById('p-alex').setAttribute('role', 'Data Scientist');
    });
    await page.waitForFunction(() =>
      document.getElementById('linked-story').shadowRoot
        .querySelector('.persona-text--link slot[name="persona"] span')?.textContent.trim() === 'Data Scientist'
    );

    const after = await page.evaluate(() => {
      const story = document.getElementById('linked-story');
      return {
        persona: story.persona,
        keyword: story.shadowRoot.querySelector('.keyword')?.textContent.trim(),
      };
    });
    expect(after.persona).toBe('Data Scientist');
    expect(after.keyword).toBe('As a');

    // Unlinked persona-id falls back to the generic "user"
    const unlinked = await page.evaluate(() => {
      const story = document.getElementById('linked-story');
      story.setAttribute('persona-id', 'nobody-here');
      return {
        persona: story.persona,
        fallbackText: story.shadowRoot
          .querySelector('.persona-text--link slot[name="persona"] span')?.textContent.trim(),
      };
    });
    expect(unlinked.persona).toBe('user');
    expect(unlinked.fallbackText).toBe('user');
  });

  test('showDetail() on a minimal card opens a dialog with a full clone', async ({ page }) => {
    await page.goto(expandDemo);
    await page.waitForSelector('user-story[data-upgraded]');

    const result = await page.evaluate(() => {
      const card = document.getElementById('PROJ-101');
      card.showDetail();
      const dialog = document.getElementById('story-dialog-PROJ-101');
      const clone = dialog?.querySelector('user-story');
      return {
        open: dialog?.open ?? false,
        size: dialog?.getAttribute('data-size'),
        heading: dialog?.querySelector('header h3')?.textContent.trim(),
        cloneDetail: clone?.getAttribute('detail'),
        cloneStoryId: clone?.getAttribute('story-id'),
        cloneAc: clone?.querySelectorAll('[slot="acceptance-criteria"] li').length,
        cloneIsFull: !!clone?.shadowRoot?.querySelector('.story-card--full'),
      };
    });

    expect(result.open).toBe(true);
    expect(result.size).toBe('l');
    expect(result.heading).toBe('Unified timeline dashboard');
    expect(result.cloneDetail).toBe('full');
    expect(result.cloneStoryId).toBe('PROJ-101');
    expect(result.cloneAc).toBe(3);
    expect(result.cloneIsFull).toBe(true);

    // Closing the dialog empties it (the `close` event is dispatched
    // asynchronously, so wait for the once-listener to run)
    await page.evaluate(() => document.getElementById('story-dialog-PROJ-101').close());
    await page.waitForFunction(() =>
      document.getElementById('story-dialog-PROJ-101').innerHTML === ''
    );
    const dialogState = await page.evaluate(() => {
      const dialog = document.getElementById('story-dialog-PROJ-101');
      return { open: dialog.open, innerHTML: dialog.innerHTML };
    });
    expect(dialogState).toEqual({ open: false, innerHTML: '' });
  });

  // BUG (src/web-components/user-story/logic.js): showDetail() explicitly
  // strips the clone's id (`full.removeAttribute('id')`) so the dialog copy
  // doesn't duplicate the original's id — but connectedCallback then runs
  // `if (this.storyId && !this.id) this.id = this.storyId;` on the clone,
  // which re-derives the very same id from story-id. While the dialog is
  // open the document contains two elements with id="PROJ-101", and any
  // `user-story[persona-id=…]` scan (e.g. user-persona.relatedStories())
  // double-counts the clone. Un-fixme once the clone keeps a distinct id.
  test.fixme('showDetail() clone does not duplicate the original element id', async ({ page }) => {
    await page.goto(expandDemo);
    await page.waitForSelector('user-story[data-upgraded]');

    const result = await page.evaluate(() => {
      document.getElementById('PROJ-101').showDetail();
      const clone = document.querySelector('#story-dialog-PROJ-101 user-story');
      return {
        cloneId: clone.id,
        matches: document.querySelectorAll('[id="PROJ-101"]').length,
      };
    });

    expect(result.cloneId).not.toBe('PROJ-101');
    expect(result.matches).toBe(1);
  });
});
