import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as Y from 'yjs';
import { YjsWebSocketProvider } from '../YjsWebSocketProvider.js';
import {
	MessageType,
	encodeMessage,
	decodeMessage,
	encodeAwareness,
	decodeAwareness
} from '../protocol.js';

// ── Mock WebSocket ──────────────────────────────────────────────────────────

class MockWebSocket {
	static readonly CONNECTING = 0;
	static readonly OPEN = 1;
	static readonly CLOSING = 2;
	static readonly CLOSED = 3;

	readonly CONNECTING = 0;
	readonly OPEN = 1;
	readonly CLOSING = 2;
	readonly CLOSED = 3;

	readyState = MockWebSocket.CONNECTING;
	url: string;
	binaryType = 'arraybuffer';
	sent: Uint8Array[] = [];

	onopen: ((ev: Event) => void) | null = null;
	onclose: ((ev: CloseEvent) => void) | null = null;
	onmessage: ((ev: MessageEvent) => void) | null = null;
	onerror: ((ev: Event) => void) | null = null;

	constructor(url: string) {
		this.url = url;
	}

	send(data: ArrayBufferLike | Uint8Array): void {
		this.sent.push(new Uint8Array(data instanceof ArrayBuffer ? data : data));
	}

	close(): void {
		this.readyState = MockWebSocket.CLOSED;
		this.onclose?.(new CloseEvent('close'));
	}

	// Test helpers
	simulateOpen(): void {
		this.readyState = MockWebSocket.OPEN;
		this.onopen?.(new Event('open'));
	}

	simulateMessage(data: Uint8Array): void {
		this.onmessage?.(new MessageEvent('message', { data: data.buffer }));
	}

	simulateError(): void {
		this.onerror?.(new Event('error'));
	}
}

let mockWs: MockWebSocket;

beforeEach(() => {
	vi.stubGlobal(
		'WebSocket',
		class extends MockWebSocket {
			constructor(url: string) {
				super(url);
				mockWs = this;
			}
		}
	);
});

afterEach(() => {
	vi.unstubAllGlobals();
	vi.restoreAllMocks();
});

