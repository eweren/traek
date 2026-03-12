# UX-Spezifikation: Canvas-Annotationen (TRK-82)

**Datum:** 2026-03-08
**Feature:** Sticky Notes, Freeform Markers, Region Pins
**Status:** Spezifikation bereit für Implementierung

---

## 1. Überblick

Annotationen sind eine **separate Ebene** auf dem Traek-Canvas, die nutzergenerierte Notizen, Markierungen und Pins enthält. Sie liegen **über** den Verbindungslinien, aber **unter** den Nodes (damit Nodes immer interagierbar bleiben). Annotationen werden zusammen mit dem Canvas gespeichert und als Metadata in `ConversationSnapshot` persistiert.

### Annotationstypen

| Typ | Zweck | Analogie |
|-----|-------|----------|
| **Sticky Note** | Freitextnotizen, angeheftet am Canvas | Post-it |
| **Highlight Marker** | Freiformige farbige Markierungen/Unterstreichungen | Leuchtmarker |
| **Region Pin** | Kommentare an einem Punkt verankert | Map-Pin mit Sprechblase |

---

## 2. Modus-Konzept

Das Canvas kennt zwei Zustände:

- **Navigate Mode** (Standard): Panning, Zooming, Node-Interaktion wie bisher
- **Annotate Mode**: Werkzeugpalette aktiv, Klicks und Drags erstellen Annotationen

### Modus-Umschaltung

**Einstiegspunkte:**
- Button links unten (neben ZoomControls), Icon: Stift/Pinsel, Label „Annotieren" (Tooltip)
- Tastaturkurzbefehl: `A` (wenn Viewport fokussiert, nicht im Eingabefeld)
- Touch: Langer Druck auf leere Canvas-Fläche → Kontextmenü mit „Notiz hier einfügen"

**Austritt aus Annotate Mode:**
- `Escape`
- Erneutes Klicken des Annotate-Buttons
- Klick auf einen Node (setzt in Navigate Mode zurück)

**Visuelles Feedback beim Moduswechsel:**
- Canvas-Rand zeigt schmalen farbigen Rahmen (`--traek-annotation-mode-ring`, Default: leichtes Lila `#8b5cf6`)
- Cursor wechselt von `grab` → `crosshair`
- ARIA Live Region: „Annotationsmodus aktiv. Klicken zum Erstellen einer Notiz."

---

## 3. Werkzeugpalette

Im Annotate Mode erscheint eine **vertikale Werkzeugpalette** links am Canvas, mittig vertikal. Sie hat 4 Elemente:

```
┌──────────────┐
│  📝 Sticky    │  (Notiz-Werkzeug, Default)
│  🖊  Marker   │  (Freihand-Marker)
│  📍 Pin       │  (Region-Pin)
├──────────────┤
│  🗑 Löschen  │  (Radierer / Löschen-Werkzeug)
└──────────────┘
```

- Aktives Werkzeug ist hervorgehoben (Border: `--traek-node-active-border`)
- Farbwähler erscheint neben der Palette wenn Sticky oder Marker aktiv: 5 Preset-Farben + keine Farbe

**Farben (CSS-Variablen):**
```css
--traek-annotation-yellow: #fef08a   /* Standard Sticky */
--traek-annotation-blue:   #bfdbfe
--traek-annotation-green:  #bbf7d0
--traek-annotation-pink:   #fbcfe8
--traek-annotation-orange: #fed7aa
--traek-annotation-marker-default: #fbbf24  /* Marker-Standard */
```

---

## 4. Sticky Notes

### Erstellen

1. Im Annotate Mode (Sticky-Werkzeug aktiv): **Doppelklick** auf leere Canvas-Fläche → Notiz erscheint am Klickort
2. Alternative: Einfacher Klick auf leere Fläche (wenn kein Node in Nähe ≤ 50px)
3. Sofort im Bearbeitungsmodus: Textarea fokussiert, Placeholder „Notiz hier eingeben…"

### Anatomie einer Sticky Note

```
┌─────────────────────────────┐   ← Drag-Handle (ganzer Header)
│  ⠿  Farb-Dot  [×]          │   ← Header: Grip-Icon, Farbwahl-Trigger, Close
├─────────────────────────────┤
│                             │
│  [Textarea]                 │   ← Auto-expand, min 80px, max 240px Höhe
│                             │
└─────────────────────────────┘
           ↕ Resize-Handle
```

- **Breite:** Fix 200px (skaliert mit Canvas)
- **Höhe:** Auto-resize (textarea wächst mit Inhalt, max 240px → dann scrollbar)
- **Resize:** Ziehbares Handle rechts unten zum manuellen Resize (wird in `annotation.width/height` gespeichert)
- **Rotation:** Zufällig ±3° beim Erstellen (wird gespeichert), optional deaktivierbar via Prop `annotationRotation={false}`
- **Z-Index:** Sticky Notes liegen über Markern, unter Pins

### Interaktion

