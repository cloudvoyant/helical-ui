<!-- Server-rendered Reader example. Demo.astro loads this through SsrRouter without a client directive. -->
<script lang="ts">
  import { Reader } from '@cloudvoyant/vortex-svelte';

  const content = JSON.stringify({
    type: 'doc',
    content: [
      { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Server-rendered article' }] },
      {
        type: 'paragraph',
        content: [{ type: 'text', text: 'Reader turns saved Tiptap JSON into HTML during server rendering.' }],
      },
      {
        type: 'blockquote',
        content: [{ type: 'paragraph', content: [{ type: 'text', text: 'No browser editor instance is created.' }] }],
      },
    ],
  });
</script>

<Reader {content} />
