# UX Improvements: Traek

**Version:** 1.1
**Date:** 2026-02-16
**Status:** Groesstenteils implementiert — verbleibende Items dokumentiert

This document contains concrete, prioritized UX improvement proposals based on the UX audit.

---

## Implementierungsstatus (2026-02-16)

| ID    | Feature                          | Impact | Effort | Priority | Status |
| ----- | -------------------------------- | ------ | ------ | -------- | ------ |
| UX-01 | First-Time Onboarding Tour       | High   | Medium | 🔴 P0    | ✅ Done (DesktopTour + OnboardingOverlay) |
| UX-02 | Canvas Interaction Hints         | High   | Low    | 🔴 P0    | ✅ Done (Empty State, Branching Hint) |
| UX-03 | Keyboard Navigation (Foundation) | High   | High   | 🔴 P0    | ✅ Done (KeyboardNavigator + ARIA + Phase 2) |
| UX-04 | Touch Target Size Increase       | High   | Low    | 🟠 P1    | ⚠️ Teilweise (Send OK, Node Header/Badges offen) |
| UX-05 | Multi-Line Input Field           | Medium | Low    | 🟠 P1    | ❌ Offen |
| UX-06 | Subtree Collapse/Expand          | High   | Medium | 🟠 P1    | ✅ Done (collapsedNodes, Branch-Badge) |
| UX-07 | Action Badges Always Visible     | Medium | Low    | 🟠 P1    | ✅ Done |
| UX-08 | Node Ghost Preview               | Medium | Medium | 🟡 P2    | ✅ Done (GhostPreview) |
| UX-09 | Connection Fading                | Medium | Low    | 🟡 P2    | ✅ Done (Active Path Highlighting) |
| UX-10 | Improved Error Visibility        | Medium | Low    | 🟡 P2    | ⚠️ Teilweise (Error Status sichtbar, aber kein Retry Button) |
| UX-11 | Context Path Breadcrumb          | Medium | Medium | 🟡 P2    | ✅ Done (Desktop + Mobile Breadcrumbs) |
| UX-12 | Empty State Design               | Low    | Low    | 🟢 P3    | ✅ Done (Empty State mit Arrow) |
| UX-13 | Minimap/Overview                 | Low    | High   | 🟢 P3    | ✅ Done (Minimap + ZoomControls)  |

### Verbleibende UX-Arbeit

- **UX-04** Touch Targets: Mobile Node Headers und Action Badges unter 44px
- **UX-05** Multi-Line Input: Textarea mit Auto-Expand fehlt komplett
- **UX-10** Error States: Retry-Button in Error-Nodes noch nicht implementiert
- **Onboarding**: Tour koennte von 7 auf 5 Schritte vereinfacht werden
- **Progressive Disclosure**: Feature Spotlights nach Nutzungsmilestones fehlen
- **Mobile Search**: Search in FocusMode fehlt komplett
- **Mobile Branch Compare**: Vereinfachte Version fuer FocusMode fehlt

---

## 🔴 P0: Critical Improvements

### UX-01: First-Time Onboarding Tour

**Problem:** Users land on a blank canvas with no guidance. They don't understand:

- What the spatial metaphor means
- How to pan/zoom
- How to create branches
- What actions/slash commands are

**Solution:** Implement a lightweight, dismissible tutorial that walks users through core interactions.

**Design:**

```
┌─────────────────────────────────────────────────┐
│  Welcome to Træk                          [Skip]│
│                                                  │
│  Conversations here branch, not scroll.          │
│  Let's learn the basics.                         │
│                                                  │
│  [Start Tour]                                    │
└─────────────────────────────────────────────────┘
```

**Tour Steps:**

1. **Welcome (Modal Overlay)**
   - "Træk turns conversations into a navigable map"
   - "Let's take a quick tour" / "Skip to demo"

2. **Pan & Zoom (Spotlight on Canvas)**
   - "Drag anywhere to pan the canvas"
   - "Pinch or Ctrl+Scroll to zoom"
   - **Interactive:** Wait for user to pan/zoom before proceeding

