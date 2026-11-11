<!-- libs/helical-svelte/src/command-palette/CommandPalette.svelte -->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import { Highlight } from '@ark-ui/svelte/highlight';
  import { createListCollection } from '@ark-ui/svelte/listbox';
  import { Check, ChevronRight, CornerDownLeft, Search } from 'lucide-svelte';
  import {
    announceCommandMessage,
    captureCommandFocusTarget,
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
    finalizeCommandSelectFocus,
    matchesCommandHotkey,
    resolveCommandLevel,
    restoreCommandFocusTarget,
    shouldHandleCommandHotkey,
    splitHighlightSegments,
    type CommandFlatItem,
    type CommandPaletteProps as CoreCommandPaletteProps,
    type CommandSelectContext,
  } from '@cloudvoyant/helical-ui';
  import Badge from '../Badge.svelte';
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
  import Row from '../Row.svelte';
  import Scroll from '../Scroll.svelte';

  // 2. Module constants & types
  type Props = Omit<CoreCommandPaletteProps, 'className'> & {
    class?: string;
    className?: string;
    children?: Snippet;
  };

  const HIGHLIGHT_MARK_CLASS =
    'rounded-xs bg-primary/20 px-0.5 font-semibold text-foreground';

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
  let previousFocusEl: HTMLElement | null = null;

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
    children !== undefined || (controlledOpen === undefined && !isProviderManaged),
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

  const activePlaceholder = $derived(
    resolution.breadcrumbs.length > 0
      ? `${resolution.breadcrumbs[resolution.breadcrumbs.length - 1]!.label}...`
      : placeholder,
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
    if (!previousFocusEl) {
      recordPreviousFocus();
    }
    const focusInput = () => {
      getInputElement()?.focus();
    };
    focusInput();
    const raf = requestAnimationFrame(focusInput);
    return () => cancelAnimationFrame(raf);
  });

  // --- Methods ---
  function recordPreviousFocus() {
    const target = captureCommandFocusTarget(rootEl);
    if (target) {
      previousFocusEl = target;
    }
  }

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

  function handleOpenChange(
    nextOpen: boolean,
    options?: { restoreFocus?: boolean },
  ) {
    if (nextOpen && !isOpen) {
      recordPreviousFocus();
    }
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
      const restoreTarget = previousFocusEl;
      previousFocusEl = null;
      if (options?.restoreFocus !== false) {
        restoreCommandFocusTarget(restoreTarget);
      }
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
      requestAnimationFrame(() => {
        getInputElement()?.focus();
      });
      return;
    }

    const shouldClose = !inline && item.node.closeOnSelect !== false;
    const restoreTarget = previousFocusEl;
    if (shouldClose) {
      handleOpenChange(false, { restoreFocus: false });
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
    announceCommandMessage(`Executed ${item.label}`);

    if (shouldClose) {
      finalizeCommandSelectFocus(rootEl, restoreTarget);
    }
  }

  function popSubmenu(): boolean {
    if (currentActivePath.length === 0) return false;
    setActivePath(currentActivePath.slice(0, -1));
    setQuery('');
    highlightedValue = null;
    requestAnimationFrame(() => {
      getInputElement()?.focus();
    });
    return true;
  }

  // --- Helpers ---
  function getInputElement(): HTMLInputElement | null {
    if (rootEl) {
      return rootEl.querySelector<HTMLInputElement>('[data-testid="command-palette-input"]');
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
</script>

{#snippet paletteSurface()}
  <div
    bind:this={rootEl}
    data-command-palette="true"
    data-modal={inline ? 'false' : undefined}
    data-command-palette-inline={inline ? 'true' : undefined}
    data-testid={inline ? 'command-palette' : 'command-palette-surface'}
    class={cn(
      inline ? commandPaletteVariants({ size }) : 'flex w-full flex-col outline-none',
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
      <div class={commandPaletteHeaderBase}>
        <Search class="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        {#if resolution.breadcrumbs.length > 0}
          <Row class="shrink-0 items-center gap-1" data-testid="command-palette-breadcrumbs">
            <button
              type="button"
              tabindex={-1}
              data-testid="command-palette-breadcrumb-root"
              onclick={() => {
                setActivePath([]);
                setQuery('');
                getInputElement()?.focus();
              }}
              class={commandPaletteBreadcrumbBase}
            >
              Commands
            </button>
            {#each resolution.breadcrumbs as crumb, idx (crumb.value)}
              <button
                type="button"
                tabindex={-1}
                data-testid="command-palette-breadcrumb"
                data-breadcrumb-value={crumb.value}
                onclick={() => {
                  setActivePath(currentActivePath.slice(0, idx + 1));
                  setQuery('');
                  getInputElement()?.focus();
                }}
                class={commandPaletteBreadcrumbBase}
              >
                <span>›</span>
                <span>{crumb.label}</span>
              </button>
            {/each}
          </Row>
        {/if}
        <ListboxInput
          autofocus={!inline}
          autoHighlight
          data-testid="command-palette-input"
          placeholder={activePlaceholder}
          value={currentQuery}
          oninput={(e: Event) => {
            setQuery((e.currentTarget as HTMLInputElement).value);
          }}
          onkeydowncapture={(e: KeyboardEvent) => {
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
          }}
          class={commandPaletteInputBase}
        />
        {#if !inline}
          <button
            type="button"
            tabindex={-1}
            aria-label="Close command palette"
            onclick={() => handleOpenChange(false)}
            class="shrink-0 opacity-80 transition-opacity hover:opacity-100"
          >
            <Kbd size="sm">Esc</Kbd>
          </button>
        {/if}
      </div>

      <Scroll class="max-h-80 min-h-0 flex-1" viewportClass="max-h-80">
        {#snippet children()}
          <ListboxContent
            tabindex={-1}
            data-testid="command-palette-list"
            class={commandPaletteListBase}
          >
            {#if !resolution.hasCommands}
              <ListboxEmpty
                data-testid="command-palette-empty"
                data-empty-kind="no-commands"
              >
                {noCommandsText}
              </ListboxEmpty>
            {:else if resolution.groups.length === 0}
              <ListboxEmpty
                data-testid="command-palette-empty"
                data-empty-kind="no-matches"
              >
                {emptyText}
              </ListboxEmpty>
            {:else}
              {#each resolution.groups as group (group.label)}
                <ListboxItemGroup>
                  <ListboxItemGroupLabel>{group.label}</ListboxItemGroupLabel>
                  {#each group.items as item (item.value)}
                    <ListboxItem
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
                      onclick={(e: MouseEvent) => {
                        e.preventDefault();
                        e.stopPropagation();
                        selectFlatItem(item);
                      }}
                      class={commandPaletteItemBase}
                    >
                      <ListboxItemText class="min-w-0 flex-1 truncate font-medium text-foreground">
                        <Row class="min-w-0 items-center gap-2">
                          {#if currentQuery.trim().length > 0 && item.breadcrumbLabels.length > 0 && currentActivePath.length === 0}
                            <span
                              data-testid="command-palette-item-path"
                              class="shrink-0 text-xs text-muted-foreground"
                            >
                              {item.breadcrumbLabels.join(' › ')} ›
                            </span>
                          {/if}
                          <span class="truncate">
                            {#if item.matchPositions && item.matchPositions.length > 0}
                              {#each splitHighlightSegments(item.label, item.matchPositions) as seg}
                                {#if seg.highlight}
                                  <mark class={HIGHLIGHT_MARK_CLASS}>{seg.text}</mark>
                                {:else}
                                  <span>{seg.text}</span>
                                {/if}
                              {/each}
                            {:else if currentQuery.trim().length > 0}
                              <Highlight
                                text={item.label}
                                query={currentQuery.trim()}
                                ignoreCase
                                matchAll
                                class={HIGHLIGHT_MARK_CLASS}
                              />
                            {:else}
                              {item.label}
                            {/if}
                          </span>
                          {#if item.badge}
                            <Badge
                              variant="outline"
                              size="sm"
                              data-testid="command-palette-item-badge"
                            >
                              {item.badge}
                            </Badge>
                          {/if}
                          {#if item.active}
                            <Check
                              class="size-3.5 shrink-0 text-primary"
                              aria-label="Active"
                            />
                          {/if}
                        </Row>
                      </ListboxItemText>
                      <Row class="shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
                        {#if item.shortcut}
                          <Kbd size="sm" hotkey={item.shortcut} />
                        {/if}
                        {#if item.isBranch}
                          <ChevronRight
                            class="size-4 text-muted-foreground"
                            aria-hidden="true"
                          />
                        {/if}
                      </Row>
                    </ListboxItem>
                  {/each}
                </ListboxItemGroup>
              {/each}
            {/if}
          </ListboxContent>
        {/snippet}
      </Scroll>

      <div class={commandPaletteFooterBase}>
        <Row class="items-center gap-3">
          <span class="inline-flex items-center gap-1">
            <Kbd size="sm">↑</Kbd>
            <Kbd size="sm">↓</Kbd>
            <span>Navigate</span>
          </span>
          <span class="inline-flex items-center gap-1">
            <Kbd size="sm">
              <CornerDownLeft class="size-3" />
            </Kbd>
            <span>Select</span>
          </span>
          {#if resolution.breadcrumbs.length > 0}
            <span class="inline-flex items-center gap-1">
              <Kbd size="sm">⌫</Kbd>
              <span>Back</span>
            </span>
          {/if}
        </Row>
        <span class="text-[11px] text-muted-foreground">
          {resolution.breadcrumbs.length > 0
            ? resolution.breadcrumbs.map((b) => b.label).join(' › ')
            : '⌘K'}
        </span>
      </div>
    </Listbox>
  </div>
{/snippet}

{#if inline}
  {@render paletteSurface()}
{:else}
  <span bind:this={anchorEl} data-command-palette-anchor="true" class="inline-flex">
    <Dialog
      open={isOpen}
      lazyMount
      unmountOnExit
      trapFocus={false}
      restoreFocus={false}
      closeOnEscape={currentActivePath.length === 0}
      initialFocusEl={() => getInputElement()}
      onOpenChange={(details) => handleOpenChange(details.open)}
    >
      {#if showTrigger}
        {#if children}
          <DialogTrigger asChild={children} />
        {:else}
          <Button variant="outline" onclick={() => handleOpenChange(true)}>
            Open Command Palette <Kbd size="sm" hotkey="Mod+k" />
          </Button>
        {/if}
      {/if}
      <DialogBackdrop />
      <DialogContent
        positionerClass={commandPalettePositionerBase}
        data-command-palette="true"
        data-modal="true"
        data-testid="command-palette"
        class={cn(
          commandPaletteDialogContentBase,
          commandPaletteVariants({ size }),
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
