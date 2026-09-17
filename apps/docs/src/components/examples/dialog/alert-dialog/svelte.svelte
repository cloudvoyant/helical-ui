<!-- apps/docs/src/components/examples/dialog/alert-dialog/svelte.svelte -->
<script lang="ts">
  import { Dialog, DialogTitle, DialogDescription, DialogContent, DialogBackdrop } from '@cloudvoyant/helical-svelte';

  let open = $state(false);
</script>

<div class="flex flex-col items-center gap-4">
  <button
    type="button"
    class="rounded-md bg-destructive px-3 py-1.5 text-sm font-medium text-destructive-foreground"
    onclick={() => (open = true)}
  >
    Delete account
  </button>
  <Dialog role="alertdialog" bind:open>
    <DialogBackdrop />
    <DialogContent>
      <DialogTitle>Are you absolutely sure?</DialogTitle>
      <DialogDescription>This action cannot be undone. This will permanently delete your account and remove your data.</DialogDescription>
      <div class="flex justify-end gap-2">
        <button type="button" class="rounded-md border px-3 py-1.5 text-sm font-medium" onclick={() => (open = false)}>
          Cancel
        </button>
        <button
          type="button"
          class="rounded-md bg-destructive px-3 py-1.5 text-sm font-medium text-destructive-foreground"
          onclick={() => (open = false)}
        >
          Delete
        </button>
      </div>
    </DialogContent>
  </Dialog>
</div>
