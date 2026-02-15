# UX Audit: Traek Spatial Conversation UI

**Date:** 2026-02-15
**Auditor:** UX Designer (Claude)
**Product Version:** Current main branch

---

## Executive Summary

Traek presents a novel paradigm shift from linear chat to spatial conversation trees. The core interaction model is **ambitious and well-executed**, but suffers from **discoverability issues** and **inconsistent feedback mechanisms**. The product works well for power users who understand the metaphor, but presents a steep learning curve for first-time users.

**Key Strengths:**
- Clean visual hierarchy with clear parent-child connections
- Smooth pan/zoom interactions with thoughtful edge-case handling
- Excellent streaming implementation with auto-scroll
- Sophisticated action suggestion system with slash commands

**Critical Gaps:**
- No onboarding or feature discovery mechanism
- Visual feedback is too subtle in key interactions
- Mobile/touch experience needs refinement
- Accessibility largely unaddressed
- Keyboard navigation completely missing (planned but not implemented)

---

## 1. Interaktionsdesign

### 1.1 Canvas Navigation (Pan, Zoom, Node Selection)

#### ✅ Strengths

**Pan & Zoom Implementation:**
- Trackpad detection heuristic (`deltaMode === 0` + no Ctrl) works well in practice
- Pinch-to-zoom on touch devices is smooth and responsive
- Offset clamping prevents nodes from being lost off-canvas
- Smooth easing function (`easeOutCubic`) for focus animations feels polished

**Node Selection:**
- Click on node header activates it (sets as reply context)
- Active state is clearly visible with cyan border glow
- Escape key deselects (good affordance for keyboard users)

**Connection Lines:**
- Rectilinear paths with rounded corners are visually clean
- Highlighted connection path (context path) helps trace conversation flow
- Two-pass rendering (base connections, then highlighted) ensures visual hierarchy

#### ⚠️ Problems

**Pan/Zoom Discoverability:**
- **Problem:** Nothing indicates the canvas is pannable/zoomable
- **Evidence:** First-time users will not know to drag or pinch-zoom
- **Impact:** High — breaks the entire spatial metaphor if users don't discover this

**Mouse vs Trackpad Confusion:**
- **Problem:** Mouse wheel zooms (as expected), but trackpad two-finger scroll also zooms if it's detected as `deltaMode: 1`
- **Evidence:** Lines 541-567 in TraekCanvas.svelte — heuristic is imperfect
- **Impact:** Medium — occasionally frustrating for trackpad users

**No Visual Zoom Indicator:**
- **Problem:** Stats bar shows zoom % (top-right), but it's too small and easy to miss
- **Impact:** Low — users can still zoom, just harder to know current level

**Node Dragging UX:**
- **Problem:** Dragging only works on **active** nodes, not any node
- **Evidence:** Lines 576-590 check `engine.activeNodeId === id` before allowing drag
- **Impact:** Medium — non-obvious; users expect to drag any node
- **Rationale:** Likely intentional to avoid accidental moves, but needs better signaling

**Touch Scrolling Inside Nodes:**
- **Problem:** `findScrollable()` checks for overflow content, but if a node's markdown content is long and user tries to pan near it, touch is consumed
- **Evidence:** Lines 283-284, 496-514 — scrollable detection is good, but interaction feels "sticky"
- **Impact:** Medium — frustrating on mobile when trying to pan past a long node

#### 🔧 Recommendations

1. **Add Canvas Interaction Tutorial** — Show pan/zoom hints on first visit (dismissible overlay)
2. **Visual Zoom Level Indicator** — Larger, more prominent zoom display (or integrated into stats bar)
3. **Enable Dragging for Any Node** — Remove the "only active node" restriction, or add a drag handle icon when hovering
4. **Refine Touch Pan Detection** — Increase threshold for "this is a pan, not a scroll" to reduce stickiness

---

### 1.2 Spatial Metaphor ("Messages as Nodes on Canvas")

#### ✅ Strengths

**Spatial Layout Logic:**
- Auto-layout algorithm (`flushLayoutFromRoot()`) positions children horizontally, siblings vertically — logical and readable
- Grid snapping (`gridStep: 20px`) keeps layout tidy
- Nodes stay in view (offset clamping) — no risk of "losing" conversations

**Parent-Child Visual Links:**
- Connection lines make tree structure explicit
- Highlighted path (cyan) clearly shows "reply context"

