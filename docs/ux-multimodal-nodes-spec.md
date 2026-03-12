# UX-Spezifikation: Multimodale Knotentypen

**Issue:** TRK-68
**Status:** In Bearbeitung
**Datum:** 2026-03-08
**Autor:** UX Expert

---

## Übersicht

Diese Spezifikation definiert die Interaktions- und Darstellungsregeln für vier neue Knotentypen, die über den bestehenden `text`-Knoten hinausgehen: **Image**, **File**, **Code** und **Embed**. Zusätzlich wird der **Node-Type-Picker** im Message-Composer definiert.

Das Design folgt dem bestehenden Dark-Theme (OLED-optimiert, Cyan `#00d8ff` als Primär-Akzent, Orange-Rot `#ff4400` für Assistant-Knoten) und hält WCAG 2.1 AA ein.

---

## 1. Gemeinsame Designprinzipien

### 1.1 Größenregeln

Alle multimodalen Knoten folgen einem einheitlichen Sizing-Raster:

| Eigenschaft      | Wert                        | Begründung                                |
|------------------|-----------------------------|-------------------------------------------|
| Standardbreite   | 350 px (wie TextNode)       | Konsistenz mit bestehendem Layout         |
| Maximale Breite  | 600 px (bei Bildern/Embeds) | Verhindert Canvas-Überlastung             |
| Mindesthöhe      | 80 px                       | Ausreichend für Tap-Target und Vorschau   |
| Innenabstand     | 12 px (kompakt) / 16 px     | Entspricht dem bestehenden TextNode-Stil  |
| Border-radius    | 8 px (Wrapper: 12 px)       | Konsistent mit `TraekNodeWrapper`         |

### 1.2 Interaktionszustände

Jeder Knotentyp muss folgende Zustände implementieren:

- **Default** — Ruhezustand, kein Hover
- **Hover** — Subtile Aufhellung (border-color → `var(--traek-node-active-border)` bei 40% Opacity)
- **Active/Focused** — Vollständige Cyan-Border + Glow-Effekt (wie bei TextNode)
- **Loading** — Skeleton-Overlay mit Pulsanimation
- **Error** — Rote Akzentfarbe + Fehlermeldung mit Handlungshinweis

### 1.3 Zoomverhalten

Knoten passen ihre Darstellung dem aktuellen Zoom-Level an (nutzt `getDetailLevel(scale)`):

| Zoom-Level | Darstellung                                   |
|------------|-----------------------------------------------|
| `full`     | Vollständige Vorschau + alle Aktionen         |
| `compact`  | Verkleinerte Vorschau, Aktionen ausgeblendet  |
| `minimal`  | Nur Icon + Typ-Label                          |
| `dot`      | Farbiger Punkt (wie TextNode)                 |

### 1.4 Zugänglichkeit

- Alle interaktiven Elemente: mindestens 44×44 px Tap-Target
- Kontrastverhältnis: min. 4.5:1 für Text, 3:1 für UI-Elemente
- Fokus-Ring: sichtbar, Cyan-Farbe, 2 px Offset
- Tastaturnavigation: alle Aktionen per Tab/Enter/Space erreichbar
- ARIA-Labels für alle ikonbasierten Buttons
- `prefers-reduced-motion`: Animationen auf `opacity`-Übergänge reduziert

---

## 2. Image-Knoten (`type: 'image'`)

### 2.1 Datenschema

```typescript
interface ImageNodeData {
  images: ImageEntry[];
  caption?: string;
}

interface ImageEntry {
  src: string;        // URL oder base64
  alt: string;        // Beschreibung für Screen Reader
  width?: number;     // Original-Breite in Pixel
  height?: number;    // Original-Höhe in Pixel
  mimeType?: string;  // z.B. 'image/png'
}
```

### 2.2 Einzelbild-Darstellung

```
┌─────────────────────────────────────┐
│ ┌─────────────────────────────────┐ │
│ │                                 │ │
│ │        [Bildinhalte]            │ │
│ │                                 │ │
│ │   max-height: 280px             │ │
│ │   object-fit: contain           │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [Bildunterschrift optional]   [🔍] [⬇] │
└─────────────────────────────────────┘
```

**Detailverhalten:**
- Bild: `object-fit: contain`, max-height 280 px, Hintergrund `#111113` (textNodeBg)
- Lazy Loading: `loading="lazy"`, Skeleton-Placeholder während des Ladens (Pulsanimation)
- Fehler-Zustand: Icon + „Bild konnte nicht geladen werden" + Retry-Schaltfläche
- Zoom-Button (Lupe): öffnet Lightbox-Modal
- Download-Button (↓): startet nativen Download mit korrektem Dateinamen

