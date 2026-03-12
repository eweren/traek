# Træk Brand Touchpoints Audit

**Package:** `@traek/whitelabel`
**Date:** 2026-03-07
**Scope:** All visual and textual Træk branding within `@traek/svelte` that enterprise customers may want to remove or replace.

---

## Summary

| Category                          | Touchpoints      | Removable via          | Effort |
| --------------------------------- | ---------------- | ---------------------- | ------ |
| Visual — accent color             | ~12 tokens       | `brandColors.accent`   | Low    |
| Visual — loading screen           | 1 component      | `loadingScreen` config | Low    |
| Visual — canvas dot pattern       | 1 token          | `tokenOverrides`       | Low    |
| Text — loading message            | 1 string         | `brand.loadingText`    | Low    |
| Text — aria-labels / i18n         | Multiple strings | `WhitelabelI18n` (v2)  | Medium |
| Text — console attribution        | 1 log statement  | Build flag (v2)        | Medium |
| Document — favicon                | `<link>` tag     | `brand.faviconUrl`     | Low    |
| Document — page title             | `<title>` tag    | `brand.pageTitle`      | Low    |
| Font — Space Grotesk / Space Mono | 2 families       | `typography` config    | Medium |

---

## 1. Colors & Visual Tokens

### Primary Accent (`#00d8ff` — cyan)

The Træk brand color appears in these CSS custom properties:

| Token                                 | Where used                       | Scope   |
| ------------------------------------- | -------------------------------- | ------- |
| `--traek-node-active-border`          | Active node selection ring       | Canvas  |
| `--traek-node-active-glow`            | Active node outer glow           | Canvas  |
| `--traek-node-user-border-top`        | Top border on user message nodes | Node    |
| `--traek-connection-highlight`        | Hovered connection line          | Canvas  |
| `--traek-input-button-bg`             | Send button background           | Input   |
| `--traek-input-dot`                   | Status indicator in input area   | Input   |
| `--traek-thought-panel-border-active` | Active thought panel border      | Thought |
| `--traek-thought-panel-glow`          | Thought panel glow effect        | Thought |
| `--traek-thought-tag-cyan`            | Cyan category tags               | Thought |
| `--traek-thought-badge-cyan`          | Cyan badges                      | Thought |
| `--traek-overlay-pill-bg`             | Loading dot + CTA pills          | Overlay |
| `--traek-overlay-pill-shadow`         | Loading dot glow                 | Overlay |

**Replacement:** Set `brandColors.accent` in `WhitelabelConfig`. All 12 tokens are updated automatically with correct alpha variants.

### Secondary Accent (`#ff3e00` — orange/red)

Used for:

| Token                               | Where used                            |
| ----------------------------------- | ------------------------------------- |
| `--traek-node-assistant-border-top` | Top border on assistant message nodes |
| `--traek-typing-cursor`             | Blinking cursor during streaming      |
| `--traek-thought-tag-orange`        | Orange category tags                  |

**Replacement:** Set `brandColors.assistantAccent` or `tokenOverrides['traek-node-assistant-border-top']`.

### Canvas Dot Grid

| Token                | Default   | Notes             |
| -------------------- | --------- | ----------------- |
| `--traek-canvas-bg`  | `#0b0b0b` | Canvas background |
| `--traek-canvas-dot` | `#333333` | Dot grid color    |

To remove the dot pattern entirely, set `--traek-canvas-dot` to the same value as `--traek-canvas-bg`.

---

## 2. Loading Screen

**Component:** `DefaultLoadingOverlay` (exported from `@traek/svelte`)

**Current content:**

- Blurred radial gradient background using `--traek-overlay-*` tokens
- A pill badge with animated cyan dot and text "Preparing canvas…"

**Branding elements:**

- Cyan dot color (`--traek-overlay-pill-bg` = `#00d8ff`)
- Text string: hardcoded via i18n key `loading.preparingCanvas`

**Replacement options:**