#### ⚠️ Problems

**Metaphor Not Self-Evident:**
- **Problem:** Users coming from linear chat have no mental model for "spatial conversation tree"
- **Evidence:** Landing page explains the concept, but the demo does not
- **Impact:** High — users will be confused on first interaction

**No Minimap or Overview:**
- **Problem:** With 50+ nodes, it's hard to see the "big picture" of the conversation structure
- **Evidence:** Minimap is in the backlog (backlog.md) but not implemented
- **Impact:** Medium — becomes critical as trees grow large

**Reply Context Not Obvious:**
- **Problem:** The "context info" pill at the bottom says "Reply linked to selected message" or "New thread in center", but it's easy to miss
- **Impact:** Medium — users may not realize they're branching vs. continuing a thread

#### 🔧 Recommendations

1. **First-Time Tour** — Animated walkthrough of: "Click to select → Type to reply → See it branch"
2. **Visual "Ghost" Preview** — When hovering over input field, show a faint outline of where the new node will appear
3. **Context Path Breadcrumb** — Show clickable breadcrumb trail (Root → Parent → Active) somewhere on screen

---

### 1.3 Input Experience (Floating Input, Action Badges, Slash Commands)

#### ✅ Strengths

**Floating Input Design:**
- Bottom-center position is accessible and doesn't obstruct canvas
- Glassmorphism (backdrop blur) looks polished
- Context info pill is informative ("Reply linked" vs. "New thread")

**Action Badges:**
- Smart suggestion system (keyword matching + optional LLM resolution) is innovative
- Visual design (pill badges with icons) is clean and clickable
- Toggle behavior (click to select/deselect) is intuitive

**Slash Commands:**
- Dropdown appears above input (good positioning)
- Arrow key navigation works well
- Command completion on Enter is smooth

#### ⚠️ Problems

**Action Badges Discoverability:**
- **Problem:** Badges only appear when the resolver suggests them (after typing)
- **Evidence:** Lines 1024-1031 in TraekCanvas.svelte — badges are hidden if `suggestedIds.length === 0`
- **Impact:** Medium — users won't know actions exist until they type something that triggers them

**Slash Command Discoverability:**
- **Problem:** Users must type `/` to discover slash commands
- **Evidence:** No visual hint that `/` does anything special
- **Impact:** Medium — common UX pattern, but still relies on prior knowledge

**Action Badge Feedback:**
- **Problem:** When an action is selected, there's no confirmation beyond the border color change
- **Impact:** Low — works, but could be more delightful (micro-animation?)

**Input Placeholder:**
- **Problem:** "Ask the expert..." is vague
- **Impact:** Low — doesn't communicate what Traek does differently

**No Multi-Line Input:**
- **Problem:** Single-line `<input>` limits long messages
- **Impact:** Medium — users expect to Shift+Enter for new lines

#### 🔧 Recommendations

1. **Action Badges Always Visible** — Show all available actions as "inactive" badges, highlight when suggested
2. **Slash Command Hint** — Add small "Type / for commands" text in placeholder or near input
3. **Multi-Line Textarea** — Replace `<input>` with auto-expanding `<textarea>`
4. **Micro-Animations** — Add subtle scale/glow animation when action badge is toggled
5. **Better Placeholder** — "Reply to this message, or start a new branch..."

---

### 1.4 Consistency & Predictability

#### ✅ Strengths

- Transitions are consistent (0.2s ease-out for most interactions)
- Color coding is consistent (cyan = user/active, orange = assistant)
- Grid snapping ensures nodes don't drift

#### ⚠️ Problems

**Inconsistent Cursor States:**
- **Problem:** Viewport is `cursor: grab`, but no `cursor: grabbing` during pan (only during node drag)
- **Evidence:** Line 1098 sets `grabbing` class only when `isDragging || draggingNodeId`
- **Impact:** Low — minor visual inconsistency

**Node Header Click vs. Node Content Click:**
- **Problem:** Clicking node header activates; clicking content (to select text) also activates
- **Evidence:** Lines 115-118 in TraekNodeWrapper.svelte — header is a button, but clicking anywhere on node also triggers activation
- **Impact:** Medium — confusing when trying to select text

**Thought Panel Expand State:**
- **Problem:** Thought panel collapses when you click away (no persistence)
- **Impact:** Low — expected behavior, but could be annoying if you want to keep it open

