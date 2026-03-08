# Canvas Snapshot & Version History System (TRK-72)

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Allow users to save, browse, diff, restore, export, and import named version snapshots of any canvas conversation, with auto-snapshot support and a pluggable storage adapter interface.

**Architecture:** A new `VersionHistoryManager` class manages named snapshots per conversation on top of a `StorageAdapter` interface. Pure `snapshotDiff()` function computes structural diffs between two snapshots. The existing `ConversationStore` auto-save is unchanged; version history is a separate, user-visible layer.

**Tech Stack:** TypeScript, Zod, Vitest (logic-extraction tests only — no Svelte 5 jsdom rendering), existing `indexedDBAdapter.ts` primitives

---

### Task 1: Types and Zod schemas for version history

**Files:**
- Create: `packages/svelte/src/lib/versions/types.ts`

**Step 1: Write the file**

```ts
import { z } from 'zod';
import type { ConversationSnapshot } from '../persistence/schemas';
import { conversationSnapshotSchema } from '../persistence/schemas';

// ── VersionEntry ──────────────────────────────────────────────────────────────

export const versionEntrySchema = z.object({
	id: z.string(),
	conversationId: z.string(),
	label: z.string(),
	description: z.string().optional(),
	createdAt: z.number(),
	isAuto: z.boolean(),
	snapshot: conversationSnapshotSchema
});

export type VersionEntry = z.infer<typeof versionEntrySchema>;

// ── SnapshotDiff ──────────────────────────────────────────────────────────────

export interface SnapshotNodeChange {
	id: string;
	contentChanged: boolean;
	metadataChanged: boolean;
}

export interface SnapshotDiff {
	nodeCountBefore: number;
	nodeCountAfter: number;
	addedNodeIds: string[];
	removedNodeIds: string[];
	changedNodes: SnapshotNodeChange[];
}

// ── StorageAdapter ────────────────────────────────────────────────────────────

export interface StorageAdapter {
	save(entry: VersionEntry): Promise<void>;
	load(id: string): Promise<VersionEntry | null>;
	loadAll(conversationId: string): Promise<VersionEntry[]>;
	delete(id: string): Promise<void>;
}

// ── Options ───────────────────────────────────────────────────────────────────

export interface VersionHistoryOptions {
	/** Max number of auto-snapshots to retain per conversation (oldest pruned first). Default 20. */
	maxAutoSnapshots?: number;
	/** Max total versions (auto + manual) per conversation. Default 50. */
	maxVersions?: number;
}

// Re-export snapshot type for consumers
export type { ConversationSnapshot };
```

**Step 2: No failing test needed (pure types/Zod), proceed to commit**

```bash
cd packages/svelte
git add src/lib/versions/types.ts
git commit -m "feat(versions): add VersionEntry schema, SnapshotDiff, StorageAdapter types (TRK-72)"
```

---

### Task 2: Pure snapshotDiff function

**Files:**
- Create: `packages/svelte/src/lib/versions/snapshotDiff.ts`
- Create: `packages/svelte/src/lib/versions/__tests__/snapshotDiff.test.ts`

**Step 1: Write the failing test**

