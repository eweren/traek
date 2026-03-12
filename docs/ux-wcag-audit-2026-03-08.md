# WCAG 2.1 AA Accessibility Audit — Traek

**Audit Date:** 2026-03-08
**Auditor:** UX Expert Agent
**Scope:** `packages/svelte/src/lib/` — TraekCanvas, TraekNodeWrapper, ConnectionLayer, InputForm, ZoomControls, NodeToolbar, LiveRegion, KeyboardNavigator
**Standard:** WCAG 2.1 Level AA

---

## Executive Summary

Traek has a solid accessibility foundation: it uses correct ARIA tree semantics, a dedicated keyboard navigation system, an ARIA live region for screen reader announcements, visible focus rings on all interactive elements, `prefers-reduced-motion` support, and three themes including a high-contrast option. Several gaps remain that block WCAG 2.1 AA compliance and must be resolved before enterprise customers can depend on the library.

**Overall status:** Near-compliant. 4 issues block AA conformance. 6 additional issues are medium-priority improvements.

---

## What Is Working Well

| Area | Status | Notes |
|---|---|---|
| Tree semantics | PASS | Viewport has `role="tree"` + `aria-label`; nodes have `role="treeitem"` + `aria-selected` |
| Keyboard navigation | PASS | Arrow keys, Home/End, Enter, Space, 1-9, `g g`, `g e`, `/`, `?` — comprehensive |
| Screen reader announcements | PASS | `LiveRegion.svelte` with polite/assertive ARIA live region wired to all navigation events |
| Collapse control | PASS | `aria-label` + `aria-expanded` on collapse toggle button |
| Error/status states | PASS | `role="alert"` on error banner, `role="status"` on streaming indicator |
| Input form | PASS | `textarea` has `aria-label`; submit button has `aria-label` |
| Focus-visible styles | PASS | All interactive elements have `:focus-visible` outlines (2px solid cyan) |
| Node keyboard focus ring | PASS | `.keyboard-focused` class applies orange 3px outline on focused treeitem |
| Touch targets | PASS | Mobile breakpoint enforces 44px minimum height on node headers, toolbar badges |
| Reduced motion | PASS | `@media (prefers-reduced-motion: reduce)` disables node-appear and stream-complete-pulse animations |
| High contrast theme | PASS | `highContrastTheme` with >7:1 contrast ratios available via ThemePicker |
| ZoomControls | PASS | All buttons have `aria-label` + `title`; focus-visible styles present |
| NodeToolbar | PASS | `role="toolbar"` + `aria-label` on container |

---

## Issues

### CRITICAL — Blocks WCAG 2.1 AA

---

#### A1 — Viewport focus ring suppressed (WCAG 2.4.7)

**File:** `TraekCanvas.svelte:904-910`
**Criterion:** 2.4.7 Focus Visible (AA)

The viewport element (which holds `role="tree"` and receives keyboard focus) has its focus ring explicitly removed:

```css
.viewport:focus,
.viewport:focus-visible {
  box-shadow: none;
  outline: none;
}
```

The comment states that keyboard focus is shown on individual nodes instead. This is true once a node receives programmatic focus (50ms delay via `setTimeout`), but:

- During the 50ms delay window, keyboard users have no visible focus indicator.
- On an empty canvas (no nodes), focus lands on the viewport with no visible indicator at all.
- When a user tabs into the canvas from outside, they cannot tell whether keyboard focus is on the canvas.

**Fix:** Apply a subtle viewport-level indicator that does not conflict with per-node focus rings. A thin inset box-shadow on `:focus-visible` (not `:focus`) satisfies 2.4.7 without visual clutter:

```css
.viewport:focus-visible {
  box-shadow: inset 0 0 0 2px var(--traek-keyboard-focus-ring, #ff9500);
  outline: none;
}
```

---

#### A2 — Connection deletion is keyboard-inaccessible (WCAG 2.1.1)

**File:** `ConnectionLayer.svelte:225-252`
**Criterion:** 2.1.1 Keyboard (A — also required for AA)

Connection lines are interactive (clicking deletes the connection), but keyboard access is explicitly suppressed with Svelte a11y ignore comments:

```svelte
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<path class="connection-hit-area" onclick={...} />
```

No keyboard equivalent exists for deleting a connection. Users who cannot use a mouse have no way to delete connections.

**Fix options:**
1. Wire connection deletion to the `KeyboardNavigator` — e.g., `Delete` or `Backspace` when the keyboard-focused node is active could delete its connection to the parent, with a confirmation announcement via `LiveRegion`.
2. Surface connections as accessible buttons in the tree structure (e.g., as child elements of the treeitem that can be tabbed to).

Option 1 is lower effort and sufficient for AA compliance.

---

#### A3 — Thought-pill button missing `aria-expanded` (WCAG 4.1.2)

