/**
 * <user-story> — Agile user story card web component
 *
 * Displays user stories in the classic Agile format:
 * "As a [persona], I want [action] so that [benefit]"
 *
 * Content slots (text the user reads):
 * @slot persona             - The "As a..." role (e.g., <span>)
 * @slot action              - The "I want..." description (e.g., <span>)
 * @slot benefit             - The "so that..." outcome (e.g., <span>)
 * @slot title               - Short label for minimal mode (e.g., <h3>)
 * @slot acceptance-criteria - Checklist (e.g., <ul>)
 * @slot tasks               - Implementation tasks (e.g., <ul>)
 * @slot notes               - Additional context (e.g., <p>)
 *
 * State/config attributes:
 * @attr {string}  persona-id - Links to a user-persona element by id. When no
 *                              slot="persona" is given, the "As a…" text falls
 *                              back to that persona's job-title (live-updating).
 * @attr {enum}    priority   - critical | high | medium | low
 * @attr {enum}    status     - backlog | to-do | in-progress | review | done
 * @attr {string}  points     - Story point estimate
 * @attr {string}  epic       - Parent epic label
 * @attr {string}  story-id   - Ticket or story identifier
 * @attr {string}  detail     - full | compact | minimal
 * @attr {boolean} compact    - Alias for detail="compact"
 * @attr {string}  src        - URL to JSON data (fetched once per value)
 *
 * @fires user-story:ready            - Once, after the first render (after the src data renders when src is set).
 *                                     Deprecated alias: story-ready (same detail, 0.3.x only)
 * @fires user-story:status-changed   - Fired when updateStatus() is called. Deprecated alias: status-changed
 * @fires user-story:priority-changed - Fired when updatePriority() is called. Deprecated alias: priority-changed
 * @fires user-story:upgraded     - Once, after first connect
 * @fires user-story:data-changed - After .data assignment, detail: { data, source: 'property' }
 *
 * Keyboard: a minimal card is a button (Enter / Space open the detail
 * dialog). On a board (directly inside a <drag-surface>) the host is the
 * single tab stop: Enter opens the dialog, Space grabs for reordering.
 *
 * @example
 * <user-story
 *   persona-id="persona-sarah"
 *   priority="high"
 *   status="to-do"
 *   points="5"
 *   epic="Dashboard"
 *   story-id="PROJ-142">
 *   <span slot="persona">Product Manager</span>
 *   <span slot="action">view all project timelines in one dashboard</span>
 *   <span slot="benefit">I can quickly identify bottlenecks</span>
 *   <ul slot="acceptance-criteria">
 *     <li>Dashboard loads within 2 seconds</li>
 *   </ul>
 * </user-story>
 */

import { styles } from './styles.js';
import { registerComponent } from '../../lib/bundle-registry.js';
import {
  esc, lucideSvg, UX_ICONS, UXShadowElement, PRIORITIES, STATUSES, lookup,
  fillSlot, slottedChild, detailLevel, markEmptySections, personaJobTitle,
} from '../_ux-base.js';
import { headingLevelFor } from '../../lib/headings.js';

let dialogSeq = 0;

class UserStory extends UXShadowElement {
  static readyEvent = 'user-story:ready';
  static legacyReadyEvent = 'story-ready';

  static get observedAttributes() {
    return [
      'persona-id', 'priority', 'points',
      'status', 'epic', 'story-id', 'compact', 'detail', 'src', 'heading-level'
    ];
  }

  static PRIORITIES = PRIORITIES;
  static STATUSES = STATUSES;

  /** @type {MutationObserver | null} */
  #personaObserver = null;

  /** @type {HTMLDialogElement | null} */
  #dialog = null;

