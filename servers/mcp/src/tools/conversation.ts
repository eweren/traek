import { z } from 'zod'

/**
 * In-memory conversation state for the MCP session.
 * In production this could be backed by IndexedDB or a database.
 */
interface ConversationNode {
	id: string
	parentId: string | null
	role: 'user' | 'assistant' | 'system'
	content: string
	timestamp: number
	x: number
	y: number
}

const nodes = new Map<string, ConversationNode>()
let nodeCounter = 0

function generateId(): string {
	return `node-${++nodeCounter}-${Date.now()}`
}

export const conversationTools = [
	{
		name: 'add_node',
		description: 'Add a new message node to the conversation tree',
		inputSchema: {
			role: z.enum(['user', 'assistant', 'system']).describe('The role of the message sender'),
			content: z.string().min(1).describe('The message content'),
			parentId: z
				.string()
				.optional()
				.describe('Parent node ID. If omitted, creates a root node'),
		},
		handler: async ({
			role,
			content,
			parentId,
		}: {
			role: 'user' | 'assistant' | 'system'
			content: string
			parentId?: string
		}) => {
			const id = generateId()
			const parentNode = parentId ? nodes.get(parentId) : null
			const node: ConversationNode = {
				id,
				parentId: parentId ?? null,
				role,
				content,
				timestamp: Date.now(),
				x: parentNode ? parentNode.x + 300 : 0,
				y: parentNode ? parentNode.y : 0,
			}
			nodes.set(id, node)
			return {
				content: [
					{
						type: 'text' as const,
						text: JSON.stringify({ success: true, node }),
					},
				],
			}
		},
	},
	{
		name: 'get_tree',
		description: 'Get the full conversation tree as a structured JSON object',
		inputSchema: {},
		handler: async () => {
			const allNodes = Array.from(nodes.values())
			return {
				content: [
					{
						type: 'text' as const,
						text: JSON.stringify({ nodes: allNodes, count: allNodes.length }),
					},
				],
			}
		},
	},
	{
		name: 'branch_from',
		description: 'Create a new branch from an existing node with a new message',
		inputSchema: {
			nodeId: z.string().describe('The node ID to branch from'),
			role: z.enum(['user', 'assistant', 'system']).describe('Role of the new branch node'),
			content: z.string().min(1).describe('Content of the new branch node'),
		},
		handler: async ({
			nodeId,
			role,
			content,
		}: {
			nodeId: string
			role: 'user' | 'assistant' | 'system'
			content: string
		}) => {
			const parentNode = nodes.get(nodeId)
			if (!parentNode) {
				return {
					content: [
						{
							type: 'text' as const,
							text: JSON.stringify({ success: false, error: `Node ${nodeId} not found` }),
						},
					],
					isError: true,
				}
			}
			const id = generateId()
			// Offset the branch position slightly
			const siblings = Array.from(nodes.values()).filter((n) => n.parentId === nodeId)
			const node: ConversationNode = {
				id,
				parentId: nodeId,
				role,
				content,
				timestamp: Date.now(),
				x: parentNode.x + 300,
				y: parentNode.y + siblings.length * 200,
			}
			nodes.set(id, node)
			return {
				content: [
					{
						type: 'text' as const,
						text: JSON.stringify({ success: true, node }),
					},
				],
			}
		},
	},
	{
		name: 'clear_conversation',
		description: 'Clear all nodes from the current conversation',
		inputSchema: {},
		handler: async () => {
			const count = nodes.size
			nodes.clear()
			nodeCounter = 0
			return {
				content: [
					{
						type: 'text' as const,
						text: JSON.stringify({ success: true, clearedNodes: count }),
					},
				],
			}
		},
	},
	{
		name: 'get_node',
		description: 'Get a specific node by ID',
		inputSchema: {
			nodeId: z.string().describe('The node ID to retrieve'),
		},
		handler: async ({ nodeId }: { nodeId: string }) => {
			const node = nodes.get(nodeId)
			if (!node) {
				return {
					content: [
						{
							type: 'text' as const,
							text: JSON.stringify({ success: false, error: `Node ${nodeId} not found` }),
						},
					],
					isError: true,
				}
			}
			return {
				content: [
					{
						type: 'text' as const,
						text: JSON.stringify({ success: true, node }),
					},
				],
			}
		},
	},
]
