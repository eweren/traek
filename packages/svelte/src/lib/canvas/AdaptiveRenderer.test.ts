import { describe, it, expect } from 'vitest';
import { getDetailLevel } from './AdaptiveRenderer.svelte';

describe('getDetailLevel', () => {
	it('returns "full" for scale > 0.5', () => {
		expect(getDetailLevel(1.0)).toBe('full');
		expect(getDetailLevel(0.9)).toBe('full');
		expect(getDetailLevel(0.7)).toBe('full');
		expect(getDetailLevel(0.51)).toBe('full');
		expect(getDetailLevel(2.0)).toBe('full');
	});

	it('returns "compact" for scale between 0.25 and 0.5', () => {
		expect(getDetailLevel(0.5)).toBe('compact');
		expect(getDetailLevel(0.4)).toBe('compact');
		expect(getDetailLevel(0.35)).toBe('compact');
		expect(getDetailLevel(0.26)).toBe('compact');
	});

	it('returns "minimal" for scale between 0.12 and 0.25', () => {
		expect(getDetailLevel(0.25)).toBe('minimal');
		expect(getDetailLevel(0.2)).toBe('minimal');
		expect(getDetailLevel(0.15)).toBe('minimal');
		expect(getDetailLevel(0.13)).toBe('minimal');
	});

	it('returns "dot" for scale <= 0.12', () => {
		expect(getDetailLevel(0.12)).toBe('dot');
		expect(getDetailLevel(0.1)).toBe('dot');
		expect(getDetailLevel(0.05)).toBe('dot');
		expect(getDetailLevel(0.01)).toBe('dot');
	});

	it('handles edge cases correctly', () => {
		expect(getDetailLevel(0.5)).toBe('compact');
		expect(getDetailLevel(0.25)).toBe('minimal');
		expect(getDetailLevel(0.12)).toBe('dot');
	});
});
