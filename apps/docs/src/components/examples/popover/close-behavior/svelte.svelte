<!-- apps/docs/src/components/examples/popover/close-behavior/svelte.svelte -->
<script lang="ts">
  import { Popover, PopoverTrigger, PopoverTitle, PopoverDescription, PopoverDismiss, PopoverContent } from '@cloudvoyant/helical-svelte';
  import { X } from 'lucide-svelte';
</script>

<Popover closeOnEscape={false} closeOnInteractOutside={false}>
  <PopoverTrigger class="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">
    Open Popover
  </PopoverTrigger>
  <PopoverContent>
    <PopoverDismiss>
      <X />
    </PopoverDismiss>
    <PopoverTitle>Sticky Popover</PopoverTitle>
    <PopoverDescription>This popover ignores Escape and outside clicks. Use the dismiss button to close it.</PopoverDescription>
  </PopoverContent>
</Popover>
