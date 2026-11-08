<!-- libs/helical-svelte/src/toc/internal/toc-item.svelte -->
<!-- Vendored from Ark UI (chakra-ui/ark, packages/svelte/src/lib/components/toc/toc-item.svelte).
     Prop types live in ./types.ts — see the note there. -->
<script lang="ts">
  import { Ark } from '@ark-ui/svelte/factory';
  import { mergeProps } from '@zag-js/svelte';
  import type { ItemProps } from '@zag-js/toc';
  import { createSplitProps } from './utils/create-split-props';
  import { useTocContext } from './use-toc-context';
  import { TocItemPropsProvider } from './use-toc-item-props-context';
  import type { TocItemProps } from './types';

  let { ref = $bindable(null), ...props }: TocItemProps = $props();
  const [itemProps, localProps] = $derived(createSplitProps<ItemProps>()(props, ['item']));
  const toc = useTocContext();
  const mergedProps = $derived(mergeProps(toc().getItemProps(itemProps), localProps));

  TocItemPropsProvider(() => itemProps);
</script>

<Ark as="li" bind:ref {...mergedProps} />
