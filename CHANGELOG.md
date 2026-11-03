# Changelog

All notable changes to `@profpowell/vb-project-planning` are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and
the project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [0.3.0] - 2026-11-03

An accessibility release. A full axe-core audit (WCAG 2.2 AA + best practice)
of every docs page and demo now passes for this package's components and site
markup, in light and dark mode, and stays enforced by new specs. Clears the
known limitations from 0.2.3. Breaking changes are listed first.

### Breaking
- `user-persona`: the job-title attribute is now `job-title` (property
  `jobTitle`, `.data.jobTitle`). The old `role` attribute collided with ARIA
  `role` and gave every persona an invalid ARIA role. Legacy markup still
  works for 0.3.x: a non-ARIA `role` value is moved to `job-title`, the `role`
  attribute is removed from the host, and a one-time console warning is shown.
  `.data` now returns `jobTitle`; JSON `role` is still accepted.
- Badge, chip and avatar colours changed to meet WCAG AA (user-story,
  work-item, adr-wc, user-journey, empathy-map, requirement-card).
  `hashColor()` now returns `oklch(48% 0.13 h)` (also used by review-surface
  avatars). Badges set a `--_hue` custom property instead of inline
  `color`/`background`.
- `product-roadmap`: bars are `<div role="button">` instead of `<article>`;
  their accessible name is "Title, Status — dates in Lane".
- `kanban-board`: column headings follow the page outline instead of always
  being `<h3>` (style hook `.kb-column-heading`; CSS aimed at
  `.kb-column-header h3` needs updating). Untitled boards are named
  "Kanban board", "Kanban board 2", …
- `story-map`: activity headings follow the page outline (style hook
  `.sm-activity-heading` instead of `.sm-activity-header h3`).
- Board surfaces (`<drag-surface>` in kanban-board, story-map, impact-effort,
  quadrant-grid) become a labelled `role="group"` when their cards are
  `<article>` or the column is empty, and VB's status region now sits after
  the surface instead of inside it.
- `traceability-matrix`: the table is a `role="grid"` with a single Tab stop
  (see Accessibility).
- `requirement-card`: "not relevant" no longer dims the card with opacity; it
  uses a dashed border and a muted name.

### Deprecated (removed in 0.4.0)
- `<user-persona role="…">` and `.data.role` input; `personaRole` getter; the
  ready detail's `role` field.
- Un-namespaced events, which still fire after their replacements:
  `persona-ready` → `user-persona:ready`, `story-ready` → `user-story:ready`,
  `journey-ready` → `user-journey:ready`, `status-changed` →
  `user-story:status-changed`, `priority-changed` →
  `user-story:priority-changed`.

### Accessibility
- `traceability-matrix`: WAI-ARIA grid keyboard model: one Tab stop, arrow
  keys between cells (including sortable headers), Home/End, Ctrl+Home/End,
  Enter/Space toggle highlight. Filtered rows are skipped.
- `copy-init`: announcements land inside the open modal dialog that contains
  the button (or the top-most modal), so they're heard while a dialog is open.
- Accessible names contain the visible text (WCAG 2.5.3) for iron-triangle's
  corners and centre, quality-target's axes and centre, and product-roadmap
  bars.
- Headings rendered by components never skip a level: kanban-board,
  story-map, user-story sections and burndown-chart's "Scope changes" take
  their level from the page outline, with a new `heading-level` attribute to
  override (`src/lib/headings.js`).
- Contrast fixes: roadmap bars and quadrant / risk pins keep white text at
  4.5:1; requirement-card pills and conflict notes; record-card badges,
  chips and avatars; user-journey's table corner.
- Valid list semantics on every board (no more `aria-required-children` /
  `aria-allowed-role` failures).

### Documentation
- Docs site passes axe in light and dark mode: labelled navigation toggle,
  24px sidebar targets, `<main>` landmarks and level-one headings on every
  demo, unique landmark names, AA-contrast syntax highlighting (code token
  colours mixed toward the text colour), every code example labelled.
