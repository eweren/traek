<script lang="ts">
	interface Props {
		/** Brand/product name shown as accessible text */
		name?: string;
		/** URL of logo image (png, svg, webp). Mutually exclusive with logoSvg. */
		logoUrl?: string;
		/** Inline SVG string. Used when logoUrl is not available. */
		logoSvg?: string;
		/** Alt text for the logo. Defaults to `${name} logo`. */
		logoAlt?: string;
		/** CSS width of the logo. @default '80px' */
		logoWidth?: string;
		/** Loading caption shown below the logo. */
		text?: string;
		/** ARIA label for the loading region */
		label?: string;
	}

	let {
		name,
		logoUrl,
		logoSvg,
		logoAlt,
		logoWidth = '80px',
		text = 'Loading…',
		label
	}: Props = $props();

	const ariaLabel = label ?? name ?? 'Loading';
	const alt = logoAlt ?? (name ? `${name} logo` : 'Logo');
</script>

<!--
  BrandedLoading — centered logo + caption on a blurred canvas background.
  Supply either logoUrl (image) or logoSvg (inline SVG).
-->
<div class="wl-branded-overlay" role="status" aria-label={ariaLabel}>
	<div class="wl-branded-card">
		{#if logoUrl}
			<img src={logoUrl} {alt} class="wl-branded-logo" style:width={logoWidth} draggable="false" />
		{:else if logoSvg}
			<div class="wl-branded-logo-svg" style:width={logoWidth} aria-label={alt} role="img">
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html logoSvg}
			</div>
		{/if}

		{#if text}
			<p class="wl-branded-text">{text}</p>
		{/if}

		<div class="wl-branded-spinner" aria-hidden="true">
			<span class="wl-branded-dot"></span>
			<span class="wl-branded-dot"></span>
			<span class="wl-branded-dot"></span>
		</div>
	</div>
</div>

<style>
	.wl-branded-overlay {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: radial-gradient(
			ellipse at 50% 0%,
			var(--traek-overlay-gradient-1, rgba(0, 0, 0, 0.7)),
			var(--traek-overlay-gradient-2, rgba(0, 0, 0, 0.9)) 50%,
			var(--traek-overlay-gradient-3, rgba(0, 0, 0, 1))
		);
		backdrop-filter: blur(28px);
	}

	.wl-branded-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.25rem;
		padding: 2.5rem 3rem;
		border-radius: 20px;
		background: var(--traek-overlay-card-bg, rgba(15, 15, 15, 0.9));
		border: 1px solid var(--traek-overlay-card-border, rgba(255, 255, 255, 0.08));
		box-shadow: 0 24px 64px var(--traek-overlay-card-shadow, rgba(0, 0, 0, 0.8));
	}

	.wl-branded-logo {
		display: block;
		height: auto;
		max-height: 120px;
		object-fit: contain;
	}

	.wl-branded-logo-svg {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.wl-branded-logo-svg :global(svg) {
		width: 100%;
		height: auto;
	}

	.wl-branded-text {
		margin: 0;
		color: var(--traek-overlay-text, #e5e5e5);
		font-size: 0.875rem;
		opacity: 0.7;
	}

	.wl-branded-spinner {
		display: flex;
		gap: 6px;
		align-items: center;
	}

	.wl-branded-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--traek-overlay-pill-bg, #00d8ff);
		opacity: 0.4;
		animation: wl-bounce 1.2s ease-in-out infinite;
	}

	.wl-branded-dot:nth-child(1) {
		animation-delay: 0s;
	}
	.wl-branded-dot:nth-child(2) {
		animation-delay: 0.2s;
	}
	.wl-branded-dot:nth-child(3) {
		animation-delay: 0.4s;
	}

	@keyframes wl-bounce {
		0%,
		80%,
		100% {
			transform: translateY(0);
			opacity: 0.4;
		}
		40% {
			transform: translateY(-6px);
			opacity: 1;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.wl-branded-dot {
			animation: none;
			opacity: 0.7;
		}
	}
</style>
