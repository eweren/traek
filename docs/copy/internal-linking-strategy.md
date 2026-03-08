# Internal Linking Strategy — Træk

_Date: 2026-03-08_

## Goal

Build a crawlable, topically-clustered link graph that:
1. Concentrates PageRank on high-value commercial pages (framework landing pages, installation)
2. Creates clear topic clusters search engines can understand
3. Reduces orphan pages that get no link equity

---

## Topic Clusters

### Cluster A — Getting Started (Hub: `/getting-started/introduction/`)

| Source Page | Links To | Anchor Text |
|---|---|---|
| `/getting-started/introduction/` | `/getting-started/installation/` | "Install Træk" |
| `/getting-started/introduction/` | `/getting-started/quick-start/` | "Quick Start guide" |
| `/getting-started/introduction/` | `/frameworks/react/` | "React adapter" |
| `/getting-started/introduction/` | `/frameworks/svelte/` | "Svelte 5 adapter" |
| `/getting-started/introduction/` | `/frameworks/vue/` | "Vue 3 adapter" |
| `/getting-started/installation/` | `/getting-started/quick-start/` | "Quick Start" |
| `/getting-started/quick-start/` | `/api/traek-engine/` | "TraekEngine API" |
| `/getting-started/quick-start/` | `/guides/openai-streaming/` | "OpenAI streaming guide" |

### Cluster B — Framework Adapters (Hub: per-framework page)

| Source Page | Links To | Anchor Text |
|---|---|---|
| `/frameworks/react/` | `/api/traek-canvas-react/` | "TraekCanvas React API" |
| `/frameworks/react/` | `/guides/openai-streaming/` | "streaming with OpenAI" |
| `/frameworks/react/` | `/guides/migration-from-linear-chat/` | "migrating from a linear chat" |
| `/frameworks/svelte/` | `/api/traek-canvas-svelte/` | "TraekCanvas Svelte API" |
| `/frameworks/svelte/` | `/guides/sveltekit/` | "SvelteKit integration" |
| `/frameworks/vue/` | `/api/traek-canvas-vue/` | "TraekCanvas Vue API" |
| Each framework page | `/getting-started/installation/` | "Installation" |
| Each framework page | `/api/traek-engine/` | "TraekEngine (shared core)" |

### Cluster C — Guides (Hub: migration guide)

| Source Page | Links To | Anchor Text |
|---|---|---|
| `/guides/migration-from-linear-chat/` | `/getting-started/installation/` | "install Træk" |
| `/guides/migration-from-linear-chat/` | `/frameworks/react/` | "React adapter" |
| `/guides/migration-from-linear-chat/` | `/guides/openai-streaming/` | "add streaming" |
| `/guides/openai-streaming/` | `/api/traek-engine/` | "TraekEngine" |
| `/guides/openai-streaming/` | `/getting-started/quick-start/` | "Quick Start" |
| `/guides/advanced-theming/` | `/api/types/` | "CSS custom properties reference" |
| `/guides/plugin-development/` | `/api/traek-engine/` | "TraekEngine API" |
| `/guides/custom-nodes/` | `/api/text-node/` | "TextNode" |

### Cluster D — API Reference (Hub: `/api/traek-engine/`)

| Source Page | Links To | Anchor Text |
|---|---|---|
| `/api/traek-engine/` | `/getting-started/quick-start/` | "Quick Start example" |
| `/api/traek-engine/` | `/guides/plugin-development/` | "Plugin Development" |
| `/api/traek-canvas-react/` | `/frameworks/react/` | "React framework guide" |
| `/api/traek-canvas-svelte/` | `/frameworks/svelte/` | "Svelte framework guide" |
| `/api/traek-canvas-vue/` | `/frameworks/vue/` | "Vue framework guide" |
| `/api/text-node/` | `/guides/custom-nodes/` | "Custom Nodes guide" |
| `/api/types/` | `/api/traek-engine/` | "TraekEngine" |

---

## Blog → Docs Links (Inbound Content Links)

Each blog post must link to at least 2–4 docs pages. Required links by topic:

| Blog Topic | Required Internal Links |
|---|---|
| React tutorial | `/frameworks/react/`, `/api/traek-canvas-react/`, `/guides/openai-streaming/` |
| Svelte tutorial | `/frameworks/svelte/`, `/api/traek-canvas-svelte/`, `/guides/sveltekit/` |
| Vue tutorial | `/frameworks/vue/`, `/api/traek-canvas-vue/` |
| Architecture post | `/api/traek-engine/`, `/getting-started/introduction/` |
| Theming/accessibility | `/guides/advanced-theming/`, `/api/types/` |
| Migration post | `/guides/migration-from-linear-chat/`, `/getting-started/installation/` |

---

## Breadcrumb Structure

All docs pages use Starlight's automatic breadcrumb. Ensure sidebar hierarchy matches:

```
Home (/)
  └── Getting Started
        ├── Introduction
        ├── Installation
        └── Quick Start
  └── Frameworks
        ├── React
        ├── Svelte
        ├── Vue
        └── Vanilla JS / TypeScript
  └── API Reference
        ├── TraekEngine
        ├── TraekCanvas – React
        ├── TraekCanvas – Svelte
        ├── TraekCanvas – Vue
        ├── TextNode
        └── Types
  └── Guides
        ├── Interactive Examples
        ├── Migration from Linear Chat
        ├── Advanced Theming
        ├── Plugin Development
        ├── Publishing to the Marketplace
        ├── Custom Node Types
        ├── OpenAI Streaming
        └── With SvelteKit
```

---

## Changelog & Releases

- Each release changelog entry should link back to the docs page for new/changed API.
- Example: "Added `branchFrom()` — [see TraekEngine API](/api/traek-engine/#branchfrom)"

---

## Orphan Page Audit

Pages with no inbound internal links (check quarterly via Screaming Frog or Ahrefs site audit):

- [ ] `/guides/marketplace-submission/` — add link from README, plugin-development guide
- [ ] `/guides/examples/` — add link from every getting-started page
- [ ] `/api/types/` — add link from advanced-theming guide

---

## Anchor Text Rules

- **Never** use "click here" or "read more" — always descriptive
- **Match intent**: commercial pages get commercial anchor text ("React AI chat component"), informational pages get informational anchor text ("how branching works")
- **Vary anchors** across pages for the same target (avoid exact-match spam)
- **Max 1 internal link per paragraph** — don't over-link

---

## Cross-site Links

| Property | URL | What to link from |
|---|---|---|
| Playground | `https://play.gettraek.com` | Every docs page footer, getting-started, hero section |
| GitHub | `https://github.com/gettraek/traek` | Docs nav, contributing guide |
| npm | `https://npmjs.com/package/@traek/core` | Installation page |
| Discord | `https://discord.gg/traek` | Contributing, community pages |