| Aktion | Effekt |
|--------|--------|
| Klick auf leere Fläche der Note | Textarea fokussieren (Bearbeitungsmodus) |
| `Escape` in Textarea | Textarea verlassen, Note bleibt |
| Klick auf [×] | Note löschen (Undo verfügbar) |
| Drag am Header | Note verschieben |
| Resize-Handle ziehen | Note skalieren |
| Doppelklick auf Note (außerhalb Bearbeitungsmodus) | Bearbeitungsmodus |
| Klick auf Farb-Dot | Farbpicker-Popover |

### Tastatur (Note fokussiert)

- `Tab` / `Shift+Tab`: Zwischen Annotationen navigieren
- `Delete` / `Backspace` (wenn Textarea leer): Note löschen mit Bestätigungstoast
- `Escape`: Deselect / Bearbeitungsmodus verlassen

### Accessibility

```html
<article
  role="note"
  aria-label="Annotation: {truncatedText}"
  aria-roledescription="verschiebbare Notiz"
  tabindex="0"
>
  <header aria-label="Notiz-Header, ziehen zum Verschieben">
    <button aria-label="Farbe ändern">…</button>
    <button aria-label="Notiz löschen">×</button>
  </header>
  <textarea aria-label="Notizinhalt" aria-multiline="true">…</textarea>
</article>
```

---

## 5. Highlight Marker

### Erstellen

- Im Annotate Mode (Marker-Werkzeug aktiv): **Klick + Drag** auf Canvas → Freihandlinie wird gezeichnet
- `mousedown` → pfadsaufzeichnung beginnt, `mousemove` → Punkte sammeln, `mouseup` → Pfad fertigstellen
- Mindest-Distanz: 10px (kürzere Pfade werden verworfen)

### Darstellung

- SVG `<path>` mit `stroke-linecap="round"`, `stroke-linejoin="round"`
- Standardbreite: 8px (Variable `--traek-marker-stroke-width`)
- Opacity: 0.45 (damit darunter liegende Inhalte sichtbar bleiben)
- Farbe: aktive Paletten-Farbe (`--traek-annotation-marker-default` als Standard)
- Geglättet: Punkte werden mit Catmull-Rom-Splines geglättet (max 4px Fehlertoleranz)

### Interaktion

| Aktion | Effekt |
|--------|--------|
| Klick auf Pfad (Navigate Mode) | Marker selektieren, Löschen-Button erscheint |
| Hover | Opacity auf 0.65 erhöht, Cursor: `pointer` |
| `Delete` wenn selektiert | Marker löschen (Undo verfügbar) |
| Eraser-Werkzeug + Drag über Marker | Marker löschen |

### Performance

- Pfade über 500 Punkte werden vereinfacht (Ramer-Douglas-Peucker, ε=2px)
- Rendering nur wenn im Viewport sichtbar (BBox-Check gegen viewport bounds)

---

## 6. Region Pins

### Erstellen

- Im Annotate Mode (Pin-Werkzeug aktiv): **Einfacher Klick** auf beliebige Stelle → Pin erscheint
- Sofort in Bearbeitungsmodus: Label-Eingabe, optional Kommentartext

### Anatomie

```
  [Callout-Blase]
       ↑
      [●]  ← Pin-Marker (16px Kreis mit Nummer oder Icon)
```

- Callout-Blase erscheint on-hover und wenn aktiv
- Blase enthält: Label (bold, 14px), Kommentar (12px, max 300 Zeichen), Zeitstempel
- Blase positioniert sich intelligent: bevorzugt rechts/oben, wechselt wenn zu nah am Rand

### Interaktion

| Aktion | Effekt |
|--------|--------|
| Hover über Pin | Callout-Blase einblenden (fade-in 150ms) |
| Klick auf Pin | Blase anheften (persistent bis Klick woanders) |
| Doppelklick auf Pin | Bearbeitungsmodus |
| Drag auf Pin | Pin verschieben |
| [×] in Blase | Pin löschen |
| `Enter` in Label | Zu Kommentarfeld wechseln |
| `Escape` in Blase | Blase schließen / Bearbeitungsmodus verlassen |

---

## 7. Datenmmodell

Annotationen werden im `ConversationSnapshot` als eigenständiges Array gespeichert:

```typescript
type AnnotationColor =
  | 'yellow' | 'blue' | 'green' | 'pink' | 'orange'  // Sticky-Farben
  | 'amber' | 'red' | 'purple';                        // Marker-Farben

type StickyAnnotation = {
  id: string;
  type: 'sticky';
  x: number;         // Canvas-Koordinaten (Grid-Einheiten)
  y: number;
  width: number;     // px, default 200
  height: number;    // px, default 120 (auto-expand bis max)
  color: AnnotationColor;
  text: string;
  rotation: number;  // Grad, ±3
  createdAt: string; // ISO 8601
};

type MarkerAnnotation = {
  id: string;
  type: 'marker';
  points: Array<{ x: number; y: number }>;  // Canvas-Koordinaten
  color: AnnotationColor;
  strokeWidth: number;
  createdAt: string;
};

type PinAnnotation = {
  id: string;
  type: 'pin';
  x: number;
  y: number;
  label: string;
  comment: string;
  color: AnnotationColor;
  createdAt: string;
};

type Annotation = StickyAnnotation | MarkerAnnotation | PinAnnotation;
```

