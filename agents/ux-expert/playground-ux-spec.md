# Traek Playground — UX Specification

**Version:** 1.0
**Author:** UX Expert Agent
**Date:** 2026-03-07
**Task:** TRK-25

---

## Overview

The Traek Playground is a hosted BYOK (bring your own key) spatial AI chat product at `app.gettraek.com`. It brings the `@traek/svelte` canvas to end users without requiring them to write code. The core UX challenge is introducing a genuinely novel interaction pattern (spatial canvas vs. linear chat) to users who may have no prior exposure to it.

**Stack:** SvelteKit, Email/magic-link auth, IndexedDB (free tier), cloud DB (paid).
**Tiers:** Free (5 convos, local-only) · Pro $12/mo (unlimited, cloud sync, sharing) · Team $29/mo/seat

---

## 1. Onboarding Flow

### 1.1 Overall funnel

```
Landing page -> Sign Up -> Magic link email -> Link click -> Welcome screen
-> BYOK setup wizard -> Canvas tutorial -> First conversation
```

### 1.2 Landing Page CTA

The existing landing page already markets the library. For Playground, add a distinct entry point:

- **Primary CTA:** "Try it free -- no credit card" (links to `/signup`)
- **Secondary CTA:** "See it live" (scrolls to hero demo already present)
- **Social proof row:** GitHub stars count, "Free for 5 conversations"

Design principles:
- The CTA button must visually differentiate from library CTAs. Same gradient style but larger (48px height, `lg` size) labelled specifically for Playground.
- Add a "How it works" 3-step visual: (1) Sign up -> (2) Add API key -> (3) Start exploring

### 1.3 Sign-Up Screen (`/signup`)

**Goal:** Lowest possible friction entry. One field, one button.

```
+--------------------------------------------------+
|                   traek                          |
|                                                  |
|   Start exploring ideas spatially.               |
|                                                  |
|   +------------------------------------------+  |
|   |  Your email                              |  |
|   +------------------------------------------+  |
|   [ Continue with email ]                        |
|                                                  |
|   By continuing, you agree to our Terms of      |
|   Service and Privacy Policy.                    |
|                                                  |
|   Already have an account? Sign in              |
+--------------------------------------------------+
```

**Accessibility:**
- `<label>` for email input, not placeholder-only
- `aria-required="true"` on input
- `type="email"` with validation before submit
- Error: "Please enter a valid email address" (role="alert")
- Keyboard: Enter submits form

**States:**
- Default -> Loading (spinner in button, button disabled) -> Success screen
- Error: "Something went wrong. Try again." with retry

### 1.4 Magic Link Confirmation Screen (`/signup/check-email`)

```
+--------------------------------------------------+
|                                                  |
|   Check your inbox                               |
|                                                  |
|   We sent a link to hello@example.com           |
|   Click it to sign in -- no password needed.    |
|                                                  |
|   The link expires in 10 minutes.               |
|                                                  |
|   Didn't get it? Check spam, or                 |
|   [ Resend link ] · [ Change email ]            |
+--------------------------------------------------+
```

UX notes:
- Show the actual email address for reassurance
- "Resend link" has a 60-second cooldown (show countdown: "Resend in 42s")
- "Change email" goes back to signup with email pre-filled

### 1.5 Magic Link Landing & New User Welcome (`/auth/callback`)

After clicking the link:
- If **new user**: redirect to `/welcome` (onboarding wizard)
- If **returning user**: redirect to `/app` (conversation list)

**Welcome Screen (`/welcome`) -- 3-step wizard with step indicator:**

**Step 1 -- Canvas intro:**

Full-page, distraction-free. Shows a read-only animated canvas demo (reusing `createHeroEngine()`) with copy explaining the spatial metaphor.

- "Got it, next ->" advances to Step 2
- Skip link top-right: "Skip intro" -> goes to Step 2 directly
- Respects `prefers-reduced-motion`: disable auto-pan animation

**Step 2 -- API key setup (BYOK):** detailed in Section 2

**Step 3 -- First conversation prompt:**

Suggested prompts are clickable and pre-fill the canvas input. "Open my canvas ->" navigates to `/app` and starts a new conversation.

---

## 2. BYOK Configuration UX

### 2.1 Design principles

- **Non-technical users are the hard case.** API keys look scary. The UI must demystify them.
- **Trust signals are mandatory.** Users will be handing over credentials; explain exactly where they are stored.
- **Validation must be immediate.** Test the key before accepting it.
- **Recovery must be easy.** Keys expire or get revoked -- re-entry should take 5 seconds.

