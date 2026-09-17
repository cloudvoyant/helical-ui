<!-- apps/docs/src/components/examples/tooltip/positioning/svelte.svelte -->
<script lang="ts">
  import { Tooltip, TooltipTrigger, TooltipContent } from '@cloudvoyant/helical-svelte';
</script>

<Tooltip positioning={{ placement: 'right', offset: { mainAxis: 12 } }}>
  <TooltipTrigger class="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">
    Hover me
  </TooltipTrigger>
  <TooltipContent>Positioned on the right</TooltipContent>
</Tooltip>
