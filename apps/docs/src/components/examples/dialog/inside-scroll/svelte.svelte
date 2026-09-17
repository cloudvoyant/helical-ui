<!-- apps/docs/src/components/examples/dialog/inside-scroll/svelte.svelte -->
<script lang="ts">
  import {
    Dialog,
    DialogTitle,
    DialogDescription,
    DialogHeader,
    DialogFooter,
    DialogContent,
    DialogBackdrop,
  } from '@cloudvoyant/helical-svelte';
  import { Scroll } from '@cloudvoyant/helical-svelte';

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
    <DialogContent class="flex max-h-[420px] flex-col gap-0 overflow-hidden p-0">
      <DialogHeader sticky class="px-6 pt-6 pb-4">
        <DialogTitle>Terms and Conditions</DialogTitle>
        <DialogDescription>Scroll inside the dialog while the header and footer stay put.</DialogDescription>
      </DialogHeader>
      <Scroll class="min-h-0 flex-1">
        <div class="p-6 text-sm text-muted-foreground">
          {#each Array.from({ length: 40 }, (_, i) => i) as i}
            <p class="mb-2">Clause {i + 1}: lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          {/each}
        </div>
      </Scroll>
      <DialogFooter sticky class="px-6 py-4">
        <button type="button" class="rounded-md border px-3 py-1.5 text-sm font-medium" onclick={() => (open = false)}>
          Decline
        </button>
        <button
          type="button"
          class="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
          onclick={() => (open = false)}
        >
          Accept
        </button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</div>
