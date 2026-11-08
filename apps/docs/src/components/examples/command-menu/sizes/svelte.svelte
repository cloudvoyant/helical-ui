<!-- apps/docs/src/components/examples/command-menu/sizes/svelte.svelte -->
<script lang="ts">
  // 1. Imports
  import {
    CommandMenu,
    HStack,
    ToggleGroup,
    ToggleGroupItem,
    VStack,
    type CommandMenuColumns,
    type CommandNode,
  } from '@cloudvoyant/helical-svelte';

  // 2. Module constants & types
  const SIZES = ['sm', 'md', 'lg'] as const;
  const COLUMNS: CommandMenuColumns[] = ['auto', 1, 2, 3, 4];

  const COMMANDS: CommandNode[] = [
    {
      value: 'theme',
      label: 'Change Theme',
      command: 'theme',
      aliases: ['t'],
      children: [
        { value: 'catppuccin', label: 'Catppuccin', command: 'catppuccin', active: true },
        { value: 'dracula', label: 'Dracula', command: 'dracula' },
        { value: 'tokyo-night', label: 'Tokyo Night', command: 'tokyo-night' },
      ],
    },
    {
      value: 'mode',
      label: 'Change Light/Dark Mode',
      command: 'mode',
      children: [
        { value: 'light', label: 'Light', command: 'light' },
        { value: 'dark', label: 'Dark', command: 'dark', active: true },
        { value: 'system', label: 'System', command: 'system' },
      ],
    },
    { value: 'write', label: 'Save File', command: 'write', aliases: ['w'] },
    { value: 'format', label: 'Format Document', command: 'format', aliases: ['fmt'] },
    { value: 'reload', label: 'Reload Workspace', command: 'reload' },
    { value: 'quit', label: 'Close Buffer', command: 'quit', aliases: ['q'] },
  ];

  // --- State ---
  let size = $state<'sm' | 'md' | 'lg'>('md');
  let columns = $state<CommandMenuColumns>('auto');
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
        columns = raw === 'auto' ? 'auto' : (Number(raw) as CommandMenuColumns);
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

  <CommandMenu inline {size} {columns} placeholder="Type a command" items={COMMANDS} />
</VStack>
