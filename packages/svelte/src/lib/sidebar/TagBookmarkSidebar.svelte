<script lang="ts">
	import type { TraekEngine, MessageNode } from '../TraekEngine.svelte';
	import { listBuiltinTags } from '../tags/tagUtils';
	import { SvelteMap } from 'svelte/reactivity';

	let {
		engine,
		open = $bindable(false),
		onNavigate
	}: {
		engine: TraekEngine;
		open?: boolean;
		onNavigate?: (nodeId: string) => void;
	} = $props();

	type Tab = 'tags' | 'bookmarks';
	let activeTab = $state<Tab>('tags');
	let searchQuery = $state('');

	const allTags = $derived([
		...listBuiltinTags(),
		...Array.from(engine.customTags.values()).map((t) => ({
			slug: t.slug,
			label: t.label,
			color: t.color,
			bgColor: `${t.color}26`,
			isCustom: true
		}))
	]);

	const tagCounts = $derived.by(() => {
		const counts = new SvelteMap<string, number>();
		for (const node of engine.nodes) {
			const tags = (node.metadata?.tags as string[]) ?? [];
			for (const tag of tags) {
				counts.set(tag, (counts.get(tag) ?? 0) + 1);
			}
		}
		return counts;
	});

	const filteredTags = $derived(
		allTags.filter((t) => {
			const count = tagCounts.get(t.slug) ?? 0;
			if (count === 0) return false;
			if (!searchQuery.trim()) return true;
			return t.label.toLowerCase().includes(searchQuery.toLowerCase());
		})
	);

	const bookmarks = $derived(engine.getBookmarks());
	const filteredBookmarks = $derived(
		bookmarks.filter((b) => {
			if (!searchQuery.trim()) return true;
			const content = ((b.node as MessageNode).content ?? '').toLowerCase();
			const label = (b.label ?? '').toLowerCase();
			return (
				content.includes(searchQuery.toLowerCase()) || label.includes(searchQuery.toLowerCase())
			);
		})
	);

	let activeTagFilters = $state<string[]>([]);

	function toggleTagFilter(slug: string) {
		if (activeTagFilters.includes(slug)) {
			activeTagFilters = activeTagFilters.filter((t) => t !== slug);
		} else {
			activeTagFilters = [...activeTagFilters, slug];
		}
		engine.searchFilters = {
			...engine.searchFilters,
			tags: activeTagFilters.length > 0 ? activeTagFilters : undefined
		};
	}

	function close() {
		open = false;
	}
</script>

