// libs/helical-svelte/src/command/context.svelte.ts

// 1. Imports
import { getContext, hasContext, setContext } from 'svelte';
import type { CommandContextValue } from '@cloudvoyant/helical-ui';

// 2. Module constants & types
const COMMAND_CONTEXT_KEY = Symbol.for('helical-ui:command-context');

// 4. Exported functions
/**
 * Registers the `CommandContextValue` in Svelte component context.
 */
export function setCommandContext(value: CommandContextValue): CommandContextValue {
  return setContext(COMMAND_CONTEXT_KEY, value);
}

/**
 * Returns the active `CommandContextValue` when inside a `<CommandProvider>`, or `null` when standalone.
 */
export function getOptionalCommandContext(): CommandContextValue | null {
  return hasContext(COMMAND_CONTEXT_KEY) ? getContext<CommandContextValue>(COMMAND_CONTEXT_KEY) : null;
}

/**
 * Returns the active `CommandContextValue`, throwing if called outside `<CommandProvider>`.
 */
export function getCommandContext(): CommandContextValue {
  const ctx = getOptionalCommandContext();
  if (!ctx) {
    throw new Error('getCommandContext must be used within a <CommandProvider>');
  }
  return ctx;
}

export const useCommand = getCommandContext;
export const useOptionalCommand = getOptionalCommandContext;
