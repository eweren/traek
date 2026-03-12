export type { TraekTranslations, PartialTraekTranslations } from './types';
export { DEFAULT_TRANSLATIONS } from './defaults';
export { setTraekI18n, getTraekI18n, mergeTranslations } from './context';
export { default as TraekI18nProvider } from './TraekI18nProvider.svelte';

// Built-in locale bundles
export { de, fr, ja, zh } from './locales/index';
