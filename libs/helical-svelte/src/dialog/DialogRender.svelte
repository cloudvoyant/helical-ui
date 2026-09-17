<!-- libs/helical-svelte/src/dialog/DialogRender.svelte -->
<!-- Closely based on: Ark UI dialog (@ark-ui/svelte/dialog), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { DialogContext, type DialogContextProps } from '@ark-ui/svelte/dialog';

  let { children }: DialogContextProps = $props();
</script>

<DialogContext {children} />
