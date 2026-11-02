<!-- apps/docs/src/components/examples/which-key/panes/svelte.svelte -->
<script lang="ts">
  import {
    Badge,
    HStack,
    Kbd,
    Pane,
    VStack,
    WhichKey,
    WhichKeyProvider,
    useWhichKey,
  } from '@cloudvoyant/helical-svelte';
</script>

<WhichKeyProvider preset="helix">
  {#snippet children()}
    {@const wk = useWhichKey()}
    <VStack class="w-full gap-3" data-testid="wk-panes-surface">
      <HStack class="flex-wrap items-center justify-between gap-2">
        <span class="text-xs text-muted-foreground">
          Use <Kbd size="sm" hotkey={['Space', 'w', 'l']} /> /
          <Kbd size="sm" hotkey={['Space', 'w', 'h']} /> (or <Kbd size="sm" hotkey="Control+w" />),
          <Kbd size="sm" hotkey={['Space', '1']} />–<Kbd size="sm">3</Kbd>, and
          <Kbd size="sm" hotkey="Control+o" /> / <Kbd size="sm" hotkey="Control+i" /> Jumplist.
        </span>
        <Badge variant="subtle" color="primary" data-testid="wk-panes-active-id">
          Active: {wk.activePaneId ?? 'pane-nav'}
        </Badge>
      </HStack>

      <div class="grid grid-cols-3 gap-3">
        <Pane
          paneId="pane-nav"
          paneTitle="Explorer"
          paneOrder={1}
          data-testid="wk-pane-1"
          class="flex flex-col gap-2 rounded-lg border border-border bg-card p-3"
        >
          <span class="text-xs font-semibold text-muted-foreground">1 · Explorer</span>
          <button
            type="button"
            data-testid="wk-pane-1-btn-1"
            class="rounded border border-border bg-background px-2.5 py-1.5 text-left text-xs focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
          >
            src/index.ts
          </button>
          <button
            type="button"
            data-testid="wk-pane-1-btn-2"
            class="rounded border border-border bg-background px-2.5 py-1.5 text-left text-xs focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
          >
            src/controller.ts
          </button>
        </Pane>

        <Pane
          paneId="pane-editor"
          paneTitle="Editor"
          paneOrder={2}
          data-testid="wk-pane-2"
          class="flex flex-col gap-2 rounded-lg border border-border bg-card p-3"
        >
          <span class="text-xs font-semibold text-muted-foreground">2 · Editor</span>
          <button
            type="button"
            data-testid="wk-pane-2-btn-1"
            class="rounded border border-border bg-background px-2.5 py-1.5 text-left text-xs focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
          >
            Buffer Tab A
          </button>
          <button
            type="button"
            data-testid="wk-pane-2-btn-2"
            class="rounded border border-border bg-background px-2.5 py-1.5 text-left text-xs focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
          >
            Buffer Tab B
          </button>
        </Pane>

        <Pane
          paneId="pane-inspector"
          paneTitle="Inspector"
          paneOrder={3}
          data-testid="wk-pane-3"
          class="flex flex-col gap-2 rounded-lg border border-border bg-card p-3"
        >
          <span class="text-xs font-semibold text-muted-foreground">3 · Inspector</span>
          <button
            type="button"
            data-testid="wk-pane-3-btn-1"
            class="rounded border border-border bg-background px-2.5 py-1.5 text-left text-xs focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
          >
            AST Symbols
          </button>
          <button
            type="button"
            data-testid="wk-pane-3-btn-2"
            class="rounded border border-border bg-background px-2.5 py-1.5 text-left text-xs focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
          >
            Diagnostics
          </button>
        </Pane>
      </div>
    </VStack>
    <WhichKey />
  {/snippet}
</WhichKeyProvider>
