# Introducing Traek Playground v1.0

**Date:** 2026-03-10
**Author:** Nico (Traek)
**Channel:** Blog (gettraek.com/blog), Dev.to cross-post, Product Hunt description
**Task:** [TRK-50](/issues/TRK-50)

---

# Introducing Traek Playground: The Spatial AI Canvas

Today we're launching Traek Playground v1.0 — a hosted AI canvas where conversations branch like your thinking.

If you've ever been mid-conversation with an AI and thought "I want to explore that first idea *and* follow this new direction" — this was built for you.

---

## The Problem with Linear Chat

Every serious use of AI runs into the same wall.

You're researching a topic. The AI gives you three interesting directions. You follow one. Forty messages later, you realize you want to go back to direction two — but you can't. That thread is buried in scrollback. You'd have to start over, re-explain the context, and hope you remember what made direction two interesting.

Or you're writing. You ask the AI to draft an intro paragraph two ways. You pick one, but by message fifteen, you've lost the other draft entirely. Linear chat has no concept of "save this branch for later."

This isn't a model quality problem. GPT-4o and Claude are remarkable. The problem is the interface. Linear chat was designed for customer support tickets in the 2010s. The assumption was that conversations are sequential: you say something, I respond, we move forward together.

Complex thinking doesn't work that way. It branches.

---

## What Traek Does Differently

Traek Playground puts your AI conversation on a pannable, zoomable canvas.

Every message is a node. Every response is a node. And crucially: **you can branch from any node, at any time.**

When you branch, both paths stay alive. You can zoom out and see your entire thinking session — every hypothesis explored, every direction taken, every thread that's still worth following.

Here's what that looks like in practice:

- **Researching a startup idea**: Branch at the market sizing question to explore two different customer segments simultaneously. Keep both alive without choosing.
- **Writing**: Draft three opening paragraphs by branching from the same context node. Compare them side by side. Pick the best — or keep exploring.
- **Prompt engineering**: Branch to compare how different prompt variants perform on the same input. See the results spatially.
- **Planning**: Map out a decision tree with AI assistance. Every branch is a real path you can explore, not a hypothetical you have to re-create.

---

## BYOK: Privacy by Design

Traek is BYOK — Bring Your Own Key.

You enter your OpenAI or Anthropic API key in the app. It lives in your browser session only. When you send a message, your browser talks directly to the AI provider. Our servers are never in that path.

We don't proxy your requests. We don't see your API key. We don't store your messages.

This wasn't a performance optimization. It was an ethical decision: your conversations are yours, and your API key should stay yours too.

---

## The Open-Source Core

Traek Playground is built on `@traek/svelte` — our open-source spatial conversation engine.

The library handles the hard parts: the pannable/zoomable canvas, the tree data structure, O(1) node lookups, ResizeObserver-driven auto-layout, viewport intersection for performance, and streaming support. It's Svelte 5-native, using runes throughout.

The Playground is the hosted layer on top: authentication, cloud sync, sharing, and teams (coming soon).

If you want to build your own spatial AI interface, `@traek/svelte` is the starting point. MIT licensed. [github.com/gettraek/traek](https://github.com/gettraek/traek).

---

## Pricing

**Free** — 5 conversations, local storage only, no account required. Try the demo without signing up.

**Pro ($12/month)** — Unlimited conversations, cloud sync, export, sharable read-only links.

**Teams** — Coming in Q2. Shared canvases, real-time collaboration, admin controls.

We kept the free tier genuinely useful. Five conversations is enough to understand if the spatial canvas fits your workflow. We'd rather earn your $12/month than lock you in with a credit card before you've formed an opinion.

---

## What's Next

v1.0 is the foundation. Here's what's on the roadmap:

**Near-term (v1.1 - v1.2):**
- Image and file node support (drop a PDF into the canvas)
- Keyboard shortcuts for power users
- Conversation export (Markdown, JSON)
- Mobile-friendly touch interactions

**Medium-term (v1.x):**
- Teams and real-time collaboration
- Marketplace: community-built node types and templates
- MCP integration for connecting Traek to your local tools

**Long-term:**
- Self-hostable Playground (enterprise)
- API for embedding spatial AI interfaces in your own apps

---

## Try It

[app.gettraek.com](https://app.gettraek.com)

No account required for the demo. Free tier, no credit card.

We'd love to hear what you build with it — and more importantly, where it breaks. This is v1.0. There will be rough edges. If you hit one, [open an issue on GitHub](https://github.com/gettraek/traek/issues) or find us in the Product Hunt comments.

Thank you for being here on day one.

— Nico and the Traek team
