import type { ConversationSnapshot } from '../persistence/types';
import type { LayoutMode } from '../TraekEngine.svelte';

export type TemplateCategory = 'brainstorming' | 'code' | 'research' | 'creative' | string;

export interface ConversationTemplate {
	/** Unique identifier — must be URL-safe slug */
	id: string;
	/** Display name shown in the gallery */
	title: string;
	/** Short description (max 120 chars) */
	description: string;
	/** Category for gallery filtering */
	category: TemplateCategory;
	/** SVG string for the thumbnail schematic */
	svgThumbnail: string;
	/** Number of seed nodes (informational) */
	nodeCount: number;
	/** The conversation snapshot to instantiate */
	snapshot: ConversationSnapshot;
	/** Preferred layout mode when instantiated */
	defaultLayout?: LayoutMode;
}
