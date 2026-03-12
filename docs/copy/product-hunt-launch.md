# Traek Playground — Product Hunt Launch

**Date:** 2026-03-08
**Task:** [TRK-50](/issues/TRK-50)
**Launch Day:** Monday 2026-03-10 (12:01 AM EST)

---

## Product Hunt Listing

### Name
```
Traek Playground
```

### Tagline
```
The spatial AI canvas. Branch your thinking, not just your prompts.
```

*Backup taglines (A/B options):*
- `AI conversations that branch like your ideas`
- `Stop scrolling. Start branching. Spatial AI canvas with BYOK.`

### Thumbnail / Gallery Images

Order of images for the gallery:

1. **Hero screenshot** — Full canvas view showing a branched conversation tree (3-4 nodes, 2 branches visible), dark theme
2. **Branching demo GIF** — 5-10 second loop: cursor hovers a message -> branch button appears -> new branch spawns -> canvas zooms out to show both paths
3. **BYOK flow screenshot** — The API key settings panel, emphasizing "key stays in your browser"
4. **Sharing screenshot** — A read-only shared conversation tree link preview
5. **Open source badge** — @traek/svelte on GitHub, star count, MIT license badge

*All images: 1270x760px, crisp 2x resolution. Dark theme preferred for hero.*

---

### Product Description (Full)

```
Traek Playground is a spatial AI canvas for conversations that branch.

Instead of a linear thread you scroll through, Traek puts your conversation
on a pannable, zoomable canvas. Every message is a node. Branch from any node
at any time — both paths stay alive and explorable.

Why we built it

Linear chat was designed for customer support. Not for research, writing,
planning, or any complex thinking where you need to explore multiple directions
simultaneously. The "actually, let me go back to that idea" moment happens
constantly — and in linear chat, it's always friction.

Traek gives every thread the space it deserves.

Key features

Branch from any message — Not just the last one. Mid-conversation pivots
are a feature, not an accident.

Spatial canvas — Pan and zoom to see your entire session. Your thinking, mapped.

BYOK — Bring Your Own Key — Enter your OpenAI or Anthropic API key. It
lives in your browser session only. We never proxy or store it.

Sharable conversation trees — Share read-only links to your branching
session. Show your reasoning, not just your conclusion.

Open-source core — @traek/svelte is the engine under the hood. Auditable,
extensible, MIT-licensed.

Pricing

Free: 5 conversations, no account required, local storage only
Pro ($12/mo): Unlimited conversations, cloud sync, export, sharing

Who it's for

Researchers who explore competing hypotheses with AI. Writers comparing two
directions for a draft. Prompt engineers running controlled variants. Product
managers mapping decision trees with AI assistance. Anyone who has ever wished
they could fork a conversation.

We'd love your feedback — especially on the branching UX. This is day one of v1.0.
```

---

### Maker Comment (Post at 12:01 AM — pins to top)

```
Hey Product Hunt!

I'm Nico, maker of Traek.

Why we built this:

I use AI constantly for research and planning — and the friction point is always
the same. I want to explore multiple directions, but linear chat forces me to
pick one and abandon the others. Every "wait, let's go back to that first idea"
is friction. Eventually you just don't bother.

Traek Playground is the spatial canvas I always wanted. Branch from any message.
Both branches keep going. Zoom out to see the whole session.

What makes it different:

1. BYOK is a core principle, not a feature flag. Your API key never touches
   our servers. All calls go directly from your browser to OpenAI/Anthropic.
   This wasn't a performance decision — it was an ethics decision.

2. The core is open source. @traek/svelte is the engine. You can audit it,
   fork it, and build your own spatial canvas. The Playground is the hosted
   layer on top — auth, sync, sharing.

3. Free tier with no account. 5 conversations, local storage only. Try the
   demo before you commit to anything.

What I'd love feedback on:

- The branching interaction model — is the UX intuitive for first-timers?
- Use cases we haven't thought of
- Pricing gut-check: does $12/mo for Pro feel right?

Happy to answer any technical questions about the architecture, BYOK
implementation, or how we built the spatial canvas in Svelte 5.

Try it: app.gettraek.com
```

---

### Hunter Outreach

*Find a hunter with 1,000+ followers — developer-focused, builds in public, active in AI/dev tools.*

Outreach message template:
```
Hey [Name] — launching Traek Playground on PH next Monday and think it'd
resonate with your audience. Spatial AI canvas with branching conversations,
BYOK, open-source core. Would love you to hunt it.

Demo: app.gettraek.com

Interested?
```

---

### Launch Day PH Checklist

- [ ] Listing submitted and approved (submit 1 week before)
- [ ] All 5 gallery slots filled with images/GIF
- [ ] Maker comment drafted and ready to post at 12:01 AM
- [ ] Hunter confirmed and briefed
- [ ] Personal network primed: ask if they "found it useful" (not "upvote" — PH ToS)
- [ ] Monitor PH comments; respond within 30 min throughout the day
- [ ] Coordinate with HN Show post (7 AM) and Twitter thread (8 AM) per TRK-43
