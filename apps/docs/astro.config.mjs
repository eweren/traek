import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';
import svelte from '@astrojs/svelte';
import vue from '@astrojs/vue';

export default defineConfig({
	integrations: [
		react(),
		svelte(),
		vue(),
		starlight({
			title: 'Træk',
			description: 'Spatial tree-chat UI for AI agents',
			head: [],
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/gettraek/traek' }],
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ label: 'Introduction', slug: 'getting-started/introduction' },
						{ label: 'Installation', slug: 'getting-started/installation' },
						{ label: 'Quick Start', slug: 'getting-started/quick-start' }
					]
				},
				{
					label: 'Frameworks',
					items: [
						{ label: 'Svelte', slug: 'frameworks/svelte' },
						{ label: 'React', slug: 'frameworks/react' },
						{ label: 'Vue', slug: 'frameworks/vue' },
						{ label: 'Vanilla JS / TypeScript', slug: 'frameworks/vanilla' }
					]
				},
				{
					label: 'API Reference',
					items: [
						{ label: 'TraekEngine (@traek/core)', slug: 'api/traek-engine' },
						{ label: 'TraekCanvas – Svelte', slug: 'api/traek-canvas-svelte' },
						{ label: 'TraekCanvas – React', slug: 'api/traek-canvas-react' },
						{ label: 'TraekCanvas – Vue', slug: 'api/traek-canvas-vue' },
						{ label: 'TextNode', slug: 'api/text-node' },
						{ label: 'Types', slug: 'api/types' }
					]
				},
				{
					label: 'Guides',
					items: [
						{ label: 'Custom Node Types', slug: 'guides/custom-nodes' },
						{ label: 'OpenAI Streaming', slug: 'guides/openai-streaming' },
						{ label: 'With SvelteKit', slug: 'guides/sveltekit' }
					]
				}
			]
		})
	]
});
