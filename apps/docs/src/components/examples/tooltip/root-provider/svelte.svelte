<!-- apps/docs/src/components/examples/tooltip/root-provider/svelte.svelte -->
<script lang="ts">
  import { useTooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@cloudvoyant/helical-svelte';

  const tooltip = useTooltip({ id: 'tooltip-1' });
</script>

<div class="flex flex-col items-center gap-4">
  <p class="text-sm text-muted-foreground">Tooltip is {tooltip().open ? 'open' : 'closed'}</p>
  <TooltipProvider value={tooltip}>
    <TooltipTrigger class="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">
      Hover me
    </TooltipTrigger>
    <TooltipContent>Controlled externally</TooltipContent>
  </TooltipProvider>
</div>
