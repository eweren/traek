# UX Spec: Error States, Offline Mode & Resilience

**Task:** TRK-63
**Date:** 2026-03-08
**Author:** UX Expert

---

## Overview

Traek is a canvas-based AI conversation tool where users invest significant cognitive effort building branching conversations. Any interruption — API failure, network drop, rate limit — risks losing that context and breaking flow. This spec defines a resilience layer that fails gracefully, communicates clearly, and recovers without user data loss.

---

## 1. Design Principles

1. **Silent success, loud failure** — Online/healthy states are invisible. Only degraded states are surfaced.
2. **Preserve work** — Never discard user input or partial AI output due to transient errors.
3. **Actionable errors** — Every error includes a clear recovery action; never show a dead-end.
4. **Progressive recovery** — Automatic retry where safe; manual retry where context is required.
5. **Accessibility** — All error states announced to screen readers via `role="alert"` and `aria-live`.

---

## 2. Error Taxonomy

| Code | Name | HTTP Status | Root cause | Recovery |
|---|---|---|---|---|
| `rate_limit` | Rate limited | 429 | Too many requests | Auto-retry after countdown |
| `auth_expired` | Auth expired | 401 | Session token expired | User re-authenticates |
| `server_error` | Server error | 5xx | Provider backend failure | Manual retry |
| `network` | Network error | — | Connection lost | Auto-retry on reconnect |
| `stream_interrupted` | Stream interrupted | — | SSE/fetch stream broke | Resume or retry |
| `context_limit` | Context too long | 400/context | Message exceeds max tokens | User truncates or branches |

---

## 3. Node-Level Error States

### 3.1 Current State
The existing `error-banner` in `TraekNodeWrapper` shows a generic error message with Retry and Dismiss buttons. There is no error type classification, no countdown timer, and no resume-from-partial support.

### 3.2 Proposed Error Banner Variants

#### 3.2.1 Rate Limit (429)
```
┌─────────────────────────────────────────────────────┐
│ ⏱  Rate limited — retrying in 28s                   │
│ [████████████░░░░░░░░░░░░░░░░░] 28s remaining        │
│                          [Retry now]  [Dismiss]      │
└─────────────────────────────────────────────────────┘
```
- **Color:** Amber (`#f59e0b`) — not red, this isn't an error the user caused
- **Auto-retry:** Countdown from `retryAfter` seconds (from HTTP `Retry-After` header)
- **"Retry now":** Cancels countdown and retries immediately
- **Progress bar:** Fills as countdown completes, transforms to a "Sending…" spinner on retry

#### 3.2.2 Auth Expired (401)
```
┌─────────────────────────────────────────────────────┐
│ 🔑  Session expired                                  │
│ Your session has ended. Reconnect to continue.       │
│                          [Reconnect]  [Dismiss]      │
└─────────────────────────────────────────────────────┘
```
- **Color:** Orange (`#ff4400`) — the existing assistant accent, signaling action required
- **"Reconnect":** Opens auth flow (consumer-supplied `onAuthRequired` callback)
- Does NOT auto-retry (would fail again without fresh credentials)

#### 3.2.3 Server Error (5xx)
```
┌─────────────────────────────────────────────────────┐
│ ✕  Server error                                      │
│ The AI provider returned an error. Try again.        │
│                               [Retry]  [Dismiss]     │
└─────────────────────────────────────────────────────┘
```
- **Color:** Red (`#ef4444`)
- **"Retry":** Immediate retry, no countdown

#### 3.2.4 Stream Interrupted (partial content)
```
┌─────────────────────────────────────────────────────┐
│ ↩  Stream interrupted                                │
│ Response was cut off mid-generation.                 │
│                          [Resume]  [Retry]  [Dismiss]│
└─────────────────────────────────────────────────────┘
```
- **Color:** Amber — partial, not failed
- **"Resume":** Continues from last token (appends to existing content)
- **"Retry":** Discards partial and regenerates from scratch
- **Partial content preserved** and visually marked with a trailing `▮` cursor that has stopped

