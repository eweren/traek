# Keyboard Navigation: UX Specification

**Extends:** `feature/keyboard-navigation.md`
**Focus:** Visual design, discoverability, mode transitions, and edge cases

---

## 1. Visual Fokus-Indikator

### Problem

The keyboard navigation spec defines separate "focused" and "active" states, but doesn't specify how they should look different.

- **Focused** = "Where am I navigating with keyboard?" (cursor position)
- **Active** = "What node am I replying to?" (reply target)

These must be visually distinct.

---

### Design: Focus Ring vs. Active Glow

#### Active Node (Reply Target, Mouse/Touch Selected)

```
┌─────────────────────────────────────────┐
│  ╔═════════════════════════════════╗    │
│  ║  ● User                         ║    │  ← Glowing cyan border
│  ║  ─────────────────────────────  ║    │     (current implementation)
│  ║  This is the active node.       ║    │     box-shadow: 0 0 20px rgba(0,216,255,0.15)
│  ║  Replies will branch from here. ║    │     border-color: #00d8ff
│  ╚═════════════════════════════════╝    │     transform: scale(1.02)
└─────────────────────────────────────────┘
```

**Current CSS:**

```css
.message-node-wrapper.active {
	border-color: #00d8ff;
	box-shadow: 0 0 30px rgba(0, 216, 255, 0.15);
	transform: scale(1.02);
}
```

**Keep as-is** — Already well-designed.

---

#### Focused Node (Keyboard Navigation)

```
┌─────────────────────────────────────────┐
│    ╔═════════════════════════════════╗  │  ← Thick outline ring (NEW)
│    ║  ◆ Assistant                    ║  │     outline: 3px solid #00d8ff
│    ║  ─────────────────────────────  ║  │     outline-offset: 3px
│    ║  This is the focused node.      ║  │     border remains default
│    ║  Arrow keys navigate from here. ║  │     NO scale transform
│    ╚═════════════════════════════════╝  │     NO inner glow
└─────────────────────────────────────────┘
```

**New CSS:**

```css
.message-node-wrapper:focus-visible {
	outline: 3px solid var(--traek-focus-ring, #00d8ff);
	outline-offset: 3px;
	/* Do NOT change border, box-shadow, or transform */
}
```

**Rationale:**

- **Outline** (outside border) is standard for keyboard focus (WCAG guideline)
- **Outline-offset** creates visual separation from node edge
- **No scale transform** — focus should not move content (causes layout shift)
- **Color matches active** — cyan is already the "selection" color in Traek

---

#### Both Active AND Focused (Common Case)

```
┌─────────────────────────────────────────┐
│    ╔═════════════════════════════════╗  │  ← Outline ring (focus)
│    ║╔═══════════════════════════════╗║  │     + inner glow (active)
│    ║║  ● User                       ║║  │     + scale transform
│    ║║  ───────────────────────────  ║║  │
│    ║║  This is active AND focused.  ║║  │
│    ║╚═══════════════════════════════╝║  │
│    ╚═════════════════════════════════╝  │
└─────────────────────────────────────────┘
```

**Combined CSS:**

```css
.message-node-wrapper.active:focus-visible {
	/* Active styles (glow, scale) */
	border-color: #00d8ff;
	box-shadow: 0 0 30px rgba(0, 216, 255, 0.15);
	transform: scale(1.02);

	/* Focus styles (outline ring) */
	outline: 3px solid var(--traek-focus-ring, #00d8ff);
	outline-offset: 3px;
}
```

**Visual Effect:**

- Inner glow (active) + outer ring (focus) = clearly "this is the most important node"
- Scale transform still applies (active state)

---

### Animation: Focus Ring Pulse (Subtle)

When navigating with keyboard, pulse the focus ring once to draw attention.

