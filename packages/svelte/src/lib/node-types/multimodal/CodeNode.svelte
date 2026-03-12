<script lang="ts">
	import { onMount } from 'svelte';
	import type { MessageNode } from '../../TraekEngine.svelte';
	import { codeNodeDataSchema, COMMON_LANGUAGES } from './types';

	let { node }: { node: MessageNode } = $props();

	const data = $derived.by(() => {
		const result = codeNodeDataSchema.safeParse(node.data);
		return result.success ? result.data : null;
	});

	let highlighted = $state('');
	let copied = $state(false);
	let showLangDropdown = $state(false);
	let langSearch = $state('');
	let langInputEl = $state<HTMLInputElement | null>(null);

	const language = $derived(data?.language ?? 'plaintext');
	const code = $derived(data?.code ?? '');
	const lines = $derived(code.split('\n'));
	const showLineNumbers = $derived(lines.length >= 3);
	const filteredLanguages = $derived(
		COMMON_LANGUAGES.filter((l) => l.includes(langSearch.toLowerCase()))
	);

	onMount(async () => {
		try {
			// Dynamic import to avoid SSR issues
			const hljs = await import('highlight.js/lib/core');
			const langs: Record<string, () => Promise<{ default: unknown }>> = {
				typescript: () => import('highlight.js/lib/languages/typescript'),
				javascript: () => import('highlight.js/lib/languages/javascript'),
				python: () => import('highlight.js/lib/languages/python'),
				bash: () => import('highlight.js/lib/languages/bash'),
				sql: () => import('highlight.js/lib/languages/sql'),
				json: () => import('highlight.js/lib/languages/json'),
				css: () => import('highlight.js/lib/languages/css'),
				xml: () => import('highlight.js/lib/languages/xml'), // html
				rust: () => import('highlight.js/lib/languages/rust'),
				go: () => import('highlight.js/lib/languages/go'),
				java: () => import('highlight.js/lib/languages/java'),
				cs: () => import('highlight.js/lib/languages/csharp')
			};
			const langKey = language === 'html' ? 'xml' : language === 'csharp' ? 'cs' : language;
			const loader = langs[langKey];
			if (loader) {
				const mod = await loader();
				hljs.default.registerLanguage(langKey, (mod as { default: unknown }).default as never);
			}
			const result = hljs.default.highlight(code, { language: langKey, ignoreIllegals: true });
			highlighted = result.value;
		} catch {
			// If highlight.js fails, fall back to plain text
			highlighted = '';
		}
	});

	async function copy() {
		try {
			await navigator.clipboard.writeText(code);
			copied = true;
			setTimeout(() => (copied = false), 2000);
		} catch {
			// clipboard API may be unavailable
		}
	}

	function openLangDropdown() {
		showLangDropdown = true;
		langSearch = '';
		setTimeout(() => langInputEl?.focus(), 0);
	}

	function selectLanguage(lang: string) {
		// Since we can't modify node.data directly, emit a change via a custom event
		// For now, update via a custom event pattern
		const event = new CustomEvent('traek:node-data-update', {
			bubbles: true,
			detail: { id: node.id, data: { ...data, language: lang } }
		});
		document.dispatchEvent(event);
		showLangDropdown = false;
	}
</script>

