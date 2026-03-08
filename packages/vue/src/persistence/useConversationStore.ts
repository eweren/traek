import { onUnmounted, ref, watch } from 'vue';
import type { TraekEngine } from '@traek/core';
import { ConversationStore } from './ConversationStore.js';
import type { ConversationStoreOptions, ConversationStoreState } from './ConversationStore.js';

/**
 * Create and manage a ConversationStore instance, initialized on mount.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useConversationStore } from '@traek/vue'
 * const { state, store } = useConversationStore()
 * // state.value.conversations, state.value.saveState, store.create(), etc.
 * </script>
 * ```
 */
export function useConversationStore(options?: ConversationStoreOptions): {
	state: ReturnType<typeof ref<ConversationStoreState>>;
	store: ConversationStore;
} {
	const store = new ConversationStore(options);
	const state = ref<ConversationStoreState>(store.getState());

	const unsub = store.subscribe(() => {
		state.value = store.getState();
	});

	store.init().catch((err) => {
		console.error('[useConversationStore] init failed:', err);
	});

	onUnmounted(() => {
		unsub();
		store.destroy();
	});

	return { state, store };
}

/**
 * Enable auto-save for a given engine + conversation ID.
 * Automatically disables on unmount or when conversationId changes.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useAutoSave } from '@traek/vue'
 * useAutoSave(store, engine, conversationId)
 * </script>
 * ```
 */
export function useAutoSave(
	store: ConversationStore,
	engine: TraekEngine | undefined | null,
	conversationId: string | null
): void {
	watch(
		() => conversationId,
		(id) => {
			if (!engine || !id) {
				store.disableAutoSave();
				return;
			}
			store.enableAutoSave(engine, id);
		},
		{ immediate: true }
	);

	onUnmounted(() => {
		store.disableAutoSave();
	});
}
