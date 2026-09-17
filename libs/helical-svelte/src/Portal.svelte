<!-- libs/helical-svelte/src/Portal.svelte -->
<!-- Closely based on: Ark UI portal (@ark-ui/svelte/portal) -->
<script lang="ts">
  import { Portal, type PortalProps } from '@ark-ui/svelte/portal';

  let { children, disabled = false }: PortalProps = $props();
</script>

<Portal {disabled}>
  {@render children?.()}
</Portal>
