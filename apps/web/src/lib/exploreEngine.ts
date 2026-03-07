import { TraekEngine, DEFAULT_TRACK_ENGINE_CONFIG, type TraekEngineConfig } from '@traek/svelte';

// ---------------------------------------------------------------------------
// Scripted responses — keyword-matched, no API key needed
// ---------------------------------------------------------------------------

interface ScriptedResponse {
	response: string;
	thought: string;
}

const RESPONSES: Array<{ patterns: RegExp; data: ScriptedResponse }> = [
	{
		patterns: /\b(hello|hi|hey|start|begin|help|what can|intro)\b/i,
		data: {
			response: `Welcome to the **træk interactive demo** — no API key required.

I'm a scripted demo. I respond to keywords and don't call any AI service. But the canvas itself is fully real: pan, zoom, branch, and navigate.

**Try asking me about:**
- Branching conversations and why they matter
- Spatial thinking vs. linear chat
- How to install træk in your project
- Keyboard shortcuts and navigation
- AI reasoning and non-linear structure

Or just explore: **scroll to zoom**, **drag to pan**, click any node to focus it, and press **?** for keyboard shortcuts.`,
			thought:
				"User is starting the conversation. Explain the demo's scripted nature and invite exploration of canvas features."
		}
	},
	{
		patterns: /\b(branch|fork|explore|alternative|compare|diverge|parallel|path)\b/i,
		data: {
			response: `**Branching is the core idea behind træk.**

In a traditional chat, every message appends to the end. You can't go back to message 5 and explore a different direction — you're locked into a single timeline.

træk changes this: every node is a branch point. Reply from any previous message and a new path appears. Both paths survive, each fully navigable.

This matters most when:
- You're testing different question framings
- An AI response opens an unexpected direction
- You want to compare two approaches side by side
- An agent takes a wrong turn and you want to recover

**Try it now:** click the root message at the top, then type something new in the input bar. Watch a new branch appear alongside this one.`,
			thought:
				'User asked about branching. Explain the core mechanic and invite them to try it directly.'
		}
	},
	{
		patterns: /\b(spatial|canvas|layout|2d|pan|zoom|map|graph|visual|navigate|navigation)\b/i,
		data: {
			response: `**Why spatial layout?**

Most knowledge isn't sequential — it's networked. Ideas connect to other ideas in multiple directions simultaneously. A conversation is really a graph, not a list.

When you force a graph into a list, you lose structure. The relationships between ideas become implicit, buried in scroll history, impossible to revisit.

Spatial layout makes structure explicit:
- Parent-child relationships become visible arrows
- Branching paths spread horizontally
- The *shape* of a conversation tells you something about its content
- You can see at a glance where threads converge and diverge

This is why maps work better than timelines for complex territory.

træk is that map for your AI conversations.`,
			thought:
				'User asked about spatial layout philosophy. Give the core argument for 2D over linear.'
		}
	},
	{
		patterns: /\b(ai|reasoning|think|model|llm|gpt|claude|token|agent|inference)\b/i,
		data: {
			response: `**AI reasoning is non-linear. Most UIs pretend it isn't.**

When a model generates a response, it's sampling from a distribution of possible tokens. Each choice influences what follows. The output is a *path* through a space of possibilities — not the only path.

This has real consequences for UI design:
- The "best" answer might require a different question framing
- Alternative responses deserve to coexist, not overwrite each other
- Reasoning steps (thoughts) are structurally different from conclusions
- Agent memory and context form trees, not lists

træk is built for this reality. Branching, thought nodes, and spatial layout aren't cosmetic — they're the right model for what AI conversations actually are.

> *If AI thinking branches, your UI should too.*`,
			thought:
				'User asked about AI reasoning. Connect non-linear reasoning to the need for branching UI.'
		}
	},
	{
		patterns:
			/\b(install|npm|svelte|react|vue|code|package|import|setup|get started|quickstart)\b/i,
		data: {
			response: `**Get started with træk:**

\`\`\`bash
# Svelte 5
npm install @traek/svelte

# React (beta)
npm install @traek/react
\`\`\`

**Minimal Svelte setup:**

\`\`\`svelte
<script lang="ts">
  import {
    TraekCanvas,
    TraekEngine,
    DEFAULT_TRACK_ENGINE_CONFIG
  } from '@traek/svelte';

  const engine = new TraekEngine(DEFAULT_TRACK_ENGINE_CONFIG);

  function onSendMessage(input, userNode) {
    const responseNode = engine.addNode('', 'assistant', {
      parentIds: [userNode.id],
      autofocus: true
    });
    engine.updateNode(responseNode.id, { status: 'streaming' });
    // stream your model's output here...
  }
</script>

<TraekCanvas {engine} {onSendMessage} />
\`\`\`

Two components: **TraekEngine** manages the conversation graph, **TraekCanvas** renders it. Bring your own model, your own streaming, your own persistence.`,
			thought: 'User wants installation info. Show package names, minimal setup code.'
		}
	},
	{
		patterns: /\b(keyboard|shortcut|key|vim|arrow|search|hotkey|ctrl|cmd)\b/i,
		data: {
			response: `**Keyboard shortcuts in træk:**

| Key | Action |
|-----|--------|
| \`↑ / ↓\` | Navigate parent / child nodes |
| \`← / →\` | Navigate sibling branches |
| \`Home\` | Jump to root node |
| \`End\` | Jump to deepest active node |
| \`/\` | Open fuzzy node search |
| \`Ctrl+F\` | Text search in messages |
| \`?\` | Show all shortcuts |
| \`1–9\` | Jump to node by sibling index |
| \`Esc\` | Close search / deselect |

The navigation model is keyboard-first and spatially aware — inspired by Vim's modal philosophy.

On **mobile**: swipe up/down for parent/child, left/right for siblings. Haptic feedback on supported devices.`,
			thought:
				'User asked about keyboard shortcuts. Show the full table and mention mobile gestures.'
		}
	},
	{
		patterns: /\b(thought|reasoning|chain of thought|cot|visible|transparent)\b/i,
		data: {
			response: `**Thought nodes** are a first-class concept in træk.

When a model reasons before responding (chain-of-thought, extended thinking), that reasoning is structurally different from the answer. It's metadata about the response, not the response itself.

In træk, thought nodes:
- Attach to their parent response node
- Are rendered in a collapsible panel — visible but not in the way
- Indicate thinking state (streaming, done, error) independently
- Can be compared across branches to understand *why* two paths diverged

This makes reasoning legible without cluttering the main conversation path.

To add a thought node: \`engine.addNode(content, 'assistant', { type: 'thought', parentIds: [responseNode.id] })\``,
			thought: 'User asked about thought nodes. Explain the concept and its structural role.'
		}
	},
	{
		patterns: /\b(persistence|save|store|local|indexeddb|export|snapshot|backup)\b/i,
		data: {
			response: `**træk persists conversations automatically.**

The built-in \`ConversationStore\` uses IndexedDB with localStorage fallback:

\`\`\`typescript
import { ConversationStore } from '@traek/svelte';

const store = new ConversationStore();
await store.init();

// Auto-save as the engine changes
store.enableAutoSave(engine, conversationId);

// Export as JSON or Markdown
import { snapshotToJSON, snapshotToMarkdown, downloadFile } from '@traek/svelte';
downloadFile('chat.json', snapshotToJSON(engine.snapshot()));
downloadFile('chat.md', snapshotToMarkdown(engine.snapshot()));
\`\`\`

Snapshots capture the full tree: nodes, spatial coordinates, active node, and viewport position. You can restore a conversation exactly as the user left it.

**This scripted demo doesn't persist** — refresh to reset.`,
			thought: 'User asked about persistence. Show ConversationStore API and snapshot export.'
		}
	}
];

