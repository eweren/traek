<script lang="ts">
	import { useTheme } from '@traek/svelte';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	const themeCtx = useTheme();
	const currentTheme = $derived(themeCtx.currentThemeName());
	const isOnDemo = $derived(page.url.pathname.startsWith('/demo'));

	function toggleTheme() {
		themeCtx.setTheme(currentTheme === 'dark' ? 'light' : 'dark');
	}
</script>

<header class="site-nav" class:demo-context={isOnDemo}>
	<a class="logo" href={resolve('/')}>træk</a>

	<nav class="nav-links" aria-label="Site navigation">
		<a href={resolve('/demo/explore')} class="nav-link">Demo</a>
		<a href="https://docs.gettraek.com" class="nav-link" rel="noreferrer" target="_blank">Docs</a>
		<a
			href="https://github.com/gettraek/traek"
			class="nav-link"
			rel="noreferrer"
			target="_blank"
			aria-label="GitHub repository"
		>
			<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
				<path
					d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"
				/>
			</svg>
		</a>
	</nav>

	<button
		class="theme-btn"
		onclick={toggleTheme}
		aria-label="Toggle {currentTheme === 'dark' ? 'light' : 'dark'} mode"
	>
		{#if currentTheme === 'dark'}
			<svg
				width="15"
				height="15"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<circle cx="12" cy="12" r="5" />
				<line x1="12" y1="1" x2="12" y2="3" />
				<line x1="12" y1="21" x2="12" y2="23" />
				<line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
				<line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
				<line x1="1" y1="12" x2="3" y2="12" />
				<line x1="21" y1="12" x2="23" y2="12" />
				<line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
				<line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
			</svg>
		{:else}
			<svg
				width="15"
				height="15"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
			</svg>
		{/if}
	</button>
</header>

<style>
	.site-nav {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 200;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0 max(5vw, 2rem);
		height: 52px;
		background: rgba(11, 11, 11, 0.82);
		backdrop-filter: blur(14px);
		-webkit-backdrop-filter: blur(14px);
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
		box-sizing: border-box;
	}

	:global([data-theme='light']) .site-nav {
		background: rgba(250, 250, 250, 0.88);
		border-bottom-color: rgba(0, 0, 0, 0.08);
	}

	.logo {
		font-size: 1.05rem;
		font-weight: 700;
		letter-spacing: -0.04em;
		color: var(--traek-landing-text-main, #f5f5f5);
		text-decoration: none;
		margin-right: auto;
		transition: color 0.15s;
	}

	.logo:hover {
		color: var(--traek-accent-cyan, #00d8ff);
	}

	.nav-links {
		display: flex;
		align-items: center;
		gap: 0.1rem;
	}

	.nav-link {
		display: inline-flex;
		align-items: center;
		padding: 0.4rem 0.65rem;
		font-size: 0.85rem;
		color: var(--traek-landing-text-muted-2, #a5a5a5);
		text-decoration: none;
		border-radius: 7px;
		transition:
			color 0.15s,
			background 0.15s;
	}

	.nav-link:hover {
		color: var(--traek-landing-text-main, #f5f5f5);
		background: rgba(255, 255, 255, 0.06);
	}

	:global([data-theme='light']) .nav-link:hover {
		background: rgba(0, 0, 0, 0.06);
	}

	.theme-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 30px;
		height: 30px;
		margin-left: 0.25rem;
		border-radius: 7px;
		border: 1px solid rgba(255, 255, 255, 0.1);
		background: transparent;
		color: var(--traek-landing-text-muted-2, #a5a5a5);
		cursor: pointer;
		transition:
			background 0.15s,
			color 0.15s,
			border-color 0.15s;
	}

	:global([data-theme='light']) .theme-btn {
		border-color: rgba(0, 0, 0, 0.1);
	}

	.theme-btn:hover {
		background: rgba(255, 255, 255, 0.08);
		color: var(--traek-landing-text-main, #f5f5f5);
		border-color: rgba(255, 255, 255, 0.18);
	}

	:global([data-theme='light']) .theme-btn:hover {
		background: rgba(0, 0, 0, 0.06);
	}

	.theme-btn:focus-visible {
		outline: 2px solid var(--traek-accent-cyan, #00d8ff);
		outline-offset: 2px;
	}

	@media (max-width: 480px) {
		.site-nav {
			padding: 0 1.25rem;
		}
	}
</style>
