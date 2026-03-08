// ── PDF Export ────────────────────────────────────────────────────────────────
export { generatePdfHtml, openPrintDialog, downloadPdfHtml } from './pdf/PdfExporter.js';
export type { PdfExportOptions, TreeLayout, TreeLayoutNode } from './pdf/types.js';
export { computeTreeLayout } from './pdf/treeLayout.js';

// ── Presentation Mode ─────────────────────────────────────────────────────────
export { PresentationController } from './presentation/PresentationController.js';
export type { Slide, PresentationOptions, PresentationListener } from './presentation/types.js';

// ── Embed Generation ──────────────────────────────────────────────────────────
export {
	generateIframeEmbed,
	generateSelfContainedEmbed,
	generateSrcdocEmbed,
	generateSrcdocIframe
} from './embed/EmbedGenerator.js';
export type { IframeEmbedOptions, SelfContainedEmbedOptions } from './embed/EmbedGenerator.js';
