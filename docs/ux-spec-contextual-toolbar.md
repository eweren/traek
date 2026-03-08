# UX Spec: Contextual Toolbar & Node Action Menu

**Version:** 1.0
**Author:** UX Expert Agent
**Date:** 2026-03-08
**Task:** TRK-123

---

## Overview

This spec defines the redesign and expansion of the node contextual toolbar — the action bar that appears when a node is selected on the Træk canvas. The goal is to consolidate all per-node actions into a discoverable, accessible, and spatially appropriate surface, covering hover vs. selected states, toolbar positioning, animation, keyboard triggers, and the full set of actions required.

### Current state (as of this spec)

A `NodeToolbar` component already exists. It renders above the active node as a pill-strip of badge buttons. The current toolbar includes: Duplicate, Copy branch, Delete, (conditionally) Retry, Edit, Compare. Two additional "quick action" buttons (Bookmark, Color) appear separately as a small floating row above the top-right corner of the node when active.

**Problems to address:**
1. Quick actions (bookmark, color) are visually disconnected from the main toolbar.
2. The required new actions (Branch, Collapse children, Change node type, Add annotation) are not present.
3. There is no hover state — the toolbar only appears on activation (click).
4. Toolbar positioning is hardcoded to `y - 40` with no collision detection.
5. No keyboard-accessible trigger for the toolbar (Tab/focus management is missing).
6. On small zoom levels the toolbar can overflow or sit outside the viewport.

---

## 1. Visual States

### 1.1 Default (no interaction)

Node displays as normal. No toolbar visible. Connection ports (input/output dots) are hidden at 0% opacity.

### 1.2 Hover state

Triggered by `mouseover` on the node wrapper (300ms debounce to avoid flicker when moving between nodes quickly).

Reveal:
- Connection ports fade in (opacity 0 → 1, 150ms ease-out).
- A **mini-toolbar** appears above the node showing only the 3 highest-priority actions as icon-only buttons: **Branch**, **Delete**, **…** (overflow menu trigger). Height: 28px. Opacity 0 → 1 at 150ms.
- Node border lightens slightly (opacity bump on `--traek-thought-panel-border`).

**Rationale:** Hover preview reduces cognitive load — users can see that actions exist without committing to selection. The 3-item mini-toolbar follows Hick's Law (minimal choices = faster decision). Hover state must not appear on touch devices (`@media (hover: none) { … }` guard).

### 1.3 Selected/active state

Triggered by click, `Enter`, or `Space` on the node header.

Reveals:
- **Full toolbar** (see Section 2) replaces the mini-toolbar with an animation.
- Active node border glow (existing `--traek-thought-panel-border-active` + `box-shadow`).
- Quick actions (bookmark, color) are absorbed into the full toolbar — the separate `.node-quick-actions` bar is removed.
- `aria-selected="true"` already set; toolbar receives focus on keyboard activation.

### 1.4 Multi-selected state

When 2+ nodes are selected via drag-select (shift-click), the per-node toolbar is suppressed; the `BulkActionToolbar` takes over (existing behaviour). No change needed here.

---

## 2. Full Toolbar Anatomy

```
┌─────────────────────────────────────────────────────────────────┐
│  [Tag ▾]  [Branch ⌥B]  [Copy]  [Collapse ▾]  [★]  [● color]   │
│           [Change type ▾]  [Annotate]  [Edit]  [⋯]  [🗑 Delete]│
└─────────────────────────────────────────────────────────────────┘
```

Single row on desktop, two rows only if nodeWidth < 300px. The toolbar scrolls horizontally with `overflow-x: auto; scrollbar-width: none` (existing behaviour preserved).

**Visual properties (unchanged from current design):**
- Background: `--traek-toolbar-bg` (rgba(30,30,30,0.95)), `backdrop-filter: blur(16px)`
- Border: `1px solid var(--traek-node-border, #444444)`
- Border-radius: 16px
- Shadow: `0 4px 16px var(--traek-toolbar-shadow, rgba(0,0,0,0.3))`
- Padding: 6px gap, 4px between items

