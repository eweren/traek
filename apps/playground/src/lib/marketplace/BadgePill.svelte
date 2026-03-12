<script lang="ts">
	export type BadgeTier = 'contributor' | 'creator' | 'pro_creator' | 'verified_partner';

	let {
		tier,
		size = 'sm'
	}: {
		tier: BadgeTier;
		size?: 'sm' | 'md';
	} = $props();

	const config: Record<BadgeTier, { label: string; icon: string }> = {
		contributor: { label: 'Contributor', icon: '🌱' },
		creator: { label: 'Creator', icon: '⭐' },
		pro_creator: { label: 'Pro Creator', icon: '🏆' },
		verified_partner: { label: 'Verified Partner', icon: '💎' }
	};

	const { label, icon } = config[tier];
</script>

<span class="badge badge--{tier} badge--{size}" aria-label="{label} badge">
	<span class="badge__icon" aria-hidden="true">{icon}</span>
	<span class="badge__label">{label}</span>
</span>

<style>
	.badge {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		border-radius: 20px;
		font-family: 'Space Grotesk', sans-serif;
		font-weight: 500;
		white-space: nowrap;
	}

	.badge--sm {
		padding: 2px 8px;
		font-size: 11px;
	}

	.badge--md {
		padding: 4px 12px;
		font-size: 13px;
	}

	.badge__icon {
		font-size: 0.9em;
	}

	/* Contributor — lime */
	.badge--contributor {
		background: rgba(0, 255, 163, 0.08);
		border: 1px solid rgba(0, 255, 163, 0.25);
		color: #00ffa3;
	}

	/* Creator — cyan */
	.badge--creator {
		background: rgba(0, 216, 255, 0.08);
		border: 1px solid rgba(0, 216, 255, 0.25);
		color: #00d8ff;
	}

	/* Pro Creator — gold */
	.badge--pro_creator {
		background: linear-gradient(135deg, rgba(0, 216, 255, 0.08), rgba(0, 255, 163, 0.08));
		border: 1px solid rgba(255, 215, 0, 0.4);
		color: #ffd700;
	}

	/* Verified Partner — animated gradient border */
	.badge--verified_partner {
		position: relative;
		background: #161616;
		color: #ffd700;
		border: none;
		isolation: isolate;
	}

	.badge--verified_partner::before {
		content: '';
		position: absolute;
		inset: -1px;
		border-radius: inherit;
		background: conic-gradient(from 0deg, #00d8ff, #00ffa3, #ffd700, #00d8ff);
		z-index: -1;
		animation: spin-border 4s linear infinite;
	}

	@keyframes spin-border {
		to {
			transform: rotate(360deg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.badge--verified_partner::before {
			animation: none;
		}
	}
</style>
