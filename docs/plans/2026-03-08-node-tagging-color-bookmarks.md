# Node Tagging, Color Coding & Bookmarks Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add color coding, bookmarks, custom tags, a sidebar panel, bulk operations, and quick-jump navigation to Traek nodes.

**Architecture:** Extend `node.metadata` with `color` and `bookmarked` fields, add engine methods for all new operations, build UI components (ColorPicker, BookmarkBadge, TagBookmarkSidebar, BulkActionToolbar, BookmarkJumpOverlay), and integrate into TraekCanvas via keyboard shortcuts. All state persists through the existing metadata serialization path; snapshot schema bumped to v2 to also persist custom tag definitions.

**Tech Stack:** Svelte 5 runes, TypeScript strict mode, Zod for schema validation, CSS custom properties (`--traek-*`), Vitest for unit tests (logic-extraction only — no jsdom component rendering).

---

## Conventions to Know

- **File paths** are relative to `packages/svelte/src/lib/` unless stated otherwise.
- **Engine class** is in `TraekEngine.svelte.ts`. Add new public methods there; keep private helpers near the bottom of the class.
- **Types from `@traek/core`**: `Node`, `MessageNode`, `AddNodePayload`, etc. — import them from there, not from the engine file.
- **Tests** use Vitest logic-extraction pattern: test pure functions and engine methods directly, never render Svelte components in jsdom.
- **CSS variables** are defined in `theme/tokens.ts` (Zod schema) and applied by `ThemeProvider.svelte`. Follow the exact same pattern when adding new ones.
- **Imports** use `$lib/` path alias inside the package (e.g. `import { getNodeTags } from '$lib/tags/tagUtils'`).
- **Run tests**: `cd packages/svelte && npx vitest run path/to/test.ts`
- **Run all checks**: `cd packages/svelte && pnpm run lint && pnpm run check && pnpm run test`

---

## Task 1: Define NodeColor type and extend metadata types

**Files:**
- Modify: `packages/core/src/types.ts` (add `NodeColor` type and `color`/`bookmarked` to metadata)
- If `@traek/core` types aren't editable (monorepo package), add them in: `TraekEngine.svelte.ts` (exported alongside existing types)

**Step 1: Find where Node metadata type is defined**

Check `packages/core/src/types.ts` for the `Node` interface. Look for `metadata?: { x: number, y: number, ... }`.

**Step 2: Add NodeColor and metadata extension**

In `packages/core/src/types.ts`, add after existing types:

```ts
export type NodeColor =
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'cyan';

export interface CustomTag {
  slug: string;    // unique identifier, e.g. 'my-tag'
  label: string;  // display name
  color: string;  // hex or CSS color, e.g. '#3b82f6'
}
```

Then extend the `Node` interface's `metadata` to include:
```ts
metadata?: {
  x: number;
  y: number;
  height?: number;
  tags?: string[];
  color?: NodeColor | null;
  bookmarked?: boolean;
  bookmarkLabel?: string;
  outdated?: boolean;
  [key: string]: unknown;
};
```

**Step 3: Re-export from TraekEngine.svelte.ts**

In `TraekEngine.svelte.ts`, add to the re-export block at the top:
```ts
export type { NodeColor, CustomTag } from '@traek/core';
```

**Step 4: Add customTags state to TraekEngine class**

In `TraekEngine.svelte.ts`, inside the class body, add after existing state fields:
```ts
/** Registry of user-defined custom tags. */
customTags = $state<Map<string, CustomTag>>(new Map());
```

**Step 5: Verify TypeScript compiles**

```bash
cd packages/svelte && pnpm run check
```

Expected: No errors related to the new types.

**Step 6: Commit**

```bash
git add packages/core/src/types.ts packages/svelte/src/lib/TraekEngine.svelte.ts
git commit -m "feat(types): add NodeColor, CustomTag types and engine customTags state (TRK-71)"
```

---

## Task 2: Engine methods — color coding

**Files:**
- Modify: `TraekEngine.svelte.ts`
- Create: `TraekEngine.color.test.ts` (new test file in `src/__tests__/`)

**Step 1: Write failing tests**

Create `packages/svelte/src/__tests__/TraekEngine.color.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { TraekEngine } from '../lib/TraekEngine.svelte';

describe('TraekEngine: color coding', () => {
  it('sets a color on a node', () => {
    const engine = new TraekEngine();
    engine.addNode('Hello', 'user');
    const nodeId = engine.nodes[0].id;

    engine.setNodeColor(nodeId, 'red');

    expect(engine.nodes[0].metadata?.color).toBe('red');
  });

  it('clears a color by setting null', () => {
    const engine = new TraekEngine();
    engine.addNode('Hello', 'user');
    const nodeId = engine.nodes[0].id;
    engine.setNodeColor(nodeId, 'blue');

    engine.setNodeColor(nodeId, null);

    expect(engine.nodes[0].metadata?.color).toBeNull();
  });

  it('sets color on entire branch', () => {
    const engine = new TraekEngine();
    engine.addNode('Root', 'user');
    const rootId = engine.nodes[0].id;
    engine.addNode('Child 1', 'assistant', { parentIds: [rootId] });
    engine.addNode('Child 2', 'user', { parentIds: [rootId] });

    engine.setNodeColorBranch(rootId, 'green');

    for (const node of engine.nodes) {
      expect(node.metadata?.color).toBe('green');
    }
  });

  it('returns null color for uncolored node', () => {
    const engine = new TraekEngine();
    engine.addNode('Hello', 'user');
    const nodeId = engine.nodes[0].id;
    expect(engine.getNodeColor(nodeId)).toBeNull();
  });
});
```

**Step 2: Run test to verify it fails**

```bash
cd packages/svelte && npx vitest run src/__tests__/TraekEngine.color.test.ts
```

Expected: FAIL — `setNodeColor is not a function`

**Step 3: Implement engine methods**

In `TraekEngine.svelte.ts`, add these methods to the class (near the existing tag methods):

```ts
/** Get the color for a node, or null if unset. */
getNodeColor(nodeId: string): NodeColor | null {
  const node = this.getNode(nodeId);
  return (node?.metadata?.color as NodeColor) ?? null;
}

/** Set or clear the color for a single node. */
setNodeColor(nodeId: string, color: NodeColor | null): void {
  const node = this.getNode(nodeId);
  if (!node) return;
  node.metadata = { ...(node.metadata ?? { x: 0, y: 0 }), color };
}

/** Set or clear the color for a node and all its descendants. */
setNodeColorBranch(nodeId: string, color: NodeColor | null): void {
  const node = this.getNode(nodeId);
  if (!node) return;
  this.setNodeColor(nodeId, color);
  const children = this.childrenIdMap.get(nodeId) ?? [];
  for (const childId of children) {
    this.setNodeColorBranch(childId, color);
  }
}
```

**Step 4: Run tests to verify they pass**

```bash
cd packages/svelte && npx vitest run src/__tests__/TraekEngine.color.test.ts
```

Expected: All 4 tests PASS.

**Step 5: Commit**

```bash
git add packages/svelte/src/__tests__/TraekEngine.color.test.ts packages/svelte/src/lib/TraekEngine.svelte.ts
git commit -m "feat(engine): add setNodeColor, setNodeColorBranch, getNodeColor methods (TRK-71)"
```

---

## Task 3: Engine methods — bookmarks

**Files:**
- Modify: `TraekEngine.svelte.ts`
- Create: `src/__tests__/TraekEngine.bookmarks.test.ts`

**Step 1: Write failing tests**

