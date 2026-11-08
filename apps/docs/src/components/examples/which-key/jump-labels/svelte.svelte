<!-- apps/docs/src/components/examples/which-key/jump-labels/svelte.svelte -->
<script lang="ts">
  // 1. Imports
  import {
    Button,
    HStack,
    Kbd,
    Pane,
    ToggleGroup,
    ToggleGroupItem,
    WhichKey,
    WhichKeyProvider,
    useWhichKey,
    type JumpAction,
  } from '@cloudvoyant/helical-svelte';

  // 2. Module constants & types
  const JUMP_ITEMS = ['Deploy Service', 'Run Migrations', 'Inspect Logs', 'Rotate Keys'];

  // --- State ---
  let jumpAction = $state<JumpAction>('focus');
  let activeItem = $state<string | null>(null);
</script>

<WhichKeyProvider preset="helix" {jumpAction}>
  {#snippet children()}
    {@const wk = useWhichKey()}
    <Pane
      paneId="wk-jump-pane"
      paneTitle="Jump Targets"
      class="flex flex-col gap-3 rounded-lg border border-border bg-card p-4"
    >
      <HStack class="flex-wrap items-center justify-between gap-2">
        <ToggleGroup
          attached
          value={[jumpAction]}
          onValueChange={(d) => {
            const next = d.value[0] as JumpAction | undefined;
            if (!next) return;
            wk.setJumpAction(next);
            jumpAction = next;
          }}
          aria-label="Jump action mode"
        >
          <ToggleGroupItem value="focus" size="sm" variant="outline">
            jumpAction: focus
          </ToggleGroupItem>
          <ToggleGroupItem value="activate" size="sm" variant="outline">
            jumpAction: activate
          </ToggleGroupItem>
        </ToggleGroup>
        <Button size="sm" variant="outline" onclick={() => wk.startJumpMode()}>
          Trigger Jump (<Kbd size="sm" hotkey="g w" />)
        </Button>
      </HStack>

      <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {#each JUMP_ITEMS as item (item)}
          <button
            type="button"
            aria-pressed={activeItem === item}
            onclick={() => (activeItem = item)}
            class="rounded-md border border-border bg-background px-3 py-2 text-xs font-medium transition-colors hover:bg-accent focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none aria-pressed:border-primary aria-pressed:bg-primary/10"
          >
            {item}
          </button>
        {/each}
      </div>
    </Pane>
    <WhichKey />
  {/snippet}
</WhichKeyProvider>
