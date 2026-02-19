import { mount, unmount } from 'svelte';
import { TraekCanvas } from 'traek';
import type {
	TraekEngine,
	TraekEngineConfig,
	MessageNode,
	Node,
	NodeTypeAction,
	PartialTraekTranslations,
	ActionDefinition
} from 'traek';
import type { FocusModeConfig } from 'traek';

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
	focusConfig?: Partial<FocusModeConfig>;
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

function optionsToProps(options: TraekCanvasOptions): Record<string, unknown> {
	const props: Record<string, unknown> = {};
	if (options.engine !== undefined) props.engine = options.engine;
	if (options.config !== undefined) props.config = options.config;
	if (options.initialPlacementPadding !== undefined)
		props.initialPlacementPadding = options.initialPlacementPadding;
	if (options.initialScale !== undefined) props.initialScale = options.initialScale;
	if (options.initialOffset !== undefined) props.initialOffset = options.initialOffset;
	if (options.onSendMessage !== undefined) props.onSendMessage = options.onSendMessage;
	if (options.onNodesChanged !== undefined) props.onNodesChanged = options.onNodesChanged;
	if (options.onViewportChange !== undefined) props.onViewportChange = options.onViewportChange;
	if (options.showFps !== undefined) props.showFps = options.showFps;
	if (options.showStats !== undefined) props.showStats = options.showStats;
	if (options.actions !== undefined) props.actions = options.actions;
	if (options.resolveActions !== undefined) props.resolveActions = options.resolveActions;
	if (options.onRetry !== undefined) props.onRetry = options.onRetry;
	if (options.defaultNodeActions !== undefined)
		props.defaultNodeActions = options.defaultNodeActions;
	if (options.filterNodeActions !== undefined) props.filterNodeActions = options.filterNodeActions;
	if (options.onEditNode !== undefined) props.onEditNode = options.onEditNode;
	if (options.mode !== undefined) props.mode = options.mode;
	if (options.mobileBreakpoint !== undefined) props.mobileBreakpoint = options.mobileBreakpoint;
	if (options.focusConfig !== undefined) props.focusConfig = options.focusConfig;
	if (options.tourDelay !== undefined) props.tourDelay = options.tourDelay;
	if (options.minimapMinNodes !== undefined) props.minimapMinNodes = options.minimapMinNodes;
	if (options.breadcrumbMinNodes !== undefined)
		props.breadcrumbMinNodes = options.breadcrumbMinNodes;
	if (options.translations !== undefined) props.translations = options.translations;
	return props;
}

/**
 * Mount a TraekCanvas into a DOM container.
 *
 * This is the framework-agnostic entry point for using traek outside of Svelte.
 * Works in vanilla JS, React, Vue, Angular, or any environment with a DOM.
 *
 * @example
 * ```js
 * import { createTraekCanvas, TraekEngine } from '@traek/elements';
 *
 * const engine = new TraekEngine();
 * const canvas = createTraekCanvas(document.getElementById('app'), {
 *   engine,
 *   onSendMessage: (input, userNode) => {
 *     const reply = engine.addNode('Thinking...', 'assistant');
 *     engine.updateNode(reply.id, { status: 'streaming' });
 *   }
 * });
 *
 * // Later: clean up
 * canvas.destroy();
 * ```
 */
export function createTraekCanvas(
	target: HTMLElement,
	options: TraekCanvasOptions = {}
): TraekCanvasInstance {
	const props = $state(optionsToProps(options));

	const component = mount(TraekCanvas, {
		target,
		props
	});

	return {
		update(newOptions: Partial<TraekCanvasOptions>) {
			const newProps = optionsToProps({ ...options, ...newOptions });
			Object.assign(options, newOptions);
			Object.assign(props, newProps);
		},
		destroy() {
			unmount(component);
		}
	};
}
