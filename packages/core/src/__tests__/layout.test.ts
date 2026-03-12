import { describe, it, expect } from 'vitest';
import { computeLayout, buildLayoutInput } from '../layout.js';
import type { Node } from '../types.js';
import type { LayoutConfig, LayoutInput, LayoutMode } from '../layout.js';

// ── Fixtures ──────────────────────────────────────────────────────────────────

const DEFAULT_CONFIG: LayoutConfig = {
	nodeWidthGrid: 18, // ~350px / 20px gridStep
	nodeHGrid: 5, // ~100px / 20px
	gapXGrid: 2,
	gapYGrid: 2
};

function makeNode(id: string, parentIds: string[] = [], extra: Partial<Node> = {}): Node {
	return {
		id,
		parentIds,
		role: 'user',
		type: 'text',
		metadata: { x: 0, y: 0 },
		...extra
	};
}

function buildInput(nodes: Node[], config = DEFAULT_CONFIG): LayoutInput {
	const childrenIdMap = new Map<string | null, string[]>();

	for (const n of nodes) {
		const parentId = n.parentIds[0] ?? null;
		const arr = childrenIdMap.get(parentId) ?? [];
		arr.push(n.id);
		childrenIdMap.set(parentId, arr);
	}

	return buildLayoutInput(nodes, childrenIdMap, config);
}

function extractPositions(nodes: Node[], mode: LayoutMode) {
	const input = buildInput(nodes);
	return computeLayout(mode, input);
}

// Simple chain: root → child → grandchild
function makeChain(length = 3): Node[] {
	const nodes: Node[] = [];
	for (let i = 0; i < length; i++) {
		nodes.push(makeNode(`n${i}`, i === 0 ? [] : [`n${i - 1}`]));
	}
	return nodes;
}

// Root with N children (branching)
function makeStar(childCount = 3): Node[] {
	const root = makeNode('root', []);
	const children = Array.from({ length: childCount }, (_, i) => makeNode(`c${i}`, ['root']));
	return [root, ...children];
}

// ── buildLayoutInput ──────────────────────────────────────────────────────────

describe('buildLayoutInput', () => {
	it('builds correct nodeMap', () => {
		const nodes = makeChain(2);
		const input = buildInput(nodes);
		expect(input.nodeMap.size).toBe(2);
		expect(input.nodeMap.get('n0')).toBeDefined();
	});

	it('builds correct childrenMap', () => {
		const nodes = makeStar(3);
		const input = buildInput(nodes);
		const rootChildren = input.childrenMap.get('root') ?? [];
		expect(rootChildren).toHaveLength(3);
	});

	it('thought nodes are included in nodeMap', () => {
		const nodes = [makeNode('r', []), makeNode('t', ['r'], { type: 'thought' })];
		const input = buildInput(nodes);
		expect(input.nodeMap.has('t')).toBe(true);
	});
});

// ── Empty / single node ───────────────────────────────────────────────────────

const ALL_MODES: LayoutMode[] = [
	'tree-vertical',
	'tree-horizontal',
	'compact',
	'force-directed',
	'mind-map',
	'timeline',
	'radial'
];

describe.each(ALL_MODES)('computeLayout — %s', (mode) => {
	it('returns empty array for empty input', () => {
		const input = buildInput([]);
		expect(computeLayout(mode, input)).toEqual([]);
	});

	it('returns one position for a single root node', () => {
		const positions = extractPositions([makeNode('root')], mode);
		expect(positions).toHaveLength(1);
		expect(positions[0].nodeId).toBe('root');
	});

	it('returns correct count for a 3-node chain', () => {
		const positions = extractPositions(makeChain(3), mode);
		expect(positions).toHaveLength(3);
	});

	it('all node IDs are present in output', () => {
		const nodes = makeStar(4);
		const positions = extractPositions(nodes, mode);
		const ids = new Set(positions.map((p) => p.nodeId));
		for (const n of nodes) {
			expect(ids.has(n.id)).toBe(true);
		}
	});

	it('excludes thought nodes from layout', () => {
		const nodes = [
			makeNode('r', []),
			makeNode('c', ['r']),
			makeNode('t', ['r'], { type: 'thought' })
		];
		const positions = extractPositions(nodes, mode);
		const ids = positions.map((p) => p.nodeId);
		expect(ids).not.toContain('t');
		expect(ids).toContain('r');
		expect(ids).toContain('c');
	});

	it('returns integer grid coordinates', () => {
		const positions = extractPositions(makeChain(4), mode);
		for (const p of positions) {
			expect(Number.isInteger(p.x)).toBe(true);
			expect(Number.isInteger(p.y)).toBe(true);
		}
	});
});

