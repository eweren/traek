export { NodeTypeRegistry } from './NodeTypeRegistry.svelte.js';
export { textNodeDefinition, thoughtNodeDefinition } from './builtins.js';
export type { NodeTypeDefinition, NodeTypeAction } from './types.js';

import { NodeTypeRegistry } from './NodeTypeRegistry.svelte.js';
import { textNodeDefinition, thoughtNodeDefinition } from './builtins.js';

/** Create a registry pre-loaded with built-in text and thought definitions. */
export function createDefaultRegistry(): NodeTypeRegistry {
	const registry = new NodeTypeRegistry();
	registry.register(textNodeDefinition);
	registry.register(thoughtNodeDefinition);
	return registry;
}
