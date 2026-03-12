import type { Node } from './types.js';
import type { NodePosition, LayoutMode } from './layout.js';
import type { ConversationSnapshot } from './schemas.js';

/**
 * A Træk plugin extends engine behaviour through lifecycle hooks.
 *
 * Hooks are optional. Register a plugin with `engine.use(plugin)`.
 *
 * ## Example — analytics plugin
 *
 * ```ts
 * import { TraekEngine } from '@traek/core';
 *
 * const analyticsPlugin = {
 *   name: 'analytics',
 *   onInit(engine) {
 *     console.log('Træk ready, current nodes:', engine.nodes.length);
 *   },
 *   onNodeAdd(node) {
 *     fetch('/api/track', { method: 'POST', body: JSON.stringify({ event: 'node_add', nodeId: node.id }) });
 *   },
 * };
 *
 * const engine = new TraekEngine();
 * engine.use(analyticsPlugin);
 * ```
 *
 * ## Example — node transformer plugin
 *
 * ```ts
 * const autoTagPlugin = {
 *   name: 'auto-tag',
 *   onNodeAdd(node) {
 *     if (node.role === 'user') {
 *       return { ...node, metadata: { ...node.metadata, tags: ['user-input'] } };
 *     }
 *   },
 * };
 * ```
 *
 * ## Example — layout adjuster plugin
 *
 * ```ts
 * const layoutLoggerPlugin = {
 *   name: 'layout-logger',
 *   onLayout(positions, mode) {
 *     console.log(`Layout [${mode}]: placed ${positions.length} nodes`);
 *     // Return undefined to keep original positions, or return modified array
 *   },
 * };
 * ```
 *
 * ## Example — serialization enrichment plugin
 *
 * ```ts
 * const versionPlugin = {
 *   name: 'version-stamp',
 *   onSerialize(snapshot) {
 *     return { ...snapshot, appVersion: '1.2.3' };
 *   },
 * };
 * ```
 */
export interface TraekPlugin {
	/** Unique name for debugging and deduplication. */
	readonly name: string;

	/**
	 * Called once when the plugin is registered via `engine.use()`.
	 * Use for setup, subscriptions, or logging initial state.
	 */
	onInit?(engine: import('./TraekEngine.js').TraekEngine): void;

	/**
	 * Called after a node is added to the engine.
	 * Return a modified `Node` to replace the stored node, or return `void` to keep it as-is.
	 *
	 * Note: returning a node only modifies the engine's in-memory representation.
	 * The change is reflected immediately in `engine.nodes`.
	 */
	onNodeAdd?(node: Node, engine: import('./TraekEngine.js').TraekEngine): Node | void;

	/**
	 * Called after layout positions are computed, before they are applied.
	 * Return a modified `NodePosition[]` to override positions, or `void` to keep originals.
	 */
	onLayout?(
		positions: NodePosition[],
		mode: LayoutMode,
		engine: import('./TraekEngine.js').TraekEngine
	): NodePosition[] | void;

	/**
	 * Called after `engine.serialize()` produces a snapshot.
	 * Return a modified `ConversationSnapshot` to enrich the output, or `void` to keep it.
	 */
	onSerialize?(
		snapshot: ConversationSnapshot,
		engine: import('./TraekEngine.js').TraekEngine
	): ConversationSnapshot | void;

	/**
	 * Called when a node is about to be deleted (read-only notification).
	 * Cannot prevent deletion. Use for cleanup or logging.
	 */
	onNodeDelete?(node: Node, engine: import('./TraekEngine.js').TraekEngine): void;
}

/**
 * Internal plugin runner. Manages a list of plugins and runs hooks in registration order.
 * @internal
 */
export class PluginRunner {
	private readonly _plugins: TraekPlugin[] = [];

	get plugins(): readonly TraekPlugin[] {
		return this._plugins;
	}

	register(plugin: TraekPlugin): void {
		if (this._plugins.some((p) => p.name === plugin.name)) {
			console.warn(`[traek] Plugin "${plugin.name}" is already registered — skipping.`);
			return;
		}
		this._plugins.push(plugin);
	}

	/**
	 * Run onNodeAdd hooks in order, threading the (possibly transformed) node through each.
	 */
	runNodeAdd(node: Node, engine: import('./TraekEngine.js').TraekEngine): Node {
		let current = node;
		for (const p of this._plugins) {
			const result = p.onNodeAdd?.(current, engine);
			if (result != null) {
				current = result;
			}
		}
		return current;
	}

	/**
	 * Run onLayout hooks in order, threading positions through each.
	 */
	runLayout(
		positions: NodePosition[],
		mode: LayoutMode,
		engine: import('./TraekEngine.js').TraekEngine
	): NodePosition[] {
		let current = positions;
		for (const p of this._plugins) {
			const result = p.onLayout?.(current, mode, engine);
			if (result != null) {
				current = result;
			}
		}
		return current;
	}

	/**
	 * Run onSerialize hooks in order, threading the snapshot through each.
	 */
	runSerialize(
		snapshot: ConversationSnapshot,
		engine: import('./TraekEngine.js').TraekEngine
	): ConversationSnapshot {
		let current = snapshot;
		for (const p of this._plugins) {
			const result = p.onSerialize?.(current, engine);
			if (result != null) {
				current = result;
			}
		}
		return current;
	}

	/**
	 * Run onNodeDelete hooks (notification-only, result ignored).
	 */
	runNodeDelete(node: Node, engine: import('./TraekEngine.js').TraekEngine): void {
		for (const p of this._plugins) {
			p.onNodeDelete?.(node, engine);
		}
	}

	/**
	 * Run onInit hooks for a single plugin.
	 */
	runInit(plugin: TraekPlugin, engine: import('./TraekEngine.js').TraekEngine): void {
		plugin.onInit?.(engine);
	}

	get size(): number {
		return this._plugins.length;
	}
}
