# User-Requested Features

**Status:** Groesstenteils implementiert (Stand: 2026-02-16)

Feature-Ideen aus Endnutzer-Perspektive. Diese Features wuerden Traek fuer normale Nutzer (keine Entwickler) deutlich attraktiver machen.

## Implementierungsstatus

| Feature | Status | Details |
|---------|--------|---------|
| 1. Branch-Vergleich (Side-by-Side) | ✅ Done | BranchCompare mit Word-Level-Diff |
| 2. Smart Search & Highlight | ✅ Done | SearchBar mit Ctrl+F, Live-Highlighting, Treffer-Navigation |
| 3. Auto-Branch-Suggestions | ❌ Offen | Geplant fuer Phase 6.3 (AI-Native) |
| 4. Tag-System & Filter | ✅ Done | TagBadges, TagDropdown, TagFilter, PREDEFINED_TAGS |
| 5. Canvas-Templates | ❌ Offen | Geplant fuer Phase 5.4 (Community Templates) |
| Bonus: Export als Bild/PDF | ❌ Offen | JSON/Markdown Export vorhanden, PNG/SVG/PDF fehlt |
| Bonus: Collapse/Expand Branches | ✅ Done | collapsedNodes mit Hidden-Count-Badge |
| Bonus: Node-Farben anpassen | ❌ Offen | Theme-System vorhanden, aber keine per-Node Farben |
| Bonus: Jump to Parent/Children | ✅ Done | Breadcrumbs + Keyboard Navigation (Arrow Keys) |

---

## 1. Branch-Vergleich (Side-by-Side)

### Das Problem

Ich habe zwei (oder mehr) Branches erstellt um verschiedene Optionen zu vergleichen — z.B. "Reise nach Italien" vs. "Reise nach Spanien". Aber ich muss staendig zwischen den Branches hin- und herscrollen um zu vergleichen. Das ist muehsam und ich verliere den Ueberblick.

Bei ChatGPT kann ich so einen Vergleich gar nicht machen. Aber hier bei Traek HABE ich die Branches — ich kann sie nur nicht gut vergleichen.

### Die Loesung

**"Compare Branches" Button:**

1. Ich klicke auf eine Node und waehle "Compare with..." aus einem Context-Menu
2. Ich waehle eine andere Node (aus einem anderen Branch)
3. Traek zeigt mir beide Branches **nebeneinander** in einem Split-View:
   - Links: Branch A
   - Rechts: Branch B
   - Beide scrollen synchron
   - Unterschiede werden farblich hervorgehoben (z.B. gelb)

**Alternativ: Automatischer Vergleich**

Wenn ich zwei Sibling-Nodes habe (beide Kinder desselben Parents), erscheint ein Button "Compare these responses".

**Visual Mockup (Text):**

```
┌─────────────────┬─────────────────┐
│  Italy Branch   │  Spain Branch   │
├─────────────────┼─────────────────┤
│ Cost: €1200     │ Cost: €980      │ ← Unterschied hervorgehoben
│ Duration: 7d    │ Duration: 7d    │
│ Must-see:       │ Must-see:       │
│ - Rome          │ - Barcelona     │
│ - Venice        │ - Madrid        │
└─────────────────┴─────────────────┘
```

### Warum ist das wichtig?

**Das ist DAS Killer-Feature das ChatGPT nicht hat.**

Branching alleine ist gut — aber wenn ich die Branches nicht sinnvoll vergleichen kann, ist der Vorteil limitiert. Mit einem guten Compare-Feature wird Traek zum perfekten Tool fuer:

- Entscheidungsfindung (welche Option ist besser?)
- A/B-Testing von Prompts
- Vergleich verschiedener AI-Antworten

---

## 2. Smart Search & Highlight

### Das Problem

Ich habe 30+ Nodes auf meinem Canvas. Irgendwo hatte die AI mir was ueber "API Authentication" erzaehlt. Aber wo? Ich muss jetzt alle Nodes durchklicken und lesen. Das nervt.

Bei ChatGPT kann ich Ctrl+F nutzen und durch den Text suchen. Aber das funktioniert bei Traek nicht gut, weil die Nodes verstreut sind.

### Die Loesung

**Search-Bar mit Canvas-Integration:**

1. Ich druecke **Ctrl+F** (oder klicke auf ein Lupen-Icon)
2. Eine Search-Bar erscheint oben
3. Ich tippe "API Auth"
4. **Alle Nodes die den Suchbegriff enthalten:**
   - Werden auf dem Canvas **hervorgehoben** (z.B. gelber Glow)
   - Die Kamera zoomt raus so dass ich alle Treffer sehe
   - Der Suchbegriff in den Nodes ist **gelb markiert**
