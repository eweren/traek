# Plugin Marketplace Listing — Visual Guide

**Document:** TRK-49 deliverable
**Date:** 2026-03-08
**Author:** UI & Brand Designer

---

## Overview

This guide specifies the exact visual format for plugin listings in the Træk Marketplace. It covers two surfaces:

1. **Browse grid card** — the compact tile shown in the `/marketplace` grid
2. **Detail page** — the full listing at `/marketplace/components/<slug>` (or `themes/`, `templates/`)

Both surfaces use `--pg-*` design tokens defined in `apps/playground/src/app.css`.

---

## 1. Browse Grid Card

```
┌─────────────────────────────────────────────────────────────────┐
│  [icon 32px]   displayName                    [badge pill]      │
│                description (1–2 lines, truncated)               │
│                                                                  │
│  [tag] [tag] [tag]               ★ 4.8  ↓ 1.2k  $9/mo         │
└─────────────────────────────────────────────────────────────────┘
```

### Card anatomy

| Element | Source field | Display rules |
|---|---|---|
| **Icon** | `traek-plugin.json > icon` | 32×32px box, emoji or image; fallback: first letter of `displayName` in `--pg-cyan` |
| **Display name** | `displayName` | `font: 600 15px Space Grotesk`; max 1 line, truncated |
| **Badge pill** | `creator tier` | Contributor / Creator / Pro Creator / Partner — see badge system |
| **Description** | `description` | `font: 400 13px`; `color: --pg-text-secondary`; 2-line clamp |
| **Tags** | `tags[0..2]` | Pill style `background: rgba(255,255,255,0.06)`, show first 3 only |
| **Rating** | Computed from reviews | ★ + 1dp score; hidden if `< 3` reviews |
| **Install count** | Computed | Formatted: `1200 → 1.2k`, `12000 → 12k` |
| **Price** | `pricing` | `Free` in `--pg-lime`; `$X/mo` in `--pg-text` |

### Card states

```
default:  background: --pg-bg-card
          border: 1px solid --pg-border
          border-radius: 12px

hover:    background: --pg-bg-card-hover
          border-color: --pg-border-strong
          box-shadow: 0 4px 24px rgba(0,216,255,0.08)
          cursor: pointer
          transition: all 180ms ease

focused:  outline: 2px solid --pg-cyan
          outline-offset: 2px

featured: border-color: --pg-border-cyan
          top-left badge: "Featured" in --pg-gradient
```

### Card grid layout

```
Desktop (≥1024px):  3-column grid, gap 16px
Tablet (768–1023px): 2-column grid, gap 12px
Mobile (< 768px):   1-column list, gap 8px
```

---

## 2. Detail Page

The detail page has three zones: **hero**, **body**, and **sidebar**.

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  HERO                                                                         │
│  [icon 64px]  displayName            [Install]  [★ 4.8 (42)]  [↓ 1.2k]     │
│               by AuthorName · component · Svelte · v1.2.0                   │
│  [tag] [tag] [tag]                                              [$9 /month]  │
├─────────────────────────────────────────────────────┬────────────────────────┤
│  BODY (main column, 2/3 width)                      │  SIDEBAR (1/3 width)  │
│                                                     │                        │
│  [Screenshot carousel]                              │  Install               │
│                                                     │  ┌──────────────────┐ │
│  ## What It Does                                    │  │ npm install ...   │ │
│  <readme prose>                                     │  └──────────────────┘ │
│                                                     │                        │
│  ## Installation                                    │  Version history       │
│  <code snippet>                                     │  · v1.2.0 (current)   │
│                                                     │  · v1.1.0             │
│  ## Node Types                                      │  · v1.0.0             │
│  <API reference>                                    │                        │
│                                                     │  Links                 │
│  ## Changelog                                       │  · GitHub              │
│  <latest changelog entry>                           │  · Docs                │
│                                                     │  · Author profile      │
│  [Reviews section]                                  │                        │
└─────────────────────────────────────────────────────┴────────────────────────┘
```

### Hero zone

| Element | Detail |
|---|---|
| **Icon** | 64×64px, rounded-lg; emoji centered on `--pg-bg-card` bg |
| **Display name** | `font: 700 28px Space Grotesk` |
| **Byline** | `by <AuthorName> · <type> · <framework> · v<version>` in `--pg-text-secondary` |
| **Tags** | Same pill style as card; all tags shown |
| **Install button** | Primary CTA: `background: --pg-gradient`, `color: #000`, `font: 600 14px`, `border-radius: 8px`, `padding: 10px 20px`; label: "Install" for free, "Try free for 14 days" for paid |
| **Rating** | Interactive star display; shows count in parentheses |
| **Download count** | `↓ 1.2k installs` in `--pg-text-secondary` |
| **Price** | Free: `Free` in `--pg-lime`; Paid: `$X /month` (or `/year`, `/one-time`) in `--pg-text` |

### Screenshot carousel

```
- Aspect ratio: 16:9 preferred, min width: 640px screenshot source
- Carousel dots below: 8px circles, active = --pg-cyan
- Previous/Next arrows: appear on hover, 36×36px, rgba(0,0,0,0.6) bg
- Max 5 screenshots (matches manifest limit)
- If both light and dark screenshots exist, show a theme toggle button
  top-right of carousel to switch between them
```