### 2.3 Galerie-Darstellung (2–4 Bilder)

```
┌─────────────────────────────────────┐
│ ┌──────────────┐ ┌──────────────┐  │
│ │   Bild 1     │ │   Bild 2     │  │
│ │  (Primär)    │ │  (Sekundär)  │  │
│ └──────────────┘ └──────────────┘  │
│ ┌──────────────┐ ┌──────────────┐  │
│ │   Bild 3     │ │   Bild 4     │  │
│ └──────────────┘ └──────────────┘  │
│                          [+2 mehr]  │
└─────────────────────────────────────┘
```

**Grid-Regeln:**
- 2 Bilder: 2-Spalten-Raster, gleichmäßig
- 3 Bilder: 1 primäres (links, 2/3 Breite) + 2 sekundäre (rechts, gestapelt)
- 4+ Bilder: 2×2-Grid, überzählige Bilder als „+N mehr"-Overlay auf dem letzten sichtbaren Bild
- Maximale sichtbare Bilder ohne Erweiterung: 4

### 2.4 Lightbox-Modal

- Vollbild-Overlay (`rgba(0,0,0,0.9)`)
- Bild zentriert, max. 90 vw / 90 vh
- Navigation: Links/Rechts-Pfeile (bei Galerie), Keyboard: ArrowLeft/ArrowRight
- Schließen: `Escape` / Klick auf Backdrop / Schließen-Button (top-right, 44×44 px)
- Fokus-Trap innerhalb des Modals
- Zoom-Funktion: per Mausrad / Pinch-to-zoom, min. 1× / max. 5×
- ARIA: `role="dialog"`, `aria-modal="true"`, `aria-label="Bildvorschau"`

---

## 3. File-Attachment-Knoten (`type: 'file'`)

### 3.1 Datenschema

```typescript
interface FileNodeData {
  file: FileEntry;
}

interface FileEntry {
  name: string;
  size: number;         // Bytes
  mimeType: string;
  url?: string;         // Download-URL wenn verfügbar
  uploadStatus: 'uploading' | 'done' | 'error';
  uploadProgress?: number; // 0–100
  errorMessage?: string;
}
```

### 3.2 Darstellung

```
┌─────────────────────────────────────┐
│  [Icon]  Dateiname.pdf              │
│  [████░░░░]  45%    3.2 MB          │
│                              [⬇] [×]│
└─────────────────────────────────────┘
```

**Upload-Indikatoren:**
- In Bearbeitung: Horizontale Progress-Bar (Cyan `#00d8ff`), Prozent-Label rechts
- Abgeschlossen: Progress-Bar ausgeblendet, nur Dateigröße + Download-Button
- Fehler: Roter Akzent, Fehlermeldung, Retry-Button

**Datei-Icons** (SVG, 24×24, `stroke="currentColor"`):

| Dateityp          | Icon-Schlüssel   |
|-------------------|------------------|
| PDF               | `file-pdf`       |
| Bild (png/jpg)    | `file-image`     |
| Video             | `file-video`     |
| Audio             | `file-audio`     |
| Code/Text         | `file-code`      |
| Archiv (zip)      | `file-archive`   |
| Tabelle (csv/xl)  | `file-table`     |
| Sonstiges         | `file`           |

**Interaktionen:**
- Klick auf Dateiname/Icon: öffnet Download-Dialog (wenn `url` vorhanden)
- Download-Button: `aria-label="Datei herunterladen"`, 44×44 px
- Löschen-Button: nur für Uploads in Warteschlange, `aria-label="Upload abbrechen"`

---

## 4. Code-Knoten (`type: 'code'`)

> Hinweis: Der bestehende `TextNode` rendert Code-Blöcke bereits via Markdown. Der Code-Knoten ist ein eigenständiger Typ für primären Code-Inhalt – kein Gemischttext.

### 4.1 Datenschema

```typescript
interface CodeNodeData {
  code: string;
  language: string;   // z.B. 'typescript', 'python', 'bash'
  filename?: string;  // optionaler Dateiname-Header
}
```

### 4.2 Darstellung

```
┌─────────────────────────────────────┐
│ [typescript ▾]   server.ts   [Copy] │  ← Header-Leiste
├─────────────────────────────────────┤
│ 1  import express from 'express'    │
│ 2                                   │
│ 3  const app = express()            │
│ 4  app.listen(3000)                 │
│                                     │
│ max-height: 400px, scrollbar intern │
└─────────────────────────────────────┘
```

**Header-Leiste:**
- Hintergrund: `rgba(255,255,255,0.04)` (dezente Trennung)
- Sprach-Selector: Dropdown mit häufigen Sprachen, durchsuchbar, 32 px Höhe
- Dateiname: editierbar per Klick (optionales Inline-Edit, nur wenn `filename` vorhanden)
- Copy-Button: `aria-label="Code kopieren"`, nach Klick 2 s lang „Kopiert!" anzeigen

