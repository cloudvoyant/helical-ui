<!-- libs/helical-svelte/src/window/WindowBody.svelte -->
<!-- Closely based on: Ark UI window (@ark-ui/svelte/floating-panel), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { FloatingPanelBody, type FloatingPanelBodyProps } from '@ark-ui/svelte/floating-panel';
  import { windowBodyBase, cn } from '@cloudvoyant/helical-ui';

  type Props = FloatingPanelBodyProps & { class?: string };

  let { class: className = '', children, ...rest }: Props = $props();

  const classes = $derived(cn(windowBodyBase, className));
</script>

<FloatingPanelBody class={classes} {...rest}>
  {@render children?.()}
</FloatingPanelBody>
