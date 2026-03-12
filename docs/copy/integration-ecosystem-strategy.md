# Integration Partnerships: AI Provider Ecosystem Strategy

*Træk CMO — March 2026*

---

## Executive Summary

Træk occupies a unique position in the AI developer stack: it is the **UI rendering layer** that sits above any model provider. This makes it naturally provider-agnostic — and that agnosticism is a strategic asset. Unlike AI providers who compete with each other, Træk wins when any of them wins. Our integration partnership strategy exploits this neutrality to build distribution across every major AI ecosystem simultaneously.

This document covers:
1. The full AI provider landscape map (tiers, players, Træk fit)
2. Integration partnership strategy — what we want, what we offer, how we sequence
3. "Works with Træk" badge program (positioning and mechanics)
4. Integration showcase page for gettraek.com
5. SDK and developer tooling partnership targets

---

## 1. AI Provider Ecosystem Map

### Tier 1 — Frontier Proprietary (Priority Partners)

These providers have large developer audiences, active DevRel teams, and existing partner programs. Highest co-marketing leverage.

| Provider | Key Model(s) | Unique Træk Angle | Developer Audience | Partner Program |
|----------|-------------|-------------------|-------------------|-----------------|
| **OpenAI** | GPT-4o, o3, o4-mini | Agentic traces → tree nodes; Assistants API threads map to Træk branches | ~5M developers | Yes (OpenAI for Startups, Partner Directory) |
| **Anthropic** | Claude Opus 4.6, Sonnet 4.6 | Extended thinking → Træk thought panel; MCP integration | ~1M developers | Emerging (Anthropic Partner Network) |
| **Google** | Gemini 2.0, 2.5 Pro | Multimodal nodes (image+text); Firebase full-stack story | ~2M developers (AI Studio) | Yes (Google for Startups, Built with Gemini) |
| **xAI** | Grok 3 | Fast reasoning; Grok's brainstorming use case matches Træk UX | Growing | Emerging |

### Tier 2 — High-Growth Inference (Speed & Cost Story)

Fast inference providers whose value proposition is most visible in a real-time streaming canvas.

| Provider | Key Models | Unique Træk Angle | Developer Audience |
|----------|-----------|-------------------|-------------------|
| **Groq** | Llama 3.3 70B, DeepSeek R1 | 500+ tok/sec streaming makes Træk branches complete in near-real-time | ~500K developers |
| **Cerebras** | Llama-based | Wafer-scale speed; parallel branch completion showcase | Niche, growing |
| **Together AI** | 100+ open models | Provider-agnostic routing; model comparison in Træk | ~200K developers |
| **Fireworks AI** | Mixtral, Llama, custom | Low-latency inference; production-ready OSS models | ~100K developers |

### Tier 3 — Open Weight / Self-Hosted (Privacy & Control Story)

The privacy-first, EU-compliant, on-prem developer segment. Smaller individual companies but large collective developer volume.

| Provider/Project | Key Models | Unique Træk Angle | Notes |
|-----------------|-----------|-------------------|-------|
| **Mistral AI** | Mistral Large, Codestral | Self-hosted API; EU-compliant; open-weight | Active developer community |
| **Meta (Llama)** | Llama 3.1, 3.3, 4 | OSS models, run anywhere | Not a direct partner — but Llama runs on everything below |
| **Ollama** | Any GGUF model | Localhost inference + Træk = offline-capable app | Key integration target |
| **LM Studio** | Any GGUF model | Desktop inference; OpenAI-compatible API | Developer tooling partner |
| **Jan.ai** | Any GGUF model | OSS desktop app; privacy-first | Community partner |
| **vLLM** | Production OSS | High-throughput self-hosted inference | Enterprise/devops angle |

### Tier 4 — Specialized / Domain Vertical

Providers targeting specific use cases where Træk can add distinct value.

