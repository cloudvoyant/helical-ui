<!-- libs/helical-svelte/src/colon-command/ColonCommandError.svelte -->
<script lang="ts">
  // 1. Imports
  import { AlertCircle } from 'lucide-svelte';
  import { colonCommandErrorBase } from '@cloudvoyant/helical-ui';
  import Row from '../Row.svelte';
  import { getColonCommandContext } from './context.svelte';

  // --- State ---
  const ctx = getColonCommandContext();
</script>

{#if ctx.activeError && ctx.resolution.hasCommands}
  <div
    role="alert"
    data-testid="colon-command-error"
    class={colonCommandErrorBase}
  >
    <Row class="items-center gap-1.5">
      <AlertCircle class="size-3.5 shrink-0" aria-hidden="true" />
      <span>{ctx.activeError}</span>
    </Row>
  </div>
{/if}
