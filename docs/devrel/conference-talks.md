# Træk Conference Talk Outlines

**Two talk proposals for developer conferences in 2026**

---

## Talk 1: "Beyond Linear Chat: Designing Spatial AI Interfaces"

**Format:** 30-minute talk + 5-minute Q&A
**Target conferences:** JSConf, AI Engineer World's Fair, Web Summit Dev Track, ReactSummit, VueConf
**Speaker profile:** CMO / Developer Relations at Træk

### Abstract (250 words, for CFP submission)

> We've been building chat interfaces for AI the same way we built it in 2010 — a text box at the bottom, a scroll view above it. But as AI grows more powerful and conversations grow more complex, this linear model is failing us. We lose context. We can't explore multiple ideas simultaneously. We can't see the shape of our thinking.
>
> In this talk, I'll walk through the principles behind spatial AI interfaces: what they are, why they work cognitively, and how to build them. You'll see live demos of Træk — an open-source Svelte 5 library that turns your AI conversations into a pannable, zoomable canvas of interconnected nodes. We'll branch conversations, explore multiple prompt paths simultaneously, and compare AI responses side-by-side.
>
> By the end, you'll understand:
> - The cognitive science behind spatial thinking for complex tasks
> - The architecture of a canvas-based conversation engine
> - How to integrate spatial AI UI into your existing app in under 30 minutes
> - Real use cases: prompt engineering, code review, research, brainstorming
>
> Whether you're building with OpenAI, Anthropic, or local models, the principles are the same. This is about making AI UX worthy of AI capability.

### Talk Structure

**0:00–3:00 — Hook: The Scroll of Shame**
- Open with a live demo of a long, tangled linear chat
- "I know the answer is in here somewhere..."
- Contrast: open Træk canvas with the same conversation — instantly navigable
- Thesis: "We need spatial interfaces for spatial thinking"

**3:00–8:00 — Why Linear Chat Is a Design Mistake**
- Brief history: chat UIs copied SMS/messaging, not knowledge tools
- Cognitive load of scrolling vs. spatial navigation
- Research: how experts (doctors, engineers, researchers) actually take notes — not linearly
- The branching problem: "What if I'd asked that differently?"

**8:00–15:00 — The Architecture of Spatial Conversations**
- Nodes, not messages
- Parent-child relationships (the tree structure)
- Canvas coordinate system: viewport vs. world space
- Live code: TraekEngine — addNode(), branchFrom(), focusOnNode()
- Real-time streaming into the canvas

**15:00–22:00 — Live Demo: Real-World Use Cases**
- *Prompt Engineering Studio:* Branch from the same context, compare 3 different system prompts
- *Research Mode:* Radial layout — central question, 5 research threads
- *Code Review:* Tree of "what if we refactored this differently?"
- Show MCP tool call visualization

**22:00–28:00 — Getting Started**
- `npm install @traek/svelte` (or react/vue)
- 10-line integration
- The component map for custom node types
- CSS custom properties for branding

**28:00–30:00 — The Future of AI UX**
- AI interfaces will become workspaces, not chat boxes
- Call to action: contribute, star, experiment
- "The best interface for AI isn't a chat window — it's a canvas"

### Speaker Notes

- Bring a pre-loaded demo with an interesting branched conversation
- Have a fallback static screenshot if live streaming fails
- Mention framework adapters to reach React/Vue audience

---

## Talk 2: "Svelte 5 Runes in the Wild: Building a Real-Time Canvas Library"

**Format:** 45-minute technical deep-dive
**Target conferences:** Svelte Summit, ViteConf, Nordic.js, dotJS, HalfStack
**Speaker profile:** Core team / Engineering at Træk (can be delivered by any eng)

### Abstract (250 words, for CFP submission)

> Svelte 5's runes system promises fine-grained reactivity and cleaner state management — but how does it hold up when you're building something genuinely complex? Træk is a production canvas library with real-time AI streaming, spatial layout, O(1) state lookups, and a component map system. We built it entirely on Svelte 5 runes.
>
> In this talk, I'll share what we learned shipping a library with $state, $derived, and $effect in production. What worked brilliantly. What surprised us. Where runes changed our entire architecture.
>
> You'll see:
> - How we replaced class-based state management with runes-native patterns
> - Why we chose TraekEngine as a `$state` class instead of a store
> - The `$derived` chains that power our canvas layout system
> - How we handle streaming (async, reactive, cancellable) without a mess
> - The testing challenge: why jsdom + Svelte 5 runes don't mix, and our solution (logic-extraction testing)
> - Performance: ResizeObserver + viewport intersection in a runes world
>
> If you're building anything more complex than a todo app with Svelte 5, this talk will save you months of mistakes.

### Talk Structure

**0:00–5:00 — What We Built and Why**
- Træk: canvas-based AI conversation library
- Why we chose Svelte 5 (performance, DX, runes)
- The scale: real-time streaming, tree structure, spatial layout, 100+ nodes

**5:00–15:00 — TraekEngine: State as a Class**
- Old pattern: Svelte stores + derived stores
- New pattern: `$state` class — TraekEngine
- Benefits: encapsulation, O(1) Maps instead of reactive arrays
- Code walkthrough: `$state` fields, methods that mutate them
- The gotcha: runes in `.svelte.ts` files (not just `.svelte`)

**15:00–25:00 — $derived Chains for Canvas Layout**
- How layout is computed from tree structure
- `$derived` vs. `$derived.by()` — when to use each
- The danger of expensive derivations on every tick
- Memoization patterns with $derived
- Live demo: watch the canvas re-layout as nodes move

**25:00–35:00 — Streaming AI Responses with Runes**
- The streaming challenge: partial content, cancellation, error states
- Node status: streaming → done → error
- `$effect` for side effects (ResizeObserver, streaming subscriptions)
- Cleanup: the return-from-$effect pattern
- The async streaming pattern we settled on

**35:00–40:00 — Testing: The Hard Truth**
- jsdom doesn't support Svelte 5 runes component rendering
- Our solution: logic-extraction testing
- Test pure functions and state classes in isolation
- What we gave up, what we gained
- The Vitest setup: 3 test projects (client, server, storybook)

**40:00–45:00 — Lessons for Library Authors**
- Export `.svelte.ts` state classes, not just components
- CSS custom properties for theming (--traek-* pattern)
- The component map pattern for extensibility
- Q&A

### Demo Materials

- Live editor showing runes reactivity
- Before/after: store-based vs. runes-based TraekEngine
- The streaming node animation

---

## Conference Target List

See `conference-calendar.md` for full details with deadlines.

### Primary Targets (Tier 1)
- AI Engineer World's Fair (San Francisco)
- Svelte Summit
- ViteConf

### Secondary Targets (Tier 2)
- JSConf EU
- ReactSummit
- Nordic.js
- HalfStack (London/Vienna)

### Community Events (Tier 3)
- Local meetups: SvelteJS meetups, AI developer meetups
- Online: Svelte Radio podcast, Syntax FM guest slot
