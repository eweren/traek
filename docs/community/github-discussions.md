# træk GitHub Discussions — Setup & Guidelines

Internal reference for enabling and running GitHub Discussions for træk.

---

## Enabling Discussions

1. Go to **github.com/gettraek/traek → Settings → General**
2. Scroll to **Features** section
3. Check **Discussions** and save

Once enabled, a **Discussions** tab appears in the repository navigation.

---

## Discussion Categories

Set up the following categories (Settings → Discussions → Edit categories):

| Category | Emoji | Format | Description |
|----------|-------|--------|-------------|
| Announcements | :mega: | Announcement | Maintainer-only: releases, blog posts |
| Q&A | :question: | Q&A | Questions with accepted answers |
| Ideas | :bulb: | Open-ended | Feature proposals and design discussions |
| Show and Tell | :eyes: | Open-ended | Projects built with træk |
| General | :speech_balloon: | Open-ended | Anything else |

**Announcement category**: Set so only maintainers can create new posts (check "Maintainers only" for this category).

---

## Pinned Discussions

Pin the following discussions at launch:

1. **Welcome to træk Discussions** — brief intro, links to docs, CONTRIBUTING.md, Discord
2. **Roadmap & Feedback** — link to public roadmap, invite comments on priorities
3. **Show Your Project** — dedicated thread for community to share builds

---

## Moderation

- Q&A answers should be marked as "answered" by maintainers within 48h where possible
- Ideas with significant community support (`+10 upvotes`) should be promoted to a GitHub issue with the `enhancement` label
- Duplicate questions should be closed with a link to the canonical thread
- Spam and off-topic posts: close and hide immediately

---

## Linking Discussions to Issues

When a Discussion in **Ideas** leads to implementation:

1. Create a GitHub issue with `enhancement` or `good first issue` label
2. Comment on the discussion: "We've opened [#issue-number] to track this. Thanks for the suggestion!"
3. Close the discussion (it lives on as the design context for the issue)

---

## Promoting Discussions

- Reference GitHub Discussions in `CONTRIBUTING.md` ✓ (already done)
- Link from the README under "Community"
- Link from the docs site footer and the Discord `#help` pinned message
- Mention in release notes: "Share feedback in Discussions"

---

## Metrics to Track (Monthly)

- New discussions opened
- Q&A questions answered within 48h (target: >80%)
- Ideas that graduated to issues
- Show and Tell posts
