<script lang="ts">
	import type { MarkerAnnotation } from './types';
	import { ANNOTATION_COLOR_VALUES } from './types';

	let {
		annotation,
		selected = false,
		onSelect,
		onDelete
	}: {
		annotation: MarkerAnnotation;
		selected?: boolean;
		onSelect?: (id: string) => void;
		onDelete: (id: string) => void;
	} = $props();

	const color = $derived(ANNOTATION_COLOR_VALUES[annotation.color]);

	/** Build an SVG path string from the annotation points using Catmull-Rom splines. */
	function buildPath(pts: Array<{ x: number; y: number }>): string {
		if (pts.length < 2) return '';
		if (pts.length === 2) return `M ${pts[0].x} ${pts[0].y} L ${pts[1].x} ${pts[1].y}`;

		let d = `M ${pts[0].x} ${pts[0].y}`;
		for (let i = 0; i < pts.length - 1; i++) {
			const p0 = pts[Math.max(i - 1, 0)];
			const p1 = pts[i];
			const p2 = pts[i + 1];
			const p3 = pts[Math.min(i + 2, pts.length - 1)];
			// Catmull-Rom to cubic Bezier conversion
			const cp1x = p1.x + (p2.x - p0.x) / 6;
			const cp1y = p1.y + (p2.y - p0.y) / 6;
			const cp2x = p2.x - (p3.x - p1.x) / 6;
			const cp2y = p2.y - (p3.y - p1.y) / 6;
			d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
		}
		return d;
	}

	const pathD = $derived(buildPath(annotation.points));

	// Compute bounding box for hit detection padding
	const bbox = $derived.by(() => {
		if (annotation.points.length === 0) return null;
		let minX = Infinity,
			maxX = -Infinity,
			minY = Infinity,
			maxY = -Infinity;
		for (const p of annotation.points) {
			minX = Math.min(minX, p.x);
			maxX = Math.max(maxX, p.x);
			minY = Math.min(minY, p.y);
			maxY = Math.max(maxY, p.y);
		}
		return { minX, maxX, minY, maxY };
	});
</script>

<g class="marker-group" class:selected>
	{#if pathD}
		<!-- Invisible wider hit area -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<path
			d={pathD}
			fill="none"
			stroke="transparent"
			stroke-width={annotation.strokeWidth + 12}
			stroke-linecap="round"
			stroke-linejoin="round"
			class="hit-area"
			onclick={(e) => {
				e.stopPropagation();
				onSelect?.(annotation.id);
			}}
		/>
		<!-- Visible marker path -->
		<path
			d={pathD}
			fill="none"
			stroke={color}
			stroke-width={annotation.strokeWidth}
			stroke-linecap="round"
			stroke-linejoin="round"
			opacity={selected ? 0.65 : 0.45}
			class="marker-path"
		/>

		{#if selected && bbox}
			<!-- Delete button when selected -->
			<foreignObject x={bbox.maxX + 8} y={bbox.minY - 8} width="28" height="28">
				<button
					class="marker-delete-btn"
					aria-label="Delete marker"
					onclick={(e) => {
						e.stopPropagation();
						onDelete(annotation.id);
					}}>×</button
				>
			</foreignObject>
		{/if}
	{/if}
</g>

<style>
	.hit-area {
		cursor: pointer;
	}

	.marker-path {
		pointer-events: none;
		transition: opacity 0.1s;
	}

	.marker-group:hover .marker-path {
		opacity: 0.65;
	}

	.marker-delete-btn {
		width: 24px;
		height: 24px;
		border-radius: 50%;
		border: 1px solid rgba(255, 255, 255, 0.3);
		background: #333;
		color: #fff;
		font-size: 14px;
		line-height: 1;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
	}

	.marker-delete-btn:hover {
		background: #c00;
	}

	.marker-delete-btn:focus-visible {
		outline: 2px solid #00d8ff;
		outline-offset: 2px;
	}
</style>