#### 3.2.5 Context Too Long (400/context)
```
┌─────────────────────────────────────────────────────┐
│ ⚡  Context limit reached                            │
│ This conversation is too long for a single request.  │
│ Branch from an earlier node to continue.             │
│                    [Find branching point]  [Dismiss] │
└─────────────────────────────────────────────────────┘
```
- **Color:** Amber
- **"Find branching point":** Highlights ancestor nodes as valid branch points; scrolls canvas to the first viable branch

### 3.3 Error Data Model

The error type is stored in `node.data` (which accepts `unknown`):

```typescript
// Stored in node.data when status === 'error'
interface NodeErrorData {
  errorCode: 'rate_limit' | 'auth_expired' | 'server_error' | 'network' | 'stream_interrupted' | 'context_limit';
  retryAfter?: number;      // seconds, for rate_limit
  partialContent?: string;  // preserved partial for stream_interrupted
  httpStatus?: number;
}
```

### 3.4 Accessibility
- Error banner: `role="alert"` (already exists)
- Rate limit countdown: `aria-live="polite"` on the timer text, updated every second
- Countdown announces "Retrying in X seconds" to screen readers
- Retry/Reconnect buttons: minimum 32px height, clear focus ring

---

## 4. Streaming Failure Recovery

### 4.1 Interruption Detection
Streaming failures are detected when the SSE stream closes before the node status is set to `done`. The consumer's `onSendMessage` callback should catch fetch/SSE errors and call `engine.updateNode(id, { status: 'error', data: { errorCode: 'stream_interrupted', partialContent: currentContent } })`.

### 4.2 Visual Treatment of Partial Content
When `errorCode === 'stream_interrupted'`:
- Content displayed as-is (partial markdown)
- Trailing `▮` blinking cursor replaced by a static `·` in red to indicate interruption point
- Node border: dashed amber rather than the standard active border

### 4.3 Resume vs. Retry
| | Resume | Retry |
|---|---|---|
| Sends to API | Partial content + "continue from:" prompt | Full message history from scratch |
| Node behavior | Appends to existing content | Replaces node content |
| When to use | Stream broke but content was good | Content was garbled or wrong |

---

## 5. Offline Mode & Connection Status

### 5.1 Connection Status Component

A compact, non-intrusive indicator positioned in the **top-right** of the canvas controls area, alongside ZoomControls.

**States:**

| State | Visual | Behavior |
|---|---|---|
| Online | **Hidden** | No indicator shown — normal state is invisible |
| Offline | 🔴 "Offline · 3 queued" | Red dot, persistent, shows queued count |
| Reconnecting | 🟡 "Reconnecting…" | Amber pulsing dot, auto-dismisses on success |
| Back online | 🟢 "Back online" | Green, shown for 3s then fades out |

**Layout:**
```
┌─ Canvas top-right ─────────────────────────────────┐
│                       [● Offline · 3 queued] [+] [−]│
│                                ZoomControls ↗        │
└────────────────────────────────────────────────────-┘
```

### 5.2 Offline Message Queue

When the user sends a message while offline:
1. Message is accepted into the input field normally
2. On submit: message is added to an `offlineQueue` store (not sent)
3. Canvas shows the queued user node in a "pending" visual state (dashed border, muted opacity)
4. Toast: "You're offline — message queued"
5. On reconnect: queue is flushed in order, pending nodes updated to streaming then done

**Queue persistence:** The queue is kept in memory only (not persisted to `localStorage`) to avoid stale queued messages on page reload. Users are shown what's queued via the counter badge.

### 5.3 Offline Queue UX Details

**Queued node visual state (pending):**
```css
.message-node-wrapper.pending {
  border-style: dashed;
  border-color: var(--traek-queued-border, #3f3f46);
  opacity: 0.7;
}
```

**Queued indicator on node header:**
```
● User  · Queued (offline)
```

**Reconnect toast:**
```
✓ Back online — sending 3 queued messages
```

### 5.4 Detection Strategy
Use the `navigator.onLine` API + `online`/`offline` window events for initial detection. Supplement with a lightweight ping (if the consuming app sets an `onlinePingUrl` config) for accurate detection behind captive portals.

---

## 6. Connection Status Component Spec

### Component: `ConnectionStatus.svelte`

**Props:**
```typescript
{
  queuedCount: number;          // messages queued while offline
  onlinePingUrl?: string;       // optional URL to ping for true connectivity check
}
```

