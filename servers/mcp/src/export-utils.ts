import type { TraekEngine, MessageNode, Node } from '@traek/core';

export function exportJson(engine: TraekEngine, title?: string): string {
	return JSON.stringify(engine.serialize(title), null, 2);
}

export function exportActiveBranchMarkdown(engine: TraekEngine, title?: string): string {
	return renderMarkdown(engine.contextPath as MessageNode[], title);
}

export function exportBranchMarkdown(engine: TraekEngine, nodeId: string, title?: string): string {
	const path: MessageNode[] = [];
	let current: Node | undefined = engine.getNode(nodeId);
	while (current) {
		path.unshift(current as MessageNode);
		const pid: string | undefined = current.parentIds[0];
		current = pid ? engine.getNode(pid) : undefined;
	}
	return renderMarkdown(path, title);
}

export function exportAllBranchesMarkdown(engine: TraekEngine, title?: string): string {
	const parentIdSet = new Set(engine.nodes.flatMap((n) => n.parentIds));
	const leaves = engine.nodes.filter((n) => !parentIdSet.has(n.id));

	if (leaves.length === 0) return title ? `# ${title}\n\n*(empty conversation)*\n` : '';

	const sections: string[] = [];
	if (title) sections.push(`# ${title}\n`);

	leaves.forEach((leaf, idx) => {
		const path: MessageNode[] = [];
		let current: Node | undefined = leaf;
		while (current) {
			path.unshift(current as MessageNode);
			const pid: string | undefined = current.parentIds[0];
			current = pid ? engine.getNode(pid) : undefined;
		}
		const branchTitle = leaves.length > 1 ? `Branch ${idx + 1}` : undefined;
		sections.push(renderMarkdown(path, branchTitle, title ? 2 : 1));
	});

	return sections.join('\n---\n\n');
}

function renderMarkdown(path: MessageNode[], title?: string, headingLevel = 1): string {
	const h = '#'.repeat(headingLevel);
	const lines: string[] = [];
	if (title) lines.push(`${h} ${title}\n`);
	for (const node of path) {
		const content = node.content ?? '';
		if (!content.trim()) continue;
		if (node.role === 'user') lines.push(`**User:**\n\n${content}\n`);
		else if (node.role === 'assistant') lines.push(`**Assistant:**\n\n${content}\n`);
		else if (node.role === 'system') lines.push(`> *System: ${content}*\n`);
	}
	return lines.join('\n');
}
