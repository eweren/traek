import { useState, useEffect, useCallback, useMemo } from 'react';
import { TraekEngine } from '@traek/core';
import type { Node } from '@traek/core';

const styles: Record<string, React.CSSProperties> = {
	demo: {
		border: '1px solid #333',
		borderRadius: 8,
		overflow: 'hidden',
		fontFamily: 'system-ui, sans-serif',
		fontSize: 14,
		background: '#111'
	},
	nodes: {
		maxHeight: 260,
		overflowY: 'auto' as const,
		padding: 12,
		display: 'flex',
		flexDirection: 'column' as const,
		gap: 8
	},
	node: {
		display: 'flex',
		flexDirection: 'column' as const,
		gap: 4,
		padding: '10px 12px',
		borderRadius: 6,
		background: '#1a1a1a',
		border: '1px solid #2a2a2a'
	},
	nodeUser: {
		alignSelf: 'flex-end',
		background: '#1e1b4b',
		borderColor: '#3730a3',
		maxWidth: '80%'
	},
	role: {
		fontSize: 11,
		textTransform: 'uppercase' as const,
		letterSpacing: '0.05em',
		color: '#888'
	},
	content: {
		color: '#e5e5e5',
		lineHeight: 1.5,
		whiteSpace: 'pre-wrap' as const
	},
	inputRow: {
		display: 'flex',
		gap: 8,
		padding: 12,
		borderTop: '1px solid #222'
	},
	input: {
		flex: 1,
		padding: '8px 12px',
		borderRadius: 6,
		border: '1px solid #333',
		background: '#1a1a1a',
		color: '#e5e5e5',
		fontSize: 14,
		outline: 'none'
	},
	button: {
		padding: '8px 16px',
		borderRadius: 6,
		border: 'none',
		background: '#6366f1',
		color: '#fff',
		fontSize: 14,
		cursor: 'pointer'
	}
};

export default function ReactDemo() {
	const engine = useMemo(() => {
		const e = new TraekEngine();
		e.addNode({ role: 'assistant', content: 'Hello from @traek/react! Ask me anything.' });
		return e;
	}, []);

	const [nodes, setNodes] = useState<Node[]>(() => [...engine.nodes]);
	const [input, setInput] = useState('');

	useEffect(() => {
		return engine.subscribe(() => {
			setNodes([...engine.nodes]);
		});
	}, [engine]);

	const send = useCallback(() => {
		const text = input.trim();
		if (!text) return;
		setInput('');

		const userNode = engine.addNode({ role: 'user', content: text });
		const assistantId = engine.addNode({
			role: 'assistant',
			content: '',
			parentIds: [userNode.id],
			status: 'streaming'
		}).id;

		const reply = `You said: "${text}". This demo runs entirely in the browser using @traek/core.`;
		let i = 0;
		const interval = setInterval(() => {
			if (i < reply.length) {
				engine.appendToNode(assistantId, reply[i]);
				i++;
			} else {
				engine.updateNode(assistantId, { status: 'done' });
				clearInterval(interval);
			}
		}, 18);
	}, [engine, input]);

	return (
		<div style={styles.demo}>
			<div style={styles.nodes}>
				{nodes.map((node) => (
					<div
						key={node.id}
						style={node.role === 'user' ? { ...styles.node, ...styles.nodeUser } : styles.node}
					>
						<span style={styles.role}>{node.role}</span>
						<span style={styles.content}>
							{'content' in node ? String((node as any).content) : ''}
							{node.status === 'streaming' ? '▌' : ''}
						</span>
					</div>
				))}
			</div>
			<form
				style={styles.inputRow}
				onSubmit={(e) => {
					e.preventDefault();
					send();
				}}
			>
				<input
					style={styles.input}
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder="Type a message…"
				/>
				<button type="submit" style={styles.button}>
					Send
				</button>
			</form>
		</div>
	);
}
