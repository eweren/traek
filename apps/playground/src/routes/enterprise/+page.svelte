<script lang="ts">
	// ROI Calculator
	let teamSize = $state(25);
	let hoursSavedPerWeek = $state(6);
	let hourlyRate = $state(150);

	const enterpriseCostMonthly = 2000; // representative enterprise seat cost

	const monthlyRoi = $derived(() => {
		const grossSavings = teamSize * hoursSavedPerWeek * 4.33 * hourlyRate;
		return Math.round(grossSavings - enterpriseCostMonthly);
	});

	const annualRoi = $derived(() => monthlyRoi() * 12);
	const paybackWeeks = $derived(() => {
		if (monthlyRoi() <= 0) return null;
		const weeksToBreakEven = (enterpriseCostMonthly / (monthlyRoi() / 4.33)).toFixed(1);
		return weeksToBreakEven;
	});

	function formatMoney(n: number): string {
		if (Math.abs(n) >= 1_000_000) return '$' + (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
		if (Math.abs(n) >= 1_000) return '$' + (n / 1_000).toFixed(0) + 'k';
		return '$' + n.toLocaleString();
	}

	// Trust badges
	const badges = [
		{ id: 'soc2', label: 'SOC 2 Type II', sub: 'Security & Availability' },
		{ id: 'gdpr', label: 'GDPR Compliant', sub: 'EU Data Residency' },
		{ id: 'ccpa', label: 'CCPA Ready', sub: 'Consumer Privacy' },
		{ id: 'encrypt', label: 'AES-256 Encrypted', sub: 'At rest & in transit' },
		{ id: 'noai', label: 'Zero AI Training', sub: 'Your data stays yours' },
		{ id: 'uptime', label: '99.9% Uptime SLA', sub: 'Enterprise reliability' }
	];

	const features = [
		{
			category: 'Security',
			headline: 'Built for regulated industries',
			items: [
				'End-to-end encryption for all conversation data',
				'Single Sign-On (SAML 2.0, OIDC) with any IdP',
				'Role-based access control with audit logs',
				'Dedicated VPC deployment available',
				'Annual penetration tests, full report shared'
			]
		},
		{
			category: 'Compliance',
			headline: 'Governance without friction',
			items: [
				'SOC 2 Type II report on request',
				'GDPR Data Processing Agreement included',
				'CCPA-ready data deletion pipeline',
				'Custom data retention policies',
				'IP indemnification for enterprise tier'
			]
		},
		{
			category: 'Support',
			headline: 'A team that moves at your pace',
			items: [
				'4-hour response SLA for critical issues',
				'Dedicated Slack Connect channel',
				'Named customer success manager',
				'Quarterly business reviews',
				'Priority roadmap influence'
			]
		}
	];

	const slaRows = [
		{ severity: 'P0 — Critical', response: '4 hours', resolution: 'Best effort same-day' },
		{ severity: 'P1 — High', response: '8 hours', resolution: '48 hours' },
		{ severity: 'P2 — Standard', response: '24 hours', resolution: '5 business days' },
		{ severity: 'P3 — Low', response: '48 hours', resolution: 'Next release' }
	];

	const stats = [
		{ value: '99.9%', label: 'Uptime SLA' },
		{ value: '< 4h', label: 'Critical response' },
		{ value: 'AES-256', label: 'Encryption standard' },
		{ value: 'SOC 2', label: 'Type II certified' }
	];
</script>

<svelte:head>
	<title>Traek Enterprise — Spatial AI at scale</title>
</svelte:head>

<div class="page">
	<!-- HERO -->
	<section class="hero">
		<div class="hero__inner">
			<div class="hero__kicker" aria-hidden="true">
				<span class="kicker-line"></span>
				<span class="kicker-text">Enterprise Grade</span>
			</div>

			<h1 class="hero__heading">
				Spatial AI conversations,<br />
				<em class="hero__heading-em">built for teams that ship.</em>
			</h1>

			<p class="hero__sub">
				Traek Enterprise brings branching, spatial AI conversations to engineering and product teams
				— with the security, compliance, and support guarantees your org requires.
			</p>

			<div class="hero__actions">
				<a href="mailto:enterprise@gettraek.com" class="btn btn--white">
					Talk to sales
					<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
						<path
							d="M2 7h10M8 3l4 4-4 4"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</a>
				<a href="/app" class="btn btn--ghost">See it live</a>
			</div>

			<dl class="hero__stats" aria-label="Key enterprise metrics">
				{#each stats as stat (stat.label)}
					<div class="hero__stat">
						<dd class="hero__stat-value">{stat.value}</dd>
						<dt class="hero__stat-label">{stat.label}</dt>
					</div>
				{/each}
			</dl>
		</div>

		<!-- Decorative architectural lines -->
		<div class="hero__arch" aria-hidden="true">
			<div class="arch-h arch-h--1"></div>
			<div class="arch-h arch-h--2"></div>
			<div class="arch-v arch-v--1"></div>
			<div class="arch-v arch-v--2"></div>
			<div class="arch-corner arch-corner--tr"></div>
		</div>
	</section>

	<!-- TRUST BADGES -->
	<section class="section trust-section" id="security">
		<div class="section__inner">
			<h2 class="section__eyebrow">Security &amp; Compliance</h2>
			<p class="section__title-large">
				Certified, audited, and<br />ready for your security review.
			</p>

			<ul class="badges" aria-label="Security certifications">
				{#each badges as badge (badge.id)}
					<li class="badge">
						<div class="badge__icon" aria-hidden="true">
							{#if badge.id === 'soc2'}
								<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
									<path
										d="M10 2L3 5.5V10c0 3.87 3.07 7.5 7 8.45C13.93 17.5 17 13.87 17 10V5.5L10 2Z"
										stroke="currentColor"
										stroke-width="1.5"
										stroke-linejoin="round"
									/>
									<path
										d="M7 10l2 2 4-4"
										stroke="currentColor"
										stroke-width="1.5"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							{:else if badge.id === 'gdpr'}
								<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
									<circle cx="10" cy="10" r="7.5" stroke="currentColor" stroke-width="1.5" />
									<path
										d="M10 7v3l2 2"
										stroke="currentColor"
										stroke-width="1.5"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							{:else if badge.id === 'ccpa'}
								<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
									<rect
										x="4"
										y="9"
										width="12"
										height="9"
										rx="1.5"
										stroke="currentColor"
										stroke-width="1.5"
									/>
									<path
										d="M7 9V6.5a3 3 0 016 0V9"
										stroke="currentColor"
										stroke-width="1.5"
										stroke-linecap="round"
									/>
								</svg>
							{:else if badge.id === 'encrypt'}
								<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
									<path
										d="M3 10.5a7 7 0 1114 0 7 7 0 01-14 0Z"
										stroke="currentColor"
										stroke-width="1.5"
									/>
									<path
										d="M10 7.5v3h3"
										stroke="currentColor"
										stroke-width="1.5"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							{:else if badge.id === 'noai'}
								<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
									<circle cx="10" cy="10" r="7.5" stroke="currentColor" stroke-width="1.5" />
									<path
										d="M6.5 6.5l7 7M13.5 6.5l-7 7"
										stroke="currentColor"
										stroke-width="1.5"
										stroke-linecap="round"
									/>
								</svg>
							{:else}
								<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
									<polyline
										points="3,13 7,9 10,12 13,7 17,9"
										stroke="currentColor"
										stroke-width="1.5"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							{/if}
						</div>
						<div class="badge__copy">
							<span class="badge__label">{badge.label}</span>
							<span class="badge__sub">{badge.sub}</span>
						</div>
					</li>
				{/each}
			</ul>
		</div>
	</section>

	<!-- FEATURE COLUMNS -->
	<section class="section features-section">
		<div class="section__inner">
			<div class="features-grid">
				{#each features as feat (feat.category)}
					<div class="feat-col">
						<span class="feat-col__cat">{feat.category}</span>
						<h3 class="feat-col__headline">{feat.headline}</h3>
						<ul class="feat-col__list" aria-label="{feat.category} features">
							{#each feat.items as item (item)}
								<li class="feat-col__item">
									<span class="feat-col__check" aria-hidden="true">—</span>
									{item}
								</li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- ROI CALCULATOR -->
	<section class="section roi-section" id="roi">
		<div class="section__inner">
			<h2 class="section__eyebrow">ROI Calculator</h2>
			<p class="section__title-large">Calculate your team's return.</p>

			<div class="roi-layout">
				<div class="roi__inputs">
					<div class="roi__field">
						<label class="roi__field-label" for="team-size">
							<span class="roi__field-name">Team size</span>
							<span class="roi__field-val">{teamSize} developers</span>
						</label>
						<input
							id="team-size"
							type="range"
							class="roi__slider"
							min="5"
							max="500"
							step="5"
							bind:value={teamSize}
							aria-valuetext="{teamSize} developers"
						/>
						<div class="roi__field-range">
							<span>5</span>
							<span>500</span>
						</div>
					</div>

					<div class="roi__field">
						<label class="roi__field-label" for="hours-saved">
							<span class="roi__field-name">Hours saved per dev per week</span>
							<span class="roi__field-val">{hoursSavedPerWeek} hrs</span>
						</label>
						<input
							id="hours-saved"
							type="range"
							class="roi__slider"
							min="1"
							max="20"
							step="1"
							bind:value={hoursSavedPerWeek}
							aria-valuetext="{hoursSavedPerWeek} hours per week"
						/>
						<div class="roi__field-range">
							<span>1h</span>
							<span>20h</span>
						</div>
					</div>

					<div class="roi__field">
						<label class="roi__field-label" for="hourly-rate">
							<span class="roi__field-name">Avg. developer hourly cost</span>
							<span class="roi__field-val">${hourlyRate}/hr</span>
						</label>
						<input
							id="hourly-rate"
							type="range"
							class="roi__slider"
							min="50"
							max="350"
							step="10"
							bind:value={hourlyRate}
							aria-valuetext="${hourlyRate} per hour"
						/>
						<div class="roi__field-range">
							<span>$50</span>
							<span>$350</span>
						</div>
					</div>
				</div>

				<div class="roi__output" aria-live="polite" aria-atomic="true">
					<div class="roi__output-primary">
						<span class="roi__output-eyebrow">Monthly ROI</span>
						<span class="roi__output-num">{formatMoney(monthlyRoi())}</span>
					</div>

					<div class="roi__output-secondary">
						<div class="roi__output-row">
							<span class="roi__output-row-label">Annual return</span>
							<span class="roi__output-row-val">{formatMoney(annualRoi())}</span>
						</div>
						<div class="roi__output-row">
							<span class="roi__output-row-label">Hours reclaimed / month</span>
							<span class="roi__output-row-val"
								>{Math.round(teamSize * hoursSavedPerWeek * 4.33).toLocaleString()}h</span
							>
						</div>
						<div class="roi__output-row">
							<span class="roi__output-row-label">Enterprise plan (est.)</span>
							<span class="roi__output-row-val roi__output-row-val--muted"
								>{formatMoney(enterpriseCostMonthly)}/mo</span
							>
						</div>
						{#if paybackWeeks()}
							<div class="roi__output-row roi__output-row--payback">
								<span class="roi__output-row-label">Break-even</span>
								<span class="roi__output-row-val roi__output-row-val--accent"
									>{paybackWeeks()} weeks</span
								>
							</div>
						{/if}
					</div>

					<p class="roi__disclaimer">
						Estimates based on productivity research. Actual results vary.
					</p>

					<a href="mailto:enterprise@gettraek.com" class="roi__cta">
						Get a custom ROI analysis →
					</a>
				</div>
			</div>
		</div>
	</section>

	<!-- SLA TABLE -->
	<section class="section sla-section" id="support">
		<div class="section__inner">
			<h2 class="section__eyebrow">Support SLAs</h2>
			<p class="section__title-large">
				We commit to response times<br />in writing.
			</p>

			<div class="sla-wrap">
				<table class="sla-table" aria-label="Support SLA tiers">
					<thead>
						<tr>
							<th scope="col">Severity</th>
							<th scope="col">First response</th>
							<th scope="col">Target resolution</th>
						</tr>
					</thead>
					<tbody>
						{#each slaRows as row (row.severity)}
							<tr class="sla-row" class:sla-row--p0={row.severity.startsWith('P0')}>
								<td class="sla-row__severity">{row.severity}</td>
								<td class="sla-row__response">{row.response}</td>
								<td class="sla-row__resolution">{row.resolution}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<p class="sla-note">
				All enterprise customers receive a dedicated Slack Connect channel and named customer
				success manager. SLAs are contractually backed.
			</p>
		</div>
	</section>

	<!-- FINAL CTA -->
	<section class="section cta-section">
		<div class="section__inner cta-inner">
			<div class="cta__copy">
				<h2 class="cta__heading">Ready to evaluate Traek?</h2>
				<p class="cta__sub">
					We'll set up a proof-of-concept for your team within 48 hours. No procurement red tape
					until you're sure it's right.
				</p>
			</div>
			<div class="cta__actions">
				<a href="mailto:enterprise@gettraek.com" class="btn btn--white btn--lg">
					Talk to sales →
				</a>
				<a href="/app" class="btn btn--ghost btn--lg">Try the product</a>
			</div>
		</div>
	</section>
</div>

<style>
	/* ── Page base ── */
	.page {
		background: #050505;
		color: var(--pg-text, #f0f0f0);
		font-family: 'Space Grotesk', sans-serif;
	}

	/* ── Shared section ── */
	.section {
		padding: clamp(4rem, 9vw, 7rem) 0;
	}

	.section__inner {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 max(5vw, 2rem);
	}

	.section__eyebrow {
		display: block;
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--pg-cyan, #00d8ff);
		margin-bottom: 16px;
	}

	.section__title-large {
		margin: 0 0 52px;
		font-family: 'Playfair Display', Georgia, serif;
		font-size: clamp(1.8rem, 3.5vw, 2.8rem);
		font-weight: 700;
		letter-spacing: -0.02em;
		line-height: 1.2;
		color: var(--pg-text-strong, #fff);
	}

	/* ── Buttons ── */
	.btn {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 11px 22px;
		border-radius: 8px;
		font-size: 14px;
		font-weight: 600;
		text-decoration: none;
		transition: all 0.15s;
		border: none;
		cursor: pointer;
		font-family: inherit;
		letter-spacing: -0.01em;
	}

	.btn--lg {
		padding: 14px 28px;
		font-size: 15px;
	}

	.btn--white {
		background: #f0f0f0;
		color: #050505;
	}

	.btn--white:hover {
		background: #fff;
		transform: translateY(-1px);
	}

	.btn--ghost {
		background: transparent;
		border: 1px solid rgba(255, 255, 255, 0.12);
		color: var(--pg-text-secondary, #a8a8a8);
	}

	.btn--ghost:hover {
		border-color: rgba(255, 255, 255, 0.24);
		color: var(--pg-text, #f0f0f0);
	}

	/* ── Hero ── */
	.hero {
		position: relative;
		overflow: hidden;
		padding: clamp(4rem, 10vw, 9rem) 0 clamp(4rem, 8vw, 7rem);
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
	}

	.hero__inner {
		position: relative;
		z-index: 1;
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 max(5vw, 2rem);
	}

	.hero__kicker {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 28px;
	}

	.kicker-line {
		display: block;
		width: 32px;
		height: 1px;
		background: var(--pg-cyan, #00d8ff);
	}

	.kicker-text {
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--pg-cyan, #00d8ff);
	}

	.hero__heading {
		margin: 0 0 24px;
		font-family: 'Playfair Display', Georgia, serif;
		font-size: clamp(2.4rem, 5.5vw, 5rem);
		font-weight: 700;
		letter-spacing: -0.03em;
		line-height: 1.05;
		max-width: 14ch;
	}

	.hero__heading-em {
		font-style: italic;
		color: var(--pg-text-secondary, #a8a8a8);
	}

	.hero__sub {
		max-width: 52ch;
		margin: 0 0 36px;
		font-size: clamp(15px, 2vw, 17px);
		line-height: 1.7;
		color: var(--pg-text-secondary, #a8a8a8);
	}

	.hero__actions {
		display: flex;
		gap: 12px;
		flex-wrap: wrap;
		margin-bottom: 60px;
	}

	.hero__stats {
		display: flex;
		gap: 0;
		flex-wrap: wrap;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.hero__stat {
		padding: 0 48px 0 0;
		border-right: 1px solid rgba(255, 255, 255, 0.08);
		margin-right: 48px;
	}

	.hero__stat:last-child {
		border-right: none;
		margin-right: 0;
	}

	.hero__stat-value {
		display: block;
		font-family: 'Space Mono', monospace;
		font-size: clamp(1.4rem, 2.5vw, 2rem);
		font-weight: 700;
		letter-spacing: -0.02em;
		color: var(--pg-text-strong, #fff);
		margin-bottom: 4px;
	}

	.hero__stat-label {
		display: block;
		font-size: 11px;
		font-weight: 500;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--pg-text-muted, #666);
	}

	/* Architectural decorative elements */
	.hero__arch {
		position: absolute;
		inset: 0;
		pointer-events: none;
		z-index: 0;
	}

	.arch-h,
	.arch-v {
		position: absolute;
		background: rgba(255, 255, 255, 0.03);
	}

	.arch-h {
		left: 0;
		right: 0;
		height: 1px;
	}

	.arch-h--1 {
		top: 30%;
	}
	.arch-h--2 {
		top: 70%;
	}

	.arch-v {
		top: 0;
		bottom: 0;
		width: 1px;
	}

	.arch-v--1 {
		left: 60%;
	}
	.arch-v--2 {
		left: 80%;
	}

	.arch-corner {
		position: absolute;
		width: 60px;
		height: 60px;
	}

	.arch-corner--tr {
		top: 15%;
		right: 12%;
		border-top: 1px solid rgba(0, 216, 255, 0.15);
		border-right: 1px solid rgba(0, 216, 255, 0.15);
	}

	/* ── Trust badges ── */
	.trust-section {
		background: rgba(255, 255, 255, 0.015);
		border-top: 1px solid rgba(255, 255, 255, 0.06);
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
	}

	.badges {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1px;
		background: rgba(255, 255, 255, 0.06);
		border: 1px solid rgba(255, 255, 255, 0.06);
		border-radius: 14px;
		overflow: hidden;
	}

	.badge {
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 24px 28px;
		background: #0a0a0a;
		transition: background 0.15s;
	}

	.badge:hover {
		background: #111;
	}

	.badge__icon {
		flex-shrink: 0;
		width: 36px;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 8px;
		background: rgba(0, 216, 255, 0.06);
		border: 1px solid rgba(0, 216, 255, 0.15);
		color: var(--pg-cyan, #00d8ff);
	}

	.badge__copy {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.badge__label {
		font-size: 14px;
		font-weight: 600;
		color: var(--pg-text, #f0f0f0);
		letter-spacing: -0.01em;
	}

	.badge__sub {
		font-size: 11px;
		color: var(--pg-text-muted, #666);
		letter-spacing: 0.02em;
	}

	/* ── Features ── */
	.features-section {
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
	}

	.features-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 48px;
	}

	.feat-col__cat {
		display: block;
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--pg-cyan, #00d8ff);
		margin-bottom: 12px;
	}

	.feat-col__headline {
		margin: 0 0 24px;
		font-family: 'Playfair Display', Georgia, serif;
		font-size: clamp(1.1rem, 2vw, 1.5rem);
		font-weight: 700;
		letter-spacing: -0.02em;
		line-height: 1.2;
		color: var(--pg-text-strong, #fff);
	}

	.feat-col__list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.feat-col__item {
		display: flex;
		gap: 10px;
		font-size: 14px;
		line-height: 1.5;
		color: var(--pg-text-secondary, #a8a8a8);
	}

	.feat-col__check {
		color: rgba(255, 255, 255, 0.2);
		flex-shrink: 0;
		font-family: 'Space Mono', monospace;
		font-size: 12px;
		margin-top: 1px;
	}

	/* ── ROI Calculator ── */
	.roi-section {
		background: rgba(255, 255, 255, 0.015);
		border-top: 1px solid rgba(255, 255, 255, 0.06);
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
	}

	.roi-layout {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 64px;
		align-items: start;
	}

	.roi__inputs {
		display: flex;
		flex-direction: column;
		gap: 32px;
	}

	.roi__field-label {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		margin-bottom: 12px;
		cursor: default;
	}

	.roi__field-name {
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--pg-text-muted, #666);
	}

	.roi__field-val {
		font-family: 'Space Mono', monospace;
		font-size: 14px;
		font-weight: 700;
		color: var(--pg-text, #f0f0f0);
	}

	.roi__slider {
		appearance: none;
		-webkit-appearance: none;
		width: 100%;
		height: 2px;
		border-radius: 1px;
		background: rgba(255, 255, 255, 0.1);
		outline: none;
		cursor: pointer;
	}

	.roi__slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: #f0f0f0;
		cursor: pointer;
		transition: box-shadow 0.15s;
	}

	.roi__slider::-webkit-slider-thumb:hover {
		box-shadow: 0 0 0 4px rgba(240, 240, 240, 0.15);
	}

	.roi__slider::-moz-range-thumb {
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: #f0f0f0;
		cursor: pointer;
		border: none;
	}

	.roi__field-range {
		display: flex;
		justify-content: space-between;
		margin-top: 6px;
		font-size: 10px;
		color: var(--pg-text-muted, #666);
		font-family: 'Space Mono', monospace;
	}

	/* ROI output card */
	.roi__output {
		background: #0a0a0a;
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 16px;
		padding: 36px;
	}

	.roi__output-primary {
		margin-bottom: 28px;
		padding-bottom: 28px;
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
	}

	.roi__output-eyebrow {
		display: block;
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--pg-text-muted, #666);
		margin-bottom: 8px;
	}

	.roi__output-num {
		display: block;
		font-family: 'Playfair Display', Georgia, serif;
		font-size: clamp(2.5rem, 5vw, 4rem);
		font-weight: 700;
		letter-spacing: -0.03em;
		color: var(--pg-text-strong, #fff);
		line-height: 1;
	}

	.roi__output-secondary {
		display: flex;
		flex-direction: column;
		gap: 14px;
		margin-bottom: 24px;
	}

	.roi__output-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 14px;
	}

	.roi__output-row-label {
		color: var(--pg-text-secondary, #a8a8a8);
	}

	.roi__output-row-val {
		font-family: 'Space Mono', monospace;
		font-size: 13px;
		font-weight: 700;
		color: var(--pg-text, #f0f0f0);
	}

	.roi__output-row-val--muted {
		color: var(--pg-text-muted, #666);
	}

	.roi__output-row-val--accent {
		color: var(--pg-lime, #00ffa3);
	}

	.roi__output-row--payback {
		padding-top: 14px;
		border-top: 1px solid rgba(255, 255, 255, 0.06);
		margin-top: 4px;
	}

	.roi__disclaimer {
		margin: 0 0 20px;
		font-size: 11px;
		color: var(--pg-text-muted, #666);
		line-height: 1.5;
	}

	.roi__cta {
		display: block;
		text-align: center;
		padding: 12px;
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		font-size: 13px;
		font-weight: 600;
		color: var(--pg-text, #f0f0f0);
		text-decoration: none;
		transition: all 0.15s;
		letter-spacing: -0.01em;
	}

	.roi__cta:hover {
		border-color: rgba(255, 255, 255, 0.22);
		background: rgba(255, 255, 255, 0.04);
	}

	/* ── SLA table ── */
	.sla-section {
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
	}

	.sla-wrap {
		overflow-x: auto;
		border-radius: 12px;
		border: 1px solid rgba(255, 255, 255, 0.08);
		margin-bottom: 24px;
	}

	.sla-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 14px;
	}

	.sla-table thead th {
		padding: 14px 24px;
		text-align: left;
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--pg-text-muted, #666);
		background: #0a0a0a;
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
		white-space: nowrap;
	}

	.sla-row td {
		padding: 18px 24px;
		border-bottom: 1px solid rgba(255, 255, 255, 0.04);
		background: #050505;
		transition: background 0.1s;
		vertical-align: middle;
	}

	.sla-row:last-child td {
		border-bottom: none;
	}

	.sla-row:hover td {
		background: #0a0a0a;
	}

	.sla-row--p0 td {
		background: rgba(0, 216, 255, 0.02);
	}

	.sla-row--p0:hover td {
		background: rgba(0, 216, 255, 0.04);
	}

	.sla-row__severity {
		font-weight: 600;
		font-size: 13px;
		color: var(--pg-text, #f0f0f0);
	}

	.sla-row--p0 .sla-row__severity {
		color: var(--pg-cyan, #00d8ff);
	}

	.sla-row__response {
		font-family: 'Space Mono', monospace;
		font-size: 13px;
		font-weight: 700;
		color: var(--pg-text, #f0f0f0);
	}

	.sla-row__resolution {
		color: var(--pg-text-secondary, #a8a8a8);
		font-size: 13px;
	}

	.sla-note {
		margin: 0;
		font-size: 13px;
		color: var(--pg-text-muted, #666);
		line-height: 1.6;
		max-width: 64ch;
	}

	/* ── CTA ── */
	.cta-section {
		background: #0a0a0a;
		border-top: 1px solid rgba(255, 255, 255, 0.06);
	}

	.cta-inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 40px;
		flex-wrap: wrap;
	}

	.cta__heading {
		margin: 0 0 12px;
		font-family: 'Playfair Display', Georgia, serif;
		font-size: clamp(1.6rem, 3vw, 2.4rem);
		font-weight: 700;
		letter-spacing: -0.02em;
	}

	.cta__sub {
		margin: 0;
		font-size: 15px;
		color: var(--pg-text-secondary, #a8a8a8);
		max-width: 46ch;
		line-height: 1.6;
	}

	.cta__actions {
		display: flex;
		gap: 12px;
		flex-wrap: wrap;
		flex-shrink: 0;
	}

	/* ── Responsive ── */
	@media (max-width: 900px) {
		.features-grid {
			grid-template-columns: 1fr;
			gap: 40px;
		}

		.roi-layout {
			grid-template-columns: 1fr;
			gap: 40px;
		}

		.badges {
			grid-template-columns: repeat(2, 1fr);
		}

		.cta-inner {
			flex-direction: column;
			align-items: flex-start;
		}

		.hero__stat {
			padding-right: 24px;
			margin-right: 24px;
		}
	}

	@media (max-width: 540px) {
		.badges {
			grid-template-columns: 1fr;
		}

		.hero__stats {
			flex-direction: column;
			gap: 20px;
		}

		.hero__stat {
			border-right: none;
			margin-right: 0;
			padding-right: 0;
		}
	}
</style>
