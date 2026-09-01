# Changelog

All notable changes to `@profpowell/vb-project-planning` are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and
the project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
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
- `vanilla-breeze` optional peer dependency floor raised from `>=0.1.0` to
  `>=0.3.0`. Earlier Vanilla Breeze releases still registered these same
  custom elements in core, so loading both would raise duplicate-definition
  errors; 0.3.0 is the first "slimmed core" without them.
- Docs site re-vendored against vanilla-breeze 0.3.1 (was 0.3.0). Dropped a
  stale, unreferenced `chart-wc.js` from the published vendor assets.

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

[Unreleased]: https://github.com/ProfPowell/vb-project-planning/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/ProfPowell/vb-project-planning/releases/tag/v0.1.0
