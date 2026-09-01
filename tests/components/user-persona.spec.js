/**
 * user-persona — HTML-first upgrade, attribute reactivity, events, .data
 *
 * Covers the contract documented in src/web-components/user-persona/api.json:
 * attribute-driven header (role / age / location), slot-driven name + quote,
 * the `persona-ready` event, the `.data` getter/setter (+ its
 * `user-persona:data-changed` event), and the `data-list-stories`
 * traceability section that auto-lists linked <user-story> elements.
 *
 * The live, HTML-first `<user-persona>` upgrades on this pack's demo pages,
 * so each test navigates there and pokes the element via page.evaluate.
 */

import { test, expect } from '@playwright/test';

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
    expect(state.data.role).toBe('Senior Product Manager');
    expect(state.data.age).toBe('34');
    expect(state.data.location).toBe('San Francisco, CA');
    expect(state.compact).toBe(false);
  });

  test('observed attributes re-render (role, location, avatar)', async ({ page }) => {
    await page.goto(basicDemo);
    await page.waitForSelector('user-persona[data-upgraded]');

    const result = await page.evaluate(() => {
      const el = document.querySelector('user-persona');
      const sr = el.shadowRoot;

      el.setAttribute('role', 'Staff Engineer');
      el.setAttribute('location', 'Lisbon, PT');
      const afterAttrs = {
        role: sr.querySelector('.persona-role')?.textContent.trim(),
        meta: [...sr.querySelectorAll('.meta-item')].map(n => n.textContent.replace(/\s+/g, ' ').trim()),
      };

      // Removing role drops the <p class="persona-role"> entirely
      el.removeAttribute('role');
      const roleGone = !sr.querySelector('.persona-role');

      // Avatar URL swaps the initials for a background image
      el.setAttribute('avatar', 'https://example.test/a.png');
      const avatar = sr.querySelector('.avatar');
      const avatarState = {
        text: avatar.textContent.trim(),
        style: avatar.getAttribute('style'),
      };

      return { afterAttrs, roleGone, avatarState, personaRole: el.personaRole };
    });

    expect(result.afterAttrs.role).toBe('Staff Engineer');
    expect(result.afterAttrs.meta).toEqual(['34 years old', 'Lisbon, PT']);
    expect(result.roleGone).toBe(true);
    expect(result.personaRole).toBe('');
    expect(result.avatarState.text).toBe('');
    expect(result.avatarState.style).toContain('url(https://example.test/a.png)');
  });

  test('persona-ready fires on connect with { name, role }', async ({ page }) => {
    await page.goto(basicDemo);
    await page.waitForSelector('user-persona[data-upgraded]');

    const detail = await page.evaluate(() => new Promise(resolve => {
      document.addEventListener('persona-ready', (e) => {
        if (e.target.id === 'fresh-persona') resolve(e.detail);
      });
      const el = document.createElement('user-persona');
      el.id = 'fresh-persona';
      el.setAttribute('role', 'QA Engineer');
      el.innerHTML = '<h2 slot="name">Pat Doe</h2>';
      document.body.appendChild(el);
    }));

    expect(detail).toEqual({ name: 'Pat Doe', role: 'QA Engineer' });
  });

  test('.data setter applies attributes + slots and emits user-persona:data-changed', async ({ page }) => {
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
    expect(result.attrs).toEqual({ role: 'Designer', age: '29', location: 'Berlin, DE' });
    expect(result.slottedName).toBe('Jordan Rivera');
    expect(result.slottedQuote).toBe('Make it obvious.');
    expect(result.ariaLabel).toBe('User persona: Jordan Rivera');
    expect(result.renderedRole).toBe('Designer');
    expect(result.data.name).toBe('Jordan Rivera');
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
