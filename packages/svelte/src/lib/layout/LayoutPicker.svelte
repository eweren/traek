<script lang="ts">
	import type { TraekEngine } from '../TraekEngine.svelte';
	import type { LayoutMode } from './types';
	import { LAYOUT_MODE_LABELS } from './types';

	let {
		engine,
		onApply
	}: {
		engine: TraekEngine;
		onApply?: (mode: LayoutMode) => void;
	} = $props();

	const modes = Object.entries(LAYOUT_MODE_LABELS) as [LayoutMode, string][];

	function apply(mode: LayoutMode) {
		engine.applyLayout(mode);
		onApply?.(mode);
	}
</script>

<div class="layout-picker" role="toolbar" aria-label="Layout mode">
	{#each modes as [mode, label] (mode)}
		<button
			class="layout-btn"
			class:active={engine.layoutMode === mode}
			onclick={() => apply(mode)}
			title={label}
			aria-pressed={engine.layoutMode === mode}
		>
			{label}
		</button>
	{/each}
</div>

<style>
	.layout-picker {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
		padding: 6px;
	}

	.layout-btn {
		padding: 4px 10px;
		border-radius: 6px;
		border: 1px solid rgba(255, 255, 255, 0.1);
		background: rgba(255, 255, 255, 0.05);
		color: rgba(255, 255, 255, 0.7);
		cursor: pointer;
		font-size: 11px;
		white-space: nowrap;
		transition: background 0.1s;
	}

	.layout-btn:hover {
		background: rgba(255, 255, 255, 0.12);
		color: white;
	}

	.layout-btn.active {
		background: rgba(255, 255, 255, 0.18);
		color: white;
		border-color: rgba(255, 255, 255, 0.25);
	}
</style>
