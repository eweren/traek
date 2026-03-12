---
title: Mistral AI Streaming Chat UI — React, Svelte & Vue | Træk
description: >-
  Build a real-time streaming Mistral AI chat interface with Træk. Renders
  token streams from Mistral in a branching, spatial canvas. Full code examples
  for React 18+, Svelte 5, and Vue 3.
head:
  - tag: link
    attrs:
      rel: canonical
      href: https://gettraek.com/guides/mistral-integration/
---

# Mistral AI Streaming

Mistral's open-weight models are a popular choice for self-hosted and privacy-first deployments. Træk's branching canvas makes it easy to compare outputs across Mistral model variants side by side.

## Prerequisites

```bash
npm install @mistralai/mistralai
```

Get your API key from [console.mistral.ai](https://console.mistral.ai/):

```bash
export MISTRAL_API_KEY=...
```

## Server Route (SvelteKit)

```ts
// src/routes/api/chat/+server.ts
import { Mistral } from '@mistralai/mistralai'
import type { RequestHandler } from './$types'
import { MISTRAL_API_KEY } from '$env/static/private'

const client = new Mistral({ apiKey: MISTRAL_API_KEY })

export const POST: RequestHandler = async ({ request }) => {
  const { messages } = await request.json()

  const stream = await client.chat.stream({
    model: 'mistral-large-latest',
    messages
  })

  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const content = chunk.data.choices[0]?.delta?.content
        if (content) {
          controller.enqueue(new TextEncoder().encode(content))
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

## Self-Hosted with Ollama + Mistral

Run Mistral locally with [Ollama](https://ollama.ai/) and point Træk at it:

```bash
ollama pull mistral
ollama serve
```

```ts
// Use Mistral's OpenAI-compatible endpoint
import OpenAI from 'openai'

const client = new OpenAI({
  baseURL: 'http://localhost:11434/v1',
  apiKey: 'ollama'
})

const stream = await client.chat.completions.create({
  model: 'mistral',
  messages,
  stream: true
})
```

## Comparing Model Variants

Træk's branching makes it easy to A/B test Mistral's model tiers:

```svelte
<script>
  import { TraekCanvas, TraekEngine } from '@traek/svelte'

  const engine = new TraekEngine()

  async function handleSend({ content }) {
    const userNode = engine.addNode({ role: 'user', content })

    // Branch 1: mistral-small
    const smallBranch = engine.addNode({
      role: 'assistant', content: '', status: 'streaming',
      parentId: userNode.id, metadata: { model: 'mistral-small-latest' }
    })

    // Branch 2: mistral-large
    const largeBranch = engine.addNode({
      role: 'assistant', content: '', status: 'streaming',
      parentId: userNode.id, metadata: { model: 'mistral-large-latest' }
    })

    // Fetch both in parallel
    await Promise.all([
      streamResponse('/api/chat?model=small', engine, smallBranch.id),
      streamResponse('/api/chat?model=large', engine, largeBranch.id)
    ])
  }
</script>
```

## Function Calling

```ts
const stream = await client.chat.stream({
  model: 'mistral-large-latest',
  messages,
  tools: [
    {
      type: 'function',
      function: {
        name: 'search_web',
        description: 'Search the web for current information',
        parameters: {
          type: 'object',
          properties: { query: { type: 'string' } },
          required: ['query']
        }
      }
    }
  ],
  tool_choice: 'auto'
})
```

## Next Steps

- [OpenAI Streaming](/guides/openai-streaming)
- [Groq Integration](/guides/groq-integration)
- [Custom node types](/guides/custom-nodes)
