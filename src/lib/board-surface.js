/**
 * Shared helpers for the drag-surface "board" components
 * (kanban-board, story-map, impact-effort, quadrant-grid).
 *
 * Small, DOM-only utilities: live-region announcements, human labels for
 * cards, empty-column placeholders, and building a <user-story> card from a
 * JSON record using the slots user-story actually reads.
 */

/**
 * Convert a hyphenated or lowercase id to Title Case.
 * @param {string} str
 * @returns {string}
 */
export function titleCase(str) {
  return String(str ?? '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Create a polite, atomic status region for move announcements.
 * @param {string} className
 * @returns {HTMLDivElement}
 */
export function createLiveRegion(className) {
  const region = document.createElement('div');
  region.className = className;
  region.setAttribute('role', 'status');
  region.setAttribute('aria-live', 'polite');
  region.setAttribute('aria-atomic', 'true');
  return region;
}

/**
 * Announce a message: clear, then set on the next frame so repeated
 * identical messages are re-read.
 * @param {HTMLElement | null} region
 * @param {string} msg
 */
export function announce(region, msg) {
  if (!region) return;
  region.textContent = '';
  requestAnimationFrame(() => { region.textContent = msg; });
}

/**
 * A human-readable label for a card: its title slot, its action slot, an
 * aria-label, or its visible text. Generated ids are only a last resort.
 * @param {Element | null | undefined} item
 * @returns {string}
 */
export function itemLabel(item) {
  if (!item) return 'item';
  const clean = (/** @type {string | null | undefined} */ s) => (s || '').replace(/\s+/g, ' ').trim();
  const slotted = clean(item.querySelector(':scope > [slot="title"]')?.textContent)
    || clean(item.querySelector(':scope > [slot="action"]')?.textContent);
  if (slotted) return truncate(slotted);
  const aria = clean(item.getAttribute('aria-label'));
  if (aria) return truncate(aria);
  const text = clean(item.textContent);
  if (text) return truncate(text);
  return item.getAttribute('story-id') || item.getAttribute('data-id') || 'item';
}

/** @param {string} s */
function truncate(s) {
  return s.length > 60 ? `${s.slice(0, 59).trimEnd()}…` : s;
}

/**
 * Add or remove the "empty" placeholder so it shows only when the surface
 * holds no draggable cards.
 * @param {Element} surface
 * @param {string} className
 * @param {string} text
 */
export function syncPlaceholder(surface, className, text) {
  const hasCards = !!surface.querySelector(':scope > [draggable="true"]');
  const placeholder = surface.querySelector(`:scope > .${className}`);
  if (!hasCards && !placeholder) {
    const p = document.createElement('p');
    p.className = className;
    p.textContent = text;
    surface.appendChild(p);
  } else if (hasCards && placeholder) {
    placeholder.remove();
  }
}

/* ── drag-surface list semantics ─────────────────────────────────────
 *
 * VB's <drag-surface> (vendored, read-only) sets role="list" on itself,
 * gives each draggable child role="listitem" (only when it has no role, and
 * only once, in setup()), and prepends its own role="status" live region as
 * a child. That breaks two ARIA rules:
 *   - aria-required-children: a list may only own listitems, not a status.
 *   - aria-allowed-role: listitem is not an allowed role on <article> (or
 *     section, aside, nav, …), the natural element for an authored card.
 * It also leaves cards added after setup (data API, src) without a role or
 * a tabindex. syncSurfaceSemantics() repairs a surface in place:
 *   1. The status region is moved out to be the surface's next sibling. VB
 *      keeps a reference to it, so its announcements still land there, and
 *      its teardown still removes it.
 *   2. If every card may carry role="listitem", the surface stays a list
 *      and cards missing it get role="listitem" and tabindex="0".
 *   3. Otherwise (or when it holds no cards) the surface becomes a
 *      labelled role="group" and no card carries role="listitem" (a
 *      listitem outside a list is invalid too).
 */

/** Cards whose element does not allow role="listitem" (ARIA in HTML). */
const NO_LISTITEM = 'article, aside, nav, section, main, header, footer, form, fieldset, details, '
  + 'dialog, figure, table, ul, ol, dl, h1, h2, h3, h4, h5, h6, a[href], button, input, select, textarea';

/**
 * @param {Element} surface a <drag-surface>
 */
export function syncSurfaceSemantics(surface) {
  // VB's live region is an unclassed role=status child; ours never live inside.
  const status = surface.querySelector(':scope > [role="status"]');
  if (status && surface.parentNode) surface.after(status);

  const cards = /** @type {HTMLElement[]} */ ([...surface.querySelectorAll(':scope > [draggable="true"]')]);
  // An empty surface (perhaps holding a "No items" note) is not a list either.
  const asList = cards.length > 0 && cards.every((el) => {
    const role = el.getAttribute('role');
    return (!role || role === 'listitem') && !el.matches(NO_LISTITEM);
  });
  const surfaceRole = asList ? 'list' : 'group';
  if (surface.getAttribute('role') !== surfaceRole) surface.setAttribute('role', surfaceRole);
  for (const el of cards) {
    if (asList && !el.hasAttribute('role')) el.setAttribute('role', 'listitem');
    if (!asList && el.getAttribute('role') === 'listitem') el.removeAttribute('role');
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
  }
}

/**
 * Keep every <drag-surface> inside `host` valid as cards are added, moved
 * between surfaces, and as VB re-runs its setup on reconnect. Returns a stop
 * function (call it from teardown).
 * @param {Element} host
 * @returns {() => void}
 */
export function watchSurfaceSemantics(host) {
  const syncAll = () => {
    for (const s of host.querySelectorAll('drag-surface')) syncSurfaceSemantics(s);
  };
  syncAll();
  if (typeof MutationObserver === 'undefined') return () => {};
  const observer = new MutationObserver((records) => {
    if (records.some((r) => r.target instanceof Element
      && (r.target.localName === 'drag-surface' || r.target.querySelector('drag-surface')))) {
      syncAll();
    }
  });
  observer.observe(host, { childList: true, subtree: true });
  return () => observer.disconnect();
}

/**
 * Does this JSON record describe a user story (rather than a plain card)?
 * @param {Record<string, any>} record
 */
export function isStoryRecord(record) {
  return !!(record && (record.persona || record.action || record.benefit || record.storyId));
}

/**
 * Build a `<user-story>` from a JSON record. State goes on the attributes
 * user-story observes; text content goes into the slots it reads
 * (persona, action, benefit, title, acceptance-criteria, tasks, notes).
 * Works whether or not user-story has been defined yet.
 *
 * @param {Record<string, any>} record
 * @param {string} [defaultDetail] - detail level when the record has none
 * @returns {HTMLElement}
 */
export function createStoryCard(record, defaultDetail) {
  const el = document.createElement('user-story');
  /** @type {Array<[string, string]>} */
  const attrs = [
    ['storyId', 'story-id'], ['personaId', 'persona-id'], ['priority', 'priority'],
    ['status', 'status'], ['points', 'points'], ['epic', 'epic'],
  ];
  for (const [key, attr] of attrs) {
    if (record[key] != null && record[key] !== '') el.setAttribute(attr, String(record[key]));
  }
  const detail = record.detail || defaultDetail;
  if (detail) el.setAttribute('detail', String(detail));

  for (const slot of ['persona', 'action', 'benefit']) {
    if (record[slot]) el.appendChild(slotted('span', slot, record[slot]));
  }
  if (record.title) el.appendChild(slotted('h3', 'title', record.title));
  for (const [key, slot] of [['acceptanceCriteria', 'acceptance-criteria'], ['tasks', 'tasks'], ['notes', 'notes']]) {
    const value = record[key];
    if (!value) continue;
    if (Array.isArray(value)) {
      const ul = document.createElement('ul');
      ul.slot = slot;
      for (const entry of value) {
        const li = document.createElement('li');
        li.textContent = String(entry);
        ul.appendChild(li);
      }
      el.appendChild(ul);
    } else {
      el.appendChild(slotted('p', slot, value));
    }
  }
  return el;
}

/**
 * @param {string} tag
 * @param {string} slot
 * @param {unknown} text
 */
function slotted(tag, slot, text) {
  const el = document.createElement(tag);
  el.slot = slot;
  el.textContent = String(text);
  return el;
}

// SrcLoader lives in its own module; re-exported here for existing imports.
export { SrcLoader } from './src-loader.js';

export { boardHeadingLevels, retagHeading, contextHeadingLevel } from './headings.js';
