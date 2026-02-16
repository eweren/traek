# PRD: Conversation Persistence UI (2.6)

**Status:** Ready for Implementation
**Priority:** P0 -- #1 User Request
**Aufwand:** M (4-5 Tage)
**Abhaengigkeiten:** Keine (serialize/fromSnapshot existiert)

---

## Problem

Traek verliert alle Konversationsdaten bei Page-Reload. Die Demo-App hat eine primitive localStorage-Loesung (`demo-persistence.ts`), aber:

1. **localStorage ist auf ~5MB limitiert** -- reicht nicht fuer Konversationen mit Bildern oder langen Threads
2. **Keine Library-Level API** -- Jeder Consumer muss Persistenz selbst implementieren
3. **Kein Auto-Save** -- Manuelles Speichern = verlorene Daten
4. **Keine Export-Funktion** -- Nutzer koennen Konversationen nicht teilen oder sichern

User-Feedback: *"Ohne speichern nutze ich das Tool nicht. Punkt."*

---

## Loesung

Eine library-eigene Persistence-Schicht mit IndexedDB-Backend, Auto-Save, Chat-Liste, und Export -- als wiederverwendbare Komponenten und Stores.

---

## Architektur

### Neue Dateien

| Datei | Verantwortung |
|---|---|
| `src/lib/persistence/ConversationStore.svelte.ts` | IndexedDB-Store mit CRUD + Auto-Save. Svelte 5 Runes. |
| `src/lib/persistence/indexedDBAdapter.ts` | Low-Level IndexedDB Wrapper (open, get, put, delete, getAll) |
| `src/lib/persistence/ChatList.svelte` | Wiederverwendbare Konversations-Liste (Sidebar oder Page) |
| `src/lib/persistence/SaveIndicator.svelte` | "Gespeichert" / "Speichern..." Status-Anzeige |
| `src/lib/persistence/exportUtils.ts` | Export als JSON + Markdown |
| `src/lib/persistence/__tests__/ConversationStore.test.ts` | Unit-Tests fuer Store-Logik |
| `src/lib/persistence/__tests__/exportUtils.test.ts` | Unit-Tests fuer Export |

### Geaenderte Dateien

| Datei | Aenderung |
|---|---|
| `src/lib/persistence/types.ts` | Neue Types: `StoredConversation`, `ConversationListItem`, `SaveState` |
| `src/lib/persistence/schemas.ts` | Neue Zod-Schemas fuer Storage-Types |
| `src/lib/index.ts` | Neue Exports |
| `src/routes/demo/[id]/+page.svelte` | Migration von demo-persistence auf ConversationStore |
| `src/routes/demo/+page.svelte` | Migration der Chat-Liste auf ChatList-Komponente |

---

## Detailliertes Design

### 1. IndexedDB Adapter (`indexedDBAdapter.ts`)

Duenner Wrapper um die IndexedDB API. Kein Framework (kein idb, kein dexie) -- haelt die Bundle-Size klein.

```typescript
interface IndexedDBAdapter {
  open(dbName: string, version: number, onUpgrade: (db: IDBDatabase) => void): Promise<IDBDatabase>;
  get<T>(db: IDBDatabase, store: string, key: string): Promise<T | undefined>;
  put<T>(db: IDBDatabase, store: string, value: T): Promise<void>;
  delete(db: IDBDatabase, store: string, key: string): Promise<void>;
  getAll<T>(db: IDBDatabase, store: string): Promise<T[]>;
  getAllKeys(db: IDBDatabase, store: string): Promise<string[]>;
}
```

DB-Schema:
- **Database:** `traek-conversations`
- **Object Store:** `conversations` (keyPath: `id`)
- **Indexes:** `updatedAt` (fuer sortierte Listen), `title` (fuer Suche)

Graceful Degradation: Wenn IndexedDB nicht verfuegbar ist (SSR, Private Browsing in altem Safari), falle auf localStorage zurueck mit Warnung.

### 2. ConversationStore (`ConversationStore.svelte.ts`)

