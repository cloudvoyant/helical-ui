<!-- apps/docs/src/components/examples/popover/modality/svelte.svelte -->
<script lang="ts">
  import { Popover, PopoverTrigger, PopoverTitle, PopoverDescription, PopoverContent } from '@cloudvoyant/helical-svelte';
</script>

<Popover modal>
  <PopoverTrigger class="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">
    Open Popover
  </PopoverTrigger>
  <PopoverContent>
    <PopoverTitle>Confirm Action</PopoverTitle>
    <PopoverDescription>Focus is trapped inside this modal popover until dismissed.</PopoverDescription>
  </PopoverContent>
</Popover>
