---
title: Plugin Development
description: Build custom node types, toolbar actions, and extensions for Træk.
---

# Plugin Development

Træk's extension model is built around **node type definitions**. Each node type defines:

- A Svelte/React/Vue **component** to render nodes of that type
- Optional **toolbar actions** shown in the floating node toolbar
- **Lifecycle hooks** called when nodes are created or destroyed
- **Serialization** hooks for persistence

---

## The `NodeTypeDefinition` Interface

```ts
interface NodeTypeDefinition<TData = unknown> {
  /** Unique type key. Must match node.type values you create. */
  type: string

  /** Human-readable label (shown in UI). */
  label: string

  /** The component to render nodes of this type. */
  component?: SvelteComponent | ReactComponent | VueComponent

  /** Optional icon (emoji or short string). */
  icon?: string

  /**
   * When true, your component manages its own TraekNodeWrapper.
   * Default false — the canvas wraps your component automatically.
   */
  selfWrapping?: boolean

  /** Default layout hints. */
  defaultSize?: { width?: number; minHeight?: number }

  /** Validate node.data (type guard). */
  validateData?: (data: unknown) => data is TData

  /** Strip non-serializable parts before saving. */
  serializeData?: (data: TData) => unknown

  /** Restore serialized data. */
  deserializeData?: (raw: unknown) => TData

  /** Toolbar actions for this node type. */
  actions?: NodeTypeAction[]

  /** Called after the node is added to the engine. */
  onCreate?: (node: Node, engine: TraekEngine) => void

  /** Called before the node is removed from the engine. */
  onDestroy?: (node: Node, engine: TraekEngine) => void
}
```

---

## Step 1: Create a Node Component

Every node component receives standard props. Use the `TraekNodeComponentProps` type:

**Svelte:**

```svelte
<!-- ImageNode.svelte -->
<script lang="ts">
  import type { TraekNodeComponentProps } from '@traek/svelte'

  let { node, engine, isActive }: TraekNodeComponentProps = $props()

  // node.data holds your custom payload (typed as TData)
  const src = (node.data as { url: string }).url
</script>

<div class="image-node" class:active={isActive}>
  <img {src} alt={node.content || 'Image'} />
  {#if node.content}
    <p class="caption">{node.content}</p>
  {/if}
</div>
```

**React:**

```tsx
// ImageNode.tsx
import type { TraekNodeComponentProps } from '@traek/react'

export function ImageNode({ node, engine, isActive }: TraekNodeComponentProps) {
  const src = (node.data as { url: string }).url
  return (
    <div className={`image-node ${isActive ? 'active' : ''}`}>
      <img src={src} alt={node.content || 'Image'} />
      {node.content && <p className="caption">{node.content}</p>}
    </div>
  )
}
```

**Vue:**

```vue
<!-- ImageNode.vue -->
<script setup lang="ts">
import type { TraekNodeComponentProps } from '@traek/vue'

const { node, engine, isActive } = defineProps<TraekNodeComponentProps>()
const src = (node.data as { url: string }).url
</script>

<template>
  <div class="image-node" :class="{ active: isActive }">
    <img :src="src" :alt="node.content || 'Image'" />
    <p v-if="node.content" class="caption">{{ node.content }}</p>
  </div>
</template>
```

---

## Step 2: Define the Node Type

```ts
// imageNodeDefinition.ts
import type { NodeTypeDefinition } from '@traek/svelte'
import ImageNode from './ImageNode.svelte'

interface ImageData {
  url: string
  width?: number
  height?: number
}

export const imageNodeDefinition: NodeTypeDefinition<ImageData> = {
  type: 'image',
  label: 'Image',
  icon: '🖼',
  component: ImageNode,
  defaultSize: { minHeight: 200 },

  validateData(data): data is ImageData {
    return typeof (data as ImageData)?.url === 'string'
  },

  serializeData(data) {
    // Persist all fields
    return { url: data.url, width: data.width, height: data.height }
  },

  deserializeData(raw) {
    const d = raw as ImageData
    return { url: d.url, width: d.width, height: d.height }
  },

  actions: [
    {
      id: 'copy-url',
      label: 'Copy URL',
      icon: '📋',
      handler(node) {
        const url = (node.data as ImageData).url
        navigator.clipboard.writeText(url)
      }
    },
    {
      id: 'open-in-tab',
      label: 'Open',
      icon: '↗',
      handler(node) {
        const url = (node.data as ImageData).url
        window.open(url, '_blank')
      }
    }
  ],

  onCreate(node, engine) {
    console.log(`Image node created: ${node.id}`)
  },

  onDestroy(node, engine) {
    console.log(`Image node removed: ${node.id}`)
  }
}
```

---

## Step 3: Register and Use the Plugin

### Svelte

```svelte
<script lang="ts">
  import {
    TraekCanvas,
    TraekEngine,
    NodeTypeRegistry,
    createDefaultRegistry
  } from '@traek/svelte'
  import { imageNodeDefinition } from './imageNodeDefinition'

  const engine = new TraekEngine()

  // Start with built-in text + thought types, then add yours
  const registry = createDefaultRegistry()
  registry.register(imageNodeDefinition)

  // Add an image node programmatically
  engine.addNode({
    role: 'assistant',
    content: 'Here is the diagram:',
    type: 'image',
    data: { url: 'https://example.com/diagram.png' }
  })
</script>

<TraekCanvas {engine} {registry} onSendMessage={handleSend} />
```

