<!-- libs/helical-svelte/src/toc/TocOwned.svelte -->
<!-- The only high-level component that calls the internal `useToc`. -->
<script lang="ts">
  import * as helicalUi from '@cloudvoyant/helical-ui';
  import type { TocItem } from '@cloudvoyant/helical-ui';
  import { onMount } from 'svelte';
  import { useToc } from './internal';
  import TocView from './TocView.svelte';
  import type { TocProps } from './Toc.svelte';

  type Props = Omit<TocProps, 'value'>;
  type HelicalUiWithTocCollector = typeof helicalUi & {
    collectTocItems: (root: ParentNode, selector?: string) => TocItem[];
  };

  const { collectTocItems } = helicalUi as HelicalUiWithTocCollector;

  let {
    items,
    headingSelector,
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

  let autoItems = $state<TocItem[]>([]);
  const resolvedItems = $derived(items ?? autoItems);

  onMount(() => {
    if (items) return;
    autoItems = collectTocItems(scrollEl?.() ?? document, headingSelector);
  });

  const value = useToc(() => ({
    items: resolvedItems,
    scrollEl,
    activeIds,
    defaultActiveIds,
    onActiveChange,
    rootMargin: rootMargin ?? '-20px 0px 0px 0px',
    scrollBehavior,
    autoScroll,
  }));
</script>

<TocView items={resolvedItems} {variant} {title} {value} class={className} />
