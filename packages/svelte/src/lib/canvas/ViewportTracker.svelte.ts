import type { Node, TraekEngineConfig } from '../TraekEngine.svelte';

/**
 * Viewport bounds in canvas pixel coordinates.
 */
export interface ViewportBounds {
	minX: number;
	maxX: number;
	minY: number;
	maxY: number;
}

/**
 * Tracks which nodes are visible in the viewport + buffer zone.
 * Used for DOM virtualization to render only visible nodes.
 */
export class ViewportTracker {
	/** Buffer zone in pixels around viewport (e.g. 200px) */
	public bufferPx: number;

	private config: TraekEngineConfig;

	constructor(config: TraekEngineConfig, bufferPx: number = 200) {
		this.config = config;
		this.bufferPx = bufferPx;
	}

	/**
	 * Calculate viewport bounds in canvas pixel coordinates.
	 * Takes into account scale and offset.
	 */
	getViewportBounds(
		viewportEl: HTMLElement | null,
		scale: number,
		offset: { x: number; y: number }
	): ViewportBounds | null {
		if (!viewportEl) return null;

		const w = viewportEl.clientWidth;
		const h = viewportEl.clientHeight;
		if (w <= 0 || h <= 0) return null;

		// Convert viewport screen coords to canvas coords
		// Canvas coords = (screen - offset) / scale
		const minX = (0 - offset.x) / scale - this.bufferPx;
		const maxX = (w - offset.x) / scale + this.bufferPx;
		const minY = (0 - offset.y) / scale - this.bufferPx;
		const maxY = (h - offset.y) / scale + this.bufferPx;

		return { minX, maxX, minY, maxY };
	}

	/**
	 * Check if a node is within the viewport bounds.
	 * Node position is in grid units, height is in pixels.
	 */
	isNodeInViewport(node: Node, bounds: ViewportBounds): boolean {
		const step = this.config.gridStep;
		const nodePxX = (node.metadata?.x ?? 0) * step;
		const nodePxY = (node.metadata?.y ?? 0) * step;
		const nodeWidth = this.config.nodeWidth;
		const nodeHeight = node.metadata?.height ?? this.config.nodeHeightDefault;

		// AABB (axis-aligned bounding box) intersection test
		const nodeRight = nodePxX + nodeWidth;
		const nodeBottom = nodePxY + nodeHeight;

		return !(
			nodeRight < bounds.minX ||
			nodePxX > bounds.maxX ||
			nodeBottom < bounds.minY ||
			nodePxY > bounds.maxY
		);
	}

	/**
	 * Get all visible node IDs in the viewport + buffer.
	 * Respects collapsed nodes (does not include hidden descendants).
	 */
	getVisibleNodeIds(
		nodes: Node[],
		collapsedNodes: Set<string>,
		viewportEl: HTMLElement | null,
		scale: number,
		offset: { x: number; y: number }
	): Set<string> {
		const bounds = this.getViewportBounds(viewportEl, scale, offset);
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		if (!bounds) return new Set();

		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		const visible = new Set<string>();
		const collapsedCache = this.buildCollapsedCache(nodes, collapsedNodes);

		for (const node of nodes) {
			// Skip thought nodes and collapsed descendants
			if (node.type === 'thought') continue;
			if (collapsedCache.get(node.id)) continue;

			if (this.isNodeInViewport(node, bounds)) {
				visible.add(node.id);
			}
		}

		return visible;
	}

	/**
	 * Build a cache of which nodes are in collapsed subtrees.
	 * A node is hidden if any ancestor in its primary parent chain is collapsed.
	 *
	 * Uses path-memoization so each node ID is visited at most once across all
	 * ancestor walks, giving O(n + edges) instead of O(n × depth).
	 */
	private buildCollapsedCache(nodes: Node[], collapsedNodes: Set<string>): Map<string, boolean> {
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		const cache = new Map<string, boolean>();
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		const nodeMap = new Map(nodes.map((n) => [n.id, n]));

		for (const node of nodes) {
			if (cache.has(node.id)) continue; // already computed via a previous ancestor walk

			// Walk UP the primary-parent chain collecting nodes not yet in cache.
			// Once we hit a cache entry or a definitive answer, propagate the result
			// back down to every node we visited in this walk.
			const path: string[] = [];
			let currentId: string = node.id;

			while (true) {
				if (cache.has(currentId)) {
					// Hit a pre-computed ancestor — propagate its hidden status to all
					// descendants we walked through in this pass.
					const inherited = cache.get(currentId)!;
					for (const id of path) cache.set(id, inherited);
					break;
				}

				const current = nodeMap.get(currentId);
				if (!current) {
					// Unknown node ID — treat as not hidden.
					for (const id of path) cache.set(id, false);
					break;
				}

				path.push(currentId);

				const primaryParentId = current.parentIds[0];
				if (!primaryParentId) {
					// Reached a root — none of these nodes are hidden.
					for (const id of path) cache.set(id, false);
					break;
				}

				if (collapsedNodes.has(primaryParentId)) {
					// The immediate parent of `currentId` is collapsed → currentId and
					// all descendants we walked (path) are hidden.
					for (const id of path) cache.set(id, true);
					break;
				}

				currentId = primaryParentId;
			}
		}

		return cache;
	}
}
