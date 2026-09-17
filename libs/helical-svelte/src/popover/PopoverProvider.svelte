<!-- libs/helical-svelte/src/popover/PopoverProvider.svelte -->
<!-- Closely based on: Ark UI popover (@ark-ui/svelte/popover), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { PopoverRootProvider, type PopoverRootProviderProps } from '@ark-ui/svelte/popover';

  let { value, children, ...rest }: PopoverRootProviderProps = $props();
</script>

<PopoverRootProvider {value} {...rest}>
  {@render children?.()}
</PopoverRootProvider>
