<!-- libs/helical-svelte/src/select/SelectItem.svelte -->
<!-- Closely based on: Shark UI select (@ark-ui/svelte/select), mirrored from @cloudvoyant/helical-react -->
<!-- Note: adapted to Ark UI v5 — SelectItem takes `item` (the collection item). -->
<script lang="ts">
  import { SelectItem, type SelectItemProps } from '@ark-ui/svelte/select';
  import { selectItemBase, cn } from '@cloudvoyant/helical-ui';
  import type { SelectItemData } from '@cloudvoyant/helical-ui';

  type Props = Omit<SelectItemProps, 'item'> & {
    item: SelectItemData;
    class?: string;
  };

  let { item, class: className = '', children, ...rest }: Props = $props();

  const classes = $derived(cn(selectItemBase, className));
</script>

<SelectItem {item} class={classes} {...rest}>
  {@render children?.()}
</SelectItem>
