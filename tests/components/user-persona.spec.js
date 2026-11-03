/**
 * user-persona — HTML-first upgrade, attribute reactivity, events, .data
 *
 * Covers the contract documented in src/web-components/user-persona/api.json:
 * attribute-driven header (job-title / age / location), slot-driven name + quote,
 * the `user-persona:ready` event (and its deprecated `persona-ready` alias),
 * migration of the legacy `role` attribute, the `.data` getter/setter (+ its
 * `user-persona:data-changed` event), and the `data-list-stories`
 * traceability section that auto-lists linked <user-story> elements.
 *
 * The live, HTML-first `<user-persona>` upgrades on this pack's demo pages,
 * so each test navigates there and pokes the element via page.evaluate.
 */

import { test, expect } from '@playwright/test';
import { openUpgradePage, recordedEvents, moveElement } from './helpers/upgrade-page.js';

const basicDemo = 'demos/user-persona-basic/';
const storiesDemo = 'demos/user-persona-stories/';

test.describe('user-persona', () => {

  test('HTML-first upgrade renders attributes + slots into shadow DOM', async ({ page }) => {
    await page.goto(basicDemo);
    await page.waitForSelector('user-persona[data-upgraded]');

    const state = await page.evaluate(() => {
      const el = document.querySelector('user-persona');
      const sr = el.shadowRoot;
      const text = (sel) => sr.querySelector(sel)?.textContent.replace(/\s+/g, ' ').trim() ?? null;
      return {
        ariaLabel: sr.querySelector('.persona-card')?.getAttribute('aria-label'),
        role: text('.persona-role'),
        meta: [...sr.querySelectorAll('.meta-item')].map(n => n.textContent.replace(/\s+/g, ' ').trim()),
        avatarInitials: text('.avatar'),
        avatarAria: sr.querySelector('.avatar')?.getAttribute('aria-label'),
        hasQuoteBlock: !!sr.querySelector('.persona-quote'),
        // Slotted light-DOM nodes are assigned to the named shadow slots
        nameAssigned: sr.querySelector('slot[name="name"]').assignedElements().length,
        goalsAssigned: sr.querySelector('slot[name="goals"]').assignedElements().length,
        // Data API getter mirrors the rendered state
        data: el.data,
        compact: el.compact,
      };
    });

    expect(state.ariaLabel).toBe('User persona: Sarah Chen');
    expect(state.role).toBe('Senior Product Manager');
    expect(state.meta).toEqual(['34 years old', 'San Francisco, CA']);
    // No avatar attribute → initials rendered from the name
    expect(state.avatarInitials).toBe('SC');
    expect(state.avatarAria).toBe('Avatar for Sarah Chen');
    expect(state.hasQuoteBlock).toBe(true);
    expect(state.nameAssigned).toBe(1);
    expect(state.goalsAssigned).toBe(1);
    expect(state.data.name).toBe('Sarah Chen');
    expect(state.data.jobTitle).toBe('Senior Product Manager');
    expect(state.data).not.toHaveProperty('role');
    expect(state.data.age).toBe('34');
    expect(state.data.location).toBe('San Francisco, CA');
    expect(state.compact).toBe(false);
  });

  test('observed attributes re-render (job-title, location, avatar)', async ({ page }) => {
    await page.goto(basicDemo);
    await page.waitForSelector('user-persona[data-upgraded]');

    const result = await page.evaluate(() => {
      const el = document.querySelector('user-persona');
      const sr = el.shadowRoot;

      el.setAttribute('job-title', 'Staff Engineer');
      el.setAttribute('location', 'Lisbon, PT');
      const afterAttrs = {
        role: sr.querySelector('.persona-role')?.textContent.trim(),
        meta: [...sr.querySelectorAll('.meta-item')].map(n => n.textContent.replace(/\s+/g, ' ').trim()),
      };

      // Removing job-title drops the <p class="persona-role"> entirely
      el.removeAttribute('job-title');
      const roleGone = !sr.querySelector('.persona-role');

      // Avatar URL swaps the initials for a background image
      el.setAttribute('avatar', 'https://example.test/a.png');
      const avatar = sr.querySelector('.avatar');
      const avatarState = {
        text: avatar.textContent.trim(),
        style: avatar.getAttribute('style'),
      };

      return { afterAttrs, roleGone, avatarState, jobTitle: el.jobTitle, personaRole: el.personaRole };
    });

    expect(result.afterAttrs.role).toBe('Staff Engineer');
    expect(result.afterAttrs.meta).toEqual(['34 years old', 'Lisbon, PT']);
    expect(result.roleGone).toBe(true);
    expect(result.jobTitle).toBe('');
    expect(result.personaRole).toBe('');
    expect(result.avatarState.text).toBe('');
    expect(result.avatarState.style).toContain('url("https://example.test/a.png")');
  });

  test('user-persona:ready fires on connect with { name, jobTitle, role }, then the persona-ready alias', async ({ page }) => {
    await page.goto(basicDemo);
    await page.waitForSelector('user-persona[data-upgraded]');

    const fired = await page.evaluate(() => new Promise(resolve => {
      const seen = [];
      for (const type of ['user-persona:ready', 'persona-ready']) {
        document.addEventListener(type, (e) => {
          if (e.target.id !== 'fresh-persona') return;
          seen.push({ type: e.type, detail: e.detail });
          if (seen.length === 2) resolve(seen);
        });
      }
      const el = document.createElement('user-persona');
      el.id = 'fresh-persona';
      el.setAttribute('job-title', 'QA Engineer');
      el.innerHTML = '<h2 slot="name">Pat Doe</h2>';
      document.body.appendChild(el);
    }));

    const detail = { name: 'Pat Doe', jobTitle: 'QA Engineer', role: 'QA Engineer' };
    expect(fired).toEqual([
      { type: 'user-persona:ready', detail },
      { type: 'persona-ready', detail },
    ]);
  });

  test('legacy role="<job title>" moves to job-title, role is removed, one warning per page', async ({ page }) => {
    const warnings = [];
    page.on('console', (msg) => {
      if (msg.type() === 'warning' && msg.text().includes('[user-persona]')) warnings.push(msg.text());
    });
    // 0.2.x markup, parsed before the bundle defines the element.
    await openUpgradePage(page, {
      events: ['user-persona:ready'],
      body: `<user-persona id="legacy" role="Content Strategist"><h2 slot="name">Pat</h2></user-persona>
             <user-persona id="both" role="Designer" job-title="Lead Designer"></user-persona>
             <user-persona id="aria" role="region" job-title="Analyst"></user-persona>
             <user-persona id="late"></user-persona>`,
    });
    await page.waitForSelector('#late[data-upgraded]');

    const result = await page.evaluate(() => {
      // A role set after upgrade is migrated too.
      document.getElementById('late').setAttribute('role', 'Data Scientist');
      const read = (id) => {
        const el = document.getElementById(id);
        return {
          role: el.getAttribute('role'),
          jobTitle: el.getAttribute('job-title'),
          rendered: el.shadowRoot.querySelector('.persona-role')?.textContent.trim(),
        };
      };
      return { legacy: read('legacy'), both: read('both'), aria: read('aria'), late: read('late') };
    });

    expect(result.legacy).toEqual({ role: null, jobTitle: 'Content Strategist', rendered: 'Content Strategist' });
    // An explicit job-title wins over the legacy role.
    expect(result.both).toEqual({ role: null, jobTitle: 'Lead Designer', rendered: 'Lead Designer' });
    // A real ARIA role is left alone.
    expect(result.aria).toEqual({ role: 'region', jobTitle: 'Analyst', rendered: 'Analyst' });
    expect(result.late).toEqual({ role: null, jobTitle: 'Data Scientist', rendered: 'Data Scientist' });
    // Three legacy values migrated, one warning.
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain('job-title');
  });

  test('.data setter applies attributes + slots (legacy role key → job-title) and emits user-persona:data-changed', async ({ page }) => {
    await page.goto(basicDemo);
    await page.waitForSelector('user-persona[data-upgraded]');

    const result = await page.evaluate(() => {
      const el = document.createElement('user-persona');
      document.body.appendChild(el);

      const fired = [];
      el.addEventListener('user-persona:data-changed', (e) => {
        fired.push({ source: e.detail.source, name: e.detail.data.name });
      });

      el.data = {
        name: 'Jordan Rivera',
        role: 'Designer',
        age: '29',
        location: 'Berlin, DE',
        quote: 'Make it obvious.',
        bio: 'Five years in product design.',
      };

      const sr = el.shadowRoot;
      return {
        fired,
        attrs: {
          jobTitle: el.getAttribute('job-title'),
          role: el.getAttribute('role'),
          age: el.getAttribute('age'),
          location: el.getAttribute('location'),
        },
        slottedName: el.querySelector('[slot="name"]')?.textContent,
        slottedQuote: el.querySelector('[slot="quote"]')?.textContent,
        ariaLabel: sr.querySelector('.persona-card')?.getAttribute('aria-label'),
        renderedRole: sr.querySelector('.persona-role')?.textContent.trim(),
        data: el.data,
      };
    });

    expect(result.fired).toEqual([{ source: 'property', name: 'Jordan Rivera' }]);
    expect(result.attrs).toEqual({ jobTitle: 'Designer', role: null, age: '29', location: 'Berlin, DE' });
    expect(result.slottedName).toBe('Jordan Rivera');
    expect(result.slottedQuote).toBe('Make it obvious.');
    expect(result.ariaLabel).toBe('User persona: Jordan Rivera');
    expect(result.renderedRole).toBe('Designer');
    expect(result.data.name).toBe('Jordan Rivera');
    expect(result.data.jobTitle).toBe('Designer');
    expect(result.data.quote).toBe('Make it obvious.');
    expect(result.data.bio).toBe('Five years in product design.');
  });

  test('data-list-stories renders linked <user-story> list and updates live', async ({ page }) => {
    await page.goto(storiesDemo);
    await page.waitForSelector('user-persona[data-upgraded]');
    await page.waitForSelector('user-story[data-upgraded]');

    const initial = await page.evaluate(() => {
      const el = document.getElementById('alex');
      const sr = el.shadowRoot;
      const section = sr.querySelector('[data-stories-section]');
      return {
        related: el.relatedStories().map(s => s.id),
        count: section?.querySelector('.section-count')?.textContent.trim(),
        items: [...section.querySelectorAll('.story-item')].map(li => ({
          href: li.querySelector('a')?.getAttribute('href'),
          text: li.querySelector('a')?.textContent.trim(),
          priority: li.getAttribute('data-priority'),
          status: li.getAttribute('data-status'),
        })),
      };
    });

    expect(initial.related).toEqual(['onboarding-1', 'onboarding-2', 'onboarding-3']);
    expect(initial.count).toBe('3');
    expect(initial.items[0]).toEqual({
      href: '#onboarding-1',
      text: 'a one-page onboarding flow that collects KYC up-front',
      priority: 'high',
      status: 'in-progress',
    });

    // The demo's "Add a story" button appends a <user-story persona-id="alex">;
    // the persona's MutationObserver re-renders just the Stories section.
    await page.click('#addBtn');
    await page.waitForFunction(() =>
      document.getElementById('alex').shadowRoot
        .querySelector('[data-stories-section] .section-count')?.textContent.trim() === '4'
    );

    await page.click('#removeBtn');
    await page.waitForFunction(() =>
      document.getElementById('alex').shadowRoot
        .querySelector('[data-stories-section] .section-count')?.textContent.trim() === '3'
    );

    // Relabeling persona-id also drops the story from the list
    await page.evaluate(() => {
      document.getElementById('onboarding-2').setAttribute('persona-id', 'someone-else');
    });
    await page.waitForFunction(() =>
      document.getElementById('alex').shadowRoot
        .querySelector('[data-stories-section] .section-count')?.textContent.trim() === '2'
    );

    const after = await page.evaluate(() =>
      document.getElementById('alex').relatedStories().map(s => s.id)
    );
    expect(after).toEqual(['onboarding-1', 'onboarding-3']);
  });

  test('empty Stories section renders the empty-state copy', async ({ page }) => {
    await page.goto(basicDemo);
    await page.waitForSelector('user-persona[data-upgraded]');

    const result = await page.evaluate(() => {
      const el = document.querySelector('user-persona');
      const sr = el.shadowRoot;
      const before = !!sr.querySelector('[data-stories-section]');
      // Section only renders when BOTH data-list-stories and an id are present
      el.setAttribute('data-list-stories', '');
      const withoutId = !!sr.querySelector('[data-stories-section]');
      el.id = 'sarah';
      const section = sr.querySelector('[data-stories-section]');
      return {
        before,
        withoutId,
        count: section?.querySelector('.section-count')?.textContent.trim(),
        empty: section?.querySelector('.empty-stories')?.textContent.trim(),
      };
    });

    expect(result.before).toBe(false);
    expect(result.withoutId).toBe(false);
    expect(result.count).toBe('0');
    expect(result.empty).toBe('No user stories reference this persona yet.');
  });
});

