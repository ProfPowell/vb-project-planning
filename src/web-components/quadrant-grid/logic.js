/**
 * quadrant-grid: Generic 2x2 quadrant grid primitive
 *
 * Backs SWOT, stakeholder-map, custom 2x2 visualizations. Sister to
 * <impact-effort> (which keeps its hardcoded quick-wins/big-bets API
 * for backward compatibility).
 *
 * Children are placed by either:
 *   - data-quadrant="0..3" — explicit bucket (Cartesian: Q1=top-right,
 *     Q2=top-left, Q3=bottom-left, Q4=bottom-right; numbers 0..3 map to
 *     Q1..Q4)
 *   - data-x="0..1" data-y="0..1" — normalized coordinates; component
 *     computes the quadrant AND positions the child as a labelled dot
 *     inside the cell
 *
 * Optional drag-and-drop via the `draggable` host attribute; composes
 * <drag-surface> the same way <impact-effort> does. Children become
 * draggable cards that can be moved between quadrants.
 *
 * Progressive enhancement:
 *   1. HTML — children with data-quadrant remain visible without JS;
 *      a <dl> static fallback enumerates each quadrant.
 *   2. CSS  — :not(:defined) selector keeps the layout sensible
 *      pre-upgrade; the grid layout is applied once the component
 *      defines.
 *   3. JS   — adds axis labels, computes quadrants for data-x/data-y
 *      children, wires up drag-and-drop when requested, fires
 *      `quadrant-grid:move`.
 *
 * @attr {string} x-label  - X-axis label (default: "")
 * @attr {string} y-label  - Y-axis label (default: "")
 * @attr {string} x-low    - X-axis low-end marker (default: "Low")
 * @attr {string} x-high   - X-axis high-end marker (default: "High")
 * @attr {string} y-low    - Y-axis low-end marker (default: "Low")
 * @attr {string} y-high   - Y-axis high-end marker (default: "High")
 * @attr {string} q1-label - Top-right quadrant title
 * @attr {string} q2-label - Top-left quadrant title
 * @attr {string} q3-label - Bottom-left quadrant title
 * @attr {string} q4-label - Bottom-right quadrant title
 * @attr {boolean} draggable - Enable DnD between quadrants
 *
 * Children attributes:
 * @attr {number} data-quadrant - 0..3 mapping to Q1..Q4
 * @attr {number} data-x        - 0..1 normalized x coordinate
 * @attr {number} data-y        - 0..1 normalized y coordinate
 * @attr {string} data-id       - Stable identifier for moves
 *
 * @fires quadrant-grid:move - { item, itemId, from, to }. A coordinate-pinned
 *   child that is dragged to another quadrant drops its data-x/data-y (a drop
 *   has no position) and joins that quadrant's stack as a regular card.
 */

import { registerComponent } from '../../lib/bundle-registry.js';
import { VBElement } from '../../lib/vb-element.js';
import { watchSurfaceSemantics } from '../../lib/board-surface.js';

class QuadrantGrid extends VBElement {
  static #instanceCount = 0;

  /** Quadrant indices in visual reading order: TL (Q2), TR (Q1), BL (Q3), BR (Q4). */
  static VISUAL_ORDER = [1, 0, 2, 3];

  /** Stops the drag-surface semantics observer (see board-surface.js). */
  #stopSemantics = () => {};

