export { default as ToastContainer } from './ToastContainer.vue';
export { toastStore, toast, toastUndo } from './toastStore.js';
export type { ToastType, ToastData } from './toastStore.js';

import { onUnmounted, ref } from 'vue';
import { toastStore } from './toastStore.js';
import type { ToastData } from './toastStore.js';

/** Vue composable that subscribes to the global toast store. */
export function useToasts(): { toasts: ReturnType<typeof ref<ToastData[]>> } {
	const toasts = ref<ToastData[]>(toastStore.getToasts());
	const unsub = toastStore.subscribe(() => {
		toasts.value = [...toastStore.getToasts()];
	});
	onUnmounted(unsub);
	return { toasts };
}
