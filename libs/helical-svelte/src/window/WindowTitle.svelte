<!-- libs/helical-svelte/src/window/WindowTitle.svelte -->
<!-- Closely based on: Ark UI window (@ark-ui/svelte/floating-panel), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { FloatingPanelTitle, type FloatingPanelTitleProps } from '@ark-ui/svelte/floating-panel';
  import { windowTitleBase, cn } from '@cloudvoyant/helical-ui';

  type Props = FloatingPanelTitleProps & { class?: string };

  let { class: className = '', children, ...rest }: Props = $props();

  const classes = $derived(cn(windowTitleBase, className));
</script>

<FloatingPanelTitle class={classes} {...rest}>
  {@render children?.()}
</FloatingPanelTitle>