```css
@keyframes focus-pulse {
	0% {
		outline-width: 3px;
		outline-color: rgba(0, 216, 255, 1);
	}
	50% {
		outline-width: 5px;
		outline-color: rgba(0, 216, 255, 0.6);
	}
	100% {
		outline-width: 3px;
		outline-color: rgba(0, 216, 255, 1);
	}
}

.message-node-wrapper:focus-visible {
	outline: 3px solid #00d8ff;
	outline-offset: 3px;
	animation: focus-pulse 0.4s ease-out;
}
```

**Effect:** Single, quick pulse when focus changes (not infinite loop).

---

### Dark vs. Light Theme

**Dark Theme (Default):**

- Focus ring: `#00d8ff` (cyan)
- Contrast ratio: ~10:1 against `#0b0b0b` background ✅

**Light Theme:**

- Focus ring: `#0088cc` (darker cyan for better contrast)
- Contrast ratio: ~4.5:1 against `#fafafa` background ✅

```css
:root {
	--traek-focus-ring: #00d8ff; /* Dark theme */
}

:root[data-theme='light'] {
	--traek-focus-ring: #0088cc; /* Light theme */
}
```

---

## 2. Keyboard Shortcut Discoverability

### Problem

Users won't know keyboard shortcuts exist unless we tell them.

---

### Solution 1: Help Overlay (`?` key)

**Trigger:** Press `?` anywhere on canvas (when not typing in input)

**Design:**

```
╔═════════════════════════════════════════════════════════════╗
║  Keyboard Shortcuts                                    [×]  ║
╠═════════════════════════════════════════════════════════════╣
║                                                             ║
║  Navigation                   Actions                      ║
║  ───────────────────────────  ─────────────────────────    ║
║  j / ↓    Next sibling        Enter    Activate node      ║
║  k / ↑    Prev sibling        i        Focus input        ║
║  h / ←    Parent node         b        Branch from node   ║
║  l / →    First child         /        Slash commands     ║
║  g g      Jump to root        Space    Expand/collapse    ║
║  G        Jump to leaf        Esc      Deselect           ║
║                                                             ║
║  Canvas                       Help                         ║
║  ───────────────────────────  ─────────────────────────    ║
║  z z      Center on node      ?        Show this help     ║
║  + / =    Zoom in                                          ║
║  - / _    Zoom out                                         ║
║  0        Reset zoom                                       ║
║                                                             ║
║                         [Close] or press ? again           ║
╚═════════════════════════════════════════════════════════════╝
```

**Behavior:**

- Press `?` → Show overlay (fade in, 200ms)
- Press `?` again → Hide overlay (fade out)
- Press `Esc` → Hide overlay
- Click outside → Hide overlay
- Overlay is centered, semi-transparent backdrop

**Technical Implementation:**

New component: `src/lib/keyboard/KeyboardHelpOverlay.svelte`

```svelte
<script lang="ts">
	let { show, onClose } = $props();
</script>

{#if show}
	<div class="help-overlay-backdrop" onclick={onClose} transition:fade>
		<div class="help-overlay-card" onclick={(e) => e.stopPropagation()}>
			<header>
				<h2>Keyboard Shortcuts</h2>
				<button onclick={onClose}>×</button>
			</header>
			<div class="help-grid">
				<!-- Navigation section -->
				<!-- Actions section -->
				<!-- etc. -->
			</div>
		</div>
	</div>
{/if}
```

**Acceptance Criteria:**

- [ ] `?` key shows/hides overlay
- [ ] Overlay is visually clear (two-column grid)
- [ ] Click outside closes overlay
- [ ] Esc closes overlay

---

### Solution 2: Tooltips on First Hover (Progressive Disclosure)

**Trigger:** First time user hovers over a node (within first 5 minutes of session)

**Design:**

```
┌─────────────────────────────────────────┐
│  ╔═════════════════════════════════╗    │
│  ║  ● User                         ║    │
│  ║  ───────────────────────────    ║    │
│  ║  Hello world                    ║    │
│  ╚═════════════════════════════════╝    │
│         │                               │
│         └─► 💡 Tip: Press 'h' to       │  ← Tooltip (fades in)
│             navigate to parent          │     Shown once per session
└─────────────────────────────────────────┘
```

