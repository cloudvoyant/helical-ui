<!-- libs/helical-svelte/src/toc/internal/toc-nav.svelte -->
<!-- Vendored from Ark UI (chakra-ui/ark, packages/svelte/src/lib/components/toc/toc-nav.svelte).
     Prop types live in ./types.ts — see the note there. -->
<script lang="ts">
  import { Ark } from '@ark-ui/svelte/factory';
  import { mergeProps } from '@zag-js/svelte';
  import { hasContext } from 'svelte';
  import { createSplitProps } from './utils/create-split-props';
  import { TocContextId, TocProvider, useTocContext } from './use-toc-context';
  import { useToc, type UseTocProps, type UseTocReturn } from './use-toc.svelte';
  import type { TocNavProps } from './types';

  let { ref = $bindable(null), ...props }: TocNavProps = $props();
  const providedId = $props.id();

  const hasParentToc = hasContext(TocContextId);

  const [{ placement, ...useTocAndRest }, localProps] = $derived(
    createSplitProps<Partial<UseTocProps> & { placement?: 'left' | 'right' }>()(props, [
      'activeIds',
      'autoScroll',
      'defaultActiveIds',
      'scrollEl',
      'id',
      'ids',
      'items',
      'onActiveChange',
      'rootMargin',
      'scrollBehavior',
      'threshold',
      'placement',
    ]),
  );

  const resolvedProps = $derived({ ...useTocAndRest, id: useTocAndRest.id ?? providedId });

  // Local deviation from upstream Ark: Ark calls `useToc` unconditionally, which
  // starts a fallback machine even when a parent TOC context exists — `useMachine`
  // runs its entry effects on mount, so an unused machine would still install an
  // IntersectionObserver. helical-ui's high-level `Toc` guarantees exactly one
  // machine per nav, so the fallback is only created when there is no parent.
  const ownToc = hasParentToc ? null : useToc(() => resolvedProps as UseTocProps);
  const toc: UseTocReturn = hasParentToc ? useTocContext() : (ownToc as UseTocReturn);

  const mergedProps = $derived(mergeProps(toc().getRootProps(), localProps));

  if (!hasParentToc) {
    TocProvider(ownToc as UseTocReturn);
  }
</script>

<Ark as="nav" bind:ref {...mergedProps} data-placement={placement} />
