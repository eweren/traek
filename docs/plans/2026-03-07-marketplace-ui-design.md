# Marketplace UI & Developer Program Branding — Design Document

**Date:** 2026-03-07
**Task:** TRK-39
**Phase:** Phase 4 — Hosted Services & Marketplace
**Author:** UI & Brand Designer

---

## Overview

The Traek Marketplace is a curated ecosystem for themes, node-type components, and conversation templates.
It enables developers to publish and monetize extensions, while users discover and install them with one click.
Revenue split is 70/30 (creator/Traek).

### Design Principles

1. **Developer-first** — code is always a first-class citizen; every detail page shows install commands
2. **Spatial brand continuity** — dark canvas aesthetic, cyan/lime gradient accent, Space Grotesk typeface
3. **Trust through transparency** — verified badges, download counts, revenue stats are visible
4. **Low friction** — 3-step submission, one-click install, clear pricing

---

## Design System Tokens (app-level)

All marketplace pages inherit `--pg-*` tokens from `apps/playground/src/app.css`.

| Token | Value | Usage |
|---|---|---|
| `--pg-bg` | `#080808` | Page background |
| `--pg-bg-surface` | `#111111` | Sidebar / nav |
| `--pg-bg-card` | `#161616` | Listing cards |
| `--pg-bg-card-hover` | `#1c1c1c` | Card hover state |
| `--pg-cyan` | `#00d8ff` | Primary accent |
| `--pg-lime` | `#00ffa3` | Secondary accent |
| `--pg-gradient` | `linear-gradient(135deg, #00d8ff, #00ffa3)` | CTA buttons, badges |
| `--pg-text` | `#f0f0f0` | Body text |
| `--pg-text-secondary` | `#a8a8a8` | Descriptions |
| `--pg-text-muted` | `#666666` | Meta / timestamps |
| `--pg-border` | `rgba(255,255,255,0.08)` | Card borders |
| `--pg-border-strong` | `rgba(255,255,255,0.14)` | Focused borders |
| `--pg-border-cyan` | `rgba(0,216,255,0.28)` | Highlighted borders |

Typography: `Space Grotesk` (sans), `Space Mono` (mono/code)

---

## 1. Marketplace Browse & Search UI

### Layout

```
+-Nav: [traek logo] [Browse] [Submit] [Dashboard] [Sign in]------------------+
|                                                                              |
|  +-Sidebar 240px--------+  +-Main Grid----------------------------------+   |
|  | Categories           |  |  [Search bar ──────────────] [Sort v]     |   |
|  |  * All               |  |                                            |   |
|  |  o Themes            |  |  Tabs: [All] [Themes] [Components] [Tmpl] |   |
|  |  o Components        |  |                                            |   |
|  |  o Templates         |  |  +----+ +----+ +----+ +----+              |   |
|  |                      |  |  |Card| |Card| |Card| |Card|              |   |
|  | Price                |  |  +----+ +----+ +----+ +----+              |   |
|  |  [] Free             |  |  +----+ +----+ +----+ +----+              |   |
|  |  [] Paid             |  |  |Card| |Card| |Card| |Card|              |   |
|  |                      |  |  +----+ +----+ +----+ +----+              |   |
|  | Sort by              |  |  [Load more]                              |   |
|  |  * Most popular      |  |                                            |   |
|  |  o Newest            |  +--------------------------------------------+   |
|  |  o Highest rated     |                                                    |
|  +----------------------+                                                    |
+------------------------------------------------------------------------------+
```

### Listing Card Anatomy

Each card (280px wide, aspect ratio ~1:1.2) contains:
- **Preview thumbnail** (top 60%): live mini-canvas preview or static image
- **Type chip** (top-left overlay): `THEME` / `COMPONENT` / `TEMPLATE` — gradient background
- **Verified badge** (top-right overlay): gold checkmark for verified publishers
- **Name** (16px semibold, Space Grotesk)
- **Publisher** + avatar (12px, muted)
- **Rating stars** + review count
- **Price**: `Free` in lime green or `$X/mo` in white
- **Install count**: small download icon + formatted number

Hover state: card lifts (translateY -2px), border becomes `--pg-border-cyan`, subtle cyan glow shadow.

### Search Bar

Full-width at top of main area. Placeholder: "Search themes, components, templates..."
- Magnifying glass icon, left-padded inside input
- Keyboard shortcut: Cmd+K triggers focus
- Live dropdown shows top 5 results as user types (debounced 200ms)
- Active filter tags shown as dismissible pills beneath the bar

### Filters

- **Category tabs**: All / Themes / Components / Templates (pill tabs, active = gradient background)
- **Price checkboxes**: Free / Paid
- **Sort select**: Popular / Newest / Top Rated / Revenue
- Filters persist in URL params: `?cat=themes&price=free&sort=popular`

---

## 2. Theme & Component Detail Pages

### URL Structure

`/marketplace/themes/:slug` | `/marketplace/components/:slug` | `/marketplace/templates/:slug`

### Page Layout

