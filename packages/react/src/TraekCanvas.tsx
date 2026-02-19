import { useRef, useEffect } from 'react';
import {
	createTraekCanvas,
	type TraekCanvasOptions,
	type TraekCanvasInstance
} from '@traek/elements';

export interface TraekCanvasProps extends TraekCanvasOptions {
	/** Additional CSS class name for the container div. */
	className?: string;
	/** Inline styles for the container div. */
	style?: React.CSSProperties;
}

/**
 * React wrapper for the traek spatial canvas.
 *
 * Renders a TraekCanvas inside a container div. All TraekCanvasOptions
 * are accepted as props and forwarded to the underlying Svelte component.
 *
 * @example
 * ```tsx
 * import { TraekCanvas, useTraekEngine } from '@traek/react';
 * import '@traek/elements/styles.css';
 *
 * function App() {
 *   const engine = useTraekEngine();
 *   return (
 *     <TraekCanvas
 *       engine={engine}
 *       onSendMessage={(input, userNode) => {
 *         const reply = engine.addNode('', 'assistant');
 *         engine.updateNode(reply.id, { status: 'streaming' });
 *       }}
 *       style={{ width: '100%', height: '100vh' }}
 *     />
 *   );
 * }
 * ```
 */
export function TraekCanvas({ className, style, ...options }: TraekCanvasProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const instanceRef = useRef<TraekCanvasInstance | null>(null);
	const optionsRef = useRef(options);

	// Keep options ref up to date
	optionsRef.current = options;

	// Mount on first render, destroy on unmount
	useEffect(() => {
		if (!containerRef.current) return;

		instanceRef.current = createTraekCanvas(containerRef.current, optionsRef.current);

		return () => {
			instanceRef.current?.destroy();
			instanceRef.current = null;
		};
	}, []);

	// Update props when they change
	useEffect(() => {
		instanceRef.current?.update(options);
	});

	return <div ref={containerRef} className={className} style={style} />;
}