describe('YjsWebSocketProvider', () => {
	it('connects to serverUrl/roomId on creation', () => {
		const doc = new Y.Doc();
		const provider = new YjsWebSocketProvider('ws://localhost:1234', 'room-1', doc);
		expect(mockWs.url).toBe('ws://localhost:1234/room-1');
		provider.destroy();
	});

	it('emits "connecting" status initially', () => {
		const doc = new Y.Doc();
		const fn = vi.fn();
		const provider = new YjsWebSocketProvider('ws://localhost:1234', 'room-1', doc);
		provider.on('status', fn);
		expect(provider.status).toBe('connecting');
		provider.destroy();
	});

	it('emits "connected" when WebSocket opens', () => {
		const doc = new Y.Doc();
		const fn = vi.fn();
		const provider = new YjsWebSocketProvider('ws://localhost:1234', 'room-1', doc);
		provider.on('status', fn);
		mockWs.simulateOpen();
		expect(fn).toHaveBeenCalledWith('connected');
		expect(provider.status).toBe('connected');
		provider.destroy();
	});

	it('sends state vector after connecting', () => {
		const doc = new Y.Doc();
		const provider = new YjsWebSocketProvider('ws://localhost:1234', 'room-1', doc);
		mockWs.simulateOpen();
		expect(mockWs.sent.length).toBeGreaterThanOrEqual(1);
		const decoded = decodeMessage(mockWs.sent[0]);
		expect(decoded.type).toBe(MessageType.StateVector);
		provider.destroy();
	});

	it('applies incoming Update messages to the doc', () => {
		const doc1 = new Y.Doc();
		const doc2 = new Y.Doc();
		doc2.getMap('test').set('key', 'value');
		const update = Y.encodeStateAsUpdate(doc2);

		const provider = new YjsWebSocketProvider('ws://localhost:1234', 'room-1', doc1);
		mockWs.simulateOpen();
		mockWs.simulateMessage(encodeMessage(MessageType.Update, update));

		expect(doc1.getMap('test').get('key')).toBe('value');
		provider.destroy();
	});

	it('responds to incoming StateVector with an Update', () => {
		const doc = new Y.Doc();
		doc.getMap('test').set('key', 'local');

		const provider = new YjsWebSocketProvider('ws://localhost:1234', 'room-1', doc);
		mockWs.simulateOpen();
		const sentBefore = mockWs.sent.length;

		const remoteSv = Y.encodeStateVector(new Y.Doc());
		mockWs.simulateMessage(encodeMessage(MessageType.StateVector, remoteSv));

		expect(mockWs.sent.length).toBeGreaterThan(sentBefore);
		const lastSent = decodeMessage(mockWs.sent[mockWs.sent.length - 1]);
		expect(lastSent.type).toBe(MessageType.Update);
		provider.destroy();
	});

	it('forwards local doc updates to the WebSocket', () => {
		const doc = new Y.Doc();
		const provider = new YjsWebSocketProvider('ws://localhost:1234', 'room-1', doc);
		mockWs.simulateOpen();
		const sentBefore = mockWs.sent.length;

		doc.getMap('test').set('key', 'new');

		expect(mockWs.sent.length).toBeGreaterThan(sentBefore);
		const lastSent = decodeMessage(mockWs.sent[mockWs.sent.length - 1]);
		expect(lastSent.type).toBe(MessageType.Update);
		provider.destroy();
	});

	it('emits "disconnected" on WebSocket close', () => {
		const doc = new Y.Doc();
		const fn = vi.fn();
		const provider = new YjsWebSocketProvider('ws://localhost:1234', 'room-1', doc);
		provider.on('status', fn);
		mockWs.simulateOpen();
		fn.mockClear();
		mockWs.close();
		expect(fn).toHaveBeenCalledWith('disconnected');
		provider.destroy();
	});

	it('emits "error" on WebSocket error', () => {
		const doc = new Y.Doc();
		const fn = vi.fn();
		const provider = new YjsWebSocketProvider('ws://localhost:1234', 'room-1', doc);
		provider.on('status', fn);
		mockWs.simulateError();
		expect(fn).toHaveBeenCalledWith('error');
		provider.destroy();
	});

	it('disconnect() closes the WebSocket and stops reconnection', () => {
		const doc = new Y.Doc();
		const provider = new YjsWebSocketProvider('ws://localhost:1234', 'room-1', doc);
		mockWs.simulateOpen();
		provider.disconnect();
		expect(mockWs.readyState).toBe(MockWebSocket.CLOSED);
		provider.destroy();
	});

	it('connect() re-opens after disconnect()', () => {
		const doc = new Y.Doc();
		const provider = new YjsWebSocketProvider('ws://localhost:1234', 'room-1', doc);
		mockWs.simulateOpen();
		provider.disconnect();
		const oldWs = mockWs;
		provider.connect();
		expect(mockWs).not.toBe(oldWs);
		provider.destroy();
	});

	it('exposes awareness instance', () => {
		const doc = new Y.Doc();
		const provider = new YjsWebSocketProvider('ws://localhost:1234', 'room-1', doc);
		expect(provider.awareness).toBeDefined();
		expect(typeof provider.awareness.setLocalState).toBe('function');
		provider.destroy();
	});

	it('sends awareness updates through the WebSocket', () => {
		const doc = new Y.Doc();
		const provider = new YjsWebSocketProvider('ws://localhost:1234', 'room-1', doc);
		mockWs.simulateOpen();
		const sentBefore = mockWs.sent.length;

		provider.awareness.setLocalState({ name: 'Alice' });

		const awarenessMsgs = mockWs.sent
			.slice(sentBefore)
			.filter((m) => decodeMessage(m).type === MessageType.Awareness);
		expect(awarenessMsgs.length).toBe(1);
		provider.destroy();
	});

	it('clears remote peers from awareness on WebSocket close', () => {
		const doc = new Y.Doc();
		const provider = new YjsWebSocketProvider('ws://localhost:1234', 'room-1', doc);
		mockWs.simulateOpen();

		const peer1 = encodeAwareness(10, { name: 'Bob' });
		const peer2 = encodeAwareness(20, { name: 'Carol' });
		mockWs.simulateMessage(encodeMessage(MessageType.Awareness, peer1));
		mockWs.simulateMessage(encodeMessage(MessageType.Awareness, peer2));
		expect(provider.awareness.getStates().has(10)).toBe(true);
		expect(provider.awareness.getStates().has(20)).toBe(true);

		mockWs.close();
		expect(provider.awareness.getStates().has(10)).toBe(false);
		expect(provider.awareness.getStates().has(20)).toBe(false);
		provider.destroy();
	});

	it('destroy() stops forwarding doc updates', () => {
		const doc = new Y.Doc();
		const provider = new YjsWebSocketProvider('ws://localhost:1234', 'room-1', doc);
		mockWs.simulateOpen();
		provider.destroy();

		const sentBefore = mockWs.sent.length;
		doc.getMap('test').set('key', 'after-destroy');
		expect(mockWs.sent.length).toBe(sentBefore);
	});

	it('applies incoming awareness messages', () => {
		const doc = new Y.Doc();
		const provider = new YjsWebSocketProvider('ws://localhost:1234', 'room-1', doc);
		mockWs.simulateOpen();

		const awarenessPayload = encodeAwareness(99, { name: 'Bob' });
		mockWs.simulateMessage(encodeMessage(MessageType.Awareness, awarenessPayload));

		expect(provider.awareness.getStates().get(99)).toEqual({ name: 'Bob' });
		provider.destroy();
	});

	it('appends connectionParams as query string', async () => {
		const doc = new Y.Doc();
		const provider = new YjsWebSocketProvider('ws://localhost:1234', 'room-1', doc, {
			buildConnectionParams: () => ({ token: 'abc', org: 'x' })
		});
		expect(mockWs.url).toBe('ws://localhost:1234/room-1?token=abc&org=x');
		provider.destroy();
	});

	it('supports async buildConnectionParams', async () => {
		const doc = new Y.Doc();
		const provider = new YjsWebSocketProvider('ws://localhost:1234', 'room-1', doc, {
			buildConnectionParams: async () => ({ token: 'async-tok' })
		});
		await vi.waitFor(() => {
			expect(mockWs.url).toBe('ws://localhost:1234/room-1?token=async-tok');
		});
		provider.destroy();
	});
});

