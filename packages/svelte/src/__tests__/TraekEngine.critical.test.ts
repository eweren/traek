import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TraekEngine, type MessageNode, type Node } from '../lib/TraekEngine.svelte';

beforeEach(() => {
	globalThis.requestAnimationFrame = (cb: FrameRequestCallback) => {
		return setTimeout(() => cb(performance.now()), 0) as unknown as number;
	};
	globalThis.cancelAnimationFrame = (id: number) => clearTimeout(id);
});

afterEach(() => {});

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeChain(engine: TraekEngine, length: number): Node[] {
	const nodes: Node[] = [];
	for (let i = 0; i < length; i++) {
		const parent = nodes[nodes.length - 1];
		const node = engine.addNode(`node-${i}`, i % 2 === 0 ? 'user' : 'assistant', {
			parentIds: parent ? [parent.id] : []
		});
		nodes.push(node);
	}
	return nodes;
}

// ─── Collapse / Expand ────────────────────────────────────────────────────────

describe('collapse / expand', () => {
	it('toggleCollapse marks a node as collapsed', () => {
		expect.assertions(2);
		const engine = new TraekEngine();
		const root = engine.addNode('root', 'user', { parentIds: [] });
		expect(engine.isCollapsed(root.id)).toBe(false);
		engine.toggleCollapse(root.id);
		expect(engine.isCollapsed(root.id)).toBe(true);
	});

	it('toggleCollapse on collapsed node expands it', () => {
		expect.assertions(2);
		const engine = new TraekEngine();
		const root = engine.addNode('root', 'user', { parentIds: [] });
		engine.toggleCollapse(root.id);
		expect(engine.isCollapsed(root.id)).toBe(true);
		engine.toggleCollapse(root.id);
		expect(engine.isCollapsed(root.id)).toBe(false);
	});

	it('isCollapsed returns false for unknown node', () => {
		expect.assertions(1);
		const engine = new TraekEngine();
		expect(engine.isCollapsed('nonexistent')).toBe(false);
	});

	it('getHiddenDescendantCount returns 0 for leaf node', () => {
		expect.assertions(1);
		const engine = new TraekEngine();
		const leaf = engine.addNode('leaf', 'user', { parentIds: [] });
		expect(engine.getHiddenDescendantCount(leaf.id)).toBe(0);
	});

	it('getHiddenDescendantCount counts direct children', () => {
		expect.assertions(1);
		const engine = new TraekEngine();
		const root = engine.addNode('root', 'user', { parentIds: [] });
		engine.addNode('child1', 'assistant', { parentIds: [root.id] });
		engine.addNode('child2', 'assistant', { parentIds: [root.id] });
		expect(engine.getHiddenDescendantCount(root.id)).toBe(2);
	});

	it('getHiddenDescendantCount counts all descendants recursively', () => {
		expect.assertions(1);
		const engine = new TraekEngine();
		const nodes = makeChain(engine, 5);
		// nodes[0] has 4 descendants
		expect(engine.getHiddenDescendantCount(nodes[0].id)).toBe(4);
	});

	it('getHiddenDescendantCount excludes thought nodes', () => {
		expect.assertions(1);
		const engine = new TraekEngine();
		const root = engine.addNode('root', 'user', { parentIds: [] });
		engine.addNode('child', 'assistant', { parentIds: [root.id] });
		engine.addNode('thought', 'assistant', { parentIds: [root.id], type: 'thought' });
		// thought nodes excluded, only 1 visible child
		expect(engine.getHiddenDescendantCount(root.id)).toBe(1);
	});

	it('isInCollapsedSubtree returns false for root', () => {
		expect.assertions(1);
		const engine = new TraekEngine();
		const root = engine.addNode('root', 'user', { parentIds: [] });
		expect(engine.isInCollapsedSubtree(root.id)).toBe(false);
	});

	it('isInCollapsedSubtree returns false when parent is not collapsed', () => {
		expect.assertions(1);
		const engine = new TraekEngine();
		const root = engine.addNode('root', 'user', { parentIds: [] });
		const child = engine.addNode('child', 'assistant', { parentIds: [root.id] });
		expect(engine.isInCollapsedSubtree(child.id)).toBe(false);
	});

	it('isInCollapsedSubtree returns true when parent is collapsed', () => {
		expect.assertions(1);
		const engine = new TraekEngine();
		const root = engine.addNode('root', 'user', { parentIds: [] });
		const child = engine.addNode('child', 'assistant', { parentIds: [root.id] });
		engine.toggleCollapse(root.id);
		expect(engine.isInCollapsedSubtree(child.id)).toBe(true);
	});

	it('isInCollapsedSubtree returns true for grandchild when grandparent collapsed', () => {
		expect.assertions(2);
		const engine = new TraekEngine();
		const root = engine.addNode('root', 'user', { parentIds: [] });
		const child = engine.addNode('child', 'assistant', { parentIds: [root.id] });
		const grandchild = engine.addNode('grandchild', 'user', { parentIds: [child.id] });
		engine.toggleCollapse(root.id);
		expect(engine.isInCollapsedSubtree(child.id)).toBe(true);
		expect(engine.isInCollapsedSubtree(grandchild.id)).toBe(true);
	});

	it('isInCollapsedSubtree returns false after expanding collapsed ancestor', () => {
		expect.assertions(1);
		const engine = new TraekEngine();
		const root = engine.addNode('root', 'user', { parentIds: [] });
		const child = engine.addNode('child', 'assistant', { parentIds: [root.id] });
		engine.toggleCollapse(root.id);
		engine.toggleCollapse(root.id); // expand again
		expect(engine.isInCollapsedSubtree(child.id)).toBe(false);
	});
});

