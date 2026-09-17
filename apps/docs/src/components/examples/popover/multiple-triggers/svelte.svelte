<!-- apps/docs/src/components/examples/popover/multiple-triggers/svelte.svelte -->
<script lang="ts">
  import { Popover, PopoverTrigger, PopoverTitle, PopoverDescription, PopoverContent } from '@cloudvoyant/helical-svelte';

  const items = [
    { id: 'share', label: 'Share', detail: 'Share this item with others via link or email.' },
    { id: 'export', label: 'Export', detail: 'Export this item as PDF, CSV, or JSON.' },
    { id: 'archive', label: 'Archive', detail: 'Move this item to the archive for later reference.' },
  ];

  let active = $state(items[0]);
</script>

<Popover onTriggerValueChange={(e) => (active = items.find((i) => i.id === e.value) ?? items[0])}>
  <div class="flex items-center gap-2">
    {#each items as item (item.id)}
      <PopoverTrigger
        value={item.id}
        class="rounded-md bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground"
      >
        {item.label}
      </PopoverTrigger>
    {/each}
  </div>
  <PopoverContent>
    <PopoverTitle>{active.label}</PopoverTitle>
    <PopoverDescription>{active.detail}</PopoverDescription>
  </PopoverContent>
</Popover>