**File:** `TraekNodeWrapper.svelte:278-290`
**Criterion:** 4.1.2 Name, Role, Value (AA)

The thought-pill button toggles an expanded state (`isThoughtExpanded`) but does not communicate this state to assistive technology:

```svelte
<button
  type="button"
  class="thought-pill"
  onclick={() => (isThoughtExpanded = !isThoughtExpanded)}
>
```

Screen readers cannot tell users whether the thinking panel is expanded or collapsed.

**Fix:** Add `aria-expanded={isThoughtExpanded}` to the thought-pill button. Also add a more descriptive `aria-label` than the raw `thoughtPillLabel` text:

```svelte
<button
  type="button"
  class="thought-pill"
  aria-expanded={isThoughtExpanded}
  aria-label="{isThoughtExpanded ? 'Collapse' : 'Expand'} thinking: {thoughtPillLabel}"
  onclick={() => (isThoughtExpanded = !isThoughtExpanded)}
>
```

---

#### A4 — Thought step-row buttons missing `aria-expanded` (WCAG 4.1.2)

**File:** `TraekNodeWrapper.svelte:301-306`
**Criterion:** 4.1.2 Name, Role, Value (AA)

The thought step row buttons also expand/collapse content without communicating state:

```svelte
<button
  type="button"
  class="thought-step-row"
  onclick={() => toggleStepExpand(i)}
>
```

**Fix:** Add `aria-expanded={!!expandedStepIndices[i]}` to each step-row button.

---

### HIGH — Significant usability barrier for AT users

---

#### B1 — Node header button accessible name is insufficient (WCAG 4.1.2)

**File:** `TraekNodeWrapper.svelte:167-204`
**Criterion:** 4.1.2 Name, Role, Value (AA)

The node header `<button>` exposes only the role indicator text (`"● User"` or `"◆ Assistant"`) as its accessible name. The bullet characters are not decorative — screen readers announce them as "black circle User" or "black diamond suit Assistant", which is confusing. The button name also does not include any node content, making it impossible to identify nodes via the accessibility tree without navigating into each one.

**Fix:** Add an `aria-label` to the node header button that includes both role and a brief content preview:

```svelte
<button
  type="button"
  class="node-header"
  aria-label="{node.role === 'user' ? 'User' : 'Assistant'} message{firstLine ? ': ' + firstLine.slice(0, 80) : ''}"
  ...
>
```

---

#### B2 — `forced-colors` (Windows High Contrast Mode) not handled (WCAG 1.4.11)

**File:** All `.svelte` files
**Criterion:** 1.4.11 Non-text Contrast (AA)

No `@media (forced-colors: active)` rules exist in any component. When Windows High Contrast Mode is active, custom CSS colors (including CSS custom properties) are overridden by the OS — but SVG colors, `box-shadow`-based borders, and `outline`-based focus rings may not all behave predictably.

Specific concerns:
- The node keyboard focus ring uses `outline: 3px solid var(--traek-keyboard-focus-ring, #ff9500)` — this should survive forced-colors mode automatically if the color is set directly (not via a custom property), but testing is needed.
- The connection line gradients in the SVG (`stroke="url(#gradient-...)"`) will likely render in the system foreground color in forced-colors mode, which is acceptable.
- The `backdrop-filter: blur()` layers on node backgrounds will be ignored — node backgrounds should still satisfy contrast.

**Fix:** Add a `@media (forced-colors: active)` block in `TraekNodeWrapper.svelte` and `TraekCanvas.svelte` that ensures:
- Node borders use `ButtonBorder` or `CanvasText` system colors
- Focus rings use `Highlight` or `ButtonText`
- Connection ports use `ButtonBorder`

Minimum viable addition:

```css
@media (forced-colors: active) {
  .message-node-wrapper {
    border: 2px solid ButtonBorder;
  }
  .message-node-wrapper.keyboard-focused {
    outline: 3px solid Highlight;
  }
  .connection-port {
    background: ButtonBorder;
    border-color: Canvas;
  }
}
```

---

### MEDIUM — Recommended improvements

---

#### C1 — SVG connection layer missing `aria-hidden` (WCAG 1.3.1)

**File:** `TraekCanvas.svelte:657-677`
**Criterion:** 1.3.1 Info and Relationships (A)

The connections SVG is purely visual — the tree hierarchy is communicated through `role="tree"` / `role="treeitem"` semantics, not through the SVG. However, the SVG is not marked `aria-hidden="true"`, meaning screen readers may attempt to traverse it and expose meaningless gradient element IDs.

**Fix:** Add `aria-hidden="true"` to the `.connections` SVG element.

---

#### C2 — NodeToolbar action buttons use `title` instead of `aria-label` (WCAG 4.1.2)

**File:** `NodeToolbar.svelte:107-123`
**Criterion:** 4.1.2 Name, Role, Value (AA)

Action buttons use `title` for their accessible name:

