<!-- apps/docs/src/components/examples/dialog/nested/svelte.svelte -->
<script lang="ts">
  import { Dialog, DialogTitle, DialogDescription, DialogContent, DialogBackdrop } from '@cloudvoyant/helical-svelte';

  let open = $state(false);
  let nestedOpen = $state(false);
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
      <DialogTitle>Outer Dialog</DialogTitle>
      <DialogDescription>Dialogs can be nested inside one another.</DialogDescription>
      <button
        type="button"
        class="mt-2 rounded-md bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground"
        onclick={() => (nestedOpen = true)}
      >
        Open Nested Dialog
      </button>
    </DialogContent>
  </Dialog>
  <Dialog bind:nestedOpen>
    <DialogBackdrop />
    <DialogContent>
      <DialogTitle>Inner Dialog</DialogTitle>
      <DialogDescription>This dialog sits on top of the outer one.</DialogDescription>
    </DialogContent>
  </Dialog>
</div>
