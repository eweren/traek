---
title: Advanced Theming
description: Full control over Træk's visual appearance using themes, CSS custom properties, and the programmatic API.
---

# Advanced Theming

Træk ships with three built-in themes (dark, light, high-contrast) and a full programmatic theming API. You can override a handful of variables with raw CSS, build a custom theme object, or respond to the user's system preference automatically.

---

## Quick CSS Override

The fastest way to customise the look is to override CSS custom properties on `:root`. All `--traek-*` variables are set by the theme system and can be overridden in your own stylesheet:

```css
:root {
  --traek-canvas-bg: #050816;
  --traek-node-bg: #0b1020;
  --traek-node-active-border: #4ade80;
  --traek-node-active-glow: rgba(74, 222, 128, 0.15);
  --traek-input-button-bg: #4ade80;
  --traek-input-button-text: #000000;
}
```

Changes take effect immediately without any component changes. You can scope overrides to a container instead of `:root`:

```css
.my-chat-container {
  --traek-canvas-bg: #ffffff;
  --traek-node-bg: #f5f5f5;
}
```

---

## Built-In Themes

Import and use any of the three built-in themes:

```svelte
<script>
  import {
    ThemeProvider,
    darkTheme,
    lightTheme,
    highContrastTheme,
    TraekCanvas,
    TraekEngine
  } from '@traek/svelte'

  const engine = new TraekEngine()
  let theme = darkTheme
</script>

<ThemeProvider {theme}>
  <TraekCanvas {engine} {onSendMessage} />
</ThemeProvider>
```

### Theme Picker

Træk includes a ready-made theme picker component:

```svelte
<script>
  import { ThemeProvider, ThemePicker, TraekCanvas, TraekEngine } from '@traek/svelte'

  const engine = new TraekEngine()
</script>

<ThemeProvider>
  <TraekCanvas {engine} {onSendMessage} />
  <ThemePicker />
</ThemeProvider>
```

The picker automatically saves the user's preference to `localStorage` and restores it on next load.

---

## Programmatic Theme API

### `createCustomTheme(base, accentColor)`

Build a custom theme from any base theme and an accent colour. Træk generates appropriate tints and shades automatically:

```ts
import { createCustomTheme, darkTheme } from '@traek/svelte'

const purpleTheme = createCustomTheme(darkTheme, '#a855f7')
const tealTheme   = createCustomTheme(darkTheme, '#14b8a6')
const roseTheme   = createCustomTheme(lightTheme, '#f43f5e')
```

Use the result anywhere a `TraekTheme` is accepted:

```svelte
<ThemeProvider theme={purpleTheme}>
  <TraekCanvas {engine} {onSendMessage} />
</ThemeProvider>
```

### `applyThemeToRoot(theme)`

Apply a theme imperatively without a `ThemeProvider`:

```ts
import { applyThemeToRoot, darkTheme } from '@traek/svelte'

applyThemeToRoot(darkTheme)
```

This sets all `--traek-*` CSS custom properties on `document.documentElement`. Useful if you want to control theming from outside Svelte/React/Vue (e.g. from a vanilla JS initialisation script).

---

## Building a Custom Theme from Scratch

A `TraekTheme` object contains a `colors` record and an optional `spacing` / `typography` / `animation` section. The full shape is typed as `TraekTheme` from `@traek/svelte`:

```ts
import type { TraekTheme } from '@traek/svelte'

const myTheme: TraekTheme = {
  colors: {
    // Canvas
    canvasBg: '#0a0f1e',
    canvasDot: '#1e2a4a',

    // Nodes
    nodeBg: '#111827',
    nodeBorder: '#1e2a4a',
    nodeText: '#e2e8f0',
    nodeActiveBorder: '#6366f1',
    nodeActiveGlow: 'rgba(99, 102, 241, 0.2)',
    nodeUserBorderTop: '#6366f1',
    nodeAssistantBorderTop: '#ec4899',

    // Connections
    connectionStroke: '#1e2a4a',
    connectionHighlight: '#6366f1',

    // Input
    inputBg: 'rgba(17, 24, 39, 0.9)',
    inputBorder: '#374151',
    inputShadow: 'rgba(0, 0, 0, 0.5)',
    inputButtonBg: '#6366f1',
    inputButtonText: '#ffffff',
    inputText: '#f9fafb',
    inputContextBg: 'rgba(0, 0, 0, 0.4)',
    inputContextText: '#6b7280',
    inputDot: '#6366f1',
    inputDotMuted: '#374151',
    statsText: '#6b7280',

    // Text nodes
    textNodeText: '#e2e8f0',
    textNodeBg: '#1f2937',
    markdownQuoteBorder: '#374151',
    markdownQuoteText: '#9ca3af',
    markdownHr: '#1f2937',
    scrollHintBg: 'linear-gradient(transparent, rgba(0,0,0,0.4))',
    scrollHintText: '#9ca3af',
    scrollbarThumb: '#374151',
    scrollbarThumbHover: '#4b5563',
    typingCursor: '#ec4899',

    // Search
    searchMatchBorder: 'rgba(253, 224, 71, 0.5)',
    searchDimmedOpacity: 0.35,

    // ... additional fields from TraekTheme
  }
}
```

