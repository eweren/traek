<script lang="ts">
	let { label }: { label?: string } = $props();
</script>

<div class="bookmark-badge" title={label ?? 'Bookmarked'} aria-label="Bookmarked node">
	<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
		<path
			d="M5 3h14a1 1 0 011 1v17.17a1 1 0 01-1.707.707L12 15.586l-6.293 6.291A1 1 0 014 21.17V4a1 1 0 011-1z"
		/>
	</svg>
</div>

<style>
	.bookmark-badge {
		position: absolute;
		top: -4px;
		right: 8px;
		color: var(--traek-color-yellow, #eab308);
		z-index: 10;
		filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5));
		pointer-events: none;
	}
</style>
