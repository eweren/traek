import { useMemo } from 'react';
import { TraekEngine, type TraekEngineConfig } from '@traek/elements';

/**
 * React hook that creates and memoizes a TraekEngine instance.
 *
 * The engine is created once and persists across re-renders.
 * Pass it to `<TraekCanvas engine={engine} />` and use it
 * to imperatively add/update/remove nodes.
 *
 * @example
 * ```tsx
 * import { useTraekEngine } from '@traek/react';
 *
 * function Chat() {
 *   const engine = useTraekEngine({ nodeWidth: 400 });
 *
 *   function handleSend(input: string) {
 *     engine.addNode(input, 'user');
 *     const reply = engine.addNode('', 'assistant', { autofocus: true });
 *     engine.updateNode(reply.id, { status: 'streaming' });
 *   }
 *
 *   return <TraekCanvas engine={engine} onSendMessage={handleSend} />;
 * }
 * ```
 */
export function useTraekEngine(config?: Partial<TraekEngineConfig>): TraekEngine {
	return useMemo(() => new TraekEngine(config), []);
}
