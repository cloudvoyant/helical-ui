// libs/helical-react/src/command-menu/CommandMenu.tsx

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
  announceCommandMessage,
  cn,
  commandMenuDialogContentBase,
  commandMenuPositionerBase,
  commandMenuVariants,
  createCommandTree,
  formatCommandMenuCompletionInput,
  matchesCommandHotkey,
  resolveCommandMenuGridNavigation,
  resolveCommandMenuState,
  shouldHandleCommandHotkey,
  type CommandFlatItem,
  type CommandMenuProps as CoreCommandMenuProps,
  type CommandSelectContext,
} from '@cloudvoyant/helical-ui';
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
import { CommandMenuError } from './CommandMenuError';
import { CommandMenuList } from './CommandMenuList';
import { CommandMenuPromptBar } from './CommandMenuPromptBar';
import { CommandMenuContext, type CommandMenuContextValue } from './context';

// 2. Module constants & types
export interface CommandMenuProps extends CoreCommandMenuProps {
  children?: ReactNode;
}

export type ColonCommandProps = CommandMenuProps;

// 4. Exported component
export const CommandMenu = forwardRef<HTMLDivElement, CommandMenuProps>(
  (
    {
      items: itemsProp,
      collection: externalCollectionProp,
      open: controlledOpen,
      defaultOpen = false,
      onOpenChange,
      inputValue: controlledInputValue,
      onInputValueChange,
      onSelectCommand: onSelectCommandProp,
      placeholder = '',
      emptyText = 'No matching commands.',
      noCommandsText = 'No commands registered.',
      columns = 'auto',
      showShortcuts = false,
      size = 'md',
      inline = false,
      hotkey = ':',
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
    const [uncontrolledInput, setUncontrolledInput] = useState('');
    const [tabBaseInput, setTabBaseInput] = useState<string | null>(null);
    const [highlightedValue, setHighlightedValue] = useState<string | null>(null);
    const [submittedError, setSubmittedError] = useState<string | null>(null);

    const rootRef = useRef<HTMLDivElement | null>(null);
    const anchorRef = useRef<HTMLSpanElement | null>(null);

    const sharedOpen =
      !isStandalone &&
      sharedCommand &&
      (sharedCommand.style === 'menu' || sharedCommand.style === 'colon')
        ? sharedCommand.open
        : undefined;
    const isOpen = inline ? true : (controlledOpen ?? sharedOpen ?? uncontrolledOpen);
    const currentInput = controlledInputValue ?? uncontrolledInput;

    const tree = useMemo(
      () => createCommandTree(externalCollection ?? items ?? []),
      [externalCollection, items],
    );

    const effectiveResolutionInput = tabBaseInput ?? currentInput;

    const resolution = useMemo(
      () => resolveCommandMenuState(tree, effectiveResolutionInput),
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

    const activeError = submittedError ?? resolution.error;

    // --- Effects ---
    useEffect(() => {
      if (inline || !hotkey || typeof window === 'undefined') return;
      const onWindowKeyDown = (event: globalThis.KeyboardEvent) => {
        if (!matchesCommandHotkey(event, hotkey)) return;
        if (!shouldHandleCommandHotkey(anchorRef.current, '[data-command-menu-anchor="true"]')) {
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        handleOpenChange(true);
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
    }, [isOpen, inline]);

    // --- Methods ---
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
      if (
        !isStandalone &&
        sharedCommand &&
        (sharedCommand.style === 'menu' || sharedCommand.style === 'colon')
      ) {
        sharedCommand.setOpen(nextOpen);
      }
      if (!nextOpen) {
        setInputValue('', null);
        setSubmittedError(null);
      }
      onOpenChange?.(nextOpen);
    };

    const executeOrDrillItem = (item: CommandFlatItem) => {
      if (item.disabled) return;
      if (item.isBranch) {
        const nextInput = formatCommandMenuCompletionInput(
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
      onSelectCommandProp?.(ctx);
      if (!isStandalone) {
        sharedCommand?.onSelectCommand?.(ctx);
      }
      announceCommandMessage(`Executed ${item.fullCommand}`);

      if (!inline && item.node.closeOnSelect !== false) {
        handleOpenChange(false);
      } else {
        setInputValue('');
      }
    };

    const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
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
          const completed = formatCommandMenuCompletionInput(
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

        const completed = formatCommandMenuCompletionInput(
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
        const nextIdx = resolveCommandMenuGridNavigation(
          columns,
          enabledSuggestions.length,
          currentIdx,
          e.key,
        );
        const nextTarget = enabledSuggestions[nextIdx]!;
        if (tabBaseInput !== null) {
          const completed = formatCommandMenuCompletionInput(
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
    };

    // --- Helpers ---
    function getInputElement(): HTMLInputElement | null {
      if (rootRef.current) {
        return rootRef.current.querySelector<HTMLInputElement>(
          '[data-testid="command-menu-input"]',
        );
      }
      return null;
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

    const contextValue: CommandMenuContextValue = {
      resolution,
      enabledSuggestions,
      effectiveHighlightedValue,
      currentInput,
      activeError,
      columns,
      size,
      showShortcuts,
      inline,
      placeholder,
      emptyText,
      noCommandsText,
      setInputValue,
      setHighlightedValue,
      handleOpenChange,
      executeOrDrillItem,
      handleInputKeyDown,
    };

    // --- Render ---
    const menuSurface = (
      <CommandMenuContext.Provider value={contextValue}>
        <div
          ref={(node) => {
            rootRef.current = node;
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
          }}
          data-command-menu="true"
          data-modal={inline ? 'false' : undefined}
          data-size={size}
          data-command-menu-columns={String(columns)}
          data-command-menu-inline={inline ? 'true' : undefined}
          data-testid={inline ? 'command-menu' : 'command-menu-surface'}
          className={cn(
            commandMenuVariants({ size }),
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
            <CommandMenuList />
            <CommandMenuPromptBar />
            <CommandMenuError />
          </Listbox>
        </div>
      </CommandMenuContext.Provider>
    );

    if (inline) {
      return menuSurface;
    }

    const showTrigger = children !== undefined || (controlledOpen === undefined && sharedOpen === undefined);

    return (
      <span ref={anchorRef} data-command-menu-anchor="true" className="inline-flex">
        <Dialog
          open={isOpen}
          lazyMount
          unmountOnExit
          initialFocusEl={() => getInputElement()}
          onOpenChange={(details) => handleOpenChange(details.open)}
        >
          {showTrigger && (
            <DialogTrigger asChild>
              {children ?? (
                <Button variant="outline">
                  Open Command Menu {hotkey ? <Kbd size="sm">{hotkey}</Kbd> : null}
                </Button>
              )}
            </DialogTrigger>
          )}
          <DialogBackdrop className="bg-black/20" />
          <DialogContent
            positionerClassName={commandMenuPositionerBase}
            data-command-menu="true"
            data-modal="true"
            data-size={size}
            data-command-menu-columns={String(columns)}
            data-testid="command-menu"
            className={cn(
              commandMenuDialogContentBase,
              commandMenuVariants({ size }),
              className,
            )}
          >
            <DialogTitle className="sr-only">Command Menu</DialogTitle>
            {menuSurface}
          </DialogContent>
        </Dialog>
      </span>
    );
  },
);

CommandMenu.displayName = 'CommandMenu';

export const ColonCommand = CommandMenu;
