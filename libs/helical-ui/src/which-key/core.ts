// libs/helical-ui/src/which-key/core.ts
export type KeybindingPreset = 'helix' | 'vim' | 'kakoune';
export type KeymapMode = 'normal' | 'select' | 'insert' | 'jump';
export type WhichKeyVariant = 'helix' | 'modern' | 'classic';
export type JumpAction = 'focus' | 'activate';
export type PaneDirection = 'left' | 'down' | 'up' | 'right';

export interface KeymapCommandContext {
  count: number;
  mode: KeymapMode;
  preset: KeybindingPreset;
  activePaneId: string | null;
  event?: KeyboardEvent;
}

export type KeymapHandler = (ctx: KeymapCommandContext) => void | boolean;

export interface WhichKeyNode {
  key: string;
  label: string;
  description?: string;
  category?: string;
  group?: string;
  icon?: string;
  mode?: KeymapMode | KeymapMode[];
  when?: (ctx: KeymapCommandContext) => boolean;
  sticky?: boolean;
  loop?: boolean;
  proxy?: string[];
  commandId?: string;
  action?: KeymapHandler;
  children?: Record<string, WhichKeyNode>;
  expand?: () => Record<string, WhichKeyNode>;
  hidden?: boolean;
}

export interface KeymapExplorerEntry {
  id: string;
  chords: string[];
  sequenceText: string;
  label: string;
  description?: string;
  group: string;
  category: string;
  mode: KeymapMode[];
  commandId?: string;
  action?: KeymapHandler;
}

export interface PaneRect {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  disabled?: boolean;
  order?: number;
}

export interface JumplistEntry {
  paneId: string;
  elementSelector?: string;
  element?: HTMLElement | null;
  scrollTop?: number;
  timestamp: number;
}

export interface WhichKeyTreeResult {
  node: WhichKeyNode | null;
  items: WhichKeyNode[];
  title: string;
  breadcrumb: string[];
  sticky: boolean;
}

export const DEFAULT_JUMP_ALPHABET = 'asdfghjklqwertyuiopzxcvbnm';

export function nodeMatchesMode(node: WhichKeyNode, mode?: KeymapMode): boolean {
  if (!mode || !node.mode) return true;
  if (Array.isArray(node.mode)) {
    return node.mode.includes(mode);
  }
  return node.mode === mode;
}

export function nodeExplicitlyIncludesMode(node: WhichKeyNode, mode: KeymapMode): boolean {
  if (!node.mode) return false;
  if (Array.isArray(node.mode)) {
    return node.mode.includes(mode);
  }
  return node.mode === mode;
}

export function normalizeNodeModes(node: WhichKeyNode): KeymapMode[] {
  if (!node.mode) return ['normal'];
  return Array.isArray(node.mode) ? node.mode : [node.mode];
}

export function getNodeChildren(
  node: WhichKeyNode,
  rootTrie: Record<string, WhichKeyNode>,
  visitedProxies: Set<string> = new Set(),
): Record<string, WhichKeyNode> {
  let proxyChildren: Record<string, WhichKeyNode> = {};
  if (node.proxy && node.proxy.length > 0) {
    const proxyKey = node.proxy.join('>');
    if (!visitedProxies.has(proxyKey)) {
      const nextVisited = new Set(visitedProxies);
      nextVisited.add(proxyKey);
      const target = resolveNodeInternal(rootTrie, node.proxy, undefined, nextVisited, rootTrie);
      if (target) {
        proxyChildren = getNodeChildren(target, rootTrie, nextVisited);
      }
    }
  }
  const expandedChildren = node.expand ? node.expand() : {};
  return {
    ...proxyChildren,
    ...expandedChildren,
    ...(node.children ?? {}),
  };
}

function resolveNodeInternal(
  rootTrie: Record<string, WhichKeyNode>,
  path: string[],
  mode: KeymapMode | undefined,
  visitedProxies: Set<string>,
  proxyRootTrie: Record<string, WhichKeyNode> = rootTrie,
): WhichKeyNode | null {
  if (path.length === 0) return null;
  let currentMap: Record<string, WhichKeyNode> = rootTrie;
  let currentNode: WhichKeyNode | null = null;

  for (let i = 0; i < path.length; i += 1) {
    const step = path[i];
    if (!step) return null;
    const candidate: WhichKeyNode | undefined = currentMap[step];
    if (!candidate) return null;
    if (mode && !nodeMatchesMode(candidate, mode)) return null;
    currentNode = candidate;
    if (i < path.length - 1) {
      currentMap = getNodeChildren(candidate, proxyRootTrie, visitedProxies);
    }
  }

  return currentNode;
}

