<!-- libs/helical-svelte/src/toc/internal/toc-indicator.svelte -->
<!-- Vendored from Ark UI (chakra-ui/ark, packages/svelte/src/lib/components/toc/toc-indicator.svelte).
     Prop types live in ./types.ts — see the note there. -->
<script lang="ts">
  import { Ark } from '@ark-ui/svelte/factory';
  import { mergeProps } from '@zag-js/svelte';
  import { useTocContext } from './use-toc-context';
  import type { TocIndicatorProps } from './types';

  let { ref = $bindable(null), ...props }: TocIndicatorProps = $props();
  const toc = useTocContext();
  const mergedProps = $derived(mergeProps(toc().getIndicatorProps(), props));
</script>

<Ark as="div" bind:ref {...mergedProps} />
