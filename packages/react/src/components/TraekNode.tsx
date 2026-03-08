import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { TraekEngine, Node } from '@traek/core';

const DEFAULT_PLACEHOLDER_HEIGHT = 100;

export interface TraekNodeProps {
	node: Node;
	engine: TraekEngine;
	isActive: boolean;
	/** Root element for IntersectionObserver (defaults to viewport). */
	viewportRoot?: Element | null;
	gridStep?: number;
	nodeWidth?: number;
	/** Extra margin around the viewport before a node is considered visible. */
	rootMargin?: string;
	/** Called when the user clicks or presses Enter/Space on this node. */
	onActivate?: (nodeId: string) => void;
	children?: React.ReactNode;
	className?: string;
	style?: React.CSSProperties;
}

/**
 * TraekNode — a positioned, viewport-aware wrapper for a single conversation node.
 *
 * Uses `IntersectionObserver` to skip rendering off-screen nodes (replaces them
 * with a same-size placeholder), and `ResizeObserver` to keep the engine's
 * height metadata up-to-date for layout calculations.
 *
 * @example
 * ```tsx
 * <TraekNode node={node} engine={engine} isActive={isActive}>
 *   <TextNode node={node} engine={engine} isActive={isActive} />
 * </TraekNode>
 * ```
 */
export function TraekNode({
	node,
	engine,
	isActive,
	viewportRoot = null,
	gridStep = 20,
	nodeWidth = 350,
	rootMargin = '100px',
	onActivate,
	children,
	className,
	style
}: TraekNodeProps) {
	const wrapperRef = useRef<HTMLDivElement>(null);
	const [isInView, setIsInView] = useState(true);

	// IntersectionObserver: swap node for a placeholder when off-screen
	useEffect(() => {
		const el = wrapperRef.current;
		if (!el) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry) setIsInView(entry.isIntersecting);
			},
			{ root: viewportRoot, rootMargin, threshold: 0 }
		);

		observer.observe(el);
		return () => observer.disconnect();
	}, [viewportRoot, rootMargin]);

	// ResizeObserver: keep engine height metadata current
	useEffect(() => {
		const el = wrapperRef.current;
		if (!el) return;

		const observer = new ResizeObserver(() => {
			if (!el || el.dataset.placeholder === 'true') return;
			engine.updateNodeHeight(node.id, el.offsetHeight);
		});

		observer.observe(el);
		return () => observer.disconnect();
	}, [engine, node.id]);

	const handleClick = useCallback(
		(e: React.MouseEvent) => {
			e.stopPropagation();
			engine.branchFrom(node.id);
			onActivate?.(node.id);
		},
		[engine, node.id, onActivate]
	);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				engine.branchFrom(node.id);
				onActivate?.(node.id);
			}
		},
		[engine, node.id, onActivate]
	);

	const placeholderHeight = node.metadata?.height ?? DEFAULT_PLACEHOLDER_HEIGHT;
	const x = (node.metadata?.x ?? 0) * gridStep;
	const y = (node.metadata?.y ?? 0) * gridStep;

	const baseStyle: React.CSSProperties = {
		position: 'absolute',
		left: x,
		top: y,
		width: nodeWidth,
		boxSizing: 'border-box',
		...style
	};

	if (!isInView) {
		return (
			<div
				ref={wrapperRef}
				data-node-id={node.id}
				data-placeholder="true"
				aria-hidden="true"
				style={{
					...baseStyle,
					height: placeholderHeight,
					pointerEvents: 'none',
					visibility: 'hidden'
				}}
			/>
		);
	}

	return (
		<div
			ref={wrapperRef}
			data-node-id={node.id}
			role="treeitem"
			aria-selected={isActive}
			tabIndex={0}
			className={className}
			style={baseStyle}
			onClick={handleClick}
			onKeyDown={handleKeyDown}
		>
			{children}
		</div>
	);
}