export function resolveNode(
  rootTrie: Record<string, WhichKeyNode>,
  path: string[],
  mode?: KeymapMode,
  proxyRootTrie: Record<string, WhichKeyNode> = rootTrie,
): WhichKeyNode | null {
  return resolveNodeInternal(rootTrie, path, mode, new Set(), proxyRootTrie);
}

export function isGroupNode(node: WhichKeyNode, rootTrie: Record<string, WhichKeyNode>): boolean {
  const children = getNodeChildren(node, rootTrie);
  return Object.keys(children).length > 0;
}

export function formatWhichKeyLabel(label: string): string {
  const trimmed = label.trim();
  if (!trimmed.startsWith('+')) return trimmed;
  const withoutPlus = trimmed.slice(1).trim();
  if (!withoutPlus) return trimmed;
  if (withoutPlus.toLowerCase() === 'goto') return 'Go to';
  return withoutPlus.charAt(0).toUpperCase() + withoutPlus.slice(1);
}

export function buildWhichKeyTree(
  rootTrie: Record<string, WhichKeyNode>,
  activePath: string[],
  mode?: KeymapMode,
): WhichKeyTreeResult {
  if (activePath.length === 0) {
    const items = Object.values(rootTrie).filter((item) => !item.hidden && nodeMatchesMode(item, mode));
    return {
      node: null,
      items,
      title: 'Commands',
      breadcrumb: [],
      sticky: false,
    };
  }

  const node = resolveNode(rootTrie, activePath, mode);
  if (!node) {
    return {
      node: null,
      items: [],
      title: '',
      breadcrumb: activePath,
      sticky: false,
    };
  }

  const childrenMap = getNodeChildren(node, rootTrie);
  const items = Object.values(childrenMap).filter((item) => !item.hidden && nodeMatchesMode(item, mode));

  let sticky = Boolean(node.sticky || node.loop);
  if (!sticky && node.proxy && node.proxy.length > 0) {
    const target = resolveNode(rootTrie, node.proxy, mode);
    if (target) {
      sticky = Boolean(target.sticky || target.loop);
    }
  }

  return {
    node,
    items,
    title: node.group ?? node.label,
    breadcrumb: [...activePath],
    sticky,
  };
}

export function flattenKeymapEntries(rootTrie: Record<string, WhichKeyNode>, mode?: KeymapMode): KeymapExplorerEntry[] {
  const entries: KeymapExplorerEntry[] = [];
  const seenIds = new Set<string>();

  function walk(map: Record<string, WhichKeyNode>, chords: string[], groupPath: string[], visitedProxies: Set<string>) {
    for (const [key, node] of Object.entries(map)) {
      if (node.hidden) continue;
      if (mode && !nodeMatchesMode(node, mode)) continue;

      const nextChords = [...chords, node.key || key];
      const children = getNodeChildren(node, rootTrie, visitedProxies);
      const childKeys = Object.keys(children);

      if (childKeys.length > 0) {
        const groupTitle = node.group ?? node.label.replace(/^\+/, '');
        const nextGroupPath = [...groupPath, groupTitle];
        const nextVisited = new Set(visitedProxies);
        if (node.proxy && node.proxy.length > 0) {
          nextVisited.add(node.proxy.join('>'));
        }
        walk(children, nextChords, nextGroupPath, nextVisited);
      }

      if (node.commandId || node.action || childKeys.length === 0) {
        if (childKeys.length > 0 && !node.commandId && !node.action) {
          continue;
        }
        const sequenceText = nextChords.join(' ');
        const category = node.category ?? (groupPath.length > 0 ? groupPath[0]! : 'General');
        const group = groupPath.length > 0 ? groupPath.join(' / ') : category;
        const id = `${sequenceText}::${node.commandId ?? node.label}`;
        if (seenIds.has(id)) continue;
        seenIds.add(id);

        entries.push({
          id,
          chords: nextChords,
          sequenceText,
          label: node.label,
          description: node.description ?? node.label,
          group,
          category,
          mode: normalizeNodeModes(node),
          commandId: node.commandId,
          action: node.action,
        });
      }
    }
  }

  walk(rootTrie, [], [], new Set());
  return entries;
}

