// libs/helical-react/src/command-menu/context.tsx

// 1. Imports
import { createContext, useContext, type KeyboardEvent } from 'react';
import type { CommandFlatItem, CommandMenuColumns } from '@cloudvoyant/helical-ui';
import type { CommandMenuResolution } from '@cloudvoyant/helical-ui/commands';

// 2. Module constants & types
export interface CommandMenuContextValue {
  resolution: CommandMenuResolution;
  enabledSuggestions: CommandFlatItem[];
  effectiveHighlightedValue: string | null;
  currentInput: string;
  activeError: string | null;
  columns: CommandMenuColumns;
  size: 'sm' | 'md' | 'lg';
  showAliases: boolean;
  showShortcuts: boolean;
  inline: boolean;
  placeholder: string;
  emptyText: string;
  noCommandsText: string;
  setInputValue: (nextValue: string, nextTabBase?: string | null) => void;
  setHighlightedValue: (value: string | null) => void;
  handleOpenChange: (nextOpen: boolean) => void;
  executeOrDrillItem: (item: CommandFlatItem) => void;
  handleInputKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
}

export type ColonCommandContextValue = CommandMenuContextValue;

export const CommandMenuContext = createContext<CommandMenuContextValue | null>(null);
export const ColonCommandContext = CommandMenuContext;

// 3. Local helpers / hooks
/**
 * Returns the active `CommandMenuContextValue` for child `CommandMenu` parts.
 */
export function useCommandMenuContext(): CommandMenuContextValue {
  const ctx = useContext(CommandMenuContext);
  if (!ctx) {
    throw new Error('useCommandMenuContext must be used within a <CommandMenu>');
  }
  return ctx;
}

export const useColonCommandContext = useCommandMenuContext;
