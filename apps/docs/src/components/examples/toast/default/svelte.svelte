<!-- apps/docs/src/components/examples/toast/default/svelte.svelte -->
<script lang="ts">
  // 1. Imports
  import { Button, HStack, useToast } from '@cloudvoyant/helical-svelte';

  // --- State ---
  const toast = useToast();

  // --- Methods ---
  function handleShowToast() {
    toast.create({
      title: 'Scheduled: Catch up',
      description: 'Friday, February 10, 2026 at 5:57 PM',
      type: 'info',
    });
  }
</script>

<!-- Render -->
<HStack class="flex-wrap items-center gap-2">
  <Button variant="outline" onclick={handleShowToast}>
    Show Toast
  </Button>
</HStack>
