<!-- libs/helical-svelte/src/toc/TocView.svelte -->
<!-- Renders the received machine through the private compatibility barrel. Never creates one.
     Mirrors @cloudvoyant/helical-react TableOfContents's internal `TocView`. -->
<script module lang="ts">
  import type { TocItem } from '@cloudvoyant/helical-ui';

  /** Hierarchy derived from the public flat item list by depth. */
  export type TocNode = {
    value: string;
    label: string;
    depth: number;
    children?: TocNode[];
  };
</script>

<script lang="ts">
  import {
    CollapsibleContent,
    CollapsibleIndicator,
    CollapsibleRoot,
    CollapsibleTrigger,
  } from '@ark-ui/svelte/collapsible';
  import { SwapIndicator, SwapRoot } from '@ark-ui/svelte/swap';
  import { TreeView, createTreeCollection } from '@ark-ui/svelte/tree-view';
  import {
    cn,
    tocIndicatorBase,
    tocItemBase,
    tocLinkVariants,
    tocListVariants,
    tocNavBase,
    tocSkeletonBase,
    tocTitleBase,
  } from '@cloudvoyant/helical-ui';
  import { ChevronRight } from 'lucide-svelte';
  import {
    TocContext,
    TocIndicator,
    TocItem as TocItemPart,
    TocLink,
    TocList,
    TocNav,
    TocRootProvider,
    TocTitle,
    type UseTocReturn,
  } from './internal';
  import TocTreeNode from './TocTreeNode.svelte';
  import type { TocProps } from './types';
  import { getCurrentValue } from './current-value';

  type Props = Omit<Pick<TocProps, 'items' | 'variant' | 'title' | 'class'>, 'items'> & {
    items: TocItem[];
    value: UseTocReturn;
  };

  let { items, variant = 'default', title = 'On this page', value, class: className = '' }: Props = $props();

  // Ark's rail geometry, copied from the upstream example. h2 sits at level 0;
  // deeper headings step in, clamped so h5+ share h4's indent. The rail overlaps
  // the row above by RAIL_BRIDGE px so a turn can straddle the boundary.
  const RAIL_BASE = 8;
  const RAIL_STEP = 8;
  const RAIL_TEXT_STEP = 12;
  const RAIL_MAX_LEVEL = 2;
  const RAIL_BRIDGE = 6;

  const railLevel = (depth: number) => Math.min(Math.max(depth - 2, 0), RAIL_MAX_LEVEL);
  const railLineOffset = (depth: number) => RAIL_BASE + railLevel(depth) * RAIL_STEP;
  const railTextOffset = (depth: number) => RAIL_BASE + (railLevel(depth) + 1) * RAIL_TEXT_STEP;

  const titleText = $derived(typeof title === 'string' ? title : 'On this page');
  const titleSnippet = $derived(typeof title === 'function' ? title : undefined);

  const showTitle = $derived(variant !== 'collapsible');

  let hovered = $state(false);

  const activeItems = $derived(value().activeItems);
  const currentValue = $derived(getCurrentValue(value(), activeItems));
  const itemIndicator = $derived(variant === 'indicator' && currentValue !== activeItems[0]?.value);

  const activeIndex = () => items.findIndex((item) => item.value === currentValue);
  const activeLabel = () => items[activeIndex()]?.label ?? 'On this page';
  const activeProgress = () => {
    const index = activeIndex();
    return index >= 0 ? (index + 1) / items.length : 0;
  };

  const treeRoots = $derived(pruneLeaves(buildTree(items)));
  const treeCollection = $derived(
    createTreeCollection<TocNode>({
      nodeToValue: (node) => node.value,
      nodeToString: (node) => node.label,
      rootNode: { value: 'ROOT', label: '', depth: 1, children: treeRoots },
    }),
  );
  let treeToggled = $state<Record<string, boolean>>({});

  const autoExpanded = $derived(
    treeRoots
      .filter(
        (node) =>
          activeItems.some((item) => item.value === node.value) ||
          (node.children ?? []).some((child) => activeItems.some((item) => item.value === child.value)),
      )
      .map((node) => node.value),
  );
  const expandedValue = $derived(
    treeRoots
      .map((node) => node.value)
      .filter((value) => (value in treeToggled ? treeToggled[value] : autoExpanded.includes(value))),
  );

  /** TreeView treats any `children` array as a branch, so leaves must drop the key. */
  function pruneLeaves(nodes: TocNode[]): TocNode[] {
    return nodes.map((node) => {
      const children = node.children ? pruneLeaves(node.children) : [];
      if (children.length === 0) {
        return { value: node.value, label: node.label, depth: node.depth };
      }
      return { value: node.value, label: node.label, depth: node.depth, children };
    });
  }

  function buildTree(list: TocItem[]): TocNode[] {
    const roots: TocNode[] = [];
    const stack: TocNode[] = [];

    for (const item of list) {
      const node: TocNode = { value: item.value, label: item.label, depth: item.depth, children: [] };
      while (stack.length > 0 && stack[stack.length - 1]!.depth >= item.depth) {
        stack.pop();
      }
      const parent = stack[stack.length - 1];
      if (parent) {
        parent.children!.push(node);
      } else {
        roots.push(node);
      }
      stack.push(node);
    }

    return roots;
  }
