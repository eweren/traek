# UX Specification: Template Gallery for Conversation Starters

**Version:** 1.0
**Author:** UX Expert Agent
**Date:** 2026-03-08
**Task:** [TRK-53](/issues/TRK-53)
**Status:** Draft

---

## 1. Overview & Design Goal

The template gallery gives users a curated set of conversation starters so they can reach value immediately — before they've formed a mental model of the canvas. Without templates, new users face a blank canvas and an empty input: a classic cold-start problem.

**Design goal:** Reduce time-to-first-meaningful-conversation from ~90 s to <20 s for new users.

**Non-goals:** This is not a marketplace or community template hub (see `ux-marketplace-spec.md`). Phase 1 is a curated set of built-in templates, plus the ability for power users to save their own.

---

## 2. Information Architecture

Templates are organized in a two-level hierarchy:

```
Template Gallery
├── Category (brainstorming, code review, research, decision-making, support)
│   └── Template Card
│       ├── Title
│       ├── Description (1–2 sentences)
│       ├── Preview snippet (first message text, max 120 chars)
│       ├── Tags (up to 3)
│       ├── Estimated depth (shallow / medium / deep)
│       └── Actions: Use template, Preview, Save (power user)
└── My Templates (user-saved, power user section)
```

---

## 3. Template Categories & Content

### 3.1 Category definitions

| Category | Icon | Accent | Purpose |
|---|---|---|---|
| Brainstorming | ✦ Spark | `--pg-lime` | Open-ended ideation, divergent thinking |
| Code review | `</>` | `--pg-cyan` | Technical analysis, PR reviews, refactors |
| Research | ◎ Lens | neutral | Literature review, competitive analysis, fact-finding |
| Decision-making | ⊗ Scale | amber | Trade-off analysis, pros/cons, structured decisions |
| Support | ◇ Lifeline | neutral | Writing, editing, planning, help tasks |

### 3.2 Starter template set (18 templates, 3–4 per category)

**Brainstorming**
1. *Feature ideation sprint* — "I'm building [product]. Help me generate and branch out 10 wildly different feature ideas, exploring each direction separately."
2. *Problem reframing* — "I'm stuck on [problem]. Help me see it from 5 completely different angles, starting a new branch for each perspective."
3. *Naming workshop* — "I need a name for [thing]. Let's explore 3 distinct naming directions: descriptive, abstract, and playful."
4. *HMW generator* — "Topic: [topic]. Generate 8 'How might we…' questions spanning different user needs, then branch into the most promising 3."

**Code review**
1. *Pull request review* — "Review this code change: [paste diff]. Flag issues, suggest improvements, and let's go deep on the most critical ones."
2. *Architecture critique* — "Here's my current architecture: [diagram/description]. Identify risks and explore alternative designs in separate branches."
3. *Refactor planning* — "I want to refactor [module]. Walk me through the options, then drill down into the approach I choose."
4. *Performance audit* — "This function is slow: [code]. Identify bottlenecks, then explore multiple optimization strategies."

**Research**
1. *Competitive landscape* — "I'm researching [market/product space]. Build a structured overview, then branch into each key player."
2. *Literature review* — "Topic: [subject]. Synthesize what is known, identify gaps, and explore the most interesting open questions."
3. *Expert Q&A tree* — "I want to understand [complex topic] deeply. Start high-level, then let me branch into any section I want to explore further."
4. *Source evaluation* — "Here are my sources: [list]. Evaluate each for credibility, then synthesize the consensus and contradictions."

**Decision-making**
1. *Trade-off matrix* — "I'm deciding between [options]. Build a structured trade-off analysis; branch into each option for deep-dives."
2. *Pre-mortem analysis* — "I'm about to [decision/launch]. Imagine it failed — explore the top 5 failure modes, one per branch."
3. *Second-order thinking* — "I'm considering [action]. Walk me through first-order effects, then branch into the most important second-order consequences."
4. *Stakeholder map* — "Decision: [topic]. Map all stakeholders, their interests, and their likely reactions — branch into each key stakeholder."

**Support**
1. *Draft and refine* — "I need to write [document/email/post]. Give me a first draft, then branch into 3 tone variations."
2. *Project planner* — "I want to [goal] in [timeframe]. Build a phased plan, then branch into each phase for detailed task breakdowns."

---

## 4. Entry Points

Templates are accessible from **three surfaces**:

### 4.1 Empty canvas state (primary)

