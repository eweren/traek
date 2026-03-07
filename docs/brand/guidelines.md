# træk Brand Guidelines

> *Follow ideas, not threads.*

---

## Brand Personality

træk occupies a specific position on these spectrums:

| Dimension | Position |
|-----------|----------|
| Minimal ↔ Ornate | Refined minimal |
| Modern ↔ Classic | Distinctly modern |
| Warm ↔ Cool | Cool (cyan-dominant) |
| Bold ↔ Subtle | Confidently subtle |
| Friendly ↔ Professional | Developer-professional |
| Innovative ↔ Trustworthy | Innovative-first |

**Brand archetype:** The Innovator — thoughtful, spatial, developer-native.

træk is for builders who think carefully about interaction. The brand reflects that: precise, non-generic, and technically confident without being cold.

---

## Voice & Tone

### Core phrases

- *"Follow ideas, not threads."* — primary tagline
- *"A map, not a log."* — conversation as space
- *"If AI thinking branches, your UI should too."* — the problem statement
- *"Ideas deserve more space than a scroll."* — the aspiration

### Writing principles

**Direct.** No marketing filler. Developers respect brevity.

**Spatial metaphors.** Lean into maps, paths, branches, nodes — the vocabulary of traversal, not conversation.

**Quiet confidence.** Make strong claims without hedging. "træk replaces the timeline with a spatial mental model" — not "træk can help you manage complex conversations."

**Second person, present tense.** "You navigate, not scroll." Not "Users will be able to navigate."

**Technical precision.** Use exact terms: node, branch, parent, leaf, canvas, viewport. Avoid vague language like "chat bubbles" or "messages."

### Tone by context

| Context | Tone |
|---------|------|
| Landing page | Bold, evocative, conceptual |
| Docs | Clear, direct, example-first |
| Error messages | Calm, specific, actionable |
| Empty states | Inviting, brief, not cute |
| Loading | Minimal — no "hang tight!" |

---

## Logo & Wordmark

