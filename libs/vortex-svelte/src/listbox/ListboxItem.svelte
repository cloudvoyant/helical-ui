<!-- libs/vortex-svelte/src/listbox/ListboxItem.svelte -->
<!-- Pass-through, matching SelectItem: `children` are the row's CONTENT. Compose -->
<!-- ListboxItemText / ListboxItemIndicator inside. -->
<script lang="ts">
  import { ListboxItem, type ListboxItemProps, type CollectionItem } from '@ark-ui/svelte/listbox';
  import { listboxItemBase, cn } from '@cloudvoyant/vortex-ui';
  import type { Snippet } from 'svelte';

  type Props = Omit<ListboxItemProps, 'item'> & {
    item: CollectionItem;
    class?: string;
    children?: Snippet;
  };

  let { item, class: className = '', children, ...rest }: Props = $props();
</script>

<ListboxItem {item} class={cn(listboxItemBase, className)} {...rest}>
  {@render children?.()}
</ListboxItem>
