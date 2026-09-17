<!-- libs/helical-svelte/src/dialog/DialogContent.svelte -->
<!-- Closely based on: Ark UI dialog (@ark-ui/svelte/dialog), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { Portal } from '@ark-ui/svelte/portal';
  import { Positioner as DialogPositioner, DialogContent, type DialogContentProps } from '@ark-ui/svelte/dialog';
  import { dialogPositionerBase, dialogContentBase, dialogFullscreenContentBase, cn } from '@cloudvoyant/helical-ui';

  type Props = DialogContentProps & { positionerClass?: string; class?: string; fullscreen?: boolean };

  let { positionerClass = '', class: className = '', fullscreen = false, children, ...rest }: Props = $props();

  const positionerClasses = $derived(cn(dialogPositionerBase, fullscreen && 'p-0', positionerClass));
  const classes = $derived(cn(dialogContentBase, fullscreen && dialogFullscreenContentBase, className));
</script>

<Portal>
  <DialogPositioner class={positionerClasses}>
    <DialogContent class={classes} {...rest}>
      {@render children?.()}
    </DialogContent>
  </DialogPositioner>
</Portal>