| Provider | Specialization | Træk Angle |
|----------|---------------|------------|
| **Cohere** | Enterprise NLP, RAG, embeddings | Knowledge retrieval tree; enterprise chat |
| **AI21 Labs** | Jamba (long context) | Deep research trees; long document traversal |
| **Perplexity** | Search-grounded AI | Source attribution nodes; research canvas |
| **ElevenLabs** | Voice/audio AI | Audio nodes in conversation tree |
| **Stability AI** | Image generation | Image nodes inline with text in spatial canvas |
| **Replicate** | Model hosting | Run any model with Træk via Replicate's OpenAI-compatible API |

### Emerging Watch List

Providers to monitor — not ready for formal partnership but worth tracking:

- **Amazon Nova** (Bedrock) — enterprise AWS developers, high-value segment
- **Microsoft Azure OpenAI** — enterprise distribution through Azure ecosystem
- **Nvidia NIM** — on-prem inference microservices
- **Inflection AI / Pi** — conversational AI with distinct personality
- **Contextual AI** — RAG-specialized enterprise

---

## 2. Integration Partnership Strategy

### The Core Proposition

Træk's partnership pitch to any AI provider is simple:

> **"We make your API visible."**
>
> Developers who build with Træk build *products*, not demos. Your API becomes the engine of a beautiful, production-grade UI that users can see and share. Every Træk app that uses [Provider] is a living case study for your platform.

### What We Want from Partners

In priority order:

1. **Documentation link** — a mention in the provider's "building chat UIs" or "example apps" section with a link to the Træk integration guide
2. **Developer newsletter placement** — a single mention to their developer audience (most providers have 100K–5M developer subscribers)
3. **Starter template / example app** — Træk featured as the recommended UI in their quickstart or cookbook
4. **Social promotion** — a tweet/post from the official developer account
5. **Co-authored content** — a blog post, webinar, or tutorial co-produced with their DevRel team

### What We Offer Partners

1. **Integration guide** in Træk docs (permanent, maintained)
2. **SDK template** — copy-paste starter with their SDK (see `provider-sdk-templates.md`)
3. **"Works with Træk" badge** available for apps using their ecosystem
4. **Featured placement** on Træk's integration showcase page
5. **Co-authored content** — blog post, tutorial, or demo video
6. **Træk demo** showcasing their API's unique strengths (e.g., thought panel for Claude reasoning, speed visualization for Groq)

### Partnership Sequencing

**Phase 1 — Q1 2026: Foundation (in progress)**
- Publish integration guides for: OpenAI ✓, Anthropic ✓, Google ✓, Mistral ✓, Groq ✓
- Launch "Works with Træk" badge program (see §3)
- Publish integration showcase page (see §4)
- Begin warm outreach to OpenAI and Anthropic DevRel

**Phase 2 — Q2 2026: First Partnerships**
- Target: OpenAI Cookbook entry + Anthropic docs link (these two alone = massive distribution)
- Groq social promotion campaign (Groq team is known to be responsive to community projects)
- Together AI and Fireworks AI integration guides
- First co-authored blog post (Anthropic or OpenAI)

**Phase 3 — Q3 2026: Expand Ecosystem**
- Mistral and self-hosted provider guides (Ollama, LM Studio)
- Replicate integration (unlocks 100+ model access via one integration)
- Google Firebase + Træk sample app submission to Google AI Studio
- First webinar co-hosted with a provider (target: Anthropic or Groq)
- Begin Tier 4 specialty integrations (ElevenLabs audio nodes, Stability image nodes)

**Phase 4 — Q4 2026: Certified Ecosystem**
- Launch formal "Træk Certified Partner" tier with 2–3 founding partners
- Co-branded marketing materials with certified partners
- Træk integration library: 15+ providers
- Integration showcase as a community-curated resource

### Partnership Metrics

| Metric | Q2 2026 Target | Q4 2026 Target |
|--------|----------------|----------------|
| Providers with doc links back to Træk | 2 | 5+ |
| Developer newsletter placements | 1 | 4+ |
| Webinars / joint events | 0 | 2 |
| "Works with Træk" badge submissions | 10 | 50+ |
| GitHub stars from partnership referrals | 100+ | 500+ |
| npm downloads (monthly) | 5K | 25K |

---

## 3. "Works with Træk" Badge Program

### Brand Rationale

