# Mobile & Touch Support

Touch-Gesten, responsive Layout-Anpassungen und mobile-optimierte Interaktionen.

## Motivation / User Story

**Als Entwickler** moechte ich Traek in einer App einsetzen, die auf Smartphones und Tablets funktioniert.

**Als mobiler Nutzer** moechte ich durch den Canvas mit vertrauten Touch-Gesten (Pinch, Swipe, Tap) navigieren koennen.

### Warum wichtig?

- ~55% des Web-Traffics kommt von mobilen Geraeten
- Der Canvas-Ansatz hat auf Touch-Geraeten grosses Potential (Maps-artige Interaktion)
- Ohne explizite Touch-Unterstuetzung funktioniert der Canvas auf Mobile gar nicht

## Scope

### Was ist drin

#### Touch-Gesten
| Geste | Aktion |
|-------|--------|
| Ein-Finger-Drag | Canvas pannen |
| Zwei-Finger-Pinch | Zoom in/out |
| Tap auf Node | Node selektieren |
| Double-Tap auf Node | Node als aktiv setzen |
| Long-Press auf Node (500ms) | Kontext-Menu |
| Long-Press + Drag | Node verschieben |
| Swipe auf leerem Canvas | Schnelles Pannen mit Momentum |

#### Responsive Node Layout
- Breakpoints: < 640px (Mobile), 640-1024px (Tablet), > 1024px (Desktop)
- Minimum Touch-Target: 44x44px (WCAG 2.5.5)
- Node-Breite: max 90vw auf Mobile

#### Mobile Input
- Bottom-Sheet Input auf Mobile
- Virtual-Keyboard-Erkennung
- Touch-optimierter Slash-Command-Dropdown

### Was ist nicht drin

- Native App Wrapper
- Offline-Support
- Mobile-spezifische Node-Types

## Akzeptanzkriterien

1. Pinch-to-Zoom fluessig auf iOS Safari und Android Chrome
2. Ein-Finger-Pan ohne Scroll-Hijacking
3. Tap-Selektion zuverlaessig (min 44x44px)
4. Long-Press Kontext-Menu nach 500ms
5. Virtual Keyboard ueberlappt nicht mit Input
6. Keine Desktop-Regression
7. >= 30fps auf Mittelklasse-Smartphone

## Technische Details

### Neue Dateien

| Datei | Beschreibung |
|-------|-------------|
| `src/lib/touch/GestureRecognizer.svelte.ts` | Pinch/Pan/Tap/Long-Press |
| `src/lib/touch/MobileInput.svelte` | Bottom-Sheet Input |
| `src/lib/touch/ContextMenu.svelte` | Touch-optimiertes Menu |
| `src/lib/touch/breakpoints.ts` | Breakpoint-Utilities |

## Abhaengigkeiten

| Feature | Beziehung |
|---------|-----------|
| Accessibility | **Mittel** -- Touch-Targets muessen WCAG 2.5.5 erfuellen |
| Keyboard Navigation | **Keine** -- separate Input-Methoden |
| Minimap | **Schwach** -- Minimap ist auf Mobile besonders nuetzlich |

## Offene Fragen

- Canvas fullscreen vs. eingebettet auf Mobile?
- Scroll-Hijacking-Strategie?
- Hammer.js oder eigene Gesture-Erkennung?
