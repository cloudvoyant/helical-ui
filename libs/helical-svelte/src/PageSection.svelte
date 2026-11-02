<!-- libs/helical-svelte/src/PageSection.svelte -->
<!-- No upstream component; composed from @cloudvoyant/helical-ui page classes, mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { Ark } from '@ark-ui/svelte/factory';
  import { pageSectionBase, cn, type PagePaneRegistrationProps } from '@cloudvoyant/helical-ui';
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
    paneOrder,
    children,
    ...rest
  }: Props = $props();

  let sectionRef: Element | null = $state(null);

  const pane = useOptionalPaneRegistration(
    () => (sectionRef instanceof HTMLElement ? sectionRef : null),
    () => ({
      paneId,
      paneTitle,
      paneDisabled: paneDisabled ?? !paneId,
      paneOrder,
      defaultTitle: 'Section',
    }),
  );

  const classes = $derived(cn(pageSectionBase, className));
</script>

<Ark
  as="section"
  bind:ref={sectionRef}
  data-slot="page-section"
  {...pane.dataAttributes}
  class={classes}
  {...rest}
>
  {@render children?.()}
</Ark>