Reactive Store mit Svelte 5 Runes. Zentrale API fuer alle Persistenz-Operationen.

```typescript
interface ConversationStoreOptions {
  dbName?: string;              // Default: 'traek-conversations'
  autoSaveDebounceMs?: number;  // Default: 1000
  maxConversations?: number;    // Default: 100 (aelteste werden gewarnt)
}

class ConversationStore {
  // Reactive State
  conversations = $state<ConversationListItem[]>([]);
  activeConversationId = $state<string | null>(null);
  saveState = $state<SaveState>('idle');  // 'idle' | 'saving' | 'saved' | 'error'
  lastSavedAt = $state<number | null>(null);
  isReady = $state(false);  // true nach initialem DB-Load

  // Lifecycle
  async init(): Promise<void>;
  destroy(): void;

  // CRUD
  async create(title?: string): Promise<string>;  // Returns new ID
  async load(id: string): Promise<ConversationSnapshot | null>;
  async save(id: string, snapshot: ConversationSnapshot): Promise<void>;
  async delete(id: string): Promise<void>;
  async rename(id: string, title: string): Promise<void>;
  async duplicate(id: string): Promise<string>;  // Returns new ID

  // Auto-Save
  enableAutoSave(engine: TraekEngine, conversationId: string): void;
  disableAutoSave(): void;

  // Export
  async exportAsJSON(id: string): Promise<string>;
  async exportAsMarkdown(id: string): Promise<string>;

  // Bulk
  async listAll(): Promise<ConversationListItem[]>;
  async getStorageUsage(): Promise<{ used: number; quota: number }>;
}
```

**SaveState-Uebergaenge:**
- `idle` → `saving` (beim Speichern)
- `saving` → `saved` (nach erfolgreichem Speichern)
- `saving` → `error` (bei Fehler)
- `saved` → `idle` (nach 2s Timeout)
- `error` → `idle` (nach 5s Timeout)

**Auto-Save Mechanik:**
- Registriert einen `$effect` der `engine.nodes` beobachtet
- Debounced mit konfigurierbarem Intervall (Default 1000ms)
- Setzt `saveState` entsprechend
- Speichert `engine.serialize()` in IndexedDB

### 3. Storage Types (`types.ts` Erweiterung)

```typescript
interface StoredConversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  snapshot: ConversationSnapshot;
}

interface ConversationListItem {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  nodeCount: number;
  preview: string;  // Erste 100 Zeichen der letzten User-Message
}

type SaveState = 'idle' | 'saving' | 'saved' | 'error';
```

### 4. ChatList Component (`ChatList.svelte`)

Wiederverwendbare Komponente die eine Liste gespeicherter Konversationen anzeigt.

**Props:**
```typescript
interface ChatListProps {
  store: ConversationStore;
  onSelect: (id: string) => void;
  onCreate?: () => void;
  class?: string;
}
```

**Features:**
- Sortiert nach `updatedAt` (neueste zuerst)
- Gruppiert: "Heute", "Gestern", "Letzte 7 Tage", "Aelter"
- Jeder Eintrag zeigt: Titel, Preview (erste User-Message), Node-Count, relative Zeit
- Swipe-to-Delete auf Mobile (oder Delete-Button auf Hover)
- "New Chat" Button prominent oben
- Rename per Doppelklick auf Titel (inline-edit)
- Empty State: "Noch keine Konversationen. Starte deine erste!"

**Styling:**
- Nutzt `--traek-*` CSS Custom Properties
- Responsive: Sidebar auf Desktop (250px), Full-Page auf Mobile
- Scrollbar-Styling passend zum Dark Theme

### 5. SaveIndicator Component (`SaveIndicator.svelte`)

Minimale Status-Anzeige fuer den Speicherstatus.

**Props:**
```typescript
interface SaveIndicatorProps {
  store: ConversationStore;
  class?: string;
}
```

**Rendering:**
- `idle`: Nichts anzeigen (oder dezent "Auto-save on")
- `saving`: Spinner + "Saving..."
- `saved`: Checkmark + "Saved" (fadet nach 2s aus)
- `error`: Warning-Icon + "Save failed" (bleibt sichtbar)

