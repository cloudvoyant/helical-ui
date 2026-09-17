<!-- libs/helical-svelte/src/popover/PopoverDescription.svelte -->
<!-- Closely based on: Ark UI popover (@ark-ui/svelte/popover), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { PopoverDescription, type PopoverDescriptionProps } from '@ark-ui/svelte/popover';
  import { popoverDescriptionBase, cn } from '@cloudvoyant/helical-ui';

  type Props = PopoverDescriptionProps & { class?: string };

  let { class: className = '', children, ...rest }: Props = $props();

  const classes = $derived(cn(popoverDescriptionBase, className));
</script>

<PopoverDescription class={classes} {...rest}>
  {@render children?.()}
</PopoverDescription>
