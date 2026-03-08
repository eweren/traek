<script lang="ts">
	import type { ItemType } from '$lib/marketplace/MarketplaceCard.svelte';

	type Step = 1 | 2 | 3;

	let step = $state<Step>(1);
	let submitting = $state(false);
	let submitted = $state(false);

	// Step 1 fields
	let itemType = $state<ItemType | null>(null);
	let itemName = $state('');
	let itemDescription = $state('');
	let itemTags = $state<string[]>([]);
	let priceType = $state<'free' | 'paid'>('free');
	let priceAmount = $state(9);

	// Step 2 fields
	let packageName = $state('');
	let version = $state('1.0.0');
	let changelogText = $state('');
	let docsUrl = $state('');
	let githubUrl = $state('');

	// Step 3
	let termsAccepted = $state(false);

	const availableTags = [
		'dark',
		'light',
		'minimal',
		'colorful',
		'accessibility',
		'productivity',
		'code',
		'markdown',
		'charts',
		'canvas',
		'brainstorming',
		'research',
		'support',
		'education'
	];

	function toggleTag(tag: string) {
		if (itemTags.includes(tag)) {
			itemTags = itemTags.filter((t) => t !== tag);
		} else if (itemTags.length < 5) {
			itemTags = [...itemTags, tag];
		}
	}

	const step1Valid = $derived(
		itemType !== null && itemName.trim().length >= 3 && itemDescription.trim().length >= 20
	);

	const step2Valid = $derived(packageName.trim().length >= 3 && /^\d+\.\d+\.\d+/.test(version));

	function nextStep() {
		if (step < 3) step = (step + 1) as Step;
	}

	function prevStep() {
		if (step > 1) step = (step - 1) as Step;
	}

	async function handleSubmit() {
		if (!termsAccepted) return;
		submitting = true;
		// Simulate API call
		await new Promise((r) => setTimeout(r, 1200));
		submitting = false;
		submitted = true;
	}

	const typeOptions: Array<{ value: ItemType; label: string; icon: string; desc: string }> = [
		{ value: 'theme', label: 'Theme', icon: '🎨', desc: 'Colors, typography, and visual style' },
		{ value: 'component', label: 'Component', icon: '🧩', desc: 'New node types and UI elements' },
		{ value: 'template', label: 'Template', icon: '📋', desc: 'Pre-built conversation structures' }
	];
</script>

<svelte:head>
	<title>Submit to Marketplace — træk</title>
</svelte:head>

