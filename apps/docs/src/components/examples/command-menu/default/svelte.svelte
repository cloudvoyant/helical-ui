<!-- apps/docs/src/components/examples/command-menu/default/svelte.svelte -->
<script lang="ts">
  // 1. Imports
  import { CommandMenu, type CommandNode } from '@cloudvoyant/helical-svelte';

  // 2. Module constants & types
  const COMMANDS: CommandNode[] = [
    {
      value: 'theme',
      label: 'Change Theme',
      command: 'theme',
      aliases: ['t', 'colorscheme'],
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
      aliases: ['m'],
      children: [
        { value: 'light', label: 'Light', command: 'light' },
        { value: 'dark', label: 'Dark', command: 'dark', active: true },
        { value: 'system', label: 'System', command: 'system' },
      ],
    },
    {
      value: 'keybind',
      label: 'Change Keybind Style',
      command: 'keybind',
      aliases: ['k'],
      children: [
        { value: 'helix', label: 'Helix', command: 'helix', active: true },
        { value: 'vim', label: 'Vim', command: 'vim' },
        { value: 'kakoune', label: 'Kakoune', command: 'kakoune' },
      ],
    },
    { value: 'search', label: 'Search Docs', command: 'search', aliases: ['find'], badge: 'Future', shortcut: '/' },
    { value: 'bindings', label: 'Explore Keybindings', command: 'bindings', shortcut: '?' },
    { value: 'settings', label: 'Open Settings', command: 'settings' },
  ];
</script>

<CommandMenu items={COMMANDS} />
