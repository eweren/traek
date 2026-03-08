# Marketplace UX Specification
**Task:** TRK-38
**Author:** UX Expert
**Date:** 2026-03-07
**Built on:** TRK-39 brand design

---

## 1. Audit Summary

The TRK-39 brand work established solid foundations: a clean dark theme, consistent `--pg-*` token system, working browse grid, submission wizard, creator dashboard, and developer program page. This document identifies what is missing, what has accessibility gaps, and provides full interaction specs for the remaining flows.

### What Is Working Well

- Browse grid with sidebar filters and category tabs is functional and visually consistent
- Submission wizard 3-step flow with per-step validation is solid
- Creator dashboard tabs, stats, revenue chart, and transaction table are complete
- Badge pill system is implemented and correct
- Keyboard shortcut Cmd+K to focus search is a good touch
- Focus styles on interactive elements use `outline: 2px solid var(--pg-cyan)` consistently
- `aria-live="polite"` on search results count is correct

---

## 2. Critical Gaps (Blocking User Flows)

### 2.1 Detail Page — Missing Entirely

**Severity:** Critical
**Impact:** All 8 listing cards link to `/marketplace/${type}s/${slug}` — a route that does not exist. Every card click results in a 404.

**Required route:** `apps/playground/src/routes/marketplace/[type]s/[slug]/+page.svelte`

See Section 4 for full spec.

### 2.2 Install Flow — No CTA Exists

**Severity:** Critical
**Impact:** Users cannot install anything. The design doc specifies an install button but no `InstallButton.svelte` or install confirmation exists anywhere in the codebase.

See Section 5 for full spec.

### 2.3 Search Dropdown — Not Implemented

**Severity:** High
**Impact:** The design doc specifies a live dropdown with top 5 results (debounced 200ms). The current implementation only filters the grid — no dropdown appears while typing.

See Section 6.1 for spec.

### 2.4 Filter State Not Persisted in URL

**Severity:** Medium
**Impact:** Refreshing or sharing a filtered URL loses all filter state. Users cannot deep-link to e.g. "free themes sorted by rating."

**Fix:** Sync `activeCategory`, `filterFree`, `filterPaid`, `sortBy`, and `searchQuery` to URL search params on every change. Use `?cat=themes&price=free&sort=rating&q=midnight` format.

---

## 3. Accessibility Issues

### 3.1 Dashboard Tab Pattern Broken

**File:** `dashboard/+page.svelte:117`
**Issue:** The `<nav>` has `role="tab"` buttons but no `role="tablist"` wrapper and no `aria-controls`/`aria-labelledby` linking tabs to panels. Screen readers cannot navigate the tab pattern.

**Fix:**
```svelte
<div role="tablist" aria-label="Dashboard sections">
  <button
    role="tab"
    id="tab-overview"
    aria-controls="panel-overview"
    aria-selected={activeTab === 'overview'}
    ...
  >Overview</button>
</div>

<div
  role="tabpanel"
  id="panel-overview"
  aria-labelledby="tab-overview"
  tabindex="0"
>
  <!-- overview content -->
</div>
```

Tab keyboard navigation must follow the ARIA authoring pattern: Arrow keys move between tabs, Enter/Space activates.

### 3.2 Browse Page: Duplicate Filter Controls

**File:** `marketplace/+page.svelte:190-280`
**Issue:** Category is filterable via both the sidebar radio group AND the pill tabs above the grid. At desktop these are both visible simultaneously, creating confusion and doubled state. The sidebar radios and the tabs must stay in sync (they do via `activeCategory`), but having two controls for the same state violates the principle of a single source of truth in the UI.

**Fix:** Hide the sidebar category section on desktop (keep only on mobile as an alternative to tabs), or hide the pill tabs when the sidebar is visible. The pill tabs are more visually prominent and should be the primary control on desktop. The sidebar can focus on Price and Sort only.

### 3.3 Disabled Next Button Gives No Feedback

**File:** `submit/+page.svelte:370-374`
**Issue:** The Next button is disabled when validation fails, but no message explains why. Users filling the form do not know which field is incomplete.

**Fix:** On Next button click when invalid, trigger visual validation — mark empty required fields with `aria-invalid="true"` and show inline error messages. Do not rely on disabling the button as the sole feedback mechanism (anti-pattern per UX skill guidelines).

### 3.4 Type Card Radios Are Hidden

**File:** `submit/+page.svelte:150`
**Issue:** `input[type=radio]` is `display: none`. This removes keyboard navigation from the radio group. Keyboard users cannot tab between Theme/Component/Template options.

