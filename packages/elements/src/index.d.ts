// Re-export core types from the traek SDK
export {
	TraekEngine,
	DEFAULT_TRACK_ENGINE_CONFIG,
	wouldCreateCycle,
	type TraekEngineConfig,
	type MessageNode,
	type Node,
	type NodeStatus,
	type AddNodePayload,
	type NodeComponentMap
} from 'traek';

// Persistence & serialization
export { snapshotToJSON, snapshotToMarkdown, downloadFile } from 'traek';
export type {
	ConversationSnapshot,
	SerializedNode,
	StoredConversation,
	ConversationListItem,
	SaveState
} from 'traek';

// Theme utilities
export {
	darkTheme,
	lightTheme,
	highContrastTheme,
	themes,
	DEFAULT_THEME,
	createCustomTheme,
	applyThemeToRoot
} from 'traek';
export type {
	ThemeName,
	TraekTheme,
	TraekThemeColors,
	TraekThemeSpacing,
	TraekThemeRadius,
	TraekThemeTypography,
	TraekThemeAnimation
} from 'traek';

// i18n
export { DEFAULT_TRANSLATIONS, mergeTranslations } from 'traek';
export type { TraekTranslations, PartialTraekTranslations } from 'traek';

// Actions & node types
export type { ActionDefinition } from 'traek';
export type { NodeTypeAction } from 'traek';

// Zod schemas
export { traekEngineConfigSchema, addNodePayloadSchema } from 'traek';
export {
	serializedNodeSchema,
	conversationSnapshotSchema,
	saveStateSchema,
	storedConversationSchema,
	conversationListItemSchema
} from 'traek';

// Utilities
export { markdownToHtml } from 'traek';

// ─── Mount API ──────────────────────────────────────────────────────────────

import type {
	TraekEngine,
	TraekEngineConfig,
	MessageNode,
	Node,
	NodeTypeAction,
	PartialTraekTranslations,
	ActionDefinition
} from 'traek';

/** Focus mode configuration (subset for framework-agnostic API). */
interface FocusModeConfigPartial {
	swipeThreshold?: number;
	swipeVelocity?: number;
	enableHaptics?: boolean;
	showOnboarding?: boolean;
	animationDuration?: number;
}

/**
 * Options for mounting a TraekCanvas instance.
 *
 * This is the framework-agnostic subset of TraekCanvas props.
 * Svelte-specific features (Snippets, Component references) are omitted.
 */
export interface TraekCanvasOptions {
	/** Pre-created engine instance. If omitted, one is created automatically. */
	engine?: TraekEngine | null;
	/** Partial engine configuration overrides. */
	config?: Partial<TraekEngineConfig>;
	/** Pixel padding for the first node placement. */
	initialPlacementPadding?: { left: number; top: number };
	/** Initial zoom level. */
	initialScale?: number;
	/** Initial pan offset. */
	initialOffset?: { x: number; y: number };
	/** Called when the user submits a message. */
	onSendMessage?: (input: string, userNode: MessageNode, action?: string | string[]) => void;
	/** Called whenever nodes change. */
	onNodesChanged?: () => void;
	/** Called when viewport (zoom/pan) changes. */
	onViewportChange?: (viewport: { scale: number; offset: { x: number; y: number } }) => void;
	/** Show FPS counter for debugging. */
	showFps?: boolean;
	/** Show stats overlay. */
	showStats?: boolean;
	/** Slash-command action definitions. */
	actions?: ActionDefinition[];
	/** Async resolver for semantic action matching. */
	resolveActions?: (input: string, actions: ActionDefinition[]) => Promise<string[]>;
	/** Called when user requests a retry on a node. */
	onRetry?: (nodeId: string) => void;
	/** Override the default node actions. */
	defaultNodeActions?: NodeTypeAction[];
	/** Filter which node actions to show for a given node. */
	filterNodeActions?: (node: Node, actions: NodeTypeAction[]) => NodeTypeAction[];
	/** Called when user wants to edit a node. */
	onEditNode?: (nodeId: string) => void;
	/** UI mode: 'auto' detects mobile, 'canvas' forces canvas, 'focus' forces focus mode. */
	mode?: 'auto' | 'canvas' | 'focus';
	/** Mobile breakpoint in pixels. Default: 768. */
	mobileBreakpoint?: number;
	/** Focus mode configuration overrides. */
	focusConfig?: FocusModeConfigPartial;
	/** Milliseconds to delay before showing the desktop tour. Default: 0. Set -1 to disable. */
	tourDelay?: number;
	/** Minimum non-thought nodes required before the minimap appears. Default: 0. */
	minimapMinNodes?: number;
	/** Minimum nodes required before the context breadcrumb appears. Default: 0. */
	breadcrumbMinNodes?: number;
	/** Partial translation overrides. Deep-merged with English defaults. */
	translations?: PartialTraekTranslations;
}

/** Handle returned by createTraekCanvas for controlling the mounted instance. */
export interface TraekCanvasInstance {
	/** Update options on the live instance. Partial updates are merged. */
	update(options: Partial<TraekCanvasOptions>): void;
	/** Destroy the mounted canvas and clean up all resources. */
	destroy(): void;
}

/**
 * Mount a TraekCanvas into a DOM container.
 *
 * Framework-agnostic entry point for using traek outside of Svelte.
 * Works in vanilla JS, React, Vue, Angular, or any environment with a DOM.
 */
export declare function createTraekCanvas(
	target: HTMLElement,
	options?: TraekCanvasOptions
): TraekCanvasInstance;
