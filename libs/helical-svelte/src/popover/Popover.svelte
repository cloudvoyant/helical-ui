<!-- libs/helical-svelte/src/popover/Popover.svelte -->
<!-- Closely based on: Ark UI popover (@ark-ui/svelte/popover), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { PopoverRoot, type PopoverRootProps } from '@ark-ui/svelte/popover';

  let { children, ...rest }: PopoverRootProps = $props();
</script>

<PopoverRoot {...rest}>
  {@render children?.()}
</PopoverRoot>
