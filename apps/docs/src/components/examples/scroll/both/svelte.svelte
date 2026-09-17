<!-- apps/docs/src/components/examples/scroll/both/svelte.svelte -->
<script lang="ts">
  import { Scroll } from '@cloudvoyant/helical-svelte';
</script>

<Scroll orientation="both" class="h-64 w-64 rounded-md border border-border">
  <div class="h-[600px] w-[400px] p-4">
    <p class="text-sm">Content that overflows both horizontally and vertically.</p>
  </div>
</Scroll>
