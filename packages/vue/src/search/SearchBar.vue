<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { TraekEngine } from '@traek/core';
import { useTraekEngine } from '../composables/useTraekEngine.js';

export interface SearchBarProps {
	engine: TraekEngine;
	placeholder?: string;
	onClose?: () => void;
}

const props = withDefaults(defineProps<SearchBarProps>(), {
	placeholder: 'Search...'
});

const { searchQuery, searchMatches, currentSearchIndex } = useTraekEngine(props.engine);
const inputRef = ref<HTMLInputElement | null>(null);

const navBtnStyle = {
	background: 'transparent',
	border: 'none',
	color: 'var(--traek-node-text, #ddd)',
	cursor: 'pointer',
	fontSize: '14px',
	padding: '2px 4px',
	borderRadius: '4px',
	lineHeight: 1
};

onMounted(() => {
	inputRef.value?.focus();
});

function handleKeyDown(e: KeyboardEvent) {
	if (e.key === 'Escape') {
		props.engine.clearSearch();
		props.onClose?.();
	} else if (e.key === 'Enter') {
		if (e.shiftKey) {
			props.engine.previousSearchMatch();
		} else {
			props.engine.nextSearchMatch();
		}
		e.preventDefault();
	}
}

function closeSearch() {
	props.engine.clearSearch();
	props.onClose?.();
}
</script>

<template>
	<div
		:style="{
			display: 'flex',
			alignItems: 'center',
			gap: '6px',
			padding: '6px 10px',
			background: 'var(--traek-node-bg, #1a1a1a)',
			border: '1px solid var(--traek-node-border, #333)',
			borderRadius: '8px',
			boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
		}"
	>
		<input
			ref="inputRef"
			:value="searchQuery"
			:placeholder="placeholder"
			aria-label="Search conversation"
			:style="{
				background: 'transparent',
				border: 'none',
				color: 'var(--traek-node-text, #ddd)',
				fontSize: '13px',
				outline: 'none',
				flex: 1,
				minWidth: '120px'
			}"
			@input="engine.searchNodesMethod(($event.target as HTMLInputElement).value)"
			@keydown="handleKeyDown"
		/>
		<span
			v-if="searchMatches.length > 0"
			:style="{ fontSize: '11px', color: '#888', whiteSpace: 'nowrap' }"
		>
			{{ currentSearchIndex + 1 }}/{{ searchMatches.length }}
		</span>
		<span
			v-if="searchQuery && searchMatches.length === 0"
			:style="{ fontSize: '11px', color: '#ff6b4a' }"
		>
			No matches
		</span>
		<button
			:disabled="searchMatches.length === 0"
			title="Previous match (Shift+Enter)"
			aria-label="Previous match"
			:style="navBtnStyle"
			@click="engine.previousSearchMatch()"
		>
			↑
		</button>
		<button
			:disabled="searchMatches.length === 0"
			title="Next match (Enter)"
			aria-label="Next match"
			:style="navBtnStyle"
			@click="engine.nextSearchMatch()"
		>
			↓
		</button>
		<button
			title="Close search (Escape)"
			aria-label="Close search"
			:style="{ ...navBtnStyle, opacity: 0.6 }"
			@click="closeSearch"
		>
			×
		</button>
	</div>
</template>