<div class="page">
	{#if submitted}
		<!-- Confirmation -->
		<div class="confirm">
			<div class="confirm__icon" aria-hidden="true">✓</div>
			<h1 class="confirm__title">Submission received!</h1>
			<p class="confirm__body">
				Your item is under review. We typically respond within 2–5 business days.
			</p>
			<div class="confirm__actions">
				<a href="/marketplace/dashboard" class="btn btn--primary">View submission status</a>
				<button
					class="btn btn--ghost"
					onclick={() => {
						submitted = false;
						step = 1;
						itemType = null;
						itemName = '';
						itemDescription = '';
						termsAccepted = false;
					}}
				>
					Submit another item
				</button>
			</div>
		</div>
	{:else}
		<div class="wizard">
			<header class="wizard__header">
				<h1 class="wizard__title">Submit to Marketplace</h1>
				<p class="wizard__subtitle">
					Share your work with the Traek community and earn 70% of every sale.
				</p>
			</header>

			<!-- Progress steps -->
			<nav class="steps" aria-label="Submission progress">
				{#each [{ n: 1, label: 'Type & Basics' }, { n: 2, label: 'Package & Preview' }, { n: 3, label: 'Review & Submit' }] as s (s.n)}
					<div class="step" class:step--active={step === s.n} class:step--done={step > s.n}>
						<span class="step__num" aria-hidden="true">
							{#if step > s.n}✓{:else}{s.n}{/if}
						</span>
						<span class="step__label">{s.label}</span>
					</div>
					{#if s.n < 3}
						<div class="step__connector" class:step__connector--done={step > s.n}></div>
					{/if}
				{/each}
			</nav>

			<!-- Step panels -->
			<div class="wizard__body">
				{#if step === 1}
					<fieldset class="panel" aria-labelledby="step1-heading">
						<legend id="step1-heading" class="panel__title">Type & Basics</legend>

						<div class="field">
							<span class="label">What are you submitting?</span>
							<div class="type-cards">
								{#each typeOptions as opt (opt.value)}
									<label class="type-card" class:type-card--selected={itemType === opt.value}>
										<input type="radio" name="type" value={opt.value} bind:group={itemType} />
										<span class="type-card__icon" aria-hidden="true">{opt.icon}</span>
										<span class="type-card__label">{opt.label}</span>
										<span class="type-card__desc">{opt.desc}</span>
									</label>
								{/each}
							</div>
						</div>

						<div class="field">
							<label class="label" for="item-name">Name <span class="req">*</span></label>
							<input
								id="item-name"
								type="text"
								class="input"
								placeholder="e.g. Midnight Pro"
								maxlength="60"
								bind:value={itemName}
							/>
							<span class="hint">{itemName.length}/60</span>
						</div>

						<div class="field">
							<label class="label" for="item-desc"
								>Short description <span class="req">*</span></label
							>
							<textarea
								id="item-desc"
								class="input input--textarea"
								placeholder="Describe what your item does in 1–2 sentences…"
								maxlength="160"
								bind:value={itemDescription}
							></textarea>
							<span class="hint">{itemDescription.length}/160</span>
						</div>

						<div class="field">
							<span class="label">Tags <span class="optional">(up to 5)</span></span>
							<div class="tags">
								{#each availableTags as tag (tag)}
									<button
										type="button"
										class="tag-chip"
										class:tag-chip--selected={itemTags.includes(tag)}
										onclick={() => toggleTag(tag)}
										aria-pressed={itemTags.includes(tag)}
									>
										{tag}
									</button>
								{/each}
							</div>
						</div>

						<div class="field">
							<span class="label">Pricing</span>
							<div class="price-toggle">
								<label class="price-opt" class:price-opt--active={priceType === 'free'}>
									<input type="radio" name="price" value="free" bind:group={priceType} />
									Free
								</label>
								<label class="price-opt" class:price-opt--active={priceType === 'paid'}>
									<input type="radio" name="price" value="paid" bind:group={priceType} />
									Paid
								</label>
							</div>
							{#if priceType === 'paid'}
								<div class="price-input-wrap">
									<span class="price-currency">$</span>
									<input
										type="number"
										class="input input--price"
										min="1"
										max="99"
										bind:value={priceAmount}
										aria-label="Price per month in dollars"
									/>
									<span class="price-unit">/mo</span>
								</div>
							{/if}
						</div>
					</fieldset>
				{:else if step === 2}
					<fieldset class="panel" aria-labelledby="step2-heading">
						<legend id="step2-heading" class="panel__title">Package & Preview</legend>

						<div class="field">
							<label class="label" for="pkg-name">npm package name <span class="req">*</span></label
							>
							<div class="input-prefix-wrap">
								<span class="input-prefix">@traek-{itemType ?? 'items'}/</span>
								<input
									id="pkg-name"
									type="text"
									class="input input--prefixed"
									placeholder="your-item-slug"
									bind:value={packageName}
								/>
							</div>
						</div>

						<div class="field">
							<label class="label" for="version">Version <span class="req">*</span></label>
							<input
								id="version"
								type="text"
								class="input"
								placeholder="1.0.0"
								bind:value={version}
							/>
						</div>

						<div class="field">
							<label class="label" for="changelog">Release notes / changelog</label>
							<textarea
								id="changelog"
								class="input input--textarea input--code"
								placeholder="## 1.0.0&#10;- Initial release"
								bind:value={changelogText}
							></textarea>
						</div>

						<div class="field">
							<label class="label" for="docs-url">Documentation URL</label>
							<input
								id="docs-url"
								type="url"
								class="input"
								placeholder="https://docs.example.com/my-theme"
								bind:value={docsUrl}
							/>
						</div>

						<div class="field">
							<label class="label" for="github-url">GitHub repository</label>
							<input
								id="github-url"
								type="url"
								class="input"
								placeholder="https://github.com/you/my-theme"
								bind:value={githubUrl}
							/>
							{#if githubUrl}
								<p class="hint hint--positive">
									Public GitHub URL adds a trust badge to your listing.
								</p>
							{/if}
						</div>
					</fieldset>
				{:else if step === 3}
					<div class="panel">
						<h2 class="panel__title">Review & Submit</h2>

						<!-- Preview card -->
						<div class="review-preview">
							<h3 class="review-preview__label">Your listing preview</h3>
							<div class="preview-card">
								<div class="preview-card__thumb">
									<span class="preview-card__type">{itemType ?? '?'}</span>
								</div>
								<div class="preview-card__body">
									<strong class="preview-card__name">{itemName || 'Untitled item'}</strong>
									<p class="preview-card__desc">{itemDescription || 'No description yet.'}</p>
									<div class="preview-card__meta">
										<span class="preview-card__price">
											{priceType === 'free' ? 'Free' : `$${priceAmount}/mo`}
										</span>
										{#if itemTags.length > 0}
											<span class="preview-card__tags">
												{itemTags.join(' · ')}
											</span>
										{/if}
									</div>
								</div>
							</div>
						</div>

						<!-- Summary -->
						<dl class="summary">
							<div class="summary__row">
								<dt>Type</dt>
								<dd>{itemType ?? '—'}</dd>
							</div>
							<div class="summary__row">
								<dt>Package</dt>
								<dd>
									{#if packageName}
										<code>@traek-{itemType ?? 'items'}/{packageName}</code>
									{:else}—{/if}
								</dd>
							</div>
							<div class="summary__row">
								<dt>Version</dt>
								<dd>{version}</dd>
							</div>
							<div class="summary__row">
								<dt>Price</dt>
								<dd>{priceType === 'free' ? 'Free' : `$${priceAmount}/mo`}</dd>
							</div>
						</dl>

						<!-- Terms -->
						<label class="terms">
							<input type="checkbox" bind:checked={termsAccepted} />
							<span>
								I agree to the
								<a href="/marketplace/terms" target="_blank">Marketplace Terms</a>
								and the 70/30 revenue split (I receive 70%).
							</span>
						</label>
					</div>
				{/if}

				<!-- Nav buttons -->
				<div class="wizard__nav">
					{#if step > 1}
						<button class="btn btn--ghost" onclick={prevStep}>← Back</button>
					{:else}
						<div></div>
					{/if}

					{#if step < 3}
						<button
							class="btn btn--primary"
							onclick={nextStep}
							disabled={step === 1 ? !step1Valid : !step2Valid}
						>
							Next →
						</button>
					{:else}
						<button
							class="btn btn--primary"
							onclick={handleSubmit}
							disabled={!termsAccepted || submitting}
						>
							{submitting ? 'Submitting…' : 'Submit for review'}
						</button>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.page {
		max-width: 720px;
		margin: 0 auto;
		padding: 48px max(5vw, 20px);
	}

	/* Confirmation */
	.confirm {
		text-align: center;
		padding: 80px 0;
	}

	.confirm__icon {
		width: 72px;
		height: 72px;
		border-radius: 50%;
		background: linear-gradient(135deg, #00d8ff, #00ffa3);
		color: #080808;
		font-size: 32px;
		font-weight: 700;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 auto 24px;
	}

	.confirm__title {
		font-size: 28px;
		font-weight: 700;
		margin: 0 0 12px;
	}

	.confirm__body {
		color: var(--pg-text-secondary, #a8a8a8);
		margin: 0 0 32px;
	}

	.confirm__actions {
		display: flex;
		gap: 12px;
		justify-content: center;
		flex-wrap: wrap;
	}

	/* Wizard */
	.wizard__header {
		margin-bottom: 32px;
	}

	.wizard__title {
		font-size: 26px;
		font-weight: 700;
		margin: 0 0 8px;
	}

	.wizard__subtitle {
		color: var(--pg-text-secondary, #a8a8a8);
		margin: 0;
	}

	/* Steps progress */
	.steps {
		display: flex;
		align-items: center;
		margin-bottom: 36px;
	}

	.step {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.step__num {
		width: 28px;
		height: 28px;
		border-radius: 50%;
		border: 2px solid var(--pg-border-strong, rgba(255, 255, 255, 0.14));
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 12px;
		font-weight: 600;
		color: var(--pg-text-muted, #666);
		flex-shrink: 0;
		transition: all 0.2s;
	}

	.step--active .step__num {
		background: linear-gradient(135deg, #00d8ff, #00ffa3);
		border-color: transparent;
		color: #080808;
	}

	.step--done .step__num {
		background: rgba(0, 255, 163, 0.15);
		border-color: rgba(0, 255, 163, 0.4);
		color: #00ffa3;
	}

	.step__label {
		font-size: 13px;
		color: var(--pg-text-muted, #666);
		white-space: nowrap;
	}

	.step--active .step__label {
		color: var(--pg-text, #f0f0f0);
		font-weight: 500;
	}

	.step__connector {
		flex: 1;
		height: 1px;
		background: var(--pg-border, rgba(255, 255, 255, 0.08));
		margin: 0 12px;
		transition: background 0.2s;
	}

	.step__connector--done {
		background: rgba(0, 255, 163, 0.3);
	}

	/* Panel */
	.panel {
		border: none;
		padding: 0;
		margin: 0;
	}

	.panel__title {
		font-size: 18px;
		font-weight: 600;
		margin: 0 0 24px;
		color: var(--pg-text, #f0f0f0);
	}

	/* Fields */
	.field {
		margin-bottom: 24px;
	}

	.label {
		display: block;
		font-size: 13px;
		font-weight: 500;
		color: var(--pg-text-secondary, #a8a8a8);
		margin-bottom: 8px;
	}

	.req {
		color: #ff6b6b;
	}

	.optional {
		color: var(--pg-text-muted, #666);
		font-weight: 400;
	}

	.hint {
		font-size: 11px;
		color: var(--pg-text-muted, #666);
		margin-top: 4px;
		display: block;
	}

	.hint--positive {
		color: #00ffa3;
	}

	.input {
		width: 100%;
		padding: 10px 14px;
		background: var(--pg-bg-card, #161616);
		border: 1px solid var(--pg-border, rgba(255, 255, 255, 0.08));
		border-radius: 10px;
		color: var(--pg-text, #f0f0f0);
		font-size: 14px;
		font-family: inherit;
		box-sizing: border-box;
		transition: border-color 0.15s;
	}

	.input:focus {
		outline: none;
		border-color: var(--pg-border-cyan, rgba(0, 216, 255, 0.28));
	}

	.input--textarea {
		min-height: 100px;
		resize: vertical;
	}

	.input--code {
		font-family: 'Space Mono', monospace;
		font-size: 13px;
	}

	.input-prefix-wrap {
		display: flex;
		align-items: center;
		background: var(--pg-bg-card, #161616);
		border: 1px solid var(--pg-border, rgba(255, 255, 255, 0.08));
		border-radius: 10px;
		overflow: hidden;
	}

	.input-prefix-wrap:focus-within {
		border-color: var(--pg-border-cyan, rgba(0, 216, 255, 0.28));
	}

	.input-prefix {
		padding: 10px 10px 10px 14px;
		font-size: 13px;
		font-family: 'Space Mono', monospace;
		color: var(--pg-text-muted, #666);
		white-space: nowrap;
		border-right: 1px solid var(--pg-border, rgba(255, 255, 255, 0.08));
	}

	.input--prefixed {
		border: none;
		border-radius: 0;
		background: transparent;
		flex: 1;
		padding: 10px 14px;
	}

	.input--prefixed:focus {
		outline: none;
		border: none;
	}

	.input--price {
		width: 80px;
	}

	/* Type cards */
	.type-cards {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 12px;
	}

	.type-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		padding: 20px 12px;
		background: var(--pg-bg-card, #161616);
		border: 2px solid var(--pg-border, rgba(255, 255, 255, 0.08));
		border-radius: 12px;
		cursor: pointer;
		text-align: center;
		transition: all 0.15s;
	}

	.type-card input {
		display: none;
	}

	.type-card:hover {
		border-color: var(--pg-border-strong, rgba(255, 255, 255, 0.14));
	}

	.type-card--selected {
		border-color: var(--pg-cyan, #00d8ff) !important;
		background: rgba(0, 216, 255, 0.06);
	}

	.type-card__icon {
		font-size: 28px;
	}

	.type-card__label {
		font-size: 14px;
		font-weight: 600;
		color: var(--pg-text, #f0f0f0);
	}

	.type-card__desc {
		font-size: 11px;
		color: var(--pg-text-muted, #666);
		line-height: 1.4;
	}

	/* Tags */
	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.tag-chip {
		padding: 4px 12px;
		border-radius: 20px;
		border: 1px solid var(--pg-border-strong, rgba(255, 255, 255, 0.14));
		background: transparent;
		color: var(--pg-text-secondary, #a8a8a8);
		font-size: 12px;
		cursor: pointer;
		font-family: inherit;
		transition: all 0.15s;
	}

	.tag-chip:hover {
		border-color: var(--pg-border-cyan, rgba(0, 216, 255, 0.28));
		color: var(--pg-text, #f0f0f0);
	}

	.tag-chip--selected {
		background: rgba(0, 216, 255, 0.12);
		border-color: var(--pg-cyan, #00d8ff);
		color: var(--pg-cyan, #00d8ff);
	}

	/* Price toggle */
	.price-toggle {
		display: flex;
		gap: 8px;
		margin-bottom: 12px;
	}

	.price-opt {
		padding: 8px 20px;
		border-radius: 8px;
		border: 1px solid var(--pg-border-strong, rgba(255, 255, 255, 0.14));
		cursor: pointer;
		font-size: 14px;
		color: var(--pg-text-secondary, #a8a8a8);
		transition: all 0.15s;
	}

	.price-opt input {
		display: none;
	}

	.price-opt--active {
		border-color: var(--pg-cyan, #00d8ff);
		background: rgba(0, 216, 255, 0.08);
		color: var(--pg-cyan, #00d8ff);
	}

	.price-input-wrap {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.price-currency,
	.price-unit {
		font-size: 14px;
		color: var(--pg-text-secondary, #a8a8a8);
	}

	/* Review preview card */
	.review-preview {
		margin-bottom: 28px;
	}

	.review-preview__label {
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--pg-text-muted, #666);
		margin: 0 0 12px;
	}

	.preview-card {
		display: flex;
		gap: 16px;
		padding: 16px;
		background: var(--pg-bg-card, #161616);
		border: 1px solid var(--pg-border, rgba(255, 255, 255, 0.08));
		border-radius: 12px;
	}

	.preview-card__thumb {
		width: 80px;
		height: 60px;
		border-radius: 8px;
		background: var(--pg-bg-surface, #111);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.preview-card__type {
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		background: linear-gradient(135deg, #00d8ff, #00ffa3);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.preview-card__body {
		flex: 1;
	}

	.preview-card__name {
		display: block;
		font-size: 15px;
		margin-bottom: 4px;
	}

	.preview-card__desc {
		font-size: 13px;
		color: var(--pg-text-secondary, #a8a8a8);
		margin: 0 0 8px;
	}

	.preview-card__meta {
		display: flex;
		gap: 12px;
		font-size: 12px;
	}

	.preview-card__price {
		color: var(--pg-lime, #00ffa3);
		font-weight: 600;
	}

	.preview-card__tags {
		color: var(--pg-text-muted, #666);
	}

	/* Summary */
	.summary {
		margin-bottom: 24px;
		border: 1px solid var(--pg-border, rgba(255, 255, 255, 0.08));
		border-radius: 10px;
		overflow: hidden;
	}

	.summary__row {
		display: flex;
		padding: 10px 16px;
		border-bottom: 1px solid var(--pg-border, rgba(255, 255, 255, 0.08));
	}

	.summary__row:last-child {
		border-bottom: none;
	}

	.summary__row dt {
		width: 120px;
		font-size: 13px;
		color: var(--pg-text-muted, #666);
		flex-shrink: 0;
	}

	.summary__row dd {
		margin: 0;
		font-size: 13px;
		color: var(--pg-text, #f0f0f0);
	}

	.summary__row code {
		font-family: 'Space Mono', monospace;
		font-size: 12px;
		color: var(--pg-cyan, #00d8ff);
	}

	/* Terms */
	.terms {
		display: flex;
		align-items: flex-start;
		gap: 10px;
		font-size: 14px;
		color: var(--pg-text-secondary, #a8a8a8);
		cursor: pointer;
		margin-bottom: 8px;
	}

	.terms input {
		margin-top: 2px;
		accent-color: var(--pg-cyan, #00d8ff);
		flex-shrink: 0;
	}

	.terms a {
		color: var(--pg-cyan, #00d8ff);
	}

	/* Nav buttons */
	.wizard__nav {
		display: flex;
		justify-content: space-between;
		margin-top: 32px;
		padding-top: 24px;
		border-top: 1px solid var(--pg-border, rgba(255, 255, 255, 0.08));
	}

	/* Buttons */
	.btn {
		padding: 10px 24px;
		border-radius: 10px;
		font-size: 14px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.15s;
		font-family: inherit;
		text-decoration: none;
		display: inline-flex;
		align-items: center;
	}

	.btn--primary {
		background: linear-gradient(135deg, #00d8ff, #00ffa3);
		color: #080808;
		border: none;
		box-shadow: 0 8px 28px rgba(0, 216, 255, 0.25);
	}

	.btn--primary:hover:not(:disabled) {
		box-shadow: 0 12px 36px rgba(0, 216, 255, 0.35);
		transform: translateY(-1px);
	}

	.btn--primary:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.btn--ghost {
		background: transparent;
		border: 1px solid var(--pg-border-strong, rgba(255, 255, 255, 0.14));
		color: var(--pg-text-secondary, #a8a8a8);
	}

	.btn--ghost:hover {
		border-color: var(--pg-border-cyan, rgba(0, 216, 255, 0.28));
		color: var(--pg-cyan, #00d8ff);
	}

	@media (max-width: 600px) {
		.type-cards {
			grid-template-columns: 1fr;
		}

		.steps {
			flex-wrap: wrap;
			gap: 8px;
		}

		.step__connector {
			display: none;
		}
	}
</style>