**Name:** træk (lowercase always; the special character ‛æ' is required)

**Pronunciation:** /traek/ — rhymes with "track"

**Etymology:** Danish *træ* (tree) + English *track* (path)

### Usage rules

- Always lowercase: `træk`, never `Træk` or `TRÆK` in body text
- In sentences: treat as a proper noun — no article ("use træk", not "use a træk")
- In code contexts: `@traek/svelte`, `@traek/react` — scoped npm package pattern
- The æ character is non-negotiable; do not substitute `ae` or `trek`

### Logo treatments

| Variant | Use |
|---------|-----|
| `træk` wordmark | Primary — headers, landing pages |
| `t` monogram | Favicon, small icons, app icon |
| `@traek` | Code and package contexts |

---

## Color System

træk uses a dark-first color system with a cyan + lime accent gradient.

### Primary palette

| Token | Dark value | Light value | Use |
|-------|-----------|-------------|-----|
| `--traek-accent-cyan` | `#00d8ff` | `#0099cc` | Primary accent, active states, links |
| `--traek-accent-lime` | `#00ffa3` | `#00c97a` | Gradient end, success states |
| `--traek-bg-body` | `#0b0b0b` | `#f5f5f5` | Page background |
| `--traek-node-bg` | `#161616` | `#ffffff` | Card / node backgrounds |

### Accent gradient

The signature visual: cyan → lime at 135°.

```css
background: linear-gradient(135deg, #00d8ff, #00ffa3);
```

Used on: primary buttons, header accents, active indicators, loading states.

**Never** use the gradient for body text or large backgrounds — it's a highlight, not a fill.

### Neutral scale (dark mode)

```
#f5f5f5  — headings, strong text
#dddddd  — body text
#c3c3c3  — secondary text
#a5a5a5  — muted labels
#8b8b8b  — placeholder, disabled
#555555  — borders, dividers
#2a2a2a  — node borders
#161616  — card/node background
#0b0b0b  — page background
#000000  — absolute black (demo frames)
```

### Semantic colors

| Purpose | Dark | Light |
|---------|------|-------|
| User node accent | `#00d8ff` (cyan) | `#0099cc` |
| Assistant node accent | `#ff3e00` (orange-red) | `#e03a00` |
| Error | `#cc0000` | `#b30000` |
| Search highlight | `rgba(255,235,59,0.4)` | `rgba(255,235,59,0.6)` |

### Color don'ts

- Don't use pure `#ffffff` text on dark backgrounds — use `#f5f5f5` or `#dddddd`
- Don't use purple or blue gradients — that's the generic AI look; træk is cyan/lime
- Don't use warm colors (orange/amber/yellow) as brand accents — orange is reserved for the assistant node border
- Don't mix cyan and orange as co-equal accents — cyan is primary

---

## Typography

### Type scale

| Role | Font | Weight | Size |
|------|------|--------|------|
| Display / hero | Space Grotesk | 700 | `clamp(2.4rem, 3vw + 1.6rem, 3.4rem)` |
| Section headings | Space Grotesk | 600–700 | `1.5rem` – `1.7rem` |
| Body | Space Grotesk | 400 | `0.95rem` – `1.05rem` |
| Eyebrow / label | Space Grotesk | 400 | `0.8rem`, uppercase, `letter-spacing: 0.16em` |
| Code | Space Mono | 400 | `0.8rem` – `0.9rem` |

### Type rules

- **Letter spacing:** Headlines: `-0.03em` to `-0.04em`. All-caps labels: `+0.16em`.
- **Line height:** Display: `1.05`. Headings: `1.2`. Body: `1.5`. Code: `1.6`.
- **Font files:** Self-hosted as variable fonts (`SpaceGrotesk-VariableFont_wght.ttf`, `SpaceMono-Regular.ttf`), served from `/public/`.
- **Fallback:** `sans-serif` for Space Grotesk; `monospace` for Space Mono.

---

## Spacing System

Based on a 4px base unit. Key values:

| Token | Value | Use |
|-------|-------|-----|
| `0.25rem` | 4px | Icon gaps, tiny insets |
| `0.5rem` | 8px | Tight internal padding |
| `0.75rem` | 12px | Component internal gaps |
| `1rem` | 16px | Default spacing |
| `1.5rem` | 24px | Section sub-gaps |
| `2rem` | 32px | Card padding |
| `3rem` | 48px | Section gaps |
| `4rem` | 64px | Large section breaks |

---

## Shape & Radius

| Element | Radius |
|---------|--------|
| Cards, panels | `16px` – `24px` |
| Buttons (primary) | `999px` (pill) |
| Input fields | `999px` (pill) |
| Nodes | `12px` |
| Badges, tags | `999px` (pill) |
| Code blocks | `12px` |
| Thumbnails | `8px` |

**Guiding principle:** Interactive elements are pills. Structural containers are rounded but not pill-shaped.

---

## Shadows & Depth

Dark mode uses deep, ambient shadows. Never flat.

```css
/* Nodes and cards */
box-shadow: 0 18px 45px rgba(0, 0, 0, 0.75);

/* Primary button */
box-shadow: 0 12px 32px rgba(0, 216, 255, 0.28);

/* Demo frame */
box-shadow: 0 22px 60px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(0, 0, 0, 0.6);
```

Cyan-tinted shadows are reserved for interactive elements with the cyan accent (buttons, active node borders).

---

## Motion & Animation

træk animations are **smooth and purposeful**, never playful or bouncy.

### Timing

| Use | Duration | Easing |
|-----|----------|--------|
| Hover states | `100ms–150ms` | `ease-out` |
| Color transitions | `150ms` | `ease-out` |
| Button hover lift | `100ms` | `ease-out` |
| Panel slide-in | `200ms–300ms` | `cubic-bezier(0.33, 1, 0.68, 1)` |
| Canvas pan/zoom | Native (no CSS) | — |

### Streaming text

Text streams word-by-word with a small random delay per word (12–37ms per chunk). This simulates natural AI token output without being visually distracting.

### Reduced motion

Always respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Canvas Visual Language

The canvas is the product. Its visual language is minimal and functional:

- **Background:** Near-black (`#0b0b0b`) with subtle dot grid (`#333333`)
- **Connections:** Subtle stroke (`#333333`), highlights on active path (`#00d8ff`)
- **Nodes:** Dark card with thin border, role indicated by top border color (cyan = user, orange-red = assistant)
- **Active node:** Subtle cyan glow (`rgba(0, 216, 255, 0.15)`) + cyan border
- **Minimap:** Semi-transparent overlay, bottom-right, appears at 5+ nodes

---

## Marketing & Landing Page Patterns

### Hero structure

```
[eyebrow label]
[H1 headline]
[tagline]
[feature pills]
[primary CTA] [secondary CTA]
[framework badges]
[hero canvas demo]
```

### Section rhythm

Alternate between: copy-heavy left + visual right, then visual left + copy right. Use `radial-gradient` accent glows to distinguish sections without hard separators.

### Demo frame treatment

Canvas demos in marketing are shown in rounded dark frames (`border-radius: 24px`) with ambient shadow. UI chrome (input, zoom controls) is hidden — only the conversation graph is visible.

### Framework support communication

When listing framework support, always show active frameworks with the cyan accent and pending ones in muted grey with "soon" label:

```html
<span class="fw-badge fw-badge--active">Svelte 5</span>
<span class="fw-badge fw-badge--active">React</span>
<span class="fw-badge">Vue <span class="fw-soon">soon</span></span>
```

---

## What træk Is Not

To maintain brand clarity, træk should never be positioned as:

- A chat widget or embeddable bubble
- A general-purpose UI component library
- A tool for simple Q&A bots
- A "better ChatGPT interface"

træk is **infrastructure for non-linear AI interaction** — positioned at the intersection of AI tooling and spatial UX, for developers who build serious AI products.

---

*Last updated: 2026-03-07*