```ts
// packages/svelte/src/lib/versions/__tests__/snapshotDiff.test.ts
import { describe, it, expect } from 'vitest';
import { snapshotDiff } from '../snapshotDiff';
import type { ConversationSnapshot } from '../../persistence/schemas';

function makeSnapshot(nodes: Array<{ id: string; content: string }>): ConversationSnapshot {
	return {
		version: 2,
		createdAt: Date.now(),
		activeNodeId: null,
		nodes: nodes.map((n) => ({
			id: n.id,
			parentIds: [],
			content: n.content,
			role: 'user' as const,
			type: 'TEXT',
			status: 'done' as const,
			createdAt: Date.now(),
			metadata: { x: 0, y: 0 }
		})),
		customTags: []
	};
}

describe('snapshotDiff', () => {
	it('returns zero diff for identical snapshots', () => {
		const s = makeSnapshot([{ id: 'a', content: 'hello' }]);
		const diff = snapshotDiff(s, s);
		expect(diff.addedNodeIds).toHaveLength(0);
		expect(diff.removedNodeIds).toHaveLength(0);
		expect(diff.changedNodes).toHaveLength(0);
		expect(diff.nodeCountBefore).toBe(1);
		expect(diff.nodeCountAfter).toBe(1);
	});

	it('detects added nodes', () => {
		const before = makeSnapshot([{ id: 'a', content: 'hello' }]);
		const after = makeSnapshot([
			{ id: 'a', content: 'hello' },
			{ id: 'b', content: 'world' }
		]);
		const diff = snapshotDiff(before, after);
		expect(diff.addedNodeIds).toEqual(['b']);
		expect(diff.removedNodeIds).toHaveLength(0);
	});

	it('detects removed nodes', () => {
		const before = makeSnapshot([
			{ id: 'a', content: 'hello' },
			{ id: 'b', content: 'world' }
		]);
		const after = makeSnapshot([{ id: 'a', content: 'hello' }]);
		const diff = snapshotDiff(before, after);
		expect(diff.removedNodeIds).toEqual(['b']);
		expect(diff.addedNodeIds).toHaveLength(0);
	});

	it('detects content changes', () => {
		const before = makeSnapshot([{ id: 'a', content: 'hello' }]);
		const after = makeSnapshot([{ id: 'a', content: 'world' }]);
		const diff = snapshotDiff(before, after);
		expect(diff.changedNodes).toHaveLength(1);
		expect(diff.changedNodes[0].id).toBe('a');
		expect(diff.changedNodes[0].contentChanged).toBe(true);
	});

	it('detects metadata changes', () => {
		const before = makeSnapshot([{ id: 'a', content: 'hello' }]);
		const after = {
			...before,
			nodes: [{ ...before.nodes[0], metadata: { x: 100, y: 200 } }]
		};
		const diff = snapshotDiff(before, after);
		expect(diff.changedNodes).toHaveLength(1);
		expect(diff.changedNodes[0].metadataChanged).toBe(true);
	});
});
```

**Step 2: Run test to verify it fails**

```bash
cd packages/svelte && npx vitest run src/lib/versions/__tests__/snapshotDiff.test.ts
```
Expected: FAIL (module not found)

**Step 3: Write implementation**

```ts
// packages/svelte/src/lib/versions/snapshotDiff.ts
import type { ConversationSnapshot } from '../persistence/schemas';
import type { SnapshotDiff } from './types';

/**
 * Computes a structural diff between two ConversationSnapshots.
 * Reports added/removed node IDs and content/metadata changes for shared nodes.
 */
export function snapshotDiff(before: ConversationSnapshot, after: ConversationSnapshot): SnapshotDiff {
	const beforeIds = new Set(before.nodes.map((n) => n.id));
	const afterIds = new Set(after.nodes.map((n) => n.id));

	const addedNodeIds = after.nodes.filter((n) => !beforeIds.has(n.id)).map((n) => n.id);
	const removedNodeIds = before.nodes.filter((n) => !afterIds.has(n.id)).map((n) => n.id);

	// Build lookup map for before nodes
	const beforeMap = new Map(before.nodes.map((n) => [n.id, n]));

	const changedNodes = after.nodes
		.filter((n) => beforeIds.has(n.id))
		.flatMap((afterNode) => {
			const beforeNode = beforeMap.get(afterNode.id)!;
			const contentChanged = afterNode.content !== beforeNode.content;
			const metadataChanged =
				afterNode.metadata.x !== beforeNode.metadata.x ||
				afterNode.metadata.y !== beforeNode.metadata.y ||
				afterNode.metadata.height !== beforeNode.metadata.height;

			if (!contentChanged && !metadataChanged) return [];
			return [{ id: afterNode.id, contentChanged, metadataChanged }];
		});

	return {
		nodeCountBefore: before.nodes.length,
		nodeCountAfter: after.nodes.length,
		addedNodeIds,
		removedNodeIds,
		changedNodes
	};
}
```

**Step 4: Run test to verify it passes**

```bash
cd packages/svelte && npx vitest run src/lib/versions/__tests__/snapshotDiff.test.ts
```
Expected: 5 PASS

**Step 5: Commit**

```bash
git add src/lib/versions/snapshotDiff.ts src/lib/versions/__tests__/snapshotDiff.test.ts
git commit -m "feat(versions): add snapshotDiff pure function with tests (TRK-72)"
```

---

### Task 3: In-memory StorageAdapter (for tests)

**Files:**
- Create: `packages/svelte/src/lib/versions/adapters/MemoryAdapter.ts`

**Step 1: Write the file**

