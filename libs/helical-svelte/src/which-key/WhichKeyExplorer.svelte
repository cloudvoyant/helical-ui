<!-- libs/helical-svelte/src/which-key/WhichKeyExplorer.svelte -->
<script lang="ts">
  // 1. Imports
  import { Highlight } from '@ark-ui/svelte/highlight';
  import { createListCollection } from '@ark-ui/svelte/listbox';
  import {
    cn,
    whichKeyExplorerContentBase,
    whichKeyExplorerHeaderBase,
    whichKeyExplorerHighlightMarkBase,
    whichKeyExplorerInputBase,
    whichKeyExplorerItemBase,
    whichKeyExplorerListboxBase,
    whichKeyExplorerListContentBase,
    whichKeyModeBadgeVariants,
    type KbdHotkey,
    type KeymapExplorerEntry,
    type WhichKeyExplorerProps as CoreWhichKeyExplorerProps,
  } from '@cloudvoyant/helical-ui';
  import {
    Dialog,
    DialogBackdrop,
    DialogContent,
    DialogDismiss,
    DialogHeader,
    DialogTitle,
  } from '../dialog';
  import Kbd from '../Kbd.svelte';
  import {
    Listbox,
    ListboxContent,
    ListboxEmpty,
    ListboxInput,
    ListboxItem,
    ListboxItemGroup,
    ListboxItemGroupLabel,
    ListboxItemText,
  } from '../listbox';
  import Row from '../Row.svelte';
  import Scroll from '../Scroll.svelte';
  import { getOptionalWhichKeyContext } from './context.svelte';

  // 2. Module constants & types
  type Props = Omit<CoreWhichKeyExplorerProps, 'className'> & {
    class?: string;
    className?: string;
  };

  // --- State ---
  let {
    open: controlledOpen,
    onOpenChange,
    placeholder = 'Search keybindings...',
    class: className = '',
    className: reactClassName = '',
  }: Props = $props();

  const ctx = getOptionalWhichKeyContext();

  let highlightedId = $state<string | null>(null);

  const isOpen = $derived(controlledOpen ?? Boolean(ctx?.state.explorerOpen));
  const explorerEntries = $derived(ctx?.state.explorerEntries ?? []);
  const explorerQuery = $derived(ctx?.state.explorerQuery ?? '');
  const preset = $derived(ctx?.state.preset ?? 'helix');

  const groupedEntries = $derived.by((): Array<[string, KeymapExplorerEntry[]]> => {
    const groups = new Map<string, KeymapExplorerEntry[]>();
    for (const entry of explorerEntries) {
      const groupName = entry.group || 'General';
      const list = groups.get(groupName) ?? [];
      list.push(entry);
      groups.set(groupName, list);
    }
    return Array.from(groups.entries());
  });

  const orderedEntries = $derived(groupedEntries.flatMap(([, entries]) => entries));

  const effectiveHighlightedId = $derived.by((): string | null => {
    if (orderedEntries.length === 0) return null;
    if (highlightedId && orderedEntries.some((e) => e.id === highlightedId)) {
      return highlightedId;
    }
    return orderedEntries[0]!.id;
  });

  const collection = $derived(
    createListCollection({
      items: orderedEntries.map((entry) => ({
        value: entry.id,
        label: entry.label,
        entry,
      })),
    }),
  );

  // --- Effects ---
  $effect(() => {
    if (!isOpen || typeof document === 'undefined') return;
    const focusInput = () => {
      const input = document.querySelector<HTMLInputElement>(
        '[data-which-key-explorer] [data-testid="which-key-explorer-input"]',
      );
      input?.focus();
    };
    focusInput();
    const raf = requestAnimationFrame(focusInput);
    return () => cancelAnimationFrame(raf);
  });

  // --- Methods ---
  function handleOpenChange(details: { open: boolean }) {
    if (!ctx) return;
    if (details.open) {
      ctx.controller.openExplorer();
    } else {
      ctx.controller.closeExplorer();
    }
    onOpenChange?.(details.open);
  }

  // --- Helpers ---
  function scrollItemIntoView(id: string) {
    requestAnimationFrame(() => {
      if (typeof document === 'undefined') return;
      const items = Array.from(
        document.querySelectorAll<HTMLElement>(
          '[data-which-key-explorer] [data-part="item"]',
        ),
      );
      for (const el of items) {
        if (el.getAttribute('data-value') === id) {
          el.scrollIntoView({ block: 'nearest' });
          break;
        }
      }
    });
  }
