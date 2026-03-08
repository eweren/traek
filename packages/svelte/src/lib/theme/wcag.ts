import type { TraekTheme } from './tokens';

/**
 * A pair of foreground/background color keys from a TraekTheme to validate for contrast.
 */
export interface ContrastPair {
	label: string;
	fgKey: keyof TraekTheme['colors'];
	bgKey: keyof TraekTheme['colors'];
	isLargeText?: boolean;
}

/**
 * Result of a single contrast check.
 */
export interface ContrastResult {
	label: string;
	fg: string;
	bg: string;
	ratio: number;
	passesAA: boolean;
	passesAAA: boolean;
	isLargeText: boolean;
}

/**
 * Full WCAG audit result for a theme.
 */
export interface ThemeAuditResult {
	themeName: string;
	pairs: ContrastResult[];
	passesAll: boolean;
	failingPairs: ContrastResult[];
}

/**
 * Convert an sRGB channel value (0–1) to linear light value.
 * Uses the IEC 61966-2-1 standard formula.
 */
export function toLinear(c: number): number {
	return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/**
 * Calculate WCAG 2.1 relative luminance of an sRGB color.
 * Channel values must be in 0–255 range.
 */
export function relativeLuminance(r: number, g: number, b: number): number {
	return 0.2126 * toLinear(r / 255) + 0.7152 * toLinear(g / 255) + 0.0722 * toLinear(b / 255);
}

/**
 * Calculate WCAG 2.1 contrast ratio between two luminance values.
 * Returns a value from 1 (no contrast) to 21 (maximum contrast).
 */
export function contrastRatio(L1: number, L2: number): number {
	const lighter = Math.max(L1, L2);
	const darker = Math.min(L1, L2);
	return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Parse a 3- or 6-digit hex color string to [R, G, B] (0–255).
 * Accepts #rgb, #rgba, #rrggbb, #rrggbbaa (alpha ignored).
 */
function parseHex(hex: string): [number, number, number] | null {
	const clean = hex.replace('#', '');
	if (clean.length === 3 || clean.length === 4) {
		return [
			parseInt(clean[0] + clean[0], 16),
			parseInt(clean[1] + clean[1], 16),
			parseInt(clean[2] + clean[2], 16)
		];
	}
	if (clean.length === 6 || clean.length === 8) {
		return [
			parseInt(clean.slice(0, 2), 16),
			parseInt(clean.slice(2, 4), 16),
			parseInt(clean.slice(4, 6), 16)
		];
	}
	return null;
}

/**
 * Parse an rgb() or rgba() string to [R, G, B] (0–255).
 * Semi-transparent colors are composited against bgRgb (defaults to black).
 */
function parseRgba(
	rgba: string,
	bgRgb: [number, number, number] = [0, 0, 0]
): [number, number, number] | null {
	const match = rgba.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)/);
	if (!match) return null;
	const r = parseInt(match[1]);
	const g = parseInt(match[2]);
	const b = parseInt(match[3]);
	const a = match[4] !== undefined ? parseFloat(match[4]) : 1;
	if (a >= 1) return [r, g, b];
	return [
		Math.round(r * a + bgRgb[0] * (1 - a)),
		Math.round(g * a + bgRgb[1] * (1 - a)),
		Math.round(b * a + bgRgb[2] * (1 - a))
	];
}

/**
 * Parse a CSS color string to [R, G, B] (0–255).
 * Supports hex (#rrggbb, #rgb) and rgb/rgba() strings.
 * Returns null for gradients, CSS keywords, var(), or other unsupported formats.
 */
export function parseColor(
	color: string,
	bgRgb?: [number, number, number]
): [number, number, number] | null {
	if (!color) return null;
	const trimmed = color.trim();
	if (trimmed.startsWith('#')) return parseHex(trimmed);
	if (trimmed.startsWith('rgb')) return parseRgba(trimmed, bgRgb);
	return null;
}

/**
 * Calculate contrast ratio between two CSS color strings.
 * Returns null if either color cannot be parsed (e.g. gradients).
 * Semi-transparent foreground colors are composited against the background.
 */
export function colorContrastRatio(fg: string, bg: string): number | null {
	const bgRgb = parseColor(bg);
	if (!bgRgb) return null;
	const fgRgb = parseColor(fg, bgRgb);
	if (!fgRgb) return null;
	return contrastRatio(relativeLuminance(...fgRgb), relativeLuminance(...bgRgb));
}

