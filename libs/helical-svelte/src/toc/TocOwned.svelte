<!-- libs/helical-svelte/src/toc/TocOwned.svelte -->
<!-- The only high-level component that calls the internal `useToc`. -->
<script lang="ts">
  import { useToc } from './internal';
  import TocView from './TocView.svelte';
  import type { TocProps } from './Toc.svelte';

  type Props = Omit<TocProps, 'value'>;

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
    rootMargin,
    scrollBehavior,
    autoScroll,
  }));
</script>

<TocView {items} {variant} {title} {value} class={className} />
