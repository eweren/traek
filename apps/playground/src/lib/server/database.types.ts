export type Database = {
	public: {
		Tables: {
			users: {
				Row: { id: string; email: string; created_at: string };
				Insert: { id?: string; email: string; created_at?: string };
				Update: { id?: string; email?: string; created_at?: string };
				Relationships: [];
			};
			sessions: {
				Row: { id: string; user_id: string; expires_at: string; users?: { id: string } };
				Insert: { id: string; user_id: string; expires_at: string };
				Update: { expires_at?: string };
				Relationships: [
					{
						foreignKeyName: 'sessions_user_id_fkey';
						columns: ['user_id'];
						referencedRelation: 'users';
						referencedColumns: ['id'];
					}
				];
			};
			magic_link_tokens: {
				Row: {
					id: string;
					user_id: string;
					token_hash: string;
					expires_at: string;
					used_at: string | null;
				};
				Insert: {
					id?: string;
					user_id: string;
					token_hash: string;
					expires_at: string;
					used_at?: string | null;
				};
				Update: { used_at?: string | null };
				Relationships: [];
			};
			user_profiles: {
				Row: {
					user_id: string;
					encrypted_api_keys: Record<string, { ciphertext: string; iv: string }> | null;
					stripe_customer_id: string | null;
					stripe_subscription_id: string | null;
					tier: 'free' | 'pro' | 'team' | 'enterprise';
					enterprise_seats: number | null;
					enterprise_trial_ends_at: string | null;
				};
				Insert: {
					user_id: string;
					encrypted_api_keys?: Record<string, { ciphertext: string; iv: string }> | null;
					stripe_customer_id?: string | null;
					stripe_subscription_id?: string | null;
					tier?: 'free' | 'pro' | 'team' | 'enterprise';
					enterprise_seats?: number | null;
					enterprise_trial_ends_at?: string | null;
				};
				Update: {
					encrypted_api_keys?: Record<string, { ciphertext: string; iv: string }> | null;
					stripe_customer_id?: string | null;
					stripe_subscription_id?: string | null;
					tier?: 'free' | 'pro' | 'team' | 'enterprise';
					enterprise_seats?: number | null;
					enterprise_trial_ends_at?: string | null;
				};
				Relationships: [];
			};
			enterprise_licenses: {
				Row: {
					id: string;
					user_id: string;
					license_key: string;
					seats: number;
					valid_until: string;
					revoked_at: string | null;
					metadata: Record<string, unknown>;
					created_at: string;
				};
				Insert: {
					id?: string;
					user_id: string;
					license_key: string;
					seats: number;
					valid_until: string;
					revoked_at?: string | null;
					metadata?: Record<string, unknown>;
					created_at?: string;
				};
				Update: {
					revoked_at?: string | null;
					metadata?: Record<string, unknown>;
				};
				Relationships: [];
			};
			enterprise_seats: {
				Row: {
					id: string;
					license_id: string;
					email: string;
					assigned_at: string;
					revoked_at: string | null;
				};
				Insert: {
					id?: string;
					license_id: string;
					email: string;
					assigned_at?: string;
					revoked_at?: string | null;
				};
				Update: {
					revoked_at?: string | null;
				};
				Relationships: [];
			};
			shares: {
				Row: {
					id: string;
					token: string;
					conversation_id: string;
					user_id: string;
					snapshot: unknown;
					created_at: string;
				};
				Insert: {
					id?: string;
					token: string;
					conversation_id: string;
					user_id: string;
					snapshot: unknown;
					created_at?: string;
				};
				Update: { token?: string; conversation_id?: string; snapshot?: unknown };
				Relationships: [];
			};
			analytics_events: {
				Row: {
					id: string;
					event: string;
					properties: Record<string, unknown> | null;
					user_id: string | null;
					created_at: string;
				};
				Insert: {
					id?: string;
					event: string;
					properties?: Record<string, unknown> | null;
					user_id?: string | null;
					created_at?: string;
				};
				Update: Record<string, never>;
				Relationships: [];
			};
		};
		Views: Record<string, never>;
		Functions: Record<string, never>;
		Enums: Record<string, never>;
	};
};
