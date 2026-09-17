<!-- apps/docs/src/components/examples/dialog/default/svelte.svelte -->
<script lang="ts">
  import { Dialog, DialogTitle, DialogDescription, DialogDismiss, DialogContent, DialogBackdrop } from '@cloudvoyant/helical-svelte';
  import { X } from 'lucide-svelte';

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
    <DialogContent>
      <DialogDismiss>
        <X />
      </DialogDismiss>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
    </DialogContent>
  </Dialog>
</div>
