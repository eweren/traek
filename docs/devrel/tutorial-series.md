# Træk Tutorial Series: Building Spatial AI Conversation Interfaces

**5-Part Tutorial Series | Target Audience: Developers building AI-powered applications**

---

## Overview

This series takes developers from zero to production with Træk — the Svelte 5 UI library for spatial, tree-structured AI conversations. Each part stands alone but builds on prior knowledge.

**Prerequisites:** Basic JavaScript/TypeScript, familiarity with any frontend framework.

**Series tagline:** *"Stop thinking in lines. Start thinking in trees."*

---

## Part 1: Why Linear Chat Is Holding Your AI App Back

**Subtitle:** *An introduction to spatial AI interfaces and getting started with Træk*

**Estimated reading time:** 12 min
**Difficulty:** Beginner
**Deliverable:** A working Træk canvas with a basic AI conversation

### Outline

1. **The Problem with Linear Chat**
   - Linear interfaces force sequential thinking
   - Users lose context when exploring multiple ideas
   - The "scroll of shame" — finding earlier context in a long thread
   - Real examples: code review, brainstorming, research workflows

2. **Enter Spatial Conversation**
   - Nodes instead of messages
   - Pan/zoom navigation — like a whiteboard for your thoughts
   - Branching: explore multiple ideas simultaneously
   - Who benefits: developers, researchers, product teams

3. **Introducing Træk**
   - What it is (Svelte 5, canvas-based, framework-agnostic adapters)
   - Architecture overview: TraekEngine + TraekCanvas
   - Package installation: `@traek/svelte`

4. **Hello, Træk**
   - Project setup (SvelteKit)
   - Mounting `<TraekCanvas>`
   - Connecting a simple echo AI (no API key needed)
   - Seeing your first node appear on canvas

5. **What's Next**
   - Part 2 preview: navigating the canvas like a pro

### Code Sample (teaser)
```svelte
<script>
  import { TraekCanvas } from '@traek/svelte'

  async function handleMessage({ message, engine }) {
    const node = engine.addNode({ role: 'assistant', content: '...' })
    // Stream your AI response here
  }
</script>

<TraekCanvas onSendMessage={handleMessage} />
```

---

## Part 2: Mastering the Canvas — Pan, Zoom, and Node Architecture

**Subtitle:** *Understanding how Træk organizes spatial conversations*

**Estimated reading time:** 15 min
**Difficulty:** Beginner–Intermediate
**Deliverable:** Custom node layout with manual positioning

### Outline

1. **The Canvas Mental Model**
   - Viewport vs. world coordinates
   - How nodes get their x/y positions
   - The TraekEngine as your conversation state machine

2. **Navigation Controls**
   - Pan: click-drag or touchpad
   - Zoom: scroll or pinch
   - Keyboard shortcuts
   - `focusOnNode()` — programmatic camera control

3. **Understanding Node Types**
   - TEXT, CODE, THOUGHT
   - role: user / assistant / system
   - status: streaming / done / error
   - metadata and spatial coordinates

4. **Working with TraekEngine Directly**
   - `addNode()` — adding messages
   - `moveNode()` — repositioning nodes
   - `focusOnNode()` — centering the camera
   - Map-based lookups for O(1) performance

5. **Custom Node Positioning**
   - Automatic layout vs. manual layout
   - Grid layouts for structured conversations
   - Radial layouts for brainstorming

6. **Hands-On: Build a Mindmap Mode**
   - Place nodes in a radial pattern around a central question
   - Use `moveNode()` after AI responds

---

## Part 3: Branching Conversations — Exploring Multiple Paths

**Subtitle:** *The superpower that sets Træk apart from every chat UI*

**Estimated reading time:** 18 min
**Difficulty:** Intermediate
**Deliverable:** Multi-branch conversation with visible tree structure

### Outline

1. **Why Branching Changes Everything**
   - "What if I'd asked it differently?"
   - A/B testing prompts on the same context
   - Parallel research threads
   - Revision without losing history

