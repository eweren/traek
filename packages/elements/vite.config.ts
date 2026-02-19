import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
	plugins: [svelte()],
	build: {
		lib: {
			entry: 'src/index.ts',
			formats: ['es'],
			fileName: 'index'
		},
		cssCodeSplit: false
	}
});