  setup() {
    if (!this.#groupId) this.#groupId = `qg-${++QuadrantGrid.#instanceCount}`;

    // Reconnect (or a repeated setup() call): the grid is already built and
    // still holds every child, so only re-attach listeners and observers.
    if (this.#built) {
      this.#wire();
      return;
    }
    this.#built = true;

    const xLabel = this.getAttribute('x-label') || '';
    const yLabel = this.getAttribute('y-label') || '';
    const xLow   = this.getAttribute('x-low')   || 'Low';
    const xHigh  = this.getAttribute('x-high')  || 'High';
    const yLow   = this.getAttribute('y-low')   || 'Low';
    const yHigh  = this.getAttribute('y-high')  || 'High';
    const qLabels = [
      this.getAttribute('q1-label') || 'Q1',
      this.getAttribute('q2-label') || 'Q2',
      this.getAttribute('q3-label') || 'Q3',
      this.getAttribute('q4-label') || 'Q4',
    ];
    const draggable = this.hasAttribute('draggable');

    const children = [...this.querySelectorAll(':scope > [data-quadrant], :scope > [data-x][data-y]')];

    const wrapper = document.createElement('section');
    wrapper.className = 'qg-wrapper';
    wrapper.setAttribute('role', 'region');
    wrapper.setAttribute('aria-label', `${yLabel} × ${xLabel} quadrant grid`);

    const yLabelEl = document.createElement('header');
    yLabelEl.className = 'qg-y-label';
    yLabelEl.setAttribute('aria-hidden', 'true');
    yLabelEl.textContent = `↑ ${yLabel}`;

    const yScale = document.createElement('aside');
    yScale.className = 'qg-y-scale';
    yScale.setAttribute('aria-hidden', 'true');
    yScale.append(QuadrantGrid.#span(yHigh), QuadrantGrid.#span(yLow));

    const grid = document.createElement('div');
    grid.className = 'qg-grid';

    const xScale = document.createElement('aside');
    xScale.className = 'qg-x-scale';
    xScale.setAttribute('aria-hidden', 'true');
    xScale.append(QuadrantGrid.#span(xLow), QuadrantGrid.#span(xHigh));

    const xLabelEl = document.createElement('footer');
    xLabelEl.className = 'qg-x-label';
    xLabelEl.setAttribute('aria-hidden', 'true');
    xLabelEl.textContent = `${xLabel} →`;

    /* Indices 0..3 are Cartesian Q1..Q4 (Q1 top-right, Q2 top-left).
       Append in visual reading order (top-left, top-right, bottom-left,
       bottom-right) so DOM, reading and tab order match what is seen;
       CSS still places each zone by data-quadrant-zone. */
    for (const q of QuadrantGrid.VISUAL_ORDER) {
      const section = document.createElement('section');
      section.className = 'qg-quadrant';
      section.dataset.quadrantZone = String(q);
      section.setAttribute('aria-label', qLabels[q]);

      const header = document.createElement('header');
      header.className = 'qg-quadrant-label';
      header.textContent = qLabels[q];

      section.appendChild(header);

      if (draggable) {
        const surface = document.createElement('drag-surface');
        surface.setAttribute('group', this.#groupId);
        surface.setAttribute('aria-label', qLabels[q]);
        surface.setAttribute('data-layout', 'stack');
        surface.setAttribute('data-layout-gap', 'xs');
        section.appendChild(surface);
        this.#surfaces[q] = surface;
      } else {
        const list = document.createElement('ul');
        list.className = 'qg-items';
        section.appendChild(list);
        this.#lists[q] = list;
      }

      grid.appendChild(section);
      this.#sections[q] = section;
    }

    /* Distribute captured children into matching quadrants. */
    children.forEach((/** @type {Element} */ rawChild, i) => {
      const child = /** @type {HTMLElement} */ (rawChild);
      const q = this.#resolveQuadrant(child);
      const target = draggable ? this.#surfaces[q] : this.#lists[q];

      if (draggable) {
        if (!child.hasAttribute('draggable')) child.setAttribute('draggable', 'true');
      }
      if (!child.hasAttribute('data-id')) child.dataset.id = `qg-item-${i}`;

      // Coordinate-positioned children: compute section-local coords
      // (each quadrant spans half the grid; convert document 0..1 to
      // section 0..1) and pin via --qg-local-x / --qg-local-y.
      if (child.hasAttribute('data-x') && child.hasAttribute('data-y')) {
        const x = parseFloat(child.getAttribute('data-x') ?? '');
        const y = parseFloat(child.getAttribute('data-y') ?? '');
        if (Number.isFinite(x) && Number.isFinite(y)) {
          const localX = q === 0 || q === 3 ? (x - 0.5) * 2 : x * 2;
          const localY = q === 0 || q === 1 ? (y - 0.5) * 2 : y * 2;
          child.style.setProperty('--qg-local-x', localX.toFixed(4));
          child.style.setProperty('--qg-local-y', localY.toFixed(4));
          child.classList.add('qg-pinned');
          // Deterministic per-pin hue so identical-style pins remain
          // distinguishable even when stacked. Hash data-id (or text)
          // to a 0..359 hue offset that CSS applies via hue-rotate.
          if (!child.style.getPropertyValue('--qg-pin-hue')) {
            const key = child.dataset.id || (child.textContent || '').trim();
            child.style.setProperty('--qg-pin-hue', `${QuadrantGrid.#hueFromString(key)}deg`);
          }
        }
      }

      // Wrap non-drag children in <li> so list semantics hold. A pinned
      // child is absolutely positioned out of its <li>, so that <li> must
      // not draw a chip of its own.
      if (draggable) {
        target.appendChild(child);
      } else {
        const li = document.createElement('li');
        if (child.classList.contains('qg-pinned')) li.className = 'qg-pin-item';
        li.appendChild(child);
        target.appendChild(li);
      }
    });

    /* Live region for screen-reader announcements on move. */
    const liveRegion = document.createElement('div');
    liveRegion.className = 'qg-live-region visually-hidden';
    liveRegion.setAttribute('role', 'status');
    liveRegion.setAttribute('aria-live', 'polite');

    /* Assembly: 3-col grid (y-scale | grid | spacer) over 3 rows (label | grid | x-scale + label) */
    wrapper.appendChild(yLabelEl);
    wrapper.appendChild(yScale);
    wrapper.appendChild(grid);
    wrapper.appendChild(xScale);
    wrapper.appendChild(xLabelEl);
    this.appendChild(wrapper);
    this.appendChild(liveRegion);

    this.#liveRegion = liveRegion;
    this.#qLabels = qLabels;
    this.#draggable = draggable;

    this.#wire();
  }

  /** Attach listeners and pin observers once per connection. */
  #wire() {
    if (this.#wired) return;
    this.#wired = true;
    if (this.#draggable) {
      this.listen(this, 'drag-surface:transfer', this.#onTransfer);
      this.#stopSemantics = watchSurfaceSemantics(this);
    }

    /* Measure pinned tokens so CSS can clamp their center position by
       half-width / half-height, keeping the bounding box inside the
       quadrant at extreme coordinates. ResizeObserver keeps the
       measurement live across font load, container resize, and content
       changes. */
    this.#observePins();
  }

  /** @param {string} text */
  static #span(text) {
    const span = document.createElement('span');
    span.textContent = text;
    return span;
  }

  #observePins() {
    if (typeof ResizeObserver === 'undefined') return;
    const measure = (el) => {
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      if (w > 0) el.style.setProperty('--qg-pin-half-w', `${w / 2}px`);
      if (h > 0) el.style.setProperty('--qg-pin-half-h', `${h / 2}px`);
    };
    this.#pinObserver = new ResizeObserver((entries) => {
      for (const entry of entries) measure(entry.target);
      this.#scheduleClusterPass();
    });
    for (const pin of this.querySelectorAll('.qg-pinned')) {
      this.#pinObserver.observe(pin);
    }
    this.#scheduleClusterPass();
  }

  /* Coalesce cluster passes within a frame; ResizeObserver and font
     loads can fire multiple times during initial layout. */
  #scheduleClusterPass() {
    if (this.#clusterRaf) return;
    this.#clusterRaf = requestAnimationFrame(() => {
      this.#clusterRaf = 0;
      this.#detectClusters();
    });
  }

  /* Group overlapping pins per quadrant so CSS can fan them on hover
     or focus. Cluster pairs by bounding-rect intersection — robust to
     pin size, padding, and inline-size differences. */
  #detectClusters() {
    for (const rawPin of this.querySelectorAll('.qg-pinned')) {
      const pin = /** @type {HTMLElement} */ (rawPin);
      pin.classList.remove('qg-clustered');
      pin.style.removeProperty('--qg-cluster-i');
      pin.style.removeProperty('--qg-cluster-n');
      delete pin.dataset.cluster;
      if (pin.dataset.qgTabbed !== undefined) {
        pin.removeAttribute('tabindex');
        delete pin.dataset.qgTabbed;
      }
      if (pin.dataset.qgRole !== undefined) {
        pin.removeAttribute('role');
        delete pin.dataset.qgRole;
      }
    }

    let clusterSeq = 0;
    for (let q = 0; q < 4; q++) {
      const section = this.#sections[q];
      if (!section) continue;
      const pins = /** @type {HTMLElement[]} */ ([...section.querySelectorAll('.qg-pinned')]);
      if (pins.length < 2) continue;
      const rects = pins.map((p) => p.getBoundingClientRect());
      const parent = Array.from({ length: pins.length }, (_, i) => i);
      /** @type {(i: number) => number} */
      const find = (i) => (parent[i] === i ? i : (parent[i] = find(parent[i])));
      const union = (a, b) => { const ra = find(a), rb = find(b); if (ra !== rb) parent[ra] = rb; };
      for (let i = 0; i < pins.length; i++) {
        for (let j = i + 1; j < pins.length; j++) {
          if (QuadrantGrid.#rectsIntersect(rects[i], rects[j])) union(i, j);
        }
      }
      /** @type {Map<number, number[]>} */
      const groups = new Map();
      for (let i = 0; i < pins.length; i++) {
        const root = find(i);
        if (!groups.has(root)) groups.set(root, []);
        groups.get(root)?.push(i);
      }
      for (const members of groups.values()) {
        if (members.length < 2) continue;
        const id = `c${++clusterSeq}`;
        members.forEach((idx, i) => {
          const pin = pins[idx];
          pin.classList.add('qg-clustered');
          pin.dataset.cluster = id;
          pin.style.setProperty('--qg-cluster-i', String(i));
          pin.style.setProperty('--qg-cluster-n', String(members.length));
          // Clustered pins become focusable so keyboard users can fan the
          // cluster out (:focus-within); a focusable generic element needs a
          // role, so expose it as a group.
          if (!pin.hasAttribute('tabindex') && !pin.matches('a, button, [contenteditable]')) {
            pin.setAttribute('tabindex', '0');
            pin.dataset.qgTabbed = '';
            if (!pin.hasAttribute('role')) {
              pin.setAttribute('role', 'group');
              pin.dataset.qgRole = '';
            }
          }
        });
      }
    }
  }

  teardown() {
    // Listeners are removed by VBElement; the built grid and its children
    // stay in place so a moved grid keeps its content.
    this.#wired = false;
    this.#stopSemantics();
    this.#pinObserver?.disconnect();
    this.#pinObserver = null;
    if (this.#clusterRaf) cancelAnimationFrame(this.#clusterRaf);
    this.#clusterRaf = 0;
  }

  static #rectsIntersect(a, b) {
    return !(a.right <= b.left || b.right <= a.left || a.bottom <= b.top || b.bottom <= a.top);
  }

  /* Stable string hash → hue degree in [0, 360). djb2-ish; small and
     deterministic across runs so per-pin tints don't flicker on
     re-render. */
  static #hueFromString(s) {
    let h = 5381;
    for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
    return ((h % 360) + 360) % 360;
  }

  #onTransfer = (e) => {
    const { item, fromSurface, toSurface } = e.detail;
    const from = this.#findQuadrantForSurface(fromSurface);
    const to = this.#findQuadrantForSurface(toSurface);
    if (from == null || to == null) return;

    item.setAttribute('data-quadrant', String(to));
    if (item.classList.contains('qg-pinned')) this.#unpin(item);
    this.#scheduleClusterPass();
    this.#announce(`Moved ${this.#itemLabel(item)} to ${this.#qLabels[to]}`);

    this.dispatchEvent(new CustomEvent('quadrant-grid:move', {
      bubbles: true,
      detail: {
        item,
        itemId: item.dataset.id,
        from,
        to,
      },
    }));
  };

  /**
   * A dropped pin has no coordinates in its new quadrant: drop data-x /
   * data-y and the pin styling so it joins the quadrant's stack.
   * @param {HTMLElement} item
   */
  #unpin(item) {
    this.#pinObserver?.unobserve(item);
    item.removeAttribute('data-x');
    item.removeAttribute('data-y');
    item.classList.remove('qg-pinned', 'qg-clustered');
    for (const prop of ['--qg-local-x', '--qg-local-y', '--qg-pin-half-w', '--qg-pin-half-h',
      '--qg-cluster-i', '--qg-cluster-n']) {
      item.style.removeProperty(prop);
    }
    delete item.dataset.cluster;
    if (item.dataset.qgTabbed !== undefined) { item.removeAttribute('tabindex'); delete item.dataset.qgTabbed; }
    if (item.dataset.qgRole !== undefined) { item.removeAttribute('role'); delete item.dataset.qgRole; }
  }

  #resolveQuadrant(child) {
    const q = parseInt(child.getAttribute('data-quadrant'), 10);
    if (q >= 0 && q <= 3) return q;
    if (child.hasAttribute('data-x') && child.hasAttribute('data-y')) {
      const x = parseFloat(child.getAttribute('data-x'));
      const y = parseFloat(child.getAttribute('data-y'));
      return QuadrantGrid.quadrantFor(x, y);
    }
    return 0;
  }

  /**
   * Map normalized (x, y) coordinates in [0..1] to a Cartesian quadrant
   * index 0..3 (Q1=top-right, Q2=top-left, Q3=bottom-left, Q4=bottom-right).
   * The midpoint (0.5) belongs to the higher quadrant.
   */
  static quadrantFor(x, y) {
    const right = x >= 0.5;
    const top   = y >= 0.5;
    if (top && right)  return 0;
    if (top && !right) return 1;
    if (!top && !right) return 2;
    return 3;
  }

  #findQuadrantForSurface(surface) {
    for (let q = 0; q < 4; q++) {
      if (this.#surfaces[q] === surface) return q;
    }
    return null;
  }

  #itemLabel(item) {
    return (item.textContent || '').trim().split('\n')[0] || 'item';
  }

  #announce(message) {
    if (this.#liveRegion) this.#liveRegion.textContent = message;
  }

  #groupId = '';
  #built = false;
  #wired = false;
  #draggable = false;
  /** @type {Record<number, HTMLElement>} */
  #surfaces = {};
  /** @type {Record<number, HTMLElement>} */
  #lists = {};
  /** @type {Record<number, HTMLElement>} */
  #sections = {};
  /** @type {HTMLElement | null} */
  #liveRegion = null;
  /** @type {string[]} */
  #qLabels = [];
  /** @type {ResizeObserver | null} */
  #pinObserver = null;
  /** @type {number} */
  #clusterRaf = 0;
}

registerComponent('quadrant-grid', QuadrantGrid);

export { QuadrantGrid };
