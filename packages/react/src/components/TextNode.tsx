import React, { useEffect, useMemo, useRef, useState } from 'react'
import type { TraekEngine, Node, MessageNode } from '@traek/core'
import { highlightMatch } from '@traek/core'

export interface TextNodeProps {
	node: Node
	engine: TraekEngine
	isActive: boolean
}

/**
 * Default text node renderer for @traek/react.
 * Renders markdown content with basic streaming support.
 */
export function TextNode({ node, engine, isActive }: TextNodeProps) {
	const messageNode = node as MessageNode
	const content = messageNode.content ?? ''
	const isStreaming = node.status === 'streaming'
	const isError = node.status === 'error'

	const containerStyle: React.CSSProperties = {
		borderRadius: '12px',
		border: `1px solid ${isActive ? 'var(--traek-accent, #0ff)' : 'var(--traek-border, rgba(255,255,255,0.1))'}`,
		background: isActive
			? 'var(--traek-node-active-bg, rgba(0,255,255,0.05))'
			: 'var(--traek-node-bg, rgba(255,255,255,0.04))',
		boxShadow: isActive ? '0 0 0 1px var(--traek-accent, #0ff)' : 'none',
		overflow: 'hidden',
		transition: 'border-color 0.2s, box-shadow 0.2s'
	}

	const headerStyle: React.CSSProperties = {
		padding: '8px 12px',
		display: 'flex',
		alignItems: 'center',
		gap: '6px',
		borderBottom: '1px solid var(--traek-border, rgba(255,255,255,0.06))',
		fontSize: '11px',
		color: 'var(--traek-text-muted, rgba(255,255,255,0.5))'
	}

	const roleColors: Record<string, string> = {
		user: '#0ff',
		assistant: '#a78bfa',
		system: '#fb923c'
	}

	const roleColor = roleColors[node.role] ?? '#888'

	return (
		<div style={containerStyle}>
			{/* Header */}
			<div style={headerStyle}>
				<span
					style={{
						width: 6,
						height: 6,
						borderRadius: '50%',
						background: roleColor,
						flexShrink: 0
					}}
				/>
				<span style={{ textTransform: 'capitalize', color: roleColor }}>{node.role}</span>
				{isStreaming && (
					<span style={{ marginLeft: 'auto', color: 'var(--traek-accent, #0ff)' }}>●</span>
				)}
				{isError && (
					<span style={{ marginLeft: 'auto', color: '#f87171' }}>Error</span>
				)}
			</div>

			{/* Content */}
			<div
				style={{
					padding: '12px',
					fontSize: '14px',
					lineHeight: 1.6,
					color: 'var(--traek-text, rgba(255,255,255,0.9))',
					whiteSpace: 'pre-wrap',
					wordBreak: 'break-word',
					maxHeight: '400px',
					overflowY: 'auto'
				}}
			>
				{content || (
					<span style={{ color: 'var(--traek-text-muted, rgba(255,255,255,0.3))' }}>
						{isStreaming ? '…' : '(empty)'}
					</span>
				)}
			</div>

			{/* Error message */}
			{isError && node.errorMessage && (
				<div
					style={{
						padding: '8px 12px',
						fontSize: '12px',
						color: '#f87171',
						borderTop: '1px solid rgba(248,113,113,0.2)',
						background: 'rgba(248,113,113,0.05)'
					}}
				>
					{node.errorMessage}
				</div>
			)}
		</div>
	)
}
