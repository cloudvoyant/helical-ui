<!-- apps/docs/src/components/examples/command-palette/default/svelte.svelte -->
<script lang="ts">
  // 1. Imports
  import { onMount } from 'svelte';
  import type { CommandSelectContext } from '@cloudvoyant/helical-ui';
  import { Button, CommandPalette, Kbd, useToast } from '@cloudvoyant/helical-svelte';
  import { buildDocsCommandTree, subscribeDocsCommandState } from '../../../../lib/commands';

  // --- State ---
  const toast = useToast();
  let open = $state(false);
  let revision = $state(0);
  const items = $derived.by(() => {
    void revision;
    return buildDocsCommandTree();
  });

  // --- Effects ---
  onMount(() =>
    subscribeDocsCommandState(() => {
      revision += 1;
    }),
  );

  // --- Methods ---
  function handleSelectCommand(ctx: CommandSelectContext) {
    toast.create({
      title: ctx.node.label,
      description:
        ctx.node.badge === 'Future'
          ? 'Full-text documentation search is coming soon.'
          : `Executed ${ctx.valuePath.join(' › ')}`,
      type: ctx.node.badge === 'Future' ? 'info' : 'success',
    });
  }
</script>

<!-- Render -->
<div class="flex flex-col items-center gap-4">
  <Button
    variant="outline"
    data-testid="cp-default-open"
    onclick={() => {
      open = true;
    }}
  >
    Open Command Palette <Kbd size="sm">⌘K</Kbd>
  </Button>
  <CommandPalette {items} bind:open onSelectCommand={handleSelectCommand} />
</div>
