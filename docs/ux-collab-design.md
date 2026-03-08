# UX Design: Multi-User Canvas Collaboration

**Task:** TRK-32
**Author:** UX Expert
**Date:** 2026-03-07
**Status:** Complete — ready for dev implementation

---

## 1. User Flow Diagrams

### Flow A: Joining a Shared Session

```
User opens shared URL / enters room ID
         │
         ▼
  Canvas loads (local engine initialises)
         │
         ▼
  CollabProvider connects to y-websocket
         │
    ┌────┴────┐
    │         │
  Success   Failure
    │         │
    ▼         ▼
  Status     "Connecting..." amber badge
  badge:     → retry (auto, 3×, exp backoff)
  "Live"     → after 3 failures: "Offline" banner
  (green)    + "Try again" button
    │
    ▼
  Presence bar appears (top-right of canvas)
  [You] avatar chip first, then remote peers
         │
         ▼
  aria-live announces: "[Name] joined the canvas"
  (polite, not assertive)
```

### Flow B: Normal Collaboration (Active Session)

```
User A moves cursor on canvas
    │
    ▼
  pointermove → provider.updateCursor({x,y})
  (throttled: max 1 update / 50ms)
    │
    ▼
  User B sees A's cursor:
  · Animated pointer SVG in A's color
  · Label chip: "[●] Alice" fades after 2s of stillness
  · Cursor moves via CSS transform (no layout reflow)
    │
    ▼
User A clicks/focuses a node
    │
    ▼
  provider.updatePresence({ activeNodeId: "n42" })
    │
    ▼
  User B sees: 2px ring in A's color around that node
  (ring fades after A unfocuses or 30s inactivity)
```

### Flow C: Concurrent Node Editing

```
User A types into node "n42"
User B simultaneously edits "n42"
         │
         ▼
  Yjs CRDT merges automatically (last-write-wins per character)
         │
         ▼
  Affected node shows "syncing..." shimmer overlay
  (max 300ms, disappears when Yjs confirms merge)
         │
         ▼
  No modal. No blocking. Silent merge.
  Both users see the merged result instantly.
```

### Flow D: Remote Node Deleted While Editing

```
User B has node "n42" focused / actively typing
User A (or system) deletes "n42"
         │
         ▼
  CollabProvider fires: onNodeDelete("n42")
         │
         ▼
  Toast notification for User B:
  "Warning: Node deleted by Alice"
  [Auto-dismiss: 5s] [Undo?] -- only if B is owner
         │
         ▼
  If B was typing: discard local draft silently
  If B was just viewing: no action needed
```

### Flow E: Remote Branch Created

```
User A branches from node "n5" -- creates "n99"
         │
         ▼
  CollabProvider fires: onNodeChange("n99")
         │
         ▼
  User B's canvas:
  · New node n99 animates in (fade + scale, 200ms)
  · Connection line draws from n5 to n99
  · If n99 is off-viewport: minimap highlights new node
    with a pulse ring (amber, 2s)
         │
         ▼
  No sound. No modal. Passive awareness.
  User B can choose to pan/focus to n99 or ignore it.
```

### Flow F: User Leaves Session

```
User A closes tab / loses connection
         │
         ▼
  WebSocket disconnect detected by y-websocket
         │
         ▼
  A's avatar chip: transitions to gray (2s fade)
  A's cursor: fades out (300ms opacity transition)
  A's node rings: fade out simultaneously
         │
         ▼
  aria-live announces: "Alice left the canvas"
         │
         ▼
  After 10s: A's presence fully removed from presence bar
  (matches cursorTimeoutMs = 10_000 in CollabConfig)
```

### Flow G: Permission Level Changes

```
Session owner changes User B from Editor to Viewer
         │
         ▼
  Server sends permission update via y-websocket metadata
         │
         ▼
  User B sees toast: "Your access changed to Viewer"
  Input field in canvas becomes read-only
  Slash commands unavailable (grayed, tooltip: "View only")
         │
         ▼
  Presence bar: B's avatar chip shows eye-icon badge
  (distinguishes viewers from editors visually)
```

---

## 2. Wireframes -- Cursor & Presence UI

### 2.1 Remote Cursor

```
CANVAS

      / (20x20px pointer SVG in user color)
     /
    /
 +-----------------+
 | * Alice         |  <- label chip
 | (user color dot |     background: user color 20% opacity
 |  name, 13px)    |     text: white, border-radius 4px
 +-----------------+     padding: 4px 8px

Behavior:
  - Chip visible: 0-2s after last cursor movement
  - Chip hidden: after 2s stillness (opacity to 0, 200ms transition)
  - Chip reappears on any movement
  - At zoom < 50%: chip hidden, cursor dot only
```

