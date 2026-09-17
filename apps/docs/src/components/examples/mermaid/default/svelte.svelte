<!-- apps/docs/src/components/examples/mermaid/default/svelte.svelte -->
<script lang="ts">
  import { Mermaid } from '@cloudvoyant/helical-svelte';

  const code = `flowchart LR
  A[Source] --> B[Placeholder]
  B --> C{Client}
  C -->|loaded| D[Render SVG]
  C -->|failed| E[Keep source visible]`;
</script>

<Mermaid {code} />
