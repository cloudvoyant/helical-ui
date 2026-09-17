<!-- apps/docs/src/components/examples/popover/root-provider/svelte.svelte -->
<script lang="ts">
  import { usePopover, PopoverProvider, PopoverTrigger, PopoverTitle, PopoverDescription, PopoverContent } from '@cloudvoyant/helical-svelte';

  const popover = usePopover({ id: 'popover-1', positioning: { placement: 'bottom-start' } });
</script>

<div class="flex flex-col items-center gap-4">
  <p class="text-sm text-muted-foreground">Popover is {popover().open ? 'open' : 'closed'}</p>
  <PopoverProvider value={popover}>
    <PopoverTrigger class="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">
      Toggle Popover
    </PopoverTrigger>
    <PopoverContent>
      <PopoverTitle>Controlled Externally</PopoverTitle>
      <PopoverDescription>This popover is controlled via the usePopover hook.</PopoverDescription>
    </PopoverContent>
  </PopoverProvider>
</div>
