<!-- libs/helical-svelte/src/window/WindowProvider.svelte -->
<!-- Closely based on: Ark UI window (@ark-ui/svelte/floating-panel), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { FloatingPanelRootProvider, type FloatingPanelRootProviderProps } from '@ark-ui/svelte/floating-panel';

  let { value, children, ...rest }: FloatingPanelRootProviderProps = $props();
</script>

<FloatingPanelRootProvider {value} {...rest}>
  {@render children?.()}
</FloatingPanelRootProvider>
