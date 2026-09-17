<!-- apps/docs/src/components/examples/dialog/context/svelte.svelte -->
<script lang="ts">
  import { Dialog, DialogTitle, DialogDescription, DialogContent, DialogBackdrop, DialogContext } from '@cloudvoyant/helical-svelte';

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
    <DialogContext>
      {#snippet children(dialog)}
        <p class="text-sm text-muted-foreground">Dialog is {dialog().open ? 'open' : 'closed'}</p>
      {/snippet}
    </DialogContext>
    <DialogBackdrop />
    <DialogContent>
      <DialogTitle>Context</DialogTitle>
      <DialogDescription>The open state above is read via the dialog context.</DialogDescription>
    </DialogContent>
  </Dialog>
</div>
