// ── Flow Analysis ─────────────────────────────────────────────────────────────
export { analyzeFlow } from './flow/FlowAnalyzer.js';
export type { FlowMetrics, BranchMetrics, NodeFlowMetrics } from './flow/types.js';

// ── Heatmap ───────────────────────────────────────────────────────────────────
export { buildHeatmap } from './heatmap/HeatmapBuilder.js';
export type { HeatmapData, NodeHeatCell, BranchHeatCell, HeatIntensity } from './heatmap/types.js';

// ── Engagement Metrics ────────────────────────────────────────────────────────
export { analyzeEngagement } from './engagement/EngagementMetrics.js';
export type { EngagementMetrics, ContentStats } from './engagement/types.js';

// ── Reports ───────────────────────────────────────────────────────────────────
export {
	generateReport,
	reportToJson,
	reportToMarkdown,
	reportToCsv
} from './report/ReportGenerator.js';
export type { AnalyticsReport } from './report/ReportGenerator.js';
