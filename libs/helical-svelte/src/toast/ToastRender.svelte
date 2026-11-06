<!-- libs/helical-svelte/src/toast/ToastRender.svelte -->
<!-- Closely based on: Shark UI toast (@ark-ui/svelte/toast), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { ToastContext as ArkToastContext, type ToastContextProps } from '@ark-ui/svelte/toast';

  let props: ToastContextProps = $props();
</script>

<ArkToastContext {...props} />
