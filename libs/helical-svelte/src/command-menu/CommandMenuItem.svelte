<!-- libs/helical-svelte/src/command-menu/CommandMenuItem.svelte -->
<script lang="ts">
  // 1. Imports
  import { Highlight } from '@ark-ui/svelte/highlight';
  import { Check, ChevronRight } from 'lucide-svelte';
  import {
    commandMenuItemVariants,
    splitHighlightSegments,
    type CommandFlatItem,
  } from '@cloudvoyant/helical-ui';
  import Kbd from '../Kbd.svelte';
  import { ListboxItem, ListboxItemText } from '../listbox';
  import Row from '../Row.svelte';
  import { getCommandMenuContext } from './context.svelte';

  // 2. Module constants & types
  interface Props {
    item: CommandFlatItem;
  }

  const HIGHLIGHT_MARK_CLASS =
    'rounded-xs bg-primary/20 px-0.5 font-semibold text-foreground';

  // --- State ---
  let { item }: Props = $props();

  const ctx = getCommandMenuContext();
  const isHighlighted = $derived(ctx.effectiveHighlightedValue === item.value);
</script>

<ListboxItem
  item={{
    value: item.value,
    label: item.command,
    disabled: item.disabled,
  }}
  data-testid="command-menu-item"
  data-command-value={item.node.value}
  data-command-token={item.command}
  data-command-branch={item.isBranch ? 'true' : 'false'}
  data-command-active={item.active ? 'true' : undefined}
  data-highlighted={isHighlighted ? '' : undefined}
  onclick={(e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    ctx.executeOrDrillItem(item);
  }}
  class={commandMenuItemVariants({ size: ctx.size })}
>
  <ListboxItemText class="min-w-0 flex-1 truncate">
    <Row class="min-w-0 items-center gap-2">
      <span class="truncate font-mono font-medium text-foreground group-data-[highlighted]:text-accent-foreground">
        {#if item.commandMatchPositions && item.commandMatchPositions.length > 0}{#each splitHighlightSegments(item.command, item.commandMatchPositions) as seg}{#if seg.highlight}<mark class={HIGHLIGHT_MARK_CLASS}>{seg.text}</mark>{:else}<span>{seg.text}</span>{/if}{/each}{:else if ctx.resolution.partialToken.trim().length > 0}<Highlight text={item.command} query={ctx.resolution.partialToken.trim()} ignoreCase matchAll class={HIGHLIGHT_MARK_CLASS} />{:else}{item.command}{/if}
      </span>
      {#if item.active}
        <Check
          class="size-3.5 shrink-0 text-primary"
          aria-label="Active"
        />
      {/if}
    </Row>
  </ListboxItemText>
  {#if Boolean(ctx.showShortcuts && item.shortcut) || item.isBranch}
    <Row class="shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
      {#if Boolean(ctx.showShortcuts && item.shortcut)}
        <Kbd size="sm" hotkey={item.shortcut} />
      {/if}
      {#if item.isBranch}
        <ChevronRight
          class="size-3.5 text-muted-foreground"
          aria-hidden="true"
        />
      {/if}
    </Row>
  {/if}
</ListboxItem>
