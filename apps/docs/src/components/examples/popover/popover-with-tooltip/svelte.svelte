<!-- apps/docs/src/components/examples/popover/popover-with-tooltip/svelte.svelte -->
<script lang="ts">
  import { Popover, PopoverTrigger, PopoverTitle, PopoverDescription, PopoverContent } from '@cloudvoyant/helical-svelte';
  import { Tooltip, TooltipTrigger, TooltipContent } from '@cloudvoyant/helical-svelte';
</script>

<Popover>
  <Tooltip>
    <TooltipTrigger>
      {#snippet asChild(propsFn)}
        <PopoverTrigger
          {...propsFn()}
          class="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
        >
          Open Popover
        </PopoverTrigger>
      {/snippet}
    </TooltipTrigger>
    <TooltipContent>Shows on hover over the trigger</TooltipContent>
  </Tooltip>
  <PopoverContent>
    <PopoverTitle>Popover with Tooltip</PopoverTitle>
    <PopoverDescription>The trigger also shows a tooltip on hover.</PopoverDescription>
  </PopoverContent>
</Popover>
