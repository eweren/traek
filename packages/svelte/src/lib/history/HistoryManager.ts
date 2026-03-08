import type { Node } from '../TraekEngine.svelte';

export type EngineSnapshot = {
	nodes: Node[];
	activeNodeId: string | null;
};

/**
 * Manages undo/redo stacks for TraekEngine.
 * Stores deep-cloned snapshots of engine state before each undoable mutation.
 */
export class HistoryManager {
	private undoStack: EngineSnapshot[] = [];
	private redoStack: EngineSnapshot[] = [];
	readonly maxDepth: number;

	constructor(maxDepth = 50) {
		this.maxDepth = maxDepth;
	}

	/**
	 * Push a before-mutation snapshot onto the undo stack and clear the redo stack.
	 * If the stack exceeds maxDepth, the oldest entry is dropped.
	 */
	push(snapshot: EngineSnapshot): void {
		this.undoStack.push(snapshot);
		if (this.undoStack.length > this.maxDepth) {
			this.undoStack.shift();
		}
		this.redoStack = [];
	}

	/**
	 * Undo: pop from undo stack, push currentSnapshot to redo stack.
	 * Returns the state to restore, or null if nothing to undo.
	 */
	undo(currentSnapshot: EngineSnapshot): EngineSnapshot | null {
		const prev = this.undoStack.pop();
		if (!prev) return null;
		this.redoStack.push(currentSnapshot);
		return prev;
	}

	/**
	 * Redo: pop from redo stack, push currentSnapshot to undo stack.
	 * Returns the state to restore, or null if nothing to redo.
	 */
	redo(currentSnapshot: EngineSnapshot): EngineSnapshot | null {
		const next = this.redoStack.pop();
		if (!next) return null;
		this.undoStack.push(currentSnapshot);
		return next;
	}

	get canUndo(): boolean {
		return this.undoStack.length > 0;
	}

	get canRedo(): boolean {
		return this.redoStack.length > 0;
	}

	/** Clear both stacks (e.g. after loading a new conversation). */
	clear(): void {
		this.undoStack = [];
		this.redoStack = [];
	}
}
