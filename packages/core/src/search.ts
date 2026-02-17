import type { Node, MessageNode } from './types.js'

/**
 * Search nodes by content (case-insensitive).
 * Returns an array of node IDs that match the query.
 */
export function searchNodes(nodes: Node[], query: string): string[] {
	if (!query || query.trim() === '') return []

	const lowerQuery = query.toLowerCase().trim()
	const matches: string[] = []

	for (const node of nodes) {
		const messageNode = node as MessageNode
		if (messageNode.content) {
			const lowerContent = messageNode.content.toLowerCase()
			if (lowerContent.includes(lowerQuery)) {
				matches.push(node.id)
			}
		}
	}

	return matches
}

/**
 * Highlight matches in text by wrapping them in <mark> tags.
 * Returns HTML string with highlighted spans.
 */
export function highlightMatch(text: string, query: string): string {
	if (!query || query.trim() === '') return escapeHtml(text)

	const escapedText = escapeHtml(text)
	const lowerText = text.toLowerCase()
	const lowerQuery = query.toLowerCase().trim()

	if (!lowerText.includes(lowerQuery)) return escapedText

	const matches: { start: number; end: number }[] = []
	let pos = 0

	while (pos < lowerText.length) {
		const idx = lowerText.indexOf(lowerQuery, pos)
		if (idx === -1) break
		matches.push({ start: idx, end: idx + lowerQuery.length })
		pos = idx + 1
	}

	if (matches.length === 0) return escapedText

	let result = ''
	let lastEnd = 0

	for (const match of matches) {
		result += escapeHtml(text.substring(lastEnd, match.start))
		result += '<mark class="search-highlight">'
		result += escapeHtml(text.substring(match.start, match.end))
		result += '</mark>'
		lastEnd = match.end
	}

	result += escapeHtml(text.substring(lastEnd))
	return result
}

function escapeHtml(text: string): string {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;')
}
