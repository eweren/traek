# UX Spec: Multi-Select Nodes & Batch Operations

**Version:** 1.0
**Author:** UX Expert Agent
**Date:** 2026-03-08
**Task:** TRK-125
**Related:** [TRK-123 — Contextual Toolbar Spec](./ux-spec-contextual-toolbar.md)

---

## Overview

This spec defines the full multi-selection UX for the Træk canvas: how users select multiple nodes (rubber-band drag, shift-click, ctrl/cmd-click, keyboard), how selected state is visually communicated, what batch operations are available, and the design of the batch action toolbar.

### Current state (as of this spec)

`CanvasInteraction.svelte.ts` already implements:
- `selectedNodeIds: SvelteSet<string>` — the authoritative selection set
- **Shift+click** on node headers to toggle individual nodes in/out of selection
- **Batch move** — dragging any selected node moves the whole selection
- **Snap to grid** for all nodes on drop
- **Click on empty canvas** clears selection

`BulkActionToolbar.svelte` already renders a fixed bottom toolbar with: color picker, tag picker, bookmark / unbookmark. It is shown when `selectedNodeIds.size > 0`.

**Gaps to close:**
1. No rubber-band (marquee) selection — drag on empty canvas currently only pans.
2. No Ctrl/Cmd+click alias for Shift+click.
3. No visual selection state on individual nodes (border glow, checkmark indicator).
4. No group bounding-box overlay.
5. Missing batch operations: **Delete**, **Collapse**, **Change type**, **Export selection**.
6. No keyboard multi-select (Shift+Arrow, Cmd+A, Escape to deselect).
7. `BulkActionToolbar` lacks keyboard accessibility (no focus management, no ARIA toolbar pattern).

---

## 1. Selection Methods

### 1.1 Rubber-band (Marquee) Selection

**Trigger:** `mousedown` on the empty canvas (no `[data-node-id]` ancestor) + drag ≥ 4px before `mouseup`.

**Conflict resolution with pan:**
Current behaviour: any `mousedown` on empty canvas starts pan. The new rule is:
- If the user does **not** hold Shift, the default remains **pan** (canvas drag).
- If the user holds **Shift** while dragging on empty canvas, the gesture becomes **rubber-band selection** instead of pan.

This preserves the dominant use-case (pan) while giving power-users a direct marquee trigger. Alternatively, expose a **"Select mode" toggle** in the canvas toolbar (see Section 6) that swaps the primary drag gesture to rubber-band — useful for users who need to select many nodes quickly.

**Interaction flow:**
1. `Shift+mousedown` on empty canvas → `isDragging = false`; selection mode begins.
2. A translucent rectangle (`selection-marquee`) is rendered in the canvas transform space, anchored to the mouse-down position.
3. On `mousemove`, the marquee rectangle updates in real-time.
4. Any node whose bounding box **overlaps** the marquee rect is **highlighted** (pre-selection state — dashed outline, no fill change) but not yet committed to `selectedNodeIds`.
5. On `mouseup`:
   - All overlapping nodes are added to `selectedNodeIds`.
   - If no modifier key is held (Shift was only the mode trigger, not an additive toggle), existing selection is **replaced** by the marquee result.
   - If `Cmd/Ctrl` is also held, marquee result is **added** to existing selection.
   - Marquee rect is removed.

**Bounding box calculation:**
```
nodeLeft   = node.x * gridStep + offsetX
nodeTop    = node.y * gridStep + offsetY
nodeRight  = nodeLeft + nodeWidth
nodeBottom = nodeTop  + (node.metadata.height ?? nodeHeightDefault)

marqueeLeft   = min(startX, currentX)
marqueeTop    = min(startY, currentY)
marqueeRight  = max(startX, currentX)
marqueeBottom = max(startY, currentY)

overlaps = nodeLeft < marqueeRight && nodeRight > marqueeLeft &&
           nodeTop  < marqueeBottom && nodeBottom > marqueeTop
```

All coordinates are in **canvas-pixel space** (after offset, before scale). This ensures the marquee works correctly at any zoom level.

**Touch equivalent:** Two-finger tap-and-hold on empty canvas enters a rubber-band selection gesture (single-touch drag on empty canvas remains pan). See Section 5 for touch detail.

