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
- Implement the Yjs sync handshake: send state vector on connect, apply incoming updates, forward local updates
- Exponential backoff reconnection (100 ms initial → max 30 s, doubles each attempt, resets on successful connection)
- Emit status events: `connecting`, `connected`, `disconnected`, `error`
- Expose `connect()` and `disconnect()` for manual control
- Host an `Awareness` instance and route awareness messages through the same socket

**Constructor signature:**
```ts
new YjsWebSocketProvider(serverUrl: string, roomId: string, doc: Y.Doc, options?: ProviderOptions)
```

**`ProviderOptions` (all optional):**
```ts
interface ProviderOptions {
  /** Called before each connection attempt. Return headers/params for auth. */
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
- Maintain a `Map<number, T>` of client states (keyed by Yjs `doc.clientID`)
- `setLocalState(state)` / `getLocalState()` / `getStates()` — same API shape as y-protocols Awareness
- Encode/decode awareness as JSON (UTF-8), not lib0 binary
- Emit `change` events when any client's state changes
- Remove state for clients that disconnect (notified by the provider)

### Binary Protocol

Minimal framing over WebSocket binary messages. First byte = message type, rest = payload.

| Byte | Type            | Payload                                    |
|------|-----------------|--------------------------------------------|
| `0`  | Sync: StateVector | Output of `Y.encodeStateVector(doc)`       |
| `1`  | Sync: Update     | Output of `Y.encodeStateAsUpdate(doc, sv)` |
| `2`  | Awareness        | JSON-encoded awareness state (UTF-8 bytes) |

**Handshake flow:**
1. Client opens WebSocket to `${serverUrl}/${roomId}`
2. Client sends message type `0` with its state vector
3. Server responds with message type `1` containing the missing updates
4. Both sides send type `1` messages for incremental updates thereafter
5. Awareness messages (type `2`) flow bidirectionally at any time

### Changes to CollabProvider

- Replace `import { WebsocketProvider } from 'y-websocket'` with `import { YjsWebSocketProvider } from './YjsWebSocketProvider.js'`
- `this.provider` type changes from `WebsocketProvider` to `YjsWebSocketProvider`
- `provider.awareness` returns our `Awareness` instance (same API surface)
- Remove `providerOptions?: Record<string, unknown>` from `CollabConfig`
- Add typed `connectionParams` and backoff options to `CollabConfig` instead

### Changes to `CollabConfig`

```ts
interface CollabConfig {
  serverUrl: string;
  roomId: string;
  user: CollabUser;
  cursorTimeoutMs?: number;
  /** Return headers/params for auth on each connection attempt. */
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

- **Unit tests for `Awareness`:** setLocalState/getLocalState round-trip, change events, client removal
- **Unit tests for `YjsWebSocketProvider`:** mock WebSocket, verify handshake sequence (state vector → update), verify reconnection backoff timing, verify status events
- **Unit tests for protocol encoding:** verify message framing (type byte + payload)
- **Integration test:** two providers syncing a Y.Doc through a minimal in-memory WebSocket server

## Risks

- **Server compatibility:** Since we're defining a custom protocol, the server must speak it too. This is acceptable because no server exists yet (option C).
- **Awareness JSON vs binary:** JSON is larger on the wire than lib0 binary encoding. For presence data (small payloads, <1 KB) this is negligible.
