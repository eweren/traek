<script lang="ts">
	import { onMount } from 'svelte';
	import type { LayoutData } from './$types.js';

	let { data }: { data: LayoutData } = $props();

	// FAQ accordion
	let openFaq = $state<number | null>(null);
	function toggleFaq(i: number) {
		openFaq = openFaq === i ? null : i;
	}

	// Comparison section toggle
	let compareTab = $state<'linear' | 'spatial'>('linear');

	// Pause animated demo on reduced-motion
	let prefersReducedMotion = $state(false);
	onMount(() => {
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		prefersReducedMotion = mq.matches;
		mq.addEventListener('change', (e) => (prefersReducedMotion = e.matches));
	});

	const faqs = [
		{
			q: 'What is BYOK?',
			a: 'BYOK stands for Bring Your Own Key. You connect your own OpenAI or Anthropic API key. Traek never stores or proxies your key — it stays in your browser and goes directly to the AI provider.'
		},
		{
			q: 'Is my data safe?',
			a: 'On the Free plan, all conversations are stored locally in your browser — we never see them. Pro subscribers get optional cloud sync with encryption at rest. Your API key is encrypted in your session and never logged.'
		},
		{
			q: 'When does it launch?',
			a: 'We are targeting a public launch in Q2 2026. Waitlist members get early access first, with a 30-day free Pro trial on signup.'
		},
		{
			q: 'What models does it support?',
			a: 'Any model available through your OpenAI or Anthropic API key — GPT-4o, o1, Claude 3.5 Sonnet, Claude 3 Opus, and more. We support streaming and extended thinking.'
		},
		{
			q: 'Can I use it for free?',
			a: 'Yes. The Free tier includes 5 saved conversations with the full canvas experience — no credit card required. Upgrade to Pro for unlimited cloud-synced conversations.'
		}
	];

	const testimonials = [
		{
			quote:
				"Finally. I've been wanting this for AI chats since GPT-2. The branching is exactly how my brain works when exploring a problem.",
			name: 'Marcus T.',
			role: 'Staff Engineer'
		},
		{
			quote:
				'We use Traek for design reviews — drop screenshots in, branch off feedback threads. It changed how our team reasons together.',
			name: 'Priya K.',
			role: 'Product Designer'
		},
		{
			quote:
				'The canvas metaphor makes sense. I can finally see the shape of a conversation, not just scroll through a feed.',
			name: 'Jordan L.',
			role: 'Independent Researcher'
		},
		{
			quote:
				'BYOK + local storage + spatial canvas. Someone finally got all three right. Been using it daily since the beta.',
			name: 'Alex R.',
			role: 'ML Engineer'
		}
	];
</script>

<svelte:head>
	<title>Træk Playground — Spatial, Branching AI Conversations</title>
	<meta
		name="description"
		content="Explore AI conversations as a branching tree, not a linear thread. Træk Playground gives you a spatial canvas to branch, compare, and share AI chats. BYOK — bring your own OpenAI or Anthropic key."
	/>
	<meta
		name="keywords"
		content="ai chat canvas, branching ai conversation, spatial chat ui, byok ai chat, tree structured chat, compare ai responses"
	/>
	<meta name="author" content="Træk" />
	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://play.gettraek.com/" />
	<meta property="og:title" content="Træk Playground — Spatial, Branching AI Conversations" />
	<meta
		property="og:description"
		content="Explore AI conversations as a branching tree, not a linear thread. Branch, compare, and share AI chats on a spatial canvas. BYOK — start in seconds."
	/>
	<meta property="og:image" content="https://gettraek.com/og-image.png" />
	<meta property="og:site_name" content="Træk" />
	<!-- Twitter / X -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@gettraek" />
	<meta name="twitter:title" content="Træk Playground — Spatial, Branching AI Conversations" />
	<meta
		name="twitter:description"
		content="Explore AI conversations as a branching tree, not a linear thread. BYOK — bring your own OpenAI or Anthropic key."
	/>
	<meta name="twitter:image" content="https://gettraek.com/og-image.png" />
	<!-- Structured data -->
	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "WebApplication",
			"name": "Træk Playground",
			"url": "https://play.gettraek.com",
			"description": "Spatial, branching AI conversation canvas. Branch, compare and share AI chats. Bring your own OpenAI or Anthropic API key.",
			"applicationCategory": "ProductivityApplication",
			"operatingSystem": "Any",
			"offers": {
				"@type": "Offer",
				"price": "0",
				"priceCurrency": "USD"
			}
		}
	</script>
</svelte:head>

