<script lang="ts">
	import type { CollabProvider } from '@traek/collab';

	let {
		provider,
		/** Duration in milliseconds before the banner auto-dismisses. @default 4000 */
		autoDismissMs = 4000
	}: {
		provider: CollabProvider;
		autoDismissMs?: number;
	} = $props();

	/**
	 * Track how many remote node-change events arrive while the local user
	 * is actively editing (i.e. has an activeNodeId in their own presence).
	 * This is the clearest signal of a "conflict resolved" situation.
	 */
	let conflictCount = $state(0);
	let visible = $state(false);
	let dismissTimer: ReturnType<typeof setTimeout> | null = null;

	function showBanner() {
		visible = true;
		if (dismissTimer) clearTimeout(dismissTimer);
		dismissTimer = setTimeout(() => {
			visible = false;
		}, autoDismissMs);
	}

	function dismiss() {
		visible = false;
		if (dismissTimer) {
			clearTimeout(dismissTimer);
			dismissTimer = null;
		}
	}

	$effect(() => {
		let localActiveNodeId: string | null = null;

		// Track local active node via provider's own awareness state
		const unsubPresence = provider.onPresenceChange(() => {
			const local = provider.getLocalPresence();
			localActiveNodeId = local?.activeNodeId ?? null;
		});

		// When a remote node change arrives while we have an active node,
		// it means our edit overlapped with a remote change — Yjs resolved it.
		const unsubNode = provider.onNodeChange((_nodeId: string) => {
			if (localActiveNodeId) {
				conflictCount += 1;
				showBanner();
			}
		});

		return () => {
			unsubPresence();
			unsubNode();
			if (dismissTimer) clearTimeout(dismissTimer);
		};
	});
</script>

<!--
	CollabConflictBanner — a non-intrusive banner that appears briefly when Yjs
	resolves a simultaneous-edit conflict (remote change merges while you are editing).

	Place this anywhere in your layout; it positions itself fixed at the top centre
	of the viewport and auto-dismisses after `autoDismissMs`.

	Yjs / CRDT resolution is automatic and lossless — this banner simply lets users
	know their content merged with a collaborator's change so they can review it.
-->
{#if visible}
	<div
		class="conflict-banner"
		role="status"
		aria-live="polite"
		aria-label="Conflict resolved — content merged with a collaborator's change"
	>
		<span class="conflict-icon" aria-hidden="true">⇄</span>
		<span class="conflict-text">
			Content merged with a collaborator's edit
			{#if conflictCount > 1}
				<em>({conflictCount} changes)</em>
			{/if}
		</span>
		<button
			type="button"
			class="conflict-dismiss"
			onclick={dismiss}
			aria-label="Dismiss notification"
		>
			✕
		</button>
	</div>
{/if}

<style>
	.conflict-banner {
		position: fixed;
		top: 12px;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 8px 14px;
		border-radius: 8px;
		background: var(--traek-conflict-bg, rgba(30, 30, 40, 0.92));
		border: 1px solid var(--traek-conflict-border, rgba(124, 58, 237, 0.5));
		color: var(--traek-conflict-text, #e2d9f3);
		font-size: 12px;
		font-weight: 500;
		backdrop-filter: blur(8px);
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
		z-index: 9999;
		white-space: nowrap;
		animation: slide-in 0.2s ease-out;
	}

	.conflict-icon {
		font-size: 14px;
		opacity: 0.85;
		color: #a78bfa;
	}

	.conflict-text em {
		font-style: normal;
		opacity: 0.7;
		margin-left: 4px;
	}

	.conflict-dismiss {
		margin-left: 4px;
		padding: 0 4px;
		background: none;
		border: none;
		color: inherit;
		opacity: 0.55;
		font-size: 11px;
		cursor: pointer;
		line-height: 1;
		transition: opacity 0.15s;
		font-family: inherit;
	}

	.conflict-dismiss:hover {
		opacity: 1;
	}

	.conflict-dismiss:focus-visible {
		outline: 2px solid #a78bfa;
		outline-offset: 2px;
		border-radius: 2px;
	}

	@keyframes slide-in {
		from {
			opacity: 0;
			transform: translateX(-50%) translateY(-8px);
		}
		to {
			opacity: 1;
			transform: translateX(-50%) translateY(0);
		}
	}
</style>