3. **Send a Message (Spotlight on Input)**
   - "Type your first message here"
   - **Interactive:** Wait for user to type and press Enter

4. **Branching (Spotlight on New Node)**
   - "New messages appear as nodes"
   - "Click any node to select it, then reply to create a branch"
   - **Interactive:** Wait for user to click node

5. **Actions (Spotlight on Action Badges)**
   - "Use action badges or type / for special commands"
   - "Try typing /image or /debug"
   - **Optional:** Can be skipped

6. **Done**
   - "You're ready! Explore the canvas."
   - Fade out overlay

**Technical Implementation:**

- New component: `src/lib/onboarding/OnboardingTour.svelte`
- State stored in localStorage: `traek-onboarding-completed: true`
- Use `Spotlight` component (like driver.js or Shepherd.js, but lighter)
- Props on TraekCanvas: `showOnboarding?: boolean` (default: true for demo, false for library users)

**Acceptance Criteria:**

- [ ] Tour shows on first visit to demo
- [ ] Tour is dismissible at any step
- [ ] Tour state is saved (won't show again)
- [ ] Interactive steps wait for user action
- [ ] Tour does not block normal usage (can be exited anytime)

**Impact:** High — Dramatically reduces bounce rate for first-time users
**Effort:** Medium — ~1-2 days dev time

---

### UX-02: Canvas Interaction Hints

**Problem:** Even after the tour, users forget how to pan/zoom or may skip the tour.

**Solution:** Add persistent, subtle hints for key interactions.

**Design:**

**Bottom-Right Corner Hint:**

```
┌─────────────────────────────────────────┐
│                                         │
│                                         │
│                                         │
│                                    [💡] │  ← Floating help button
└─────────────────────────────────────────┘
```

Click `💡` → Show overlay:

```
┌─────────────────────────────────────────┐
│  Quick Tips                        [×]  │
│                                         │
│  🖱️  Drag to pan                        │
│  🔍  Ctrl+Scroll to zoom                │
│  🖱️  Click node to select              │
│  ⌨️  Type to reply                      │
│  /  Slash commands                      │
│  ?  Show all shortcuts                  │
│                                         │
│  [Dismiss]                              │
└─────────────────────────────────────────┘
```

**Empty Canvas Hint:**

When canvas has 0 nodes:

```
┌─────────────────────────────────────────┐
│                                         │
│           👋 Start Your First           │
│              Conversation               │
│                                         │
│      Type a message below to begin      │
│                                         │
│                  ↓                      │
└─────────────────────────────────────────┘
```

**Zoom Level Indicator (Enhanced):**

Current: "100% | Context: 5 Nodes" (top-right, small)
New: Larger, with icon

```
Top-Right:
┌──────────────────┐
│  🔍 100%         │  ← Larger font (14px → 16px)
│  📊 5 nodes      │  ← Icons for clarity
└──────────────────┘
```

**Technical Implementation:**

- Help button: New component `src/lib/HelpButton.svelte`
- Empty state: Check `engine.nodes.length === 0` in TraekCanvas
- Enhanced stats: Update `.stats` class in TraekCanvas.svelte

**Acceptance Criteria:**

- [ ] Help button is visible but unobtrusive
- [ ] Help overlay shows core tips
- [ ] Empty state is centered and encouraging
- [ ] Stats bar is more prominent

**Impact:** High — Helps users who skip/forget the tour
**Effort:** Low — ~0.5 day dev time

---

### UX-03: Keyboard Navigation (Foundation)

**Problem:** No keyboard accessibility. Screen reader users and power users are blocked.

**Solution:** Implement Phase 1 of keyboard-navigation.md (basic navigation + ARIA).

**Scope for P0:**

1. **Tab Order for Nodes**
   - Nodes are focusable with Tab/Shift+Tab
   - Focus order: top-to-bottom, left-to-right (based on visual layout)
   - Clear focus ring (3px solid cyan, different from "active" border)

2. **Arrow Key Navigation**
   - `ArrowUp`: Previous node (visually above)
   - `ArrowDown`: Next node (visually below)
   - `ArrowLeft`: Parent node
   - `ArrowRight`: First child node

3. **ARIA Attributes**
   - Viewport: `role="tree"`, `aria-label="Conversation tree"`
   - Nodes: `role="treeitem"`, `aria-level`, `aria-expanded`
   - Active node: `aria-selected="true"`

4. **Focus Management**
   - Focus follows operations (e.g., after adding node, focus new node)
   - Esc clears both focus and active state

**Visual Design:**

**Focused Node (Keyboard):**

```
┌─────────────────────────────────────────┐
│  ╔═════════════════════════════════╗    │  ← Thick cyan outline (focus ring)
│  ║  ● User                         ║    │
│  ║  ─────────────────────────────  ║    │
│  ║  This is a focused node.        ║    │
│  ╚═════════════════════════════════╝    │
└─────────────────────────────────────────┘
```

**Active Node (Reply Target):**

```
┌─────────────────────────────────────────┐
│  ┌─────────────────────────────────┐    │  ← Glowing border (active)
│  │  ● User                         │    │
│  │  ─────────────────────────────  │    │
│  │  This is the active node.       │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

**Both Focused AND Active:**

```
┌─────────────────────────────────────────┐
│  ╔═════════════════════════════════╗    │  ← Outline + glow (combined)
│  ║  ● User                         ║    │
│  ║  ─────────────────────────────  ║    │
│  ║  This is focused + active.      ║    │
│  ╚═════════════════════════════════╝    │
└─────────────────────────────────────────┘
```

**Technical Implementation:**

- Follow keyboard-navigation.md spec
- New file: `src/lib/keyboard/KeyboardNavigator.svelte.ts` (minimal version)
- Update TraekCanvas: Add `onkeydown` handler
- Update TraekNodeWrapper: Add `tabindex`, ARIA attributes
- CSS: Add `:focus-visible` styles

**Acceptance Criteria:**

- [ ] Nodes are tabbable in logical order
- [ ] Arrow keys navigate tree structure
- [ ] Focus ring is clearly visible
- [ ] ARIA tree structure is announced by screen readers
- [ ] Focus state is separate from active state

**Impact:** High — Critical accessibility fix + enables power users
**Effort:** High — ~3-4 days dev time (but well-specified in keyboard-navigation.md)

---

## 🟠 P1: High-Value Quick Wins

### UX-04: Touch Target Size Increase

**Problem:** Tap targets on mobile are too small (< 44px iOS minimum).

**Current Sizes:**

- Node header: ~34px tall (10px padding × 2 + 14px text)
- Action badges: ~28px tall (4px padding × 2 + 20px)
- Send button: 40px × 40px ✅

**Solution:** Increase padding on mobile.

**New Sizes (Mobile):**

```css
@media (max-width: 768px) {
	.node-header {
		padding: 14px; /* was 10px */
	}
	.action-badge {
		padding: 8px 12px; /* was 4px 10px */
	}
	.thought-pill {
		padding: 10px 14px; /* was 6px 14px */
	}
}
```

**Acceptance Criteria:**

- [ ] All tap targets ≥ 44px on mobile
- [ ] Desktop layout unchanged

**Impact:** High — Dramatically improves mobile UX
**Effort:** Low — ~1 hour dev time

---

### UX-05: Multi-Line Input Field

**Problem:** Single-line `<input>` is limiting for long messages. Users expect Shift+Enter for newlines.

**Solution:** Replace with auto-expanding `<textarea>`.

**Design:**

**Before:**

```
┌─────────────────────────────────────────┐
│  [Type here...              ] [Send]    │  ← Single line
└─────────────────────────────────────────┘
```

**After (Auto-Expanding):**

```
┌─────────────────────────────────────────┐
│  ┌──────────────────────────────────┐   │
│  │ Line 1                           │   │  ← Expands to fit content
│  │ Line 2                           │   │     (max 5 lines, then scroll)
│  └──────────────────────────────────┘   │
│                                [Send]    │
└─────────────────────────────────────────┘
```

**Behavior:**

- Enter: Submit (current behavior)
- Shift+Enter: New line
- Auto-expand up to 5 lines, then scroll
- Mobile: Same behavior

**Technical Implementation:**

```svelte
<!-- Replace <input> with <textarea> -->
<textarea
	bind:value={userInput}
	placeholder="Ask the expert..."
	rows="1"
	style="resize: none; overflow-y: auto; max-height: 8em;"
	onkeydown={(e) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
		// Auto-resize
		e.currentTarget.style.height = 'auto';
		e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
	}}
