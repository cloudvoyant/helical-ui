<script lang="ts">
  // 1. Imports
  import {
    CommandPalette,
    CommandPaletteFallback,
    CommandPaletteResults,
    CommandPaletteSearch,
    type CommandNode,
  } from '@cloudvoyant/helical-svelte';

  // 2. Module constants & types
  const COMMANDS: CommandNode[] = [
    { value: 'new-file', label: 'New File', group: 'File', shortcut: 'Mod+n' },
    { value: 'save-file', label: 'Save File', group: 'File', shortcut: 'Mod+s' },
    { value: 'split-right', label: 'Split Editor Right', group: 'View' },
    { value: 'toggle-sidebar', label: 'Toggle Sidebar', group: 'View', shortcut: 'Mod+b' },
  ];
</script>

<CommandPalette inline items={COMMANDS}>
  <CommandPaletteSearch placeholder="Filter editor actions..." />
  <CommandPaletteResults>
    <CommandPaletteFallback>No matching editor actions.</CommandPaletteFallback>
  </CommandPaletteResults>
</CommandPalette>
