// libs/helical-react/src/colon-command/context.tsx

// 1. Imports
import { createContext, useContext, type KeyboardEvent } from 'react';
import type {
  ColonCommandColumns,
  ColonCommandResolution,
  CommandFlatItem,
} from '@cloudvoyant/helical-ui';

// 2. Module constants & types
export interface ColonCommandContextValue {
  resolution: ColonCommandResolution;
  enabledSuggestions: CommandFlatItem[];
  effectiveHighlightedValue: string | null;
  currentInput: string;
  activeError: string | null;
  columns: ColonCommandColumns;
  size: 'sm' | 'md' | 'lg';
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

export const ColonCommandContext = createContext<ColonCommandContextValue | null>(null);

// 3. Local helpers / hooks
export function useColonCommandContext(): ColonCommandContextValue {
  const ctx = useContext(ColonCommandContext);
  if (!ctx) {
    throw new Error('useColonCommandContext must be used within a <ColonCommand>');
  }
  return ctx;
}