  constructor() {
    super();
    this.addEventListener('keydown', this.#onBoardKeydown);
  }

  /* ── Data API ──────────────────────────────────── */

  /**
   * Read the user story as a plain data object. Mirrors what a consumer
   * would assign to .data — useful for diffing, persistence, or echo.
   */
  get data() {
    return {
      storyId: this.storyId || undefined,
      personaId: this.personaId || undefined,
      priority: this.priority,
      status: this.status,
      points: this.points || undefined,
      epic: this.epic || undefined,
      detail: this.getAttribute('detail') || undefined,
      persona: this.persona || undefined,
      action: this.action || undefined,
      benefit: this.benefit || undefined,
      title: this.storyTitle || undefined,
    };
  }

  /**
   * Set state attributes and slotted content from a plain object in one call.
   * Replaces multiple setAttribute calls + manual slotted-child creation.
   * Idempotent for repeat calls.
   */
  set data(value) {
    this._setData(value);
  }

  /**
   * Apply a data record to attributes + slotted children. Used by both the
   * .data setter and the src loader. Slotted children are created only when absent (authored content wins). No render — caller decides.
   * @param {Record<string, unknown>} data
   */
  _applyData(data) {
    for (const [jsonKey, attr] of [
      ['storyId', 'story-id'], ['personaId', 'persona-id'], ['priority', 'priority'],
      ['status', 'status'], ['points', 'points'], ['epic', 'epic'], ['detail', 'detail']
    ]) {
      if (data[jsonKey] != null) this.setAttribute(attr, String(data[jsonKey]));
    }

    fillSlot(this, 'persona', data.persona, { tag: 'span' });
    fillSlot(this, 'action', data.action, { tag: 'span' });
    fillSlot(this, 'benefit', data.benefit, { tag: 'span' });
    fillSlot(this, 'title', data.title, { tag: 'h3' });
    fillSlot(this, 'acceptance-criteria', data.acceptanceCriteria);
    fillSlot(this, 'tasks', data.tasks);
    fillSlot(this, 'notes', data.notes);
  }

  /* ── Lifecycle (see UXShadowElement) ──────────── */

  _setup() {
    if (this.storyId && !this.id && !this.hasAttribute('data-detail-clone')) this.id = this.storyId;
  }

  _connect() {
    this.#observeLinkedPersona();
    // Moved onto / off a board: switch the minimal card's tab stop.
    this.#syncBoardFocus();
  }

  _disconnect() {
    this.#personaObserver?.disconnect();
    this.#personaObserver = null;
    // A move (disconnect + connect in one task) keeps the open dialog;
    // a real removal closes and removes it.
    queueMicrotask(() => { if (!this.isConnected) this.#removeDialog(); });
  }

  /** @param {string} name */
  _attributeEffects(name) {
    // Also runs after a .data / src record sets persona-id.
    if (name === 'persona-id') this.#observeLinkedPersona();
  }

  _readyDetail() {
    return {
      id: this.storyId,
      persona: this.persona,
      action: this.action,
      benefit: this.benefit,
      priority: this.priority,
      status: this.status,
      points: this.points,
    };
  }

  /**
   * Keep the "As a…" text in sync when the linked persona's job title is edited.
   * Only observes when persona-id resolves and the author has not supplied an
   * explicit persona slot (an explicit slot always wins, so nothing to track).
   */
  #observeLinkedPersona() {
    this.#personaObserver?.disconnect();
    this.#personaObserver = null;
    if (!this.personaId || this.#explicitPersona()) return;
    const root = /** @type {Document | ShadowRoot} */ (this.getRootNode());
    const scope = root && typeof root.getElementById === 'function' ? root : document;
    const persona = scope.getElementById(this.personaId);
    if (!persona || persona.tagName !== 'USER-PERSONA') return;
    this.#personaObserver = new MutationObserver(() => this._render());
    // job-title, plus the legacy role attribute (0.2.x markup, migrated on upgrade).
    this.#personaObserver.observe(persona, { attributes: true, attributeFilter: ['job-title', 'role'] });
  }

  // ── Getters ────────────────────────────────────────────────────────

  /**
   * Read persona from slotted element or cache. When neither is authored but
   * persona-id links to a <user-persona> on the page, fall back to that
   * persona's job title ("As a Product Manager…") rather than the generic "user".
   */
  get persona() {
    const explicit = this.#explicitPersona();
    return explicit || this.#linkedPersonaTitle() || 'user';
  }

  get personaId() {
    return this.getAttribute('persona-id') || '';
  }

  /** Persona text the author supplied directly via slot or .data (no link resolution). */
  #explicitPersona() {
    return this._slotText('persona');
  }

  /**
   * Resolve the job title of the <user-persona> referenced by persona-id, if one
   * exists in the same tree. Used as the "As a…" fallback so a linked story
   * reads "As a Product Manager" instead of "As a user". Returns '' when there
   * is no persona-id, no matching persona, or the persona has no job title
   * (`job-title`, or a legacy non-ARIA `role` on a not-yet-upgraded persona).
   */
  #linkedPersonaTitle() {
    if (!this.personaId) return '';
    const root = /** @type {Document | ShadowRoot} */ (this.getRootNode());
    const scope = root && typeof root.getElementById === 'function' ? root : document;
    const persona = scope.getElementById(this.personaId);
    if (!persona || persona.tagName !== 'USER-PERSONA') return '';
    return personaJobTitle(persona);
  }

  /**
   * Indefinite article ("a" / "an") for the persona role so the statement
   * reads naturally — "As an Analyst", "As a Product Manager". Simple
   * vowel-start heuristic (excludes "u", which usually sounds like "you":
   * "a user"). Falls back to "a".
   */
  #personaArticle() {
    return /^[aeio]/i.test(this.persona.trim()) ? 'an' : 'a';
  }

