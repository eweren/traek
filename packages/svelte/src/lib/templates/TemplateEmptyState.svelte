<script lang="ts">
	import type { TraekEngine } from '../TraekEngine.svelte';
	import type { TemplateRegistry } from './TemplateRegistry';
	import type { ConversationTemplate } from './types';
	import { toast as toastFn } from '../toast/toastStore.svelte';

	let {
		engine,
		registry,
		onOpenGallery,
		onDismiss
	}: {
		engine: TraekEngine;
		registry: TemplateRegistry;
		onOpenGallery: () => void;
		onDismiss: () => void;
	} = $props();

	const featured = $derived(registry.getAll().slice(0, 3));

	function applyTemplate(template: ConversationTemplate) {
		try {
			engine.fromSnapshot(template.snapshot);
			if (template.defaultLayout) {
				engine.applyLayout(template.defaultLayout);
			}
			onDismiss();
			toastFn(`${template.title} geladen.`, 'success');
		} catch {
			toastFn('Vorlage konnte nicht geladen werden. Bitte erneut versuchen.', 'error');
		}
	}
</script>

<div class="empty-state" aria-label="Konversation starten">
	<div class="empty-inner">
		<div class="empty-heading">
			<span class="spark" aria-hidden="true">✦</span>
			<div>
				<p class="title">Mit einer Vorlage starten</p>
				<p class="subtitle">oder mit einem leeren Canvas beginnen</p>
			</div>
		</div>

		<div class="featured-row" aria-label="Vorgeschlagene Vorlagen">
			{#each featured as template (template.id)}
				<button
					class="featured-card"
					onclick={() => applyTemplate(template)}
					aria-label={`${template.title} verwenden`}
					title={template.description}
				>
					<div class="featured-thumb" aria-hidden="true">
						<!-- eslint-disable-next-line svelte/no-at-html-tags -->
						{@html template.svgThumbnail}
					</div>
					<span class="featured-label">{template.title}</span>
				</button>
			{/each}
		</div>

		<div class="empty-actions">
			<button class="browse-btn" onclick={onOpenGallery}>Alle Vorlagen</button>
			<button class="blank-btn" onclick={onDismiss}>Leer starten</button>
		</div>
	</div>
</div>

<style>
	.empty-state {
		position: absolute;
		inset: 0;
		z-index: 20;
		display: flex;
		align-items: center;
		justify-content: center;
		pointer-events: none;
	}

	.empty-inner {
		pointer-events: auto;
		background: var(--traek-template-modal-bg, rgba(18, 18, 18, 0.92));
		border: 1px solid var(--traek-template-modal-border, #333333);
		border-radius: 14px;
		padding: 28px 32px;
		backdrop-filter: blur(12px);
		display: flex;
		flex-direction: column;
		gap: 20px;
		max-width: 560px;
		width: 90%;
		box-shadow: 0 8px 40px rgba(0, 0, 0, 0.4);
	}

	.empty-heading {
		display: flex;
		align-items: center;
		gap: 14px;
	}

	.spark {
		font-size: 24px;
		color: var(--traek-thought-tag-cyan, #00d8ff);
		flex-shrink: 0;
	}

	.title {
		margin: 0;
		font-size: 16px;
		font-weight: 600;
		color: var(--traek-node-text, #dddddd);
	}

	.subtitle {
		margin: 2px 0 0;
		font-size: 13px;
		color: var(--traek-input-context-text, #888888);
	}

	.featured-row {
		display: flex;
		gap: 12px;
	}

	@media (max-width: 480px) {
		.featured-row {
			flex-direction: column;
		}
	}

	.featured-card {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 8px;
		background: var(--traek-template-card-bg, var(--traek-nodeBg, #1a1a1a));
		border: 1px solid var(--traek-template-card-border, #333333);
		border-radius: 8px;
		padding: 0;
		cursor: pointer;
		overflow: hidden;
		transition:
			border-color 0.15s,
			box-shadow 0.15s;
		text-align: left;
		min-height: 44px;
	}

	.featured-card:hover {
		border-color: var(--traek-template-card-border-hover, #00d8ff);
		box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
	}

	.featured-card:focus-visible {
		outline: 2px solid var(--traek-nodeActiveBorder, #00d8ff);
		outline-offset: 2px;
	}

	.featured-thumb {
		background: var(--traek-template-thumbnail-bg, #0e0e0e);
		height: 80px;
		overflow: hidden;
		transition: transform 0.2s ease;
	}

	.featured-card:hover .featured-thumb {
		transform: scale(1.03);
	}

	@media (prefers-reduced-motion: reduce) {
		.featured-card:hover .featured-thumb {
			transform: none;
		}
	}

	.featured-thumb :global(svg) {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	.featured-label {
		display: block;
		padding: 6px 10px 8px;
		font-size: 12px;
		font-weight: 600;
		color: var(--traek-node-text, #dddddd);
	}

	.empty-actions {
		display: flex;
		gap: 10px;
	}

	.browse-btn {
		flex: 1;
		padding: 10px 16px;
		min-height: 44px;
		background: var(--traek-input-button-bg, #00d8ff);
		color: var(--traek-input-button-text, #000000);
		border: none;
		border-radius: 7px;
		font-size: 13px;
		font-weight: 600;
		cursor: pointer;
		transition: opacity 0.15s;
	}

	.browse-btn:hover {
		opacity: 0.88;
	}

	.browse-btn:focus-visible {
		outline: 2px solid var(--traek-nodeActiveBorder, #00d8ff);
		outline-offset: 2px;
	}

	.blank-btn {
		padding: 10px 16px;
		min-height: 44px;
		background: none;
		border: 1px solid var(--traek-nodeBorder, #444444);
		border-radius: 7px;
		font-size: 13px;
		color: var(--traek-input-context-text, #aaaaaa);
		cursor: pointer;
		transition:
			border-color 0.15s,
			color 0.15s;
	}

	.blank-btn:hover {
		border-color: var(--traek-nodeActiveBorder, #00d8ff);
		color: var(--traek-node-text, #dddddd);
	}

	.blank-btn:focus-visible {
		outline: 2px solid var(--traek-nodeActiveBorder, #00d8ff);
		outline-offset: 2px;
	}
</style>
