// libs/helical-ui/src/which-key/types.ts
import type {
  JumpAction,
  KeybindingPreset,
  KeymapCommandContext,
  KeymapExplorerEntry,
  KeymapHandler,
  KeymapMode,
  PaneDirection,
  WhichKeyNode,
  WhichKeyVariant,
} from './core';

export type {
  JumpAction,
  JumplistEntry,
  KeybindingPreset,
  KeymapCommandContext,
  KeymapExplorerEntry,
  KeymapHandler,
  KeymapMode,
  PaneDirection,
  PaneRect,
  WhichKeyNode,
  WhichKeyTreeResult,
  WhichKeyVariant,
} from './core';

export type ModalMotion =
  | 'left'
  | 'down'
  | 'up'
  | 'right'
  | 'wordForward'
  | 'wordBackward'
  | 'wordEnd'
  | 'paragraphForward'
  | 'paragraphBackward'
  | 'lineSelect'
  | 'lineStart'
  | 'lineEnd'
  | 'docStart'
  | 'docEnd';

export type ModalTextObjectSpec = 'iw' | 'aw' | 'ip' | 'ap' | 'ic' | 'ac' | 'in' | 'an' | 'il' | 'al';

export type ModalSelectionTransform = 'collapse' | 'flip' | 'addCursorBelow' | 'addCursorAbove' | 'keepPrimary';

export type ModalOperator =
  | 'delete'
  | 'change'
  | 'yank'
  | 'pasteAfter'
  | 'pasteBefore'
  | 'undo'
  | 'redo'
  | 'insertStart'
  | 'appendEnd'
  | 'openBelow'
  | 'openAbove';

/**
 * Inverted seam implemented by `ModalKeymap` in `libs/helical-ui/src/editor/extensions/modal-keymap.ts`
 * (and by any future standalone editor package) without coupling `which-key` to `@tiptap/*`.
 */
export interface ModalEditorTarget {
  move(motion: ModalMotion, options: { preset: KeybindingPreset; mode: KeymapMode; count: number }): boolean;
  selectTextObject(spec: ModalTextObjectSpec, options: { preset: KeybindingPreset; mode: KeymapMode }): boolean;
  transformSelection(action: ModalSelectionTransform): boolean;
  execOperator(
    op: ModalOperator,
    options: { preset: KeybindingPreset; mode: KeymapMode; count: number },
  ): { enterInsert?: boolean; yankedText?: string } | boolean;
  setModalState(state: { mode: KeymapMode; preset: KeybindingPreset }): void;
  hasActiveSuggestion?(): boolean;
}

const globalModalState = globalThis as typeof globalThis & {
  __helicalModalEditorRegistry__?: WeakMap<Element, ModalEditorTarget>;
  __helicalActiveModalEditors__?: Set<ModalEditorTarget>;
};

const modalEditorRegistry = (globalModalState.__helicalModalEditorRegistry__ ??= new WeakMap<
  Element,
  ModalEditorTarget
>());
const activeModalEditors = (globalModalState.__helicalActiveModalEditors__ ??= new Set<ModalEditorTarget>());

export function registerModalEditor(element: HTMLElement, target: ModalEditorTarget): () => void {
  modalEditorRegistry.set(element, target);
  activeModalEditors.add(target);
  return () => {
    if (modalEditorRegistry.get(element) === target) {
      modalEditorRegistry.delete(element);
    }
    activeModalEditors.delete(target);
  };
}

export function getModalEditor(element: Element | null | undefined): ModalEditorTarget | undefined {
  let curr: Element | null | undefined = element;
  while (curr) {
    const found = modalEditorRegistry.get(curr);
    if (found) return found;
    curr = curr.parentElement;
  }
  return undefined;
}

export function notifyAllModalEditors(state: { mode: KeymapMode; preset: KeybindingPreset }): void {
  for (const target of activeModalEditors) {
    target.setModalState(state);
  }
}

export interface PaneRegistration {
  id: string;
  title: string;
  element: HTMLElement | null;
  disabled?: boolean;
  order?: number;
  lastFocusedElement?: HTMLElement | null;
}

export interface JumpTarget {
  id: string;
  label: string;
  element: HTMLElement;
  rect: { top: number; left: number; width: number; height: number };
  matchedPrefix: string;
  remainingLabel: string;
}

export interface WhichKeyState {
  preset: KeybindingPreset;
  mode: KeymapMode;
  leaderKey: string;
  leaderOnly: boolean;
  activePath: string[];
  breadcrumb: string[];
  title: string;
  items: WhichKeyNode[];
  isOpen: boolean;
  sticky: boolean;
  countBuffer: string;
  explorerOpen: boolean;
  explorerQuery: string;
  explorerEntries: KeymapExplorerEntry[];
  activePaneId: string | null;
  panes: PaneRegistration[];
  jumpQuery: string;
  jumpAction: JumpAction;
  jumpTargets: JumpTarget[];
  statusMessage: string;
}

