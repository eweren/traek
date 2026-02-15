# Matured Node Type System

Plugin-artiges System fuer Custom Node Types mit formalisiertem Registry-Pattern und Lifecycle-Hooks.

## Progress

- [x] Types (`src/lib/node-types/types.ts`) — NodeTypeDefinition, NodeTypeAction
- [x] NodeTypeRegistry (`src/lib/node-types/NodeTypeRegistry.svelte.ts`) — reactive $state Map
- [x] Built-ins (`src/lib/node-types/builtins.ts`) — text + thought definitions
- [x] Barrel export (`src/lib/node-types/index.ts`) + createDefaultRegistry()
- [x] NodeToolbar (`src/lib/NodeToolbar.svelte`) — floating above active node
- [x] TraekEngine lifecycle hooks — onNodeCreated/onNodeDeleting callbacks
- [x] TraekCanvas integration — registry prop, unified rendering, toolbar, lifecycle wiring
- [x] Exports (`src/lib/index.ts`)
- [x] Demo migration — registry with debugNode + image types, toolbar actions

## Architecture

### Component Resolution Order

1. `registry.get(node.type)?.component` — registry wins
2. `(node as CustomTraekNode).component` — embedded component (addCustomNode)
3. `componentMap[node.type]` — legacy fallback
4. `thought` type — skipped (rendered inside TraekNodeWrapper)
5. Fallback — error card

### Lifecycle Hooks (decoupled)

```
TraekEngine                    TraekCanvas                   NodeTypeRegistry
    |                              |                              |
    | -- onNodeCreated callback -> |                              |
    |                              | -- registry.get(type) -----> |
    |                              | <-- definition --------------|
    |                              | -- definition.onCreate() --> |
```

Engine fires callbacks, TraekCanvas wires them to registry lookups. Engine never imports registry.

### selfWrapping

Components that manage their own TraekNodeWrapper (e.g. TextNode) set `selfWrapping: true`. They receive viewport props directly. All other registered components are wrapped by TraekCanvas.