### 2.2 Key setup wizard (Step 2 of welcome, or `/app/settings/keys`)

```
+--------------------------------------------------+
|  Connect an AI provider                          |
|                                                  |
|  Choose a provider:                             |
|  +-----------------+  +-----------------+       |
|  |  OpenAI  (sel.) |  |  Anthropic      |       |
|  |  GPT-4o         |  |  Claude 3.5     |       |
|  +-----------------+  +-----------------+       |
|                                                  |
|  Your OpenAI API key                            |
|  +-------------------------------------------+  |
|  |  sk-..............................  [show] |  |
|  +-------------------------------------------+  |
|  [lock] Stored only on your device. Never sent  |
|          to Traek servers.  [ Learn more ]       |
|                                                  |
|  [ How to get an OpenAI key (opens in new tab)] |
|                                                  |
|  [ Test key ]    [ Save & continue -> ]         |
+--------------------------------------------------+
```

**Provider cards:**
- Selectable tiles with provider logo + model name
- Selected state: highlighted border with accent color
- Future providers shown as "Coming soon" (greyed out, aria-disabled)

**Key input:**
- `type="password"` with show/hide toggle
- Paste-friendly: no character limit
- On paste: auto-strip surrounding whitespace (common copy-paste error)
- `autocomplete="off"` to prevent password managers from prefilling

**Trust signals:**
- Lock icon + "Stored only on your device" for free tier
- Pro tier: "Encrypted and synced with your account"
- "Learn more" opens an inline accordion (not a modal -- keeps user in flow)

**"How to get a key" link:**
- Opens provider docs in new tab
- Small external-link icon signals new tab (accessibility + honesty)

**Test key button:**
- Makes a minimal API call to validate the key
- States: idle -> loading -> success ("Key works!") -> error (explanation)
- Error messages by case:
  - Invalid format: "This doesn't look like a valid key. OpenAI keys start with sk-"
  - Auth failure: "Key rejected. Check it is correct and has API access."
  - Rate limit: "Key works, but you have hit your rate limit."
  - Network error: "Couldn't reach OpenAI. Check your connection."

**Save & continue:**
- If key untested, button label changes to "Save without testing ->" with warning icon
- On success: save to localStorage (free) or encrypted user record (pro), advance to Step 3

### 2.3 Key management settings (`/app/settings/keys`)

For returning users managing their keys:

- List of configured providers with masked key display (last 4 chars visible)
- Each row: provider name, masked key, "Last used: X hours ago", Edit / Remove actions
- "Edit" expands inline form (not a full-page navigation)
- "Remove" shows a confirmation: "Your conversations using this provider will stop working."
- "+ Add provider" opens the wizard in a modal

---

## 3. Conversation Management

### 3.1 App shell layout

```
+--------------------------------------------------+
|  [=] traek         [+ New]            [avatar]  |
+------------------+-------------------------------+
|                  |                               |
|  Sidebar (300px) |  Canvas (remaining viewport)  |
|                  |                               |
|  Search...       |                               |
|  -------         |                               |
|  Today           |                               |
|  · Idea A        |                               |
|  · Idea B        |                               |
|  -------         |                               |
|  Yesterday       |                               |
|  · Idea C        |                               |
+------------------+-------------------------------+
```

- Sidebar collapses to icon-strip on <1024px
- On mobile (<768px): sidebar is a bottom-sheet drawer, canvas fills full screen
- Top bar: logo, "New conversation" button, user avatar (dropdown for settings/logout)

### 3.2 Conversation list (sidebar)

**Grouping:** Today / Yesterday / Last 7 days / Older

**Each item:**
- Title (auto-generated from first user message, ~40 chars max)
- Relative timestamp ("2h ago")
- Hover/focus reveals "..." menu button (44px tap target)

**Context menu (...):**
- Rename
- Share (Pro only -- lock icon if free)
- Export as Markdown
- Delete (shows confirmation)

**Search:**
- Inline at top of sidebar
- Searches conversation titles and message content
- Results show matching snippet with search term highlighted
- Debounce 300ms, minimum 2 characters to trigger

**Empty states:**
- No conversations: "(canvas icon) No conversations yet. [+ Start your first one]"
- Search no results: "No conversations match '[term]'. [Clear search]"

### 3.3 New conversation

- "+" button in top bar always visible
- Creates blank canvas, focuses input immediately
- Title assigned after first message (from first ~6 words of user input, or AI-generated)
- On free tier at limit (5/5): shows upgrade prompt instead (Section 4)

