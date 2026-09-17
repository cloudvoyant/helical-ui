<!-- libs/helical-svelte/src/window/WindowHeader.svelte -->
<!-- Closely based on: Ark UI window (@ark-ui/svelte/floating-panel), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { FloatingPanelHeader, type FloatingPanelHeaderProps } from '@ark-ui/svelte/floating-panel';
  import { windowHeaderBase, cn } from '@cloudvoyant/helical-ui';

  type Props = FloatingPanelHeaderProps & { class?: string };

  let { class: className = '', children, ...rest }: Props = $props();

  const classes = $derived(cn(windowHeaderBase, className));
</script>

<FloatingPanelHeader class={classes} {...rest}>
  {@render children?.()}
</FloatingPanelHeader>
