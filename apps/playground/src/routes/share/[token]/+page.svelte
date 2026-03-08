<script lang="ts">
	import { TraekCanvas, TraekEngine, type ConversationSnapshot } from '@traek/svelte';
	import type { PageData } from './$types.js';

	let { data }: { data: PageData } = $props();

	const engine = $derived.by(() => {
		if (data.snapshot) {
			try {
				return TraekEngine.fromSnapshot(data.snapshot as ConversationSnapshot);
			} catch {
				return new TraekEngine();
			}
		}
		return new TraekEngine();
	});
</script>

<svelte:head>
	<title>{data.title} — Træk</title>
	<meta name="description" content={data.description} />
	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content={data.shareUrl} />
	<meta property="og:title" content="{data.title} — Træk" />
	<meta property="og:description" content={data.description} />
	<meta property="og:image" content={data.ogImageUrl} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:site_name" content="Træk" />
	<!-- Twitter / X -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@gettraek" />
	<meta name="twitter:title" content="{data.title} — Træk" />
	<meta name="twitter:description" content={data.description} />
	<meta name="twitter:image" content={data.ogImageUrl} />
</svelte:head>

<div class="read-only-banner">
	<span>Read-only shared conversation</span>
	<a href="/" class="cta">Try Traek Playground →</a>
</div>

<TraekCanvas {engine} />

<style>
	:global(body) {
		overflow: hidden;
	}

	.read-only-banner {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
		background: color-mix(in srgb, var(--pg-surface) 95%, transparent);
		border-bottom: 1px solid var(--pg-border);
		padding: 10px 20px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 0.85rem;
		color: var(--pg-text-muted);
		backdrop-filter: blur(8px);
	}

	.cta {
		color: var(--pg-accent);
		font-weight: 600;
	}
</style>
