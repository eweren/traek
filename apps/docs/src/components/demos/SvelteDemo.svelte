<script lang="ts">
	import {
		DEFAULT_TRACK_ENGINE_CONFIG,
		type MessageNode,
		ThemeProvider,
		TraekCanvas,
		TraekEngine
	} from '@traek/svelte';
	import { createDefaultRegistry } from '@traek/svelte';

	const engine = new TraekEngine(DEFAULT_TRACK_ENGINE_CONFIG);
	const registry = createDefaultRegistry();
	engine.addNode('Hello! How can I help?', 'assistant', { type: 'text' });

	async function handleSend(input: string, userNode: MessageNode, action?: string | string[]) {
		const assistantNode = engine.addNode('', 'assistant', {
			type: 'text',
			parentIds: userNode.id ? [userNode.id] : []
		});
		engine.updateNode(assistantNode.id, { status: 'streaming' });

		// Fake-stream: yield reply in small chunks with delay
		await new Promise((resolve) => setTimeout(resolve, 400));
		const reply = `You said: "${input}". This demo runs in the browser with a mock response.`;
		const chunkSize = 2;
		const chunkDelayMs = 25;

		const stream = new ReadableStream({
			async start(controller) {
				const encoder = new TextEncoder();
				for (let i = 0; i < reply.length; i += chunkSize) {
					const chunk = reply.slice(i, i + chunkSize);
					controller.enqueue(encoder.encode(chunk));
					await new Promise((r) => setTimeout(r, chunkDelayMs));
				}
				controller.close();
			}
		});

		const reader = stream.getReader();
		const decoder = new TextDecoder();
		let content = '';
		let done = false;
		while (!done) {
			const { value, done: d } = await reader.read();
			done = d;
			if (value) {
				content += decoder.decode(value);
				engine.updateNode(assistantNode.id, { content });
			}
		}
		engine.updateNode(assistantNode.id, { status: 'done' });
	}
</script>

<ThemeProvider>
	<div class="demo-wrapper">
		<TraekCanvas
			{engine}
			config={DEFAULT_TRACK_ENGINE_CONFIG}
			{registry}
			showStats={false}
			breadcrumbMinNodes={999}
			minimapMinNodes={999}
			tourDelay={-1}
			initialScale={0.85}
			onSendMessage={handleSend}
		/>
	</div>
</ThemeProvider>

<style>
	.demo-wrapper {
		position: relative;
		height: 420px;
		border-radius: 24px;
		overflow: hidden;
		background: radial-gradient(
			circle at top left,
			var(--traek-demo-frame-bg-outer, #191919) 0,
			var(--traek-demo-frame-bg-inner, #050505) 52%,
			var(--traek-demo-frame-bg-bottom, #000000) 100%
		);
		border: 1px solid rgba(255, 255, 255, 0.06);
		box-shadow: var(--traek-shadow-demo-frame);
	}
	:root {
		--sl-content-gap-y: 0;
	}
</style>
