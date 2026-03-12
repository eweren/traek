import { useRef, useState, useCallback } from 'react';
import { DEFAULT_TRACK_ENGINE_CONFIG, TraekEngine } from '@traek/core';
import { TextNode, TraekCanvas } from '@traek/react';
import React from 'react';

const styles: Record<string, React.CSSProperties> = {
	container: {
		height: '100%',
		minHeight: '70vh'
	}
};

function getEngine(): TraekEngine {
	const e = new TraekEngine();
	e.addNode('Hello from @traek/react! Ask me anything.', 'assistant', { type: 'text' });
	return e;
}

export default function ReactDemo() {
	const engineRef = useRef<TraekEngine | null>(null);
	if (engineRef.current === null) {
		engineRef.current = getEngine();
	}
	const engine = engineRef.current;

	const [input, setInput] = useState('');

	// useEffect(() => {
	// 	return engine.subscribe(() => {
	// 		setNodes([...engine.nodes]);
	// 	});
	// }, [engine]);

	const send = useCallback(() => {
		const text = input.trim();
		if (!text) return;
		setInput('');

		const userNode = engine.addNode(text, 'user', { type: 'text' });
		const assistantId = engine.addNode('', 'assistant', {
			parentIds: [userNode.id],
			type: 'text'
		}).id;

		const reply = `You said: "${text}". This demo runs entirely in the browser using @traek/core.`;
		let i = 0;
		const interval = setInterval(() => {
			if (i < reply.length) {
				engine.updateNode(assistantId, { content: reply.slice(0, i + 1) });
				i++;
			} else {
				engine.updateNode(assistantId, { status: 'done' });
				clearInterval(interval);
			}
		}, 18);
	}, [engine, input]);

	if (!engine) return <></>;

	return (
		<TraekCanvas
			style={styles.container}
			componentMap={{ text: TextNode }}
			config={DEFAULT_TRACK_ENGINE_CONFIG}
			onSendMessage={send}
			engine={engine}
		></TraekCanvas>
	);
}