```ts
// packages/svelte/src/lib/versions/adapters/MemoryAdapter.ts
import type { StorageAdapter, VersionEntry } from '../types';

/**
 * In-memory storage adapter. Used in tests and as a no-op fallback.
 */
export class MemoryAdapter implements StorageAdapter {
	private store = new Map<string, VersionEntry>();

	async save(entry: VersionEntry): Promise<void> {
		this.store.set(entry.id, entry);
	}

	async load(id: string): Promise<VersionEntry | null> {
		return this.store.get(id) ?? null;
	}

	async loadAll(conversationId: string): Promise<VersionEntry[]> {
		return Array.from(this.store.values())
			.filter((e) => e.conversationId === conversationId)
			.sort((a, b) => b.createdAt - a.createdAt);
	}

	async delete(id: string): Promise<void> {
		this.store.delete(id);
	}

	/** For testing: clear all entries. */
	clear(): void {
		this.store.clear();
	}
}
```

**Step 2: No test needed for this file (tested via VersionHistoryManager tests). Commit.**

```bash
git add src/lib/versions/adapters/MemoryAdapter.ts
git commit -m "feat(versions): add MemoryAdapter for testing (TRK-72)"
```

---

### Task 4: LocalStorage StorageAdapter

**Files:**
- Create: `packages/svelte/src/lib/versions/adapters/LocalStorageAdapter.ts`

**Step 1: Write the file**

```ts
// packages/svelte/src/lib/versions/adapters/LocalStorageAdapter.ts
import { versionEntrySchema, type VersionEntry, type StorageAdapter } from '../types';

const LS_PREFIX = 'traek-version-';
const LS_INDEX_PREFIX = 'traek-version-index-';

/**
 * localStorage-based storage adapter for version snapshots.
 * Stores each entry as a separate key. Maintains a per-conversation index.
 */
export class LocalStorageAdapter implements StorageAdapter {
	async save(entry: VersionEntry): Promise<void> {
		if (typeof localStorage === 'undefined') return;
		localStorage.setItem(LS_PREFIX + entry.id, JSON.stringify(entry));

		// Update index for this conversation
		const index = this.loadIndex(entry.conversationId);
		if (!index.includes(entry.id)) {
			index.push(entry.id);
			this.saveIndex(entry.conversationId, index);
		}
	}

	async load(id: string): Promise<VersionEntry | null> {
		if (typeof localStorage === 'undefined') return null;
		try {
			const raw = localStorage.getItem(LS_PREFIX + id);
			if (!raw) return null;
			const result = versionEntrySchema.safeParse(JSON.parse(raw));
			return result.success ? result.data : null;
		} catch {
			return null;
		}
	}

	async loadAll(conversationId: string): Promise<VersionEntry[]> {
		if (typeof localStorage === 'undefined') return [];
		const index = this.loadIndex(conversationId);
		const entries: VersionEntry[] = [];
		for (const id of index) {
			const entry = await this.load(id);
			if (entry) entries.push(entry);
		}
		return entries.sort((a, b) => b.createdAt - a.createdAt);
	}

	async delete(id: string): Promise<void> {
		if (typeof localStorage === 'undefined') return;
		const raw = localStorage.getItem(LS_PREFIX + id);
		if (!raw) return;
		try {
			const entry = JSON.parse(raw) as { conversationId?: string };
			if (entry.conversationId) {
				const index = this.loadIndex(entry.conversationId).filter((i) => i !== id);
				this.saveIndex(entry.conversationId, index);
			}
		} catch {
			// ignore parse errors during cleanup
		}
		localStorage.removeItem(LS_PREFIX + id);
	}

	private loadIndex(conversationId: string): string[] {
		try {
			const raw = localStorage.getItem(LS_INDEX_PREFIX + conversationId);
			return raw ? (JSON.parse(raw) as string[]) : [];
		} catch {
			return [];
		}
	}

	private saveIndex(conversationId: string, index: string[]): void {
		localStorage.setItem(LS_INDEX_PREFIX + conversationId, JSON.stringify(index));
	}
}
```

**Step 2: No unit test needed (browser API). Covered by integration path. Commit.**

```bash
git add src/lib/versions/adapters/LocalStorageAdapter.ts
git commit -m "feat(versions): add LocalStorageAdapter (TRK-72)"
```

---

### Task 5: IndexedDB StorageAdapter

**Files:**
- Create: `packages/svelte/src/lib/versions/adapters/IndexedDBAdapter.ts`

**Step 1: Write the file**

