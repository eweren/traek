# PRD: Mobile Focus Mode

**Status:** Draft
**Priority:** P1
**Phase:** 2.1 (Roadmap)
**Author:** PM + User-Agent Feedback
**Date:** 2026-02-16

---

## TL;DR

Auf kleinen Screens wechselt Traek automatisch vom Canvas in einen **Focus Mode**: ein Node pro Screen, Navigation ueber Swipe-Gesten, nahtloser Zoom-Uebergang zurueck zur Baumansicht. Kein separates UI -- dieselben Daten, eine andere Navigationsschicht.

**Entscheidung noetig:** Freigabe fuer Phase-1-Implementierung (Foundation + Swipe-Navigation).

---

## 1. Problem

### Ist-Zustand

Traek's Canvas-UI ist fuer Desktop optimiert. Auf mobilen Geraeten (< 768px) gibt es folgende Probleme:

- **Nodes sind zu klein zum Lesen** -- Nutzer muessen zoomen, verlieren den Kontext
- **Pan/Zoom fuehl sich an wie Google Maps**, nicht wie eine Chat-App
- **Branching ist nicht entdeckbar** -- auf Touch fehlen Hover-States und Rechtsklick
- **Lange Antworten erzwingen Scrollen** innerhalb des Nodes UND auf dem Canvas -- doppelte Navigation

### Auswirkung

- ~55% des Web-Traffics ist mobil. Ohne Mobile-UX verliert Traek die Haelfte der potenziellen Nutzer.
- User-Feedback (USER-FEEDBACK.md, Punkt 4): "Wie funktioniert das auf dem Handy? Pan/Zoom auf einem kleinen Screen? Klingt umstaendlich."
- Library-Konsumenten koennen Traek nicht in mobile-first Apps einsetzen.

### Soll-Zustand

Ein mobiler Nutzer oeffnet eine Traek-basierte App und erlebt eine **native, fluessige Konversations-Navigation** -- ohne zu wissen, dass ein Canvas dahinter steckt. Branching fuehlt sich an wie "alternative Antworten durchswipen".

---

## 2. Loesung: Focus Mode

### Kernkonzept

Statt den Canvas auf einen kleinen Screen zu quetschen, zeigt Traek auf Mobile **einen Node pro Screen** an. Die Baumstruktur wird ueber Swipe-Gesten navigiert:

```text
                ↑ Swipe Up
                Parent Node

 ← Swipe Left                Swipe Right →
 Prev Sibling    [CURRENT]    Next Sibling

                ↓ Swipe Down
                Child Node
```

Der Baum mapped direkt auf Richtungen:

- **Vertikal** = Tiefe (Parent/Child)
- **Horizontal** = Breite (Siblings/Branches)

### Zoom-Transition

Pinch-Out zoomt vom Focus Mode in eine **vereinfachte Baumansicht** (nicht der volle Canvas). Pinch-In oder Tap auf einen Node bringt zurueck in den Focus Mode.

```text
[Focus Mode]  ── pinch-out ──→  [Tree Overview]
  1 Node/Screen                   Vereinfachter Baum
  Swipe-Navigation                Tap-Navigation
  Lesen + Antworten               Orientierung + Springen
```

Die Animation: Der aktuelle Node schrumpft in seine Position im Baum, andere Nodes faden ein. Das gibt dem Nutzer raeumliches Verstaendnis.

---

## 3. User Stories

### Primaer

#### US-1: Konversation lesen und fortfuehren

> Wenn ich unterwegs bin und eine AI-Konversation fortfuehren will, moechte ich schnell zum letzten Stand navigieren und antworten, damit ich meinen Gedankengang nicht verliere.

#### US-2: Branches erkunden

> Wenn ich wissen will was in einem alternativen Branch steht, moechte ich einfach nach links/rechts swipen, damit ich Antworten vergleichen kann ohne den Ueberblick zu verlieren.

#### US-3: Neuen Branch erstellen

> Wenn ich von einer bestimmten Nachricht aus eine neue Richtung einschlagen will, moechte ich per Long-Press branchen koennen, damit das genau so einfach ist wie am Desktop.

#### US-4: Orientierung behalten

> Wenn ich mehrfach geswiped habe, moechte ich sofort sehen wo ich im Baum bin, damit ich mich nicht verirre.

#### US-5: Ueberblick gewinnen

> Wenn mein Baum komplex wird, moechte ich herauszoomen und die Gesamtstruktur sehen, damit ich zu einem bestimmten Punkt springen kann.

### Sekundaer

#### US-6: Library-Konsument

