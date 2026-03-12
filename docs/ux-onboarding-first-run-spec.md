# UX Spec: First-Run Onboarding & Empty State Experience

**Issue:** TRK-58
**Date:** 2026-03-08
**Author:** UX Expert Agent
**Status:** Approved for implementation

---

## Overview

This spec defines the complete first-run experience for new Træk canvas users, covering:
1. Empty state (canvas with no nodes)
2. Interactive tooltip tour (5 steps)
3. Keyboard shortcut discovery
4. Progressive disclosure of advanced features
5. Returning user experience

---

## 1. Empty State

### Current State
The canvas shows "Start a conversation" + subtitle + bouncing arrow + gesture hints. Functional but passive — no clear call to action.

### Target Design

The empty state should feel inviting and reduce the "blank canvas paralysis" many users experience.

**Layout (centered, pointer-events: none):**
```
[Træk logo/wordmark — optional if host app provides branding]

"Start your first conversation"       ← headline, 28px, semibold
"Type a message below to begin"       ← subtitle, 14px, muted

     ↕ (bouncing arrow pointing to input)

[Drag to pan] · [Scroll to zoom]      ← gesture hints, 12px, 45% opacity
```

**Input form spotlight:**
On first visit (no `traek-tour-completed` in localStorage), the input form receives a subtle glow animation (`--traek-input-dot` color, 0.15 opacity) for 3 seconds to draw the eye. This disappears once the user starts typing or after 3 seconds, whichever comes first.

**Accessibility:**
- Empty state is `aria-hidden="true"` (decorative guidance)
- Gesture hints are already `aria-hidden="true"` ✅
- Arrow animation respects `prefers-reduced-motion`

**Implementation notes:**
- No changes required to the core empty-state structure — only the input spotlight is new
- The spotlight is a CSS class (`first-visit-spotlight`) toggled on `InputForm` for 3 seconds post-mount

---

## 2. Interactive Tooltip Tour (5 Steps)

### Rationale for 5 Steps
The current 8-step tour exceeds the cognitive load threshold for onboarding. Research (Appcues, UserOnboard) consistently shows >5 steps correlates with tour abandonment. The 5-step version focuses on the minimum viable understanding needed to start using Træk.

### Step Definitions

| # | Title | Content | Target | Position |
|---|-------|---------|--------|----------|
| 1 | Welcome to Træk | "A spatial conversation canvas. Instead of a linear chat, your messages form a tree you can explore freely." | viewport (center) | center |
| 2 | Navigate the canvas | "Drag to pan, scroll to zoom. Pinch on a trackpad. The minimap in the corner keeps your bearings." | viewport | center |
| 3 | Send your first message | "Type below and press Enter. Your conversation grows as a tree on the canvas." | `.floating-input-container, .input-form` | top |
| 4 | Branch the conversation | "Click any message, then send a new one — you'll create an alternative response branch. This is what makes Træk unique." | viewport | center |
| 5 | You're ready! | "Press ? anytime for keyboard shortcuts. Explore branching, search (Ctrl+F), and node comparison." | viewport | center |

### Tour Trigger Logic
```
Mount → check localStorage 'traek-desktop-tour-completed'
  → not set → wait tourDelay ms → show tour
  → set → skip tour (show keyboard hint instead — see §3)
tourDelay < 0 → never show tour
```

### Tour UX Improvements
- **Skip button:** Renamed from "Skip" to "Skip tour" for clarity (already implemented with aria-label, needs visible text update)
- **Progress indicator:** Current pill-dot design is good. Keep.
- **ESC key:** Skips the tour (already implemented) ✅
- **Arrow navigation:** ← → arrow keys navigate steps (already implemented) ✅

### Accessibility
- `role="dialog"` + `aria-modal="true"` + `aria-labelledby` ✅
- Focus trap within tooltip ❌ **MISSING** — currently focus is not trapped
- On tour close, focus should return to the viewport element
- All interactive elements meet 44×44px touch target ✅
- `prefers-reduced-motion` disables pulse and fade-in animations ✅

### Focus Trap Gap (Bug)
The TourStep component doesn't implement a focus trap. When keyboard navigating, Tab can reach elements behind the overlay backdrop. This should be fixed:
- On mount, find all focusable elements within `.tour-tooltip`
- Intercept Tab/Shift+Tab to cycle within them
- On unmount, restore focus to the previously focused element

---

## 3. Keyboard Shortcut Discovery

### Problem
The `KeyboardHelpOverlay` (accessed via `?`) is comprehensive but has zero discoverability. No user who doesn't already know to press `?` will find it.

### Solution: `KeyboardDiscoveryHint` Component

A small floating badge that appears after the desktop tour completes (or on first canvas load for non-tour users who have messages).

**Visual design:**
```
┌───────────────────────────────┐
│  ⌨  Press ? for shortcuts    × │
└───────────────────────────────┘
```
- Position: bottom-right, above zoom controls (~80px from bottom, 20px from right)
- Background: `--traek-input-bg` with 90% opacity
- Border: `--traek-input-border`
- Font: 13px, `--traek-node-text`
- `×` dismiss button: 44×44px touch target
- Keyboard icon: `⌨` or SVG keyboard icon

