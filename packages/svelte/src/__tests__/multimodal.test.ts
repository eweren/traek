import { describe, it, expect } from 'vitest';
import {
	imageNodeDataSchema,
	fileNodeDataSchema,
	codeNodeDataSchema,
	embedNodeDataSchema,
	getFileIcon,
	formatFileSize,
	detectEmbedType,
	type ImageNodeData,
	type FileNodeData,
	type CodeNodeData,
	type EmbedNodeData
} from '../lib/node-types/multimodal/types';

// ─── imageNodeDataSchema ──────────────────────────────────────────────────────

describe('imageNodeDataSchema', () => {
	it('validates a single image', () => {
		const data: ImageNodeData = {
			images: [{ src: 'https://example.com/img.png', alt: 'Test image' }]
		};
		expect(imageNodeDataSchema.safeParse(data).success).toBe(true);
	});

	it('validates multiple images with caption', () => {
		const data: ImageNodeData = {
			images: [
				{ src: 'a.png', alt: 'A', width: 100, height: 80, mimeType: 'image/png' },
				{ src: 'b.png', alt: 'B' }
			],
			caption: 'My gallery'
		};
		expect(imageNodeDataSchema.safeParse(data).success).toBe(true);
	});

	it('rejects empty images array', () => {
		expect(imageNodeDataSchema.safeParse({ images: [] }).success).toBe(false);
	});

	it('rejects missing alt text', () => {
		expect(imageNodeDataSchema.safeParse({ images: [{ src: 'a.png' }] }).success).toBe(false);
	});
});

// ─── fileNodeDataSchema ───────────────────────────────────────────────────────

describe('fileNodeDataSchema', () => {
	const validFile: FileNodeData = {
		file: {
			name: 'document.pdf',
			size: 1024 * 500,
			mimeType: 'application/pdf',
			uploadStatus: 'done',
			url: 'https://example.com/doc.pdf'
		}
	};

	it('validates a complete file', () => {
		expect(fileNodeDataSchema.safeParse(validFile).success).toBe(true);
	});

	it('validates an uploading file with progress', () => {
		const uploading: FileNodeData = {
			file: {
				name: 'video.mp4',
				size: 1024 * 1024 * 10,
				mimeType: 'video/mp4',
				uploadStatus: 'uploading',
				uploadProgress: 45
			}
		};
		expect(fileNodeDataSchema.safeParse(uploading).success).toBe(true);
	});

	it('validates an error file with message', () => {
		const errFile: FileNodeData = {
			file: {
				name: 'bad.zip',
				size: 0,
				mimeType: 'application/zip',
				uploadStatus: 'error',
				errorMessage: 'Network error'
			}
		};
		expect(fileNodeDataSchema.safeParse(errFile).success).toBe(true);
	});

	it('rejects negative file size', () => {
		const bad = { file: { ...validFile.file, size: -1 } };
		expect(fileNodeDataSchema.safeParse(bad).success).toBe(false);
	});

	it('rejects invalid uploadStatus', () => {
		const bad = { file: { ...validFile.file, uploadStatus: 'pending' } };
		expect(fileNodeDataSchema.safeParse(bad).success).toBe(false);
	});

	it('rejects uploadProgress > 100', () => {
		const bad = { file: { ...validFile.file, uploadStatus: 'uploading', uploadProgress: 101 } };
		expect(fileNodeDataSchema.safeParse(bad).success).toBe(false);
	});
});

// ─── codeNodeDataSchema ───────────────────────────────────────────────────────

