<script lang="ts">
	import type { TraekEngine } from '../TraekEngine.svelte';
	import type {
		Annotation,
		AnnotationTool,
		AnnotationColor,
		StickyAnnotation,
		MarkerAnnotation,
		PinAnnotation
	} from './types';
	import { ANNOTATION_COLOR_VALUES } from './types';
	import StickyNote from './StickyNote.svelte';
	import MarkerPath from './MarkerPath.svelte';
	import RegionPin from './RegionPin.svelte';

	let {
		engine,
		annotateMode = false,
		activeTool = 'sticky',
		activeColor = 'yellow',
		scale = 1,
		offsetX = 0,
		offsetY = 0
	}: {
		engine: TraekEngine;
		annotateMode: boolean;
		activeTool: AnnotationTool;
		activeColor: AnnotationColor;
		scale: number;
		offsetX: number;
		offsetY: number;
	} = $props();

	// Transient drawing state for marker
	let isDrawing = $state(false);
	let drawingPoints = $state<Array<{ x: number; y: number }>>([]);

	// Dragging state
	let draggingId = $state<string | null>(null);
	let dragStart = $state<{ mx: number; my: number; ax: number; ay: number } | null>(null);

	// Selected marker id (for delete button)
	let selectedMarkerId = $state<string | null>(null);

	/** Convert a mouse event's client position to canvas-space coordinates. */
	function toCanvasCoords(e: MouseEvent): { x: number; y: number } {
		const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
		const x = (e.clientX - rect.left - offsetX) / scale;
		const y = (e.clientY - rect.top - offsetY) / scale;
		return { x, y };
	}

	function handleLayerMouseDown(e: MouseEvent) {
		if (!annotateMode) return;
		// Don't steal events from annotation elements themselves
		if ((e.target as HTMLElement).closest('.sticky-note, .pin-container')) return;

		if (activeTool === 'marker') {
			const { x, y } = toCanvasCoords(e);
			isDrawing = true;
			drawingPoints = [{ x, y }];
			e.preventDefault();
		}
	}

	function handleLayerMouseMove(e: MouseEvent) {
		if (!isDrawing) return;
		const { x, y } = toCanvasCoords(e);
		const last = drawingPoints[drawingPoints.length - 1];
		const dx = x - last.x;
		const dy = y - last.y;
		if (dx * dx + dy * dy > 16) {
			// >4px distance
			drawingPoints = [...drawingPoints, { x, y }];
		}
	}

	function handleLayerMouseUp(e: MouseEvent) {
		if (isDrawing) {
			isDrawing = false;
			if (drawingPoints.length >= 2) {
				// Check minimum distance
				const first = drawingPoints[0];
				const last = drawingPoints[drawingPoints.length - 1];
				const totalDist = Math.sqrt(Math.pow(last.x - first.x, 2) + Math.pow(last.y - first.y, 2));
				if (totalDist >= 10 || drawingPoints.length > 3) {
					const marker: MarkerAnnotation = {
						id: crypto.randomUUID(),
						type: 'marker',
						points: simplifyPath(drawingPoints, 2),
						color: activeColor,
						strokeWidth: 8,
						createdAt: new Date().toISOString()
					};
					engine.addAnnotation(marker);
				}
			}
			drawingPoints = [];
			return;
		}

		if (!annotateMode) return;
		if ((e.target as HTMLElement).closest('.sticky-note, .pin-container, button')) return;

		const { x, y } = toCanvasCoords(e);

		if (activeTool === 'sticky') {
			// Check no node nearby (simplified — just create at click location)
			const sticky: StickyAnnotation = {
				id: crypto.randomUUID(),
				type: 'sticky',
				x,
				y,
				width: 200,
				height: 120,
				color: activeColor,
				text: '',
				rotation: (Math.random() - 0.5) * 6,
				createdAt: new Date().toISOString()
			};
			engine.addAnnotation(sticky);
		} else if (activeTool === 'pin') {
			const pin: PinAnnotation = {
				id: crypto.randomUUID(),
				type: 'pin',
				x,
				y,
				label: '',
				comment: '',
				color: activeColor,
				createdAt: new Date().toISOString()
			};
			engine.addAnnotation(pin);
		} else if (activeTool === 'eraser') {
			// Erase annotations near the click point (within 30px)
			const radius = 30 / scale;
			const toDelete = engine.annotations
				.filter((a) => {
					if (a.type === 'sticky') return Math.abs(a.x - x) < radius && Math.abs(a.y - y) < radius;
					if (a.type === 'pin') return Math.abs(a.x - x) < radius && Math.abs(a.y - y) < radius;
					if (a.type === 'marker') {
						return a.points.some((p) => Math.abs(p.x - x) < radius && Math.abs(p.y - y) < radius);
					}
					return false;
				})
				.map((a) => a.id);
			for (const id of toDelete) engine.deleteAnnotation(id);
		}
	}

	function handleAnnotationDragStart(id: string, e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		const ann = engine.annotations.find((a) => a.id === id);
		if (!ann || (ann.type !== 'sticky' && ann.type !== 'pin')) return;
		draggingId = id;
		dragStart = { mx: e.clientX, my: e.clientY, ax: ann.x, ay: ann.y };
	}

	function handleWindowMouseMove(e: MouseEvent) {
		if (!draggingId || !dragStart) return;
		const dx = (e.clientX - dragStart.mx) / scale;
		const dy = (e.clientY - dragStart.my) / scale;
		engine.updateAnnotation(draggingId, {
			x: dragStart.ax + dx,
			y: dragStart.ay + dy
		} as Partial<Annotation>);
	}

	function handleWindowMouseUp() {
		draggingId = null;
		dragStart = null;
	}

	/** Ramer-Douglas-Peucker path simplification. */
	function simplifyPath(
		pts: Array<{ x: number; y: number }>,
		epsilon: number
	): Array<{ x: number; y: number }> {
		if (pts.length <= 2) return pts;
		let maxDist = 0;
		let maxIdx = 0;
		const start = pts[0];
		const end = pts[pts.length - 1];
		for (let i = 1; i < pts.length - 1; i++) {
			const d = perpDist(pts[i], start, end);
			if (d > maxDist) {
				maxDist = d;
				maxIdx = i;
			}
		}
		if (maxDist > epsilon) {
			const left = simplifyPath(pts.slice(0, maxIdx + 1), epsilon);
			const right = simplifyPath(pts.slice(maxIdx), epsilon);
			return [...left.slice(0, -1), ...right];
		}
		return [start, end];
	}

	function perpDist(
		p: { x: number; y: number },
		a: { x: number; y: number },
		b: { x: number; y: number }
	): number {
		const dx = b.x - a.x;
		const dy = b.y - a.y;
		if (dx === 0 && dy === 0) return Math.hypot(p.x - a.x, p.y - a.y);
		return Math.abs(dy * p.x - dx * p.y + b.x * a.y - b.y * a.x) / Math.hypot(dx, dy);
	}

	const stickies = $derived(
		engine.annotations.filter((a): a is StickyAnnotation => a.type === 'sticky')
	);
	const markers = $derived(
		engine.annotations.filter((a): a is MarkerAnnotation => a.type === 'marker')
	);
	const pins = $derived(engine.annotations.filter((a): a is PinAnnotation => a.type === 'pin'));

	// Build in-progress SVG path string
	function buildInProgressPath(pts: Array<{ x: number; y: number }>): string {
		if (pts.length < 2) return '';
		return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
	}

	const inProgressPath = $derived(buildInProgressPath(drawingPoints));
	const markerColor = $derived(ANNOTATION_COLOR_VALUES[activeColor] ?? '#fbbf24');

	// Touch long-press state (600ms threshold)
	let longPressTimer = $state<ReturnType<typeof setTimeout> | null>(null);
	let longPressPos = $state<{ x: number; y: number; cx: number; cy: number } | null>(null);
	let contextMenuPos = $state<{ cx: number; cy: number; x: number; y: number } | null>(null);

	function toCanvasCoordsFromTouch(
		t: Touch,
		el: HTMLElement
	): { x: number; y: number; cx: number; cy: number } {
		const rect = el.getBoundingClientRect();
		const x = (t.clientX - rect.left - offsetX) / scale;
		const y = (t.clientY - rect.top - offsetY) / scale;
		return { x, y, cx: t.clientX - rect.left, cy: t.clientY - rect.top };
	}

	function handleTouchStart(e: TouchEvent) {
		if (e.touches.length !== 1) return;
		if ((e.target as HTMLElement).closest('.sticky-note, .pin-container, button')) return;
		const el = e.currentTarget as HTMLElement;
		const coords = toCanvasCoordsFromTouch(e.touches[0], el);
		longPressPos = coords;
		longPressTimer = setTimeout(() => {
			contextMenuPos = longPressPos;
			longPressPos = null;
		}, 600);
	}

	function handleTouchMove(_e: TouchEvent) {
		if (longPressTimer) {
			clearTimeout(longPressTimer);
			longPressTimer = null;
		}
	}

	function handleTouchEnd() {
		if (longPressTimer) {
			clearTimeout(longPressTimer);
			longPressTimer = null;
		}
	}

	function handleContextMenuCreate(type: 'sticky' | 'marker' | 'pin') {
		if (!contextMenuPos) return;
		const { x, y } = contextMenuPos;
		if (type === 'sticky') {
			engine.addAnnotation({
				id: crypto.randomUUID(),
				type: 'sticky',
				x,
				y,
				width: 200,
				height: 120,
				color: 'yellow',
				text: '',
				rotation: (Math.random() - 0.5) * 6,
				createdAt: new Date().toISOString()
			});
		} else if (type === 'marker') {
			// For marker via context menu, create a small default path
			engine.addAnnotation({
				id: crypto.randomUUID(),
				type: 'marker',
				points: [
					{ x, y },
					{ x: x + 40, y }
				],
				color: activeColor,
				strokeWidth: 8,
				createdAt: new Date().toISOString()
			});
		} else if (type === 'pin') {
			engine.addAnnotation({
				id: crypto.randomUUID(),
				type: 'pin',
				x,
				y,
				label: '',
				comment: '',
				color: activeColor,
				createdAt: new Date().toISOString()
			});
		}
		contextMenuPos = null;
	}
