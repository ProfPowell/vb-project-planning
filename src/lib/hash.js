/**
 * Small deterministic string hash (Java-style `h * 31 + c`, written as
 * `(h << 5) - h`). Used for stable avatar colours and portrait picks, so the
 * exact output matters: changing it changes every generated avatar.
 * @param {string} str
 * @returns {number} integer (deliberately not truncated to 32 bits, to match
 *   the original copies byte for byte)
 */
export function stringHash(str) {
  let h = 0;
  const s = String(str ?? '');
  for (let i = 0; i < s.length; i++) {
    h = s.charCodeAt(i) + ((h << 5) - h);
  }
  return h;
}