### 1.2 Shift+Click (Single Node Toggle)

Already implemented. No changes to current logic.

- Shift+click on an **unselected** node: adds it to selection.
- Shift+click on a **selected** node: removes it from selection.
- After shift-click, no pan or node activation occurs.

### 1.3 Ctrl/Cmd+Click

Same semantics as Shift+click, for users who expect the OS convention. Implementation: add `e.metaKey || e.ctrlKey` as an additional condition alongside `e.shiftKey` in `CanvasInteraction.handleMouseDown`.

**Platform note:** On macOS, `Cmd+click` is the standard; on Windows/Linux, `Ctrl+click` is the standard. Both should work on all platforms (no platform gating).

### 1.4 Keyboard Multi-Select

These shortcuts are active when the canvas has focus and at least one node has keyboard focus:

| Key combo | Behaviour |
|---|---|
| `Cmd/Ctrl+A` | Select all nodes |
| `Shift+↑/↓/←/→` | Add the next node in that direction to selection (spatial adjacency) |
| `Escape` | Clear selection (deselect all) |
| `Cmd/Ctrl+Shift+A` | Deselect all (alternative to Escape) |
| `Cmd/Ctrl+D` | Duplicate selection (batch) |

"Next node in direction" for Shift+Arrow: find the node whose centre is closest to the active node's centre along the given axis, within a ±45° cone. If no node exists in that direction, do nothing (no wrap-around).

### 1.5 Select All via Menu / Toolbar

A "Select all" option is available in the canvas context menu (right-click on empty canvas) and via the keyboard shortcut. It is not exposed as a persistent button in the CanvasToolbar to avoid visual noise.

---

## 2. Visual Feedback — Per-Node Selection State

### 2.1 Selected node border and glow

When a node is part of `selectedNodeIds`:

```css
.traek-node-wrapper.is-selected {
  outline: 2px solid var(--traek-selection-color, #4f7ef7);
  outline-offset: 2px;
  box-shadow:
    0 0 0 4px color-mix(in srgb, var(--traek-selection-color, #4f7ef7) 20%, transparent);
}
```

The `is-selected` CSS class is added to `.traek-node-wrapper` by `TraekNodeWrapper.svelte` when `selectedNodeIds.has(node.id)`.

**Design rationale:**
- `outline` (not `border`) is used so it does not affect layout.
- `outline-offset: 2px` gives a small visual gap so the selection ring appears distinct from the node border.
- The soft glow (second box-shadow) at 20% opacity creates depth without overwhelming content.
- This style is visually distinct from the **active** node state (`--traek-thought-panel-border-active` glow) to prevent confusion.

**Contrast:** `#4f7ef7` (selection blue) on the dark canvas background (`#1e1e2e`) achieves a 3.5:1 contrast ratio — meets WCAG AA for UI components (3:1 minimum).

### 2.2 Selection checkmark indicator

Each selected node displays a small checkmark badge in its **top-left corner**:

```
┌──────────────────────────────────────┐
│ ✓  ● User                         ▼ │
│                                      │
│  Message content here...             │
│                                      │
└──────────────────────────────────────┘
```

Visual properties:
- Size: 18×18px circle
- Background: `var(--traek-selection-color, #4f7ef7)`
- Icon: `✓` in white, 10px
- Positioned: `top: 8px; left: 8px` within the node wrapper (inside the outline)
- Appears / disappears with `scale(0) → scale(1)` transition (120ms, spring easing) — adds tactile quality to selection
- Hidden when `prefers-reduced-motion: reduce` (fade only)

**Accessibility:** The checkmark is `aria-hidden="true"` — the selection state is communicated via `aria-selected="true"` on the node element.

### 2.3 Pre-selection state (rubber-band hover)

During a rubber-band drag, nodes that overlap the marquee show a **dashed outline** without the glow or checkmark, indicating they will be selected on release:

```css
.traek-node-wrapper.is-preselected {
  outline: 2px dashed var(--traek-selection-color, #4f7ef7);
  outline-offset: 2px;
  opacity: 0.9;
}
```

`is-preselected` is a transient class — set during mousemove, removed on mouseup.

---

