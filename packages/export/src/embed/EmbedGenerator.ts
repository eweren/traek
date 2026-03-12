import type { ConversationSnapshot } from '@traek/core';
import { generatePdfHtml } from '../pdf/PdfExporter.js';

export interface IframeEmbedOptions {
	/** Width of the iframe. Default: '100%'. */
	width?: string;
	/** Height of the iframe. Default: '600px'. */
	height?: string;
	/** Whether to include a border. Default: false. */
	border?: boolean;
	/** Whether to add loading="lazy". Default: true. */
	lazy?: boolean;
	/** Additional attributes to add to the iframe tag. */
	extraAttributes?: Record<string, string>;
}

export interface SelfContainedEmbedOptions {
	/** Title for the embed page. Defaults to the snapshot title. */
	title?: string;
	/** Max height of the widget container. Default: '600px'. */
	maxHeight?: string;
	/** Whether to use dark theme. Default: true. */
	dark?: boolean;
}

/**
 * Generate an `<iframe>` embed snippet pointing to a Træk share URL.
 *
 * @param shareUrl The public share URL (e.g. https://app.traek.dev/share/abc123)
 */
export function generateIframeEmbed(shareUrl: string, opts: IframeEmbedOptions = {}): string {
	const width = opts.width ?? '100%';
	const height = opts.height ?? '600px';
	const loading = opts.lazy !== false ? ' loading="lazy"' : '';
	const border = opts.border ? '' : ' style="border:none"';
	const extra = opts.extraAttributes
		? ' ' +
			Object.entries(opts.extraAttributes)
				.map(([k, v]) => `${k}="${escAttr(v)}"`)
				.join(' ')
		: '';

	return `<iframe
  src="${escAttr(shareUrl)}"
  width="${escAttr(width)}"
  height="${escAttr(height)}"
  title="Træk conversation"
  allow="clipboard-read; clipboard-write"${loading}${border}${extra}
></iframe>`;
}

/**
 * Generate a self-contained HTML widget that can be dropped into any page.
 * The snapshot is embedded inline — no external requests needed.
 *
 * Returns an HTML string containing a `<script>` + `<div>` that renders
 * a read-only scrollable conversation view.
 */
export function generateSelfContainedEmbed(
	snapshot: ConversationSnapshot,
	opts: SelfContainedEmbedOptions = {}
): string {
	const dark = opts.dark !== false;
	const maxHeight = opts.maxHeight ?? '600px';
	const bg = dark ? '#11111b' : '#f9fafb';
	const fg = dark ? '#cdd6f4' : '#111827';
	const border = dark ? '#313244' : '#e5e7eb';
	const userColor = '#3b82f6';
	const assistantColor = '#10b981';
	const systemColor = '#8b5cf6';
	const nodeMap = new Map<string, (typeof snapshot.nodes)[number]>();
	for (const n of snapshot.nodes) nodeMap.set(n.id, n);

	const roots = snapshot.nodes.filter(
		(n) => n.parentIds.length === 0 || !nodeMap.has(n.parentIds[0]!)
	);

	// Linearize main path (first branch only for widget compactness)
	const mainPath: (typeof snapshot.nodes)[number][] = [];
	const dfsFirst = (id: string): void => {
		const node = nodeMap.get(id);
		if (!node) return;
		mainPath.push(node);
		const firstChild = snapshot.nodes.find((n) => n.parentIds.includes(id));
		if (firstChild) dfsFirst(firstChild.id);
	};
	if (roots.length > 0) dfsFirst(roots[0]!.id);

	const roleColor = (role: string) =>
		role === 'user' ? userColor : role === 'assistant' ? assistantColor : systemColor;
	const roleLabel = (role: string) =>
		role === 'user' ? 'User' : role === 'assistant' ? 'Assistant' : 'System';

	const messages = mainPath
		.filter((n) => n.role !== 'system')
		.map(
			(n) => `
    <div style="padding:12px 16px;border-radius:8px;background:${dark ? '#1e1e2e' : '#fff'};
      margin-bottom:8px;border:1px solid ${border}">
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;
        color:${roleColor(n.role)};margin-bottom:6px">${escAttr(roleLabel(n.role))}</div>
      <div style="white-space:pre-wrap;word-break:break-word;font-size:13px;line-height:1.6;
        color:${fg}">${escHtml(n.content ?? '')}</div>
    </div>`
		)
		.join('');

	const branchCount = snapshot.nodes.filter((n) => {
		const childCount = snapshot.nodes.filter((c) => c.parentIds.includes(n.id)).length;
		return childCount > 1;
	}).length;

	const footer =
		branchCount > 0
			? `<div style="font-size:11px;color:${dark ? '#6c7086' : '#9ca3af'};text-align:center;
      margin-top:8px">+${branchCount} branch${branchCount > 1 ? 'es' : ''} · <a href="#"
      style="color:${userColor}">View full conversation →</a></div>`
			: '';

	return `<!-- Træk conversation widget — https://traek.dev -->
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  background:${bg};border:1px solid ${border};border-radius:12px;
  padding:16px;max-height:${maxHeight};overflow-y:auto;box-sizing:border-box">
  <div style="font-size:12px;font-weight:700;color:${dark ? '#89b4fa' : '#3b82f6'};
    letter-spacing:-0.02em;margin-bottom:12px">træk</div>
  ${messages}
  ${footer}
</div>
<!-- End Træk widget -->`;
}

/**
 * Generate a full, self-contained HTML document embed (for iframes with srcdoc).
 * Uses the linear PDF renderer to produce a clean read-only view.
 */
export function generateSrcdocEmbed(snapshot: ConversationSnapshot): string {
	return generatePdfHtml(snapshot, {
		mode: 'linear',
		includeMetadata: false,
		extraCss: 'body { padding: 16px; } h1 { font-size: 16px; }'
	});
}

/**
 * Generate an iframe with srcdoc containing the full conversation.
 * No external URL required — snapshot is embedded inline.
 */
export function generateSrcdocIframe(
	snapshot: ConversationSnapshot,
	opts: IframeEmbedOptions = {}
): string {
	const html = generateSrcdocEmbed(snapshot);
	const width = opts.width ?? '100%';
	const height = opts.height ?? '600px';
	const border = opts.border ? '' : ' style="border:none"';

	// Escape for HTML attribute (replace quotes and special chars)
	const srcdoc = html.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

	return `<iframe
  srcdoc="${srcdoc}"
  width="${escAttr(width)}"
  height="${escAttr(height)}"
  title="Træk conversation"
  sandbox="allow-same-origin"${border}
></iframe>`;
}

function escAttr(s: string): string {
	return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function escHtml(s: string): string {
	return s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}
