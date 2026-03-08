import type { ConversationSnapshot, SerializedNode } from '@traek/core';
import type { BranchMetrics, FlowMetrics, NodeFlowMetrics } from './types.js';

function median(values: number[]): number | null {
	if (values.length === 0) return null;
	const sorted = [...values].sort((a, b) => a - b);
	const mid = Math.floor(sorted.length / 2);
	return sorted.length % 2 === 0 ? (sorted[mid - 1]! + sorted[mid]!) / 2 : sorted[mid]!;
}

/**
 * Compute flow metrics for a conversation snapshot.
 *
 * All metrics are computed synchronously in O(n) passes over the node list.
 */
export function analyzeFlow(snapshot: ConversationSnapshot): FlowMetrics {
	const nodes = snapshot.nodes;
	if (nodes.length === 0) {
		return {
			nodeCount: 0,
			rootCount: 0,
			leafCount: 0,
			branchingNodeCount: 0,
			branchCount: 0,
			maxDepth: 0,
			avgDepth: 0,
			avgBranchingFactor: 0,
			avgResponseTimeMs: null,
			medianResponseTimeMs: null,
			countByRole: { user: 0, assistant: 0, system: 0 },
			branches: [],
			nodes: []
		};
	}

	const nodeMap = new Map<string, SerializedNode>();
	for (const n of nodes) nodeMap.set(n.id, n);

	// Build children map
	const childrenOf = new Map<string, string[]>();
	for (const n of nodes) {
		if (!childrenOf.has(n.id)) childrenOf.set(n.id, []);
		for (const pid of n.parentIds) {
			if (!childrenOf.has(pid)) childrenOf.set(pid, []);
			childrenOf.get(pid)!.push(n.id);
		}
	}

	const roots = nodes.filter((n) => n.parentIds.length === 0 || !nodeMap.has(n.parentIds[0]!));
	const leafIds = new Set(
		nodes.filter((n) => (childrenOf.get(n.id) ?? []).length === 0).map((n) => n.id)
	);
	const branchingNodes = nodes.filter((n) => (childrenOf.get(n.id) ?? []).length >= 2);

	// Compute depth for each node via BFS from roots
	const depthOf = new Map<string, number>();
	const queue: Array<{ id: string; depth: number }> = roots.map((r) => ({ id: r.id, depth: 0 }));
	const visited = new Set<string>();
	while (queue.length > 0) {
		const item = queue.shift()!;
		if (visited.has(item.id)) continue;
		visited.add(item.id);
		depthOf.set(item.id, item.depth);
		for (const cid of childrenOf.get(item.id) ?? []) {
			if (!visited.has(cid)) queue.push({ id: cid, depth: item.depth + 1 });
		}
	}

	// Compute per-node response times
	const responseTimes: number[] = [];
	const nodeMetrics: NodeFlowMetrics[] = [];

	for (const n of nodes) {
		const depth = depthOf.get(n.id) ?? 0;
		const children = childrenOf.get(n.id) ?? [];
		const parentId = n.parentIds[0];
		const parent = parentId ? nodeMap.get(parentId) : undefined;

		let responseTimeMs: number | null = null;
		if (parent && parent.createdAt && n.createdAt) {
			responseTimeMs = Math.max(0, n.createdAt - parent.createdAt);
			if (responseTimeMs >= 0) responseTimes.push(responseTimeMs);
		}

		nodeMetrics.push({
			nodeId: n.id,
			role: n.role,
			childCount: children.length,
			depth,
			responseTimeMs,
			contentLength: (n.content ?? '').length
		});
	}

	// Extract branches (root-to-leaf DFS)
	const branches: BranchMetrics[] = [];
	let branchIdx = 0;

	const dfsBranch = (id: string, path: SerializedNode[]): void => {
		const node = nodeMap.get(id);
		if (!node) return;
		const newPath = [...path, node];
		const children = childrenOf.get(id) ?? [];
		if (children.length === 0) {
			// Leaf — record branch
			const first = newPath[0]!;
			const last = newPath[newPath.length - 1]!;
			const durationMs =
				first.createdAt && last.createdAt ? Math.max(0, last.createdAt - first.createdAt) : null;
			branches.push({
				index: branchIdx++,
				length: newPath.length,
				depth: newPath.length - 1,
				durationMs,
				userTurns: newPath.filter((n) => n.role === 'user').length,
				assistantTurns: newPath.filter((n) => n.role === 'assistant').length,
				nodeIds: newPath.map((n) => n.id)
			});
		} else {
			for (const cid of children) dfsBranch(cid, newPath);
		}
	};
	for (const root of roots) dfsBranch(root.id, []);

	// Aggregate
	const depths = nodeMetrics.map((n) => n.depth);
	const maxDepth = depths.length > 0 ? Math.max(...depths) : 0;
	const avgDepth = depths.length > 0 ? depths.reduce((a, b) => a + b, 0) / depths.length : 0;

	const avgBranchingFactor =
		branchingNodes.length > 0
			? branchingNodes.reduce((sum, n) => sum + (childrenOf.get(n.id) ?? []).length, 0) /
				branchingNodes.length
			: 0;

	const avgResponseTimeMs =
		responseTimes.length > 0
			? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
			: null;

	const countByRole = { user: 0, assistant: 0, system: 0 };
	for (const n of nodes) {
		if (n.role === 'user') countByRole.user++;
		else if (n.role === 'assistant') countByRole.assistant++;
		else countByRole.system++;
	}

	return {
		nodeCount: nodes.length,
		rootCount: roots.length,
		leafCount: leafIds.size,
		branchingNodeCount: branchingNodes.length,
		branchCount: branches.length,
		maxDepth,
		avgDepth,
		avgBranchingFactor,
		avgResponseTimeMs,
		medianResponseTimeMs: median(responseTimes),
		countByRole,
		branches,
		nodes: nodeMetrics
	};
}