export type KeymapPriority = 'overlay' | 'widget' | 'extension' | 'editor' | 'pane' | 'global';

export type KeymapNodesInput = Record<string, WhichKeyNode> | (() => Record<string, WhichKeyNode>);

export interface RegisterKeymapOptions {
  scope?: string;
  enabled?: boolean | (() => boolean);
  priority?: KeymapPriority;
  element?: HTMLElement | null | (() => HTMLElement | null);
  matchesTarget?: (target: EventTarget | null, event: KeyboardEvent) => boolean;
}

export interface WhichKeyControllerOptions {
  preset?: KeybindingPreset;
  defaultMode?: KeymapMode;
  leaderKey?: string;
  /**
   * When `true`, the WhichKey popup only opens when the active chord starts with `leaderKey`
   * (e.g. `Space`), while non-leader multi-key chords (`gg`, `ge`, `gw`, `zt`, `zz`) continue
   * to execute without opening the popup.
   * @default false
   */
  leaderOnly?: boolean;
  jumpAction?: JumpAction;
  jumpAlphabet?: string;
  storageKey?: string;
  keymap?: Record<string, WhichKeyNode>;
  commands?: Record<string, KeymapHandler>;
  enabled?: boolean;
  /**
   * Automatically disable WhichKey on mobile / touch-only viewports (`(pointer: coarse)` or `< 768px`).
   * @default true
   */
  disableOnMobile?: boolean;
  getDocument?: () => Document;
  getScopeElement?: () => HTMLElement | null;
  onPresetChange?: (preset: KeybindingPreset) => void;
  onModeChange?: (mode: KeymapMode) => void;
  onLeaderOnlyChange?: (leaderOnly: boolean) => void;
  onJumpActionChange?: (action: JumpAction) => void;
  onCommand?: (commandId: string, ctx: KeymapCommandContext) => void;
  onYank?: (text: string, ctx: KeymapCommandContext) => void;
}

export interface WhichKeyController {
  getState(): WhichKeyState;
  subscribe(listener: (state: WhichKeyState) => void): () => void;
  attach(target?: Document | HTMLElement): () => void;
  destroy(): void;
  handleKeyDown(event: KeyboardEvent): boolean;
  setPreset(preset: KeybindingPreset): void;
  setMode(mode: KeymapMode): void;
  setLeaderOnly(leaderOnly: boolean): void;
  setJumpAction(action: JumpAction): void;
  openPrefix(path: string[], options?: { sticky?: boolean }): void;
  closePrefix(): void;
  stepBackPrefix(): boolean;
  triggerKey(key: string): boolean;
  openExplorer(): void;
  closeExplorer(): void;
  setExplorerQuery(query: string): void;
  executeExplorerEntry(entry: KeymapExplorerEntry | string): boolean;
  registerKeymap(id: string, nodes: KeymapNodesInput, options?: RegisterKeymapOptions): () => void;
  registerCommand(commandId: string, handler: KeymapHandler): () => void;
  executeCommand(commandId: string, partialCtx?: Partial<KeymapCommandContext>): boolean;
  registerPane(pane: {
    id: string;
    title: string;
    element: HTMLElement | null;
    disabled?: boolean;
    order?: number;
  }): () => void;
  focusPane(paneIdOrIndex: string | number): boolean;
  focusPaneDirection(direction: PaneDirection): boolean;
  cyclePane(reverse?: boolean): boolean;
  stepFocusInPane(delta: number): boolean;
  jumpToBoundary(boundary: 'start' | 'end' | 'first-in-group' | 'last-in-group'): boolean;
  scrollActivePane(action: 'center' | 'top' | 'bottom' | 'down' | 'up', count?: number): boolean;
  startJumpMode(action?: JumpAction): void;
  cancelJumpMode(): void;
  jumpBack(): boolean;
  jumpForward(): boolean;
  trackBranchElement(nodeOrFn: HTMLElement | null | (() => HTMLElement | null)): () => void;
}

export interface WhichKeyProps {
  variant?: WhichKeyVariant;
  leaderOnly?: boolean;
  showModeBadge?: boolean;
  showExplorer?: boolean;
  className?: string;
}

export interface WhichKeyModeProps {
  mode?: KeymapMode;
  sticky?: boolean;
  showPreset?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export interface WhichKeyExplorerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  placeholder?: string;
  className?: string;
}

export interface PaneRegistrationProps {
  paneId?: string;
  paneTitle?: string;
  paneDisabled?: boolean;
  paneOrder?: number;
}

export interface PaneProps extends PaneRegistrationProps {
  className?: string;
}
