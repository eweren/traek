<script lang="ts">
	interface Props {
		/** Brand/product name */
		name?: string;
		/** Logo image URL */
		logoUrl?: string;
		/** Inline SVG string */
		logoSvg?: string;
		/** Alt text for the logo */
		logoAlt?: string;
		/** CSS width of the logo. @default '120px' */
		logoWidth?: string;
		/** Loading caption */
		text?: string;
		/**
		 * Full-viewport background. CSS value: color, gradient, or url().
		 * @default 'var(--traek-canvas-bg, #0b0b0b)'
		 */
		background?: string;
		/** Show an animated progress bar at the bottom */
		showProgressBar?: boolean;
		/** ARIA label for the loading region */
		label?: string;
	}

	let {
		name,
		logoUrl,
		logoSvg,
		logoAlt,
		logoWidth = '120px',
		text,
		background = 'var(--traek-canvas-bg, #0b0b0b)',
		showProgressBar = false,
		label
	}: Props = $props();

	const ariaLabel = label ?? name ?? 'Loading';
	const alt = logoAlt ?? (name ? `${name} logo` : 'Logo');
</script>

<!--
  SplashLoading — full-viewport loading screen.
  Use for enterprise apps where the canvas is the whole page.
-->
<div class="wl-splash" style:background role="status" aria-label={ariaLabel} aria-live="polite">
	<div class="wl-splash-content">
		{#if logoUrl}
			<img src={logoUrl} {alt} class="wl-splash-logo" style:width={logoWidth} draggable="false" />
		{:else if logoSvg}
			<div class="wl-splash-logo-svg" style:width={logoWidth} aria-label={alt} role="img">
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html logoSvg}
			</div>
		{/if}

		{#if name}
			<h1 class="wl-splash-name">{name}</h1>
		{/if}

		{#if text}
			<p class="wl-splash-text">{text}</p>
		{/if}
	</div>

	{#if showProgressBar}
		<div class="wl-splash-progress" aria-hidden="true">
			<div class="wl-splash-progress-bar"></div>
		</div>
	{/if}
</div>

<style>
	.wl-splash {
		position: fixed;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		z-index: 9999;
	}

	.wl-splash-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		padding: 2rem;
	}

	.wl-splash-logo {
		display: block;
		height: auto;
		max-height: 160px;
		object-fit: contain;
		animation: wl-fade-in 0.6s ease-out;
	}

	.wl-splash-logo-svg {
		display: flex;
		align-items: center;
		justify-content: center;
		animation: wl-fade-in 0.6s ease-out;
	}

	.wl-splash-logo-svg :global(svg) {
		width: 100%;
		height: auto;
	}

	.wl-splash-name {
		margin: 0;
		color: var(--traek-overlay-text, #e5e5e5);
		font-size: 1.5rem;
		font-weight: 600;
		letter-spacing: -0.02em;
		animation: wl-fade-in 0.6s ease-out 0.1s both;
	}

	.wl-splash-text {
		margin: 0;
		color: var(--traek-overlay-text, #e5e5e5);
		font-size: 0.875rem;
		opacity: 0.5;
		animation: wl-fade-in 0.6s ease-out 0.2s both;
	}

	/* Progress bar */
	.wl-splash-progress {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 3px;
		background: rgba(255, 255, 255, 0.08);
		overflow: hidden;
	}

	.wl-splash-progress-bar {
		height: 100%;
		background: var(--traek-overlay-pill-bg, #00d8ff);
		box-shadow: 0 0 12px var(--traek-overlay-pill-shadow, rgba(0, 216, 255, 0.5));
		animation: wl-progress 2s ease-in-out infinite;
		transform-origin: left;
	}

	@keyframes wl-fade-in {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes wl-progress {
		0% {
			transform: scaleX(0) translateX(0%);
		}
		50% {
			transform: scaleX(0.7) translateX(20%);
		}
		100% {
			transform: scaleX(0) translateX(200%);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.wl-splash-logo,
		.wl-splash-logo-svg,
		.wl-splash-name,
		.wl-splash-text {
			animation: none;
		}

		.wl-splash-progress-bar {
			animation: none;
			transform: scaleX(1);
		}
	}
</style>
