# Traek Playground — Design Doc

**Date:** 2026-03-07
**Issue:** TRK-26
**Status:** Approved (derived from TRK-20 spec)

---

## Overview

The Traek Playground is a hosted SvelteKit application at `app.gettraek.com` that lets users experience Traek's spatial AI canvas with their own API keys. It's the primary monetization vehicle for Phase 1.

---

## Architecture

### App Location

New package: `apps/playground` in the monorepo, adjacent to `apps/web`.

### Stack

| Concern | Choice | Rationale |
|---|---|---|
| Framework | SvelteKit + `@traek/svelte` | Native, shares monorepo |
| Auth | Lucia v3 + magic-link | Passwordless, TypeScript-first |
| Email | Resend | Reliable deliverability, simple API |
| Database | Supabase (PostgreSQL) | Auth sessions, user profiles, cloud conversations |
| Local storage | `idb` (IndexedDB wrapper) | Free-tier conversations |
| Payments | Stripe | Subscriptions + webhooks |
| Deployment | Vercel (`@sveltejs/adapter-vercel`) | SvelteKit-native, edge-friendly |

### Tiers

| Tier | Price | Conversations | Storage |
|---|---|---|---|
| Free | $0 | 5 max | IndexedDB (local only) |
| Pro | $12/mo | Unlimited | Supabase cloud sync |
| Team | $29/mo/seat | Unlimited | Shared workspaces |

---

## Key Design Decisions

### BYOK Key Security

1. User enters API key in settings UI
2. Frontend sends key over HTTPS to `/api/keys`
3. Server encrypts with AES-256-GCM using an `ENCRYPTION_SECRET` env var (32-byte key)
4. Encrypted blob + IV stored in `user_profiles.encrypted_api_keys` (JSONB)
5. On chat request, server decrypts and proxies to OpenAI/Anthropic — key never leaves server
6. Key shown in UI only as masked form, never decrypted back to client

### Conversation Storage Abstraction

```
ConversationStore (interface)
  LocalConversationStore  -> IndexedDB (free)
  CloudConversationStore  -> Supabase (paid)
```

Free users get full functionality locally. Upgrading migrates local data to cloud.

### Auth Flow (Magic Link)

1. User enters email -> POST /api/auth/magic-link -> Resend sends email
2. User clicks link -> GET /api/auth/verify?token=... -> Lucia creates session
3. Session cookie set -> redirect to /app

### Sharing

- POST /api/share creates a shares row with token (UUID), conversation_id, snapshot (JSONB)
- Read-only view at /share/[token] renders TraekCanvas in read-only mode

---

## Route Structure

```
apps/playground/src/routes/
  +layout.svelte              # Root layout, analytics
  +layout.server.ts           # Load session
  +page.svelte                # Landing/marketing page
  auth/
    signin/+page.svelte       # Email input
    verify/+page.svelte       # Magic link landing
    signout/+page.server.ts   # Clear session
  app/                        # Auth-guarded
    +layout.server.ts         # Redirect if not authed
    +page.svelte              # Conversation list
    settings/+page.svelte     # API keys, subscription
    [id]/+page.svelte         # TraekCanvas conversation
  share/
    [token]/+page.svelte      # Read-only shared canvas
  api/
    auth/magic-link/+server.ts
    auth/verify/+server.ts
    chat/+server.ts           # BYOK streaming proxy
    conversations/+server.ts  # CRUD (cloud tier)
    keys/+server.ts           # Save/delete API keys
    share/+server.ts          # Generate share tokens
    stripe/
      checkout/+server.ts
      portal/+server.ts
      webhook/+server.ts
```

---

## Database Schema (Supabase)

```sql
-- Lucia auth
users (id, email, created_at)
sessions (id, user_id, expires_at)
magic_link_tokens (id, user_id, token_hash, expires_at, used_at)

-- App data
user_profiles (user_id PK, tier, stripe_customer_id, stripe_subscription_id, encrypted_api_keys JSONB)
conversations (id, user_id, title, created_at, updated_at, snapshot JSONB)
shares (id, token UUID UNIQUE, conversation_id, user_id, created_at, snapshot JSONB)
```

---

## Environment Variables

```
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
PUBLIC_SUPABASE_URL=
PUBLIC_SUPABASE_ANON_KEY=
LUCIA_SECRET=
ENCRYPTION_SECRET=
RESEND_API_KEY=
RESEND_FROM=noreply@gettraek.com
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRO_PRICE_ID=
STRIPE_TEAM_PRICE_ID=
PUBLIC_APP_URL=https://app.gettraek.com
```

---

## Implementation Subtasks

1. Scaffold apps/playground (package.json, configs, basic layout + landing page)
2. Auth: Lucia v3 + Supabase adapter + magic-link email flow
3. BYOK: API key entry UI + server encryption + chat proxy
4. Conversation persistence: IndexedDB (free) + Supabase (paid) + migration
5. Stripe subscriptions: checkout, portal, webhook, tier enforcement
6. Sharing: share token generation + read-only canvas view
7. Deployment: Vercel config, domain, env vars, smoke tests
