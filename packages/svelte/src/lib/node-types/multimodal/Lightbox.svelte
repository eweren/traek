<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import type { ImageEntry } from './types';

	let {
		images,
		startIndex = 0,
		onClose
	}: {
		images: ImageEntry[];
		startIndex?: number;
		onClose: () => void;
	} = $props();

	let currentIndex = $state(startIndex);
	let zoomLevel = $state(1);
	let dialogEl = $state<HTMLElement | null>(null);

	const current = $derived(images[currentIndex]);
	const hasNext = $derived(currentIndex < images.length - 1);
	const hasPrev = $derived(currentIndex > 0);

	function prev() {
		if (hasPrev) {
			currentIndex--;
			zoomLevel = 1;
		}
	}

	function next() {
		if (hasNext) {
			currentIndex++;
			zoomLevel = 1;
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') onClose();
		else if (e.key === 'ArrowLeft') prev();
		else if (e.key === 'ArrowRight') next();
		else if (e.key === '+' || e.key === '=') zoomLevel = Math.min(5, zoomLevel + 0.5);
		else if (e.key === '-') zoomLevel = Math.max(1, zoomLevel - 0.5);
	}

	function handleWheel(e: WheelEvent) {
		e.preventDefault();
		const delta = e.deltaY > 0 ? -0.25 : 0.25;
		zoomLevel = Math.max(1, Math.min(5, zoomLevel + delta));
	}

	$effect(() => {
		dialogEl?.focus();
	});
</script>

<svelte:window onkeydown={handleKeydown} />

<div
	class="lightbox-backdrop"
	role="dialog"
	aria-modal="true"
	aria-label="Image preview"
	bind:this={dialogEl}
	tabindex="-1"
	transition:fade={{ duration: 150 }}
	onmousedown={(e) => e.target === e.currentTarget && onClose()}
	onwheel={handleWheel}
>
	<div class="lightbox-content" transition:scale={{ duration: 150, start: 0.95 }}>
		<button class="lightbox-close" aria-label="Close preview" onclick={onClose}>×</button>

		{#if hasPrev}
			<button class="nav-btn nav-prev" aria-label="Previous image" onclick={prev}>‹</button>
		{/if}

		{#if hasNext}
			<button class="nav-btn nav-next" aria-label="Next image" onclick={next}>›</button>
		{/if}

		<div class="image-wrapper">
			<img
				src={current.src}
				alt={current.alt}
				style:transform="scale({zoomLevel})"
				class="lightbox-img"
			/>
		</div>

		{#if images.length > 1}
			<div class="dot-nav" role="tablist" aria-label="Image {currentIndex + 1} of {images.length}">
				{#each images as _, i (i)}
					<button
						class="dot"
						class:active={i === currentIndex}
						role="tab"
						aria-selected={i === currentIndex}
						aria-label="Image {i + 1}"
						onclick={() => {
							currentIndex = i;
							zoomLevel = 1;
						}}
					></button>
				{/each}
			</div>
		{/if}

		<div class="zoom-info" aria-live="polite" aria-label="Zoom: {Math.round(zoomLevel * 100)}%">
			{Math.round(zoomLevel * 100)}%
		</div>
	</div>
</div>

<style>
	.lightbox-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.9);
		z-index: 1000;
		display: flex;
		align-items: center;
		justify-content: center;
		outline: none;
	}

	.lightbox-content {
		position: relative;
		max-width: 90vw;
		max-height: 90vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
	}

	.lightbox-close {
		position: absolute;
		top: -44px;
		right: -8px;
		width: 44px;
		height: 44px;
		border: none;
		background: rgba(255, 255, 255, 0.1);
		color: #fff;
		font-size: 24px;
		border-radius: 50%;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 10;
	}

	.lightbox-close:hover {
		background: rgba(255, 255, 255, 0.2);
	}

	.lightbox-close:focus-visible {
		outline: 2px solid #00d8ff;
		outline-offset: 2px;
	}

	.image-wrapper {
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		max-width: 90vw;
		max-height: 80vh;
	}

	.lightbox-img {
		max-width: 90vw;
		max-height: 80vh;
		object-fit: contain;
		transition: transform 0.15s ease;
		transform-origin: center center;
	}

	@media (prefers-reduced-motion: reduce) {
		.lightbox-img {
			transition: none;
		}
	}

	.nav-btn {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		width: 44px;
		height: 44px;
		border: 1px solid rgba(255, 255, 255, 0.2);
		background: rgba(0, 0, 0, 0.5);
		color: #fff;
		font-size: 24px;
		border-radius: 50%;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 10;
	}

	.nav-prev {
		left: -56px;
	}

	.nav-next {
		right: -56px;
	}

	.nav-btn:hover {
		background: rgba(255, 255, 255, 0.15);
	}

	.nav-btn:focus-visible {
		outline: 2px solid #00d8ff;
		outline-offset: 2px;
	}

	.dot-nav {
		display: flex;
		gap: 6px;
		align-items: center;
	}

	.dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		border: none;
		background: rgba(255, 255, 255, 0.3);
		cursor: pointer;
		padding: 0;
		transition: background 0.15s;
	}

	.dot.active {
		background: #fff;
	}

	.dot:focus-visible {
		outline: 2px solid #00d8ff;
		outline-offset: 2px;
	}

	.zoom-info {
		font-size: 12px;
		color: rgba(255, 255, 255, 0.4);
		position: absolute;
		bottom: -32px;
		right: 0;
	}
</style>
