<!-- apps/docs/src/components/examples/editor/default/svelte.svelte -->
<script lang="ts">
  import { Editor, Prose } from '@cloudvoyant/vortex-svelte';

  const seed = JSON.stringify({
    type: 'doc',
    content: [
      { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Getting Started' }] },
      {
        type: 'paragraph',
        content: [{ type: 'text', text: "Type '/' for commands, or select text for the bubble menu." }],
      },
    ],
  });
</script>

<Prose>
  <Editor content={seed} />
</Prose>
