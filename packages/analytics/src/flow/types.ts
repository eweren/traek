export interface BranchMetrics {
	/** Unique index of this branch (root-to-leaf path). */
	index: number;
	/** Number of nodes in this branch. */
	length: number;
	/** Depth of the deepest node (same as length for a linear branch). */
	depth: number;
	/** Duration in ms from first to last node's createdAt (null if timestamps missing). */
	durationMs: number | null;
	/** Number of user turns in this branch. */
	userTurns: number;
	/** Number of assistant turns in this branch. */
	assistantTurns: number;
	/** Node ids in order from root to leaf. */
	nodeIds: string[];
}

export interface NodeFlowMetrics {
	nodeId: string;
	role: 'user' | 'assistant' | 'system';
	/** Number of direct children. */
	childCount: number;
	/** Depth of this node in its tree (root = 0). */
	depth: number;
	/** Time since parent's createdAt in ms (null for roots or if timestamps missing). */
	responseTimeMs: number | null;
	/** Content length in characters. */
	contentLength: number;
}

export interface FlowMetrics {
	/** Total number of nodes. */
	nodeCount: number;
	/** Number of root nodes (nodes with no parents in the snapshot). */
	rootCount: number;
	/** Number of leaf nodes (nodes with no children). */
	leafCount: number;
	/** Number of branching nodes (nodes with 2+ children). */
	branchingNodeCount: number;
	/** Total number of root-to-leaf paths (branches). */
	branchCount: number;
	/** Maximum tree depth (root = 0). */
	maxDepth: number;
	/** Average depth across all nodes. */
	avgDepth: number;
	/** Average number of children for branching nodes. */
	avgBranchingFactor: number;
	/** Average time between parent and child node in ms (null if no timestamps). */
	avgResponseTimeMs: number | null;
	/** Median time between parent and child node in ms (null if no timestamps). */
	medianResponseTimeMs: number | null;
	/** Node count by role. */
	countByRole: Record<'user' | 'assistant' | 'system', number>;
	/** Per-branch metrics. */
	branches: BranchMetrics[];
	/** Per-node metrics. */
	nodes: NodeFlowMetrics[];
}
