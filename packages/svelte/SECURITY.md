# Security Model

## Markdown Rendering & XSS Prevention

Traek renders AI-generated and user-supplied markdown using [marked](https://marked.js.org/)
and sanitizes the HTML output with [DOMPurify](https://github.com/cure53/DOMPurify).

### How it works

`markdownToHtml()` in `src/lib/utils.ts` is the single rendering entry point.
All content displayed via `{@html}` in `TextNode.svelte` passes through this function.

**Browser (client-side):** DOMPurify runs after marked and strips:

- `<script>`, `<iframe>`, `<object>`, `<embed>`, `<form>` elements
- `on*` event handler attributes (`onclick`, `onerror`, `onload`, etc.)
- `javascript:` and `data:` URI schemes in `href`/`src`
- `data-*` attributes (`ALLOW_DATA_ATTR: false`)

Only a safe allowlist of markdown-output elements is permitted
(headings, lists, code, links, images, tables, blockquotes, etc.).

**Server / SSR (Node.js):** DOMPurify requires a browser DOM and is therefore
skipped on the server. SvelteKit SSR renders the raw marked output into the
HTML stream; the browser DOMPurify pass fires on hydration before any dynamic
content is injected. For fully server-rendered pipelines (e.g. email, PDF
generation) that never hydrate in a browser, sanitize the output separately
before use.

### CSP Compatibility

DOMPurify does **not** use `eval`, `new Function`, or `unsafe-inline` script
execution. It is compatible with strict Content Security Policies including
`script-src 'self'`.

Recommended CSP additions for Traek consumers:

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline';
  img-src 'self' https: data:;
  connect-src 'self';
```

### Allowed HTML elements & attributes

| Category    | Tags                                                                |
| ----------- | ------------------------------------------------------------------- |
| Block       | `p`, `div`, `br`, `hr`, `pre`, `blockquote`                         |
| Headings    | `h1`–`h6`                                                           |
| Inline      | `span`, `strong`, `em`, `del`, `ins`, `mark`, `code`, `kbd`, `samp` |
| Lists       | `ul`, `ol`, `li`                                                    |
| Links/media | `a`, `img`                                                          |
| Tables      | `table`, `thead`, `tbody`, `tfoot`, `tr`, `th`, `td`, `caption`     |
| Other       | `details`, `summary`                                                |

Allowed attributes: `href`, `src`, `alt`, `title`, `class`, `id`,
`width`, `height`, `target`, `rel`, `align`, `valign`.

### Reporting vulnerabilities

Please report security issues via the project's GitHub issue tracker with the
`security` label, or email the maintainers directly. Do not disclose
vulnerabilities publicly before a fix is available.
