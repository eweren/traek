import { describe, it, expect, beforeEach } from 'vitest';
import { HistoryManager, type EngineSnapshot } from '../HistoryManager';

const snap = (id: string): EngineSnapshot => ({
	nodes: [{ id, parentIds: [], role: 'user', type: 'text', metadata: { x: 0, y: 0 } } as never],
	activeNodeId: id
});

describe('HistoryManager', () => {
	let manager: HistoryManager;

	beforeEach(() => {
		manager = new HistoryManager();
	});

	it('starts with empty stacks', () => {
		expect(manager.canUndo).toBe(false);
		expect(manager.canRedo).toBe(false);
	});

	it('canUndo after push', () => {
		manager.push(snap('a'));
		expect(manager.canUndo).toBe(true);
		expect(manager.canRedo).toBe(false);
	});

	it('undo returns pushed snapshot and enables redo', () => {
		const s = snap('a');
		manager.push(s);
		const result = manager.undo(snap('current'));
		expect(result).toBe(s);
		expect(manager.canUndo).toBe(false);
		expect(manager.canRedo).toBe(true);
	});

	it('undo returns null when stack is empty', () => {
		expect(manager.undo(snap('x'))).toBeNull();
	});

	it('redo returns the current snapshot saved during undo', () => {
		const s = snap('a');
		manager.push(s);
		const current = snap('current');
		manager.undo(current); // redo stack now has [current]
		// redo pops 'current' (the state at undo time) and restores it
		const result = manager.redo(snap('after-undo'));
		expect(result).toBe(current);
		expect(manager.canUndo).toBe(true);
		expect(manager.canRedo).toBe(false);
	});

	it('redo returns null when redo stack is empty', () => {
		expect(manager.redo(snap('x'))).toBeNull();
	});

	it('push clears redo stack', () => {
		manager.push(snap('a'));
		manager.undo(snap('current'));
		expect(manager.canRedo).toBe(true);
		manager.push(snap('b'));
		expect(manager.canRedo).toBe(false);
	});

	it('respects maxDepth by dropping oldest entry', () => {
		const small = new HistoryManager(3);
		small.push(snap('1'));
		small.push(snap('2'));
		small.push(snap('3'));
		small.push(snap('4'));
		// Only 3 remain; undo 3 times should get '4', '3', '2' — NOT '1'
		const r1 = small.undo(snap('x'));
		const r2 = small.undo(snap('x'));
		const r3 = small.undo(snap('x'));
		expect(r1?.activeNodeId).toBe('4');
		expect(r2?.activeNodeId).toBe('3');
		expect(r3?.activeNodeId).toBe('2');
		expect(small.undo(snap('x'))).toBeNull();
	});

	it('clear empties both stacks', () => {
		manager.push(snap('a'));
		manager.undo(snap('b'));
		manager.clear();
		expect(manager.canUndo).toBe(false);
		expect(manager.canRedo).toBe(false);
	});

	it('undo pushes current snapshot to redo stack', () => {
		const before = snap('before');
		const current = snap('current');
		manager.push(before);
		manager.undo(current); // returns 'before'; redo stack = [current]
		// redo pops 'current' from redo and returns it
		const redoResult = manager.redo(snap('after-undo'));
		expect(redoResult?.activeNodeId).toBe('current');
		// After redo, 'after-undo' snapshot is on undo stack
		const undoResult = manager.undo(snap('after-redo'));
		expect(undoResult?.activeNodeId).toBe('after-undo');
	});

	it('multiple undo/redo cycles work correctly', () => {
		manager.push(snap('s1'));
		manager.push(snap('s2'));
		manager.push(snap('s3'));
		// undoStack = [s1, s2, s3]; simulate engine at state 'live'
		expect(manager.undo(snap('live'))?.activeNodeId).toBe('s3'); // redo=[live]
		expect(manager.undo(snap('s3'))?.activeNodeId).toBe('s2'); // redo=[live, s3]
		// redo pops s3 (most recent undo's current snapshot)
		expect(manager.redo(snap('s2'))?.activeNodeId).toBe('s3'); // undo=[s1, s2]
		expect(manager.canUndo).toBe(true);
		expect(manager.canRedo).toBe(true);
	});
});
