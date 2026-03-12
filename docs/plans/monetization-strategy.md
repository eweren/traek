# Monetization Strategy: Træk

**Author**: UX Expert
**Date**: 2026-03-07
**Status**: Draft for review
**Related**: TRK-15

---

## Recommended Model: Open-Core

**Recommendation: Open-Core**, not fully OSS.

| Layer | License | Rationale |
|---|---|---|
| `@traek/svelte` core library | MIT | Drives adoption, ecosystem, inbound leads |
| `@traek/collab` collaboration | MIT (self-host) | Community feature; hosted version is paid |
| `@traek/whitelabel` theming kit | Commercial | Enterprise sales channel |
| Playground (hosted app) | Proprietary SaaS | Direct monetization via subscriptions |
| Hosted MCP server | Proprietary | Future revenue stream |

The core library stays fully open. Revenue comes from hosted services and enterprise packages — the same model used by TipTap, Liveblocks, and BlockNote. Developers adopt the free library; organizations pay for hosted infrastructure and premium tooling.

---

## User Journey Map: Free -> Paid

### Stage 1: Discovery (Developer)
```
npm install @traek/svelte -> reads docs -> tries demo -> builds prototype
```
- Arrives via GitHub, npm, blog post, or dev social
- First touch: README or playground demo
- Goal: evaluate the library for their project
- No friction, no paywall, no account required

**UX principle**: zero-friction discovery. Any paywall at this stage kills adoption.

### Stage 2: First Use (Playground)
```
Visits playground -> creates account (or anon) -> tries 5 conversations -> hits limit
```
- Uses canvas for personal AI conversations
- Experiences branching, spatial layout, streaming
- 5-conversation limit is generous enough to feel value, tight enough to upgrade

**Key moment**: When a user deletes an old conversation to make room for a new one -- they are ready to upgrade. This is the highest-intent upgrade trigger.

### Stage 3: Upgrade Decision Point
```
Hits free limit -> sees upgrade modal -> evaluates $12/mo vs. value received
```
- Modal triggered: "You've reached the free limit"
- Current message: good, factual
- **Improvement needed**: show what they'll lose (their 5 conversations won't be deleted) and what they'll gain (specific features)
- Upgrade to Pro: $12/mo

### Stage 4: Pro User -> Team Upgrade
```
Pro user shares a link -> colleague wants to collaborate -> needs Team tier
```
- Sharing feature surfaces collab need organically
- Team upgrade trigger: when a Pro user tries to start a collab session
- Viral loop: shared conversations bring new users into the funnel

### Stage 5: Enterprise / Library Adopter
```
Developer embeds @traek/svelte -> wants branded loading screens -> needs @traek/whitelabel
```
- Enterprise theming requires commercial license
- White-label customers are high-value, low-volume
- Direct sales channel, not self-serve

---

## Feature Gating Strategy

### Always Free (Core Library + Playground)
- Full `@traek/svelte` library: all features, MIT license
- `@traek/collab` self-hosted: MIT license
- Playground: 5 conversations, local storage only, BYOK
- Full canvas: pan/zoom, branching, streaming, markdown
- Public documentation, community support

**Principle**: never gate core canvas functionality. The canvas IS the product. If it feels crippled on free, word-of-mouth dies.

### Pro ($12/mo)
- Unlimited conversations
- Cloud sync + backup
- Public sharing links (`/share/{token}`)
- Conversation export (JSON, markdown)
- Priority support

**Gate rationale**: these all require server infrastructure (storage, CDN, compute). Gating them is economically necessary and users understand why.

### Team ($25/seat/mo, min 3 seats)
- Everything in Pro
- Real-time collaboration (`@traek/collab` hosted server)
- Shared workspace: team conversation library
- Multi-user cursors, presence, branching attribution
- Team admin panel + member management
- SSO (SAML/OIDC)

**Gate rationale**: collab requires a WebSocket server (Yjs/CRDT infra). This is genuinely expensive to host. The value proposition is clear.

### Enterprise (Custom)
- Everything in Team
- `@traek/whitelabel` commercial license
- Custom domain / white-label
- Dedicated instance (data residency)
- SLA + priority support SLA
- Onboarding + training
- Custom billing

**Gate rationale**: brand customization is a high-value enterprise need. The whitelabel package already exists. License it commercially.

---

## Friction Points (Current State)

### 1. Hard Conversation Limit (Medium friction)
- **Problem**: The 5-conversation limit is invisible until you hit it. Users only see the counter in the sidebar badge ("Free 3/5").
- **Fix**: Show the counter from conversation 1. Make it ambient, not alarming.
- **Fix**: When at 4/5, show a soft nudge: "1 conversation slot remaining -- upgrade for unlimited"

