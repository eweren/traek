<script lang="ts">
	import type { PageData } from './$types.js';

	let { data }: { data: PageData } = $props();

	const { profile, licenses, assignedSeats, stats, justUpgraded } = data;

	let newSeatEmail = $state('');
	let addingSeat = $state(false);
	let addSeatError = $state('');
	let addSeatSuccess = $state('');

	const trialEndDate = $derived(
		profile.trialEndsAt ? new Date(profile.trialEndsAt).toLocaleDateString() : null
	);
	const seatUsagePct = $derived(
		stats.totalSeats > 0 ? Math.min(100, (stats.assignedSeatCount / stats.totalSeats) * 100) : 0
	);
	const activeLicense = $derived(
		licenses.find((l) => !l.revoked_at && new Date(l.valid_until) > new Date()) ?? null
	);

	async function addSeat(e: Event) {
		e.preventDefault();
		const email = newSeatEmail.trim();
		if (!email) return;
		addingSeat = true;
		addSeatError = '';
		addSeatSuccess = '';

		const res = await fetch('/api/enterprise/seats', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, licenseId: activeLicense?.id })
		});
		const json = await res.json();
		addingSeat = false;

		if (!res.ok) {
			addSeatError = json.error ?? 'Failed to add seat';
		} else {
			addSeatSuccess = `${email} added successfully.`;
			newSeatEmail = '';
		}
	}

	async function revokeSeat(seatId: string, email: string) {
		if (!confirm(`Remove ${email} from this enterprise plan?`)) return;
		const res = await fetch(`/api/enterprise/seats/${seatId}`, { method: 'DELETE' });
		if (res.ok) {
			location.reload();
		}
	}
</script>

<svelte:head>
	<title>Enterprise Admin — Traek</title>
</svelte:head>

