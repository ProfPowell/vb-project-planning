// src/web-components/user-persona/styles.js
var styles = `
  :host {
    display: block;
    font-family: var(--user-persona-font, var(--font-sans, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif));
    --_bg:          var(--user-persona-bg, var(--color-surface, #ffffff));
    --_text:        var(--user-persona-text, var(--color-text, #1a1a1a));
    --_border:      var(--user-persona-border, var(--color-border, #e0e0e0));
    --_muted:       var(--user-persona-muted, var(--color-text-muted, #666));
    --_accent:      var(--user-persona-accent, var(--color-interactive, #0066cc));
    --_card-bg:     var(--user-persona-card-bg, var(--color-surface-raised, #f8f9fa));
    --_radius:      var(--user-persona-radius, var(--radius-xl, 1rem));
    --_avatar-size: var(--user-persona-avatar-size, 80px);
    --_goals:       var(--user-persona-goals, #22c55e);
    --_frustrations: var(--user-persona-frustrations, #ef4444);
    --_behaviors:   var(--user-persona-behaviors, #8b5cf6);
    --_stories:     var(--user-persona-stories, #3b82f6);
    --_shadow:    var(--user-persona-shadow, var(--shadow-md));
    --_space-2xs: var(--user-persona-space-2xs, var(--size-2xs, 0.25rem));
    --_space-xs:  var(--user-persona-space-xs, var(--size-xs, 0.5rem));
    --_space-s:   var(--user-persona-space-s, var(--size-s, 0.75rem));
    --_space-m:   var(--user-persona-space-m, var(--size-m, 1rem));
    --_space-l:   var(--user-persona-space-l, var(--size-l, 1.5rem));
    --_font-xs:   var(--user-persona-font-xs, var(--font-size-xs, 0.75rem));
    --_font-sm:   var(--user-persona-font-sm, var(--font-size-sm, 0.875rem));
    --_font-md:   var(--user-persona-font-md, var(--font-size-md, 1rem));
    --_font-2xl:  var(--user-persona-font-2xl, var(--font-size-2xl, 1.5rem));
    --_radius-m:  var(--user-persona-radius-m, var(--radius-m, 0.5rem));
    --_radius-l:  var(--user-persona-radius-l, var(--radius-l, 0.75rem));
  }

  .persona-card {
    background: var(--_bg);
    border: 1px solid var(--_border);
    border-radius: var(--_radius);
    overflow: hidden;
    box-shadow: var(--_shadow);
  }

  .persona-header {
    display: flex;
    align-items: center;
    gap: var(--_space-l);
    padding: var(--_space-l);
    background: var(--_card-bg);
    border-bottom: 1px solid var(--_border);
  }

  :host([compact]) .persona-header {
    padding: var(--_space-m);
    gap: var(--_space-m);
  }

  .avatar {
    width: var(--_avatar-size);
    height: var(--_avatar-size);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    font-weight: 600;
    color: white;
    flex-shrink: 0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  :host([compact]) .avatar {
    width: 56px;
    height: 56px;
    font-size: 20px;
  }

  .header-info {
    flex: 1;
    min-width: 0;
  }

  .persona-name {
    font-size: var(--_font-2xl);
    font-weight: 700;
    color: var(--_text);
    margin: 0 0 var(--_space-2xs) 0;
  }

  :host([compact]) .persona-name {
    font-size: 18px;
  }

  .persona-role {
    font-size: var(--_font-md);
    color: var(--_accent);
    font-weight: 500;
    margin: 0;
  }

  :host([compact]) .persona-role {
    font-size: var(--_font-sm);
  }

  .persona-meta {
    display: flex;
    gap: var(--_space-m);
    margin-top: var(--_space-xs);
    flex-wrap: wrap;
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: var(--_muted);
  }

  .meta-item svg {
    width: 14px;
    height: 14px;
    fill: currentColor;
    opacity: 0.7;
  }

  .persona-quote {
    padding: 20px var(--_space-l);
    background: var(--_card-bg);
    border-bottom: 1px solid var(--_border);
    position: relative;
  }

  :host([compact]) .persona-quote {
    padding: var(--_space-m);
  }

  .quote-mark {
    position: absolute;
    top: 12px;
    left: 16px;
    font-size: 48px;
    line-height: 1;
    color: var(--_accent);
    opacity: 0.2;
    font-family: Georgia, serif;
  }

  .quote-text {
    font-size: var(--_font-md);
    font-style: italic;
    color: var(--_text);
    line-height: 1.6;
    margin: 0;
    padding-left: var(--_space-l);
  }

  :host([compact]) .quote-text {
    font-size: var(--_font-sm);
  }

  .persona-body {
    padding: var(--_space-l);
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--_space-l);
  }

  :host([compact]) .persona-body {
    padding: var(--_space-m);
    gap: var(--_space-m);
  }

  .section {
    background: var(--_card-bg);
    border-radius: var(--_radius-l);
    padding: var(--_space-m);
  }

  .section-header {
    display: flex;
    align-items: center;
    gap: var(--_space-xs);
    margin-bottom: var(--_space-s);
  }

  .section-icon {
    width: 28px;
    height: 28px;
    border-radius: var(--_radius-m);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .section-icon svg {
    width: 16px;
    height: 16px;
    fill: white;
  }

  .section-icon.bio { background: var(--_accent); }
  .section-icon.goals { background: var(--_goals); }
  .section-icon.frustrations { background: var(--_frustrations); }
  .section-icon.behaviors { background: var(--_behaviors); }
  .section-icon.stories { background: var(--_stories); }

  /* Stories section \u2014 auto-rendered list of related user-story elements */
  .section-count {
    margin-inline-start: var(--_space-2xs);
    padding: 0.05em 0.5ch;
    border-radius: 999px;
    background: var(--color-surface-raised, oklch(95% 0 0));
    color: var(--color-text-muted);
    font-size: 0.75em;
    font-weight: 600;
  }
  .story-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: var(--_space-2xs);
  }
  .story-item {
    display: flex;
    align-items: center;
    gap: var(--_space-s);
    padding-block: var(--_space-2xs);
    border-block-end: 1px solid var(--color-border-muted, var(--color-border, #e5e7eb));
  }
  .story-item:last-child { border-block-end: none; }
  .story-item a {
    color: var(--color-interactive, currentColor);
    text-decoration: none;
    flex: 1;
  }
  .story-item a:hover { text-decoration: underline; }
  .story-meta {
    font-size: var(--_font-xs);
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 0 0.5ch;
    border: 1px solid var(--color-border-muted, var(--color-border, #e5e7eb));
    border-radius: var(--_radius-m);
  }
  .empty-stories {
    margin: 0;
    color: var(--color-text-muted);
    font-style: italic;
  }

  .section-title {
    font-size: var(--_font-sm);
    font-weight: 600;
    color: var(--_text);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .section-content {
    color: var(--_text);
    font-size: var(--_font-sm);
    line-height: 1.6;
  }

  .section-content ::slotted(ul),
  .section-content ::slotted(ol) {
    margin: 0;
    padding-left: 20px;
  }

  .section-content ::slotted(li) {
    margin-bottom: var(--_space-xs);
  }

  .section-content ::slotted(p) {
    margin: 0;
  }

  @media (max-width: 600px) {
    .persona-header {
      flex-direction: column;
      text-align: center;
    }

    .persona-meta {
      justify-content: center;
    }

    .persona-body {
      grid-template-columns: 1fr;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    * {
      transition: none !important;
    }
  }
`;

// src/lib/bundle-registry.js
var reducedMotionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
var components = /* @__PURE__ */ new Map();
function registerComponent(tag, impl, opts = {}) {
  const priority = opts.priority ?? 10;
  const meta = { impl, bundle: opts.bundle, contract: opts.contract, priority };
  const existing = components.get(tag);
  if (customElements.get(tag)) {
    if (!existing || existing.priority >= priority) {
      if (existing && existing.priority === priority && existing.impl !== impl) {
        console.warn(
          `[VB Bundle] Tag <${tag}> already registered by "${existing.bundle}" (priority ${existing.priority}). Skipping "${opts.bundle}".`
        );
      }
      return;
    }
    console.warn(
      `[VB Bundle] Tag <${tag}> defined by "${existing.bundle}" cannot be replaced (customElements.define is permanent). "${opts.bundle}" has higher priority but arrived late.`
    );
    return;
  }
  if (existing && existing.priority >= priority) {
    if (existing.priority === priority) {
      console.warn(
        `[VB Bundle] Tag <${tag}> already registered by "${existing.bundle}". Skipping "${opts.bundle}" (first wins at equal priority).`
      );
    }
    return;
  }
  components.set(tag, meta);
  customElements.define(tag, impl);
}

// src/web-components/_ux-base.js
function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function initials(name) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}
function hashColor(name) {
  let hash3 = 0;
  for (let i = 0; i < name.length; i++) {
    hash3 = name.charCodeAt(i) + ((hash3 << 5) - hash3);
  }
  const hue = (hash3 % 360 + 360) % 360;
  return `hsl(${hue}, 65%, 55%)`;
}
function lucideSvg(inner) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
}
var UX_ICONS = {
  user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  pencil: '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  alertTriangle: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  messageCircle: '<path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"/>',
  lightbulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
  wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z"/>',
  heart: '<path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/>',
  mapPin: '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
  checkCircle: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
  send: '<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/>'
};
var QUADRANT_META = {
  says: { label: "Says", icon: UX_ICONS.messageCircle, color: "#3b82f6" },
  thinks: { label: "Thinks", icon: UX_ICONS.lightbulb, color: "#8b5cf6" },
  does: { label: "Does", icon: UX_ICONS.wrench, color: "#f59e0b" },
  feels: { label: "Feels", icon: UX_ICONS.heart, color: "#ef4444" }
};
var EMOTION_META = {
  delighted: { emoji: "\u{1F604}", score: 0.95, color: "#16a34a" },
  satisfied: { emoji: "\u{1F60A}", score: 0.8, color: "#22c55e" },
  hopeful: { emoji: "\u{1F642}", score: 0.68, color: "#84cc16" },
  curious: { emoji: "\u{1F914}", score: 0.55, color: "#eab308" },
  neutral: { emoji: "\u{1F610}", score: 0.5, color: "#94a3b8" },
  uncertain: { emoji: "\u{1F615}", score: 0.4, color: "#f97316" },
  confused: { emoji: "\u{1F635}", score: 0.3, color: "#fb923c" },
  frustrated: { emoji: "\u{1F624}", score: 0.18, color: "#ef4444" },
  angry: { emoji: "\u{1F620}", score: 0.05, color: "#dc2626" }
};

// src/lib/portrait-url.js
var CDN = "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait";
var SIZES = [32, 64, 128, 256, 512];
function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = str.charCodeAt(i) + ((h << 5) - h);
  }
  return h;
}
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
function portraitUrl(seed, size = 128) {
  const h = hash(String(seed));
  const index = (h % 100 + 100) % 100;
  const sex = (h >>> 16 & 1) === 0 ? "female" : "male";
  const snapped = snapSize(size);
  return `${CDN}/${sex}/${snapped}/${index}.jpg`;
}

// src/web-components/user-persona/logic.js
function hash2(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  return h;
}
var MOCK_NAMES = [
  "Sarah Chen",
  "Marcus Johnson",
  "Aisha Patel",
  "James O'Brien",
  "Yuki Tanaka",
  "Elena Rodriguez",
  "David Kim",
  "Fatima Al-Hassan",
  "Lucas Silva",
  "Priya Sharma",
  "Noah Williams",
  "Mei Lin",
  "Carlos Mendez",
  "Amara Osei",
  "Henrik Larsson",
  "Zara Ahmed"
];
var MOCK_ROLES = [
  "Product Manager",
  "UX Designer",
  "Frontend Developer",
  "Data Analyst",
  "Marketing Lead",
  "QA Engineer",
  "DevOps Lead",
  "Content Strategist",
  "Startup Founder",
  "IT Director",
  "Customer Success Lead",
  "Research Scientist"
];
var MOCK_LOCATIONS = [
  "San Francisco, CA",
  "Austin, TX",
  "London, UK",
  "Toronto, CA",
  "Berlin, DE",
  "Tokyo, JP",
  "Sydney, AU",
  "S\xE3o Paulo, BR"
];
var MOCK_QUOTES = [
  "I need tools that help me stay organized without slowing me down.",
  "The dashboard is where I live \u2014 it has to be fast and reliable.",
  "I want to understand the data, not fight the interface.",
  "If it takes more than two clicks, I\u2019ll find another way.",
  "Collaboration shouldn\u2019t mean endless notification noise.",
  "I just want it to work the way I expect it to.",
  "Give me the big picture first, then let me drill into details.",
  "Accessibility isn\u2019t a nice-to-have \u2014 it\u2019s how I use the web."
];
var MOCK_GOALS = [
  "Streamline daily workflows",
  "Reduce context-switching",
  "Stay aligned with the team",
  "Make data-driven decisions quickly",
  "Ship features on a predictable cadence",
  "Automate repetitive tasks",
  "Improve onboarding experience",
  "Keep documentation up to date"
];
var MOCK_FRUSTRATIONS = [
  "Too many disconnected tools",
  "Slow page loads break focus",
  "Unclear ownership of tasks",
  "Settings that reset unexpectedly",
  "Notifications that bury important updates",
  "Poor mobile experience",
  "Inconsistent design across features",
  "No offline support"
];
var MOCK_BEHAVIORS = [
  "Checks dashboards every morning",
  "Prefers keyboard shortcuts over mouse",
  "Skims docs, reads deeply only when stuck",
  "Shares screenshots in Slack",
  "Batches email to twice a day",
  "Tests features in incognito first",
  "Bookmarks frequently used reports",
  "Uses dark mode exclusively"
];
var UserPersona = class extends HTMLElement {
  static get observedAttributes() {
    return ["role", "age", "location", "avatar", "compact", "src", "data-list-stories", "id"];
  }
  #slotCache = /* @__PURE__ */ new Map();
  /** @type {MutationObserver | null} */
  #storyObserver = null;
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
  /**
   * Find every user-story in the document whose `persona-id` matches
   * this persona's id. Returns elements in document order.
   * @returns {Element[]}
   */
  relatedStories() {
    if (!this.id) return [];
    const root = (
      /** @type {ParentNode} */
      this.getRootNode()
    );
    const scope = (
      /** @type {ParentNode} */
      /** @type {any} */
      root.querySelectorAll ? root : document
    );
    return Array.from(scope.querySelectorAll(`user-story[persona-id="${cssEscape(this.id)}"]`));
  }
  #cacheSlotValues() {
    for (const child of [...this.children]) {
      const slotName = child.getAttribute("slot");
      if (slotName && !this.getAttribute(slotName)) {
        this.#slotCache.set(slotName, child.textContent.trim());
      }
    }
  }
  _resolve(attr) {
    return this.getAttribute(attr) || this.#slotCache.get(attr) || "";
  }
  /* ── Data API ──────────────────────────────────── */
  /**
   * Read the persona as a plain data object. Mirrors what a consumer
   * would assign to .data — useful for diffing or persistence.
   */
  get data() {
    return {
      name: this.personaName,
      role: this.personaRole || void 0,
      age: this.age || void 0,
      location: this.location || void 0,
      avatar: this.avatar || void 0,
      quote: this.quote || void 0,
      bio: this.#slotCache.get("bio") || void 0,
      goals: this.#slotCache.get("goals") || void 0,
      frustrations: this.#slotCache.get("frustrations") || void 0,
      behaviors: this.#slotCache.get("behaviors") || void 0
    };
  }
  /**
   * Set state attributes and slotted content from a plain object in one
   * call. Idempotent for repeat calls.
   */
  set data(value) {
    if (!value || typeof value !== "object") return;
    this._applyData(value);
    if (this.shadowRoot) this.#render();
    this.dispatchEvent(new CustomEvent("user-persona:data-changed", {
      detail: { data: this.data, source: "property" },
      bubbles: true,
      composed: true
    }));
  }
  /**
   * Apply a data record to attributes + slotted children. Used by both
   * the .data setter and async _loadSrc.
   * @param {Recordstring, unknown} data
   */
  _applyData(data) {
    for (const key of ["role", "age", "location", "avatar"]) {
      if (data[key]) this.setAttribute(key, String(data[key]));
    }
    if (data.name && !this.querySelector('[slot="name"]')) {
      const el = document.createElement("h2");
      el.slot = "name";
      el.textContent = String(data.name);
      this.appendChild(el);
    }
    if (data.quote && !this.querySelector('[slot="quote"]')) {
      const el = document.createElement("p");
      el.slot = "quote";
      el.textContent = String(data.quote);
      this.appendChild(el);
    }
    for (const key of ["bio", "goals", "frustrations", "behaviors"]) {
      if (data[key]) this.#slotCache.set(key, String(data[key]));
    }
  }
  async _loadSrc(url) {
    if (!url) return;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      this._applyData(data);
      this.#render();
    } catch (err) {
      console.warn(`[user-persona] Failed to load src="${url}":`, err);
    }
  }
  connectedCallback() {
    this.#cacheSlotValues();
    if (this.hasAttribute("data-mock")) {
      this.#applyMock();
    } else if (this.hasAttribute("src")) {
      this._loadSrc(this.getAttribute("src"));
    }
    this.#render();
    this.#syncStoryObserver();
    this.setAttribute("data-upgraded", "");
    this.dispatchEvent(new CustomEvent("persona-ready", {
      bubbles: true,
      composed: true,
      detail: { name: this.personaName, role: this.personaRole }
    }));
  }
  disconnectedCallback() {
    this.removeAttribute("data-upgraded");
    this.#storyObserver?.disconnect();
    this.#storyObserver = null;
  }
  /**
   * Watch the document for added/removed/relabeled user-story elements
   * so the auto-rendered Stories section stays current. Only runs when
   * data-list-stories is present.
   */
  #syncStoryObserver() {
    if (!this.hasAttribute("data-list-stories") || !this.id) {
      this.#storyObserver?.disconnect();
      this.#storyObserver = null;
      return;
    }
    if (this.#storyObserver) return;
    this.#storyObserver = new MutationObserver(() => this.#renderStoriesSection());
    this.#storyObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["persona-id"]
    });
  }
  /**
   * Re-render only the Stories section in-place so MutationObserver
   * callbacks don't have to rebuild the whole shadow tree.
   */
  #renderStoriesSection() {
    if (!this.shadowRoot) return;
    const slot = this.shadowRoot.querySelector("[data-stories-section]");
    if (!slot) return;
    slot.outerHTML = this.#storiesSectionHtml();
  }
  /** Markup for the optional Stories section. */
  #storiesSectionHtml() {
    if (!this.hasAttribute("data-list-stories") || !this.id) return "";
    const stories = this.relatedStories();
    return `
      <section class="section" part="section-stories" data-stories-section>
        <div class="section-header">
          <div class="section-icon stories" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
          </div>
          <span class="section-title">Stories <span class="section-count">${stories.length}</span></span>
        </div>
        <div class="section-content">
          ${stories.length === 0 ? '<p class="empty-stories">No user stories reference this persona yet.</p>' : `<ul class="story-list">${stories.map((s) => {
      const id = s.id || s.getAttribute("story-id") || "";
      const action = s.querySelector('[slot="action"]')?.textContent?.trim() || s.getAttribute("action") || (s.id || "untitled");
      const priority = s.getAttribute("priority") || "";
      const status = s.getAttribute("status") || "";
      return `<li class="story-item" data-priority="${esc(priority)}" data-status="${esc(status)}">${id ? `<a href="#${esc(id)}">${esc(action)}</a>` : `<span>${esc(action)}</span>`}${priority ? `<span class="story-meta">${esc(priority)}</span>` : ""}${status ? `<span class="story-meta">${esc(status)}</span>` : ""}</li>`;
    }).join("")}</ul>`}
        </div>
      </section>
    `;
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue || !this.shadowRoot) return;
    if (name === "src" && this.isConnected) {
      this._loadSrc(newValue);
      return;
    }
    if (name === "data-list-stories" || name === "id") {
      this.#syncStoryObserver();
    }
    this.#render();
  }
  // ── Attribute getters ──────────────────────────────────────────────
  /** Read name from slotted heading or cache */
  get personaName() {
    const slotted = this.querySelector('[slot="name"]');
    return slotted?.textContent?.trim() || this.#slotCache.get("name") || "Unnamed Persona";
  }
  get personaRole() {
    return this.getAttribute("role") || "";
  }
  get age() {
    return this.getAttribute("age") || "";
  }
  get location() {
    return this.getAttribute("location") || "";
  }
  get avatar() {
    return this.getAttribute("avatar") || "";
  }
  /** Read quote from slotted element or cache */
  get quote() {
    const slotted = this.querySelector('[slot="quote"]');
    return slotted?.textContent?.trim() || this.#slotCache.get("quote") || "";
  }
  get compact() {
    return this.hasAttribute("compact");
  }
  // ── Mock data ──────────────────────────────────────────────────────
  #applyMock() {
    const seed = this.dataset.seed || this.dataset.mock || String(Date.now());
    const pick = (arr) => arr[(hash2(seed + arr.length) % arr.length + arr.length) % arr.length];
    const pickN = (arr, n) => {
      const out = [];
      for (let i = 0; i < n; i++) {
        out.push(arr[(hash2(seed + i + arr.length) % arr.length + arr.length) % arr.length]);
      }
      return [...new Set(out)];
    };
    if (!this.querySelector('[slot="name"]')) {
      const h2 = document.createElement("h2");
      h2.slot = "name";
      h2.textContent = pick(MOCK_NAMES);
      this.appendChild(h2);
    }
    if (!this.getAttribute("role")) this.setAttribute("role", pick(MOCK_ROLES));
    if (!this.getAttribute("age")) this.setAttribute("age", String(25 + (hash2(seed) % 30 + 30) % 30));
    if (!this.getAttribute("location")) this.setAttribute("location", pick(MOCK_LOCATIONS));
    if (!this.getAttribute("avatar")) {
      const name = this.querySelector('[slot="name"]')?.textContent?.trim() || "Persona";
      this.setAttribute("avatar", portraitUrl(name, 256));
    }
    if (!this.querySelector('[slot="quote"]')) {
      const p = document.createElement("p");
      p.slot = "quote";
      p.textContent = pick(MOCK_QUOTES);
      this.appendChild(p);
    }
    const injectList = (slotName, items) => {
      if (this.querySelector(`[slot="${slotName}"]`)) return;
      const ul = document.createElement("ul");
      ul.setAttribute("slot", slotName);
      for (const item of items) {
        const li = document.createElement("li");
        li.textContent = item;
        ul.appendChild(li);
      }
      this.appendChild(ul);
    };
    injectList("goals", pickN(MOCK_GOALS, 3));
    injectList("frustrations", pickN(MOCK_FRUSTRATIONS, 3));
    injectList("behaviors", pickN(MOCK_BEHAVIORS, 3));
  }
  // ── Render ─────────────────────────────────────────────────────────
  #render() {
    const name = this.personaName;
    const role = this.personaRole;
    const age = this.age;
    const loc = this.location;
    const avatarUrl = this.avatar;
    const quote = this.quote;
    const avatarBg = hashColor(name);
    const avatarStyle = avatarUrl ? `background:url(${esc(avatarUrl)}) center/cover` : `background:${avatarBg}`;
    this.shadowRoot.innerHTML = `
      <style>${styles}</style>

      <article class="persona-card" part="card" role="article"
        aria-label="User persona: ${esc(name)}">

        <header class="persona-header" part="header">
          <div class="avatar" part="avatar" style="${avatarStyle}"
            role="img" aria-label="Avatar for ${esc(name)}">
            ${!avatarUrl ? esc(initials(name)) : ""}
          </div>
          <div class="header-info">
            <div class="persona-name-wrap" part="name">
              <slot name="name"><h2 class="persona-name-fallback">${esc(name)}</h2></slot>
            </div>
            ${role ? `<p class="persona-role" part="role">${esc(role)}</p>` : ""}
            <div class="persona-meta" part="meta">
              ${age ? `
                <span class="meta-item">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
                  ${esc(age)} years old
                </span>
              ` : ""}
              ${loc ? `
                <span class="meta-item">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                  ${esc(loc)}
                </span>
              ` : ""}
            </div>
          </div>
        </header>

        ${quote || this.querySelector('[slot="quote"]') ? `
          <div class="persona-quote" part="quote">
            <span class="quote-mark" aria-hidden="true">&ldquo;</span>
            <div class="quote-text-wrap"><slot name="quote"><p class="quote-text">${esc(quote)}</p></slot></div>
          </div>
        ` : ""}

        <div class="persona-body" part="body">
          <div class="section" part="section-bio">
            <div class="section-header">
              <div class="section-icon bio" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
              </div>
              <span class="section-title">Background</span>
            </div>
            <div class="section-content">
              <slot name="bio">No background information provided.</slot>
            </div>
          </div>

          <div class="section" part="section-goals">
            <div class="section-header">
              <div class="section-icon goals" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
              </div>
              <span class="section-title">Goals</span>
            </div>
            <div class="section-content">
              <slot name="goals">No goals specified.</slot>
            </div>
          </div>

          <div class="section" part="section-frustrations">
            <div class="section-header">
              <div class="section-icon frustrations" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
              </div>
              <span class="section-title">Frustrations</span>
            </div>
            <div class="section-content">
              <slot name="frustrations">No frustrations listed.</slot>
            </div>
          </div>

          <div class="section" part="section-behaviors">
            <div class="section-header">
              <div class="section-icon behaviors" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
              </div>
              <span class="section-title">Behaviors</span>
            </div>
            <div class="section-content">
              <slot name="behaviors">No behaviors documented.</slot>
            </div>
          </div>

          ${this.#storiesSectionHtml()}
        </div>
      </article>
    `;
  }
};
function cssEscape(s) {
  return typeof CSS !== "undefined" && CSS.escape ? CSS.escape(String(s)) : String(s).replace(/["\\]/g, "\\$&");
}
registerComponent("user-persona", UserPersona);

// src/web-components/user-story/styles.js
var styles2 = `
:host {
  --_bg:        var(--user-story-bg, var(--color-surface, #ffffff));
  --_text:      var(--user-story-text, var(--color-text, #1a1a1a));
  --_muted:     var(--user-story-muted, var(--color-text-muted, #666));
  --_border:    var(--user-story-border, var(--color-border, #e0e0e0));
  --_accent:    var(--user-story-accent, var(--color-interactive, #0066cc));
  --_card-bg:   var(--user-story-card-bg, var(--color-surface-raised, #f8f9fa));
  --_highlight: var(--user-story-highlight, color-mix(in srgb, var(--_accent) 8%, transparent));
  --_radius:    var(--user-story-radius, var(--radius-l, 0.75rem));
  --_shadow:       var(--user-story-shadow, var(--shadow-sm));
  --_shadow-hover: var(--user-story-shadow-hover, var(--shadow-md));
  --_duration:     var(--user-story-duration, var(--duration-normal, 200ms));
  --_ease:         var(--user-story-ease, var(--ease-default, ease));
  --_space-xs:     var(--user-story-space-xs, var(--size-xs, 0.5rem));
  --_space-s:      var(--user-story-space-s, var(--size-s, 0.75rem));
  --_space-m:      var(--user-story-space-m, var(--size-m, 1rem));
  --_font-xs:      var(--user-story-font-xs, var(--font-size-xs, 0.75rem));
  --_font-sm:      var(--user-story-font-sm, var(--font-size-sm, 0.875rem));
  --_font-md:      var(--user-story-font-md, var(--font-size-md, 1rem));
  --_font-lg:      var(--user-story-font-lg, var(--font-size-lg, 1.125rem));
  --_font-mono:    var(--user-story-font-mono, var(--font-mono, ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, monospace));
  --_radius-s:     var(--user-story-radius-s, var(--radius-s, 0.25rem));
  --_radius-full:  var(--user-story-radius-full, var(--radius-full, 9999px));

  display: block;
  font-family: var(--user-story-font, var(--font-sans, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif));
}

.story-card {
  background: var(--_bg);
  border: 1px solid var(--_border);
  border-radius: var(--_radius);
  overflow: hidden;
  box-shadow: var(--_shadow);
  transition: box-shadow var(--_duration) var(--_ease), transform var(--_duration) var(--_ease);
}

.story-card:hover {
  box-shadow: var(--_shadow-hover);
}

.story-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--_space-s) var(--_space-m);
  background: var(--_card-bg);
  border-bottom: 1px solid var(--_border);
  gap: var(--_space-s);
  flex-wrap: wrap;
}

.story-meta {
  display: flex;
  align-items: center;
  gap: var(--_space-xs);
  flex-wrap: wrap;
}

.story-id {
  font-size: var(--_font-xs);
  font-weight: 600;
  color: var(--_muted);
  font-family: var(--_font-mono);
}

.epic-badge {
  font-size: 11px;
  padding: 3px 8px;
  border-radius: var(--_radius-s);
  background: var(--_highlight);
  color: var(--_accent);
  font-weight: 500;
}

.story-badges {
  display: flex;
  align-items: center;
  gap: var(--_space-xs);
}

.priority-badge,
.status-badge {
  font-size: 11px;
  padding: 4px 10px;
  border-radius: var(--_radius-full);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.points-badge {
  width: 28px;
  height: 28px;
  border-radius: var(--_radius-full);
  background: var(--_accent);
  color: white;
  font-size: var(--_font-xs);
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.story-body {
  padding: 20px;
}

:host([compact]) .story-body {
  padding: var(--_space-m);
}

.story-statement {
  font-size: var(--_font-lg);
  line-height: 1.6;
  color: var(--_text);
  margin: 0;
}

:host([compact]) .story-statement {
  font-size: 15px;
}

.keyword {
  font-weight: 600;
  color: var(--_accent);
}

.persona-text {
  background: var(--_highlight);
  padding: 2px 6px;
  border-radius: var(--_radius-s);
  font-weight: 500;
}

.persona-text--link {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  color: var(--_accent);
  text-decoration: none;
}

.persona-text--link svg {
  width: 13px;
  height: 13px;
  flex-shrink: 0;
}

.persona-text--link:hover {
  text-decoration: underline;
}

.action-text {
  font-weight: 500;
}

.benefit-text {
  font-style: italic;
  color: var(--_muted);
}

.story-sections {
  border-top: 1px solid var(--_border);
}

.section {
  padding: 16px 20px;
  border-bottom: 1px solid var(--_border);
}

.section:last-child {
  border-bottom: none;
}

.section-header {
  display: flex;
  align-items: center;
  gap: var(--_space-xs);
  margin-bottom: var(--_space-s);
}

.section-icon {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--_accent);
}

.section-icon svg {
  width: 14px;
  height: 14px;
  fill: white;
}

/* Semantic section-icon colors \u2014 driven by VB theme tokens so they shift
   with the active theme rather than fighting it. */
.section-icon.acceptance { background: var(--color-success, #22c55e); }
.section-icon.notes      { background: var(--color-warning, #f59e0b); }
.section-icon.tasks      { background: var(--color-accent,  #8b5cf6); }

.section-title {
  font-size: var(--_font-xs);
  font-weight: 600;
  color: var(--_muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.section-content {
  color: var(--_text);
  font-size: var(--_font-sm);
  line-height: 1.6;
}

/* Slotted content styling */
.section-content ::slotted(ul),
.section-content ::slotted(ol) {
  margin: 0;
  padding-left: 20px;
}

.section-content ::slotted(li) {
  margin-bottom: 6px;
}

.section-content ::slotted(p) {
  margin: 0;
}

/* Empty-slot fallback */
.slot-fallback {
  color: var(--_muted);
  font-style: italic;
}

@media (max-width: 480px) {
  .story-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .story-badges {
    width: 100%;
    justify-content: flex-start;
  }
}

@media (prefers-reduced-motion: reduce) {
  .story-card {
    transition: none;
  }
}

/* \u2500\u2500 Slotted title (minimal mode heading) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.story-title-wrap {
  margin: 0;
}

::slotted([slot="title"]) {
  font-size: var(--_font-sm) !important;
  font-weight: 600 !important;
  color: var(--_text) !important;
  margin: 0 !important;
}

.story-title-fallback {
  font-size: var(--_font-sm);
  font-weight: 600;
  color: var(--_text);
}

/* Minimal detail level */
:host([detail="minimal"]) .story-card {
  padding: var(--_space-xs);
}

:host([detail="minimal"]) .story-header {
  display: none;
}

:host([detail="minimal"]) .story-sections {
  display: none;
}

:host([detail="minimal"]) .story-body {
  padding: var(--_space-xs) var(--_space-s);
}

:host([detail="minimal"]) .story-card {
  cursor: pointer;
}

:host([detail="minimal"]) .story-card:hover {
  box-shadow: var(--_shadow-hover);
}

:host([detail="minimal"]) .story-card:focus-visible {
  outline: 2px solid var(--_accent);
  outline-offset: 2px;
}

:host([detail="minimal"]) .story-id {
  display: block;
  margin-bottom: var(--_space-2xs);
}

:host([detail="minimal"]) .benefit-text {
  display: none;
}

/* Compact detail level \u2014 hide empty sections */
:host([detail="compact"]) .section[data-empty] {
  display: none;
}

:host([detail="compact"]) .slot-fallback {
  display: none;
}
`;

// src/web-components/user-story/logic.js
var UserStory = class _UserStory extends HTMLElement {
  static get observedAttributes() {
    return [
      "persona-id",
      "priority",
      "points",
      "status",
      "epic",
      "story-id",
      "compact",
      "detail",
      "src"
    ];
  }
  static PRIORITIES = {
    critical: { label: "Critical", color: "#dc2626", bg: "rgba(220, 38, 38, 0.1)" },
    high: { label: "High", color: "#ea580c", bg: "rgba(234, 88, 12, 0.1)" },
    medium: { label: "Medium", color: "#ca8a04", bg: "rgba(202, 138, 4, 0.1)" },
    low: { label: "Low", color: "#16a34a", bg: "rgba(22, 163, 74, 0.1)" }
  };
  static STATUSES = {
    backlog: { label: "Backlog", color: "#6b7280", bg: "rgba(107, 114, 128, 0.1)" },
    "to-do": { label: "To Do", color: "#3b82f6", bg: "rgba(59, 130, 246, 0.1)" },
    "in-progress": { label: "In Progress", color: "#8b5cf6", bg: "rgba(139, 92, 246, 0.1)" },
    review: { label: "Review", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.1)" },
    done: { label: "Done", color: "#22c55e", bg: "rgba(34, 197, 94, 0.1)" }
  };
  #slotCache = /* @__PURE__ */ new Map();
  /** @type {MutationObserver | null} */
  #personaObserver = null;
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
  #cacheSlotValues() {
    for (const child of [...this.children]) {
      const slotName = child.getAttribute("slot");
      if (slotName) {
        this.#slotCache.set(slotName, child.textContent.trim());
      }
    }
  }
  _resolve(attr) {
    return this.getAttribute(attr) || this.#slotCache.get(attr) || "";
  }
  /* ── Data API ──────────────────────────────────── */
  /**
   * Read the user story as a plain data object. Mirrors what a consumer
   * would assign to .data — useful for diffing, persistence, or echo.
   */
  get data() {
    return {
      storyId: this.storyId || void 0,
      personaId: this.personaId || void 0,
      priority: this.priority,
      status: this.status,
      points: this.points || void 0,
      epic: this.epic || void 0,
      detail: this.getAttribute("detail") || void 0,
      persona: this.persona || void 0,
      action: this.action || void 0,
      benefit: this.benefit || void 0,
      title: this.storyTitle || void 0
    };
  }
  /**
   * Set state attributes and slotted content from a plain object in one call.
   * Replaces multiple setAttribute calls + manual slotted-child creation.
   * Idempotent for repeat calls.
   */
  set data(value) {
    if (!value || typeof value !== "object") return;
    this._applyData(value);
    this.#cacheSlotValues();
    if (this.shadowRoot) this.#render();
    this.dispatchEvent(new CustomEvent("user-story:data-changed", {
      detail: { data: this.data, source: "property" },
      bubbles: true,
      composed: true
    }));
  }
  /**
   * Apply a data record to attributes + slotted children. Used by both the
   * .data setter and async _loadSrc. No render or cache update — caller decides.
   * @param {Recordstring, unknown} data
   */
  _applyData(data) {
    for (const [jsonKey, attr] of [
      ["storyId", "story-id"],
      ["personaId", "persona-id"],
      ["priority", "priority"],
      ["status", "status"],
      ["points", "points"],
      ["epic", "epic"],
      ["detail", "detail"]
    ]) {
      if (data[jsonKey] != null) this.setAttribute(attr, String(data[jsonKey]));
    }
    if (data.persona && !this.querySelector('[slot="persona"]')) {
      const el = document.createElement("span");
      el.slot = "persona";
      el.textContent = String(data.persona);
      this.appendChild(el);
    }
    if (data.action && !this.querySelector('[slot="action"]')) {
      const el = document.createElement("span");
      el.slot = "action";
      el.textContent = String(data.action);
      this.appendChild(el);
    }
    if (data.benefit && !this.querySelector('[slot="benefit"]')) {
      const el = document.createElement("span");
      el.slot = "benefit";
      el.textContent = String(data.benefit);
      this.appendChild(el);
    }
    if (data.title && !this.querySelector('[slot="title"]')) {
      const el = document.createElement("h3");
      el.slot = "title";
      el.textContent = String(data.title);
      this.appendChild(el);
    }
    for (const key of ["acceptance-criteria", "tasks", "notes"]) {
      const jsonKey = key === "acceptance-criteria" ? "acceptanceCriteria" : key;
      if (data[jsonKey] && !this.querySelector(`[slot="${key}"]`)) {
        if (Array.isArray(data[jsonKey])) {
          const ul = document.createElement("ul");
          ul.slot = key;
          for (const item of data[jsonKey]) {
            const li = document.createElement("li");
            li.textContent = String(item);
            ul.appendChild(li);
          }
          this.appendChild(ul);
        } else {
          const p = document.createElement("p");
          p.slot = key;
          p.textContent = String(data[jsonKey]);
          this.appendChild(p);
        }
      }
    }
  }
  async _loadSrc(url) {
    if (!url) return;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      this._applyData(data);
      this.#cacheSlotValues();
      this.#render();
    } catch (err) {
      console.warn(`[user-story] Failed to load src="${url}":`, err);
    }
  }
  connectedCallback() {
    this.#cacheSlotValues();
    if (this.storyId && !this.id) this.id = this.storyId;
    if (this.hasAttribute("src")) {
      this._loadSrc(this.getAttribute("src"));
    }
    this.#render();
    this.#observeLinkedPersona();
    this.setAttribute("data-upgraded", "");
  }
  disconnectedCallback() {
    this.removeAttribute("data-upgraded");
    this.#personaObserver?.disconnect();
    this.#personaObserver = null;
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue && this.shadowRoot) {
      if (name === "src" && this.isConnected) {
        this._loadSrc(newValue);
      } else {
        this.#render();
        if (name === "persona-id") this.#observeLinkedPersona();
      }
    }
  }
  /**
   * Keep the "As a…" text in sync when the linked persona's role is edited.
   * Only observes when persona-id resolves and the author has not supplied an
   * explicit persona slot (an explicit slot always wins, so nothing to track).
   */
  #observeLinkedPersona() {
    this.#personaObserver?.disconnect();
    this.#personaObserver = null;
    if (!this.personaId || this.#explicitPersona()) return;
    const root = (
      /** @type {Document | ShadowRoot} */
      this.getRootNode()
    );
    const scope = root && typeof root.getElementById === "function" ? root : document;
    const persona = scope.getElementById(this.personaId);
    if (!persona || persona.tagName !== "USER-PERSONA") return;
    this.#personaObserver = new MutationObserver(() => this.#render());
    this.#personaObserver.observe(persona, { attributes: true, attributeFilter: ["role"] });
  }
  // ── Getters ────────────────────────────────────────────────────────
  /**
   * Read persona from slotted element or cache. When neither is authored but
   * persona-id links to a user-persona on the page, fall back to that
   * persona's role ("As a Product Manager…") rather than the generic "user".
   */
  get persona() {
    const explicit = this.#explicitPersona();
    return explicit || this.#linkedPersonaRole() || "user";
  }
  get personaId() {
    return this.getAttribute("persona-id") || "";
  }
  /** Persona text the author supplied directly via slot or .data (no link resolution). */
  #explicitPersona() {
    const slotted = this.querySelector('[slot="persona"]');
    return slotted?.textContent?.trim() || this.#slotCache.get("persona") || "";
  }
  /**
   * Resolve the role of the user-persona referenced by persona-id, if one
   * exists in the same tree. Used as the "As a…" fallback so a linked story
   * reads "As a Product Manager" instead of "As a user". Returns '' when there
   * is no persona-id, no matching persona, or the persona has no role.
   */
  #linkedPersonaRole() {
    if (!this.personaId) return "";
    const root = (
      /** @type {Document | ShadowRoot} */
      this.getRootNode()
    );
    const scope = root && typeof root.getElementById === "function" ? root : document;
    const persona = scope.getElementById(this.personaId);
    if (!persona || persona.tagName !== "USER-PERSONA") return "";
    return persona.getAttribute("role")?.trim() || "";
  }
  /**
   * Indefinite article ("a" / "an") for the persona role so the statement
   * reads naturally — "As an Analyst", "As a Product Manager". Simple
   * vowel-start heuristic (excludes "u", which usually sounds like "you":
   * "a user"). Falls back to "a".
   */
  #personaArticle() {
    return /^[aeio]/i.test(this.persona.trim()) ? "an" : "a";
  }
  /** Read action from slotted element or cache */
  get action() {
    const slotted = this.querySelector('[slot="action"]');
    return slotted?.textContent?.trim() || this.#slotCache.get("action") || "";
  }
  /** Read benefit from slotted element or cache */
  get benefit() {
    const slotted = this.querySelector('[slot="benefit"]');
    return slotted?.textContent?.trim() || this.#slotCache.get("benefit") || "";
  }
  get priority() {
    return this.getAttribute("priority") || "medium";
  }
  get points() {
    return this.getAttribute("points") || "";
  }
  get status() {
    return this.getAttribute("status") || "backlog";
  }
  get epic() {
    return this.getAttribute("epic") || "";
  }
  get storyId() {
    return this.getAttribute("story-id") || "";
  }
  /** Read title from slotted heading or cache */
  get storyTitle() {
    const slotted = this.querySelector('[slot="title"]');
    return slotted?.textContent?.trim() || this.#slotCache.get("title") || "";
  }
  /** Label for minimal mode: title if set, otherwise truncated action */
  get _minimalLabel() {
    if (this.storyTitle) return this.storyTitle;
    const action = this.action;
    return action.length > 40 ? action.slice(0, 40) + "\u2026" : action;
  }
  get compact() {
    return this.hasAttribute("compact");
  }
  get _detailLevel() {
    if (this.getAttribute("detail")) return this.getAttribute("detail");
    if (this.hasAttribute("compact")) return "compact";
    return "full";
  }
  // ── Public API ───────────────────────────────────────────────────
  updateStatus(newStatus) {
    if (_UserStory.STATUSES[newStatus]) {
      this.setAttribute("status", newStatus);
      this.dispatchEvent(new CustomEvent("status-changed", {
        detail: { status: newStatus, storyId: this.storyId },
        bubbles: true,
        composed: true
      }));
    }
  }
  updatePriority(newPriority) {
    if (_UserStory.PRIORITIES[newPriority]) {
      this.setAttribute("priority", newPriority);
      this.dispatchEvent(new CustomEvent("priority-changed", {
        detail: { priority: newPriority, storyId: this.storyId },
        bubbles: true,
        composed: true
      }));
    }
  }
  showDetail() {
    const dialogId = `story-dialog-${this.storyId || this.id || "detail"}`;
    let dialog = (
      /** @type {HTMLDialogElement | null} */
      document.getElementById(dialogId)
    );
    if (!dialog) {
      dialog = document.createElement("dialog");
      dialog.id = dialogId;
      dialog.setAttribute("data-size", "l");
      document.body.appendChild(dialog);
    }
    const form = document.createElement("form");
    form.method = "dialog";
    const header = document.createElement("header");
    const title = document.createElement("h3");
    title.textContent = this.storyTitle || this.storyId || "Story Detail";
    const closeBtn = document.createElement("button");
    closeBtn.type = "submit";
    closeBtn.setAttribute("aria-label", "Close");
    closeBtn.textContent = "\xD7";
    header.appendChild(title);
    header.appendChild(closeBtn);
    const section = document.createElement("section");
    const full = document.createElement("user-story");
    for (const attr of this.getAttributeNames()) {
      if (attr === "detail" || attr === "compact" || attr === "data-upgraded" || attr === "draggable" || attr === "data-id" || attr === "data-quadrant") continue;
      full.setAttribute(attr, this.getAttribute(attr) ?? "");
    }
    const hasSlottedContent = [...this.children].some((c) => c.getAttribute("slot") && c.tagName !== "DIALOG");
    full.setAttribute("detail", hasSlottedContent ? "full" : "compact");
    full.removeAttribute("id");
    for (const child of [...this.children]) {
      if (child.tagName === "DIALOG") continue;
      full.appendChild(child.cloneNode(true));
    }
    section.appendChild(full);
    form.appendChild(header);
    form.appendChild(section);
    dialog.innerHTML = "";
    dialog.appendChild(form);
    dialog.addEventListener("close", () => {
      dialog.innerHTML = "";
    }, { once: true });
    dialog.showModal();
  }
  // ── Private ──────────────────────────────────────────────────────
  #render() {
    const priorityInfo = _UserStory.PRIORITIES[this.priority] || _UserStory.PRIORITIES.medium;
    const statusInfo = _UserStory.STATUSES[this.status] || _UserStory.STATUSES.backlog;
    const level = this._detailLevel;
    const ariaLabel = this.storyId ? `User story: ${esc(this.storyId)}` : "User story";
    if (!this.shadowRoot) return;
    if (level === "minimal") {
      this.shadowRoot.innerHTML = `
        <style>${styles2}</style>
        <article class="story-card story-card--minimal" role="article" aria-label="${ariaLabel}"
          tabindex="0">
          <div class="story-body">
            ${this.storyId ? `<span class="story-id">${esc(this.storyId)}</span>` : ""}
            <div class="story-title-wrap">
              <slot name="title"><span class="story-title-fallback">${esc(this._minimalLabel || "[describe the action]")}</span></slot>
            </div>
          </div>
        </article>
      `;
      const card = this.shadowRoot.querySelector(".story-card--minimal");
      if (!card) return;
      card.addEventListener("click", () => this.showDetail());
      card.addEventListener("keydown", (e) => {
        const ke = (
          /** @type {KeyboardEvent} */
          e
        );
        if (ke.key === "Enter" || ke.key === " ") {
          ke.preventDefault();
          this.showDetail();
        }
      });
    } else {
      this.shadowRoot.innerHTML = `
        <style>${styles2}</style>

        <article class="story-card story-card--${level}" part="card" role="article" aria-label="${ariaLabel}">
          <header class="story-header" part="header">
            <div class="story-meta">
              ${this.storyId ? `<span class="story-id" part="id">${esc(this.storyId)}</span>` : ""}
              ${this.epic ? `<span class="epic-badge" part="epic">${esc(this.epic)}</span>` : ""}
            </div>
            <div class="story-badges">
              <span class="priority-badge" part="priority"
                style="color: ${priorityInfo.color}; background: ${priorityInfo.bg};"
              >${esc(priorityInfo.label)}</span>
              <span class="status-badge" part="status"
                style="color: ${statusInfo.color}; background: ${statusInfo.bg};"
              >${esc(statusInfo.label)}</span>
              ${this.points ? `<span class="points-badge" part="points">${esc(this.points)}</span>` : ""}
            </div>
          </header>

          <div class="story-body" part="body">
            <p class="story-statement" part="statement">
              <span class="keyword">As ${this.#personaArticle()}</span>
              ${this.personaId ? `<a class="persona-text persona-text--link" href="#${esc(this.personaId)}">${lucideSvg(UX_ICONS.user)} <slot name="persona"><span>${esc(this.#linkedPersonaRole() || "user")}</span></slot></a>` : `<span class="persona-text"><slot name="persona"><span>user</span></slot></span>`},
              <span class="keyword">I want</span>
              <span class="action-text"><slot name="action"><span>[describe the action]</span></slot></span>${this.benefit || this.querySelector('[slot="benefit"]') ? `
              <span class="keyword">so that</span>
              <span class="benefit-text"><slot name="benefit"></slot></span>` : ""}
            </p>
          </div>

          <div class="story-sections" part="sections">
            <div class="section" part="section">
              <div class="section-header">
                <div class="section-icon acceptance">
                  <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                </div>
                <span class="section-title">Acceptance Criteria</span>
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
                <span class="section-title">Tasks</span>
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
                <span class="section-title">Notes</span>
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
      if (level === "compact") {
        const sections = this.shadowRoot.querySelectorAll(".section");
        sections.forEach((section) => {
          const slot = section.querySelector("slot");
          if (slot && slot.assignedNodes().length === 0) {
            section.setAttribute("data-empty", "");
          }
        });
      }
    }
    this.dispatchEvent(new CustomEvent("story-ready", {
      detail: {
        id: this.storyId,
        persona: this.persona,
        action: this.action,
        benefit: this.benefit,
        priority: this.priority,
        status: this.status,
        points: this.points
      },
      bubbles: true,
      composed: true
    }));
  }
};
registerComponent("user-story", UserStory);

// src/web-components/user-journey/styles.js
var styles3 = `
  :host {
    display: block;
    font-family: var(--_font-sans);
    line-height: 1.6;
    color: var(--_text);
    container-type: inline-size;

    --_bg:        var(--user-journey-bg, var(--color-surface-raised, #f8f9fa));
    --_card:      var(--user-journey-card, var(--color-surface, #ffffff));
    --_border:    var(--user-journey-border, var(--color-border, #e0e0e0));
    --_muted:     var(--user-journey-muted, var(--color-text-muted, #666666));
    --_text:      var(--user-journey-text, var(--color-text, #1a1a1a));
    --_inverted:  var(--user-journey-text-inverted, var(--color-text-inverted, #ffffff));
    --_primary:   var(--user-journey-primary, var(--color-primary, var(--color-interactive, #6366f1)));
    --_accent:    var(--user-journey-accent, var(--color-accent, #8b5cf6));
    --_link:      var(--user-journey-link, var(--color-interactive, var(--color-primary, #6366f1)));
    --_curve-stroke: var(--user-journey-curve-stroke, var(--_primary));
    --_radius:    var(--user-journey-radius, var(--radius-l, 0.75rem));

    --_font-sans: var(--user-journey-font, var(--font-sans, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif));
    --_font-mono: var(--user-journey-font-mono, var(--font-mono, ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, monospace));
    --_font-xs:   var(--user-journey-font-xs, var(--font-size-xs, 0.75rem));
    --_font-sm:   var(--user-journey-font-sm, var(--font-size-sm, 0.875rem));
    --_font-md:   var(--user-journey-font-md, var(--font-size-md, 1rem));
    --_font-xl:   var(--user-journey-font-xl, var(--font-size-xl, 1.25rem));
    --_space-2xs: var(--user-journey-space-2xs, var(--size-2xs, 0.25rem));
    --_space-xs:  var(--user-journey-space-xs, var(--size-xs, 0.5rem));
    --_space-s:   var(--user-journey-space-s, var(--size-s, 0.75rem));
    --_space-m:   var(--user-journey-space-m, var(--size-m, 1rem));
    --_space-l:   var(--user-journey-space-l, var(--size-l, 1.5rem));

    /* Semantic tints derived from theme tokens via color-mix.
       Subtle backgrounds (10\u201314%) for body cells, header at 22%. */
    --_tint-pos:  color-mix(in oklch, var(--color-success, #22c55e) 14%, var(--_card));
    --_tint-neu:  color-mix(in oklch, var(--color-warning, #f59e0b) 12%, var(--_card));
    --_tint-neg:  color-mix(in oklch, var(--color-error,   #ef4444) 12%, var(--_card));
    --_tint-row-pain: color-mix(in oklch, var(--color-error,   #ef4444) 8%,  var(--_card));
    --_tint-row-opp:  color-mix(in oklch, var(--color-success, #22c55e) 8%,  var(--_card));
    --_chip-type-bg:  color-mix(in oklch, var(--_accent)  18%, var(--_card));
    --_chip-type-fg:  var(--color-accent-text, var(--_accent));
    --_chip-story-bg: color-mix(in oklch, var(--_link)    18%, var(--_card));
    --_chip-story-bg-hover: color-mix(in oklch, var(--_link) 28%, var(--_card));
    --_chip-story-fg: var(--_link);
    --_grid-head-bg:  color-mix(in oklch, var(--_primary) 85%, var(--color-text, #000));
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; }

  /* Card */
  .journey {
    background: var(--_card);
    border: 1px solid var(--_border);
    border-radius: var(--_radius);
    overflow: hidden;
  }

  /* Header */
  .journey__header {
    padding: 20px 24px 16px 28px;
    border-block-end: 1px solid var(--_border);
    position: relative;
  }

  /* Left accent bar */
  .journey__header::before {
    content: '';
    position: absolute;
    inset-block: 0;
    inset-inline-start: 0;
    width: 4px;
    background: linear-gradient(135deg, var(--_primary), var(--_accent));
  }

  .journey__header-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--_space-s);
    flex-wrap: wrap;
    margin-block-end: var(--_space-xs);
  }

  .journey__chips {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
  }

  /* Chips */
  .chip {
    display: inline-block;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.05em;
    padding: 2px 9px;
    border-radius: 99px;
    text-decoration: none;
    line-height: 1.6;
  }

  .chip--type {
    color: var(--_chip-type-fg);
    background: var(--_chip-type-bg);
  }

  .chip--story {
    color: var(--_chip-story-fg);
    background: var(--_chip-story-bg);
  }

  .chip--story:hover { background: var(--_chip-story-bg-hover); }

  /* Persona ref */
  .persona-ref {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 13px;
    font-weight: 600;
    color: var(--_muted);
    text-decoration: none;
    white-space: nowrap;
  }
  .persona-ref svg { width: 14px; height: 14px; flex-shrink: 0; }
  a.persona-ref:hover { color: var(--_link); text-decoration: underline; }

  /* Title & summary (slotted content) */
  .journey__title-wrap {
    margin-block-end: var(--_space-2xs);
  }

  .journey__title {
    font-size: var(--_font-xl);
    font-weight: 700;
    color: var(--_text);
    margin: 0;
  }

  ::slotted([slot="title"]) {
    font-size: var(--_font-xl) !important;
    font-weight: 700 !important;
    color: var(--_text) !important;
    margin: 0 !important;
  }

  .journey--compact .journey__title,
  .journey--compact ::slotted([slot="title"]) { font-size: var(--_font-md) !important; }

  .journey__summary-wrap {
    max-width: 72ch;
  }

  ::slotted([slot="summary"]) {
    font-size: var(--_font-sm) !important;
    color: var(--_muted) !important;
    margin: 0 !important;
  }

  /* Emotion curve */
  .journey__curve {
    background: var(--_bg);
    border-block-end: 1px solid var(--_border);
    overflow: hidden;
  }

  .curve-svg {
    display: block;
    width: 100%;
    height: 80px;
  }

  .journey--compact .curve-svg { height: 54px; }

  .zone { opacity: 0.55; }
  .zone--pos { fill: var(--_tint-pos); }
  .zone--neu { fill: var(--_tint-neu); }
  .zone--neg { fill: var(--_tint-neg); }

  .vline      { stroke: var(--_border); stroke-width: 1; stroke-dasharray: 3 4; }
  .curve-line { stroke: var(--_curve-stroke); stroke-width: 2.5; stroke-linecap: round; }
  .dot        { stroke: var(--_card); stroke-width: 2.5; }

  /* Grid */
  .journey__grid-wrap { overflow-x: auto; }

  .journey__grid {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }

  /* Head row */
  .journey__grid thead tr {
    background: var(--_grid-head-bg);
    color: var(--_inverted);
  }

  .corner {
    padding: 10px 12px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    opacity: 0.55;
    text-align: left;
    white-space: nowrap;
    min-width: 100px;
    position: sticky;
    left: 0;
    background: var(--_grid-head-bg);
    z-index: 2;
  }

  .phase-head {
    padding: 10px 14px;
    text-align: left;
    vertical-align: top;
    border-inline-start: 1px solid color-mix(in oklch, var(--_inverted) 12%, transparent);
    min-width: 160px;
    position: relative;
  }

  /* Emotion-coloured top accent per phase */
  .phase-head::before {
    content: '';
    position: absolute;
    inset-block-start: 0;
    inset-inline: 0;
    height: 3px;
    background: var(--ec, var(--_primary));
  }

  .ph-num   { display: block; font-size: 10px; opacity: 0.5; margin-block-end: 2px; }
  .ph-name  { display: block; font-size: var(--_font-sm); font-weight: 700; line-height: 1.2; }
  .ph-emoji { display: block; font-size: var(--_font-xl); line-height: 1; margin-block: 4px 2px; }

  .ph-stories { display: flex; flex-wrap: wrap; gap: var(--_space-2xs); margin-block-start: var(--_space-2xs); }

  /* Body rows */
  .grid-row th,
  .grid-row td {
    padding: 10px 12px;
    border-block-end: 1px solid var(--_border);
    border-inline-start: 1px solid var(--_border);
    vertical-align: top;
  }

  .grid-row th:first-child { border-inline-start: none; }

  .row-label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: var(--_muted);
    white-space: nowrap;
    background: var(--_bg);
    text-align: left;
    position: sticky;
    left: 0;
    z-index: 1;
  }

  .data-cell          { font-size: 13px; line-height: 1.45; }
  .data-cell p        { margin-block: 0 4px; }
  .data-cell p:last-child { margin-block-end: 0; }
  .data-cell--empty   { color: var(--_muted); opacity: 0.35; }

  /* Semantic row tints */
  .grid-row--painpoints    .data-cell { background: var(--_tint-row-pain); }
  .grid-row--opportunities .data-cell { background: var(--_tint-row-opp); }

  /* Compact */
  .journey--compact .phase-head { min-width: 120px; padding: 8px 10px; }
  .journey--compact .data-cell  { font-size: 12px; padding: 7px 10px; }
  .journey--compact .corner     { min-width: 80px; }

  /* Utility */
  .state-msg           { padding: var(--_space-l); font-size: var(--_font-sm); color: var(--_muted); font-style: italic; }
  .state-msg--error    { color: var(--color-error-text, var(--color-error, #dc2626)); }
  .journey__placeholder { padding: 20px 24px; font-size: var(--_font-sm); color: var(--_muted); }
  code { font-family: var(--_font-mono); font-size: 0.88em; }

  /* Responsive */
  @container (max-width: 500px) {
    .journey__header   { padding: 14px 16px 12px 20px; }
    .journey__title    { font-size: 17px; }
    .corner, .row-label { min-width: 72px; font-size: 9px; }
    .phase-head        { min-width: 110px; padding: 8px 10px; }
    .data-cell         { font-size: 12px; padding: 8px 10px; }
  }

  @media print {
    .journey__grid-wrap { overflow: visible; }
    .row-label, .corner { position: relative; }
  }
`;

// src/lib/vb-view-transition.js
var counter = 0;
function viewTransitionSwap(host, swap, prefix = "vb-vt") {
  if (!host?.isConnected || typeof document === "undefined" || !("startViewTransition" in document) || matchMedia("(prefers-reduced-motion: reduce)").matches) {
    swap();
    return null;
  }
  const name = `${prefix}-${++counter}`;
  host.style.viewTransitionName = name;
  const tx = document.startViewTransition(swap);
  tx.finished.finally(() => {
    if (host.style.viewTransitionName === name) {
      host.style.viewTransitionName = "";
    }
  });
  return tx;
}

// src/web-components/user-journey/logic.js
var ROWS = [
  { key: "actions", label: "Actions" },
  { key: "thoughts", label: "Thoughts" },
  { key: "touchpoints", label: "Touchpoints" },
  { key: "painPoints", label: "Pain Points" },
  { key: "opportunities", label: "Opportunities" }
];
var UserJourney = class extends HTMLElement {
  static get observedAttributes() {
    return ["src", "persona", "persona-id", "story-ids", "compact"];
  }
  #slotCache = /* @__PURE__ */ new Map();
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.__phases = null;
  }
  /** @returns {Array|null} */
  get phases() {
    return this.__phases;
  }
  /**
   * Replace the phase list. Idempotent (skip on same array reference).
   * Emits user-journey:phases-changed { phases, source: 'property' }.
   * @param {Array|null} data
   */
  set phases(data) {
    if (this.__phases === data) return;
    this.__phases = data;
    if (this.isConnected) this._render();
    this.dispatchEvent(new CustomEvent("user-journey:phases-changed", {
      detail: { phases: data, source: "property" },
      bubbles: true,
      composed: true
    }));
  }
  /**
   * Read the journey as a plain data object combining state, slotted
   * content, and the phase array. Mirrors what a consumer would assign
   * to .data.
   */
  get data() {
    return {
      persona: this.getAttribute("persona") || void 0,
      personaId: this.getAttribute("persona-id") || void 0,
      title: this.querySelector('[slot="title"]')?.textContent?.trim() || void 0,
      summary: this.querySelector('[slot="summary"]')?.textContent?.trim() || void 0,
      phases: this.__phases || void 0
    };
  }
  /**
   * Set state attributes, slotted content, and phases in one assignment.
   * Emits user-journey:data-changed { data, source: 'property' }.
   */
  set data(value) {
    if (!value || typeof value !== "object") return;
    if (value.persona) this.setAttribute("persona", String(value.persona));
    if (value.personaId) this.setAttribute("persona-id", String(value.personaId));
    if (value.title && !this.querySelector('[slot="title"]')) {
      const el = document.createElement("h2");
      el.slot = "title";
      el.textContent = value.title;
      this.appendChild(el);
    }
    if (value.summary && !this.querySelector('[slot="summary"]')) {
      const el = document.createElement("p");
      el.slot = "summary";
      el.textContent = value.summary;
      this.appendChild(el);
    }
    if (value.phases != null) this.__phases = value.phases;
    if (this.isConnected) this._render();
    this.dispatchEvent(new CustomEvent("user-journey:data-changed", {
      detail: { data: this.data, source: "property" },
      bubbles: true,
      composed: true
    }));
  }
  /* ── Slot caching ──────────────────────────── */
  #cacheSlotValues() {
    for (const child of this.children) {
      const slot = child.getAttribute("slot");
      if (slot) this.#slotCache.set(slot, child.textContent.trim());
    }
  }
  _resolve(attr) {
    return this.getAttribute(attr) || this.#slotCache.get(attr) || "";
  }
  /* ── Lifecycle ─────────────────────────────── */
  connectedCallback() {
    this.#cacheSlotValues();
    this.setAttribute("data-upgraded", "");
    if (this.hasAttribute("src")) {
      this._loadSrc(this.getAttribute("src"));
    } else {
      this._render();
    }
  }
  disconnectedCallback() {
    this.removeAttribute("data-upgraded");
  }
  attributeChangedCallback(name) {
    if (!this.isConnected) return;
    if (name === "src") {
      this._loadSrc(this.getAttribute("src"));
    } else {
      this._render();
    }
  }
  /* ── JSON loading ──────────────────────────── */
  async _loadSrc(src) {
    if (!src) return;
    const root = (
      /** @type {ShadowRoot} */
      this.shadowRoot
    );
    root.innerHTML = `<style>${styles3}</style><div class="state-msg">Loading\u2026</div>`;
    try {
      const res = await fetch(src);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.persona) this.setAttribute("persona", data.persona);
      if (data.personaId) this.setAttribute("persona-id", data.personaId);
      if (data.title && !this.querySelector('[slot="title"]')) {
        const el = document.createElement("h2");
        el.slot = "title";
        el.textContent = data.title;
        this.appendChild(el);
      }
      if (data.summary && !this.querySelector('[slot="summary"]')) {
        const el = document.createElement("p");
        el.slot = "summary";
        el.textContent = data.summary;
        this.appendChild(el);
      }
      this.__phases = data.phases || [];
      this._render();
    } catch (err) {
      root.innerHTML = `<style>${styles3}</style><div class="state-msg state-msg--error">Could not load journey: ${esc(
        /** @type {Error} */
        err.message
      )}</div>`;
    }
  }
  /* ── Render ────────────────────────────────── */
  _render() {
    const persona = this._resolve("persona") || "";
    const personaId = this._resolve("persona-id") || "";
    const storyIds = (this.getAttribute("story-ids") || "").split(",").map((s) => s.trim()).filter(Boolean);
    const compact = this.hasAttribute("compact");
    const phases = this.__phases;
    const hasSummary = !!this.querySelector('[slot="summary"]') || this.#slotCache.has("summary");
    const title = this.querySelector('[slot="title"]')?.textContent?.trim() || this.#slotCache.get("title") || "";
    const html = `<style>${styles3}</style>
      <article class="journey${compact ? " journey--compact" : ""}">

        <header class="journey__header">
          <div class="journey__header-top">
            <div class="journey__chips">
              <span class="chip chip--type">Journey Map</span>
              ${storyIds.map(
      (id) => `<a class="chip chip--story" href="#${id}">${this._label(id)}</a>`
    ).join("")}
            </div>
            ${persona ? `
              <div class="journey__persona">
                ${personaId ? `<a class="persona-ref" href="#${personaId}">${lucideSvg(UX_ICONS.user)} ${esc(persona)}</a>` : `<span class="persona-ref">${lucideSvg(UX_ICONS.user)} ${esc(persona)}</span>`}
              </div>` : ""}
          </div>
          <div class="journey__title-wrap">
            <slot name="title"><h2 class="journey__title">User Journey</h2></slot>
          </div>
          ${hasSummary ? `<div class="journey__summary-wrap"><slot name="summary"></slot></div>` : ""}
        </header>

        ${phases && phases.length ? this._curve(phases) + this._grid(phases) : `<div class="journey__placeholder">
               <p>Add phase data via <code>src</code> (JSON) or set <code>.phases</code> programmatically.</p>
             </div>`}

      </article>`;
    const root = (
      /** @type {ShadowRoot} */
      this.shadowRoot
    );
    const swap = () => {
      root.innerHTML = html;
    };
    if (root.querySelector("article")) {
      viewTransitionSwap(this, swap, "uj-vt");
    } else {
      swap();
    }
    this.dispatchEvent(new CustomEvent("journey-ready", {
      bubbles: true,
      composed: true,
      detail: {
        title,
        persona,
        phaseCount: phases ? phases.length : 0
      }
    }));
  }
  /* ── SVG curve ─────────────────────────────── */
  _curve(phases) {
    const W = 1e3, H = 100, PX = 28, PY = 14;
    const uw = W - PX * 2, uh = H - PY * 2;
    const n = phases.length;
    const toX = (i) => PX + (n < 2 ? uw / 2 : i / (n - 1) * uw);
    const toY = (ph) => {
      const m = EMOTION_META[ph.emotion] || EMOTION_META.neutral;
      return PY + (1 - m.score) * uh;
    };
    const pts = phases.map((ph, i) => ({ x: toX(i), y: toY(ph), ph }));
    let d = `M ${pts[0].x},${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i], cx = (a.x + b.x) / 2;
      d += ` C ${cx},${a.y} ${cx},${b.y} ${b.x},${b.y}`;
    }
    const uid = `uj-${Math.random().toString(36).slice(2, 8)}`;
    const last = pts.at(-1);
    return `
      <div class="journey__curve" aria-hidden="true">
        <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" class="curve-svg">
          <defs>
            <linearGradient id="${uid}" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stop-color="#6366f1" stop-opacity="0.22"/>
              <stop offset="100%" stop-color="#6366f1" stop-opacity="0"/>
            </linearGradient>
          </defs>
          <rect x="0"             y="0"          width="${W}" height="${H * 0.4}"  class="zone zone--pos"/>
          <rect x="0"             y="${H * 0.4}" width="${W}" height="${H * 0.2}"  class="zone zone--neu"/>
          <rect x="0"             y="${H * 0.6}" width="${W}" height="${H * 0.4}"  class="zone zone--neg"/>
          ${pts.map(({ x }) => `<line x1="${x}" y1="0" x2="${x}" y2="${H}" class="vline"/>`).join("")}
          <path d="${d} L ${last.x},${H} L ${pts[0].x},${H} Z" fill="url(#${uid})"/>
          <path d="${d}" fill="none" class="curve-line"/>
          ${pts.map(({ x, y, ph }) => {
      const m = EMOTION_META[ph.emotion] || EMOTION_META.neutral;
      return `<circle cx="${x}" cy="${y}" r="5" class="dot" style="fill:${m.color}"/>`;
    }).join("")}
        </svg>
      </div>`;
  }
  /* ── Phase grid ────────────────────────────── */
  _grid(phases) {
    const headCells = phases.map((ph, i) => {
      const m = EMOTION_META[ph.emotion] || EMOTION_META.neutral;
      const stories = ph.storyIds || [];
      return `
        <th class="phase-head" data-emotion="${ph.emotion || "neutral"}"
            style="--ec:${m.color}">
          <span class="ph-num">${i + 1}</span>
          <span class="ph-name">${esc(ph.name || "")}</span>
          <span class="ph-emoji" title="${ph.emotion || "neutral"}"><span role="img" aria-label="${esc(ph.emotion || "neutral")}">${m.emoji}</span></span>
          ${stories.length ? `<div class="ph-stories">${stories.map(
        (id) => `<a class="chip chip--story" href="#${id}">${this._label(id)}</a>`
      ).join("")}</div>` : ""}
        </th>`;
    }).join("");
    const bodyRows = ROWS.map(({ key, label }) => {
      const cells = phases.map((ph) => {
        const items = ph[key] || [];
        if (!items.length) return `<td class="data-cell data-cell--empty">\u2014</td>`;
        return `<td class="data-cell data-cell--${key.toLowerCase()}">
          ${items.map((t) => `<p>${esc(t)}</p>`).join("")}
        </td>`;
      }).join("");
      return `
        <tr class="grid-row grid-row--${key.toLowerCase()}">
          <th class="row-label">${label}</th>
          ${cells}
        </tr>`;
    }).join("");
    return `
      <div class="journey__grid-wrap">
        <table class="journey__grid"
               aria-label="${esc(this.getAttribute("title") || "User Journey")} \u2014 phase breakdown">
          <thead>
            <tr>
              <th class="corner">Stage</th>
              ${headCells}
            </tr>
          </thead>
          <tbody>${bodyRows}</tbody>
        </table>
      </div>`;
  }
  /* ── Helpers ───────────────────────────────── */
  _label(id) {
    return id.replace(/^(activity|persona|journey|story|user)-/, "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }
};
registerComponent("user-journey", UserJourney);

// src/web-components/empathy-map/styles.js
var styles4 = `
  :host {
    display: block;
    font-family: var(--_font-sans);
    line-height: 1.6;
    color: var(--_text);
    container-type: inline-size;

    --_bg:     var(--empathy-map-bg, var(--color-surface, #ffffff));
    --_card:   var(--empathy-map-card, var(--color-surface-raised, #f8f9fa));
    --_border: var(--empathy-map-border, var(--color-border, #e0e0e0));
    --_muted:  var(--empathy-map-muted, var(--color-text-muted, #666666));
    --_text:   var(--empathy-map-text, var(--color-text, #1a1a1a));
    --_radius: var(--empathy-map-radius, var(--radius-xl, 1rem));
    --_accent: var(--empathy-map-accent, var(--color-interactive, var(--color-primary, #0066cc)));
    --_link:   var(--empathy-map-link, var(--color-interactive, var(--color-primary, #6366f1)));
    --_primary: var(--empathy-map-primary, var(--color-primary, #6366f1));
    --_accent-bar: var(--empathy-map-accent-bar, var(--color-accent, #8b5cf6));
    --_says:   var(--empathy-map-says, var(--color-info, #3b82f6));
    --_thinks: var(--empathy-map-thinks, var(--color-accent, #8b5cf6));
    --_does:   var(--empathy-map-does, var(--color-warning, #f59e0b));
    --_feels:  var(--empathy-map-feels, var(--color-error, #ef4444));
    --_says-bg:   color-mix(in oklch, var(--_says)   16%, var(--_card));
    --_thinks-bg: color-mix(in oklch, var(--_thinks) 16%, var(--_card));
    --_does-bg:   color-mix(in oklch, var(--_does)   16%, var(--_card));
    --_feels-bg:  color-mix(in oklch, var(--_feels)  16%, var(--_card));
    --_chip-type-bg: color-mix(in oklch, var(--_accent-bar) 18%, var(--_card));
    --_chip-type-fg: var(--_accent-bar);
    --_font-sans:    var(--empathy-map-font, var(--font-sans, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif));
    --_font-xs:      var(--empathy-map-font-xs, var(--font-size-xs, 0.75rem));
    --_font-sm:      var(--empathy-map-font-sm, var(--font-size-sm, 0.875rem));
    --_font-md:      var(--empathy-map-font-md, var(--font-size-md, 1rem));
    --_font-xl:      var(--empathy-map-font-xl, var(--font-size-xl, 1.25rem));
    --_space-2xs:    var(--empathy-map-space-2xs, var(--size-2xs, 0.25rem));
    --_space-xs:     var(--empathy-map-space-xs, var(--size-xs, 0.5rem));
    --_space-s:      var(--empathy-map-space-s, var(--size-s, 0.75rem));
    --_space-m:      var(--empathy-map-space-m, var(--size-m, 1rem));
    --_space-l:      var(--empathy-map-space-l, var(--size-l, 1.5rem));
    --_radius-m:     var(--empathy-map-radius-m, var(--radius-m, 0.5rem));
    --_radius-full:  var(--empathy-map-radius-full, var(--radius-full, 9999px));
    --_duration:     var(--empathy-map-duration, var(--duration-normal, 200ms));
    --_duration-fast: var(--empathy-map-duration-fast, var(--duration-fast, 100ms));
    --_ease:         var(--empathy-map-ease, var(--ease-default, ease));
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; }

  /* \u2500\u2500 Card \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  .empathy-map {
    background: var(--_card);
    border: 1px solid var(--_border);
    border-radius: var(--_radius);
    overflow: hidden;
  }

  /* \u2500\u2500 Header \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  .empathy-map__header {
    padding: 20px 24px 16px 28px;
    border-block-end: 1px solid var(--_border);
    position: relative;
  }

  /* Left accent bar */
  .empathy-map__header::before {
    content: '';
    position: absolute;
    inset-block: 0;
    inset-inline-start: 0;
    width: 4px;
    background: linear-gradient(135deg, var(--_primary), var(--_accent-bar));
  }

  .empathy-map__header-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--_space-s);
    flex-wrap: wrap;
    margin-block-end: var(--_space-xs);
  }

  .empathy-map__chips {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
  }

  /* \u2500\u2500 Chips \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  .chip {
    display: inline-block;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.05em;
    padding: 2px 9px;
    border-radius: var(--_radius-full);
    text-decoration: none;
    line-height: 1.6;
  }

  .chip--type {
    color: var(--_chip-type-fg);
    background: var(--_chip-type-bg);
  }

  /* \u2500\u2500 Persona ref \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  .persona-ref {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 13px;
    font-weight: 600;
    color: var(--_muted);
    text-decoration: none;
    white-space: nowrap;
  }

  .persona-ref svg {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
  }

  a.persona-ref:hover { color: var(--_link); text-decoration: underline; }

  /* \u2500\u2500 Title & summary (slotted content) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  .empathy-map__title-wrap {
    margin-block-end: var(--_space-2xs);
  }

  .empathy-map__title {
    font-size: var(--_font-xl);
    font-weight: 700;
    color: var(--_text);
    margin: 0;
  }

  ::slotted([slot="title"]) {
    font-size: var(--_font-xl) !important;
    font-weight: 700 !important;
    color: var(--_text) !important;
    margin: 0 !important;
  }

  .empathy-map__summary-wrap {
    max-width: 72ch;
  }

  ::slotted([slot="summary"]) {
    font-size: var(--_font-sm) !important;
    color: var(--_muted) !important;
    margin: 0 !important;
  }

  /* \u2500\u2500 Grid \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  .empathy-map__grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1px;
    background: var(--_border);
  }

  /* \u2500\u2500 Quadrant \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  .quadrant {
    background: var(--_card);
    padding: 0;
    position: relative;
    display: grid;
  }

  .quadrant::before {
    content: '';
    position: absolute;
    inset-block-start: 0;
    inset-inline: 0;
    height: 3px;
  }

  .quadrant--says::before   { background: var(--_says); }
  .quadrant--thinks::before { background: var(--_thinks); }
  .quadrant--does::before   { background: var(--_does); }
  .quadrant--feels::before  { background: var(--_feels); }

  .quadrant__inner {
    display: grid;
    padding: 16px 20px;
    padding-block-start: 19px; /* 16 + 3px top border */
  }

  /* \u2500\u2500 Quadrant header \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  .quadrant__header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-block-end: var(--_space-s);
  }

  .quadrant__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: var(--_radius-m);
    flex-shrink: 0;
  }

  .quadrant__icon svg {
    width: 16px;
    height: 16px;
  }

  .quadrant--says   .quadrant__icon { background: var(--_says-bg);   color: var(--_says); }
  .quadrant--thinks .quadrant__icon { background: var(--_thinks-bg); color: var(--_thinks); }
  .quadrant--does   .quadrant__icon { background: var(--_does-bg);   color: var(--_does); }
  .quadrant--feels  .quadrant__icon { background: var(--_feels-bg);  color: var(--_feels); }

  .quadrant__label {
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--_muted);
    flex: 1;
  }

  /* \u2500\u2500 Quadrant content / faces \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  .quadrant__face {
    grid-area: 1 / 1;
    transition: opacity var(--_duration) var(--_ease), transform var(--_duration) var(--_ease);
  }

  .quadrant__face--front {
    opacity: 1;
    transform: scale(1);
  }

  .quadrant__face--back {
    opacity: 0;
    transform: scale(0.95);
    pointer-events: none;
  }

  [data-editing] .quadrant__face--front {
    opacity: 0;
    transform: scale(0.95);
    pointer-events: none;
  }

  [data-editing] .quadrant__face--back {
    opacity: 1;
    transform: scale(1);
    pointer-events: auto;
  }

  .quadrant__content {
    font-size: 14px;
    line-height: 1.55;
    color: var(--_text);
  }

  .quadrant__content p {
    margin-block: 0 6px;
  }

  .quadrant__content p:last-child {
    margin-block-end: 0;
  }

  /* \u2500\u2500 Slot fallback / placeholder \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  .placeholder {
    font-size: 13px;
    color: var(--_muted);
    font-style: italic;
  }

  ::slotted(ul),
  ::slotted(ol) {
    margin: 0;
    padding-inline-start: 1.4em;
    font-size: 14px;
    line-height: 1.55;
  }

  /* \u2500\u2500 Emotion tags \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  .emotion-tag {
    display: inline-block;
    font-size: 12px;
    font-weight: 600;
    padding: 2px 10px;
    border-radius: var(--_radius-full);
    margin-block-end: 6px;
    margin-inline-end: 4px;
    background: color-mix(in srgb, var(--ec, #94a3b8) 15%, transparent);
    color: var(--ec, #94a3b8);
    border: 1px solid color-mix(in srgb, var(--ec, #94a3b8) 30%, transparent);
  }

  /* \u2500\u2500 Edit / Done buttons \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  .quadrant__edit-btn,
  .quadrant__done-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border: 1px solid var(--_border);
    border-radius: 6px;
    background: var(--_bg);
    color: var(--_muted);
    cursor: pointer;
    line-height: 1;
    padding: 0;
    flex-shrink: 0;
    transition: background var(--_duration-fast) var(--_ease), color var(--_duration-fast) var(--_ease);
  }

  .quadrant__edit-btn svg,
  .quadrant__done-btn svg {
    width: 14px;
    height: 14px;
  }

  .quadrant__edit-btn:hover,
  .quadrant__done-btn:hover {
    background: var(--_border);
    color: var(--_text);
  }

  .quadrant__done-btn {
    margin-block-start: 8px;
    width: auto;
    padding: 0 12px;
    font-size: 12px;
    font-weight: 600;
    gap: 4px;
  }

  /* \u2500\u2500 Editor textarea \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  .quadrant__editor {
    width: 100%;
    min-height: 100px;
    padding: 10px 12px;
    border: 1px solid var(--_border);
    border-radius: var(--_radius-m);
    font-family: inherit;
    font-size: 13px;
    line-height: 1.55;
    color: var(--_text);
    background: var(--_bg);
    resize: vertical;
  }

  .quadrant__editor:focus {
    outline: 2px solid var(--_accent);
    outline-offset: -1px;
    border-color: var(--_accent);
  }

  /* \u2500\u2500 Footer \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  .empathy-map__footer {
    display: flex;
    gap: 1px;
    background: var(--_border);
    border-block-start: 1px solid var(--_border);
  }

  .summary-row {
    flex: 1;
    background: var(--_card);
    padding: 16px 20px;
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }

  .summary-row__icon {
    line-height: 1;
    flex-shrink: 0;
    margin-block-start: 2px;
    color: var(--_muted);
  }

  .summary-row__icon svg {
    width: 18px;
    height: 18px;
  }

  .summary-row__body {
    flex: 1;
    min-width: 0;
  }

  .summary-row__label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--_muted);
    margin-block-end: 4px;
  }

  .summary-row__content {
    font-size: 14px;
    line-height: 1.55;
    color: var(--_text);
  }

  .summary-row__content p {
    margin-block: 0 4px;
  }

  .summary-row__content p:last-child {
    margin-block-end: 0;
  }

  /* \u2500\u2500 Compact variant \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  :host([compact]) .empathy-map__header {
    padding: 14px 18px 12px 22px;
  }

  :host([compact]) .empathy-map__title {
    font-size: 16px;
  }

  :host([compact]) .empathy-map__summary {
    font-size: 12px;
  }

  :host([compact]) .quadrant__inner {
    padding: 12px 14px;
    padding-block-start: 15px;
  }

  :host([compact]) .quadrant__icon {
    width: 26px;
    height: 26px;
    font-size: 13px;
    border-radius: 6px;
  }

  :host([compact]) .quadrant__label {
    font-size: 11px;
  }

  :host([compact]) .quadrant__content {
    font-size: 12px;
  }

  :host([compact]) .summary-row {
    padding: 12px 14px;
  }

  :host([compact]) .summary-row__content {
    font-size: 12px;
  }

  /* \u2500\u2500 Responsive \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  @container (max-width: 500px) {
    .empathy-map__grid {
      grid-template-columns: 1fr;
    }

    .empathy-map__header {
      padding: 14px 16px 12px 20px;
    }

    .empathy-map__title {
      font-size: 17px;
    }

    .empathy-map__footer {
      flex-direction: column;
    }
  }

  /* \u2500\u2500 Motion \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  @media (prefers-reduced-motion: reduce) {
    .quadrant__face {
      transition: none;
    }

    .quadrant__edit-btn,
    .quadrant__done-btn {
      transition: none;
    }
  }

  /* \u2500\u2500 Print \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  @media print {
    .empathy-map {
      break-inside: avoid;
      border-color: var(--_border);
    }

    .quadrant__edit-btn,
    .quadrant__done-btn {
      display: none;
    }

    .quadrant__face--back {
      display: none;
    }

    .empathy-map__footer {
      flex-direction: column;
    }
  }

  /* \u2500\u2500 Utility \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  .state-msg        { padding: var(--_space-l); font-size: var(--_font-sm); color: var(--_muted); font-style: italic; }
  .state-msg--error { color: var(--color-error-text, var(--color-error, #dc2626)); }
  code { font-family: var(--font-mono, Monaco, Menlo, monospace); font-size: 0.88em; }
`;

// src/web-components/empathy-map/logic.js
var QUADRANT_KEYS = ["says", "thinks", "does", "feels"];
var EmpathyMap = class extends HTMLElement {
  static get observedAttributes() {
    return ["persona", "persona-id", "src", "editable", "compact"];
  }
  #slotCache = /* @__PURE__ */ new Map();
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.__quadrants = null;
    this.__goals = null;
    this.__painPoints = null;
    this._editingQuadrants = /* @__PURE__ */ new Set();
  }
  /* ── Properties ─────────────────────────────────── */
  /** @returns {Objectstring, string[]|null} */
  get quadrants() {
    return this.__quadrants;
  }
  /** @param {Objectstring, string[]|null} data */
  set quadrants(data) {
    this.__quadrants = data;
    if (this.isConnected) this._render();
  }
  /** @returns {string[]|null} */
  get goals() {
    return this.__goals;
  }
  /** @param {string[]|null} data */
  set goals(data) {
    this.__goals = data;
    if (this.isConnected) this._render();
  }
  /** @returns {string[]|null} */
  get painPoints() {
    return this.__painPoints;
  }
  /** @param {string[]|null} data */
  set painPoints(data) {
    this.__painPoints = data;
    if (this.isConnected) this._render();
  }
  /* ── Slot caching ───────────────────────────────── */
  #cacheSlotValues() {
    for (const child of this.children) {
      const slot = child.getAttribute("slot");
      if (slot) this.#slotCache.set(slot, child.textContent.trim());
    }
  }
  _resolve(attr) {
    return this.getAttribute(attr) || this.#slotCache.get(attr) || "";
  }
  /* ── Lifecycle ─────────────────────────────────── */
  connectedCallback() {
    this.#cacheSlotValues();
    this.setAttribute("data-upgraded", "");
    if (this.hasAttribute("src")) {
      this._loadSrc(this.getAttribute("src"));
    } else {
      this._render();
    }
  }
  disconnectedCallback() {
    this.removeAttribute("data-upgraded");
  }
  attributeChangedCallback(name) {
    if (!this.isConnected) return;
    if (name === "src") {
      this._loadSrc(this.getAttribute("src"));
    } else {
      this._render();
    }
  }
  // ── Data API (HTML-first / JS-first dual contract) ──────────────
  /**
   * Read the empathy map as a plain data object combining state and
   * slotted content. Mirrors what a consumer would assign to .data.
   */
  get data() {
    const titleEl = this.querySelector('[slot="title"]');
    const summaryEl = this.querySelector('[slot="summary"]');
    return {
      persona: this.getAttribute("persona") || void 0,
      personaId: this.getAttribute("persona-id") || void 0,
      title: titleEl?.textContent?.trim() || void 0,
      summary: summaryEl?.textContent?.trim() || void 0,
      quadrants: this.__quadrants || void 0,
      goals: this.__goals || void 0,
      painPoints: this.__painPoints || void 0
    };
  }
  /**
   * Set state attributes, slotted content, and quadrant/goals/pain-point
   * arrays from a plain object in one call. Idempotent for repeat calls.
   * Emits empathy-map:data-changed { data, source: 'property' }.
   */
  set data(value) {
    if (!value || typeof value !== "object") return;
    if (value.persona) this.setAttribute("persona", String(value.persona));
    if (value.personaId) this.setAttribute("persona-id", String(value.personaId));
    if (value.title && !this.querySelector('[slot="title"]')) {
      const el = document.createElement("h2");
      el.slot = "title";
      el.textContent = value.title;
      this.appendChild(el);
    }
    if (value.summary && !this.querySelector('[slot="summary"]')) {
      const el = document.createElement("p");
      el.slot = "summary";
      el.textContent = value.summary;
      this.appendChild(el);
    }
    if (value.quadrants != null) this.__quadrants = value.quadrants;
    if (value.goals != null) this.__goals = value.goals;
    if (value.painPoints != null) this.__painPoints = value.painPoints;
    if (this.isConnected) this._render();
    this.dispatchEvent(new CustomEvent("empathy-map:data-changed", {
      detail: { data: this.data, source: "property" },
      bubbles: true,
      composed: true
    }));
  }
  /* ── Public API ────────────────────────────────── */
  /**
   * Open a quadrant for editing.
   * @param {string} name - Quadrant key: says|thinks|does|feels
   */
  editQuadrant(name) {
    if (!QUADRANT_KEYS.includes(name)) return;
    if (!this.hasAttribute("editable")) return;
    this._openEdit(name);
  }
  /**
   * Close a quadrant edit and save.
   * @param {string} name - Quadrant key: says|thinks|does|feels
   */
  closeQuadrant(name) {
    if (!QUADRANT_KEYS.includes(name)) return;
    this._closeEdit(name);
  }
  /* ── JSON loading ──────────────────────────────── */
  async _loadSrc(src) {
    if (!src || !this.shadowRoot) return;
    this.shadowRoot.innerHTML = `<style>${styles4}</style><div class="state-msg">Loading\u2026</div>`;
    try {
      const res = await fetch(src);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.persona) this.setAttribute("persona", data.persona);
      if (data.personaId) this.setAttribute("persona-id", data.personaId);
      if (data.title && !this.querySelector('[slot="title"]')) {
        const el = document.createElement("h2");
        el.slot = "title";
        el.textContent = data.title;
        this.appendChild(el);
      }
      if (data.summary && !this.querySelector('[slot="summary"]')) {
        const el = document.createElement("p");
        el.slot = "summary";
        el.textContent = data.summary;
        this.appendChild(el);
      }
      this.__quadrants = data.quadrants || null;
      this.__goals = data.goals || null;
      this.__painPoints = data.painPoints || null;
      this._render();
    } catch (err) {
      if (!this.shadowRoot) return;
      const msg = err instanceof Error ? err.message : String(err);
      this.shadowRoot.innerHTML = `<style>${styles4}</style><div class="state-msg state-msg--error">Could not load empathy map: ${esc(msg)}</div>`;
    }
  }
  /* ── Render ────────────────────────────────────── */
  _render() {
    const persona = this._resolve("persona") || "";
    const personaId = this._resolve("persona-id") || "";
    const compact = this.hasAttribute("compact");
    const editable = this.hasAttribute("editable");
    const hasTitle = !!this.querySelector('[slot="title"]') || this.#slotCache.has("title");
    const hasSummary = !!this.querySelector('[slot="summary"]') || this.#slotCache.has("summary");
    const hasGoals = this.__goals?.length || this.querySelector('[slot="goals"]');
    const hasPains = this.__painPoints?.length || this.querySelector('[slot="pain-points"]');
    const html = `<style>${styles4}</style>
      <article class="empathy-map${compact ? " empathy-map--compact" : ""}">

        <header class="empathy-map__header">
          <div class="empathy-map__header-top">
            <div class="empathy-map__chips">
              <span class="chip chip--type">Empathy Map</span>
            </div>
            ${persona ? `
              <div class="empathy-map__persona">
                ${personaId ? `<a class="persona-ref" href="#${esc(personaId)}">${lucideSvg(UX_ICONS.user)} ${esc(persona)}</a>` : `<span class="persona-ref">${lucideSvg(UX_ICONS.user)} ${esc(persona)}</span>`}
              </div>` : ""}
          </div>
          <div class="empathy-map__title-wrap">
            <slot name="title"><h2 class="empathy-map__title">Empathy Map</h2></slot>
          </div>
          ${hasSummary ? `<div class="empathy-map__summary-wrap"><slot name="summary"></slot></div>` : ""}
        </header>

        <div class="empathy-map__grid">
          ${QUADRANT_KEYS.map((key) => this._renderQuadrant(key, editable)).join("")}
        </div>

        ${hasGoals || hasPains ? `
          <footer class="empathy-map__footer">
            ${this._renderSummaryRow("goals", lucideSvg(UX_ICONS.target), "Goals")}
            ${this._renderSummaryRow("pain-points", lucideSvg(UX_ICONS.alertTriangle), "Pain Points")}
          </footer>
        ` : ""}

      </article>`;
    const swap = () => {
      if (!this.shadowRoot) return;
      this.shadowRoot.innerHTML = html;
      if (editable) this._bindEditListeners();
    };
    if (this.shadowRoot?.querySelector("article")) {
      viewTransitionSwap(this, swap, "em-vt");
    } else {
      swap();
    }
    this.dispatchEvent(new CustomEvent("empathy-map:ready", {
      bubbles: true,
      composed: true,
      detail: { title: this.querySelector('[slot="title"]')?.textContent?.trim() || "Empathy Map", persona }
    }));
  }
  /* ── Render quadrant ───────────────────────────── */
  _renderQuadrant(key, editable) {
    const meta = QUADRANT_META[key];
    const items = this.__quadrants?.[key];
    const isEditing = this._editingQuadrants.has(key);
    const frontContent = items && items.length ? key === "feels" ? items.map((item) => this._renderEmotion(item)).join("") : items.map((item) => `<p>${esc(item)}</p>`).join("") : `<slot name="${key}"><p class="placeholder">Add ${meta.label.toLowerCase()} items\u2026</p></slot>`;
    const textareaValue = items?.length ? items.join("\n") : "";
    return `
      <section class="quadrant quadrant--${key}"${isEditing ? " data-editing" : ""}>
        <div class="quadrant__inner">
          <div class="quadrant__header">
            <div class="quadrant__icon" aria-hidden="true">${lucideSvg(meta.icon)}</div>
            <span class="quadrant__label">${meta.label}</span>
            ${editable ? `<button class="quadrant__edit-btn" data-quadrant="${key}"
              aria-label="Edit ${meta.label}" title="Edit ${meta.label}">${lucideSvg(UX_ICONS.pencil)}</button>` : ""}
          </div>
          <div class="quadrant__faces">
            <div class="quadrant__face quadrant__face--front"${isEditing ? " inert" : ""}>
              <div class="quadrant__content">
                ${frontContent}
              </div>
            </div>
            ${editable ? `
              <div class="quadrant__face quadrant__face--back"${isEditing ? "" : " inert"}>
                <textarea class="quadrant__editor" data-quadrant="${key}"
                  placeholder="One item per line\u2026"
                  aria-label="Edit ${meta.label} items">${esc(textareaValue)}</textarea>
                <button class="quadrant__done-btn" data-quadrant="${key}"
                  aria-label="Done editing ${meta.label}">${lucideSvg(UX_ICONS.check)} Done</button>
              </div>
            ` : ""}
          </div>
        </div>
      </section>`;
  }
  /* ── Render emotion tag ────────────────────────── */
  _renderEmotion(item) {
    const normalized = item.toLowerCase().trim();
    const meta = EMOTION_META[normalized];
    if (meta) {
      return `<span class="emotion-tag" style="--ec:${meta.color}"><span role="img" aria-label="${esc(item)}">${meta.emoji}</span> ${esc(item)}</span>`;
    }
    return `<p>${esc(item)}</p>`;
  }
  /* ── Render summary row ────────────────────────── */
  _renderSummaryRow(slotName, icon, label) {
    const dataKey = slotName === "pain-points" ? "painPoints" : slotName;
    const items = dataKey === "painPoints" ? this.__painPoints : this.__goals;
    const content = items?.length ? items.map((item) => `<p>${esc(item)}</p>`).join("") : `<slot name="${slotName}"><p class="placeholder">No ${label.toLowerCase()} specified.</p></slot>`;
    return `
      <div class="summary-row">
        <span class="summary-row__icon" aria-hidden="true">${icon}</span>
        <div class="summary-row__body">
          <div class="summary-row__label">${label}</div>
          <div class="summary-row__content">${content}</div>
        </div>
      </div>`;
  }
  /* ── Edit interaction ──────────────────────────── */
  _bindEditListeners() {
    const root = this.shadowRoot;
    if (!root) return;
    root.querySelectorAll(".quadrant__edit-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const q = (
          /** @type {HTMLElement} */
          btn.dataset.quadrant
        );
        if (q) this._openEdit(q);
      });
    });
    root.querySelectorAll(".quadrant__done-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const q = (
          /** @type {HTMLElement} */
          btn.dataset.quadrant
        );
        if (q) this._closeEdit(q);
      });
    });
    root.querySelectorAll(".quadrant__editor").forEach((rawTextarea) => {
      const textarea = (
        /** @type {HTMLTextAreaElement} */
        rawTextarea
      );
      textarea.addEventListener("keydown", (e) => {
        const ke = (
          /** @type {KeyboardEvent} */
          e
        );
        if (ke.key === "Escape") {
          ke.preventDefault();
          const q = textarea.dataset.quadrant;
          if (q) this._closeEdit(q);
        }
      });
    });
  }
  _openEdit(key) {
    this._editingQuadrants.add(key);
    const section = this.shadowRoot?.querySelector(`.quadrant--${key}`);
    if (!section) return;
    section.setAttribute("data-editing", "");
    const front = section.querySelector(".quadrant__face--front");
    const back = section.querySelector(".quadrant__face--back");
    if (front) front.setAttribute("inert", "");
    if (back) back.removeAttribute("inert");
    const textarea = (
      /** @type {HTMLTextAreaElement | null} */
      section.querySelector(".quadrant__editor")
    );
    if (textarea) {
      const items = this.__quadrants?.[key];
      if (items?.length) {
        textarea.value = items.join("\n");
      } else {
        const slot = (
          /** @type {HTMLSlotElement | null} */
          section.querySelector(`slot[name="${key}"]`)
        );
        if (slot) {
          const assigned = slot.assignedElements();
          if (assigned.length) {
            const lines = [];
            assigned.forEach((el) => {
              const lis = el.querySelectorAll("li");
              if (lis.length) {
                lis.forEach((li) => lines.push(li.textContent?.trim() ?? ""));
              } else {
                lines.push(el.textContent?.trim() ?? "");
              }
            });
            textarea.value = lines.filter(Boolean).join("\n");
          }
        }
      }
      textarea.focus();
    }
  }
  _closeEdit(key) {
    const section = this.shadowRoot?.querySelector(`.quadrant--${key}`);
    if (!section) return;
    const textarea = (
      /** @type {HTMLTextAreaElement | null} */
      section.querySelector(".quadrant__editor")
    );
    if (textarea) {
      const items = textarea.value.split("\n").map((line) => line.trim()).filter(Boolean);
      if (!this.__quadrants) this.__quadrants = {};
      this.__quadrants[key] = items;
      const contentEl = section.querySelector(".quadrant__content");
      if (contentEl) {
        if (items.length) {
          contentEl.innerHTML = key === "feels" ? items.map((item) => this._renderEmotion(item)).join("") : items.map((item) => `<p>${esc(item)}</p>`).join("");
        } else {
          const meta = QUADRANT_META[key];
          contentEl.innerHTML = `<p class="placeholder">Add ${meta.label.toLowerCase()} items\u2026</p>`;
        }
      }
    }
    this._editingQuadrants.delete(key);
    section.removeAttribute("data-editing");
    const front = section.querySelector(".quadrant__face--front");
    const back = section.querySelector(".quadrant__face--back");
    if (front) front.removeAttribute("inert");
    if (back) back.setAttribute("inert", "");
    this.dispatchEvent(new CustomEvent("empathy-map:update", {
      bubbles: true,
      composed: true,
      detail: {
        quadrant: key,
        items: this.__quadrants?.[key] || []
      }
    }));
  }
};
registerComponent("empathy-map", EmpathyMap);

// src/lib/vb-element.js
var VBElement = class extends HTMLElement {
  #cleanups = [];
  /** @type {ElementInternals | undefined} */
  #internals;
  connectedCallback() {
    if (this.hasAttribute("data-upgraded")) return;
    if (this.setup() === false) return;
    this.setAttribute("data-upgraded", "");
    queueMicrotask(() => {
      this.dispatchEvent(new CustomEvent(`${this.localName}:upgraded`, { bubbles: true }));
    });
  }
  disconnectedCallback() {
    for (const fn of this.#cleanups) fn();
    this.#cleanups = [];
    this.removeAttribute("data-upgraded");
    this.teardown();
  }
  /**
   * Track an event listener for automatic cleanup on disconnect.
   * @param {EventTarget} target
   * @param {string} event
   * @param {EventListenerOrEventListenerObject} handler
   * @param {AddEventListenerOptions} [opts]
   */
  listen(target, event, handler, opts) {
    target.addEventListener(event, handler, opts);
    this.#cleanups.push(() => target.removeEventListener(event, handler, opts));
  }
  /**
   * Override in subclass. Return false to abort upgrade.
   * @returns {boolean | void}
   */
  setup() {
  }
  /** Override in subclass for cleanup beyond event listeners. */
  teardown() {
  }
  /**
   * Toggle a CustomStateSet entry targetable via the `:state(name)` CSS selector.
   * Use for component-private flags. For author-facing state, keep using
   * data-* / aria-* attributes — see admin/specs/custom-state-set-research.md.
   *
   * Lazily attaches ElementInternals on first call; subclasses that already
   * attached internals (form-associated components) must hand them over via
   * `_adoptInternals(this.attachInternals())` in their constructor to avoid
   * the double-attach throw.
   *
   * @param {string} name
   * @param {boolean} on
   */
  setState(name, on) {
    if (!this.#internals) this.#internals = this.attachInternals();
    const states = this.#internals.states;
    try {
      if (on) states.add(name);
      else states.delete(name);
    } catch {
      const legacy = `--${name}`;
      if (on) states.add(legacy);
      else states.delete(legacy);
    }
  }
  /**
   * Hand pre-attached ElementInternals to the base class. Form-associated
   * subclasses call this in their constructor right after attachInternals().
   * @param {ElementInternals} internals
   */
  _adoptInternals(internals) {
    if (!this.#internals) this.#internals = internals;
  }
};

// src/lib/diff-by-key.js
function diffByKey({ newItems, nodes, keyOf, renderItem, containerFor }) {
  const added = [];
  const moved = [];
  const removed = [];
  const newKeys = /* @__PURE__ */ new Set();
  for (const item of newItems) newKeys.add(keyOf(item));
  for (const [key, el] of [...nodes]) {
    if (!newKeys.has(key)) {
      el.remove();
      nodes.delete(key);
      removed.push(key);
    }
  }
  const byContainer = /* @__PURE__ */ new Map();
  for (const item of newItems) {
    const key = keyOf(item);
    const existing = nodes.get(key) || null;
    const container = containerFor(item, existing);
    if (!byContainer.has(container)) byContainer.set(container, []);
    byContainer.get(container)?.push({ item, key, existing });
  }
  for (const [container, entries] of byContainer) {
    for (let i = 0; i < entries.length; i++) {
      const { item, key, existing } = entries[i];
      let el = existing;
      if (!el) {
        el = renderItem(item);
        nodes.set(key, el);
        added.push(key);
      } else if (el.parentElement !== container) {
        moved.push(key);
      } else {
        if (container.children[i] !== el) moved.push(key);
      }
      const target = container.children[i];
      if (target !== el) {
        container.insertBefore(el, target || null);
      }
    }
  }
  return { added, moved, removed };
}

// src/web-components/impact-effort/logic.js
var ImpactEffort = class _ImpactEffort extends VBElement {
  static QUADRANTS = ["quick-wins", "big-bets", "fill-ins", "money-pit"];
  static LABELS = {
    "quick-wins": "Quick Wins",
    "big-bets": "Big Bets",
    "fill-ins": "Fill-Ins",
    "money-pit": "Money Pit"
  };
  static DESCRIPTIONS = {
    "quick-wins": "High impact \xB7 Low effort",
    "big-bets": "High impact \xB7 High effort",
    "fill-ins": "Low impact \xB7 Low effort",
    "money-pit": "Low impact \xB7 High effort"
  };
  static #instanceCount = 0;
  static get observedAttributes() {
    return ["src", "compact", "title"];
  }
  /** @type {HTMLElement | null} */
  #grid = null;
  /** @type {Recordstring, HTMLElement} */
  #surfaces = {};
  /** @type {HTMLElement | null} */
  #liveRegion = null;
  /** @type {string} */
  #groupId = "";
  /** @type {HTMLElement | null} */
  #wrapper = null;
  setup() {
    this.#groupId = `ie-${++_ImpactEffort.#instanceCount}`;
    const children = [...this.querySelectorAll(":scope > [data-quadrant], :scope > [draggable]")];
    const wrapper = document.createElement("div");
    wrapper.className = "ie-wrapper";
    const yLabel = document.createElement("div");
    yLabel.className = "ie-y-label";
    yLabel.setAttribute("aria-hidden", "true");
    yLabel.textContent = "Impact \u2191";
    const column = document.createElement("div");
    column.style.cssText = "display:flex;flex-direction:column;flex:1;min-width:0;";
    const grid = document.createElement("div");
    grid.className = "ie-grid";
    grid.setAttribute("role", "region");
    grid.setAttribute("aria-label", "Impact-Effort prioritization matrix");
    const xLabel = document.createElement("div");
    xLabel.className = "ie-x-label";
    xLabel.setAttribute("aria-hidden", "true");
    xLabel.textContent = "Effort \u2192";
    for (const q of _ImpactEffort.QUADRANTS) {
      const section = document.createElement("section");
      section.className = "ie-quadrant";
      section.dataset.quadrantZone = q;
      section.setAttribute("aria-label", `${_ImpactEffort.LABELS[q]}: ${_ImpactEffort.DESCRIPTIONS[q]}`);
      const header = document.createElement("header");
      header.className = "ie-quadrant-label";
      header.innerHTML = `${_ImpactEffort.LABELS[q]}<br><span class="ie-quadrant-desc">${_ImpactEffort.DESCRIPTIONS[q]}</span>`;
      const surface = document.createElement("drag-surface");
      surface.setAttribute("group", this.#groupId);
      surface.setAttribute("aria-label", _ImpactEffort.LABELS[q]);
      surface.setAttribute("data-layout", "stack");
      surface.setAttribute("data-layout-gap", "xs");
      section.appendChild(header);
      section.appendChild(surface);
      grid.appendChild(section);
      this.#surfaces[q] = surface;
    }
    children.forEach((c, i) => {
      const child = (
        /** @type {HTMLElement} */
        c
      );
      const quadrant = child.getAttribute("data-quadrant") || "quick-wins";
      const target = this.#surfaces[quadrant] || this.#surfaces["quick-wins"];
      if (!child.hasAttribute("draggable")) {
        child.setAttribute("draggable", "true");
      }
      if (!child.hasAttribute("data-id")) {
        child.dataset.id = `ie-item-${i}`;
      }
      target.appendChild(child);
    });
    const liveRegion = document.createElement("div");
    liveRegion.className = "ie-live-region";
    liveRegion.setAttribute("role", "status");
    liveRegion.setAttribute("aria-live", "polite");
    liveRegion.setAttribute("aria-atomic", "true");
    const title = this.getAttribute("title");
    if (title) {
      const heading = document.createElement("h3");
      heading.className = "ie-title";
      heading.textContent = title;
      this.prepend(heading);
    }
    column.appendChild(grid);
    column.appendChild(xLabel);
    wrapper.appendChild(yLabel);
    wrapper.appendChild(column);
    this.appendChild(wrapper);
    this.appendChild(liveRegion);
    this.#grid = grid;
    this.#liveRegion = liveRegion;
    this.#wrapper = wrapper;
    this.listen(this, "drag-surface:transfer", (e) => {
      const { item, fromSurface, toSurface } = e.detail;
      const fromQuadrant = this.#findQuadrantForSurface(fromSurface);
      const toQuadrant = this.#findQuadrantForSurface(toSurface);
      if (!fromQuadrant || !toQuadrant) return;
      item.setAttribute("data-quadrant", toQuadrant);
      this.#announce(`Moved ${this.#itemLabel(item)} to ${_ImpactEffort.LABELS[toQuadrant]}`);
      this.dispatchEvent(new CustomEvent("impact-effort:move", {
        bubbles: true,
        detail: {
          itemId: item.dataset.id,
          from: fromQuadrant,
          to: toQuadrant,
          item
        }
      }));
    });
    const src = this.getAttribute("src");
    if (src) {
      this.#loadFromSrc(src);
    }
    this.#dispatchReady();
  }
  teardown() {
    if (this.#wrapper) {
      this.#wrapper.remove();
      this.#wrapper = null;
    }
    if (this.#liveRegion) {
      this.#liveRegion.remove();
      this.#liveRegion = null;
    }
    this.#grid = null;
    this.#surfaces = {};
    this.#nodes.clear();
    this.#items = [];
  }
  // ── Data API (HTML-first / JS-first dual contract) ──────────────
  /** @type {any[]} */
  #items = [];
  /** @type {Mapunknown, Element} */
  #nodes = /* @__PURE__ */ new Map();
  /**
   * Read the matrix items as a plain array. Each entry:
   * `{ id, quadrant: 'quick-wins'|'big-bets'|'fill-ins'|'money-pit', text? }`.
   * After upgrade reflects the parsed children; after assignment reflects
   * what was passed in.
   */
  get items() {
    if (this.#items.length) return this.#items;
    const result = [];
    for (const [q, surface] of Object.entries(this.#surfaces)) {
      for (const el of surface.querySelectorAll(':scope > [draggable="true"]')) {
        result.push({
          id: el.getAttribute("data-id") || void 0,
          quadrant: q,
          text: el.textContent?.trim() || void 0
        });
      }
    }
    return result;
  }
  /**
   * Replace the matrix items and route each into its quadrant surface.
   * Runs a keyed diff so existing nodes whose id persists are preserved
   * across re-assignment (in-flight drag state, focus, animations survive).
   * New ids render as article class="ie-card" by default; override via
   * `.renderItem`.
   *
   * Emits impact-effort:items-changed { items, source: 'property' }.
   */
  set items(value) {
    if (!this.#grid) return;
    const next = Array.isArray(value) ? value : [];
    diffByKey({
      newItems: next,
      nodes: this.#nodes,
      keyOf: (it) => it.id ?? `${it.quadrant}:${it.text}`,
      renderItem: (it) => {
        const self = (
          /** @type {any} */
          this
        );
        if (typeof self.renderItem === "function") {
          const out = self.renderItem(it);
          if (out instanceof Element) {
            if (!out.hasAttribute("draggable")) out.setAttribute("draggable", "true");
            if (!out.hasAttribute("data-id")) out.setAttribute("data-id", String(it.id ?? ""));
            return out;
          }
        }
        const article = document.createElement("article");
        article.className = "ie-card";
        article.setAttribute("draggable", "true");
        if (it.id) article.setAttribute("data-id", String(it.id));
        article.textContent = it.text || it.id || "";
        return article;
      },
      containerFor: (it) => this.#surfaces[it.quadrant] || this.#surfaces["quick-wins"]
    });
    this.#items = next;
    this.dispatchEvent(new CustomEvent("impact-effort:items-changed", {
      detail: { items: next, source: "property" },
      bubbles: true
    }));
  }
  attributeChangedCallback(name, oldVal, newVal) {
    if (!this.hasAttribute("data-upgraded")) return;
    if (name === "src" && newVal && newVal !== oldVal) {
      this.#loadFromSrc(newVal);
    }
  }
  // ── Data loading ──────────────────────────────────────────────────────────
  async #loadFromSrc(url) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!Array.isArray(data)) return;
      const swap = () => {
        for (const q of _ImpactEffort.QUADRANTS) {
          const surface = this.#surfaces[q];
          if (!surface) continue;
          for (const child of [...surface.querySelectorAll("[draggable]")]) {
            child.remove();
          }
        }
        data.forEach((entry, i) => {
          const quadrant = entry.quadrant || "quick-wins";
          const id = entry.id || `ie-item-${i}`;
          let el;
          if (entry.persona || entry.action || entry.storyId) {
            el = document.createElement("user-story");
            el.setAttribute("detail", "minimal");
            if (entry.storyId) el.setAttribute("story-id", entry.storyId);
            if (entry.persona) el.setAttribute("persona", entry.persona);
            if (entry.action) el.setAttribute("action", entry.action);
            if (entry.benefit) el.setAttribute("benefit", entry.benefit);
            if (entry.priority) el.setAttribute("priority", entry.priority);
            if (entry.status) el.setAttribute("status", entry.status);
            if (entry.points) el.setAttribute("points", String(entry.points));
          } else {
            el = document.createElement("article");
            el.textContent = entry.label || entry.text || "";
          }
          el.setAttribute("draggable", "true");
          el.dataset.id = id;
          el.dataset.quadrant = quadrant;
          const target = this.#surfaces[quadrant] || this.#surfaces["quick-wins"];
          target.appendChild(el);
        });
      };
      if (this.hasAttribute("data-upgraded") && this.#grid) {
        viewTransitionSwap(this, swap, "ie-vt");
      } else {
        swap();
      }
      this.#dispatchReady();
    } catch (err) {
      console.warn(`[impact-effort] Failed to load src="${url}":`, err);
    }
  }
  // ── Helpers ───────────────────────────────────────────────────────────────
  /** Reverse lookup: find which quadrant name owns a given drag-surface element */
  #findQuadrantForSurface(surface) {
    for (const [q, s] of Object.entries(this.#surfaces)) {
      if (s === surface) return q;
    }
    return null;
  }
  /** Set live region text content (with clear-and-set for re-announcement) */
  #announce(msg) {
    const region = this.#liveRegion;
    if (!region) return;
    region.textContent = "";
    requestAnimationFrame(() => {
      region.textContent = msg;
    });
  }
  /** Derive a label for an item from data-id or textContent */
  #itemLabel(item) {
    return item.dataset.id || item.textContent.trim().slice(0, 40);
  }
  /** Dispatch the ready event with counts per quadrant */
  #dispatchReady() {
    const quadrantCounts = {};
    for (const q of _ImpactEffort.QUADRANTS) {
      const surface = this.#surfaces[q];
      quadrantCounts[q] = surface ? surface.querySelectorAll('[draggable="true"]').length : 0;
    }
    this.dispatchEvent(new CustomEvent("impact-effort:ready", {
      bubbles: true,
      detail: { quadrantCounts }
    }));
  }
};
registerComponent("impact-effort", ImpactEffort);

// src/web-components/quadrant-grid/logic.js
var QuadrantGrid = class _QuadrantGrid extends VBElement {
  static #instanceCount = 0;
  setup() {
    this.#groupId = `qg-${++_QuadrantGrid.#instanceCount}`;
    const xLabel = this.getAttribute("x-label") || "";
    const yLabel = this.getAttribute("y-label") || "";
    const xLow = this.getAttribute("x-low") || "Low";
    const xHigh = this.getAttribute("x-high") || "High";
    const yLow = this.getAttribute("y-low") || "Low";
    const yHigh = this.getAttribute("y-high") || "High";
    const qLabels = [
      this.getAttribute("q1-label") || "Q1",
      this.getAttribute("q2-label") || "Q2",
      this.getAttribute("q3-label") || "Q3",
      this.getAttribute("q4-label") || "Q4"
    ];
    const draggable = this.hasAttribute("draggable");
    const children = [...this.querySelectorAll(":scope > [data-quadrant], :scope > [data-x][data-y]")];
    const wrapper = document.createElement("section");
    wrapper.className = "qg-wrapper";
    wrapper.setAttribute("role", "region");
    wrapper.setAttribute("aria-label", `${yLabel} \xD7 ${xLabel} quadrant grid`);
    const yLabelEl = document.createElement("header");
    yLabelEl.className = "qg-y-label";
    yLabelEl.setAttribute("aria-hidden", "true");
    yLabelEl.textContent = `\u2191 ${yLabel}`;
    const yScale = document.createElement("aside");
    yScale.className = "qg-y-scale";
    yScale.setAttribute("aria-hidden", "true");
    yScale.innerHTML = `<span>${yHigh}</span><span>${yLow}</span>`;
    const grid = document.createElement("div");
    grid.className = "qg-grid";
    const xScale = document.createElement("aside");
    xScale.className = "qg-x-scale";
    xScale.setAttribute("aria-hidden", "true");
    xScale.innerHTML = `<span>${xLow}</span><span>${xHigh}</span>`;
    const xLabelEl = document.createElement("footer");
    xLabelEl.className = "qg-x-label";
    xLabelEl.setAttribute("aria-hidden", "true");
    xLabelEl.textContent = `${xLabel} \u2192`;
    for (let q = 0; q < 4; q++) {
      const section = document.createElement("section");
      section.className = "qg-quadrant";
      section.dataset.quadrantZone = String(q);
      section.setAttribute("aria-label", qLabels[q]);
      const header = document.createElement("header");
      header.className = "qg-quadrant-label";
      header.textContent = qLabels[q];
      section.appendChild(header);
      if (draggable) {
        const surface = document.createElement("drag-surface");
        surface.setAttribute("group", this.#groupId);
        surface.setAttribute("aria-label", qLabels[q]);
        surface.setAttribute("data-layout", "stack");
        surface.setAttribute("data-layout-gap", "xs");
        section.appendChild(surface);
        this.#surfaces[q] = surface;
      } else {
        const list = document.createElement("ul");
        list.className = "qg-items";
        section.appendChild(list);
        this.#lists[q] = list;
      }
      grid.appendChild(section);
      this.#sections[q] = section;
    }
    children.forEach((rawChild, i) => {
      const child = (
        /** @type {HTMLElement} */
        rawChild
      );
      const q = this.#resolveQuadrant(child);
      const target = draggable ? this.#surfaces[q] : this.#lists[q];
      if (draggable) {
        if (!child.hasAttribute("draggable")) child.setAttribute("draggable", "true");
      }
      if (!child.hasAttribute("data-id")) child.dataset.id = `qg-item-${i}`;
      if (child.hasAttribute("data-x") && child.hasAttribute("data-y")) {
        const x = parseFloat(child.getAttribute("data-x") ?? "");
        const y = parseFloat(child.getAttribute("data-y") ?? "");
        if (Number.isFinite(x) && Number.isFinite(y)) {
          const localX = q === 0 || q === 3 ? (x - 0.5) * 2 : x * 2;
          const localY = q === 0 || q === 1 ? (y - 0.5) * 2 : y * 2;
          child.style.setProperty("--qg-local-x", localX.toFixed(4));
          child.style.setProperty("--qg-local-y", localY.toFixed(4));
          child.classList.add("qg-pinned");
          if (!child.style.getPropertyValue("--qg-pin-hue")) {
            const key = child.dataset.id || (child.textContent || "").trim();
            child.style.setProperty("--qg-pin-hue", `${_QuadrantGrid.#hueFromString(key)}deg`);
          }
        }
      }
      if (draggable) {
        target.appendChild(child);
      } else {
        const li = document.createElement("li");
        li.appendChild(child);
        target.appendChild(li);
      }
    });
    const liveRegion = document.createElement("div");
    liveRegion.className = "qg-live-region visually-hidden";
    liveRegion.setAttribute("role", "status");
    liveRegion.setAttribute("aria-live", "polite");
    wrapper.appendChild(yLabelEl);
    wrapper.appendChild(yScale);
    wrapper.appendChild(grid);
    wrapper.appendChild(xScale);
    wrapper.appendChild(xLabelEl);
    this.appendChild(wrapper);
    this.appendChild(liveRegion);
    this.#grid = grid;
    this.#liveRegion = liveRegion;
    this.#qLabels = qLabels;
    if (draggable) {
      this.listen(this, "drag-surface:transfer", this.#onTransfer);
    }
    this.#observePins();
  }
  #observePins() {
    if (typeof ResizeObserver === "undefined") return;
    const measure = (el) => {
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      if (w > 0) el.style.setProperty("--qg-pin-half-w", `${w / 2}px`);
      if (h > 0) el.style.setProperty("--qg-pin-half-h", `${h / 2}px`);
    };
    this.#pinObserver = new ResizeObserver((entries) => {
      for (const entry of entries) measure(entry.target);
      this.#scheduleClusterPass();
    });
    for (const pin of this.querySelectorAll(".qg-pinned")) {
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
    for (const rawPin of this.querySelectorAll(".qg-pinned")) {
      const pin = (
        /** @type {HTMLElement} */
        rawPin
      );
      pin.classList.remove("qg-clustered");
      pin.style.removeProperty("--qg-cluster-i");
      pin.style.removeProperty("--qg-cluster-n");
      delete pin.dataset.cluster;
      if (pin.dataset.qgTabbed !== void 0) {
        pin.removeAttribute("tabindex");
        delete pin.dataset.qgTabbed;
      }
    }
    let clusterSeq = 0;
    for (let q = 0; q < 4; q++) {
      const section = this.#sections[q];
      if (!section) continue;
      const pins = (
        /** @type {HTMLElement[]} */
        [...section.querySelectorAll(".qg-pinned")]
      );
      if (pins.length < 2) continue;
      const rects = pins.map((p) => p.getBoundingClientRect());
      const parent = Array.from({ length: pins.length }, (_, i) => i);
      const find = (i) => parent[i] === i ? i : parent[i] = find(parent[i]);
      const union = (a, b) => {
        const ra = find(a), rb = find(b);
        if (ra !== rb) parent[ra] = rb;
      };
      for (let i = 0; i < pins.length; i++) {
        for (let j = i + 1; j < pins.length; j++) {
          if (_QuadrantGrid.#rectsIntersect(rects[i], rects[j])) union(i, j);
        }
      }
      const groups = /* @__PURE__ */ new Map();
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
          pin.classList.add("qg-clustered");
          pin.dataset.cluster = id;
          pin.style.setProperty("--qg-cluster-i", String(i));
          pin.style.setProperty("--qg-cluster-n", String(members.length));
          if (!pin.hasAttribute("tabindex") && !pin.matches("a, button, [contenteditable]")) {
            pin.setAttribute("tabindex", "0");
            pin.dataset.qgTabbed = "";
          }
        });
      }
    }
  }
  teardown() {
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
    for (let i = 0; i < s.length; i++) h = (h << 5) + h + s.charCodeAt(i) | 0;
    return (h % 360 + 360) % 360;
  }
  #onTransfer = (e) => {
    const { item, fromSurface, toSurface } = e.detail;
    const from = this.#findQuadrantForSurface(fromSurface);
    const to = this.#findQuadrantForSurface(toSurface);
    if (from == null || to == null) return;
    item.setAttribute("data-quadrant", String(to));
    this.#announce(`Moved ${this.#itemLabel(item)} to ${this.#qLabels[to]}`);
    this.dispatchEvent(new CustomEvent("quadrant-grid:move", {
      bubbles: true,
      detail: {
        item,
        itemId: item.dataset.id,
        from,
        to
      }
    }));
  };
  #resolveQuadrant(child) {
    const q = parseInt(child.getAttribute("data-quadrant"), 10);
    if (q >= 0 && q <= 3) return q;
    if (child.hasAttribute("data-x") && child.hasAttribute("data-y")) {
      const x = parseFloat(child.getAttribute("data-x"));
      const y = parseFloat(child.getAttribute("data-y"));
      return _QuadrantGrid.quadrantFor(x, y);
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
    const top = y >= 0.5;
    if (top && right) return 0;
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
    return (item.textContent || "").trim().split("\n")[0] || "item";
  }
  #announce(message) {
    if (this.#liveRegion) this.#liveRegion.textContent = message;
  }
  #groupId = "";
  /** @type {Recordnumber, HTMLElement} */
  #surfaces = {};
  /** @type {Recordnumber, HTMLElement} */
  #lists = {};
  /** @type {Recordnumber, HTMLElement} */
  #sections = {};
  /** @type {HTMLElement | null} */
  #grid = null;
  /** @type {HTMLElement | null} */
  #liveRegion = null;
  /** @type {string[]} */
  #qLabels = [];
  /** @type {ResizeObserver | null} */
  #pinObserver = null;
  /** @type {number} */
  #clusterRaf = 0;
};
registerComponent("quadrant-grid", QuadrantGrid);

// src/web-components/risk-register/logic.js
var SCALE = 5;
var RiskRegister = class _RiskRegister extends VBElement {
  setup() {
    const tmpl = this.querySelector(":scope > template");
    let rows = tmpl ? _RiskRegister.#parseTemplate(tmpl) : [];
    if (this.hasAttribute("src")) {
      this.#loadFromSrc(this.getAttribute("src"));
      return;
    }
    this.#render(rows);
  }
  async #loadFromSrc(url) {
    try {
      const res = await fetch(url);
      const data = await res.json();
      this.#render(Array.isArray(data) ? data : []);
    } catch (e) {
      console.warn("risk-register: failed to load src", url, e);
      this.#render([]);
    }
  }
  static #parseTemplate(tmpl) {
    const rows = [];
    const trs = tmpl.content.querySelectorAll("tr");
    for (const tr of trs) {
      const cells = [...tr.children];
      const title = cells[0]?.textContent?.trim() || "";
      const id = tr.getAttribute("data-id") || title.toLowerCase().replace(/\s+/g, "-") || `risk-${rows.length}`;
      rows.push({
        id,
        title,
        likelihood: parseInt(cells[1]?.textContent ?? "", 10) || 0,
        impact: parseInt(cells[2]?.textContent ?? "", 10) || 0,
        owner: cells[3]?.textContent?.trim() || "",
        mitigation: cells[4]?.textContent?.trim() || ""
      });
    }
    return rows;
  }
  #render(rows) {
    this.#rows = rows;
    [...this.children].forEach((c) => {
      if (c.tagName !== "TEMPLATE") c.remove();
    });
    const label = this.getAttribute("label");
    if (label) {
      const h = document.createElement("header");
      h.className = "rr-label";
      h.textContent = label;
      this.appendChild(h);
    }
    const layout = document.createElement("div");
    layout.className = "rr-layout";
    layout.appendChild(this.#buildTable(rows));
    layout.appendChild(this.#buildGrid(rows));
    this.appendChild(layout);
    queueMicrotask(() => {
      this.dispatchEvent(new CustomEvent("risk-register:ready", {
        bubbles: true,
        detail: { count: rows.length }
      }));
    });
  }
  #buildTable(rows) {
    const wrapper = document.createElement("data-table");
    const table = document.createElement("table");
    table.innerHTML = `
      <thead>
        <tr>
          <th data-sort="string">Title</th>
          <th data-sort="number">Likelihood</th>
          <th data-sort="number">Impact</th>
          <th data-sort="number" data-rollup="product" data-heatmap="low-good">Severity</th>
          <th data-sort="string">Owner</th>
          <th data-sort="string">Mitigation</th>
        </tr>
      </thead>
      <tbody>
        ${rows.map((r) => `
          <tr data-id="${_RiskRegister.#escape(r.id)}">
            <td>${_RiskRegister.#escape(r.title)}</td>
            <td>${r.likelihood || ""}</td>
            <td>${r.impact || ""}</td>
            <td></td>
            <td>${_RiskRegister.#escape(r.owner)}</td>
            <td>${_RiskRegister.#escape(r.mitigation)}</td>
          </tr>
        `).join("")}
      </tbody>
    `;
    wrapper.appendChild(table);
    return wrapper;
  }
  #buildGrid(rows) {
    const grid = document.createElement("quadrant-grid");
    grid.setAttribute("x-label", "Likelihood");
    grid.setAttribute("y-label", "Impact");
    grid.setAttribute("x-low", "Rare");
    grid.setAttribute("x-high", "Likely");
    grid.setAttribute("y-low", "Minor");
    grid.setAttribute("y-high", "Severe");
    grid.setAttribute("q1-label", "Avoid");
    grid.setAttribute("q2-label", "Plan");
    grid.setAttribute("q3-label", "Accept");
    grid.setAttribute("q4-label", "Mitigate");
    for (const r of rows) {
      if (!r.likelihood || !r.impact) continue;
      const dot = document.createElement("span");
      const x = Math.min(1, Math.max(0, r.likelihood / SCALE));
      const y = Math.min(1, Math.max(0, r.impact / SCALE));
      dot.setAttribute("data-x", x.toFixed(3));
      dot.setAttribute("data-y", y.toFixed(3));
      dot.setAttribute("data-id", r.id);
      dot.setAttribute("title", `${r.title} \u2014 likelihood ${r.likelihood}, impact ${r.impact}`);
      dot.textContent = r.title;
      grid.appendChild(dot);
    }
    return grid;
  }
  static #escape(s) {
    return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  }
  /** @type {Array{id:string,title:string,likelihood:number,impact:number,owner:string,mitigation:string}} */
  #rows = [];
  get rows() {
    return [...this.#rows];
  }
  set rows(value) {
    this.#render(Array.isArray(value) ? value : []);
  }
};
registerComponent("risk-register", RiskRegister);

// src/web-components/traceability-matrix/logic.js
var TraceabilityMatrix = class _TraceabilityMatrix extends VBElement {
  setup() {
    const rowsSel = this.getAttribute("rows");
    const colsSel = this.getAttribute("cols");
    const linkAttr = this.getAttribute("link-attr");
    if (!rowsSel || !colsSel || !linkAttr) {
      console.warn("traceability-matrix: requires rows, cols, and link-attr attributes");
      return false;
    }
    queueMicrotask(() => this.#build(rowsSel, colsSel, linkAttr));
    return true;
  }
  #build(rowsSel, colsSel, linkAttr) {
    const rowEls = [...document.querySelectorAll(rowsSel)].filter((el) => el !== this && !this.contains(el));
    const colEls = [...document.querySelectorAll(colsSel)].filter((el) => el !== this && !this.contains(el));
    if (!rowEls.length || !colEls.length) {
      this.#renderEmpty();
      return;
    }
    const rowAxisLabel = this.getAttribute("row-label") || "";
    const cellMark = this.getAttribute("cell-mark") || "\u2713";
    const flagOrphans = this.hasAttribute("flag-orphans");
    const links = [];
    const rowHits = /* @__PURE__ */ new WeakMap();
    const colHits = /* @__PURE__ */ new WeakMap();
    for (const rowEl of rowEls) {
      const refs = _TraceabilityMatrix.#parseRefs(rowEl.getAttribute(linkAttr));
      for (const ref of refs) {
        const colEl = colEls.find((c) => c.id === ref);
        if (!colEl) continue;
        links.push({ rowEl, colEl });
        rowHits.set(rowEl, (rowHits.get(rowEl) || 0) + 1);
        colHits.set(colEl, (colHits.get(colEl) || 0) + 1);
      }
    }
    const wrapper = document.createElement("data-table");
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    const corner = document.createElement("th");
    corner.setAttribute("data-sort", "string");
    corner.textContent = rowAxisLabel;
    headerRow.appendChild(corner);
    for (const colEl of colEls) {
      const th = document.createElement("th");
      th.setAttribute("data-sort", "number");
      th.textContent = _TraceabilityMatrix.#labelOf(colEl);
      th.dataset.colId = colEl.id || "";
      if (flagOrphans && !colHits.get(colEl)) th.dataset.orphan = "";
      headerRow.appendChild(th);
    }
    thead.appendChild(headerRow);
    table.appendChild(thead);
    const tbody = document.createElement("tbody");
    for (const rowEl of rowEls) {
      const tr = document.createElement("tr");
      tr.dataset.rowId = rowEl.id || "";
      if (flagOrphans && !rowHits.get(rowEl)) tr.dataset.orphan = "";
      const labelCell = document.createElement("th");
      labelCell.scope = "row";
      labelCell.textContent = _TraceabilityMatrix.#labelOf(rowEl);
      tr.appendChild(labelCell);
      const refs = _TraceabilityMatrix.#parseRefs(rowEl.getAttribute(linkAttr));
      for (const colEl of colEls) {
        const td = document.createElement("td");
        const matched = refs.includes(colEl.id);
        td.setAttribute("data-sort-value", matched ? "1" : "0");
        if (matched) {
          td.dataset.linked = "";
          td.textContent = cellMark;
          td.setAttribute("aria-label", "linked");
        } else {
          td.setAttribute("aria-label", "not linked");
        }
        td.dataset.colId = colEl.id || "";
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    wrapper.appendChild(table);
    [...this.children].forEach((c) => {
      if (c.tagName !== "TEMPLATE") c.remove();
    });
    const label = this.getAttribute("label");
    if (label) {
      const h = document.createElement("header");
      h.className = "tm-label";
      h.textContent = label;
      this.appendChild(h);
    }
    this.appendChild(wrapper);
    this.#wrapper = wrapper;
    this.#rowsByDom = new Map(rowEls.map((el) => [el.id, el]));
    this.#colsByDom = new Map(colEls.map((el) => [el.id, el]));
    this.listen(wrapper, "click", this.#onCellClick);
    queueMicrotask(() => {
      this.dispatchEvent(new CustomEvent("traceability-matrix:ready", {
        bubbles: true,
        detail: { rowCount: rowEls.length, colCount: colEls.length, linkCount: links.length }
      }));
    });
  }
  #onCellClick = (e) => {
    const cell = e.target.closest('td, th[scope="row"]');
    if (!cell) return;
    const tr = cell.closest("tr");
    if (!tr) return;
    const rowId = tr.dataset.rowId;
    const colId = cell.dataset.colId;
    const rowEl = rowId ? this.#rowsByDom.get(rowId) : null;
    const colEl = colId ? this.#colsByDom.get(colId) : null;
    const wasOn = cell.hasAttribute("data-state-highlighted");
    this.#clearHighlight();
    if (wasOn) {
      this.dispatchEvent(new CustomEvent("traceability-matrix:highlight", {
        bubbles: true,
        detail: { rowEl, colEl, on: false }
      }));
      return;
    }
    cell.setAttribute("data-state-highlighted", "");
    if (rowEl) rowEl.setAttribute("data-state-highlighted", "");
    if (colEl && colEl !== rowEl) colEl.setAttribute("data-state-highlighted", "");
    tr.setAttribute("data-state-highlighted", "");
    this.dispatchEvent(new CustomEvent("traceability-matrix:highlight", {
      bubbles: true,
      detail: { rowEl, colEl, on: true }
    }));
  };
  #clearHighlight() {
    if (!this.#wrapper) return;
    this.#wrapper.querySelectorAll("[data-state-highlighted]").forEach((el) => el.removeAttribute("data-state-highlighted"));
    document.querySelectorAll("[data-state-highlighted]").forEach((el) => {
      if (this.#rowsByDom.has(el.id) || this.#colsByDom.has(el.id)) el.removeAttribute("data-state-highlighted");
    });
  }
  #renderEmpty() {
    [...this.children].forEach((c) => {
      if (c.tagName !== "TEMPLATE") c.remove();
    });
    const note = document.createElement("p");
    note.className = "tm-empty";
    note.textContent = "No matching elements found for this matrix.";
    this.appendChild(note);
  }
  static #parseRefs(raw) {
    if (!raw) return [];
    return raw.split(",").map((s) => s.trim()).filter(Boolean);
  }
  static #labelOf(el) {
    return el.getAttribute("data-matrix-label") || el.id || (el.textContent || "").trim().split("\n")[0].slice(0, 60) || "(unnamed)";
  }
  /** @type {HTMLElement | null} */
  #wrapper = null;
  /** @type {Mapstring, Element} */
  #rowsByDom = /* @__PURE__ */ new Map();
  /** @type {Mapstring, Element} */
  #colsByDom = /* @__PURE__ */ new Map();
};
registerComponent("traceability-matrix", TraceabilityMatrix);

// src/web-components/burndown-chart/logic.js
var MS_PER_DAY = 864e5;
var BurndownChart = class _BurndownChart extends VBElement {
  setup() {
    const start = this.getAttribute("start");
    const end = this.getAttribute("end");
    const total = parseFloat(this.getAttribute("total") || "");
    if (!start || !end || !Number.isFinite(total)) {
      console.warn("burndown-chart: requires start, end, and total attributes");
      return false;
    }
    const startDate = _BurndownChart.#parseDate(start);
    const endDate = _BurndownChart.#parseDate(end);
    if (!startDate || !endDate || endDate < startDate) {
      console.warn("burndown-chart: start/end dates invalid", start, end);
      return false;
    }
    const includeWeekends = (this.getAttribute("weekends") || "include") !== "exclude";
    const unit = this.getAttribute("unit") || "points";
    const label = this.getAttribute("label") || "";
    const tmpl = this.querySelector(":scope > template");
    const samples = tmpl ? _BurndownChart.#parseTemplate(tmpl) : [];
    const scopeChanges = samples.filter((s) => s.delta !== 0);
    const dayLabels = _BurndownChart.#enumerateDays(startDate, endDate);
    const ideal = _BurndownChart.#idealSeries(dayLabels, total, includeWeekends);
    const actual = _BurndownChart.#actualSeries(dayLabels, samples);
    this.#render({ label, unit, dayLabels, actual, ideal, scopeChanges });
    queueMicrotask(() => {
      this.dispatchEvent(new CustomEvent("burndown-chart:ready", {
        bubbles: true,
        detail: { dayCount: dayLabels.length, total, scopeChanges: scopeChanges.length }
      }));
    });
    return true;
  }
  #render({ label, unit, dayLabels, actual, ideal, scopeChanges }) {
    [...this.children].forEach((c) => {
      if (c.tagName !== "TEMPLATE") c.remove();
    });
    if (label) {
      const h = document.createElement("header");
      h.className = "bdc-label";
      h.textContent = label;
      this.appendChild(h);
    }
    const chart = document.createElement("chart-wc");
    chart.setAttribute("data-type", "line");
    chart.setAttribute("data-legend", "");
    chart.setAttribute("data-tooltip", "");
    chart.setAttribute("data-label-x", "Day");
    chart.setAttribute("data-label-y", unit);
    const idealValues = {};
    const actualValues = {};
    dayLabels.forEach((d, i) => {
      idealValues[d] = ideal[i];
      if (actual[i] !== null) actualValues[d] = actual[i];
    });
    const payload = [
      { name: "Actual", values: actualValues },
      { name: "Ideal", values: idealValues }
    ];
    chart.setAttribute("data-values", JSON.stringify(payload));
    this.appendChild(chart);
    if (scopeChanges.length) {
      const notes = document.createElement("aside");
      notes.className = "bdc-scope-changes";
      const heading = document.createElement("h4");
      heading.textContent = "Scope changes";
      notes.appendChild(heading);
      const list = document.createElement("ul");
      for (const change of scopeChanges) {
        const li = document.createElement("li");
        const sign = change.delta > 0 ? "+" : "";
        li.innerHTML = `<time datetime="${change.date}">${change.date}</time>: <strong>${sign}${change.delta} ${unit}</strong>`;
        list.appendChild(li);
      }
      notes.appendChild(list);
      this.appendChild(notes);
    }
  }
  static #parseTemplate(tmpl) {
    const out = [];
    const trs = tmpl.content.querySelectorAll("tr");
    for (const tr of trs) {
      const cells = [...tr.children];
      const date = cells[0]?.textContent?.trim();
      const remaining = parseFloat(cells[1]?.textContent ?? "");
      const delta = parseFloat(cells[2]?.textContent ?? "0") || 0;
      if (!date || !Number.isFinite(remaining)) continue;
      out.push({ date, remaining, delta });
    }
    return out;
  }
  static #parseDate(s) {
    const m = String(s).match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!m) return null;
    return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  }
  static #toISO(d) {
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${m}-${day}`;
  }
  static #enumerateDays(start, end) {
    const days = [];
    for (let t = start.getTime(); t <= end.getTime(); t += MS_PER_DAY) {
      days.push(_BurndownChart.#toISO(new Date(t)));
    }
    return days;
  }
  static #idealSeries(dayLabels, total, includeWeekends) {
    const isWeekend = (label) => {
      const d = _BurndownChart.#parseDate(label);
      if (!d) return false;
      const w = d.getDay();
      return w === 0 || w === 6;
    };
    const workingIndices = dayLabels.map((d, i) => ({ d, i, weekend: isWeekend(d) })).filter((entry) => includeWeekends || !entry.weekend);
    const decrement = workingIndices.length > 1 ? total / (workingIndices.length - 1) : 0;
    const out = new Array(dayLabels.length).fill(null);
    let lastIdeal = total;
    let workingSeen = 0;
    for (let i = 0; i < dayLabels.length; i++) {
      const isWeekendDay = isWeekend(dayLabels[i]);
      if (includeWeekends || !isWeekendDay) {
        out[i] = Math.max(0, total - decrement * workingSeen);
        workingSeen++;
        lastIdeal = out[i];
      } else {
        out[i] = lastIdeal;
      }
    }
    return out;
  }
  static #actualSeries(dayLabels, samples) {
    const byDate = new Map(samples.map((s) => [s.date, s.remaining]));
    return dayLabels.map((d) => byDate.has(d) ? byDate.get(d) : null);
  }
};
registerComponent("burndown-chart", BurndownChart);

// src/web-components/product-roadmap/logic.js
var Roadmap = class _Roadmap extends VBElement {
  setup() {
    const startAttr = this.getAttribute("start");
    const endAttr = this.getAttribute("end");
    if (!startAttr || !endAttr) {
      console.warn("product-roadmap: start and end attributes required");
      return false;
    }
    const start = _Roadmap.#parseDate(startAttr, "start");
    const end = _Roadmap.#parseDate(endAttr, "end");
    if (!start || !end || end <= start) {
      console.warn("product-roadmap: invalid start/end", startAttr, endAttr);
      return false;
    }
    this.#start = start;
    this.#end = end;
    this.#totalMs = end.getTime() - start.getTime();
    this.#view = this.getAttribute("view") === "month" ? "month" : "quarter";
    this.#editable = this.hasAttribute("editable");
    const lanes = [...this.querySelectorAll(":scope > section[data-lane]")];
    if (!lanes.length) {
      console.warn("product-roadmap: no <section data-lane> children found");
      return false;
    }
    this.#sourceLanes = lanes;
    this.#render();
    return true;
  }
  attributeChangedCallback() {
    if (this.isConnected && this.#sourceLanes.length) this.#render();
  }
  #render() {
    [...this.children].forEach((c) => {
      if (!this.#sourceLanes.includes(c)) c.remove();
    });
    this.#sourceLanes.forEach((lane) => {
      lane.hidden = true;
    });
    const wrapper = document.createElement("div");
    wrapper.className = "rm-wrapper";
    const axis = this.#buildAxis();
    wrapper.appendChild(axis);
    const lanesEl = document.createElement("div");
    lanesEl.className = "rm-lanes";
    for (const sourceLane of this.#sourceLanes) {
      const laneName = sourceLane.getAttribute("data-lane") || "";
      const laneEl = document.createElement("section");
      laneEl.className = "rm-lane";
      laneEl.dataset.lane = laneName;
      const laneLabel = document.createElement("header");
      laneLabel.className = "rm-lane-label";
      laneLabel.textContent = laneName;
      laneEl.appendChild(laneLabel);
      const track = document.createElement("div");
      track.className = "rm-track";
      track.dataset.lane = laneName;
      const initiatives = [...sourceLane.querySelectorAll(":scope > article[data-start][data-end]")];
      for (const init of initiatives) {
        const bar = this.#buildBar(init, laneName);
        if (bar) track.appendChild(bar);
      }
      if (this.#editable) {
        track.addEventListener("dragover", this.#onTrackDragOver);
        track.addEventListener("drop", this.#onTrackDrop);
      }
      laneEl.appendChild(track);
      lanesEl.appendChild(laneEl);
    }
    wrapper.appendChild(lanesEl);
    if (this.hasAttribute("today-marker") && this.#start && this.#end) {
      const today = /* @__PURE__ */ new Date();
      if (today >= this.#start && today <= this.#end) {
        const marker = document.createElement("div");
        marker.className = "rm-today";
        marker.style.setProperty("--rm-x", this.#fractionFor(today).toFixed(4));
        marker.title = `Today: ${_Roadmap.#toISO(today)}`;
        lanesEl.appendChild(marker);
      }
    }
    this.appendChild(wrapper);
    this.#wrapper = wrapper;
  }
  #buildAxis() {
    const axis = document.createElement("header");
    axis.className = "rm-axis";
    const ticks = this.#enumerateTicks();
    for (const tick of ticks) {
      const cell = document.createElement("div");
      cell.className = "rm-tick";
      cell.style.setProperty("--rm-x", tick.startFraction.toFixed(4));
      cell.style.setProperty("--rm-w", (tick.endFraction - tick.startFraction).toFixed(4));
      cell.textContent = tick.label;
      axis.appendChild(cell);
    }
    return axis;
  }
  #buildBar(initiative, laneName) {
    const start = _Roadmap.#parseDate(initiative.getAttribute("data-start"), "start");
    const end = _Roadmap.#parseDate(initiative.getAttribute("data-end"), "end");
    if (!start || !end || !this.#start || !this.#end) return null;
    const clipStart = start < this.#start ? this.#start : start;
    const clipEnd = end > this.#end ? this.#end : end;
    if (clipStart >= clipEnd) return null;
    const x = this.#fractionFor(clipStart);
    const w = this.#fractionFor(clipEnd) - x;
    const bar = document.createElement("article");
    bar.className = "rm-bar";
    bar.style.setProperty("--rm-x", x.toFixed(4));
    bar.style.setProperty("--rm-w", w.toFixed(4));
    bar.dataset.lane = laneName;
    bar.dataset.start = _Roadmap.#toISO(start);
    bar.dataset.end = _Roadmap.#toISO(end);
    if (initiative.dataset.status) bar.dataset.status = initiative.dataset.status;
    if (initiative.id) bar.dataset.sourceId = initiative.id;
    if (this.#editable) bar.setAttribute("draggable", "true");
    const title = initiative.querySelector("h1, h2, h3, h4, h5, h6");
    const heading = document.createElement("span");
    heading.className = "rm-bar-title";
    heading.textContent = title ? title.textContent.trim() : (initiative.textContent || "").trim().split("\n")[0];
    bar.appendChild(heading);
    bar.setAttribute("aria-label", `${heading.textContent} \u2014 ${bar.dataset.start} to ${bar.dataset.end} in ${laneName}`);
    bar.addEventListener("click", (e) => {
      if (this.#dragInfo) return;
      this.dispatchEvent(new CustomEvent("product-roadmap:select", {
        bubbles: true,
        detail: {
          initiative,
          lane: laneName,
          start: bar.dataset.start,
          end: bar.dataset.end,
          status: bar.dataset.status || null
        }
      }));
    });
    if (this.#editable) {
      const handle = document.createElement("span");
      handle.className = "rm-bar-handle";
      handle.setAttribute("aria-label", "Resize end date");
      bar.appendChild(handle);
      handle.addEventListener("pointerdown", (e) => this.#startResize(e, bar, initiative));
      bar.addEventListener("pointerdown", (e) => {
        if (e.target === handle) return;
        this.#startMove(e, bar, initiative);
      });
      bar.addEventListener("dragstart", (e) => {
        if (e.dataTransfer) {
          e.dataTransfer.effectAllowed = "move";
          e.dataTransfer.setData("text/plain", initiative.id || bar.dataset.sourceId || "");
        }
        this.#draggingInitiative = initiative;
        this.#draggingFromLane = laneName;
      });
      bar.addEventListener("dragend", () => {
        this.#draggingInitiative = null;
        this.#draggingFromLane = null;
      });
    }
    return bar;
  }
  /* --- pointer drag (move along time axis) --- */
  #startMove(e, bar, initiative) {
    if (e.button !== 0) return;
    e.preventDefault();
    const trackRect = bar.parentElement.getBoundingClientRect();
    const startX = e.clientX;
    const startFraction = parseFloat(bar.style.getPropertyValue("--rm-x")) || 0;
    const widthFraction = parseFloat(bar.style.getPropertyValue("--rm-w")) || 0;
    this.#dragInfo = { kind: "move", bar, initiative, trackRect, startX, startFraction, widthFraction };
    bar.setPointerCapture(e.pointerId);
    bar.addEventListener("pointermove", this.#onPointerMove);
    bar.addEventListener("pointerup", this.#onPointerUp);
    bar.addEventListener("pointercancel", this.#onPointerUp);
  }
  #startResize(e, bar, initiative) {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    const trackRect = bar.parentElement.getBoundingClientRect();
    const startX = e.clientX;
    const startFraction = parseFloat(bar.style.getPropertyValue("--rm-x")) || 0;
    const widthFraction = parseFloat(bar.style.getPropertyValue("--rm-w")) || 0;
    this.#dragInfo = { kind: "resize", bar, initiative, trackRect, startX, startFraction, widthFraction };
    bar.setPointerCapture(e.pointerId);
    bar.addEventListener("pointermove", this.#onPointerMove);
    bar.addEventListener("pointerup", this.#onPointerUp);
    bar.addEventListener("pointercancel", this.#onPointerUp);
  }
  #onPointerMove = (e) => {
    if (!this.#dragInfo) return;
    const { kind, bar, trackRect, startX, startFraction, widthFraction } = this.#dragInfo;
    const dxFraction = (e.clientX - startX) / trackRect.width;
    if (kind === "move") {
      const newStart = Math.max(0, Math.min(1 - widthFraction, startFraction + dxFraction));
      bar.style.setProperty("--rm-x", newStart.toFixed(4));
    } else if (kind === "resize") {
      const newWidth = Math.max(0.02, Math.min(1 - startFraction, widthFraction + dxFraction));
      bar.style.setProperty("--rm-w", newWidth.toFixed(4));
    }
  };
  #onPointerUp = (e) => {
    if (!this.#dragInfo) return;
    const { kind, bar, initiative } = this.#dragInfo;
    bar.releasePointerCapture(e.pointerId);
    bar.removeEventListener("pointermove", this.#onPointerMove);
    bar.removeEventListener("pointerup", this.#onPointerUp);
    bar.removeEventListener("pointercancel", this.#onPointerUp);
    const xFrac = parseFloat(bar.style.getPropertyValue("--rm-x")) || 0;
    const wFrac = parseFloat(bar.style.getPropertyValue("--rm-w")) || 0;
    const snappedStart = this.#snapDate(this.#dateForFraction(xFrac));
    const snappedEnd = this.#snapDate(this.#dateForFraction(xFrac + wFrac));
    bar.dataset.start = _Roadmap.#toISO(snappedStart);
    bar.dataset.end = _Roadmap.#toISO(snappedEnd);
    const snappedX = this.#fractionFor(snappedStart);
    const snappedW = this.#fractionFor(snappedEnd) - snappedX;
    bar.style.setProperty("--rm-x", snappedX.toFixed(4));
    bar.style.setProperty("--rm-w", snappedW.toFixed(4));
    if (initiative) {
      initiative.setAttribute("data-start", bar.dataset.start ?? "");
      initiative.setAttribute("data-end", bar.dataset.end ?? "");
    }
    this.dispatchEvent(new CustomEvent(kind === "move" ? "product-roadmap:reschedule" : "product-roadmap:resize", {
      bubbles: true,
      detail: {
        initiative,
        lane: bar.dataset.lane,
        start: bar.dataset.start,
        end: bar.dataset.end
      }
    }));
    setTimeout(() => {
      this.#dragInfo = null;
    }, 0);
  };
  #onTrackDragOver = (e) => {
    if (!this.#draggingInitiative) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };
  #onTrackDrop = (e) => {
    if (!this.#draggingInitiative) return;
    e.preventDefault();
    const targetLane = e.currentTarget.dataset.lane;
    const initiative = this.#draggingInitiative;
    const fromLane = this.#draggingFromLane;
    if (targetLane === fromLane) return;
    const newSourceLane = this.#sourceLanes.find((l) => l.getAttribute("data-lane") === targetLane);
    if (newSourceLane) newSourceLane.appendChild(initiative);
    this.dispatchEvent(new CustomEvent("product-roadmap:move", {
      bubbles: true,
      detail: {
        initiative,
        fromLane,
        toLane: targetLane,
        start: initiative.getAttribute("data-start"),
        end: initiative.getAttribute("data-end")
      }
    }));
    this.#render();
  };
  /* --- date math --- */
  #fractionFor(date) {
    if (!this.#start) return 0;
    const ms = date.getTime() - this.#start.getTime();
    return Math.max(0, Math.min(1, ms / this.#totalMs));
  }
  #dateForFraction(frac) {
    const start = this.#start ?? /* @__PURE__ */ new Date();
    return new Date(start.getTime() + frac * this.#totalMs);
  }
  #snapDate(date) {
    if (this.#view === "month") {
      return new Date(date.getFullYear(), date.getMonth(), 1);
    }
    const month = date.getMonth();
    const qStartMonth = Math.floor(month / 3) * 3;
    return new Date(date.getFullYear(), qStartMonth, 1);
  }
  #enumerateTicks() {
    const ticks = [];
    const start = this.#start;
    const end = this.#end;
    if (!start || !end) return ticks;
    if (this.#view === "quarter") {
      let cursor = this.#snapDate(start);
      while (cursor < end) {
        const next = new Date(cursor.getFullYear(), cursor.getMonth() + 3, 1);
        const startFraction = this.#fractionFor(cursor < start ? start : cursor);
        const endFraction = this.#fractionFor(next > end ? end : next);
        const q = Math.floor(cursor.getMonth() / 3) + 1;
        ticks.push({ startFraction, endFraction, label: `Q${q} ${cursor.getFullYear()}` });
        cursor = next;
      }
    } else {
      let cursor = new Date(start.getFullYear(), start.getMonth(), 1);
      while (cursor < end) {
        const next = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
        const startFraction = this.#fractionFor(cursor < start ? start : cursor);
        const endFraction = this.#fractionFor(next > end ? end : next);
        const m = cursor.toLocaleString(void 0, { month: "short" });
        ticks.push({ startFraction, endFraction, label: `${m} ${cursor.getFullYear()}` });
        cursor = next;
      }
    }
    return ticks;
  }
  /** Parse "2026-Q3", "2026-Q3-end", or ISO date. `kind` decides how
      "YYYY-Qn" without explicit position resolves: 'start' → first day
      of the quarter; 'end' → last day. */
  static #parseDate(value, kind) {
    if (!value) return null;
    const q = String(value).match(/^(\d{4})-Q([1-4])$/i);
    if (q) {
      const year = Number(q[1]);
      const quarter = Number(q[2]);
      const monthStart = (quarter - 1) * 3;
      if (kind === "end") {
        return new Date(year, monthStart + 3, 0);
      }
      return new Date(year, monthStart, 1);
    }
    const iso = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (iso) return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }
  static #toISO(d) {
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${m}-${day}`;
  }
  /** @type {Date | null} */
  #start = null;
  /** @type {Date | null} */
  #end = null;
  #totalMs = 0;
  /** @type {"quarter" | "month"} */
  #view = "quarter";
  #editable = false;
  /** @type {Element[]} */
  #sourceLanes = [];
  /** @type {HTMLElement | null} */
  #wrapper = null;
  /** @type {{ kind: string, bar: HTMLElement, initiative?: Element, trackRect: DOMRect, startX: number, startFraction: number, widthFraction: number } | null} */
  #dragInfo = null;
  /** @type {Element | null} */
  #draggingInitiative = null;
  /** @type {Element | null} */
  #draggingFromLane = null;
};
registerComponent("product-roadmap", Roadmap);

// src/lib/vb-collection.js
function VBCollection(Base) {
  const BaseAny = (
    /** @type {any} */
    Base
  );
  return class extends BaseAny {
    static keyOf(item) {
      return item.id;
    }
    /** @type {any[]} */
    #items = [];
    /** @type {Mapunknown, Element} */
    #nodes = /* @__PURE__ */ new Map();
    get items() {
      return this.#items;
    }
    set items(value) {
      const next = value || [];
      const result = diffByKey({
        newItems: next,
        nodes: this.#nodes,
        keyOf: (
          /** @type {any} */
          this.constructor.keyOf
        ),
        renderItem: (item) => (
          /** @type {any} */
          this._renderItem(item)
        ),
        containerFor: (item, existing) => (
          /** @type {any} */
          this._containerFor(item, existing)
        )
      });
      this.#items = next;
      this._postRender({ ...result, items: next });
      this._emit("items-changed", { items: next }, "api");
    }
    /**
     * Subclass hook. Build a fresh element for a new item.
     * Must return Element. Strings/templates are not accepted (see VB-XG5X).
     */
    _renderItem(_item) {
      throw new Error(`${this.constructor.name}: must implement _renderItem(item)`);
    }
    /**
     * Subclass hook. Where this item lives. Default: the element itself.
     * Override to route items into specific child containers (e.g. kanban columns).
     */
    _containerFor(_item, _existingEl) {
      return this;
    }
    /**
     * Subclass hook. Called after every diff. Use to refresh placeholders,
     * counts, WIP markers, empty-state UI.
     */
    _postRender(_diff) {
    }
    /**
     * Dispatch a tagged event so consumers can avoid feedback loops.
     * @param {string} name  Event suffix (e.g. 'items-changed').
     * @param {object} detail  Custom payload.
     * @param {'api' | 'attribute' | 'drag' | 'internal' | string} [source='api']
     */
    _emit(name, detail, source = "api") {
      this.dispatchEvent(new CustomEvent(`${this.localName}:${name}`, {
        detail: { ...detail, source },
        bubbles: true
      }));
    }
    /**
     * Read-only access to the rendered node for a given key.
     * Useful for subclass hooks that want to update an item in place.
     */
    _nodeFor(key) {
      return this.#nodes.get(key) || null;
    }
    /**
     * Seed the collection from existing DOM (HTML-first upgrade path).
     * Subclass calls this once after parsing initial children so the next
     * `.items = ...` assignment diffs against existing rendered nodes
     * instead of recreating them.
     *
     * @param {any[]} items
     * @param {Mapunknown, Element} nodeMap  key → existing element
     */
    _seedCollection(items, nodeMap) {
      this.#items = items;
      this.#nodes.clear();
      for (const [key, el] of nodeMap) this.#nodes.set(key, el);
    }
    /**
     * Update the in-memory items array without running a diff (e.g. after
     * a drag mutates the DOM). Subclass is expected to keep the DOM and
     * the items array in sync; this method just records the new model.
     *
     * @param {any[]} items
     */
    _setItemsSilently(items) {
      this.#items = items;
    }
  };
}

// src/web-components/kanban-board/logic.js
var KanbanBoard = class _KanbanBoard extends VBCollection(VBElement) {
  static get observedAttributes() {
    return ["src", "compact", "title"];
  }
  static keyOf(item) {
    return item.id ?? item.storyId;
  }
  static #instanceCount = 0;
  /** @type {HTMLDivElement | null} */
  #columnsEl = null;
  /** @type {Recordstring, HTMLElement} */
  #surfaces = {};
  /** @type {Recordstring, HTMLElement} */
  #columnEls = {};
  /** @type {HTMLDivElement | null} */
  #liveRegion = null;
  /** @type {string} */
  #groupId = "";
  /** @type {Array{ id: string, label: string, wip: number | null, color: string | null, children: HTMLElement[] }} */
  #columns = [];
  /** @type {((item: any) = Element) | null} */
  #renderItem = null;
  setup() {
    this.#groupId = `kb-${++_KanbanBoard.#instanceCount}`;
    const sections = (
      /** @type {HTMLElement[]} */
      [
        ...this.querySelectorAll(":scope > section[data-column]")
      ]
    );
    this.#columns = sections.map((section) => {
      const id = section.getAttribute("data-column") || "";
      const rawLabel = section.getAttribute("data-column-label") || "";
      const label = rawLabel || this.#titleCase(id);
      const wipAttr = section.getAttribute("data-wip");
      const wip = wipAttr ? parseInt(wipAttr, 10) : null;
      const color = section.getAttribute("data-column-color") || null;
      const children = (
        /** @type {HTMLElement[]} */
        [...section.children]
      );
      return { id, label, wip, color, children };
    });
    for (const section of sections) {
      section.remove();
    }
    this.#columnsEl = document.createElement("div");
    this.#columnsEl.className = "kb-columns";
    this.#columnsEl.setAttribute("role", "region");
    this.#columnsEl.setAttribute("aria-label", "Kanban board");
    let totalItems = 0;
    for (const col of this.#columns) {
      const column = document.createElement("section");
      column.className = "kb-column";
      column.setAttribute("data-column-id", col.id);
      if (col.color) column.setAttribute("data-column-tint", col.color);
      const header = document.createElement("header");
      header.className = "kb-column-header";
      const h3 = document.createElement("h3");
      h3.textContent = col.label;
      const countBadge = document.createElement("output");
      countBadge.className = "kb-count";
      countBadge.textContent = String(col.children.length);
      h3.appendChild(countBadge);
      if (col.wip !== null && !isNaN(col.wip)) {
        const wipBadge = document.createElement("span");
        wipBadge.className = "kb-wip";
        wipBadge.textContent = `/ ${col.wip}`;
        wipBadge.setAttribute("aria-label", `WIP limit ${col.wip}`);
        h3.appendChild(wipBadge);
      }
      header.appendChild(h3);
      column.appendChild(header);
      const surface = document.createElement("drag-surface");
      surface.setAttribute("group", this.#groupId);
      surface.setAttribute("aria-label", `${col.label} items`);
      surface.setAttribute("data-layout", "stack");
      surface.setAttribute("data-layout-gap", "xs");
      if (col.children.length > 0) {
        for (const child of col.children) {
          if (!child.hasAttribute("draggable")) {
            child.setAttribute("draggable", "true");
          }
          if (!child.hasAttribute("data-id")) {
            child.dataset.id = `kb-item-${totalItems}`;
          }
          surface.appendChild(child);
        }
        totalItems += col.children.length;
      } else {
        const placeholder = document.createElement("p");
        placeholder.className = "kb-empty";
        placeholder.textContent = "No items";
        surface.appendChild(placeholder);
      }
      column.appendChild(surface);
      this.#columnsEl.appendChild(column);
      this.#surfaces[col.id] = surface;
      this.#columnEls[col.id] = column;
      if (col.wip !== null && col.children.length > col.wip) {
        column.setAttribute("data-wip-exceeded", "");
      }
    }
    const title = this.getAttribute("title");
    if (title) {
      const heading = document.createElement("h2");
      heading.className = "kb-title";
      heading.textContent = title;
      this.appendChild(heading);
    }
    this.appendChild(this.#columnsEl);
    this.#liveRegion = document.createElement("div");
    this.#liveRegion.className = "kb-live-region";
    this.#liveRegion.setAttribute("role", "status");
    this.#liveRegion.setAttribute("aria-live", "polite");
    this.#liveRegion.setAttribute("aria-atomic", "true");
    this.appendChild(this.#liveRegion);
    this.listen(this, "drag-surface:reorder", (e) => {
      const detail = (
        /** @type {CustomEvent} */
        e.detail
      );
      const surface = (
        /** @type {HTMLElement | null} */
        /** @type {HTMLElement} */
        e.target.closest("drag-surface")
      );
      const columnId = this.#findColumnForSurface(surface);
      if (!columnId) return;
      this.#updateCount(columnId);
      this.#syncItemsFromDom("drag");
      this.dispatchEvent(new CustomEvent("kanban-board:reorder", {
        bubbles: true,
        detail: {
          itemId: detail.itemId,
          column: columnId,
          oldIndex: detail.oldIndex,
          newIndex: detail.newIndex
        }
      }));
    });
    this.listen(this, "drag-surface:transfer", (e) => {
      const detail = (
        /** @type {CustomEvent} */
        e.detail
      );
      const fromSurface = detail.fromSurface;
      const toSurface = detail.toSurface;
      const fromColumn = this.#findColumnForSurface(fromSurface);
      const toColumn = this.#findColumnForSurface(toSurface);
      if (!fromColumn || !toColumn) return;
      if (detail.item) {
        detail.item.setAttribute("data-column", toColumn);
      }
      this.#updateCount(fromColumn);
      this.#updateCount(toColumn);
      const toPlaceholder = toSurface.querySelector(".kb-empty");
      if (toPlaceholder) toPlaceholder.remove();
      const fromDraggables = fromSurface.querySelectorAll(':scope > [draggable="true"]');
      if (fromDraggables.length === 0 && !fromSurface.querySelector(".kb-empty")) {
        const placeholder = document.createElement("p");
        placeholder.className = "kb-empty";
        placeholder.textContent = "No items";
        fromSurface.appendChild(placeholder);
      }
      const itemLabel = this.#itemLabel(detail.item);
      const fromLabel = this.#columnLabel(fromColumn);
      const toLabel = this.#columnLabel(toColumn);
      this.#announce(`${itemLabel} moved from ${fromLabel} to ${toLabel}`);
      this.#syncItemsFromDom("drag");
      this.dispatchEvent(new CustomEvent("kanban-board:transfer", {
        bubbles: true,
        detail: {
          itemId: detail.itemId,
          fromColumn,
          toColumn,
          newIndex: detail.newIndex,
          item: detail.item
        }
      }));
      const toCount = toSurface.querySelectorAll(':scope > [draggable="true"]').length;
      const toColMeta = this.#columns.find((c) => c.id === toColumn);
      if (toColMeta?.wip !== null && toColMeta?.wip !== void 0 && toCount > toColMeta.wip) {
        this.dispatchEvent(new CustomEvent("kanban-board:wip-exceeded", {
          bubbles: true,
          detail: {
            column: toColumn,
            limit: toColMeta.wip,
            count: toCount
          }
        }));
      }
    });
    this.#seedFromDom();
    const src = this.getAttribute("src");
    if (src) {
      this._loadSrc(src);
      return;
    }
    this.dispatchEvent(new CustomEvent("kanban-board:ready", {
      bubbles: true,
      detail: {
        columnCount: this.#columns.length,
        itemCount: totalItems
      }
    }));
  }
  /**
   * Walk the rendered drag-surfaces and register each draggable child by
   * its data-id so VBCollection's diff treats them as managed nodes.
   */
  #seedFromDom() {
    const items = [];
    const nodeMap = /* @__PURE__ */ new Map();
    for (const [columnId, surface] of Object.entries(this.#surfaces)) {
      const draggables = surface.querySelectorAll(':scope > [draggable="true"]');
      for (const el of draggables) {
        const id = el.getAttribute("data-id");
        if (!id) continue;
        items.push({ id, column: columnId });
        nodeMap.set(id, el);
      }
    }
    this._seedCollection(items, nodeMap);
  }
  /**
   * Re-derive the internal items array from current DOM order (used after
   * a drag mutates the DOM directly). Preserves consumer-supplied fields
   * by carrying over each item's prior shape and just updating column.
   * Emits `kanban-board:items-changed` with the given source.
   *
   * @param {'drag' | 'api' | 'attribute'} source
   */
  #syncItemsFromDom(source) {
    const next = [];
    const previous = /* @__PURE__ */ new Map();
    for (const it of this.items) {
      const k = String(it.id ?? it.storyId ?? "");
      if (k) previous.set(k, it);
    }
    for (const [columnId, surface] of Object.entries(this.#surfaces)) {
      const draggables = surface.querySelectorAll(':scope > [draggable="true"]');
      for (const el of draggables) {
        const id = el.getAttribute("data-id");
        if (!id) continue;
        const prior = previous.get(id);
        next.push(prior ? { ...prior, column: columnId } : { id, column: columnId });
      }
    }
    this._setItemsSilently(next);
    this._emit("items-changed", { items: next }, source);
  }
  teardown() {
    const title = this.querySelector(".kb-title");
    if (title) title.remove();
    if (this.#columnsEl) {
      this.#columnsEl.remove();
      this.#columnsEl = null;
    }
    if (this.#liveRegion) {
      this.#liveRegion.remove();
      this.#liveRegion = null;
    }
    this.#surfaces = {};
    this.#columnEls = {};
    this.#columns = [];
  }
  // ── Data API (HTML-first / JS-first dual contract) ──────────────
  /**
   * The current column definitions. After upgrade this reflects the parsed
   * `section data-column` children. Setting replaces all columns and
   * rebuilds the shell — items already in nodes get re-routed to the new
   * surfaces; orphaned items (column id no longer present) are dropped.
   */
  get columns() {
    return this.#columns.map((c) => ({
      id: c.id,
      label: c.label,
      wip: c.wip ?? void 0,
      color: c.color ?? void 0
    }));
  }
  set columns(value) {
    const next = (value || []).map((c) => ({
      id: c.id,
      label: c.label || this.#titleCase(c.id),
      wip: c.wip ?? null,
      color: c.color ?? null,
      children: []
    }));
    const oldShell = this.#columnsEl;
    this.#surfaces = {};
    this.#columnEls = {};
    this.#columns = next;
    const newShell = this.#assembleShell();
    this.#columnsEl = newShell;
    const swap = () => {
      if (oldShell) oldShell.remove();
      this.appendChild(newShell);
    };
    if (this.hasAttribute("data-upgraded") && oldShell) {
      viewTransitionSwap(this, swap, "kb-vt");
    } else {
      swap();
    }
  }
  /**
   * Optional custom item renderer. When set, replaces the default
   * `work-item` factory used by the `.items` setter.
   */
  get renderItem() {
    return this.#renderItem;
  }
  set renderItem(fn) {
    this.#renderItem = typeof fn === "function" ? fn : null;
  }
  /**
   * VBCollection hook: build a fresh element for a new key.
   * Default: a `work-item` with the item's fields applied via .data.
   * Always returns a draggable element with data-id set for drag-surface.
   */
  _renderItem(item) {
    let el;
    if (this.#renderItem) {
      const out = this.#renderItem(item);
      if (!(out instanceof Element)) {
        throw new Error("kanban-board: renderItem must return an Element");
      }
      el = out;
    } else {
      el = this.#defaultRenderItem(item);
    }
    if (!el.hasAttribute("draggable")) el.setAttribute("draggable", "true");
    if (!el.hasAttribute("data-id")) el.setAttribute("data-id", String(_KanbanBoard.keyOf(item)));
    return el;
  }
  /**
   * VBCollection hook: route this item to the drag-surface for its column.
   * @param {any} item
   * @param {any} _existing
   * @returns {any}
   */
  _containerFor(item, _existing) {
    const surface = this.#surfaces[item.column];
    if (!surface) {
      throw new Error(`kanban-board: no column "${item.column}" \u2014 set .columns first or include item.column matching an existing column id`);
    }
    const placeholder = surface.querySelector(":scope > .kb-empty");
    if (placeholder) placeholder.remove();
    return surface;
  }
  /**
   * VBCollection hook: refresh count badges, WIP markers, and empty
   * placeholders after every diff.
   */
  _postRender() {
    for (const id of Object.keys(this.#surfaces)) {
      this.#updateCount(id);
      const surface = this.#surfaces[id];
      const draggables = surface.querySelectorAll(':scope > [draggable="true"]');
      const placeholder = surface.querySelector(":scope > .kb-empty");
      if (draggables.length === 0 && !placeholder) {
        const p = document.createElement("p");
        p.className = "kb-empty";
        p.textContent = "No items";
        surface.appendChild(p);
      } else if (draggables.length > 0 && placeholder) {
        placeholder.remove();
      }
    }
  }
  /**
   * Default renderer: build a `work-item` and apply item fields via .data.
   * Falls back to a plain `<article>` if work-item isn't registered.
   */
  #defaultRenderItem(item) {
    const tag = customElements.get("work-item") ? "work-item" : "article";
    const el = (
      /** @type {any} */
      document.createElement(tag)
    );
    if (tag === "work-item") {
      el.data = {
        itemId: item.id ?? item.storyId,
        type: item.type,
        priority: item.priority,
        status: item.status,
        estimate: item.estimate != null ? String(item.estimate) : void 0,
        assignee: item.assignee,
        title: item.title,
        description: item.description,
        checklist: item.checklist,
        notes: item.notes,
        detail: item.detail
      };
    } else {
      el.className = "kb-card";
      el.textContent = item.title || item.label || item.id;
    }
    return el;
  }
  /**
   * Build the kb-columns shell from the current `#columns` metas and
   * populate `#surfaces` / `#columnEls`. Returns the detached shell so
   * the caller decides when to attach it (sync, or inside a View
   * Transition callback).
   */
  #assembleShell() {
    const shell = document.createElement("div");
    shell.className = "kb-columns";
    shell.setAttribute("role", "region");
    shell.setAttribute("aria-label", "Kanban board");
    for (const col of this.#columns) {
      const column = document.createElement("section");
      column.className = "kb-column";
      column.setAttribute("data-column-id", col.id);
      if (col.color) column.setAttribute("data-column-tint", col.color);
      const header = document.createElement("header");
      header.className = "kb-column-header";
      const h3 = document.createElement("h3");
      h3.textContent = col.label;
      const countBadge = document.createElement("output");
      countBadge.className = "kb-count";
      countBadge.textContent = "0";
      h3.appendChild(countBadge);
      if (col.wip != null && !isNaN(col.wip)) {
        const wipBadge = document.createElement("span");
        wipBadge.className = "kb-wip";
        wipBadge.textContent = `/ ${col.wip}`;
        wipBadge.setAttribute("aria-label", `WIP limit ${col.wip}`);
        h3.appendChild(wipBadge);
      }
      header.appendChild(h3);
      column.appendChild(header);
      const surface = document.createElement("drag-surface");
      surface.setAttribute("group", this.#groupId);
      surface.setAttribute("aria-label", `${col.label} items`);
      surface.setAttribute("data-layout", "stack");
      surface.setAttribute("data-layout-gap", "xs");
      const placeholder = document.createElement("p");
      placeholder.className = "kb-empty";
      placeholder.textContent = "No items";
      surface.appendChild(placeholder);
      column.appendChild(surface);
      shell.appendChild(column);
      this.#surfaces[col.id] = surface;
      this.#columnEls[col.id] = column;
    }
    return shell;
  }
  // ── Attribute changes ────────────────────────────────
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue || !this.isConnected) return;
    if (name === "src") this._loadSrc(newValue);
  }
  // ── JSON loading ────────────────────────────────────
  async _loadSrc(url) {
    if (!url) return;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      while (this.firstChild) this.firstChild.remove();
      for (const col of data.columns || []) {
        const section = document.createElement("section");
        section.setAttribute("data-column", col.id);
        if (col.label) section.setAttribute("data-column-label", col.label);
        if (col.wip != null) section.setAttribute("data-wip", String(col.wip));
        if (col.color) section.setAttribute("data-column-color", col.color);
        for (const item of col.items || []) {
          let el;
          if (item.persona || item.action || item.storyId) {
            el = document.createElement("user-story");
            el.setAttribute("detail", item.detail || "minimal");
            if (item.storyId) el.setAttribute("story-id", item.storyId);
            if (item.persona) el.setAttribute("persona", item.persona);
            if (item.action) el.setAttribute("action", item.action);
            if (item.benefit) el.setAttribute("benefit", item.benefit);
            if (item.priority) el.setAttribute("priority", item.priority);
            if (item.status) el.setAttribute("status", item.status);
            if (item.points) el.setAttribute("points", String(item.points));
          } else {
            el = document.createElement("article");
            el.className = "kb-card";
            el.textContent = item.text || item.label || "";
          }
          el.setAttribute("draggable", "true");
          el.dataset.id = item.id || item.storyId || "";
          section.appendChild(el);
        }
        this.appendChild(section);
      }
      const swap = () => {
        this.teardown();
        this.removeAttribute("data-upgraded");
        this.setup();
      };
      if (this.hasAttribute("data-upgraded") && this.#columnsEl) {
        viewTransitionSwap(this, swap, "kb-vt");
      } else {
        swap();
      }
    } catch (err) {
      console.warn(`[kanban-board] Failed to load src="${url}":`, err);
    }
  }
  // ── Helpers ──────────────────────────────────────────
  /**
   * Reverse-lookup: find the column id that owns a given drag-surface.
   * @param {HTMLElement | null} surface
   * @returns {string | null}
   */
  #findColumnForSurface(surface) {
    if (!surface) return null;
    for (const [id, ref] of Object.entries(this.#surfaces)) {
      if (ref === surface) return id;
    }
    return null;
  }
  /**
   * Update the count badge and WIP state for a given column.
   * @param {string} columnId
   */
  #updateCount(columnId) {
    const surface = this.#surfaces[columnId];
    const columnEl = this.#columnEls[columnId];
    if (!surface || !columnEl) return;
    const count = surface.querySelectorAll(':scope > [draggable="true"]').length;
    const badge = columnEl.querySelector(".kb-count");
    if (badge) badge.textContent = String(count);
    const colMeta = this.#columns.find((c) => c.id === columnId);
    if (colMeta?.wip !== null && colMeta?.wip !== void 0) {
      if (count > colMeta.wip) {
        columnEl.setAttribute("data-wip-exceeded", "");
      } else {
        columnEl.removeAttribute("data-wip-exceeded");
      }
    }
  }
  /**
   * Get the display label for a column.
   * @param {string} columnId
   * @returns {string}
   */
  #columnLabel(columnId) {
    const col = this.#columns.find((c) => c.id === columnId);
    return col?.label || this.#titleCase(columnId);
  }
  /**
   * Announce a message via the live region.
   * @param {string} msg
   */
  #announce(msg) {
    if (!this.#liveRegion) return;
    this.#liveRegion.textContent = "";
    requestAnimationFrame(() => {
      if (this.#liveRegion) this.#liveRegion.textContent = msg;
    });
  }
  /**
   * Get a human-readable label for a board item.
   * @param {HTMLElement} item
   * @returns {string}
   */
  #itemLabel(item) {
    return item.getAttribute("story-id") || item.getAttribute("data-id") || item.textContent?.trim().slice(0, 40) || "item";
  }
  /**
   * Convert a hyphenated or lowercase id to Title Case.
   * @param {string} str
   * @returns {string}
   */
  #titleCase(str) {
    return str.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }
};
registerComponent(
  "kanban-board",
  /** @type {any} */
  KanbanBoard
);

// src/web-components/story-map/logic.js
var StoryMap = class _StoryMap extends VBElement {
  static get observedAttributes() {
    return ["src", "compact", "title"];
  }
  static #instanceCount = 0;
  /** @type {HTMLDivElement | null} */
  #scroll = null;
  /** @type {HTMLDivElement | null} */
  #columnsEl = null;
  /** @type {Recordstring, HTMLElement} */
  #surfaces = {};
  /** @type {HTMLDivElement | null} */
  #liveRegion = null;
  /** @type {string} */
  #groupId = "";
  /** @type {Array{ id: string, label: string, journeyPhase: string | null, children: HTMLElement[] }} */
  #activities = [];
  setup() {
    this.#groupId = `sm-${++_StoryMap.#instanceCount}`;
    const sections = (
      /** @type {HTMLElement[]} */
      [
        ...this.querySelectorAll(":scope > section[data-activity]")
      ]
    );
    this.#activities = sections.map((section) => {
      const id = section.getAttribute("data-activity") || "";
      const rawLabel = section.getAttribute("data-activity-label") || "";
      const label = rawLabel || this.#titleCase(id);
      const journeyPhase = section.getAttribute("data-journey-phase") || null;
      const children = (
        /** @type {HTMLElement[]} */
        [...section.children]
      );
      return { id, label, journeyPhase, children };
    });
    for (const section of sections) {
      section.remove();
    }
    this.#scroll = document.createElement("div");
    this.#scroll.className = "sm-scroll";
    this.#scroll.setAttribute("role", "region");
    this.#scroll.setAttribute("aria-label", "Story map");
    this.#scroll.setAttribute("tabindex", "0");
    this.#columnsEl = document.createElement("div");
    this.#columnsEl.className = "sm-columns";
    let totalStories = 0;
    for (const activity of this.#activities) {
      const column = document.createElement("section");
      column.className = "sm-column";
      column.setAttribute("data-activity-column", activity.id);
      const header = document.createElement("header");
      header.className = "sm-activity-header";
      const h3 = document.createElement("h3");
      h3.textContent = activity.label;
      const countBadge = document.createElement("span");
      countBadge.className = "sm-activity-count";
      countBadge.textContent = String(activity.children.length);
      h3.appendChild(countBadge);
      header.appendChild(h3);
      column.appendChild(header);
      const surface = document.createElement("drag-surface");
      surface.setAttribute("group", this.#groupId);
      surface.setAttribute("aria-label", `${activity.label} stories`);
      surface.setAttribute("data-layout", "stack");
      surface.setAttribute("data-layout-gap", "xs");
      if (activity.children.length > 0) {
        for (const child of activity.children) {
          surface.appendChild(child);
        }
        totalStories += activity.children.length;
      } else {
        const placeholder = document.createElement("p");
        placeholder.className = "sm-empty";
        placeholder.textContent = "No stories yet";
        surface.appendChild(placeholder);
      }
      column.appendChild(surface);
      this.#columnsEl.appendChild(column);
      this.#surfaces[activity.id] = surface;
    }
    const title = this.getAttribute("title");
    if (title) {
      const heading = document.createElement("h2");
      heading.className = "sm-title";
      heading.textContent = title;
      this.appendChild(heading);
    }
    this.#scroll.appendChild(this.#columnsEl);
    this.appendChild(this.#scroll);
    this.#liveRegion = document.createElement("div");
    this.#liveRegion.className = "sm-live-region";
    this.#liveRegion.setAttribute("role", "status");
    this.#liveRegion.setAttribute("aria-live", "polite");
    this.#liveRegion.setAttribute("aria-atomic", "true");
    this.appendChild(this.#liveRegion);
    this.listen(this, "drag-surface:reorder", (e) => {
      const detail = (
        /** @type {CustomEvent} */
        e.detail
      );
      const surface = (
        /** @type {HTMLElement | null} */
        /** @type {HTMLElement} */
        e.target.closest("drag-surface")
      );
      const activityId = this.#findActivityForSurface(surface);
      if (!activityId) return;
      this.#updateCount(activityId);
      this.dispatchEvent(new CustomEvent("story-map:reorder", {
        bubbles: true,
        detail: {
          itemId: detail.itemId,
          activity: activityId,
          oldIndex: detail.oldIndex,
          newIndex: detail.newIndex
        }
      }));
    });
    this.listen(this, "drag-surface:transfer", (e) => {
      const detail = (
        /** @type {CustomEvent} */
        e.detail
      );
      const fromSurface = detail.fromSurface;
      const toSurface = detail.toSurface;
      const fromActivity = this.#findActivityForSurface(fromSurface);
      const toActivity = this.#findActivityForSurface(toSurface);
      if (!fromActivity || !toActivity) return;
      this.#updateCount(fromActivity);
      this.#updateCount(toActivity);
      const toPlaceholder = toSurface.querySelector(".sm-empty");
      if (toPlaceholder) toPlaceholder.remove();
      const fromDraggables = fromSurface.querySelectorAll(':scope > [draggable="true"]');
      if (fromDraggables.length === 0 && !fromSurface.querySelector(".sm-empty")) {
        const placeholder = document.createElement("p");
        placeholder.className = "sm-empty";
        placeholder.textContent = "No stories yet";
        fromSurface.appendChild(placeholder);
      }
      const itemLabel = this.#itemLabel(detail.item);
      this.#announce(`${itemLabel} moved from ${fromActivity} to ${toActivity}`);
      this.dispatchEvent(new CustomEvent("story-map:transfer", {
        bubbles: true,
        detail: {
          itemId: detail.itemId,
          fromActivity,
          toActivity,
          newIndex: detail.newIndex
        }
      }));
    });
    const src = this.getAttribute("src");
    if (src) {
      this._loadSrc(src);
      return;
    }
    this.dispatchEvent(new CustomEvent("story-map:ready", {
      bubbles: true,
      detail: {
        activityCount: this.#activities.length,
        storyCount: totalStories
      }
    }));
  }
  teardown() {
    if (this.#scroll) {
      this.#scroll.remove();
      this.#scroll = null;
    }
    if (this.#liveRegion) {
      this.#liveRegion.remove();
      this.#liveRegion = null;
    }
    this.#columnsEl = null;
    this.#surfaces = {};
    this.#activities = [];
  }
  // ── Data API (HTML-first / JS-first dual contract) ──────────────
  /**
   * Read the current activities + stories as a nested data array.
   * Each activity: `{ id, label, journeyPhase?, stories: [...] }`.
   * Each story: `{ id?, title?, ... }` (passed through to renderItem).
   */
  get activities() {
    return this.#activities.map((a) => ({
      id: a.id,
      label: a.label,
      journeyPhase: a.journeyPhase || void 0,
      stories: [...this.#surfaces[a.id]?.querySelectorAll(':scope > [draggable="true"]') || []].map((el) => ({
        id: el.getAttribute("data-id") || void 0,
        storyId: el.getAttribute("story-id") || void 0,
        title: el.querySelector('[slot="title"]')?.textContent?.trim() || void 0
      }))
    }));
  }
  /**
   * Replace the entire story map. Accepts a nested tree:
   *   [{ id, label, journeyPhase?, stories: [{ id, ... }] }]
   * Stories are rendered as user-story elements (via .data) by default;
   * override via `.renderStory`.
   *
   * v1 is record-shaped — full rebuild on assignment. Per-story
   * preservation across diffs is on the roadmap.
   *
   * Emits story-map:activities-changed { activities, source: 'property' }.
   */
  set activities(value) {
    const next = Array.isArray(value) ? value : [];
    while (this.firstChild) this.firstChild.remove();
    for (const a of next) {
      const section = document.createElement("section");
      section.setAttribute("data-activity", a.id || "");
      if (a.label) section.setAttribute("data-activity-label", a.label);
      if (a.journeyPhase) section.setAttribute("data-journey-phase", a.journeyPhase);
      for (const story of a.stories || []) {
        let el;
        const self = (
          /** @type {any} */
          this
        );
        if (typeof self.renderStory === "function") {
          const out = self.renderStory(story);
          el = out instanceof Element ? out : null;
        }
        if (!el) {
          if (customElements.get("user-story")) {
            el = document.createElement("user-story");
            el.data = story;
          } else {
            el = document.createElement("article");
            el.className = "sm-card";
            el.textContent = story.title || story.id || "";
          }
        }
        if (!el.hasAttribute("draggable")) el.setAttribute("draggable", "true");
        if (story.id && !el.hasAttribute("data-id")) el.setAttribute("data-id", String(story.id));
        section.appendChild(el);
      }
      this.appendChild(section);
    }
    const swap = () => {
      this.teardown();
      this.removeAttribute("data-upgraded");
      this.setup();
    };
    if (this.hasAttribute("data-upgraded") && this.#scroll) {
      viewTransitionSwap(this, swap, "sm-vt");
    } else {
      swap();
    }
    this.dispatchEvent(new CustomEvent("story-map:activities-changed", {
      detail: { activities: next, source: "property" },
      bubbles: true
    }));
  }
  // ── Attribute changes ────────────────────────────────
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue || !this.isConnected) return;
    if (name === "src") this._loadSrc(newValue);
  }
  // ── JSON loading ────────────────────────────────────
  async _loadSrc(url) {
    if (!url) return;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      while (this.firstChild) this.firstChild.remove();
      for (const activity of data.activities || []) {
        const section = document.createElement("section");
        section.setAttribute("data-activity", activity.id);
        section.setAttribute("data-activity-label", activity.label || activity.id);
        if (activity.journeyPhase) section.setAttribute("data-journey-phase", activity.journeyPhase);
        for (const story of activity.stories || []) {
          const el = document.createElement("user-story");
          el.setAttribute("draggable", "true");
          el.dataset.id = story.id || story.storyId;
          if (story.storyId || story.id) el.setAttribute("story-id", story.storyId || story.id);
          if (story.title) el.setAttribute("title", story.title);
          if (story.persona) el.setAttribute("persona", story.persona);
          if (story.action) el.setAttribute("action", story.action);
          if (story.benefit) el.setAttribute("benefit", story.benefit);
          if (story.priority) el.setAttribute("priority", story.priority);
          if (story.status) el.setAttribute("status", story.status);
          if (story.points) el.setAttribute("points", String(story.points));
          el.setAttribute("detail", story.detail || "compact");
          section.appendChild(el);
        }
        this.appendChild(section);
      }
      const swap = () => {
        this.teardown();
        this.removeAttribute("data-upgraded");
        this.setup();
      };
      if (this.hasAttribute("data-upgraded") && this.#scroll) {
        viewTransitionSwap(this, swap, "sm-vt");
      } else {
        swap();
      }
    } catch (err) {
      console.warn(`[story-map] Failed to load src="${url}":`, err);
    }
  }
  // ── Helpers ──────────────────────────────────────────
  /**
   * Reverse-lookup: find the activity id that owns a given drag-surface.
   * @param {HTMLElement | null} surface
   * @returns {string | null}
   */
  #findActivityForSurface(surface) {
    if (!surface) return null;
    for (const [id, ref] of Object.entries(this.#surfaces)) {
      if (ref === surface) return id;
    }
    return null;
  }
  /**
   * Update the count badge in the column header for a given activity.
   * @param {string} activityId
   */
  #updateCount(activityId) {
    const surface = this.#surfaces[activityId];
    if (!surface) return;
    const count = surface.querySelectorAll(':scope > [draggable="true"]').length;
    const column = surface.closest("[data-activity-column]");
    if (!column) return;
    const badge = column.querySelector(".sm-activity-count");
    if (badge) badge.textContent = String(count);
  }
  /**
   * Announce a message via the live region.
   * @param {string} msg
   */
  #announce(msg) {
    if (!this.#liveRegion) return;
    this.#liveRegion.textContent = "";
    requestAnimationFrame(() => {
      if (this.#liveRegion) this.#liveRegion.textContent = msg;
    });
  }
  /**
   * Get a human-readable label for a story item.
   * @param {HTMLElement} item
   * @returns {string}
   */
  #itemLabel(item) {
    return item.getAttribute("story-id") || item.getAttribute("data-id") || item.textContent?.trim().slice(0, 40) || "item";
  }
  /**
   * Convert a hyphenated or lowercase id to Title Case.
   * @param {string} str
   * @returns {string}
   */
  #titleCase(str) {
    return str.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }
};
registerComponent("story-map", StoryMap);

// src/web-components/review-surface/styles.js
var styles5 = `
  :host {
    display: block;
    position: relative;
    font-family: var(--_font-sans);
    line-height: 1.5;
    color: var(--_text);
    container-type: inline-size;

    --_bg:          var(--review-surface-bg, var(--color-surface, #ffffff));
    --_card:        var(--review-surface-card, var(--color-surface-raised, #f8f9fa));
    --_border:      var(--review-surface-border, var(--color-border, #e0e0e0));
    --_text:        var(--review-surface-text, var(--color-text, #1a1a1a));
    --_muted:       var(--review-surface-muted, var(--color-text-muted, #666666));
    --_accent:      var(--review-surface-accent, var(--color-interactive, #0066cc));
    --_pin-bg:      var(--review-surface-pin-bg, var(--color-interactive, #0066cc));
    --_pin-text:    var(--review-surface-pin-text, #ffffff);
    --_pin-size:    var(--review-surface-pin-size, 28px);
    --_resolved:    var(--review-surface-resolved, var(--color-success, #16a34a));
    --_radius:      var(--review-surface-radius, var(--radius-xl, 1rem));
    --_radius-m:    var(--review-surface-radius-m, var(--radius-m, 0.5rem));
    --_radius-full: var(--review-surface-radius-full, var(--radius-full, 9999px));
    --_font-sans:   var(--review-surface-font, var(--font-sans, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif));
    --_font-xs:     var(--review-surface-font-xs, var(--font-size-xs, 0.75rem));
    --_font-sm:     var(--review-surface-font-sm, var(--font-size-sm, 0.875rem));
    --_font-md:     var(--review-surface-font-md, var(--font-size-md, 1rem));
    --_space-2xs:   var(--review-surface-space-2xs, var(--size-2xs, 0.25rem));
    --_space-xs:    var(--review-surface-space-xs, var(--size-xs, 0.5rem));
    --_space-s:     var(--review-surface-space-s, var(--size-s, 0.75rem));
    --_space-m:     var(--review-surface-space-m, var(--size-m, 1rem));
    --_space-l:     var(--review-surface-space-l, var(--size-l, 1.5rem));
    --_duration:    var(--review-surface-duration, var(--duration-normal, 200ms));
    --_duration-fast: var(--review-surface-duration-fast, var(--duration-fast, 100ms));
    --_ease:        var(--review-surface-ease, var(--ease-default, ease));
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; }

  /* \u2500\u2500 Container \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  .rs-container {
    position: relative;
    display: grid;
  }

  .rs-container > ::slotted(*),
  .rs-container > .rs-overlay {
    grid-area: 1 / 1;
  }

  /* \u2500\u2500 Overlay \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  .rs-overlay {
    position: relative;
    z-index: 10;
    pointer-events: none;
    cursor: default;
  }

  :host([data-annotating]) .rs-overlay {
    pointer-events: auto;
    cursor: crosshair;
  }

  /* \u2500\u2500 Pin markers \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  .rs-pin {
    position: absolute;
    transform: translate(-50%, -50%);
    width: var(--_pin-size);
    height: var(--_pin-size);
    border-radius: var(--_radius-full);
    background: var(--_pin-bg);
    color: var(--_pin-text);
    border: 2px solid var(--_pin-text);
    font-size: var(--_font-xs);
    font-weight: 700;
    font-family: inherit;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    pointer-events: auto;
    padding: 0;
    line-height: 1;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    transition: transform var(--_duration-fast) var(--_ease),
                box-shadow var(--_duration-fast) var(--_ease);
    z-index: 11;
  }

  .rs-pin:hover {
    transform: translate(-50%, -50%) scale(1.15);
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.25);
  }

  .rs-pin:focus-visible {
    outline: 2px solid var(--_accent);
    outline-offset: 2px;
  }

  .rs-pin[data-resolved] {
    background: var(--_resolved);
  }

  .rs-pin[data-active] {
    transform: translate(-50%, -50%) scale(1.2);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--_pin-bg) 30%, transparent);
  }

  /* \u2500\u2500 Popover \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  .rs-popover {
    position: absolute;
    z-index: 20;
    width: 300px;
    max-height: 400px;
    overflow-y: auto;
    background: var(--_bg);
    border: 1px solid var(--_border);
    border-radius: var(--_radius-m);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08);
    padding: 0;
    opacity: 0;
    transform: translateY(4px);
    transition: opacity var(--_duration) var(--_ease), transform var(--_duration) var(--_ease);
    pointer-events: none;
  }

  .rs-popover[data-open] {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }

  .rs-popover__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 12px 8px;
    border-block-end: 1px solid var(--_border);
  }

  .rs-popover__title {
    font-size: var(--_font-sm);
    font-weight: 700;
    color: var(--_text);
  }

  .rs-popover__actions {
    display: flex;
    gap: 4px;
  }

  .rs-popover__btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    border: none;
    border-radius: 4px;
    background: transparent;
    color: var(--_muted);
    cursor: pointer;
    padding: 0;
    transition: background var(--_duration-fast) var(--_ease), color var(--_duration-fast) var(--_ease);
  }

  .rs-popover__btn svg {
    width: 14px;
    height: 14px;
  }

  .rs-popover__btn:hover {
    background: var(--_border);
    color: var(--_text);
  }

  .rs-popover__btn--resolve {
    color: var(--_resolved);
  }

  .rs-popover__btn--resolve:hover {
    background: color-mix(in srgb, var(--_resolved) 15%, transparent);
  }

  .rs-popover__btn--delete {
    color: var(--color-error-text, var(--color-error, #dc2626));
  }

  .rs-popover__btn--delete:hover {
    background: color-mix(in oklch, var(--color-error, #dc2626) 8%, var(--_card));
    color: var(--color-error-text, var(--color-error, #dc2626));
  }

  /* \u2500\u2500 Comment thread \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  .rs-comment {
    padding: 10px 12px;
  }

  .rs-comment__meta {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-block-end: 4px;
  }

  .rs-comment__avatar {
    width: 22px;
    height: 22px;
    border-radius: var(--_radius-full);
    font-size: 10px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-inverted, #fff);
    flex-shrink: 0;
  }

  .rs-comment__author {
    font-size: var(--_font-xs);
    font-weight: 600;
    color: var(--_text);
  }

  .rs-comment__time {
    font-size: 11px;
    color: var(--_muted);
  }

  .rs-comment__text {
    font-size: var(--_font-sm);
    color: var(--_text);
    line-height: 1.5;
    white-space: pre-wrap;
    word-break: break-word;
  }

  /* Replies */
  .rs-replies {
    border-block-start: 1px solid var(--_border);
  }

  .rs-reply {
    padding: 8px 12px;
    border-block-end: 1px solid color-mix(in srgb, var(--_border) 50%, transparent);
  }

  .rs-reply:last-child {
    border-block-end: none;
  }

  /* \u2500\u2500 Input area \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  .rs-input {
    display: flex;
    gap: 6px;
    padding: 8px 12px;
    border-block-start: 1px solid var(--_border);
    background: var(--_card);
    border-radius: 0 0 var(--_radius-m) var(--_radius-m);
  }

  .rs-input__field {
    flex: 1;
    min-height: 32px;
    max-height: 80px;
    padding: 6px 10px;
    border: 1px solid var(--_border);
    border-radius: 6px;
    font-family: inherit;
    font-size: var(--_font-xs);
    line-height: 1.4;
    color: var(--_text);
    background: var(--_bg);
    resize: none;
  }

  .rs-input__field:focus {
    outline: 2px solid var(--_accent);
    outline-offset: -1px;
    border-color: var(--_accent);
  }

  .rs-input__field::placeholder {
    color: var(--_muted);
  }

  .rs-input__submit {
    align-self: flex-end;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 6px;
    background: var(--_accent);
    color: var(--color-text-inverted, #fff);
    cursor: pointer;
    padding: 0;
    flex-shrink: 0;
    transition: background var(--_duration-fast) var(--_ease);
  }

  .rs-input__submit svg {
    width: 14px;
    height: 14px;
  }

  .rs-input__submit:hover {
    background: color-mix(in srgb, var(--_accent) 85%, #000);
  }

  .rs-input__submit:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  /* \u2500\u2500 Toolbar \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  .rs-toolbar {
    display: flex;
    align-items: center;
    gap: var(--_space-xs);
    padding: var(--_space-xs) var(--_space-s);
    background: var(--_card);
    border: 1px solid var(--_border);
    border-radius: var(--_radius-m);
    margin-block-start: var(--_space-xs);
  }

  .rs-toolbar__btn {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 10px;
    border: 1px solid var(--_border);
    border-radius: 6px;
    background: var(--_bg);
    color: var(--_text);
    font-family: inherit;
    font-size: var(--_font-xs);
    font-weight: 600;
    cursor: pointer;
    line-height: 1;
    transition: background var(--_duration-fast) var(--_ease),
                border-color var(--_duration-fast) var(--_ease);
  }

  .rs-toolbar__btn svg {
    width: 14px;
    height: 14px;
  }

  .rs-toolbar__btn:hover {
    background: var(--_border);
  }

  .rs-toolbar__btn[aria-pressed="true"] {
    background: var(--_accent);
    color: var(--color-text-inverted, #fff);
    border-color: var(--_accent);
  }

  .rs-toolbar__count {
    font-size: var(--_font-xs);
    color: var(--_muted);
    margin-inline-start: auto;
  }

  /* \u2500\u2500 Resolved badge \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  .rs-resolved-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    font-weight: 600;
    color: var(--_resolved);
    padding: 2px 8px;
    border-radius: var(--_radius-full);
    background: color-mix(in srgb, var(--_resolved) 12%, transparent);
  }

  .rs-resolved-badge svg {
    width: 12px;
    height: 12px;
  }

  /* \u2500\u2500 Live region \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  .rs-live {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
  }

  /* \u2500\u2500 Compact \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  :host([compact]) {
    --_pin-size: 22px;
  }

  :host([compact]) .rs-popover {
    width: 250px;
    max-height: 300px;
  }

  :host([compact]) .rs-toolbar {
    padding: 3px var(--_space-xs);
  }

  :host([compact]) .rs-toolbar__btn {
    font-size: 11px;
    padding: 3px 8px;
  }

  /* \u2500\u2500 Responsive \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  @container (max-width: 400px) {
    .rs-popover {
      width: 240px;
    }

    .rs-toolbar {
      flex-wrap: wrap;
    }
  }

  /* \u2500\u2500 Motion \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  @media (prefers-reduced-motion: reduce) {
    .rs-pin,
    .rs-popover,
    .rs-toolbar__btn,
    .rs-popover__btn,
    .rs-input__submit {
      transition: none;
    }
  }

  /* \u2500\u2500 Print \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  @media print {
    .rs-overlay,
    .rs-toolbar,
    .rs-popover {
      display: none;
    }
  }

  /* \u2500\u2500 Utility \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  .state-msg        { padding: var(--_space-l); font-size: var(--_font-sm); color: var(--_muted); font-style: italic; }
  .state-msg--error { color: var(--color-error-text, var(--color-error, #dc2626)); }
`;

// src/lib/vb-store.js
var PREFIX = "vb:";
function createLocalStorageBackend() {
  const storage = globalThis.localStorage;
  if (!storage) {
    throw new Error("VBStore: localStorage is not available in this environment");
  }
  return {
    async getRaw(key) {
      return storage.getItem(key);
    },
    async setRaw(key, value) {
      storage.setItem(key, value);
    },
    async removeRaw(key) {
      storage.removeItem(key);
    },
    async keys(prefix) {
      const out = [];
      for (let i = 0; i < storage.length; i++) {
        const k = storage.key(i);
        if (k && k.startsWith(prefix)) out.push(k);
      }
      return out;
    }
  };
}
var backend = null;
function getBackend() {
  if (!backend) backend = createLocalStorageBackend();
  return backend;
}
function fullKey(namespace, key) {
  if (typeof namespace !== "string" || !namespace) {
    throw new TypeError("VBStore: namespace must be a non-empty string");
  }
  if (typeof key !== "string" || !key) {
    throw new TypeError("VBStore: key must be a non-empty string");
  }
  return `${PREFIX}${namespace}:${key}`;
}
function namespacePrefix(namespace) {
  if (typeof namespace !== "string" || !namespace) {
    throw new TypeError("VBStore: namespace must be a non-empty string");
  }
  return `${PREFIX}${namespace}:`;
}
function parseEnvelope(raw) {
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && typeof parsed.timestamp === "number") {
      return (
        /** @type {Envelope} */
        parsed
      );
    }
  } catch {
  }
  return null;
}
var VBStore = {
  /**
   * Swap the backend. Testing helper; not intended for normal use.
   * Pass `null` to reset to the default localStorage backend.
   * @param {{ backend?: Backend | null }} [config]
   */
  configure(config = {}) {
    backend = config.backend ?? null;
  },
  /**
   * Persist a value under `namespace:key`. Always stamps a timestamp.
   * @param {string} namespace
   * @param {string} key
   * @param {unknown} value
   */
  async set(namespace, key, value) {
    const envelope = { data: value, timestamp: Date.now() };
    await getBackend().setRaw(fullKey(namespace, key), JSON.stringify(envelope));
  },
  /**
   * Read a value under `namespace:key`. Returns `null` if missing, unparseable,
   * or older than `options.maxAge` milliseconds.
   * @param {string} namespace
   * @param {string} key
   * @param {{ maxAge?: number }} [options]
   * @returns {Promiseunknown | null}
   */
  async get(namespace, key, options) {
    const raw = await getBackend().getRaw(fullKey(namespace, key));
    if (raw == null) return null;
    const envelope = parseEnvelope(raw);
    if (!envelope) return null;
    if (options?.maxAge != null && Date.now() - envelope.timestamp > options.maxAge) {
      return null;
    }
    return envelope.data;
  },
  /**
   * Delete a single key.
   * @param {string} namespace
   * @param {string} key
   */
  async remove(namespace, key) {
    await getBackend().removeRaw(fullKey(namespace, key));
  },
  /**
   * List every `{ key, data, timestamp }` entry in a namespace.
   * Unparseable entries are skipped silently.
   * @param {string} namespace
   * @returns {PromiseArray<{ key: string, data: unknown, timestamp: number }>}
   */
  async list(namespace) {
    const prefix = namespacePrefix(namespace);
    const keys = await getBackend().keys(prefix);
    const out = [];
    for (const full of keys) {
      const raw = await getBackend().getRaw(full);
      if (raw == null) continue;
      const env = parseEnvelope(raw);
      if (!env) continue;
      out.push({ key: full.slice(prefix.length), data: env.data, timestamp: env.timestamp });
    }
    return out;
  },
  /**
   * Remove every key under a namespace.
   * @param {string} namespace
   */
  async clear(namespace) {
    const prefix = namespacePrefix(namespace);
    const keys = await getBackend().keys(prefix);
    for (const k of keys) await getBackend().removeRaw(k);
  },
  /** Remove every `vb:*` key. Leaves unrelated storage alone. */
  async clearAll() {
    const keys = await getBackend().keys(PREFIX);
    for (const k of keys) await getBackend().removeRaw(k);
  },
  /**
   * Persist many entries under the same namespace.
   * @param {string} namespace
   * @param {Array[string, unknown]} entries
   */
  async setMany(namespace, entries) {
    for (const [key, value] of entries) {
      await VBStore.set(namespace, key, value);
    }
  }
};

// src/utils/copy-init.js
var COPIED_DURATION = 1500;
var ANNOUNCE_DURATION = 1e3;
var SELECTOR = "[data-copy], [data-copy-target], [data-paste-target]";
var DEFAULT_ANNOUNCE = "Copied to clipboard";
var DEFAULT_PASTE_ANNOUNCE = "Pasted from clipboard";
var resetTimers = /* @__PURE__ */ new WeakMap();
async function copyText(text, options = {}) {
  if (text == null || text === "") return false;
  const { button, announceMessage = DEFAULT_ANNOUNCE, duration = COPIED_DURATION } = options;
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    return false;
  }
  applyFeedback({ button, duration, announceMessage, eventDetail: { text } });
  return true;
}
function applyFeedback({ button, duration, announceMessage, eventDetail, state = "copied", eventName = "copy" }) {
  if (button) {
    button.dataset.state = state;
    const prior = resetTimers.get(button);
    if (prior) clearTimeout(prior);
    resetTimers.set(button, setTimeout(() => {
      delete button.dataset.state;
      resetTimers.delete(button);
    }, duration));
    button.dispatchEvent(new CustomEvent(eventName, {
      bubbles: true,
      detail: eventDetail
    }));
  }
  announce(announceMessage, button ?? document.body);
}
async function pasteFromClipboard(target, options = {}) {
  const { button, announceMessage = DEFAULT_PASTE_ANNOUNCE, duration = COPIED_DURATION } = options;
  let text;
  try {
    text = await navigator.clipboard.readText();
  } catch {
    return null;
  }
  if (target) {
    if ("value" in target && (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement)) {
      target.value = text;
    } else {
      target.textContent = text;
    }
    target.dispatchEvent(new Event("input", { bubbles: true }));
  }
  applyFeedback({
    button,
    duration,
    announceMessage,
    eventDetail: { text },
    state: "pasted",
    eventName: "paste"
  });
  return text;
}
function initCopyButtons(root = document) {
  root.querySelectorAll(SELECTOR).forEach(enhanceButton);
}
function enhanceButton(button) {
  if (button.hasAttribute("data-copy-init")) return;
  button.setAttribute("data-copy-init", "");
  button.addEventListener("click", () => {
    if (button.dataset.pasteTarget) {
      const target = document.querySelector(button.dataset.pasteTarget);
      if (!target) return;
      pasteFromClipboard(target, { button });
      return;
    }
    const text = getText(button);
    if (!text) return;
    copyText(text, { button });
  });
}
function getText(button) {
  if (button.dataset.copy) return button.dataset.copy;
  if (button.dataset.copyTarget) {
    const target = document.querySelector(button.dataset.copyTarget);
    if (!target) return "";
    const attr = button.dataset.copyAttr;
    if (attr) return target.getAttribute(attr) ?? "";
    return target.textContent ?? "";
  }
  return "";
}
function announce(message, context) {
  const el = document.createElement("div");
  el.setAttribute("role", "status");
  el.setAttribute("aria-live", "polite");
  el.className = "visually-hidden";
  el.textContent = message;
  context.appendChild(el);
  setTimeout(() => el.remove(), ANNOUNCE_DURATION);
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => initCopyButtons());
} else {
  initCopyButtons();
}
var observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (node.nodeType !== Node.ELEMENT_NODE) continue;
      const el = (
        /** @type {Element} */
        node
      );
      if (el.matches(SELECTOR)) {
        enhanceButton(
          /** @type {HTMLElement} */
          el
        );
      }
      el.querySelectorAll(SELECTOR).forEach((child) => enhanceButton(
        /** @type {HTMLElement} */
        child
      ));
    }
  }
});
observer.observe(document.documentElement, { childList: true, subtree: true });

// src/web-components/review-surface/logic.js
var MemoryAdapter = class {
  #pins = /* @__PURE__ */ new Map();
  async load() {
    return [...this.#pins.values()];
  }
  async save(pin) {
    if (!pin.id) pin.id = crypto.randomUUID();
    this.#pins.set(pin.id, pin);
    return pin;
  }
  async update(id, changes) {
    const pin = this.#pins.get(id);
    if (!pin) throw new Error(`Pin ${id} not found`);
    Object.assign(pin, changes);
    return pin;
  }
  async remove(id) {
    this.#pins.delete(id);
  }
};
var LocalStorageAdapter = class {
  #key;
  constructor(key = "default") {
    this.#key = key;
  }
  async #read() {
    const pins = await VBStore.get("reviews", this.#key);
    return Array.isArray(pins) ? pins : [];
  }
  async #write(pins) {
    await VBStore.set("reviews", this.#key, pins);
  }
  async load() {
    return this.#read();
  }
  async save(pin) {
    if (!pin.id) pin.id = crypto.randomUUID();
    const pins = await this.#read();
    pins.push(pin);
    await this.#write(pins);
    return pin;
  }
  async update(id, changes) {
    const pins = await this.#read();
    const idx = pins.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error(`Pin ${id} not found`);
    Object.assign(pins[idx], changes);
    await this.#write(pins);
    return pins[idx];
  }
  async remove(id) {
    const pins = (await this.#read()).filter((p) => p.id !== id);
    await this.#write(pins);
  }
};
var RestAdapter = class {
  #endpoint;
  constructor(endpoint) {
    if (!endpoint) throw new Error("RestAdapter requires an endpoint URL");
    this.#endpoint = endpoint.replace(/\/$/, "");
  }
  async load() {
    const res = await fetch(this.#endpoint);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : data.pins || [];
  }
  async save(pin) {
    const res = await fetch(this.#endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pin)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }
  async update(id, changes) {
    const res = await fetch(`${this.#endpoint}/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(changes)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }
  async remove(id) {
    const res = await fetch(`${this.#endpoint}/${encodeURIComponent(id)}`, {
      method: "DELETE"
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  }
};
var ReviewSurface = class extends HTMLElement {
  static get observedAttributes() {
    return ["src", "editable", "adapter", "endpoint", "storage-key", "author", "compact", "show-resolved"];
  }
  #slotCache = /* @__PURE__ */ new Map();
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.__pins = [];
    this.__adapter = null;
    this._activePin = null;
    this._annotating = false;
  }
  /* ── Properties ─────────────────────────────────── */
  /** @returns {Object[]} */
  get pins() {
    return this.__pins;
  }
  /**
   * Replace the pin list and re-render. Idempotent — assigning the
   * same array reference is a no-op. Emits review-surface:pins-changed
   * with `source: 'property'` so reactive consumers can filter their
   * own assignments out of the event stream.
   * @param {Object[]} data
   */
  set pins(data) {
    const next = Array.isArray(data) ? data : [];
    if (this.__pins === next) return;
    this.__pins = next;
    if (this.isConnected) this._render();
    this.dispatchEvent(new CustomEvent("review-surface:pins-changed", {
      detail: { pins: next, source: "property" },
      bubbles: true,
      composed: true
    }));
  }
  /** @returns {MemoryAdapter|LocalStorageAdapter|RestAdapter|null} */
  get adapter() {
    return this.__adapter;
  }
  /** @param {Object} adapterInstance */
  set adapter(adapterInstance) {
    this.__adapter = adapterInstance;
    if (this.isConnected) this._loadFromAdapter();
  }
  /* ── Slot caching ───────────────────────────────── */
  #cacheSlotValues() {
    for (const child of this.children) {
      const slot = child.getAttribute("slot");
      if (slot) this.#slotCache.set(slot, child.textContent.trim());
    }
  }
  _resolve(attr) {
    return this.getAttribute(attr) || this.#slotCache.get(attr) || "";
  }
  /* ── Lifecycle ─────────────────────────────────── */
  connectedCallback() {
    this.#cacheSlotValues();
    this.setAttribute("data-upgraded", "");
    this.#resolveAdapter();
    if (this.hasAttribute("src")) {
      this._loadSrc(this.getAttribute("src"));
    } else {
      this._loadFromAdapter();
    }
  }
  disconnectedCallback() {
    this.removeAttribute("data-upgraded");
    this.removeAttribute("data-annotating");
  }
  attributeChangedCallback(name) {
    if (!this.isConnected) return;
    if (name === "src") {
      this._loadSrc(this.getAttribute("src"));
    } else if (name === "adapter" || name === "endpoint" || name === "storage-key") {
      this.#resolveAdapter();
      this._loadFromAdapter();
    } else {
      this._render();
    }
  }
  /* ── Adapter resolution ────────────────────────── */
  #resolveAdapter() {
    if (this.__adapter && !(this.__adapter instanceof MemoryAdapter) && !(this.__adapter instanceof LocalStorageAdapter) && !(this.__adapter instanceof RestAdapter)) {
      return;
    }
    const type = this.getAttribute("adapter") || "memory";
    switch (type) {
      case "local":
        this.__adapter = new LocalStorageAdapter(this.getAttribute("storage-key") || "default");
        break;
      case "rest":
        try {
          this.__adapter = new RestAdapter(this.getAttribute("endpoint") ?? "");
        } catch {
          this.__adapter = new MemoryAdapter();
        }
        break;
      default:
        this.__adapter = new MemoryAdapter();
    }
  }
  /* ── Data loading ──────────────────────────────── */
  async _loadSrc(src) {
    if (!src || !this.shadowRoot) return;
    this.shadowRoot.innerHTML = `<style>${styles5}</style><div class="state-msg">Loading\u2026</div>`;
    try {
      const res = await fetch(src);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      this.__pins = Array.isArray(data) ? data : data.pins || [];
      this._render();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.shadowRoot.innerHTML = `<style>${styles5}</style><div class="state-msg state-msg--error">Could not load pins: ${esc(msg)}</div>`;
    }
  }
  async _loadFromAdapter() {
    if (!this.__adapter) return;
    try {
      this.__pins = await this.__adapter.load();
    } catch {
      this.__pins = [];
    }
    this._render();
  }
  /* ── Public API ────────────────────────────────── */
  /**
   * Add a pin programmatically.
   * @param {{ x: number, y: number, text: string, author?: string }} pinData
   * @returns {PromiseObject}
   */
  async addPin(pinData) {
    const pin = {
      id: crypto.randomUUID(),
      x: Math.max(0, Math.min(100, pinData.x)),
      y: Math.max(0, Math.min(100, pinData.y)),
      text: pinData.text || "",
      author: pinData.author || this.getAttribute("author") || "Anonymous",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      resolved: false,
      resolvedBy: null,
      resolvedAt: null,
      replies: []
    };
    if (this.__adapter) {
      await this.__adapter.save(pin);
    }
    this.__pins.push(pin);
    this._render();
    this.#announce(`Pin ${this.#visiblePins().length} added`);
    this.dispatchEvent(new CustomEvent("review-surface:add", {
      bubbles: true,
      composed: true,
      detail: { pin }
    }));
    return pin;
  }
  /**
   * Remove a pin by ID.
   * @param {string} id
   */
  async removePin(id) {
    const pin = this.__pins.find((p) => p.id === id);
    if (!pin) return;
    if (this.__adapter) {
      await this.__adapter.remove(id);
    }
    this.__pins = this.__pins.filter((p) => p.id !== id);
    if (this._activePin === id) this._activePin = null;
    this._render();
    this.#announce("Pin removed");
    this.dispatchEvent(new CustomEvent("review-surface:remove", {
      bubbles: true,
      composed: true,
      detail: { pin }
    }));
  }
  /**
   * Mark a pin as resolved.
   * @param {string} id
   */
  async resolvePin(id) {
    const pin = this.__pins.find((p) => p.id === id);
    if (!pin) return;
    const changes = {
      resolved: true,
      resolvedBy: this.getAttribute("author") || "Anonymous",
      resolvedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    if (this.__adapter) {
      await this.__adapter.update(id, changes);
    }
    Object.assign(pin, changes);
    this._render();
    this.#announce("Pin resolved");
    this.dispatchEvent(new CustomEvent("review-surface:resolve", {
      bubbles: true,
      composed: true,
      detail: { pin }
    }));
  }
  /**
   * Re-open a resolved pin.
   * @param {string} id
   */
  async unresolvePin(id) {
    const pin = this.__pins.find((p) => p.id === id);
    if (!pin) return;
    const changes = { resolved: false, resolvedBy: null, resolvedAt: null };
    if (this.__adapter) {
      await this.__adapter.update(id, changes);
    }
    Object.assign(pin, changes);
    this._render();
    this.#announce("Pin re-opened");
    this.dispatchEvent(new CustomEvent("review-surface:update", {
      bubbles: true,
      composed: true,
      detail: { pin, changes }
    }));
  }
  /**
   * Export all pins as a plain array.
   * @returns {Object[]}
   */
  exportPins() {
    return structuredClone(this.__pins);
  }
  /**
   * Import pins from an array (replaces current).
   * @param {Object[]} data
   */
  importPins(data) {
    this.__pins = Array.isArray(data) ? structuredClone(data) : [];
    this._activePin = null;
    this._render();
  }
  /* ── Render ────────────────────────────────────── */
  #visiblePins() {
    const showResolved = this.hasAttribute("show-resolved");
    return this.__pins.filter((p) => showResolved || !p.resolved).sort((a, b) => new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime());
  }
  _render() {
    if (!this.shadowRoot) return;
    const editable = this.hasAttribute("editable");
    const visible = this.#visiblePins();
    const activePin = this._activePin ? this.__pins.find((p) => p.id === this._activePin) : null;
    this.setAttribute("pin-count", String(visible.length));
    this.shadowRoot.innerHTML = `<style>${styles5}</style>
      <div class="rs-container">
        <slot></slot>
        <div class="rs-overlay" role="img" aria-label="Review annotation surface">
          ${visible.map((pin, i) => this._renderPin(pin, i + 1)).join("")}
        </div>
        ${activePin ? this._renderPopover(activePin, editable) : ""}
      </div>
      ${editable ? this._renderToolbar(visible.length) : ""}
      <div class="rs-live" aria-live="polite" aria-atomic="true"></div>`;
    this._bindListeners(editable);
    this.dispatchEvent(new CustomEvent("review-surface:ready", {
      bubbles: true,
      composed: true,
      detail: { pinCount: visible.length }
    }));
  }
  /* ── Pin marker ────────────────────────────────── */
  _renderPin(pin, number) {
    const preview = pin.text ? pin.text.slice(0, 50) : "Empty pin";
    return `<button class="rs-pin"
      data-pin-id="${esc(pin.id)}"
      ${pin.resolved ? "data-resolved" : ""}
      ${this._activePin === pin.id ? "data-active" : ""}
      style="left:${pin.x}%;top:${pin.y}%"
      aria-label="Pin ${number}: ${esc(preview)}"
      aria-expanded="${this._activePin === pin.id}"
      aria-haspopup="dialog">
      <span class="rs-pin__number">${number}</span>
    </button>`;
  }
  /* ── Popover ───────────────────────────────────── */
  _renderPopover(pin, editable) {
    const number = this.#visiblePins().findIndex((p) => p.id === pin.id) + 1;
    return `<div class="rs-popover" data-open
      style="left:${Math.min(pin.x, 70)}%;top:${pin.y}%"
      role="dialog"
      aria-labelledby="rs-popover-title-${esc(pin.id)}">

      <div class="rs-popover__header">
        <span class="rs-popover__title" id="rs-popover-title-${esc(pin.id)}">
          Pin ${number}
          ${pin.resolved ? `<span class="rs-resolved-badge">${lucideSvg(UX_ICONS.checkCircle)} Resolved</span>` : ""}
        </span>
        <div class="rs-popover__actions">
          ${editable && !pin.resolved ? `
            <button class="rs-popover__btn rs-popover__btn--resolve" data-action="resolve" data-pin-id="${esc(pin.id)}"
              aria-label="Resolve pin" title="Resolve">${lucideSvg(UX_ICONS.checkCircle)}</button>` : ""}
          ${editable && pin.resolved ? `
            <button class="rs-popover__btn" data-action="unresolve" data-pin-id="${esc(pin.id)}"
              aria-label="Re-open pin" title="Re-open">${lucideSvg(UX_ICONS.messageCircle)}</button>` : ""}
          ${editable ? `
            <button class="rs-popover__btn rs-popover__btn--delete" data-action="delete" data-pin-id="${esc(pin.id)}"
              aria-label="Delete pin" title="Delete">${lucideSvg(UX_ICONS.x)}</button>` : ""}
          <button class="rs-popover__btn" data-action="close"
            aria-label="Close">${lucideSvg(UX_ICONS.x)}</button>
        </div>
      </div>

      <div class="rs-comment">
        <div class="rs-comment__meta">
          <span class="rs-comment__avatar" style="background:${hashColor(pin.author || "Anonymous")}">${initials(pin.author || "Anonymous")}</span>
          <span class="rs-comment__author">${esc(pin.author || "Anonymous")}</span>
          <span class="rs-comment__time">${this.#formatTime(pin.createdAt)}</span>
        </div>
        <div class="rs-comment__text">${esc(pin.text)}</div>
      </div>

      ${pin.replies?.length ? `
        <div class="rs-replies">
          ${pin.replies.map((reply) => `
            <div class="rs-reply">
              <div class="rs-comment__meta">
                <span class="rs-comment__avatar" style="background:${hashColor(reply.author || "Anonymous")}">${initials(reply.author || "Anonymous")}</span>
                <span class="rs-comment__author">${esc(reply.author || "Anonymous")}</span>
                <span class="rs-comment__time">${this.#formatTime(reply.createdAt)}</span>
              </div>
              <div class="rs-comment__text">${esc(reply.text)}</div>
            </div>
          `).join("")}
        </div>` : ""}

      ${editable ? `
        <div class="rs-input">
          <textarea class="rs-input__field" placeholder="Reply\u2026" rows="1"
            aria-label="Reply to pin ${number}"></textarea>
          <button class="rs-input__submit" data-action="reply" data-pin-id="${esc(pin.id)}"
            aria-label="Send reply">${lucideSvg(UX_ICONS.send)}</button>
        </div>` : ""}

    </div>`;
  }
  /* ── Toolbar ───────────────────────────────────── */
  _renderToolbar(count) {
    return `<div class="rs-toolbar" role="toolbar" aria-label="Review tools">
      <button class="rs-toolbar__btn" data-action="toggle-mode"
        aria-pressed="${this._annotating}"
        title="Toggle annotate mode">
        ${lucideSvg(UX_ICONS.mapPin)} Annotate
      </button>
      <button class="rs-toolbar__btn" data-action="export"
        title="Export pins as JSON">
        ${lucideSvg(UX_ICONS.download)} Export
      </button>
      <output class="rs-toolbar__count">${count} pin${count !== 1 ? "s" : ""}</output>
    </div>`;
  }
  /* ── Event binding ─────────────────────────────── */
  _bindListeners(editable) {
    const root = this.shadowRoot;
    if (!root) return;
    root.querySelectorAll(".rs-pin").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = (
          /** @type {HTMLElement} */
          btn.dataset.pinId ?? null
        );
        this._activePin = this._activePin === id ? null : id;
        this._render();
        if (this._activePin) {
          this.dispatchEvent(new CustomEvent("review-surface:select", {
            bubbles: true,
            composed: true,
            detail: { pin: this.__pins.find((p) => p.id === id) }
          }));
        }
      });
    });
    const overlay = root.querySelector(".rs-overlay");
    if (overlay && editable) {
      overlay.addEventListener("click", (e) => {
        if (!this._annotating) return;
        const me = (
          /** @type {MouseEvent} */
          e
        );
        const target = (
          /** @type {Element | null} */
          me.target
        );
        if (target?.closest(".rs-pin")) return;
        const rect = overlay.getBoundingClientRect();
        const x = (me.clientX - rect.left) / rect.width * 100;
        const y = (me.clientY - rect.top) / rect.height * 100;
        this.#promptNewPin(x, y);
      });
    }
    root.querySelectorAll("[data-action]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const action = (
          /** @type {HTMLElement} */
          btn.dataset.action
        );
        const pinId = (
          /** @type {HTMLElement} */
          btn.dataset.pinId
        );
        switch (action) {
          case "close":
            this._activePin = null;
            this._render();
            break;
          case "resolve":
            if (pinId) this.resolvePin(pinId);
            break;
          case "unresolve":
            if (pinId) this.unresolvePin(pinId);
            break;
          case "delete":
            if (pinId) this.removePin(pinId);
            break;
          case "toggle-mode":
            this._annotating = !this._annotating;
            if (this._annotating) {
              this.setAttribute("data-annotating", "");
            } else {
              this.removeAttribute("data-annotating");
            }
            this._render();
            this.dispatchEvent(new CustomEvent("review-surface:mode", {
              bubbles: true,
              composed: true,
              detail: { mode: this._annotating ? "annotate" : "view" }
            }));
            break;
          case "export":
            this.#exportToClipboard();
            break;
          case "reply":
            this.#submitReply(pinId);
            break;
        }
      });
    });
    const replyField = root.querySelector(".rs-input__field");
    if (replyField) {
      replyField.addEventListener("keydown", (e) => {
        const ke = (
          /** @type {KeyboardEvent} */
          e
        );
        if (ke.key === "Enter" && !ke.shiftKey) {
          ke.preventDefault();
          const replyBtn = (
            /** @type {HTMLElement | null} */
            root.querySelector('[data-action="reply"]')
          );
          const pinId = replyBtn?.dataset.pinId;
          if (pinId) this.#submitReply(pinId);
        }
      });
    }
    root.addEventListener("keydown", (e) => {
      const ke = (
        /** @type {KeyboardEvent} */
        e
      );
      if (ke.key === "Escape") {
        if (this._activePin) {
          this._activePin = null;
          this._render();
        } else if (this._annotating) {
          this._annotating = false;
          this.removeAttribute("data-annotating");
          this._render();
          this.dispatchEvent(new CustomEvent("review-surface:mode", {
            bubbles: true,
            composed: true,
            detail: { mode: "view" }
          }));
        }
      }
    });
  }
  /* ── Internal helpers ──────────────────────────── */
  async #promptNewPin(x, y) {
    const author = this.getAttribute("author") || "Anonymous";
    const pin = await this.addPin({ x, y, text: "", author });
    this._activePin = pin.id;
    this._render();
    requestAnimationFrame(() => {
      const field = (
        /** @type {HTMLTextAreaElement | null} */
        this.shadowRoot?.querySelector(".rs-input__field") ?? null
      );
      field?.focus();
    });
  }
  async #submitReply(pinId) {
    const field = (
      /** @type {HTMLTextAreaElement | null} */
      this.shadowRoot?.querySelector(".rs-input__field") ?? null
    );
    if (!field) return;
    const text = field.value.trim();
    if (!text) return;
    const pin = this.__pins.find((p) => p.id === pinId);
    if (!pin) return;
    const reply = {
      id: crypto.randomUUID(),
      text,
      author: this.getAttribute("author") || "Anonymous",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    if (!pin.replies) pin.replies = [];
    if (!pin.text) {
      pin.text = text;
      if (this.__adapter) {
        await this.__adapter.update(pinId, { text });
      }
    } else {
      pin.replies.push(reply);
      if (this.__adapter) {
        await this.__adapter.update(pinId, { replies: pin.replies });
      }
    }
    this._render();
    this.#announce("Reply added");
    requestAnimationFrame(() => {
      const newField = (
        /** @type {HTMLTextAreaElement | null} */
        this.shadowRoot?.querySelector(".rs-input__field") ?? null
      );
      newField?.focus();
    });
    this.dispatchEvent(new CustomEvent("review-surface:update", {
      bubbles: true,
      composed: true,
      detail: { pin, changes: { replies: pin.replies } }
    }));
  }
  async #exportToClipboard() {
    const data = JSON.stringify(this.exportPins(), null, 2);
    const ok = await copyText(data, { announceMessage: "Pins copied to clipboard" });
    if (ok) return;
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "review-pins.json";
    a.click();
    URL.revokeObjectURL(url);
    this.#announce("Pins exported as file");
  }
  #formatTime(isoString) {
    if (!isoString) return "";
    try {
      const date = new Date(isoString);
      const now = /* @__PURE__ */ new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 6e4);
      if (diffMins < 1) return "just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString();
    } catch {
      return "";
    }
  }
  #announce(message) {
    const live = this.shadowRoot?.querySelector(".rs-live");
    if (live) live.textContent = message;
  }
};
registerComponent("review-surface", ReviewSurface);

// src/web-components/gantt-chart/logic.js
var DAY = 864e5;
var WEEK = DAY * 7;
var MONTH = DAY * 30;
var QUARTER = DAY * 91;
var YEAR = DAY * 365;
function toTimestamp(value) {
  if (typeof value === "number") return value;
  const d = new Date(value);
  return d.getTime();
}
function pickFormatter(rangeMs) {
  if (rangeMs <= WEEK * 3) {
    return (d) => d.toLocaleDateString(void 0, { month: "short", day: "numeric" });
  }
  if (rangeMs <= MONTH * 3) {
    return (d) => d.toLocaleDateString(void 0, { month: "short", day: "numeric" });
  }
  if (rangeMs <= YEAR) {
    return (d) => d.toLocaleDateString(void 0, { month: "short", year: "2-digit" });
  }
  return (d) => d.toLocaleDateString(void 0, { year: "numeric" });
}
function resolveView(rangeMs) {
  if (rangeMs <= WEEK * 3) return "day";
  if (rangeMs <= MONTH * 3) return "week";
  if (rangeMs <= YEAR) return "month";
  return "quarter";
}
function esc2(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
var GanttChart = class _GanttChart extends VBElement {
  static get observedAttributes() {
    return ["src", "title", "view", "show-today", "show-progress", "show-dependencies", "compact"];
  }
  /** @type {HTMLDivElement|null} */
  #container = null;
  /** @type {HTMLDivElement|null} */
  #liveRegion = null;
  /** @type {HTMLElement|null} */
  #titleEl = null;
  /** @type {ArrayObject} */
  #tasks = [];
  /** @type {number} */
  #rangeStart = 0;
  /** @type {number} */
  #rangeEnd = 0;
  /** @type {number} */
  #rangeTotal = 0;
  setup() {
    const table = this.querySelector(":scope > table");
    if (!table) return false;
    this.#tasks = this.#parseTasks(table);
    if (this.#tasks.length === 0) return false;
    this.#rangeStart = Math.min(...this.#tasks.map((t) => t.start));
    this.#rangeEnd = Math.max(...this.#tasks.map((t) => t.end));
    this.#rangeTotal = this.#rangeEnd - this.#rangeStart;
    if (this.#rangeTotal <= 0) this.#rangeTotal = DAY;
    this.#build(table);
    this.dispatchEvent(new CustomEvent("gantt-chart:ready", {
      bubbles: true,
      detail: {
        taskCount: this.#tasks.length,
        dateRange: {
          start: new Date(this.#rangeStart).toISOString(),
          end: new Date(this.#rangeEnd).toISOString()
        }
      }
    }));
    return true;
  }
  teardown() {
    if (this.#titleEl) {
      this.#titleEl.remove();
      this.#titleEl = null;
    }
    if (this.#container) {
      this.#container.remove();
      this.#container = null;
    }
    if (this.#liveRegion) {
      this.#liveRegion.remove();
      this.#liveRegion = null;
    }
    const table = this.querySelector("table.gc-sr-only");
    if (table) table.classList.remove("gc-sr-only");
    this.#tasks = [];
  }
  /** @type {number} */
  static #vtCounter = 0;
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue || !this.isConnected) return;
    if (name === "src") {
      this._loadSrc(newValue);
    } else if (this.hasAttribute("data-upgraded")) {
      this.#refresh();
    }
  }
  /**
   * Tear down and re-setup, wrapped in a View Transition so the swap
   * crossfades instead of flashing. Same pattern as diagram-wc and
   * site-map.
   */
  #refresh() {
    const swap = () => {
      this.teardown();
      this.removeAttribute("data-upgraded");
      this.setup();
    };
    if (this.hasAttribute("data-upgraded") && "startViewTransition" in document && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const name = `gc-vt-${++_GanttChart.#vtCounter}`;
      this.style.viewTransitionName = name;
      const tx = document.startViewTransition(swap);
      tx.finished.finally(() => {
        this.style.viewTransitionName = "";
      });
    } else {
      swap();
    }
  }
  // ── Data API (HTML-first / JS-first dual contract) ──────────────
  /**
   * The current task list. After upgrade this reflects the parsed
   * table rows; after assignment, it reflects whatever was passed in.
   * Each entry: { id, name, start, end, progress?, group?, depends?,
   * status?, assignee?, milestone?, color?, storyIds?, itemIds? }.
   */
  get tasks() {
    return this.#tasks;
  }
  /**
   * Replace the task set and re-render. Accepts plain task objects with
   * start/end as ISO strings or timestamps; both are normalized.
   *
   * Note: v1 is record-shaped (full rebuild on assignment). Per-bar
   * preservation across diffs is on the roadmap for when drag-resize
   * state preservation becomes a felt need.
   */
  set tasks(value) {
    const next = (value || []).map((t, i) => ({
      id: t.id ?? `gc-task-${i}`,
      name: t.name ?? `Task ${i + 1}`,
      start: typeof t.start === "number" ? t.start : toTimestamp(t.start),
      end: typeof t.end === "number" ? t.end : t.end != null ? toTimestamp(t.end) : typeof t.start === "number" ? t.start : toTimestamp(t.start),
      progress: t.progress ?? 0,
      group: t.group ?? null,
      depends: Array.isArray(t.depends) ? t.depends : t.depends ? String(t.depends).split(",").map((s) => s.trim()) : [],
      status: t.status ?? null,
      assignee: t.assignee ?? null,
      milestone: !!t.milestone,
      color: t.color ?? null,
      storyIds: t.storyIds ?? [],
      itemIds: t.itemIds ?? []
    }));
    if (this.#container || this.#titleEl || this.#liveRegion) {
      if (this.#titleEl) {
        this.#titleEl.remove();
        this.#titleEl = null;
      }
      if (this.#container) {
        this.#container.remove();
        this.#container = null;
      }
      if (this.#liveRegion) {
        this.#liveRegion.remove();
        this.#liveRegion = null;
      }
    }
    this.#tasks = next;
    if (next.length > 0) {
      this.#rangeStart = Math.min(...next.map((t) => t.start));
      this.#rangeEnd = Math.max(...next.map((t) => t.end));
      this.#rangeTotal = this.#rangeEnd - this.#rangeStart;
      if (this.#rangeTotal <= 0) this.#rangeTotal = DAY;
      let table = this.querySelector(":scope > table");
      if (!table) {
        table = document.createElement("table");
        table.classList.add("gc-sr-only");
        this.appendChild(table);
      }
      this.#build(table);
    }
    this.dispatchEvent(new CustomEvent("gantt-chart:tasks-changed", {
      detail: { tasks: next, source: "property" },
      bubbles: true
    }));
  }
  /* ── Table parsing ─────────────────────────────── */
  #parseTasks(table) {
    const rows = table.querySelectorAll("tbody tr");
    const tasks = [];
    for (let i = 0; i < rows.length; i++) {
      const row = (
        /** @type {HTMLTableRowElement} */
        rows[i]
      );
      const times = row.querySelectorAll("time[datetime]");
      if (times.length < 2 && !row.hasAttribute("data-milestone")) continue;
      const startStr = times[0]?.getAttribute("datetime");
      const endStr = times.length > 1 ? times[1].getAttribute("datetime") : startStr;
      if (!startStr) continue;
      const progressEl = row.querySelector("progress");
      const progressValue = progressEl ? progressEl.value / (progressEl.max || 100) : 0;
      const name = row.cells[0]?.textContent?.trim() || `Task ${i + 1}`;
      tasks.push({
        id: row.dataset.taskId || `gc-task-${i}`,
        name,
        start: toTimestamp(startStr),
        end: toTimestamp(endStr),
        progress: progressValue,
        group: row.dataset.group || null,
        depends: row.dataset.depends ? row.dataset.depends.split(",").map((s) => s.trim()) : [],
        status: row.dataset.status || null,
        assignee: row.dataset.assignee || null,
        milestone: row.hasAttribute("data-milestone"),
        color: row.dataset.color || null,
        storyIds: row.dataset.storyIds ? row.dataset.storyIds.split(",").map((s) => s.trim()) : [],
        itemIds: row.dataset.itemIds ? row.dataset.itemIds.split(",").map((s) => s.trim()) : []
      });
    }
    return tasks;
  }
  /* ── Build enhanced DOM ────────────────────────── */
  #build(table) {
    const title = this.getAttribute("title");
    const showToday = this.hasAttribute("show-today");
    const showProgress = this.hasAttribute("show-progress");
    const showDeps = this.hasAttribute("show-dependencies");
    if (title) {
      this.#titleEl = document.createElement("h2");
      this.#titleEl.className = "gc-title";
      this.#titleEl.textContent = title;
      this.insertBefore(this.#titleEl, table);
    }
    this.#container = document.createElement("div");
    this.#container.className = "gc-container";
    this.#container.setAttribute("role", "region");
    this.#container.setAttribute("aria-label", `Gantt chart${title ? ": " + title : ""}`);
    const header = this.#buildTimelineHeader();
    this.#container.appendChild(header);
    const body = document.createElement("div");
    body.className = "gc-body";
    const taskList = document.createElement("div");
    taskList.className = "gc-task-list";
    const barsPanel = document.createElement("div");
    barsPanel.className = "gc-bars";
    const gridLines = this.#buildGridLines();
    barsPanel.appendChild(gridLines);
    const grouped = this.#groupTasks();
    for (const [groupName, groupTasks] of grouped) {
      if (grouped.size > 1 && groupName) {
        const groupHeader = document.createElement("div");
        groupHeader.className = "gc-group-header";
        const label = document.createElement("span");
        label.className = "gc-group-label";
        label.textContent = groupName;
        groupHeader.appendChild(label);
        taskList.appendChild(groupHeader);
        const spacer = document.createElement("div");
        spacer.className = "gc-group-spacer";
        barsPanel.appendChild(spacer);
      }
      for (const task of groupTasks) {
        const taskRow = document.createElement("div");
        taskRow.className = "gc-task-row";
        taskRow.setAttribute("data-task-id", task.id);
        const taskName = document.createElement("span");
        taskName.className = "gc-task-name";
        taskName.textContent = task.name;
        taskRow.appendChild(taskName);
        const taskDates = document.createElement("span");
        taskDates.className = "gc-task-dates";
        taskDates.textContent = `${new Date(task.start).toLocaleDateString()} to ${new Date(task.end).toLocaleDateString()}`;
        taskRow.appendChild(taskDates);
        taskList.appendChild(taskRow);
        const barRow = document.createElement("div");
        barRow.className = "gc-bar-row";
        if (task.milestone) {
          barRow.appendChild(this.#buildMilestone(task));
        } else {
          barRow.appendChild(this.#buildBar(task, showProgress));
        }
        barsPanel.appendChild(barRow);
      }
    }
    if (showToday) {
      const todayLine = this.#buildTodayLine();
      if (todayLine) barsPanel.appendChild(todayLine);
    }
    if (showDeps) {
      requestAnimationFrame(() => {
        const svg = this.#buildDependencyArrows(barsPanel);
        if (svg) barsPanel.appendChild(svg);
      });
    }
    body.appendChild(taskList);
    body.appendChild(barsPanel);
    this.#container.appendChild(body);
    this.insertBefore(this.#container, table);
    table.classList.add("gc-sr-only");
    this.#liveRegion = document.createElement("div");
    this.#liveRegion.className = "gc-sr-only";
    this.#liveRegion.setAttribute("role", "status");
    this.#liveRegion.setAttribute("aria-live", "polite");
    this.#liveRegion.setAttribute("aria-atomic", "true");
    this.appendChild(this.#liveRegion);
    this.listen(this.#container, "click", (e) => {
      const bar = (
        /** @type {HTMLElement | null} */
        /** @type {HTMLElement} */
        e.target.closest(".gc-bar, .gc-milestone")
      );
      if (!bar) return;
      const taskId = bar.dataset.taskId;
      const task = this.#tasks.find((t) => t.id === taskId);
      if (!task) return;
      this.#announce(`Selected: ${task.name}`);
      this.dispatchEvent(new CustomEvent("gantt-chart:task-click", {
        bubbles: true,
        detail: { task }
      }));
    });
    this.listen(this.#container, "keydown", (e) => {
      const ke = (
        /** @type {KeyboardEvent} */
        e
      );
      if (ke.key === "Enter" || ke.key === " ") {
        const bar = (
          /** @type {HTMLElement | null} */
          /** @type {HTMLElement} */
          ke.target.closest(".gc-bar, .gc-milestone")
        );
        if (bar) {
          ke.preventDefault();
          bar.click();
        }
      }
    });
  }
  /* ── Timeline header ───────────────────────────── */
  #buildTimelineHeader() {
    const header = document.createElement("div");
    header.className = "gc-timeline-header";
    const spacer = document.createElement("div");
    spacer.className = "gc-timeline-spacer";
    header.appendChild(spacer);
    const dates = document.createElement("div");
    dates.className = "gc-timeline-dates";
    const labels = this.#generateDateLabels();
    for (const { position, text } of labels) {
      const label = document.createElement("span");
      label.className = "gc-date-label";
      label.style.left = `${position}%`;
      label.textContent = text;
      dates.appendChild(label);
    }
    header.appendChild(dates);
    return header;
  }
  /* ── Date labels ───────────────────────────────── */
  #generateDateLabels() {
    const viewAttr = this.getAttribute("view") || "auto";
    const view = viewAttr === "auto" ? resolveView(this.#rangeTotal) : viewAttr;
    const formatter = pickFormatter(this.#rangeTotal);
    const labels = [];
    let stepMs;
    switch (view) {
      case "day":
        stepMs = DAY;
        break;
      case "week":
        stepMs = WEEK;
        break;
      case "month":
        stepMs = MONTH;
        break;
      case "quarter":
        stepMs = QUARTER;
        break;
      default:
        stepMs = MONTH;
    }
    let cursor = new Date(this.#rangeStart);
    if (view === "week") {
      const dayOfWeek = cursor.getDay();
      const daysToMonday = dayOfWeek === 0 ? 1 : dayOfWeek === 1 ? 0 : 8 - dayOfWeek;
      cursor.setDate(cursor.getDate() + daysToMonday);
    } else if (view === "month") {
      cursor.setDate(1);
      if (cursor.getTime() < this.#rangeStart) {
        cursor.setMonth(cursor.getMonth() + 1);
      }
    } else if (view === "quarter") {
      const month = cursor.getMonth();
      const nextQuarterMonth = Math.ceil((month + 1) / 3) * 3;
      cursor.setMonth(nextQuarterMonth);
      cursor.setDate(1);
    }
    const cursorTs = cursor.getTime();
    if (cursorTs > this.#rangeStart + stepMs * 0.5) {
      labels.push({
        position: 0,
        text: formatter(new Date(this.#rangeStart))
      });
    }
    let current = cursorTs;
    while (current <= this.#rangeEnd) {
      const pct = (current - this.#rangeStart) / this.#rangeTotal * 100;
      if (pct >= 0 && pct <= 100) {
        labels.push({
          position: pct,
          text: formatter(new Date(current))
        });
      }
      if (view === "month") {
        const d = new Date(current);
        d.setMonth(d.getMonth() + 1);
        current = d.getTime();
      } else if (view === "quarter") {
        const d = new Date(current);
        d.setMonth(d.getMonth() + 3);
        current = d.getTime();
      } else {
        current += stepMs;
      }
    }
    return labels;
  }
  /* ── Grid lines ────────────────────────────────── */
  #buildGridLines() {
    const container = document.createElement("div");
    container.className = "gc-grid-lines";
    const labels = this.#generateDateLabels();
    for (const { position } of labels) {
      if (position <= 0) continue;
      const line = document.createElement("div");
      line.className = "gc-grid-line";
      line.style.left = `${position}%`;
      container.appendChild(line);
    }
    return container;
  }
  /* ── Group tasks ───────────────────────────────── */
  #groupTasks() {
    const groups = /* @__PURE__ */ new Map();
    for (const task of this.#tasks) {
      const key = task.group || "";
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)?.push(task);
    }
    return groups;
  }
  /* ── Build bar ─────────────────────────────────── */
  #buildBar(task, showProgress) {
    const leftPct = (task.start - this.#rangeStart) / this.#rangeTotal * 100;
    const widthPct = (task.end - task.start) / this.#rangeTotal * 100;
    const bar = document.createElement("div");
    bar.className = "gc-bar";
    bar.setAttribute("data-task-id", task.id);
    bar.setAttribute("role", "img");
    bar.setAttribute("tabindex", "0");
    bar.setAttribute(
      "aria-label",
      `${esc2(task.name)}: ${new Date(task.start).toLocaleDateString()} to ${new Date(task.end).toLocaleDateString()}` + (task.progress > 0 ? `, ${Math.round(task.progress * 100)}% complete` : "")
    );
    bar.style.left = `${leftPct}%`;
    bar.style.width = `${Math.max(widthPct, 0.5)}%`;
    if (task.status) bar.setAttribute("data-status", task.status);
    if (task.color) bar.style.setProperty("--gc-bar-color", task.color);
    if (showProgress && task.progress > 0) {
      const fill = document.createElement("div");
      fill.className = "gc-bar-fill";
      fill.style.width = `${Math.round(task.progress * 100)}%`;
      bar.appendChild(fill);
    }
    if (widthPct > 8) {
      const label = document.createElement("span");
      label.className = "gc-bar-label";
      label.textContent = task.name;
      bar.appendChild(label);
    }
    return bar;
  }
  /* ── Build milestone ───────────────────────────── */
  #buildMilestone(task) {
    const leftPct = (task.start - this.#rangeStart) / this.#rangeTotal * 100;
    const diamond = document.createElement("div");
    diamond.className = "gc-milestone";
    diamond.setAttribute("data-task-id", task.id);
    diamond.setAttribute("role", "img");
    diamond.setAttribute("tabindex", "0");
    diamond.setAttribute("aria-label", `Milestone: ${esc2(task.name)}, ${new Date(task.start).toLocaleDateString()}`);
    diamond.style.left = `${leftPct}%`;
    if (task.status) diamond.setAttribute("data-status", task.status);
    if (task.color) diamond.style.setProperty("--gc-bar-color", task.color);
    return diamond;
  }
  /* ── Today line ────────────────────────────────── */
  #buildTodayLine() {
    const now = Date.now();
    if (now < this.#rangeStart || now > this.#rangeEnd) return null;
    const pct = (now - this.#rangeStart) / this.#rangeTotal * 100;
    const line = document.createElement("div");
    line.className = "gc-today-line";
    line.style.left = `${pct}%`;
    const label = document.createElement("span");
    label.className = "gc-today-label";
    label.textContent = "Today";
    line.appendChild(label);
    return line;
  }
  /* ── Dependency arrows ─────────────────────────── */
  #buildDependencyArrows(barsPanel) {
    const depsExist = this.#tasks.some((t) => t.depends.length > 0);
    if (!depsExist) return null;
    const ns = "http://www.w3.org/2000/svg";
    const rowHeight = 36;
    const rowCount = barsPanel.querySelectorAll(".gc-bar-row").length;
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("class", "gc-deps");
    svg.setAttribute("viewBox", `0 0 100 ${rowCount * rowHeight}`);
    svg.setAttribute("preserveAspectRatio", "none");
    svg.style.width = "100%";
    svg.style.height = "100%";
    const defs = document.createElementNS(ns, "defs");
    const marker = document.createElementNS(ns, "marker");
    marker.setAttribute("id", "gc-arrowhead");
    marker.setAttribute("markerWidth", "8");
    marker.setAttribute("markerHeight", "6");
    marker.setAttribute("refX", "8");
    marker.setAttribute("refY", "3");
    marker.setAttribute("orient", "auto");
    const arrow = document.createElementNS(ns, "polygon");
    arrow.setAttribute("points", "0 0, 8 3, 0 6");
    arrow.setAttribute("fill", "var(--color-text-muted, #666666)");
    marker.appendChild(arrow);
    defs.appendChild(marker);
    svg.appendChild(defs);
    for (const task of this.#tasks) {
      for (const depId of task.depends) {
        const source = this.#tasks.find((t) => t.id === depId);
        if (!source) continue;
        const sourceRight = (source.end - this.#rangeStart) / this.#rangeTotal * 100;
        const targetLeft = (task.start - this.#rangeStart) / this.#rangeTotal * 100;
        const sourceIdx = this.#getVisualRowIndex(source.id, barsPanel);
        const targetIdx = this.#getVisualRowIndex(task.id, barsPanel);
        if (sourceIdx === -1 || targetIdx === -1) continue;
        const sourceY = sourceIdx * rowHeight + rowHeight / 2;
        const targetY = targetIdx * rowHeight + rowHeight / 2;
        const path = document.createElementNS(ns, "path");
        const midX = sourceRight + (targetLeft - sourceRight) / 2;
        path.setAttribute("d", `M ${sourceRight} ${sourceY} C ${midX} ${sourceY}, ${midX} ${targetY}, ${targetLeft} ${targetY}`);
        path.setAttribute("class", "gc-dep-line");
        path.setAttribute("vector-effect", "non-scaling-stroke");
        svg.appendChild(path);
      }
    }
    return svg;
  }
  #getVisualRowIndex(taskId, barsPanel) {
    const rows = barsPanel.querySelectorAll(".gc-bar-row");
    for (let i = 0; i < rows.length; i++) {
      const bar = rows[i].querySelector("[data-task-id]");
      if (bar && bar.dataset.taskId === taskId) return i;
    }
    return -1;
  }
  /* ── JSON loading ──────────────────────────────── */
  async _loadSrc(url) {
    if (!url) return;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      while (this.firstChild) this.firstChild.remove();
      const table = document.createElement("table");
      const thead = document.createElement("thead");
      const headerRow = document.createElement("tr");
      for (const label of ["Task", "Start", "End", "Progress"]) {
        const th = document.createElement("th");
        th.textContent = label;
        headerRow.appendChild(th);
      }
      thead.appendChild(headerRow);
      table.appendChild(thead);
      const tbody = document.createElement("tbody");
      for (const task of data.tasks || []) {
        const tr = document.createElement("tr");
        if (task.id) tr.dataset.taskId = task.id;
        if (task.group) tr.dataset.group = task.group;
        if (task.depends) tr.dataset.depends = Array.isArray(task.depends) ? task.depends.join(",") : task.depends;
        if (task.status) tr.dataset.status = task.status;
        if (task.assignee) tr.dataset.assignee = task.assignee;
        if (task.milestone) tr.setAttribute("data-milestone", "");
        if (task.color) tr.dataset.color = task.color;
        if (task.storyIds) tr.dataset.storyIds = Array.isArray(task.storyIds) ? task.storyIds.join(",") : task.storyIds;
        if (task.itemIds) tr.dataset.itemIds = Array.isArray(task.itemIds) ? task.itemIds.join(",") : task.itemIds;
        const tdName = document.createElement("td");
        tdName.textContent = task.name || "";
        tr.appendChild(tdName);
        const tdStart = document.createElement("td");
        const timeStart = document.createElement("time");
        timeStart.setAttribute("datetime", task.start);
        timeStart.textContent = new Date(task.start).toLocaleDateString(void 0, { month: "short", day: "numeric" });
        tdStart.appendChild(timeStart);
        tr.appendChild(tdStart);
        const tdEnd = document.createElement("td");
        const timeEnd = document.createElement("time");
        timeEnd.setAttribute("datetime", task.end || task.start);
        timeEnd.textContent = new Date(task.end || task.start).toLocaleDateString(void 0, { month: "short", day: "numeric" });
        tdEnd.appendChild(timeEnd);
        tr.appendChild(tdEnd);
        const tdProgress = document.createElement("td");
        const progress = document.createElement("progress");
        progress.value = task.progress || 0;
        progress.max = 100;
        progress.textContent = `${task.progress || 0}%`;
        tdProgress.appendChild(progress);
        tr.appendChild(tdProgress);
        tbody.appendChild(tr);
      }
      table.appendChild(tbody);
      this.appendChild(table);
      if (data.title) this.setAttribute("title", data.title);
      this.#refresh();
    } catch (err) {
      console.warn(`[gantt-chart] Failed to load src="${url}":`, err);
    }
  }
  /* ── Live region ───────────────────────────────── */
  #announce(msg) {
    if (!this.#liveRegion) return;
    this.#liveRegion.textContent = "";
    requestAnimationFrame(() => {
      if (this.#liveRegion) this.#liveRegion.textContent = msg;
    });
  }
};
registerComponent("gantt-chart", GanttChart);

// src/web-components/work-item/styles.js
var styles6 = `
:host {
  --_bg:        var(--work-item-bg, var(--color-surface, #ffffff));
  --_text:      var(--work-item-text, var(--color-text, #1a1a1a));
  --_muted:     var(--work-item-muted, var(--color-text-muted, #666));
  --_border:    var(--work-item-border, var(--color-border, #e0e0e0));
  --_accent:    var(--work-item-accent, var(--color-interactive, #0066cc));
  --_card-bg:   var(--work-item-card-bg, var(--color-surface-raised, #f8f9fa));
  --_highlight: var(--work-item-highlight, color-mix(in srgb, var(--_accent) 8%, transparent));
  --_radius:    var(--work-item-radius, var(--radius-l, 0.75rem));
  --_shadow:       var(--work-item-shadow, var(--shadow-sm));
  --_shadow-hover: var(--work-item-shadow-hover, var(--shadow-md));
  --_duration:     var(--work-item-duration, var(--duration-normal, 200ms));
  --_ease:         var(--work-item-ease, var(--ease-default, ease));
  --_space-2xs:    var(--work-item-space-2xs, var(--size-2xs, 0.25rem));
  --_space-xs:     var(--work-item-space-xs, var(--size-xs, 0.5rem));
  --_space-s:      var(--work-item-space-s, var(--size-s, 0.75rem));
  --_space-m:      var(--work-item-space-m, var(--size-m, 1rem));
  --_font-xs:      var(--work-item-font-xs, var(--font-size-xs, 0.75rem));
  --_font-sm:      var(--work-item-font-sm, var(--font-size-sm, 0.875rem));
  --_font-md:      var(--work-item-font-md, var(--font-size-md, 1rem));
  --_font-lg:      var(--work-item-font-lg, var(--font-size-lg, 1.125rem));
  --_font-mono:    var(--work-item-font-mono, var(--font-mono, ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, monospace));
  --_radius-s:     var(--work-item-radius-s, var(--radius-s, 0.25rem));
  --_radius-full:  var(--work-item-radius-full, var(--radius-full, 9999px));

  display: block;
  font-family: var(--work-item-font, var(--font-sans, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif));
}

*, *::before, *::after { box-sizing: border-box; margin: 0; }

/* \u2500\u2500 Card \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.wi-card {
  background: var(--_bg);
  border: 1px solid var(--_border);
  border-radius: var(--_radius);
  overflow: hidden;
  box-shadow: var(--_shadow);
  transition: box-shadow var(--_duration) var(--_ease);
}

.wi-card:hover {
  box-shadow: var(--_shadow-hover);
}

/* \u2500\u2500 Header \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.wi-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--_space-s) var(--_space-m);
  background: var(--_card-bg);
  border-block-end: 1px solid var(--_border);
  gap: var(--_space-s);
  flex-wrap: wrap;
}

.wi-meta {
  display: flex;
  align-items: center;
  gap: var(--_space-xs);
  flex-wrap: wrap;
  min-width: 0;
}

.wi-id {
  font-size: var(--_font-xs);
  font-weight: 600;
  color: var(--_muted);
  font-family: var(--_font-mono);
}

/* \u2500\u2500 Type badge \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.wi-type {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: var(--_radius-s);
  text-transform: capitalize;
}

.wi-type svg {
  width: 12px;
  height: 12px;
}

/* Type colors \u2014 driven by VB theme tokens, with color-mix surfaces so the
   pill background shifts with the active theme. */
.wi-type[data-type="task"]    { color: var(--color-info,    #3b82f6); background: color-mix(in oklch, var(--color-info,    #3b82f6) 12%, transparent); }
.wi-type[data-type="bug"]     { color: var(--color-error,   #dc2626); background: color-mix(in oklch, var(--color-error,   #dc2626) 12%, transparent); }
.wi-type[data-type="chore"]   { color: var(--color-text-muted, #6b7280); background: color-mix(in oklch, var(--color-text-muted, #6b7280) 12%, transparent); }
.wi-type[data-type="spike"]   { color: var(--color-accent,  #8b5cf6); background: color-mix(in oklch, var(--color-accent,  #8b5cf6) 12%, transparent); }
.wi-type[data-type="feature"] { color: var(--color-success, #059669); background: color-mix(in oklch, var(--color-success, #059669) 12%, transparent); }

/* \u2500\u2500 Badges \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.wi-badges {
  display: flex;
  align-items: center;
  gap: var(--_space-xs);
}

.wi-priority,
.wi-status {
  font-size: 11px;
  padding: 4px 10px;
  border-radius: var(--_radius-full);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.wi-estimate {
  width: 28px;
  height: 28px;
  border-radius: var(--_radius-full);
  background: var(--_accent);
  color: white;
  font-size: var(--_font-xs);
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* \u2500\u2500 Body \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.wi-body {
  padding: 16px 20px;
}

.wi-title-wrap {
  margin-block-end: var(--_space-xs);
}

.wi-title-wrap:last-child {
  margin-block-end: 0;
}

::slotted([slot="title"]) {
  font-size: var(--_font-lg) !important;
  font-weight: 700 !important;
  color: var(--_text) !important;
  line-height: 1.4 !important;
  margin: 0 !important;
}

.wi-title-fallback {
  font-size: var(--_font-lg);
  font-weight: 700;
  color: var(--_text);
  line-height: 1.4;
}

.wi-title:last-child {
  margin-block-end: 0;
}

/* \u2500\u2500 Assignee \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.wi-assignee {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: var(--_font-xs);
  color: var(--_muted);
  margin-block-start: var(--_space-xs);
}

.wi-assignee__avatar {
  width: 20px;
  height: 20px;
  border-radius: var(--_radius-full);
  font-size: 9px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-inverted, #fff);
  flex-shrink: 0;
}

/* \u2500\u2500 Linked stories \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.wi-links {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-block-start: var(--_space-s);
}

.wi-link {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: var(--_radius-s);
  background: var(--_highlight);
  color: var(--_accent);
  text-decoration: none;
}

.wi-link:hover {
  text-decoration: underline;
}

.wi-link svg {
  width: 11px;
  height: 11px;
}

/* \u2500\u2500 Sections \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.wi-sections {
  border-block-start: 1px solid var(--_border);
}

.wi-section {
  padding: 14px 20px;
  border-block-end: 1px solid var(--_border);
}

.wi-section:last-child {
  border-block-end: none;
}

.wi-section-header {
  display: flex;
  align-items: center;
  gap: var(--_space-xs);
  margin-block-end: var(--_space-s);
}

.wi-section-icon {
  width: 22px;
  height: 22px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wi-section-icon svg {
  width: 13px;
  height: 13px;
  fill: var(--color-text-inverted, #fff);
}

.wi-section-icon.description { background: var(--color-info,    #3b82f6); }
.wi-section-icon.checklist   { background: var(--color-success, #22c55e); }
.wi-section-icon.notes       { background: var(--color-warning, #f59e0b); }

.wi-section-title {
  font-size: var(--_font-xs);
  font-weight: 600;
  color: var(--_muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.wi-section-content {
  color: var(--_text);
  font-size: var(--_font-sm);
  line-height: 1.6;
}

.wi-section-content ::slotted(ul),
.wi-section-content ::slotted(ol) {
  margin: 0;
  padding-inline-start: 20px;
}

.wi-section-content ::slotted(p) {
  margin: 0;
}

.slot-fallback {
  color: var(--_muted);
  font-style: italic;
}

/* \u2500\u2500 Minimal detail \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.wi-card--minimal {
  padding: var(--_space-xs);
  cursor: pointer;
}

.wi-card--minimal:hover {
  box-shadow: var(--_shadow-hover);
}

.wi-card--minimal:focus-visible {
  outline: 2px solid var(--_accent);
  outline-offset: 2px;
}

.wi-card--minimal .wi-header { display: none; }
.wi-card--minimal .wi-sections { display: none; }
.wi-card--minimal .wi-links { display: none; }
.wi-card--minimal .wi-assignee { display: none; }

.wi-card--minimal .wi-body {
  padding: var(--_space-xs) var(--_space-s);
}

.wi-card--minimal .wi-title-fallback,
.wi-card--minimal ::slotted([slot="title"]) {
  font-size: var(--_font-sm) !important;
  font-weight: 600 !important;
}

.wi-card--minimal .wi-id {
  display: block;
  margin-block-end: var(--_space-2xs);
}

.wi-card--minimal .wi-type {
  font-size: 10px;
  padding: 2px 6px;
}

/* \u2500\u2500 Compact detail \u2014 hide empty sections \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.wi-card--compact .wi-section[data-empty] {
  display: none;
}

.wi-card--compact .slot-fallback {
  display: none;
}

.wi-card--compact .wi-body {
  padding: var(--_space-s) var(--_space-m);
}

/* \u2500\u2500 Responsive \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
@media (max-width: 480px) {
  .wi-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .wi-badges {
    width: 100%;
    justify-content: flex-start;
  }
}

@media (prefers-reduced-motion: reduce) {
  .wi-card {
    transition: none;
  }
}

@media print {
  .wi-card {
    box-shadow: none;
    break-inside: avoid;
  }
}

.state-msg        { padding: var(--_space-m); font-size: var(--_font-sm); color: var(--_muted); font-style: italic; }
.state-msg--error { color: var(--color-error-text, var(--color-error, #dc2626)); }
`;

// src/web-components/work-item/logic.js
var TYPE_ICONS = {
  task: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="m9 12 2 2 4-4"/>',
  bug: '<path d="m8 2 1.88 1.88"/><path d="M14.12 3.88 16 2"/><path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"/><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"/><path d="M12 20v-9"/><path d="M6.53 9C4.6 8.8 3 7.1 3 5"/><path d="M6 13H2"/><path d="M3 21c0-2.1 1.7-3.9 3.8-4"/><path d="M20.97 5c0 2.1-1.6 3.8-3.5 4"/><path d="M22 13h-4"/><path d="M17.2 17c2.1.1 3.8 1.9 3.8 4"/>',
  chore: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z"/>',
  spike: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
  feature: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>'
};
var PRIORITIES = {
  critical: { label: "Critical", color: "#dc2626", bg: "rgba(220, 38, 38, 0.1)" },
  high: { label: "High", color: "#ea580c", bg: "rgba(234, 88, 12, 0.1)" },
  medium: { label: "Medium", color: "#ca8a04", bg: "rgba(202, 138, 4, 0.1)" },
  low: { label: "Low", color: "#16a34a", bg: "rgba(22, 163, 74, 0.1)" }
};
var STATUSES = {
  backlog: { label: "Backlog", color: "#6b7280", bg: "rgba(107, 114, 128, 0.1)" },
  "to-do": { label: "To Do", color: "#3b82f6", bg: "rgba(59, 130, 246, 0.1)" },
  "in-progress": { label: "In Progress", color: "#8b5cf6", bg: "rgba(139, 92, 246, 0.1)" },
  review: { label: "Review", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.1)" },
  done: { label: "Done", color: "#22c55e", bg: "rgba(34, 197, 94, 0.1)" },
  blocked: { label: "Blocked", color: "#dc2626", bg: "rgba(220, 38, 38, 0.1)" }
};
var WorkItem = class extends HTMLElement {
  static get observedAttributes() {
    return [
      "item-id",
      "type",
      "priority",
      "status",
      "estimate",
      "assignee",
      "story-ids",
      "detail",
      "compact",
      "src"
    ];
  }
  #slotCache = /* @__PURE__ */ new Map();
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
  /* ── Slot caching ───────────────────────────────── */
  #cacheSlotValues() {
    for (const child of [...this.children]) {
      const slotName = child.getAttribute("slot");
      if (slotName) {
        this.#slotCache.set(slotName, child.textContent.trim());
      }
    }
  }
  _resolve(attr) {
    return this.getAttribute(attr) || this.#slotCache.get(attr) || "";
  }
  /* ── Lifecycle ─────────────────────────────────── */
  connectedCallback() {
    this.#cacheSlotValues();
    if (this.itemId && !this.id) this.id = this.itemId;
    if (this.hasAttribute("src")) {
      this._loadSrc(this.getAttribute("src"));
    }
    this.#render();
    this.setAttribute("data-upgraded", "");
  }
  disconnectedCallback() {
    this.removeAttribute("data-upgraded");
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue && this.shadowRoot) {
      if (name === "src" && this.isConnected) {
        this._loadSrc(newValue);
      } else {
        this.#render();
      }
    }
  }
  /* ── Getters ───────────────────────────────────── */
  get itemId() {
    return this.getAttribute("item-id") || "";
  }
  get itemTitle() {
    const slotted = this.querySelector('[slot="title"]');
    return slotted?.textContent?.trim() || this.#slotCache.get("title") || "";
  }
  get itemType() {
    return this.getAttribute("type") || "task";
  }
  get priority() {
    return this.getAttribute("priority") || "medium";
  }
  get status() {
    return this.getAttribute("status") || "backlog";
  }
  get estimate() {
    return this.getAttribute("estimate") || "";
  }
  get assignee() {
    return this.getAttribute("assignee") || "";
  }
  get storyIds() {
    const raw = this.getAttribute("story-ids") || "";
    return raw ? raw.split(",").map((s) => s.trim()).filter(Boolean) : [];
  }
  get _detailLevel() {
    if (this.getAttribute("detail")) return this.getAttribute("detail");
    if (this.hasAttribute("compact")) return "compact";
    return "full";
  }
  get _minimalLabel() {
    return this.itemTitle || this.itemId || "Work item";
  }
  /* ── Public API ────────────────────────────────── */
  updateStatus(newStatus) {
    if (STATUSES[newStatus]) {
      this.setAttribute("status", newStatus);
      this.dispatchEvent(new CustomEvent("work-item:status", {
        detail: { status: newStatus, itemId: this.itemId },
        bubbles: true,
        composed: true
      }));
    }
  }
  updatePriority(newPriority) {
    if (PRIORITIES[newPriority]) {
      this.setAttribute("priority", newPriority);
      this.dispatchEvent(new CustomEvent("work-item:priority", {
        detail: { priority: newPriority, itemId: this.itemId },
        bubbles: true,
        composed: true
      }));
    }
  }
  /* ── Data API ──────────────────────────────────── */
  /**
   * Read the work item as a plain data object. Mirrors what a consumer
   * would assign to .data — useful for diffing, persistence, or echo.
   */
  get data() {
    return {
      itemId: this.itemId || void 0,
      type: this.itemType,
      priority: this.priority,
      status: this.status,
      estimate: this.estimate || void 0,
      assignee: this.assignee || void 0,
      storyIds: this.storyIds.length ? this.storyIds : void 0,
      detail: this.getAttribute("detail") || void 0,
      title: this.itemTitle || void 0
    };
  }
  /**
   * Set state attributes and slotted content from a plain object in one call.
   * Replaces nine setAttribute calls + manual slotted-child creation.
   * Idempotent for repeat calls.
   */
  set data(value) {
    if (!value || typeof value !== "object") return;
    this._applyData(value);
    if (this.shadowRoot) this.#render();
    this.dispatchEvent(new CustomEvent("work-item:data-changed", {
      detail: { data: this.data, source: "property" },
      bubbles: true,
      composed: true
    }));
  }
  /**
   * Apply a data record to attributes + slotted children. Used by both the
   * .data setter and async _loadSrc. No render or event emit — caller decides.
   * @param {Recordstring, unknown} data
   */
  _applyData(data) {
    for (const [jsonKey, attr] of [
      ["itemId", "item-id"],
      ["type", "type"],
      ["priority", "priority"],
      ["status", "status"],
      ["estimate", "estimate"],
      ["assignee", "assignee"],
      ["detail", "detail"]
    ]) {
      if (data[jsonKey] != null) this.setAttribute(attr, String(data[jsonKey]));
    }
    if (data.storyIds) {
      this.setAttribute("story-ids", Array.isArray(data.storyIds) ? data.storyIds.join(",") : String(data.storyIds));
    }
    if (data.title && !this.querySelector('[slot="title"]')) {
      const el = document.createElement("h3");
      el.slot = "title";
      el.textContent = String(data.title);
      this.appendChild(el);
    }
    for (const key of ["description", "notes"]) {
      if (data[key] && !this.querySelector(`[slot="${key}"]`)) {
        const el = document.createElement("p");
        el.slot = key;
        el.textContent = String(data[key]);
        this.appendChild(el);
      }
    }
    if (data.checklist && !this.querySelector('[slot="checklist"]')) {
      const ul = document.createElement("ul");
      ul.slot = "checklist";
      const items = Array.isArray(data.checklist) ? data.checklist : [data.checklist];
      for (const item of items) {
        const li = document.createElement("li");
        li.textContent = String(item);
        ul.appendChild(li);
      }
      this.appendChild(ul);
    }
  }
  /* ── JSON loading ──────────────────────────────── */
  async _loadSrc(url) {
    if (!url) return;
    const root = (
      /** @type {ShadowRoot} */
      this.shadowRoot
    );
    root.innerHTML = `<style>${styles6}</style><div class="state-msg">Loading\u2026</div>`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      this._applyData(data);
      this.#render();
    } catch (err) {
      root.innerHTML = `<style>${styles6}</style><div class="state-msg state-msg--error">Could not load: ${esc(
        /** @type {Error} */
        err.message
      )}</div>`;
    }
  }
  /* ── Render ────────────────────────────────────── */
  #render() {
    const root = (
      /** @type {ShadowRoot} */
      this.shadowRoot
    );
    const priorityInfo = PRIORITIES[this.priority] || PRIORITIES.medium;
    const statusInfo = STATUSES[this.status] || STATUSES.backlog;
    const type = this.itemType;
    const typeIcon = TYPE_ICONS[type] || TYPE_ICONS.task;
    const level = this._detailLevel;
    const ariaLabel = this.itemId ? `Work item: ${esc(this.itemId)}` : "Work item";
    if (level === "minimal") {
      root.innerHTML = `<style>${styles6}</style>
        <article class="wi-card wi-card--minimal" role="article" aria-label="${ariaLabel}"
          tabindex="0">
          <div class="wi-body">
            <div class="wi-meta">
              ${this.itemId ? `<span class="wi-id">${esc(this.itemId)}</span>` : ""}
              <span class="wi-type" data-type="${esc(type)}">${lucideSvg(typeIcon)} ${esc(type)}</span>
            </div>
            <div class="wi-title-wrap">
              <slot name="title"><span class="wi-title-fallback">${esc(this._minimalLabel)}</span></slot>
            </div>
          </div>
        </article>`;
      return;
    }
    root.innerHTML = `<style>${styles6}</style>
      <article class="wi-card wi-card--${level}" role="article" aria-label="${ariaLabel}">

        <header class="wi-header">
          <div class="wi-meta">
            ${this.itemId ? `<span class="wi-id">${esc(this.itemId)}</span>` : ""}
            <span class="wi-type" data-type="${esc(type)}">${lucideSvg(typeIcon)} ${esc(type)}</span>
          </div>
          <div class="wi-badges">
            <span class="wi-priority" style="color:${priorityInfo.color};background:${priorityInfo.bg}">${esc(priorityInfo.label)}</span>
            <span class="wi-status" style="color:${statusInfo.color};background:${statusInfo.bg}">${esc(statusInfo.label)}</span>
            ${this.estimate ? `<span class="wi-estimate" title="Estimate">${esc(this.estimate)}</span>` : ""}
          </div>
        </header>

        <div class="wi-body">
          <div class="wi-title-wrap">
            <slot name="title"><span class="wi-title-fallback">[Untitled work item]</span></slot>
          </div>

          ${this.assignee ? `
            <div class="wi-assignee">
              <span class="wi-assignee__avatar" style="background:${hashColor(this.assignee)}">${initials(this.assignee)}</span>
              ${esc(this.assignee)}
            </div>` : ""}

          ${this.storyIds.length ? `
            <div class="wi-links">
              ${this.storyIds.map(
      (id) => `<a class="wi-link" href="#${esc(id)}">${lucideSvg('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 7h10"/><path d="M7 12h10"/><path d="M7 17h10"/>')} ${esc(id)}</a>`
    ).join("")}
            </div>` : ""}
        </div>

        <div class="wi-sections">
          <div class="wi-section">
            <div class="wi-section-header">
              <div class="wi-section-icon description">
                <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              <span class="wi-section-title">Description</span>
            </div>
            <div class="wi-section-content">
              <slot name="description"><em class="slot-fallback">No description.</em></slot>
            </div>
          </div>

          <div class="wi-section">
            <div class="wi-section-header">
              <div class="wi-section-icon checklist">
                <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
              </div>
              <span class="wi-section-title">Checklist</span>
            </div>
            <div class="wi-section-content">
              <slot name="checklist"><em class="slot-fallback">No checklist items.</em></slot>
            </div>
          </div>

          <div class="wi-section">
            <div class="wi-section-header">
              <div class="wi-section-icon notes">
                <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
              </div>
              <span class="wi-section-title">Notes</span>
            </div>
            <div class="wi-section-content">
              <slot name="notes"><em class="slot-fallback">No notes.</em></slot>
            </div>
          </div>
        </div>

      </article>`;
    if (level === "compact") {
      for (const section of root.querySelectorAll(".wi-section")) {
        const slot = section.querySelector("slot");
        if (slot && slot.assignedNodes().length === 0) {
          section.setAttribute("data-empty", "");
        }
      }
    }
    this.dispatchEvent(new CustomEvent("work-item:ready", {
      detail: {
        itemId: this.itemId,
        title: this.itemTitle,
        type,
        priority: this.priority,
        status: this.status
      },
      bubbles: true,
      composed: true
    }));
  }
};
registerComponent("work-item", WorkItem);

// src/web-components/adr-wc/styles.js
var styles7 = `
:host {
  --_bg:        var(--adr-wc-bg, var(--color-surface, #ffffff));
  --_text:      var(--adr-wc-text, var(--color-text, #1a1a1a));
  --_muted:     var(--adr-wc-muted, var(--color-text-muted, #666));
  --_border:    var(--adr-wc-border, var(--color-border, #e0e0e0));
  --_accent:    var(--adr-wc-accent, var(--color-interactive, #0066cc));
  --_card-bg:   var(--adr-wc-card-bg, var(--color-surface-raised, #f8f9fa));
  --_highlight: var(--adr-wc-highlight, color-mix(in srgb, var(--_accent) 8%, transparent));
  --_radius:    var(--adr-wc-radius, var(--radius-l, 0.75rem));
  --_shadow:       var(--adr-wc-shadow, var(--shadow-sm));
  --_shadow-hover: var(--adr-wc-shadow-hover, var(--shadow-md));
  --_duration:     var(--adr-wc-duration, var(--duration-normal, 200ms));
  --_ease:         var(--adr-wc-ease, var(--ease-default, ease));
  --_space-2xs:    var(--adr-wc-space-2xs, var(--size-2xs, 0.25rem));
  --_space-xs:     var(--adr-wc-space-xs, var(--size-xs, 0.5rem));
  --_space-s:      var(--adr-wc-space-s, var(--size-s, 0.75rem));
  --_space-m:      var(--adr-wc-space-m, var(--size-m, 1rem));
  --_font-xs:      var(--adr-wc-font-xs, var(--font-size-xs, 0.75rem));
  --_font-sm:      var(--adr-wc-font-sm, var(--font-size-sm, 0.875rem));
  --_font-md:      var(--adr-wc-font-md, var(--font-size-md, 1rem));
  --_font-lg:      var(--adr-wc-font-lg, var(--font-size-lg, 1.125rem));
  --_font-mono:    var(--adr-wc-font-mono, var(--font-mono, ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, monospace));
  --_radius-s:     var(--adr-wc-radius-s, var(--radius-s, 0.25rem));
  --_radius-full:  var(--adr-wc-radius-full, var(--radius-full, 9999px));

  display: block;
  font-family: var(--adr-wc-font, var(--font-sans, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif));
}

*, *::before, *::after { box-sizing: border-box; margin: 0; }

/* \u2500\u2500 Card \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.adr-card {
  background: var(--_bg);
  border: 1px solid var(--_border);
  border-radius: var(--_radius);
  overflow: hidden;
  box-shadow: var(--_shadow);
  transition: box-shadow var(--_duration) var(--_ease);
}

.adr-card:hover {
  box-shadow: var(--_shadow-hover);
}

/* \u2500\u2500 Header \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.adr-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--_space-s) var(--_space-m);
  background: var(--_card-bg);
  border-block-end: 1px solid var(--_border);
  gap: var(--_space-s);
  flex-wrap: wrap;
}

.adr-meta {
  display: flex;
  align-items: center;
  gap: var(--_space-xs);
  flex-wrap: wrap;
  min-width: 0;
}

.adr-id {
  font-size: var(--_font-xs);
  font-weight: 600;
  color: var(--_muted);
  font-family: var(--_font-mono);
}

/* \u2500\u2500 Status badge \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.adr-badges {
  display: flex;
  align-items: center;
  gap: var(--_space-xs);
}

.adr-status {
  font-size: 11px;
  padding: 4px 10px;
  border-radius: var(--_radius-full);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

/* \u2500\u2500 Date (slotted time) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.adr-date-wrap {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: var(--_font-xs);
  color: var(--_muted);
}

.adr-date-wrap svg {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
}

::slotted([slot="date"]) {
  font-size: var(--_font-xs);
  font-family: var(--_font-mono);
  color: var(--_muted);
}

/* \u2500\u2500 Body \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.adr-body {
  padding: 16px 20px;
}

/* \u2500\u2500 Title (slotted heading) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.adr-title-wrap {
  margin-block-end: 0;
}

::slotted([slot="title"]) {
  font-size: var(--_font-lg) !important;
  font-weight: 700 !important;
  color: var(--_text) !important;
  line-height: 1.4 !important;
  margin: 0 !important;
}

/* Fallback title when no slot content */
.adr-title-fallback {
  font-size: var(--_font-lg);
  font-weight: 700;
  color: var(--_text);
  line-height: 1.4;
}

/* \u2500\u2500 Supersedes / Superseded-by links \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.adr-links {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-block-start: var(--_space-s);
}

.adr-links-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--_muted);
  text-transform: uppercase;
  letter-spacing: 0.3px;
  margin-inline-end: var(--_space-2xs);
  align-self: center;
}

.adr-link {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: var(--_radius-s);
  background: var(--_highlight);
  color: var(--_accent);
  text-decoration: none;
}

.adr-link:hover {
  text-decoration: underline;
}

.adr-link svg {
  width: 11px;
  height: 11px;
}

/* \u2500\u2500 Sections \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.adr-sections {
  border-block-start: 1px solid var(--_border);
}

.adr-section {
  padding: 14px 20px;
  border-block-end: 1px solid var(--_border);
}

.adr-section:last-child {
  border-block-end: none;
}

.adr-section-header {
  display: flex;
  align-items: center;
  gap: var(--_space-xs);
  margin-block-end: var(--_space-s);
}

.adr-section-icon {
  width: 22px;
  height: 22px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.adr-section-icon svg {
  width: 13px;
  height: 13px;
  fill: var(--color-text-inverted, #fff);
}

.adr-section-icon.context      { background: var(--color-accent,  #8b5cf6); }
.adr-section-icon.decision     { background: var(--color-success, #22c55e); }
.adr-section-icon.consequences { background: var(--color-warning, #f59e0b); }

.adr-section-title {
  font-size: var(--_font-xs);
  font-weight: 600;
  color: var(--_muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.adr-section-content {
  color: var(--_text);
  font-size: var(--_font-sm);
  line-height: 1.6;
}

.adr-section-content ::slotted(ul),
.adr-section-content ::slotted(ol) {
  margin: 0;
  padding-inline-start: 20px;
}

.adr-section-content ::slotted(p) {
  margin: 0;
}

.slot-fallback {
  color: var(--_muted);
  font-style: italic;
}

/* \u2500\u2500 Minimal detail \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.adr-card--minimal {
  padding: var(--_space-xs);
  cursor: pointer;
}

.adr-card--minimal:hover {
  box-shadow: var(--_shadow-hover);
}

.adr-card--minimal:focus-visible {
  outline: 2px solid var(--_accent);
  outline-offset: 2px;
}

.adr-card--minimal .adr-header { display: none; }
.adr-card--minimal .adr-sections { display: none; }
.adr-card--minimal .adr-links { display: none; }
.adr-card--minimal .adr-date-wrap { display: none; }

.adr-card--minimal .adr-body {
  padding: var(--_space-xs) var(--_space-s);
}

.adr-card--minimal .adr-title-fallback,
.adr-card--minimal ::slotted([slot="title"]) {
  font-size: var(--_font-sm) !important;
  font-weight: 600 !important;
}

.adr-card--minimal .adr-id {
  display: block;
  margin-block-end: var(--_space-2xs);
}

.adr-card--minimal .adr-status {
  font-size: 10px;
  padding: 2px 6px;
}

/* \u2500\u2500 Compact detail \u2014 hide empty sections \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.adr-card--compact .adr-section[data-empty] {
  display: none;
}

.adr-card--compact .slot-fallback {
  display: none;
}

.adr-card--compact .adr-body {
  padding: var(--_space-s) var(--_space-m);
}

/* \u2500\u2500 Responsive \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
@media (max-width: 480px) {
  .adr-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .adr-badges {
    width: 100%;
    justify-content: flex-start;
  }
}

@media (prefers-reduced-motion: reduce) {
  .adr-card {
    transition: none;
  }
}

@media print {
  .adr-card {
    box-shadow: none;
    break-inside: avoid;
  }
}

.state-msg        { padding: var(--_space-m); font-size: var(--_font-sm); color: var(--_muted); font-style: italic; }
.state-msg--error { color: var(--color-error-text, var(--color-error, #dc2626)); }
`;

// src/web-components/adr-wc/logic.js
var STATUSES2 = {
  proposed: { label: "Proposed", color: "#3b82f6", bg: "rgba(59, 130, 246, 0.1)" },
  accepted: { label: "Accepted", color: "#22c55e", bg: "rgba(34, 197, 94, 0.1)" },
  deprecated: { label: "Deprecated", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.1)" },
  superseded: { label: "Superseded", color: "#6b7280", bg: "rgba(107, 114, 128, 0.1)" }
};
var ICONS = {
  calendar: '<rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>',
  context: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/>',
  decision: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>',
  consequences: '<path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>',
  arrowRight: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>'
};
var AdrWc = class extends HTMLElement {
  static get observedAttributes() {
    return [
      "adr-id",
      "status",
      "supersedes",
      "superseded-by",
      "detail",
      "compact",
      "src"
    ];
  }
  #slotCache = /* @__PURE__ */ new Map();
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
  /* ── Slot caching ───────────────────────────────── */
  #cacheSlotValues() {
    for (const child of [...this.children]) {
      const slotName = child.getAttribute("slot");
      if (slotName) {
        this.#slotCache.set(slotName, child.textContent.trim());
      }
    }
  }
  /* ── Lifecycle ─────────────────────────────────── */
  connectedCallback() {
    this.#cacheSlotValues();
    if (this.adrId && !this.id) this.id = this.adrId;
    if (this.hasAttribute("src")) {
      this._loadSrc(this.getAttribute("src"));
    }
    this.#render();
    this.setAttribute("data-upgraded", "");
  }
  disconnectedCallback() {
    this.removeAttribute("data-upgraded");
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue && this.shadowRoot) {
      if (name === "src" && this.isConnected) {
        this._loadSrc(newValue);
      } else {
        this.#render();
      }
    }
  }
  /* ── Getters ───────────────────────────────────── */
  get adrId() {
    return this.getAttribute("adr-id") || "";
  }
  get status() {
    return this.getAttribute("status") || "proposed";
  }
  /** Read the title from the slotted heading's text content */
  get adrTitle() {
    const slotted = this.querySelector('[slot="title"]');
    return slotted?.textContent?.trim() || this.#slotCache.get("title") || "";
  }
  /** Read the date from the slotted time's datetime attribute or text */
  get adrDate() {
    const slotted = this.querySelector('[slot="date"]');
    return slotted?.getAttribute("datetime") || slotted?.textContent?.trim() || this.#slotCache.get("date") || "";
  }
  get supersedes() {
    const raw = this.getAttribute("supersedes") || "";
    return raw ? raw.split(",").map((s) => s.trim()).filter(Boolean) : [];
  }
  get supersededBy() {
    const raw = this.getAttribute("superseded-by") || "";
    return raw ? raw.split(",").map((s) => s.trim()).filter(Boolean) : [];
  }
  get _detailLevel() {
    if (this.getAttribute("detail")) return this.getAttribute("detail");
    if (this.hasAttribute("compact")) return "compact";
    return "full";
  }
  get _minimalLabel() {
    return this.adrTitle || this.adrId || "ADR";
  }
  /* ── Data API ──────────────────────────────────── */
  /**
   * Read the ADR as a plain data object. Mirrors what a consumer would
   * assign to .data — useful for diffing or persistence.
   */
  get data() {
    return {
      adrId: this.adrId || void 0,
      status: this.status,
      detail: this.getAttribute("detail") || void 0,
      supersedes: this.supersedes.length ? this.supersedes : void 0,
      supersededBy: this.supersededBy.length ? this.supersededBy : void 0,
      title: this.adrTitle || void 0,
      date: this.adrDate || void 0
    };
  }
  /**
   * Set state attributes and slotted content from a plain object in one
   * call. Idempotent for repeat calls.
   */
  set data(value) {
    if (!value || typeof value !== "object") return;
    this._applyData(value);
    this.#cacheSlotValues();
    if (this.shadowRoot) this.#render();
    this.dispatchEvent(new CustomEvent("adr-wc:data-changed", {
      detail: { data: this.data, source: "property" },
      bubbles: true,
      composed: true
    }));
  }
  /**
   * Apply a data record to attributes + slotted children. Used by both
   * the .data setter and async _loadSrc.
   * @param {Recordstring, unknown} data
   */
  _applyData(data) {
    if (data.adrId != null) this.setAttribute("adr-id", String(data.adrId));
    if (data.status != null) this.setAttribute("status", String(data.status));
    if (data.detail != null) this.setAttribute("detail", String(data.detail));
    if (data.supersedes) {
      this.setAttribute("supersedes", Array.isArray(data.supersedes) ? data.supersedes.join(",") : String(data.supersedes));
    }
    if (data.supersededBy) {
      this.setAttribute("superseded-by", Array.isArray(data.supersededBy) ? data.supersededBy.join(",") : String(data.supersededBy));
    }
    if (data.title && !this.querySelector('[slot="title"]')) {
      const h = document.createElement("h3");
      h.slot = "title";
      h.textContent = String(data.title);
      this.appendChild(h);
    }
    if (data.date && !this.querySelector('[slot="date"]')) {
      const t = document.createElement("time");
      t.slot = "date";
      t.setAttribute("datetime", String(data.date));
      t.textContent = new Date(String(data.date)).toLocaleDateString(void 0, { year: "numeric", month: "long", day: "numeric" });
      this.appendChild(t);
    }
    for (const key of ["context", "decision"]) {
      if (data[key] && !this.querySelector(`[slot="${key}"]`)) {
        const p = document.createElement("p");
        p.slot = key;
        p.textContent = String(data[key]);
        this.appendChild(p);
      }
    }
    if (data.consequences && !this.querySelector('[slot="consequences"]')) {
      const ul = document.createElement("ul");
      ul.slot = "consequences";
      const items = Array.isArray(data.consequences) ? data.consequences : [data.consequences];
      for (const item of items) {
        const li = document.createElement("li");
        li.textContent = String(item);
        ul.appendChild(li);
      }
      this.appendChild(ul);
    }
  }
  /* ── JSON loading ──────────────────────────────── */
  async _loadSrc(url) {
    if (!url) return;
    const root = (
      /** @type {ShadowRoot} */
      this.shadowRoot
    );
    root.innerHTML = `<style>${styles7}</style><div class="state-msg">Loading\u2026</div>`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      this._applyData(data);
      this.#cacheSlotValues();
      this.#render();
    } catch (err) {
      root.innerHTML = `<style>${styles7}</style><div class="state-msg state-msg--error">Could not load: ${esc(
        /** @type {Error} */
        err.message
      )}</div>`;
    }
  }
  /* ── Render ────────────────────────────────────── */
  #render() {
    const root = (
      /** @type {ShadowRoot} */
      this.shadowRoot
    );
    const statusInfo = STATUSES2[this.status] || STATUSES2.proposed;
    const level = this._detailLevel;
    const ariaLabel = this.adrId ? `ADR: ${esc(this.adrId)}` : "Architectural Decision Record";
    const hasDate = !!this.querySelector('[slot="date"]') || this.#slotCache.has("date");
    if (level === "minimal") {
      root.innerHTML = `<style>${styles7}</style>
        <article class="adr-card adr-card--minimal" role="article" aria-label="${ariaLabel}"
          tabindex="0">
          <div class="adr-body">
            <div class="adr-meta">
              ${this.adrId ? `<span class="adr-id">${esc(this.adrId)}</span>` : ""}
              <span class="adr-status" style="color:${statusInfo.color};background:${statusInfo.bg}">${esc(statusInfo.label)}</span>
            </div>
            <div class="adr-title-wrap">
              <slot name="title"><span class="adr-title-fallback">${esc(this._minimalLabel)}</span></slot>
            </div>
          </div>
        </article>`;
      return;
    }
    root.innerHTML = `<style>${styles7}</style>
      <article class="adr-card adr-card--${level}" role="article" aria-label="${ariaLabel}">

        <header class="adr-header">
          <div class="adr-meta">
            ${this.adrId ? `<span class="adr-id">${esc(this.adrId)}</span>` : ""}
            ${hasDate ? `<span class="adr-date-wrap">${lucideSvg(ICONS.calendar)} <slot name="date"></slot></span>` : ""}
          </div>
          <div class="adr-badges">
            <span class="adr-status" style="color:${statusInfo.color};background:${statusInfo.bg}">${esc(statusInfo.label)}</span>
          </div>
        </header>

        <div class="adr-body">
          <div class="adr-title-wrap">
            <slot name="title"><span class="adr-title-fallback">[Untitled ADR]</span></slot>
          </div>

          ${this.supersedes.length ? `
            <div class="adr-links">
              <span class="adr-links-label">Supersedes</span>
              ${this.supersedes.map(
      (id) => `<a class="adr-link" href="#${esc(id)}">${lucideSvg(ICONS.arrowRight)} ${esc(id)}</a>`
    ).join("")}
            </div>` : ""}

          ${this.supersededBy.length ? `
            <div class="adr-links">
              <span class="adr-links-label">Superseded by</span>
              ${this.supersededBy.map(
      (id) => `<a class="adr-link" href="#${esc(id)}">${lucideSvg(ICONS.arrowRight)} ${esc(id)}</a>`
    ).join("")}
            </div>` : ""}
        </div>

        <div class="adr-sections">
          <div class="adr-section">
            <div class="adr-section-header">
              <div class="adr-section-icon context">${lucideSvg(ICONS.context)}</div>
              <span class="adr-section-title">Context</span>
            </div>
            <div class="adr-section-content">
              <slot name="context"><em class="slot-fallback">No context provided.</em></slot>
            </div>
          </div>

          <div class="adr-section">
            <div class="adr-section-header">
              <div class="adr-section-icon decision">${lucideSvg(ICONS.decision)}</div>
              <span class="adr-section-title">Decision</span>
            </div>
            <div class="adr-section-content">
              <slot name="decision"><em class="slot-fallback">No decision recorded.</em></slot>
            </div>
          </div>

          <div class="adr-section">
            <div class="adr-section-header">
              <div class="adr-section-icon consequences">${lucideSvg(ICONS.consequences)}</div>
              <span class="adr-section-title">Consequences</span>
            </div>
            <div class="adr-section-content">
              <slot name="consequences"><em class="slot-fallback">No consequences documented.</em></slot>
            </div>
          </div>
        </div>

      </article>`;
    if (level === "compact") {
      for (const section of root.querySelectorAll(".adr-section")) {
        const slot = section.querySelector("slot");
        if (slot && slot.assignedNodes().length === 0) {
          section.setAttribute("data-empty", "");
        }
      }
    }
    this.dispatchEvent(new CustomEvent("adr-wc:ready", {
      detail: {
        adrId: this.adrId,
        title: this.adrTitle,
        status: this.status
      },
      bubbles: true,
      composed: true
    }));
  }
};
registerComponent("adr-wc", AdrWc);

// src/web-components/iron-triangle/_capacity.js
function defaultFormula(time, cost, focusFactor) {
  const weeks = num(time?.sprintCount) > 0 ? num(time.sprintCount) * (num(time.sprintWeeks) || 1) : num(time?.sprintWeeks);
  const fte = num(cost?.teamFTE);
  const f = clamp(num(focusFactor), 0, 1);
  if (!(weeks > 0) || !(fte > 0) || !(f > 0)) return 0;
  return Math.ceil(weeks * fte * f);
}
function fnv1a(str) {
  let hash3 = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash3 ^= str.charCodeAt(i);
    hash3 = Math.imul(hash3, 16777619);
  }
  return (hash3 >>> 0).toString(36);
}
function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return "[" + value.map(stableStringify).join(",") + "]";
  const keys = Object.keys(value).sort();
  return "{" + keys.map((k) => JSON.stringify(k) + ":" + stableStringify(value[k])).join(",") + "}";
}
function triangleHash({ time, cost, scope }) {
  return fnv1a(stableStringify({ time: time || {}, cost: cost || {}, scope: scope || {} }));
}
function num(value) {
  if (value === "" || value == null) return 0;
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}
function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

// src/web-components/iron-triangle/_triangle-geometry.js
var MIN_STRETCH = 0.55;
var MAX_STRETCH = 1.45;
function relativeMagnitudes({ time = {}, cost = {}, scope = {} } = {}) {
  return {
    t: numeric(time.sprintCount, 1) * numeric(time.sprintWeeks, 1),
    c: numeric(cost.teamFTE, 0) * numeric(cost.hoursPerWeek, 40),
    s: numeric(scope.mustHaveCount, 0) + 0.5 * numeric(scope.shouldHaveCount, 0)
  };
}
function stretchFactors(mag) {
  const positives = [mag.t, mag.c, mag.s].filter((v) => v > 0);
  if (positives.length === 0) return { time: 1, cost: 1, scope: 1 };
  const max = Math.max(...positives);
  const norm = (v) => v <= 0 ? MIN_STRETCH : MIN_STRETCH + (MAX_STRETCH - MIN_STRETCH) * (v / max);
  return { time: norm(mag.t), cost: norm(mag.c), scope: norm(mag.s) };
}
function triangleVertices(value, radius = 80) {
  const baseAngles = {
    scope: -Math.PI / 2,
    // top
    time: 5 * Math.PI / 6,
    // bottom-left
    cost: Math.PI / 6
    // bottom-right (SVG-y down)
  };
  const fs = stretchFactors(relativeMagnitudes(value));
  const at = (key) => ({
    x: Math.cos(baseAngles[key]) * radius * fs[key],
    y: Math.sin(baseAngles[key]) * radius * fs[key],
    factor: fs[key]
  });
  return { scope: at("scope"), time: at("time"), cost: at("cost") };
}
function formatTimeSummary(time = {}) {
  const sprintCount = numeric(time.sprintCount, 0);
  const sprintWeeks = numeric(time.sprintWeeks, 0);
  if (sprintCount > 0 && sprintWeeks > 0) {
    const total = sprintCount * sprintWeeks;
    return sprintCount > 1 ? `${total} weeks (${sprintCount} \xD7 ${sprintWeeks}wk)` : `${total} week${total === 1 ? "" : "s"}`;
  }
  if (sprintWeeks > 0) return `${sprintWeeks} week${sprintWeeks === 1 ? "" : "s"}`;
  if (time.deadline) return `until ${time.deadline}`;
  return "TBD";
}
function formatCostSummary(cost = {}) {
  const fte = Number(cost.teamFTE);
  const tier = cost.budgetTier;
  const parts = [];
  if (Number.isFinite(fte) && fte > 0) parts.push(`${fte} FTE`);
  if (tier && tier !== "unset") parts.push(tier);
  return parts.length > 0 ? parts.join(" \xB7 ") : "TBD";
}
function formatScopeSummary(scope = {}) {
  const must = numeric(scope.mustHaveCount, 0);
  const should = numeric(scope.shouldHaveCount, 0);
  if (must > 0 && should > 0) return `${must} must \xB7 ${should} should`;
  if (must > 0) return `${must} must-have`;
  if (should > 0) return `${should} should-have`;
  return "TBD";
}
function formatQualitySummary(qualitySummary) {
  if (typeof qualitySummary === "string" && qualitySummary.trim().length > 0) {
    return qualitySummary;
  }
  return "TBD \u2014 click to set";
}
var SVG_NS = "http://www.w3.org/2000/svg";
var VERTEX_LABEL_OFFSETS = {
  scope: { dx: 0, dy: -22, anchor: "middle" },
  time: { dx: -10, dy: 14, anchor: "end" },
  cost: { dx: 10, dy: 14, anchor: "start" }
};
var VERTEX_SUMMARY_OFFSETS = {
  scope: { dx: 0, dy: -8, anchor: "middle" },
  time: { dx: -10, dy: 28, anchor: "end" },
  cost: { dx: 10, dy: 28, anchor: "start" }
};
var VERTEX_LABELS = {
  scope: { name: "Scope", unit: "# features / story points" },
  time: { name: "Time", unit: "hours / days / weeks" },
  cost: { name: "Cost", unit: "FTE / $" }
};
function buildTriangleSvg({
  value = {},
  vertices,
  capacityPoints = 0,
  capacitySource = "formula",
  qualitySummary = ""
} = {}) {
  const v = vertices || triangleVertices(value);
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", "-220 -170 440 340");
  svg.setAttribute("role", "group");
  svg.setAttribute(
    "aria-label",
    `Project shape: ${capacityPoints || 0} capacity points. Click each corner to edit, or the center to open the quality compass.`
  );
  const tri = document.createElementNS(SVG_NS, "polygon");
  tri.setAttribute("class", "triangle");
  tri.setAttribute("points", [
    `${round(v.scope.x)},${round(v.scope.y)}`,
    `${round(v.time.x)},${round(v.time.y)}`,
    `${round(v.cost.x)},${round(v.cost.y)}`
  ].join(" "));
  svg.append(tri);
  const center = document.createElementNS(SVG_NS, "g");
  center.setAttribute("class", "center");
  center.setAttribute("data-target", "quality");
  center.setAttribute("tabindex", "0");
  center.setAttribute("role", "button");
  center.setAttribute(
    "aria-label",
    `Quality \u2014 ${formatQualitySummary(qualitySummary)}. Activate to open the NFR compass.`
  );
  const backdrop = document.createElementNS(SVG_NS, "circle");
  backdrop.setAttribute("class", "capacity-backdrop");
  backdrop.setAttribute("cx", "0");
  backdrop.setAttribute("cy", "4");
  backdrop.setAttribute("r", "32");
  center.append(backdrop);
  const centerHit = document.createElementNS(SVG_NS, "rect");
  centerHit.setAttribute("class", "hit");
  centerHit.setAttribute("x", "-36");
  centerHit.setAttribute("y", "-30");
  centerHit.setAttribute("width", "72");
  centerHit.setAttribute("height", "68");
  centerHit.setAttribute("rx", "34");
  center.append(centerHit);
  const quality = document.createElementNS(SVG_NS, "text");
  quality.setAttribute("class", "quality-label");
  quality.setAttribute("x", "0");
  quality.setAttribute("y", "-15");
  quality.setAttribute("text-anchor", "middle");
  quality.textContent = "Quality";
  center.append(quality);
  const cap = document.createElementNS(SVG_NS, "text");
  cap.setAttribute("class", "capacity");
  cap.setAttribute("x", "0");
  cap.setAttribute("y", "7");
  cap.setAttribute("text-anchor", "middle");
  cap.setAttribute("dominant-baseline", "middle");
  cap.textContent = capacityPoints > 0 ? String(capacityPoints) : "\u2014";
  center.append(cap);
  const unit = document.createElementNS(SVG_NS, "text");
  unit.setAttribute("class", "capacity-unit");
  unit.setAttribute("x", "0");
  unit.setAttribute("y", "26");
  unit.setAttribute("text-anchor", "middle");
  unit.textContent = capacitySource === "manual" ? "pts (manual)" : "pts";
  center.append(unit);
  const centerTitle = document.createElementNS(SVG_NS, "title");
  centerTitle.textContent = formatQualitySummary(qualitySummary);
  center.append(centerTitle);
  svg.append(center);
  for (const axis of ["scope", "time", "cost"]) {
    svg.append(buildVertex(axis, v[axis], value));
  }
  return svg;
}
function buildVertex(axis, vertex, value) {
  const labelMeta = VERTEX_LABEL_OFFSETS[axis];
  const summaryMeta = VERTEX_SUMMARY_OFFSETS[axis];
  const labels = VERTEX_LABELS[axis];
  const summary = axis === "scope" ? formatScopeSummary(value.scope) : axis === "cost" ? formatCostSummary(value.cost) : formatTimeSummary(value.time);
  const g = document.createElementNS(SVG_NS, "g");
  g.setAttribute("class", "vertex");
  g.setAttribute("data-axis", axis);
  g.setAttribute("tabindex", "0");
  g.setAttribute("role", "button");
  g.setAttribute("aria-label", `${labels.name} \u2014 ${summary}. Activate to edit.`);
  const hit = document.createElementNS(SVG_NS, "rect");
  hit.setAttribute("class", "hit");
  const hitW = 160;
  const hitH = 50;
  let hitX;
  if (labelMeta.anchor === "end") {
    hitX = vertex.x - hitW + 6;
  } else if (labelMeta.anchor === "start") {
    hitX = vertex.x - 6;
  } else {
    hitX = vertex.x - hitW / 2;
  }
  const hitY = axis === "scope" ? vertex.y - hitH + 6 : vertex.y - 6;
  hit.setAttribute("x", String(round(hitX)));
  hit.setAttribute("y", String(round(hitY)));
  hit.setAttribute("width", String(hitW));
  hit.setAttribute("height", String(hitH));
  hit.setAttribute("rx", "6");
  g.append(hit);
  const name = document.createElementNS(SVG_NS, "text");
  name.setAttribute("class", "vertex-name");
  name.setAttribute("x", String(round(vertex.x + labelMeta.dx)));
  name.setAttribute("y", String(round(vertex.y + labelMeta.dy)));
  name.setAttribute("text-anchor", labelMeta.anchor);
  name.textContent = labels.name;
  g.append(name);
  const summaryEl = document.createElementNS(SVG_NS, "text");
  summaryEl.setAttribute("class", "vertex-summary");
  summaryEl.setAttribute("x", String(round(vertex.x + summaryMeta.dx)));
  summaryEl.setAttribute("y", String(round(vertex.y + summaryMeta.dy)));
  summaryEl.setAttribute("text-anchor", summaryMeta.anchor);
  summaryEl.textContent = summary;
  g.append(summaryEl);
  const title = document.createElementNS(SVG_NS, "title");
  title.textContent = `${labels.name}: ${summary} \u2014 ${labels.unit}`;
  g.append(title);
  return g;
}
function numeric(value, fallback) {
  if (value === "" || value == null) return fallback;
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}
function round(n) {
  return Math.round(n * 100) / 100;
}

// src/web-components/iron-triangle/logic.js
var SECTIONS = ["time", "cost", "scope"];
var FIELD_DEFS = {
  time: [
    { key: "sprintWeeks", label: "Sprint length (weeks)", type: "number", min: 1, step: 1, value: 2, width: "6rem" },
    { key: "sprintCount", label: "Number of sprints", type: "number", min: 1, step: 1, value: 3, width: "6rem" },
    { key: "hoursPerWeek", label: "Hours per week (per FTE)", type: "number", min: 1, max: 168, step: 1, value: 40, width: "6rem" },
    { key: "deadline", label: "Deadline (optional)", type: "date", width: "12rem" }
  ],
  cost: [
    { key: "teamFTE", label: "Team size (FTE)", type: "number", min: 0, step: 0.5, value: 1, width: "6rem" },
    { key: "budgetTier", label: "Budget tier", type: "select", options: [
      ["solo", "Solo"],
      ["small", "Small (2-5)"],
      ["medium", "Medium (6-15)"],
      ["large", "Large (16+)"]
    ], value: "solo", width: "14rem" },
    { key: "contractorBudget", label: "Contractor budget ($, optional)", type: "number", min: 0, step: 100, width: "10rem" }
  ],
  scope: [
    { key: "mustHaveCount", label: "Must-have feature count", type: "number", min: 0, step: 1, width: "6rem" },
    { key: "shouldHaveCount", label: "Should-have feature count", type: "number", min: 0, step: 1, width: "6rem" },
    { key: "scopeNotes", label: "Notes", type: "textarea", rows: 3, maxlength: 2e3 }
  ]
};
var SECTION_TITLES = {
  scope: "Scope",
  time: "Time",
  cost: "Cost"
};
var IronTriangle = class extends VBElement {
  static formAssociated = true;
  static get observedAttributes() {
    return [
      "data-focus-factor",
      "data-min-capacity",
      "data-quality-href",
      "data-quality-summary",
      "disabled",
      "locked"
    ];
  }
  /** @type {ElementInternals} */
  #internals;
  #value = {
    time: {},
    cost: {},
    scope: {},
    capacityPoints: 0,
    capacitySource: "formula",
    hash: ""
  };
  /** @type {number | null} */
  #manualPoints = null;
  #revisionLog = [];
  #qualitySummary = "";
  /** @type {Recordstring, HTMLDialogElement} */
  #dialogs = {};
  constructor() {
    super();
    this.#internals = this.attachInternals();
    this._adoptInternals(this.#internals);
  }
  setup() {
    this.#qualitySummary = this.getAttribute("data-quality-summary") || "";
    this.#seedDefaults();
    this.#renderViz();
    this.listen(this, "click", (e) => this.#onClick(e));
    this.listen(this, "keydown", (e) => this.#onKeydown(e));
  }
  attributeChangedCallback(name) {
    if (!this.isConnected) return;
    if (name === "data-focus-factor" || name === "data-min-capacity") {
      this.#recompute({ source: "attribute" });
    } else if (name === "data-quality-summary") {
      this.#qualitySummary = this.getAttribute("data-quality-summary") || "";
      this.#renderViz();
    } else if (name === "disabled" || name === "locked") {
      this.#syncDisabledLocked();
    }
  }
  // ── Public API ────────────────────────────────────────────────────
  get value() {
    return JSON.parse(JSON.stringify({ ...this.#value, revisionLog: this.#revisionLog }));
  }
  set value(next) {
    if (!next || typeof next !== "object") return;
    for (const section of SECTIONS) {
      if (next[section] && typeof next[section] === "object") {
        this.#value[section] = { ...next[section] };
      }
    }
    if (next.capacitySource === "manual" && Number.isFinite(next.capacityPoints)) {
      this.#manualPoints = next.capacityPoints;
      this.#value.capacitySource = "manual";
    } else {
      this.#manualPoints = null;
      this.#value.capacitySource = "formula";
    }
    if (Array.isArray(next.revisionLog)) this.#revisionLog = [...next.revisionLog];
    this.#syncDialogInputs();
    this.#recompute({ source: "property" });
  }
  get capacityPoints() {
    return this.#value.capacityPoints;
  }
  get capacitySource() {
    return this.#value.capacitySource;
  }
  get hash() {
    return this.#value.hash;
  }
  get revisionLog() {
    return JSON.parse(JSON.stringify(this.#revisionLog));
  }
  get qualitySummary() {
    return this.#qualitySummary;
  }
  set qualitySummary(s) {
    this.#qualitySummary = String(s ?? "");
    this.#renderViz();
  }
  /** Imperatively open a vertex editor. */
  openEditor(axis) {
    if (!SECTIONS.includes(axis)) return;
    const dialog = this.#ensureDialog(axis);
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
  }
  revise(field, newValue, reason) {
    if (!field || typeof reason !== "string" || reason.length < 10) {
      throw new Error("iron-triangle: revise() requires field and a reason of at least 10 characters");
    }
    const from = this.#getField(field);
    this.#setField(field, newValue);
    const change = { field, from, to: newValue, reason };
    this.#revisionLog.push({ revisedAt: (/* @__PURE__ */ new Date()).toISOString(), changes: [change] });
    this.dispatchEvent(new CustomEvent("iron-triangle:revise", {
      bubbles: true,
      composed: true,
      detail: change
    }));
    this.#syncDialogInputs();
    this.#recompute({ source: "revise" });
  }
  setManual(integer) {
    const n = Math.max(1, Math.floor(Number(integer) || 0));
    this.#manualPoints = n;
    const previous = this.#value.capacitySource;
    this.#value.capacitySource = "manual";
    if (previous !== "manual") {
      this.dispatchEvent(new CustomEvent("iron-triangle:mode", {
        bubbles: true,
        composed: true,
        detail: { from: previous, to: "manual" }
      }));
    }
    this.setState("manual", true);
    this.setState("formula", false);
    this.#recompute({ source: "manual" });
  }
  setFormula() {
    this.#manualPoints = null;
    const previous = this.#value.capacitySource;
    this.#value.capacitySource = "formula";
    if (previous !== "formula") {
      this.dispatchEvent(new CustomEvent("iron-triangle:mode", {
        bubbles: true,
        composed: true,
        detail: { from: previous, to: "formula" }
      }));
    }
    this.setState("manual", false);
    this.setState("formula", true);
    this.#recompute({ source: "formula" });
  }
  recalc() {
    this.#recompute({ source: "recalc" });
  }
  // ── Internal: SVG hit-target click/keyboard ──────────────────────
  #onClick(event) {
    const vertex = event.target.closest?.(".vertex[data-axis]");
    if (vertex && this.contains(vertex)) {
      event.preventDefault();
      this.openEditor(vertex.dataset.axis);
      return;
    }
    const center = event.target.closest?.('.center[data-target="quality"]');
    if (center && this.contains(center)) {
      event.preventDefault();
      this.#fireQualityOpen();
    }
  }
  #onKeydown(event) {
    if (event.key !== "Enter" && event.key !== " ") return;
    const vertex = event.target.closest?.(".vertex[data-axis]");
    if (vertex && this.contains(vertex)) {
      event.preventDefault();
      this.openEditor(vertex.dataset.axis);
      return;
    }
    const center = event.target.closest?.('.center[data-target="quality"]');
    if (center && this.contains(center)) {
      event.preventDefault();
      this.#fireQualityOpen();
    }
  }
  #fireQualityOpen() {
    const evt = new CustomEvent("iron-triangle:open-quality", {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: { qualitySummary: this.#qualitySummary, capacityPoints: this.#value.capacityPoints }
    });
    const allowDefault = this.dispatchEvent(evt);
    if (allowDefault) {
      const href = this.getAttribute("data-quality-href");
      if (href) window.location.assign(href);
    }
  }
  // ── Internal: dialogs ─────────────────────────────────────────────
  #ensureDialog(axis) {
    if (this.#dialogs[axis]) return this.#dialogs[axis];
    const dialog = document.createElement("dialog");
    dialog.className = `iron-triangle-dialog iron-triangle-dialog--${axis}`;
    dialog.setAttribute("aria-label", `${SECTION_TITLES[axis]} \u2014 edit`);
    const form = document.createElement("form");
    form.method = "dialog";
    form.setAttribute("data-layout", "stack");
    form.setAttribute("data-layout-gap", "m");
    const heading = document.createElement("h3");
    heading.textContent = SECTION_TITLES[axis];
    form.append(heading);
    for (const def of FIELD_DEFS[axis]) {
      form.append(buildFormField(axis, def, this.#value[axis]?.[def.key]));
    }
    const actions = document.createElement("div");
    actions.setAttribute("data-layout", "cluster");
    actions.setAttribute("data-layout-gap", "s");
    actions.setAttribute("data-layout-justify", "end");
    const cancel = document.createElement("button");
    cancel.type = "button";
    cancel.value = "cancel";
    cancel.textContent = "Cancel";
    cancel.addEventListener("click", () => dialog.close("cancel"));
    const save = document.createElement("button");
    save.type = "submit";
    save.value = "save";
    save.textContent = "Save";
    actions.append(cancel, save);
    form.append(actions);
    dialog.append(form);
    this.append(dialog);
    this.#dialogs[axis] = dialog;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.#captureDialog(axis, form);
      dialog.close("save");
      this.#recompute({ source: "dialog", field: axis });
    });
    return dialog;
  }
  #captureDialog(axis, form) {
    const next = {};
    for (const def of FIELD_DEFS[axis]) {
      const input = form.querySelector(`[name="${axis}.${def.key}"]`);
      if (!input) continue;
      const raw = input.type === "checkbox" ? input.checked : input.value;
      if (raw === "" || raw == null) continue;
      if (def.type === "number") {
        const n = Number(raw);
        if (Number.isFinite(n)) next[def.key] = n;
      } else {
        next[def.key] = raw;
      }
    }
    this.#value[axis] = next;
  }
  #syncDialogInputs() {
    for (const axis of SECTIONS) {
      const dialog = this.#dialogs[axis];
      if (!dialog) continue;
      for (const def of FIELD_DEFS[axis]) {
        const input = (
          /** @type {HTMLInputElement | null} */
          dialog.querySelector(`[name="${axis}.${def.key}"]`)
        );
        if (!input) continue;
        const v = this.#value[axis]?.[def.key];
        input.value = v == null ? "" : String(v);
      }
    }
  }
  // ── Internal: capacity + viz ──────────────────────────────────────
  #seedDefaults() {
    for (const axis of SECTIONS) {
      for (const def of FIELD_DEFS[axis]) {
        if (def.value !== void 0 && this.#value[axis][def.key] === void 0) {
          this.#value[axis][def.key] = def.value;
        }
      }
    }
    this.#recompute({ source: "init" });
  }
  /** @param {{ source?: string, field?: string }} [options] */
  #recompute({ source, field } = {}) {
    const focusFactor = Number(this.dataset.focusFactor ?? 0.6);
    const minCapacity = Number(this.dataset.minCapacity ?? 1);
    let points;
    if (this.#value.capacitySource === "manual" && this.#manualPoints != null) {
      points = this.#manualPoints;
    } else {
      points = defaultFormula(this.#value.time, this.#value.cost, focusFactor);
    }
    if (Number.isFinite(minCapacity) && points > 0 && points < minCapacity) {
      points = minCapacity;
    }
    this.#value.capacityPoints = points;
    this.#value.hash = triangleHash(this.#value);
    this.#renderViz();
    this.#syncStateFlags();
    this.#publishFormValue();
    this.dispatchEvent(new CustomEvent("iron-triangle:change", {
      bubbles: true,
      composed: true,
      detail: { ...this.value, source, field }
    }));
  }
  #renderViz() {
    const svg = buildTriangleSvg({
      value: this.#value,
      vertices: triangleVertices(this.#value),
      capacityPoints: this.#value.capacityPoints,
      capacitySource: this.#value.capacitySource,
      qualitySummary: this.#qualitySummary
    });
    const existing = this.querySelector(":scope > svg");
    if (existing) existing.replaceWith(svg);
    else this.prepend(svg);
    this.dataset.capacityPoints = String(this.#value.capacityPoints);
    this.dataset.capacitySource = this.#value.capacitySource;
  }
  #syncStateFlags() {
    this.setState("formula", this.#value.capacitySource === "formula");
    this.setState("manual", this.#value.capacitySource === "manual");
    this.setState("unbudgeted", !(this.#value.capacityPoints > 0));
    const deadline = this.#value.time?.deadline;
    let overDeadline = false;
    if (deadline) {
      const target = new Date(deadline).getTime();
      if (Number.isFinite(target)) overDeadline = target < Date.now();
    }
    this.setState("over-deadline", overDeadline);
  }
  #publishFormValue() {
    try {
      this.#internals.setFormValue(JSON.stringify(this.value));
    } catch {
    }
  }
  #syncDisabledLocked() {
    const off = this.hasAttribute("disabled") || this.hasAttribute("locked");
    for (const dialog of Object.values(this.#dialogs)) {
      for (const el of dialog.querySelectorAll("input, select, textarea, button")) el.disabled = off;
    }
  }
  // ── Internal: revise() field accessors ───────────────────────────
  #getField(path) {
    if (path === "capacityPoints") return this.#value.capacityPoints;
    const [section, key] = path.split(".");
    return section && key ? this.#value[section]?.[key] : void 0;
  }
  #setField(path, value) {
    if (path === "capacityPoints") {
      this.setManual(value);
      return;
    }
    const [section, key] = path.split(".");
    if (!section || !key) return;
    if (!this.#value[section]) this.#value[section] = {};
    this.#value[section][key] = value;
  }
};
function buildFormField(axis, def, currentValue) {
  const ff = document.createElement("form-field");
  const id = `${axis}-${def.key}`;
  const label = document.createElement("label");
  label.setAttribute("for", id);
  label.textContent = def.label;
  ff.append(label);
  let control;
  if (def.type === "select") {
    control = document.createElement("select");
    for (const [val, text] of def.options) {
      const opt = document.createElement("option");
      opt.value = val;
      opt.textContent = text;
      if (currentValue === val || currentValue == null && def.value === val) opt.selected = true;
      control.append(opt);
    }
  } else if (def.type === "textarea") {
    control = document.createElement("textarea");
    if (def.rows) control.rows = def.rows;
    if (def.maxlength) control.maxLength = def.maxlength;
    if (currentValue != null) control.value = String(currentValue);
  } else {
    control = document.createElement("input");
    control.type = def.type;
    if (def.min != null) control.min = String(def.min);
    if (def.max != null) control.max = String(def.max);
    if (def.step != null) control.step = String(def.step);
    if (currentValue != null) control.value = String(currentValue);
    else if (def.value != null) control.value = String(def.value);
  }
  control.id = id;
  control.name = `${axis}.${def.key}`;
  if (def.width) control.style.inlineSize = def.width;
  ff.append(control);
  return ff;
}
registerComponent("iron-triangle", IronTriangle);

// src/web-components/capacity-plan/_capacity-utils.js
function workItemCost(el) {
  if (!el) return 0;
  const raw = el.dataset?.capacityCost ?? el.getAttribute?.("data-capacity-cost");
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : 0;
}
function sumWorkCosts(elements) {
  let total = 0;
  for (const el of elements || []) total += workItemCost(el);
  return total;
}
function computeLedger({ capacityPoints, qualitySum, featureSum }) {
  const cap = Number.isFinite(capacityPoints) ? capacityPoints : Infinity;
  const q = Math.max(0, Number(qualitySum) || 0);
  const f = Math.max(0, Number(featureSum) || 0);
  const slack = Number.isFinite(cap) ? cap - q - f : Infinity;
  return { capacity: cap, quality: q, features: f, slack };
}
function barProportions({ capacity, quality, features }) {
  if (!Number.isFinite(capacity) || capacity <= 0) {
    const total = quality + features;
    if (total <= 0) return { quality: 0, features: 0, slack: 100 };
    return {
      quality: quality / total * 100,
      features: features / total * 100,
      slack: 0
    };
  }
  const spend = quality + features;
  const denom = Math.max(capacity, spend);
  return {
    quality: quality / denom * 100,
    features: features / denom * 100,
    slack: Math.max(0, (capacity - spend) / denom * 100)
  };
}

// src/web-components/capacity-plan/logic.js
var CapacityPlan = class extends VBElement {
  static get observedAttributes() {
    return ["data-bind-triangle", "data-bind-quality"];
  }
  /** @type {(() = void) | null} */
  #unbindTriangle = null;
  /** @type {(() = void) | null} */
  #unbindQuality = null;
  /** @type {MutationObserver | null} */
  #slotObserver = null;
  /** @type {number | null} */
  #featureSumOverride = null;
  /** @type {boolean} */
  #wasOver = false;
  setup() {
    this.#bindTriangle();
    this.#bindQuality();
    this.#observeSlotted();
    this.#render();
  }
  teardown() {
    this.#unbindTriangle?.();
    this.#unbindQuality?.();
    this.#slotObserver?.disconnect();
    this.#unbindTriangle = null;
    this.#unbindQuality = null;
    this.#slotObserver = null;
  }
  attributeChangedCallback(name) {
    if (!this.isConnected) return;
    if (name === "data-bind-triangle") {
      this.#bindTriangle();
      this.#render();
    } else if (name === "data-bind-quality") {
      this.#bindQuality();
      this.#render();
    }
  }
  // ── Public API ────────────────────────────────────────────────────
  get capacityPoints() {
    return this.#triangleCap();
  }
  get qualitySum() {
    return this.#qualitySum();
  }
  get featureSum() {
    if (this.#featureSumOverride != null) return this.#featureSumOverride;
    return sumWorkCosts(this.querySelectorAll("[data-capacity-cost]"));
  }
  set featureSum(n) {
    this.#featureSumOverride = Number.isFinite(+n) ? +n : null;
    this.#render();
  }
  get slack() {
    return computeLedger({
      capacityPoints: this.#triangleCap(),
      qualitySum: this.#qualitySum(),
      featureSum: this.featureSum
    }).slack;
  }
  // ── Internal: bindings ────────────────────────────────────────────
  #findById(id) {
    if (!id) return null;
    const root = (
      /** @type {any} */
      this.getRootNode()
    );
    return root.getElementById ? root.getElementById(id) : document.getElementById(id);
  }
  #bindTriangle() {
    this.#unbindTriangle?.();
    this.#unbindTriangle = null;
    const el = this.#findById(this.dataset.bindTriangle);
    if (!el || el.localName !== "iron-triangle") return;
    const handler = () => this.#render();
    el.addEventListener("iron-triangle:change", handler);
    this.#unbindTriangle = () => el.removeEventListener("iron-triangle:change", handler);
  }
  #bindQuality() {
    this.#unbindQuality?.();
    this.#unbindQuality = null;
    const el = this.#findById(this.dataset.bindQuality);
    if (!el || el.localName !== "quality-target") return;
    const handler = () => this.#render();
    el.addEventListener("quality-target:change", handler);
    this.#unbindQuality = () => el.removeEventListener("quality-target:change", handler);
  }
  #observeSlotted() {
    if (this.#slotObserver) return;
    this.#slotObserver = new MutationObserver((records) => {
      const meaningful = records.some((r) => {
        const target = (
          /** @type {any} */
          r.target
        );
        return !target.closest?.("[data-capacity-table]");
      });
      if (meaningful) this.#render();
    });
    this.#slotObserver.observe(this, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-capacity-cost"]
    });
  }
  #triangleCap() {
    const el = this.#findById(this.dataset.bindTriangle);
    if (!el || el.localName !== "iron-triangle") return Infinity;
    const v = el.capacityPoints;
    return Number.isFinite(v) && v > 0 ? v : Infinity;
  }
  #qualitySum() {
    const el = this.#findById(this.dataset.bindQuality);
    if (!el || el.localName !== "quality-target") return 0;
    return Number(el.criticalSum) || 0;
  }
  // ── Internal: render ──────────────────────────────────────────────
  #render() {
    const ledger = computeLedger({
      capacityPoints: this.#triangleCap(),
      qualitySum: this.#qualitySum(),
      featureSum: this.featureSum
    });
    const bars = barProportions(ledger);
    let table = (
      /** @type {HTMLElement | null} */
      this.querySelector(":scope > [data-capacity-table]")
    );
    if (!table) {
      table = document.createElement("section");
      table.dataset.capacityTable = "";
      this.prepend(table);
    }
    const capCell = formatPts(ledger.capacity);
    const qCell = ledger.quality > 0 ? `\u2212${ledger.quality} pts` : "0 pts";
    const fCell = ledger.features > 0 ? `\u2212${ledger.features} pts` : "0 pts";
    const slackCell = formatSignedSlack(ledger.slack);
    table.innerHTML = `
      <dl data-layout="grid" class="capacity-ledger" aria-label="Capacity ledger">
        <div data-row="capacity">
          <dt>Capacity</dt>
          <dd class="num">${capCell}</dd>
          <dd class="bar"><span class="bar-track"><span class="bar-fill bar-capacity" style="--w:100%"></span></span></dd>
        </div>
        <div data-row="quality">
          <dt>Quality</dt>
          <dd class="num">${qCell}</dd>
          <dd class="bar"><span class="bar-track"><span class="bar-fill bar-quality" style="--w:${bars.quality.toFixed(1)}%"></span></span></dd>
        </div>
        <div data-row="features">
          <dt>Features</dt>
          <dd class="num">${fCell}</dd>
          <dd class="bar"><span class="bar-track"><span class="bar-fill bar-features" style="--w:${bars.features.toFixed(1)}%"></span></span></dd>
        </div>
        <div data-row="slack" data-state="${ledger.slack < 0 ? "over" : "under"}">
          <dt>Slack</dt>
          <dd class="num">${slackCell}</dd>
          <dd class="bar"><span class="bar-track"><span class="bar-fill bar-slack" style="--w:${bars.slack.toFixed(1)}%"></span></span></dd>
        </div>
      </dl>
    `;
    this.setState("overdrawn", ledger.slack < 0);
    const isOver = ledger.slack < 0;
    if (isOver !== this.#wasOver) {
      this.dispatchEvent(new CustomEvent("capacity-plan:overdrawn", {
        bubbles: true,
        composed: true,
        detail: { ledger, source: "render" }
      }));
      this.#wasOver = isOver;
    }
  }
};
function formatPts(n) {
  if (!Number.isFinite(n)) return "\u221E";
  return `${n} pts`;
}
function formatSignedSlack(n) {
  if (!Number.isFinite(n)) return "\u221E";
  if (n === 0) return "0 pts";
  if (n > 0) return `+${n} pts`;
  return `${n} pts`;
}
registerComponent("capacity-plan", CapacityPlan);

// src/web-components/quality-target/_quality-utils.js
var DEFAULT_ILITIES = Object.freeze([
  "performance",
  "accessibility",
  "security",
  "reliability",
  "maintainability",
  "observability",
  "compatibility",
  "scalability",
  "portability",
  "internationalization",
  "privacy"
]);
var LEVELS = Object.freeze(["critical", "important", "acceptable", "not-relevant"]);
var LEVEL_LABELS = Object.freeze({
  "critical": "Critical",
  "important": "Important",
  "acceptable": "Acceptable",
  "not-relevant": "Not relevant"
});
var DEFAULT_COST_WEIGHTS = Object.freeze({
  accessibility: 3,
  performance: 5,
  security: 5,
  reliability: 4,
  observability: 3,
  internationalization: 4,
  compatibility: 2,
  portability: 3,
  privacy: 4,
  scalability: 5,
  maintainability: 2
});
var ILITY_LABELS = Object.freeze({
  performance: "Performance",
  accessibility: "Accessibility",
  security: "Security",
  reliability: "Reliability",
  maintainability: "Maintainability",
  observability: "Observability",
  compatibility: "Compatibility",
  scalability: "Scalability",
  portability: "Portability",
  internationalization: "Internationalization",
  privacy: "Privacy"
});
var ILITY_ABBR = Object.freeze({
  accessibility: "a11y",
  internationalization: "i18n",
  maintainability: "maint",
  observability: "obs",
  compatibility: "compat",
  portability: "porta",
  performance: "perf",
  reliability: "rely",
  scalability: "scale",
  security: "sec",
  privacy: "priv"
});
var LEVEL_RATIO = Object.freeze({
  critical: 1,
  important: 0.6,
  acceptable: 0.3,
  "not-relevant": 0
});
function ilityLabel(ility) {
  if (ILITY_LABELS[ility]) return ILITY_LABELS[ility];
  return String(ility).replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
function mergeCostWeights(ilities, overrides = {}) {
  const out = {};
  for (const ility of ilities) {
    if (Object.prototype.hasOwnProperty.call(overrides, ility) && Number.isFinite(Number(overrides[ility]))) {
      out[ility] = Math.max(0, Math.floor(Number(overrides[ility])));
    } else if (Object.prototype.hasOwnProperty.call(DEFAULT_COST_WEIGHTS, ility)) {
      out[ility] = DEFAULT_COST_WEIGHTS[ility];
    } else {
      out[ility] = 1;
    }
  }
  return Object.freeze(out);
}
function criticalSum(vector, costWeights) {
  let sum = 0;
  for (const [ility, level] of Object.entries(vector || {})) {
    if (level === "critical") sum += Number(costWeights?.[ility] ?? 0);
  }
  return sum;
}
function criticalKeys(vector) {
  return Object.keys(vector || {}).filter((k) => vector[k] === "critical");
}
function validateVector(input) {
  const {
    vector = {},
    rationales = {},
    costWeights = {},
    capacityPoints = Infinity,
    overrunRationale = "",
    minRationale = 10,
    minOverrunRationale = 10
  } = input || {};
  const errors = [];
  const crits = criticalKeys(vector);
  for (const k of crits) {
    const r = rationales[k];
    if (typeof r !== "string" || r.trim().length < minRationale) {
      errors.push(`Critical "${k}" needs a rationale of at least ${minRationale} characters.`);
    }
  }
  const sum = criticalSum(vector, costWeights);
  if (Number.isFinite(capacityPoints) && sum > capacityPoints) {
    if (typeof overrunRationale !== "string" || overrunRationale.trim().length < minOverrunRationale) {
      errors.push(
        `Over budget by ${sum - capacityPoints} points (${sum}/${capacityPoints}); overrunRationale of at least ${minOverrunRationale} characters required.`
      );
    }
  }
  return { valid: errors.length === 0, errors, criticalSum: sum };
}
function canSaveAxis({ level, rationale, minRationale = 10 }) {
  if (!LEVELS.includes(level)) return { ok: false, reason: "pick-level" };
  if (level === "critical") {
    if (typeof rationale !== "string" || rationale.trim().length < minRationale) {
      return { ok: false, reason: "rationale-too-short" };
    }
  }
  return { ok: true };
}
function formatAxisTooltip({ ility, level, costWeight }) {
  const name = ilityLabel(ility);
  const lvl = level ? LEVEL_LABELS[level] || level : "unset";
  const n = Number(costWeight);
  const cost = Number.isFinite(n) ? `${n} pts` : "? pts";
  return `${name} \u2014 ${lvl} \xB7 ${cost}`;
}
function parseJsonAttr(raw) {
  if (!raw || typeof raw !== "string") return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}
function axisAngles(n) {
  const out = [];
  for (let i = 0; i < n; i++) {
    out.push(-Math.PI / 2 + 2 * Math.PI * i / n);
  }
  return out;
}
function vectorPoints({ ilities, vector = {}, radius }) {
  const angles = axisAngles(ilities.length);
  return ilities.map((k, i) => {
    const level = vector[k] || null;
    const ratio = LEVEL_RATIO[level] ?? 0;
    return {
      ility: k,
      level,
      x: round2(Math.cos(angles[i]) * radius * ratio),
      y: round2(Math.sin(angles[i]) * radius * ratio)
    };
  });
}
function axisOuterPoints({ ilities, radius }) {
  const angles = axisAngles(ilities.length);
  return ilities.map((k, i) => ({
    ility: k,
    x: round2(Math.cos(angles[i]) * radius),
    y: round2(Math.sin(angles[i]) * radius)
  }));
}
var SVG_NS2 = "http://www.w3.org/2000/svg";
var LEVEL_RING_RATIOS = Object.freeze([
  { ratio: 1, label: "Critical", className: "ring-critical" },
  { ratio: 0.6, label: "Important", className: "ring-important" },
  { ratio: 0.3, label: "Acceptable", className: "ring-acceptable" }
]);
var CENTER_HOLE_RADIUS_RATIO = 0.22;
function buildTargetSvg({
  ilities = (
    /** @type {any[]} */
    []
  ),
  vector = (
    /** @type {Recordstring, string} */
    {}
  ),
  costWeights = (
    /** @type {Recordstring, number} */
    {}
  ),
  capacityPoints = 0,
  radius = 100
} = {}) {
  const svg = document.createElementNS(SVG_NS2, "svg");
  const labelRadius = radius + 14;
  const padX = labelRadius + 140;
  const padY = labelRadius + 30;
  svg.setAttribute("viewBox", `${-padX} ${-padY} ${padX * 2} ${padY * 2}`);
  svg.setAttribute("role", "group");
  svg.setAttribute(
    "aria-label",
    `Quality target. ${criticalKeys(vector || {}).length} critical of ${ilities.length} ilities. Click any axis to edit.`
  );
  for (const r of LEVEL_RING_RATIOS) {
    const ring = document.createElementNS(SVG_NS2, "polygon");
    ring.setAttribute("class", `ring ${r.className}`);
    const points = axisOuterPoints({ ilities, radius: radius * r.ratio });
    ring.setAttribute("points", points.map((p) => `${p.x},${p.y}`).join(" "));
    svg.append(ring);
  }
  const outer = axisOuterPoints({ ilities, radius });
  for (const p of outer) {
    const line = document.createElementNS(SVG_NS2, "line");
    line.setAttribute("class", "spoke");
    line.setAttribute("x1", "0");
    line.setAttribute("y1", "0");
    line.setAttribute("x2", String(p.x));
    line.setAttribute("y2", String(p.y));
    svg.append(line);
  }
  const vec = vectorPoints({ ilities, vector, radius });
  const nonZero = vec.filter((p) => Math.hypot(p.x, p.y) > 0.5);
  if (nonZero.length >= 3) {
    const poly = document.createElementNS(SVG_NS2, "polygon");
    poly.setAttribute("class", "vector");
    poly.setAttribute("points", nonZero.map((p) => `${p.x},${p.y}`).join(" "));
    svg.append(poly);
  } else if (nonZero.length > 0) {
    for (const p of nonZero) {
      const line = document.createElementNS(SVG_NS2, "line");
      line.setAttribute("class", "vector-spoke");
      line.setAttribute("x1", "0");
      line.setAttribute("y1", "0");
      line.setAttribute("x2", String(p.x));
      line.setAttribute("y2", String(p.y));
      svg.append(line);
    }
  }
  const labels = axisOuterPoints({ ilities, radius: labelRadius });
  for (let i = 0; i < ilities.length; i++) {
    const ility = ilities[i];
    const dot = vec[i];
    const label = labels[i];
    const cost = Number(costWeights?.[ility] ?? 0);
    const level = vector?.[ility] ?? null;
    const g = document.createElementNS(SVG_NS2, "g");
    g.setAttribute("class", "axis");
    g.setAttribute("data-ility", ility);
    if (level) g.setAttribute("data-level", String(level));
    g.setAttribute("tabindex", "0");
    g.setAttribute("role", "button");
    g.setAttribute(
      "aria-label",
      `${formatAxisTooltip({ ility, level, costWeight: cost })}. Activate to edit.`
    );
    const hit = document.createElementNS(SVG_NS2, "rect");
    hit.setAttribute("class", "hit");
    const anchor = anchorFor(label);
    const hitW = 100;
    const hitH = 22;
    const hitX = label.x + (anchor === "end" ? -hitW : anchor === "start" ? 0 : -hitW / 2);
    const hitY = label.y - hitH / 2;
    hit.setAttribute("x", String(round2(hitX)));
    hit.setAttribute("y", String(round2(hitY)));
    hit.setAttribute("width", String(hitW));
    hit.setAttribute("height", String(hitH));
    hit.setAttribute("rx", "4");
    g.append(hit);
    if (level) {
      const marker = document.createElementNS(SVG_NS2, "circle");
      marker.setAttribute("class", "marker");
      marker.setAttribute("cx", String(dot.x));
      marker.setAttribute("cy", String(dot.y));
      marker.setAttribute("r", "4");
      g.append(marker);
    }
    const text = document.createElementNS(SVG_NS2, "text");
    text.setAttribute("class", "axis-label");
    text.setAttribute("x", String(label.x));
    text.setAttribute("y", String(label.y));
    text.setAttribute("text-anchor", anchor);
    text.setAttribute("dominant-baseline", "middle");
    text.textContent = ilityLabel(ility);
    g.append(text);
    const title = document.createElementNS(SVG_NS2, "title");
    title.textContent = formatAxisTooltip({ ility, level, costWeight: cost });
    g.append(title);
    svg.append(g);
  }
  const center = document.createElementNS(SVG_NS2, "g");
  center.setAttribute("class", "center");
  const sum = criticalSum(vector, costWeights);
  const overBudget = Number.isFinite(capacityPoints) && sum > capacityPoints;
  if (overBudget) center.setAttribute("data-over", "");
  const holeRadius = radius * CENTER_HOLE_RADIUS_RATIO;
  const backdrop = document.createElementNS(SVG_NS2, "circle");
  backdrop.setAttribute("class", "capacity-backdrop");
  backdrop.setAttribute("cx", "0");
  backdrop.setAttribute("cy", "0");
  backdrop.setAttribute("r", String(round2(holeRadius)));
  center.append(backdrop);
  const sumText = document.createElementNS(SVG_NS2, "text");
  sumText.setAttribute("class", "capacity-sum");
  sumText.setAttribute("x", "0");
  sumText.setAttribute("y", "-3");
  sumText.setAttribute("text-anchor", "middle");
  sumText.setAttribute("dominant-baseline", "middle");
  sumText.textContent = String(sum);
  center.append(sumText);
  const denom = document.createElementNS(SVG_NS2, "text");
  denom.setAttribute("class", "capacity-denom");
  denom.setAttribute("x", "0");
  denom.setAttribute("y", "11");
  denom.setAttribute("text-anchor", "middle");
  denom.textContent = Number.isFinite(capacityPoints) ? `of ${capacityPoints}` : "unbounded";
  center.append(denom);
  svg.append(center);
  return svg;
}
function round2(n) {
  return Math.round(n * 100) / 100;
}
function anchorFor(p) {
  if (Math.abs(p.x) < 4) return "middle";
  return p.x > 0 ? "start" : "end";
}

// src/web-components/quality-target/logic.js
var QualityTarget = class extends VBElement {
  static formAssociated = true;
  static get observedAttributes() {
    return [
      "data-bind-to",
      "data-capacity-points",
      "data-cost-weights",
      "data-radius",
      "data-show-envelope",
      "data-min-rationale",
      "data-max-rationale",
      "data-min-overrun-rationale",
      "data-max-overrun-rationale",
      "disabled",
      "locked"
    ];
  }
  /** @type {ElementInternals} */
  #internals;
  /** @type {string[]} */
  #ilities = [...DEFAULT_ILITIES];
  /** @type {Recordstring, string} */
  #vector = {};
  /** @type {Recordstring, string} */
  #rationales = {};
  /** @type {ReadonlyRecord<string, number>} */
  #costWeights = mergeCostWeights(DEFAULT_ILITIES);
  /** @type {string} */
  #overrunRationale = "";
  /** @type {boolean} */
  #wasOver = false;
  /** @type {(() = void) | null} */
  #unbindTriangle = null;
  /** @type {number | null} */
  #capacityPropOverride = null;
  /** @type {Recordstring, HTMLDialogElement} */
  #dialogs = {};
  /** @type {HTMLElement | null} */
  #footer = null;
  constructor() {
    super();
    this.#internals = this.attachInternals();
    this._adoptInternals(this.#internals);
  }
  setup() {
    this.#refreshCostWeights();
    this.#bindToTriangle();
    this.#renderViz();
    this.#ensureFooter();
    this.listen(this, "click", (e) => this.#onClick(e));
    this.listen(this, "keydown", (e) => this.#onKeydown(e));
    this.listen(this, "input", (e) => this.#onFooterInput(e));
  }
  teardown() {
    this.#unbindTriangle?.();
    this.#unbindTriangle = null;
  }
  attributeChangedCallback(name) {
    if (!this.isConnected) return;
    if (name === "data-bind-to") {
      this.#bindToTriangle();
      this.#renderViz();
    } else if (name === "data-capacity-points") {
      this.#renderViz();
    } else if (name === "data-cost-weights") {
      this.#refreshCostWeights();
      this.#renderViz();
    } else if (name === "data-radius" || name === "data-show-envelope") {
      this.#renderViz();
    } else if (name === "disabled" || name === "locked") {
      this.#syncDisabledLocked();
    }
  }
  // ── Public API ────────────────────────────────────────────────────
  get vector() {
    return { ...this.#vector };
  }
  set vector(next) {
    this.#applyVector(next);
    this.#publish("property");
  }
  get rationales() {
    return { ...this.#rationales };
  }
  set rationales(next) {
    this.#applyRationales(next);
    this.#publish("property");
  }
  get costWeights() {
    return { ...this.#costWeights };
  }
  get capacityPoints() {
    return this.#resolveCapacity();
  }
  set capacityPoints(n) {
    this.#capacityPropOverride = Number.isFinite(+n) ? +n : null;
    this.#publish("property");
  }
  get criticalSum() {
    return criticalSum(this.#vector, this.#costWeights);
  }
  get overBudget() {
    const cap = this.#resolveCapacity();
    return Number.isFinite(cap) && this.criticalSum > cap;
  }
  get overrunRationale() {
    return this.#overrunRationale;
  }
  set overrunRationale(s) {
    this.#overrunRationale = String(s ?? "");
    const ta = (
      /** @type {HTMLTextAreaElement | null} */
      this.querySelector("[data-quality-overrun] textarea")
    );
    if (ta) ta.value = this.#overrunRationale;
    this.#publishFormValue();
  }
  get ilities() {
    return [...this.#ilities];
  }
  set ilities(next) {
    if (!Array.isArray(next) || next.length === 0) return;
    this.#ilities = [...next];
    this.#refreshCostWeights();
    this.#publish("property");
  }
  get value() {
    return {
      vector: { ...this.#vector },
      rationales: { ...this.#rationales },
      costWeights: { ...this.#costWeights },
      capacityPoints: this.#resolveCapacityForSerialize(),
      capacitySource: this.#capacitySourceLabel(),
      criticalSum: this.criticalSum,
      overrunRationale: this.#overrunRationale || void 0,
      ironTriangleHash: this.#readTriangleHash()
    };
  }
  /** Imperatively open one axis's editor. */
  openEditor(ility) {
    if (!this.#ilities.includes(ility)) return;
    const dialog = this.#ensureDialog(ility);
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
  }
  checkValidity() {
    const { valid, errors } = validateVector({
      vector: this.#vector,
      rationales: this.#rationales,
      costWeights: this.#costWeights,
      capacityPoints: this.#resolveCapacity(),
      overrunRationale: this.#overrunRationale,
      minRationale: this.#minRationale(),
      minOverrunRationale: this.#minOverrunRationale()
    });
    this.setState("missing-rationale", !valid);
    const errBox = this.querySelector("[data-quality-errors]");
    if (errBox) errBox.textContent = errors.join(" ");
    return valid;
  }
  // ── Internal: SVG hit-target click + keyboard ────────────────────
  #onClick(event) {
    const axis = event.target.closest?.(".axis[data-ility]");
    if (axis && this.contains(axis)) {
      event.preventDefault();
      this.openEditor(axis.dataset.ility);
    }
  }
  #onKeydown(event) {
    if (event.key !== "Enter" && event.key !== " ") return;
    const axis = event.target.closest?.(".axis[data-ility]");
    if (axis && this.contains(axis)) {
      event.preventDefault();
      this.openEditor(axis.dataset.ility);
    }
  }
  #onFooterInput(event) {
    const target = event.target;
    if (target?.matches?.("[data-quality-overrun] textarea")) {
      this.#overrunRationale = target.value;
      this.checkValidity();
      this.#publishFormValue();
    }
  }
  // ── Internal: per-axis dialog ────────────────────────────────────
  #ensureDialog(ility) {
    if (this.#dialogs[ility]) {
      this.#syncDialogFromState(ility);
      return this.#dialogs[ility];
    }
    const dialog = document.createElement("dialog");
    dialog.className = `quality-dialog quality-dialog--${ility}`;
    dialog.setAttribute("aria-label", `${ilityLabel(ility)} \u2014 edit priority`);
    const form = document.createElement("form");
    form.method = "dialog";
    form.setAttribute("data-layout", "stack");
    form.setAttribute("data-layout-gap", "m");
    const heading = document.createElement("h3");
    heading.textContent = ilityLabel(ility);
    form.append(heading);
    const fs = document.createElement("fieldset");
    fs.setAttribute("data-layout", "stack");
    fs.setAttribute("data-layout-gap", "2xs");
    const lg = document.createElement("legend");
    lg.textContent = "Priority";
    fs.append(lg);
    for (const level of LEVELS) {
      const lbl = document.createElement("label");
      const input = document.createElement("input");
      input.type = "radio";
      input.name = "level";
      input.value = level;
      lbl.append(input, document.createTextNode(" " + LEVEL_LABELS[level]));
      fs.append(lbl);
    }
    form.append(fs);
    const ff = document.createElement("form-field");
    const rl = document.createElement("label");
    rl.setAttribute("for", `quality-${ility}-rationale`);
    rl.textContent = "Rationale (required when Critical)";
    const ta = document.createElement("textarea");
    ta.id = `quality-${ility}-rationale`;
    ta.name = "rationale";
    ta.rows = 3;
    ta.minLength = this.#minRationale();
    ta.maxLength = this.#maxRationale();
    ta.placeholder = `Why \u2265 ${this.#minRationale()} chars`;
    ff.append(rl, ta);
    form.append(ff);
    const err = document.createElement("p");
    err.className = "message message-error";
    err.dataset.dialogError = "";
    err.hidden = true;
    form.append(err);
    const actions = document.createElement("div");
    actions.setAttribute("data-layout", "cluster");
    actions.setAttribute("data-layout-gap", "s");
    actions.setAttribute("data-layout-justify", "end");
    const cancel = document.createElement("button");
    cancel.type = "button";
    cancel.textContent = "Cancel";
    cancel.addEventListener("click", () => dialog.close("cancel"));
    const save = document.createElement("button");
    save.type = "submit";
    save.textContent = "Save";
    actions.append(cancel, save);
    form.append(actions);
    dialog.append(form);
    this.append(dialog);
    this.#dialogs[ility] = dialog;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const levelInput = (
        /** @type {HTMLInputElement | null} */
        form.querySelector('input[name="level"]:checked')
      );
      const level = levelInput?.value;
      const rationaleEl = (
        /** @type {HTMLTextAreaElement | null} */
        form.querySelector('textarea[name="rationale"]')
      );
      const rationale = rationaleEl?.value ?? "";
      const result = canSaveAxis({ level, rationale, minRationale: this.#minRationale() });
      if (!result.ok) {
        err.hidden = false;
        err.textContent = result.reason === "pick-level" ? "Pick a priority level." : `Rationale must be at least ${this.#minRationale()} characters.`;
        return;
      }
      this.#vector[ility] = level ?? "";
      if (level === "critical") this.#rationales[ility] = rationale.trim();
      else delete this.#rationales[ility];
      dialog.close("save");
      this.#publish("dialog", ility);
    });
    this.#syncDialogFromState(ility);
    return dialog;
  }
  #syncDialogFromState(ility) {
    const dialog = this.#dialogs[ility];
    if (!dialog) return;
    const level = this.#vector[ility];
    for (const rawRadio of dialog.querySelectorAll('input[name="level"]')) {
      const radio = (
        /** @type {HTMLInputElement} */
        rawRadio
      );
      radio.checked = radio.value === level;
    }
    const ta = (
      /** @type {HTMLTextAreaElement | null} */
      dialog.querySelector('textarea[name="rationale"]')
    );
    if (ta) ta.value = this.#rationales[ility] || "";
    const err = (
      /** @type {HTMLElement | null} */
      dialog.querySelector("[data-dialog-error]")
    );
    if (err) {
      err.hidden = true;
      err.textContent = "";
    }
  }
  // ── Internal: footer (capacity + overrun rationale) ──────────────
  #ensureFooter() {
    if (this.#footer) return;
    const footer = document.createElement("section");
    footer.className = "quality-footer";
    footer.dataset.qualityFooter = "";
    footer.setAttribute("data-layout", "stack");
    footer.setAttribute("data-layout-gap", "s");
    const overrun = document.createElement("section");
    overrun.dataset.qualityOverrun = "";
    overrun.hidden = true;
    overrun.innerHTML = `
      <strong>Over budget \u2014 explain why.</strong>
      <small data-overrun-prompt></small>
      <form-field>
        <label for="quality-overrun">Overrun rationale (\u2265 ${this.#minOverrunRationale()} chars)</label>
        <textarea id="quality-overrun" name="overrunRationale"
                  minlength="${this.#minOverrunRationale()}"
                  maxlength="${this.#maxOverrunRationale()}"
                  rows="3"></textarea>
      </form-field>
    `;
    footer.append(overrun);
    const errors = document.createElement("p");
    errors.dataset.qualityErrors = "";
    errors.className = "message message-error";
    errors.setAttribute("role", "alert");
    footer.append(errors);
    this.append(footer);
    this.#footer = footer;
  }
  #updateFooter() {
    if (!this.#footer) return;
    const cap = this.#resolveCapacity();
    const sum = this.criticalSum;
    const isOver = Number.isFinite(cap) && sum > cap;
    const overrun = (
      /** @type {HTMLElement | null} */
      this.#footer.querySelector("[data-quality-overrun]")
    );
    if (overrun) {
      overrun.hidden = !isOver;
      const prompt = overrun.querySelector("[data-overrun-prompt]");
      if (prompt && Number.isFinite(cap)) {
        prompt.textContent = `You're over budget by ${sum - cap} points (${sum}/${cap}).`;
      }
    }
  }
  // ── Internal: ility / weight wiring ──────────────────────────────
  #refreshCostWeights() {
    const overrides = parseJsonAttr(this.getAttribute("data-cost-weights") || "");
    this.#costWeights = mergeCostWeights(this.#ilities, overrides);
  }
  // ── Internal: vector / rationale setters ─────────────────────────
  #applyVector(next) {
    if (!next || typeof next !== "object") return;
    for (const [ility, level] of Object.entries(next)) {
      if (LEVELS.includes(level)) this.#vector[ility] = level;
    }
  }
  #applyRationales(next) {
    if (!next || typeof next !== "object") return;
    for (const [ility, text] of Object.entries(next)) {
      this.#rationales[ility] = String(text ?? "");
    }
  }
  // ── Internal: capacity resolution ────────────────────────────────
  #resolveCapacity() {
    const triangle = this.#findTriangle();
    if (triangle && Number.isFinite(triangle.capacityPoints) && triangle.capacityPoints > 0) {
      return triangle.capacityPoints;
    }
    const attr = Number(this.getAttribute("data-capacity-points"));
    if (Number.isFinite(attr) && attr > 0) return attr;
    const override = this.#capacityPropOverride;
    if (override !== null && Number.isFinite(override) && override > 0) {
      return override;
    }
    return Infinity;
  }
  #resolveCapacityForSerialize() {
    const cap = this.#resolveCapacity();
    return Number.isFinite(cap) ? cap : null;
  }
  #capacitySourceLabel() {
    const triangle = this.#findTriangle();
    if (triangle?.capacitySource === "manual") return "manual";
    if (triangle) return "formula";
    if (this.getAttribute("data-capacity-points")) return "manual";
    return "manual";
  }
  #findTriangle() {
    const id = this.getAttribute("data-bind-to");
    if (!id) return null;
    const root = (
      /** @type {any} */
      this.getRootNode()
    );
    const found = root.getElementById ? root.getElementById(id) : document.getElementById(id);
    return found && found.localName === "iron-triangle" ? found : null;
  }
  #readTriangleHash() {
    return this.#findTriangle()?.hash || null;
  }
  #bindToTriangle() {
    this.#unbindTriangle?.();
    this.#unbindTriangle = null;
    const triangle = this.#findTriangle();
    if (!triangle) return;
    const handler = () => this.#publish("iron-triangle");
    triangle.addEventListener("iron-triangle:change", handler);
    this.#unbindTriangle = () => triangle.removeEventListener("iron-triangle:change", handler);
  }
  // ── Internal: render + publish cycle ─────────────────────────────
  #renderViz() {
    const radius = clamp2(Number(this.dataset.radius ?? 100), 30, 400);
    const cap = this.#resolveCapacity();
    const svg = buildTargetSvg({
      ilities: this.#ilities,
      vector: this.#vector,
      costWeights: this.#costWeights,
      capacityPoints: cap,
      radius
    });
    const existing = this.querySelector(":scope > svg");
    if (existing) existing.replaceWith(svg);
    else this.prepend(svg);
  }
  #publish(source, field) {
    this.#renderViz();
    this.#updateFooter();
    const cap = this.#resolveCapacity();
    const sum = this.criticalSum;
    const isOver = Number.isFinite(cap) && sum > cap;
    this.setState("over-budget", isOver);
    this.#publishFormValue();
    if (isOver !== this.#wasOver) {
      const evt = isOver ? "quality-target:over-budget" : "quality-target:under-budget";
      const detail = isOver ? { delta: sum - cap, criticalSum: sum, capacityPoints: cap } : { slack: cap - sum, criticalSum: sum, capacityPoints: cap };
      this.dispatchEvent(new CustomEvent(evt, { bubbles: true, composed: true, detail }));
      this.#wasOver = isOver;
    }
    this.dispatchEvent(new CustomEvent("quality-target:change", {
      bubbles: true,
      composed: true,
      detail: { ...this.value, source, field }
    }));
  }
  #publishFormValue() {
    try {
      this.#internals.setFormValue(JSON.stringify(this.value));
    } catch {
    }
  }
  #syncDisabledLocked() {
    const off = this.hasAttribute("disabled") || this.hasAttribute("locked");
    for (const dialog of Object.values(this.#dialogs)) {
      for (const el of dialog.querySelectorAll("input, textarea, select, button")) {
        el.disabled = off;
      }
    }
  }
  // ── Internal: config readers ──────────────────────────────────────
  #minRationale() {
    return Math.max(0, parseInt(this.dataset.minRationale ?? "10", 10) || 10);
  }
  #maxRationale() {
    return Math.max(10, parseInt(this.dataset.maxRationale ?? "200", 10) || 200);
  }
  #minOverrunRationale() {
    return Math.max(0, parseInt(this.dataset.minOverrunRationale ?? "10", 10) || 10);
  }
  #maxOverrunRationale() {
    return Math.max(10, parseInt(this.dataset.maxOverrunRationale ?? "400", 10) || 400);
  }
};
function clamp2(n, min, max) {
  return Math.max(min, Math.min(max, n));
}
registerComponent("quality-target", QualityTarget);

// src/web-components/requirement-card/styles.js
var styles8 = `
  :host {
    --_padding:        var(--requirement-card-padding, var(--size-m, 1rem));
    --_radius:         var(--requirement-card-radius, var(--radius-m, 0.5rem));
    --_gap:            var(--requirement-card-gap, var(--size-2xs, 0.25rem));
    --_surface:        var(--requirement-card-surface, var(--color-surface, #fff));
    --_border:         var(--requirement-card-border, 1px solid var(--color-border, #e5e7eb));
    --_text:           var(--requirement-card-text, var(--color-text, #1a1a1a));
    --_muted:          var(--requirement-card-muted, var(--color-text-muted, #6b7280));
    --_critical-bg:    var(--requirement-card-critical-bg,    var(--color-error-subtle, oklch(95% 0.05 27)));
    --_critical-fg:    var(--requirement-card-critical-fg,    var(--color-error, #dc2626));
    --_important-bg:   var(--requirement-card-important-bg,   var(--color-warning-subtle, oklch(95% 0.05 80)));
    --_important-fg:   var(--requirement-card-important-fg,   var(--color-warning, #b45309));
    --_acceptable-bg:  var(--requirement-card-acceptable-bg,  var(--color-success-subtle, oklch(95% 0.05 145)));
    --_acceptable-fg:  var(--requirement-card-acceptable-fg,  var(--color-success, #15803d));
    --_skipped-bg:     var(--requirement-card-skipped-bg,     var(--color-surface-raised, var(--color-surface, #f5f5f5)));
    --_skipped-fg:     var(--requirement-card-skipped-fg,     var(--color-text-muted, #6b7280));
    --_conflict:       var(--requirement-card-conflict-color, var(--color-error, #dc2626));

    display: block;
    padding: var(--_padding);
    border-radius: var(--_radius);
    background: var(--_surface);
    border: var(--_border);
    color: var(--_text);
    container-type: inline-size;
  }

  .card {
    display: grid;
    gap: var(--_gap);
  }

  .head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--size-s, 0.75rem);
  }

  .name {
    font-weight: var(--font-weight-semibold, 600);
    font-size: var(--font-size-md, 1rem);
  }

  .badge ::slotted([slot="badge"]) {
    font-size: var(--font-size-xs, 0.75em);
    color: var(--_muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .pill ::slotted([slot="priority-pill"]),
  .priority-default {
    display: inline-block;
    padding: 0.15em 0.6em;
    border-radius: var(--radius-pill, 999px);
    font-size: var(--font-size-xs, 0.75em);
    font-weight: var(--font-weight-semibold, 600);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  /* Priority-driven surface tinting on the card itself (when no slotted pill) */
  :host(:state(priority-critical))     { border-color: var(--_critical-fg); }
  :host(:state(priority-important))    { border-color: var(--_important-fg); }
  :host(:state(priority-acceptable))   { border-color: var(--_acceptable-fg); }
  :host(:state(priority-not-relevant)) { opacity: 0.6; }

  :host(:state(priority-critical))     .priority-default { background: var(--_critical-bg);    color: var(--_critical-fg); }
  :host(:state(priority-important))    .priority-default { background: var(--_important-bg);   color: var(--_important-fg); }
  :host(:state(priority-acceptable))   .priority-default { background: var(--_acceptable-bg);  color: var(--_acceptable-fg); }
  :host(:state(priority-not-relevant)) .priority-default { background: var(--_skipped-bg);     color: var(--_skipped-fg); text-decoration: line-through; }

  /* Hide the default pill when the author supplied one via slot */
  :host(:state(has-priority-pill)) .priority-default { display: none; }

  .rationale ::slotted([slot="rationale"]) {
    color: var(--_muted);
    font-size: var(--font-size-sm, 0.875rem);
    line-height: 1.45;
  }

  .conflicts ::slotted([slot="conflicts"]) {
    color: var(--_conflict);
    font-size: var(--font-size-sm, 0.875rem);
    font-weight: var(--font-weight-semibold, 600);
  }

  /* When no rationale or conflicts content, collapse the slot row */
  :host(:not(:state(has-rationale))) .rationale,
  :host(:not(:state(has-conflicts))) .conflicts { display: none; }

  /* Conflict flag */
  :host([data-conflict]) {
    border-color: var(--_conflict);
    box-shadow: inset 0 0 0 1px var(--_conflict);
  }

  /* Interactive: bubble click event so parents can wire up navigation */
  :host { cursor: default; }
  :host(:state(interactive)) { cursor: pointer; }
  :host(:state(interactive)):hover { background: color-mix(in oklab, var(--_surface) 92%, currentColor 8%); }
  :host(:focus-visible) {
    outline: 2px solid var(--color-focus-ring, var(--color-interactive, currentColor));
    outline-offset: 2px;
  }
`;

// src/web-components/requirement-card/logic.js
var PRIORITIES2 = Object.freeze(["critical", "important", "acceptable", "not-relevant"]);
var PRIORITY_LABELS = Object.freeze({
  "critical": "Critical",
  "important": "Important",
  "acceptable": "Acceptable",
  "not-relevant": "Not relevant"
});
var OPTIONAL_SLOTS = ["badge", "priority-pill", "rationale", "conflicts"];
var TEMPLATE = `
  <style>${styles8}</style>
  <article class="card" part="card">
    <header class="head" part="head">
      <span class="name" part="name"><slot name="name"></slot></span>
      <span class="badge" part="badge"><slot name="badge"></slot></span>
    </header>
    <span class="pill" part="pill">
      <slot name="priority-pill"><span class="priority-default" part="priority-default" data-priority-default></span></slot>
    </span>
    <p class="rationale" part="rationale"><slot name="rationale"></slot></p>
    <p class="conflicts" part="conflicts"><slot name="conflicts"></slot></p>
  </article>
`;
var RequirementCard = class extends VBElement {
  static get observedAttributes() {
    return ["data-priority", "data-conflict", "tabindex"];
  }
  setup() {
    if (!this.shadowRoot) {
      const root = this.attachShadow({ mode: "open" });
      root.innerHTML = TEMPLATE;
      for (const name of OPTIONAL_SLOTS) {
        const slot = root.querySelector(`slot[name="${name}"]`);
        slot?.addEventListener("slotchange", () => this.#syncSlot(name, slot));
        this.#syncSlot(name, slot);
      }
    } else {
      for (const name of OPTIONAL_SLOTS) {
        const slot = this.shadowRoot.querySelector(`slot[name="${name}"]`);
        this.#syncSlot(name, slot);
      }
    }
    this.#syncPriority();
    this.#syncDefaultPill();
    this.#syncInteractive();
    this.listen(this, "click", (e) => this.#onActivate(e));
    this.listen(this, "keydown", (e) => {
      const ke = (
        /** @type {KeyboardEvent} */
        e
      );
      if ((ke.key === "Enter" || ke.key === " ") && this.#interactive) {
        ke.preventDefault();
        this.#onActivate(ke);
      }
    });
  }
  attributeChangedCallback(name) {
    if (!this.isConnected) return;
    if (name === "data-priority") {
      this.#syncPriority();
      this.#syncDefaultPill();
    } else if (name === "data-conflict") {
    } else if (name === "tabindex") {
      this.#syncInteractive();
    }
  }
  // ── Public API ────────────────────────────────────────────────────
  get priority() {
    return (this.dataset.priority || "").toLowerCase();
  }
  set priority(v) {
    const next = String(v || "").toLowerCase();
    if (PRIORITIES2.includes(next)) this.dataset.priority = next;
    else delete this.dataset.priority;
  }
  get hasConflict() {
    return this.hasAttribute("data-conflict");
  }
  set hasConflict(v) {
    if (v) this.setAttribute("data-conflict", "");
    else this.removeAttribute("data-conflict");
  }
  // ── Internal ──────────────────────────────────────────────────────
  get #interactive() {
    return this.hasAttribute("tabindex") || this.closest("a[href], button");
  }
  #syncSlot(name, slot) {
    const hasContent = !!slot && slot.assignedNodes({ flatten: true }).some(
      (n) => n.nodeType === Node.ELEMENT_NODE || n.nodeType === Node.TEXT_NODE && n.textContent.trim().length > 0
    );
    this.setState(`has-${name}`, hasContent);
  }
  #syncPriority() {
    const value = (this.dataset.priority || "").toLowerCase();
    for (const p of PRIORITIES2) this.setState(`priority-${p}`, p === value);
  }
  #syncDefaultPill() {
    const value = (this.dataset.priority || "").toLowerCase();
    const el = this.shadowRoot?.querySelector("[data-priority-default]");
    if (!el) return;
    el.textContent = PRIORITY_LABELS[value] || "";
  }
  #syncInteractive() {
    this.setState("interactive", !!this.#interactive);
  }
  #onActivate(event) {
    if (!this.#interactive) return;
    this.dispatchEvent(new CustomEvent("requirement-card:click", {
      bubbles: true,
      composed: true,
      detail: {
        priority: this.priority || null,
        hasConflict: this.hasConflict,
        originalEvent: event
      }
    }));
  }
};
registerComponent("requirement-card", RequirementCard);
