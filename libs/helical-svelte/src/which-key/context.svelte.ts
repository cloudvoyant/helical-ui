// libs/helical-svelte/src/which-key/context.svelte.ts
import { getContext, hasContext, setContext } from 'svelte';
import {
  type JumpAction,
  type KeybindingPreset,
  type KeymapCommandContext,
  type KeymapMode,
  type WhichKeyController,
  type WhichKeyNode,
  type WhichKeyState,
} from '@cloudvoyant/helical-ui';

export const WHICH_KEY_CONTEXT_KEY = Symbol('helical-ui.which-key');

export interface ReactiveWhichKeyContext {
  readonly controller: WhichKeyController;
  readonly state: WhichKeyState;
}

export function setWhichKeyContext(ctx: ReactiveWhichKeyContext) {
  setContext(WHICH_KEY_CONTEXT_KEY, ctx);
}

export function getOptionalWhichKeyContext(): ReactiveWhichKeyContext | null {
  if (!hasContext(WHICH_KEY_CONTEXT_KEY)) return null;
  return getContext<ReactiveWhichKeyContext>(WHICH_KEY_CONTEXT_KEY) ?? null;
}

export function useOptionalWhichKeyController(): WhichKeyController | null {
  return getOptionalWhichKeyContext()?.controller ?? null;
}

export function useWhichKeyController(): WhichKeyController {
  const controller = useOptionalWhichKeyController();
  if (!controller) {
    throw new Error('useWhichKey must be used within a <WhichKeyProvider>.');
  }
  return controller;
}

export interface UseWhichKeyReturn extends WhichKeyState {
  readonly state: WhichKeyState;
  readonly controller: WhichKeyController;
  setPreset: (preset: KeybindingPreset) => void;
  setMode: (mode: KeymapMode) => void;
  setLeaderOnly: (leaderOnly: boolean) => void;
  setJumpAction: (action: JumpAction) => void;
  openExplorer: () => void;
  closeExplorer: () => void;
  setExplorerQuery: (query: string) => void;
  openPrefix: (path: string[], options?: { sticky?: boolean }) => void;
  closePrefix: () => void;
  stepBackPrefix: () => boolean;
  triggerKey: (key: string) => boolean;
  focusPane: (paneIdOrIndex: string | number) => boolean;
  startJumpMode: (action?: JumpAction) => void;
  cancelJumpMode: () => void;
  jumpBack: () => boolean;
  jumpForward: () => boolean;
  executeCommand: (commandId: string, partialCtx?: Partial<KeymapCommandContext>) => boolean;
}

export function useWhichKey(): UseWhichKeyReturn {
  const ctx = getOptionalWhichKeyContext();
  if (!ctx) {
    throw new Error('useWhichKey must be used within a <WhichKeyProvider>.');
  }
  const { controller } = ctx;
  return {
    get state() {
      return ctx.state;
    },
    get preset() {
      return ctx.state.preset;
    },
    get mode() {
      return ctx.state.mode;
    },
    get leaderKey() {
      return ctx.state.leaderKey;
    },
    get leaderOnly() {
      return ctx.state.leaderOnly;
    },
    get activePath() {
      return ctx.state.activePath;
    },
    get breadcrumb() {
      return ctx.state.breadcrumb;
    },
    get title() {
      return ctx.state.title;
    },
    get items() {
      return ctx.state.items;
    },
    get isOpen() {
      return ctx.state.isOpen;
    },
    get sticky() {
      return ctx.state.sticky;
    },
    get countBuffer() {
      return ctx.state.countBuffer;
    },
    get explorerOpen() {
      return ctx.state.explorerOpen;
    },
    get explorerQuery() {
      return ctx.state.explorerQuery;
    },
    get explorerEntries() {
      return ctx.state.explorerEntries;
    },
    get panes() {
      return ctx.state.panes;
    },
    get activePaneId() {
      return ctx.state.activePaneId;
    },
    get jumpQuery() {
      return ctx.state.jumpQuery;
    },
    get jumpAction() {
      return ctx.state.jumpAction;
    },
    get jumpTargets() {
      return ctx.state.jumpTargets;
    },
    get statusMessage() {
      return ctx.state.statusMessage;
    },
    get controller() {
      return controller;
    },
    setPreset: controller.setPreset,
    setMode: controller.setMode,
    setLeaderOnly: controller.setLeaderOnly,
    setJumpAction: controller.setJumpAction,
    openExplorer: controller.openExplorer,
    closeExplorer: controller.closeExplorer,
    setExplorerQuery: controller.setExplorerQuery,
    openPrefix: controller.openPrefix,
    closePrefix: controller.closePrefix,
    stepBackPrefix: controller.stepBackPrefix,
    triggerKey: controller.triggerKey,
    focusPane: controller.focusPane,
    startJumpMode: controller.startJumpMode,
    cancelJumpMode: controller.cancelJumpMode,
    jumpBack: controller.jumpBack,
    jumpForward: controller.jumpForward,
    executeCommand: controller.executeCommand,
  };
}

