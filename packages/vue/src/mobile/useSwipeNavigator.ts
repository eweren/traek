import { onUnmounted, reactive, ref } from 'vue';
import type { FocusModeConfig, SwipeResult, SwipeState } from './focusModeTypes.js';
import { DEFAULT_FOCUS_MODE_CONFIG } from './focusModeTypes.js';
import { findScrollable } from './scrollUtils.js';

interface TouchRecord {
	startX: number;
	startY: number;
	startTime: number;
	currentX: number;
	currentY: number;
	axisLock: 'horizontal' | 'vertical' | null;
	scrollableEl: HTMLElement | null;
	scrollBoundary: 'top' | 'bottom' | 'both' | null;
}

const AXIS_LOCK_THRESHOLD = 10;
const AXIS_LOCK_RATIO = 1.5;

function getScrollBoundary(el: HTMLElement): 'top' | 'bottom' | 'both' | null {
	const atTop = el.scrollTop <= 1;
	const atBottom = el.scrollTop >= el.scrollHeight - el.clientHeight - 1;
	if (atTop && atBottom) return 'both';
	if (atTop) return 'top';
	if (atBottom) return 'bottom';
	return null;
}

const INITIAL_STATE: SwipeState = {
	isGestureActive: false,
	dragDeltaX: 0,
	dragDeltaY: 0,
	overscrollY: 0,
	overscrollX: 0
};

/**
 * Vue composable for touch-based swipe navigation.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useSwipeNavigator } from '@traek/vue'
 *
 * const { swipeState, bindRef } = useSwipeNavigator({
 *   onSwipe(result) { console.log(result.direction) }
 * })
 * </script>
 * <template>
 *   <div :ref="bindRef" :style="{ transform: `translateX(${swipeState.dragDeltaX}px)` }" />
 * </template>
 * ```
 */
