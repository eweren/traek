import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { TraekEngine } from '@traek/core';
import type { Node, MessageNode, TraekEngineConfig } from '@traek/core';
import { useTraekEngine, useCreateTraekEngine } from '../hooks/useTraekEngine.js';
import { TextNode } from './TextNode.js';

export interface TraekCanvasProps {
	/** Provide an existing engine or let the canvas create one. */
	engine?: TraekEngine;
	config?: Partial<TraekEngineConfig>;
	/** Called when the user submits a message. */
	onSendMessage?: (input: string, userNode: MessageNode, action?: string | string[]) => void;
	/** Called whenever any node changes. */
	onNodesChanged?: () => void;
	/** Initial zoom scale (default 1). */
	initialScale?: number;
	/** Custom node renderer map: `{ myType: MyNodeComponent }`. */
	componentMap?: Record<
		string,
		React.ComponentType<{ node: Node; engine: TraekEngine; isActive: boolean }>
	>;
	/** CSS class added to the root element. */
	className?: string;
	style?: React.CSSProperties;
}

/**
 * TraekCanvas for React.
 *
 * Renders a pannable/zoomable canvas with the conversation tree.
 *
 * @example
 * ```tsx
 * import { TraekCanvas, TraekEngine } from '@traek/react'
 *
 * const engine = new TraekEngine()
 *
 * function App() {
 *   return (
 *     <TraekCanvas
 *       engine={engine}
 *       onSendMessage={(text, userNode) => {
 *         // stream response from your AI API ...
 *       }}
 *     />
 *   )
 * }
 * ```
 */
