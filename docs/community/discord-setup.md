# træk Discord Server — Setup & Moderation Guide

Internal reference for maintaining the træk Discord community.

---

## Server Structure

### Channels

| Channel | Purpose |
|---------|---------|
| `#announcements` | Official releases, blog posts, major updates. Maintainer-only posting. |
| `#general` | General discussion about træk and spatial AI UIs |
| `#help` | Technical support — questions about integration, bugs, configuration |
| `#show-and-tell` | Community members share projects built with træk |
| `#feature-requests` | Discussion of proposed features (linked to GitHub Discussions) |
| `#dev` | Internal dev coordination (maintainers only) |
| `#random` | Off-topic community chat |

### Roles

| Role | Criteria |
|------|---------|
| `Maintainer` | Core team — can post to `#announcements`, manage roles |
| `Contributor` | Merged at least one PR — assigned manually after merge |
| `Member` | Default role for all joined members |

---

## Onboarding Flow

When a new member joins:

1. Auto-welcome message in `#general` (via bot): "Welcome to træk! Spatial AI canvas for developers. Find help in #help, share projects in #show-and-tell, and read our contribution guide at github.com/gettraek/traek/blob/main/CONTRIBUTING.md"
2. Pinned message in `#help` links to docs and GitHub Discussions
3. New members do not need to verify — open community

---

## Moderation Guidelines

### Tone

The træk community is technical and developer-focused. Maintain a tone that is:

- Direct and helpful (skip filler phrases)
- Welcoming to newcomers asking basic questions
- Constructive when giving feedback on projects

### Moderation principles

- **First offense**: Polite private message explaining the issue
- **Repeated violations**: Warning in public channel + temporary mute (24h)
- **Severe violations** (harassment, spam, doxxing): Immediate ban

### What to moderate

- Spam and self-promotion (especially from bots or new accounts)
- Off-topic links unrelated to AI or development
- Harassment or disrespectful language
- Posting of API keys, secrets, or personal data

### Bot configuration (recommended)

- **MEE6** or **Carl-bot** for auto-moderation (link spam, repeated messages)
- **Dyno** for role management and welcome messages
- Set a slowmode of 2s on `#help` to reduce spam

---

## Content Calendar

| Frequency | Action |
|-----------|--------|
| Every release | Post changelog summary to `#announcements` |
| Weekly | Share one community project in `#show-and-tell` (if available) |
| Monthly | Ask for feedback in `#general` (open-ended prompt) |
| Quarterly | Community survey (linked from `#announcements`) |

---

## Linking Discord to GitHub

- Webhook in `#announcements`: GitHub release events → auto-post release notes
- Webhook in `#dev`: GitHub PR opened/merged events for core packages
- All feature requests discussed in `#feature-requests` should be promoted to GitHub Discussions with a link back to the Discord thread

---

## Invite Link

Use a permanent invite link (no expiry, 0 max uses) pinned in the README and docs.

Current invite: `discord.gg/traek`

To regenerate: Server Settings → Invites → Create a new invite with "Never expire" selected.
