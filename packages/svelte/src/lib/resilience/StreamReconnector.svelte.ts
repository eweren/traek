/**
 * StreamReconnector — wraps a streaming fetch with automatic reconnection,
 * exponential backoff + jitter, and resume-token tracking.
 *
 * Design goals:
 * - Works with any fetch-based streaming (SSE, raw NDJSON, binary chunks)
 * - Tracks accumulated content so the factory can resume mid-stream
 * - Exposes reactive state (isReconnecting, reconnectAttempt) for UI bindings
 * - All side-effects are cleaned up when abort() / the returned cleanup fn is called
 *
 * Usage:
 *   const reconnector = new StreamReconnector({ maxAttempts: 5 });
 *
 *   const abort = reconnector.start(
 *     // Factory: called on first attempt AND every reconnect.
 *     // resumeFrom is the character count of content already received.
 *     (resumeFrom) => fetch('/api/chat', {
 *       method: 'POST',
 *       headers: {
 *         'Content-Type': 'application/json',
 *         ...(resumeFrom ? { 'X-Resume-From': resumeFrom } : {}),
 *       },
 *       body: JSON.stringify({ messages }),
 *     }),
 *     {
 *       onChunk(chunk, accumulated) {
 *         engine.updateNode(nodeId, { content: accumulated });
 *       },
 *       onDone(accumulated) {
 *         engine.updateNode(nodeId, { status: 'done', content: accumulated });
 *       },
 *       onError(err) {
 *         engine.updateNode(nodeId, { status: 'error', errorMessage: err.message });
 *       },
 *     },
 *   );
 *
 *   // To cancel mid-stream:
 *   abort();
 */

export interface StreamReconnectorOptions {
	/** Maximum number of reconnect attempts before giving up. Default: 5. */
	maxAttempts?: number;
	/** Base delay in ms for the first backoff step. Default: 500. */
	baseDelayMs?: number;
	/** Upper cap for backoff delay in ms. Default: 30_000. */
	maxDelayMs?: number;
	/**
	 * Jitter factor in [0, 1]. The computed delay is spread over
	 * [(1 - jitter) * exp, exp]. Default: 0.3.
	 */
	jitter?: number;
}

/**
 * Factory that produces a fetch Response.
 *
 * @param resumeFrom - Opaque string token (character count) of how many
 *   UTF-16 code units were already received. Undefined on the first attempt.
 */
export type StreamFactory = (resumeFrom?: string) => Promise<Response>;

export type StreamChunkHandler = (
	/** The raw decoded text of this chunk. */
	chunk: string,
	/** All content accumulated so far across reconnects. */
	accumulated: string
) => void;

export type StreamDoneHandler = (accumulated: string) => void;

export type StreamErrorHandler = (error: Error, finalAttempt: number) => void;

export type StreamReconnectingHandler = (attempt: number, delayMs: number) => void;

export interface StreamHandlers {
	onChunk: StreamChunkHandler;
	onDone: StreamDoneHandler;
	onError?: StreamErrorHandler;
	/** Called just before each reconnect delay starts. */
	onReconnecting?: StreamReconnectingHandler;
}

/**
 * Computes an exponential backoff delay with full jitter.
 *
 * @param attempt - Zero-based retry index (0 = delay before first retry).
 * @param baseMs  - Base delay in ms.
 * @param maxMs   - Upper cap in ms.
 * @param jitter  - Jitter factor in [0, 1].
 */
export function computeBackoffDelay(
	attempt: number,
	baseMs: number,
	maxMs: number,
	jitter: number
): number {
	const exp = Math.min(baseMs * 2 ** attempt, maxMs);
	const lo = exp * (1 - Math.min(Math.max(jitter, 0), 1));
	return lo + Math.random() * (exp - lo);
}

export class StreamReconnector {
	/** True while waiting between reconnect attempts. */
	isReconnecting = $state(false);

	/** Current reconnect attempt number (0 = idle or first attempt). */
	reconnectAttempt = $state(0);

	private readonly maxAttempts: number;
	private readonly baseDelayMs: number;
	private readonly maxDelayMs: number;
	private readonly jitter: number;