// ── tree-vertical specifics ───────────────────────────────────────────────────

describe('tree-vertical', () => {
	it('root is at y=0', () => {
		const positions = extractPositions(makeChain(3), 'tree-vertical');
		const root = positions.find((p) => p.nodeId === 'n0')!;
		expect(root.y).toBe(0);
	});

	it('child is below parent (higher y)', () => {
		const positions = extractPositions(makeChain(2), 'tree-vertical');
		const parent = positions.find((p) => p.nodeId === 'n0')!;
		const child = positions.find((p) => p.nodeId === 'n1')!;
		expect(child.y).toBeGreaterThan(parent.y);
	});

	it('grandchild is below child', () => {
		const positions = extractPositions(makeChain(3), 'tree-vertical');
		const child = positions.find((p) => p.nodeId === 'n1')!;
		const grandchild = positions.find((p) => p.nodeId === 'n2')!;
		expect(grandchild.y).toBeGreaterThan(child.y);
	});

	it('siblings at same depth are at same y', () => {
		const positions = extractPositions(makeStar(3), 'tree-vertical');
		const ys = ['c0', 'c1', 'c2'].map((id) => positions.find((p) => p.nodeId === id)!.y);
		expect(ys[0]).toBe(ys[1]);
		expect(ys[1]).toBe(ys[2]);
	});

	it('multiple roots are placed side by side', () => {
		const nodes = [makeNode('r1'), makeNode('r2')];
		const positions = extractPositions(nodes, 'tree-vertical');
		const r1 = positions.find((p) => p.nodeId === 'r1')!;
		const r2 = positions.find((p) => p.nodeId === 'r2')!;
		expect(r1.x).not.toBe(r2.x);
		expect(r1.y).toBe(r2.y);
	});
});

// ── tree-horizontal specifics ─────────────────────────────────────────────────

describe('tree-horizontal', () => {
	it('root is at x=0', () => {
		const positions = extractPositions(makeChain(3), 'tree-horizontal');
		const root = positions.find((p) => p.nodeId === 'n0')!;
		expect(root.x).toBe(0);
	});

	it('child is to the right of parent (higher x)', () => {
		const positions = extractPositions(makeChain(2), 'tree-horizontal');
		const parent = positions.find((p) => p.nodeId === 'n0')!;
		const child = positions.find((p) => p.nodeId === 'n1')!;
		expect(child.x).toBeGreaterThan(parent.x);
	});
});

// ── compact specifics ─────────────────────────────────────────────────────────

describe('compact', () => {
	it('places children below parent like tree-vertical', () => {
		const positions = extractPositions(makeChain(2), 'compact');
		const parent = positions.find((p) => p.nodeId === 'n0')!;
		const child = positions.find((p) => p.nodeId === 'n1')!;
		expect(child.y).toBeGreaterThan(parent.y);
	});

	it('uses tighter vertical gap than tree-vertical', () => {
		const nodes = makeChain(2);
		const vertical = extractPositions(nodes, 'tree-vertical');
		const compact = extractPositions(nodes, 'compact');
		const verticalGap =
			vertical.find((p) => p.nodeId === 'n1')!.y - vertical.find((p) => p.nodeId === 'n0')!.y;
		const compactGap =
			compact.find((p) => p.nodeId === 'n1')!.y - compact.find((p) => p.nodeId === 'n0')!.y;
		expect(compactGap).toBeLessThanOrEqual(verticalGap);
	});
});

