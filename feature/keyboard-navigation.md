# Keyboard-First Navigation

Vim-artige und Arrow-Key-Navigation durch den Baum. Ermoeglicht schnelles Traversieren ohne Maus.

## Motivation

- Power-User wollen den Canvas ohne Maus navigieren
- Accessibility: Tastatursteuerung ist essentiell fuer Screen-Reader-Kompatibilitaet
- Spatial Layout + Baum-Struktur eignet sich natuerlich fuer directional Navigation

## Scope

### Navigations-Modi

#### Tree Navigation (Strukturell)

Navigation entlang der Baum-Struktur, unabhaengig von der visuellen Position:

| Taste              | Aktion                                                           |
| ------------------ | ---------------------------------------------------------------- |
| `j` / `ArrowDown`  | Naechster Sibling (oder erstes Kind wenn kein naechster Sibling) |
| `k` / `ArrowUp`    | Vorheriger Sibling (oder Parent wenn kein vorheriger Sibling)    |
| `h` / `ArrowLeft`  | Zum Parent-Node                                                  |
| `l` / `ArrowRight` | Zum ersten Child-Node                                            |
| `J` (Shift+j)      | Letzter Sibling                                                  |
| `K` (Shift+k)      | Erster Sibling                                                   |
| `g g`              | Zum Root-Node                                                    |
| `G`                | Zum letzten Leaf-Node im aktuellen Branch                        |

#### Canvas-Aktionen

| Taste     | Aktion                                              |
| --------- | --------------------------------------------------- |
| `Enter`   | Node aktivieren / fokussieren (centerOnNode)        |
| `Escape`  | Node deselektieren                                  |
| `i`       | Input-Feld fokussieren (Insert-Modus)               |
| `b`       | Branch von aktuellem Node erstellen                 |
| `/`       | Slash-Command Input oeffnen                         |
| `Space`   | Toggle Node expanded/collapsed (wenn implementiert) |
| `z z`     | Aktiven Node zentrieren                             |
| `+` / `-` | Zoom in/out                                         |
| `0`       | Zoom auf 100% zuruecksetzen                         |

#### Quick-Jump

| Taste   | Aktion                                                                               |
| ------- | ------------------------------------------------------------------------------------ |
| `1`-`9` | Zum n-ten Root-Thread springen                                                       |
| `f`     | "Find Node" — Fuzzy-Suche ueber Node-Content, Ergebnis-Liste mit `j`/`k` navigierbar |

### Visueller Fokus-Indikator

- Dicker Outline-Ring um den fokussierten Node (anders als "aktiv/selektiert")
- Keyboard-Fokus ist unabhaengig vom aktiven Node: Fokus = "wo bin ich", aktiv = "worauf antworte ich"
- Bei Navigation: Kamera folgt dem Fokus mit Smooth-Scroll (`centerOnNode`)

### Keybinding-Anzeige

- `?` zeigt ein Help-Overlay mit allen Keybindings
- Overlay schliesst mit `Escape` oder erneutem `?`
- Optional: Keybinding-Hints als Tooltip auf Nodes (deaktivierbar)

## Technische Details

### KeyboardNavigator Klasse

```typescript
class KeyboardNavigator {
	/** Currently focused node ID (separate from engine.activeNodeId). */
	focusedNodeId = $state<string | null>(null);
	/** Whether keyboard navigation is active (false when input is focused). */
	enabled = $state(true);
	/** Pending chord key (e.g. first 'g' of 'gg'). */
	private pendingChord: string | null = null;

	constructor(engine: TraekEngine, centerOnNode: (node: Node) => void);

	/** Handle keydown events. Returns true if the event was consumed. */
	handleKeydown(e: KeyboardEvent): boolean;

	/** Navigate to parent. */
	goToParent(): void;
	/** Navigate to first child. */
	goToFirstChild(): void;
	/** Navigate to next sibling. */
	goToNextSibling(): void;
	/** Navigate to previous sibling. */
	goToPrevSibling(): void;
	/** Navigate to root. */
	goToRoot(): void;
	/** Navigate to deepest leaf in current branch. */
	goToLeaf(): void;

	/** Activate the focused node (set as reply target). */
	activate(): void;
	/** Clear focus. */
	blur(): void;
}
```

### Integration in TraekCanvas

- Neuer Prop: `keyboardNavigation?: boolean` (default: `false` fuer Backwards-Compatibility)
- `KeyboardNavigator` wird erstellt wenn `keyboardNavigation` aktiv ist
- Globaler `keydown`-Listener auf dem Viewport-Element
- Deaktiviert wenn Input-Feld fokussiert ist (`enabled = false`)
- `InputActionsContext` wird um `navigator: KeyboardNavigator | null` erweitert

### Chord-System

Fuer Multi-Key-Shortcuts (`gg`, `zz`):

- Erster Tastendruck speichert `pendingChord`
- Timeout (500ms): wenn kein zweiter Tastendruck, wird `pendingChord` verworfen
- Zweiter Tastendruck: Chord ausfuehren und `pendingChord` zuruecksetzen

## Aenderungen an bestehenden Dateien

| Datei                   | Aenderung                                                                                        |
| ----------------------- | ------------------------------------------------------------------------------------------------ |
| `TraekCanvas.svelte`    | `keyboardNavigation` Prop, Navigator-Lifecycle, Keydown-Handler, Fokus-Indikator CSS             |
| `TraekEngine.svelte.ts` | Helper-Methoden: `getSiblings(nodeId)`, `getChildren(nodeId)`, `getParent(nodeId)`, `getRoots()` |
| `index.ts`              | Neue Exports                                                                                     |

## Neue Dateien

| Datei                                          | Beschreibung       |
| ---------------------------------------------- | ------------------ |
| `src/lib/keyboard/KeyboardNavigator.svelte.ts` | Navigator-Klasse   |
| `src/lib/keyboard/KeybindingsOverlay.svelte`   | Help-Overlay (`?`) |

## Offene Fragen

- Vim-Bindings (`hjkl`) standardmaessig aktiv oder opt-in? (koennten mit Text-Input kollidieren)
- Soll Fokus und Selektion/Aktiv getrennt bleiben oder zusammengefuehrt werden?
- Arrow-Key-Navigation: Rein strukturell (Baum) oder auch spatial (naechster Node in Richtung)?
- Accessibility: Welche ARIA-Attribute brauchen die Nodes? (`role="treeitem"`, `aria-selected`, etc.)

## Verifikation

1. `j`/`k`/`h`/`l` navigiert korrekt durch den Baum
2. `Enter` aktiviert Node, `Escape` deselektiert
3. `i` fokussiert Input, danach sind Vim-Keys deaktiviert
4. `gg` springt zum Root, `G` zum Leaf
5. `?` zeigt/schliesst Help-Overlay
6. Kamera folgt dem Fokus smooth
7. Ohne `keyboardNavigation`-Prop: kein Einfluss auf bestehendes Verhalten
