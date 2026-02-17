---
title: Types
description: TypeScript type reference for Træk (@traek/core).
---

# Types

All types are exported from `@traek/core` and re-exported by each framework adapter.

```ts
import type { Node, MessageNode, TraekEngineConfig, NodeStatus } from '@traek/core'
```

## `Node`

Base node type for all canvas items.

```ts
interface Node {
  id: string
  parentIds: string[]
  role: 'user' | 'assistant' | 'system'
  type: BasicNodeTypes | string
  status?: NodeStatus
  errorMessage?: string
  createdAt?: number
  metadata?: {
    x: number
    y: number
    height?: number
    [key: string]: unknown
  }
  data?: unknown
}
```

## `MessageNode`

Extends `Node` with a `content` field. Used for text/code/thought nodes.

```ts
interface MessageNode extends Node {
  content: string
}
```

## `NodeStatus`

```ts
type NodeStatus = 'streaming' | 'done' | 'error'
```

## `BasicNodeTypes`

```ts
enum BasicNodeTypes {
  TEXT    = 'text',
  CODE    = 'code',
  THOUGHT = 'thought',
}
```

## `AddNodePayload`

Payload accepted by `engine.addNode()`.

```ts
interface AddNodePayload {
  id?: string
  parentIds?: string[]
  content: string
  role: 'user' | 'assistant' | 'system'
  type?: MessageNode['type']
  status?: NodeStatus
  errorMessage?: string
  createdAt?: number
  metadata?: Partial<NonNullable<MessageNode['metadata']>>
  data?: unknown
}
```

## `TraekEngineConfig`

Full engine configuration. All fields have defaults (`DEFAULT_TRACK_ENGINE_CONFIG`).

```ts
interface TraekEngineConfig {
  focusDurationMs: number       // Animation duration for focus transitions
  zoomSpeed: number             // Trackpad/wheel zoom sensitivity
  zoomLineModeBoost: number     // Extra sensitivity for line-mode scroll events
  scaleMin: number              // Minimum zoom level
  scaleMax: number              // Maximum zoom level
  nodeWidth: number             // Canvas node width in pixels
  nodeHeightDefault: number     // Default node height before measurement
  streamIntervalMs: number      // Interval between streamed chunk renders
  rootNodeOffsetX: number       // Root node X offset in grid units
  rootNodeOffsetY: number       // Root node Y offset in grid units
  layoutGapX: number            // Horizontal gap between sibling nodes (grid units)
  layoutGapY: number            // Vertical gap between parent and child (grid units)
  heightChangeThreshold: number // Minimum height delta to trigger layout recalc
  gridStep: number              // Pixels per grid unit
}
```

## `TraekNodeComponentProps`

Props received by every custom node component.

```ts
type TraekNodeComponentProps = {
  node: Node
  engine: unknown  // typed as framework-specific engine in each adapter
  isActive: boolean
}
```

## `SendEvent`

Payload from user message submission.

```ts
interface SendEvent {
  content: string
  parentId?: string
}
```

## `ConversationSnapshot`

Serialised conversation format returned by `engine.exportSnapshot()`.

```ts
interface ConversationSnapshot {
  nodes: SerializedNode[]
  activeNodeId: string | null
  version: number
}
```
