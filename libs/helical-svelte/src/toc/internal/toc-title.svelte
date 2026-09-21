<!-- libs/helical-svelte/src/toc/internal/toc-title.svelte -->
<!-- Vendored from Ark UI (chakra-ui/ark, packages/svelte/src/lib/components/toc/toc-title.svelte).
     Prop types live in ./types.ts — see the note there. -->
<script lang="ts">
  import { Ark } from '@ark-ui/svelte/factory';
  import { mergeProps } from '@zag-js/svelte';
  import { useTocContext } from './use-toc-context';
  import type { TocTitleProps } from './types';

  let { ref = $bindable(null), ...props }: TocTitleProps = $props();
  const toc = useTocContext();
  const mergedProps = $derived(mergeProps(toc().getTitleProps(), props));
</script>

<Ark as="h2" bind:ref {...mergedProps} />
