<!-- libs/helical-svelte/src/command-menu/CommandMenuPromptBar.svelte -->
<script lang="ts">
  // 1. Imports
  import { CornerDownLeft } from 'lucide-svelte';
  import { commandMenuStyles } from '@cloudvoyant/helical-ui';
  import Kbd from '../Kbd.svelte';
  import { ListboxInput } from '../listbox';
  import Row from '../Row.svelte';
  import { getCommandMenuContext } from './context.svelte';

  // --- State ---
  const ctx = getCommandMenuContext();
</script>

<div class={commandMenuStyles.promptBar({ size: ctx.size })}>
  <span
    data-testid="command-menu-prefix"
    class={commandMenuStyles.prefix}
  >
    :
  </span>
  <ListboxInput
    autofocus={!ctx.inline}
    autoHighlight
    data-testid="command-menu-input"
    placeholder={ctx.placeholder}
    value={ctx.currentInput.replace(/^:/, '')}
    oninput={(e: Event) => {
      ctx.setInputValue((e.currentTarget as HTMLInputElement).value, null);
    }}
    onkeydowncapture={ctx.handleInputKeyDown}
    class={commandMenuStyles.input({ size: ctx.size })}
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
    {#if !ctx.inline}
      <button
        type="button"
        tabindex={-1}
        aria-label="Close command menu"
        onclick={() => ctx.handleOpenChange(false)}
        class="opacity-80 transition-opacity hover:opacity-100"
      >
        <Kbd size="sm">Esc</Kbd>
      </button>
    {/if}
  </Row>
</div>
