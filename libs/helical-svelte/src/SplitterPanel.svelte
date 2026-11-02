<!-- libs/helical-svelte/src/SplitterPanel.svelte -->
<!-- Closely based on: @ark-ui/svelte/splitter (Ark UI), Chakra UI Splitter, mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { SplitterPanel, type SplitterPanelProps } from '@ark-ui/svelte/splitter';
  import {
    splitterPanelBase,
    cn,
    type SplitterPanelPaneRegistrationProps,
  } from '@cloudvoyant/helical-ui';
  import { useOptionalPaneRegistration } from './which-key/context.svelte';

  type Props = SplitterPanelProps & SplitterPanelPaneRegistrationProps;

  let {
    class: className = '',
    id,
    paneId,
    paneTitle,
    paneDisabled,
    ...rest
  }: Props = $props();

  let panelRef: Element | null = $state(null);

  const pane = useOptionalPaneRegistration(
    () => (panelRef instanceof HTMLElement ? panelRef : null),
    () => ({
      paneId: paneId ?? (typeof id === 'string' ? `splitter-${id}` : undefined),
      paneTitle: paneTitle ?? (typeof id === 'string' ? `Panel ${id}` : 'Splitter Panel'),
      paneDisabled,
      defaultTitle: 'Splitter Panel',
    }),
  );

  const classes = $derived(cn(splitterPanelBase, className));
</script>

<SplitterPanel bind:ref={panelRef} {id} {...pane.dataAttributes} class={classes} {...rest} />
