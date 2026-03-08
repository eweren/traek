# Plugin Documentation Template

> Copy this file to your plugin's `README.md` and fill in each section.
> Lines starting with `>` are instructions — delete them before publishing.

---

# `<package-name>` — <Display Name>

> One sentence that describes what this plugin does. Keep it under 150 characters
> (it appears verbatim in the marketplace listing card).

[![npm version](https://img.shields.io/npm/v/<package-name>)](https://www.npmjs.com/package/<package-name>)
[![License](https://img.shields.io/npm/l/<package-name>)](./LICENSE)

> Optional: add a hero screenshot here. Use a dark-theme screenshot if possible
> since the marketplace defaults to dark mode.

![Screenshot of <Display Name> on a Træk canvas](./.github/screenshot-dark.png)

---

## What It Does

> One paragraph. Describe the problem this plugin solves, what types of content
> it handles, and any notable features. 100–300 words is ideal.

---

## Installation

```bash
npm install <package-name>
# or
pnpm add <package-name>
```

> If your plugin targets a specific Træk framework package, mention the peer dependency:

This plugin requires `@traek/svelte` (or `@traek/react` / `@traek/vue`) as a peer dependency.

```bash
npm install @traek/svelte <package-name>
```

### Register the Plugin

**Svelte:**

```svelte
<script lang="ts">
  import { TraekCanvas, TraekEngine, createDefaultRegistry } from '@traek/svelte'
  import { myNodeDefinition } from '<package-name>'

  const engine = new TraekEngine()
  const registry = createDefaultRegistry()
  registry.register(myNodeDefinition)
</script>

<TraekCanvas {engine} {registry} onSendMessage={handleSend} />
```

**React:**

```tsx
import { TraekCanvas, useCreateTraekEngine, createDefaultRegistry } from '@traek/react'
import { myNodeDefinition } from '<package-name>'

export function Chat() {
  const engine = useCreateTraekEngine()
  const registry = useMemo(() => {
    const r = createDefaultRegistry()
    r.register(myNodeDefinition)
    return r
  }, [])

  return <TraekCanvas engine={engine} registry={registry} onSendMessage={handleSend} />
}
```

**Vue:**

```vue
<script setup lang="ts">
import { TraekCanvas, useCreateTraekEngine, createDefaultRegistry } from '@traek/vue'
import { myNodeDefinition } from '<package-name>'

const engine = useCreateTraekEngine()
const registry = createDefaultRegistry()
registry.register(myNodeDefinition)
</script>

<template>
  <TraekCanvas :engine="engine" :registry="registry" :on-send-message="handleSend" />
</template>
```

---

## Node Type Reference

> Document each node type this plugin registers.

### `<node-type-key>` — <Node Type Display Name>

> Short description of this node type.

**Node data shape:**

```ts
interface <NodeType>Data {
  // Required fields
  field: type

  // Optional fields
  optionalField?: type
}
```

**Adding a node programmatically:**

```ts
engine.addNode({
  role: 'assistant',
  content: 'Optional caption or description',
  type: '<node-type-key>',
  status: 'done',
  data: {
    field: 'value'
  }
})
```

**Toolbar actions provided:**

| Action | Icon | Description |
|---|---|---|
| `action-id` | ♻ | What this action does |

---

## Configuration

> Document all configuration options accepted by your node definition or plugin initializer.
> If your plugin has no configuration, remove this section.

| Option | Type | Default | Description |
|---|---|---|---|
| `option` | `string` | `'default'` | What it controls |

---

## Styling

> Explain how to override the plugin's appearance. Reference specific CSS custom
> properties or class names that are designed to be overridden.

This plugin inherits Træk's `--traek-*` CSS custom properties. You can override per-node appearance:

```css
/* Customize <node-type-key> nodes */
.traek-node[data-type="<node-type-key>"] {
  --traek-node-bg: #1a1a2e;
}
```

> List any plugin-specific CSS custom properties your plugin exposes:

| Property | Default | Description |
|---|---|---|
| `--plugin-<name>-accent` | `#00d8ff` | Accent color for interactive elements |

---

## Persistence

> If your plugin serializes custom data, document what is saved and how to restore it.
> If your plugin has no special persistence logic, remove this section.

Node data is serialized via the `serializeData` / `deserializeData` hooks. The following fields are persisted:

| Field | Persisted | Notes |
|---|---|---|
| `field` | Yes | Always saved |
| `blobData` | No | Regenerated lazily on load |

---

## Changelog

> Keep a brief running changelog. Newest version at the top.
> This text is shown in the marketplace "What's New" section.

### x.y.z — YYYY-MM-DD

- Change 1
- Change 2

### 1.0.0 — YYYY-MM-DD

- Initial release

---

## License

[MIT](./LICENSE) — Copyright (c) <year> <author>

---

## Contributing

> Optional — link to CONTRIBUTING.md or describe your contribution process.

Issues and PRs welcome at `<repository-url>`.
