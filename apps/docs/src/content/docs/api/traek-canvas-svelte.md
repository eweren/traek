---
title: TraekCanvas – Svelte
description: TraekCanvas API for @traek/svelte.
---

# TraekCanvas (`@traek/svelte`)

```svelte
<script>
  import { TraekCanvas, TraekEngine } from '@traek/svelte'
</script>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `engine` | `TraekEngine` | — | Engine instance (**required**) |
| `onSendMessage` | `(e: SendEvent) => void` | — | Called on message submit (**required**) |
| `components` | `ComponentMap` | `{}` | Map of node type → Svelte component |
| `class` | `string` | `''` | Extra CSS classes on the root element |

## `ComponentMap` type (Svelte)

```ts
import type { Component } from 'svelte'
type ComponentMap = Record<string, Component<any>>
```

## Example

```svelte
<script>
  import { TraekCanvas, TraekEngine, TextNode } from '@traek/svelte'
  import MyCustomNode from './MyCustomNode.svelte'

  const engine = new TraekEngine()
</script>

<TraekCanvas
  {engine}
  onSendMessage={({ content }) => engine.addNode({ role: 'user', content })}
  components={{ text: TextNode, custom: MyCustomNode }}
/>
```
