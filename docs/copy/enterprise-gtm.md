# træk — Enterprise Go-to-Market Materials

**Date:** 2026-03-07
**Task:** [TRK-34](/issues/TRK-34)
**Author:** CMO
**Reference:** TRK-22 (Phase 3: Enterprise Licensing & Support)

---

## Part 1 — Enterprise Landing Page Copy (gettraek.com/enterprise)

---

### Hero

**Eyebrow:**
```
Enterprise-grade spatial AI interfaces
```

**H1:**
```
The AI conversation layer your
engineering team won't have to build.
```

**Subhead:**
```
træk gives product teams a production-ready spatial canvas for branching AI conversations —
with white-label theming, real-time collaboration, security controls, and dedicated support.
Ship in weeks, not quarters.
```

**Primary CTA:**
```
[Book a demo →]
```

**Secondary CTA:**
```
[See pricing →]
```

**Social proof bar:**
```
Trusted by AI product teams at startups and scale-ups building on OpenAI, Anthropic, and open models.
```

---

### Problem Section

**Section label:** `The problem`

**H2:**
```
Your team is rebuilding the same UI
every AI product company builds.
```

**Body:**
```
Every AI product starts with the same sprint: build a chat interface. Wire up streaming.
Add conversation history. Handle branching if you're ambitious.

Six weeks later, you have a custom UI your team now owns indefinitely.

Meanwhile, the model improved. The prompt changed. Users want more.
But your engineers are debugging WebSocket reconnect logic.
```

**Three-column pain points:**

```
Column 1 — Linear chat limits AI products
The model can explore, reason in parallel, and branch — but your UI forces users
into a single thread. You lose the actual value of the model.

Column 2 — Building from scratch costs quarters
A production-ready spatial canvas with pan/zoom, branching, streaming,
accessibility, and theming takes 3–6 months of senior engineering time.
That's the feature roadmap you didn't ship.

Column 3 — Every team reinvents the same wheel
Across the AI ecosystem, dozens of teams are building nearly identical
conversation canvases independently. None of them are better for it.
```

---

### Solution Section

**Section label:** `The solution`

**H2:**
```
A complete spatial conversation stack.
Open core, enterprise-ready.
```

**Body:**
```
træk is a Svelte 5 UI library for building spatial, tree-structured AI conversation interfaces.
The core is MIT-licensed and production-ready. Enterprise packages add white-labeling,
real-time collaboration, analytics, and commercial support.

Your team integrates træk in days. Then ships features.
```

**Capability cards:**

```
Card 1 — Spatial canvas
Pan/zoom canvas with branching, streaming, node layout, and keyboard navigation.
Built for exploration, not linear Q&A.

Card 2 — @traek/collab
Real-time multi-user collaboration with CRDT sync (Yjs), live cursors,
presence, and offline resilience. One hook to integrate.

Card 3 — @traek/analytics
Conversation flow analytics with heatmap overlays, per-node engagement metrics,
and aggregated path analysis — all client-side, privacy-preserving.

Card 4 — @traek/whitelabel
Full brand control: remove attribution, override every design token,
custom loading screens. TypeScript config API with IntelliSense.

Card 5 — @traek/export
PDF export, presentation mode, embeddable widgets. Web Worker rendering,
so it never blocks the canvas.

Card 6 — Enterprise support
Dedicated Slack Connect channel. SLA: 4h critical, 24h standard.
Priority bug fixes. Custom development services available.
```

---

### Integration Section

**H2:**
```
Integrates with how you already work.
```

**Body:**
```
træk is a UI library, not a platform. It doesn't own your AI layer,
your backend, or your data model. You bring your model provider, your API,
your storage — træk renders the interface.
```

**Code example:**
```svelte
<script>
  import { TraekCanvas, TraekEngine } from '@traek/svelte'

  const engine = new TraekEngine()

  async function handleMessage(content, parentId) {
    const node = engine.addNode({ content, parentId, role: 'user' })
    const response = await streamFromYourAPI(content)
    engine.streamIntoNode(node.id, response)
  }
</script>

<TraekCanvas {engine} onSendMessage={handleMessage} />
```

**Caption:**
```
That's a production-ready spatial canvas. Your AI logic stays yours.
```

