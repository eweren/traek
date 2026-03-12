import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db.js';
import type { RequestHandler } from './$types.js';

interface SnapshotNode {
	id: string;
	role?: string;
	content?: string;
	parentIds?: string[];
}

interface ConversationSnapshot {
	title?: string;
	nodes?: SnapshotNode[];
}

function escapeXml(str: string): string {
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

function truncate(str: string, max: number): string {
	if (str.length <= max) return str;
	return str.slice(0, max - 1) + '…';
}

/** Wrap text into lines of at most `maxChars` characters */
function wrapText(text: string, maxChars: number): string[] {
	const words = text.split(/\s+/);
	const lines: string[] = [];
	let current = '';
	for (const word of words) {
		if ((current + ' ' + word).trim().length > maxChars) {
			if (current) lines.push(current);
			current = word;
		} else {
			current = current ? current + ' ' + word : word;
		}
		if (lines.length >= 3) break;
	}
	if (current && lines.length < 3) lines.push(current);
	return lines;
}

function buildSvg(
	title: string,
	description: string,
	nodeCount: number,
	messages: string[]
): string {
	const W = 1200;
	const H = 630;
	const safeTitle = escapeXml(truncate(title, 60));

	// First few message previews
	const previewMessages = messages.slice(0, 3).map((m, i) => {
		const role = i % 2 === 0 ? 'user' : 'assistant';
		const lines = wrapText(truncate(m, 80), 40);
		return { role, lines };
	});

	// Build message preview SVG elements
	let msgY = 300;
	const msgElements: string[] = [];
	for (const { role, lines } of previewMessages) {
		const isUser = role === 'user';
		const bubbleColor = isUser ? '#4f46e5' : '#1e1e2e';
		const textColor = isUser ? '#ffffff' : '#a0a0c0';
		const lineH = 22;
		const bubbleH = lines.length * lineH + 20;
		const bubbleW = 360;
		const bubbleX = isUser ? W / 2 - 60 - bubbleW : W / 2 - 60;

		msgElements.push(
			`<rect x="${bubbleX}" y="${msgY}" width="${bubbleW}" height="${bubbleH}" rx="10" fill="${bubbleColor}" opacity="0.9"/>`
		);
		lines.forEach((line, li) => {
			msgElements.push(
				`<text x="${bubbleX + 14}" y="${msgY + 16 + li * lineH}" font-family="system-ui,sans-serif" font-size="14" fill="${textColor}">${escapeXml(line)}</text>`
			);
		});
		msgY += bubbleH + 12;
	}

	return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0d0d1a"/>
      <stop offset="100%" stop-color="#111827"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#6366f1"/>
      <stop offset="100%" stop-color="#8b5cf6"/>
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="url(#bg)"/>

  <!-- Subtle grid dots -->
  <pattern id="dots" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
    <circle cx="1" cy="1" r="1" fill="#ffffff" opacity="0.04"/>
  </pattern>
  <rect width="${W}" height="${H}" fill="url(#dots)"/>

  <!-- Left panel: branding + info -->
  <rect x="0" y="0" width="540" height="${H}" fill="#0a0a14" opacity="0.6"/>
  <rect x="540" y="0" width="1" height="${H}" fill="#ffffff" opacity="0.06"/>

  <!-- Accent top bar -->
  <rect x="0" y="0" width="${W}" height="4" fill="url(#accent)"/>

  <!-- Logo wordmark -->
  <text x="48" y="80" font-family="system-ui,sans-serif" font-size="28" font-weight="700" fill="#ffffff" letter-spacing="-0.5">træk</text>
  <text x="48" y="105" font-family="system-ui,sans-serif" font-size="13" fill="#6366f1" letter-spacing="2" font-weight="500">SPATIAL AI</text>

  <!-- Title -->
  <text x="48" y="200" font-family="system-ui,sans-serif" font-size="32" font-weight="700" fill="#ffffff" filter="url(#glow)">${safeTitle}</text>

  <!-- Description (wrapped) -->
  ${wrapText(escapeXml(description), 38)
		.map(
			(line, i) =>
				`<text x="48" y="${238 + i * 26}" font-family="system-ui,sans-serif" font-size="18" fill="#9ca3af">${line}</text>`
		)
		.join('\n  ')}

  <!-- Stats badge -->
  <rect x="48" y="${H - 100}" width="200" height="40" rx="8" fill="#1e1e3a"/>
  <text x="68" y="${H - 74}" font-family="system-ui,sans-serif" font-size="14" fill="#a0a0c0">${nodeCount} message${nodeCount === 1 ? '' : 's'} · Shared canvas</text>

  <!-- Traek.com label -->
  <text x="48" y="${H - 36}" font-family="system-ui,sans-serif" font-size="13" fill="#4f46e5" font-weight="600">play.gettraek.com</text>

  <!-- Right panel: message preview -->
  <text x="580" y="68" font-family="system-ui,sans-serif" font-size="13" fill="#4b5563" letter-spacing="1" font-weight="500">CONVERSATION PREVIEW</text>

  <!-- Tree connector lines (decorative) -->
  <line x1="760" y1="90" x2="760" y2="${Math.min(msgY, H - 40)}" stroke="#6366f1" stroke-width="1.5" stroke-dasharray="4,4" opacity="0.3"/>

  <!-- Message bubbles -->
  ${msgElements.join('\n  ')}

  <!-- Fade overlay at bottom of right panel -->
  <defs>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0d0d1a" stop-opacity="0"/>
      <stop offset="100%" stop-color="#0d0d1a" stop-opacity="0.9"/>
    </linearGradient>
  </defs>
  <rect x="541" y="${H - 120}" width="${W - 541}" height="120" fill="url(#fade)"/>
</svg>`;
}

export const GET: RequestHandler = async ({ params }) => {
	const { data } = await db()
		.from('shares')
		.select('snapshot')
		.eq('token', params.token)
		.maybeSingle();

	if (!data) error(404, 'Share not found');

	const snapshot = data.snapshot as ConversationSnapshot;
	const title = snapshot?.title || 'Shared conversation';
	const nodes: SnapshotNode[] = Array.isArray(snapshot?.nodes) ? snapshot.nodes : [];
	const nodeCount = nodes.length;

	// Build description
	const firstUser = nodes.find((n) => n.role === 'user' && typeof n.content === 'string');
	let description = firstUser?.content?.slice(0, 120) ?? '';
	if (firstUser?.content && firstUser.content.length > 120) description += '…';
	if (!description)
		description = `${nodeCount} message${nodeCount === 1 ? '' : 's'} in this canvas`;

	// First few message contents for preview
	const messages = nodes
		.filter((n) => (n.role === 'user' || n.role === 'assistant') && typeof n.content === 'string')
		.slice(0, 4)
		.map((n) => n.content as string);

	const svg = buildSvg(title, description, nodeCount, messages);

	return new Response(svg, {
		headers: {
			'Content-Type': 'image/svg+xml',
			'Cache-Control': 'public, max-age=3600, s-maxage=3600'
		}
	});
};
