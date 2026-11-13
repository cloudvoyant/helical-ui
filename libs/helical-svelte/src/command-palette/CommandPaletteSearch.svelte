<script lang="ts">
  // 1. Imports
  import { Search } from 'lucide-svelte';
  import { cn, commandPaletteStyles } from '@cloudvoyant/helical-ui';
  import Kbd from '../Kbd.svelte';
  import { ListboxInput } from '../listbox';
  import Row from '../Row.svelte';
  import { getCommandPaletteContext } from './context.svelte';

  // 2. Module constants & types
  interface Props {
    placeholder?: string;
    class?: string;
    className?: string;
  }

  // --- State ---
  let {
    placeholder: placeholderProp,
    class: className = '',
    className: reactClassName = '',
  }: Props = $props();

  const ctx = getCommandPaletteContext();

  const activePlaceholder = $derived(
    ctx.resolution.breadcrumbs.length > 0
      ? `${ctx.resolution.breadcrumbs[ctx.resolution.breadcrumbs.length - 1]!.label}...`
      : (placeholderProp ?? ctx.placeholder),
  );
</script>

<div class={cn(commandPaletteStyles.header, className, reactClassName)}>
  <Search class="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
  {#if ctx.resolution.breadcrumbs.length > 0}
    <Row class="shrink-0 items-center gap-1" data-testid="command-palette-breadcrumbs">
      <button
        type="button"
        tabindex={-1}
        data-testid="command-palette-breadcrumb-root"
        onclick={() => {
          ctx.setActivePath([]);
          ctx.setQuery('');
          ctx.focusInput();
        }}
        class={commandPaletteStyles.breadcrumb}
      >
        Commands
      </button>
      {#each ctx.resolution.breadcrumbs as crumb, idx (crumb.value)}
        <button
          type="button"
          tabindex={-1}
          data-testid="command-palette-breadcrumb"
          data-breadcrumb-value={crumb.value}
          onclick={() => {
            ctx.setActivePath(ctx.currentActivePath.slice(0, idx + 1));
            ctx.setQuery('');
            ctx.focusInput();
          }}
          class={commandPaletteStyles.breadcrumb}
        >
          <span>›</span>
          <span>{crumb.label}</span>
        </button>
      {/each}
    </Row>
  {/if}
  <ListboxInput
    autofocus={!ctx.inline}
    autoHighlight
    data-testid="command-palette-input"
    placeholder={activePlaceholder}
    value={ctx.currentQuery}
    oninput={(e: Event) => {
      ctx.setQuery((e.currentTarget as HTMLInputElement).value);
    }}
    onkeydowncapture={ctx.handleInputKeyDown}
    class={commandPaletteStyles.input}
  />
  {#if !ctx.inline}
    <button
      type="button"
      tabindex={-1}
      aria-label="Close command palette"
      onclick={() => ctx.handleOpenChange(false)}
      class="shrink-0 opacity-80 transition-opacity hover:opacity-100"
    >
      <Kbd size="sm">Esc</Kbd>
    </button>
  {/if}
</div>
