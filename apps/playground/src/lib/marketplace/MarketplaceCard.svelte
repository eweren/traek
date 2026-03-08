<script lang="ts">
	import StarRating from './StarRating.svelte';
	import BadgePill from './BadgePill.svelte';
	import type { BadgeTier } from './BadgePill.svelte';

	export type ItemType = 'theme' | 'component' | 'template';

	let {
		slug,
		type,
		name,
		publisherHandle,
		publisherBadge,
		publisherAvatarUrl,
		previewImageUrl,
		rating,
		reviewCount,
		installCount,
		priceMonthly
	}: {
		slug: string;
		type: ItemType;
		name: string;
		publisherHandle: string;
		publisherBadge?: BadgeTier;
		publisherAvatarUrl?: string;
		previewImageUrl?: string;
		rating: number;
		reviewCount: number;
		installCount: number;
		priceMonthly: number;
	} = $props();

	const typeLabel: Record<ItemType, string> = {
		theme: 'Theme',
		component: 'Component',
		template: 'Template'
	};

	function formatInstalls(n: number): string {
		if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
		return n.toString();
	}

	const href = `/marketplace/${type}s/${slug}`;
</script>

<a class="card" {href} aria-label="{name} by {publisherHandle}">
	<!-- Preview thumbnail -->
	<div class="card__preview">
		{#if previewImageUrl}
			<img src={previewImageUrl} alt="{name} preview" class="card__img" />
		{:else}
			<div class="card__placeholder">
				<span class="card__placeholder-icon" aria-hidden="true">
					{type === 'theme' ? '🎨' : type === 'component' ? '🧩' : '📋'}
				</span>
			</div>
		{/if}

		<!-- Type chip overlay -->
		<span class="card__type-chip">{typeLabel[type]}</span>

		<!-- Verified badge overlay (Pro Creator or Verified Partner) -->
		{#if publisherBadge === 'pro_creator' || publisherBadge === 'verified_partner'}
			<span class="card__verified" aria-label="Verified publisher" title="Verified publisher"
				>✓</span
			>
		{/if}
	</div>

	<!-- Card body -->
	<div class="card__body">
		<h3 class="card__name">{name}</h3>

		<div class="card__publisher">
			{#if publisherAvatarUrl}
				<img src={publisherAvatarUrl} alt="" class="card__avatar" aria-hidden="true" />
			{:else}
				<div class="card__avatar card__avatar--fallback" aria-hidden="true">
					{publisherHandle[0]?.toUpperCase()}
				</div>
			{/if}
			<span class="card__handle">@{publisherHandle}</span>
			{#if publisherBadge}
				<BadgePill tier={publisherBadge} size="sm" />
			{/if}
		</div>

		<StarRating {rating} count={reviewCount} />

		<div class="card__footer">
			<span class="card__installs" aria-label="{installCount} installs">
				↓ {formatInstalls(installCount)}
			</span>
			<span class="card__price" class:card__price--free={priceMonthly === 0}>
				{priceMonthly === 0 ? 'Free' : `$${priceMonthly}/mo`}
			</span>
		</div>
	</div>
</a>

<style>
	.card {
		display: flex;
		flex-direction: column;
		background: var(--pg-bg-card, #161616);
		border: 1px solid var(--pg-border, rgba(255, 255, 255, 0.08));
		border-radius: 12px;
		overflow: hidden;
		text-decoration: none;
		color: inherit;
		transition:
			transform 0.15s ease,
			border-color 0.15s ease,
			box-shadow 0.15s ease;
		cursor: pointer;
	}

	.card:hover {
		transform: translateY(-2px);
		border-color: var(--pg-border-cyan, rgba(0, 216, 255, 0.28));
		box-shadow: 0 8px 32px rgba(0, 216, 255, 0.08);
	}

	.card:focus-visible {
		outline: 2px solid var(--pg-cyan, #00d8ff);
		outline-offset: 2px;
	}

	/* Preview */
	.card__preview {
		position: relative;
		aspect-ratio: 16 / 9;
		background: var(--pg-bg-surface, #111);
		overflow: hidden;
	}

	.card__img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.card__placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, #111 0%, #1a1a1a 100%);
	}

	.card__placeholder-icon {
		font-size: 2rem;
		opacity: 0.4;
	}

	.card__type-chip {
		position: absolute;
		top: 8px;
		left: 8px;
		padding: 3px 8px;
		border-radius: 6px;
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		background: linear-gradient(135deg, #00d8ff, #00ffa3);
		color: #080808;
	}

	.card__verified {
		position: absolute;
		top: 8px;
		right: 8px;
		width: 22px;
		height: 22px;
		border-radius: 50%;
		background: #ffd700;
		color: #080808;
		font-size: 12px;
		font-weight: 700;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* Body */
	.card__body {
		padding: 14px 16px 16px;
		display: flex;
		flex-direction: column;
		gap: 8px;
		flex: 1;
	}

	.card__name {
		margin: 0;
		font-size: 15px;
		font-weight: 600;
		color: var(--pg-text, #f0f0f0);
		line-height: 1.3;
	}

	.card__publisher {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.card__avatar {
		width: 18px;
		height: 18px;
		border-radius: 50%;
		object-fit: cover;
	}

	.card__avatar--fallback {
		background: var(--pg-bg-card-hover, #1c1c1c);
		border: 1px solid var(--pg-border-strong, rgba(255, 255, 255, 0.14));
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 10px;
		font-weight: 600;
		color: var(--pg-text-muted, #666);
	}

	.card__handle {
		font-size: 12px;
		color: var(--pg-text-muted, #666);
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	/* Footer */
	.card__footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: auto;
	}

	.card__installs {
		font-size: 12px;
		color: var(--pg-text-muted, #666);
	}

	.card__price {
		font-size: 13px;
		font-weight: 600;
		color: var(--pg-text, #f0f0f0);
	}

	.card__price--free {
		color: var(--pg-lime, #00ffa3);
	}
</style>