#### 🔧 Recommendations

1. **Fix Cursor During Pan** — Add `cursor: grabbing` to viewport when `isDragging`
2. **Prevent Activation on Text Selection** — Only activate node on header click, not content area
3. **Persist Thought Panel State** — Save expand/collapse state per node

---

## 2. Visuelles Design

### 2.1 Visual Hierarchy

#### ✅ Strengths

**Clear Role Differentiation:**
- User nodes: top border cyan (`--traek-node-user-border-top`)
- Assistant nodes: top border orange (`--traek-node-assistant-border-top`)
- Active node: glowing cyan border + scale transform (1.02)

**Typography Hierarchy:**
- Node header: uppercase, small (10px) — clearly secondary
- Node content: 14px, line-height 1.6 — readable
- Stats bar: monospace — appropriate for metadata

**Connection Lines:**
- Base connections: `#333` (subtle)
- Highlighted path: cyan, thicker (2.5px) — clear emphasis

#### ⚠️ Problems

**Active vs. Focused Ambiguity:**
- **Problem:** "Active" (reply target) uses the same visual language as "focused" would
- **Evidence:** Keyboard navigation spec (keyboard-navigation.md) mentions separate "focused" state, but current UI only has "active"
- **Impact:** Medium — will be critical when keyboard nav is implemented

**Stats Bar Too Subtle:**
- **Problem:** Top-right stats (zoom %, context length) are easy to miss
- **Impact:** Low — useful info, but not critical

**Thought Panel Visual Weight:**
- **Problem:** Thought panel header (pill) looks too similar to a disabled action badge
- **Impact:** Low — still discoverable via icon and label

**Connection Line Clutter:**
- **Problem:** With many branches, connections overlap and become hard to trace
- **Impact:** Medium — gets worse as trees grow

#### 🔧 Recommendations

1. **Differentiate Active vs. Focused** — Active = cyan border; Focused = thick outline ring (when keyboard nav added)
2. **Enlarge Stats Bar** — Increase font size or add subtle background
3. **Connection Line Opacity Control** — Fade non-highlighted connections when an active node is selected
4. **Z-Index for Active Nodes** — Bring active node to front (currently all nodes are same z-index)

---

### 2.2 Dark/Light Theme Support

#### ✅ Strengths

- All colors use CSS custom properties (`--traek-*`)
- Landing page has theme toggle
- Syntax highlighting changes with theme (highlight.js dark/light)

#### ⚠️ Problems

**Incomplete Theme Toggle:**
- **Problem:** Theme toggle works on landing page, but TraekCanvas does not respect it
- **Evidence:** TraekCanvas uses hardcoded dark theme colors (e.g., `background: #0b0b0b`)
- **Impact:** Medium — inconsistent experience

**Theme Persistence:**
- **Problem:** Theme choice is not saved across sessions
- **Impact:** Low — minor UX friction

#### 🔧 Recommendations

1. **Apply Theme to Canvas** — Use CSS variables consistently in TraekCanvas
2. **Persist Theme Choice** — Save to localStorage

---

### 2.3 Information Density

#### ✅ Strengths

- Nodes are not overcrowded — 16px padding, readable font sizes
- Thought panel is collapsible (reduces clutter)
- Viewport intersection detection hides off-screen nodes (performance + visual simplicity)

#### ⚠️ Problems

**Node ID in Header:**
- **Problem:** "ID: abc1" is shown in every node header, but rarely useful
- **Impact:** Low — adds clutter

**Stats Bar Always Visible:**
- **Problem:** "100% | Context: 5 Nodes" is always shown, even when not needed
- **Impact:** Low — takes up space, but small

**No Collapse/Expand for Subtrees:**
- **Problem:** Large branches cannot be collapsed to simplify view
- **Evidence:** Mentioned in keyboard-navigation.md (Space to toggle expand), but not implemented
- **Impact:** High — critical for large trees

#### 🔧 Recommendations

1. **Hide Node ID by Default** — Show only on hover or in debug mode
2. **Collapsible Subtrees** — Add collapse/expand button on nodes with children
3. **Toggle Stats Bar** — Add keyboard shortcut (e.g., `S`) to hide/show stats

---

## 3. Onboarding / Discoverability

### 3.1 First-Time User Experience

#### Current Flow (Demo Page)

