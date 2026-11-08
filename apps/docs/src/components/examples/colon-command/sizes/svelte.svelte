<!-- apps/docs/src/components/examples/colon-command/sizes/svelte.svelte -->
<script lang="ts">
  // 1. Imports
  import { type ColonCommandColumns } from '@cloudvoyant/helical-ui';
  import {
    ColonCommand,
    HStack,
    ToggleGroup,
    ToggleGroupItem,
    VStack,
  } from '@cloudvoyant/helical-svelte';
  import { buildDocsCommandTree, subscribeDocsCommandState } from '../../../../lib/commands';

  // 2. Module constants & types
  const SIZES = ['sm', 'md', 'lg'] as const;
  const COLUMNS: ColonCommandColumns[] = ['auto', 1, 2, 3, 4];

  // --- State ---
  let size = $state<'sm' | 'md' | 'lg'>('md');
  let columns = $state<ColonCommandColumns>('auto');
  let revision = $state(0);

  const items = $derived.by(() => {
    void revision;
    return buildDocsCommandTree();
  });

  // --- Effects ---
  $effect(() =>
    subscribeDocsCommandState(() => {
      revision += 1;
    }),
  );
</script>

<VStack class="w-full gap-3">
  <HStack class="flex-wrap items-center justify-between gap-2">
    <ToggleGroup
      attached
      value={[size]}
      onValueChange={(d) => {
        const next = d.value[0] as 'sm' | 'md' | 'lg' | undefined;
        if (next) size = next;
      }}
      aria-label="Compactness size"
    >
      {#each SIZES as s (s)}
        <ToggleGroupItem value={s} size="sm" variant="outline">
          {s === 'sm' ? 'Compact (sm)' : s === 'md' ? 'Default (md)' : 'Comfortable (lg)'}
        </ToggleGroupItem>
      {/each}
    </ToggleGroup>

    <ToggleGroup
      attached
      value={[String(columns)]}
      onValueChange={(d) => {
        const raw = d.value[0];
        if (!raw) return;
        columns = raw === 'auto' ? 'auto' : (Number(raw) as ColonCommandColumns);
      }}
      aria-label="Completion columns"
    >
      {#each COLUMNS as col (String(col))}
        <ToggleGroupItem value={String(col)} size="sm" variant="outline">
          {col === 'auto' ? 'auto cols' : `${col} col`}
        </ToggleGroupItem>
      {/each}
    </ToggleGroup>
  </HStack>

  <ColonCommand
    inline
    {size}
    {columns}
    placeholder="Type a command"
    {items}
  />
</VStack>
