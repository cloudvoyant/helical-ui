<!-- apps/docs/src/components/examples/popover/dialog-integration/svelte.svelte -->
<script lang="ts">
  import {
    Dialog,
    DialogTrigger,
    DialogTitle,
    DialogDescription,
    DialogDismiss,
    DialogContent,
    DialogBackdrop,
  } from '@cloudvoyant/helical-svelte';
  import { Popover, PopoverTrigger, PopoverTitle, PopoverDescription, PopoverContent } from '@cloudvoyant/helical-svelte';
  import { X } from 'lucide-svelte';
</script>

<Dialog>
  <DialogTrigger class="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">
    Open Dialog
  </DialogTrigger>
  <DialogBackdrop />
  <DialogContent>
    <DialogDismiss>
      <X />
    </DialogDismiss>
    <DialogTitle>Edit Profile</DialogTitle>
    <DialogDescription>Update your profile information below.</DialogDescription>
    <Popover lazyMount unmountOnExit>
      <PopoverTrigger class="rounded-md bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground">
        More Options
      </PopoverTrigger>
      <PopoverContent arrow>
        <PopoverTitle>Additional Settings</PopoverTitle>
        <PopoverDescription>This popover renders correctly above the dialog.</PopoverDescription>
      </PopoverContent>
    </Popover>
  </DialogContent>
</Dialog>
