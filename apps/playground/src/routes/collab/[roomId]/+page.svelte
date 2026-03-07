<script lang="ts">
	import { onMount } from 'svelte';
	import { TraekEngine } from '@traek/svelte';
	import { assignColor, type CollabConfig } from '@traek/collab';
	import { page } from '$app/state';
	import CollabSession from './CollabSession.svelte';

	const roomId = $derived(page.params.roomId ?? 'default');

	// ── Identity / form state ──────────────────────────────────────────────────

	let displayName = $state('');
	let serverUrl = $state('ws://localhost:1234');

	onMount(() => {
		displayName = localStorage.getItem('collab-display-name') ?? '';
		serverUrl = localStorage.getItem('collab-server-url') ?? 'ws://localhost:1234';
	});

	// ── Session state (set on join) ────────────────────────────────────────────

	let session = $state<{ engine: TraekEngine; config: CollabConfig } | null>(null);

	function joinRoom() {
		const name = displayName.trim() || 'Anonymous';
		const userId = localStorage.getItem('collab-user-id') ?? crypto.randomUUID();
		localStorage.setItem('collab-user-id', userId);
		localStorage.setItem('collab-display-name', name);
		localStorage.setItem('collab-server-url', serverUrl);

		session = {
			engine: new TraekEngine(),
			config: {
				serverUrl,
				roomId,
				user: { id: userId, name, color: assignColor(userId) }
			}
		};
	}
</script>

<svelte:head>
	<title>Collab: {roomId} — Traek Playground</title>
</svelte:head>

{#if !session}
	<!-- ── Join screen ──────────────────────────────────────────────────────── -->
	<div class="join-screen">
		<div class="join-card">
			<div class="join-header">
				<div class="join-logo" aria-hidden="true">
					<svg width="32" height="32" viewBox="0 0 32 32" fill="none">
						<rect width="32" height="32" rx="8" fill="#00d8ff" fill-opacity="0.15" />
						<circle cx="10" cy="16" r="3" fill="#00d8ff" />
						<circle cx="22" cy="10" r="3" fill="#00d8ff" fill-opacity="0.7" />
						<circle cx="22" cy="22" r="3" fill="#00d8ff" fill-opacity="0.7" />
						<line
							x1="13"
							y1="16"
							x2="19"
							y2="10"
							stroke="#00d8ff"
							stroke-width="1.5"
							stroke-opacity="0.5"
						/>
						<line
							x1="13"
							y1="16"
							x2="19"
							y2="22"
							stroke="#00d8ff"
							stroke-width="1.5"
							stroke-opacity="0.5"
						/>
					</svg>
				</div>
				<div>
					<h1 class="join-title">Join collab room</h1>
					<p class="join-room-id"><span class="room-label">Room</span> {roomId}</p>
				</div>
			</div>

			<form
				class="join-form"
				onsubmit={(e) => {
					e.preventDefault();
					joinRoom();
				}}
			>
				<label class="field">
					<span class="field-label">Your name</span>
					<input
						class="field-input"
						type="text"
						bind:value={displayName}
						placeholder="e.g. Alice"
						maxlength="40"
						autofocus
					/>
				</label>

				<label class="field">
					<span class="field-label">Collab server URL</span>
					<input
						class="field-input"
						type="url"
						bind:value={serverUrl}
						placeholder="ws://localhost:1234"
					/>
					<span class="field-hint">
						Run locally: <code>npx y-websocket</code>
					</span>
				</label>

				<button type="submit" class="join-btn">Join room</button>
			</form>

			<p class="share-hint">Share this page URL with teammates to collaborate in real time.</p>
		</div>
	</div>
{:else}
	<!-- CollabSession mounts useCollab() at its own init time -->
	<CollabSession engine={session.engine} collabConfig={session.config} />
{/if}

<style>
	/* ── Join screen ─────────────────────────────────────────────────────────── */
	:global(body) {
		margin: 0;
		padding: 0;
		font-family:
			system-ui,
			-apple-system,
			sans-serif;
	}

	.join-screen {
		min-height: 100dvh;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #0b0b0b;
		padding: 1.5rem;
	}

	.join-card {
		width: 100%;
		max-width: 420px;
		background: #141414;
		border: 1px solid #222;
		border-radius: 16px;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		gap: 1.75rem;
	}

	.join-header {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.join-logo {
		flex-shrink: 0;
	}

	.join-title {
		font-size: 1.25rem;
		font-weight: 700;
		color: #fff;
		margin: 0 0 4px;
	}

	.join-room-id {
		font-size: 0.8125rem;
		color: #888;
		margin: 0;
	}

	.room-label {
		display: inline-block;
		background: #1e1e1e;
		border: 1px solid #2a2a2a;
		border-radius: 4px;
		padding: 1px 6px;
		font-size: 0.6875rem;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: #555;
		margin-right: 4px;
	}

	.join-form {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.field-label {
		font-size: 0.8125rem;
		font-weight: 500;
		color: #aaa;
	}

	.field-input {
		background: #1a1a1a;
		border: 1px solid #2e2e2e;
		border-radius: 8px;
		padding: 10px 12px;
		font-size: 0.9375rem;
		color: #fff;
		font-family: inherit;
		outline: none;
		transition: border-color 0.15s;
	}

	.field-input:focus {
		border-color: #00d8ff;
	}

	.field-hint {
		font-size: 0.75rem;
		color: #555;
	}

	.field-hint code {
		font-family: monospace;
		background: #1e1e1e;
		padding: 1px 5px;
		border-radius: 3px;
		color: #888;
	}

	.join-btn {
		padding: 11px 20px;
		background: #00d8ff;
		color: #000;
		border: none;
		border-radius: 8px;
		font-size: 0.9375rem;
		font-weight: 600;
		font-family: inherit;
		cursor: pointer;
		transition: opacity 0.15s;
	}

	.join-btn:hover {
		opacity: 0.88;
	}

	.share-hint {
		font-size: 0.75rem;
		color: #444;
		text-align: center;
		margin: 0;
	}
</style>
