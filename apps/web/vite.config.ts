import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	build: {
		rollupOptions: {
			external: (id) => id.startsWith('lib0/')
		}
	},
	optimizeDeps: {
		exclude: ['traek']
	}
});
