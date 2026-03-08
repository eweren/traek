<script lang="ts">
	import type { ConversationSnapshot } from '../persistence/schemas';
	import { countBranchPoints, getConversationPreview } from './exportExtended';

	interface Props {
		snapshot: ConversationSnapshot;
		/** Optional share URL shown at the bottom of the card */
		shareUrl?: string;
		/** Width of the card in pixels (for OG image sizing) */
		width?: number;
	}

	let { snapshot, shareUrl, width = 1200 }: Props = $props();

	const title = $derived(snapshot.title ?? 'Untitled Conversation');
	const nodeCount = $derived(snapshot.nodes.length);
	const branchCount = $derived(countBranchPoints(snapshot));
	const preview = $derived(getConversationPreview(snapshot, 160));
	const createdAt = $derived(
		new Date(snapshot.createdAt).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		})
	);

	/** Last few messages for the mini-preview strip */
	const recentMessages = $derived(
		snapshot.nodes.filter((n) => n.role !== 'system' && n.content.trim()).slice(-3)
	);
</script>

<!--
  SharePreviewCard — renders a visually rich preview card.

  Designed at 1200×630 (standard OG image ratio) but fully responsive.
  Use this component as:
  - A server-side rendered OG image (via Svelte SSR + sharp/resvg)
  - An in-app share sheet preview
  - A screenshot target for share URL thumbnails
-->
<div
	class="card"
	style:width="{width}px"
	role="img"
	aria-label="Traek conversation preview for: {title}"
>
	<!-- Background grid pattern -->
	<div class="grid-bg" aria-hidden="true"></div>

	<!-- Top bar: logo + date -->
	<div class="topbar">
		<div class="logo">
			<span class="logo-mark">T</span>
			<span class="logo-text">Traek</span>
		</div>
		<span class="date">{createdAt}</span>
	</div>

	<!-- Main content -->
	<div class="body">
		<h1 class="title">{title}</h1>

		{#if preview}
			<p class="preview">{preview}{preview.length >= 160 ? '…' : ''}</p>
		{/if}

		<!-- Mini message strip -->
		{#if recentMessages.length > 0}
			<div class="message-strip" aria-hidden="true">
				{#each recentMessages as node (node.id)}
					<div class="msg msg-{node.role}">
						<span class="msg-role">{node.role === 'user' ? 'You' : 'AI'}</span>
						<span class="msg-content"
							>{node.content.trim().slice(0, 80)}{node.content.trim().length > 80 ? '…' : ''}</span
						>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Bottom bar: stats + URL -->
	<div class="footer">
		<div class="stats">
			<span class="stat">
				<span class="stat-value">{nodeCount}</span>
				<span class="stat-label">messages</span>
			</span>
			{#if branchCount > 0}
				<span class="stat-sep">·</span>
				<span class="stat">
					<span class="stat-value">{branchCount}</span>
					<span class="stat-label">branch{branchCount !== 1 ? 'es' : ''}</span>
				</span>
			{/if}
		</div>
		{#if shareUrl}
			<span class="share-url">{shareUrl}</span>
		{/if}
	</div>
</div>

<style>
	.card {
		position: relative;
		height: 630px;
		background: #070708;
		color: #e4e4e7;
		font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		border-radius: 16px;
	}

	/* Dot grid background */
	.grid-bg {
		position: absolute;
		inset: 0;
		background-image: radial-gradient(circle, #1e1e22 1px, transparent 1px);
		background-size: 28px 28px;
		opacity: 0.6;
		pointer-events: none;
	}

	/* Cyan glow in top-right */
	.card::before {
		content: '';
		position: absolute;
		top: -120px;
		right: -80px;
		width: 480px;
		height: 480px;
		background: radial-gradient(circle, rgba(0, 216, 255, 0.12), transparent 70%);
		pointer-events: none;
	}

	/* Orange glow in bottom-left */
	.card::after {
		content: '';
		position: absolute;
		bottom: -100px;
		left: -60px;
		width: 360px;
		height: 360px;
		background: radial-gradient(circle, rgba(255, 68, 0, 0.08), transparent 70%);
		pointer-events: none;
	}

	.topbar {
		position: relative;
		z-index: 1;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 36px 48px 0;
	}

	.logo {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.logo-mark {
		width: 36px;
		height: 36px;
		background: #00d8ff;
		color: #000;
		font-weight: 800;
		font-size: 18px;
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.logo-text {
		font-size: 20px;
		font-weight: 700;
		color: #fff;
		letter-spacing: -0.02em;
	}

	.date {
		font-size: 14px;
		color: #52525b;
	}

	.body {
		position: relative;
		z-index: 1;
		flex: 1;
		padding: 40px 48px 24px;
		display: flex;
		flex-direction: column;
		gap: 20px;
		overflow: hidden;
	}

	.title {
		font-size: 48px;
		font-weight: 800;
		line-height: 1.1;
		letter-spacing: -0.03em;
		color: #fff;
		margin: 0;
		/* Two-line clamp */
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		line-clamp: 2;
		overflow: hidden;
	}

	.preview {
		font-size: 18px;
		line-height: 1.6;
		color: #71717a;
		margin: 0;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		line-clamp: 2;
		overflow: hidden;
	}

	.message-strip {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin-top: auto;
	}

	.msg {
		display: flex;
		align-items: baseline;
		gap: 10px;
		font-size: 14px;
		line-height: 1.4;
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.07);
		border-radius: 8px;
		padding: 10px 14px;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.msg-role {
		font-size: 10px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		flex-shrink: 0;
	}

	.msg-user .msg-role {
		color: #00d8ff;
	}

	.msg-assistant .msg-role {
		color: #ff4400;
	}

	.msg-content {
		color: #a1a1aa;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.footer {
		position: relative;
		z-index: 1;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20px 48px 36px;
		border-top: 1px solid rgba(255, 255, 255, 0.06);
	}

	.stats {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.stat {
		display: flex;
		align-items: baseline;
		gap: 4px;
	}

	.stat-value {
		font-size: 20px;
		font-weight: 700;
		color: #fff;
	}

	.stat-label {
		font-size: 13px;
		color: #52525b;
	}

	.stat-sep {
		color: #3f3f46;
		font-size: 16px;
	}

	.share-url {
		font-size: 13px;
		color: #3f3f46;
		font-family: ui-monospace, 'Cascadia Code', monospace;
	}
</style>
