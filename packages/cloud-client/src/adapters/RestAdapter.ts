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

export interface RestAdapterOptions {
	/**
	 * Base URL of the REST API (e.g. 'https://api.example.com/traek/v1').
	 * Endpoints are appended as:
	 * - POST   {baseUrl}/conversations
	 * - GET    {baseUrl}/conversations/{id}
	 * - PATCH  {baseUrl}/conversations/{id}
	 * - DELETE {baseUrl}/conversations/{id}
	 * - GET    {baseUrl}/conversations?limit=50&offset=0&...
	 * - GET    {baseUrl}/conversations/search?q=...
	 * - GET    {baseUrl}/conversations/count
	 */
	baseUrl: string;
	/**
	 * Optional auth token. Sent as `Authorization: Bearer {token}`.
	 */
	token?: string;
	/**
	 * Optional additional headers to include on every request.
	 */
	headers?: Record<string, string>;
}

/**
 * Generic REST adapter for CloudClient.
 *
 * Follows a simple JSON REST convention — implement a compatible backend
 * or use the provided OpenAPI spec to generate a server implementation.
 *
 * Expected response shapes:
 * - List: `{ data: CloudConversationListItem[], total: number }`
 * - Single: `CloudConversation`
 * - Count: `{ count: number }`
 */
export class RestAdapter implements CloudAdapter {
	private baseUrl: string;
	private extraHeaders: Record<string, string>;

	constructor(opts: RestAdapterOptions) {
		this.baseUrl = opts.baseUrl.replace(/\/$/, '');
		this.extraHeaders = {
			'Content-Type': 'application/json',
			...(opts.token ? { Authorization: `Bearer ${opts.token}` } : {}),
			...(opts.headers ?? {})
		};
	}

	private async request<T>(path: string, method: string, body?: unknown): Promise<T> {
		const res = await fetch(`${this.baseUrl}${path}`, {
			method,
			headers: this.extraHeaders,
			...(body !== undefined ? { body: JSON.stringify(body) } : {})
		});
		if (res.status === 404) return null as T;
		if (!res.ok) {
			const text = await res.text().catch(() => res.statusText);
			throw new Error(`REST ${method} ${path}: ${res.status} ${text}`);
		}
		if (res.status === 204) return undefined as T;
		return res.json() as Promise<T>;
	}

	async create(payload: CreateConversationPayload): Promise<CloudConversation> {
		const raw = await this.request<CloudConversation>('/conversations', 'POST', payload);
		raw.snapshot = conversationSnapshotSchema.parse(raw.snapshot);
		return raw;
	}

	async get(id: string): Promise<CloudConversation | null> {
		const raw = await this.request<CloudConversation | null>(
			`/conversations/${encodeURIComponent(id)}`,
			'GET'
		);
		if (!raw) return null;
		raw.snapshot = conversationSnapshotSchema.parse(raw.snapshot);
		return raw;
	}

	async update(id: string, payload: UpdateConversationPayload): Promise<CloudConversation> {
		const raw = await this.request<CloudConversation>(
			`/conversations/${encodeURIComponent(id)}`,
			'PATCH',
			payload
		);
		if (raw.snapshot) raw.snapshot = conversationSnapshotSchema.parse(raw.snapshot);
		return raw;
	}

	async delete(id: string): Promise<void> {
		await this.request<void>(`/conversations/${encodeURIComponent(id)}`, 'DELETE');
	}

	async list(options?: ListOptions): Promise<CloudConversationListItem[]> {
		const params = new URLSearchParams();
		if (options?.limit !== undefined) params.set('limit', String(options.limit));
		if (options?.offset !== undefined) params.set('offset', String(options.offset));
		if (options?.sortBy) params.set('sortBy', options.sortBy);
		if (options?.order) params.set('order', options.order);
		if (options?.tag) params.set('tag', options.tag);

		const qs = params.toString();
		const result = await this.request<{ data: CloudConversationListItem[] }>(
			`/conversations${qs ? `?${qs}` : ''}`,
			'GET'
		);
		return result?.data ?? [];
	}

	async search(options: SearchOptions): Promise<CloudConversationListItem[]> {
		const params = new URLSearchParams({ q: options.query });
		if (options.limit !== undefined) params.set('limit', String(options.limit));
		if (options.offset !== undefined) params.set('offset', String(options.offset));

		const result = await this.request<{ data: CloudConversationListItem[] }>(
			`/conversations/search?${params.toString()}`,
			'GET'
		);
		return result?.data ?? [];
	}

	async count(): Promise<number> {
		const result = await this.request<{ count: number }>('/conversations/count', 'GET');
		return result?.count ?? 0;
	}
}
