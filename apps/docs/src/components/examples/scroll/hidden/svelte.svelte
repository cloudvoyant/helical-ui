<!-- apps/docs/src/components/examples/scroll/hidden/svelte.svelte -->
<script lang="ts">
  import { Scroll } from '@cloudvoyant/helical-svelte';

  const lines = Array.from({ length: 40 }, (_, i) => `Item ${i + 1}`);
</script>

<Scroll variant="hidden" class="h-56 w-64 rounded-md border border-border">
  <div class="p-4">
    {#each lines as line (line)}
      <div class="border-t border-border py-2 text-sm text-muted-foreground">{line}</div>
    {/each}
  </div>
</Scroll>
