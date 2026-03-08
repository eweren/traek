# Træk Conference Talk Proposals

> Three fully developed talk proposals for the 2026 conference season.
> See `docs/community/events-strategy.md` for submission calendar and conference targets.

---

## Talk 1: Beyond Linear Chat

**Subtitle:** Why the scrolling message list is the wrong interface for complex AI workflows — and what to build instead

**Duration:** 30 minutes + Q&A
**Target:** AI Engineer World's Fair, GOTO, JSConf, An Event Apart
**Tone:** Problem-first, practical, broad audience
**Framework:** Framework-agnostic examples (TypeScript)

---

### Abstract (public-facing, ~150 words)

Every AI product ships the same UI: a scrolling list of messages. It was fine for simple Q&A. For complex workflows — debugging, research, brainstorming, multi-step planning — it actively breaks down.

The problem is structural. Human thinking branches. Chat doesn't. When you need to explore two hypotheses simultaneously, linear chat forces you to pick one, lose the other, or start a new chat that has no memory of the first.

This talk examines what a better interface looks like: spatial, tree-structured conversations where every message is a node on a zoomable canvas, branches are first-class citizens, and multiple threads stay alive simultaneously. We'll look at the data model (a node tree vs. a flat array), the rendering challenges (pan/zoom canvas at 100+ nodes), and the UX patterns that make branching feel natural rather than complicated.

No framework prerequisites. Principles apply wherever you build UIs.

---

### Detailed Outline

**[0–5 min] The shape of thinking**

- Complex reasoning is a tree. Chat is a list. That mismatch is not a UX detail — it's an architectural bug.
- Live examples: What researchers, engineers, and power users actually do around this limitation.
  - The "14 tabs" pattern (new chat for every branch)
  - The mega-context prompt (trying to cram branching into a single thread)
  - The external notes bridge (context that should be in the AI interface lives in Notion)
- The question this talk answers: What does a UI designed for tree-shaped thinking actually look like?

**[5–12 min] The data model**

- Nodes, not messages: `{ id, parentId, role, content, status, x, y }`
- Why parent-child relationships matter: each branch walks its own ancestor chain to build AI context — semantic correctness, not just visual branching.
- O(1) node lookups with Maps: why flat arrays break down at scale.
- Live demo: Træk Playground — 5-minute walk through spatial canvas in action.

**[12–20 min] Rendering the canvas**

- Pan/zoom with CSS transform matrix: why not SVG, why not WebGL, why CSS wins here.
- Viewport culling: IntersectionObserver to only render visible nodes.
- Auto-height: ResizeObserver per node (you don't know content height until it's rendered).
- Streaming content: updating a single node without re-rendering siblings.
- Connection lines: how SVG overlays work with canvas-space coordinates.

**[20–27 min] Branching UX patterns**

- What triggers a branch? Right-click menu, keyboard shortcut, or auto-branch on conflict.
- Visual affordances: how to make tree structure legible at a glance.
- Focus mode: collapsing the canvas to a single branch path for deep work.
- Keyboard navigation: spatial UIs need excellent keyboard support or they fail accessibility.
- The "reconverge" pattern: merging two branches back into a synthesis node.

**[27–30 min] State of the ecosystem + invitation**

- Træk is open source. MIT. Built in Svelte 5, with React/Vue adapters.
- The frontier: multi-agent conversations (each agent is a sub-tree), voice nodes, embedded documents.
- The invitation: if you're building AI tools, the UI is your next moat. Come try Træk.

---

### Speaker Notes

- Keep the demo tight: 3 interactions in the playground, not a full tour.
- The "14 tabs" moment usually gets the loudest recognition from the audience — spend a beat there.
- Framework-agnostic framing is intentional for this venue. Don't open with "this is a Svelte library."
- Have a QR code slide at the end pointing to gettraek.com/playground.

---

## Talk 2: Building Spatial AI UIs

**Subtitle:** A technical deep-dive into canvas rendering, streaming state, and real-time collaboration for AI conversation interfaces

**Duration:** 35 minutes + Q&A (or 20 min compressed for lightning slot)
**Target:** Svelte Summit, ViteConf, React Summit (React adapter version)
**Tone:** Technical, code-forward, hands-on
**Framework:** Svelte 5 (primary); notes for React adaptation included