</script>

<svelte:window onmousemove={handleWindowMouseMove} onmouseup={handleWindowMouseUp} />

<!-- Touch long-press context menu (shown even outside annotate mode) -->
{#if contextMenuPos}
	<div
		class="longpress-overlay"
		onmousedown={() => (contextMenuPos = null)}
		ontouchstart={() => (contextMenuPos = null)}
		role="presentation"
	>
		<div
			class="longpress-menu"
			style:left="{contextMenuPos.cx}px"
			style:top="{contextMenuPos.cy}px"
			role="menu"
			aria-label="Insert annotation"
			onmousedown={(e) => e.stopPropagation()}
		>
			<button role="menuitem" onclick={() => handleContextMenuCreate('sticky')}>📝 Note here</button
			>
			<button role="menuitem" onclick={() => handleContextMenuCreate('marker')}
				>🖊 Marker here</button
			>
			<button role="menuitem" onclick={() => handleContextMenuCreate('pin')}>📍 Pin here</button>
		</div>
	</div>
{/if}

<div
	class="annotation-layer"
	class:annotate-mode={annotateMode}
	onmousedown={handleLayerMouseDown}
	onmousemove={handleLayerMouseMove}
	onmouseup={handleLayerMouseUp}
	ontouchstart={handleTouchStart}
	ontouchmove={handleTouchMove}
	ontouchend={handleTouchEnd}
	role="presentation"
>
	<!-- SVG layer for markers (z-index: 5, below stickies) -->
	<svg class="marker-layer" aria-hidden="true">
		{#each markers as ann (ann.id)}
			<MarkerPath
				annotation={ann}
				selected={selectedMarkerId === ann.id}
				onSelect={(id) => (selectedMarkerId = selectedMarkerId === id ? null : id)}
				onDelete={(id) => {
					engine.deleteAnnotation(id);
					selectedMarkerId = null;
				}}
			/>
		{/each}

		<!-- In-progress drawing path -->
		{#if isDrawing && inProgressPath}
			<path
				d={inProgressPath}
				fill="none"
				stroke={markerColor}
				stroke-width="8"
				stroke-linecap="round"
				stroke-linejoin="round"
				opacity="0.45"
				pointer-events="none"
			/>
		{/if}
	</svg>

	<!-- Sticky notes (z-index: 8) -->
	{#each stickies as ann (ann.id)}
		<StickyNote
			annotation={ann}
			onUpdate={(id, update) => engine.updateAnnotation(id, update as Partial<Annotation>)}
			onDelete={(id) => engine.deleteAnnotation(id)}
			onDragStart={handleAnnotationDragStart}
		/>
	{/each}

	<!-- Pins (z-index: 10, topmost) -->
	{#each pins as ann (ann.id)}
		<RegionPin
			annotation={ann}
			onUpdate={(id, update) => engine.updateAnnotation(id, update as Partial<Annotation>)}
			onDelete={(id) => engine.deleteAnnotation(id)}
			onDragStart={handleAnnotationDragStart}
		/>
	{/each}
</div>

<style>
	.annotation-layer {
		position: absolute;
		inset: 0;
		pointer-events: none;
		overflow: visible;
	}

	.annotation-layer.annotate-mode {
		pointer-events: all;
		cursor: crosshair;
	}

	.marker-layer {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		overflow: visible;
		pointer-events: none;
		z-index: 5;
	}

	.annotate-mode .marker-layer {
		pointer-events: all;
	}

	/* Allow interaction with annotation elements even in annotate mode */
	:global(.annotation-layer .sticky-note),
	:global(.annotation-layer .pin-container) {
		pointer-events: all;
	}

	.longpress-overlay {
		position: absolute;
		inset: 0;
		z-index: 50;
	}

	.longpress-menu {
		position: absolute;
		transform: translate(-50%, -50%);
		background: var(--traek-node-bg, #1e1e1e);
		border: 1px solid var(--traek-node-border, #333);
		border-radius: 8px;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
		display: flex;
		flex-direction: column;
		overflow: hidden;
		min-width: 140px;
	}

	.longpress-menu button {
		background: transparent;
		border: none;
		color: var(--traek-node-text, #ddd);
		font-size: 13px;
		padding: 10px 14px;
		text-align: left;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.longpress-menu button:hover {
		background: rgba(255, 255, 255, 0.07);
	}

	.longpress-menu button:focus-visible {
		outline: 2px solid var(--traek-input-button-bg, #00d8ff);
		outline-offset: -2px;
	}
</style>