```svelte
<button type="button" class="traek-toolbar-badge" title={action.label} ...>
```

The `title` attribute is not consistently exposed by screen reader / browser combinations (especially on mobile). `aria-label` is the reliable mechanism.

**Fix:** Add `aria-label={action.label}` alongside the existing `title` attribute.

---

#### C3 — `LiveRegion` role/politeness conflict (WCAG 4.1.3)

**File:** `a11y/LiveRegion.svelte:48`
**Criterion:** 4.1.3 Status Messages (AA)

The component uses `role="status"` (which implies `aria-live="polite"`) AND also explicitly sets `aria-live={politeness}`. When `politeness="assertive"`, this creates a conflict between the implicit role semantics and the explicit `aria-live` value. Browser support for resolving this conflict varies.

**Fix:** Remove `role="status"` and rely only on `aria-live`:

```svelte
<div class="live-region" aria-live={politeness} aria-atomic="true">
```

If a role is needed: use `role="log"` for polite and no role for assertive.

---

#### C4 — Empty-state arrow SVG not aria-hidden (WCAG 1.1.1)

**File:** `TraekCanvas.svelte:756-764`
**Criterion:** 1.1.1 Non-text Content (A)

The animated downward arrow in the empty state is decorative but not marked `aria-hidden="true"`. Screen readers will encounter it as an unlabelled SVG element.

**Fix:** Add `aria-hidden="true"` to the empty-state arrow SVG.

---

#### C5 — ZoomControls buttons have redundant `onkeydown` Enter handlers (Minor)

**File:** `ZoomControls.svelte:49, 61, 70, 84`
**Criterion:** Best practice

All zoom buttons have explicit `onkeydown={(e) => e.key === 'Enter' && fn()}` handlers. This is redundant — `<button>` elements already fire `click` on Enter natively. The redundant handlers risk double-firing on some assistive technology combinations.

**Fix:** Remove the `onkeydown` handlers from all zoom control buttons.

---

#### C6 — Connection ports not keyboard-accessible or screen-reader-described (WCAG 2.1.1)

**File:** `TraekNodeWrapper.svelte:362-371`
**Criterion:** 2.1.1 Keyboard (A)

The connection port `<div>` elements are interactive (they trigger connection drag via mouse), but they have no keyboard interaction and are not labelled for screen readers. They should either be keyboard-accessible or, if the preferred fix for A2 makes them redundant, should be `aria-hidden="true"`.

---

## Compliance Matrix

| WCAG Criterion | Level | Status | Issues |
|---|---|---|---|
| 1.1.1 Non-text Content | A | PARTIAL | C4 (decorative SVG not hidden) |
| 1.3.1 Info and Relationships | A | PARTIAL | C1 (connections SVG not aria-hidden) |
| 1.4.11 Non-text Contrast | AA | PARTIAL | B2 (no forced-colors support) |
| 2.1.1 Keyboard | A | FAIL | A2 (connection deletion), C6 (connection ports) |
| 2.4.7 Focus Visible | AA | FAIL | A1 (viewport focus ring suppressed) |
| 4.1.2 Name, Role, Value | AA | PARTIAL | A3, A4 (aria-expanded missing), B1 (node header name), C2 (title vs aria-label) |
| 4.1.3 Status Messages | AA | PARTIAL | C3 (LiveRegion role conflict) |
| 2.4.3 Focus Order | AA | PASS | — |
| 2.4.6 Headings and Labels | AA | PASS | — |
| 1.4.3 Contrast (Minimum) | AA | PASS (dark) | Light theme `#888888` on white requires verification |
| 1.4.4 Resize Text | AA | PASS | CSS em/rem sizing in TextNode |
| 2.5.3 Label in Name | A | PASS | — |
| 3.2.2 On Input | A | PASS | — |

---

## Priority Fixes for AA Conformance

These four changes are required for WCAG 2.1 AA compliance:

1. **A1** — Add visible focus indicator to `.viewport:focus-visible` (inset box-shadow)
2. **A2** — Add keyboard shortcut (`Delete`/`Backspace`) for connection deletion in `KeyboardNavigator`
3. **A3** — Add `aria-expanded` to thought-pill button
4. **A4** — Add `aria-expanded` to thought-step-row buttons

All four are low-to-medium engineering effort. A1 and A3/A4 are CSS/attribute additions. A2 requires a small addition to `KeyboardNavigator.svelte.ts` and a corresponding `removeConnection` call.

---

## Recommended Next Steps

1. Fix A1–A4 in a single PR targeting the `main` branch.
2. Create a follow-up issue for B1 (node header accessible names) — requires UX design input on the label format.
3. Create a follow-up issue for B2 (forced-colors) — requires manual testing in Windows High Contrast Mode.
4. Add a WCAG regression test document to the Storybook story for `TraekCanvas` and `TraekNodeWrapper` listing expected ARIA attributes so they are not accidentally removed.