describe('reconnection', () => {
	it('attempts reconnect after unexpected close', async () => {
		vi.useFakeTimers();
		const doc = new Y.Doc();
		const provider = new YjsWebSocketProvider('ws://localhost:1234', 'room-1', doc, {
			initialBackoff: 100,
			maxBackoff: 1000
		});
		mockWs.simulateOpen();
		const firstWs = mockWs;
		mockWs.close();

		await vi.advanceTimersByTimeAsync(200);
		expect(mockWs).not.toBe(firstWs);
		provider.destroy();
		vi.useRealTimers();
	});

	it('does not reconnect after explicit disconnect()', async () => {
		vi.useFakeTimers();
		const doc = new Y.Doc();
		const provider = new YjsWebSocketProvider('ws://localhost:1234', 'room-1', doc, {
			initialBackoff: 50
		});
		mockWs.simulateOpen();
		const firstWs = mockWs;
		provider.disconnect();

		await vi.advanceTimersByTimeAsync(200);
		expect(mockWs).toBe(firstWs);
		provider.destroy();
		vi.useRealTimers();
	});

	it('escalates backoff on repeated failures', async () => {
		vi.useFakeTimers();
		vi.spyOn(Math, 'random').mockReturnValue(0.5);
		const doc = new Y.Doc();
		const provider = new YjsWebSocketProvider('ws://localhost:1234', 'room-1', doc, {
			initialBackoff: 100,
			maxBackoff: 5000
		});
		mockWs.close();
		const ws1 = mockWs;
		await vi.advanceTimersByTimeAsync(50);
		expect(mockWs).toBe(ws1);
		await vi.advanceTimersByTimeAsync(50);
		expect(mockWs).not.toBe(ws1);

		const ws2 = mockWs;
		mockWs.close();
		await vi.advanceTimersByTimeAsync(150);
		expect(mockWs).toBe(ws2);
		await vi.advanceTimersByTimeAsync(100);
		expect(mockWs).not.toBe(ws2);

		provider.destroy();
		vi.useRealTimers();
	});

	it('resets backoff after successful connection', async () => {
		vi.useFakeTimers();
		const doc = new Y.Doc();
		const provider = new YjsWebSocketProvider('ws://localhost:1234', 'room-1', doc, {
			initialBackoff: 100,
			maxBackoff: 5000
		});
		mockWs.simulateOpen();
		mockWs.close();
		await vi.advanceTimersByTimeAsync(200);
		mockWs.simulateOpen();
		mockWs.close();
		const wsAfterSecondDrop = mockWs;
		await vi.advanceTimersByTimeAsync(200);
		expect(mockWs).not.toBe(wsAfterSecondDrop);
		provider.destroy();
		vi.useRealTimers();
	});
});
