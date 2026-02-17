---
title: TraekCanvas – React
description: TraekCanvas API for @traek/react.
---

# TraekCanvas (`@traek/react`)

```tsx
import { TraekCanvas } from '@traek/react'
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `engine` | `TraekEngine` | — | Engine instance (**required**) |
| `onSendMessage` | `(e: SendEvent) => void` | — | Called on message submit (**required**) |
| `components` | `ComponentMap` | `{}` | Map of node type → React component |
| `className` | `string` | `''` | Extra CSS classes on the root element |

## `ComponentMap` type (React)

```ts
type ComponentMap = Record<string, React.ComponentType<TraekNodeComponentProps>>
```

## Example

```tsx
import { TraekCanvas, useCreateTraekEngine } from '@traek/react'
import MyCustomNode from './MyCustomNode'

export default function App() {
  const engine = useCreateTraekEngine()

  return (
    <TraekCanvas
      engine={engine}
      onSendMessage={({ content }) => engine.addNode({ role: 'user', content })}
      components={{ custom: MyCustomNode }}
    />
  )
}
```
