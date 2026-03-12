/**
 * Plugin Manifest Schema — traek-plugin.json
 *
 * Plugin developers add this file to their package root.
 * The marketplace API validates it on submission using this schema.
 */
import { z } from 'zod';

// ─── Author ─────────────────────────────────────────────────────────────────

export const pluginAuthorSchema = z.object({
	name: z.string().min(1),
	email: z.string().email().optional(),
	url: z.string().url().optional()
});

// ─── Pricing ─────────────────────────────────────────────────────────────────

export const pluginPricingSchema = z.discriminatedUnion('type', [
	z.object({ type: z.literal('free') }),
	z.object({
		type: z.literal('paid'),
		/** Price in USD cents (e.g. 900 = $9.00/month). */
		priceUsdCents: z.number().int().positive(),
		/** Billing interval. */
		interval: z.enum(['monthly', 'yearly', 'one_time']).default('monthly')
	})
]);

// ─── Plugin type ─────────────────────────────────────────────────────────────

export const pluginTypeSchema = z.enum(['theme', 'component', 'template']);

// ─── Framework compatibility ─────────────────────────────────────────────────

export const pluginFrameworkSchema = z.enum(['svelte', 'react', 'vue', 'all']);

// ─── Screenshot ──────────────────────────────────────────────────────────────

export const pluginScreenshotSchema = z.object({
	url: z.string().url(),
	alt: z.string().min(1).max(200),
	/** 'light' | 'dark' — which theme is shown in this screenshot. */
	theme: z.enum(['light', 'dark']).optional()
});

// ─── Engine version range ────────────────────────────────────────────────────

/**
 * SemVer range string e.g. ">=0.5.0 <2.0.0".
 * The marketplace resolves this against published @traek/* package versions.
 */
const semverRangeSchema = z
	.string()
	.regex(/^[>=<^~\d\s.*-]+$/, 'Must be a valid semver range (e.g. ">=0.5.0")');

// ─── Main manifest ───────────────────────────────────────────────────────────

export const pluginManifestSchema = z.object({
	/**
	 * npm package name (must be lowercase, no spaces).
	 * @example "traek-plugin-mermaid"
	 */
	name: z
		.string()
		.min(3)
		.max(100)
		.regex(/^[a-z0-9@][a-z0-9@._/-]*$/, 'Must be a valid npm package name'),

	/**
	 * Human-readable display name shown in the marketplace.
	 * @example "Mermaid Diagram Node"
	 */
	displayName: z.string().min(3).max(60),

	/** SemVer version string. @example "1.2.0" */
	version: z
		.string()
		.regex(/^\d+\.\d+\.\d+(-[\w.]+)?(\+[\w.]+)?$/, 'Must be a valid semver string (e.g. "1.0.0")'),

	/** One-sentence description (shown in card subtitle). Max 150 chars. */
	description: z.string().min(10).max(150),

	/** Full Markdown description shown on the detail page. Max 5000 chars. */
	readme: z.string().max(5000).optional(),

	/** Plugin category. */
	type: pluginTypeSchema,

	/** Supported Træk framework package(s). */
	framework: pluginFrameworkSchema,

	/** Emoji or short string used as the plugin icon in the marketplace. Max 4 chars. */
	icon: z.string().max(4).optional(),

	/**
	 * Tags for search & filtering. Max 5 tags, each max 24 chars.
	 * Must be lowercase, letters/numbers/hyphens only.
	 */
	tags: z
		.array(
			z
				.string()
				.min(2)
				.max(24)
				.regex(/^[a-z0-9-]+$/, 'Tags must be lowercase letters, numbers, or hyphens')
		)
		.min(1)
		.max(5),

	/** Plugin pricing model. */
	pricing: pluginPricingSchema,

	/** Author information. */
	author: pluginAuthorSchema,

	/** Link to the plugin's full documentation. */
	docs: z.string().url().optional(),

	/** GitHub (or other VCS) repository URL. */
	repository: z.string().url().optional(),

	/** Plugin homepage URL. */
	homepage: z.string().url().optional(),

	/** Screenshots for the marketplace gallery. Max 5. */
	screenshots: z.array(pluginScreenshotSchema).max(5).optional(),

	/**
	 * Compatible Træk version range.
	 * @example { "traek": ">=0.5.0" }
	 */
	engines: z
		.object({
			traek: semverRangeSchema
		})
		.optional(),

	/**
	 * Entry point relative to package root.
	 * Defaults to the "main" field in package.json.
	 * @example "dist/index.js"
	 */
	main: z.string().optional(),

	/** Changelog text shown in the "What's New" section. Max 2000 chars. */
	changelog: z.string().max(2000).optional(),

	/**
	 * The node type key(s) registered by this plugin.
	 * Required for 'component' type plugins.
	 * @example ["mermaid", "mermaid-live"]
	 */
	nodeTypes: z.array(z.string()).optional()
});

// ─── Inferred TypeScript types ───────────────────────────────────────────────

export type PluginManifest = z.infer<typeof pluginManifestSchema>;
export type PluginAuthor = z.infer<typeof pluginAuthorSchema>;
export type PluginPricing = z.infer<typeof pluginPricingSchema>;
export type PluginType = z.infer<typeof pluginTypeSchema>;
export type PluginFramework = z.infer<typeof pluginFrameworkSchema>;
export type PluginScreenshot = z.infer<typeof pluginScreenshotSchema>;

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Parse and validate a raw JSON object as a PluginManifest.
 * Returns a typed result; throws ZodError on invalid input.
 *
 * @example
 * import rawJson from './traek-plugin.json'
 * const manifest = parsePluginManifest(rawJson)
 */
export function parsePluginManifest(raw: unknown): PluginManifest {
	return pluginManifestSchema.parse(raw);
}

/**
 * Safe-parse variant — returns { success, data, error } without throwing.
 */
export function safeParsePluginManifest(raw: unknown) {
	return pluginManifestSchema.safeParse(raw);
}
