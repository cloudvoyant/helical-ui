<!-- libs/helical-svelte/src/command-menu/CommandMenuError.svelte -->
<script lang="ts">
  // 1. Imports
  import { AlertCircle } from 'lucide-svelte';
  import { commandMenuErrorBase } from '@cloudvoyant/helical-ui/commands';
  import Row from '../Row.svelte';
  import { getCommandMenuContext } from './context.svelte';

  // --- State ---
  const ctx = getCommandMenuContext();
</script>

{#if ctx.activeError && ctx.resolution.hasCommands}
  <div
    role="alert"
    data-testid="command-menu-error"
    class={commandMenuErrorBase}
  >
    <Row class="items-center gap-1.5">
      <AlertCircle class="size-3.5 shrink-0" aria-hidden="true" />
      <span>{ctx.activeError}</span>
    </Row>
  </div>
{/if}
