# Product Roadmap

## Vision

Traek is the **spatial conversation engine** for AI-native applications. Where every other chat UI forces thinking into a linear timeline, Traek turns conversations into navigable, branching structures on a pannable canvas.

The long-term goal: become the **standard infrastructure layer** for non-linear AI interaction. Any developer building an AI product with multi-path reasoning, agent workflows, or exploratory conversation should reach for Traek the way they reach for a charting library when they need graphs.

What makes Traek unique:

- **Tree-native**: Branching is a first-class concept, not a hack on top of a linear list
- **Spatial-first**: Conversations have topology, not just chronology
- **Streaming-ready**: Built for real-time token-by-token rendering within a spatial layout
- **Unopinionated rendering**: The engine handles structure; developers control how nodes look and behave
- **Svelte 5**: Reactive by default, leveraging runes for fine-grained state management

---

## Current State (v0.0.2)

### Shipped

| Feature                         | Status     | Notes                                              |
| ------------------------------- | ---------- | -------------------------------------------------- |
| TraekCanvas (pan/zoom/render)   | Stable     | Core component, fully functional                   |
| TraekEngine (tree state)        | Stable     | addNode, branchFrom, focusOnNode, moveNode         |
| TextNode (markdown/code/images) | Stable     | marked + DOMPurify + highlight.js                  |
| Streaming support               | Stable     | Token-by-token with status tracking                |
| Thought/reasoning nodes         | Stable     | Collapsible panel within TraekNodeWrapper          |
| CSS custom property theming     | Stable     | 60+ --traek-\* variables, light/dark mode          |
| Smart Actions                   | Shipped    | ActionResolver, ActionBadges, SlashCommandDropdown |
| Node Type System                | Shipped    | NodeTypeRegistry, lifecycle hooks, NodeToolbar     |
| Storybook                       | Setup done | Component documentation and visual testing         |
| Conversation Persistence        | Shipped    | IndexedDB, auto-save, chat list, JSON/MD export    |
| Mobile Focus Mode               | Shipped    | Swipe nav, haptic feedback, onboarding, keyboard   |
| Light/Dark Mode                 | Shipped    | ThemeToggle, system preference, CSS variables       |
| Undo + Toast System             | Shipped    | Delete undo with 30s timer, stacked toasts          |
| Inline Edit                     | Shipped    | Double-click edit, no more window.prompt            |

### Planned (Next)

| Feature              | Status | Spec                            |
| -------------------- | ------ | ------------------------------- |
| Canvas Decomposition | Next   | feature/ROADMAP-FINAL.md (2.1)  |
| Subtree Collapse     | Ready  | feature/ROADMAP-FINAL.md (2.4)  |
| Minimap              | Blocked by 2.1 | feature/ROADMAP-FINAL.md (2.2) |
| Desktop Keyboard Nav | Blocked by 2.1 | feature/keyboard-navigation.md |

### Backlog (Conceptual)

| Feature                  | Spec       |
| ------------------------ | ---------- |
| Multi-User Collaboration | backlog.md |
| Branch Comparison        | ROADMAP-FINAL.md (3.3) |
| DOM Virtualization       | feature/performance-large-trees.md |

---

## Phase 1 -- Kurzfristig ✅ ABGESCHLOSSEN

### 1.1 Conversation Persistence & Replay ✅

- IndexedDB with localStorage fallback, auto-save, chat list, JSON/Markdown export
- Commits: `db421b2`, `8ea3de4`

### 1.2 Keyboard-First Navigation ✅ (Mobile)

- Arrow key navigation, keyboard cheatsheet, swipe gestures with haptic feedback
- Desktop canvas keyboard nav still planned (see ROADMAP-FINAL.md 2.5)

### 1.3 Accessibility Foundation ✅ (Partial)

- focus-visible states, prefers-reduced-motion, 44px touch targets, ARIA roles
- Full ARIA tree semantics planned with desktop keyboard nav (2.5)

---

## Phase 2 -- Mittelfristig (aktueller Fokus)

Features that unlock new use cases and significantly improve developer experience.

### 2.1 Mobile & Touch Support ✅

- Mobile Focus Mode with swipe navigation, haptic feedback, onboarding
- Commits: `5666327`, `42162df`, `b55a146`, `26004da`, `5519d2d`

### 2.2 Performance & Virtualization

**Priority: High** | Status: Planned -- see feature/performance-large-trees.md

- Node virtualization (only render what is in viewport)
- Connection line batching (single SVG path)
- Blocked by Canvas Decomposition (ROADMAP-FINAL 2.1) and Subtree Collapse (2.4)

### 2.3 Minimap

**Priority: Medium** | Status: Blocked by Canvas Decomposition

- Overview panel showing the entire tree topology
- Viewport indicator and click-to-navigate
- Color-coded nodes by role/type

### 2.4 Enhanced Theming & Design Tokens ✅ (Partial)

- Light/dark mode toggle with system preference detection shipped
- Structured theme objects and high-contrast preset still planned (Phase 4.2)

### 2.5 Developer Experience

**Priority: Medium**

- Comprehensive API documentation site
- Integration guides (SvelteKit patterns, common LLM providers)
- Example repository with 3-5 real-world patterns

---

## Phase 3 -- Langfristig (6+ months)

### 3.1 Multi-User Collaboration (Medium-Low)

### 3.2 Plugin Architecture (Medium-Low)

### 3.3 Export & Sharing ✅ (Partial -- JSON/MD export shipped with persistence)

### 3.4 AI-Aware Layout Engine (Low)

### 3.5 Framework Adapters -- React, Vue, Web Components (Low)

---

## Prioritization Summary

| Priority | Feature                    | Phase | Impact            | Effort    | Status        |
| -------- | -------------------------- | ----- | ----------------- | --------- | ------------- |
| P0       | Conversation Persistence   | 1     | Critical          | Medium    | ✅            |
| P0       | Keyboard Navigation        | 1     | High              | Medium    | Mobile ✅     |
| P0       | Accessibility Foundation   | 1     | High              | Medium    | Partial ✅    |
| P0       | Canvas Decomposition       | 2     | High (blocker)    | High      | **Nächstes**  |
| P0       | Subtree Collapse           | 2     | High              | Medium    | Bereit        |
| P1       | Mobile & Touch             | 2     | High              | High      | ✅            |
| P1       | Performance/Virtualization | 2     | High              | High      |               |
| P1       | Minimap                    | 2     | Medium            | Medium    |               |
| P1       | Enhanced Theming           | 2     | Medium            | Low       | Partial ✅    |
| P1       | Developer Experience       | 2     | High              | Medium    |               |
| P2       | Collaboration              | 3     | High but complex  | Very High |               |
| P2       | Plugin Architecture        | 3     | Medium            | High      |               |
| P2       | Export & Sharing           | 3     | Medium            | Medium    | Partial ✅    |
| P2       | AI-Aware Layout            | 3     | High if done well | Very High |               |
| P3       | Framework Adapters         | 3     | Very High         | Very High |               |

## Guiding Principles

1. **Ship foundations before features**: Persistence, accessibility, and performance unlock everything else.
2. **Stay library-shaped**: Every feature should be composable and opt-in.
3. **Developer experience is a feature**: 15 minutes to a working prototype or the API is too complex.
4. **Spatial-first, always**: Every feature should reinforce that conversations have topology.
