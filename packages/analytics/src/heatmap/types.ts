/** Heatmap intensity value in [0, 1] where 1 = hottest. */
export type HeatIntensity = number;

export interface NodeHeatCell {
	nodeId: string;
	/** Normalized exploration intensity [0, 1]. */
	intensity: HeatIntensity;
	/** Number of branches that include this node. */
	branchCoverage: number;
	/** Depth level of this node (root = 0). */
	depth: number;
	/** Spatial x coordinate from node metadata. */
	x: number;
	/** Spatial y coordinate from node metadata. */
	y: number;
	/** Role of the node. */
	role: 'user' | 'assistant' | 'system';
}

export interface BranchHeatCell {
	/** Branch index (root-to-leaf path index). */
	branchIndex: number;
	/** Normalized intensity relative to the longest branch [0, 1]. */
	intensity: HeatIntensity;
	/** Length of this branch. */
	length: number;
	/** Number of user turns in this branch. */
	userTurns: number;
	/** Number of assistant turns in this branch. */
	assistantTurns: number;
	/** Duration from first to last node in ms (null if no timestamps). */
	durationMs: number | null;
}

export interface HeatmapData {
	/** Per-node heatmap cells, sorted by intensity descending. */
	nodes: NodeHeatCell[];
	/** Per-branch heatmap cells, sorted by intensity descending. */
	branches: BranchHeatCell[];
	/** Node id of the "hottest" (most explored) node. */
	hottestNodeId: string | null;
	/** Index of the most-explored branch. */
	hottestBranchIndex: number | null;
	/** Node id of the least-explored (dead-end) leaf. */
	coldestLeafId: string | null;
}
