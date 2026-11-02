<!-- apps/docs/src/components/examples/which-key/presets/svelte.svelte -->
<script lang="ts">
  import {
    Badge,
    Button,
    HStack,
    Kbd,
    Pane,
    VStack,
    WhichKey,
    WhichKeyProvider,
    useWhichKey,
    type KeybindingPreset,
  } from '@cloudvoyant/helical-svelte';

  const PRESET_ITEMS = ['Alpha Item', 'Bravo Item', 'Charlie Item', 'Delta Item'];
  const PRESETS: KeybindingPreset[] = ['helix', 'vim', 'kakoune'];

  let lastCommand = $state('Ready');
  let focusedItem = $state(PRESET_ITEMS[0]!);
</script>

<WhichKeyProvider
  preset="helix"
  onCommand={(id) => {
    lastCommand = id;
  }}
>
  {#snippet children()}
    {@const wk = useWhichKey()}
    <VStack class="w-full gap-3">
      <div
        data-testid="wk-presets-surface"
        class="flex flex-col gap-4 rounded-lg border border-border bg-card p-4"
      >
        <HStack class="flex-wrap items-center justify-between gap-2">
          <HStack class="items-center gap-1.5" role="group" aria-label="Preset selector">
            {#each PRESETS as p (p)}
              <Button
                size="sm"
                variant={wk.preset === p ? 'solid' : 'outline'}
                data-testid={`wk-preset-btn-${p}`}
                onclick={() => wk.setPreset(p)}
              >
                {p.toUpperCase()}
              </Button>
            {/each}
          </HStack>
          <HStack class="items-center gap-2">
            <Badge variant="subtle" color="primary" data-testid="wk-presets-active">
              {wk.preset} · {wk.sticky ? `${wk.mode}·lock` : wk.mode}
            </Badge>
            <span class="text-xs text-muted-foreground" data-testid="wk-presets-last-cmd">
              {lastCommand}
            </span>
          </HStack>
        </HStack>

        <p class="text-xs text-muted-foreground">
          {#if wk.preset === 'helix'}
            <strong>Helix:</strong> <Kbd size="sm">g</Kbd> opens Goto (<Kbd size="sm">gg</Kbd> top,
            <Kbd size="sm">ge</Kbd> bottom, <Kbd size="sm">gw</Kbd> jump), <Kbd size="sm">z</Kbd>
            opens View, and <Kbd size="sm">Shift+Z</Kbd> locks View mode.
          {:else if wk.preset === 'vim'}
            <strong>Vim:</strong> <Kbd size="sm">Shift+G</Kbd> jumps to bottom,
            <Kbd size="sm">0</Kbd> / <Kbd size="sm">$</Kbd> jump to start/end, and
            <Kbd size="sm">s</Kbd> triggers jump labels.
          {:else}
            <strong>Kakoune:</strong> <Kbd size="sm">v</Kbd> opens View,
            <Kbd size="sm">Shift+V</Kbd> locks View mode until <Kbd size="sm">Esc</Kbd>, and
            <Kbd size="sm">g</Kbd> opens Goto (<Kbd size="sm">gk</Kbd>/<Kbd size="sm">gj</Kbd>).
          {/if}
        </p>

        <Pane paneId="wk-presets-pane" paneTitle="Preset Sandbox" class="flex flex-col gap-2">
          <HStack class="flex-wrap gap-2">
            {#each PRESET_ITEMS as label, idx (label)}
              <button
                type="button"
                data-testid={`wk-preset-item-${idx}`}
                onfocus={() => {
                  focusedItem = label;
                }}
                class="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
              >
                {label}
              </button>
            {/each}
          </HStack>
        </Pane>
        <span class="text-xs text-muted-foreground">
          Focused target: <strong data-testid="wk-presets-focused-item">{focusedItem}</strong>
        </span>
      </div>
      <WhichKey />
    </VStack>
  {/snippet}
</WhichKeyProvider>
