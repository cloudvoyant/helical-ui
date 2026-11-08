// libs/helical-ui/src/command/types.ts

// 1. Imports
import type { TreeCollection } from '@zag-js/collection';
import type { KbdHotkey } from '../kbd';

// 2. Module constants & types
export type CommandStyle = 'palette' | 'menu' | 'colon';

export interface CommandSelectContext {
  value: string;
  valuePath: string[];
  commandString: string;
  node: CommandNode;
}

export interface CommandNode {
  value: string;
  label: string;
  description?: string;
  group?: string;
  /** Command token for this level (defaults to `value`, e.g. 'theme' or 'catppuccin'). */
  command?: string;
  /** Alternative command tokens (e.g. ['t', 'colorscheme']). */
  aliases?: string[];
  /** Keyboard shortcut chord(s) rendered via <Kbd>. */
  shortcut?: KbdHotkey;
  /** Extra search terms matched during filtering. */
  keywords?: string[];
  /** Optional status badge (e.g. 'Future' for Search Docs). */
  badge?: string;
  /** Marks the currently active setting option (e.g. current theme, mode, preset, framework). */
  active?: boolean;
  disabled?: boolean;
  closeOnSelect?: boolean;
  onSelect?: (ctx: CommandSelectContext) => void;
  children?: CommandNode[];
}

export interface CommandBreadcrumb {
  value: string;
  label: string;
  command: string;
}

export interface CommandFlatItem {
  value: string;
  label: string;
  description?: string;
  group: string;
  command: string;
  fullCommand: string;
  aliases: string[];
  shortcut?: KbdHotkey;
  badge?: string;
  active: boolean;
  disabled: boolean;
  isBranch: boolean;
  valuePath: string[];
  breadcrumbLabels: string[];
  /** Character indices matched by fzf in `label` for fuzzy highlighting. */
  matchPositions?: number[];
  /** Character indices matched by fzf in `command` for command completion highlighting. */
  commandMatchPositions?: number[];
  score?: number;
  node: CommandNode;
}

export interface CommandLevelResolution {
  /** False when the root command tree has zero registered commands. */
  hasCommands: boolean;
  breadcrumbs: CommandBreadcrumb[];
  items: CommandFlatItem[];
  groups: Array<{ label: string; items: CommandFlatItem[] }>;
}

export interface CommandMenuResolution {
  /** False when the root command tree has zero registered commands. */
  hasCommands: boolean;
  normalizedInput: string;
  completedTokens: string[];
  partialToken: string;
  breadcrumbs: CommandBreadcrumb[];
  suggestions: CommandFlatItem[];
  exactNode: CommandFlatItem | null;
  error: string | null;
}

export type ColonCommandResolution = CommandMenuResolution;

export interface CommandHighlightSegment {
  text: string;
  highlight: boolean;
}

export interface CommandPaletteProps {
  items?: CommandNode[];
  collection?: TreeCollection<CommandNode>;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  activePath?: string[];
  onActivePathChange?: (path: string[]) => void;
  query?: string;
  onQueryChange?: (query: string) => void;
  onSelectCommand?: (ctx: CommandSelectContext) => void;
  placeholder?: string;
  /** Displayed when commands are registered but none match the search query. @default 'No matching commands.' */
  emptyText?: string;
  /** Displayed in the UI when no commands are registered in the tree. @default 'No commands registered.' */
  noCommandsText?: string;
  size?: 'sm' | 'md' | 'lg';
  /** Render inline inside a container instead of a modal Dialog (useful for docs previews). */
  inline?: boolean;
  /** Global keyboard shortcut to toggle open (e.g. 'Mod+k'), or false to disable. @default 'Mod+k' */
  hotkey?: string | false;
  className?: string;
}

export type CommandMenuColumns = 'auto' | 1 | 2 | 3 | 4;
export type ColonCommandColumns = CommandMenuColumns;

export interface CommandMenuProps {
  items?: CommandNode[];
  collection?: TreeCollection<CommandNode>;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  inputValue?: string;
  onInputValueChange?: (value: string) => void;
  onSelectCommand?: (ctx: CommandSelectContext) => void;
  /** Optional input placeholder text (e.g. 'Type a command'). @default '' */
  placeholder?: string;
  /** Displayed when commands are registered but none match the typed filter. @default 'No matching commands.' */
  emptyText?: string;
  /** Displayed in the UI when no commands are registered in the tree. @default 'No commands registered.' */
  noCommandsText?: string;
  /** Number of completion columns above the prompt bar. @default 'auto' */
  columns?: CommandMenuColumns;
  /** Whether to display keyboard shortcut badges next to completion items. @default false */
  showShortcuts?: boolean;
  /** Compactness variant for the completion grid and prompt bar. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Render inline inside a container instead of a modal Dialog (useful for docs previews). */
  inline?: boolean;
  /** Global keyboard shortcut to open the command menu (e.g. ':'), or false to disable. @default ':' */
  hotkey?: string | false;
  className?: string;
}

export type ColonCommandProps = CommandMenuProps;

export interface CommandContextProps {
  items?: CommandNode[];
  collection?: TreeCollection<CommandNode>;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  style?: CommandStyle;
  defaultStyle?: CommandStyle;
  onStyleChange?: (style: CommandStyle) => void;
  onSelectCommand?: (ctx: CommandSelectContext) => void;
}

export interface CommandContextValue {
  items?: CommandNode[];
  collection?: TreeCollection<CommandNode>;
  tree: TreeCollection<CommandNode>;
  open: boolean;
  setOpen: (open: boolean) => void;
  style: CommandStyle;
  setStyle: (style: CommandStyle) => void;
  openPalette: () => void;
  openMenu: () => void;
  openColon: () => void;
  close: () => void;
  toggle: () => void;
  onSelectCommand?: (ctx: CommandSelectContext) => void;
}
