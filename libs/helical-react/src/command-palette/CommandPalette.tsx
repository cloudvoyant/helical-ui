// 1. Imports
import {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { createListCollection } from '@ark-ui/react/listbox';
import {
  cn,
  commandPaletteStyles,
  createCommandTree,
  matchesCommandHotkey,
  type CommandFlatItem,
  type CommandPaletteProps as CoreCommandPaletteProps,
  type CommandSelectContext,
} from '@cloudvoyant/helical-ui';
import {
  announceCommandMessage,
  resolveCommandLevel,
  shouldHandleCommandHotkey,
} from '@cloudvoyant/helical-ui/commands';
import { Button } from '../button';
import { useOptionalCommand } from '../command';
import {
  Dialog,
  DialogBackdrop,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '../dialog';
import { Kbd } from '../kbd';
import { Listbox } from '../listbox';
import { CommandPaletteFooter } from './CommandPaletteFooter';
import { CommandPaletteResults } from './CommandPaletteResults';
import { CommandPaletteSearch } from './CommandPaletteSearch';
import { CommandPaletteContext, type CommandPaletteContextValue } from './context';

// 2. Module constants & types
export interface CommandPaletteProps extends CoreCommandPaletteProps {
  trigger?: ReactNode;
  children?: ReactNode;
}

// 4. Exported functions / components
/**
 * Renders a searchable `Mod+K` command palette modal or inline surface with composable subcomponents.
 */
export const CommandPalette = forwardRef<HTMLDivElement, CommandPaletteProps>(
  (
    {
      items: itemsProp,
      collection: externalCollectionProp,
      open: controlledOpen,
      defaultOpen = false,
      onOpenChange,
      activePath: controlledActivePath,
      onActivePathChange,
      query: controlledQuery,
      onQueryChange,
      onSelectCommand: onSelectCommandProp,
      placeholder = 'Type a command or search...',
      emptyText = 'No matching commands.',
      noCommandsText = 'No commands registered.',
      size = 'md',
      inline = false,
      hotkey = 'Mod+k',
      className,
      trigger,
      children,
    },
    ref,
  ) => {
    // --- State ---
    const sharedCommand = useOptionalCommand();
    const isStandalone = itemsProp !== undefined || externalCollectionProp !== undefined;
    const isProviderManaged =
      !isStandalone && sharedCommand !== null && sharedCommand !== undefined;
    const items = itemsProp ?? sharedCommand?.items;
    const externalCollection = externalCollectionProp ?? sharedCommand?.collection;

    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
    const [uncontrolledActivePath, setUncontrolledActivePath] = useState<string[]>([]);
    const [uncontrolledQuery, setUncontrolledQuery] = useState('');
    const [highlightedValue, setHighlightedValue] = useState<string | null>(null);
    const rootRef = useRef<HTMLDivElement | null>(null);
    const anchorRef = useRef<HTMLSpanElement | null>(null);

    const sharedOpen = isProviderManaged
      ? sharedCommand.style === 'palette' && sharedCommand.open
      : undefined;
    const isOpen = inline ? true : (controlledOpen ?? sharedOpen ?? uncontrolledOpen);
    const currentActivePath = controlledActivePath ?? uncontrolledActivePath;
    const currentQuery = controlledQuery ?? uncontrolledQuery;

    const tree = useMemo(
      () => createCommandTree(externalCollection ?? items ?? []),
      [externalCollection, items],
    );

    const resolution = useMemo(
      () => resolveCommandLevel(tree, currentActivePath, currentQuery),
      [tree, currentActivePath, currentQuery],
    );

    const enabledItems = useMemo(
      () => resolution.items.filter((item) => !item.disabled),
      [resolution.items],
    );

    const effectiveHighlightedValue = useMemo(() => {
      if (enabledItems.length === 0) return null;
      if (
        highlightedValue &&
        enabledItems.some((item) => item.value === highlightedValue)
      ) {
        return highlightedValue;
      }
      return enabledItems[0]!.value;
    }, [enabledItems, highlightedValue]);

    const listCollection = useMemo(
      () =>
        createListCollection({
          items: resolution.items.map((item) => ({
            value: item.value,
            label: item.label,
            disabled: item.disabled,
            item,
          })),
        }),
      [resolution.items],
    );

    // --- Effects ---
    useEffect(() => {
      if (inline || !hotkey || typeof window === 'undefined') return;
      if (isProviderManaged && sharedCommand?.style !== 'palette') return;
      const onWindowKeyDown = (event: globalThis.KeyboardEvent) => {
        if (!matchesCommandHotkey(event, hotkey)) return;
        if (
          !isOpen &&
          !shouldHandleCommandHotkey(anchorRef.current, '[data-command-palette-anchor="true"]')
        ) {
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        handleOpenChange(!isOpen);
      };
      window.addEventListener('keydown', onWindowKeyDown, true);
      return () => window.removeEventListener('keydown', onWindowKeyDown, true);
    });

    useEffect(() => {
      if (!isOpen || inline || typeof document === 'undefined') return;
      focusInput();
      const raf = requestAnimationFrame(focusInput);
      return () => cancelAnimationFrame(raf);
    }, [isOpen, inline, currentActivePath.length]);

    // --- Methods ---
    const setActivePath = (nextPath: string[]) => {
      if (controlledActivePath === undefined) {
        setUncontrolledActivePath(nextPath);
      }
      onActivePathChange?.(nextPath);
    };

    const setQuery = (nextQuery: string) => {
      if (controlledQuery === undefined) {
        setUncontrolledQuery(nextQuery);
      }
      onQueryChange?.(nextQuery);
    };

    const handleOpenChange = (nextOpen: boolean) => {
      if (controlledOpen === undefined) {
        setUncontrolledOpen(nextOpen);
      }
      if (isProviderManaged && sharedCommand?.style === 'palette') {
        sharedCommand.setOpen(nextOpen);
      }
      if (!nextOpen) {
        setActivePath([]);
        setQuery('');
      }
      onOpenChange?.(nextOpen);
    };

    const selectFlatItem = (item: CommandFlatItem) => {
      if (item.disabled) return;
      if (item.isBranch) {
        setActivePath(item.valuePath);
        setQuery('');
        setHighlightedValue(null);
        announceCommandMessage(`${item.label} submenu`);
        requestAnimationFrame(focusInput);
        return;
      }

      const shouldClose = !inline && item.node.closeOnSelect !== false;

      const ctx: CommandSelectContext = {
        value: item.node.value,
        valuePath: item.valuePath,
        commandString: item.fullCommand,
        node: item.node,
      };
      item.node.onSelect?.(ctx);
      onSelectCommandProp?.(ctx);
      if (!isStandalone) {
        sharedCommand?.onSelectCommand?.(ctx);
      }
      announceCommandMessage(`Executed ${item.label}`);

      if (shouldClose) {
        handleOpenChange(false);
      }
    };

    const popSubmenu = () => {
      if (currentActivePath.length === 0) return false;
      const nextPath = currentActivePath.slice(0, -1);
      setActivePath(nextPath);
      setQuery('');
      setHighlightedValue(null);
      requestAnimationFrame(focusInput);
      return true;
    };

    const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace' && currentQuery === '' && currentActivePath.length > 0) {
        e.preventDefault();
        e.stopPropagation();
        popSubmenu();
        return;
      }
      if (e.key === 'Escape') {
        if (currentActivePath.length > 0) {
          e.preventDefault();
          e.stopPropagation();
          popSubmenu();
          return;
        }
        if (!inline) {
          e.preventDefault();
          e.stopPropagation();
          handleOpenChange(false);
        } else if (currentQuery.length > 0) {
          setQuery('');
        } else {
          e.currentTarget.blur();
        }
        return;
      }
      if (enabledItems.length === 0) return;
      if (e.key === 'Tab') {
        e.preventDefault();
        e.stopPropagation();
        const delta = e.shiftKey ? -1 : 1;
        const currentIdx = enabledItems.findIndex(
          (item) => item.value === effectiveHighlightedValue,
        );
        const nextIdx =
          currentIdx === -1
            ? 0
            : (currentIdx + delta + enabledItems.length) % enabledItems.length;
        const nextVal = enabledItems[nextIdx]!.value;
        setHighlightedValue(nextVal);
        scrollItemIntoView(nextVal);
        return;
      }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        e.stopPropagation();
        const delta = e.key === 'ArrowDown' ? 1 : -1;
        const currentIdx = enabledItems.findIndex(
          (item) => item.value === effectiveHighlightedValue,
        );
        const nextIdx =
          currentIdx === -1
            ? 0
            : (currentIdx + delta + enabledItems.length) % enabledItems.length;
        const nextVal = enabledItems[nextIdx]!.value;
        setHighlightedValue(nextVal);
        scrollItemIntoView(nextVal);
        return;
      }
      if (e.key === 'ArrowRight' && currentQuery === '') {
        const target = enabledItems.find(
          (item) => item.value === effectiveHighlightedValue,
        );
        if (target?.isBranch) {
          e.preventDefault();
          e.stopPropagation();
          selectFlatItem(target);
          return;
        }
      }
      if (e.key === 'Enter') {
        const target =
          enabledItems.find((item) => item.value === effectiveHighlightedValue) ??
          enabledItems[0];
        if (target) {
          e.preventDefault();
          e.stopPropagation();
          selectFlatItem(target);
        }
      }
    };

    // --- Helpers ---
    function getInputElement(): HTMLInputElement | null {
      if (rootRef.current) {
        return rootRef.current.querySelector<HTMLInputElement>(
          '[data-testid="command-palette-input"]',
        );
      }
      return null;
    }

    function focusInput() {
      getInputElement()?.focus();
    }

    function scrollItemIntoView(val: string) {
      requestAnimationFrame(() => {
        const container = rootRef.current ?? document;
        const els = Array.from(
          container.querySelectorAll<HTMLElement>('[data-part="item"]'),
        );
        for (const el of els) {
          if (el.getAttribute('data-value') === val) {
            el.scrollIntoView({ block: 'nearest' });
            break;
          }
        }
      });
    }

    const contextValue: CommandPaletteContextValue = {
      resolution,
      enabledItems,
      effectiveHighlightedValue,
      currentActivePath,
      currentQuery,
      inline,
      placeholder,
      emptyText,
      noCommandsText,
      setActivePath,
      setQuery,
      setHighlightedValue,
      handleOpenChange,
      selectFlatItem,
      popSubmenu,
      focusInput,
      handleInputKeyDown,
    };

    // --- Render ---
    const paletteSurface = (
      <CommandPaletteContext.Provider value={contextValue}>
        <div
          ref={(node) => {
            rootRef.current = node;
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
          }}
          data-command-palette="true"
          data-modal={inline ? 'false' : undefined}
          data-command-palette-inline={inline ? 'true' : undefined}
          data-testid={inline ? 'command-palette' : 'command-palette-surface'}
          className={cn(
            inline ? commandPaletteStyles.root({ size }) : 'flex w-full flex-col outline-none',
            inline ? className : undefined,
          )}
        >
          <Listbox
            collection={listCollection}
            selectionMode="single"
            highlightedValue={effectiveHighlightedValue}
            onHighlightChange={(details) => {
              if (details.highlightedValue) {
                setHighlightedValue(details.highlightedValue);
              }
            }}
            className="flex w-full flex-col overflow-hidden rounded-none border-0 bg-transparent shadow-none"
          >
            {children ?? (
              <>
                <CommandPaletteSearch />
                <CommandPaletteResults />
                <CommandPaletteFooter />
              </>
            )}
          </Listbox>
        </div>
      </CommandPaletteContext.Provider>
    );

    if (inline) {
      return paletteSurface;
    }

    const showTrigger =
      trigger !== undefined || (controlledOpen === undefined && !isProviderManaged);

    return (
      <span ref={anchorRef} data-command-palette-anchor="true" className="inline-flex">
        <Dialog
          open={isOpen}
          lazyMount
          unmountOnExit
          trapFocus={false}
          closeOnEscape={currentActivePath.length === 0}
          initialFocusEl={() => getInputElement()}
          onOpenChange={(details) => handleOpenChange(details.open)}
        >
          {showTrigger && (
            <DialogTrigger asChild>
              {trigger ?? (
                <Button variant="outline">
                  Open Command Palette <Kbd size="sm" hotkey="Mod+k" />
                </Button>
              )}
            </DialogTrigger>
          )}
          <DialogBackdrop />
          <DialogContent
            positionerClassName={commandPaletteStyles.positioner}
            data-command-palette="true"
            data-modal="true"
            data-testid="command-palette"
            className={cn(
              commandPaletteStyles.dialogContent,
              commandPaletteStyles.root({ size }),
              className,
            )}
          >
            <DialogTitle className="sr-only">Command Palette</DialogTitle>
            {paletteSurface}
          </DialogContent>
        </Dialog>
      </span>
    );
  },
);

CommandPalette.displayName = 'CommandPalette';
