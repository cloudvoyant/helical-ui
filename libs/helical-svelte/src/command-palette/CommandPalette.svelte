<script lang="ts">
  // 1. Imports
  import type { Snippet } from 'svelte';
  import { createListCollection } from '@ark-ui/svelte/listbox';
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
  import CommandPaletteFooter from './CommandPaletteFooter.svelte';
  import CommandPaletteResults from './CommandPaletteResults.svelte';
  import CommandPaletteSearch from './CommandPaletteSearch.svelte';
  import { setCommandPaletteContext } from './context.svelte';

  // 2. Module constants & types
  type Props = Omit<CoreCommandPaletteProps, 'className'> & {
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
    activePath: controlledActivePath = $bindable(undefined),
    onActivePathChange,
    query: controlledQuery = $bindable(undefined),
    onQueryChange,
    onSelectCommand: onSelectCommandProp,
    placeholder = 'Type a command or search...',
    emptyText = 'No matching commands.',
    noCommandsText = 'No commands registered.',
    size = 'md',
    inline = false,
    hotkey = 'Mod+k',
    class: className = '',
    className: reactClassName = '',
    trigger,
    children,
  }: Props = $props();

  const sharedCommand = getOptionalCommandContext();

  // svelte-ignore state_referenced_locally
  let uncontrolledOpen = $state(Boolean(defaultOpen));
  let uncontrolledActivePath = $state<string[]>([]);
  let uncontrolledQuery = $state('');
  let highlightedValue = $state<string | null>(null);
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
      ? sharedCommand!.style === 'palette' && sharedCommand!.open
      : undefined,
  );
  const isOpen = $derived(inline ? true : (controlledOpen ?? sharedOpen ?? uncontrolledOpen));
  const showTrigger = $derived(
    trigger !== undefined || (controlledOpen === undefined && !isProviderManaged),
  );
  const currentActivePath = $derived(controlledActivePath ?? uncontrolledActivePath);
  const currentQuery = $derived(controlledQuery ?? uncontrolledQuery);

  const tree = $derived(createCommandTree(externalCollection ?? items ?? []));
  const resolution = $derived(resolveCommandLevel(tree, currentActivePath, currentQuery));
  const enabledItems = $derived(resolution.items.filter((item) => !item.disabled));

  const effectiveHighlightedValue = $derived.by((): string | null => {
    if (enabledItems.length === 0) return null;
    if (
      highlightedValue &&
      enabledItems.some((item) => item.value === highlightedValue)
    ) {
      return highlightedValue;
    }
    return enabledItems[0]!.value;
  });

  const listCollection = $derived(
    createListCollection({
      items: resolution.items.map((item) => ({
        value: item.value,
        label: item.label,
        disabled: item.disabled,
        item,
      })),
    }),
  );

  // --- Effects ---
  $effect(() => {
    if (inline || !hotkey || typeof window === 'undefined') return;
    if (isProviderManaged && sharedCommand?.style !== 'palette') return;
    const onWindowKeyDown = (event: KeyboardEvent) => {
      if (!matchesCommandHotkey(event, hotkey)) return;
      if (
        !isOpen &&
        !shouldHandleCommandHotkey(anchorEl, '[data-command-palette-anchor="true"]')
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

  $effect(() => {
    const _depth = currentActivePath.length;
    void _depth;
    if (!isOpen || inline || typeof document === 'undefined') return;
    focusInput();
    const raf = requestAnimationFrame(focusInput);
    return () => cancelAnimationFrame(raf);
  });

  // --- Methods ---
  function setActivePath(nextPath: string[]) {
    if (controlledActivePath !== undefined) {
      controlledActivePath = nextPath;
    } else {
      uncontrolledActivePath = nextPath;
    }
    onActivePathChange?.(nextPath);
  }

  function setQuery(nextQuery: string) {
    if (controlledQuery !== undefined) {
      controlledQuery = nextQuery;
    } else {
      uncontrolledQuery = nextQuery;
    }
    onQueryChange?.(nextQuery);
  }

  function handleOpenChange(nextOpen: boolean) {
    if (controlledOpen !== undefined) {
      controlledOpen = nextOpen;
    } else {
      uncontrolledOpen = nextOpen;
    }
    if (isProviderManaged && sharedCommand?.style === 'palette') {
      sharedCommand.setOpen(nextOpen);
    }
    if (!nextOpen) {
      setActivePath([]);
      setQuery('');
    }
    onOpenChange?.(nextOpen);
  }

  function selectFlatItem(item: CommandFlatItem) {
    if (item.disabled) return;
    if (item.isBranch) {
      setActivePath(item.valuePath);
      setQuery('');
      highlightedValue = null;
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
  }

  function popSubmenu(): boolean {
    if (currentActivePath.length === 0) return false;
    setActivePath(currentActivePath.slice(0, -1));
    setQuery('');
    highlightedValue = null;
    requestAnimationFrame(focusInput);
    return true;
  }

  function handleInputKeyDown(e: KeyboardEvent) {
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
        (e.currentTarget as HTMLElement | null)?.blur?.();
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
      highlightedValue = nextVal;
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
      highlightedValue = nextVal;
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
  }

  // --- Helpers ---
  function getInputElement(): HTMLInputElement | null {
    if (rootEl) {
      return rootEl.querySelector<HTMLInputElement>('[data-testid="command-palette-input"]');
    }
    return null;
  }

  function focusInput() {
    getInputElement()?.focus();
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

  setCommandPaletteContext({
    get resolution() {
      return resolution;
    },
    get enabledItems() {
      return enabledItems;
    },
    get effectiveHighlightedValue() {
      return effectiveHighlightedValue;
    },
    get currentActivePath() {
      return currentActivePath;
    },
    get currentQuery() {
      return currentQuery;
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
    setActivePath,
    setQuery,
    setHighlightedValue(val: string | null) {
      highlightedValue = val;
    },
    handleOpenChange,
    selectFlatItem,
    popSubmenu,
    focusInput,
    handleInputKeyDown,
  });
</script>

{#snippet paletteSurface()}
  <div
    bind:this={rootEl}
    data-command-palette="true"
    data-modal={inline ? 'false' : undefined}
    data-command-palette-inline={inline ? 'true' : undefined}
    data-testid={inline ? 'command-palette' : 'command-palette-surface'}
    class={cn(
      inline ? commandPaletteStyles.root({ size }) : 'flex w-full flex-col outline-none',
      inline ? cn(className, reactClassName) : undefined,
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
        <CommandPaletteSearch />
        <CommandPaletteResults />
        <CommandPaletteFooter />
      {/if}
    </Listbox>
  </div>
{/snippet}

{#if inline}
  {@render paletteSurface()}
{:else}
  <span
    bind:this={anchorEl}
    data-command-palette-anchor="true"
    class={showTrigger ? 'inline-flex' : 'contents'}
  >
    <Dialog
      open={isOpen}
      lazyMount
      unmountOnExit
      trapFocus={false}
      closeOnEscape={currentActivePath.length === 0}
      initialFocusEl={() => getInputElement()}
      onOpenChange={(details) => handleOpenChange(details.open)}
    >
      {#if showTrigger}
        {#if trigger}
          <DialogTrigger asChild={trigger} />
        {:else}
          <Button variant="outline" onclick={() => handleOpenChange(true)}>
            Open Command Palette <Kbd size="sm" hotkey="Mod+k" />
          </Button>
        {/if}
      {/if}
      <DialogBackdrop />
      <DialogContent
        positionerClass={commandPaletteStyles.positioner}
        data-command-palette="true"
        data-modal="true"
        data-testid="command-palette"
        class={cn(
          commandPaletteStyles.dialogContent,
          commandPaletteStyles.root({ size }),
          className,
          reactClassName,
        )}
      >
        <DialogTitle class="sr-only">Command Palette</DialogTitle>
        {@render paletteSurface()}
      </DialogContent>
    </Dialog>
  </span>
{/if}
