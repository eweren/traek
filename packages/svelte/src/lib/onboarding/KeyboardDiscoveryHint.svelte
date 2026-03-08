<script lang="ts">
	import { onMount } from 'svelte';

	/**
	 * KeyboardDiscoveryHint — Surfaces the keyboard shortcut overlay (`?`) for new users.
	 *
	 * Appears 1500ms after mount (or after tour completion via `show` prop). Auto-dismisses
	 * after 6 seconds. Permanently dismissed when the user opens the keyboard help overlay
	 * or clicks the × button (stored in localStorage). Session-dismissed on auto-timeout.
	 */

	let {
		onDismiss,
		onOpen
	}: {
		/** Called when the hint is closed for any reason. */
		onDismiss?: () => void;
		/** Called when the user acknowledges the hint by pressing ? or clicking it. */
		onOpen?: () => void;
	} = $props();

	const STORAGE_KEY = 'traek-keyboard-hint-dismissed';
	const APPEAR_DELAY_MS = 1500;
	const AUTO_DISMISS_MS = 6000;

	let visible = $state(false);
	let autoTimer: ReturnType<typeof setTimeout> | null = null;

	onMount(() => {
		if (typeof localStorage !== 'undefined') {
			if (localStorage.getItem(STORAGE_KEY)) return;
		}

		const appearTimer = setTimeout(() => {
			visible = true;
			autoTimer = setTimeout(() => {
				visible = false;
				onDismiss?.();
			}, AUTO_DISMISS_MS);
		}, APPEAR_DELAY_MS);

		const handleKeydown = (e: KeyboardEvent) => {
			if (e.key === '?') {
				permanentDismiss();
				onOpen?.();
			}
		};
		window.addEventListener('keydown', handleKeydown);

		return () => {
			clearTimeout(appearTimer);
			if (autoTimer) clearTimeout(autoTimer);
			window.removeEventListener('keydown', handleKeydown);
		};
	});

	function permanentDismiss() {
		if (autoTimer) clearTimeout(autoTimer);
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem(STORAGE_KEY, 'true');
		}
		visible = false;
		onDismiss?.();
	}
</script>

{#if visible}
	<div class="keyboard-hint" role="status" aria-live="polite" aria-label="Keyboard shortcut tip">
		<svg
			class="hint-icon"
			width="16"
			height="16"
			viewBox="0 0 16 16"
			fill="none"
			aria-hidden="true"
		>
			<rect x="1" y="4" width="14" height="9" rx="2" stroke="currentColor" stroke-width="1.3" />
			<rect x="3" y="6.5" width="2" height="2" rx="0.5" fill="currentColor" />
			<rect x="7" y="6.5" width="2" height="2" rx="0.5" fill="currentColor" />
			<rect x="11" y="6.5" width="2" height="2" rx="0.5" fill="currentColor" />
			<rect x="5" y="9.5" width="6" height="2" rx="0.5" fill="currentColor" />
		</svg>
		<span class="hint-text">Press <kbd>?</kbd> for keyboard shortcuts</span>
		<button
			class="hint-dismiss"
			onclick={permanentDismiss}
			aria-label="Dismiss keyboard shortcut hint"
		>
			<svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
				<path
					d="M2 2l8 8M10 2l-8 8"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
				/>
			</svg>
		</button>
	</div>
{/if}

<style>
	.keyboard-hint {
		position: absolute;
		bottom: 80px;
		right: 20px;
		z-index: 60;
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 10px 14px;
		background: var(--traek-input-bg, rgba(30, 30, 30, 0.95));
		border: 1px solid var(--traek-input-border, #444444);
		border-radius: 10px;
		color: var(--traek-node-text, #dddddd);
		font-size: 13px;
		line-height: 1;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
		animation: hint-slide-in 0.25s cubic-bezier(0.16, 1, 0.3, 1);
		pointer-events: auto;
	}

	@keyframes hint-slide-in {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.hint-icon {
		color: var(--traek-input-dot, #00d8ff);
		flex-shrink: 0;
	}

	.hint-text {
		color: var(--traek-input-context-text, #aaaaaa);
		white-space: nowrap;
	}

	kbd {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 20px;
		height: 20px;
		padding: 0 5px;
		background: var(--traek-thought-toggle-bg, #444444);
		border: 1px solid var(--traek-thought-toggle-border, #555555);
		border-radius: 4px;
		font-family: var(--traek-font-mono, monospace);
		font-size: 11px;
		font-weight: 600;
		color: var(--traek-input-dot, #00d8ff);
	}

	.hint-dismiss {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		min-width: 44px;
		min-height: 44px;
		/* Visually 24px, but touch target is 44px via negative margin trick */
		margin: -10px -10px -10px 0;
		padding: 10px;
		background: transparent;
		border: none;
		color: var(--traek-input-context-text, #888888);
		cursor: pointer;
		border-radius: 6px;
		transition: color 0.15s;
		flex-shrink: 0;
	}

	.hint-dismiss:hover {
		color: var(--traek-node-text, #dddddd);
	}

	.hint-dismiss:focus-visible {
		outline: 2px solid var(--traek-input-dot, #00d8ff);
		outline-offset: 2px;
	}

	@media (prefers-reduced-motion: reduce) {
		.keyboard-hint {
			animation: none;
		}
	}
</style>
