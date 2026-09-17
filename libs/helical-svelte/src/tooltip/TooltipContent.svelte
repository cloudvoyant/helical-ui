<!-- libs/helical-svelte/src/tooltip/TooltipContent.svelte -->
<!-- Closely based on: Ark UI tooltip (@ark-ui/svelte/tooltip), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { Portal } from '@ark-ui/svelte/portal';
  import {
    TooltipPositioner,
    TooltipArrow,
    TooltipArrowTip,
    TooltipContent,
    useTooltipContext,
    type TooltipContentProps,
  } from '@ark-ui/svelte/tooltip';
  import { tooltipPositionerBase, tooltipArrowBase, tooltipContentBase, cn } from '@cloudvoyant/helical-ui';

  type Props = TooltipContentProps & { arrow?: boolean; class?: string };

  let { arrow = true, class: className = '', children, ...rest }: Props = $props();

  const tooltip = useTooltipContext();
  const open = $derived(tooltip().open);
  const classes = $derived(cn(tooltipContentBase, className));
</script>

<Portal>
  <TooltipPositioner class={tooltipPositionerBase}>
    {#if arrow && open}
      <TooltipArrow class={tooltipArrowBase}>
        <TooltipArrowTip />
      </TooltipArrow>
    {/if}
    <TooltipContent class={classes} {...rest}>
      {@render children?.()}
    </TooltipContent>
  </TooltipPositioner>
</Portal>
