import type { ConversationSnapshot } from '@traek/core';

// ── Stored conversation record ────────────────────────────────────────────────

export interface CloudConversation {
	/** Unique ID of the conversation. */
	id: string;
	/** The authenticated user/workspace that owns this conversation. */
	workspaceId: string;
	/** Human-readable title. */
	title: string;
	/** Full snapshot (serialized TraekEngine state). */
	snapshot: ConversationSnapshot;
	/** ISO-8601 creation timestamp. */
	createdAt: string;
	/** ISO-8601 last-updated timestamp. */
	updatedAt: string;
	/** Optional searchable tag list. */
	tags?: string[];
	/** Optional arbitrary metadata for app-specific needs. */
	meta?: Record<string, unknown>;
}

/** Lightweight list item (snapshot omitted for performance). */
export type CloudConversationListItem = Omit<CloudConversation, 'snapshot'>;

// ── CRUD payloads ─────────────────────────────────────────────────────────────

export interface CreateConversationPayload {
	title: string;
	snapshot: ConversationSnapshot;
	tags?: string[];
	meta?: Record<string, unknown>;
}

export interface UpdateConversationPayload {
	title?: string;
	snapshot?: ConversationSnapshot;
	tags?: string[];
	meta?: Record<string, unknown>;
}

// ── List / search options ─────────────────────────────────────────────────────

export interface ListOptions {
	/** Maximum number of results to return. Default: 50. */
	limit?: number;
	/** Offset for pagination. Default: 0. */
	offset?: number;
	/** Sort field. Default: 'updatedAt'. */
	sortBy?: 'updatedAt' | 'createdAt' | 'title';
	/** Sort direction. Default: 'desc'. */
	order?: 'asc' | 'desc';
	/** Filter by tag. */
	tag?: string;
}

export interface SearchOptions extends ListOptions {
	/** Full-text search query across title and conversation content. */
	query: string;
}

// ── Adapter interface ─────────────────────────────────────────────────────────

/**
 * Implement this interface to plug any backend into `CloudClient`.
 *
 * All methods are async and must resolve with the data or throw on error.
 */
export interface CloudAdapter {
	/** Persist a new conversation. Returns the created record. */
	create(payload: CreateConversationPayload): Promise<CloudConversation>;

	/** Fetch a single conversation by id. Returns null if not found. */
	get(id: string): Promise<CloudConversation | null>;

	/** Update an existing conversation. Returns the updated record. */
	update(id: string, payload: UpdateConversationPayload): Promise<CloudConversation>;

	/** Delete a conversation by id. */
	delete(id: string): Promise<void>;

	/** List conversations (lightweight, snapshot omitted). */
	list(options?: ListOptions): Promise<CloudConversationListItem[]>;

	/** Full-text search across conversations. */
	search(options: SearchOptions): Promise<CloudConversationListItem[]>;

	/** Total number of stored conversations. */
	count(): Promise<number>;
}

// ── Client options ────────────────────────────────────────────────────────────

export interface CloudClientOptions {
	adapter: CloudAdapter;
}
