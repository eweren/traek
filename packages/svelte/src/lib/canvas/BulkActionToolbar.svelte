<script lang="ts">
	import type { TraekEngine, NodeColor } from '../TraekEngine.svelte';
	import ColorPicker from './ColorPicker.svelte';

	const QUICK_TAGS = ['important', 'todo', 'idea', 'question', 'resolved'];

	let {
		engine,
		selectedIds,
		onClear
	}: {
		engine: TraekEngine;
		selectedIds: string[];
		onClear?: () => void;
	} = $props();

	let showColorPicker = $state(false);
	let showTagPicker = $state(false);

	function applyColor(color: NodeColor | null) {
		engine.bulkSetColor(selectedIds, color);
		showColorPicker = false;
	}

	function applyTag(tag: string) {
		engine.bulkAddTag(selectedIds, tag);
		showTagPicker = false;
	}

	function bookmarkAll() {
		engine.bulkSetBookmark(selectedIds, true);
	}

	function unbookmarkAll() {
		engine.bulkSetBookmark(selectedIds, false);
	}
</script>

<div class="bulk-toolbar" role="toolbar" aria-label="{selectedIds.length} selected nodes">
	<span class="bulk-toolbar__count">{selectedIds.length} selected</span>

	<div class="bulk-toolbar__divider" aria-hidden="true"></div>

	<div class="bulk-toolbar__group">
		<button
			class="bulk-toolbar__btn"
			onclick={() => {
				showColorPicker = !showColorPicker;
				showTagPicker = false;
			}}
			aria-expanded={showColorPicker}
			title="Set color"
		>
			Color
		</button>
		<button
			class="bulk-toolbar__btn"
			onclick={() => {
				showTagPicker = !showTagPicker;
				showColorPicker = false;
			}}
			aria-expanded={showTagPicker}
			title="Add tag"
		>
			Tag
		</button>
		<button class="bulk-toolbar__btn" onclick={bookmarkAll} title="Bookmark all">
			★ Bookmark
		</button>
		<button
			class="bulk-toolbar__btn bulk-toolbar__btn--muted"
			onclick={unbookmarkAll}
			title="Remove bookmarks"
		>
			☆ Unbookmark
		</button>
	</div>

	<div class="bulk-toolbar__divider" aria-hidden="true"></div>

	<button
		class="bulk-toolbar__btn bulk-toolbar__btn--close"
		onclick={onClear}
		aria-label="Clear selection"
	>
		✕
	</button>

	{#if showColorPicker}
		<div class="bulk-toolbar__popover" role="dialog" aria-label="Pick color">
			<ColorPicker onchange={applyColor} />
		</div>
	{/if}

	{#if showTagPicker}
		<div class="bulk-toolbar__popover" role="dialog" aria-label="Pick tag">
			<ul class="bulk-toolbar__tags" role="listbox">
				{#each QUICK_TAGS as tag (tag)}
					<li role="none">
						<button class="bulk-toolbar__tag-btn" onclick={() => applyTag(tag)}>{tag}</button>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>

<style>
	.bulk-toolbar {
		position: fixed;
		bottom: 80px;
		left: 50%;
		transform: translateX(-50%);
		background: var(--traek-node-bg, #1e1e2e);
		border: 1px solid rgba(255, 255, 255, 0.15);
		border-radius: 10px;
		padding: 8px 12px;
		display: flex;
		align-items: center;
		gap: 8px;
		z-index: 150;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
		font-size: 12px;
		white-space: nowrap;
	}

	.bulk-toolbar__count {
		color: rgba(255, 255, 255, 0.6);
		font-size: 12px;
	}

	.bulk-toolbar__divider {
		width: 1px;
		height: 20px;
		background: rgba(255, 255, 255, 0.1);
	}

	.bulk-toolbar__group {
		display: flex;
		gap: 4px;
	}

	.bulk-toolbar__btn {
		background: rgba(255, 255, 255, 0.08);
		border: none;
		border-radius: 6px;
		color: inherit;
		padding: 4px 10px;
		cursor: pointer;
		font-size: 12px;
		transition: background 0.1s;
	}

	.bulk-toolbar__btn:hover {
		background: rgba(255, 255, 255, 0.15);
	}

	.bulk-toolbar__btn--muted {
		color: rgba(255, 255, 255, 0.5);
	}

	.bulk-toolbar__btn--close {
		padding: 4px 8px;
	}

	.bulk-toolbar__popover {
		position: absolute;
		bottom: calc(100% + 8px);
		left: 50%;
		transform: translateX(-50%);
		background: var(--traek-node-bg, #1e1e2e);
		border: 1px solid rgba(255, 255, 255, 0.15);
		border-radius: 8px;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
		z-index: 10;
	}

	.bulk-toolbar__tags {
		list-style: none;
		margin: 0;
		padding: 6px;
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 120px;
	}

	.bulk-toolbar__tag-btn {
		width: 100%;
		text-align: left;
		padding: 6px 10px;
		background: none;
		border: none;
		border-radius: 4px;
		color: inherit;
		cursor: pointer;
		font-size: 12px;
	}

	.bulk-toolbar__tag-btn:hover {
		background: rgba(255, 255, 255, 0.08);
	}
</style>
