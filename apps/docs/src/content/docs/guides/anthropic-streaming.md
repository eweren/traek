---
title: Anthropic Claude Streaming Chat UI — React, Svelte & Vue | Træk
description: >-
  Build a real-time streaming Claude chat interface with Træk. Renders token
  streams from Anthropic's API in a branching, spatial canvas. Full code
  examples for React 18+, Svelte 5, and Vue 3.
head:
  - tag: link
    attrs:
      rel: canonical
      href: https://gettraek.com/guides/anthropic-streaming/
---

# Anthropic Claude Streaming

Træk pairs naturally with Anthropic's Claude models. The branching canvas maps directly to Claude's multi-turn context — each branch carries its own message history, so users can explore different conversation threads without losing prior context.

## Prerequisites

```bash
npm install @anthropic-ai/sdk
```

Set your API key:

```bash
export ANTHROPIC_API_KEY=sk-ant-...
```

## Server Route (SvelteKit)

```ts
// src/routes/api/chat/+server.ts
import Anthropic from '@anthropic-ai/sdk'
import type { RequestHandler } from './$types'

const anthropic = new Anthropic()

export const POST: RequestHandler = async ({ request }) => {
  const { messages } = await request.json()

  const stream = anthropic.messages.stream({
    model: 'claude-opus-4-6',
    max_tokens: 4096,
    messages
  })

  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (
          chunk.type === 'content_block_delta' &&
          chunk.delta.type === 'text_delta'
        ) {
          controller.enqueue(new TextEncoder().encode(chunk.delta.text))
        }
      }
      controller.close()
    }
  })

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  })
}
```

## Client Streaming (Svelte 5)

```svelte
<script>
  import { TraekCanvas, TraekEngine } from '@traek/svelte'

  const engine = new TraekEngine()

  async function handleSend({ content }) {
    const userNode = engine.addNode({ role: 'user', content })
    const assistantNode = engine.addNode({
      role: 'assistant',
      content: '',
      status: 'streaming',
      parentId: userNode.id
    })

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: engine.getMessages() })
    })

    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      engine.appendContent(assistantNode.id, decoder.decode(value))
    }

    engine.updateNode(assistantNode.id, { status: 'done' })
  }
</script>

<TraekCanvas {engine} onSendMessage={handleSend} />
```

## Client Streaming (React)

```tsx
import { TraekCanvas, TraekEngine } from '@traek/react'
import { useRef } from 'react'

export default function App() {
  const engineRef = useRef(new TraekEngine())

  async function handleSend({ content }: { content: string }) {
    const engine = engineRef.current
    const userNode = engine.addNode({ role: 'user', content })
    const assistantNode = engine.addNode({
      role: 'assistant',
      content: '',
      status: 'streaming',
      parentId: userNode.id
    })

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: engine.getMessages() })
    })

    const reader = response.body!.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      engine.appendContent(assistantNode.id, decoder.decode(value))
    }

    engine.updateNode(assistantNode.id, { status: 'done' })
  }

  return <TraekCanvas engine={engineRef.current} onSendMessage={handleSend} />
}
```

## Using Claude's Thinking Mode

Claude's extended thinking produces visible reasoning tokens. Træk renders them in a collapsible thought panel:

```ts
// Server: enable thinking
const stream = anthropic.messages.stream({
  model: 'claude-opus-4-6',
  max_tokens: 16000,
  thinking: { type: 'enabled', budget_tokens: 10000 },
  messages
})

// Separate text and thinking deltas
for await (const chunk of stream) {
  if (chunk.type === 'content_block_delta') {
    if (chunk.delta.type === 'text_delta') {
      // stream to main content
    } else if (chunk.delta.type === 'thinking_delta') {
      // stream to thought panel via engine.appendThought()
    }
  }
}
```

```svelte
<!-- Client: thought panel renders automatically when node has thoughts -->
<TraekCanvas {engine} onSendMessage={handleSend} showThoughts={true} />
```

## System Prompts per Branch

Each branch in Træk can carry a different system prompt, enabling multi-persona experiments:

```ts
const engine = new TraekEngine({
  systemPrompt: 'You are a helpful assistant.'
})

// Override per branch
engine.branchFrom(nodeId, {
  systemPrompt: 'You are a Socratic tutor. Only ask questions.'
})
```

## Next Steps

- [Branching & tree structure](/guides/branching)
- [Custom node types](/guides/custom-nodes)
- [Theming](/guides/advanced-theming)
