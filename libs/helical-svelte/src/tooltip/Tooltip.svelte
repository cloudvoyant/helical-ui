<!-- libs/helical-svelte/src/tooltip/Tooltip.svelte -->
<!-- Closely based on: Ark UI tooltip (@ark-ui/svelte/tooltip), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { TooltipRoot, type TooltipRootProps } from '@ark-ui/svelte/tooltip';

  let { children, ...rest }: TooltipRootProps = $props();
</script>

<TooltipRoot {...rest}>
  {@render children?.()}
</TooltipRoot>
