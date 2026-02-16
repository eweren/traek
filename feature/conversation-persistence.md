# Conversation Persistence & Replay

Serialisierung/Deserialisierung des gesamten Baums (JSON-Export/Import), plus ein "Replay"-Modus der den Gespraechsverlauf Schritt fuer Schritt animiert.

## Motivation

- Nutzer wollen Conversations speichern, teilen und spaeter fortsetzen
- Replay eignet sich fuer Demos, Reviews und Debugging von AI-Workflows
- Export/Import ermoeglicht Migration zwischen Instanzen

## Scope

### Persistence (Export/Import)

- **JSON-Serialisierung** des gesamten TraekEngine-State:
  - Alle Nodes mit Content, Metadata, Positionen, Parent-Child-Beziehungen
  - Viewport-State (Scale, Offset)
  - Active Node ID
  - Custom Node Data (`node.data`)
- **`engine.serialize(): ConversationSnapshot`** — gibt den vollstaendigen State als JSON-serialisierbares Objekt zurueck
- **`TraekEngine.fromSnapshot(snapshot): TraekEngine`** — statische Factory die einen Engine aus einem Snapshot erstellt
- **Download/Upload UI** (optional, als separate Komponente):
  - "Export as JSON" Button
  - Drag-and-drop oder File-Picker fuer Import
- **Versionierung**: Schema-Version im Snapshot fuer Forward-Compatibility

### Replay-Modus

- **`ReplayController`** Klasse:
  - `play()`, `pause()`, `step()`, `seekTo(index)`, `setSpeed(multiplier)`
  - Baut den Baum Node fuer Node auf, in chronologischer Reihenfolge
  - Simuliert Streaming fuer Assistant-Nodes (Zeichen fuer Zeichen)
- **Replay-UI** (Snippet oder Komponente):
  - Play/Pause Button
  - Scrubber/Timeline-Bar
  - Speed-Control (0.5x, 1x, 2x, 5x)
  - Step-Forward/Back Buttons
- **Kamera**: Automatisches `centerOnNode()` beim Abspielen jedes neuen Nodes
- **Chronologische Ordnung**: Nodes werden nach Erstellungszeit sortiert (benoetigt `createdAt` Timestamp auf Nodes)

## Technische Details

### ConversationSnapshot Type

```typescript
interface ConversationSnapshot {
	version: 1;
	createdAt: number;
	title?: string;
	config: Partial<TraekEngineConfig>;
	viewport: { scale: number; offsetX: number; offsetY: number };
	activeNodeId: string | null;
	nodes: SerializedNode[];
}

interface SerializedNode {
	id: string;
	parentId: string | null;
	content: string;
	role: 'user' | 'assistant' | 'system';
	type: string;
	status: NodeStatus;
	createdAt: number;
	metadata: { x: number; y: number; height?: number };
	data?: unknown;
}
```

### Aenderungen an bestehenden Dateien

| Datei                   | Aenderung                                                     |
| ----------------------- | ------------------------------------------------------------- |
| `TraekEngine.svelte.ts` | `serialize()`, `static fromSnapshot()`, `createdAt` auf Nodes |
| `TraekCanvas.svelte`    | Optionaler `replayController` Prop, Replay-UI Snippet-Slot    |
| `index.ts`              | Neue Exports                                                  |

### Neue Dateien

| Datei                                            | Beschreibung                                   |
| ------------------------------------------------ | ---------------------------------------------- |
| `src/lib/persistence/types.ts`                   | `ConversationSnapshot`, `SerializedNode` Types |
| `src/lib/persistence/ReplayController.svelte.ts` | Replay-Logik mit `$state`                      |
| `src/lib/persistence/ReplayControls.svelte`      | Default Replay-UI                              |

## Offene Fragen

- Soll `createdAt` als Breaking Change auf `Node` hinzugefuegt werden oder optional bleiben?
- Replay: Streaming-Simulation mit echtem Timing oder vereinfacht (feste Geschwindigkeit)?
- Soll der Snapshot auch Custom Component References enthalten (nicht serialisierbar) oder nur den Type-String?
- Max. Snapshot-Groesse? Kompression (z.B. gzip) fuer grosse Conversations?

## Verifikation

1. Export einer Demo-Conversation → JSON pruefen
2. Import des JSON in eine leere Engine → identischer Baum
3. Replay abspielen → Nodes erscheinen chronologisch mit Kamera-Follow
4. Replay pausieren, step, speed aendern → korrekt
5. Edge Case: leerer Baum, einzelner Node, 100+ Nodes
