<script lang="ts">
	import {
		DEFAULT_TRACK_ENGINE_CONFIG,
		type MessageNode,
		ThemeProvider,
		TraekCanvas,
		TraekEngine,
		createDefaultRegistry
	} from '@traek/svelte';

	const engine = new TraekEngine(DEFAULT_TRACK_ENGINE_CONFIG);
	const registry = createDefaultRegistry();

	// Build a branched conversation to showcase BranchCompare
	const n0 = engine.addNode(
		'Welcome to branching conversations! Ask anything — try sending a message and then clicking a different node to create a branch.',
		'assistant',
		{ type: 'text' }
	);
	const n1 = engine.addNode('What is Træk?', 'user', {
		type: 'text',
		parentIds: [n0.id]
	});
	// Two parallel assistant responses from the same user node (simulating a retry / alternate branch)
	engine.addNode(
		'**Træk** is a spatial AI chat UI toolkit. Messages live as nodes on a pannable, zoomable canvas — with full branching support. You can fork any node to explore alternative conversation paths.',
		'assistant',
		{ type: 'text', parentIds: [n1.id] }
	);
	engine.addNode(
		'Træk replaces linear chatbots with a tree-structured canvas. Each message is a node you can zoom, pan, and branch from — ideal for AI research, coding assistants, and multi-path dialogues.',
		'assistant',
		{ type: 'text', parentIds: [n1.id] }
	);

	async function handleSend(input: string, userNode: MessageNode) {
		const assistantNode = engine.addNode('', 'assistant', {
			type: 'text',
			parentIds: userNode.id ? [userNode.id] : []
		});
		engine.updateNode(assistantNode.id, { status: 'streaming' });
		await new Promise((r) => setTimeout(r, 300));
		const reply = `You said: "${input}". Træk branches your conversation — try clicking a different node and sending another message!`;
		let content = '';
		for (let i = 0; i < reply.length; i += 2) {
			content += reply.slice(i, i + 2);
			engine.updateNode(assistantNode.id, { content });
			await new Promise((r) => setTimeout(r, 18));
		}
		engine.updateNode(assistantNode.id, { status: 'done' });
	}
</script>

<ThemeProvider initialTheme="dark">
	<div class="branch-frame">
		<TraekCanvas
			{engine}
			config={DEFAULT_TRACK_ENGINE_CONFIG}
			{registry}
			showStats={false}
			breadcrumbMinNodes={999}
			minimapMinNodes={999}
			tourDelay={-1}
			initialScale={0.78}
			onSendMessage={handleSend}
		/>
	</div>
</ThemeProvider>

<style>
	.branch-frame {
		position: relative;
		height: 420px;
		border-radius: 16px;
		overflow: hidden;
		background: radial-gradient(
			circle at top left,
			var(--traek-demo-frame-bg-outer, #191919) 0,
			var(--traek-demo-frame-bg-inner, #050505) 52%,
			var(--traek-demo-frame-bg-bottom, #000000) 100%
		);
		border: 1px solid rgba(255, 255, 255, 0.06);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
	}
</style>