Create `packages/svelte/src/__tests__/TraekEngine.bookmarks.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { TraekEngine } from '../lib/TraekEngine.svelte';

describe('TraekEngine: bookmarks', () => {
  it('bookmarks a node', () => {
    const engine = new TraekEngine();
    engine.addNode('Hello', 'user');
    const nodeId = engine.nodes[0].id;

    engine.bookmarkNode(nodeId, 'My bookmark');

    expect(engine.nodes[0].metadata?.bookmarked).toBe(true);
    expect(engine.nodes[0].metadata?.bookmarkLabel).toBe('My bookmark');
  });

  it('bookmarks a node without a label', () => {
    const engine = new TraekEngine();
    engine.addNode('Hello', 'user');
    const nodeId = engine.nodes[0].id;

    engine.bookmarkNode(nodeId);

    expect(engine.nodes[0].metadata?.bookmarked).toBe(true);
    expect(engine.nodes[0].metadata?.bookmarkLabel).toBeUndefined();
  });

  it('unbookmarks a node', () => {
    const engine = new TraekEngine();
    engine.addNode('Hello', 'user');
    const nodeId = engine.nodes[0].id;
    engine.bookmarkNode(nodeId, 'test');

    engine.unbookmarkNode(nodeId);

    expect(engine.nodes[0].metadata?.bookmarked).toBe(false);
  });

  it('getBookmarks returns only bookmarked nodes', () => {
    const engine = new TraekEngine();
    engine.addNode('A', 'user');
    engine.addNode('B', 'user');
    engine.addNode('C', 'user');
    const [a, b] = engine.nodes;
    engine.bookmarkNode(a.id, 'First');
    engine.bookmarkNode(b.id);

    const bookmarks = engine.getBookmarks();
    expect(bookmarks).toHaveLength(2);
    expect(bookmarks[0].node.id).toBe(a.id);
    expect(bookmarks[0].label).toBe('First');
  });

  it('getBookmarks returns empty array when no bookmarks', () => {
    const engine = new TraekEngine();
    engine.addNode('Hello', 'user');
    expect(engine.getBookmarks()).toHaveLength(0);
  });
});
```

**Step 2: Run test to verify it fails**

```bash
cd packages/svelte && npx vitest run src/__tests__/TraekEngine.bookmarks.test.ts
```

Expected: FAIL — `bookmarkNode is not a function`

**Step 3: Implement bookmark engine methods**

In `TraekEngine.svelte.ts`, add to the class:

```ts
/** Bookmark a node with an optional display label. */
bookmarkNode(nodeId: string, label?: string): void {
  const node = this.getNode(nodeId);
  if (!node) return;
  node.metadata = {
    ...(node.metadata ?? { x: 0, y: 0 }),
    bookmarked: true,
    ...(label !== undefined ? { bookmarkLabel: label } : {})
  };
}

/** Remove the bookmark from a node. */
unbookmarkNode(nodeId: string): void {
  const node = this.getNode(nodeId);
  if (!node) return;
  node.metadata = {
    ...(node.metadata ?? { x: 0, y: 0 }),
    bookmarked: false,
    bookmarkLabel: undefined
  };
}

/** Get all bookmarked nodes, sorted by canvas y then x position. */
getBookmarks(): { node: Node; label?: string }[] {
  return this.nodes
    .filter((n) => n.metadata?.bookmarked === true)
    .sort((a, b) => {
      const ay = a.metadata?.y ?? 0;
      const by = b.metadata?.y ?? 0;
      if (ay !== by) return ay - by;
      return (a.metadata?.x ?? 0) - (b.metadata?.x ?? 0);
    })
    .map((node) => ({
      node,
      label: node.metadata?.bookmarkLabel as string | undefined
    }));
}
```

**Step 4: Run tests**

```bash
cd packages/svelte && npx vitest run src/__tests__/TraekEngine.bookmarks.test.ts
```

Expected: All 5 PASS.

**Step 5: Commit**

```bash
git add packages/svelte/src/__tests__/TraekEngine.bookmarks.test.ts packages/svelte/src/lib/TraekEngine.svelte.ts
git commit -m "feat(engine): add bookmark engine methods (TRK-71)"
```

---

## Task 4: Engine methods — custom tags

**Files:**
- Modify: `TraekEngine.svelte.ts`
- Modify: `tags/tagUtils.ts`
- Create: `src/__tests__/TraekEngine.customtags.test.ts`

**Step 1: Write failing tests**

Create `packages/svelte/src/__tests__/TraekEngine.customtags.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { TraekEngine } from '../lib/TraekEngine.svelte';

describe('TraekEngine: custom tags', () => {
  it('creates a custom tag', () => {
    const engine = new TraekEngine();
    const tag = engine.createCustomTag('My Label', '#ff0000');
    expect(tag.label).toBe('My Label');
    expect(tag.color).toBe('#ff0000');
    expect(tag.slug).toMatch(/^my-label/);
  });

  it('stores custom tag in engine.customTags', () => {
    const engine = new TraekEngine();
    const tag = engine.createCustomTag('Feature', '#3b82f6');
    expect(engine.customTags.get(tag.slug)).toEqual(tag);
  });

  it('deletes a custom tag', () => {
    const engine = new TraekEngine();
    const tag = engine.createCustomTag('Remove Me', '#aaa');
    engine.deleteCustomTag(tag.slug);
    expect(engine.customTags.has(tag.slug)).toBe(false);
  });

  it('listAllTags returns predefined + custom', () => {
    const engine = new TraekEngine();
    engine.createCustomTag('Mine', '#123456');
    const all = engine.listAllTags();
    // Should include at least 5 predefined + 1 custom
    expect(all.length).toBeGreaterThanOrEqual(6);
    const slugs = all.map((t) => t.slug);
    expect(slugs).toContain('important');
    expect(slugs).toContain('mine');
  });
});
```

**Step 2: Run test to verify it fails**

```bash
cd packages/svelte && npx vitest run src/__tests__/TraekEngine.customtags.test.ts
```

Expected: FAIL — `createCustomTag is not a function`

**Step 3: Update tagUtils.ts to unify tag types**

In `tags/tagUtils.ts`, add a unified `Tag` type and a `listBuiltinTags()` helper at the bottom:

```ts
import type { CustomTag } from '../TraekEngine.svelte';

export interface Tag {
  slug: string;
  label: string;
  color: string;
  bgColor: string;
  isCustom?: boolean;
}

export function listBuiltinTags(): Tag[] {
  return Object.entries(PREDEFINED_TAGS).map(([slug, cfg]) => ({
    slug,
    label: cfg.label,
    color: cfg.color,
    bgColor: cfg.bgColor,
    isCustom: false
  }));
}
```

**Step 4: Implement custom tag engine methods**

In `TraekEngine.svelte.ts`, add to the class:

```ts
/** Create a custom tag and store it in the registry. Returns the new tag. */
createCustomTag(label: string, color: string): CustomTag {
  const slug = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 40);
  // Make slug unique if collision
  const finalSlug = this.customTags.has(slug) ? `${slug}-${Date.now()}` : slug;
  const tag: CustomTag = { slug: finalSlug, label, color };
  this.customTags.set(finalSlug, tag);
  return tag;
}

/** Remove a custom tag from the registry. */
deleteCustomTag(slug: string): void {
  this.customTags.delete(slug);
}

/** Get all tags (predefined + custom) as a unified list. */
listAllTags(): Array<{ slug: string; label: string; color: string; bgColor: string; isCustom?: boolean }> {
  const { listBuiltinTags } = await import('./tags/tagUtils');  // replace with static import at file top
  const builtin = listBuiltinTags();
  const custom = Array.from(this.customTags.values()).map((t) => ({
    slug: t.slug,
    label: t.label,
    color: t.color,
    bgColor: `${t.color}26`, // ~15% opacity
    isCustom: true as const
  }));
  return [...builtin, ...custom];
}
```

Note: Replace the dynamic `await import` with a static import at the top of `TraekEngine.svelte.ts`:
```ts
import { listBuiltinTags } from '$lib/tags/tagUtils';
```

Then use `listBuiltinTags()` directly without await.

**Step 5: Run tests**

```bash
cd packages/svelte && npx vitest run src/__tests__/TraekEngine.customtags.test.ts
```

Expected: All 4 PASS.

**Step 6: Commit**

```bash
git add packages/svelte/src/__tests__/TraekEngine.customtags.test.ts \
  packages/svelte/src/lib/TraekEngine.svelte.ts \
  packages/svelte/src/lib/tags/tagUtils.ts
git commit -m "feat(engine): add custom tag creation and listAllTags (TRK-71)"
```

---

## Task 5: Engine bulk operations

**Files:**
- Modify: `TraekEngine.svelte.ts`
- Create: `src/__tests__/TraekEngine.bulk.test.ts`

**Step 1: Write failing tests**

