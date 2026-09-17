<!-- apps/docs/src/components/examples/scroll/sizes/svelte.svelte -->
<script lang="ts">
  import { Scroll } from '@cloudvoyant/helical-svelte';

  const items = Array.from({ length: 12 }, (_, i) => `Item ${i + 1}`);
</script>

<div class="flex gap-4">
  <Scroll class="h-40 w-48 rounded-md border border-border [--scrollbar-size:0.25rem]">
    <div class="p-4">
      {#each items as item (item)}
        <div class="py-1 text-sm">{item}</div>
      {/each}
    </div>
  </Scroll>
  <Scroll class="h-40 w-48 rounded-md border border-border [--scrollbar-size:0.75rem]">
    <div class="p-4">
      {#each items as item (item)}
        <div class="py-1 text-sm">{item}</div>
      {/each}
    </div>
  </Scroll>
</div>
