<!-- apps/docs/src/components/examples/scroll/horizontal/svelte.svelte -->
<script lang="ts">
  import { Scroll } from '@cloudvoyant/helical-svelte';

  const items = Array.from({ length: 20 }, (_, i) => i + 1);
</script>

<Scroll orientation="horizontal" class="h-24 w-full rounded-md border border-border">
  <div class="flex gap-2 p-4">
    {#each items as item (item)}
      <div class="shrink-0 rounded-md bg-muted px-3 py-1 text-sm">Item {item}</div>
    {/each}
  </div>
</Scroll>
