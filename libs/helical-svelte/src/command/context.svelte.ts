// libs/helical-svelte/src/command/context.svelte.ts

// 1. Imports
import { getContext, hasContext, setContext } from 'svelte';
import type { CommandContextValue } from '@cloudvoyant/helical-ui/commands';

// 2. Module constants & types
const COMMAND_CONTEXT_KEY = Symbol.for('helical-ui:command-context');

// 4. Exported functions
export function setCommandContext(value: CommandContextValue): CommandContextValue {
  return setContext(COMMAND_CONTEXT_KEY, value);
}

export function getOptionalCommandContext(): CommandContextValue | null {
  return hasContext(COMMAND_CONTEXT_KEY) ? getContext<CommandContextValue>(COMMAND_CONTEXT_KEY) : null;
}

export function getCommandContext(): CommandContextValue {
  const ctx = getOptionalCommandContext();
  if (!ctx) {
    throw new Error('getCommandContext must be used within a <CommandProvider>');
  }
  return ctx;
}

export const useCommand = getCommandContext;
export const useOptionalCommand = getOptionalCommandContext;
