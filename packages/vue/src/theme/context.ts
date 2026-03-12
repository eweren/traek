import type { InjectionKey } from 'vue';
import type { TraekTheme } from './tokens.js';
import type { ThemeName } from './themes.js';

export interface ThemeContextValue {
	currentTheme: TraekTheme;
	currentThemeName: ThemeName;
	setTheme: (name: ThemeName) => void;
	applyTheme: (theme: TraekTheme) => void;
}

export const THEME_KEY: InjectionKey<ThemeContextValue> = Symbol('traek-theme');

export interface ThemeProviderProps {
	initialTheme?: ThemeName;
}
