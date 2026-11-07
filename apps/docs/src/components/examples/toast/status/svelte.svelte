<!-- apps/docs/src/components/examples/toast/status/svelte.svelte -->
<script lang="ts">
  import { Button, HStack, Toaster, createToaster } from '@cloudvoyant/helical-svelte';

  const statusToaster = createToaster({
    placement: 'bottom-end',
    overlap: true,
    max: 5,
  });
</script>

<HStack class="flex-wrap items-center gap-2">
  <Button
    size="sm"
    variant="outline"
    data-testid="toast-status-info"
    onclick={() =>
      statusToaster.create({
        title: 'Update available',
        description: 'A new version of helical-ui is ready to install.',
        type: 'info',
      })}
  >
    Info
  </Button>
  <Button
    size="sm"
    variant="outline"
    color="success"
    data-testid="toast-status-success"
    onclick={() =>
      statusToaster.create({
        title: 'Changes saved',
        description: 'Your workspace preferences have been updated.',
        type: 'success',
      })}
  >
    Success
  </Button>
  <Button
    size="sm"
    variant="outline"
    color="warn"
    data-testid="toast-status-warning"
    onclick={() =>
      statusToaster.create({
        title: 'Rate limit approaching',
        description: '85% of your hourly API quota has been consumed.',
        type: 'warning',
      })}
  >
    Warning
  </Button>
  <Button
    size="sm"
    variant="outline"
    color="danger"
    data-testid="toast-status-error"
    onclick={() =>
      statusToaster.create({
        title: 'Deployment failed',
        description: 'Could not reach the remote build cluster.',
        type: 'error',
      })}
  >
    Error
  </Button>
  <Toaster toaster={statusToaster} />
</HStack>
