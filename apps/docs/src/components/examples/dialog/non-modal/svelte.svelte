<!-- apps/docs/src/components/examples/dialog/non-modal/svelte.svelte -->
<script lang="ts">
  import { Dialog, DialogTitle, DialogDescription, DialogContent } from '@cloudvoyant/helical-svelte';

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
  <Dialog bind:open modal={false}>
    <DialogContent>
      <DialogTitle>Non-Modal Dialog</DialogTitle>
      <DialogDescription>You can interact with the page behind this dialog.</DialogDescription>
    </DialogContent>
  </Dialog>
</div>
