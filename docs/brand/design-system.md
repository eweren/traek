# træk Design System — Comprehensive Reference

> *Follow ideas, not threads.*

**Version:** 1.0 · **Last updated:** 2026-03-08

This document is the single source of truth for the træk design system. It covers every layer of the visual language — logo, color, typography, spacing, components, motion, and copy. Engineers, designers, and contributors should use this to build surfaces that feel unmistakably træk.

---

## Table of Contents

1. [Brand Identity](#1-brand-identity)
2. [Logo & Wordmark](#2-logo--wordmark)
3. [Color System](#3-color-system)
4. [Typography](#4-typography)
5. [Spacing & Grid](#5-spacing--grid)
6. [Border Radius & Shape](#6-border-radius--shape)
7. [Shadows & Elevation](#7-shadows--elevation)
8. [Motion & Animation](#8-motion--animation)
9. [Component Patterns](#9-component-patterns)
10. [Voice & Tone for UI Copy](#10-voice--tone-for-ui-copy)
11. [Accessibility](#11-accessibility)
12. [CSS Custom Properties Reference](#12-css-custom-properties-reference)

---

## 1. Brand Identity

### Positioning

træk is **infrastructure for non-linear AI interaction**. It sits at the intersection of AI tooling and spatial UX — built by developers, for developers who are constructing serious AI products.

| Dimension | Position |
|-----------|----------|
| Minimal ↔ Ornate | Refined minimal |
| Modern ↔ Classic | Distinctly modern |
| Warm ↔ Cool | Cool (cyan-dominant) |
| Bold ↔ Subtle | Confidently subtle |
| Friendly ↔ Professional | Developer-professional |

**Archetype:** The Innovator — thoughtful, spatial, technically precise.

### What træk Is Not

- A chat widget or embeddable bubble
- A general-purpose UI component library
- A tool for simple Q&A bots
- "A better ChatGPT interface"

Avoid these framings in all copy and design.

---

## 2. Logo & Wordmark

### Name & Pronunciation

- **Written:** `træk` — always lowercase in body text
- **Pronounced:** /traek/ — rhymes with "track"
- **Etymology:** Danish *træ* (tree) + English *track* (path)

### The æ Character

The ligature æ is **non-negotiable**. Never substitute:
- ❌ `traek` (ae substitution)
- ❌ `trek` (missing letter)
- ❌ `Træk` (uppercase in body text)
- ✅ `træk` (correct)

Exception: package scopes on npm use ASCII — `@traek/svelte` is correct.

### Logo Variants

| Variant | Context | Notes |
|---------|---------|-------|
| `træk` wordmark | Primary — headers, landing pages, README | Always in brand typeface (Space Grotesk 700) |
| `t` monogram | Favicon, app icon, small lockups | Circular or square container |
| `@traek` | Code blocks, package references | Monospace, unbranded style |

### Clear Space

Minimum clear space around the wordmark = **1× the cap-height of the æ character**.

```
┌────────────────────────────────┐
│  [1× cap-height padding]       │
│  [1× cap-height]  træk  [1×]  │
│  [1× cap-height padding]       │
└────────────────────────────────┘
```

On dark backgrounds: do not reduce clear space to accommodate other elements — move the other elements instead.

### Minimum Sizes

| Medium | Minimum size |
|--------|-------------|
| Screen (wordmark) | 80px wide |
| Screen (monogram) | 16px wide |
| Print (wordmark) | 20mm wide |
| Print (monogram) | 6mm wide |

Below minimum size the æ character becomes illegible — use the monogram instead.

### Colour Usage on Backgrounds

| Background | Wordmark treatment |
|------------|-------------------|
| Dark (#0b0b0b–#161616) | `#f5f5f5` (near-white) |
| Light (#f4f4f5–#ffffff) | `#111113` (near-black) |
| Cyan accent | `#000000` black |
| Photography / complex | Use white wordmark on semi-transparent dark scrim |

**Gradient wordmark:** Acceptable on hero sections only. Apply the brand gradient (`135deg, #00d8ff → #00ffa3`) as a text gradient via `background-clip: text`. Never on small sizes.

### Logo Don'ts

- ❌ Do not rotate or skew
- ❌ Do not outline or stroke the letterforms
- ❌ Do not apply drop shadows to the wordmark
- ❌ Do not place on a busy, low-contrast background without a scrim
- ❌ Do not use brand colours other than the approved list
- ❌ Do not recreate the wordmark in a different typeface

---

## 3. Color System

træk uses a dark-first color system. All values are specified for both themes.

### Accent Colors (Brand Signature)

The signature is a **cyan → lime** gradient at 135°. This is træk's most distinctive visual element.

```css
/* Primary gradient */
background: linear-gradient(135deg, #00d8ff 0%, #00ffa3 100%);
```

| Token | Dark value | Light value | Usage |
|-------|-----------|-------------|-------|
| `--traek-accent` | `#00d8ff` | `#007aad` | Primary accent: active borders, CTAs, links |
| `--traek-accent-lime` | `#00ffa3` | `#00c97a` | Gradient terminus, success, completion |
| `--traek-accent-orange` | `#ff4400` | `#c93a00` | Assistant node border, cursor, warning |

**Gradient rules:**
- ✅ Primary buttons, active indicators, loading bars
- ✅ Section accent glows (`radial-gradient` at very low opacity, 4–8%)
- ✅ Wordmark on hero sections
- ❌ Never on body text
- ❌ Never as large background fills (>25% of viewport)
- ❌ Never combined with other gradients

### Primary Palette — Dark Theme

| Step | Hex | Contrast on canvas | Use |
|------|-----|-------------------|-----|
| Canvas | `#070708` | — | Canvas background |
| Canvas dot | `#1e1e22` | — | Dot grid |
| Card | `#0e0e10` | — | Node / card background |
| Card inner | `#111113` | — | Content background inside nodes |
| Border subtle | `#1f1f24` | — | Node borders, dividers |
| Border mid | `#2a2a30` | — | Input borders, blockquote borders |
| Border strong | `#3f3f46` | — | Muted interactive borders |
| Muted text | `#71717a` | 4.7:1 | Captions, metadata, placeholder |
| Secondary text | `#a1a1aa` | 6.1:1 | Secondary labels, secondary values |
| Body text | `#e4e4e7` | 14.5:1 | Default prose text |
| Heading text | `#f4f4f5` | 16.1:1 | Headings, emphasized text |

All text values are **WCAG AA compliant** (4.5:1 minimum for small text, 3:1 for large text).

### Primary Palette — Light Theme

| Step | Hex | Contrast on canvas | Use |
|------|-----|-------------------|-----|
| Canvas | `#f4f4f5` | — | Canvas background |
| Canvas dot | `#d4d4d8` | — | Dot grid |
| Card | `#ffffff` | — | Node / card background |
| Border subtle | `#e4e4e7` | — | Node borders |
| Border mid | `#d4d4d8` | — | Input borders |
| Muted text | `#71717a` | 4.7:1 | Captions, metadata |
| Secondary text | `#52525b` | 7.1:1 | Secondary labels |
| Body text | `#18181b` | 18.1:1 | Default prose text |

### Semantic Color Roles

| Role | Dark | Light | Meaning |
|------|------|-------|---------|
| User message accent | `#00d8ff` | `#007aad` | Human input; primary interaction |
| Assistant message accent | `#ff4400` | `#c93a00` | AI output; active generation |
| Active / selected | `#00d8ff` | `#007aad` | Currently focused node |
| Error | `#cc0000` | `#b30000` | Failure, validation error |
| Warning | `#ff8800` | `#cc6a00` | Non-blocking alert |
| Success | `#00ffa3` | `#00c97a` | Completion, positive state |
| Search highlight | `rgba(250,204,21,.45)` | `rgba(202,138,4,.55)` | Search match border |

### Accessibility Contrast Ratios

| Pair | Ratio | Standard |
|------|-------|---------|
| `#e4e4e7` on `#070708` | 14.5:1 | AAA |
| `#a1a1aa` on `#070708` | 6.1:1 | AA |
| `#71717a` on `#070708` | 4.7:1 | AA (large text only for small sizes) |
| `#00d8ff` on `#070708` | 8.4:1 | AAA |
| `#ff4400` on `#070708` | 4.6:1 | AA |
| `#18181b` on `#ffffff` | 18.1:1 | AAA |
| `#007aad` on `#ffffff` | 4.6:1 | AA |
| `#000000` on `#00d8ff` | 12.5:1 | AAA (button text) |

### Color Don'ts

- ❌ Never `#ffffff` body text on dark — use `#e4e4e7` or `#f4f4f5`
- ❌ Never purple or blue gradients — the generic AI look
- ❌ Never warm colors (amber, yellow) as brand accents; they are reserved for search
- ❌ Never cyan and orange as co-equal accents — cyan is primary, orange is assistive
- ❌ Never use raw accent colors for large background fills

---

## 4. Typography

### Typefaces

| Role | Family | Weights | Notes |
|------|--------|---------|-------|
| Display & UI | Space Grotesk | 400, 500, 600, 700 | Variable font, self-hosted |
| Monospace | Space Mono | 400 | Self-hosted; code, tokens, data |
| System fallback | `system-ui, -apple-system, BlinkMacSystemFont, sans-serif` | — | Used inside canvas nodes (performance) |

**Font loading:** Serve as variable fonts from `/public/fonts/`. Preload both in `<head>` with `<link rel="preload">`. Do not use Google Fonts CDN in production.

### Type Scale

| Role | Size | Weight | Line-height | Letter-spacing | Component |
|------|------|--------|-------------|----------------|-----------|
| Display / Hero | `clamp(2.4rem, 3vw + 1.6rem, 3.4rem)` | 700 | 1.05 | -0.03em | Landing h1 |
| Section heading | `1.7rem` | 700 | 1.15 | -0.03em | Section h2 |
| Sub-heading | `1.4rem` | 600 | 1.2 | -0.02em | h3, panel titles |
| Card title | `1.1rem` | 600 | 1.25 | -0.01em | Node header |
| Body large | `1.05rem` | 400 | 1.55 | 0 | Landing prose |
| Body default | `0.95rem` | 400 | 1.5 | 0 | Docs, UI text |
| Caption / label | `0.8rem` | 400 | 1.4 | 0 | Metadata, timestamps |
| Eyebrow | `0.75rem` | 500 | 1.4 | +0.16em | All-caps section labels |
| Code inline | `0.85em` | 400 | — | 0 | `<code>` inside prose |
| Code block | `0.8rem`–`0.9rem` | 400 | 1.6 | 0 | Code blocks, terminals |

### Pairing Rules

**Display + Body:** Space Grotesk 700 for headings, Space Grotesk 400 for body. Sufficient contrast from weight alone — no mixing of families needed.

**Code in prose:** Switch to Space Mono for `<code>` elements, return to Space Grotesk for surrounding text.

**Eyebrow + heading:** Eyebrow label (uppercase, 0.75rem, letter-spacing +0.16em) placed 12px above the h2. Creates a visual anchor without competing for attention.

**Tabular data:** Space Mono for numeric columns to preserve digit alignment; Space Grotesk for labels.

### Text Colour Hierarchy

```
#f5f5f5 / 700  — Hero headline
#f5f5f5 / 600  — Section heading
#dddddd / 400  — Body prose
#a5a5a5 / 400  — Muted / secondary
#8b8b8b / 400  — Placeholder, disabled
```

---

## 5. Spacing & Grid

### Base Unit

All spacing derives from a **4px base unit**. Use multiples of 4 for all layout values.

| Token name | Value | Rem | Use |
|-----------|-------|-----|-----|
| `space-1` | 4px | 0.25rem | Icon gaps, micro-insets |
| `space-2` | 8px | 0.5rem | Tight internal padding, icon + label gap |
| `space-3` | 12px | 0.75rem | Component internal gaps (input padding) |
| `space-4` | 16px | 1rem | Default element spacing |
| `space-6` | 24px | 1.5rem | Card internal padding, section sub-gaps |
| `space-8` | 32px | 2rem | Card padding, group separation |
| `space-12` | 48px | 3rem | Section gaps on mobile |
| `space-16` | 64px | 4rem | Section gaps on desktop |
| `space-24` | 96px | 6rem | Major section breaks |
| `space-32` | 128px | 8rem | Hero padding |

### Canvas Node Spacing

Nodes on the canvas follow fixed spacing rules managed by TraekEngine:

| Property | Value |
|----------|-------|
| Node horizontal gap | 64px |
| Node vertical gap | 48px |
| Initial child offset X | 300px |
| Initial child offset Y | 0px |
| Branch angle spread | Progressive (+64px Y per sibling) |

These values are hardcoded in `TraekEngine.svelte.ts` and should only be changed via the engine config API.

### Layout Grid (Landing / Docs)

| Breakpoint | Columns | Gutter | Margin |
|-----------|---------|--------|--------|
| Mobile (<640px) | 4 | 16px | 20px |
| Tablet (640–1024px) | 8 | 24px | 32px |
| Desktop (1024–1440px) | 12 | 32px | 64px |
| Wide (>1440px) | 12 | 32px | auto (max 1280px content) |

**Max content width:** 1280px. Centered on wide viewports.

**Prose width:** 72ch (approximately 680px). Never allow prose columns wider than this.

---

## 6. Border Radius & Shape

### Radius Scale

| Token | Value | Element |
|-------|-------|---------|
| `radius-sm` | 6px | Code blocks, image thumbnails |
| `radius-md` | 12px | Canvas nodes, input fields body, code panels |
| `radius-lg` | 24px | Cards, marketing panels, overlays |
| `radius-pill` | 9999px | Buttons, tags, badges, input fields (outer) |

**Guiding principle:** Interactive elements are pills. Structural containers are `radius-lg`. Content elements (code, nodes) are `radius-md` or `radius-sm`.

### Shape Rules

- Buttons are always pill-shaped (`border-radius: 9999px`)
- Input fields are pill-shaped on the outside; the inner text area is flush
- Canvas nodes use `radius-md` (12px) — feel like physical cards
- Marketing section cards use `radius-lg` (24px) — generous, modern
- Code blocks and blockquotes use `radius-sm` (6px) — precise, technical

---

## 7. Shadows & Elevation

Dark mode uses **deep ambient shadows**. Never flat. Light mode uses soft diffuse shadows.

### Shadow Levels

| Level | Dark value | Light value | Use |
|-------|-----------|-------------|-----|
| 1 — Subtle | `0 2px 8px rgba(0,0,0,.4)` | `0 2px 8px rgba(0,0,0,.06)` | Dropdown menus, tooltips |
| 2 — Node | `0 8px 24px rgba(0,0,0,.6)` | `0 4px 16px rgba(0,0,0,.08)` | Canvas nodes default |
| 3 — Elevated | `0 18px 45px rgba(0,0,0,.75)` | `0 8px 32px rgba(0,0,0,.12)` | Active nodes, hover state |
| 4 — Modal | `0 32px 80px rgba(0,0,0,.9)` | `0 16px 48px rgba(0,0,0,.2)` | Overlays, modals |
| Accent glow | `0 12px 32px rgba(0,216,255,.28)` | `0 8px 24px rgba(0,122,173,.2)` | Active CTA buttons only |
| Demo frame | `0 22px 60px rgba(0,0,0,.9), 0 0 0 1px rgba(0,0,0,.6)` | — | Marketing canvas frames |

**Rules:**
- Accent (cyan) glow shadows are reserved for primary interactive elements — buttons, active node borders
- Do not use glow shadows on static elements
- Shadows should feel like a single light source from above — avoid multi-directional

---

## 8. Motion & Animation

träk animations are **smooth and purposeful**. Never playful or bouncy.

### Duration Scale

| Token | Value | Use |
|-------|-------|-----|
| `duration-fast` | 120ms | Hover color/opacity changes |
| `duration-normal` | 220ms | Panel appearances, height transitions |
| `duration-slow` | 380ms | Page transitions, large layout shifts |

These values are exposed in the theme system: `theme.animation.fast/normal/slow`.

### Easing Functions

| Curve | Value | Use |
|-------|-------|-----|
| Standard ease-out | `cubic-bezier(0.25, 0, 0.3, 1)` | Most transitions |
| Enter (decelerating) | `cubic-bezier(0.0, 0, 0.2, 1)` | Elements entering the screen |
| Exit (accelerating) | `cubic-bezier(0.4, 0, 1, 1)` | Elements leaving the screen |
| Emphasis | `cubic-bezier(0.33, 1, 0.68, 1)` | Panel slide-in, spotlight reveals |

Never use bounce (`cubic-bezier` with values >1) — it conflicts with the precision of the spatial metaphor.

### Specific Patterns

**Hover states:**
```css
transition: color 120ms ease-out, border-color 120ms ease-out, box-shadow 120ms ease-out;
```

**Button hover lift:**
```css
transition: transform 100ms ease-out, box-shadow 100ms ease-out;
/* on :hover */
transform: translateY(-1px);
```

**Panel / overlay entrance:**
```css
transition: opacity 200ms ease-out, transform 200ms cubic-bezier(0.33, 1, 0.68, 1);
/* from */
opacity: 0; transform: translateY(8px) scale(0.98);
/* to */
opacity: 1; transform: translateY(0) scale(1);
```

**Node streaming text:** Word-by-word reveal with 12–37ms random delay per chunk. Do not use CSS animation — handle in JS with `requestAnimationFrame`.

**Canvas pan/zoom:** Native pointer events, no CSS transitions. Smooth is handled by the browser's compositor. Do not add CSS transitions to canvas transform.

### Reduced Motion

Always implement `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

For streaming text: show the complete text immediately when reduced motion is preferred — no character-by-character reveal.

---

## 9. Component Patterns

### Canvas Node

**Structure:**
```
┌─────────────────────────────────┐ ← border: 1px solid #1f1f24
│ [role accent top border 2px]   │ ← cyan (user) or orange (assistant)
│ ┌─────────────────────────────┐ │
│ │ Content (TextNode / custom) │ │ ← padding: 16px
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

Key properties:
- Background: `#0e0e10` (dark) / `#ffffff` (light)
- Border: 1px `#1f1f24` (dark) / `#e4e4e7` (light)
- Border-radius: 12px
- Min-width: 280px, Max-width: 480px (default; overridable)
- Shadow: Level 2 by default, Level 3 when active

**Active state (selected node):**
- Border: 1px `#00d8ff` (dark) / `#007aad` (light)
- Glow: `box-shadow: 0 0 0 3px rgba(0,216,255,.12)` outer ring
- Top accent: 2px solid accent color

**Streaming state:**
- Orange cursor `▊` blinks at 1Hz at end of content
- Node border remains neutral (not active state) until focus

### Input Form

The input bar floats above the canvas — frosted glass style.

Key properties:
- Background: `rgba(14,14,16,.85)` with `backdrop-filter: blur(12px)`
- Border: 1px `#2a2a30`
- Border-radius: 9999px (pill)
- Padding: 12px 16px
- Shadow: Level 4 (modal)

**Send button:**
- Background: `#00d8ff` (accent)
- Text: `#000000`
- Border-radius: 9999px
- Hover: translateY(-1px) + accent glow shadow
- Disabled: 40% opacity, no shadow

**Branch/context pills:**
- Background: `rgba(0,0,0,.35)`
- Text: `#71717a`
- Border-radius: 9999px
- Show current context node title

### Connection Lines (SVG)

Default stroke:
- Color: `#252528` (dark) / `#d4d4d8` (light)
- Width: 1.5px
- Style: cubic-bezier bezier curve

Highlighted (on path to active node):
- Color: `#00d8ff` (dark) / `#007aad` (light)
- Width: 2px
- Opacity: 1

Muted (not on active path):
- Opacity: 0.3

### Thought Panel

Collapsible panel that reveals AI reasoning steps.

Key properties:
- Background: `rgba(14,14,16,.92)` with backdrop-filter
- Border: 1px `#1f1f24`
- When expanded: accent border `#00d8ff` + subtle glow
- Header: compact, icon + step count
- Toggle button: pill, `#27272a` background

Content rows:
- Row background: `rgba(255,255,255,.025)` alternating
- Step labels: `#71717a` muted
- Duration: `#a1a1aa`

### ThemePicker

Compact control — three swatches (dark / light / high-contrast).

- Container: pill, `backdrop-filter: blur(8px)`
- Active swatch: outlined with accent, scale(1.1)
- Persist to localStorage under key `traek-theme`

### Search Bar

Floating search that dims non-matching nodes.

- Triggers with `Cmd+F` / `Ctrl+F`
- Active nodes: full opacity + amber highlight border
- Inactive nodes: `opacity: 0.35` (dark) / `0.28` (light)
- Input: pill, same style as main input but smaller (height: 36px)
- Dismiss: `Escape` key

### Keyboard Help Overlay

Full-screen overlay showing keyboard shortcuts.

- Background: `rgba(0,0,0,.88)` scrim
- Card: `rgba(14,14,16,.92)` with border `rgba(255,255,255,.07)`
- Border-radius: 24px
- Shortcut keys: monospace, `#71717a`, no background
- Section headings: eyebrow style (small caps)

---

## 10. Voice & Tone for UI Copy

### Core Principles

**Direct.** Developers respect brevity. Cut every word that doesn't earn its place.

**Spatial.** Use the vocabulary of traversal, not conversation: *navigate, branch, node, path, canvas, viewport, root, leaf*.

**Quiet confidence.** Make strong claims without hedging. "træk replaces the timeline with a spatial mental model" — not "træk can help you think about conversations differently."

**Second person, present tense.** "You navigate, not scroll." Not "Users will be able to navigate."

**Technical precision.** Call things by their correct names. Node, not "message bubble." Branch, not "new thread."

### Taglines & Key Phrases

| Phrase | Use |
|--------|-----|
| *"Follow ideas, not threads."* | Primary tagline — hero, social, README |
| *"A map, not a log."* | Explanation of the spatial model |
| *"If AI thinking branches, your UI should too."* | Problem statement |
| *"Ideas deserve more space than a scroll."* | Aspiration / emotional |
| *"Spatial AI conversation for developers."* | One-line descriptor |

### Tone by Context

| Context | Tone | Example |
|---------|------|---------|
| Landing page hero | Bold, evocative, conceptual | "A map, not a log." |
| Feature description | Clear, direct, benefit-first | "Branch from any node. Explore alternatives without losing context." |
| Docs — concept | Explanatory, precise | "TraekEngine manages the conversation tree as a `Map<string, Node>` for O(1) lookups." |
| Docs — how-to | Instructional, example-first | "Pass `onSendMessage` to `TraekCanvas`. It receives the message text and parent node id." |
| Error messages | Calm, specific, actionable | "Failed to load message. Check your network and try again." |
| Empty states | Inviting, brief, not cute | "Start a conversation. Type below to add your first node." |
| Loading | Minimal — no enthusiasm | "Loading…" or nothing (show skeleton) |
| Success states | Understated | "Saved." (not "Great! Your work is saved! 🎉") |

### Empty State Copy

| State | Copy |
|-------|------|
| Canvas — no nodes | "Start a conversation." (nothing else) |
| Search — no results | "No nodes match your search." |
| Thought panel — no steps | "No reasoning steps recorded." |
| Branch — no children | (no copy — connection line implies it) |

### Error Message Patterns

**Format:** `[What failed]. [Why, if known]. [What to do].`

| Error | Copy |
|-------|------|
| Network failure | "Connection lost. Check your network and try again." |
| Stream error | "Generation stopped unexpectedly. Branch from here to retry." |
| Rate limit | "Too many requests. Wait a moment before sending." |
| API key missing | "API key not configured. See the setup guide." |
| Node load fail | "Failed to load this node. Refresh to try again." |

**Rules for errors:**
- Never blame the user
- Never use "oops", "uh oh", "whoops"
- Never use exclamation marks in errors
- Always offer a next action

### Microcopy Patterns

**Buttons:**
- Primary action: verb phrase — "Send", "Branch from here", "Add node"
- Destructive: "Delete branch" (not just "Delete")
- Cancel: "Cancel" (not "Never mind" or "Go back")

**Labels:**
- Node role labels: "User" / "Assistant" (not "Human" / "AI" or "You" / "Bot")
- Status: "Streaming…" / "Done" / "Error" (not "Thinking…" / "Complete" / "Oops")

**Tooltips:**
- Keyboard shortcut always in parentheses: "New branch (⌘ Enter)"
- Keep under 8 words

---

## 11. Accessibility

### Targets

- **WCAG 2.2 AA** minimum across all surfaces
- **WCAG 2.2 AAA** for canvas nodes (primary content area)
- **Keyboard navigable** — all interactive elements reachable via Tab
- **Screen reader compatible** — all nodes have `role`, `aria-label`
- **Reduced motion** support (see Motion section)

### Focus Rings

Never remove focus rings. Customise them to brand:

```css
:focus-visible {
  outline: 2px solid #00d8ff;
  outline-offset: 3px;
  border-radius: 4px;
}
```

Light theme:
```css
:focus-visible {
  outline: 2px solid #007aad;
}
```

### Canvas Keyboard Navigation

| Key | Action |
|-----|--------|
| Tab | Focus next node |
| Shift+Tab | Focus previous node |
| Arrow keys | Move between connected nodes |
| Enter | Expand / focus node |
| Escape | Return to canvas (deselect) |
| Cmd+F / Ctrl+F | Open search |
| ? | Open keyboard help |

### ARIA Roles for Canvas

```html
<div role="application" aria-label="Conversation canvas">
  <div role="tree" aria-label="Conversation tree">
    <div role="treeitem" aria-selected="true" aria-label="User message: [content]">
      <!-- node content -->
    </div>
  </div>
</div>
```

### Touch Targets

Minimum touch target size: **44×44px** on all interactive elements. On mobile, increase padding to meet this — do not change visual size.

---

## 12. CSS Custom Properties Reference

All theming is done via CSS custom properties set on `:root` by `ThemeProvider`. You can override any property in your own stylesheet.

### Canvas

```css
--traek-canvas-bg         /* Canvas background */
--traek-canvas-dot        /* Dot grid color */
```

### Nodes

```css
--traek-node-bg               /* Node card background */
--traek-node-border           /* Node card border */
--traek-node-text             /* Node text color */
--traek-node-active-border    /* Focused/selected node border */
--traek-node-active-glow      /* Focused node outer glow */
--traek-node-user-border-top  /* Top accent: user nodes */
--traek-node-assistant-border-top /* Top accent: assistant nodes */
```

### Connections

```css
--traek-connection-stroke     /* Default connection line */
--traek-connection-highlight  /* Active path connection line */
```

### Input

```css
--traek-input-bg              /* Input bar background */
--traek-input-border          /* Input bar border */
--traek-input-shadow          /* Input bar shadow */
--traek-input-button-bg       /* Send button background */
--traek-input-button-text     /* Send button text */
--traek-input-text            /* Input text color */
--traek-input-context-bg      /* Branch context pill background */
--traek-input-context-text    /* Branch context pill text */
--traek-input-dot             /* Typing indicator dot (active) */
--traek-input-dot-muted       /* Typing indicator dot (inactive) */
--traek-stats-text            /* Node stats text color */
```

### Text Node

```css
--traek-text-node-text        /* Text node prose color */
--traek-text-node-bg          /* Text node background */
--traek-markdown-quote-border /* Blockquote left border */
--traek-markdown-quote-text   /* Blockquote text */
--traek-markdown-hr           /* Horizontal rule */
--traek-scroll-hint-bg        /* Scroll-more gradient */
--traek-scroll-hint-text      /* Scroll-more text */
--traek-scrollbar-thumb       /* Scrollbar thumb */
--traek-scrollbar-thumb-hover /* Scrollbar thumb hover */
--traek-typing-cursor         /* Streaming cursor color */
```

### Search

```css
--traek-search-match-border   /* Highlight border on matching nodes */
--traek-search-dimmed-opacity /* Opacity of non-matching nodes */
```

### Thought Panel

```css
--traek-thought-panel-bg
--traek-thought-panel-border
--traek-thought-panel-border-active
--traek-thought-panel-glow
--traek-thought-header-bg
--traek-thought-header-border
--traek-thought-header-muted
--traek-thought-header-accent
--traek-thought-tag-cyan
--traek-thought-tag-orange
--traek-thought-tag-gray
--traek-thought-divider
--traek-thought-row-bg
--traek-thought-footer-bg
--traek-thought-footer-border
--traek-thought-toggle-bg
--traek-thought-toggle-border
```

### Overlays

```css
--traek-overlay-gradient-1    /* Scrim light layer */
--traek-overlay-gradient-2    /* Scrim mid layer */
--traek-overlay-gradient-3    /* Scrim dark layer */
--traek-overlay-card-bg       /* Overlay card background */
--traek-overlay-card-border   /* Overlay card border */
--traek-overlay-card-shadow   /* Overlay card shadow */
--traek-overlay-text          /* Overlay text color */
--traek-overlay-pill-bg       /* Featured pill background */
--traek-overlay-pill-shadow   /* Featured pill glow */
```

### Minimal Override Example

To apply a custom brand accent (e.g., indigo):

```css
:root {
  --traek-node-active-border: #6366f1;
  --traek-node-active-glow: rgba(99, 102, 241, 0.12);
  --traek-node-user-border-top: #6366f1;
  --traek-connection-highlight: #6366f1;
  --traek-input-button-bg: #6366f1;
  --traek-input-button-text: #ffffff;
  --traek-input-dot: #6366f1;
  --traek-thought-panel-border-active: #6366f1;
  --traek-overlay-pill-bg: #6366f1;
}
```

Or use the programmatic API:

```typescript
import { createCustomTheme, darkTheme } from '@traek/svelte'

const indigoTheme = createCustomTheme(darkTheme, '#6366f1')
```

---

*This document is the authoritative reference for the træk design system. When in conflict with other documents, this file takes precedence.*

*Version 1.0 — 2026-03-08*
