<script lang="ts">
	import type { Node, TraekEngine } from '../TraekEngine.svelte';
	import { getNodeTags, getTagConfig } from './tagUtils';

	let { node, engine }: { node: Node; engine?: TraekEngine } = $props();

	const tags = $derived(getNodeTags(node));

	function handleRemoveTag(tag: string) {
		if (engine) {
			engine.removeTag(node.id, tag);
		}
	}
</script>

{#if tags.length > 0}
	<div class="tag-badges">
		{#each tags as tag (tag)}
			{@const config = getTagConfig(tag)}
			<button
				type="button"
				class="tag-badge"
				style:color={config.color}
				style:background={config.bgColor}
				style:border-color={config.color}
				onclick={(e) => {
					e.stopPropagation();
					handleRemoveTag(tag);
				}}
				title="Click to remove tag"
			>
				<span class="tag-badge-label">{config.label}</span>
				<span class="tag-badge-remove">×</span>
			</button>
		{/each}
	</div>
{/if}

<style>
	.tag-badges {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
		padding: 6px 14px 8px;
		border-bottom: 1px solid var(--traek-thought-divider, rgba(255, 255, 255, 0.06));
	}

	.tag-badge {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		padding: 3px 8px;
		border: 1px solid;
		border-radius: 999px;
		font-size: 10px;
		font-weight: 500;
		letter-spacing: 0.3px;
		cursor: pointer;
		transition:
			opacity 0.15s,
			transform 0.15s;
		text-transform: uppercase;
	}

	.tag-badge:hover {
		opacity: 0.8;
		transform: scale(1.05);
	}

	.tag-badge:focus-visible {
		outline: 2px solid var(--traek-input-button-bg, #00d8ff);
		outline-offset: 2px;
	}

	.tag-badge-label {
		line-height: 1;
	}

	.tag-badge-remove {
		font-size: 14px;
		line-height: 1;
		opacity: 0.7;
	}

	.tag-badge:hover .tag-badge-remove {
		opacity: 1;
	}
</style>
