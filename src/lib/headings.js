/**
 * Heading-level helpers. Components that render their own headings use
 * these so the page outline never skips a level (axe heading-order): by
 * default a component's top heading is one below the nearest heading before
 * it, and a `heading-level` attribute (1–6) overrides that.
 */

/**
 * Heading levels for a board's optional title and its column headings.
 * `heading-level` (1–6) on the host sets the top level; otherwise it is one
 * below the nearest heading that precedes the host in document order
 * (ignoring headings inside other `hostTag` elements), so the board never
 * skips a level in the page outline (axe heading-order).
 * @param {HTMLElement} host
 * @param {string} hostTag - e.g. 'kanban-board'; headings inside any element of this tag are ignored
 * @returns {{ title: number, column: number }}
 */
export function boardHeadingLevels(host, hostTag) {
  const attr = parseInt(host.getAttribute('heading-level') ?? '', 10);
  const top = attr >= 1 && attr <= 6 ? attr : contextHeadingLevel(host, hostTag);
  return { title: top, column: Math.min(6, host.getAttribute('title') ? top + 1 : top) };
}

/**
 * One below the nearest heading that precedes `host` in document order
 * (2 if there is none), ignoring headings inside any `hostTag` element so a
 * component's own headings don't count. Shadow-DOM components pass their own
 * tag so sibling instances don't nest under each other.
 * @param {Element} host
 * @param {string} [hostTag]
 * @returns {number}
 */
export function contextHeadingLevel(host, hostTag = '') {
  if (!host.isConnected) return 2;
  let level = 1;
  for (const h of document.querySelectorAll('h1, h2, h3, h4, h5, h6, [role="heading"][aria-level]')) {
    if (hostTag && h.closest(hostTag)) continue;
    if (!(h.compareDocumentPosition(host) & Node.DOCUMENT_POSITION_FOLLOWING)) break;
    level = Number(h.getAttribute('aria-level')) || Number(h.localName.slice(1)) || level;
  }
  return Math.min(6, level + 1);
}

/**
 * Swap a heading element for one of another level, keeping its children
 * and attributes. Returns the element now in the DOM.
 * @param {Element} el
 * @param {number} level
 * @returns {HTMLElement}
 */
export function retagHeading(el, level) {
  if (el.localName === `h${level}`) return /** @type {HTMLElement} */ (el);
  const next = document.createElement(`h${level}`);
  for (const { name, value } of [...el.attributes]) next.setAttribute(name, value);
  next.append(...el.childNodes);
  el.replaceWith(next);
  return next;
}

/**
 * A component's top heading level: its `heading-level` attribute (1–6) if
 * set, else one below the nearest preceding heading on the page.
 * @param {Element} host
 * @param {string} [hostTag] - ignore headings inside elements of this tag
 * @returns {number}
 */
export function headingLevelFor(host, hostTag) {
  const attr = parseInt(host.getAttribute('heading-level') ?? '', 10);
  return attr >= 1 && attr <= 6 ? attr : contextHeadingLevel(host, hostTag);
}
