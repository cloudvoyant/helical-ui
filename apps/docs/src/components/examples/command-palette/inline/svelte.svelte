<!-- apps/docs/src/components/examples/command-palette/inline/svelte.svelte -->
<script lang="ts">
  import {
    Badge,
    Button,
    CommandPalette,
    HStack,
    VStack,
  } from '@cloudvoyant/helical-svelte';
  import { buildDocsCommandTree } from '../../../../lib/commands';

  let emptyTree = $state(false);
  let selected = $state('None');

  const docsItems = buildDocsCommandTree();
  const items = $derived(emptyTree ? [] : docsItems);
</script>

<VStack class="w-full gap-3">
  <HStack class="flex-wrap items-center justify-between gap-2">
    <HStack class="items-center gap-2">
      <span class="text-xs font-medium text-muted-foreground">Inline selection:</span>
      <Badge variant="subtle" color="primary" data-testid="cp-inline-selected">
        {selected}
      </Badge>
    </HStack>
    <Button
      size="sm"
      variant="outline"
      data-testid="cp-inline-toggle-empty"
      onclick={() => {
        emptyTree = !emptyTree;
      }}
    >
      {emptyTree ? 'Restore Commands' : 'Simulate Empty Commands'}
    </Button>
  </HStack>
  <CommandPalette
    inline
    {items}
    onSelectCommand={(ctx) => {
      selected = `${ctx.node.label} (${ctx.commandString})`;
    }}
  />
</VStack>
