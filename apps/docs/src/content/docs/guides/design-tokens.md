---
title: Design Tokens & Figma Sync
description: Export Træk design tokens in Style Dictionary format and sync them with Figma Variables.
---

Træk ships all visual design decisions as structured **design tokens** — a single source of truth that drives both the CSS custom properties used at runtime and your Figma Variables.

## Token file location

The canonical token definition lives at:

```
packages/svelte/src/lib/theme/tokens.json
```

It follows the [W3C Design Token Community Group (DTCG)](https://tr.designtokens.org/format/) format, which is natively supported by **Style Dictionary 4.x** and most Figma token plugins.

## Token structure

Tokens are grouped by semantic category:

| Group | Description | Example CSS var |
|---|---|---|
| `color.canvas` | Pannable canvas background & grid | `--traek-canvas-bg` |
| `color.node` | Message node surfaces & borders | `--traek-node-bg` |
| `color.connection` | SVG connector lines | `--traek-connection-stroke` |
| `color.input` | Composer / input bar | `--traek-input-bg` |
| `color.text` | TextNode markdown rendering | `--traek-textnode-text` |
| `color.thought` | Reasoning / thought panel | `--traek-thought-panel-bg` |
| `color.overlay` | Modals and loading overlays | `--traek-overlay-card-bg` |
| `color.sidebar` | Sidebar panel chrome | `--traek-sidebar-bg` |
| `spacing` | 4 / 8 / 16 / 24 / 32 px scale | `--traek-space-md` |
| `radius` | Border radius scale | `--traek-radius-md` |
| `typography.fontFamily` | Sans + mono font stacks | `--traek-font-family` |
| `typography.fontSize` | xs → 2xl text scale | `--traek-text-base` |
| `typography.fontWeight` | 400 → 700 weights | `--traek-weight-semibold` |
| `animation.duration` | fast / normal / slow | `--traek-duration-normal` |

Each token carries:

- `$value` — the dark-theme default
- `$description` — usage context
- `$extensions.traek.cssVar` — the CSS custom property name
- `$extensions.traek.themes` — light and high-contrast overrides

## Generating CSS / JS from tokens (Style Dictionary)

Install Style Dictionary:

```bash
npm install --save-dev style-dictionary
# or
pnpm add -D style-dictionary
```

Create `sd.config.mjs` at your project root:

```js
// sd.config.mjs
import StyleDictionary from 'style-dictionary'

const sd = new StyleDictionary({
  source: ['packages/svelte/src/lib/theme/tokens.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      prefix: 'traek',
      buildPath: 'dist/tokens/',
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables',
          options: { outputReferences: true }
        }
      ]
    },
    js: {
      transformGroup: 'js',
      buildPath: 'dist/tokens/',
      files: [
        {
          destination: 'tokens.js',
          format: 'javascript/es6'
        },
        {
          destination: 'tokens.d.ts',
          format: 'typescript/es6-declarations'
        }
      ]
    },
    json: {
      transformGroup: 'js',
      buildPath: 'dist/tokens/',
      files: [
        {
          destination: 'tokens.json',
          format: 'json/flat'
        }
      ]
    }
  }
})

await sd.buildAllPlatforms()
```

Run the build:

```bash
node sd.config.mjs
```

This outputs:

- `dist/tokens/variables.css` — ready-to-import CSS custom properties
- `dist/tokens/tokens.js` — ES module with named exports
- `dist/tokens/tokens.d.ts` — TypeScript declarations
- `dist/tokens/tokens.json` — flat JSON for tooling

## Syncing with Figma Variables

Figma Variables (available in Professional plans and above) map directly to the DTCG token format.

### Option A — Figma Tokens Plugin (recommended)

1. Install [**Tokens Studio for Figma**](https://tokens.studio) from the Figma Community.
2. Open the plugin → **Sync** → **File** (or connect a GitHub/GitLab repo).
3. Point it at `packages/svelte/src/lib/theme/tokens.json`.
4. Click **Load tokens** — all tokens appear in the plugin panel.
5. Apply tokens to your Figma design by selecting layers and choosing token values.

To push code changes back into Figma:

```bash
# After editing tokens.json, commit and open Tokens Studio
git commit -am "chore(tokens): update canvas bg"
# Tokens Studio detects the change on next sync
```

### Option B — Figma Variables REST API

Use the Figma Variables API directly for CI-driven sync:

```ts
// scripts/sync-figma-variables.ts
import tokens from '../packages/svelte/src/lib/theme/tokens.json' assert { type: 'json' }

const FILE_KEY = process.env.FIGMA_FILE_KEY!
const TOKEN = process.env.FIGMA_ACCESS_TOKEN!

// Flatten token tree into variable definitions
function flattenTokens(obj: Record<string, unknown>, prefix = ''): Array<{ name: string; value: string }> {
  return Object.entries(obj).flatMap(([key, val]) => {
    if (key.startsWith('$')) return []
    const path = prefix ? `${prefix}/${key}` : key
    if (typeof val === 'object' && val !== null && '$value' in val) {
      return [{ name: path, value: String((val as { $value: unknown }).$value) }]
    }
    return flattenTokens(val as Record<string, unknown>, path)
  })
}

const variables = flattenTokens(tokens)

await fetch(`https://api.figma.com/v1/files/${FILE_KEY}/variables`, {
  method: 'POST',
  headers: {
    'X-Figma-Token': TOKEN,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    variableCollections: [{ action: 'UPDATE', id: 'traek-core', name: 'Træk Core Tokens' }],
    variables: variables.map(({ name, value }) => ({
      action: 'UPDATE',
      name,
      resolvedType: 'COLOR',
      valuesByMode: { dark: { type: 'FLOAT', value } }
    }))
  })
})
```

Add a package.json script:

```json
{
  "scripts": {
    "sync:figma": "tsx scripts/sync-figma-variables.ts"
  }
}
```

### Option C — Manual Figma Variables import

For one-time or infrequent syncs:

1. Run `node sd.config.mjs` to generate `dist/tokens/tokens.json` (flat format).
2. In Figma, open **Design** → **Libraries** → **Variables** → **Import JSON**.
3. Drop in `dist/tokens/tokens.json`.

## Three-theme token sets

Træk ships three built-in themes. To expose all three as Figma Variable modes:

1. In Tokens Studio, add three token sets: `dark`, `light`, `highContrast`.
2. For each token, set the `$value` as the dark value (already the file default).
3. Fill in light and high-contrast overrides using the values in `$extensions.traek.themes`.

A helper script to generate per-theme flat JSON:

```ts
// scripts/expand-themes.ts
import base from '../packages/svelte/src/lib/theme/tokens.json' assert { type: 'json' }
import { darkTheme, lightTheme, highContrastTheme } from '../packages/svelte/src/lib/theme/themes'
import fs from 'fs'

