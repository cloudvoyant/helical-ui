<!-- libs/helical-svelte/src/command-menu/CommandMenu.svelte -->
<script lang="ts">
  // 1. Imports
  import type { Snippet } from 'svelte';
  import { createListCollection } from '@ark-ui/svelte/listbox';
  import {
    cn,
    commandMenuStyles,
    createCommandTree,
    matchesCommandHotkey,
    type CommandFlatItem,
    type CommandMenuProps as CoreCommandMenuProps,
    type CommandSelectContext,
  } from '@cloudvoyant/helical-ui';
  import {
    announceCommandMessage,
    formatCommandMenuCompletionInput,
    resolveCommandMenuGridNavigation,
    resolveCommandMenuState,
    shouldHandleCommandHotkey,
  } from '@cloudvoyant/helical-ui/commands';
  import Button from '../Button.svelte';
  import { getOptionalCommandContext } from '../command';
  import {
    Dialog,
    DialogBackdrop,
    DialogContent,
    DialogTitle,
    DialogTrigger,
  } from '../dialog';
  import Kbd from '../Kbd.svelte';
  import { Listbox } from '../listbox';
  import CommandMenuError from './CommandMenuError.svelte';
  import CommandMenuList from './CommandMenuList.svelte';
  import CommandMenuPromptBar from './CommandMenuPromptBar.svelte';
  import { setCommandMenuContext } from './context.svelte';

  // 2. Module constants & types
  type Props = Omit<CoreCommandMenuProps, 'className'> & {
    class?: string;
    className?: string;
    trigger?: Snippet;
    children?: Snippet;
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
    hotkey = ':',
    class: className = '',
    className: reactClassName = '',
    trigger,
    children,
  }: Props = $props();

  const sharedCommand = getOptionalCommandContext();

  // svelte-ignore state_referenced_locally
  let uncontrolledOpen = $state(Boolean(defaultOpen));
  let uncontrolledInput = $state('');
  let tabBaseInput = $state<string | null>(null);
  let highlightedValue = $state<string | null>(null);
  let submittedError = $state<string | null>(null);
  let rootEl = $state<HTMLDivElement | null>(null);
  let anchorEl = $state<HTMLSpanElement | null>(null);

  const isStandalone = $derived(
    itemsProp !== undefined || externalCollectionProp !== undefined,
  );
  const isProviderManaged = $derived(
    !isStandalone && sharedCommand !== null && sharedCommand !== undefined,
  );
  const items = $derived(itemsProp ?? sharedCommand?.items);
  const externalCollection = $derived(externalCollectionProp ?? sharedCommand?.collection);
  const sharedOpen = $derived(
    isProviderManaged
      ? (sharedCommand!.style === 'menu' || sharedCommand!.style === 'colon') &&
          sharedCommand!.open
      : undefined,
  );
  const isOpen = $derived(inline ? true : (controlledOpen ?? sharedOpen ?? uncontrolledOpen));
  const currentInput = $derived(controlledInputValue ?? uncontrolledInput);
  const tree = $derived(createCommandTree(externalCollection ?? items ?? []));
  const effectiveResolutionInput = $derived(tabBaseInput ?? currentInput);
  const resolution = $derived(resolveCommandMenuState(tree, effectiveResolutionInput));
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
  const showTrigger = $derived(
    trigger !== undefined || (controlledOpen === undefined && !isProviderManaged),
  );

  // --- Effects ---
  $effect(() => {
    if (inline || !hotkey || typeof window === 'undefined') return;
    if (
      isProviderManaged &&
      sharedCommand?.style !== 'menu' &&
      sharedCommand?.style !== 'colon'
    ) {
      return;
    }
    const onWindowKeyDown = (event: KeyboardEvent) => {
      if (!matchesCommandHotkey(event, hotkey)) return;
      if (
        !isOpen &&
        !shouldHandleCommandHotkey(anchorEl, '[data-command-menu-anchor="true"]')
      ) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      handleOpenChange(hotkey === ':' ? true : !isOpen);
    };
    window.addEventListener('keydown', onWindowKeyDown, true);
    return () => window.removeEventListener('keydown', onWindowKeyDown, true);
  });

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
    if (
      isProviderManaged &&
      (sharedCommand?.style === 'menu' || sharedCommand?.style === 'colon')
    ) {
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
      const nextInput = formatCommandMenuCompletionInput(
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
    announceCommandMessage(`Executed ${item.fullCommand}`);

    if (shouldClose) {
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
        const completed = formatCommandMenuCompletionInput(
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

      const completed = formatCommandMenuCompletionInput(
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
      return rootEl.querySelector<HTMLInputElement>('[data-testid="command-menu-input"]');
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

  setCommandMenuContext({
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

{#snippet menuSurface()}
  <div
    bind:this={rootEl}
    data-command-menu="true"
    data-modal={inline ? 'false' : undefined}
    data-size={size}
    data-command-menu-columns={String(columns)}
    data-command-menu-inline={inline ? 'true' : undefined}
    data-testid={inline ? 'command-menu' : 'command-menu-surface'}
    class={cn(
      commandMenuStyles.root({ size }),
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
      {#if children}
        {@render children()}
      {:else}
        <CommandMenuList />
        <CommandMenuPromptBar />
        <CommandMenuError />
      {/if}
    </Listbox>
  </div>
{/snippet}

{#if inline}
  {@render menuSurface()}
{:else}
  <span bind:this={anchorEl} data-command-menu-anchor="true" class="inline-flex">
    <Dialog
      open={isOpen}
      lazyMount
      unmountOnExit
      trapFocus={false}
      initialFocusEl={() => getInputElement()}
      onOpenChange={(details) => handleOpenChange(details.open)}
    >
      {#if showTrigger}
        {#if trigger}
          <DialogTrigger asChild={trigger} />
        {:else}
          <Button variant="outline" onclick={() => handleOpenChange(true)}>
            Open Command Menu {#if hotkey}<Kbd size="sm">{hotkey}</Kbd>{/if}
          </Button>
        {/if}
      {/if}
      <DialogBackdrop class="bg-black/20" />
      <DialogContent
        positionerClass={commandMenuStyles.positioner}
        data-command-menu="true"
        data-modal="true"
        data-size={size}
        data-command-menu-columns={String(columns)}
        data-testid="command-menu"
        class={cn(
          commandMenuStyles.dialogContent,
          commandMenuStyles.root({ size }),
          className,
          reactClassName,
        )}
      >
        <DialogTitle class="sr-only">Command Menu</DialogTitle>
        {@render menuSurface()}
      </DialogContent>
    </Dialog>
  </span>
{/if}
