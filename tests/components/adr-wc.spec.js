/**
 * adr-wc — HTML-first upgrade, attribute reactivity, events, .data API
 *
 * Verifies the MADR card contract: slotted content + status/supersedes
 * attributes render into the shadow root, `status` / `detail` changes
 * re-render, `adr-wc:ready` carries { adrId, title, status }, and the
 * `.data` setter applies attributes + slotted children and emits
 * `adr-wc:data-changed`.
 *
 * The live, HTML-first `<adr-wc>` elements upgrade on this pack's demo
 * page (three chained ADRs), so the spec navigates there.
 */

import { test, expect } from '@playwright/test';
import { openUpgradePage, recordedEvents, moveElement } from './helpers/upgrade-page.js';

const demoPage = 'demos/adr-wc-basic/';

test.describe('adr-wc', () => {

  test('HTML-first upgrade renders id, status badge, slots and supersedes links', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector('adr-wc[data-upgraded]');

    const state = await page.evaluate(() => {
      const els = [...document.querySelectorAll('adr-wc')];
      const read = (el) => {
        const root = el.shadowRoot;
        return {
          hostId: el.id,
          upgraded: el.hasAttribute('data-upgraded'),
          adrId: root.querySelector('.adr-id')?.textContent.trim(),
          status: root.querySelector('.adr-status')?.textContent.trim(),
          level: [...root.querySelector('.adr-card').classList].find(c => c.startsWith('adr-card--')),
          ariaLabel: root.querySelector('article').getAttribute('aria-label'),
          links: [...root.querySelectorAll('.adr-link')].map(a => a.getAttribute('href')),
          linkLabels: [...root.querySelectorAll('.adr-links-label')].map(s => s.textContent.trim()),
          // Slotted content is projected, not copied: the light-DOM
          // title should be assigned to the shadow <slot name="title">.
          titleAssigned: root.querySelector('slot[name="title"]').assignedElements()[0]?.textContent.trim(),
          consequencesCount: root.querySelector('slot[name="consequences"]').assignedElements()[0]?.children.length,
          hasDate: !!root.querySelector('.adr-date-wrap'),
        };
      };
      return els.map(read);
    });

    expect(state).toHaveLength(3);

    // ADR-001: superseded, points forward to ADR-002
    expect(state[0].hostId).toBe('ADR-001');
    expect(state[0].upgraded).toBe(true);
    expect(state[0].adrId).toBe('ADR-001');
    expect(state[0].status).toBe('Superseded');
    expect(state[0].level).toBe('adr-card--full');
    expect(state[0].ariaLabel).toBe('ADR: ADR-001');
    expect(state[0].linkLabels).toEqual(['Superseded by']);
    expect(state[0].links).toEqual(['#ADR-002']);
    expect(state[0].titleAssigned).toBe('Use PostgreSQL for persistence');
    expect(state[0].consequencesCount).toBe(4);
    expect(state[0].hasDate).toBe(true);

    // ADR-002: accepted, points back to ADR-001
    expect(state[1].status).toBe('Accepted');
    expect(state[1].linkLabels).toEqual(['Supersedes']);
    expect(state[1].links).toEqual(['#ADR-001']);

    // ADR-003: proposed, no chain links
    expect(state[2].status).toBe('Proposed');
    expect(state[2].links).toEqual([]);
  });

  test('changing status / detail attributes re-renders without re-firing adr-wc:ready', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector('adr-wc[data-upgraded]');

    const result = await page.evaluate(() => {
      const el = document.querySelector('adr-wc[adr-id="ADR-003"]');
      const ready = [];
      el.addEventListener('adr-wc:ready', (e) => ready.push({ ...e.detail }));

      el.setAttribute('status', 'accepted');
      const afterStatus = el.shadowRoot.querySelector('.adr-status').textContent.trim();

      el.setAttribute('detail', 'minimal');
      const minimalCard = el.shadowRoot.querySelector('.adr-card--minimal');
      const minimalHasSections = !!el.shadowRoot.querySelector('.adr-sections');

      // Unknown status falls back to "Proposed" rather than throwing.
      el.setAttribute('status', 'bogus');
      const fallbackStatus = el.shadowRoot.querySelector('.adr-status').textContent.trim();

      // Dropping detail returns to the full card (and its sections).
      el.removeAttribute('detail');
      const backToFull = !!el.shadowRoot.querySelector('.adr-card--full')
        && !!el.shadowRoot.querySelector('.adr-sections');

      return {
        ready,
        afterStatus,
        minimalRendered: !!minimalCard,
        minimalTabbable: minimalCard?.getAttribute('tabindex'),
        minimalFocusable: minimalCard?.matches(':is(a, button, [tabindex])'),
        minimalHasSections,
        fallbackStatus,
        backToFull,
        statusProp: el.status,
      };
    });

    expect(result.afterStatus).toBe('Accepted');
    expect(result.minimalRendered).toBe(true);
    // The minimal card has no action, so it is not a tab stop.
    expect(result.minimalTabbable).toBeNull();
    expect(result.minimalFocusable).toBe(false);
    expect(result.minimalHasSections).toBe(false);
    expect(result.fallbackStatus).toBe('Proposed');
    expect(result.backToFull).toBe(true);
    expect(result.statusProp).toBe('bogus');

    // adr-wc:ready fires once per element, after its first render;
    // attribute changes re-render but never re-fire it.
    expect(result.ready).toEqual([]);
  });

  test('compact detail marks empty slot sections with data-empty', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector('adr-wc[data-upgraded]');

    const result = await page.evaluate(() => {
      const el = document.createElement('adr-wc');
      el.setAttribute('adr-id', 'ADR-900');
      el.setAttribute('status', 'proposed');
      el.setAttribute('compact', '');
      const h = document.createElement('h3');
      h.slot = 'title';
      h.textContent = 'Compact card';
      el.appendChild(h);
      const p = document.createElement('p');
      p.slot = 'decision';
      p.textContent = 'Only a decision, no context or consequences.';
      el.appendChild(p);
      document.body.appendChild(el);

      const sections = [...el.shadowRoot.querySelectorAll('.adr-section')];
      return {
        upgraded: el.hasAttribute('data-upgraded'),
        level: [...el.shadowRoot.querySelector('.adr-card').classList].find(c => c.startsWith('adr-card--')),
        empties: sections.map(s => [
          s.querySelector('.adr-section-title').textContent.trim(),
          s.hasAttribute('data-empty'),
        ]),
        hasDate: !!el.shadowRoot.querySelector('.adr-date-wrap'),
      };
    });

    expect(result.upgraded).toBe(true);
    expect(result.level).toBe('adr-card--compact');
    expect(result.empties).toEqual([
      ['Context', true],
      ['Decision', false],
      ['Consequences', true],
    ]);
    expect(result.hasDate).toBe(false);
  });

  test('.data setter applies attributes + slotted content and emits adr-wc:data-changed', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector('adr-wc[data-upgraded]');

    const result = await page.evaluate(() => {
      const el = document.createElement('adr-wc');
      document.body.appendChild(el);
      const fired = [];
      el.addEventListener('adr-wc:data-changed', (e) => fired.push(e.detail));

      el.data = {
        adrId: 'ADR-100',
        status: 'deprecated',
        supersedes: ['ADR-001', 'ADR-002'],
        title: 'Retire the legacy queue',
        date: '2026-05-01',
        context: 'Queue is unmaintained.',
        decision: 'Move to the managed broker.',
        consequences: ['Good: less ops', 'Bad: migration cost'],
      };

      const root = el.shadowRoot;
      return {
        fired: fired.map(d => ({ source: d.source, adrId: d.data.adrId, status: d.data.status, supersedes: d.data.supersedes, title: d.data.title, date: d.data.date })),
        attrs: {
          adrId: el.getAttribute('adr-id'),
          status: el.getAttribute('status'),
          supersedes: el.getAttribute('supersedes'),
        },
        slots: {
          title: el.querySelector('[slot="title"]')?.textContent,
          date: el.querySelector('[slot="date"]')?.getAttribute('datetime'),
          context: el.querySelector('[slot="context"]')?.textContent,
          decision: el.querySelector('[slot="decision"]')?.textContent,
          consequences: [...(el.querySelector('[slot="consequences"]')?.children ?? [])].map(li => li.textContent),
        },
        rendered: {
          status: root.querySelector('.adr-status').textContent.trim(),
          links: [...root.querySelectorAll('.adr-link')].map(a => a.getAttribute('href')),
          hasDate: !!root.querySelector('.adr-date-wrap'),
        },
        getter: el.data,
      };
    });

    expect(result.fired).toEqual([{
      source: 'property',
      adrId: 'ADR-100',
      status: 'deprecated',
      supersedes: ['ADR-001', 'ADR-002'],
      title: 'Retire the legacy queue',
      date: '2026-05-01',
    }]);
    expect(result.attrs).toEqual({ adrId: 'ADR-100', status: 'deprecated', supersedes: 'ADR-001,ADR-002' });
    expect(result.slots).toEqual({
      title: 'Retire the legacy queue',
      date: '2026-05-01',
      context: 'Queue is unmaintained.',
      decision: 'Move to the managed broker.',
      consequences: ['Good: less ops', 'Bad: migration cost'],
    });
    expect(result.rendered).toEqual({
      status: 'Deprecated',
      links: ['#ADR-001', '#ADR-002'],
      hasDate: true,
    });
    expect(result.getter.supersededBy).toBeUndefined();
    expect(result.getter.supersedes).toEqual(['ADR-001', 'ADR-002']);
  });
});

