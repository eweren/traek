/**
 * @traek/collab — YjsWebSocketProvider
 *
 * Custom WebSocket provider for Yjs document sync. Replaces y-websocket
 * with full control over the connection lifecycle, protocol, and reconnection.
 */

import * as Y from 'yjs';
import { Awareness } from './Awareness.js';
import { MessageType, encodeMessage, decodeMessage, decodeAwareness } from './protocol.js';

export type ProviderStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export interface ProviderOptions {
	buildConnectionParams?: () => Record<string, string> | Promise<Record<string, string>>;
	initialBackoff?: number;
	maxBackoff?: number;
}

type StatusListener = (status: ProviderStatus) => void;

export class YjsWebSocketProvider {
	readonly awareness: Awareness;
	status: ProviderStatus = 'connecting';

	private readonly _serverUrl: string;
	private readonly _roomId: string;
	private readonly _doc: Y.Doc;
	private readonly _options: Required<ProviderOptions>;

	private _ws: WebSocket | null = null;
	private _intentionalDisconnect = false;
	private _currentBackoff: number;
	private _reconnectTimer: ReturnType<typeof setTimeout> | null = null;
	private _statusListeners: Set<StatusListener> = new Set();
	private _updateHandler: (update: Uint8Array, origin: unknown) => void;
	private _awarenessHandler: (event: { encodedState?: Uint8Array }) => void;
	private _destroyed = false;
	/** Track remote clientIds seen via awareness, so we can clean up on disconnect. */
	private _remotePeers: Set<number> = new Set();

	constructor(serverUrl: string, roomId: string, doc: Y.Doc, options?: ProviderOptions) {
		this._serverUrl = serverUrl;
		this._roomId = roomId;
		this._doc = doc;
		this._options = {
			buildConnectionParams: options?.buildConnectionParams ?? (() => ({})),
			initialBackoff: options?.initialBackoff ?? 100,
			maxBackoff: options?.maxBackoff ?? 30_000
		};
		this._currentBackoff = this._options.initialBackoff;

		this.awareness = new Awareness(doc.clientID);

		// Forward local doc updates to the WebSocket
		this._updateHandler = (update: Uint8Array, origin: unknown) => {
			if (origin === this) return; // skip updates we applied ourselves
			this._send(encodeMessage(MessageType.Update, update));
		};
		this._doc.on('update', this._updateHandler);

		// Forward local awareness changes to the WebSocket
		this._awarenessHandler = (event) => {
			if (event.encodedState) {
				this._send(encodeMessage(MessageType.Awareness, event.encodedState));
			}
		};
		this.awareness.on('change', this._awarenessHandler);

		this._connect();
	}

	on(event: 'status', fn: StatusListener): void {
		this._statusListeners.add(fn);
	}

	off(event: 'status', fn: StatusListener): void {
		this._statusListeners.delete(fn);
	}

	connect(): void {
		this._intentionalDisconnect = false;
		this._currentBackoff = this._options.initialBackoff;
		this._connect();
	}

	disconnect(): void {
		this._intentionalDisconnect = true;
		this._clearReconnectTimer();
		this._ws?.close();
	}

	destroy(): void {
		this._destroyed = true;
		this.disconnect();
		this._doc.off('update', this._updateHandler);
		this.awareness.off('change', this._awarenessHandler);
		this.awareness.destroy();
		this._statusListeners.clear();
	}

	private _connect(): void {
		if (this._destroyed) return;
		if (this._ws?.readyState === WebSocket.OPEN || this._ws?.readyState === WebSocket.CONNECTING) {
			return;
		}

		this._setStatus('connecting');

		const result = this._options.buildConnectionParams();
		if (result instanceof Promise) {
			result.then((params) => this._openSocket(params));
		} else {
			this._openSocket(result);
		}
	}

	private _openSocket(params: Record<string, string>): void {
		if (this._destroyed) return;

		let url = `${this._serverUrl}/${this._roomId}`;
		const qs = new URLSearchParams(params).toString();
		if (qs) url += `?${qs}`;

		const ws = new WebSocket(url);
		ws.binaryType = 'arraybuffer';
		this._ws = ws;

		ws.onopen = () => {
			this._setStatus('connected');
			this._currentBackoff = this._options.initialBackoff;
			// Send our state vector so the server can respond with missing updates
			const sv = Y.encodeStateVector(this._doc);
			this._send(encodeMessage(MessageType.StateVector, sv));
		};

		ws.onmessage = (ev: MessageEvent) => {
			const data = new Uint8Array(ev.data as ArrayBuffer);
			this._handleMessage(data);
		};

		ws.onclose = () => {
			// Clean up awareness for all remote peers connected via this socket
			for (const peerId of this._remotePeers) {
				this.awareness.removeClient(peerId);
			}
			this._remotePeers.clear();

			this._setStatus('disconnected');
			if (!this._intentionalDisconnect && !this._destroyed) {
				this._scheduleReconnect();
			}
		};

		ws.onerror = () => {
			this._setStatus('error');
		};
	}

	private _handleMessage(data: Uint8Array): void {
		const { type, payload } = decodeMessage(data);
		switch (type) {
			case MessageType.StateVector: {
				// Remote sent their state vector — respond with our update
				const update = Y.encodeStateAsUpdate(this._doc, payload);
				this._send(encodeMessage(MessageType.Update, update));
				break;
			}
			case MessageType.Update: {
				Y.applyUpdate(this._doc, payload, this);
				break;
			}
			case MessageType.Awareness: {
				const { clientId, state } = decodeAwareness(payload);
				if (state !== null) {
					this._remotePeers.add(clientId);
				} else {
					this._remotePeers.delete(clientId);
				}
				this.awareness.applyRemoteState(clientId, state);
				break;
			}
		}
	}

	private _send(data: Uint8Array): void {
		if (this._ws?.readyState === WebSocket.OPEN) {
			this._ws.send(data);
		}
	}

	private _scheduleReconnect(): void {
		this._clearReconnectTimer();
		const jitter = this._currentBackoff * (0.5 + Math.random());
		this._reconnectTimer = setTimeout(() => {
			this._connect();
		}, jitter);
		this._currentBackoff = Math.min(this._currentBackoff * 2, this._options.maxBackoff);
	}

	private _clearReconnectTimer(): void {
		if (this._reconnectTimer !== null) {
			clearTimeout(this._reconnectTimer);
			this._reconnectTimer = null;
		}
	}

	private _setStatus(status: ProviderStatus): void {
		this.status = status;
		for (const fn of this._statusListeners) fn(status);
	}
}
