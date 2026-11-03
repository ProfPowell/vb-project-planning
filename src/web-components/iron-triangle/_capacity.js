/**
 * Pure capacity-calculation helpers for <iron-triangle>.
 *
 * Kept separate from the component so the component stays slim and so
 * the math is unit-testable without DOM stubs.
 */

/**
 * Default capacity formula: sprintWeeks × teamFTE × focusFactor, ceilinged.
 * Returns 0 when inputs are missing or non-positive.
 */
export function defaultFormula(time, cost, focusFactor) {
  const weeks = num(time?.sprintCount) > 0
    ? num(time.sprintCount) * (num(time.sprintWeeks) || 1)
    : num(time?.sprintWeeks);
  const fte = num(cost?.teamFTE);
  const f   = clamp(num(focusFactor), 0, 1);
  if (!(weeks > 0) || !(fte > 0) || !(f > 0)) return 0;
  return Math.ceil(weeks * fte * f);
}


/**
 * FNV-1a (32-bit) hash over a stable JSON serialization of the triangle.
 * Used for drift detection by downstream consumers (notably <quality-target>'s
 * ironTriangleHash field).
 *
 * Matches the fnv1a in src/web-components/color-picker/_color-utils.js so
 * the two surfaces share one hash function.
 */
export function fnv1a(str) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(36);
}

/**
 * Stable JSON serialization (sorted keys) so the hash is deterministic
 * across browsers and key-insertion order.
 */
export function stableStringify(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return '[' + value.map(stableStringify).join(',') + ']';
  const keys = Object.keys(value).sort();
  return '{' + keys.map(k => JSON.stringify(k) + ':' + stableStringify(value[k])).join(',') + '}';
}

export function triangleHash({ time, cost, scope }) {
  return fnv1a(stableStringify({ time: time || {}, cost: cost || {}, scope: scope || {} }));
}

// ── helpers ────────────────────────────────────────────────────────

function num(value) {
  if (value === '' || value == null) return 0;
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}
