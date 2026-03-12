<script lang="ts">
	import { DefaultLoadingOverlay, ThemeProvider } from '@traek/svelte';
</script>

<ThemeProvider initialTheme="dark">
	<div class="overlay-frame">
		<DefaultLoadingOverlay />
	</div>
</ThemeProvider>

<style>
	.overlay-frame {
		position: relative;
		height: 160px;
		border-radius: 16px;
		overflow: hidden;
		background: radial-gradient(circle at top, #191919 0, #050505 60%, #000 100%);
		border: 1px solid rgba(255, 255, 255, 0.06);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
	}
</style>
