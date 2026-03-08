<script lang="ts" module>
	import { setContext, getContext } from 'svelte';
	import type { TraekTheme } from './tokens';
	import type { ThemeName } from './themes';
	import { themes, DEFAULT_THEME } from './themes';

	const THEME_CONTEXT_KEY = Symbol('traek-theme');

	export interface ThemeContext {
		currentTheme: () => TraekTheme;
		currentThemeName: () => ThemeName;
		setTheme: (themeName: ThemeName) => void;
		applyTheme: (theme: TraekTheme) => void;
	}

	/**
	 * Get the theme context from the nearest ThemeProvider ancestor
	 */
	export function useTheme(): ThemeContext {
		const context = getContext<ThemeContext>(THEME_CONTEXT_KEY);
		if (!context) {
			throw new Error('useTheme must be called within a ThemeProvider');
		}
		return context;
	}

	/**
	 * Apply a theme by setting CSS custom properties on :root
	 */
	export function applyThemeToRoot(theme: TraekTheme, themeName?: ThemeName): void {
		if (typeof document === 'undefined') return;

		const root = document.documentElement;

		// Set data-theme attribute for backward compatibility
		if (themeName) {
			root.setAttribute('data-theme', themeName);
		}

		// Colors
		root.style.setProperty('--traek-canvas-bg', theme.colors.canvasBg);
		root.style.setProperty('--traek-canvas-dot', theme.colors.canvasDot);
		root.style.setProperty('--traek-node-bg', theme.colors.nodeBg);
		root.style.setProperty('--traek-node-border', theme.colors.nodeBorder);
		root.style.setProperty('--traek-node-text', theme.colors.nodeText);
		root.style.setProperty('--traek-node-active-border', theme.colors.nodeActiveBorder);
		root.style.setProperty('--traek-node-active-glow', theme.colors.nodeActiveGlow);
		root.style.setProperty('--traek-node-user-border-top', theme.colors.nodeUserBorderTop);
		root.style.setProperty(
			'--traek-node-assistant-border-top',
			theme.colors.nodeAssistantBorderTop
		);
		root.style.setProperty('--traek-connection-stroke', theme.colors.connectionStroke);
		root.style.setProperty('--traek-connection-highlight', theme.colors.connectionHighlight);
		root.style.setProperty('--traek-input-bg', theme.colors.inputBg);
		root.style.setProperty('--traek-input-border', theme.colors.inputBorder);
		root.style.setProperty('--traek-input-shadow', theme.colors.inputShadow);
		root.style.setProperty('--traek-input-button-bg', theme.colors.inputButtonBg);
		root.style.setProperty('--traek-input-button-text', theme.colors.inputButtonText);
		root.style.setProperty('--traek-input-text', theme.colors.inputText);
		root.style.setProperty('--traek-input-context-bg', theme.colors.inputContextBg);
		root.style.setProperty('--traek-input-context-text', theme.colors.inputContextText);
		root.style.setProperty('--traek-input-dot', theme.colors.inputDot);
		root.style.setProperty('--traek-input-dot-muted', theme.colors.inputDotMuted);
		root.style.setProperty('--traek-stats-text', theme.colors.statsText);
		root.style.setProperty('--traek-textnode-text', theme.colors.textNodeText);
		root.style.setProperty('--traek-textnode-bg', theme.colors.textNodeBg);
		root.style.setProperty('--traek-markdown-quote-border', theme.colors.markdownQuoteBorder);
		root.style.setProperty('--traek-markdown-quote-text', theme.colors.markdownQuoteText);
		root.style.setProperty('--traek-markdown-hr', theme.colors.markdownHr);
		root.style.setProperty('--traek-scroll-hint-bg', theme.colors.scrollHintBg);
		root.style.setProperty('--traek-scroll-hint-text', theme.colors.scrollHintText);
		root.style.setProperty('--traek-scrollbar-thumb', theme.colors.scrollbarThumb);
		root.style.setProperty('--traek-scrollbar-thumb-hover', theme.colors.scrollbarThumbHover);
		root.style.setProperty('--traek-typing-cursor', theme.colors.typingCursor);
		root.style.setProperty('--traek-search-match-border', theme.colors.searchMatchBorder);
		root.style.setProperty(
			'--traek-search-dimmed-opacity',
			theme.colors.searchDimmedOpacity.toString()
		);
		root.style.setProperty('--traek-thought-panel-bg', theme.colors.thoughtPanelBg);
		root.style.setProperty('--traek-thought-panel-border', theme.colors.thoughtPanelBorder);
		root.style.setProperty(
			'--traek-thought-panel-border-active',
			theme.colors.thoughtPanelBorderActive
		);
		root.style.setProperty('--traek-thought-panel-glow', theme.colors.thoughtPanelGlow);
		root.style.setProperty('--traek-thought-header-bg', theme.colors.thoughtHeaderBg);
		root.style.setProperty('--traek-thought-header-border', theme.colors.thoughtHeaderBorder);
		root.style.setProperty('--traek-thought-header-muted', theme.colors.thoughtHeaderMuted);
		root.style.setProperty('--traek-thought-header-accent', theme.colors.thoughtHeaderAccent);
		root.style.setProperty('--traek-thought-tag-cyan', theme.colors.thoughtTagCyan);
		root.style.setProperty('--traek-thought-tag-orange', theme.colors.thoughtTagOrange);
		root.style.setProperty('--traek-thought-tag-gray', theme.colors.thoughtTagGray);
		root.style.setProperty('--traek-thought-divider', theme.colors.thoughtDivider);
		root.style.setProperty('--traek-thought-row-bg', theme.colors.thoughtRowBg);
		root.style.setProperty('--traek-thought-row-muted-1', theme.colors.thoughtRowMuted1);
		root.style.setProperty('--traek-thought-row-muted-2', theme.colors.thoughtRowMuted2);
		root.style.setProperty('--traek-thought-row-muted-3', theme.colors.thoughtRowMuted3);
		root.style.setProperty('--traek-thought-row-muted-4', theme.colors.thoughtRowMuted4);
		root.style.setProperty('--traek-thought-badge-cyan', theme.colors.thoughtBadgeCyan);
		root.style.setProperty('--traek-thought-footer-muted', theme.colors.thoughtFooterMuted);
		root.style.setProperty('--traek-thought-footer-bg', theme.colors.thoughtFooterBg);
		root.style.setProperty('--traek-thought-footer-border', theme.colors.thoughtFooterBorder);
		root.style.setProperty('--traek-thought-toggle-bg', theme.colors.thoughtToggleBg);
		root.style.setProperty('--traek-thought-toggle-border', theme.colors.thoughtToggleBorder);
		root.style.setProperty('--traek-overlay-gradient-1', theme.colors.overlayGradient1);
		root.style.setProperty('--traek-overlay-gradient-2', theme.colors.overlayGradient2);
		root.style.setProperty('--traek-overlay-gradient-3', theme.colors.overlayGradient3);
		root.style.setProperty('--traek-overlay-card-bg', theme.colors.overlayCardBg);
		root.style.setProperty('--traek-overlay-card-border', theme.colors.overlayCardBorder);
		root.style.setProperty('--traek-overlay-card-shadow', theme.colors.overlayCardShadow);
		root.style.setProperty('--traek-overlay-text', theme.colors.overlayText);
		root.style.setProperty('--traek-overlay-pill-bg', theme.colors.overlayPillBg);
		root.style.setProperty('--traek-overlay-pill-shadow', theme.colors.overlayPillShadow);
		root.style.setProperty('--traek-color-red', theme.colors.nodeColorRed ?? '#ef4444');
		root.style.setProperty('--traek-color-orange', theme.colors.nodeColorOrange ?? '#f97316');
		root.style.setProperty('--traek-color-yellow', theme.colors.nodeColorYellow ?? '#eab308');
		root.style.setProperty('--traek-color-green', theme.colors.nodeColorGreen ?? '#22c55e');
		root.style.setProperty('--traek-color-blue', theme.colors.nodeColorBlue ?? '#3b82f6');
		root.style.setProperty('--traek-color-purple', theme.colors.nodeColorPurple ?? '#a855f7');
		root.style.setProperty('--traek-color-pink', theme.colors.nodeColorPink ?? '#ec4899');
		root.style.setProperty('--traek-color-cyan', theme.colors.nodeColorCyan ?? '#06b6d4');
		root.style.setProperty('--traek-sidebar-bg', theme.colors.sidebarBg ?? '#1a1a2e');
		root.style.setProperty(
			'--traek-sidebar-border',
			theme.colors.sidebarBorder ?? 'rgba(255,255,255,0.08)'
		);

		// Spacing
		root.style.setProperty('--traek-space-xs', `${theme.spacing.xs}px`);
		root.style.setProperty('--traek-space-sm', `${theme.spacing.sm}px`);
		root.style.setProperty('--traek-space-md', `${theme.spacing.md}px`);
		root.style.setProperty('--traek-space-lg', `${theme.spacing.lg}px`);
		root.style.setProperty('--traek-space-xl', `${theme.spacing.xl}px`);

		// Border radius
		root.style.setProperty('--traek-radius-sm', `${theme.radius.sm}px`);
		root.style.setProperty('--traek-radius-md', `${theme.radius.md}px`);
		root.style.setProperty('--traek-radius-lg', `${theme.radius.lg}px`);

		// Typography — family & mono
		root.style.setProperty('--traek-font-family', theme.typography.fontFamily);
		root.style.setProperty('--traek-font-mono', theme.typography.fontMono);

		// Typography — sizes
		root.style.setProperty('--traek-text-xs', theme.typography.sizes.xs);
		root.style.setProperty('--traek-text-sm', theme.typography.sizes.sm);
		root.style.setProperty('--traek-text-base', theme.typography.sizes.base);
		root.style.setProperty('--traek-text-lg', theme.typography.sizes.lg);
		root.style.setProperty('--traek-text-xl', theme.typography.sizes.xl);
		root.style.setProperty('--traek-text-2xl', theme.typography.sizes['2xl']);

		// Typography — weights
		root.style.setProperty('--traek-weight-normal', theme.typography.weights.normal.toString());
		root.style.setProperty('--traek-weight-medium', theme.typography.weights.medium.toString());
		root.style.setProperty('--traek-weight-semibold', theme.typography.weights.semibold.toString());
		root.style.setProperty('--traek-weight-bold', theme.typography.weights.bold.toString());

		// Animation durations
		root.style.setProperty('--traek-duration-fast', `${theme.animation.fast}ms`);
		root.style.setProperty('--traek-duration-normal', `${theme.animation.normal}ms`);
		root.style.setProperty('--traek-duration-slow', `${theme.animation.slow}ms`);
	}

	/**
	 * Apply theme CSS variables with a brief transition for smooth switching.
	 * Adds the transition class, applies vars, then removes the class after animation.
	 */
	export function applyThemeToRootAnimated(theme: TraekTheme, themeName?: ThemeName): void {
		if (typeof document === 'undefined') return;
		const root = document.documentElement;
		root.classList.add('traek-theme-transitioning');
		applyThemeToRoot(theme, themeName);
		// Remove transition class after animation completes
		const cleanup = () => root.classList.remove('traek-theme-transitioning');
		setTimeout(cleanup, 320);
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	let {
		initialTheme = DEFAULT_THEME,
		children
	}: { initialTheme?: ThemeName; children: import('svelte').Snippet } = $props();

	let currentThemeName = $state<ThemeName>(DEFAULT_THEME);
	let currentTheme = $state<TraekTheme>(themes[DEFAULT_THEME]);

	// Initialize theme from props
	$effect(() => {
		if (initialTheme !== currentThemeName) {
			currentThemeName = initialTheme;
			currentTheme = themes[initialTheme];
		}
	});

	/**
	 * Set theme by name
	 */
	function setTheme(themeName: ThemeName): void {
		if (!themes[themeName]) {
			console.warn(`Theme "${themeName}" not found, falling back to default`);
			themeName = DEFAULT_THEME;
		}

		currentThemeName = themeName;
		currentTheme = themes[themeName];
		applyThemeToRoot(currentTheme, themeName);
	}

	/**
	 * Apply a custom theme object
	 */
	function applyTheme(theme: TraekTheme): void {
		currentTheme = theme;
		applyThemeToRoot(theme);
	}

	/**
	 * Get current theme object
	 */
	function getCurrentTheme(): TraekTheme {
		return currentTheme;
	}

	/**
	 * Get current theme name
	 */
	function getCurrentThemeName(): ThemeName {
		return currentThemeName;
	}

	// Set up context
	const themeContext: ThemeContext = {
		currentTheme: getCurrentTheme,
		currentThemeName: getCurrentThemeName,
		setTheme,
		applyTheme
	};

	setContext(THEME_CONTEXT_KEY, themeContext);

	// Apply initial theme on mount
	onMount(() => {
		applyThemeToRoot(currentTheme, currentThemeName);
	});
</script>

{@render children()}
