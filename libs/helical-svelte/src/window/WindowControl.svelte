<!-- libs/helical-svelte/src/window/WindowControl.svelte -->
<!-- Closely based on: Ark UI window (@ark-ui/svelte/floating-panel), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { FloatingPanelControl, type FloatingPanelControlProps } from '@ark-ui/svelte/floating-panel';
  import { windowControlBase, cn } from '@cloudvoyant/helical-ui';

  type Props = FloatingPanelControlProps & { class?: string };

  let { class: className = '', children, ...rest }: Props = $props();

  const classes = $derived(cn(windowControlBase, className));
</script>

<FloatingPanelControl class={classes} {...rest}>
  {@render children?.()}
</FloatingPanelControl>
