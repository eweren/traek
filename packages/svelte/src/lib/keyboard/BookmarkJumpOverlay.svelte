<script lang="ts">
	import type { TraekEngine, MessageNode } from '../TraekEngine.svelte';

	let {
		engine,
		onClose,
		onSelect
	}: {
		engine: TraekEngine;
		onClose: () => void;
		onSelect: (nodeId: string) => void;
	} = $props();

	let selectedIndex = $state(0);
	const bookmarks = $derived(engine.getBookmarks());

	$effect(() => {
		void bookmarks;
		selectedIndex = 0;
	});

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			e.preventDefault();
			onClose();
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			selectedIndex = (selectedIndex + 1) % Math.max(bookmarks.length, 1);
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			selectedIndex =
				(selectedIndex - 1 + Math.max(bookmarks.length, 1)) % Math.max(bookmarks.length, 1);
		} else if (e.key === 'Enter' && bookmarks[selectedIndex]) {
			e.preventDefault();
			onSelect(bookmarks[selectedIndex].node.id);
			onClose();
		}
	}
</script>

<svelte:window onkeydown={handleKeyDown} />

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div class="overlay-backdrop" onclick={onClose}>
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		class="overlay"
		onclick={(e) => e.stopPropagation()}
		role="dialog"
		aria-label="Jump to bookmark"
		tabindex="-1"
	>
		<div class="overlay__header">
			<span class="overlay__title">Bookmarks</span>
			<span class="overlay__hint">↑↓ navigate · Enter jump · Esc close</span>
		</div>

		{#if bookmarks.length === 0}
			<p class="overlay__empty">No bookmarks yet. Use the bookmark icon on nodes to add them.</p>
		{:else}
			<ul class="overlay__list" role="listbox">
				{#each bookmarks as bm, i (bm.node.id)}
					<li
						role="option"
						aria-selected={i === selectedIndex}
						class="overlay__item"
						class:selected={i === selectedIndex}
					>
						<button
							class="overlay__item-btn"
							onclick={() => {
								onSelect(bm.node.id);
								onClose();
							}}
						>
							<span class="overlay__star" aria-hidden="true">★</span>
							<span class="overlay__content">
								{#if bm.label}
									<strong class="overlay__label">{bm.label}</strong>
								{/if}
								<span class="overlay__preview">
									{((bm.node as MessageNode).content ?? '').substring(0, 80)}
								</span>
							</span>
						</button>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>

<style>
	.overlay-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 200;
		display: flex;
		align-items: flex-start;
		justify-content: center;
		padding-top: 15vh;
	}

	.overlay {
		background: var(--traek-sidebar-bg, #1a1a2e);
		border: 1px solid rgba(255, 255, 255, 0.12);
		border-radius: 10px;
		width: 480px;
		max-height: 400px;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
	}

	.overlay__header {
		padding: 12px 16px;
		display: flex;
		align-items: center;
		gap: 8px;
		border-bottom: 1px solid rgba(255, 255, 255, 0.08);
	}

	.overlay__title {
		font-weight: 600;
		font-size: 13px;
	}

	.overlay__hint {
		font-size: 11px;
		color: rgba(255, 255, 255, 0.35);
		margin-left: auto;
	}

	.overlay__list {
		list-style: none;
		margin: 0;
		padding: 4px 0;
		overflow-y: auto;
		flex: 1;
	}

	.overlay__item-btn {
		display: flex;
		align-items: flex-start;
		gap: 10px;
		width: 100%;
		padding: 10px 16px;
		background: none;
		border: none;
		color: var(--traek-node-text, rgba(255, 255, 255, 0.85));
		cursor: pointer;
		text-align: left;
	}

	.overlay__item.selected .overlay__item-btn {
		background: rgba(255, 255, 255, 0.08);
	}

	.overlay__star {
		color: var(--traek-color-yellow, #eab308);
		flex-shrink: 0;
		margin-top: 1px;
	}

	.overlay__content {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}

	.overlay__label {
		font-size: 12px;
		color: rgba(255, 255, 255, 0.6);
	}

	.overlay__preview {
		font-size: 13px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		color: rgba(255, 255, 255, 0.85);
	}

	.overlay__empty {
		padding: 32px 20px;
		color: rgba(255, 255, 255, 0.35);
		font-size: 13px;
		text-align: center;
		margin: 0;
		line-height: 1.6;
	}
</style>
