<script lang="ts">
	let {
		data,
		width = 600,
		height = 200
	}: {
		data: Array<{ date: string; revenue: number }>;
		width?: number;
		height?: number;
	} = $props();

	const PADDING = { top: 16, right: 16, bottom: 32, left: 48 };

	const innerW = $derived(width - PADDING.left - PADDING.right);
	const innerH = $derived(height - PADDING.top - PADDING.bottom);

	const maxRevenue = $derived(Math.max(...data.map((d) => d.revenue), 1));

	function xPos(i: number): number {
		if (data.length <= 1) return PADDING.left;
		return PADDING.left + (i / (data.length - 1)) * innerW;
	}

	function yPos(value: number): number {
		return PADDING.top + innerH - (value / maxRevenue) * innerH;
	}

	const linePath = $derived(
		data.map((d, i) => `${i === 0 ? 'M' : 'L'}${xPos(i)},${yPos(d.revenue)}`).join(' ')
	);

	const areaPath = $derived(
		data.length === 0
			? ''
			: [
					...data.map((d, i) => `${i === 0 ? 'M' : 'L'}${xPos(i)},${yPos(d.revenue)}`),
					`L${xPos(data.length - 1)},${PADDING.top + innerH}`,
					`L${PADDING.left},${PADDING.top + innerH}`,
					'Z'
				].join(' ')
	);

	const gridLines = $derived(
		Array.from({ length: 4 }, (_, i) => {
			const fraction = i / 3;
			return {
				y: PADDING.top + innerH * (1 - fraction),
				label: '$' + Math.round(maxRevenue * fraction)
			};
		})
	);

	// Hovered point
	let hoveredIndex = $state<number | null>(null);
	let svgEl = $state<SVGSVGElement | null>(null);

	function onMouseMove(e: MouseEvent) {
		if (!svgEl || data.length === 0) return;
		const rect = svgEl.getBoundingClientRect();
		const mouseX = ((e.clientX - rect.left) / rect.width) * width - PADDING.left;
		const ratio = Math.max(0, Math.min(1, mouseX / innerW));
		hoveredIndex = Math.round(ratio * (data.length - 1));
	}

	function onMouseLeave() {
		hoveredIndex = null;
	}
</script>

<div class="chart-wrapper">
	<svg
		bind:this={svgEl}
		{width}
		{height}
		viewBox="0 0 {width} {height}"
		class="chart"
		role="img"
		aria-label="Revenue chart"
		onmousemove={onMouseMove}
		onmouseleave={onMouseLeave}
	>
		<defs>
			<linearGradient id="area-gradient" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0%" stop-color="#00d8ff" stop-opacity="0.25" />
				<stop offset="100%" stop-color="#00d8ff" stop-opacity="0" />
			</linearGradient>
			<linearGradient id="line-gradient" x1="0" y1="0" x2="1" y2="0">
				<stop offset="0%" stop-color="#00d8ff" />
				<stop offset="100%" stop-color="#00ffa3" />
			</linearGradient>
		</defs>

		<!-- Grid lines -->
		{#each gridLines as grid, gi (gi)}
			<line
				x1={PADDING.left}
				y1={grid.y}
				x2={width - PADDING.right}
				y2={grid.y}
				stroke="rgba(255,255,255,0.04)"
				stroke-width="1"
			/>
			<text x={PADDING.left - 6} y={grid.y + 4} text-anchor="end" class="grid-label">
				{grid.label}
			</text>
		{/each}

		<!-- Area fill -->
		{#if data.length > 0}
			<path d={areaPath} fill="url(#area-gradient)" />

			<!-- Line -->
			<path
				d={linePath}
				fill="none"
				stroke="url(#line-gradient)"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>

			<!-- Data points -->
			{#each data as point, i (i)}
				<circle
					cx={xPos(i)}
					cy={yPos(point.revenue)}
					r={hoveredIndex === i ? 5 : 3}
					fill={hoveredIndex === i ? '#00d8ff' : 'transparent'}
					stroke="#00d8ff"
					stroke-width="2"
					class="data-point"
				/>
			{/each}
		{/if}

		<!-- Hover tooltip -->
		{#if hoveredIndex !== null && data[hoveredIndex]}
			{@const pt = data[hoveredIndex]}
			{@const px = xPos(hoveredIndex)}
			{@const py = yPos(pt.revenue)}
			<!-- Vertical line -->
			<line
				x1={px}
				y1={PADDING.top}
				x2={px}
				y2={PADDING.top + innerH}
				stroke="rgba(0,216,255,0.3)"
				stroke-width="1"
				stroke-dasharray="3 3"
			/>
			<!-- Tooltip card -->
			<g transform="translate({Math.min(px + 8, width - 120)}, {Math.max(py - 40, PADDING.top)})">
				<rect
					x="0"
					y="0"
					width="110"
					height="40"
					rx="6"
					fill="#1c1c1c"
					stroke="rgba(0,216,255,0.25)"
					stroke-width="1"
				/>
				<text x="8" y="14" class="tooltip-date">{pt.date}</text>
				<text x="8" y="30" class="tooltip-revenue">${pt.revenue.toFixed(2)}</text>
			</g>
		{/if}
	</svg>

	<!-- Accessible table fallback -->
	<table class="visually-hidden" aria-label="Revenue data table">
		<thead><tr><th>Date</th><th>Revenue</th></tr></thead>
		<tbody>
			{#each data as point, pi (pi)}
				<tr><td>{point.date}</td><td>${point.revenue.toFixed(2)}</td></tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.chart-wrapper {
		position: relative;
		width: 100%;
	}

	.chart {
		width: 100%;
		height: auto;
		overflow: visible;
	}

	.grid-label {
		font-size: 10px;
		fill: var(--pg-text-muted, #666);
		font-family: 'Space Mono', monospace;
	}

	.tooltip-date {
		font-size: 10px;
		fill: var(--pg-text-muted, #888);
		font-family: 'Space Grotesk', sans-serif;
	}

	.tooltip-revenue {
		font-size: 13px;
		font-weight: 600;
		fill: #00d8ff;
		font-family: 'Space Grotesk', sans-serif;
	}

	.data-point {
		transition: r 0.1s ease;
	}

	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}
</style>
