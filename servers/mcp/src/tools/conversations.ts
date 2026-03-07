import { z } from 'zod';
import {
	createConversation,
	deleteConversation,
	listConversations,
	loadConversation,
	requireEngine
} from '../store.js';
import {
	exportActiveBranchMarkdown,
	exportAllBranchesMarkdown,
	exportBranchMarkdown,
	exportJson
} from '../export-utils.js';

type McpResponse = { content: Array<{ type: 'text'; text: string }> };

// ─── Conversation management ──────────────────────────────────────────────────

export const conversationTools = [
	{
		name: 'traek_list_conversations',
		description: 'List all open Træk conversations with their IDs, titles, and node counts.',
		inputSchema: {},
		handler: (): McpResponse => {
			const convs = listConversations();
			const text =
				convs.length === 0
					? 'No conversations open.'
					: convs
							.map((c) => `- ${c.id}${c.title ? ` (${c.title})` : ''} — ${c.nodeCount} nodes`)
							.join('\n');
			return { content: [{ type: 'text', text }] };
		}
	},
	{
		name: 'traek_create_conversation',
		description: 'Create a new empty Træk conversation.',
		inputSchema: {
			id: z.string().describe('Unique conversation ID (e.g. "research-session-1")'),
			title: z.string().optional().describe('Optional human-readable title')
		},
		handler: ({ id, title }: { id: string; title?: string }): McpResponse => {
			createConversation(id, title);
			return {
				content: [
					{ type: 'text', text: `Created conversation "${id}"${title ? ` (${title})` : ''}.` }
				]
			};
		}
	},
	{
		name: 'traek_delete_conversation',
		description: 'Delete a Træk conversation and all its nodes from memory.',
		inputSchema: { id: z.string().describe('Conversation ID to delete') },
		handler: ({ id }: { id: string }): McpResponse => {
			const deleted = deleteConversation(id);
			return {
				content: [
					{ type: 'text', text: deleted ? `Deleted "${id}".` : `Conversation "${id}" not found.` }
				]
			};
		}
	},
	{
		name: 'traek_load_conversation',
		description:
			'Load a conversation from a JSON snapshot (ConversationSnapshot format). Replaces any existing conversation with the same ID.',
		inputSchema: {
			id: z.string().describe('Conversation ID to assign'),
			snapshot: z.string().describe('JSON string of the conversation snapshot')
		},
		handler: ({ id, snapshot }: { id: string; snapshot: string }): McpResponse => {
			loadConversation(id, JSON.parse(snapshot) as unknown);
			const engine = requireEngine(id);
			return {
				content: [{ type: 'text', text: `Loaded "${id}" with ${engine.nodes.length} nodes.` }]
			};
		}
	},
	{
		name: 'traek_get_conversation_summary',
		description: 'Get a summary of a conversation: node count, depth, branch count, active node.',
		inputSchema: { id: z.string().describe('Conversation ID') },
		handler: ({ id }: { id: string }): McpResponse => {
			const engine = requireEngine(id);
			const roots = engine.nodes.filter((n) => n.parentIds.length === 0);
			const parentIdSet = new Set(engine.nodes.flatMap((n) => n.parentIds));
			const leaves = engine.nodes.filter((n) => !parentIdSet.has(n.id));
			const lines = [
				`Conversation: ${id}`,
				`Nodes: ${engine.nodes.length}`,
				`Roots: ${roots.length}`,
				`Branches (leaves): ${leaves.length}`,
				`Max depth: ${engine.getMaxDepth()}`,
				`Active node: ${engine.activeNodeId ?? '(none)'}`
			];
			return { content: [{ type: 'text', text: lines.join('\n') }] };
		}
	},

	// ─── Node operations ────────────────────────────────────────────────────

	{
		name: 'traek_add_node',
		description: 'Add a message node to a conversation. Returns the new node ID.',
		inputSchema: {
			conversationId: z.string().describe('Conversation ID'),
			content: z.string().describe('Text content of the node'),
			role: z.enum(['user', 'assistant', 'system']).describe('Message role'),
			parentId: z
				.string()
				.optional()
				.describe('Parent node ID. Omit to use the current active node.'),
			type: z.string().optional().describe('Node type: "text" (default), "code", "thought"')
		},
		handler: ({
			conversationId,
			content,
			role,
			parentId,
			type
		}: {
			conversationId: string;
			content: string;
			role: 'user' | 'assistant' | 'system';
			parentId?: string;
			type?: string;
		}): McpResponse => {
			const engine = requireEngine(conversationId);
			const node = engine.addNode(content, role, {
				type: type ?? 'text',
				parentIds: parentId ? [parentId] : undefined
			});
			return {
				content: [{ type: 'text', text: `Added node "${node.id}" (role=${role}).` }]
			};
		}
	},
	{
		name: 'traek_update_node',
		description: 'Update the content or status of an existing node.',
		inputSchema: {
			conversationId: z.string().describe('Conversation ID'),
			nodeId: z.string().describe('Node ID to update'),
			content: z.string().optional().describe('New text content'),
			status: z.enum(['streaming', 'done', 'error']).optional().describe('New status')
		},
		handler: ({
			conversationId,
			nodeId,
			content,
			status
		}: {
			conversationId: string;
			nodeId: string;
			content?: string;
			status?: 'streaming' | 'done' | 'error';
		}): McpResponse => {
			const engine = requireEngine(conversationId);
			if (!engine.getNode(nodeId))
				throw new Error(`Node "${nodeId}" not found in "${conversationId}"`);
			const updates: Record<string, unknown> = {};
			if (content !== undefined) updates.content = content;
			if (status !== undefined) updates.status = status;
			engine.updateNode(nodeId, updates);
			return { content: [{ type: 'text', text: `Updated node "${nodeId}".` }] };
		}
	},
	{
		name: 'traek_delete_node',
		description: 'Delete a single node (without its descendants).',
		inputSchema: {
			conversationId: z.string().describe('Conversation ID'),
			nodeId: z.string().describe('Node ID to delete')
		},
		handler: ({
			conversationId,
			nodeId
		}: {
			conversationId: string;
			nodeId: string;
		}): McpResponse => {
			requireEngine(conversationId).deleteNode(nodeId);
			return { content: [{ type: 'text', text: `Deleted node "${nodeId}".` }] };
		}
	},
	{
		name: 'traek_delete_branch',
		description: 'Delete a node and all its descendants.',
		inputSchema: {
			conversationId: z.string().describe('Conversation ID'),
			nodeId: z.string().describe('Root node of the branch to delete')
		},
		handler: ({
			conversationId,
			nodeId
		}: {
			conversationId: string;
			nodeId: string;
		}): McpResponse => {
			const engine = requireEngine(conversationId);
			const count = engine.getDescendantCount(nodeId);
			engine.deleteNodeAndDescendants(nodeId);
			return {
				content: [{ type: 'text', text: `Deleted node "${nodeId}" and ${count} descendant(s).` }]
			};
		}
	},
	{
		name: 'traek_get_node',
		description: 'Get details of a specific node: role, content, status, parent IDs, position.',
		inputSchema: {
			conversationId: z.string().describe('Conversation ID'),
			nodeId: z.string().describe('Node ID')
		},
		handler: ({
			conversationId,
			nodeId
		}: {
			conversationId: string;
			nodeId: string;
		}): McpResponse => {
			const engine = requireEngine(conversationId);
			const node = engine.getNode(nodeId);
			if (!node) throw new Error(`Node "${nodeId}" not found in "${conversationId}"`);
			const msg = node as { content?: string };
			const lines = [
				`ID: ${node.id}`,
				`Role: ${node.role}  Type: ${node.type}  Status: ${node.status ?? 'done'}`,
				`Parents: ${node.parentIds.join(', ') || '(root)'}`,
				`Children: ${
					engine
						.getChildren(node.id)
						.map((c) => c.id)
						.join(', ') || '(none)'
				}`,
				`Depth: ${engine.getDepth(node.id)}`,
				`Position: x=${node.metadata?.x ?? 0} y=${node.metadata?.y ?? 0}`,
				``,
				msg.content ?? '(no content)'
			];
			return { content: [{ type: 'text', text: lines.join('\n') }] };
		}
	},
	{
		name: 'traek_list_nodes',
		description: 'List all nodes with IDs, roles, and a content preview.',
		inputSchema: {
			conversationId: z.string().describe('Conversation ID'),
			role: z.enum(['user', 'assistant', 'system']).optional().describe('Filter by role')
		},
		handler: ({
			conversationId,
			role
		}: {
			conversationId: string;
			role?: 'user' | 'assistant' | 'system';
		}): McpResponse => {
			const engine = requireEngine(conversationId);
			const nodes = role ? engine.nodes.filter((n) => n.role === role) : engine.nodes;
			if (nodes.length === 0) return { content: [{ type: 'text', text: 'No nodes found.' }] };
			const lines = nodes.map((n) => {
				const msg = n as { content?: string };
				const preview = (msg.content ?? '').slice(0, 80).replace(/\n/g, ' ');
				const indent = '  '.repeat(Math.max(0, engine.getDepth(n.id)));
				return `${indent}[${n.id.slice(0, 8)}] ${n.role}: ${preview}${(msg.content?.length ?? 0) > 80 ? '…' : ''}`;
			});
			return { content: [{ type: 'text', text: lines.join('\n') }] };
		}
	},
	{
		name: 'traek_branch_from',
		description:
			'Set the active node to branch from. The next traek_add_node call without an explicit parentId will branch from here.',
		inputSchema: {
			conversationId: z.string().describe('Conversation ID'),
			nodeId: z.string().describe('Node ID to branch from')
		},
		handler: ({
			conversationId,
			nodeId
		}: {
			conversationId: string;
			nodeId: string;
		}): McpResponse => {
			requireEngine(conversationId).branchFrom(nodeId);
			return {
				content: [
					{ type: 'text', text: `Active node set to "${nodeId}". Next add will branch from here.` }
				]
			};
		}
	},
	{
		name: 'traek_get_branch_context',
		description:
			'Get the full conversation path from root to a node (for LLM context). Formatted as role-labeled blocks.',
		inputSchema: {
			conversationId: z.string().describe('Conversation ID'),
			nodeId: z.string().optional().describe('Node ID (defaults to active node)')
		},
		handler: ({
			conversationId,
			nodeId
		}: {
			conversationId: string;
			nodeId?: string;
		}): McpResponse => {
			const engine = requireEngine(conversationId);
			const targetId = nodeId ?? engine.activeNodeId;
			if (!targetId) throw new Error('No active node. Provide a nodeId.');
			const path: Array<{ role: string; content: string }> = [];
			let current = engine.getNode(targetId);
			while (current) {
				const msg = current as { content?: string };
				path.unshift({ role: current.role, content: msg.content ?? '' });
				const pid = current.parentIds[0];
				current = pid ? engine.getNode(pid) : undefined;
			}
			const text = path.map((m) => `[${m.role.toUpperCase()}]\n${m.content}`).join('\n\n---\n\n');
			return { content: [{ type: 'text', text: text || '(empty path)' }] };
		}
	},

	// ─── Search and filter ──────────────────────────────────────────────────

	{
		name: 'traek_search',
		description: 'Search for nodes whose content matches a query string.',
		inputSchema: {
			conversationId: z.string().describe('Conversation ID'),
			query: z.string().describe('Search query')
		},
		handler: ({
			conversationId,
			query
		}: {
			conversationId: string;
			query: string;
		}): McpResponse => {
			const engine = requireEngine(conversationId);
			engine.searchNodesMethod(query);
			const matches = engine.searchMatches;
			if (matches.length === 0)
				return { content: [{ type: 'text', text: `No results for "${query}".` }] };
			const lines = matches.map((id) => {
				const node = engine.getNode(id);
				if (!node) return `[${id.slice(0, 8)}] (not found)`;
				const msg = node as { content?: string };
				return `[${id.slice(0, 8)}] ${node.role}: ${(msg.content ?? '').slice(0, 120).replace(/\n/g, ' ')}`;
			});
			return {
				content: [
					{
						type: 'text',
						text: `${matches.length} result(s) for "${query}":\n\n${lines.join('\n')}`
					}
				]
			};
		}
	},
	{
		name: 'traek_get_children',
		description: 'Get the direct children of a node.',
		inputSchema: {
			conversationId: z.string().describe('Conversation ID'),
			nodeId: z.string().optional().describe('Parent node ID. Omit for root-level nodes.')
		},
		handler: ({
			conversationId,
			nodeId
		}: {
			conversationId: string;
			nodeId?: string;
		}): McpResponse => {
			const engine = requireEngine(conversationId);
			const children = engine.getChildren(nodeId ?? null);
			if (children.length === 0) return { content: [{ type: 'text', text: 'No children.' }] };
			const lines = children.map((n) => {
				const msg = n as { content?: string };
				return `[${n.id.slice(0, 8)}] ${n.role}: ${(msg.content ?? '').slice(0, 100).replace(/\n/g, ' ')}`;
			});
			return { content: [{ type: 'text', text: lines.join('\n') }] };
		}
	},
	{
		name: 'traek_get_siblings',
		description: 'Get all sibling nodes of a given node (same primary parent).',
		inputSchema: {
			conversationId: z.string().describe('Conversation ID'),
			nodeId: z.string().describe('Node ID')
		},
		handler: ({
			conversationId,
			nodeId
		}: {
			conversationId: string;
			nodeId: string;
		}): McpResponse => {
			const engine = requireEngine(conversationId);
			const siblings = engine.getSiblings(nodeId);
			if (siblings.length === 0) return { content: [{ type: 'text', text: 'No siblings.' }] };
			const lines = siblings.map((n) => {
				const msg = n as { content?: string };
				const marker = n.id === nodeId ? ' ← (this)' : '';
				return `[${n.id.slice(0, 8)}] ${n.role}: ${(msg.content ?? '').slice(0, 100).replace(/\n/g, ' ')}${marker}`;
			});
			return { content: [{ type: 'text', text: lines.join('\n') }] };
		}
	},
	{
		name: 'traek_get_leaves',
		description:
			'Get all leaf nodes (nodes with no children). Each leaf is the end of a distinct conversation branch.',
		inputSchema: { conversationId: z.string().describe('Conversation ID') },
		handler: ({ conversationId }: { conversationId: string }): McpResponse => {
			const engine = requireEngine(conversationId);
			const parentIdSet = new Set(engine.nodes.flatMap((n) => n.parentIds));
			const leaves = engine.nodes.filter((n) => !parentIdSet.has(n.id));
			if (leaves.length === 0)
				return { content: [{ type: 'text', text: 'No leaves (empty conversation).' }] };
			const lines = leaves.map((n) => {
				const msg = n as { content?: string };
				return `[${n.id.slice(0, 8)}] depth=${engine.getDepth(n.id)} ${n.role}: ${(msg.content ?? '').slice(0, 100).replace(/\n/g, ' ')}`;
			});
			return {
				content: [{ type: 'text', text: `${leaves.length} branch(es):\n\n${lines.join('\n')}` }]
			};
		}
	},

	// ─── Export ─────────────────────────────────────────────────────────────

	{
		name: 'traek_export_json',
		description:
			'Export the full conversation tree as a JSON snapshot. Can be loaded back with traek_load_conversation.',
		inputSchema: {
			conversationId: z.string().describe('Conversation ID'),
			title: z.string().optional().describe('Optional title to embed in the snapshot')
		},
		handler: ({
			conversationId,
			title
		}: {
			conversationId: string;
			title?: string;
		}): McpResponse => {
			const engine = requireEngine(conversationId);
			return { content: [{ type: 'text', text: exportJson(engine, title) }] };
		}
	},
	{
		name: 'traek_export_markdown',
		description:
			'Export conversation as Markdown. mode="active" exports the active branch, mode="all" exports all branches, mode="branch" + nodeId exports a specific branch.',
		inputSchema: {
			conversationId: z.string().describe('Conversation ID'),
			mode: z.enum(['active', 'all', 'branch']).describe('"active" | "all" | "branch"'),
			nodeId: z.string().optional().describe('Required when mode="branch"'),
			title: z.string().optional().describe('Optional document title')
		},
		handler: ({
			conversationId,
			mode,
			nodeId,
			title
		}: {
			conversationId: string;
			mode: 'active' | 'all' | 'branch';
			nodeId?: string;
			title?: string;
		}): McpResponse => {
			const engine = requireEngine(conversationId);
			let md: string;
			if (mode === 'all') md = exportAllBranchesMarkdown(engine, title);
			else if (mode === 'branch') {
				if (!nodeId) throw new Error('nodeId is required when mode="branch"');
				md = exportBranchMarkdown(engine, nodeId, title);
			} else {
				md = exportActiveBranchMarkdown(engine, title);
			}
			return { content: [{ type: 'text', text: md || '*(empty)*' }] };
		}
	}
];
