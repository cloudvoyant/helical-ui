<!-- libs/helical-svelte/src/which-key/Pane.svelte -->
<script lang="ts">
  import { Ark } from '@ark-ui/svelte/factory';
  import { cn, paneVariants, type PaneProps as CorePaneProps } from '@cloudvoyant/helical-ui';
  import { useOptionalPaneRegistration } from './context.svelte';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = Omit<CorePaneProps, 'className' | 'children'> & {
    class?: string;
    children?: Snippet;
  } & HTMLAttributes<HTMLDivElement>;

  let {
    paneId,
    paneTitle = 'Pane',
    paneDisabled = false,
    paneOrder,
    class: className = '',
    children,
    ...rest
  }: Props = $props();

  let elementRef: Element | null = $state(null);

  const pane = useOptionalPaneRegistration(
    () => (elementRef instanceof HTMLElement ? elementRef : null),
    () => ({
      paneId,
      paneTitle,
      paneDisabled,
      paneOrder,
      defaultTitle: paneTitle,
    }),
  );

  const classes = $derived(cn(paneVariants({ active: pane.isActive }), className));
</script>

<Ark
  as="div"
  bind:ref={elementRef}
  data-slot="pane"
  {...pane.dataAttributes}
  class={classes}
  {...rest}
>
  {@render children?.()}
</Ark>
