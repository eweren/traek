---
title: Using with Vanilla JS
description: Use Træk in vanilla JavaScript, Vue, Angular, or any framework.
---

# Using with Vanilla JS

The `@traek/elements` package provides a framework-agnostic mount API. It works with vanilla JavaScript, Vue, Angular, or any environment with a DOM.

## Installation

```bash
npm install @traek/elements
```

## Basic Setup

```js
import { createTraekCanvas, TraekEngine } from '@traek/elements';
import '@traek/elements/styles.css';

const engine = new TraekEngine();

const canvas = createTraekCanvas(document.getElementById('app'), {
  engine,
  onSendMessage: (input, userNode) => {
    const reply = engine.addNode('', 'assistant', { autofocus: true });
    engine.updateNode(reply.id, { status: 'streaming' });

    // Simulate response
    setTimeout(() => {
      engine.updateNode(reply.id, {
        content: `You said: ${input}`,
        status: 'done'
      });
    }, 500);
  }
});
```

## Updating Options

After mounting, you can update any option:

```js
canvas.update({
  mode: 'focus',
  tourDelay: -1
});
```

## Cleanup

When you are done, destroy the instance to clean up all resources:

```js
canvas.destroy();
```

## Theming

Apply themes via CSS custom properties or the theme utilities:

```js
import { applyThemeToRoot, darkTheme, lightTheme } from '@traek/elements';

applyThemeToRoot(darkTheme);
```

## Vue Example

```vue
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { createTraekCanvas, TraekEngine } from '@traek/elements';
import '@traek/elements/styles.css';

const container = ref(null);
const engine = new TraekEngine();
let instance;

onMounted(() => {
  instance = createTraekCanvas(container.value, {
    engine,
    onSendMessage: (input) => {
      const reply = engine.addNode('', 'assistant', { autofocus: true });
      engine.updateNode(reply.id, { status: 'streaming' });
      setTimeout(() => {
        engine.updateNode(reply.id, { content: `Echo: ${input}`, status: 'done' });
      }, 500);
    }
  });
});

onBeforeUnmount(() => instance?.destroy());
</script>

<template>
  <div ref="container" style="width: 100%; height: 100vh" />
</template>
```

## createTraekCanvas API

```ts
function createTraekCanvas(
  target: HTMLElement,
  options?: TraekCanvasOptions
): TraekCanvasInstance;
```

### TraekCanvasOptions

| Option | Type | Description |
|--------|------|-------------|
| `engine` | `TraekEngine` | Engine instance (created automatically if omitted) |
| `config` | `Partial<TraekEngineConfig>` | Engine config overrides |
| `onSendMessage` | `function` | Called when user submits a message |
| `onNodesChanged` | `function` | Called on any node change |
| `onViewportChange` | `function` | Called on zoom/pan |
| `mode` | `'auto' \| 'canvas' \| 'focus'` | UI mode |
| `showFps` | `boolean` | Show FPS counter |
| `tourDelay` | `number` | Onboarding tour delay (-1 to disable) |
| `translations` | `object` | i18n overrides |
| `onRetry` | `function` | Called on retry |
| `onEditNode` | `function` | Called on edit |

### TraekCanvasInstance

| Method | Description |
|--------|-------------|
| `update(options)` | Update options on the live instance |
| `destroy()` | Unmount and clean up all resources |
