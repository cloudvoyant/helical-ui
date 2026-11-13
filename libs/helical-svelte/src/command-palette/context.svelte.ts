// 1. Imports
import { getContext, setContext } from 'svelte';
import type { CommandFlatItem } from '@cloudvoyant/helical-ui';
import type { CommandLevelResolution } from '@cloudvoyant/helical-ui/commands';

// 2. Module constants & types
const COMMAND_PALETTE_CONTEXT_KEY = Symbol.for('helical-ui:command-palette-context');

export interface CommandPaletteContextValue {
  readonly resolution: CommandLevelResolution;
  readonly enabledItems: CommandFlatItem[];
  readonly effectiveHighlightedValue: string | null;
  readonly currentActivePath: string[];
  readonly currentQuery: string;
  readonly inline: boolean;
  readonly placeholder: string;
  readonly emptyText: string;
  readonly noCommandsText: string;
  setActivePath: (nextPath: string[]) => void;
  setQuery: (nextQuery: string) => void;
  setHighlightedValue: (value: string | null) => void;
  handleOpenChange: (nextOpen: boolean) => void;
  selectFlatItem: (item: CommandFlatItem) => void;
  popSubmenu: () => boolean;
  focusInput: () => void;
  handleInputKeyDown: (event: KeyboardEvent) => void;
}

// 4. Exported functions / components
/**
 * Registers the `CommandPaletteContextValue` in Svelte component context.
 */
export function setCommandPaletteContext(value: CommandPaletteContextValue): CommandPaletteContextValue {
  return setContext(COMMAND_PALETTE_CONTEXT_KEY, value);
}

/**
 * Retrieves the active `CommandPaletteContextValue` from Svelte component context.
 */
export function getCommandPaletteContext(): CommandPaletteContextValue {
  const ctx = getContext<CommandPaletteContextValue | undefined>(COMMAND_PALETTE_CONTEXT_KEY);
  if (!ctx) {
    throw new Error('getCommandPaletteContext must be used within a <CommandPalette>');
  }
  return ctx;
}