---

### Social Proof / Use Cases

**H2:**
```
What teams build with træk.
```

**Use case cards:**

```
Use case 1 — AI research tools
Research teams use branching canvases to explore multiple model outputs
in parallel, compare reasoning paths, and share sessions with colleagues.
@traek/collab turns a solo exploration tool into a team workspace.

Use case 2 — AI product development platforms
Developer tools companies embed træk as the conversation layer inside
their AI-powered IDEs, design tools, and knowledge bases — white-labeled
under their own brand with @traek/whitelabel.

Use case 3 — Enterprise AI assistants
Enterprise teams building internal AI assistants need audit trails,
conversation export, and presentation-ready outputs. @traek/export
and @traek/analytics handle both.

Use case 4 — AI consulting & agencies
Consultancies building AI products for clients use træk as their
standard conversation layer — shipped under client branding, faster
than building custom, easier to maintain.
```

---

### Pricing Section (Enterprise)

**H2:**
```
Transparent pricing. No surprises.
```

```
Library packages:

Starter — $29/month per project
1 premium module. Build-time license key. Email support.

Team — $99/month per project
All 4 premium modules. Up to 10 devs. Priority support. Private Slack.

Enterprise — Custom
Unlimited projects and seats. Custom license. On-premise registry option.
SLA, security review, NDAs, invoice billing.
Dedicated success manager.
```

**Enterprise-specific inclusions:**
```
✓ Custom license agreement (source-available on request)
✓ On-premise npm registry option (air-gapped deployments)
✓ SLA: 99.9% registry uptime, 4h critical support response
✓ Dedicated Slack Connect channel with træk engineers
✓ Priority feature requests
✓ Security review & compliance documentation (SOC2 Type II, GDPR)
✓ IP indemnification
✓ Annual invoicing (net-30/60 available)
✓ Custom development services ($200–300/hr)
✓ Team training workshops ($2k/session)
```

**CTA:**
```
[Book a call with our enterprise team →]
enterprise@gettraek.com
```

---

### FAQ (Enterprise)

**Q: What AI providers does træk work with?**
```
træk is model-agnostic. It renders UI — you wire your own AI backend.
Teams use it with OpenAI, Anthropic, Google, Mistral, local models,
and custom inference infrastructure. The only requirement is that you
stream completions; træk handles the rendering.
```

**Q: Can we self-host everything?**
```
Yes. The core library runs entirely client-side. @traek/collab requires
a WebSocket server for sync — you can run ours (hosted) or deploy your
own Yjs server. Enterprise plans include an on-premise npm registry option
so you never depend on our CDN.
```

**Q: How long does integration take?**
```
A basic integration takes a senior Svelte developer 1–2 days.
A full production integration with custom theming, custom node types,
and enterprise auth typically takes 1–2 weeks.
We offer a paid integration kickstart ($2k, includes a 2h live session
with a træk engineer).
```

**Q: What's your security posture?**
```
træk is a UI library — it doesn't process or store your AI conversations.
All conversation data stays in your infrastructure. We provide SOC2 Type II
documentation, GDPR data processing agreements, and security review for
Enterprise customers.
```

**Q: Do you support custom licensing terms?**
```
Yes. Enterprise customers get a custom license agreement. We can accommodate
source-available access, redistribution restrictions, and custom IP terms
for OEM/embedding use cases. Talk to us.
```

---

### CTA Footer

**H2:**
```
Ready to ship your spatial AI interface?
```

**Body:**
```
Book a 30-minute demo. We'll show you a real integration, answer your
technical questions, and scope what it would take to ship with træk.
```

**CTA:**
```
[Book a demo →]  [Download the enterprise brief (PDF) →]
```

---

## Part 2 — Enterprise Sales Deck

*(Slide-by-slide structure for presenter deck)*

---

### Slide 1 — Cover

```
træk
Spatial AI Conversation Infrastructure for Product Teams

[presenter name]
[date]
[company name — if customized]
```

---

### Slide 2 — The Problem (1 of 2)

**Title:** `Every AI product starts with the same sprint.`

**Body:**
```
• Build a chat interface
• Wire up streaming
• Add conversation history
• Handle branching (eventually)

6–12 weeks of senior engineering time.
Then your team owns it. Forever.
```

