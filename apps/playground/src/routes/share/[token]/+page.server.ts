import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db.js';
import type { PageServerLoad } from './$types.js';

interface SnapshotNode {
	id: string;
	role?: string;
	content?: string;
	parentIds?: string[];
}

interface ConversationSnapshot {
	title?: string;
	nodes?: SnapshotNode[];
	createdAt?: string;
}

function extractMeta(snapshot: unknown): { title: string; description: string; nodeCount: number } {
	const s = snapshot as ConversationSnapshot;
	const title = s?.title || 'Shared conversation';
	const nodes: SnapshotNode[] = Array.isArray(s?.nodes) ? s.nodes : [];
	const nodeCount = nodes.length;

	// Find first user message for description
	const firstUser = nodes.find((n) => n.role === 'user' && typeof n.content === 'string');
	let description = firstUser?.content?.slice(0, 140) ?? '';
	if (firstUser?.content && firstUser.content.length > 140) description += '…';
	if (!description)
		description = `${nodeCount} message${nodeCount === 1 ? '' : 's'} in this canvas`;

	return { title, description, nodeCount };
}

export const load: PageServerLoad = async ({ params, url }) => {
	const { data } = await db()
		.from('shares')
		.select('snapshot, conversation_id')
		.eq('token', params.token)
		.maybeSingle();

	if (!data) error(404, 'Shared conversation not found');

	const { title, description, nodeCount } = extractMeta(data.snapshot);

	const ogImageUrl = new URL(`/api/og/${params.token}`, url.origin).toString();
	const shareUrl = url.toString();

	return { snapshot: data.snapshot, title, description, nodeCount, ogImageUrl, shareUrl };
};
