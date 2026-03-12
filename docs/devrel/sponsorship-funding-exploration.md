# Træk Sponsorship & Funding Exploration

**Status:** Planning document — execute when traction warrants (see triggers below)
**Owner:** CMO
**Last updated:** 2026-03-08

---

## Traction Triggers

Execute each funding track when these signals are met:

| Track | Trigger |
|-------|---------|
| GitHub Sponsors | 100+ GitHub stars + 3+ open issues from external contributors |
| Open Collective | 500+ npm weekly downloads + 5+ active community members |
| VC / Grant exploration | 2,000+ npm weekly downloads + enterprise inquiries + 1+ paying pilot |

---

## Track 1: GitHub Sponsors

### Overview
GitHub Sponsors allows individuals and organizations to financially support open-source maintainers directly through GitHub. Zero transaction fees (GitHub covers them). Payments via Stripe.

### Setup Steps

1. **Enable GitHub Sponsors** on the `traek-dev` GitHub organization
   - Go to: `github.com/organizations/traek-dev/settings/sponsors`
   - Requires US bank account or Stripe-compatible country
   - Verification takes 1–2 weeks

2. **Create sponsor tiers** (recommended structure):

   | Tier | Monthly | Benefits |
   |------|---------|---------|
   | Supporter | $5 | Name in README contributors section |
   | Contributor | $25 | Name in README + Discord "Sponsor" role |
   | Sustainer | $100 | Name in README + priority issue triage |
   | Bronze Sponsor | $250 | Logo in README + website |
   | Silver Sponsor | $500 | Logo in README + website + blog mention |
   | Gold Sponsor | $1,000 | Logo in README + website + blog + monthly call |
   | Platinum Sponsor | $2,500+ | Custom partnership — contact us |

3. **Create `.github/FUNDING.yml`** in the repo root:
   ```yaml
   github: traek-dev
   open_collective: traek
   custom: ['https://gettraek.com/sponsor']
   ```

4. **Add sponsor section to README** with shields and sponsor logos
5. **Post announcement** on X/Twitter, LinkedIn, Discord, Svelte community

### Realistic Revenue Expectations

- Early stage (100–500 stars): $100–500/month
- Growth stage (1k+ stars): $500–2,000/month
- Maturity (5k+ stars, active ecosystem): $2,000–10,000/month

*Reference: Vite raised ~$30k/month at peak; smaller ecosystem tools average $500–3k/month.*

---

## Track 2: Open Collective

### Overview
Open Collective provides transparent, community-managed funding with full financial transparency (all income/expenses public). Best for projects with an active community that wants governance visibility.

### When to Use Open Collective vs. GitHub Sponsors

| Factor | GitHub Sponsors | Open Collective |
|--------|----------------|-----------------|
| Individual sponsorship | ✅ Primary | ✅ Supported |
| Corporate sponsorship | ✅ Supported | ✅ Strong |
| Financial transparency | ❌ Private | ✅ Fully public |
| Community governance | ❌ No | ✅ Yes |
| Fiscal host required | ❌ No | ✅ Yes (e.g. Open Source Collective) |
| Transaction fees | 0% (GitHub covers) | 10% platform + 5–8% host |

**Recommendation:** Run both in parallel. GitHub Sponsors for individuals; Open Collective for corporate sponsors who require invoices and public accountability.

### Setup Steps

1. **Apply to Open Source Collective** as fiscal host at `opencollective.com/opensource/apply`
   - Requirements: OSS license (MIT ✅), public repository ✅
   - Approval: ~1 week

2. **Create collective** at `opencollective.com/traek`
   - Add description, goals, and budget targets
   - Link GitHub repository for automatic backer recognition

3. **Set up expense policy** — who can submit expenses and for what:
   - Infrastructure costs (hosting, domain, CI/CD)
   - Conference travel for speakers representing Træk
   - Design/writing bounties for contributors
   - Core maintainer stipends (when revenue warrants)

4. **Add "Backed by Open Collective" badge** to README

### Budget Planning (example at $2,000/month OCF revenue)

| Category | Amount | Notes |
|----------|--------|-------|
| Infrastructure | $200 | Hosting, CI, npm, domains |
| Maintainer stipends | $1,000 | Split among active maintainers |
| Design bounties | $400 | Commissioned design work |
| Conference travel | $400 | 1–2 talks/year |