/**
 * Check if a contrast ratio meets WCAG 2.1 AA requirements.
 * Normal text: 4.5:1 minimum. Large text (18pt+ or 14pt+ bold): 3:1 minimum.
 */
export function meetsWCAG_AA(contrast: number, isLargeText = false): boolean {
	return contrast >= (isLargeText ? 3.0 : 4.5);
}

/**
 * Check if a contrast ratio meets WCAG 2.1 AAA requirements.
 * Normal text: 7:1 minimum. Large text: 4.5:1 minimum.
 */
export function meetsWCAG_AAA(contrast: number, isLargeText = false): boolean {
	return contrast >= (isLargeText ? 4.5 : 7.0);
}

/**
 * Standard text/background contrast pairs validated in every TraekTheme.
 * These represent meaningful text-on-background combinations used in the library.
 */
export const CONTRAST_PAIRS: ContrastPair[] = [
	// Core node text
	{ label: 'Node text on node background', fgKey: 'nodeText', bgKey: 'nodeBg' },

	// Input area
	{ label: 'Input text on node background', fgKey: 'inputText', bgKey: 'nodeBg' },
	{
		label: 'Input button text on button background',
		fgKey: 'inputButtonText',
		bgKey: 'inputButtonBg'
	},
	{ label: 'Input context text on node background', fgKey: 'inputContextText', bgKey: 'nodeBg' },
	{ label: 'Stats text on node background', fgKey: 'statsText', bgKey: 'nodeBg' },

	// TextNode content
	{
		label: 'Text node content on text node background',
		fgKey: 'textNodeText',
		bgKey: 'textNodeBg'
	},
	{
		label: 'Markdown quote text on text node background',
		fgKey: 'markdownQuoteText',
		bgKey: 'textNodeBg'
	},
	{
		label: 'Scroll hint text on text node background',
		fgKey: 'scrollHintText',
		bgKey: 'textNodeBg'
	},

	// Overlays
	{ label: 'Overlay text on node background', fgKey: 'overlayText', bgKey: 'nodeBg' },

	// Thought panel
	{
		label: 'Thought header muted on node background',
		fgKey: 'thoughtHeaderMuted',
		bgKey: 'nodeBg'
	},
	{
		label: 'Thought row muted (1) on node background',
		fgKey: 'thoughtRowMuted1',
		bgKey: 'nodeBg'
	},
	{ label: 'Thought row (2) on node background', fgKey: 'thoughtRowMuted2', bgKey: 'nodeBg' },
	{
		label: 'Thought row muted (3) on node background',
		fgKey: 'thoughtRowMuted3',
		bgKey: 'nodeBg'
	},
	{
		label: 'Thought row muted (4) on node background',
		fgKey: 'thoughtRowMuted4',
		bgKey: 'nodeBg'
	},
	{
		label: 'Thought footer muted on node background',
		fgKey: 'thoughtFooterMuted',
		bgKey: 'nodeBg'
	}
];

/**
 * Validate a TraekTheme's contrast ratios for WCAG 2.1 AA accessibility compliance.
 * Checks all standard text/background pairs defined in CONTRAST_PAIRS.
 * Pairs with unparseable colors (e.g. gradients) are silently skipped.
 */
export function validateThemeContrast(theme: TraekTheme, themeName = 'theme'): ThemeAuditResult {
	const pairs: ContrastResult[] = CONTRAST_PAIRS.flatMap((pair) => {
		const fg = theme.colors[pair.fgKey] as string;
		const bg = theme.colors[pair.bgKey] as string;
		if (!fg || !bg) return [];
		const ratio = colorContrastRatio(fg, bg);
		if (ratio === null) return []; // skip unparseable (gradients, etc.)
		const isLargeText = pair.isLargeText ?? false;
		return [
			{
				label: pair.label,
				fg,
				bg,
				ratio: Math.round(ratio * 100) / 100,
				passesAA: meetsWCAG_AA(ratio, isLargeText),
				passesAAA: meetsWCAG_AAA(ratio, isLargeText),
				isLargeText
			}
		];
	});

	const failingPairs = pairs.filter((r) => !r.passesAA);
	return { themeName, pairs, passesAll: failingPairs.length === 0, failingPairs };
}
