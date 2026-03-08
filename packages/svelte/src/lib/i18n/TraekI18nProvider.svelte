<script lang="ts">
	import { setContext } from 'svelte';
	import type { Snippet } from 'svelte';
	import { I18N_KEY, mergeTranslations } from './context';
	import type { PartialTraekTranslations } from './types';

	interface Props {
		/** Partial or full translation overrides merged onto English defaults. */
		translations?: PartialTraekTranslations;
		/**
		 * Text directionality for RTL language support.
		 * Set to `'rtl'` for Arabic, Hebrew, and other right-to-left languages.
		 * @default 'ltr'
		 */
		dir?: 'ltr' | 'rtl' | 'auto';
		children: Snippet;
	}

	let { translations, dir = 'ltr', children }: Props = $props();

	const resolved = $derived(mergeTranslations(translations));

	// Provide a getter so child components always read the latest merged value.
	setContext(I18N_KEY, { get: () => resolved });
</script>

<div class="traek-i18n-provider" {dir}>
	{@render children()}
</div>

<style>
	.traek-i18n-provider {
		display: contents;
	}
</style>
