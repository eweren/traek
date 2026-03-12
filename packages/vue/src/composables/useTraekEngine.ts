import { onUnmounted, readonly, ref, shallowRef, type Ref, type ShallowRef } from 'vue';
import { TraekEngine } from '@traek/core';
import type { TraekEngineConfig } from '@traek/core';

export interface TraekEngineRefs {
	nodes: ShallowRef<TraekEngine['nodes']>;
	activeNodeId: Ref<TraekEngine['activeNodeId']>;
	collapsedNodes: Ref<TraekEngine['collapsedNodes']>;
	searchQuery: Ref<string>;
	searchMatches: Ref<string[]>;
	currentSearchIndex: Ref<number>;
	pendingFocusNodeId: Ref<string | null>;
	engine: TraekEngine;
}

/**
 * Subscribe to a TraekEngine instance and return Vue reactive refs.
 *
 * Uses `shallowRef` for the `nodes` array to avoid deep reactivity overhead
 * (individual node mutations are handled by re-assigning the ref).
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useTraekEngine } from '@traek/vue'
 * import { TraekEngine } from '@traek/core'
 *
 * const engine = new TraekEngine()
 * const { nodes, activeNodeId } = useTraekEngine(engine)
 * </script>
 *
 * <template>
 *   <div>{{ nodes.length }} nodes</div>
 * </template>
 * ```
 */
export function useTraekEngine(engine: TraekEngine): TraekEngineRefs {
	const nodes = shallowRef<TraekEngine['nodes']>(engine.nodes);
	const activeNodeId = ref<TraekEngine['activeNodeId']>(engine.activeNodeId);
	const collapsedNodes = ref<TraekEngine['collapsedNodes']>(new Set(engine.collapsedNodes));
	const searchQuery = ref<string>(engine.searchQuery);
	const searchMatches = ref<string[]>([...engine.searchMatches]);
	const currentSearchIndex = ref<number>(engine.currentSearchIndex);
	const pendingFocusNodeId = ref<string | null>(engine.pendingFocusNodeId);

	const unsub = engine.subscribe(() => {
		// Trigger shallowRef by assigning a new reference.
		// For the nodes array, the core engine mutates in-place (push/splice)
		// OR replaces the array. Assigning the reference ensures Vue picks up both.
		nodes.value = engine.nodes;
		activeNodeId.value = engine.activeNodeId;
		// Copy Set to trigger ref reactivity
		collapsedNodes.value = new Set(engine.collapsedNodes);
		searchQuery.value = engine.searchQuery;
		searchMatches.value = [...engine.searchMatches];
		currentSearchIndex.value = engine.currentSearchIndex;
		pendingFocusNodeId.value = engine.pendingFocusNodeId;
	});

	onUnmounted(unsub);

	return {
		nodes: readonly(nodes) as ShallowRef<TraekEngine['nodes']>,
		activeNodeId,
		collapsedNodes,
		searchQuery,
		searchMatches,
		currentSearchIndex,
		pendingFocusNodeId,
		engine
	};
}

/**
 * Create a new TraekEngine instance that lives for the lifetime of the component.
 * Cleans up subscriptions automatically on unmount.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useCreateTraekEngine, useTraekEngine } from '@traek/vue'
 *
 * const engine = useCreateTraekEngine({ nodeWidth: 400 })
 * const { nodes } = useTraekEngine(engine)
 * </script>
 * ```
 */
export function useCreateTraekEngine(config?: Partial<TraekEngineConfig>): TraekEngine {
	return new TraekEngine(config);
}