The previous TRK-70 badge concept used tiered internal names ("Compatible / Verified / Certified"). This document formalizes the external-facing brand: **"Works with Træk"** for the baseline, with a premium **"Træk Certified"** tier for formal partners.

The "Works with" phrasing is:
- Immediately understandable (follows established patterns: "Works with Alexa", "Works with Apple HomeKit")
- Humble — doesn't overclaim a certification hierarchy developers don't know yet
- Extensible — "Works with Træk" can appear on AI providers, framework integrations, hosting platforms, and developer tools

### Badge Tiers

#### Tier 1 — Works with Træk (Community)

**Who:** Any app, tool, or project using `@traek/svelte`, `@traek/react`, or `@traek/vue`.

**How to claim:**
1. Use an official Træk npm package
2. Add the badge to your README or app
3. Optionally submit to the ecosystem directory at `gettraek.com/ecosystem/submit` to get listed

**Badge markup:**
```html
<a href="https://gettraek.com" title="Built with Træk">
  <img src="https://gettraek.com/badges/works-with-traek.svg"
       alt="Works with Træk"
       height="20" />
</a>
```

**Markdown:**
```md
[![Works with Træk](https://gettraek.com/badges/works-with-traek.svg)](https://gettraek.com)
```

#### Tier 2 — Træk Verified (Ecosystem Directory)

**Who:** Publicly deployed apps that pass a minimal quality checklist.

**Checklist:**
- [ ] Uses official Træk npm package (no forks)
- [ ] Canvas is keyboard navigable
- [ ] Works on mobile (touch support)
- [ ] Respects `prefers-reduced-motion`
- [ ] Has a publicly accessible live demo URL
- [ ] Submitted via `gettraek.com/ecosystem/submit`

**Benefits:**
- Featured in Træk's public ecosystem directory
- "Træk Verified" badge (distinct from community badge)
- Monthly spotlight opportunity in Træk newsletter

#### Tier 3 — Træk Certified Partner (Commercial)

**Who:** AI providers, frameworks, or developer tools with a formal co-marketing agreement.

**Requirements:**
- Formal partnership agreement (no cost — mutual promotion)
- Official integration guide in Træk docs
- Joint content (blog post, tutorial, or demo)
- Designated DevRel contact

**Benefits:**
- Co-branded "Træk × [Partner]" badge assets
- Featured prominently on integration showcase page
- Co-marketing: social promotion, newsletter, events
- Priority support channel for their developer community
- Listed as founding partner (first cohort, permanent recognition)

### Badge Design Specifications

**Color system:**
- Light variant: `#1e1b4b` (indigo 950) text on `#f8fafc` (slate 50) background
- Dark variant: `#a5b4fc` (indigo 300) text on `#0f172a` (slate 900) background
- Accent: `#6366f1` (indigo 500) — Træk primary brand color

**Typography:** Space Grotesk Medium (matches Træk wordmark)

**Formats delivered:**
- SVG (scalable, recommended)
- PNG 1x (standard) and 2x (retina)
- Light and dark variants for each tier

**Sizes:** `height="20"` (compact), `height="28"` (standard), `height="36"` (featured)

**Hosted at:** `gettraek.com/badges/` (permanent URLs, CDN-cached)

Available badge URLs:
- `https://gettraek.com/badges/works-with-traek.svg`
- `https://gettraek.com/badges/works-with-traek-dark.svg`
- `https://gettraek.com/badges/traek-verified.svg`
- `https://gettraek.com/badges/traek-verified-dark.svg`
- `https://gettraek.com/badges/traek-certified-partner.svg`

---

## 4. Integration Showcase Page

### Purpose

A dedicated page at `gettraek.com/integrations` (or `/ecosystem`) that:
1. Shows developers "Træk works with everything they already use"
2. Acts as a discovery surface for integration guides
3. Provides social proof through real apps using Træk
4. Serves as an inbound channel for partnership inquiries

### Page Structure

