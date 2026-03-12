// ── Core client ───────────────────────────────────────────────────────────────
export { CloudClient } from './CloudClient.js';

// ── Types ─────────────────────────────────────────────────────────────────────
export type {
	CloudConversation,
	CloudConversationListItem,
	CloudAdapter,
	CloudClientOptions,
	CreateConversationPayload,
	UpdateConversationPayload,
	ListOptions,
	SearchOptions
} from './types.js';

// ── Adapters ──────────────────────────────────────────────────────────────────
export { SupabaseAdapter } from './adapters/SupabaseAdapter.js';
export type { SupabaseAdapterOptions } from './adapters/SupabaseAdapter.js';

export { RestAdapter } from './adapters/RestAdapter.js';
export type { RestAdapterOptions } from './adapters/RestAdapter.js';
