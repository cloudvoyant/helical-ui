<!-- apps/docs/src/components/examples/pagination/controlled/svelte.svelte -->
<script lang="ts">
  import { Pagination, VStack, PaginationItems, PaginationPrevious, PaginationNext } from '@cloudvoyant/helical-svelte';

  let page = $state(2);
</script>

<VStack class="items-center gap-2">
  <Pagination count={120} {page} onPageChange={(details) => (page = details.page)}>
    <PaginationPrevious />
    <PaginationItems />
    <PaginationNext />
  </Pagination>
  <p class="text-sm text-muted-foreground">Page {page} of 12</p>
</VStack>
