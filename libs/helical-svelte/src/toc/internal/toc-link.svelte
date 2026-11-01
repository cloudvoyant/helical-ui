<!-- libs/helical-svelte/src/toc/internal/toc-link.svelte -->
<!-- Vendored from Ark UI (chakra-ui/ark, packages/svelte/src/lib/components/toc/toc-link.svelte).
     Prop types live in ./types.ts — see the note there. -->
<script lang="ts">
  import { Ark } from '@ark-ui/svelte/factory';
  import { mergeProps } from '@zag-js/svelte';
  import { useTocContext } from './use-toc-context';
  import { useTocItemPropsContext } from './use-toc-item-props-context';
  import type { TocLinkProps } from './types';

  let { ref = $bindable(null), ...props }: TocLinkProps = $props();
  const toc = useTocContext();
  const itemProps = useTocItemPropsContext();
  const mergedProps = $derived(mergeProps(toc().getLinkProps(itemProps()), props));
</script>

<Ark as="a" bind:ref {...mergedProps} />
