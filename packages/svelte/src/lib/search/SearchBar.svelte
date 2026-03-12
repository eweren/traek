<script lang="ts">
	import { onMount } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import { getTraekI18n } from '../i18n/index';
	import type { SearchFilters } from './searchUtils';

	const t = getTraekI18n();

	let {
		onClose,
		onSearch,
		onNext,
		onPrevious,
		currentIndex = 0,
		totalMatches = 0
	}: {
		onClose: () => void;
		onSearch: (query: string, filters: SearchFilters) => void;
		onNext: () => void;
		onPrevious: () => void;
		currentIndex?: number;
		totalMatches?: number;
	} = $props();

	let query = $state('');
	let inputRef: HTMLInputElement | null = $state(null);
	let showFilters = $state(false);

	type Role = 'user' | 'assistant' | 'system';
	let selectedRoles = new SvelteSet<Role>();

	onMount(() => {
		inputRef?.focus();
	});

	function buildFilters(): SearchFilters {
		const roles = [...selectedRoles] as Array<'user' | 'assistant' | 'system'>;
		return roles.length > 0 ? { roles } : {};
	}

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		query = target.value;
		onSearch(query, buildFilters());
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			onClose();
		} else if (e.key === 'Enter') {
			if (e.shiftKey) {
				onPrevious();
			} else {
				onNext();
			}
		}
	}

	function toggleRole(role: Role) {
		if (selectedRoles.has(role)) {
			selectedRoles.delete(role);
		} else {
			selectedRoles.add(role);
		}
		onSearch(query, buildFilters());
	}

	const hasActiveFilters = $derived(selectedRoles.size > 0);
</script>