/>
```

**Acceptance Criteria:**

- [ ] Enter submits, Shift+Enter adds newline
- [ ] Textarea auto-expands to fit content
- [ ] Max 5 lines visible, then scroll
- [ ] Placeholder text remains

**Impact:** Medium — Quality of life improvement
**Effort:** Low — ~2 hours dev time

---

### UX-06: Subtree Collapse/Expand

**Problem:** Large trees become cluttered. No way to hide branches you're not interested in.

**Solution:** Add collapse/expand toggle on nodes with children.

**Design:**

**Expanded Node (with children):**

```
┌─────────────────────────────────────────┐
│  ● User                        [−]      │  ← Collapse button
│  ─────────────────────────────           │
│  This node has children below.           │
└─────────────────────────────────────────┘
         │
         ├─ Child 1 ←─ Visible
         └─ Child 2 ←─ Visible
```

**Collapsed Node:**

```
┌─────────────────────────────────────────┐
│  ● User                        [+]      │  ← Expand button
│  ─────────────────────────────           │
│  This node has children (hidden).        │
└─────────────────────────────────────────┘
```

**Interaction:**

- Click `[−]` → Collapse → Children fade out, connections hidden
- Click `[+]` → Expand → Children fade in, connections shown
- State is per-session (not persisted by default)
- Keyboard: `Space` toggles (when focused)

**Visual Treatment:**

- Collapsed nodes show subtle badge: "3 hidden" (count of descendants)
- Connection line from collapsed node is dotted/dashed

**Technical Implementation:**

- Add `collapsed` boolean to node metadata
- Update TraekCanvas: Skip rendering children if parent is collapsed
- Add collapse button to TraekNodeWrapper header (only if `children.length > 0`)
- CSS: Transition for fade in/out

**Acceptance Criteria:**

- [ ] Collapse button appears on nodes with children
- [ ] Click to collapse hides all descendants
- [ ] Click to expand shows descendants
- [ ] Badge shows count of hidden nodes
- [ ] Keyboard shortcut (Space) works

**Impact:** High — Critical for large trees
**Effort:** Medium — ~1 day dev time

---

### UX-07: Action Badges Always Visible

**Problem:** Action badges only appear when suggested by the resolver. Users don't know what actions exist.

**Solution:** Show all actions as "inactive" badges, highlight when suggested.

**Design:**

**Before (Current):**

```
┌─────────────────────────────────────────┐
│  (no badges visible until you type)     │
│  ┌──────────────────────────────────┐   │
│  │ Type here...                     │   │
│  └──────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

