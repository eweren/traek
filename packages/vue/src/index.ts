// Main canvas component
export { default as TraekCanvas } from './components/TraekCanvas.vue'

// Composables
export { useTraekEngine, useCreateTraekEngine } from './composables/useTraekEngine.js'
export type { TraekEngineRefs } from './composables/useTraekEngine.js'

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
} from '@traek/core'
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
} from '@traek/core'
