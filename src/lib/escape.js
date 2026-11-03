/**
 * The pack's one HTML escaper. Use it for every author- or data-supplied
 * string interpolated into an innerHTML template, in both text and
 * attribute positions (single- or double-quoted).
 *
 * Do NOT use it for values passed to setAttribute() or textContent: those
 * are already literal, and escaping them shows "&amp;" to users and screen
 * readers.
 *
 * @param {unknown} value
 * @returns {string}
 */
export function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ESCAPES[c]);
}

/** @type {Record<string, string>} */
const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/**
 * Escape a URL for use inside a CSS `url("…")` token in an inline style.
 * Returns the full `url("…")` so callers can't forget the quotes. Only
 * http(s), protocol-relative, relative, and data:image URLs are allowed;
 * anything else yields `none`.
 * @param {unknown} value
 * @returns {string}
 */
export function cssUrl(value) {
  const s = String(value ?? '').trim();
  if (!s) return 'none';
  if (/^[a-z][a-z0-9+.-]*:/i.test(s) && !/^(https?:|data:image\/)/i.test(s)) return 'none';
  const escaped = s.replace(/["\\\n\r\f]/g, (c) => `\\${c.charCodeAt(0).toString(16)} `);
  return esc(`url("${escaped}")`);
}