## 3. Group Bounding Box Overlay

When 2+ nodes are selected, a **group bounding box** is rendered as an overlay in the canvas transform space. This communicates the spatial extent of the selection and anchors the batch toolbar visually.

### 3.1 Visual design

```
  ╔═══════════════════════════════════════╗
  ║                                       ║
  ║   ┌──────────────────┐                ║
  ║   │  Node A          │                ║
  ║   └──────────────────┘                ║
  ║                                       ║
  ║        ┌──────────────────┐           ║
  ║        │  Node B          │           ║
  ║        └──────────────────┘           ║
  ║                                       ║
  ╚═══════════════════════════════════════╝
```

Properties:
- Padding: `24px` outside the outermost nodes' combined bounds
- Border: `1.5px dashed color-mix(in srgb, var(--traek-selection-color, #4f7ef7) 60%, transparent)`
- Background: `color-mix(in srgb, var(--traek-selection-color, #4f7ef7) 4%, transparent)` (very subtle fill)
- Border-radius: `12px`
- z-index: below nodes (so nodes remain interactive), above connection lines

The bounding box is computed in real-time as nodes are dragged, so it updates while moving the group.

### 3.2 Bounding box drag handle

The bounding box area is itself **draggable**: `mousedown` on the bounding box fill (not on any node) starts a batch move of all selected nodes. This provides an escape hatch when the user wants to move the group without having to click directly on a node header.

Cursor: `grab` on hover, `grabbing` on mousedown.

### 3.3 Selection count badge

The group bounding box renders a small badge at its **top-left corner** (above the box outline):

```
  ┌─── 3 nodes selected ───
  ╔════════════════════════╗
  ║  ...                   ║
```

Properties:
- Background: `var(--traek-selection-color, #4f7ef7)`
- Text: `{count} nodes selected` (or `{count} selected` if space is tight), white, 11px
- Border-radius: 6px
- Padding: 2px 8px
- Only shows when selection count ≥ 2

**Touch note:** On touch, the count badge is the drag handle for group move (since hover effects are unavailable).

---

## 4. Batch Operations — Full Catalogue

The following batch operations are available when `selectedNodeIds.size >= 1`. Most require `selectedNodeIds.size >= 2` to be meaningful, but allow single-node operation for workflow consistency.

| ID | Label | Description | Min nodes | Engine method |
|---|---|---|---|---|
| `bulk-move` | Move group | Drag any selected node or the bounding box | 1 | `setNodePosition()` per node — already implemented |
| `bulk-delete` | Delete | Delete all selected nodes (with descendant sub-option) | 1 | `deleteNode()` per node |
| `bulk-collapse` | Collapse | Collapse children of all selected nodes that have children | 1 | `toggleCollapse()` per node |
| `bulk-expand` | Expand | Expand all collapsed selected nodes | 1 | `toggleCollapse()` per node |
| `bulk-change-type` | Change type | Change all selected nodes to a chosen type | 1 | `updateNode(id, { type })` per node |
| `bulk-color` | Color | Set color for all selected nodes | 1 | `bulkSetColor()` — already implemented |
| `bulk-tag` | Tag | Add a tag to all selected nodes | 1 | `bulkAddTag()` — already implemented |
| `bulk-bookmark` | Bookmark | Bookmark all selected nodes | 1 | `bulkSetBookmark(true)` — already implemented |
| `bulk-unbookmark` | Unbookmark | Remove bookmark from all selected nodes | 1 | `bulkSetBookmark(false)` — already implemented |
| `bulk-export` | Export selection | Export selected nodes as markdown or JSON | 1 | New: `exportNodes(ids, format)` |
| `bulk-duplicate` | Duplicate | Duplicate all selected nodes (no connections) | 1 | `duplicateNode()` per node |
| `bulk-deselect` | Clear selection | Deselect all — dismiss toolbar | 1 | Clear `selectedNodeIds` |

### 4.1 Bulk Delete — interaction detail

Because delete is destructive, clicking the delete button in the bulk toolbar opens an **inline confirmation panel** above the toolbar (not a modal — avoids breaking canvas flow):