**Tooltip Content (Randomized):**

1. "Press 'j' to navigate down"
2. "Press '?' to see all shortcuts"
3. "Press 'i' to focus input"
4. "Press 'Enter' to activate this node"

**Behavior:**

- Show tooltip 1 second after first hover
- Auto-dismiss after 4 seconds
- Mark as shown in sessionStorage (`traek-tooltip-shown: true`)

**Technical Implementation:**

Add to TraekNodeWrapper:

```svelte
{#if showTooltip}
	<div class="keyboard-tooltip" transition:fade>
		💡 Tip: {tooltipText}
	</div>
{/if}
```

**Acceptance Criteria:**

- [ ] Tooltip appears on first hover (once per session)
- [ ] Tooltip auto-dismisses
- [ ] Tooltip is unobtrusive

---

### Solution 3: Shortcut Hints in Context Menu (Future)

**Trigger:** Right-click on node → Show context menu with shortcuts

**Design:**

```
┌─────────────────────────────┐
│  Activate          Enter    │
│  Branch from...    b        │
│  Collapse          Space    │
│  Delete            Delete   │
│  ──────────────────────     │
│  Show shortcuts    ?        │
└─────────────────────────────┘
```

**Not implemented in initial version** — but good future enhancement.

---

## 3. Mode-Switching: Navigation vs. Text Input

### Problem

Vim-style `hjkl` keys conflict with typing in the input field.

**Example:**

- User is typing "hello" in input field
- Pressing `h` should insert "h", not navigate to parent node

---

### Solution: Explicit Mode Switching

#### Modes

1. **Navigation Mode** (Default)
   - Keyboard shortcuts active
   - Input field is blurred
   - Focus is on canvas/nodes

2. **Input Mode**
   - Keyboard shortcuts disabled (except Esc)
   - Input field is focused
   - Typing goes to input

---

#### Transitions

```
┌─────────────────────────────────────────┐
│  Navigation Mode                        │
│  ─────────────────                      │
│  • Shortcuts active (hjkl, etc.)        │
│  • Input field blurred                  │
│                                         │
│  Press 'i' → Input Mode                 │
│  Press '/' → Input Mode (slash command) │
└─────────────────────────────────────────┘
         │
         ↓
┌─────────────────────────────────────────┐
│  Input Mode                             │
│  ──────────                             │
│  • Shortcuts disabled                   │
│  • Input field focused                  │
│  • Typing goes to input                 │
│                                         │
│  Press Esc → Navigation Mode            │
│  Press Enter → Send + Navigation Mode   │
└─────────────────────────────────────────┘
```

---

#### Visual Indicator

**Navigation Mode:**

- Input field has subtle blue outline: `outline: 1px dashed #00d8ff88`
- Placeholder text: "Press 'i' to type..."

**Input Mode:**

- Input field has solid border: `border: 2px solid #00d8ff`
- Placeholder text: "Type your message..."

**CSS:**

```css
/* Navigation mode (input blurred) */
.input-wrapper {
	outline: 1px dashed rgba(0, 216, 255, 0.5);
}

/* Input mode (input focused) */
.input-wrapper:focus-within {
	outline: none;
	border: 2px solid #00d8ff;
}
```

---

#### Technical Implementation

Update KeyboardNavigator:

```typescript
class KeyboardNavigator {
	mode = $state<'navigation' | 'input'>('navigation');

	handleKeydown(e: KeyboardEvent): boolean {
		// If in input mode, ignore all shortcuts except Esc
		if (this.mode === 'input' && e.key !== 'Escape') {
			return false; // Let input handle the key
		}

		// Navigation mode: handle shortcuts
		if (e.key === 'i') {
			this.enterInputMode();
			return true;
		}
		// ... other shortcuts
	}

	enterInputMode() {
		this.mode = 'input';
		document.querySelector('input')?.focus();
	}

	exitInputMode() {
		this.mode = 'navigation';
		document.querySelector('input')?.blur();
	}
}
```

