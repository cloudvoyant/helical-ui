<!-- apps/docs/src/components/examples/popover/same-width/svelte.svelte -->
<script lang="ts">
  import { Popover, PopoverTrigger, PopoverTitle, PopoverDescription, PopoverContent } from '@cloudvoyant/helical-svelte';
</script>

<Popover positioning={{ sameWidth: true }}>
  <PopoverTrigger
    class="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
    style="min-width: 200px"
  >
    Open Popover
  </PopoverTrigger>
  <PopoverContent>
    <PopoverTitle>Matched Width</PopoverTitle>
    <PopoverDescription>This popover matches the width of its trigger element.</PopoverDescription>
  </PopoverContent>
</Popover>
