import type { ConversationSnapshot } from '@traek/core';
import type {
	CloudAdapter,
	CloudClientOptions,
	CloudConversation,
	CloudConversationListItem,
	CreateConversationPayload,
	ListOptions,
	SearchOptions,
	UpdateConversationPayload
} from './types.js';

/**
 * CloudClient — drop-in cloud persistence for any Træk application.
 *
 * Wraps a pluggable adapter (Supabase, REST, etc.) with a clean, typed API.
 *
 * @example
 * ```ts
 * const client = new CloudClient({
 *   adapter: new SupabaseAdapter({ url, key, workspaceId })
 * })
 *
 * // Save a conversation
 * const saved = await client.save('My brainstorm', engine.serialize())
 *
 * // List all conversations
 * const list = await client.list({ limit: 20 })
 *
 * // Load and restore
 * const conv = await client.get(id)
 * if (conv) engine = TraekEngine.fromSnapshot(conv.snapshot)
 * ```
 */
export class CloudClient {
	private adapter: CloudAdapter;

	constructor(opts: CloudClientOptions) {
		this.adapter = opts.adapter;
	}

	// ── High-level helpers ────────────────────────────────────────────────────

	/**
	 * Save a snapshot as a new conversation.
	 * If `id` is provided and the conversation exists, it will be updated instead.
	 */
	async save(
		title: string,
		snapshot: ConversationSnapshot,
		opts?: {
			id?: string;
			tags?: string[];
			meta?: Record<string, unknown>;
		}
	): Promise<CloudConversation> {
		if (opts?.id) {
			try {
				const existing = await this.adapter.get(opts.id);
				if (existing) {
					return this.adapter.update(opts.id, {
						title,
						snapshot,
						tags: opts.tags,
						meta: opts.meta
					});
				}
			} catch {
				// fall through to create
			}
		}
		return this.adapter.create({ title, snapshot, tags: opts?.tags, meta: opts?.meta });
	}

	// ── Direct adapter methods ────────────────────────────────────────────────

	/** Create a new conversation record. */
	async create(payload: CreateConversationPayload): Promise<CloudConversation> {
		return this.adapter.create(payload);
	}

	/** Fetch a conversation by id. Returns null if not found. */
	async get(id: string): Promise<CloudConversation | null> {
		return this.adapter.get(id);
	}

	/** Update an existing conversation. */
	async update(id: string, payload: UpdateConversationPayload): Promise<CloudConversation> {
		return this.adapter.update(id, payload);
	}

	/** Delete a conversation by id. */
	async delete(id: string): Promise<void> {
		return this.adapter.delete(id);
	}

	/** List conversations (lightweight — snapshot not included). */
	async list(options?: ListOptions): Promise<CloudConversationListItem[]> {
		return this.adapter.list(options);
	}

	/** Full-text search across stored conversations. */
	async search(options: SearchOptions): Promise<CloudConversationListItem[]> {
		return this.adapter.search(options);
	}

	/** Total number of stored conversations for this workspace. */
	async count(): Promise<number> {
		return this.adapter.count();
	}

	// ── Sync helpers ──────────────────────────────────────────────────────────

	/**
	 * Push a local list of conversation IDs to the cloud, pruning any
	 * cloud-only conversations that are no longer present locally.
	 * Returns the set of ids that were deleted from the cloud.
	 */
	async pruneOrphans(localIds: Set<string>): Promise<string[]> {
		const cloudList = await this.adapter.list({ limit: 1000 });
		const toDelete = cloudList.filter((c) => !localIds.has(c.id)).map((c) => c.id);
		await Promise.all(toDelete.map((id) => this.adapter.delete(id)));
		return toDelete;
	}
}