  /** Read action from slotted element or cache */
  get action() {
    return this._slotText('action');
  }

  /** Read benefit from slotted element or cache */
  get benefit() {
    return this._slotText('benefit');
  }

  get priority() {
    return this.getAttribute('priority') || 'medium';
  }

  get points() {
    return this.getAttribute('points') || '';
  }

  get status() {
    return this.getAttribute('status') || 'backlog';
  }

  get epic() {
    return this.getAttribute('epic') || '';
  }

  get storyId() {
    return this.getAttribute('story-id') || '';
  }

  /** Read title from slotted heading or cache */
  get storyTitle() {
    return this._slotText('title');
  }

  /** Label for minimal mode: title if set, otherwise truncated action */
  get _minimalLabel() {
    if (this.storyTitle) return this.storyTitle;
    const action = this.action;
    return action.length > 40 ? action.slice(0, 40) + '\u2026' : action;
  }

  get compact() {
    return this.hasAttribute('compact');
  }

  get _detailLevel() {
    return detailLevel(this);
  }

  // ── Public API ───────────────────────────────────────────────────

  updateStatus(newStatus) {
    if (Object.hasOwn(STATUSES, newStatus)) {
      this.setAttribute('status', newStatus);
      this._emit('user-story:status-changed', { status: newStatus, storyId: this.storyId }, 'status-changed');
    }
  }

  updatePriority(newPriority) {
    if (Object.hasOwn(PRIORITIES, newPriority)) {
      this.setAttribute('priority', newPriority);
      this._emit('user-story:priority-changed', { priority: newPriority, storyId: this.storyId }, 'priority-changed');
    }
  }

