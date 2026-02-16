<script lang="ts">
	import type { Node, TraekEngineConfig } from '../TraekEngine.svelte';
	import type { ConnectionDragState } from './connectionPath.js';
	import { getConnectionPath } from './connectionPath.js';

	let {
		nodes,
		config,
		activeAncestorIds,
		hoveredNodeId = null,
		hoveredConnection = $bindable(null),
		connectionDrag,
		collapsedNodes = new Set(),
		onDeleteConnection
	}: {
		nodes: Node[];
		config: TraekEngineConfig;
		activeAncestorIds: Set<string> | null;
		hoveredNodeId?: string | null;
		hoveredConnection: { parentId: string; childId: string } | null;
		connectionDrag: ConnectionDragState | null;
		collapsedNodes?: Set<string>;
		onDeleteConnection: (parentId: string, childId: string) => void;
	} = $props();

	// Cursor position in canvas coordinates for the delete icon
	let hoverPos = $state<{ x: number; y: number } | null>(null);

	/**
	 * Build a Map for O(1) node lookup and cache collapsed subtree checks.
	 * This replaces the expensive nodes.find() and repeated isInCollapsedSubtree() calls.
	 */
	const nodeMap = $derived(new Map(nodes.map((n) => [n.id, n])));

	const collapsedCache = $derived.by(() => {
		const cache = new Map<string, boolean>();
		for (const node of nodes) {
			cache.set(node.id, isInCollapsedSubtree(node.id));
		}
		return cache;
	});

	/**
	 * Check if a node should be hidden because one of its ancestors is collapsed.
	 * A node is hidden if any ancestor in its primary parent chain is collapsed.
	 */
	function isInCollapsedSubtree(nodeId: string): boolean {
		const visited = new Set<string>();
		let current = nodeMap.get(nodeId);
		while (current) {
			if (visited.has(current.id)) return false;
			visited.add(current.id);
			const primaryParentId = current.parentIds[0];
			if (!primaryParentId) return false;
			if (collapsedNodes.has(primaryParentId)) return true;
			current = nodeMap.get(primaryParentId);
		}
		return false;
	}
</script>

