import type { TraekTheme } from './tokens';

/**
 * Dark theme — OLED-friendly deep blacks with refined surface elevation.
 * Accent: #00d8ff (cyan). Assistant accent: #ff4400 (vivid orange-red).
 */
export const darkTheme: TraekTheme = {
	colors: {
		// Canvas — near-true black for OLED
		canvasBg: '#070708',
		canvasDot: '#1e1e22',

		// Nodes — elevated surfaces with subtle blue undertone
		nodeBg: '#0e0e10',
		nodeBorder: '#1f1f24',
		nodeText: '#e4e4e7',
		nodeActiveBorder: '#00d8ff',
		nodeActiveGlow: 'rgba(0, 216, 255, 0.12)',
		nodeUserBorderTop: '#00d8ff',
		nodeAssistantBorderTop: '#ff4400',

		// Connections
		connectionStroke: '#252528',
		connectionHighlight: '#00d8ff',

		// Input — frosted glass effect
		inputBg: 'rgba(14, 14, 16, 0.85)',
		inputBorder: '#2a2a30',
		inputShadow: 'rgba(0, 0, 0, 0.6)',
		inputButtonBg: '#00d8ff',
		inputButtonText: '#000000',
		inputText: '#f4f4f5',
		inputContextBg: 'rgba(0, 0, 0, 0.35)',
		inputContextText: '#818189',
		inputDot: '#00d8ff',
		inputDotMuted: '#3f3f46',
		statsText: '#818189',

		// TextNode
		textNodeText: '#e4e4e7',
		textNodeBg: '#111113',
		markdownQuoteBorder: '#2a2a30',
		markdownQuoteText: '#818189',
		markdownHr: '#1f1f24',
		scrollHintBg: 'linear-gradient(transparent, rgba(7, 7, 8, 0.8))',
		scrollHintText: '#818189',
		scrollbarThumb: '#27272a',
		scrollbarThumbHover: '#3f3f46',
		typingCursor: '#ff4400',

		// Search
		searchMatchBorder: 'rgba(250, 204, 21, 0.45)',
		searchDimmedOpacity: 0.35,

		// Thought Panel
		thoughtPanelBg: 'rgba(14, 14, 16, 0.92)',
		thoughtPanelBorder: '#1f1f24',
		thoughtPanelBorderActive: '#00d8ff',
		thoughtPanelGlow: 'rgba(0, 216, 255, 0.12)',
		thoughtHeaderBg: 'rgba(255, 255, 255, 0.025)',
		thoughtHeaderBorder: '#1a1a1e',
		thoughtHeaderMuted: '#818189',
		thoughtHeaderAccent: '#52525b',
		thoughtTagCyan: '#00d8ff',
		thoughtTagOrange: '#ff4400',
		thoughtTagGray: '#3f3f46',
		thoughtDivider: 'rgba(255, 255, 255, 0.05)',
		thoughtRowBg: 'rgba(255, 255, 255, 0.025)',
		thoughtRowMuted1: '#818189',
		thoughtRowMuted2: '#a1a1aa',
		thoughtRowMuted3: '#818189',
		thoughtRowMuted4: '#818189',
		thoughtBadgeCyan: '#00b8d9',
		thoughtFooterMuted: '#a1a1aa',
		thoughtFooterBg: 'rgba(0, 0, 0, 0.25)',
		thoughtFooterBorder: 'rgba(255, 255, 255, 0.04)',
		thoughtToggleBg: '#27272a',
		thoughtToggleBorder: '#3f3f46',

		// Overlays
		overlayGradient1: 'rgba(0, 0, 0, 0.65)',
		overlayGradient2: 'rgba(0, 0, 0, 0.88)',
		overlayGradient3: 'rgba(0, 0, 0, 1)',
		overlayCardBg: 'rgba(14, 14, 16, 0.92)',
		overlayCardBorder: 'rgba(255, 255, 255, 0.07)',
		overlayCardShadow: 'rgba(0, 0, 0, 0.9)',
		overlayText: '#e4e4e7',
		overlayPillBg: '#00d8ff',
		overlayPillShadow: 'rgba(0, 216, 255, 0.65)',

		// Node color coding
		nodeColorRed: '#ef4444',
		nodeColorOrange: '#f97316',
		nodeColorYellow: '#eab308',
		nodeColorGreen: '#22c55e',
		nodeColorBlue: '#3b82f6',
		nodeColorPurple: '#a855f7',
		nodeColorPink: '#ec4899',
		nodeColorCyan: '#06b6d4',
		// Sidebar
		sidebarBg: '#1a1a2e',
		sidebarBorder: 'rgba(255,255,255,0.08)'
	},
	spacing: {
		xs: 4,
		sm: 8,
		md: 16,
		lg: 24,
		xl: 32
	},
	radius: {
		sm: 6,
		md: 12,
		lg: 24
	},
	typography: {
		fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
		fontMono: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
		sizes: {
			xs: '10px',
			sm: '12px',
			base: '14px',
			lg: '16px',
			xl: '20px',
			'2xl': '28px'
		},
		weights: {
			normal: 400,
			medium: 500,
			semibold: 600,
			bold: 700
		}
	},
	animation: {
		fast: 120,
		normal: 220,
		slow: 380
	}
};

