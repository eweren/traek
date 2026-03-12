<script lang="ts">
	let {
		rating,
		count,
		interactive = false,
		onRate
	}: {
		rating: number;
		count?: number;
		interactive?: boolean;
		onRate?: (rating: number) => void;
	} = $props();

	let hovered = $state(0);

	function stars(): Array<{ filled: boolean; half: boolean }> {
		return Array.from({ length: 5 }, (_, i) => {
			const val = i + 1;
			return {
				filled: rating >= val,
				half: rating >= val - 0.5 && rating < val
			};
		});
	}
</script>

<span
	class="star-rating"
	role={interactive ? 'radiogroup' : undefined}
	aria-label="Rating: {rating.toFixed(1)} out of 5"
>
	{#each stars() as star, i (i)}
		{#if interactive}
			<button
				class="star"
				class:star--filled={hovered ? hovered >= i + 1 : star.filled}
				class:star--half={!hovered && star.half}
				aria-label="Rate {i + 1} star{i > 0 ? 's' : ''}"
				onmouseenter={() => (hovered = i + 1)}
				onmouseleave={() => (hovered = 0)}
				onclick={() => onRate?.(i + 1)}
			>
				★
			</button>
		{:else}
			<span
				class="star"
				class:star--filled={star.filled}
				class:star--half={star.half}
				aria-hidden="true"
			>
				★
			</span>
		{/if}
	{/each}
	{#if count !== undefined}
		<span class="count">({count.toLocaleString()})</span>
	{/if}
</span>

<style>
	.star-rating {
		display: inline-flex;
		align-items: center;
		gap: 1px;
	}

	.star {
		font-size: 14px;
		color: rgba(255, 255, 255, 0.2);
		line-height: 1;
		transition: color 0.1s;
	}

	button.star {
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
	}

	.star--filled {
		color: #ffd700;
	}

	.star--half {
		background: linear-gradient(90deg, #ffd700 50%, rgba(255, 255, 255, 0.2) 50%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.count {
		font-size: 12px;
		color: var(--pg-text-muted, #666);
		margin-left: 4px;
	}
</style>