```
┌──────────────────────────────────────────────────────────────┐
│  Delete 3 nodes?                                             │
│  ○ Selected nodes only       ● Selected + all descendants   │
│                                                              │
│  [Cancel]                             [Delete — destructive] │
└──────────────────────────────────────────────────────────────┘
```

**Behaviour:**
1. User picks scope (selected only vs. with descendants).
2. "Delete" button colour is `var(--traek-error-text, #ef4444)`.
3. On confirm: calls `captureForUndo()` first, then deletes all nodes.
4. An undo toast fires: `"Deleted {N} nodes. Undo"` (5s dismiss window).
5. Selection is cleared after deletion.

If none of the selected nodes have any descendants, only "Selected nodes only" is shown (no option radio, just a confirmation button).

### 4.2 Bulk Collapse / Expand — interaction detail

**Collapse:** Only available for nodes where `hasChildren === true`. Nodes without children are skipped silently (no error).

The button label is context-aware:
- If all selected nodes with children are collapsed → show "Expand"
- If all are expanded → show "Collapse"
- If mixed state → show "Collapse" (collapsing is the safer default for a messy canvas)

On action: calls `toggleCollapse(id)` for each applicable node in a single `captureForUndo()` wrapper (single undo step for the batch).

### 4.3 Bulk Change Type — interaction detail

Opens a **type picker popover** above the toolbar:

```
┌─────────────────────────────────────────────────┐
│  Change type for 3 nodes                        │
│                                                 │
│  [◎ Text]  [◎ Code]  [◎ Image]  [◎ Thought]    │
│                                                 │
│  Note: Current types will be replaced.          │
└─────────────────────────────────────────────────┘
```

- Selecting a type immediately applies to all selected nodes (no secondary confirm, since this is reversible via undo).
- Streaming nodes (`status === 'streaming'`) in the selection are excluded — a small note: `"Streaming nodes are skipped."` shown only when relevant.
- ARIA: `role="listbox"`, `aria-label="Select node type"`, `role="option"` per type.

### 4.4 Bulk Export — interaction detail

Opens an **export format picker** popover:

```
┌──────────────────────────────────┐
│  Export 3 nodes as:              │
│                                  │
│  [📄 Markdown]  [{ } JSON]       │
└──────────────────────────────────┘
```

**Markdown export:** Concatenates selected nodes' content in tree order (depth-first, following parent-child relationships within the selection). Each node rendered as:
```markdown
## [User] Node title or first 50 chars
Content here...

## [Assistant]
Content here...
```

**JSON export:** Full node objects (id, role, type, content, metadata) as a JSON array. Useful for import or debugging.

Both formats trigger a browser download with a timestamp-based filename (`traek-export-2026-03-08.md`).

Export is not reversible, so no undo toast. A `"Exported {N} nodes"` info toast fires on success.

---

## 5. Batch Action Toolbar — Redesign

The existing `BulkActionToolbar` is functional but lacks keyboard accessibility and the new operations. This spec defines the full redesigned toolbar.

### 5.1 Anatomy

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  3 selected  │  [Delete]  [Collapse]  [Change type ▾]  [Tag ▾]  [Color ●]  [Export ▾]  │  [★]  │  ✕  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

Positioning: `position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);`

**When no nodes have children:** Collapse button is hidden.
**When all nodes are collapsed:** Button shows "Expand" label.

### 5.2 Visual design (aligned with NodeToolbar spec)

Same visual language as the single-node toolbar (TRK-123):
- Background: `var(--traek-toolbar-bg, rgba(30,30,30,0.95))`, `backdrop-filter: blur(16px)`
- Border: `1px solid var(--traek-node-border, #444444)`
- Border-radius: 16px
- Shadow: `0 8px 32px rgba(0,0,0,0.5)` (slightly deeper than node toolbar to read over canvas)
- Font-size: 12px

**Button sizes:** 28px height desktop, 44px height mobile (same as NodeToolbar badges).

**Count badge (leftmost):**
- Shows `{N} selected`
- Color: `rgba(255,255,255,0.5)` — subdued, not the focus
- `aria-live="polite"` so screen readers announce count changes

**Delete button (rightmost):**
- Separated by a 1px vertical divider
- Text color: `var(--traek-toolbar-delete-color, #ef4444)`
- Icon: `solar:trash-bin-minimalistic-linear`