Update TraekCanvas:

```svelte
<input
	bind:value={userInput}
	placeholder={navigator?.mode === 'input' ? 'Type your message...' : "Press 'i' to type..."}
	onfocus={() => navigator?.enterInputMode()}
	onblur={() => navigator?.exitInputMode()}
	onkeydown={(e) => {
		if (e.key === 'Escape') {
			navigator?.exitInputMode();
			e.currentTarget.blur();
		}
	}}
/>
```

---

#### Arrow Key Behavior in Input

**Problem:** Arrow keys should move cursor in input, not navigate nodes.

**Solution:** Arrow keys only navigate when input is blurred (navigation mode).

```typescript
handleKeydown(e: KeyboardEvent) {
  if (this.mode === 'input') {
    return false; // Input handles arrow keys
  }

  // Navigation mode: arrow keys navigate nodes
  if (e.key === 'ArrowDown') {
    this.goToNextSibling();
    return true;
  }
  // ...
}
```

---

#### Special Case: Slash Commands

**Problem:** Slash command dropdown should appear immediately when user types `/`, even in navigation mode.

**Solution:** `/` key triggers input mode AND types `/` character.

```typescript
handleKeydown(e: KeyboardEvent) {
  if (e.key === '/') {
    this.enterInputMode();
    // Let the input field receive the '/' character
    // (don't preventDefault)
    return false;
  }
}
```

---

### Acceptance Criteria

- [ ] Default mode is navigation (input blurred)
- [ ] Press `i` → Input mode (input focused)
- [ ] Press Esc → Navigation mode (input blurred)
- [ ] Arrow keys navigate in navigation mode, move cursor in input mode
- [ ] `/` key enters input mode and types `/`
- [ ] Visual indicator shows current mode

---

## 4. Edge Cases

### Edge Case 1: End of Branch (Leaf Node)

**Scenario:** User is on a leaf node (no children) and presses `l` (go to first child).

**Current Behavior (Spec):**

- Do nothing (no child exists)

**UX Problem:**

- No feedback — user doesn't know if the key worked

**Solution:**

- **Visual feedback:** Flash the focus ring red for 200ms
- **Audio feedback (optional):** Play subtle "error" sound (system beep)

**Implementation:**

```typescript
goToFirstChild() {
  const current = this.getFocusedNode();
  const child = this.getFirstChild(current);

  if (!child) {
    // Flash red focus ring
    this.showErrorFeedback(current.id);
    return;
  }

  this.focusedNodeId = child.id;
}

showErrorFeedback(nodeId: string) {
  const el = document.querySelector(`[data-node-id="${nodeId}"]`);
  el?.classList.add('navigation-error');
  setTimeout(() => el?.classList.remove('navigation-error'), 200);
}
```

**CSS:**

```css
.message-node-wrapper.navigation-error {
	outline: 3px solid #ff3e00 !important;
	animation: shake 0.2s;
}

@keyframes shake {
	0%,
	100% {
		transform: translateX(0);
	}
	25% {
		transform: translateX(-4px);
	}
	75% {
		transform: translateX(4px);
	}
}
```

---

### Edge Case 2: Empty Canvas (No Nodes)

**Scenario:** Canvas has no nodes, user presses navigation keys.

**Current Behavior (Spec):**

- No nodes to navigate → do nothing

**UX Problem:**

- User is confused — nothing happens

**Solution:**

- **Disable navigation mode** when canvas is empty
- **Show hint:** "Press 'i' to start a conversation"

**Implementation:**

```typescript
handleKeydown(e: KeyboardEvent) {
  if (this.engine.nodes.length === 0) {
    if (e.key === 'i') {
      this.enterInputMode();
      return true;
    }
    // All other keys: show hint
    this.showEmptyCanvasHint();
    return false;
  }
  // ... normal navigation
}

showEmptyCanvasHint() {
  // Flash a tooltip: "No nodes to navigate. Press 'i' to start."
}
```