When a user opens a blank canvas (new conversation), the center of the canvas shows the template gallery panel instead of just an empty input:

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   What do you want to explore?                             │
│                                                             │
│   ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────┐  │
│   │ ✦ Brain-  │  │ </> Code  │  │ ◎ Research│  │ More  │  │
│   │ storming  │  │  review   │  │           │  │  ↓    │  │
│   └───────────┘  └───────────┘  └───────────┘  └───────┘  │
│                                                             │
│   ┌─────────────────────────┐  ┌─────────────────────────┐ │
│   │  Feature ideation       │  │  Pull request review    │ │
│   │  sprint                 │  │                         │ │
│   │  Generate and branch    │  │  Review code, flag      │ │
│   │  out 10 wildly different│  │  issues, deep-dive on   │ │
│   │  feature ideas…         │  │  critical ones…         │ │
│   │  [brainstorming] [ideas]│  │  [code] [review]        │ │
│   │         [ Use template ]│  │         [ Use template ]│ │
│   └─────────────────────────┘  └─────────────────────────┘ │
│                                                             │
│                    ─── or ───                              │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  Start from scratch: type anything…          [→]   │   │
│   └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

- Category pills scroll horizontally; active category highlights with its accent color.
- Default: show "All" (mixed, ranked by usage frequency / recency for returning users; editorial ranking for new users).
- Max 6 cards visible without scrolling on desktop; scroll reveals more.
- Keyboard: Tab between category pills, arrow keys between cards, Enter to use.

### 4.2 Sidebar "New conversation" menu (secondary)

The "+ New conversation" button gains a dropdown with two items:
- **Blank canvas** — original behavior
- **Browse templates** — opens the full gallery modal (Section 5)

### 4.3 Command palette (power user)

When the user presses `Cmd/Ctrl + K`, the command palette includes a "Templates" section. Typing a term filters templates by title and tags. Pressing Enter on a template starts it immediately.

---

## 5. Full Gallery Modal

Triggered from the sidebar entry point or the "Show all templates" link on the empty-canvas panel.

### 5.1 Layout (desktop ≥1024px)

```
┌─────────────────────────────────────────────────────────────┐
│  [×]             Browse templates                           │
├──────────────┬──────────────────────────────────────────────┤
│              │                                              │
│  Categories  │  ┌──────────────┐  ┌──────────────┐         │
│  ──────────  │  │ Card         │  │ Card         │         │
│  ○ All       │  │              │  │              │         │
│  ✦ Brainst.  │  └──────────────┘  └──────────────┘         │
│  </> Code    │  ┌──────────────┐  ┌──────────────┐         │
│  ◎ Research  │  │ Card         │  │ Card         │         │
│  ⊗ Decision  │  │              │  │              │         │
│  ◇ Support   │  └──────────────┘  └──────────────┘         │
│  ──────────  │                                              │
│  My templates│  ─── My templates (0) ───                   │
│  (0 saved)   │  [ + Save a template to start here ]        │
│              │                                              │
│  [Search...]  │                                              │
└──────────────┴──────────────────────────────────────────────┘
```

- Modal max-width: 960px; max-height: 80vh with internal scroll on right panel
- Left rail: 200px fixed; right: flexible grid (2 columns ≥768px, 1 column on mobile)
- Search field searches across title, description, preview text, and tags (debounced 200ms)
- Keyboard: `Esc` closes; `↑↓` navigates left rail; `Tab` moves to right panel cards

### 5.2 Layout (tablet 640–1023px)

Left rail collapses to a horizontal pill row above the card grid. Same two-column grid.

### 5.3 Layout (mobile <640px)

Full-screen sheet slide-up. Category pills horizontal-scroll at top. Single-column card list. Bottom sticky bar shows selected template name + "Use this template" CTA.

---

## 6. Template Card Design

### 6.1 Anatomy

```
┌─────────────────────────────────────────┐
│ [Category icon + color accent dot]       │ ← 12px icon, 6px dot
│                                         │
│  Feature ideation sprint                │ ← 15px, weight 600
│                                         │
│  Generate and branch out 10 wildly      │ ← 13px, --pg-text-secondary
│  different feature ideas for your       │   max 2 lines, line-clamp
│  product, exploring each direction…     │
│                                         │
│  ╔══════════════════════════════════╗   │
│  ║ "I'm building [product]. Help   ║   │ ← preview pill, monospace 12px
│  ║  me generate 10 feature ideas…" ║   │   bg: --pg-bg-input, border-dashed
│  ╚══════════════════════════════════╝   │
│                                         │
│  [brainstorming] [ideas] [medium]       │ ← tag chips, 11px
│                                         │
│  ─────────────────────────────────────  │
│  [ ♡ Save ]              [ Use → ]      │ ← 32px height buttons
└─────────────────────────────────────────┘
```

