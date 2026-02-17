---
title: TraekEngine (@traek/core)
description: API reference for the framework-agnostic TraekEngine class.
---

# TraekEngine

`TraekEngine` is the framework-agnostic core engine exported by `@traek/core`. All framework adapters (`@traek/svelte`, `@traek/react`, `@traek/vue`) wrap and re-export this class.

## Constructor

```ts
import { TraekEngine } from '@traek/core' // or @traek/svelte, @traek/react, @traek/vue

const engine = new TraekEngine(config?: Partial<TraekEngineConfig>)
```

See [`TraekEngineConfig`](/api/types#traekengineconfig) for all configuration options.

## Reactive State

| Property | Type | Description |
|----------|------|-------------|
| `nodes` | `Node[]` | All nodes in the conversation tree |
| `activeNodeId` | `string \| null` | Currently active/focused node |
| `collapsedNodes` | `Set<string>` | IDs of collapsed nodes |
| `searchQuery` | `string` | Current search query string |
| `searchMatches` | `string[]` | Matching node IDs |
| `currentSearchIndex` | `number` | Current match index (0-based) |
| `pendingFocusNodeId` | `string \| null` | Set by canvas to trigger focus animation |

## Subscription

```ts
const unsub = engine.subscribe(fn: () => void): () => void
```

`fn` is called immediately and again after every mutation. Returns an unsubscribe function.

For React, use `getSnapshot()` with `useSyncExternalStore` — or just use `@traek/react`'s `useTraekEngine`.

## Node Methods

### `addNode(payload): MessageNode`

Adds a new node to the conversation tree. Auto-assigns position based on tree layout.

```ts
const node = engine.addNode({
  role: 'user',          // 'user' | 'assistant' | 'system'
  content: 'Hello',
  parentIds: [],         // defaults to last active node
  status: 'done',        // 'streaming' | 'done' | 'error'
})
```

### `updateNode(id, patch): void`

Partially updates a node.

```ts
engine.updateNode(node.id, { status: 'done', content: 'Final answer' })
```

### `appendToNode(id, chunk): void`

Appends a string chunk to a node's content. Used for streaming.

```ts
engine.appendToNode(node.id, ' world')
```

### `deleteNode(id): void`

Deletes a node and all its descendants.

### `branchFrom(nodeId, content): MessageNode`

Creates a new user node branching from `nodeId`.

### `focusOnNode(id): void`

Sets `activeNodeId` and triggers the canvas to scroll/animate to the node.

### `moveNode(id, x, y): void`

Moves a node to grid coordinates `(x, y)`.

### `collapseNode(id): void` / `expandNode(id): void`

Collapse or expand a subtree.

## Search

### `search(query): void`

Sets the search query and populates `searchMatches`.

### `nextSearchMatch(): void` / `prevSearchMatch(): void`

Navigate through matches.

### `clearSearch(): void`

Resets search state.

## Computed Getters

### `contextPath: Node[]`

Returns the ordered list of nodes from the root to `activeNodeId` — the current conversation thread.

### `nodeMap: Map<string, Node>`

O(1) node lookup by ID.

## Snapshot / Import

### `exportSnapshot(): ConversationSnapshot`

Serialises the current conversation to a plain JSON-compatible object.

### `importSnapshot(snapshot: ConversationSnapshot): void`

Restores a previously exported snapshot.

## Lifecycle Hooks

| Hook | Signature | Description |
|------|-----------|-------------|
| `onNodeCreated` | `(node: Node) => void` | Fired after a node is added |
| `onNodeDeleting` | `(node: Node) => void` | Fired before a node is deleted |
| `onNodeDeleted` | `(count: number, restore: () => void) => void` | Fired after deletion, provides undo |
