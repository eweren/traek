<script lang="ts">
	import {
		DEFAULT_TRACK_ENGINE_CONFIG,
		type MessageNode,
		ThemeProvider,
		TraekCanvas,
		TraekEngine,
		createDefaultRegistry,
		applyThemeToRoot,
		themes
	} from '@traek/svelte';
	import type { ThemeName } from '@traek/svelte';

	type ThemeTab = { id: ThemeName; label: string };

	const themeTabs: ThemeTab[] = [
		{ id: 'dark', label: 'Dark' },
		{ id: 'light', label: 'Light' },
		{ id: 'highContrast', label: 'High Contrast' }
	];

	let activeTheme = $state<ThemeName>('dark');

	const engine = new TraekEngine(DEFAULT_TRACK_ENGINE_CONFIG);
	const registry = createDefaultRegistry();

	// Seed with a rich demo conversation
	const n1 = engine.addNode(
		"Hello! I'm a **spatial AI assistant** running on the Træk canvas.\n\nTry sending a message — each reply branches from your selected node.",
		'assistant',
		{ type: 'text' }
	);
	const n2 = engine.addNode('Show me a code example.', 'user', {
		type: 'text',
		parentIds: [n1.id]
	});
	engine.addNode(
		"Here's how to initialise a Træk engine:\n\n```ts\nimport { TraekEngine } from '@traek/svelte';\n\nconst engine = new TraekEngine();\nconst root = engine.addNode('Hello!', 'assistant', { type: 'text' });\n```\n\nEach node has `id`, `role`, `content`, and spatial `metadata` with x/y coordinates.",
		'assistant',
		{ type: 'text', parentIds: [n2.id] }
	);

	$effect(() => {
		applyThemeToRoot(themes[activeTheme], activeTheme);
	});

	async function handleSend(input: string, userNode: MessageNode) {
		const assistantNode = engine.addNode('', 'assistant', {
			type: 'text',
			parentIds: userNode.id ? [userNode.id] : []
		});
		engine.updateNode(assistantNode.id, { status: 'streaming' });

		await new Promise((r) => setTimeout(r, 350));
		const reply = `You said: "${input}" — this is a mock streamed response. Connect a real AI backend via the \`onSendMessage\` prop.`;
		let content = '';
		for (let i = 0; i < reply.length; i += 2) {
			content += reply.slice(i, i + 2);
			engine.updateNode(assistantNode.id, { content });
			await new Promise((r) => setTimeout(r, 18));
		}
		engine.updateNode(assistantNode.id, { status: 'done' });
	}
</script>

<div class="theme-showcase">
	<div class="theme-tabs" role="tablist" aria-label="Theme">
		{#each themeTabs as tab}
			<button
				role="tab"
				aria-selected={activeTheme === tab.id}
				class:active={activeTheme === tab.id}
				onclick={() => {
					activeTheme = tab.id;
				}}
			>
				{tab.label}
			</button>
		{/each}
	</div>

	<div class="canvas-frame">
		<ThemeProvider initialTheme={activeTheme}>
			<TraekCanvas
				{engine}
				config={DEFAULT_TRACK_ENGINE_CONFIG}
				{registry}
				showStats={false}
				breadcrumbMinNodes={999}
				minimapMinNodes={999}
				tourDelay={-1}
				initialScale={0.82}
				onSendMessage={handleSend}
			/>
		</ThemeProvider>
	</div>
</div>

<style>
	.theme-showcase {
		display: flex;
		flex-direction: column;
		gap: 0;
		border-radius: 16px;
		overflow: hidden;
		border: 1px solid rgba(255, 255, 255, 0.08);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
	}

	.theme-tabs {
		display: flex;
		gap: 2px;
		padding: 8px 12px;
		background: #111113;
		border-bottom: 1px solid rgba(255, 255, 255, 0.07);
	}

	.theme-tabs button {
		padding: 5px 14px;
		border-radius: 6px;
		border: 1px solid transparent;
		background: transparent;
		color: #71717a;
		font-size: 12px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.15s ease;
		letter-spacing: 0.01em;
	}

	.theme-tabs button:hover {
		color: #e4e4e7;
		background: rgba(255, 255, 255, 0.06);
	}

	.theme-tabs button.active {
		background: rgba(0, 216, 255, 0.12);
		border-color: rgba(0, 216, 255, 0.3);
		color: #00d8ff;
	}

	.canvas-frame {
		position: relative;
		height: 440px;
		background: radial-gradient(circle at top left, #191919 0, #050505 52%, #000000 100%);
	}
</style>