- `heading-level` documented on kanban-board, story-map, user-story and
  burndown-chart.

### Internal
- New specs: `a11y-records`, `a11y-interactive`, `a11y-site`, `a11y-outline`
  (axe-core via `@axe-core/playwright`). Upstream exclusions are listed and
  commented in the specs: `@profpowell/browser-window` (iframe title,
  12px window controls) and vanilla-breeze `chart-wc` (focusable content in
  `aria-hidden`).
- `schemas/api.schema.json` requires `<element>:<event>` names again.
- 290 component specs (was 221) plus 95 unit checks.

### Upstream issues found (not fixable here)
- vanilla-breeze `<drag-surface>`: prepends its `role="status"` region inside
  its `role="list"`, sets `role="listitem"` on `<article>` children, and only
  applies roles/tabindex in `setup()`. This package works around it; the
  raw-VB recipe demos still show it.
- vanilla-breeze `code-block` mapping (`--cb-string/tag/number/meta` →
  `--color-accent`, 3.5:1), `chart-wc` `aria-hidden-focus`, the 8bit theme's
  `--cb-comment` (1.36:1), and `data-table` heat-map cells in dark mode.
- `@profpowell/browser-window`: iframes need a `title`, and the window
  controls a 24px hit area.

## [0.2.3] - 2026-11-03

### Fixed
- `gantt-chart`: the visually hidden screen-reader table made pages scroll
  sideways on phones (a table ignores `width: 1px`; it now uses
  `table-layout: fixed`).
- `risk-register`: the table scrolls inside its own box on narrow screens
  instead of pushing the page sideways.
- `traceability-matrix`: same for wide matrices.
- Interrupted view transitions (a re-render during another re-render, or a
  viewport resize mid-transition) no longer throw uncaught "Transition was
  skipped/aborted" errors. Affects every component that re-renders through
  the shared view-transition helper.

### Documentation
- Docs site: removed links to vanilla-breeze.com's retired "UX Planning Pack"
  page (10 element pages); fixed the burndown page's intro, which a raw
  `<chart-wc>` in its description broke; replaced a burndown code sample that
  pointed at this site's `/cdn/` path with the real unpkg URLs; demo frames
  show their real address instead of `vanilla-breeze.dev`; the capacity-plan,
  quality-target and iron-triangle demos load VB's `<form-field>`; five
  working demos that nothing linked to (two full workflows, three recipes)
  are on the demos index; demo grids shrink to fit 320px phones.
- README: `<form-field>` and `<chart-wc>` documented as runtime peers.
- New `tests/components/docs-site.spec.js` crawls the built site and fails on
  console errors, failed requests, broken links or anchors, orphan pages,
  undefined scripted components, and sideways scrolling at phone width.

## [0.2.2] - 2026-11-03

A correctness, accessibility and documentation release covering every
component. Some fixes change observable behaviour; those are listed under
**Changed** so integrators can check them.

### Security
- Data from `src` JSON and from author markup is now escaped everywhere it is
  written into HTML. Script could run from crafted values in `user-journey`
  (story ids, persona id, phase emotion), `burndown-chart` (scope-change dates
  and the `unit` attribute), `work-item` (assignee initials), and
  `user-persona` (avatar URL inside an unquoted CSS `url()`). One shared
  escaper (`src/lib/escape.js`) replaces three divergent copies.

### Fixed
- `kanban-board`, `story-map`: `src` no longer re-fetches in an endless loop.
- `user-persona`, `user-story`, `user-journey`, `empathy-map`, `work-item`,
  `adr-wc`: one fetch per `src` value (it was two on every upgrade, with no
  ordering guarantee); newer values abort older requests.
- Moving any component in the DOM (for example dragging a card between
  kanban columns) keeps its content and state. It no longer re-fetches,
  re-fires `ready`, empties the board, or duplicates titles, wrappers and
  live regions. Affects kanban-board, story-map, impact-effort,
  quadrant-grid, gantt-chart, review-surface and the six record cards.
