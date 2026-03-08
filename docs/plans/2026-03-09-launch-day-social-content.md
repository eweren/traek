# Traek Playground — Launch Day Social Content

**Date:** 2026-03-07 (prepared)
**Launch Day:** Monday 2026-03-09
**Task:** [TRK-43](/issues/TRK-43)
**Reference:** [GTM Plan](./2026-03-07-playground-launch-gtm.md)

All content is ready-to-post. Timing follows the GTM plan launch day schedule (all times EST).

---

## Schedule at a Glance

| Time (EST) | Platform | Action |
|------------|----------|--------|
| 12:01 AM | Product Hunt | Goes live |
| 7:00 AM | Hacker News | Show HN post |
| 8:00 AM | Twitter/X | Launch thread (pin immediately after posting) |
| 10:00 AM | Reddit | r/LocalLLaMA + r/ChatGPT posts |
| 12:00 PM | Discord | AI community messages |
| 3:00 PM | Dev.to | Cross-post launch blog |
| 5:00 PM | LinkedIn | Milestone post |

---

## 1. Hacker News — Show HN Post

**Title:**
```
Show HN: Traek Playground – spatial branching AI canvas (BYOK)
```

**Body:**
```
I built Traek because I kept losing my best ideas in chat scrollback.

The problem: when you're using AI for anything complex — research, writing,
planning — you need to explore multiple directions. But linear chat forces you
to pick one path and abandon the others. Every "actually, let's go back to
that first idea" is friction. Most of the time you just don't bother.

Traek Playground is a spatial canvas where conversations are nodes. You can:
- Branch from any message (not just the last one)
- Pan/zoom to see your entire thinking session at once
- Bring your own OpenAI or Anthropic key (BYOK — we don't proxy or store it)
- Share read-only links to your conversation trees

The core engine is @traek/svelte — open source on GitHub. The Playground is
the hosted layer on top: auth, cloud sync, sharing, and team features coming.

Free tier: 5 conversations, local storage only. No account needed for the demo.
Pro ($12/mo): Unlimited conversations, cloud sync, export, sharing.

Would love feedback on the UX — especially the branching interaction model.
Has anyone built spatial workflows with Miro or Notion for AI use cases?
That's the space we're exploring, and I'd love to hear what's worked or failed.

[app.gettraek.com]
```

**Notes:**
- Post at 7:00 AM EST on Monday (optimal HN window)
- Respond to every comment within the first 2 hours — HN rewards active authors
- If it gains traction (>10 points in first hour), engage in the thread heavily
- Backup title option: "Show HN: Traek – a canvas for branching AI conversations (open-source core)"

---

## 2. Twitter/X — Launch Thread

**Post at 8:00 AM EST. Pin immediately after the thread is complete.**

**Tweet 1 (hook):**
```
We just launched Traek Playground — a spatial AI canvas where conversations branch like your thinking.

Here's the problem we're solving, and why we built it this way 🧵
```

**Tweet 2 (problem):**
```
Every time you use AI for something complex, you hit a wall.

You asked a great follow-up 3 messages ago. You scrolled past it. That branch is gone.

That's not a conversation. That's a log.

Linear chat was designed for customer support tickets. Not for thinking.
```

**Tweet 3 (solution + demo):**
```
Traek lets you branch from any message, any time.

Both paths stay alive. Zoom out and see your entire session on one canvas.

[GIF: branching demo — record from app.gettraek.com before launch]
```

**Tweet 4 (BYOK trust angle):**
```
It's BYOK — bring your own OpenAI or Anthropic key.

We don't proxy your requests. We don't store your messages.
Your API key never leaves your browser session.

Privacy-first, by design.
```

**Tweet 5 (CTA):**
```
Free to start. No account needed for the demo.

Pro ($12/mo) unlocks unlimited conversations, cloud sync, and sharing.

Try it → app.gettraek.com

Built on @traek/svelte — open source. Core engine is auditable.
```

**Notes:**
- Record the branching GIF before Monday — ideally a 5–10 second loop showing a branch being created and the canvas zooming out
- Use the thread format (reply to tweet 1) rather than a long single post
- Schedule tweets 2–5 to go out 2–3 minutes apart for feed algorithm boost
- Add 1-2 relevant hashtags to tweet 5 only: #AI #BuildInPublic

---

## 3. Reddit Posts

### r/LocalLLaMA

**Title:**
```
I built a spatial branching canvas for LLM conversations (BYOK, open source core)
```