1. User lands on `/demo/[id]`
2. Canvas loads with "initialOverlay" (if provided)
3. Overlay fades when a node appears OR when no active node
4. Input field is visible at bottom

**Problems:**

**No Guided Tour:**
- **Problem:** User sees blank canvas with floating input, but no instructions
- **Impact:** Critical — high bounce rate for first-time users

**Feature Discovery:**
- **Problem:** Action badges, slash commands, branching, pan/zoom, node dragging — all hidden until user stumbles upon them
- **Impact:** Critical — users will not discover 80% of the product

**Metaphor Explanation:**
- **Problem:** Landing page explains "spatial conversations", but demo does not reinforce this
- **Impact:** High — users won't understand why the UI is different

#### 🔧 Recommendations

**Mandatory First-Time Tour:**

1. **Step 1: Welcome** — "This is Traek — conversations that branch, not scroll"
2. **Step 2: Pan & Zoom** — "Drag to pan, pinch or scroll+Ctrl to zoom"
3. **Step 3: Send a Message** — "Type a message and press Enter"
4. **Step 4: Reply & Branch** — "Click a message to select it, then reply to create a branch"
5. **Step 5: Actions** — "Use actions (badges) or slash commands (/) for special modes"

**Progressive Disclosure:**
- Show tooltips on first hover over key UI elements (input, action badge, node)
- Add subtle animations to draw attention (e.g., input field pulses on first load)

**Empty State:**
- When canvas is empty, show a centered card with "Start your first conversation"

---

### 3.2 Feature Discoverability

**Current Issues:**

| Feature | How to Discover | Discoverability Score |
|---------|----------------|---------------------|
| Pan/Zoom | Trial & error | 🔴 Poor |
| Node Selection | Click anywhere | 🟡 Fair |
| Branching | Select node → reply | 🔴 Poor |
| Action Badges | Type → see suggestions | 🟡 Fair |
| Slash Commands | Know to type `/` | 🔴 Poor |
| Node Dragging | Try to drag active node | 🔴 Poor |
| Thought Panel | Notice pill → click | 🟡 Fair |
| Keyboard Shortcuts | Not implemented | N/A |

#### 🔧 Recommendations

1. **Help Overlay (`?` key)** — Show all features + shortcuts (planned in keyboard-navigation.md)
2. **Contextual Hints** — Show small "?" icons next to new features
3. **Changelog/What's New** — On updates, show new features in a modal

---

## 4. Mobile / Touch Experience

### 4.1 Touch Navigation

#### ✅ Strengths

**Pinch-to-Zoom:**
- Two-finger pinch works smoothly (lines 260-336 in TraekCanvas.svelte)
- Zoom follows finger midpoint (good UX)

**Touch Pan:**
- Single-finger drag pans canvas (when not over scrollable content)
- Detects scrollable content and lets it consume touch (lines 283-284)

**Node Dragging on Touch:**
- Touch drag on active node works (lines 288-300)

#### ⚠️ Problems

**Touch Targets Too Small:**
- **Problem:** Node header is only 10px padding, action badges are 4px padding
- **Evidence:** Lines 243-244 in TraekNodeWrapper.svelte, lines 60-61 in ActionBadges.svelte
- **Impact:** High — hard to tap on mobile

**Floating Input Obstructs Canvas:**
- **Problem:** Input is fixed at bottom, covering ~20% of viewport on mobile
- **Impact:** Medium — reduces visible canvas area

**Slash Dropdown Positioning:**
- **Problem:** Dropdown appears above input (`bottom: 100%`), which can push it off-screen on small viewports
- **Impact:** Medium — slash commands harder to use on mobile

**No Touch Feedback:**
- **Problem:** No visual feedback on touch (e.g., ripple effect)
- **Impact:** Low — feels less responsive

**Accidental Pan While Scrolling Node:**
- **Problem:** If user touches near edge of scrollable node content, touch might be interpreted as pan
- **Impact:** Medium — frustrating

#### 🔧 Recommendations

1. **Increase Touch Targets** — 44px minimum (iOS HIG standard) for all tappable elements
2. **Collapsible Input** — Add button to hide input temporarily (free up canvas space)
3. **Mobile-Optimized Dropdown** — Position slash dropdown as bottom sheet on mobile
4. **Touch Ripple Effect** — Add Material-style ripple on tap
5. **Improve Scrollable Detection** — Increase threshold for "this element is scrollable"

---

