---
title: TraekCanvas
description: API reference for the TraekCanvas component (all frameworks).
---

# TraekCanvas

The main interactive canvas component. Available in all framework adapters.

For framework-specific details see the per-framework API pages:

- [`@traek/svelte` canvas](/api/traek-canvas-svelte)
- [`@traek/react` canvas](/api/traek-canvas-react)
- [`@traek/vue` canvas](/api/traek-canvas-vue)

## Common Props

All three adapters share the same core props:

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `engine` | `TraekEngine` | Yes | Engine instance managing conversation state |
| `onSendMessage` | `(event: SendEvent) => void` | Yes | Callback fired when user submits a message |
| `components` | `ComponentMap` | No | Override default node renderers by node type |

## `SendEvent`

```ts
interface SendEvent {
  content: string     // User-typed message
  parentId?: string   // ID of the node to branch from (undefined = append to active)
}
```

## `ComponentMap`

```ts
type ComponentMap = Record<string, unknown>
// Svelte:  Record<string, Component<any>>
// React:   Record<string, React.ComponentType<any>>
// Vue:     Record<string, Component>
```

Override a node type renderer:

```ts
// Svelte example
import MyTextNode from './MyTextNode.svelte'
<TraekCanvas {engine} {onSendMessage} components={{ text: MyTextNode }} />
```

## CSS Custom Properties

Override on `:root` to customise the theme:

| Property | Default | Description |
|----------|---------|-------------|
| `--traek-bg` | `#0a0a0a` | Canvas background |
| `--traek-node-bg` | `#1a1a1a` | Node background |
| `--traek-node-border` | `#2a2a2a` | Node border |
| `--traek-accent` | `#6366f1` | Accent colour (active node, input) |
| `--traek-text` | `#e5e5e5` | Primary text colour |
| `--traek-text-muted` | `#888` | Secondary text colour |
| `--traek-node-width` | `400px` | Node width |