**Code-Bereich:**
- Syntax-Highlighting: via `highlight.js` (bereits in der Codebasis)
- Zeilennummern: optionale Darstellung (prop `showLineNumbers`, default: true ab 3 Zeilen)
- Schriftart: `JetBrains Mono, Fira Code, 'Courier New', monospace`
- Schriftgröße: 13 px
- Max-Height: 400 px, dann internes Scrolling
- Tab-Größe: 2 Spaces-äquivalent

**Sprachen-Dropdown:**
- Häufige Sprachen (Top 12): TypeScript, JavaScript, Python, Bash, SQL, JSON, CSS, HTML, Rust, Go, Java, C#
- „Mehr…"-Option öffnet eine durchsuchbare vollständige Liste
- Bei unbekannter Sprache: `plaintext` als Fallback
- ARIA: `role="combobox"`, `aria-expanded`, `aria-haspopup="listbox"`

---

## 5. Embed-Knoten (`type: 'embed'`)

### 5.1 Datenschema

```typescript
interface EmbedNodeData {
  url: string;
  embedType: EmbedType;
  preview?: EmbedPreview;
}

type EmbedType = 'youtube' | 'github' | 'twitter' | 'figma' | 'generic';

interface EmbedPreview {
  title: string;
  description?: string;
  image?: string;   // Preview-Bild-URL
  favicon?: string;
  siteName?: string;
}
```

### 5.2 Darstellung – Link-Vorschau (Standard)

```
┌─────────────────────────────────────┐
│ [Favicon] github.com                │
│ ─────────────────────────────────── │
│ ┌────────────────┐                  │
│ │                │  Titre du lien   │
│ │  [Thumbnail]   │  Description...  │
│ │                │                  │
│ └────────────────┘                  │
│                         [Öffnen →]  │
└─────────────────────────────────────┘
```

**Spezifische Embed-Typen:**

| Typ       | Darstellung                                                    |
|-----------|----------------------------------------------------------------|
| YouTube   | Thumbnail mit Play-Button, Klick lädt iFrame (privacy-first)  |
| GitHub    | Repo-Icon, Name, Beschreibung, Stars/Forks-Counts              |
| Twitter/X | Avatar, Name, Tweet-Text (max. 280 Z.), Timestamp              |
| Figma     | Frame-Preview, Dateiname, letztes Änderungsdatum               |
| Generic   | Favicon, Domain, Titel, Beschreibung, Thumbnail                |

**YouTube (Privacy-First):**
- Standard: statisches Thumbnail mit Play-Button-Overlay
- Erst bei Klick: `<iframe>` aus `youtube-nocookie.com` laden
- Label: „Video abspielen" (ARIA)
- Nach Laden: Vollständiger iFrame 16:9, max-height 220 px

**Fehler-Zustand (URL nicht abrufbar):**
```
┌─────────────────────────────────────┐
│ ⚠  Vorschau nicht verfügbar         │
│ https://example.com/article         │
│                         [Öffnen →]  │
└─────────────────────────────────────┘
```

---

## 6. Node-Type-Picker im Message-Composer

### 6.1 Trigger

Der Picker wird ausgelöst durch:
1. **`+`-Button** links neben dem Textarea (neues UI-Element im `InputForm`)
2. **Slash-Befehl**: `/image`, `/file`, `/code`, `/embed`
3. **Drag & Drop**: Datei auf den Canvas fallenlassen öffnet automatisch `file`-Picker

### 6.2 Darstellung

```
╔══════════════════════════════════════╗
║  Was möchtest du hinzufügen?         ║
╠══════════════════════════════════════╣
║  [🖼 Bild]  [📎 Datei]              ║
║  [</> Code] [🔗 Embed]              ║
╚══════════════════════════════════════╝
```

**UI-Spezifikation:**
- Öffnet als Popover (nicht Modal), direkt über dem Composer
- Animiert: `slide-up` 150 ms ease-out
- Schließen: `Escape`, Klick außerhalb, erneuter Klick auf `+`-Button
- Grid: 2×2, Schaltflächen 140 px × 64 px
- ARIA: `role="menu"`, `aria-label="Medientyp auswählen"`, Einträge mit `role="menuitem"`
- Tastaturnavigation: Pfeiltasten innerhalb des Grids, `Enter`/`Space` zum Bestätigen

**Schaltflächen-Aufbau:**
```
┌──────────────┐
│   [Icon 24]  │
│   Bild       │
└──────────────┘
```
- Icon 24×24 px
- Label 13 px, Medium-Weight
- Hover: `background: rgba(0,216,255,0.08)`, Border-Farbe Cyan