5. Ich kann mit **Enter** zwischen den Treffern springen (Kamera zoomt automatisch dorthin)

**Zusatz-Feature: Semantic Search**

Nicht nur exakter Text-Match, sondern auch semantische Suche:

- Ich suche "Login" → findet auch Nodes mit "Authentication", "Sign in", etc.
- Nutzt embeddings um aehnliche Konzepte zu finden

### Warum ist das wichtig?

Ohne Suche ist Traek **unbrauchbar bei vielen Nodes**. Ich verliere den Ueberblick und finde Sachen nicht wieder.

Mit guter Suche wird der Canvas zu einem durchsuchbaren "Wissens-Graph". Das ist maechtig.

**Bonus:** Wenn ich alte Konversationen durchsuchen kann (siehe Feature 4 unten), wird Traek zu meiner persoenlichen Wissensdatenbank.

---

## 3. Auto-Branch-Suggestions ("Explore this")

### Das Problem

Branching ist cool — aber ich denke nicht automatisch dran. Mein Hirn ist linear trainiert. Ich stelle eine Frage, kriege eine Antwort, naechste Frage.

Ich KOENNTE branchen, aber ich komme nicht drauf. Das Potenzial von Traek bleibt ungenutzt.

### Die Loesung

**Die AI schlaegt Branches vor:**

Wenn ich eine Frage stelle die mehrere moegliche Richtungen hat, schlaegt die AI aktiv vor:

```
╔═══════════════════════════════════════════╗
║ "What should I visit in Europe?"          ║
╠═══════════════════════════════════════════╣
║ 💡 I can explore multiple options for you.║
║                                           ║
║ [Create 3 branches: Italy | Spain | France]║
║ [Single answer]                           ║
╚═══════════════════════════════════════════╝
```

Oder: Nach einer Antwort erscheint ein Button **"Explore alternatives"** → erstellt automatisch 2-3 Branches mit verschiedenen Perspektiven.

**Beispiel:**

Ich frage: "How should I learn Python?"

Die AI antwortet:

- Branch 1: "Self-taught approach (books, tutorials)"
- Branch 2: "Structured course (Udemy, Coursera)"
- Branch 3: "Project-based learning (build while learning)"

Alle drei Branches starten parallel und ich kann die Ansaetze vergleichen.

### Warum ist das wichtig?

**Es macht Branching "automatic".**

Ich muss nicht dran denken — die AI macht es fuer mich. Das senkt die Lernkurve massiv.

Fuer neue Nutzer ist das ein Gamechanger: Sie sehen sofort was Branching bringt, ohne es aktiv triggern zu muessen.

**Zusatz:** Guter Onboarding-Moment. Beim ersten Mal zeigt Traek eine Tooltip: "See? These are branches. You can explore different paths without losing any."

---

## 4. Tag-System & Filter

### Das Problem

Meine Konversationen auf dem Canvas werden chaotisch. Ich habe:

- Fragen die noch offen sind ("To-Do")
- Wichtige Insights die ich merken will ("Important")
- Experimentelle Branches die vielleicht Bloedsinn sind ("Draft")
- Finale Antworten die ich nutzen werde ("Final")

Aber alles sieht gleich aus. Ich verliere den Ueberblick was was ist.

### Die Loesung

**Tags/Labels auf Nodes:**

1. Rechtsklick auf eine Node → "Add tag"
2. Ich kann aus vorgefertigten Tags waehlen oder eigene erstellen:
   - "To-Do" (rot)
   - "Important" (gelb/Stern)
   - "Question" (blau)
   - "Done" (gruen/Haken)
   - "Draft" (grau)
3. Die Node bekommt einen farbigen Indicator (z.B. kleiner Punkt oben rechts)
4. Ich kann oben auf der Canvas **filtern**: "Zeige nur Important" → alle anderen Nodes werden ausgegraut

**Visuals:**

```
╔═══════════════════════╗
║ "Paris is the capi..." ║ ⭐ (Important-Tag, gelber Stern)
╚═══════════════════════╝

╔═══════════════════════╗
║ "Maybe try Berlin..." ║ 📝 (Draft-Tag, grauer Stift)
╚═══════════════════════╝
```

**Bonus: Smart Tags**