### 3.4 Delete conversation

- Confirmation dialog: "Delete this conversation? This cannot be undone."
- Buttons: "Cancel" (default focus) and "Delete" (destructive red)
- On mobile: bottom sheet instead of modal
- After delete: navigate to next conversation in list, or empty state

### 3.5 Export

- "Export as Markdown" in context menu
- Generates `.md` file: full conversation tree, depth-first order, branching as heading hierarchy
- Browser download, no server round-trip (free tier)

---

## 4. Pricing & Upgrade Flow

### 4.1 Principles

- **Don't block users mid-thought.** Show limits proactively, not reactively.
- **Make value clear at the moment of upgrade.**
- **Never hide what's free.** Show the counter at all times.

### 4.2 Free tier counter

Persistent but unobtrusive -- in the sidebar footer:

```
  5 conversations (3 used)
  [========........]  Upgrade to Pro
```

- Progress bar: neutral -> amber at 4/5 -> red at 5/5
- "Upgrade to Pro" is a text link (secondary), not a button, until 5/5
- At 5/5: becomes a primary button with red accent

### 4.3 Limit-hit upgrade prompt (modal)

Triggered when a free user clicks "+ New conversation" at the 5/5 limit:

```
+--------------------------------------------------+
|  You have used your 5 free conversations         |
|                                                  |
|  Pro gives you:                                  |
|  [check] Unlimited conversations                 |
|  [check] Cloud sync across devices              |
|  [check] Shareable read-only links              |
|  [check] Export & backup                        |
|                                                  |
|  $12 / month -- cancel anytime                  |
|                                                  |
|  [ Upgrade to Pro ]     [ Maybe later ]         |
+--------------------------------------------------+
```

- "Maybe later" closes modal, user stays on current conversation
- "Upgrade to Pro" goes to `/pricing`
- Modal does not appear more than once per session for the same trigger

### 4.4 Pricing page (`/pricing`)

Three cards: Free / Pro (elevated, star badge) / Team.

- Annual billing toggle at top: "Monthly / Annual (save 20%)"
- Each card: price, feature list, CTA button
- Footer: "All plans: BYOK -- your keys, your costs. Stripe-secured. Cancel anytime."
- FAQ accordion below: "What is BYOK?", "What happens to my data?", "Can I cancel?"

### 4.5 Stripe checkout

- "Upgrade to Pro" -> Stripe Checkout (hosted), same tab to avoid popup blockers
- On success: Stripe redirects to `/app?upgraded=true`
- Success banner: "Welcome to Pro! Your account has been upgraded." (auto-dismiss 5s)
- On cancel/back from Stripe: return to `/app` without banner

---

## 5. Sharing UX

### 5.1 Generating a shared link

**Entry:** Context menu "..." -> "Share" (Pro only; lock icon + upgrade prompt for free users)

```
+--------------------------------------------------+
|  Share this conversation                         |
|                                                  |
|  Anyone with this link can view, not edit.       |
|                                                  |
|  +---------------------------------------+-----+ |
|  |  app.gettraek.com/s/xK7pQr...        | Copy| |
|  +---------------------------------------+-----+ |
|                                                  |
|  Link expires: [ Never (v) ]                    |
|                                                  |
|  [ Preview shared view (opens in new tab) ]     |
|                                                  |
|  ------------------------------------------------|
|  Disable sharing    [ Remove link ]              |
+--------------------------------------------------+
```

- Link generated immediately on modal open (optimistic)
- "Copy" changes to "Copied!" for 2 seconds
- Expiry options: Never / 7 days / 30 days
- "Preview" opens the share URL in a new tab so the owner can review before sending
- "Remove link" requires confirmation before disabling

### 5.2 Shared view (`/s/:shareId`)

Read-only canvas for recipients. No authentication required.

- Full pan/zoom works for recipient
- Input bar and branching controls are hidden
- Persistent footer: "Try traek free ->" (viral loop CTA)
- Expired/removed link: friendly error page + CTA to landing

### 5.3 Free tier sharing teaser

Free users see "Share" in context menu with a lock icon. Clicking opens the upgrade modal (Section 4.3) with sharing highlighted as lead feature.

---

## 6. Mobile Responsiveness

### 6.1 Breakpoints and layout shifts