**Close button:**
- `✕` at far right after divider
- `aria-label="Clear selection"`
- `title="Clear selection (Escape)"`

### 5.3 Toolbar overflow

On narrow viewports or when many operations are visible, lower-priority actions collapse into an overflow `⋯` dropdown. Priority order (high → low):

1. Delete
2. Collapse / Expand
3. Change type
4. Color
5. Tag
6. Export
7. Bookmark
8. Duplicate

Overflow activates when total toolbar width exceeds `min(viewport.width - 48px, 800px)`.

### 5.4 Keyboard accessibility

The toolbar uses the **toolbar composite widget pattern** (ARIA 1.2):
- Container: `role="toolbar"`, `aria-label="{N} nodes selected"`
- Focus management: only **one** toolbar button is in the natural tab order at a time (roving tabindex). Arrow keys navigate within the toolbar.
- `←/→` arrows move focus between buttons
- `Home`/`End` jump to first / last button
- `Enter`/`Space` activate
- `Escape` closes toolbar (clears selection) and returns focus to the canvas

On appearance, the toolbar **does not steal focus** — canvas and node keyboard navigation continue to work. Users must explicitly Tab into the toolbar or click a button.

Screen reader announcement on toolbar appearance: `"Bulk toolbar: {N} nodes selected. Press Tab to access actions."` via the ARIA live region.

### 5.5 Mobile / touch

On touch devices (screen width < 768px or `@media (hover: none)`):
- Toolbar appears at the **bottom of the screen** (same as desktop) but buttons are 44×44px.
- If more than 4 operations are visible, show only the top 4 (by priority order) + `⋯` overflow.
- Long-press on the bounding box opens the toolbar if it was dismissed.
- Swipe down on the toolbar dismisses it (clears selection).

---

## 6. Rubber-Band Mode Toggle (Canvas Toolbar)

A **"Select" mode toggle button** is added to the existing `CanvasToolbar`:

```
[Undo]  [Redo]  │  [Select ☐]  [New conversation]  │  [Fit]  [+]  [-]
```

**States:**
- Default (off): primary canvas gesture = pan
- On (`isSelectMode = true`): primary canvas drag gesture = rubber-band selection; pan is still available via Space+drag (same as Figma/Miro convention)

**Visual indicator:** When Select mode is active, the toggle button shows a filled/active state. The canvas cursor changes to `crosshair` on empty-canvas hover (instead of `default`/`grab`).

**Keyboard shortcut:** `S` key toggles select mode (only when canvas has focus, not when typing in input). Announced via live region: `"Select mode on"` / `"Select mode off"`.

**Automatic deactivation:** Select mode turns off automatically after rubber-band selection completes, returning to pan mode. This avoids the user being "stuck" in select mode by accident.

---

## 7. Interaction Flows (End-to-End)

### 7.1 Select and delete a group

1. User Shift+clicks 3 nodes.
2. Selected nodes gain `is-selected` class (blue outline + checkmark).
3. Group bounding box appears.
4. Batch toolbar slides up from the bottom.
5. User clicks "Delete" in toolbar.
6. Inline confirmation panel appears above toolbar.
7. User confirms "Delete — selected + all descendants".
8. Undo toast: `"Deleted 3 nodes and 7 descendants. Undo"`.

### 7.2 Rubber-band select and move

1. User Shift+drags on empty canvas → marquee rect appears.
2. Overlapping nodes show `is-preselected` dashed outline.
3. User releases mouse → all overlapping nodes become `is-selected`.
4. User drags any selected node → all selected nodes move together.
5. User Escape → selection cleared, toolbar dismissed.

### 7.3 Select all and export

1. User presses `Cmd+A` → all nodes selected, bounding box covers canvas.
2. Batch toolbar appears.
3. User clicks "Export ▾" → format picker appears.
4. User selects "Markdown" → download triggers.
5. Toast: `"Exported 12 nodes as Markdown."`.

### 7.4 Rubber-band + additive Ctrl selection

1. User Shift+drags on empty canvas → selects 4 nodes.
2. User Ctrl+clicks 2 more individual nodes → added to existing selection.
3. Bounding box expands to include all 6.
4. User proceeds with batch operation.

