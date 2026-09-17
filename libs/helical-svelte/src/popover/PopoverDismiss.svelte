<!-- libs/helical-svelte/src/popover/PopoverDismiss.svelte -->
<!-- Closely based on: Ark UI popover (@ark-ui/svelte/popover), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { PopoverCloseTrigger, type PopoverCloseTriggerProps } from '@ark-ui/svelte/popover';
  import { popoverCloseTriggerBase, cn } from '@cloudvoyant/helical-ui';

  type Props = PopoverCloseTriggerProps & { class?: string };

  let { class: className = '', children, ...rest }: Props = $props();

  const classes = $derived(cn(popoverCloseTriggerBase, className));
</script>

<PopoverCloseTrigger aria-label="Close" class={classes} {...rest}>
  {@render children?.()}
</PopoverCloseTrigger>
