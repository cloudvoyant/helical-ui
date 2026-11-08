<!-- apps/docs/src/components/examples/which-key/presets/svelte.svelte -->
<script lang="ts">
  // 1. Imports
  import {
    HStack,
    Pane,
    ToggleGroup,
    ToggleGroupItem,
    VStack,
    WhichKey,
    WhichKeyMode,
    WhichKeyProvider,
    useWhichKey,
    type KeybindingPreset,
  } from '@cloudvoyant/helical-svelte';

  // 2. Module constants & types
  const PRESET_ITEMS = ['Alpha Item', 'Bravo Item', 'Charlie Item', 'Delta Item'];
  const PRESETS: KeybindingPreset[] = ['helix', 'vim', 'kakoune'];
</script>

<WhichKeyProvider preset="helix">
  {#snippet children()}
    {@const wk = useWhichKey()}
    <VStack class="gap-3 rounded-lg border border-border bg-card p-4">
      <HStack class="flex-wrap items-center justify-between gap-2">
        <ToggleGroup
          attached
          value={[wk.preset]}
          onValueChange={(d) => {
            const next = d.value[0] as KeybindingPreset | undefined;
            if (next) wk.setPreset(next);
          }}
          aria-label="Preset selector"
        >
          {#each PRESETS as p (p)}
            <ToggleGroupItem value={p} size="sm" variant="outline">
              {p.toUpperCase()}
            </ToggleGroupItem>
          {/each}
        </ToggleGroup>
        <WhichKeyMode showPreset />
      </HStack>

      <Pane
        paneId="wk-presets-pane"
        paneTitle="Preset Sandbox"
        class="flex flex-wrap gap-2"
      >
        {#each PRESET_ITEMS as label (label)}
          <button
            type="button"
            class="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
          >
            {label}
          </button>
        {/each}
      </Pane>
    </VStack>
    <WhichKey />
  {/snippet}
</WhichKeyProvider>
