---
title: Vanilla JS / TypeScript
description: Using @traek/core directly without a UI framework.
---

# Vanilla JS / TypeScript

`@traek/core` is a pure TypeScript package with **no framework or browser dependencies**. Use it to build custom rendering pipelines, server-side tools, or integrate Træk's conversation engine into any JavaScript environment.

## Install

```bash
pnpm add @traek/core
```

## Usage

```ts
import { TraekEngine } from '@traek/core'

const engine = new TraekEngine()

// Add an initial node
engine.addNode({ role: 'assistant', content: 'Hello! How can I help?' })

// Subscribe to state changes
const unsub = engine.subscribe(() => {
  render(engine.nodes)
})

// Add messages
function sendMessage(text: string) {
  const userNode = engine.addNode({ role: 'user', content: text })
  const assistantNode = engine.addNode({
    role: 'assistant',
    content: '',
    parentIds: [userNode.id],
    status: 'streaming'
  })
  return assistantNode.id
}

// Stream content into a node
function appendChunk(nodeId: string, chunk: string) {
  engine.appendToNode(nodeId, chunk)
}

function finishNode(nodeId: string) {
  engine.updateNode(nodeId, { status: 'done' })
}

// Tear down
unsub()
```

## Minimal DOM Renderer

The following shows a minimal custom renderer using only `@traek/core` and vanilla DOM APIs:

```ts
import { TraekEngine } from '@traek/core'

const engine = new TraekEngine()
const container = document.getElementById('chat')!

function render(nodes: typeof engine.nodes) {
  container.innerHTML = ''
  for (const node of nodes) {
    const el = document.createElement('div')
    el.className = `node node--${node.role}`
    el.textContent = 'content' in node ? (node as any).content : ''
    container.appendChild(el)
  }
}

engine.subscribe(() => render(engine.nodes))
engine.addNode({ role: 'assistant', content: 'Hello!' })
```

## Serialisation

Save and restore conversations using the built-in snapshot API:

```ts
import { TraekEngine, conversationSnapshotSchema } from '@traek/core'

const engine = new TraekEngine()

// Save
const snapshot = engine.exportSnapshot()
localStorage.setItem('convo', JSON.stringify(snapshot))

// Restore
const raw = JSON.parse(localStorage.getItem('convo') ?? '{}')
const parsed = conversationSnapshotSchema.safeParse(raw)
if (parsed.success) {
  engine.importSnapshot(parsed.data)
}
```

## Subscribe Contract

`engine.subscribe(fn)` follows the Svelte store contract:

1. `fn` is called immediately with the current state
2. `fn` is called after every subsequent mutation
3. Returns an `unsubscribe` function

This makes `@traek/core` compatible with any reactive system that accepts Svelte-style stores.
