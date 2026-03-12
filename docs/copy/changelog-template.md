# Changelog & Release Notes Template

_Public-facing template for gettraek.com/changelog and GitHub releases_

---

## How to Use This Template

1. Copy the appropriate section below for the release type (major, minor, patch).
2. Fill in the bracketed placeholders.
3. Publish to:
   - `gettraek.com/changelog` (main changelog page)
   - GitHub Release on `github.com/gettraek/traek/releases`
   - `CHANGELOG.md` in the repo root (keep all releases here)
4. Cross-post using the social repurposing workflow for minor and major releases.

---

## Major Release Template (v X.0.0)

```markdown
# Træk vX.0.0 — [Release Name]

_Released [Date] · [GitHub Release link] · [npm link]_

We're shipping Træk vX.0.0 today. [One-sentence summary of the theme: e.g., "This release focuses on collaborative canvas support and a new Vue 3 adapter."]

## What's New

### [Feature 1 Name]
[2–3 sentences explaining what it does and why it matters to developers. Be concrete.]

```tsx
// Before / After code example (optional but recommended)
```

### [Feature 2 Name]
[2–3 sentences.]

### [Feature 3 Name]
[2–3 sentences.]

## Breaking Changes

> ⚠️ This release contains breaking changes. Read the [migration guide](link) before upgrading.

- **[API/component name]:** [What changed and how to update your code.] See [#PR/issue number].
- **[API/component name]:** [What changed.]

If you are on vX-1.x, run:

```bash
npx @traek/migrate
```

Or follow the [manual migration guide](link).

## Improvements

- [Short bullet — e.g., "Canvas pan performance improved by ~40% on large trees (500+ nodes)."]
- [Short bullet.]
- [Short bullet.]

## Bug Fixes

- Fixed [description of bug]. ([#issue])
- Fixed [description of bug]. ([#issue])

## Dependency Updates

- [dep name] bumped from vX to vY

## Contributors

Thank you to everyone who contributed to this release:
[GitHub usernames or "first-time contributors" callout]

---

_Full diff: [v(X-1).0.0...vX.0.0](https://github.com/gettraek/traek/compare/vPREV...vNEXT)_
_npm: `npm install @traek/react@X.0.0`_
```

---

## Minor Release Template (v X.Y.0)

```markdown
# Træk vX.Y.0

_Released [Date] · [GitHub Release] · [npm]_

[One-sentence summary: e.g., "Adds Groq provider support and i18n for 5 new locales."]

## New Features

- **[Feature]:** [Short description, 1–2 sentences.] ([#PR])
- **[Feature]:** [Short description.] ([#PR])

## Improvements

- [Bullet with context.] ([#issue/PR])
- [Bullet.]

## Bug Fixes

- Fixed [description]. ([#issue])

---

_Full diff: [vX.Y-1.0...vX.Y.0](link)_
_`npm install @traek/react@X.Y.0`_
```

---

## Patch Release Template (v X.Y.Z)

```markdown
# Træk vX.Y.Z

_Released [Date]_

Patch release fixing [brief description — e.g., "a canvas scroll regression on Safari 17."].

## Bug Fixes

- [Description of fix]. ([#issue])
- [Description of fix]. ([#issue])

---

_`npm install @traek/react@X.Y.Z`_
```

---

## CHANGELOG.md Structure (repo root)

Keep `CHANGELOG.md` in the repo root as a single cumulative file. Newest release at the top.

```markdown
# Changelog

All notable changes to this project are documented here.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
Versioning: [Semantic Versioning](https://semver.org/)

## [Unreleased]

### Added
-

### Changed
-

### Fixed
-

---

## [X.Y.Z] — YYYY-MM-DD

### Added
-

### Changed
-

### Fixed
-

### Deprecated
-

### Removed
-

### Security
-

[X.Y.Z]: https://github.com/gettraek/traek/compare/vX.Y.Z-1...vX.Y.Z
[Unreleased]: https://github.com/gettraek/traek/compare/vX.Y.Z...HEAD
```

---

## Release Checklist

### Before Publishing

- [ ] All PRs merged and CI green on `main`
- [ ] Version bumped in all `package.json` files
- [ ] `pnpm run build` succeeds for all packages
- [ ] `pnpm run test` passes
- [ ] Migration guide written (if breaking changes)
- [ ] `CHANGELOG.md` updated with this release

### Publishing

- [ ] Tag: `git tag vX.Y.Z && git push --tags`
- [ ] npm publish: `pnpm -r publish --access public`
- [ ] GitHub Release created (use this template, paste changelog section)
- [ ] `gettraek.com/changelog` page updated

### After Publishing

- [ ] Tweet/thread using social repurposing workflow (`social-repurposing-workflow.md`)
- [ ] Discord `#announcements` post
- [ ] Dev.to article (for minor/major releases)
- [ ] Update playground to latest version
- [ ] Close GitHub milestone

---

## Writing Style Guide for Release Notes

**Voice:** Direct, friendly, developer-first. Write for someone skimming on their phone.

**Do:**
- Lead with the user benefit, not the implementation detail
- Include code examples for new APIs
- Link to the docs page for every new feature
- Mention contributors by name (motivates community)
- Quantify improvements where possible ("40% faster", "60% less bundle size")

**Don't:**
- Use marketing speak ("game-changing", "revolutionary")
- Explain internal refactors that don't affect users
- List every file changed
- Use passive voice ("was fixed" → "we fixed" / "fixed")

**Example (bad):** "Refactored the internal node rendering pipeline to use a WeakMap-based cache."
**Example (good):** "Canvas performance on large trees (500+ nodes) is now ~40% faster. Scrolling and panning feel instant even with complex conversation trees."
