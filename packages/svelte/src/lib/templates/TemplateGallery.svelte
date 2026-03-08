<script lang="ts">
	import type { TraekEngine } from '../TraekEngine.svelte';
	import type { TemplateRegistry } from './TemplateRegistry';
	import type { ConversationTemplate, TemplateCategory } from './types';
	import { toast as toastFn } from '../toast/toastStore.svelte';

	let {
		engine,
		registry,
		onClose,
		onApplied
	}: {
		engine: TraekEngine;
		registry: TemplateRegistry;
		onClose: () => void;
		onApplied?: () => void;
	} = $props();

	type Tab = 'all' | TemplateCategory;
	const TABS: { id: Tab; label: string }[] = [
		{ id: 'all', label: 'All' },
		{ id: 'brainstorming', label: 'Brainstorming' },
		{ id: 'code', label: 'Code' },
		{ id: 'research', label: 'Research' },
		{ id: 'creative', label: 'Creative' }
	];

	let activeTab = $state<Tab>('all');
	let confirmTemplate = $state<ConversationTemplate | null>(null);
	let closeBtn = $state<HTMLButtonElement | null>(null);

	const allTemplates = $derived(registry.getAll());
	const filtered = $derived(
		activeTab === 'all' ? allTemplates : allTemplates.filter((t) => t.category === activeTab)
	);

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) onClose();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			if (confirmTemplate) {
				confirmTemplate = null;
			} else {
				onClose();
			}
		}
	}

	function requestApply(template: ConversationTemplate) {
		if (engine.nodes.length > 0) {
			confirmTemplate = template;
		} else {
			applyTemplate(template);
		}
	}

	function applyTemplate(template: ConversationTemplate) {
		try {
			engine.fromSnapshot(template.snapshot);
			if (template.defaultLayout) {
				engine.applyLayout(template.defaultLayout);
			}
			confirmTemplate = null;
			onClose();
			onApplied?.();
			toastFn(`${template.title} geladen.`, 'success');
		} catch {
			toastFn('Vorlage konnte nicht geladen werden. Bitte erneut versuchen.', 'error');
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="gallery-overlay" onclick={handleBackdropClick}>
	<div
		class="gallery-modal"
		role="dialog"
		aria-modal="true"
		aria-labelledby="template-gallery-title"
	>
		<!-- Header -->
		<div class="gallery-header">
			<h2 id="template-gallery-title">Vorlagen</h2>
			<button
				class="close-btn"
				onclick={onClose}
				aria-label="Vorlagen schließen"
				bind:this={closeBtn}
			>
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
					<path
						d="M3 3L13 13M13 3L3 13"
						stroke="currentColor"
						stroke-width="1.8"
						stroke-linecap="round"
					/>
				</svg>
			</button>
		</div>

		<!-- Filter tabs -->
		<div class="tab-strip" role="tablist" aria-label="Vorlage filtern">
			{#each TABS as tab (tab.id)}
				<button
					role="tab"
					aria-selected={activeTab === tab.id}
					class="tab-btn"
					class:active={activeTab === tab.id}
					onclick={() => (activeTab = tab.id)}
				>
					{tab.label}
				</button>
			{/each}
		</div>

		<!-- Card grid -->
		<div class="card-grid" role="list" aria-label="Konversationsvorlagen">
			{#each filtered as template (template.id)}
				<article class="template-card" role="listitem" aria-label={template.title}>
					<div class="thumbnail" aria-hidden="true">
						<!-- eslint-disable-next-line svelte/no-at-html-tags -->
						{@html template.svgThumbnail}
					</div>
					<div class="card-body">
						<div class="card-meta">
							<span class="card-title">{template.title}</span>
							<span class="node-count">{template.nodeCount} Knoten</span>
						</div>
						<p class="card-desc">{template.description}</p>
						<button
							class="use-btn"
							onclick={() => requestApply(template)}
							aria-label={`${template.title} Vorlage verwenden`}
						>
							Vorlage verwenden →
						</button>
					</div>
				</article>
			{/each}

			{#if filtered.length === 0}
				<p class="empty-msg">Keine Vorlagen in dieser Kategorie.</p>
			{/if}
		</div>
	</div>
</div>

<!-- Confirm replace dialog -->
{#if confirmTemplate}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="confirm-overlay" onclick={() => (confirmTemplate = null)}>
		<div
			class="confirm-dialog"
			role="alertdialog"
			aria-modal="true"
			aria-labelledby="confirm-title"
			aria-describedby="confirm-desc"
		>
			<h3 id="confirm-title">Canvas ersetzen?</h3>
			<p id="confirm-desc">
				Möchtest du die aktuelle Arbeit durch die Vorlage „{confirmTemplate.title}" ersetzen? Deine
				Änderungen gehen verloren.
			</p>
			<div class="confirm-actions">
				<button class="cancel-btn" onclick={() => (confirmTemplate = null)}>Abbrechen</button>
				<button
					class="replace-btn"
					onclick={() => confirmTemplate && applyTemplate(confirmTemplate)}
				>
					Canvas ersetzen
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.gallery-overlay {
		position: fixed;
		inset: 0;
		z-index: 900;
		background: rgba(0, 0, 0, 0.65);
		backdrop-filter: blur(4px);
		display: flex;
		align-items: center;
		justify-content: center;
		animation: fade-in 200ms ease-out;
	}

	@keyframes fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.gallery-modal {
		width: min(720px, 92vw);
		max-height: 85vh;
		overflow-y: auto;
		background: var(
			--traek-template-modal-bg,
			var(--traek-thought-panel-bg, rgba(22, 22, 22, 0.98))
		);
		border: 1px solid var(--traek-template-modal-border, var(--traek-thought-panel-border, #333333));
		border-radius: var(--traek-radius-lg, 12px);
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
		display: flex;
		flex-direction: column;
		animation: scale-in 200ms ease-out;
	}

	@keyframes scale-in {
		from {
			opacity: 0;
			transform: scale(0.95);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.gallery-overlay,
		.gallery-modal {
			animation: none;
		}
	}

	.gallery-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20px 24px 16px;
		border-bottom: 1px solid var(--traek-template-modal-border, #333333);
		flex-shrink: 0;
	}

	.gallery-header h2 {
		margin: 0;
		font-size: 18px;
		font-weight: 600;
		color: var(--traek-node-text, #dddddd);
	}

	.close-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		background: none;
		border: 1px solid transparent;
		border-radius: 6px;
		color: var(--traek-input-context-text, #888888);
		cursor: pointer;
		transition: all 0.15s;
	}

	.close-btn:hover {
		color: var(--traek-node-text, #dddddd);
		border-color: var(--traek-nodeBorder, #333333);
	}

	.close-btn:focus-visible {
		outline: 2px solid var(--traek-nodeActiveBorder, #00d8ff);
		outline-offset: 2px;
	}

	.tab-strip {
		display: flex;
		gap: 4px;
		padding: 12px 24px;
		border-bottom: 1px solid var(--traek-template-modal-border, #333333);
		flex-shrink: 0;
		flex-wrap: wrap;
	}

	.tab-btn {
		padding: 6px 14px;
		background: none;
		border: 1px solid transparent;
		border-radius: 20px;
		font-size: 13px;
		font-weight: 500;
		color: var(--traek-input-context-text, #888888);
		cursor: pointer;
		transition: all 0.15s;
		min-height: 32px;
	}

	.tab-btn:hover {
		color: var(--traek-node-text, #dddddd);
		background: rgba(255, 255, 255, 0.05);
	}

	.tab-btn.active {
		color: var(--traek-thought-tag-cyan, #00d8ff);
		border-color: var(--traek-thought-tag-cyan, #00d8ff);
		background: rgba(0, 216, 255, 0.08);
	}

	.tab-btn:focus-visible {
		outline: 2px solid var(--traek-nodeActiveBorder, #00d8ff);
		outline-offset: 2px;
	}

	.card-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 16px;
		padding: 20px 24px 24px;
		overflow-y: auto;
	}

	@media (max-width: 768px) {
		.card-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (min-width: 769px) and (max-width: 1023px) {
		.card-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	.empty-msg {
		grid-column: 1 / -1;
		text-align: center;
		color: var(--traek-input-context-text, #888888);
		font-size: 14px;
		padding: 32px 0;
	}

	.template-card {
		background: var(--traek-template-card-bg, var(--traek-nodeBg, #1a1a1a));
		border: 1px solid var(--traek-template-card-border, var(--traek-nodeBorder, #333333));
		border-radius: 8px;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		transition:
			border-color 0.15s,
			box-shadow 0.15s;
	}

	.template-card:hover {
		border-color: var(--traek-template-card-border-hover, var(--traek-nodeActiveBorder, #00d8ff));
		box-shadow: var(--traek-template-card-shadow-hover, 0 4px 20px rgba(0, 0, 0, 0.3));
	}

	.thumbnail {
		background: var(--traek-template-thumbnail-bg, var(--traek-canvasBg, #0e0e0e));
		height: 140px;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		transition: transform 0.2s ease;
	}

	.template-card:hover .thumbnail {
		transform: scale(1.03);
	}

	@media (prefers-reduced-motion: reduce) {
		.template-card:hover .thumbnail {
			transform: none;
		}
	}

	.thumbnail :global(svg) {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	.card-body {
		padding: 12px 14px 14px;
		display: flex;
		flex-direction: column;
		gap: 8px;
		flex: 1;
	}

	.card-meta {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 8px;
	}

	.card-title {
		font-size: 14px;
		font-weight: 600;
		color: var(--traek-node-text, #dddddd);
	}

	.node-count {
		font-size: 12px;
		color: var(--traek-input-context-text, #888888);
		white-space: nowrap;
	}

	.card-desc {
		margin: 0;
		font-size: 12px;
		line-height: 1.5;
		color: var(--traek-input-context-text, #888888);
		flex: 1;
	}

	.use-btn {
		width: 100%;
		padding: 10px 14px;
		min-height: 44px;
		background: var(--traek-input-button-bg, #00d8ff);
		color: var(--traek-input-button-text, #000000);
		border: none;
		border-radius: 6px;
		font-size: 13px;
		font-weight: 600;
		cursor: pointer;
		transition:
			opacity 0.15s,
			transform 0.15s;
	}

	.use-btn:hover {
		opacity: 0.9;
		transform: translateY(-1px);
	}

	.use-btn:active {
		transform: translateY(0);
	}

	.use-btn:focus-visible {
		outline: 2px solid var(--traek-nodeActiveBorder, #00d8ff);
		outline-offset: 2px;
	}

	@media (prefers-reduced-motion: reduce) {
		.use-btn:hover {
			transform: none;
		}
	}

	/* Scrollbar */
	.gallery-modal::-webkit-scrollbar {
		width: 8px;
	}

	.gallery-modal::-webkit-scrollbar-track {
		background: rgba(0, 0, 0, 0.2);
	}

	.gallery-modal::-webkit-scrollbar-thumb {
		background: #444444;
		border-radius: 4px;
	}

	/* Confirm dialog */
	.confirm-overlay {
		position: fixed;
		inset: 0;
		z-index: 1000;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(0, 0, 0, 0.5);
	}

	.confirm-dialog {
		background: var(--traek-template-modal-bg, rgba(22, 22, 22, 0.98));
		border: 1px solid var(--traek-template-modal-border, #444444);
		border-radius: 10px;
		padding: 24px;
		width: min(420px, 90vw);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
	}

	.confirm-dialog h3 {
		margin: 0 0 10px;
		font-size: 16px;
		font-weight: 600;
		color: var(--traek-node-text, #dddddd);
	}

	.confirm-dialog p {
		margin: 0 0 20px;
		font-size: 14px;
		line-height: 1.5;
		color: var(--traek-input-context-text, #aaaaaa);
	}

	.confirm-actions {
		display: flex;
		gap: 10px;
		justify-content: flex-end;
	}

	.cancel-btn {
		padding: 8px 16px;
		min-height: 36px;
		background: none;
		border: 1px solid var(--traek-nodeBorder, #444444);
		border-radius: 6px;
		font-size: 13px;
		color: var(--traek-input-context-text, #aaaaaa);
		cursor: pointer;
		transition: border-color 0.15s;
	}

	.cancel-btn:hover {
		border-color: var(--traek-nodeActiveBorder, #00d8ff);
		color: var(--traek-node-text, #dddddd);
	}

	.replace-btn {
		padding: 8px 16px;
		min-height: 36px;
		background: #c0392b;
		border: none;
		border-radius: 6px;
		font-size: 13px;
		font-weight: 600;
		color: #ffffff;
		cursor: pointer;
		transition: opacity 0.15s;
	}

	.replace-btn:hover {
		opacity: 0.85;
	}

	.cancel-btn:focus-visible,
	.replace-btn:focus-visible {
		outline: 2px solid var(--traek-nodeActiveBorder, #00d8ff);
		outline-offset: 2px;
	}

	@media (max-width: 768px) {
		.gallery-modal {
			width: 100vw;
			max-height: 95vh;
			border-radius: var(--traek-radius-lg, 12px) var(--traek-radius-lg, 12px) 0 0;
			align-self: flex-end;
		}

		.gallery-overlay {
			align-items: flex-end;
		}
	}
</style>
