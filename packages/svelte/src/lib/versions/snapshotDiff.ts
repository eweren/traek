import type { ConversationSnapshot } from '../persistence/schemas';
import type { SnapshotDiff } from './types';

/**
 * Computes a structural diff between two ConversationSnapshots.
 * Reports added/removed node IDs and content/metadata changes for shared nodes.
 */
export function snapshotDiff(
	before: ConversationSnapshot,
	after: ConversationSnapshot
): SnapshotDiff {
	const beforeIds = new Set(before.nodes.map((n) => n.id));
	const afterIds = new Set(after.nodes.map((n) => n.id));

	const addedNodeIds = after.nodes.filter((n) => !beforeIds.has(n.id)).map((n) => n.id);
	const removedNodeIds = before.nodes.filter((n) => !afterIds.has(n.id)).map((n) => n.id);

	const beforeMap = new Map(before.nodes.map((n) => [n.id, n]));

	const changedNodes = after.nodes
		.filter((n) => beforeIds.has(n.id))
		.flatMap((afterNode) => {
			const beforeNode = beforeMap.get(afterNode.id)!;
			const contentChanged = afterNode.content !== beforeNode.content;
			const metadataChanged =
				afterNode.metadata.x !== beforeNode.metadata.x ||
				afterNode.metadata.y !== beforeNode.metadata.y ||
				afterNode.metadata.height !== beforeNode.metadata.height;

			if (!contentChanged && !metadataChanged) return [];
			return [{ id: afterNode.id, contentChanged, metadataChanged }];
		});

	return {
		nodeCountBefore: before.nodes.length,
		nodeCountAfter: after.nodes.length,
		addedNodeIds,
		removedNodeIds,
		changedNodes
	};
}
