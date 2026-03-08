import { describe, it, expect, beforeEach } from 'vitest';
import { TraekEngine } from '../lib/TraekEngine.svelte';
import type { StickyAnnotation, MarkerAnnotation, PinAnnotation } from '../lib/annotations/types';
import { annotationSchema } from '../lib/annotations/types';
import { conversationSnapshotSchema } from '../lib/persistence/schemas';

function makeSticky(overrides?: Partial<StickyAnnotation>): StickyAnnotation {
	return {
		id: 'sticky-1',
		type: 'sticky',
		x: 100,
		y: 200,
		width: 200,
		height: 120,
		color: 'yellow',
		text: 'Hello world',
		rotation: 1.5,
		createdAt: new Date().toISOString(),
		...overrides
	};
}

function makeMarker(overrides?: Partial<MarkerAnnotation>): MarkerAnnotation {
	return {
		id: 'marker-1',
		type: 'marker',
		points: [
			{ x: 0, y: 0 },
			{ x: 50, y: 50 },
			{ x: 100, y: 30 }
		],
		color: 'amber',
		strokeWidth: 8,
		createdAt: new Date().toISOString(),
		...overrides
	};
}

function makePin(overrides?: Partial<PinAnnotation>): PinAnnotation {
	return {
		id: 'pin-1',
		type: 'pin',
		x: 300,
		y: 400,
		label: 'My pin',
		comment: 'A comment',
		color: 'blue',
		createdAt: new Date().toISOString(),
		...overrides
	};
}

describe('TraekEngine — annotation CRUD', () => {
	let engine: TraekEngine;

	beforeEach(() => {
		engine = new TraekEngine();
	});

	it('starts with no annotations', () => {
		expect(engine.annotations).toHaveLength(0);
	});

	it('addAnnotation adds a sticky note', () => {
		engine.addAnnotation(makeSticky());
		expect(engine.annotations).toHaveLength(1);
		expect(engine.annotations[0].type).toBe('sticky');
	});

	it('addAnnotation adds a marker', () => {
		engine.addAnnotation(makeMarker());
		expect(engine.annotations).toHaveLength(1);
		expect(engine.annotations[0].type).toBe('marker');
	});

	it('addAnnotation adds a pin', () => {
		engine.addAnnotation(makePin());
		expect(engine.annotations).toHaveLength(1);
		expect(engine.annotations[0].type).toBe('pin');
	});

	it('addAnnotation supports multiple annotations', () => {
		engine.addAnnotation(makeSticky({ id: 's1' }));
		engine.addAnnotation(makeMarker({ id: 'm1' }));
		engine.addAnnotation(makePin({ id: 'p1' }));
		expect(engine.annotations).toHaveLength(3);
	});

	it('updateAnnotation updates sticky text', () => {
		engine.addAnnotation(makeSticky());
		engine.updateAnnotation('sticky-1', { text: 'Updated' } as Partial<StickyAnnotation>);
		const ann = engine.annotations.find((a) => a.id === 'sticky-1') as StickyAnnotation;
		expect(ann.text).toBe('Updated');
	});

	it('updateAnnotation updates position', () => {
		engine.addAnnotation(makeSticky());
		engine.updateAnnotation('sticky-1', { x: 500, y: 600 } as Partial<StickyAnnotation>);
		const ann = engine.annotations.find((a) => a.id === 'sticky-1') as StickyAnnotation;
		expect(ann.x).toBe(500);
		expect(ann.y).toBe(600);
	});

	it('updateAnnotation is a no-op for unknown id', () => {
		engine.addAnnotation(makeSticky());
		engine.updateAnnotation('nonexistent', { text: 'x' } as Partial<StickyAnnotation>);
		expect(engine.annotations).toHaveLength(1);
		expect((engine.annotations[0] as StickyAnnotation).text).toBe('Hello world');
	});

	it('deleteAnnotation removes annotation', () => {
		engine.addAnnotation(makeSticky());
		engine.deleteAnnotation('sticky-1');
		expect(engine.annotations).toHaveLength(0);
	});

	it('deleteAnnotation is a no-op for unknown id', () => {
		engine.addAnnotation(makeSticky());
		engine.deleteAnnotation('nonexistent');
		expect(engine.annotations).toHaveLength(1);
	});

	it('clearAnnotations removes all annotations', () => {
		engine.addAnnotation(makeSticky({ id: 's1' }));
		engine.addAnnotation(makeMarker({ id: 'm1' }));
		engine.addAnnotation(makePin({ id: 'p1' }));
		engine.clearAnnotations();
		expect(engine.annotations).toHaveLength(0);
	});

	it('clearAnnotations is a no-op when already empty', () => {
		// Should not throw
		engine.clearAnnotations();
		expect(engine.annotations).toHaveLength(0);
	});
});

describe('TraekEngine — annotation undo/redo', () => {
	let engine: TraekEngine;

	beforeEach(() => {
		engine = new TraekEngine();
	});

	it('undo reverts addAnnotation', () => {
		engine.addAnnotation(makeSticky());
		expect(engine.annotations).toHaveLength(1);
		engine.undo();
		expect(engine.annotations).toHaveLength(0);
	});

	it('undo reverts deleteAnnotation', () => {
		engine.addAnnotation(makeSticky());
		engine.deleteAnnotation('sticky-1');
		expect(engine.annotations).toHaveLength(0);
		engine.undo();
		expect(engine.annotations).toHaveLength(1);
	});

	it('undo reverts updateAnnotation', () => {
		engine.addAnnotation(makeSticky());
		engine.updateAnnotation('sticky-1', { text: 'Changed' } as Partial<StickyAnnotation>);
		engine.undo();
		const ann = engine.annotations.find((a) => a.id === 'sticky-1') as StickyAnnotation;
		expect(ann.text).toBe('Hello world');
	});

	it('redo re-applies addAnnotation after undo', () => {
		engine.addAnnotation(makeSticky());
		engine.undo();
		engine.redo();
		expect(engine.annotations).toHaveLength(1);
	});

	it('undo reverts clearAnnotations', () => {
		engine.addAnnotation(makeSticky({ id: 's1' }));
		engine.addAnnotation(makePin({ id: 'p1' }));
		engine.clearAnnotations();
		engine.undo();
		expect(engine.annotations).toHaveLength(2);
	});
});

