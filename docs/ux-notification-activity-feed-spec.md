# UX Design: Notification System & Activity Feed

**Task:** TRK-76
**Author:** UX Expert
**Date:** 2026-03-08
**Status:** Complete — ready for dev implementation

---

## 0. Context & Constraints

Traek is a spatial, tree-structured canvas for AI conversations. Notifications must not disrupt focus. The existing `Toast.svelte` / `toastStore.svelte.ts` system already covers ephemeral, non-blocking alerts. This spec builds on top of that foundation and defines the *persistent* notification layer: an activity feed, @-mention alerts, branch-follow alerts, notification preferences, and do-not-disturb mode.

**Design principles for this feature:**
- **Non-intrusive by default.** Spatial canvas work demands deep focus. Notifications surface only what is contextually relevant.
- **Progressive disclosure.** Minimal chrome while working; details on demand via the activity feed panel.
- **No interruption without consent.** DND mode is a first-class citizen, not an afterthought.
- **Collab-native.** Extends the existing presence layer (`CollabProvider`, `useCollab`) without duplicating it.

---

## 1. Information Architecture

```
Notification System
├── Ephemeral layer (existing)
│   └── Toast.svelte + toastStore — auto-dismiss alerts
├── Persistent layer (new)
│   ├── Activity Feed — panel showing all events with timestamps
│   ├── @-Mention Notifications — highlights + unread badge
│   └── Branch Follow Alerts — new responses on watched branches
└── Control layer (new)
    ├── Notification Preferences — per-type on/off toggles
    └── Do-Not-Disturb — global suppression with schedule option
```

---

## 2. Toast Extensions (Ephemeral Layer)

The existing `toastStore` needs two new types to cover notification-specific events:

### 2.1 New Toast Types

| Type | Trigger | Duration | Dismiss |
|------|---------|----------|---------|
| `mention` | User @-mentioned in a node | 8s | Manual or auto |
| `branch_update` | New response on followed branch | 5s | Auto |

### 2.2 Toast: @-Mention

```
+--------------------------------------------------+
| @  Alice mentioned you in "Design alternatives"  |
|    "...what do you think @Bob about..."          |  ← excerpt (60 char max)
|                                    [Go to node]  |
+--------------------------------------------------+
Progress bar: 8s, cyan accent (#00d8ff)
```

- Clicking "Go to node" calls `engine.focusOnNode(nodeId)` and dismisses the toast.
- Icon: `@` symbol in a cyan circle.
- Screen reader: `role="alert"`, text: "Alice mentioned you in node: Design alternatives."

### 2.3 Toast: Branch Update

```
+--------------------------------------------------+
| ↳  New response on branch "Cost analysis"        |
|                                    [View branch]  |
+--------------------------------------------------+
Progress bar: 5s, purple accent (#a78bfa)
```

- Only fires when the user has explicitly followed a branch.
- Max 1 branch-update toast per branch per 30s (deduplicated to avoid spam when AI streams multiple chunks).

---

## 3. Activity Feed Panel

### 3.1 Overview

A slide-in side panel anchored to the right edge of the canvas. Triggered by the bell icon in the canvas toolbar (top-right, near presence bubbles). Shows a chronological log of canvas events relevant to the current user.

### 3.2 Trigger & Layout

```
CANVAS TOOLBAR (top-right):

  [●Alice] [●Bob]  [🔔 3]  [Live ●]
                      ^
                   Bell icon
                   Unread badge (red pill)
                   Keyboard: Alt+N / Opt+N
```

Panel opens to the left of the toolbar, overlaying the canvas edge:

```
+----------------------------------+
| Activity                    [×]  |
|----------------------------------|
| Today                            |
|  [●] Alice mentioned you         |
|      in "Design alts"  · 2m ago  |
|      → [Go to node]              |
|                                  |
|  [↳] New response on "Budget"   |
|      from Claude · 5m ago        |
|      → [View branch]             |
|                                  |
|  [+] Bob added node "Mockups"   |
|      12m ago                     |
|                                  |
| Yesterday                        |
|  [●] Alice joined the canvas     |
|      9:42 AM                     |
|                                  |
| [Mark all as read]               |
+----------------------------------+
Width: 320px
Max-height: 480px (scrollable)
Animation: slide-in from right (200ms ease-out)
Backdrop: none (non-modal; canvas remains interactive)
```