let keymapCounter = 0;

export function useKeymap(nodes: Record<string, WhichKeyNode>, options?: { scope?: string; enabled?: boolean }): void {
  const ctx = getOptionalWhichKeyContext();
  const layerId = `svelte-keymap-${++keymapCounter}`;
  $effect(() => {
    if (!ctx || options?.enabled === false) return;
    return ctx.controller.registerKeymap(layerId, nodes, options);
  });
}

export function useKeymapScope(scopeId: string, nodes: Record<string, WhichKeyNode>, enabled = true): void {
  useKeymap(nodes, { scope: scopeId, enabled });
}

export interface UsePaneRegistrationOptions {
  paneId?: string;
  paneTitle?: string;
  paneDisabled?: boolean;
  paneOrder?: number;
  defaultTitle: string;
}

export interface UsePaneRegistrationResult {
  readonly paneId: string;
  readonly isActive: boolean;
  readonly dataAttributes: {
    'data-pane-id'?: string;
    'data-pane-title'?: string;
    'data-pane-order'?: string;
    'data-pane-active'?: 'true' | 'false';
  };
}

let autoPaneCounter = 0;

export function useOptionalPaneRegistration(
  getElement: () => HTMLElement | null | undefined,
  getOptions: () => UsePaneRegistrationOptions,
): UsePaneRegistrationResult {
  const ctx = getOptionalWhichKeyContext();
  const fallbackId = `pane-svelte-${++autoPaneCounter}`;

  $effect(() => {
    const el = getElement();
    const opts = getOptions();
    if (!ctx || opts.paneDisabled || !el) return;
    const resolvedId = opts.paneId ?? fallbackId;
    const resolvedTitle = opts.paneTitle ?? opts.defaultTitle;
    return ctx.controller.registerPane({
      id: resolvedId,
      title: resolvedTitle,
      element: el,
      disabled: opts.paneDisabled,
      order: opts.paneOrder,
    });
  });

  return {
    get paneId() {
      return getOptions().paneId ?? fallbackId;
    },
    get isActive() {
      const opts = getOptions();
      if (!ctx || opts.paneDisabled) return false;
      const resolvedId = opts.paneId ?? fallbackId;
      return ctx.state.activePaneId === resolvedId;
    },
    get dataAttributes(): {
      'data-pane-id'?: string;
      'data-pane-title'?: string;
      'data-pane-order'?: string;
      'data-pane-active'?: 'true' | 'false';
    } {
      const opts = getOptions();
      if (opts.paneDisabled) return {};
      const resolvedId = opts.paneId ?? fallbackId;
      const resolvedTitle = opts.paneTitle ?? opts.defaultTitle;
      if (!ctx) {
        return opts.paneId
          ? {
              'data-pane-id': opts.paneId,
              'data-pane-title': resolvedTitle,
              ...(opts.paneOrder !== undefined ? { 'data-pane-order': String(opts.paneOrder) } : {}),
            }
          : {};
      }
      const isActive = ctx.state.activePaneId === resolvedId;
      return {
        'data-pane-id': resolvedId,
        'data-pane-title': resolvedTitle,
        ...(opts.paneOrder !== undefined ? { 'data-pane-order': String(opts.paneOrder) } : {}),
        'data-pane-active': isActive ? 'true' : 'false',
      };
    },
  };
}

export type { JumpAction, KeybindingPreset, KeymapCommandContext, KeymapMode, WhichKeyNode, WhichKeyState };
