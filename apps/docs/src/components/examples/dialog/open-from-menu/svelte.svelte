<!-- apps/docs/src/components/examples/dialog/open-from-menu/svelte.svelte -->
<script lang="ts">
  import { Dialog, DialogTitle, DialogDescription, DialogContent, DialogBackdrop } from '@cloudvoyant/helical-svelte';

  let open = $state(false);
</script>

<div class="flex flex-col items-center gap-4">
  <button
    type="button"
    class="rounded-md bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground"
    onclick={() => (open = true)}
  >
    Open dialog from a menu item
  </button>
  <Dialog bind:open>
    <DialogBackdrop />
    <DialogContent>
      <DialogTitle>Opened Externally</DialogTitle>
      <DialogDescription>This dialog was opened by setting state from a plain button, no trigger needed.</DialogDescription>
    </DialogContent>
  </Dialog>
</div>
