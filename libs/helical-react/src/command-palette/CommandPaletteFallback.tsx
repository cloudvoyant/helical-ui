// 1. Imports
import type { ReactNode } from 'react';
import { ListboxEmpty } from '../listbox';
import { useCommandPaletteContext } from './context';

// 2. Module constants & types
export interface CommandPaletteFallbackProps {
  emptyText?: string;
  noCommandsText?: string;
  className?: string;
  children?: ReactNode;
}

// 4. Exported functions / components
/**
 * Renders the empty or no-matches fallback state inside `CommandPaletteResults`.
 */
export function CommandPaletteFallback({
  emptyText: emptyTextProp,
  noCommandsText: noCommandsTextProp,
  className,
  children,
}: CommandPaletteFallbackProps = {}) {
  // --- State ---
  const { resolution, emptyText, noCommandsText } = useCommandPaletteContext();

  // --- Render ---
  if (resolution.hasCommands && resolution.groups.length > 0) {
    return null;
  }

  const emptyKind = !resolution.hasCommands ? 'no-commands' : 'no-matches';
  const defaultMessage = !resolution.hasCommands
    ? (noCommandsTextProp ?? noCommandsText)
    : (emptyTextProp ?? emptyText);

  return (
    <ListboxEmpty
      data-testid="command-palette-empty"
      data-empty-kind={emptyKind}
      className={className}
    >
      {children ?? defaultMessage}
    </ListboxEmpty>
  );
}