export function useSwipeNavigator(opts: {
	config?: Partial<FocusModeConfig>;
	onSwipe?: (result: SwipeResult) => void;
}): { swipeState: SwipeState; bindRef: (el: HTMLElement | null) => void } {
	const config: FocusModeConfig = { ...DEFAULT_FOCUS_MODE_CONFIG, ...opts.config };
	const onSwipeRef = ref(opts.onSwipe);
	onSwipeRef.value = opts.onSwipe;

	const swipeState = reactive<SwipeState>({ ...INITIAL_STATE });

	let touch: TouchRecord | null = null;
	let lastScrollTime = 0;
	let currentEl: HTMLElement | null = null;
	let cleanup: (() => void) | null = null;

	function reset() {
		touch = null;
		Object.assign(swipeState, INITIAL_STATE);
	}

	function handleTouchStart(e: TouchEvent) {
		if (e.touches.length !== 1) return;
		const t = e.touches[0];
		if (!t) return;

		const scrollableEl = findScrollable(e.target as Element);
		const scrollBoundary = scrollableEl ? getScrollBoundary(scrollableEl) : null;

		touch = {
			startX: t.clientX,
			startY: t.clientY,
			startTime: performance.now(),
			currentX: t.clientX,
			currentY: t.clientY,
			axisLock: null,
			scrollableEl,
			scrollBoundary
		};

		Object.assign(swipeState, {
			isGestureActive: true,
			dragDeltaX: 0,
			dragDeltaY: 0,
			overscrollX: 0,
			overscrollY: 0
		});
	}

	function handleTouchMove(e: TouchEvent) {
		if (!touch || e.touches.length !== 1) return;
		const t = e.touches[0];
		if (!t) return;

		touch.currentX = t.clientX;
		touch.currentY = t.clientY;

		const dx = t.clientX - touch.startX;
		const dy = t.clientY - touch.startY;
		const absDx = Math.abs(dx);
		const absDy = Math.abs(dy);

		if (!touch.axisLock && (absDx > AXIS_LOCK_THRESHOLD || absDy > AXIS_LOCK_THRESHOLD)) {
			if (absDx > absDy * AXIS_LOCK_RATIO) {
				touch.axisLock = 'horizontal';
			} else if (absDy > absDx * AXIS_LOCK_RATIO) {
				touch.axisLock = 'vertical';
			} else {
				touch.axisLock = absDx >= absDy ? 'horizontal' : 'vertical';
			}
		}

		if (!touch.axisLock) return;

		if (touch.axisLock === 'horizontal') {
			if (e.cancelable) e.preventDefault();
			swipeState.dragDeltaX = dx;
			swipeState.dragDeltaY = 0;
			return;
		}

		if (touch.scrollableEl) {
			const currentBoundary = getScrollBoundary(touch.scrollableEl);
			const swipingUp = dy < 0;
			const swipingDown = dy > 0;
			const canOverscroll =
				(swipingUp && (currentBoundary === 'bottom' || currentBoundary === 'both')) ||
				(swipingDown && (currentBoundary === 'top' || currentBoundary === 'both'));

			if (canOverscroll) {
				if (e.cancelable) e.preventDefault();
				swipeState.overscrollY = dy;
				swipeState.dragDeltaX = 0;
				swipeState.dragDeltaY = dy;
			} else {
				const scrollPosBefore = touch.scrollableEl.scrollTop;
				requestAnimationFrame(() => {
					if (touch?.scrollableEl && touch.scrollableEl.scrollTop !== scrollPosBefore) {
						lastScrollTime = performance.now();
					}
				});
			}
		} else {
			if (e.cancelable) e.preventDefault();
			swipeState.dragDeltaX = 0;
			swipeState.dragDeltaY = dy;
		}
	}

	function handleTouchEnd(_e: TouchEvent) {
		if (!touch) {
			reset();
			return;
		}

		const dx = touch.currentX - touch.startX;
		const dy = touch.currentY - touch.startY;
		const elapsed = performance.now() - touch.startTime;
		const velocityX = elapsed > 0 ? Math.abs(dx) / elapsed : 0;
		const velocityY = elapsed > 0 ? Math.abs(dy) / elapsed : 0;

		const timeSinceScroll = performance.now() - lastScrollTime;
		if (lastScrollTime > 0 && timeSinceScroll < config.scrollCooldownMs) {
			reset();
			return;
		}

		let direction: SwipeResult['direction'] = null;
		let velocityTriggered = false;

		const axis = touch.axisLock;
		const overscrollY = touch.currentY - touch.startY;
		const isOverscroll = Math.abs(overscrollY) > 0 && touch.scrollableEl !== null;
		const threshold = isOverscroll ? config.overscrollThreshold : config.swipeThreshold;

		if (axis === 'horizontal') {
			const distanceMet = Math.abs(dx) >= threshold;
			const velocityMet = velocityX >= config.velocityThreshold;
			if (distanceMet || velocityMet) {
				direction = dx < 0 ? 'left' : 'right';
				velocityTriggered = !distanceMet && velocityMet;
			}
		} else if (axis === 'vertical') {
			const checkDist = isOverscroll ? Math.abs(overscrollY) : Math.abs(dy);
			const distanceMet = checkDist >= threshold;
			const velocityMet = velocityY >= config.velocityThreshold;
			if (distanceMet || velocityMet) {
				direction = dy < 0 ? 'up' : 'down';
				velocityTriggered = !distanceMet && velocityMet;
			}
		}

		onSwipeRef.value?.({ direction, velocityTriggered });
		reset();
	}

	function handleTouchCancel() {
		reset();
	}

	const bindRef = (el: HTMLElement | null) => {
		if (cleanup) {
			cleanup();
			cleanup = null;
		}
		currentEl = el;
		if (!el) return;

		el.addEventListener('touchstart', handleTouchStart, { passive: true });
		el.addEventListener('touchmove', handleTouchMove, { passive: false });
		el.addEventListener('touchend', handleTouchEnd, { passive: true });
		el.addEventListener('touchcancel', handleTouchCancel, { passive: true });

		cleanup = () => {
			el.removeEventListener('touchstart', handleTouchStart);
			el.removeEventListener('touchmove', handleTouchMove);
			el.removeEventListener('touchend', handleTouchEnd);
			el.removeEventListener('touchcancel', handleTouchCancel);
		};
	};

	onUnmounted(() => {
		cleanup?.();
	});

	// Prevent unused variable warning
	void currentEl;

	return { swipeState, bindRef };
}
