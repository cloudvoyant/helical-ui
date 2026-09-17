<!-- apps/docs/src/components/examples/dialog/root-provider/svelte.svelte -->
<script lang="ts">
  import { Dialog, DialogTitle, DialogDescription, DialogContent, DialogBackdrop } from '@cloudvoyant/helical-svelte';

  let open = $state(false);
</script>

<div class="flex flex-col items-center gap-4">
  <p class="text-sm text-muted-foreground">Dialog is {open ? 'open' : 'closed'}</p>
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
      <DialogTitle>Controlled Externally</DialogTitle>
      <DialogDescription>This dialog is controlled from a plain button outside.</DialogDescription>
    </DialogContent>
  </Dialog>
</div>