### Install code block

The sidebar install block shows a ready-to-copy command:

```
npm install <package-name>
```

```
Styling:
  background: --pg-bg-card
  border: 1px solid --pg-border
  border-radius: 8px
  font: Space Mono 13px
  padding: 12px 14px
  Copy button: top-right, 24×24px icon button
  On copy: button label briefly changes to "Copied!" in --pg-lime
```

### Body: Readme rendering

The `readme` field from the manifest is rendered as Markdown with these style overrides:

| Element | Style |
|---|---|
| `h2` | `font: 600 18px Space Grotesk`, border-bottom `--pg-border` |
| `h3` | `font: 600 15px Space Grotesk` |
| `code` (inline) | `background: rgba(255,255,255,0.08)`, `font: Space Mono 13px`, `border-radius: 4px` |
| `pre code` | Full-width code block, `background: --pg-bg-card`, syntax-highlighted |
| `table` | `border-collapse: collapse`; `td/th` border `--pg-border`; header bg `rgba(255,255,255,0.04)` |
| `a` | `color: --pg-cyan`, no underline by default, underline on hover |

---

## 3. Badge Pill System

Badges communicate creator program tier and listing quality signals.

| Badge | Background | Text color | When shown |
|---|---|---|---|
| **Contributor** | `rgba(255,255,255,0.1)` | `--pg-text-secondary` | First submission approved |
| **Creator** | `rgba(0,216,255,0.15)` | `--pg-cyan` | 100+ installs, 4.0+ rating |
| **Pro Creator** | `rgba(0,255,163,0.15)` | `--pg-lime` | 1k+ installs, 4.5+ rating, 3+ items |
| **Partner** | `--pg-gradient` | `#000` | Invite only |
| **Featured** | `--pg-gradient` | `#000` | Editorially selected for home page |
| **Verified** | `rgba(0,216,255,0.12)` | `--pg-cyan` | Manually reviewed by Træk team |
| **Free** | `rgba(0,255,163,0.12)` | `--pg-lime` | `pricing.type === 'free'` |

Badge anatomy:

```
border-radius: 100px
padding: 3px 10px
font: 500 11px Space Grotesk
letter-spacing: 0.04em
text-transform: uppercase
```

---

## 4. Empty & Loading States

### Grid loading skeleton

Each card placeholder:

```
- Show 6 skeleton cards arranged in the grid
- Animated shimmer: background moves left-to-right,
  gradient: rgba(255,255,255,0) → rgba(255,255,255,0.04) → rgba(255,255,255,0)
- animation duration: 1.5s, infinite
```

### Empty search results

```
┌──────────────────────────────┐
│          (empty icon)        │
│   No plugins found           │
│   Try different keywords     │
│   or remove a filter         │
└──────────────────────────────┘
```

```
icon: 48px search/magnifier in --pg-text-muted
title: font: 600 16px, --pg-text
body: font: 400 13px, --pg-text-secondary
```

---

## 5. Responsive Breakpoints

| Breakpoint | Grid | Detail layout |
|---|---|---|
| Mobile `< 640px` | 1 col | Single column (sidebar moves below body) |
| Tablet `640–1023px` | 2 col | Single column (sidebar moves below body) |
| Desktop `≥ 1024px` | 3 col | Body + sidebar side-by-side |
| Wide `≥ 1280px` | 3 col + featured row | Body (60%) + sidebar (40%) |

---

## 6. Accessibility Requirements

All marketplace listing surfaces must meet WCAG AA:

- **Color contrast:** all text on `--pg-bg-card` must have ≥ 4.5:1 contrast ratio
- **Focus visible:** `outline: 2px solid var(--pg-cyan); outline-offset: 2px` on all interactive elements
- **Install button:** `aria-label="Install <displayName>"` when the button label is just "Install"
- **Screenshots:** every `<img>` must have a non-empty `alt` matching the manifest screenshot `alt` field
- **Rating:** rendered as `<span aria-label="Rated 4.8 out of 5 stars">★ 4.8</span>`
- **Copy button:** `aria-label="Copy install command"` / `aria-live="polite"` for "Copied!" feedback
- **Carousel:** prev/next buttons `aria-label="Previous screenshot"` / `"Next screenshot"`, `role="region" aria-label="Screenshots"` on container

---

## 7. File References

| File | Purpose |
|---|---|
| `apps/playground/src/lib/marketplace/MarketplaceCard.svelte` | Browse grid card component |
| `apps/playground/src/lib/marketplace/BadgePill.svelte` | Badge pill component |
| `apps/playground/src/routes/marketplace/+page.svelte` | Browse grid page |
| `apps/playground/src/routes/marketplace/submit/+page.svelte` | Submission wizard |
| `apps/playground/src/routes/marketplace/developers/+page.svelte` | Creator program page |
| `apps/playground/src/lib/marketplace/plugin-manifest-schema.ts` | Manifest Zod schema |
| `apps/playground/src/app.css` | `--pg-*` design tokens |
