# @traek/react

React adapter for [Træk](https://github.com/gettraek/traek) — a spatial, tree-structured AI conversation UI library.

Instead of a linear chat history, conversations are rendered as nodes on a pannable/zoomable canvas with full branching support.

## Installation

```bash
npm install @traek/react
# peer deps
npm install react react-dom
```

## Quick Start

```tsx
import { TraekCanvas } from '@traek/react';

export default function App() {
	async function handleSend(text, userNode) {
		// stream a response from your AI API and update the engine:
		// engine.updateNode(assistantNode.id, { content: chunk, status: 'done' })
	}

	return (
		<div style={{ width: '100vw', height: '100vh' }}>
			<TraekCanvas onSendMessage={handleSend} />
		</div>
	);
}
```

## API

### `<TraekCanvas>`

The main component. Renders a pannable/zoomable canvas with the conversation tree.

| Prop             | Type                                | Default  | Description                              |
| ---------------- | ----------------------------------- | -------- | ---------------------------------------- |
| `engine`         | `TraekEngine`                       | internal | Provide an existing engine instance      |
| `config`         | `Partial<TraekEngineConfig>`        | —        | Engine config when using internal engine |
| `onSendMessage`  | `(text, userNode, action?) => void` | —        | Called when the user submits a message   |
| `onNodesChanged` | `() => void`                        | —        | Called whenever any node changes         |
| `initialScale`   | `number`                            | `1`      | Initial zoom scale                       |
| `componentMap`   | `Record<string, ComponentType>`     | —        | Custom node renderers keyed by node type |
| `className`      | `string`                            | —        | CSS class on the root element            |
| `style`          | `CSSProperties`                     | —        | Inline styles on the root element        |

### `useTraekEngine(engine)`

Subscribe to a `TraekEngine` instance and get its reactive state. Uses `useSyncExternalStore` for tear-free React 18 rendering.

```tsx
import { TraekEngine } from '@traek/react';
import { useTraekEngine } from '@traek/react';

const engine = useMemo(() => new TraekEngine(), []);
const { nodes, activeNodeId } = useTraekEngine(engine);
```

### `useCreateTraekEngine(config?)`

Create a stable `TraekEngine` instance scoped to the component lifetime.

```tsx
import { useCreateTraekEngine, useTraekEngine } from '@traek/react';

function MyChat() {
	const engine = useCreateTraekEngine({ nodeWidth: 400 });
	const { nodes } = useTraekEngine(engine);
	// ...
}
```

### `<TraekNode>`

A positioned, viewport-aware wrapper for a single conversation node. Replaces off-screen nodes with same-size placeholders via `IntersectionObserver`, and keeps the engine's height metadata current via `ResizeObserver`.

```tsx
import { TraekNode, TextNode } from '@traek/react';

function MyCanvas({ nodes, engine, activeNodeId }) {
	return (
		<>
			{nodes.map((node) => (
				<TraekNode key={node.id} node={node} engine={engine} isActive={activeNodeId === node.id}>
					<TextNode node={node} engine={engine} isActive={activeNodeId === node.id} />
				</TraekNode>
			))}
		</>
	);
}
```

| Prop           | Type                       | Default   | Description                     |
| -------------- | -------------------------- | --------- | ------------------------------- |
| `node`         | `Node`                     | required  | The node to render              |
| `engine`       | `TraekEngine`              | required  | Engine instance for callbacks   |
| `isActive`     | `boolean`                  | required  | Whether this node is active     |
| `viewportRoot` | `Element \| null`          | `null`    | Root for `IntersectionObserver` |
| `gridStep`     | `number`                   | `20`      | Canvas grid step in px          |
| `nodeWidth`    | `number`                   | `350`     | Node width in px                |
| `rootMargin`   | `string`                   | `'100px'` | Intersection root margin        |
| `onActivate`   | `(nodeId: string) => void` | —         | Called on click/Enter/Space     |

### `<TextNode>`

The default text node renderer. Displays markdown content with streaming indicators and error states.

```tsx
import { TextNode } from '@traek/react';

// Used automatically by TraekCanvas, or manually in custom renderers:
<TextNode node={node} engine={engine} isActive={isActive} />;
```

## Streaming Example

```tsx
import { useMemo } from 'react';
import { TraekCanvas, TraekEngine } from '@traek/react';

export default function StreamingChat() {
	const engine = useMemo(() => new TraekEngine(), []);

	async function handleSend(text, userNode) {
		const assistantNode = engine.addNode('', 'assistant', { parentId: userNode.id });
		engine.updateNode(assistantNode.id, { status: 'streaming' });

		const response = await fetch('/api/chat', {
			method: 'POST',
			body: JSON.stringify({ message: text })
		});

		const reader = response.body.getReader();
		const decoder = new TextDecoder();
		let content = '';

		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			content += decoder.decode(value);
			engine.updateNode(assistantNode.id, { content, status: 'streaming' });
		}

		engine.updateNode(assistantNode.id, { status: 'done' });
	}

	return (
		<div style={{ width: '100vw', height: '100vh' }}>
			<TraekCanvas engine={engine} onSendMessage={handleSend} />
		</div>
	);
}
```

## Custom Node Types

```tsx
import { TraekCanvas } from '@traek/react';
import type { Node, TraekEngine } from '@traek/react';

function CodeNode({
	node,
	engine,
	isActive
}: {
	node: Node;
	engine: TraekEngine;
	isActive: boolean;
}) {
	return <pre style={{ padding: 12, background: '#111' }}>{(node as any).content}</pre>;
}

<TraekCanvas componentMap={{ code: CodeNode }} onSendMessage={handleSend} />;
```

## Theming

All visual styles use CSS custom properties prefixed with `--traek-*`. Override them on `:root` or any ancestor:

```css
:root {
	--traek-canvas-bg: #0a0a0a;
	--traek-accent: #7c3aed;
	--traek-node-bg: rgba(255, 255, 255, 0.03);
	--traek-border: rgba(255, 255, 255, 0.08);
	--traek-text: rgba(255, 255, 255, 0.9);
}
```

Use the built-in `ThemeProvider` for structured theme management:

```tsx
import { ThemeProvider, TraekCanvas } from '@traek/react';

<ThemeProvider theme="dark">
	<TraekCanvas onSendMessage={handleSend} />
</ThemeProvider>;
```

## License

MIT
