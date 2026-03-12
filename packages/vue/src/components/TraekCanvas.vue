<script setup lang="ts">
import { computed, ref, watch, type Component } from 'vue';
import { TraekEngine } from '@traek/core';
import type { Node, MessageNode, TraekEngineConfig } from '@traek/core';
import { useTraekEngine, useCreateTraekEngine } from '../composables/useTraekEngine.js';

export interface TraekCanvasProps {
	/** Provide an existing engine or let the canvas create one. */
	engine?: TraekEngine;
	config?: Partial<TraekEngineConfig>;
	/** Called when the user submits a message. */
	onSendMessage?: (input: string, userNode: MessageNode, action?: string | string[]) => void;
	/** Called whenever any node changes. */
	onNodesChanged?: () => void;
	/** Initial zoom scale (default 1). */
	initialScale?: number;
	/** Custom node component map: `{ myType: MyNodeComponent }`. */
	componentMap?: Record<string, Component>;
}

const props = withDefaults(defineProps<TraekCanvasProps>(), {
	initialScale: 1
});

const emit = defineEmits<{
	nodesChanged: [];
}>();

// Engine setup
const internalEngine = useCreateTraekEngine(props.config);
const activeEngine = computed(() => props.engine ?? internalEngine);
const { nodes, activeNodeId, pendingFocusNodeId } = useTraekEngine(activeEngine.value);

// Viewport state
const scale = ref(props.initialScale);
const offset = ref({ x: 0, y: 0 });
const inputValue = ref('');
const isPanning = ref(false);
const lastPointer = ref({ x: 0, y: 0 });
const containerRef = ref<HTMLDivElement | null>(null);

const gridStep = computed(() => props.config?.gridStep ?? 20);
const nodeWidth = computed(() => props.config?.nodeWidth ?? 350);

// Center on pending focus node
watch(pendingFocusNodeId, (nodeId) => {
	if (!nodeId) return;
	const engine = activeEngine.value;
	const node = engine.getNode(nodeId);
	if (!node?.metadata) {
		engine.clearPendingFocus();
		return;
	}
	const container = containerRef.value;
	if (container) {
		const { width, height } = container.getBoundingClientRect();
		const step = gridStep.value;
		offset.value = {
			x: width / 2 - node.metadata.x * step * scale.value,
			y: height / 2 - node.metadata.y * step * scale.value
		};
	}
	engine.clearPendingFocus();
});

// Watch node changes
watch(nodes, () => {
	props.onNodesChanged?.();
	emit('nodesChanged');
});