Start with `JSON.parse(JSON.stringify(darkTheme))` as a baseline and override individual fields.

---

## CSS Custom Properties Reference

All properties follow the `--traek-<category>-<property>` convention.

### Canvas

| Variable | Default (dark) | Description |
|----------|---------------|-------------|
| `--traek-canvas-bg` | `#0b0b0b` | Canvas background |
| `--traek-canvas-dot` | `#333333` | Dot-grid pattern colour |

### Nodes

| Variable | Default (dark) | Description |
|----------|---------------|-------------|
| `--traek-node-bg` | `#161616` | Node card background |
| `--traek-node-border` | `#2a2a2a` | Node card border |
| `--traek-node-text` | `#dddddd` | Primary text colour |
| `--traek-node-active-border` | `#00d8ff` | Border of the focused node |
| `--traek-node-active-glow` | `rgba(0,216,255,0.15)` | Glow behind the focused node |
| `--traek-node-user-border-top` | `#00d8ff` | Accent stripe on user nodes |
| `--traek-node-assistant-border-top` | `#ff3e00` | Accent stripe on assistant nodes |

### Connections

| Variable | Default (dark) | Description |
|----------|---------------|-------------|
| `--traek-connection-stroke` | `#333333` | SVG edge colour |
| `--traek-connection-highlight` | `#00d8ff` | Active-path edge colour |

### Input

| Variable | Default (dark) | Description |
|----------|---------------|-------------|
| `--traek-input-bg` | `rgba(30,30,30,0.8)` | Input bar background |
| `--traek-input-border` | `#444444` | Input bar border |
| `--traek-input-button-bg` | `#00d8ff` | Send button fill |
| `--traek-input-button-text` | `#000000` | Send button label |
| `--traek-input-text` | `#ffffff` | Typed text colour |

### Text Nodes

| Variable | Default (dark) | Description |
|----------|---------------|-------------|
| `--traek-textnode-text` | `#dddddd` | Rendered markdown text |
| `--traek-textnode-bg` | `#222222` | Code block background |
| `--traek-typing-cursor` | `#ff3e00` | Streaming cursor colour |
| `--traek-markdown-quote-border` | `#444444` | Blockquote left border |

---

## System Theme Detection

Respond to the user's OS preference automatically:

```svelte
<script>
  import { ThemeProvider, darkTheme, lightTheme, TraekCanvas, TraekEngine } from '@traek/svelte'

  const engine = new TraekEngine()

  // Reactive: update when OS preference changes
  let prefersDark = $state(
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : true
  )

  $effect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => { prefersDark = e.matches }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  })

  let theme = $derived(prefersDark ? darkTheme : lightTheme)
</script>

<ThemeProvider {theme}>
  <TraekCanvas {engine} {onSendMessage} />
</ThemeProvider>
```

---

## Per-Node Custom Styling

You can attach custom CSS classes or inline styles to individual nodes via a custom node component:

```svelte
<!-- PriorityNode.svelte -->
<script>
  import type { TraekNodeComponentProps } from '@traek/svelte'
  let { node } = $props<TraekNodeComponentProps>()

  const priority = node.data?.priority ?? 'normal'
</script>

<div class="priority-node" data-priority={priority}>
  {node.content}
</div>

<style>
  .priority-node[data-priority='high'] {
    border-left: 3px solid #ef4444;
  }
  .priority-node[data-priority='low'] {
    opacity: 0.7;
  }
</style>
```

Register it in the `components` map:

```svelte
<TraekCanvas {engine} {onSendMessage} components={{ priority: PriorityNode }} />
```

See [Custom Node Types](/guides/plugin-development) for the full custom node API.
