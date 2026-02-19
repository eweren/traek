---
title: Installation
description: How to install and set up Træk in your project.
---

# Installation

## Requirements

- Node.js 20+
- **Svelte**: Svelte 5+, SvelteKit 2+ (recommended)
- **React**: React 18+ or 19+
- **Vanilla JS**: Any modern browser

## Svelte

```bash
npm install traek
# or
pnpm add traek
```

Træk requires Svelte 5 as a peer dependency:

```bash
npm install svelte@^5
```

## React

```bash
npm install @traek/react
```

The React package depends on `@traek/elements` which bundles the Svelte runtime -- you do not need to install Svelte separately.

## Vanilla JS / Vue / Angular / Any Framework

```bash
npm install @traek/elements
```

`@traek/elements` provides a `createTraekCanvas()` function that mounts a full TraekCanvas into any DOM element. The Svelte runtime is bundled -- no additional dependencies are required.

Import the styles in your entry point:

```js
import '@traek/elements/styles.css';
```
