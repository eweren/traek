# "Build X with Træk" — Developer Tutorial Series

_Date: 2026-03-08 | Series: 5 tutorials_

A hands-on tutorial series for developers building AI-powered applications. Each tutorial is self-contained and ships with a working code example. Target length: 1,500–2,500 words each.

**Distribution:** gettraek.com/tutorials, Dev.to, dev newsletter, GitHub repo README links.

---

## Tutorial 1: Build a Branching AI Chat App in 15 Minutes (React + OpenAI)

**Slug:** `build-branching-ai-chat-react-openai`
**Target keyword:** `react ai chat ui branching`
**Level:** Beginner
**Framework:** React

### Outline

**Introduction**
- What you'll build: a multi-branch AI conversation UI with OpenAI
- Why branching beats linear chat for exploratory thinking
- Prerequisites: Node 20+, an OpenAI API key, basic React knowledge

**Step 1 — Install**
```bash
npm install @traek/react
```

**Step 2 — Wrap your app**
```tsx
import { TraekCanvas } from '@traek/react'

export default function App() {
  async function handleSend(content: string, parentNodeId: string | null) {
    const res = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ content, parentNodeId }),
    })
    // return streaming response
    return res
  }

  return <TraekCanvas onSendMessage={handleSend} />
}
```

**Step 3 — Add a server route**
- Show a minimal Next.js or Express route that streams OpenAI completions
- Explain the `parentNodeId` context for branching awareness

**Step 4 — Customize the look**
- CSS variables for quick theming (`--traek-bg`, `--traek-accent`)
- Swap in a custom node renderer

**Step 5 — Try branching**
- Walk through the user experience: type, branch, explore

**Callout boxes:**
- "Why tree nodes?" — brief explanation of `TraekEngine` internals
- "What about auth?" — pointer to playground + Supabase guide

**CTA:** Star on GitHub | Docs | Next tutorial →

---

## Tutorial 2: Build a Research Assistant with Conversation Branching (Svelte 5 + Anthropic)

**Slug:** `build-research-assistant-svelte5-anthropic`
**Target keyword:** `svelte ai chat anthropic claude ui`
**Level:** Intermediate
**Framework:** Svelte 5 / SvelteKit

### Outline

**Introduction**
- Use case: academic research, where you explore multiple hypotheses in parallel
- What you'll build: a branching research assistant that saves conversation trees to localStorage

**Step 1 — Install in SvelteKit**
```bash
npm install @traek/svelte
```

**Step 2 — Create a SvelteKit layout with TraekCanvas**
- `+layout.svelte` setup
- Server-side route with Anthropic streaming SDK
- Handling `anthropic.messages.stream()`

**Step 3 — Persistence**
- Use `TraekEngine.snapshot()` and `localStorage`
- Restore on page load with `TraekEngine.restore(snapshot)`

**Step 4 — Multiple branches in practice**
- Research scenario: "Compare the economic theories of Keynes vs. Hayek"
- Branch from the AI's answer to explore each economist's view independently

**Step 5 — Custom node types**
- Add a "Source" node type for citation cards
- Implement `nodeComponents` map in `TraekCanvas`

**CTA:** Docs → Custom Nodes | Anthropic provider guide →

---

## Tutorial 3: Build a Code Review Bot with Forked Conversations (Vue + Mistral)

**Slug:** `build-code-review-bot-vue-mistral`
**Target keyword:** `vue ai code review chatbot`
**Level:** Intermediate
**Framework:** Vue 3

### Outline

**Introduction**
- Use case: team code review tooling, where reviewers want multiple AI passes on different parts of the code
- What you'll build: a Vue 3 app that lets you paste code, get a review, then branch into specific sub-discussions

**Step 1 — Install**
```bash
npm install @traek/vue
```

**Step 2 — TraekCanvas in a Vue 3 SPA**
- `<TraekCanvas>` component setup
- Provide/inject pattern for engine access

**Step 3 — API route with Mistral**
- Mistral streaming API integration
- System prompt: "You are a senior code reviewer..."

**Step 4 — Branch-per-section pattern**
- User pastes a function → AI reviews the whole thing
- Branch from the review: "Explain the time complexity issue"
- Branch again: "Show me the refactored version"