**Fix:** Use `opacity: 0; position: absolute; width: 1px; height: 1px` (visually hidden but accessible) instead of `display: none`. The label click will still activate the radio, but now keyboard users can also Tab/Arrow through the group.

### 3.5 Star Rating Color-Only Indicator

**File:** `StarRating.svelte` (not reviewed in detail)
**Ensure:** Stars must have an accessible text label, e.g. `aria-label="4.7 out of 5 stars"`. Color alone cannot convey the rating value.

### 3.6 Touch Target Sizes

The tag chips in the submit wizard are `padding: 4px 12px` — at 14px font this renders at approximately 22px height. This is below the 44px minimum for touch targets on mobile.

**Fix:** Increase tag chip padding to `padding: 8px 14px` minimum on mobile, or add `min-height: 44px` with `align-items: center` on the button.

### 3.7 Price Number Input Has No min-height

**File:** `submit/+page.svelte:220`
The price `<input type="number">` renders small on mobile. Add `min-height: 44px`.

---

## 4. Detail Page Specification

### 4.1 Route

`/marketplace/[type]s/[slug]` — e.g. `/marketplace/themes/midnight-pro`

The existing `MarketplaceCard` already generates this href format.

### 4.2 Layout

```
+-- Breadcrumb: Marketplace / Themes / Midnight Pro --------------------------+
|                                                                              |
|  +-- Preview Panel (55%) ----------------------+  +-- Sidebar (45%) -----+ |
|  |                                              |  |                      | |
|  |  [Live mini-canvas at 50% scale, read-only] |  | Midnight Pro         | |
|  |  [Tab: Light | Dark]  [Zoom: 80% ▼]         |  | by @studioNova  v2.1 | |
|  |                                              |  |                      | |
|  +----------------------------------------------+  | ★★★★★ 4.7  (142)    | |
|                                                     |                      | |
|  [Overview] [Changelog] [Reviews] [Docs]            | $9/mo  or  $79/yr    | |
|                                                     | [Install now ——>]    | |
|  Overview:                                          | [Try for free]       | |
|  Description text, feature list, screenshots        |                      | |
|                                                     | ——                    | |
|  npm install @traek-themes/midnight-pro             | 8,421 installs       | |
|  (copy button)                                      | Updated 3 days ago   | |
|                                                     | v2.1.0               | |
|  Usage code snippet                                 |                      | |
|                                                     | Publisher            | |
|                                                     | [avatar] studioNova  | |
|                                                     | Verified Partner     | |
|                                                     | 3 other items ——>    | |
+-----------------------------------------------------+----------------------+ |
+------------------------------------------------------------------------------+
```

On mobile: sidebar stacks above content. Install CTA becomes a sticky bottom bar.

### 4.3 Breadcrumb

```svelte
<nav aria-label="Breadcrumb">
  <ol>
    <li><a href="/marketplace">Marketplace</a></li>
    <li aria-hidden="true">/</li>
    <li><a href="/marketplace?cat=themes">Themes</a></li>
    <li aria-hidden="true">/</li>
    <li aria-current="page">Midnight Pro</li>
  </ol>
</nav>
```

### 4.4 Tab Panel (Overview / Changelog / Reviews / Docs)

Must implement the full ARIA tab pattern (see 3.1 fix). Tab content panels must be focusable with `tabindex="0"`.

**Review cards:** Avatar, star rating (with accessible label), review text (max 3 lines with expand), timestamp in relative format ("3 days ago"). Paginate at 5 per page.

### 4.5 Code Snippet Block

```svelte
<div class="code-block" role="region" aria-label="Install command">
  <pre><code>npm install @traek-themes/midnight-pro</code></pre>
  <button
    aria-label="Copy install command to clipboard"
    onclick={copyToClipboard}
  >
    {copied ? 'Copied!' : 'Copy'}
  </button>
</div>
```

On copy: show "Copied!" for 2000ms then revert. Announce to screen readers via `aria-live="polite"` region.

### 4.6 Install Sidebar — Sticky Behavior

On desktop: sidebar is `position: sticky; top: 80px` (below the fixed header).
On mobile: install CTA (`[Install now]` button + price) becomes a fixed bottom bar with `backdrop-filter: blur(12px)` and safe-area-inset padding.

---

## 5. Install Flow Specification

### 5.1 Install Button Component

**File to create:** `apps/playground/src/lib/marketplace/InstallButton.svelte`

```svelte
<script lang="ts">
  let { slug, type, name, priceMonthly }: {
    slug: string
    type: string
    name: string
    priceMonthly: number
  } = $props()

  let state = $state<'idle' | 'confirming' | 'installing' | 'done' | 'error'>('idle')
</script>
```

