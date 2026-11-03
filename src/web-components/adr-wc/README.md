---
title: "ADR Record Specification"
component: adr-wc
version: 1.0.0
status: stable
---

# ADR Record (`<adr-wc>`)

MADR-format Architectural Decision Record card with status tracking and cross-referencing.

## Purpose

Renders architectural decisions in a structured card format following the MADR (Markdown Architectural Decision Records) convention. Each card displays the decision context, the decision itself, and its consequences. ADR cards can be chained together via `supersedes` and `superseded-by` attributes to show decision evolution over time.

Part of the **UX Planning Pack**. Works standalone or inside `<kanban-board>`, `<story-map>`, or layout primitives.

## Static HTML Form

```html
<adr-wc
  adr-id="ADR-001"
  status="accepted"
  superseded-by="ADR-003">
  <h2 slot="title">Use PostgreSQL for persistence</h2>
  <time slot="date" datetime="2026-01-15">January 15, 2026</time>
  <p slot="context">We need a relational database for complex queries.</p>
  <p slot="decision">Use PostgreSQL 16 with pgvector extension.</p>
  <ul slot="consequences">
    <li>Good: mature ecosystem, strong SQL support</li>
    <li>Bad: operational overhead vs managed NoSQL</li>
  </ul>
</adr-wc>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `adr-id` | string | -- | ADR identifier (e.g., ADR-001); sets the HTML id on first connect when none is set |
| `status` | `proposed`, `accepted`, `deprecated`, `superseded` | `"proposed"` | Decision status |
| `supersedes` | string | -- | Comma-separated ADR IDs this supersedes |
| `superseded-by` | string | -- | Comma-separated ADR IDs that supersede this |
| `detail` | `full`, `compact`, `minimal` | `"full"` | Detail level. minimal shows id, status and title only. |
| `compact` | boolean | -- | Alias for detail=compact |
| `src` | string | -- | URL of a JSON ADR record. Fetched once per value; a newer value aborts the older request. A YYYY-MM-DD date is shown as that calendar day in every time zone. |

## Slots

| Slot | Description |
|------|-------------|
| `title` | Decision heading (e.g., `<h2>`) |
| `date` | Decision date (e.g., `<time datetime="...">`) |
| `context` | Why the decision was needed |
| `decision` | What was decided |
| `consequences` | Outcomes (positive and negative) |

## Events

| Event | Detail | When |
|-------|--------|------|
| `adr-wc:ready` | `{ adrId, title, status }` | Once per element, after the first render at any detail level. With src, after the fetched data renders (not fired if the fetch fails). Not re-fired by attribute changes or moves. |
| `adr-wc:upgraded` | -- | Once, in a microtask after first connect. Wait for this before assigning .data from a framework. |
| `adr-wc:data-changed` | `{ data, source: 'property' }` | After .data is assigned |

## Status Colors

| Status | Color | Use Case |
|--------|-------|----------|
| `proposed` | Blue (#3b82f6) | Decision under discussion |
| `accepted` | Green (#22c55e) | Decision approved and active |
| `deprecated` | Amber (#f59e0b) | Decision no longer recommended |
| `superseded` | Gray (#6b7280) | Replaced by a newer decision |

## Cross-References

- `supersedes` links to older ADR elements via fragment anchors
- `superseded-by` links to newer ADR elements via fragment anchors
- `adr-id` is auto-set as the HTML `id` for inbound cross-referencing