### 2. Upgrade Modal Phrasing (Low friction, fixable)
- **Problem**: "You've reached the free limit" feels punitive. "cloud sync, export, and public sharing links" is an upsell list, not a value statement.
- **Better copy**: "Your 5 local conversations are full. Upgrade to Pro -- your conversations sync to the cloud, and you can create as many as you need. $12/month, cancel any time."

### 3. No In-App Upgrade Path for Sharing (High friction, conversion killer)
- **Problem**: A free user who wants to share a conversation hits a wall with no graceful fallback.
- **Fix**: Show a "Share" button on all tiers, but when a free user clicks it, show an inline upgrade prompt: "Sharing requires Pro -- get a public link anyone can view."

### 4. Collab Is Not Discoverable (Medium friction)
- **Problem**: `/collab/:roomId` exists but there's no entry point in the main app. Users can't discover this feature organically.
- **Fix**: Add a "Collaborate" option to the conversation context menu (visible to Pro+). Team users see "Invite collaborators." Free users see it greyed out with a tooltip.

### 5. Free Tier Account Requirement (Potential friction)
- **Current**: App requires signin (`redirect(302, '/auth/signin')`).
- **Risk**: Requiring signup before value delivery increases drop-off.
- **Recommendation**: Allow 1-2 conversations with no account (anonymous local session), then gate account creation to sync or save beyond the session.

---

## Upgrade Triggers (Moments to Prompt)

These are the highest-intent moments to surface an upgrade prompt:

| Trigger | User Signal | Prompt Type |
|---|---|---|
| 4th conversation created | Approaching limit | Soft banner: "1 slot left" |
| 5th conversation attempt | Hit hard limit | Modal: upgrade to continue |
| Share button clicked (free) | Wants to share | Inline prompt in share modal |
| Collab button clicked (free) | Wants collaboration | Inline prompt with team pitch |
| Export attempted (free) | Values their work | Inline prompt: "Save forever with Pro" |
| After 3rd session (logged in, free) | Recurring user | Toast: "Enjoying træk? Unlimited is $12/mo" |
| Conversation reaches 50+ nodes | Power user | Toast: "You're a power user -- unlock cloud backup" |

**Principle**: upgrade prompts should appear at moments of **peak value realization**, not peak frustration. The best time to ask for money is when the user has just accomplished something meaningful.

---

## Pricing Research: Comparable Tools

| Product | Free | Pro | Team | OSS Library |
|---|---|---|---|---|
| Traek (current) | 5 convos | $12/mo | -- | Yes (MIT) |
| TipTap | Free editor | $149/mo | Custom | Yes (MIT) |
| Liveblocks | 50 MAU | $99/mo | Custom | Yes (MIT) |
| Notion | Limited | $10/mo | $15/seat | No |
| Miro | 3 boards | $10/mo | $16/seat | No |
| Linear | 250 issues | $8/seat | $16/seat | No |

**Assessment**: $12/mo Pro is well-positioned for individual users. $25/seat Team is at the lower end of the market, justified by Traek's early-stage positioning.

**Recommended pricing**:
- Free: 5 conversations, local only (keep current)
- Pro: **$12/mo** (or $96/yr = 20% discount)
- Team: **$25/seat/mo** (min 3 seats) or $240/seat/yr
- Enterprise: custom (annual contract, min $5k ARR)

---

## Revenue Model Summary

```
OSS Library (@traek/svelte)
    ↓ drives adoption
Playground (hosted SaaS)
    ├── Free tier → conversion funnel
    ├── Pro ($12/mo) → individual power users
    └── Team ($25/seat) → small teams, startups
Enterprise (@traek/whitelabel + custom)
    └── companies embedding traek in products
Hosted MCP (@traek/mcp cloud)
    └── future: hosted AI workflow integration
```

**Priority for Q1 2026**: Nail the Free->Pro conversion. Fix the 3 high-friction points above. Ship Team tier with collab. Measure conversion rate; target 3-5% free-to-paid.

---

## Recommended Next Actions (UX Scope)

1. Fix upgrade modal copy -- lead with user's pain, not feature list (1 day)
2. Add ambient conversation counter visible from conversation 1 (1 day)
3. Add sharing upgrade prompt for free users with inline CTA (1 day)
4. Make collab discoverable via tier-aware context menu entry (2 days)
5. Evaluate anonymous trial mode -- measure drop-off at auth wall (research)
