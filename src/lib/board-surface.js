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

/**
 * Track one in-flight fetch per component so a newer `src` wins: calling
 * `start()` aborts the previous request and returns a signal plus an
 * `isCurrent()` check for the response handler.
 */
export class SrcLoader {
  /** @type {AbortController | null} */
  #ctrl = null;
  /** @type {string | null} */
  url = null;

  /**
   * @param {string} url
   * @returns {{ signal: AbortSignal, isCurrent: () => boolean }}
   */
  start(url) {
    this.#ctrl?.abort();
    const ctrl = new AbortController();
    this.#ctrl = ctrl;
    this.url = url;
    return { signal: ctrl.signal, isCurrent: () => this.#ctrl === ctrl && !ctrl.signal.aborted };
  }

  /**
   * Fetch JSON for `url`, aborting any earlier request. Resolves to
   * `undefined` when superseded or aborted.
   * @param {string} url
   * @returns {Promise<{ data: any, isCurrent: () => boolean } | undefined>}
   */
  async fetchJson(url) {
    const { signal, isCurrent } = this.start(url);
    try {
      const res = await fetch(url, { signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return isCurrent() ? { data, isCurrent } : undefined;
    } catch (err) {
      if (/** @type {any} */ (err)?.name === 'AbortError' || !isCurrent()) return undefined;
      throw err;
    }
  }
}
