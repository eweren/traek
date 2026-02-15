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

| Feature | Status | Notes |
|---------|--------|-------|
| TraekCanvas (pan/zoom/render) | Stable | Core component, fully functional |
| TraekEngine (tree state) | Stable | addNode, branchFrom, focusOnNode, moveNode |
| TextNode (markdown/code/images) | Stable | marked + DOMPurify + highlight.js |
| Streaming support | Stable | Token-by-token with status tracking |
| Thought/reasoning nodes | Stable | Collapsible panel within TraekNodeWrapper |
| CSS custom property theming | Stable | 60+ --traek-* variables, base layer |
| Smart Actions | Shipped | ActionResolver, ActionBadges, SlashCommandDropdown |
| Node Type System | Shipped | NodeTypeRegistry, lifecycle hooks, NodeToolbar |
| Storybook | Setup done | Component documentation and visual testing |

### In Progress

| Feature | Status | Spec |
|---------|--------|------|
| Conversation Persistence | In development | feature/conversation-persistence.md |

### Planned (Spec Complete)

| Feature | Spec |
|---------|------|
| Keyboard Navigation | feature/keyboard-navigation.md |

### Backlog (Conceptual)

| Feature | Spec |
|---------|------|
| Multi-User Collaboration | backlog.md |
| Minimap | backlog.md |

---

## Phase 1 -- Kurzfristig (next 4-6 weeks)

Foundation features that make Traek usable in real production applications.

### 1.1 Conversation Persistence & Replay
**Priority: Critical** | Status: In Development

- JSON serialize/deserialize the full engine state
- Replay mode for demos and debugging
- Without persistence, every page reload loses the conversation

**Why first**: This is table stakes. No production app can ship without save/load.

### 1.2 Keyboard-First Navigation
**Priority: High** | Status: Spec Complete

- Vim-style and arrow key navigation through the tree
- Keybinding help overlay
- Visual focus indicator separate from active node

**Why next**: Power users and accessibility both demand keyboard support. Spatial UIs without keyboard navigation exclude a significant user base.

### 1.3 Accessibility Foundation
**Priority: High** | Status: New -- see feature/accessibility.md

- ARIA tree semantics (role="tree", role="treeitem", aria-expanded)
- Screen reader announcements for streaming, node creation, branching
- Focus management and reduced-motion support
- Color contrast compliance for default theme

**Why now**: Accessibility is not a feature -- it is a requirement. Shipping the library without ARIA semantics limits adoption in any organization with accessibility standards. Keyboard navigation (1.2) provides the interaction layer; this provides the semantic layer.

---

## Phase 2 -- Mittelfristig (2-3 months)

Features that unlock new use cases and significantly improve developer experience.

### 2.1 Mobile & Touch Support
**Priority: High** | Status: New -- see feature/mobile-touch-support.md

- Touch gesture recognition (pinch-to-zoom, two-finger pan, tap, long-press)
- Responsive node sizing and layout adjustments
- Touch-optimized input and context menus
- Viewport-aware breakpoints for compact vs. full rendering

**Why important**: Mobile is ~55% of web traffic. A spatial canvas that only works with mouse and keyboard cuts the addressable market in half.

### 2.2 Performance & Virtualization
**Priority: High** | Status: New -- see feature/performance-large-trees.md

- Node virtualization (only render what is in viewport)
- Layout computation offloading (Web Worker or incremental)
- Connection line batching (single SVG path instead of per-connection elements)
- Lazy loading of node content for large trees (100+ nodes)

**Why important**: The spatial model breaks down if performance degrades at scale. Without virtualization, Traek hits a wall at ~50-100 visible nodes.

### 2.3 Minimap
**Priority: Medium**

- Overview panel showing the entire tree topology
- Viewport indicator and click-to-navigate
- Color-coded nodes by role/type

### 2.4 Enhanced Theming & Design Tokens
**Priority: Medium**

- Structured theme objects (not just flat CSS variables)
- Preset themes (light, dark, high-contrast)
- Runtime theme switching API

### 2.5 Developer Experience
**Priority: Medium**

- Comprehensive API documentation site
- Integration guides (SvelteKit patterns, common LLM providers)
- Example repository with 3-5 real-world patterns

---

## Phase 3 -- Langfristig (6+ months)

### 3.1 Multi-User Collaboration (Medium-Low)
### 3.2 Plugin Architecture (Medium-Low)
### 3.3 Export & Sharing (Low)
### 3.4 AI-Aware Layout Engine (Low)
### 3.5 Framework Adapters -- React, Vue, Web Components (Low)

---

## Prioritization Summary

| Priority | Feature | Phase | Impact | Effort |
|----------|---------|-------|--------|--------|
| P0 | Conversation Persistence | 1 | Critical | Medium |
| P0 | Keyboard Navigation | 1 | High | Medium |
| P0 | Accessibility Foundation | 1 | High | Medium |
| P1 | Mobile & Touch | 2 | High | High |
| P1 | Performance/Virtualization | 2 | High | High |
| P1 | Minimap | 2 | Medium | Medium |
| P1 | Enhanced Theming | 2 | Medium | Low |
| P1 | Developer Experience | 2 | High | Medium |
| P2 | Collaboration | 3 | High but complex | Very High |
| P2 | Plugin Architecture | 3 | Medium | High |
| P2 | Export & Sharing | 3 | Medium | Medium |
| P2 | AI-Aware Layout | 3 | High if done well | Very High |
| P3 | Framework Adapters | 3 | Very High | Very High |

## Guiding Principles

1. **Ship foundations before features**: Persistence, accessibility, and performance unlock everything else.
2. **Stay library-shaped**: Every feature should be composable and opt-in.
3. **Developer experience is a feature**: 15 minutes to a working prototype or the API is too complex.
4. **Spatial-first, always**: Every feature should reinforce that conversations have topology.
