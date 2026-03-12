# Træk Launch Demo Video Script

**Type:** Product launch demo
**Duration:** 2:30–3:00 minutes
**Format:** Screen recording with voiceover + optional face-cam (bottom-right corner)
**Music:** Ambient/electronic, low energy, non-distracting
**CTA:** GitHub star + npm install

---

## Pre-Production Notes

- **Resolution:** 1920×1080 (or Retina 2x)
- **Browser:** Chrome, clean profile, dark mode OS
- **Demo app:** Pre-loaded with an interesting but not overwhelming conversation tree
- **Font size:** Increase browser font to 125% for readability
- **Cursor:** Large cursor highlight for screen recording
- **Recording tool:** Screen Studio or Loom (cinematic zoom effects)

---

## Script

### [0:00–0:10] Hook — The Problem

**[Screen: Show a generic linear chat interface — lots of messages, user scrolling up frantically]**

**Voiceover:**
> "You've been here. Scrolling back through a long AI conversation trying to find that one answer... that was buried twenty messages ago."

**[Cut to: Browser tab with 3 long chat threads open]**

> "We build AI products with incredible models, then wrap them in a chat window from 2010."

---

### [0:10–0:25] The Reveal

**[Transition: Cross-fade to Træk canvas — same conversation, but as a spatial tree]**

**Voiceover:**
> "This is Træk."

**[Camera zooms in on the canvas, panning slowly across nodes]**

> "Same conversation. But now it's a canvas. Every message is a node. You can pan, zoom, and actually *see* your conversation."

**[Show a branch point with two child nodes diverging]**

> "And you can branch — explore multiple ideas from the same starting point."

---

### [0:25–0:50] Core Features Demo

**[Begin screen interaction — mouse moving naturally]**

**Voiceover:**
> "Let me show you what this looks like in practice."

**[Type a message in the input — node appears, AI streams response into a new node]**

> "Send a message. The AI streams directly into the canvas."

**[Pause on the streaming animation — text appearing in node]**

> "Watch the response come in live."

**[Right-click / click branch button on a user node]**

> "Now — branch from here."

**[A second prompt appears, user types a different question]**

> "Ask the same question a different way..."

**[Two AI response nodes appear side by side]**

> "...and compare the responses. Side by side. Same context."

---

### [0:50–1:20] Spatial Navigation

**[Pan across the canvas with a smooth gesture]**

**Voiceover:**
> "Navigation is intuitive — pan with click-drag, zoom with scroll."

**[Zoom out to show full tree — multiple branches visible]**

> "Zoom out and see the shape of your entire conversation."

**[Click on a distant node — camera flies to it]**

> "Click any node to jump directly to it."

**[Show a deeply nested branch being focused]**

> "No matter how deep the tree goes, you're always one click from where you need to be."

---

### [1:20–1:45] Use Cases Montage

**[Quick cuts — each 4-5 seconds]**

**[Cut 1: Code review tree]**
**Voiceover:** "Code review — branch for each approach."

**[Cut 2: Research radial layout]**
**Voiceover:** "Research — radial branches from a central question."

**[Cut 3: Prompt engineering with system prompts]**
**Voiceover:** "Prompt engineering — compare system prompts at scale."

**[Cut 4: Thought/reasoning panel open on a node]**
**Voiceover:** "And with chain-of-thought models — see the reasoning behind every answer."

---

### [1:45–2:10] Installation — It's Simple

**[Screen: VSCode terminal]**

**Voiceover:**
> "Træk works with Svelte, React, and Vue."

**[Type: `npm install @traek/svelte`]**

> "Install the package..."

**[Switch to code editor — show the 10-line integration]**

```svelte
<script>
  import { TraekCanvas } from '@traek/svelte'
</script>

<TraekCanvas onSendMessage={handleMessage} />
```

> "...drop in the canvas component, connect your AI handler..."

**[Switch back to running app — canvas appears]**

> "...and you're running."

---

### [2:10–2:30] Call to Action

**[Slow zoom out on a beautiful, full canvas with many branches]**

**Voiceover:**
> "Træk is open source. MIT licensed. Built on Svelte 5."

**[Text overlay: github.com/traek-dev/traek]**

> "Star us on GitHub. Try it in your next AI project."

**[Fade to logo on dark background]**

> "Stop building chat boxes. Start building workspaces."

**[Logo hold: 3 seconds]**

---

## Post-Production Checklist

- [ ] Color-grade to match Træk brand palette (deep space background, accent colors)
- [ ] Add subtle zoom/pan animations between cuts (Screen Studio cinematic mode)
- [ ] Add text overlays for feature callouts (minimal, white on semi-transparent dark)
- [ ] Add background music (suggested: Epidemic Sound "Ambient Focus" category)
- [ ] Add captions for accessibility
- [ ] Export: H.264, 1080p, 8Mbps for web; ProRes for archival
- [ ] Upload to YouTube (unlisted first for review), Twitter/X, and embed on gettraek.com

## Distribution Plan

| Platform | Format | Timing |
|----------|--------|--------|
| YouTube | Full 3-min video | Launch day |
| X / Twitter | 60s cut | Launch day |
| LinkedIn | Full video with captions | Launch day |
| Product Hunt gallery | Full video | With PH launch |
| GitHub README | Embedded or linked | Pre-launch |
| gettraek.com hero | Autoplay muted loop (30s) | Pre-launch |

## Supplementary Videos (Phase 2)

1. **"Getting Started in 5 Minutes"** — Coding tutorial, screen-only, 5 min
2. **"Branching Deep Dive"** — Feature spotlight, 3 min
3. **"Custom Themes in 2 Minutes"** — CSS custom properties walkthrough
4. **"Træk + Claude / ChatGPT"** — Connecting popular AI APIs, 4 min