```
+-Breadcrumb: Marketplace > Themes > Midnight Pro----------------------------+
|                                                                              |
|  +-Left Panel 55%-------------------------------+  +-Right Panel 45%----+  |
|  | [Live Preview Canvas - interactive mini demo]|  | # Midnight Pro     |  |
|  |                                              |  |   by @studioNova v |  |
|  | [Light | Dark] toggle  [Zoom: 80% v]         |  |                    |  |
|  +----------------------------------------------+  | 4.7/5  (142)      |  |
|                                                     |                    |  |
|  Tabs: [Overview] [Changelog] [Reviews] [Docs]      | $9/mo or $79/yr   |  |
|                                                     | [Install now ->]   |  |
|  Overview content:                                  | [Try for free]     |  |
|  Description, screenshots, feature list             |                    |  |
|                                                     | ---                |  |
|  npm install @traek-themes/midnight-pro             | 8,421 installs     |  |
|                                                     | 4.7 avg rating     |  |
|  Usage code snippet (syntax highlighted)            | Updated 3d ago     |  |
|                                                     | v2.1.0             |  |
|                                                     |                    |  |
|                                                     | Publisher          |  |
|                                                     | [avatar] studioNova|  |
|                                                     | Verified partner   |  |
|                                                     | 3 other items      |  |
+-----------------------------------------------------+--------------------+  |
+------------------------------------------------------------------------------+
```

### Key UI Elements

- **Install Button**: Large, gradient-filled, 48px height, slight arrow animation on hover
- **Try for free**: Ghost button, border-cyan, text-cyan
- **Live Preview Canvas**: Embedded `<TraekCanvas>` at 50% scale, read-only, showing sample
  conversation that demonstrates the theme. Interactive for component previews.
- **Code snippets**: Dark blocks (Space Mono), syntax highlighted, one-click copy button
- **Review cards**: Avatar, star rating, review text, timestamp — 5 per page with pagination

---

## 3. Developer Program Branding & Badge System

### Badge Tiers

| Badge | Name | Criteria | Style |
|---|---|---|---|
| Contributor | First submission | Lime dot, subtle lime tint bg |
| Creator | 100+ installs, 4.0+ rating | Cyan star, cyan tint bg |
| Pro Creator | 1k+ installs, 4.5+ rating, 3+ items | Gold star, gradient border |
| Verified Partner | Manual review + revenue milestone | Diamond icon, animated gradient border |

### Badge Visual Spec

Each badge renders as a pill (inline) or card (profile/detail pages):

**Contributor**
- `background: rgba(0, 255, 163, 0.08)`
- `border: 1px solid rgba(0, 255, 163, 0.25)`
- Color: `--pg-lime`

**Creator**
- `background: rgba(0, 216, 255, 0.08)`
- `border: 1px solid rgba(0, 216, 255, 0.25)`
- Color: `--pg-cyan`

**Pro Creator**
- `background: linear-gradient(135deg, rgba(0,216,255,0.1), rgba(0,255,163,0.1))`
- `border: 1px solid rgba(255, 215, 0, 0.4)`
- Color: `#ffd700`

**Verified Partner**
- 2px animated gradient border (4s rotation via `@property --angle` + conic-gradient)
- Diamond SVG icon
- Color: `#ffd700`

### Developer Program Landing Page

URL: `/developers`

Sections:
1. **Hero**: "Build for the Traek ecosystem. Earn 70% of every sale." + gradient CTA
2. **How it works**: 3-step horizontal flow (Build → Submit → Earn)
3. **Revenue calculator**: slider (installs x price = estimated monthly earnings)
4. **Tier benefits table**: all 4 tiers, feature columns (revenue share, support, badge)
5. **CTA**: "Start building" → docs + submission form

### Developer Profile Page

URL: `/developers/:handle`

Sections:
1. **Hero**: avatar (64px), display name, handle, badge pill, bio, social links, Follow button
2. **Stats row**: Total installs | Avg rating | Items published | Member since
3. **Published items grid**: reuses `MarketplaceCard` component
4. **Revenue summary** (private, visible to owner only): this month / all time in a blurred card

---

## 4. Submission Flow UI

### 3-Step Wizard

Progress indicator: horizontal steps bar at top. Active step uses gradient fill, completed
steps show a checkmark. Step labels: "Type & Basics" / "Package & Preview" / "Review & Submit".

**Step 1 — Type & Basics**
- Type selector: three large cards (Theme / Component / Template), one selectable at a time
- Name field (text input, max 60 chars)
- Short description (textarea, 160 char limit with live counter)
- Tags (multi-select chips from predefined taxonomy)
- Price model: Free toggle or Paid with price input (min $1, recommended $4–$19)

**Step 2 — Package & Preview**
- npm package name input with live availability check (debounced, shows check/X)
- Version field (semver validation)
- Preview image upload: drag-and-drop zone (16:9 ratio, max 2MB, shows preview)
- Changelog / release notes: markdown textarea with preview toggle
- Docs URL (optional, shows globe icon)
- GitHub repo URL (optional, shows GitHub icon, enables trust badge)