**Action button design (existing `.traek-toolbar-badge` style preserved):**
- Height: 28px desktop, 44px mobile
- Padding: 5px 10px desktop, 6px 12px mobile
- Font-size: 12px, rounded pill shape
- Each button has an icon + label; icon-only on hover mini-toolbar with `aria-label`

### 2.1 Action catalogue

| ID | Label | Icon | Keyboard shortcut | Visibility rule | Notes |
|---|---|---|---|---|---|
| `branch` | Branch | `ph:git-branch` | `Alt+B` | Always | Creates a new user node as sibling; engine: `branchFrom()` |
| `copy` | Copy | `solar:copy-linear` | — | Always | Duplicates node; engine: `duplicateNode()` |
| `copy-branch` | Copy branch | `solar:clipboard-list-linear` | — | Always | Existing action; copies branch as markdown |
| `collapse` | Collapse | `solar:alt-arrow-up-linear` | `Alt+C` | `hasChildren === true` | Toggle; shows "N hidden" count; engine: `toggleCollapse()` |
| `expand` | Expand | `solar:alt-arrow-down-linear` | `Alt+C` | `isCollapsed === true` | Same shortcut as collapse, toggled label |
| `change-type` | Change type | `solar:layers-linear` | — | Always | Dropdown picker; see Section 3 |
| `annotate` | Annotate | `solar:sticker-smile-circle-linear` | — | Always | Adds sticky annotation anchored to node |
| `bookmark` | Bookmark | `solar:bookmark-linear` | — | Always | Toggle; filled star when bookmarked |
| `color` | Color | `solar:palette-linear` | — | Always | Opens color popover (existing `ColorPicker`) |
| `edit` | Edit | `solar:pen-linear` | `E` | `role === 'user'` only | Existing action |
| `retry` | Retry | `solar:refresh-linear` | `R` | `role === 'assistant'` only | Existing action |
| `compare` | Compare | `solar:code-file-linear` | — | `branchChildren.length >= 2` | Existing action |
| `delete` | Delete | `solar:trash-bin-minimalistic-linear` | `Del` / `Backspace` | Always | Destructive; placed at far right with visual separator |
| `tag` | Tag ▾ | — | — | Always | `TagDropdown` component; placed first |

