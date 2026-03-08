# @traek/whitelabel

> White-label theming kit for `@traek/svelte`. Replace Træk's visual identity with your own brand.

Part of the [Træk](https://github.com/gettraek/traek) open core ecosystem.
**License:** Commercial — requires a Træk Enterprise license.

---

## What it does

- **Token override system** — change any of 130+ CSS custom properties
- **Semantic color aliases** — set `accent: '#6366f1'` and all 12 related tokens update automatically
- **Loading screen templates** — three Svelte 5 components (`MinimalLoading`, `BrandedLoading`, `SplashLoading`)
- **Brand metadata** — logo, favicon, page title, loading text
- **Typography overrides** — swap `Space Grotesk`/`Space Mono` for your own fonts
- **Runtime validation** — Zod-validated config with helpful error messages

## Installation

```bash
npm install @traek/whitelabel
```

Requires `@traek/svelte >= 0.0.4` and `svelte >= 5`.

## Quick start

```ts
import { applyWhitelabel } from '@traek/whitelabel'

// Call once, client-side, before mounting the canvas
applyWhitelabel({
  brand: {
    name: 'Acme AI',
    logoUrl: '/acme-logo.svg',
    loadingText: 'Starting your session…',
  },
  brandColors: {
    accent: '#6366f1',
    assistantAccent: '#f59e0b',
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
  },
})
```

```svelte
<!-- Replace the default loading screen -->
<script>
  import { TraekCanvas } from '@traek/svelte'
  import { BrandedLoading } from '@traek/whitelabel'
</script>

<TraekCanvas {engine} {onSendMessage}>
  {#snippet loadingOverlay()}
    <BrandedLoading name="Acme AI" logoUrl="/acme-logo.svg" />
  {/snippet}
</TraekCanvas>
```

## Documentation

- [Brand Touchpoints Audit](./docs/brand-touchpoints.md) — every Træk branding element and how to remove it
- [Customization Guide](./docs/customization-guide.md) — full config reference, recipes, troubleshooting
- [Token Reference](./docs/token-reference.md) — all 130+ CSS custom properties

## License

Commercial license required. Contact [enterprise@gettraek.com](mailto:enterprise@gettraek.com).
The `@traek/svelte` core library remains MIT.
