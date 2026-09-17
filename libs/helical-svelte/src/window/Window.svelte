<!-- libs/helical-svelte/src/window/Window.svelte -->
<!-- Closely based on: Ark UI floating-panel (@ark-ui/svelte/floating-panel), exposed as "Window" -->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import { Portal } from '@ark-ui/svelte/portal';
  import {
    FloatingPanelRoot,
    FloatingPanelPositioner,
    FloatingPanelContent,
    type FloatingPanelRootProps,
  } from '@ark-ui/svelte/floating-panel';
  import { windowPositionerBase, windowContentBase, cn } from '@cloudvoyant/helical-ui';

  interface Props extends FloatingPanelRootProps {
    class?: string;
    positionerClass?: string;
    children?: Snippet;
  }

  let { class: className = '', positionerClass = '', children, ...rest }: Props = $props();

  const positionerClasses = $derived(cn(windowPositionerBase, positionerClass));
  const contentClasses = $derived(cn(windowContentBase, className));
</script>

<FloatingPanelRoot {...rest}>
  <Portal>
    <FloatingPanelPositioner class={positionerClasses}>
      <FloatingPanelContent class={contentClasses}>
        {@render children?.()}
      </FloatingPanelContent>
    </FloatingPanelPositioner>
  </Portal>
</FloatingPanelRoot>
