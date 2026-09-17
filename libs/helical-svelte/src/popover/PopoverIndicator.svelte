<!-- libs/helical-svelte/src/popover/PopoverIndicator.svelte -->
<!-- Closely based on: Ark UI popover (@ark-ui/svelte/popover), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { PopoverIndicator, type PopoverIndicatorProps } from '@ark-ui/svelte/popover';
  import { popoverIndicatorBase, cn } from '@cloudvoyant/helical-ui';

  type Props = PopoverIndicatorProps & { class?: string };

  let { class: className = '', children, ...rest }: Props = $props();

  const classes = $derived(cn(popoverIndicatorBase, className));
</script>

<PopoverIndicator class={classes} {...rest}>
  {@render children?.()}
</PopoverIndicator>
