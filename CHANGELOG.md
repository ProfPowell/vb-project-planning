# Changelog

All notable changes to `@profpowell/vb-project-planning` are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and
the project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

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

[Unreleased]: https://github.com/ProfPowell/vb-project-planning/compare/v0.2.1...HEAD
[0.2.1]: https://github.com/ProfPowell/vb-project-planning/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/ProfPowell/vb-project-planning/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/ProfPowell/vb-project-planning/releases/tag/v0.1.0
