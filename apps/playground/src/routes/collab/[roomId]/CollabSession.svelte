<script lang="ts">
	/**
	 * CollabSession — mounts a collab-enabled TraekCanvas.
	 * Isolated into its own component so useCollab() is called at init time.
	 */
	import {
		TraekCanvas,
		TraekEngine,
		useCollab,
		CollabCursorsOverlay,
		CollabPresenceBubbles,
		CollabStatusIndicator,
		type MessageNode
	} from '@traek/svelte';
	import type { CollabConfig } from '@traek/collab';

	let {
		engine,
		collabConfig
	}: {
		engine: TraekEngine;
		collabConfig: CollabConfig;
	} = $props();

	// useCollab is called at component init — safe in Svelte 5 rune context
	const collab = useCollab(engine, collabConfig);

	// Mirror canvas viewport transform so the cursor overlay stays in sync
	let canvasScale = $state(1);
	let canvasOffset = $state({ x: 0, y: 0 });

	async function handleSend(input: string, userNode: MessageNode) {
		// Build context path
		const path: MessageNode[] = [];
		let current: MessageNode | undefined = userNode;
		while (current) {
			path.unshift(current);
			const pid: string | undefined = current.parentIds[0];
			current = pid
				? (engine.nodes.find((n) => n.id === pid) as MessageNode | undefined)
				: undefined;
		}
		const messages = path.map((n) => ({ role: n.role, content: (n.content ?? '').trim() }));

		const responseNode = engine.addNode('', 'assistant', { parentIds: [userNode.id] });
		engine.updateNode(responseNode.id, { status: 'streaming' });

		try {
			const res = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ messages })
			});

			if (!res.ok || !res.body) {
				engine.updateNode(responseNode.id, { status: 'error', errorMessage: 'Request failed' });
				return;
			}

			const reader = res.body.getReader();
			const decoder = new TextDecoder();
			let content = '';
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				content += decoder.decode(value, { stream: true });
				engine.updateNode(responseNode.id, { content });
			}
			engine.updateNode(responseNode.id, { status: 'done' });
		} catch {
			engine.updateNode(responseNode.id, { status: 'error', errorMessage: 'Network error' });
		}
	}
</script>

<div class="session-root">
	<!-- HUD: connection status + peer avatars -->
	<div class="hud">
		<CollabStatusIndicator provider={collab.provider} />
		{#if collab.peers.size > 0}
			<CollabPresenceBubbles
				provider={collab.provider}
				onPeerClick={(peer) => {
					if (peer.activeNodeId) engine.focusOnNode(peer.activeNodeId);
				}}
			/>
		{/if}
	</div>

	<TraekCanvas
		{engine}
		tourDelay={-1}
		onSendMessage={handleSend}
		onViewportChange={(vp) => {
			canvasScale = vp.scale;
			canvasOffset = vp.offset;
		}}
	/>

	<!-- Remote cursors — absolute overlay outside TraekCanvas -->
	<CollabCursorsOverlay provider={collab.provider} scale={canvasScale} offset={canvasOffset} />
</div>

<style>
	.session-root {
		position: fixed;
		inset: 0;
	}

	.hud {
		position: absolute;
		top: 16px;
		left: 16px;
		z-index: 50;
		display: flex;
		align-items: center;
		gap: 8px;
	}
</style>
