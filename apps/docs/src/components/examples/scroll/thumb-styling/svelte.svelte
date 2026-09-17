<!-- apps/docs/src/components/examples/scroll/thumb-styling/svelte.svelte -->
<script lang="ts">
  import { Scroll } from '@cloudvoyant/helical-svelte';

  const items = Array.from({ length: 20 }, (_, i) => i + 1);
</script>

<Scroll class="h-64 w-64 rounded-md border border-border" thumbClass="bg-primary">
  <div class="p-4">
    {#each items as i (i)}
      <div class="py-1 text-sm">Item {i}</div>
    {/each}
  </div>
</Scroll>
