<script lang="ts">
	interface Props {
		/** Loading text. Defaults to CSS var fallback or "Loading…" */
		text?: string;
		/** ARIA label for the loading region */
		label?: string;
	}

	let { text = 'Loading…', label = 'Loading' }: Props = $props();
</script>

<!--
  MinimalLoading — drop-in replacement for DefaultLoadingOverlay.
  Identical appearance; all colors come from --traek-* CSS custom properties
  so white-label token overrides apply automatically.
-->
<div class="wl-minimal-overlay" role="status" aria-label={label}>
	<div class="wl-minimal-pill">
		<span class="wl-minimal-dot" aria-hidden="true"></span>
		<span>{text}</span>
	</div>
</div>

<style>
	.wl-minimal-overlay {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: radial-gradient(
			circle at top,
			var(--traek-overlay-gradient-1, rgba(0, 0, 0, 0.7)),
			var(--traek-overlay-gradient-2, rgba(0, 0, 0, 0.9)) 60%,
			var(--traek-overlay-gradient-3, rgba(0, 0, 0, 1))
		);
		backdrop-filter: blur(22px);
	}

	.wl-minimal-pill {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		border-radius: 999px;
		background: var(--traek-overlay-card-bg, rgba(15, 15, 15, 0.9));
		border: 1px solid var(--traek-overlay-card-border, rgba(255, 255, 255, 0.08));
		box-shadow: 0 18px 48px var(--traek-overlay-card-shadow, rgba(0, 0, 0, 0.8));
		color: var(--traek-overlay-text, #e5e5e5);
		font-size: 0.875rem;
	}

	.wl-minimal-dot {
		width: 8px;
		height: 8px;
		border-radius: 999px;
		background: var(--traek-overlay-pill-bg, #00d8ff);
		box-shadow: 0 0 16px var(--traek-overlay-pill-shadow, rgba(0, 216, 255, 0.7));
		animation: wl-pulse 1.5s ease-in-out infinite;
	}

	@keyframes wl-pulse {
		0%,
		100% {
			opacity: 1;
			transform: scale(1);
		}
		50% {
			opacity: 0.6;
			transform: scale(0.85);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.wl-minimal-dot {
			animation: none;
		}
	}
</style>