**Positionierung:** Wird vom Consumer platziert (typisch: neben Back-Button oder in Header).

### 6. Export Utils (`exportUtils.ts`)

```typescript
function snapshotToJSON(snapshot: ConversationSnapshot): string;
// Pretty-printed JSON mit Indentation

function snapshotToMarkdown(snapshot: ConversationSnapshot): string;
// Format:
// # {title}
// _Erstellt: {date}_
//
// ## Thread: Root → ... → Leaf
//
// **User:** {content}
//
// **Assistant:** {content}
//
// ---
// ## Branch: Parent → ... → Leaf
// (fuer jeden Branch separat)

function downloadFile(content: string, filename: string, mimeType: string): void;
// Erstellt Blob + Object URL + Click + Cleanup
```

### 7. Demo-App Migration

Die bestehende `demo-persistence.ts` wird durch ConversationStore ersetzt:

**`/demo` (Chat-Liste):**
- `listConversations()` → `store.conversations` (reactive)
- `createConversation()` → `store.create()`
- `deleteConversation()` → `store.delete()`

**`/demo/[id]` (Konversations-Detail):**
- `getConversation()` → `store.load(id)`
- `persist(engine)` → `store.enableAutoSave(engine, id)` (einmalig)
- Manuelles `saveConversation()` → entfaellt (Auto-Save)
- `SaveIndicator` neben Back-Button

**Migration bestehender Daten:**
- Beim ersten `init()` pruefen ob `traek-demo-conversations` in localStorage existiert
- Wenn ja: alle Konversationen lesen, in IndexedDB schreiben, localStorage-Keys loeschen
- Einmalige Migration, transparent fuer den Nutzer

---

## Zod Schemas

Alle neuen Types bekommen Zod-Schemas:

```typescript
const saveStateSchema = z.enum(['idle', 'saving', 'saved', 'error']);

const storedConversationSchema = z.object({
  id: z.string(),
  title: z.string(),
  createdAt: z.number(),
  updatedAt: z.number(),
  snapshot: conversationSnapshotSchema
});

const conversationListItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  createdAt: z.number(),
  updatedAt: z.number(),
  nodeCount: z.number(),
  preview: z.string()
});
```

---

## Implementierungs-Reihenfolge

1. **Storage Types + Zod Schemas** -- Types und Validierung zuerst
2. **IndexedDB Adapter** -- Low-Level DB-Zugriff
3. **ConversationStore** -- Reactive Store mit CRUD + Auto-Save
4. **Export Utils** -- JSON + Markdown Export
5. **SaveIndicator** -- Status-Anzeige Komponente
6. **ChatList** -- Konversations-Liste Komponente
7. **Demo-App Migration** -- Bestehende Demo auf neues System umstellen
8. **Tests** -- Unit-Tests fuer Store und Export
9. **Library Exports** -- index.ts aktualisieren

---

## Verifikation

1. `npm run check` -- TypeScript-Fehlerfreiheit
2. `npx vitest run src/lib/persistence/__tests__/` -- Store + Export Tests
3. `npm run lint` -- Keine Linting-Fehler
4. `npm run build` -- Library baut fehlerfrei
5. `npm run test:unit` -- Alle bestehenden Tests weiterhin gruen
6. Manueller Test: Konversation erstellen → Seite neu laden → Konversation ist da
7. Manueller Test: Export als JSON → Re-Import → Daten korrekt
8. Manueller Test: Mobile Focus Mode → Auto-Save funktioniert

---

## Success Metrics

- **Daten-Verlust:** 0 Konversationen gehen bei normalem Gebrauch verloren
- **Save-Latenz:** < 100ms fuer typische Konversationen (< 50 Nodes)
- **Storage-Limit:** Unterstuetzt mindestens 100 Konversationen mit je 200 Nodes
- **Bundle-Impact:** < 5KB gzipped fuer den gesamten Persistence-Layer (kein externes DB-Package)
