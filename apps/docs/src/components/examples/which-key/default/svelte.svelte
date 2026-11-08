<!-- apps/docs/src/components/examples/which-key/default/svelte.svelte -->
<script lang="ts">
  // 1. Imports
  import {
    Button,
    HStack,
    Kbd,
    Pane,
    WhichKey,
    WhichKeyMode,
    WhichKeyProvider,
    useWhichKey,
  } from '@cloudvoyant/helical-svelte';

  // 2. Module constants & types
  const ITEMS = ['Workspace File A', 'Workspace File B'];
</script>

<WhichKeyProvider preset="helix">
  {#snippet children()}
    {@const wk = useWhichKey()}
    <Pane
      paneId="wk-default-pane"
      paneTitle="Workspace"
      class="flex flex-col gap-3 rounded-lg border border-border bg-card p-4"
    >
      <HStack class="flex-wrap items-center justify-between gap-2">
        <WhichKeyMode showPreset />
        <Button size="sm" variant="outline" onclick={() => wk.openPrefix(['Space'])}>
          Open <Kbd size="sm" hotkey="Space" /> Menu
        </Button>
      </HStack>

      <HStack class="flex-wrap gap-2">
        {#each ITEMS as label (label)}
          <button
            type="button"
            class="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
          >
            {label}
          </button>
        {/each}
      </HStack>
    </Pane>
    <WhichKey />
  {/snippet}
</WhichKeyProvider>