**Body:**
```
Hey r/LocalLLaMA — long-time lurker, first time posting my own project here.

**The problem I was trying to solve:**

I use LLMs constantly for research and reasoning, and I kept running into the
same frustration: linear chat forces you to pick one direction. If you want to
explore a hypothesis, follow a tangent, or compare two approaches — you're
either doing it in separate windows or losing one thread.

**What I built:**

Traek Playground — a spatial canvas where LLM conversations are nodes on a
pannable/zoomable board. You can branch from *any* message, not just the last
one. Both branches stay alive. You can zoom out and see your whole session.

BYOK — you bring your OpenAI or Anthropic key. Nothing is proxied. Your key
stays in your browser session only.

The core engine (@traek/svelte) is open source. The Playground is the hosted
layer with auth and sync.

**What it's good for:**
- Exploring competing hypotheses with an LLM
- Research sessions where you need to follow multiple threads
- Prompt engineering experiments (branch to compare prompt variants)
- Any workflow where you've wanted to "fork" a conversation

**Free tier:** 5 conversations, local storage only. No account needed to try
the demo: app.gettraek.com

Happy to answer questions about the architecture or the BYOK implementation.
What spatial/branching workflows have you tried for LLM work?
```

**Notes:**
- r/LocalLLaMA skews technical. Lead with the problem and BYOK privacy angle.
- Don't post simultaneously with r/ChatGPT — space them 30–60 min apart.
- Respond to every comment on launch day.

---

### r/ChatGPT

**Title:**
```
Built a way to branch ChatGPT conversations — instead of picking one path, keep them all alive on a canvas
```

**Body:**
```
If you've ever been mid-conversation with ChatGPT and thought "I want to explore
that first idea *and* follow this new direction" — this was built for you.

**Traek Playground** is a spatial canvas for AI conversations. Instead of a
linear thread, conversations are nodes on a board you can pan and zoom.
Branch from any message. Both branches keep going independently.

You bring your own API key (OpenAI or Anthropic) — BYOK means your
conversations are completely private. Nothing is stored on our servers.

**Use cases I've found it useful for:**
- Brainstorming sessions — explore 3–4 angles without losing any of them
- Research — follow a tangent without abandoning the main thread
- Writing — compare two directions for a story/argument side by side
- Decision-making — literally map out a pros/cons conversation tree

**Free:** 5 conversations, no account needed
**Pro ($12/mo):** unlimited, cloud sync, sharing

Demo: app.gettraek.com

What are your most frustrating "I wish I could branch here" moments in ChatGPT?
```

**Notes:**
- r/ChatGPT is less technical, more use-case focused. Lead with the relatable problem.
- Avoid sounding like an ad — the question at the end invites genuine discussion.
- Post ~30 min after the r/LocalLLaMA post.

---

### r/sveltejs

**Title:**
```
Show r/sveltejs: I built a spatial AI canvas app with Svelte 5 — here's what I learned
```

**Body:**
```
Hey Svelte community! I've been building Traek Playground — a hosted spatial AI
canvas — and wanted to share some learnings from the Svelte 5 side.

**What it is:**
A pannable/zoomable canvas where AI conversations are nodes. Built entirely
with Svelte 5 runes. The core library (@traek/svelte) is open source.

**Interesting Svelte 5 patterns I ended up using:**

1. **TraekEngine as a runes class** — All canvas state (nodes, positions, parent-child
   relationships) lives in a `$state`-driven class. O(1) map lookups throughout.
   Reactive derived state computes visible nodes, connection lines, and layout
   positions automatically.

2. **ResizeObserver + runes** — Each node uses a ResizeObserver to report its
   rendered height back to the engine. This feeds into auto-layout. Connecting
   external DOM events to runes state without memory leaks was an interesting
   challenge.

3. **Viewport intersection for performance** — With 100+ nodes on a canvas,
   rendering all of them tanks performance. Used IntersectionObserver to skip
   rendering off-viewport nodes, driven by a `$derived` visibility map.

4. **Streaming with runes** — SSE streaming from OpenAI/Anthropic updates node
   content character by character. The streaming state lives in the engine and
   flows down to `TextNode` via reactive props. Surprisingly clean with runes.

The Svelte 5 runes model turned out to be a great fit for this kind of
state-heavy, performance-sensitive canvas UI.

Demo (launched today): app.gettraek.com
GitHub (library): github.com/gettraek/traek

Happy to go deeper on any of these patterns if there's interest.
```

**Notes:**
- r/sveltejs wants technical depth. Lead with the architecture.
- This post builds developer credibility and library awareness, not direct signups.
- Post this last of the Reddit posts, around noon or early afternoon.

---

## 4. Discord / Slack Community Messages

