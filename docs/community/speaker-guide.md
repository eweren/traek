# Træk Speaker Preparation Guide

> For anyone giving a Træk talk at a conference, meetup, or hackathon.
> Covers preparation timeline, talk structure principles, demo setup, and slide templates.

---

## Overview

This guide helps you:
1. Prepare a Træk talk that lands well
2. Set up a reliable live demo environment
3. Structure your slides for maximum clarity
4. Handle common Q&A scenarios
5. Represent the Træk brand accurately

For the full talk proposals (Beyond Linear Chat, Building Spatial AI UIs, Tree-Structured Thinking), see `docs/community/conference-talks.md`.

---

## Preparation Timeline

### 8 Weeks Before

- [ ] Submit talk abstract to conference (use proposals from `conference-talks.md` as starting point)
- [ ] Notify Træk team: `community@gettraek.com` — we want to know about accepted talks
- [ ] Confirm your talk format: keynote, regular session, lightning, workshop

### 4 Weeks Before

- [ ] Finalize which talk you're giving and customization for this audience
- [ ] Book a 30-min prep call with Træk team (email us — we offer this to all speakers)
- [ ] Start building your slide deck
- [ ] Run through the demo flow at least 3 times

### 2 Weeks Before

- [ ] Complete slides (use templates below)
- [ ] Record a practice run (phone propped up, just for yourself)
- [ ] Review recording: pacing, demo reliability, timing
- [ ] Prep your demo machine (see Demo Setup section)

### 1 Week Before

- [ ] Final slide review
- [ ] Send slides to Træk team for optional review (we can catch Træk-specific errors)
- [ ] Prepare backup: screenshots + screen recording of demo in case live demo fails
- [ ] Test slides on the actual display resolution you'll have at the venue

### Day Before

- [ ] Charge demo laptop
- [ ] Test Wi-Fi connection (or set up mobile hotspot as backup)
- [ ] Run full talk once, timing yourself
- [ ] Print/screenshot speaker notes if you rely on them

### Day Of

- [ ] Arrive 30 min before your slot
- [ ] Test projector connection + resolution
- [ ] Open demo app, log in if needed, set up all browser tabs
- [ ] Silence phone, disable notifications, turn off Slack/Messages
- [ ] Water on the podium

---

## Talk Structure Principles

### The arc that works for Træk

1. **Problem** (25% of time) — Make the audience feel the pain of linear chat before you show the solution.
2. **Demo** (15% of time) — Show, don't tell. Live demo or tight pre-recorded video.
3. **How** (50% of time) — Technical deep dive (for technical talks) or UX/design principles (for design talks).
4. **Invitation** (10% of time) — Clear CTA: try it, contribute, join Discord.

### Common mistakes to avoid

**Starting with "what is Træk"**
Don't. Start with the problem. "Raise your hand if you've had more than 10 AI chat tabs open at once." The problem earns the solution.

**Too much installation/setup in the demo**
Attendees don't want to watch `npm install`. Have everything installed ahead of time. The demo starts where interesting things happen.

**Skipping the invitation**
Every talk should end with a specific action for the audience to take. "Go to gettraek.com" or "star us on GitHub" or "join the Discord and say hi." Don't just end with "thank you."

**Over-explaining Svelte 5 runes**
For non-Svelte audiences, mention runes briefly and move on. Focus on what they enable (fine-grained reactivity), not how they work mechanically.

---

## Demo Setup

### Recommended Demo Machine

- Your own dev machine (fastest recovery if something goes wrong)
- Node.js v20+, pnpm installed
- A browser tab open to: Træk Playground (`app.gettraek.com`) — pre-logged-in
- A code editor open to a Træk starter project (use `packages/svelte` or a template)
- Disable sleep/screensaver for the session

### Demo Script (5-Minute Version)

Use this for any talk where you're demoing live. Rehearse this until it's automatic.

```
1. Open Træk Playground — already open in browser tab
2. Type a message: "Help me plan a machine learning project for fraud detection"
3. Wait for AI response (pre-warmed, should be fast)
4. Point out: "That's a node on a canvas. Let me zoom out."
   [Cmd+scroll to zoom out, showing the spatial layout]
5. Branch: "Now I want to explore a different direction without losing this one."
   [Right-click the user message → Branch]
6. Type: "Actually, let's focus on NLP instead of ML"
7. "Both conversations exist simultaneously. Neither was lost."
   [Zoom out further to show both branches]
8. "The tree structure means each branch has its own context — the AI sees its own parent chain, not the other branch."
9. Done. 5 minutes exactly.
```

