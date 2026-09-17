<!-- apps/docs/src/components/examples/tooltip/delay/svelte.svelte -->
<script lang="ts">
  import { Tooltip, TooltipTrigger, TooltipContent } from '@cloudvoyant/helical-svelte';
</script>

<Tooltip openDelay={1000} closeDelay={200}>
  <TooltipTrigger class="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">
    Hover me (1s open delay)
  </TooltipTrigger>
  <TooltipContent>Delayed tooltip</TooltipContent>
</Tooltip>
