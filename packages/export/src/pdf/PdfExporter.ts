import type { ConversationSnapshot, SerializedNode } from '@traek/core';
import type { PdfExportOptions } from './types.js';
import { computeTreeLayout } from './treeLayout.js';

const ROLE_COLORS: Record<string, string> = {
	user: '#3b82f6',
	assistant: '#10b981',
	system: '#8b5cf6'
};

const ROLE_LABELS: Record<string, string> = {
	user: 'User',
	assistant: 'Assistant',
	system: 'System'
};

// ─── Linear (thread-by-thread) HTML ───────────────────────────────────────────

function buildLinearHtml(snapshot: ConversationSnapshot, opts: PdfExportOptions): string {
	const title = opts.title ?? snapshot.title ?? 'Conversation';
	const nodeMap = new Map<string, SerializedNode>();
	for (const n of snapshot.nodes) nodeMap.set(n.id, n);

	const roots = snapshot.nodes.filter(
		(n) => n.parentIds.length === 0 || !nodeMap.has(n.parentIds[0]!)
	);

	// Extract all root-to-leaf paths
	const threads: SerializedNode[][] = [];

	function dfs(id: string, path: SerializedNode[]): void {
		const node = nodeMap.get(id);
		if (!node) return;
		const newPath = [...path, node];
		const childIds = snapshot.nodes.filter((n) => n.parentIds.includes(id)).map((n) => n.id);
		if (childIds.length === 0) {
			threads.push(newPath);
		} else {
			for (const cid of childIds) dfs(cid, newPath);
		}
	}

	for (const r of roots) dfs(r.id, []);

	const threadHtml = threads
		.map(
			(thread, i) => `
		<section class="thread">
			<h2>Branch ${i + 1}</h2>
			${thread
				.map(
					(n) => `
				<div class="message message--${n.role}">
					<div class="message__role" style="color:${ROLE_COLORS[n.role] ?? '#888'}">
						${ROLE_LABELS[n.role] ?? n.role}
					</div>
					<div class="message__content">${escapeHtml(n.content ?? '')}</div>
				</div>`
				)
				.join('')}
		</section>`
		)
		.join('');

	return wrapHtml(title, threadHtml, opts);
}

// ─── Tree (SVG diagram) HTML ───────────────────────────────────────────────────

function buildTreeHtml(snapshot: ConversationSnapshot, opts: PdfExportOptions): string {
	const title = opts.title ?? snapshot.title ?? 'Conversation';
	const layout = computeTreeLayout(snapshot.nodes);

	const NODE_W = 160;
	const NODE_H = 60;
	const GAP_X = 40;
	const GAP_Y = 80;

	const svgW = Math.max(800, layout.cols * (NODE_W + GAP_X) + GAP_X);
	const svgH = Math.max(400, layout.rows * (NODE_H + GAP_Y) + GAP_Y);

	const nodePositions = new Map<string, { cx: number; cy: number }>();
	for (const ln of layout.nodes) {
		const cx = GAP_X + ln.col * (NODE_W + GAP_X) + NODE_W / 2;
		const cy = GAP_Y + ln.row * (NODE_H + GAP_Y) + NODE_H / 2;
		nodePositions.set(ln.id, { cx, cy });
	}

	const edgesSvg = layout.edges
		.map(({ from, to }) => {
			const a = nodePositions.get(from);
			const b = nodePositions.get(to);
			if (!a || !b) return '';
			return `<line x1="${a.cx}" y1="${a.cy + NODE_H / 2}" x2="${b.cx}" y2="${b.cy - NODE_H / 2}" stroke="#555" stroke-width="1.5" stroke-dasharray="4 2"/>`;
		})
		.join('\n');

	const nodesSvg = layout.nodes
		.map((ln) => {
			const pos = nodePositions.get(ln.id);
			if (!pos) return '';
			const x = pos.cx - NODE_W / 2;
			const y = pos.cy - NODE_H / 2;
			const color = ROLE_COLORS[ln.role] ?? '#888';
			const label = ROLE_LABELS[ln.role] ?? ln.role;
			const snippet = (ln.content ?? '').slice(0, 40) + (ln.content?.length > 40 ? '…' : '');
			return `
			<g>
				<rect x="${x}" y="${y}" width="${NODE_W}" height="${NODE_H}"
					rx="8" ry="8" fill="#1e1e2e" stroke="${color}" stroke-width="2"/>
				<text x="${pos.cx}" y="${y + 18}" text-anchor="middle" fill="${color}"
					font-size="10" font-weight="bold" font-family="monospace">${escapeHtml(label)}</text>
				<text x="${pos.cx}" y="${y + 34}" text-anchor="middle" fill="#cdd6f4"
					font-size="9" font-family="sans-serif">${escapeHtml(snippet)}</text>
			</g>`;
		})
		.join('\n');

	const svgContent = `
		<div class="tree-diagram">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgW} ${svgH}"
				width="${svgW}" height="${svgH}" style="max-width:100%;background:#11111b;border-radius:12px">
				${edgesSvg}
				${nodesSvg}
			</svg>
		</div>`;

	return wrapHtml(title, svgContent, opts);
}

