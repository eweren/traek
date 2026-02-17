---
title: Quick Start
description: Get Træk running in 5 minutes.
---

# Quick Start

Pick your framework below.

## Svelte 5

```svelte
<script>
  import { TraekCanvas, TraekEngine } from '@traek/svelte'

  const engine = new TraekEngine()
  engine.addNode({ role: 'assistant', content: 'Hello! How can I help?' })

  async function handleSend({ content }) {
    engine.addNode({ role: 'user', content })
    engine.addNode({ role: 'assistant', content: 'Working on it…' })
  }
</script>

<TraekCanvas {engine} onSendMessage={handleSend} />
```

## React

```tsx
import { TraekCanvas, useCreateTraekEngine } from '@traek/react'

export default function App() {
  const engine = useCreateTraekEngine()

  useEffect(() => {
    engine.addNode({ role: 'assistant', content: 'Hello! How can I help?' })
  }, [engine])

  async function handleSend({ content }: { content: string }) {
    engine.addNode({ role: 'user', content })
    engine.addNode({ role: 'assistant', content: 'Working on it…' })
  }

  return <TraekCanvas engine={engine} onSendMessage={handleSend} />
}
```

## Vue 3

```vue
<script setup lang="ts">
import { TraekCanvas, useCreateTraekEngine } from '@traek/vue'

const engine = useCreateTraekEngine()
engine.addNode({ role: 'assistant', content: 'Hello! How can I help?' })

async function handleSend({ content }: { content: string }) {
  engine.addNode({ role: 'user', content })
  engine.addNode({ role: 'assistant', content: 'Working on it…' })
}
</script>

<template>
  <TraekCanvas :engine="engine" :on-send-message="handleSend" />
</template>
```

## Vanilla TypeScript

```ts
import { TraekEngine } from '@traek/core'

const engine = new TraekEngine()
engine.addNode({ role: 'assistant', content: 'Hello! How can I help?' })

engine.subscribe(() => {
  console.log('Nodes updated:', engine.nodes)
})
```

---

See the **Frameworks** section in the sidebar for full guides and live demos for each adapter.
