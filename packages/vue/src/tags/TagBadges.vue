<script setup lang="ts">
import { computed } from 'vue';
import type { TraekEngine } from '@traek/core';
import { getNodeTags, getTagConfig } from './tagUtils.js';

export interface TagBadgesProps {
	nodeId: string;
	engine: TraekEngine;
	editable?: boolean;
}

const props = withDefaults(defineProps<TagBadgesProps>(), {
	editable: false
});

const tags = computed(() => {
	const node = props.engine.getNode(props.nodeId);
	return node ? getNodeTags(node) : [];
});

function removeTag(tag: string) {
	const node = props.engine.getNode(props.nodeId);
	if (!node) return;
	const current = getNodeTags(node).filter((t) => t !== tag);
	props.engine.updateNode(props.nodeId, {
		metadata: { x: 0, y: 0, ...node.metadata, tags: current }
	});
}
</script>

<template>
	<div v-if="tags.length > 0" :style="{ display: 'flex', flexWrap: 'wrap', gap: '4px' }">
		<span
			v-for="tag in tags"
			:key="tag"
			:style="{
				display: 'inline-flex',
				alignItems: 'center',
				gap: '4px',
				padding: '2px 8px',
				borderRadius: '12px',
				fontSize: '11px',
				fontWeight: 500,
				color: getTagConfig(tag).color,
				background: getTagConfig(tag).bgColor,
				border: `1px solid ${getTagConfig(tag).color}33`
			}"
		>
			{{ getTagConfig(tag).label }}
			<button
				v-if="editable"
				:aria-label="`Remove ${getTagConfig(tag).label} tag`"
				:style="{
					background: 'transparent',
					border: 'none',
					color: 'inherit',
					cursor: 'pointer',
					padding: 0,
					lineHeight: 1,
					fontSize: '12px',
					opacity: 0.7
				}"
				@click.stop="removeTag(tag)"
			>
				×
			</button>
		</span>
	</div>
</template>
