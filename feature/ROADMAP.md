# Traek — Product Roadmap

**Erstellt:** 2026-02-15
**Zuletzt aktualisiert:** 2026-02-16
**Status:** VERBINDLICH — Dies ist die einzige, kanonische Roadmap fuer das Projekt.

---

## Vision

Traek is the **spatial conversation engine** for AI-native applications. Where every other chat UI forces thinking into a linear timeline, Traek turns conversations into navigable, branching structures on a pannable canvas.

The long-term goal: become the **standard infrastructure layer** for non-linear AI interaction.

What makes Traek unique:

- **Tree-native**: Branching is a first-class concept, not a hack on top of a linear list
- **Spatial-first**: Conversations have topology, not just chronology
- **Streaming-ready**: Built for real-time token-by-token rendering within a spatial layout
- **Unopinionated rendering**: The engine handles structure; developers control how nodes look and behave
- **Svelte 5**: Reactive by default, leveraging runes for fine-grained state management

---

## Guiding Principles

1. **Ship foundations before features** — Architecture and core reliability precede expansion.
2. **Stay library-shaped** — Composable, opt-in, no opinions on surrounding app structure.
3. **Developer experience is a feature** — 15 minutes to a working prototype.
4. **Spatial-first, always** — Conversations have topology, not just chronology.

---

## Abgeschlossen

Alle bisherigen Phasen sind vollstaendig implementiert und geprueft.

| Phase | Item | Status |
|-------|------|--------|
| -2 | Zod Integration (Runtime Validation) | ✅ |
| -1 | DAG-Migration (Multi-Parent Support) | ✅ |
| 0 | Quick Wins (Touch Targets, Multi-Line Input, Action Badges, Connection Fading, Error Visibility, Empty State) | ✅ |
| **1** | 1.1 Engine Unit-Test-Suite | ✅ |
| **1** | 1.2 Node-ID-Map + Children-Map-Cache (O(1) Lookups) | ✅ |
| **1** | 1.3 Undo fuer Delete + Toast-System | ✅ |
| **1** | 1.4 Inline-Edit (statt window.prompt) | ✅ |
| **1** | 1.5 Header-Cleanup + Micro-Interactions | ✅ |
| **1** | 1.6 Contextual Branching Hint | ✅ |
| **2** | 2.1 Canvas-Dekomposition (CanvasInteraction, InputForm, ViewportManager, NodeRenderer) | ✅ |
| **2** | 2.2 Zoom-to-Fit + Minimap + Zoom-Controls | ✅ |
| **2** | 2.3 Context-Path Breadcrumb (Desktop) | ✅ |
| **2** | 2.4 Subtree Collapse + Branch-Count-Badge | ✅ |
| **2** | 2.5 Keyboard Navigation + ARIA Foundation | ✅ |
| **2** | 2.6 Conversation Persistence UI (IndexedDB, Auto-Save, Chat-Liste, Export) | ✅ |
| **2** | 2.7 Smart Search (Ctrl+F) | ✅ |
| **3** | 3.1 ConnectionLayer Single-Pass + Markdown-Streaming-Optimierung | ✅ |
| **3** | 3.2 DOM-Virtualisierung (ViewportTracker) | ✅ |
| **3** | 3.3 Branch-Vergleich (Side-by-Side, Word-Level-Diff) | ✅ |
| **3** | 3.4 Copy Branch to Clipboard (Markdown-Pfad) | ✅ |
| **3** | 3.5 Performance-Benchmarks + CI-Guard | ✅ |
| **4** | 4.1 Onboarding Tour (Desktop, 7-Step) | ✅ |
| **4** | 4.2 Design-Token-System (Theme-Objekte, High-Contrast, Runtime API) | ✅ |
| **4** | 4.3 Adaptives Zoom-Level-Rendering | ✅ |
| **4** | 4.4 Mobile Focus Mode (10 Komponenten, UX 9.2/10) | ✅ |
| BL | Keyboard Phase 2: Chords, Quick-Jump, Fuzzy-Suche | ✅ |
| BL | Tag-System + Filter (TagBadges, TagDropdown, TagFilter) | ✅ |
| BL | Replay-Modus UI (ReplayController, ReplayControls) | ✅ |
| BL | Ghost-Preview (Vorschau neuer Nodes) | ✅ |
| BL | Theme-Presets + Custom Accent-Farbe (ThemeProvider, ThemePicker) | ✅ |
| BL | Node Edit & Re-Generate | ✅ |
| BL | Connection-Lines aufwerten (Gradients, Hover, Highlighting) | ✅ |
| BL | Storybook-Grundausstattung | ✅ |
| Fix | HeaderBar: Reactive Branch Badge, Connection Hover Highlighting | ✅ |
| Fix | Zoom Transitions: Smooth Scale/Offset | ✅ |
| Fix | Theme Consolidation: Old ThemeToggle entfernt, unified ThemeProvider | ✅ |

