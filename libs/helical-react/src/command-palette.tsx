// libs/helical-react/src/command-palette.tsx

// 1. Imports
import { forwardRef, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Highlight } from '@ark-ui/react/highlight';
import { createListCollection } from '@ark-ui/react/listbox';
import { Check, ChevronRight, CornerDownLeft, Search } from 'lucide-react';
import {
  announceCommandMessage,
  cn,
  commandPaletteBreadcrumbBase,
  commandPaletteDialogContentBase,
  commandPaletteFooterBase,
  commandPaletteHeaderBase,
  commandPaletteInputBase,
  commandPaletteItemBase,
  commandPaletteListBase,
  commandPalettePositionerBase,
  commandPaletteVariants,
  createCommandTree,
  matchesCommandHotkey,
  resolveCommandLevel,
  shouldHandleCommandHotkey,
  splitHighlightSegments,
  type CommandFlatItem,
  type CommandPaletteProps as CoreCommandPaletteProps,
  type CommandSelectContext,
} from '@cloudvoyant/helical-ui';
import { Badge } from './badge';
import { Button } from './button';
import {
  Dialog,
  DialogBackdrop,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from './dialog';
import { useOptionalCommand } from './command';
import { Kbd } from './kbd';
import {
  Listbox,
  ListboxContent,
  ListboxEmpty,
  ListboxInput,
  ListboxItem,
  ListboxItemGroup,
  ListboxItemGroupLabel,
  ListboxItemText,
} from './listbox';
import { Row } from './row';
import { Scroll } from './scroll';

// 2. Module constants & types
export interface CommandPaletteProps extends CoreCommandPaletteProps {
  children?: ReactNode;
}

const HIGHLIGHT_MARK_CLASS =
  'rounded-xs bg-primary/20 px-0.5 font-semibold text-foreground';

// 3. Local helpers
function renderHighlightedLabel(
  label: string,
  query: string,
  matchPositions?: number[],
) {
  if (matchPositions && matchPositions.length > 0) {
    const segments = splitHighlightSegments(label, matchPositions);
    return (
      <>
        {segments.map((seg, idx) =>
          seg.highlight ? (
            <mark key={idx} className={HIGHLIGHT_MARK_CLASS}>
              {seg.text}
            </mark>
          ) : (
            <span key={idx}>{seg.text}</span>
          ),
        )}
      </>
    );
  }
  if (query.trim().length > 0) {
    return (
      <Highlight
        text={label}
        query={query.trim()}
        ignoreCase
        matchAll
        className={HIGHLIGHT_MARK_CLASS}
      />
    );
  }
  return <>{label}</>;
}

// 4. Exported component
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
      children,
    },
    ref,
  ) => {
    // --- State ---
    const sharedCommand = useOptionalCommand();
    const isStandalone = itemsProp !== undefined || externalCollectionProp !== undefined;
    const items = itemsProp ?? sharedCommand?.items;
    const externalCollection = externalCollectionProp ?? sharedCommand?.collection;

    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
    const [uncontrolledActivePath, setUncontrolledActivePath] = useState<string[]>([]);
    const [uncontrolledQuery, setUncontrolledQuery] = useState('');
    const [highlightedValue, setHighlightedValue] = useState<string | null>(null);
    const rootRef = useRef<HTMLDivElement | null>(null);
    const anchorRef = useRef<HTMLSpanElement | null>(null);

    const sharedOpen =
      !isStandalone && sharedCommand && sharedCommand.style === 'palette'
        ? sharedCommand.open
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

    const activePlaceholder =
      resolution.breadcrumbs.length > 0
        ? `${resolution.breadcrumbs[resolution.breadcrumbs.length - 1]!.label}...`
        : placeholder;

    // --- Effects ---
    useEffect(() => {
      if (inline || !hotkey || typeof window === 'undefined') return;
      const onWindowKeyDown = (event: KeyboardEvent) => {
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
      const focusInput = () => {
        getInputElement()?.focus();
      };
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
      if (sharedCommand && sharedCommand.style === 'palette') {
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
        requestAnimationFrame(() => {
          getInputElement()?.focus();
        });
        return;
      }

      const ctx: CommandSelectContext = {
        value: item.node.value,
        valuePath: item.valuePath,
        commandString: item.fullCommand,
        node: item.node,
      };
      item.node.onSelect?.(ctx);
      onSelectCommandProp?.(ctx);
      sharedCommand?.onSelectCommand?.(ctx);
      announceCommandMessage(`Executed ${item.label}`);

      if (!inline && item.node.closeOnSelect !== false) {
        handleOpenChange(false);
      }
    };

    const popSubmenu = () => {
      if (currentActivePath.length === 0) return false;
      const nextPath = currentActivePath.slice(0, -1);
      setActivePath(nextPath);
      setQuery('');
      setHighlightedValue(null);
      requestAnimationFrame(() => {
        getInputElement()?.focus();
      });
      return true;
    };

    // --- Helpers ---
    const getInputElement = (): HTMLInputElement | null => {
      if (rootRef.current) {
        return rootRef.current.querySelector<HTMLInputElement>(
          '[data-testid="command-palette-input"]',
        );
      }
      return null;
    };

    const scrollItemIntoView = (val: string) => {
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
    };

    // --- Render ---
    const paletteSurface = (
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
          inline ? commandPaletteVariants({ size }) : 'flex w-full flex-col outline-none',
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
          <div className={commandPaletteHeaderBase}>
            <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            {resolution.breadcrumbs.length > 0 && (
              <Row className="shrink-0 items-center gap-1" data-testid="command-palette-breadcrumbs">
                <button
                  type="button"
                  tabIndex={-1}
                  data-testid="command-palette-breadcrumb-root"
                  onClick={() => {
                    setActivePath([]);
                    setQuery('');
                    getInputElement()?.focus();
                  }}
                  className={commandPaletteBreadcrumbBase}
                >
                  Commands
                </button>
                {resolution.breadcrumbs.map((crumb, idx) => (
                  <button
                    key={crumb.value}
                    type="button"
                    tabIndex={-1}
                    data-testid="command-palette-breadcrumb"
                    data-breadcrumb-value={crumb.value}
                    onClick={() => {
                      setActivePath(currentActivePath.slice(0, idx + 1));
                      setQuery('');
                      getInputElement()?.focus();
                    }}
                    className={commandPaletteBreadcrumbBase}
                  >
                    <span>›</span>
                    <span>{crumb.label}</span>
                  </button>
                ))}
              </Row>
            )}
            <ListboxInput
              autoFocus={!inline}
              autoHighlight
              data-testid="command-palette-input"
              placeholder={activePlaceholder}
              value={currentQuery}
              onChange={(e) => setQuery(e.currentTarget.value)}
              onKeyDownCapture={(e) => {
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
              }}
              className={commandPaletteInputBase}
            />
            {!inline && (
              <button
                type="button"
                tabIndex={-1}
                aria-label="Close command palette"
                onClick={() => handleOpenChange(false)}
                className="shrink-0 opacity-80 transition-opacity hover:opacity-100"
              >
                <Kbd size="sm">Esc</Kbd>
              </button>
            )}
          </div>

          <Scroll className="max-h-80 min-h-0 flex-1" viewportClassName="max-h-80">
            <ListboxContent
              tabIndex={-1}
              data-testid="command-palette-list"
              className={commandPaletteListBase}
            >
              {!resolution.hasCommands ? (
                <ListboxEmpty
                  data-testid="command-palette-empty"
                  data-empty-kind="no-commands"
                >
                  {noCommandsText}
                </ListboxEmpty>
              ) : resolution.groups.length === 0 ? (
                <ListboxEmpty
                  data-testid="command-palette-empty"
                  data-empty-kind="no-matches"
                >
                  {emptyText}
                </ListboxEmpty>
              ) : (
                resolution.groups.map((group) => (
                  <ListboxItemGroup key={group.label}>
                    <ListboxItemGroupLabel>{group.label}</ListboxItemGroupLabel>
                    {group.items.map((item) => (
                      <ListboxItem
                        key={item.value}
                        item={{
                          value: item.value,
                          label: item.label,
                          disabled: item.disabled,
                        }}
                        data-testid="command-palette-item"
                        data-command-value={item.node.value}
                        data-command-branch={item.isBranch ? 'true' : 'false'}
                        data-command-active={item.active ? 'true' : undefined}
                        data-highlighted={effectiveHighlightedValue === item.value ? '' : undefined}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          selectFlatItem(item);
                        }}
                        className={commandPaletteItemBase}
                      >
                        <ListboxItemText className="min-w-0 flex-1 truncate font-medium text-foreground">
                          <Row className="min-w-0 items-center gap-2">
                            {currentQuery.trim().length > 0 &&
                              item.breadcrumbLabels.length > 0 &&
                              currentActivePath.length === 0 && (
                                <span
                                  data-testid="command-palette-item-path"
                                  className="shrink-0 text-xs text-muted-foreground"
                                >
                                  {item.breadcrumbLabels.join(' › ')} ›
                                </span>
                              )}
                            <span className="truncate">
                              {renderHighlightedLabel(
                                item.label,
                                currentQuery,
                                item.matchPositions,
                              )}
                            </span>
                            {item.badge && (
                              <Badge
                                variant="outline"
                                size="sm"
                                data-testid="command-palette-item-badge"
                              >
                                {item.badge}
                              </Badge>
                            )}
                            {item.active && (
                              <Check
                                className="size-3.5 shrink-0 text-primary"
                                aria-label="Active"
                              />
                            )}
                          </Row>
                        </ListboxItemText>
                        <Row className="shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
                          {item.shortcut && <Kbd size="sm" hotkey={item.shortcut} />}
                          {item.isBranch && (
                            <ChevronRight
                              className="size-4 text-muted-foreground"
                              aria-hidden="true"
                            />
                          )}
                        </Row>
                      </ListboxItem>
                    ))}
                  </ListboxItemGroup>
                ))
              )}
            </ListboxContent>
          </Scroll>

          <div className={commandPaletteFooterBase}>
            <Row className="items-center gap-3">
              <span className="inline-flex items-center gap-1">
                <Kbd size="sm">↑</Kbd>
                <Kbd size="sm">↓</Kbd>
                <span>Navigate</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <Kbd size="sm">
                  <CornerDownLeft className="size-3" />
                </Kbd>
                <span>Select</span>
              </span>
              {resolution.breadcrumbs.length > 0 && (
                <span className="inline-flex items-center gap-1">
                  <Kbd size="sm">⌫</Kbd>
                  <span>Back</span>
                </span>
              )}
            </Row>
            <span className="text-[11px] text-muted-foreground">
              {resolution.breadcrumbs.length > 0
                ? resolution.breadcrumbs.map((b) => b.label).join(' › ')
                : '⌘K'}
            </span>
          </div>
        </Listbox>
      </div>
    );

    if (inline) {
      return paletteSurface;
    }

    const showTrigger = children !== undefined || (controlledOpen === undefined && sharedOpen === undefined);

    return (
      <span ref={anchorRef} data-command-palette-anchor="true" className="inline-flex">
        <Dialog
          open={isOpen}
          lazyMount
          unmountOnExit
          closeOnEscape={currentActivePath.length === 0}
          initialFocusEl={() => getInputElement()}
          onOpenChange={(details) => handleOpenChange(details.open)}
        >
          {showTrigger && (
            <DialogTrigger asChild>
              {children ?? (
                <Button variant="outline">
                  Open Command Palette <Kbd size="sm" hotkey="Mod+k" />
                </Button>
              )}
            </DialogTrigger>
          )}
          <DialogBackdrop />
          <DialogContent
            positionerClassName={commandPalettePositionerBase}
            data-command-palette="true"
            data-modal="true"
            data-testid="command-palette"
            className={cn(
              commandPaletteDialogContentBase,
              commandPaletteVariants({ size }),
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