describe('TraekEngine — annotation snapshot serialization', () => {
	let engine: TraekEngine;

	beforeEach(() => {
		engine = new TraekEngine();
	});

	it('serialize includes annotations', () => {
		engine.addAnnotation(makeSticky());
		const snapshot = engine.serialize('Test');
		expect(snapshot.annotations).toHaveLength(1);
		expect(snapshot.annotations![0].type).toBe('sticky');
	});

	it('serialize omits annotations field when empty', () => {
		const snapshot = engine.serialize('Test');
		expect(snapshot.annotations).toBeUndefined();
	});

	it('fromSnapshot restores annotations', () => {
		engine.addAnnotation(makeSticky());
		engine.addAnnotation(makeMarker());
		engine.addAnnotation(makePin());
		const snapshot = engine.serialize('Test');

		const engine2 = new TraekEngine();
		engine2.fromSnapshot(snapshot);
		expect(engine2.annotations).toHaveLength(3);
		expect(engine2.annotations.map((a) => a.type)).toEqual(
			expect.arrayContaining(['sticky', 'marker', 'pin'])
		);
	});

	it('fromSnapshot without annotations field starts empty', () => {
		const snapshot = engine.serialize('Test');
		// Omit annotations field entirely
		const { annotations: _omit, ...rest } = snapshot;
		void _omit;

		const engine2 = new TraekEngine();
		engine2.fromSnapshot(rest as ReturnType<typeof engine.serialize>);
		expect(engine2.annotations).toHaveLength(0);
	});

	it('serialize/fromSnapshot round-trips sticky with all fields', () => {
		const sticky = makeSticky({ text: 'Round trip', color: 'pink', rotation: -2.1 });
		engine.addAnnotation(sticky);
		const snapshot = engine.serialize('Test');

		const engine2 = new TraekEngine();
		engine2.fromSnapshot(snapshot);
		const restored = engine2.annotations[0] as StickyAnnotation;
		expect(restored.text).toBe('Round trip');
		expect(restored.color).toBe('pink');
		expect(restored.rotation).toBeCloseTo(-2.1);
	});

	it('serialize/fromSnapshot round-trips marker with points', () => {
		const marker = makeMarker();
		engine.addAnnotation(marker);
		const snapshot = engine.serialize('Test');

		const engine2 = new TraekEngine();
		engine2.fromSnapshot(snapshot);
		const restored = engine2.annotations[0] as MarkerAnnotation;
		expect(restored.points).toHaveLength(3);
		expect(restored.points[0]).toEqual({ x: 0, y: 0 });
	});

	it('serialize/fromSnapshot round-trips pin with label and comment', () => {
		const pin = makePin({ label: 'Focus here', comment: 'Needs review' });
		engine.addAnnotation(pin);
		const snapshot = engine.serialize('Test');

		const engine2 = new TraekEngine();
		engine2.fromSnapshot(snapshot);
		const restored = engine2.annotations[0] as PinAnnotation;
		expect(restored.label).toBe('Focus here');
		expect(restored.comment).toBe('Needs review');
	});
});

describe('Annotation Zod schema validation', () => {
	it('validates sticky annotation', () => {
		const result = annotationSchema.safeParse(makeSticky());
		expect(result.success).toBe(true);
	});

	it('validates marker annotation', () => {
		const result = annotationSchema.safeParse(makeMarker());
		expect(result.success).toBe(true);
	});

	it('validates pin annotation', () => {
		const result = annotationSchema.safeParse(makePin());
		expect(result.success).toBe(true);
	});

	it('rejects invalid color', () => {
		const result = annotationSchema.safeParse(makeSticky({ color: 'invalid' as never }));
		expect(result.success).toBe(false);
	});

	it('rejects sticky without required fields', () => {
		const { text: _t, ...noText } = makeSticky();
		void _t;
		const result = annotationSchema.safeParse(noText);
		expect(result.success).toBe(false);
	});

	it('rejects unknown annotation type', () => {
		const result = annotationSchema.safeParse({ id: 'x', type: 'unknown', x: 0, y: 0 });
		expect(result.success).toBe(false);
	});

	it('conversationSnapshotSchema accepts annotations array', () => {
		const snapshot = {
			version: 2 as const,
			createdAt: Date.now(),
			activeNodeId: null,
			nodes: [],
			annotations: [makeSticky(), makeMarker(), makePin()]
		};
		const result = conversationSnapshotSchema.safeParse(snapshot);
		expect(result.success).toBe(true);
	});

	it('conversationSnapshotSchema accepts missing annotations (backward compat)', () => {
		const snapshot = {
			version: 2 as const,
			createdAt: Date.now(),
			activeNodeId: null,
			nodes: []
		};
		const result = conversationSnapshotSchema.safeParse(snapshot);
		expect(result.success).toBe(true);
	});
});
