---
title: Groq Streaming Chat UI — React, Svelte & Vue | Træk
description: >-
  Build an ultra-fast streaming chat interface with Træk and Groq. Groq's
  inference hardware delivers tokens at 500+ tokens/sec — stunning on Træk's
  spatial canvas. Full code examples for React 18+, Svelte 5, and Vue 3.
head:
  - tag: link
    attrs:
      rel: canonical
      href: https://gettraek.com/guides/groq-integration/
---

# Groq Integration

Groq's LPU hardware delivers some of the fastest inference speeds available — regularly exceeding 500 tokens per second. Combined with Træk's streaming canvas, this creates a remarkably fluid branching chat experience.

## Prerequisites

```bash
npm install groq-sdk
```

Get your API key from [console.groq.com](https://console.groq.com/):

```bash
export GROQ_API_KEY=gsk_...
```

## Server Route (SvelteKit)

```ts
// src/routes/api/chat/+server.ts
import Groq from 'groq-sdk'
import type { RequestHandler } from './$types'
import { GROQ_API_KEY } from '$env/static/private'

const groq = new Groq({ apiKey: GROQ_API_KEY })

export const POST: RequestHandler = async ({ request }) => {
  const { messages, model = 'llama-3.3-70b-versatile' } = await request.json()

  const stream = await groq.chat.completions.create({
    model,
    messages,
    stream: true
  })

  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content
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

## Available Models on Groq

| Model | Context | Best For |
|-------|---------|----------|
| `llama-3.3-70b-versatile` | 128k | General use, coding |
| `llama-3.1-8b-instant` | 128k | Fast, low-latency responses |
| `mixtral-8x7b-32768` | 32k | Long documents |
| `gemma2-9b-it` | 8k | Instruction following |
| `whisper-large-v3` | — | Audio transcription |

```ts
// Switch models per branch
const response = await fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({
    messages: engine.getMessages(),
    model: 'llama-3.1-8b-instant'  // ultra-fast branch
  })
})
```

## Parallel Branching at Groq Speed

Groq's speed makes parallel branch generation practical in real time:

```svelte
<script>
  import { TraekCanvas, TraekEngine } from '@traek/svelte'

  const engine = new TraekEngine()

  const MODELS = [
    'llama-3.3-70b-versatile',
    'llama-3.1-8b-instant',
    'mixtral-8x7b-32768'
  ]

  async function handleSend({ content }) {
    const userNode = engine.addNode({ role: 'user', content })

    // Spawn a branch for each model simultaneously
    await Promise.all(
      MODELS.map(async (model) => {
        const node = engine.addNode({
          role: 'assistant',
          content: '',
          status: 'streaming',
          parentId: userNode.id,
          metadata: { model }
        })

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: engine.getMessages(), model })
        })

        const reader = response.body.getReader()
        const decoder = new TextDecoder()

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          engine.appendContent(node.id, decoder.decode(value))
        }

        engine.updateNode(node.id, { status: 'done' })
      })
    )
  }
</script>

<TraekCanvas {engine} onSendMessage={handleSend} />
```

## Audio Transcription Node

Use Groq's Whisper endpoint to add voice-to-text nodes:

```ts
// src/routes/api/transcribe/+server.ts
import Groq from 'groq-sdk'
import type { RequestHandler } from './$types'

const groq = new Groq()

export const POST: RequestHandler = async ({ request }) => {
  const formData = await request.formData()
  const audio = formData.get('audio') as File

  const transcription = await groq.audio.transcriptions.create({
    file: audio,
    model: 'whisper-large-v3'
  })

  return Response.json({ text: transcription.text })
}
```

## Next Steps

- [OpenAI Streaming](/guides/openai-streaming)
- [Mistral Integration](/guides/mistral-integration)
- [Custom node types](/guides/custom-nodes)
