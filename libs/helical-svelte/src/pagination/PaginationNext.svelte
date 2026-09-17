<!-- libs/helical-svelte/src/pagination/PaginationNext.svelte -->
<!-- Closely based on: Shark UI pagination (@ark-ui/svelte/pagination), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { PaginationNextTrigger, type PaginationNextTriggerProps } from '@ark-ui/svelte/pagination';
  import { paginationTriggerBase, cn } from '@cloudvoyant/helical-ui';

  let { class: className = '', children, ...rest }: PaginationNextTriggerProps = $props();

  const classes = $derived(cn(paginationTriggerBase, className));
</script>

<PaginationNextTrigger class={classes} {...rest}>
  {#if children}
    {@render children()}
  {:else}
    Next
  {/if}
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
</PaginationNextTrigger>