/**
 * Light theme — warm off-white canvas with strong text contrast.
 * WCAG AA compliant throughout. Accent: #007aad (deeper cyan for contrast).
 */
export const lightTheme: TraekTheme = {
	colors: {
		// Canvas — warm off-white, easier on the eyes than pure grey
		canvasBg: '#f4f4f5',
		canvasDot: '#d4d4d8',

		// Nodes — pure white cards on warm canvas, clear separation
		nodeBg: '#ffffff',
		nodeBorder: '#e4e4e7',
		nodeText: '#18181b',
		nodeActiveBorder: '#007aad',
		nodeActiveGlow: 'rgba(0, 122, 173, 0.15)',
		nodeUserBorderTop: '#007aad',
		nodeAssistantBorderTop: '#c93a00',

		// Connections
		connectionStroke: '#d4d4d8',
		connectionHighlight: '#007aad',

		// Input — crisp white, clear contrast
		inputBg: 'rgba(255, 255, 255, 0.97)',
		inputBorder: '#d4d4d8',
		inputShadow: 'rgba(0, 0, 0, 0.08)',
		inputButtonBg: '#007aad',
		inputButtonText: '#ffffff',
		inputText: '#18181b',
		inputContextBg: 'rgba(0, 0, 0, 0.04)',
		inputContextText: '#52525b',
		inputDot: '#007aad',
		inputDotMuted: '#d4d4d8',
		statsText: '#71717a',

		// TextNode — 18.1:1 contrast (#18181b on #ffffff)
		textNodeText: '#18181b',
		textNodeBg: '#ffffff',
		markdownQuoteBorder: '#d4d4d8',
		markdownQuoteText: '#52525b',
		markdownHr: '#e4e4e7',
		scrollHintBg: 'linear-gradient(transparent, rgba(255, 255, 255, 0.9))',
		scrollHintText: '#71717a',
		scrollbarThumb: '#d4d4d8',
		scrollbarThumbHover: '#a1a1aa',
		typingCursor: '#c93a00',

		// Search
		searchMatchBorder: 'rgba(202, 138, 4, 0.55)',
		searchDimmedOpacity: 0.28,

		// Thought Panel
		thoughtPanelBg: 'rgba(255, 255, 255, 0.97)',
		thoughtPanelBorder: '#e4e4e7',
		thoughtPanelBorderActive: '#007aad',
		thoughtPanelGlow: 'rgba(0, 122, 173, 0.15)',
		thoughtHeaderBg: 'rgba(0, 0, 0, 0.025)',
		thoughtHeaderBorder: '#f4f4f5',
		thoughtHeaderMuted: '#52525b',
		thoughtHeaderAccent: '#3f3f46',
		thoughtTagCyan: '#007aad',
		thoughtTagOrange: '#c93a00',
		thoughtTagGray: '#d4d4d8',
		thoughtDivider: 'rgba(0, 0, 0, 0.05)',
		thoughtRowBg: 'rgba(0, 0, 0, 0.018)',
		thoughtRowMuted1: '#52525b',
		thoughtRowMuted2: '#3f3f46',
		thoughtRowMuted3: '#52525b',
		thoughtRowMuted4: '#52525b',
		thoughtBadgeCyan: '#005a80',
		thoughtFooterMuted: '#27272a',
		thoughtFooterBg: 'rgba(0, 0, 0, 0.03)',
		thoughtFooterBorder: 'rgba(0, 0, 0, 0.05)',
		thoughtToggleBg: '#e4e4e7',
		thoughtToggleBorder: '#d4d4d8',

		// Overlays
		overlayGradient1: 'rgba(0, 0, 0, 0.35)',
		overlayGradient2: 'rgba(0, 0, 0, 0.55)',
		overlayGradient3: 'rgba(0, 0, 0, 0.82)',
		overlayCardBg: 'rgba(255, 255, 255, 0.97)',
		overlayCardBorder: 'rgba(0, 0, 0, 0.09)',
		overlayCardShadow: 'rgba(0, 0, 0, 0.15)',
		overlayText: '#18181b',
		overlayPillBg: '#007aad',
		overlayPillShadow: 'rgba(0, 122, 173, 0.35)',

		// Node color coding
		nodeColorRed: '#ef4444',
		nodeColorOrange: '#f97316',
		nodeColorYellow: '#eab308',
		nodeColorGreen: '#22c55e',
		nodeColorBlue: '#3b82f6',
		nodeColorPurple: '#a855f7',
		nodeColorPink: '#ec4899',
		nodeColorCyan: '#06b6d4',
		// Sidebar
		sidebarBg: '#f0f0f5',
		sidebarBorder: 'rgba(0,0,0,0.08)'
	},
	spacing: {
		xs: 4,
		sm: 8,
		md: 16,
		lg: 24,
		xl: 32
	},
	radius: {
		sm: 6,
		md: 12,
		lg: 24
	},
	typography: {
		fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
		fontMono: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
		sizes: {
			xs: '10px',
			sm: '12px',
			base: '14px',
			lg: '16px',
			xl: '20px',
			'2xl': '28px'
		},
		weights: {
			normal: 400,
			medium: 500,
			semibold: 600,
			bold: 700
		}
	},
	animation: {
		fast: 120,
		normal: 220,
		slow: 380
	}
};

