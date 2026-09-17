<!-- libs/helical-svelte/src/dialog/DialogDescription.svelte -->
<!-- Closely based on: Ark UI dialog (@ark-ui/svelte/dialog), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { DialogDescription, type DialogDescriptionProps } from '@ark-ui/svelte/dialog';
  import { dialogDescriptionBase, cn } from '@cloudvoyant/helical-ui';

  type Props = DialogDescriptionProps & { class?: string };

  let { class: className = '', children, ...rest }: Props = $props();

  const classes = $derived(cn(dialogDescriptionBase, className));
</script>

<DialogDescription class={classes} {...rest}>
  {@render children?.()}
</DialogDescription>
