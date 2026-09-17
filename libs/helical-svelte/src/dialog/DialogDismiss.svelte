<!-- libs/helical-svelte/src/dialog/DialogDismiss.svelte -->
<!-- Closely based on: Ark UI dialog (@ark-ui/svelte/dialog), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { DialogCloseTrigger, type DialogCloseTriggerProps } from '@ark-ui/svelte/dialog';
  import { dialogCloseTriggerBase, cn } from '@cloudvoyant/helical-ui';

  type Props = DialogCloseTriggerProps & { class?: string };

  let { class: className = '', children, ...rest }: Props = $props();

  const classes = $derived(cn(dialogCloseTriggerBase, className));
</script>

<DialogCloseTrigger aria-label="Close" class={classes} {...rest}>
  {@render children?.()}
</DialogCloseTrigger>
