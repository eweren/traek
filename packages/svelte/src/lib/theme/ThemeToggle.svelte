<script lang="ts">
	import { onMount } from 'svelte';
	import { applyThemeToRootAnimated } from './ThemeProvider.svelte';
	import { themes } from './themes';
	import type { TraekEngine } from '../TraekEngine.svelte';

	const STORAGE_KEY_THEME = 'traek-theme-mode';

	let { engine = undefined, compact = false }: { engine?: TraekEngine; compact?: boolean } =
		$props();

	type ThemeMode = 'dark' | 'light' | 'system';

	let mode = $state<ThemeMode>('system');
	let mediaQuery: MediaQueryList | undefined;

	function getSystemResolved(): 'dark' | 'light' {
		if (typeof window === 'undefined') return 'dark';
		return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
	}

	function applyResolved(r: 'dark' | 'light') {
		applyThemeToRootAnimated(themes[r], r);
	}

	function applyMode(m: ThemeMode) {
		mode = m;
		if (engine) engine.setThemeMode(m);
		if (typeof localStorage !== 'undefined') localStorage.setItem(STORAGE_KEY_THEME, m);
		applyResolved(m === 'system' ? getSystemResolved() : m);
	}

	function cycle() {
		const order: ThemeMode[] = ['system', 'dark', 'light'];
		const next = order[(order.indexOf(mode) + 1) % order.length];
		applyMode(next);
	}

	onMount(() => {
		const saved =
			typeof localStorage !== 'undefined'
				? (localStorage.getItem(STORAGE_KEY_THEME) as ThemeMode | null)
				: null;
		const initial: ThemeMode = saved ?? 'system';

		if (engine && engine.themeMode !== initial) {
			engine.setThemeMode(initial);
		}

		applyResolved(initial === 'system' ? getSystemResolved() : initial);
		mode = initial;

		if (typeof window !== 'undefined') {
			mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
			const onChange = () => {
				if (mode === 'system') applyResolved(getSystemResolved());
			};
			mediaQuery.addEventListener('change', onChange);
			return () => mediaQuery?.removeEventListener('change', onChange);
		}
	});

	$effect(() => {
		if (engine && engine.themeMode !== mode) {
			applyMode(engine.themeMode);
		}
	});

	const labels: Record<ThemeMode, string> = {
		system: 'System',
		dark: 'Dark',
		light: 'Light'
	};
</script>

<button
	type="button"
	class="theme-toggle"
	class:compact
	onclick={cycle}
	aria-label="Theme: {labels[mode]}"
	title="Theme: {labels[mode]}"
	data-mode={mode}
>
	<span class="icon">
		{#if mode === 'system'}
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
				<rect
					x="1.5"
					y="3.5"
					width="13"
					height="9"
					rx="1.5"
					stroke="currentColor"
					stroke-width="1.4"
				/>
				<path
					d="M5.5 12.5v1.5M10.5 12.5v1.5M3.5 14h9"
					stroke="currentColor"
					stroke-width="1.4"
					stroke-linecap="round"
				/>
			</svg>
		{:else if mode === 'dark'}
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
				<path
					d="M13.5 9.5A6 6 0 0 1 6.5 2.5a5.5 5.5 0 1 0 7 7z"
					stroke="currentColor"
					stroke-width="1.4"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		{:else}
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
				<circle cx="8" cy="8" r="3" stroke="currentColor" stroke-width="1.4" />
				<path
					d="M8 1v2M8 13v2M1 8h2M13 8h2M3.2 3.2l1.4 1.4M11.4 11.4l1.4 1.4M3.2 12.8l1.4-1.4M11.4 4.6l1.4-1.4"
					stroke="currentColor"
					stroke-width="1.4"
					stroke-linecap="round"
				/>
			</svg>
		{/if}
	</span>
	{#if !compact}
		<span class="label">{labels[mode]}</span>
	{/if}
</button>

<style>
	.theme-toggle {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 7px 11px;
		background: var(--traek-thought-toggle-bg, #27272a);
		border: 1px solid var(--traek-thought-toggle-border, #3f3f46);
		border-radius: var(--traek-radius-sm, 6px);
		color: var(--traek-node-text, #e4e4e7);
		font-family: var(--traek-font-family, system-ui, sans-serif);
		font-size: var(--traek-text-sm, 12px);
		font-weight: 500;
		cursor: pointer;
		transition:
			background var(--traek-duration-fast, 120ms) ease,
			border-color var(--traek-duration-fast, 120ms) ease,
			color var(--traek-duration-fast, 120ms) ease;
		user-select: none;
	}

	.theme-toggle:hover {
		background: var(--traek-thought-toggle-border, #3f3f46);
		border-color: var(--traek-thought-header-accent, #52525b);
	}

	.theme-toggle:focus-visible {
		outline: 2px solid var(--traek-node-active-border, #00d8ff);
		outline-offset: 2px;
	}

	.theme-toggle:active {
		transform: scale(0.97);
	}

	.theme-toggle.compact {
		padding: 7px;
	}

	.icon {
		display: flex;
		align-items: center;
		flex-shrink: 0;
		width: 16px;
		height: 16px;
	}

	.label {
		letter-spacing: 0.01em;
	}

	.theme-toggle[data-mode='light'] {
		color: var(--traek-input-button-bg, #007aad);
		border-color: color-mix(in srgb, var(--traek-input-button-bg, #007aad) 30%, transparent);
	}

	.theme-toggle[data-mode='dark'] {
		color: var(--traek-node-active-border, #00d8ff);
		border-color: color-mix(in srgb, var(--traek-node-active-border, #00d8ff) 25%, transparent);
	}
</style>