**Persistenz:**
`ConversationSnapshot.annotations: Annotation[]` — neues optionales Feld (abwärtskompatibel, `[]` wenn nicht vorhanden).

---

## 8. Rendering-Schichtmodell

```
z-index (canvas-space):
  10  → Pins (oben)
   8  → Sticky Notes
   5  → Marker Highlights
   2  → Connection Lines (SVG)
   1  → Nodes (NodeRenderer)
   0  → Canvas-Hintergrund
```

Ein neues `AnnotationLayer.svelte` Component wird zwischen `<ConnectionLayer>` und `<NodeRenderer>` eingefügt.

---

## 9. Keyboard-Shortcuts

| Tastenkombination | Aktion |
|-------------------|--------|
| `A` | Annotate Mode umschalten |
| `1` (im Annotate Mode) | Sticky-Werkzeug |
| `2` (im Annotate Mode) | Marker-Werkzeug |
| `3` (im Annotate Mode) | Pin-Werkzeug |
| `4` / `E` (im Annotate Mode) | Eraser-Werkzeug |
| `Escape` | Annotate Mode verlassen |
| `Tab` | Nächste Annotation fokussieren |
| `Shift+Tab` | Vorherige Annotation fokussieren |
| `Delete` / `Backspace` | Fokussierte Annotation löschen |
| `Cmd+Z` | Undo (bereits vorhanden) |

Diese Shortcuts werden in `KeyboardHelpOverlay.svelte` als neue Sektion ergänzt.

---

## 10. Touch-Verhalten

| Geste | Effekt |
|-------|--------|
| Langer Druck (600ms) auf leere Fläche | Kontextmenü: „Notiz hier", „Marker hier", „Pin hier" |
| Tippen auf Annotation | Selektieren / Bearbeitungsmodus |
| Drag auf Annotation | Verschieben (1-Finger) |
| 2-Finger auf Canvas | Zoomen/Panning (wie gehabt) |

Im Annotate Mode: 1-Finger Drag erstellt Marker-Pfad (kein Panning). 2-Finger Pinch zoomed weiterhin.

---

## 11. Minimap-Integration

Annotationen werden in der Minimap als farbige Punkte/Flächen angedeutet:
- Sticky Notes → kleines Quadrat in der jeweiligen Farbe
- Marker → dünner Pfad (halbe Opazität)
- Pins → kleiner Kreis mit Farbe

---

## 12. i18n-Strings

Neue Schlüssel für `PartialTraekTranslations`:

```typescript
annotations: {
  modeLabel: 'Annotieren',
  modeAriaLabel: 'Annotationsmodus umschalten',
  modeActive: 'Annotationsmodus aktiv',
  stickyTool: 'Notiz',
  markerTool: 'Marker',
  pinTool: 'Pin',
  eraserTool: 'Löschen',
  stickyPlaceholder: 'Notiz hier eingeben…',
  deleteAnnotation: 'Annotation löschen',
  annotationDeleted: (count: number) => `${count} Annotation${count !== 1 ? 'en' : ''} gelöscht`,
  pinLabelPlaceholder: 'Label…',
  pinCommentPlaceholder: 'Kommentar (optional)…',
  annotationNote: (text: string) => `Annotation: ${text}`,
}
```

---

## 13. Qualitätskriterien / Akzeptanzkriterien

- [ ] Sticky Notes erstellen, bearbeiten, verschieben, löschen
- [ ] Marker zeichnen, löschen
- [ ] Pins setzen, Label/Kommentar editieren, löschen
- [ ] Alle 3 Typen überleben `exportSnapshot()` / `importSnapshot()` (Zod-Validierung)
- [ ] Undo/Redo für jede Annotation-Operation
- [ ] Annotate Mode via Tastatur `A` umschaltbar
- [ ] Tab-Navigation zwischen Annotationen möglich
- [ ] Screen Reader: `role="note"` für Stickies, sinnvolle aria-label auf allen interaktiven Elementen
- [ ] `prefers-reduced-motion`: Keine Einblende-Animationen, keine Rotation
- [ ] Touch: Langer Druck öffnet Kontextmenü
- [ ] Minimap zeigt Annotationen
- [ ] `KeyboardHelpOverlay` enthält Annotationsshortcuts
- [ ] Keine Performance-Regression bei >50 Annotationen (BBox-Culling)
- [ ] WCAG 2.1 AA: Alle Annotationsfarben erfüllen 3:1 Kontrast gegen Canvas-Hintergrund

---

## 14. Nicht im Scope (v1)

- Kollaborative Annotationen (Mehrbenutzer-Sync)
- Export von Annotationen als Bild/PDF
- Annotationen an spezifische Nodes heften (Nodes bewegen sich dann mit)
- Annotationsschichten / Layer-Management
- Kommentar-Threads auf Pins