- Dates are calendar days in local time everywhere (`src/lib/dates.js`):
  `gantt-chart` and `adr-wc` no longer show the day before west of UTC;
  `burndown-chart` no longer repeats or drops a day across a DST change;
  gantt quarter ticks no longer slip a month for ranges starting on the 31st.
- `product-roadmap`: a click selects without rescheduling; end dates are
  inclusive (same-day and single-quarter initiatives no longer vanish);
  drags snap to the nearest period; cross-lane moves work (the old HTML5
  drag path could never fire `move`).
- `gantt-chart`: dependency arrows line up with `compact` and grouped rows;
  each chart has its own arrowhead marker; `.tasks` survives a move; `src`
  loads when set before connect; progress `75` means 75%, not 7500%.
- `risk-register`: Severity is computed as Likelihood × Impact. The table's
  product rollup multiplied every number in the row, so a title like "2FA
  rollout" or a mitigation like "3 vendor quotes" changed the score. Mid
  scores (3) now sit on the low side of the quadrant line.
- `review-surface`: pins survive a move and pre-connect `.pins`; Resolve and
  Reply work on pins loaded from `src` or `.pins`; a property-set adapter is
  no longer replaced.
- `kanban-board`, `story-map`, `impact-effort`: JSON-mode `<user-story>`
  cards get slotted content (they rendered empty). `.columns` keeps existing
  cards. impact-effort's `.items` getter reflects drags and HTML-authored
  cards are not duplicated by the first `.items` assignment.
- `story-map`: assigning `.activities` no longer stacks listeners (events
  fired N+1 times).
- `quadrant-grid`: clusters recompute after a drag; read-only pins no longer
  leave empty chips.
- `user-persona`: the `name` and `quote` attributes work; `src`/`.data`
  render bio, goals, frustrations and behaviors; a second `.data` updates.
- `empathy-map`: an edited quadrant no longer resurrects cleared slotted
  items; `closeQuadrant()` only acts on an open editor.
- `user-story`: each story has its own detail dialog, removed on close.
- `traceability-matrix`: links resolve via `story-id`/`item-id` (new
  `match-attr` picks one); rows and columns without ids can be highlighted;
  highlights are cleared when the matrix is removed.
- All `src` loading goes through one loader (`src/lib/src-loader.js`):
  superseded requests are aborted in every component (gantt-chart and
  review-surface kept downloading them), removing `src` mid-load renders the
  authored content instead of sticking on "Loading…", and a failed load is
  retried on reconnect.
- `empathy-map`: an open quadrant editor keeps its draft text and focus
  across re-renders, and starts from the slotted items when nothing is saved
  (Done could wipe authored items).
- `product-roadmap`: dragging or resizing an initiative that extends past the
  visible range keeps its off-screen dates.
- `user-story`: a persona link set by `src` or `.data` keeps tracking the
  persona's role.
- `kanban-board`: columns set before connect get a drag group, so keyboard
  moves between columns work.
- `impact-effort`: id-less items keep their card through drags and `.items`
  round-trips (keyed by label).

### Accessibility
- `review-surface`: pins are exposed as buttons (the overlay was
  `role="img"`, hiding them); focus moves into the popover and back; Escape
  works; announcements are no longer wiped by re-renders.
- Keyboard support: `product-roadmap` bars (select; in editable mode arrows
  move, Shift+arrows resize, Alt+Up/Down changes lane), `gantt-chart` bars
  (`role="button"`), `traceability-matrix` cells (buttons with
  `aria-pressed`), `user-story`'s minimal card (a real button with
  `aria-haspopup="dialog"`).
- Status is no longer colour-only in gantt-chart and product-roadmap.
- `quadrant-grid` DOM order matches the visual order (SWOT reads Strengths
  first).
