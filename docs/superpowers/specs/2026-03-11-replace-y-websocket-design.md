# Replace y-websocket and lib0 with Custom Implementation

**Date:** 2026-03-11
**Status:** Approved
**Package:** `@traek/collab`

## Problem

y-websocket is a black box with unreliable reconnection logic, no control over the WebSocket protocol (e.g. auth headers, custom messages), and dependency/bundling issues. lib0 is dragged in as a transitive dependency and adds unnecessary weight. Both need to go.

## Decision

Replace y-websocket and lib0 with two focused modules inside `packages/collab/src/`. Yjs itself stays — it's the CRDT engine, not the problem.

## Design

### New Modules

#### `YjsWebSocketProvider.ts`

Owns the WebSocket lifecycle and Yjs document synchronisation.

**Responsibilities:**
- Open/manage a single WebSocket connection to the collab server
- Implement the Yjs sync handshake (bidirectional — see protocol section)
- Exponential backoff reconnection with jitter (100 ms initial → max 30 s, `delay * (0.5 + Math.random() * 0.5)`, resets on successful connection)
- Emit unified status events: `connecting`, `connected`, `disconnected`, `error` — all through a single `on('status')` callback. No separate `connection-error` event; CollabProvider simplifies to one listener.
- Expose `connect()`, `disconnect()`, and `destroy()` for lifecycle control
- Host an `Awareness` instance and route awareness messages through the same socket

**Lifecycle methods:**
- `connect()` — open WebSocket (no-op if already connected/connecting). Safe to call after `disconnect()`.
- `disconnect()` — close WebSocket, stop reconnection timer. Does NOT clean up internal state. Safe to call multiple times.
- `destroy()` — calls `disconnect()`, clears all listeners and internal timers. Instance is unusable after this.

**Constructor signature:**
```ts
new YjsWebSocketProvider(serverUrl: string, roomId: string, doc: Y.Doc, options?: ProviderOptions)
```

**`ProviderOptions` (all optional):**
```ts
interface ProviderOptions {
  /**
   * Called before each connection attempt. Returned key-value pairs are
   * appended as URL query parameters (e.g. `?token=abc`).
   * Note: browser WebSocket API does not support custom HTTP headers.
   */
  buildConnectionParams?: () => Record<string, string> | Promise<Record<string, string>>;
  /** Initial reconnect delay in ms. Default: 100 */
  initialBackoff?: number;
  /** Maximum reconnect delay in ms. Default: 30_000 */
  maxBackoff?: number;
}
```

#### `Awareness.ts`

Manages presence state broadcasting over the same WebSocket connection.

**Responsibilities:**
- Maintain a `Map<number, unknown>` of client states (keyed by Yjs `doc.clientID`). Consumers cast to their own types (matches y-protocols behavior).
- `setLocalState(state: unknown | null)` — sets local state. Passing `null` clears the local state and broadcasts a removal message to peers (used by CollabProvider.destroy()).
- `getLocalState(): unknown | null` — returns current local state or null.
- `getStates(): Map<number, unknown>` — returns all known client states.
- `on('change', callback)` — emits when any client's state changes (add, update, or remove).
- Encode/decode awareness as JSON (UTF-8), not lib0 binary.

**Peer removal mechanism:**
- When a client calls `setLocalState(null)`, a removal awareness message is broadcast (type `2` with `null` state for that clientID).
- When the WebSocket closes, the provider notifies the Awareness instance via `removeClient(clientId)` for all peers that were connected through that socket.
- The server broadcasts removal messages when it detects a client disconnect (WebSocket close event on server side).

### Binary Protocol

Minimal framing over WebSocket binary messages. First byte = message type, rest = payload.

| Byte | Type             | Payload                                    |
|------|------------------|--------------------------------------------|
| `0`  | Sync: StateVector | Output of `Y.encodeStateVector(doc)`       |
| `1`  | Sync: Update      | Output of `Y.encodeStateAsUpdate(doc, sv)` |
| `2`  | Awareness         | JSON-encoded awareness state (UTF-8 bytes) |

**Awareness message format (type `2`):**
```ts
{ clientId: number, state: unknown | null }
```
Where `null` state means the client has departed.

**Handshake flow (bidirectional):**
1. Client opens WebSocket to `${serverUrl}/${roomId}?${connectionParams}`
2. Client sends message type `0` with its state vector
3. Server sends message type `0` with its state vector back to the client
4. Both sides respond to the received state vector with a type `1` update containing the data the other side is missing
5. Both sides send type `1` messages for incremental updates thereafter
6. Awareness messages (type `2`) flow bidirectionally at any time

This ensures both client and server converge to the same state, even when the client has local changes the server hasn't seen.

### Changes to CollabProvider

- Replace `import { WebsocketProvider } from 'y-websocket'` with `import { YjsWebSocketProvider } from './YjsWebSocketProvider.js'`
- `this.provider` type changes from `WebsocketProvider` to `YjsWebSocketProvider`
- `provider.awareness` returns our `Awareness` instance (same API surface)
- Remove `providerOptions?: Record<string, unknown>` from `CollabConfig`
- Add typed connection and backoff options to `CollabConfig` instead
- Simplify `_setupStatusListeners()` to a single `on('status')` listener (no separate `connection-error` handler)
- Call `provider.destroy()` instead of `provider.disconnect()` in `destroy()`

### Changes to `CollabConfig`

```ts
interface CollabConfig {
  serverUrl: string;
  roomId: string;
  user: CollabUser;
  cursorTimeoutMs?: number;
  /**
   * Called before each connection attempt. Returned key-value pairs are
   * appended as URL query parameters.
   */
  buildConnectionParams?: () => Record<string, string> | Promise<Record<string, string>>;
  /** Initial reconnect delay in ms. Default: 100 */
  initialBackoff?: number;
  /** Maximum reconnect delay in ms. Default: 30_000 */
  maxBackoff?: number;
}
```

### What Gets Removed

- `y-websocket` from `package.json` dependencies
- `lib0` from `package.json` dependencies
- `providerOptions?: Record<string, unknown>` from `CollabConfig`

### What Stays

- `yjs` — the CRDT core, no replacement needed
- All existing presence utilities (`presence.ts`) — they operate on our types, not y-websocket types
- All existing serialisation logic (`serialise.ts`) — unchanged
- The public API of `CollabProvider` — consumers see no breaking changes except `providerOptions` removal

## Testing

- **Unit tests for `Awareness`:** setLocalState/getLocalState round-trip, change events, client removal, `setLocalState(null)` broadcasts removal
- **Unit tests for `YjsWebSocketProvider`:** mock WebSocket, verify bidirectional handshake (both sides exchange state vectors + updates), verify reconnection backoff with jitter, verify status events, verify connect/disconnect/destroy lifecycle
- **Unit tests for protocol encoding:** verify message framing (type byte + payload)
- **Integration test:** two providers syncing a Y.Doc through a minimal in-memory WebSocket server

## Risks

- **Server compatibility:** Since we're defining a custom protocol, the server must speak it too. This is acceptable because no server exists yet.
- **Awareness JSON vs binary:** JSON is larger on the wire than lib0 binary encoding. For presence data (small payloads, <1 KB) this is negligible.
- **No reconnect limit:** Backoff retries indefinitely (capped at 30s intervals). This is intentional — a collab session should always try to reconnect. Consumers can monitor status events and show UI accordingly.
