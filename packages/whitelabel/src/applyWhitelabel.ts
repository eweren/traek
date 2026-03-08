import type { WhitelabelConfig, TokenOverrides } from './types';
import { WhitelabelConfigSchema } from './types';

// ---------------------------------------------------------------------------
// Accent color expansion
// ---------------------------------------------------------------------------

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
	const clean = hex.replace('#', '');
	if (clean.length !== 6) return null;
	return {
		r: parseInt(clean.slice(0, 2), 16),
		g: parseInt(clean.slice(2, 4), 16),
		b: parseInt(clean.slice(4, 6), 16)
	};
}

function expandAccentColor(hex: string): Record<string, string> {
	const rgb = hexToRgb(hex);
	if (!rgb) return {};
	const { r, g, b } = rgb;

	const lighter = (v: number) => Math.min(255, Math.floor(v * 1.2));
	const lightHex = `#${lighter(r).toString(16).padStart(2, '0')}${lighter(g).toString(16).padStart(2, '0')}${lighter(b).toString(16).padStart(2, '0')}`;

	return {
		'--traek-node-active-border': hex,
		'--traek-node-active-glow': `rgba(${r}, ${g}, ${b}, 0.15)`,
		'--traek-node-user-border-top': hex,
		'--traek-connection-highlight': hex,
		'--traek-input-button-bg': hex,
		'--traek-input-dot': hex,
		'--traek-thought-panel-border-active': hex,
		'--traek-thought-panel-glow': `rgba(${r}, ${g}, ${b}, 0.15)`,
		'--traek-thought-tag-cyan': hex,
		'--traek-thought-badge-cyan': lightHex,
		'--traek-overlay-pill-bg': hex,
		'--traek-overlay-pill-shadow': `rgba(${r}, ${g}, ${b}, 0.4)`
	};
}

// ---------------------------------------------------------------------------
// CSS application
// ---------------------------------------------------------------------------

function setProperties(
	props: Record<string, string>,
	target: HTMLElement = document.documentElement
): void {
	for (const [key, value] of Object.entries(props)) {
		const cssVar = key.startsWith('--') ? key : `--${key}`;
		target.style.setProperty(cssVar, value);
	}
}

// ---------------------------------------------------------------------------
// Favicon + page title
// ---------------------------------------------------------------------------

function applyFavicon(url: string): void {
	if (typeof document === 'undefined') return;
	let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
	if (!link) {
		link = document.createElement('link');
		link.rel = 'icon';
		document.head.appendChild(link);
	}
	link.href = url;
}

// ---------------------------------------------------------------------------
// Font injection
// ---------------------------------------------------------------------------

function applyTypography(fontFamily?: string, fontMono?: string): void {
	if (typeof document === 'undefined') return;
	const root = document.documentElement;
	if (fontFamily) root.style.setProperty('--traek-font-family', fontFamily);
	if (fontMono) root.style.setProperty('--traek-font-mono', fontMono);
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

/**
 * Apply a white-label configuration to the document root.
 *
 * This function is idempotent — calling it multiple times with the same config
 * is safe. Later calls override earlier ones on the same properties.
 *
 * @param config - White-label configuration. Validated with Zod at runtime.
 * @param target - DOM element to apply CSS properties to. Defaults to `:root`.
 *
 * @example
 * ```ts
 * import { applyWhitelabel } from '@traek/whitelabel'
 *
 * applyWhitelabel({
 *   brand: { name: 'Acme AI', logoUrl: '/logo.svg' },
 *   brandColors: { accent: '#6366f1' },
 * })
 * ```
 */
export function applyWhitelabel(config: WhitelabelConfig, target?: HTMLElement): void {
	if (typeof document === 'undefined') return;

	// Validate at runtime
	const parsed = WhitelabelConfigSchema.safeParse(config);
	if (!parsed.success) {
		console.warn('[traek/whitelabel] Invalid config:', parsed.error.issues);
		return;
	}

	const { brand, brandColors, typography, tokenOverrides } = parsed.data;
	const props: Record<string, string> = {};

	// 1. Semantic brand colors (lowest precedence)
	if (brandColors?.accent) {
		Object.assign(props, expandAccentColor(brandColors.accent));
	}
	if (brandColors?.userAccent) {
		props['--traek-node-user-border-top'] = brandColors.userAccent;
	}
	if (brandColors?.assistantAccent) {
		props['--traek-node-assistant-border-top'] = brandColors.assistantAccent;
		props['--traek-typing-cursor'] = brandColors.assistantAccent;
	}
	if (brandColors?.canvasBg) {
		props['--traek-canvas-bg'] = brandColors.canvasBg;
	}
	if (brandColors?.nodeBg) {
		props['--traek-node-bg'] = brandColors.nodeBg;
		props['--traek-textnode-bg'] = brandColors.nodeBg;
	}
	if (brandColors?.nodeText) {
		props['--traek-node-text'] = brandColors.nodeText;
		props['--traek-textnode-text'] = brandColors.nodeText;
	}

	// 2. Apply collected CSS properties
	setProperties(props, target);

	// 3. Raw token overrides (highest precedence — applied after semantic aliases)
	if (tokenOverrides) {
		const rawProps: Record<string, string> = {};
		for (const [key, value] of Object.entries(tokenOverrides)) {
			if (value !== undefined) {
				rawProps[`--${key}`] = value;
			}
		}
		setProperties(rawProps, target);
	}

	// 4. Typography
	if (typography) {
		applyTypography(typography.fontFamily, typography.fontMono);
	}

	// 5. Brand metadata
	if (brand?.faviconUrl) applyFavicon(brand.faviconUrl);
	if (brand?.pageTitle && typeof document !== 'undefined') {
		// Store as a data attribute for SvelteKit page title usage
		document.documentElement.dataset.traekBrandTitle = brand.pageTitle;
	}
}

/**
 * Validate a white-label configuration without applying it.
 * Returns a typed result with success/error information.
 */
export function validateWhitelabelConfig(config: unknown): {
	valid: boolean;
	config?: WhitelabelConfig;
	errors?: string[];
} {
	const result = WhitelabelConfigSchema.safeParse(config);
	if (result.success) {
		return { valid: true, config: result.data };
	}
	return {
		valid: false,
		errors: result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`)
	};
}
