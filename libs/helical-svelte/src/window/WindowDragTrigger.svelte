<!-- libs/helical-svelte/src/window/WindowDragTrigger.svelte -->
<!-- Closely based on: Ark UI window (@ark-ui/svelte/floating-panel), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { FloatingPanelDragTrigger, type FloatingPanelDragTriggerProps } from '@ark-ui/svelte/floating-panel';
  import { windowDragTriggerBase, cn } from '@cloudvoyant/helical-ui';

  type Props = FloatingPanelDragTriggerProps & { class?: string };

  let { class: className = '', children, ...rest }: Props = $props();

  const classes = $derived(cn(windowDragTriggerBase, className));
</script>

<FloatingPanelDragTrigger class={classes} {...rest}>
  {@render children?.()}
</FloatingPanelDragTrigger>
