// libs/helical-svelte/src/colon-command/context.svelte.ts

// 1. Imports
import { getContext, setContext } from 'svelte';
import type { ColonCommandColumns, ColonCommandResolution, CommandFlatItem } from '@cloudvoyant/helical-ui';

// 2. Module constants & types
const COLON_COMMAND_CONTEXT_KEY = Symbol.for('helical-ui:colon-command-context');

export interface ColonCommandContextValue {
  readonly resolution: ColonCommandResolution;
  readonly enabledSuggestions: CommandFlatItem[];
  readonly effectiveHighlightedValue: string | null;
  readonly currentInput: string;
  readonly activeError: string | null;
  readonly columns: ColonCommandColumns;
  readonly size: 'sm' | 'md' | 'lg';
  readonly showShortcuts: boolean;
  readonly inline: boolean;
  readonly placeholder: string;
  readonly emptyText: string;
  readonly noCommandsText: string;
  setInputValue: (nextValue: string, nextTabBase?: string | null) => void;
  setHighlightedValue: (value: string | null) => void;
  handleOpenChange: (nextOpen: boolean) => void;
  executeOrDrillItem: (item: CommandFlatItem) => void;
  handleInputKeyDown: (event: KeyboardEvent) => void;
}

// 4. Exported functions
export function setColonCommandContext(value: ColonCommandContextValue): ColonCommandContextValue {
  return setContext(COLON_COMMAND_CONTEXT_KEY, value);
}

export function getColonCommandContext(): ColonCommandContextValue {
  const ctx = getContext<ColonCommandContextValue | undefined>(COLON_COMMAND_CONTEXT_KEY);
  if (!ctx) {
    throw new Error('getColonCommandContext must be used within a <ColonCommand>');
  }
  return ctx;
}
