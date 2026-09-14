<!-- apps/docs/src/components/examples/editor/heading-enforcement/svelte.svelte -->
<script lang="ts">
  import { Editor, Prose } from '@cloudvoyant/vortex-svelte';

  const seed = JSON.stringify({
    type: 'doc',
    content: [
      {
        type: 'heading',
        attrs: { level: 1 },
        content: [{ type: 'text', text: 'Try to delete this title' }],
      },
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Select all and delete — the H1 is re-created automatically and cannot be removed or demoted.',
          },
        ],
      },
    ],
  });
</script>

<Prose>
  <Editor content={seed} />
</Prose>
