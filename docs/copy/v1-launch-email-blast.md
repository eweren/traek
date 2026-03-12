# v1.0 Launch Email Blast — Waitlist Subscribers

**Date:** 2026-03-10 (send at 9:00 AM EST on launch day)
**Task:** [TRK-50](/issues/TRK-50)
**List:** All waitlist subscribers (app.gettraek.com)
**Tool:** Resend

---

## Email

**Subject line (primary):**
```
Traek Playground is live. You're in.
```

**Subject line (A/B variant):**
```
You waited. We shipped. Traek v1.0 is here.
```

**Preview text:**
```
The spatial AI canvas is live — branch any conversation, keep all paths alive.
```

---

**Body:**

```
Hi [First name],

Today's the day.

Traek Playground v1.0 is live. You signed up for early access — here it is.

→ app.gettraek.com


WHAT WE SHIPPED

Traek is a spatial AI canvas for conversations that branch. Instead of a
linear thread you scroll through, Traek puts your conversation on a
pannable, zoomable canvas.

Branch from any message. Both paths stay alive. Zoom out to see your
entire thinking session.

Three things we care most about:

1. BYOK — your API key (OpenAI or Anthropic) never leaves your browser.
   We don't proxy it. We don't store your messages. Your conversations are yours.

2. Free tier that's actually useful — 5 conversations, no account required,
   no credit card. Try it before you decide.

3. Open-source core — @traek/svelte is the engine under the hood. MIT licensed.
   The Playground is the hosted layer on top.


HOW TO GET STARTED

1. Go to app.gettraek.com
2. Enter your OpenAI or Anthropic API key in Settings
3. Start a conversation — then hit "Branch" from any message

That's it. No onboarding flow. No tutorial required.


ON PRODUCT HUNT TODAY

If you find it useful, we'd love your support on Product Hunt — we're live
right now. (No pressure, and please don't upvote if you haven't tried it!)

→ [Product Hunt link — insert at send time]


WHAT'S NEXT

We're shipping fast. Here's what's coming soon:

- Keyboard shortcuts for power users
- File and image nodes (drop a PDF into the canvas)
- Export to Markdown and JSON
- Teams + real-time collaboration (Q2)

If you hit a bug or have feedback, open an issue on GitHub or reply to
this email directly. I read every reply.


Thank you for waiting.

Nico
Traek


---
You're receiving this because you joined the Traek waitlist at app.gettraek.com.
Unsubscribe | Update preferences
```

---

## Send Checklist

- [ ] Personalization token `[First name]` verified in Resend (fallback: "there")
- [ ] Product Hunt URL inserted (live at 12:01 AM, email sends at 9 AM)
- [ ] app.gettraek.com is live and accepting signups before send
- [ ] Test send to internal team addresses (check mobile rendering)
- [ ] Unsubscribe link functional
- [ ] Reply-to set to founder's personal email (builds trust, real person)

## Expected Metrics (Benchmarks)

| Metric | Target | Based on |
|--------|--------|----------|
| Open rate | >45% | Warmlist, high intent |
| Click-through (to app) | >25% | Clear single CTA |
| PH click-through | >8% | Secondary CTA |
| Unsubscribe rate | <2% | Permission-based list |

## Follow-Up Email (Day 3 — for non-openers)

**Subject:**
```
Did you see this? Traek Playground is live
```

**Body (short):**
```
Hi [First name],

Quick note — Traek Playground launched Monday. You're on the list.

If you haven't tried it yet: app.gettraek.com

No account needed for the free tier. 5 conversations, local storage,
your own API key.

Would love to know what you think.

— Nico
```

*Send only to subscribers who did not open the launch email. Keep it short.*
