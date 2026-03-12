# Canvas Export & Sharing Design

**Date:** 2026-03-08
**Issue:** TRK-77
**Status:** Implemented

## Overview

Design and implement export formats that let users share Traek conversations outside the app. The spatial canvas is a great medium for exploring ideas, but users need to get their conversations into documents, chat tools, and mobile contexts.

## Deliverables

### 1. Print Stylesheet (`export/print.css`)

A `@media print` stylesheet that flattens the absolutely-positioned canvas nodes into a linear, paginated document.

**Approach:**
- Reset all `transform` and `position: absolute` on canvas viewport and node wrappers
- Render nodes in a `flex-direction: column` flow, ordered top-to-bottom
- Insert `page-break-before: always` at branch points via `data-branch-point="true"` attribute
- Use `@page` rule for margins and page numbering
- Apply role-based color coding (user: `#0077cc`, assistant: `#c04000`) via `::before` pseudo-elements on `[data-role]`

**Supplementary class `.traek-print-preview`** for in-app print preview rendering.

### 2. Print / PDF Export (`exportExtended.snapshotToPDFHtml`)

A pure TypeScript function that generates a self-contained HTML document from a `ConversationSnapshot`:
- Linearizes the tree into threads using DFS (root → leaf paths)
- Inserts `page-break-before: always` style on branch 2+ threads
- Fully self-contained: no external CSS or JS dependencies
- Companion `printConversation()` helper opens a popup window and triggers `window.print()`

### 3. Share Link Preview Card (`SharePreviewCard.svelte`)

A Svelte 5 component rendering at **1200×630px** (standard OG image ratio):
- OLED dark background (#070708) with dot-grid pattern
- Cyan glow top-right, orange glow bottom-left (matches Traek brand)
- Displays: title (2-line clamp), preview text, last 3 messages strip, stats (message count, branch count), share URL
- Can be SSR-rendered and captured via `sharp` / `resvg-js` for automatic OG image generation

### 4. Read-only Embed Widget (`TraekEmbed.svelte`)

An iframe-safe, self-contained Svelte 5 component:
- Accepts `snapshot: ConversationSnapshot` and optional `shareUrl`
- Single thread: rendered as a simple conversation list
- Multiple branches: `<details>/<summary>` accordion (first branch open by default)
- Role indicators with brand colors (user: cyan, assistant: orange)
- Footer with "Open in Traek →" link and "Powered by Traek" branding
- No external resources; all styles are scoped

### 5. Slack / Discord Preview Format (`exportExtended`)

**`snapshotToSlack(snapshot, { shareUrl?, maxMessages? })`**
- Returns a Slack Block Kit `{ blocks: SlackBlock[] }` payload
- Header block with conversation title
- Context block with message/branch counts
- Section blocks for each preview message (truncated to 280 chars)
- Optional "Open in Traek →" link section

**`snapshotToDiscord(snapshot, { shareUrl?, maxMessages? })`**
- Returns a Discord webhook `{ content, embeds }` payload
- Embed color: `0x00d8ff` (Traek cyan)
- Fields for each preview message
- Footer: "Powered by Traek · traek.dev"

### 6. QR Code for Mobile Handoff (`QrHandoff.svelte`)

A Svelte 5 component using the `qrcode` npm package:
- Renders QR code onto a `<canvas>` element
- Dark-on-dark color scheme: `#e4e4e7` (module) on `#0e0e10` (background)
- Cyan corner accent marks in the style of QR finder patterns
- Shows the short URL below for manual entry
- Configurable size and error correction level (`L/M/Q/H`)

## Architecture

```
packages/svelte/src/lib/export/
├── print.css              # @media print stylesheet + .traek-print-preview class
├── exportExtended.ts      # snapshotToPDFHtml, printConversation, snapshotToSlack, snapshotToDiscord
├── SharePreviewCard.svelte # OG image preview card component
├── TraekEmbed.svelte      # Read-only iframe-friendly embed widget
├── QrHandoff.svelte       # QR code for mobile handoff
└── index.ts               # Barrel exports
```

All new exports are re-exported from `packages/svelte/src/lib/index.ts`.

## Design Decisions

- **No server dependency for QR/print**: All features work client-side for easy adoption
- **Self-contained embed**: `TraekEmbed` has zero external dependencies so it's safe in sandboxed iframes
- **OG card = Svelte component**: Reusable in both preview UI and server-side capture workflows
- **Slack & Discord as JSON functions**: Apps can call these functions and POST to webhooks directly
- **`qrcode` as runtime dependency**: Small, well-maintained, handles all QR encoding edge cases

## Brand Consistency

All components follow the Traek design system:
- Primary accent: `#00d8ff` (cyan) for user role and interactive elements
- Secondary accent: `#ff4400` (orange-red) for assistant role
- Background: `#070708` / `#0e0e10` (OLED dark)
- Border: `#1f1f24`
- Text: `#e4e4e7` (primary), `#71717a` (muted), `#3f3f46` (faint)
