<!-- Collects headings before mounting the single machine owner. -->
<script lang="ts">
  import * as helicalUi from '@cloudvoyant/helical-ui';
  import type { TocItem } from '@cloudvoyant/helical-ui';
  import { onMount } from 'svelte';
  import type { TocProps } from './types';
  import TocOwned from './TocOwned.svelte';

  type Props = Omit<TocProps, 'items' | 'value'>;
  type HelicalUiWithTocCollector = typeof helicalUi & {
    collectTocItems: (root: ParentNode, selector?: string) => TocItem[];
  };

  const { collectTocItems } = helicalUi as HelicalUiWithTocCollector;
  const props: Props = $props();
  let items = $state<TocItem[]>([]);

  onMount(() => {
    const frame = requestAnimationFrame(() => {
      const root = props.scrollEl ? props.scrollEl() : document;
      if (root) items = collectTocItems(root, props.headingSelector);
    });
    return () => cancelAnimationFrame(frame);
  });
</script>

{#if items.length > 0}
  <TocOwned
    {items}
    variant={props.variant}
    scrollEl={props.scrollEl}
    title={props.title}
    activeIds={props.activeIds}
    defaultActiveIds={props.defaultActiveIds}
    onActiveChange={props.onActiveChange}
    rootMargin={props.rootMargin}
    scrollBehavior={props.scrollBehavior}
    autoScroll={props.autoScroll}
    class={props.class}
  />
{/if}
