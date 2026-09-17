<!-- apps/docs/src/components/examples/pagination/default/svelte.svelte -->
<script lang="ts">
  import { Pagination, PaginationItems, PaginationPrevious, PaginationNext } from '@cloudvoyant/helical-svelte';
</script>

<Pagination count={50}>
  <PaginationPrevious />
  <PaginationItems />
  <PaginationNext />
</Pagination>
