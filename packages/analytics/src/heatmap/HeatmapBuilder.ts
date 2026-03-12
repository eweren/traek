import type { ConversationSnapshot } from '@traek/core';
import type { HeatmapData, NodeHeatCell, BranchHeatCell } from './types.js';
import { analyzeFlow } from '../flow/FlowAnalyzer.js';

/**
 * Build branch exploration heatmap data from a conversation snapshot.
 *
 * "Heat" is determined by:
 * - **Node heat**: how many distinct branches pass through a node (connectivity).
 *   Nodes shared by many branches (e.g. early context nodes) are "hot".
 * - **Branch heat**: normalized branch length — longer branches indicate more
 *   sustained exploration.
 *
 * All intensities are normalized to [0, 1].
 */
export function buildHeatmap(snapshot: ConversationSnapshot): HeatmapData {
	const flow = analyzeFlow(snapshot);

	if (flow.nodeCount === 0) {
		return {
			nodes: [],
			branches: [],
			hottestNodeId: null,
			hottestBranchIndex: null,
			coldestLeafId: null
		};
	}

	const nodeMap = new Map(snapshot.nodes.map((n) => [n.id, n]));

	// Count how many branches pass through each node
	const branchCoverageOf = new Map<string, number>();
	for (const branch of flow.branches) {
		for (const nodeId of branch.nodeIds) {
			branchCoverageOf.set(nodeId, (branchCoverageOf.get(nodeId) ?? 0) + 1);
		}
	}

	// Build depth map
	const depthOf = new Map(flow.nodes.map((n) => [n.nodeId, n.depth]));

	// Compute max coverage for normalization
	const maxCoverage = Math.max(0, ...branchCoverageOf.values());

	const nodeHeatCells: NodeHeatCell[] = snapshot.nodes.map((n) => {
		const coverage = branchCoverageOf.get(n.id) ?? 0;
		return {
			nodeId: n.id,
			intensity: maxCoverage > 0 ? coverage / maxCoverage : 0,
			branchCoverage: coverage,
			depth: depthOf.get(n.id) ?? 0,
			x: n.metadata?.x ?? 0,
			y: n.metadata?.y ?? 0,
			role: n.role
		};
	});

	nodeHeatCells.sort((a, b) => b.intensity - a.intensity);

	// Branch heat: normalized by max branch length
	const maxBranchLength = Math.max(0, ...flow.branches.map((b) => b.length));

	const branchHeatCells: BranchHeatCell[] = flow.branches.map((b) => ({
		branchIndex: b.index,
		intensity: maxBranchLength > 0 ? b.length / maxBranchLength : 0,
		length: b.length,
		userTurns: b.userTurns,
		assistantTurns: b.assistantTurns,
		durationMs: b.durationMs
	}));

	branchHeatCells.sort((a, b) => b.intensity - a.intensity);

	// Identify hottest node (most branch coverage)
	const hottestNode = nodeHeatCells[0];
	const hottestNodeId = hottestNode ? hottestNode.nodeId : null;

	// Hottest branch
	const hottestBranch = branchHeatCells[0];
	const hottestBranchIndex = hottestBranch ? hottestBranch.branchIndex : null;

	// Coldest leaf: a leaf node that is covered by the fewest branches
	// (i.e. a dead-end exploration path)
	const leafIds = new Set(flow.nodes.filter((n) => n.childCount === 0).map((n) => n.nodeId));
	const leafHeatCells = nodeHeatCells.filter((c) => leafIds.has(c.nodeId));
	const coldestLeaf = leafHeatCells[leafHeatCells.length - 1];
	const coldestLeafId = coldestLeaf ? coldestLeaf.nodeId : null;

	// Unused variable suppression: nodeMap is available for future use
	void nodeMap;

	return {
		nodes: nodeHeatCells,
		branches: branchHeatCells,
		hottestNodeId,
		hottestBranchIndex,
		coldestLeafId
	};
}
