// Source: https://docs.helix-editor.com/commands.html
// Closely based on: Ark UI dialog, listbox, and highlight (https://ark-ui.com/docs/components/listbox).

// 1. Imports
import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { Highlight } from '@ark-ui/react/highlight';
import { createListCollection } from '@ark-ui/react/listbox';
import { AlertCircle, Check, ChevronRight, CornerDownLeft } from 'lucide-react';
import {
  announceCommandMessage,
  cn,
  colonCommandDialogPositionerVariants,
  colonCommandErrorBase,
  colonCommandInputBase,
  colonCommandItemBase,
  colonCommandListVariants,
  colonCommandPositionerVariants,
  colonCommandPrefixBase,
  colonCommandPromptBarBase,
  colonCommandVariants,
  createCommandTree,
  formatColonCompletionInput,
  resolveColonCommandGridNavigation,
  resolveColonCommandGridStyle,
  resolveColonCommandState,
  splitHighlightSegments,
  type ColonCommandProps as CoreColonCommandProps,
  type CommandFlatItem,
  type CommandSelectContext,
} from '@cloudvoyant/helical-ui';
import {
  Dialog,
  DialogBackdrop,
  DialogContent,
  DialogTitle,
} from './dialog';
import { Kbd } from './kbd';
import {
  Listbox,
  ListboxContent,
  ListboxEmpty,
  ListboxInput,
  ListboxItem,
  ListboxItemText,
} from './listbox';
import { Row } from './row';
import { Scroll } from './scroll';

// 2. Module constants & types
export type ColonCommandProps = CoreColonCommandProps;

const HIGHLIGHT_MARK_CLASS =
  'rounded-xs bg-primary/20 px-0.5 font-semibold text-foreground';

// 3. Local helpers
function renderFuzzyText(
  text: string,
  query: string,
  matchPositions?: number[],
) {
  if (matchPositions && matchPositions.length > 0) {
    const segments = splitHighlightSegments(text, matchPositions);
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
        text={text}
        query={query.trim()}
        ignoreCase
        matchAll
        className={HIGHLIGHT_MARK_CLASS}
      />
    );
  }
  return <>{text}</>;
}