/**
 * High contrast theme - WCAG AAA compliant with >7:1 contrast ratios
 */
export const highContrastTheme: TraekTheme = {
	colors: {
		// Canvas
		canvasBg: '#000000',
		canvasDot: '#555555',

		// Nodes
		nodeBg: '#000000',
		nodeBorder: '#ffffff',
		nodeText: '#ffffff',
		nodeActiveBorder: '#00ffff',
		nodeActiveGlow: 'rgba(0, 255, 255, 0.3)',
		nodeUserBorderTop: '#00ffff',
		nodeAssistantBorderTop: '#ffff00',

		// Connections
		connectionStroke: '#ffffff',
		connectionHighlight: '#00ffff',

		// Input
		inputBg: 'rgba(0, 0, 0, 0.95)',
		inputBorder: '#ffffff',
		inputShadow: 'rgba(255, 255, 255, 0.2)',
		inputButtonBg: '#00ffff',
		inputButtonText: '#000000',
		inputText: '#ffffff',
		inputContextBg: 'rgba(255, 255, 255, 0.1)',
		inputContextText: '#ffffff',
		inputDot: '#00ffff',
		inputDotMuted: '#ffffff',
		statsText: '#ffffff',

		// TextNode
		textNodeText: '#ffffff',
		textNodeBg: '#000000',
		markdownQuoteBorder: '#ffffff',
		markdownQuoteText: '#ffffff',
		markdownHr: '#ffffff',
		scrollHintBg: 'linear-gradient(transparent, rgba(0, 0, 0, 0.9))',
		scrollHintText: '#ffffff',
		scrollbarThumb: '#ffffff',
		scrollbarThumbHover: '#00ffff',
		typingCursor: '#ffff00',

		// Search
		searchMatchBorder: 'rgba(255, 255, 0, 0.8)',
		searchDimmedOpacity: 0.5,

		// Thought Panel
		thoughtPanelBg: 'rgba(0, 0, 0, 0.95)',
		thoughtPanelBorder: '#ffffff',
		thoughtPanelBorderActive: '#00ffff',
		thoughtPanelGlow: 'rgba(0, 255, 255, 0.3)',
		thoughtHeaderBg: 'rgba(255, 255, 255, 0.1)',
		thoughtHeaderBorder: '#ffffff',
		thoughtHeaderMuted: '#ffffff',
		thoughtHeaderAccent: '#ffffff',
		thoughtTagCyan: '#00ffff',
		thoughtTagOrange: '#ffff00',
		thoughtTagGray: '#ffffff',
		thoughtDivider: 'rgba(255, 255, 255, 0.2)',
		thoughtRowBg: 'rgba(255, 255, 255, 0.05)',
		thoughtRowMuted1: '#ffffff',
		thoughtRowMuted2: '#ffffff',
		thoughtRowMuted3: '#ffffff',
		thoughtRowMuted4: '#ffffff',
		thoughtBadgeCyan: '#00ffff',
		thoughtFooterMuted: '#ffffff',
		thoughtFooterBg: 'rgba(255, 255, 255, 0.1)',
		thoughtFooterBorder: 'rgba(255, 255, 255, 0.2)',
		thoughtToggleBg: '#000000',
		thoughtToggleBorder: '#ffffff',

		// Overlays
		overlayGradient1: 'rgba(0, 0, 0, 0.9)',
		overlayGradient2: 'rgba(0, 0, 0, 0.95)',
		overlayGradient3: 'rgba(0, 0, 0, 1)',
		overlayCardBg: 'rgba(0, 0, 0, 0.95)',
		overlayCardBorder: 'rgba(255, 255, 255, 0.3)',
		overlayCardShadow: 'rgba(255, 255, 255, 0.2)',
		overlayText: '#ffffff',
		overlayPillBg: '#00ffff',
		overlayPillShadow: 'rgba(0, 255, 255, 0.8)',

		// Node color coding
		nodeColorRed: '#ef4444',
		nodeColorOrange: '#f97316',
		nodeColorYellow: '#eab308',
		nodeColorGreen: '#22c55e',
		nodeColorBlue: '#3b82f6',
		nodeColorPurple: '#a855f7',
		nodeColorPink: '#ec4899',
		nodeColorCyan: '#06b6d4',
		// Sidebar
		sidebarBg: '#000000',
		sidebarBorder: '#ffffff'
	},
	spacing: {
		xs: 4,
		sm: 8,
		md: 16,
		lg: 24,
		xl: 32
	},
	radius: {
		sm: 6,
		md: 12,
		lg: 24
	},
	typography: {
		fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
		fontMono: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
		sizes: {
			xs: '10px',
			sm: '12px',
			base: '14px',
			lg: '16px',
			xl: '20px',
			'2xl': '28px'
		},
		weights: {
			normal: 400,
			medium: 500,
			semibold: 600,
			bold: 700
		}
	},
	animation: {
		fast: 120,
		normal: 220,
		slow: 380
	}
};