</script>

<TocRootProvider {value} class={cn(tocNavBase, className)}>
  {#if variant === 'hover'}
    <!-- Ark's hover nav *is* the root nav (pointer handlers + Swap), so it is the only <nav>;
         nesting a second one would add a duplicate landmark. -->
    <TocNav
      class="relative z-10 ms-auto w-6 cursor-pointer overflow-hidden rounded-xl bg-background p-4 transition-[width,box-shadow,border-radius] duration-200 data-[expanded]:w-48 data-[expanded]:cursor-default data-[expanded]:rounded-2xl data-[expanded]:shadow-lg"
      data-expanded={hovered || undefined}
      onmouseenter={() => (hovered = true)}
      onmouseleave={() => (hovered = false)}
    >
      <!-- Screen-reader-only Title: the machine's `aria-labelledby` points at it. -->
      <TocTitle class="sr-only">{titleText}</TocTitle>
      <!-- Ark's Swap construction: two overlapping panels, skeleton bars while collapsed. -->
      <SwapRoot swap={hovered} class="grid w-full [&>*]:[grid-area:1/1]">
        <SwapIndicator
          type="off"
          class={cn(tocListVariants({ variant: 'hover' }), 'w-full items-end gap-2 px-1 py-0.5')}
        >
          {#each items as item (item.value)}
            <TocItemPart {item} class={tocSkeletonBase} />
          {/each}
        </SwapIndicator>
        <SwapIndicator type="on" class={cn(tocListVariants({ variant: 'hover' }), 'w-full')}>
          {#each items as item (item.value)}
            <TocItemPart {item} class={tocItemBase}>
              <TocLink
                href={`#${item.value}`}
                aria-current={currentValue === item.value ? 'location' : 'false'}
                data-current={currentValue === item.value || undefined}
                class={tocLinkVariants({ variant: 'hover' })}>{item.label}</TocLink
              >
            </TocItemPart>
          {/each}
        </SwapIndicator>
      </SwapRoot>
    </TocNav>
  {:else}
    <TocNav class="flex min-w-0 flex-col gap-2">
      <!-- The machine labels the nav with `aria-labelledby` → the Title id, so a Title
           always renders; the collapsible variant shows its own label, so its Title is
           screen-reader only. -->
      <TocTitle class={showTitle ? tocTitleBase : 'sr-only'}>
        {#if titleSnippet}
          {@render titleSnippet()}
        {:else}
          {titleText}
        {/if}
      </TocTitle>

      {#if variant === 'default' || variant === 'indicator'}
        <TocList class={tocListVariants({ variant })}>
          {#if variant === 'indicator' && !itemIndicator}
            <TocIndicator class={tocIndicatorBase} />
          {/if}
          {#each items as item (item.value)}
            <TocItemPart {item} class={cn(tocItemBase, 'relative')}>
              {#if itemIndicator && currentValue === item.value}
                <span data-scope="toc" data-part="indicator" class={cn(tocIndicatorBase, '!top-0')}></span>
              {/if}
              <TocLink
                href={`#${item.value}`}
                aria-current={currentValue === item.value ? 'location' : 'false'}
                data-current={currentValue === item.value || undefined}
                class={tocLinkVariants({ variant })}>{item.label}</TocLink
              >
            </TocItemPart>
          {/each}
        </TocList>
      {:else if variant === 'rail'}
        <TocList class={tocListVariants({ variant: 'rail' })}>
          {#each items as item, index (item.value)}
            {@const line = railLineOffset(item.depth)}
            {@const prevLine = railLineOffset(items[index - 1]?.depth ?? item.depth)}
            {@const nextLine = railLineOffset(items[index + 1]?.depth ?? item.depth)}
            {@const turns = prevLine !== line}
            <TocItemPart {item} class={tocItemBase}>
              <TocLink
                href={`#${item.value}`}
                aria-current={currentValue === item.value ? 'location' : 'false'}
                data-current={currentValue === item.value || undefined}
                class={tocLinkVariants({ variant: 'rail' })}
                style="padding-inline-start: {railTextOffset(item.depth)}px"
              >
                <svg
                  class="pointer-events-none absolute start-0 overflow-visible text-border group-data-[current]/link:text-primary"
                  style="top: {-RAIL_BRIDGE}px; width: {Math.max(prevLine, line) + 9}px; height: {line === nextLine
                    ? `calc(100% + ${RAIL_BRIDGE}px)`
                    : '100%'}"
                  aria-hidden="true"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1"
                >
                  {#if turns}
                    <path d="M {prevLine + 0.5} 0 C {prevLine + 0.5} 8 {line + 0.5} 4 {line + 0.5} {RAIL_BRIDGE * 2}" />
                  {/if}
                  <line x1={line + 0.5} y1={turns ? RAIL_BRIDGE * 2 : RAIL_BRIDGE} x2={line + 0.5} y2="100%" />
                </svg>
                {item.label}
              </TocLink>
            </TocItemPart>
          {/each}
        </TocList>
      {:else if variant === 'tree'}
        <TreeView.Root
          class="w-full"
          collection={treeCollection}
          {expandedValue}
          onExpandedChange={({ expandedValue: next }) => {
            const nextSet = new Set(next);
            treeToggled = Object.fromEntries(treeRoots.map((node) => [node.value, nextSet.has(node.value)]));
          }}
        >
          <TreeView.Tree class="flex min-w-0 flex-col gap-0.5">
            {#each treeRoots as node, index (node.value)}
              <TocTreeNode {node} indexPath={[index]} />
            {/each}
          </TreeView.Tree>
        </TreeView.Root>
      {:else}
        <!-- Ark's Collapsible + progress-ring construction, with numbered links. -->
        <CollapsibleRoot class="flex w-full flex-col gap-2">
          <CollapsibleTrigger
            class="flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg border border-border bg-transparent px-3 py-2.5 text-start text-sm font-medium text-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <TocContext>
              {#snippet render(_context)}
                <span class="flex min-w-0 items-center gap-2">
                  <svg viewBox="0 0 36 36" aria-hidden="true" class="size-6 shrink-0">
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke="currentColor"
                      stroke-opacity="0.2"
                      stroke-width="2.5"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      pathLength="100"
                      class="stroke-primary"
                      stroke-width="2.5"
                      stroke-dasharray="{activeProgress() * 100} 100"
                      stroke-linecap="round"
                      transform="rotate(-90 18 18)"
                      style="transition: stroke-dasharray 0.4s ease-out"
                    />
                    <text
                      x="18"
                      y="18"
                      text-anchor="middle"
                      dominant-baseline="central"
                      font-size="10"
                      font-weight="600"
                      fill="currentColor"
                    >
                      {activeIndex() >= 0 ? activeIndex() + 1 : '—'}
                    </text>
                  </svg>
                  <span class="truncate text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    {activeLabel()}
                  </span>
                </span>
              {/snippet}
            </TocContext>
            <CollapsibleIndicator
              class="size-4 shrink-0 text-muted-foreground transition-transform data-[state=open]:rotate-90"
            >
              <ChevronRight class="size-4" aria-hidden="true" />
            </CollapsibleIndicator>
          </CollapsibleTrigger>
          <CollapsibleContent class="overflow-hidden pt-1 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0">
            <TocList class={tocListVariants({ variant: 'collapsible' })}>
              {#each items as item, index (item.value)}
                <TocItemPart {item} class={tocItemBase}>
                  <TocLink
                    href={`#${item.value}`}
                    aria-current={currentValue === item.value ? 'location' : 'false'}
                    data-current={currentValue === item.value || undefined}
                    class={cn(tocLinkVariants({ variant: 'collapsible' }), 'gap-2')}
                  >
                    <span class="text-xs tabular-nums opacity-60">{String(index + 1).padStart(2, '0')}</span>
                    {item.label}
                  </TocLink>
                </TocItemPart>
              {/each}
            </TocList>
          </CollapsibleContent>
        </CollapsibleRoot>
      {/if}
    </TocNav>
  {/if}
</TocRootProvider>
