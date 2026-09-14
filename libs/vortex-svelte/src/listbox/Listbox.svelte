<!-- libs/vortex-svelte/src/listbox/Listbox.svelte -->
<!-- Closely based on: Ark UI listbox (@ark-ui/svelte/listbox), mirrored from @cloudvoyant/vortex-react. -->
<!-- Thin pass-through: owns the collection; the consumer renders the Listbox parts as children. -->
<!-- There is intentionally no filterFn/filterQuery seam — filtering the collection without -->
<!-- filtering the children would desync them. Filter `items` yourself and pass the result. -->
<script lang="ts">
  import {
    ListboxRoot,
    createListCollection,
    type ListboxRootProps,
    type CollectionItem,
    type ListCollection,
  } from '@ark-ui/svelte/listbox';
  import { listboxRootBase, cn, type ListboxItemData } from '@cloudvoyant/vortex-ui';
  import type { Snippet } from 'svelte';

  type Props = Omit<ListboxRootProps<CollectionItem>, 'collection'> & {
    items?: ListboxItemData[];
    collection?: ListCollection<CollectionItem>;
    class?: string;
    children?: Snippet;
  };

  let { items = [], collection, class: className = '', children, ...rest }: Props = $props();

  const resolvedCollection = $derived(collection ?? createListCollection({ items }));

  const classes = $derived(cn(listboxRootBase, className));
</script>

<ListboxRoot collection={resolvedCollection} class={classes} {...rest}>
  {#if children}{@render children()}{/if}
</ListboxRoot>
