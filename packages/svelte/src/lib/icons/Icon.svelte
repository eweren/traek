<script lang="ts">
	import { ICONS, type IconName } from './icons.js';

	let {
		name,
		size = 24,
		strokeWidth = 2,
		class: className = '',
		'aria-label': ariaLabel,
		'aria-hidden': ariaHidden
	}: {
		name: IconName;
		size?: number;
		strokeWidth?: number;
		class?: string;
		'aria-label'?: string;
		'aria-hidden'?: boolean | 'true' | 'false';
	} = $props();

	const def = $derived(ICONS[name]);
	const isHidden = $derived(ariaHidden ?? (ariaLabel ? undefined : true));
</script>

{#if def}
	<svg
		viewBox={def.viewBox ?? '0 0 24 24'}
		width={size}
		height={size}
		fill={def.filled ? 'currentColor' : 'none'}
		stroke={def.filled ? 'none' : 'currentColor'}
		stroke-width={strokeWidth}
		stroke-linecap="round"
		stroke-linejoin="round"
		class={className}
		aria-label={ariaLabel}
		aria-hidden={isHidden}
		role={ariaLabel ? 'img' : undefined}
	>
		{#each def.paths as d, i (i)}
			<path {d} />
		{/each}
	</svg>
{/if}
