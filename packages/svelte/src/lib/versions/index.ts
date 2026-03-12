export { VersionHistoryManager } from './VersionHistoryManager';
export { AutoSnapshotTimer } from './AutoSnapshotTimer';
export { MemoryAdapter } from './adapters/MemoryAdapter';
export { LocalStorageAdapter } from './adapters/LocalStorageAdapter';
export { IndexedDBVersionAdapter } from './adapters/IndexedDBAdapter';
export { snapshotDiff } from './snapshotDiff';
export { versionEntrySchema } from './types';
export type {
	VersionEntry,
	SnapshotDiff,
	SnapshotNodeChange,
	StorageAdapter,
	VersionHistoryOptions
} from './types';
