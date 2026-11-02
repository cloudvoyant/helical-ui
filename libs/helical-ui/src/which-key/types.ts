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
} from '@cloudvoyant/utils';

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
} from '@cloudvoyant/utils';

export type ModalMotion =
  | 'left'
  | 'down'
  | 'up'
  | 'right'
  | 'wordForward'
  | 'wordBackward'
  | 'wordEnd'
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
  ): { enterInsert?: boolean } | boolean;
  setModalState(state: { mode: KeymapMode; preset: KeybindingPreset }): void;
  hasActiveSuggestion?(): boolean;
}

const modalEditorRegistry = new WeakMap<Element, ModalEditorTarget>();
const activeModalEditors = new Set<ModalEditorTarget>();

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

export interface WhichKeyControllerOptions {
  preset?: KeybindingPreset;
  defaultMode?: KeymapMode;
  leaderKey?: string;
  jumpAction?: JumpAction;
  jumpAlphabet?: string;
  keymap?: Record<string, WhichKeyNode>;
  commands?: Record<string, KeymapHandler>;
  enabled?: boolean;
  getDocument?: () => Document;
  getScopeElement?: () => HTMLElement | null;
  onPresetChange?: (preset: KeybindingPreset) => void;
  onModeChange?: (mode: KeymapMode) => void;
  onCommand?: (commandId: string, ctx: KeymapCommandContext) => void;
}

export interface WhichKeyController {
  getState(): WhichKeyState;
  subscribe(listener: (state: WhichKeyState) => void): () => void;
  attach(target?: Document | HTMLElement): () => void;
  destroy(): void;
  handleKeyDown(event: KeyboardEvent): boolean;
  setPreset(preset: KeybindingPreset): void;
  setMode(mode: KeymapMode): void;
  setJumpAction(action: JumpAction): void;
  openPrefix(path: string[], options?: { sticky?: boolean }): void;
  closePrefix(): void;
  stepBackPrefix(): boolean;
  triggerKey(key: string): boolean;
  openExplorer(): void;
  closeExplorer(): void;
  setExplorerQuery(query: string): void;
  executeExplorerEntry(entry: KeymapExplorerEntry | string): boolean;
  registerKeymap(
    id: string,
    nodes: Record<string, WhichKeyNode>,
    options?: { scope?: string; enabled?: boolean },
  ): () => void;
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
  showModeBadge?: boolean;
  showExplorer?: boolean;
  className?: string;
}

export interface WhichKeyExplorerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  placeholder?: string;
  className?: string;
}

export interface PaneProps {
  paneId?: string;
  paneTitle?: string;
  paneDisabled?: boolean;
  paneOrder?: number;
  className?: string;
}
