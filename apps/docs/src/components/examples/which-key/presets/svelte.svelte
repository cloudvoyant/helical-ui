<!-- apps/docs/src/components/examples/which-key/presets/svelte.svelte -->
<script lang="ts">
  // 1. Imports
  import {
    HStack,
    Kbd,
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

  // --- State ---
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
      <div class="flex flex-col gap-4 rounded-lg border border-border bg-card p-4">
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
          <HStack class="items-center gap-2">
            <WhichKeyMode showPreset />
            <span class="text-xs text-muted-foreground">
              {lastCommand}
            </span>
          </HStack>
        </HStack>

        <p class="text-xs text-muted-foreground">
          {#if wk.preset === 'helix'}
            <strong>Helix:</strong> <Kbd size="sm" hotkey="g" /> opens Goto (<Kbd size="sm" hotkey="g g" /> top,
            <Kbd size="sm" hotkey="g e" /> bottom, <Kbd size="sm" hotkey="g w" /> jump), <Kbd size="sm" hotkey="z" />
            opens View, and <Kbd size="sm" hotkey="Shift+Z" /> locks View mode.
          {:else if wk.preset === 'vim'}
            <strong>Vim:</strong> <Kbd size="sm" hotkey="Shift+G" /> jumps to bottom,
            <Kbd size="sm" hotkey="0" /> / <Kbd size="sm" hotkey="$" /> jump to start/end, and
            <Kbd size="sm" hotkey="s" /> triggers jump labels.
          {:else}
            <strong>Kakoune:</strong> <Kbd size="sm" hotkey="v" /> opens View,
            <Kbd size="sm" hotkey="Shift+V" /> locks View mode until <Kbd size="sm" hotkey="Escape" />, and
            <Kbd size="sm" hotkey="g" /> opens Goto (<Kbd size="sm" hotkey="g k" />/<Kbd size="sm" hotkey="g j" />).
          {/if}
        </p>

        <Pane paneId="wk-presets-pane" paneTitle="Preset Sandbox" class="flex flex-col gap-2">
          <HStack class="flex-wrap gap-2">
            {#each PRESET_ITEMS as label (label)}
              <button
                type="button"
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
          Focused target: <strong>{focusedItem}</strong>
        </span>
      </div>
      <WhichKey />
    </VStack>
  {/snippet}
</WhichKeyProvider>