**General rules:**
- Never post the same message in multiple servers simultaneously
- Lead with value, not promotion — one sentence of context, then the project
- Engage in ongoing conversations before dropping a link
- No @everyone or mass pings

### AI/ML Discord Servers (EleutherAI, Anthropic community, etc.)

**Channel:** #projects or #showcase (check rules first)

**Message:**
```
Hey all — shipped something today that might be relevant here.

I've been frustrated that LLM conversations force you into a single thread.
Built Traek Playground: a spatial canvas where you can branch from any message,
keep all branches alive, and pan/zoom to see the whole session.

BYOK (OpenAI/Anthropic) — nothing is proxied. Free tier, no account needed.

app.gettraek.com — would genuinely love feedback from people who push LLMs
hard for research/reasoning.
```

### PromptEngineering / AI Power User Servers

**Channel:** #tools or #resources

**Message:**
```
Launched a tool today that might fit the prompt engineering workflow:

Traek Playground — branch any conversation, keep all branches alive on a
spatial canvas. Good for comparing prompt variants side by side, or exploring
a reasoning chain without losing your place.

BYOK, free tier available: app.gettraek.com

Anyone here been using spatial tools (Miro, Notion, etc.) for prompt workflows?
Curious what patterns you've found.
```

### Developer / Svelte Discord Servers

**Channel:** #showcase or #built-with-svelte

**Message:**
```
Built with Svelte 5: Traek Playground — a spatial AI canvas for branching
conversations.

The core library (@traek/svelte) is open source. Today we launched the hosted
Playground layer. Spatial canvas with pan/zoom, branching from any node,
ResizeObserver-driven auto-layout, SSE streaming.

app.gettraek.com (demo, no account needed)
github.com/gettraek/traek (library)

Happy to talk through the Svelte 5 runes architecture if anyone's curious.
```

---

## 5. LinkedIn Post

**Post at 5:00 PM EST.**

```
We launched Traek Playground today.

It's a spatial AI canvas — conversations branch like your thinking, not in a
linear thread.

The insight behind it: the AI interface problem isn't model quality. It's the
conversation structure. Every serious use of AI — research, strategy, writing,
planning — requires exploring multiple directions simultaneously. Linear chat
forces you to pick one.

Traek lets you branch from any message. Both paths stay alive. Zoom out and
see your entire session on one canvas.

Three things we care about:

1. Privacy by default — BYOK means your key and messages never touch our
   servers. Your API key lives in your browser session only.

2. Free to start — 5 conversations free, no credit card, no account needed
   for the demo.

3. Open source core — @traek/svelte is the engine. The Playground is the
   hosted layer. Auditable by design.

If you're building with AI or managing teams that use AI for complex knowledge
work — this is worth 5 minutes to try.

app.gettraek.com

Would love to hear: what's the most complex AI conversation workflow you've
tried to manage? Where does linear chat break down for you?

#AI #ProductLaunch #ArtificialIntelligence #BuildInPublic #SpatialComputing
```

**Notes:**
- LinkedIn audience is product builders, PMs, founders. Emphasize the knowledge work angle.
- The question at the end drives comments, which boosts reach in LinkedIn's algorithm.
- 5 hashtags max — LinkedIn penalizes hashtag spam.
- Tag any investors, advisors, or notable beta users (with their permission) to amplify.

---

## Pre-Launch Checklist

Before posting anything on launch day:

- [ ] app.gettraek.com is live and accepts signups
- [ ] Free tier (5 conversations) is working without an account
- [ ] BYOK flow tested with both OpenAI and Anthropic keys
- [ ] Branching GIF recorded and ready for Twitter thread
- [ ] Product Hunt listing is live (12:01 AM)
- [ ] Email welcome sequence is active for new signups
- [ ] Team is monitoring all channels for first-hour responses

---

## Response Templates

### For "what's the pricing?" questions:
```
Free tier: 5 conversations, local storage only — no account needed.
Pro is $12/month: unlimited conversations, cloud sync, export, and sharing.
```

### For "is this open source?" questions:
```
The core engine (@traek/svelte) is open source on GitHub.
The Playground (hosted layer with auth, sync, teams) is commercial.
```

### For "how does BYOK work?" questions:
```
You enter your OpenAI or Anthropic API key in the app. It's stored only in
your browser session — never sent to our servers. All API calls go directly
from your browser to OpenAI/Anthropic. We never see your key or your messages.
```

### For critical/skeptical comments (HN, Reddit):
```
Fair question — [acknowledge the concern specifically]. Here's how we
approached it: [specific technical answer]. Happy to go deeper if helpful.
```