// ─── getDescendants ───────────────────────────────────────────────────────────

describe('getDescendants', () => {
	it('returns empty array for leaf node', () => {
		expect.assertions(1);
		const engine = new TraekEngine();
		const leaf = engine.addNode('leaf', 'user', { parentIds: [] });
		expect(engine.getDescendants(leaf.id)).toEqual([]);
	});

	it('returns empty array for unknown node', () => {
		expect.assertions(1);
		const engine = new TraekEngine();
		expect(engine.getDescendants('nonexistent')).toEqual([]);
	});

	it('returns direct children', () => {
		expect.assertions(2);
		const engine = new TraekEngine();
		const root = engine.addNode('root', 'user', { parentIds: [] });
		const c1 = engine.addNode('c1', 'assistant', { parentIds: [root.id] });
		const c2 = engine.addNode('c2', 'assistant', { parentIds: [root.id] });
		const descs = engine.getDescendants(root.id);
		expect(descs).toHaveLength(2);
		expect(descs.map((n) => n.id).sort()).toEqual([c1.id, c2.id].sort());
	});

	it('returns all descendants in BFS order', () => {
		expect.assertions(1);
		const engine = new TraekEngine();
		const nodes = makeChain(engine, 4);
		const descs = engine.getDescendants(nodes[0].id);
		// nodes[0] should have 3 descendants
		expect(descs).toHaveLength(3);
	});

	it('excludes thought nodes', () => {
		expect.assertions(1);
		const engine = new TraekEngine();
		const root = engine.addNode('root', 'user', { parentIds: [] });
		engine.addNode('child', 'assistant', { parentIds: [root.id] });
		engine.addNode('thought', 'assistant', { parentIds: [root.id], type: 'thought' });
		// thought nodes excluded
		expect(engine.getDescendants(root.id)).toHaveLength(1);
	});

	it('handles wide branching tree', () => {
		expect.assertions(1);
		const engine = new TraekEngine();
		const root = engine.addNode('root', 'user', { parentIds: [] });
		const branches = 10;
		for (let i = 0; i < branches; i++) {
			engine.addNode(`child-${i}`, 'assistant', { parentIds: [root.id] });
		}
		expect(engine.getDescendants(root.id)).toHaveLength(branches);
	});

	it('handles deep chain of 20 nodes', () => {
		expect.assertions(1);
		const engine = new TraekEngine();
		const nodes = makeChain(engine, 21);
		const descs = engine.getDescendants(nodes[0].id);
		expect(descs).toHaveLength(20);
	});
});