---

## Current State (v0.0.2)

### Library Exports (`src/lib/index.ts`)

**Core:** TraekCanvas, TextNode, DefaultLoadingOverlay

**Engine:** TraekEngine, DEFAULT_TRACK_ENGINE_CONFIG, wouldCreateCycle + Types (TraekEngineConfig, MessageNode, Node, NodeStatus, AddNodePayload, TraekNodeComponentProps, NodeComponentMap)

**Actions:** ActionBadges, SlashCommandDropdown, ActionResolver + Types (ActionDefinition, ResolveActions)

**Node Types:** NodeTypeRegistry, createDefaultRegistry, textNodeDefinition, thoughtNodeDefinition + Types (NodeTypeDefinition, NodeTypeAction, ActionVariant)

**Default Actions:** duplicateAction, deleteAction, createRetryAction, createEditAction, createDefaultNodeActions

**Persistence & Replay:** ReplayController, ReplayControls, ConversationStore, SaveIndicator, ChatList, snapshotToJSON, snapshotToMarkdown, downloadFile + Types (ConversationSnapshot, SerializedNode, StoredConversation, ConversationListItem, SaveState)

**Conversation UI:** HeaderBar

**Tags:** TagBadges, TagDropdown, TagFilter, PREDEFINED_TAGS, getNodeTags, getTagConfig, matchesTagFilter

**Toast:** ToastContainer, ToastComponent, toastStore, toast, toastUndo

**Mobile/Focus Mode:** FocusMode, PositionIndicator, SwipeAffordances, Toast, OnboardingOverlay, HomeButton, KeyboardCheatsheet, Breadcrumbs, ChildSelector, focusModeConfigSchema, DEFAULT_FOCUS_MODE_CONFIG

**Desktop Onboarding:** DesktopTour, TourStep

**Schemas (Zod):** serializedNodeSchema, conversationSnapshotSchema, saveStateSchema, storedConversationSchema, conversationListItemSchema, traekEngineConfigSchema, addNodePayloadSchema, actionDefinitionSchema, nodeTypeActionSchema, nodeTypeDefinitionSchema

**Theme System:** ThemeProvider, useTheme, applyThemeToRoot, ThemePicker, darkTheme, lightTheme, highContrastTheme, themes, DEFAULT_THEME, createCustomTheme + Token Types/Schemas (TraekTheme, TraekThemeColors, TraekThemeSpacing, TraekThemeRadius, TraekThemeTypography, TraekThemeAnimation)

---

## Phase 5: "Developer Platform" (6-9 Monate)

**Ziel:** Traek wird zur Go-to-Library fuer Spatial AI Interfaces — Framework-agnostic, gut dokumentiert, erweiterbar.

**Erfolgskriterien:**
- 10x TAM (React + Vue Developers erreichbar)
- <15 Min Time-to-First-Prototype
- Erste 5-10 Community Plugins live
- 5000+ GitHub Stars, 1000+ npm Downloads/Woche

### 5.1 Developer Experience Overhaul (ICE: 28/30)

**Zeitrahmen:** 2-4 Wochen | **Aufwand:** S-M | **Dependencies:** Keine

**Deliverables:**
1. **API-Dokumentation Site** (docs.traek.dev) — Getting Started, API Reference, Konzepte, TypeScript Types
2. **Integration Guides** — SvelteKit, OpenAI Streaming, Anthropic Claude, LangChain, Custom Node Types
3. **Example Repository** — 7 Beispiele (basic-chat, openai-streaming, custom-nodes, persistence, mobile, theming, advanced-layout)
4. **Interactive Playground** — CodeSandbox/StackBlitz Integration