### 6.3 `+`-Button im Composer

```
[+] [textarea                     ] [→]
```

- Position: links vom Textarea, vertikal zentriert
- Größe: 36×36 px, `border-radius: 8 px`
- Icon: `+` (20 px, stroke), Farbe `var(--traek-input-text)` (gedimmt)
- Hover: Farbe → Cyan, leichte Aufhellung des Hintergrunds
- ARIA: `aria-label="Medientyp auswählen"`, `aria-expanded`, `aria-controls="node-type-picker"`

---

## 7. Größen- und Layout-Konsistenzregeln

### 7.1 Sizing-Matrix

| Knotentyp | Default-Breite | Min-Höhe | Max-Höhe   | Resize erlaubt |
|-----------|---------------|----------|------------|----------------|
| Text      | 350 px        | Auto     | Unbegrenzt | Nein           |
| Image     | 350 px        | 120 px   | 480 px     | Ja (Breite)    |
| File      | 350 px        | 64 px    | 80 px      | Nein           |
| Code      | 400 px        | 120 px   | 480 px     | Ja (beide)     |
| Embed     | 400 px        | 100 px   | 320 px     | Nein           |

### 7.2 Gemeinsame CSS-Custom-Properties

Diese Properties werden zu `themes.ts` hinzugefügt:

```typescript
// Multimodal Node Colors
nodeMediaBg: '#111113',         // Hintergrund für Medien-Preview-Bereich
nodeMediaBorder: '#1f1f24',     // Trennlinie zwischen Header und Inhalt
nodeProgressBg: '#1f1f24',      // Fortschrittsbalken Hintergrund
nodeProgressFill: '#00d8ff',    // Fortschrittsbalken Füllung (Cyan)
nodeProgressError: '#ef4444',   // Fehler-Zustand (Rot)
nodeCodeBg: '#0a0a0c',          // Code-Hintergrund (etwas dunkler als nodeBg)
nodeCodeHeaderBg: 'rgba(255,255,255,0.04)',
nodeCodeText: '#e4e4e7',
nodeEmbedFavicon: '#71717a',    // Domain-Label Farbe
```

### 7.3 Spacing-Token (intern)

```typescript
// Abstände innerhalb von Knoten
NODE_PADDING_SM = 12     // Enge Darstellung (File, Embed)
NODE_PADDING_MD = 16     // Standard (Image, Code)
NODE_GAP_SM = 8          // Zwischen Elementen
NODE_GAP_MD = 12         // Zwischen größeren Sektionen
```

---

## 8. Animationen & Übergänge

Alle Animationen respektieren `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  /* Alle Transitions auf opacity-only reduzieren */
  * { transition: opacity 150ms ease !important; animation: none !important; }
}
```

| Element                  | Animation                          | Dauer    |
|--------------------------|------------------------------------|----------|
| Node erscheint           | `fadedSlide` (bestehend)           | 200 ms   |
| Lightbox öffnet          | `opacity 0→1` + `scale 0.95→1`     | 150 ms   |
| Picker öffnet            | `translateY(8px)→0` + `opacity`    | 150 ms   |
| Copy-Button Feedback     | Text-Wechsel (keine Animation)     | —        |
| Upload-Fortschritt       | CSS `width` Transition             | 300 ms   |
| Skeleton-Puls            | `opacity 0.4→0.7→0.4` (Loop)      | 1.5 s    |

---

## 9. Implementierungsreihenfolge (empfohlen für Dev)

1. **Gemeinsame Theme-Tokens** – neue CSS-Custom-Properties in `themes.ts`
2. **File-Knoten** – einfachste Logik, gute Grundlage für das Pattern
3. **Code-Knoten** – baut auf bestehendem `highlight.js`-Setup auf
4. **Image-Knoten + Lightbox** – komplexer durch Galerie-Logik
5. **Embed-Knoten** – API-Abhängigkeit (Open Graph Fetch)
6. **Node-Type-Picker im Composer** – hängt von den obigen Typen ab

---

## 10. Offene Fragen / Abhängigkeiten

| Frage                                           | Verantwortlich   | Priorität |
|-------------------------------------------------|------------------|-----------|
| Welcher Service liefert Open-Graph-Metadaten?   | Dev / Arch       | Hoch      |
| Werden Datei-Uploads direkt an API oder via S3? | Backend          | Hoch      |
| Soll `highlight.js`-Sprachen lazy-geladen werden? | Dev            | Mittel    |
| Twitter/X-Embed: API nötig oder nur OG-Tags?    | Dev              | Mittel    |
| Figma-Embed: erfordert Auth-Token?              | Dev              | Niedrig   |