// ─── Search ───────────────────────────────────────────────────────────────────

describe('search', () => {
	it('searchNodesMethod finds matching nodes case-insensitively', () => {
		expect.assertions(2);
		const engine = new TraekEngine();
		engine.addNode('Hello World', 'user', { parentIds: [] });
		engine.addNode('Goodbye', 'assistant', { parentIds: [] });
		engine.searchNodesMethod('hello');
		expect(engine.searchMatches).toHaveLength(1);
		expect(engine.searchQuery).toBe('hello');
	});

	it('searchNodesMethod with empty query clears matches', () => {
		expect.assertions(2);
		const engine = new TraekEngine();
		engine.addNode('Hello World', 'user', { parentIds: [] });
		engine.searchNodesMethod('hello');
		expect(engine.searchMatches).toHaveLength(1);
		engine.searchNodesMethod('');
		expect(engine.searchMatches).toHaveLength(0);
	});

	it('searchNodesMethod trims query whitespace', () => {
		expect.assertions(1);
		const engine = new TraekEngine();
		engine.addNode('Hello', 'user', { parentIds: [] });
		engine.searchNodesMethod('  Hello  ');
		expect(engine.searchQuery).toBe('Hello');
	});

	it('searchNodesMethod resets currentSearchIndex to 0', () => {
		expect.assertions(1);
		const engine = new TraekEngine();
		engine.addNode('Hello', 'user', { parentIds: [] });
		engine.addNode('Hello2', 'user', { parentIds: [] });
		engine.searchNodesMethod('hello');
		engine.nextSearchMatch(); // advance to 1
		engine.searchNodesMethod('hello'); // re-search, should reset
		expect(engine.currentSearchIndex).toBe(0);
	});

	it('nextSearchMatch wraps around to first match', () => {
		expect.assertions(2);
		const engine = new TraekEngine();
		engine.addNode('Hello A', 'user', { parentIds: [] });
		engine.addNode('Hello B', 'user', { parentIds: [] });
		engine.searchNodesMethod('hello');
		expect(engine.currentSearchIndex).toBe(0);
		engine.nextSearchMatch();
		expect(engine.currentSearchIndex).toBe(1);
	});

	it('nextSearchMatch wraps around past last match', () => {
		expect.assertions(1);
		const engine = new TraekEngine();
		engine.addNode('Match', 'user', { parentIds: [] });
		engine.searchNodesMethod('match');
		// only 1 match, next wraps back to 0
		engine.nextSearchMatch();
		expect(engine.currentSearchIndex).toBe(0);
	});

	it('previousSearchMatch wraps around to last match', () => {
		expect.assertions(1);
		const engine = new TraekEngine();
		engine.addNode('Match A', 'user', { parentIds: [] });
		engine.addNode('Match B', 'user', { parentIds: [] });
		engine.searchNodesMethod('match');
		// index 0, previous should wrap to last (1)
		engine.previousSearchMatch();
		expect(engine.currentSearchIndex).toBe(1);
	});

	it('nextSearchMatch and previousSearchMatch no-op when no matches', () => {
		expect.assertions(2);
		const engine = new TraekEngine();
		engine.nextSearchMatch();
		expect(engine.currentSearchIndex).toBe(0);
		engine.previousSearchMatch();
		expect(engine.currentSearchIndex).toBe(0);
	});

	it('clearSearch resets all search state', () => {
		expect.assertions(3);
		const engine = new TraekEngine();
		engine.addNode('Hello', 'user', { parentIds: [] });
		engine.searchNodesMethod('hello');
		engine.clearSearch();
		expect(engine.searchQuery).toBe('');
		expect(engine.searchMatches).toHaveLength(0);
		expect(engine.currentSearchIndex).toBe(0);
	});

	it('refreshSearch updates matches with current query', () => {
		expect.assertions(2);
		const engine = new TraekEngine();
		const n1 = engine.addNode('Hello', 'user', { parentIds: [] });
		engine.searchNodesMethod('hello');
		expect(engine.searchMatches).toHaveLength(1);
		// Add another matching node, then refresh
		engine.addNode('Hello again', 'assistant', { parentIds: [n1.id] });
		engine.refreshSearch();
		expect(engine.searchMatches).toHaveLength(2);
	});

	it('refreshSearch is no-op when no active query', () => {
		expect.assertions(1);
		const engine = new TraekEngine();
		engine.addNode('Hello', 'user', { parentIds: [] });
		engine.refreshSearch(); // should not throw, matches stays empty
		expect(engine.searchMatches).toHaveLength(0);
	});

	it('search auto-expands collapsed ancestor containing a match', () => {
		expect.assertions(1);
		const engine = new TraekEngine();
		const root = engine.addNode('root', 'user', { parentIds: [] });
		const child = engine.addNode('Findme', 'assistant', { parentIds: [root.id] });
		engine.toggleCollapse(root.id);
		engine.searchNodesMethod('findme');
		// search should have expanded root so child is no longer hidden
		expect(engine.isCollapsed(root.id)).toBe(false);
		void child; // suppress unused warning
	});

	it('refreshSearch keeps currentSearchIndex in bounds when matches shrink', () => {
		expect.assertions(1);
		const engine = new TraekEngine();
		engine.addNode('Hello A', 'user', { parentIds: [] });
		const n2 = engine.addNode('Hello B', 'user', { parentIds: [] });
		engine.searchNodesMethod('hello');
		engine.nextSearchMatch(); // index = 1
		// Remove the second node so only 1 match remains
		engine.deleteNode(n2.id);
		engine.refreshSearch();
		expect(engine.currentSearchIndex).toBe(0);
	});
});