---

### Edge Case 3: First Sibling / Last Sibling (Boundary)

**Scenario 1:** User is on the first sibling and presses `k` (prev sibling).

**Current Spec:** "Go to parent if no prev sibling"

**UX Issue:** Jumping to parent is unexpected — user expects to stay on current node.

**Proposal (Alternative Behavior):**

- Do nothing (stay on current node)
- Flash focus ring (same as "end of branch")

**OR (Keep Spec Behavior, Add Feedback):**

- Go to parent as specified
- Show brief tooltip: "→ Moved to parent (no prev sibling)"

**Decision:** Keep spec behavior (go to parent), add tooltip.

---

**Scenario 2:** User is on the last sibling and presses `j` (next sibling).

**Current Spec:** "Go to first child if no next sibling"

**UX Issue:** Same as above — jumping is unexpected.

**Proposal:** Show tooltip when wrapping.

---

### Edge Case 4: Multiple Root Threads

**Scenario:** Canvas has 3 root threads (no parent). User presses `1`, `2`, `3` to jump.

**Current Spec:** "Jump to nth root thread"

**UX Issue:** If there are only 2 roots and user presses `3`, what happens?

**Solution:**

- If `n > rootCount`, flash error feedback
- Show tooltip: "Only 2 root threads exist"

---

### Edge Case 5: Rapid Key Presses (Debouncing)

**Scenario:** User rapidly presses `jjjjj` (next sibling 5 times).

**UX Issue:**

- If navigation triggers focus animation (pan to center node), rapid presses cause janky animation
- Focus animation duration is 280ms (config.focusDurationMs)

**Solution:**

- **Debounce focus animation:** Don't pan on every keystroke, only after user stops typing
- **OR:** Make animation faster when navigating (e.g., 150ms instead of 280ms)

**Proposal:** Faster animation for keyboard nav.

```typescript
goToNextSibling() {
  this.focusedNodeId = nextSibling.id;
  this.centerOnNode(nextSibling, { durationMs: 150 }); // Faster for keyboard nav
}
```

---

### Edge Case 6: Node Deleted While Focused

**Scenario:** User is focused on a node, then another user (or the same user in another window) deletes that node.

**UX Issue:** Focused node no longer exists — focus is lost.

**Solution:**

- On node deletion, if `focusedNodeId === deletedNodeId`:
  - Move focus to parent (or next sibling if no parent)
  - Show tooltip: "Node deleted, moved to parent"

**Implementation:**

```typescript
// In TraekEngine.deleteNode()
deleteNode(nodeId: string) {
  const node = this.nodes.find(n => n.id === nodeId);
  // ... delete node ...

  // Notify navigator
  if (this.navigator?.focusedNodeId === nodeId) {
    const parent = this.nodes.find(n => n.id === node.parentId);
    this.navigator.focusedNodeId = parent?.id ?? null;
  }
}
```

---

## 5. Accessibility (ARIA)

### ARIA Attributes for Keyboard Nav

**Viewport (Tree Container):**

```html
<div role="tree" aria-label="Conversation tree" aria-multiselectable="false" tabindex="0"></div>
```

**Nodes (Tree Items):**

```html
<div
	role="treeitem"
	aria-level="{depth}"
	aria-posinset="{siblingIndex + 1}"
	aria-setsize="{siblingCount}"
	aria-selected="{isActive}"
	aria-expanded="{hasChildren ? !isCollapsed : undefined}"
	tabindex="{isActive || isFocused ? 0 : -1}"
	data-node-id="{node.id}"
></div>
```

**Keyboard Help Overlay:**

```html
<div role="dialog" aria-modal="true" aria-labelledby="help-title">
	<h2 id="help-title">Keyboard Shortcuts</h2>
	<!-- ... -->
</div>
```

---

### Screen Reader Announcements

**On Focus Change:**