### React

```tsx
import { TraekCanvas, useCreateTraekEngine, NodeTypeRegistry, createDefaultRegistry } from '@traek/react'
import { imageNodeDefinition } from './imageNodeDefinition'

export function Chat() {
  const engine = useCreateTraekEngine()
  const registry = useMemo(() => {
    const r = createDefaultRegistry()
    r.register(imageNodeDefinition)
    return r
  }, [])

  return <TraekCanvas engine={engine} registry={registry} onSendMessage={handleSend} />
}
```

### Vue

```vue
<script setup lang="ts">
import { TraekCanvas, useCreateTraekEngine, createDefaultRegistry } from '@traek/vue'
import { imageNodeDefinition } from './imageNodeDefinition'

const engine = useCreateTraekEngine()
const registry = createDefaultRegistry()
registry.register(imageNodeDefinition)
</script>

<template>
  <TraekCanvas :engine="engine" :registry="registry" :on-send-message="handleSend" />
</template>
```

---

## Node Toolbar Actions

Toolbar actions appear in the floating toolbar when a node is focused. Each action has:

```ts
interface NodeTypeAction {
  id: string                         // Unique per type
  label: string                      // Button tooltip / label
  icon?: string                      // Emoji or short string
  handler: (node, engine) => void    // Called on click

  // Optional: return variants to show a sub-menu instead of running handler
  variants?: (node, engine) => ActionVariant[] | null
}

interface ActionVariant {
  label: string
  handler: (node, engine) => void
}
```

Example with a variant sub-menu:

```ts
{
  id: 'export',
  label: 'Export',
  icon: '⬇',
  variants(node, engine) {
    return [
      {
        label: 'Export as PNG',
        handler(node) { exportAsPng(node) }
      },
      {
        label: 'Export as SVG',
        handler(node) { exportAsSvg(node) }
      }
    ]
  }
}
```

---

## Programmatic Node Creation

Your plugin can add nodes of its custom type from anywhere:

```ts
const engine = useTraekEngine() // or passed via prop

engine.addNode({
  role: 'assistant',
  content: '',
  type: 'image',
  status: 'done',
  data: {
    url: imageUrl,
    width: 800,
    height: 600
  }
})
```

The `type` field must match a registered definition's `type` string.

---

## Persistence with Custom Data

When your nodes carry non-serializable data (like `File` objects, Blobs, or class instances), implement `serializeData` and `deserializeData`:

```ts
interface VideoData {
  url: string
  duration: number
  thumbnailBlob?: Blob  // Not JSON-serializable!
}

const videoNodeDefinition: NodeTypeDefinition<VideoData> = {
  type: 'video',
  // ...
  serializeData(data) {
    // Drop the blob — only save the URL
    return { url: data.url, duration: data.duration }
  },
  deserializeData(raw) {
    const d = raw as { url: string; duration: number }
    return { url: d.url, duration: d.duration }
    // thumbnailBlob will be regenerated lazily by the component
  }
}
```

---

## Complete Plugin Example: Code Execution Node

This example shows a node type that runs JavaScript snippets:

```ts
// codeRunnerDefinition.ts
import type { NodeTypeDefinition } from '@traek/svelte'
import CodeRunnerNode from './CodeRunnerNode.svelte'

interface CodeData {
  language: string
  source: string
  output?: string
  error?: string
  lastRunAt?: number
}

export const codeRunnerDefinition: NodeTypeDefinition<CodeData> = {
  type: 'code-runner',
  label: 'Code Runner',
  icon: '▶',
  component: CodeRunnerNode,
  defaultSize: { minHeight: 250 },

  validateData(data): data is CodeData {
    return typeof (data as CodeData)?.source === 'string'
  },

  serializeData: (data) => ({
    language: data.language,
    source: data.source,
    output: data.output,
    error: data.error,
    lastRunAt: data.lastRunAt
  }),

  deserializeData: (raw) => raw as CodeData,

  actions: [
    {
      id: 'run',
      label: 'Run',
      icon: '▶',
      handler(node, engine) {
        const data = node.data as CodeData
        try {
          // eslint-disable-next-line no-eval
          const result = eval(data.source)
          engine.updateNode(node.id, {
            data: { ...data, output: String(result), error: undefined, lastRunAt: Date.now() }
          })
        } catch (err) {
          engine.updateNode(node.id, {
            data: { ...data, error: String(err), lastRunAt: Date.now() }
          })
        }
      }
    },
    {
      id: 'clear',
      label: 'Clear output',
      icon: '✕',
      handler(node, engine) {
        const data = node.data as CodeData
        engine.updateNode(node.id, {
          data: { ...data, output: undefined, error: undefined }
        })
      }
    }
  ]
}
```

---

## Distributing Your Plugin as an npm Package

Structure your package so consumers can import the definition and (optionally) the component:

```
my-traek-plugin/
  src/
    index.ts              # exports definition + component
    MyNode.svelte         # (or .tsx / .vue)
  package.json
```

```ts
// index.ts
export { myNodeDefinition } from './myNodeDefinition'
export { default as MyNode } from './MyNode.svelte'
```

Consumers:

```ts
import { myNodeDefinition } from 'my-traek-plugin'

const registry = createDefaultRegistry()
registry.register(myNodeDefinition)
```

Make `@traek/svelte` (or react/vue) a **peer dependency**, not a direct dependency, to avoid bundling multiple copies.
