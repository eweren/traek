import { describe, it, expect } from 'vitest';
import { snapshotDiff } from '../snapshotDiff';
import type { ConversationSnapshot } from '../../persistence/schemas';

function makeSnapshot(nodes: Array<{ id: string; content: string }>): ConversationSnapshot {
	return {
		version: 2,
		createdAt: Date.now(),
		activeNodeId: null,
		nodes: nodes.map((n) => ({
			id: n.id,
			parentIds: [],
			content: n.content,
			role: 'user' as const,
			type: 'TEXT',
			status: 'done' as const,
			createdAt: Date.now(),
			metadata: { x: 0, y: 0 }
		})),
		customTags: []
	};
}

describe('snapshotDiff', () => {
	it('returns zero diff for identical snapshots', () => {
		const s = makeSnapshot([{ id: 'a', content: 'hello' }]);
		const diff = snapshotDiff(s, s);
		expect(diff.addedNodeIds).toHaveLength(0);
		expect(diff.removedNodeIds).toHaveLength(0);
		expect(diff.changedNodes).toHaveLength(0);
		expect(diff.nodeCountBefore).toBe(1);
		expect(diff.nodeCountAfter).toBe(1);
	});

	it('detects added nodes', () => {
		const before = makeSnapshot([{ id: 'a', content: 'hello' }]);
		const after = makeSnapshot([
			{ id: 'a', content: 'hello' },
			{ id: 'b', content: 'world' }
		]);
		const diff = snapshotDiff(before, after);
		expect(diff.addedNodeIds).toEqual(['b']);
		expect(diff.removedNodeIds).toHaveLength(0);
	});

	it('detects removed nodes', () => {
		const before = makeSnapshot([
			{ id: 'a', content: 'hello' },
			{ id: 'b', content: 'world' }
		]);
		const after = makeSnapshot([{ id: 'a', content: 'hello' }]);
		const diff = snapshotDiff(before, after);
		expect(diff.removedNodeIds).toEqual(['b']);
		expect(diff.addedNodeIds).toHaveLength(0);
	});

	it('detects content changes', () => {
		const before = makeSnapshot([{ id: 'a', content: 'hello' }]);
		const after = makeSnapshot([{ id: 'a', content: 'world' }]);
		const diff = snapshotDiff(before, after);
		expect(diff.changedNodes).toHaveLength(1);
		expect(diff.changedNodes[0].id).toBe('a');
		expect(diff.changedNodes[0].contentChanged).toBe(true);
	});

	it('detects metadata changes', () => {
		const before = makeSnapshot([{ id: 'a', content: 'hello' }]);
		const after = {
			...before,
			nodes: [{ ...before.nodes[0], metadata: { x: 100, y: 200 } }]
		};
		const diff = snapshotDiff(before, after);
		expect(diff.changedNodes).toHaveLength(1);
		expect(diff.changedNodes[0].metadataChanged).toBe(true);
	});
});
