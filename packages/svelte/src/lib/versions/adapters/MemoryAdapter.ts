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