**Visual:** Timeline showing a team building chat UI vs. shipping features

---

### Slide 3 — The Problem (2 of 2)

**Title:** `Linear chat limits what AI can do.`

**Body:**
```
LLMs can reason in parallel, explore alternatives, branch.

A linear chat UI throws that away.

Users see: a scrolling message list.
They could see: a spatial exploration of the model's thinking.
```

**Visual:** Linear chat vs. branching canvas comparison screenshot

---

### Slide 4 — The Solution

**Title:** `træk: the spatial conversation layer for AI products.`

**Body:**
```
• MIT-licensed core — free to evaluate, free to prototype
• Production-ready spatial canvas: pan/zoom, branching, streaming
• Premium packages: collab, analytics, export, white-label
• Enterprise: custom licensing, SLA, on-premise options

Your team ships features. Not infrastructure.
```

**Visual:** træk canvas screenshot with branching conversation

---

### Slide 5 — How It Works

**Title:** `A UI library. Not a platform.`

**Body:**
```
træk renders the interface.
You own the AI layer, the backend, the data.

• Bring your own model provider (OpenAI, Anthropic, local, custom)
• Bring your own storage and auth
• træk handles the canvas, streaming, branching, theming

No lock-in. No data sharing. Just a better UI.
```

**Code snippet:**
```svelte
<TraekCanvas {engine} onSendMessage={handleMessage} />
```

---

### Slide 6 — Premium Modules

**Title:** `Four modules. Add what you need.`

| Module | What it does | Who needs it |
|---|---|---|
| @traek/collab | Real-time multi-user collaboration (CRDT/Yjs) | Teams, research groups |
| @traek/analytics | Conversation flow heatmaps + metrics | Product teams, PMs |
| @traek/export | PDF, presentation mode, embeds | Client-facing products |
| @traek/whitelabel | Full brand control, token overrides | Agencies, OEM builders |

---

### Slide 7 — Integration Speed

**Title:** `From zero to production-ready canvas: days, not quarters.`

```
Day 1: npm install @traek/svelte
       Basic canvas running locally

Day 2: Connect your AI API
       Custom theming applied

Week 1: @traek/whitelabel — your brand, your tokens
        @traek/collab — team sessions live

Week 2: @traek/analytics — understand user paths
        @traek/export — client deliverables ready
```

**Comparison:**
```
Custom build: 12–24 weeks, 2 senior engineers
træk: 1–2 weeks, 1 engineer
```

---

### Slide 8 — Use Cases

**Title:** `What AI product teams build with træk.`

```
Research tools: branching exploration, async collaboration, session sharing

Developer platforms: embedded canvas in IDEs and design tools, white-labeled

Enterprise AI assistants: audit trails, export, presentation-ready outputs

AI agencies: client-branded canvases shipped faster, maintained centrally
```

---

### Slide 9 — Pricing

**Title:** `Pay for what you ship.`

```
Free (MIT):          @traek/svelte core — everything to start building
Starter ($29/mo):    1 premium module per project
Team ($99/mo):       All modules, up to 10 devs, priority support
Enterprise (custom): Unlimited, SLA, on-premise, custom license
```

**Enterprise includes:**
```
✓ Unlimited projects + seats
✓ Custom license + IP indemnification
✓ On-premise registry option
✓ 4h critical SLA
✓ Dedicated Slack Connect
✓ SOC2 + GDPR documentation
✓ Annual invoicing
```

---

### Slide 10 — Case Study (Template — replace with real customer)

**Title:** `[Company] — From linear chat to spatial canvas in [N] weeks.`

```
The problem:    [1-2 sentences on their pain]
What they built: [product description with træk]
Result:         [metric — e.g. "3 weeks of WebSocket plumbing eliminated"]
Quote:          "[pull quote from decision-maker]"
```

---

### Slide 11 — The Team

**Title:** `Built by people who've shipped AI products.`

```
[Brief team bios — add actual team members]

We've seen the "build a chat UI" sprint from both sides.
træk exists because we got tired of building the same thing.
```

---

### Slide 12 — Next Steps

**Title:** `Let's talk.`

