<!-- libs/helical-svelte/src/pagination/PaginationItems.svelte -->
<!-- Closely based on: Shark UI pagination (@ark-ui/svelte/pagination), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { PaginationContext } from '@ark-ui/svelte/pagination';
  import PaginationItem from './PaginationItem.svelte';
  import PaginationEllipsis from './PaginationEllipsis.svelte';
</script>

<PaginationContext>
  {#snippet render(pagination)}
    {#each pagination().pages as page, index}
      {#if page.type === 'page'}
        <PaginationItem type="page" value={page.value}>
          {page.value}
        </PaginationItem>
      {:else}
        <PaginationEllipsis {index} />
      {/if}
    {/each}
  {/snippet}
</PaginationContext>
