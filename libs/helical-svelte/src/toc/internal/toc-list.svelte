<!-- libs/helical-svelte/src/toc/internal/toc-list.svelte -->
<!-- Vendored from Ark UI (chakra-ui/ark, packages/svelte/src/lib/components/toc/toc-list.svelte).
     Prop types live in ./types.ts — see the note there. -->
<script lang="ts">
  import { Ark } from '@ark-ui/svelte/factory';
  import { mergeProps } from '@zag-js/svelte';
  import { useTocContext } from './use-toc-context';
  import type { TocListProps } from './types';

  let { ref = $bindable(null), ...props }: TocListProps = $props();
  const toc = useTocContext();
  const mergedProps = $derived(mergeProps(toc().getListProps(), props));
</script>

<Ark as="ul" bind:ref {...mergedProps} />