**Success Metrics:** Time-to-First-Prototype < 15 Min, Support-Anfragen -80%

---

### 5.2 Plugin Architecture & Extension API (ICE: 23/30)

**Zeitrahmen:** 3-6 Monate | **Aufwand:** L | **Dependencies:** 5.1

**Problem:** Developer wollen Custom Features (PDF Viewer, Mermaid Diagrams, Voice Memos), muessen aktuell Source Code forken.

**Loesung:** Standardisiertes Plugin System aufbauend auf `NodeTypeRegistry`:
- `defineNodeTypePlugin()` API fuer Custom Node Types mit Lifecycle Hooks
- Plugin Loader: `<TraekCanvas {plugins} />`
- Plugin Hooks: `onNodeCreate`, `onNodeRender`, `onActionExecute`, `onLayoutUpdate`, `onExport`
- Plugins als NPM Packages (`traek-plugin-*`)

**Erste offizielle Plugins:** PDF Viewer, Mermaid Diagrams, Code Interpreter, Voice Memo, Table

**Technische Bewertung:** `NodeTypeRegistry` ist bereits erweiterbar genug als Basis. Plugin API ergaenzt Lifecycle Hooks und Action-Registration.

---

### 5.3 Framework Adapters — React, Vue, Web Components (ICE: 21/30)

**Zeitrahmen:** 6-12 Monate | **Aufwand:** XL | **Dependencies:** 5.1, 5.2

**Architektur:**
1. **Core Extraction** (Monate 1-3): `@traek/core` — TraekEngine als Plain TS ohne Svelte Runes
2. **React Adapter** (Monate 3-6): `@traek/react` — React Hooks + Components
3. **Vue Adapter** (Monate 6-9): `@traek/vue` — Composition API + Components
4. **Web Components** (Monate 9-12): `@traek/web-components` — Framework-agnostic

**Technische Bewertung:** Core Extraction ist Aufwand L (3-4 Wochen). Hauptrisiko: TraekEngine nutzt Svelte 5 `$state` Runes intern — muessen durch framework-agnostige Reactive Primitives ersetzt werden.

---

### 5.4 Community Templates & Starter Kits (ICE: 25/30)

**Zeitrahmen:** 1-2 Wochen | **Aufwand:** S | **Dependencies:** Keine

**Templates:** Blank Canvas, Brainstorming, Pros & Cons, Decision Matrix, Research Tree, Weekly Review, Project Planning, Compare Options

**Implementation:** `src/lib/templates/index.ts`, Template Gallery UI bei "New Conversation", `engine.loadTemplate()` API

---

## Phase 6: "AI-Native Intelligence" (6-12 Monate)

**Ziel:** Traek wird zum "intelligenten Canvas" — KI unterstuetzt bei Organisation, Discovery und Exploration.

**Erfolgskriterien:**
- AI-Features verbessern User Retention um 30%+
- 80%+ User nutzen mindestens 1 AI-Feature
- "The Canvas that thinks with you"

### 6.1 AI-Aware Auto-Layout Engine (ICE: 16/30)

**Zeitrahmen:** 9-12 Monate | **Aufwand:** XL | **Dependencies:** 5.1, Embeddings-Infrastructure

1. **Semantic Grouping** — AI erkennt thematische Cluster, Auto-Grouping mit Labels
2. **Force-Directed Layout + AI-Tweaks** — Nodes mit aehnlichen Embeddings naeher platziert
3. **Auto-Organize Button** — AI analysiert alle Nodes, Canvas wird neu arrangiert

**Tech Stack:** OpenAI text-embedding-3-small oder Cohere, K-Means/DBSCAN Clustering, D3-force Layout

---

### 6.2 Semantic Search & Discovery (ICE: 22/30)

**Zeitrahmen:** 2-3 Monate | **Aufwand:** M | **Dependencies:** Embeddings-Infrastructure

