<script lang="ts">
	import type { NodeTypeAction } from './node-types/types.js';
	import type { Node, TraekEngine } from './TraekEngine.svelte';

	let {
		actions,
		node,
		engine,
		x,
		y,
		nodeWidth
	}: {
		actions: NodeTypeAction[];
		node: Node;
		engine: TraekEngine;
		x: number;
		y: number;
		nodeWidth: number;
	} = $props();
</script>

{#if actions.length > 0}
	<div class="traek-node-toolbar" style:left="{x}px" style:top="{y}px" style:width="{nodeWidth}px">
		{#each actions as action (action.id)}
			<button
				type="button"
				class="traek-node-toolbar__btn"
				title={action.label}
				onclick={(e) => {
					e.stopPropagation();
					action.handler(node, engine);
				}}
			>
				{#if action.icon}<span class="traek-node-toolbar__icon">{action.icon}</span>{/if}
				<span>{action.label}</span>
			</button>
		{/each}
	</div>
{/if}

<style>
	.traek-node-toolbar {
		position: absolute;
		display: flex;
		gap: 4px;
		padding: 4px;
		background: var(--traek-toolbar-bg, rgba(30, 30, 30, 0.95));
		backdrop-filter: blur(12px);
		border: 1px solid var(--traek-toolbar-border, #444444);
		border-radius: 8px;
		box-shadow: 0 4px 12px var(--traek-toolbar-shadow, rgba(0, 0, 0, 0.3));
		pointer-events: auto;
		z-index: 10;
	}

	.traek-node-toolbar__btn {
		display: flex;
		align-items: center;
		gap: 4px;
		padding: 4px 8px;
		border: none;
		border-radius: 6px;
		background: transparent;
		color: var(--traek-toolbar-text, #dddddd);
		font-size: 12px;
		cursor: pointer;
		white-space: nowrap;
		transition: background 0.1s;
	}

	.traek-node-toolbar__btn:hover {
		background: var(--traek-toolbar-btn-hover, rgba(255, 255, 255, 0.1));
	}

	.traek-node-toolbar__icon {
		font-size: 1.1em;
	}
</style>
