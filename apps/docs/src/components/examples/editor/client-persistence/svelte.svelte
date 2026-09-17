<!-- Persist serialized Tiptap JSON in browser storage and restore it after a reload. -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { Editor, Prose } from '@cloudvoyant/helical-svelte';

  const STORAGE_KEY = 'vortex-editor-client-persistence-v1';
  const seed = JSON.stringify({
    type: 'doc',
    content: [
      { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Persistent draft' }] },
      { type: 'paragraph', content: [{ type: 'text', text: 'Edit this text, then reload the page.' }] },
    ],
  });

  let content = $state('');
  let ready = $state(false);

  onMount(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    content = seed;
    if (stored) {
      try {
        if (JSON.parse(stored)?.type === 'doc') content = stored;
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    ready = true;
  });
</script>

{#if ready}
  <Prose>
    <Editor
      {content}
      onchange={({ content: nextContent }) => localStorage.setItem(STORAGE_KEY, nextContent)}
    />
    <p class="mt-2 text-xs text-muted-foreground" data-editor-persistence>
      Changes are saved in this browser. Reload the page to restore them.
    </p>
  </Prose>
{:else}
  <p class="text-sm text-muted-foreground">Loading saved draft…</p>
{/if}
