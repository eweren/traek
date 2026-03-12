<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { TraekEngine } from '@traek/core';
import type { Node } from '@traek/core';

const engine = new TraekEngine();
engine.addNode({ role: 'assistant', content: 'Hello from @traek/vue! Ask me anything.' });

const nodes = ref<Node[]>([...engine.nodes]);
const input = ref('');
let unsub: (() => void) | null = null;

onMounted(() => {
	unsub = engine.subscribe(() => {
		nodes.value = [...engine.nodes];
	});
});

onUnmounted(() => {
	unsub?.();
});

function send() {
	const text = input.value.trim();
	if (!text) return;
	input.value = '';

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
}
</script>

<template>
	<div class="demo">
		<div class="nodes">
			<div v-for="node in nodes" :key="node.id" :class="['node', `node--${node.role}`]">
				<span class="role">{{ node.role }}</span>
				<span class="content"
					>{{ (node as any).content ?? '' }}{{ node.status === 'streaming' ? '▌' : '' }}</span
				>
			</div>
		</div>

		<form class="input-row" @submit.prevent="send">
			<input v-model="input" placeholder="Type a message…" />
			<button type="submit">Send</button>
		</form>
	</div>
</template>

<style scoped>
.demo {
	border: 1px solid #333;
	border-radius: 8px;
	overflow: hidden;
	font-family: system-ui, sans-serif;
	font-size: 14px;
	background: #111;
}

.nodes {
	max-height: 260px;
	overflow-y: auto;
	padding: 12px;
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.node {
	display: flex;
	flex-direction: column;
	gap: 4px;
	padding: 10px 12px;
	border-radius: 6px;
	background: #1a1a1a;
	border: 1px solid #2a2a2a;
}

.node--user {
	align-self: flex-end;
	background: #1e1b4b;
	border-color: #3730a3;
	max-width: 80%;
}

.role {
	font-size: 11px;
	text-transform: uppercase;
	letter-spacing: 0.05em;
	color: #888;
}

.content {
	color: #e5e5e5;
	line-height: 1.5;
	white-space: pre-wrap;
}

.input-row {
	display: flex;
	gap: 8px;
	padding: 12px;
	border-top: 1px solid #222;
}

input {
	flex: 1;
	padding: 8px 12px;
	border-radius: 6px;
	border: 1px solid #333;
	background: #1a1a1a;
	color: #e5e5e5;
	font-size: 14px;
	outline: none;
}

input:focus {
	border-color: #6366f1;
}

button {
	padding: 8px 16px;
	border-radius: 6px;
	border: none;
	background: #6366f1;
	color: #fff;
	font-size: 14px;
	cursor: pointer;
}

button:hover {
	background: #4f46e5;
}
</style>
