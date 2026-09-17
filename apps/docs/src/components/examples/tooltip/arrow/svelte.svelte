<!-- apps/docs/src/components/examples/tooltip/arrow/svelte.svelte -->
<script lang="ts">
  import { Tooltip, TooltipTrigger, TooltipContent } from '@cloudvoyant/helical-svelte';
</script>

<div class="flex items-center gap-6">
  <Tooltip>
    <TooltipTrigger class="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">
      With arrow
    </TooltipTrigger>
    <TooltipContent>Arrow on by default</TooltipContent>
  </Tooltip>
  <Tooltip>
    <TooltipTrigger class="rounded-md bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground">
      Without arrow
    </TooltipTrigger>
    <TooltipContent arrow={false}>No arrow on this tooltip</TooltipContent>
  </Tooltip>
</div>