	private abortController: AbortController | null = null;
	private retryTimeoutId: ReturnType<typeof setTimeout> | null = null;
	/** Set to true to halt the active stream loop and cancel pending retries. */
	private aborted = false;

	constructor(opts: StreamReconnectorOptions = {}) {
		this.maxAttempts = opts.maxAttempts ?? 5;
		this.baseDelayMs = opts.baseDelayMs ?? 500;
		this.maxDelayMs = opts.maxDelayMs ?? 30_000;
		this.jitter = opts.jitter ?? 0.3;
	}

	/**
	 * Begin streaming. Returns an abort function that cancels everything.
	 * Calling `start()` while a stream is active aborts the previous one first.
	 */
	start(factory: StreamFactory, handlers: StreamHandlers): () => void {
		this.abort();
		this.aborted = false;
		this.reconnectAttempt = 0;
		this.isReconnecting = false;

		let accumulated = '';

		const attempt = async (attemptIndex: number): Promise<void> => {
			if (this.aborted) return;

			this.abortController = new AbortController();
			const { signal } = this.abortController;

			// --- Fetch ---
			let response: Response;
			try {
				const resumeFrom = accumulated.length > 0 ? String(accumulated.length) : undefined;
				response = await factory(resumeFrom);
			} catch (err) {
				if (this.aborted) return;
				return this.scheduleRetry(
					attemptIndex,
					() => attempt(attemptIndex + 1),
					handlers,
					err as Error
				);
			}

			if (this.aborted) return;

			if (!response.ok) {
				return this.scheduleRetry(
					attemptIndex,
					() => attempt(attemptIndex + 1),
					handlers,
					new Error(`HTTP ${response.status}: ${response.statusText}`)
				);
			}

			if (!response.body) {
				handlers.onError?.(new Error('Response has no readable body'), attemptIndex);
				return;
			}

			// --- Read stream ---
			const reader = response.body.getReader();
			const decoder = new TextDecoder();

			signal.addEventListener('abort', () => {
				reader.cancel().catch(() => {});
			});

			try {
				while (true) {
					if (this.aborted) {
						reader.cancel().catch(() => {});
						return;
					}
					const { done, value } = await reader.read();
					if (done) break;
					const chunk = decoder.decode(value, { stream: true });
					accumulated += chunk;
					handlers.onChunk(chunk, accumulated);
				}

				// Flush remaining decoder bytes
				const tail = decoder.decode();
				if (tail) {
					accumulated += tail;
					handlers.onChunk(tail, accumulated);
				}

				if (!this.aborted) {
					this.isReconnecting = false;
					this.reconnectAttempt = 0;
					handlers.onDone(accumulated);
				}
			} catch (err) {
				if (this.aborted) return;
				return this.scheduleRetry(
					attemptIndex,
					() => attempt(attemptIndex + 1),
					handlers,
					err as Error
				);
			}
		};

		attempt(0).catch(() => {});
		return () => this.abort();
	}

	/** Immediately abort any in-progress stream and cancel pending retries. */
	abort(): void {
		this.aborted = true;
		this.isReconnecting = false;
		this.reconnectAttempt = 0;
		this.abortController?.abort();
		this.abortController = null;
		if (this.retryTimeoutId != null) {
			clearTimeout(this.retryTimeoutId);
			this.retryTimeoutId = null;
		}
	}

	private scheduleRetry(
		attemptIndex: number,
		next: () => Promise<void>,
		handlers: StreamHandlers,
		cause: Error
	): void {
		if (this.aborted) return;

		if (attemptIndex >= this.maxAttempts) {
			this.isReconnecting = false;
			this.reconnectAttempt = 0;
			handlers.onError?.(cause, attemptIndex);
			return;
		}

		const delay = computeBackoffDelay(attemptIndex, this.baseDelayMs, this.maxDelayMs, this.jitter);
		this.isReconnecting = true;
		this.reconnectAttempt = attemptIndex + 1;
		handlers.onReconnecting?.(attemptIndex + 1, delay);

		this.retryTimeoutId = setTimeout(() => {
			this.retryTimeoutId = null;
			if (!this.aborted) next().catch(() => {});
		}, delay);
	}
}
