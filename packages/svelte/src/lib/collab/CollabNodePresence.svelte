<script lang="ts">
	import type { CollabProvider, PresenceState } from '@traek/collab';
	import type { Snippet } from 'svelte';

	let {
		provider,
		nodeId,
		children
	}: {
		provider: CollabProvider;
		/** The node ID to watch. Peers with this as their activeNodeId will be shown. */
		nodeId: string;
		/** The node content — wrapped with presence indicators. */
		children: Snippet;
	} = $props();

	let activePeers = $state<PresenceState[]>([]);

	$effect(() => {
		function refresh(peers: Map<number, PresenceState>) {
			activePeers = [...peers.values()].filter((p) => p.activeNodeId === nodeId);
		}
		refresh(provider.peers);
		const unsub = provider.onPresenceChange(refresh);
		return unsub;
	});

	function initials(name: string): string {
		return name
			.split(' ')
			.slice(0, 2)
			.map((w) => w[0]?.toUpperCase() ?? '')
			.join('');
	}
</script>

<!--
	CollabNodePresence — wraps a node with a coloured ring and avatar badges when
	one or more remote peers have that node active (i.e. are typing/editing it).

	Usage: Wrap the node renderer inside this component and pass the same nodeId.

	<CollabNodePresence {provider} {nodeId}>
	  <TextNode ... />
	</CollabNodePresence>
-->
<div
	class="node-presence-wrapper"
	class:has-active-peers={activePeers.length > 0}
	style:--presence-color={activePeers[0]?.user.color ?? 'transparent'}
>
	{@render children()}

	{#if activePeers.length > 0}
		<!-- Peer avatar strip in the top-right corner of the node -->
		<div class="peer-badges" aria-label="Collaborators editing this node">
			{#each activePeers as peer (peer.user.id)}
				<div
					class="peer-badge"
					style:background={peer.user.color}
					title="{peer.user.name} is editing"
					role="img"
					aria-label="{peer.user.name} is editing"
				>
					{initials(peer.user.name)}
					<!-- Animated typing dots -->
					<span class="typing-dots" aria-hidden="true">
						<span></span><span></span><span></span>
					</span>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.node-presence-wrapper {
		position: relative;
		border-radius: inherit;
	}

	/* Glowing ring in the peer's colour when active */
	.node-presence-wrapper.has-active-peers {
		outline: 2px solid var(--presence-color);
		outline-offset: 2px;
		border-radius: 6px;
	}

	/* Avatar strip — absolutely positioned top-right */
	.peer-badges {
		position: absolute;
		top: -10px;
		right: 8px;
		display: flex;
		gap: 3px;
		z-index: 10;
		pointer-events: none;
	}

	.peer-badge {
		display: flex;
		align-items: center;
		gap: 4px;
		height: 20px;
		padding: 0 6px 0 4px;
		border-radius: 10px;
		font-size: 9px;
		font-weight: 700;
		color: #fff;
		letter-spacing: 0.02em;
		white-space: nowrap;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
		line-height: 1;
	}

	/* Three animated dots for "typing" feedback */
	.typing-dots {
		display: flex;
		gap: 2px;
		align-items: center;
	}

	.typing-dots span {
		width: 3px;
		height: 3px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.8);
		animation: typing-bounce 1s ease-in-out infinite;
	}

	.typing-dots span:nth-child(2) {
		animation-delay: 0.15s;
	}

	.typing-dots span:nth-child(3) {
		animation-delay: 0.3s;
	}

	@keyframes typing-bounce {
		0%,
		60%,
		100% {
			transform: translateY(0);
			opacity: 0.6;
		}
		30% {
			transform: translateY(-3px);
			opacity: 1;
		}
	}
</style>
