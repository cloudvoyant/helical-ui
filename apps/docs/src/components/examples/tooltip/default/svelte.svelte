<!-- apps/docs/src/components/examples/tooltip/default/svelte.svelte -->
<script lang="ts">
  import { Tooltip, TooltipTrigger, TooltipContent } from '@cloudvoyant/helical-svelte';
</script>

<Tooltip>
  <TooltipTrigger class="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">
    Hover me
  </TooltipTrigger>
  <TooltipContent>I am a tooltip</TooltipContent>
</Tooltip>
