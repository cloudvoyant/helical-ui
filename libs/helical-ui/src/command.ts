// Source: https://ui.shadcn.com/docs/components/radix/command
// Closely based on: Ark UI listbox & dialog (https://ark-ui.com/docs/components/listbox, https://ark-ui.com/docs/components/dialog) and Helix command mode (https://docs.helix-editor.com/commands.html).

// 1. Imports
import { matchesKeyboardEvent, type HotkeyChord } from '@tanstack/hotkeys';
import { TreeCollection } from '@zag-js/collection';
import { createFilter } from '@zag-js/i18n-utils';
import { createLiveRegion, type LiveRegion } from '@zag-js/live-region';
import { cva, type VariantProps } from 'class-variance-authority';
import { Fzf, byLengthAsc } from 'fzf';

// 2. Module constants & types
export type CommandStyle = 'palette' | 'colon';

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
  /** Colon token for this level (defaults to `value`, e.g. 'theme' or 'catppuccin'). */
  command?: string;
  /** Alternative colon tokens (e.g. ['t', 'colorscheme']). */
  aliases?: string[];
  /** Keyboard shortcut chord(s) rendered via <Kbd>. */
  shortcut?: string | string[];
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
  shortcut?: string | string[];
  badge?: string;
  active: boolean;
  disabled: boolean;
  isBranch: boolean;
  valuePath: string[];
  breadcrumbLabels: string[];
  /** Character indices matched by fzf in `label` for fuzzy highlighting. */
  matchPositions?: number[];
  /** Character indices matched by fzf in `command` for colon completion highlighting. */
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

export interface ColonCommandResolution {
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
  /** Global keyboard shortcut to toggle open (e.g. 'Mod+k'), or false to disable. */
  hotkey?: string | false;
  className?: string;
}

export interface ColonCommandProps {
  items?: CommandNode[];
  collection?: TreeCollection<CommandNode>;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  inputValue?: string;
  onInputValueChange?: (value: string) => void;
  onSelectCommand?: (ctx: CommandSelectContext) => void;
  placeholder?: string;
  /** Displayed when commands are registered but none match the typed filter. @default 'No matching commands.' */
  emptyText?: string;
  /** Displayed in the UI when no commands are registered in the tree. @default 'No commands registered.' */
  noCommandsText?: string;
  placement?: 'bottom' | 'center' | 'top';
  size?: 'sm' | 'md' | 'lg';
  /** Render inline inside a container instead of a modal Dialog (useful for docs previews). */
  inline?: boolean;
  className?: string;
}

const ROOT_NODE_VALUE = '__root__';
const DEFAULT_GROUP_LABEL = 'Commands';

const i18nFilter = createFilter({ sensitivity: 'base' });

// 3. Local helpers
function getNodeCommandToken(node: CommandNode): string {
  return (node.command ?? node.value).trim();
}

function toFlatItem(
  node: CommandNode,
  ancestorPath: string[],
  ancestorLabels: string[],
  ancestorCommands: string[],
  tree: TreeCollection<CommandNode>,
  fallbackGroup?: string,
): CommandFlatItem {
  const cmd = getNodeCommandToken(node);
  const valuePath = [...ancestorPath, node.value];
  const commandTokens = [...ancestorCommands, cmd];
  const isBranch = tree.isBranchNode(node);
  const group =
    node.group ??
    fallbackGroup ??
    (ancestorLabels.length > 0 ? ancestorLabels[ancestorLabels.length - 1] : DEFAULT_GROUP_LABEL);

  return {
    value: valuePath.join('/'),
    label: node.label,
    description: node.description,
    group,
    command: cmd,
    fullCommand: `:${commandTokens.join(' ')}`,
    aliases: node.aliases ?? [],
    shortcut: node.shortcut,
    badge: node.badge,
    active: Boolean(node.active),
    disabled: Boolean(node.disabled),
    isBranch,
    valuePath,
    breadcrumbLabels: ancestorLabels,
    node,
  };
}

function groupCommandItems(items: CommandFlatItem[]): Array<{ label: string; items: CommandFlatItem[] }> {
  const map = new Map<string, CommandFlatItem[]>();
  for (const item of items) {
    const groupLabel = item.group || DEFAULT_GROUP_LABEL;
    const list = map.get(groupLabel);
    if (list) {
      list.push(item);
    } else {
      map.set(groupLabel, [item]);
    }
  }
  return Array.from(map.entries()).map(([label, groupItems]) => ({
    label,
    items: groupItems,
  }));
}

