<!-- apps/docs/src/components/examples/toast/status/svelte.svelte -->
<script lang="ts">
  // 1. Imports
  import { Button, HStack, useToast } from '@cloudvoyant/helical-svelte';

  // --- State ---
  const toast = useToast();

  // --- Methods ---
  function showInfo() {
    toast.create({
      title: 'Update available',
      description: 'A new version of helical-ui is ready to install.',
      type: 'info',
    });
  }

  function showSuccess() {
    toast.create({
      title: 'Changes saved',
      description: 'Your workspace preferences have been updated.',
      type: 'success',
    });
  }

  function showWarning() {
    toast.create({
      title: 'Rate limit approaching',
      description: '85% of your hourly API quota has been consumed.',
      type: 'warning',
    });
  }

  function showError() {
    toast.create({
      title: 'Deployment failed',
      description: 'Could not reach the remote build cluster.',
      type: 'error',
    });
  }
</script>

<!-- Render -->
<HStack class="flex-wrap items-center gap-2">
  <Button size="sm" variant="outline" data-testid="toast-status-info" onclick={showInfo}>
    Info
  </Button>
  <Button
    size="sm"
    variant="outline"
    color="success"
    data-testid="toast-status-success"
    onclick={showSuccess}
  >
    Success
  </Button>
  <Button
    size="sm"
    variant="outline"
    color="warn"
    data-testid="toast-status-warning"
    onclick={showWarning}
  >
    Warning
  </Button>
  <Button
    size="sm"
    variant="outline"
    color="danger"
    data-testid="toast-status-error"
    onclick={showError}
  >
    Error
  </Button>
</HStack>
