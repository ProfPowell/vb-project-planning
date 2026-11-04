if (typeof document < "u") {
  const o = document.createElement("style");
  o.textContent = "browser-window:not(:defined){display:block;opacity:0}", document.head.appendChild(o);
}
const h = /* @__PURE__ */ new Set();
let l = null, u = null, m = /* @__PURE__ */ new WeakSet();
const A = '[data-mode="light"], [data-mode="dark"], [data-theme]', C = {
  attributes: !0,
  subtree: !0,
  attributeFilter: ["data-mode", "data-theme"]
};
function z() {
  const o = document.documentElement, e = document.body;
  if (!o || !e) return null;
  if (o.classList.contains("dark") || e.classList.contains("dark") || o.getAttribute("data-theme") === "dark" || e.getAttribute("data-theme") === "dark")
    return !0;
  if (o.getAttribute("data-theme") === "light" || e.getAttribute("data-theme") === "light")
    return !1;
  if (o.getAttribute("data-bs-theme") === "dark" || e.getAttribute("data-bs-theme") === "dark")
    return !0;
  if (o.getAttribute("data-bs-theme") === "light" || e.getAttribute("data-bs-theme") === "light")
    return !1;
  if (o.getAttribute("data-mode") === "dark") return !0;
  if (o.getAttribute("data-mode") === "light") return !1;
  const t = getComputedStyle(o).colorScheme;
  return t === "dark" ? !0 : t === "light" ? !1 : null;
}
function L(o, e) {
  const t = o.getAttribute("data-mode");
  if (t === "dark" || t === "light") return t === "dark";
  if (o === e) return null;
  const r = getComputedStyle(o).colorScheme;
  return r === "dark" || r === "light" ? r === "dark" : null;
}
function E(o) {
  let e = o;
  for (; e; ) {
    const t = e.closest(A);
    if (t === document.documentElement) return null;
    if (!t) {
      e = e.getRootNode().host;
      continue;
    }
    const r = L(t, o);
    if (r !== null) return r;
    e = t.parentElement ?? t.getRootNode().host;
  }
  return null;
}
function M(o) {
  o.target.localName === "link" && f();
}
function v(o, e = z()) {
  return E(o) ?? e;
}
function f() {
  const o = z();
  for (const e of h) {
    const t = v(e, o);
    t !== e._resolvedDarkMode && e._onPageModeChange(t);
  }
}
function T() {
  if (l) return;
  l = new MutationObserver(f);
  const o = {
    attributes: !0,
    attributeFilter: ["class", "data-theme", "data-bs-theme", "data-mode", "style"]
  };
  l.observe(document.documentElement, o), document.body && l.observe(document.body, o), u = new MutationObserver(f), u.observe(document.documentElement, C), document.addEventListener("load", M, !0);
}
function I(o) {
  let e = o.getRootNode();
  for (; e instanceof ShadowRoot; )
    m.has(e) || (m.add(e), u.observe(e, C)), e = e.host.getRootNode();
}
function R() {
  l && (l.disconnect(), l = null, u.disconnect(), u = null, document.removeEventListener("load", M, !0), m = /* @__PURE__ */ new WeakSet());
}
function $(o) {
  h.add(o), h.size === 1 && T(), I(o), o._onPageModeChange(v(o));
}
function B(o) {
  h.delete(o), h.size === 0 && R();
}
const y = {
  "iphone-16": {
    width: 393,
    height: 852,
    bezel: 12,
    notch: "dynamic-island",
    cornerRadius: 55,
    homeIndicator: !0,
    homeButton: !1,
    safeInsets: [59, 0, 34, 0]
  },
  "iphone-16-pro-max": {
    width: 440,
    height: 956,
    bezel: 12,
    notch: "dynamic-island",
    cornerRadius: 55,
    homeIndicator: !0,
    homeButton: !1,
    safeInsets: [59, 0, 34, 0]
  },
  "iphone-se": {
    width: 375,
    height: 667,
    bezel: 12,
    notch: "none",
    cornerRadius: 0,
    homeIndicator: !1,
    homeButton: !0,
    safeInsets: [20, 0, 0, 0]
  },
  "pixel-9": {
    width: 412,
    height: 923,
    bezel: 10,
    notch: "punch-hole",
    cornerRadius: 48,
    homeIndicator: !0,
    homeButton: !1,
    safeInsets: [48, 0, 24, 0]
  },
  "pixel-9-pro-xl": {
    width: 448,
    height: 998,
    bezel: 10,
    notch: "punch-hole",
    cornerRadius: 48,
    homeIndicator: !0,
    homeButton: !1,
    safeInsets: [48, 0, 24, 0]
  },
  "galaxy-s24": {
    width: 360,
    height: 780,
    bezel: 10,
    notch: "punch-hole",
    cornerRadius: 40,
    homeIndicator: !0,
    homeButton: !1,
    safeInsets: [48, 0, 24, 0]
  },
  "ipad-air": {
    width: 820,
    height: 1180,
    bezel: 16,
    notch: "none",
    cornerRadius: 18,
    homeIndicator: !0,
    homeButton: !1,
    safeInsets: [24, 0, 20, 0]
  },
  "ipad-pro-13": {
    width: 1032,
    height: 1376,
    bezel: 16,
    notch: "none",
    cornerRadius: 18,
    homeIndicator: !0,
    homeButton: !1,
    safeInsets: [24, 0, 20, 0]
  },
  "ipad-mini": {
    width: 744,
    height: 1133,
    bezel: 16,
    notch: "none",
    cornerRadius: 18,
    homeIndicator: !0,
    homeButton: !1,
    safeInsets: [24, 0, 20, 0]
  }
}, _ = {
  midnight: "#1a1a1a",
  silver: "#c0c0c0",
  gold: "#d4a574",
  blue: "#3a4f6f",
  white: "#f0f0f0"
}, O = {
  "dynamic-island": 54,
  "punch-hole": 36,
  none: 24
}, D = 28, k = 80;
let S = !1;
class H extends HTMLElement {
  constructor() {
    super(), this.attachShadow({ mode: "open" }), this.isMinimized = !1, this.isMaximized = !1, this.overlay = null, this.showSource = !1, this.sourceCode = "", this.showShareMenu = !1, this._handleKeydown = this._handleKeydown.bind(this), this._handleOutsideClick = this._handleOutsideClick.bind(this), this._resizeObserver = null, this._currentScale = 1, this._outsideClickTimer = null, this._copyFeedbackTimer = null, this._fetchController = null, this._sourceCodeSrc = "";
  }
  async connectedCallback() {
    this.render(), this._attachEventListeners(), $(this), this._getDevicePreset() && this._setupDeviceScaling();
  }
  disconnectedCallback() {
    B(this), this._removeOverlay(), this._teardownDeviceScaling(), clearTimeout(this._outsideClickTimer), clearTimeout(this._copyFeedbackTimer), this._fetchController?.abort(), document.removeEventListener("keydown", this._handleKeydown), document.removeEventListener("click", this._handleOutsideClick);
  }
  static get observedAttributes() {
    return [
      "url",
      "title",
      "mode",
      "shadow",
      "src",
      "device",
      "device-color",
      "orientation",
      "show-safe-areas",
      "allow",
      "allowfullscreen",
      "referrerpolicy",
      "iframe-title"
    ];
  }
  attributeChangedCallback(e, t, r) {
    if (!(!this.shadowRoot || t === r)) {
      if (e === "src") {
        this._handleSrcChange(t, r);
        return;
      }
      if (e === "device" || e === "orientation") {
        this._teardownDeviceScaling(), this._renderStructure(), this._getDevicePreset() && this._setupDeviceScaling();
        return;
      }
      if (e === "show-safe-areas") {
        this._updateSafeAreaOverlays();
        return;
      }
      if (e === "device-color") {
        this._updateDynamicStyles(), this._applyDeviceColorClass();
        return;
      }
      if (e === "url" || e === "title") {
        this._updateBrowserUrlBar(), this._syncIframePassthroughAttrs();
        return;
      }
      if (e === "shadow") {
        this._updateDynamicStyles();
        return;
      }
      if (e === "mode") {
        this.hasAttribute("mode") ? this.removeAttribute("data-page-mode") : this._onPageModeChange(v(this)), this._syncIframeColorScheme();
        return;
      }
      (e === "allow" || e === "allowfullscreen" || e === "referrerpolicy" || e === "iframe-title") && this._syncIframePassthroughAttrs();
    }
  }
  // Accessible name for the inner iframe, which must never be empty.
  _iframeTitle() {
    for (const e of [this.getAttribute("iframe-title"), this.getAttribute("title"), this.url]) {
      const t = e?.trim();
      if (t) return t;
    }
    return "Embedded page";
  }
  // Build attribute string for inline iframe templates. The title is always
  // emitted; the passthrough attributes only when the host has them.
  _iframeAttrs() {
    const e = [`title="${this._escapeHtml(this._iframeTitle())}"`];
    return this.hasAttribute("allow") && e.push(`allow="${this._escapeHtml(this.getAttribute("allow"))}"`), this.hasAttribute("allowfullscreen") && e.push("allowfullscreen"), this.hasAttribute("referrerpolicy") && e.push(`referrerpolicy="${this._escapeHtml(this.getAttribute("referrerpolicy"))}"`), " " + e.join(" ");
  }
  _syncIframePassthroughAttrs() {
    const e = this.shadowRoot?.querySelector("iframe");
    if (e) {
      e.setAttribute("title", this._iframeTitle());
      for (const t of ["allow", "allowfullscreen", "referrerpolicy"])
        this.hasAttribute(t) ? e.setAttribute(t, this.getAttribute(t) ?? "") : e.removeAttribute(t);
    }
  }
  get url() {
    return this.getAttribute("url") || "";
  }
  set url(e) {
    this.setAttribute("url", e);
  }
  get src() {
    return this.getAttribute("src") || "";
  }
  set src(e) {
    this.setAttribute("src", e);
  }
  get browserTitle() {
    return this.getAttribute("title") || this.getHostname();
  }
  set browserTitle(e) {
    this.setAttribute("title", e);
  }
  get mode() {
    return this.getAttribute("mode") || this.getAttribute("data-page-mode") || (typeof window < "u" && window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  }
  set mode(e) {
    e ? this.setAttribute("mode", e) : this.removeAttribute("mode");
  }
  get device() {
    return this.getAttribute("device") || "";
  }
  set device(e) {
    e ? this.setAttribute("device", e) : this.removeAttribute("device");
  }
  get deviceColor() {
    return this.getAttribute("device-color") || "midnight";
  }
  set deviceColor(e) {
    this.setAttribute("device-color", e);
  }
  get orientation() {
    return this.getAttribute("orientation") || "portrait";
  }
  set orientation(e) {
    e && e !== "portrait" ? this.setAttribute("orientation", e) : this.removeAttribute("orientation");
  }
  get showSafeAreas() {
    return this.hasAttribute("show-safe-areas");
  }
  set showSafeAreas(e) {
    this.toggleAttribute("show-safe-areas", !!e);
  }
  _getDevicePreset() {
    const e = this.getAttribute("device");
    if (!e) return null;
    const t = y[e];
    return t || (console.warn(
      `<browser-window>: Unknown device preset "${e}", falling back to "iphone-16"`
    ), y["iphone-16"]);
  }
  _getEffectiveDimensions(e) {
    const t = this.getAttribute("orientation") === "landscape";
    return {
      width: t ? e.height : e.width,
      height: t ? e.width : e.height
    };
  }
  _getEffectiveSafeInsets(e) {
    const [t, r, i, s] = e.safeInsets;
    return this.getAttribute("orientation") === "landscape" ? [s, t, r, i] : [t, r, i, s];
  }
  _onPageModeChange(e) {
    if (this._resolvedDarkMode = e, this.hasAttribute("mode")) {
      this.removeAttribute("data-page-mode");
      return;
    }
    e === !0 ? this.setAttribute("data-page-mode", "dark") : e === !1 ? this.setAttribute("data-page-mode", "light") : this.removeAttribute("data-page-mode"), this._syncIframeColorScheme();
  }
  _syncIframeColorScheme() {
    const e = this.shadowRoot?.querySelector("iframe");
    if (!e) return;
    const t = this.mode === "dark";
    try {
      const r = e.contentDocument;
      r?.documentElement && (r.documentElement.style.colorScheme = t ? "dark" : "light");
    } catch {
    }
  }
  _renderStructure() {
    this._setShareMenuOpen(!1), this.render(), this._attachEventListeners(), this._updateDynamicStyles(), this._applyDeviceColorClass();
  }
  _handleSrcChange(e, t) {
    if (this._fetchController?.abort(), this._fetchController = null, this.showSource = !1, this.sourceCode = "", this._sourceCodeSrc = "", this._setShareMenuOpen(!1), !!e !== !!t) {
      this._renderStructure();
      return;
    }
    this._updateContentView(), this._updateDownloadLinks();
  }
  _updateDynamicStyles() {
    const e = this.shadowRoot?.querySelector("style[data-browser-window-dynamic]");
    e && (e.textContent = this._dynamicCSS());
  }
  _getBezelColor() {
    return _[this.deviceColor] || _.midnight;
  }
  _applyDeviceColorClass() {
    const e = this.shadowRoot?.querySelector(".device-frame");
    if (!e) return;
    const t = ["silver", "gold", "white"];
    e.classList.toggle("light-bezel", t.includes(this.deviceColor));
  }
  _updateBrowserUrlBar() {
    const e = this.shadowRoot?.querySelector(".url-bar");
    if (!e) return;
    const t = e.querySelector(".url-text");
    t && (t.textContent = this.browserTitle, t.setAttribute("title", this.url));
    const r = e.querySelector(".lock-icon"), i = this.url.startsWith("https");
    if (i && !r && t) {
      const s = document.createElement("span");
      s.className = "lock-icon", s.textContent = "🔒", e.insertBefore(s, t);
    } else !i && r && r.remove();
  }
  _updateDownloadLinks() {
    for (const e of this.shadowRoot?.querySelectorAll(".download-button") || [])
      e.setAttribute("href", this.src);
  }
  _createSafeAreaOverlays() {
    const e = document.createElement("div");
    return e.className = "safe-area-overlays", e.innerHTML = `
      <div class="safe-area-overlay safe-area-top"></div>
      <div class="safe-area-overlay safe-area-right"></div>
      <div class="safe-area-overlay safe-area-bottom"></div>
      <div class="safe-area-overlay safe-area-left"></div>
    `, e;
  }
  _updateSafeAreaOverlays() {
    const e = this.shadowRoot?.querySelector(".device-frame");
    if (!e) return;
    const t = e.querySelector(".safe-area-overlays");
    this.showSafeAreas ? t || e.appendChild(this._createSafeAreaOverlays()) : t?.remove();
  }
  _resolveURL(e) {
    if (!e) return "";
    try {
      return new URL(e, document.baseURI).href;
    } catch {
      return e;
    }
  }
  _injectSafeAreas(e) {
    const t = this._getDevicePreset();
    if (t)
      try {
        const r = e.contentDocument;
        if (!r) return;
        const i = r.querySelector("style[data-browser-window-safe-areas]");
        i && i.remove();
        const [s, d, n, c] = this._getEffectiveSafeInsets(t), a = r.createElement("style");
        a.setAttribute("data-browser-window-safe-areas", ""), a.textContent = `
        :root {
          --safe-top: ${s}px;
          --safe-right: ${d}px;
          --safe-bottom: ${n}px;
          --safe-left: ${c}px;
        }
      `, r.head.appendChild(a);
      } catch {
        console.info("<browser-window>: Cannot inject safe areas into cross-origin iframe");
      }
  }
  get hasShadow() {
    return this.hasAttribute("shadow");
  }
  getHostname() {
    try {
      return new URL(this.url).hostname;
    } catch {
      return this.url;
    }
  }
  _attachEventListeners() {
    const e = this.shadowRoot.querySelector(".control-button.close"), t = this.shadowRoot.querySelector(".control-button.minimize"), r = this.shadowRoot.querySelector(".control-button.maximize"), i = this.shadowRoot.querySelector(".view-source-button"), s = this.shadowRoot.querySelector(".copy-source-button"), d = this.shadowRoot.querySelector(".share-button"), n = this.shadowRoot.querySelector(".browser-header");
    e?.addEventListener("click", () => this._handleClose()), t?.addEventListener("click", () => this.toggleMinimize()), r?.addEventListener("click", () => this.toggleMaximize()), i?.addEventListener("click", () => this.toggleViewSource()), s?.addEventListener("click", () => this.copySourceCode()), d?.addEventListener("click", (a) => {
      a.stopPropagation(), this.toggleShareMenu();
    }), n?.addEventListener("dblclick", (a) => {
      a.target.closest("button, a, .share-menu") || this.toggleMaximize();
    });
    const c = this.shadowRoot.querySelector("iframe");
    if (c) {
      const a = () => {
        this._syncIframeColorScheme(), this._getDevicePreset() && this._injectSafeAreas(c);
      };
      c.addEventListener("error", () => this._handleIframeError()), c.addEventListener("load", a), c.contentDocument?.readyState === "complete" && c.src && a();
    }
    this.shadowRoot.querySelector('[data-action="share"]')?.addEventListener("click", () => this.shareViaWebAPI()), this.shadowRoot.querySelector('[data-action="codepen"]')?.addEventListener("click", () => this.openInCodePen()), this.shadowRoot.querySelector(".retry-button")?.addEventListener("click", () => this._retryLoad());
  }
  _handleIframeError() {
    const e = this.shadowRoot.querySelector(".browser-content");
    e && (e.innerHTML = `
      <div class="error-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <p>Failed to load content</p>
        <button class="retry-button">Retry</button>
      </div>
    `, e.querySelector(".retry-button")?.addEventListener("click", () => this._retryLoad()));
  }
  _retryLoad() {
    const e = this.shadowRoot.querySelector(".browser-content");
    if (!e || !this.src) return;
    e.innerHTML = `<iframe src="${this._escapeHtml(this.src)}" loading="lazy"${this._iframeAttrs()}></iframe>`;
    const t = e.querySelector("iframe");
    t?.addEventListener("error", () => this._handleIframeError()), t?.addEventListener("load", () => {
      this._syncIframeColorScheme(), this._getDevicePreset() && this._injectSafeAreas(t);
    });
  }
  _reloadIframeIfNeeded(e) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        try {
          const t = e.contentDocument?.body;
          if (t && t.children.length === 0 && t.textContent.trim() === "") {
            const r = e.getAttribute("src");
            r && (e.src = r);
          }
        } catch {
        }
      });
    });
  }
  async fetchSourceCode() {
    if (!this.src || this._sourceCodeSrc === this.src && this.sourceCode) return;
    const e = this.src;
    this._fetchController?.abort();
    const t = new AbortController();
    this._fetchController = t;
    try {
      const r = await fetch(this._resolveURL(e), { signal: t.signal });
      if (!r.ok) {
        if (this.src === e) {
          const s = [r.status, r.statusText].filter(Boolean).join(" ");
          this.sourceCode = `// Failed to load source code${s ? ` (${s})` : ""}`, this._sourceCodeSrc = e;
        }
        return;
      }
      const i = await r.text();
      this._fetchController === t && this.src === e && (this.sourceCode = i, this._sourceCodeSrc = e);
    } catch (r) {
      r.name !== "AbortError" && (console.error("Failed to fetch source code:", r), this.src === e && (this.sourceCode = "// Failed to load source code", this._sourceCodeSrc = e));
    } finally {
      this._fetchController === t && (this._fetchController = null);
    }
  }
  async toggleViewSource() {
    this.showSource = !this.showSource, this.showSource && !this.sourceCode && this.src && await this.fetchSourceCode(), this._updateContentView();
  }
  _updateContentView() {
    const e = this.shadowRoot.querySelector(".view-source-button");
    !!this._getDevicePreset() ? this._updateDeviceSourceView(e) : this._updateBrowserSourceView(e);
  }
  _updateBrowserSourceView(e) {
    const t = this.shadowRoot.querySelector(".browser-content");
    if (t)
      if (this.showSource)
        t.innerHTML = this._sourceViewHTML(), e?.classList.add("active"), t.querySelector(".copy-source-button")?.addEventListener("click", () => this.copySourceCode());
      else {
        if (this.src) {
          t.innerHTML = `<iframe src="${this._escapeHtml(this.src)}" loading="lazy"${this._iframeAttrs()}></iframe>`;
          const r = t.querySelector("iframe");
          r?.addEventListener("error", () => this._handleIframeError()), r?.addEventListener("load", () => this._syncIframeColorScheme());
        } else
          t.innerHTML = "<slot></slot>";
        e?.classList.remove("active");
      }
  }
  _updateDeviceSourceView(e) {
    const t = this.shadowRoot.querySelector(".browser-content");
    if (t)
      if (this.showSource)
        t.innerHTML = this._sourceViewHTML(), e?.classList.add("active"), t.querySelector(".copy-source-button")?.addEventListener("click", () => this.copySourceCode());
      else {
        if (this.src) {
          t.innerHTML = `<iframe src="${this._escapeHtml(this.src)}" loading="lazy"${this._iframeAttrs()}></iframe>`;
          const r = t.querySelector("iframe");
          r?.addEventListener("error", () => this._handleIframeError()), r?.addEventListener("load", () => {
            this._syncIframeColorScheme(), this._getDevicePreset() && this._injectSafeAreas(r);
          });
        } else
          t.innerHTML = "<slot></slot>";
        e?.classList.remove("active");
      }
  }
  _sourceViewHTML() {
    return `
      <div class="source-view">
        <div class="source-header">
          <span class="source-label">Source Code</span>
          <button class="copy-source-button" title="Copy source code">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="5" y="5" width="9" height="9" rx="1"/>
              <path d="M3 11V3a1 1 0 011-1h8"/>
            </svg>
            Copy
          </button>
        </div>
        <pre><code>${this._escapeHtml(this.sourceCode)}</code></pre>
      </div>
    `;
  }
  async copySourceCode() {
    if (this.sourceCode)
      try {
        await navigator.clipboard.writeText(this.sourceCode);
        const e = this.shadowRoot.querySelector(".copy-source-button");
        if (e) {
          const t = e.innerHTML;
          e.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3,8 6,11 13,4"/>
          </svg>
          Copied!
        `, e.classList.add("copied"), clearTimeout(this._copyFeedbackTimer), this._copyFeedbackTimer = setTimeout(() => {
            e.innerHTML = t, e.classList.remove("copied");
          }, 2e3);
        }
      } catch (e) {
        console.error("Failed to copy source code:", e);
      }
  }
  toggleShareMenu() {
    this._setShareMenuOpen(!this.showShareMenu);
  }
  _setShareMenuOpen(e) {
    const t = this.shadowRoot?.querySelector(".share-menu"), r = this.shadowRoot?.querySelector(".share-button");
    if (!t || !r) {
      this.showShareMenu = !1, clearTimeout(this._outsideClickTimer), document.removeEventListener("click", this._handleOutsideClick);
      return;
    }
    this.showShareMenu = e, this.showShareMenu ? (t.style.display = "block", r.classList.add("active"), clearTimeout(this._outsideClickTimer), this._outsideClickTimer = setTimeout(() => {
      document.addEventListener("click", this._handleOutsideClick);
    }, 0)) : (t.style.display = "none", r.classList.remove("active"), clearTimeout(this._outsideClickTimer), document.removeEventListener("click", this._handleOutsideClick));
  }
  _handleOutsideClick(e) {
    const t = this.shadowRoot?.querySelector(".share-menu");
    if (!t) return;
    e.composedPath().includes(t) || this._setShareMenuOpen(!1);
  }
  async shareViaWebAPI() {
    if (!navigator.share) {
      console.warn("Web Share API not supported");
      return;
    }
    const e = {
      title: this.browserTitle || "CSS Demo",
      text: `Check out this CSS demo: ${this.browserTitle}`,
      url: this._resolveURL(this.src || this.url)
    };
    try {
      await navigator.share(e), this._setShareMenuOpen(!1);
    } catch (t) {
      t.name !== "AbortError" && console.error("Error sharing:", t);
    }
  }
  parseHTMLForCodePen() {
    if (!this.sourceCode) return null;
    const t = new DOMParser().parseFromString(this.sourceCode, "text/html"), r = Array.from(t.querySelectorAll("style")).map((n) => n.textContent).join(`

`), i = Array.from(t.querySelectorAll("script")).filter((n) => !n.src && n.type !== "module").map((n) => n.textContent).join(`

`), s = t.body.cloneNode(!0);
    return s.querySelectorAll("script, style").forEach((n) => n.remove()), {
      html: s.innerHTML.trim(),
      css: r.trim(),
      js: i.trim()
    };
  }
  async openInCodePen() {
    !this.sourceCode && this.src && await this.fetchSourceCode();
    const e = this.parseHTMLForCodePen();
    if (!e) return;
    const t = {
      title: this.browserTitle || "CSS Demo",
      description: `Demo from ${this.url}`,
      html: e.html,
      css: e.css,
      js: e.js,
      editors: "110"
      // Show HTML and CSS editors, hide JS if empty
    }, r = document.createElement("form");
    r.action = "https://codepen.io/pen/define", r.method = "POST", r.target = "_blank";
    const i = document.createElement("input");
    i.type = "hidden", i.name = "data", i.value = JSON.stringify(t), r.appendChild(i), document.body.appendChild(r), r.submit(), document.body.removeChild(r), this._setShareMenuOpen(!1);
  }
  _handleClose() {
    if (this.isMaximized) {
      this.toggleMaximize();
      return;
    }
    this.toggleMinimize();
  }
  _handleKeydown(e) {
    e.key === "Escape" && (this.showShareMenu ? this.toggleShareMenu() : this.isMaximized && this.toggleMaximize());
  }
  _createOverlay() {
    if (!this.overlay) {
      if (this.overlay = document.createElement("div"), this.overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.5);
      z-index: var(--browser-window-overlay-z-index, 9998);
      cursor: pointer;
      animation: fadeIn 200ms ease;
    `, !S) {
        const e = document.createElement("style");
        e.textContent = `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `, document.head.appendChild(e), S = !0;
      }
      this.overlay.addEventListener("click", () => this.toggleMaximize()), document.body.appendChild(this.overlay), document.addEventListener("keydown", this._handleKeydown);
    }
  }
  _removeOverlay() {
    this.overlay && (this.overlay.remove(), this.overlay = null), document.removeEventListener("keydown", this._handleKeydown);
  }
  toggleMinimize() {
    if (this.isMaximized) {
      this.toggleMaximize();
      return;
    }
    const e = this.shadowRoot.querySelector(".browser-content");
    e && (this.isMinimized = !this.isMinimized, this.isMinimized ? (e.style.height = "0", e.style.overflow = "hidden") : (e.style.height = "", e.style.overflow = ""));
  }
  toggleMaximize() {
    const e = this.shadowRoot.querySelector(".control-button.maximize");
    if (this.isMaximized) {
      this.classList.remove("browser-window-maximized"), this.removeAttribute("role"), this.removeAttribute("aria-modal"), this.removeAttribute("tabindex");
      const t = this.shadowRoot.querySelector("iframe");
      t && (t.style.minHeight = "", this._reloadIframeIfNeeded(t)), this._removeOverlay(), this.isMaximized = !1, this._previousFocus && typeof this._previousFocus.focus == "function" && (this._previousFocus.focus(), this._previousFocus = null), e && (e.setAttribute("aria-label", "Maximize window"), e.setAttribute("aria-expanded", "false"));
    } else {
      this.isMinimized && this.toggleMinimize(), this._createOverlay(), this.classList.add("browser-window-maximized"), this.setAttribute("role", "dialog"), this.setAttribute("aria-modal", "true");
      const t = this.shadowRoot.querySelector("iframe");
      t && (t.style.minHeight = "calc(90vh - 50px)", this._reloadIframeIfNeeded(t)), this.isMaximized = !0, this._previousFocus = document.activeElement, this.setAttribute("tabindex", "-1"), this.focus(), e && (e.setAttribute("aria-label", "Restore window"), e.setAttribute("aria-expanded", "true"));
    }
  }
  // --- Render pipeline ---
  render() {
    const e = this._getDevicePreset(), t = e ? this._deviceCSS(e) : this._browserCSS(), r = e ? this._deviceChrome(e) : this._browserChrome();
    this.shadowRoot.innerHTML = `
      <style>${this._sharedCSS()}${t}</style>
      <style data-browser-window-dynamic>${this._dynamicCSS()}</style>
      ${r}
      ${e ? "" : this._contentHTML()}
    `, e && this._updateDeviceScale();
  }
  _darkPalette() {
    return `
            --_bw-bg: var(--color-surface, #1c1c1e);
            --_bw-header-bg: var(--color-surface-raised, #2c2c2e);
            --_bw-border-color: var(--color-border, #3a3a3c);
            --_bw-text-color: var(--color-text, #e5e5e7);
            --_bw-text-muted: var(--color-text-muted, #98989d);
            --_bw-url-bg: var(--color-surface, #1c1c1e);
            --_bw-hover-bg: #3a3a3c;
            --_bw-content-bg: var(--color-surface, #000000);
            color-scheme: dark;`;
  }
  _lightPalette() {
    return `
            --_bw-bg: var(--color-surface, #ffffff);
            --_bw-header-bg: var(--color-surface-raised, #f6f8fa);
            --_bw-border-color: var(--color-border, #d1d5da);
            --_bw-text-color: var(--color-text, #24292e);
            --_bw-text-muted: var(--color-text-muted, #586069);
            --_bw-url-bg: var(--color-surface, #ffffff);
            --_bw-hover-bg: #f3f4f6;
            --_bw-content-bg: var(--color-surface, #ffffff);
            color-scheme: light;`;
  }
  _sharedCSS() {
    return `
        :host {
          /* Internal defaults — external --browser-window-* overrides always win */
          --_bw-bg: var(--color-surface, #ffffff);
          --_bw-header-bg: var(--color-surface-raised, #f6f8fa);
          --_bw-border-color: var(--color-border, #d1d5da);
          --_bw-text-color: var(--color-text, #24292e);
          --_bw-text-muted: var(--color-text-muted, #586069);
          --_bw-url-bg: var(--color-surface, #ffffff);
          --_bw-hover-bg: #f3f4f6;
          --_bw-content-bg: var(--color-surface, #ffffff);

          /* Non-structural properties */
          --browser-window-border-radius: var(--radius-m, 8px);
          --browser-window-inner-radius: var(--radius-s, 6px);
          --browser-window-close-color: #ff5f57;
          --browser-window-minimize-color: #febc2e;
          --browser-window-maximize-color: #28c840;
          --browser-window-accent-color: #2563eb;
          --browser-window-active-bg: #dbeafe;
          --browser-window-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          --browser-window-mono-font: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;

          display: flex;
          flex-direction: column;
          margin: var(--browser-window-margin, 1rem 0);
          border-radius: var(--browser-window-border-radius);
          overflow: hidden;
          border-width: var(--browser-window-border-width, 1px);
          border-style: var(--browser-window-border-style, solid);
          border-color: var(--browser-window-border-color, var(--_bw-border-color));
          background: var(--browser-window-bg, var(--_bw-bg));
          box-shadow: var(--browser-window-shadow);
          transition: all 250ms ease-out;
          font-family: var(--browser-window-font-family);
          color: var(--browser-window-text-color, var(--_bw-text-color));
          color-scheme: light;

          /* Resizable container */
          resize: both;
          min-width: 280px;
          min-height: 150px;

        }

        /* Auto dark mode based on system preference (when no mode attribute) */
        @media (prefers-color-scheme: dark) {
          :host(:not([mode])) {
            ${this._darkPalette()}
          }
        }

        /* Page-level dark mode detection (overrides media query via higher specificity) */
        :host([data-page-mode="dark"]:not([mode])) {
          ${this._darkPalette()}
        }

        :host([data-page-mode="light"]:not([mode])) {
          ${this._lightPalette()}
        }

        /* Explicit dark mode override */
        :host([mode="dark"]) {
          ${this._darkPalette()}
        }

        /* Explicit light mode override (for users on dark system who want light) */
        :host([mode="light"]) {
          ${this._lightPalette()}
        }

        :host(.browser-window-maximized) {
          position: fixed !important;
          top: 5vh !important;
          left: 5vw !important;
          width: 90vw !important;
          height: 90vh !important;
          z-index: var(--browser-window-z-index, 9999) !important;
          margin: 0 !important;
          resize: none !important;
        }

        @media (prefers-reduced-motion: reduce) {
          :host {
            transition: none;
          }
        }

        .browser-content {
          background: var(--browser-window-content-bg, var(--_bw-content-bg));
          min-height: 200px;
          padding: 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        /* Slot fills available space */
        slot {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-height: 0;
        }

        /* Slotted content fills the slot */
        ::slotted(*) {
          flex: 1;
          width: 100%;
          min-height: 0;
        }

        iframe {
          display: block;
          width: 100%;
          border: none;
          flex: 1;
          min-height: 200px;
        }

        ::slotted(img),
        ::slotted(iframe) {
          display: block;
          border: none;
          margin: 0;
        }

        .source-view {
          padding: 0;
          background: var(--browser-window-header-bg, var(--_bw-header-bg));
          min-height: 0;
          flex: 1;
          overflow: auto;
          display: flex;
          flex-direction: column;
        }

        .source-header {
          position: sticky;
          top: 0;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1rem;
          background: var(--browser-window-header-bg, var(--_bw-header-bg));
          border-bottom: 1px solid var(--browser-window-border-color, var(--_bw-border-color));
          backdrop-filter: blur(8px);
        }

        .source-label {
          font-weight: 600;
          font-size: 0.875rem;
          color: var(--browser-window-text-color, var(--_bw-text-color));
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .copy-source-button {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.375rem 0.75rem;
          background: var(--browser-window-bg, var(--_bw-bg));
          border: 1px solid var(--browser-window-border-color, var(--_bw-border-color));
          border-radius: var(--browser-window-inner-radius);
          color: var(--browser-window-text-color, var(--_bw-text-color));
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 150ms ease;
        }

        .copy-source-button:hover {
          background: var(--browser-window-hover-bg, var(--_bw-hover-bg));
        }

        .copy-source-button:active {
          transform: scale(0.97);
        }

        .copy-source-button.copied {
          background: #10b981;
          border-color: #10b981;
          color: white;
        }

        .source-view pre {
          margin: 0;
          padding: 1rem;
          background: var(--browser-window-content-bg, var(--_bw-content-bg));
          border: none;
          border-radius: 0;
          overflow-x: auto;
          flex: 1;
          font-family: var(--browser-window-mono-font);
          font-size: 0.875rem;
          line-height: 1.6;
        }

        .source-view code {
          color: var(--browser-window-text-color, var(--_bw-text-color));
          display: block;
          white-space: pre;
        }

        .error-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 1rem;
          text-align: center;
          color: var(--browser-window-text-muted, var(--_bw-text-muted));
          min-height: 200px;
        }

        .error-state svg {
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .error-state p {
          margin: 0 0 1rem 0;
          font-size: 0.875rem;
        }

        .retry-button {
          padding: 0.5rem 1rem;
          background: var(--browser-window-accent-color);
          color: white;
          border: none;
          border-radius: var(--browser-window-inner-radius);
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: opacity 150ms ease;
        }

        .retry-button:hover {
          opacity: 0.9;
        }

        .retry-button:active {
          transform: scale(0.98);
        }

        .share-container {
          position: relative;
          display: inline-block;
        }

        .share-menu {
          display: none;
          position: absolute;
          top: calc(100% + 4px);
          right: 0;
          background: var(--browser-window-header-bg, var(--_bw-header-bg));
          border: 1px solid var(--browser-window-border-color, var(--_bw-border-color));
          border-radius: var(--browser-window-border-radius);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          min-width: 180px;
          z-index: var(--browser-window-menu-z-index, 1000);
          overflow: hidden;
        }

        .share-menu-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
          padding: 0.625rem 1rem;
          background: none;
          border: none;
          color: var(--browser-window-text-color, var(--_bw-text-color));
          font-size: 0.875rem;
          font-weight: 500;
          text-align: left;
          cursor: pointer;
          transition: background 150ms ease;
          border-bottom: 1px solid var(--browser-window-border-color, var(--_bw-border-color));
        }

        .share-menu-item:last-child {
          border-bottom: none;
        }

        .share-menu-item:hover {
          background: var(--browser-window-hover-bg, var(--_bw-hover-bg));
        }

        .share-menu-item:active {
          background: var(--browser-window-active-bg);
        }

        .share-menu-item svg {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
        }
    `;
  }
  _dynamicCSS() {
    return `
      :host {
        --browser-window-shadow: ${this.hasShadow ? "0 4px 12px rgba(0, 0, 0, 0.15)" : "none"};
        --browser-window-bezel-color: ${this._getBezelColor()};
      }
    `;
  }
  _browserCSS() {
    return `
        .browser-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          background: var(--browser-window-header-bg, var(--_bw-header-bg));
          border-bottom: 1px solid var(--browser-window-border-color, var(--_bw-border-color));
          cursor: zoom-in;
          user-select: none;
        }

        :host(.browser-window-maximized) .browser-header {
          cursor: zoom-out;
        }

        /* Targets sit edge to edge so hit areas never overlap. The inline margin
           keeps the first dot on the header padding. */
        .controls {
          display: flex;
          flex-shrink: 0;
          align-items: center;
          margin-inline: -6px;
        }

        .control-button {
          /* Touch target size - transparent background */
          width: 24px;
          height: 24px;
          padding: 0;
          border-radius: 50%;
          border: none;
          background: transparent;
          cursor: pointer !important;
          transition: opacity 150ms ease;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          /* Keep targets from adding to the header height */
          margin-block: -6px;
        }

        /* Visual circle via pseudo-element */
        .control-button::after {
          content: '';
          width: 12px;
          height: 12px;
          border-radius: 50%;
          transition: opacity 150ms ease;
        }

        /* Larger touch targets on touch devices */
        @media (pointer: coarse) {
          .controls {
            margin-inline: -16px -12px;
          }

          .control-button {
            width: 44px;
            height: 44px;
            margin-block: -16px;
          }
        }

        /* The header padding is 0.75rem here, so keep targets inside the window */
        @media (pointer: coarse) and (max-width: 480px) {
          .controls {
            margin-inline: -12px -8px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .control-button {
            transition: none;
          }
          .control-button::after {
            transition: none;
          }
        }

        .control-button:hover::after {
          opacity: 0.8;
        }

        .control-button:active::after {
          opacity: 0.6;
          transform: scale(0.9);
        }

        .control-button:focus {
          outline: 2px solid var(--browser-window-accent-color);
          outline-offset: 2px;
        }

        .control-button:focus:not(:focus-visible) {
          outline: none;
        }

        .control-button.close::after {
          background: var(--browser-window-close-color);
        }

        .control-button.minimize::after {
          background: var(--browser-window-minimize-color);
        }

        .control-button.maximize::after {
          background: var(--browser-window-maximize-color);
        }

        .url-bar {
          flex: 1;
          min-width: 0;
          container: url-bar / inline-size;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.375rem 0.75rem;
          background: var(--browser-window-url-bg, var(--_bw-url-bg));
          border: 1px solid var(--browser-window-border-color, var(--_bw-border-color));
          border-radius: var(--browser-window-inner-radius);
          font-size: 0.875rem;
          color: var(--browser-window-text-muted, var(--_bw-text-muted));
          cursor: default !important;
        }

        .lock-icon {
          color: var(--browser-window-text-muted, var(--_bw-text-muted));
          font-size: 0.75rem;
        }

        /* No room for the lock beside the toolbar */
        @container url-bar (max-width: 119px) {
          .lock-icon {
            display: none;
          }
        }

        .url-text {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: var(--browser-window-text-muted, var(--_bw-text-muted));
        }

        .view-source-button,
        .download-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--browser-window-text-muted, var(--_bw-text-muted));
          transition: all 150ms ease;
          border-radius: 4px;
        }

        .view-source-button:hover,
        .download-button:hover {
          color: var(--browser-window-text-color, var(--_bw-text-color));
          background: var(--browser-window-hover-bg, var(--_bw-hover-bg));
        }

        .view-source-button:active,
        .download-button:active {
          transform: scale(0.95);
        }

        .view-source-button.active {
          color: var(--browser-window-accent-color);
          background: var(--browser-window-active-bg);
        }

        .download-icon {
          width: 16px;
          height: 16px;
        }

        .share-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--browser-window-text-muted, var(--_bw-text-muted));
          transition: all 150ms ease;
          border-radius: 4px;
        }

        .share-button:hover {
          color: var(--browser-window-text-color, var(--_bw-text-color));
          background: var(--browser-window-hover-bg, var(--_bw-hover-bg));
        }

        .share-button:active {
          transform: scale(0.95);
        }

        .share-button.active {
          color: var(--browser-window-accent-color);
          background: var(--browser-window-active-bg);
        }

        /* Responsive: narrow screens */
        @media (max-width: 480px) {
          .browser-header {
            padding: 0.5rem 0.75rem;
            gap: 0.5rem;
          }

          .url-bar {
            padding: 0.25rem 0.5rem;
            font-size: 0.75rem;
          }

          .url-text {
            max-width: 120px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .view-source-button svg,
          .share-button svg {
            width: 14px;
            height: 14px;
          }
        }

        /* Very narrow: hide URL text */
        @media (max-width: 320px) {
          .url-text {
            display: none;
          }

          .lock-icon {
            display: none;
          }
        }

        /* Touch devices: 44px targets that shrink, down to 24px, before the toolbar would clip */
        @media (pointer: coarse) {
          .view-source-button,
          .share-container,
          .download-button {
            flex: 0 1 44px;
            min-width: 24px;
          }

          .share-container {
            display: flex;
          }

          .view-source-button,
          .share-button,
          .download-button {
            padding: 0.5rem 0;
            min-height: 44px;
          }

          .share-button {
            flex: 1;
          }

          .share-menu-item {
            padding: 0.875rem 1rem;
          }
        }
    `;
  }
  _browserChrome() {
    return `
      <div class="browser-header" part="header" role="toolbar" aria-label="Window controls">
        <div class="controls">
          <button class="control-button close" aria-label="Close window" tabindex="0"></button>
          <button class="control-button minimize" aria-label="Minimize window" tabindex="0"></button>
          <button class="control-button maximize" aria-label="${this.isMaximized ? "Restore window" : "Maximize window"}" aria-expanded="${this.isMaximized}" tabindex="0"></button>
        </div>
        <div class="url-bar">
          ${this.url.startsWith("https") ? '<span class="lock-icon">🔒</span>' : ""}
          <span class="url-text" title="${this._escapeHtml(this.url)}">${this._escapeHtml(this.browserTitle)}</span>
          ${this.src ? `
            <button class="view-source-button" title="View source code">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="4,6 2,8 4,10"/>
                <polyline points="12,6 14,8 12,10"/>
                <line x1="10" y1="4" x2="6" y2="12"/>
              </svg>
            </button>
            <div class="share-container">
              <button class="share-button" title="Share demo">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M8 12V3M8 3L5 6M8 3l3 3"/>
                  <path d="M3 9v4a1 1 0 001 1h8a1 1 0 001-1V9"/>
                </svg>
              </button>
              <div class="share-menu">
                ${navigator.share ? `
                  <button class="share-menu-item" data-action="share">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="4" r="2"/>
                      <circle cx="4" cy="8" r="2"/>
                      <circle cx="12" cy="12" r="2"/>
                      <path d="M6 9l4 2M6 7l4-2"/>
                    </svg>
                    Share...
                  </button>
                ` : ""}
                <button class="share-menu-item" data-action="codepen">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 0L0 5v6l8 5 8-5V5L8 0zM7 10.5L2 7.5v-2l5 3v2zm1-3l-5-3L8 2l5 2.5-5 3zm1 3v-2l5-3v2l-5 3z"/>
                  </svg>
                  Open in CodePen
                </button>
              </div>
            </div>
            <a href="${this._escapeHtml(this.src)}" download class="download-button" title="Download demo HTML file">
              <svg class="download-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M8 1v10M8 11l-3-3M8 11l3-3"/>
                <path d="M2 12v2a1 1 0 001 1h10a1 1 0 001-1v-2"/>
              </svg>
            </a>
          ` : ""}
        </div>
      </div>
    `;
  }
  _contentHTML() {
    return `
      <div class="browser-content" part="content">
        ${this.src ? `<iframe src="${this._escapeHtml(this.src)}" loading="lazy"${this._iframeAttrs()}></iframe>` : "<slot></slot>"}
      </div>
    `;
  }
  // --- Device mode ---
  _deviceCSS(e) {
    const t = this.getAttribute("orientation") === "landscape", r = this._getEffectiveDimensions(e), [i, s, d, n] = this._getEffectiveSafeInsets(e), c = O[e.notch] || 24, a = e.homeIndicator && !e.homeButton ? D : 0, w = e.homeButton ? k : 0, b = e.notch !== "none";
    return `
        :host([device]) {
          --device-width: ${r.width}px;
          --device-height: ${r.height}px;
          --device-bezel: ${e.bezel}px;
          --device-corner-radius: ${e.cornerRadius}px;
          --status-bar-height: ${t && b ? 24 : c}px;
          --home-indicator-height: ${a}px;
          --home-button-area: ${w}px;
          --safe-top: ${i}px;
          --safe-right: ${s}px;
          --safe-bottom: ${d}px;
          --safe-left: ${n}px;

          border: none;
          border-radius: 0;
          resize: none;
          overflow: visible;
          background: transparent;
          box-shadow: none;
          min-width: 0;
          min-height: 0;
        }

        .device-wrapper {
          display: flex;
          justify-content: center;
          overflow: hidden;
          width: 100%;
        }

        .device-frame {
          display: flex;
          flex-direction: column;
          width: var(--device-width);
          height: var(--device-height);
          padding: var(--device-bezel);
          border: none;
          box-sizing: content-box;
          border-radius: var(--device-corner-radius);
          overflow: hidden;
          position: relative;
          background: var(--browser-window-bezel-color);
          flex-shrink: 0;
          transform-origin: top center;
          box-shadow: none;
        }

        .device-frame.home-button {
          padding-bottom: var(--home-button-area);
        }

        /* Landscape with notch: horizontal layout */
        .device-frame.landscape.dynamic-island,
        .device-frame.landscape.punch-hole {
          flex-direction: row;
        }

        .device-main {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-width: 0;
          overflow: hidden;
        }

        /* Notch sidebar (landscape phones with notch) */
        .notch-sidebar {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          position: relative;
        }

        .notch-sidebar.dynamic-island {
          width: 59px;
        }

        .notch-sidebar.dynamic-island::before {
          content: '';
          width: 37px;
          height: 126px;
          background: var(--browser-window-bezel-color);
          border-radius: 19px;
        }

        .notch-sidebar.punch-hole {
          width: 48px;
        }

        .notch-sidebar.punch-hole::before {
          content: '';
          width: 12px;
          height: 12px;
          background: var(--browser-window-bezel-color);
          border-radius: 50%;
        }

        /* Status bar */
        .status-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 16px;
          height: var(--status-bar-height);
          position: relative;
          color: var(--browser-window-status-bar-color, rgba(255,255,255,0.9));
          font-size: 14px;
          font-weight: 600;
          flex-shrink: 0;
          z-index: 1;
          background: transparent;
        }

        .status-bar.dynamic-island {
          padding-top: 14px;
        }

        /* Dynamic Island pill (portrait only) */
        .status-bar.dynamic-island::before {
          content: '';
          position: absolute;
          top: 12px;
          left: 50%;
          transform: translateX(-50%);
          width: 126px;
          height: 37px;
          background: var(--browser-window-bezel-color);
          border-radius: 19px;
        }

        /* Punch-hole camera (portrait only) */
        .status-bar.punch-hole::before {
          content: '';
          position: absolute;
          top: 10px;
          left: 50%;
          transform: translateX(-50%);
          width: 12px;
          height: 12px;
          background: var(--browser-window-bezel-color);
          border-radius: 50%;
        }

        /* Home button (iPhone SE) */
        .device-frame.home-button::after {
          content: '';
          position: absolute;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          width: 58px;
          height: 58px;
          border: 3px solid rgba(255, 255, 255, 0.15);
          border-radius: 50%;
          z-index: 1;
        }

        /* Home indicator pill */
        .home-indicator {
          display: flex;
          justify-content: center;
          align-items: center;
          height: var(--home-indicator-height);
          flex-shrink: 0;
        }

        .home-indicator-pill {
          width: 134px;
          height: 5px;
          background: var(--browser-window-home-indicator-color, rgba(255,255,255,0.3));
          border-radius: 3px;
        }

        /* Device mode content area */
        :host([device]) .browser-content {
          flex: 1;
          min-height: 0;
          overflow: hidden;
          background: var(--browser-window-content-bg, var(--_bw-content-bg));
        }

        :host([device]) .browser-content iframe {
          width: 100%;
          height: 100%;
          min-height: 0;
        }

        /* Status bar icons */
        .status-time {
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.5px;
          position: relative;
          z-index: 1;
        }

        .status-icons {
          display: flex;
          align-items: center;
          gap: 6px;
          position: relative;
          z-index: 1;
        }

        .signal-bars {
          display: inline-flex;
          align-items: flex-end;
          gap: 1px;
          height: 12px;
        }

        .signal-bars span {
          display: inline-block;
          width: 3px;
          background: currentColor;
          border-radius: 1px;
        }

        .signal-bars span:nth-child(1) { height: 4px; }
        .signal-bars span:nth-child(2) { height: 6px; }
        .signal-bars span:nth-child(3) { height: 8px; }
        .signal-bars span:nth-child(4) { height: 10px; }

        /* Wifi icon - dot with two arcs */
        .wifi-icon {
          display: inline-block;
          width: 3px;
          height: 3px;
          background: currentColor;
          border-radius: 50%;
          position: relative;
          margin: 0 5px;
          vertical-align: middle;
        }

        .wifi-icon::before {
          content: '';
          position: absolute;
          bottom: 3px;
          left: 50%;
          transform: translateX(-50%);
          width: 9px;
          height: 9px;
          border: 1.5px solid currentColor;
          border-color: currentColor transparent transparent;
          border-radius: 50%;
        }

        .wifi-icon::after {
          content: '';
          position: absolute;
          bottom: 6px;
          left: 50%;
          transform: translateX(-50%);
          width: 15px;
          height: 15px;
          border: 1.5px solid currentColor;
          border-color: currentColor transparent transparent;
          border-radius: 50%;
        }

        /* Battery icon */
        .battery-icon {
          display: inline-block;
          width: 22px;
          height: 10px;
          border: 1.5px solid currentColor;
          border-radius: 2px;
          position: relative;
          vertical-align: middle;
        }

        .battery-icon::before {
          /* Battery fill */
          content: '';
          position: absolute;
          top: 1.5px;
          left: 1.5px;
          right: 1.5px;
          bottom: 1.5px;
          background: currentColor;
          border-radius: 0.5px;
        }

        .battery-icon::after {
          /* Battery cap */
          content: '';
          position: absolute;
          right: -4px;
          top: 50%;
          transform: translateY(-50%);
          width: 2px;
          height: 5px;
          background: currentColor;
          border-radius: 0 1px 1px 0;
        }

        /* Light bezel: dark status bar text */
        .device-frame.light-bezel .status-bar {
          color: rgba(0, 0, 0, 0.8);
        }

        .device-frame.light-bezel .home-indicator-pill {
          background: rgba(0, 0, 0, 0.3);
        }

        .device-frame.light-bezel.home-button::after {
          border-color: rgba(0, 0, 0, 0.15);
        }

        /* Dark mode in device mode */
        :host([device][mode="dark"]) .browser-content,
        :host([device][data-page-mode="dark"]:not([mode])) .browser-content {
          background: #000000;
        }

        :host([device][mode="dark"]) .device-frame,
        :host([device][data-page-mode="dark"]:not([mode])) .device-frame {
          outline: 1px solid rgba(255, 255, 255, 0.12);
          outline-offset: -1px;
        }

        @media (prefers-color-scheme: dark) {
          :host([device]:not([mode])) .device-frame {
            outline: 1px solid rgba(255, 255, 255, 0.12);
            outline-offset: -1px;
          }
        }

        /* Safe area overlays */
        .safe-area-overlays {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: var(--home-button-area);
          pointer-events: none;
          z-index: 3;
        }

        .safe-area-overlay {
          position: absolute;
          background: var(--browser-window-safe-area-color, oklch(0.65 0.2 250 / 0.25));
        }

        .safe-area-top {
          top: 0;
          left: 0;
          right: 0;
          height: var(--safe-top);
        }

        .safe-area-right {
          top: 0;
          right: 0;
          bottom: 0;
          width: var(--safe-right);
        }

        .safe-area-bottom {
          bottom: 0;
          left: 0;
          right: 0;
          height: var(--safe-bottom);
        }

        .safe-area-left {
          top: 0;
          left: 0;
          bottom: 0;
          width: var(--safe-left);
        }

        .device-toolbar {
          display: inline-flex;
          align-items: center;
          align-self: center;
          gap: 2px;
          padding: 3px;
          margin-top: 0.5rem;
          border-radius: var(--browser-window-border-radius);
          background: var(--browser-window-header-bg, var(--_bw-header-bg));
          border: 1px solid var(--browser-window-border-color, var(--_bw-border-color));
        }

        .device-toolbar .view-source-button,
        .device-toolbar .share-button,
        .device-toolbar .download-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          padding: 0;
          background: none;
          border: none;
          border-radius: 50%;
          color: var(--browser-window-text-muted, var(--_bw-text-muted));
          cursor: pointer;
          text-decoration: none;
          transition: all 150ms ease;
        }

        .device-toolbar .view-source-button:hover,
        .device-toolbar .share-button:hover,
        .device-toolbar .download-button:hover {
          background: var(--browser-window-hover-bg, var(--_bw-hover-bg));
          color: var(--browser-window-text-color, var(--_bw-text-color));
        }

        .device-toolbar .view-source-button.active {
          background: var(--browser-window-accent-color, #2563eb);
          color: white;
        }

        .device-toolbar .share-container {
          position: relative;
        }

        .device-toolbar .share-menu {
          bottom: calc(100% + 6px);
          top: auto;
          right: 50%;
          transform: translateX(50%);
        }

        .device-toolbar svg {
          width: 16px;
          height: 16px;
        }
    `;
  }
  _deviceChrome(e) {
    const t = this.getAttribute("orientation") === "landscape", r = e.notch !== "none", i = r ? e.notch : "", s = e.homeButton ? "home-button" : "", n = ["silver", "gold", "white"].includes(this.deviceColor) ? "light-bezel" : "", a = ["device-frame", i, s, n, t ? "landscape" : ""].filter(Boolean).join(" "), b = `
      <div class="status-bar ${t && r ? "" : i}">
        <span class="status-time">9:41</span>
        <div class="status-icons">
          <span class="signal-bars" aria-hidden="true"><span></span><span></span><span></span><span></span></span>
          <span class="wifi-icon" aria-hidden="true"></span>
          <span class="battery-icon" aria-hidden="true"></span>
        </div>
      </div>
    `, p = e.homeIndicator && !e.homeButton ? '<div class="home-indicator"><div class="home-indicator-pill"></div></div>' : "", g = this.hasAttribute("show-safe-areas") ? `<div class="safe-area-overlays">
          <div class="safe-area-overlay safe-area-top"></div>
          <div class="safe-area-overlay safe-area-right"></div>
          <div class="safe-area-overlay safe-area-bottom"></div>
          <div class="safe-area-overlay safe-area-left"></div>
        </div>` : "", x = this._deviceToolbar();
    return t && r ? `
        <div class="device-wrapper">
          <div class="${a}">
            <div class="notch-sidebar ${i}"></div>
            <div class="device-main">
              ${b}
              ${this._contentHTML()}
              ${p}
            </div>
            ${g}
          </div>
        </div>
        ${x}
      ` : `
      <div class="device-wrapper">
        <div class="${a}">
          ${b}
          ${this._contentHTML()}
          ${p}
          ${g}
        </div>
      </div>
      ${x}
    `;
  }
  _deviceToolbar() {
    return this.src ? `
      <div class="device-toolbar">
        <button class="view-source-button" title="View source code">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="4,6 2,8 4,10"/>
            <polyline points="12,6 14,8 12,10"/>
            <line x1="10" y1="4" x2="6" y2="12"/>
          </svg>
        </button>
        <div class="share-container">
          <button class="share-button" title="Share demo">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M8 12V3M8 3L5 6M8 3l3 3"/>
              <path d="M3 9v4a1 1 0 001 1h8a1 1 0 001-1V9"/>
            </svg>
          </button>
          <div class="share-menu">
            ${navigator.share ? `
              <button class="share-menu-item" data-action="share">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="4" r="2"/>
                  <circle cx="4" cy="8" r="2"/>
                  <circle cx="12" cy="12" r="2"/>
                  <path d="M6 9l4 2M6 7l4-2"/>
                </svg>
                Share...
              </button>
            ` : ""}
            <button class="share-menu-item" data-action="codepen">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0L0 5v6l8 5 8-5V5L8 0zM7 10.5L2 7.5v-2l5 3v2zm1-3l-5-3L8 2l5 2.5-5 3zm1 3v-2l5-3v2l-5 3z"/>
              </svg>
              Open in CodePen
            </button>
          </div>
        </div>
        <a href="${this._escapeHtml(this.src)}" download class="download-button" title="Download demo HTML file">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M8 1v10M8 11l-3-3M8 11l3-3"/>
            <path d="M2 12v2a1 1 0 001 1h10a1 1 0 001-1v-2"/>
          </svg>
        </a>
      </div>
    ` : "";
  }
  // --- Device scaling ---
  _setupDeviceScaling() {
    this._resizeObserver || (this._resizeObserver = new ResizeObserver(() => this._updateDeviceScale()), this._resizeObserver.observe(this));
  }
  _updateDeviceScale() {
    const e = this._getDevicePreset();
    if (!e) return;
    const t = this.shadowRoot.querySelector(".device-wrapper"), r = this.shadowRoot.querySelector(".device-frame");
    if (!t || !r) return;
    const i = this.clientWidth;
    if (i === 0) return;
    const s = this._getEffectiveDimensions(e), d = s.width + e.bezel * 2, n = Math.max(0.5, Math.min(1, i / d));
    this._currentScale = n, r.style.transform = `scale(${n})`;
    const c = e.homeButton ? k : 0, a = s.height + e.bezel * 2 + c;
    t.style.height = `${a * n}px`;
  }
  _teardownDeviceScaling() {
    this._resizeObserver && (this._resizeObserver.disconnect(), this._resizeObserver = null), this._currentScale = 1;
  }
  _escapeHtml(e) {
    const t = document.createElement("div");
    return t.textContent = e, t.innerHTML.replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
}
customElements.get("browser-window") || customElements.define("browser-window", H);
export {
  H as BrowserWindow
};