**After (Always Visible):**

```
┌─────────────────────────────────────────┐
│  [🖼️ Image] [🧪 Debug] [🔁 Repeat]      │  ← All actions, inactive
│  ┌──────────────────────────────────┐   │
│  │ Type here...                     │   │
│  └──────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

**After (With Suggestion):**

```
┌─────────────────────────────────────────┐
│  [🖼️ Image] [🧪 Debug] [🔁 Repeat]      │  ← "Image" highlighted (suggested)
│   ^^^^^^^^^                              │     (brighter, glowing border)
│  ┌──────────────────────────────────┐   │
│  │ generate an image of...          │   │
│  └──────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

**States:**

1. **Inactive** (default): Gray, low opacity
2. **Suggested** (resolver matched): Highlighted, normal opacity
3. **Selected** (user clicked): Cyan border, brighter

**Technical Implementation:**

Update ActionBadges.svelte:

```svelte
<!-- Show ALL actions, not just suggested/selected -->
const visibleActions = $derived(actions); // was: actions.filter(...)

<button
	class="action-badge"
	class:suggested={suggestedIds.includes(action.id)}
	class:selected={selectedIds.includes(action.id)}
	...
/>
```

Update CSS:

```css
.action-badge {
	opacity: 0.4; /* Inactive */
}
.action-badge.suggested {
	opacity: 1;
	animation: pulse 2s ease-in-out infinite;
}
.action-badge.selected {
	opacity: 1;
	border-color: #00d8ff;
}
```

