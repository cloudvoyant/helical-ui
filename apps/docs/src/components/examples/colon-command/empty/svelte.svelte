<!-- apps/docs/src/components/examples/colon-command/empty/svelte.svelte -->
<script lang="ts">
  // 1. Imports
  import { Button, ColonCommand } from '@cloudvoyant/helical-svelte';

  // --- State ---
  let open = $state(false);
</script>

<!-- Render -->
<div class="flex flex-col items-center gap-4">
  <Button
    variant="outline"
    data-testid="cc-empty-open"
    onclick={() => {
      open = true;
    }}
  >
    Open Empty Command Menu
  </Button>
  <ColonCommand items={[]} bind:open />
</div>