### 2.2 Presence Bar

```
Canvas Top-Right:

  [You] [Alice] [Bob] [+3]         [Live *]
   ^      ^      ^     ^              ^
   28px  28px  28px  28px          Status
  avatar avatar avatar overflow    badge

Avatar chip anatomy:
  - 28px circle
  - User initials (2 chars) or avatar image
  - Background: user color
  - Status dot (bottom-right, 8px):
    Green  = connected & active (<30s since last movement)
    Amber  = away (30s-5min no movement)
    Gray   = idle (>5min) or reconnecting
  - Tooltip on hover/focus: "Alice -- Editor"

Overflow chip (+3):
  - Opens dropdown list of hidden peers
  - Dropdown: avatar, name, status, role per row
  - Max 5 chips before collapse

Keyboard: Tab navigates chips, Enter opens tooltip
Screen reader: "3 collaborators: Alice, Bob, and 3 more"
```

### 2.3 Active Node Ring (Peer Occupancy)

```
Single peer on node:

  +-------------------------------------------+
  |  Node content: "What should we name..."   |
  +-------------------------------------------+
  ^-- 2px ring in Alice's color (opacity 0.7)
      CSS: outline: 2px solid <color>; outline-offset: 2px

Multiple peers on same node:

  +-------------------------------------------+
  |  Node content                             |
  +-------------------------------------------+
  ^-- Ring 1: Alice (violet, 2px, offset 2px)
  ^-- Ring 2: Bob   (blue,   2px, offset 6px)
  ^-- Ring 3: Carol (green,  2px, offset 10px)

  Max 5 rings. 6th+ peer: "+N" badge top-right of node
  (gray pill: "+2 more", 12px font)
```

### 2.4 Connection Status Badge

```
Bottom-left of canvas (above zoom controls):

State 1 -- Connecting:
  +-------------------+
  | o Connecting...   |  <- amber text, spinner icon
  +-------------------+

State 2 -- Connected (Live):
  +---------------+
  | * Live        |  <- green dot
  +---------------+
  Auto-hides after 3s if previously showing Connecting.

State 3 -- Disconnected:
  +------------------------------+
  | x Disconnected  [Try again]  |  <- red text + button
  +------------------------------+

  + Full-width banner strip below canvas toolbar:
  +--------------------------------------------------+
  | ! You're offline. Changes are queued.        [x] |
  |   Reconnecting in 5s...                          |
  +--------------------------------------------------+
  Background: amber-50, border-bottom: 1px amber-200
  Dismissible (x), reappears on next disconnect event.

  role="status" on badge.
  Banner: role="alert" (assertive, for screen readers).
```

### 2.5 "Syncing" Shimmer Overlay

```
Applied to node wrapper during active CRDT merge (max 300ms):

  +------------------------------------+
  |  [shimmer sweep]                   |
  |  Node content (visible underneath) |
  |  [shimmer sweep]                   |
  +------------------------------------+

CSS (dark-theme appropriate):
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  .syncing::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255,255,255,0.08) 50%,
      transparent 100%
    );
    background-size: 200% 100%;
    animation: shimmer 1s ease-in-out;
    pointer-events: none;
    border-radius: inherit;
  }

prefers-reduced-motion: skip shimmer, just fade in result.
```

---

## 3. Conflict Resolution Interaction Patterns

### 3.1 Locking Philosophy: Live Co-editing, Not Pessimistic Locking

**Decision:** Traek uses **optimistic concurrency** (Yjs CRDT), not pessimistic locking.

**Rationale:**
- Locking creates friction ("Node locked by Alice") -- frustrating in fast-paced sessions
- Yjs CRDT handles character-level merging automatically and transparently
- Traek nodes are typically read-heavy (AI responses) -- write conflicts are rare
- Pessimistic locking requires server-side state management that increases infrastructure complexity

**Exception:** Node deletion is non-reversible -- see §3.3 for deletion conflict handling.

---

### 3.2 Simultaneous Branch Creation from Same Parent

**Scenario:** Alice and Bob both click "Branch" on node "n5" simultaneously.

