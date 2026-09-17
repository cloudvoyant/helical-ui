<!-- apps/docs/src/components/examples/dialog/controlled/svelte.svelte -->
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
  <Dialog bind:open>
    <DialogBackdrop />
    <DialogContent>
      <DialogTitle>Controlled Dialog</DialogTitle>
      <DialogDescription>This dialog is fully controlled by the checkbox.</DialogDescription>
    </DialogContent>
  </Dialog>
  <label class="flex items-center gap-2 text-sm text-muted-foreground">
    <input type="checkbox" bind:checked={open} />
    Open
  </label>
</div>
