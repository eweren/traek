import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js'

/**
 * MCP Resources expose read-only views of conversation data.
 */
export const resourceHandlers = [
	{
		name: 'conversation-tree',
		uri: new ResourceTemplate('traek://conversation/{id}', { list: undefined }),
		handler: async (uri: URL, params: { id: string }) => {
			return {
				contents: [
					{
						uri: uri.toString(),
						text: JSON.stringify({
							id: params.id,
							description: 'Træk conversation tree',
							nodes: [],
						}),
					},
				],
			}
		},
	},
]
