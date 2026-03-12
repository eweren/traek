import { conversationSnapshotSchema } from '@traek/core';
import type {
	CloudAdapter,
	CloudConversation,
	CloudConversationListItem,
	CreateConversationPayload,
	ListOptions,
	SearchOptions,
	UpdateConversationPayload
} from '../types.js';

export interface SupabaseAdapterOptions {
	/** Supabase project URL. */
	url: string;
	/** Supabase anon or service-role key. */
	key: string;
	/** ID of the authenticated user/workspace that owns conversations. */
	workspaceId: string;
	/** Table name. Default: 'traek_conversations'. */
	tableName?: string;
}

interface SupabaseRow {
	id: string;
	workspace_id: string;
	title: string;
	snapshot: unknown;
	tags: string[] | null;
	meta: Record<string, unknown> | null;
	created_at: string;
	updated_at: string;
}

function rowToConversation(row: SupabaseRow): CloudConversation {
	return {
		id: row.id,
		workspaceId: row.workspace_id,
		title: row.title,
		snapshot: conversationSnapshotSchema.parse(row.snapshot),
		tags: row.tags ?? undefined,
		meta: row.meta ?? undefined,
		createdAt: row.created_at,
		updatedAt: row.updated_at
	};
}

function rowToListItem(row: SupabaseRow): CloudConversationListItem {
	return {
		id: row.id,
		workspaceId: row.workspace_id,
		title: row.title,
		tags: row.tags ?? undefined,
		meta: row.meta ?? undefined,
		createdAt: row.created_at,
		updatedAt: row.updated_at
	};
}

/**
 * Supabase adapter for CloudClient.
 *
 * Stores conversations in a `traek_conversations` table (configurable).
 * Uses the Supabase REST API directly via fetch — no @supabase/supabase-js required.
 *
 * Required table schema (run in Supabase SQL editor):
 * ```sql
 * create table if not exists traek_conversations (
 *   id uuid primary key default gen_random_uuid(),
 *   workspace_id text not null,
 *   title text not null,
 *   snapshot jsonb not null,
 *   tags text[] not null default '{}',
 *   meta jsonb,
 *   created_at timestamptz not null default now(),
 *   updated_at timestamptz not null default now()
 * );
 * create index on traek_conversations(workspace_id, updated_at desc);
 * ```
 */
export class SupabaseAdapter implements CloudAdapter {
	private url: string;
	private key: string;
	private workspaceId: string;
	private table: string;

	constructor(opts: SupabaseAdapterOptions) {
		this.url = opts.url.replace(/\/$/, '');
		this.key = opts.key;
		this.workspaceId = opts.workspaceId;
		this.table = opts.tableName ?? 'traek_conversations';
	}

	private get headers(): Record<string, string> {
		return {
			'Content-Type': 'application/json',
			apikey: this.key,
			Authorization: `Bearer ${this.key}`,
			Prefer: 'return=representation'
		};
	}

	private endpoint(params: string = ''): string {
		return `${this.url}/rest/v1/${this.table}${params}`;
	}

	private async request<T>(path: string, method: string, body?: unknown): Promise<T> {
		const res = await fetch(`${this.url}/rest/v1/${this.table}${path}`, {
			method,
			headers: this.headers,
			...(body !== undefined ? { body: JSON.stringify(body) } : {})
		});
		if (!res.ok) {
			const text = await res.text().catch(() => res.statusText);
			throw new Error(`Supabase ${method} ${path}: ${res.status} ${text}`);
		}
		const text = await res.text();
		return text ? (JSON.parse(text) as T) : (undefined as T);
	}

	async create(payload: CreateConversationPayload): Promise<CloudConversation> {
		const rows = await this.request<SupabaseRow[]>('', 'POST', {
			workspace_id: this.workspaceId,
			title: payload.title,
			snapshot: payload.snapshot,
			tags: payload.tags ?? [],
			meta: payload.meta ?? null
		});
		if (!rows?.[0]) throw new Error('Supabase create: no row returned');
		return rowToConversation(rows[0]);
	}

