<!-- Source: https://docs.helix-editor.com/commands.html -->
<!-- Closely based on: Ark UI dialog, listbox, and highlight (https://ark-ui.com/docs/components/listbox), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { Highlight } from '@ark-ui/svelte/highlight';
  import { createListCollection } from '@ark-ui/svelte/listbox';
  import { AlertCircle, Check, ChevronRight, CornerDownLeft } from 'lucide-svelte';
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
  } from '../dialog';
  import Kbd from '../Kbd.svelte';
  import {
    Listbox,
    ListboxContent,
    ListboxEmpty,
    ListboxInput,
    ListboxItem,
    ListboxItemText,
  } from '../listbox';
  import Row from '../Row.svelte';
  import Scroll from '../Scroll.svelte';

  type Props = Omit<CoreColonCommandProps, 'className'> & {
    class?: string;
    className?: string;
  };

  let {
    items,
    collection: externalCollection,
    open: controlledOpen = $bindable(undefined),
    defaultOpen = false,
    onOpenChange,
    inputValue: controlledInputValue = $bindable(undefined),
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
    class: className = '',
    className: reactClassName = '',
  }: Props = $props();

  const HIGHLIGHT_MARK_CLASS =
    'rounded-xs bg-primary/20 px-0.5 font-semibold text-foreground';

  // svelte-ignore state_referenced_locally
  let uncontrolledOpen = $state(Boolean(defaultOpen));
  let uncontrolledInput = $state('');
  let tabBaseInput = $state<string | null>(null);
  let highlightedValue = $state<string | null>(null);
  let submittedError = $state<string | null>(null);
  let rootEl = $state<HTMLDivElement | null>(null);

  const isOpen = $derived(inline ? true : (controlledOpen ?? uncontrolledOpen));
  const currentInput = $derived(controlledInputValue ?? uncontrolledInput);

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
    if (!nextOpen) {
      setInputValue('', null);
      submittedError = null;
    }
    onOpenChange?.(nextOpen);
  }

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

  function getInputElement(): HTMLInputElement | null {
    if (rootEl) {
      return rootEl.querySelector<HTMLInputElement>('[data-testid="colon-command-input"]');
    }
    return null;
  }

  $effect(() => {
    if (!isOpen || inline || typeof document === 'undefined') return;
    const focusInput = () => {
      getInputElement()?.focus();
    };
    focusInput();
    const raf = requestAnimationFrame(focusInput);
    return () => cancelAnimationFrame(raf);
  });

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
    onSelectCommand?.(ctx);
    announceCommandMessage(`Executed ${item.fullCommand}`);

    if (!inline && item.node.closeOnSelect !== false) {
      handleOpenChange(false);
    } else {
      setInputValue('');
    }
  }

  const activeError = $derived(submittedError ?? resolution.error);
</script>