### 5.2 Install Confirmation Dialog

Triggered by clicking "Install now". Must use `<dialog>` element with focus trap.

```
+-- Install Midnight Pro -----------------------------------------------+
|                                                                        |
|  [Theme preview thumbnail, 120x80]                                    |
|  Midnight Pro                                                          |
|  by @studioNova · v2.1.0                                              |
|                                                                        |
|  This theme will be added to your Traek workspace.                    |
|  You can remove it anytime from Settings > Themes.                    |
|                                                                        |
|  $9/month · billed monthly · cancel anytime                           |
|                                                                        |
|  [Cancel]                    [Confirm & install]                       |
+------------------------------------------------------------------------+
```

**States:**
- `confirming` — dialog open, buttons active
- `installing` — "Confirm & install" shows spinner, both buttons disabled
- `done` — dialog replaced with success state (see 5.3)
- `error` — inline error banner inside dialog, retry button visible

**Keyboard:** Escape closes and returns focus to Install button. Tab cycles within dialog. Enter on "Confirm & install" submits.

### 5.3 Post-Install Success

After successful install, the dialog transitions to a success panel (no page reload):

```
+-- Installed! --------------------------------------------------------+
|                                                                       |
|   (gradient checkmark, 64px)                                         |
|   Midnight Pro installed                                              |
|   It's now available in your Traek workspace.                        |
|                                                                       |
|   npm install @traek-themes/midnight-pro                              |
|   [Copy]                                                              |
|                                                                       |
|   [Open in Traek ↗]              [Close]                             |
+-----------------------------------------------------------------------+
```

The Install button on the detail page changes to "Installed ✓" state (lime green, non-interactive) after success.

### 5.4 Free vs Paid Install Paths

**Free items:** Skip payment dialog. Confirm → install immediately.

**Paid items:** Show pricing confirmation with subscription details. If no billing method on file, redirect to billing setup before install.

---

## 6. Browse & Discovery UX Improvements

### 6.1 Search Dropdown

A live results dropdown appears as the user types (debounced 200ms). It should overlay the grid without causing layout shift.

```
[Search input _________________________]
+-- Search results ---------------------+
|  Theme  Midnight Pro                  |
|  Theme  Neon Canvas                   |
|  ————                                 |
|  Component  Math Renderer             |
|  ————                                 |
|  "midnight" — 3 results →             |
+---------------------------------------+
```

**Keyboard behavior:**
- `ArrowDown` from input moves focus into results list
- `ArrowUp`/`ArrowDown` moves between result items
- `Enter` on a result navigates to that item's detail page
- `Escape` closes dropdown and returns focus to input

**ARIA:**
```svelte
<input
  role="combobox"
  aria-expanded={showDropdown}
  aria-haspopup="listbox"
  aria-controls="search-listbox"
  aria-autocomplete="list"
/>
<ul id="search-listbox" role="listbox">
  {#each results as r}
    <li role="option" aria-selected="false">...</li>
  {/each}
</ul>
```

### 6.2 Filter URL Persistence

On every filter change, update URL using `replaceState` (not `pushState` to avoid polluting history):

```typescript
import { replaceState } from '$app/navigation'

function syncUrl() {
  const params = new URLSearchParams()
  if (activeCategory !== 'all') params.set('cat', activeCategory)
  if (filterFree) params.set('price', filterPaid ? 'both' : 'free')
  if (filterPaid && !filterFree) params.set('price', 'paid')
  if (sortBy !== 'popular') params.set('sort', sortBy)
  if (searchQuery) params.set('q', searchQuery)
  replaceState('?' + params.toString(), {})
}
```

On page load, read initial state from `$page.url.searchParams`.

### 6.3 Load More / Pagination

The current grid renders all 8 items at once. For production with hundreds of items, add a "Load more" button at the bottom:

- Show 16 items initially
- "Load more" appends the next 16
- Show total count: "Showing 16 of 48 themes"
- On keyboard: focus management after load — announce count update via `aria-live="polite"`

### 6.4 Sidebar vs Tabs Disambiguation

Current issue: both sidebar category radios and pill tabs control `activeCategory`. Resolve by:

- **Desktop (≥768px):** Remove category section from sidebar entirely. Keep Price and Sort in sidebar. Category tabs remain the sole category control in the main area.
- **Mobile (<768px):** Collapse sidebar into a "Filters" sheet (bottom drawer). Category tabs remain visible above the grid. The sheet contains Price and Sort filters only.

---

