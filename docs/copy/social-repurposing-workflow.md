# Social Media Content Repurposing Workflow

_How to turn every piece of Træk content into multi-channel distribution_

---

## Overview

Every blog post, tutorial, and release note we publish gets repurposed into social-native formats before distribution ends. This workflow defines exactly what to produce for each content type and in what order.

**Goal:** 1 long-form piece → 5–8 social touchpoints with minimal additional effort.

---

## Content Types & Repurposing Matrix

| Source Content | X/Twitter Thread | LinkedIn Post | Dev.to Cross-post | Reddit | Discord | Newsletter Snippet |
|---------------|-----------------|---------------|-------------------|--------|---------|-------------------|
| Blog post (opinion) | ✓ | ✓ | ✓ | ✓ (r/sveltejs, r/reactjs) | ✓ | ✓ |
| Tutorial | ✓ | ✓ | ✓ | ✓ (r/javascript) | ✓ #showcase | ✗ |
| Release notes | ✓ | ✓ | ✗ | ✓ (r/programming) | ✓ #announcements | ✓ |
| Comparison post | ✓ | ✓ | ✓ | ✓ multiple subs | ✓ | ✓ |

---

## Step-by-Step Workflow

### Step 1 — Write the long-form piece first (1x effort)

Publish to `gettraek.com/blog` or `gettraek.com/tutorials`. This is the canonical source. Everything else links back to it.

**Don't write social posts first.** Long-form is the source of truth.

---

### Step 2 — Extract the "hook" (15 min)

Before any repurposing, identify:

1. **The counterintuitive insight:** What does this post say that surprises developers?
2. **The concrete outcome:** What can the reader build/do/understand after reading?
3. **The one-liner:** 140 characters that capture the value. (This becomes the tweet hook AND the LinkedIn opening line.)

**Example:**
- Post: "Build a Branching AI Chat in 15 Minutes"
- Hook insight: You can replace 6 hours of chat UI work with 15 minutes using Træk
- One-liner: "I replaced 6 hours of React chat UI work with 15 minutes. Here's exactly how."

---

### Step 3 — Write the X/Twitter Thread (30 min)

**Structure:**

```
Tweet 1 (Hook): [One-liner that stops the scroll]
Tweet 2: The problem this solves (1–2 sentences + image/gif if possible)
Tweet 3–6: Key steps / insights from the post (numbered, each self-contained)
Tweet 7: The "aha moment" or best code snippet
Tweet 8 (CTA): "Full tutorial → [link]" + "Star on GitHub → [link]"
```

**Rules:**
- Each tweet must stand alone — don't reference "the next tweet"
- One idea per tweet
- Use code blocks for any code (even single lines)
- Include at least one image (screenshot, diagram, or gif of the canvas)
- End with a question to drive replies: "What would you build with branching AI conversations?"

**Timing:** Post 1–2 days after the blog post goes live (let it index first).

---

### Step 4 — LinkedIn Post (20 min)

LinkedIn rewards longer posts. Don't just paste the tweet thread.

**Structure:**
```
[Hook line — same one-liner, but written for a professional audience]

[2–3 paragraph context: what problem this solves, for whom, why it matters now]

Here's the key insight: [pull the most quotable line from the blog post]

[Link to full post]

[3–5 relevant hashtags: #AI #WebDevelopment #OpenSource #SvelteJS #React]
```

**Timing:** Same day as the blog post, or same day as the Twitter thread.

---

### Step 5 — Dev.to Cross-post (45 min)

Dev.to cross-posts work best for tutorials and opinion pieces.