describe('codeNodeDataSchema', () => {
	const validCode: CodeNodeData = {
		code: 'const x = 1;',
		language: 'typescript'
	};

	it('validates basic code node', () => {
		expect(codeNodeDataSchema.safeParse(validCode).success).toBe(true);
	});

	it('validates code with filename', () => {
		const withFile: CodeNodeData = { ...validCode, filename: 'index.ts' };
		expect(codeNodeDataSchema.safeParse(withFile).success).toBe(true);
	});

	it('validates empty code string', () => {
		expect(codeNodeDataSchema.safeParse({ code: '', language: 'plaintext' }).success).toBe(true);
	});

	it('rejects missing language', () => {
		expect(codeNodeDataSchema.safeParse({ code: 'x' }).success).toBe(false);
	});

	it('rejects missing code', () => {
		expect(codeNodeDataSchema.safeParse({ language: 'python' }).success).toBe(false);
	});
});

// ─── embedNodeDataSchema ──────────────────────────────────────────────────────

describe('embedNodeDataSchema', () => {
	const validEmbed: EmbedNodeData = {
		url: 'https://github.com/anthropics/claude',
		embedType: 'github'
	};

	it('validates basic embed', () => {
		expect(embedNodeDataSchema.safeParse(validEmbed).success).toBe(true);
	});

	it('validates embed with full preview', () => {
		const withPreview: EmbedNodeData = {
			...validEmbed,
			preview: {
				title: 'claude',
				description: 'AI model',
				image: 'https://example.com/img.png',
				favicon: 'https://github.com/favicon.ico',
				siteName: 'GitHub'
			}
		};
		expect(embedNodeDataSchema.safeParse(withPreview).success).toBe(true);
	});

	it('accepts all embed types', () => {
		for (const type of ['youtube', 'github', 'twitter', 'figma', 'generic'] as const) {
			expect(
				embedNodeDataSchema.safeParse({ url: 'https://example.com', embedType: type }).success
			).toBe(true);
		}
	});

	it('rejects invalid URL', () => {
		expect(embedNodeDataSchema.safeParse({ url: 'not-a-url', embedType: 'generic' }).success).toBe(
			false
		);
	});

	it('rejects unknown embed type', () => {
		expect(
			embedNodeDataSchema.safeParse({ url: 'https://example.com', embedType: 'slack' }).success
		).toBe(false);
	});
});

// ─── getFileIcon ──────────────────────────────────────────────────────────────

describe('getFileIcon', () => {
	it.each([
		['application/pdf', 'file-pdf'],
		['image/png', 'file-image'],
		['image/jpeg', 'file-image'],
		['video/mp4', 'file-video'],
		['audio/mpeg', 'file-audio'],
		['application/zip', 'file-archive'],
		['application/x-tar', 'file-archive'],
		['text/csv', 'file-table'],
		['text/plain', 'file-code'],
		['application/json', 'file-code'],
		['application/octet-stream', 'file']
	])('returns %s for mimeType %s', (mime, expected) => {
		expect(getFileIcon(mime)).toBe(expected);
	});
});

// ─── formatFileSize ───────────────────────────────────────────────────────────

describe('formatFileSize', () => {
	it('formats bytes', () => {
		expect(formatFileSize(512)).toBe('512 B');
	});

	it('formats kilobytes', () => {
		expect(formatFileSize(1536)).toBe('1.5 KB');
	});

	it('formats megabytes', () => {
		expect(formatFileSize(1024 * 1024 * 2.5)).toBe('2.5 MB');
	});

	it('formats gigabytes', () => {
		expect(formatFileSize(1024 * 1024 * 1024 * 1.2)).toBe('1.2 GB');
	});
});

// ─── detectEmbedType ──────────────────────────────────────────────────────────

describe('detectEmbedType', () => {
	it.each([
		['https://www.youtube.com/watch?v=abc', 'youtube'],
		['https://youtu.be/abc123', 'youtube'],
		['https://github.com/user/repo', 'github'],
		['https://twitter.com/user/status/123', 'twitter'],
		['https://x.com/user/status/123', 'twitter'],
		['https://www.figma.com/file/abc', 'figma'],
		['https://example.com', 'generic'],
		['not-a-url', 'generic']
	])('detects %s as %s', (url, expected) => {
		expect(detectEmbedType(url)).toBe(expected);
	});
});
