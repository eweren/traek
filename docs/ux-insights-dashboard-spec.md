# UX Specification: Conversation Insights Dashboard

**Status:** Implemented
**Component:** `packages/svelte/src/lib/analytics/InsightsDashboard.svelte`
**Date:** 2026-03-08
**Author:** UX Expert Agent

---

## Overview

The Insights Dashboard is a modal overlay that provides deep analytics on a Traek conversation tree. It is opened by the host application (e.g. via a toolbar button) and receives a `ConversationSnapshot` as input. All computation is offloaded to `@traek/analytics`; the component is purely presentational.

---

## Design Goals

1. **Reveal spatial patterns** — make branch topology and heatmap data comprehensible at a glance
2. **Progressive disclosure** — high-level score on the Overview tab; detailed tables on deeper tabs
3. **Export-first mindset** — every piece of data can be downloaded in three formats
4. **Accessibility as default** — WCAG 2.1 AA throughout; keyboard-only navigation fully supported
5. **Theme-agnostic** — uses only `--traek-*` CSS custom properties; works in dark, light, and high-contrast themes

---

## Component API

```svelte
<InsightsDashboard
  snapshot={ConversationSnapshot}
  onClose={() => void}
/>
```

| Prop       | Type                   | Description                              |
|------------|------------------------|------------------------------------------|
| `snapshot` | `ConversationSnapshot` | The conversation to analyse              |
| `onClose`  | `() => void`           | Called when the user closes the dashboard |

---

## Layout Architecture

```
┌─────────────────────────────────────────────┐
│ ◎ Conversation Insights · "title"      [✕]  │  ← Header
├─────────────────────────────────────────────┤
│ ◎Overview ⌥Topology ◈Heatmap ⇌Flow ≡Content ↓Export │  ← Tab bar
├─────────────────────────────────────────────┤
│                                             │
│              [Panel content]                │  ← Scrollable panel
│                                             │
├─────────────────────────────────────────────┤
│ Generated at 10:42:00 · @traek/analytics    │  ← Footer
└─────────────────────────────────────────────┘
```

- **Dimensions:** `min(96vw, 900px)` × `min(88vh, 680px)`
- **Mobile (≤640px):** full-screen (100vw × 100dvh), labels hidden in tab bar, grid collapses to 1-column

---

## Tabs

### 1. Overview

**Purpose:** Quick at-a-glance summary — does not require scrolling for most conversations.

**Layout (2-column grid):**

| Cell | Content |
|------|---------|
| Top-left | Engagement score ring (SVG donut chart, animated on mount) + label |
| Top-right | 4×2 stat grid: node count, branches, max depth, avg response time, user turns, assistant turns, deep answers, code nodes |
| Bottom-left | Content-by-role horizontal bar (% of total characters) |
| Bottom-right (spans full width) | Key insights list — up to 6 contextual insights shown as pills |

**Engagement score ring:**
- SVG circle, 80×80px
- Animated via CSS `stroke-dashoffset` transition (600ms spring)
- Color: green `#22d3a0` (≥70), amber `#f59e0b` (40–69), red `#f87171` (<40)
- Reduced-motion: animation disabled

**Key insights logic:**

| Condition | Message | Style |
|-----------|---------|-------|
| `branchingRate > 0.2` | "High exploration rate — X% of nodes branch" | Positive (green) |
| `deepAnswerRate > 0.5` | "X% of assistant replies are in-depth" | Positive (green) |
| `codeNodeCount > 0` | "N code blocks detected" | Neutral |
| `hottestNodeId` present | "Hottest node: `abc123…`" | Neutral |
| `avgResponseTimeMs > 5000` | "Avg response time Xs — possibly slow model" | Warning (amber) |
| `uniqueTags` present | "Tags: tag1, tag2, +N more" | Neutral |

---

### 2. Topology

**Purpose:** Understand branch structure — which paths are long vs short, how much branching occurs.

**Components:**
- Summary metadata row (total nodes, branches, max depth, avg branching factor)
- Horizontal bar chart: top 12 branches by length, colour-coded by relative length via `heatColor()`
- Each row shows: branch label (B1–B12), proportional bar, node count, user/assistant turn pills, duration pill (if timestamp data available)
- Depth stats: 4 metric cards (max depth, avg depth, branching nodes, leaf nodes)

**Accessibility:**
- Bar chart wrapped in `role="img"` with descriptive `aria-label`
- Individual bars use `role="meter"` with `aria-valuenow/min/max`

---

### 3. Heatmap

**Purpose:** Identify which nodes are central junctions (hot) vs dead-end explorations (cold).

**Heat model:** Intensity is computed by `@traek/analytics` `buildHeatmap()` as branch coverage normalized to [0, 1]. A node included in many branches = hot.

**Color scale:** Linear interpolation from `rgb(0, 216, 255)` (cool/cyan) → `rgb(255, 68, 0)` (hot/orange-red), matching the Traek accent palette.

**Components:**
- Intro paragraph explaining the heat model (helps users interpret correctly)
- Hottest node + coldest leaf highlight cards
- 10-cell heat grid: each cell shows node ID (truncated), role (colour-coded), depth, branch coverage count, and intensity %
- Heat legend bar (CSS gradient) with three labels

**Accessibility:**
- Grid uses `role="list"` / `role="listitem"`
- Each cell has a `title` tooltip with full details

---

### 4. Flow

**Purpose:** Show the actual conversation paths — which branches were explored most and in what order.

