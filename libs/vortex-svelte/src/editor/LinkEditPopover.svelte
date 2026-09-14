<script lang="ts">
  import { onMount } from 'svelte';
  import type { Editor } from '@tiptap/core';
  import { Trash2, Globe, ExternalLink } from 'lucide-svelte';

  interface Props {
    editor: Editor;
    initialUrl?: string;
    onClose: () => void;
  }

  let { editor, initialUrl = '', onClose }: Props = $props();

  let linkUrl = $derived(initialUrl);
  let inputElement: HTMLInputElement;
  let isFocused = $state(false);

  onMount(() => inputElement?.focus());

  function saveAndClose() {
    if (linkUrl.trim()) {
      editor.chain().focus().setLink({ href: linkUrl.trim() }).run();
    } else {
      // If empty, remove the link
      editor.chain().focus().unsetLink().run();
    }
    onClose();
  }

  function removeLink() {
    editor.chain().focus().unsetLink().run();
    onClose();
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === 'Escape') {
      event.preventDefault();
      saveAndClose();
    }
  }

  function handleBlur() {
    isFocused = false;
    // Small delay to allow clicking trash button
    setTimeout(saveAndClose, 100);
  }
</script>

<div
  data-link-editor
  role="dialog"
  aria-label="Edit link"
  class="absolute start-0 top-full z-50 mt-2 rounded border shadow-lg bg-popover text-popover-foreground"
  class:border-border={!isFocused}
  class:border-ring={isFocused}
  style="width: 280px"
>
  <div class="flex items-center gap-2 px-2">
    <span class="text-foreground/60 flex-shrink-0">
      <Globe size={16} />
    </span>
    <input
      bind:this={inputElement}
      type="text"
      bind:value={linkUrl}
      placeholder="Enter URL"
      class="flex-1 px-1.5 my-1 text-sm outline-none border-none rounded"
      class:bg-muted={!isFocused}
      class:bg-background={isFocused}
      style="padding-top: 0.25rem !important; padding-bottom: 0.25rem !important;"
      onkeydown={handleKeydown}
      onfocus={() => (isFocused = true)}
      onblur={handleBlur}
    />
    <button
      type="button"
      class="rounded p-1 hover:bg-accent hover:text-accent-foreground text-foreground/60 hover:text-foreground flex-shrink-0"
      onclick={removeLink}
      title="Remove link"
    >
      <Trash2 size={16} />
    </button>
    {#if linkUrl}
      <a
        href={linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        class="rounded p-1 hover:bg-accent hover:text-accent-foreground text-foreground/60 hover:text-foreground flex-shrink-0"
        title="Open in new tab"
      >
        <ExternalLink size={16} />
      </a>
    {/if}
  </div>
</div>
