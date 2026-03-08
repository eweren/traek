<script lang="ts">
	import { page } from '$app/stores';

	let { children }: { children: import('svelte').Snippet } = $props();

	const navLinks = [
		{ href: '/marketplace', label: 'Browse' },
		{ href: '/marketplace/submit', label: 'Submit' },
		{ href: '/marketplace/dashboard', label: 'Dashboard' },
		{ href: '/marketplace/developers', label: 'For Developers' }
	];

	function isActive(href: string): boolean {
		if (href === '/marketplace') return $page.url.pathname === '/marketplace';
		return $page.url.pathname.startsWith(href);
	}
</script>

<div class="shell">
	<header class="header">
		<a href="/marketplace" class="logo" aria-label="Traek Marketplace home">
			<span class="logo__word">træk</span>
			<span class="logo__sep">/</span>
			<span class="logo__word logo__word--muted">marketplace</span>
		</a>

		<nav class="nav" aria-label="Marketplace navigation">
			{#each navLinks as link (link.href)}
				<a
					href={link.href}
					class="nav__link"
					class:nav__link--active={isActive(link.href)}
					aria-current={isActive(link.href) ? 'page' : undefined}
				>
					{link.label}
				</a>
			{/each}
		</nav>

		<div class="header__actions">
			<a href="/app" class="btn btn--ghost">Open App</a>
		</div>
	</header>

	<main class="main">
		{@render children()}
	</main>
</div>

<style>
	.shell {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background: var(--pg-bg, #080808);
		color: var(--pg-text, #f0f0f0);
		font-family: 'Space Grotesk', sans-serif;
	}

	/* Header */
	.header {
		position: sticky;
		top: 0;
		z-index: 100;
		display: flex;
		align-items: center;
		gap: 24px;
		padding: 0 max(5vw, 1.5rem);
		height: 60px;
		background: rgba(8, 8, 8, 0.9);
		backdrop-filter: blur(12px);
		border-bottom: 1px solid var(--pg-border, rgba(255, 255, 255, 0.08));
	}

	.logo {
		display: flex;
		align-items: center;
		gap: 4px;
		text-decoration: none;
		font-size: 16px;
		font-weight: 600;
		flex-shrink: 0;
	}

	.logo__word {
		color: var(--pg-text, #f0f0f0);
	}

	.logo__word--muted {
		color: var(--pg-text-muted, #666);
	}

	.logo__sep {
		color: var(--pg-border-strong, rgba(255, 255, 255, 0.2));
	}

	.nav {
		display: flex;
		gap: 4px;
		flex: 1;
	}

	.nav__link {
		padding: 6px 12px;
		border-radius: 8px;
		font-size: 14px;
		text-decoration: none;
		color: var(--pg-text-secondary, #a8a8a8);
		transition:
			color 0.15s,
			background 0.15s;
	}

	.nav__link:hover {
		color: var(--pg-text, #f0f0f0);
		background: rgba(255, 255, 255, 0.06);
	}

	.nav__link--active {
		color: var(--pg-cyan, #00d8ff);
		background: rgba(0, 216, 255, 0.08);
	}

	.header__actions {
		margin-left: auto;
		flex-shrink: 0;
	}

	.btn {
		padding: 8px 16px;
		border-radius: 8px;
		font-size: 14px;
		font-weight: 500;
		text-decoration: none;
		cursor: pointer;
		transition: all 0.15s;
	}

	.btn--ghost {
		border: 1px solid var(--pg-border-strong, rgba(255, 255, 255, 0.14));
		color: var(--pg-text, #f0f0f0);
		background: transparent;
	}

	.btn--ghost:hover {
		border-color: var(--pg-border-cyan, rgba(0, 216, 255, 0.28));
		color: var(--pg-cyan, #00d8ff);
	}

	.main {
		flex: 1;
	}
</style>
