/**
 * useCollab — Svelte 5 reactive wrapper around {@link CollabProvider}.
 *
 * Returns a reactive object whose `status` and `peers` properties update
 * automatically when the provider emits events. The provider is created once
 * and destroyed when the component calling useCollab is torn down.
 *
 * @example
 * ```svelte
 * <script lang="ts">
 *   import { useCollab, useFollowMode } from '@traek/svelte'
 *   import { assignColor } from '@traek/collab'
 *
 *   let { engine } = $props()
 *
 *   const collab = useCollab(engine, {
 *     serverUrl: 'wss://collab.gettraek.com',
 *     roomId: 'conv-abc123',
 *     user: { id: 'u1', name: 'Alice', color: assignColor('u1') },
 *   })
 *
 *   const follow = useFollowMode(collab, ({ x, y, nodeId }) => {
 *     // pan viewport to canvas position x/y, or focus the given nodeId
 *   })
 * </script>
 *
 * <CollabStatusIndicator provider={collab.provider} />
 * <CollabPresenceBubbles provider={collab.provider} onPeerClick={follow.followPeer} />
 * <CollabCursorsOverlay provider={collab.provider} scale={viewport.scale} offset={viewport.offset} />
 * ```
 */

import { SvelteMap } from 'svelte/reactivity';
import { CollabProvider } from '@traek/collab';
import type { CollabConfig, CollabStatus, PresenceState } from '@traek/collab';

/**
 * Minimal structural interface accepted as the engine parameter.
 * Both @traek/core and @traek/svelte TraekEngine satisfy this shape.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TraekEngine = Record<string, any>;

export interface CollabHandle {
	/** The underlying provider instance. Pass to collab UI components. */
	readonly provider: CollabProvider;
	/** Reactive WebSocket connection status. */
	readonly status: CollabStatus;
	/** Reactive map of connected peers (excludes local user). */
	readonly peers: Map<number, PresenceState>;
	/** Update the local cursor position (call on pointermove in canvas space). */
	updateCursor(pos: { x: number; y: number } | null): void;
	/** Update the locally active node (call when engine.activeNodeId changes). */
	updateActiveNode(nodeId: string | null): void;
	/** Force a reconnect attempt (e.g. after network recovery). */
	reconnect(): void;
	/** Disconnect without destroying the provider. */
	disconnect(): void;
}

/**
 * Viewport target emitted by follow mode when the followed peer moves.
 * Consumers should pan/zoom the canvas to show this position.
 */
export interface FollowTarget {
	/** Canvas-space X coordinate of the peer's cursor (may be undefined if peer has no cursor). */
	x: number | null;
	/** Canvas-space Y coordinate of the peer's cursor (may be undefined if peer has no cursor). */
	y: number | null;
	/** The node the peer is currently focused on, if any. */
	nodeId: string | null;
	/** The peer being followed. */
	peer: PresenceState;
}

export interface FollowModeHandle {
	/** The userId of the currently followed peer, or null if not following anyone. */
	readonly followingUserId: string | null;
	/** Start following a peer — the onViewportChange callback fires on each presence update. */
	followPeer(peer: PresenceState): void;
	/** Stop following the current peer. */
	stopFollowing(): void;
}

/**
 * useFollowMode — adds viewport-follow behaviour on top of a {@link CollabHandle}.
 *
 * When following a peer, `onViewportChange` is called whenever that peer's
 * presence updates. Use it to pan/zoom the canvas to keep the peer in view.
 *
 * Must be called during component initialisation (same restrictions as useCollab).
 *
 * @example
 * ```svelte
 * const follow = useFollowMode(collab, ({ x, y, nodeId }) => {
 *   if (nodeId) engine.focusOnNode(nodeId)
 *   else if (x !== null && y !== null) viewport.panTo(x, y)
 * })
 * // Pass follow.followPeer to CollabPresenceBubbles:
 * // <CollabPresenceBubbles provider={collab.provider} onPeerClick={follow.followPeer} />
 * ```
 */
export function useFollowMode(
	collab: CollabHandle,
	onViewportChange: (target: FollowTarget) => void
): FollowModeHandle {
	let followingUserId = $state<string | null>(null);

	$effect(() => {
		if (!followingUserId) return;

		const unsub = collab.provider.onPresenceChange((peers) => {
			if (!followingUserId) return;
			// Find the followed peer in the updated map
			for (const peer of peers.values()) {
				if (peer.user.id === followingUserId) {
					onViewportChange({
						x: peer.cursor?.x ?? null,
						y: peer.cursor?.y ?? null,
						nodeId: peer.activeNodeId,
						peer
					});
					return;
				}
			}
			// Peer left — stop following
			followingUserId = null;
		});

		return unsub;
	});

	return {
		get followingUserId() {
			return followingUserId;
		},
		followPeer(peer: PresenceState) {
			followingUserId = peer.user.id;
			// Immediately emit a target for the current position
			onViewportChange({
				x: peer.cursor?.x ?? null,
				y: peer.cursor?.y ?? null,
				nodeId: peer.activeNodeId,
				peer
			});
		},
		stopFollowing() {
			followingUserId = null;
		}
	};
}

/**
 * Create a reactive collab session for the given engine and config.
 *
 * Must be called during component initialisation (inside `<script>` or a
 * Svelte 5 rune context) so that the cleanup `$effect` runs on destroy.
 */
export function useCollab(engine: TraekEngine, config: CollabConfig): CollabHandle {
	const provider = $state<CollabProvider>(new CollabProvider(engine as never, config));
	let status = $state<CollabStatus>('connecting');
	let peers = new SvelteMap<number, PresenceState>();

	$effect(() => {
		// Sync initial values on mount / when provider changes
		status = provider.status;
		peers = new SvelteMap(provider.peers);

		const unsubStatus = provider.onStatusChange((s) => {
			status = s;
		});
		const unsubPresence = provider.onPresenceChange((updated) => {
			peers = new SvelteMap(updated);
		});

		return () => {
			unsubStatus();
			unsubPresence();
			provider.destroy();
		};
	});

	return {
		get provider() {
			return provider;
		},
		get status() {
			return status;
		},
		get peers() {
			return peers;
		},
		updateCursor(pos) {
			provider.updateCursor(pos);
		},
		updateActiveNode(nodeId) {
			provider.updateActiveNode(nodeId);
		},
		reconnect() {
			provider.reconnect();
		},
		disconnect() {
			provider.disconnect();
		}
	};
}