<div class="code-node">
	{#if !data}
		<div class="invalid" role="alert">Invalid code data</div>
	{:else}
		<header class="code-header">
			<div class="lang-wrapper">
				<button
					class="lang-btn"
					aria-label="Programming language: {language}"
					aria-expanded={showLangDropdown}
					aria-haspopup="listbox"
					onclick={openLangDropdown}
				>
					{language} ▾
				</button>
				{#if showLangDropdown}
					<div class="lang-dropdown" role="listbox" aria-label="Select language">
						<input
							bind:this={langInputEl}
							type="text"
							class="lang-search"
							placeholder="Search languages…"
							bind:value={langSearch}
							onkeydown={(e) => e.key === 'Escape' && (showLangDropdown = false)}
							aria-label="Search languages"
						/>
						{#each filteredLanguages as lang (lang)}
							<button
								class="lang-option"
								class:active={lang === language}
								role="option"
								aria-selected={lang === language}
								onclick={() => selectLanguage(lang)}
							>
								{lang}
							</button>
						{/each}
					</div>
				{/if}
			</div>

			{#if data.filename}
				<span class="filename">{data.filename}</span>
			{/if}

			<button class="copy-btn" aria-label="Copy code" onclick={copy}>
				{copied ? 'Copied!' : 'Copy'}
			</button>
		</header>

		<div class="code-wrapper" tabindex="0" aria-label="Code block">
			{#if showLineNumbers}
				<div class="line-numbers" aria-hidden="true">
					{#each lines as _, i (i)}
						<span class="line-num">{i + 1}</span>
					{/each}
				</div>
			{/if}
			<!-- eslint-disable svelte/no-at-html-tags -->
			<pre class="code-pre" aria-label="{language} code"><code class="code-content"
					>{#if highlighted}{@html highlighted}{:else}{code}{/if}</code
				></pre>
			<!-- eslint-enable svelte/no-at-html-tags -->
		</div>
	{/if}
</div>

{#if showLangDropdown}
	<div
		class="dropdown-overlay"
		onmousedown={() => (showLangDropdown = false)}
		role="presentation"
	></div>
{/if}

<style>
	.code-node {
		background: var(--traek-node-bg, #1e1e1e);
		border: 1px solid var(--traek-node-border, #2a2a2a);
		border-radius: 8px;
		overflow: hidden;
		min-width: 300px;
		max-width: 520px;
	}

	.code-header {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 6px 10px;
		background: rgba(255, 255, 255, 0.04);
		border-bottom: 1px solid var(--traek-node-border, #2a2a2a);
	}

	.lang-wrapper {
		position: relative;
	}

	.lang-btn {
		background: transparent;
		border: none;
		color: var(--traek-thought-header-accent, #888);
		font-size: 12px;
		cursor: pointer;
		padding: 2px 4px;
		border-radius: 3px;
	}

	.lang-btn:hover {
		background: rgba(255, 255, 255, 0.06);
		color: var(--traek-node-text, #ddd);
	}

	.lang-btn:focus-visible {
		outline: 2px solid var(--traek-input-button-bg, #00d8ff);
		outline-offset: 2px;
	}

	.lang-dropdown {
		position: absolute;
		top: 26px;
		left: 0;
		z-index: 100;
		background: var(--traek-node-bg, #1e1e1e);
		border: 1px solid var(--traek-node-border, #333);
		border-radius: 6px;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
		width: 160px;
		max-height: 240px;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
	}

	.lang-search {
		background: rgba(255, 255, 255, 0.05);
		border: none;
		border-bottom: 1px solid var(--traek-node-border, #333);
		color: var(--traek-node-text, #ddd);
		font-size: 12px;
		padding: 6px 10px;
		outline: none;
	}

	.lang-option {
		background: transparent;
		border: none;
		color: var(--traek-node-text, #bbb);
		font-size: 12px;
		padding: 6px 10px;
		text-align: left;
		cursor: pointer;
	}

	.lang-option:hover,
	.lang-option.active {
		background: rgba(255, 255, 255, 0.06);
		color: var(--traek-input-button-bg, #00d8ff);
	}

	.filename {
		font-size: 12px;
		color: var(--traek-thought-header-accent, #777);
		font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.copy-btn {
		background: transparent;
		border: 1px solid var(--traek-node-border, #333);
		color: var(--traek-thought-header-accent, #777);
		font-size: 11px;
		padding: 2px 8px;
		border-radius: 4px;
		cursor: pointer;
		white-space: nowrap;
		margin-left: auto;
		flex-shrink: 0;
	}

	.copy-btn:hover {
		color: var(--traek-input-button-bg, #00d8ff);
		border-color: var(--traek-input-button-bg, #00d8ff);
	}

	.copy-btn:focus-visible {
		outline: 2px solid var(--traek-input-button-bg, #00d8ff);
		outline-offset: 2px;
	}

	.code-wrapper {
		display: flex;
		overflow: auto;
		max-height: 400px;
		outline: none;
	}

	.code-wrapper:focus-visible {
		outline: 2px solid var(--traek-input-button-bg, #00d8ff);
		outline-offset: -2px;
	}

	.line-numbers {
		display: flex;
		flex-direction: column;
		padding: 12px 0;
		background: rgba(0, 0, 0, 0.2);
		border-right: 1px solid var(--traek-node-border, #2a2a2a);
		user-select: none;
		flex-shrink: 0;
	}

	.line-num {
		display: block;
		font-size: 12px;
		line-height: 1.6;
		color: rgba(255, 255, 255, 0.2);
		text-align: right;
		padding: 0 10px;
		font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
	}

	.code-pre {
		margin: 0;
		padding: 12px 16px;
		font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
		font-size: 13px;
		line-height: 1.6;
		tab-size: 2;
		overflow: visible;
		background: transparent;
		flex: 1;
		min-width: 0;
	}

	.code-content {
		color: #e4e4e7;
		font-family: inherit;
		font-size: inherit;
	}

	/* highlight.js theme overrides for dark background */
	:global(.code-content .hljs-keyword) {
		color: #c792ea;
	}
	:global(.code-content .hljs-string) {
		color: #c3e88d;
	}
	:global(.code-content .hljs-comment) {
		color: #546e7a;
		font-style: italic;
	}
	:global(.code-content .hljs-number) {
		color: #f78c6c;
	}
	:global(.code-content .hljs-function) {
		color: #82aaff;
	}
	:global(.code-content .hljs-title) {
		color: #82aaff;
	}
	:global(.code-content .hljs-built_in) {
		color: #00d8ff;
	}
	:global(.code-content .hljs-type) {
		color: #ffcb6b;
	}

	.invalid {
		padding: 12px;
		font-size: 12px;
		color: #ef4444;
	}

	.dropdown-overlay {
		position: fixed;
		inset: 0;
		z-index: 99;
	}
</style>