// Default responses cycled when no keyword matches
const DEFAULTS: ScriptedResponse[] = [
	{
		response: `That's a path worth exploring. In a branching conversation, questions like this one often open multiple valid threads — that's exactly what træk is built for.

**Try something:** click any earlier node and reply from there with a different angle. Watch the conversation grow as a tree, not a stack.`,
		thought:
			'No keyword matched. Encourage the user to explore branching with their current question.'
	},
	{
		response: `One of the things that makes spatial conversation different from linear chat: you can hold multiple threads simultaneously without losing any of them.

In a linear interface, you're forced to commit to one direction. Here, divergence is the default. Every question you don't ask can still branch from any point.`,
		thought: 'No keyword matched. Reflect on the core spatial metaphor.'
	},
	{
		response: `I'm a scripted demo, so my knowledge is limited — but the canvas has no limits.

Pan the background, zoom with scroll, click any node to focus it. Reply from the root to start a parallel branch. Press **?** to see all keyboard shortcuts. The spatial structure you create is the point.`,
		thought: 'No keyword matched. Redirect to canvas exploration.'
	}
];

let defaultIndex = 0;

export function getScriptedResponse(input: string): ScriptedResponse {
	for (const { patterns, data } of RESPONSES) {
		if (patterns.test(input)) return data;
	}
	const result = DEFAULTS[defaultIndex % DEFAULTS.length];
	defaultIndex += 1;
	return result;
}

// ---------------------------------------------------------------------------
// Pre-seeded engine for the explore page
// ---------------------------------------------------------------------------

export function createExploreEngine(
	config: TraekEngineConfig = DEFAULT_TRACK_ENGINE_CONFIG
): TraekEngine {
	const engine = new TraekEngine(config);

	const root = engine.addNode('What is træk and why does it exist?', 'user', { parentIds: [] });

	const overview = engine.addNode(
		`**træk** is a UI library for building spatial, tree-structured AI conversation interfaces.

Instead of a linear scroll, conversations become a navigable canvas: nodes connected by visible arrows, branching freely in any direction.

**Why it exists:** AI reasoning doesn't fit a list. Ideas branch. Questions spawn sub-questions. Alternatives deserve parallel exploration.

træk gives that structure a visual form.

---

*This is a scripted demo — no API key needed. Ask me anything, or explore the canvas: pan by dragging, zoom with scroll.*`,
		'assistant',
		{ parentIds: [root.id] }
	);

	engine.addNode(
		'The user is asking a foundational question. Explain the core value proposition clearly: spatial > linear for complex AI conversations. Invite exploration.',
		'assistant',
		{ parentIds: [overview.id], type: 'thought' }
	);

	// Branch A — show branching
	const branchQ = engine.addNode('Can you show me how branching works?', 'user', {
		parentIds: [overview.id]
	});

	const branchA = engine.addNode(
		`**You're already looking at branching.**

The root message asked "What is træk?" and got an answer. This message branched from *that answer* — creating a new path alongside the original.

To branch from any node:
1. Click the node you want to branch from
2. Type in the input bar — your message becomes a child of that node

Both paths persist. Neither overwrites the other. You can navigate between them with arrow keys or by clicking.

**Try it:** click the root message and type something completely different. A new branch appears.`,
		'assistant',
		{ parentIds: [branchQ.id], autofocus: true }
	);

	engine.addNode(
		'User asked about branching. Show by example that they are already seeing it. Explain the mechanic and invite them to try.',
		'assistant',
		{ parentIds: [branchA.id], type: 'thought' }
	);

	engine.activeNodeId = branchA.id;
	return engine;
}
