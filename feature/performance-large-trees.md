# Performance & Virtualization for Large Trees

Node-Virtualisierung, inkrementelle Layout-Berechnung und Rendering-Optimierungen fuer 100+ Nodes.

## Motivation / User Story

**Als Entwickler** moechte ich Traek fuer lang laufende Agent-Workflows mit hunderten Nodes einsetzen koennen.

**Als AI-Agent-Entwickler** moechte ich dutzende parallele Branches in Echtzeit beobachten koennen.

### Warum wichtig?

- Ohne Virtualisierung rendert der Browser jeden Node im DOM
- Ab ~50-100 Nodes werden Layout-Berechnungen zum Bottleneck
- Agent-Workflows erzeugen schnell hunderte Nodes
- Performance-Probleme sind der haeufigste Grund, eine UI-Library zu verlassen

## Scope

### Was ist drin

#### Node Virtualization

- Nur Nodes im sichtbaren Viewport + Buffer-Zone rendern
- Placeholder-Elemente fuer nicht-sichtbare Nodes
- Konfigurierbar: `virtualization?: boolean | { buffer: number }`

#### Incremental Layout

- Layout nur fuer betroffene Subtrees
- Batching via requestAnimationFrame
- Optionaler Web Worker fuer > 500 Nodes

#### Connection Line Optimization

- Einzelnes SVG path statt individuelle Elemente
- Nur sichtbare Verbindungen rendern
- Vereinfachte Linien bei niedrigem Zoom

#### Lazy Content Loading

- Markdown-Parsing und Syntax-Highlighting nur on-demand
- Caching von geparsten Inhalten

### Was ist nicht drin

- SSR, Datenbank-Integration, Canvas2D/WebGL Rendering

## Akzeptanzkriterien

1. 500 Nodes: >= 30fps Pan/Zoom auf aktuellem Laptop
2. Max ~50-80 DOM-Elemente bei 500 Nodes im Baum
3. 500-Node Snapshot Import in < 2 Sekunden
4. Sublinearer Memory-Verbrauch
5. Streaming bei 200+ Nodes: < 16ms Frame-Time
6. Keine Regression bei < 50 Nodes
7. `virtualization={false}` als Opt-out

## Performance Budget

| Metrik                     | Ziel            |
| -------------------------- | --------------- |
| Frame Time (Pan/Zoom)      | < 16ms (60fps)  |
| DOM Node Count (500 Nodes) | < 200           |
| Memory (500 Nodes)         | < 100MB         |
| Layout Recalc              | < 5ms pro Frame |

## Neue Dateien

| Datei                                           | Beschreibung           |
| ----------------------------------------------- | ---------------------- |
| `src/lib/performance/ViewportTracker.svelte.ts` | Viewport-Filterung     |
| `src/lib/performance/LayoutWorker.ts`           | Web Worker fuer Layout |
| `src/lib/performance/NodePool.svelte.ts`        | Component Recycling    |

## Abhaengigkeiten

| Feature      | Beziehung                                                                |
| ------------ | ------------------------------------------------------------------------ |
| Persistence  | **Mittel** -- Import grosser Snapshots ist der Hauptanwendungsfall       |
| Minimap      | **Stark** -- Minimap braucht Zugriff auf alle Nodes, nicht nur sichtbare |
| Mobile/Touch | **Keine direkt** -- aber Mobile profitiert am meisten                    |

## Offene Fragen

- Virtualisierung per Default oder opt-in?
- Placeholder-Hoehe: feste Default oder gecacht?
- Web Worker: lohnt sich der Serialisierungs-Overhead?
- Connection Lines virtualisieren oder immer rendern?
