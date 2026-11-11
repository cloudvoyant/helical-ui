// libs/helical-ui/src/command/core.ts

// 1. Imports
import { matchesKeyboardEvent, type HotkeyChord } from '@tanstack/hotkeys';
import { TreeCollection } from '@zag-js/collection';
import { createFilter } from '@zag-js/i18n-utils';
import { createLiveRegion, type LiveRegion } from '@zag-js/live-region';
import { Fzf, byLengthAsc } from 'fzf';
import type {
  CommandBreadcrumb,
  CommandFlatItem,
  CommandHighlightSegment,
  CommandLevelResolution,
  CommandMenuColumns,
  CommandMenuResolution,
  CommandNode,
} from './types';

// 2. Module constants & types
const ROOT_NODE_VALUE = '__root__';
const DEFAULT_GROUP_LABEL = 'Commands';

const i18nFilter = createFilter({ sensitivity: 'base' });

let sharedLiveRegion: LiveRegion | null = null;

// 3. Local helpers
function getNodeCommandToken(node: CommandNode): string {
  return (node.command ?? node.value).trim();
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!target || typeof target !== 'object') return false;
  const el = target as HTMLElement;
  if (el.isContentEditable) return true;
  const tag = el.tagName?.toLowerCase();
  if (tag === 'input' || tag === 'textarea' || tag === 'select') return true;
  if (typeof el.closest === 'function' && el.closest('[contenteditable="true"], .ProseMirror')) {
    return true;
  }
  return false;
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

// 4. Exported functions
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

export function resolveCommandMenuState(
  tree: TreeCollection<CommandNode>,
  rawInput: string = '',
): CommandMenuResolution {
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

export const resolveColonCommandState = resolveCommandMenuState;

export function formatCommandMenuCompletionInput(
  completedTokens: string[],
  item: CommandFlatItem,
  appendBranchSpace = true,
): string {
  const nextTokens = [...completedTokens, item.command].join(' ');
  return item.isBranch && appendBranchSpace ? `:${nextTokens} ` : `:${nextTokens}`;
}

export const formatColonCompletionInput = formatCommandMenuCompletionInput;

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
  const trimmed = hotkey.trim();
  if (trimmed === ':') {
    if (isEditableTarget(event.target)) return false;
    return !event.metaKey && !event.ctrlKey && !event.altKey && event.key === ':';
  }
  try {
    if (matchesKeyboardEvent(event, hotkey as HotkeyChord)) {
      return true;
    }
  } catch {
    // Fallback below
  }
  const normalized = trimmed.toLowerCase();
  if (normalized === 'mod+k' || normalized === 'cmd+k' || normalized === 'ctrl+k') {
    return (event.metaKey || event.ctrlKey) && !event.altKey && event.key.toLowerCase() === 'k';
  }
  return false;
}

function isHotkeyAnchorVisible(el: HTMLElement): boolean {
  if (el.closest('[hidden]')) return false;
  const fwWrapper = el.closest<HTMLElement>('[data-fw]');
  const activeFw = el.ownerDocument?.documentElement?.getAttribute('data-framework');
  if (fwWrapper && activeFw && fwWrapper.getAttribute('data-fw') !== activeFw) {
    return false;
  }
  return true;
}

export function shouldHandleCommandHotkey(anchorEl: HTMLElement | null, selector: string): boolean {
  if (!anchorEl || typeof document === 'undefined') return true;
  if (!isHotkeyAnchorVisible(anchorEl)) return false;
  const myPreview = anchorEl.closest('[data-example-preview]');
  const activePreview = document.activeElement?.closest?.('[data-example-preview]') ?? null;
  if (activePreview) {
    return myPreview === activePreview;
  }
  if (myPreview) {
    const previewAnchors = Array.from(
      document.querySelectorAll<HTMLElement>(`[data-example-preview] ${selector}`),
    ).filter(isHotkeyAnchorVisible);
    return previewAnchors[0] === anchorEl;
  }
  return true;
}

export function resolveCommandMenuGridStyle(
  columns: CommandMenuColumns = 'auto',
  itemCount: number,
):
  | {
      display: 'grid';
      gridAutoFlow: 'column';
      gridTemplateRows: string;
      gridTemplateColumns: string;
    }
  | undefined {
  if (columns === 1 || itemCount <= 0) {
    return undefined;
  }
  const maxCols = columns === 'auto' ? (itemCount <= 6 ? 2 : itemCount <= 12 ? 3 : 4) : columns;
  const colCount = Math.max(1, Math.min(maxCols, itemCount));
  const rowCount = Math.max(1, Math.ceil(itemCount / colCount));
  return {
    display: 'grid',
    gridAutoFlow: 'column',
    gridTemplateRows: `repeat(${rowCount}, minmax(0, auto))`,
    gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))`,
  };
}

export const resolveColonCommandGridStyle = resolveCommandMenuGridStyle;

export function resolveCommandMenuGridNavigation(
  columns: CommandMenuColumns = 'auto',
  itemCount: number,
  currentIdx: number,
  key: 'ArrowDown' | 'ArrowUp' | 'ArrowRight' | 'ArrowLeft',
): number {
  if (itemCount <= 0) return -1;
  const safeIdx = currentIdx >= 0 && currentIdx < itemCount ? currentIdx : 0;
  if (key === 'ArrowDown') {
    return (safeIdx + 1) % itemCount;
  }
  if (key === 'ArrowUp') {
    return (safeIdx - 1 + itemCount) % itemCount;
  }
  if (columns === 1) {
    return safeIdx;
  }
  const maxCols = columns === 'auto' ? (itemCount <= 6 ? 2 : itemCount <= 12 ? 3 : 4) : columns;
  const colCount = Math.max(1, Math.min(maxCols, itemCount));
  const rowCount = Math.max(1, Math.ceil(itemCount / colCount));
  const totalCols = Math.max(1, Math.ceil(itemCount / rowCount));
  const row = safeIdx % rowCount;
  const col = Math.floor(safeIdx / rowCount);
  const nextCol = key === 'ArrowRight' ? (col + 1) % totalCols : (col - 1 + totalCols) % totalCols;
  return Math.min(nextCol * rowCount + row, itemCount - 1);
}

export const resolveColonCommandGridNavigation = resolveCommandMenuGridNavigation;

export function captureCommandFocusTarget(rootEl: HTMLElement | null): HTMLElement | null {
  if (typeof document === 'undefined') return null;
  const active = document.activeElement;
  if (
    active &&
    typeof (active as HTMLElement).focus === 'function' &&
    active !== document.body &&
    active !== document.documentElement &&
    (!rootEl || !rootEl.contains(active))
  ) {
    return active as HTMLElement;
  }
  return null;
}

export function restoreCommandFocusTarget(target: HTMLElement | null): void {
  if (typeof document === 'undefined' || !target) return;
  if (target.isConnected && target !== document.body && target !== document.documentElement) {
    target.focus({ preventScroll: true });
  }
}

export function finalizeCommandSelectFocus(rootEl: HTMLElement | null, restoreTarget: HTMLElement | null): void {
  const customFocusTarget = captureCommandFocusTarget(rootEl);
  if (customFocusTarget) {
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(() => {
        if (customFocusTarget.isConnected && document.activeElement !== customFocusTarget) {
          customFocusTarget.focus({ preventScroll: true });
        }
      });
    }
    return;
  }
  restoreCommandFocusTarget(restoreTarget);
}
