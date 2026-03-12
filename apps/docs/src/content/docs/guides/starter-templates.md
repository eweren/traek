---
title: Starter Templates — Træk Project Skeletons
description: >-
  Download ready-to-run Træk starter templates for SvelteKit, Next.js, and
  Nuxt 3. Each template includes a working streaming API route and a spatial
  conversation canvas out of the box.
head:
  - tag: link
    attrs:
      rel: canonical
      href: https://gettraek.com/guides/starter-templates/
---

# Starter Templates

Ready-to-run project skeletons for each supported framework. Clone, install, add your API key, and have a working branching AI chat app in under a minute.

---

## SvelteKit + @traek/svelte

**Stack:** SvelteKit · Svelte 5 · @traek/svelte · OpenAI streaming

```bash
npx degit traek-dev/templates/sveltekit my-traek-app
cd my-traek-app
pnpm install
cp .env.example .env        # add OPENAI_API_KEY
pnpm dev
```

### What's included

```
my-traek-app/
├── src/
│   ├── routes/
│   │   ├── +page.svelte          # TraekCanvas with handleSend
│   │   └── api/
│   │       └── chat/
│   │           └── +server.ts    # OpenAI streaming endpoint
│   └── app.css                   # Træk CSS variables
├── .env.example
└── package.json
```

### `+page.svelte`

```svelte
<script lang="ts">
  import { TraekCanvas, TraekEngine, type MessageNode } from '@traek/svelte'

  const engine = new TraekEngine()
  engine.addNode('Hello! How can I help?', 'assistant')

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
</script>

<div style="height: 100vh">
  <TraekCanvas {engine} onSendMessage={handleSend} />
</div>
```

### `api/chat/+server.ts`

```ts
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

---

## Next.js + @traek/react

**Stack:** Next.js 14 · App Router · @traek/react · OpenAI streaming

```bash
npx degit traek-dev/templates/nextjs my-traek-app
cd my-traek-app
npm install
cp .env.local.example .env.local   # add OPENAI_API_KEY
npm run dev
```

### What's included

```
my-traek-app/
├── app/
│   ├── page.tsx                  # TraekCanvas client component
│   └── api/
│       └── chat/
│           └── route.ts          # Streaming route handler
├── .env.local.example
└── package.json
```

### `app/page.tsx`

```tsx
'use client'

import { TraekCanvas, useCreateTraekEngine } from '@traek/react'
import type { Node } from '@traek/core'
import { useEffect } from 'react'

export default function Page() {
  const engine = useCreateTraekEngine()

  useEffect(() => {
    engine.addNode('Hello! How can I help?', 'assistant')
  }, [engine])

  async function handleSend(content: string, userNode: Node) {
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

  return (
    <div style={{ height: '100vh' }}>
      <TraekCanvas engine={engine} onSendMessage={handleSend} />
    </div>
  )
}
```

### `app/api/chat/route.ts`

```ts
import OpenAI from 'openai'

const openai = new OpenAI()

export async function POST(req: Request) {
  const { messages } = await req.json()

  const stream = openai.beta.chat.completions.stream({
    model: 'gpt-4o',
    messages
  })

  return new Response(stream.toReadableStream())
}
```

---

## Nuxt 3 + @traek/vue

**Stack:** Nuxt 3 · @traek/vue · OpenAI streaming

```bash
npx degit traek-dev/templates/nuxt my-traek-app
cd my-traek-app
pnpm install
cp .env.example .env           # add OPENAI_API_KEY
pnpm dev
```

### What's included

```
my-traek-app/
├── pages/
│   └── index.vue              # TraekCanvas component
├── server/
│   └── api/
│       └── chat.post.ts       # Nitro streaming handler
├── .env.example
└── package.json
```

### `pages/index.vue`

```vue
<script setup lang="ts">
import { TraekCanvas, useCreateTraekEngine } from '@traek/vue'

const engine = useCreateTraekEngine()
engine.addNode('Hello! How can I help?', 'assistant')

async function handleSend(content: string, userNode: any) {
  const assistant = engine.addNode('', 'assistant', {
    parentIds: [userNode.id],
    status: 'streaming'
  })

  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: engine.contextPath.map((n: any) => ({ role: n.role, content: n.content }))
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
</script>

<template>
  <div style="height: 100vh">
    <TraekCanvas :engine="engine" :on-send-message="handleSend" />
  </div>
</template>
```

### `server/api/chat.post.ts`

```ts
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export default defineEventHandler(async event => {
  const { messages } = await readBody(event)

  const stream = openai.beta.chat.completions.stream({
    model: 'gpt-4o',
    messages
  })

  return sendStream(event, stream.toReadableStream())
})
```

---

## Vanilla TypeScript (no framework)

**Stack:** Vite · TypeScript · @traek/core (headless)

Use `@traek/core` when you want to manage conversation state without a UI framework — for example, in a CLI tool, an Electron app, or a custom renderer.

```bash
npx degit traek-dev/templates/vanilla my-traek-app
cd my-traek-app
npm install
npm run dev
```

### `main.ts`

```ts
import { TraekEngine } from '@traek/core'

const engine = new TraekEngine()

// Subscribe to all state changes
engine.subscribe(() => {
  render(engine.nodes)
})

// Add initial node
engine.addNode('Hello! How can I help?', 'assistant')

async function sendMessage(content: string) {
  const userNode = engine.addNode(content, 'user')

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

function render(nodes: ReturnType<typeof engine.nodes.values>) {
  // your custom render logic
}
```

---

## Environment Variables

All templates use the same environment variable:

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | Your OpenAI API key |

For Anthropic Claude, replace the server route with the Anthropic SDK:

```ts
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic()

// Stream from Claude
const stream = await anthropic.messages.stream({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 1024,
  messages
})

return new Response(
  new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
          controller.enqueue(new TextEncoder().encode(chunk.delta.text))
        }
      }
      controller.close()
    }
  })
)
```

---

## Next Steps

| Guide | Description |
|-------|-------------|
| [Cookbook](/guides/cookbook) | 13+ copy-paste recipes for common patterns |
| [OpenAI Streaming](/guides/openai-streaming) | Detailed streaming setup guide |
| [Advanced Theming](/guides/advanced-theming) | Customise colors, fonts, and layout |
| [Custom Node Types](/guides/custom-nodes) | Build your own node components |
| [Migration from Linear Chat](/guides/migration-from-linear-chat) | Migrate an existing chatbot to Træk |