```
/integrations
│
├── Hero: "Træk works with every AI provider"
│   "One canvas, any model. Pick your stack."
│
├── Provider Grid (filterable)
│   ├── [Filter: All | Frontier | Fast Inference | Self-Hosted | Specialized]
│   └── Cards: Provider logo + "Integration Guide" CTA + badge tier
│
├── "Works with Træk" community showcase
│   ├── Verified apps grid (logo, description, live demo link)
│   └── "Submit your app" CTA → /ecosystem/submit
│
├── SDK & Tooling integrations
│   ├── Frameworks: Svelte, React, Vue
│   ├── Meta-frameworks: SvelteKit, Next.js, Nuxt
│   ├── AI SDKs: Vercel AI SDK, LangChain.js, LlamaIndex.ts
│   └── Hosting: Vercel, Fly.io, Railway, Cloudflare Workers
│
├── "Start building" CTA section
│   ├── Link to quickstart docs
│   └── Link to provider-specific guides
│
└── Footer: Badge program CTA ("Add 'Works with Træk' to your project")
```

### Content for Each Provider Card

Each card in the provider grid contains:
- Provider logo (svg, white/colored)
- Provider name
- 1-line description of the integration angle
- Link to integration guide
- Badge indicating tier (Community / Verified / Certified Partner)
- Key feature tag (e.g., "Streaming", "Multimodal", "Self-Hosted", "Extended Thinking")

### SEO Strategy for the Page

Target keywords:
- "AI provider integration" + Træk
- "Svelte AI chat UI [provider name]"
- "OpenAI chat interface library"
- "Claude UI component"
- "self-hosted AI chat UI"

Internal linking: every integration guide links back to `/integrations`; the integrations page links to each guide. This creates a hub-and-spoke SEO structure around our integration content.

### Submission Flow (`/ecosystem/submit`)

A lightweight form (or GitHub issue template) collecting:
1. Project name and description
2. Which Træk package(s) used
3. Provider(s) integrated
4. Public demo URL
5. GitHub repo URL (optional)
6. Contact email

Approved submissions are added to the ecosystem directory within 5 business days.

---

## 5. SDK & Developer Tooling Partnership Targets

Beyond AI model providers, Træk should establish integrations and partnerships with the developer tooling layer. These are the frameworks, AI SDKs, and infrastructure tools that developers use alongside AI providers.

### AI SDK / Orchestration Frameworks

| Tool | Maker | Why Partner | Integration |
|------|-------|-------------|-------------|
| **Vercel AI SDK** | Vercel | #1 TypeScript AI SDK; OpenAI-compatible streaming; 500K+ users | Template 7 in `provider-sdk-templates.md`; need official "Works with" listing |
| **LangChain.js** | LangChain | Most widely used AI orchestration; huge community | LangChain + Træk tutorial; Træk as the UI layer for LangChain agents |
| **LlamaIndex.ts** | LlamaIndex | RAG/knowledge graph use cases; TypeScript version growing | Træk as the frontend for LlamaIndex RAG pipelines |
| **Mastra** | Mastra | New TypeScript AI agent framework (Vercel-backed) | Early partnership opportunity — target their launch community |
| **Inngest** | Inngest | Durable functions for AI workflows | Long-running AI jobs visualized as Træk branches |
| **Trigger.dev** | Trigger.dev | Background jobs for AI; streaming from long-running tasks | Træk as UI layer for Trigger.dev AI pipelines |

### Meta-Framework & Hosting Integrations

| Tool | Why | Partnership Action |
|------|-----|--------------------|
| **SvelteKit** | Træk's native framework; @traek/svelte is the primary adapter | Contribute to SvelteKit examples; get featured in SvelteKit's "built with" showcase |
| **Next.js / Vercel** | Largest React deployment platform; @traek/react targets Next.js | Submit to Vercel's templates marketplace; create a "Deploy to Vercel" button for Træk starters |
| **Nuxt** | Vue SSR framework; @traek/vue adapter | Nuxt modules integration; target Nuxt's developer community |
| **Cloudflare Workers** | Edge AI inference; Workers AI (runs Llama etc.) | Deploy Træk + Workers AI guide; submit to Cloudflare's developer showcase |
| **Fly.io** | Developer-friendly hosting; popular for self-hosted Ollama | Træk + Ollama + Fly.io guide — strong self-hosted story |
| **Railway** | Easy full-stack deployments | "Deploy to Railway" one-click for Træk + Ollama or Træk + Groq |

