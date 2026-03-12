# Design: Node Tagging, Color Coding & Conversation Bookmarks (TRK-71)

**Date:** 2026-03-08
**Status:** Approved
**Priority:** High

---

## Context

Traek already has a partial tag system: predefined tags (important, todo, idea, question, resolved) with `addTag/removeTag/getTags` engine methods and TagBadges/TagDropdown components. This design extends it to deliver the full feature set: custom tags, color coding, bookmarks, a sidebar panel, and bulk operations.

---

## Architecture

### Data Model

All new data lives in `node.metadata` (already extensible, already serialized):

```ts
// Additions to node metadata
interface NodeMetadataExtensions {
  tags?: string[]          // already exists — tag slugs
  color?: NodeColor        // NEW — 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | null
  bookmarked?: boolean     // NEW
  bookmarkLabel?: string   // NEW — optional label for the bookmark
}

// NEW — tag registry stored in engine config / localStorage
interface CustomTag {
  slug: string             // unique, e.g. 'my-tag'
  label: string            // display name
  color: string            // hex or CSS color
}
```

### Color Coding

**Predefined palette** (8 colors + null/none):

| Name    | Variable              | Use                    |
|---------|-----------------------|------------------------|
| red     | `--traek-color-red`   | Urgent / errors        |
| orange  | `--traek-color-orange`| Warnings / WIP         |
| yellow  | `--traek-color-yellow`| Notes / questions      |
| green   | `--traek-color-green` | Resolved / done        |
| blue    | `--traek-color-blue`  | Reference / info       |
| purple  | `--traek-color-purple`| Creative / ideas       |
| pink    | `--traek-color-pink`  | Important / highlight  |
| cyan    | `--traek-color-cyan`  | System / technical     |

Color is applied as a **top border accent** on the node card (matching the existing `nodeUserBorderTop` / `nodeAssistantBorderTop` pattern) + a soft background tint (`color/10` opacity).

Branch coloring: a "Color branch" option sets the same color on a node and all its descendants.

### Bookmarks

- `metadata.bookmarked: boolean` + optional `metadata.bookmarkLabel: string`
- Engine methods: `bookmarkNode(id, label?)`, `unbookmarkNode(id)`, `getBookmarks()` → sorted by canvas position (top-to-bottom, left-to-right)
- Quick navigation: `Cmd+B` opens bookmark jump overlay (same pattern as FuzzySearchOverlay)
- Visual indicator: star icon badge on node, visible even when node is small/culled

### Custom Tags

- Extend `CustomTag` registry stored in `engine.customTags: Map<string, CustomTag>`
- Persisted in `serialize()` snapshot (`schema v2`) and localStorage fallback
- Engine: `createTag(label, color)`, `deleteTag(slug)`, `listTags()` → returns built-in + custom tags
- Built-in tags (important, todo, idea, question, resolved) remain, get their existing colors
- UI: TagDropdown gets a "New tag..." option that opens a mini-form (label + color picker)

### Sidebar Panel

New component: `packages/svelte/src/lib/sidebar/TagBookmarkSidebar.svelte`

Structure:
```
[Tags | Bookmarks]  ← tab bar
─────────────────────
Search within sidebar
─────────────────────
Tab content:
  Tags:      tag chip + count → click to filter canvas
  Bookmarks: node preview + label → click to navigate
─────────────────────
[+ New tag]  (in Tags tab)
```

- Toggle shortcut: `Cmd+Shift+T`
- Rendered as a right-side drawer (fixed position, 280px, slides in)
- Filter state flows into engine's `searchFilters` (new `tags?: string[]` and `bookmarked?: boolean` fields)
- Uses CSS custom properties for theming, consistent with existing panels

### Bulk Tag Operations

Extend `CanvasInteraction`'s multi-select mode (already tracks `selectedNodeIds`):
- When `selectedNodeIds.size > 1`, show a `BulkActionToolbar` floating bar
- Actions: Add tag, Remove tag, Set color, Bookmark all, Unbookmark all, Clear color
- Same visual style as `NodeToolbar`

### Engine Methods (new/extended)

