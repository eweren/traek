# UX Audit: Traek Playground App

**Date:** 2026-03-07
**Auditor:** UX Expert Agent
**Scope:** Playground app (`apps/playground`) — onboarding flow, canvas interactions, accessibility
**Method:** Heuristic evaluation (Nielsen's 10) + WCAG 2.1 AA review + code inspection

---

## Executive Summary

The Playground app has a clean, minimal aesthetic and a solid information architecture. The core canvas interaction is powerful. However, several **critical friction points** in the new-user journey and **accessibility failures** need attention before launch. The most damaging issue is that new users discover the missing API key requirement only after they've written and tried to send their first message — a frustrating dead-end after investment.

**Priority distribution:**
- Critical (P0): 3 issues
- High (P1): 6 issues
- Medium (P2): 5 issues
- Low (P3): 3 issues

---

## Flow: Onboarding (Sign in → BYOK Setup → First Conversation)

### P0 — API Key Not Checked on Canvas Load

**Location:** `apps/playground/src/routes/app/[id]/+page.svelte:52`

**Problem:** The `apiKeyMissing` state is only triggered after a failed `/api/chat` request. The user journey is:
1. Sign in
2. Create a new conversation
3. See an empty, inviting canvas
4. Type a message and send it
5. Discover: "No API key configured"
6. The entire canvas is replaced with an error state

This is a broken promise — the user invested in the interaction before hitting the wall. They've already started thinking spatially about their conversation.

**Recommendation:**
- On canvas mount, make a lightweight `GET /api/keys/status` call (or read a session flag) to detect whether any key is configured.
- If no key: show a non-blocking banner or guided overlay ("Add an API key to get started → Settings") rather than replacing the canvas.
- The canvas should remain visible and the input should be disabled with a clear tooltip explaining why.

---

### P0 — Delete Conversation is Hover-Only and Irreversible

**Location:** `apps/playground/src/routes/app/+page.svelte:248-266`

**Problem:** The delete button (×) on conversation list items is hidden with `opacity: 0` and only revealed via CSS `li:hover`. It is completely inaccessible to:
- Keyboard users (Tab never focuses an invisible element)
- Touch users (no hover on mobile)
- Screen reader users

Additionally, deletion is immediate with no confirmation, undo, or recovery path.

**Recommendation:**
- Remove the hover-only visibility pattern. Use a focus-within or always-visible approach.
- Option A: Show the delete button always (smaller, muted), reveal on hover/focus with color change.
- Option B: Replace with a context menu (right-click / kebab button) that is always keyboard-accessible.
- Add a brief confirmation (inline "Are you sure? Delete / Cancel") or a 3-second undo toast after deletion.

---

### P0 — Modal Focus Not Trapped (Upgrade + Share Modals)

**Location:** `apps/playground/src/routes/app/+page.svelte:124-138`, `apps/playground/src/routes/app/[id]/+page.svelte:176-191`

**Problem:** Both the upgrade modal and share modal use `role="dialog" aria-modal="true"` on the backdrop div, but:
- Focus is not trapped — keyboard users can Tab behind the modal to the page beneath
- No initial focus is set when the modal opens
- ESC key does not close the modals
- Backdrop click does not close the modals (users expect this)
- Focus is not returned to the trigger element on close

This fails WCAG 2.1 Success Criterion 2.1.2 (No Keyboard Trap) and violates the modal design pattern.

**Recommendation:**
- Use a `<dialog>` element with the native `showModal()` API, which handles focus trapping, ESC, and ARIA semantics natively.
- Or manually implement: focus the first focusable element on open, trap Tab/Shift+Tab within the modal, close on ESC and backdrop click, restore focus on close.

---

### P1 — No Indication of Existing API Keys in Settings

**Location:** `apps/playground/src/routes/app/settings/+page.svelte`

**Problem:** The settings page shows empty API key inputs regardless of whether keys are already saved. Users cannot tell if they've already set up a key. The `saved` state only persists for 2 seconds within the session.

When a user returns to settings (e.g., to rotate a key), they have no indication of the current state — is the key there? Is the service working?

**Recommendation:**
- On settings load, fetch key status from the API (without returning the key value — just a boolean or masked last-4).
- Display masked status: "OpenAI key configured (sk-...abc1) · Remove" vs "No key configured".
- This is also a trust signal — users want to know their key is safely stored.

---

### P1 — Upgrade Button Always Shown Regardless of Tier

**Location:** `apps/playground/src/routes/app/settings/+page.svelte:136`

**Problem:** The settings page shows "Upgrade to Pro — $12/mo" unconditionally, even for Pro/Team tier users. The settings page does not use `PageData` from the layout server, so `data.tier` is unavailable.

**Recommendation:**
- Pass `data.tier` from the `+layout.server.ts` through to the settings page data.
- Conditionally show the upgrade CTA only for free-tier users.
- Pro/Team users should see "Manage billing" only.

---

### P1 — Landing Page: Duplicate "Start for free" and "Sign in" CTAs

**Location:** `apps/playground/src/routes/+page.svelte:121-124`

**Problem:** The hero section shows two buttons for unauthenticated users: "Start for free" and "Sign in" — both point to the same `/auth/signin` URL. This creates:
- Decision paralysis (which button do I press?)
- Confusion ("Start for free" implies a different flow than "Sign in")
- Redundancy with no functional difference

**Recommendation:**
- Use a single primary CTA: "Get started free"
- Add a secondary text link: "Already have an account? Sign in" below the button
- Remove the nav-level "Sign in" button duplication when both nav and hero have the same action

---

### P1 — Error Messages Not Announced to Screen Readers

**Locations:**
- `apps/playground/src/routes/auth/signin/+page.svelte:66-68`
- `apps/playground/src/routes/app/settings/+page.svelte:99-101`

**Problem:** Error messages are rendered as plain `<p class="error">` elements. When they appear dynamically, screen readers do not announce them because there is no live region.

This fails WCAG 2.1 SC 4.1.3 (Status Messages).

**Recommendation:**
- Add `role="alert"` or `aria-live="polite"` to error containers. These should be present in the DOM from the start (empty), not inserted dynamically, so the live region is already registered.

```html
<div role="alert" aria-atomic="true" class="error">
  {#if status === 'error'}{errorMsg}{/if}
</div>
```

---

### P1 — No Autofocus on Sign-in Email Input

**Location:** `apps/playground/src/routes/auth/signin/+page.svelte:57`

**Problem:** The sign-in page has a single-purpose form (enter email → send link), but the email field is not auto-focused. Users must click or Tab to the field before typing.

**Recommendation:**
- Add `autofocus` attribute to the email input. This is a single-purpose page where autofocus is appropriate and expected.

---

### P2 — Share URL: No Copy Feedback

**Location:** `apps/playground/src/routes/app/[id]/+page.svelte:39-41`

**Problem:** The `copyShareUrl()` function copies to clipboard silently. The "Copy" button has no visual feedback after success — no label change, no toast, no checkmark. Users may be unsure if the copy worked.

**Recommendation:**
- After `navigator.clipboard.writeText()`, change the button text to "Copied!" for 2 seconds and/or show a success icon.

---

### P2 — "Loading..." Has No Accessible Loading State

**Location:** `apps/playground/src/routes/app/[id]/+page.svelte:158-160`

**Problem:** The loading state is a plain `<div class="loading">Loading...</div>` with no ARIA role. Screen readers may not properly announce this as a loading state.

**Recommendation:**
```html
<div class="loading" role="status" aria-label="Loading conversation">
  <span aria-hidden="true">Loading...</span>
</div>
```

---

### P2 — "Remove" API Key Has No Confirmation

**Location:** `apps/playground/src/routes/app/settings/+page.svelte:95`

**Problem:** Clicking "Remove" immediately calls `DELETE /api/keys` without confirmation. Removing an API key is a significant action — it will break all conversations for that provider.

**Recommendation:**
- Inline confirmation: change button to "Are you sure? Yes, remove / Cancel" flow.
- Or use a small confirmation modal specific to key removal.

---

### P2 — Canvas Completely Undiscoverable: No Empty-State Guidance

**Location:** `apps/playground/src/routes/app/[id]/+page.svelte` (TraekCanvas receives empty engine)

**Problem:** A first-time user sees an empty canvas with no guidance on:
- How to start a conversation
- That they can pan/zoom
- That they can branch conversations
- Where the input is

The spatial canvas paradigm is non-standard — it requires onboarding cues.

**Recommendation:**
- On first load with an empty engine, display an animated overlay or contextual hints:
  - "Type a message below to start"
  - "Drag to pan · Scroll to zoom"
  - "Branch any message to explore alternatives"
- Consider a one-time interactive tour (dismissible, stored in localStorage).

---

### P2 — Sidebar "Free X/5" Badge: Unclear Button Affordance

**Location:** `apps/playground/src/routes/app/+page.svelte:108-110`

**Problem:** The free-tier usage badge ("Free 3/5") is styled as a pill/badge but is actually an interactive button that opens the upgrade modal. Its visual treatment does not communicate interactivity.

**Recommendation:**
- Add a subtle affordance: underline on hover, or a "↑ Upgrade" label alongside the counter.
- Add `title="Upgrade to Pro"` tooltip at minimum.
- Consider placing a dedicated "Upgrade" link in the sidebar footer instead.

---

### P3 — Conversation Title Never Updates from "New conversation"

**Location:** `apps/playground/src/routes/app/[id]/+page.svelte:79-86`

**Problem:** The `persist()` function saves the title as `stored?.title ?? 'Conversation'` — it never auto-generates a meaningful title from the conversation content. All conversations in the sidebar show "New conversation" forever.

**Recommendation:**
- After the first assistant response completes, generate a short title from the first user message (e.g., first 5 words + "...") and persist it.

---

### P3 — Back Navigation in Conversation Toolbar: Icon-Only

**Location:** `apps/playground/src/routes/app/[id]/+page.svelte:168`

**Problem:** The back button renders only "←" with an `aria-label="All conversations"`. Visually this is a bare arrow. For sighted users who aren't familiar with the layout, it's not obvious this navigates back to the conversation list.

**Recommendation:**
- Add a visible text label: "← Conversations" or "← Back"
- The `aria-label` is correct but the visual affordance needs improvement.

---

### P3 — Terms/Privacy Links Go to Non-Existent Routes

**Location:** `apps/playground/src/routes/auth/signin/+page.svelte:73-75`

**Problem:** The sign-in page links to `/terms` and `/privacy` which likely don't exist in the app yet. These will 404.

**Recommendation:**
- Remove the links or replace with placeholder `#` and `rel="noopener"` until pages exist.
- Or point to external legal pages if available.

---

## Summary Table

| # | Issue | Location | Severity | Heuristic |
|---|-------|----------|----------|-----------|
| 1 | API key not checked on canvas load | `/app/[id]` | P0 | Error prevention |
| 2 | Delete is hover-only and irreversible | `/app` sidebar | P0 | Error prevention + Accessibility |
| 3 | Modal focus not trapped, no ESC | `/app`, `/app/[id]` | P0 | Accessibility (WCAG 2.1.2) |
| 4 | No existing key status in settings | `/app/settings` | P1 | Visibility of system status |
| 5 | Upgrade button always shown | `/app/settings` | P1 | Consistency |
| 6 | Duplicate hero CTAs | `/` (landing) | P1 | Consistency + User control |
| 7 | Error messages not announced | `/auth/signin`, `/app/settings` | P1 | Accessibility (WCAG 4.1.3) |
| 8 | No autofocus on sign-in email | `/auth/signin` | P1 | Efficiency of use |
| 9 | No copy feedback on share URL | `/app/[id]` | P2 | Feedback |
| 10 | Loading state has no ARIA role | `/app/[id]` | P2 | Accessibility |
| 11 | Remove API key has no confirmation | `/app/settings` | P2 | Error prevention |
| 12 | Empty canvas: no onboarding guidance | `/app/[id]` | P2 | Help & documentation |
| 13 | "Free X/5" badge: unclear affordance | `/app` sidebar | P2 | Affordance |
| 14 | Conversation title never updates | `/app/[id]` | P3 | UX polish |
| 15 | Back button: icon-only | `/app/[id]` | P3 | Visibility |
| 16 | Terms/Privacy links 404 | `/auth/signin` | P3 | Error prevention |

---

## Recommended Fix Order

**Sprint 1 (before any user testing):**
1. Fix modal focus trapping (P0) — use native `<dialog>` element
2. Fix delete button accessibility (P0) — remove hover-only pattern
3. Proactive API key detection on canvas load (P0)
4. Add `role="alert"` to error containers (P1)
5. Add autofocus to sign-in email (P1)

**Sprint 2 (before launch):**
6. Show existing API key status in settings (P1)
7. Conditional upgrade button based on tier (P1)
8. Fix duplicate landing page CTAs (P1)
9. Copy feedback on share URL (P2)
10. Loading state ARIA (P2)

**Sprint 3 (polish):**
11. Confirmation on key removal (P2)
12. Empty canvas onboarding hints (P2)
13. Conversation auto-titling (P3)
14. Back button label (P3)
15. Fix Terms/Privacy links (P3)
