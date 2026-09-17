<!-- libs/helical-svelte/src/tooltip/TooltipProvider.svelte -->
<!-- Closely based on: Ark UI tooltip (@ark-ui/svelte/tooltip), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { TooltipRootProvider, type TooltipRootProviderProps } from '@ark-ui/svelte/tooltip';

  let { value, children, ...rest }: TooltipRootProviderProps = $props();
</script>

<TooltipRootProvider {value} {...rest}>
  {@render children?.()}
</TooltipRootProvider>
