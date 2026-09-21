<!-- libs/helical-svelte/src/toc/Toc.svelte -->
<!-- High-level Toc dispatcher. Mirrors @cloudvoyant/helical-react Toc. -->
<script module lang="ts">
  import type { Snippet } from 'svelte';
  import type { TocItem } from '@cloudvoyant/helical-ui';
  import type { TocActiveChangeDetails, UseTocReturn } from './internal';

  export type TocVariant = 'default' | 'indicator' | 'hover' | 'rail' | 'tree' | 'collapsible';

  export type TocProps = {
    /** Explicit items override automatic heading collection. */
    items?: TocItem[];
    /** CSS selector used when collecting headings automatically. */
    headingSelector?: string;
    variant?: TocVariant;
    /** Existing Ark-compatible machine accessor. When supplied, Toc creates none. */
    value?: UseTocReturn;
    scrollEl?: () => HTMLElement | null;
    title?: string | Snippet;
    activeIds?: string[];
    defaultActiveIds?: string[];
    onActiveChange?: (details: TocActiveChangeDetails) => void;
    rootMargin?: string;
    scrollBehavior?: ScrollBehavior;
    autoScroll?: boolean;
    class?: string;
  };
</script>

<script lang="ts">
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
  }: TocProps = $props();

  const machineItems = (machine: ReturnType<UseTocReturn>): TocItem[] =>
    machine.items.map((item) => ({
      ...item,
      label: 'label' in item && typeof item.label === 'string' ? item.label : item.value,
    }));
</script>

<!-- Only one branch ever mounts, so the Root Provider path reuses its machine and creates no second one. -->
{#if value}
  <TocView items={items ?? machineItems(value())} {variant} {title} {value} class={className} />
{:else}
  <TocOwned
    {items}
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
