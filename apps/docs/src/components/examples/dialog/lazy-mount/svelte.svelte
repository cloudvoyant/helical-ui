<!-- apps/docs/src/components/examples/dialog/lazy-mount/svelte.svelte -->
<script lang="ts">
  import { Dialog, DialogTitle, DialogDescription, DialogContent, DialogBackdrop } from '@cloudvoyant/helical-svelte';

  let open = $state(false);
</script>

<div class="flex flex-col items-center gap-4">
  <button
    type="button"
    class="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
    onclick={() => (open = true)}
  >
    Open Dialog
  </button>
  <Dialog bind:open lazyMount unmountOnExit>
    <DialogBackdrop />
    <DialogContent>
      <DialogTitle>Lazy Mounted</DialogTitle>
      <DialogDescription>This dialog mounts only when first opened and unmounts when closed.</DialogDescription>
    </DialogContent>
  </Dialog>
</div>
