<script lang="ts">
	/**
	 * Item 9: ChildSelector Bottom-Sheet
	 * Zeigt alle Kinder des aktuellen Nodes zur Auswahl
	 */

	import type { Node, MessageNode } from '../TraekEngine.svelte';

	let {
		children,
		onSelect,
		onClose
	}: {
		children: Node[];
		onSelect: (nodeId: string) => void;
		onClose: () => void;
	} = $props();

	function handleBackdropClick(e: MouseEvent | KeyboardEvent) {
		if (e.target === e.currentTarget) {
			onClose();
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			onClose();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div
	class="child-selector-overlay"
	role="dialog"
	aria-modal="true"
	aria-labelledby="selector-title"
>
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="selector-backdrop" onclick={handleBackdropClick}></div>

	<div class="selector-content">
		<!-- Drag Handle -->
		<div class="drag-handle" aria-hidden="true"></div>

		<h3 id="selector-title">Welche Fortsetzung?</h3>
		<p class="selector-hint">Es gibt {children.length} Antworten. Wähle eine:</p>

		<div class="children-list" role="list">
			{#each children as child, i}
				<button class="child-option" onclick={() => onSelect(child.id)}>
					<span class="option-number">{i + 1}</span>
					<div class="option-content">
						<span class="option-role">{child.role === 'user' ? '👤 User' : '🤖 Assistant'}</span>
						<span class="option-preview">
							{(child as MessageNode).content?.slice(0, 80) ?? 'Nachricht'}
							{(child as MessageNode).content && (child as MessageNode).content.length > 80
								? '...'
								: ''}
						</span>
					</div>
				</button>
			{/each}
		</div>

		<button class="cancel-button" onclick={onClose}>Abbrechen</button>
	</div>
</div>

<style>
	.child-selector-overlay {
		position: fixed;
		inset: 0;
		z-index: 500;
		display: flex;
		align-items: flex-end;
		justify-content: center;
	}

	.selector-backdrop {
		position: absolute;
		inset: 0;
		background: rgba(0, 0, 0, 0.6);
		animation: backdropFade 0.2s ease;
	}

	@keyframes backdropFade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.selector-content {
		position: relative;
		width: 100%;
		max-height: 70vh;
		background: var(--traek-input-bg, rgba(30, 30, 30, 0.95));
		backdrop-filter: blur(16px);
		border-top: 1px solid var(--traek-input-border, #444444);
		border-radius: 24px 24px 0 0;
		padding: 24px 16px;
		padding-bottom: max(24px, env(safe-area-inset-bottom));
		color: var(--traek-node-text, #dddddd);
		animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
	}

	@keyframes slideUp {
		from {
			transform: translateY(100%);
		}
		to {
			transform: translateY(0);
		}
	}

	.drag-handle {
		position: absolute;
		top: 8px;
		left: 50%;
		transform: translateX(-50%);
		width: 40px;
		height: 4px;
		background: var(--traek-input-context-text, #888888);
		border-radius: 2px;
		opacity: 0.5;
	}

	.selector-content h3 {
		font-size: 20px;
		font-weight: 600;
		margin-bottom: 8px;
		margin-top: 12px;
	}

	.selector-hint {
		font-size: 14px;
		color: var(--traek-input-context-text, #888888);
		margin-bottom: 16px;
	}

	.children-list {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin-bottom: 16px;
		max-height: 50vh;
		overflow-y: auto;
		overscroll-behavior: contain;
	}

	.child-option {
		display: flex;
		align-items: flex-start;
		gap: 12px;
		padding: 14px 16px;
		min-height: 60px;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 12px;
		text-align: left;
		color: var(--traek-node-text, #dddddd);
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.child-option:hover,
	.child-option:focus-visible {
		background: rgba(255, 255, 255, 0.1);
		border-color: var(--traek-input-dot, #00d8ff);
		transform: translateX(4px);
	}

	.child-option:active {
		transform: translateX(4px) scale(0.98);
	}

	.option-number {
		flex-shrink: 0;
		width: 28px;
		height: 28px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--traek-input-dot, #00d8ff);
		color: var(--traek-input-button-text, #000000);
		border-radius: 50%;
		font-size: 14px;
		font-weight: 600;
	}

	.option-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.option-role {
		font-size: 12px;
		color: var(--traek-input-context-text, #888888);
		font-weight: 600;
	}

	.option-preview {
		font-size: 14px;
		line-height: 1.4;
		overflow: hidden;
		display: -webkit-box;
		line-clamp: 2;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.cancel-button {
		width: 100%;
		padding: 14px;
		min-height: 48px;
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 12px;
		color: var(--traek-node-text, #dddddd);
		font-size: 16px;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.cancel-button:hover {
		background: rgba(255, 255, 255, 0.15);
	}

	.cancel-button:active {
		transform: scale(0.98);
	}

	@media (prefers-reduced-motion: reduce) {
		.selector-content {
			animation: none;
		}
		.child-option:hover {
			transform: none;
		}
	}
</style>
