<!-- apps/docs/src/components/examples/tooltip/within-fixed-containers/svelte.svelte -->
<script lang="ts">
  import { Tooltip, TooltipTrigger, TooltipContent } from '@cloudvoyant/helical-svelte';
</script>

<div class="flex flex-col gap-2 rounded-md border p-4">
  <p class="text-sm text-muted-foreground">Rendered inside a fixed container</p>
  <Tooltip positioning={{ strategy: 'fixed' }}>
    <TooltipTrigger class="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">
      Hover me
    </TooltipTrigger>
    <TooltipContent>Fixed strategy tooltip</TooltipContent>
  </Tooltip>
</div>
