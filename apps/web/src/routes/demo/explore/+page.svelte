<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import {
		TraekCanvas,
		DefaultLoadingOverlay,
		TraekEngine,
		DEFAULT_TRACK_ENGINE_CONFIG,
		type MessageNode,
		createDefaultRegistry,
		useTheme
	} from '@traek/svelte';
	import { createExploreEngine, getScriptedResponse } from '$lib/exploreEngine';
	import SiteNav from '$lib/components/SiteNav.svelte';
	import highlightDarkUrl from 'highlight.js/styles/github-dark.css?url';
	import highlightLightUrl from 'highlight.js/styles/github.css?url';

	const themeCtx = useTheme();
	const currentTheme = $derived(themeCtx.currentThemeName());
	const registry = createDefaultRegistry();

	let engine = $state<TraekEngine | null>(null);

	onMount(() => {
		engine = createExploreEngine(DEFAULT_TRACK_ENGINE_CONFIG);
	});

	async function streamText(text: string, nodeId: string, eng: TraekEngine) {
		// Stream word-by-word with natural timing
		const chunks = text.split(/(\s+)/);
		let content = '';
		for (const chunk of chunks) {
			content += chunk;
			eng.updateNode(nodeId, { content });
			const delay = chunk.trim().length > 0 ? 12 + Math.random() * 25 : 4;
			await new Promise((r) => setTimeout(r, delay));
		}
	}

	async function onSendMessage(input: string, userNode: MessageNode) {
		const eng = engine;
		if (!eng) return;

		const { response, thought } = getScriptedResponse(input);

		const responseNode = eng.addNode('', 'assistant', {
			parentIds: [userNode.id],
			autofocus: true
		});

		eng.addNode(thought, 'assistant', {
			type: 'thought',
			parentIds: [responseNode.id]
		});

		eng.updateNode(responseNode.id, { status: 'streaming' });
		eng.activeNodeId = responseNode.id;

		await streamText(response, responseNode.id, eng);
		eng.updateNode(responseNode.id, { status: 'done' });
	}
</script>

<svelte:head>
	<title>træk — interactive demo</title>
	<meta name="description" content="Try træk's spatial conversation canvas. No API key required." />
	<link rel="stylesheet" href={currentTheme === 'light' ? highlightLightUrl : highlightDarkUrl} />
</svelte:head>

<div class="explore-layout">
	<SiteNav />

	<div class="canvas-area">
		{#if engine}
			<TraekCanvas
				{engine}
				config={DEFAULT_TRACK_ENGINE_CONFIG}
				{registry}
				{onSendMessage}
				minimapMinNodes={4}
				breadcrumbMinNodes={3}
				tourDelay={45000}
			>
				{#snippet initialOverlay()}
					<DefaultLoadingOverlay />
				{/snippet}
			</TraekCanvas>
		{:else}
			<div class="loading-state">
				<div class="loading-spinner" aria-hidden="true"></div>
			</div>
		{/if}
	</div>

	<div class="demo-badge" role="status" aria-live="polite">
		<span class="badge-dot" aria-hidden="true"></span>
		<span>Scripted demo — no API key</span>
		<a href={resolve('/demo')} class="badge-link" data-umami-event="explore-to-full-demo"
			>Full demo →</a
		>
	</div>
</div>

<style>
	.explore-layout {
		position: fixed;
		inset: 0;
		display: flex;
		flex-direction: column;
		background: var(--traek-canvas-bg, #0b0b0b);
	}

	.canvas-area {
		flex: 1;
		min-height: 0;
		padding-top: 52px;
	}

	.loading-state {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
	}

	.loading-spinner {
		width: 1.75rem;
		height: 1.75rem;
		border: 2px solid var(--traek-spinner-border, rgba(255, 255, 255, 0.12));
		border-top-color: var(--traek-spinner-top, #888888);
		border-radius: 50%;
		animation: spin 0.75s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.demo-badge {
		position: fixed;
		bottom: 1.25rem;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.4rem 0.85rem;
		background: rgba(12, 12, 12, 0.88);
		border: 1px solid rgba(255, 255, 255, 0.09);
		border-radius: 999px;
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		font-size: 0.78rem;
		color: var(--traek-landing-text-muted-2, #a5a5a5);
		z-index: 50;
		white-space: nowrap;
		pointer-events: auto;
	}

	:global([data-theme='light']) .demo-badge {
		background: rgba(248, 248, 248, 0.92);
		border-color: rgba(0, 0, 0, 0.1);
	}

	.badge-dot {
		width: 6px;
		height: 6px;
		flex-shrink: 0;
		border-radius: 50%;
		background: var(--traek-accent-lime, #00ffa3);
		box-shadow: 0 0 8px rgba(0, 255, 163, 0.55);
		animation: pulse 2.5s ease-in-out infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}

	.badge-link {
		color: var(--traek-accent-cyan, #00d8ff);
		text-decoration: none;
		margin-left: 0.2rem;
		transition: opacity 0.15s;
	}

	.badge-link:hover {
		opacity: 0.8;
		text-decoration: underline;
	}

	.badge-link:focus-visible {
		outline: 2px solid var(--traek-accent-cyan, #00d8ff);
		outline-offset: 2px;
		border-radius: 3px;
	}
</style>
