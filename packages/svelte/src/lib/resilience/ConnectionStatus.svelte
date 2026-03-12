<script lang="ts">
	import { offlineQueue } from './offlineQueue.svelte';
	import { fade } from 'svelte/transition';

	let {
		onReconnect
	}: {
		/** Called when connectivity is restored. Use this to flush the offline queue. */
		onReconnect?: () => void;
	} = $props();

	type DisplayState = 'hidden' | 'offline' | 'reconnecting' | 'back_online';

	let displayState = $state<DisplayState>('hidden');
	let backOnlineTimer: ReturnType<typeof setTimeout> | null = null;

	$effect(() => {
		if (offlineQueue.isOnline) {
			if (displayState === 'offline' || displayState === 'reconnecting') {
				displayState = 'back_online';
				onReconnect?.();
				backOnlineTimer = setTimeout(() => {
					displayState = 'hidden';
				}, 3000);
			}
		} else {
			if (backOnlineTimer != null) {
				clearTimeout(backOnlineTimer);
				backOnlineTimer = null;
			}
			displayState = 'offline';
		}
	});

	const label = $derived.by(() => {
		if (displayState === 'offline') {
			const count = offlineQueue.queue.length;
			return count > 0 ? `Offline · ${count} queued` : 'Offline';
		}
		if (displayState === 'reconnecting') return 'Reconnecting…';
		if (displayState === 'back_online') {
			const count = offlineQueue.queue.length;
			return count > 0 ? `Back online — sending ${count} queued` : 'Back online';
		}
		return '';
	});

	const ariaLabel = $derived.by(() => {
		if (displayState === 'offline') {
			const count = offlineQueue.queue.length;
			return count > 0
				? `You are offline. ${count} message${count === 1 ? '' : 's'} queued.`
				: 'You are offline.';
		}
		if (displayState === 'reconnecting') return 'Reconnecting to the network…';
		if (displayState === 'back_online') return 'Connection restored.';
		return '';
	});
</script>

<!--
	ConnectionStatus — shows network connectivity state on the canvas.
	Hidden when online; appears automatically on offline/reconnect events.
	Position: place alongside ZoomControls in the canvas top-right area.
-->
{#if displayState !== 'hidden'}
	<div
		class="connection-status"
		class:status-offline={displayState === 'offline'}
		class:status-reconnecting={displayState === 'reconnecting'}
		class:status-back-online={displayState === 'back_online'}
		role="status"
		aria-live="polite"
		aria-label={ariaLabel}
		title={ariaLabel}
		transition:fade={{ duration: 200 }}
	>
		<span class="status-dot" aria-hidden="true"></span>
		<span class="status-label">{label}</span>
	</div>
{/if}

<style>
	@layer base;

	@layer base {
		.connection-status {
			display: inline-flex;
			align-items: center;
			gap: 6px;
			padding: 4px 10px;
			border-radius: 20px;
			font-size: 12px;
			font-weight: 500;
			letter-spacing: 0.01em;
			white-space: nowrap;
			backdrop-filter: blur(12px);
			border: 1px solid transparent;
			transition:
				background 0.2s,
				border-color 0.2s,
				color 0.2s;
		}

		.status-dot {
			width: 6px;
			height: 6px;
			border-radius: 50%;
			flex-shrink: 0;
			transition: background 0.2s;
		}

		/* Offline — red */
		.status-offline {
			background: rgba(239, 68, 68, 0.12);
			border-color: rgba(239, 68, 68, 0.25);
			color: var(--traek-status-offline, #ef4444);
		}
		.status-offline .status-dot {
			background: var(--traek-status-offline, #ef4444);
		}

		/* Reconnecting — amber pulsing */
		.status-reconnecting {
			background: rgba(245, 158, 11, 0.1);
			border-color: rgba(245, 158, 11, 0.25);
			color: var(--traek-status-reconnect, #f59e0b);
		}
		.status-reconnecting .status-dot {
			background: var(--traek-status-reconnect, #f59e0b);
			animation: pulse 1.2s ease-in-out infinite;
		}

		/* Back online — green, auto-dismisses */
		.status-back-online {
			background: rgba(16, 185, 129, 0.1);
			border-color: rgba(16, 185, 129, 0.25);
			color: var(--traek-status-online, #10b981);
		}
		.status-back-online .status-dot {
			background: var(--traek-status-online, #10b981);
		}

		@keyframes pulse {
			0%,
			100% {
				opacity: 1;
			}
			50% {
				opacity: 0.3;
			}
		}
	}
</style>