**Emitted events:**
- `onReconnect: () => void` — fired when connection is restored (consumer can flush queue)

**States machine:**
```
online ──(offline event)──→ offline ──(online event)──→ reconnecting ──(ping OK)──→ back_online ──(3s)──→ online
                                                                        └──(ping fail)──→ offline
```

**Accessibility:**
- `role="status"` on the indicator
- `aria-live="polite"` — announces changes to screen readers
- When going offline: announces "You are offline. Messages will be queued."
- When back online: announces "Connection restored. Sending queued messages."

---

## 7. Graceful Degradation

### 7.1 Feature Availability Matrix

| Feature | Offline | Rate limited | Auth expired | Server error |
|---|---|---|---|---|
| Canvas navigation (pan/zoom) | ✅ Full | ✅ Full | ✅ Full | ✅ Full |
| Reading existing nodes | ✅ Full | ✅ Full | ✅ Full | ✅ Full |
| Send new message | ⏸ Queued | ⏸ Queued after retry | ❌ Blocked | ↩ Retry |
| Collaborative editing | ❌ Disconnected | ✅ Full | ❌ Reconnect | ✅ Full |
| Search | ✅ Local only | ✅ Full | ✅ Full | ✅ Full |
| Export/save | ✅ Local | ✅ Full | ✅ Full | ✅ Full |

### 7.2 Input Form Degradation

When offline, the input form remains interactive but the submit button changes:
```
Normal:   [Send →]            (cyan, enabled)
Offline:  [Queue message ↗]   (amber, enabled — queues the message)
Auth exp: [Reconnect first]   (orange, disabled — shows auth error)
```

The form should never be fully disabled — users should always be able to compose.

---

## 8. Component Architecture

```
packages/svelte/src/lib/resilience/
├── ConnectionStatus.svelte      # online/offline indicator component
├── offlineQueue.svelte.ts       # $state-based queue store + online detection
└── index.ts                     # exports
```

### 8.1 Integration with TraekCanvas
`ConnectionStatus` is designed to be consumer-mounted alongside `TraekCanvas`, or optionally included as a slot/prop. It does not automatically embed itself to avoid layout coupling.

### 8.2 Integration with TraekNodeWrapper
The enhanced error-banner reads `node.data` for `errorCode` and `retryAfter`, then renders the appropriate variant. No breaking API changes — existing `errorMessage` string still works as fallback.

---

## 9. Token Additions

New CSS custom properties for the resilience layer:

```css
/* Error states */
--traek-error-bg:          rgba(239, 68, 68, 0.08);
--traek-error-border:      rgba(239, 68, 68, 0.3);
--traek-error-text:        #ef4444;
--traek-error-btn-bg:      rgba(239, 68, 68, 0.15);
--traek-error-btn-hover:   rgba(239, 68, 68, 0.25);

/* Warning / amber states (rate limit, stream interrupted) */
--traek-warn-bg:           rgba(245, 158, 11, 0.08);
--traek-warn-border:       rgba(245, 158, 11, 0.3);
--traek-warn-text:         #f59e0b;
--traek-warn-btn-bg:       rgba(245, 158, 11, 0.15);

/* Offline queue */
--traek-queued-border:     #3f3f46;
--traek-queued-opacity:    0.7;

/* Connection status */
--traek-status-offline:    #ef4444;
--traek-status-reconnect:  #f59e0b;
--traek-status-online:     #10b981;
```

---

## 10. Acceptance Criteria

- [ ] Rate limit error shows countdown timer and auto-retries when it reaches 0
- [ ] Auth expired error shows "Reconnect" and invokes `onAuthRequired` callback
- [ ] Server error shows retry button; re-attempts the request
- [ ] Stream interruption preserves partial content, offers Resume and Retry
- [ ] Context limit error guides user to branch from an earlier node
- [ ] `ConnectionStatus` is hidden when online, appears within 500ms of going offline
- [ ] Messages sent while offline are queued and flushed in order on reconnect
- [ ] All error/status changes are announced via `aria-live` to screen readers
- [ ] All interactive error actions meet 44×44px touch target minimum
- [ ] Canvas navigation (pan/zoom) remains fully functional in all degraded states
- [ ] Input form never fully disabled — always allows composing
- [ ] New CSS tokens documented and added to theme system
