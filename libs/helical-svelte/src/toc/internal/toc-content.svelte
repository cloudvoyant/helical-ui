<!-- libs/helical-svelte/src/toc/internal/toc-content.svelte -->
<!-- Vendored from Ark UI (chakra-ui/ark, packages/svelte/src/lib/components/toc/toc-content.svelte).
     Prop types live in ./types.ts — see the note there. -->
<script lang="ts">
  import { Ark } from '@ark-ui/svelte/factory';
  import type { TocContentProps } from './types';

  let { ref = $bindable(null), ...props }: TocContentProps = $props();
</script>

<Ark as="article" bind:ref {...props} />
