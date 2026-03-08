<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		nodeId,
		onError,
		children
	}: {
		nodeId: string;
		onError?: (error: Error, nodeId: string) => void;
		children: Snippet;
	} = $props();
</script>

<svelte:boundary
	onerror={(error) => {
		onError?.(error instanceof Error ? error : new Error(String(error)), nodeId);
	}}
>
	{@render children()}
	{#snippet failed(error, reset)}
		<div class="node-error-boundary" data-node-id={nodeId} role="alert">
			<div class="node-error-icon" aria-hidden="true">⚠</div>
			<div class="node-error-body">
				<span class="node-error-title">Node failed to render</span>
				{#if error instanceof Error && error.message}
					<span class="node-error-detail">{error.message}</span>
				{/if}
			</div>
			<button type="button" class="node-error-reset" onclick={reset}>Retry</button>
		</div>
	{/snippet}
</svelte:boundary>

<style>
	@layer base {
		.node-error-boundary {
			display: flex;
			align-items: center;
			gap: 8px;
			padding: 12px 14px;
			background: var(--traek-error-bg, rgba(239, 68, 68, 0.08));
			border: 1px solid var(--traek-error-border-color, rgba(239, 68, 68, 0.25));
			border-radius: 8px;
			margin: 8px;
			font-size: 12px;
			color: var(--traek-error-text, #ef4444);
		}

		.node-error-icon {
			font-size: 14px;
			flex-shrink: 0;
		}

		.node-error-body {
			flex: 1;
			min-width: 0;
			display: flex;
			flex-direction: column;
			gap: 2px;
		}

		.node-error-title {
			font-weight: 500;
		}

		.node-error-detail {
			font-size: 10px;
			opacity: 0.75;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.node-error-reset {
			flex-shrink: 0;
			padding: 4px 10px;
			border-radius: 4px;
			border: 1px solid currentColor;
			background: transparent;
			color: currentColor;
			font-size: 11px;
			cursor: pointer;
			font: inherit;
			transition: background 0.15s;
		}

		.node-error-reset:hover {
			background: rgba(255, 255, 255, 0.06);
		}

		.node-error-reset:focus-visible {
			outline: 2px solid currentColor;
			outline-offset: 2px;
		}
	}
</style>
