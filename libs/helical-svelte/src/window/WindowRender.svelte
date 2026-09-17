<!-- libs/helical-svelte/src/window/WindowRender.svelte -->
<!-- Closely based on: Ark UI window (@ark-ui/svelte/floating-panel), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { FloatingPanelContext, type FloatingPanelContextProps } from '@ark-ui/svelte/floating-panel';

  let { render }: FloatingPanelContextProps = $props();
</script>

<FloatingPanelContext {render} />
