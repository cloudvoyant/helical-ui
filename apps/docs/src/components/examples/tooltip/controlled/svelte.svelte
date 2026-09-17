<!-- apps/docs/src/components/examples/tooltip/controlled/svelte.svelte -->
<script lang="ts">
  import { Tooltip, TooltipTrigger, TooltipContent } from '@cloudvoyant/helical-svelte';

  let open = $state(false);
</script>

<div class="flex items-center gap-4">
  <Tooltip bind:open>
    <TooltipTrigger class="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">
      Hover me
    </TooltipTrigger>
    <TooltipContent>Controlled tooltip</TooltipContent>
  </Tooltip>
  <label class="flex items-center gap-2 text-sm text-muted-foreground">
    <input type="checkbox" bind:checked={open} />
    Open
  </label>
</div>