| Option                 | How                                                                         |
| ---------------------- | --------------------------------------------------------------------------- |
| Change text only       | `brand.loadingText` in config                                               |
| Replace entire overlay | Pass a custom component to `TraekCanvas` via the `loadingOverlay` slot/prop |
| Use `MinimalLoading`   | Same appearance, fully token-driven                                         |
| Use `BrandedLoading`   | Logo + text, customizable                                                   |
| Use `SplashLoading`    | Full-screen, for app-level loading                                          |
| Disable loading screen | `loadingScreen.variant = 'none'`                                            |

---

## 3. Typography

**Current fonts:**

- Primary: `'Space Grotesk', sans-serif` — set via `--traek-font-family`
- Monospace: `'Space Mono', monospace` — set via `--traek-font-mono` (code blocks)

These fonts are loaded by the consuming application's CSS, not by `@traek/svelte` itself. The library only sets the CSS custom property values.

**Replacement:**

```ts
applyWhitelabel({
	typography: {
		fontFamily: "'Inter', sans-serif",
		fontMono: "'JetBrains Mono', monospace"
	}
});
```

The consuming app must load the chosen fonts (via Google Fonts, Fontaine, etc.).

---

## 4. Document / HTML

### Favicon

Træk does not set a favicon itself. The consuming application's `app.html` controls it. Use `brand.faviconUrl` in the config to update it programmatically after mount.

### Page Title

Træk does not control the page title. Use `brand.pageTitle` to store a brand prefix in `data-traek-brand-title` for use in your SvelteKit layout:

```svelte
<!-- src/routes/+layout.svelte -->
<script>
	import { page } from '$app/stores';
	const brandTitle = document.documentElement.dataset.traekBrandTitle ?? 'Træk';
</script>

<svelte:head>
	<title>{brandTitle} — {$page.data.title ?? 'Canvas'}</title>
</svelte:head>
```

---

## 5. Text Strings (i18n)

Internal text strings are currently set in `packages/svelte/src/lib/i18n/`. These include:

| Key                       | Default text           | Location                |
| ------------------------- | ---------------------- | ----------------------- |
| `loading.preparingCanvas` | "Preparing canvas…"    | `DefaultLoadingOverlay` |
| `toolbar.*`               | Various toolbar labels | `NodeToolbar`           |
| `input.placeholder`       | "Ask anything…"        | Input component         |
| `search.*`                | Search UI strings      | Search overlay          |
| `empty.*`                 | Empty state messages   | Canvas                  |

**v1:** Override the loading text via `brand.loadingText`. All other strings use the i18n system.

**v2 (planned):** `WhitelabelI18n` config object — full string override surface for all UI copy.

---

## 6. What Cannot Be White-Labeled in v1

These elements are intentionally not overridable in the first release:

| Element                                    | Reason                                             | Planned for |
| ------------------------------------------ | -------------------------------------------------- | ----------- |
| All i18n strings                           | String override API needs design                   | v2          |
| Console attribution log                    | Minor effort; low priority                         | v2          |
| Node toolbar icon set                      | Requires icon injection system                     | v2          |
| Connection line style (bezier vs straight) | Separate config option                             | v2          |
| Node border radius                         | Currently in `ThemeRadius`, needs CSS var plumbing | v2          |

---

## Checklist for Enterprise Customers

Use this as a go/no-go checklist before launching a white-labeled Træk instance:

- [ ] Accent color set to brand primary (`brandColors.accent`)
- [ ] Assistant accent set to brand secondary or neutral (`brandColors.assistantAccent`)
- [ ] Canvas background matches product palette (`brandColors.canvasBg`)
- [ ] Node background matches product palette (`brandColors.nodeBg`)
- [ ] Loading screen customized (logo, text, or variant)
- [ ] Fonts replaced with brand typography (`typography.fontFamily`)
- [ ] Favicon updated (`brand.faviconUrl`)
- [ ] Page title prefix set (`brand.pageTitle`)
- [ ] WCAG AA contrast verified on accent vs. background (use `validateContrast()` utility)
- [ ] Dark and light theme variants both tested
- [ ] Loading screen tested on slow connection (3G throttle in DevTools)