- Live regions announce card and column labels, not generated ids.
- `user-persona`, `user-story`, `empathy-map` section titles are real
  headings; `empathy-map` returns focus to the edit button after Done/Escape.
- `work-item` and `adr-wc` minimal cards are no longer empty tab stops.
- `copy-init` announces through one body-level live region instead of
  changing the button's accessible name.

### Changed
- `copy-init`: the synthetic `copy` / `paste` CustomEvents are now
  `vb:copy` / `vb:paste` (native-named events broke page handlers reading
  `clipboardData`). **Breaking for listeners on the old names.**
- `*:ready` (and `persona-ready`, `story-ready`, `journey-ready`) fire once
  per element; attribute changes, later `src` loads and moves no longer
  re-fire them. A later `src` load reports through
  `kanban-board:items-changed`, `impact-effort:items-changed` and
  `story-map:activities-changed` with `source: 'src'`.
- `gantt-chart`: `.tasks` assigned before connect takes precedence over the
  initial `src`; assigning `.tasks` cancels a pending load.
- On boards, a minimal `<user-story>` is a single tab stop: Enter opens its
  details, Space grabs it for reordering.
- New `<tag>:upgraded` events on review-surface and the six record cards;
  `*:upgraded` fires on every connect for VBElement components (as before;
  the docs used to say once).
- `review-surface`: adapter `update(id, changes, pin)` receives the full pin
  and inserts it if missing; `.pins` set before connect wins over the
  adapter's first load.
- `risk-register`: the Severity `<th>` carries `data-severity` instead of
  `data-rollup`; severity cells carry `data-sort-value`; dots carry
  `data-quadrant`; dot coordinates use `(v-1)/4`.
- `traceability-matrix`: cells contain buttons.
- `gantt-chart`: bar role is `button`; `ready`'s `dateRange` is `YYYY-MM-DD`;
  assigning `.tasks` replaces the authored table with a generated one; an
  empty chart now upgrades.
- `product-roadmap`: bars are one day wider (inclusive end); drags write the
  inclusive end date; native `draggable` is gone.
- `burndown-chart`: `start`, `end`, `total`, `unit`, `label` and `weekends`
  re-render live.
- `quadrant-grid`: a pin dragged to another quadrant drops its coordinates
  and joins that quadrant's stack.
- `impact-effort`: entries read `{ id, quadrant, label }` (`text` still
  accepted).
- `user-story` minimal card is a `<button>`; its points badge reads "8 story
  points" to assistive tech.

### Removed
- Documented-but-nonexistent API: `title`/`summary` attributes on
  user-journey and empathy-map, `role`/`age`/`location` slots on
  user-persona, and the never-fired `risk-register:change` event.
- Dead code: `registerEffect` (and its load-time `matchMedia`),
  `portraitByIndex`, `defaultFormulaText`, quality-target's envelope and
  abbreviation helpers, and unused `_resolve()` / slot caches.

### Documentation
- Every component's `api.json` lists the events it dispatches; doc pages
  render attribute and event tables from it; broken examples fixed
  (story-map `.activities` shape, impact-effort `label`, review-surface's
  hanging `await …:upgraded` and percentage coordinates, adr-wc's README tag
  name).
- `schemas/api.schema.json` now exists, and a unit test checks every
  manifest against it and against the component's code.

### Internal
- Specs now test the freshly built `dist/` bundle (they silently used the
  bundle the last docs publish copied). `VB_TEST_PORT` allows parallel runs.
- CI and the release workflow run `npm run typecheck` (tsc over JSDoc) and
  unit tests in `America/Los_Angeles`.
- Shared helpers: `src/lib/dates.js`, `escape.js`, `hash.js`,
  `board-surface.js`, and a `UXShadowElement` base in `_ux-base.js`.
- 216 component specs (was 103) plus 95 unit checks; the suite passes
  three times in a row with parallel workers.
