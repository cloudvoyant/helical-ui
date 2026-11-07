<!-- apps/docs/src/components/examples/toast/action/svelte.svelte -->
<script lang="ts">
  import { Badge, Button, HStack, Toaster, createToaster } from '@cloudvoyant/helical-svelte';

  const actionToaster = createToaster({
    placement: 'bottom-end',
    overlap: true,
    max: 5,
  });

  let undone = $state(false);
</script>

<HStack class="flex-wrap items-center gap-3">
  <Button
    size="sm"
    variant="outline"
    data-testid="toast-action-trigger"
    onclick={() => {
      undone = false;
      actionToaster.create({
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
    }}
  >
    Archive File
  </Button>
  <Badge variant="subtle" color={undone ? 'success' : 'secondary'} data-testid="toast-action-state">
    {undone ? 'Restored' : 'Idle'}
  </Badge>
  <Toaster toaster={actionToaster} />
</HStack>
