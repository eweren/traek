# @traek/whitelabel — Brand Customization Guide

This guide covers how to white-label `@traek/svelte` for enterprise deployments.
You will replace Træk's visual identity — colors, fonts, loading screen, and brand metadata — with your own.

---

## Installation

```bash
npm install @traek/whitelabel
```

`@traek/svelte` must be installed alongside it. `@traek/whitelabel` does not bundle any UI components itself — it provides configuration tools and loading screen templates.

---

## Quick Start

### 1. Apply brand colors and metadata

Call `applyWhitelabel()` once at app startup, before mounting the Træk canvas.

**SvelteKit:** call it in your root `+layout.svelte`:

```svelte
<!-- src/routes/+layout.svelte -->
<script>
	import { onMount } from 'svelte';
	import { applyWhitelabel } from '@traek/whitelabel';

	onMount(() => {
		applyWhitelabel({
			brand: {
				name: 'Acme AI',
				logoUrl: '/acme-logo.svg',
				loadingText: 'Starting your session…',
				faviconUrl: '/favicon.ico',
				pageTitle: 'Acme AI'
			},
			brandColors: {
				accent: '#6366f1', // indigo
				assistantAccent: '#f59e0b', // amber
				canvasBg: '#0f0f23'
			},
			typography: {
				fontFamily: "'Inter', sans-serif",
				fontMono: "'JetBrains Mono', monospace"
			},
			loadingScreen: {
				variant: 'branded'
			}
		});
	});
</script>

<slot />
```

### 2. Replace the loading overlay

The `TraekCanvas` component accepts a `loadingOverlay` snippet. Pass one of the
provided templates or your own component:

```svelte
<!-- MyCanvas.svelte -->
<script>
	import { TraekCanvas } from '@traek/svelte';
	import { BrandedLoading } from '@traek/whitelabel';
</script>

<TraekCanvas {engine} {onSendMessage}>
	{#snippet loadingOverlay()}
		<BrandedLoading name="Acme AI" logoUrl="/acme-logo.svg" text="Starting your session…" />
	{/snippet}
</TraekCanvas>
```

---

## Configuration Reference

### `brand` — Brand identity

```ts
interface BrandConfig {
	/** Product name for aria-labels and loading screens */
	name?: string;

	/** URL of logo image (.svg, .png, .webp) */
	logoUrl?: string;

	/** Alt text for logo. Defaults to "${name} logo" */
	logoAlt?: string;

	/** CSS width of the logo in loading screens. Default: '80px' */
	logoWidth?: string;

	/** Text shown during canvas initialization */
	loadingText?: string;

	/** Favicon URL — updates <link rel="icon"> */
	faviconUrl?: string;

	/** Page title prefix (stored as data attribute for layout use) */
	pageTitle?: string;
}
```

### `brandColors` — Semantic color aliases

```ts
interface BrandColors {
	/**
	 * Primary accent color (6-digit hex only).
	 * Drives ~12 tokens: active borders, send button, connection
	 * highlights, thought panel, CTA pills, and their alpha variants.
	 */
	accent?: string; // e.g. '#6366f1'

	/** User message node top border. Defaults to accent. */
	userAccent?: string;

	/** Assistant message node top border + typing cursor. */
	assistantAccent?: string; // e.g. '#f59e0b'

	/** Canvas background color */
	canvasBg?: string; // e.g. '#0f0f23'

	/** Node card background */
	nodeBg?: string;

	/** Primary text color on nodes */
	nodeText?: string;
}
```

### `typography` — Font overrides

```ts
interface TypographyConfig {
	/** CSS font-family for body text. Default: 'Space Grotesk, sans-serif' */
	fontFamily?: string;

	/** CSS font-family for code blocks. Default: 'Space Mono, monospace' */
	fontMono?: string;
}
```

Note: font files must be loaded by your application. Use `<link>` tags or `@font-face` in your app CSS.

### `loadingScreen` — Loading overlay config

```ts
interface LoadingScreenConfig {
	/**
	 * Loading screen variant.
	 * - 'minimal'  — pill badge with animated dot (default Træk style)
	 * - 'branded'  — logo + caption centered on blurred background
	 * - 'splash'   — full-viewport, solid or gradient background
	 * - 'none'     — render nothing during initialization
	 */
	variant?: 'minimal' | 'branded' | 'splash' | 'none';

	/**
	 * Background for 'splash' variant.
	 * Any CSS background value: color, gradient, or url().
	 */
	splashBackground?: string;

	/** Show an animated progress bar at the bottom of the splash screen */
	showProgressBar?: boolean;
}
```

### `tokenOverrides` — Raw CSS variable overrides

For advanced customization, override individual CSS custom properties directly.
These take precedence over all `brandColors` aliases.

```ts
tokenOverrides?: {
  [token: TraekCssToken]: string
}
```

**Example:**

```ts
applyWhitelabel({
	tokenOverrides: {
		'traek-canvas-bg': '#fafafa',
		'traek-node-bg': '#ffffff',
		'traek-node-border': '#e5e7eb',
		'traek-node-text': '#111827',
		'traek-canvas-dot': '#f3f4f6',
		'traek-connection-stroke': '#d1d5db'
	}
});
```