```ts
// packages/svelte/src/lib/versions/adapters/IndexedDBAdapter.ts
import { versionEntrySchema, type VersionEntry, type StorageAdapter } from '../types';

const DB_NAME = 'traek-versions';
const DB_VERSION = 1;
const STORE_NAME = 'versions';

function openVersionDB(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		if (typeof indexedDB === 'undefined') {
			reject(new Error('IndexedDB not available'));
			return;
		}
		const req = indexedDB.open(DB_NAME, DB_VERSION);
		req.onerror = () => reject(req.error);
		req.onsuccess = () => resolve(req.result);
		req.onupgradeneeded = (ev) => {
			const db = (ev.target as IDBOpenDBRequest).result;
			if (!db.objectStoreNames.contains(STORE_NAME)) {
				const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
				store.createIndex('conversationId', 'conversationId', { unique: false });
				store.createIndex('createdAt', 'createdAt', { unique: false });
			}
		};
	});
}

/**
 * IndexedDB-backed storage adapter for version snapshots.
 * Each entry is stored with a `conversationId` index for efficient lookup.
 */
export class IndexedDBVersionAdapter implements StorageAdapter {
	private db: IDBDatabase | null = null;

	private async getDB(): Promise<IDBDatabase> {
		if (!this.db) this.db = await openVersionDB();
		return this.db;
	}

	async save(entry: VersionEntry): Promise<void> {
		const db = await this.getDB();
		return new Promise((resolve, reject) => {
			const tx = db.transaction(STORE_NAME, 'readwrite');
			const req = tx.objectStore(STORE_NAME).put(entry);
			req.onerror = () => reject(req.error);
			req.onsuccess = () => resolve();
		});
	}

	async load(id: string): Promise<VersionEntry | null> {
		const db = await this.getDB();
		return new Promise((resolve, reject) => {
			const tx = db.transaction(STORE_NAME, 'readonly');
			const req = tx.objectStore(STORE_NAME).get(id);
			req.onerror = () => reject(req.error);
			req.onsuccess = () => {
				if (!req.result) { resolve(null); return; }
				const parsed = versionEntrySchema.safeParse(req.result);
				resolve(parsed.success ? parsed.data : null);
			};
		});
	}

	async loadAll(conversationId: string): Promise<VersionEntry[]> {
		const db = await this.getDB();
		return new Promise((resolve, reject) => {
			const tx = db.transaction(STORE_NAME, 'readonly');
			const index = tx.objectStore(STORE_NAME).index('conversationId');
			const req = index.getAll(conversationId);
			req.onerror = () => reject(req.error);
			req.onsuccess = () => {
				const entries = (req.result as VersionEntry[]).sort((a, b) => b.createdAt - a.createdAt);
				resolve(entries);
			};
		});
	}

	async delete(id: string): Promise<void> {
		const db = await this.getDB();
		return new Promise((resolve, reject) => {
			const tx = db.transaction(STORE_NAME, 'readwrite');
			const req = tx.objectStore(STORE_NAME).delete(id);
			req.onerror = () => reject(req.error);
			req.onsuccess = () => resolve();
		});
	}
}
```

**Step 2: No unit test (browser API). Commit.**

```bash
git add src/lib/versions/adapters/IndexedDBAdapter.ts
git commit -m "feat(versions): add IndexedDBVersionAdapter (TRK-72)"
```

---

### Task 6: VersionHistoryManager core

**Files:**
- Create: `packages/svelte/src/lib/versions/VersionHistoryManager.ts`
- Create: `packages/svelte/src/lib/versions/__tests__/VersionHistoryManager.test.ts`

**Step 1: Write failing tests**