Create `packages/svelte/src/__tests__/TraekEngine.bulk.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { TraekEngine } from '../lib/TraekEngine.svelte';

describe('TraekEngine: bulk operations', () => {
  it('bulkSetColor sets color on multiple nodes', () => {
    const engine = new TraekEngine();
    engine.addNode('A', 'user');
    engine.addNode('B', 'user');
    const ids = engine.nodes.map((n) => n.id);

    engine.bulkSetColor(ids, 'blue');

    for (const node of engine.nodes) {
      expect(node.metadata?.color).toBe('blue');
    }
  });

  it('bulkAddTag adds tag to multiple nodes', () => {
    const engine = new TraekEngine();
    engine.addNode('A', 'user');
    engine.addNode('B', 'user');
    const ids = engine.nodes.map((n) => n.id);

    engine.bulkAddTag(ids, 'important');

    for (const node of engine.nodes) {
      expect(node.metadata?.tags).toContain('important');
    }
  });

  it('bulkRemoveTag removes tag from multiple nodes', () => {
    const engine = new TraekEngine();
    engine.addNode('A', 'user');
    engine.addNode('B', 'user');
    const ids = engine.nodes.map((n) => n.id);
    engine.bulkAddTag(ids, 'todo');

    engine.bulkRemoveTag(ids, 'todo');

    for (const node of engine.nodes) {
      expect(node.metadata?.tags ?? []).not.toContain('todo');
    }
  });

  it('bulkSetBookmark bookmarks multiple nodes', () => {
    const engine = new TraekEngine();
    engine.addNode('A', 'user');
    engine.addNode('B', 'user');
    const ids = engine.nodes.map((n) => n.id);

    engine.bulkSetBookmark(ids, true);

    for (const node of engine.nodes) {
      expect(node.metadata?.bookmarked).toBe(true);
    }
  });
});
```

**Step 2: Run test to verify it fails**

```bash
cd packages/svelte && npx vitest run src/__tests__/TraekEngine.bulk.test.ts
```

Expected: FAIL — `bulkSetColor is not a function`

**Step 3: Implement bulk methods**

In `TraekEngine.svelte.ts`, add:

```ts
/** Set color on multiple nodes at once. */
bulkSetColor(nodeIds: string[], color: NodeColor | null): void {
  for (const id of nodeIds) this.setNodeColor(id, color);
}

/** Add a tag to multiple nodes at once. */
bulkAddTag(nodeIds: string[], tag: string): void {
  for (const id of nodeIds) this.addTag(id, tag);
}

/** Remove a tag from multiple nodes at once. */
bulkRemoveTag(nodeIds: string[], tag: string): void {
  for (const id of nodeIds) this.removeTag(id, tag);
}

/** Set bookmark state on multiple nodes at once. */
bulkSetBookmark(nodeIds: string[], bookmarked: boolean): void {
  for (const id of nodeIds) {
    if (bookmarked) this.bookmarkNode(id);
    else this.unbookmarkNode(id);
  }
}
```

**Step 4: Run tests**

```bash
cd packages/svelte && npx vitest run src/__tests__/TraekEngine.bulk.test.ts
```

Expected: All 4 PASS.

**Step 5: Commit**

```bash
git add packages/svelte/src/__tests__/TraekEngine.bulk.test.ts packages/svelte/src/lib/TraekEngine.svelte.ts
git commit -m "feat(engine): add bulk color, tag, and bookmark operations (TRK-71)"
```

---

## Task 6: Extend SearchFilters and searchUtils

**Files:**
- Modify: `search/searchUtils.ts`
- Modify: `search/__tests__/searchUtils.test.ts`

**Step 1: Write failing tests**