function buildThemeJson(themeName: 'light' | 'highContrast') {
  function walk(obj: Record<string, unknown>): Record<string, unknown> {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => {
        if (k.startsWith('$')) return [k, v]
        if (typeof v === 'object' && v !== null && '$value' in v) {
          const token = v as { $value: unknown; $extensions?: { traek?: { themes?: Record<string, string> } } }
          const override = token.$extensions?.traek?.themes?.[themeName]
          return [k, { ...token, $value: override ?? token.$value }]
        }
        return [k, walk(v as Record<string, unknown>)]
      })
    )
  }
  return walk(base as Record<string, unknown>)
}

fs.writeFileSync('dist/tokens/tokens.light.json', JSON.stringify(buildThemeJson('light'), null, 2))
fs.writeFileSync('dist/tokens/tokens.high-contrast.json', JSON.stringify(buildThemeJson('highContrast'), null, 2))
console.log('Theme token files written to dist/tokens/')
```

## CSS variable reference

All tokens map to CSS custom properties on `:root`. Use them in any CSS context:

```css
.my-panel {
  background: var(--traek-node-bg);
  border: 1px solid var(--traek-node-border);
  border-radius: var(--traek-radius-md);
  color: var(--traek-node-text);
  font-size: var(--traek-text-base);
  padding: var(--traek-space-md);
  transition: border-color var(--traek-duration-fast) ease;
}
```

See the [Token Preview](/guides/token-preview) page for a visual reference of all token values.

## Adding custom tokens

To extend the token set with project-specific values, create a `tokens.local.json` alongside the base file:

```json
{
  "color": {
    "brand": {
      "primary": {
        "$value": "#7c3aed",
        "$type": "color",
        "$description": "Brand primary purple",
        "$extensions": { "traek": { "cssVar": "--traek-brand-primary" } }
      }
    }
  }
}
```

Then reference both files in your Style Dictionary config:

```js
source: [
  'packages/svelte/src/lib/theme/tokens.json',
  'tokens.local.json'
]
```
