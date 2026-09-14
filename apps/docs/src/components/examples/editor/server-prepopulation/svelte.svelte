<!-- Astro or SvelteKit can fetch this serialized JSON on the server and pass it as content. -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { Editor, Prose, Reader } from '@cloudvoyant/vortex-svelte';

  const serverContent = JSON.stringify({
    type: 'doc',
    content: [
      { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Server-populated draft' }] },
      {
        type: 'paragraph',
        content: [{ type: 'text', text: 'This content is present in the server HTML before the editor hydrates.' }],
      },
    ],
  });

  let { content = serverContent }: { content?: string } = $props();
  let hydrated = $state(false);
  onMount(() => {
    hydrated = true;
  });
</script>

<Prose>
  {#if hydrated}
    <Editor {content} />
  {:else}
    <div data-editor-server-prepopulation>
      <Reader {content} />
    </div>
  {/if}
</Prose>
