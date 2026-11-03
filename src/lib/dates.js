/**
 * Calendar-date helpers shared by the date-driven components
 * (gantt-chart, burndown-chart, product-roadmap, adr-wc).
 *
 * Planning dates are calendar days, not instants. Two rules keep them
 * stable in every time zone:
 *
 *  1. `YYYY-MM-DD` is parsed as LOCAL midnight. `new Date('2026-04-01')`
 *     is UTC midnight, which renders as March 31 anywhere west of UTC.
 *  2. Days are stepped with setDate(), never by adding 86 400 000 ms,
 *     which repeats or skips a day across a daylight-saving change.
 */

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})(?![\d:T])/;

/**
 * Parse a calendar date. `YYYY-MM-DD` becomes local midnight; Date objects
 * are copied and truncated to local midnight; full timestamps (with a time
 * part) and numbers are accepted and truncated too. Returns null for
 * anything unparseable.
 * @param {unknown} value
 * @returns {Date | null}
 */
export function parseISODate(value) {
  if (value == null || value === '') return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : startOfDay(value);
  }
  if (typeof value === 'number') {
    return Number.isFinite(value) ? startOfDay(new Date(value)) : null;
  }
  const s = String(value).trim();
  const m = s.match(ISO_DATE);
  if (m) {
    const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    // Reject roll-overs such as 2026-02-31.
    if (d.getMonth() !== Number(m[2]) - 1 || d.getDate() !== Number(m[3])) return null;
    return d;
  }
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : startOfDay(d);
}

/** @param {Date} d @returns {Date} local midnight of the same calendar day */
export function startOfDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** @param {Date} d @returns {string} `YYYY-MM-DD` in local time */
export function toISODate(d) {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

/** Calendar-day addition (DST-safe). @param {Date} d @param {number} n @returns {Date} */
export function addDays(d, n) {
  const out = startOfDay(d);
  out.setDate(out.getDate() + n);
  return out;
}

/**
 * Whole calendar days from `a` to `b` (b − a), ignoring DST hour shifts.
 * @param {Date} a @param {Date} b @returns {number}
 */
export function daysBetween(a, b) {
  const ua = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const ub = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((ub - ua) / 86_400_000);
}

/**
 * Every calendar day from `start` to `end` inclusive, as `YYYY-MM-DD`.
 * @param {Date} start @param {Date} end @returns {string[]}
 */
export function enumerateDays(start, end) {
  const out = [];
  for (let d = startOfDay(start); d <= end; d = addDays(d, 1)) out.push(toISODate(d));
  return out;
}

/** @param {Date} d @returns {Date} first day of the month */
export function startOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

/** @param {Date} d @returns {Date} last day of the month */
export function endOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

/** @param {Date} d @returns {Date} first day of the calendar quarter */
export function startOfQuarter(d) {
  return new Date(d.getFullYear(), Math.floor(d.getMonth() / 3) * 3, 1);
}

/** @param {Date} d @returns {Date} last day of the calendar quarter */
export function endOfQuarter(d) {
  return new Date(d.getFullYear(), Math.floor(d.getMonth() / 3) * 3 + 3, 0);
}

/**
 * Add whole months, clamping the day so Jan 31 + 1 month is Feb 28/29,
 * not March 3.
 * @param {Date} d @param {number} n @returns {Date}
 */
export function addMonths(d, n) {
  const first = new Date(d.getFullYear(), d.getMonth() + n, 1);
  const last = endOfMonth(first).getDate();
  return new Date(first.getFullYear(), first.getMonth(), Math.min(d.getDate(), last));
}

/**
 * Locale display of a calendar date. Defaults to e.g. "April 1, 2026".
 * @param {Date} d
 * @param {Intl.DateTimeFormatOptions} [opts]
 * @param {string | string[]} [locale]
 */
export function formatDate(d, opts = { year: 'numeric', month: 'long', day: 'numeric' }, locale = undefined) {
  return d.toLocaleDateString(locale, opts);
}
