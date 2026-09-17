<!-- libs/helical-svelte/src/combobox/ComboboxItem.svelte -->
<!-- Closely based on: Shark UI combobox (@ark-ui/svelte/combobox), mirrored from @cloudvoyant/helical-react -->
<!-- Note: adapted to Ark UI v5 — ComboboxItem takes `item` (the collection item). -->
<script lang="ts">
  import { ComboboxItem, type ComboboxItemProps } from '@ark-ui/svelte/combobox';
  import { comboboxItemVariants, cn } from '@cloudvoyant/helical-ui';
  import type { SelectItemData } from '@cloudvoyant/helical-ui';

  type Props = Omit<ComboboxItemProps, 'item'> & {
    item: SelectItemData;
    showIndicator?: boolean;
    class?: string;
  };

  let { item, showIndicator = true, class: className = '', children, ...rest }: Props = $props();

  const classes = $derived(cn(comboboxItemVariants({ showIndicator }), className));
</script>

<ComboboxItem {item} persistFocus class={classes} {...rest}>
  {@render children?.()}
</ComboboxItem>
