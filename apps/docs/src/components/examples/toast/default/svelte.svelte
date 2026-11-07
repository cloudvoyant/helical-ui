<!-- apps/docs/src/components/examples/toast/default/svelte.svelte -->
<script lang="ts">
  import { Button, HStack, Toaster, createToaster } from '@cloudvoyant/helical-svelte';

  const toaster = createToaster({
    placement: 'bottom-end',
    overlap: true,
    max: 5,
  });
</script>

<HStack class="flex-wrap items-center gap-2">
  <Button
    variant="outline"
    data-testid="toast-default-trigger"
    onclick={() =>
      toaster.create({
        title: 'Scheduled: Catch up',
        description: 'Friday, February 10, 2026 at 5:57 PM',
        type: 'info',
      })}
  >
    Show Toast
  </Button>
  <Toaster {toaster} />
</HStack>
