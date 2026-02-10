<script lang="ts">
	import { page } from '$app/state';
	import TraekCanvas from '$lib/TraekCanvas.svelte';
	import {
		DefaultLoadingOverlay,
		TraekEngine,
		DEFAULT_TRACK_ENGINE_CONFIG,
		type MessageNode,
		type AddNodePayload
	} from '$lib';
	import ExampleCustomComponent from '$lib/ExampleCustomComponent.svelte';
	import ImageDemoNode from '$lib/ImageDemoNode.svelte';
	import {
		getConversation,
		saveConversation,
		titleFromNodes,
		type SavedConversation,
		type SavedViewport
	} from '$lib/demo-persistence';

	const id = $derived(page.params.id);

	let engine = $state<TraekEngine | null>(null);
	let conv = $state<SavedConversation | null>(null);
	let error = $state<string | null>(null);
	/** Latest viewport from TraekCanvas (for persist). */
	let lastViewport = $state<SavedViewport | null>(null);
	let viewportPersistTimeout = 0;
	// Demo-only: multi-action tool selection for the input bar
	const TOOL_OPTIONS = [
		{ id: 'debug', label: 'Debug node', icon: '🧪' },
		{ id: 'image', label: 'Image', icon: '🖼️' },
		{ id: 'repeat', label: 'Just repeat', icon: '🔁' }
	] as const;
	type ToolId = (typeof TOOL_OPTIONS)[number]['id'];
	let selectedActions = $state<ToolId[]>([]);
	let toolsOverlayOpen = $state(false);

	$effect(() => {
		if (!toolsOverlayOpen) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') toolsOverlayOpen = false;
		};
		document.addEventListener('keydown', onKey);
		return () => document.removeEventListener('keydown', onKey);
	});

	function scheduleViewportPersist() {
		if (viewportPersistTimeout) clearTimeout(viewportPersistTimeout);
		viewportPersistTimeout = window.setTimeout(() => {
			viewportPersistTimeout = 0;
			if (engine) persist(engine);
		}, 600);
	}

	// Load or create conversation and hydrate engine
	$effect(() => {
		const currentId = id;
		if (!currentId) return;
		const data = getConversation(currentId);
		if (data) {
			conv = data;
			const e = new TraekEngine(DEFAULT_TRACK_ENGINE_CONFIG);
			if (data.nodes.length > 0) {
				e.addNodes(data.nodes);

				// Re-attach custom UI components for special node types loaded from persistence.
				for (const n of e.nodes) {
					// Image demo nodes: render with ImageDemoNode component.
					if (n.type === 'image') {
						(n as any).component = ImageDemoNode;
						(n as any).props = {};
					}
				}
			}
			// Restore last focused node (reply context)
			if (data.activeNodeId != null) {
				const exists = data.nodes.some((n) => n.id === data.activeNodeId);
				if (exists) {
					e.activeNodeId = data.activeNodeId;
					e.focusOnNode(data.activeNodeId);
				}
			}
			engine = e;
			error = null;
		} else {
			const now = Date.now();
			conv = {
				id: currentId,
				title: 'New chat',
				createdAt: now,
				updatedAt: now,
				nodes: []
			};
			saveConversation(conv);
			engine = new TraekEngine(DEFAULT_TRACK_ENGINE_CONFIG);
			error = null;
		}
	});

	function pathToUserNode(eng: TraekEngine, userNode: MessageNode): MessageNode[] {
		const path: MessageNode[] = [];
		let current: MessageNode | undefined = userNode;
		while (current) {
			path.unshift(current);
			current = eng.nodes.find((n) => n.id === current!.parentId) as MessageNode | undefined;
		}
		return path;
	}

	function nodesToPayloads(nodes: MessageNode[]): AddNodePayload[] {
		return nodes.map((n) => ({
			id: n.id,
			parentId: n.parentId,
			content: n.content ?? '',
			role: n.role,
			type: n.type,
			status: n.status,
			errorMessage: n.errorMessage,
			metadata: n.metadata,
			data: n.data
		}));
	}

	function persist(eng: TraekEngine) {
		if (!conv || !id) return;
		const nodes = nodesToPayloads(eng.nodes);
		const title = titleFromNodes(nodes);
		saveConversation({
			...conv,
			title,
			updatedAt: Date.now(),
			nodes,
			viewport: lastViewport ?? conv.viewport,
			activeNodeId: eng.activeNodeId
		});
		conv = {
			...conv,
			title,
			updatedAt: Date.now(),
			nodes,
			viewport: lastViewport ?? conv.viewport,
			activeNodeId: eng.activeNodeId
		};
	}

	async function onSendMessage(input: string, userNode: MessageNode, action?: string | string[]) {
		const eng = engine;
		if (!eng || !conv || !id) return;

		const selected = Array.isArray(action) ? (action as string[]) : action ? [action] : [];

		// --- Demo-only actions based on selected tools ---
		if (selected.includes('debug')) {
			eng.addCustomNode(ExampleCustomComponent, {}, 'system', {
				parentId: userNode.id,
				type: 'debugNode'
			});
		}

		if (selected.includes('image')) {
			const imageNode = eng.addCustomNode(ImageDemoNode, {}, 'assistant', {
				parentId: userNode.id,
				type: 'image',
				data: {
					prompt: input,
					status: 'loading'
				}
			});

			// Fire-and-forget image generation so chat can stream in parallel
			(async () => {
				try {
					const res = await fetch('/api/image', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ prompt: input })
					});
					if (!res.ok) {
						const errJson = await res.json().catch(() => ({}));
						const message =
							(errJson as { error?: string })?.error ?? `Image request failed (${res.status})`;
						eng.updateNode(imageNode.id, {
							data: {
								prompt: input,
								status: 'error',
								error: message
							}
						});
						persist(eng);
						return;
					}

					const data = (await res.json()) as { dataUrl?: string };
					if (!data.dataUrl) {
						eng.updateNode(imageNode.id, {
							data: {
								prompt: input,
								status: 'error',
								error: 'No image URL returned'
							}
						});
						persist(eng);
						return;
					}

					eng.updateNode(imageNode.id, {
						data: {
							prompt: input,
							imageUrl: data.dataUrl,
							status: 'done'
						}
					});
					persist(eng);
				} catch (e) {
					eng.updateNode(imageNode.id, {
						data: {
							prompt: input,
							status: 'error',
							error: e instanceof Error ? e.message : 'Unexpected error while generating image'
						}
					});
					persist(eng);
				}
			})();
		}

		if (selected.includes('repeat')) {
			eng.addNode(`🔁 ${input}`, 'assistant', {
				parentId: userNode.id
			});
		}

		// --- Main chat completion path (unchanged) ---
		const path = pathToUserNode(eng, userNode);
		const messages = path.map((n) => ({
			role: n.role,
			content: (n.content ?? '').trim()
		}));

		const responseNode = eng.addNode('', 'assistant', {
			parentId: userNode.id,
			autofocus: true
		});
		const thoughtNode = eng.addNode('Thinking...', 'assistant', {
			type: 'thought',
			parentId: responseNode.id
		});
		eng.updateNode(responseNode.id, { status: 'streaming' });

		function setThinkingDone() {
			eng?.updateNode(thoughtNode.id, { content: 'Done' });
		}

		try {
			const res = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ messages })
			});

			if (!res.ok) {
				setThinkingDone();
				const err = await res.json().catch(() => ({ error: res.statusText }));
				const data = err as { error?: string; retryAfter?: number };
				let msg = data.error ?? 'Request failed';
				if (res.status === 429 && data.retryAfter != null) {
					const hours = Math.ceil(data.retryAfter / 3600);
					msg += hours > 0 ? ` Try again in ${hours} hour(s).` : ' Try again later.';
				}
				eng.updateNode(responseNode.id, {
					status: 'error',
					errorMessage: msg
				});
				persist(eng);
				return;
			}

			const reader = res.body?.getReader();
			if (!reader) {
				setThinkingDone();
				eng.updateNode(responseNode.id, { status: 'done' });
				persist(eng);
				return;
			}

			const decoder = new TextDecoder();
			let content = '';
			let thinkingDone = false;
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				content += decoder.decode(value, { stream: true });
				if (!thinkingDone && content.length > 0) {
					thinkingDone = true;
					setThinkingDone();
				}
				eng.updateNode(responseNode.id, { content });
			}
			if (!thinkingDone) setThinkingDone();
			eng.updateNode(responseNode.id, { status: 'done' });
		} catch (e) {
			setThinkingDone();
			eng.updateNode(responseNode.id, {
				status: 'error',
				errorMessage: e instanceof Error ? e.message : 'Stream failed'
			});
		}
		persist(eng);
	}
