import { describe, it, expect, vi } from 'vitest';
import { TraekEngine, wouldCreateCycle } from '../TraekEngine.js';
import { Store, ObservableSet } from '../store.js';

// ---------------------------------------------------------------------------
// Store primitives
// ---------------------------------------------------------------------------

describe('Store', () => {
	it('initializes with the given value', () => {
		const s = new Store(42);
		expect(s.value).toBe(42);
	});

	it('calls subscriber immediately on subscribe', () => {
		const s = new Store(1);
		const fn = vi.fn();
		s.subscribe(fn);
		expect(fn).toHaveBeenCalledTimes(1);
	});

	it('notifies on set', () => {
		const s = new Store(0);
		const values: number[] = [];
		s.subscribe((v) => values.push(v));
		s.set(1);
		s.set(2);
		expect(values).toEqual([0, 1, 2]);
	});

	it('unsubscribe stops notifications', () => {
		const s = new Store(0);
		const fn = vi.fn();
		const unsub = s.subscribe(fn);
		s.set(1);
		unsub();
		s.set(2);
		expect(fn).toHaveBeenCalledTimes(2); // initial + set(1)
	});
});

describe('ObservableSet', () => {
	it('initializes empty', () => {
		const s = new ObservableSet<string>();
		expect(s.size).toBe(0);
	});

	it('notifies on add', () => {
		const s = new ObservableSet<string>();
		const snapshots: ReadonlySet<string>[] = [];
		s.subscribe((snap) => snapshots.push(snap));
		s.add('a');
		s.add('b');
		expect(snapshots.length).toBe(3); // initial + 2 adds
		expect(snapshots[2].has('b')).toBe(true);
	});

	it('does not notify on duplicate add', () => {
		const s = new ObservableSet<string>(['x']);
		const fn = vi.fn();
		s.subscribe(fn);
		fn.mockClear();
		s.add('x'); // already in set
		expect(fn).not.toHaveBeenCalled();
	});

	it('notifies on delete', () => {
		const s = new ObservableSet<string>(['a', 'b']);
		const fn = vi.fn();
		s.subscribe(fn);
		fn.mockClear();
		s.delete('a');
		expect(fn).toHaveBeenCalledTimes(1);
	});
});

// ---------------------------------------------------------------------------
// wouldCreateCycle
// ---------------------------------------------------------------------------

describe('wouldCreateCycle', () => {
	it('detects self-loop', () => {
		expect(wouldCreateCycle([], 'a', 'a')).toBe(true);
	});

	it('detects simple cycle', () => {
		const nodes = [
			{ id: 'a', parentIds: [] as string[], role: 'user' as const, type: 'text' },
			{ id: 'b', parentIds: ['a'], role: 'user' as const, type: 'text' }
		];
		// Adding a → b when b is already a child of a would not create a cycle,
		// but adding b → a (parent=b, child=a) would.
		expect(wouldCreateCycle(nodes, 'b', 'a')).toBe(true);
		expect(wouldCreateCycle(nodes, 'a', 'b')).toBe(false);
	});
});

// ---------------------------------------------------------------------------
// TraekEngine – core behavior
// ---------------------------------------------------------------------------

describe('TraekEngine', () => {
	it('starts empty', () => {
		const engine = new TraekEngine();
		expect(engine.nodes).toHaveLength(0);
		expect(engine.activeNodeId).toBeNull();
	});

	it('addNode creates a node and makes it active', () => {
		const engine = new TraekEngine();
		const node = engine.addNode('Hello', 'user');
		expect(engine.nodes).toHaveLength(1);
		expect(engine.activeNodeId).toBe(node.id);
		expect(node.content).toBe('Hello');
		expect(node.role).toBe('user');
	});

	it('subscribe is called immediately and on mutation', () => {
		const engine = new TraekEngine();
		const calls: number[] = [];
		const unsub = engine.subscribe(() => calls.push(calls.length));
		expect(calls).toHaveLength(1); // immediate call
		engine.addNode('test', 'user');
		expect(calls.length).toBeGreaterThan(1);
		unsub();
		const before = calls.length;
		engine.addNode('after unsub', 'user');
		expect(calls.length).toBe(before); // no more calls
	});

	it('getSnapshot returns current state', () => {
		const engine = new TraekEngine();
		engine.addNode('hi', 'user');
		const snap = engine.getSnapshot();
		expect(snap.nodes).toHaveLength(1);
		expect(snap.activeNodeId).not.toBeNull();
	});

	it('deleteNode removes node and clears activeNodeId', () => {
		const engine = new TraekEngine();
		const node = engine.addNode('bye', 'user');
		engine.deleteNode(node.id);
		expect(engine.nodes).toHaveLength(0);
		expect(engine.activeNodeId).toBeNull();
	});

	it('branchFrom sets activeNodeId', () => {
		const engine = new TraekEngine();
		const n1 = engine.addNode('first', 'user');
		const n2 = engine.addNode('second', 'assistant');
		engine.branchFrom(n1.id);
		expect(engine.activeNodeId).toBe(n1.id);
		engine.branchFrom(n2.id);
		expect(engine.activeNodeId).toBe(n2.id);
	});

	it('toggleCollapse and isCollapsed', () => {
		const engine = new TraekEngine();
		const node = engine.addNode('root', 'user');
		expect(engine.isCollapsed(node.id)).toBe(false);
		engine.toggleCollapse(node.id);
		expect(engine.isCollapsed(node.id)).toBe(true);
		engine.toggleCollapse(node.id);
		expect(engine.isCollapsed(node.id)).toBe(false);
	});

	it('serialize and fromSnapshot round-trip', () => {
		const engine = new TraekEngine();
		engine.addNode('Hello', 'user');
		engine.addNode('World', 'assistant');
		const snap = engine.serialize('test');
		const restored = TraekEngine.fromSnapshot(snap);
		expect(restored.nodes).toHaveLength(2);
		expect(restored.nodes[0].role).toBe('user');
	});

	it('addNodes with topological order', () => {
		const engine = new TraekEngine();
		const root = engine.addNode('root', 'user');
		engine.addNodes([
			{ id: 'c', parentIds: ['p'], content: 'child', role: 'assistant' },
			{ id: 'p', parentIds: [root.id], content: 'parent', role: 'user' }
		]);
		// 'p' must be added before 'c' even though 'c' came first in the payload
		expect(engine.getNode('p')).toBeDefined();
		expect(engine.getNode('c')).toBeDefined();
		expect(engine.getChildren('p').map((n) => n.id)).toContain('c');
	});

	it('contextPath follows primary parent chain', () => {
		const engine = new TraekEngine();
		const root = engine.addNode('root', 'user');
		const mid = engine.addNode('mid', 'assistant');
		const leaf = engine.addNode('leaf', 'user');
		engine.branchFrom(leaf.id);
		const path = engine.contextPath;
		expect(path.map((n) => n.id)).toEqual([root.id, mid.id, leaf.id]);
	});

	it('search finds matching nodes', () => {
		const engine = new TraekEngine();
		engine.addNode('Hello world', 'user');
		engine.addNode('Goodbye', 'assistant');
		engine.searchNodesMethod('hello');
		expect(engine.searchMatches).toHaveLength(1);
		expect(engine.searchQuery).toBe('hello');
	});
});
