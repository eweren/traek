<script lang="ts">
	import type { MessageNode } from '../../TraekEngine.svelte';
	import { fileNodeDataSchema, getFileIcon, formatFileSize } from './types';

	let { node }: { node: MessageNode } = $props();

	const data = $derived.by(() => {
		const result = fileNodeDataSchema.safeParse(node.data);
		return result.success ? result.data : null;
	});

	const file = $derived(data?.file);

	const iconLabel: Record<string, string> = {
		'file-pdf': '📄',
		'file-image': '🖼',
		'file-video': '🎬',
		'file-audio': '🎵',
		'file-archive': '🗜',
		'file-table': '📊',
		'file-code': '💻',
		file: '📁'
	};

	const icon = $derived(file ? (iconLabel[getFileIcon(file.mimeType)] ?? '📁') : '📁');
	const sizeLabel = $derived(file ? formatFileSize(file.size) : '');

	function download() {
		if (file?.url) {
			const a = document.createElement('a');
			a.href = file.url;
			a.download = file.name;
			a.click();
		}
	}
</script>

<div class="file-node" class:error={file?.uploadStatus === 'error'}>
	{#if !data || !file}
		<div class="invalid" role="alert">Invalid file data</div>
	{:else}
		<div class="file-body">
			<div class="file-icon" aria-hidden="true">{icon}</div>
			<div class="file-info">
				<button
					class="file-name"
					disabled={!file.url}
					onclick={download}
					aria-label="Download {file.name}"
					title={file.url ? 'Download file' : file.name}
				>
					{file.name}
				</button>
				<div class="file-meta">
					{#if file.uploadStatus === 'uploading'}
						<span class="upload-pct">{file.uploadProgress ?? 0}%</span>
					{:else if file.uploadStatus === 'error'}
						<span class="error-msg">{file.errorMessage ?? 'Upload failed'}</span>
					{:else}
						<span class="file-size">{sizeLabel}</span>
					{/if}
				</div>
			</div>

			<div class="file-actions">
				{#if file.uploadStatus === 'done' && file.url}
					<button class="icon-btn" aria-label="Download file" onclick={download} title="Download">
						⬇
					</button>
				{:else if file.uploadStatus === 'uploading'}
					<button class="icon-btn cancel-btn" aria-label="Cancel upload" title="Cancel">×</button>
				{:else if file.uploadStatus === 'error'}
					<button class="icon-btn retry-btn" aria-label="Retry upload" title="Retry">↺</button>
				{/if}
			</div>
		</div>

		{#if file.uploadStatus === 'uploading'}
			<div
				class="progress-bar"
				role="progressbar"
				aria-valuenow={file.uploadProgress ?? 0}
				aria-valuemin={0}
				aria-valuemax={100}
				aria-label="Upload progress"
			>
				<div class="progress-fill" style:width="{file.uploadProgress ?? 0}%"></div>
			</div>
		{:else if file.uploadStatus === 'error'}
			<div class="error-bar"></div>
		{/if}
	{/if}
</div>

<style>
	.file-node {
		background: var(--traek-node-bg, #1e1e1e);
		border: 1px solid var(--traek-node-border, #2a2a2a);
		border-radius: 8px;
		overflow: hidden;
		min-width: 250px;
		max-width: 400px;
	}

	.file-node.error {
		border-color: rgba(239, 68, 68, 0.4);
	}

	.file-body {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 12px;
	}

	.file-icon {
		font-size: 24px;
		flex-shrink: 0;
		width: 32px;
		text-align: center;
	}

	.file-info {
		flex: 1;
		min-width: 0;
	}

	.file-name {
		background: transparent;
		border: none;
		padding: 0;
		text-align: left;
		font-size: 13px;
		font-weight: 500;
		color: var(--traek-node-text, #ddd);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 200px;
		display: block;
	}

	.file-name:not(:disabled) {
		cursor: pointer;
		color: var(--traek-input-button-bg, #00d8ff);
	}

	.file-name:not(:disabled):hover {
		text-decoration: underline;
	}

	.file-name:focus-visible {
		outline: 2px solid var(--traek-input-button-bg, #00d8ff);
		outline-offset: 2px;
		border-radius: 2px;
	}

	.file-meta {
		margin-top: 2px;
	}

	.file-size {
		font-size: 11px;
		color: var(--traek-thought-header-accent, #666);
	}

	.upload-pct {
		font-size: 11px;
		color: var(--traek-input-button-bg, #00d8ff);
	}

	.error-msg {
		font-size: 11px;
		color: #ef4444;
	}

	.file-actions {
		flex-shrink: 0;
	}

	.icon-btn {
		width: 36px;
		height: 36px;
		border: 1px solid var(--traek-node-border, #2a2a2a);
		background: transparent;
		color: var(--traek-node-text, #aaa);
		font-size: 16px;
		border-radius: 6px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.icon-btn:hover {
		background: rgba(255, 255, 255, 0.06);
	}

	.icon-btn:focus-visible {
		outline: 2px solid var(--traek-input-button-bg, #00d8ff);
		outline-offset: 2px;
	}

	.cancel-btn {
		color: #ef4444;
	}

	.retry-btn {
		color: var(--traek-input-button-bg, #00d8ff);
	}

	.progress-bar {
		height: 3px;
		background: var(--traek-node-border, #1f1f24);
	}

	.progress-fill {
		height: 100%;
		background: var(--traek-input-button-bg, #00d8ff);
		transition: width 0.3s ease;
	}

	.error-bar {
		height: 3px;
		background: #ef4444;
		opacity: 0.6;
	}

	.invalid {
		padding: 12px;
		font-size: 12px;
		color: #ef4444;
	}
</style>