```html
<div aria-live="polite" aria-atomic="true" class="sr-only">
	{#if focusedNode} Focused on {focusedNode.role} message: {focusedNode.content.slice(0, 50)} {/if}
</div>
```

**On Navigation Error:**

```html
<div aria-live="assertive" aria-atomic="true" class="sr-only">
	{#if errorMessage} {errorMessage} {/if}
</div>
```

Example: "No child node. Staying on current node."

---

## 6. Summary: UX Requirements for Keyboard Nav

### Must-Have (P0)

- [x] **Distinct visual states** for focused vs. active
- [x] **Focus ring** (outline, 3px, cyan) separate from active glow
- [x] **Mode switching** (navigation vs. input) with visual indicator
- [x] **Help overlay** (`?` key) showing all shortcuts
- [x] **Error feedback** (red flash) when navigation fails
- [x] **ARIA attributes** for screen readers

### Should-Have (P1)

- [x] **Tooltip hints** on first hover (progressive disclosure)
- [x] **Focus pulse animation** when navigating
- [x] **Debounced focus animation** for rapid keypresses
- [x] **Edge case handling** (empty canvas, end of branch, etc.)

### Nice-to-Have (P2)

- [ ] **Context menu** with shortcut hints (right-click)
- [ ] **Audio feedback** for navigation errors
- [ ] **Customizable keybindings** (user preferences)

---

## Appendix: Full CSS Reference

```css
/* Focus ring (keyboard navigation) */
.message-node-wrapper:focus-visible {
	outline: 3px solid var(--traek-focus-ring, #00d8ff);
	outline-offset: 3px;
	animation: focus-pulse 0.4s ease-out;
}

/* Active node (reply target) */
.message-node-wrapper.active {
	border-color: var(--traek-node-active-border, #00d8ff);
	box-shadow: 0 0 30px var(--traek-node-active-glow, rgba(0, 216, 255, 0.15));
	transform: scale(1.02);
}

/* Both active AND focused */
.message-node-wrapper.active:focus-visible {
	outline: 3px solid var(--traek-focus-ring, #00d8ff);
	outline-offset: 3px;
	border-color: var(--traek-node-active-border, #00d8ff);
	box-shadow: 0 0 30px var(--traek-node-active-glow, rgba(0, 216, 255, 0.15));
	transform: scale(1.02);
}

/* Navigation error (red flash) */
.message-node-wrapper.navigation-error {
	outline: 3px solid #ff3e00 !important;
	animation: shake 0.2s;
}

/* Focus pulse animation */
@keyframes focus-pulse {
	0% {
		outline-width: 3px;
		outline-color: rgba(0, 216, 255, 1);
	}
	50% {
		outline-width: 5px;
		outline-color: rgba(0, 216, 255, 0.6);
	}
	100% {
		outline-width: 3px;
		outline-color: rgba(0, 216, 255, 1);
	}
}

/* Shake animation (error feedback) */
@keyframes shake {
	0%,
	100% {
		transform: translateX(0);
	}
	25% {
		transform: translateX(-4px);
	}
	75% {
		transform: translateX(4px);
	}
}

/* Input mode indicator */
.input-wrapper {
	outline: 1px dashed rgba(0, 216, 255, 0.5);
	transition: all 0.2s;
}

.input-wrapper:focus-within {
	outline: none;
	border: 2px solid #00d8ff;
}

/* Screen reader only (for announcements) */
.sr-only {
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	white-space: nowrap;
	border-width: 0;
}
```

---

## Conclusion

This UX spec provides the missing visual and interaction design details for keyboard navigation. Key additions:

1. **Clear visual language** — Focus ring vs. active glow
2. **Discoverability** — Help overlay (`?`), tooltips, mode indicators
3. **Mode switching** — Explicit navigation vs. input modes
4. **Edge case handling** — Error feedback, empty canvas, boundaries
5. **Accessibility** — ARIA attributes, screen reader announcements

With this spec, the keyboard navigation feature will be both powerful for expert users and accessible for everyone.
