<script lang="ts">
	import BadgePill from '$lib/marketplace/BadgePill.svelte';
	import type { BadgeTier } from '$lib/marketplace/BadgePill.svelte';

	// Revenue calculator state
	let installs = $state(500);
	let pricePerMonth = $state(9);

	const grossMonthly = $derived(installs * pricePerMonth);
	const creatorShare = $derived(Math.round(grossMonthly * 0.7));
	const traekShare = $derived(Math.round(grossMonthly * 0.3));

	const tiers: Array<{
		key: BadgeTier;
		name: string;
		criteria: string;
		revenueShare: string;
		support: string;
		featuredSlots: boolean;
		earlyAccess: boolean;
		dedicatedManager: boolean;
	}> = [
		{
			key: 'contributor',
			name: 'Contributor',
			criteria: 'First submission approved',
			revenueShare: '70%',
			support: 'Community forums',
			featuredSlots: false,
			earlyAccess: false,
			dedicatedManager: false
		},
		{
			key: 'creator',
			name: 'Creator',
			criteria: '100+ installs · 4.0+ rating',
			revenueShare: '70%',
			support: 'Email support',
			featuredSlots: false,
			earlyAccess: true,
			dedicatedManager: false
		},
		{
			key: 'pro_creator',
			name: 'Pro Creator',
			criteria: '1k+ installs · 4.5+ rating · 3+ items',
			revenueShare: '70%',
			support: 'Priority email',
			featuredSlots: true,
			earlyAccess: true,
			dedicatedManager: false
		},
		{
			key: 'verified_partner',
			name: 'Verified Partner',
			criteria: 'Manual review + revenue milestone',
			revenueShare: '70%',
			support: 'Dedicated partner manager',
			featuredSlots: true,
			earlyAccess: true,
			dedicatedManager: true
		}
	];

	const steps = [
		{
			num: '01',
			title: 'Build',
			detail:
				'Use the Traek SDK to create a theme, custom node component, or conversation template. Publish to npm.'
		},
		{
			num: '02',
			title: 'Submit',
			detail:
				'Submit via the 3-step wizard. Our team reviews for quality and security within 2–5 business days.'
		},
		{
			num: '03',
			title: 'Earn',
			detail:
				'Go live in the marketplace. You keep 70% of every subscription. Payouts monthly via Stripe.'
		}
	];

	function formatCurrency(n: number): string {
		if (n >= 1000) return '$' + (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
		return '$' + n.toLocaleString();
	}
</script>

<svelte:head>
	<title>Developer Program — træk marketplace</title>
</svelte:head>

<div class="page">
	<!-- HERO -->
	<section class="hero">
		<div class="hero__inner">
			<div class="hero__eyebrow">
				<span class="eyebrow-pill">Developer Program</span>
			</div>
			<h1 class="hero__heading">
				Build for the<br />
				<span class="hero__heading--gradient">Traek ecosystem.</span><br />
				Earn 70% of every sale.
			</h1>
			<p class="hero__sub">
				Publish themes, components, and templates to thousands of developers building spatial AI
				conversation interfaces. Ship once, earn forever.
			</p>
			<div class="hero__actions">
				<a href="/marketplace/submit" class="btn btn--primary">Start building →</a>
				<a href="/marketplace" class="btn btn--ghost">Browse the marketplace</a>
			</div>

			<dl class="hero__stats">
				<div class="hero__stat">
					<dt class="stat__label">Revenue share</dt>
					<dd class="stat__value">70%</dd>
				</div>
				<div class="hero__stat-divider" aria-hidden="true"></div>
				<div class="hero__stat">
					<dt class="stat__label">Review time</dt>
					<dd class="stat__value">2–5 days</dd>
				</div>
				<div class="hero__stat-divider" aria-hidden="true"></div>
				<div class="hero__stat">
					<dt class="stat__label">Items live</dt>
					<dd class="stat__value">240+</dd>
				</div>
				<div class="hero__stat-divider" aria-hidden="true"></div>
				<div class="hero__stat">
					<dt class="stat__label">Creators earning</dt>
					<dd class="stat__value">1,800+</dd>
				</div>
			</dl>
		</div>

		<div class="hero__grid" aria-hidden="true">
			{#each [0, 1, 2, 3, 4, 5, 6, 7] as i (i)}
				<div class="hero__grid-line" style="--i:{i}"></div>
			{/each}
		</div>
	</section>

	<!-- HOW IT WORKS -->
	<section class="section how">
		<div class="section__inner">
			<h2 class="section__title">How it works</h2>
			<p class="section__sub">From idea to income in three steps.</p>

			<ol class="steps" aria-label="How the developer program works">
				{#each steps as step (step.num)}
					<li class="step">
						<div class="step__num" aria-hidden="true">{step.num}</div>
						<h3 class="step__title">{step.title}</h3>
						<p class="step__detail">{step.detail}</p>
					</li>
				{/each}
			</ol>
		</div>
	</section>

	<!-- REVENUE CALCULATOR -->
	<section class="section calc-section">
		<div class="section__inner">
			<h2 class="section__title">Revenue calculator</h2>
			<p class="section__sub">Estimate your monthly earnings — before writing a line of code.</p>

			<div class="calc">
				<div class="calc__inputs">
					<label class="calc__field" for="installs-slider">
						<span class="calc__field-label">Monthly installs</span>
						<span class="calc__field-value">{installs.toLocaleString()}</span>
					</label>
					<input
						id="installs-slider"
						type="range"
						class="slider"
						min="10"
						max="5000"
						step="10"
						bind:value={installs}
						aria-valuetext="{installs.toLocaleString()} installs"
					/>

					<label class="calc__field" for="price-slider">
						<span class="calc__field-label">Price per month</span>
						<span class="calc__field-value">${pricePerMonth}/mo</span>
					</label>
					<input
						id="price-slider"
						type="range"
						class="slider"
						min="1"
						max="49"
						step="1"
						bind:value={pricePerMonth}
						aria-valuetext="${pricePerMonth} per month"
					/>
				</div>

				<div class="calc__result" aria-live="polite" aria-atomic="true">
					<div class="result__main">
						<span class="result__label">Your monthly earnings</span>
						<span class="result__amount">{formatCurrency(creatorShare)}</span>
					</div>
					<div class="result__breakdown">
						<div class="result__row">
							<span class="result__row-label">Gross revenue</span>
							<span class="result__row-value">{formatCurrency(grossMonthly)}</span>
						</div>
						<div class="result__row">
							<span class="result__row-label">Your share (70%)</span>
							<span class="result__row-value result__row-value--accent"
								>{formatCurrency(creatorShare)}</span
							>
						</div>
						<div class="result__row">
							<span class="result__row-label">Platform fee (30%)</span>
							<span class="result__row-value result__row-value--muted"
								>{formatCurrency(traekShare)}</span
							>
						</div>
					</div>
					<p class="result__note">
						Estimates only. Actual earnings depend on conversion rates and churn.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- TIER BENEFITS TABLE -->
	<section class="section tiers-section">
		<div class="section__inner">
			<h2 class="section__title">Creator tiers</h2>
			<p class="section__sub">Grow your reputation and unlock more visibility as you scale.</p>

			<div class="tiers-wrap">
				<table class="tiers-table" aria-label="Creator tier benefits">
					<thead>
						<tr>
							<th scope="col" class="tiers-table__col-label">Tier</th>
							<th scope="col">Criteria</th>
							<th scope="col">Revenue share</th>
							<th scope="col">Support</th>
							<th scope="col">Featured slots</th>
							<th scope="col">Early access</th>
							<th scope="col">Partner manager</th>
						</tr>
					</thead>
					<tbody>
						{#each tiers as tier (tier.key)}
							<tr class="tier-row tier-row--{tier.key}">
								<td class="tier-row__badge">
									<BadgePill tier={tier.key} size="md" />
								</td>
								<td class="tier-row__criteria">{tier.criteria}</td>
								<td class="tier-row__share">{tier.revenueShare}</td>
								<td class="tier-row__support">{tier.support}</td>
								<td
									class="tier-row__check"
									aria-label={tier.featuredSlots ? 'Included' : 'Not included'}
								>
									{#if tier.featuredSlots}
										<span class="check check--yes" aria-hidden="true">✓</span>
									{:else}
										<span class="check check--no" aria-hidden="true">–</span>
									{/if}
								</td>
								<td
									class="tier-row__check"
									aria-label={tier.earlyAccess ? 'Included' : 'Not included'}
								>
									{#if tier.earlyAccess}
										<span class="check check--yes" aria-hidden="true">✓</span>
									{:else}
										<span class="check check--no" aria-hidden="true">–</span>
									{/if}
								</td>
								<td
									class="tier-row__check"
									aria-label={tier.dedicatedManager ? 'Included' : 'Not included'}
								>
									{#if tier.dedicatedManager}
										<span class="check check--yes" aria-hidden="true">✓</span>
									{:else}
										<span class="check check--no" aria-hidden="true">–</span>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</section>

	<!-- SDK FEATURE CALLOUT -->
	<section class="section code-section">
		<div class="section__inner code-inner">
			<div class="code-copy">
				<h2 class="section__title">SDK-first developer experience</h2>
				<p class="section__sub">
					The Traek SDK gives you typed primitives for custom node types, themes, and templates.
					Zero runtime dependencies. Full TypeScript support.
				</p>
				<a href="/marketplace/submit" class="btn btn--primary" style="margin-top: 12px">
					Submit your first item →
				</a>
			</div>
			<div class="code-block" aria-label="SDK example code">
				<div class="code-block__bar" aria-hidden="true">
					<span class="code-block__dot code-block__dot--red"></span>
					<span class="code-block__dot code-block__dot--yellow"></span>
					<span class="code-block__dot code-block__dot--green"></span>
					<span class="code-block__filename">my-theme/index.ts</span>
				</div>
				<pre class="code-block__pre"><code
						><span class="tok-kw">import</span> <span class="tok-brace">&#123;</span> <span
							class="tok-id">defineTheme</span
						> <span class="tok-brace">&#125;</span> <span class="tok-kw">from</span> <span
							class="tok-str">'@traek/marketplace-sdk'</span
						><span class="tok-semi">;</span>

<span class="tok-kw">export default</span> <span class="tok-fn">defineTheme</span><span
							class="tok-brace">(&#123;</span
						>
  <span class="tok-key">name</span><span class="tok-colon">:</span>    <span class="tok-str"
							>'midnight-pro'</span
						><span class="tok-semi">,</span>
  <span class="tok-key">version</span><span class="tok-colon">:</span> <span class="tok-str"
							>'1.0.0'</span
						><span class="tok-semi">,</span>
  <span class="tok-key">tokens</span><span class="tok-colon">:</span>  <span class="tok-brace"
							>&#123;</span
						>
    <span class="tok-key">background</span><span class="tok-colon">:</span> <span class="tok-str"
							>'#03030a'</span
						><span class="tok-semi">,</span>
    <span class="tok-key">accent</span><span class="tok-colon">:</span>     <span class="tok-str"
							>'#7c3aed'</span
						><span class="tok-semi">,</span>
    <span class="tok-key">surface</span><span class="tok-colon">:</span>    <span class="tok-str"
							>'#0f0f1a'</span
						><span class="tok-semi">,</span>
    <span class="tok-key">text</span><span class="tok-colon">:</span>       <span class="tok-str"
							>'#e2e8f0'</span
						><span class="tok-semi">,</span>
  <span class="tok-brace">&#125;</span><span class="tok-semi">,</span>
<span class="tok-brace">&#125;</span><span class="tok-semi">;</span></code
					></pre>
			</div>
		</div>
	</section>

	<!-- FINAL CTA -->
	<section class="section cta-section">
		<div class="section__inner cta-inner">
			<h2 class="cta__heading">Ready to ship?</h2>
			<p class="cta__sub">
				Join 1,800+ creators building the future of spatial AI interfaces. Your first submission is
				free.
			</p>
			<div class="cta__actions">
				<a href="/marketplace/submit" class="btn btn--primary btn--lg">Submit your first item →</a>
				<a href="/marketplace" class="btn btn--ghost btn--lg">Browse the marketplace</a>
			</div>
		</div>
	</section>
</div>

<style>
	/* Base */
	.page {
		background: var(--pg-bg, #080808);
		color: var(--pg-text, #f0f0f0);
		font-family: 'Space Grotesk', sans-serif;
	}

	/* Shared section */
	.section {
		padding: clamp(3rem, 8vw, 6rem) 0;
	}

	.section__inner {
		max-width: 1080px;
		margin: 0 auto;
		padding: 0 max(5vw, 1.5rem);
	}

	.section__title {
		margin: 0 0 8px;
		font-size: clamp(1.5rem, 3vw, 2.2rem);
		font-weight: 700;
		letter-spacing: -0.02em;
	}

	.section__sub {
		margin: 0 0 40px;
		font-size: 16px;
		color: var(--pg-text-secondary, #a8a8a8);
		line-height: 1.6;
	}

	/* Buttons */
	.btn {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 10px 20px;
		border-radius: 10px;
		font-size: 14px;
		font-weight: 600;
		text-decoration: none;
		transition: all 0.15s;
		cursor: pointer;
		border: none;
		font-family: inherit;
	}

	.btn--lg {
		padding: 14px 28px;
		font-size: 15px;
	}

	.btn--primary {
		background: linear-gradient(135deg, #00d8ff, #00ffa3);
		color: #080808;
	}

	.btn--primary:hover {
		opacity: 0.9;
		transform: translateY(-1px);
	}

	.btn--ghost {
		background: transparent;
		border: 1px solid var(--pg-border-strong, rgba(255, 255, 255, 0.14));
		color: var(--pg-text, #f0f0f0);
	}

	.btn--ghost:hover {
		border-color: var(--pg-border-cyan, rgba(0, 216, 255, 0.28));
		color: var(--pg-cyan, #00d8ff);
	}

	/* Hero */
	.hero {
		position: relative;
		overflow: hidden;
		padding: clamp(3rem, 8vw, 7rem) 0 clamp(4rem, 9vw, 8rem);
		border-bottom: 1px solid var(--pg-border, rgba(255, 255, 255, 0.08));
	}

	.hero__inner {
		position: relative;
		z-index: 1;
		max-width: 1080px;
		margin: 0 auto;
		padding: 0 max(5vw, 1.5rem);
	}

	.hero__eyebrow {
		margin-bottom: 20px;
	}

	.eyebrow-pill {
		display: inline-block;
		padding: 4px 12px;
		border-radius: 20px;
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		background: rgba(0, 216, 255, 0.08);
		border: 1px solid rgba(0, 216, 255, 0.25);
		color: var(--pg-cyan, #00d8ff);
	}

	.hero__heading {
		margin: 0 0 20px;
		font-size: clamp(2.4rem, 6vw, 4.5rem);
		font-weight: 800;
		letter-spacing: -0.03em;
		line-height: 1.05;
	}

	.hero__heading--gradient {
		background: linear-gradient(135deg, #00d8ff 0%, #00ffa3 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.hero__sub {
		max-width: 540px;
		margin: 0 0 32px;
		font-size: clamp(15px, 2vw, 18px);
		line-height: 1.65;
		color: var(--pg-text-secondary, #a8a8a8);
	}

	.hero__actions {
		display: flex;
		gap: 12px;
		flex-wrap: wrap;
		margin-bottom: 52px;
	}

	.hero__stats {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		margin: 0;
		padding: 20px 24px;
		background: var(--pg-bg-card, #161616);
		border: 1px solid var(--pg-border, rgba(255, 255, 255, 0.08));
		border-radius: 14px;
		max-width: 620px;
	}

	.hero__stat {
		padding: 0 24px;
		text-align: center;
		flex: 1;
		min-width: 100px;
	}

	.hero__stat:first-child {
		padding-left: 0;
	}

	.hero__stat:last-child {
		padding-right: 0;
	}

	.stat__label {
		display: block;
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--pg-text-muted, #666);
		margin-bottom: 4px;
	}

	.stat__value {
		display: block;
		font-size: 22px;
		font-weight: 700;
		letter-spacing: -0.02em;
	}

	.hero__stat-divider {
		width: 1px;
		height: 36px;
		background: var(--pg-border, rgba(255, 255, 255, 0.08));
		flex-shrink: 0;
	}

	/* Decorative grid lines */
	.hero__grid {
		position: absolute;
		inset: 0;
		z-index: 0;
		pointer-events: none;
		overflow: hidden;
	}

	.hero__grid-line {
		position: absolute;
		top: 0;
		bottom: 0;
		left: calc(var(--i) / 7 * 100%);
		width: 1px;
		background: linear-gradient(
			to bottom,
			transparent,
			rgba(0, 216, 255, 0.04) 30%,
			rgba(0, 216, 255, 0.04) 70%,
			transparent
		);
	}

	/* How it works */
	.how {
		background: var(--pg-bg-surface, #111);
		border-bottom: 1px solid var(--pg-border, rgba(255, 255, 255, 0.08));
	}

	.steps {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
	}

	.step {
		padding: 32px 36px 32px 0;
		border-right: 1px solid var(--pg-border, rgba(255, 255, 255, 0.08));
	}

	.step:last-child {
		border-right: none;
		padding-right: 0;
	}

	.step:not(:first-child) {
		padding-left: 36px;
	}

	.step__num {
		font-family: 'Space Mono', monospace;
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.1em;
		color: var(--pg-cyan, #00d8ff);
		margin-bottom: 12px;
		opacity: 0.8;
	}

	.step__title {
		margin: 0 0 10px;
		font-size: 22px;
		font-weight: 700;
		letter-spacing: -0.02em;
	}

	.step__detail {
		margin: 0;
		font-size: 14px;
		line-height: 1.65;
		color: var(--pg-text-secondary, #a8a8a8);
	}

	/* Revenue calculator */
	.calc {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 40px;
		align-items: start;
	}

	.calc__inputs {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.calc__field {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		margin-bottom: 4px;
	}

	.calc__field-label {
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--pg-text-secondary, #a8a8a8);
	}

	.calc__field-value {
		font-size: 15px;
		font-weight: 700;
		font-family: 'Space Mono', monospace;
	}

	.slider {
		appearance: none;
		-webkit-appearance: none;
		width: 100%;
		height: 4px;
		border-radius: 2px;
		background: var(--pg-border-strong, rgba(255, 255, 255, 0.14));
		outline: none;
		margin-bottom: 28px;
		cursor: pointer;
	}

	.slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: linear-gradient(135deg, #00d8ff, #00ffa3);
		cursor: pointer;
		box-shadow: 0 0 8px rgba(0, 216, 255, 0.4);
		transition: box-shadow 0.15s;
	}

	.slider::-webkit-slider-thumb:hover {
		box-shadow: 0 0 16px rgba(0, 216, 255, 0.6);
	}

	.slider::-moz-range-thumb {
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: linear-gradient(135deg, #00d8ff, #00ffa3);
		cursor: pointer;
		border: none;
		box-shadow: 0 0 8px rgba(0, 216, 255, 0.4);
	}

	.calc__result {
		background: var(--pg-bg-card, #161616);
		border: 1px solid var(--pg-border, rgba(255, 255, 255, 0.08));
		border-radius: 16px;
		padding: 28px;
	}

	.result__main {
		display: flex;
		flex-direction: column;
		gap: 4px;
		margin-bottom: 24px;
		padding-bottom: 24px;
		border-bottom: 1px solid var(--pg-border, rgba(255, 255, 255, 0.08));
	}

	.result__label {
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--pg-text-muted, #666);
	}

	.result__amount {
		font-size: clamp(2rem, 4vw, 3rem);
		font-weight: 800;
		letter-spacing: -0.03em;
		background: linear-gradient(135deg, #00d8ff, #00ffa3);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		line-height: 1;
	}

	.result__breakdown {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin-bottom: 20px;
	}

	.result__row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 14px;
	}

	.result__row-label {
		color: var(--pg-text-secondary, #a8a8a8);
	}

	.result__row-value {
		font-weight: 600;
		font-family: 'Space Mono', monospace;
		font-size: 13px;
	}

	.result__row-value--accent {
		color: var(--pg-lime, #00ffa3);
	}

	.result__row-value--muted {
		color: var(--pg-text-muted, #666);
	}

	.result__note {
		margin: 0;
		font-size: 11px;
		color: var(--pg-text-muted, #666);
		line-height: 1.5;
	}

	/* Tiers table */
	.tiers-section {
		background: var(--pg-bg-surface, #111);
		border-top: 1px solid var(--pg-border, rgba(255, 255, 255, 0.08));
		border-bottom: 1px solid var(--pg-border, rgba(255, 255, 255, 0.08));
	}

	.tiers-wrap {
		overflow-x: auto;
		border-radius: 14px;
		border: 1px solid var(--pg-border, rgba(255, 255, 255, 0.08));
	}

	.tiers-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 14px;
	}

	.tiers-table thead th {
		padding: 14px 20px;
		text-align: left;
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.07em;
		text-transform: uppercase;
		color: var(--pg-text-muted, #666);
		background: var(--pg-bg-card, #161616);
		border-bottom: 1px solid var(--pg-border, rgba(255, 255, 255, 0.08));
		white-space: nowrap;
	}

	.tiers-table thead th.tiers-table__col-label {
		width: 180px;
	}

	.tier-row td {
		padding: 16px 20px;
		border-bottom: 1px solid var(--pg-border, rgba(255, 255, 255, 0.06));
		vertical-align: middle;
		background: var(--pg-bg, #080808);
		transition: background 0.1s;
	}

	.tier-row:last-child td {
		border-bottom: none;
	}

	.tier-row:hover td {
		background: var(--pg-bg-card, #161616);
	}

	.tier-row__criteria {
		color: var(--pg-text-secondary, #a8a8a8);
		font-size: 13px;
		white-space: nowrap;
	}

	.tier-row__share {
		font-family: 'Space Mono', monospace;
		font-size: 13px;
		font-weight: 700;
		color: var(--pg-lime, #00ffa3);
	}

	.tier-row__support {
		color: var(--pg-text-secondary, #a8a8a8);
		font-size: 13px;
		white-space: nowrap;
	}

	.tier-row__check {
		text-align: center;
	}

	.check {
		font-size: 15px;
		font-weight: 700;
	}

	.check--yes {
		color: var(--pg-lime, #00ffa3);
	}
	.check--no {
		color: var(--pg-text-muted, #444);
	}

	/* Code section */
	.code-section {
		border-bottom: 1px solid var(--pg-border, rgba(255, 255, 255, 0.08));
	}

	.code-inner {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 56px;
		align-items: center;
	}

	.code-copy .section__sub {
		margin-bottom: 0;
	}

	.code-block {
		background: var(--pg-bg-card, #161616);
		border: 1px solid var(--pg-border, rgba(255, 255, 255, 0.08));
		border-radius: 14px;
		overflow: hidden;
		font-family: 'Space Mono', monospace;
	}

	.code-block__bar {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 10px 14px;
		background: rgba(255, 255, 255, 0.03);
		border-bottom: 1px solid var(--pg-border, rgba(255, 255, 255, 0.08));
	}

	.code-block__dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
	}

	.code-block__dot--red {
		background: #ff5f57;
	}
	.code-block__dot--yellow {
		background: #febc2e;
	}
	.code-block__dot--green {
		background: #28c840;
	}

	.code-block__filename {
		margin-left: 6px;
		font-size: 11px;
		color: var(--pg-text-muted, #666);
	}

	.code-block__pre {
		margin: 0;
		padding: 20px;
		overflow-x: auto;
		font-size: 13px;
		line-height: 1.7;
	}

	.code-block__pre code {
		display: block;
	}

	/* Syntax token colours */
	.tok-kw {
		color: #c792ea;
	}
	.tok-id {
		color: #82aaff;
	}
	.tok-fn {
		color: #00d8ff;
	}
	.tok-str {
		color: #c3e88d;
	}
	.tok-key {
		color: #f07178;
	}
	.tok-brace {
		color: var(--pg-text-secondary, #a8a8a8);
	}
	.tok-semi {
		color: var(--pg-text-muted, #666);
	}
	.tok-colon {
		color: var(--pg-text-muted, #666);
	}

	/* Final CTA */
	.cta-section {
		background: var(--pg-bg-surface, #111);
	}

	.cta-inner {
		text-align: center;
	}

	.cta__heading {
		margin: 0 0 12px;
		font-size: clamp(2rem, 4vw, 3.2rem);
		font-weight: 800;
		letter-spacing: -0.03em;
	}

	.cta__sub {
		margin: 0 auto 36px;
		font-size: 16px;
		color: var(--pg-text-secondary, #a8a8a8);
		max-width: 480px;
		line-height: 1.6;
	}

	.cta__actions {
		display: flex;
		gap: 12px;
		justify-content: center;
		flex-wrap: wrap;
	}

	/* Responsive */
	@media (max-width: 860px) {
		.calc {
			grid-template-columns: 1fr;
		}

		.code-inner {
			grid-template-columns: 1fr;
		}

		.steps {
			grid-template-columns: 1fr;
		}

		.step {
			border-right: none;
			border-bottom: 1px solid var(--pg-border, rgba(255, 255, 255, 0.08));
			padding: 28px 0;
		}

		.step:last-child {
			border-bottom: none;
		}

		.step:not(:first-child) {
			padding-left: 0;
		}

		.hero__stats {
			flex-direction: column;
			gap: 16px;
			padding: 20px;
		}

		.hero__stat-divider {
			width: 100%;
			height: 1px;
		}

		.hero__stat {
			padding: 0;
			text-align: left;
		}
	}
</style>