```
→ 30-min technical demo
→ Scope your integration
→ 14-day trial with all modules unlocked
→ Enterprise kickstart package ($2k): live integration session with a træk engineer

enterprise@gettraek.com
gettraek.com/enterprise
```

---

## Part 3 — ROI Calculator (AI Product Teams)

*(Copy and logic for an interactive or PDF-format ROI calculator)*

---

### Calculator Title

```
How much does building your own conversation UI cost?

Most teams underestimate the true cost of a custom spatial canvas.
Here's how to calculate it — and what træk saves you.
```

---

### Input Variables

```
[1] Senior frontend engineer hourly cost
    Default: $120/hr (US) or $80/hr (EU)
    Adjust for your market

[2] Engineers assigned to conversation UI
    Default: 2

[3] Estimated weeks to build from scratch
    Conservative: 12 weeks
    Typical: 20 weeks
    Ambitious (branching + collab + streaming): 32 weeks

[4] Ongoing maintenance hours per month
    Typical: 20–40 hrs/month (streaming bugs, browser compat, a11y, etc.)

[5] Opportunity cost (optional)
    Features not shipped while building chat UI: estimate as $X
```

---

### Calculation Logic

**Initial build cost:**
```
Engineers × Hours/week × Weeks × Hourly rate
= Initial investment
```

**Example:**
```
2 engineers × 40 hrs × 20 weeks × $120/hr
= $192,000 initial build cost
```

**Ongoing maintenance (Year 1):**
```
30 hrs/mo × 12 months × $120/hr
= $43,200/year
```

**Total Year 1 custom build:**
```
$192,000 + $43,200 = $235,200
```

**træk Enterprise cost (Year 1):**
```
$99/mo × 12 months = $1,188 (Team plan)
Enterprise: est. $12,000/yr for typical mid-size team

+ Integration: 1 engineer × 2 weeks × $120/hr = $9,600

Total træk Year 1: ~$10,800 (Team) to ~$22,000 (Enterprise)
```

**Savings:**
```
Custom build: $235,200
træk Enterprise: $22,000

Year 1 savings: ~$213,000
ROI: ~970%
```

---

### ROI Summary Block (for calculator output)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Custom build cost (Year 1):     $[X]
træk Enterprise cost (Year 1):  $[Y]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Savings:                        $[Z]
ROI:                            [N]%
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Engineering weeks saved:        [N] weeks
Features you ship instead:      [input from user]
```

---

### What the Numbers Don't Capture

```
• Maintenance burden: every browser update, streaming API change,
  and a11y requirement is now your team's problem.

• Hiring cost: if your canvas developer leaves, you own onboarding
  the next one into a bespoke system.

• Quality gap: træk is battle-tested across dozens of integrations.
  Your custom canvas isn't.

• Speed to market: 20 weeks is 5 months. In AI product development,
  that's an eternity.
```

---

### CTA

```
Ready to see the numbers for your team?

Talk to us — we'll scope your integration and show you what
shipping with træk actually costs.

[Book a call →]  enterprise@gettraek.com
```

---

## Part 4 — Outreach Playbook

---

### 4.1 — Target List Criteria

**Primary targets: AI product companies (Series A–C)**

```
Signal indicators:
✓ Job postings for "AI engineer", "LLM engineer", "AI product manager"
✓ GitHub repos with OpenAI/Anthropic SDK dependencies
✓ npm packages that import OpenAI, LangChain, or similar
✓ Product descriptions mentioning "AI assistant", "AI copilot", "AI chat"
✓ Recent funding round for AI product
✓ LinkedIn posts from founders/CPOs about shipping AI features