{#if open}
	<aside class="sidebar" aria-label="Tags and Bookmarks">
		<div class="sidebar__header">
			<div class="sidebar__tabs" role="tablist">
				<button
					role="tab"
					aria-selected={activeTab === 'tags'}
					class="sidebar__tab"
					class:active={activeTab === 'tags'}
					onclick={() => {
						activeTab = 'tags';
						searchQuery = '';
					}}
				>
					Tags
				</button>
				<button
					role="tab"
					aria-selected={activeTab === 'bookmarks'}
					class="sidebar__tab"
					class:active={activeTab === 'bookmarks'}
					onclick={() => {
						activeTab = 'bookmarks';
						searchQuery = '';
					}}
				>
					Bookmarks
					{#if bookmarks.length > 0}
						<span class="sidebar__count">{bookmarks.length}</span>
					{/if}
				</button>
			</div>
			<button class="sidebar__close" onclick={close} aria-label="Close sidebar">×</button>
		</div>

		<div class="sidebar__search">
			<input
				type="search"
				bind:value={searchQuery}
				placeholder={activeTab === 'tags' ? 'Filter tags…' : 'Search bookmarks…'}
				class="sidebar__search-input"
				aria-label="Search"
			/>
		</div>

		<div class="sidebar__body" role="tabpanel">
			{#if activeTab === 'tags'}
				{#if filteredTags.length === 0}
					<p class="sidebar__empty">No tags yet. Add tags to nodes to see them here.</p>
				{:else}
					<ul class="sidebar__list" aria-label="Tag filters">
						{#each filteredTags as tag (tag.slug)}
							<li role="none">
								<button
									class="sidebar__tag-item"
									class:active-filter={activeTagFilters.includes(tag.slug)}
									onclick={() => toggleTagFilter(tag.slug)}
									aria-pressed={activeTagFilters.includes(tag.slug)}
								>
									<span class="sidebar__tag-dot" style="background: {tag.color}"></span>
									<span class="sidebar__tag-label">{tag.label}</span>
									<span class="sidebar__tag-count">{tagCounts.get(tag.slug) ?? 0}</span>
								</button>
							</li>
						{/each}
					</ul>
				{/if}
			{:else if filteredBookmarks.length === 0}
				<p class="sidebar__empty">No bookmarks yet. Click the bookmark icon on any node.</p>
			{:else}
				<ul class="sidebar__list" aria-label="Bookmarks">
					{#each filteredBookmarks as bm (bm.node.id)}
						<li role="none">
							<button class="sidebar__bookmark-item" onclick={() => onNavigate?.(bm.node.id)}>
								<span class="sidebar__bookmark-icon" aria-hidden="true">★</span>
								<span class="sidebar__bookmark-text">
									{#if bm.label}
										<strong class="sidebar__bookmark-label">{bm.label}</strong>
									{/if}
									<span class="sidebar__bookmark-preview">
										{((bm.node as MessageNode).content ?? '').substring(0, 60)}…
									</span>
								</span>
							</button>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</aside>
{/if}

<style>
	.sidebar {
		position: fixed;
		top: 0;
		right: 0;
		height: 100%;
		width: 280px;
		background: var(--traek-sidebar-bg, #1a1a2e);
		border-left: 1px solid var(--traek-sidebar-border, rgba(255, 255, 255, 0.08));
		z-index: 100;
		display: flex;
		flex-direction: column;
		font-size: 13px;
		color: var(--traek-node-text, rgba(255, 255, 255, 0.85));
	}

	.sidebar__header {
		display: flex;
		align-items: stretch;
		border-bottom: 1px solid rgba(255, 255, 255, 0.08);
	}

	.sidebar__tabs {
		display: flex;
		flex: 1;
	}

	.sidebar__tab {
		flex: 1;
		padding: 12px 8px;
		background: none;
		border: none;
		border-bottom: 2px solid transparent;
		color: rgba(255, 255, 255, 0.5);
		cursor: pointer;
		font-size: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
	}

	.sidebar__tab.active {
		color: white;
		border-bottom-color: white;
	}

	.sidebar__count {
		background: rgba(255, 255, 255, 0.15);
		border-radius: 10px;
		padding: 1px 6px;
		font-size: 10px;
	}

	.sidebar__close {
		padding: 8px 12px;
		background: none;
		border: none;
		color: rgba(255, 255, 255, 0.4);
		cursor: pointer;
		font-size: 18px;
		display: flex;
		align-items: center;
	}

	.sidebar__close:hover {
		color: white;
	}

	.sidebar__search {
		padding: 8px;
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
	}

	.sidebar__search-input {
		width: 100%;
		background: rgba(255, 255, 255, 0.06);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 6px;
		color: inherit;
		padding: 6px 10px;
		font-size: 12px;
		outline: none;
		box-sizing: border-box;
	}

	.sidebar__search-input:focus {
		border-color: rgba(255, 255, 255, 0.25);
	}

	.sidebar__body {
		flex: 1;
		overflow-y: auto;
		padding: 4px 0;
	}

	.sidebar__list {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.sidebar__tag-item,
	.sidebar__bookmark-item {
		display: flex;
		align-items: center;
		gap: 8px;
		width: 100%;
		padding: 8px 12px;
		background: none;
		border: none;
		color: inherit;
		cursor: pointer;
		text-align: left;
		transition: background 0.1s;
	}

	.sidebar__tag-item:hover,
	.sidebar__bookmark-item:hover {
		background: rgba(255, 255, 255, 0.06);
	}

	.sidebar__tag-item.active-filter {
		background: rgba(255, 255, 255, 0.1);
	}

	.sidebar__tag-dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.sidebar__tag-label {
		flex: 1;
	}

	.sidebar__tag-count {
		font-size: 11px;
		color: rgba(255, 255, 255, 0.35);
	}

	.sidebar__bookmark-icon {
		color: var(--traek-color-yellow, #eab308);
		flex-shrink: 0;
	}

	.sidebar__bookmark-text {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}

	.sidebar__bookmark-label {
		font-size: 11px;
		color: rgba(255, 255, 255, 0.6);
		font-weight: 600;
	}

	.sidebar__bookmark-preview {
		font-size: 12px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		color: rgba(255, 255, 255, 0.75);
	}

	.sidebar__empty {
		padding: 24px 16px;
		color: rgba(255, 255, 255, 0.35);
		font-size: 12px;
		text-align: center;
		line-height: 1.6;
		margin: 0;
	}
</style>
