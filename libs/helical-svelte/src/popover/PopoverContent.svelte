<!-- libs/helical-svelte/src/popover/PopoverContent.svelte -->
<!-- Closely based on: Ark UI popover (@ark-ui/svelte/popover), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { Portal } from '@ark-ui/svelte/portal';
  import {
    PopoverPositioner,
    PopoverArrow,
    PopoverArrowTip,
    PopoverContent,
    usePopoverContext,
    type PopoverContentProps,
  } from '@ark-ui/svelte/popover';
  import { popoverPositionerBase, popoverArrowBase, popoverContentBase, cn } from '@cloudvoyant/helical-ui';

  type Props = PopoverContentProps & { arrow?: boolean; class?: string };

  let { arrow = false, class: className = '', children, ...rest }: Props = $props();

  const popover = usePopoverContext();
  const open = $derived(popover().open);
  const classes = $derived(cn(popoverContentBase, className));
</script>

<Portal>
  <PopoverPositioner class={popoverPositionerBase}>
    {#if arrow && open}
      <PopoverArrow class={popoverArrowBase}>
        <PopoverArrowTip />
      </PopoverArrow>
    {/if}
    <PopoverContent class={classes} {...rest}>
      {@render children?.()}
    </PopoverContent>
  </PopoverPositioner>
</Portal>
