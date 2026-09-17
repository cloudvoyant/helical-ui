<!-- apps/docs/src/components/examples/dialog/final-focus/svelte.svelte -->
<script lang="ts">
  import { Dialog, DialogTitle, DialogDescription, DialogContent, DialogBackdrop } from '@cloudvoyant/helical-svelte';

  let open = $state(false);
  let buttonEl: HTMLButtonElement | undefined = $state();
</script>

<div class="flex flex-col items-center gap-4">
  <button
    type="button"
    class="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
    onclick={() => (open = true)}
  >
    Open Dialog
  </button>
  <Dialog bind:open finalFocusEl={() => buttonEl}>
    <DialogBackdrop />
    <DialogContent>
      <DialogTitle>Final Focus</DialogTitle>
      <DialogDescription>Focus returns to the outlined button when this dialog closes.</DialogDescription>
    </DialogContent>
  </Dialog>
  <button type="button" bind:this={buttonEl} class="rounded-md border px-3 py-1.5 text-sm font-medium">
    Receive focus on close
  </button>
</div>
