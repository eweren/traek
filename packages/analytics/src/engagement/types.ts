export interface ContentStats {
	/** Average content length in characters. */
	avgLength: number;
	/** Median content length in characters. */
	medianLength: number;
	/** Maximum content length in characters. */
	maxLength: number;
	/** Minimum content length in characters (excluding empty). */
	minLength: number;
	/** Total characters across all nodes of this role. */
	totalChars: number;
}

export interface EngagementMetrics {
	/** Engagement score in [0, 100] — higher = richer conversation. */
	score: number;

	/** Content stats per role. */
	contentByRole: {
		user: ContentStats;
		assistant: ContentStats;
		system: ContentStats;
	};

	/** Average assistant-to-user content length ratio.
	 *  > 1 means assistant writes more than user (typical for in-depth answers). */
	responseElaborationRatio: number;

	/** Branching rate: branching nodes / total nodes. Higher = more exploration. */
	branchingRate: number;

	/**
	 * Exploration diversity: number of unique branches relative to tree depth.
	 * = branchCount / maxDepth. Higher = more parallel exploration.
	 */
	explorationDiversity: number;

	/** Average conversation velocity: nodes created per minute (null if no timestamps). */
	nodesPerMinute: number | null;

	/** Tags present across all nodes (deduplicated). */
	uniqueTags: string[];

	/** Number of nodes with content that appears to be code (contains ``` or language blocks). */
	codeNodeCount: number;

	/** Fraction of assistant turns with content longer than 500 chars (in-depth answers). */
	deepAnswerRate: number;
}