1. **Embedding-Based Search** — "Login" findet auch "Authentication", "Sign in"
2. **"Similar Nodes" Feature** — Rechtsklick → "Find similar"
3. **Visual Discovery** — Nodes mit hoher Similarity bekommen visuellen Link

---

### 6.3 Auto-Branch-Suggestions (ICE: 20/30)

**Zeitrahmen:** 3-4 Monate | **Aufwand:** M | **Dependencies:** 5.1, LLM-Integration

1. **Proaktive Branching-Hints** — AI schlaegt 3 Branches vor bei Multi-Option-Fragen
2. **"Explore Alternatives" Button** — Nach AI-Antwort: 2-3 alternative Antworten generieren

---

## Phase 7: "Enterprise & Scale" (12-18 Monate)

**Ziel:** Traek wird zur B2B SaaS Platform mit Collaboration, Hosting und Enterprise Features.

**Erfolgskriterien:**
- $500K-1M ARR innerhalb 18 Monate
- 10-20 Enterprise Kunden (50+ Seats)

### 7.1 Multi-User Collaboration (ICE: 17/30)

**Zeitrahmen:** 12-18 Monate | **Aufwand:** XXL | **Dependencies:** 7.2, 7.3

**Tech Stack:** CRDT (Yjs/Automerge), WebSocket (Supabase Realtime/Liveblocks), PostgreSQL

**Features:** Live Cursors, Live Editing, Presence Indicators, Permissions & Sharing, Comment Threads

---

### 7.2 SaaS Hosting Platform — traek.io (ICE: 17/30)

**Zeitrahmen:** 6-12 Monate | **Aufwand:** XL | **Dependencies:** 7.1

**Pricing:** Free ($0, 3 Canvas) | Pro ($12/mo, unlimited) | Team ($49/mo, 10 Users) | Enterprise (custom)

**Tech Stack:** SvelteKit + Vercel, Supabase (Auth, DB, Realtime), Stripe (Payments)

---

### 7.3 Enterprise Auth & Compliance (ICE: 19/30)

**Zeitrahmen:** 4-6 Monate | **Aufwand:** L | **Dependencies:** 7.2

SSO (Okta, Azure AD), RBAC (Admin/Editor/Viewer/Guest), Audit Logs, GDPR, optional SOC2

---

## UX-Schulden & Quick Wins (parallel zu Phase 5)

Die meisten UX-Items (UX-01 bis UX-13) sind implementiert. Verbleibende Arbeit:

| Item | Beschreibung | Prioritaet | Status |
|------|-------------|------------|--------|
| Onboarding vereinfachen | Tour von 7 auf 5 Core-Schritte reduzieren | P0 | Offen |
| Empty State verbessern | Inspiration + Beispiel-Prompts statt generischem Text | P0 | Offen |
| Progressive Disclosure | Feature Spotlights nach Nutzungsmilestones | P1 | Offen |
| Help Button (permanent) | Bottom-right, Tips + Tour-Restart + Shortcuts | P1 | Offen |
| Mobile Search | Search in FocusMode (fehlt komplett) | P1 | Offen |
| Multi-line Input (Desktop) | Textarea mit Auto-Expand statt single-line input | P1 | Offen |
| Touch Targets 44px | Mobile Action Badges + Node Headers vergroessern | P1 | Teilweise |
| Screen Reader Tests | VoiceOver + NVDA Tests, Ergebnisse dokumentieren | P1 | Offen |
| Mobile Branch Compare | Vereinfachte Version fuer FocusMode | P2 | Offen |
| Mode-Transition Overlay | Erklaerung bei Canvas/FocusMode Wechsel | P2 | Offen |
| Error States prominent | Rote Border + Error Banner + Retry Button | P2 | Teilweise |
| Quick Jump Dropdown | Node-Liste mit Content-Preview zum Navigieren | P2 | Offen |

---

## Brand & Design Initiativen (parallel zu Phase 5)

### Design Token Evolution (Prioritaet: Critical)