export function TraekCanvas({
	engine: externalEngine,
	config,
	onSendMessage,
	onNodesChanged,
	initialScale = 1,
	componentMap,
	className,
	style
}: TraekCanvasProps) {
	const internalEngine = useCreateTraekEngine(config);
	const engine = externalEngine ?? internalEngine;

	// Subscribe to engine state changes
	const state = useTraekEngine(engine);

	// Viewport state
	const [scale, setScale] = useState(initialScale);
	const [offset, setOffset] = useState({ x: 0, y: 0 });
	const [inputValue, setInputValue] = useState('');

	const canvasRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const isPanning = useRef(false);
	const lastPointer = useRef({ x: 0, y: 0 });

	// Notify parent on node changes
	useEffect(() => {
		onNodesChanged?.();
	}, [state.nodes, onNodesChanged]);

	// Center on pending focus node
	useEffect(() => {
		if (!state.pendingFocusNodeId) return;
		const node = engine.getNode(state.pendingFocusNodeId);
		if (!node?.metadata) {
			engine.clearPendingFocus();
			return;
		}
		const { x, y } = node.metadata;
		const container = containerRef.current;
		if (container) {
			const { width, height } = container.getBoundingClientRect();
			const step = config?.gridStep ?? 20;
			setOffset({
				x: width / 2 - x * step * scale,
				y: height / 2 - y * step * scale
			});
		}
		engine.clearPendingFocus();
	}, [state.pendingFocusNodeId, engine, scale, config?.gridStep]);

	// Pan interaction
	const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
		if (e.button !== 0) return;
		const target = e.target as HTMLElement;
		// Don't start pan on interactive elements
		if (target.closest('button, input, textarea, [data-no-pan]')) return;
		isPanning.current = true;
		lastPointer.current = { x: e.clientX, y: e.clientY };
		e.currentTarget.setPointerCapture(e.pointerId);
	}, []);

	const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
		if (!isPanning.current) return;
		const dx = e.clientX - lastPointer.current.x;
		const dy = e.clientY - lastPointer.current.y;
		lastPointer.current = { x: e.clientX, y: e.clientY };
		setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
	}, []);

	const onPointerUp = useCallback(() => {
		isPanning.current = false;
	}, []);

	// Zoom with wheel
	const onWheel = useCallback(
		(e: React.WheelEvent<HTMLDivElement>) => {
			e.preventDefault();
			const rect = containerRef.current?.getBoundingClientRect();
			if (!rect) return;
			const mouseX = e.clientX - rect.left;
			const mouseY = e.clientY - rect.top;
			const delta = -e.deltaY * 0.001;
			const newScale = Math.min(8, Math.max(0.05, scale * (1 + delta)));
			// Zoom toward mouse position
			setOffset((prev) => ({
				x: mouseX - (mouseX - prev.x) * (newScale / scale),
				y: mouseY - (mouseY - prev.y) * (newScale / scale)
			}));
			setScale(newScale);
		},
		[scale]
	);

	// Submit message
	const handleSubmit = useCallback(
		(e: React.FormEvent) => {
			e.preventDefault();
			const text = inputValue.trim();
			if (!text) return;
			const userNode = engine.addNode(text, 'user');
			setInputValue('');
			onSendMessage?.(text, userNode);
		},
		[inputValue, engine, onSendMessage]
	);

	const gridStep = config?.gridStep ?? 20;
	const nodeWidth = config?.nodeWidth ?? 350;

	// Resolve component for a node type
	const resolveComponent = useCallback(
		(node: Node) => {
			if (componentMap?.[node.type]) {
				return componentMap[node.type]!;
			}
			return TextNode as React.ComponentType<{
				node: Node;
				engine: TraekEngine;
				isActive: boolean;
			}>;
		},
		[componentMap]
	);

	return (
		<div
			ref={containerRef}
			className={`traek-canvas-container ${className ?? ''}`}
			style={{
				position: 'relative',
				overflow: 'hidden',
				width: '100%',
				height: '100%',
				background: 'var(--traek-canvas-bg, #0d0d0d)',
				cursor: isPanning.current ? 'grabbing' : 'grab',
				userSelect: 'none',
				...style
			}}
			onPointerDown={onPointerDown}
			onPointerMove={onPointerMove}
			onPointerUp={onPointerUp}
			onWheel={onWheel}
		>
			{/* Canvas layer with pan/zoom transform */}
			<div
				ref={canvasRef}
				style={{
					position: 'absolute',
					inset: 0,
					transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
					transformOrigin: '0 0',
					willChange: 'transform'
				}}
			>
				{/* Render nodes */}
				{state.nodes.map((node) => {
					if (engine.isInCollapsedSubtree(node.id)) return null;
					const NodeComponent = resolveComponent(node);
					const x = (node.metadata?.x ?? 0) * gridStep;
					const y = (node.metadata?.y ?? 0) * gridStep;
					const isActive = state.activeNodeId === node.id;

					return (
						<div
							key={node.id}
							data-node-id={node.id}
							style={{
								position: 'absolute',
								left: x,
								top: y,
								width: nodeWidth,
								boxSizing: 'border-box'
							}}
							onClick={(e) => {
								e.stopPropagation();
								engine.branchFrom(node.id);
							}}
						>
							<NodeComponent node={node} engine={engine} isActive={isActive} />
						</div>
					);
				})}
			</div>

			{/* Input form at bottom */}
			<form
				data-no-pan
				onSubmit={handleSubmit}
				style={{
					position: 'absolute',
					bottom: 0,
					left: 0,
					right: 0,
					padding: '16px',
					background: 'linear-gradient(to top, var(--traek-canvas-bg, #0d0d0d) 60%, transparent)',
					display: 'flex',
					gap: '8px'
				}}
			>
				<input
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					placeholder="Message…"
					style={{
						flex: 1,
						padding: '10px 14px',
						borderRadius: '8px',
						border: '1px solid var(--traek-border, rgba(255,255,255,0.1))',
						background: 'var(--traek-input-bg, rgba(255,255,255,0.05))',
						color: 'var(--traek-text, #fff)',
						fontSize: '14px',
						outline: 'none'
					}}
					onKeyDown={(e) => {
						if (e.key === 'Enter' && !e.shiftKey) {
							e.preventDefault();
							handleSubmit(e);
						}
					}}
				/>
				<button
					type="submit"
					disabled={!inputValue.trim()}
					style={{
						padding: '10px 20px',
						borderRadius: '8px',
						border: 'none',
						background: 'var(--traek-accent, #0ff)',
						color: '#000',
						fontWeight: 600,
						cursor: 'pointer',
						opacity: inputValue.trim() ? 1 : 0.4
					}}
				>
					Send
				</button>
			</form>

			{/* Zoom controls */}
			<div
				data-no-pan
				style={{
					position: 'absolute',
					top: 16,
					right: 16,
					display: 'flex',
					flexDirection: 'column',
					gap: '4px'
				}}
			>
				<button
					onClick={() => setScale((s) => Math.min(8, s * 1.2))}
					style={zoomBtnStyle}
					title="Zoom in"
				>
					+
				</button>
				<button
					onClick={() => setScale(1)}
					style={{ ...zoomBtnStyle, fontSize: '10px' }}
					title="Reset zoom"
				>
					{Math.round(scale * 100)}%
				</button>
				<button
					onClick={() => setScale((s) => Math.max(0.05, s / 1.2))}
					style={zoomBtnStyle}
					title="Zoom out"
				>
					−
				</button>
			</div>
		</div>
	);
}

const zoomBtnStyle: React.CSSProperties = {
	width: 32,
	height: 32,
	borderRadius: '6px',
	border: '1px solid var(--traek-border, rgba(255,255,255,0.1))',
	background: 'var(--traek-surface, rgba(255,255,255,0.05))',
	color: 'var(--traek-text, #fff)',
	cursor: 'pointer',
	fontSize: '16px',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center'
};
