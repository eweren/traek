import { describe, it, expect } from 'vitest';
import { darkTheme, lightTheme, highContrastTheme, themes, DEFAULT_THEME } from './themes';
import type { TraekTheme } from './tokens';

describe('Theme Completeness', () => {
	const requiredColorKeys = [
		'canvasBg',
		'canvasDot',
		'nodeBg',
		'nodeBorder',
		'nodeText',
		'nodeActiveBorder',
		'nodeActiveGlow',
		'nodeUserBorderTop',
		'nodeAssistantBorderTop',
		'connectionStroke',
		'connectionHighlight',
		'inputBg',
		'inputBorder',
		'inputShadow',
		'inputButtonBg',
		'inputButtonText',
		'inputText',
		'inputContextBg',
		'inputContextText',
		'inputDot',
		'inputDotMuted',
		'statsText',
		'textNodeText',
		'textNodeBg',
		'markdownQuoteBorder',
		'markdownQuoteText',
		'markdownHr',
		'scrollHintBg',
		'scrollHintText',
		'scrollbarThumb',
		'scrollbarThumbHover',
		'typingCursor',
		'searchMatchBorder',
		'searchDimmedOpacity',
		'thoughtPanelBg',
		'thoughtPanelBorder',
		'thoughtPanelBorderActive',
		'thoughtPanelGlow',
		'thoughtHeaderBg',
		'thoughtHeaderBorder',
		'thoughtHeaderMuted',
		'thoughtHeaderAccent',
		'thoughtTagCyan',
		'thoughtTagOrange',
		'thoughtTagGray',
		'thoughtDivider',
		'thoughtRowBg',
		'thoughtRowMuted1',
		'thoughtRowMuted2',
		'thoughtRowMuted3',
		'thoughtRowMuted4',
		'thoughtBadgeCyan',
		'thoughtFooterMuted',
		'thoughtFooterBg',
		'thoughtFooterBorder',
		'thoughtToggleBg',
		'thoughtToggleBorder',
		'overlayGradient1',
		'overlayGradient2',
		'overlayGradient3',
		'overlayCardBg',
		'overlayCardBorder',
		'overlayCardShadow',
		'overlayText',
		'overlayPillBg',
		'overlayPillShadow'
	];

	const requiredSpacingKeys = ['xs', 'sm', 'md', 'lg', 'xl'];
	const requiredRadiusKeys = ['sm', 'md', 'lg'];
	const requiredTypographySizeKeys = ['xs', 'sm', 'base', 'lg', 'xl', '2xl'];
	const requiredTypographyWeightKeys = ['normal', 'medium', 'semibold', 'bold'];
	const requiredAnimationKeys = ['fast', 'normal', 'slow'];

	function hasAllKeys(obj: Record<string, unknown>, keys: string[]): boolean {
		return keys.every((key) => key in obj);
	}

	describe('Dark Theme', () => {
		it('should have all required color properties', () => {
			expect(hasAllKeys(darkTheme.colors, requiredColorKeys)).toBe(true);
		});

		it('should have all required spacing properties', () => {
			expect(hasAllKeys(darkTheme.spacing, requiredSpacingKeys)).toBe(true);
		});

		it('should have all required radius properties', () => {
			expect(hasAllKeys(darkTheme.radius, requiredRadiusKeys)).toBe(true);
		});

		it('should have all required typography size properties', () => {
			expect(hasAllKeys(darkTheme.typography.sizes, requiredTypographySizeKeys)).toBe(true);
		});

		it('should have all required typography weight properties', () => {
			expect(hasAllKeys(darkTheme.typography.weights, requiredTypographyWeightKeys)).toBe(true);
		});

		it('should have all required animation properties', () => {
			expect(hasAllKeys(darkTheme.animation, requiredAnimationKeys)).toBe(true);
		});
	});

	describe('Light Theme', () => {
		it('should have all required color properties', () => {
			expect(hasAllKeys(lightTheme.colors, requiredColorKeys)).toBe(true);
		});

		it('should have all required spacing properties', () => {
			expect(hasAllKeys(lightTheme.spacing, requiredSpacingKeys)).toBe(true);
		});

		it('should have all required radius properties', () => {
			expect(hasAllKeys(lightTheme.radius, requiredRadiusKeys)).toBe(true);
		});

		it('should have all required typography size properties', () => {
			expect(hasAllKeys(lightTheme.typography.sizes, requiredTypographySizeKeys)).toBe(true);
		});

		it('should have all required typography weight properties', () => {
			expect(hasAllKeys(lightTheme.typography.weights, requiredTypographyWeightKeys)).toBe(true);
		});

		it('should have all required animation properties', () => {
			expect(hasAllKeys(lightTheme.animation, requiredAnimationKeys)).toBe(true);
		});
	});

	describe('High Contrast Theme', () => {
		it('should have all required color properties', () => {
			expect(hasAllKeys(highContrastTheme.colors, requiredColorKeys)).toBe(true);
		});

		it('should have all required spacing properties', () => {
			expect(hasAllKeys(highContrastTheme.spacing, requiredSpacingKeys)).toBe(true);
		});

		it('should have all required radius properties', () => {
			expect(hasAllKeys(highContrastTheme.radius, requiredRadiusKeys)).toBe(true);
		});

		it('should have all required typography size properties', () => {
			expect(hasAllKeys(highContrastTheme.typography.sizes, requiredTypographySizeKeys)).toBe(true);
		});

		it('should have all required typography weight properties', () => {
			expect(hasAllKeys(highContrastTheme.typography.weights, requiredTypographyWeightKeys)).toBe(
				true
			);
		});

		it('should have all required animation properties', () => {
			expect(hasAllKeys(highContrastTheme.animation, requiredAnimationKeys)).toBe(true);
		});
	});

	describe('Theme Registry', () => {
		it('should have dark theme', () => {
			expect(themes.dark).toBeDefined();
			expect(themes.dark).toBe(darkTheme);
		});

		it('should have light theme', () => {
			expect(themes.light).toBeDefined();
			expect(themes.light).toBe(lightTheme);
		});

		it('should have high contrast theme', () => {
			expect(themes.highContrast).toBeDefined();
			expect(themes.highContrast).toBe(highContrastTheme);
		});

		it('should have default theme set', () => {
			expect(DEFAULT_THEME).toBe('dark');
			expect(themes[DEFAULT_THEME]).toBeDefined();
		});
	});

	describe('Theme Consistency', () => {
		function compareStructure(theme1: TraekTheme, theme2: TraekTheme): boolean {
			const keys1 = Object.keys(theme1.colors).sort();
			const keys2 = Object.keys(theme2.colors).sort();
			return JSON.stringify(keys1) === JSON.stringify(keys2);
		}

		it('should have same color structure across all themes', () => {
			expect(compareStructure(darkTheme, lightTheme)).toBe(true);
			expect(compareStructure(darkTheme, highContrastTheme)).toBe(true);
			expect(compareStructure(lightTheme, highContrastTheme)).toBe(true);
		});

		it('should have same spacing values across all themes', () => {
			expect(darkTheme.spacing).toEqual(lightTheme.spacing);
			expect(darkTheme.spacing).toEqual(highContrastTheme.spacing);
		});

		it('should have same radius values across all themes', () => {
			expect(darkTheme.radius).toEqual(lightTheme.radius);
			expect(darkTheme.radius).toEqual(highContrastTheme.radius);
		});

		it('should have same typography structure across all themes', () => {
			expect(darkTheme.typography).toEqual(lightTheme.typography);
			expect(darkTheme.typography).toEqual(highContrastTheme.typography);
		});

		it('should have same animation values across all themes', () => {
			expect(darkTheme.animation).toEqual(lightTheme.animation);
			expect(darkTheme.animation).toEqual(highContrastTheme.animation);
		});
	});
});
