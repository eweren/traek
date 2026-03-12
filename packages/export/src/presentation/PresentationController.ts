import type { ConversationSnapshot, SerializedNode } from '@traek/core';
import type { Slide, PresentationOptions, PresentationListener } from './types.js';

/**
 * Framework-agnostic state machine for presentation mode.
 *
 * Linearizes the conversation tree into branches (root-to-leaf paths),
 * then steps through each node as a "slide".
 *
 * Usage:
 * ```ts
 * const ctrl = new PresentationController(snapshot)
 * ctrl.subscribe(slide => render(slide))
 * ctrl.start()
 * // ctrl.next() / ctrl.prev() / ctrl.goto(i) / ctrl.stop()
 * ```
 */
export class PresentationController {
	private slides: Slide[] = [];
	private currentIndex = -1;
	private listeners: Set<PresentationListener> = new Set();
	private keyHandler: ((e: KeyboardEvent) => void) | null = null;
	private opts: PresentationOptions;

	constructor(snapshot: ConversationSnapshot, opts: PresentationOptions = {}) {
		this.opts = opts;
		this.slides = this.buildSlides(snapshot);
	}

	// ── Build slides from snapshot ─────────────────────────────────────────────

	private buildSlides(snapshot: ConversationSnapshot): Slide[] {
		const nodeMap = new Map<string, SerializedNode>();
		for (const n of snapshot.nodes) nodeMap.set(n.id, n);

		const roots = snapshot.nodes.filter(
			(n) => n.parentIds.length === 0 || !nodeMap.has(n.parentIds[0]!)
		);

		// Extract all root-to-leaf threads
		const branches: SerializedNode[][] = [];
		const dfs = (id: string, path: SerializedNode[]): void => {
			const node = nodeMap.get(id);
			if (!node) return;
			if (node.role === 'system' && !this.opts.includeSystem) {
				// Still recurse but skip system nodes
				const childIds = snapshot.nodes.filter((n) => n.parentIds.includes(id)).map((n) => n.id);
				for (const cid of childIds) dfs(cid, path);
				return;
			}
			const newPath = [...path, node];
			const childIds = snapshot.nodes.filter((n) => n.parentIds.includes(id)).map((n) => n.id);
			if (childIds.length === 0) {
				branches.push(newPath);
			} else {
				for (const cid of childIds) dfs(cid, newPath);
			}
		};

		for (const root of roots) dfs(root.id, []);

		// Flatten branches into slides
		const slides: Slide[] = [];
		let globalIndex = 0;
		for (let bi = 0; bi < branches.length; bi++) {
			const branch = branches[bi]!;
			for (let pi = 0; pi < branch.length; pi++) {
				const node = branch[pi]!;
				slides.push({
					index: globalIndex++,
					total: 0, // filled in below
					branchIndex: bi,
					positionInBranch: pi,
					branchLength: branch.length,
					role: node.role,
					content: node.content ?? '',
					nodeId: node.id
				});
			}
		}

		// Patch total
		for (const s of slides) s.total = slides.length;
		return slides;
	}

	// ── Navigation ─────────────────────────────────────────────────────────────

	get total(): number {
		return this.slides.length;
	}

	get current(): Slide | null {
		return this.currentIndex >= 0 ? (this.slides[this.currentIndex] ?? null) : null;
	}

	get isActive(): boolean {
		return this.currentIndex >= 0;
	}

	get isFirst(): boolean {
		return this.currentIndex <= 0;
	}

	get isLast(): boolean {
		return this.currentIndex >= this.slides.length - 1;
	}

	/** Start the presentation from the first slide. */
	start(): void {
		this.goto(0);
		this.attachKeyboardListeners();
	}

	/** Stop the presentation (hides the current slide view). */
	stop(): void {
		this.currentIndex = -1;
		this.detachKeyboardListeners();
		this.notify();
	}

	/** Move to the next slide. Wraps from last to first. */
	next(): void {
		if (this.slides.length === 0) return;
		this.goto((this.currentIndex + 1) % this.slides.length);
	}

	/** Move to the previous slide. Wraps from first to last. */
	prev(): void {
		if (this.slides.length === 0) return;
		this.goto((this.currentIndex - 1 + this.slides.length) % this.slides.length);
	}

	/** Jump to a specific slide index. */
	goto(index: number): void {
		if (index < 0 || index >= this.slides.length) return;
		this.currentIndex = index;
		this.notify();
	}

	// ── Subscriptions ──────────────────────────────────────────────────────────

	/** Subscribe to slide changes. Returns an unsubscribe function. */
	subscribe(listener: PresentationListener): () => void {
		this.listeners.add(listener);
		// Immediately emit current state
		listener(this.current);
		return () => this.listeners.delete(listener);
	}

	private notify(): void {
		for (const l of this.listeners) l(this.current);
	}

	// ── Keyboard ───────────────────────────────────────────────────────────────

	private attachKeyboardListeners(): void {
		if (typeof window === 'undefined') return;
		this.keyHandler = (e: KeyboardEvent) => {
			switch (e.key) {
				case 'ArrowRight':
				case 'ArrowDown':
				case ' ':
				case 'PageDown':
					e.preventDefault();
					this.next();
					break;
				case 'ArrowLeft':
				case 'ArrowUp':
				case 'PageUp':
					e.preventDefault();
					this.prev();
					break;
				case 'Escape':
					this.stop();
					break;
				case 'Home':
					this.goto(0);
					break;
				case 'End':
					this.goto(this.slides.length - 1);
					break;
			}
		};
		window.addEventListener('keydown', this.keyHandler);
	}

	private detachKeyboardListeners(): void {
		if (this.keyHandler && typeof window !== 'undefined') {
			window.removeEventListener('keydown', this.keyHandler);
			this.keyHandler = null;
		}
	}

	/** Clean up all listeners and keyboard handlers. */
	destroy(): void {
		this.stop();
		this.listeners.clear();
	}
}