</script>

{#if error}
	<p class="error">{error}</p>
{/if}

{#if engine}
	<div class="chat-layout">
		<a href="/demo" class="back">← Back to list</a>
		<div class="canvas-wrap">
			<TraekCanvas
				{engine}
				config={DEFAULT_TRACK_ENGINE_CONFIG}
				initialScale={conv?.viewport?.scale}
				initialOffset={conv?.viewport
					? { x: conv.viewport.offsetX, y: conv.viewport.offsetY }
					: undefined}
				{onSendMessage}
				onNodesChanged={() => engine && persist(engine)}
				onViewportChange={(v) => {
					lastViewport = { scale: v.scale, offsetX: v.offset.x, offsetY: v.offset.y };
					scheduleViewportPersist();
				}}
			>
				{#snippet initialOverlay()}
					<DefaultLoadingOverlay />
				{/snippet}

				{#snippet inputActions(ctx)}
					<div class="context-info">
						{#if ctx.activeNode}
							<span class="dot"></span> Reply linked to selected message
						{:else}
							<span class="dot gray"></span> New thread in center
						{/if}
					</div>
					<form
						class="input-wrapper"
						onsubmit={(e) => {
							e.preventDefault();
							ctx.sendMessage({
								actions: selectedActions,
								data: { actions: selectedActions }
							});
						}}
					>
						<div class="tools-trigger-wrap">
							<button
								type="button"
								class="tools-trigger"
								aria-label="Choose tools"
								aria-expanded={toolsOverlayOpen}
								onclick={() => (toolsOverlayOpen = !toolsOverlayOpen)}
							>
								<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
									<path
										fill="currentColor"
										d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1 0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z"
									/>
								</svg>
								{#if selectedActions.length > 0}
									<span class="tools-badge">{selectedActions.length}</span>
								{/if}
							</button>
							{#if toolsOverlayOpen}
								<div
									class="tools-overlay-backdrop"
									role="presentation"
									onclick={() => (toolsOverlayOpen = false)}
								></div>
								<div class="tools-overlay" role="dialog" aria-label="Select tools">
									{#each TOOL_OPTIONS as tool}
										<button
											type="button"
											class="tool-option"
											class:selected={selectedActions.includes(tool.id)}
											onclick={() => {
												selectedActions = selectedActions.includes(tool.id)
													? selectedActions.filter((a) => a !== tool.id)
													: [...selectedActions, tool.id];
											}}
										>
											<span class="tool-option-icon">{tool.icon}</span>
											<span class="tool-option-label">{tool.label}</span>
										</button>
									{/each}
								</div>
							{/if}
						</div>
						<input
							value={ctx.userInput}
							oninput={(e) => ctx.setUserInput((e.currentTarget as HTMLInputElement).value)}
							placeholder="Ask the expert…"
							spellcheck="false"
						/>
						<button
							type="submit"
							disabled={!ctx.userInput.trim() || selectedActions.length === 0}
							aria-label="Send message"
						>
							<svg viewBox="0 0 24 24" width="18" height="18"
								><path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg
							>
						</button>
					</form>
				{/snippet}
			</TraekCanvas>
		</div>
	</div>
{:else}
	<div class="loading">
		<div class="loading-spinner" aria-hidden="true"></div>
		<p class="loading-text">Loading…</p>
	</div>
{/if}

<style>
	.chat-layout {
		position: fixed;
		inset: 0;
		display: flex;
		flex-direction: column;
		background: var(--traek-conv-bg, #fafafa);
	}
	.back {
		position: absolute;
		top: 0.75rem;
		left: 1rem;
		z-index: 10;
		padding: 0.4rem 0.75rem;
		background: var(--traek-conv-back-bg, #0b0b0b);
		border-radius: 0.25rem;
		color: var(--traek-conv-back-text, #dddddd);
		text-decoration: none;
		font-size: 0.9rem;
	}
	.canvas-wrap {
		flex: 1;
		min-height: 0;
	}
	.error {
		color: var(--traek-error-text, #cc0000);
		padding: 1rem;
	}

	.loading {
		position: fixed;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1.25rem;
		background: var(--traek-loading-bg, #0b0b0b);
		animation: loading-fade 0.3s ease-out;
	}
	@keyframes loading-fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	.loading-spinner {
		width: 2rem;
		height: 2rem;
		border: 2px solid var(--traek-spinner-border, rgba(255, 255, 255, 0.12));
		border-top-color: var(--traek-spinner-top, #888888);
		border-radius: 50%;
		animation: loading-spin 0.7s linear infinite;
	}
	@keyframes loading-spin {
		to {
			transform: rotate(360deg);
		}
	}
	.loading-text {
		margin: 0;
		color: var(--traek-loading-text, #888888);
		font-size: 0.95rem;
		letter-spacing: 0.02em;
	}

	/* Mirror TraekCanvas floating input styles for the demo */
	:global(.floating-input-container) {
		position: fixed;
		bottom: 20px;
		left: 50%;
		transform: translateX(-50%);
		width: 100%;
		max-width: calc(min(600px, 100vw) - 3rem);
		z-index: 100;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
	}

	:global(.floating-input-container .input-wrapper) {
		width: 100%;
		background: var(--traek-input-bg, rgba(30, 30, 30, 0.8));
		backdrop-filter: blur(20px);
		border: 1px solid var(--traek-input-border, #444444);
		border-radius: 16px;
		display: flex;
		padding: 8px 12px;
		box-shadow: 0 20px 40px var(--traek-input-shadow, rgba(0, 0, 0, 0.4));
	}

	:global(.floating-input-container input) {
		flex: 1;
		background: transparent;
		border: none;
		color: white;
		padding: 12px;
		outline: none;
		font-size: 16px;
	}

	:global(.floating-input-container button[type='submit']) {
		background: var(--traek-input-button-bg, #00d8ff);
		color: var(--traek-input-button-text, #000000);
		border: none;
		width: 40px;
		height: 40px;
		border-radius: 10px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: transform 0.1s;
	}

	:global(.floating-input-container button[type='submit']:hover:not(:disabled)) {
		transform: scale(1.05);
	}

	:global(.floating-input-container button[type='submit']:disabled) {
		opacity: 0.3;
		cursor: not-allowed;
	}

	:global(.floating-input-container .context-info) {
		font-size: 12px;
		color: var(--traek-input-context-text, #888888);
		display: flex;
		align-items: center;
		gap: 6px;
		background: var(--traek-input-context-bg, rgba(0, 0, 0, 0.4));
		padding: 4px 12px;
		border-radius: 20px;
	}

	:global(.floating-input-container .dot) {
		width: 8px;
		height: 8px;
		background: var(--traek-input-dot, #00d8ff);
		border-radius: 50%;
	}

	:global(.floating-input-container .dot.gray) {
		background: var(--traek-input-dot-muted, #555555);
	}

	/* Tools trigger + overlay (snippet is rendered inside TraekCanvas, so use :global) */
	:global(.tools-trigger-wrap) {
		position: relative;
		display: flex;
		align-items: center;
	}
	:global(.tools-trigger) {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		border: none;
		border-radius: 10px;
		background: rgba(255, 255, 255, 0.08);
		color: #888888;
		cursor: pointer;
		transition:
			background 0.15s,
			color 0.15s;
	}
	:global(.tools-trigger:hover) {
		background: rgba(255, 255, 255, 0.12);
		color: #00d8ff;
	}
	:global(.tools-trigger[aria-expanded='true']) {
		background: rgba(0, 216, 255, 0.15);
		color: #00d8ff;
	}
	:global(.tools-badge) {
		position: absolute;
		top: 4px;
		right: 4px;
		min-width: 14px;
		height: 14px;
		padding: 0 4px;
		border-radius: 7px;
		background: #00d8ff;
		color: #000;
		font-size: 10px;
		font-weight: 600;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	:global(.tools-overlay-backdrop) {
		position: fixed;
		inset: 0;
		z-index: 99;
		background: transparent;
	}
	:global(.tools-overlay) {
		position: fixed;
		left: 50%;
		transform: translateX(-50%);
		bottom: 72px;
		z-index: 100;
		min-width: 200px;
		padding: 8px;
		background: rgba(30, 30, 30, 0.98);
		backdrop-filter: blur(20px);
		border: 1px solid #444444;
		border-radius: 12px;
		box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	:global(.tool-option) {
		display: flex;
		align-items: center;
		gap: 10px;
		width: 100%;
		padding: 10px 12px;
		border: none;
		border-radius: 8px;
		background: transparent;
		color: #dddddd;
		font-size: 14px;
		text-align: left;
		cursor: pointer;
		transition: background 0.15s;
	}
	:global(.tool-option:hover) {
		background: rgba(255, 255, 255, 0.06);
	}
	:global(.tool-option.selected) {
		background: rgba(0, 216, 255, 0.12);
		color: #00d8ff;
	}
	:global(.tool-option-icon) {
		font-size: 1.1em;
	}
	:global(.tool-option-label) {
		flex: 1;
	}
</style>