> Als Entwickler moechte ich, dass Traek auf Mobile automatisch in den Focus Mode wechselt, ohne dass ich zusaetzlichen Code schreiben muss.

#### US-7: Tablet-Override

> Als Tablet-Nutzer moechte ich selbst entscheiden ob ich Canvas oder Focus Mode nutze, weil mein Screen gross genug fuer beides ist.

---

## 4. Funktionale Anforderungen

### 4.1 Focus Mode -- Navigation

| ID | Anforderung | Prioritaet |
| ---- | ------------ | ------------ |
| F-01 | Swipe Up navigiert zum Parent Node | Must |
| F-02 | Swipe Down navigiert zum Child Node | Must |
| F-03 | Swipe Left/Right navigiert zwischen Siblings | Must |
| F-04 | Am Leaf-Node oeffnet Swipe Down das Input-Feld | Must |
| F-05 | Am Root-Node hat Swipe Up keinen Effekt (Bounce) | Must |
| F-06 | Transition-Animation zwischen Nodes (< 200ms) | Must |
| F-07 | Wenn Node mehrere Children hat: Swipe Down geht zum zuletzt besuchten Child, dann Siblings via Links/Rechts | Should |
| F-08 | Branch-Preview: Halber Swipe zeigt Peek auf naechsten Node | Should |
| F-09 | Schnelles mehrfaches Swipen wird korrekt gequeued | Must |

### 4.2 Focus Mode -- Darstellung

| ID | Anforderung | Prioritaet |
| ---- | ------------ | ------------ |
| F-10 | Ein Node fuellt den Screen (abzgl. Header + Footer) | Must |
| F-11 | Lange Nodes sind vertikal scrollbar | Must |
| F-12 | Scroll und Swipe-Navigation duerfen nicht kollidieren (siehe 5.1) | Must |
| F-13 | Node-Header zeigt Rolle (User/Assistant/System) und Timestamp | Must |
| F-14 | Collapsed Mode: Lange Nodes zeigen erste 3 Zeilen + "Expand" | Should |
| F-15 | Code-Bloecke sind horizontal scrollbar | Must |

### 4.3 Baum-Position-Indikator

| ID | Anforderung | Prioritaet |
| ---- | ------------ | ------------ |
| F-16 | Tiefe-Indikator: "Ebene X/Y" | Must |
| F-17 | Sibling-Dots: Zeigen Anzahl und Position unter Geschwistern | Must |
| F-18 | Branch-Indikator: Symbol wenn aktuelle Node mehrere Children hat | Must |
| F-19 | Breadcrumb-Pfad kompakt oben (optional, konfigurierbar) | Could |

### 4.4 Tree Overview (Zoom-Out)

| ID | Anforderung | Prioritaet |
| ---- | ------------ | ------------ |
| F-20 | Pinch-Out wechselt von Focus Mode zu Tree Overview | Must |
| F-21 | Tree Overview zeigt vereinfachten Baum (Rollen-Icons + erste Zeile, keine vollen Inhalte) | Must |
| F-22 | Tap auf Node in Tree Overview wechselt zurueck in Focus Mode auf diesen Node | Must |
| F-23 | Aktuell fokussierter Node ist in Tree Overview hervorgehoben | Must |
| F-24 | Smooth Animation beim Uebergang (Node schrumpft in Position) | Should |

### 4.5 Interaktion

| ID | Anforderung | Prioritaet |
| ---- | ------------ | ------------ |
| F-25 | Long-Press (500ms) auf aktuelle Node oeffnet Kontext-Menu (Branch, Copy, Delete) | Must |
| F-26 | Input-Feld am Leaf-Node: Inline unterhalb des letzten Nodes | Must |
| F-27 | Input-Feld bei Non-Leaf: Bottom-Sheet oder Swipe-Down Uebergang | Should |
| F-28 | Virtual Keyboard darf Input nicht verdecken | Must |
| F-29 | "Zurueck zum Neuesten"-Button springt zum Leaf des aktiven Branches | Should |

### 4.6 Modus-Steuerung

| ID | Anforderung | Prioritaet |
| ---- | ------------ | ------------ |
| F-30 | Auto-Detection: Viewport < 768px → Focus Mode als Default | Must |
| F-31 | Konfigurierbar: `mode: 'auto' \| 'canvas' \| 'focus'` | Must |
| F-32 | Modus-Wechsel zur Laufzeit moeglich ohne State-Verlust | Must |
| F-33 | Tablet (768-1024px): Canvas als Default, Focus Mode opt-in | Should |

---

## 5. Kritische Design-Entscheidungen