  /**
   * Open a modal <dialog> showing this story at full detail. Each story
   * owns at most one dialog; it is removed from the document when it
   * closes or when the story is removed.
   */
  showDetail() {
    this.#removeDialog();
    const dialog = document.createElement('dialog');
    dialog.id = this.#dialogId();
    dialog.setAttribute('data-size', 'l');

    const form = document.createElement('form');
    form.method = 'dialog';
    const header = document.createElement('header');
    const title = document.createElement('h2');
    title.id = `${dialog.id}-title`;
    title.textContent = this.storyTitle || this.storyId || 'Story Detail';
    dialog.setAttribute('aria-labelledby', title.id);
    const closeBtn = document.createElement('button');
    closeBtn.type = 'submit';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.textContent = '\u00d7';
    header.appendChild(title);
    header.appendChild(closeBtn);

    const section = document.createElement('section');
    const full = document.createElement('user-story');
    for (const attr of this.getAttributeNames()) {
      if (attr === 'detail' || attr === 'compact' || attr === 'data-upgraded' || attr === 'draggable' || attr === 'data-id' || attr === 'data-quadrant') continue;
      full.setAttribute(attr, this.getAttribute(attr) ?? '');
    }
    const hasSlottedContent = [...this.children].some(c => c.getAttribute('slot'));
    full.setAttribute('detail', hasSlottedContent ? 'full' : 'compact');
    full.removeAttribute('id');
    full.setAttribute('data-detail-clone', ''); // keep the clone out of id/persona lookups
    for (const child of [...this.children]) full.appendChild(child.cloneNode(true));
    section.appendChild(full);

    form.appendChild(header);
    form.appendChild(section);
    dialog.appendChild(form);
    dialog.addEventListener('close', () => {
      if (this.#dialog === dialog) this.#dialog = null;
      dialog.remove();
    }, { once: true });
    document.body.appendChild(dialog);
    this.#dialog = dialog;
    dialog.showModal();
  }

  /** `story-dialog-<story-id>`, made unique if another dialog already uses it. */
  #dialogId() {
    const base = `story-dialog-${this.storyId || this.id || 'story'}`;
    let id = base;
    while (document.getElementById(id)) id = `${base}-${++dialogSeq}`;
    return id;
  }