// Pan handlers
function onPointerDown(e: PointerEvent) {
	if (e.button !== 0) return;
	const target = e.target as HTMLElement;
	if (target.closest('button, input, textarea, [data-no-pan]')) return;
	isPanning.value = true;
	lastPointer.value = { x: e.clientX, y: e.clientY };
	(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
}

function onPointerMove(e: PointerEvent) {
	if (!isPanning.value) return;
	const dx = e.clientX - lastPointer.value.x;
	const dy = e.clientY - lastPointer.value.y;
	lastPointer.value = { x: e.clientX, y: e.clientY };
	offset.value = { x: offset.value.x + dx, y: offset.value.y + dy };
}

function onPointerUp() {
	isPanning.value = false;
}

function onWheel(e: WheelEvent) {
	e.preventDefault();
	const rect = containerRef.value?.getBoundingClientRect();
	if (!rect) return;
	const mouseX = e.clientX - rect.left;
	const mouseY = e.clientY - rect.top;
	const delta = -e.deltaY * 0.001;
	const newScale = Math.min(8, Math.max(0.05, scale.value * (1 + delta)));
	offset.value = {
		x: mouseX - (mouseX - offset.value.x) * (newScale / scale.value),
		y: mouseY - (mouseY - offset.value.y) * (newScale / scale.value)
	};
	scale.value = newScale;
}

// Submit message
function handleSubmit(e: Event) {
	e.preventDefault();
	const text = inputValue.value.trim();
	if (!text) return;
	const engine = activeEngine.value;
	const userNode = engine.addNode(text, 'user');
	inputValue.value = '';
	props.onSendMessage?.(text, userNode);
}

function getNodeStyle(node: Node) {
	return {
		position: 'absolute' as const,
		left: `${(node.metadata?.x ?? 0) * gridStep.value}px`,
		top: `${(node.metadata?.y ?? 0) * gridStep.value}px`,
		width: `${nodeWidth.value}px`,
		boxSizing: 'border-box' as const
	};
}

function getNodeComponent(node: Node): Component | null {
	return props.componentMap?.[node.type] ?? null;
}

function isNodeActive(node: Node): boolean {
	return activeNodeId.value === node.id;
}

function isNodeVisible(node: Node): boolean {
	return !activeEngine.value.isInCollapsedSubtree(node.id);
}

function activateNode(node: Node) {
	activeEngine.value.branchFrom(node.id);
}

const canvasTransform = computed(
	() => `translate(${offset.value.x}px, ${offset.value.y}px) scale(${scale.value})`
);

const zoomLabel = computed(() => `${Math.round(scale.value * 100)}%`);
</script>

<template>
	<div
		ref="containerRef"
		class="traek-canvas-container"
		:style="{
			position: 'relative',
			overflow: 'hidden',
			width: '100%',
			height: '100%',
			background: 'var(--traek-canvas-bg, #0d0d0d)',
			cursor: isPanning ? 'grabbing' : 'grab',
			userSelect: 'none'
		}"
		@pointerdown="onPointerDown"
		@pointermove="onPointerMove"
		@pointerup="onPointerUp"
		@wheel.prevent="onWheel"
	>
		<!-- Canvas layer with pan/zoom transform -->
		<div
			class="traek-canvas-layer"
			:style="{
				position: 'absolute',
				inset: 0,
				transform: canvasTransform,
				transformOrigin: '0 0',
				willChange: 'transform'
			}"
		>
			<!-- Render nodes -->
			<template v-for="node in nodes" :key="node.id">
				<div
					v-if="isNodeVisible(node)"
					:data-node-id="node.id"
					:style="getNodeStyle(node)"
					@click.stop="activateNode(node)"
				>
					<!-- Custom component -->
					<component
						:is="getNodeComponent(node)"
						v-if="getNodeComponent(node)"
						:node="node"
						:engine="activeEngine"
						:is-active="isNodeActive(node)"
					/>
					<!-- Default slot fallback -->
					<slot
						v-else
						name="node"
						:node="node"
						:engine="activeEngine"
						:is-active="isNodeActive(node)"
					>
						<!-- Built-in minimal text node -->
						<div
							:style="{
								borderRadius: '12px',
								border: `1px solid ${isNodeActive(node) ? 'var(--traek-accent, #0ff)' : 'var(--traek-border, rgba(255,255,255,0.1))'}`,
								background: 'var(--traek-node-bg, rgba(255,255,255,0.04))',
								padding: '12px',
								fontSize: '14px',
								color: 'var(--traek-text, rgba(255,255,255,0.9))',
								whiteSpace: 'pre-wrap',
								wordBreak: 'break-word'
							}"
						>
							<div
								:style="{
									fontSize: '11px',
									marginBottom: '8px',
									textTransform: 'capitalize',
									opacity: 0.5
								}"
							>
								{{ node.role }}
							</div>
							{{ (node as any).content ?? '' }}
						</div>
					</slot>
				</div>
			</template>
		</div>

		<!-- Input form -->
		<form
			data-no-pan
			:style="{
				position: 'absolute',
				bottom: 0,
				left: 0,
				right: 0,
				padding: '16px',
				background: 'linear-gradient(to top, var(--traek-canvas-bg, #0d0d0d) 60%, transparent)',
				display: 'flex',
				gap: '8px'
			}"
			@submit.prevent="handleSubmit"
		>
			<input
				v-model="inputValue"
				placeholder="Message…"
				:style="{
					flex: 1,
					padding: '10px 14px',
					borderRadius: '8px',
					border: '1px solid var(--traek-border, rgba(255,255,255,0.1))',
					background: 'var(--traek-input-bg, rgba(255,255,255,0.05))',
					color: 'var(--traek-text, #fff)',
					fontSize: '14px',
					outline: 'none'
				}"
				@keydown.enter.exact.prevent="handleSubmit"
			/>
			<button
				type="submit"
				:disabled="!inputValue.trim()"
				:style="{
					padding: '10px 20px',
					borderRadius: '8px',
					border: 'none',
					background: 'var(--traek-accent, #0ff)',
					color: '#000',
					fontWeight: 600,
					cursor: 'pointer',
					opacity: inputValue.trim() ? 1 : 0.4
				}"
			>
				Send
			</button>
		</form>

		<!-- Zoom controls -->
		<div
			data-no-pan
			:style="{
				position: 'absolute',
				top: '16px',
				right: '16px',
				display: 'flex',
				flexDirection: 'column',
				gap: '4px'
			}"
		>
			<button class="traek-zoom-btn" title="Zoom in" @click="scale = Math.min(8, scale * 1.2)">
				+
			</button>
			<button
				class="traek-zoom-btn"
				:style="{ fontSize: '10px' }"
				title="Reset zoom"
				@click="scale = 1"
			>
				{{ zoomLabel }}
			</button>
			<button class="traek-zoom-btn" title="Zoom out" @click="scale = Math.max(0.05, scale / 1.2)">
				−
			</button>
		</div>
	</div>
</template>

<style scoped>
.traek-zoom-btn {
	width: 32px;
	height: 32px;
	border-radius: 6px;
	border: 1px solid var(--traek-border, rgba(255, 255, 255, 0.1));
	background: var(--traek-surface, rgba(255, 255, 255, 0.05));
	color: var(--traek-text, #fff);
	cursor: pointer;
	font-size: 16px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.traek-zoom-btn:hover {
	background: var(--traek-surface-hover, rgba(255, 255, 255, 0.1));
}
</style>
