<!-- apps/docs/src/components/examples/editor/bubble-menu/svelte.svelte -->
<script lang="ts">
  import { Editor, Prose } from '@cloudvoyant/vortex-svelte';

  const seed = JSON.stringify({
    type: 'doc',
    content: [
      { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Formatting' }] },
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Select any of this text to reveal the bubble menu: bold, italic, underline, colour, alignment, and links.',
          },
        ],
      },
    ],
  });
</script>

<Prose>
  <Editor content={seed} />
</Prose>