### 5.1 Scroll vs. Swipe (Hoechstes Risiko)

**Problem:** Lange Nodes muessen scrollbar sein. Gleichzeitig navigiert Swipe Up/Down durch den Baum. Wie unterscheiden wir die beiden?

Empfohlene Loesung -- "Scroll-Ende-dann-Navigate":

1. Wenn der Node-Content scrollbar ist: Vertikales Swipen scrollt den Content
2. Erst wenn der Content am oberen/unteren Ende angekommen ist UND der Nutzer weiter in dieselbe Richtung swipt → Navigation zum Parent/Child
3. Visuelles Feedback: Leichter Overscroll-Indicator (wie Pull-to-Refresh) zeigt an "Noch weiter = Navigation"

**Fallback:** Horizontales Swipen (Siblings) ist davon nicht betroffen und funktioniert immer.

Alternativen evaluiert:

- Edge-Swipe (nur vom Rand): Zu versteckt, schlechte Discoverability
- Velocity-Threshold: Zu unberechenbar, frustriert Nutzer
- Dedizierte Swipe-Zone: Nimmt Screen-Platz weg

**Risiko-Mitigation:** Prototyp mit 3 Usern testen bevor Full-Implementierung.

### 5.2 Mehrere Children

**Problem:** Swipe Down geht zum Child. Was wenn es 3 Children gibt?

Empfohlene Loesung:

- Swipe Down → navigiert zum **zuletzt aktiven** Child (oder erstes, wenn kein History)
- Dort angekommen: Links/Rechts swiped durch Siblings (= die anderen Children)
- Sibling-Dots unten zeigen "Du bist bei Child 1 von 3"

### 5.3 Tree Overview Detailgrad

**Problem:** Voller Canvas auf 375px ist ueberfordernd (User-Agent Feedback: "Canvas auf dem Handy... ueberwältigend").

Empfohlene Loesung -- kein voller Canvas, sondern **vereinfachte Baumansicht**:

- Nodes als kompakte Karten (Rollen-Icon + erste Zeile Content)
- Verbindungslinien zeigen Baumstruktur
- Aktiver Pfad hervorgehoben, andere Branches gedimmt
- Tap zum Navigieren, kein Pan/Zoom noetig (oder minimales Scrolling bei grossen Baeumen)

---

## 6. Nicht-Funktionale Anforderungen

| Bereich | Anforderung |
| --------- | ------------ |
| **Performance** | Swipe-Transition < 200ms, 60fps waehrend Gesten |
| **Performance** | Tree Overview rendert < 500ms bei 100 Nodes |
| **Geraete** | iOS Safari 16+, Chrome Android 110+ |
| **Accessibility** | Touch-Targets min 44x44px (WCAG 2.5.5) |
| **Accessibility** | Screen Reader Announcements bei Navigation ("Node 5 von 12, Ebene 3") |
| **Accessibility** | `prefers-reduced-motion`: Transitions deaktivieren |
| **Kompatibilitaet** | Keine Desktop-Regression -- Canvas-Modus bleibt unveraendert |
| **Bundle Size** | Focus Mode Code < 15kB gzipped (Tree-Shakeable) |

---

## 7. Technische Anforderungen

### Neue/Geaenderte Dateien

| Datei | Beschreibung |
| ------- | ------------- |
| `src/lib/mobile/FocusMode.svelte` | Haupt-Container: Node-Anzeige, Swipe-Handler, Position-Indicator |
| `src/lib/mobile/SwipeNavigator.svelte.ts` | Gesten-Erkennung: Richtung, Velocity, Scroll/Swipe-Unterscheidung |
| `src/lib/mobile/TreeOverview.svelte` | Vereinfachte Baumansicht fuer Zoom-Out |
| `src/lib/mobile/PositionIndicator.svelte` | Breadcrumb, Tiefe-Anzeige, Sibling-Dots |
| `src/lib/mobile/transitions.ts` | Uebergangs-Animationen zwischen Nodes und Modi |
| `src/lib/TraekCanvas.svelte` | Erweitern um Mode-Detection und Focus-Mode-Rendering |
| `src/lib/TraekEngine.svelte.ts` | Neue Methoden: `getParent()`, `getSiblings()`, `getChildren()`, `getDepth()`, `getActiveLeaf()` |

### API-Erweiterung (TraekCanvas)