**Acceptance Criteria:**

- [ ] All actions are visible by default
- [ ] Suggested actions are highlighted
- [ ] Selected actions have cyan border
- [ ] Visual states are distinct

**Impact:** Medium — Improves action discoverability
**Effort:** Low — ~2 hours dev time

---

## 🟡 P2: Quality of Life Improvements

### UX-08: Node Ghost Preview

**Problem:** Users don't know where a new node will appear when they type.

**Solution:** Show a faint "ghost" outline of the new node position when input is focused.

**Design:**

**Active Node Selected (Reply Mode):**

```
┌─────────────────────────────────────────┐
│  ● User (ACTIVE)                         │
│  ─────────────────────────────           │
│  Selected message.                       │
└─────────────────────────────────────────┘
         │
         └─ ┌·······························┐  ← Ghost preview
            ·  Your reply will appear here  ·     (dotted border, low opacity)
            └·······························┘
```

**No Active Node (New Thread):**

```
┌─────────────────────────────────────────┐
│                                         │
│         ┌·······························┐  ← Ghost at center
│         ·  New thread starts here      ·
│         └·······························┘
│                                         │
└─────────────────────────────────────────┘
```

**Technical Implementation:**

- Show ghost when input is focused (`onfocus` / `onblur`)
- Position: Same as `addNode()` logic (below parent or at center)
- CSS: `border: 2px dashed rgba(0, 216, 255, 0.3)`, `opacity: 0.5`
- Transition: Fade in/out (200ms)

**Acceptance Criteria:**

- [ ] Ghost appears when input is focused
- [ ] Ghost disappears when input is blurred
- [ ] Position matches where node will be created
- [ ] Ghost is clearly "preview" (dashed border, low opacity)

**Impact:** Medium — Helps users understand reply context
**Effort:** Medium — ~0.5 day dev time

---

### UX-09: Connection Fading

**Problem:** With many branches, connection lines overlap and become hard to trace.

**Solution:** Fade out non-highlighted connections when a node is active.

**Design:**

**Before (All Connections Same Opacity):**

```
         ┌─────┐
         │ Root│
         └─────┘
       ╱    │    ╲
   ┌───┐ ┌───┐ ┌───┐   ← All connections equally visible
   │ A │ │ B │ │ C │      (hard to trace)
   └───┘ └───┘ └───┘
```

**After (Active Node B → Highlight Path, Fade Others):**

```
         ┌─────┐
         │ Root│
         └─────┘
       ╱    ┃    ╲
   ┌───┐ ┌───┐ ┌───┐   ← Thick cyan line to B
   │ A │ │ B │ │ C │      Faded lines to A/C
   └───┘ └═══┘ └───┘      (B is active)
         ↑ Active
```

**Technical Implementation:**

Update TraekCanvas.svelte connection rendering:

```svelte
{#each engine.nodes as node}
  {@const isOnActivePath = /* check if in context path */}
  <path
    class="connection"
    class:faded={engine.activeNodeId && !isOnActivePath}
    d={pathD}
  />
{/each}
```

CSS:

```css
.connection {
	opacity: 1;
	transition: opacity 0.2s;
}
.connection.faded {
	opacity: 0.2; /* Fade non-active connections */
}
```

**Acceptance Criteria:**

- [ ] Connections to/from active node are full opacity
- [ ] Other connections fade to 20% opacity
- [ ] Transition is smooth (200ms)
- [ ] Works with complex trees

**Impact:** Medium — Improves readability of large trees
**Effort:** Low — ~0.5 day dev time

