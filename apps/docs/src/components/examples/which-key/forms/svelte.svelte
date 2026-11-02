<!-- apps/docs/src/components/examples/which-key/forms/svelte.svelte -->
<script lang="ts">
  import {
    HStack,
    Kbd,
    Pane,
    VStack,
    WhichKey,
    WhichKeyMode,
    WhichKeyProvider,
  } from '@cloudvoyant/helical-svelte';

  let name = $state('');
  let notes = $state('');
</script>

<WhichKeyProvider preset="helix">
  {#snippet children()}
    <Pane
      paneId="wk-forms-pane"
      paneTitle="Form Controls"
      data-testid="wk-forms-surface"
      class="flex flex-col gap-3 rounded-lg border border-border bg-card p-4"
    >
      <HStack class="flex-wrap items-center justify-between gap-2">
        <span class="text-xs text-muted-foreground">
          Press <Kbd size="sm">j</Kbd> / <Kbd size="sm">k</Kbd> in <strong>normal</strong> mode to
          step across inputs without typing. Press <Kbd size="sm">i</Kbd> or
          <Kbd size="sm">Enter</Kbd> to enter <strong>insert</strong> mode, and
          <Kbd size="sm">Esc</Kbd> to return to <strong>normal</strong> mode.
        </span>
        <WhichKeyMode data-testid="wk-forms-mode" />
      </HStack>

      <VStack class="items-stretch gap-2.5">
        <button
          type="button"
          data-testid="wk-form-btn-start"
          class="rounded-md border border-border bg-background px-3 py-1.5 text-left text-xs font-medium focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
        >
          1 · Focus Anchor Button
        </button>

        <input
          type="text"
          value={name}
          oninput={(e) => {
            name = (e.currentTarget as HTMLInputElement).value;
          }}
          placeholder="2 · Project name (focus via j, then press i to type)"
          data-testid="wk-form-input-name"
          class="rounded-md border border-border bg-background px-3 py-1.5 text-xs focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
        />

        <input
          type="text"
          value={notes}
          oninput={(e) => {
            notes = (e.currentTarget as HTMLInputElement).value;
          }}
          placeholder="3 · Commit notes"
          data-testid="wk-form-input-notes"
          class="rounded-md border border-border bg-background px-3 py-1.5 text-xs focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
        />

        <button
          type="button"
          data-testid="wk-form-btn-submit"
          class="rounded-md border border-border bg-background px-3 py-1.5 text-left text-xs font-medium focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
        >
          4 · Submit Form
        </button>
      </VStack>
    </Pane>
    <WhichKey />
  {/snippet}
</WhichKeyProvider>
