// libs/helical-react/src/which-key/WhichKeyExplorer.tsx
// Searchable <leader>? (Space ?) Keybinding Exploration Menu built on Dialog + Listbox + Highlight.
import { useMemo } from 'react';
import { Highlight } from '@ark-ui/react/highlight';
import { createListCollection } from '@ark-ui/react/listbox';
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
import { Kbd } from '../kbd';
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
import { Row } from '../row';
import { useOptionalWhichKeyController, useWhichKey } from './context';

export type WhichKeyExplorerProps = CoreWhichKeyExplorerProps;

export function WhichKeyExplorer({
  open: controlledOpen,
  onOpenChange,
  placeholder = 'Search keybindings by command, group, or chord (e.g. "window", "goto", "Space w")...',
  className,
}: WhichKeyExplorerProps) {
  const controller = useOptionalWhichKeyController();
  if (!controller) return null;
  return (
    <WhichKeyExplorerInner
      open={controlledOpen}
      onOpenChange={onOpenChange}
      placeholder={placeholder}
      className={className}
    />
  );
}

function WhichKeyExplorerInner({
  open: controlledOpen,
  onOpenChange,
  placeholder,
  className,
}: WhichKeyExplorerProps) {
  const {
    preset,
    explorerOpen,
    explorerQuery,
    explorerEntries,
    openExplorer,
    closeExplorer,
    setExplorerQuery,
    controller,
  } = useWhichKey();

  const isOpen = controlledOpen ?? explorerOpen;

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      openExplorer();
    } else {
      closeExplorer();
    }
    onOpenChange?.(nextOpen);
  };

  const collection = useMemo(
    () =>
      createListCollection({
        items: explorerEntries.map((entry) => ({
          value: entry.id,
          label: `${entry.label} ${entry.sequenceText} ${entry.group}`,
          entry,
        })),
      }),
    [explorerEntries],
  );

  const groupedEntries = useMemo(() => {
    const groups = new Map<string, KeymapExplorerEntry[]>();
    for (const entry of explorerEntries) {
      const groupName = entry.group || 'General';
      const list = groups.get(groupName) ?? [];
      list.push(entry);
      groups.set(groupName, list);
    }
    return Array.from(groups.entries());
  }, [explorerEntries]);

  if (!isOpen) return null;

  return (
    <Dialog
      open={isOpen}
      lazyMount
      unmountOnExit
      onOpenChange={(details) => handleOpenChange(details.open)}
    >
      <DialogBackdrop />
      <DialogContent
        data-which-key-explorer="true"
        data-testid="which-key-explorer"
        className={cn(whichKeyExplorerContentBase, className)}
      >
        <DialogHeader className={whichKeyExplorerHeaderBase}>
          <Row className="items-center gap-2">
            <DialogTitle className="text-sm font-semibold">
              Keybinding Explorer
            </DialogTitle>
            <span className={whichKeyModeBadgeVariants({ mode: 'normal' })}>
              {preset}
            </span>
          </Row>
          <Row className="items-center gap-2">
            <span className="hidden text-xs text-muted-foreground sm:inline">
              Press <Kbd size="sm">↵</Kbd> to run · <Kbd size="sm">Esc</Kbd> to close
            </span>
            <DialogDismiss />
          </Row>
        </DialogHeader>

        <Listbox
          collection={collection}
          selectionMode="single"
          onSelect={(details) => {
            controller.executeExplorerEntry(details.value);
          }}
          className={whichKeyExplorerListboxBase}
        >
          <ListboxInput
            autoHighlight
            data-testid="which-key-explorer-input"
            placeholder={placeholder}
            value={explorerQuery}
            onChange={(e) => setExplorerQuery(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && explorerEntries.length > 0) {
                const highlightedEl = e.currentTarget
                  .closest('[data-scope="listbox"]')
                  ?.querySelector<HTMLElement>('[data-part="item"][data-highlighted]');
                const itemVal =
                  highlightedEl?.getAttribute('data-value') ??
                  explorerEntries[0]?.id;
                if (itemVal) {
                  e.preventDefault();
                  controller.executeExplorerEntry(itemVal);
                }
              }
            }}
          />
          <ListboxContent
            data-testid="which-key-explorer-list"
            className={whichKeyExplorerListContentBase}
          >
            {groupedEntries.map(([groupName, entries]) => (
              <ListboxItemGroup key={groupName}>
                <ListboxItemGroupLabel>{groupName}</ListboxItemGroupLabel>
                {entries.map((entry) => (
                  <ListboxItem
                    key={entry.id}
                    item={{
                      value: entry.id,
                      label: entry.label,
                    }}
                    data-testid="which-key-explorer-item"
                    data-command-id={entry.commandId}
                    onClick={() => controller.executeExplorerEntry(entry)}
                    className={whichKeyExplorerItemBase}
                  >
                    <ListboxItemText className="flex min-w-0 flex-1 flex-col items-start gap-0.5">
                      <span className="truncate font-medium text-foreground">
                        <Highlight
                          text={entry.label}
                          query={explorerQuery}
                          ignoreCase
                          matchAll
                          className={whichKeyExplorerHighlightMarkBase}
                        />
                      </span>
                      {entry.description && entry.description !== entry.label && (
                        <span className="truncate text-xs text-muted-foreground">
                          <Highlight
                            text={entry.description}
                            query={explorerQuery}
                            ignoreCase
                            matchAll
                            className={whichKeyExplorerHighlightMarkBase}
                          />
                        </span>
                      )}
                    </ListboxItemText>
                    <Row className="shrink-0 items-center gap-1">
                      <Kbd size="sm" hotkey={entry.chords} />
                    </Row>
                  </ListboxItem>
                ))}
              </ListboxItemGroup>
            ))}
            {groupedEntries.length === 0 && (
              <ListboxEmpty>No matching keybindings found.</ListboxEmpty>
            )}
          </ListboxContent>
        </Listbox>
      </DialogContent>
    </Dialog>
  );
}
