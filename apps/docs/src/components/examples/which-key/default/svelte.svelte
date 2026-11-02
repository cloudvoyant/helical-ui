<!-- apps/docs/src/components/examples/which-key/default/svelte.svelte -->
<script lang="ts">
  import {
    Badge,
    Button,
    Dialog,
    DialogBackdrop,
    DialogContent,
    DialogDescription,
    DialogDismiss,
    DialogHeader,
    DialogTitle,
    HStack,
    Kbd,
    Pane,
    VStack,
    WhichKey,
    WhichKeyProvider,
    useWhichKey,
  } from '@cloudvoyant/helical-svelte';

  let dialogOpen = $state(false);
</script>

<WhichKeyProvider preset="helix">
  {#snippet children()}
    {@const wk = useWhichKey()}
    {@render DefaultSurface({ wk })}
  {/snippet}
</WhichKeyProvider>

{#snippet DefaultSurface({ wk }: { wk: ReturnType<typeof useWhichKey> })}
  <VStack class="w-full gap-3">
    <Pane
      paneId="wk-default-pane"
      paneTitle="Workspace"
      data-testid="wk-default-surface"
      class="flex flex-col gap-4 rounded-lg border border-border bg-card p-4"
    >
      <HStack class="flex-wrap items-center justify-between gap-2">
        <HStack class="items-center gap-2">
          <Badge variant="subtle" color="primary" data-testid="wk-default-mode">
            {wk.mode.toUpperCase()}
          </Badge>
          <span class="text-xs text-muted-foreground">
            Preset: <strong class="text-foreground">{wk.preset}</strong>
          </span>
          {#if wk.activePath.length > 0}
            <span class="font-mono text-xs text-primary" data-testid="wk-default-prefix">
              {wk.activePath.join(' » ')}
            </span>
          {/if}
        </HStack>
      </HStack>

      <p class="text-xs text-muted-foreground">
        Click inside this workspace and press <Kbd size="sm">Space</Kbd> for the leader menu,
        <Kbd size="sm">g</Kbd> for Goto, <Kbd size="sm">z</Kbd> for View, or
        <Kbd size="sm" hotkey={['Space', '?']} /> to search all bindings.
      </p>

      <HStack class="flex-wrap items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          data-testid="wk-default-open-space"
          onclick={() => wk.openPrefix(['Space'])}
        >
          Open <Kbd size="sm">Space</Kbd> Menu
        </Button>
        <Button
          size="sm"
          variant="outline"
          data-testid="wk-default-open-explorer"
          onclick={() => wk.openExplorer()}
        >
          Explore <Kbd size="sm" hotkey={['Space', '?']} />
        </Button>

        <Button
          size="sm"
          variant="outline"
          data-testid="wk-default-open-dialog"
          onclick={() => {
            dialogOpen = true;
          }}
        >
          Open Modal Dialog
        </Button>

        <Dialog bind:open={dialogOpen} lazyMount unmountOnExit>
          <DialogBackdrop />
          <DialogContent data-testid="wk-default-dialog">
            <DialogHeader>
              <DialogTitle>Nested Modal Layer</DialogTitle>
              <DialogDismiss />
            </DialogHeader>
            <DialogDescription>
              Press <Kbd size="sm">Space</Kbd> inside this dialog to open WhichKey, then press
              <Kbd size="sm">Esc</Kbd>. WhichKey closes first while keeping this dialog open.
            </DialogDescription>
            <HStack class="mt-3 gap-2">
              <Button size="sm" variant="outline" data-testid="wk-dialog-action-1">
                Dialog Action 1
              </Button>
              <Button size="sm" variant="outline" data-testid="wk-dialog-action-2">
                Dialog Action 2
              </Button>
            </HStack>
          </DialogContent>
        </Dialog>
      </HStack>
    </Pane>
    <WhichKey />
  </VStack>
{/snippet}
