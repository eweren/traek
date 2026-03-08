<script lang="ts">
	import type { AnnotationTool, AnnotationColor } from './types';
	import { ANNOTATION_COLOR_VALUES, STICKY_COLORS, MARKER_COLORS } from './types';

	let {
		annotateMode = $bindable(false),
		activeTool = $bindable<AnnotationTool>('sticky'),
		activeColor = $bindable<AnnotationColor>('yellow')
	}: {
		annotateMode?: boolean;
		activeTool?: AnnotationTool;
		activeColor?: AnnotationColor;
	} = $props();

	const toolColors: Record<AnnotationTool, AnnotationColor[]> = {
		sticky: STICKY_COLORS,
		marker: MARKER_COLORS,
		pin: STICKY_COLORS,
		eraser: []
	};

	const availableColors = $derived(toolColors[activeTool] ?? []);

	function selectTool(tool: AnnotationTool) {
		activeTool = tool;
		// Set sensible default color for the tool
		if (tool === 'sticky' || tool === 'pin') activeColor = 'yellow';
		else if (tool === 'marker') activeColor = 'amber';
	}
</script>

<!-- Annotate mode toggle button (fixed to bottom-left of canvas, next to zoom controls) -->
<button
	class="annotate-toggle"
	class:active={annotateMode}
	onclick={() => (annotateMode = !annotateMode)}
	title={annotateMode ? 'Exit annotation mode (A)' : 'Annotate canvas (A)'}
	aria-label={annotateMode ? 'Exit annotation mode' : 'Annotate canvas'}
	aria-pressed={annotateMode}
>
	<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
		<path
			d="M11 2L14 5L5 14H2V11L11 2Z"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
</button>

{#if annotateMode}
	<!-- Tool palette -->
	<div class="tool-palette" role="toolbar" aria-label="Annotation tools">
		<button
			class="tool-btn"
			class:active={activeTool === 'sticky'}
			onclick={() => selectTool('sticky')}
			title="Sticky note (1)"
			aria-label="Sticky note tool"
			aria-pressed={activeTool === 'sticky'}
		>
			📝
		</button>
		<button
			class="tool-btn"
			class:active={activeTool === 'marker'}
			onclick={() => selectTool('marker')}
			title="Highlight marker (2)"
			aria-label="Marker tool"
			aria-pressed={activeTool === 'marker'}
		>
			🖊
		</button>
		<button
			class="tool-btn"
			class:active={activeTool === 'pin'}
			onclick={() => selectTool('pin')}
			title="Region pin (3)"
			aria-label="Pin tool"
			aria-pressed={activeTool === 'pin'}
		>
			📍
		</button>
		<div class="tool-divider" role="separator"></div>
		<button
			class="tool-btn"
			class:active={activeTool === 'eraser'}
			onclick={() => selectTool('eraser')}
			title="Erase annotations (E)"
			aria-label="Eraser tool"
			aria-pressed={activeTool === 'eraser'}
		>
			🗑
		</button>

		{#if availableColors.length > 0}
			<div class="tool-divider" role="separator"></div>
			<div class="color-palette" role="group" aria-label="Color options">
				{#each availableColors as color (color)}
					<button
						class="color-btn"
						class:active={activeColor === color}
						style:background-color={ANNOTATION_COLOR_VALUES[color]}
						aria-label="Color: {color}"
						aria-pressed={activeColor === color}
						onclick={() => (activeColor = color)}
					></button>
				{/each}
			</div>
		{/if}
	</div>

	<!-- ARIA live region for mode announcement -->
	<div class="sr-only" role="status" aria-live="polite" aria-atomic="true">
		Annotation mode active. Click to create a {activeTool}.
	</div>
{/if}

<style>
	.annotate-toggle {
		width: 36px;
		height: 36px;
		border-radius: 6px;
		border: 1px solid var(--traek-node-border, #2a2a2a);
		background: var(--traek-node-bg, #161616);
		color: var(--traek-node-text, #dddddd);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.15s;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
	}

	.annotate-toggle:hover {
		background: var(--traek-input-button-bg, #00d8ff);
		color: var(--traek-input-button-text, #000000);
		border-color: var(--traek-input-button-bg, #00d8ff);
	}

	.annotate-toggle.active {
		background: #8b5cf6;
		color: #fff;
		border-color: #8b5cf6;
		box-shadow:
			0 0 0 2px rgba(139, 92, 246, 0.3),
			0 4px 12px rgba(0, 0, 0, 0.3);
	}

	.annotate-toggle:focus-visible {
		outline: 2px solid var(--traek-input-button-bg, #00d8ff);
		outline-offset: 2px;
	}

	.tool-palette {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		background: var(--traek-node-bg, #161616);
		border: 1px solid var(--traek-node-border, #2a2a2a);
		border-radius: 10px;
		padding: 8px 6px;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
		animation: palette-in 150ms ease;
	}

	@keyframes palette-in {
		from {
			opacity: 0;
			transform: translateX(-8px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	.tool-btn {
		width: 36px;
		height: 36px;
		border-radius: 6px;
		border: 1px solid transparent;
		background: transparent;
		color: var(--traek-node-text, #dddddd);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 18px;
		transition: all 0.1s;
	}

	.tool-btn:hover {
		background: rgba(255, 255, 255, 0.08);
	}

	.tool-btn.active {
		background: rgba(139, 92, 246, 0.2);
		border-color: #8b5cf6;
		color: #8b5cf6;
	}

	.tool-btn:focus-visible {
		outline: 2px solid var(--traek-input-button-bg, #00d8ff);
		outline-offset: 2px;
	}

	.tool-divider {
		width: 24px;
		height: 1px;
		background: var(--traek-node-border, #2a2a2a);
		margin: 2px 0;
	}

	.color-palette {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 2px 0;
	}

	.color-btn {
		width: 22px;
		height: 22px;
		border-radius: 50%;
		border: 2px solid transparent;
		cursor: pointer;
		padding: 0;
		transition: transform 0.1s;
	}

	.color-btn:hover {
		transform: scale(1.15);
	}

	.color-btn.active {
		border-color: rgba(255, 255, 255, 0.7);
		transform: scale(1.1);
	}

	.color-btn:focus-visible {
		outline: 2px solid var(--traek-input-button-bg, #00d8ff);
		outline-offset: 2px;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
	}

	@media (prefers-reduced-motion: reduce) {
		.tool-palette {
			animation: none;
		}
	}
</style>
