<!-- apps/docs/src/components/examples/dialog/initial-focus/svelte.svelte -->
<script lang="ts">
  import { Dialog, DialogTitle, DialogDescription, DialogContent, DialogBackdrop } from '@cloudvoyant/helical-svelte';

  let open = $state(false);
  let inputEl: HTMLInputElement | undefined = $state();
</script>

<div class="flex flex-col items-center gap-4">
  <button
    type="button"
    class="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
    onclick={() => (open = true)}
  >
    Open Dialog
  </button>
  <Dialog bind:open initialFocusEl={() => inputEl}>
    <DialogBackdrop />
    <DialogContent>
      <DialogTitle>Edit Name</DialogTitle>
      <DialogDescription>The input below receives focus when the dialog opens.</DialogDescription>
      <input
        bind:this={inputEl}
        class="mt-2 h-9 rounded-md border border-input bg-transparent px-2.5 text-sm focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30"
        placeholder="Enter your name"
      />
    </DialogContent>
  </Dialog>
</div>
