<!-- apps/docs/src/components/examples/dialog/fullscreen/svelte.svelte -->
<script lang="ts">
  import {
    Dialog,
    DialogTitle,
    DialogDescription,
    DialogHeader,
    DialogFooter,
    DialogDismiss,
    DialogContent,
    DialogBackdrop,
  } from '@cloudvoyant/helical-svelte';
  import { Scroll } from '@cloudvoyant/helical-svelte';
  import { X } from 'lucide-svelte';

  let open = $state(false);
</script>

<div class="flex flex-col items-center gap-4">
  <button
    type="button"
    class="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
    onclick={() => (open = true)}
  >
    Open Fullscreen
  </button>
  <Dialog bind:open>
    <DialogBackdrop />
    <DialogContent fullscreen class="flex flex-col gap-0">
      <DialogHeader sticky class="border-b px-6 py-4">
        <div class="flex items-center justify-between">
          <DialogTitle>Fullscreen</DialogTitle>
          <DialogDismiss>
            <X />
          </DialogDismiss>
        </div>
        <DialogDescription>This dialog fills the whole viewport, edge to edge.</DialogDescription>
      </DialogHeader>
      <Scroll class="min-h-0 flex-1">
        <div class="p-6 text-sm text-muted-foreground">
          {#each Array.from({ length: 40 }, (_, i) => i) as i}
            <p class="mb-2">Clause {i + 1}: lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          {/each}
        </div>
      </Scroll>
      <DialogFooter sticky class="border-t px-6 py-4">
        <button type="button" class="rounded-md border px-3 py-1.5 text-sm font-medium" onclick={() => (open = false)}>
          Cancel
        </button>
        <button
          type="button"
          class="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
          onclick={() => (open = false)}
        >
          Save
        </button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</div>
