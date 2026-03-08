<script lang="ts">
	/** Number of skeleton lines to render. */
	let { lines = 3 }: { lines?: number } = $props();

	const widths = ['85%', '72%', '60%'];
	const lineWidths = $derived(Array.from({ length: lines }, (_, i) => widths[i % widths.length]));
</script>

<div class="skeleton" aria-hidden="true">
	{#each lineWidths as width, i (i)}
		<div class="skeleton-line" style:width></div>
	{/each}
</div>

<style>
	@layer base {
		@keyframes skeleton-shimmer {
			0% {
				background-position: -200% center;
			}
			100% {
				background-position: 200% center;
			}
		}

		.skeleton {
			display: flex;
			flex-direction: column;
			gap: 10px;
			padding: 4px 0;
		}

		.skeleton-line {
			height: 12px;
			border-radius: 6px;
			background: linear-gradient(
				90deg,
				var(--traek-node-border, rgba(255, 255, 255, 0.08)) 25%,
				var(--traek-node-active-border, rgba(0, 216, 255, 0.12)) 50%,
				var(--traek-node-border, rgba(255, 255, 255, 0.08)) 75%
			);
			background-size: 200% 100%;
			animation: skeleton-shimmer 1.6s ease-in-out infinite;
		}

		.skeleton-line:nth-child(2) {
			animation-delay: 0.15s;
		}

		.skeleton-line:nth-child(3) {
			animation-delay: 0.3s;
		}

		.skeleton-line:nth-child(4) {
			animation-delay: 0.45s;
		}

		@media (prefers-reduced-motion: reduce) {
			.skeleton-line {
				animation: none;
				opacity: 0.4;
			}
		}
	}
</style>