```ts
// packages/svelte/src/lib/versions/__tests__/VersionHistoryManager.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { VersionHistoryManager } from '../VersionHistoryManager';
import { MemoryAdapter } from '../adapters/MemoryAdapter';
import type { ConversationSnapshot } from '../../persistence/schemas';

function makeSnapshot(nodeCount = 2): ConversationSnapshot {
	return {
		version: 2,
		createdAt: Date.now(),
		activeNodeId: null,
		nodes: Array.from({ length: nodeCount }, (_, i) => ({
			id: `node-${i}`,
			parentIds: [],
			content: `message ${i}`,
			role: 'user' as const,
			type: 'TEXT',
			status: 'done' as const,
			createdAt: Date.now(),
			metadata: { x: i * 10, y: 0 }
		})),
		customTags: []
	};
}

describe('VersionHistoryManager', () => {
	let manager: VersionHistoryManager;
	const CONV_ID = 'conv-001';

	beforeEach(() => {
		manager = new VersionHistoryManager(new MemoryAdapter(), { maxAutoSnapshots: 3, maxVersions: 5 });
	});

	it('saves and lists versions', async () => {
		await manager.saveVersion(CONV_ID, makeSnapshot(), 'v1');
		const list = await manager.listVersions(CONV_ID);
		expect(list).toHaveLength(1);
		expect(list[0].label).toBe('v1');
		expect(list[0].isAuto).toBe(false);
	});

	it('getVersion retrieves by id', async () => {
		await manager.saveVersion(CONV_ID, makeSnapshot(), 'v1');
		const list = await manager.listVersions(CONV_ID);
		const entry = await manager.getVersion(list[0].id);
		expect(entry).not.toBeNull();
		expect(entry!.label).toBe('v1');
	});

	it('deleteVersion removes entry', async () => {
		await manager.saveVersion(CONV_ID, makeSnapshot(), 'v1');
		const list = await manager.listVersions(CONV_ID);
		await manager.deleteVersion(list[0].id);
		expect(await manager.listVersions(CONV_ID)).toHaveLength(0);
	});

	it('saveAutoSnapshot marks isAuto=true', async () => {
		await manager.saveAutoSnapshot(CONV_ID, makeSnapshot());
		const list = await manager.listVersions(CONV_ID);
		expect(list[0].isAuto).toBe(true);
	});

	it('prunes oldest auto snapshots beyond maxAutoSnapshots', async () => {
		for (let i = 0; i < 5; i++) {
			await manager.saveAutoSnapshot(CONV_ID, makeSnapshot(i + 1));
		}
		const list = await manager.listVersions(CONV_ID);
		const autoOnly = list.filter((e) => e.isAuto);
		expect(autoOnly.length).toBeLessThanOrEqual(3);
	});

	it('export/import round-trip', async () => {
		await manager.saveVersion(CONV_ID, makeSnapshot(3), 'exported');
		const list = await manager.listVersions(CONV_ID);
		const json = await manager.exportVersion(list[0].id);
		expect(typeof json).toBe('string');

		const imported = await manager.importVersion(CONV_ID, json);
		expect(imported.snapshot.nodes).toHaveLength(3);
	});

	it('diffVersions returns structural diff', async () => {
		const snap1 = makeSnapshot(2);
		const snap2 = makeSnapshot(4);
		await manager.saveVersion(CONV_ID, snap1, 'v1');
		await manager.saveVersion(CONV_ID, snap2, 'v2');
		const list = await manager.listVersions(CONV_ID);
		// list is sorted newest-first
		const diff = await manager.diffVersions(list[1].id, list[0].id);
		expect(diff.addedNodeIds).toHaveLength(2);
		expect(diff.nodeCountBefore).toBe(2);
		expect(diff.nodeCountAfter).toBe(4);
	});
});
```

**Step 2: Run to verify failure**

```bash
cd packages/svelte && npx vitest run src/lib/versions/__tests__/VersionHistoryManager.test.ts
```
Expected: FAIL

**Step 3: Implement VersionHistoryManager**

