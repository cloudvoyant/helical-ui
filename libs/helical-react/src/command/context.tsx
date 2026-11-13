// libs/helical-react/src/command/context.tsx

// 1. Imports
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import {
  createCommandTree,
  type CommandContextProps,
  type CommandContextValue,
  type CommandStyle,
} from '@cloudvoyant/helical-ui';

// 2. Module constants & types
export interface CommandProviderProps extends CommandContextProps {
  children?: ReactNode;
}

const CommandContext = createContext<CommandContextValue | null>(null);

// 3. Local helpers / hooks
/**
 * Returns the active `CommandContextValue` when inside a `<CommandProvider>`, or `null` when standalone.
 */
export function useOptionalCommand(): CommandContextValue | null {
  return useContext(CommandContext);
}

/**
 * Returns the active `CommandContextValue`, throwing if called outside `<CommandProvider>`.
 */
export function useCommand(): CommandContextValue {
  const ctx = useContext(CommandContext);
  if (!ctx) {
    throw new Error('useCommand must be used within a <CommandProvider>');
  }
  return ctx;
}

// 4. Exported component
/**
 * Provides shared command tree, open state, and style (`'palette'` | `'menu'`) to child command components.
 */
export function CommandProvider({
  items,
  collection,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  style: controlledStyle,
  defaultStyle = 'palette',
  onStyleChange,
  onSelectCommand,
  children,
}: CommandProviderProps) {
  // --- State ---
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const [uncontrolledStyle, setUncontrolledStyle] = useState<CommandStyle>(defaultStyle);

  const open = controlledOpen ?? uncontrolledOpen;
  const style = controlledStyle ?? uncontrolledStyle;

  const tree = useMemo(
    () => createCommandTree(collection ?? items ?? []),
    [collection, items],
  );

  // --- Methods ---
  const setOpen = (nextOpen: boolean) => {
    if (controlledOpen === undefined) {
      setUncontrolledOpen(nextOpen);
    }
    onOpenChange?.(nextOpen);
  };

  const setStyle = (nextStyle: CommandStyle) => {
    if (controlledStyle === undefined) {
      setUncontrolledStyle(nextStyle);
    }
    onStyleChange?.(nextStyle);
  };

  const value = useMemo<CommandContextValue>(
    () => ({
      items,
      collection,
      tree,
      open,
      setOpen,
      style,
      setStyle,
      openPalette: () => {
        setStyle('palette');
        setOpen(true);
      },
      openMenu: () => {
        setStyle('menu');
        setOpen(true);
      },
      openColon: () => {
        setStyle('menu');
        setOpen(true);
      },
      close: () => setOpen(false),
      toggle: () => setOpen(!open),
      onSelectCommand,
    }),
    [items, collection, tree, open, style, onSelectCommand],
  );

  // --- Render ---
  return <CommandContext.Provider value={value}>{children}</CommandContext.Provider>;
}
