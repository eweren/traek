<script setup lang="ts">
import { PREDEFINED_TAGS } from './tagUtils.js';

export interface TagFilterProps {
	activeTags: string[];
}

const props = defineProps<TagFilterProps>();

const emit = defineEmits<{
	change: [tags: string[]];
}>();

function toggle(tag: string) {
	const next = props.activeTags.includes(tag)
		? props.activeTags.filter((t) => t !== tag)
		: [...props.activeTags, tag];
	emit('change', next);
}

function clear() {
	emit('change', []);
}
</script>

<template>
	<div :style="{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }">
		<span :style="{ fontSize: '11px', color: '#666', fontWeight: 600 }">Filter:</span>
		<button
			v-for="[key, cfg] in Object.entries(PREDEFINED_TAGS)"
			:key="key"
			@click="toggle(key)"
			:style="{
				padding: '3px 10px',
				borderRadius: '12px',
				border: `1px solid ${activeTags.includes(key) ? cfg.color : '#333'}`,
				background: activeTags.includes(key) ? cfg.bgColor : 'transparent',
				color: activeTags.includes(key) ? cfg.color : '#666',
				cursor: 'pointer',
				fontSize: '11px',
				fontWeight: 500
			}"
		>
			{{ cfg.label }}
		</button>
		<button
			v-if="activeTags.length > 0"
			@click="clear"
			:style="{
				padding: '3px 10px',
				borderRadius: '12px',
				border: '1px solid #555',
				background: 'transparent',
				color: '#888',
				cursor: 'pointer',
				fontSize: '11px'
			}"
		>
			Clear
		</button>
	</div>
</template>