**Step 5 — Tags and bookmarks**
- Use node tagging to mark "accepted suggestions" vs "deferred"
- Color-code branches by file / component

**CTA:** Docs → Tags & Colors | Vue adapter reference →

---

## Tutorial 4: Build a Multi-Provider AI Playground (Agnostic + All Frameworks)

**Slug:** `build-multi-provider-ai-playground-traek`
**Target keyword:** `multi provider llm ui playground`
**Level:** Advanced
**Framework:** Framework-agnostic (examples for React, Svelte, Vue)

### Outline

**Introduction**
- Use case: developer tooling / internal AI playground where you compare outputs from GPT-4, Claude, and Gemini side-by-side
- What you'll build: a single canvas where different branches hit different providers

**Step 1 — The routing pattern**
- `onSendMessage` receives `parentNodeId` and node metadata
- Read provider preference from node metadata or a UI selector

**Step 2 — Provider routing server**
```ts
// POST /api/chat
const provider = body.provider ?? 'openai'
if (provider === 'openai')   return streamOpenAI(body)
if (provider === 'anthropic') return streamAnthropic(body)
if (provider === 'google')   return streamGemini(body)
```

**Step 3 — Tagging branches by provider**
- Attach provider color as node color (API)
- Visual differentiation on canvas

**Step 4 — Comparing outputs**
- Branch the same question to two providers
- Zoom out to see parallel responses side-by-side

**Step 5 — Export / save sessions**
- `engine.snapshot()` for JSON export
- Download button implementation

**CTA:** Docs → Persistence | Multi-provider example repo →

---

## Tutorial 5: Build a Customer Support AI with Escalation Trees (React + Groq)

**Slug:** `build-customer-support-ai-escalation-tree-groq`
**Target keyword:** `ai customer support chatbot react groq`
**Level:** Intermediate
**Framework:** React

### Outline

**Introduction**
- Use case: embedded support widget where each issue becomes a conversation branch
- What you'll build: a support tree where agents can branch to sub-issues without losing context

**Step 1 — Install & embed**
```bash
npm install @traek/react
```
- Embedding in an existing React app as a sidebar or modal

**Step 2 — Groq streaming integration**
- Groq's OpenAI-compatible API
- Sub-100ms TTFT for snappy support responses

**Step 3 — System prompt design**
- Structured prompts for support context
- Passing customer metadata as system context

**Step 4 — Escalation branching**
- Agent branches from "billing issue" to "technical issue" without losing billing context
- Each branch is a separate conversation thread with the same customer context

**Step 5 — Read-only mode for supervisors**
- `readOnly` prop on `TraekCanvas`
- Supervisors see the full tree; agents work in specific branches

**Step 6 — Custom LoadingOverlay**
- "Fetching answer from knowledge base..." skeleton
- Use `DefaultLoadingOverlay` as a base

**CTA:** Groq integration guide | Live demo → playground.gettraek.com

---

## Publication Checklist (per tutorial)

- [ ] Working code example in GitHub `examples/` directory
- [ ] CodeSandbox / StackBlitz embed link
- [ ] SEO meta: title, description, canonical URL
- [ ] Cross-link to the relevant provider guide in `/docs/guides/`
- [ ] Add to blog content calendar (release date)
- [ ] Cross-post to Dev.to with appropriate tags
- [ ] Tweet thread summary (3–5 tweets) using `social-repurposing-workflow.md`
- [ ] Share in Discord `#showcase` channel
- [ ] Pin on GitHub Discussions

---

## Series Metadata

| # | Title | Framework | Provider | Target Keyword | Publish Date |
|---|-------|-----------|----------|----------------|--------------|
| 1 | Branching AI Chat in 15 min | React | OpenAI | react ai chat ui branching | Apr 7, 2026 |
| 2 | Research Assistant | Svelte 5 | Anthropic | svelte ai chat anthropic | Apr 21, 2026 |
| 3 | Code Review Bot | Vue 3 | Mistral | vue ai code review chatbot | May 5, 2026 |
| 4 | Multi-Provider Playground | All | All | multi provider llm ui playground | May 19, 2026 |
| 5 | Customer Support AI | React | Groq | ai customer support chatbot react groq | Jun 2, 2026 |