### 4.2 Small Screen Adaptations

#### Current Behavior

- Canvas is full-screen (`height: 100vh`)
- Input container has `max-width: calc(min(600px, 100vw) - 3rem)` — responsive
- Stats bar stays top-right (no mobile override)

#### ⚠️ Problems

**Stats Bar Overlaps Content:**
- **Problem:** On narrow screens, stats bar text can overlap nodes
- **Impact:** Low — rare, but annoying

**Action Badges Wrap:**
- **Problem:** Badges wrap to multiple lines, taking up more space
- **Impact:** Low — acceptable behavior

**Back Button on Demo Page:**
- **Problem:** Fixed top-left position can overlap nodes when zoomed in
- **Impact:** Low — minor visual issue

#### 🔧 Recommendations

1. **Hide Stats on Mobile** — Or move to a collapsible panel
2. **Smaller Action Badges** — Reduce padding and font size on mobile
3. **Z-Index Management** — Ensure back button is always above canvas

---

## 5. Accessibility

### 5.1 Keyboard Accessibility

#### Current State

**Implemented:**
- `Escape` to deselect node (line 830 in TraekCanvas.svelte)
- Input field is keyboard-accessible
- Slash dropdown has arrow key navigation (SlashCommandDropdown.svelte)

**Missing:**
- **No tab order** for nodes
- **No focus management** (cannot tab through nodes)
- **No keyboard shortcuts** for pan/zoom/navigate (planned in keyboard-navigation.md)

#### Impact

**Critical Accessibility Failure:**
- Screen reader users cannot navigate the canvas
- Keyboard-only users cannot select nodes (except via Escape to deselect)
- Power users have no keyboard shortcuts

#### 🔧 Recommendations

**Immediate:**
1. **Add Tab Order** — Nodes should be focusable with `tabindex="0"`
2. **ARIA Attributes** — Add `role="tree"`, `role="treeitem"`, `aria-expanded`, etc.
3. **Focus Indicators** — Clear visual focus ring (separate from "active" state)

**Future (as per keyboard-navigation.md):**
1. **Keyboard Navigator** — Implement full keyboard navigation (hjkl, arrows, gg, etc.)
2. **Help Overlay** — `?` to show shortcuts

---

### 5.2 ARIA & Semantic HTML

#### Current State

**Implemented:**
- Viewport has `role="grid"` (line 818)
- Slash dropdown has `role="listbox"`, items have `role="option"` (lines 52, 57)
- Thought panel spinner has `role="status"` (line 129 in TraekNodeWrapper.svelte)
- Error messages have `role="alert"` (line 134)

**Missing:**
- Nodes have no `role` (should be `role="treeitem"`)
- No `aria-label` on viewport
- No `aria-describedby` for input field
- No `aria-live` for streaming content
- Connection lines (SVG) have no ARIA labels

#### Impact

**Medium Accessibility Failure:**
- Screen readers can partially navigate, but structure is unclear
- Streaming updates are not announced
- Visual connections are invisible to screen readers

#### 🔧 Recommendations

1. **Add `role="treeitem"` to Nodes** — With `aria-level`, `aria-posinset`, `aria-setsize`
2. **Add `aria-live="polite"` to Streaming Nodes** — Announce content updates
3. **Label SVG Connections** — `aria-label="Connection from Parent to Child"`
4. **Input Field Labels** — Add `aria-describedby` to explain reply context

---

### 5.3 Color Contrast

#### Current State

**Dark Theme:**
- Background: `#0b0b0b` (near-black)
- Text: `#dddddd` (light gray)
- Contrast ratio: ~12.5:1 ✅ (WCAG AAA)

**Muted Text:**
- Node header: `#666666` on `rgba(255,255,255,0.03)` (dark bg)
- Contrast ratio: ~4.1:1 ⚠️ (WCAG AA, barely passes)

**Action Badges:**
- Text: `#cccccc` on `rgba(255,255,255,0.06)`
- Contrast ratio: ~10:1 ✅

#### ⚠️ Problems

**Node ID Text Too Low Contrast:**
- **Problem:** `#444444` text (line 282 in TraekNodeWrapper.svelte) on dark background
- **Impact:** Medium — hard to read for low-vision users

#### 🔧 Recommendations

1. **Increase Node Header Contrast** — Use `#888888` instead of `#666666`
2. **Audit All CSS Variables** — Ensure 4.5:1 minimum for normal text, 3:1 for large text