<div class="admin">
	<div class="admin__header">
		<div>
			<h1 class="admin__title">Enterprise Admin</h1>
			<p class="admin__sub">Manage seats, licenses, and usage for your organization.</p>
		</div>
		<a href="/app" class="btn btn--ghost btn--sm">← Back to app</a>
	</div>

	{#if justUpgraded}
		<div class="banner banner--success" role="status">
			Welcome to Traek Enterprise! Your plan is now active.
			{#if trialEndDate}
				Your 14-day trial runs until {trialEndDate}.
			{/if}
		</div>
	{/if}

	{#if trialEndDate}
		<div class="banner banner--info" role="status">
			Trial active — billing starts on {trialEndDate}. Contact
			<a href="mailto:enterprise@gettraek.com">enterprise@gettraek.com</a> to discuss annual contract
			terms.
		</div>
	{/if}

	<!-- Stats -->
	<section class="section">
		<h2 class="section__title">Overview</h2>
		<div class="stats-grid">
			<div class="stat-card">
				<span class="stat-card__num">{stats.assignedSeatCount}</span>
				<span class="stat-card__label">Seats assigned</span>
			</div>
			<div class="stat-card">
				<span class="stat-card__num">{stats.totalSeats}</span>
				<span class="stat-card__label">Total seats</span>
			</div>
			<div class="stat-card">
				<span class="stat-card__num">{stats.totalSeats - stats.assignedSeatCount}</span>
				<span class="stat-card__label">Seats available</span>
			</div>
			<div class="stat-card">
				<span class="stat-card__num">{stats.conversationCount.toLocaleString()}</span>
				<span class="stat-card__label">Conversations</span>
			</div>
		</div>

		<!-- Seat usage bar -->
		<div class="usage-bar-wrap">
			<div class="usage-bar-labels">
				<span>Seat usage</span>
				<span>{stats.assignedSeatCount} / {stats.totalSeats}</span>
			</div>
			<div
				class="usage-bar"
				role="progressbar"
				aria-valuenow={seatUsagePct}
				aria-valuemin={0}
				aria-valuemax={100}
			>
				<div class="usage-bar__fill" style:width="{seatUsagePct}%"></div>
			</div>
		</div>
	</section>

	<!-- Seat management -->
	<section class="section">
		<h2 class="section__title">Seat Management</h2>

		{#if activeLicense}
			<form class="add-seat-form" onsubmit={addSeat}>
				<label for="new-seat-email" class="sr-only">Email address</label>
				<input
					id="new-seat-email"
					type="email"
					bind:value={newSeatEmail}
					placeholder="colleague@company.com"
					class="input"
					required
				/>
				<button type="submit" class="btn btn--primary" disabled={addingSeat}>
					{addingSeat ? 'Adding…' : 'Add seat'}
				</button>
			</form>

			{#if addSeatError}
				<p class="form-msg form-msg--error" role="alert">{addSeatError}</p>
			{/if}
			{#if addSeatSuccess}
				<p class="form-msg form-msg--success" role="status">{addSeatSuccess}</p>
			{/if}

			{#if assignedSeats.length > 0}
				<table class="seats-table">
					<thead>
						<tr>
							<th scope="col">Email</th>
							<th scope="col">Assigned</th>
							<th scope="col">Actions</th>
						</tr>
					</thead>
					<tbody>
						{#each assignedSeats as seat (seat.id)}
							<tr>
								<td class="seat-email">{seat.email}</td>
								<td class="seat-date">{new Date(seat.assigned_at).toLocaleDateString()}</td>
								<td>
									<button
										type="button"
										class="btn btn--ghost btn--xs btn--danger"
										onclick={() => revokeSeat(seat.id, seat.email)}
									>
										Remove
									</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			{:else}
				<p class="empty-state">No seats assigned yet. Add team members above.</p>
			{/if}
		{:else}
			<p class="empty-state">No active license found. Contact support.</p>
		{/if}
	</section>

	<!-- Licenses -->
	{#if licenses.length > 0}
		<section class="section">
			<h2 class="section__title">License Keys</h2>
			<div class="licenses-list">
				{#each licenses as license (license.id)}
					<div class="license-card" class:license-card--revoked={!!license.revoked_at}>
						<div class="license-card__key">
							<code>{license.license_key}</code>
							<span
								class="license-badge"
								class:license-badge--active={!license.revoked_at &&
									new Date(license.valid_until) > new Date()}
							>
								{license.revoked_at
									? 'Revoked'
									: new Date(license.valid_until) < new Date()
										? 'Expired'
										: 'Active'}
							</span>
						</div>
						<div class="license-card__meta">
							<span>{license.seats} seats</span>
							<span>Valid until {new Date(license.valid_until).toLocaleDateString()}</span>
						</div>
					</div>
				{/each}
			</div>
		</section>
	{/if}

	<!-- Support -->
	<section class="section">
		<h2 class="section__title">Enterprise Support</h2>
		<p class="support-text">
			Your plan includes a 4-hour SLA for critical issues and a dedicated customer success manager.
		</p>
		<div class="support-actions">
			<a href="mailto:enterprise@gettraek.com" class="btn btn--primary"> Open support ticket → </a>
			<a href="/enterprise#support" class="btn btn--ghost">View SLA details</a>
		</div>
	</section>
</div>

<style>
	.admin {
		max-width: 900px;
		margin: 0 auto;
		padding: 48px max(5vw, 24px);
		color: var(--pg-text, #f0f0f0);
		font-family: 'Space Grotesk', system-ui, sans-serif;
	}

	.admin__header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 16px;
		flex-wrap: wrap;
		margin-bottom: 32px;
	}

	.admin__title {
		margin: 0 0 6px;
		font-size: clamp(1.4rem, 3vw, 2rem);
		font-weight: 700;
		letter-spacing: -0.02em;
	}

	.admin__sub {
		margin: 0;
		font-size: 14px;
		color: var(--pg-text-muted, #888);
	}

	/* Section */
	.section {
		margin-bottom: 48px;
	}

	.section__title {
		margin: 0 0 20px;
		font-size: 13px;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--pg-text-muted, #888);
		padding-bottom: 12px;
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
	}

	/* Banners */
	.banner {
		padding: 14px 20px;
		border-radius: 10px;
		font-size: 14px;
		margin-bottom: 28px;
		line-height: 1.5;
	}

	.banner--success {
		background: rgba(0, 255, 163, 0.06);
		border: 1px solid rgba(0, 255, 163, 0.2);
		color: #00ffa3;
	}

	.banner--info {
		background: rgba(0, 216, 255, 0.06);
		border: 1px solid rgba(0, 216, 255, 0.2);
		color: var(--pg-text, #f0f0f0);
	}

	.banner--info a {
		color: var(--pg-cyan, #00d8ff);
	}

	/* Stats */
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 16px;
		margin-bottom: 24px;
	}

	@media (max-width: 600px) {
		.stats-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	.stat-card {
		padding: 20px;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.07);
		border-radius: 10px;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.stat-card__num {
		font-size: 1.8rem;
		font-weight: 700;
		letter-spacing: -0.03em;
		line-height: 1;
		color: var(--pg-text-strong, #fff);
	}

	.stat-card__label {
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--pg-text-muted, #888);
	}

	/* Usage bar */
	.usage-bar-wrap {
		margin-top: 8px;
	}

	.usage-bar-labels {
		display: flex;
		justify-content: space-between;
		font-size: 12px;
		color: var(--pg-text-muted, #888);
		margin-bottom: 8px;
	}

	.usage-bar {
		height: 6px;
		background: rgba(255, 255, 255, 0.07);
		border-radius: 3px;
		overflow: hidden;
	}

	.usage-bar__fill {
		height: 100%;
		background: var(--pg-cyan, #00d8ff);
		border-radius: 3px;
		transition: width 0.3s ease;
	}

	/* Add seat form */
	.add-seat-form {
		display: flex;
		gap: 10px;
		margin-bottom: 16px;
		flex-wrap: wrap;
	}

	.input {
		flex: 1;
		min-width: 220px;
		padding: 10px 14px;
		border-radius: 8px;
		border: 1px solid rgba(255, 255, 255, 0.1);
		background: rgba(255, 255, 255, 0.04);
		color: var(--pg-text, #f0f0f0);
		font-size: 14px;
		font-family: inherit;
		outline: none;
		transition: border-color 0.15s;
	}

	.input:focus {
		border-color: var(--pg-cyan, #00d8ff);
	}

	.form-msg {
		font-size: 13px;
		margin: 0 0 12px;
	}

	.form-msg--error {
		color: #f87171;
	}

	.form-msg--success {
		color: #00ffa3;
	}

	/* Seats table */
	.seats-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 14px;
	}

	.seats-table thead th {
		text-align: left;
		padding: 10px 16px;
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--pg-text-muted, #888);
		background: rgba(255, 255, 255, 0.02);
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
	}

	.seats-table tbody tr {
		border-bottom: 1px solid rgba(255, 255, 255, 0.04);
	}

	.seats-table tbody tr:hover td {
		background: rgba(255, 255, 255, 0.02);
	}

	.seats-table td {
		padding: 14px 16px;
	}

	.seat-email {
		font-weight: 500;
		color: var(--pg-text, #f0f0f0);
	}

	.seat-date {
		color: var(--pg-text-muted, #888);
		font-size: 13px;
	}

	/* License cards */
	.licenses-list {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.license-card {
		padding: 16px 20px;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.07);
		border-radius: 10px;
	}

	.license-card--revoked {
		opacity: 0.5;
	}

	.license-card__key {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 8px;
	}

	.license-card__key code {
		font-family: 'Space Mono', monospace;
		font-size: 13px;
		color: var(--pg-text, #f0f0f0);
		word-break: break-all;
	}

	.license-badge {
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		padding: 2px 8px;
		border-radius: 4px;
		background: rgba(255, 255, 255, 0.06);
		color: var(--pg-text-muted, #888);
		flex-shrink: 0;
	}

	.license-badge--active {
		background: rgba(0, 255, 163, 0.1);
		color: #00ffa3;
	}

	.license-card__meta {
		display: flex;
		gap: 20px;
		font-size: 12px;
		color: var(--pg-text-muted, #888);
	}

	/* Support */
	.support-text {
		margin: 0 0 20px;
		font-size: 14px;
		color: var(--pg-text-secondary, #a8a8a8);
		line-height: 1.6;
	}

	.support-actions {
		display: flex;
		gap: 12px;
		flex-wrap: wrap;
	}

	/* Buttons */
	.btn {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 10px 20px;
		border-radius: 8px;
		font-size: 14px;
		font-weight: 600;
		text-decoration: none;
		font-family: inherit;
		cursor: pointer;
		border: none;
		transition: all 0.15s;
		letter-spacing: -0.01em;
	}

	.btn--sm {
		padding: 7px 14px;
		font-size: 13px;
	}

	.btn--xs {
		padding: 4px 10px;
		font-size: 12px;
	}

	.btn--primary {
		background: var(--pg-text, #f0f0f0);
		color: #050505;
	}

	.btn--primary:hover {
		background: #fff;
	}

	.btn--primary:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn--ghost {
		background: transparent;
		border: 1px solid rgba(255, 255, 255, 0.1);
		color: var(--pg-text-secondary, #a8a8a8);
	}

	.btn--ghost:hover {
		border-color: rgba(255, 255, 255, 0.22);
		color: var(--pg-text, #f0f0f0);
	}

	.btn--danger:hover {
		border-color: rgba(248, 113, 113, 0.5);
		color: #f87171;
	}

	.empty-state {
		font-size: 14px;
		color: var(--pg-text-muted, #888);
		padding: 24px 0;
		margin: 0;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border-width: 0;
	}
</style>
