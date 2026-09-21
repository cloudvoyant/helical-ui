<!-- libs/helical-svelte/src/toc/TableOfContents.svelte -->
<!-- High-level TableOfContents dispatcher. Mirrors @cloudvoyant/helical-react TableOfContents. -->
<script lang="ts">
  import type { TocItem } from '@cloudvoyant/helical-ui';
  import type { UseTocReturn } from './internal';
  import type { TableOfContentsProps } from './types';
  import TocAutoOwned from './TocAutoOwned.svelte';
  import TocOwned from './TocOwned.svelte';
  import TocView from './TocView.svelte';

  let {
    items,
    headingSelector,
    variant,
    value,
    scrollEl,
    title,
    activeIds,
    defaultActiveIds,
    onActiveChange,
    rootMargin,
    scrollBehavior,
    autoScroll,
    class: className,
  }: TableOfContentsProps = $props();

  const machineItems = (machine: ReturnType<UseTocReturn>): TocItem[] =>
    machine.items.map((item) => ({
      ...item,
      label: 'label' in item && typeof item.label === 'string' ? item.label : item.value,
    }));
</script>

<!-- Only one branch ever mounts, so the Root Provider path reuses its machine and creates no second one. -->
{#if value}
  <TocView items={items ?? machineItems(value())} {variant} {title} {value} class={className} />
{:else if items}
  <TocOwned
    {items}
    {variant}
    {scrollEl}
    {title}
    {activeIds}
    {defaultActiveIds}
    {onActiveChange}
    {rootMargin}
    {scrollBehavior}
    {autoScroll}
    class={className}
  />
{:else}
  <TocAutoOwned
    {headingSelector}
    {variant}
    {scrollEl}
    {title}
    {activeIds}
    {defaultActiveIds}
    {onActiveChange}
    {rootMargin}
    {scrollBehavior}
    {autoScroll}
    class={className}
  />
{/if}
