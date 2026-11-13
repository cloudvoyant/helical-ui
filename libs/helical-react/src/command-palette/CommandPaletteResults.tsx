// 1. Imports
import type { ReactNode } from 'react';
import { cn, commandPaletteStyles } from '@cloudvoyant/helical-ui';
import { ListboxContent, ListboxItemGroup, ListboxItemGroupLabel } from '../listbox';
import { Scroll } from '../scroll';
import { CommandPaletteFallback } from './CommandPaletteFallback';
import { CommandPaletteItem } from './CommandPaletteItem';
import { useCommandPaletteContext } from './context';

// 2. Module constants & types
export interface CommandPaletteResultsProps {
  fallback?: ReactNode;
  className?: string;
  children?: ReactNode;
}

// 4. Exported functions / components
/**
 * Renders the scrollable grouped command list or fallback state for `CommandPalette`.
 */
export function CommandPaletteResults({
  fallback,
  className,
  children,
}: CommandPaletteResultsProps = {}) {
  // --- State ---
  const { resolution } = useCommandPaletteContext();
  const isEmpty = !resolution.hasCommands || resolution.groups.length === 0;

  // --- Render ---
  return (
    <Scroll className="max-h-80 min-h-0 flex-1" viewportClassName="max-h-80">
      <ListboxContent
        tabIndex={-1}
        data-testid="command-palette-list"
        className={cn(commandPaletteStyles.list, className)}
      >
        {isEmpty
          ? (fallback ?? children ?? <CommandPaletteFallback />)
          : resolution.groups.map((group) => (
              <ListboxItemGroup key={group.label}>
                <ListboxItemGroupLabel>{group.label}</ListboxItemGroupLabel>
                {group.items.map((item) => (
                  <CommandPaletteItem key={item.value} item={item} />
                ))}
              </ListboxItemGroup>
            ))}
      </ListboxContent>
    </Scroll>
  );
}
