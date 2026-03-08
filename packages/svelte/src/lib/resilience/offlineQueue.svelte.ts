/**
 * Offline queue for Traek — buffers messages sent while the device is offline
 * and flushes them in order when connectivity is restored.
 *
 * Detection strategy:
 * - `navigator.onLine` for immediate initial state
 * - window `online`/`offline` events for reactive updates
 * - Optional ping URL (`configure({ pingUrl })`) for captive-portal accuracy
 *
 * Usage:
 *   import { offlineQueue } from '$lib/resilience/offlineQueue.svelte';
 *
 *   // In your send handler:
 *   if (!offlineQueue.isOnline) {
 *     offlineQueue.enqueue({ nodeId, content, parentIds });
 *     return;
 *   }
 *
 *   // When back online (e.g. in a $effect):
 *   offlineQueue.onReconnect(async (items) => {
 *     for (const item of items) await actualSend(item);
 *   });
 */

export interface QueuedMessage {
	/** Temporary client-side ID for the queued user node */
	nodeId: string;
	content: string;
	parentIds: string[];
	queuedAt: number;
}

type FlushHandler = (items: QueuedMessage[]) => Promise<void>;

class OfflineQueue {
	isOnline = $state(typeof navigator !== 'undefined' ? navigator.onLine : true);
	queue = $state<QueuedMessage[]>([]);

	/** True while the queue is being flushed after reconnection. */
	isFlushing = $state(false);

	private flushHandler: FlushHandler | null = null;
	private pingUrl: string | null = null;

	// Bound method references kept for symmetric removeEventListener calls.
	private readonly boundHandleOnline: () => void;
	private readonly boundHandleOffline: () => void;

	constructor() {
		this.boundHandleOnline = () => this.handleOnline();
		this.boundHandleOffline = () => {
			this.isOnline = false;
		};

		if (typeof window === 'undefined') return;

		window.addEventListener('online', this.boundHandleOnline);
		window.addEventListener('offline', this.boundHandleOffline);
	}

	/**
	 * Optional configuration. Call once at app startup if you need
	 * captive-portal-aware connectivity detection.
	 */
	configure(opts: { pingUrl?: string }) {
		this.pingUrl = opts.pingUrl ?? null;
	}

	/** Add a message to the offline queue. */
	enqueue(msg: Omit<QueuedMessage, 'queuedAt'>) {
		this.queue = [...this.queue, { ...msg, queuedAt: Date.now() }];
	}

	/** Remove a queued message by node ID (e.g. after successful send). */
	dequeue(nodeId: string) {
		this.queue = this.queue.filter((m) => m.nodeId !== nodeId);
	}

	/**
	 * Register a handler called when connectivity is restored.
	 * The handler receives all queued items in insertion order.
	 * Returns a cleanup function.
	 */
	onReconnect(handler: FlushHandler): () => void {
		this.flushHandler = handler;
		return () => {
			if (this.flushHandler === handler) this.flushHandler = null;
		};
	}

	private async handleOnline() {
		if (this.pingUrl) {
			const reachable = await this.ping(this.pingUrl);
			if (!reachable) return; // still behind captive portal
		}
		this.isOnline = true;
		await this.flush();
	}

	private async flush() {
		if (this.queue.length === 0 || !this.flushHandler) return;
		this.isFlushing = true;
		const items = [...this.queue];
		try {
			await this.flushHandler(items);
			// Handler is responsible for dequeuing items via dequeue()
		} finally {
			this.isFlushing = false;
		}
	}

	private async ping(url: string): Promise<boolean> {
		try {
			const res = await fetch(url, {
				method: 'HEAD',
				cache: 'no-store',
				signal: AbortSignal.timeout(3000)
			});
			return res.ok;
		} catch {
			return false;
		}
	}

	destroy() {
		if (typeof window === 'undefined') return;
		window.removeEventListener('online', this.boundHandleOnline);
		window.removeEventListener('offline', this.boundHandleOffline);
	}
}

/** Singleton offline queue. Import this in your app. */
export const offlineQueue = new OfflineQueue();
