<!-- apps/docs/src/components/examples/which-key/jump-labels/svelte.svelte -->
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
    type JumpAction,
  } from '@cloudvoyant/helical-svelte';

  const JUMP_ITEMS = ['Deploy Service', 'Run Migrations', 'Inspect Logs', 'Rotate Keys'];

  let jumpAction = $state<JumpAction>('focus');
  let focusedItem = $state('None');
  let activatedItem = $state('None');
</script>

<WhichKeyProvider preset="helix" {jumpAction}>
  {#snippet children()}
    {@const wk = useWhichKey()}
    <VStack class="w-full gap-3">
      <Pane
        paneId="wk-jump-pane"
        paneTitle="Jump Targets"
        data-testid="wk-jump-surface"
        class="flex flex-col gap-3 rounded-lg border border-border bg-card p-4"
      >
        <HStack class="flex-wrap items-center justify-between gap-2">
          <HStack class="items-center gap-1.5">
            <Button
              size="sm"
              variant={jumpAction === 'focus' ? 'solid' : 'outline'}
              data-testid="wk-jump-mode-focus"
              onclick={() => {
                jumpAction = 'focus';
              }}
            >
              jumpAction: focus
            </Button>
            <Button
              size="sm"
              variant={jumpAction === 'activate' ? 'solid' : 'outline'}
              data-testid="wk-jump-mode-activate"
              onclick={() => {
                jumpAction = 'activate';
              }}
            >
              jumpAction: activate
            </Button>
            <Button
              size="sm"
              variant="outline"
              data-testid="wk-jump-trigger"
              onclick={() => wk.startJumpMode(jumpAction)}
            >
              Trigger Jump (<Kbd size="sm" hotkey={['g', 'w']} />)
            </Button>
          </HStack>

          <HStack class="items-center gap-2 text-xs">
            <span>
              Focused: <strong data-testid="wk-jump-focused">{focusedItem}</strong>
            </span>
            <Badge variant="subtle" color="primary">
              Activated: <strong data-testid="wk-jump-activated">{activatedItem}</strong>
            </Badge>
          </HStack>
        </HStack>

        <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {#each JUMP_ITEMS as item, idx (item)}
            <button
              type="button"
              data-testid={`wk-jump-target-${idx}`}
              onfocus={() => {
                focusedItem = item;
              }}
              onclick={() => {
                activatedItem = item;
              }}
              class="rounded-md border border-border bg-background px-3 py-2 text-xs font-medium transition-colors hover:bg-accent focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
            >
              {item}
            </button>
          {/each}
        </div>
      </Pane>
      <WhichKey />
    </VStack>
  {/snippet}
</WhichKeyProvider>
