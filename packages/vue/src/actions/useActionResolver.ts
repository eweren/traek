import { reactive, ref } from 'vue';
import type { ActionDefinition, ResolveActions } from './types.js';

export interface ActionResolverState {
	/** IDs suggested by keyword or semantic matching. */
	suggestedIds: string[];
	/** IDs the user has explicitly toggled on. */
	selectedIds: string[];
	/** Whether a stage-2 resolve is in flight. */
	isResolving: boolean;
	/** Current slash-command filter (text after `/` with no space). `null` when inactive. */
	slashFilter: string | null;
}

export interface ActionResolverActions {
	onInputChange: (input: string) => void;
	toggleAction: (id: string) => void;
	selectSlashCommand: (id: string, currentInput: string) => string;
	reset: () => void;
}

/**
 * Two-stage action resolver composable with debounce and caching.
 *
 * Stage 1: Instant keyword matching against `ActionDefinition.keywords`.
 * Stage 2: Async callback (e.g. LLM) for semantic matching, debounced and cached.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useActionResolver } from '@traek/vue'
 * const [state, actions] = useActionResolver(myActions, resolveCallback)
 * actions.onInputChange(inputValue.value)
 * </script>
 * ```
 */
export function useActionResolver(
	actions: ActionDefinition[],
	resolveCallback?: ResolveActions | null,
	debounceMs = 300
): [ActionResolverState, ActionResolverActions] {
	const state = reactive<ActionResolverState>({
		suggestedIds: [],
		selectedIds: [],
		isResolving: false,
		slashFilter: null
	});

	const cache = new Map<string, string[]>();
	let debounceTimer: ReturnType<typeof setTimeout> | null = null;
	let generation = 0;
	let currentActions = actions;
	let currentResolveCallback = resolveCallback;

	// Allow callers to update these without losing state
	const actionsRef = ref(actions);
	const resolveCallbackRef = ref(resolveCallback);
	actionsRef.value = actions;
	resolveCallbackRef.value = resolveCallback;
	currentActions = actions;
	currentResolveCallback = resolveCallback ?? null;

	function cancelDebounce() {
		if (debounceTimer !== null) {
			clearTimeout(debounceTimer);
			debounceTimer = null;
		}
	}

	function mergeSuggestions(keyword: string[], semantic: string[]) {
		state.suggestedIds = [...new Set([...keyword, ...semantic])];
	}

	async function runResolve(input: string, cacheKey: string, keywordMatches: string[]) {
		const cb = resolveCallbackRef.value;
		if (!cb) return;
		const gen = generation;
		state.isResolving = true;
		try {
			const result = await cb(input, currentActions);
			if (gen !== generation) return;
			cache.set(cacheKey, result);
			mergeSuggestions(keywordMatches, result);
		} catch {
			// Silently fail — keyword matches remain
		} finally {
			if (gen === generation) {
				state.isResolving = false;
			}
		}
	}

	function onInputChange(input: string) {
		const trimmed = input.trim();

		// Slash-command detection
		if (trimmed.startsWith('/') && !trimmed.includes(' ')) {
			state.slashFilter = trimmed.slice(1).toLowerCase();
			return;
		}

		state.slashFilter = null;

		if (!trimmed) {
			state.suggestedIds = [];
			cancelDebounce();
			return;
		}

		const lower = trimmed.toLowerCase();
		const keywordMatches = currentActions
			.filter((a) => a.keywords?.some((kw) => lower.includes(kw.toLowerCase())))
			.map((a) => a.id);

		state.suggestedIds = keywordMatches;

		if (resolveCallbackRef.value) {
			cancelDebounce();
			const cacheKey = lower;
			const cached = cache.get(cacheKey);
			if (cached) {
				mergeSuggestions(keywordMatches, cached);
				return;
			}
			debounceTimer = setTimeout(() => {
				runResolve(trimmed, cacheKey, keywordMatches);
			}, debounceMs);
		}
	}

	function toggleAction(id: string) {
		const idx = state.selectedIds.indexOf(id);
		if (idx >= 0) {
			state.selectedIds.splice(idx, 1);
		} else {
			state.selectedIds.push(id);
		}
	}

	function selectSlashCommand(id: string, currentInput: string): string {
		if (!state.selectedIds.includes(id)) {
			state.selectedIds.push(id);
		}
		state.slashFilter = null;
		const match = currentInput.match(/^\/\S*\s*/);
		return match ? currentInput.slice(match[0].length) : '';
	}

	function reset() {
		cancelDebounce();
		generation += 1;
		state.suggestedIds = [];
		state.selectedIds = [];
		state.isResolving = false;
		state.slashFilter = null;
	}

	// Keep refs in sync when caller passes new values
	// (Vue's reactivity handles re-renders; refs track latest values)
	void currentResolveCallback;

	return [state, { onInputChange, toggleAction, selectSlashCommand, reset }];
}