### 3.3 Activity Item Anatomy

```
[icon] [actor name] [action description]
       [target context]           [time]
       → [CTA link if applicable]
```

**Fields:**
- `icon` — 20px colored circle with event-type symbol
- `actor` — user name (or "Claude" for AI responses)
- `action` — past-tense verb phrase (12-13px, neutral text)
- `target` — node title in quotes (truncated at 40 chars with ellipsis)
- `time` — relative (< 1h: "Xm ago"; < 24h: "H:MM AM/PM"; older: "Mon D")
- `cta` — optional action link (mention → "Go to node"; branch → "View branch")

**Read vs unread:**
- Unread items: left border `2px solid var(--traek-accent-cyan)`, slightly brighter background
- Read items: no border, standard card background
- Clicking an item marks it read

### 3.4 Event Types Tracked

| Event | Icon | Color | Actor |
|-------|------|-------|-------|
| @-mention | `@` | cyan | Mentioning user |
| Branch update (followed) | `↳` | purple | AI or user |
| Node added by peer | `+` | green | Peer user |
| Node deleted by peer | `−` | red (dim) | Peer user |
| Peer joined | `→` | blue | Peer user |
| Peer left | `←` | gray | Peer user |
| Permission changed | `⚙` | amber | Admin |
| Branch created by peer | `⎇` | violet | Peer user |

**Filtered events:** Node edits (too noisy), cursor movements, AI streaming chunks.

### 3.5 Empty State

```
+----------------------------------+
|         🔔                       |
|   No activity yet                |
|   Events from your canvas        |
|   collaborators will appear here |
+----------------------------------+
```

### 3.6 Unread Count Badge

- Red pill on bell icon: shows count of unread items (max display: "9+")
- Disappears when panel is opened (all items marked read on panel open)
- Persists across sessions (stored in `localStorage` keyed to `roomId`)
- `aria-label` on bell button: "Activity feed, 3 unread notifications"

### 3.7 Keyboard Navigation

| Key | Action |
|-----|--------|
| `Alt+N` / `Opt+N` | Toggle activity feed panel |
| `Escape` | Close panel, return focus to canvas |
| `Tab` | Navigate items in the panel |
| `Enter` on item | Activate the item's CTA (if any) |
| `M` on item | Mark item read/unread |

---

## 4. @-Mention Notifications in Node Content

### 4.1 Mention Detection

When a user types `@` in the input form, autocomplete triggers showing active canvas peers:

```
┌─ Input form ────────────────────────────────────┐
│  What do you think @█                           │
│                                                  │
│  ┌──────────────────────┐                        │
│  │ ● Alice (active)     │                        │
│  │   Bob                │                        │
│  └──────────────────────┘                        │
└──────────────────────────────────────────────────┘
```

**Autocomplete behaviour:**
- Appears after typing `@` followed by ≥ 1 character
- Filters peers by display name (case-insensitive prefix match)
- Shows max 5 results; scrollable if more
- Arrow keys + Enter to select; Escape to dismiss without selecting
- Selecting inserts `@username` as a styled inline mention chip

### 4.2 Mention Chip (in rendered node)

```
 ┌──────────────────────────────────────┐
 │ What do you think [●Bob] about       │
 │ this approach?                       │
 └──────────────────────────────────────┘
```

**Mention chip anatomy:**
- Background: user's presence color at 20% opacity
- Border: 1px solid user color at 40% opacity
- Text: "@Bob" in user color
- Border-radius: 4px
- `aria-label="Mention: Bob"`
- Non-interactive in rendered mode; hovering shows tooltip with full name

### 4.3 Notification Delivery

When a node containing `@username` is submitted:
1. The mention is detected client-side via regex `/(?<![a-zA-Z0-9])@([a-zA-Z0-9_-]+)/g`
2. A mention event is emitted via `CollabProvider` to all peers
3. The named peer receives:
   - A `mention` toast (see §2.2)
   - An unread item in their activity feed
4. The node title in the activity feed entry is inferred from: the node's content first 50 chars, or the node's explicit title if set.

### 4.4 In-Node Mention Highlight (for the mentioned user)

