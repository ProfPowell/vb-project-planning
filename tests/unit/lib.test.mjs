/**
 * Unit tests for the shared src/lib helpers (node:test, no browser).
 * Run with TZ set west of UTC so the "UTC midnight is the day before"
 * class of bug actually shows up: `TZ=America/Los_Angeles node --test`.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseISODate, toISODate, addDays, daysBetween, enumerateDays,
  startOfQuarter, endOfQuarter, endOfMonth, addMonths,
} from '../../src/lib/dates.js';
import { esc, cssUrl } from '../../src/lib/escape.js';
import { stringHash } from '../../src/lib/hash.js';

test('parseISODate reads YYYY-MM-DD as local midnight, so the day never slips', () => {
  const d = parseISODate('2026-04-01');
  assert.equal(d.getFullYear(), 2026);
  assert.equal(d.getMonth(), 3);
  assert.equal(d.getDate(), 1);
  assert.equal(toISODate(d), '2026-04-01');
});

test('parseISODate rejects junk and roll-overs', () => {
  assert.equal(parseISODate(''), null);
  assert.equal(parseISODate(null), null);
  assert.equal(parseISODate('not a date'), null);
  assert.equal(parseISODate('2026-02-31'), null);
});

test('enumerateDays is DST-safe (US fall-back, Nov 1 2026)', () => {
  const days = enumerateDays(parseISODate('2026-10-30'), parseISODate('2026-11-06'));
  assert.deepEqual(days, [
    '2026-10-30', '2026-10-31', '2026-11-01', '2026-11-02',
    '2026-11-03', '2026-11-04', '2026-11-05', '2026-11-06',
  ]);
});

test('addDays / daysBetween use calendar days across DST', () => {
  const a = parseISODate('2026-03-07');
  const b = addDays(a, 2);
  assert.equal(toISODate(b), '2026-03-09');
  assert.equal(daysBetween(a, b), 2);
});

test('quarter and month bounds', () => {
  const d = parseISODate('2026-08-15');
  assert.equal(toISODate(startOfQuarter(d)), '2026-07-01');
  assert.equal(toISODate(endOfQuarter(d)), '2026-09-30');
  assert.equal(toISODate(endOfMonth(parseISODate('2028-02-03'))), '2028-02-29');
  assert.equal(toISODate(addMonths(parseISODate('2026-01-31'), 1)), '2026-02-28');
});

test('esc covers text and both attribute quote styles', () => {
  assert.equal(esc(`<a href='x' title="y">&</a>`),
    '&lt;a href=&#39;x&#39; title=&quot;y&quot;&gt;&amp;&lt;/a&gt;');
  assert.equal(esc(null), '');
});

test('cssUrl quotes, escapes, and refuses script-ish schemes', () => {
  assert.equal(cssUrl('photo (1).jpg'), 'url(&quot;photo (1).jpg&quot;)');
  assert.equal(cssUrl('javascript:alert(1)'), 'none');
  assert.equal(cssUrl(''), 'none');
  assert.ok(!cssUrl('a");background:red;("').includes('");'));
});

test('stringHash matches the original copies exactly', () => {
  const original = (str) => {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
    return h;
  };
  for (const s of ['', 'Sarah Chen', 'A much longer persona name that overflows 32 bits']) {
    assert.equal(stringHash(s), original(s));
  }
});
