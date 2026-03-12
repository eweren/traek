<script lang="ts">
	import QRCode from 'qrcode';

	interface Props {
		/** The URL to encode in the QR code */
		url: string;
		/** Optional label shown below the QR code */
		label?: string;
		/** Size of the QR code in pixels (square) */
		size?: number;
		/** Error correction level */
		errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
	}

	let { url, label, size = 200, errorCorrectionLevel = 'M' }: Props = $props();

	let canvas = $state<HTMLCanvasElement | undefined>(undefined);
	let error = $state<string | undefined>(undefined);

	async function renderQR(el: HTMLCanvasElement, targetUrl: string) {
		try {
			await QRCode.toCanvas(el, targetUrl, {
				width: size,
				margin: 2,
				errorCorrectionLevel,
				color: {
					dark: '#e4e4e7',
					light: '#0e0e10'
				}
			});
			error = undefined;
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to generate QR code';
		}
	}

	$effect(() => {
		if (canvas && url) {
			renderQR(canvas, url);
		}
	});

	const shortUrl = $derived(
		url.replace(/^https?:\/\//, '').slice(0, 40) +
			(url.replace(/^https?:\/\//, '').length > 40 ? '…' : '')
	);
</script>

<!--
  QrHandoff — renders a QR code for mobile handoff.

  Lets users scan a share link from desktop to open the conversation
  on their mobile device.
-->
<div class="qr-handoff" role="figure" aria-label="QR code for: {url}">
	<div class="qr-frame">
		{#if error}
			<div class="qr-error" role="alert">
				<span>⚠</span>
				<span>{error}</span>
			</div>
		{:else}
			<canvas bind:this={canvas} width={size} height={size} aria-label="QR code to open {url}"
			></canvas>
		{/if}

		<!-- Corner decorations -->
		<div class="corner corner-tl" aria-hidden="true"></div>
		<div class="corner corner-tr" aria-hidden="true"></div>
		<div class="corner corner-bl" aria-hidden="true"></div>
		<div class="corner corner-br" aria-hidden="true"></div>
	</div>

	<div class="qr-meta">
		<span class="qr-instruction">Scan to open on mobile</span>
		<!-- eslint-disable svelte/no-navigation-without-resolve -->
		<a
			href={url}
			class="qr-url"
			target="_blank"
			rel="noopener noreferrer"
			aria-label="Open {url} in new tab">{shortUrl}</a
		>
		<!-- eslint-enable svelte/no-navigation-without-resolve -->
		{#if label}
			<span class="qr-label">{label}</span>
		{/if}
	</div>
</div>

<style>
	.qr-handoff {
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		gap: 14px;
	}

	.qr-frame {
		position: relative;
		padding: 12px;
		background: #0e0e10;
		border: 1px solid #1f1f24;
		border-radius: 12px;
		box-shadow: 0 0 0 1px rgba(0, 216, 255, 0.08);
		overflow: visible;
	}

	.qr-frame canvas {
		display: block;
		border-radius: 6px;
	}

	.qr-error {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 8px;
		color: #ff4400;
		font-size: 13px;
		min-width: 160px;
		min-height: 160px;
	}

	/* Finder-pattern style corner marks */
	.corner {
		position: absolute;
		width: 20px;
		height: 20px;
		border-color: #00d8ff;
		border-style: solid;
		pointer-events: none;
	}

	.corner-tl {
		top: -1px;
		left: -1px;
		border-width: 2px 0 0 2px;
		border-radius: 4px 0 0 0;
	}

	.corner-tr {
		top: -1px;
		right: -1px;
		border-width: 2px 2px 0 0;
		border-radius: 0 4px 0 0;
	}

	.corner-bl {
		bottom: -1px;
		left: -1px;
		border-width: 0 0 2px 2px;
		border-radius: 0 0 0 4px;
	}

	.corner-br {
		bottom: -1px;
		right: -1px;
		border-width: 0 2px 2px 0;
		border-radius: 0 0 4px 0;
	}

	.qr-meta {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		text-align: center;
	}

	.qr-instruction {
		font-size: 12px;
		font-weight: 600;
		color: #71717a;
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}

	.qr-url {
		font-size: 11px;
		color: #52525b;
		font-family: ui-monospace, 'Cascadia Code', 'Fira Code', monospace;
		text-decoration: none;
		word-break: break-all;
	}

	.qr-url:hover {
		color: #00d8ff;
		text-decoration: underline;
	}

	.qr-label {
		font-size: 12px;
		color: #3f3f46;
	}
</style>