**Card dimensions:**
- Width: fluid (min 240px, max 360px in grid)
- Padding: 16px
- Border-radius: 12px (matches `--pg-radius`)
- Background: `--pg-bg-card` (#161616)
- Border: 1px solid `--pg-border` (rgba(255,255,255,0.08))
- Hover: background `--pg-bg-card-hover`, border `--pg-border-cyan`
- Box-shadow on hover: `--pg-shadow-card`

**Focus state:**
- 2px cyan outline, 2px offset: `outline: 2px solid var(--pg-cyan); outline-offset: 2px`

**Category accent dot:**
- 6px circle, colored per category (lime for brainstorming, cyan for code review, white/40% for others)
- Placed top-left of card, inline with category icon

**Preview snippet:**
- Dashed border box, `background: rgba(255,255,255,0.03)`, `font-family: Space Mono`
- Shows the template's first message with `[placeholder]` text in cyan italic to signal editability
- Truncated at 2 lines with "…" if longer

**Tag chips:**
- 11px, `background: rgba(255,255,255,0.06)`, `border-radius: 100px`, `padding: 2px 8px`
- Max 3 tags per card; overflow suppressed

**Depth badge** (part of tags row):
- `shallow` → lime text; `medium` → cyan text; `deep` → gradient text
- Signals conversation complexity so users can choose appropriately

### 6.2 Interactive states

| State | Visual |
|---|---|
| Default | Card as above |
| Hover | Background lightens, cyan border appears, subtle scale(1.01) |
| Focus | Cyan outline 2px, keyboard-only (`:focus-visible`) |
| Active/press | scale(0.99) |
| Saved | Heart icon filled, "Saved" label for 2s then reverts to icon only |
| Used recently | No visual distinction (avoid cognitive overhead) |

### 6.3 Accessibility

- `role="article"` on each card
- `aria-label="[template title]. Category: [category]. [depth] depth. Press Enter to use."` on card root (for screen reader context)
- "Use" button: `aria-label="Use [template title] template"`
- "Save" button: `aria-label="Save [template title] to my templates"`, `aria-pressed="false/true"`
- Preview snippet has `aria-label="Preview: [full text]"` to avoid truncation issues

---

## 7. Template Loading Flow

### 7.1 Select → Customize → Start

```
[User clicks "Use →"]
       ↓
[Customization drawer slides up / modal]
       ↓
[User fills in [placeholders], adjusts settings]
       ↓
[Clicks "Start conversation"]
       ↓
[Drawer closes; canvas loads; first message is sent; streaming begins]
```

### 7.2 Customization step detail

The customization step is a lightweight sheet (not a full-page navigation) that appears inline below the gallery or as a drawer on mobile.

```
┌─────────────────────────────────────────────────────────────┐
│ [← Back to templates]    Feature ideation sprint            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Fill in the details:                                       │
│                                                             │
│  Your product or idea                                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  e.g. "a mobile app for tracking reading habits"    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Preview your first message:                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ "I'm building a mobile app for tracking reading     │   │
│  │  habits. Help me generate and branch out 10 wildly  │   │
│  │  different feature ideas…"                           │   │
│  └─────────────────────────────────────────────────────┘   │
│  (editable — click to modify)                              │
│                                                             │
│  AI model: [ GPT-4o (default) ↓ ]                          │
│                                                             │
│  ┌────────────────────┐  ┌────────────────────────────┐   │
│  │    Cancel          │  │    Start conversation →     │   │
│  └────────────────────┘  └────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**Placeholder extraction:**
- Templates use `[bracket]` syntax for user-fillable fields.
- The system parses the template string for all `[field_name]` tokens.
- Each unique field gets a labeled text input with the field name as label and a context-appropriate placeholder.
- Multiple occurrences of the same token share one input (auto-populated on type).

**Preview message:**
- Rendered as a live text area showing the composed message.
- Updates in real time as user fills in fields.
- User can edit the preview directly (overrides template composition).
- Edits are per-session; they do not mutate the base template.

**Model selector:**
- Only shown if user has multiple API keys configured.
- Defaults to last used model.

**Validation:**
- "Start conversation" is enabled even if placeholders are unfilled (some users want to send as-is).
- Unfilled `[placeholders]` are sent literally — the AI typically handles them gracefully.
- If no API key is configured: button label becomes "Add API key to start →" which opens settings.

**Animation:**
- Customization drawer slides up with `transform: translateY` over 200ms, `ease-out`.
- Respects `prefers-reduced-motion`: instant display instead.

### 7.3 After starting

1. The modal/gallery closes.
2. The canvas immediately shows the user message node (optimistic, before API response).
3. Streaming begins; the assistant response node appears with a loading indicator.
4. The conversation title is set from the first ~6 words of the first message (or "Feature ideation sprint" fallback).

---

## 8. Template Creation Flow (Power Users)

### 8.1 Entry points for saving a custom template

1. **From any conversation:** Three-dot menu on any user message node → "Save as template"
2. **From the gallery:** "My templates" section → "+ Create template"
3. **From the gallery card → "Save":** Saves a built-in template to "My templates" (copy, not reference)

### 8.2 Save-as-template from a message node

```
[User opens node context menu → "Save as template"]
       ↓
[Sheet opens, pre-filled with the message content]
       ↓
[User edits, adds title/description/tags]
       ↓
["Save to My templates"]
       ↓
[Toast: "Template saved. View in gallery →"]
```

Sheet layout:

```
┌─────────────────────────────────────────────────────────────┐
│  Save as template                                     [×]   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Template name *                                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ My feature ideation                                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Short description                                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  What does this template help with?                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Starter message *                                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  I'm building [product]. Help me generate…          │   │
│  │                                  96 / 500           │   │
│  └─────────────────────────────────────────────────────┘   │
│  Tip: wrap variable parts in [brackets] to create fields.  │
│                                                             │
│  Category                                                  │
│  [ Brainstorming ↓ ]                                       │
│                                                             │
│  Tags  (up to 3)                                           │
│  ┌──────────────────────────────────────────────────┐  +  │
│  │  brainstorming  ×  |  ideas  ×                   │     │
│  └──────────────────────────────────────────────────┘     │
│                                                             │
│  ┌──────────────┐  ┌──────────────────────────────────┐   │
│  │   Cancel     │  │   Save to My templates           │   │
│  └──────────────┘  └──────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**Validation:**
- Name: required, max 60 chars, no duplicate name (warn, not block)
- Starter message: required, max 500 chars
- Description: optional, max 120 chars
- Tags: optional, each max 20 chars

**`[bracket]` syntax guidance:**
- Inline tip below the message field explains the bracket syntax.
- As the user types `[`, a tooltip appears: "Wrapping text in [brackets] creates a fill-in field."

### 8.3 My templates management

In the gallery sidebar/section, under "My templates":

- List of saved templates (same card design, with "Edit" and "Delete" in `...` overflow menu)
- **Edit:** re-opens the save sheet pre-filled
- **Delete:** confirmation inline (not a full modal): "Remove [name]? This cannot be undone." with "Remove" (destructive) / "Cancel"
- **Empty state:** "You haven't saved any templates yet. Save a conversation message or [browse built-in templates] to save a copy."

---

## 9. Empty States

| Surface | Message | Action |
|---|---|---|
| Gallery, all categories | (should never be empty — curated) | — |
| Gallery, My templates (empty) | "Save any conversation message as a reusable template." | "Learn how" tooltip |
| Gallery search, no results | "No templates match '[term]'." | "Clear search" |
| Gallery search, My templates, no results | "None of your templates match '[term]'." | "Search all templates" |

---

## 10. Responsive Gallery Layout

### 10.1 Breakpoint behavior

| Breakpoint | Gallery modal | Category nav | Card grid | Card min-width |
|---|---|---|---|---|
| ≥1024px | 960px centered modal | Left side rail (200px) | 2 columns | 280px |
| 768–1023px | Full-screen modal | Horizontal pills (scrollable) | 2 columns | 240px |
| 480–767px | Bottom sheet (90vh) | Horizontal pills | 1 column | 100% |
| <480px | Full-screen sheet | Horizontal pills (compact) | 1 column | 100% |

### 10.2 Empty canvas panel (in-canvas entry)

| Breakpoint | Layout |
|---|---|
| ≥1024px | Centered panel, 560px max-width, 2-column card grid |
| 640–1023px | Centered panel, 480px max-width, 2-column grid |
| <640px | Full-width panel pinned above input bar; single column, 3 cards visible, "See all" link |

### 10.3 Mobile customization flow

On mobile (<640px), the customization step is a **full-screen sheet** (not a partial drawer):
- Swipe down to dismiss
- Form fields stacked vertically
- Keyboard-safe: `padding-bottom: env(safe-area-inset-bottom)` applied
- Preview message shown collapsible to save vertical space

---

## 11. Accessibility Requirements

| Requirement | Implementation |
|---|---|
| WCAG 2.1 AA contrast on all text | Verify: `--pg-text-secondary` (#a8a8a8 on #161616) = 4.9:1 ✓ |
| Keyboard access to all actions | Tab order: category pills → search → cards → card actions |
| Screen reader announcement | Modal announced via `aria-labelledby`; gallery region has `role="region" aria-label="Template gallery"` |
| Focus trap in modal | Focus trapped inside modal; released on Esc or explicit close |
| Return focus on close | Focus returns to the trigger button (e.g. "Browse templates") |
| Reduced motion | All animations guarded by `@media (prefers-reduced-motion: reduce)` |
| Touch targets | "Use" and "Save" buttons ≥44px height; cards ≥44px clickable area |
| High contrast mode | Borders use `rgba` so they disappear in Windows HCM — add `forced-colors: active` rule to add `ButtonBorder` |

### 11.1 Keyboard interaction map

| Key | Action |
|---|---|
| `Tab` | Move through categories, search, cards, card actions |
| `Arrow ←/→` in category pills | Switch active category |
| `Arrow ↑/↓` in card grid | Move between cards in column |
| `Enter` on card | Same as clicking "Use template" |
| `Enter` on "Save" | Toggle saved state |
| `Esc` | Close modal or customization drawer |
| `Cmd/Ctrl+K` | Open command palette (template search) |

---

## 12. Motion Design

| Interaction | Animation | Duration | Easing |
|---|---|---|---|
| Gallery modal open | `opacity 0→1` + `scale 0.97→1` | 160ms | ease-out |
| Gallery modal close | `opacity 1→0` + `scale 1→0.97` | 120ms | ease-in |
| Category switch | Card grid cross-fades | 120ms | ease |
| Card hover | `scale(1.01)` + border color | 150ms | ease |
| Customization drawer open | `translateY(100%→0)` | 200ms | cubic-bezier(0.25, 1, 0.5, 1) |
| Template start | Cards fade out, canvas fades in | 200ms | ease-out |
| "Save" heart | Scale bounce 1→1.3→1 + fill | 300ms | spring |
| All | `prefers-reduced-motion: reduce` disables all transforms, uses instant `display` change | — | — |

---

## 13. Implementation Notes for Dev

- Templates are defined as a static TypeScript constant array (no DB required for built-in templates). Schema:

```typescript
interface TemplateDefinition {
  id: string;                     // slug, e.g. 'feature-ideation-sprint'
  title: string;                  // max 60 chars
  description: string;            // max 120 chars
  category: TemplateCategory;     // 'brainstorming' | 'code-review' | 'research' | 'decision-making' | 'support'
  tags: string[];                 // max 3
  depth: 'shallow' | 'medium' | 'deep';
  starterMessage: string;         // may contain [placeholder] tokens
  placeholders: PlaceholderDef[]; // auto-parsed from starterMessage, or explicit override
  builtIn: true;
}

interface PlaceholderDef {
  token: string;      // e.g. 'product'
  label: string;      // e.g. 'Your product or idea'
  placeholder: string; // input placeholder hint
}
```

- User-saved templates extend `TemplateDefinition` with `builtIn: false`, `userId`, `createdAt`, `updatedAt`.
- Free tier: saved templates stored in `localStorage` (max 20). Pro: cloud-synced.
- The gallery modal should be lazy-loaded (dynamic import) — it is not needed on initial page load.
- Search: client-side fuzzy match over title + description + tags. No server round-trip.
- Category pill active state: `aria-current="true"` on the active pill.

---

## 14. Open Questions

1. **Template versioning:** If a built-in template is updated, should previously-saved copies in "My templates" be flagged as outdated? (Recommendation: no — keep user copies stable.)
2. **Analytics:** Which templates are most used? Should we track per-template start events? (Recommendation: yes, fire `template_used` event with `template_id` and `category`.)
3. **Localization:** Template copy is English-only for Phase 1. Community translation later?
4. **AI-assisted template creation:** Could the system suggest template improvements after user edits the preview? (Nice-to-have, Phase 2.)
5. **Sharing templates:** Can Pro users share custom templates via a link? (Out of scope Phase 1 — see marketplace spec.)

---

## 15. Success Metrics

| Metric | Target | How to measure |
|---|---|---|
| Template-started conversations / total new conversations | ≥ 40% (first 30 days) | `template_used` event |
| Time to first message for template users vs. blank | ≤ 50% reduction | Session duration to first `message_sent` |
| Template customization completion rate | ≥ 80% (opened drawer → sent) | Funnel: `template_customise_open` → `template_used` |
| "My templates" saves per active user/week | ≥ 1 (power users) | `template_saved` event |
| Gallery open → template used (conversion) | ≥ 60% | Funnel within gallery session |
