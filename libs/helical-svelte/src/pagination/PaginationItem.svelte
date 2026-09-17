<!-- libs/helical-svelte/src/pagination/PaginationItem.svelte -->
<!-- Closely based on: Shark UI pagination (@ark-ui/svelte/pagination), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { PaginationItem, type PaginationItemProps } from '@ark-ui/svelte/pagination';
  import { paginationItemBase, cn } from '@cloudvoyant/helical-ui';

  let { type = 'page', value, class: className = '', children, ...rest }: PaginationItemProps = $props();

  const classes = $derived(cn(paginationItemBase, className));
</script>

<PaginationItem {type} {value} class={classes} {...rest}>
  {@render children?.()}
</PaginationItem>
