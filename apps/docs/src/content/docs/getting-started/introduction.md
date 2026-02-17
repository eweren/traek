---
title: Introduction
description: What is Træk and why use it?
---

# Introduction

**Træk** is a spatial, tree-structured AI conversation UI toolkit. Instead of a traditional linear chat, Træk renders messages as **nodes on a pannable/zoomable canvas** with full branching support.

## Architecture

Træk is split into a framework-agnostic core and thin framework adapters:

| Package | Description |
|---------|-------------|
| `@traek/core` | Pure TypeScript engine – no framework dependencies |
| `@traek/svelte` | Svelte 5 adapter with `TraekCanvas`, `TraekEngine`, `TextNode` |
| `@traek/react` | React 18+ adapter with hooks and `TraekCanvas` |
| `@traek/vue` | Vue 3 adapter with composables and `TraekCanvas` |

All rendering adapters depend only on `@traek/core`. You can also use `@traek/core` directly for headless / vanilla TypeScript applications.

## Key Features

- **Spatial Canvas** — Pan and zoom through conversation history
- **Tree Branching** — Fork any message to explore different paths
- **Streaming Support** — Real-time token streaming with visual feedback
- **Framework Adapters** — Works with Svelte 5, React 18+, and Vue 3
- **Headless Core** — Use `@traek/core` without any UI framework
- **Keyboard Navigation** — Full keyboard shortcuts for power users
- **Dark Theme** — Dark-first design with CSS custom properties
- **Extensible** — Custom node types and component overrides

## When to Use Træk

Træk is ideal for:

- AI coding assistants with complex multi-turn conversations
- Research tools that benefit from branching exploration
- AI agent interfaces that need to visualise decision trees
- Any application where conversation history is a first-class citizen
