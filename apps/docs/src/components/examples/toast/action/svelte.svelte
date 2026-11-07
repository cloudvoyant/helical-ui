<!-- apps/docs/src/components/examples/toast/action/svelte.svelte -->
<script lang="ts">
  // 1. Imports
  import { Badge, Button, HStack, useToast } from '@cloudvoyant/helical-svelte';

  // --- State ---
  const toast = useToast();
  let undone = $state(false);

  // --- Methods ---
  function handleArchive() {
    undone = false;
    toast.create({
      title: 'File archived',
      description: 'Moved quarterly-report.mdx to archive.',
      type: 'info',
      action: {
        label: 'Undo',
        onClick: () => {
          undone = true;
        },
      },
    });
  }
</script>

<!-- Render -->
<HStack class="flex-wrap items-center gap-3">
  <Button size="sm" variant="outline" data-testid="toast-action-trigger" onclick={handleArchive}>
    Archive File
  </Button>
  <Badge variant="subtle" color={undone ? 'success' : 'secondary'} data-testid="toast-action-state">
    {undone ? 'Restored' : 'Idle'}
  </Badge>
</HStack>
