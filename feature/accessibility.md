# Accessibility Foundation

ARIA-Semantik, Screen-Reader-Support und barrierefreie Interaktion fuer den Traek Canvas.

## Motivation / User Story

**Als Entwickler** moechte ich Traek in Anwendungen einsetzen, die WCAG 2.1 AA erfuellen muessen, **damit** meine Nutzer mit Behinderungen die Conversation-UI vollstaendig bedienen koennen.

**Als Nutzer mit Sehbehinderung** moechte ich die Baumstruktur meiner AI-Konversation mit einem Screen Reader navigieren koennen, **damit** ich Branches, Antworten und den aktuellen Kontext verstehe.

**Als Nutzer mit motorischen Einschraenkungen** moechte ich alle Canvas-Interaktionen per Tastatur ausfuehren koennen, **damit** ich nicht auf Maus oder Touch angewiesen bin.

### Warum jetzt?

- Accessibility ist keine optionale Ergaenzung -- sie ist eine Voraussetzung fuer Unternehmen, Behoerden und regulierte Branchen
- Keyboard Navigation (separates Feature) liefert die Interaktions-Schicht; dieses Feature liefert die semantische Schicht
- Je spaeter Accessibility nachgeruestet wird, desto teurer wird es

## Scope

### Was ist drin

#### ARIA Tree Semantics
- Canvas-Container: `role="tree"`, `aria-label="Conversation tree"`
- Jeder Node: `role="treeitem"`, `aria-level`, `aria-setsize`, `aria-posinset`
- Nodes mit Kindern: `aria-expanded="true|false"`
- Aktiver Node: `aria-selected="true"` oder `aria-current="true"`

#### Live Regions fuer dynamische Updates
- Streaming-Status: `aria-live="polite"` Region die "Assistant is typing..." ankuendigt
- Node-Erstellung: Ankuendigung wenn ein neuer Node hinzugefuegt wird
- Fehler: `aria-live="assertive"` fuer Fehlermeldungen

Streaming-Strategie (nicht jedes Token ankuendigen):
1. Beginn: "Assistant is responding"
2. Alle 5 Sekunden: "Assistant is still responding"
3. Ende: "Assistant response complete, [Wortanzahl] words"

#### Focus Management
- Logische Tab-Reihenfolge: Canvas -> aktiver Node -> Input-Feld
- `tabindex="0"` auf Canvas-Container, `tabindex="-1"` auf einzelnen Nodes
- Fokus-Wiederherstellung nach Modal/Overlay-Schliessung

#### Reduced Motion
- `@media (prefers-reduced-motion: reduce)` respektieren
- Konfigurierbar via `reducedMotion?: boolean | 'auto'` Prop (default: `'auto'`)

#### Color & Contrast
- Default-Theme: WCAG AA Kontrast (4.5:1 fuer Text, 3:1 fuer UI-Elemente)
- Fokus-Indikatoren: mindestens 3:1 Kontrast, nicht nur Farbe sondern auch Form
- High-Contrast-Theme Preset

### Was ist nicht drin

- Vollstaendige Screen-Reader-Tests mit JAWS/NVDA/VoiceOver
- Automatisierte WCAG-Compliance-Tests in CI
- Touch-Accessibility (wird in Mobile/Touch behandelt)
- Cognitive Accessibility

## Akzeptanzkriterien

1. VoiceOver auf macOS kann die Baumstruktur navigieren und liest Node-Rolle, -Inhalt und -Position korrekt vor
2. Waehrend Streaming kuendigt eine Live-Region den Status an ohne Token-Spam
3. Keyboard-Fokus ist jederzeit visuell erkennbar
4. Mit `prefers-reduced-motion: reduce` sind alle Animationen deaktiviert
5. Kein Text im Default-Theme hat weniger als 4.5:1 Kontrastratio
6. Bestehende Maus/Touch-Interaktionen funktionieren unveraendert
7. ARIA-Attribute deaktivierbar via `aria?: boolean` Prop

## Technische Details

### Aenderungen an bestehenden Dateien

| Datei | Aenderung |
|-------|-----------|
| `TraekCanvas.svelte` | ARIA-Attribute, Live-Region-Container, `reducedMotion` und `aria` Props |
| `TraekNodeWrapper.svelte` | `role="treeitem"`, `aria-level`, `aria-expanded`, `aria-selected`, `tabindex` |
| `TraekEngine.svelte.ts` | Helper: `getNodeDepth(id)`, `getNodeIndex(id)` |
| `TextNode.svelte` | Reduced-motion CSS, Kontrast-Fixes |
| `src/app.css` | `@media (prefers-reduced-motion)` Block |

### Neue Dateien

| Datei | Beschreibung |
|-------|-------------|
| `src/lib/a11y/LiveRegion.svelte` | Aria-live Container |
| `src/lib/a11y/announce.ts` | `announce(message, priority)` Utility |
| `src/lib/a11y/types.ts` | Accessibility-Config Types |

## Abhaengigkeiten

| Feature | Beziehung |
|---------|-----------|
| Keyboard Navigation | **Stark** -- ARIA + Keyboard muessen zusammen funktionieren. Ideal: parallel entwickeln. |
| Node Type System | **Schwach** -- Custom Types muessen ARIA-Attribute erben koennen. |
| Conversation Persistence | **Keine** |

## Offene Fragen

- Canvas als `role="tree"` oder `role="application"`?
- Thought-Nodes: eigene Treeitem oder Detail des Parent?
- Branch-Punkte: eigenes ARIA-Konzept oder `aria-expanded` + Kinder?