Die AI schlaegt automatisch Tags vor:

- "This looks like a to-do. Add 'To-Do' tag?"
- "This seems important. Add 'Important' tag?"

### Warum ist das wichtig?

**Organisation.**

Bei groesseren Konversationen wird der Canvas schnell unuebersichtlich. Tags helfen mir:

- Den Canvas aufzuraeumen
- Wichtiges von Unwichtigem zu trennen
- Meinen Workflow zu strukturieren ("Zeig mir alle To-Dos")

**Use Case:** Ich nutze Traek fuer Projekt-Recherche. Ich tagge alle finalen Insights als "Final". Spaeter kann ich filtern und nur die Finals sehen → perfekte Zusammenfassung.

---

## 5. Canvas-Templates ("Start from a Template")

### Das Problem

Jedes Mal wenn ich Traek oeffne, starte ich mit einem leeren Canvas. Fuer manche Use Cases weiss ich schon vorher GENAU wie ich arbeiten will:

- "Brainstorming" → zentrale Frage, viele Branches drumrum
- "Pros/Cons" → zwei Haupt-Branches (Pro / Con)
- "Research" → strukturierter Baum mit Unter-Themen
- "Comparison" → zwei parallele Pfade fuer Vergleiche

Aber ich muss das jedes Mal manuell aufbauen. Das ist Arbeit.

### Die Loesung

**Vorgefertigte Canvas-Templates:**

Beim Start einer neuen Konversation sehe ich:

```
New Conversation:
  [ ] Blank Canvas (default)
  [ ] Brainstorming (1 center node → many branches)
  [ ] Pros & Cons (2 parallel branches)
  [ ] Compare Options (side-by-side)
  [ ] Research Tree (hierarchical structure)
  [ ] Decision Matrix (structured comparison)
```

Wenn ich z.B. "Pros & Cons" waehle, erstellt Traek automatisch:

```
        ┌─ "What are we discussing?"
        │
    ┌───┴───┐
    │       │
  [Pro]   [Con]
    │       │
  (leer)  (leer)
```

Ich kann dann sofort loslegen und die Branches fuellen.

**Custom Templates:**

Ich kann meine eigenen Templates speichern:

- "My Research Template" → mein persoenlicher Workflow
- "Weekly Review" → immer dieselbe Struktur fuer Reviews

### Warum ist das wichtig?

**Effizienz.**

Fuer wiederkehrende Tasks (wöchentliche Reviews, Projekt-Vergleiche, etc.) spare ich Zeit.

**Onboarding.**

Templates zeigen neuen Nutzern: "So kannst du Traek nutzen." Es inspiriert und zeigt Best Practices.

**Professionalisierung.**

Mit Templates wirkt Traek weniger wie ein Chat-Tool, mehr wie ein ernsthaftes Thinking-Tool.

---

## Bonus: Quick-Wins (kleinere Features)

### Export als Bild/PDF

**Problem:** Ich will meine Konversation teilen oder in einer Praesentation zeigen.

**Loesung:** Button "Export" → Canvas wird als PNG/SVG/PDF gespeichert. Perfekt fuer Dokumentation.

### Collapse/Expand Branches

**Problem:** Bei vielen Nodes wird's chaotisch.

**Loesung:** Ich kann einen Branch "einklappen" (nur die erste Node sichtbar, Rest versteckt). Klick → ausgeklappt.

### Node-Farben anpassen

**Problem:** Alle Nodes sehen gleich aus (User blau, Assistant rot).

**Loesung:** Ich kann Nodes manuell einfaerben ("Diese Gruppe ist Projekt A, diese ist Projekt B").

### "Jump to Parent" / "Jump to Children" Buttons

**Problem:** Bei grossen Baeumen verliere ich den Ueberblick.

**Loesung:** Auf jeder Node: Button "↑ Parent" / "↓ Children" → Kamera springt dorthin.

---

## Zusammenfassung

Diese 5 Features wuerden Traek fuer mich als Endnutzer vom "interessanten Experiment" zum "taeglichen Tool" machen:

1. **Branch-Vergleich** → Killer-Feature, das ChatGPT nicht hat
2. **Smart Search** → Essentiell bei vielen Nodes
3. **Auto-Branch-Suggestions** → Senkt Lernkurve, macht Branching automatisch
4. **Tag-System** → Organisation und Workflow
5. **Canvas-Templates** → Effizienz und Onboarding

Mit diesen Features wuerde ich Traek aktiv nutzen und weiterempfehlen.
