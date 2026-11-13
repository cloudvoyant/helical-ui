// 1. Imports
import { createContext, useContext, type KeyboardEvent } from 'react';
import type { CommandFlatItem } from '@cloudvoyant/helical-ui';
import type { CommandLevelResolution } from '@cloudvoyant/helical-ui/commands';

// 2. Module constants & types
export interface CommandPaletteContextValue {
  resolution: CommandLevelResolution;
  enabledItems: CommandFlatItem[];
  effectiveHighlightedValue: string | null;
  currentActivePath: string[];
  currentQuery: string;
  inline: boolean;
  placeholder: string;
  emptyText: string;
  noCommandsText: string;
  setActivePath: (nextPath: string[]) => void;
  setQuery: (nextQuery: string) => void;
  setHighlightedValue: (value: string | null) => void;
  handleOpenChange: (nextOpen: boolean) => void;
  selectFlatItem: (item: CommandFlatItem) => void;
  popSubmenu: () => boolean;
  focusInput: () => void;
  handleInputKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
}

export const CommandPaletteContext = createContext<CommandPaletteContextValue | null>(null);

// 4. Exported functions / components
/**
 * Returns the active `CommandPaletteContextValue` for child `CommandPalette` parts.
 */
export function useCommandPaletteContext(): CommandPaletteContextValue {
  const ctx = useContext(CommandPaletteContext);
  if (!ctx) {
    throw new Error('useCommandPaletteContext must be used within a <CommandPalette>');
  }
  return ctx;
}
