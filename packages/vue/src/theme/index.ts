export { default as ThemeProvider, THEME_KEY } from './ThemeProvider.vue';
export type { ThemeContextValue, ThemeProviderProps } from './ThemeProvider.vue';
export {
	themes,
	darkTheme,
	lightTheme,
	highContrastTheme,
	createCustomTheme,
	DEFAULT_THEME
} from './themes.js';
export type { ThemeName } from './themes.js';
export { TraekThemeSchema, TraekThemeColorsSchema } from './tokens.js';
export type {
	TraekTheme,
	TraekThemeColors,
	TraekThemeSpacing,
	TraekThemeRadius,
	TraekThemeTypography,
	TraekThemeAnimation
} from './tokens.js';

import { inject } from 'vue';
import { THEME_KEY } from './ThemeProvider.vue';
import type { ThemeContextValue } from './ThemeProvider.vue';

/**
 * Access the nearest ThemeProvider context.
 * Throws if no ThemeProvider is mounted.
 */
export function useTheme(): ThemeContextValue {
	const ctx = inject(THEME_KEY);
	if (!ctx) throw new Error('useTheme must be called within a ThemeProvider');
	return ctx;
}
