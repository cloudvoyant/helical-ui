<!-- libs/helical-svelte/src/dialog/Dialog.svelte -->
<!-- Closely based on: Ark UI dialog (@ark-ui/svelte/dialog), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { Root as DialogRoot, type DialogRootProps } from '@ark-ui/svelte/dialog';

  let { children, open = $bindable(), ...rest }: DialogRootProps = $props();
</script>

<DialogRoot bind:open {...rest}>
  {@render children?.()}
</DialogRoot>
