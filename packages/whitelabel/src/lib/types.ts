import { z } from 'zod';

// ---------------------------------------------------------------------------
// Deep-partial helper
// ---------------------------------------------------------------------------

export type DeepPartial<T> = {
	[K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

// ---------------------------------------------------------------------------
// Brand metadata
// ---------------------------------------------------------------------------

/**
 * Brand identity configuration — replaces all Træk visual identity.
 * All fields are optional; omit anything you want to keep at its default.
 */
export const BrandConfigSchema = z.object({
	/** Display name shown in the loading screen and aria-labels (e.g. "Acme AI") */
	name: z.string().optional(),

	/**
	 * Loading screen logo.
	 * Provide a URL (absolute or relative), an inline SVG string (must start with '<svg'),
	 * or a Svelte component via the `logoComponent` field instead.
	 */
	logoUrl: z.string().optional(),

	/**
	 * Alt text for the logo image.
	 * Defaults to `${name} logo` if name is provided, or 'Loading' otherwise.
	 */
	logoAlt: z.string().optional(),

	/**
	 * Width of the logo in the loading screen (CSS value, e.g. "120px").
	 * @default '80px'
	 */
	logoWidth: z.string().optional(),

	/**
	 * Loading message text.
	 * @default 'Preparing canvas…'
	 */
	loadingText: z.string().optional(),

	/** Favicon URL — set <link rel="icon"> programmatically */
	faviconUrl: z.string().optional(),

	/** Tab title prefix shown before conversation names (e.g. "Acme AI — ") */
	pageTitle: z.string().optional()
});

export type BrandConfig = z.infer<typeof BrandConfigSchema>;

// ---------------------------------------------------------------------------
// Color override surface
// ---------------------------------------------------------------------------

/**
 * Semantic color aliases for the most common white-label overrides.
 * These map to multiple underlying tokens so you don't have to know
 * every individual CSS variable.
 *
 * Use these for simple brand color changes. For full control, use
 * `tokenOverrides` to set individual CSS custom properties directly.
 */
export const BrandColorsSchema = z.object({
	/**
	 * Primary accent color — used for active node borders, highlighted
	 * connections, input send button, typing cursor dot, and CTA pills.
	 *
	 * Provide a hex color: all related alpha variants are computed automatically.
	 * @example '#6366f1'
	 */
	accent: z
		.string()
		.regex(/^#[0-9a-fA-F]{6}$/, 'accent must be a 6-digit hex color')
		.optional(),

	/**
	 * User message accent — border-top color on user nodes.
	 * Defaults to the same as `accent` if not set.
	 */
	userAccent: z.string().optional(),

	/**
	 * Assistant message accent — border-top color on assistant nodes
	 * and typing cursor.
	 * @example '#f59e0b'
	 */
	assistantAccent: z.string().optional(),

	/** Canvas background color */
	canvasBg: z.string().optional(),

	/** Node card background color */
	nodeBg: z.string().optional(),

	/** Primary text color on nodes */
	nodeText: z.string().optional()
});

export type BrandColors = z.infer<typeof BrandColorsSchema>;

// ---------------------------------------------------------------------------
// Raw token overrides
// ---------------------------------------------------------------------------

/**
 * Direct CSS custom property overrides.
 * Keys are the full CSS variable name (without `--`), values are CSS values.
 *
 * These are applied last and override everything else, including
 * `brandColors` semantic aliases.
 *
 * @example
 * tokenOverrides: {
 *   'traek-canvas-bg': '#fafafa',
 *   'traek-node-bg': '#ffffff',
 *   'traek-node-border': '#e5e7eb',
 * }
 */
export type TokenOverrides = Partial<Record<TraekCssToken, string>>;

/**
 * Every CSS custom property exposed by @traek/svelte.
 * This is the complete override surface — any property not listed
 * here is not part of the public API.
 */
export type TraekCssToken =
	| 'traek-canvas-bg'
	| 'traek-canvas-dot'
	| 'traek-node-bg'
	| 'traek-node-border'
	| 'traek-node-text'
	| 'traek-node-active-border'
	| 'traek-node-active-glow'
	| 'traek-node-user-border-top'
	| 'traek-node-assistant-border-top'
	| 'traek-connection-stroke'
	| 'traek-connection-highlight'
	| 'traek-connection-delete'
	| 'traek-input-bg'
	| 'traek-input-border'
	| 'traek-input-shadow'
	| 'traek-input-button-bg'
	| 'traek-input-button-text'
	| 'traek-input-text'
	| 'traek-input-context-bg'
	| 'traek-input-context-text'
	| 'traek-input-dot'
	| 'traek-input-dot-muted'
	| 'traek-stats-text'
	| 'traek-textnode-bg'
	| 'traek-textnode-text'
	| 'traek-markdown-quote-border'
	| 'traek-markdown-quote-text'
	| 'traek-markdown-hr'
	| 'traek-scroll-hint-bg'
	| 'traek-scroll-hint-text'
	| 'traek-scrollbar-thumb'
	| 'traek-scrollbar-thumb-hover'
	| 'traek-typing-cursor'
	| 'traek-search-match-border'
	| 'traek-search-dimmed-opacity'
	| 'traek-thought-panel-bg'
	| 'traek-thought-panel-border'
	| 'traek-thought-panel-border-active'
	| 'traek-thought-panel-glow'
	| 'traek-thought-header-bg'
	| 'traek-thought-header-border'
	| 'traek-thought-header-muted'
	| 'traek-thought-header-accent'
	| 'traek-thought-tag-cyan'
	| 'traek-thought-tag-orange'
	| 'traek-thought-tag-gray'
	| 'traek-thought-divider'
	| 'traek-thought-row-bg'
	| 'traek-thought-row-muted-1'
	| 'traek-thought-row-muted-2'
	| 'traek-thought-row-muted-3'
	| 'traek-thought-row-muted-4'
	| 'traek-thought-badge-cyan'
	| 'traek-thought-footer-muted'
	| 'traek-thought-footer-bg'
	| 'traek-thought-footer-border'
	| 'traek-thought-toggle-bg'
	| 'traek-thought-toggle-border'
	| 'traek-overlay-gradient-1'
	| 'traek-overlay-gradient-2'
	| 'traek-overlay-gradient-3'
	| 'traek-overlay-card-bg'
	| 'traek-overlay-card-border'
	| 'traek-overlay-card-shadow'
	| 'traek-overlay-text'
	| 'traek-overlay-pill-bg'
	| 'traek-overlay-pill-shadow'
	| 'traek-toolbar-bg'
	| 'traek-toolbar-text'
	| 'traek-toolbar-text-hover'
	| 'traek-toolbar-shadow'
	| 'traek-toolbar-badge-bg'
	| 'traek-toolbar-badge-border'
	| 'traek-toolbar-badge-border-hover'
	| 'traek-toolbar-badge-hover'
	| 'traek-toolbar-variant-bg'
	| 'traek-toolbar-variant-border'
	| 'traek-toolbar-variant-border-hover'
	| 'traek-toolbar-variant-hover'
	| 'traek-toolbar-variant-text'
	| 'traek-tooltip-bg'
	| 'traek-tooltip-text'
	| 'traek-toast-bg'
	| 'traek-toast-border'
	| 'traek-toast-text'
	| 'traek-toast-close'
	| 'traek-toast-progress'
	| 'traek-toast-undo-accent'
	| 'traek-header-bg'
	| 'traek-header-border'
	| 'traek-header-text'
	| 'traek-header-hover-bg'
	| 'traek-header-hover-text'
	| 'traek-badge-bg'
	| 'traek-badge-text'
	| 'traek-badge-text-active'
	| 'traek-error-banner-bg'
	| 'traek-error-border'
	| 'traek-error-glow'
	| 'traek-error-text'
	| 'traek-empty-state-color'
	| 'traek-text-secondary'
	| 'traek-status-bg'
	| 'traek-replay-bg'
	| 'traek-replay-border'
	| 'traek-replay-text'
	| 'traek-replay-btn-hover'
	| 'traek-replay-btn-text'
	| 'traek-replay-btn-primary-bg'
	| 'traek-replay-btn-primary-hover'
	| 'traek-replay-btn-primary-text'
	| 'traek-replay-progress-text'
	| 'traek-replay-scrubber-track'
	| 'traek-replay-scrubber-thumb'
	| 'traek-replay-speed-text'
	| 'traek-replay-speed-hover'
	| 'traek-replay-speed-active-bg'
	| 'traek-replay-speed-active-border'
	| 'traek-replay-speed-active-text'
	| 'traek-save-indicator-bg'
	| 'traek-save-indicator-text'
	| 'traek-save-indicator-success'
	| 'traek-save-indicator-error'
	| 'traek-slash-dropdown-bg'
	| 'traek-slash-dropdown-text'
	| 'traek-slash-dropdown-command'
	| 'traek-slash-dropdown-desc'
	| 'traek-slash-dropdown-item-active'
	| 'traek-slash-dropdown-shadow'
	| 'traek-chatlist-bg'
	| 'traek-chatlist-text'
	| 'traek-chatlist-border'
	| 'traek-chatlist-item-bg'
	| 'traek-chatlist-item-bg-hover'
	| 'traek-chatlist-item-border'
	| 'traek-chatlist-item-border-hover'
	| 'traek-chatlist-item-title'
	| 'traek-chatlist-item-meta'
	| 'traek-chatlist-item-preview'
	| 'traek-chatlist-group-title'
	| 'traek-chatlist-empty-text'
	| 'traek-chatlist-new-bg'
	| 'traek-chatlist-new-bg-hover'
	| 'traek-chatlist-new-border'
	| 'traek-chatlist-new-border-hover'
	| 'traek-chatlist-new-text'
	| 'traek-chatlist-action-bg-hover'
	| 'traek-chatlist-action-text'
	| 'traek-chatlist-action-text-hover'
	| 'traek-chatlist-delete-bg-hover'
	| 'traek-chatlist-delete-text-hover'
	| 'traek-chatlist-edit-bg'
	| 'traek-chatlist-edit-border'
	| 'traek-chatlist-edit-border-focus'
	| 'traek-chatlist-edit-text'
	| 'traek-shadow-tool-panel'
	| 'traek-keyboard-focus-ring'
	| 'traek-font-mono';

// ---------------------------------------------------------------------------
// Typography overrides
// ---------------------------------------------------------------------------

export const TypographyConfigSchema = z.object({
	/**
	 * Primary font family (CSS font-family value).
	 * @example "'Inter', sans-serif"
	 */
	fontFamily: z.string().optional(),

	/**
	 * Monospace font family for code blocks.
	 * @example "'JetBrains Mono', monospace"
	 */
	fontMono: z.string().optional()
});

export type TypographyConfig = z.infer<typeof TypographyConfigSchema>;

// ---------------------------------------------------------------------------
// Loading screen config
// ---------------------------------------------------------------------------

export const LoadingScreenConfigSchema = z.object({
	/**
	 * Loading screen variant.
	 *
	 * - `'minimal'` — pill with dot and text (default Træk style)
	 * - `'branded'` — logo + text, centered on canvas background
	 * - `'splash'` — full viewport, solid or gradient background
	 * - `'none'` — no loading screen; renders nothing during init
	 */
	variant: z.enum(['minimal', 'branded', 'splash', 'none']).optional(),

	/**
	 * Background for the `splash` variant.
	 * CSS background value (color, gradient, or image).
	 * @example 'linear-gradient(135deg, #1e1b4b, #312e81)'
	 */
	splashBackground: z.string().optional(),

	/** Show an animated progress bar at the bottom of the splash screen */
	showProgressBar: z.boolean().optional()
});

export type LoadingScreenConfig = z.infer<typeof LoadingScreenConfigSchema>;

// ---------------------------------------------------------------------------
// Root WhitelabelConfig
// ---------------------------------------------------------------------------

/**
 * Complete white-label configuration for @traek/whitelabel.
 *
 * @example
 * ```ts
 * import { applyWhitelabel } from '@traek/whitelabel'
 *
 * applyWhitelabel({
 *   brand: {
 *     name: 'Acme AI',
 *     logoUrl: '/acme-logo.svg',
 *     loadingText: 'Starting your session…',
 *   },
 *   brandColors: {
 *     accent: '#6366f1',
 *     assistantAccent: '#f59e0b',
 *   },
 *   typography: {
 *     fontFamily: "'Inter', sans-serif",
 *   },
 *   loadingScreen: {
 *     variant: 'branded',
 *   },
 * })
 * ```
 */
export const WhitelabelConfigSchema = z.object({
	/**
	 * Brand identity — name, logo, favicon, page title.
	 */
	brand: BrandConfigSchema.optional(),

	/**
	 * Semantic color aliases for common brand overrides.
	 * The `accent` field drives ~12 related tokens automatically.
	 */
	brandColors: BrandColorsSchema.optional(),

	/**
	 * Typography overrides — font families only.
	 * Font sizes and weights are intentionally not overridable to preserve
	 * readability and accessibility.
	 */
	typography: TypographyConfigSchema.optional(),

	/**
	 * Loading screen configuration.
	 */
	loadingScreen: LoadingScreenConfigSchema.optional(),

	/**
	 * Raw CSS custom property overrides.
	 * Applied last — overrides `brandColors` and everything else.
	 * Use for advanced token-level customization.
	 */
	tokenOverrides: z.record(z.string()).optional() as z.ZodOptional<z.ZodType<TokenOverrides>>
});

export type WhitelabelConfig = z.infer<typeof WhitelabelConfigSchema>;