function collectDeepFlatItems(
  parentNode: CommandNode,
  ancestorPath: string[],
  ancestorLabels: string[],
  ancestorCommands: string[],
  tree: TreeCollection<CommandNode>,
  out: CommandFlatItem[],
): void {
  const children = tree.getNodeChildren(parentNode);
  for (const child of children) {
    const flat = toFlatItem(child, ancestorPath, ancestorLabels, ancestorCommands, tree);
    out.push(flat);
    if (tree.isBranchNode(child)) {
      collectDeepFlatItems(
        child,
        [...ancestorPath, child.value],
        [...ancestorLabels, child.label],
        [...ancestorCommands, getNodeCommandToken(child)],
        tree,
        out,
      );
    }
  }
}

function matchesCommandToken(node: CommandNode, token: string): boolean {
  const lower = token.toLowerCase();
  const cmd = getNodeCommandToken(node).toLowerCase();
  if (cmd === lower || node.value.toLowerCase() === lower) {
    return true;
  }
  return (node.aliases ?? []).some((alias) => alias.toLowerCase() === lower);
}

// 4. Exported functions & variants
export function createCommandTree(items?: CommandNode[] | TreeCollection<CommandNode>): TreeCollection<CommandNode> {
  if (items instanceof TreeCollection) {
    return items;
  }
  const rootNode: CommandNode = {
    value: ROOT_NODE_VALUE,
    label: 'Root',
    children: items ?? [],
  };
  return new TreeCollection<CommandNode>({
    rootNode,
    nodeToValue: (node) => node.value,
    nodeToString: (node) => node.label,
    isNodeDisabled: (node) => Boolean(node.disabled),
    nodeToChildren: (node) => node.children ?? [],
  });
}

export function resolveCommandLevel(
  tree: TreeCollection<CommandNode>,
  activePath: string[] = [],
  query: string = '',
  options?: { deepSearch?: boolean },
): CommandLevelResolution {
  const rootChildren = tree.getNodeChildren(tree.rootNode);
  const hasCommands = rootChildren.length > 0;

  if (!hasCommands) {
    return {
      hasCommands: false,
      breadcrumbs: [],
      items: [],
      groups: [],
    };
  }

  const breadcrumbs: CommandBreadcrumb[] = [];
  const resolvedValuePath: string[] = [];
  const resolvedLabels: string[] = [];
  const resolvedCommands: string[] = [];
  let currentNode = tree.rootNode;

  for (const segment of activePath) {
    const children = tree.getNodeChildren(currentNode);
    const match = children.find((child) => child.value === segment);
    if (!match || !tree.isBranchNode(match)) {
      break;
    }
    const cmd = getNodeCommandToken(match);
    breadcrumbs.push({
      value: match.value,
      label: match.label,
      command: cmd,
    });
    resolvedValuePath.push(match.value);
    resolvedLabels.push(match.label);
    resolvedCommands.push(cmd);
    currentNode = match;
  }

  const trimmedQuery = query.trim();
  const directChildren = tree.getNodeChildren(currentNode);
  const directItems = directChildren.map((child) =>
    toFlatItem(child, resolvedValuePath, resolvedLabels, resolvedCommands, tree),
  );

  if (!trimmedQuery) {
    return {
      hasCommands: true,
      breadcrumbs,
      items: directItems,
      groups: groupCommandItems(directItems),
    };
  }

  const normalizedQuery = trimmedQuery.startsWith(':') ? trimmedQuery.slice(1).trim() : trimmedQuery;
  if (!normalizedQuery) {
    return {
      hasCommands: true,
      breadcrumbs,
      items: directItems,
      groups: groupCommandItems(directItems),
    };
  }

  const allowDeepSearch = options?.deepSearch !== false && breadcrumbs.length === 0;
  const candidatePool: CommandFlatItem[] = [];
  if (allowDeepSearch) {
    collectDeepFlatItems(currentNode, resolvedValuePath, resolvedLabels, resolvedCommands, tree, candidatePool);
  } else {
    candidatePool.push(...directItems);
  }

  const labelFzf = new Fzf(candidatePool, {
    selector: (item) => item.label,
    tiebreakers: [byLengthAsc],
    casing: 'case-insensitive',
  });
  const labelResults = labelFzf.find(normalizedQuery);
  const labelMatchMap = new Map<string, { score: number; positions: number[] }>();
  for (const res of labelResults) {
    labelMatchMap.set(res.item.value, {
      score: res.score,
      positions: Array.from(res.positions).sort((a, b) => a - b),
    });
  }

  const compositeFzf = new Fzf(candidatePool, {
    selector: (item) =>
      [
        item.label,
        item.command,
        item.fullCommand,
        ...item.aliases,
        ...item.breadcrumbLabels,
        item.description ?? '',
        ...(item.node.keywords ?? []),
      ].join(' '),
    tiebreakers: [byLengthAsc],
    casing: 'case-insensitive',
  });
  const compositeResults = compositeFzf.find(normalizedQuery);

  const matchedByValue = new Map<string, CommandFlatItem>();
  for (const res of compositeResults) {
    const labelHit = labelMatchMap.get(res.item.value);
    const depthPenalty = (res.item.valuePath.length - 1) * 2;
    const effectiveScore = (labelHit ? labelHit.score + 20 : res.score) - depthPenalty;
    matchedByValue.set(res.item.value, {
      ...res.item,
      matchPositions: labelHit?.positions ?? [],
      score: effectiveScore,
    });
  }

  // Fallback for locale-insensitive substring matches via @zag-js/i18n-utils
  for (const candidate of candidatePool) {
    if (matchedByValue.has(candidate.value)) continue;
    if (
      i18nFilter.contains(candidate.label, normalizedQuery) ||
      i18nFilter.contains(candidate.command, normalizedQuery)
    ) {
      matchedByValue.set(candidate.value, {
        ...candidate,
        matchPositions: [],
        score: 1,
      });
    }
  }

  const rankedItems = Array.from(matchedByValue.values()).sort((a, b) => {
    const scoreDiff = (b.score ?? 0) - (a.score ?? 0);
    if (scoreDiff !== 0) return scoreDiff;
    if (a.valuePath.length !== b.valuePath.length) {
      return a.valuePath.length - b.valuePath.length;
    }
    return a.label.length - b.label.length;
  });

  return {
    hasCommands: true,
    breadcrumbs,
    items: rankedItems,
    groups: groupCommandItems(rankedItems),
  };
}