<!-- Single-pass rendering: compute path once, render all variants -->
{#each nodes as node (node.id)}
	{#if node.parentIds.length > 0 && node.type !== 'thought'}
		{@const isNodeHidden = collapsedCache.get(node.id) ?? false}
		{#if !isNodeHidden}
			{@const nodeX = (node.metadata?.x ?? 0) * config.gridStep}
			{@const nodeY = (node.metadata?.y ?? 0) * config.gridStep}
			{@const nodeH = node.metadata?.height ?? config.nodeHeightDefault}
			{#each node.parentIds as pid (pid)}
				{@const parent = nodeMap.get(pid)}
				{#if parent}
					{@const parentX = (parent.metadata?.x ?? 0) * config.gridStep}
					{@const parentY = (parent.metadata?.y ?? 0) * config.gridStep}
					{@const parentH = parent.metadata?.height ?? config.nodeHeightDefault}
					{@const pathD = getConnectionPath(
						parentX,
						parentY,
						config.nodeWidth,
						parentH,
						nodeX,
						nodeY,
						config.nodeWidth,
						nodeH
					)}
					{@const isOnActivePath =
						activeAncestorIds !== null &&
						activeAncestorIds.has(parent.id) &&
						activeAncestorIds.has(node.id)}
					{@const isHoverAdjacent =
						hoveredNodeId !== null && (parent.id === hoveredNodeId || node.id === hoveredNodeId)}

					<!-- Normal connection (not on active path) -->
					{#if !isOnActivePath}
						<path
							class="connection"
							class:faded={activeAncestorIds !== null && !isHoverAdjacent}
							class:hover-adjacent={isHoverAdjacent}
							d={pathD}
						/>
					{/if}

					<!-- Highlighted connection (on active path) -->
					{#if isOnActivePath}
						<path class="connection connection--highlight" d={pathD} />
					{/if}

					<!-- Hit area for interaction (always rendered) -->
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<path
						class="connection-hit-area"
						d={pathD}
						onmouseenter={() => (hoveredConnection = { parentId: pid, childId: node.id })}
						onmousemove={(e) => {
							const svg = (e.target as SVGElement).ownerSVGElement;
							if (!svg) return;
							const pt = svg.createSVGPoint();
							pt.x = e.clientX;
							pt.y = e.clientY;
							const ctm = svg.getScreenCTM();
							if (!ctm) return;
							const svgPt = pt.matrixTransform(ctm.inverse());
							hoverPos = { x: svgPt.x - 25000, y: svgPt.y - 25000 };
						}}
						onmouseleave={() => {
							hoveredConnection = null;
							hoverPos = null;
						}}
						onclick={(e) => {
							e.stopPropagation();
							onDeleteConnection(pid, node.id);
							hoveredConnection = null;
							hoverPos = null;
						}}
					/>
				{/if}
			{/each}
		{/if}
	{/if}
{/each}

<!-- Delete highlight for hovered connection -->
{#if hoveredConnection}
	{@const hc = hoveredConnection}
	{@const hChild = nodeMap.get(hc.childId)}
	{@const hParent = nodeMap.get(hc.parentId)}
	{#if hChild && hParent}
		{@const hPathD = getConnectionPath(
			(hParent.metadata?.x ?? 0) * config.gridStep,
			(hParent.metadata?.y ?? 0) * config.gridStep,
			config.nodeWidth,
			hParent.metadata?.height ?? config.nodeHeightDefault,
			(hChild.metadata?.x ?? 0) * config.gridStep,
			(hChild.metadata?.y ?? 0) * config.gridStep,
			config.nodeWidth,
			hChild.metadata?.height ?? config.nodeHeightDefault
		)}
		<path class="connection connection--delete-highlight" d={hPathD} />
		{#if hoverPos}
			<g class="connection-delete-icon" transform="translate({hoverPos.x}, {hoverPos.y - 16})">
				<circle r="10" />
				<line x1="-4" y1="-4" x2="4" y2="4" />
				<line x1="4" y1="-4" x2="-4" y2="4" />
			</g>
		{/if}
	{/if}
{/if}

<!-- Connection drag rubber band -->
{#if connectionDrag}
	{@const sx = connectionDrag.sourceX}
	{@const sy = connectionDrag.sourceY}
	{@const cx = connectionDrag.currentX}
	{@const cy = connectionDrag.currentY}
	{@const dy = Math.abs(cy - sy)}
	{@const cpOffset = Math.max(40, dy * 0.5)}
	<path
		class="connection-rubber-band"
		d="M {sx} {sy} C {sx} {sy +
			(connectionDrag.sourcePortType === 'output' ? cpOffset : -cpOffset)}, {cx} {cy +
			(connectionDrag.sourcePortType === 'output' ? -cpOffset : cpOffset)}, {cx} {cy}"
	/>
{/if}

<style>
	.connection {
		transition: opacity 0.2s ease;
	}

	.connection.faded {
		opacity: 0.2;
	}

	.connection.hover-adjacent {
		stroke: var(--traek-connection-hover, rgba(255, 255, 255, 0.6));
		stroke-width: 2;
		opacity: 1;
	}

	.connection--highlight {
		stroke: var(--traek-connection-highlight, #00d8ff);
		stroke-width: 2.5;
	}

	.connection--delete-highlight {
		stroke: var(--traek-connection-delete, #ff3e00);
		stroke-width: 3;
		stroke-dasharray: 8 6;
		animation: connection-delete-march 0.4s linear infinite;
		filter: drop-shadow(0 0 6px rgba(255, 62, 0, 0.5));
	}

	@keyframes connection-delete-march {
		to {
			stroke-dashoffset: -14;
		}
	}

	.connection-hit-area {
		stroke: transparent;
		stroke-width: 14;
		fill: none;
		pointer-events: stroke;
		cursor: pointer;
	}

	.connection-rubber-band {
		stroke: var(--traek-connection-highlight, #00d8ff);
		stroke-width: 2;
		stroke-dasharray: 6 4;
		fill: none;
		opacity: 0.8;
	}

	.connection-delete-icon circle {
		fill: rgba(255, 62, 0, 0.9);
	}

	.connection-delete-icon line {
		stroke: #ffffff;
		stroke-width: 2;
		stroke-linecap: round;
	}
</style>
