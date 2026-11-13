<!-- apps/docs/src/components/examples/command-menu/aliases/svelte.svelte -->
<script lang="ts">
  // 1. Imports
  import {
    CommandMenu,
    HStack,
    ToggleGroup,
    ToggleGroupItem,
    VStack,
    type CommandNode,
  } from '@cloudvoyant/helical-svelte';

  // 2. Module constants & types
  const COMMANDS: CommandNode[] = [
    { value: 'write', label: 'Save File', command: 'write', aliases: ['w'] },
    { value: 'write-all', label: 'Save All', command: 'write-all', aliases: ['wa'] },
    { value: 'quit', label: 'Close Buffer', command: 'quit', aliases: ['q'] },
    { value: 'format', label: 'Format Document', command: 'format', aliases: ['fmt'] },
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
    { value: 'reload', label: 'Reload Workspace', command: 'reload' },
  ];

  // --- State ---
  let showAliases = $state(true);
</script>

<VStack class="w-full gap-3">
  <HStack class="items-center justify-end gap-2">
    <ToggleGroup
      attached
      value={[showAliases ? 'on' : 'off']}
      onValueChange={(d) => {
        const next = d.value[0];
        if (next) showAliases = next === 'on';
      }}
      aria-label="Alias display"
    >
      <ToggleGroupItem value="on" size="sm" variant="outline">
        Show Aliases
      </ToggleGroupItem>
      <ToggleGroupItem value="off" size="sm" variant="outline">
        Hide Aliases
      </ToggleGroupItem>
    </ToggleGroup>
  </HStack>

  <CommandMenu
    inline
    {showAliases}
    placeholder="Type a command or alias (e.g. w)"
    items={COMMANDS}
  />
</VStack>
