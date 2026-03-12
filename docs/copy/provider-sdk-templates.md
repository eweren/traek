# Developer SDK Integration Templates per Provider

*Træk CMO — March 2026*

These are copy-paste starter templates for developers building with Træk + each AI provider. Each template is a minimal, production-ready starting point that developers can use immediately.

---

## Template 1: OpenAI (SvelteKit)

**Stack:** SvelteKit + @traek/svelte + openai SDK

```bash
# Install
npm create svelte@latest my-app
cd my-app
npm install @traek/svelte openai
```

```ts
// src/routes/api/chat/+server.ts
import OpenAI from 'openai'
import { OPENAI_API_KEY } from '$env/static/private'
import type { RequestHandler } from './$types'

const openai = new OpenAI({ apiKey: OPENAI_API_KEY })

export const POST: RequestHandler = async ({ request }) => {
  const { messages } = await request.json()
  const stream = openai.beta.chat.completions.stream({
    model: 'gpt-4o',
    messages
  })
  return new Response(stream.toReadableStream())
}
```

```svelte
<!-- src/routes/+page.svelte -->
<script>
  import { TraekCanvas, TraekEngine } from '@traek/svelte'
  const engine = new TraekEngine()

  async function send({ content }) {
    const user = engine.addNode({ role: 'user', content })
    const ai = engine.addNode({ role: 'assistant', content: '', status: 'streaming', parentId: user.id })

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: engine.getMessages() })
    })

    const reader = res.body.getReader()
    const dec = new TextDecoder()
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      engine.appendContent(ai.id, dec.decode(value))
    }
    engine.updateNode(ai.id, { status: 'done' })
  }
</script>

<TraekCanvas {engine} onSendMessage={send} />
```

```env
# .env
OPENAI_API_KEY=sk-...
```

---

## Template 2: Anthropic Claude (SvelteKit)

**Stack:** SvelteKit + @traek/svelte + @anthropic-ai/sdk

```bash
npm create svelte@latest my-app
cd my-app
npm install @traek/svelte @anthropic-ai/sdk
```

```ts
// src/routes/api/chat/+server.ts
import Anthropic from '@anthropic-ai/sdk'
import { ANTHROPIC_API_KEY } from '$env/static/private'
import type { RequestHandler } from './$types'

const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY })

export const POST: RequestHandler = async ({ request }) => {
  const { messages } = await request.json()

  const stream = anthropic.messages.stream({
    model: 'claude-opus-4-6',
    max_tokens: 4096,
    messages
  })

  const readable = new ReadableStream({
    async start(c) {
      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
          c.enqueue(new TextEncoder().encode(chunk.delta.text))
        }
      }
      c.close()
    }
  })

  return new Response(readable, { headers: { 'Content-Type': 'text/plain' } })
}
```

```svelte
<!-- src/routes/+page.svelte — same client code as OpenAI template -->
<script>
  import { TraekCanvas, TraekEngine } from '@traek/svelte'
  const engine = new TraekEngine()

  async function send({ content }) {
    const user = engine.addNode({ role: 'user', content })
    const ai = engine.addNode({ role: 'assistant', content: '', status: 'streaming', parentId: user.id })

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: engine.getMessages() })
    })

    const reader = res.body.getReader()
    const dec = new TextDecoder()
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      engine.appendContent(ai.id, dec.decode(value))
    }
    engine.updateNode(ai.id, { status: 'done' })
  }
</script>

<TraekCanvas {engine} onSendMessage={send} />
```

```env
# .env
ANTHROPIC_API_KEY=sk-ant-...
```

---

## Template 3: Google Gemini (SvelteKit)

**Stack:** SvelteKit + @traek/svelte + @google/generative-ai

```bash
npm create svelte@latest my-app
cd my-app
npm install @traek/svelte @google/generative-ai
```

```ts
// src/routes/api/chat/+server.ts
import { GoogleGenerativeAI } from '@google/generative-ai'
import { GOOGLE_AI_API_KEY } from '$env/static/private'
import type { RequestHandler } from './$types'

const genAI = new GoogleGenerativeAI(GOOGLE_AI_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

export const POST: RequestHandler = async ({ request }) => {
  const { messages } = await request.json()

  const history = messages.slice(0, -1).map((m: { role: string; content: string }) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }))

  const chat = model.startChat({ history })
  const result = await chat.sendMessageStream(messages.at(-1).content)

  const readable = new ReadableStream({
    async start(c) {
      for await (const chunk of result.stream) {
        const text = chunk.text()
        if (text) c.enqueue(new TextEncoder().encode(text))
      }
      c.close()
    }
  })

  return new Response(readable, { headers: { 'Content-Type': 'text/plain' } })
}
```

```svelte
<!-- src/routes/+page.svelte — same client pattern -->
<script>
  import { TraekCanvas, TraekEngine } from '@traek/svelte'
  const engine = new TraekEngine()

  async function send({ content }) {
    const user = engine.addNode({ role: 'user', content })
    const ai = engine.addNode({ role: 'assistant', content: '', status: 'streaming', parentId: user.id })

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: engine.getMessages() })
    })

    const reader = res.body.getReader()
    const dec = new TextDecoder()
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      engine.appendContent(ai.id, dec.decode(value))
    }
    engine.updateNode(ai.id, { status: 'done' })
  }
</script>

<TraekCanvas {engine} onSendMessage={send} />
```

```env
# .env
GOOGLE_AI_API_KEY=AIza...
```

---

## Template 4: Mistral AI (SvelteKit)

**Stack:** SvelteKit + @traek/svelte + @mistralai/mistralai