```ts
// packages/svelte/src/lib/versions/VersionHistoryManager.ts
import type { ConversationSnapshot } from '../persistence/schemas';
import type { StorageAdapter, VersionEntry, VersionHistoryOptions, SnapshotDiff } from './types';
import { snapshotDiff } from './snapshotDiff';
import { versionEntrySchema } from './types';

const DEFAULT_OPTIONS: Required<VersionHistoryOptions> = {
	maxAutoSnapshots: 20,
	maxVersions: 50
};

/**
 * Manages named version snapshots for canvas conversations.
 * Works with any StorageAdapter (MemoryAdapter, LocalStorageAdapter, IndexedDBVersionAdapter).
 */
export class VersionHistoryManager {
	private adapter: StorageAdapter;
	private options: Required<VersionHistoryOptions>;

	constructor(adapter: StorageAdapter, options: VersionHistoryOptions = {}) {
		this.adapter = adapter;
		this.options = { ...DEFAULT_OPTIONS, ...options };
	}

	/** Save a manual (named) version snapshot. */
	async saveVersion(
		conversationId: string,
		snapshot: ConversationSnapshot,
		label: string,
		description?: string
	): Promise<VersionEntry> {
		const entry: VersionEntry = {
			id: crypto.randomUUID(),
			conversationId,
			label,
			description,
			createdAt: Date.now(),
			isAuto: false,
			snapshot
		};
		await this.adapter.save(entry);
		await this.enforceMaxVersions(conversationId);
		return entry;
	}

	/** Save an auto-generated snapshot (e.g. on interval). Pruned when maxAutoSnapshots is exceeded. */
	async saveAutoSnapshot(
		conversationId: string,
		snapshot: ConversationSnapshot,
		label?: string
	): Promise<VersionEntry> {
		const entry: VersionEntry = {
			id: crypto.randomUUID(),
			conversationId,
			label: label ?? `Auto-save ${new Date().toLocaleTimeString()}`,
			createdAt: Date.now(),
			isAuto: true,
			snapshot
		};
		await this.adapter.save(entry);
		await this.pruneAutoSnapshots(conversationId);
		await this.enforceMaxVersions(conversationId);
		return entry;
	}

	/** List all versions for a conversation, sorted newest first. */
	async listVersions(conversationId: string): Promise<VersionEntry[]> {
		return this.adapter.loadAll(conversationId);
	}

	/** Get a single version by ID. */
	async getVersion(id: string): Promise<VersionEntry | null> {
		return this.adapter.load(id);
	}

	/** Delete a version by ID. */
	async deleteVersion(id: string): Promise<void> {
		return this.adapter.delete(id);
	}

	/** Export a version as a JSON string. */
	async exportVersion(id: string): Promise<string> {
		const entry = await this.adapter.load(id);
		if (!entry) throw new Error(`Version ${id} not found`);
		return JSON.stringify(entry, null, 2);
	}

	/**
	 * Import a version from a JSON string.
	 * Assigns a new ID to avoid conflicts and links to the given conversationId.
	 */
	async importVersion(conversationId: string, json: string): Promise<VersionEntry> {
		const parsed = versionEntrySchema.parse(JSON.parse(json));
		const entry: VersionEntry = {
			...parsed,
			id: crypto.randomUUID(),
			conversationId,
			createdAt: Date.now()
		};
		await this.adapter.save(entry);
		return entry;
	}

	/** Diff two versions. Returns a SnapshotDiff. */
	async diffVersions(beforeId: string, afterId: string): Promise<SnapshotDiff> {
		const [before, after] = await Promise.all([
			this.adapter.load(beforeId),
			this.adapter.load(afterId)
		]);
		if (!before) throw new Error(`Version ${beforeId} not found`);
		if (!after) throw new Error(`Version ${afterId} not found`);
		return snapshotDiff(before.snapshot, after.snapshot);
	}

	// ── Private helpers ──────────────────────────────────────────────────────

	private async pruneAutoSnapshots(conversationId: string): Promise<void> {
		const all = await this.adapter.loadAll(conversationId);
		const autoOnly = all.filter((e) => e.isAuto); // already sorted newest first
		if (autoOnly.length > this.options.maxAutoSnapshots) {
			const toDelete = autoOnly.slice(this.options.maxAutoSnapshots);
			await Promise.all(toDelete.map((e) => this.adapter.delete(e.id)));
		}
	}

	private async enforceMaxVersions(conversationId: string): Promise<void> {
		const all = await this.adapter.loadAll(conversationId);
		if (all.length > this.options.maxVersions) {
			const toDelete = all.slice(this.options.maxVersions);
			await Promise.all(toDelete.map((e) => this.adapter.delete(e.id)));
		}
	}
}
```

**Step 4: Run tests**

```bash
cd packages/svelte && npx vitest run src/lib/versions/__tests__/VersionHistoryManager.test.ts
```
Expected: 7 PASS

**Step 5: Commit**

```bash
git add src/lib/versions/VersionHistoryManager.ts src/lib/versions/__tests__/VersionHistoryManager.test.ts
git commit -m "feat(versions): add VersionHistoryManager with export/import/diff (TRK-72)"
```

---

### Task 7: Auto-snapshot timer (engine integration)

**Files:**
- Create: `packages/svelte/src/lib/versions/AutoSnapshotTimer.ts`
- Create: `packages/svelte/src/lib/versions/__tests__/AutoSnapshotTimer.test.ts`

**Step 1: Write failing tests**