export function resolveColonCommandState(
  tree: TreeCollection<CommandNode>,
  rawInput: string = '',
): ColonCommandResolution {
  const rootChildren = tree.getNodeChildren(tree.rootNode);
  const hasCommands = rootChildren.length > 0;
  const withoutColon = rawInput.startsWith(':') ? rawInput.slice(1) : rawInput;
  const normalizedInput = `:${withoutColon}`;

  if (!hasCommands) {
    return {
      hasCommands: false,
      normalizedInput,
      completedTokens: [],
      partialToken: withoutColon.trim(),
      breadcrumbs: [],
      suggestions: [],
      exactNode: null,
      error: null,
    };
  }

  const hasTrailingSpace = /\s+$/.test(withoutColon);
  const trimmed = withoutColon.trim();
  const rawTokens = trimmed.length > 0 ? trimmed.split(/\s+/) : [];

  const tokensToWalk = hasTrailingSpace ? rawTokens : rawTokens.slice(0, -1);
  const partialToken = hasTrailingSpace ? '' : (rawTokens[rawTokens.length - 1] ?? '');

  const completedTokens: string[] = [];
  const breadcrumbs: CommandBreadcrumb[] = [];
  const ancestorPath: string[] = [];
  const ancestorLabels: string[] = [];
  let currentNode = tree.rootNode;

  for (let i = 0; i < tokensToWalk.length; i++) {
    const token = tokensToWalk[i];
    const children = tree.getNodeChildren(currentNode);
    const matchedChild = children.find((child) => matchesCommandToken(child, token));

    if (!matchedChild) {
      return {
        hasCommands: true,
        normalizedInput,
        completedTokens,
        partialToken: rawTokens.slice(i).join(' '),
        breadcrumbs,
        suggestions: [],
        exactNode: null,
        error: `Unknown command: ${token}`,
      };
    }

    const canonicalCmd = getNodeCommandToken(matchedChild);

    if (!tree.isBranchNode(matchedChild)) {
      const extraTokens = rawTokens.slice(i + 1);
      const hasExtra = extraTokens.length > 0 || partialToken.length > 0;
      if (hasExtra) {
        return {
          hasCommands: true,
          normalizedInput,
          completedTokens: [...completedTokens, canonicalCmd],
          partialToken,
          breadcrumbs,
          suggestions: [],
          exactNode: null,
          error: `Command ':${[...completedTokens, canonicalCmd].join(' ')}' does not take arguments`,
        };
      }
      const exactFlat = toFlatItem(matchedChild, ancestorPath, ancestorLabels, completedTokens, tree);
      return {
        hasCommands: true,
        normalizedInput,
        completedTokens: [...completedTokens, canonicalCmd],
        partialToken: '',
        breadcrumbs,
        suggestions: [exactFlat],
        exactNode: exactFlat,
        error: null,
      };
    }

    completedTokens.push(canonicalCmd);
    breadcrumbs.push({
      value: matchedChild.value,
      label: matchedChild.label,
      command: canonicalCmd,
    });
    ancestorPath.push(matchedChild.value);
    ancestorLabels.push(matchedChild.label);
    currentNode = matchedChild;
  }

  const branchChildren = tree.getNodeChildren(currentNode);
  const branchItems = branchChildren.map((child) =>
    toFlatItem(child, ancestorPath, ancestorLabels, completedTokens, tree),
  );

  if (!partialToken) {
    return {
      hasCommands: true,
      normalizedInput,
      completedTokens,
      partialToken: '',
      breadcrumbs,
      suggestions: branchItems,
      exactNode: null,
      error: null,
    };
  }

  const exactChild = branchItems.find((item) => matchesCommandToken(item.node, partialToken)) ?? null;

  const cmdFzf = new Fzf(branchItems, {
    selector: (item) => item.command,
    tiebreakers: [byLengthAsc],
    casing: 'case-insensitive',
  });
  const cmdHits = new Map<string, { score: number; positions: number[] }>();
  for (const res of cmdFzf.find(partialToken)) {
    cmdHits.set(res.item.value, {
      score: res.score,
      positions: Array.from(res.positions).sort((a, b) => a - b),
    });
  }

  const labelFzf = new Fzf(branchItems, {
    selector: (item) => item.label,
    tiebreakers: [byLengthAsc],
    casing: 'case-insensitive',
  });
  const labelHits = new Map<string, { score: number; positions: number[] }>();
  for (const res of labelFzf.find(partialToken)) {
    labelHits.set(res.item.value, {
      score: res.score,
      positions: Array.from(res.positions).sort((a, b) => a - b),
    });
  }

  const combinedFzf = new Fzf(branchItems, {
    selector: (item) =>
      [item.command, ...item.aliases, item.label, item.description ?? '', ...(item.node.keywords ?? [])].join(' '),
    tiebreakers: [byLengthAsc],
    casing: 'case-insensitive',
  });

  const suggestionMap = new Map<string, CommandFlatItem>();
  for (const res of combinedFzf.find(partialToken)) {
    const cmdHit = cmdHits.get(res.item.value);
    const labelHit = labelHits.get(res.item.value);
    const isExact = exactChild?.value === res.item.value;
    const isPrefix = res.item.command.toLowerCase().startsWith(partialToken.toLowerCase());
    const score = (cmdHit ? cmdHit.score + 50 : res.score) + (isExact ? 500 : 0) + (isPrefix ? 100 : 0);

    suggestionMap.set(res.item.value, {
      ...res.item,
      commandMatchPositions: cmdHit?.positions ?? [],
      matchPositions: labelHit?.positions ?? [],
      score,
    });
  }

  const suggestions = Array.from(suggestionMap.values()).sort((a, b) => {
    const scoreDiff = (b.score ?? 0) - (a.score ?? 0);
    if (scoreDiff !== 0) return scoreDiff;
    return a.command.length - b.command.length;
  });

  const error = suggestions.length === 0 ? `Unknown command: ${[...completedTokens, partialToken].join(' ')}` : null;

  return {
    hasCommands: true,
    normalizedInput,
    completedTokens,
    partialToken,
    breadcrumbs,
    suggestions,
    exactNode: exactChild ? (suggestionMap.get(exactChild.value) ?? exactChild) : null,
    error,
  };
}