```typescript
interface TraekCanvasProps {
  // Bestehend...

  /** Mobile display mode. 'auto' switches based on viewport width. */
  mode?: 'auto' | 'canvas' | 'focus';

  /** Viewport width threshold for auto mode switch (default: 768) */
  mobileBreakpoint?: number;

  /** Focus mode configuration */
  focusConfig?: {
    /** Show collapsed node summaries (default: true) */
    collapsedNodes?: boolean;
    /** Enable haptic feedback (default: true) */
    hapticFeedback?: boolean;
    /** Swipe distance threshold in px (default: 80) */
    swipeThreshold?: number;
    /** Transition duration in ms (default: 180) */
    transitionDuration?: number;
    /** Show breadcrumb path (default: false) */
    showBreadcrumb?: boolean;
  };
}
```

### API-Erweiterung (TraekEngine)

```typescript
interface TraekEngine {
  // Bestehend...

  /** Get parent node of given node */
  getParent(nodeId: string): Node | null;

  /** Get sibling nodes (same parent) */
  getSiblings(nodeId: string): Node[];

  /** Get direct children of a node */
  getChildren(nodeId: string): Node[];

  /** Get depth of node in tree (root = 0) */
  getDepth(nodeId: string): number;

  /** Get total tree depth */
  getMaxDepth(): number;

  /** Navigate to leaf of the most recently active branch from a node */
  getActiveLeaf(nodeId: string): Node;

  /** Get the index of a node among its siblings */
  getSiblingIndex(nodeId: string): { index: number; total: number };
}
```

### Abhaengigkeiten

| Feature | Beziehung |
| --------- | ----------- |
| Conversation Persistence (Phase 1) | **Keine** -- Focus Mode arbeitet auf dem In-Memory-Baum |
| Keyboard Navigation (Phase 1) | **Schwach** -- Keyboard ist Desktop-fokussiert, aber Fokus-Konzept ist geteilt |
| Accessibility (Phase 1) | **Mittel** -- ARIA-Rollen und Screen Reader Announcements muessen fuer Focus Mode erweitert werden |
| Performance/Virtualization (Phase 2) | **Stark** -- Focus Mode rendert nur 1 Node, ist inherent virtualisiert |
| Minimap (Phase 2) | **Ersetzt durch** Tree Overview auf Mobile |

---

## 8. Implementierungs-Phasen

### Phase 1: Foundation (2-3 Wochen)

**Ziel:** Fokus-Modus funktioniert, Swipe navigiert durch den Baum.

- [ ] `TraekEngine` um Baum-Traversal-Methoden erweitern (getParent, getSiblings, etc.)
- [ ] `FocusMode.svelte`: Ein Node pro Screen rendern
- [ ] `SwipeNavigator`: Richtungserkennung, Scroll/Swipe-Unterscheidung
- [ ] Swipe Up/Down/Left/Right navigiert korrekt
- [ ] Position-Indicator: Tiefe + Sibling-Dots
- [ ] Leaf-Node → Input-Feld Uebergang
- [ ] Auto-Detection: Viewport < 768px → Focus Mode
- [ ] `mode` Prop auf TraekCanvas

Akzeptanzkriterien Phase 1:

1. Nutzer kann auf iPhone/Android durch den gesamten Baum swipen
2. Scroll innerhalb langer Nodes funktioniert ohne Navigations-Konflikte
3. Position im Baum ist jederzeit erkennbar
4. Input am Leaf-Node funktioniert mit Virtual Keyboard
5. Desktop-Modus ist unveraendert

### Phase 2: Transition & Polish (2 Wochen)

**Ziel:** Zoom-Transition verbindet Focus Mode mit Tree Overview.

- [ ] `TreeOverview.svelte`: Vereinfachte Baumansicht
- [ ] Pinch-Out Gesture → Tree Overview Transition
- [ ] Pinch-In / Tap → Focus Mode Transition
- [ ] Uebergangs-Animation (Node schrumpft in Position)
- [ ] Long-Press Kontext-Menu (Branch, Copy)
- [ ] "Zurueck zum Neuesten"-Button
- [ ] Node Collapsed Mode (erste 3 Zeilen + Expand)

Akzeptanzkriterien Phase 2:

1. Pinch-Out wechselt fliessend zur Baumansicht
2. Tap in Baumansicht springt korrekt in Focus Mode
3. Long-Press oeffnet Kontext-Menu zuverlaessig
4. Animation ist fluessig (60fps, < 200ms)

### Phase 3: Refinement (1-2 Wochen)

**Ziel:** Details die den Unterschied machen.

