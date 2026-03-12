---
title: Replace Linear Chat UI with Træk — Migration Guide
description: >-
  Step-by-step guide to replace any linear chatbot UI with Træk's spatial,
  branching conversation canvas. Works with React, Svelte, and Vue. No backend
  changes required.
head:
  - tag: link
    attrs:
      rel: canonical
      href: https://gettraek.com/guides/migration-from-linear-chat/
---

# Migrating from Linear Chat

This guide shows how to replace a traditional linear chat UI with Træk. The mental model shift is small — instead of appending messages to an array, you add nodes to a tree. Everything else stays familiar: your AI backend, your streaming logic, your auth, your layout.

## The Core Difference

**Linear chat** stores messages as a flat array and renders them top-to-bottom:

```ts
// Before: flat array
const messages: { role: string; content: string }[] = []
messages.push({ role: 'user', content: 'Hello' })
messages.push({ role: 'assistant', content: 'Hi!' })
```

**Træk** stores messages as a tree of nodes with spatial coordinates. Nodes can branch:

```ts
// After: tree nodes
import { TraekEngine } from '@traek/core'

const engine = new TraekEngine()
engine.addNode({ role: 'assistant', content: 'Hi!' })
```

The rest of your stack — fetch calls, streaming, auth, API routes — stays the same.

---

## Step-by-Step Migration

### 1. Install Træk

Choose the adapter for your framework:

```bash
# Svelte 5
pnpm add @traek/svelte

# React
pnpm add @traek/react

# Vue 3
pnpm add @traek/vue

# Headless (no UI)
pnpm add @traek/core
```

### 2. Replace your message array with a TraekEngine

**Before:**

```ts
let messages: ChatMessage[] = []

function sendMessage(content: string) {
  messages = [...messages, { role: 'user', content }]
  // call AI ...
  messages = [...messages, { role: 'assistant', content: aiReply }]
}
```

**After:**

```ts
import { TraekEngine } from '@traek/svelte' // or @traek/react / @traek/vue

const engine = new TraekEngine()

function sendMessage(content: string) {
  const userNode = engine.addNode({ role: 'user', content })
  // call AI ...
  engine.addNode({ role: 'assistant', content: aiReply, parentIds: [userNode.id] })
}
```

`addNode()` returns the created node. Pass its `id` in `parentIds` to keep the tree connected correctly.

### 3. Replace your `<ul>` / chat list with `<TraekCanvas>`

**Before (Svelte):**

```svelte
<ul>
  {#each messages as msg}
    <li class={msg.role}>{msg.content}</li>
  {/each}
</ul>
<input bind:value={input} on:keydown={handleKey} />
```

**After (Svelte):**

```svelte
<script>
  import { TraekCanvas, TraekEngine } from '@traek/svelte'

  const engine = new TraekEngine()
</script>

<TraekCanvas {engine} onSendMessage={handleSend} />
```

Træk renders the canvas, connections, input, and all interactions. You only provide the send handler.

**Before (React):**

```tsx
return (
  <ul>
    {messages.map(m => <li key={m.id} className={m.role}>{m.content}</li>)}
  </ul>
)
```

**After (React):**

```tsx
import { TraekCanvas, useCreateTraekEngine } from '@traek/react'

export default function Chat() {
  const engine = useCreateTraekEngine()
  return <TraekCanvas engine={engine} onSendMessage={handleSend} />
}
```

### 4. Update your streaming handler

The streaming pattern is the same — instead of mutating a string in state, you call `appendToNode`:

**Before:**

```ts
let reply = ''
for await (const chunk of stream) {
  reply += chunk
  // trigger re-render somehow
}
```

**After:**

```ts
const node = engine.addNode({ role: 'assistant', content: '', status: 'streaming' })

for await (const chunk of stream) {
  engine.appendToNode(node.id, chunk)
}

engine.updateNode(node.id, { status: 'done' })
```

### 5. Map your AI context

Most chat apps send the whole message history to the AI. With Træk, you send the **active path** through the tree — not all nodes.

```ts
// Before: all messages
const payload = messages.map(m => ({ role: m.role, content: m.content }))

// After: only the path from root to active node
const path = engine.contextPath // Node[]
const payload = path.map(n => ({ role: n.role, content: n.content }))
```

`engine.contextPath` returns the linear sequence of nodes from the root to the currently focused node — exactly what you want to send to the AI.

---

## Common Patterns

### Restore previous conversation

**Before:**

```ts
messages = savedMessages
```

**After:**

```ts
import { conversationSnapshotSchema } from '@traek/core'

const snapshot = conversationSnapshotSchema.parse(savedData)
engine.restore(snapshot)
```

### Export as Markdown

```ts
import { snapshotToMarkdown, downloadFile } from '@traek/svelte'

downloadFile('chat.md', snapshotToMarkdown(engine.snapshot()))
```

### Show a loading indicator while streaming

Nodes have a `status` field. The canvas shows a built-in loading indicator during `streaming`. You can also pass a custom loading component:

```svelte
import { DefaultLoadingOverlay } from '@traek/svelte'

<TraekCanvas {engine} {onSendMessage} loadingComponent={DefaultLoadingOverlay} />
```

---

## What You Don't Need to Change

| Concern | Linear Chat | Træk |
|---------|-------------|------|
| AI backend / API routes | Your code | Same code |
| Auth / sessions | Your code | Same code |
| Streaming (fetch / SSE) | Your code | Same code |
| Markdown rendering | Custom | Built-in (overridable) |
| Message list state | Array | TraekEngine |
| UI component | Custom | TraekCanvas |

You only replace the **state container** (array → engine) and the **render surface** (list → canvas). Everything above and below stays untouched.

---

## Full Example: SvelteKit

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import { TraekCanvas, TraekEngine, type MessageNode } from '@traek/svelte'

  const engine = new TraekEngine()

  async function handleSend(content: string, userNode: MessageNode) {
    const assistant = engine.addNode({
      role: 'assistant',
      content: '',
      parentIds: [userNode.id],
      status: 'streaming'
    })

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: engine.contextPath.map(n => ({ role: n.role, content: n.content }))
      })
    })

    const reader = res.body!.getReader()
    const dec = new TextDecoder()
    let done = false
    while (!done) {
      const { value, done: d } = await reader.read()
      done = d
      if (value) engine.appendToNode(assistant.id, dec.decode(value))
    }
    engine.updateNode(assistant.id, { status: 'done' })
  }
</script>

<TraekCanvas {engine} onSendMessage={handleSend} />
```

See the [SvelteKit guide](/guides/sveltekit) for the full API route.

---

## Troubleshooting

**Nodes appear disconnected / floating**

Make sure you pass the correct `parentIds` when adding assistant nodes. The active user node's `id` should be in `parentIds`:

```ts
const userNode = engine.addNode({ role: 'user', content })
const assistantNode = engine.addNode({ role: 'assistant', content: '', parentIds: [userNode.id] })
```

**Context sent to AI is wrong**

Use `engine.contextPath` instead of `engine.nodes`. `contextPath` returns only the nodes on the path from root to the active node — equivalent to a single conversation thread.

**Canvas height fills the whole page**

Wrap `<TraekCanvas>` in a container with an explicit height:

```css
.chat-container {
  height: calc(100vh - 60px); /* subtract header */
}
```

```svelte
<div class="chat-container">
  <TraekCanvas {engine} {onSendMessage} />
</div>
```
