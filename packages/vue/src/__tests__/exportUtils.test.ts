import { describe, it, expect } from 'vitest';
import { snapshotToJSON, snapshotToMarkdown } from '../persistence/exportUtils.js';
import type { ConversationSnapshot } from '@traek/core';

function makeSnapshot(overrides: Partial<ConversationSnapshot> = {}): ConversationSnapshot {
	return {
		id: 'snap-1',
		title: 'Test Convo',
		createdAt: new Date('2026-01-01T00:00:00Z').toISOString(),
		updatedAt: new Date('2026-01-01T00:00:00Z').toISOString(),
		nodes: [],
		activeNodeId: null,
		...overrides
	};
}

describe('snapshotToJSON', () => {
	it('produces valid JSON', () => {
		const snap = makeSnapshot();
		const json = snapshotToJSON(snap);
		expect(() => JSON.parse(json)).not.toThrow();
		expect(JSON.parse(json).id).toBe('snap-1');
	});

	it('pretty-prints with 2-space indent', () => {
		const snap = makeSnapshot();
		const json = snapshotToJSON(snap);
		expect(json).toContain('\n  ');
	});
});

describe('snapshotToMarkdown', () => {
	it('includes title and empty state for no nodes', () => {
		const snap = makeSnapshot();
		const md = snapshotToMarkdown(snap);
		expect(md).toContain('# Test Convo');
		expect(md).toContain('_(No messages)_');
	});

	it('renders a simple user message', () => {
		const snap = makeSnapshot({
			nodes: [
				{
					id: 'n1',
					parentIds: [],
					role: 'user',
					type: 'TEXT',
					status: 'done',
					content: 'Hello world',
					metadata: { x: 0, y: 0 }
				}
			]
		});
		const md = snapshotToMarkdown(snap);
		expect(md).toContain('**User:**');
		expect(md).toContain('Hello world');
	});
});
