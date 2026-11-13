<script lang="ts">
  // 1. Imports
  import type { Snippet } from 'svelte';
  import { cn, commandPaletteStyles } from '@cloudvoyant/helical-ui';
  import { ListboxContent, ListboxItemGroup, ListboxItemGroupLabel } from '../listbox';
  import Scroll from '../Scroll.svelte';
  import CommandPaletteFallback from './CommandPaletteFallback.svelte';
  import CommandPaletteItem from './CommandPaletteItem.svelte';
  import { getCommandPaletteContext } from './context.svelte';

  // 2. Module constants & types
  interface Props {
    fallback?: Snippet;
    class?: string;
    className?: string;
    children?: Snippet;
  }

  // --- State ---
  let {
    fallback,
    class: className = '',
    className: reactClassName = '',
    children: fallbackChildren,
  }: Props = $props();

  const ctx = getCommandPaletteContext();
  const isEmpty = $derived(
    !ctx.resolution.hasCommands || ctx.resolution.groups.length === 0,
  );
</script>

<Scroll class="max-h-80 min-h-0 flex-1" viewportClass="max-h-80">
  {#snippet children()}
    <ListboxContent
      tabindex={-1}
      data-testid="command-palette-list"
      class={cn(commandPaletteStyles.list, className, reactClassName)}
    >
      {#if isEmpty}
        {#if fallback}
          {@render fallback()}
        {:else if fallbackChildren}
          {@render fallbackChildren()}
        {:else}
          <CommandPaletteFallback />
        {/if}
      {:else}
        {#each ctx.resolution.groups as group (group.label)}
          <ListboxItemGroup>
            <ListboxItemGroupLabel>{group.label}</ListboxItemGroupLabel>
            {#each group.items as item (item.value)}
              <CommandPaletteItem {item} />
            {/each}
          </ListboxItemGroup>
        {/each}
      {/if}
    </ListboxContent>
  {/snippet}
</Scroll>