```ts
// packages/svelte/src/lib/versions/__tests__/AutoSnapshotTimer.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AutoSnapshotTimer } from '../AutoSnapshotTimer';
import { MemoryAdapter } from '../adapters/MemoryAdapter';
import { VersionHistoryManager } from '../VersionHistoryManager';
import type { ConversationSnapshot } from '../../persistence/schemas';

function makeSnapshot(): ConversationSnapshot {
	return {
		version: 2,
		createdAt: Date.now(),
		activeNodeId: null,
		nodes: [],
		customTags: []
	};
}

describe('AutoSnapshotTimer', () => {
	beforeEach(() => { vi.useFakeTimers(); });
	afterEach(() => { vi.useRealTimers(); });

	it('fires callback after interval', async () => {
		const manager = new VersionHistoryManager(new MemoryAdapter());
		let callCount = 0;
		const timer = new AutoSnapshotTimer(
			manager,
			'conv-1',
			() => makeSnapshot(),
			{ intervalMs: 5000 }
		);
		timer.onSnapshot = async () => { callCount++; };
		timer.start();
		await vi.advanceTimersByTimeAsync(5001);
		timer.stop();
		expect(callCount).toBe(1);
	});

	it('fires multiple times', async () => {
		const manager = new VersionHistoryManager(new MemoryAdapter());
		let callCount = 0;
		const timer = new AutoSnapshotTimer(
			manager,
			'conv-1',
			() => makeSnapshot(),
			{ intervalMs: 1000 }
		);
		timer.onSnapshot = async () => { callCount++; };
		timer.start();
		await vi.advanceTimersByTimeAsync(3500);
		timer.stop();
		expect(callCount).toBe(3);
	});

	it('stop prevents further fires', async () => {
		const manager = new VersionHistoryManager(new MemoryAdapter());
		let callCount = 0;
		const timer = new AutoSnapshotTimer(
			manager,
			'conv-1',
			() => makeSnapshot(),
			{ intervalMs: 1000 }
		);
		timer.onSnapshot = async () => { callCount++; };
		timer.start();
		await vi.advanceTimersByTimeAsync(1001);
		timer.stop();
		await vi.advanceTimersByTimeAsync(2000);
		expect(callCount).toBe(1);
	});

	it('saves snapshot to manager on fire', async () => {
		const adapter = new MemoryAdapter();
		const manager = new VersionHistoryManager(adapter);
		const timer = new AutoSnapshotTimer(
			manager,
			'conv-test',
			() => makeSnapshot(),
			{ intervalMs: 1000 }
		);
		timer.start();
		await vi.advanceTimersByTimeAsync(1001);
		timer.stop();
		const versions = await manager.listVersions('conv-test');
		expect(versions).toHaveLength(1);
		expect(versions[0].isAuto).toBe(true);
	});
});
```

**Step 2: Run to verify failure**

```bash
cd packages/svelte && npx vitest run src/lib/versions/__tests__/AutoSnapshotTimer.test.ts
```

**Step 3: Implement**

```ts
// packages/svelte/src/lib/versions/AutoSnapshotTimer.ts
import type { ConversationSnapshot } from '../persistence/schemas';
import type { VersionHistoryManager } from './VersionHistoryManager';

export interface AutoSnapshotTimerOptions {
	/** Interval between auto-snapshots in ms. Default 5 minutes. */
	intervalMs?: number;
	/** Custom label prefix. Default 'Auto-save'. */
	labelPrefix?: string;
}

/**
 * Fires periodic auto-snapshots for a conversation.
 * Call start() to begin, stop() to cancel.
 */
export class AutoSnapshotTimer {
	private manager: VersionHistoryManager;
	private conversationId: string;
	private getSnapshot: () => ConversationSnapshot;
	private options: Required<AutoSnapshotTimerOptions>;
	private timerId: ReturnType<typeof setInterval> | null = null;

	/** Optional callback fired after each snapshot is saved. */
	onSnapshot?: (conversationId: string) => Promise<void>;

	constructor(
		manager: VersionHistoryManager,
		conversationId: string,
		getSnapshot: () => ConversationSnapshot,
		options: AutoSnapshotTimerOptions = {}
	) {
		this.manager = manager;
		this.conversationId = conversationId;
		this.getSnapshot = getSnapshot;
		this.options = {
			intervalMs: options.intervalMs ?? 5 * 60 * 1000,
			labelPrefix: options.labelPrefix ?? 'Auto-save'
		};
	}

	start(): void {
		if (this.timerId !== null) return; // already running
		this.timerId = setInterval(() => this.fire(), this.options.intervalMs);
	}

	stop(): void {
		if (this.timerId !== null) {
			clearInterval(this.timerId);
			this.timerId = null;
		}
	}

	get isRunning(): boolean {
		return this.timerId !== null;
	}

	private async fire(): Promise<void> {
		const snapshot = this.getSnapshot();
		await this.manager.saveAutoSnapshot(
			this.conversationId,
			snapshot,
			`${this.options.labelPrefix} ${new Date().toLocaleTimeString()}`
		);
		await this.onSnapshot?.(this.conversationId);
	}
}
```

**Step 4: Run tests**

```bash
cd packages/svelte && npx vitest run src/lib/versions/__tests__/AutoSnapshotTimer.test.ts
```
Expected: 4 PASS

**Step 5: Commit**

