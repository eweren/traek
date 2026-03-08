import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';
import svelte from '@astrojs/svelte';
import vue from '@astrojs/vue';

export default defineConfig({
	site: 'https://gettraek.com',
	vite: {
		resolve: {
			dedupe: ['react', 'react-dom']
		}
	},
	integrations: [
		react(),
		svelte(),
		vue(),
		starlight({
			title: 'Træk',
			description:
				'Spatial, tree-structured AI chat UI library for Svelte, React, and Vue. Build branching, pannable conversation interfaces — not another linear chatbot.',
			head: [
				// Canonical base + charset
				{ tag: 'meta', attrs: { charset: 'utf-8' } },
				// Open Graph defaults (per-page og:title/description come from Starlight automatically)
				{
					tag: 'meta',
					attrs: { property: 'og:site_name', content: 'Træk' }
				},
				{
					tag: 'meta',
					attrs: { property: 'og:type', content: 'website' }
				},
				{
					tag: 'meta',
					attrs: {
						property: 'og:image',
						content: 'https://gettraek.com/og-image.png'
					}
				},
				{
					tag: 'meta',
					attrs: { property: 'og:image:width', content: '1200' }
				},
				{
					tag: 'meta',
					attrs: { property: 'og:image:height', content: '630' }
				},
				// Twitter / X card
				{
					tag: 'meta',
					attrs: { name: 'twitter:card', content: 'summary_large_image' }
				},
				{
					tag: 'meta',
					attrs: { name: 'twitter:site', content: '@gettraek' }
				},
				{
					tag: 'meta',
					attrs: {
						name: 'twitter:image',
						content: 'https://gettraek.com/og-image.png'
					}
				},
				// Additional SEO signals
				{
					tag: 'meta',
					attrs: {
						name: 'keywords',
						content:
							'ai chat ui, branching conversation ui, tree chat interface, react ai chat component, svelte ai chat, vue ai chat, spatial ai interface, llm chat ui library, canvas chat interface'
					}
				},
				{
					tag: 'meta',
					attrs: { name: 'author', content: 'Træk' }
				},
				// JSON-LD: SoftwareApplication structured data
				{
					tag: 'script',
					attrs: { type: 'application/ld+json' },
					content: JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'SoftwareApplication',
						name: 'Træk',
						applicationCategory: 'DeveloperApplication',
						operatingSystem: 'Any',
						url: 'https://gettraek.com',
						description:
							'Spatial, tree-structured AI chat UI library for Svelte, React, and Vue. Build branching, pannable conversation interfaces.',
						offers: {
							'@type': 'Offer',
							price: '0',
							priceCurrency: 'USD'
						},
						softwareVersion: '1.0',
						programmingLanguage: ['TypeScript', 'Svelte', 'React', 'Vue']
					})
				}
			],
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
						{ label: 'Interactive Examples', slug: 'guides/examples' },
						{ label: 'Cookbook', slug: 'guides/cookbook' },
						{ label: 'Starter Templates', slug: 'guides/starter-templates' },
						{ label: 'Migration from Linear Chat', slug: 'guides/migration-from-linear-chat' },
						{ label: 'Advanced Theming', slug: 'guides/advanced-theming' },
						{ label: 'Plugin Development', slug: 'guides/plugin-development' },
						{ label: 'Publishing to the Marketplace', slug: 'guides/marketplace-submission' },
						{ label: 'Custom Node Types', slug: 'guides/custom-nodes' },
						{ label: 'Internationalization (i18n)', slug: 'guides/internationalization' },
						{ label: 'OpenAI Streaming', slug: 'guides/openai-streaming' },
						{ label: 'With SvelteKit', slug: 'guides/sveltekit' }
					]
				}
			]
		})
	]
});
