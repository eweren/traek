import { TraekEngine } from '@traek/core';

type EngineWithTitle = TraekEngine & { _title?: string };

/** In-memory store: conversationId → engine instance */
const store = new Map<string, EngineWithTitle>();

export function getEngine(conversationId: string): EngineWithTitle | undefined {
	return store.get(conversationId);
}

export function requireEngine(conversationId: string): EngineWithTitle {
	const engine = store.get(conversationId);
	if (!engine) throw new Error(`Conversation "${conversationId}" not found`);
	return engine;
}

export function createConversation(conversationId: string, title?: string): EngineWithTitle {
	if (store.has(conversationId)) throw new Error(`Conversation "${conversationId}" already exists`);
	const engine = new TraekEngine() as EngineWithTitle;
	engine._title = title;
	store.set(conversationId, engine);
	return engine;
}

export function deleteConversation(conversationId: string): boolean {
	return store.delete(conversationId);
}

export function listConversations(): Array<{ id: string; title?: string; nodeCount: number }> {
	const result: Array<{ id: string; title?: string; nodeCount: number }> = [];
	for (const [id, engine] of store) {
		result.push({ id, title: engine._title, nodeCount: engine.nodes.length });
	}
	return result;
}

export function loadConversation(conversationId: string, snapshot: unknown): EngineWithTitle {
	const engine = TraekEngine.fromSnapshot(
		snapshot as Parameters<typeof TraekEngine.fromSnapshot>[0]
	) as EngineWithTitle;
	store.set(conversationId, engine);
	return engine;
}
