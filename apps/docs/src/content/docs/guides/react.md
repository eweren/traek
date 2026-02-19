---
title: Using with React
description: Integrate Træk into a React application.
---

# Using with React

## Installation

```bash
npm install @traek/react
```

Import the styles in your entry point (e.g. `main.tsx` or `App.tsx`):

```tsx
import '@traek/elements/styles.css';
```

## Basic Setup

```tsx
import { TraekCanvas, useTraekEngine, type MessageNode } from '@traek/react';
import '@traek/elements/styles.css';

function App() {
  const engine = useTraekEngine();

  function onSendMessage(input: string, _userNode: MessageNode) {
    engine.addNode(input, 'user');

    const assistantNode = engine.addNode('', 'assistant', {
      autofocus: true
    });

    engine.updateNode(assistantNode.id, { status: 'streaming' });

    // Simulate a response
    setTimeout(() => {
      engine.updateNode(assistantNode.id, {
        content: 'Hello! I received your message.',
        status: 'done'
      });
    }, 1000);
  }

  return (
    <TraekCanvas
      engine={engine}
      onSendMessage={onSendMessage}
      style={{ width: '100%', height: '100vh' }}
    />
  );
}

export default App;
```

## useTraekEngine Hook

The `useTraekEngine` hook creates and memoizes a `TraekEngine` instance. It accepts an optional partial configuration object:

```tsx
const engine = useTraekEngine({
  nodeWidth: 400,
  layoutGapX: 50,
  layoutGapY: 60
});
```

The engine instance is stable across re-renders. Use it to imperatively manage the conversation tree.

## Theming

Apply a theme using CSS custom properties or the theme utilities:

```tsx
import { applyThemeToRoot, darkTheme, lightTheme } from '@traek/react';

// Apply a theme globally
applyThemeToRoot(darkTheme);
```

Or use CSS custom properties directly:

```css
:root {
  --traek-canvas-bg: #0a0a0a;
  --traek-node-bg: #1a1a1a;
  --traek-node-active-border: #4ade80;
}
```

## With OpenAI Streaming

```tsx
import { TraekCanvas, useTraekEngine, type MessageNode } from '@traek/react';

function Chat() {
  const engine = useTraekEngine();

  async function onSendMessage(input: string, userNode: MessageNode) {
    const assistantNode = engine.addNode('', 'assistant', {
      autofocus: true
    });
    engine.updateNode(assistantNode.id, { status: 'streaming' });

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [{ role: 'user', content: input }] })
    });

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let content = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      content += decoder.decode(value, { stream: true });
      engine.updateNode(assistantNode.id, { content });
    }

    engine.updateNode(assistantNode.id, { status: 'done' });
  }

  return (
    <TraekCanvas
      engine={engine}
      onSendMessage={onSendMessage}
      style={{ width: '100%', height: '100vh' }}
    />
  );
}
```

## Available Props

The `<TraekCanvas>` React component accepts all `TraekCanvasOptions` from `@traek/elements`, plus:

- `className` — CSS class for the container div
- `style` — Inline styles for the container div

Key options include:

| Prop | Type | Description |
|------|------|-------------|
| `engine` | `TraekEngine` | Engine instance (use `useTraekEngine()`) |
| `onSendMessage` | `function` | Called when user submits a message |
| `mode` | `'auto' \| 'canvas' \| 'focus'` | UI mode (default: `'auto'`) |
| `tourDelay` | `number` | Delay before onboarding tour (-1 to disable) |
| `translations` | `object` | Partial i18n overrides |
| `onRetry` | `function` | Called when user retries a node |
| `onEditNode` | `function` | Called when user edits a node |
