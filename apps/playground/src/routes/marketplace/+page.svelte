<script lang="ts">
	import MarketplaceCard from '$lib/marketplace/MarketplaceCard.svelte';
	import type { ItemType } from '$lib/marketplace/MarketplaceCard.svelte';
	import type { BadgeTier } from '$lib/marketplace/BadgePill.svelte';

	// Filter state
	let searchQuery = $state('');
	let activeCategory = $state<'all' | ItemType>('all');
	let filterFree = $state(false);
	let filterPaid = $state(false);
	let sortBy = $state<'popular' | 'newest' | 'rating'>('popular');

	// Static demo listings (would come from API in production)
	const allItems: Array<{
		slug: string;
		type: ItemType;
		name: string;
		description: string;
		publisherName: string;
		publisherHandle: string;
		publisherBadge: BadgeTier;
		rating: number;
		reviewCount: number;
		installCount: number;
		priceMonthly: number;
	}> = [
		{
			slug: 'midnight-pro',
			type: 'theme',
			name: 'Midnight Pro',
			description: 'Deep midnight theme with carefully tuned contrast ratios.',
			publisherName: 'Studio Nova',
			publisherHandle: 'studionova',
			publisherBadge: 'verified_partner',
			rating: 4.7,
			reviewCount: 142,
			installCount: 8421,
			priceMonthly: 9
		},
		{
			slug: 'neon-canvas',
			type: 'theme',
			name: 'Neon Canvas',
			description: 'Vibrant neon accents on a dark background.',
			publisherName: 'pixelcraft',
			publisherHandle: 'pixelcraft',
			publisherBadge: 'pro_creator',
			rating: 4.4,
			reviewCount: 87,
			installCount: 3200,
			priceMonthly: 7
		},
		{
			slug: 'minimal-light',
			type: 'theme',
			name: 'Minimal Light',
			description: 'Clean, accessible light theme for day-time use.',
			publisherName: 'designsys',
			publisherHandle: 'designsys',
			publisherBadge: 'creator',
			rating: 4.2,
			reviewCount: 56,
			installCount: 1840,
			priceMonthly: 0
		},
		{
			slug: 'math-renderer',
			type: 'component',
			name: 'Math Renderer',
			description: 'Renders LaTeX equations inline in Traek nodes using KaTeX.',
			publisherName: 'mathtools',
			publisherHandle: 'mathtools',
			publisherBadge: 'creator',
			rating: 4.9,
			reviewCount: 31,
			installCount: 920,
			priceMonthly: 0
		},
		{
			slug: 'mermaid-diagrams',
			type: 'component',
			name: 'Mermaid Diagrams',
			description: 'Render flowcharts and sequence diagrams from text.',
			publisherName: 'diagrammer',
			publisherHandle: 'diagrammer',
			publisherBadge: 'pro_creator',
			rating: 4.6,
			reviewCount: 74,
			installCount: 4100,
			priceMonthly: 5
		},
		{
			slug: 'code-review',
			type: 'template',
			name: 'Code Review Workflow',
			description: 'Multi-branch template for systematic code review sessions.',
			publisherName: 'devflows',
			publisherHandle: 'devflows',
			publisherBadge: 'verified_partner',
			rating: 4.8,
			reviewCount: 112,
			installCount: 6780,
			priceMonthly: 0
		},
		{
			slug: 'brainstorm-plus',
			type: 'template',
			name: 'Brainstorm+',
			description: '6-branch brainstorming template with diverge/converge structure.',
			publisherName: 'thinklab',
			publisherHandle: 'thinklab',
			publisherBadge: 'creator',
			rating: 4.3,
			reviewCount: 48,
			installCount: 2300,
			priceMonthly: 3
		},
		{
			slug: 'forest-dark',
			type: 'theme',
			name: 'Forest Dark',
			description: 'Earthy greens and deep shadows for focused sessions.',
			publisherName: 'naturaui',
			publisherHandle: 'naturaui',
			publisherBadge: 'contributor',
			rating: 3.9,
			reviewCount: 18,
			installCount: 340,
			priceMonthly: 0
		}
	];

	const filteredItems = $derived.by(() => {
		let items = allItems;

		// Category
		if (activeCategory !== 'all') {
			items = items.filter((i) => i.type === activeCategory);
		}

		// Price
		if (filterFree && !filterPaid) items = items.filter((i) => i.priceMonthly === 0);
		if (filterPaid && !filterFree) items = items.filter((i) => i.priceMonthly > 0);

		// Search
		const q = searchQuery.trim().toLowerCase();
		if (q) {
			items = items.filter(
				(i) =>
					i.name.toLowerCase().includes(q) ||
					i.description.toLowerCase().includes(q) ||
					i.publisherHandle.toLowerCase().includes(q)
			);
		}

		// Sort
		if (sortBy === 'popular') items = [...items].sort((a, b) => b.installCount - a.installCount);
		if (sortBy === 'rating') items = [...items].sort((a, b) => b.rating - a.rating);

		return items;
	});

	const categories: Array<{ value: 'all' | ItemType; label: string }> = [
		{ value: 'all', label: 'All' },
		{ value: 'theme', label: 'Themes' },
		{ value: 'component', label: 'Components' },
		{ value: 'template', label: 'Templates' }
	];

	function handleSearchKey(e: KeyboardEvent) {
		if (e.key === 'Escape') searchQuery = '';
	}
