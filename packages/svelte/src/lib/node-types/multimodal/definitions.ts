import type { NodeTypeDefinition } from '../types';
import ImageNode from './ImageNode.svelte';
import FileNode from './FileNode.svelte';
import CodeNode from './CodeNode.svelte';
import EmbedNode from './EmbedNode.svelte';
import {
	imageNodeDataSchema,
	fileNodeDataSchema,
	codeNodeDataSchema,
	embedNodeDataSchema
} from './types';

export const imageNodeDefinition: NodeTypeDefinition = {
	type: 'image',
	label: 'Image',
	component: ImageNode,
	icon: '🖼',
	defaultSize: { width: 350, minHeight: 120 },
	validateData: (data): data is unknown => imageNodeDataSchema.safeParse(data).success,
	serializeData: (data) => data,
	deserializeData: (raw) => {
		const result = imageNodeDataSchema.safeParse(raw);
		return result.success ? result.data : { images: [] };
	}
};

export const fileNodeDefinition: NodeTypeDefinition = {
	type: 'file',
	label: 'File',
	component: FileNode,
	icon: '📁',
	defaultSize: { width: 350, minHeight: 64 },
	validateData: (data): data is unknown => fileNodeDataSchema.safeParse(data).success,
	serializeData: (data) => data,
	deserializeData: (raw) => {
		const result = fileNodeDataSchema.safeParse(raw);
		return result.success
			? result.data
			: {
					file: {
						name: 'unknown',
						size: 0,
						mimeType: 'application/octet-stream',
						uploadStatus: 'error'
					}
				};
	}
};

export const codeNodeDefinition: NodeTypeDefinition = {
	type: 'code',
	label: 'Code',
	component: CodeNode,
	icon: '</>',
	defaultSize: { width: 400, minHeight: 120 },
	validateData: (data): data is unknown => codeNodeDataSchema.safeParse(data).success,
	serializeData: (data) => data,
	deserializeData: (raw) => {
		const result = codeNodeDataSchema.safeParse(raw);
		return result.success ? result.data : { code: '', language: 'plaintext' };
	}
};

export const embedNodeDefinition: NodeTypeDefinition = {
	type: 'embed',
	label: 'Embed',
	component: EmbedNode,
	icon: '🔗',
	defaultSize: { width: 400, minHeight: 100 },
	validateData: (data): data is unknown => embedNodeDataSchema.safeParse(data).success,
	serializeData: (data) => data,
	deserializeData: (raw) => {
		const result = embedNodeDataSchema.safeParse(raw);
		return result.success ? result.data : { url: '', embedType: 'generic' as const };
	}
};

export const multimodalNodeDefinitions = [
	imageNodeDefinition,
	fileNodeDefinition,
	codeNodeDefinition,
	embedNodeDefinition
];
