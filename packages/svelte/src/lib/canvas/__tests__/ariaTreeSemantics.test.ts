import { describe, it, expect, beforeEach } from 'vitest';
import { TraekEngine } from '../../TraekEngine.svelte';

/**
 * Unit tests for ARIA tree semantic computations (TRK-96).
 * Tests the pure logic used in NodeRenderer.svelte to compute
 * aria-level, aria-setsize, aria-posinset, aria-expanded.
 */

function computeAriaProps(engine: TraekEngine, nodeId: string) {
	const siblings = engine.getSiblings(nodeId);
	const nodeChildren = engine.getChildren(nodeId).filter((c) => c.type !== 'thought');
	const ariaLevel = engine.getDepth(nodeId) + 1;
	const ariaSetsize = siblings.length;
	const ariaPosinset = siblings.findIndex((s) => s.id === nodeId) + 1;
	const ariaExpanded = nodeChildren.length > 0 ? !engine.isCollapsed(nodeId) : undefined;
	return { ariaLevel, ariaSetsize, ariaPosinset, ariaExpanded };
}

describe('ARIA tree semantics', () => {
	let engine: TraekEngine;

	beforeEach(() => {
		engine = new TraekEngine();
	});

	describe('aria-level', () => {
		it('root node has level 1', () => {
			const root = engine.addNode('Root', 'user', { parentIds: [] });
			expect(computeAriaProps(engine, root.id).ariaLevel).toBe(1);
		});

		it('child of root has level 2', () => {
			const root = engine.addNode('Root', 'user', { parentIds: [] });
			const child = engine.addNode('Child', 'assistant', { parentIds: [root.id] });
			expect(computeAriaProps(engine, child.id).ariaLevel).toBe(2);
		});

		it('grandchild has level 3', () => {
			const root = engine.addNode('Root', 'user', { parentIds: [] });
			const child = engine.addNode('Child', 'assistant', { parentIds: [root.id] });
			const grandchild = engine.addNode('Grandchild', 'user', { parentIds: [child.id] });
			expect(computeAriaProps(engine, grandchild.id).ariaLevel).toBe(3);
		});
	});

	describe('aria-setsize and aria-posinset', () => {
		it('single root node has setsize 1 and posinset 1', () => {
			const root = engine.addNode('Root', 'user', { parentIds: [] });
			const props = computeAriaProps(engine, root.id);
			expect(props.ariaSetsize).toBe(1);
			expect(props.ariaPosinset).toBe(1);
		});

		it('two siblings each have setsize 2', () => {
			const root = engine.addNode('Root', 'user', { parentIds: [] });
			const child1 = engine.addNode('Child1', 'assistant', { parentIds: [root.id] });
			const child2 = engine.addNode('Child2', 'assistant', { parentIds: [root.id] });
			expect(computeAriaProps(engine, child1.id).ariaSetsize).toBe(2);
			expect(computeAriaProps(engine, child2.id).ariaSetsize).toBe(2);
		});

		it('posinset reflects order among siblings', () => {
			const root = engine.addNode('Root', 'user', { parentIds: [] });
			const child1 = engine.addNode('Child1', 'assistant', { parentIds: [root.id] });
			const child2 = engine.addNode('Child2', 'assistant', { parentIds: [root.id] });
			const child3 = engine.addNode('Child3', 'assistant', { parentIds: [root.id] });
			const pos1 = computeAriaProps(engine, child1.id).ariaPosinset;
			const pos2 = computeAriaProps(engine, child2.id).ariaPosinset;
			const pos3 = computeAriaProps(engine, child3.id).ariaPosinset;
			// Positions must be unique and 1-based
			expect(new Set([pos1, pos2, pos3])).toEqual(new Set([1, 2, 3]));
		});

		it('thought-type siblings are excluded from setsize', () => {
			const root = engine.addNode('Root', 'user', { parentIds: [] });
			const child = engine.addNode('Child', 'assistant', { parentIds: [root.id] });
			engine.addNode('Thought', 'assistant', {
				parentIds: [root.id],
				type: 'thought'
			} as Parameters<typeof engine.addNode>[2] & { type: string });
			// Only the non-thought child should count
			const props = computeAriaProps(engine, child.id);
			expect(props.ariaSetsize).toBe(1);
			expect(props.ariaPosinset).toBe(1);
		});
	});

	describe('aria-expanded', () => {
		it('leaf node has aria-expanded undefined', () => {
			const root = engine.addNode('Root', 'user', { parentIds: [] });
			expect(computeAriaProps(engine, root.id).ariaExpanded).toBeUndefined();
		});

		it('parent node with children has aria-expanded true when not collapsed', () => {
			const root = engine.addNode('Root', 'user', { parentIds: [] });
			engine.addNode('Child', 'assistant', { parentIds: [root.id] });
			expect(computeAriaProps(engine, root.id).ariaExpanded).toBe(true);
		});

		it('parent node has aria-expanded false when collapsed', () => {
			const root = engine.addNode('Root', 'user', { parentIds: [] });
			engine.addNode('Child', 'assistant', { parentIds: [root.id] });
			engine.toggleCollapse(root.id);
			expect(computeAriaProps(engine, root.id).ariaExpanded).toBe(false);
		});

		it('thought-only parent has aria-expanded undefined (thought children excluded)', () => {
			const root = engine.addNode('Root', 'user', { parentIds: [] });
			const child = engine.addNode('Child', 'assistant', { parentIds: [root.id] });
			// Add only a thought child to child
			engine.addNode('Thought', 'assistant', {
				parentIds: [child.id],
				type: 'thought'
			} as Parameters<typeof engine.addNode>[2] & { type: string });
			// child has no non-thought children → aria-expanded should be undefined
			expect(computeAriaProps(engine, child.id).ariaExpanded).toBeUndefined();
		});
	});
});
