---
title: Cookbook — Code Recipes for Træk
description: >-
  10+ copy-paste recipes for common Træk patterns: streaming, branching,
  persistence, custom nodes, multi-model, export, and more. Svelte, React, and
  Vue examples.
head:
  - tag: link
    attrs:
      rel: canonical
      href: https://gettraek.com/guides/cookbook/
---

# Cookbook

Copy-paste recipes for the most common Træk patterns. Each recipe is self-contained and works with any supported framework unless noted.

---

## 1. Basic Streaming (fetch + ReadableStream)

Stream tokens from any HTTP endpoint into a Træk node.

```ts
async function handleSend(content: string, userNode: MessageNode) {
  const assistant = engine.addNode('', 'assistant', {
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
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    engine.appendToNode(assistant.id, decoder.decode(value, { stream: true }))
  }

  engine.updateNode(assistant.id, { status: 'done' })
}
```

---

## 2. Error Handling During Streaming

Show an error state if the request fails or the stream breaks.

```ts
async function handleSend(content: string, userNode: MessageNode) {
  const assistant = engine.addNode('', 'assistant', {
    parentIds: [userNode.id],
    status: 'streaming'
  })

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: engine.contextPath.map(n => ({ role: n.role, content: n.content })) })
    })

    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const reader = res.body!.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      engine.appendToNode(assistant.id, decoder.decode(value, { stream: true }))
    }

    engine.updateNode(assistant.id, { status: 'done' })
  } catch (err) {
    engine.updateNode(assistant.id, {
      content: `Error: ${err instanceof Error ? err.message : 'Unknown error'}`,
      status: 'error'
    })
  }
}
```

---

## 3. Branch and Compare Two Models

Ask the same question to two different models and display both responses as sibling branches.

```ts
async function compareModels(content: string, userNode: MessageNode) {
  const messages = engine.contextPath.map(n => ({ role: n.role, content: n.content }))

  // Create both assistant nodes immediately
  const gpt4Node = engine.addNode('', 'assistant', {
    parentIds: [userNode.id],
    status: 'streaming',
    metadata: { label: 'GPT-4o' }
  })
  const claudeNode = engine.addNode('', 'assistant', {
    parentIds: [userNode.id],
    status: 'streaming',
    metadata: { label: 'Claude 3.5' }
  })

  // Stream both in parallel
  await Promise.all([
    streamToNode('/api/chat/gpt4', messages, gpt4Node.id),
    streamToNode('/api/chat/claude', messages, claudeNode.id)
  ])
}

async function streamToNode(url: string, messages: unknown[], nodeId: string) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages })
  })
  const reader = res.body!.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    engine.appendToNode(nodeId, decoder.decode(value, { stream: true }))
  }

  engine.updateNode(nodeId, { status: 'done' })
}
```

---

## 4. Save and Restore a Conversation

Persist the full tree to `localStorage` and restore it on page load.

```ts
import { conversationSnapshotSchema } from '@traek/core'

// Save
function saveConversation() {
  const snapshot = engine.snapshot()
  localStorage.setItem('traek-conversation', JSON.stringify(snapshot))
}

// Restore
function loadConversation() {
  const raw = localStorage.getItem('traek-conversation')
  if (!raw) return

  const parsed = JSON.parse(raw)
  const snapshot = conversationSnapshotSchema.safeParse(parsed)

  if (snapshot.success) {
    engine.restore(snapshot.data)
  } else {
    console.warn('Invalid snapshot:', snapshot.error)
  }
}

// Auto-save on every engine change (Svelte 5)
$effect(() => {
  // track nodes so this re-runs on changes
  engine.nodes
  saveConversation()
})
```

---

## 5. Export Conversation as Markdown

Generate a readable Markdown file from the active branch or the whole tree.

```ts
import { snapshotToMarkdown, downloadFile } from '@traek/svelte'

// Export only the active branch (root → focused node)
function exportBranch() {
  const path = engine.contextPath
  const md = path.map(n => `**${n.role}:** ${n.content}`).join('\n\n---\n\n')
  downloadFile('conversation.md', md)
}

// Export the full tree
function exportFull() {
  const snapshot = engine.snapshot()
  downloadFile('conversation.md', snapshotToMarkdown(snapshot))
}
```