// ─── HTML wrapper ──────────────────────────────────────────────────────────────

function wrapHtml(title: string, body: string, opts: PdfExportOptions): string {
	const paperCss =
		opts.paperSize === 'letter'
			? '@page { size: letter; }'
			: opts.paperSize === 'a3'
				? '@page { size: A3; }'
				: '@page { size: A4; }';

	const orientationCss =
		opts.orientation === 'landscape' ? '@page { orientation: landscape; }' : '';

	const metaLine =
		opts.includeMetadata !== false
			? `<div class="meta">Exported ${new Date().toLocaleString()} · træk</div>`
			: '';

	return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>${escapeHtml(title)}</title>
<style>
${paperCss}
${orientationCss}
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
	background: #fff;
	color: #111;
	padding: 40px;
	font-size: 13px;
	line-height: 1.6;
}
h1 {
	font-size: 22px;
	font-weight: 700;
	letter-spacing: -0.03em;
	margin-bottom: 8px;
}
h2 {
	font-size: 14px;
	font-weight: 600;
	color: #555;
	margin: 24px 0 12px;
}
.thread {
	break-inside: avoid;
	margin-bottom: 32px;
	padding-bottom: 24px;
	border-bottom: 1px solid #e5e7eb;
}
.message {
	padding: 12px 16px;
	border-radius: 8px;
	background: #f9fafb;
	margin-bottom: 8px;
	break-inside: avoid;
}
.message__role {
	font-size: 10px;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.08em;
	margin-bottom: 6px;
}
.message__content {
	white-space: pre-wrap;
	word-break: break-word;
}
.meta {
	margin-top: 40px;
	font-size: 10px;
	color: #999;
	text-align: center;
}
.tree-diagram {
	overflow-x: auto;
}
@media print {
	body { padding: 20px; }
	.thread { break-inside: avoid; }
}
${opts.extraCss ?? ''}
</style>
</head>
<body>
<h1>${escapeHtml(title)}</h1>
${body}
${metaLine}
</body>
</html>`;
}

function escapeHtml(s: string): string {
	return s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

// ─── Public API ────────────────────────────────────────────────────────────────

/**
 * Generate print-ready HTML for a conversation snapshot.
 * Pass to `openPrintDialog()` to trigger the browser PDF export flow,
 * or serialize and send to a server-side headless Chrome renderer.
 */
export function generatePdfHtml(
	snapshot: ConversationSnapshot,
	opts: PdfExportOptions = {}
): string {
	return opts.mode === 'tree' ? buildTreeHtml(snapshot, opts) : buildLinearHtml(snapshot, opts);
}

/**
 * Open the browser's native Print dialog (which includes Save as PDF) with
 * the conversation rendered in a new window.
 *
 * Must be called from a user gesture (button click) to avoid popup blockers.
 */
export function openPrintDialog(snapshot: ConversationSnapshot, opts: PdfExportOptions = {}): void {
	if (typeof window === 'undefined')
		throw new Error('openPrintDialog requires a browser environment');

	const html = generatePdfHtml(snapshot, opts);
	const win = window.open('', '_blank');
	if (!win) throw new Error('Popup blocked. Call openPrintDialog from a user-gesture handler.');

	win.document.open();
	win.document.write(html);
	win.document.close();

	// Slight delay so images/fonts have time to load before print dialog
	setTimeout(() => {
		win.focus();
		win.print();
	}, 400);
}

/**
 * Export a conversation snapshot as a downloadable HTML file (which can then
 * be opened in a browser and printed to PDF). Useful for server-side or
 * environments where popup windows are unavailable.
 */
export function downloadPdfHtml(snapshot: ConversationSnapshot, opts: PdfExportOptions = {}): void {
	if (typeof window === 'undefined')
		throw new Error('downloadPdfHtml requires a browser environment');

	const html = generatePdfHtml(snapshot, opts);
	const blob = new Blob([html], { type: 'text/html' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = `${(opts.title ?? snapshot.title ?? 'conversation').replace(/[^a-z0-9]/gi, '-')}.html`;
	document.body.appendChild(a);
	a.click();
	setTimeout(() => {
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}, 100);
}
