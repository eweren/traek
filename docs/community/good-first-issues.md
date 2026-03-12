# Good First Issues — træk

A curated list of starter-friendly contributions for new OSS contributors. Use this as a reference when creating GitHub issues labeled `good first issue`.

---

## Label Strategy

Create these labels in the GitHub repo (Settings → Labels):

| Label | Color | Description |
|-------|-------|-------------|
| `good first issue` | `#7057ff` | Ideal for first-time contributors |
| `help wanted` | `#008672` | Contributions especially welcome |
| `documentation` | `#0075ca` | Improvements to docs or comments |
| `accessibility` | `#e4e669` | A11y improvements |
| `testing` | `#d93f0b` | Test coverage additions |
| `enhancement` | `#a2eeef` | New feature or improvement |
| `bug` | `#d73a4a` | Something isn't working |
| `i18n` | `#f9d0c4` | Internationalization |

---

## Starter Issues to Create at Launch

The following issues should be created on GitHub at launch to give contributors immediate entry points.

### 1. Add missing i18n keys for tooltip text

**Label:** `good first issue`, `i18n`

**Description:**
Several tooltip strings in `TraekCanvas.svelte` are hardcoded in English and are not yet covered by the `translations` prop system. Audit the component for hardcoded strings and add them to the `DEFAULT_TRANSLATIONS` object and `TraekTranslations` type.

**Expected scope:** ~20-50 lines across 2-3 files. No deep knowledge of the engine required.

**References:** `src/lib/i18n.ts`, `src/lib/TraekCanvas.svelte`

---

### 2. Add `aria-label` to zoom controls

**Label:** `good first issue`, `accessibility`

**Description:**
The zoom in, zoom out, and reset buttons on the canvas toolbar are missing `aria-label` attributes. Screen readers currently announce them without meaningful context. Add appropriate labels and test with VoiceOver or NVDA.

**Expected scope:** ~5-10 lines. No engine knowledge required.

**References:** Look for zoom control buttons in `src/lib/TraekCanvas.svelte`

---

### 3. Document the `componentMap` prop with a code example

**Label:** `good first issue`, `documentation`

**Description:**
The `componentMap` prop on `TraekCanvas` allows custom node renderers, but the README and docs lack a concrete example of how to register a custom component. Add an example showing how to define a custom node type and pass it via `componentMap`.

**Expected scope:** Docs only. No code changes needed.

**References:** `README.md`, `src/lib/TraekCanvas.svelte`, `src/lib/types.ts`

---

### 4. Write unit tests for `snapshotToMarkdown`

**Label:** `good first issue`, `testing`

**Description:**
The `snapshotToMarkdown()` utility function in `src/lib/persistence.ts` is not currently covered by unit tests. Write Vitest tests covering: single-node tree, multi-branch tree, nodes with empty content, and nodes with special characters in content.

**Expected scope:** New test file ~60-100 lines. No component rendering required.

**References:** `src/lib/persistence.ts`, existing tests in `src/lib/*.test.ts`

---

### 5. Add `--traek-connection-line-width` CSS variable

**Label:** `good first issue`, `enhancement`

**Description:**
The connection line width between nodes is currently hardcoded. Extract it as a `--traek-connection-line-width` CSS custom property so consumers can customize it via theming.

**Expected scope:** ~5-10 lines. Follow the existing `--traek-*` pattern.

**References:** Connection line rendering in `src/lib/TraekCanvas.svelte`, theme definitions in `src/lib/themes.ts`

---

### 6. Add keyboard shortcut for "Copy branch as Markdown"

**Label:** `good first issue`, `enhancement`

**Description:**
The "Copy branch" action is available in the node action menu but has no keyboard shortcut. Add a keyboard shortcut (e.g., `Cmd+Shift+C` / `Ctrl+Shift+C`) that copies the current branch as Markdown.

**Expected scope:** ~20-30 lines in the keyboard shortcut handler. Follow the existing keybinding pattern.

**References:** `src/lib/keyboard.ts`, `src/lib/actions/`, `README.md` keyboard shortcuts section

---

### 7. Fix: `focusOnNode` should not scroll if node is already visible

**Label:** `good first issue`, `bug`

**Description:**
When `engine.focusOnNode(id)` is called on a node already in the viewport, the canvas still pans to center on it. This causes a jarring jump for nodes that are already fully visible. Add a check to skip the pan if the target node's bounding box is already within the viewport.

**Expected scope:** ~20-40 lines in `TraekEngine.svelte.ts`. Requires understanding the viewport/coordinate system.

**References:** `src/lib/TraekEngine.svelte.ts` → `focusOnNode` method

---

## Contribution Flow for First-Timers

Add this to issue descriptions for first-timers:

```
**Getting started:**
1. Fork the repo and clone it locally
2. `pnpm install` to install dependencies
3. Create a branch: `git checkout -b fix/your-issue-name`
4. Make your changes, run `pnpm run lint && pnpm run check && pnpm run test`
5. Open a PR — we'll review within a few days

Questions? Ask in #help on Discord or open a comment on this issue.
```

---

## Tracking

Once issues are created, link this document to the Discussions welcome thread and CONTRIBUTING.md. Review and refresh the list monthly — close any that are picked up and add new ones.
