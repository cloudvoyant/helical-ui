<!-- apps/docs/src/components/examples/tooltip/context/svelte.svelte -->
<script lang="ts">
  import { Tooltip, TooltipTrigger, TooltipContent, TooltipContext } from '@cloudvoyant/helical-svelte';
</script>

<Tooltip>
  <div class="flex items-center gap-4">
    <TooltipTrigger class="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">
      Hover me
    </TooltipTrigger>
    <TooltipContext>
      {#snippet render(tooltip)}
        <p class="text-sm text-muted-foreground">Tooltip is {tooltip().open ? 'open' : 'closed'}</p>
      {/snippet}
    </TooltipContext>
  </div>
  <TooltipContent>Context tooltip</TooltipContent>
</Tooltip>
