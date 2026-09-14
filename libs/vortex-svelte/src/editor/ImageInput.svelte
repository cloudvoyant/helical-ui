<script lang="ts">
  import type { Editor } from '@tiptap/core';
  import type { ImageUploadResult } from '@cloudvoyant/vortex-ui';
  import { X } from 'lucide-svelte';
  import ImageFileUpload from './ImageFileUpload.svelte';

  interface Props {
    editor: Editor;
    position: number;
    onClose: () => void;
    onUpload?: (file: File) => Promise<ImageUploadResult>;
  }

  let { editor, position, onClose, onUpload }: Props = $props();

  let activeTab = $state<'upload' | 'url'>('upload');
  let urlValue = $state('');
  let urlError = $state('');
  let urlInputEl: HTMLInputElement | undefined = $state();
  let selectedFile = $state<File | null>(null);
  let uploading = $state(false);
  let uploadError = $state('');

  $effect(() => {
    if (activeTab === 'url') {
      urlInputEl?.focus();
    }
  });

  function insertImage(src: string, srcset?: string) {
    editor.chain().focus().setTextSelection(position).insertImage({ src, srcset, alt: '', caption: '' }).run();
    onClose();
  }

  function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () =>
        typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('No image data'));
      reader.onerror = () => reject(reader.error ?? new Error('Could not read image'));
      reader.readAsDataURL(file);
    });
  }

  async function handleUpload() {
    if (!selectedFile) {
      uploadError = 'Choose an image first.';
      return;
    }

    uploading = true;
    uploadError = '';
    try {
      const result: ImageUploadResult = onUpload
        ? await onUpload(selectedFile)
        : { src: await fileToDataUrl(selectedFile) };
      insertImage(result.src, result.srcset);
    } catch {
      uploadError = 'Upload failed. Please try again.';
    } finally {
      uploading = false;
    }
  }

  function handleUrlSubmit() {
    const trimmed = urlValue.trim();
    if (!trimmed) {
      urlError = 'Please enter a URL';
      return;
    }
    try {
      new URL(trimmed);
    } catch {
      urlError = 'Please enter a valid URL';
      return;
    }
    insertImage(trimmed);
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') onClose();
  }

  function handleUrlKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') handleUrlSubmit();
  }
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
  class="max-h-[calc(100vh-2rem)] w-80 overflow-y-auto rounded-lg border border-border bg-popover p-3 text-popover-foreground shadow-xl"
  role="dialog"
  aria-label="Insert image"
  tabindex="-1"
  onkeydown={handleKeydown}
>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <p class="text-sm font-semibold">Insert Image</p>
      <button
        type="button"
        onclick={onClose}
        class="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
        aria-label="Close image dialog"
      >
        <X size={16} />
      </button>
    </div>

    <!-- Tabs -->
    <div class="flex gap-1 rounded-md bg-muted p-1">
      <button
        type="button"
        onclick={() => {
          activeTab = 'upload';
          urlError = '';
        }}
        class="flex-1 rounded px-3 py-1 text-xs font-medium transition-colors {activeTab === 'upload'
          ? 'bg-background shadow-sm'
          : 'text-muted-foreground hover:text-foreground'}"
      >
        Upload
      </button>
      <button
        type="button"
        onclick={() => {
          activeTab = 'url';
          urlError = '';
        }}
        class="flex-1 rounded px-3 py-1 text-xs font-medium transition-colors {activeTab === 'url'
          ? 'bg-background shadow-sm'
          : 'text-muted-foreground hover:text-foreground'}"
      >
        URL
      </button>
    </div>

    {#if activeTab === 'upload'}
      <div class="space-y-1">
        <ImageFileUpload
          file={selectedFile}
          disabled={uploading}
          onFileChange={(file) => {
            selectedFile = file;
            uploadError = '';
          }}
        />
        {#if uploading}
          <p class="text-xs text-muted-foreground">Uploading…</p>
        {/if}
        {#if uploadError}
          <div role="alert" class="text-xs leading-tight text-destructive">{uploadError}</div>
        {/if}
      </div>
    {:else}
      <div class="space-y-1">
        <input
          type="url"
          bind:this={urlInputEl}
          bind:value={urlValue}
          onkeydown={handleUrlKeydown}
          oninput={() => {
            urlError = '';
          }}
          placeholder="https://example.com/image.jpg"
          aria-invalid={Boolean(urlError)}
          class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
        {#if urlError}
          <div role="alert" class="text-xs leading-tight text-destructive">{urlError}</div>
        {/if}
      </div>
    {/if}

    <div class="flex justify-end gap-2">
      <button type="button" onclick={onClose} class="rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-muted">
        Cancel
      </button>
      <button
        type="button"
        onclick={activeTab === 'upload' ? handleUpload : handleUrlSubmit}
        disabled={uploading || (activeTab === 'upload' && !selectedFile)}
        class="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {activeTab === 'upload' ? (uploading ? 'Uploading…' : 'Upload') : 'Insert'}
      </button>
    </div>
  </div>
</div>
