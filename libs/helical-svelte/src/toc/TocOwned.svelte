<!-- libs/helical-svelte/src/toc/TocOwned.svelte -->
<!-- The only high-level component that calls the internal `useToc`. -->
<script lang="ts">
  import type { TocItem } from '@cloudvoyant/helical-ui';
  import { useToc } from './internal';
  import TocView from './TocView.svelte';
  import type { TocProps } from './types';

  type Props = Omit<TocProps, 'items' | 'value'> & { items: TocItem[] };

  const USE_NATIVE_ITEM_LIST_BEHAVIOR = true;

  let {
    items,
    variant,
    scrollEl,
    title,
    activeIds,
    defaultActiveIds,
    onActiveChange,
    rootMargin,
    scrollBehavior,
    autoScroll,
    class: className,
  }: Props = $props();

  const value = useToc(() => ({
    items,
    scrollEl,
    activeIds,
    defaultActiveIds,
    onActiveChange,
    rootMargin: rootMargin ?? (USE_NATIVE_ITEM_LIST_BEHAVIOR ? '-20px 0% -40% 0%' : '-20px 0px 0px 0px'),
    scrollBehavior,
    autoScroll: autoScroll ?? false,
  }));
</script>

<TocView {items} {variant} {title} {value} class={className} />