- [ ] Haptic Feedback (Vibration API) bei Navigation
- [ ] Branch-Preview: Halber Swipe zeigt Peek
- [ ] Swipe-Hint fuer Erstnutzer (einmalig, subtil)
- [ ] iOS-spezifische Fixes (-webkit-touch-callout, viewport-fit=cover)
- [ ] Re-Entry: Auto-Fokus auf zuletzt aktiven Node
- [ ] Branch-Labels: Erste Zeile des Sibling-Nodes als Preview beim Swipen

---

## 9. Erfolgsmetriken

### Leading Indicators (sofort messbar)

| Metrik | Baseline | Ziel |
| -------- | ---------- | ------ |
| Mobile Bounce Rate (Demo) | Nicht gemessen | < 40% |
| Focus Mode Engagement (Swipes pro Session) | 0 | > 10 |
| Branch-Discovery auf Mobile (% Nutzer die swipen) | ~0% (kein Branching auf Mobile) | > 30% |
| Scroll/Swipe Fehl-Navigationen | N/A | < 5% der Swipes |

### Lagging Indicators (nach 4+ Wochen)

| Metrik | Ziel |
| -------- | ------ |
| Mobile Session-Dauer | Vergleichbar mit Desktop (> 70%) |
| Library-Adoption: Mobile-faehige Apps | > 20% der Konsumenten nutzen Focus Mode |
| User-Zufriedenheit Mobile (NPS) | > 30 |

### Counter-Metriken (nicht verschlechtern)

| Metrik | Grenze |
| -------- | -------- |
| Desktop Performance | Keine Regression |
| Bundle Size gesamt | < +15kB gzipped |
| Bestehende E2E Tests | 100% pass |

---

## 10. Risiken & Mitigation

| Risiko | Wahrscheinlichkeit | Impact | Mitigation |
| -------- | ------------------- | -------- | ------------ |
| Scroll/Swipe-Konflikt fuehlt sich schlecht an | Hoch | Kritisch | Prototyp mit 3 Nutzern testen, iterieren bevor Full-Implementierung |
| Orientierungsverlust nach 5+ Swipes | Mittel | Hoch | Position-Indicator von Anfang an; Tree Overview in Phase 2 |
| Discoverability: Nutzer wissen nicht dass sie swipen koennen | Mittel | Mittel | Subtiler Swipe-Hint beim ersten Besuch; Sibling-Dots als visueller Cue |
| iOS Safari Quirks (Viewport, Keyboard, Gesten) | Hoch | Mittel | Frueh auf echten Geraeten testen, nicht nur Simulator |
| Performance bei grossen Baeumen (Tree Overview) | Niedrig | Mittel | Tree Overview rendert nur Karten, kein Markdown -- inherent performant |

---

## 11. Out of Scope

- Native App Wrapper (Capacitor, etc.)
- Offline-Support / Service Worker
- Mobile-spezifische Node-Types
- Stylus/Pen Input
- Landscape-spezifisches Layout
- Voller Canvas-Modus auf Mobile (ersetzt durch Tree Overview)

---

## 12. Offene Fragen

1. **Collapsed Nodes:** Soll die Library die Zusammenfassung generieren (erste N Zeilen) oder der Konsument via Callback?
2. **Haptic Patterns:** Eigene Haptic-Engine oder nur `navigator.vibrate()`?
3. **Storybook:** Wie testen wir Focus Mode in Storybook (kein Touch)?
4. **Tree Overview Rendering:** SVG-basiert (wie Canvas-Linien) oder reines HTML/CSS?
5. **State Persistence:** Soll der zuletzt aktive Node im Focus Mode gespeichert werden (localStorage)?

---

## Anhang: User-Agent Feedback (Zusammenfassung)

Aus der User-Agent-Session (Standard-Endnutzer, tech-affin, ChatGPT-Power-User):

Positiv:

- "Swipe-Navigation ist intuitiv -- ich swipe sowieso ueberall"
- "Leaf-Node → Input ist genial"
- "Branching wird endlich greifbar auf Mobile"

Kritisch:

- "Scroll vs. Swipe macht mir Angst -- das muss bombensicher funktionieren"
- "Breadcrumbs wuerde ich nicht lesen -- lieber einfache Tiefe + Branch-Indicator"
- "Canvas auf kleinem Screen ist ueberwaeltigend -- vereinfachte Baumansicht reicht"
- "Animationen muessen schnell sein, < 200ms, nie blockierend"
- "Kein Tutorial-Overlay, lass mich entdecken"
- "Tablet: Lass mich selbst entscheiden welchen Modus ich will"

**Gesamt-Bewertung:** 8/10 als Konzept. Scroll/Swipe-Loesung und Baum-Orientierung sind die Risikopunkte.
