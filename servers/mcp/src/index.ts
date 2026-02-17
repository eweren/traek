#!/usr/bin/env node
/**
 * Træk MCP Server
 *
 * Exposes Træk conversation tree operations via the Model Context Protocol.
 * This allows AI assistants to manage spatial conversation trees programmatically.
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import { conversationTools } from './tools/conversation.js'
import { resourceHandlers } from './resources/conversation.js'

const server = new McpServer({
	name: 'traek-mcp',
	version: '0.0.1',
})

// Register conversation tree tools
for (const tool of conversationTools) {
	server.tool(tool.name, tool.description, tool.inputSchema, tool.handler)
}

// Register resources
for (const resource of resourceHandlers) {
	server.resource(resource.name, resource.uri, resource.handler)
}

async function main() {
	const transport = new StdioServerTransport()
	await server.connect(transport)
	console.error('Træk MCP server running on stdio')
}

main().catch((err) => {
	console.error('Fatal error:', err)
	process.exit(1)
})