<div class="page">
	<!-- Navigation -->
	<nav class="nav">
		<a class="logo" href="/">
			<span class="logo-mark" aria-hidden="true">⟨t⟩</span>
			<span class="logo-main">træk</span>
		</a>
		<div class="nav-links">
			<a href="https://docs.gettraek.com" class="nav-link" rel="noreferrer" target="_blank">Docs</a>
			<a href="https://github.com/gettraek/traek" class="nav-link" rel="noreferrer" target="_blank"
				>GitHub</a
			>
			{#if data.user}
				<a href="/app" class="btn btn-primary btn-sm">Open App</a>
			{:else}
				<a href="/auth/signin" class="btn btn-primary btn-sm">Try free</a>
			{/if}
		</div>
	</nav>

	<!-- Hero -->
	<section class="hero">
		<div class="hero-content">
			<div class="hero-eyebrow">
				<span class="eyebrow-dot" aria-hidden="true"></span>
				Spatial AI Canvas · Now in Beta
			</div>

			<h1>
				Conversations<br />
				have<span class="h1-accent"> shape.</span>
			</h1>

			<p class="hero-sub">
				Branch any message. Pan the canvas. Compare responses side by side. Traek is the AI
				interface that maps how ideas actually develop.
			</p>

			{#if data.user}
				<div class="hero-actions">
					<a href="/app" class="btn btn-primary btn-large">Open Playground</a>
				</div>
			{:else}
				<div class="hero-actions">
					<a href="/auth/signin" class="btn btn-primary btn-large">
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2.5"
							stroke-linecap="round"
							stroke-linejoin="round"
							aria-hidden="true"
						>
							<polygon points="5 3 19 12 5 21 5 3" />
						</svg>
						Start for free
					</a>
					<a href="/auth/signin" class="btn btn-ghost btn-large">Sign in</a>
				</div>
				<p class="hero-note">No credit card required &middot; 5 conversations free</p>
			{/if}

			<div class="hero-stats">
				<div class="stat">
					<span class="stat-value">BYOK</span>
					<span class="stat-label">Bring your key</span>
				</div>
				<div class="stat-div" aria-hidden="true"></div>
				<div class="stat">
					<span class="stat-value">∞</span>
					<span class="stat-label">Branches per chat</span>
				</div>
				<div class="stat-div" aria-hidden="true"></div>
				<div class="stat">
					<span class="stat-value">0</span>
					<span class="stat-label">Data sent to us</span>
				</div>
			</div>
		</div>

		<!-- Animated Canvas Demo -->
		<div class="hero-demo" aria-hidden="true">
			<div class="demo-chrome">
				<div class="demo-chrome-bar">
					<span class="chrome-dot chrome-red"></span>
					<span class="chrome-dot chrome-yellow"></span>
					<span class="chrome-dot chrome-green"></span>
					<span class="chrome-url">play.gettraek.com/app</span>
				</div>
				<div class="demo-canvas" class:paused={prefersReducedMotion}>
					<!-- Dot grid background -->
					<svg class="demo-grid" viewBox="0 0 480 360" aria-hidden="true">
						{#each Array(12) as _, row}
							{#each Array(16) as _, col}
								<circle cx={col * 32 + 8} cy={row * 32 + 8} r="1" fill="rgba(255,255,255,0.06)" />
							{/each}
						{/each}
					</svg>

					<!-- Connection lines -->
					<svg class="demo-connections" viewBox="0 0 480 360" aria-hidden="true">
						<!-- Root → Left branch -->
						<path
							class="conn-line conn-line-1"
							d="M240 120 C240 155, 140 155, 140 175"
							stroke="rgba(0,216,255,0.35)"
							stroke-width="1.5"
							fill="none"
							stroke-dasharray="200"
							stroke-dashoffset="200"
						/>
						<!-- Root → Right branch -->
						<path
							class="conn-line conn-line-2"
							d="M240 120 C240 155, 340 155, 340 175"
							stroke="rgba(0,255,163,0.35)"
							stroke-width="1.5"
							fill="none"
							stroke-dasharray="200"
							stroke-dashoffset="200"
						/>
						<!-- Left → Left-child -->
						<path
							class="conn-line conn-line-3"
							d="M140 240 L140 270"
							stroke="rgba(0,216,255,0.25)"
							stroke-width="1.5"
							fill="none"
							stroke-dasharray="60"
							stroke-dashoffset="60"
						/>
						<!-- Right → Right-child -->
						<path
							class="conn-line conn-line-4"
							d="M340 240 L340 270"
							stroke="rgba(0,255,163,0.25)"
							stroke-width="1.5"
							fill="none"
							stroke-dasharray="60"
							stroke-dashoffset="60"
						/>
					</svg>

					<!-- Root node (user prompt) -->
					<div class="demo-node demo-node-root node-appear-1">
						<div class="node-role node-role-user">You</div>
						<div class="node-bar node-bar-full"></div>
						<div class="node-bar node-bar-short"></div>
					</div>

					<!-- Branch label -->
					<div class="branch-hint branch-hint-left node-appear-2">⎇ Branch</div>

					<!-- Left branch node -->
					<div class="demo-node demo-node-left node-appear-2">
						<div class="node-role node-role-ai">AI · Path A</div>
						<div class="node-bar node-bar-full"></div>
						<div class="node-bar node-bar-medium"></div>
						<div class="node-bar node-bar-short"></div>
					</div>

					<!-- Right branch node -->
					<div class="demo-node demo-node-right node-appear-3">
						<div class="node-role node-role-ai node-role-alt">AI · Path B</div>
						<div class="node-bar node-bar-full node-bar-lime"></div>
						<div class="node-bar node-bar-medium node-bar-lime-soft"></div>
						<div class="node-bar node-bar-short node-bar-lime-soft"></div>
					</div>

					<!-- Left leaf (streaming) -->
					<div class="demo-node demo-node-left-child node-appear-4">
						<div class="node-role node-role-user">You</div>
						<div class="node-bar node-bar-medium"></div>
					</div>

					<!-- Right leaf (streaming) -->
					<div class="demo-node demo-node-right-child node-appear-5">
						<div class="node-role node-role-ai node-role-alt">AI · streaming</div>
						<div class="node-bar node-bar-full node-bar-lime"></div>
						<div class="typing-dots">
							<span></span><span></span><span></span>
						</div>
					</div>

					<!-- Active indicator -->
					<div class="demo-active-label node-appear-5">● Live</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Social proof bar -->
	<div class="proof-bar">
		<div class="proof-bar-inner">
			<div class="proof-item">
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="currentColor"
					aria-hidden="true"
					class="proof-icon"
				>
					<path
						d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
					/>
				</svg>
				<strong>Open source</strong>
				<span class="proof-sep">·</span>
				<span class="proof-muted">MIT licensed</span>
			</div>
			<div class="proof-div" aria-hidden="true"></div>
			<div class="proof-item">
				<svg
					width="15"
					height="15"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
					class="proof-icon"
				>
					<path
						d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
					/>
				</svg>
				<strong>4.9 / 5</strong>
				<span class="proof-sep">·</span>
				<span class="proof-muted">Early-access rating</span>
			</div>
			<div class="proof-div" aria-hidden="true"></div>
			<div class="proof-item">
				<svg
					width="15"
					height="15"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
					class="proof-icon"
				>
					<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
					<circle cx="9" cy="7" r="4" />
					<path d="M23 21v-2a4 4 0 0 0-3-3.87" />
					<path d="M16 3.13a4 4 0 0 1 0 7.75" />
				</svg>
				<strong>2,400+</strong>
				<span class="proof-sep">·</span>
				<span class="proof-muted">Developers on waitlist</span>
			</div>
			<div class="proof-div" aria-hidden="true"></div>
			<div class="proof-item proof-item-models">
				<span class="proof-muted">Works with</span>
				<span class="model-badge">GPT-4o</span>
				<span class="model-badge">Claude 3.5</span>
				<span class="model-badge">o1</span>
				<span class="model-badge model-badge-more">+more</span>
			</div>
		</div>
	</div>

	<!-- Problem / Comparison Section -->
	<section class="compare-section">
		<div class="compare-inner">
			<div class="compare-header">
				<div class="section-eyebrow">The problem</div>
				<h2 class="section-title">Linear chat loses your thinking.</h2>
				<p class="section-sub">
					Every time you explore a different angle, you lose context, start over, or juggle tabs.
					Traek keeps every branch of thought on the same canvas.
				</p>
			</div>

			<div class="compare-tabs" role="tablist">
				<button
					role="tab"
					class="compare-tab"
					class:compare-tab-active={compareTab === 'linear'}
					aria-selected={compareTab === 'linear'}
					onclick={() => (compareTab = 'linear')}
				>
					<span class="tab-dot tab-dot-bad" aria-hidden="true"></span>
					Linear chat
				</button>
				<button
					role="tab"
					class="compare-tab"
					class:compare-tab-active={compareTab === 'spatial'}
					aria-selected={compareTab === 'spatial'}
					onclick={() => (compareTab = 'spatial')}
				>
					<span class="tab-dot tab-dot-good" aria-hidden="true"></span>
					Traek canvas
				</button>
			</div>

			{#if compareTab === 'linear'}
				<div class="compare-panel compare-panel-linear" role="tabpanel">
					<div class="linear-demo">
						<div class="linear-msg linear-user">
							<span class="msg-avatar msg-avatar-user">U</span>
							<div class="msg-bubble">What's the best architecture for this service?</div>
						</div>
						<div class="linear-msg linear-ai">
							<span class="msg-avatar msg-avatar-ai">AI</span>
							<div class="msg-bubble">
								I'd recommend a microservices approach with event-driven messaging…
							</div>
						</div>
						<div class="linear-msg linear-user">
							<span class="msg-avatar msg-avatar-user">U</span>
							<div class="msg-bubble">What about monolith-first?</div>
						</div>
						<div class="linear-msg linear-ai msg-buried">
							<span class="msg-avatar msg-avatar-ai">AI</span>
							<div class="msg-bubble">
								That's valid too. Based on what you said earlier about scale…
								<span class="msg-lost-badge">⚠ Context drift</span>
							</div>
						</div>
						<div class="linear-msg linear-user">
							<span class="msg-avatar msg-avatar-user">U</span>
							<div class="msg-bubble">Can we go back to the first approach and compare?</div>
						</div>
						<div class="linear-msg linear-ai msg-lost">
							<span class="msg-avatar msg-avatar-ai">AI</span>
							<div class="msg-bubble">I don't have full context from earlier in the thread…</div>
						</div>
						<div class="linear-lost-note">↑ Scroll up, copy-paste, start over. Every time.</div>
					</div>
				</div>
			{:else}
				<div class="compare-panel compare-panel-spatial" role="tabpanel">
					<div class="spatial-demo">
						<div class="spatial-canvas-bg" aria-hidden="true">
							<svg viewBox="0 0 600 320" class="spatial-svg">
								<!-- Root → Left -->
								<path
									d="M300 70 C300 105, 160 105, 160 130"
									stroke="rgba(0,216,255,0.4)"
									stroke-width="1.5"
									fill="none"
									stroke-dasharray="5 4"
								/>
								<!-- Root → Right -->
								<path
									d="M300 70 C300 105, 440 105, 440 130"
									stroke="rgba(0,255,163,0.4)"
									stroke-width="1.5"
									fill="none"
									stroke-dasharray="5 4"
								/>

								<!-- Root node -->
								<rect
									x="220"
									y="20"
									width="160"
									height="50"
									rx="10"
									fill="#1a1a1a"
									stroke="rgba(0,216,255,0.5)"
									stroke-width="1.5"
								/>
								<rect x="232" y="34" width="80" height="7" rx="3.5" fill="rgba(0,216,255,0.5)" />
								<rect x="232" y="45" width="56" height="5" rx="2.5" fill="rgba(255,255,255,0.18)" />
								<text
									x="352"
									y="41"
									font-size="9"
									fill="rgba(0,216,255,0.7)"
									font-family="monospace">You</text
								>

								<!-- Left node -->
								<rect
									x="80"
									y="130"
									width="160"
									height="60"
									rx="10"
									fill="#1a1a1a"
									stroke="rgba(0,216,255,0.35)"
									stroke-width="1.5"
								/>
								<rect x="92" y="144" width="96" height="7" rx="3.5" fill="rgba(255,255,255,0.35)" />
								<rect x="92" y="155" width="72" height="5" rx="2.5" fill="rgba(255,255,255,0.18)" />
								<rect x="92" y="164" width="52" height="5" rx="2.5" fill="rgba(255,255,255,0.12)" />
								<text
									x="200"
									y="148"
									font-size="8"
									fill="rgba(0,216,255,0.6)"
									font-family="monospace">Microservices</text
								>

								<!-- Right node -->
								<rect
									x="360"
									y="130"
									width="160"
									height="60"
									rx="10"
									fill="#1a1a1a"
									stroke="rgba(0,255,163,0.4)"
									stroke-width="1.5"
								/>
								<rect x="372" y="144" width="96" height="7" rx="3.5" fill="rgba(0,255,163,0.4)" />
								<rect x="372" y="155" width="72" height="5" rx="2.5" fill="rgba(0,255,163,0.2)" />
								<rect x="372" y="164" width="52" height="5" rx="2.5" fill="rgba(0,255,163,0.12)" />
								<text
									x="480"
									y="148"
									font-size="8"
									fill="rgba(0,255,163,0.7)"
									font-family="monospace">Monolith-first</text
								>

								<!-- Left child -->
								<path
									d="M160 190 L160 230"
									stroke="rgba(0,216,255,0.25)"
									stroke-width="1.5"
									fill="none"
									stroke-dasharray="4 3"
								/>
								<rect
									x="80"
									y="230"
									width="160"
									height="45"
									rx="10"
									fill="#141414"
									stroke="rgba(0,216,255,0.2)"
									stroke-width="1"
								/>
								<rect x="92" y="244" width="80" height="6" rx="3" fill="rgba(255,255,255,0.2)" />
								<rect x="92" y="254" width="60" height="5" rx="2.5" fill="rgba(255,255,255,0.1)" />
								<text
									x="200"
									y="248"
									font-size="8"
									fill="rgba(0,216,255,0.5)"
									font-family="monospace">You</text
								>

								<!-- Right child -->
								<path
									d="M440 190 L440 230"
									stroke="rgba(0,255,163,0.25)"
									stroke-width="1.5"
									fill="none"
									stroke-dasharray="4 3"
								/>
								<rect
									x="360"
									y="230"
									width="160"
									height="45"
									rx="10"
									fill="#141414"
									stroke="rgba(0,255,163,0.25)"
									stroke-width="1"
								/>
								<rect x="372" y="244" width="80" height="6" rx="3" fill="rgba(0,255,163,0.25)" />
								<rect x="372" y="254" width="60" height="5" rx="2.5" fill="rgba(0,255,163,0.12)" />
								<text
									x="480"
									y="248"
									font-size="8"
									fill="rgba(0,255,163,0.6)"
									font-family="monospace">You</text
								>

								<!-- Labels -->
								<text
									x="220"
									y="76"
									font-size="9"
									fill="rgba(255,255,255,0.3)"
									font-family="monospace">⎇ branch from here</text
								>
							</svg>
						</div>
						<div class="spatial-note">
							Every branch preserves full context. Compare both paths simultaneously.
						</div>
					</div>
				</div>
			{/if}
		</div>
	</section>

	<!-- Features -->
	<section class="features">
		<div class="section-eyebrow">What you get</div>
		<h2 class="section-title">Built for the way AI actually thinks.</h2>

		<div class="feature-grid">
			<div class="feature-card">
				<div class="feature-icon">
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<line x1="6" y1="3" x2="6" y2="15" />
						<circle cx="18" cy="6" r="3" />
						<circle cx="6" cy="18" r="3" />
						<path d="M18 9a9 9 0 0 1-9 9" />
					</svg>
				</div>
				<h3>Branch anywhere</h3>
				<p>
					Fork a conversation from any node. Explore alternative framings without losing your
					thread.
				</p>
			</div>

			<div class="feature-card">
				<div class="feature-icon">
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<circle cx="8" cy="12" r="3" />
						<circle cx="20" cy="8" r="3" />
						<circle cx="20" cy="16" r="3" />
						<path d="M10.7 11.1L17.3 8.9M10.7 12.9L17.3 15.1" />
					</svg>
				</div>
				<h3>Compare branches</h3>
				<p>Run the same prompt two ways and see the responses side by side on the canvas.</p>
			</div>

			<div class="feature-card">
				<div class="feature-icon">
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
						<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
					</svg>
				</div>
				<h3>Share instantly</h3>
				<p>
					Public read-only links to any conversation or branch. One click to share your thinking.
				</p>
			</div>

			<div class="feature-card">
				<div class="feature-icon">
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
						<path d="M7 11V7a5 5 0 0 1 10 0v4" />
					</svg>
				</div>
				<h3>Your key, your data</h3>
				<p>
					Use your OpenAI or Anthropic API key. Encrypted at rest. Your conversations stay private.
				</p>
			</div>

			<div class="feature-card">
				<div class="feature-icon">
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
					</svg>
				</div>
				<h3>Thought nodes</h3>
				<p>Model reasoning stays visible in collapsible panels — never buried, never in the way.</p>
			</div>

			<div class="feature-card">
				<div class="feature-icon">
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
						<polyline points="7 10 12 15 17 10" />
						<line x1="12" y1="15" x2="12" y2="3" />
					</svg>
				</div>
				<h3>Export anywhere</h3>
				<p>Download any conversation as Markdown or JSON. Your work, fully portable.</p>
			</div>
		</div>
	</section>

	<!-- Testimonials -->
	<section class="testimonials">
		<div class="section-eyebrow">Early access feedback</div>
		<h2 class="section-title">What developers are saying.</h2>

		<div class="testimonial-grid">
			{#each testimonials as t}
				<blockquote class="testimonial-card">
					<p class="testimonial-quote">"{t.quote}"</p>
					<footer class="testimonial-author">
						<span class="author-avatar" aria-hidden="true">{t.name[0]}</span>
						<div class="author-info">
							<strong class="author-name">{t.name}</strong>
							<span class="author-role">{t.role}</span>
						</div>
					</footer>
				</blockquote>
			{/each}
		</div>
	</section>

	<!-- Pricing -->
	<section class="pricing">
		<div class="section-eyebrow">Pricing</div>
		<h2 class="section-title">Simple, transparent.</h2>
		<p class="section-sub">
			All plans include the full canvas experience. Upgrade for cloud sync and sharing.
		</p>

		<div class="plans-grid">
			<div class="plan-card">
				<div class="plan-header">
					<span class="plan-name">Free</span>
					<div class="plan-price">
						<span class="price-amount">$0</span>
					</div>
				</div>
				<ul class="plan-features">
					<li>5 saved conversations</li>
					<li>Local browser storage</li>
					<li>Full canvas features</li>
					<li>OpenAI &amp; Anthropic BYOK</li>
				</ul>
				{#if data.user}
					<a href="/app" class="btn btn-outline plan-cta">Open App</a>
				{:else}
					<a href="/auth/signin" class="btn btn-outline plan-cta">Start free</a>
				{/if}
			</div>

			<div class="plan-card plan-featured">
				<div class="plan-badge">Most popular</div>
				<div class="plan-header">
					<span class="plan-name">Pro</span>
					<div class="plan-price">
						<span class="price-amount">$12</span>
						<span class="price-period">/mo</span>
					</div>
				</div>
				<ul class="plan-features">
					<li>Unlimited conversations</li>
					<li>Cloud sync &amp; backup</li>
					<li>Read-only sharing links</li>
					<li>Markdown &amp; JSON export</li>
					<li>Priority model access</li>
				</ul>
				{#if data.user}
					<a href="/app/settings" class="btn btn-primary plan-cta">Upgrade to Pro</a>
				{:else}
					<a href="/auth/signin" class="btn btn-primary plan-cta">Start free trial</a>
				{/if}
			</div>

			<div class="plan-card">
				<div class="plan-header">
					<span class="plan-name">Team</span>
					<div class="plan-price">
						<span class="price-amount">$29</span>
						<span class="price-period">/seat/mo</span>
					</div>
				</div>
				<ul class="plan-features">
					<li>Everything in Pro</li>
					<li>Shared workspaces</li>
					<li>Team conversation library</li>
					<li>Admin controls</li>
					<li>Priority support</li>
				</ul>
				<a href="mailto:hello@gettraek.com" class="btn btn-outline plan-cta">Contact us</a>
			</div>
		</div>
	</section>

	<!-- CTA Banner -->
	<section class="cta-banner">
		<div class="cta-banner-inner">
			<div class="cta-glow" aria-hidden="true"></div>
			<div class="cta-content">
				<h2 class="cta-title">Start thinking spatially.</h2>
				<p class="cta-sub">
					Free forever on the canvas. No card needed. Bring your own API key and start in seconds.
				</p>
				{#if data.user}
					<a href="/app" class="btn btn-primary btn-large">Open Playground →</a>
				{:else}
					<div class="cta-actions">
						<a href="/auth/signin" class="btn btn-primary btn-large">Try for free</a>
						<a
							href="https://github.com/gettraek/traek"
							class="btn btn-ghost btn-large"
							target="_blank"
							rel="noreferrer"
						>
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="currentColor"
								aria-hidden="true"
							>
								<path
									d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
								/>
							</svg>
							View on GitHub
						</a>
					</div>
				{/if}
			</div>
		</div>
	</section>

	<!-- FAQ -->
	<section class="faq-section">
		<div class="faq-inner">
			<div class="section-eyebrow">FAQ</div>
			<h2 class="section-title">Common questions.</h2>

			<div class="faq-list">
				{#each faqs as faq, i (i)}
					<div class="faq-item" class:faq-open={openFaq === i}>
						<button
							type="button"
							class="faq-question"
							aria-expanded={openFaq === i}
							onclick={() => toggleFaq(i)}
						>
							<span>{faq.q}</span>
							<svg
								class="faq-chevron"
								width="16"
								height="16"
								viewBox="0 0 16 16"
								fill="none"
								aria-hidden="true"
							>
								<path
									d="M4 6l4 4 4-4"
									stroke="currentColor"
									stroke-width="1.5"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
						</button>
						{#if openFaq === i}
							<div class="faq-answer">{faq.a}</div>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Footer -->
	<footer class="footer">
		<span class="footer-brand">
			<span class="footer-logo">træk</span>
			<span class="footer-sep">/</span>
			Playground
		</span>
		<nav class="footer-links" aria-label="Footer navigation">
			<a href="https://gettraek.com" rel="noreferrer" target="_blank">Library</a>
			<a href="https://docs.gettraek.com" rel="noreferrer" target="_blank">Docs</a>
			<a href="https://github.com/gettraek/traek" rel="noreferrer" target="_blank">GitHub</a>
			<a href="mailto:hello@gettraek.com">Contact</a>
		</nav>
		<span class="footer-copy">© 2026 Traek</span>
	</footer>
</div>

<style>
	/* ------------------------------------------------------------------ */
	/* Page shell                                                           */
	/* ------------------------------------------------------------------ */
	.page {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	/* ------------------------------------------------------------------ */
	/* Navigation                                                           */
	/* ------------------------------------------------------------------ */
	.nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1.25rem max(5vw, 1.5rem);
		border-bottom: 1px solid var(--pg-border);
		position: sticky;
		top: 0;
		z-index: 100;
		background: rgba(8, 8, 8, 0.88);
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
	}

	:global([data-theme='light']) .nav {
		background: rgba(248, 248, 248, 0.92);
	}

	.logo {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		text-decoration: none;
	}

	.logo-mark {
		font-size: 0.85rem;
		font-family: 'Space Mono', monospace;
		color: var(--pg-cyan);
		opacity: 0.8;
	}

	.logo-main {
		font-size: 1.1rem;
		font-weight: 700;
		letter-spacing: -0.04em;
		color: var(--pg-text);
	}

	.nav-links {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.nav-link {
		padding: 0.4rem 0.65rem;
		font-size: 0.85rem;
		color: var(--pg-text-secondary);
		text-decoration: none;
		border-radius: 7px;
		transition:
			color 0.15s,
			background 0.15s;
	}

	.nav-link:hover {
		color: var(--pg-text);
		background: rgba(255, 255, 255, 0.06);
	}

	:global([data-theme='light']) .nav-link:hover {
		background: rgba(0, 0, 0, 0.06);
	}

	/* ------------------------------------------------------------------ */
	/* Buttons                                                              */
	/* ------------------------------------------------------------------ */
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		padding: 0.6rem 1.2rem;
		border-radius: 999px;
		font-size: 0.88rem;
		font-weight: 600;
		text-decoration: none;
		border: 1px solid transparent;
		cursor: pointer;
		font-family: inherit;
		transition:
			background 0.15s,
			transform 0.1s,
			box-shadow 0.15s,
			border-color 0.15s;
	}

	.btn:focus-visible {
		outline: 2px solid var(--pg-cyan);
		outline-offset: 2px;
	}

	.btn-primary {
		background: var(--pg-gradient);
		color: #000;
		box-shadow: var(--pg-shadow-btn);
	}

	.btn-primary:hover {
		transform: translateY(-1px);
		box-shadow: var(--pg-shadow-btn-hover);
	}

	.btn-primary:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		transform: none;
	}

	.btn-ghost {
		background: transparent;
		color: var(--pg-text-secondary);
		border-color: var(--pg-border-strong);
	}

	.btn-ghost:hover {
		background: rgba(255, 255, 255, 0.06);
		color: var(--pg-text);
	}

	:global([data-theme='light']) .btn-ghost:hover {
		background: rgba(0, 0, 0, 0.06);
	}

	.btn-outline {
		background: transparent;
		color: var(--pg-text);
		border-color: var(--pg-border-strong);
	}

	.btn-outline:hover {
		background: rgba(255, 255, 255, 0.05);
		border-color: rgba(255, 255, 255, 0.25);
	}

	:global([data-theme='light']) .btn-outline:hover {
		background: rgba(0, 0, 0, 0.04);
		border-color: rgba(0, 0, 0, 0.2);
	}

	.btn-sm {
		padding: 0.4rem 0.9rem;
		font-size: 0.82rem;
		border-radius: 7px;
	}

	.btn-large {
		padding: 0.75rem 1.8rem;
		font-size: 0.95rem;
	}

	/* ------------------------------------------------------------------ */
	/* Section shared                                                       */
	/* ------------------------------------------------------------------ */
	.section-eyebrow {
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--pg-cyan);
		margin-bottom: 0.75rem;
	}

	.section-title {
		font-size: clamp(1.6rem, 3vw, 2.2rem);
		font-weight: 700;
		letter-spacing: -0.03em;
		line-height: 1.15;
		margin-bottom: 0.75rem;
		color: var(--pg-text);
	}

	.section-sub {
		font-size: 1rem;
		color: var(--pg-text-secondary);
		max-width: 42rem;
		line-height: 1.55;
	}

	/* ------------------------------------------------------------------ */
	/* Hero                                                                 */
	/* ------------------------------------------------------------------ */
	.hero {
		display: grid;
		grid-template-columns: 1fr 1fr;
		align-items: center;
		gap: 3rem;
		padding: 5rem max(5vw, 1.5rem) 4rem;
		max-width: 1200px;
		margin: 0 auto;
		width: 100%;
		box-sizing: border-box;
	}

	.hero-content {
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	.hero-eyebrow {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.78rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--pg-cyan);
		margin-bottom: 1.25rem;
	}

	.eyebrow-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--pg-cyan);
		box-shadow: 0 0 8px var(--pg-cyan);
		animation: pulse 2s ease-in-out infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
			transform: scale(1);
		}
		50% {
			opacity: 0.5;
			transform: scale(0.85);
		}
	}

	h1 {
		font-size: clamp(2.4rem, 5vw, 3.8rem);
		font-weight: 800;
		letter-spacing: -0.04em;
		line-height: 1.05;
		margin: 0 0 1.25rem;
		color: var(--pg-text-strong);
	}

	.h1-accent {
		background: var(--pg-gradient);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.hero-sub {
		font-size: 1.1rem;
		color: var(--pg-text-secondary);
		line-height: 1.6;
		margin: 0 0 2rem;
		max-width: 38rem;
	}

	.hero-actions {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
		margin-bottom: 0.75rem;
	}

	.hero-note {
		font-size: 0.82rem;
		color: var(--pg-text-muted);
		margin: 0 0 2rem;
	}

	.hero-stats {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		margin-top: 0.5rem;
		flex-wrap: wrap;
	}

	.stat {
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
	}

	.stat-value {
		font-size: 1.1rem;
		font-weight: 700;
		color: var(--pg-text-strong);
		letter-spacing: -0.02em;
	}

	.stat-label {
		font-size: 0.72rem;
		color: var(--pg-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}

	.stat-div {
		width: 1px;
		height: 28px;
		background: var(--pg-border-strong);
	}

	/* ------------------------------------------------------------------ */
	/* Animated Canvas Demo                                                 */
	/* ------------------------------------------------------------------ */
	.hero-demo {
		position: relative;
	}

	.demo-chrome {
		border-radius: 14px;
		overflow: hidden;
		border: 1px solid var(--pg-border-strong);
		box-shadow:
			0 24px 80px rgba(0, 0, 0, 0.6),
			0 0 0 1px rgba(255, 255, 255, 0.04) inset,
			0 0 60px rgba(0, 216, 255, 0.06);
	}

	.demo-chrome-bar {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.65rem 0.9rem;
		background: #111;
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
	}

	.chrome-dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		flex-shrink: 0;
	}
	.chrome-red {
		background: #ff5f57;
	}
	.chrome-yellow {
		background: #ffbd2e;
	}
	.chrome-green {
		background: #28c840;
	}

	.chrome-url {
		flex: 1;
		text-align: center;
		font-size: 0.72rem;
		font-family: 'Space Mono', monospace;
		color: rgba(255, 255, 255, 0.28);
		background: rgba(255, 255, 255, 0.04);
		border-radius: 4px;
		padding: 0.2rem 0.6rem;
		margin: 0 0.5rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.demo-canvas {
		position: relative;
		background: #0a0a0a;
		height: 340px;
		overflow: hidden;
	}

	.demo-grid {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	.demo-connections {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}

	/* Connection line draw-in animations */
	.conn-line {
		transition: stroke-dashoffset 0.6s ease;
	}
	.conn-line-1 {
		animation: draw-line 0.6s 1.2s ease forwards;
	}
	.conn-line-2 {
		animation: draw-line 0.6s 1.6s ease forwards;
	}
	.conn-line-3 {
		animation: draw-line 0.4s 2.8s ease forwards;
	}
	.conn-line-4 {
		animation: draw-line 0.4s 3.4s ease forwards;
	}

	@keyframes draw-line {
		to {
			stroke-dashoffset: 0;
		}
	}

	/* Node appearance */
	.demo-node {
		position: absolute;
		background: #161616;
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 10px;
		padding: 0.6rem 0.75rem;
		min-width: 130px;
		opacity: 0;
		transform: scale(0.9) translateY(6px);
		transition: none;
	}

	.node-appear-1 {
		animation: node-in 0.4s 0.3s ease forwards;
	}
	.node-appear-2 {
		animation: node-in 0.4s 1.4s ease forwards;
	}
	.node-appear-3 {
		animation: node-in 0.4s 2s ease forwards;
	}
	.node-appear-4 {
		animation: node-in 0.4s 3s ease forwards;
	}
	.node-appear-5 {
		animation: node-in 0.4s 3.6s ease forwards;
	}

	@keyframes node-in {
		to {
			opacity: 1;
			transform: scale(1) translateY(0);
		}
	}

	.paused .demo-node,
	.paused .conn-line {
		animation: none;
		opacity: 1;
		transform: none;
		stroke-dashoffset: 0;
	}

	.demo-node-root {
		top: 28px;
		left: 50%;
		transform-origin: center top;
		translate: -50% 0;
	}

	.demo-node-left {
		top: 120px;
		left: 22px;
		border-color: rgba(0, 216, 255, 0.3);
	}

	.demo-node-right {
		top: 120px;
		right: 22px;
		border-color: rgba(0, 255, 163, 0.3);
	}

	.demo-node-left-child {
		top: 230px;
		left: 22px;
	}

	.demo-node-right-child {
		top: 230px;
		right: 22px;
		border-color: rgba(0, 255, 163, 0.25);
	}

	.node-role {
		font-size: 0.6rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: rgba(0, 216, 255, 0.7);
		margin-bottom: 0.4rem;
		font-family: 'Space Mono', monospace;
	}

	.node-role-ai {
		color: rgba(255, 255, 255, 0.4);
	}

	.node-role-alt {
		color: rgba(0, 255, 163, 0.7);
	}

	.node-bar {
		height: 5px;
		border-radius: 3px;
		background: rgba(255, 255, 255, 0.18);
		margin-bottom: 0.3rem;
	}
	.node-bar:last-child {
		margin-bottom: 0;
	}

	.node-bar-full {
		width: 100%;
	}
	.node-bar-medium {
		width: 72%;
	}
	.node-bar-short {
		width: 48%;
	}

	.node-bar-lime {
		background: rgba(0, 255, 163, 0.4);
	}
	.node-bar-lime-soft {
		background: rgba(0, 255, 163, 0.18);
	}

	.branch-hint {
		position: absolute;
		font-size: 0.58rem;
		font-family: 'Space Mono', monospace;
		color: rgba(0, 216, 255, 0.5);
		top: 100px;
		left: 48%;
		white-space: nowrap;
		opacity: 0;
		animation: node-in 0.3s 1.5s ease forwards;
	}

	.typing-dots {
		display: flex;
		gap: 3px;
		margin-top: 0.4rem;
	}

	.typing-dots span {
		width: 4px;
		height: 4px;
		border-radius: 50%;
		background: rgba(0, 255, 163, 0.6);
		animation: typing-dot 1.2s ease-in-out infinite;
	}

	.typing-dots span:nth-child(2) {
		animation-delay: 0.15s;
	}
	.typing-dots span:nth-child(3) {
		animation-delay: 0.3s;
	}

	@keyframes typing-dot {
		0%,
		80%,
		100% {
			transform: scale(0.6);
			opacity: 0.4;
		}
		40% {
			transform: scale(1);
			opacity: 1;
		}
	}

	.demo-active-label {
		position: absolute;
		bottom: 10px;
		right: 12px;
		font-size: 0.6rem;
		font-family: 'Space Mono', monospace;
		color: rgba(0, 255, 163, 0.6);
		opacity: 0;
		animation: node-in 0.3s 3.8s ease forwards;
	}

	/* ------------------------------------------------------------------ */
	/* Social Proof Bar                                                     */
	/* ------------------------------------------------------------------ */
	.proof-bar {
		border-top: 1px solid var(--pg-border);
		border-bottom: 1px solid var(--pg-border);
		background: var(--pg-bg-surface);
		padding: 0.9rem max(5vw, 1.5rem);
	}

	.proof-bar-inner {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		gap: 1.5rem;
		flex-wrap: wrap;
		justify-content: center;
	}

	.proof-item {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.85rem;
		color: var(--pg-text);
	}

	.proof-item strong {
		font-weight: 600;
	}

	.proof-icon {
		color: var(--pg-text-muted);
		flex-shrink: 0;
	}

	.proof-sep {
		color: var(--pg-text-muted);
	}

	.proof-muted {
		color: var(--pg-text-muted);
	}

	.proof-div {
		width: 1px;
		height: 18px;
		background: var(--pg-border-strong);
		flex-shrink: 0;
	}

	.proof-item-models {
		gap: 0.5rem;
	}

	.model-badge {
		padding: 0.15rem 0.5rem;
		border-radius: 5px;
		background: rgba(255, 255, 255, 0.06);
		border: 1px solid var(--pg-border);
		font-size: 0.75rem;
		color: var(--pg-text-secondary);
		font-family: 'Space Mono', monospace;
	}

	.model-badge-more {
		color: var(--pg-text-muted);
	}

	/* ------------------------------------------------------------------ */
	/* Comparison Section                                                   */
	/* ------------------------------------------------------------------ */
	.compare-section {
		padding: 5rem max(5vw, 1.5rem);
		max-width: 1200px;
		margin: 0 auto;
		width: 100%;
		box-sizing: border-box;
		border-top: 1px solid var(--pg-border);
	}

	.compare-header {
		margin-bottom: 2rem;
	}

	.compare-tabs {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1.5rem;
		background: var(--pg-bg-surface);
		border-radius: 12px;
		padding: 0.3rem;
		width: fit-content;
	}

	.compare-tab {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.45rem 1rem;
		border-radius: 8px;
		font-size: 0.85rem;
		font-weight: 500;
		font-family: inherit;
		cursor: pointer;
		border: 1px solid transparent;
		background: transparent;
		color: var(--pg-text-secondary);
		transition:
			background 0.15s,
			color 0.15s,
			border-color 0.15s;
	}

	.compare-tab-active {
		background: var(--pg-bg-card);
		color: var(--pg-text);
		border-color: var(--pg-border-strong);
	}

	.tab-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.tab-dot-bad {
		background: #ff6b6b;
	}
	.tab-dot-good {
		background: var(--pg-lime);
	}

	.compare-panel {
		border-radius: 16px;
		border: 1px solid var(--pg-border);
		overflow: hidden;
	}

	/* Linear demo panel */
	.compare-panel-linear {
		background: var(--pg-bg-card);
	}

	.linear-demo {
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		max-height: 380px;
		overflow-y: auto;
	}

	.linear-msg {
		display: flex;
		gap: 0.6rem;
		align-items: flex-start;
	}

	.msg-avatar {
		width: 28px;
		height: 28px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.65rem;
		font-weight: 700;
		flex-shrink: 0;
		margin-top: 2px;
	}

	.msg-avatar-user {
		background: rgba(0, 216, 255, 0.15);
		color: var(--pg-cyan);
		border: 1px solid rgba(0, 216, 255, 0.3);
	}

	.msg-avatar-ai {
		background: rgba(255, 255, 255, 0.06);
		color: var(--pg-text-secondary);
		border: 1px solid var(--pg-border);
		font-size: 0.55rem;
	}

	.msg-bubble {
		padding: 0.6rem 0.85rem;
		border-radius: 10px;
		font-size: 0.85rem;
		line-height: 1.5;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid var(--pg-border);
		color: var(--pg-text-secondary);
		position: relative;
	}

	.linear-user .msg-bubble {
		background: rgba(0, 216, 255, 0.07);
		border-color: rgba(0, 216, 255, 0.2);
		color: var(--pg-text);
	}

	.msg-buried .msg-bubble {
		opacity: 0.65;
	}

	.msg-lost .msg-bubble {
		opacity: 0.45;
		background: rgba(255, 107, 107, 0.06);
		border-color: rgba(255, 107, 107, 0.2);
		color: rgba(255, 107, 107, 0.8);
	}

	.msg-lost-badge {
		display: inline-block;
		margin-left: 0.4rem;
		padding: 0.1rem 0.4rem;
		border-radius: 4px;
		background: rgba(255, 107, 107, 0.12);
		color: #ff6b6b;
		font-size: 0.68rem;
		font-weight: 600;
	}

	.linear-lost-note {
		font-size: 0.78rem;
		color: rgba(255, 107, 107, 0.6);
		text-align: center;
		padding: 0.5rem;
		border-top: 1px solid rgba(255, 107, 107, 0.1);
		margin-top: 0.25rem;
	}

	/* Spatial demo panel */
	.compare-panel-spatial {
		background: #0a0a0a;
	}

	.spatial-demo {
		display: flex;
		flex-direction: column;
	}

	.spatial-canvas-bg {
		padding: 1rem 0.5rem 0.5rem;
	}

	.spatial-svg {
		width: 100%;
		height: auto;
	}

	.spatial-note {
		padding: 0.75rem 1.5rem;
		font-size: 0.82rem;
		color: var(--pg-lime);
		border-top: 1px solid rgba(0, 255, 163, 0.1);
		background: rgba(0, 255, 163, 0.04);
		font-family: 'Space Mono', monospace;
	}

	/* ------------------------------------------------------------------ */
	/* Features                                                             */
	/* ------------------------------------------------------------------ */
	.features {
		padding: 5rem max(5vw, 1.5rem);
		max-width: 1200px;
		margin: 0 auto;
		width: 100%;
		box-sizing: border-box;
		border-top: 1px solid var(--pg-border);
	}

	.feature-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1px;
		background: var(--pg-border);
		border-radius: 16px;
		overflow: hidden;
		margin-top: 2.5rem;
		border: 1px solid var(--pg-border);
	}

	.feature-card {
		background: var(--pg-bg-card);
		padding: 1.75rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		transition: background 0.15s;
	}

	.feature-card:hover {
		background: var(--pg-bg-card-hover);
	}

	.feature-icon {
		width: 38px;
		height: 38px;
		border-radius: 10px;
		background: rgba(0, 216, 255, 0.08);
		border: 1px solid rgba(0, 216, 255, 0.15);
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--pg-cyan);
		flex-shrink: 0;
	}

	.feature-card h3 {
		font-size: 0.95rem;
		font-weight: 600;
		letter-spacing: -0.01em;
		margin: 0;
		color: var(--pg-text);
	}

	.feature-card p {
		font-size: 0.875rem;
		color: var(--pg-text-secondary);
		line-height: 1.55;
		margin: 0;
	}

	/* ------------------------------------------------------------------ */
	/* Testimonials                                                         */
	/* ------------------------------------------------------------------ */
	.testimonials {
		padding: 5rem max(5vw, 1.5rem);
		max-width: 1200px;
		margin: 0 auto;
		width: 100%;
		box-sizing: border-box;
		border-top: 1px solid var(--pg-border);
	}

	.testimonial-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1.25rem;
		margin-top: 2.5rem;
	}

	.testimonial-card {
		background: var(--pg-bg-card);
		border: 1px solid var(--pg-border);
		border-radius: 16px;
		padding: 1.5rem;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		transition:
			border-color 0.2s,
			box-shadow 0.2s;
	}

	.testimonial-card:hover {
		border-color: var(--pg-border-strong);
		box-shadow: var(--pg-shadow-card);
	}

	.testimonial-quote {
		font-size: 0.95rem;
		line-height: 1.65;
		color: var(--pg-text-secondary);
		margin: 0;
		flex: 1;
	}

	.testimonial-author {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.author-avatar {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background: var(--pg-gradient);
		color: #000;
		font-size: 0.85rem;
		font-weight: 700;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.author-info {
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
	}

	.author-name {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--pg-text);
	}

	.author-role {
		font-size: 0.78rem;
		color: var(--pg-text-muted);
	}

	/* ------------------------------------------------------------------ */
	/* Pricing                                                              */
	/* ------------------------------------------------------------------ */
	.pricing {
		padding: 5rem max(5vw, 1.5rem);
		max-width: 1200px;
		margin: 0 auto;
		width: 100%;
		box-sizing: border-box;
		border-top: 1px solid var(--pg-border);
	}

	.plans-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.25rem;
		margin-top: 2.5rem;
		align-items: start;
	}

	.plan-card {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		padding: 1.75rem;
		background: var(--pg-bg-card);
		border: 1px solid var(--pg-border);
		border-radius: 18px;
		position: relative;
	}

	.plan-featured {
		border-color: var(--pg-border-cyan);
		background: radial-gradient(circle at top left, rgba(0, 216, 255, 0.06), var(--pg-bg-card) 70%);
		box-shadow: var(--pg-shadow-glow);
	}

	.plan-badge {
		position: absolute;
		top: -10px;
		left: 50%;
		transform: translateX(-50%);
		background: var(--pg-gradient);
		color: #000;
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		padding: 0.2rem 0.7rem;
		border-radius: 999px;
		white-space: nowrap;
	}

	.plan-header {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
	}

	.plan-name {
		font-size: 1rem;
		font-weight: 700;
		color: var(--pg-text);
	}

	.plan-price {
		display: flex;
		align-items: baseline;
		gap: 0.2rem;
	}

	.price-amount {
		font-size: 1.75rem;
		font-weight: 800;
		letter-spacing: -0.04em;
		color: var(--pg-text-strong);
	}

	.price-period {
		font-size: 0.8rem;
		color: var(--pg-text-muted);
	}

	.plan-features {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		flex: 1;
	}

	.plan-features li {
		display: flex;
		align-items: flex-start;
		gap: 0.5rem;
		font-size: 0.875rem;
		color: var(--pg-text-secondary);
		padding-left: 1.2rem;
		position: relative;
	}

	.plan-features li::before {
		content: '✓';
		position: absolute;
		left: 0;
		color: var(--pg-cyan);
		font-weight: 700;
	}

	.plan-cta {
		width: 100%;
		margin-top: 0.25rem;
	}

	/* ------------------------------------------------------------------ */
	/* CTA Banner                                                           */
	/* ------------------------------------------------------------------ */
	.cta-banner {
		margin: 0 max(5vw, 1.5rem) 5rem;
		border-radius: 24px;
		border: 1px solid var(--pg-border-cyan);
		overflow: hidden;
	}

	.cta-banner-inner {
		position: relative;
		padding: 4rem 3rem;
		background: radial-gradient(
			ellipse at top center,
			rgba(0, 216, 255, 0.08) 0%,
			rgba(0, 255, 163, 0.04) 40%,
			transparent 70%
		);
	}

	.cta-glow {
		position: absolute;
		top: -60px;
		left: 50%;
		transform: translateX(-50%);
		width: 400px;
		height: 200px;
		border-radius: 50%;
		background: radial-gradient(ellipse, rgba(0, 216, 255, 0.12), transparent 70%);
		pointer-events: none;
	}

	.cta-content {
		position: relative;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	.cta-title {
		font-size: clamp(1.8rem, 3.5vw, 2.8rem);
		font-weight: 800;
		letter-spacing: -0.04em;
		color: var(--pg-text-strong);
		margin: 0;
	}

	.cta-sub {
		font-size: 1rem;
		color: var(--pg-text-secondary);
		max-width: 36rem;
		line-height: 1.55;
		margin: 0;
	}

	.cta-actions {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
		justify-content: center;
		margin-top: 0.5rem;
	}

	/* ------------------------------------------------------------------ */
	/* FAQ                                                                  */
	/* ------------------------------------------------------------------ */
	.faq-section {
		border-top: 1px solid var(--pg-border);
	}

	.faq-inner {
		padding: 5rem max(5vw, 1.5rem);
		max-width: 800px;
		margin: 0 auto;
		width: 100%;
		box-sizing: border-box;
	}

	.faq-list {
		display: flex;
		flex-direction: column;
		gap: 0;
		margin-top: 2rem;
		border: 1px solid var(--pg-border);
		border-radius: 14px;
		overflow: hidden;
	}

	.faq-item {
		border-bottom: 1px solid var(--pg-border);
	}

	.faq-item:last-child {
		border-bottom: none;
	}

	.faq-question {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1.1rem 1.25rem;
		background: transparent;
		border: none;
		text-align: left;
		cursor: pointer;
		font-family: inherit;
		font-size: 0.9rem;
		font-weight: 500;
		color: var(--pg-text);
		gap: 1rem;
		transition: background 0.12s;
	}

	.faq-question:hover {
		background: rgba(255, 255, 255, 0.03);
	}

	:global([data-theme='light']) .faq-question:hover {
		background: rgba(0, 0, 0, 0.03);
	}

	.faq-chevron {
		color: var(--pg-text-muted);
		flex-shrink: 0;
		transition: transform 0.2s;
	}

	.faq-open .faq-chevron {
		transform: rotate(180deg);
	}

	.faq-answer {
		padding: 0 1.25rem 1.1rem;
		font-size: 0.875rem;
		color: var(--pg-text-secondary);
		line-height: 1.65;
	}

	/* ------------------------------------------------------------------ */
	/* Footer                                                               */
	/* ------------------------------------------------------------------ */
	.footer {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		flex-wrap: wrap;
		padding: 1.5rem max(5vw, 1.5rem) 2rem;
		border-top: 1px solid var(--pg-border);
		font-size: 0.83rem;
		margin-top: auto;
	}

	.footer-brand {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		color: var(--pg-text-secondary);
	}

	.footer-logo {
		font-weight: 700;
		letter-spacing: -0.03em;
		color: var(--pg-text);
	}

	.footer-sep {
		color: var(--pg-text-muted);
	}

	.footer-links {
		display: flex;
		gap: 1rem;
		margin-right: auto;
	}

	.footer-links a {
		color: var(--pg-text-secondary);
		text-decoration: none;
		transition: color 0.15s;
	}

	.footer-links a:hover {
		color: var(--pg-text);
	}

	.footer-copy {
		color: var(--pg-text-muted);
		margin-left: auto;
	}

	/* ------------------------------------------------------------------ */
	/* Responsive                                                           */
	/* ------------------------------------------------------------------ */
	@media (max-width: 900px) {
		.hero {
			grid-template-columns: 1fr;
			padding-top: 3rem;
		}

		.hero-demo {
			order: -1;
		}

		.feature-grid {
			grid-template-columns: 1fr 1fr;
		}

		.plans-grid {
			grid-template-columns: 1fr;
		}

		.testimonial-grid {
			grid-template-columns: 1fr;
		}

		.cta-banner-inner {
			padding: 3rem 1.5rem;
		}
	}

	@media (max-width: 600px) {
		.feature-grid {
			grid-template-columns: 1fr;
		}

		.hero-stats {
			gap: 1rem;
		}

		.proof-bar-inner {
			gap: 1rem;
		}

		.proof-div {
			display: none;
		}

		.compare-tabs {
			width: 100%;
		}

		.compare-tab {
			flex: 1;
			justify-content: center;
		}

		.cta-title {
			font-size: 1.8rem;
		}
	}
</style>
