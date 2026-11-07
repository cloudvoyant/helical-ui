// libs/helical-react/src/which-key/WhichKeyExplorer.tsx

// 1. Imports
import { useEffect, useMemo, useState } from 'react';
import { Highlight } from '@ark-ui/react/highlight';
import { createListCollection } from '@ark-ui/react/listbox';
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
import { Scroll } from '../scroll';
import { useOptionalWhichKeyController, useWhichKey } from './context';

// 2. Module constants & types
export type WhichKeyExplorerProps = CoreWhichKeyExplorerProps;

// 3. Local helpers / inner components
function WhichKeyExplorerInner({
  open: controlledOpen,
  onOpenChange,
  placeholder,
  className,
}: WhichKeyExplorerProps) {
  // --- State ---
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
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

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

  const orderedEntries = useMemo(
    () => groupedEntries.flatMap(([, entries]) => entries),
    [groupedEntries],
  );

  const effectiveHighlightedId = useMemo(() => {
    if (orderedEntries.length === 0) return null;
    if (highlightedId && orderedEntries.some((e) => e.id === highlightedId)) {
      return highlightedId;
    }
    return orderedEntries[0]!.id;
  }, [highlightedId, orderedEntries]);

  const collection = useMemo(
    () =>
      createListCollection({
        items: orderedEntries.map((entry) => ({
          value: entry.id,
          label: entry.label,
          entry,
        })),
      }),
    [orderedEntries],
  );

  // --- Effects ---
  useEffect(() => {
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
  }, [isOpen]);

  // --- Methods ---
  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      openExplorer();
    } else {
      closeExplorer();
    }
    onOpenChange?.(nextOpen);
  };

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

  // --- Render ---
  return (
    <Dialog
      open={isOpen}
      lazyMount
      unmountOnExit
      initialFocusEl={() =>
        typeof document !== 'undefined'
          ? document.querySelector<HTMLElement>(
              '[data-which-key-explorer] [data-testid="which-key-explorer-input"]',
            )
          : null
      }
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
              Keybindings
            </DialogTitle>
            <span className={whichKeyModeBadgeVariants({ mode: 'normal' })}>
              {preset}
            </span>
          </Row>
          <DialogDismiss
            tabIndex={-1}
            className="static opacity-80 hover:opacity-100 focus:ring-0"
          >
            <Kbd size="sm">Esc</Kbd>
          </DialogDismiss>
        </DialogHeader>

        <Listbox
          collection={collection}
          selectionMode="single"
          highlightedValue={effectiveHighlightedId}
          onHighlightChange={(details) => {
            if (details.highlightedValue) {
              setHighlightedId(details.highlightedValue);
            }
          }}
          onSelect={(details) => {
            controller.executeExplorerEntry(details.value);
          }}
          className={whichKeyExplorerListboxBase}
        >
          <ListboxInput
            autoFocus
            autoHighlight
            data-testid="which-key-explorer-input"
            placeholder={placeholder}
            value={explorerQuery}
            onChange={(e) => setExplorerQuery(e.currentTarget.value)}
            onKeyDown={(e) => {
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
                setHighlightedId(nextId);
                scrollItemIntoView(nextId);
                return;
              }
              if (e.key === 'Enter') {
                const itemVal = effectiveHighlightedId ?? orderedEntries[0]?.id;
                if (itemVal) {
                  e.preventDefault();
                  e.stopPropagation();
                  controller.executeExplorerEntry(itemVal);
                }
              }
            }}
            className={whichKeyExplorerInputBase}
          />
          <Scroll className="max-h-96 min-h-0 flex-1" viewportClassName="max-h-96">
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
                      <ListboxItemText className="min-w-0 flex-1 truncate font-medium text-foreground">
                        <Highlight
                          text={entry.label}
                          query={explorerQuery}
                          ignoreCase
                          matchAll
                          className={whichKeyExplorerHighlightMarkBase}
                        />
                      </ListboxItemText>
                      <Row className="shrink-0 items-center gap-1">
                        <Kbd size="sm" hotkey={entry.chords as KbdHotkey} />
                      </Row>
                    </ListboxItem>
                  ))}
                </ListboxItemGroup>
              ))}
              {groupedEntries.length === 0 && (
                <ListboxEmpty>No matching keybindings found.</ListboxEmpty>
              )}
            </ListboxContent>
          </Scroll>
        </Listbox>
      </DialogContent>
    </Dialog>
  );
}

// 4. Exported component
export function WhichKeyExplorer({
  open: controlledOpen,
  onOpenChange,
  placeholder = 'Search keybindings...',
  className,
}: WhichKeyExplorerProps) {
  // --- State ---
  const controller = useOptionalWhichKeyController();

  // --- Render ---
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
