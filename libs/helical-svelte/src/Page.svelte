<!-- libs/helical-svelte/src/Page.svelte -->
<!-- No upstream component; composed from @cloudvoyant/helical-ui page classes, mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { Ark } from '@ark-ui/svelte/factory';
  import { pageVariants, cn, type PagePaneRegistrationProps } from '@cloudvoyant/helical-ui';
  import { useOptionalPaneRegistration } from './which-key/context.svelte';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = PagePaneRegistrationProps & {
    class?: string;
    variant?: 'default' | 'landing';
    children?: Snippet;
  } & HTMLAttributes<HTMLDivElement>;

  let {
    class: className = '',
    variant = 'default',
    paneId,
    paneTitle,
    paneDisabled,
    paneOrder,
    children,
    ...rest
  }: Props = $props();

  let pageRef: Element | null = $state(null);

  const pane = useOptionalPaneRegistration(
    () => (pageRef instanceof HTMLElement ? pageRef : null),
    () => ({
      paneId,
      paneTitle,
      paneDisabled: paneDisabled ?? !paneId,
      paneOrder,
      defaultTitle: 'Page',
    }),
  );

  const rootClasses = $derived(cn(pageVariants({ variant }), className));
</script>

<Ark
  as="div"
  bind:ref={pageRef}
  data-slot="page"
  {...pane.dataAttributes}
  class={rootClasses}
  {...rest}
>
  {@render children?.()}
</Ark>
