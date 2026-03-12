<script lang="ts">
	import type { PinAnnotation } from './types';
	import { ANNOTATION_COLOR_VALUES } from './types';

	let {
		annotation,
		onUpdate,
		onDelete,
		onDragStart
	}: {
		annotation: PinAnnotation;
		onUpdate: (id: string, update: Partial<PinAnnotation>) => void;
		onDelete: (id: string) => void;
		onDragStart?: (id: string, e: MouseEvent) => void;
	} = $props();

	let hovered = $state(false);
	let pinned = $state(false);
	let editing = $state(false);
	let labelEl = $state<HTMLInputElement | null>(null);
	let commentEl = $state<HTMLTextAreaElement | null>(null);

	const color = $derived(ANNOTATION_COLOR_VALUES[annotation.color]);

	function handlePinMouseDown(e: MouseEvent) {
		e.stopPropagation();
		onDragStart?.(annotation.id, e);
	}

	function handlePinClick(e: MouseEvent) {
		e.stopPropagation();
		pinned = !pinned;
	}

	function handleDblClick(e: MouseEvent) {
		e.stopPropagation();
		editing = true;
		pinned = true;
		setTimeout(() => labelEl?.focus(), 0);
	}

	function handleLabelKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			commentEl?.focus();
		}
		if (e.key === 'Escape') {
			editing = false;
		}
		e.stopPropagation();
	}

	function handleCommentKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			editing = false;
		}
		e.stopPropagation();
	}

	const showCallout = $derived(hovered || pinned);
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="pin-container"
	style:left="{annotation.x}px"
	style:top="{annotation.y}px"
	onmouseenter={() => (hovered = true)}
	onmouseleave={() => (hovered = false)}
>
	{#if showCallout}
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="callout" class:editing onmousedown={(e) => e.stopPropagation()}>
			{#if editing}
				<input
					bind:this={labelEl}
					type="text"
					class="callout-label-input"
					value={annotation.label}
					placeholder="Label…"
					aria-label="Pin label"
					oninput={(e) => onUpdate(annotation.id, { label: (e.target as HTMLInputElement).value })}
					onkeydown={handleLabelKeydown}
				/>
				<textarea
					bind:this={commentEl}
					class="callout-comment-input"
					value={annotation.comment}
					placeholder="Comment (optional)…"
					aria-label="Pin comment"
					aria-multiline="true"
					maxlength="300"
					oninput={(e) =>
						onUpdate(annotation.id, { comment: (e.target as HTMLTextAreaElement).value })}
					onkeydown={handleCommentKeydown}
					onblur={() => (editing = false)}
				></textarea>
			{:else}
				{#if annotation.label}
					<div class="callout-label">{annotation.label}</div>
				{/if}
				{#if annotation.comment}
					<div class="callout-comment">{annotation.comment}</div>
				{/if}
				{#if !annotation.label && !annotation.comment}
					<div class="callout-empty">No label</div>
				{/if}
			{/if}
			<div class="callout-actions">
				<button
					class="callout-edit-btn"
					aria-label="Edit pin"
					onclick={() => {
						editing = true;
						setTimeout(() => labelEl?.focus(), 0);
					}}
				>
					Edit
				</button>
				<button
					class="callout-delete-btn"
					aria-label="Delete pin"
					onclick={() => onDelete(annotation.id)}
				>
					×
				</button>
			</div>
		</div>
	{/if}

	<!-- Pin marker dot -->
	<button
		class="pin-dot"
		style:background-color={color}
		aria-label="Pin: {annotation.label || 'unnamed'}"
		ondblclick={handleDblClick}
		onclick={handlePinClick}
		onmousedown={handlePinMouseDown}
	>
		<span class="pin-icon" aria-hidden="true">📍</span>
	</button>
</div>

<style>
	.pin-container {
		position: absolute;
		z-index: 10;
		transform: translate(-8px, -28px);
	}

	.pin-dot {
		width: 28px;
		height: 28px;
		border-radius: 50% 50% 50% 0;
		transform: rotate(-45deg);
		border: 2px solid rgba(0, 0, 0, 0.3);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		z-index: 1;
		padding: 0;
	}

	.pin-dot:focus-visible {
		outline: 2px solid var(--traek-node-active-border, #00d8ff);
		outline-offset: 2px;
	}

	.pin-icon {
		transform: rotate(45deg);
		font-size: 14px;
		display: block;
	}

	.callout {
		position: absolute;
		bottom: 34px;
		left: 50%;
		transform: translateX(-50%);
		min-width: 160px;
		max-width: 240px;
		background: var(--traek-node-bg, #1e1e1e);
		border: 1px solid var(--traek-node-border, #333);
		border-radius: 8px;
		padding: 10px 12px;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
		animation: callout-in 150ms ease;
		z-index: 11;
	}

	@keyframes callout-in {
		from {
			opacity: 0;
			transform: translateX(-50%) translateY(4px);
		}
		to {
			opacity: 1;
			transform: translateX(-50%) translateY(0);
		}
	}

	.callout-label {
		font-size: 13px;
		font-weight: 600;
		color: var(--traek-node-text, #ddd);
		margin-bottom: 4px;
	}

	.callout-comment {
		font-size: 12px;
		color: var(--traek-thought-header-accent, #888);
		line-height: 1.4;
	}

	.callout-empty {
		font-size: 12px;
		color: var(--traek-thought-header-accent, #888);
		font-style: italic;
	}

	.callout-label-input {
		width: 100%;
		background: transparent;
		border: none;
		border-bottom: 1px solid var(--traek-node-border, #333);
		color: var(--traek-node-text, #ddd);
		font-size: 13px;
		font-weight: 600;
		padding: 2px 0 4px;
		margin-bottom: 6px;
		outline: none;
	}

	.callout-comment-input {
		width: 100%;
		background: transparent;
		border: none;
		color: var(--traek-node-text, #aaa);
		font-size: 12px;
		resize: none;
		min-height: 48px;
		max-height: 100px;
		padding: 2px 0;
		outline: none;
		font-family: inherit;
	}

	.callout-actions {
		display: flex;
		justify-content: flex-end;
		gap: 6px;
		margin-top: 8px;
	}

	.callout-edit-btn,
	.callout-delete-btn {
		background: transparent;
		border: 1px solid var(--traek-node-border, #333);
		border-radius: 4px;
		color: var(--traek-node-text, #aaa);
		font-size: 11px;
		cursor: pointer;
		padding: 2px 8px;
	}

	.callout-edit-btn:hover {
		background: var(--traek-node-border, #333);
	}

	.callout-delete-btn:hover {
		background: #c00;
		color: #fff;
		border-color: #c00;
	}

	.callout-edit-btn:focus-visible,
	.callout-delete-btn:focus-visible {
		outline: 2px solid var(--traek-node-active-border, #00d8ff);
		outline-offset: 2px;
	}

	@media (prefers-reduced-motion: reduce) {
		.callout {
			animation: none;
		}
	}
</style>