</script>

<svelte:head>
	<title>Marketplace — træk</title>
</svelte:head>

<svelte:window
	onkeydown={(e) => {
		if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
			e.preventDefault();
			document.getElementById('marketplace-search')?.focus();
		}
	}}
/>

<div class="page">
	<!-- Sidebar -->
	<aside class="sidebar" aria-label="Marketplace filters">
		<section class="filter-group">
			<h2 class="filter-title">Categories</h2>
			{#each categories as cat (cat.value)}
				<label class="filter-radio">
					<input type="radio" name="category" value={cat.value} bind:group={activeCategory} />
					<span>{cat.label}</span>
				</label>
			{/each}
		</section>

		<section class="filter-group">
			<h2 class="filter-title">Price</h2>
			<label class="filter-check">
				<input type="checkbox" bind:checked={filterFree} />
				<span>Free</span>
			</label>
			<label class="filter-check">
				<input type="checkbox" bind:checked={filterPaid} />
				<span>Paid</span>
			</label>
		</section>

		<section class="filter-group">
			<h2 class="filter-title">Sort by</h2>
			<label class="filter-radio">
				<input type="radio" name="sort" value="popular" bind:group={sortBy} />
				<span>Most popular</span>
			</label>
			<label class="filter-radio">
				<input type="radio" name="sort" value="newest" bind:group={sortBy} />
				<span>Newest</span>
			</label>
			<label class="filter-radio">
				<input type="radio" name="sort" value="rating" bind:group={sortBy} />
				<span>Highest rated</span>
			</label>
		</section>
	</aside>

	<!-- Main content -->
	<div class="content">
		<!-- Search row -->
		<div class="search-row">
			<div class="search-wrap">
				<svg
					class="search-icon"
					width="16"
					height="16"
					viewBox="0 0 16 16"
					fill="none"
					aria-hidden="true"
				>
					<circle cx="6.5" cy="6.5" r="5" stroke="currentColor" stroke-width="1.5" />
					<line
						x1="10.5"
						y1="10.5"
						x2="14"
						y2="14"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
					/>
				</svg>
				<input
					id="marketplace-search"
					type="search"
					class="search-input"
					placeholder="Search themes, components, templates… (⌘K)"
					bind:value={searchQuery}
					onkeydown={handleSearchKey}
					aria-label="Search marketplace"
				/>
			</div>
		</div>

		<!-- Category tabs -->
		<div class="tabs" role="tablist" aria-label="Filter by category">
			{#each categories as cat (cat.value)}
				<button
					class="tab"
					class:tab--active={activeCategory === cat.value}
					role="tab"
					aria-selected={activeCategory === cat.value}
					onclick={() => (activeCategory = cat.value)}
				>
					{cat.label}
				</button>
			{/each}
		</div>

		<!-- Results count -->
		<p class="results-meta" aria-live="polite">
			{filteredItems.length}
			{filteredItems.length === 1 ? 'result' : 'results'}
			{searchQuery ? `for "${searchQuery}"` : ''}
		</p>

		<!-- Grid -->
		{#if filteredItems.length > 0}
			<div class="grid" role="list" aria-label="Marketplace listings">
				{#each filteredItems as item (item.slug)}
					<div role="listitem">
						<MarketplaceCard
							slug={item.slug}
							type={item.type}
							name={item.name}
							publisherHandle={item.publisherHandle}
							publisherBadge={item.publisherBadge}
							rating={item.rating}
							reviewCount={item.reviewCount}
							installCount={item.installCount}
							priceMonthly={item.priceMonthly}
						/>
					</div>
				{/each}
			</div>
		{:else}
			<div class="empty">
				<p class="empty__icon" aria-hidden="true">🔍</p>
				<p class="empty__msg">No items match your filters.</p>
				<button
					class="empty__reset"
					onclick={() => {
						searchQuery = '';
						activeCategory = 'all';
						filterFree = false;
						filterPaid = false;
					}}
				>
					Clear filters
				</button>
			</div>
		{/if}
	</div>
</div>

<style>
	.page {
		display: grid;
		grid-template-columns: 220px 1fr;
		gap: 0;
		min-height: calc(100vh - 60px);
	}

	/* Sidebar */
	.sidebar {
		padding: 32px 20px;
		border-right: 1px solid var(--pg-border, rgba(255, 255, 255, 0.08));
		background: var(--pg-bg-surface, #111);
	}

	.filter-group {
		margin-bottom: 28px;
	}

	.filter-title {
		margin: 0 0 10px;
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--pg-text-muted, #666);
	}

	.filter-radio,
	.filter-check {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 5px 0;
		font-size: 14px;
		color: var(--pg-text-secondary, #a8a8a8);
		cursor: pointer;
	}

	.filter-radio:hover,
	.filter-check:hover {
		color: var(--pg-text, #f0f0f0);
	}

	.filter-radio input[type='radio'],
	.filter-check input[type='checkbox'] {
		accent-color: var(--pg-cyan, #00d8ff);
	}

	/* Main content */
	.content {
		padding: 28px max(3vw, 20px);
	}

	/* Search */
	.search-row {
		margin-bottom: 20px;
	}

	.search-wrap {
		position: relative;
		max-width: 560px;
	}

	.search-icon {
		position: absolute;
		left: 12px;
		top: 50%;
		transform: translateY(-50%);
		color: var(--pg-text-muted, #666);
		pointer-events: none;
	}

	.search-input {
		width: 100%;
		padding: 10px 14px 10px 38px;
		background: var(--pg-bg-card, #161616);
		border: 1px solid var(--pg-border, rgba(255, 255, 255, 0.08));
		border-radius: 10px;
		color: var(--pg-text, #f0f0f0);
		font-size: 14px;
		font-family: inherit;
		transition: border-color 0.15s;
	}

	.search-input::placeholder {
		color: var(--pg-text-muted, #666);
	}

	.search-input:focus {
		outline: none;
		border-color: var(--pg-border-cyan, rgba(0, 216, 255, 0.28));
	}

	/* Tabs */
	.tabs {
		display: flex;
		gap: 4px;
		margin-bottom: 20px;
	}

	.tab {
		padding: 6px 16px;
		border-radius: 20px;
		font-size: 13px;
		font-weight: 500;
		background: transparent;
		border: 1px solid var(--pg-border, rgba(255, 255, 255, 0.08));
		color: var(--pg-text-secondary, #a8a8a8);
		cursor: pointer;
		transition: all 0.15s;
		font-family: inherit;
	}

	.tab:hover {
		border-color: var(--pg-border-strong, rgba(255, 255, 255, 0.14));
		color: var(--pg-text, #f0f0f0);
	}

	.tab--active {
		background: linear-gradient(135deg, #00d8ff, #00ffa3);
		border-color: transparent;
		color: #080808;
		font-weight: 600;
	}

	/* Results meta */
	.results-meta {
		margin: 0 0 16px;
		font-size: 13px;
		color: var(--pg-text-muted, #666);
	}

	/* Grid */
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
		gap: 20px;
	}

	/* Empty state */
	.empty {
		text-align: center;
		padding: 80px 20px;
		color: var(--pg-text-muted, #666);
	}

	.empty__icon {
		font-size: 3rem;
		margin: 0 0 12px;
	}

	.empty__msg {
		font-size: 15px;
		margin: 0 0 20px;
	}

	.empty__reset {
		padding: 8px 20px;
		border-radius: 8px;
		border: 1px solid var(--pg-border-strong, rgba(255, 255, 255, 0.14));
		background: transparent;
		color: var(--pg-text-secondary, #a8a8a8);
		font-size: 14px;
		cursor: pointer;
		font-family: inherit;
		transition: all 0.15s;
	}

	.empty__reset:hover {
		border-color: var(--pg-border-cyan, rgba(0, 216, 255, 0.28));
		color: var(--pg-cyan, #00d8ff);
	}

	/* Responsive */
	@media (max-width: 768px) {
		.page {
			grid-template-columns: 1fr;
		}

		.sidebar {
			border-right: none;
			border-bottom: 1px solid var(--pg-border, rgba(255, 255, 255, 0.08));
			padding: 20px;
		}
	}
</style>
