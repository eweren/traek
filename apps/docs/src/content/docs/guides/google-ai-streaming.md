---
title: Google Gemini Streaming Chat UI — React, Svelte & Vue | Træk
description: >-
  Build a real-time streaming Gemini chat interface with Træk. Renders token
  streams from Google AI in a branching, spatial canvas. Full code examples for
  React 18+, Svelte 5, and Vue 3.
head:
  - tag: link
    attrs:
      rel: canonical
      href: https://gettraek.com/guides/google-ai-streaming/
---

# Google Gemini Streaming

Træk works seamlessly with Google's Gemini models via the `@google/generative-ai` SDK. The spatial canvas is ideal for exploring Gemini's long-context capabilities — branch off mid-conversation to compare different lines of reasoning.

## Prerequisites

```bash
npm install @google/generative-ai
```

Set your API key from [Google AI Studio](https://aistudio.google.com/):

```bash
export GOOGLE_AI_API_KEY=AIza...
```

## Server Route (SvelteKit)

```ts
// src/routes/api/chat/+server.ts
import { GoogleGenerativeAI } from '@google/generative-ai'
import type { RequestHandler } from './$types'
import { GOOGLE_AI_API_KEY } from '$env/static/private'

const genAI = new GoogleGenerativeAI(GOOGLE_AI_API_KEY)

export const POST: RequestHandler = async ({ request }) => {
  const { messages } = await request.json()

  // Convert Træk message format to Gemini format
  const history = messages.slice(0, -1).map((m: { role: string; content: string }) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }))

  const lastMessage = messages[messages.length - 1]
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
  const chat = model.startChat({ history })
  const result = await chat.sendMessageStream(lastMessage.content)

  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of result.stream) {
        const text = chunk.text()
        if (text) {
          controller.enqueue(new TextEncoder().encode(text))
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

## Using Gemini 2.0 with Multimodal Input

Gemini's multimodal capabilities work naturally with Træk's node system. You can attach images to nodes:

```ts
// Server: handle image + text input
const { messages, imageData } = await request.json()

const imagePart = imageData
  ? { inlineData: { data: imageData, mimeType: 'image/jpeg' } }
  : null

const parts = imagePart
  ? [{ text: lastMessage.content }, imagePart]
  : [{ text: lastMessage.content }]

const result = await chat.sendMessageStream(parts)
```

## Grounding with Google Search

```ts
const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash',
  tools: [{ googleSearch: {} }]
})
```

## Client-side API (for demos & prototypes)

For quick prototypes, you can call Gemini directly from the browser — but do not expose your API key in production:

```svelte
<script>
  import { GoogleGenerativeAI } from '@google/generative-ai'
  import { TraekCanvas, TraekEngine } from '@traek/svelte'

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_AI_KEY)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
  const engine = new TraekEngine()

  async function handleSend({ content }) {
    const userNode = engine.addNode({ role: 'user', content })
    const assistantNode = engine.addNode({
      role: 'assistant',
      content: '',
      status: 'streaming',
      parentId: userNode.id
    })

    const result = await model.generateContentStream(content)

    for await (const chunk of result.stream) {
      engine.appendContent(assistantNode.id, chunk.text())
    }

    engine.updateNode(assistantNode.id, { status: 'done' })
  }
</script>

<TraekCanvas {engine} onSendMessage={handleSend} />
```

## Next Steps

- [OpenAI Streaming](/guides/openai-streaming)
- [Anthropic Claude Streaming](/guides/anthropic-streaming)
- [Custom node types](/guides/custom-nodes)
