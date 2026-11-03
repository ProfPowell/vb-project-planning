/**
 * Portrait URL utility
 *
 * Generates deterministic portrait image URLs from the faker-js
 * person-portrait CDN assets (CC0 licensed, AI-generated).
 *
 * 200 unique portraits (100 male, 100 female) at 5 sizes:
 *   32, 64, 128, 256, 512 px (square).
 *
 * @example
 * portraitUrl('Sarah Chen');
 * // → 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/128/37.jpg'
 *
 * portraitUrl('Marcus Johnson', 256);
 * // → 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/256/82.jpg'
 */

import { stringHash } from './hash.js';

const CDN = 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait';
const SIZES = [32, 64, 128, 256, 512];

/**
 * Snap a pixel value to the nearest available portrait size.
 * @param {number} px - Desired size in pixels
 * @returns {number} Closest available size (32, 64, 128, 256, or 512)
 */
function snapSize(px) {
  let best = SIZES[0];
  let bestDist = Math.abs(px - best);
  for (let i = 1; i < SIZES.length; i++) {
    const dist = Math.abs(px - SIZES[i]);
    if (dist < bestDist) {
      best = SIZES[i];
      bestDist = dist;
    }
  }
  return best;
}

/**
 * Generate a deterministic portrait URL from a seed string.
 *
 * The same seed always produces the same portrait. Sex and index are
 * derived from the seed hash, so names cluster naturally — different
 * names get different faces.
 *
 * @param {string} seed  - Any string (name, ID, index, etc.)
 * @param {number} [size=128] - Desired image size in px (snapped to nearest available)
 * @returns {string} CDN URL for the portrait JPEG
 */
export function portraitUrl(seed, size = 128) {
  const h = stringHash(String(seed));
  const index = ((h % 100) + 100) % 100;
  const sex = ((h >>> 16) & 1) === 0 ? 'female' : 'male';
  const snapped = snapSize(size);
  return `${CDN}/${sex}/${snapped}/${index}.jpg`;
}


export { SIZES as PORTRAIT_SIZES, CDN as PORTRAIT_CDN };
