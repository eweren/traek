---
title: OpenAI Streaming Chat UI — React, Svelte & Vue | Træk
description: >-
  Build a real-time streaming OpenAI chat interface with Træk. Renders token
  streams in a branching, spatial canvas. Full code examples for React 18+,
  Svelte 5, and Vue 3.
head:
  - tag: link
    attrs:
      rel: canonical
      href: https://gettraek.com/guides/openai-streaming/
---

# OpenAI Streaming

## Server Route

```ts
// src/routes/api/chat/+server.ts
import OpenAI from 'openai'
import type { RequestHandler } from './$types'

const openai = new OpenAI()

export const POST: RequestHandler = async ({ request }) => {
  const { messages } = await request.json()

  const stream = openai.beta.chat.completions.stream({
    model: 'gpt-4o',
    messages
  })

  return new Response(stream.toReadableStream())
}
```

## Client Streaming

```svelte
<script>
  import { TraekCanvas, TraekEngine } from 'traek'

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