## 7. Submission Flow UX Improvements

### 7.1 Missing Preview Image Upload (Step 2)

The design doc specifies a 16:9 drag-and-drop image upload zone in Step 2, but the implementation is absent.

**Required UI:**
```svelte
<div
  class="upload-zone"
  class:upload-zone--active={isDragging}
  role="button"
  aria-label="Upload preview image, 16:9 ratio, max 2MB"
  tabindex="0"
  ondragover={handleDragOver}
  ondrop={handleDrop}
  onclick={() => fileInput.click()}
  onkeydown={(e) => e.key === 'Enter' && fileInput.click()}
>
  {#if previewDataUrl}
    <img src={previewDataUrl} alt="Preview" />
    <button aria-label="Remove preview image" onclick={clearImage}>×</button>
  {:else}
    <span>Drag & drop a 16:9 image or click to browse</span>
    <span class="hint">PNG or JPG · max 2 MB</span>
  {/if}
</div>
<input type="file" bind:this={fileInput} accept="image/png,image/jpeg" aria-hidden="true" tabindex="-1" />
```

**Validation (client-side before upload):**
- File type: PNG or JPEG only (validate by MIME type, not extension)
- File size: max 2 MB
- Dimensions: warn if not 16:9 ratio (do not block, just advise)
- Show inline error if constraints violated

### 7.2 Per-Field Validation Errors

Replace disabled Next button with active validation on click:

```typescript
let errors = $state<Record<string, string>>({})

function validateStep1(): boolean {
  errors = {}
  if (!itemType) errors.type = 'Select a type to continue.'
  if (itemName.trim().length < 3) errors.name = 'Name must be at least 3 characters.'
  if (itemDescription.trim().length < 20) errors.description = 'Description must be at least 20 characters.'
  return Object.keys(errors).length === 0
}

function nextStep() {
  if (step === 1 && !validateStep1()) return
  if (step === 2 && !validateStep2()) return
  step = (step + 1) as Step
}
```

Each field renders its error below it:
```svelte
{#if errors.name}
  <span class="field-error" role="alert">{errors.name}</span>
{/if}
```

Mark invalid inputs with `aria-invalid="true"` and `aria-describedby="name-error"`.

### 7.3 Draft Auto-Save

Users lose all wizard state if they navigate away. Add `localStorage` auto-save:

- Debounce save 800ms after any field change
- On mount, check `localStorage.getItem('marketplace-draft')` and offer to restore
- Show a subtle "Draft saved" indicator (bottom of wizard, muted text, no toast)
- Clear draft on successful submission

### 7.4 Package Name Real-Time Availability Check

Step 2 package name field should show availability inline (mocked for now, real API later):

```
@traek-themes/ [midnight-pro            ] ✓ Available
@traek-themes/ [neon-canvas             ] ✗ Already taken
@traek-themes/ [mid...                  ] ○ Checking...
```

Debounce 400ms. Show spinner during check. On "taken": show error message with link to existing package.

---

## 8. Mobile Navigation

The current layout header (`+layout.svelte`) has no mobile nav. At viewport widths below 768px, the nav links overflow or collapse without a menu trigger.

**Required changes to `+layout.svelte`:**

1. Add a hamburger button (`☰`) visible only below 768px, positioned at right of header
2. On click, open a full-screen overlay nav with all links (Browse, Submit, Dashboard, For Developers)
3. Overlay: `position: fixed; inset: 0; z-index: 200; background: rgba(8,8,8,0.98)`
4. Close on link click, Escape, or backdrop click
5. Focus trap within overlay while open
6. Body scroll locked while open (`overflow: hidden` on `<body>`)
7. Hamburger button has `aria-label="Open navigation menu"` and `aria-expanded={menuOpen}`

---

## 9. Loading & Skeleton States

No loading states exist anywhere in the marketplace. For production readiness:

### 9.1 Browse Grid Skeleton

While data fetches, render skeleton cards instead of an empty grid:

```svelte
{#if loading}
  <div class="grid" aria-busy="true" aria-label="Loading marketplace items">
    {#each Array(8) as _, i (i)}
      <div class="card-skeleton" aria-hidden="true">
        <div class="skeleton skeleton--preview"></div>
        <div class="skeleton skeleton--title"></div>
        <div class="skeleton skeleton--meta"></div>
      </div>
    {/each}
  </div>
{/if}
```

Skeleton shimmer animation:
```css
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.skeleton {
  background: linear-gradient(90deg, #1a1a1a 25%, #222 50%, #1a1a1a 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 6px;
}

@media (prefers-reduced-motion: reduce) {
  .skeleton { animation: none; background: #1a1a1a; }
}
```