---

## 6. Custom Node Renderer

Render assistant messages with a custom component — for example, adding a copy button and a model badge.

**Svelte:**

```svelte
<!-- AssistantNode.svelte -->
<script lang="ts">
  import type { MessageNode } from '@traek/svelte'

  let { node }: { node: MessageNode } = $props()

  async function copy() {
    await navigator.clipboard.writeText(node.content ?? '')
  }
</script>

<div class="assistant-node">
  <div class="content">{@html node.content}</div>
  <footer>
    <span class="badge">{node.metadata?.model ?? 'gpt-4o'}</span>
    <button onclick={copy}>Copy</button>
  </footer>
</div>
```

```svelte
<!-- App.svelte -->
<script>
  import { TraekCanvas, TraekEngine } from '@traek/svelte'
  import AssistantNode from './AssistantNode.svelte'

  const engine = new TraekEngine()
</script>

<TraekCanvas
  {engine}
  {onSendMessage}
  componentMap={{ assistant: AssistantNode }}
/>
```

**React:**

```tsx
import { TraekCanvas, useCreateTraekEngine } from '@traek/react'
import type { Node } from '@traek/core'

function AssistantNode({ node }: { node: Node }) {
  return (
    <div className="assistant-node">
      <p>{node.content}</p>
      <button onClick={() => navigator.clipboard.writeText(node.content ?? '')}>
        Copy
      </button>
    </div>
  )
}

export default function App() {
  const engine = useCreateTraekEngine()
  return (
    <TraekCanvas
      engine={engine}
      onSendMessage={handleSend}
      componentMap={{ assistant: AssistantNode }}
    />
  )
}
```

---

## 7. System Prompt Node

Prepend a system message to every conversation. This pattern seeds the engine with a hidden system node as the root.

```ts
const engine = new TraekEngine()

// Add a system node as the conversation root
const systemNode = engine.addNode(
  'You are a helpful coding assistant. Always format code in fenced code blocks.',
  'system'
)

// All user messages will be children of this root
// engine.contextPath will always start with the system node
```

For dynamic system prompts (e.g. per-user instructions):

```ts
function initConversation(systemPrompt: string) {
  engine.clear()
  engine.addNode(systemPrompt, 'system')
}
```

---

## 8. Focus and Zoom to a Node

Programmatically pan/zoom the canvas to bring a specific node into view.

```ts
// Focus the most recently added node
const latest = engine.nodes.at(-1)
if (latest) engine.focusOnNode(latest.id)

// Focus after streaming completes
const assistant = engine.addNode('', 'assistant', { status: 'streaming' })
// ... stream ...
engine.updateNode(assistant.id, { status: 'done' })
engine.focusOnNode(assistant.id)
```

Use `focusOnNode` to guide users through a structured workflow or to "jump to" search results.

---

## 9. Search Nodes and Jump to Match

Filter nodes by content and highlight/focus the matching one.

```ts
function searchAndFocus(query: string) {
  const q = query.toLowerCase()
  const match = engine.nodes.find(n =>
    n.content?.toLowerCase().includes(q)
  )

  if (match) {
    engine.focusOnNode(match.id)
  }
}
```

For a search input that highlights as you type, use a reactive binding:

```svelte
<script>
  let query = $state('')

  $effect(() => {
    if (!query) return
    const match = engine.nodes.find(n =>
      n.content?.toLowerCase().includes(query.toLowerCase())
    )
    if (match) engine.focusOnNode(match.id)
  })
</script>

<input bind:value={query} placeholder="Search conversation…" />
```

---

## 10. Abort / Cancel a Streaming Response

Stop streaming mid-response by using `AbortController`.

