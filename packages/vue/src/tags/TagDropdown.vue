<script setup lang="ts">
import { computed, ref } from 'vue';
import type { TraekEngine } from '@traek/core';
import { getNodeTags, PREDEFINED_TAGS } from './tagUtils.js';

export interface TagDropdownProps {
	nodeId: string;
	engine: TraekEngine;
	onClose?: () => void;
}

const props = defineProps<TagDropdownProps>();

const customInput = ref('');

const currentTags = computed(() => {
	const node = props.engine.getNode(props.nodeId);
	return node ? getNodeTags(node) : [];
});

function toggleTag(tag: string) {
	const node = props.engine.getNode(props.nodeId);
	if (!node) return;
	const tags = getNodeTags(node);
	const next = tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag];
	props.engine.updateNode(props.nodeId, { metadata: { x: 0, y: 0, ...node.metadata, tags: next } });
}

function addCustom() {
	const val = customInput.value.trim().toLowerCase().replace(/\s+/g, '-');
	if (!val) return;
	const node = props.engine.getNode(props.nodeId);
	if (!node) return;
	const tags = getNodeTags(node);
	if (!tags.includes(val)) {
		props.engine.updateNode(props.nodeId, {
			metadata: { x: 0, y: 0, ...node.metadata, tags: [...tags, val] }
		});
	}
	customInput.value = '';
}
</script>

<template>
	<div
		:style="{
			background: 'var(--traek-node-bg, #1a1a1a)',
			border: '1px solid var(--traek-node-border, #333)',
			borderRadius: '8px',
			padding: '12px',
			minWidth: '180px',
			boxShadow: '0 4px 16px rgba(0,0,0,0.4)'
		}"
	>
		<div :style="{ fontSize: '11px', color: '#666', marginBottom: '8px', fontWeight: 600 }">
			Tags
		</div>
		<div :style="{ display: 'flex', flexDirection: 'column', gap: '4px' }">
			<button
				v-for="[key, cfg] in Object.entries(PREDEFINED_TAGS)"
				:key="key"
				:style="{
					display: 'flex',
					alignItems: 'center',
					gap: '8px',
					padding: '4px 8px',
					borderRadius: '6px',
					border: 'none',
					background: currentTags.includes(key) ? cfg.bgColor : 'transparent',
					color: currentTags.includes(key) ? cfg.color : '#aaa',
					cursor: 'pointer',
					textAlign: 'left',
					fontSize: '12px'
				}"
				@click="toggleTag(key)"
			>
				<span
					:style="{
						width: '8px',
						height: '8px',
						borderRadius: '50%',
						background: cfg.color,
						flexShrink: 0
					}"
				/>
				{{ cfg.label }}
				<span
					v-if="currentTags.includes(key)"
					:style="{ marginLeft: 'auto', fontSize: '10px', opacity: 0.7 }"
				>
					✓
				</span>
			</button>
		</div>
		<div :style="{ display: 'flex', gap: '4px', marginTop: '8px' }">
			<input
				v-model="customInput"
				placeholder="Custom tag..."
				:style="{
					flex: 1,
					padding: '4px 8px',
					borderRadius: '6px',
					border: '1px solid #444',
					background: '#111',
					color: '#ddd',
					fontSize: '12px',
					outline: 'none'
				}"
				@keydown.enter="addCustom"
			/>
			<button
				:style="{
					padding: '4px 8px',
					borderRadius: '6px',
					border: 'none',
					background: '#333',
					color: '#ddd',
					cursor: 'pointer',
					fontSize: '12px'
				}"
				@click="addCustom"
			>
				Add
			</button>
		</div>
		<button
			v-if="onClose"
			:style="{
				display: 'block',
				width: '100%',
				marginTop: '8px',
				padding: '4px',
				borderRadius: '6px',
				border: '1px solid #333',
				background: 'transparent',
				color: '#666',
				cursor: 'pointer',
				fontSize: '11px'
			}"
			@click="onClose"
		>
			Close
		</button>
	</div>
</template>