export function findDirectionalPane(
  origin: PaneRect,
  candidates: PaneRect[],
  direction: PaneDirection,
): PaneRect | null {
  const originCenterX = origin.x + origin.width / 2;
  const originCenterY = origin.y + origin.height / 2;

  let bestCandidate: PaneRect | null = null;
  let bestScore = Number.POSITIVE_INFINITY;

  for (const candidate of candidates) {
    if (candidate.disabled || candidate.id === origin.id) continue;
    if (candidate.width <= 0 || candidate.height <= 0) continue;

    const centerX = candidate.x + candidate.width / 2;
    const centerY = candidate.y + candidate.height / 2;
    const dx = centerX - originCenterX;
    const dy = centerY - originCenterY;

    const gapX = Math.max(
      0,
      Math.max(origin.x, candidate.x) - Math.min(origin.x + origin.width, candidate.x + candidate.width),
    );
    const gapY = Math.max(
      0,
      Math.max(origin.y, candidate.y) - Math.min(origin.y + origin.height, candidate.y + candidate.height),
    );

    let primaryDist = 0;
    let orthogonalDist = 0;

    switch (direction) {
      case 'left':
        if (dx >= -1) continue;
        primaryDist = -dx;
        orthogonalDist = gapY;
        break;
      case 'right':
        if (dx <= 1) continue;
        primaryDist = dx;
        orthogonalDist = gapY;
        break;
      case 'up':
        if (dy >= -1) continue;
        primaryDist = -dy;
        orthogonalDist = gapX;
        break;
      case 'down':
        if (dy <= 1) continue;
        primaryDist = dy;
        orthogonalDist = gapX;
        break;
    }

    // Weight orthogonal interval gap higher so aligned/overlapping panes in the target direction
    // win over diagonal panes, while primary distance selects the immediately adjacent pane.
    const euclidean = Math.hypot(dx, dy);
    const score = primaryDist + orthogonalDist * 2 + euclidean * 0.01;
    if (score < bestScore) {
      bestScore = score;
      bestCandidate = candidate;
    }
  }

  return bestCandidate;
}

export function generateJumpLabels(count: number, alphabet: string = DEFAULT_JUMP_ALPHABET): string[] {
  if (count <= 0) return [];
  const chars = Array.from(new Set(alphabet.split('').filter(Boolean)));
  const n = chars.length;
  if (n === 0) return [];
  if (n === 1) {
    return Array.from({ length: count }, (_, idx) => chars[0]!.repeat(idx + 1));
  }

  if (count <= n) {
    return chars.slice(0, count);
  }

  // Expand a prefix-free tree (leaves only) in breadth-first home-row order until we have >= count leaves.
  const queue: string[] = [...chars];
  while (queue.length < count) {
    const prefix = queue.shift()!;
    for (const ch of chars) {
      queue.push(prefix + ch);
      if (queue.length + (chars.length - 1) >= count && queue.length >= count) {
        break;
      }
    }
  }

  return queue.slice(0, count);
}

export class Jumplist {
  private stack: JumplistEntry[] = [];
  private index = -1;
  private readonly maxSize: number;

  constructor(maxSize = 50) {
    this.maxSize = Math.max(2, maxSize);
  }

  push(entry: Omit<JumplistEntry, 'timestamp'> & { timestamp?: number }): void {
    const current = this.stack[this.index];
    if (
      current &&
      current.paneId === entry.paneId &&
      current.element === entry.element &&
      current.elementSelector === entry.elementSelector
    ) {
      return;
    }

    // Truncate forward history when pushing from an intermediate position
    if (this.index < this.stack.length - 1) {
      this.stack = this.stack.slice(0, this.index + 1);
    }

    this.stack.push({
      ...entry,
      timestamp: entry.timestamp ?? Date.now(),
    });

    if (this.stack.length > this.maxSize) {
      this.stack.shift();
    }
    this.index = this.stack.length - 1;
  }

  back(current?: Omit<JumplistEntry, 'timestamp'>): JumplistEntry | null {
    if (this.stack.length === 0) return null;

    // If at the tip and caller supplies the current location that isn't recorded yet, record it first
    // so Ctrl-i can return to where the user jumped back from.
    if (current && this.index === this.stack.length - 1) {
      const tip = this.stack[this.index];
      if (
        !tip ||
        tip.paneId !== current.paneId ||
        tip.element !== current.element ||
        tip.elementSelector !== current.elementSelector
      ) {
        this.push(current);
      }
    }

    if (this.index <= 0) {
      return null;
    }

    this.index -= 1;
    return this.stack[this.index] ?? null;
  }

  forward(): JumplistEntry | null {
    if (this.index < 0 || this.index >= this.stack.length - 1) {
      return null;
    }
    this.index += 1;
    return this.stack[this.index] ?? null;
  }

  entries(): readonly JumplistEntry[] {
    return this.stack;
  }

  currentIndex(): number {
    return this.index;
  }

  clear(): void {
    this.stack = [];
    this.index = -1;
  }
}

export function createJumplist(maxSize = 50): Jumplist {
  return new Jumplist(maxSize);
}