---

### UX-10: Improved Error Visibility

**Problem:** Error states are shown in small header text, easy to miss.

**Solution:** Make errors more prominent.

**Design:**

**Current (Error in Header):**

```
┌─────────────────────────────────────────┐
│  ◆ Assistant · Error: Request failed    │  ← Small, easy to miss
│  ─────────────────────────────           │
│  (no content)                            │
└─────────────────────────────────────────┘
```

**New (Red Border + Icon):**

```
╔═════════════════════════════════════════╗  ← Red border (thick)
║  ◆ Assistant                        ⚠️  ║
║  ─────────────────────────────           ║
║  ┌─────────────────────────────────┐    ║
║  │  ⚠️ Error: Request failed       │    ║  ← Error card inside node
║  │  [Retry] [Dismiss]              │    ║
║  └─────────────────────────────────┘    ║
╚═════════════════════════════════════════╝
```

**Technical Implementation:**

Update TraekNodeWrapper.svelte:

```svelte
{#if node.status === 'error'}
	<div class="error-banner">
		<span class="error-icon">⚠️</span>
		<span class="error-message">{node.errorMessage ?? 'An error occurred'}</span>
		<button onclick={() => retryNode(node.id)}>Retry</button>
	</div>
{/if}
```

CSS:

```css
.message-node-wrapper.error {
	border: 2px solid #ff3e00;
	box-shadow: 0 0 20px rgba(255, 62, 0, 0.3);
}
.error-banner {
	background: rgba(255, 62, 0, 0.1);
	padding: 12px;
	border-radius: 8px;
	display: flex;
	gap: 8px;
	align-items: center;
}
```

**Acceptance Criteria:**

- [ ] Error nodes have red border
- [ ] Error banner is inside node content
- [ ] Retry button triggers re-send (if `onRetry` prop provided)
- [ ] Dismiss button hides error (clears `status`)

**Impact:** Medium — Improves error handling UX
**Effort:** Low — ~0.5 day dev time

---

### UX-11: Context Path Breadcrumb

**Problem:** Users lose track of where they are in deep trees. The "Context: 5 Nodes" stat is not actionable.

**Solution:** Add clickable breadcrumb showing the path from root to active node.

**Design:**

**Top-Left Breadcrumb (Appears When Active Node Exists):**

```
┌─────────────────────────────────────────┐
│  Root > Planning > Technical > Detail   │  ← Clickable breadcrumb
│   ^       ^          ^           ^      │     (each is a link)
│  [×]    Click to navigate               │
└─────────────────────────────────────────┘
```

**Click Behavior:**

- Click "Root" → Focus root node (pan to center it)
- Click "Planning" → Focus that node
- Click [×] → Clear active node (deselect)

**Mobile:**

Collapse to "… > Parent > Active" on small screens

**Technical Implementation:**

New component: `src/lib/ContextBreadcrumb.svelte`

```svelte
<script lang="ts">
	let { engine, onNodeClick } = $props();
	const path = $derived(engine.contextPath());
</script>

{#if path.length > 1}
	<div class="context-breadcrumb">
		{#each path as node, i}
			<button onclick={() => onNodeClick(node.id)}>
				{node.content?.slice(0, 20) ?? node.type}
			</button>
			{#if i < path.length - 1}
				<span class="separator">></span>
			{/if}
		{/each}
	</div>
{/if}
```

Add to TraekCanvas:

```svelte
<ContextBreadcrumb {engine} onNodeClick={(id) => engine.focusOnNode(id)} />
```

**Acceptance Criteria:**

- [ ] Breadcrumb appears when active node exists
- [ ] Click node in breadcrumb → focus that node
- [ ] Breadcrumb is responsive (collapses on mobile)
- [ ] Separator is clear (> or /)

**Impact:** Medium — Improves navigation in deep trees
**Effort:** Medium — ~0.5 day dev time

---

## 🟢 P3: Nice-to-Have Polish

### UX-12: Empty State Design

**Problem:** Blank canvas is uninviting.