The node that contains the mention is rendered with:
- A subtle left border `3px solid var(--traek-accent-cyan)` on the node wrapper
- A small `@` badge (top-right corner of the node, 16px cyan circle)
- Hovering the badge: tooltip "You were mentioned here"
- The badge fades after the mentioned user visits/focuses the node

---

## 5. Branch Follow / Watch System

### 5.1 User Flow: Following a Branch

```
User clicks "…" context menu on a node
         │
         ▼
  Context menu includes:
  "Follow this branch  [no icon]"
         │
         ▼
  Toast: "You'll be notified of new responses on this branch."
  (3s, auto-dismiss)
         │
         ▼
  Branch node header shows: [👁 Watching] badge (subtle, 12px gray)
```

**Alternatively:** From the activity feed panel, a branch update item has "Follow branch" as a secondary CTA.

### 5.2 Un-following a Branch

- Click the `[👁 Watching]` badge → context menu: "Stop following" / "Unfollow"
- Or: Notification Preferences panel → "Followed branches" → manage list

### 5.3 Alert Deduplication

- Max 1 alert per branch per 30s (prevents AI streaming chunk spam)
- If multiple responses arrive in quick succession, batch into one: "3 new responses on 'Budget'"
- DND mode suppresses all branch alerts (see §6)

### 5.4 Persistent Storage

Followed branches stored in `localStorage` as `traek:follows:{roomId}` — JSON array of node IDs. Cleared when the user leaves the session permanently (tab close after disconnect).

---

## 6. Notification Preferences UI

### 6.1 Access Point

```
CANVAS TOOLBAR:
  [🔔 3]  ▼ (dropdown trigger)
     │
     ├── Activity feed
     └── Notification settings…
```

Also accessible from the canvas gear/settings menu.

### 6.2 Preferences Panel

A modal dialog (not inline panel) — preferences are intentional decisions that warrant focus.

```
+------------------------------------------+
| Notification settings              [×]   |
|------------------------------------------|
| @-mentions                               |
|   [✓] Toast alert                        |
|   [✓] Activity feed                      |
|   [✓] Highlight node                     |
|                                          |
| Branch updates (followed branches)       |
|   [✓] Toast alert                        |
|   [✓] Activity feed                      |
|   [ ] Sound (off by default)             |
|                                          |
| Peer activity                            |
|   [✓] Activity feed (joins/leaves)       |
|   [ ] Toast for every join/leave         |
|   [✓] Node add/delete in feed            |
|                                          |
| Do not disturb                           |
|   [ ] Enable now                         |
|   [ ] Schedule: from [09:00] to [17:00]  |
|       [Mon] [Tue] [Wed] [Thu] [Fri]      |
|                                          |
|              [Reset to defaults] [Save]  |
+------------------------------------------+
Width: 480px, max-height: 90vh (scrollable)
```

### 6.3 Preference Storage

- Stored in `localStorage` as `traek:notification-prefs:{userId}`
- Loaded on init; defaults shown in §6.4
- No server sync needed (per-client preference)

### 6.4 Default Preferences

| Setting | Default |
|---------|---------|
| @-mention toast | ✓ On |
| @-mention feed | ✓ On |
| @-mention node highlight | ✓ On |
| Branch toast | ✓ On |
| Branch feed | ✓ On |
| Branch sound | ✗ Off |
| Peer join/leave in feed | ✓ On |
| Peer toast on join/leave | ✗ Off |
| Node add/delete in feed | ✓ On |
| DND now | ✗ Off |
| DND schedule | ✗ Off |

---

## 7. Do-Not-Disturb Mode

### 7.1 Activation

Three paths to activate DND:
1. **Quick toggle:** Bell icon → dropdown → "Enable do not disturb"
2. **Preferences panel:** (see §6.2)
3. **Keyboard:** No default shortcut (too easy to accidentally enable)

### 7.2 DND Badge

When active, the bell icon changes:

```
BEFORE: [🔔 3]   (red badge, cyan bell)
AFTER:  [🔕]     (bell-with-slash, amber tint, no unread count shown)
```

A persistent amber banner appears below the toolbar:

```
+--------------------------------------------------+
| 🔕  Do not disturb is on.   [Turn off]  [×]     |
+--------------------------------------------------+
Background: #2d2000 (dark amber), border: 1px #664d00
role="status" — polite announcement
```

