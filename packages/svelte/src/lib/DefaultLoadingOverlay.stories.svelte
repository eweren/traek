<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import DefaultLoadingOverlay from './DefaultLoadingOverlay.svelte';

	const { Story } = defineMeta({
		title: 'Atoms/DefaultLoadingOverlay',
		component: DefaultLoadingOverlay,
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component:
						'A loading overlay shown while the canvas initialises. Uses CSS custom properties (`--traek-overlay-*`) for full theme customisation.'
				}
			},
			layout: 'fullscreen'
		}
	});
</script>

<Story asChild name="Default">
	<div style="width: 400px; height: 250px; position: relative; overflow: hidden;">
		<DefaultLoadingOverlay />
	</div>
</Story>

<Story asChild name="Full screen">
	<div style="width: 100vw; height: 100vh; position: relative; overflow: hidden;">
		<DefaultLoadingOverlay />
	</div>
</Story>
