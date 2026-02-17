// Main canvas component
export { TraekCanvas } from './components/TraekCanvas.js';
export type { TraekCanvasProps } from './components/TraekCanvas.js';

// Default node renderer
export { TextNode } from './components/TextNode.js';
export type { TextNodeProps } from './components/TextNode.js';

// Hooks
export { useTraekEngine, useCreateTraekEngine } from './hooks/useTraekEngine.js';

// Re-export everything from @traek/core for convenience
export {
	TraekEngine,
	wouldCreateCycle,
	BasicNodeTypes,
	DEFAULT_TRACK_ENGINE_CONFIG,
	searchNodes,
	highlightMatch,
	Store,
	ObservableSet,
	serializedNodeSchema,
	conversationSnapshotSchema,
	saveStateSchema
} from '@traek/core';
export type {
	Node,
	MessageNode,
	CustomTraekNode,
	TraekNodeComponentProps,
	AddNodePayload,
	NodeStatus,
	TraekEngineConfig,
	ConversationSnapshot,
	SerializedNode,
	SaveState,
	StoredConversation,
	ConversationListItem,
	Unsubscribe,
	Subscriber
} from '@traek/core';