---

## 8. Animations

All animations must respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  .bulk-toolbar,
  .selection-marquee,
  .group-bounding-box,
  .node-selection-badge { transition: none; animation: none; }
}
```

### 8.1 Batch toolbar enter

```css
@keyframes bulk-toolbar-enter {
  from { opacity: 0; transform: translateX(-50%) translateY(16px) scale(0.96); }
  to   { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
}
.bulk-toolbar {
  animation: bulk-toolbar-enter 200ms cubic-bezier(0.2, 0, 0, 1) both;
}
```

### 8.2 Batch toolbar exit

```css
.bulk-toolbar {
  transition: opacity 150ms ease-in, transform 150ms ease-in;
}
/* On leave: opacity → 0, translateY(8px) */
```

Svelte `fly` transition: `fly({ y: 16, duration: 200 })` on mount, `fly({ y: 8, duration: 150 })` on unmount.

### 8.3 Selection checkmark badge

```css
@keyframes badge-pop {
  0%   { transform: scale(0) rotate(-15deg); }
  60%  { transform: scale(1.15) rotate(5deg); }
  100% { transform: scale(1) rotate(0deg); }
}
.node-selection-badge {
  animation: badge-pop 120ms cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
```

### 8.4 Group bounding box

```css
@keyframes box-expand {
  from { opacity: 0; transform: scale(0.97); }
  to   { opacity: 1; transform: scale(1); }
}
.group-bounding-box {
  animation: box-expand 150ms ease-out both;
}
```

### 8.5 Rubber-band marquee

The marquee rect appears instantly (no animation) and updates in real-time. The slight background fill and dashed border make it readable without any enter animation.

---

## 9. Accessibility Checklist

### Selection mechanics
- [ ] Rubber-band selection does not block keyboard navigation
- [ ] All selection methods work without a mouse (keyboard multi-select fully functional)
- [ ] `aria-selected="true"` set on selected node elements (already done via `isActive`, must extend to multi-select state)
- [ ] Canvas announces selection count via ARIA live region when selection changes: `"3 nodes selected"`
- [ ] `Escape` deselects all and is documented in `KeyboardHelpOverlay`

### Batch toolbar
- [ ] `role="toolbar"` on container with `aria-label="{N} nodes selected"`
- [ ] Roving tabindex for keyboard navigation within toolbar
- [ ] `←/→` arrow keys navigate toolbar buttons
- [ ] `Home/End` jump to first/last button
- [ ] Delete button has `aria-describedby` referencing a visually-hidden warning: `"This will permanently delete nodes"`
- [ ] Confirmation panel traps focus when open
- [ ] Export triggers accessible notification (`role="status"`) on completion
- [ ] All buttons have `aria-label` (not just `title`)
- [ ] Toolbar button minimum touch target: 44×44px on mobile

### Visual
- [ ] Selection ring (`#4f7ef7` on dark canvas): 3.5:1 contrast ratio — passes AA for UI components
- [ ] Checkmark badge has no color-only encoding (shape conveys selection)
- [ ] Group bounding box visible in forced-color/high-contrast mode (uses `outline` or `border`, not just `background`)
- [ ] Marquee rect visible in high-contrast mode
- [ ] Selection state visible at all zoom levels (min zoom ≥ 0.2)
- [ ] `prefers-reduced-motion` honoured on all animations

---

## 10. CSS Variables Required

New variables to add to the theme:

| Variable | Default | Purpose |
|---|---|---|
| `--traek-selection-color` | `#4f7ef7` | Selection ring, bounding box, checkmark |
| `--traek-selection-bg` | `color-mix(in srgb, var(--traek-selection-color) 4%, transparent)` | Bounding box fill |
| `--traek-selection-ring-glow` | `color-mix(in srgb, var(--traek-selection-color) 20%, transparent)` | Node glow when selected |
| `--traek-selection-preselect-border` | `color-mix(in srgb, var(--traek-selection-color) 60%, transparent)` | Marquee pre-selection dashed border |
| `--traek-marquee-bg` | `color-mix(in srgb, var(--traek-selection-color) 8%, transparent)` | Rubber-band marquee fill |
| `--traek-marquee-border` | `color-mix(in srgb, var(--traek-selection-color) 40%, transparent)` | Rubber-band marquee border |

All new variables follow the `--traek-*` prefix convention. The `--traek-toolbar-*` variables defined in TRK-123 apply to the redesigned batch toolbar without modification.

---

## 11. Wireframes (ASCII)

### 11.1 Three nodes selected — bounding box and toolbar

```
                    ╔═══ 3 selected ══════════════════════════════╗
                    ║                                              ║
         ┌──────────────────────────┐                             ║
         │ ✓  ● User             ▼  │                             ║
         ├──────────────────────────┤                             ║
         │  What is the best...      │                             ║
         └──────────────────────────┘                             ║
                    ║                                              ║
                    ║    ┌──────────────────────────┐             ║
                    ║    │ ✓  ● Assistant         ▼  │            ║
                    ║    ├──────────────────────────┤             ║
                    ║    │  Here's my answer...      │            ║
                    ║    └──────────────────────────┘             ║
                    ║                    ┌──────────────────────────┐
                    ║                    │ ✓  ● User             ▼  │
                    ║                    ├──────────────────────────┤
                    ║                    │  Follow-up question...    │
                    ╚════════════════════╧══════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  3 selected  │  [🗑 Delete]  [⌄ Collapse]  [⊞ Type ▾]  [Tag ▾]  [● Color]  [↑ Export ▾]  │  [★]  │  ✕
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 11.2 Rubber-band selection in progress (Shift+drag)

```
  ┌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┐   ← marquee (selecting)
  ╎  ╌ ╌ ╌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─                             ╎
  ╎  ┌──────────────────────────┐                             ╎
  ╎  │    ● User             ▼  │   ← pre-selected (dashed)  ╎
  ╎  ├ - - - - - - - - - - - - ┤                             ╎
  ╎  │  Overlaps marquee...     │                             ╎
  ╎  └ - - - - - - - - - - - - ┘                             ╎
  ╎                                                           ╎
  ╎       ┌──────────────────────────┐                        ╎
  ╎       │    ● Assistant        ▼  │   ← pre-selected      ╎
  ╎       ├ - - - - - - - - - - - - ┤                        ╎
  ╎       │  Also in marquee...      │                        ╎
  ╎       └ - - - - - - - - - - - - ┘                        ╎
  └╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┘
                                                            ↖ cursor
```

### 11.3 Bulk delete confirmation panel

```
  ┌──────────────────────────────────────────────────────────────────┐
  │  Delete 3 nodes?                                                 │
  │                                                                  │
  │  ○ Selected nodes only (3)                                       │
  │  ● Selected + all descendants (3 nodes, 12 descendants = 15)     │
  │                                                                  │
  │                          [Cancel]    [Delete 15 nodes ▸]         │
  └──────────────────────────────────────────────────────────────────┘
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    3 selected  │  [🗑 Delete]  [⌄ Collapse]  ...  │  ✕
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 11.4 Bulk Change type popover

```
  ┌──────────────────────────────────────────────────────┐
  │  Change type for 3 nodes                             │
  │                                                      │
  │  [  Text  ]  [  Code  ]  [  Image  ]  [  Thought  ] │
  │                                                      │
  │  Streaming nodes in selection will be skipped.       │
  └──────────────────────────────────────────────────────┘
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    3 selected  │  ...  [⊞ Type ▾]  ...
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 11.5 Select mode in Canvas Toolbar

```
  [↩ Undo]  [↪ Redo]  │  [⊡ Select — active]  [+ New conversation]  │  [⊞ Fit]  [+]  [-]
```

When select mode is active, the cursor on empty canvas becomes `crosshair`.

---

## 12. Implementation Notes for Engineering

This spec is for UX design only. The following are handoff notes for the engineering team.

### New components needed

1. **`SelectionMarquee.svelte`** — Renders the rubber-band rectangle during Shift+drag. Accepts `startX, startY, currentX, currentY` in canvas coordinates. Renders inside the `.canvas-space` div (in transform space).

2. **`GroupBoundingBox.svelte`** — Renders the dashed group bounding box. Accepts `selectedNodes: Node[]`. Computes bounds from node positions + heights. Renders inside `.canvas-space` below nodes. Handles the drag interaction for group move.

3. **Updated `BulkActionToolbar.svelte`** — Extend with Delete, Collapse/Expand, Change type, Export, Duplicate actions. Upgrade keyboard accessibility to roving tabindex toolbar pattern. Add slide-up Svelte `fly` transitions.

### Changes to existing files

4. **`CanvasInteraction.svelte.ts`** — Add rubber-band state machine (marquee start/update/commit). Add `Ctrl/Cmd+click` alias alongside `Shift+click`. Add `isSelectMode` state.

5. **`TraekNodeWrapper.svelte`** — Add `is-selected` and `is-preselected` class bindings. Render the selection checkmark badge when `isSelected`.

6. **`TraekEngine.svelte.ts`** — Add new bulk methods: `bulkDeleteNodes(ids, withDescendants)`, `bulkCollapseNodes(ids)`, `bulkExpandNodes(ids)`, `bulkChangeType(ids, type)`, `bulkDuplicateNodes(ids)`. Add `exportNodes(ids, format)` utility (can live in a separate `export/exportUtils.ts`).

7. **`KeyboardNavigator.svelte.ts`** — Add `Cmd+A` (select all), `Shift+Arrow` (additive select), `Escape` (clear selection), `S` (select mode toggle). Update `KeyboardHelpOverlay` with all new shortcuts.

8. **`CanvasToolbar.svelte`** — Add Select mode toggle button.

9. **`TraekCanvas.svelte`** — Wire `selectedNodeIds` from `CanvasInteraction` to `GroupBoundingBox` and updated `BulkActionToolbar`. Connect live region for selection count announcements.

### Engine methods — `bulkDeleteNodes`

```typescript
bulkDeleteNodes(ids: string[], withDescendants: boolean): void {
  this.captureForUndo();
  const toDelete = withDescendants
    ? ids.flatMap(id => [id, ...this.getDescendantIds(id)])
    : ids;
  const unique = [...new Set(toDelete)];
  unique.forEach(id => this.deleteNode(id));
}
```

### Rubber-band state machine

```
IDLE
  └─ Shift+mousedown on empty canvas ──→ DRAWING
       DRAWING
         ├─ mousemove: update marquee rect, update preselection ──→ DRAWING
         └─ mouseup: commit selection, clear marquee ──→ IDLE

isSelectMode === true:
IDLE
  └─ mousedown on empty canvas ──→ DRAWING (same as above, no Shift needed)
```

---

## 13. Open Questions

1. **Rubber-band vs. pan priority:** This spec recommends `Shift+drag` for rubber-band. An alternative is a **mode toggle** (select vs. pan mode). Figma uses modes; Miro uses Shift+drag. Given Træk's primary use case (explore/navigate the canvas), **`Shift+drag` is preferred** to avoid mode confusion. The select mode toggle in the toolbar provides discoverability for the rare "select everything" use case.

2. **Bounding-box drag vs. node drag:** When the user drags inside the bounding box but not on a node header, should it move the group? This spec recommends yes — the `GroupBoundingBox` fill is a drag surface. If this conflicts with clicking to deselect individual nodes, consider requiring a small move threshold (≥ 8px) before treating it as a drag.

3. **Rubber-band deselects prior selection:** Should rubber-band selection replace or extend an existing selection? Recommendation: **replace** by default; **extend** when `Cmd/Ctrl` is held. This is consistent with most canvas tools (Figma, Miro, Excalidraw).

4. **Export ordering:** When exporting markdown, should nodes be ordered by (a) tree topology (depth-first), (b) spatial top-to-bottom, or (c) selection order? Recommendation: **tree topology** for the conversation export use case — it preserves the logical flow of an AI conversation branch.

5. **Batch collapse scope:** `toggleCollapse` collapses a node's direct children. Should bulk collapse apply recursively (collapse all descendants)? Recommendation: **direct children only** for the first version — recursive collapse is a separate operation that could be added later.

6. **Performance at large selections:** `GroupBoundingBox` recomputes bounds on every `mousemove` during drag. For large selections (100+ nodes), this may be costly. Recommend: debounce the bounds recomputation to `requestAnimationFrame` (only update once per frame).
