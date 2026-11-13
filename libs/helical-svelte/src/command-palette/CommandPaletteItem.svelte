<script lang="ts">
  // 1. Imports
  import { Highlight } from '@ark-ui/svelte/highlight';
  import { Check, ChevronRight } from 'lucide-svelte';
  import { cn, commandPaletteStyles, type CommandFlatItem } from '@cloudvoyant/helical-ui';
  import { splitHighlightSegments } from '@cloudvoyant/helical-ui/commands';
  import Badge from '../Badge.svelte';
  import Kbd from '../Kbd.svelte';
  import { ListboxItem, ListboxItemText } from '../listbox';
  import Row from '../Row.svelte';
  import { getCommandPaletteContext } from './context.svelte';

  // 2. Module constants & types
  interface Props {
    item: CommandFlatItem;
    class?: string;
    className?: string;
  }

  const HIGHLIGHT_MARK_CLASS =
    'rounded-xs bg-primary/20 px-0.5 font-semibold text-foreground';

  // --- State ---
  let { item, class: className = '', className: reactClassName = '' }: Props = $props();

  const ctx = getCommandPaletteContext();
  const isHighlighted = $derived(ctx.effectiveHighlightedValue === item.value);
</script>

<ListboxItem
  item={{
    value: item.value,
    label: item.label,
    disabled: item.disabled,
  }}
  data-testid="command-palette-item"
  data-command-value={item.node.value}
  data-command-branch={item.isBranch ? 'true' : 'false'}
  data-command-active={item.active ? 'true' : undefined}
  data-highlighted={isHighlighted ? '' : undefined}
  onclick={(e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    ctx.selectFlatItem(item);
  }}
  class={cn(commandPaletteStyles.item, className, reactClassName)}
>
  <ListboxItemText class="min-w-0 flex-1 truncate font-medium text-foreground">
    <Row class="min-w-0 items-center gap-2">
      {#if ctx.currentQuery.trim().length > 0 && item.breadcrumbLabels.length > 0 && ctx.currentActivePath.length === 0}
        <span
          data-testid="command-palette-item-path"
          class="shrink-0 text-xs text-muted-foreground"
        >
          {item.breadcrumbLabels.join(' › ')} ›
        </span>
      {/if}
      <span class="truncate">
        {#if item.matchPositions && item.matchPositions.length > 0}{#each splitHighlightSegments(item.label, item.matchPositions) as seg}{#if seg.highlight}<mark class={HIGHLIGHT_MARK_CLASS}>{seg.text}</mark>{:else}<span>{seg.text}</span>{/if}{/each}{:else if ctx.currentQuery.trim().length > 0}<Highlight text={item.label} query={ctx.currentQuery.trim()} ignoreCase matchAll class={HIGHLIGHT_MARK_CLASS} />{:else}{item.label}{/if}
      </span>
      {#if item.badge}
        <Badge
          variant="outline"
          size="sm"
          data-testid="command-palette-item-badge"
        >
          {item.badge}
        </Badge>
      {/if}
      {#if item.active}
        <Check
          class="size-3.5 shrink-0 text-primary"
          aria-label="Active"
        />
      {/if}
    </Row>
  </ListboxItemText>
  <Row class="shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
    {#if item.shortcut}
      <Kbd size="sm" hotkey={item.shortcut} />
    {/if}
    {#if item.isBranch}
      <ChevronRight
        class="size-4 text-muted-foreground"
        aria-hidden="true"
      />
    {/if}
  </Row>
</ListboxItem>
