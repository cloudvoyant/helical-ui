<!-- apps/docs/src/components/examples/which-key/forms/svelte.svelte -->
<script lang="ts">
  // 1. Imports
  import { HStack, Pane, VStack, WhichKey, WhichKeyMode, WhichKeyProvider } from '@cloudvoyant/helical-svelte';

  // --- State ---
  let name = $state('');
  let notes = $state('');
</script>

<WhichKeyProvider preset="helix">
  <Pane
    paneId="wk-forms-pane"
    paneTitle="Form Controls"
    class="flex flex-col gap-3 rounded-lg border border-border bg-card p-4"
  >
    <HStack class="justify-end">
      <WhichKeyMode />
    </HStack>

    <VStack class="items-stretch gap-2.5">
      <button
        type="button"
        class="rounded-md border border-border bg-background px-3 py-1.5 text-left text-xs font-medium focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
      >
        1 · Focus Anchor Button
      </button>

      <input
        type="text"
        bind:value={name}
        placeholder="2 · Project name"
        class="rounded-md border border-border bg-background px-3 py-1.5 text-xs focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
      />

      <input
        type="text"
        bind:value={notes}
        placeholder="3 · Commit notes"
        class="rounded-md border border-border bg-background px-3 py-1.5 text-xs focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
      />

      <button
        type="button"
        class="rounded-md border border-border bg-background px-3 py-1.5 text-left text-xs font-medium focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
      >
        4 · Submit Form
      </button>
    </VStack>
  </Pane>
  <WhichKey />
</WhichKeyProvider>
