---
title: Publishing to the Marketplace
description: How to submit your Træk plugin, theme, or template to the official marketplace.
---

# Publishing to the Marketplace

The Træk Marketplace lets you share and monetize custom node types, themes, and conversation templates with the wider community. This guide walks you from initial development through submission review and first publish.

---

## Prerequisites

Before submitting, make sure you have:

- A working plugin that passes `pnpm run lint && pnpm run check && pnpm run test`
- A `traek-plugin.json` manifest in your package root (see [Manifest Schema](#1-add-a-traek-pluginjson-manifest))
- A public npm package (or a private package with the bundle attached)
- A Træk Marketplace account (sign up at `traek.app/marketplace`)

---

## Onboarding Steps

### 1. Add a `traek-plugin.json` Manifest

Every marketplace plugin requires a manifest file at the root of your package. Create `traek-plugin.json` next to your `package.json`:

```json
{
  "name": "traek-plugin-mermaid",
  "displayName": "Mermaid Diagram Node",
  "version": "1.0.0",
  "description": "Renders Mermaid diagrams as interactive canvas nodes.",
  "type": "component",
  "framework": "svelte",
  "icon": "📊",
  "tags": ["diagram", "charts", "markdown", "code"],
  "pricing": {
    "type": "free"
  },
  "author": {
    "name": "Your Name",
    "email": "you@example.com",
    "url": "https://yoursite.com"
  },
  "repository": "https://github.com/you/traek-plugin-mermaid",
  "docs": "https://github.com/you/traek-plugin-mermaid#readme",
  "engines": {
    "traek": ">=0.5.0"
  },
  "nodeTypes": ["mermaid"],
  "screenshots": [
    {
      "url": "https://your-cdn.com/screenshots/light.png",
      "alt": "Mermaid node rendering a flowchart in light mode",
      "theme": "light"
    },
    {
      "url": "https://your-cdn.com/screenshots/dark.png",
      "alt": "Mermaid node rendering a sequence diagram in dark mode",
      "theme": "dark"
    }
  ],
  "changelog": "### 1.0.0\n- Initial release\n- Supports flowchart, sequence, gantt, and class diagrams"
}
```

**Manifest validation rules:**

| Field | Requirement |
|---|---|
| `name` | Valid npm package name, lowercase |
| `displayName` | 3–60 characters |
| `version` | Valid semver string |
| `description` | 10–150 characters (shown in listing card) |
| `tags` | 1–5 tags, each 2–24 chars, lowercase + hyphens only |
| `screenshots` | Max 5; both `url` and `alt` required per entry |
| `nodeTypes` | Required for `type: "component"` plugins |

---

### 2. Set `@traek/*` as a Peer Dependency

Avoid bundling multiple copies of Træk. In your `package.json`:

```json
{
  "peerDependencies": {
    "@traek/svelte": ">=0.5.0"
  },
  "devDependencies": {
    "@traek/svelte": "^0.5.0"
  }
}
```

Use whichever framework package your plugin targets (`@traek/svelte`, `@traek/react`, `@traek/vue`).

---

### 3. Export Your Plugin Correctly

The marketplace expects a named `NodeTypeDefinition` export. Structure your package so consumers can import it cleanly:

```
my-traek-plugin/
  src/
    index.ts            ← primary export
    MyNode.svelte       ← (or .tsx / .vue)
    definition.ts
  traek-plugin.json
  package.json
  README.md
```

```ts
// src/index.ts
export { myNodeDefinition } from './definition';
export { default as MyNode } from './MyNode.svelte';
```

---

### 4. Write a README

Your `README.md` becomes the long-form description on the marketplace detail page. Use the [Plugin Documentation Template](/docs/plugin-docs-template) as a starting point. Required sections:

- **What it does** — one paragraph summary
- **Installation** — copy-pasteable `npm install` + registry snippet
- **Configuration** — all accepted options with types and defaults
- **Screenshots** — at least one light and one dark screenshot

---

### 5. Publish to npm

```bash
npm publish --access public
```

Your package must be publicly accessible on the npm registry before submission. If you have a private/commercial release, attach the bundle as part of the submission wizard.

---

### 6. Submit via the Marketplace Wizard

Go to **traek.app/marketplace/submit** and fill in the 3-step wizard:

**Step 1 — Package Details**
- Select plugin type (Theme / Component / Template)
- Enter your display name and description
- Choose up to 5 tags
- Set pricing (Free or Paid with monthly/yearly/one-time billing)

**Step 2 — Technical Details**
- Enter your npm package name (must match `traek-plugin.json > name`)
- Enter the version to publish
- Provide docs and repository URLs
- Paste your changelog for this version

**Step 3 — Review & Terms**
- Accept the Developer Program Terms
- Review your submission summary
- Click **Submit for Review**

You'll receive a confirmation email. Review typically takes **2–5 business days**.

---

## Review Criteria

The Træk team checks:

| Criteria | Detail |
|---|---|
| **Functionality** | Plugin installs and renders without errors |
| **Performance** | No synchronous blocking operations or memory leaks |
| **Accessibility** | Interactive elements are keyboard-navigable, have focus styles, ARIA labels |
| **Security** | No `eval`, no hardcoded credentials, no exfiltration of conversation data |
| **Documentation** | README covers install, options, and screenshots |
| **Manifest** | All required fields present and valid |

If your submission is rejected, you'll receive an email with specific feedback and can resubmit.

---

## After Approval

Once approved:

1. Your plugin appears in the marketplace browse grid within 1 hour
2. You gain the **Contributor** creator badge
3. Install analytics are available in your [Creator Dashboard](https://traek.app/marketplace/dashboard)
4. For paid plugins, revenue is paid monthly at **70% creator / 30% Træk**

---

## Updating a Published Plugin

To publish an updated version:

1. Bump the version in `package.json` and `traek-plugin.json` (must match)
2. `npm publish`
3. Visit your Creator Dashboard > **My Plugins** > **Publish Update**
4. Enter the new version number and changelog

Minor and patch updates are auto-approved. Major version bumps go through a brief re-review.

---

## Creator Program Tiers

| Tier | Criteria | Benefits |
|---|---|---|
| **Contributor** | First submission approved | Marketplace listing, analytics |
| **Creator** | 100+ installs, 4.0+ rating | Email support, early API access |
| **Pro Creator** | 1k+ installs, 4.5+ rating, 3+ items | Featured slots, priority support |
| **Partner** | Invite only | Dedicated manager, joint marketing |

---

## Getting Help

- **Community:** Join `#plugin-dev` in the Træk Discord
- **Issues:** File a GitHub issue at `github.com/gettraek/traek`
- **Email:** For Creator+ tiers, use your dedicated support channel
