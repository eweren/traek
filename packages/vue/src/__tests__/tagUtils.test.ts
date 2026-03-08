import { describe, it, expect } from 'vitest';
import { getNodeTags, getTagConfig, matchesTagFilter, PREDEFINED_TAGS } from '../tags/tagUtils.js';
import type { Node } from '@traek/core';

function makeNode(tags?: string[]): Node {
	return {
		id: 'n1',
		parentId: null,
		role: 'user',
		type: 'TEXT',
		status: 'done',
		metadata: tags ? { x: 0, y: 0, tags } : { x: 0, y: 0 }
	} as unknown as Node;
}

describe('getNodeTags', () => {
	it('returns empty array when no metadata', () => {
		const node = { id: 'n', role: 'user', type: 'TEXT', status: 'done' } as unknown as Node;
		expect(getNodeTags(node)).toEqual([]);
	});

	it('returns tags from metadata', () => {
		const node = makeNode(['important', 'todo']);
		expect(getNodeTags(node)).toEqual(['important', 'todo']);
	});

	it('returns empty array when tags not present in metadata', () => {
		const node = makeNode();
		expect(getNodeTags(node)).toEqual([]);
	});
});

describe('getTagConfig', () => {
	it('returns predefined config for known tags', () => {
		expect(getTagConfig('important')).toEqual(PREDEFINED_TAGS['important']);
		expect(getTagConfig('todo')).toEqual(PREDEFINED_TAGS['todo']);
	});

	it('returns default config for unknown tags', () => {
		const config = getTagConfig('custom-tag');
		expect(config.label).toBe('custom-tag');
		expect(config.color).toBe('#888888');
	});
});

describe('matchesTagFilter', () => {
	it('returns true when filterTags is empty', () => {
		const node = makeNode([]);
		expect(matchesTagFilter(node, [])).toBe(true);
	});

	it('returns true when node has a matching tag', () => {
		const node = makeNode(['important', 'todo']);
		expect(matchesTagFilter(node, ['important'])).toBe(true);
	});

	it('returns false when node has no matching tags', () => {
		const node = makeNode(['todo']);
		expect(matchesTagFilter(node, ['important'])).toBe(false);
	});
});