---

### Abstract (public-facing, ~150 words)

Building a canvas-based AI conversation UI exposes every performance assumption you have. Streaming content, 100+ nodes updating concurrently, real-time collab cursors, and a pan/zoom viewport — all at once.

This talk is a technical post-mortem on building Træk, an open-source Svelte 5 library for spatial AI UIs. We cover: the reactive node tree (why $state on Maps is not a footgun), the streaming pattern (updating a single node without re-rendering subtrees), the canvas rendering pipeline (CSS transform matrix, ResizeObserver, IntersectionObserver), and the CRDT collab layer (Yjs + Svelte 5's $effect lifecycle).

You'll leave with concrete patterns for streaming AI content into reactive UIs, approaches for high-performance canvas rendering without WebGL, and a working mental model for integrating CRDTs with Svelte 5 reactivity.

Code shown is real Træk code, not simplified toy examples.

---

### Detailed Outline

**[0–4 min] Context + demo**

- What we're building and why: spatial AI conversation canvas.
- 90-second live demo: branch a conversation, zoom out, watch streaming.

**[4–10 min] The reactive node tree**

```typescript
// TraekEngine — core state
class TraekEngine {
  nodeMap = $state(new Map<string, MessageNode>())
  connectionMap = $state(new Map<string, Connection>())

  addNode(content: string, role: Role, opts: NodeOpts): MessageNode {
    const node = createNode(content, role, opts)
    this.nodeMap.set(node.id, node)
    this.connectionMap.set(`${opts.parentId}-${node.id}`, { from: opts.parentId, to: node.id })
    return node
  }
}
```

- Why Maps: O(1) lookup matters when you have 200 nodes and 60fps scroll.
- Svelte 5 `$state` on Maps: fine-grained reactivity means only the affected node's subtree re-renders.
- `$derived` for computed views: visible nodes, subtree paths, connection lines.
- The immutability trap: `.set()` on a $state Map triggers reactivity; direct property mutation on the map value does not.

**[10–17 min] Streaming content**

The streaming pattern — the exact code we use:

```typescript
// Server-sent events → node updates
const node = engine.addNode('', 'assistant', { parentId: userNode.id, status: 'streaming' })

for await (const chunk of stream) {
  accumulated += chunk
  engine.updateNode(node.id, { content: accumulated })
}

engine.updateNode(node.id, { status: 'done' })
```

- Why this works without flooding re-renders: $state on Maps is reactive at the Map level, not property level. We swap the whole node object.
- The cursor blink: faking a blinking cursor with a CSS animation on the streaming node.
- Error state: timeout detection, partial content preservation, retry from last checkpoint.

**[17–23 min] Canvas rendering**

```css
.canvas-inner {
  transform: translate(var(--pan-x), var(--pan-y)) scale(var(--zoom));
  transform-origin: 0 0;
  will-change: transform;
}
```

- CSS transform matrix beats SVG/WebGL for text-heavy content (native font rendering, copy/paste, accessibility).
- ResizeObserver per node: we don't know heights ahead of time.
- IntersectionObserver for viewport culling: nodes outside the viewport are rendered but not `display: block` — layout preserved, rendering cost reduced.
- Connection lines: absolute-positioned SVG overlay in canvas space, recomputed on node position change.
- Touch support: pinch-to-zoom with pointer events and the average midpoint pattern.

**[23–30 min] Collab with Yjs + Svelte 5**

```typescript
export function useCollab(engine: TraekEngine, config: CollabConfig): CollabHandle {
  const provider = $state(new CollabProvider(engine, config))
  let status = $state<CollabStatus>('connecting')
  let peers = $state(new Map<string, Peer>())

  $effect(() => {
    const unsubStatus = provider.onStatusChange(s => { status = s })
    const unsubPresence = provider.onPresenceChange(p => { peers = new Map(p) })
    return () => { unsubStatus(); unsubPresence(); provider.destroy() }
  })

  return {
    get provider() { return provider },
    get status() { return status },
    get peers() { return peers }
  }
}
```

- The Svelte 5 constraint: `$effect` must be created at component init time, not in event handlers or async callbacks.
- Yjs Y.Map for node sync: conflict resolution is automatic; last-write-wins for content, CRDT for structure.
- Awareness protocol for cursors: canvas-space to screen-space conversion using scale + offset.
- The conditional mounting pattern: WebSocket provider only connects when user opts into collab mode.

**[30–35 min] What we learned + open questions**

- Svelte 5 runes are a natural fit for data-heavy canvas UIs: fine-grained reactivity, minimal boilerplate, clean lifecycle.
- The framework-agnostic future: @traek/core is portable; @traek/svelte is the first adapter.
- Open questions: physics-based layout algorithms, node grouping, agent-to-agent collab sub-trees.

---

### React Adaptation Notes

For React Summit version, replace Svelte 5 patterns with:
- `$state` → `useState` / `useReducer`
- `$derived` → `useMemo`
- `$effect` → `useEffect`
- The collab hook becomes a custom `useCollab()` React hook with identical structure

The canvas rendering and Yjs sections require no adaptation.

---

## Talk 3: Tree-Structured Thinking

**Subtitle:** The cognitive science of branching thought — and why AI tools should be designed around it, not against it

**Duration:** 25 minutes (keynote-friendly format)
**Target:** An Event Apart, GOTO, non-technical AI summits, design conferences
**Tone:** Ideas-driven, narrative, less code
**Framework:** Framework-agnostic, minimal code

---

### Abstract (public-facing, ~150 words)

We know from decades of cognitive science that human problem-solving is not linear. We form hypotheses, test them, abandon dead ends, backtrack, and explore parallel possibilities simultaneously. This is fundamentally tree-shaped.

And yet, every AI tool we've shipped in the last five years uses a linear chat interface. The scrolling list assumes linear thinking. Users adapt — opening 14 browser tabs, pasting notes between apps, manually managing context — but the cost is real. Cognitive overhead that the tool should be absorbing.

This talk makes the case that spatial, tree-structured interfaces are not a nice-to-have for AI tools. They are structurally correct for how reasoning actually works. We'll look at the cognitive science, examine what's been lost in the chat paradigm, and show what a tree-native AI interface feels like to use — and why building one is an engineering problem worth solving.

---

### Detailed Outline

**[0–5 min] The garden of forking paths**

- Borges reference (brief) — the idea of paths that multiply.
- Cognitive science primer: hypothesis-testing, backtracking, parallel search spaces.
- The two modes of thinking: explore (branch, branch, branch) vs. exploit (commit to one path).
- Current AI chat tools are built for exploit mode only.

**[5–12 min] The cost of the wrong interface**

- The "14 tabs" anti-pattern: what it tells us about unmet user needs.
- Context fragmentation: how users manually bridge context between chats, note apps, and documents.
- The lost branch problem: the insight you had in chat 3, tab 7 — gone.
- Case study: a researcher using AI tools for literature review. How many chat sessions? How much manually managed state? What was lost?

**[12–18 min] What tree-native interfaces look like**

- Live demo: Træk Playground — showing the canvas, branching, zoom.
- The key interaction: branch without losing the main thread.
- Focus mode: zooming into one branch while the rest stays available.
- Reconverge: bringing two branches back together into a synthesis.
- The spatial memory bonus: location on canvas encodes meaning. "That idea was over there."

**[18–23 min] Design principles for branching UIs**

1. **Branches should be free.** The cost of branching must feel zero.
2. **Context is inherited, not copied.** Each branch walks its parent chain automatically.
3. **The overview is always one keypress away.** Never lose the map.
4. **Spatial position encodes relationship.** Proximity = relatedness.
5. **The linear path remains available.** Not everyone branches; the interface shouldn't force it.

**[23–25 min] Invitation**

- Træk is open source. The branching canvas paradigm is better for users. We need more builders working on it.
- What we don't know yet: optimal layout algorithms, how branching scales to agent networks, what AI tools in 10 years look like if they're built around tree-native interfaces from the start.
- QR code → gettraek.com

---

### Speaker Notes

- This is the "big ideas" talk. No live coding. Demo should be pre-recorded or extremely tight.
- The Borges reference is optional — cut if the audience is more engineering than design.
- Pause on the "14 tabs" moment. It's relatable. Let the audience laugh/groan.
- The cognitive science section should be concrete and short — 2-3 clear studies, not a literature review.
- End with genuine openness about unsolved problems. This talk should invite collaborators, not just users.
