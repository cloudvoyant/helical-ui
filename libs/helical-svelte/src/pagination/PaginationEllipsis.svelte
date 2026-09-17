<!-- libs/helical-svelte/src/pagination/PaginationEllipsis.svelte -->
<!-- Closely based on: Shark UI pagination (@ark-ui/svelte/pagination), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { PaginationEllipsis, type PaginationEllipsisProps } from '@ark-ui/svelte/pagination';
  import { paginationEllipsisBase, cn } from '@cloudvoyant/helical-ui';

  let { index, class: className = '', ...rest }: PaginationEllipsisProps = $props();

  const classes = $derived(cn(paginationEllipsisBase, className));
</script>

<PaginationEllipsis {index} class={classes} {...rest}>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </svg>
</PaginationEllipsis>
