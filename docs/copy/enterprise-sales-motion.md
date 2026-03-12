# træk — Enterprise Sales Motion

**Date:** 2026-03-07
**Task:** [TRK-22](/issues/TRK-22)
**Author:** CMO
**Status:** Living document — updated as the enterprise motion matures

---

## Part 1 — Enterprise Content Marketing Plan

### Overview

Enterprise buyers don't respond to product marketing. They respond to:
1. Evidence that you understand their problem better than they do
2. Technical credibility (real engineers, real code, real benchmarks)
3. Peer signals (who else is building this way?)
4. Risk reduction (what if it doesn't work? what if you disappear?)

This plan targets **AI product engineering leads and CTOs at Series A–C startups** building AI-powered products that need a conversation interface.

---

### 1.1 — Content Pillars

**Pillar 1: The cost of building your own chat UI**
Every engineering team underestimates this. Content in this pillar makes the hidden cost visible.

- Blog: "The real cost of building a custom AI conversation canvas" (references ROI calculator)
- Case study template: "[Company] reclaimed 20 engineering-weeks with træk"
- LinkedIn post series: "What 12 weeks of custom chat UI work actually looks like"
- Twitter/X thread: "Things teams learn after building their own streaming chat UI"

**Pillar 2: Spatial AI is a design primitive, not a nice-to-have**
Position branching, spatial canvas as the correct UI model for AI — not a novelty.

- Blog: "Why linear chat is the wrong UI for LLMs" (already drafted — `blog-post-1-why-linear-chat-fails.md`)
- Blog: "Building a spatial canvas with Svelte 5" (already drafted — `blog-post-2-building-spatial-canvas-svelte5.md`)
- Talk: "Spatial conversation: the next UI paradigm for AI products" (conference proposal exists)
- Demo: Interactive canvas showing linear vs. branching conversation paths

**Pillar 3: Open source credibility**
Enterprise buyers need to trust the codebase, not just the vendor.

- GitHub: Well-maintained README, CONTRIBUTING.md, clear architecture docs
- Benchmark posts: TraekEngine performance at 1k, 10k, 100k nodes
- Security: Publish security.md, SOC2 roadmap, architecture decision records
- Community: Discord activity, GitHub Discussions, visible maintainer engagement

**Pillar 4: Integration stories**
Show what "production" actually looks like for teams using træk.

- Integration guides: træk + OpenAI streaming, træk + Anthropic, træk + LangChain
- Video walkthroughs: "From npm install to production canvas in 60 minutes"
- Community templates: Starter repos for common use cases

---

### 1.2 — Channel Strategy

| Channel | Purpose | Cadence |
|---|---|---|
| Blog (gettraek.com/blog) | Long-form technical credibility | 2x month |
| LinkedIn | Enterprise buyer awareness | 3x week |
| Twitter/X | Developer community | Daily |
| GitHub | Developer trust, open source signals | Continuous |
| Hacker News | Developer acquisition (Show HN, Ask HN) | 2-3x quarter |
| Conference talks | Category leadership | 2x year |
| Partner content | API provider co-marketing | Quarterly |
| Newsletter | Nurture (library downloaders to enterprise) | Monthly |

---

### 1.3 — Content Calendar (Q1 2026)

**Week 1-2 (now):**
- [ ] Publish blog post 1: "Why linear chat is the wrong UI for LLMs"
- [ ] Publish blog post 3: "Introducing the træk Playground"
- [ ] LinkedIn: 3 posts about spatial AI and branching conversations
- [ ] GitHub: Ensure README, CONTRIBUTING.md, and docs are polished

**Week 3-4:**
- [ ] Publish blog post 2: "Building a spatial canvas with Svelte 5"
- [ ] LinkedIn: ROI calculator teaser + enterprise page announcement
- [ ] Hacker News: Show HN — træk launch thread
- [ ] Twitter: Thread on "things we learned building a spatial canvas"

**Month 2:**
- [ ] Case study draft: First enterprise customer (or aspirational template)
- [ ] Video: 15-min integration walkthrough (npm install to production)
- [ ] Integration guides: træk + OpenAI, træk + Anthropic (dedicated docs pages)
- [ ] LinkedIn: 2x week enterprise-focused content (pain, cost, alternatives)
- [ ] Benchmark post: TraekEngine performance at scale

**Month 3:**
- [ ] Conference talk submission: Svelte Summit / AI Engineer World's Fair / Config
- [ ] Partnership pitch: OpenAI developer relations + Anthropic partnerships
- [ ] Newsletter launch: "The spatial AI canvas" (monthly, ~500 word, dev-focused)
- [ ] Community content: First community template / starter kit
- [ ] LinkedIn: Enterprise case study teaser when first customer available

---

### 1.4 — SEO + Inbound Strategy

**Target keywords (enterprise intent):**
- "AI conversation UI library"
- "branching chat interface"
- "spatial AI interface"
- "LLM UI component"
- "conversational AI frontend"
- "streaming chat component svelte"
- "AI chat interface enterprise"

**Technical SEO priorities:**
- Docs site: Optimized per-concept pages (not just one big page)
- Integration guides rank for "[provider] + chat UI" queries
- Blog posts target "how to build spatial/branching AI chat" queries
- npm README has strong keywords for npm/GitHub search

**Content-driven SEO:**
- Pillar post: "The complete guide to building AI conversation interfaces" (2000+ words)
- Comparison post: "træk vs. building your own AI chat UI" (addresses direct competitor: inertia)

---

### 1.5 — Metrics

| Metric | Target (Month 3) | Notes |
|---|---|---|
| Blog monthly unique visitors | 2,000 | Track via Plausible/Fathom |
| npm weekly downloads | 500 | Organic library discovery |
| Enterprise demo requests / month | 10 | Form on /enterprise page |
| GitHub stars | 500 | Social proof signal |
| LinkedIn followers | 1,000 | Company page |
| Newsletter subscribers | 300 | Developer nurture pool |

---

## Part 2 — Trial-to-Enterprise Upgrade Path

### Overview

The natural motion for træk is:
1. Developer discovers træk via npm, GitHub, or content
2. Installs and evaluates the free MIT core
3. Hits a feature limitation (needs collab, analytics, or white-label)
4. Starts a trial of the Team or Enterprise plan
5. Team decides to upgrade and becomes a paying customer

---

### 2.1 — Trial Configuration

**Default trial:**
- Duration: 14 days
- Modules unlocked: All 4 premium (collab, analytics, export, whitelabel)
- License: Time-limited build key
- No credit card required
- Access: Via Playground or npm package with trial key

**Enterprise trial (for qualified leads):**
- Duration: 30 days (extendable to 60 days)
- Modules unlocked: All + dedicated support channel
- License key: Tied to company email domain
- Includes: 2h kickstart session with træk engineer
- Access: Direct email to enterprise@gettraek.com or via demo call

---

### 2.2 — Trial Onboarding Email Sequence

**Day 0 — Trial Start:**

Subject: Your træk trial is ready

```
Hi [Name],

Your træk trial is active — all premium modules are unlocked for 14 days.

Here's where to start:
-> Quickstart guide: gettraek.com/docs/quickstart
-> Your trial key: [KEY]
-> Integration time estimate: 1-2 days for a basic setup

If you're evaluating for a team, I'm happy to do a 30-minute live
technical walkthrough. Just reply here and we'll find a time.

[Founder name]
træk
```

**Day 2 — First use check:**

Subject: træk trial — quick check-in

```
Hi [Name],

Checking in — did you get træk running?

Most people hit one of these in the first day:
1. Svelte version compatibility (we're Svelte 5 only)
2. Streaming setup (we have specific patterns for OpenAI vs. Anthropic)
3. Custom node types (more flexible than they look — happy to walk through)

If you hit anything, just reply. I check these personally.

If you want to see it in context of your product: we can do a 20-minute
live session where I show you how other teams in [their space] have
integrated it.

[Name]
```

**Day 7 — Midpoint:**

Subject: træk trial — halfway point

```
Hi [Name],

You're halfway through your trial. Quick questions:

1. What have you built so far?
2. What's blocking you from deciding?
3. Is this for a team decision or an individual one?

If you're getting close to a decision, we should talk. Happy to:
-> Scope the right plan for your team
-> Answer security/compliance questions
-> Discuss custom licensing if standard plans don't fit
-> Extend the trial if you need more time

[Name]
```

**Day 12 — Pre-expiry:**

Subject: Your træk trial expires Friday

```
Hi [Name],

Your trial ends in 2 days. A few options:

-> If you're ready to upgrade: [link to pricing]
   Use code TRIAL14 for 20% off your first 3 months.

-> If you need more time: reply here. We can extend by 2 weeks,
   no questions asked.

-> If it's not the right fit: that's OK too. Tell me why —
   it helps us build a better product.

[Name]
```

**Day 14 — Trial end:**

Subject: Your træk trial has ended

```
Hi [Name],

Your 14-day trial has ended. The premium features are now locked,
but the MIT core is still yours forever.

If you want to continue with premium:
-> Team ($99/mo): gettraek.com/pricing
-> Enterprise (custom): enterprise@gettraek.com

If you want to talk through the decision, I'm available.
If the timing isn't right, I'll follow up in 30 days.

[Name]
```

---

### 2.3 — Qualifying for Enterprise

**Enterprise qualification criteria (any one of these):**
- Annual contract value >$5k/year
- >5 developers using træk
- Needs custom licensing, IP indemnification, or on-premise options
- Requires SLA, SOC2 docs, or GDPR DPA
- B2B product where træk is a core dependency (OEM/embedding use case)

**Qualification questions (ask during first call):**
1. How many developers will be integrating træk?
2. Is this for an internal tool or a product you ship to customers?
3. Do you have security review requirements (SOC2, GDPR, pen test)?
4. Do you need a custom license agreement?
5. What's your deployment model (cloud, self-hosted, air-gapped)?

---

### 2.4 — Enterprise Sales Process

```
Stage 1: Trial start / inbound lead
  Trigger: Playground trial, demo request, enterprise@gettraek.com email
  Action: Personal email within 24h, offer kickstart session
  Goal: Discovery call booked

Stage 2: Discovery call (30 min)
  Understand: team size, use case, technical stack, timeline, budget
  Demonstrate: canvas demo tailored to their use case
  Qualify: enterprise criteria met?
  Goal: Technical eval scoped

Stage 3: Technical evaluation
  Duration: 2-4 weeks
  Support: Dedicated Slack Connect channel (Enterprise trials)
  Resources: Custom integration guide, kickstart session if needed
  Goal: Technical sign-off from engineering

Stage 4: Commercial negotiation
  Pricing: $5k-50k/year based on team size + modules + support level
  Contract: Custom license agreement, MSA, DPA as needed
  Timeline: 2-4 weeks for legal review (larger companies)
  Goal: Signed contract

Stage 5: Onboarding
  Welcome call with træk engineer
  Dedicated Slack Connect channel
  Custom integration kickstart (included in contract)
  30/60/90 day check-ins
  Goal: Production deployment
```

---

### 2.5 — Conversion Incentives

**Trial-to-paid:**
- 20% off first 3 months (code: TRIAL14) — Team plan
- Kickstart session free for annual Enterprise contracts
- Extended trial (30 days) for serious enterprise evaluations

**Annual vs. monthly:**
- Monthly: Starter $29/mo, Team $99/mo
- Annual: 2 months free (16.7% discount)
- Enterprise: Annual contracts only (invoice billing, net-30/60)

---

## Part 3 — Account Management Playbook (>$20k/year)

### Overview

Customers paying >$20k/year are enterprise partnerships, not subscriptions.
They need active management: regular touchpoints, advocacy within their org,
renewal planning, and early warning signals.

One unhappy enterprise customer costs more in reputation and referrals
than the contract value. One happy enterprise customer is a case study,
a reference, and a source of expansion revenue.

---

### 3.1 — Enterprise Customer Tiers

| Tier | ARR | Touch model | Owner |
|---|---|---|---|
| Startup Enterprise | $5k-$20k/year | Low-touch (Slack + async) | Founder |
| Growth Enterprise | $20k-$50k/year | Mid-touch (monthly calls) | Founder + engineer |
| Strategic | >$50k/year | High-touch (weekly sync, dedicated engineer) | Founder |

---

### 3.2 — Onboarding Playbook (First 90 Days)

**Week 1 — Technical onboarding:**
- [ ] Welcome email from founder with direct contact
- [ ] Dedicated Slack Connect channel created and invited
- [ ] Integration kickstart call scheduled (2h, with træk engineer)
- [ ] Custom integration guide delivered (specific to their stack)
- [ ] Trial key converted to production license key

**Week 2-4 — Integration support:**
- [ ] Check-in: Is the integration running in staging?
- [ ] Address any technical blockers (async via Slack or Zoom)
- [ ] Review their custom node types / theming implementation
- [ ] Confirm streaming setup is correct

**Month 2 — Production readiness:**
- [ ] Check-in: Are they in production?
- [ ] Review their usage patterns (are they using the right modules?)
- [ ] Proactive: Any upcoming releases from træk they should know about?
- [ ] Document their use case for internal case study (with permission)

**Month 3 — First QBR (Quarterly Business Review):**
- [ ] Review: What did they build? What works? What doesn't?
- [ ] Usage: Are they getting value from all modules they're paying for?
- [ ] Roadmap: What do they need next? What's on træk's roadmap?
- [ ] Expansion: Could they use additional modules? More seats?
- [ ] Reference: Would they be willing to be a case study or reference customer?

---

### 3.3 — Ongoing Touchpoints

**Startup Enterprise ($5k-$20k/year):**
- Slack Connect: respond within 4h on business days
- Monthly newsletter: product updates, new guides, community highlights
- Quarterly check-in: async survey or 15-min call
- Annual renewal: 60-day notice, offer renewal incentive (10% off)

**Growth Enterprise ($20k-$50k/year):**
- Slack Connect: respond within 2h on business days
- Monthly 30-min call with founder or designated engineer
- Priority bug fixes: 24h SLA standard, 4h critical
- QBR: Quarterly 45-min business review
- Roadmap preview: Share upcoming releases early for feedback
- Annual renewal: 90-day notice, founder-to-founder conversation

**Strategic (>$50k/year):**
- Dedicated Slack Connect with træk engineer
- Weekly 30-min sync (engineering or product level)
- Critical SLA: 4h response, 24h resolution
- Dedicated engineer: named contact who knows their codebase
- Early access: New features before general release
- Executive QBR: Quarterly with founder and their VP/CTO
- Custom development: Roadmap items can be prioritized or custom-built
- Annual renewal: 120-day notice, multi-year options offered

---

### 3.4 — Health Signals

**Green (healthy):**
- Using træk in production
- Regular activity in Slack channel
- Asking about new features or roadmap
- Referring other companies

**Yellow (at-risk — intervene within 48h):**
- No Slack activity for 2+ weeks
- Not yet in production after 60 days
- Support tickets increasing without resolution
- Asking about competitors or alternatives
- Key champion left the company

**Red (likely to churn — escalate immediately):**
- Explicitly asking about cancellation
- No production deployment after 90 days
- Multiple unresolved critical bugs
- Asking for refund or contract exit

**Intervention:**

Yellow signal:
```
-> Founder reaches out personally within 24h
-> Schedule a 30-min call within 1 week
-> Understand the specific issue
-> Assign a dedicated engineer if technical
-> Offer roadmap commitments if it's a missing feature
-> Follow up in 2 weeks
```

Red signal:
```
-> Founder calls (not emails) within 4h
-> Offer a 30-day extension to resolve the issue
-> Present a resolution plan in writing within 48h
-> If loss is inevitable, request a retrospective call — learn from it
```

---

### 3.5 — Expansion and Upsell

**Natural expansion triggers:**
- Team grows past 10 developers -> upgrade tier
- New product line needs white-label -> add @traek/whitelabel
- Launching collaboration features -> add @traek/collab
- Scaling to multiple projects -> enterprise unlimited seats

**Expansion script:**
```
"I noticed you've added [N] more developers since we started.
You're approaching the limit on your current plan.
Before you hit it, I wanted to talk about upgrading and what that looks like
for your contract. Happy to make this seamless — when's a good time?"
```

**Multi-year proposal:**
- 2-year: 15% discount on ARR
- 3-year: 20% discount on ARR
- Offer proactively at 90-day renewal window for healthy accounts

---

### 3.6 — Renewal Playbook

**90 days before renewal:**
- [ ] Review account health (green/yellow/red)
- [ ] Schedule renewal conversation
- [ ] Prepare renewal brief: usage summary, value delivered, upcoming roadmap

**60 days before renewal:**
- [ ] Renewal conversation: Present contract renewal options
  - Same terms (1 year)
  - Multi-year discount (2-3 year, 15-20% off)
  - Tier upgrade if usage warrants
- [ ] Deliver renewal brief with ROI summary

**30 days before renewal:**
- [ ] Follow up if not yet signed
- [ ] Early renewal bonus: e.g., extra month free or kickstart session
- [ ] Escalate to founder if deal is at risk

**After renewal:**
- [ ] Thank you from founder (personal email or call)
- [ ] Confirm new contract terms and key dates
- [ ] Roadmap preview for next year

---

### 3.7 — Reference and Advocacy Program

**Reference tiers:**
1. **Private reference**: Customer takes reference calls from prospects (most common)
2. **Case study**: Written case study published on gettraek.com
3. **Public advocate**: Conference talk, joint blog post, public quote

**How to ask:**
```
"You mentioned [positive outcome] — would you be willing to be a reference
for prospects in similar situations? It's just an occasional call (30 min, rare)
where you tell them what your experience has been like. No prep required."

[If yes:]

"Would you also be open to a brief case study? We'd do all the writing —
you'd just review it. The headline would be something like
'[Company] shipped [feature] in [timeframe] with træk.'"
```

**Reference incentives:**
- Written case study: 3 months free on current plan
- Conference talk (joint): Sponsor conference registration or travel
- Joint blog post: Heavy promotion across all channels with attribution

---

*End of TRK-22 enterprise sales motion deliverables.*
