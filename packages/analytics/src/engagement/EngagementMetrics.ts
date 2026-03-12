import type { ConversationSnapshot } from '@traek/core';
import type { ContentStats, EngagementMetrics } from './types.js';
import { analyzeFlow } from '../flow/FlowAnalyzer.js';

function median(values: number[]): number {
	if (values.length === 0) return 0;
	const sorted = [...values].sort((a, b) => a - b);
	const mid = Math.floor(sorted.length / 2);
	return sorted.length % 2 === 0 ? (sorted[mid - 1]! + sorted[mid]!) / 2 : sorted[mid]!;
}

function contentStats(lengths: number[]): ContentStats {
	if (lengths.length === 0) {
		return { avgLength: 0, medianLength: 0, maxLength: 0, minLength: 0, totalChars: 0 };
	}
	const nonEmpty = lengths.filter((l) => l > 0);
	return {
		avgLength: lengths.reduce((a, b) => a + b, 0) / lengths.length,
		medianLength: median(lengths),
		maxLength: Math.max(...lengths),
		minLength: nonEmpty.length > 0 ? Math.min(...nonEmpty) : 0,
		totalChars: lengths.reduce((a, b) => a + b, 0)
	};
}

const CODE_PATTERN = /```|~~~|<code|<pre/;

/**
 * Compute user engagement metrics for a conversation snapshot.
 */
export function analyzeEngagement(snapshot: ConversationSnapshot): EngagementMetrics {
	const nodes = snapshot.nodes;
	const flow = analyzeFlow(snapshot);

	if (nodes.length === 0) {
		const emptyStats: ContentStats = {
			avgLength: 0,
			medianLength: 0,
			maxLength: 0,
			minLength: 0,
			totalChars: 0
		};
		return {
			score: 0,
			contentByRole: { user: emptyStats, assistant: emptyStats, system: emptyStats },
			responseElaborationRatio: 0,
			branchingRate: 0,
			explorationDiversity: 0,
			nodesPerMinute: null,
			uniqueTags: [],
			codeNodeCount: 0,
			deepAnswerRate: 0
		};
	}

	// Content length per role
	const userLengths = nodes.filter((n) => n.role === 'user').map((n) => (n.content ?? '').length);
	const assistantLengths = nodes
		.filter((n) => n.role === 'assistant')
		.map((n) => (n.content ?? '').length);
	const systemLengths = nodes
		.filter((n) => n.role === 'system')
		.map((n) => (n.content ?? '').length);

	const userStats = contentStats(userLengths);
	const assistantStats = contentStats(assistantLengths);
	const systemStats = contentStats(systemLengths);

	const responseElaborationRatio =
		userStats.avgLength > 0 ? assistantStats.avgLength / userStats.avgLength : 0;

	const branchingRate = flow.nodeCount > 0 ? flow.branchingNodeCount / flow.nodeCount : 0;

	const explorationDiversity = flow.maxDepth > 0 ? flow.branchCount / flow.maxDepth : 0;

	// Velocity: nodes per minute from createdAt timestamps
	let nodesPerMinute: number | null = null;
	const timestamps = nodes.map((n) => n.createdAt).filter((t): t is number => !!t);
	if (timestamps.length >= 2) {
		const minTs = Math.min(...timestamps);
		const maxTs = Math.max(...timestamps);
		const durationMin = (maxTs - minTs) / 60_000;
		if (durationMin > 0) nodesPerMinute = nodes.length / durationMin;
	}

	// Tags
	const tagSet = new Set<string>();
	for (const n of nodes) {
		for (const tag of n.metadata?.tags ?? []) tagSet.add(tag);
	}

	// Code detection
	const codeNodeCount = nodes.filter((n) => CODE_PATTERN.test(n.content ?? '')).length;

	// Deep answer rate
	const assistantNodes = nodes.filter((n) => n.role === 'assistant');
	const deepAnswerRate =
		assistantNodes.length > 0
			? assistantNodes.filter((n) => (n.content ?? '').length > 500).length / assistantNodes.length
			: 0;

	// Engagement score [0, 100]
	// Weighted combination of signals:
	// - Branch diversity (up to 25 pts)
	// - Response elaboration (up to 20 pts)
	// - Deep answer rate (up to 20 pts)
	// - Branching rate (up to 15 pts)
	// - Code usage (up to 10 pts)
	// - Node count (up to 10 pts)
	const diversityScore = Math.min(25, explorationDiversity * 5);
	const elaborationScore = Math.min(20, responseElaborationRatio * 4);
	const deepAnswerScore = deepAnswerRate * 20;
	const branchingScore = Math.min(15, branchingRate * 100);
	const codeScore = Math.min(10, (codeNodeCount / Math.max(nodes.length, 1)) * 100);
	const sizeScore = Math.min(10, (nodes.length / 20) * 10);

	const score = Math.round(
		diversityScore + elaborationScore + deepAnswerScore + branchingScore + codeScore + sizeScore
	);

	return {
		score: Math.min(100, score),
		contentByRole: {
			user: userStats,
			assistant: assistantStats,
			system: systemStats
		},
		responseElaborationRatio,
		branchingRate,
		explorationDiversity,
		nodesPerMinute,
		uniqueTags: [...tagSet].sort(),
		codeNodeCount,
		deepAnswerRate
	};
}
