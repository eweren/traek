<script lang="ts">
	import { SvelteMap } from 'svelte/reactivity';
	import type { ConversationSnapshot, SerializedNode } from '../persistence/schemas';

	interface Props {
		snapshot: ConversationSnapshot;
		/** Optional title override */
		title?: string;
		/** Max threads to render (default: all) */
		maxThreads?: number;
		/** Show the Traek branding footer */
		showFooter?: boolean;
		/** Link back to the original conversation */
		shareUrl?: string;
	}

	let { snapshot, title, maxThreads, showFooter = true, shareUrl }: Props = $props();

	const resolvedTitle = $derived(title ?? snapshot.title ?? 'Conversation');
	const createdAt = $derived(
		new Date(snapshot.createdAt).toLocaleDateString('en-US', {
			month: 'long',
			day: 'numeric',
			year: 'numeric'
		})
	);

	// Build node map and extract threads
	const nodeMap = $derived.by(() => {
		const map = new SvelteMap<string, SerializedNode>();
		for (const node of snapshot.nodes) map.set(node.id, node);
		return map;
	});

	const threads = $derived.by(() => {
		const roots = snapshot.nodes.filter((n) => n.parentIds.length === 0);
		const result: SerializedNode[][] = [];

		function dfs(node: SerializedNode, path: SerializedNode[]): void {
			const newPath = [...path, node];
			const children = Array.from(nodeMap.values()).filter((n) => n.parentIds.includes(node.id));
			if (children.length === 0) {
				result.push(newPath);
			} else {
				for (const child of children) dfs(child, newPath);
			}
		}

		for (const root of roots) dfs(root, []);
		return maxThreads !== undefined ? result.slice(0, maxThreads) : result;
	});

	function roleLabel(role: string): string {
		if (role === 'user') return 'You';
		if (role === 'assistant') return 'Assistant';
		return 'System';
	}
</script>

<!--
  TraekEmbed — a read-only, iframe-friendly conversation viewer.

  Designed to be self-contained: it uses only inline styles or scoped CSS,
  and has no interactive controls. Safe to embed in an <iframe>.

  Usage:
    <iframe src="/embed/conv-id" style="border:none; width:100%; height:600px;" />
-->
<div class="traek-embed" role="document" aria-label="Conversation: {resolvedTitle}">
	<header class="embed-header">
		<div class="embed-title-row">
			<span class="embed-logo" aria-hidden="true">T</span>
			<h1 class="embed-title">{resolvedTitle}</h1>
		</div>
		<span class="embed-meta">{createdAt} · {snapshot.nodes.length} messages</span>
	</header>

	{#if threads.length === 0}
		<div class="embed-empty">No messages yet.</div>
	{:else if threads.length === 1}
		<!-- Single thread: render as a simple conversation -->
		<div class="embed-thread single-thread">
			{#each threads[0] as node (node.id)}
				<div class="embed-message" data-role={node.role}>
					<div class="embed-role-label">{roleLabel(node.role)}</div>
					<div class="embed-content">{node.content.trim() || '(empty)'}</div>
				</div>
			{/each}
		</div>
	{:else}
		<!-- Multiple branches: show each as a numbered thread -->
		<div class="embed-threads">
			{#each threads as thread, idx (idx)}
				<details class="embed-thread-details" open={idx === 0}>
					<summary class="embed-thread-summary">
						<span class="embed-branch-label">Branch {idx + 1}</span>
						<span class="embed-branch-count">{thread.length} messages</span>
					</summary>
					<div class="embed-thread">
						{#each thread as node (node.id)}
							<div class="embed-message" data-role={node.role}>
								<div class="embed-role-label">{roleLabel(node.role)}</div>
								<div class="embed-content">{node.content.trim() || '(empty)'}</div>
							</div>
						{/each}
					</div>
				</details>
			{/each}
		</div>
	{/if}

	{#if showFooter}
		<footer class="embed-footer">
			{#if shareUrl}
				<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
				<a href={shareUrl} target="_blank" rel="noopener noreferrer" class="embed-open-link">
					Open in Traek →
				</a>
			{/if}
			<span class="embed-branding">
				<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
				Powered by <a href="https://traek.dev" target="_blank" rel="noopener noreferrer">Traek</a>
			</span>
		</footer>
	{/if}
</div>

<style>
	/* Self-contained styles — safe in iframe context */
	.traek-embed {
		font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif;
		font-size: 14px;
		line-height: 1.6;
		color: #e4e4e7;
		background: #0e0e10;
		border: 1px solid #1f1f24;
		border-radius: 12px;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.embed-header {
		padding: 16px 20px 14px;
		border-bottom: 1px solid #1f1f24;
		background: #111113;
		flex-shrink: 0;
	}

	.embed-title-row {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-bottom: 4px;
	}

	.embed-logo {
		width: 22px;
		height: 22px;
		background: #00d8ff;
		color: #000;
		font-size: 12px;
		font-weight: 800;
		border-radius: 5px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.embed-title {
		margin: 0;
		font-size: 15px;
		font-weight: 600;
		color: #f4f4f5;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.embed-meta {
		font-size: 11px;
		color: #52525b;
	}

	.embed-thread,
	.embed-threads {
		flex: 1;
		overflow-y: auto;
		padding: 16px 20px;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.embed-message {
		padding: 10px 14px;
		border-radius: 8px;
		background: #111113;
		border: 1px solid #1f1f24;
	}

	.embed-message[data-role='user'] {
		border-left: 3px solid #00d8ff;
	}

	.embed-message[data-role='assistant'] {
		border-left: 3px solid #ff4400;
	}

	.embed-role-label {
		font-size: 10px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.07em;
		margin-bottom: 6px;
		color: #52525b;
	}

	.embed-message[data-role='user'] .embed-role-label {
		color: #00d8ff;
	}

	.embed-message[data-role='assistant'] .embed-role-label {
		color: #ff4400;
	}

	.embed-content {
		color: #d4d4d8;
		white-space: pre-wrap;
		word-break: break-word;
		font-size: 13px;
	}

	.embed-empty {
		padding: 32px 20px;
		color: #52525b;
		text-align: center;
		font-size: 13px;
	}

	/* Branch details */
	.embed-thread-details {
		border: 1px solid #1f1f24;
		border-radius: 8px;
		overflow: hidden;
	}

	.embed-thread-summary {
		padding: 10px 14px;
		background: #111113;
		cursor: pointer;
		list-style: none;
		display: flex;
		justify-content: space-between;
		align-items: center;
		user-select: none;
	}

	.embed-thread-summary::-webkit-details-marker {
		display: none;
	}

	.embed-branch-label {
		font-size: 12px;
		font-weight: 600;
		color: #a1a1aa;
	}

	.embed-branch-count {
		font-size: 11px;
		color: #52525b;
	}

	.embed-thread-details .embed-thread {
		flex: none;
		overflow: visible;
		padding: 12px 14px;
	}

	/* Footer */
	.embed-footer {
		padding: 10px 20px;
		border-top: 1px solid #1f1f24;
		background: #0c0c0e;
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-shrink: 0;
	}

	.embed-open-link {
		font-size: 12px;
		color: #00d8ff;
		text-decoration: none;
		font-weight: 500;
	}

	.embed-open-link:hover {
		text-decoration: underline;
	}

	.embed-branding {
		font-size: 11px;
		color: #3f3f46;
	}

	.embed-branding a {
		color: #52525b;
		text-decoration: none;
	}

	.embed-branding a:hover {
		color: #71717a;
	}
</style>
