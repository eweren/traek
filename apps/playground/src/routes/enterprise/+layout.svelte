<script lang="ts">
	let { children }: { children: import('svelte').Snippet } = $props();
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="ent-shell">
	<header class="ent-nav">
		<a href="/enterprise" class="ent-nav__logo" aria-label="Traek Enterprise home">
			<span class="ent-nav__logo-mark">træk</span>
			<span class="ent-nav__logo-sep">/</span>
			<span class="ent-nav__logo-tier">Enterprise</span>
		</a>

		<nav class="ent-nav__links" aria-label="Enterprise navigation">
			<a href="/enterprise#security" class="ent-nav__link">Security</a>
			<a href="/enterprise#roi" class="ent-nav__link">ROI Calculator</a>
			<a href="/enterprise#support" class="ent-nav__link">Support</a>
		</nav>

		<a href="mailto:enterprise@gettraek.com" class="ent-nav__cta">Talk to sales →</a>
	</header>

	<main>
		{@render children()}
	</main>

	<footer class="ent-footer">
		<div class="ent-footer__inner">
			<p class="ent-footer__copy">© 2026 Traek, Inc. All rights reserved.</p>
			<div class="ent-footer__links">
				<a href="/privacy" class="ent-footer__link">Privacy</a>
				<a href="/terms" class="ent-footer__link">Terms</a>
				<a href="/security" class="ent-footer__link">Security</a>
			</div>
		</div>
	</footer>
</div>

<style>
	:global(body) {
		background: #050505;
	}

	.ent-shell {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background: #050505;
		color: var(--pg-text, #f0f0f0);
		font-family: 'Space Grotesk', sans-serif;
	}

	/* Nav */
	.ent-nav {
		position: sticky;
		top: 0;
		z-index: 100;
		display: flex;
		align-items: center;
		gap: 32px;
		padding: 0 max(5vw, 2rem);
		height: 64px;
		background: rgba(5, 5, 5, 0.92);
		backdrop-filter: blur(16px);
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
	}

	.ent-nav__logo {
		display: flex;
		align-items: center;
		gap: 6px;
		text-decoration: none;
		font-size: 15px;
		font-weight: 600;
		letter-spacing: -0.01em;
		flex-shrink: 0;
	}

	.ent-nav__logo-mark {
		color: var(--pg-text, #f0f0f0);
	}

	.ent-nav__logo-sep {
		color: rgba(255, 255, 255, 0.2);
		font-weight: 300;
	}

	.ent-nav__logo-tier {
		color: var(--pg-text-muted, #666);
		font-weight: 400;
		letter-spacing: 0.02em;
	}

	.ent-nav__links {
		display: flex;
		gap: 4px;
		flex: 1;
	}

	.ent-nav__link {
		padding: 6px 12px;
		border-radius: 6px;
		font-size: 13px;
		text-decoration: none;
		color: var(--pg-text-secondary, #a8a8a8);
		transition:
			color 0.15s,
			background 0.15s;
	}

	.ent-nav__link:hover {
		color: var(--pg-text, #f0f0f0);
		background: rgba(255, 255, 255, 0.06);
	}

	.ent-nav__cta {
		margin-left: auto;
		flex-shrink: 0;
		padding: 9px 20px;
		border-radius: 8px;
		font-size: 13px;
		font-weight: 600;
		text-decoration: none;
		background: var(--pg-text, #f0f0f0);
		color: #050505;
		letter-spacing: -0.01em;
		transition:
			opacity 0.15s,
			transform 0.15s;
	}

	.ent-nav__cta:hover {
		opacity: 0.9;
		transform: translateY(-1px);
	}

	/* Footer */
	.ent-footer {
		border-top: 1px solid rgba(255, 255, 255, 0.06);
		padding: 24px 0;
		margin-top: auto;
	}

	.ent-footer__inner {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 max(5vw, 2rem);
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
	}

	.ent-footer__copy {
		margin: 0;
		font-size: 12px;
		color: var(--pg-text-muted, #666);
	}

	.ent-footer__links {
		display: flex;
		gap: 20px;
	}

	.ent-footer__link {
		font-size: 12px;
		color: var(--pg-text-muted, #666);
		text-decoration: none;
		transition: color 0.15s;
	}

	.ent-footer__link:hover {
		color: var(--pg-text-secondary, #a8a8a8);
	}

	@media (max-width: 640px) {
		.ent-nav__links {
			display: none;
		}

		.ent-footer__inner {
			flex-direction: column;
			align-items: flex-start;
		}
	}
</style>