test.describe('user-persona — src, lifecycle and regressions', () => {
  const EVENTS = ['user-persona:ready', 'user-persona:upgraded'];
  const record = {
    name: 'Dana Field', jobTitle: 'Researcher', age: 41, location: 'Oslo, NO',
    quote: 'Show me the evidence.',
    bio: 'Runs the usability lab.',
    goals: ['Recruit faster', 'Share findings'],
    frustrations: ['Scattered notes'],
    behaviors: ['Tags every clip'],
  };

  test('src fetches exactly once and user-persona:ready fires once, after the data renders', async ({ page }) => {
    const { requests } = await openUpgradePage(page, {
      events: EVENTS,
      fixtures: { 'persona.json': record },
      body: '<user-persona id="p1" src="persona.json"></user-persona>',
    });
    await page.waitForFunction(() => window.__events.some(e => e.type === 'user-persona:ready'));
    await page.waitForTimeout(100);

    const state = await page.evaluate(() => {
      const el = document.getElementById('p1');
      const sr = el.shadowRoot;
      const assigned = (name) => sr.querySelector(`slot[name="${name}"]`)?.assignedElements()
        .map(n => n.textContent.replace(/\s+/g, ' ').trim());
      return {
        role: sr.querySelector('.persona-role')?.textContent.trim(),
        bio: assigned('bio'),
        goals: assigned('goals'),
        goalItems: [...el.querySelectorAll('[slot="goals"] li')].map(li => li.textContent),
        frustrations: assigned('frustrations'),
        behaviors: assigned('behaviors'),
        data: el.data,
      };
    });

    expect(requests['persona.json']).toBe(1);
    const ready = await recordedEvents(page, 'user-persona:ready');
    expect(ready).toEqual([{ type: 'user-persona:ready', id: 'p1', detail: { name: 'Dana Field', jobTitle: 'Researcher', role: 'Researcher' } }]);
    expect(await recordedEvents(page, 'user-persona:upgraded')).toHaveLength(1);
    // Every section from src is rendered, not just cached
    expect(state.role).toBe('Researcher');
    expect(state.bio).toEqual(['Runs the usability lab.']);
    expect(state.goalItems).toEqual(['Recruit faster', 'Share findings']);
    expect(state.frustrations).toEqual(['Scattered notes']);
    expect(state.behaviors).toEqual(['Tags every clip']);
    expect(state.data.goals).toEqual(['Recruit faster', 'Share findings']);
    expect(state.data.bio).toBe('Runs the usability lab.');
  });

  test('moving the element does not refetch, re-render, or re-fire user-persona:ready', async ({ page }) => {
    const { requests } = await openUpgradePage(page, {
      events: EVENTS,
      fixtures: { 'persona.json': record },
      body: '<user-persona id="p1" src="persona.json"></user-persona>',
    });
    await page.waitForFunction(() => window.__events.some(e => e.type === 'user-persona:ready'));

    const moved = await moveElement(page, '#p1');
    expect(moved).toEqual({ connected: true, sameNode: true, sameHtml: true, upgraded: true });
    expect(requests['persona.json']).toBe(1);
    expect(await recordedEvents(page, 'user-persona:ready')).toHaveLength(1);
    expect(await recordedEvents(page, 'user-persona:upgraded')).toHaveLength(1);
  });

  test('name and quote attributes render when there is no slot (README example)', async ({ page }) => {
    await openUpgradePage(page, {
      events: EVENTS,
      body: `<user-persona id="fred" name="Fred" job-title="Engineer" quote="Ship small."></user-persona>
             <user-persona id="both" name="Attr Name"><h2 slot="name">Slot Name</h2></user-persona>`,
    });
    await page.waitForSelector('#both[data-upgraded]');

    const state = await page.evaluate(() => {
      const sr = document.getElementById('fred').shadowRoot;
      return {
        label: sr.querySelector('.persona-card').getAttribute('aria-label'),
        fallbackName: sr.querySelector('.persona-name-fallback')?.textContent.trim(),
        quote: sr.querySelector('.quote-text')?.textContent.trim(),
        initials: sr.querySelector('.avatar').textContent.trim(),
        slotWins: document.getElementById('both').personaName,
      };
    });
    expect(state).toEqual({
      label: 'User persona: Fred',
      fallbackName: 'Fred',
      quote: 'Ship small.',
      initials: 'F',
      slotWins: 'Slot Name',
    });

    // The name attribute is observed
    const renamed = await page.evaluate(() => {
      const el = document.getElementById('fred');
      el.setAttribute('name', 'Frederica');
      return el.shadowRoot.querySelector('.persona-card').getAttribute('aria-label');
    });
    expect(renamed).toBe('User persona: Frederica');
  });

  test('a second .data assignment replaces name, quote and sections', async ({ page }) => {
    await openUpgradePage(page, { events: EVENTS, body: '<user-persona id="p"></user-persona>' });
    await page.waitForSelector('#p[data-upgraded]');

    const result = await page.evaluate(() => {
      const el = document.getElementById('p');
      el.data = { name: 'First', quote: 'One', goals: ['a'] };
      el.data = { name: 'Second', quote: 'Two', goals: ['b', 'c'], bio: 'Now with a bio.' };
      return {
        names: [...el.querySelectorAll('[slot="name"]')].map(n => n.textContent),
        quotes: [...el.querySelectorAll('[slot="quote"]')].map(n => n.textContent),
        goals: [...el.querySelectorAll('[slot="goals"] li')].map(n => n.textContent),
        label: el.shadowRoot.querySelector('.persona-card').getAttribute('aria-label'),
        bioAssigned: el.shadowRoot.querySelector('slot[name="bio"]').assignedElements()[0]?.textContent,
      };
    });
    expect(result).toEqual({
      names: ['Second'],
      quotes: ['Two'],
      goals: ['b', 'c'],
      label: 'User persona: Second',
      bioAssigned: 'Now with a bio.',
    });
  });

  test('avatar URL is a quoted CSS url() that cannot inject declarations', async ({ page }) => {
    await openUpgradePage(page, { events: EVENTS, body: '<user-persona id="p"></user-persona>' });
    await page.waitForSelector('#p[data-upgraded]');

    const style = await page.evaluate(() => {
      const el = document.getElementById('p');
      el.setAttribute('avatar', 'a.png) center/cover; color: red; x:(');
      const avatar = el.shadowRoot.querySelector('.avatar');
      return { color: avatar.style.color, bg: avatar.style.backgroundImage };
    });
    expect(style.color).toBe('');
    expect(style.bg).toContain('a.png');
  });

  test('each section has a real heading', async ({ page }) => {
    await page.goto(basicDemo);
    await page.waitForSelector('user-persona[data-upgraded]');
    const headings = await page.evaluate(() =>
      [...document.querySelector('user-persona').shadowRoot.querySelectorAll('.section-title')]
        .map(h => `${h.tagName}:${h.textContent.trim()}`)
    );
    expect(headings).toEqual(['H3:Background', 'H3:Goals', 'H3:Frustrations', 'H3:Behaviors']);
  });
});
