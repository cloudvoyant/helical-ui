<!-- libs/helical-svelte/src/which-key/WhichKeyExplorer.svelte -->
<script lang="ts">
  import { Highlight } from '@ark-ui/svelte/highlight';
  import { createListCollection } from '@ark-ui/svelte/listbox';
  import {
    cn,
    whichKeyExplorerContentBase,
    whichKeyExplorerHeaderBase,
    whichKeyExplorerHighlightMarkBase,
    whichKeyExplorerItemBase,
    whichKeyExplorerListboxBase,
    whichKeyExplorerListContentBase,
    whichKeyModeBadgeVariants,
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
  import { getOptionalWhichKeyContext } from './context.svelte';

  type Props = Omit<CoreWhichKeyExplorerProps, 'className'> & {
    class?: string;
    className?: string;
  };

  let {
    open: controlledOpen,
    onOpenChange,
    placeholder = 'Search keybindings by command, group, or chord (e.g. "window", "goto", "Space w")...',
    class: className = '',
    className: reactClassName = '',
  }: Props = $props();

  const ctx = getOptionalWhichKeyContext();

  const isOpen = $derived(controlledOpen ?? Boolean(ctx?.state.explorerOpen));
  const explorerEntries = $derived(ctx?.state.explorerEntries ?? []);
  const explorerQuery = $derived(ctx?.state.explorerQuery ?? '');
  const preset = $derived(ctx?.state.preset ?? 'helix');

  const collection = $derived(
    createListCollection({
      items: explorerEntries.map((entry) => ({
        value: entry.id,
        label: `${entry.label} ${entry.sequenceText} ${entry.group}`,
        entry,
      })),
    }),
  );

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

  function handleOpenChange(details: { open: boolean }) {
    if (!ctx) return;
    if (details.open) {
      ctx.controller.openExplorer();
    } else {
      ctx.controller.closeExplorer();
    }
    onOpenChange?.(details.open);
  }
</script>

{#if ctx && isOpen}
  <Dialog open={isOpen} lazyMount unmountOnExit onOpenChange={handleOpenChange}>
    <DialogBackdrop />
    <DialogContent
      data-which-key-explorer="true"
      data-testid="which-key-explorer"
      class={cn(whichKeyExplorerContentBase, className, reactClassName)}
    >
      <DialogHeader class={whichKeyExplorerHeaderBase}>
        <Row class="items-center gap-2">
          <DialogTitle class="text-sm font-semibold">Keybinding Explorer</DialogTitle>
          <span class={whichKeyModeBadgeVariants({ mode: 'normal' })}>
            {preset}
          </span>
        </Row>
        <Row class="items-center gap-2">
          <span class="hidden text-xs text-muted-foreground sm:inline">
            Press <Kbd size="sm">↵</Kbd> to run · <Kbd size="sm">Esc</Kbd> to close
          </span>
          <DialogDismiss />
        </Row>
      </DialogHeader>

      <Listbox
        {collection}
        selectionMode="single"
        onSelect={(details) => {
          ctx.controller.executeExplorerEntry(details.value);
        }}
        class={whichKeyExplorerListboxBase}
      >
        <ListboxInput
          autoHighlight
          data-testid="which-key-explorer-input"
          {placeholder}
          value={explorerQuery}
          oninput={(e: Event) => {
            ctx.controller.setExplorerQuery((e.currentTarget as HTMLInputElement).value);
          }}
          onkeydown={(e: KeyboardEvent) => {
            if (e.key === 'Enter' && explorerEntries.length > 0) {
              const target = e.currentTarget as HTMLElement | null;
              const highlightedEl = target
                ?.closest('[data-scope="listbox"]')
                ?.querySelector<HTMLElement>('[data-part="item"][data-highlighted]');
              const itemVal =
                highlightedEl?.getAttribute('data-value') ??
                explorerEntries[0]?.id;
              if (itemVal) {
                e.preventDefault();
                ctx.controller.executeExplorerEntry(itemVal);
              }
            }
          }}
        />
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
                  <ListboxItemText class="flex min-w-0 flex-1 flex-col items-start gap-0.5">
                    <span class="truncate font-medium text-foreground">
                      <Highlight
                        text={entry.label}
                        query={explorerQuery}
                        ignoreCase
                        matchAll
                        class={whichKeyExplorerHighlightMarkBase}
                      />
                    </span>
                    {#if entry.description && entry.description !== entry.label}
                      <span class="truncate text-xs text-muted-foreground">
                        <Highlight
                          text={entry.description}
                          query={explorerQuery}
                          ignoreCase
                          matchAll
                          class={whichKeyExplorerHighlightMarkBase}
                        />
                      </span>
                    {/if}
                  </ListboxItemText>
                  <Row class="shrink-0 items-center gap-1">
                    <Kbd size="sm" hotkey={entry.chords} />
                  </Row>
                </ListboxItem>
              {/each}
            </ListboxItemGroup>
          {/each}
          {#if groupedEntries.length === 0}
            <ListboxEmpty>No matching keybindings found.</ListboxEmpty>
          {/if}
        </ListboxContent>
      </Listbox>
    </DialogContent>
  </Dialog>
{/if}
