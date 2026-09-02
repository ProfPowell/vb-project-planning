# @profpowell/vb-project-planning

Project- and UX-planning Web Components for the research, planning, and delivery phases of software projects. These are specialized components you might use in a home spun SWE dashboard or planning system.  They can be used individually or together and are related with [Vanilla Breeze](https://github.com/ProfPowell/vanilla-breeze) and work well with that package's **design tokens** (CSS custom properties), but carry their own logic.

**Docs & live demos:** <https://profpowell.github.io/vb-project-planning/>

## Component Inventory

| Tag | Purpose |
|-----|---------|
| `<adr-wc>` | Architecture Decision Record |
| `<burndown-chart>` | Sprint/release burndown |
| `<capacity-plan>` | Capacity ledger: capacity − quality − features = slack |
| `<empathy-map>` | Says / thinks / does / feels quadrants |
| `<gantt-chart>` | Gantt schedule |
| `<impact-effort>` | Impact vs. effort prioritization matrix |
| `<iron-triangle>` | Scope / time / cost project-shape constraint surface |
| `<kanban-board>` | Kanban board with drag-to-reorder |
| `<product-roadmap>` | Time-phased roadmap |
| `<quadrant-grid>` | Generic 2×2 quadrant plotting surface |
| `<quality-target>` | Quality-attribute prioritization radar |
| `<requirement-card>` | Single NFR ("ility") card |
| `<review-surface>` | Annotated review/feedback surface |
| `<risk-register>` | Risk log with likelihood/impact |
| `<story-map>` | User-story map |
| `<traceability-matrix>` | Requirement ↔ artifact traceability grid |
| `<user-journey>` | Journey map with stages and emotion curve |
| `<user-persona>` | Persona card |
| `<user-story>` | User story card |
| `<work-item>` | Work-item card |

## Install

```bash
npm install @profpowell/vb-project-planning
```

Or load from a CDN:

```html
<script type="module" src="https://unpkg.com/@profpowell/vb-project-planning/dist/vb-project-planning.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@profpowell/vb-project-planning/dist/vb-project-planning.min.css">
```

## Usage

Register everything via the barrel, and load the component styles:

```js
import '@profpowell/vb-project-planning';        // registers all elements
import '@profpowell/vb-project-planning/css';     // light-DOM component styles
```

Or pull a single component (tree-shake friendly):

```js
import '@profpowell/vb-project-planning/kanban-board';
```

```html
<kanban-board>…</kanban-board>
<user-persona name="Fred" role="Engineer">…</user-persona>
```

## Runtime peers: `<drag-surface>` and `<data-table>`

Two Vanilla Breeze core elements are used as runtime peers. Load VB on the page (the full bundle, or the per-component files under `dist/cdn/components/`) and they light up; without them the components still render, only the composed behaviour is unavailable.

- `<drag-surface>` — the drag-to-reorder components (`kanban-board`, `quadrant-grid`, `impact-effort`, `story-map`). Without it, drag-reordering is off.
- `<data-table>` — `risk-register` and `traceability-matrix` compose it for the severity rollup, heatmap, and sortable headers. Without it, the plain table renders but those features are inert.

## Design-token contract

These components are **token-driven**: they read Vanilla Breeze CSS custom properties (`--color-*`, `--font-*`, `--size-*`, …) from the host page and inherit the active theme automatically. No build-time coupling — load VB's token/theme CSS (or compatible tokens) and the components adopt it.

```html
<link rel="stylesheet" href="https://unpkg.com/vanilla-breeze/dist/cdn/vanilla-breeze.css">
```

`vanilla-breeze` is declared as an **optional peer dependency**: required if you want VB to supply tokens/themes and the `<drag-surface>` / `<data-table>` peers (most consumers do).

## Relationship to Vanilla Breeze

This package was decomposed out of `vanilla-breeze` core so that framework stays focused on general site-building primitives while planning tooling versions independently. General components that were grouped with the planning pack but belong on any site (`diagram-wc`, `flow-diagram`, `glossary-wc`, the `<site-map>` IA tree) remain in VB core.  When building a planning system you may want to explore the main library for more general UI controls.

## Development

```bash
npm run build   # bundle dist/ (esm + minified, js + css) via esbuild
npm test        # Playwright component specs (serves the built docs/ on :4331)
```

`dist/` is committed: it is what the npm tarball ships and what the docs site vendors. CI fails if `src/` changes without a rebuilt `dist/`.

The docs site lives in `site/` (CookSSG, styled by Vanilla Breeze) and depends on `vanilla-breeze` for tokens/themes and the `<drag-surface>` / `<data-table>` peers. It imports this package's `dist/` directly.

```bash
cd site && npm ci && npm run dev                  # local preview
cd site && npm run build && node scripts/publish-docs.js /vb-project-planning   # regenerate docs/
```

GitHub Pages serves the committed `docs/` folder. The **Publish docs** workflow regenerates and commits it automatically when `site/` or `dist/` change on `main`.

### Releasing

```bash
npm version minor        # bumps package.json and tags vX.Y.Z
git push --follow-tags
```

The **Release** workflow builds, runs the tests, publishes to npm with provenance, and creates a GitHub release from the matching `CHANGELOG.md` section. It needs an `NPM_TOKEN` repository secret.

## License

MIT © Thomas A. Powell