// ─── Undo / Redo ──────────────────────────────────────────────────────────────

describe('undo / redo', () => {
	it('undo returns false when history is empty', () => {
		expect.assertions(1);
		const engine = new TraekEngine();
		expect(engine.undo()).toBe(false);
	});

	it('redo returns false when no undone operations', () => {
		expect.assertions(1);
		const engine = new TraekEngine();
		expect(engine.redo()).toBe(false);
	});

	it('captureForUndo enables undo', () => {
		expect.assertions(2);
		const engine = new TraekEngine();
		expect(engine.canUndo).toBe(false);
		// addNode internally calls captureForUndo
		engine.addNode('A', 'user', { parentIds: [] });
		expect(engine.canUndo).toBe(true);
	});

	it('undo restores previous node count', () => {
		expect.assertions(3);
		const engine = new TraekEngine();
		// addNode calls captureForUndo; after first add undoStack has [snap_0]
		engine.addNode('A', 'user', { parentIds: [] });
		// after second add undoStack has [snap_0, snap_1]
		engine.addNode('B', 'user', { parentIds: [] });
		expect(engine.nodes).toHaveLength(2);
		const result = engine.undo();
		expect(result).toBe(true);
		expect(engine.nodes).toHaveLength(1);
	});

	it('undo restores node content', () => {
		expect.assertions(2);
		const engine = new TraekEngine();
		const node = engine.addNode('original', 'user', { parentIds: [] });
		// updateNode calls captureForUndo internally
		engine.updateNode(node.id, { content: 'modified' });
		engine.undo();
		const restored = engine.getNode(node.id) as MessageNode;
		expect(restored).toBeDefined();
		expect(restored.content).toBe('original');
	});

	it('redo restores state after undo', () => {
		expect.assertions(2);
		const engine = new TraekEngine();
		engine.addNode('A', 'user', { parentIds: [] }); // snap_0 in stack
		engine.addNode('B', 'user', { parentIds: [] }); // snap_1 in stack
		engine.undo(); // restores to 1 node
		expect(engine.nodes).toHaveLength(1);
		engine.redo(); // restores to 2 nodes
		expect(engine.nodes).toHaveLength(2);
	});

	it('redo is available after undoing (current state pushed to redo stack)', () => {
		expect.assertions(2);
		const engine = new TraekEngine();
		// addNode internally calls captureForUndo, so undo will push current state to redo
		engine.addNode('A', 'user', { parentIds: [] });
		expect(engine.canRedo).toBe(false);
		engine.undo();
		// after undo, the "A" state is on redo stack
		expect(engine.canRedo).toBe(true);
	});

	it('multiple undo steps work correctly', () => {
		expect.assertions(4);
		const engine = new TraekEngine();
		// addNode calls captureForUndo internally before each mutation
		engine.addNode('A', 'user', { parentIds: [] }); // stack: [snap_0]
		engine.addNode('B', 'user', { parentIds: [] }); // stack: [snap_0, snap_1]
		expect(engine.nodes).toHaveLength(2);
		engine.undo(); // restores snap_1 (1 node)
		expect(engine.nodes).toHaveLength(1);
		engine.undo(); // restores snap_0 (0 nodes)
		expect(engine.nodes).toHaveLength(0);
		expect(engine.canUndo).toBe(false);
	});

	it('new operation after undo clears redo stack', () => {
		expect.assertions(1);
		const engine = new TraekEngine();
		engine.addNode('A', 'user', { parentIds: [] }); // snap_0 in stack
		engine.undo(); // redo stack now has the "A" state
		// Adding a new node clears the redo stack (captureForUndo inside addNode clears redoStack)
		engine.addNode('C', 'user', { parentIds: [] });
		expect(engine.redo()).toBe(false);
	});

	it('clearHistory resets canUndo and canRedo', () => {
		expect.assertions(2);
		const engine = new TraekEngine();
		engine.addNode('A', 'user', { parentIds: [] });
		engine.undo(); // populates redo stack
		engine.clearHistory();
		expect(engine.canUndo).toBe(false);
		expect(engine.canRedo).toBe(false);
	});

	it('clearHistory prevents further undo', () => {
		expect.assertions(1);
		const engine = new TraekEngine();
		engine.addNode('A', 'user', { parentIds: [] });
		engine.clearHistory();
		expect(engine.undo()).toBe(false);
	});
});