**Delete** always renders last, visually separated by a 1px vertical divider in the toolbar. Its colour is `--traek-error-text` (#ef4444) instead of the default `--traek-toolbar-text`.

**Overflow (`⋯` button):** When horizontal space is insufficient, lower-priority actions (compare, annotate, retry) collapse into an overflow dropdown. Priority order (high → low): branch, edit/retry, copy, delete, collapse, change-type, color, bookmark, copy-branch, compare, annotate.

---

## 3. Dropdown Sub-menus

### 3.1 Collapse / Expand

Clicking the collapse button directly toggles. No sub-menu. If `hasChildren` is false, the button is absent.

### 3.2 Delete variants (existing behaviour, preserved)

If `getDescendantCount() > 0`, clicking Delete reveals a two-option inline expansion:
- "Only this node"
- "With N descendants"

### 3.3 Change node type (`change-type` dropdown)

Opens a small dropdown below the button (or above if toolbar is near the viewport top). Lists available node types from the `NodeTypeRegistry`.

```
┌─────────────────────┐
│  ◉ Text  (current)  │
│  ◎ Code             │
│  ◎ Image            │
│  ◎ Thought          │
└─────────────────────┘
```

- Current type shown with filled radio indicator.
- Selecting a type calls `engine.updateNode(node.id, { type: newType })`.
- Close on selection or Escape.
- Keyboard: arrow keys navigate options, Enter/Space selects.
- ARIA: `role="listbox"` on container, `role="option"` per item, `aria-selected` on current.

### 3.4 Tag dropdown (existing `TagDropdown` component)

No change to behaviour. Remains leftmost item.

---

## 4. Toolbar Positioning

### 4.1 Default position

Centered above the node:

```
left = node.x + nodeWidth / 2 - toolbarWidth / 2
top  = node.y - toolbarHeight - 12   (12px gap)
```

Because `toolbarWidth` is unknown until render (it depends on how many actions are visible), position is recalculated after the toolbar mounts via `ResizeObserver` on the toolbar element. Initial render uses `nodeWidth / 2` estimate with CSS `transform: translateX(-50%)` as a safe fallback.

### 4.2 Collision avoidance

After mount, check if the toolbar overflows any of the four viewport edges (using `getBoundingClientRect()` on the toolbar element and comparing to `viewport.viewportEl.getBoundingClientRect()`).

**Rules:**
- **Top overflow:** flip to below the node: `top = node.y + nodeHeight + 12`
- **Left overflow:** clamp: `left = max(8, computedLeft)`
- **Right overflow:** clamp: `right = max(8, viewportRight - toolbarRight - 8)` (applied as a CSS right offset)
- **Combined bottom + flip collision:** if flipped to bottom and still overflows, try centering vertically beside the node (right edge + 12px gap), then fall back to the original above position.

Collision check runs once on mount and again on viewport resize (debounced 100ms).

### 4.3 Canvas scale awareness

The toolbar is rendered inside the `.canvas-space` div (in the same transform space as nodes), so it scales with the canvas. At zoom levels below 0.4, the toolbar becomes too small for tap targets. Below 0.4 scale, apply `min-scale` compensation:

```css
.traek-node-toolbar {
  transform-origin: top center;
  transform: scale(max(1, 0.4 / var(--traek-canvas-scale, 1)));
}
```

The CSS variable `--traek-canvas-scale` should be set on `.canvas-space` by the `ViewportManager` (new addition to implementation).

### 4.4 Touch / long-press position

On touch, the toolbar is already rendered at `longPressViewportPos` (viewport coordinates, not canvas). The existing `long-press-menu` positioning continues unchanged, but the full new toolbar component replaces the old `NodeToolbar` within it.

---

## 5. Animation

All animations must respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  .traek-node-toolbar { transition: none; animation: none; }
}
```

### 5.1 Toolbar enter (full toolbar on selection)

```css
@keyframes toolbar-enter {
  from { opacity: 0; transform: translateY(6px) scale(0.96); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
.traek-node-toolbar {
  animation: toolbar-enter 150ms cubic-bezier(0.2, 0, 0, 1) both;
}
```

Duration: 150ms. Uses a deceleration curve (snappy entrance, no bounce).

### 5.2 Toolbar exit (deselection)

CSS opacity + scale transition on removal:

```css
.traek-node-toolbar {
  transition: opacity 100ms ease-in, transform 100ms ease-in;
}
```

Svelte `fade` transition with `duration: 100` handles mount/unmount. On exit, scale moves to `0.96` simultaneously.

### 5.3 Mini-toolbar → full toolbar transition

When transitioning from hover mini-toolbar to selected full toolbar:
- Mini-toolbar fades out (100ms).
- Full toolbar fades in with the `toolbar-enter` animation.
- No morphing between them (keeps implementation simple, avoids layout thrash).

### 5.4 Dropdown enter

```css
@keyframes dropdown-enter {
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

Duration: 120ms.

---

## 6. Keyboard Trigger & Navigation

### 6.1 Accessing the toolbar via keyboard

The existing keyboard navigator (`KeyboardNavigator`) moves focus between nodes. When a node has keyboard focus (`isFocused === true`), pressing **`T`** opens the toolbar and moves focus into it.

Alternatively, **`Tab`** from within a focused node header cycles focus into the toolbar (if active/selected), then out of the node.

### 6.2 Toolbar keyboard navigation

Once focus is inside the toolbar:
- **Left / Right arrow keys:** move focus between toolbar buttons.
- **Home / End:** jump to first / last button.
- **Enter / Space:** activate the focused button.
- **Escape:** close toolbar, return focus to the node header.
- **Tab:** moves focus out of the toolbar to the next interactive element (breadcrumb or input).

ARIA: The toolbar has `role="toolbar"` and `aria-label="Node actions"`. Individual buttons have descriptive `aria-label` values (already present).

### 6.3 Per-action keyboard shortcuts

Shortcuts only fire when a node has keyboard focus (not canvas-wide):

| Key | Action | Condition |
|---|---|---|
| `Alt+B` | Branch | Always |
| `Alt+C` | Toggle collapse | `hasChildren` |
| `E` | Edit | `role === 'user'` |
| `R` | Retry | `role === 'assistant'` |
| `Delete` / `Backspace` | Delete | Always |
| `T` | Open toolbar | Node is focused |

These are handled in `KeyboardNavigator.handleKeyDown()`.

---

## 7. "Branch" Action — Interaction Detail

Branch is the most frequently used action on the canvas and deserves extra specification.

**Trigger:** Click "Branch" button or `Alt+B` when node is focused.

**Behaviour:**
1. Calls `engine.branchFrom(node.id)` — creates a new user node as a sibling with the same parent.
2. Sets the new node as `activeNodeId`.
3. Pans the viewport to center on the new node (`viewport.centerOnNode`).
4. Focuses the input so the user can immediately type the new branch message.

**Visual feedback:**
- The branch celebration toast fires (existing `branchCelebration` behaviour) if this is the second child of the parent.
- Connection lines animate in (existing SVG path animation).

**Accessibility:**
- Announce: `"Branched from [node role] node. New branch ready."` via the ARIA live region.

---

## 8. "Add Annotation" Action — Interaction Detail

**Trigger:** Click "Annotate" button.

**Behaviour:**
1. Enables annotation mode (`annotateMode = true`).
2. Sets `annotationTool = 'sticky'`.
3. Pre-positions the new annotation adjacent to the node: `x = node.x + nodeWidth + 20`, `y = node.y`.
4. Creates the annotation immediately (no two-step: click then draw) — drops a sticky at the computed position.
5. The annotation is anchored to the node in metadata (`{ anchoredToNodeId: node.id }`).

**Rationale:** Creating an annotation via the toolbar implies the user wants it near this specific node. Pre-positioning avoids the "click to place" step that is discoverable but adds friction when the intent is clear.

**Accessibility:** Announce: `"Annotation added. Press A to enter annotation mode to edit."` via live region.

---

## 9. Wireframes (ASCII)

### 9.1 Default node with hover state

```
  ┌──[Branch]──[Delete]──[…]──┐   ← mini-toolbar (hover only)
  │                            │
  ┌────────────────────────────┐
  │ ● User                  ▼ │  ← node header (▼ = collapse toggle)
  ├────────────────────────────┤
  │                            │
  │  Message content here...   │
  │                            │
  └────────────────────────────┘
       ●                         ← output connection port (fade in on hover)
```

### 9.2 Selected node with full toolbar

```
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ [Tag ▾] [Branch ⌥B] [Copy] [Collapse] [⭐] [● Color] [Edit] [⋯] [🗑] │
  └─────────────────────────────────────────────────────────────────────────┘
  ●
  ┌────────────────────────────────────────────┐
  │ ● User                  ▼                  │
  ├────────────────────────────────────────────┤
  │                                            │
  │  Message content here...                   │
  │                                            │
  └────────────────────────────────────────────┘
  ●
```

### 9.3 Toolbar near top of viewport (flipped to below)

```
  ┌────────────────────────────────────────────┐
  │ ● User                  ▼                  │
  ├────────────────────────────────────────────┤
  │  Message content here...                   │
  └────────────────────────────────────────────┘
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ [Tag ▾] [Branch ⌥B] [Copy] [Collapse] [⭐] [● Color] [Edit] [⋯] [🗑] │
  └─────────────────────────────────────────────────────────────────────────┘
```

### 9.4 Change node type dropdown (open)

```
  ┌─────────────────────────────────────────────┐
  │ [Tag ▾] [Branch] [Change type ▾] [Edit] [🗑]│
  └────────────────┬────────────────────────────┘
                   │
         ┌─────────▼──────────┐
         │  ◉ Text (current)  │
         │  ◎ Code            │
         │  ◎ Image           │
         └────────────────────┘
```

---

## 10. Accessibility Checklist

- [ ] `role="toolbar"` on toolbar container with `aria-label="Node actions"`
- [ ] All buttons have `aria-label` (currently uses `title` — add `aria-label` to match)
- [ ] Delete button has `aria-describedby` pointing to a visually-hidden "destructive action" warning
- [ ] Color popover traps focus when open (`focus-trap` pattern)
- [ ] Tag dropdown traps focus when open
- [ ] Change-type dropdown: `role="listbox"`, `aria-selected` on current type
- [ ] Keyboard shortcuts documented in KeyboardHelpOverlay
- [ ] Mini-toolbar icon-only buttons have `aria-label` and `title`
- [ ] ARIA live region announces branch creation and annotation creation
- [ ] All touch targets ≥ 44×44px on mobile
- [ ] Toolbar visible in high-contrast mode (border at least 3:1 contrast against canvas background)
- [ ] `prefers-reduced-motion` guards on all animations
- [ ] Focus returns to node header when toolbar is dismissed with Escape

---

## 11. CSS Variables Required

New variables to document / add to theme:

| Variable | Default | Purpose |
|---|---|---|
| `--traek-toolbar-bg` | `rgba(30,30,30,0.95)` | Toolbar background |
| `--traek-toolbar-shadow` | `rgba(0,0,0,0.3)` | Toolbar box shadow |
| `--traek-toolbar-badge-bg` | `rgba(255,255,255,0.06)` | Button background |
| `--traek-toolbar-badge-border` | `rgba(255,255,255,0.08)` | Button border |
| `--traek-toolbar-badge-hover` | `rgba(255,255,255,0.12)` | Button hover background |
| `--traek-toolbar-badge-border-hover` | `rgba(255,255,255,0.18)` | Button hover border |
| `--traek-toolbar-text` | `#cccccc` | Button text |
| `--traek-toolbar-text-hover` | `#ffffff` | Button text hover |
| `--traek-toolbar-delete-color` | `var(--traek-error-text, #ef4444)` | Delete button tint |
| `--traek-toolbar-variant-bg` | `rgba(255,140,0,0.1)` | Variant/dropdown option bg |
| `--traek-canvas-scale` | `1` | Set by ViewportManager for scale compensation |

All variables follow the `--traek-*` prefix convention.

---

## 12. Implementation Notes for Engineering

This spec is for UX design only. Refer the following to engineering for implementation:

1. **Merge quick-actions into toolbar:** Remove `.node-quick-actions` and `.node-color-popover` from `TraekNodeWrapper.svelte`. Add `bookmark` and `color` as `NodeTypeAction` entries via `createDefaultNodeActions()`.

2. **Add new actions to `defaultNodeActions.ts`:** `branch`, `collapse/expand`, `change-type`, `annotate`.

3. **Hover mini-toolbar:** New component `NodeMiniToolbar.svelte` — rendered when `hoveredNodeId === node.id` and `!isActive`. Guard with `@media (hover: none)`.

4. **Positioning logic:** Extract from `TraekCanvas.svelte` into a `toolbarPosition()` utility. Add `--traek-canvas-scale` CSS variable binding in `ViewportManager`.

5. **Keyboard shortcuts:** Add `Alt+B` (branch), `Alt+C` (collapse), `T` (open toolbar) to `KeyboardNavigator.handleKeyDown()`. Update `KeyboardHelpOverlay` with new shortcuts.

6. **Announce actions via live region:** Wire branch and annotation creation to the `liveRegionMessage` state in `TraekCanvas`.

7. **Change-type dropdown:** Uses existing `expandedVariants` mechanism in `NodeToolbar.svelte` with `role="listbox"` upgrade.

---

## 13. Open Questions

1. **Hover mini-toolbar on low-zoom:** At zoom < 0.4, nodes are small. Should the hover mini-toolbar be suppressed entirely below a zoom threshold, or should it always show at minimum scale? Recommendation: suppress below 0.3 scale (dot detail level).

2. **Annotate anchoring persistence:** When an annotation is anchored to a node, should moving the node move the annotation? Current `AnnotationLayer` stores absolute canvas coordinates. This would require annotation coordinates relative to anchor node, or a movement hook.

3. **Branch shortcut conflict:** `Alt+B` (branch) may conflict with system shortcuts on some Linux desktop environments. Consider using `Alt+Shift+B` as a fallback, or making shortcuts user-configurable.

4. **Change-type for streaming nodes:** Should changing type be disabled while a node is streaming? Recommendation: yes — disable the button with `aria-disabled="true"` and tooltip "Cannot change type while streaming."

5. **Overflow threshold:** At what viewport width or node count should the overflow `⋯` button activate? Recommend: show when computed toolbar width exceeds `nodeWidth - 16px`.
