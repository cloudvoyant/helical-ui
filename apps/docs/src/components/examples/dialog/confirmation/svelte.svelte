<!-- apps/docs/src/components/examples/dialog/confirmation/svelte.svelte -->
<script lang="ts">
  import { Dialog, DialogTitle, DialogDescription, DialogContent, DialogBackdrop } from '@cloudvoyant/helical-svelte';

  let dirty = $state(true);
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
  <Dialog
    bind:open
    onEscapeKeyDown={(e) => {
      if (dirty) e.preventDefault();
    }}
    onInteractOutside={(e) => {
      if (dirty) e.preventDefault();
    }}
  >
    <DialogBackdrop />
    <DialogContent>
      <DialogTitle>Unsaved changes</DialogTitle>
      <DialogDescription>You have unsaved changes that will be lost. Leave anyway?</DialogDescription>
      <div class="flex justify-end gap-2">
        <button type="button" class="rounded-md border px-3 py-1.5 text-sm font-medium" onclick={() => (open = false)}>
          Cancel
        </button>
        <button
          type="button"
          class="rounded-md bg-destructive px-3 py-1.5 text-sm font-medium text-destructive-foreground"
          onclick={() => {
            dirty = false;
            open = false;
          }}
        >
          Discard
        </button>
      </div>
    </DialogContent>
  </Dialog>
</div>
