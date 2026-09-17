<!-- apps/docs/src/components/examples/editor/link-editing/svelte.svelte -->
<!-- Chat-style input (no Prose) demonstrating paste-a-URL and inline link editing. -->
<script lang="ts">
  import { Editor } from '@cloudvoyant/helical-svelte';

  const seed = JSON.stringify({
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Paste a URL (e.g. https://tiptap.dev) to create a normal link; select linked text to edit its URL and label.',
          },
        ],
      },
    ],
  });
  const compactEditor = { enforceTitle: false };
</script>

<div class="rounded-lg border border-input p-3">
  <Editor content={seed} {...compactEditor} />
</div>
