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
  colonCommandListBase,
  colonCommandPrefixBase,
  colonCommandPromptBarBase,
  colonCommandVariants,
  createCommandTree,
  formatColonCompletionInput,
  resolveColonCommandState,
  splitHighlightSegments,
  type ColonCommandProps as CoreColonCommandProps,
  type CommandFlatItem,
  type CommandSelectContext,
} from '@cloudvoyant/helical-ui';
import { Badge } from './badge';
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
      size = 'md',
      inline = false,
      className,
    },
    ref,
  ) => {
    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
    const [uncontrolledInput, setUncontrolledInput] = useState('');
    const [highlightedValue, setHighlightedValue] = useState<string | null>(null);
    const [submittedError, setSubmittedError] = useState<string | null>(null);

    const rootRef = useRef<HTMLDivElement | null>(null);

    const getInputElement = (): HTMLInputElement | null => {
      if (rootRef.current) {
        return rootRef.current.querySelector<HTMLInputElement>(
          '[data-testid="colon-command-input"]',
        );
      }
      if (typeof document !== 'undefined') {
        return document.querySelector<HTMLInputElement>(
          '[data-colon-command] [data-testid="colon-command-input"]',
        );
      }
      return null;
    };

    const isOpen = inline ? true : (controlledOpen ?? uncontrolledOpen);
    const currentInput = controlledInputValue ?? uncontrolledInput;

    const setInputValue = (nextValue: string) => {
      if (controlledInputValue === undefined) {
        setUncontrolledInput(nextValue);
      }
      setSubmittedError(null);
      onInputValueChange?.(nextValue);
    };

    const handleOpenChange = (nextOpen: boolean) => {
      if (controlledOpen === undefined) {
        setUncontrolledOpen(nextOpen);
      }
      if (!nextOpen) {
        setInputValue('');
        setSubmittedError(null);
      }
      onOpenChange?.(nextOpen);
    };

    const tree = useMemo(
      () => createCommandTree(externalCollection ?? items ?? []),
      [externalCollection, items],
    );

    const resolution = useMemo(
      () => resolveColonCommandState(tree, currentInput),
      [tree, currentInput],
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
        data-colon-command-inline={inline ? 'true' : undefined}
        data-testid={inline ? 'colon-command' : 'colon-command-surface'}
        className={cn(
          colonCommandVariants({ placement, size }),
          inline ? className : 'max-w-none border-0 shadow-none',
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
          <Scroll className="max-h-64 min-h-0 flex-1" viewportClassName="max-h-64">
            <ListboxContent
              data-testid="colon-command-list"
              className={colonCommandListBase}
            >
              {!resolution.hasCommands ? (
                <ListboxEmpty
                  data-testid="colon-command-empty"
                  data-empty-kind="no-commands"
                >
                  {noCommandsText}
                </ListboxEmpty>
              ) : resolution.suggestions.length === 0 ? (
                <ListboxEmpty
                  data-testid="colon-command-empty"
                  data-empty-kind="no-matches"
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
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      executeOrDrillItem(item);
                    }}
                    className={colonCommandItemBase}
                  >
                    <ListboxItemText className="min-w-0 flex-1 truncate">
                      <Row className="min-w-0 items-center gap-3">
                        <span className="shrink-0 font-mono font-semibold text-primary">
                          :{[...resolution.completedTokens, ''].join(' ')}
                          {renderFuzzyText(
                            item.command,
                            resolution.partialToken,
                            item.commandMatchPositions,
                          )}
                        </span>
                        {item.aliases.length > 0 && (
                          <span className="shrink-0 text-[11px] text-muted-foreground">
                            ({item.aliases.map((a) => `:${a}`).join(', ')})
                          </span>
                        )}
                        <span className="truncate font-sans text-xs text-muted-foreground">
                          {renderFuzzyText(
                            item.label,
                            resolution.partialToken,
                            item.matchPositions,
                          )}
                        </span>
                        {item.badge && (
                          <Badge
                            variant="outline"
                            size="sm"
                            data-testid="colon-command-item-badge"
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
                          className="size-3.5 text-muted-foreground"
                          aria-hidden="true"
                        />
                      )}
                    </Row>
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
            {resolution.breadcrumbs.length > 0 && (
              <Row className="shrink-0 items-center gap-1" data-testid="colon-command-breadcrumbs">
                {resolution.breadcrumbs.map((crumb, idx) => (
                  <button
                    key={crumb.value}
                    type="button"
                    data-testid="colon-command-breadcrumb"
                    data-breadcrumb-value={crumb.value}
                    onClick={() => {
                      const prefixTokens = resolution.completedTokens.slice(0, idx + 1);
                      setInputValue(`:${prefixTokens.join(' ')} `);
                      getInputElement()?.focus();
                    }}
                    className="inline-flex items-center gap-1 rounded bg-primary/15 px-1.5 py-0.5 font-mono text-xs font-medium text-primary hover:bg-primary/25"
                  >
                    <span>{crumb.command}</span>
                    <span>›</span>
                  </button>
                ))}
              </Row>
            )}
            <ListboxInput
              autoFocus={!inline}
              autoHighlight
              data-testid="colon-command-input"
              placeholder={placeholder}
              value={currentInput}
              onChange={(e) => setInputValue(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  if (!inline) {
                    e.preventDefault();
                    e.stopPropagation();
                    handleOpenChange(false);
                  } else {
                    setInputValue('');
                  }
                  return;
                }
                if (e.key === 'Tab') {
                  e.preventDefault();
                  e.stopPropagation();
                  const target =
                    enabledSuggestions.find(
                      (item) => item.value === effectiveHighlightedValue,
                    ) ?? enabledSuggestions[0];
                  if (target) {
                    const completed = formatColonCompletionInput(
                      resolution.completedTokens,
                      target,
                    );
                    setInputValue(completed);
                    setHighlightedValue(null);
                  }
                  return;
                }
                if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                  if (enabledSuggestions.length === 0) return;
                  e.preventDefault();
                  e.stopPropagation();
                  const delta = e.key === 'ArrowDown' ? 1 : -1;
                  const currentIdx = enabledSuggestions.findIndex(
                    (item) => item.value === effectiveHighlightedValue,
                  );
                  const nextIdx =
                    currentIdx === -1
                      ? 0
                      : (currentIdx + delta + enabledSuggestions.length) %
                        enabledSuggestions.length;
                  const nextVal = enabledSuggestions[nextIdx]!.value;
                  setHighlightedValue(nextVal);
                  scrollItemIntoView(nextVal);
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
                  if (resolution.exactNode && !resolution.exactNode.disabled) {
                    executeOrDrillItem(resolution.exactNode);
                    return;
                  }
                  const target =
                    enabledSuggestions.find(
                      (item) => item.value === effectiveHighlightedValue,
                    ) ?? enabledSuggestions[0];
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
                <span>Complete</span>
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
        <DialogBackdrop />
        <DialogContent
          data-colon-command="true"
          data-modal="true"
          data-colon-placement={placement}
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
