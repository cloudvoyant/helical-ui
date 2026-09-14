<!-- libs/vortex-svelte/src/editor/FontColorPicker.svelte -->
<script lang="ts">
  import type { Editor } from '@tiptap/core';

  let {
    editor,
    visible = $bindable(false),
    mode = 'color',
  }: {
    editor: Editor;
    visible?: boolean;
    mode?: 'color' | 'highlight';
  } = $props();

  // Reading-friendly color palette with preview colors
  const textColors = [
    { id: 'red', preview: '#dc2626', name: 'Red' },
    { id: 'orange', preview: '#ea580c', name: 'Orange' },
    { id: 'yellow', preview: '#ca8a04', name: 'Yellow' },
    { id: 'green', preview: '#16a34a', name: 'Green' },
    { id: 'cyan', preview: '#0891b2', name: 'Cyan' },
    { id: 'blue', preview: '#2563eb', name: 'Blue' },
    { id: 'violet', preview: '#7c3aed', name: 'Violet' },
    { id: 'fuchsia', preview: '#c026d3', name: 'Fuchsia' },
    { id: 'slate', preview: '#64748b', name: 'Slate' },
  ];

  const highlightColors = [
    { id: 'yellow', preview: '#fef9c3', name: 'Yellow' },
    { id: 'blue', preview: '#dbeafe', name: 'Blue' },
    { id: 'green', preview: '#d1fae5', name: 'Green' },
    { id: 'red', preview: '#fee2e2', name: 'Red' },
    { id: 'fuchsia', preview: '#fae8ff', name: 'Fuchsia' },
    { id: 'orange', preview: '#ffedd5', name: 'Orange' },
    { id: 'violet', preview: '#ede9fe', name: 'Violet' },
    { id: 'cyan', preview: '#cffafe', name: 'Cyan' },
    { id: 'slate', preview: '#f1f5f9', name: 'Slate' },
  ];

  function selectColor(colorId: string) {
    if (mode === 'highlight') {
      // Highlight serializes this as an inline `background-color`, so use the actual preview
      // color rather than a bare CSS keyword such as `yellow`.
      const entry = highlightColors.find((color) => color.id === colorId);
      editor.chain().focus().toggleHighlight({ color: entry?.preview ?? colorId }).run();
    } else {
      // @tiptap/extension-color writes an inline `style`, so it needs a real CSS colour.
      // Passing the palette id ('slate') produces invalid CSS and silently does nothing.
      const entry = textColors.find((c) => c.id === colorId);
      editor
        .chain()
        .focus()
        .setColor(entry?.preview ?? colorId)
        .run();
    }
    visible = false;
  }

  function clearColor() {
    if (mode === 'highlight') {
      editor.chain().focus().unsetHighlight().run();
    } else {
      editor.chain().focus().unsetColor().run();
    }
    visible = false;
  }
</script>

{#if visible}
  <div class="absolute z-50 mt-2 w-48 rounded-lg border bg-background text-foreground p-1 shadow-lg">
    <div class="text-xs font-medium text-muted-foreground px-3 py-2">
      {mode === 'highlight' ? 'Highlight' : 'Color'}
    </div>
    <div class="flex flex-col">
      <!-- None/Clear option -->
      <button
        type="button"
        class="flex items-center gap-2 rounded px-3 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground transition-colors text-left"
        onclick={clearColor}
      >
        <div class="h-5 w-5 rounded border border-border flex-shrink-0 flex items-center justify-center">
          <span class="text-xs text-muted-foreground">×</span>
        </div>
        <span>None</span>
      </button>
      <!-- Color options -->
      {#each mode === 'highlight' ? highlightColors : textColors as color}
        <button
          type="button"
          class="flex items-center gap-2 rounded px-3 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground transition-colors text-left"
          onclick={() => selectColor(color.id)}
        >
          <div
            class="h-5 w-5 rounded border border-border flex-shrink-0"
            style="background-color: {color.preview}"
          ></div>
          <span>{color.name}</span>
        </button>
      {/each}
    </div>
  </div>
{/if}