- `UXShadowElement` gains a protected `_attributeEffects()` hook, run after
  `.data` / `src` records are applied.
- Docs site: vanilla-breeze 0.5, cook-ssg 2.4, pagefind 1.6; the published
  Lucide icon set is pruned to referenced icons (docs/ 15 MB → 8 MB).
- @playwright/test 1.64, esbuild 0.28 (identical dist output).

## [0.2.1] - 2026-11-02

### Fixed
- `quality-target`: the hidden overrun prompt no longer holds a stale
  "over budget by -N points" string while under budget; it is empty until the
  selection is actually over, and reads "1 point" in the singular.
- `quality-target`: validity now reaches `ElementInternals`, so a parent
  `<form>`'s `checkValidity()` / submit is blocked while a Critical pick lacks
  its rationale or an over-budget selection lacks its overrun rationale (only
  the element's own `checkValidity()` reported it before).
- `quality-target`: `disabled` / `locked` now close the keyboard and
  programmatic paths too. Axes leave the tab order with `aria-disabled`,
  `openEditor()` is a no-op, the overrun textarea is disabled, and dialogs keep
  their disabled controls across re-renders.
- `quality-target`: generated ids are unique per instance, so several targets on
  one page keep their labels attached to the right controls. The overrun label
  and limits now follow later `data-min/max-overrun-rationale` changes.
- `iron-triangle`: `disabled` / `locked` now close the keyboard and
  programmatic editing paths too. Vertex targets leave the tab order with
  `aria-disabled`, `openEditor()` is a no-op, and dialogs built later are
  disabled as well (before, only mouse input and existing dialogs were off).
  Under `locked` the centre Quality target now keeps working by mouse and
  keyboard, so a read-only shape still leads to its quality decision;
  `disabled` turns it off along with everything else.
- `iron-triangle`: the centre target's accessible name said "Activate to open
  the NFR compass"; it now says "the quality decision".
- `requirement-card`: inside an `<a>` / `<button>` wrapper, the wrapper's
  keyboard activation now emits `requirement-card:click` (it never reached the
  card before). A card made focusable with `tabindex` gets `role="button"`
  unless the author set a role.

### Changed
- `iron-triangle`: the manual-capacity switch is now a quiet VB `ghost` button.
  When pressed it reads "Manual capacity: N pts" with an underline, and its
  accessible name starts with that visible text.

### Removed
- `quality-target`: the `data-show-envelope` attribute. It was documented but
  never did anything; the component has no envelope polygon.

### Documentation
- Reconciled the `quality-target`, `capacity-plan`, and `requirement-card`
  element pages with the shipped code. quality-target's "Capacity envelope"
  section is replaced by "Capacity budget" and adds form association, states,
  and tokens. capacity-plan no longer claims a `data-capacity-points`
  fallback and documents its states and event detail. requirement-card adds
  slots, properties, states, CSS parts, and tokens.
- Replaced leftover `<nfr-compass>` references with `<quality-target>`.
- The docs site now overlays each component's `api.json` onto
  `site/data/apiRegistry.js` at prebuild (`site/scripts/sync-api-registry.js`),
  so attribute and event tables stop drifting from the manifests.

## [0.2.0] - 2026-11-02

### Added
- `iron-triangle` accessibility hooks the docs promised but the SVG rewrite
  never shipped: a visually-hidden `<output aria-live="polite">` capacity
  readout, the formula / manual switch as a real `<button aria-pressed>` (which
  opens a manual-capacity dialog with Use formula / Cancel / Save), and a
  visible "Deadline has passed (date)" warning so the over-deadline state is
  never colour-only. `disabled` / `locked` also disable the switch.
- GitHub Actions: `CI` (build, dist-freshness check, Playwright component tests,
  docs-site build) on every push and pull request; `Publish docs` rebuilds and
  commits `docs/` when site sources or the pack bundle change; `Release`
  publishes to npm with provenance and creates a GitHub release on `v*` tags.
- Playwright specs for every component. Previously only kanban-board,
  gantt-chart, empathy-map, impact-effort, story-map, and user-journey were
  covered; adr-wc, burndown-chart, capacity-plan, iron-triangle,
  product-roadmap, quadrant-grid, quality-target, requirement-card,
  review-surface, risk-register, traceability-matrix, user-persona, user-story,
  and work-item now have data-API specs.
- `npm test` script alias for the Playwright suite.

### Changed
- `package.json` author corrected to Thomas A. Powell (0.1.0 was published under
  the wrong name).
- `iron-triangle` element docs reconciled with the shipped component: the
  stale Slots, JavaScript API, CSS Tokens, Static fallback, and Accessibility
  sections (which described an earlier fieldset-form design) now document the
  generated markup, real API, real tokens, and the new status strip.
- `vanilla-breeze` optional peer dependency floor raised from `>=0.1.0` to
  `>=0.3.0`. Earlier Vanilla Breeze releases still registered these same
  custom elements in core, so loading both would raise duplicate-definition
  errors; 0.3.0 is the first "slimmed core" without them.
- Docs site re-vendored against vanilla-breeze 0.4.1 (was 0.3.0). Dropped a
  stale, unreferenced `chart-wc.js` from the published vendor assets.
- README now documents `<data-table>` alongside `<drag-surface>` as a runtime
  peer; the risk-register and traceability-matrix demos load it.

### Fixed
- `product-roadmap`: declares `observedAttributes`, so changing `start`,
  `end`, `view`, `editable`, or `today-marker` on a live element re-renders.
  Previously the callback existed but was never invoked.
- `requirement-card`: the default priority pill is visible again when no
  `priority-pill` is slotted. The slot check counted fallback content as
  slotted content, so the pill was always hidden.
- `user-story`: the `showDetail()` dialog clone no longer re-derives the
  source element's `id`, and `user-persona.relatedStories()` ignores it, so
  an open dialog no longer duplicates ids or double-counts stories.
- `risk-register` / `traceability-matrix` demos: load the `<data-table>` peer,
  so the severity rollup, heatmap, and header sorting actually work on the
  docs site.

## [0.1.0] - 2026-07-06

Initial release, decomposed out of `vanilla-breeze` core.

### Added
- 20 light-DOM, token-driven Web Components: `adr-wc`, `burndown-chart`,
  `capacity-plan`, `empathy-map`, `gantt-chart`, `impact-effort`,
  `iron-triangle`, `kanban-board`, `product-roadmap`, `quadrant-grid`,
  `quality-target`, `requirement-card`, `review-surface`, `risk-register`,
  `story-map`, `traceability-matrix`, `user-journey`, `user-persona`,
  `user-story`, `work-item`.
- Barrel entry (`import '@profpowell/vb-project-planning'`), per-component
  subpath exports, and bundled `dist/` (ESM + minified JS and CSS).
- Documentation mini-site (CookSSG, styled by Vanilla Breeze) with element
  reference pages, 39 live demos, a sprint-board showcase, and Pagefind
  search, published at <https://profpowell.github.io/vb-project-planning/>.
- Playwright component test harness (`tests/serve-docs.mjs` on port 4331)
  with data-API specs for kanban-board, gantt-chart, and the UX-planning set.

### Fixed
- `gantt-chart` dependency arrows now render (an invalid `%` unit in the SVG
  path data was silently dropping them).

[Unreleased]: https://github.com/ProfPowell/vb-project-planning/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/ProfPowell/vb-project-planning/compare/v0.2.3...v0.3.0
[0.2.3]: https://github.com/ProfPowell/vb-project-planning/compare/v0.2.2...v0.2.3
[0.2.2]: https://github.com/ProfPowell/vb-project-planning/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/ProfPowell/vb-project-planning/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/ProfPowell/vb-project-planning/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/ProfPowell/vb-project-planning/releases/tag/v0.1.0