Exclude:
✗ Companies building their own model (they're not building UI)
✗ Companies with large internal platform teams (they'll rebuild anyway)
✗ Enterprise-only B2B (long sales cycles, procurement blockers)
```

**Secondary targets: AI-enabled developer tools**

```
Signal indicators:
✓ IDE plugins, code review tools, documentation tools with AI features
✓ GitHub Copilot competitors or adjacent tools
✓ DevTools companies experimenting with conversational interfaces
✓ Companies where "AI conversation" is a new feature, not core product
```

**Tertiary targets: Agencies and consultancies**

```
Signal indicators:
✓ "AI consulting", "AI development", "LLM integration" in description
✓ Multiple client AI projects visible on portfolio
✓ Small-to-mid-size teams (5–50 devs)
✓ Active on GitHub or dev Twitter/LinkedIn
```

---

### 4.2 — ICP Personas

**Persona 1: The AI Product Engineer (primary technical evaluator)**

```
Title: Senior Frontend Engineer, Staff Engineer, Tech Lead
Pain: Just finished building the 3rd version of a chat UI at 3 different companies
Goal: Ship something good, fast, without reinventing the wheel
Objection: "We have specific requirements that an off-the-shelf lib won't cover"
Response: "træk is a library, not a SaaS. You own the integration. Here's how we've
           handled custom node types / custom theming / custom streaming."
```

**Persona 2: The AI Product Manager / CPO**

```
Title: PM, Head of Product, CPO
Pain: Engineers are stuck in infra work instead of product differentiation
Goal: Ship the AI feature faster; understand user behavior on it
Objection: "We can't take on another vendor dependency"
Response: "Core is MIT. You can fork it. The premium modules are the dependency —
           and they're optional. You get off the dependency anytime."
```

**Persona 3: The CTO / Engineering Manager**

```
Title: CTO, VP Engineering, Head of Engineering
Pain: Technical debt from custom chat infra; scaling collab is expensive
Goal: Reduce maintenance burden; support future growth
Objection: "What's the long-term support story?"
Response: "Enterprise SLA, dedicated support channel, custom dev services.
           We treat enterprise customers as partners, not tickets."
```

---

### 4.3 — Email Templates

**Template A — Cold outreach (technical persona)**

```
Subject: Your AI UI doesn't have to be a 12-week project

Hi [Name],

I noticed [Company] is building [product/feature] — looks like you're doing
something interesting with [AI use case].

One question: how much engineering time went into the conversation interface?

We built træk because we kept seeing great AI products slow down at the
same point: someone has to build (and then own) a chat canvas. It's not
glamorous and it's not the product — but it takes weeks and then someone
has to maintain it forever.

træk is an MIT-licensed Svelte 5 library for spatial, tree-structured
AI conversation UIs. Pan/zoom canvas, branching, streaming, theming — all
production-ready. Enterprise packages add real-time collab, analytics,
and white-labeling.

Would a 20-minute technical walkthrough be worth your time?

→ gettraek.com

[Your name]
træk
```

---

**Template B — Cold outreach (product/executive persona)**

```
Subject: [Company]'s AI interface — question

Hi [Name],

Congrats on [recent launch/funding/product milestone] — looks like
[Company] is moving fast on [AI feature].

Quick question: are your engineers spending significant time on the
conversation UI, or did you find a way to shortcut that?

I ask because we built træk for exactly this situation — teams with a
differentiated AI product who don't want to spend quarters building
the interface from scratch.

træk is a production-ready spatial canvas for AI conversations. MIT core,
premium packages for collab, analytics, and white-labeling. Most teams
go from zero to production in 1–2 weeks.

Worth 20 minutes to see if it fits what you're building?

[Your name]
træk | gettraek.com/enterprise
```

---

**Template C — Warm outreach (referral or shared context)**

```
Subject: saw your post about [AI conversation UI challenge]

Hi [Name],

Saw your [post/talk/thread] about [specific challenge — e.g. building chat UIs,
streaming latency, conversation branching]. Felt very familiar.

We built træk to solve exactly that — a Svelte 5 UI library for spatial,
tree-structured AI conversation interfaces. Open core (MIT), with premium
packages for collab, analytics, export, and white-labeling.

A lot of teams building [similar product type] have found it saves them the
12+ week sprint of building a custom canvas from scratch.

Happy to send you a live demo or jump on a quick call if it's relevant
to what you're working on.

→ gettraek.com/enterprise

[Your name]
```

---

**Template D — Follow-up (after no response, 7 days)**

```
Subject: Re: [original subject]

Hi [Name],

Didn't want to lose the thread — just wanted to check if the timing
was off or if you'd had a chance to look at træk.

If you're in the middle of evaluating spatial canvas solutions (or just
getting started), I'm happy to do a 20-minute live demo.

If it's not relevant right now, no worries — I'll leave you alone.

[Your name]
```

---

**Template E — Inbound / trial signup follow-up**

```
Subject: Welcome to træk — anything I can help with?

Hi [Name],

Saw you started a trial — glad you're exploring træk.

A few things that usually help during evaluation:

1. The quickstart is at gettraek.com/docs/quickstart
2. If you're integrating with [OpenAI/Anthropic], we have specific guides
3. Common first questions: custom node types, theming, and streaming setup

If you hit anything, just reply here — I check these personally.

Also: if you're evaluating for a team (not just a side project), I'm happy
to do a live technical walkthrough. Just say the word.

[Your name]
træk
```

---

### 4.4 — Demo Script

**Pre-demo prep (5 min before call)**

```
1. Pull up the live træk demo (gettraek.com/demo or local)
2. Have a branching conversation pre-loaded (5–8 nodes minimum)
3. Know their stack: what framework? what AI provider? what are they building?
4. Check their GitHub if possible — what's their tech level?
```

---

**Demo flow (20–30 minutes)**

**Opening (2 min):**
```
"Before I show you anything, tell me what you're building and where you are
in the build process. I want to make sure I show you what's relevant."

[Listen. Adjust the demo to their context.]
```

**The problem (3 min):**
```
"How long did it take — or how long are you expecting it to take — to
build your conversation interface?"

[Wait for their number. Then:]

"Most teams we talk to say 8–20 weeks for a production-quality canvas.
Does that match what you're seeing?"

[Validate the pain before showing the solution.]
```

**Core canvas demo (5 min):**
```
"Let me show you what træk looks like out of the box."

[Show the canvas. Demonstrate:]
1. Pan and zoom with mouse/trackpad
2. Create a message and see streaming
3. Branch from a node — "notice how you can explore alternatives"
4. Keyboard navigation (Tab, arrow keys)
5. Theme toggle (dark/light)

"This is about 10 lines of integration code. Your AI logic, your API —
træk just renders it."
```

**Their specific use case (7 min):**
```
[Adapt to what they said in the opening]

If they need collab: "Let me show you what @traek/collab looks like..."
  → Open two browser windows, show live cursors and presence

If they need white-label: "Here's how the token system works..."
  → Show theme config, apply their brand colors live

If they need analytics: "Here's the analytics overlay..."
  → Toggle heatmap on a conversation with history

If they need export: "Here's a PDF export of this conversation..."
  → Generate PDF of current session, show presentation mode
```

**Integration walkthrough (5 min):**
```
"Let me show you the actual integration code."

[Show:]
1. npm install command
2. TraekEngine initialization
3. TraekCanvas component — onSendMessage handler
4. Custom node type (if relevant to their use case)

"This is the full integration. Your API stays yours. Your data stays yours.
træk handles the canvas."
```

**Pricing and next steps (5 min):**
```
"Based on what you've told me — [their use case] — I'd recommend [Team/Enterprise].

Here's what that looks like:
[Walk through relevant pricing tier]

The trial is 14 days, all modules unlocked, no card required.

What questions do you have?"

[Listen. Handle objections. Then:]

"What's your timeline? Are you evaluating multiple options, or are you
ready to start a trial?"
```

**Objection handling:**

```
"We use React, not Svelte."
→ "We have @traek/react and @traek/vue adapters in active development.
   I can get you early access — what's your timeline?"

"We have very specific custom requirements."
→ "træk is a library, not a platform. Show me what you need to customize —
   99% of the time it's covered by custom node types, theming tokens,
   or the adapter API."

"We're worried about vendor dependency."
→ "The core is MIT. You can fork it today, and it'll keep working forever.
   The premium modules are the dependency — and they're optional.
   If we disappeared tomorrow, you'd still have a working canvas."

"The price seems high for a UI library."
→ "Compare it to the engineering cost of building from scratch.
   [Reference ROI calculator numbers]. A Team plan at $99/mo is
   one hour of a senior engineer's time."

"We need on-premise."
→ "Enterprise includes an on-premise npm registry option.
   Let me scope that for you — it's a common ask."
```

---

## Part 5 — Partnership Pitch: AI API Providers

*(For OpenAI, Anthropic, and similar platforms)*

---

### Partnership Pitch — Overview

**Target:** OpenAI Partnerships / Developer Relations, Anthropic Partnerships
**Ask:** Co-marketing, developer program listing, and/or integration support
**Value exchange:** træk drives API consumption; mutual developer goodwill

---

### Pitch Document

**Subject:** træk × [OpenAI/Anthropic] — developer partnership opportunity

---

**Who we are:**

```
træk is an open-source Svelte 5 UI library for building spatial,
tree-structured AI conversation interfaces. We're the conversation canvas
layer that AI product teams use to ship faster.

MIT-licensed core. Premium packages for collab, analytics, export, and white-labeling.
```

**Why this is relevant to you:**

```
Every team building on [OpenAI/Anthropic] APIs eventually needs a conversation UI.

Right now, they build it themselves. That's 8–20 weeks of engineering time per team,
repeated across thousands of developers in your ecosystem.

træk solves this. When developers use træk, they spend more time prompting and less
time building infrastructure — which means more API calls, more experimentation,
and more products shipped on your platform.
```

**What we're proposing:**

```
Option A — Developer documentation integration
Add træk to your "building conversational UIs" documentation as a recommended
open-source library. We'll maintain a dedicated integration guide for your API.

Option B — Developer program listing
List træk in your developer marketplace / partner directory.
We'll feature your logo and provide a co-branded integration example.

Option C — Co-marketing
Joint blog post: "Building a spatial AI conversation interface with [provider] + træk"
Social amplification of our respective launch announcements.
Cross-referral to each other's developer communities.

Option D — Technical partnership
Early access to new API features for træk integration development.
Joint showcase at developer events.
```

**What træk brings:**

```
• Active developer community (growing npm downloads)
• High-quality, MIT-licensed codebase — reflects well on ecosystem partners
• Reduces support burden: developers who use træk ask fewer "how do I build a chat UI"
  questions to your DevRel team
• Enterprise customers of træk are enterprise customers of your API
```

**Our ask:**

```
• 30-minute intro call with your partnerships or developer relations team
• Exploration of a documentation integration or marketplace listing
• We'll do the work — we just need the channel
```

**Contact:**

```
[Name], træk
partnerships@gettraek.com
gettraek.com
```

---

### Follow-up Email (1 week after initial outreach)

```
Subject: Re: træk × [OpenAI/Anthropic] partnership

Hi [Name],

Following up on my note about a developer partnership between træk and [provider].

Quick version of the ask: we'd love a listing in your developer directory and
a co-authored integration guide. We've already built and tested the integration —
it would take your team very little lift.

The value for you: developers who use træk ship AI products faster, which means
more API usage and fewer "how do I build a chat UI" questions to your DevRel.

Worth 20 minutes to explore?

[Name]
træk
```

---

### Partnership One-Pager (Shareable PDF format)

**Page 1:**

```
træk × [Provider]

Better together: the spatial AI conversation layer for [Provider] developers.

→ træk: open-source canvas for branching, spatial AI conversations
→ [Provider]: the model powering the conversation

Integration: 15 minutes from npm install to streaming canvas
Documentation: gettraek.com/docs/integrations/[provider]
```

**Key stats (fill in as available):**

```
• [N] npm downloads / month
• [N] GitHub stars
• [N] production integrations
• [N] enterprise customers
```

**The integration in 30 lines:**

```typescript
// [Provider] + træk in 30 lines
import { TraekCanvas, TraekEngine } from '@traek/svelte'
import [ProviderSDK] from '[provider-sdk]'

const engine = new TraekEngine()
const client = new [ProviderSDK]({ apiKey: import.meta.env.[PROVIDER]_KEY })

async function handleMessage(content: string, parentId: string) {
  const userNode = engine.addNode({ content, parentId, role: 'user' })
  const assistantNode = engine.addNode({
    content: '',
    parentId: userNode.id,
    role: 'assistant',
    status: 'streaming'
  })

  const stream = await client.streamCompletion({ prompt: content })
  for await (const chunk of stream) {
    engine.appendToNode(assistantNode.id, chunk)
  }
  engine.finalizeNode(assistantNode.id)
}
```

```svelte
<TraekCanvas {engine} onSendMessage={handleMessage} />
```

---

*End of TRK-34 deliverables.*