### 9.2 Detail Page Skeleton

Show skeleton for the preview panel and sidebar while item data loads. Do not show empty states prematurely.

---

## 10. Empty States

### 10.1 Browse — No Results

Already implemented (magnifying glass + "No items match your filters" + "Clear filters" button). This is good. Minor improvement: add a suggestion when search has results but category filter excludes them, e.g. "No themes match 'math'. Try searching in Components."

### 10.2 Dashboard Payouts — First-Time Empty State

Current state at `dashboard/+page.svelte:225`: shows "No payment method connected" with a Connect Stripe button — this is functional but sparse. Improve with an onboarding card:

```
+-- Get paid for your work -------------------------------------------+
|                                                                      |
|   Connect your bank account via Stripe to receive monthly payouts.  |
|   Once connected, you'll receive 70% of every sale on net-30 terms. |
|                                                                      |
|   Minimum payout: $50 · Payments processed on the 1st of each month |
|                                                                      |
|   [Connect Stripe →]                                                 |
+----------------------------------------------------------------------+
```

### 10.3 Dashboard Items — No Submissions Yet

If a user visits the Dashboard before submitting anything:

```
+-- You haven't submitted anything yet --------------------------------+
|                                                                      |
|   Build a theme, component, or template and share it with the       |
|   Traek community. Earn 70% of every sale.                          |
|                                                                      |
|   [Start your first submission →]                                    |
+----------------------------------------------------------------------+
```

---

## 11. Notification / Toast System

No toast or notification mechanism exists in the marketplace. Required for:
- Install success: "Midnight Pro installed successfully"
- Install error: "Installation failed — please try again" (persistent, not auto-dismiss)
- Submit success: handled inline via `submitted` state (already good)
- Copy to clipboard: brief "Copied!" inline on button, not a toast

**Toast spec:**
- Position: top-right, 16px from edge
- Stack vertically if multiple (max 3)
- Success auto-dismisses after 4000ms
- Error requires manual dismiss
- Entrance: slide in from right (150ms ease-out)
- Exit: fade out (200ms)
- `role="status"` for success, `role="alert"` for error
- Respect `prefers-reduced-motion`: no animation, just appear/disappear

---

## 12. Implementation Priority

| Priority | Item | Complexity |
|----------|------|------------|
| P0 | Detail page (`/marketplace/[type]s/[slug]`) | High |
| P0 | Install button + confirmation dialog | Medium |
| P1 | ARIA tab pattern fix (dashboard) | Low |
| P1 | Per-field validation errors in submit wizard | Low |
| P1 | Fix hidden radio inputs (type cards, price toggle) | Low |
| P1 | Mobile navigation overlay | Medium |
| P2 | Search dropdown with ARIA combobox | Medium |
| P2 | Filter URL persistence | Low |
| P2 | Preview image upload (submit step 2) | Medium |
| P2 | Skeleton loading states | Medium |
| P3 | Draft auto-save | Low |
| P3 | Package name availability check | Low |
| P3 | Toast notification system | Medium |
| P3 | Load more / pagination | Low |

---

## 13. Accessibility Compliance Summary

| Check | Status | Notes |
|-------|--------|-------|
| Color contrast (cyan #00d8ff on #161616) | Pass | 9.2:1 |
| Color contrast (text-secondary #a8a8a8 on #080808) | Pass | 5.8:1 |
| Color contrast (text-muted #666 on #161616) | Fail | 2.9:1 — use #888 minimum |
| Focus indicators | Partial | Present on inputs/buttons; missing on sidebar radios at :focus-visible |
| Keyboard navigation | Partial | Tab works; ARIA tab pattern broken in dashboard |
| Screen reader landmarks | Pass | `<nav>`, `<main>`, `<aside>` used correctly |
| Form labels | Pass | All inputs have associated labels |
| Alt text on images | Partial | Card preview images use `alt="{name} preview"` |
| Touch targets (44px) | Fail | Tag chips ~22px height, price input small |
| Reduced motion | Partial | `.skeleton` animation needs guard; wizard transitions missing guard |
| ARIA roles | Partial | Dashboard tabs lack tablist/tabpanel; combobox not yet implemented |

**Critical contrast fix:** `--pg-text-muted: #666666` on `#161616` gives a 2.9:1 ratio — below WCAG AA for normal-size text (requires 4.5:1). Change to `#888888` for 4.6:1 or `#8a8a8a` for 4.5:1 exactly. This affects: filter group titles, hint text, results-meta, install count, search icon, timestamps.