```ts
// Color coding
setNodeColor(nodeId: string, color: NodeColor | null): void
setNodeColorBranch(nodeId: string, color: NodeColor | null): void  // applies to subtree

// Bookmarks
bookmarkNode(nodeId: string, label?: string): void
unbookmarkNode(nodeId: string): void
getBookmarks(): { node: Node, label?: string }[]  // sorted by position

// Custom tags (extends existing addTag/removeTag)
createCustomTag(label: string, color: string): CustomTag
deleteCustomTag(slug: string): void
listAllTags(): Tag[]  // built-in + custom

// Bulk operations
bulkSetColor(nodeIds: string[], color: NodeColor | null): void
bulkAddTag(nodeIds: string[], tag: string): void
bulkRemoveTag(nodeIds: string[], tag: string): void
bulkSetBookmark(nodeIds: string[], bookmarked: boolean): void
```

### SearchFilters Extension

```ts
// Existing
interface SearchFilters {
  roles?: ('user' | 'assistant' | 'system')[]
  statuses?: ('streaming' | 'done' | 'error')[]
}

// Extended
interface SearchFilters {
  roles?: ('user' | 'assistant' | 'system')[]
  statuses?: ('streaming' | 'done' | 'error')[]
  tags?: string[]           // NEW — filter by tag slugs (OR logic)
  colors?: NodeColor[]      // NEW — filter by color
  bookmarked?: boolean      // NEW — show only bookmarked nodes
}
```

### Persistence (Snapshot Schema v2)

`serialize()` output gains:
```ts
{
  version: 2,              // bumped from 1
  customTags: CustomTag[], // NEW
  nodes: [...],            // each node's metadata includes color + bookmarked
}
```

`fromSnapshot()` handles both v1 (no custom tags) and v2 with a migration.

---

## Component Map

| Component | Location | Purpose |
|---|---|---|
| `ColorPicker.svelte` | `lib/canvas/` | Inline color swatch picker (8 swatches + none) |
| `ColorIndicator.svelte` | `lib/canvas/` | Color accent on node card (top border + bg tint) |
| `BookmarkBadge.svelte` | `lib/canvas/` | Star icon badge on node |
| `TagBookmarkSidebar.svelte` | `lib/sidebar/` | Right-side drawer with tab UI |
| `BulkActionToolbar.svelte` | `lib/canvas/` | Floating bar for multi-select actions |
| `BookmarkJumpOverlay.svelte` | `lib/keyboard/` | Cmd+B quick-jump list |
| `TagCreator.svelte` | `lib/tags/` | Mini-form for new custom tag (label + color) |

Extend:
| Component | Change |
|---|---|
| `NodeToolbar.svelte` | Add color picker button + bookmark toggle |
| `TagDropdown.svelte` | Add "New tag..." option + custom tag support |
| `TraekCanvas.svelte` | Add sidebar slot + Cmd+Shift+T keybinding + Cmd+B |
| `TraekEngine.svelte.ts` | Add all new engine methods |
| `searchUtils.ts` | Extend `searchNodes` to support new filters |

---

## CSS Variables

Add to `tokens.ts` and both themes:

```css
/* Node color coding */
--traek-color-red:    #ef4444;
--traek-color-orange: #f97316;
--traek-color-yellow: #eab308;
--traek-color-green:  #22c55e;
--traek-color-blue:   #3b82f6;
--traek-color-purple: #a855f7;
--traek-color-pink:   #ec4899;
--traek-color-cyan:   #06b6d4;

/* Sidebar */
--traek-sidebar-bg:     #1a1a2e;
--traek-sidebar-border: rgba(255,255,255,0.08);
--traek-sidebar-width:  280px;
```

---

## Testing Strategy

- **Unit tests**: Engine methods (setNodeColor, bookmark*, createCustomTag, bulk ops, v2 snapshot serialize/deserialize)
- **Logic extraction tests**: searchUtils extension (tags/colors/bookmarked filters)
- **Snapshot migration**: v1 → v2 round-trip test
- No component rendering tests (Svelte 5 jsdom limitation — use logic extraction pattern)

---

## Implementation Order

1. Engine methods + types (NodeColor, CustomTag, extended SearchFilters)
2. Snapshot v2 schema + migration
3. searchUtils extension
4. ColorPicker + ColorIndicator components
5. BookmarkBadge component
6. Extend TagDropdown + TagCreator
7. Extend NodeToolbar (color + bookmark actions)
8. TagBookmarkSidebar (drawer)
9. BulkActionToolbar (multi-select integration)
10. BookmarkJumpOverlay (Cmd+B)
11. TraekCanvas integration (sidebar, keybindings)
12. Tests
13. Export updates (index.ts)
