// Mount API
export {
	createTraekCanvas,
	type TraekCanvasOptions,
	type TraekCanvasInstance
} from './createTraekCanvas.svelte';

// Engine & core types (re-exported so non-Svelte consumers have a single import source)
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

// Persistence & serialization (pure functions, framework-agnostic)
export { snapshotToJSON, snapshotToMarkdown, downloadFile } from 'traek';
export type {
	ConversationSnapshot,
	SerializedNode,
	StoredConversation,
	ConversationListItem,
	SaveState
} from 'traek';

// Theme utilities (work via CSS custom properties, no Svelte dependency)
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

// i18n (pure data, no Svelte dependency)
export { DEFAULT_TRANSLATIONS, mergeTranslations } from 'traek';
export type { TraekTranslations, PartialTraekTranslations } from 'traek';

// Actions & node types (type-only for configuration)
export type { ActionDefinition } from 'traek';
export type { NodeTypeAction } from 'traek';

// Zod schemas (pure validation, framework-agnostic)
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