**Behavior:**
- Appears 1500ms after tour completion or canvas mount (if tour already done, nodes > 0)
- Auto-dismisses after 6 seconds (timeout)
- Dismissed permanently on:
  - User presses `?` (KeyboardHelpOverlay opens)
  - User clicks `×` dismiss button
- Dismissed for session on:
  - 6-second auto-timeout
- Permanent dismissal stored in `localStorage['traek-keyboard-hint-dismissed']`
- Does NOT appear if `tourDelay < 0` (tour disabled = hint disabled)

**Accessibility:**
- `role="status"` + `aria-live="polite"` to announce to screen readers
- `×` button: `aria-label="Dismiss keyboard shortcut hint"`
- Respects `prefers-reduced-motion` (no slide-in animation)

---

## 4. Progressive Disclosure of Advanced Features

### Design Principle
Advanced features appear contextually — triggered by user behavior, not time. Users shouldn't see everything at once; they should discover features as they become relevant.

### Disclosure Events

| Trigger | Feature Disclosed | Mechanism |
|---------|-----------------|-----------|
| First message sent | None (natural transition) | Empty state disappears |
| First branch created (2+ children from same parent) | Branch celebration + hint | Toast: "You created a branch! Explore different directions." ✅ EXISTING |
| 5+ nodes in canvas | Search hint | Toast: "Press Ctrl+F to search all messages" (show once) |
| First branch created | Compare feature hint | After branch celebration, show "Use the Compare icon to view branches side by side" (integrated in branch celebration flow) |
| 10+ nodes | Minimap callout | One-time highlight ring on minimap for 2 seconds |

### Search Hint Implementation
After 5+ non-thought nodes are added and the user hasn't used search yet:
- Show a single toast: "Tip: Press Ctrl+F (⌘+F on Mac) to search your conversation"
- Stored in `localStorage['traek-search-hint-shown']`
- Never shown again after first display

### Minimap Callout
After the first time the minimap becomes visible (>= `minimapMinNodes`):
- Briefly pulse the minimap with the `--traek-input-dot` glow for 2 seconds
- No text tooltip needed — the visual attention is sufficient
- `prefers-reduced-motion`: skip pulse entirely

---

## 5. Returning User Experience

### Library-Level Scope
The Træk library manages conversation state for a single canvas session. "Recent canvases" and multi-session resume are app-level concerns that depend on persistence strategy (localStorage, database, etc.).

The library provides the following hooks for app developers:

#### `initialOverlay` snippet
The existing `initialOverlay` snippet prop allows host apps to inject any UI over the canvas before the first node is focused. This is the correct extension point for a "recent conversations" picker.

**Example pattern for app developers:**
```svelte
<TraekCanvas {engine} {onSendMessage}>
  {#snippet initialOverlay()}
    <RecentConversationsPicker
      canvases={recentCanvases}
      onSelect={loadCanvas}
      onDismiss={() => engine.focusRoot()}
    />
  {/snippet}
</TraekCanvas>
```

#### `tourDelay` prop
Apps that show their own welcome/onboarding flow should set `tourDelay={-1}` to disable the built-in tour.

#### Recommended App-Level Returning User UX
1. On page load, check for saved conversation state
2. If found: render a "Welcome back" overlay via `initialOverlay` with the 2-3 most recent conversations (title, node count, last activity)
3. If not found: let the empty state + tour flow naturally
4. "Recent conversation" picker should be dismissible with ESC and show loading state while restoring

---

## Implementation Checklist

### Phase 1 — Tour Reduction (This sprint)
- [x] Trim `DesktopTour.svelte` from 8 steps to 5 steps (remove keyboard nav, search, compare steps)
- [x] Update i18n to remove unused tour translation keys (or keep for backwards compat with translation overrides)

### Phase 2 — Keyboard Discovery Hint (This sprint)
- [x] Create `KeyboardDiscoveryHint.svelte` component
- [x] Wire into `TraekCanvas.svelte` — show after tour completion or on canvas mount with existing content

### Phase 3 — Focus Trap Bug Fix (Next sprint)
- [ ] Add focus trap to `TourStep.svelte`
- [ ] Restore focus to viewport on tour dismissal

### Phase 4 — Progressive Disclosure (Next sprint)
- [ ] Add search hint toast (5+ nodes, once-only)
- [ ] Add minimap callout animation (on first minimap appearance)
- [ ] Integrate compare hint into branch celebration flow

### Phase 5 — Empty State Polish (Future)
- [ ] Input form spotlight animation for first-time visitors
- [ ] Consider adding a subtle illustration or animation to the empty canvas

---

## Design Tokens Used
All onboarding components use existing `--traek-*` CSS custom properties:
- `--traek-input-bg` — tooltip/hint backgrounds
- `--traek-input-border` — borders
- `--traek-input-dot` — accent color (cyan)
- `--traek-node-text` — primary text
- `--traek-input-context-text` — secondary text
- `--traek-input-button-bg` — primary button background
- `--traek-input-button-text` — primary button text

No new design tokens are required.

---

## Metrics for Success
- Tour completion rate > 60% (target; track via `onComplete` callback + analytics integration)
- Keyboard shortcut usage in first session > 15% of users who saw the hint
- Search feature discovery rate increases after search hint implementation
- User-reported confusion about canvas navigation decreases
