---
title: Installation
description: How to install Træk packages in your project.
---

# Installation

## Requirements

- Node.js 20+
- A package manager: npm, pnpm, or yarn

## Choose Your Package

Install only the package for your framework:

### Svelte 5

```bash
npm install @traek/svelte
# or
pnpm add @traek/svelte
```

Peer dependency: `svelte@^5`

### React 18+

```bash
npm install @traek/react
# or
pnpm add @traek/react
```

Peer dependencies: `react@^18`, `react-dom@^18`

### Vue 3

```bash
npm install @traek/vue
# or
pnpm add @traek/vue
```

Peer dependency: `vue@^3.4`

### Vanilla TypeScript / JavaScript (headless core only)

```bash
npm install @traek/core
# or
pnpm add @traek/core
```

`@traek/core` has no framework or browser dependencies. All framework packages re-export everything from `@traek/core`, so you never need to install both.

## CSS

Import the base stylesheet once at the root of your app:

```ts
import '@traek/svelte/dist/traek.css'   // Svelte
import '@traek/react/dist/traek.css'    // React
import '@traek/vue/dist/traek.css'      // Vue
```

> **Note:** The canvas relies on a handful of `--traek-*` CSS custom properties. Override them on `:root` to customise the theme.
