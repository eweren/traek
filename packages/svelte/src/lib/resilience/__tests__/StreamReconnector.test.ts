import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
	StreamReconnector,
	computeBackoffDelay,
	type StreamHandlers
} from '../StreamReconnector.svelte';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeStreamResponse(chunks: string[]): Response {
	const encoder = new TextEncoder();
	const stream = new ReadableStream({
		start(controller) {
			for (const chunk of chunks) {
				controller.enqueue(encoder.encode(chunk));
			}
			controller.close();
		}
	});
	return new Response(stream, { status: 200 });
}

function makeErrorResponse(status: number): Response {
	return new Response(null, { status, statusText: 'Error' });
}

function makeHandlers(overrides: Partial<StreamHandlers> = {}): {
	handlers: StreamHandlers;
	onChunk: ReturnType<typeof vi.fn>;
	onDone: ReturnType<typeof vi.fn>;
	onError: ReturnType<typeof vi.fn>;
	onReconnecting: ReturnType<typeof vi.fn>;
} {
	const onChunk = vi.fn();
	const onDone = vi.fn();
	const onError = vi.fn();
	const onReconnecting = vi.fn();
	return {
		handlers: { onChunk, onDone, onError, onReconnecting, ...overrides },
		onChunk,
		onDone,
		onError,
		onReconnecting
	};
}

// ---------------------------------------------------------------------------
// computeBackoffDelay
// ---------------------------------------------------------------------------

describe('computeBackoffDelay', () => {
	it('returns a value >= 0 for any valid inputs', () => {
		expect.assertions(5);
		for (let i = 0; i < 5; i++) {
			expect(computeBackoffDelay(i, 500, 30_000, 0.3)).toBeGreaterThanOrEqual(0);
		}
	});

	it('does not exceed maxMs', () => {
		expect.assertions(10);
		for (let i = 0; i < 10; i++) {
			expect(computeBackoffDelay(i, 500, 30_000, 0.3)).toBeLessThanOrEqual(30_000);
		}
	});

	it('returns exactly maxMs when jitter=0 and exp exceeds max', () => {
		expect.assertions(1);
		// attempt 10 → baseMs * 2^10 = 512_000 > maxMs(30_000), jitter=0 → lo = 30_000
		const delay = computeBackoffDelay(10, 500, 30_000, 0);
		expect(delay).toBe(30_000);
	});

	it('grows with attempt when well below cap (jitter=0)', () => {
		expect.assertions(2);
		const d0 = computeBackoffDelay(0, 500, 30_000, 0); // 500
		const d1 = computeBackoffDelay(1, 500, 30_000, 0); // 1000
		expect(d1).toBeGreaterThan(d0);
		expect(d1).toBe(d0 * 2);
	});

	it('clamps jitter to [0, 1] (jitter > 1 treated as 1)', () => {
		expect.assertions(1);
		// jitter clamped → lo = 0, result in [0, exp]
		const delay = computeBackoffDelay(0, 500, 30_000, 999);
		expect(delay).toBeGreaterThanOrEqual(0);
	});

	it('with jitter=0 delay equals the exponential value (deterministic)', () => {
		expect.assertions(3);
		expect(computeBackoffDelay(0, 500, 30_000, 0)).toBe(500);
		expect(computeBackoffDelay(1, 500, 30_000, 0)).toBe(1000);
		expect(computeBackoffDelay(2, 500, 30_000, 0)).toBe(2000);
	});
});

// ---------------------------------------------------------------------------
// StreamReconnector
// ---------------------------------------------------------------------------

