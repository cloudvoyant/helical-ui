// libs/helical-svelte/src/command-menu/context.svelte.ts

// 1. Imports
import { getContext, setContext } from 'svelte';
import type { CommandFlatItem, CommandMenuColumns } from '@cloudvoyant/helical-ui';
import type { CommandMenuResolution } from '@cloudvoyant/helical-ui/commands';

// 2. Module constants & types
const COMMAND_MENU_CONTEXT_KEY = Symbol.for('helical-ui:command-menu-context');

export interface CommandMenuContextValue {
  readonly resolution: CommandMenuResolution;
  readonly enabledSuggestions: CommandFlatItem[];
  readonly effectiveHighlightedValue: string | null;
  readonly currentInput: string;
  readonly activeError: string | null;
  readonly columns: CommandMenuColumns;
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

export type ColonCommandContextValue = CommandMenuContextValue;

// 4. Exported functions
/**
 * Registers the `CommandMenuContextValue` in Svelte component context.
 */
export function setCommandMenuContext(value: CommandMenuContextValue): CommandMenuContextValue {
  return setContext(COMMAND_MENU_CONTEXT_KEY, value);
}

export const setColonCommandContext = setCommandMenuContext;

/**
 * Retrieves the active `CommandMenuContextValue` from Svelte component context.
 */
export function getCommandMenuContext(): CommandMenuContextValue {
  const ctx = getContext<CommandMenuContextValue | undefined>(COMMAND_MENU_CONTEXT_KEY);
  if (!ctx) {
    throw new Error('getCommandMenuContext must be used within a <CommandMenu>');
  }
  return ctx;
}

export const getColonCommandContext = getCommandMenuContext;