```ts
let abortController: AbortController | null = null

async function handleSend(content: string, userNode: MessageNode) {
  abortController = new AbortController()

  const assistant = engine.addNode('', 'assistant', {
    parentIds: [userNode.id],
    status: 'streaming'
  })

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: engine.contextPath.map(n => ({ role: n.role, content: n.content })) }),
      signal: abortController.signal
    })

    const reader = res.body!.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      engine.appendToNode(assistant.id, decoder.decode(value, { stream: true }))
    }

    engine.updateNode(assistant.id, { status: 'done' })
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      engine.updateNode(assistant.id, { status: 'done' }) // keep partial content
    } else {
      engine.updateNode(assistant.id, { status: 'error' })
    }
  }
}

function stopStreaming() {
  abortController?.abort()
}
```

---

## 11. Retry a Failed Node

Re-send the parent user message to regenerate a failed assistant response.

```ts
async function retry(failedNodeId: string) {
  const failedNode = engine.getNode(failedNodeId)
  if (!failedNode) return

  // Remove the failed node
  engine.removeNode(failedNodeId)

  // Find the parent user node
  const parentId = failedNode.parentIds?.[0]
  const userNode = parentId ? engine.getNode(parentId) : undefined
  if (!userNode) return

  // Re-run handleSend from the user node
  await handleSend(userNode.content ?? '', userNode)
}
```

---

## 12. Multi-Turn Tool Use (Function Calling)

Handle OpenAI tool calls by parsing the response and appending tool results as nodes.

```ts
async function handleSend(content: string, userNode: MessageNode) {
  const messages = engine.contextPath.map(n => ({
    role: n.role,
    content: n.content,
    ...(n.metadata?.toolCallId ? { tool_call_id: n.metadata.toolCallId } : {})
  }))

  const res = await fetch('/api/chat/tools', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages })
  })

  const data = await res.json()
  const choice = data.choices[0]

  if (choice.finish_reason === 'tool_calls') {
    // Show tool call as a node
    const toolCallNode = engine.addNode(
      `Calling tool: ${choice.message.tool_calls[0].function.name}`,
      'assistant',
      { parentIds: [userNode.id], metadata: { type: 'tool_call' } }
    )

    // Execute tool and get result
    const toolResult = await executeTool(choice.message.tool_calls[0])

    // Add tool result node
    const resultNode = engine.addNode(
      JSON.stringify(toolResult, null, 2),
      'tool',
      {
        parentIds: [toolCallNode.id],
        metadata: { toolCallId: choice.message.tool_calls[0].id }
      }
    )

    // Continue the conversation with tool result
    await handleSend('', resultNode)
  } else {
    engine.addNode(choice.message.content, 'assistant', {
      parentIds: [userNode.id],
      status: 'done'
    })
  }
}
```

---

## 13. Programmatic Branching

Create branches in code without user interaction — useful for automated exploration.

```ts
async function exploreVariants(nodeId: string, prompts: string[]) {
  const parentNode = engine.getNode(nodeId)
  if (!parentNode) return

  // Create one branch per prompt, all as children of the same parent
  await Promise.all(
    prompts.map(async prompt => {
      const userNode = engine.addNode(prompt, 'user', {
        parentIds: [nodeId]
      })
      await handleSend(prompt, userNode)
    })
  )

  // Zoom out to see all branches
  engine.focusOnNode(nodeId)
}

// Usage: explore 3 angles from the current focused node
exploreVariants(engine.focusedNodeId!, [
  'Explain this like I am five',
  'Give me a technical deep-dive',
  'What are the risks?'
])
```

---

## Next Steps

| Guide | Description |
|-------|-------------|
| [Interactive Examples](/guides/examples) | Live, runnable demos in the browser |
| [Migration from Linear Chat](/guides/migration-from-linear-chat) | Replace an existing chat UI step-by-step |
| [Advanced Theming](/guides/advanced-theming) | CSS variables and theme customisation |
| [Custom Node Types](/guides/custom-nodes) | Full component map API reference |
| [OpenAI Streaming](/guides/openai-streaming) | Integrate OpenAI real-time streaming |
| [Starter Templates](/guides/starter-templates) | Download a working project skeleton |
