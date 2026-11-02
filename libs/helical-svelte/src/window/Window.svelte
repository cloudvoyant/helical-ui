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
  import {
    windowPositionerBase,
    windowContentBase,
    cn,
    type WindowPaneRegistrationProps,
  } from '@cloudvoyant/helical-ui';
  import { useOptionalPaneRegistration } from '../which-key/context.svelte';

  interface Props extends FloatingPanelRootProps, WindowPaneRegistrationProps {
    class?: string;
    positionerClass?: string;
    children?: Snippet;
  }

  let {
    class: className = '',
    positionerClass = '',
    paneId,
    paneTitle,
    paneDisabled,
    children,
    ...rest
  }: Props = $props();

  let contentRef: Element | null = $state(null);

  const pane = useOptionalPaneRegistration(
    () => (contentRef instanceof HTMLElement ? contentRef : null),
    () => ({
      paneId,
      paneTitle,
      paneDisabled: paneDisabled || rest.open === false,
      defaultTitle: 'Window',
    }),
  );

  const positionerClasses = $derived(cn(windowPositionerBase, positionerClass));
  const contentClasses = $derived(cn(windowContentBase, className));
</script>

<FloatingPanelRoot {...rest}>
  <Portal>
    <FloatingPanelPositioner class={positionerClasses}>
      <FloatingPanelContent bind:ref={contentRef} {...pane.dataAttributes} class={contentClasses}>
        {@render children?.()}
      </FloatingPanelContent>
    </FloatingPanelPositioner>
  </Portal>
</FloatingPanelRoot>