</script>

{#if ctx}
  <Dialog
    open={isOpen}
    lazyMount
    unmountOnExit
    initialFocusEl={() =>
      typeof document !== 'undefined'
        ? document.querySelector<HTMLElement>(
            '[data-which-key-explorer] [data-testid="which-key-explorer-input"]',
          )
        : null}
    onOpenChange={handleOpenChange}
  >
    <DialogBackdrop />
    <DialogContent
      data-which-key-explorer="true"
      data-testid="which-key-explorer"
      class={cn(whichKeyExplorerContentBase, className, reactClassName)}
    >
      <DialogHeader class={whichKeyExplorerHeaderBase}>
        <Row class="items-center gap-2">
          <DialogTitle class="text-sm font-semibold">Keybindings</DialogTitle>
          <span class={whichKeyModeBadgeVariants({ mode: 'normal' })}>
            {preset}
          </span>
        </Row>
        <DialogDismiss
          tabindex={-1}
          class="static opacity-80 hover:opacity-100 focus:ring-0"
        >
          {#snippet children()}
            <Kbd size="sm">Esc</Kbd>
          {/snippet}
        </DialogDismiss>
      </DialogHeader>

      <Listbox
        {collection}
        selectionMode="single"
        highlightedValue={effectiveHighlightedId}
        onHighlightChange={(details) => {
          if (details.highlightedValue) {
            highlightedId = details.highlightedValue;
          }
        }}
        onSelect={(details) => {
          ctx.controller.executeExplorerEntry(details.value);
        }}
        class={whichKeyExplorerListboxBase}
      >
        <ListboxInput
          autofocus
          autoHighlight
          data-testid="which-key-explorer-input"
          {placeholder}
          value={explorerQuery}
          oninput={(e: Event) => {
            ctx.controller.setExplorerQuery((e.currentTarget as HTMLInputElement).value);
          }}
          onkeydown={(e: KeyboardEvent) => {
            if (orderedEntries.length === 0) return;
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
              e.preventDefault();
              e.stopPropagation();
              const delta = e.key === 'ArrowDown' ? 1 : -1;
              const currentIdx = orderedEntries.findIndex(
                (item) => item.id === effectiveHighlightedId,
              );
              const nextIdx =
                currentIdx === -1
                  ? 0
                  : (currentIdx + delta + orderedEntries.length) %
                    orderedEntries.length;
              const nextId = orderedEntries[nextIdx]!.id;
              highlightedId = nextId;
              scrollItemIntoView(nextId);
              return;
            }
            if (e.key === 'Enter') {
              const itemVal = effectiveHighlightedId ?? orderedEntries[0]?.id;
              if (itemVal) {
                e.preventDefault();
                e.stopPropagation();
                ctx.controller.executeExplorerEntry(itemVal);
              }
            }
          }}
          class={whichKeyExplorerInputBase}
        />
        <Scroll class="max-h-96 min-h-0 flex-1" viewportClass="max-h-96">
          {#snippet children()}
            <ListboxContent
              data-testid="which-key-explorer-list"
              class={whichKeyExplorerListContentBase}
            >
              {#each groupedEntries as [groupName, entries] (groupName)}
                <ListboxItemGroup>
                  <ListboxItemGroupLabel>{groupName}</ListboxItemGroupLabel>
                  {#each entries as entry (entry.id)}
                    <ListboxItem
                      item={{
                        value: entry.id,
                        label: entry.label,
                      }}
                      data-testid="which-key-explorer-item"
                      data-command-id={entry.commandId}
                      onclick={() => ctx.controller.executeExplorerEntry(entry)}
                      class={whichKeyExplorerItemBase}
                    >
                      <ListboxItemText class="min-w-0 flex-1 truncate font-medium text-foreground">
                        <Highlight
                          text={entry.label}
                          query={explorerQuery}
                          ignoreCase
                          matchAll
                          class={whichKeyExplorerHighlightMarkBase}
                        />
                      </ListboxItemText>
                      <Row class="shrink-0 items-center gap-1">
                        <Kbd size="sm" hotkey={entry.chords as KbdHotkey} />
                      </Row>
                    </ListboxItem>
                  {/each}
                </ListboxItemGroup>
              {/each}
              {#if groupedEntries.length === 0}
                <ListboxEmpty>No matching keybindings found.</ListboxEmpty>
              {/if}
            </ListboxContent>
          {/snippet}
        </Scroll>
      </Listbox>
    </DialogContent>
  </Dialog>
{/if}