/**
 * Theme registry - map of theme names to theme objects
 */
export const themes = {
	dark: darkTheme,
	light: lightTheme,
	highContrast: highContrastTheme
} as const;

/**
 * Theme names
 */
export type ThemeName = keyof typeof themes;

/**
 * Default theme name
 */
export const DEFAULT_THEME: ThemeName = 'dark';

/**
 * Generate color variations for the accent color
 */
function generateAccentVariations(accentHex: string): {
	base: string;
	light: string;
	dark: string;
	alpha15: string;
	alpha20: string;
	alpha30: string;
} {
	// Parse hex color
	const hex = accentHex.replace('#', '');
	const r = parseInt(hex.slice(0, 2), 16);
	const g = parseInt(hex.slice(2, 4), 16);
	const b = parseInt(hex.slice(4, 6), 16);

	// Generate lighter version (+20% brightness)
	const lighter = (v: number) => Math.min(255, Math.floor(v * 1.2));
	const light = `#${lighter(r).toString(16).padStart(2, '0')}${lighter(g).toString(16).padStart(2, '0')}${lighter(b).toString(16).padStart(2, '0')}`;

	// Generate darker version (-20% brightness)
	const darker = (v: number) => Math.floor(v * 0.8);
	const dark = `#${darker(r).toString(16).padStart(2, '0')}${darker(g).toString(16).padStart(2, '0')}${darker(b).toString(16).padStart(2, '0')}`;

	return {
		base: accentHex,
		light,
		dark,
		alpha15: `rgba(${r}, ${g}, ${b}, 0.15)`,
		alpha20: `rgba(${r}, ${g}, ${b}, 0.2)`,
		alpha30: `rgba(${r}, ${g}, ${b}, 0.3)`
	};
}

/**
 * Create a custom theme by replacing the accent color in a base theme
 */
export function createCustomTheme(baseTheme: TraekTheme, accentColor: string): TraekTheme {
	const variations = generateAccentVariations(accentColor);

	// Deep clone the base theme
	const customTheme: TraekTheme = JSON.parse(JSON.stringify(baseTheme));

	// Replace all accent colors in the theme
	customTheme.colors.nodeActiveBorder = variations.base;
	customTheme.colors.nodeActiveGlow = variations.alpha15;
	customTheme.colors.nodeUserBorderTop = variations.base;
	customTheme.colors.connectionHighlight = variations.base;
	customTheme.colors.inputButtonBg = variations.base;
	customTheme.colors.inputDot = variations.base;
	customTheme.colors.thoughtPanelBorderActive = variations.base;
	customTheme.colors.thoughtPanelGlow = variations.alpha15;
	customTheme.colors.thoughtTagCyan = variations.base;
	customTheme.colors.thoughtBadgeCyan = variations.light;
	customTheme.colors.overlayPillBg = variations.base;
	customTheme.colors.overlayPillShadow = variations.alpha20;

	return customTheme;
}
