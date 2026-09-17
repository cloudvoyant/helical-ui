<!-- libs/helical-svelte/src/window/WindowDismiss.svelte -->
<!-- Closely based on: Ark UI window (@ark-ui/svelte/floating-panel), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { FloatingPanelCloseTrigger, type FloatingPanelCloseTriggerProps } from '@ark-ui/svelte/floating-panel';
  import { windowCloseTriggerBase, cn } from '@cloudvoyant/helical-ui';

  type Props = FloatingPanelCloseTriggerProps & { class?: string };

  let { class: className = '', children, ...rest }: Props = $props();

  const classes = $derived(cn(windowCloseTriggerBase, className));
</script>

<FloatingPanelCloseTrigger aria-label="Close" class={classes} {...rest}>
  {@render children?.()}
</FloatingPanelCloseTrigger>
