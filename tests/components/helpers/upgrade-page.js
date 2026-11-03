/**
 * Test helper: serve a throwaway page whose markup is parsed BEFORE the pack
 * bundle defines the elements, so the elements take the real upgrade path
 * (attributeChangedCallback runs while already connected, then
 * connectedCallback). That is the path that used to fetch `src` twice.
 *
 * Every event named in `events` is recorded into `window.__events` from
 * before the bundle runs, so nothing fired during upgrade is missed.
 *
 * JSON fixtures are fulfilled with page.route() and every request is
 * counted, so specs can assert "exactly one fetch".
 */

const PAGE = '__fixture__/page.html';

/**
 * @param {import('@playwright/test').Page} page
 * @param {object} opts
 * @param {string} opts.body - markup placed in <body> before the bundle
 * @param {string[]} opts.events - event types to record
 * @param {Record<string, unknown | { json: unknown, delay?: number }>} [opts.fixtures]
 *   map of fixture file name (served at `__fixture__/<name>`) to its JSON
 *   (or `{ json, delay }` to hold the response for `delay` ms)
 * @returns {Promise<{ requests: Record<string, number> }>}
 */
export async function openUpgradePage(page, { body, events, fixtures = {} }) {
  /** @type {Record<string, number>} */
  const requests = {};
  for (const [name, spec] of Object.entries(fixtures)) {
    requests[name] = 0;
    await page.route(`**/__fixture__/${name}`, async (route) => {
      requests[name] += 1;
      const isWrapped = spec && typeof spec === 'object' && 'json' in spec;
      const json = isWrapped ? /** @type {any} */ (spec).json : spec;
      const delay = isWrapped ? /** @type {any} */ (spec).delay || 0 : 0;
      if (delay) await new Promise(r => setTimeout(r, delay));
      await route.fulfill({ json }).catch(() => { /* request was aborted */ });
    });
  }
  await page.route(`**/${PAGE}`, (route) => route.fulfill({
    contentType: 'text/html; charset=utf-8',
    body: `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>fixture</title>
  <link rel="stylesheet" href="/vb-project-planning/assets/pack/vb-project-planning.css">
</head>
<body>
  <script>
    window.__events = [];
    for (const type of ${JSON.stringify(events)}) {
      document.addEventListener(type, (e) => {
        window.__events.push({ type, id: e.target.id || '', detail: e.detail ?? null });
      });
    }
  </script>
  ${body}
  <div id="elsewhere"></div>
  <script type="module" src="/vb-project-planning/assets/pack/vb-project-planning.js"></script>
</body>
</html>`,
  }));
  await page.goto(PAGE);
  return { requests };
}

/**
 * Events recorded so far, optionally filtered by type.
 * @param {import('@playwright/test').Page} page
 * @param {string} [type]
 */
export function recordedEvents(page, type) {
  return page.evaluate((t) => window.__events.filter(e => !t || e.type === t), type);
}

/**
 * Move an element into #elsewhere (disconnect + connect, like a kanban
 * drag) and report whether its shadow tree survived untouched.
 * @param {import('@playwright/test').Page} page
 * @param {string} selector
 */
export function moveElement(page, selector) {
  return page.evaluate(async (sel) => {
    const el = document.querySelector(sel);
    const before = el.shadowRoot.firstElementChild?.nextElementSibling ?? el.shadowRoot.lastElementChild;
    const html = el.shadowRoot.innerHTML;
    document.getElementById('elsewhere').append(el);
    await new Promise(r => setTimeout(r, 50));
    const after = el.shadowRoot.firstElementChild?.nextElementSibling ?? el.shadowRoot.lastElementChild;
    return {
      connected: el.isConnected,
      sameNode: before === after,
      sameHtml: html === el.shadowRoot.innerHTML,
      upgraded: el.hasAttribute('data-upgraded'),
    };
  }, selector);
}
