/**
 * SrcLoader (src/lib/src-loader.js) under node, with globalThis.fetch
 * stubbed: superseded and cancelled requests are aborted and resolve to
 * undefined; failures reject only while current and clear `url`.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { SrcLoader } from '../../src/lib/src-loader.js';
import { SrcLoader as ReExported } from '../../src/lib/board-surface.js';

const realFetch = globalThis.fetch;

/**
 * Stub fetch: each call returns a deferred the test settles by hand.
 * Rejects with an AbortError when its signal aborts, like real fetch.
 */
function stubFetch() {
  const calls = [];
  globalThis.fetch = (url, { signal } = {}) => new Promise((resolve, reject) => {
    const call = {
      url, signal,
      respond: (body, status = 200) => resolve({ ok: status >= 200 && status < 300, status, json: async () => body }),
      fail: (err) => reject(err),
    };
    signal?.addEventListener('abort', () => reject(Object.assign(new Error('aborted'), { name: 'AbortError' })));
    calls.push(call);
  });
  return calls;
}

test.afterEach(() => { globalThis.fetch = realFetch; });

test('board-surface still re-exports SrcLoader', () => {
  assert.equal(ReExported, SrcLoader);
});

test('fetchJson resolves the data and tracks url / pending', async () => {
  const calls = stubFetch();
  const loader = new SrcLoader();
  const p = loader.fetchJson('/a.json');
  assert.equal(loader.url, '/a.json');
  assert.equal(loader.pending, true);
  calls[0].respond({ ok: 1 });
  const result = await p;
  assert.deepEqual(result?.data, { ok: 1 });
  assert.equal(result?.isCurrent(), true);
  assert.equal(loader.pending, false);
});

test('a newer request aborts the older one, which resolves to undefined', async () => {
  const calls = stubFetch();
  const loader = new SrcLoader();
  const first = loader.fetchJson('/a.json');
  const second = loader.fetchJson('/b.json');
  assert.equal(calls[0].signal.aborted, true);
  assert.equal(calls[1].signal.aborted, false);
  calls[1].respond({ b: 1 });
  assert.equal(await first, undefined);
  assert.deepEqual((await second)?.data, { b: 1 });
  assert.equal(loader.url, '/b.json');
});

test('cancel() aborts the in-flight request, clears url and reports it was pending', async () => {
  const calls = stubFetch();
  const loader = new SrcLoader();
  const p = loader.fetchJson('/a.json');
  assert.equal(loader.cancel(), true);
  assert.equal(calls[0].signal.aborted, true);
  assert.equal(loader.url, null);
  assert.equal(loader.pending, false);
  assert.equal(await p, undefined);
  assert.equal(loader.cancel(), false, 'nothing left to cancel');
});

test('a response that lands after cancel() is dropped even if fetch ignores the signal', async () => {
  let respond;
  globalThis.fetch = () => new Promise((resolve) => { respond = resolve; });
  const loader = new SrcLoader();
  const p = loader.fetchJson('/a.json');
  loader.cancel();
  respond({ ok: true, status: 200, json: async () => ({ late: true }) });
  assert.equal(await p, undefined);
});

test('HTTP errors reject while current and clear url so the same src can retry', async () => {
  const calls = stubFetch();
  const loader = new SrcLoader();
  const p = loader.fetchJson('/a.json');
  calls[0].respond(null, 404);
  await assert.rejects(p, /HTTP 404/);
  assert.equal(loader.url, null);
  assert.equal(loader.pending, false);
});

test('an error from a superseded request is swallowed', async () => {
  const calls = stubFetch();
  const loader = new SrcLoader();
  // A fetch that ignores abort and fails later.
  globalThis.fetch = () => new Promise((_, reject) => { calls.push({ fail: reject }); });
  const first = loader.fetchJson('/a.json');
  stubFetch();
  const second = loader.fetchJson('/b.json');
  calls[0].fail(new Error('network down'));
  assert.equal(await first, undefined);
  assert.equal(loader.url, '/b.json');
  void second;
});