// 4. Exported component
export const ColonCommand = forwardRef<HTMLDivElement, ColonCommandProps>(
  (
    {
      items,
      collection: externalCollection,
      open: controlledOpen,
      defaultOpen = false,
      onOpenChange,
      inputValue: controlledInputValue,
      onInputValueChange,
      onSelectCommand,
      placeholder = 'Type a command (e.g. theme, mode, keybind)...',
      emptyText = 'No matching commands.',
      noCommandsText = 'No commands registered.',
      placement = 'bottom',
      columns = 'auto',
      showShortcuts = false,
      size = 'md',
      inline = false,
      className,
    },
    ref,
  ) => {
    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
    const [uncontrolledInput, setUncontrolledInput] = useState('');
    const [tabBaseInput, setTabBaseInput] = useState<string | null>(null);
    const [highlightedValue, setHighlightedValue] = useState<string | null>(null);
    const [submittedError, setSubmittedError] = useState<string | null>(null);

    const rootRef = useRef<HTMLDivElement | null>(null);

    const getInputElement = (): HTMLInputElement | null => {
      if (rootRef.current) {
        return rootRef.current.querySelector<HTMLInputElement>(
          '[data-testid="colon-command-input"]',
        );
      }
      return null;
    };

    const isOpen = inline ? true : (controlledOpen ?? uncontrolledOpen);
    const currentInput = controlledInputValue ?? uncontrolledInput;

    const setInputValue = (nextValue: string, nextTabBase: string | null = null) => {
      if (controlledInputValue === undefined) {
        setUncontrolledInput(nextValue);
      }
      setTabBaseInput(nextTabBase);
      setSubmittedError(null);
      onInputValueChange?.(nextValue);
    };

    const handleOpenChange = (nextOpen: boolean) => {
      if (controlledOpen === undefined) {
        setUncontrolledOpen(nextOpen);
      }
      if (!nextOpen) {
        setInputValue('', null);
        setSubmittedError(null);
      }
      onOpenChange?.(nextOpen);
    };

    const tree = useMemo(
      () => createCommandTree(externalCollection ?? items ?? []),
      [externalCollection, items],
    );

    const effectiveResolutionInput = tabBaseInput ?? currentInput;

    const resolution = useMemo(
      () => resolveColonCommandState(tree, effectiveResolutionInput),
      [tree, effectiveResolutionInput],
    );

    const enabledSuggestions = useMemo(
      () => resolution.suggestions.filter((item) => !item.disabled),
      [resolution.suggestions],
    );

    const effectiveHighlightedValue = useMemo(() => {
      if (enabledSuggestions.length === 0) return null;
      if (
        highlightedValue &&
        enabledSuggestions.some((item) => item.value === highlightedValue)
      ) {
        return highlightedValue;
      }
      return enabledSuggestions[0]!.value;
    }, [enabledSuggestions, highlightedValue]);

    const listCollection = useMemo(
      () =>
        createListCollection({
          items: resolution.suggestions.map((item) => ({
            value: item.value,
            label: item.command,
            disabled: item.disabled,
            item,
          })),
        }),
      [resolution.suggestions],
    );

    useEffect(() => {
      if (!isOpen || inline || typeof document === 'undefined') return;
      const focusInput = () => {
        getInputElement()?.focus();
      };
      focusInput();
      const raf = requestAnimationFrame(focusInput);
      return () => cancelAnimationFrame(raf);
    }, [isOpen, inline]);

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

    const executeOrDrillItem = (item: CommandFlatItem) => {
      if (item.disabled) return;
      if (item.isBranch) {
        const nextInput = formatColonCompletionInput(
          resolution.completedTokens,
          item,
        );
        setInputValue(nextInput);
        setHighlightedValue(null);
        announceCommandMessage(`${item.label} subcommands`);
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
      onSelectCommand?.(ctx);
      announceCommandMessage(`Executed ${item.fullCommand}`);

      if (!inline && item.node.closeOnSelect !== false) {
        handleOpenChange(false);
      } else {
        setInputValue('');
      }
    };

    const activeError = submittedError ?? resolution.error;

    const colonSurface = (
      <div
        ref={(node) => {
          rootRef.current = node;
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        data-colon-command="true"
        data-modal={inline ? 'false' : undefined}
        data-colon-placement={placement}
        data-colon-columns={String(columns)}
        data-colon-command-inline={inline ? 'true' : undefined}
        data-testid={inline ? 'colon-command' : 'colon-command-surface'}
        className={cn(
          colonCommandVariants({ placement, size }),
          inline ? cn('rounded-lg border', className) : 'max-w-none border-0 shadow-none',
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
          <Scroll className="max-h-60 min-h-0 flex-1" viewportClassName="max-h-60">
            <ListboxContent
              tabIndex={-1}
              data-testid="colon-command-list"
              data-columns={String(columns)}
              style={resolveColonCommandGridStyle(columns, resolution.suggestions.length)}
              className={colonCommandListVariants({ columns })}
            >
              {!resolution.hasCommands ? (
                <ListboxEmpty
                  data-testid="colon-command-empty"
                  data-empty-kind="no-commands"
                  className="col-span-full"
                >
                  {noCommandsText}
                </ListboxEmpty>
              ) : resolution.suggestions.length === 0 ? (
                <ListboxEmpty
                  data-testid="colon-command-empty"
                  data-empty-kind="no-matches"
                  className="col-span-full"
                >
                  {activeError ?? emptyText}
                </ListboxEmpty>
              ) : (
                resolution.suggestions.map((item) => (
                  <ListboxItem
                    key={item.value}
                    item={{
                      value: item.value,
                      label: item.command,
                      disabled: item.disabled,
                    }}
                    data-testid="colon-command-item"
                    data-command-value={item.node.value}
                    data-command-token={item.command}
                    data-command-branch={item.isBranch ? 'true' : 'false'}
                    data-command-active={item.active ? 'true' : undefined}
                    data-highlighted={effectiveHighlightedValue === item.value ? '' : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      executeOrDrillItem(item);
                    }}
                    className={colonCommandItemBase}
                  >
                    <ListboxItemText className="min-w-0 flex-1 truncate">
                      <Row className="min-w-0 items-center gap-2">
                        <span className="truncate font-mono font-medium text-foreground group-data-[highlighted]:text-accent-foreground">
                          {renderFuzzyText(
                            item.command,
                            resolution.partialToken,
                            item.commandMatchPositions,
                          )}
                        </span>
                        {item.active && (
                          <Check
                            className="size-3.5 shrink-0 text-primary"
                            aria-label="Active"
                          />
                        )}
                      </Row>
                    </ListboxItemText>
                    {((showShortcuts && item.shortcut) || item.isBranch) && (
                      <Row className="shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
                        {showShortcuts && item.shortcut && <Kbd size="sm" hotkey={item.shortcut} />}
                        {item.isBranch && (
                          <ChevronRight
                            className="size-3.5 text-muted-foreground"
                            aria-hidden="true"
                          />
                        )}
                      </Row>
                    )}
                  </ListboxItem>
                ))
              )}
            </ListboxContent>
          </Scroll>

          <div className={colonCommandPromptBarBase}>
            <span
              data-testid="colon-command-prefix"
              className={colonCommandPrefixBase}
            >
              :
            </span>
            <ListboxInput
              autoFocus={!inline}
              autoHighlight
              data-testid="colon-command-input"
              placeholder={placeholder}
              value={currentInput}
              onChange={(e) => setInputValue(e.currentTarget.value, null)}
              onKeyDownCapture={(e) => {
                if (e.key === 'Escape') {
                  if (!inline) {
                    e.preventDefault();
                    e.stopPropagation();
                    handleOpenChange(false);
                  } else if (currentInput.length > 0) {
                    setInputValue('', null);
                  } else {
                    e.currentTarget.blur();
                  }
                  return;
                }
                if (e.key === 'Tab') {
                  e.preventDefault();
                  e.stopPropagation();
                  if (enabledSuggestions.length === 0) return;
                  const currentIdx = enabledSuggestions.findIndex(
                    (item) => item.value === effectiveHighlightedValue,
                  );
                  const currentTarget =
                    (currentIdx !== -1 ? enabledSuggestions[currentIdx] : undefined) ??
                    enabledSuggestions[0]!;

                  if (
                    !e.shiftKey &&
                    tabBaseInput === null &&
                    currentTarget.isBranch &&
                    resolution.partialToken.length > 0
                  ) {
                    const completed = formatColonCompletionInput(
                      resolution.completedTokens,
                      currentTarget,
                      true,
                    );
                    setInputValue(completed, null);
                    setHighlightedValue(null);
                    requestAnimationFrame(() => {
                      getInputElement()?.focus();
                    });
                    return;
                  }

                  const baseForCycle = tabBaseInput ?? currentInput;
                  let nextTarget = currentTarget;
                  if (
                    tabBaseInput !== null ||
                    e.shiftKey ||
                    resolution.partialToken === currentTarget.command
                  ) {
                    const delta = e.shiftKey ? -1 : 1;
                    const nextIdx =
                      currentIdx === -1
                        ? 0
                        : (currentIdx + delta + enabledSuggestions.length) %
                          enabledSuggestions.length;
                    nextTarget = enabledSuggestions[nextIdx]!;
                  }

                  const completed = formatColonCompletionInput(
                    resolution.completedTokens,
                    nextTarget,
                    false,
                  );
                  setInputValue(
                    completed,
                    enabledSuggestions.length > 1 ? baseForCycle : null,
                  );
                  setHighlightedValue(nextTarget.value);
                  scrollItemIntoView(nextTarget.value);
                  requestAnimationFrame(() => {
                    getInputElement()?.focus();
                  });
                  return;
                }
                if (
                  e.key === 'ArrowDown' ||
                  e.key === 'ArrowUp' ||
                  e.key === 'ArrowRight' ||
                  e.key === 'ArrowLeft'
                ) {
                  if (enabledSuggestions.length === 0) return;
                  e.preventDefault();
                  e.stopPropagation();
                  const currentIdx = enabledSuggestions.findIndex(
                    (item) => item.value === effectiveHighlightedValue,
                  );
                  const nextIdx = resolveColonCommandGridNavigation(
                    columns,
                    enabledSuggestions.length,
                    currentIdx,
                    e.key,
                  );
                  const nextTarget = enabledSuggestions[nextIdx]!;
                  if (tabBaseInput !== null) {
                    const completed = formatColonCompletionInput(
                      resolution.completedTokens,
                      nextTarget,
                      false,
                    );
                    setInputValue(
                      completed,
                      enabledSuggestions.length > 1 ? tabBaseInput : null,
                    );
                  }
                  setHighlightedValue(nextTarget.value);
                  scrollItemIntoView(nextTarget.value);
                  return;
                }
                if (e.key === 'Enter') {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!resolution.hasCommands) return;
                  if (resolution.error || enabledSuggestions.length === 0) {
                    const errText =
                      resolution.error ??
                      `Unknown command: ${currentInput.replace(/^:/, '').trim()}`;
                    setSubmittedError(errText);
                    announceCommandMessage(errText);
                    return;
                  }
                  const target =
                    enabledSuggestions.find(
                      (item) => item.value === effectiveHighlightedValue,
                    ) ??
                    (resolution.exactNode && !resolution.exactNode.disabled
                      ? resolution.exactNode
                      : undefined) ??
                    enabledSuggestions[0];
                  if (target) {
                    executeOrDrillItem(target);
                  }
                }
              }}
              className={colonCommandInputBase}
            />
            <Row className="shrink-0 items-center gap-1.5 text-[11px] text-muted-foreground">
              <span className="hidden items-center gap-1 sm:inline-flex">
                <Kbd size="sm">Tab</Kbd>
                <span>Next</span>
              </span>
              <span className="hidden items-center gap-1 sm:inline-flex">
                <Kbd size="sm">
                  <CornerDownLeft className="size-3" />
                </Kbd>
                <span>Run</span>
              </span>
              {!inline && (
                <button
                  type="button"
                  tabIndex={-1}
                  aria-label="Close colon command menu"
                  onClick={() => handleOpenChange(false)}
                  className="opacity-80 transition-opacity hover:opacity-100"
                >
                  <Kbd size="sm">Esc</Kbd>
                </button>
              )}
            </Row>
          </div>

          {activeError && resolution.hasCommands && (
            <div
              role="alert"
              data-testid="colon-command-error"
              className={colonCommandErrorBase}
            >
              <Row className="items-center gap-1.5">
                <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
                <span>{activeError}</span>
              </Row>
            </div>
          )}
        </Listbox>
      </div>
    );

    if (inline) {
      return colonSurface;
    }

    if (!isOpen) return null;

    return (
      <Dialog
        open={isOpen}
        lazyMount
        unmountOnExit
        initialFocusEl={() => getInputElement()}
        onOpenChange={(details) => handleOpenChange(details.open)}
      >
        <DialogBackdrop className={placement === 'bottom' ? 'bg-black/20' : undefined} />
        <DialogContent
          positionerClassName={colonCommandPositionerVariants({ placement })}
          data-colon-command="true"
          data-modal="true"
          data-colon-placement={placement}
          data-colon-columns={String(columns)}
          data-testid="colon-command"
          className={cn(
            colonCommandDialogPositionerVariants({ placement }),
            colonCommandVariants({ placement, size }),
            className,
          )}
        >
          <DialogTitle className="sr-only">Colon Command Prompt</DialogTitle>
          {colonSurface}
        </DialogContent>
      </Dialog>
    );
  },
);

ColonCommand.displayName = 'ColonCommand';