```bash
git add src/lib/versions/AutoSnapshotTimer.ts src/lib/versions/__tests__/AutoSnapshotTimer.test.ts
git commit -m "feat(versions): add AutoSnapshotTimer with configurable interval (TRK-72)"
```

---

### Task 8: versions/index.ts barrel

**Files:**
- Create: `packages/svelte/src/lib/versions/index.ts`

**Step 1: Write the barrel**

```ts
// packages/svelte/src/lib/versions/index.ts
export { VersionHistoryManager } from './VersionHistoryManager';
export { AutoSnapshotTimer } from './AutoSnapshotTimer';
export { MemoryAdapter } from './adapters/MemoryAdapter';
export { LocalStorageAdapter } from './adapters/LocalStorageAdapter';
export { IndexedDBVersionAdapter } from './adapters/IndexedDBAdapter';
export { snapshotDiff } from './snapshotDiff';
export { versionEntrySchema } from './types';
export type {
	VersionEntry,
	SnapshotDiff,
	SnapshotNodeChange,
	StorageAdapter,
	VersionHistoryOptions
} from './types';
```

**Step 2: Commit**

```bash
git add src/lib/versions/index.ts
git commit -m "feat(versions): add versions barrel index (TRK-72)"
```

---

### Task 9: Wire exports into lib index.ts

**Files:**
- Modify: `packages/svelte/src/lib/index.ts`

**Step 1: Add the exports block after the existing Persistence section**

Add this block after the existing `// Persistence & Replay` section (around line 62):

```ts
// Version History (TRK-72)
export { VersionHistoryManager } from './versions/VersionHistoryManager';
export { AutoSnapshotTimer } from './versions/AutoSnapshotTimer';
export { MemoryAdapter as VersionMemoryAdapter } from './versions/adapters/MemoryAdapter';
export { LocalStorageAdapter as VersionLocalStorageAdapter } from './versions/adapters/LocalStorageAdapter';
export { IndexedDBVersionAdapter } from './versions/adapters/IndexedDBAdapter';
export { snapshotDiff } from './versions/snapshotDiff';
export { versionEntrySchema } from './versions/types';
export type {
	VersionEntry,
	SnapshotDiff,
	SnapshotNodeChange,
	StorageAdapter as VersionStorageAdapter,
	VersionHistoryOptions
} from './versions/types';
```

**Step 2: Run type-check**

```bash
cd packages/svelte && pnpm run check
```
Expected: No errors

**Step 3: Commit**

```bash
git add src/lib/index.ts
git commit -m "feat(versions): export VersionHistoryManager and friends from index.ts (TRK-72)"
```

---

### Task 10: Full test suite and quality checks

**Step 1: Run all tests**

```bash
cd packages/svelte && pnpm run test
```
Expected: All passing

**Step 2: Run lint + type-check**

```bash
cd /Users/nico/Repos/traek && pnpm run lint && pnpm run check
```
Expected: No errors

**Step 3: Fix any lint/type errors, then commit**

```bash
git add -A
git commit -m "fix(versions): lint/type fixes for TRK-72"
```

---

## Summary

**New files:**
| File | Purpose |
|---|---|
| `versions/types.ts` | Zod schemas + interfaces: VersionEntry, StorageAdapter, SnapshotDiff |
| `versions/snapshotDiff.ts` | Pure structural diff function |
| `versions/VersionHistoryManager.ts` | Core manager: save/list/delete/export/import/diff |
| `versions/AutoSnapshotTimer.ts` | Configurable interval auto-snapshot |
| `versions/adapters/MemoryAdapter.ts` | In-memory adapter (tests) |
| `versions/adapters/LocalStorageAdapter.ts` | localStorage adapter |
| `versions/adapters/IndexedDBAdapter.ts` | IndexedDB adapter |
| `versions/index.ts` | Barrel |
| `versions/__tests__/snapshotDiff.test.ts` | 5 tests |
| `versions/__tests__/VersionHistoryManager.test.ts` | 7 tests |
| `versions/__tests__/AutoSnapshotTimer.test.ts` | 4 tests |

**Deliverable coverage:**
- ✅ Manual snapshot creation with name/description → `saveVersion()`
- ✅ Auto-snapshots at configurable intervals → `AutoSnapshotTimer`
- ✅ Snapshot diff view → `snapshotDiff()` / `diffVersions()`
- ✅ Restore to any snapshot point → caller calls `engine.fromSnapshot(entry.snapshot)`
- ✅ Snapshot export/import (JSON) → `exportVersion()` / `importVersion()`
- ✅ Storage adapter interface → `StorageAdapter` + 3 implementations
