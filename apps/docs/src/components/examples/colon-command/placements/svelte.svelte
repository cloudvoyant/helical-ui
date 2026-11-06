<!-- apps/docs/src/components/examples/colon-command/placements/svelte.svelte -->
<script lang="ts">
  import { type ColonCommandColumns } from '@cloudvoyant/helical-ui';
  import {
    Badge,
    Button,
    ColonCommand,
    HStack,
    VStack,
  } from '@cloudvoyant/helical-svelte';
  import { buildDocsCommandTree } from '../../../../lib/commands';

  let placement = $state<'bottom' | 'center' | 'top'>('bottom');
  let columns = $state<ColonCommandColumns>('auto');
  let emptyTree = $state(false);
  let selected = $state('None');

  const docsItems = buildDocsCommandTree();
  const items = $derived(emptyTree ? [] : docsItems);
</script>

<VStack class="w-full gap-3">
  <HStack class="flex-wrap items-center justify-between gap-2">
    <HStack class="flex-wrap items-center gap-1.5">
      {#each ['bottom', 'center', 'top'] as const as p (p)}
        <Button
          size="sm"
          variant={placement === p ? 'solid' : 'outline'}
          data-testid={`cc-placement-${p}`}
          onclick={() => {
            placement = p;
          }}
        >
          {p}
        </Button>
      {/each}
      {#each ['auto', 1, 2, 3, 4] as const as col (col)}
        <Button
          size="sm"
          variant={columns === col ? 'solid' : 'outline'}
          data-testid={`cc-columns-${col}`}
          onclick={() => {
            columns = col;
          }}
        >
          {col === 'auto' ? 'auto cols' : `${col} col`}
        </Button>
      {/each}
    </HStack>
    <HStack class="items-center gap-2">
      <Badge variant="subtle" color="primary" data-testid="cc-placements-selected">
        {selected}
      </Badge>
      <Button
        size="sm"
        variant="outline"
        data-testid="cc-placements-toggle-empty"
        onclick={() => {
          emptyTree = !emptyTree;
        }}
      >
        {emptyTree ? 'Restore Commands' : 'Simulate Empty Commands'}
      </Button>
    </HStack>
  </HStack>
  <ColonCommand
    inline
    {placement}
    {columns}
    {items}
    onSelectCommand={(ctx) => {
      selected = `${ctx.node.label} (${ctx.commandString})`;
    }}
  />
</VStack>