### Backup Plan

If live demo fails (Wi-Fi, API key, app down):
1. Switch to pre-recorded screen recording (have it in a browser tab, ready to play)
2. Use screenshots: have 5-6 key screenshots as slide images
3. Acknowledge it calmly: "The demo gods have spoken. Let me show you screenshots."

Do not apologize extensively. Move on quickly.

---

## Slide Templates

### Slide Structure

Use this exact slide order as your starting skeleton:

```
1.  Title Slide
2.  Problem Setup (1–2 slides)
3.  The Moment of Recognition ("raise your hand" slide)
4.  Current Workarounds (what people do today — 1 slide)
5.  The Alternative (Træk intro — 1 slide)
6.  Demo (full screen, no slide border)
7.  [Technical talks:] Architecture Slide
8.  [Technical talks:] Code Slides (max 3)
9.  [Design talks:] Principles Slides (max 4)
10. What's Next / Roadmap (1 slide)
11. Invitation Slide
12. QR Code Slide
```

### Slide Design Guidelines

**Font sizes:**
- Title: 48px minimum
- Body text: 32px minimum
- Code: 28px minimum, light theme for readability on projectors

**Colors (use Træk brand):**
- Background: #0d1117 (dark) or white (light, better for projectors with washout)
- Primary text: #e6edf3
- Accent: #3fb950 (Træk green)
- Code highlight: #1f2937

**Image use:**
- Screenshots of the playground should have a subtle dark frame (8px border, #1f2937)
- Avoid stock photos
- Diagrams: simple, high contrast, labeled

**Code slides:**
- Show real Træk code, not simplified pseudocode
- Highlight the 1–3 lines you're talking about
- Narrate the code — don't assume attendees can read it at speed

---

## Key Messages (Memorize These)

These are the things you should be able to say naturally, without slides:

**The problem:**
> "Complex thinking is a tree. Chat is a list. That mismatch is not a UX detail — it's an architectural bug."

**What Træk does:**
> "Træk is an open-source library for building spatial, tree-structured AI conversation interfaces. Instead of a scrolling list, messages are nodes on a canvas. Conversations branch instead of scroll."

**Why it's different:**
> "Branching isn't just visual in Træk. Each branch walks its own parent chain to build AI context. The semantics are correct, not just the appearance."

**The invitation:**
> "It's MIT licensed. Start with `npm install @traek/svelte`. The docs are at gettraek.com/docs. Come find us in the Discord."

---

## Q&A Preparation

### Common Questions and Suggested Answers

**"Is this production-ready?"**
> "The core library is stable and MIT licensed. The Playground is in production at app.gettraek.com. Some advanced features — like the collab layer — are newer. Best for greenfield projects or teams willing to be early adopters."

**"What AI providers does it support?"**
> "The library is provider-agnostic. You bring your own API calls. We have examples in the docs for OpenAI, Anthropic, Groq, and others. You wire up streaming however you prefer."

**"Why Svelte 5 and not React?"**
> "We started with Svelte 5 because runes are a great fit for reactive canvas UIs. But the core engine is framework-agnostic — @traek/react and @traek/vue adapters are in progress. The Svelte version is the most complete today."

**"How does it handle large conversation trees?"**
> "Node lookups are O(1) using Maps. Viewport culling via IntersectionObserver limits rendering to visible nodes. In testing, 200+ node trees stay smooth. Very large trees will need layout algorithms — that's on the roadmap."

**"Can I self-host?"**
> "Yes. The library is open source. The hosted Playground is a separate product. You can run your own backend, your own AI provider, your own persistence layer."

**"What's the business model?"**
> "The library is MIT licensed and free forever. Træk Playground is the hosted product — there's a free tier and paid plans. Enterprise support is available."

---

## After Your Talk

1. Share slides publicly and link them in the Træk Discord `#events` channel
2. Post a photo + summary on social, tag @traek
3. Email any interesting questions or pushback to `community@gettraek.com` — we want to hear what audiences are asking
4. Consider writing a blog post recap (we'll publish it on the Træk blog if you want)

---

## Resources

| Resource | Link |
|----------|------|
| Talk proposals | `docs/community/conference-talks.md` |
| Træk docs | gettraek.com/docs |
| Playground | app.gettraek.com |
| GitHub | github.com/traek-ui/traek |
| Discord | discord.gg/traek |
| Brand assets | gettraek.com/brand |
| Speaker contact | community@gettraek.com |