**Step 3 — Review & Submit**
- Summary card: rendered listing card as it will appear in the marketplace
- Full detail preview: how the detail page will look
- Terms checkbox: "I agree to the Traek Marketplace Terms and 70/30 revenue split"
- "Submit for review" button (gradient, disabled until terms checked)

**Post-Submit Confirmation**
- Large checkmark animation
- "Submission received!" heading
- Estimated review time: "2-5 business days"
- Link to submission status dashboard
- "Submit another item" secondary CTA

### Validation Rules

- All required fields must pass before Next button enables (per-step)
- Inline error messages appear below fields on blur
- Package name uniqueness checked against API in real-time
- Image dimensions validated client-side before upload

---

## 5. Revenue Dashboard (Creator View)

### Navigation

Dashboard tabs: Overview | Payouts | My Items | Audience

### Overview Tab

**Stats row (4 cards)**:
Each card shows: large number (28px semibold white), label (muted), trend badge (colored up/down arrow).
Cards: "This Month" / "All Time" / "Avg Rating" / "Active Items"

**Revenue chart (60% width)**:
- Line chart with gradient fill (cyan at line → transparent at zero)
- Time range pills: 30d / 90d / 1yr / All
- Grid lines: `rgba(255,255,255,0.04)`
- Hover tooltip: dark card, shows date + exact revenue
- Rendered in SVG (no external charting lib)

**Top items table (40% width)**:
- Rank number, item name with thumbnail, monthly revenue
- Click row to navigate to item's analytics

**Recent transactions table**:
- Columns: Date | Item | Buyer plan | Gross | Net (70%) | Status
- Status chips: Pending (orange), Processing (cyan), Paid (lime), Failed (red)
- Paginated 20 rows

### Payouts Tab

- Current balance (large display)
- Minimum payout: $50
- Payment method: Stripe Connect setup (bank transfer or PayPal)
- Schedule: Monthly, net-30
- "Request payout" button (enabled when balance >= $50)
- Payout history table

### My Items Tab

Table/grid toggle. Shows all submitted items with status:
- Draft | Under Review | Live | Rejected | Archived
- Quick stats per item: installs, revenue, rating
- Edit / Archive / Unpublish actions

### Audience Tab

- Install breakdown by subscription plan (Free / Pro / Enterprise) — donut chart
- Top countries table (install count + flag emoji)
- Weekly install trend line chart

---

## Accessibility

- All interactive elements meet WCAG AA color contrast (verified: cyan #00d8ff on #161616 = 9.2:1)
- Focus indicators: `outline: 2px solid var(--pg-cyan)` with `outline-offset: 2px`
- Badges always pair icon with visible text label (color is not sole indicator)
- Charts provide accessible `<table>` alternatives in a visually hidden section
- Form inputs always have associated `<label>` elements (no placeholder-only labels)
- All modals/wizards trap focus and respond to Escape to close
- `prefers-reduced-motion`: all transitions set to 0.01ms

---

## Implementation Notes

### File Structure (Playground app)

```
apps/playground/src/routes/
  marketplace/
    +layout.svelte              # Marketplace shell with nav and sidebar
    +page.svelte                # Browse / search grid
    [slug]/+page.svelte         # Detail page
    submit/
      +page.svelte              # 3-step wizard
    dashboard/
      +page.svelte              # Creator overview
      payouts/+page.svelte
      items/+page.svelte
      audience/+page.svelte
    developers/
      +page.svelte              # Developer program landing
      [handle]/+page.svelte     # Developer profile
```

### Shared Components

```
apps/playground/src/lib/marketplace/
  MarketplaceCard.svelte        # Listing card (browse grid)
  BadgePill.svelte              # Creator badge (4 tiers)
  StarRating.svelte             # Stars display + input
  InstallButton.svelte          # Gradient install CTA
  RevenueChart.svelte           # SVG line chart with gradient fill
  SubmissionWizard.svelte       # 3-step form orchestrator
  TypeSelector.svelte           # Theme/Component/Template card picker
```

### Data Model (TypeScript sketch)

```ts
type ItemType = 'theme' | 'component' | 'template'
type BadgeTier = 'contributor' | 'creator' | 'pro_creator' | 'verified_partner'
type ItemStatus = 'draft' | 'under_review' | 'live' | 'rejected' | 'archived'

interface MarketplaceItem {
  id: string
  slug: string
  type: ItemType
  name: string
  description: string
  publisherId: string
  packageName: string
  version: string
  priceMonthly: number   // 0 = free
  installCount: number
  rating: number         // 0-5
  tags: string[]
  previewImageUrl: string
  status: ItemStatus
  createdAt: string
  updatedAt: string
}

interface Publisher {
  id: string
  handle: string
  displayName: string
  avatarUrl: string
  badge: BadgeTier
  bio: string
  totalInstalls: number
  avgRating: number
}

interface CreatorRevenue {
  thisMonth: number
  allTime: number
  pendingPayout: number
  lastPayoutDate: string | null
}
```
