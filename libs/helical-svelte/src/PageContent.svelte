<!-- libs/helical-svelte/src/PageContent.svelte -->
<!-- No upstream component; composed from @cloudvoyant/helical-ui page classes, mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { Ark } from '@ark-ui/svelte/factory';
  import { pageContentBase, cn, type PagePaneRegistrationProps } from '@cloudvoyant/helical-ui';
  import { useOptionalPaneRegistration } from './which-key/context.svelte';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = PagePaneRegistrationProps & {
    class?: string;
    children?: Snippet;
  } & HTMLAttributes<HTMLElement>;

  let {
    class: className = '',
    paneId,
    paneTitle,
    paneDisabled,
    children,
    ...rest
  }: Props = $props();

  let mainRef: Element | null = $state(null);

  const pane = useOptionalPaneRegistration(
    () => (mainRef instanceof HTMLElement ? mainRef : null),
    () => ({
      paneId,
      paneTitle,
      paneDisabled,
      defaultTitle: 'Main Content',
    }),
  );

  const classes = $derived(cn(pageContentBase, className));
</script>

<Ark
  as="main"
  bind:ref={mainRef}
  data-slot="page-content"
  {...pane.dataAttributes}
  class={classes}
  {...rest}
>
  {@render children?.()}
</Ark>
