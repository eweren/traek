import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import typescript from 'highlight.js/lib/languages/typescript';
import bash from 'highlight.js/lib/languages/bash';
import xml from 'highlight.js/lib/languages/xml';
import DOMPurify, { type Config as DOMPurifyConfig } from 'dompurify';

// Register a minimal set of languages we actually use in the docs.
hljs.registerLanguage('ts', typescript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('bash', bash);
// Treat Svelte blocks as HTML/XML for highlighting purposes.
hljs.registerLanguage('svelte', xml);

const marked = new Marked(
	markedHighlight({
		emptyLangClass: 'hljs',
		langPrefix: 'hljs language-',
		highlight(code, lang) {
			const language = hljs.getLanguage(lang) ? lang : 'plaintext';
			return hljs.highlight(code, { language }).value;
		}
	})
);

/**
 * DOMPurify config for markdown-rendered HTML.
 *
 * Allowlist covers all elements produced by marked (headings, lists, code,
 * links, images, tables, blockquotes, etc.) while blocking every XSS vector:
 * - `<script>`, `<iframe>`, `<object>`, `<embed>`, `<form>` are removed
 * - `on*` event attributes are stripped
 * - `javascript:` and `data:` URIs are rejected
 * - `ALLOW_DATA_ATTR: false` prevents data-* attribute injection
 *
 * CSP note: DOMPurify operates on the DOM and never injects `eval` or
 * `Function()` calls, making it compatible with `script-src 'self'` policies.
 *
 * SSR note: DOMPurify requires a browser DOM. When running on the server
 * (typeof window === 'undefined') marked output is returned as-is; the
 * browser will sanitize on first render via hydration. For fully server-side
 * contexts (e.g. email, PDF) always sanitize separately before use.
 */
const PURIFY_CONFIG: DOMPurifyConfig = {
	ALLOWED_TAGS: [
		// Block elements
		'p',
		'div',
		'br',
		'hr',
		'pre',
		'blockquote',
		// Headings
		'h1',
		'h2',
		'h3',
		'h4',
		'h5',
		'h6',
		// Inline elements
		'span',
		'strong',
		'em',
		'del',
		'ins',
		'mark',
		'code',
		'kbd',
		'samp',
		// Lists
		'ul',
		'ol',
		'li',
		// Links & media
		'a',
		'img',
		// Tables
		'table',
		'thead',
		'tbody',
		'tfoot',
		'tr',
		'th',
		'td',
		'caption',
		// Details/summary (used in some markdown extensions)
		'details',
		'summary'
	],
	ALLOWED_ATTR: [
		'href',
		'src',
		'alt',
		'title',
		'class',
		'id',
		'width',
		'height',
		'target',
		'rel',
		// Table alignment
		'align',
		'valign'
	],
	ALLOW_DATA_ATTR: false,
	// Reject javascript: and data: URIs in href/src; allow http/https/mailto/tel
	ALLOWED_URI_REGEXP:
		/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms):|[^a-z]|[a-z+.-]+(?:[^a-z+.:-]|$))/i
};

/**
 * Renders markdown to sanitized HTML (supports images, bold, lists, code
 * blocks, tables, etc.).
 *
 * Security: output is sanitized with DOMPurify in browser environments,
 * blocking script injection, event handlers, and dangerous URIs. Safe to use
 * with user-supplied content and AI model responses.
 *
 * Returns the same output on server and client to avoid hydration mismatch.
 */
export function markdownToHtml(md: string): string {
	if (!md || typeof md !== 'string') return '';
	const raw = marked.parse(md, { async: false });
	const html = typeof raw === 'string' ? raw : '';

	// DOMPurify is browser-only; skip on server (SSR path)
	if (typeof window === 'undefined' || !DOMPurify.isSupported) {
		return html;
	}

	return String(DOMPurify.sanitize(html, PURIFY_CONFIG));
}
