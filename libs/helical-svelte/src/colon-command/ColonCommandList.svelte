<!-- libs/helical-svelte/src/colon-command/ColonCommandList.svelte -->
<script lang="ts">
  // 1. Imports
  import {
    colonCommandListVariants,
    resolveColonCommandGridStyle,
  } from '@cloudvoyant/helical-ui';
  import { ListboxContent, ListboxEmpty } from '../listbox';
  import Scroll from '../Scroll.svelte';
  import ColonCommandItem from './ColonCommandItem.svelte';
  import { getColonCommandContext } from './context.svelte';

  // --- State ---
  const ctx = getColonCommandContext();

  const gridStyle = $derived(
    resolveColonCommandGridStyle(ctx.columns, ctx.resolution.suggestions.length),
  );
  const gridStyleAttr = $derived(
    gridStyle
      ? `display: ${gridStyle.display}; grid-auto-flow: ${gridStyle.gridAutoFlow}; grid-template-rows: ${gridStyle.gridTemplateRows}; grid-template-columns: ${gridStyle.gridTemplateColumns};`
      : undefined,
  );
</script>

<Scroll class="max-h-72 min-h-0 flex-1" viewportClass="max-h-72">
  {#snippet children()}
    <ListboxContent
      tabindex={-1}
      data-testid="colon-command-list"
      data-columns={String(ctx.columns)}
      data-size={ctx.size}
      style={gridStyleAttr}
      class={colonCommandListVariants({ columns: ctx.columns, size: ctx.size })}
    >
      {#if !ctx.resolution.hasCommands}
        <ListboxEmpty
          data-testid="colon-command-empty"
          data-empty-kind="no-commands"
          class="col-span-full"
        >
          {ctx.noCommandsText}
        </ListboxEmpty>
      {:else if ctx.resolution.suggestions.length === 0}
        <ListboxEmpty
          data-testid="colon-command-empty"
          data-empty-kind="no-matches"
          class="col-span-full"
        >
          {ctx.activeError ?? ctx.emptyText}
        </ListboxEmpty>
      {:else}
        {#each ctx.resolution.suggestions as item (item.value)}
          <ColonCommandItem {item} />
        {/each}
      {/if}
    </ListboxContent>
  {/snippet}
</Scroll>
