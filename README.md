# @profpowell/vb-project-planning

Project- and UX-planning Web Components for the research, planning, and delivery phases of software projects. These are specialized components you might use in a home spun SWE dashboard or planning system.  They can be used individually or together and are related with [Vanilla Breeze](https://github.com/ProfPowell/vanilla-breeze) and work well with that package's **design tokens** (CSS custom properties), but carry their own logic.

## Component Inventory

| Tag | Purpose |
|-----|---------|
| `<user-persona>` | Persona card |
| `<user-story>` | User story card |
| `<user-journey>` | Journey map with stages and emotion curve |
| `<empathy-map>` | Says / thinks / does / feels quadrants |
| `<impact-effort>` | Impact vs. effort prioritization matrix |
| `<quadrant-grid>` | Generic 2×2 quadrant plotting surface |
| `<risk-register>` | Risk log with likelihood/impact |
| `<traceability-matrix>` | Requirement ↔ artifact traceability grid |
| `<burndown-chart>` | Sprint/release burndown |
| `<product-roadmap>` | Time-phased roadmap |
| `<kanban-board>` | Kanban board with drag-to-reorder |
| `<story-map>` | User-story map |
| `<review-surface>` | Annotated review/feedback surface |
| `<gantt-chart>` | Gantt schedule |
| `<work-item>` | Work-item card |
| `<adr-wc>` | Architecture Decision Record |

## Install

```bash
npm install @profpowell/vb-project-planning
```

Or load from a CDN (after publish):

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

## Peer: `<drag-surface>`

The drag-to-reorder components (`kanban-board`, `quadrant-grid`, `impact-effort`, `story-map`) use Vanilla Breeze's `<drag-surface>` element as a runtime peer. It ships with Vanilla Breeze core — load VB on the page and dragging works. Without it, these components still render and function; only drag-reordering is unavailable.

## Design-token contract

These components are **token-driven**: they read Vanilla Breeze CSS custom properties (`--color-*`, `--font-*`, `--size-*`, …) from the host page and inherit the active theme automatically. No build-time coupling — load VB's token/theme CSS (or compatible tokens) and the components adopt it.

```html
<link rel="stylesheet" href="https://unpkg.com/vanilla-breeze/dist/cdn/vanilla-breeze.css">
```

`vanilla-breeze` is declared as an **optional peer dependency**: required if you want VB to supply tokens/themes and the `<drag-surface>` peer (most consumers do).

## Relationship to Vanilla Breeze

This package was decomposed out of `vanilla-breeze` core so that framework stays focused on general site-building primitives while planning tooling versions independently. General components that were grouped with the planning pack but belong on any site (`diagram-wc`, `flow-diagram`, `glossary-wc`, the `<site-map>` IA tree) remain in VB core.  When building a planning system you may want to explore the main library for more general UI controls.

## Development

```bash
npm run build   # bundle dist/ (esm + minified, js + css) via esbuild
```

Note the demo site depends on `vanilla-breeze` for tokens/themes and the `<drag-surface>` peer, and import this package directly.

## License

MIT © Thomas A. Powell