### Developer Tool Integrations

| Tool | Why | Partnership Action |
|------|-----|--------------------|
| **MCP (Model Context Protocol)** | Træk already has MCP integration | Position Træk as the canonical UI for MCP-connected agents; submit to MCP's ecosystem listing |
| **Cursor / Windsurf** | AI-powered IDEs; developers use them to build with Træk | Create "build a Træk app in 5 min with Cursor" tutorial; reach their developer community |
| **Storybook** | Træk already uses Storybook for component dev | Contribute Træk component stories; present at Storybook community |
| **shadcn/ui** | Most popular React component library; potential @traek/react styling story | "Træk + shadcn/ui" integration guide |
| **Tauri / Electron** | Desktop AI app wrappers | Træk + Tauri guide for offline desktop AI apps |

### Open Source / Community Partnerships

| Community | Why | Action |
|-----------|-----|--------|
| **Ollama community** | Huge self-hosted AI community on GitHub/Discord | Træk as the recommended UI in Ollama model showcase |
| **Open WebUI** | Most popular Ollama frontend; 20K+ GitHub stars | Not a competitor — different use case (Træk = library, OWU = app). Potential collaboration on shared patterns |
| **LocalAI** | OpenAI-compatible local inference | Integration guide; community cross-promotion |
| **Hugging Face** | Model hub + Spaces (app hosting) | "Træk Space" template on HuggingFace Spaces; submit to HF ecosystem |
| **awesome-selfhosted** | Curated list of self-hosted apps | Submit Træk (or Træk-based reference apps) |

### Partner Outreach Priority (SDK & Tooling)

**Immediate (Q1 2026):**
1. **Vercel AI SDK** — create official integration template + request listing in their ecosystem
2. **MCP** — formalize existing integration; submit to MCP's tools registry
3. **SvelteKit examples** — contribute Træk starter to sveltejs/examples repo (high SEO / discovery value)

**Q2 2026:**
4. LangChain.js — tutorial + community post
5. Vercel deployment template — "Deploy to Vercel" for Træk + OpenAI starter
6. HuggingFace Space — Træk demo on Spaces (free, high discovery)

**Q3 2026:**
7. Mastra integration guide
8. Cloudflare Workers AI integration
9. LlamaIndex.ts tutorial

---

## 6. Competitive Awareness: What This Partnership Network Defends Against

The integration partnership strategy is also a moat-building exercise. Each co-marketing placement with a provider makes it harder for a competitor to displace Træk as "the recommended UI library" for that provider's ecosystem.

Key risks to monitor:
- **OpenAI builds their own canvas UI** — mitigate by becoming deeply embedded in OpenAI's docs/examples before this happens
- **Vercel AI SDK adds a UI component** — mitigate by partnering with Vercel first; position Træk as the advanced/spatial option vs. their simple chat widget
- **A React-first competitor launches** — mitigate by shipping @traek/react with first-class quality and a Next.js template before they get traction
- **Anthropic recommends a competitor** — mitigate by building the deepest Claude integration (thought panel, MCP) of any UI library

---

## Summary Deliverables Status

| Deliverable | Status | Location |
|-------------|--------|----------|
| AI provider landscape map (Tier 1–4) | ✅ Done | This doc, §1 |
| Integration partnership strategy | ✅ Done | This doc, §2 |
| Integration guides (top 5 providers) | ✅ Done (TRK-70) | `docs/guides/` |
| Co-marketing proposals | ✅ Done (TRK-70) | `docs/copy/ai-provider-partnership-program.md` |
| SDK templates (top 5 + React + AI SDK) | ✅ Done (TRK-70) | `docs/copy/provider-sdk-templates.md` |
| "Works with Træk" badge program | ✅ Done | This doc, §3 |
| Integration showcase page spec | ✅ Done | This doc, §4 |
| SDK/plugin partnership targets | ✅ Done | This doc, §5 |