export function formatColonCompletionInput(completedTokens: string[], item: CommandFlatItem): string {
  const nextTokens = [...completedTokens, item.command].join(' ');
  return item.isBranch ? `:${nextTokens} ` : `:${nextTokens}`;
}

export function splitHighlightSegments(text: string, matchPositions?: number[]): CommandHighlightSegment[] {
  if (!text) return [];
  if (!matchPositions || matchPositions.length === 0) {
    return [{ text, highlight: false }];
  }

  const posSet = new Set(matchPositions);
  const segments: CommandHighlightSegment[] = [];
  let currentText = '';
  let currentHighlight = posSet.has(0);

  for (let i = 0; i < text.length; i++) {
    const isHighlighted = posSet.has(i);
    if (i > 0 && isHighlighted !== currentHighlight) {
      segments.push({ text: currentText, highlight: currentHighlight });
      currentText = text[i];
      currentHighlight = isHighlighted;
    } else {
      currentText += text[i];
    }
  }

  if (currentText.length > 0) {
    segments.push({ text: currentText, highlight: currentHighlight });
  }

  return segments;
}

let sharedLiveRegion: LiveRegion | null = null;

export function announceCommandMessage(message: string): void {
  if (typeof document === 'undefined' || !message) return;
  try {
    if (!sharedLiveRegion) {
      sharedLiveRegion = createLiveRegion({ level: 'polite', document });
    }
    sharedLiveRegion.announce(message, 150);
  } catch {
    // Ignore live region errors in non-DOM test environments
  }
}