---

## Track 3: VC & Grant Exploration

### Overview
VC funding is appropriate if Træk evolves from a library into a product company (e.g., hosted Træk, Træk Enterprise). Grants are appropriate now for open-source sustainability.

### Grants (Execute First — Lower Barrier)

#### Sovereign Tech Fund (Germany)
- **Focus:** Critical open-source infrastructure in Europe
- **Grant size:** €50,000–500,000
- **Eligibility:** OSS with significant usage; security/digital sovereignty angle
- **Apply:** `sovereigntechfund.de/programs/bug-resilience`
- **Timeline:** Quarterly rounds; 3–6 month review
- **Træk angle:** Decentralized AI interface tooling; not controlled by major AI companies

#### GitHub Accelerator
- **Focus:** 10 selected OSS projects per cohort
- **Grant:** $20,000 USD + 10 weeks mentorship
- **Apply:** Annual application (typically Q4)
- **Træk angle:** Developer tooling, AI ecosystem, Svelte/Vite community

#### Gitcoin Grants
- **Focus:** Web3-adjacent OSS (less relevant unless Træk adds decentralized AI angle)
- **Skip for now** unless product pivots

#### NLnet Foundation
- **Focus:** Internet architecture, privacy, open standards
- **Grant size:** €5,000–50,000
- **Apply:** `nlnet.nl/funding`
- **Træk angle:** Open protocol for AI conversation interfaces; MCP integration

#### Mozilla Open Source Support (MOSS)
- **Focus:** OSS projects aligned with Mozilla's mission
- **Grant size:** $10,000–500,000
- **Apply:** Rolling applications
- **Træk angle:** Open AI interfaces, privacy-preserving AI UX

### VC Exploration (Execute When Traction Warrants)

**Trigger:** 10,000+ npm weekly downloads + enterprise interest + product layer emerging

#### Target Investor Profiles

1. **OSS-native VCs:**
   - Amplify Partners (dev tools focus)
   - Heavybit (developer-first companies)
   - Boldstart Ventures (infra/OSS)
   - OSS Capital (COSS — Commercial Open Source)

2. **AI tooling VCs:**
   - a16z (AI team)
   - Sequoia (AI infrastructure)
   - Gradient Ventures (Google's AI fund)

3. **Product angle for VC pitch:**
   - Open-core model: free library + Træk Cloud (hosted, team features)
   - Enterprise: on-prem deployment, SSO, audit logs, usage analytics
   - API: Træk-as-a-Service for embedding conversation canvas in SaaS products

#### Pre-VC Milestones Checklist
- [ ] 10k+ GitHub stars
- [ ] 3+ paid enterprise pilots
- [ ] Clear monetization path documented
- [ ] Team of 2+ full-time equivalents
- [ ] $10k+ MRR (or credible path)
- [ ] Legal entity established (Delaware C-Corp recommended for US VC)

---

## Immediate Actions (Do Now, Before Traction)

These cost nothing and should be done now:

1. **Add `FUNDING.yml`** to the repo (`github: [traek-dev]`) — signals intent
2. **Reserve `opencollective.com/traek`** — claim the namespace
3. **Draft sponsor prospectus** — one-pager PDF for corporate inquiries
4. **Add sponsor section placeholder** to README and gettraek.com
5. **Research Sovereign Tech Fund** application requirements — best near-term grant fit

---

## Risk & Considerations

- **Premature monetization** can harm community trust — lead with open source values
- **Funding transparency** matters to developers; prefer Open Collective over opaque arrangements
- **VC alignment risk:** VC incentives (10x returns) may conflict with OSS-first mission — if VC, choose OSS-aligned investors
- **License protection:** Ensure MIT license is intentional; if commercial pressure grows, consider AGPL for future versions to prevent corporate free-riding without contribution

---

## Recommended Priority Order

1. **Now:** `FUNDING.yml` + reserve OpenCollective namespace + draft sponsor prospectus
2. **At 100 stars:** Enable GitHub Sponsors
3. **At 500 stars:** Apply for GitHub Accelerator + NLnet
4. **At 500 npm/week:** Launch Open Collective
5. **At 2k npm/week:** Apply to Sovereign Tech Fund
6. **At 10k npm/week + enterprise:** Explore VC
