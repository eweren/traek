import { z } from 'zod';

// ─── Image Node ──────────────────────────────────────────────────────────────

export const imageEntrySchema = z.object({
	src: z.string(),
	alt: z.string(),
	width: z.number().optional(),
	height: z.number().optional(),
	mimeType: z.string().optional()
});
export type ImageEntry = z.infer<typeof imageEntrySchema>;

export const imageNodeDataSchema = z.object({
	images: z.array(imageEntrySchema).min(1),
	caption: z.string().optional()
});
export type ImageNodeData = z.infer<typeof imageNodeDataSchema>;

// ─── File Node ────────────────────────────────────────────────────────────────

export const fileEntrySchema = z.object({
	name: z.string(),
	size: z.number().nonnegative(),
	mimeType: z.string(),
	url: z.string().optional(),
	uploadStatus: z.enum(['uploading', 'done', 'error']),
	uploadProgress: z.number().min(0).max(100).optional(),
	errorMessage: z.string().optional()
});
export type FileEntry = z.infer<typeof fileEntrySchema>;

export const fileNodeDataSchema = z.object({
	file: fileEntrySchema
});
export type FileNodeData = z.infer<typeof fileNodeDataSchema>;

// ─── Code Node ───────────────────────────────────────────────────────────────

export const codeNodeDataSchema = z.object({
	code: z.string(),
	language: z.string(),
	filename: z.string().optional()
});
export type CodeNodeData = z.infer<typeof codeNodeDataSchema>;

export const COMMON_LANGUAGES = [
	'typescript',
	'javascript',
	'python',
	'bash',
	'sql',
	'json',
	'css',
	'html',
	'rust',
	'go',
	'java',
	'csharp'
] as const;

// ─── Embed Node ───────────────────────────────────────────────────────────────

export const embedTypeSchema = z.enum(['youtube', 'github', 'twitter', 'figma', 'generic']);
export type EmbedType = z.infer<typeof embedTypeSchema>;

export const embedPreviewSchema = z.object({
	title: z.string(),
	description: z.string().optional(),
	image: z.string().optional(),
	favicon: z.string().optional(),
	siteName: z.string().optional()
});
export type EmbedPreview = z.infer<typeof embedPreviewSchema>;

export const embedNodeDataSchema = z.object({
	url: z.string().url(),
	embedType: embedTypeSchema,
	preview: embedPreviewSchema.optional()
});
export type EmbedNodeData = z.infer<typeof embedNodeDataSchema>;

// ─── File type detection ──────────────────────────────────────────────────────

export function getFileIcon(mimeType: string): string {
	if (mimeType === 'application/pdf') return 'file-pdf';
	if (mimeType.startsWith('image/')) return 'file-image';
	if (mimeType.startsWith('video/')) return 'file-video';
	if (mimeType.startsWith('audio/')) return 'file-audio';
	if (
		mimeType === 'application/zip' ||
		mimeType === 'application/x-tar' ||
		mimeType === 'application/x-gzip'
	)
		return 'file-archive';
	if (mimeType === 'text/csv' || mimeType.includes('spreadsheet') || mimeType.includes('excel'))
		return 'file-table';
	if (
		mimeType.startsWith('text/') ||
		mimeType === 'application/json' ||
		mimeType === 'application/javascript'
	)
		return 'file-code';
	return 'file';
}

export function formatFileSize(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

export function detectEmbedType(url: string): EmbedType {
	try {
		const hostname = new URL(url).hostname.replace('www.', '');
		if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) return 'youtube';
		if (hostname.includes('github.com')) return 'github';
		if (hostname.includes('twitter.com') || hostname.includes('x.com')) return 'twitter';
		if (hostname.includes('figma.com')) return 'figma';
	} catch {
		// invalid URL
	}
	return 'generic';
}
