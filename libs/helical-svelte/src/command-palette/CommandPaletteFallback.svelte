<script lang="ts">
  // 1. Imports
  import type { Snippet } from 'svelte';
  import { cn } from '@cloudvoyant/helical-ui';
  import { ListboxEmpty } from '../listbox';
  import { getCommandPaletteContext } from './context.svelte';

  // 2. Module constants & types
  interface Props {
    emptyText?: string;
    noCommandsText?: string;
    class?: string;
    className?: string;
    children?: Snippet;
  }

  // --- State ---
  let {
    emptyText: emptyTextProp,
    noCommandsText: noCommandsTextProp,
    class: className = '',
    className: reactClassName = '',
    children,
  }: Props = $props();

  const ctx = getCommandPaletteContext();

  const isEmpty = $derived(
    !ctx.resolution.hasCommands || ctx.resolution.groups.length === 0,
  );
  const emptyKind = $derived(
    !ctx.resolution.hasCommands ? 'no-commands' : 'no-matches',
  );
  const defaultMessage = $derived(
    !ctx.resolution.hasCommands
      ? (noCommandsTextProp ?? ctx.noCommandsText)
      : (emptyTextProp ?? ctx.emptyText),
  );
</script>

{#if isEmpty}
  <ListboxEmpty
    data-testid="command-palette-empty"
    data-empty-kind={emptyKind}
    class={cn(className, reactClassName)}
  >
    {#if children}
      {@render children()}
    {:else}
      {defaultMessage}
    {/if}
  </ListboxEmpty>
{/if}
