import { describe, it, expect } from 'vitest';
import {
	toLinear,
	relativeLuminance,
	contrastRatio,
	parseColor,
	colorContrastRatio,
	meetsWCAG_AA,
	meetsWCAG_AAA,
	validateThemeContrast,
	CONTRAST_PAIRS
} from './wcag';
import { darkTheme, lightTheme, highContrastTheme } from './themes';

describe('toLinear', () => {
	it('should use low-value formula for values <= 0.04045', () => {
		expect(toLinear(0)).toBeCloseTo(0, 5);
		expect(toLinear(0.04045)).toBeCloseTo(0.04045 / 12.92, 5);
	});

	it('should use gamma formula for values > 0.04045', () => {
		expect(toLinear(1)).toBeCloseTo(1, 5);
		expect(toLinear(0.5)).toBeGreaterThan(0.5 / 12.92);
	});
});

describe('relativeLuminance', () => {
	it('should return 0 for black', () => {
		expect(relativeLuminance(0, 0, 0)).toBeCloseTo(0, 5);
	});

	it('should return 1 for white', () => {
		expect(relativeLuminance(255, 255, 255)).toBeCloseTo(1, 5);
	});

	it('should return correct luminance for mid-gray', () => {
		// #808080 ≈ 0.2158
		const L = relativeLuminance(128, 128, 128);
		expect(L).toBeGreaterThan(0.2);
		expect(L).toBeLessThan(0.25);
	});
});

describe('contrastRatio', () => {
	it('should return 21 for black vs white', () => {
		expect(contrastRatio(0, 1)).toBeCloseTo(21, 1);
	});

	it('should return 1 for identical luminances', () => {
		expect(contrastRatio(0.5, 0.5)).toBeCloseTo(1, 5);
	});

	it('should handle luminances in either order', () => {
		const ratio1 = contrastRatio(0.1, 0.5);
		const ratio2 = contrastRatio(0.5, 0.1);
		expect(ratio1).toBeCloseTo(ratio2, 5);
	});
});

describe('parseColor', () => {
	it('should parse 6-digit hex', () => {
		expect(parseColor('#ffffff')).toEqual([255, 255, 255]);
		expect(parseColor('#000000')).toEqual([0, 0, 0]);
		expect(parseColor('#ff0000')).toEqual([255, 0, 0]);
	});

	it('should parse 3-digit hex', () => {
		expect(parseColor('#fff')).toEqual([255, 255, 255]);
		expect(parseColor('#000')).toEqual([0, 0, 0]);
		expect(parseColor('#f00')).toEqual([255, 0, 0]);
	});

	it('should parse rgb() string', () => {
		expect(parseColor('rgb(255, 0, 0)')).toEqual([255, 0, 0]);
		expect(parseColor('rgb(0, 128, 255)')).toEqual([0, 128, 255]);
	});

	it('should parse fully-opaque rgba()', () => {
		expect(parseColor('rgba(255, 0, 0, 1)')).toEqual([255, 0, 0]);
	});

	it('should composite semi-transparent rgba() on default black background', () => {
		const result = parseColor('rgba(255, 0, 0, 0.5)');
		expect(result).not.toBeNull();
		expect(result![0]).toBeCloseTo(128, 0); // 255*0.5 + 0*0.5
		expect(result![1]).toBe(0);
		expect(result![2]).toBe(0);
	});

	it('should composite semi-transparent rgba() on provided background', () => {
		const result = parseColor('rgba(255, 255, 255, 0.5)', [0, 0, 0]);
		expect(result).not.toBeNull();
		expect(result![0]).toBeCloseTo(128, 0);
	});

	it('should return null for gradients', () => {
		expect(parseColor('linear-gradient(transparent, black)')).toBeNull();
	});

	it('should return null for CSS var()', () => {
		expect(parseColor('var(--some-color)')).toBeNull();
	});

	it('should return null for empty string', () => {
		expect(parseColor('')).toBeNull();
	});
});

describe('colorContrastRatio', () => {
	it('should return ~21 for black on white', () => {
		const ratio = colorContrastRatio('#000000', '#ffffff');
		expect(ratio).not.toBeNull();
		expect(ratio!).toBeCloseTo(21, 1);
	});

	it('should return ~21 for white on black', () => {
		const ratio = colorContrastRatio('#ffffff', '#000000');
		expect(ratio).not.toBeNull();
		expect(ratio!).toBeCloseTo(21, 1);
	});

	it('should return null if fg is a gradient', () => {
		expect(colorContrastRatio('linear-gradient(red, blue)', '#ffffff')).toBeNull();
	});

	it('should return null if bg is a gradient', () => {
		expect(colorContrastRatio('#ffffff', 'linear-gradient(red, blue)')).toBeNull();
	});

	it('should return correct ratio for #00d8ff on #000000', () => {
		// Cyan on black: approximately 12:1
		const ratio = colorContrastRatio('#00d8ff', '#000000');
		expect(ratio).not.toBeNull();
		expect(ratio!).toBeGreaterThan(11);
		expect(ratio!).toBeLessThan(14);
	});
});

