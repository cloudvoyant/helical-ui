// 1. Imports
import {
  CommandPalette,
  CommandPaletteFallback,
  CommandPaletteResults,
  CommandPaletteSearch,
  type CommandNode,
} from '@cloudvoyant/helical-react';

// 2. Module constants & types
const COMMANDS: CommandNode[] = [
  { value: 'new-file', label: 'New File', group: 'File', shortcut: 'Mod+n' },
  { value: 'save-file', label: 'Save File', group: 'File', shortcut: 'Mod+s' },
  { value: 'split-right', label: 'Split Editor Right', group: 'View' },
  { value: 'toggle-sidebar', label: 'Toggle Sidebar', group: 'View', shortcut: 'Mod+b' },
];

// 4. Exported functions / components
/**
 * Demonstrates composing `CommandPalette` from `CommandPaletteSearch`, `CommandPaletteResults`, and `CommandPaletteFallback`.
 */
export default function ReactCommandPaletteComposed() {
  // --- Render ---
  return (
    <CommandPalette inline items={COMMANDS}>
      <CommandPaletteSearch placeholder="Filter editor actions..." />
      <CommandPaletteResults>
        <CommandPaletteFallback>No matching editor actions.</CommandPaletteFallback>
      </CommandPaletteResults>
    </CommandPalette>
  );
}