Dismissing the banner (×) hides it but DND stays on. Clicking "Turn off" disables DND.

### 7.3 What DND Suppresses

| Notification type | DND behaviour |
|------------------|---------------|
| @-mention toast | Suppressed |
| Branch update toast | Suppressed |
| Peer join/leave toast | Already suppressed by default |
| Activity feed (all types) | Still collected, visible when DND ends |
| Mention highlight on node | Still shown (passive, not interruptive) |
| Unread count badge | Increments silently |

### 7.4 Scheduled DND

```
┌──────────────────────────────────────────┐
│ Schedule do not disturb                  │
│                                          │
│ From: [09:00] To: [17:00]               │
│       HH:MM       HH:MM                 │
│                                          │
│ [Mon] [Tue] [Wed] [Thu] [Fri]           │
│  ✓     ✓     ✓     ✓     ✓             │
│                                          │
│ Timezone: Europe/Berlin (detected)       │
└──────────────────────────────────────────┘
```

- Time pickers use native `<input type="time">` for accessibility
- Days are toggles (keyboard: Space to select)
- Timezone shown (read-only) — uses `Intl.DateTimeFormat().resolvedOptions().timeZone`
- Schedule stored in `traek:notification-prefs:{userId}` (same store as other prefs)

---

## 8. Data Model

### 8.1 ActivityEvent

```typescript
interface ActivityEvent {
  id: string;                        // UUID
  type: ActivityEventType;
  timestamp: number;                 // Unix ms
  actorId: string;                   // user id or 'ai'
  actorName: string;
  actorColor?: string;               // presence color
  targetNodeId?: string;
  targetNodeExcerpt?: string;        // first 50 chars of content
  mentionedUserId?: string;          // for 'mention' type
  isRead: boolean;
}

type ActivityEventType =
  | 'mention'
  | 'branch_update'
  | 'node_added'
  | 'node_deleted'
  | 'peer_joined'
  | 'peer_left'
  | 'permission_changed'
  | 'branch_created';
```

### 8.2 NotificationPreferences

```typescript
interface NotificationPreferences {
  mentionToast: boolean;
  mentionFeed: boolean;
  mentionNodeHighlight: boolean;
  branchToast: boolean;
  branchFeed: boolean;
  branchSound: boolean;
  peerActivityFeed: boolean;
  peerToast: boolean;
  nodeChangeFeed: boolean;
  dndEnabled: boolean;
  dndSchedule: DndSchedule | null;
}

interface DndSchedule {
  fromTime: string;   // "HH:MM" in 24h
  toTime: string;
  days: number[];     // 0=Sun, 1=Mon, …, 6=Sat
  timezone: string;   // IANA timezone string
}
```

### 8.3 Persistence Keys

| Key pattern | Contents |
|-------------|----------|
| `traek:activity:{roomId}` | `ActivityEvent[]` (max 200, FIFO) |
| `traek:follows:{roomId}` | `string[]` (followed node IDs) |
| `traek:notification-prefs:{userId}` | `NotificationPreferences` |

---

## 9. Component Map

| Component | Location | Purpose |
|-----------|----------|---------|
| `ActivityFeedPanel.svelte` | `lib/notifications/` | Slide-in panel, event list |
| `ActivityFeedItem.svelte` | `lib/notifications/` | Single event row |
| `activityStore.svelte.ts` | `lib/notifications/` | Reactive store for events + unread count |
| `BranchWatchBadge.svelte` | `lib/notifications/` | "Watching" badge on node header |
| `MentionChip.svelte` | `lib/notifications/` | Inline `@user` chip in node content |
| `MentionAutocomplete.svelte` | `lib/notifications/` | Dropdown in InputForm |
| `NotificationPrefsModal.svelte` | `lib/notifications/` | Settings modal |
| `DndBanner.svelte` | `lib/notifications/` | Persistent DND status banner |
| `notificationPrefs.svelte.ts` | `lib/notifications/` | Prefs store + localStorage sync |

New toast types (`mention`, `branch_update`) extend the existing `toastStore.svelte.ts` — no new file needed.

---

## 10. CSS Tokens Required

Add to `lib/theme/`:

