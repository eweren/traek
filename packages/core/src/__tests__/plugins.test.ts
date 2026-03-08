import { describe, it, expect, vi } from 'vitest';
import { TraekEngine } from '../TraekEngine.js';
import type { TraekPlugin } from '../plugins.js';
import type { Node } from '../types.js';

describe('Plugin system', () => {
	describe('engine.use()', () => {
		it('registers a plugin and returns the engine for chaining', () => {
			const engine = new TraekEngine();
			const plugin: TraekPlugin = { name: 'test' };
			const result = engine.use(plugin);
			expect(result).toBe(engine);
			expect(engine.plugins).toHaveLength(1);
		});

		it('deduplicates plugins by name', () => {
			const engine = new TraekEngine();
			engine.use({ name: 'dupe' });
			engine.use({ name: 'dupe' });
			expect(engine.plugins).toHaveLength(1);
		});

		it('supports multiple distinct plugins', () => {
			const engine = new TraekEngine();
			engine.use({ name: 'a' }).use({ name: 'b' }).use({ name: 'c' });
			expect(engine.plugins).toHaveLength(3);
		});
	});

	describe('onInit hook', () => {
		it('fires immediately on registration', () => {
			const engine = new TraekEngine();
			const onInit = vi.fn();
			engine.use({ name: 'init-test', onInit });
			expect(onInit).toHaveBeenCalledOnce();
			expect(onInit).toHaveBeenCalledWith(engine);
		});

		it('receives the engine with correct initial state', () => {
			const engine = new TraekEngine();
			let capturedNodeCount = -1;
			engine.use({
				name: 'init-capture',
				onInit(e) {
					capturedNodeCount = e.nodes.length;
				}
			});
			expect(capturedNodeCount).toBe(0);
		});

		it('fires after nodes already exist if registered late', () => {
			const engine = new TraekEngine();
			engine.addNode('hello', 'user');
			let capturedCount = -1;
			engine.use({
				name: 'late-init',
				onInit(e) {
					capturedCount = e.nodes.length;
				}
			});
			expect(capturedCount).toBe(1);
		});
	});

	describe('onNodeAdd hook', () => {
		it('is called when addNode is called', () => {
			const engine = new TraekEngine();
			const onNodeAdd = vi.fn();
			engine.use({ name: 'node-add', onNodeAdd });
			engine.addNode('hello', 'user');
			expect(onNodeAdd).toHaveBeenCalledOnce();
		});

		it('receives the created node and engine', () => {
			const engine = new TraekEngine();
			let capturedNode: Node | null = null;
			engine.use({
				name: 'capture',
				onNodeAdd(node, e) {
					capturedNode = node;
					expect(e).toBe(engine);
				}
			});
			const added = engine.addNode('hello', 'user');
			expect(capturedNode?.id).toBe(added.id);
		});

		it('can transform the node by returning a new node', () => {
			const engine = new TraekEngine();
			engine.use({
				name: 'tagger',
				onNodeAdd(node) {
					return { ...node, metadata: { ...node.metadata, x: 0, y: 0, tags: ['auto'] } };
				}
			});
			engine.addNode('hello', 'user');
			expect(engine.nodes[0].metadata?.tags).toEqual(['auto']);
		});

		it('returning void keeps node unchanged', () => {
			const engine = new TraekEngine();
			engine.use({
				name: 'noop',
				onNodeAdd(_node) {
					// no return
				}
			});
			const node = engine.addNode('hello', 'user');
			expect(engine.nodes[0].id).toBe(node.id);
		});

		it('multiple plugins transform in registration order', () => {
			const engine = new TraekEngine();
			engine.use({
				name: 'first',
				onNodeAdd(node) {
					return { ...node, metadata: { ...node.metadata, x: 0, y: 0, tags: ['a'] } };
				}
			});
			engine.use({
				name: 'second',
				onNodeAdd(node) {
					const tags = (node.metadata?.tags as string[] | undefined) ?? [];
					return { ...node, metadata: { ...node.metadata, x: 0, y: 0, tags: [...tags, 'b'] } };
				}
			});
			engine.addNode('hello', 'user');
			expect(engine.nodes[0].metadata?.tags).toEqual(['a', 'b']);
		});

		it('is called for addCustomNode too', () => {
			const engine = new TraekEngine();
			const onNodeAdd = vi.fn();
			engine.use({ name: 'custom-add', onNodeAdd });
			engine.addCustomNode({});
			expect(onNodeAdd).toHaveBeenCalledOnce();
		});
	});

	describe('onLayout hook', () => {
		it('is called when layout is applied', () => {
			const engine = new TraekEngine();
			const onLayout = vi.fn((positions) => positions);
			engine.use({ name: 'layout-spy', onLayout });
			engine.addNode('root', 'user', { parentIds: [] });
			engine.addNode('child', 'assistant');
			engine.flushLayoutFromRoot();
			expect(onLayout).toHaveBeenCalled();
		});

		it('receives positions array and layout mode', () => {
			const engine = new TraekEngine();
			let capturedMode: string | null = null;
			let capturedCount = -1;
			engine.use({
				name: 'layout-capture',
				onLayout(positions, mode) {
					capturedMode = mode;
					capturedCount = positions.length;
				}
			});
			engine.addNode('n1', 'user', { parentIds: [] });
			engine.addNode('n2', 'user');
			engine.flushLayoutFromRoot();
			expect(capturedMode).toBe('tree-vertical');
			expect(capturedCount).toBeGreaterThan(0);
		});

		it('can modify positions', () => {
			const engine = new TraekEngine();
			engine.use({
				name: 'layout-shift',
				onLayout(positions) {
					return positions.map((p) => ({ ...p, x: p.x + 100 }));
				}
			});
			engine.addNode('root', 'user', { parentIds: [] });
			engine.flushLayoutFromRoot();
			// Root node x should be 100 (shifted from 0)
			const root = engine.nodes[0];
			expect(root.metadata?.x).toBeGreaterThanOrEqual(100);
		});
	});

	describe('onSerialize hook', () => {
		it('is called when serialize() is called', () => {
			const engine = new TraekEngine();
			const onSerialize = vi.fn((s) => s);
			engine.use({ name: 'serialize-spy', onSerialize });
			engine.serialize('test');
			expect(onSerialize).toHaveBeenCalledOnce();
		});

		it('receives the snapshot and engine', () => {
			const engine = new TraekEngine();
			engine.addNode('hello', 'user');
			let capturedNodeCount = -1;
			engine.use({
				name: 'serialize-capture',
				onSerialize(snapshot, e) {
					capturedNodeCount = snapshot.nodes.length;
					expect(e).toBe(engine);
				}
			});
			engine.serialize();
			expect(capturedNodeCount).toBe(1);
		});

		it('can augment the snapshot', () => {
			const engine = new TraekEngine();
			engine.use({
				name: 'version-stamp',
				onSerialize(snapshot) {
					return { ...snapshot, appVersion: '1.0.0' } as typeof snapshot;
				}
			});
			const snap = engine.serialize('my title');
			// @ts-expect-error - augmented field
			expect(snap.appVersion).toBe('1.0.0');
		});

		it('returning void keeps original snapshot', () => {
			const engine = new TraekEngine();
			engine.use({
				name: 'noop-serialize',
				onSerialize(_snap) {
					// no return
				}
			});
			const snap = engine.serialize('title');
			expect(snap.title).toBe('title');
		});
	});

	describe('onNodeDelete hook', () => {
		it('is called when deleteNode is called', () => {
			const engine = new TraekEngine();
			const node = engine.addNode('to-delete', 'user');
			const onNodeDelete = vi.fn();
			engine.use({ name: 'delete-spy', onNodeDelete });
			engine.deleteNode(node.id);
			expect(onNodeDelete).toHaveBeenCalledOnce();
		});

		it('receives the node being deleted', () => {
			const engine = new TraekEngine();
			const node = engine.addNode('to-delete', 'user');
			let deletedId: string | null = null;
			engine.use({
				name: 'delete-capture',
				onNodeDelete(n) {
					deletedId = n.id;
				}
			});
			engine.deleteNode(node.id);
			expect(deletedId).toBe(node.id);
		});

		it('is not called when deleting a non-existent node', () => {
			const engine = new TraekEngine();
			const onNodeDelete = vi.fn();
			engine.use({ name: 'delete-spy2', onNodeDelete });
			engine.deleteNode('nonexistent');
			expect(onNodeDelete).not.toHaveBeenCalled();
		});
	});

	describe('plugin chaining', () => {
		it('supports engine.use().use() chaining', () => {
			const engine = new TraekEngine();
			engine.use({ name: 'a' }).use({ name: 'b' });
			expect(engine.plugins).toHaveLength(2);
		});

		it('engine.plugins returns current plugin list', () => {
			const engine = new TraekEngine();
			expect(engine.plugins).toHaveLength(0);
			engine.use({ name: 'x' });
			expect(engine.plugins).toHaveLength(1);
			expect(engine.plugins[0].name).toBe('x');
		});
	});
});
