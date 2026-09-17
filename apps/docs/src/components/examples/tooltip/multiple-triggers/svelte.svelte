<!-- apps/docs/src/components/examples/tooltip/multiple-triggers/svelte.svelte -->
<script lang="ts">
  import { Tooltip, TooltipTrigger, TooltipContent } from '@cloudvoyant/helical-svelte';

  const items = ['First', 'Second', 'Third'];
  let active = $state('First');
</script>

<Tooltip onTriggerValueChange={(e) => (active = e.value ?? 'First')}>
  <div class="flex items-center gap-2">
    {#each items as item (item)}
      <TooltipTrigger
        value={item}
        class="rounded-md bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground"
      >
        {item}
      </TooltipTrigger>
    {/each}
  </div>
  <TooltipContent>This tooltip follows the active trigger ({active})</TooltipContent>
</Tooltip>