<div class="search-bar">
	<div class="search-bar-content">
		<svg class="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
			<circle
				cx="7"
				cy="7"
				r="5.5"
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linecap="round"
			/>
			<line
				x1="11"
				y1="11"
				x2="14"
				y2="14"
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linecap="round"
			/>
		</svg>

		<input
			bind:this={inputRef}
			type="text"
			class="search-input"
			placeholder={t.search.placeholder}
			aria-label={t.search.placeholder}
			value={query}
			oninput={handleInput}
			onkeydown={handleKeydown}
		/>

		{#if totalMatches > 0}
			<div class="match-counter">
				{currentIndex + 1}/{totalMatches}
			</div>
		{:else if query.trim() !== ''}
			<div class="match-counter no-matches">{t.search.noMatches}</div>
		{/if}

		<div class="search-controls">
			<button
				class="filter-toggle {hasActiveFilters ? 'active' : ''}"
				onclick={() => (showFilters = !showFilters)}
				title="Filter by role"
				aria-label="Filter by role"
				aria-expanded={showFilters}
			>
				<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
					<path
						d="M1 3h12M3 7h8M5 11h4"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
					/>
				</svg>
			</button>

			<button
				class="nav-button"
				onclick={onPrevious}
				disabled={totalMatches === 0}
				title={t.search.previousMatch}
				aria-label={t.search.previousMatch}
			>
				<svg width="12" height="12" viewBox="0 0 12 12" fill="none">
					<path
						d="M7 9L4 6L7 3"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</button>

			<button
				class="nav-button"
				onclick={onNext}
				disabled={totalMatches === 0}
				title={t.search.nextMatch}
				aria-label={t.search.nextMatch}
			>
				<svg width="12" height="12" viewBox="0 0 12 12" fill="none">
					<path
						d="M5 3L8 6L5 9"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</button>

			<button
				class="close-button"
				onclick={onClose}
				title={t.search.closeSearch}
				aria-label={t.search.closeSearch}
			>
				<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
					<path
						d="M3 3L11 11M11 3L3 11"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
					/>
				</svg>
			</button>
		</div>
	</div>

	{#if showFilters}
		<div class="filter-panel">
			<span class="filter-label">Role</span>
			<div class="filter-chips">
				{#each ['user', 'assistant', 'system'] as const as role (role)}
					<button
						class="chip {selectedRoles.has(role) ? 'selected' : ''} role-{role}"
						onclick={() => toggleRole(role)}
						aria-pressed={selectedRoles.has(role)}
					>
						{role}
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.search-bar {
		position: fixed;
		top: 20px;
		left: 50%;
		transform: translateX(-50%);
		z-index: 200;
		min-width: 400px;
		max-width: 500px;
	}

	.search-bar-content {
		display: flex;
		align-items: center;
		gap: 8px;
		background: var(--traek-input-bg, rgba(30, 30, 30, 0.95));
		border: 1px solid var(--traek-input-border, #444444);
		border-radius: 8px;
		padding: 10px 14px;
		box-shadow: 0 4px 24px var(--traek-input-shadow, rgba(0, 0, 0, 0.4));
		backdrop-filter: blur(12px);
	}

	.search-icon {
		flex-shrink: 0;
		color: var(--traek-input-context-text, #888888);
	}

	.search-input {
		flex: 1;
		background: transparent;
		border: none;
		outline: none;
		color: var(--traek-input-text, #ffffff);
		font-family: inherit;
		font-size: 14px;
		padding: 0;
	}

	.search-input::placeholder {
		color: var(--traek-input-context-text, #888888);
	}

	.match-counter {
		flex-shrink: 0;
		font-size: 12px;
		color: var(--traek-input-context-text, #888888);
		font-family: monospace;
		padding: 2px 8px;
		background: var(--traek-input-context-bg, rgba(0, 0, 0, 0.4));
		border-radius: 4px;
	}

	.match-counter.no-matches {
		color: var(--traek-error-text, #cc0000);
		background: transparent;
	}

	.search-controls {
		display: flex;
		align-items: center;
		gap: 4px;
		flex-shrink: 0;
	}

	.nav-button,
	.close-button,
	.filter-toggle {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		background: transparent;
		border: none;
		border-radius: 4px;
		color: var(--traek-input-context-text, #888888);
		cursor: pointer;
		transition: all 0.15s ease;
		padding: 0;
	}

	.nav-button:hover:not(:disabled),
	.close-button:hover,
	.filter-toggle:hover {
		background: var(--traek-input-context-bg, rgba(0, 0, 0, 0.4));
		color: var(--traek-input-text, #ffffff);
	}

	.filter-toggle.active {
		color: var(--traek-node-active-border, #00d8ff);
	}

	.nav-button:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}

	.nav-button:focus-visible,
	.close-button:focus-visible,
	.filter-toggle:focus-visible {
		outline: 2px solid var(--traek-node-active-border, #00d8ff);
		outline-offset: 2px;
	}

	.filter-panel {
		display: flex;
		align-items: center;
		gap: 10px;
		background: var(--traek-input-bg, rgba(30, 30, 30, 0.95));
		border: 1px solid var(--traek-input-border, #444444);
		border-top: none;
		border-radius: 0 0 8px 8px;
		padding: 8px 14px;
		backdrop-filter: blur(12px);
	}

	.filter-label {
		font-size: 11px;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		color: var(--traek-input-context-text, #888888);
		flex-shrink: 0;
	}

	.filter-chips {
		display: flex;
		gap: 6px;
		flex-wrap: wrap;
	}

	.chip {
		font-size: 11px;
		padding: 3px 10px;
		border-radius: 999px;
		border: 1px solid var(--traek-input-border, #444444);
		background: transparent;
		color: var(--traek-input-context-text, #888888);
		cursor: pointer;
		font-family: inherit;
		transition: all 0.15s ease;
		text-transform: capitalize;
	}

	.chip:hover {
		border-color: var(--traek-input-text, #ffffff);
		color: var(--traek-input-text, #ffffff);
	}

	.chip.selected {
		background: var(--traek-node-active-border, #00d8ff);
		border-color: var(--traek-node-active-border, #00d8ff);
		color: #000000;
	}

	.chip.role-user.selected {
		background: #3b82f6;
		border-color: #3b82f6;
		color: #ffffff;
	}

	.chip.role-assistant.selected {
		background: #10b981;
		border-color: #10b981;
		color: #ffffff;
	}

	.chip.role-system.selected {
		background: #8b5cf6;
		border-color: #8b5cf6;
		color: #ffffff;
	}

	.chip:focus-visible {
		outline: 2px solid var(--traek-node-active-border, #00d8ff);
		outline-offset: 2px;
	}

	@media (max-width: 768px) {
		.search-bar {
			min-width: 0;
			max-width: calc(100vw - 40px);
			width: calc(100vw - 40px);
		}
	}
</style>
