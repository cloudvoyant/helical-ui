<!-- libs/helical-svelte/src/colon-command/ColonCommand.svelte -->
<script lang="ts">
  // 1. Imports
  import { createListCollection } from '@ark-ui/svelte/listbox';
  import {
    announceCommandMessage,
    cn,
    colonCommandDialogContentBase,
    colonCommandPositionerBase,
    colonCommandVariants,
    createCommandTree,
    formatColonCompletionInput,
    resolveColonCommandGridNavigation,
    resolveColonCommandState,
    type ColonCommandProps as CoreColonCommandProps,
    type CommandFlatItem,
    type CommandSelectContext,
  } from '@cloudvoyant/helical-ui';
  import { getOptionalCommandContext } from '../command';
  import {
    Dialog,
    DialogBackdrop,
    DialogContent,
    DialogTitle,
  } from '../dialog';
  import { Listbox } from '../listbox';
  import ColonCommandError from './ColonCommandError.svelte';
  import ColonCommandList from './ColonCommandList.svelte';
  import ColonCommandPromptBar from './ColonCommandPromptBar.svelte';
  import { setColonCommandContext } from './context.svelte';

  // 2. Module constants & types
  type Props = Omit<CoreColonCommandProps, 'className'> & {
    class?: string;
    className?: string;
  };

  // --- State ---
  let {
    items: itemsProp,
    collection: externalCollectionProp,
    open: controlledOpen = $bindable(undefined),
    defaultOpen = false,
    onOpenChange,
    inputValue: controlledInputValue = $bindable(undefined),
    onInputValueChange,
    onSelectCommand: onSelectCommandProp,
    placeholder = '',
    emptyText = 'No matching commands.',
    noCommandsText = 'No commands registered.',
    columns = 'auto',
    showShortcuts = false,
    size = 'md',
    inline = false,
    class: className = '',
    className: reactClassName = '',
  }: Props = $props();

  const sharedCommand = getOptionalCommandContext();

  // svelte-ignore state_referenced_locally
  let uncontrolledOpen = $state(Boolean(defaultOpen));
  let uncontrolledInput = $state('');
  let tabBaseInput = $state<string | null>(null);
  let highlightedValue = $state<string | null>(null);
  let submittedError = $state<string | null>(null);
  let rootEl = $state<HTMLDivElement | null>(null);

  const items = $derived(itemsProp ?? sharedCommand?.items);
  const externalCollection = $derived(externalCollectionProp ?? sharedCommand?.collection);
  const sharedOpen = $derived(
    sharedCommand && sharedCommand.style === 'colon' ? sharedCommand.open : undefined,
  );
  const isOpen = $derived(inline ? true : (controlledOpen ?? sharedOpen ?? uncontrolledOpen));
  const currentInput = $derived(controlledInputValue ?? uncontrolledInput);
  const tree = $derived(createCommandTree(externalCollection ?? items ?? []));
  const effectiveResolutionInput = $derived(tabBaseInput ?? currentInput);
  const resolution = $derived(resolveColonCommandState(tree, effectiveResolutionInput));
  const enabledSuggestions = $derived(
    resolution.suggestions.filter((item) => !item.disabled),
  );

  const effectiveHighlightedValue = $derived.by((): string | null => {
    if (enabledSuggestions.length === 0) return null;
    if (
      highlightedValue &&
      enabledSuggestions.some((item) => item.value === highlightedValue)
    ) {
      return highlightedValue;
    }
    return enabledSuggestions[0]!.value;
  });

  const listCollection = $derived(
    createListCollection({
      items: resolution.suggestions.map((item) => ({
        value: item.value,
        label: item.command,
        disabled: item.disabled,
        item,
      })),
    }),
  );

  const activeError = $derived(submittedError ?? resolution.error);

  // --- Effects ---
  $effect(() => {
    if (!isOpen || inline || typeof document === 'undefined') return;
    const focusInput = () => {
      getInputElement()?.focus();
    };
    focusInput();
    const raf = requestAnimationFrame(focusInput);
    return () => cancelAnimationFrame(raf);
  });

  // --- Methods ---
  function setInputValue(nextValue: string, nextTabBase: string | null = null) {
    if (controlledInputValue !== undefined) {
      controlledInputValue = nextValue;
    } else {
      uncontrolledInput = nextValue;
    }
    tabBaseInput = nextTabBase;
    submittedError = null;
    onInputValueChange?.(nextValue);
  }

  function handleOpenChange(nextOpen: boolean) {
    if (controlledOpen !== undefined) {
      controlledOpen = nextOpen;
    } else {
      uncontrolledOpen = nextOpen;
    }
    if (sharedCommand && sharedCommand.style === 'colon') {
      sharedCommand.setOpen(nextOpen);
    }
    if (!nextOpen) {
      setInputValue('', null);
      submittedError = null;
    }
    onOpenChange?.(nextOpen);
  }

  function executeOrDrillItem(item: CommandFlatItem) {
    if (item.disabled) return;
    if (item.isBranch) {
      const nextInput = formatColonCompletionInput(
        resolution.completedTokens,
        item,
      );
      setInputValue(nextInput);
      highlightedValue = null;
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
    sharedCommand?.onSelectCommand?.(ctx);
    announceCommandMessage(`Executed ${item.fullCommand}`);

    if (!inline && item.node.closeOnSelect !== false) {
      handleOpenChange(false);
    } else {
      setInputValue('');
    }
  }

  function handleInputKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      if (!inline) {
        e.preventDefault();
        e.stopPropagation();
        handleOpenChange(false);
      } else if (currentInput.length > 0) {
        setInputValue('', null);
      } else {
        (e.currentTarget as HTMLElement | null)?.blur?.();
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
        highlightedValue = null;
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
      highlightedValue = nextTarget.value;
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
      highlightedValue = nextTarget.value;
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
        submittedError = errText;
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
  }

  // --- Helpers ---
  function getInputElement(): HTMLInputElement | null {
    if (rootEl) {
      return rootEl.querySelector<HTMLInputElement>('[data-testid="colon-command-input"]');
    }
    return null;
  }

  function scrollItemIntoView(val: string) {
    requestAnimationFrame(() => {
      const container = rootEl ?? (typeof document !== 'undefined' ? document : null);
      if (!container) return;
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

  setColonCommandContext({
    get resolution() {
      return resolution;
    },
    get enabledSuggestions() {
      return enabledSuggestions;
    },
    get effectiveHighlightedValue() {
      return effectiveHighlightedValue;
    },
    get currentInput() {
      return currentInput;
    },
    get activeError() {
      return activeError;
    },
    get columns() {
      return columns;
    },
    get size() {
      return size;
    },
    get showShortcuts() {
      return showShortcuts;
    },
    get inline() {
      return inline;
    },
    get placeholder() {
      return placeholder;
    },
    get emptyText() {
      return emptyText;
    },
    get noCommandsText() {
      return noCommandsText;
    },
    setInputValue,
    setHighlightedValue(val: string | null) {
      highlightedValue = val;
    },
    handleOpenChange,
    executeOrDrillItem,
    handleInputKeyDown,
  });
</script>

{#snippet colonSurface()}
  <div
    bind:this={rootEl}
    data-colon-command="true"
    data-modal={inline ? 'false' : undefined}
    data-size={size}
    data-colon-columns={String(columns)}
    data-colon-command-inline={inline ? 'true' : undefined}
    data-testid={inline ? 'colon-command' : 'colon-command-surface'}
    class={cn(
      colonCommandVariants({ size }),
      inline ? cn('rounded-lg border', className, reactClassName) : 'max-w-none border-0 shadow-none',
    )}
  >
    <Listbox
      collection={listCollection}
      selectionMode="single"
      highlightedValue={effectiveHighlightedValue}
      onHighlightChange={(details) => {
        if (details.highlightedValue) {
          highlightedValue = details.highlightedValue;
        }
      }}
      class="flex w-full flex-col overflow-hidden rounded-none border-0 bg-transparent shadow-none"
    >
      <ColonCommandList />
      <ColonCommandPromptBar />
      <ColonCommandError />
    </Listbox>
  </div>
{/snippet}

{#if inline}
  {@render colonSurface()}
{:else}
  <Dialog
    open={isOpen}
    lazyMount
    unmountOnExit
    initialFocusEl={() => getInputElement()}
    onOpenChange={(details) => handleOpenChange(details.open)}
  >
    <DialogBackdrop class="bg-black/20" />
    <DialogContent
      positionerClass={colonCommandPositionerBase}
      data-colon-command="true"
      data-modal="true"
      data-size={size}
      data-colon-columns={String(columns)}
      data-testid="colon-command"
      class={cn(
        colonCommandDialogContentBase,
        colonCommandVariants({ size }),
        className,
        reactClassName,
      )}
    >
      <DialogTitle class="sr-only">Colon Command Prompt</DialogTitle>
      {@render colonSurface()}
    </DialogContent>
  </Dialog>
{/if}
