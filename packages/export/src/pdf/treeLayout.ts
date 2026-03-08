import type { SerializedNode } from '@traek/core';
import type { TreeLayout, TreeLayoutNode } from './types.js';

/**
 * Compute a column-based Reingold-Tilford-inspired layout for the conversation tree.
 * Each branch occupies a distinct column; rows are BFS depth levels.
 */
export function computeTreeLayout(nodes: SerializedNode[]): TreeLayout {
	if (nodes.length === 0) return { nodes: [], edges: [], cols: 0, rows: 0 };

	const nodeMap = new Map<string, SerializedNode>();
	for (const n of nodes) nodeMap.set(n.id, n);

	// Build children map
	const childrenMap = new Map<string, string[]>();
	for (const n of nodes) {
		for (const pid of n.parentIds) {
			if (!childrenMap.has(pid)) childrenMap.set(pid, []);
			childrenMap.get(pid)!.push(n.id);
		}
	}

	// Find roots (no parents, or parents not in nodeMap)
	const roots = nodes.filter((n) => n.parentIds.length === 0 || !nodeMap.has(n.parentIds[0]!));

	const layoutNodes: TreeLayoutNode[] = [];
	const edges: Array<{ from: string; to: string }> = [];
	let maxCol = 0;

	// DFS to assign col/row
	function dfs(id: string, row: number, colStart: number): number {
		const node = nodeMap.get(id);
		if (!node) return colStart;

		const children = childrenMap.get(id) ?? [];

		let col: number;
		if (children.length === 0) {
			col = colStart;
			maxCol = Math.max(maxCol, col);
		} else {
			// Recurse children first; center this node over its children
			let currentCol = colStart;
			const childCols: number[] = [];
			for (const childId of children) {
				const assignedCol = dfs(childId, row + 1, currentCol);
				childCols.push(assignedCol);
				currentCol = assignedCol + 1;
				edges.push({ from: id, to: childId });
			}
			// Center parent over its children span
			col = Math.floor((childCols[0]! + childCols[childCols.length - 1]!) / 2);
		}

		layoutNodes.push({
			id,
			role: node.role,
			content: node.content ?? '',
			col,
			row,
			parentId: node.parentIds[0] ?? null
		});

		return col;
	}

	let colCursor = 0;
	for (const root of roots) {
		const usedCol = dfs(root.id, 0, colCursor);
		colCursor = usedCol + 1;
	}

	const rows = layoutNodes.reduce((m, n) => Math.max(m, n.row), 0) + 1;

	return { nodes: layoutNodes, edges, cols: maxCol + 1, rows };
}