test.describe('adr-wc — src, lifecycle and regressions', () => {
  // West of UTC, new Date('2026-04-01') is March 31 local time.
  test.use({ timezoneId: 'America/Los_Angeles', locale: 'en-US' });

  const EVENTS = ['adr-wc:ready', 'adr-wc:upgraded'];
  const record = {
    adrId: 'ADR-042', status: 'accepted', title: 'Adopt calendar dates', date: '2026-04-01',
    context: 'Dates drifted.', decision: 'Parse as local midnight.', consequences: ['Stable dates'],
  };

  test('src fetches exactly once, fires ready once, and shows the date as April 1', async ({ page }) => {
    const { requests } = await openUpgradePage(page, {
      events: EVENTS,
      fixtures: { 'adr.json': record },
      body: '<adr-wc id="a1" src="adr.json"></adr-wc>',
    });
    await page.waitForFunction(() => window.__events.some(e => e.type === 'adr-wc:ready'));
    await page.waitForTimeout(100);

    expect(requests['adr.json']).toBe(1);
    expect(await recordedEvents(page, 'adr-wc:ready')).toEqual([{
      type: 'adr-wc:ready', id: 'a1',
      detail: { adrId: 'ADR-042', title: 'Adopt calendar dates', status: 'accepted' },
    }]);
    const time = await page.evaluate(() => {
      const t = document.getElementById('a1').querySelector('time[slot="date"]');
      return { text: t.textContent, datetime: t.getAttribute('datetime') };
    });
    expect(time).toEqual({ text: 'April 1, 2026', datetime: '2026-04-01' });
  });

  test('moving the element does not refetch, re-render, or re-fire ready', async ({ page }) => {
    const { requests } = await openUpgradePage(page, {
      events: EVENTS,
      fixtures: { 'adr.json': record },
      body: '<adr-wc id="a1" src="adr.json"></adr-wc>',
    });
    await page.waitForFunction(() => window.__events.some(e => e.type === 'adr-wc:ready'));

    const moved = await moveElement(page, '#a1');
    expect(moved).toEqual({ connected: true, sameNode: true, sameHtml: true, upgraded: true });
    expect(requests['adr.json']).toBe(1);
    expect(await recordedEvents(page, 'adr-wc:ready')).toHaveLength(1);
  });

  test('.data date is a calendar day in every time zone', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector('adr-wc[data-upgraded]');
    const text = await page.evaluate(() => {
      const el = document.createElement('adr-wc');
      document.body.appendChild(el);
      el.data = { adrId: 'ADR-043', date: '2026-01-01' };
      return el.querySelector('time[slot="date"]').textContent;
    });
    expect(text).toBe('January 1, 2026');
  });
});
