<!-- libs/helical-svelte/src/pagination/PaginationPrevious.svelte -->
<!-- Closely based on: Shark UI pagination (@ark-ui/svelte/pagination), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { PaginationPrevTrigger, type PaginationPrevTriggerProps } from '@ark-ui/svelte/pagination';
  import { paginationTriggerBase, cn } from '@cloudvoyant/helical-ui';

  let { class: className = '', children, ...rest }: PaginationPrevTriggerProps = $props();

  const classes = $derived(cn(paginationTriggerBase, className));
</script>

<PaginationPrevTrigger class={classes} {...rest}>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
  {#if children}
    {@render children()}
  {:else}
    Previous
  {/if}
</PaginationPrevTrigger>
