import { computed, inject, provide, type InjectionKey } from 'vue';
import type { TraekTranslations, PartialTraekTranslations } from './types.js';
import { DEFAULT_TRANSLATIONS } from './defaults.js';

export type { TraekTranslations, PartialTraekTranslations } from './types.js';
export { DEFAULT_TRANSLATIONS } from './defaults.js';

// Built-in locale bundles
export { de, fr, ja, zh } from './locales/index.js';

export const I18N_KEY: InjectionKey<TraekTranslations> = Symbol('traek-i18n');

function deepMerge<T extends Record<string, unknown>>(
	defaults: T,
	overrides: Record<string, unknown>
): T {
	const result = { ...defaults };
	for (const key of Object.keys(overrides)) {
		const val = overrides[key];
		if (val === undefined) continue;
		const def = (defaults as Record<string, unknown>)[key];
		if (
			typeof val === 'object' &&
			val !== null &&
			!Array.isArray(val) &&
			typeof val !== 'function' &&
			typeof def === 'object' &&
			def !== null &&
			!Array.isArray(def) &&
			typeof def !== 'function'
		) {
			(result as Record<string, unknown>)[key] = deepMerge(
				def as Record<string, unknown>,
				val as Record<string, unknown>
			);
		} else {
			(result as Record<string, unknown>)[key] = val;
		}
	}
	return result;
}

/** Merge user-provided partial translations with defaults. */
export function mergeTranslations(overrides?: PartialTraekTranslations): TraekTranslations {
	if (!overrides) return DEFAULT_TRANSLATIONS;
	return deepMerge(
		DEFAULT_TRANSLATIONS as unknown as Record<string, unknown>,
		overrides as unknown as Record<string, unknown>
	) as unknown as TraekTranslations;
}

export interface TraekI18nProviderOptions {
	translations?: PartialTraekTranslations;
}

/**
 * Provide translations to a component subtree.
 * Call from a setup() or <script setup> block.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { provideTraekI18n } from '@traek/vue'
 * provideTraekI18n({ translations: { input: { placeholder: 'Type here...' } } })
 * </script>
 * <template><TraekCanvas ... /></template>
 * ```
 */
export function provideTraekI18n(opts?: TraekI18nProviderOptions): void {
	const merged = mergeTranslations(opts?.translations);
	provide(I18N_KEY, merged);
}

/**
 * Access translations from the nearest provideTraekI18n() call.
 * Falls back to defaults if no provider is present.
 */
export function useTraekI18n(): TraekTranslations {
	return inject(I18N_KEY, DEFAULT_TRANSLATIONS);
}
