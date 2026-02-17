import { useCallback, useMemo, useSyncExternalStore } from 'react'
import { TraekEngine } from '@traek/core'
import type { TraekEngineConfig } from '@traek/core'

/**
 * Subscribe to a TraekEngine instance and return its current reactive state.
 *
 * Uses React 18's `useSyncExternalStore` for tear-free rendering.
 *
 * @example
 * ```tsx
 * const engine = useMemo(() => new TraekEngine(), [])
 * const state = useTraekEngine(engine)
 *
 * return <div>{state.nodes.length} nodes</div>
 * ```
 */
export function useTraekEngine(engine: TraekEngine) {
	const getSnapshot = useCallback(() => engine.getSnapshot(), [engine])

	// useSyncExternalStore requires the subscribe callback NOT to call the
	// listener immediately (React calls getSnapshot() separately), but the
	// TraekEngine.subscribe() does call immediately.  We wrap it to skip
	// the immediate call.
	const subscribe = useCallback(
		(onStoreChange: () => void) => {
			let initialized = false
			const unsub = engine.subscribe(() => {
				if (!initialized) {
					initialized = true
					return
				}
				onStoreChange()
			})
			return unsub
		},
		[engine]
	)

	return useSyncExternalStore(subscribe, getSnapshot)
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
	return useMemo(() => new TraekEngine(config), [])
}