	async get(id: string): Promise<CloudConversation | null> {
		const rows = await this.request<SupabaseRow[]>(
			`?id=eq.${encodeURIComponent(id)}&workspace_id=eq.${encodeURIComponent(this.workspaceId)}&limit=1`,
			'GET'
		);
		return rows?.[0] ? rowToConversation(rows[0]) : null;
	}

	async update(id: string, payload: UpdateConversationPayload): Promise<CloudConversation> {
		const body: Record<string, unknown> = { updated_at: new Date().toISOString() };
		if (payload.title !== undefined) body['title'] = payload.title;
		if (payload.snapshot !== undefined) body['snapshot'] = payload.snapshot;
		if (payload.tags !== undefined) body['tags'] = payload.tags;
		if (payload.meta !== undefined) body['meta'] = payload.meta;

		const rows = await this.request<SupabaseRow[]>(
			`?id=eq.${encodeURIComponent(id)}&workspace_id=eq.${encodeURIComponent(this.workspaceId)}`,
			'PATCH',
			body
		);
		if (!rows?.[0]) throw new Error(`Supabase update: conversation ${id} not found`);
		return rowToConversation(rows[0]);
	}

	async delete(id: string): Promise<void> {
		await this.request(
			`?id=eq.${encodeURIComponent(id)}&workspace_id=eq.${encodeURIComponent(this.workspaceId)}`,
			'DELETE'
		);
	}

	async list(options?: ListOptions): Promise<CloudConversationListItem[]> {
		const limit = options?.limit ?? 50;
		const offset = options?.offset ?? 0;
		const sortBy = options?.sortBy ?? 'updatedAt';
		const order = options?.order ?? 'desc';
		const colMap: Record<string, string> = {
			updatedAt: 'updated_at',
			createdAt: 'created_at',
			title: 'title'
		};
		const col = colMap[sortBy] ?? 'updated_at';

		let params = `?workspace_id=eq.${encodeURIComponent(this.workspaceId)}`;
		params += `&select=id,workspace_id,title,tags,meta,created_at,updated_at`;
		params += `&order=${col}.${order}`;
		params += `&limit=${limit}&offset=${offset}`;
		if (options?.tag) params += `&tags=cs.{${encodeURIComponent(options.tag)}}`;

		const rows = await this.request<SupabaseRow[]>(params, 'GET');
		return (rows ?? []).map(rowToListItem);
	}

	async search(options: SearchOptions): Promise<CloudConversationListItem[]> {
		// Supabase full-text search via ilike on title (simple implementation)
		// For production, use a GIN index on to_tsvector('english', title || ' ' || snapshot::text)
		const limit = options.limit ?? 50;
		const offset = options.offset ?? 0;
		const q = `%${options.query.replace(/%/g, '\\%')}%`;

		let params = `?workspace_id=eq.${encodeURIComponent(this.workspaceId)}`;
		params += `&select=id,workspace_id,title,tags,meta,created_at,updated_at`;
		params += `&title=ilike.${encodeURIComponent(q)}`;
		params += `&order=updated_at.desc&limit=${limit}&offset=${offset}`;

		const rows = await this.request<SupabaseRow[]>(params, 'GET');
		return (rows ?? []).map(rowToListItem);
	}

	async count(): Promise<number> {
		// Use HEAD request with Prefer: count=exact
		const res = await fetch(
			`${this.url}/rest/v1/${this.table}?workspace_id=eq.${encodeURIComponent(this.workspaceId)}&select=id`,
			{
				method: 'HEAD',
				headers: { ...this.headers, Prefer: 'count=exact' }
			}
		);
		const range = res.headers.get('content-range') ?? '';
		const total = range.split('/')[1];
		return total ? parseInt(total, 10) : 0;
	}

	// Suppress unused import warning
	private _endpointUnused = this.endpoint;
}