describe('meetsWCAG_AA', () => {
	it('should pass normal text at exactly 4.5', () => {
		expect(meetsWCAG_AA(4.5)).toBe(true);
	});

	it('should fail normal text below 4.5', () => {
		expect(meetsWCAG_AA(4.49)).toBe(false);
	});

	it('should pass large text at exactly 3.0', () => {
		expect(meetsWCAG_AA(3.0, true)).toBe(true);
	});

	it('should fail large text below 3.0', () => {
		expect(meetsWCAG_AA(2.99, true)).toBe(false);
	});
});

describe('meetsWCAG_AAA', () => {
	it('should pass normal text at exactly 7.0', () => {
		expect(meetsWCAG_AAA(7.0)).toBe(true);
	});

	it('should fail normal text below 7.0', () => {
		expect(meetsWCAG_AAA(6.99)).toBe(false);
	});

	it('should pass large text at exactly 4.5', () => {
		expect(meetsWCAG_AAA(4.5, true)).toBe(true);
	});
});

describe('CONTRAST_PAIRS', () => {
	it('should define at least one pair', () => {
		expect(CONTRAST_PAIRS.length).toBeGreaterThan(0);
	});

	it('should include the button text/background pair', () => {
		const hasButton = CONTRAST_PAIRS.some(
			(p) => p.fgKey === 'inputButtonText' && p.bgKey === 'inputButtonBg'
		);
		expect(hasButton).toBe(true);
	});

	it('should include the node text pair', () => {
		const hasNodeText = CONTRAST_PAIRS.some((p) => p.fgKey === 'nodeText' && p.bgKey === 'nodeBg');
		expect(hasNodeText).toBe(true);
	});
});

describe('validateThemeContrast', () => {
	describe('dark theme', () => {
		it('should pass all WCAG AA pairs', () => {
			const result = validateThemeContrast(darkTheme, 'dark');
			expect(result.themeName).toBe('dark');
			if (!result.passesAll) {
				const msg = result.failingPairs
					.map((p) => `  "${p.label}": ${p.ratio}:1 (fg: ${p.fg}, bg: ${p.bg})`)
					.join('\n');
				throw new Error(`Dark theme WCAG AA failures:\n${msg}`);
			}
			expect(result.passesAll).toBe(true);
		});

		it('should report ratio for node text', () => {
			const result = validateThemeContrast(darkTheme, 'dark');
			const nodeText = result.pairs.find((p) => p.label === 'Node text on node background');
			expect(nodeText).toBeDefined();
			expect(nodeText!.ratio).toBeGreaterThan(10); // #e4e4e7 on #0e0e10 ≈ 15:1
			expect(nodeText!.passesAA).toBe(true);
			expect(nodeText!.passesAAA).toBe(true);
		});

		it('should report ratio for input button', () => {
			const result = validateThemeContrast(darkTheme, 'dark');
			const button = result.pairs.find((p) => p.label === 'Input button text on button background');
			expect(button).toBeDefined();
			expect(button!.ratio).toBeGreaterThan(10); // #000 on #00d8ff ≈ 12:1
			expect(button!.passesAA).toBe(true);
		});

		it('should have parsed at least 10 pairs', () => {
			const result = validateThemeContrast(darkTheme, 'dark');
			expect(result.pairs.length).toBeGreaterThanOrEqual(10);
		});
	});

	describe('light theme', () => {
		it('should pass all WCAG AA pairs', () => {
			const result = validateThemeContrast(lightTheme, 'light');
			if (!result.passesAll) {
				const msg = result.failingPairs
					.map((p) => `  "${p.label}": ${p.ratio}:1 (fg: ${p.fg}, bg: ${p.bg})`)
					.join('\n');
				throw new Error(`Light theme WCAG AA failures:\n${msg}`);
			}
			expect(result.passesAll).toBe(true);
		});
	});

	describe('high contrast theme', () => {
		it('should pass all WCAG AA pairs', () => {
			const result = validateThemeContrast(highContrastTheme, 'highContrast');
			if (!result.passesAll) {
				const msg = result.failingPairs
					.map((p) => `  "${p.label}": ${p.ratio}:1 (fg: ${p.fg}, bg: ${p.bg})`)
					.join('\n');
				throw new Error(`High contrast theme WCAG AA failures:\n${msg}`);
			}
			expect(result.passesAll).toBe(true);
		});

		it('should pass WCAG AAA for primary text pairs', () => {
			const result = validateThemeContrast(highContrastTheme, 'highContrast');
			const nodeText = result.pairs.find((p) => p.label === 'Node text on node background');
			expect(nodeText).toBeDefined();
			expect(nodeText!.passesAAA).toBe(true);
		});
	});

	it('should return themeName from argument', () => {
		const result = validateThemeContrast(darkTheme, 'my-theme');
		expect(result.themeName).toBe('my-theme');
	});

	it('should use "theme" as default themeName', () => {
		const result = validateThemeContrast(darkTheme);
		expect(result.themeName).toBe('theme');
	});

	it('should skip gradient colors gracefully', () => {
		// scrollHintBg is a gradient and should not cause errors
		expect(() => validateThemeContrast(darkTheme)).not.toThrow();
	});
});