```css
:root {
  /* Activity feed */
  --traek-feed-bg: #161616;
  --traek-feed-border: #2a2a2a;
  --traek-feed-item-bg: #1a1a1a;
  --traek-feed-item-unread-bg: #1a1f24;
  --traek-feed-item-unread-border: var(--traek-accent-cyan, #00d8ff);
  --traek-feed-item-read-text: #888;
  --traek-feed-actor-text: #ddd;
  --traek-feed-time-text: #555;

  /* Mention chip in node */
  --traek-mention-bg: rgba(0, 216, 255, 0.12);
  --traek-mention-border: rgba(0, 216, 255, 0.35);
  --traek-mention-text: #00d8ff;

  /* DND banner */
  --traek-dnd-banner-bg: #1e1500;
  --traek-dnd-banner-border: #4d3900;
  --traek-dnd-banner-text: #d4a017;

  /* Branch watch badge */
  --traek-watch-badge-bg: rgba(255, 255, 255, 0.06);
  --traek-watch-badge-text: #666;
  --traek-watch-badge-active-text: #a78bfa;
}
```

---

## 11. Accessibility Checklist

| Concern | Implementation |
|---------|---------------|
| Bell button label | `aria-label="Activity feed, {n} unread notifications"` |
| Panel role | `role="complementary"` + `aria-label="Activity feed"` |
| Focus management | Focus moves to panel on open; returns to bell on close |
| Feed item navigation | `role="list"` + `role="listitem"`; keyboard focusable |
| Unread indicator | Color + left border + `aria-label` on item (not color alone) |
| DND banner | `role="status"` (polite); screen reader reads state change |
| Mention toast | `role="alert"` (assertive) — @-mention warrants assertive |
| Branch toast | `role="status"` (polite) |
| Autocomplete | `role="listbox"` + `aria-activedescendant` pattern |
| Mention chip | `aria-label="Mention: {name}"` |
| Time inputs | Native `<input type="time">` with visible `<label>` |
| Day toggles | `role="checkbox"` with `aria-checked` |
| Reduced motion | Panel slide uses `prefers-reduced-motion`: fade instead of slide |

---

## 12. Edge Cases & Error Handling

| Case | Behaviour |
|------|-----------|
| localStorage unavailable | Silently fall back to in-memory only; no crash |
| Activity feed > 200 items | Evict oldest (FIFO), show "Older events not shown" footer |
| Mentioning a user who has left | Chip still renders; no toast delivered (no active session) |
| DND schedule spans midnight | `toTime < fromTime` is valid; handled as "from X to Y next day" |
| Multiple simultaneous branch updates | Batch: "3 new responses on 'Budget analysis'" |
| Panel open + toast fires | Toast appears as normal (panel and toasts are independent) |
| Peer changes name mid-session | Activity feed uses name at time of event; no backfill |
| `roomId` undefined (non-collab mode) | Notification system initialises but all collab events disabled |

---

## 13. Integration Points

### With `CollabProvider`

The `ActivityStore` subscribes to `CollabProvider` events:

```typescript
provider.onPresenceChange((peers) => { /* peer_joined / peer_left */ })
provider.onNodeChange((nodeId, change) => { /* node_added, branch_created */ })
provider.onNodeDelete((nodeId) => { /* node_deleted */ })
provider.onMention((event) => { /* mention */ })
```

`onMention` is a **new event** to add to `CollabProvider` — fired when a submitted node contains `@username` matching the local user.

### With `TraekEngine`

- `engine.focusOnNode(nodeId)` — called when "Go to node" CTA is clicked
- `engine.getNode(nodeId)` — used to get node excerpt for activity items

### With `InputForm`

- `MentionAutocomplete` renders inside `InputForm` and intercepts `@` keystrokes
- On peer selection, inserts `@{name}` token into the textarea value

### With `toastStore`

- `toast(message, 'mention')` and `toast(message, 'branch_update')` — new type values
- `toastStore.addToast({ …, type: 'mention', targetNodeId, actorName })` — extended interface

---

## 14. Out of Scope (Future Work)

- Email / push notification delivery
- Slack / linear integrations for canvas events
- Rich-text mention resolution (turning `@name` into user profile links)
- Notification grouping by conversation thread
- AI-generated activity summaries ("Here's what you missed")