  #removeDialog() {
    const dialog = this.#dialog;
    if (!dialog) return;
    this.#dialog = null;
    if (dialog.open) dialog.close();
    dialog.remove();
  }

  // ── Board keyboard model ─────────────────────────────────────────

  /**
   * True when this card is a direct child of a <drag-surface> (kanban-board,
   * story-map, impact-effort), which makes the host its focusable,
   * keyboard-reorderable list item.
   */
  get #onBoard() {
    return this.parentElement?.localName === 'drag-surface';
  }

  /**
   * On a board the host (tabindex 0, set by drag-surface) is the card's
   * only tab stop, so the minimal card's inner button leaves the tab order.
   * Off a board the button is the tab stop and works as a normal button.
   */
  #syncBoardFocus() {
    const button = /** @type {HTMLButtonElement | null | undefined} */ (this.shadowRoot?.querySelector('.story-card--minimal'));
    if (button) button.tabIndex = this.#onBoard ? -1 : 0;
  }

  /**
   * Board keyboard model for a minimal card: Enter opens the detail
   * dialog; Space (drag-surface's grab key) grabs and drops; while grabbed,
   * Enter drops and arrows move. Runs on the host, before the drag-surface's
   * own handler, and stops Enter there so it does not start a grab.
   * @param {KeyboardEvent} e
   */
  #onBoardKeydown = (e) => {
    if (e.key !== 'Enter' || e.defaultPrevented || !this.#onBoard) return;
    if (this._detailLevel !== 'minimal' || this.getAttribute('aria-grabbed') === 'true') return;
    if (!this.shadowRoot?.querySelector('.story-card--minimal')) return;
    e.preventDefault();          // the inner button must not also click
    e.stopPropagation();         // keep drag-surface from starting a grab
    this.showDetail();
  };

  // ── Private ──────────────────────────────────────────────────────

  /**
   * Level for the Acceptance Criteria / Tasks / Notes headings: `heading-level`
   * if set, else one below the nearest heading before the story. The slotted
   * title is ignored (along with other stories' headings): it is only
   * rendered in minimal mode, which has no sections.
   * @returns {number}
   */
  #sectionHeadingLevel() {
    return headingLevelFor(this, 'user-story');
  }

  _render() {
    const priorityInfo = lookup(PRIORITIES, this.priority, 'medium');
    const statusInfo = lookup(STATUSES, this.status, 'backlog');
    const level = this._detailLevel;
    const sectionLevel = this.#sectionHeadingLevel();
    const ariaLabel = this.storyId
      ? `User story: ${esc(this.storyId)}`
      : 'User story';

    if (!this.shadowRoot) return;
    if (level === 'minimal') {
      const label = this._minimalLabel || 'Untitled story';
      const buttonLabel = this.storyId ? `${this.storyId}: ${label}` : label;
      // A real button: focusable, Enter/Space activate it natively, and
      // aria-haspopup tells screen readers it opens a dialog.
      this.shadowRoot.innerHTML = `
        <style>${styles}</style>
        <button type="button" class="story-card story-card--minimal" part="card"
          aria-haspopup="dialog" aria-label="${esc(buttonLabel)}">
          <span class="story-body">
            ${this.storyId ? `<span class="story-id">${esc(this.storyId)}</span>` : ''}
            <span class="story-title-wrap">
              <slot name="title"><span class="story-title-fallback">${esc(this._minimalLabel || '[describe the action]')}</span></slot>
            </span>
          </span>
        </button>
      `;
      this.shadowRoot.querySelector('.story-card--minimal')?.addEventListener('click', () => this.showDetail());
      this.#syncBoardFocus();
    } else {
      this.shadowRoot.innerHTML = `
        <style>${styles}</style>

        <article class="story-card story-card--${level}" part="card" role="article" aria-label="${ariaLabel}">
          <header class="story-header" part="header">
            <div class="story-meta">
              ${this.storyId ? `<span class="story-id" part="id">${esc(this.storyId)}</span>` : ''}
              ${this.epic ? `<span class="epic-badge" part="epic">${esc(this.epic)}</span>` : ''}
            </div>
            <div class="story-badges">
              <span class="priority-badge" part="priority"
                style="--_hue: ${priorityInfo.color}"
              >${esc(priorityInfo.label)}</span>
              <span class="status-badge" part="status"
                style="--_hue: ${statusInfo.color}"
              >${esc(statusInfo.label)}</span>
              ${this.points ? `<span class="points-badge" part="points">${esc(this.points)}<span class="visually-hidden"> story points</span></span>` : ''}
            </div>
          </header>

          <div class="story-body" part="body">
            <p class="story-statement" part="statement">
              <span class="keyword">As ${this.#personaArticle()}</span>
              ${this.personaId
                ? `<a class="persona-text persona-text--link" href="#${esc(this.personaId)}">${lucideSvg(UX_ICONS.user)} <slot name="persona"><span>${esc(this.#linkedPersonaTitle() || 'user')}</span></slot></a>`
                : `<span class="persona-text"><slot name="persona"><span>user</span></slot></span>`},
              <span class="keyword">I want</span>
              <span class="action-text"><slot name="action"><span>[describe the action]</span></slot></span>${this.benefit || slottedChild(this, 'benefit') ? `
              <span class="keyword">so that</span>
              <span class="benefit-text"><slot name="benefit"></slot></span>` : ''}
            </p>
          </div>

          <div class="story-sections" part="sections">
            <div class="section" part="section">
              <div class="section-header">
                <div class="section-icon acceptance">
                  <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                </div>
                <h${sectionLevel} class="section-title">Acceptance Criteria</h${sectionLevel}>
              </div>
              <div class="section-content">
                <slot name="acceptance-criteria">
                  <em class="slot-fallback">No acceptance criteria defined.</em>
                </slot>
              </div>
            </div>

            <div class="section" part="section">
              <div class="section-header">
                <div class="section-icon tasks">
                  <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
                </div>
                <h${sectionLevel} class="section-title">Tasks</h${sectionLevel}>
              </div>
              <div class="section-content">
                <slot name="tasks">
                  <em class="slot-fallback">No tasks added yet.</em>
                </slot>
              </div>
            </div>

            <div class="section" part="section">
              <div class="section-header">
                <div class="section-icon notes">
                  <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                </div>
                <h${sectionLevel} class="section-title">Notes</h${sectionLevel}>
              </div>
              <div class="section-content">
                <slot name="notes">
                  <em class="slot-fallback">No additional notes.</em>
                </slot>
              </div>
            </div>
          </div>
        </article>
      `;

      if (level === 'compact') markEmptySections(this.shadowRoot, '.section');
    }
  }
}

registerComponent('user-story', UserStory);

export { UserStory };