**Process:**
1. Copy the markdown from the blog post
2. Add the canonical URL in Dev.to's front-matter: `canonical_url: https://gettraek.com/blog/...`
3. Add appropriate tags (max 4): `svelte`, `react`, `webdev`, `ai`
4. Add "Originally published at [gettraek.com]" at the top
5. Ensure all relative links are absolute (Dev.to won't resolve `/docs/...`)

**Do NOT cross-post:** Internal-only content, release notes, or anything that doesn't make sense without the gettraek.com context.

---

### Step 6 — Reddit Posts (30 min)

Reddit requires a different tone — **helpful, not promotional**. Never lead with "we built" or "our product". Lead with the value.

**Subreddit targeting:**

| Content Type | Primary Sub | Secondary Sub |
|---|---|---|
| React tutorial | r/reactjs | r/javascript |
| Svelte tutorial | r/sveltejs | r/javascript |
| Vue tutorial | r/vuejs | r/javascript |
| AI UX/opinion | r/LocalLLaMA | r/MachineLearning |
| Release news | r/programming | r/webdev |
| General dev tool | r/programming | r/devtools |

**Post template:**

```
Title: [Tutorial/Blog title, slightly reworded to be more Reddit-native]

Body:
[2–3 sentences of context — what you built and why]

[Link to the tutorial or post]

Happy to answer questions about [specific technical aspect].
```

**Rules:**
- Comment on your own post with a clarifying detail or the most interesting insight
- Respond to every comment within 24 hours
- Check subreddit rules before posting (some require flair, some ban self-promotion)
- One subreddit per piece per week — don't spam

---

### Step 7 — Discord Announcement (10 min)

Post to the Træk Discord:

**For tutorials:**
```
#showcase
New tutorial: [title] — learn how to build [thing] with Træk + [provider] in [timeframe].

[link] | [CodeSandbox link if available]
```

**For releases:**
```
#announcements
@everyone Træk vX.Y.Z is live 🚀

[2–3 bullet points of highlights]

Full changelog → [link]
Upgrade: `npm install @traek/react@X.Y.Z`
```

---

### Step 8 — Newsletter Snippet (10 min)

Add to the developer newsletter template (`developer-newsletter-template.md`):

```markdown
## This month from Træk

[1 sentence on the release or post]

→ [Title with link]
→ [Second piece with link if applicable]
```

Newsletter goes out on the 1st and 15th of each month. Add snippets to the draft as content is published.

---

## Content Calendar Integration

After repurposing, update the blog content calendar (`blog-content-calendar.md`):

- Mark the post as "Published ✓"
- Note which repurposing steps are complete
- Log any Reddit post URLs for tracking upvotes/engagement

---

## Engagement Response Protocol

After publishing:

**First 2 hours:** Monitor for questions/comments. Respond to everything.

**24 hours:** Retweet the thread summary tweet from the Træk account if it's performing (>20 engagements).

**1 week:** Check Dev.to analytics. If > 500 views, consider updating with an "Editor's pick" request or a follow-up post.

**1 month:** Check Google Search Console for the blog post. If it's ranking page 2–3 for target keyword, consider adding internal links from newer posts to boost it.

---

## Asset Checklist (prepare before publishing)

- [ ] Header image (1200×630px) — for OG/Twitter card
- [ ] Canvas screenshot or GIF showing the feature in action
- [ ] Code snippet image (use Carbon or ray.so — dark theme, use the Træk color palette)
- [ ] CodeSandbox or StackBlitz embed (for tutorials)

---

## Tools

| Task | Tool |
|------|------|
| OG image creation | Figma (use brand template) |
| Code snippet images | ray.so |
| GIF recording | Rottencode / Gifox / Kap |
| Dev.to cross-post | dev.to/new |
| Reddit scheduling | Reddit native |
| X scheduling | Buffer or native |
| LinkedIn scheduling | Buffer or native |
| Analytics tracking | gettraek.com/admin + UTM params |

---

## UTM Parameter Convention

All social links must use UTM tracking:

```
https://gettraek.com/blog/post-slug?utm_source=[platform]&utm_medium=social&utm_campaign=[content-type]
```

Examples:
- `?utm_source=twitter&utm_medium=social&utm_campaign=tutorial`
- `?utm_source=reddit&utm_medium=social&utm_campaign=blog`
- `?utm_source=devto&utm_medium=social&utm_campaign=crosspost`
- `?utm_source=discord&utm_medium=community&utm_campaign=release`
