# Analytics & Organic Traffic Tracking Setup — Træk

_Date: 2026-03-08_

## Overview

Track organic traffic across three properties:
1. **Docs site** (`gettraek.com` / `docs.gettraek.com`) — Astro/Starlight
2. **Playground** (`play.gettraek.com`) — SvelteKit
3. **Blog** (`gettraek.com/blog`) — TBD (Astro recommended)

---

## Tooling Stack

| Tool | Purpose | Cost |
|---|---|---|
| Google Search Console | Keyword positions, indexing, Core Web Vitals | Free |
| Plausible Analytics | Privacy-first page views, referrers, sessions | ~$9/mo |
| Google Analytics 4 (GA4) | Funnel tracking, conversion goals (signup, install) | Free |
| Ahrefs Webmaster Tools | Backlink monitoring, site audit | Free tier |

> **Recommendation:** Use Plausible as primary for public-facing dashboards (shareable link, GDPR-friendly). Use GA4 for funnel/conversion tracking to paid plans.

---

## Google Search Console Setup

### 1. Verify Domain

```bash
# Option A: DNS TXT record (recommended for root domain)
# Add TXT record to gettraek.com DNS:
# google-site-verification=<value>

# Option B: HTML file at:
# https://gettraek.com/google<value>.html
```

### 2. Submit Sitemaps

Astro auto-generates `sitemap.xml` with `@astrojs/sitemap` integration.

**Add to `astro.config.mjs`:**
```js
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://gettraek.com',
  integrations: [
    sitemap(),  // <-- add this
    // ... existing integrations
  ]
});
```

**Install package:**
```bash
pnpm add @astrojs/sitemap --filter @traek/docs
```

**Submit to GSC:**
1. GSC → Sitemaps → `https://gettraek.com/sitemap-index.xml`
2. Also submit: `https://play.gettraek.com/sitemap.xml` (SvelteKit — see below)

### 3. SvelteKit Sitemap (Playground)

```ts
// src/routes/sitemap.xml/+server.ts
export async function GET() {
  const pages = ['/', '/pricing', '/enterprise'];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(p => `  <url><loc>https://play.gettraek.com${p}</loc></url>`).join('\n')}
</urlset>`;
  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' }
  });
}
```

---

## Plausible Analytics Setup

### Docs Site (Astro/Starlight)

Add to `astro.config.mjs` starlight `head`:
```js
{
  tag: 'script',
  attrs: {
    defer: true,
    'data-domain': 'gettraek.com',
    src: 'https://plausible.io/js/script.js'
  }
}
```

### Playground (SvelteKit)

Add to `src/app.html`:
```html
<script defer data-domain="play.gettraek.com" src="https://plausible.io/js/script.js"></script>
```

Or use the existing analytics client at `src/lib/client/analytics.ts` — extend it to call Plausible's API for custom events.

### Custom Events to Track

```ts
// Key conversion events — add to analytics.ts
export const events = {
  waitlistJoin: () => plausible('Waitlist Join'),
  signupComplete: () => plausible('Signup Complete'),
  docInstallView: () => plausible('Docs: Installation Viewed'),
  githubClick: () => plausible('GitHub CTA Clicked'),
  playgroundFirstCanvas: () => plausible('First Canvas Created'),
} as const;
```

---

## Google Analytics 4 Setup

### Measurement ID
Create GA4 property at analytics.google.com → get `G-XXXXXXXXXX`.

### Docs Site
```js
// astro.config.mjs head array — add after Plausible:
{
  tag: 'script',
  attrs: {
    async: true,
    src: 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX'
  }
},
{
  tag: 'script',
  content: `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  `
}
```

### Playground (SvelteKit)
Use SvelteKit's `afterNavigate` hook for SPA route tracking:

```ts
// src/routes/+layout.svelte
import { afterNavigate } from '$app/navigation';
import { page } from '$app/stores';

afterNavigate(() => {
  if (typeof gtag !== 'undefined') {
    gtag('config', 'G-XXXXXXXXXX', { page_path: $page.url.pathname });
  }
});
```

### Conversion Goals in GA4

| Goal | Event | Trigger |
|---|---|---|
| Waitlist Signup | `waitlist_signup` | POST /api/waitlist success |
| Auth Signup | `sign_up` | GA4 recommended event |
| Docs Install View | `docs_install_view` | `/getting-started/installation/` pageview |
| GitHub Star | `github_star_click` | Click on GitHub link |
| Playground Canvas | `first_canvas` | First node created |

---

## Key Organic Traffic KPIs

Track monthly:

| Metric | Target (Month 3) | Target (Month 12) |
|---|---|---|
| Organic sessions | 500 | 5,000 |
| Impressions (GSC) | 10,000 | 100,000 |
| Avg. position (core keywords) | 30 | 15 |
| Click-through rate | 2% | 4% |
| Docs-to-signup conversion | 1% | 2.5% |
| Blog posts indexed | 2 | 17 |

---

## robots.txt

Create at `public/robots.txt` (docs site) and `static/robots.txt` (SvelteKit playground):

```
User-agent: *
Allow: /

Sitemap: https://gettraek.com/sitemap-index.xml
```

---

## Core Web Vitals Targets

Google uses CWV as a ranking signal. Target:

| Metric | Target | Current Status |
|---|---|---|
| LCP (Largest Contentful Paint) | < 2.5s | Audit with Lighthouse |
| INP (Interaction to Next Paint) | < 200ms | Svelte 5 / Astro SSG: good baseline |
| CLS (Cumulative Layout Shift) | < 0.1 | Avoid layout shifts in streaming nodes |

Run quarterly: `npx lighthouse https://gettraek.com --output=html`

---

## Quarterly SEO Review Checklist

- [ ] GSC: Check for crawl errors, manual actions
- [ ] GSC: Review top 20 queries — any quick-win optimizations?
- [ ] Ahrefs: New backlinks? Broken links?
- [ ] Plausible: Top entry pages, bounce rate trends
- [ ] Run site audit: orphan pages, broken internal links
- [ ] Update blog content calendar based on keyword movement
- [ ] Refresh any post > 6 months old with updated examples
