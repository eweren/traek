<script setup lang="ts">
import { onUnmounted, ref } from 'vue';
import { toastStore } from './toastStore.js';
import type { ToastData } from './toastStore.js';

export interface ToastsComposableReturn {
	toasts: ToastData[];
}

const toasts = ref<ToastData[]>(toastStore.getToasts());

const unsub = toastStore.subscribe(() => {
	toasts.value = [...toastStore.getToasts()];
});

onUnmounted(unsub);

function bgColor(type: ToastData['type']): string {
	if (type === 'error') return '#ff3e00';
	if (type === 'success') return '#22c55e';
	if (type === 'undo') return '#00d8ff';
	return '#444444';
}

function textColor(type: ToastData['type']): string {
	return type === 'undo' || type === 'success' ? '#000' : '#fff';
}
</script>

<template>
	<div
		v-if="toasts.length > 0"
		aria-label="Notifications"
		:style="{
			position: 'fixed',
			bottom: '24px',
			left: '50%',
			transform: 'translateX(-50%)',
			display: 'flex',
			flexDirection: 'column',
			gap: '8px',
			zIndex: 9999,
			pointerEvents: 'none'
		}"
	>
		<div v-for="t in toasts" :key="t.id" :style="{ pointerEvents: 'all' }">
			<div
				role="status"
				aria-live="polite"
				:style="{
					display: 'flex',
					alignItems: 'center',
					gap: '8px',
					padding: '10px 14px',
					borderRadius: '8px',
					background: bgColor(t.type),
					color: textColor(t.type),
					fontSize: '13px',
					fontWeight: 500,
					boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
					maxWidth: '320px'
				}"
			>
				<span :style="{ flex: 1 }">{{ t.message }}</span>
				<button
					v-if="t.type === 'undo' && t.onUndo"
					:style="{
						background: 'rgba(0,0,0,0.2)',
						border: 'none',
						color: 'inherit',
						fontWeight: 600,
						padding: '2px 8px',
						borderRadius: '4px',
						cursor: 'pointer',
						fontSize: '12px'
					}"
					@click="
						() => {
							t.onUndo?.();
							toastStore.removeToast(t.id);
						}
					"
				>
					Undo
				</button>
				<button
					aria-label="Dismiss"
					:style="{
						background: 'transparent',
						border: 'none',
						color: 'inherit',
						opacity: 0.7,
						cursor: 'pointer',
						padding: '0 2px',
						fontSize: '16px',
						lineHeight: 1
					}"
					@click="() => toastStore.removeToast(t.id)"
				>
					×
				</button>
			</div>
		</div>
	</div>
</template>
