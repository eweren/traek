import { useCallback, useMemo, useRef, useSyncExternalStore } from 'react';
import { TraekEngine } from '@traek/core';
import type { Node, TraekEngineConfig } from '@traek/core';

type Snapshot = ReturnType<TraekEngine['getSnapshot']>;

/** Cached empty snapshot for SSR; matches getSnapshot() shape. */
const EMPTY_SNAPSHOT: Snapshot = {
	nodes: [] as Node[],
	activeNodeId: null,
	collapsedNodes: new Set<string>(),
	searchQuery: '',
	searchMatches: [],
	currentSearchIndex: 0,
	pendingFocusNodeId: null
};

/** No-op subscribe when engine is missing (SSR/hydration). */
function noopSubscribe(_onStoreChange: () => void): () => void {
	return () => {};
}

function snapshotEqual(a: Snapshot, b: Snapshot): boolean {
	return (
		a.nodes === b.nodes &&
		a.activeNodeId === b.activeNodeId &&
		a.collapsedNodes === b.collapsedNodes &&
		a.searchQuery === b.searchQuery &&
		a.searchMatches === b.searchMatches &&
		a.currentSearchIndex === b.currentSearchIndex &&
		a.pendingFocusNodeId === b.pendingFocusNodeId
	);
}

/**
 * Subscribe to a TraekEngine instance and return its current reactive state.
 *
 * Uses React 18's `useSyncExternalStore` for tear-free rendering.
 * Caches snapshot by identity so we return the same reference when engine state
 * is unchanged (core getSnapshot() returns a new object every time, which would
 * otherwise cause infinite re-renders).
 * If engine is undefined (e.g. during hydration), returns EMPTY_SNAPSHOT.
 *
 * @example
 * ```tsx
 * const engine = useMemo(() => new TraekEngine(), [])
 * const state = useTraekEngine(engine)
 *
 * return <div>{state.nodes.length} nodes</div>
 * ```
 */
export function useTraekEngine(engine: TraekEngine | undefined) {
	const lastSnapshotRef = useRef<Snapshot | null>(null);

	const subscribe = useCallback(
		(onStoreChange: () => void) =>
			engine ? engine.subscribe(onStoreChange) : noopSubscribe(onStoreChange),
		[engine]
	);

	const getSnapshot = useCallback(() => {
		const next = engine ? engine.getSnapshot() : EMPTY_SNAPSHOT;
		const last = lastSnapshotRef.current;
		if (last && snapshotEqual(last, next)) return last;
		lastSnapshotRef.current = next;
		return next;
	}, [engine]);

	const getServerSnapshot = useCallback(() => EMPTY_SNAPSHOT, []);

	return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Create a new TraekEngine instance that is stable across renders.
 *
 * @example
 * ```tsx
 * function MyChat() {
 *   const engine = useCreateTraekEngine({ nodeWidth: 400 })
 *   const { nodes } = useTraekEngine(engine)
 *   // ...
 * }
 * ```
 */
export function useCreateTraekEngine(config?: Partial<TraekEngineConfig>): TraekEngine {
	// useMemo with no deps creates the engine once per component mount.
	// eslint-disable-next-line react-hooks/exhaustive-deps
	return useMemo(() => new TraekEngine(config), []);
}
