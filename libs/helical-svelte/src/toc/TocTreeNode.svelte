<!-- libs/helical-svelte/src/toc/TocTreeNode.svelte -->
<!-- Recursive TreeView branch/item for the `tree` variant. Uses the internal TOC
     context/link getter, mirroring the upstream Ark TreeView example. -->
<script lang="ts">
  import { TreeView } from '@ark-ui/svelte/tree-view';
  import { cn, tocLinkVariants } from '@cloudvoyant/helical-ui';
  import { ChevronRight } from 'lucide-svelte';
  import { useTocContext } from './internal';
  import TocTreeNode from './TocTreeNode.svelte';
  import { getCurrentValue } from './current-value';
  import type { TocNode } from './TocView.svelte';

  type Props = {
    node: TocNode;
    indexPath: number[];
  };

  let { node, indexPath }: Props = $props();

  const toc = useTocContext();
  const linkProps = $derived(toc().getLinkProps({ item: { value: node.value, depth: node.depth } }));
  const current = $derived(getCurrentValue(toc()) === node.value);
</script>

<TreeView.NodeProvider {node} {indexPath}>
  {#if node.children}
    <TreeView.Branch class="flex min-w-0 flex-col">
      <TreeView.BranchControl class="flex min-w-0 items-center gap-0.5">
        <TreeView.BranchIndicator
          class="size-3.5 shrink-0 text-muted-foreground transition-transform data-[state=open]:rotate-90"
        >
          <ChevronRight class="size-3.5" aria-hidden="true" />
        </TreeView.BranchIndicator>
        <TreeView.BranchText class="min-w-0 flex-1">
          <a
            {...linkProps}
            aria-current={current ? 'location' : 'false'}
            data-current={current || undefined}
            class={cn(tocLinkVariants({ variant: 'tree' }), 'flex-1')}>{node.label}</a
          >
        </TreeView.BranchText>
      </TreeView.BranchControl>
      <TreeView.BranchContent class="relative ms-1.5 flex min-w-0 flex-col gap-0.5 ps-3">
        <TreeView.BranchIndentGuide class="absolute inset-y-0 start-1 w-px bg-border" />
        {#each node.children as child, index (child.value)}
          <TocTreeNode node={child} indexPath={[...indexPath, index]} />
        {/each}
      </TreeView.BranchContent>
    </TreeView.Branch>
  {:else}
    <TreeView.Item class="min-w-0">
      <TreeView.ItemText class="min-w-0">
        <a
          {...linkProps}
          aria-current={current ? 'location' : 'false'}
          data-current={current || undefined}
          class={tocLinkVariants({ variant: 'tree' })}>{node.label}</a
        >
      </TreeView.ItemText>
    </TreeView.Item>
  {/if}
</TreeView.NodeProvider>