export function matchesCommandHotkey(event: KeyboardEvent, hotkey: string): boolean {
  if (!hotkey) return false;
  try {
    if (matchesKeyboardEvent(event, hotkey as HotkeyChord)) {
      return true;
    }
  } catch {
    // Fallback below
  }
  const normalized = hotkey.trim().toLowerCase();
  if (normalized === 'mod+k' || normalized === 'cmd+k' || normalized === 'ctrl+k') {
    return (event.metaKey || event.ctrlKey) && !event.altKey && event.key.toLowerCase() === 'k';
  }
  return false;
}

export const commandPaletteVariants = cva(
  'flex w-full flex-col overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-2xl outline-none',
  {
    variants: {
      size: {
        sm: 'max-w-md',
        md: 'max-w-xl',
        lg: 'max-w-2xl',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export type CommandPaletteVariants = VariantProps<typeof commandPaletteVariants>;

export const commandPaletteDialogContentBase = 'top-[16%] translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-xl';

export const commandPaletteHeaderBase = 'flex items-center gap-2 border-b border-border px-3 py-2.5';

export const commandPaletteBreadcrumbBase =
  'inline-flex shrink-0 items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground';

export const commandPaletteInputBase =
  'flex-1 border-0 bg-transparent px-1 py-0.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-0';

export const commandPaletteListBase = 'max-h-80 overflow-y-auto p-1.5 outline-none';

export const commandPaletteItemBase =
  'group relative flex w-full cursor-pointer select-none items-center justify-between gap-3 rounded-lg px-2.5 py-2 text-sm outline-none transition-colors data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50';

export const commandPaletteFooterBase =
  'flex flex-wrap items-center justify-between gap-2 border-t border-border bg-muted/30 px-3 py-2 text-[11px] text-muted-foreground';

export const colonCommandVariants = cva(
  'flex w-full flex-col overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-2xl outline-none font-mono',
  {
    variants: {
      placement: {
        bottom: 'max-w-3xl',
        center: 'max-w-xl',
        top: 'max-w-2xl',
      },
      size: {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
      },
    },
    defaultVariants: {
      placement: 'bottom',
      size: 'md',
    },
  },
);

export type ColonCommandVariants = VariantProps<typeof colonCommandVariants>;

export const colonCommandDialogPositionerVariants = cva('', {
  variants: {
    placement: {
      bottom: 'top-auto bottom-4 translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-3xl',
      center: 'top-[22%] translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-xl',
      top: 'top-6 translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-2xl',
    },
  },
  defaultVariants: {
    placement: 'bottom',
  },
});

export const colonCommandListBase = 'max-h-64 overflow-y-auto border-b border-border bg-popover/95 p-1.5 outline-none';

export const colonCommandItemBase =
  'group relative flex w-full cursor-pointer select-none items-center justify-between gap-3 rounded-md px-2.5 py-1.5 font-mono text-xs outline-none transition-colors data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50';

export const colonCommandPromptBarBase = 'flex items-center gap-1.5 bg-muted/40 px-3 py-2 font-mono';

export const colonCommandPrefixBase = 'select-none font-mono font-bold text-primary';

export const colonCommandInputBase =
  'flex-1 border-0 bg-transparent px-1 py-0.5 font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-0';

export const colonCommandErrorBase =
  'flex items-center justify-between gap-2 border-t border-destructive/30 bg-destructive/10 px-3 py-1.5 font-mono text-xs text-destructive';
