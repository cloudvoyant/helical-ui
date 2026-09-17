<!-- libs/helical-svelte/src/dialog/DialogProvider.svelte -->
<!-- Closely based on: Ark UI dialog (@ark-ui/svelte/dialog), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { RootProvider as DialogRootProvider, type DialogRootProviderProps } from '@ark-ui/svelte/dialog';

  let { value, children, ...rest }: DialogRootProviderProps = $props();
</script>

<DialogRootProvider {value} {...rest}>
  {@render children?.()}
</DialogRootProvider>