**Components:**
- Intro paragraph
- Up to 6 branch cards, sorted by heatmap intensity descending
- Each card shows:
  - Rank badge (cyan), branch label, heat intensity badge (colour matches heat)
  - Visual path: a row of 12×12px coloured squares (cyan=user, orange=assistant, purple=system), opacity driven by node heat intensity — visually shows "dense" vs "sparse" segments
  - Overflow indicator if >20 nodes
  - Stats row: node count, user/assistant turns, duration

---

### 5. Content

**Purpose:** Quantitative analysis of message length distribution and conversation quality metrics.

**Components:**
- 2-column role cards (user + assistant): avg/median/max/total chars, with a proportional bar
- 4 metric cards: elaboration ratio, deep answer rate, velocity (nodes/min), code block count
- Tag chip list (if tags present)

---

### 6. Export

**Purpose:** Download the full analytics report for use outside Traek.

**Formats:**

| Format | Use case | Mime type |
|--------|----------|-----------|
| Markdown | Human-readable docs, sharing, wikis | `text/markdown` |
| JSON | Custom tooling, APIs, programmatic analysis | `application/json` |
| CSV | Spreadsheet import (Excel, Google Sheets) | `text/csv` |

- Format selection via accessible radio group (fieldset + legend)
- Selected format highlighted with cyan border + tinted background
- Download button triggers `URL.createObjectURL()` download — no network request required
- Filename format: `traek-report-{sanitized-title}.{ext}`

---

## Keyboard Navigation

| Key | Action |
|-----|--------|
| `Escape` | Close dashboard |
| `ArrowRight` | Next tab |
| `ArrowLeft` | Previous tab |
| `Tab` | Move focus through interactive elements |

All interactive elements have visible `focus-visible` outlines using `--traek-input-button-bg` (cyan).

---

## Accessibility Checklist

- [x] `role="dialog"` + `aria-modal="true"` on the container
- [x] `aria-labelledby` pointing to the visible title
- [x] Tab bar uses `role="tablist"` / `role="tab"` with `aria-selected` and `aria-controls`
- [x] Panel uses `role="tabpanel"` with `aria-labelledby`
- [x] Close button has `aria-label`
- [x] Decorative icons use `aria-hidden="true"`
- [x] Charts use `role="img"` or `role="list"` with descriptive labels
- [x] Progress/meter bars use `role="meter"` with value attributes
- [x] `prefers-reduced-motion` disables transitions
- [x] Color is never the sole information carrier (labels always accompany color indicators)
- [x] Minimum 4.5:1 contrast on all text (uses Traek theme defaults)
- [x] All interactive elements ≥32×32px touch target
- [x] `accent-color` on radio inputs for brand consistency

---

## Data Flow

```
ConversationSnapshot (prop)
  └─► generateReport() → AnalyticsReport
        ├─► analyzeFlow() → FlowMetrics
        ├─► buildHeatmap() → HeatmapData
        └─► analyzeEngagement() → EngagementMetrics

AnalyticsReport
  ├─► Overview tab (score, stats, insights)
  ├─► Topology tab (branch bars, depth cards)
  ├─► Heatmap tab (heat grid, highlights)
  ├─► Flow tab (branch path cards)
  ├─► Content tab (role stats, metrics)
  └─► Export tab → reportToJson/Markdown/Csv → Blob download
```

The report is computed lazily via `$derived` — it will recompute if the snapshot prop changes (e.g. after new messages are added).

---

## Design Decisions & Rationale

### Why a dialog modal, not a dedicated page?
The dashboard is supplementary to the main canvas — it provides insight *about* the conversation without replacing it. A modal lets the user open, inspect, and close without losing canvas position or state.

### Why tabs instead of a single scrollable page?
Six distinct data views with very different visual treatment (chart, grid, list, form) would create a fragmented scroll. Tabs allow each section to use the full panel height optimally and help users locate specific information.

### Why not show raw node IDs in full?
UUIDs are 36 characters and would dominate the visual space. Showing the first 8 characters plus `…` is sufficient for recognition and debugging without clutter.

### Why `heatColor()` uses the accent palette?
Cyan (`#00d8ff`, cool) and orange-red (`#ff4400`, hot) are the existing Traek brand colors for user and assistant nodes respectively. Reusing them for the heat gradient creates a cohesive mental model: cyan nodes are "user-like" (starting points) and orange nodes are "deeply explored" (assistant-heavy paths).

### Why not canvas-overlay heatmap?
A canvas overlay was considered for the heatmap (applying colored overlays directly to nodes on the main canvas). This was deprioritized in favor of the dashboard grid because:
1. It would require passing a `TraekEngine` reference and adding render logic to the canvas
2. The overlay approach works poorly with zoomed-out views (tiny nodes)
3. The grid format allows sorting and comparison which an overlay cannot

Canvas overlay heatmap is noted as a future enhancement — the `NodeHeatCell` data model already includes `x` and `y` spatial coordinates for this purpose.

---

## Future Enhancements

- **Canvas heatmap overlay** — render colored glow rings on canvas nodes in real-time using `NodeHeatCell.x/y` coordinates
- **Session replay integration** — "Replay from this branch" action inside the Flow tab
- **Time-series chart** — nodes-per-minute sparkline when timestamp data is present
- **Diff between branches** — quick-launch BranchCompare from the Flow tab
- **Share report URL** — encode report as base64 in a shareable link