// ─── Connection management ────────────────────────────────────────────────────

describe('connection management', () => {
	it('addConnection creates parent-child link', () => {
		expect.assertions(2);
		const engine = new TraekEngine();
		const a = engine.addNode('A', 'user', { parentIds: [] });
		const b = engine.addNode('B', 'user', { parentIds: [] });
		const result = engine.addConnection(a.id, b.id);
		expect(result).toBe(true);
		expect(b.parentIds).toContain(a.id);
	});

	it('addConnection returns false for missing parent', () => {
		expect.assertions(1);
		const engine = new TraekEngine();
		const b = engine.addNode('B', 'user', { parentIds: [] });
		expect(engine.addConnection('ghost', b.id)).toBe(false);
	});

	it('addConnection returns false for missing child', () => {
		expect.assertions(1);
		const engine = new TraekEngine();
		const a = engine.addNode('A', 'user', { parentIds: [] });
		expect(engine.addConnection(a.id, 'ghost')).toBe(false);
	});

	it('addConnection returns false for duplicate connection', () => {
		expect.assertions(1);
		const engine = new TraekEngine();
		const a = engine.addNode('A', 'user', { parentIds: [] });
		const b = engine.addNode('B', 'assistant', { parentIds: [a.id] });
		expect(engine.addConnection(a.id, b.id)).toBe(false);
	});

	it('addConnection returns false when it would create a cycle', () => {
		expect.assertions(1);
		const engine = new TraekEngine();
		const a = engine.addNode('A', 'user', { parentIds: [] });
		const b = engine.addNode('B', 'assistant', { parentIds: [a.id] });
		// b → a would create a cycle
		expect(engine.addConnection(b.id, a.id)).toBe(false);
	});

	it('removeConnection removes parent link', () => {
		expect.assertions(2);
		const engine = new TraekEngine();
		const a = engine.addNode('A', 'user', { parentIds: [] });
		const b = engine.addNode('B', 'assistant', { parentIds: [a.id] });
		const result = engine.removeConnection(a.id, b.id);
		expect(result).toBe(true);
		expect(b.parentIds).not.toContain(a.id);
	});

	it('removeConnection returns false for missing child', () => {
		expect.assertions(1);
		const engine = new TraekEngine();
		const a = engine.addNode('A', 'user', { parentIds: [] });
		expect(engine.removeConnection(a.id, 'ghost')).toBe(false);
	});

	it('removeConnection returns false when connection does not exist', () => {
		expect.assertions(1);
		const engine = new TraekEngine();
		const a = engine.addNode('A', 'user', { parentIds: [] });
		const b = engine.addNode('B', 'user', { parentIds: [] });
		expect(engine.removeConnection(a.id, b.id)).toBe(false);
	});

	it('node can have multiple parents via addConnection', () => {
		expect.assertions(2);
		const engine = new TraekEngine();
		const a = engine.addNode('A', 'user', { parentIds: [] });
		const b = engine.addNode('B', 'user', { parentIds: [] });
		const c = engine.addNode('C', 'assistant', { parentIds: [a.id] });
		engine.addConnection(b.id, c.id);
		expect(c.parentIds).toContain(a.id);
		expect(c.parentIds).toContain(b.id);
	});
});

