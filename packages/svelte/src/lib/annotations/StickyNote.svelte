<script lang="ts">
	import type { StickyAnnotation, AnnotationColor } from './types';
	import { ANNOTATION_COLOR_VALUES, STICKY_COLORS } from './types';

	let {
		annotation,
		onUpdate,
		onDelete,
		onDragStart
	}: {
		annotation: StickyAnnotation;
		onUpdate: (id: string, update: Partial<StickyAnnotation>) => void;
		onDelete: (id: string) => void;
		onDragStart?: (id: string, e: MouseEvent) => void;
	} = $props();

	let editing = $state(false);
	let showColorPicker = $state(false);
	let textareaEl = $state<HTMLTextAreaElement | null>(null);

	const bgColor = $derived(ANNOTATION_COLOR_VALUES[annotation.color]);

	function startEdit() {
		editing = true;
		setTimeout(() => textareaEl?.focus(), 0);
	}

	function handleTextChange(e: Event) {
		onUpdate(annotation.id, { text: (e.target as HTMLTextAreaElement).value });
	}

	function handleColorSelect(color: AnnotationColor) {
		onUpdate(annotation.id, { color });
		showColorPicker = false;
	}

	function handleHeaderMouseDown(e: MouseEvent) {
		if ((e.target as HTMLElement).closest('button')) return;
		e.stopPropagation();
		onDragStart?.(annotation.id, e);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			editing = false;
			(e.currentTarget as HTMLElement).closest<HTMLElement>('[role="note"]')?.focus();
		}
		// Delete empty note on Backspace/Delete
		if ((e.key === 'Delete' || e.key === 'Backspace') && annotation.text === '') {
			onDelete(annotation.id);
		}
		e.stopPropagation();
	}

	function handleArticleKeydown(e: KeyboardEvent) {
		if (e.key === 'Delete' || e.key === 'Backspace') {
			if (!editing) onDelete(annotation.id);
		}
		if (e.key === 'Enter' && !editing) {
			startEdit();
		}
	}
</script>

<article
	role="note"
	tabindex="0"
	aria-label="Annotation: {annotation.text || 'Empty note'}"
	aria-roledescription="draggable note"
	style:left="{annotation.x}px"
	style:top="{annotation.y}px"
	style:width="{annotation.width}px"
	style:transform="rotate({annotation.rotation}deg)"
	style:background-color={bgColor}
	class="sticky-note"
	ondblclick={startEdit}
	onkeydown={handleArticleKeydown}
>
	<header
		aria-label="Note header, drag to move"
		class="sticky-header"
		onmousedown={handleHeaderMouseDown}
		role="presentation"
	>
		<div class="grip-icon" aria-hidden="true">⠿</div>

		<div class="color-picker-wrapper">
			<button
				class="color-dot"
				style:background-color={bgColor}
				style:border-color="rgba(0,0,0,0.2)"
				aria-label="Change color"
				onclick={() => (showColorPicker = !showColorPicker)}
			></button>
			{#if showColorPicker}
				<div class="color-popover" onmousedown={(e) => e.stopPropagation()}>
					{#each STICKY_COLORS as color (color)}
						<button
							class="color-swatch"
							style:background-color={ANNOTATION_COLOR_VALUES[color]}
							aria-label="Color: {color}"
							class:active={color === annotation.color}
							onclick={() => handleColorSelect(color)}
						></button>
					{/each}
				</div>
			{/if}
		</div>

		<button class="delete-btn" aria-label="Delete note" onclick={() => onDelete(annotation.id)}>
			×
		</button>
	</header>

	{#if editing}
		<textarea
			bind:this={textareaEl}
			value={annotation.text}
			placeholder="Type your note here…"
			class="sticky-textarea"
			aria-label="Note content"
			aria-multiline="true"
			oninput={handleTextChange}
			onkeydown={handleKeydown}
			onblur={() => (editing = false)}
		></textarea>
	{:else}
		<div
			class="sticky-content"
			class:empty={!annotation.text}
			onclick={startEdit}
			onkeydown={handleKeydown}
			role="presentation"
		>
			{annotation.text || 'Click to edit…'}
		</div>
	{/if}
</article>

<style>
	.sticky-note {
		position: absolute;
		min-height: 80px;
		border-radius: 4px;
		box-shadow:
			2px 3px 8px rgba(0, 0, 0, 0.25),
			0 1px 2px rgba(0, 0, 0, 0.1);
		display: flex;
		flex-direction: column;
		user-select: none;
		cursor: default;
		transform-origin: center center;
		z-index: 8;
		overflow: hidden;
	}

	.sticky-note:focus-visible {
		outline: 2px solid var(--traek-node-active-border, #00d8ff);
		outline-offset: 2px;
	}

	.sticky-header {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 4px 6px;
		background: rgba(0, 0, 0, 0.08);
		cursor: grab;
		min-height: 28px;
	}

	.sticky-header:active {
		cursor: grabbing;
	}

	.grip-icon {
		font-size: 12px;
		color: rgba(0, 0, 0, 0.35);
		flex-shrink: 0;
	}

	.color-picker-wrapper {
		position: relative;
		flex-shrink: 0;
	}

	.color-dot {
		width: 14px;
		height: 14px;
		border-radius: 50%;
		border: 1.5px solid;
		cursor: pointer;
		padding: 0;
		display: block;
	}

	.color-dot:focus-visible {
		outline: 2px solid rgba(0, 0, 0, 0.5);
		outline-offset: 2px;
	}

	.color-popover {
		position: absolute;
		top: 20px;
		left: 0;
		display: flex;
		gap: 4px;
		background: white;
		border: 1px solid rgba(0, 0, 0, 0.15);
		border-radius: 6px;
		padding: 6px;
		z-index: 100;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
	}

	.color-swatch {
		width: 18px;
		height: 18px;
		border-radius: 50%;
		border: 2px solid transparent;
		cursor: pointer;
		padding: 0;
	}

	.color-swatch.active {
		border-color: rgba(0, 0, 0, 0.5);
	}

	.color-swatch:focus-visible {
		outline: 2px solid rgba(0, 0, 0, 0.5);
		outline-offset: 2px;
	}

	.delete-btn {
		margin-left: auto;
		width: 20px;
		height: 20px;
		border: none;
		background: transparent;
		color: rgba(0, 0, 0, 0.45);
		font-size: 16px;
		line-height: 1;
		cursor: pointer;
		border-radius: 3px;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		flex-shrink: 0;
	}

	.delete-btn:hover {
		background: rgba(0, 0, 0, 0.1);
		color: rgba(0, 0, 0, 0.7);
	}

	.delete-btn:focus-visible {
		outline: 2px solid rgba(0, 0, 0, 0.5);
		outline-offset: 2px;
	}

	.sticky-textarea {
		flex: 1;
		width: 100%;
		min-height: 60px;
		max-height: 240px;
		border: none;
		background: transparent;
		resize: none;
		padding: 8px;
		font-size: 13px;
		line-height: 1.5;
		color: rgba(0, 0, 0, 0.8);
		font-family: inherit;
		outline: none;
	}

	.sticky-content {
		flex: 1;
		padding: 8px;
		font-size: 13px;
		line-height: 1.5;
		color: rgba(0, 0, 0, 0.8);
		white-space: pre-wrap;
		word-break: break-word;
		cursor: text;
		min-height: 60px;
	}

	.sticky-content.empty {
		color: rgba(0, 0, 0, 0.35);
		font-style: italic;
	}

	@media (prefers-reduced-motion: reduce) {
		.sticky-note {
			transform: none !important;
		}
	}
</style>