// ── force-directed specifics ──────────────────────────────────────────────────

describe('force-directed', () => {
	it('returns a position for each non-thought node', () => {
		const nodes = makeStar(5);
		const positions = extractPositions(nodes, 'force-directed');
		expect(positions).toHaveLength(nodes.length);
	});

	it('positions are finite numbers', () => {
		const positions = extractPositions(makeChain(4), 'force-directed');
		for (const p of positions) {
			expect(isFinite(p.x)).toBe(true);
			expect(isFinite(p.y)).toBe(true);
		}
	});
});

// ── mind-map specifics ────────────────────────────────────────────────────────

describe('mind-map', () => {
	it('root ends up at (0, 0) approximately', () => {
		const positions = extractPositions([makeNode('r')], 'mind-map');
		expect(positions[0].x).toBe(0);
		expect(positions[0].y).toBe(0);
	});

	it('children are placed at a radial distance from root', () => {
		const nodes = makeStar(4);
		const positions = extractPositions(nodes, 'mind-map');
		const root = positions.find((p) => p.nodeId === 'root')!;
		const children = positions.filter((p) => p.nodeId !== 'root');
		for (const c of children) {
			const dist = Math.sqrt((c.x - root.x) ** 2 + (c.y - root.y) ** 2);
			expect(dist).toBeGreaterThan(0);
		}
	});
});

// ── timeline specifics ────────────────────────────────────────────────────────

describe('timeline', () => {
	it('root (depth 0) is at x=0', () => {
		const positions = extractPositions(makeChain(3), 'timeline');
		const root = positions.find((p) => p.nodeId === 'n0')!;
		expect(root.x).toBe(0);
	});

	it('each depth level is further right', () => {
		const positions = extractPositions(makeChain(3), 'timeline');
		const xs = ['n0', 'n1', 'n2'].map((id) => positions.find((p) => p.nodeId === id)!.x);
		expect(xs[1]).toBeGreaterThan(xs[0]);
		expect(xs[2]).toBeGreaterThan(xs[1]);
	});

	it('siblings at same depth are stacked vertically (different y)', () => {
		const nodes = makeStar(3);
		const positions = extractPositions(nodes, 'timeline');
		const ys = ['c0', 'c1', 'c2'].map((id) => positions.find((p) => p.nodeId === id)!.y);
		const uniqueYs = new Set(ys);
		expect(uniqueYs.size).toBeGreaterThan(1);
	});
});

// ── radial specifics ──────────────────────────────────────────────────────────

describe('radial', () => {
	it('root is at center (depth=0 ring)', () => {
		const nodes = makeStar(4);
		const positions = extractPositions(nodes, 'radial');
		const root = positions.find((p) => p.nodeId === 'root')!;
		// Root placed at depth 0 — verify it is closer to origin than children
		const children = positions.filter((p) => p.nodeId !== 'root');
		for (const c of children) {
			const rootDist = Math.sqrt(root.x ** 2 + root.y ** 2);
			const childDist = Math.sqrt(c.x ** 2 + c.y ** 2);
			expect(rootDist).toBeLessThanOrEqual(childDist);
		}
	});

	it('children are placed on a ring around the root', () => {
		const nodes = makeStar(4);
		const positions = extractPositions(nodes, 'radial');
		const children = positions.filter((p) => p.nodeId !== 'root');
		const xs = new Set(children.map((p) => p.x));
		expect(xs.size).toBeGreaterThan(1); // Children spread out in x
	});
});

// ── computeLayout default fallback ────────────────────────────────────────────

describe('computeLayout default', () => {
	it('falls back to tree-vertical for unknown mode', () => {
		const nodes = makeChain(2);
		const input = buildInput(nodes);
		// @ts-expect-error intentionally testing unknown mode
		const positions = computeLayout('unknown-mode', input);
		const parent = positions.find((p) => p.nodeId === 'n0')!;
		const child = positions.find((p) => p.nodeId === 'n1')!;
		// tree-vertical: child below parent
		expect(child.y).toBeGreaterThan(parent.y);
	});
});