```
Both clients create branch nodes from "n5":
  Alice creates: n_alice (parentId: n5)
  Bob   creates: n_bob   (parentId: n5)
         │
         ▼
  Yjs Y.Map accepts both -- no conflict.
  Both nodes persist with unique IDs.
         │
         ▼
  Canvas shows n5 with 2 children.
  Connection layer draws 2 branch lines from n5.
         │
         ▼
  Alice sees: her branch + Bob's branch, side by side
  Bob   sees: his branch + Alice's branch, side by side
```

**Layout:** New sibling branches are auto-positioned using the existing `TreeLayout` algorithm with `HORIZONTAL_SPACING` between them. Siblings arriving in the same animation frame animate in together.

**No UX intervention needed.** Multiple branches from one node is core Traek behaviour.

---

### 3.3 Deletion Conflicts

**Case A: User edits a node that another user simultaneously deletes**

- CollabProvider fires `onNodeDelete(nodeId)`
- Toast: "Node deleted by Alice" (5s auto-dismiss)
- If local user had a draft in the deleted node: silently discard (draft was unsaved anyway)
- No error, no modal, no data loss that wasn't already expected

**Case B: User branches from a node that was just deleted**

```
User clicks "Branch" on node n5
Server confirms n5 was deleted 200ms ago
         │
         ▼
  Toast: "That node was just deleted."
  No orphan node created.
  Canvas re-renders without n5.
```

**Case C: Two users delete the same node simultaneously**

- `Y.Map.delete` is idempotent in Yjs -- no conflict
- Both deletions succeed silently, neither user sees an error

---

### 3.4 Permission Conflicts (Action Rejected Mid-Session)

**Scenario:** User's permission was downgraded while they were active.

```
User B (now Viewer) tries to type in a node
         │
         ▼
  Input is disabled (contenteditable="false")
  Tooltip on input area:
  "You have view-only access to this conversation."
         │
         ▼
  If B had a draft when permission changed:
  Toast: "Access changed to Viewer. Your draft was not saved."
  [Dismiss] [Request edit access]
  "Request edit access" opens mailto / in-app message to owner.
```

---

### 3.5 Notification of Remote Changes

**Principle:** Remote changes should be *discoverable*, not *intrusive*.

| Change Type            | In-Viewport Behaviour           | Out-of-Viewport Behaviour          |
|------------------------|----------------------------------|------------------------------------|
| New node               | Fade + scale animate in (200ms)  | Minimap pulse dot (amber, 2s)      |
| Node edit (by remote)  | Shimmer overlay on node          | No notification                    |
| Node deleted           | Node fades out (200ms)           | No notification                    |
| New peer joined        | Presence bar update              | aria-live announcement (polite)    |
| Peer left              | Avatar chip grays out (2s)       | aria-live announcement (polite)    |
| Permission change      | Toast (affects current user only)| Toast (affects current user only)  |

**Toast budget:** Max 2 toasts visible simultaneously. Additional toasts queue (FIFO).
Toasts auto-dismiss in 5s. Error toasts require manual dismiss.

---

## 4. Permission Levels

| Level     | Can do                                    | Cannot do            | Visual indicator   |
|-----------|-------------------------------------------|----------------------|--------------------|
| Admin     | All editing + manage members              | --                   | Shield badge       |
| Editor    | Add/edit/delete nodes, branch, send input | Manage members       | No badge           |
| Viewer    | Read, pan/zoom, see presence              | Input, edit, branch  | Eye badge          |
| Commenter | Read + add comment-type nodes             | Edit/delete/branch   | Speech bubble badge|

Permission enforcement is **server-side**. The UI reflects state optimistically but reverts and shows an error toast if the server rejects an action.

---

## 5. Accessibility Checklist

| Concern                  | Implementation                                                           |
|--------------------------|--------------------------------------------------------------------------|
| Cursor colour only       | Cursor has label chip; ring has initials fallback                        |
| Status colour only       | Dots use colour + shape; badges use colour + icon                        |
| Keyboard navigation      | Presence bar: Tab/Enter/Esc; all interactive elements reachable          |
| Screen reader awareness  | aria-live region for join/leave; role="status" for connection badge      |
| Motion sensitivity       | Shimmer, cursor interpolation, and fade animations check prefers-reduced-motion |
| Focus management         | Toasts use role="alert"; no focus hijacking on remote canvas events      |
| Touch users              | All tap targets >= 44x44px; cursors are visual-only, not touch-required  |
| Zoom/scale legibility    | Cursor labels hidden at < 50% zoom to reduce clutter                     |
