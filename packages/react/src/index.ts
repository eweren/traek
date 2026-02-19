// React components
export { TraekCanvas, type TraekCanvasProps } from './TraekCanvas';
export { useTraekEngine } from './useTraekEngine';

// Re-export from @traek/elements for convenience
// (consumers can import everything they need from @traek/react)
export {
	// Engine & core types
	TraekEngine,
	DEFAULT_TRACK_ENGINE_CONFIG,
	wouldCreateCycle,
	type TraekEngineConfig,
	type MessageNode,
	type Node,
	type NodeStatus,
	type AddNodePayload,
	// Mount API types
	type TraekCanvasOptions,
	type TraekCanvasInstance,
	// Persistence
	snapshotToJSON,
	snapshotToMarkdown,
	downloadFile,
	type ConversationSnapshot,
	type SerializedNode,
	// Themes
	darkTheme,
	lightTheme,
	highContrastTheme,
	themes,
	DEFAULT_THEME,
	createCustomTheme,
	applyThemeToRoot,
	type TraekTheme,
	type TraekThemeColors,
	// i18n
	DEFAULT_TRANSLATIONS,
	mergeTranslations,
	type TraekTranslations,
	type PartialTraekTranslations,
	// Actions & node types
	type ActionDefinition,
	type NodeTypeAction,
	// Utilities
	markdownToHtml
} from '@traek/elements';
