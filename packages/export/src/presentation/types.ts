export interface Slide {
	/** Index of this slide (0-based). */
	index: number;
	/** Total number of slides. */
	total: number;
	/** Which branch (thread) this slide belongs to. */
	branchIndex: number;
	/** Position within the branch. */
	positionInBranch: number;
	/** Total nodes in this branch. */
	branchLength: number;
	/** Role of the node. */
	role: 'user' | 'assistant' | 'system';
	/** Content of the node. */
	content: string;
	/** Node id. */
	nodeId: string;
}

export interface PresentationOptions {
	/**
	 * Whether to include system messages as slides.
	 * Default: false.
	 */
	includeSystem?: boolean;
}

export type PresentationListener = (slide: Slide | null) => void;