```bash
npm create svelte@latest my-app
cd my-app
npm install @traek/svelte @mistralai/mistralai
```

```ts
// src/routes/api/chat/+server.ts
import { Mistral } from '@mistralai/mistralai'
import { MISTRAL_API_KEY } from '$env/static/private'
import type { RequestHandler } from './$types'

const client = new Mistral({ apiKey: MISTRAL_API_KEY })

export const POST: RequestHandler = async ({ request }) => {
  const { messages } = await request.json()

  const stream = await client.chat.stream({
    model: 'mistral-large-latest',
    messages
  })

  const readable = new ReadableStream({
    async start(c) {
      for await (const chunk of stream) {
        const content = chunk.data.choices[0]?.delta?.content
        if (content) c.enqueue(new TextEncoder().encode(content))
      }
      c.close()
    }
  })

  return new Response(readable, { headers: { 'Content-Type': 'text/plain' } })
}
```

```svelte
<!-- src/routes/+page.svelte — same client pattern -->
<script>
  import { TraekCanvas, TraekEngine } from '@traek/svelte'
  const engine = new TraekEngine()

  async function send({ content }) {
    const user = engine.addNode({ role: 'user', content })
    const ai = engine.addNode({ role: 'assistant', content: '', status: 'streaming', parentId: user.id })

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: engine.getMessages() })
    })

    const reader = res.body.getReader()
    const dec = new TextDecoder()
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      engine.appendContent(ai.id, dec.decode(value))
    }
    engine.updateNode(ai.id, { status: 'done' })
  }
</script>

<TraekCanvas {engine} onSendMessage={send} />
```

```env
# .env
MISTRAL_API_KEY=...
```

---

## Template 5: Groq (SvelteKit)

**Stack:** SvelteKit + @traek/svelte + groq-sdk

```bash
npm create svelte@latest my-app
cd my-app
npm install @traek/svelte groq-sdk
```

```ts
// src/routes/api/chat/+server.ts
import Groq from 'groq-sdk'
import { GROQ_API_KEY } from '$env/static/private'
import type { RequestHandler } from './$types'

const groq = new Groq({ apiKey: GROQ_API_KEY })

export const POST: RequestHandler = async ({ request }) => {
  const { messages } = await request.json()

  const stream = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages,
    stream: true
  })

  const readable = new ReadableStream({
    async start(c) {
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content
        if (content) c.enqueue(new TextEncoder().encode(content))
      }
      c.close()
    }
  })

  return new Response(readable, { headers: { 'Content-Type': 'text/plain' } })
}
```

```svelte
<!-- src/routes/+page.svelte — same client pattern -->
<script>
  import { TraekCanvas, TraekEngine } from '@traek/svelte'
  const engine = new TraekEngine()

  async function send({ content }) {
    const user = engine.addNode({ role: 'user', content })
    const ai = engine.addNode({ role: 'assistant', content: '', status: 'streaming', parentId: user.id })

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: engine.getMessages() })
    })

    const reader = res.body.getReader()
    const dec = new TextDecoder()
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      engine.appendContent(ai.id, dec.decode(value))
    }
    engine.updateNode(ai.id, { status: 'done' })
  }
</script>

<TraekCanvas {engine} onSendMessage={send} />
```

```env
# .env
GROQ_API_KEY=gsk_...
```

---

## Template 6: React + Next.js (works with any provider)

**Stack:** Next.js App Router + @traek/react

```bash
npx create-next-app@latest my-app --typescript --app
cd my-app
npm install @traek/react openai  # swap openai for any provider SDK
```

```ts
// app/api/chat/route.ts
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

```tsx
// app/page.tsx
'use client'
import { TraekCanvas, TraekEngine } from '@traek/react'
import { useRef } from 'react'

export default function Home() {
  const engineRef = useRef(new TraekEngine())

  async function handleSend({ content }: { content: string }) {
    const engine = engineRef.current
    const user = engine.addNode({ role: 'user', content })
    const ai = engine.addNode({ role: 'assistant', content: '', status: 'streaming', parentId: user.id })

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: engine.getMessages() })
    })

    const reader = res.body!.getReader()
    const dec = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      engine.appendContent(ai.id, dec.decode(value))
    }

    engine.updateNode(ai.id, { status: 'done' })
  }

  return (
    <main style={{ width: '100vw', height: '100vh' }}>
      <TraekCanvas engine={engineRef.current} onSendMessage={handleSend} />
    </main>
  )
}
```

---

## Template 7: Provider-Agnostic with AI SDK (Vercel AI SDK)

Use Vercel's AI SDK to support multiple providers with one interface:

```bash
npm install ai @ai-sdk/openai @ai-sdk/anthropic @traek/svelte
```

```ts
// src/routes/api/chat/+server.ts
import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { anthropic } from '@ai-sdk/anthropic'
import type { RequestHandler } from './$types'

const providers = {
  openai: openai('gpt-4o'),
  anthropic: anthropic('claude-opus-4-6')
}

export const POST: RequestHandler = async ({ request }) => {
  const { messages, provider = 'openai' } = await request.json()
  const model = providers[provider as keyof typeof providers] ?? providers.openai

  const result = await streamText({ model, messages })
  return result.toTextStreamResponse()
}
```

This template powers provider-switching directly from the Træk UI — each branch can use a different provider.

---

## Usage Notes

All templates follow the same client-side pattern:
1. Add a user node with `engine.addNode({ role: 'user', content })`
2. Add an assistant node in `streaming` status
3. Stream response chunks with `engine.appendContent(id, chunk)`
4. Mark done with `engine.updateNode(id, { status: 'done' })`

The server route is the only thing that changes between providers — the Træk canvas and engine code is identical.