{#snippet colonSurface()}
  <div
    bind:this={rootEl}
    data-colon-command="true"
    data-modal={inline ? 'false' : undefined}
    data-colon-placement={placement}
    data-colon-columns={String(columns)}
    data-colon-command-inline={inline ? 'true' : undefined}
    data-testid={inline ? 'colon-command' : 'colon-command-surface'}
    class={cn(
      colonCommandVariants({ placement, size }),
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
      <Scroll class="max-h-60 min-h-0 flex-1" viewportClass="max-h-60">
        {#snippet children()}
          {@const gridStyle = resolveColonCommandGridStyle(columns, resolution.suggestions.length)}
          <ListboxContent
            tabindex={-1}
            data-testid="colon-command-list"
            data-columns={String(columns)}
            style={gridStyle ? `display: ${gridStyle.display}; grid-auto-flow: ${gridStyle.gridAutoFlow}; grid-template-rows: ${gridStyle.gridTemplateRows}; grid-template-columns: ${gridStyle.gridTemplateColumns};` : undefined}
            class={colonCommandListVariants({ columns })}
          >
            {#if !resolution.hasCommands}
              <ListboxEmpty
                data-testid="colon-command-empty"
                data-empty-kind="no-commands"
                class="col-span-full"
              >
                {noCommandsText}
              </ListboxEmpty>
            {:else if resolution.suggestions.length === 0}
              <ListboxEmpty
                data-testid="colon-command-empty"
                data-empty-kind="no-matches"
                class="col-span-full"
              >
                {activeError ?? emptyText}
              </ListboxEmpty>
            {:else}
              {#each resolution.suggestions as item (item.value)}
                <ListboxItem
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
                  onclick={(e: MouseEvent) => {
                    e.preventDefault();
                    e.stopPropagation();
                    executeOrDrillItem(item);
                  }}
                  class={colonCommandItemBase}
                >
                  <ListboxItemText class="min-w-0 flex-1 truncate">
                    <Row class="min-w-0 items-center gap-2">
                      <span class="truncate font-mono font-medium text-foreground group-data-[highlighted]:text-accent-foreground">
                        {#if item.commandMatchPositions && item.commandMatchPositions.length > 0}{#each splitHighlightSegments(item.command, item.commandMatchPositions) as seg}{#if seg.highlight}<mark class={HIGHLIGHT_MARK_CLASS}>{seg.text}</mark>{:else}<span>{seg.text}</span>{/if}{/each}{:else if resolution.partialToken.trim().length > 0}<Highlight text={item.command} query={resolution.partialToken.trim()} ignoreCase matchAll class={HIGHLIGHT_MARK_CLASS} />{:else}{item.command}{/if}
                      </span>
                      {#if item.active}
                        <Check
                          class="size-3.5 shrink-0 text-primary"
                          aria-label="Active"
                        />
                      {/if}
                    </Row>
                  </ListboxItemText>
                  {#if (showShortcuts && item.shortcut) || item.isBranch}
                    <Row class="shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
                      {#if showShortcuts && item.shortcut}
                        <Kbd size="sm" hotkey={item.shortcut} />
                      {/if}
                      {#if item.isBranch}
                        <ChevronRight
                          class="size-3.5 text-muted-foreground"
                          aria-hidden="true"
                        />
                      {/if}
                    </Row>
                  {/if}
                </ListboxItem>
              {/each}
            {/if}
          </ListboxContent>
        {/snippet}
      </Scroll>

      <div class={colonCommandPromptBarBase}>
        <span
          data-testid="colon-command-prefix"
          class={colonCommandPrefixBase}
        >
          :
        </span>
        <ListboxInput
          autofocus={!inline}
          autoHighlight
          data-testid="colon-command-input"
          {placeholder}
          value={currentInput}
          oninput={(e: Event) => {
            setInputValue((e.currentTarget as HTMLInputElement).value, null);
          }}
          onkeydowncapture={(e: KeyboardEvent) => {
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
          }}
          class={colonCommandInputBase}
        />
        <Row class="shrink-0 items-center gap-1.5 text-[11px] text-muted-foreground">
          <span class="hidden items-center gap-1 sm:inline-flex">
            <Kbd size="sm">Tab</Kbd>
            <span>Next</span>
          </span>
          <span class="hidden items-center gap-1 sm:inline-flex">
            <Kbd size="sm">
              <CornerDownLeft class="size-3" />
            </Kbd>
            <span>Run</span>
          </span>
          {#if !inline}
            <button
              type="button"
              tabindex={-1}
              aria-label="Close colon command menu"
              onclick={() => handleOpenChange(false)}
              class="opacity-80 transition-opacity hover:opacity-100"
            >
              <Kbd size="sm">Esc</Kbd>
            </button>
          {/if}
        </Row>
      </div>

      {#if activeError && resolution.hasCommands}
        <div
          role="alert"
          data-testid="colon-command-error"
          class={colonCommandErrorBase}
        >
          <Row class="items-center gap-1.5">
            <AlertCircle class="size-3.5 shrink-0" aria-hidden="true" />
            <span>{activeError}</span>
          </Row>
        </div>
      {/if}
    </Listbox>
  </div>
{/snippet}

{#if inline}
  {@render colonSurface()}
{:else if isOpen}
  <Dialog
    open={isOpen}
    lazyMount
    unmountOnExit
    initialFocusEl={() => getInputElement()}
    onOpenChange={(details) => handleOpenChange(details.open)}
  >
    <DialogBackdrop class={placement === 'bottom' ? 'bg-black/20' : undefined} />
    <DialogContent
      positionerClass={colonCommandPositionerVariants({ placement })}
      data-colon-command="true"
      data-modal="true"
      data-colon-placement={placement}
      data-colon-columns={String(columns)}
      data-testid="colon-command"
      class={cn(
        colonCommandDialogPositionerVariants({ placement }),
        colonCommandVariants({ placement, size }),
        className,
        reactClassName,
      )}
    >
      <DialogTitle class="sr-only">Colon Command Prompt</DialogTitle>
      {@render colonSurface()}
    </DialogContent>
  </Dialog>
{/if}