See `docs/token-reference.md` for the complete list of overridable tokens.

---

## Loading Screen Templates

Three Svelte 5 components are provided. All colors automatically inherit from
your CSS custom property overrides.

### `MinimalLoading`

Drop-in replacement for `DefaultLoadingOverlay`. Identical appearance,
fully token-driven.

```svelte
<script>
	import { MinimalLoading } from '@traek/whitelabel';
</script>

<MinimalLoading text="Starting…" />
```

| Prop    | Type     | Default      |
| ------- | -------- | ------------ |
| `text`  | `string` | `'Loading…'` |
| `label` | `string` | `'Loading'`  |

### `BrandedLoading`

Centered logo + caption on blurred canvas background.

```svelte
<BrandedLoading name="Acme AI" logoUrl="/logo.svg" text="Starting your session…" />
```

| Prop        | Type     | Default             |
| ----------- | -------- | ------------------- |
| `name`      | `string` | —                   |
| `logoUrl`   | `string` | —                   |
| `logoSvg`   | `string` | —                   |
| `logoAlt`   | `string` | `'${name} logo'`    |
| `logoWidth` | `string` | `'80px'`            |
| `text`      | `string` | `'Loading…'`        |
| `label`     | `string` | name or `'Loading'` |

### `SplashLoading`

Full-viewport loading screen. Use when Træk takes up the entire page.

```svelte
<SplashLoading
	name="Acme AI"
	logoUrl="/logo.svg"
	background="linear-gradient(135deg, #1e1b4b, #312e81)"
	showProgressBar={true}
/>
```

| Prop              | Type      | Default                    |
| ----------------- | --------- | -------------------------- |
| `name`            | `string`  | —                          |
| `logoUrl`         | `string`  | —                          |
| `logoSvg`         | `string`  | —                          |
| `logoAlt`         | `string`  | `'${name} logo'`           |
| `logoWidth`       | `string`  | `'120px'`                  |
| `text`            | `string`  | —                          |
| `background`      | `string`  | `'var(--traek-canvas-bg)'` |
| `showProgressBar` | `boolean` | `false`                    |
| `label`           | `string`  | name or `'Loading'`        |

---

## Accessibility

All loading screen components:

- Use `role="status"` and `aria-label` for screen reader announcements
- Respect `prefers-reduced-motion` — all animations are disabled when the user has requested reduced motion
- Pass WCAG AA contrast requirements when using the provided dark/light themes as a base

When overriding colors:

- Verify text contrast: minimum 4.5:1 for normal text, 3:1 for large text
- Use the `validateContrast()` utility (see below)
- Never reduce the contrast of error states or interactive focus rings

---

## Contrast Validation

```ts
import { validateContrast } from '@traek/whitelabel';

const result = validateContrast({
	foreground: '#ffffff',
	background: '#6366f1'
});

// result: { ratio: 4.67, passesAA: true, passesAAA: false }
```

Run this for every foreground/background pair in your brand palette.
Minimum ratios: **4.5:1** (normal text), **3:1** (large text, UI components).

---

## Recipes

### Light mode enterprise

```ts
applyWhitelabel({
	brandColors: {
		accent: '#2563eb', // blue-600
		assistantAccent: '#059669', // emerald-600
		canvasBg: '#f8fafc',
		nodeBg: '#ffffff',
		nodeText: '#0f172a'
	},
	tokenOverrides: {
		'traek-node-border': '#e2e8f0',
		'traek-connection-stroke': '#cbd5e1',
		'traek-canvas-dot': '#e2e8f0',
		'traek-input-bg': 'rgba(255, 255, 255, 0.95)',
		'traek-input-border': '#cbd5e1'
	}
});
```

### Dark enterprise with brand purple

```ts
applyWhitelabel({
	brandColors: {
		accent: '#7c3aed', // violet-700
		assistantAccent: '#0ea5e9', // sky-500
		canvasBg: '#09090b',
		nodeBg: '#18181b',
		nodeText: '#f4f4f5'
	},
	typography: {
		fontFamily: "'IBM Plex Sans', sans-serif",
		fontMono: "'IBM Plex Mono', monospace"
	}
});
```

### Remove the dot grid

```ts
applyWhitelabel({
	tokenOverrides: {
		'traek-canvas-dot': 'transparent'
	}
});
```

---

## Troubleshooting

**Colors not updating:**
`applyWhitelabel()` must be called client-side (after mount). It uses the DOM.
Wrap in `onMount()` in SvelteKit.

**Logo not appearing in `BrandedLoading`:**
Provide either `logoUrl` (image path) or `logoSvg` (inline SVG string), not both.
Check network tab for 404 on the logo URL.

**Contrast validation failing:**
Use a darker/lighter variant of your accent color. For purple accents on dark backgrounds, try lightening by 20–30% to meet 4.5:1.

**Fonts not changing:**
Set `typography.fontFamily` in the config AND load the font file in your app's CSS. The library only sets the CSS custom property — it does not inject `@font-face` declarations.

**TypeScript errors on `tokenOverrides`:**
Keys must be valid `TraekCssToken` values (without `--` prefix). See `types.ts` for the complete union.