2. **The Tree Data Structure**
   - Parent-child relationships via `parentId`
   - Connection lines: how they're drawn
   - Tree traversal in TraekEngine

3. **`branchFrom()` — Creating New Paths**
   - API: `engine.branchFrom(nodeId, newNodeData)`
   - Branch from any point in the conversation
   - The branch maintains full ancestor context

4. **Building a Branch UI**
   - "Branch here" button on any node
   - Visual indicators for branch points
   - Color-coding branches

5. **Managing Multiple Branches**
   - Collapsing inactive branches
   - Highlighting the "winning" path
   - Exporting a single branch as linear chat

6. **Real-World Use Case: Prompt Engineering Studio**
   - System prompt at root
   - Multiple user prompts as siblings
   - Compare AI responses side-by-side

---

## Part 4: Customizing Træk — Themes, i18n, and Custom Nodes

**Subtitle:** *Making Træk feel like it was built for your app*

**Estimated reading time:** 20 min
**Difficulty:** Intermediate
**Deliverable:** Branded, themed, internationalized Træk integration

### Outline

1. **The CSS Custom Property System**
   - `--traek-*` properties overview
   - Dark theme by default — why and how to change it
   - Color palette, typography, spacing tokens
   - Building a light theme from scratch

2. **Creating Custom Node Components**
   - The component map API
   - Registering a custom renderer for a node type
   - Accessing node data in your custom component
   - Example: Code node with syntax highlighting

3. **The TextNode Component**
   - Markdown rendering (marked + DOMPurify)
   - Code blocks with highlight.js
   - Image support
   - Customizing the renderer

4. **Thought/Reasoning Panels**
   - THOUGHT node type for chain-of-thought
   - TraekNodeWrapper's thought panel support
   - Collapsible reasoning display

5. **Internationalization**
   - i18n configuration overview
   - Translating UI labels
   - RTL layout considerations

6. **Accessibility**
   - WCAG 2.1 AA compliance notes
   - Keyboard navigation
   - Screen reader support for canvas elements

---

## Part 5: Advanced Patterns — MCP, Persistence, and Production

**Subtitle:** *Deploying Træk in production with power-user features*

**Estimated reading time:** 25 min
**Difficulty:** Advanced
**Deliverable:** Production-ready Træk app with persistence and MCP integration

### Outline

1. **Version History and Snapshots**
   - VersionHistoryManager: export/import/diff
   - AutoSnapshotTimer for automatic saves
   - Restoring from a snapshot

2. **Persistence Strategies**
   - localStorage for single-user apps
   - Database persistence for multi-user
   - Zod schemas for snapshot validation
   - Migration between schema versions

3. **MCP Integration**
   - What is MCP (Model Context Protocol)?
   - Connecting Træk to MCP-compatible AI tools
   - Tool call nodes — visualizing AI tool use
   - Building a debugging view for MCP calls

4. **Framework Adapters**
   - `@traek/svelte` — native Svelte 5
   - `@traek/react` — React adapter
   - `@traek/vue` — Vue adapter
   - Writing your own adapter

5. **Performance at Scale**
   - Viewport intersection detection
   - Auto-height with ResizeObserver
   - Virtualization for large conversation trees
   - Map-based O(1) lookups in TraekEngine

6. **Production Checklist**
   - Security: DOMPurify for user content
   - Environment variables (OPENAI_API_KEY pattern)
   - Error boundaries and node error states
   - Monitoring streaming connections

7. **What's Next**
   - Community resources
   - Contributing to Træk
   - The Træk ecosystem roadmap

---

## Series Production Notes

- **Format:** Written tutorials + embedded CodeSandbox/StackBlitz for each part
- **Code repo:** `github.com/traek-dev/tutorial-series` (starter + finished branches per part)
- **Cross-posting:** dev.to, Hashnode, Medium (Developer Tools publication)
- **Newsletter:** One email per part, 2-week cadence = 10-week launch campaign
- **Localization:** EN first; DE, FR, JA in v2 if traction warrants