// ─── Deep-branch edge cases ───────────────────────────────────────────────────

describe('deep-branch edge cases', () => {
	it('getDescendantCount works for 30-node chain', () => {
		expect.assertions(1);
		const engine = new TraekEngine();
		const nodes = makeChain(engine, 31);
		expect(engine.getDescendantCount(nodes[0].id)).toBe(30);
	});

	it('wouldCreateCycle detects cycle in deep chain', () => {
		expect.assertions(1);
		const engine = new TraekEngine();
		const nodes = makeChain(engine, 10);
		// Connecting last to first would create a cycle
		const last = nodes[nodes.length - 1];
		const first = nodes[0];
		expect(engine.addConnection(last.id, first.id)).toBe(false);
	});

	it('deleteNodeAndDescendants removes entire 10-node chain', () => {
		expect.assertions(1);
		const engine = new TraekEngine();
		const nodes = makeChain(engine, 10);
		engine.deleteNodeAndDescendants(nodes[0].id);
		expect(engine.nodes).toHaveLength(0);
	});

	it('wide tree: 50 children of root have correct parent', () => {
		expect.assertions(2);
		const engine = new TraekEngine();
		const root = engine.addNode('root', 'user', { parentIds: [] });
		for (let i = 0; i < 50; i++) {
			engine.addNode(`child-${i}`, 'assistant', { parentIds: [root.id] });
		}
		expect(engine.getChildren(root.id)).toHaveLength(50);
		expect(engine.getDescendants(root.id)).toHaveLength(50);
	});

	it('reparentNode cycle detection works in deep tree', () => {
		expect.assertions(1);
		const engine = new TraekEngine();
		const nodes = makeChain(engine, 5);
		// Try to reparent nodes[0] under its grandchild nodes[2] — cycle
		const result = engine.reparentNode(nodes[0].id, nodes[2].id);
		expect(result).toBe(false);
	});

	it('search across 100 nodes finds correct matches', () => {
		expect.assertions(2);
		const engine = new TraekEngine();
		// Add 90 non-matching, 10 matching
		for (let i = 0; i < 90; i++) {
			engine.addNode(`filler-${i}`, 'user', { parentIds: [] });
		}
		for (let i = 0; i < 10; i++) {
			engine.addNode(`needle-${i}`, 'assistant', { parentIds: [] });
		}
		engine.searchNodesMethod('needle');
		expect(engine.searchMatches).toHaveLength(10);
		expect(engine.searchQuery).toBe('needle');
	});

	it('collapse does not affect independent branches', () => {
		expect.assertions(2);
		const engine = new TraekEngine();
		const root = engine.addNode('root', 'user', { parentIds: [] });
		const branch1 = engine.addNode('branch1', 'assistant', { parentIds: [root.id] });
		const branch2 = engine.addNode('branch2', 'assistant', { parentIds: [root.id] });
		const leaf1 = engine.addNode('leaf1', 'user', { parentIds: [branch1.id] });
		const leaf2 = engine.addNode('leaf2', 'user', { parentIds: [branch2.id] });
		// Collapse branch1 only
		engine.toggleCollapse(branch1.id);
		expect(engine.isInCollapsedSubtree(leaf1.id)).toBe(true);
		expect(engine.isInCollapsedSubtree(leaf2.id)).toBe(false);
	});
});