describe('StreamReconnector', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.restoreAllMocks();
	});

	describe('successful stream', () => {
		it('calls onChunk for each chunk and onDone when finished', async () => {
			expect.assertions(5);
			const factory = vi.fn().mockResolvedValue(makeStreamResponse(['Hello', ' World']));
			const { handlers, onChunk, onDone, onError } = makeHandlers();
			const reconnector = new StreamReconnector();

			reconnector.start(factory, handlers);
			await vi.runAllTimersAsync();

			expect(factory).toHaveBeenCalledTimes(1);
			expect(factory).toHaveBeenCalledWith(undefined); // no resumeFrom on first attempt
			expect(onChunk).toHaveBeenCalledTimes(2);
			expect(onDone).toHaveBeenCalledWith('Hello World');
			expect(onError).not.toHaveBeenCalled();
		});

		it('passes accumulated content to onChunk', async () => {
			expect.assertions(2);
			const factory = vi.fn().mockResolvedValue(makeStreamResponse(['abc', 'def']));
			const chunks: string[] = [];
			const accumulateds: string[] = [];
			const { handlers } = makeHandlers({
				onChunk(chunk, accumulated) {
					chunks.push(chunk);
					accumulateds.push(accumulated);
				}
			});

			new StreamReconnector().start(factory, handlers);
			await vi.runAllTimersAsync();

			expect(chunks).toEqual(['abc', 'def']);
			expect(accumulateds).toEqual(['abc', 'abcdef']);
		});

		it('resets reactive state after successful completion', async () => {
			expect.assertions(2);
			const factory = vi.fn().mockResolvedValue(makeStreamResponse(['ok']));
			const { handlers } = makeHandlers();
			const reconnector = new StreamReconnector();

			reconnector.start(factory, handlers);
			await vi.runAllTimersAsync();

			expect(reconnector.isReconnecting).toBe(false);
			expect(reconnector.reconnectAttempt).toBe(0);
		});
	});

	describe('HTTP error response', () => {
		it('retries on non-ok status and calls onDone after recovery', async () => {
			expect.assertions(3);
			const factory = vi
				.fn()
				.mockResolvedValueOnce(makeErrorResponse(503))
				.mockResolvedValue(makeStreamResponse(['recovered']));
			const { handlers, onDone, onReconnecting } = makeHandlers();

			new StreamReconnector({ baseDelayMs: 100, jitter: 0 }).start(factory, handlers);
			await vi.runAllTimersAsync();

			expect(factory).toHaveBeenCalledTimes(2);
			expect(onReconnecting).toHaveBeenCalledWith(1, 100);
			expect(onDone).toHaveBeenCalledWith('recovered');
		});

		it('calls onError when max attempts exceeded', async () => {
			expect.assertions(2);
			const factory = vi.fn().mockResolvedValue(makeErrorResponse(500));
			const { handlers, onError } = makeHandlers();

			new StreamReconnector({ maxAttempts: 2, baseDelayMs: 10, jitter: 0 }).start(
				factory,
				handlers
			);
			await vi.runAllTimersAsync();

			// attempt 0, retry 1, retry 2 — exceeds maxAttempts=2 on the 3rd call (attemptIndex=2)
			expect(factory).toHaveBeenCalledTimes(3);
			expect(onError).toHaveBeenCalledTimes(1);
		});
	});

	describe('network / fetch error', () => {
		it('retries on fetch rejection', async () => {
			expect.assertions(3);
			const factory = vi
				.fn()
				.mockRejectedValueOnce(new Error('Network failure'))
				.mockResolvedValue(makeStreamResponse(['data']));
			const { handlers, onDone, onReconnecting } = makeHandlers();

			new StreamReconnector({ baseDelayMs: 50, jitter: 0 }).start(factory, handlers);
			await vi.runAllTimersAsync();

			expect(factory).toHaveBeenCalledTimes(2);
			expect(onReconnecting).toHaveBeenCalledWith(1, 50);
			expect(onDone).toHaveBeenCalledWith('data');
		});

		it('gives up after maxAttempts fetch rejections', async () => {
			expect.assertions(2);
			const factory = vi.fn().mockRejectedValue(new Error('dead'));
			const { handlers, onError } = makeHandlers();

			new StreamReconnector({ maxAttempts: 3, baseDelayMs: 10, jitter: 0 }).start(
				factory,
				handlers
			);
			await vi.runAllTimersAsync();

			expect(factory).toHaveBeenCalledTimes(4); // initial + 3 retries
			expect(onError).toHaveBeenCalledTimes(1);
		});
	});

	describe('resume token', () => {
		it('passes resumeFrom with accumulated char count on reconnect', async () => {
			expect.assertions(2);
			const factory = vi
				.fn()
				.mockResolvedValueOnce(makeStreamResponse(['hello'])) // 5 chars, then network error on read
				.mockImplementationOnce(async () => {
					// This simulates a second call — just verify the argument
					return makeStreamResponse([' world']);
				});

			// Force a read error after the first chunk by using a custom stream
			const encoder = new TextEncoder();
			let readCount = 0;
			const brokenStream = new ReadableStream({
				pull(controller) {
					readCount++;
					if (readCount === 1) {
						controller.enqueue(encoder.encode('hello'));
					} else {
						controller.error(new Error('Connection reset'));
					}
				}
			});
			const brokenResponse = new Response(brokenStream, { status: 200 });

			factory.mockReset();
			factory
				.mockResolvedValueOnce(brokenResponse)
				.mockResolvedValue(makeStreamResponse([' world']));

			const { handlers, onDone } = makeHandlers();
			new StreamReconnector({ baseDelayMs: 10, jitter: 0 }).start(factory, handlers);
			await vi.runAllTimersAsync();

			// Second call should receive resumeFrom = '5' (5 chars of 'hello')
			expect(factory).toHaveBeenNthCalledWith(2, '5');
			expect(onDone).toHaveBeenCalledWith('hello world');
		});
	});

	describe('abort', () => {
		it('abort() cancels a pending retry timeout', async () => {
			expect.assertions(2);
			const factory = vi.fn().mockRejectedValue(new Error('fail'));
			const { handlers, onError } = makeHandlers();
			const reconnector = new StreamReconnector({ baseDelayMs: 5000, jitter: 0 });

			reconnector.start(factory, handlers);
			// Let the first attempt fail but abort before the retry fires
			await Promise.resolve(); // tick for initial fetch rejection
			await Promise.resolve();
			reconnector.abort();
			await vi.runAllTimersAsync();

			// onError should NOT be called since we aborted cleanly
			expect(onError).not.toHaveBeenCalled();
			expect(reconnector.isReconnecting).toBe(false);
		});

		it('calling start() again aborts the previous stream', async () => {
			expect.assertions(3);
			const onDone1 = vi.fn();
			const onDone2 = vi.fn();
			const factory1 = vi.fn().mockResolvedValue(makeStreamResponse(['first']));
			const factory2 = vi.fn().mockResolvedValue(makeStreamResponse(['second']));
			const reconnector = new StreamReconnector();

			reconnector.start(factory1, { onChunk: vi.fn(), onDone: onDone1 });
			// Immediately start another — should abort the first
			reconnector.start(factory2, { onChunk: vi.fn(), onDone: onDone2 });
			await vi.runAllTimersAsync();

			expect(factory2).toHaveBeenCalledTimes(1);
			expect(onDone2).toHaveBeenCalledWith('second');
			// First stream was aborted; onDone1 may or may not fire depending on timing,
			// but onDone2 must have fired
			expect(onDone2).toHaveBeenCalledTimes(1);
		});

		it('abort() resets reactive state', () => {
			expect.assertions(2);
			const reconnector = new StreamReconnector();
			// Manually put it into a reconnecting state
			reconnector.isReconnecting = true;
			reconnector.reconnectAttempt = 3;

			reconnector.abort();

			expect(reconnector.isReconnecting).toBe(false);
			expect(reconnector.reconnectAttempt).toBe(0);
		});
	});

	describe('reactive state', () => {
		it('sets isReconnecting=true and reconnectAttempt during retry wait', async () => {
			expect.assertions(2);
			const factory = vi
				.fn()
				.mockRejectedValueOnce(new Error('fail'))
				.mockResolvedValue(makeStreamResponse(['ok']));
			const { handlers } = makeHandlers();
			const reconnector = new StreamReconnector({ baseDelayMs: 10_000, jitter: 0 });

			reconnector.start(factory, handlers);
			await Promise.resolve(); // let the first fetch rejection propagate
			await Promise.resolve();

			expect(reconnector.isReconnecting).toBe(true);
			expect(reconnector.reconnectAttempt).toBe(1);
		});
	});

	describe('no-body response', () => {
		it('calls onError when response body is null', async () => {
			expect.assertions(1);
			const bodylessResponse = new Response(null, { status: 200 });
			// Patch body to be null (some environments always supply a body)
			Object.defineProperty(bodylessResponse, 'body', { value: null });
			const factory = vi.fn().mockResolvedValue(bodylessResponse);
			const { handlers, onError } = makeHandlers();

			new StreamReconnector({ maxAttempts: 0 }).start(factory, handlers);
			await vi.runAllTimersAsync();

			expect(onError).toHaveBeenCalledTimes(1);
		});
	});
});