In `search/__tests__/searchUtils.test.ts`, add these tests to the existing suite (or create the file if it doesn't exist):

```ts
// Add to existing tests or create new describe block
describe('searchNodes with extended filters', () => {
  const makeNode = (id: string, content: string, tags: string[] = [], color?: string, bookmarked?: boolean) => ({
    id,
    parentIds: [],
    role: 'user' as const,
    type: 'text',
    status: 'done' as const,
    content,
    metadata: { x: 0, y: 0, tags, ...(color ? { color } : {}), ...(bookmarked ? { bookmarked } : {}) }
  });

  it('filters by tag (OR logic)', () => {
    const nodes = [
      makeNode('1', 'hello', ['important']),
      makeNode('2', 'world', ['todo']),
      makeNode('3', 'other', [])
    ];
    const result = searchNodes(nodes, 'l', { tags: ['important'] });
    expect(result).toContain('1');
    expect(result).not.toContain('2');
    expect(result).not.toContain('3');
  });

  it('filters bookmarked only', () => {
    const nodes = [
      makeNode('1', 'hello', [], undefined, true),
      makeNode('2', 'hello', [], undefined, false)
    ];
    const result = searchNodes(nodes, 'hello', { bookmarked: true });
    expect(result).toContain('1');
    expect(result).not.toContain('2');
  });

  it('filters by color', () => {
    const nodes = [
      makeNode('1', 'hello', [], 'red'),
      makeNode('2', 'hello', [], 'blue'),
      makeNode('3', 'hello')
    ];
    const result = searchNodes(nodes, 'hello', { colors: ['red'] });
    expect(result).toContain('1');
    expect(result).not.toContain('2');
    expect(result).not.toContain('3');
  });
});
```

**Step 2: Run test to verify it fails**

```bash
cd packages/svelte && npx vitest run src/lib/search/__tests__/searchUtils.test.ts
```

Expected: FAIL — filter options aren't applied.

**Step 3: Extend SearchFilters type and searchNodes function**

In `search/searchUtils.ts`:

```ts
import type { NodeColor } from '../TraekEngine.svelte';

export type SearchFilters = {
  roles?: Array<'user' | 'assistant' | 'system'>;
  statuses?: Array<string>;
  tags?: string[];         // NEW: filter by tag slugs (OR logic)
  colors?: NodeColor[];    // NEW: filter by color
  bookmarked?: boolean;    // NEW: show only bookmarked nodes
};
```

In the `searchNodes` function body, add after the existing `statusFilter` variable:

```ts
const tagFilter = filters?.tags && filters.tags.length > 0 ? filters.tags : null;
const colorFilter = filters?.colors && filters.colors.length > 0 ? filters.colors : null;
const bookmarkedFilter = filters?.bookmarked ?? null;
```

Then add these checks inside the loop, after existing role/status checks but before content check:

```ts
if (tagFilter) {
  const nodeTags = (node.metadata?.tags as string[]) ?? [];
  if (!tagFilter.some((t) => nodeTags.includes(t))) continue;
}
if (colorFilter) {
  const nodeColor = node.metadata?.color as NodeColor | undefined;
  if (!nodeColor || !colorFilter.includes(nodeColor)) continue;
}
if (bookmarkedFilter !== null) {
  if (bookmarkedFilter && !node.metadata?.bookmarked) continue;
}
```

**Step 4: Run tests**

```bash
cd packages/svelte && npx vitest run src/lib/search/__tests__/searchUtils.test.ts
```

Expected: All PASS.

**Step 5: Commit**

```bash
git add packages/svelte/src/lib/search/searchUtils.ts packages/svelte/src/lib/search/__tests__/searchUtils.test.ts
git commit -m "feat(search): extend SearchFilters with tags, colors, bookmarked filters (TRK-71)"
```

---

## Task 7: Snapshot schema v2 with custom tags

**Files:**
- Modify: `persistence/schemas.ts`
- Modify: `TraekEngine.svelte.ts` (`serialize` and `fromSnapshot` methods)
- Create: `src/__tests__/TraekEngine.snapshot.v2.test.ts`

**Step 1: Write failing tests**

Create `packages/svelte/src/__tests__/TraekEngine.snapshot.v2.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { TraekEngine } from '../lib/TraekEngine.svelte';

describe('Snapshot v2 with custom tags', () => {
  it('serializes custom tags in v2 snapshot', () => {
    const engine = new TraekEngine();
    engine.createCustomTag('Feature', '#3b82f6');
    const snapshot = engine.serialize('Test');
    expect(snapshot.version).toBe(2);
    expect(snapshot.customTags).toHaveLength(1);
    expect(snapshot.customTags![0].label).toBe('Feature');
  });

  it('restores custom tags from v2 snapshot', () => {
    const engine = new TraekEngine();
    engine.createCustomTag('Feature', '#3b82f6');
    const snapshot = engine.serialize('Test');

    const engine2 = new TraekEngine();
    engine2.fromSnapshot(snapshot);
    expect(engine2.customTags.size).toBe(1);
  });

  it('v1 snapshot loads without error (migration)', () => {
    const v1Snapshot = {
      version: 1,
      title: 'Old',
      nodes: [],
      rootNodeIds: [],
      activeNodeId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const engine = new TraekEngine();
    expect(() => engine.fromSnapshot(v1Snapshot as any)).not.toThrow();
    expect(engine.customTags.size).toBe(0);
  });
});
```

**Step 2: Run test to verify it fails**

```bash
cd packages/svelte && npx vitest run src/__tests__/TraekEngine.snapshot.v2.test.ts
```

Expected: FAIL — snapshot version is still 1.

**Step 3: Update persistence/schemas.ts**

In `persistence/schemas.ts`, find the snapshot schema and add `customTags` field:

```ts
// Add CustomTag schema
const customTagSchema = z.object({
  slug: z.string(),
  label: z.string(),
  color: z.string()
});

// In conversationSnapshotSchema (or equivalent), add:
customTags: z.array(customTagSchema).optional()
```

Also bump the version field to accept 2: `version: z.literal(2).or(z.literal(1))` or `version: z.number().int().min(1).max(2)`.

**Step 4: Update serialize() in TraekEngine**

Find the `serialize()` method in `TraekEngine.svelte.ts` and:
1. Change `version: 1` to `version: 2`
2. Add `customTags: Array.from(this.customTags.values())` to the snapshot object.

**Step 5: Update fromSnapshot() in TraekEngine**

Find the `fromSnapshot()` method and add after restoring nodes:
```ts
// Restore custom tags (v2 feature; v1 snapshots have none)
this.customTags.clear();
if (snapshot.customTags) {
  for (const tag of snapshot.customTags) {
    this.customTags.set(tag.slug, tag);
  }
}
```

**Step 6: Run tests**

```bash
cd packages/svelte && npx vitest run src/__tests__/TraekEngine.snapshot.v2.test.ts
```

Expected: All 3 PASS.

**Step 7: Commit**

```bash
git add packages/svelte/src/__tests__/TraekEngine.snapshot.v2.test.ts \
  packages/svelte/src/lib/persistence/schemas.ts \
  packages/svelte/src/lib/TraekEngine.svelte.ts
git commit -m "feat(persistence): snapshot v2 with custom tag serialization (TRK-71)"
```

---

## Task 8: Add color CSS variables to theme tokens

**Files:**
- Modify: `theme/tokens.ts`
- Modify: `theme/themes.ts`
- Modify: `theme/ThemeProvider.svelte`

**Step 1: Add color variables to TraekThemeColorsSchema in tokens.ts**

Find `TraekThemeColorsSchema` in `theme/tokens.ts` and add these optional fields at the end of the z.object({...}):

```ts
// Node color coding
nodeColorRed: colorSchema.optional(),
nodeColorOrange: colorSchema.optional(),
nodeColorYellow: colorSchema.optional(),
nodeColorGreen: colorSchema.optional(),
nodeColorBlue: colorSchema.optional(),
nodeColorPurple: colorSchema.optional(),
nodeColorPink: colorSchema.optional(),
nodeColorCyan: colorSchema.optional(),

// Sidebar
sidebarBg: colorSchema.optional(),
sidebarBorder: colorSchema.optional(),
```

**Step 2: Add values to themes.ts**

In `theme/themes.ts`, add to the `darkTheme.colors` object (and similarly to `lightTheme` with slightly adjusted values):

```ts
// Node colors
nodeColorRed: '#ef4444',
nodeColorOrange: '#f97316',
nodeColorYellow: '#eab308',
nodeColorGreen: '#22c55e',
nodeColorBlue: '#3b82f6',
nodeColorPurple: '#a855f7',
nodeColorPink: '#ec4899',
nodeColorCyan: '#06b6d4',
// Sidebar
sidebarBg: '#1a1a2e',
sidebarBorder: 'rgba(255,255,255,0.08)',
```

For `lightTheme`, use the same colors (they read well on both backgrounds).

**Step 3: Apply CSS variables in ThemeProvider.svelte**

In `theme/ThemeProvider.svelte`, find where CSS variables are applied (look for `--traek-node-bg` or similar assignments) and add:

```svelte
--traek-color-red: {theme.colors.nodeColorRed ?? '#ef4444'};
--traek-color-orange: {theme.colors.nodeColorOrange ?? '#f97316'};
--traek-color-yellow: {theme.colors.nodeColorYellow ?? '#eab308'};
--traek-color-green: {theme.colors.nodeColorGreen ?? '#22c55e'};
--traek-color-blue: {theme.colors.nodeColorBlue ?? '#3b82f6'};
--traek-color-purple: {theme.colors.nodeColorPurple ?? '#a855f7'};
--traek-color-pink: {theme.colors.nodeColorPink ?? '#ec4899'};
--traek-color-cyan: {theme.colors.nodeColorCyan ?? '#06b6d4'};
--traek-sidebar-bg: {theme.colors.sidebarBg ?? '#1a1a2e'};
--traek-sidebar-border: {theme.colors.sidebarBorder ?? 'rgba(255,255,255,0.08)'};
```

**Step 4: Verify type-check**

```bash
cd packages/svelte && pnpm run check
```

Expected: No type errors.

**Step 5: Commit**

```bash
git add packages/svelte/src/lib/theme/
git commit -m "feat(theme): add node color CSS variables and sidebar tokens (TRK-71)"
```

---

## Task 9: ColorPicker component

**Files:**
- Create: `canvas/ColorPicker.svelte`

**Step 1: Create ColorPicker.svelte**

```svelte
<script lang="ts">
  import type { NodeColor } from '../TraekEngine.svelte';

  const COLORS: { value: NodeColor; label: string }[] = [
    { value: 'red', label: 'Red' },
    { value: 'orange', label: 'Orange' },
    { value: 'yellow', label: 'Yellow' },
    { value: 'green', label: 'Green' },
    { value: 'blue', label: 'Blue' },
    { value: 'purple', label: 'Purple' },
    { value: 'pink', label: 'Pink' },
    { value: 'cyan', label: 'Cyan' }
  ];

  let {
    value = $bindable(null),
    onchange
  }: {
    value?: NodeColor | null;
    onchange?: (color: NodeColor | null) => void;
  } = $props();

  function select(color: NodeColor | null) {
    value = color;
    onchange?.(color);
  }
</script>

<div class="color-picker" role="group" aria-label="Node color">
  <button
    class="swatch swatch--none"
    class:selected={value == null}
    onclick={() => select(null)}
    aria-label="No color"
    title="None"
  >
    <span class="swatch-x">×</span>
  </button>
  {#each COLORS as { value: color, label }}
    <button
      class="swatch"
      class:selected={value === color}
      style="--c: var(--traek-color-{color})"
      onclick={() => select(color)}
      aria-label={label}
      aria-pressed={value === color}
      title={label}
    ></button>
  {/each}
</div>

<style>
  .color-picker {
    display: flex;
    gap: 4px;
    padding: 6px;
    flex-wrap: wrap;
    max-width: 200px;
  }

  .swatch {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    border: 2px solid transparent;
    background: var(--c, transparent);
    cursor: pointer;
    transition: transform 0.1s, border-color 0.1s;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .swatch:hover {
    transform: scale(1.2);
  }

  .swatch.selected {
    border-color: white;
    transform: scale(1.15);
  }

  .swatch--none {
    background: rgba(255, 255, 255, 0.08);
    font-size: 14px;
    color: rgba(255, 255, 255, 0.5);
  }

  .swatch-x {
    line-height: 1;
  }
</style>
```

**Step 2: Verify lint**

```bash
cd packages/svelte && pnpm run lint
```

**Step 3: Commit**

```bash
git add packages/svelte/src/lib/canvas/ColorPicker.svelte
git commit -m "feat(ui): add ColorPicker component with 8-color palette (TRK-71)"
```

---

## Task 10: Color indicator on nodes (visual rendering)

**Files:**
- Modify: `TraekNodeWrapper.svelte`

**Step 1: Add color indicator to node wrapper**

In `TraekNodeWrapper.svelte`, find the template section (after `<script>`). Find the outer wrapper div (look for `class="message-node-wrapper"` or similar).

Add a computed `nodeColor` derived value in the `<script>` section:
```ts
const nodeColor = $derived(node.metadata?.color as string | null | undefined ?? null);
```

Add a `style` binding to the wrapper div using the color:
```svelte
style:--node-accent={nodeColor ? `var(--traek-color-${nodeColor})` : null}
style:--node-accent-bg={nodeColor ? `var(--traek-color-${nodeColor})` : null}
```

Add CSS in the `<style>` block of the component:
```css
.message-node-wrapper {
  /* existing styles... */
}

/* Color accent: top border + subtle background tint */
.message-node-wrapper[style*="--node-accent"] :global(.node-card) {
  border-top: 2px solid var(--node-accent, transparent);
  background: color-mix(in srgb, var(--node-accent-bg) 8%, var(--traek-node-bg));
}
```

Note: Look at the actual class name used in `TraekNodeWrapper.svelte` and use that exact class. If there's no `:global(.node-card)`, apply the color directly to the wrapper's first child or inner card element.

**Step 2: Run lint and check**

```bash
cd packages/svelte && pnpm run lint && pnpm run check
```

**Step 3: Commit**

```bash
git add packages/svelte/src/lib/TraekNodeWrapper.svelte
git commit -m "feat(ui): apply color accent (top border + bg tint) to colored nodes (TRK-71)"
```

---

## Task 11: Bookmark badge on nodes

**Files:**
- Create: `canvas/BookmarkBadge.svelte`
- Modify: `TraekNodeWrapper.svelte`

**Step 1: Create BookmarkBadge.svelte**

```svelte
<script lang="ts">
  let { label }: { label?: string } = $props();
</script>

<div class="bookmark-badge" title={label ?? 'Bookmarked'} aria-label="Bookmarked node">
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M5 3h14a1 1 0 011 1v17.17a1 1 0 01-1.707.707L12 15.586l-6.293 6.291A1 1 0 014 21.17V4a1 1 0 011-1z"/>
  </svg>
</div>

<style>
  .bookmark-badge {
    position: absolute;
    top: -4px;
    right: 8px;
    color: var(--traek-color-yellow, #eab308);
    z-index: 10;
    filter: drop-shadow(0 1px 2px rgba(0,0,0,0.5));
    pointer-events: none;
  }
</style>
```

**Step 2: Add BookmarkBadge to TraekNodeWrapper.svelte**

In `TraekNodeWrapper.svelte`, add:

In `<script>`:
```ts
import BookmarkBadge from './canvas/BookmarkBadge.svelte';
const isBookmarked = $derived(node.metadata?.bookmarked === true);
const bookmarkLabel = $derived(node.metadata?.bookmarkLabel as string | undefined);
```

In the template, inside the wrapper div, add conditionally:
```svelte
{#if isBookmarked}
  <BookmarkBadge label={bookmarkLabel} />
{/if}
```

**Step 3: Commit**

```bash
git add packages/svelte/src/lib/canvas/BookmarkBadge.svelte packages/svelte/src/lib/TraekNodeWrapper.svelte
git commit -m "feat(ui): add BookmarkBadge on bookmarked nodes (TRK-71)"
```

---

## Task 12: Tag creator (custom tag form)

**Files:**
- Create: `tags/TagCreator.svelte`
- Modify: `tags/TagDropdown.svelte`

**Step 1: Create TagCreator.svelte**

```svelte
<script lang="ts">
  import type { TraekEngine } from '../TraekEngine.svelte';

  let {
    engine,
    oncreate,
    oncancel
  }: {
    engine: TraekEngine;
    oncreate?: (slug: string) => void;
    oncancel?: () => void;
  } = $props();

  let label = $state('');
  let color = $state('#3b82f6');
  let error = $state('');

  function handleCreate() {
    const trimmed = label.trim();
    if (!trimmed) {
      error = 'Label is required';
      return;
    }
    if (trimmed.length > 40) {
      error = 'Max 40 characters';
      return;
    }
    const tag = engine.createCustomTag(trimmed, color);
    oncreate?.(tag.slug);
    label = '';
    error = '';
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') handleCreate();
    if (e.key === 'Escape') oncancel?.();
  }
</script>

<div class="tag-creator">
  <div class="tag-creator__row">
    <input
      type="color"
      bind:value={color}
      class="tag-creator__color"
      aria-label="Tag color"
    />
    <input
      type="text"
      bind:value={label}
      placeholder="Tag name…"
      class="tag-creator__input"
      onkeydown={handleKeyDown}
      maxlength="40"
      aria-label="Tag name"
    />
  </div>
  {#if error}
    <p class="tag-creator__error">{error}</p>
  {/if}
  <div class="tag-creator__actions">
    <button class="tag-creator__btn tag-creator__btn--cancel" onclick={oncancel}>Cancel</button>
    <button class="tag-creator__btn tag-creator__btn--create" onclick={handleCreate}>Create</button>
  </div>
</div>

<style>
  .tag-creator {
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    border-top: 1px solid rgba(255,255,255,0.08);
  }
  .tag-creator__row {
    display: flex;
    gap: 6px;
    align-items: center;
  }
  .tag-creator__color {
    width: 28px;
    height: 28px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    padding: 0;
    background: none;
  }
  .tag-creator__input {
    flex: 1;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 4px;
    color: inherit;
    padding: 4px 8px;
    font-size: 12px;
    outline: none;
  }
  .tag-creator__input:focus {
    border-color: rgba(255,255,255,0.3);
  }
  .tag-creator__error {
    color: var(--traek-color-red, #ef4444);
    font-size: 11px;
    margin: 0;
  }
  .tag-creator__actions {
    display: flex;
    gap: 6px;
    justify-content: flex-end;
  }
  .tag-creator__btn {
    padding: 4px 10px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    font-size: 12px;
  }
  .tag-creator__btn--cancel {
    background: rgba(255,255,255,0.06);
    color: rgba(255,255,255,0.6);
  }
  .tag-creator__btn--create {
    background: rgba(255,255,255,0.12);
    color: white;
  }
  .tag-creator__btn--create:hover {
    background: rgba(255,255,255,0.2);
  }
</style>
```

**Step 2: Add "New tag" option to TagDropdown.svelte**

In `tags/TagDropdown.svelte`, import TagCreator:
```svelte
<script>
  import TagCreator from './TagCreator.svelte';
  let showCreator = $state(false);
</script>
```

At the bottom of the dropdown list, add:
```svelte
{#if showCreator}
  <TagCreator {engine} oncreate={(slug) => { showCreator = false; engine.addTag(nodeId, slug); }} oncancel={() => { showCreator = false; }} />
{:else}
  <button class="new-tag-btn" onclick={() => { showCreator = true; }}>+ New tag</button>
{/if}
```

Style the new-tag-btn consistently with the existing dropdown button style (small, muted, border-top separator).

**Step 3: Commit**

```bash
git add packages/svelte/src/lib/tags/TagCreator.svelte packages/svelte/src/lib/tags/TagDropdown.svelte
git commit -m "feat(ui): add TagCreator component and 'New tag' option in TagDropdown (TRK-71)"
```

---

## Task 13: Sidebar panel (TagBookmarkSidebar)

**Files:**
- Create: `sidebar/TagBookmarkSidebar.svelte`

**Step 1: Create the sidebar directory and component**

```bash
mkdir -p packages/svelte/src/lib/sidebar
```

Create `packages/svelte/src/lib/sidebar/TagBookmarkSidebar.svelte`:

```svelte
<script lang="ts">
  import type { TraekEngine, MessageNode } from '../TraekEngine.svelte';
  import { listBuiltinTags } from '../tags/tagUtils';

  let {
    engine,
    open = $bindable(false),
    onNavigate
  }: {
    engine: TraekEngine;
    open?: boolean;
    onNavigate?: (nodeId: string) => void;
  } = $props();

  type Tab = 'tags' | 'bookmarks';
  let activeTab = $state<Tab>('tags');
  let searchQuery = $state('');

  // All tags (builtin + custom)
  const allTags = $derived([
    ...listBuiltinTags(),
    ...Array.from(engine.customTags.values()).map((t) => ({
      slug: t.slug,
      label: t.label,
      color: t.color,
      bgColor: `${t.color}26`,
      isCustom: true
    }))
  ]);

  // Tag usage counts
  const tagCounts = $derived.by(() => {
    const counts = new Map<string, number>();
    for (const node of engine.nodes) {
      const tags = (node.metadata?.tags as string[]) ?? [];
      for (const tag of tags) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
    return counts;
  });

  // Filter tags with active nodes
  const filteredTags = $derived(
    allTags
      .filter((t) => {
        const count = tagCounts.get(t.slug) ?? 0;
        if (count === 0) return false;
        if (!searchQuery.trim()) return true;
        return t.label.toLowerCase().includes(searchQuery.toLowerCase());
      })
  );

  // Bookmarks
  const bookmarks = $derived(engine.getBookmarks());
  const filteredBookmarks = $derived(
    bookmarks.filter((b) => {
      if (!searchQuery.trim()) return true;
      const content = ((b.node as MessageNode).content ?? '').toLowerCase();
      const label = (b.label ?? '').toLowerCase();
      return content.includes(searchQuery.toLowerCase()) || label.includes(searchQuery.toLowerCase());
    })
  );

  // Active tag filters
  let activeTagFilters = $state<string[]>([]);

  function toggleTagFilter(slug: string) {
    if (activeTagFilters.includes(slug)) {
      activeTagFilters = activeTagFilters.filter((t) => t !== slug);
    } else {
      activeTagFilters = [...activeTagFilters, slug];
    }
    engine.searchFilters = {
      ...engine.searchFilters,
      tags: activeTagFilters.length > 0 ? activeTagFilters : undefined
    };
  }

  function close() {
    open = false;
  }
</script>

{#if open}
  <aside class="sidebar" aria-label="Tags and Bookmarks">
    <div class="sidebar__header">
      <div class="sidebar__tabs" role="tablist">
        <button
          role="tab"
          aria-selected={activeTab === 'tags'}
          class="sidebar__tab"
          class:active={activeTab === 'tags'}
          onclick={() => { activeTab = 'tags'; searchQuery = ''; }}
        >
          Tags
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'bookmarks'}
          class="sidebar__tab"
          class:active={activeTab === 'bookmarks'}
          onclick={() => { activeTab = 'bookmarks'; searchQuery = ''; }}
        >
          Bookmarks
          {#if bookmarks.length > 0}
            <span class="sidebar__count">{bookmarks.length}</span>
          {/if}
        </button>
      </div>
      <button class="sidebar__close" onclick={close} aria-label="Close sidebar">×</button>
    </div>

    <div class="sidebar__search">
      <input
        type="search"
        bind:value={searchQuery}
        placeholder={activeTab === 'tags' ? 'Filter tags…' : 'Search bookmarks…'}
        class="sidebar__search-input"
        aria-label="Search"
      />
    </div>

    <div class="sidebar__body" role="tabpanel">
      {#if activeTab === 'tags'}
        {#if filteredTags.length === 0}
          <p class="sidebar__empty">No tags yet. Add tags to nodes to see them here.</p>
        {:else}
          <ul class="sidebar__list" aria-label="Tag filters">
            {#each filteredTags as tag (tag.slug)}
              <li>
                <button
                  class="sidebar__tag-item"
                  class:active-filter={activeTagFilters.includes(tag.slug)}
                  onclick={() => toggleTagFilter(tag.slug)}
                  aria-pressed={activeTagFilters.includes(tag.slug)}
                >
                  <span class="sidebar__tag-dot" style="background: {tag.color}"></span>
                  <span class="sidebar__tag-label">{tag.label}</span>
                  <span class="sidebar__tag-count">{tagCounts.get(tag.slug) ?? 0}</span>
                </button>
              </li>
            {/each}
          </ul>
        {/if}
      {:else}
        {#if filteredBookmarks.length === 0}
          <p class="sidebar__empty">No bookmarks yet. Click the bookmark icon on any node.</p>
        {:else}
          <ul class="sidebar__list" aria-label="Bookmarks">
            {#each filteredBookmarks as bm (bm.node.id)}
              <li>
                <button
                  class="sidebar__bookmark-item"
                  onclick={() => onNavigate?.(bm.node.id)}
                >
                  <span class="sidebar__bookmark-icon" aria-hidden="true">★</span>
                  <span class="sidebar__bookmark-text">
                    {#if bm.label}
                      <strong class="sidebar__bookmark-label">{bm.label}</strong>
                    {/if}
                    <span class="sidebar__bookmark-preview">
                      {((bm.node as MessageNode).content ?? '').substring(0, 60)}…
                    </span>
                  </span>
                </button>
              </li>
            {/each}
          </ul>
        {/if}
      {/if}
    </div>
  </aside>
{/if}

<style>
  .sidebar {
    position: fixed;
    top: 0;
    right: 0;
    height: 100%;
    width: 280px;
    background: var(--traek-sidebar-bg, #1a1a2e);
    border-left: 1px solid var(--traek-sidebar-border, rgba(255,255,255,0.08));
    z-index: 100;
    display: flex;
    flex-direction: column;
    font-size: 13px;
    color: var(--traek-node-text, rgba(255,255,255,0.85));
  }

  .sidebar__header {
    display: flex;
    align-items: stretch;
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }

  .sidebar__tabs {
    display: flex;
    flex: 1;
  }

  .sidebar__tab {
    flex: 1;
    padding: 12px 8px;
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    color: rgba(255,255,255,0.5);
    cursor: pointer;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  .sidebar__tab.active {
    color: white;
    border-bottom-color: white;
  }

  .sidebar__count {
    background: rgba(255,255,255,0.15);
    border-radius: 10px;
    padding: 1px 6px;
    font-size: 10px;
  }

  .sidebar__close {
    padding: 8px 12px;
    background: none;
    border: none;
    color: rgba(255,255,255,0.4);
    cursor: pointer;
    font-size: 18px;
    display: flex;
    align-items: center;
  }

  .sidebar__close:hover { color: white; }

  .sidebar__search {
    padding: 8px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }

  .sidebar__search-input {
    width: 100%;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 6px;
    color: inherit;
    padding: 6px 10px;
    font-size: 12px;
    outline: none;
    box-sizing: border-box;
  }

  .sidebar__search-input:focus {
    border-color: rgba(255,255,255,0.25);
  }

  .sidebar__body {
    flex: 1;
    overflow-y: auto;
    padding: 4px 0;
  }

  .sidebar__list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .sidebar__tag-item,
  .sidebar__bookmark-item {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 8px 12px;
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    text-align: left;
    transition: background 0.1s;
  }

  .sidebar__tag-item:hover,
  .sidebar__bookmark-item:hover {
    background: rgba(255,255,255,0.06);
  }

  .sidebar__tag-item.active-filter {
    background: rgba(255,255,255,0.1);
  }

  .sidebar__tag-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .sidebar__tag-label {
    flex: 1;
  }

  .sidebar__tag-count {
    font-size: 11px;
    color: rgba(255,255,255,0.35);
  }

  .sidebar__bookmark-icon {
    color: var(--traek-color-yellow, #eab308);
    flex-shrink: 0;
  }

  .sidebar__bookmark-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .sidebar__bookmark-label {
    font-size: 11px;
    color: rgba(255,255,255,0.6);
    font-weight: 600;
  }

  .sidebar__bookmark-preview {
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: rgba(255,255,255,0.75);
  }

  .sidebar__empty {
    padding: 24px 16px;
    color: rgba(255,255,255,0.35);
    font-size: 12px;
    text-align: center;
    line-height: 1.6;
    margin: 0;
  }
</style>
```

**Step 2: Commit**

```bash
git add packages/svelte/src/lib/sidebar/
git commit -m "feat(ui): add TagBookmarkSidebar right-side drawer (TRK-71)"
```

---

## Task 14: Bookmark jump overlay (Cmd+B)

**Files:**
- Create: `keyboard/BookmarkJumpOverlay.svelte`

**Step 1: Create BookmarkJumpOverlay.svelte**

Use `keyboard/FuzzySearchOverlay.svelte` as the exact structural pattern. Key differences:
- Shows bookmarked nodes only (from `engine.getBookmarks()`)
- No text search input needed (bookmarks are few)
- Shows label + content preview
- Triggered by Cmd+B

```svelte
<script lang="ts">
  import type { TraekEngine, MessageNode } from '../TraekEngine.svelte';

  let {
    engine,
    onClose,
    onSelect
  }: {
    engine: TraekEngine;
    onClose: () => void;
    onSelect: (nodeId: string) => void;
  } = $props();

  let selectedIndex = $state(0);
  const bookmarks = $derived(engine.getBookmarks());

  $effect(() => {
    void bookmarks;
    selectedIndex = 0;
  });

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = (selectedIndex + 1) % Math.max(bookmarks.length, 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = (selectedIndex - 1 + Math.max(bookmarks.length, 1)) % Math.max(bookmarks.length, 1);
    } else if (e.key === 'Enter' && bookmarks[selectedIndex]) {
      e.preventDefault();
      onSelect(bookmarks[selectedIndex].node.id);
      onClose();
    }
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="overlay-backdrop" onclick={onClose} onkeydown={handleKeyDown}>
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div class="overlay" onclick={(e) => e.stopPropagation()} role="dialog" aria-label="Jump to bookmark">
    <div class="overlay__header">
      <span class="overlay__title">Bookmarks</span>
      <span class="overlay__hint">↑↓ navigate · Enter jump · Esc close</span>
    </div>

    {#if bookmarks.length === 0}
      <p class="overlay__empty">No bookmarks yet. Use the bookmark icon on nodes to add them.</p>
    {:else}
      <ul class="overlay__list" role="listbox">
        {#each bookmarks as bm, i (bm.node.id)}
          <li
            role="option"
            aria-selected={i === selectedIndex}
            class="overlay__item"
            class:selected={i === selectedIndex}
          >
            <button
              class="overlay__item-btn"
              onclick={() => { onSelect(bm.node.id); onClose(); }}
            >
              <span class="overlay__star" aria-hidden="true">★</span>
              <span class="overlay__content">
                {#if bm.label}
                  <strong class="overlay__label">{bm.label}</strong>
                {/if}
                <span class="overlay__preview">
                  {((bm.node as MessageNode).content ?? '').substring(0, 80)}
                </span>
              </span>
            </button>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</div>

<style>
  .overlay-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 200;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 15vh;
  }

  .overlay {
    background: var(--traek-sidebar-bg, #1a1a2e);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 10px;
    width: 480px;
    max-height: 400px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
  }

  .overlay__header {
    padding: 12px 16px;
    display: flex;
    align-items: center;
    gap: 8px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }

  .overlay__title {
    font-weight: 600;
    font-size: 13px;
  }

  .overlay__hint {
    font-size: 11px;
    color: rgba(255,255,255,0.35);
    margin-left: auto;
  }

  .overlay__list {
    list-style: none;
    margin: 0;
    padding: 4px 0;
    overflow-y: auto;
    flex: 1;
  }

  .overlay__item-btn {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    width: 100%;
    padding: 10px 16px;
    background: none;
    border: none;
    color: var(--traek-node-text, rgba(255,255,255,0.85));
    cursor: pointer;
    text-align: left;
  }

  .overlay__item.selected .overlay__item-btn {
    background: rgba(255,255,255,0.08);
  }

  .overlay__star {
    color: var(--traek-color-yellow, #eab308);
    flex-shrink: 0;
    margin-top: 1px;
  }

  .overlay__content {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .overlay__label {
    font-size: 12px;
    color: rgba(255,255,255,0.6);
  }

  .overlay__preview {
    font-size: 13px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: rgba(255,255,255,0.85);
  }

  .overlay__empty {
    padding: 32px 20px;
    color: rgba(255,255,255,0.35);
    font-size: 13px;
    text-align: center;
    margin: 0;
    line-height: 1.6;
  }
</style>
```

**Step 2: Commit**

```bash
git add packages/svelte/src/lib/keyboard/BookmarkJumpOverlay.svelte
git commit -m "feat(ui): add BookmarkJumpOverlay for Cmd+B quick navigation (TRK-71)"
```

---

## Task 15: BulkActionToolbar component

**Files:**
- Create: `canvas/BulkActionToolbar.svelte`

**Step 1: Create BulkActionToolbar.svelte**

```svelte
<script lang="ts">
  import type { TraekEngine, NodeColor } from '../TraekEngine.svelte';
  import ColorPicker from './ColorPicker.svelte';

  const QUICK_TAGS = ['important', 'todo', 'idea', 'question', 'resolved'];

  let {
    engine,
    selectedIds,
    onClear
  }: {
    engine: TraekEngine;
    selectedIds: string[];
    onClear?: () => void;
  } = $props();

  let showColorPicker = $state(false);
  let showTagPicker = $state(false);

  function applyColor(color: NodeColor | null) {
    engine.bulkSetColor(selectedIds, color);
    showColorPicker = false;
  }

  function applyTag(tag: string) {
    engine.bulkAddTag(selectedIds, tag);
    showTagPicker = false;
  }

  function bookmarkAll() {
    engine.bulkSetBookmark(selectedIds, true);
  }

  function unbookmarkAll() {
    engine.bulkSetBookmark(selectedIds, false);
  }
</script>

<div class="bulk-toolbar" role="toolbar" aria-label="Bulk actions for {selectedIds.length} selected nodes">
  <span class="bulk-toolbar__count">{selectedIds.length} selected</span>

  <div class="bulk-toolbar__divider"></div>

  <div class="bulk-toolbar__group">
    <button
      class="bulk-toolbar__btn"
      onclick={() => { showColorPicker = !showColorPicker; showTagPicker = false; }}
      aria-expanded={showColorPicker}
      title="Set color"
    >
      🎨 Color
    </button>
    <button
      class="bulk-toolbar__btn"
      onclick={() => { showTagPicker = !showTagPicker; showColorPicker = false; }}
      aria-expanded={showTagPicker}
      title="Add tag"
    >
      🏷️ Tag
    </button>
    <button class="bulk-toolbar__btn" onclick={bookmarkAll} title="Bookmark all">★ Bookmark</button>
    <button class="bulk-toolbar__btn bulk-toolbar__btn--muted" onclick={unbookmarkAll} title="Remove bookmarks">☆ Unbookmark</button>
  </div>

  <div class="bulk-toolbar__divider"></div>

  <button class="bulk-toolbar__btn bulk-toolbar__btn--close" onclick={onClear} aria-label="Clear selection">
    ✕
  </button>

  {#if showColorPicker}
    <div class="bulk-toolbar__popover">
      <ColorPicker onchange={applyColor} />
    </div>
  {/if}

  {#if showTagPicker}
    <div class="bulk-toolbar__popover">
      <ul class="bulk-toolbar__tags">
        {#each QUICK_TAGS as tag}
          <li>
            <button class="bulk-toolbar__tag-btn" onclick={() => applyTag(tag)}>{tag}</button>
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</div>

<style>
  .bulk-toolbar {
    position: fixed;
    bottom: 80px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--traek-node-bg, #1e1e2e);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 10px;
    padding: 8px 12px;
    display: flex;
    align-items: center;
    gap: 8px;
    z-index: 150;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    font-size: 12px;
    white-space: nowrap;
  }

  .bulk-toolbar__count {
    color: rgba(255,255,255,0.6);
    font-size: 12px;
  }

  .bulk-toolbar__divider {
    width: 1px;
    height: 20px;
    background: rgba(255,255,255,0.1);
  }

  .bulk-toolbar__group {
    display: flex;
    gap: 4px;
  }

  .bulk-toolbar__btn {
    background: rgba(255,255,255,0.08);
    border: none;
    border-radius: 6px;
    color: inherit;
    padding: 4px 10px;
    cursor: pointer;
    font-size: 12px;
    transition: background 0.1s;
  }

  .bulk-toolbar__btn:hover {
    background: rgba(255,255,255,0.15);
  }

  .bulk-toolbar__btn--muted {
    color: rgba(255,255,255,0.5);
  }

  .bulk-toolbar__btn--close {
    padding: 4px 8px;
  }

  .bulk-toolbar__popover {
    position: absolute;
    bottom: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%);
    background: var(--traek-node-bg, #1e1e2e);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.4);
    z-index: 10;
  }

  .bulk-toolbar__tags {
    list-style: none;
    margin: 0;
    padding: 6px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 120px;
  }

  .bulk-toolbar__tag-btn {
    width: 100%;
    text-align: left;
    padding: 6px 10px;
    background: none;
    border: none;
    border-radius: 4px;
    color: inherit;
    cursor: pointer;
    font-size: 12px;
  }

  .bulk-toolbar__tag-btn:hover {
    background: rgba(255,255,255,0.08);
  }
</style>
```

**Step 2: Commit**

```bash
git add packages/svelte/src/lib/canvas/BulkActionToolbar.svelte
git commit -m "feat(ui): add BulkActionToolbar for multi-select color/tag/bookmark ops (TRK-71)"
```

---

## Task 16: TraekCanvas integration

**Files:**
- Modify: `TraekCanvas.svelte` (the main canvas component)

**Step 1: Read TraekCanvas.svelte first**

Before editing, read `packages/svelte/src/lib/TraekCanvas.svelte` (or wherever the main canvas component lives — it might be at the root of `src/lib/`). Understand how keybindings, overlays, and panels are currently integrated.

**Step 2: Add sidebar state and keybindings**

In `TraekCanvas.svelte`, in the `<script>` section:

```ts
import TagBookmarkSidebar from './sidebar/TagBookmarkSidebar.svelte';
import BookmarkJumpOverlay from './keyboard/BookmarkJumpOverlay.svelte';
import BulkActionToolbar from './canvas/BulkActionToolbar.svelte';

let sidebarOpen = $state(false);
let showBookmarkJump = $state(false);
```

In the existing keyboard handler (find `handleKeyDown` or the `onkeydown` handler):

```ts
// Cmd+Shift+T → toggle sidebar
if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'T') {
  e.preventDefault();
  sidebarOpen = !sidebarOpen;
}

// Cmd+B → bookmark jump overlay
if ((e.metaKey || e.ctrlKey) && !e.shiftKey && e.key === 'b') {
  e.preventDefault();
  showBookmarkJump = !showBookmarkJump;
}
```

**Step 3: Add components to template**

In the template, alongside existing overlay components:

```svelte
<TagBookmarkSidebar
  {engine}
  bind:open={sidebarOpen}
  onNavigate={(id) => engine.focusOnNode(id)}
/>

{#if showBookmarkJump}
  <BookmarkJumpOverlay
    {engine}
    onClose={() => { showBookmarkJump = false; }}
    onSelect={(id) => { engine.focusOnNode(id); showBookmarkJump = false; }}
  />
{/if}

{#if selectedNodeIds && selectedNodeIds.size > 1}
  <BulkActionToolbar
    {engine}
    selectedIds={Array.from(selectedNodeIds)}
    onClear={() => { selectedNodeIds.clear(); }}
  />
{/if}
```

Note: `selectedNodeIds` may already exist as a variable in CanvasInteraction or the canvas component. Find the actual variable name by reading the canvas file and use it.

**Step 4: Add ColorPicker to active node toolbar**

Find where node actions are rendered (possibly in `NodeRenderer.svelte` or a toolbar component). Add a color button that opens a `ColorPicker` popover connected to `engine.setNodeColor(activeNodeId, color)`.

If there's no node toolbar yet, add a minimal inline action in `TraekNodeWrapper.svelte`:

```svelte
{#if isActive}
  <div class="node-actions">
    <button
      class="node-action-btn"
      onclick={() => showColorPicker = !showColorPicker}
      title="Set color"
      aria-label="Set node color"
    >
      <span class="node-action-icon">●</span>
    </button>
    <button
      class="node-action-btn"
      onclick={() => {
        if (node.metadata?.bookmarked) engine.unbookmarkNode(node.id);
        else engine.bookmarkNode(node.id);
      }}
      title={node.metadata?.bookmarked ? 'Remove bookmark' : 'Bookmark'}
      aria-label={node.metadata?.bookmarked ? 'Remove bookmark' : 'Bookmark node'}
    >
      {node.metadata?.bookmarked ? '★' : '☆'}
    </button>
  </div>
  {#if showColorPicker}
    <div class="node-color-popover">
      <ColorPicker
        value={node.metadata?.color as NodeColor | null}
        onchange={(c) => { engine.setNodeColor(node.id, c); showColorPicker = false; }}
      />
    </div>
  {/if}
{/if}
```

**Step 5: Run type check**

```bash
cd packages/svelte && pnpm run check
```

Fix any type errors before proceeding.

**Step 6: Commit**

```bash
git add packages/svelte/src/lib/TraekCanvas.svelte packages/svelte/src/lib/TraekNodeWrapper.svelte
git commit -m "feat(canvas): integrate sidebar (Cmd+Shift+T), bookmark jump (Cmd+B), bulk toolbar, and node color/bookmark actions (TRK-71)"
```

---

## Task 17: Update exports (index.ts)

**Files:**
- Modify: `index.ts`

**Step 1: Add new exports**

In `packages/svelte/src/lib/index.ts`, add exports for all new public components and types:

```ts
// Node organization (TRK-71)
export { default as TagBookmarkSidebar } from './sidebar/TagBookmarkSidebar.svelte';
export { default as BookmarkJumpOverlay } from './keyboard/BookmarkJumpOverlay.svelte';
export { default as BulkActionToolbar } from './canvas/BulkActionToolbar.svelte';
export { default as ColorPicker } from './canvas/ColorPicker.svelte';
export { default as BookmarkBadge } from './canvas/BookmarkBadge.svelte';
export { default as TagCreator } from './tags/TagCreator.svelte';
export type { NodeColor, CustomTag } from './TraekEngine.svelte';
export { listBuiltinTags, type Tag } from './tags/tagUtils';
```

**Step 2: Verify build compiles**

```bash
cd packages/svelte && pnpm run build
```

Expected: Clean build with no errors.

**Step 3: Commit**

```bash
git add packages/svelte/src/lib/index.ts
git commit -m "feat(exports): export new tagging, color, and bookmark components (TRK-71)"
```

---

## Task 18: Full test suite pass

**Step 1: Run the full test suite**

```bash
cd packages/svelte && pnpm run lint && pnpm run check && pnpm run test
```

**Step 2: Fix any failures**

If tests fail, read the error output carefully. Common issues:
- Missing imports in engine methods
- Type errors from `NodeColor` not being imported in a file
- CSS issues flagged by svelte-check (unused vars, a11y warnings)

Fix failures one at a time. Do NOT skip or ignore them.

**Step 3: Final commit if fixes were needed**

```bash
git add -p  # stage only the fix changes
git commit -m "fix: resolve test and lint failures from TRK-71 integration"
```

---

## Task 19: Final integration commit + PR prep

**Step 1: Verify all checks pass**

```bash
cd packages/svelte && pnpm run lint && pnpm run check && pnpm run test
```

**Step 2: Review what was built**

- ✅ Engine: `setNodeColor`, `setNodeColorBranch`, `getNodeColor`
- ✅ Engine: `bookmarkNode`, `unbookmarkNode`, `getBookmarks`
- ✅ Engine: `createCustomTag`, `deleteCustomTag`, `listAllTags`
- ✅ Engine: `bulkSetColor`, `bulkAddTag`, `bulkRemoveTag`, `bulkSetBookmark`
- ✅ SearchFilters: `tags`, `colors`, `bookmarked` support
- ✅ Snapshot v2: persists custom tags
- ✅ UI: ColorPicker, BookmarkBadge, TagCreator
- ✅ UI: TagBookmarkSidebar (right drawer, Cmd+Shift+T)
- ✅ UI: BookmarkJumpOverlay (Cmd+B)
- ✅ UI: BulkActionToolbar (multi-select)
- ✅ CSS variables: `--traek-color-{red,orange,yellow,green,blue,purple,pink,cyan}`
- ✅ Exports: all new components and types exported from index.ts

**Step 3: Summary commit message (if anything still needs committing)**

```bash
git status  # verify nothing untracked/uncommitted
```

If clean, you're done. The feature is complete and ready for review.
