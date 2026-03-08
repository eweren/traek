import { describe, it, expect } from 'vitest';
import { computeLayout } from '../lib/layout/algorithms';
import type { LayoutInput } from '../lib/layout/types';
import type { Node } from '@traek/core';

function makeNode(id: string, parentId?: string): Node {
	return {
		id,
		parentIds: parentId ? [parentId] : [],
		role: 'user',
		type: 'text',
		metadata: { x: 0, y: 0 }
	} as Node;
}

const baseConfig = {
	nodeWidthGrid: 18, // 350/20 ≈ 18
	nodeHGrid: 5, // 100/20 = 5
	gapXGrid: 2, // 35/20 ≈ 2
	gapYGrid: 3 // 50/20 ≈ 3
};

function makeInput(nodes: Node[]): LayoutInput {
	const nodeMap = new Map(nodes.map((n) => [n.id, n]));
	const childrenMap = new Map<string | null, string[]>();
	childrenMap.set(null, []);
	for (const n of nodes) {
		const parentId = n.parentIds[0] ?? null;
		const arr = childrenMap.get(parentId) ?? [];
		arr.push(n.id);
		childrenMap.set(parentId, arr);
	}
	return { nodes, childrenMap, nodeMap, config: baseConfig };
}

describe('computeLayout', () => {
	describe('tree-vertical', () => {
		it('places single root at origin', () => {
			const nodes = [makeNode('root')];
			const positions = computeLayout('tree-vertical', makeInput(nodes));
			const root = positions.find((p) => p.nodeId === 'root')!;
			expect(root.x).toBe(0);
			expect(root.y).toBe(0);
		});

		it('places child below parent', () => {
			const nodes = [makeNode('root'), makeNode('child', 'root')];
			const positions = computeLayout('tree-vertical', makeInput(nodes));
			const parent = positions.find((p) => p.nodeId === 'root')!;
			const child = positions.find((p) => p.nodeId === 'child')!;
			expect(child.y).toBeGreaterThan(parent.y);
		});

		it('centers siblings under parent', () => {
			const nodes = [makeNode('root'), makeNode('c1', 'root'), makeNode('c2', 'root')];
			const positions = computeLayout('tree-vertical', makeInput(nodes));
			const c1 = positions.find((p) => p.nodeId === 'c1')!;
			const c2 = positions.find((p) => p.nodeId === 'c2')!;
			expect(c1.y).toBe(c2.y); // same depth
			expect(c1.x).toBeLessThan(c2.x); // c1 left of c2
		});

		it('excludes thought nodes', () => {
			const thought: Node = { ...makeNode('t'), type: 'thought' };
			const nodes = [makeNode('root'), thought];
			const positions = computeLayout('tree-vertical', makeInput(nodes));
			expect(positions.find((p) => p.nodeId === 't')).toBeUndefined();
		});
	});

	describe('tree-horizontal', () => {
		it('places child to the right of parent', () => {
			const nodes = [makeNode('root'), makeNode('child', 'root')];
			const positions = computeLayout('tree-horizontal', makeInput(nodes));
			const parent = positions.find((p) => p.nodeId === 'root')!;
			const child = positions.find((p) => p.nodeId === 'child')!;
			expect(child.x).toBeGreaterThan(parent.x);
		});
	});

	describe('compact', () => {
		it('produces smaller gaps than tree-vertical', () => {
			const nodes = [makeNode('root'), makeNode('c1', 'root'), makeNode('c2', 'root')];
			const input = makeInput(nodes);
			const treePos = computeLayout('tree-vertical', input);
			const compactPos = computeLayout('compact', input);
			const treeSpread = Math.abs(
				treePos.find((p) => p.nodeId === 'c2')!.x - treePos.find((p) => p.nodeId === 'c1')!.x
			);
			const compactSpread = Math.abs(
				compactPos.find((p) => p.nodeId === 'c2')!.x - compactPos.find((p) => p.nodeId === 'c1')!.x
			);
			expect(compactSpread).toBeLessThanOrEqual(treeSpread);
		});
	});

	describe('timeline', () => {
		it('places nodes at increasing x by depth', () => {
			const nodes = [makeNode('root'), makeNode('child', 'root'), makeNode('grandchild', 'child')];
			const positions = computeLayout('timeline', makeInput(nodes));
			const r = positions.find((p) => p.nodeId === 'root')!;
			const c = positions.find((p) => p.nodeId === 'child')!;
			const g = positions.find((p) => p.nodeId === 'grandchild')!;
			expect(c.x).toBeGreaterThan(r.x);
			expect(g.x).toBeGreaterThan(c.x);
		});
	});

	describe('mind-map', () => {
		it('places root at origin area and children around it', () => {
			const nodes = [makeNode('root'), makeNode('c1', 'root'), makeNode('c2', 'root')];
			const positions = computeLayout('mind-map', makeInput(nodes));
			expect(positions).toHaveLength(3);
			// Children should be spread around root
			const c1 = positions.find((p) => p.nodeId === 'c1')!;
			const c2 = positions.find((p) => p.nodeId === 'c2')!;
			expect(c1.x !== c2.x || c1.y !== c2.y).toBe(true);
		});
	});

	describe('radial', () => {
		it('places root and children', () => {
			const nodes = [makeNode('root'), makeNode('c1', 'root'), makeNode('c2', 'root')];
			const positions = computeLayout('radial', makeInput(nodes));
			expect(positions).toHaveLength(3);
		});
	});

	describe('force-directed', () => {
		it('produces positions for all non-thought nodes', () => {
			const nodes = [makeNode('a'), makeNode('b', 'a'), makeNode('c', 'a')];
			const positions = computeLayout('force-directed', makeInput(nodes));
			expect(positions).toHaveLength(3);
		});
	});
});
