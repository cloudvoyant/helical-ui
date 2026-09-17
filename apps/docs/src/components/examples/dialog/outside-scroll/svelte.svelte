<!-- apps/docs/src/components/examples/dialog/outside-scroll/svelte.svelte -->
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
    <DialogContent positionerClass="overflow-y-auto">
      <DialogTitle>Extends Beyond Viewport</DialogTitle>
      <DialogDescription>The positioner scrolls so the dialog can exceed the viewport height.</DialogDescription>
      <div class="text-sm text-muted-foreground">
        {#each Array.from({ length: 30 }, (_, i) => i) as i}
          <p class="mb-2">Section {i + 1}: lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</p>
        {/each}
      </div>
    </DialogContent>
  </Dialog>
</div>
