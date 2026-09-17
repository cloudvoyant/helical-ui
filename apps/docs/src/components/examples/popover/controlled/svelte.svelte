<!-- apps/docs/src/components/examples/popover/controlled/svelte.svelte -->
<script lang="ts">
  import { Popover, PopoverTrigger, PopoverTitle, PopoverDescription, PopoverContent } from '@cloudvoyant/helical-svelte';

  let open = $state(false);
</script>

<div class="flex items-center gap-4">
  <Popover bind:open>
    <PopoverTrigger class="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">
      Open Popover
    </PopoverTrigger>
    <PopoverContent>
      <PopoverTitle>Controlled Popover</PopoverTitle>
      <PopoverDescription>This popover is fully controlled by the checkbox.</PopoverDescription>
    </PopoverContent>
  </Popover>
  <label class="flex items-center gap-2 text-sm text-muted-foreground">
    <input type="checkbox" bind:checked={open} />
    Open
  </label>
</div>
