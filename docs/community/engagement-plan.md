# træk Community Engagement Plan

A living document for growing the træk contributor and user community. Owned by CMO.

---

## North Star

Build a self-sustaining developer community where external contributors fix bugs, write documentation, and create adapters — reducing the core team's maintenance load while spreading træk to more codebases.

**12-month targets:**
- 50 unique external contributors (merged PRs)
- 500 GitHub stars
- 200 Discord members
- 10 community-built integrations or demos

---

## Platform Setup Checklist

### GitHub (do at launch)

- [ ] Enable GitHub Discussions (Settings → General → Features → Discussions)
- [ ] Create Discussion categories: Announcements, Q&A, Ideas, Show and Tell, General
- [ ] Pin welcome discussion, roadmap thread, and "Show Your Project" thread
- [ ] Create labels: `good first issue`, `help wanted`, `documentation`, `accessibility`, `testing`, `enhancement`, `bug`, `i18n`
- [ ] Create starter `good first issue` issues (see `docs/community/good-first-issues.md`)
- [ ] Add `CONTRIBUTING.md`, issue templates, and PR template (done)
- [ ] Add `CODE_OF_CONDUCT.md` (link from `CONTRIBUTING.md`)

### Discord (do at launch)

- [ ] Create server with channels from `docs/community/discord-setup.md`
- [ ] Configure auto-welcome bot (MEE6 or Carl-bot)
- [ ] Set up roles: Maintainer, Contributor, Member
- [ ] Pin help links in `#help`
- [ ] Link Discord invite in README, CONTRIBUTING.md, and docs site

---

## Contributor Funnel

### Stage 1 — Discovery
New developers find træk via:
- Hacker News / Reddit posts at launch
- Conference talks (see `docs/community/conference-talks.md`)
- Blog posts and tutorials (DevTo, Hashnode, personal blogs)
- npm / GitHub organic search

**Action:** Ensure README answers "what is this and why should I use it" in the first 3 lines.

### Stage 2 — First interaction
Developer clones the repo, reads docs, tries the playground.

**Action:** Maintain zero-friction onboarding. `pnpm install && pnpm run dev` must work without extra config. Playground must load a working demo immediately.

### Stage 3 — First contribution
Developer fixes a small bug or improves documentation.

**Actions:**
- Keep `good first issue` queue at 5–10 open issues at all times
- Respond to new PRs within 48 hours
- Thank every contributor by name in the release changelog
- Assign `Contributor` Discord role after first merged PR

### Stage 4 — Recurring contributor
Developer becomes a regular — fixes bugs, reviews PRs, answers community questions.

**Actions:**
- Invite top contributors to a private `#contributors` Discord channel
- Offer co-authorship credit on blog posts for sustained contributions
- Consider granting triage permissions (label issues, close duplicates)

---

## Monthly Office Hours

**Format:** 45-minute Zoom call, open to anyone.
**Frequency:** Monthly, third Thursday at 18:00 CET.
**Agenda (rotating):**

1. (5 min) What shipped since last call
2. (15 min) Demo — community project or upcoming feature
3. (20 min) Open Q&A
4. (5 min) Good first issues walkthrough — point newcomers to starter tasks

**Logistics:**
- Announce in Discord `#announcements` and GitHub Discussions 1 week out
- Post Zoom link 24h before
- Record and post to YouTube (træk channel) within 48h
- Post summary in GitHub Discussions as a pinned post

**First call:** Schedule for ~4 weeks after public launch.

---

## Content Calendar

| Frequency | Channel | Content |
|-----------|---------|---------|
| Every release | GitHub Discussions, Discord `#announcements`, Twitter/X | Changelog summary |
| Weekly | Discord `#show-and-tell` | Share one community project (curated by maintainers) |
| Bi-weekly | Dev.to / Hashnode | Technical blog post (see devrel strategy) |
| Monthly | GitHub Discussions | "What are you building?" prompt thread |
| Monthly | Zoom | Office hours |
| Quarterly | GitHub | Community survey (linked from `#announcements`) |

---

## First-Timer Friendly Strategy

### Issue labeling

Always keep 5–10 open issues labeled `good first issue`. These must:
- Have a clear, scoped description with file references
- Estimate effort as "~20–100 lines"
- Not require deep knowledge of TraekEngine internals
- Include a "References" section with relevant files

Good first issue categories (from `docs/community/good-first-issues.md`):
- Missing i18n keys
- Missing `aria-label` / ARIA attributes
- Documentation examples and clarifications
- Test coverage for utility functions
- Hardcoded `--traek-*` CSS variables

### Onboarding comment

When a new contributor opens their first issue or PR, post a welcome comment:

> "Welcome to træk! If you have questions while working on this, drop by `#help` on Discord or add a comment here — we're happy to help."

### Mentorship for first PRs

For `good first issue` PRs:
- Review within 24h (not 48h standard)
- Leave encouraging, specific feedback — not just "LGTM"
- Offer a follow-up issue if the contributor wants to continue

---

## Recognition

- **CHANGELOG:** Credit all external contributors by GitHub handle in every release
- **Discord:** `Contributor` role after first merged PR; `Core Contributor` after 5+
- **README contributors section:** Add after reaching 10+ contributors (use `all-contributors` bot)
- **Blog posts:** Feature community builds in bi-weekly posts on DevTo

---

## Community Health Metrics (track monthly)

| Metric | Target (6mo) | Target (12mo) |
|--------|-------------|--------------|
| GitHub stars | 200 | 500 |
| Open issues avg age | < 14 days | < 7 days |
| PR review turnaround | < 48h | < 24h |
| `good first issue` open count | 5+ | 8+ |
| Discord members | 50 | 200 |
| External contributors (lifetime) | 15 | 50 |
| Monthly active Discussion posters | 10 | 40 |

---

## References

- `docs/community/discord-setup.md` — Channel structure, moderation, content calendar
- `docs/community/github-discussions.md` — Discussion categories, moderation, pinned posts
- `docs/community/good-first-issues.md` — Starter issue templates and label strategy
- `docs/community/events-strategy.md` — Conference talk submissions
- `CONTRIBUTING.md` — Developer contribution guide
- `.github/ISSUE_TEMPLATE/` — GitHub issue templates
- `.github/PULL_REQUEST_TEMPLATE.md` — PR template
