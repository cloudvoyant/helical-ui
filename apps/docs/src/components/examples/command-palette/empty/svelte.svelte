<!-- apps/docs/src/components/examples/command-palette/empty/svelte.svelte -->
<script lang="ts">
  // 1. Imports
  import { Button, CommandPalette } from '@cloudvoyant/helical-svelte';

  // --- State ---
  let open = $state(false);
</script>

<!-- Render -->
<div class="flex flex-col items-center gap-4">
  <Button
    variant="outline"
    onclick={() => {
      open = true;
    }}
  >
    Open Empty Command Palette
  </Button>
  <CommandPalette items={[]} bind:open />
</div>
