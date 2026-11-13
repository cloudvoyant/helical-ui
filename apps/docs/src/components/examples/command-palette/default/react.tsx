// apps/docs/src/components/examples/command-palette/default/react.tsx

// 1. Imports
import { useRef } from 'react';
import { CommandPalette, type CommandNode } from '@cloudvoyant/helical-react';

// 2. Module constants & types
const COMMANDS: CommandNode[] = [
  {
    value: 'theme',
    label: 'Change Theme',
    group: 'Appearance',
    children: [
      { value: 'catppuccin', label: 'Catppuccin', active: true },
      { value: 'dracula', label: 'Dracula' },
      { value: 'tokyo-night', label: 'Tokyo Night' },
    ],
  },
  {
    value: 'mode',
    label: 'Change Light/Dark Mode',
    group: 'Appearance',
    children: [
      { value: 'light', label: 'Light' },
      { value: 'dark', label: 'Dark', active: true },
      { value: 'system', label: 'System' },
    ],
  },
  {
    value: 'keybind',
    label: 'Change Keybind Style',
    group: 'Preferences',
    children: [
      { value: 'helix', label: 'Helix', active: true },
      { value: 'vim', label: 'Vim' },
      { value: 'kakoune', label: 'Kakoune' },
    ],
  },
  { value: 'search', label: 'Search Docs', group: 'Navigation', badge: 'Future', shortcut: '/' },
  { value: 'bindings', label: 'Explore Keybindings', group: 'Tools', shortcut: '?' },
  { value: 'settings', label: 'Open Settings', group: 'Tools' },
];

// 4. Exported component
/**
 * Default interactive `CommandPalette` example with nested appearance and preference submenus.
 */
export default function ReactCommandPaletteDefault() {
  // --- State ---
  const containerRef = useRef<HTMLDivElement | null>(null);

  // --- Render ---
  return (
    <div ref={containerRef} className="contents">
      <CommandPalette
        items={COMMANDS}
        onSelectCommand={(ctx) => {
          if (ctx.value === 'settings') {
            containerRef.current?.querySelector<HTMLElement>('button')?.focus();
          }
        }}
      />
    </div>
  );
}
