---
title: TraekCanvas – Vue
description: TraekCanvas API for @traek/vue.
---

# TraekCanvas (`@traek/vue`)

```ts
import { TraekCanvas } from '@traek/vue'
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `engine` | `TraekEngine` | — | Engine instance (**required**) |
| `onSendMessage` | `(e: SendEvent) => void` | — | Called on message submit (**required**) |
| `class` | `string` | `''` | Extra CSS classes on the root element |

## Slots

| Slot | Props | Description |
|------|-------|-------------|
| `node` | `{ node: Node, engine: TraekEngine, isActive: boolean }` | Replace the default node renderer |

## Example

```vue
<script setup lang="ts">
import { TraekCanvas, useCreateTraekEngine } from '@traek/vue'

const engine = useCreateTraekEngine()
</script>

<template>
  <TraekCanvas
    :engine="engine"
    :on-send-message="({ content }) => engine.addNode({ role: 'user', content })"
  >
    <template #node="{ node, engine, isActive }">
      <div :class="['custom-node', { active: isActive }]">
        {{ node.content }}
      </div>
    </template>
  </TraekCanvas>
</template>
```
