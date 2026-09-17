<!-- apps/docs/src/components/examples/popover/anchor/svelte.svelte -->
<script lang="ts">
  import { Popover, PopoverTrigger, PopoverAnchor, PopoverTitle, PopoverDescription, PopoverContent } from '@cloudvoyant/helical-svelte';
  import { Input } from '@cloudvoyant/helical-svelte';
</script>

<Popover>
  <div class="flex items-center gap-3">
    <PopoverTrigger class="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">
      Open Popover
    </PopoverTrigger>
    <PopoverAnchor>
      <Input placeholder="Type here..." />
    </PopoverAnchor>
  </div>
  <PopoverContent>
    <PopoverTitle>Anchored Popover</PopoverTitle>
    <PopoverDescription>The popover positions relative to the anchor (the input), not the trigger.</PopoverDescription>
  </PopoverContent>
</Popover>
