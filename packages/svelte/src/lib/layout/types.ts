export type LayoutMode =
	| 'tree-vertical' // Default: children below parent (existing behavior)
	| 'tree-horizontal' // Children to the right of parent
	| 'compact' // Tight spacing, minimize whitespace
	| 'force-directed' // Spring simulation
	| 'mind-map' // Radial tree from center root
	| 'timeline' // Linear x-axis by tree depth, y by sibling order
	| 'radial'; // Concentric rings by depth

export interface NodePosition {
	nodeId: string;
	x: number; // grid units
	y: number; // grid units
}

export interface LayoutConfig {
	nodeWidthGrid: number; // nodeWidth / gridStep
	nodeHGrid: number; // nodeHeightDefault / gridStep
	gapXGrid: number; // layoutGapX / gridStep
	gapYGrid: number; // layoutGapY / gridStep
}

export interface LayoutInput {
	nodes: import('@traek/core').Node[];
	childrenMap: Map<string | null, string[]>; // parentId (or null) -> childIds
	nodeMap: Map<string, import('@traek/core').Node>;
	config: LayoutConfig;
}

export const LAYOUT_MODE_LABELS: Record<LayoutMode, string> = {
	'tree-vertical': 'Tree (Vertical)',
	'tree-horizontal': 'Tree (Horizontal)',
	compact: 'Compact',
	'force-directed': 'Force-Directed',
	'mind-map': 'Mind Map',
	timeline: 'Timeline',
	radial: 'Radial'
};