**Solution:** Add welcoming empty state with clear CTA.

**Design:**

```
┌─────────────────────────────────────────┐
│                                         │
│         ╭─────────────────────╮         │
│         │   👋 Welcome to     │         │
│         │      Træk          │         │
│         │                    │         │
│         │  Start a new       │         │
│         │  conversation      │         │
│         │  below             │         │
│         │        ↓           │         │
│         ╰─────────────────────╯         │
│                                         │
│  [Type your first message here...    ] │
└─────────────────────────────────────────┘
```

**Acceptance Criteria:**

- [ ] Empty state shows when `engine.nodes.length === 0`
- [ ] Arrow points to input field
- [ ] Message is encouraging

**Impact:** Low — Cosmetic improvement
**Effort:** Low — ~1 hour dev time

---

### UX-13: Minimap/Overview

**Problem:** Hard to see "big picture" of large trees.

**Solution:** Add minimap in corner (similar to VS Code).

**Design:**

**Bottom-Right Minimap:**

```
┌─────────────────────────────────────────┐
│                                    ┌───┐│
│                                    │   ││  ← Minimap (120×80px)
│                                    │ ▪ ││     Shows all nodes as dots
│                                    │▪▪ ││     Viewport = white rectangle
│                                    │ ▪ ││
│                                    └───┘│
└─────────────────────────────────────────┘
```

**Interaction:**

- Click minimap → Pan to that location
- Drag viewport rectangle → Pan canvas

**Technical Implementation:**

- New component: `src/lib/Minimap.svelte`
- Render nodes as colored dots (user = cyan, assistant = orange)
- Viewport rectangle = white outline
- Canvas element for performance

**Acceptance Criteria:**

- [ ] Minimap shows all nodes
- [ ] Viewport rectangle is accurate
- [ ] Click to navigate works
- [ ] Minimap is toggleable (hide when not needed)

**Impact:** Low — Useful for very large trees (50+ nodes), but not critical
**Effort:** High — ~2-3 days dev time

---

## Implementation Roadmap

### Sprint 1 (P0: Critical UX)

1. **UX-02: Canvas Interaction Hints** — 0.5 day
2. **UX-01: Onboarding Tour** — 1.5 days
3. **UX-03: Keyboard Navigation (Foundation)** — 3 days

**Total:** ~1 week

### Sprint 2 (P1: High-Value Wins)

1. **UX-04: Touch Target Size** — 0.25 day
2. **UX-05: Multi-Line Input** — 0.25 day
3. **UX-07: Action Badges Always Visible** — 0.25 day
4. **UX-06: Subtree Collapse** — 1 day

**Total:** ~2 days

### Sprint 3 (P2: Quality of Life)

1. **UX-09: Connection Fading** — 0.5 day
2. **UX-10: Improved Error Visibility** — 0.5 day
3. **UX-11: Context Breadcrumb** — 0.5 day
4. **UX-08: Node Ghost Preview** — 0.5 day

**Total:** ~2 days

### Sprint 4 (P3: Polish)

1. **UX-12: Empty State** — 0.25 day
2. **UX-13: Minimap** — 2.5 days (optional, low priority)

**Total:** ~3 days (or skip minimap)

---

## Metrics to Track

After implementing these improvements, track:

1. **Onboarding Completion Rate** — % of users who complete the tour
2. **Time to First Message** — How long until user sends first message
3. **Bounce Rate** — % of users who leave without interacting
4. **Feature Discovery** — % of users who try pan/zoom, branching, actions
5. **Mobile Engagement** — % of mobile users who complete a conversation
6. **Keyboard Usage** — % of users who use keyboard shortcuts

---

## Conclusion

These 13 improvements will transform Traek from "interesting prototype" to "production-ready spatial conversation UI". The highest-impact changes are:

1. **Onboarding** — Makes the product accessible to first-time users
2. **Keyboard Navigation** — Critical for accessibility + power users
3. **Subtree Collapse** — Enables use with large trees
4. **Touch Improvements** — Makes mobile usable

Implement P0 and P1 first for maximum ROI.