---

### 5.4 Focus Management

#### Current State

**Problems:**
- No visible focus ring on nodes (`:focus-visible` not used)
- Tab order is undefined (nodes are not in DOM order)
- Focus is lost after node operations (add, delete, move)

#### Impact

**High Accessibility Failure:**
- Keyboard users cannot see where focus is
- Tab navigation is unpredictable

#### 🔧 Recommendations

1. **`:focus-visible` Styles** — Add clear focus ring (3px solid cyan)
2. **Logical Tab Order** — Top-to-bottom, left-to-right (as laid out)
3. **Restore Focus After Ops** — If active node is deleted, focus parent

---

## 6. Performance & Edge Cases

### 6.1 Large Trees (50+ Nodes)

#### Current Behavior

- Viewport intersection observer hides off-screen nodes (lines 68-83 in TraekNodeWrapper.svelte)
- Placeholder divs maintain layout when nodes are hidden

#### ✅ Strengths

- Rendering is efficient (only visible nodes are fully rendered)
- No FPS drops observed in testing (showFps option available)

#### ⚠️ Problems

**Connection Line Overdraw:**
- **Problem:** All connection SVG paths are rendered, even for off-screen nodes
- **Impact:** Low — SVG is performant, but could be optimized

**Layout Re-Calculation:**
- **Problem:** `flushLayoutFromRoot()` runs on every add/move, recalculates all descendant positions
- **Impact:** Low — fast enough for typical trees, but could lag at 100+ nodes

#### 🔧 Recommendations

1. **Lazy Connection Rendering** — Only render connections for visible nodes
2. **Incremental Layout** — Only re-layout affected subtree, not entire tree

---

### 6.2 Edge Cases

**Empty Canvas:**
- ✅ Works well — input field is visible, "New thread in center" message appears

**Single Root Node:**
- ✅ Works — node is centered

**Very Long Node Content:**
- ⚠️ Node has `max-height: 500px` with scroll (TraekNodeWrapper.svelte line 217)
- Scroll hint appears at bottom ("Scroll for more ↓")
- **Problem:** Hint is small (9px font)

**Network Error During Streaming:**
- ✅ Error state is shown in node header
- **Problem:** Error message is small and easy to miss

**Orphaned Nodes (parent deleted):**
- ⚠️ Not tested — need to verify behavior

#### 🔧 Recommendations

1. **Larger Scroll Hint** — 11px font, more prominent styling
2. **Error State More Visible** — Red border around node, not just header text
3. **Orphan Handling** — Delete children when parent is deleted, or re-parent to grandparent

---

## Summary: Priority Issues

### 🔴 Critical (Must Fix)

1. **No Onboarding Tour** — Users will not understand the product without guidance
2. **Feature Discoverability** — Pan/zoom/branching/actions are all hidden
3. **Keyboard Navigation Missing** — Accessibility failure + power user frustration
4. **ARIA Attributes Missing** — Screen reader users cannot use the product

### 🟠 High (Should Fix Soon)

1. **Touch Targets Too Small** — Mobile UX is poor
2. **No Subtree Collapse** — Large trees become unwieldy
3. **Multi-Line Input Missing** — Single-line input is limiting
4. **Theme Inconsistency** — Light/dark theme only works on landing page

### 🟡 Medium (Nice to Have)

1. **Node Dragging UX** — Only active nodes draggable (confusing)
2. **Connection Line Clutter** — Hard to trace with many branches
3. **Stats Bar Too Subtle** — Easy to miss zoom level
4. **Action Badge Discoverability** — Only visible after typing

### 🟢 Low (Polish)

1. **Node ID Clutter** — Shown in every header, rarely useful
2. **Cursor State Inconsistency** — No `grabbing` during pan
3. **Thought Panel Expand State** — Not persisted
4. **Error Message Visibility** — Too subtle in node header

---

## Conclusion

Traek's **core innovation is sound**, but the **UX execution needs refinement**. The product works beautifully for users who "get it", but has a **steep learning curve** and **significant accessibility gaps**.

The **highest ROI improvements** are:
1. First-time user onboarding (tutorial/tour)
2. Keyboard navigation implementation
3. Touch target sizes for mobile
4. Subtree collapse for large trees

With these changes, Traek will go from "interesting prototype" to "production-ready spatial conversation UI".
