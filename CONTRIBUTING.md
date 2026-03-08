# Contributing to træk

Thank you for your interest in contributing to træk. This guide covers everything you need to get started.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Making Changes](#making-changes)
- [Testing](#testing)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Reporting Issues](#reporting-issues)
- [Good First Issues](#good-first-issues)
- [Community](#community)

---

## Code of Conduct

We are committed to a welcoming and respectful community. All participants are expected to:

- Use inclusive, respectful language
- Accept constructive feedback gracefully
- Focus on what is best for the community
- Show empathy toward other contributors

Harassment, discrimination, or abusive behavior will not be tolerated.

---

## How to Contribute

There are many ways to contribute to træk:

- **Fix a bug** — look for issues labeled `bug` or `good first issue`
- **Add a feature** — open an issue first to discuss before implementing
- **Improve documentation** — fix typos, add examples, clarify explanations
- **Write tests** — increase coverage for untested code paths
- **Share feedback** — open a GitHub Discussion with your experience or ideas

---

## Development Setup

### Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io) 9+

### Getting Started

```bash
git clone https://github.com/gettraek/traek.git
cd traek
pnpm install
```

### Running the development server

```bash
pnpm run dev
```

### Running Storybook

```bash
pnpm run storybook
```

---

## Project Structure

```
traek/
├── src/
│   └── lib/             # Core library (TraekEngine, TraekCanvas, etc.)
├── apps/
│   ├── docs/            # Documentation site
│   └── playground/      # træk Playground (SvelteKit app)
├── packages/
│   ├── mcp/             # @traek/mcp — Model Context Protocol server
│   └── collab/          # @traek/collab — real-time collaboration
└── docs/                # Internal docs, plans, brand guides
```

Key files:

| File | Purpose |
|------|---------|
| `src/lib/TraekEngine.svelte.ts` | Core state management for the conversation tree |
| `src/lib/TraekCanvas.svelte` | Main exported canvas component |
| `src/lib/index.ts` | Public API surface — all exports |

---

## Making Changes

### 1. Open an issue first (for non-trivial changes)

Before writing code for a new feature or significant refactor, open a GitHub issue to discuss the approach. This avoids duplicate work and ensures alignment.

### 2. Create a branch

```bash
git checkout -b your-feature-branch
```

Branch naming conventions:

- `feat/short-description` for new features
- `fix/short-description` for bug fixes
- `docs/short-description` for documentation changes
- `refactor/short-description` for refactoring

### 3. Follow the code conventions

- **Language**: TypeScript strict mode everywhere
- **Framework**: Svelte 5 runes syntax (`$state`, `$derived`, `$effect`)
- **Formatting**: tabs, single quotes, no trailing commas, 100 char line width
- **Theming**: CSS custom properties prefixed with `--traek-*`
- **Validation**: Zod for all runtime validation at external boundaries
- **Performance**: Use O(1) map-based lookups (`nodeMap`, `connectionMap`) — avoid `Array.find/filter`

Run the formatter before committing:

```bash
pnpm run format
```

### 4. Keep changes focused

Each pull request should address one concern. Avoid mixing bug fixes, refactors, and features in a single PR.

---

## Testing

All contributions must pass the full test suite:

```bash
pnpm run lint        # ESLint + Prettier check
pnpm run check       # Type-check with svelte-check
pnpm run test:unit   # Run unit tests (Vitest)
```

Or all at once:

```bash
pnpm run lint && pnpm run check && pnpm run test
```

### Testing conventions

træk uses a **logic-extraction testing pattern** for Svelte components. Because Svelte 5 runes are incompatible with jsdom/testing-library component rendering, component tests must test pure functions and stores rather than rendering components directly.

When adding new functionality:
- Extract logic into pure functions or engine methods where possible
- Write Vitest unit tests for that logic
- Use Playwright for end-to-end tests that require real rendering

---

## Submitting a Pull Request

1. Push your branch and open a PR against `main`
2. Fill out the PR template — describe what changed and why
3. Ensure all CI checks pass
4. Request a review (a maintainer will be assigned automatically)

### PR checklist

- [ ] The change is focused on a single concern
- [ ] New code has test coverage
- [ ] `pnpm run lint && pnpm run check && pnpm run test` passes
- [ ] Public API changes are reflected in `src/lib/index.ts` and documented
- [ ] No secrets, tokens, or private data are included

---

## Reporting Issues

When filing a bug report, include:

- træk version (`npm list traek`)
- Minimal reproducible example (CodeSandbox or StackBlitz preferred)
- Browser and OS
- What you expected vs. what happened

For security vulnerabilities, do **not** open a public issue. Email us directly at security@gettraek.com.

---

## Good First Issues

If you are new to the project, look for issues labeled [`good first issue`](https://github.com/gettraek/traek/labels/good%20first%20issue). These are scoped to be approachable without deep knowledge of the internals.

Good areas to start:

- **Accessibility improvements** — ARIA attributes, keyboard navigation gaps
- **Documentation** — examples, API clarifications, missing props
- **Test coverage** — unit tests for engine utility functions
- **Theming** — adding `--traek-*` variables that are currently hardcoded
- **i18n** — adding translation keys for strings that are not yet translatable
- **Error handling** — better error messages for invalid props or state

If you pick up a good first issue, leave a comment so others know it is being worked on.

---

## Community

- **GitHub Discussions** — [github.com/gettraek/traek/discussions](https://github.com/gettraek/traek/discussions) — questions, ideas, show-and-tell
- **Discord** — [discord.gg/traek](https://discord.gg/traek) — real-time chat with the team and community

We appreciate every contribution, big or small.