| Breakpoint | Sidebar | Canvas | Input | Controls |
|---|---|---|---|---|
| >=1024px | Fixed 300px | Remaining | Floating (existing) | Inline |
| 768-1023px | Collapsible icon strip | Full width | Floating | Collapsed |
| <768px | Bottom sheet drawer | Full screen | Bottom bar | Minimal |

### 6.2 Mobile canvas interaction

- **Pinch-to-zoom:** standard touch events on the canvas viewport
- **Two-finger pan:** distinguishable from single-finger scroll by touch count
- **Single-tap:** selects node (opens detail panel as bottom sheet)
- **Double-tap:** zooms in on tapped node
- **Long-press on node:** opens context menu (branch, share, delete)

### 6.3 Mobile input bar

On mobile (<768px), the floating input becomes a sticky bottom bar:

```
+--------------------------------------------------+
|  [canvas]                                        |
+----+----------------------------------+----------+
| [+]|  Ask anything...                | [Send ->] |
+----+----------------------------------+----------+
```

- Tapping input expands it; canvas shrinks to top 40% of screen
- Input min-height: 44px; grows with content up to 120px
- Send button: 44x44px minimum touch target
- "[+]" opens sheet: attach image, change model, branch from...
- Apply `padding-bottom: env(safe-area-inset-bottom)` for iPhone home indicator

### 6.4 Mobile conversation list

- Bottom-sheet drawer triggered by bottom-nav icon or swipe up from edge
- Bottom nav: Home / Conversations / Settings
- "New conversation" persistent in bottom nav
- Conversation list scrolls vertically inside drawer

### 6.5 Orientation and keyboard

- Canvas retains position on orientation change (no re-render)
- When keyboard appears: layout reflows, canvas stays interactive above input
- All touch targets >= 44x44px on mobile

---

## 7. Accessibility Requirements

Applies to all screens:

| Requirement | Standard |
|---|---|
| Color contrast (body text) | 4.5:1 minimum (WCAG 2.1 AA) |
| Color contrast (large text, UI components) | 3:1 minimum |
| Focus indicators | 2px outline with 2px offset, visible on all interactive elements |
| Keyboard navigation | All flows completable without mouse |
| Screen reader | Semantic HTML + ARIA labels on icon-only buttons |
| Motion | Respect `prefers-reduced-motion`: disable canvas auto-pan, onboarding animations |
| Forms | Labels above inputs, associated via `for`/`id` |
| Live error messages | `role="alert"` for async feedback |

Canvas-specific:
- Pan/zoom keyboard controls: arrow keys to pan, +/- to zoom
- Node content readable by screen readers (not purely spatial)
- Streaming text announces completion (not token-by-token)

---

## 8. Edge Cases & Error States

| Scenario | Handling |
|---|---|
| No API key, user starts conversation | Inline prompt: "Add an API key to start chatting" with link to settings |
| API call fails mid-stream | Node shows error state + "Retry" button |
| Network offline | Toast: "You are offline. Changes will sync when reconnected." |
| Magic link expired | "This link has expired. Request a new one." (email pre-filled) |
| Share link not found/removed | "This conversation is no longer available." + landing CTA |
| Key revoked after saving | Next API call shows auth error + "Update your key" inline in node |
| Free tier limit on load | Counter shown prominently, existing conversations remain accessible |

---

## 9. Implementation Priority (Phase 1 MVP)

1. Signup + magic link (required to enter)
2. BYOK key setup wizard (required to use product)
3. Canvas onboarding tutorial (highest drop-off risk -- novel UX pattern)
4. Conversation list sidebar (basic CRUD)
5. Free tier counter + upgrade modal (monetisation gate)
6. Sharing UX (Pro differentiator)
7. Pricing page + Stripe integration
8. Mobile responsiveness (can be progressive -- desktop-first, mobile polish after launch)

---

## 10. Open Questions

1. **API key test proxy:** Is the key test call made directly from the browser to the provider, or via a Traek backend proxy? Direct is simpler but means the key travels over the user's network. Proxy is safer but adds infrastructure.
2. **Conversation title generation:** Auto-generate via an AI call, or just use the first N words of the user's first message? AI is nicer UX but costs tokens.
3. **Onboarding completeness gate:** Should users be allowed to skip BYOK setup and explore the canvas without a key? Could reduce onboarding drop-off.
4. **Team tier shared canvas:** What does a shared workspace look like spatially -- shared canvas, separate boards, or something else? (Out of scope Phase 1.)
5. **GDPR/data residency:** For Pro cloud sync, where is data stored? Affects privacy copy and compliance requirements.
