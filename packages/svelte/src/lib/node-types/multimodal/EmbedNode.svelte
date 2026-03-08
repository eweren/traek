<script lang="ts">
	import type { MessageNode } from '../../TraekEngine.svelte';
	import { embedNodeDataSchema, detectEmbedType } from './types';

	let { node }: { node: MessageNode } = $props();

	const data = $derived.by(() => {
		const result = embedNodeDataSchema.safeParse(node.data);
		return result.success ? result.data : null;
	});

	let youtubeLoaded = $state(false);

	const embedType = $derived(data ? detectEmbedType(data.url) : 'generic');

	function getYoutubeId(url: string): string | null {
		try {
			const u = new URL(url);
			if (u.hostname.includes('youtu.be')) return u.pathname.slice(1);
			return u.searchParams.get('v');
		} catch {
			return null;
		}
	}

	const youtubeId = $derived(data ? getYoutubeId(data.url) : null);
	const youtubeThumbnail = $derived(
		youtubeId ? `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg` : null
	);

	function getDomain(url: string): string {
		try {
			return new URL(url).hostname.replace('www.', '');
		} catch {
			return url;
		}
	}

	const domain = $derived(data ? getDomain(data.url) : '');
</script>

<div class="embed-node">
	{#if !data}
		<div class="invalid" role="alert">Invalid embed data</div>
	{:else if embedType === 'youtube' && youtubeId}
		<!-- YouTube privacy-first embed -->
		<div class="youtube-wrapper">
			{#if youtubeLoaded}
				<iframe
					src="https://www.youtube-nocookie.com/embed/{youtubeId}"
					title={data.preview?.title ?? 'YouTube video'}
					frameborder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowfullscreen
					class="youtube-frame"
					sandbox="allow-scripts allow-same-origin allow-presentation"
				></iframe>
			{:else}
				<div class="youtube-preview">
					{#if youtubeThumbnail}
						<img
							src={youtubeThumbnail}
							alt={data.preview?.title ?? 'YouTube video'}
							class="yt-thumb"
						/>
					{/if}
					<button class="play-btn" aria-label="Play video" onclick={() => (youtubeLoaded = true)}>
						<span class="play-icon" aria-hidden="true">▶</span>
					</button>
				</div>
			{/if}
		</div>
		{#if data.preview?.title}
			<div class="embed-title-bar">
				<span class="embed-domain">{domain}</span>
				<span class="embed-title">{data.preview.title}</span>
			</div>
		{/if}
	{:else}
		<!-- Generic link preview (GitHub, Twitter, Figma, generic) -->
		<!-- eslint-disable svelte/no-navigation-without-resolve -->
		<a
			href={data.url}
			target="_blank"
			rel="noopener noreferrer"
			class="embed-link"
			aria-label="Open {data.preview?.title ?? domain} in new tab"
		>
			<div class="embed-meta">
				{#if data.preview?.favicon}
					<img
						src={data.preview.favicon}
						alt=""
						class="favicon"
						width="16"
						height="16"
						aria-hidden="true"
					/>
				{:else}
					<span class="favicon-fallback" aria-hidden="true">🔗</span>
				{/if}
				<span class="embed-domain">{domain}</span>
			</div>

			{#if data.preview}
				<div class="embed-body">
					{#if data.preview.image}
						<div class="embed-thumb">
							<img src={data.preview.image} alt="" class="thumb-img" />
						</div>
					{/if}
					<div class="embed-text">
						{#if data.preview.title}
							<div class="embed-preview-title">{data.preview.title}</div>
						{/if}
						{#if data.preview.description}
							<div class="embed-desc">{data.preview.description}</div>
						{/if}
					</div>
				</div>
			{:else}
				<div class="embed-url">{data.url}</div>
			{/if}

			<div class="embed-footer">
				<span class="open-label">Open →</span>
			</div>
		</a>
		<!-- eslint-enable svelte/no-navigation-without-resolve -->
	{/if}
</div>

<style>
	.embed-node {
		background: var(--traek-node-bg, #1e1e1e);
		border: 1px solid var(--traek-node-border, #2a2a2a);
		border-radius: 8px;
		overflow: hidden;
		min-width: 280px;
		max-width: 440px;
	}

	/* YouTube */
	.youtube-wrapper {
		position: relative;
		width: 100%;
		aspect-ratio: 16/9;
		background: #000;
		max-height: 220px;
	}

	.youtube-preview {
		position: relative;
		width: 100%;
		height: 100%;
	}

	.yt-thumb {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.play-btn {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(0, 0, 0, 0.35);
		border: none;
		cursor: pointer;
	}

	.play-btn:hover {
		background: rgba(0, 0, 0, 0.55);
	}

	.play-btn:focus-visible {
		outline: 2px solid #00d8ff;
		outline-offset: -2px;
	}

	.play-icon {
		font-size: 48px;
		color: #fff;
		text-shadow: 0 2px 12px rgba(0, 0, 0, 0.5);
	}

	.youtube-frame {
		width: 100%;
		height: 100%;
		border: none;
	}

	.embed-title-bar {
		padding: 8px 12px;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	/* Generic link preview */
	.embed-link {
		display: flex;
		flex-direction: column;
		text-decoration: none;
		color: inherit;
	}

	.embed-link:hover {
		background: rgba(255, 255, 255, 0.02);
	}

	.embed-link:focus-visible {
		outline: 2px solid var(--traek-input-button-bg, #00d8ff);
		outline-offset: -2px;
	}

	.embed-meta {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 8px 12px 4px;
	}

	.favicon {
		width: 16px;
		height: 16px;
		object-fit: contain;
		border-radius: 2px;
	}

	.favicon-fallback {
		font-size: 14px;
		line-height: 1;
	}

	.embed-domain {
		font-size: 11px;
		color: var(--traek-thought-header-accent, #71717a);
	}

	.embed-body {
		display: flex;
		gap: 10px;
		padding: 4px 12px 8px;
	}

	.embed-thumb {
		flex-shrink: 0;
		width: 80px;
		height: 60px;
		border-radius: 4px;
		overflow: hidden;
		background: rgba(255, 255, 255, 0.06);
	}

	.thumb-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.embed-text {
		flex: 1;
		min-width: 0;
	}

	.embed-preview-title {
		font-size: 13px;
		font-weight: 500;
		color: var(--traek-node-text, #ddd);
		line-height: 1.3;
		margin-bottom: 4px;
		overflow: hidden;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.embed-title {
		font-size: 12px;
		color: var(--traek-node-text, #ccc);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.embed-desc {
		font-size: 11px;
		color: var(--traek-thought-header-accent, #888);
		line-height: 1.4;
		overflow: hidden;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.embed-url {
		padding: 8px 12px;
		font-size: 11px;
		color: var(--traek-input-button-bg, #00d8ff);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.embed-footer {
		display: flex;
		justify-content: flex-end;
		padding: 4px 12px 8px;
	}

	.open-label {
		font-size: 11px;
		color: var(--traek-input-button-bg, #00d8ff);
	}

	.invalid {
		padding: 12px;
		font-size: 12px;
		color: #ef4444;
	}
</style>
