<!-- apps/docs/src/components/examples/popover/nested/svelte.svelte -->
<script lang="ts">
  import { Popover, PopoverTrigger, PopoverTitle, PopoverDescription, PopoverContent } from '@cloudvoyant/helical-svelte';
</script>

<Popover>
  <PopoverTrigger class="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">
    Open Popover
  </PopoverTrigger>
  <PopoverContent>
    <PopoverTitle>Settings</PopoverTitle>
    <PopoverDescription>Manage your preferences and account settings.</PopoverDescription>
    <Popover lazyMount unmountOnExit positioning={{ placement: 'right' }}>
      <PopoverTrigger class="mt-2 rounded-md bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground">
        Advanced
      </PopoverTrigger>
      <PopoverContent>
        <PopoverTitle>Advanced Settings</PopoverTitle>
        <PopoverDescription>Configure advanced options for power users.</PopoverDescription>
      </PopoverContent>
    </Popover>
  </PopoverContent>
</Popover>
