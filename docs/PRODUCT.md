# Traek -- Product Overview

## Was ist Traek?

Traek ist eine **Svelte 5 UI-Library** fuer raeumliche, baumstrukturierte AI-Konversationen. Statt Nachrichten in eine lineare Timeline zu zwingen, stellt Traek jede Nachricht als Node auf einem pannable/zoomable Canvas dar -- mit vollstaendigem Branching-Support.

**npm**: `traek`
**Repository**: github.com/gettraek/traek
**Lizenz**: MIT

## Aktuelle Features (v0.0.2)

### Core
- TraekCanvas: Pannable/zoomable Canvas
- TraekEngine: State-Management (Baum + Layout)
- Branching: Jederzeit von jedem Node
- Streaming-First: Token-by-token Rendering

### Rendering
- TextNode: Markdown (marked + DOMPurify), Syntax-Highlighting (highlight.js)
- Thought Nodes: Ausklappbare Reasoning-Panels
- Connection Lines

### Erweiterbarkeit
- Node Type System: Registry + Lifecycle-Hooks + NodeToolbar
- Smart Actions: ActionResolver, ActionBadges, SlashCommandDropdown
- Custom Component Map

### Theming
- 60+ CSS Custom Properties (--traek-*)
- Layer-basiert, leicht ueberschreibbar
- Dark Theme Default

## Roadmap-Zusammenfassung

### Phase 1 (4-6 Wochen)
- Conversation Persistence & Replay (in Entwicklung)
- Keyboard-First Navigation (spezifiziert)
- Accessibility Foundation (spezifiziert)

### Phase 2 (2-3 Monate)
- Mobile & Touch Support
- Performance & Virtualization
- Minimap, Enhanced Theming, Developer Experience

### Phase 3 (6+ Monate)
- Multi-User Collaboration
- Plugin Architecture, Export & Sharing
- Framework Adapters (React, Vue)

Detaillierte Roadmap: feature/roadmap.md

## Beitragen

### Setup
git clone, npm install, npm run dev

### Workflow
npm run check / lint / test:unit / test:e2e

### Konventionen
- Svelte 5 Runes, Tabs, Single Quotes, 100 Zeichen
- CSS: --traek-* Prefix
- TypeScript Strict Mode

### Wo anfangen?
- Feature-Specs in feature/ ohne Implementierung
- Tests: Abdeckung erhoehen
- Storybook-Stories ergaenzen
