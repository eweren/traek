export { default as ThemeProvider } from './ThemeProvider.vue';
export { THEME_KEY } from './context.js';
export type { ThemeContextValue, ThemeProviderProps } from './context.js';
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
import { THEME_KEY } from './context.js';
import type { ThemeContextValue } from './context.js';

/**
 * Access the nearest ThemeProvider context.
 * Throws if no ThemeProvider is mounted.
 */
export function useTheme(): ThemeContextValue {
	const ctx = inject(THEME_KEY);
	if (!ctx) throw new Error('useTheme must be called within a ThemeProvider');
	return ctx;
}