Aktuelles Token-System ist funktional (7/10), aber es fehlen:
- **Elevation System** — Z-Axis Depth (Shadows, Blur) fuer Nodes, Overlays, Modals
- **Gradient Library** — Accent-Gradients, Depth Backgrounds, Glow Effects
- **Motion Tokens** — Easing Functions, Duration Scale, Spring Physics
- **Erweiterte Farbskala** — Full Scales (50-950) fuer Cyan, Orange, Lime + neue Purple, Amber
- **Semantic Color Layer** — `color-bg-primary` statt hardcoded Hex-Werte

### Connection Visual Enhancement (Prioritaet: High)

- Organischere Bezier-Kurven (asymmetrische Control Points)
- Animated Particles beim Streaming (SVG animateMotion)
- Stronger Gradient-Strokes auf Active Path
- Improved Hover States mit drop-shadow

### Icon System (Prioritaet: High)

Aktuell: Kein konsistentes Icon-System (3/10), inline SVGs verstreut.
Bedarf: ~30 Icons in 3 Kategorien (Node Types, Actions, Navigation).
Style: Outline (2px stroke), 16x16 + 24x24, rounded corners.
Empfehlung: Iconify + Custom fuer Traek-spezifische Icons.

---

## Gesamtplan-Uebersicht (Phase 5-7)

| Phase | Item | Aufwand | Zeitrahmen | ICE | Dependencies |
|-------|------|---------|------------|-----|--------------|
| **5** | 5.1 Developer Experience | S-M | 2-4 Wo | **28** | - |
| **5** | 5.4 Community Templates | S | 1-2 Wo | **25** | - |
| **5** | 5.2 Plugin Architecture | L | 3-6 Mo | **23** | 5.1 |
| **5** | 5.3 Framework Adapters | XL | 6-12 Mo | **21** | 5.1, 5.2 |
| **6** | 6.2 Semantic Search | M | 2-3 Mo | **22** | Embeddings |
| **6** | 6.3 Auto-Branch-Suggestions | M | 3-4 Mo | **20** | 5.1, LLM |
| **6** | 6.1 AI-Aware Auto-Layout | XL | 9-12 Mo | **16** | Embeddings |
| **7** | 7.3 Enterprise Auth | L | 4-6 Mo | **19** | 7.2 |
| **7** | 7.1 Multi-User Collaboration | XXL | 12-18 Mo | **17** | 7.2, 7.3 |
| **7** | 7.2 SaaS Hosting Platform | XL | 6-12 Mo | **17** | 7.1 |

**Kritischer Pfad:**
1. **Jetzt:** 5.1 DX + 5.4 Templates (parallel, 4 Wochen)
2. **Monat 2-6:** 5.2 Plugin Architecture (parallel zu 5.3 Start)
3. **Monat 4-12:** 5.3 Framework Adapters
4. **Monat 6-18:** Phase 6 (parallel zu 5.3)
5. **Monat 12-24:** Phase 7

**Empfohlene Richtung:** Hybrid (Developer Platform + SaaS) — "Figma-Modell": Open Source fuer Developers, SaaS fuer Teams.

---

## Risiken & Mitigation

| Risiko | Wahrscheinlichkeit | Impact | Mitigation |
|--------|---------------------|--------|------------|
| Framework Adapters zu komplex | Hoch | Hoch | Community Contributors, gut dokumentierte Core API |
| Plugin System wird nicht genutzt | Mittel | Hoch | Erste 5 offizielle Plugins als Inspiration |
| AI-Layout funktioniert nicht gut | Hoch | Mittel | Immer Manual Override, AI ist optional |
| Collaboration Bugs (CRDT Konflikte) | Hoch | Hoch | Extensive Testing, Fallback zu Reload |
| Svelte Runes blockieren Core Extraction | Mittel | Hoch | Frueh Spike/PoC fuer @traek/core |
| Maintenance Overhead (3 Frameworks) | Hoch | Mittel | Automated Testing, Community Maintenance |

---

## Verifizierung

Nach jeder Phase:

1. `npm run check` — TypeScript-Fehlerfreiheit
2. `npm run test:unit` — Alle Unit-Tests bestehen
3. `npm run build` — Library baut erfolgreich
4. `npm run lint` — Keine Linting-Fehler
5. Manuelle Pruefung der Demo unter `/demo`
6. Stichproben auf Mobile Safari + Chrome
