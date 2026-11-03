/**
 * SrcLoader — one in-flight `src` fetch per component.
 *
 * Every component with a `src` attribute (the UXShadowElement cards, the
 * boards, gantt-chart, review-surface) loads through this so the same
 * rules hold everywhere:
 *
 * - A newer `start()` / `fetchJson()` aborts the previous request, and the
 *   superseded response (if it still arrives) is dropped.
 * - `cancel()` aborts the in-flight request without starting another (the
 *   `src` attribute was removed, or `.tasks` / `.pins` took over).
 * - `url` is the last URL requested, so connect-time code can skip a
 *   refetch of the same value; it is cleared on failure (allowing a retry)
 *   and by `cancel()`.
 */
export class SrcLoader {
  /** @type {AbortController | null} */
  #ctrl = null;
  /** @type {string | null} */
  url = null;

  /** True while a fetchJson() request is in flight (not settled or cancelled). */
  #busy = false;
  get pending() { return this.#busy; }

  /**
   * Abort any earlier request and begin tracking a new one.
   * @param {string} url
   * @returns {{ signal: AbortSignal, isCurrent: () => boolean }}
   */
  start(url) {
    this.#ctrl?.abort();
    const ctrl = new AbortController();
    this.#ctrl = ctrl;
    this.#busy = false;
    this.url = url;
    return { signal: ctrl.signal, isCurrent: () => this.#ctrl === ctrl && !ctrl.signal.aborted };
  }

  /**
   * Abort the in-flight request (if any) and forget the URL. Returns true
   * when a request was actually in flight.
   * @returns {boolean}
   */
  cancel() {
    const wasPending = this.pending;
    this.#ctrl?.abort();
    this.#ctrl = null;
    this.#busy = false;
    this.url = null;
    return wasPending;
  }

  /**
   * Fetch JSON for `url`, aborting any earlier request. Resolves to
   * `undefined` when superseded, cancelled or aborted; rejects (only while
   * still current) on a network error, a non-2xx status or invalid JSON.
   * @param {string} url
   * @returns {Promise<{ data: any, isCurrent: () => boolean } | undefined>}
   */
  async fetchJson(url) {
    const { signal, isCurrent } = this.start(url);
    this.#busy = true;
    try {
      const res = await fetch(url, { signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!isCurrent()) return undefined;
      this.#busy = false;
      return { data, isCurrent };
    } catch (err) {
      if (/** @type {any} */ (err)?.name === 'AbortError' || !isCurrent()) return undefined;
      this.#busy = false;
      this.url = null;
      throw err;
    }
  }
}
